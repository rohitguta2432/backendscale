import { z } from 'zod';

export const cardConfigSchema = z.object({
  key: z.enum(['observability', 'loadTesting', 'apiTesting', 'kafkaTesting']),
  icon: z.string().min(1),
  route: z.string().min(1),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export type CardConfig = z.infer<typeof cardConfigSchema>;
