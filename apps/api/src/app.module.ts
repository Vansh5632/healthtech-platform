import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { EhrModule } from './ehr/ehr.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [PrismaModule, AuthModule, AppointmentsModule, AvailabilityModule, EhrModule, PrescriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
