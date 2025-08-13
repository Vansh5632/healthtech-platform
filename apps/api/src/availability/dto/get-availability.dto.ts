import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class GetAvailabilityQueryDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;
}
