import initApp from './server';
import Config from './env/config';
import https from 'https';
import http from 'http';
import fs from 'fs';

initApp()
.then((app) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http.createServer(app).listen(Config.PORT);
  } else {
    console.log('PRODUCTION');
    const options2 = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem')
    };
    https.createServer(options2, app).listen(Config.HTTPS_PORT);
  }
})
.catch(console.error);
