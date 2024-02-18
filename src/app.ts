import fastify from 'fastify';
import cookie from '@fastify/cookie';

// import { exampleRoutes } from './routes/example';

export const app = fastify();

app.register(cookie);
// app.register(exampleRoutes, {
//   prefix: '/example',
// });
