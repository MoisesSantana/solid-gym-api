import { FastifyRequest, FastifyReply } from 'fastify';

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthUseCase } from '@/use-cases/auth';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';

import { z } from 'zod';

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const data = authBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authUseCase = new AuthUseCase(usersRepository);

    await authUseCase.execute(data);
  } catch (error) {
    if (error instanceof InvalidCredentialsError)
      return reply.status(401).send({ message: error.message });

    throw error;
  }

  return reply.status(200).send();
}
