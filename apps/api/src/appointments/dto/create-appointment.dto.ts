import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
