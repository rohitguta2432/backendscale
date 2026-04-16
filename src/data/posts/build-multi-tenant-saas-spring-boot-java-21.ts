import type { BlogPost } from '@/types/blog';

export const buildMultiTenantSaasSpringBootJava21: BlogPost = {
  slug: 'build-multi-tenant-saas-spring-boot-java-21',
  title: 'Building a Multi-Tenant Retail SaaS with Spring Boot 3.4 + Java 21 — 12-Module Architecture',
  date: '2026-04-14',
  excerpt: 'How I architected RetailOS — an India-first multi-tenant retail platform with billing, inventory, GST invoicing, khata ledger, and offline sync in a 12-module Maven monorepo.',
  readingTime: '11 min read',
  keywords: ['multi-tenant saas spring boot', 'java 21 spring boot 3.4', 'retail saas india', 'maven multi-module architecture', 'gst invoice generation java'],
  relatedProject: 'retailos',
  sections: [
    {
      heading: 'India\'s Retail Problem: 90% Unorganized',
      content: `India's retail sector is massive — $950 billion — and 90% of it is unorganized. Kirana stores, small electronics shops, clothing boutiques, and general stores. They run on paper registers, basic billing software that can't generate GST-compliant invoices, and zero inventory tracking.

Enterprise POS systems like Zoho Inventory or Unicommerce cost ₹5,000-15,000/month — too expensive for a shop that makes ₹50,000/month profit. And they're designed for large retailers — the UI is overwhelming, the features are overkill, and there's no Hindi support.

RetailOS is built for these shops. Affordable, India-first, works offline, handles GST, and includes a khata (credit ledger) module — because 70% of Indian retail transactions involve extending credit to regular customers.`
    },
    {
      heading: 'Why a 12-Module Maven Monorepo',
      content: `RetailOS has 12 modules, each owning a specific domain:

\`\`\`
retailos/
├── retailos-common/       # Shared kernel: tenant context, security, DTOs
├── retailos-auth/         # JWT + OTP authentication, RBAC
├── retailos-tenant/       # Tenant, Store, Warehouse, BillingCounter
├── retailos-kyc/          # Document verification, DPDP consent
├── retailos-inventory/    # Products, Categories, Stock, Movements
├── retailos-billing/      # Bills, BillItems, Payments (POS)
├── retailos-invoice/      # GST invoice generation, PDF export
├── retailos-khata/        # Credit ledger — entries, balances
├── retailos-file/         # MinIO integration for uploads
├── retailos-sync/         # Offline sync queue, conflict resolution
├── retailos-analytics/    # Dashboard metrics, reports
├── retailos-admin/        # Platform admin, impersonation
├── retailos-audit/        # Immutable event log
└── retailos-app/          # Spring Boot application entry point
\`\`\`

**Why monorepo over microservices?**

For an early-stage product, microservices add deployment complexity without proportional benefit. A monorepo with clean module boundaries gives you:

1. **Single deployment** — one JAR, one container, one health check
2. **Compile-time safety** — if module A depends on module B's API, the compiler catches breaking changes
3. **Shared transaction context** — billing + inventory + khata can participate in the same DB transaction
4. **Easy extraction later** — when a module needs independent scaling, it already has clean interfaces

The modules ARE the microservice boundaries. When the time comes, extraction is straightforward because dependencies are explicit in Maven POMs.`
    },
    {
      heading: 'Multi-Tenancy: Row-Level Isolation',
      content: `Multi-tenancy is the core architectural challenge. Every query, every insert, every audit log must be scoped to the current tenant.

**Three approaches exist:**

1. **Database-per-tenant** — Maximum isolation, maximum cost. 1,000 tenants = 1,000 databases. Unrealistic for SME pricing.
2. **Schema-per-tenant** — Good isolation, moderate cost. Connection pool management gets complex at scale.
3. **Row-level isolation** — All tenants in one database, every table has a \`tenant_id\` column. Lowest cost, requires careful engineering.

RetailOS uses **row-level isolation** with a shared database. Here's how it's enforced:

**TenantContext** in \`retailos-common\` — a ThreadLocal that holds the current tenant ID, set by a Spring Security filter on every request:

The JWT token contains the tenant ID. The security filter extracts it, sets it in TenantContext, and every repository query automatically includes the tenant filter.

**Why this works at scale:**
- PostgreSQL handles thousands of tenants in one database efficiently with proper indexing
- Composite indexes on \`(tenant_id, <domain_column>)\` keep queries fast
- Connection pooling is simple — one pool for all tenants
- Flyway migrations run once, not per-tenant`
    },
    {
      heading: 'The Khata Module: Credit Ledger for Indian Retail',
      content: `This is the feature that makes RetailOS India-first. In Indian retail, "khata" (credit ledger) isn't a nice-to-have — it's how business actually works.

A regular customer walks in, buys ₹500 of groceries, and says "khata mein likh do" (write it in the ledger). The shopkeeper extends credit, tracked in a paper diary. Month-end, the customer settles up. Or doesn't, and the shopkeeper loses track.

**retailos-khata module:**

- **KhataAccount** — One per customer. Tracks total credit extended, total paid, current balance.
- **KhataEntry** — Every credit/debit transaction with date, amount, notes, and linked bill (if any).
- **Balance calculation** — Running balance updated on every entry, verified against sum of entries.
- **Settlement flow** — Partial or full payment recording with automatic balance update.

The khata module integrates directly with billing — when a bill is created with payment type "CREDIT", a KhataEntry is auto-created. No double entry needed.

**Why this matters commercially:** No enterprise POS has this. Zoho, Vend, Square — none of them understand credit-based retail. For an Indian kirana store owner, this single feature justifies the entire platform.`
    },
    {
      heading: 'GST Invoice Generation & Offline Sync',
      content: `**GST Invoicing (retailos-invoice):**

India's GST requires specific invoice formats with GSTIN, HSN codes, CGST/SGST/IGST splits, and sequential invoice numbering. The invoice module:

1. Takes a completed Bill from retailos-billing
2. Applies GST rules based on product HSN code and buyer/seller state
3. Generates a PDF with all legally required fields
4. Stores in MinIO for retrieval and WhatsApp sharing

**Offline Sync (retailos-sync):**

Internet in Tier 2/3 India is unreliable. A billing counter can't stop working because WiFi dropped. The sync module:

1. **Queue-based** — Operations (bill creation, stock movement, khata entry) are queued locally
2. **Conflict resolution** — When connectivity returns, queued operations sync with server. Conflicts resolved by timestamp + operation priority (payments > stock > metadata)
3. **Idempotency** — Every operation has a client-generated UUID. Duplicate syncs are detected and ignored.

This is the hardest engineering problem in RetailOS. Offline sync with conflict resolution is notoriously difficult. The key insight: for retail operations, **last-write-wins** is acceptable for metadata (product names, prices) but **additive-merge** is required for transactions (you never want to lose a sale or payment).`
    },
    {
      heading: 'Infrastructure & What This Demonstrates',
      content: `**Local development stack:**

\`\`\`yaml
services:
  postgres:  # PostgreSQL 16, port 5432
  redis:     # Redis 7, port 6379
  minio:     # S3-compatible storage, port 9000
\`\`\`

**Production-ready features:**
- Swagger UI at \`/api/swagger-ui.html\` for API documentation
- Actuator health checks at \`/api/actuator/health\`
- JaCoCo code coverage reports
- DPDP consent management in KYC module for data privacy compliance

| Architecture Decision | Choice | Why |
|----------------------|--------|-----|
| Multi-tenancy | Row-level isolation | Cost-effective at scale, single DB |
| Module structure | Maven monorepo (12 modules) | Clean boundaries, single deployment |
| File storage | MinIO (S3-compatible) | Self-hosted, zero cloud cost, S3-compatible for migration |
| Auth | JWT + OTP | No password management, mobile-first |
| Offline | Queue + conflict resolution | Tier 2/3 India internet is unreliable |
| Invoicing | GST-compliant PDF generation | Legal requirement, no shortcuts |
| Credit | First-class khata module | How 70% of Indian retail actually works |

**What this project proves:** You can build an enterprise-grade SaaS platform with a single engineer — if the architecture is right. 12 modules, multi-tenancy, offline sync, GST compliance — all shipping from one codebase.`
    }
  ],
  cta: {
    text: 'Need a multi-tenant SaaS platform architected from scratch? I build these.',
    href: '/contact'
  }
};
