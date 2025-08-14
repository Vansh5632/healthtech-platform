/* eslint-disable */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEhrRecordDto } from './dto/create-ehr-record.dto';
import { EHRRecord, Prisma, Role, EHRRecordType } from '../../generated/prisma';

@Injectable()
export class EhrService {
  constructor(private prisma: PrismaService) {}

  async create(
    createEhrRecordDto: CreateEhrRecordDto,
    providerId: string,
  ): Promise<EHRRecord> {
    return await this.prisma.eHRRecord.create({
      data: {
        recordType: createEhrRecordDto.recordType,
        content: createEhrRecordDto.content as Prisma.JsonObject,
        patientId: createEhrRecordDto.patientId,
        providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAllForPatient(
    patientId: string,
    requestingUserId: string,
    requestingUserRole: Role,
  ): Promise<EHRRecord[]> {
    if (requestingUserRole === Role.PATIENT && requestingUserId !== patientId) {
      throw new ForbiddenException(
        'you are not authorized to view these records',
      );
    }

    if (
      requestingUserRole === Role.ADMIN ||
      requestingUserRole === Role.DOCTOR
    ) {
      return await this.prisma.eHRRecord.findMany({ where: { patientId } });
    }

    return await this.prisma.eHRRecord.findMany({ where: { patientId } });
  }
}
