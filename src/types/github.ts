import { z } from 'zod';

export const repositorySchema = z.object({
  name: z.string().min(1),
  fullName: z.string().min(1),
  description: z.string().nullable(),
  language: z.string().nullable(),
  url: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(['active', 'maintenance', 'archived']),
  isFork: z.boolean(),
  modules: z.array(z.string()).optional(),
  problemSolved: z.string().optional(),
  contributionScope: z.string().optional(),
});

export type Repository = z.infer<typeof repositorySchema>;

export const contributionSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['open-source', 'experiment', 'ai-systems']),
  repo: z.string(),
  repoUrl: z.string(),
  summary: z.string(),
  impact: z.string().optional(),
  modules: z.array(z.string()).optional(),
  date: z.string(),
});

export type Contribution = z.infer<typeof contributionSchema>;

export const projectNoteSchema = z.object({
  slug: z.string().min(1),
  projectName: z.string().min(1),
  whyExists: z.string(),
  coreTechnicalChallenge: z.string(),
  architectureSnapshot: z.array(z.string()),
  tradeoffs: z.array(z.string()),
  currentState: z.string(),
  repoUrl: z.string(),
  category: z.enum(['ai-systems', 'backend-infrastructure', 'frontend', 'experiments']),
});

export type ProjectNote = z.infer<typeof projectNoteSchema>;
