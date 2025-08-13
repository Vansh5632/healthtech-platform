// In apps/api/src/availability/availability.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetAvailabilityDto } from './dto/set-availability.dto';
// Import the Prisma namespace to access utility types
import { Prisma } from '../../generated/prisma';
import {
  addMinutes,
  eachDayOfInterval,
  isBefore,
  isEqual,
  isWithinInterval,
  parse,
} from 'date-fns';

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

  async getAvailabilityService(
    providerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ slot: Date }[]> {
    //fetch the provider weekly schedule and booked appointments in parallel

    const [providerSchedule, bookedAppointments] = await Promise.all([
      this.prisma.providerAvailability.findMany({ where: { providerId } }),
      this.prisma.appointment.findMany({
        where: {
          providerId,
          startTime: { gte: startDate },
          endTime: { lte: endDate },
        },
      }),
    ]);

    if (!providerSchedule) {
      throw new NotFoundException('Provider availability not found');
    }

    const availableSlots: { slot: Date }[] = [];
    const slotDuration = 30;

    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

    for (const day of daysInRange) {
      const dayOfWeek = day.getDay();
      const dailySchedule = providerSchedule.find(
        (s) => s.dayOfWeek === dayOfWeek,
      );

      if (!dailySchedule) continue;
      const startTime = parse(dailySchedule.startTime, 'HH:mm', day);
      const endTime = parse(dailySchedule.endTime, 'HH:mm', day);

      let currentSlot = startTime;
      while (isBefore(currentSlot, endTime)) {
        const isBooked = bookedAppointments.some((appt) => {
          const apptInterval = { start: appt.startTime, end: appt.endTime };

          return (
            isWithinInterval(currentSlot, apptInterval) ||
            isEqual(currentSlot, appt.startTime)
          );
        });
        if (!isBooked) {
          availableSlots.push({ slot: currentSlot });
        }
        currentSlot = addMinutes(currentSlot, slotDuration);
      }
    }
    return availableSlots;
  }
}
