import { z } from 'zod';

export const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  problem: z.string().min(1),
  whatYouGet: z.array(z.string()),
  techStack: z.array(z.string()),
  timeline: z.string(),
  costRange: z.string(),
  portfolioSlugs: z.array(z.string()),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  cta: z.string(),
});

export type Service = z.infer<typeof serviceSchema>;
