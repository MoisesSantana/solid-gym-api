
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { beforeEach, describe, expect, it } from 'vitest';

import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

const gymData = {
  description: 'Gym description',
  phone: '123456789',
  latitude: -22.9345406,
  longitude: -43.6279325,
};

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      ...gymData,
      title: 'Gym 01',
    });

    await gymsRepository.create({
      ...gymData,
      title: 'Gym 02',
    });

    const { gyms } = await sut.execute({ query: '01', page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 01' }),
    ]);
  });

  it('should be able to fetch paginated gym search', async () => {
    for(let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        ...gymData,
        title: `Gym ${i}`,
      });
    }

    const { gyms } = await sut.execute({ query: 'Gym', page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ]);
  });
});
