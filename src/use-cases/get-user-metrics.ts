
import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface GetUserMetricsRequest {
  userId: string;
}

interface GetUserMetricsResponse {
  checkInsCout: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const checkInsCout = await this.checkInsRepository.countByUserId(userId);

    return { checkInsCout };
  }
}
