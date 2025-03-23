import initApp from './server';
import Config from './env/config';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

initApp()
.then((app) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http.createServer(app).listen(Config.PORT);
  } else {
    console.log('PRODUCTION');
    const options2 = {
      key: fs.readFileSync(path.join(__dirname, '../client-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../client-cert.pem'))
    };
    https.createServer(options2, app).listen(Config.HTTPS_PORT);
  }
})
.catch(console.error);
