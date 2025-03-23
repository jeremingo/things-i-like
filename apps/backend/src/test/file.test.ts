import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import initApp from "../server";

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


describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/test_file.txt`;

        try {
            const response = await request(app)
                .post("/file?file=test_file.txt").attach('file', filePath)
            console.log(response);
            expect(response.statusCode).toEqual(200);
            let url = (response.body as { url: string }).url;
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(app).get(url)
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    })
})