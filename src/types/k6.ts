import { z } from 'zod';

export const testResultSchema = z.object({
  scenario: z.string().min(1),
  vus: z.number().int().positive(),
  duration: z.string(),
  requests: z.number().int().nonnegative(),
  rps: z.number().nonnegative(),
  p95: z.number().nonnegative(),
  p99: z.number().nonnegative(),
  errorRate: z.number().nonnegative(),
});

export type TestResult = z.infer<typeof testResultSchema>;
