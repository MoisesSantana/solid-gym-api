
import { FastifyInstance } from 'fastify';

import { auth } from './controllers/auth.controller';
import { profile } from './controllers/profile.controller';
import { register } from './controllers/register.controller';
import { verifyJWT } from './middlewares/verify-jwt';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', auth);

  app.get('/me', { onRequest: [verifyJWT] }, profile);
}
