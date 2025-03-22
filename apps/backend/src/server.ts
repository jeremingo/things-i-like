import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import express, { Express } from 'express';
const app = express();

import indexRoute from './routes/index';
import authRoute from './routes/auth';
import postsRoute from './routes/post';
import usersRoute from './routes/user';
import Config from './env/config';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/posts', postsRoute)
app.use('/users', usersRoute)

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    Config.load();
    mongoose
      .connect(Config.DATABASE_URL)
      .then(() => {
        resolve(app);
      })
      .catch(reject);
  });
};

export default initApp;