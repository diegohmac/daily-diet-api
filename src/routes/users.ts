import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select('*');

    return users;
  });
  app.get('/:id', async (request) => {
    const paramSchema = z.object({
      id: z.string(),
    });

    const { id } = paramSchema.parse(request.params);

    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  });
  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
    });

    const { name } = bodySchema.parse(request.body);

    await knex('users').insert({
      id: randomUUID(),
      name,
    });

    return reply.status(201).send();
  });
  app.post('/login', async (request, reply) => {
    const bodySchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = bodySchema.parse(request.body);

    const user = await knex('users').where({ id }).first();

    if (!user) {
      return reply.status(404).send();
    }

    const sessionId = randomUUID();
    const cookie = JSON.stringify({ userId: user.id, sessionId });
    reply.setCookie('sessionCookie', cookie, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return reply.status(200).send();
  });
}
