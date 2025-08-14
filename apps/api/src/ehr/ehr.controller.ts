import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EhrService } from './ehr.service';
import { CreateEhrRecordDto } from './dto/create-ehr-record.dto';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { EHRRecord } from 'generated/prisma';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ehr')
export class EhrController {
  constructor(private readonly ehrService: EhrService) {}

  @Post()
  @Roles(Role.DOCTOR || Role.ADMIN)
  create(
    @Body() createEhrRecordDto: CreateEhrRecordDto,
    @Request() req: { user: JwtPayload },
  ): Promise<EHRRecord> {
    const providerId = req.user.sub;
    return this.ehrService.create(createEhrRecordDto, providerId);
  }

  @Get('patient/:patientId')
  findAllForPatient(
    @Param('patientId') patientId: string,
    @Request() req: { user: JwtPayload },
  ): Promise<EHRRecord[]> {
    const { sub, role } = req.user;
    return this.ehrService.findAllForPatient(patientId, sub, role);
  }
}
