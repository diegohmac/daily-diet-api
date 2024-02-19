import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';
import { checkUserIsAuthenticated } from '../middlewares/check-user-is-authenticated';

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const sessionCookie = request.cookies.sessionCookie;

    if (!sessionCookie) {
      return reply.status(401).send();
    }

    const { userId } = JSON.parse(sessionCookie);

    const meals = await knex('meals').where({ userId });

    return meals;
  });
  app.post(
    '/',
    {
      preHandler: [checkUserIsAuthenticated],
    },
    async (request, reply) => {
      const bodySchema = z.object({
        name: z.string(),
        description: z.string(),
        time: z.string().optional(),
        offDiet: z.boolean(),
      });

      const { name, description, offDiet, time } = bodySchema.parse(
        request.body
      );

      const sessionCookie = request.cookies.sessionCookie;

      if (!sessionCookie) {
        return reply.status(401).send();
      }

      const { userId } = JSON.parse(sessionCookie);

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        time: time ?? new Date().toISOString(),
        created_at: new Date().toISOString(),
        offDiet,
        userId,
      });

      return reply.status(201).send();
    }
  );
}
