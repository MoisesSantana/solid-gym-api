
import { FastifyInstance } from 'fastify';

import { auth } from './controllers/auth.controller';
import { register } from './controllers/register.controller';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/auth', auth);
}
