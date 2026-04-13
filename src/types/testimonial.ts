import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  text: z.string().min(1),
  project: z.string().min(1),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
