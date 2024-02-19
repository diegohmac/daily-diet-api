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
    expect(true).toBe(true);
  });
  it('should be possible to delete a meal.', async () => {
    expect(true).toBe(true);
  });
  it('should be possible to list all meals of a user.', async () => {
    expect(true).toBe(true);
  });
  it('should be possible to view a single meal passing ID', async () => {
    expect(true).toBe(true);
  });
  it('should be possible to retrieve all metrics from a user.', async () => {
    expect(true).toBe(true);
  });
});
