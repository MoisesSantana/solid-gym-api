import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../../app';

const user = {
  email: 'email@email.com',
  name: 'Name',
  password: 'password',
};

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    await request(app.server)
      .post('/users')
      .send(user);

    const response = await request(app.server)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
