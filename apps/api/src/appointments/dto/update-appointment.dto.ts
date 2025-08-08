import { IsEnum } from 'class-validator';
import { AppointmentStatus } from 'generated/prisma';

export class UpdateAppointmentDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
