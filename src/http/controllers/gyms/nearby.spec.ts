import { createAndAuthUser } from '@/utils/test/create-and-auth-user';

import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../../app';

const gyms = [
  {
    title: 'Gym1',
    description: 'Description1',
    phone: '123456789',
    latitude: -22.9345406,
    longitude: -43.6279325,
  },
  {
    title: 'Gym2',
    description: 'Description2',
    phone: '123456789',
    latitude: -22.893045,
    longitude: -43.0983845,
  }
];

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gyms[0]);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gyms[1]);

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: gyms[0].latitude,
        longitude: gyms[0].longitude,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: gyms[0].title }),
    ]);
  });
});
