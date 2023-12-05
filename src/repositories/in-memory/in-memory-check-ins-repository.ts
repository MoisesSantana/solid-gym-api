import { CheckIn, Prisma } from '@prisma/client';

import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';

import { CheckInsRepository } from '../check-ins-repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(({ id }) => id === checkIn.id);

    if (checkInIndex >= 0)
      this.checkIns[checkInIndex] = checkIn;
    
    return checkIn;
  }

  async findById(id: string) {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id);

    if (checkIn) return checkIn;
    return null;
  }

  async countByUserId(userId: string) {
    const checkInsCount = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .length;

    return checkInsCount;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);

    return checkIns;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');
    
    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate = (
        checkInDate.isAfter(startOfTheDay)
          && checkInDate.isBefore(endOfTheDay)
      );

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) return null;

    return checkInOnSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);
    return checkIn;
  }
}
