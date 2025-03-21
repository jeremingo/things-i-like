import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import postModel, { Post } from '../models/post.model';
import initApp from '../server';
import { User } from '../models/user';
import { Tokens } from '@things-i-like/auth';
import { StatusCodes } from 'http-status-codes';

let app: Express;
let mongoServer: MongoMemoryServer;
let user: User;
let token: Tokens;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.DATABASE_URL = mongoServer.getUri();
  app = await initApp();

  const registerResponse = await request(app).post('/auth/register')
  .send({ email: 'test@email.com', username: 'aoeu', password: 'password' });

  user = registerResponse.body as User;
  const loginResponse = await request(app).post('/auth/login').send({ email: user.email, password: 'password' });

  token = (loginResponse.body as { tokens: Tokens, user: User }).tokens;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('PostsController', () => {
  afterEach(async () => {
    await postModel.deleteMany({});
  });

  it('should create a new post', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token.accessToken}`)
      .send({ title: 'Test Post', content: 'This is a test post' });

    const post = response.body as Post;
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(post.title).toBe('Test Post');
    expect(post.content).toBe('This is a test post');
  });

  it('should get all posts', async () => {
    await postModel.create({ title: 'Test Post', content: 'This is a test post', userId: user._id});

    const response = await request(app).get('/posts').send();

    expect(response.status).toBe(StatusCodes.OK);
    const posts = response.body as Post[];
    expect(posts.length).toBe(1);
    expect(posts[0].title).toBe('Test Post');
  });

  it('should get a post by id', async () => {
    const post = await postModel.create({ title: 'Test Post', content: 'This is a test post', userId: user._id});

    const response = await request(app).get(`/posts/${post._id.toString()}`).send();

    const queriedPost = response.body as Post;
    expect(response.status).toBe(StatusCodes.OK);
    expect(queriedPost.title).toBe('Test Post');
  });

  it('should delete a post by id', async () => {
    const post = await postModel.create({ title: 'Test Post', content: 'This is a test post', userId: user._id});

    const response = await request(app)
      .delete(`/posts/${post._id.toString()}`)
      .set('Authorization', `Bearer ${token.accessToken}`);

    expect(response.status).toBe(StatusCodes.NO_CONTENT);

    const deletedPost = await postModel.findById(post._id);
    expect(deletedPost).toBeNull();
  });

  it('should return 404 if post not found', async () => {
    const response = await request(app).get('/posts/60c72b2f9b1e8b3f4c8e4d3b');

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});