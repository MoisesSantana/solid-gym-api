
import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';

import { auth } from './auth.controller';
import { profile } from './profile.controller';
import { register } from './register.controller';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', auth);

  app.get('/me', { onRequest: [verifyJWT] }, profile);
}
