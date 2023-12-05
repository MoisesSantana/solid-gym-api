
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidateCheckInUseCase } from './validate-check-in';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

const checkInData = {
  user_id: 'user-id',
  gym_id: 'gym-id',
};

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create(checkInData);

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.checkIns[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() => sut.execute({
      checkInId: 'inexistent-check-in-id',
    })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 5, 5, 4, 20));

    const createdCheckIn = await checkInsRepository.create(checkInData);

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() => sut.execute({
      checkInId: createdCheckIn.id,
    })).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
