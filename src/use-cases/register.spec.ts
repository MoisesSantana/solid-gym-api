
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository';

import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

const userData = {
  name: 'John Doe',
  email: 'jhondoe@example.com',
  password: '123456',
};

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute(userData);

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    await sut.execute(userData);

    await expect(() => sut.execute(userData))
      .rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute(userData);

    expect(user.id).toEqual(expect.any(String));
  });
});
