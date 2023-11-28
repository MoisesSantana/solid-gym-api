import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

import { AuthUseCase } from '../auth';

export function makeAuthUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authUseCase = new AuthUseCase(usersRepository);

  return authUseCase;
}
