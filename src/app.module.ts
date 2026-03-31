import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PromoCodesModule,
    UsersModule,
  ],
})
export class AppModule {}
