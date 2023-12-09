
import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';

import { create } from './create.controller';
import { histoy } from './history.controllet';
import { metrics } from './metrics.controller';
import { validate } from './validate.controller';

export async function checkInsRoute(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/check-ins/history', histoy);
  app.get('/check-ins/metrics', metrics);

  app.post('/gyms/:gymId/check-ins', create);

  app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyUserRole('ADMIN')] }, validate);
}
