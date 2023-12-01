
import { Decimal } from '@prisma/client/runtime/library';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckInUseCase } from './check-in';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

const checkInData = {
  userId: 'user-id',
  gymId: 'gym-id',
  userLatitude: -22.9345406,
  userLongitude: -43.6279325,
};

const gymData = {
  id: 'gym-id',
  title: 'gym-title',
  description: 'gym-description',
  phone: 'gym-phone',
  latitude: new Decimal(-22.9345406),
  longitude: new Decimal(-43.6279325),
};

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.gyms.push(gymData);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute(checkInData);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(1994, 5, 5, 8, 0, 0));

    await sut.execute(checkInData);

    await expect(() => sut.execute(checkInData))
      .rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(1994, 5, 5, 8, 0, 0));

    await sut.execute(checkInData);

    vi.setSystemTime(new Date(1994, 5, 6, 8, 0, 0));

    const { checkIn }=await sut.execute(checkInData);
    
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      ...gymData,
      id: 'another-gym-id',
      latitude: new Decimal(-22.8912723),
      longitude: new Decimal(-43.5439704),
    });

    await expect(() => sut.execute({
      ...checkInData,
      gymId: 'another-gym-id',
    })).rejects.toBeInstanceOf(Error);
  });
});
