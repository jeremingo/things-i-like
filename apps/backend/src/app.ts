import initApp from './server';
import Config from './env/config';

initApp()
.then((app) => {
  app.listen(Config.PORT, () => {
    console.log(`App listening at http://localhost:${Config.PORT}`);
  });
})
.catch(console.error);
