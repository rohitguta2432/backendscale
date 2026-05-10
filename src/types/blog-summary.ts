export interface BlogPostSummary {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  excerpt: string;
  readingTime: string;
  keywords: string[];
  relatedProject?: string;
}
