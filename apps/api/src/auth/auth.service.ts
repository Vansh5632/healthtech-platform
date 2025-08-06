// In apps/api/src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../generated/prisma';

// Define a type for the user object after validation (without the password).
export type ValidatedUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, pass: string): Promise<ValidatedUser> {
    const password = await bcrypt.hash(pass, 10);

    // Prisma's create method returns a full User object.
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });

    // We strip the password before returning the user object.
    const { password: _, ...result } = user;
    return result;
  }

  // The method now returns a Promise of our specific ValidatedUser type or null.
  async validateUser(
    email: string,
    pass: string,
  ): Promise<ValidatedUser | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // The login method now expects a ValidatedUser, not 'any'.
  login(user: ValidatedUser) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
