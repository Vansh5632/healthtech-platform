// In apps/api/src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService, ValidatedUser } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // Add a clear return type to the controller method.
  async register(@Body() registerDto: RegisterDto): Promise<ValidatedUser> {
    return this.authService.register(registerDto.email, registerDto.password);
  }
}
