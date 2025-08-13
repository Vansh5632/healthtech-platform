// In apps/api/src/availability/availability.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetAvailabilityDto } from './dto/set-availability.dto';
// Import the Prisma namespace to access utility types
import { Prisma } from '../../generated/prisma';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  // Add the explicit return type Promise<Prisma.BatchPayload>
  async set(
    providerId: string,
    setAvailabilityDto: SetAvailabilityDto,
  ): Promise<Prisma.BatchPayload> {
    const { schedule } = setAvailabilityDto;

    return this.prisma.$transaction(async (tx) => {
      await tx.providerAvailability.deleteMany({
        where: { providerId },
      });

      const created = await tx.providerAvailability.createMany({
        data: schedule.map((slot) => ({
          ...slot,
          providerId,
        })),
      });

      return created;
    });
  }
}
