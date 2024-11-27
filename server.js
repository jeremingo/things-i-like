const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();

const indexRoute = require('./routes/index');

app.use('/', indexRoute);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const initApp = () => {
  return new Promise((resolve, reject) => {
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

module.exports = initApp;