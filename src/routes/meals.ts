import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';
import { checkUserIsAuthenticated } from '../middlewares/check-user-is-authenticated';

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/metrics', async (request, reply) => {
    const sessionCookie = request.cookies.sessionCookie;

    if (!sessionCookie) {
      return reply.status(401).send();
    }

    const { userId } = JSON.parse(sessionCookie);

    const meals = await knex('meals').where({ userId }).orderBy('time');

    const metrics = {
      totalMeals: meals.length,
      onDietMeals: meals.filter((meal) => !meal.offDiet).length,
      offDietMeals: meals.filter((meal) => meal.offDiet).length,
      bestSequence: meals.reduce(
        (acc, cur) => {
          if (cur.offDiet) {
            return {
              best: acc.best > acc.current ? acc.best : acc.current,
              current: 0,
            };
          }

          return {
            best: acc.best,
            current: acc.current + 1,
          };
        },
        { best: 0, current: 0 }
      ).best,
    };

    return {
      metrics,
    };
  });
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

    return meal;
  });
  app.delete('/:id', async (request, reply) => {
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

    await knex('meals').where({ id, userId }).delete();

    return reply.status(204).send();
  });
  app.put('/:id', async (request, reply) => {
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

    const updatedMealResponse = await knex('meals')
      .where({ id, userId })
      .update(updatedMeal)
      .returning('*');

    return reply.status(200).send(updatedMealResponse[0]);
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

      const meal = await knex('meals')
        .insert({
          id: randomUUID(),
          name,
          description,
          time: time ?? new Date().toISOString(),
          created_at: new Date().toISOString(),
          offDiet,
          userId,
        })
        .returning('*');

      return reply.status(201).send(meal[0]);
    }
  );
}
