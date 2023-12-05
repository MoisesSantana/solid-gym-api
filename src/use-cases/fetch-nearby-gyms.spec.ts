
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { beforeEach, describe, expect, it } from 'vitest';

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

const gymData = {
  description: 'Gym description',
  phone: '123456789',
  latitude: -22.9345406,
  longitude: -43.6279325,
};

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      ...gymData,
      title: 'Near Gym',
    });

    await gymsRepository.create({
      ...gymData,
      title: 'Far Gym',
      latitude: -22.893045,
      longitude: -43.0983845,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.9345406,
      userLongitude: -43.6279325
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ]);
  });
});
