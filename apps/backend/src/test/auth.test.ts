import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import { User } from "../models/user";
import { MongoMemoryServer } from 'mongodb-memory-server';
import Tokens from "../controllers/tokens";
import { StatusCodes } from "http-status-codes";


let app: Express;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.DATABASE_URL = mongoServer.getUri();
  app = await initApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const baseUrl = "/auth";

type TestUser = User & { accessToken?: string };

const testUser: TestUser = {
  email: "test@user.com",
  username: "testuser",
  password: "testpassword",
  refreshToken: [],
}

describe("Auth Tests", () => {
  test("Auth test register", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).not.toBe(StatusCodes.CREATED);
  });

  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send({
      email: "sdsdfsd",
    });
    expect(response.statusCode).not.toBe(StatusCodes.CREATED);
    const response2 = await request(app).post(baseUrl + "/register").send({
      email: "",
      password: "sdfsd",
    });
    expect(response2.statusCode).not.toBe(StatusCodes.CREATED);
  });

  test("Auth test login", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(StatusCodes.OK);
    const tokens: Tokens = response.body as Tokens;
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.userId).toBeDefined();
    testUser.accessToken = tokens.accessToken;
    testUser.refreshToken.push(tokens.refreshToken);
    testUser._id = tokens.userId;
  });

  test("Check tokens are not the same", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    const tokens = response.body as Tokens;

    expect(tokens.accessToken).not.toBe(testUser.accessToken);
    expect(tokens.refreshToken).not.toBe(testUser.refreshToken);
  });

  test("Auth test login fail", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: "sdfsd",
    });
    expect(response.statusCode).not.toBe(StatusCodes.OK);

    const response2 = await request(app).post(baseUrl + "/login").send({
      email: "dsfasd",
      password: "sdfsd",
    });
    expect(response2.statusCode).not.toBe(StatusCodes.OK);
  });

  test("Test refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken[testUser.refreshToken.length - 1],
    });

    const tokens = response.body as Tokens;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    testUser.accessToken = tokens.accessToken;
    testUser.refreshToken.push(tokens.refreshToken);
  });

  test("Double use refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken[testUser.refreshToken.length - 1],
    });
    expect(response.statusCode).toBe(StatusCodes.OK);
    const tokens: Tokens = response.body as Tokens;
    const refreshTokenNew: string = tokens.refreshToken;

    const response2 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken[testUser.refreshToken.length - 1],
    });
    expect(response2.statusCode).not.toBe(StatusCodes.OK);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: refreshTokenNew,
    });
    expect(response3.statusCode).not.toBe(StatusCodes.OK);
  });

  test("Test logout", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(StatusCodes.OK);

    const tokens = response.body as Tokens;

    testUser.accessToken = tokens.accessToken;
    testUser.refreshToken.push(tokens.refreshToken);

    const response2 = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken[testUser.refreshToken.length - 1],
    });
    expect(response2.statusCode).toBe(StatusCodes.OK);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken[testUser.refreshToken.length - 1],
    });
    expect(response3.statusCode).not.toBe(StatusCodes.OK);

  });
});