import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { EhrModule } from './ehr/ehr.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { StorageModule } from './storage/storage.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AppointmentsModule,
    AvailabilityModule,
    EhrModule,
    PrescriptionsModule,
    StorageModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
