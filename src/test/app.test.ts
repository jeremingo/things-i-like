import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Express } from 'express';

import initApp from '../server';
import mongoose from 'mongoose';

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

describe('App Tests', () => {
  test('Test health endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.text).toBe('App is running');
  });
});