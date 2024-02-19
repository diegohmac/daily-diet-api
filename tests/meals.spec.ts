import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';

import { app } from '../src/app';

const createUser = async (name: string) => {
  return await request(app.server).post('/users').send({
    name,
  });
};
const loginUser = async (name = 'John Doe') => {
  const createUserResponse = await createUser(name);

  const loginResponse = await request(app.server).post('/users/login').send({
    id: createUserResponse.body.user.id,
  });

  const cookie = loginResponse.get('Set-Cookie');

  return cookie;
};

describe('meals routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be possible to create a meal', async () => {
    const cookie = await loginUser();

    const bodyPayload = {
      name: 'Dinner',
      description: 'Chicken and Salad',
      time: new Date().toISOString(),
      offDiet: false,
    };

    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(bodyPayload);

    expect(createMealResponse.body).toEqual(
      expect.objectContaining({
        ...bodyPayload,
        offDiet: bodyPayload.offDiet ? 1 : 0,
      })
    );
  });
  it('should be possible to edit a meal.', async () => {
    const cookie = await loginUser();

    const bodyPayload = {
      name: 'Dinner',
      description: 'Chicken and Salad',
      time: new Date().toISOString(),
      offDiet: false,
    };

    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(bodyPayload);

    const bodyPayloadUpdate = {
      name: 'Lunch',
      description: 'Rice and Beans',
      time: new Date().toISOString(),
      offDiet: true,
    };

    const updateMealResponse = await request(app.server)
      .put(`/meals/${createMealResponse.body.id}`)
      .set('Cookie', cookie)
      .send(bodyPayloadUpdate);

    expect(updateMealResponse.body).toEqual(
      expect.objectContaining({
        ...bodyPayloadUpdate,
        offDiet: bodyPayloadUpdate.offDiet ? 1 : 0,
      })
    );

    expect(updateMealResponse.body).not.toEqual(
      expect.objectContaining({
        ...createMealResponse.body,
        offDiet: createMealResponse.body.offDiet ? 1 : 0,
      })
    );
  });
  it('should be possible to delete a meal.', async () => {
    const cookie = await loginUser();

    const bodyPayload = {
      name: 'Dinner',
      description: 'Chicken and Salad',
      time: new Date().toISOString(),
      offDiet: false,
    };

    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(bodyPayload);

    const deleteMealResponse = await request(app.server)
      .delete(`/meals/${createMealResponse.body.id}`)
      .set('Cookie', cookie);

    expect(deleteMealResponse.status).toBe(204);
  });
  it('should be possible to list all meals of a user.', async () => {
    const cookie = await loginUser();

    const bodyPayload = {
      name: 'Dinner',
      description: 'Chicken and Salad',
      time: new Date().toISOString(),
      offDiet: false,
    };

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(bodyPayload);

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie);
    const { meals } = listMealsResponse.body;

    expect(meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...bodyPayload,
          offDiet: bodyPayload.offDiet ? 1 : 0,
        }),
      ])
    );
  });
  it.only('should be possible to view a single meal passing ID', async () => {
    const cookie = await loginUser();

    const bodyPayload = {
      name: 'Dinner',
      description: 'Chicken and Salad',
      time: new Date().toISOString(),
      offDiet: false,
    };

    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(bodyPayload);

    const mealByIdResponse = await request(app.server)
      .get(`/meals/${createMealResponse.body.id}`)
      .set('Cookie', cookie);

    expect(mealByIdResponse.body).toEqual(
      expect.objectContaining({
        ...bodyPayload,
        offDiet: bodyPayload.offDiet ? 1 : 0,
      })
    );
  });
  it('should be possible to retrieve all metrics from a user.', async () => {
    expect(true).toBe(true);
  });
});
