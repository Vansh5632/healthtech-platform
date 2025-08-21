import { Injectable } from '@nestjs/common';
import { Role, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllProviders(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
