import { FastifyRequest, FastifyReply } from 'fastify';

import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';

import { z } from 'zod';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const data = searchGymsQuerySchema.parse(request.query);

  const searchGymsUseCase = makeSearchGymsUseCase();
  const { gyms } = await searchGymsUseCase.execute(data);

  return reply.status(200).send({ gyms });
}
