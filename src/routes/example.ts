import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    reply.send();
  });
}
