import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../app';

const user = {
  email: 'email@email.com',
  name: 'Name',
  password: 'password',
};

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    await request(app.server)
      .post('/users')
      .send(user);

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user)
      .toEqual(expect.objectContaining({ email: user.email }));
  });
});
