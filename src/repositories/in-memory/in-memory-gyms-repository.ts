import { Gym, Prisma } from '@prisma/client';

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

import { randomUUID } from 'crypto';

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findManyNearby(params: FindManyNearbyParams) {
    const nearbyGyms = this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: +gym.latitude, longitude: +gym.longitude },
      );
      
      return distance < 10;
    });

    return nearbyGyms;
  }

  async searchMany(query: string, page: number) {
    const gyms = this.gyms.filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);

    return gyms;
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);
    
    if (gym) return gym;
    return null;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
      created_at: new Date(),
    };

    this.gyms.push(gym);
    return gym;
  }
}
