import { z } from 'zod';
import { toNumberOrUndefined } from '@/common/utils/zod.schema';

export const createUserSchema = z.object({
  email: z.email().trim().lowercase(),
});

export const listUsersQuerySchema = z.object({
  limit: z.preprocess(toNumberOrUndefined, z.number().int().min(1).max(100)).optional(),
  offset: z.preprocess(toNumberOrUndefined, z.number().int().min(0)).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ListUsersQueryInput = z.infer<typeof listUsersQuerySchema>;
