export interface BlogPostSummary {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  excerpt: string;
  readingTime: string;
  keywords: string[];
  coverImage?: { src: string; alt: string };
  relatedProject?: string;
}
