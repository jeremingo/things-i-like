import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Express } from 'express';

import initApp from '../server';
import mongoose from 'mongoose';

var app: Express;
var mongoServer: MongoMemoryServer;

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