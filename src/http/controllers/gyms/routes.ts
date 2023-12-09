
import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';

import { create } from './create.controller';
import { nearby } from './nearby.controller';
import { search } from './search.controller';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/gyms/nearby', nearby);
  app.get('/gyms/search', search);

  app.post('/gyms', create);
}
