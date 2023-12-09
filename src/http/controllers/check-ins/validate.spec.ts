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

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthUser(app, true);

    const createdGym = await prisma.gym.create({ data: gym });

    const user = await prisma.user.findFirstOrThrow();

    let checkIn = await prisma.checkIn.create({ data: {
      gym_id: createdGym.id,
      user_id: user.id
    } });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({ where: { id: checkIn.id } });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
