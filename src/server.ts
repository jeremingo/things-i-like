import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import express, { Express } from 'express';
const app = express();

import indexRoute from './routes/index';
import authRoute from './routes/auth';
import Config from './env/config';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRoute);
app.use('/auth', authRoute);

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