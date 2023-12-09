import { createAndAuthUser } from '@/utils/test/create-and-auth-user';

import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../../app';

const gyms = [
  {
    title: 'Gym1',
    description: 'Description1',
    phone: '123456789',
    latitude: -23.123856,
    longitude: -46.123856,
  },
  {
    title: 'Gym2',
    description: 'Description2',
    phone: '123456789',
    latitude: -23.123456,
    longitude: -46.123456,
  }
];

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gyms[0]);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gyms[1]);

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: gyms[0].title,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: gyms[0].title }),
    ]);
  });
});
