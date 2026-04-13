import { z } from 'zod';

export const projectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  problem: z.string().min(1),
  solves: z.string().min(1),
  techStack: z.array(z.string()),
  status: z.enum(['active', 'iterating', 'paused']),
  repoUrl: z.string().optional(),
  aiApproach: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.object({
    src: z.string(),
    caption: z.string(),
  })).optional(),
  details: z.object({
    businessImpact: z.string(),
    approach: z.array(z.string()),
    decisions: z.array(z.string()),
    currentStatus: z.string(),
    roadmap: z.array(z.string()),
    improvements: z.array(z.string()),
  }),
});

export type Project = z.infer<typeof projectSchema>;
