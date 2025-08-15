import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { Prescription } from 'generated/prisma';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
    providerId: string,
  ): Promise<Prescription> {
    return await this.prisma.prescription.create({
      data: {
        ...createPrescriptionDto,
        providerId,
      },
    });
  }

  async findAllForPatient(patientId: string): Promise<Prescription[]> {
    return await this.prisma.prescription.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
