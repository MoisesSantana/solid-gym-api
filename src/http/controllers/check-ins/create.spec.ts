import { prisma } from '@/lib/prisma';
import { createAndAuthUser } from '@/utils/test/create-and-auth-user';

import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../../app';

const gym = {
  title: 'Gym',
  description: 'Description',
  phone: '123456789',
  latitude: -23.123456,
  longitude: -46.123456,
};

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthUser(app);

    const createdGym = await prisma.gym.create({ data: gym });

    const response = await request(app.server)
      .post(`/gyms/${createdGym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: gym.latitude,
        longitude: gym.longitude,
      });

    expect(response.status).toBe(201);
  });
});
