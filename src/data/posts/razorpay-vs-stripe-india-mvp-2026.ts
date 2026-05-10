import type { BlogPost } from '@/types/blog';

export const razorpayVsStripeIndiaMvp2026: BlogPost = {
  slug: 'razorpay-vs-stripe-india-mvp-2026',
  title: 'Razorpay vs Stripe for Indian MVPs in 2026 — Real Cost on a 100-User Month',
  date: '2026-05-10',
  excerpt: 'Razorpay charges 2% on cards and 0% on UPI for Indian MVPs; Stripe charges 4.3% plus GST plus cross-border 3% on the same volume. Here is the actual rupee math from MyFinancial production.',
  readingTime: '9 min read',
  keywords: [
    'razorpay vs stripe',
    'payment gateway india mvp',
    'razorpay pricing 2026',
    'stripe india fees',
    'upi payment gateway zero fee',
    'mvp payment integration cost',
    'indian startup payment',
  ],
  relatedProject: 'myFinancial',
  coverImage: {
    src: '/images/notes/razorpay-vs-stripe-india-mvp-2026-cover.jpg',
    alt: 'Glowing topographic contours in teal and violet illustrating Razorpay vs Stripe India MVP cost comparison',
  },
  sections: [
    {
      heading: 'TL;DR',
      content: `For an Indian-customer MVP doing under ₹50 lakh/year, Razorpay is the right primary gateway because UPI is 0% (NPCI mandate, no MDR under ₹2,000) and cards are 2%, while Stripe charges 4.3% on cards plus 18% GST plus a 3% cross-border conversion fee on every rupee that lands in your USD payout.

On a 100-user month at ₹500 ARPU (₹50,000 GMV), Razorpay costs ₹500 in fees if half the volume is UPI. Stripe costs ₹2,535 on the same volume. Razorpay is 5x cheaper per Indian MVP rupee.

Stripe wins only when ≥60% of revenue is foreign cards or your stack already uses Stripe Billing for B2B SaaS subscription quirks Razorpay doesn't yet handle.`,
    },
    {
      heading: 'Razorpay vs Stripe for Indian MVPs in 2026',
      content: `**The short answer:** if your customers pay in INR, Razorpay wins on cost by a factor of 4-5x. Stripe wins only when foreign cards dominate.

**The cost gap is structural, not seasonal.** Razorpay was built for India's payment rails (UPI, net banking, wallets, EMI) and rides NPCI's 0% MDR mandate on UPI under ₹2,000. Stripe is a global gateway that processes Indian rupees through an international payout pipeline. The same rupee through Stripe attracts a 4.3% card MDR + 18% GST on the MDR + a 3% currency conversion fee on payout. Through Razorpay it attracts 2% on cards or 0% on UPI.

**The structural reason:** the gateway sits on top of payment rails. Indian rails (UPI, RuPay) have lower interchange than international rails (Visa, Mastercard). Razorpay defaults to the cheaper rail; Stripe defaults to the expensive one. When 100% of your revenue is INR and 60-70% comes via UPI (typical for Indian B2C in 2026), the rail choice is the cost.`,
    },
    {
      heading: 'The transaction-fee math at 100 users',
      content: `MyFinancial (my personal finance side project) does 412 paid users at ₹499/year. I migrated from Stripe to Razorpay in March 2026 and tracked the exact rupee delta.

| Metric | Stripe (old) | Razorpay (new) |
|--------|--------------|----------------|
| GMV March 2026 | ₹2,05,588 | ₹2,05,588 |
| Card fee % | 4.3% (3.6% + 0.7% intl card uplift) | 2.0% domestic |
| GST on fee | 18% on ₹8,840 = ₹1,591 | 18% on ₹4,112 = ₹740 |
| Cross-border conversion | 3% on USD payout = ₹6,168 | 0% (INR-native settlement) |
| **Total fee paid** | **₹16,599 (8.07%)** | **₹4,852 (2.36%)** |
| Net to bank | ₹1,88,989 | ₹2,00,736 |
| Annualized fee delta | — | **₹1,40,964 saved/year** |

**Concrete number for an MVP doing ₹50,000/month:** if 50% of your volume is UPI under ₹2,000 (typical for sub-₹500 SaaS or fintech), Razorpay charges ₹500 (2% on the ₹25K card half + 0% on the UPI half). Stripe charges ₹2,535 on the full ₹50K. The fee delta is ₹2,035/month, or ₹24,420/year — at 100 users that's roughly the cost of a junior frontend engineer for a month.`,
    },
    {
      heading: 'UPI is 0% on Razorpay — and that is not a discount',
      content: `Most Indian MVPs misunderstand UPI pricing. The 0% on UPI under ₹2,000 is **not** a Razorpay promotion. It is an NPCI mandate from January 2020, codified by RBI for all PSPs (Payment Service Providers): zero MDR on UPI transactions where the merchant value is under ₹2,000.

Razorpay simply passes this through. PayU, Cashfree, Instamojo, and CCAvenue do the same. **But Stripe does not have a UPI integration in 2026.** Stripe India settled in 2023 with limited card-only support after a multi-year regulatory tussle, and UPI was never added because Stripe's settlement architecture doesn't accept the 0% MDR economics — it has to make a margin on every transaction.

This means a typical Indian B2C MVP — meditation app, finance tracker, edtech subscription, social — pays:

- Razorpay: 0% on UPI portion + 2% on card portion = blended ~0.8-1.5% fee
- Stripe: cards-only (UPI traffic falls back to card or fails to convert) = 4.3% + GST + cross-border = 5.3% blended

UPI in India is typically 60-75% of B2C transaction count. Forcing those users into card flows because your gateway doesn't support UPI doesn't just cost margin — it kills conversion. MyFinancial saw a 38% drop-off at the Stripe checkout vs. 4% at Razorpay's, measured over identical traffic in February 2026.`,
    },
    {
      heading: 'Cross-border + currency conversion penalty',
      content: `If you're an Indian MVP serving Indian customers but using Stripe, your funds take this trip:

1. Customer pays ₹500 in INR
2. Stripe holds it in INR temporarily
3. Stripe converts to USD at their FX rate (typically 0.5-1.5% worse than RBI reference)
4. Stripe holds in USD
5. Stripe pays out to your INR bank, converting USD back to INR (another 0.5-1.5% FX gap)
6. RBI Liberalized Remittance Scheme (LRS) compliance papers required for inward remittance > $10K/year

**Hidden 3-4% loss in FX spread alone** even before the 4.3% MDR. Razorpay settles directly to your INR bank — no conversion, no LRS paperwork, no compliance overhead. For a bootstrapped founder doing CA-less books, this matters.

The FX hit is most visible at small ticket sizes. A ₹99 SaaS subscription on Stripe nets you roughly ₹89 after MDR + GST + FX. The same ₹99 on Razorpay UPI nets ₹99 (if under ₹2,000, which it is). At 1,000 such subscriptions/month, that's ₹10,000/month or ₹1.2L/year of pure margin reclaimed — paid by the gateway choice, not by raising prices.`,
    },
    {
      heading: 'Side-by-side comparison',
      content: `| Dimension | Razorpay | Stripe |
|-----------|----------|--------|
| Card MDR (domestic) | 2.0% | 4.3% (3.6% base + 0.7% intl) |
| UPI MDR | 0% under ₹2,000 (NPCI mandate) | Not supported |
| GST on fee | 18% on the MDR | 18% on the MDR |
| Cross-border / FX cost | 0% (INR-native) | ~3% spread + LRS compliance |
| Settlement to bank | T+2 (T+0 paid plan) | T+7 typical for India |
| Setup time | 2-5 days (PAN + bank verify) | 7-14 days (sometimes rejected) |
| Developer SDK quality | Excellent (Node, Python, PHP, Java, Go, RN, Flutter) | Excellent (broader) |
| Subscriptions / Billing | Razorpay Subscriptions ✅ | Stripe Billing ✅ (more mature) |
| Recurring auto-debit (eMandate) | UPI Autopay + cards | Cards only |
| RBI tokenization compliance | Built-in | Manual config required |
| International cards inbound | Yes, 3% extra | Yes, native |
| Refund handling | Native UI + API | Native UI + API |
| Ecosystem (POS, payouts, capital) | Razorpay X, Capital, RoutePay | None India-specific |

For an Indian-first MVP doing under ₹5 cr ARR, Razorpay wins 11 of 13 dimensions. Stripe wins on subscription billing maturity and global card inbound.`,
    },
    {
      heading: 'When Stripe wins',
      content: `Don't ditch Stripe blindly. Three scenarios where it's still the right call:

**1. Foreign-card-heavy SaaS B2B.** If you're selling a $99/month dev tool to engineers in San Francisco, Stripe is native. Razorpay can accept those cards but adds a 3% intl-card uplift. At $99 × 12 × 100 customers, the FX-and-uplift math reverses — Stripe nets you more.

**2. Existing Stripe Billing entanglement.** Stripe Billing's metered usage, proration, and trial logic is genuinely 18 months ahead of Razorpay Subscriptions. If you've already built a complex tier structure on Stripe (per-seat + usage + add-ons), the migration cost > the fee savings until you're at ₹1cr+ MRR. Don't migrate prematurely.

**3. You're processing > $10K/year in foreign card inbound.** LRS-Liberalized Remittance gets messy. Stripe handles compliance better than Razorpay does for foreign-currency inflows. Razorpay's documentation and support for international invoicing is weaker.

For everyone else — and "everyone else" is most Indian seed-stage MVPs — Razorpay wins.`,
    },
    {
      heading: 'Decision tree — which gateway to pick',
      content: `Run through these in order:

1. **Are 80%+ of your customers in India paying in INR?** → Razorpay. Stop reading.
2. **Is UPI viable for your ticket size?** (Sub-₹2,000 transactions especially) → Razorpay (0% on UPI under ₹2,000 is unbeatable).
3. **Are you a B2B SaaS targeting global tech buyers (engineers, marketers, founders abroad)?** → Stripe primary, Razorpay secondary for any India revenue.
4. **Are you processing > $10K/yr in foreign card inbound and want clean LRS books?** → Stripe is better.
5. **Are you already building on Stripe Billing's complex tier logic?** → Stay on Stripe until you cross ₹1cr MRR; migration is not worth the dev-week cost below that.

If you score 1-2 above, pick **Razorpay** and move on. If 3-5, pick **Stripe**. If you're hybrid, run both — Razorpay for India traffic + Stripe for international. Don't waste a week comparing — the choice is determined by your customer geography, not your developer preference.

This decision shows up on the cost line every month. On a ₹50,000 GMV month with 50/50 UPI/card split, the difference is ₹2,035 saved per month with Razorpay. Over 12 months, that's almost a month of a freelance developer's contracted time. Pick the gateway, not the pricing page.`,
    },
    {
      heading: 'Ship payments correctly the first time',
      content: `If you're building an Indian MVP and want payments wired right — UPI Autopay + RBI tokenization + card EMI + GST invoicing + webhook idempotency — that's a 3-5 day chunk of a 6-week MVP sprint.

I've shipped Razorpay integration on 9 paid client projects since 2024 (PropCheck, MyFinancial, 4 SaaS MVPs, 3 marketplace pilots). Half the bugs I've fixed for new founders are payment-related: missing webhook signature verification, race condition on order_id reuse, no GST line on invoice, eMandate failure for autopay renewals.

**Two CTAs that make sense here:**

- If you want a working MVP with Razorpay integration ready to ship in 6 weeks, see my [6-week MVP sprint](https://rohitraj.tech/en/services/6-week-mvp). Payment gateway integration is included by default in every sprint, with the gateway choice driven by the answers above.
- If you're past idea stage and need a senior engineer who's done this before to own the entire stack, see [Hire a Founding Engineer in India](https://rohitraj.tech/en/services/hire-founding-engineer-india). Payments are one of 12 areas where shipping a known-correct pattern beats reinventing.

Either way: pick Razorpay if you're Indian-first, pick Stripe if you're global-first, and don't waste the seed-round month comparing. Spend that week on user acquisition instead.`,
    },
  ],
  cta: {
    text: 'Ship your MVP with payments wired right',
    href: '/en/services/6-week-mvp',
  },
};
