import { FastifyRequest, FastifyReply } from 'fastify';

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthUseCase } from '@/use-cases/factories/make-auth-use-case';

import { z } from 'zod';

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const data = authBodySchema.parse(request.body);

  try {
    const authUseCase = makeAuthUseCase();
    const { user } = await authUseCase.execute(data);

    const token = await reply.jwtSign({}, {
      sign: {
        sub: user.id,
      }
    });

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      }
    });

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError)
      return reply.status(401).send({ message: error.message });

    throw error;
  }
}
