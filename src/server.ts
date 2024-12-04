import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import express, { Express } from 'express';
const app = express();

import indexRoute from './routes/index';

app.use('/', indexRoute);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => {
        resolve(app);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default initApp;