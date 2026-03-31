import { z } from 'zod';
import { toNumberOrUndefined } from '@/common/utils/zod.schema';

export const createPromoCodeSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .transform(v => v.toUpperCase().replace(/\s+/g, ''))
    .meta({ description: 'Промо-код' }),

  discountPercent: z.coerce.number().min(1).max(100).meta({ description: 'Cкидка (%)' }),
  activationLimit: z.coerce.number().int().min(1).meta({ description: 'Лимит активаций' }),
  expiresAt: z.coerce.date().meta({ description: 'Срок' }),
});

export const listPromoCodesQuerySchema = z.object({
  limit: z.preprocess(toNumberOrUndefined, z.int().min(1).max(100)).optional(),
  offset: z.preprocess(toNumberOrUndefined, z.int().min(0)).optional(),
});

export const activatePromoCodeSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .transform(v => v.toUpperCase().replace(/\s+/g, ''))
    .meta({ description: 'Промо-код' }),
  // email пользователя, от которого создается/берется User
  email: z.email().trim().lowercase().meta({ description: 'Email' }),
});

export type CreatePromoCodeInput = z.infer<typeof createPromoCodeSchema>;
export type ListPromoCodesQueryInput = z.infer<typeof listPromoCodesQuerySchema>;
export type ActivatePromoCodeInput = z.infer<typeof activatePromoCodeSchema>;
