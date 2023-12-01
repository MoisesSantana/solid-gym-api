
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { beforeEach, describe, expect, it } from 'vitest';

import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

const gymData = {
  title: 'Gym title',
  description: 'gym description',
  phone: 'gym phone',
  latitude: -22.8912723,
  longitude: -43.3238657,
};

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute(gymData);

    expect(gym.id).toEqual(expect.any(String));
  });
});
