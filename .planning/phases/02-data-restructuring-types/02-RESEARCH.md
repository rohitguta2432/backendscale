# Phase 2: Data Restructuring & Types - Research

**Researched:** 2026-04-12
**Domain:** TypeScript data architecture, file splitting, runtime validation
**Confidence:** HIGH

## Summary

Phase 2 extracts data from component files and splits the monolithic 3,184-line `blog-posts.ts` into individual post files. The existing codebase already has a `src/data/` directory with typed exports (`projects.ts`, `services.ts`, `github.ts`, `blog-posts.ts`), but several components define large data arrays inline (AIProjects, Testimonials, K6Results). The blog data file contains 20 posts in a single array -- this is the primary split target.

The work is purely structural refactoring with no new dependencies required. TypeScript interfaces already exist for most data structures (`BlogPost`, `Project`, `Service`, `Repository`). The main additions are: (1) splitting blog posts into individual files with an index barrel, (2) extracting inline component data to `src/data/`, (3) adding a centralized types directory, and (4) adding Zod for runtime validation of data structures.

**Primary recommendation:** Split blog posts into `src/data/posts/{slug}.ts` files with a barrel `index.ts`, extract component inline data to `src/data/`, add Zod schemas for runtime validation, and centralize shared TypeScript types in `src/types/`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| QUAL-01 | Blog data split from monolithic file into individual post files | 20 blog posts identified by slug in 3,184-line file; `generateStaticParams` and `find()` patterns mapped across 4 consumer files |
| QUAL-02 | Large hardcoded data structures extracted from component files | AIProjects (30 lines inline), Testimonials (23 lines inline), K6Results (32 lines inline), ReliabilitySection cardConfigs (25 lines inline) identified |
| QUAL-03 | Proper TypeScript types and runtime validation for data structures | Existing interfaces (BlogPost, Project, Service, Repository) mapped; Zod recommended for runtime validation |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- Next.js 16 App Router with React 19, Tailwind CSS 4, TypeScript
- Path alias: `@/*` maps to `./src/*`
- All content data currently in `src/data/`
- No test runner configured yet
- Commands: `npm run dev`, `npm run build`, `npm run lint`

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ^5 | Static typing | Already in project [VERIFIED: package.json] |
| Next.js | 16.1.6 | Framework (App Router) | Already in project [VERIFIED: package.json] |

### Supporting (new)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | ^3.24 | Runtime validation schemas | Validate data at import boundaries to catch malformed posts/projects before rendering [ASSUMED: 3.24 is latest stable 3.x] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| zod | TypeScript-only (no runtime validation) | TS types are erased at runtime -- malformed data silently renders broken pages; QUAL-03 explicitly requires runtime validation |
| zod | io-ts / yup / valibot | Zod has the largest ecosystem, best TS inference, and is the de facto standard for TS runtime validation |

**Installation:**
```bash
npm install zod
```

## Architecture Patterns

### Current Data File Structure
```
src/data/
  blog-posts.ts    # 3,184 lines -- 20 posts in one array (SPLIT TARGET)
  projects.ts      # 323 lines -- 6 projects + repos + notes arrays
  services.ts      # 333 lines -- 6 services
  github.ts        # 246 lines -- repositories, contributions, projectNotes, filterCategories
```

### Recommended Post-Refactor Structure
```
src/
  types/
    index.ts           # Re-exports all types
    blog.ts            # BlogPost interface + Zod schema
    project.ts         # Project interface + Zod schema
    service.ts         # Service interface + Zod schema
    github.ts          # Repository, Contribution, ProjectNote interfaces + schemas
    testimonial.ts     # Testimonial interface + Zod schema
    k6.ts              # TestResult interface + Zod schema
    reliability.ts     # CardConfig interface + Zod schema
  data/
    posts/
      index.ts         # Barrel: imports all posts, validates, re-exports array
      rag-for-sql.ts
      spring-boot-mcp.ts
      pwa-offline-sync.ts
      ... (17 more individual post files)
    projects.ts        # Unchanged location, imports types from @/types
    services.ts        # Unchanged location, imports types from @/types
    github.ts          # Unchanged location, imports types from @/types
    testimonials.ts    # NEW: extracted from Testimonials component
    k6-results.ts     # NEW: extracted from K6Results component
    ai-projects.ts    # NEW: extracted from AIProjects component (inline project summaries)
    reliability.ts    # NEW: extracted cardConfigs from ReliabilitySection
```

### Pattern 1: Individual Post Files with Barrel Export
**What:** Each blog post is a separate file exporting a single `BlogPost` object. A barrel `index.ts` collects them into the `blogPosts` array.
**When to use:** When a single data file exceeds ~500 lines and contains independent, identifiable entries.
**Example:**
```typescript
// src/data/posts/rag-for-sql.ts
import type { BlogPost } from '@/types/blog';

export const ragForSql: BlogPost = {
  slug: 'rag-for-sql',
  title: 'Using RAG for SQL Generation...',
  // ... rest of post data
};

// src/data/posts/index.ts
import { blogPostSchema } from '@/types/blog';
import { ragForSql } from './rag-for-sql';
import { springBootMcp } from './spring-boot-mcp';
// ... all imports

const rawPosts = [ragForSql, springBootMcp, /* ... */];

// Runtime validation
export const blogPosts = rawPosts.map((post, i) => {
  const result = blogPostSchema.safeParse(post);
  if (!result.success) {
    console.error(`Invalid blog post at index ${i} (${post.slug}):`, result.error.flatten());
    throw new Error(`Blog post validation failed: ${post.slug}`);
  }
  return result.data;
});
```

### Pattern 2: Zod Schema + TypeScript Type Co-location
**What:** Define Zod schema first, infer TypeScript type from it. This ensures types and runtime validation never drift.
**When to use:** For all data structures that need runtime validation.
**Example:**
```typescript
// src/types/blog.ts
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
```

### Pattern 3: Component Data Extraction
**What:** Move inline data arrays from component files to dedicated data files.
**When to use:** Any component with >50 lines of raw data defined inline.
**Example:**
```typescript
// src/data/testimonials.ts
import type { Testimonial } from '@/types/testimonial';

export const testimonials: Testimonial[] = [
  { name: "Client Name", role: "Founder, Startup Name", ... },
  // ...
];

// src/components/Testimonials.tsx (after)
import { testimonials } from '@/data/testimonials';
// Component now only contains rendering logic
```

### Anti-Patterns to Avoid
- **Breaking the import path contract:** The `blogPosts` export name and its type must remain identical. Consumers use `blogPosts.find(p => p.slug === slug)` and `blogPosts.filter()` -- the barrel must export the same named array.
- **Losing `generateStaticParams`:** The notes route uses `blogPosts` in `generateStaticParams()` to pre-render all blog pages at build time. The refactored barrel must be importable in server components without side effects.
- **Validation at render time:** Validate at import/module-load time, not inside render functions. Failing at build/startup is better than failing per-request.
- **Over-splitting small files:** `projects.ts` (323 lines, 6 items) and `services.ts` (333 lines, 6 items) don't need per-item splitting -- they're manageable as single files. Only blog-posts.ts at 3,184 lines with 20 items warrants splitting.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Runtime type validation | Custom if/typeof checks | Zod schemas | Zod gives typed parse results, detailed error messages, and type inference for free |
| Date format validation | Regex-only checks | `z.string().regex(/^\d{4}-\d{2}-\d{2}$/)` | Consistent with other Zod validations in the pipeline |
| Barrel file generation | Manual index.ts | Hand-write once (20 imports) | Only 20 posts -- auto-generation adds complexity for negligible benefit |

## Common Pitfalls

### Pitfall 1: Breaking Blog Route Resolution
**What goes wrong:** After splitting blog-posts.ts, blog URLs return 404 because `generateStaticParams` or `blogPosts.find()` fails silently.
**Why it happens:** The barrel index doesn't export the same array shape, or a post slug is misspelled in the individual file.
**How to avoid:** Run `npm run build` after the split -- Next.js static generation will fail loudly if any route param is broken. Add a validation step in the barrel that checks for duplicate slugs.
**Warning signs:** Build warnings about missing static params, or the dev server showing 404 on previously working blog URLs.

### Pitfall 2: Circular Import Between Types and Data
**What goes wrong:** Putting Zod schemas in the same file as data creates import cycles when types reference each other.
**Why it happens:** If `types/blog.ts` imports from `data/` and `data/posts/index.ts` imports from `types/`.
**How to avoid:** Keep types/schemas in `src/types/` with zero imports from `src/data/`. Data files import from types, never the reverse.
**Warning signs:** TypeScript or webpack errors about circular dependencies.

### Pitfall 3: AIProjects Inline Data is NOT the Same as projects.ts
**What goes wrong:** Developer assumes AIProjects component data duplicates `src/data/projects.ts` and removes it.
**Why it happens:** Both contain project info, but the AIProjects inline array has a different shape (title, problem, solution, techStack, aiApproach, repoUrl, status, image) vs. the Project interface in projects.ts (slug, name, problem, solves, techStack, status, repoUrl, aiApproach, image, images, details).
**How to avoid:** Create a separate `AIProjectSummary` type for the landing page component data. Or derive the landing page data from the full `projects.ts` data using a mapper function. The mapper approach is preferred -- single source of truth.
**Warning signs:** Landing page shows different project info than the project detail pages.

### Pitfall 4: Zod Validation Throwing at Build Time
**What goes wrong:** If validation throws during module initialization, the entire Next.js build fails with an unclear error.
**Why it happens:** Zod `.parse()` throws on invalid data. If a post has a typo, the build crashes.
**How to avoid:** Use `.safeParse()` with a descriptive error message that includes the slug/index. During development, log warnings instead of throwing. In production builds, throw to prevent deploying broken data.
**Warning signs:** Build errors in seemingly unrelated files (Next.js traces can be misleading with module-level errors).

## Data Consumer Map

All files that import from `src/data/` -- each must be updated when import paths change:

| Consumer File | Imports From | Uses |
|---------------|-------------|------|
| `src/app/[locale]/notes/[slug]/page.tsx` | `blog-posts` | `generateStaticParams`, `blogPosts.find()`, `blogPosts.filter()` |
| `src/app/[locale]/notes/NotesPageClient.tsx` | `blog-posts`, `github` | `blogPosts` array, github exports |
| `src/app/feed.xml/route.ts` | `blog-posts` | RSS feed generation |
| `src/app/sitemap.ts` | `blog-posts`, `projects`, `services` | Sitemap generation |
| `src/app/[locale]/projects/[slug]/page.tsx` | `projects` | `projects.find()` |
| `src/app/[locale]/projects/[slug]/opengraph-image.tsx` | `projects` | OG image generation |
| `src/app/[locale]/projects/page.tsx` | `projects` | Project listing |
| `src/app/[locale]/repos/page.tsx` | `projects` | `repos` export |
| `src/app/[locale]/services/[slug]/page.tsx` | `services`, `projects` | Service detail |
| `src/app/[locale]/services/page.tsx` | `services` | Service listing |
| `src/components/ProjectCard.tsx` | `projects` (type only) | `Project` type import |
| `src/components/CurrentWork.tsx` | `projects` | Project data |

## Code Examples

### Validated barrel export pattern
```typescript
// src/data/posts/index.ts
import { blogPostSchema } from '@/types/blog';
import type { BlogPost } from '@/types/blog';

// Import all individual posts
import { ragForSql } from './rag-for-sql';
import { springBootMcp } from './spring-boot-mcp';
import { pwaOfflineSync } from './pwa-offline-sync';
// ... remaining 17 imports

const allPosts: BlogPost[] = [
  ragForSql,
  springBootMcp,
  pwaOfflineSync,
  // ... remaining 17
];

// Validate all posts at module load time
if (process.env.NODE_ENV !== 'production') {
  allPosts.forEach((post) => {
    const result = blogPostSchema.safeParse(post);
    if (!result.success) {
      console.error(`[DATA] Invalid blog post "${post.slug}":`, result.error.flatten());
    }
  });
}

// Check for duplicate slugs
const slugs = allPosts.map(p => p.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length > 0) {
  throw new Error(`Duplicate blog post slugs: ${dupes.join(', ')}`);
}

// Sort by date descending (newest first)
export const blogPosts: BlogPost[] = [...allPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
```

### Deriving AIProjects data from projects.ts
```typescript
// src/data/ai-projects.ts
import { projects } from './projects';

// Derive landing page summaries from full project data
// Excludes rohitraj-site (not an AI project)
export const aiProjectSummaries = projects
  .filter(p => p.aiApproach) // Only AI projects
  .map(p => ({
    title: p.name,
    problem: p.problem,
    solution: p.solves,
    techStack: p.techStack,
    aiApproach: p.aiApproach!,
    repoUrl: p.repoUrl,
    status: p.status === 'active' ? 'development' as const : p.status,
    image: p.image,
  }));
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None configured (TEST-01 is Phase 7) |
| Config file | none |
| Quick run command | `npm run build` (static generation validates routes) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| QUAL-01 | Blog routes resolve after split | smoke | `npm run build` (generateStaticParams validates all slugs) | N/A (build-time) |
| QUAL-02 | No inline data >50 lines in components | manual | grep for array literals in component files | N/A |
| QUAL-03 | Runtime validation catches malformed data | smoke | `npm run build` (validation runs at module load) | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (catches broken imports and route resolution)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Full build succeeds, all blog routes resolve, lint passes

### Wave 0 Gaps
- None -- no test framework needed for this phase. Build-time validation via Next.js static generation is sufficient.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Zod ^3.24 is the latest stable 3.x release | Standard Stack | Minor -- npm install will get actual latest; if 4.x is stable, API may differ slightly |
| A2 | AIProjects inline data can be derived from projects.ts | Architecture Patterns | Medium -- if the shapes are intentionally different, we need a separate data source |
| A3 | Validation should throw during build but warn during dev | Code Examples | Low -- could also always throw; user preference |

## Open Questions

1. **AIProjects data: derive or duplicate?**
   - What we know: AIProjects component has inline data that overlaps with but differs from `projects.ts`. The inline version has `title` (vs `name`), `solution` (vs `solves`), and excludes the `details` block.
   - What's unclear: Whether these differences are intentional (different content) or accidental (copy-paste drift).
   - Recommendation: Derive from `projects.ts` using a mapper -- single source of truth. If content differs intentionally, update `projects.ts` to be canonical.

2. **Header navLinks: extract or leave?**
   - What we know: Header has a 7-item `navLinks` array (7 lines). Well under the 50-line threshold.
   - Recommendation: Leave in component. It's config, not data, and it depends on the `locale` prop.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | -- |
| V3 Session Management | no | -- |
| V4 Access Control | no | -- |
| V5 Input Validation | yes | Zod schemas validate all data structures at module load time |
| V6 Cryptography | no | -- |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed data injection via content files | Tampering | Zod runtime validation at import boundary |

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/data/blog-posts.ts` (3,184 lines, 20 posts), `src/data/projects.ts` (323 lines), `src/data/services.ts` (333 lines), `src/data/github.ts` (246 lines)
- Codebase analysis: Component inline data in AIProjects.tsx, Testimonials.tsx, K6Results.tsx, ReliabilitySection.tsx
- Codebase analysis: 12 consumer files mapped via grep of `@/data` imports
- `package.json` and `tsconfig.json` for project configuration

### Secondary (MEDIUM confidence)
- Zod documentation for schema patterns [ASSUMED: based on training data for Zod 3.x API]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - only adding Zod; everything else already exists in project
- Architecture: HIGH - patterns are straightforward file splitting with barrel exports
- Pitfalls: HIGH - identified from direct codebase analysis of import consumers and data shapes

**Research date:** 2026-04-12
**Valid until:** 2026-05-12 (stable domain, no fast-moving dependencies)
