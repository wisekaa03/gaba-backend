import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { PromoCodesService } from '@/promo-codes/promo-codes.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  activatePromoCodeSchema,
  ActivatePromoCodeInput,
  CreatePromoCodeInput,
  createPromoCodeSchema,
  listPromoCodesQuerySchema,
  ListPromoCodesQueryInput,
} from '@/promo-codes/schemas/promo-codes.zod';
import { uuidSchema } from '@/common/utils/zod.schema';

@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Post()
  @HttpCode(201)
  create(@Body(new ZodValidationPipe(createPromoCodeSchema)) body: CreatePromoCodeInput) {
    return this.promoCodesService.create(body);
  }

  @Get()
  list(
    @Query(new ZodValidationPipe(listPromoCodesQuerySchema))
    query: ListPromoCodesQueryInput,
  ) {
    return this.promoCodesService.list(query);
  }

  @Get(':id')
  getById(@Param('id', new ZodValidationPipe(uuidSchema)) id: string) {
    return this.promoCodesService.getById(id);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', new ZodValidationPipe(uuidSchema)) id: string) {
    return this.promoCodesService.delete(id);
  }

  @Post('activate')
  @HttpCode(201)
  activate(@Body(new ZodValidationPipe(activatePromoCodeSchema)) body: ActivatePromoCodeInput) {
    return this.promoCodesService.activate(body);
  }
}
