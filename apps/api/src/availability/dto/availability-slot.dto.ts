import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsString, Matches } from 'class-validator';

export class AvailabilitySlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;
}

export class AddSlotDto extends AvailabilitySlotDto {}

export class CheckAvailabilityDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'timeSlot must be in HH:mm format',
  })
  timeSlot: string;
}
