import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../../app';

const user = {
  email: 'email@email.com',
  name: 'Name',
  password: 'password',
};

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh a token', async () => {
    await request(app.server)
      .post('/users')
      .send(user);

    const sessionResponse = await request(app.server)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    const cookies = sessionResponse.get('Set-Cookie');

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
