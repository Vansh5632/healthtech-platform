// In apps/api/src/auth/strategies/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';

// Define the shape of the data encoded in our JWT.
export interface JwtPayload {
  sub: string; // The user's ID
  email: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // This `validate` method runs AFTER the JWT's signature and expiration are verified.
  // It receives the decoded payload and returns it. NestJS then attaches this return value to `request.user`.
  validate(payload: JwtPayload): JwtPayload {
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
