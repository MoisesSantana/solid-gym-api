
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository';

import { hash } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { AuthUseCase } from './auth';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Auth Use Case', () => {
  it('should be able to auth', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthUseCase(usersRepository);
    
    await usersRepository.create({
      name: 'John Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'jhondoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual('user-id');
  });

  it('should not be able to auth with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthUseCase(usersRepository);

    expect(() => sut.execute({
      email: 'jhondoe@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to auth with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthUseCase(usersRepository);

    await usersRepository.create({
      name: 'John Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    });

    expect(() => sut.execute({
      email: 'jhondoe@example.com',
      password: '654321',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);

  });
});
