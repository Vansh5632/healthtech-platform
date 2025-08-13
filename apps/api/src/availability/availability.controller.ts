// In apps/api/src/availability/availability.controller.ts

import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { JwtPayload } from '../auth/jwt.strategy';
import { RolesGuard } from '../auth/guards/';
import { Roles } from '../auth/decorators/roles.decorator';
// Import Prisma namespace and Role enum
import { Role, Prisma } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @Roles(Role.PROVIDER)
  // Add the explicit return type to match the service method
  set(
    @Request() req: { user: JwtPayload },
    @Body() setAvailabilityDto: SetAvailabilityDto,
  ): Promise<Prisma.BatchPayload> {
    const providerId = req.user.sub;
    return this.availabilityService.set(providerId, setAvailabilityDto);
  }
}
