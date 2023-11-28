import { User } from '@prisma/client';

import { UsersRepository } from '@/repositories/users-repository';

import { compare } from 'bcryptjs';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthUseCaseRequest {
  email: string;
  password: string;
}

interface AuthUseCaseResponse {
  user: User;
}

export class AuthUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({ email, password }: AuthUseCaseRequest): Promise<AuthUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new InvalidCredentialsError();

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) throw new InvalidCredentialsError();

    return { user };
  }
}
