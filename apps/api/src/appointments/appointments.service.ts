import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment, Role } from 'generated/prisma';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    CreateAppointmentDto: CreateAppointmentDto,
    patientId: string,
  ): Promise<Appointment> {
    const { providerId, startTime, endTime } = CreateAppointmentDto;

    return this.prisma.appointment.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        patientId,
        providerId,
      },
    });
  }

  async findAllForUser(userId: string, role: Role): Promise<Appointment[]> {
    const whereClause =
      role === Role.DOCTOR ? { providerId: userId } : { patientId: userId };
    return this.prisma.appointment.findMany({
      where: whereClause,
      orderBy: { startTime: 'asc' },
    });
  }
  async updateStatus(
    appointmentId: string,
    UpdateAppointmentDto: UpdateAppointmentDto,
    userId: string,
  ): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }
    if (appointment.patientId !== userId && appointment.providerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this appointment.',
      );
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: UpdateAppointmentDto.status,
      },
    });
  }
}
