import {
  Controller,
  Request,
  UseGuards,
  Post,
  Body,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { Appointment } from 'generated/prisma';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req: { user: JwtPayload },
  ): Promise<Appointment> {
    const patientId = req.user.sub;
    return this.appointmentsService.create(createAppointmentDto, patientId);
  }

  @Get('me')
  findAllForUser(@Request() req: { user: JwtPayload }): Promise<Appointment[]> {
    const { sub: userId, role } = req.user;
    return this.appointmentsService.findAllForUser(userId, role);
  }
  @Patch(':id/status')
  update(
    @Param('id') id: string,
    @Body() UpdateAppointmentDto: UpdateAppointmentDto,
    @Request() req: { user: JwtPayload },
  ): Promise<Appointment> {
    const userId = req.user.sub;
    return this.appointmentsService.updateStatus(
      id,
      UpdateAppointmentDto,
      userId,
    );
  }
}
