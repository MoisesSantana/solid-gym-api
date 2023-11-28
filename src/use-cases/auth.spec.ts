
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository';

import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthUseCase } from './auth';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthUseCase;

describe('Auth Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthUseCase(usersRepository);
  });

  it('should be able to auth', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'jhondoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to auth with wrong email', async () => {
    await expect(() => sut.execute({
      email: 'jhondoe@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to auth with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() => sut.execute({
      email: 'jhondoe@example.com',
      password: '654321',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);

  });
});
