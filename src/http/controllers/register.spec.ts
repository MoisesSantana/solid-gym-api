import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../app';

const user = {
  email: 'email@email.com',
  name: 'Name',
  password: 'password',
};

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .send(user);

    expect(response.status).toBe(201);
  });
});
