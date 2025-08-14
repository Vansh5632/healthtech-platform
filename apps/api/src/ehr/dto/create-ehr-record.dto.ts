import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { EHRRecordType } from 'generated/prisma';

export class CreateEhrRecordDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsEnum(EHRRecordType)
  recordType: EHRRecordType;

  @IsObject()
  content: object;
}
