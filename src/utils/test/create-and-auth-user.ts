import { FastifyInstance } from 'fastify';

import request from 'supertest';

const user = {
  email: 'email@email.com',
  name: 'Name',
  password: 'password',
};

export async function createAndAuthUser(app: FastifyInstance) {
  await request(app.server)
    .post('/users')
    .send(user);

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({ email: user.email, password: user.password });

  const { token } = authResponse.body;

  return { token, user };
}
