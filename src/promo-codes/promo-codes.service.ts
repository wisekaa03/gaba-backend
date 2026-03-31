import { ConflictException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PromoCode, PromoCodeActivation, User } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { ActivatePromoCodeInput, CreatePromoCodeInput } from './schemas/promo-codes.zod';

@Injectable()
export class PromoCodesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePromoCodeInput): Promise<PromoCode> {
    try {
      return await this.prisma.promoCode.create({
        data: {
          code: input.code,
          discountPercent: input.discountPercent,
          activationLimit: input.activationLimit,
          expiresAt: input.expiresAt,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Promo code already exists');
      }
      throw error;
    }
  }

  async list(query: { limit?: number; offset?: number }): Promise<{
    items: PromoCode[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;

    const [items, total] = await Promise.all([
      this.prisma.promoCode.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promoCode.count(),
    ]);

    return { items, total, limit, offset };
  }

  async getById(id: string): Promise<PromoCode> {
    const promo = await this.prisma.promoCode.findUnique({ where: { id } });
    if (!promo) {
      throw new NotFoundException('Promo code not found');
    }
    return promo;
  }

  async delete(id: string): Promise<{ deleted: true }> {
    try {
      await this.prisma.promoCode.delete({ where: { id } });
      return { deleted: true };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Promo code not found');
      }
      throw error;
    }
  }

  async activate(dto: ActivatePromoCodeInput): Promise<{
    promoCode: PromoCode;
    activation: PromoCodeActivation;
    user: User;
  }> {
    const email = dto.email;

    try {
      return await this.prisma.$transaction(
        async tx => {
          // Upsert пользователя
          const user = await tx.user.upsert({
            where: { email },
            create: { email },
            update: {},
          });

          // Получаем промокод
          const promo = await tx.promoCode.findUnique({
            where: { code: dto.code },
          });
          if (!promo) {
            throw new NotFoundException('Promo code not found');
          }

          // Лочим строку
          await tx.promoCode.update({
            where: { id: promo.id },
            data: {},
          });
          // Проверка срока действия
          if (promo.expiresAt.getTime() <= Date.now()) {
            throw new GoneException('Promo code is expired');
          }

          // Проверка: уже активирован?
          const existing = await tx.promoCodeActivation.findUnique({
            where: {
              promoCodeId_userId: {
                promoCodeId: promo.id,
                userId: user.id,
              },
            },
          });
          if (existing) {
            throw new ConflictException('Promo code already activated for this user');
          }

          // Проверка лимита
          const activatedCount = await tx.promoCodeActivation.count({
            where: { promoCodeId: promo.id },
          });
          if (activatedCount >= promo.activationLimit) {
            throw new ConflictException('Promo code activation limit reached');
          }

          // Создаём активацию
          const activation = await tx.promoCodeActivation.create({
            data: {
              promoCodeId: promo.id,
              userId: user.id,
            },
          });

          return { promoCode: promo, activation, user };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Promo code already activated for this user');
      }

      throw error;
    }
  }
}
