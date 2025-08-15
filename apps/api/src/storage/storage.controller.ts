// In apps/api/src/storage/storage.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  @Roles(Role.DOCTOR || Role.ADMIN) // Only providers can generate upload URLs
  getUploadUrl(
    @Body() getUploadUrlDto: GetUploadUrlDto,
  ): Promise<{ uploadUrl: string; key: string }> {
    const { patientId, filename, fileType } = getUploadUrlDto;
    return this.storageService.getPresignedUploadUrl(
      patientId,
      filename,
      fileType,
    );
  }
}
