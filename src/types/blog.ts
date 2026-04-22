import { z } from 'zod';

const blogSectionSchema = z.object({
  heading: z.string().min(1),
  content: z.string().min(1),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
});

export const blogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  excerpt: z.string().min(1),
  readingTime: z.string(),
  keywords: z.array(z.string()),
  relatedProject: z.string().optional(),
  coverImage: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
  sections: z.array(blogSectionSchema).min(1),
  cta: z.object({
    text: z.string(),
    href: z.string(),
  }).optional(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
