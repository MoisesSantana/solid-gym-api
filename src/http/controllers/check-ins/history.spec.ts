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

describe('Check-in History (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const createdGym = await prisma.gym.create({ data: gym });

    await prisma.checkIn.createMany({
      data: [
        { gym_id: createdGym.id, user_id: user.id },
        { gym_id: createdGym.id, user_id: user.id },
        { gym_id: createdGym.id, user_id: user.id },
      ]
    });

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({ gym_id: createdGym.id, user_id: user.id }),
      expect.objectContaining({ gym_id: createdGym.id, user_id: user.id }),
      expect.objectContaining({ gym_id: createdGym.id, user_id: user.id }),
    ]);
  });
});
