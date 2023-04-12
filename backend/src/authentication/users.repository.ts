import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { Identity, User } from './types';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
        identities: {
          select: { provider: true, providerId: true },
        },
      },
      where: { id },
    });

    if (!user) {
      return null;
    }

    return user as User;
  }

  async getByIdentities(...identities: Identity[]): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
        identities: {
          select: { provider: true, providerId: true },
        },
      },
      where: {
        identities: {
          some: { OR: identities },
        },
      },
    });

    if (!user) {
      return { id: randomUUID(), identities: [] };
    }

    return user as User;
  }

  async save(user: User): Promise<void> {
    await this.prismaService.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        identities: { create: user.identities },
      },
      update: {
        identities: {
          upsert: user.identities.map((identity) => ({
            where: {
              provider_providerId: {
                provider: identity.provider,
                providerId: identity.providerId,
              },
            },
            create: identity,
            update: {},
          })),
        },
      },
    });
  }
}
