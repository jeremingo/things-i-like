import swaggerJSDoc from 'swagger-jsdoc';

import { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Things I Like API',
      version: '1.0.0',
      description: 'API documentation for Things I Like application',
    },
    servers: [
      { url: 'http://localhost:3000', },
      { url: 'http://node31.cs.colman.ac.il', },
    ],
  },
  apis: ['./src/routes/*.ts'],
};


// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default swaggerJSDoc(options);