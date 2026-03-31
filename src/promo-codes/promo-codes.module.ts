import { Module } from '@nestjs/common';
import { PromoCodesController } from './controllers/promo-codes.controller';
import { PromoCodesService } from './promo-codes.service';

@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
