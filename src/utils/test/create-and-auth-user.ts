import { FastifyInstance } from 'fastify';

import { prisma } from '@/lib/prisma';

import { hash } from 'bcryptjs';
import request from 'supertest';

export async function createAndAuthUser(app: FastifyInstance, isAdmin = false) {
  const user = await prisma.user.create({ data: {
    email: 'email@email.com',
    name: 'Name',
    password_hash: await hash('password', 8),
    role: isAdmin ? 'ADMIN' : 'MEMBER'
  } });

  await request(app.server)
    .post('/users')
    .send(user);

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({ email: 'email@email.com', password: 'password' });

  const { token } = authResponse.body;

  return { token, user };
}
