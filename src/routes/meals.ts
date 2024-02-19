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

    return {
      meals,
    };
  });
  app.get('/:id', async (request, reply) => {
    const paramSchema = z.object({
      id: z.string(),
    });

    const { id } = paramSchema.parse(request.params);

    const sessionCookie = request.cookies.sessionCookie;

    if (!sessionCookie) {
      return reply.status(401).send();
    }

    const { userId } = JSON.parse(sessionCookie);

    const meal = await knex('meals').where({ id, userId }).first();

    if (!meal) {
      return reply.status(404).send();
    }

    return {
      meal,
    };
  });
  app.post('/:id', async (request, reply) => {
    const paramSchema = z.object({
      id: z.string(),
    });

    const { id } = paramSchema.parse(request.params);

    const sessionCookie = request.cookies.sessionCookie;

    if (!sessionCookie) {
      return reply.status(401).send();
    }

    const { userId } = JSON.parse(sessionCookie);

    const meal = await knex('meals').where({ id, userId }).first();

    if (!meal) {
      return reply.status(404).send();
    }

    const bodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      time: z.string().optional().optional(),
      offDiet: z.boolean().optional(),
    });

    const { name, description, offDiet, time } = bodySchema.parse(request.body);

    const updatedMeal = {
      ...meal,
      name: name ?? meal.name,
      description: description ?? meal.description,
      time: time ?? meal.time,
      offDiet: offDiet === undefined ? meal.offDiet : offDiet,
    };

    await knex('meals').where({ id, userId }).update(updatedMeal);

    return updatedMeal;
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
