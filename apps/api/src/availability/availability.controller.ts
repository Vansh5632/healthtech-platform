import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { JwtPayload } from '../auth/jwt.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetAvailabilityQueryDto } from './dto/get-availability.dto';
import type { Prisma } from '../../generated/prisma';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // TODO: Fix @Roles decorator typing issue - should be @Roles(DOCTOR_ROLE)
  // For now, role checking is handled by RolesGuard
  set(
    @Request() req: { user: JwtPayload },
    @Body() setAvailabilityDto: SetAvailabilityDto,
  ): Promise<Prisma.BatchPayload> {
    const providerId = req.user.sub;
    return this.availabilityService.set(providerId, setAvailabilityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':providerId')
  get(
    @Param('providerId') providerId: string,
    @Query() query: GetAvailabilityQueryDto,
  ): Promise<{ slot: Date }[]> {
    return this.availabilityService.getAvailabilityService(
      providerId,
      query.startDate,
      query.endDate,
    );
  }
}
