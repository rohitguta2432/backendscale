# Testing Patterns

**Analysis Date:** 2026-04-11

## Test Framework

**Status:** No testing framework configured

**Current state:**
- No test files found in `/home/t0266li/Documents/nexusai/src/`
- No Jest, Vitest, or other test runner configured
- No test-related dependencies in `package.json`
- No test configuration files (jest.config.*, vitest.config.*, etc.)

**Development dependencies:**
- TypeScript ^5
- ESLint 9
- Tailwind CSS 4
- No testing libraries

## Recommended Testing Setup

**For this project type (Next.js portfolio/personal site with Supabase integration):**

Suggested approach:
1. **Test runner:** Vitest (lighter than Jest, native ESM support)
2. **Testing library:** React Testing Library (for component testing) or Testing Library (for DOM testing)
3. **Mocking:** `@testing-library/react` built-in mocking + `vi` for module mocking

## Test File Organization

**Recommended structure:**
- Location: Co-locate test files with source code
- Naming: `ComponentName.test.tsx` next to `ComponentName.tsx`
- Fixtures: `src/__fixtures__/` or `src/__mocks__/` for shared test data
- Integration tests: `src/__tests__/integration/`

**Example layout:**
```
src/
├── components/
│   ├── Hero.tsx
│   ├── Hero.test.tsx          # Component unit test
│   ├── SubscribeForm.tsx
│   └── SubscribeForm.test.tsx
├── lib/
│   ├── supabase.ts
│   ├── supabase.test.ts        # Utility test
│   └── i18n.ts
├── __fixtures__/
│   └── mock-dictionaries.ts    # Shared test data
└── __tests__/
    └── integration/
        └── locale-routing.test.ts
```

## Test Structure

**Recommended suite organization (following Next.js + React patterns):**

```typescript
// Example: Component test structure
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hero from './Hero';

describe('Hero component', () => {
    it('renders hero section with title', () => {
        const mockDict = {
            hero: {
                subtitle: 'Test subtitle',
                titleLine1: 'Test title',
                titleLine2: 'Subtitle text',
                approach: { /* ... */ }
            },
            // ... other dictionary props
        };
        
        render(<Hero dict={mockDict} locale="en" />);
        
        expect(screen.getByText('Test title')).toBeInTheDocument();
    });
    
    it('renders with correct locale', () => {
        // Test locale-specific rendering
    });
});
```

**Patterns:**
- **Setup:** Use beforeEach for shared setup (mocking Supabase client, etc.)
- **Teardown:** afterEach for cleanup (reset mocks, clear DOM)
- **Assertions:** Expect assertions from vitest or @testing-library

## Mocking

**Framework:** Vitest `vi` mock utilities (recommended)

**Patterns for this codebase:**

**1. Mocking Supabase client (`src/lib/supabase.ts`):**
```typescript
import { vi } from 'vitest';
import { subscribeEmail } from '@/lib/supabase';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnValue({
            insert: vi.fn().mockResolvedValue({ error: null })
        })
    },
    subscribeEmail: vi.fn()
}));

describe('subscribeEmail', () => {
    it('returns success when email is valid', async () => {
        const result = await subscribeEmail('test@example.com', 'en');
        expect(result.success).toBe(true);
    });
    
    it('returns error when email already subscribed', async () => {
        // Mock error with code 23505 (duplicate)
        vi.mocked(supabase.from).mockReturnValueOnce({
            insert: vi.fn().mockResolvedValueOnce({
                error: { code: '23505', message: 'Duplicate' }
            })
        });
        
        const result = await subscribeEmail('existing@example.com', 'en');
        expect(result.error).toContain('already subscribed');
    });
});
```

**2. Mocking Next.js navigation:**
```typescript
import { useRouter, usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    notFound: vi.fn(),
    redirect: vi.fn()
}));

describe('LanguageSwitcher', () => {
    beforeEach(() => {
        vi.mocked(usePathname).mockReturnValue('/en/projects');
        vi.mocked(useRouter).mockReturnValue({
            push: vi.fn(),
            // ... other router methods
        });
    });
    
    it('navigates to localized path on locale change', async () => {
        const { push } = useRouter();
        // Test locale switching
    });
});
```

**3. Mocking i18n dictionaries:**
```typescript
import { getDictionary } from '@/lib/i18n';

vi.mock('@/lib/i18n', () => ({
    getDictionary: vi.fn().mockResolvedValue({
        common: { /* mock common dict */ },
        home: { /* mock home dict */ },
        pages: { /* mock pages dict */ },
        meta: { /* mock meta dict */ }
    })
}));
```

**What to Mock:**
- External APIs (Supabase client methods)
- Next.js navigation hooks (`useRouter`, `usePathname`)
- Environment-dependent utilities
- Dynamic imports in `getDictionary()`

**What NOT to Mock:**
- Pure utility functions (type guards, path builders)
- Local component hierarchy (render full component tree)
- DOM APIs (let Testing Library handle these)
- Business logic you're testing

## Fixtures and Factories

**Test Data Structure:**

For this codebase, create shared fixtures in `src/__fixtures__/`:

**`src/__fixtures__/dictionaries.ts`:**
```typescript
import type { Dictionary, Locale } from '@/lib/i18n';

export const mockDictionary: Dictionary = {
    common: {
        nav: {
            home: 'Home',
            projects: 'Projects',
            repos: 'Repos',
            notes: 'Notes',
            about: 'About',
            contact: 'Contact',
            viewCurrentWork: 'View Current Work'
        },
        footer: { brand: 'Rohit Raj' },
        buttons: { /* ... */ },
        language: { switchLanguage: 'Switch Language' },
        subscribe: { /* ... */ }
    },
    home: { /* ... */ },
    pages: { /* ... */ },
    meta: { /* ... */ }
};

export const mockProject = {
    slug: 'test-project',
    name: 'Test Project',
    problem: 'Test problem',
    solves: 'Test solution',
    techStack: ['React', 'Next.js'],
    status: 'active' as const,
    repoUrl: 'https://github.com/test/test',
    details: { /* ... */ }
};

export function createMockDictionary(overrides?: Partial<Dictionary>): Dictionary {
    return { ...mockDictionary, ...overrides };
}
```

**Location:**
- `src/__fixtures__/` for shared test data
- `src/__mocks__/` for module mocks
- Consider `jest.mock()` or Vitest `vi.mock()` for automatic mocking

## Coverage

**Requirements:** Not enforced (no coverage threshold in current setup)

**Recommended targets:**
- Utility functions: 100% coverage (pure functions like `isValidLocale`, `getLocalizedPath`)
- Components: 80%+ coverage (interactions, state changes, error states)
- Pages: 60%+ coverage (harder to test with data fetching)

**View Coverage:**
```bash
# Add to package.json scripts if using Vitest:
"test:coverage": "vitest --coverage"

# View coverage report:
npm run test:coverage
```

## Test Types

**Unit Tests:**
- **Scope:** Individual functions and components in isolation
- **Approach:** Test pure logic, props handling, state updates
- **Examples:** `isValidLocale()`, component prop rendering, error handling in `subscribeEmail()`

**Integration Tests:**
- **Scope:** Multiple components working together or with services
- **Approach:** Test data flow, locale switching, form submission with Supabase
- **Examples:** 
  - LanguageSwitcher + middleware locale persistence
  - SubscribeForm + supabase subscription flow
  - Page rendering with i18n dictionary loading

**E2E Tests:**
- **Framework:** Not configured (could use Playwright or Cypress)
- **When needed:** Full user flows (visit page → switch language → submit form)
- **Not required for this codebase** but valuable for critical paths

## Common Patterns

**Async Testing:**
```typescript
describe('getDictionary', () => {
    it('loads English dictionary', async () => {
        const dict = await getDictionary('en');
        expect(dict.common.nav.home).toBeDefined();
    });
    
    it('falls back to English for missing locale', async () => {
        // Mock missing locale file
        vi.mocked(import).mockRejectedValueOnce(new Error('Not found'));
        
        const dict = await getDictionary('xx');
        expect(dict.common.nav.home).toBe('Home'); // English fallback
    });
});
```

**Error Testing:**
```typescript
describe('subscribeEmail error handling', () => {
    it('handles database errors gracefully', async () => {
        vi.mocked(supabase.from).mockReturnValueOnce({
            insert: vi.fn().mockResolvedValueOnce({
                error: { code: 'PGRST001', message: 'Connection failed' }
            })
        });
        
        const result = await subscribeEmail('test@example.com', 'en');
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });
    
    it('handles try-catch errors', async () => {
        vi.mocked(supabase.from).mockImplementationOnce(() => {
            throw new Error('Unexpected error');
        });
        
        const result = await subscribeEmail('test@example.com', 'en');
        expect(result.success).toBe(false);
        expect(result.error).toContain('Failed to subscribe');
    });
});
```

**React Hook Testing (useState, useEffect):**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

describe('SubscribeForm state management', () => {
    it('updates email state on input change', () => {
        const { result } = renderHook(() => useState(''));
        const [email, setEmail] = result.current;
        
        act(() => {
            setEmail('test@example.com');
        });
        
        expect(result.current[0]).toBe('test@example.com');
    });
});
```

## Setup Configuration (Recommended)

**Install dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/dom @testing-library/user-event jsdom
```

**Create `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'src/test/']
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
});
```

**Create `src/test/setup.ts`:**
```typescript
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock Next.js Image globally
vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} />
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/',
    notFound: vi.fn(),
    redirect: vi.fn()
}));
```

**Update `package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

*Testing analysis: 2026-04-11*
