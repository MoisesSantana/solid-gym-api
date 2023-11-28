
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository';

import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

describe('Register Use Case', () => {
  const userData = {
    name: 'John Doe',
    email: 'jhondoe@example.com',
    password: '123456',
  };

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

    const { user } = await sut.execute(userData);

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

    await sut.execute(userData);

    await expect(() => sut.execute(userData))
      .rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

    const { user } = await sut.execute(userData);

    expect(user.id).toEqual('user-id');
  });
});
