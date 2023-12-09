import { createAndAuthUser } from '@/utils/test/create-and-auth-user';

import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../../app';

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    const { token, user } = await createAndAuthUser(app);

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user)
      .toEqual(expect.objectContaining({ email: user.email }));
  });
});
