
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository';

import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(createdUser.id);
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() => sut.execute({
      userId: 'wrong-id',
    })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
