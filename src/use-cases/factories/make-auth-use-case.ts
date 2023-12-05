import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

import { AuthUseCase } from '../auth';

export function makeAuthUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AuthUseCase(usersRepository);

  return useCase;
}
