const request = require("supertest");
const { MongoMemoryServer } = require('mongodb-memory-server');

const initApp = require("../server");
const mongoose = require("mongoose");

var app;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.DATABASE_URL = mongoServer.getUri();
  app = await initApp();
});

afterAll((done) => {
  mongoose.disconnect();
  mongoServer.stop();
  done();
});

describe('App Tests', () => {
  test('Test health endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('App is running');
  });
});