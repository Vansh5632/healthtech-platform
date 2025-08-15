import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PrescriptionsService } from './prescriptions.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { Role, Prescription } from 'generated/prisma';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionService: PrescriptionsService) {}

  @Post()
  @Roles(Role.DOCTOR || Role.ADMIN)
  create(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
    @Request() req: { user: JwtPayload },
  ): Promise<Prescription> {
    const providerId = req.user.sub;
    return this.prescriptionService.create(createPrescriptionDto, providerId);
  }

  @Get('patient/:patientId')
  findAllforPatient(
    @Param('patientId') patientId: string,
    @Request() req: { user: JwtPayload },
  ): Promise<Prescription[]> {
    const { sub: requestingUserId, role } = req.user;

    if (role === Role.PATIENT && requestingUserId !== patientId) {
      throw new ForbiddenException(
        'You are not authorized to view these prescriptions',
      );
    }

    return this.prescriptionService.findAllForPatient(patientId);
  }
}
