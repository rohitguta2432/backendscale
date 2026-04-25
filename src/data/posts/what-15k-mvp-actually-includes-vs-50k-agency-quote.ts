import type { BlogPost } from '@/types/blog';

export const what15kMvpActuallyIncludesVs50kAgencyQuote: BlogPost = {
  slug: 'what-15k-mvp-actually-includes-vs-50k-agency-quote',
  title: 'What a $15K MVP Actually Includes — vs. the $50K Agency Quote You Just Got',
  date: '2026-04-25',
  excerpt: 'A $15K-$30K fixed-price MVP and a $50K-$100K agency quote ship the same thing 80% of the time. The difference is who absorbs the markup. Here is the line-item breakdown — what is in scope, what is overhead, and where the agency margin actually comes from.',
  readingTime: '11 min read',
  keywords: [
    'mvp cost breakdown 2026',
    '15k mvp vs 50k agency',
    'mvp pricing',
    'agency markup mvp',
    'what does 15k mvp include',
    'fixed price mvp india',
    'mvp 50k agency quote',
  ],
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: 'What a $15K MVP Actually Includes — vs. the $50K Agency Quote You Just Got',
      content: `If you have just received a $50K-$120K agency quote for an MVP, this post is the line-item breakdown of where that money goes — and how the same scope ships at $15K-$30K with a senior contractor in 6 weeks. The gap is not magic. It is overhead, markup, and project-management theater that does not touch your codebase.

Agencies are not scams. A few are excellent. The vast majority bill your project as billable hours times a senior multiplier, then add a 30-50% markup for project managers, account managers, designers, and overhead. For a fully-staffed enterprise project, that overhead earns its keep. For a 6-week MVP that needs one engineer with strong opinions and a scope doc, the overhead is wasted spend.

This post compares two real quotes I have seen in the last 12 months for the same scope: a B2B SaaS MVP with auth, billing, a dashboard, three core features, and one third-party integration. Agency quote was $87,000 over 14 weeks. My quote was $22,000 over 6 weeks. Both shipped. The agency one took 18 weeks, not 14. Mine took 6.`
    },
    {
      heading: 'The $87K Agency Quote — Line by Line',
      content: `Here is the actual breakdown of an $87K MVP agency quote (anonymized, real founder shared this with me):

| Line item | Cost | Hours / Notes |
|-----------|------|---------------|
| Discovery & requirements | $6,500 | 50 hours, 4 founders + 3 agency staff |
| UX design & wireframes | $9,000 | 80 hours, designer + reviews |
| UI design (Figma mockups) | $11,000 | 100 hours, 3 design rounds |
| Frontend development | $18,000 | 180 hours, 2 mid-level devs |
| Backend development | $16,000 | 160 hours, 1 senior + 1 junior |
| Database & API design | $5,500 | 50 hours |
| QA & testing | $7,000 | 70 hours, dedicated QA |
| Project management | $8,000 | weekly meetings, status updates |
| DevOps / deployment | $4,000 | one-time setup |
| Buffer / contingency | $2,000 | 5% buffer |
| **Total** | **$87,000** | **14 weeks** |

The hours look reasonable on paper. The reality: 35% of the hours are coordination, status calls, and design reviews. The actual code-shipping work is 280 hours, the rest is overhead. At the agency's blended rate of ~$100/hour, the founder pays $87K for ~$28K of actual engineering and ~$59K of process.

This is not unique to one agency. I have seen variants of this exact breakdown 8 times. The discovery phase is always 4-8 weeks. The design phase always has 3+ rounds. The PM line item is always present. The buffer is always there.`
    },
    {
      heading: 'The $22K Sprint Quote — Same Scope, Different Math',
      content: `Same B2B SaaS MVP, same auth + billing + dashboard + 3 features + 1 integration, scoped as a 6-week sprint:

| Line item | Cost | Notes |
|-----------|------|-------|
| Scope doc & technical planning | Included | 3-5 days before sprint, fixed |
| Architecture & database design | Included | Day 1-2 of sprint |
| Frontend, backend, database, integrations | Included | Weeks 1-5 of sprint |
| Auth, billing, deployment, monitoring | Included | Weeks 1 and 5 |
| QA & bug bash | Included | Week 6 |
| Production deploy & launch | Included | Week 6 |
| Post-launch bug-fix support | Included | 2 weeks after launch |
| Knowledge transfer / handoff | Included | 1-hour Zoom + docs |
| **Total** | **$22,000** | **6 weeks** |

Notice what is missing from this quote: there is no discovery phase, no design phase, no PM line item, no buffer. Those costs do not disappear — they are absorbed differently:

- **Discovery**: replaced by a 1-page scope doc (3-5 days, included). The founder writes their own value prop in 90 minutes; the engineer writes the technical scope in 4 hours.
- **Design**: replaced by shadcn/ui or DaisyUI components. Bespoke design is v2 work, not MVP work.
- **Project management**: there is no PM. The founder talks to the engineer directly on Slack. One weekly check-in call. Issues in the GitHub repo. Total PM time per week: 30 minutes.
- **Buffer**: scope is fixed. Mid-sprint changes are swaps (drop one feature, add another) or pushed to v2. No buffer needed because no scope creep is allowed.

The total cost difference is 4x. The shipped product is functionally identical for the first 6 months. After 6 months, the agency MVP and the sprint MVP both need a v2.`
    },
    {
      heading: 'Where the Agency Markup Actually Comes From',
      content: `The agency model has three structural costs that do not exist in a senior contractor model:

**1. Account management and sales overhead.** Agencies have salespeople, account managers, and partner relationships. Their cost gets baked into your hourly rate. When you pay $100/hour, the engineer gets $40, the agency keeps $60 for overhead and margin. Senior contractors do not have account managers, so the engineer keeps 100% of the rate.

**2. Junior + senior staffing model.** Agencies pair a senior on architecture with juniors on implementation. This is great for training juniors. It is bad for your timeline because the junior writes 60% of the code and the senior reviews and rewrites 30% of it. Net velocity is lower than one senior writing 100%.

**3. Process tax.** Agile ceremonies, design reviews, stakeholder meetings, status reports, retrospectives. All useful for a 12-month enterprise engagement. None useful for a 6-week MVP. The process tax is real money — typically 25-35% of project hours.

A senior contractor charges what an agency charges minus the three taxes. That is the entire pricing gap. Quality of code is identical (the senior contractor *is* the senior architect at the agency, except they are working solo). Quality of design is similar (component libraries cover 80% of MVP UI). Quality of project management is higher (founder-to-engineer direct, no telephone game).

The trade-off: contractors do not scale to 5+ engineers on one project. If your scope genuinely needs 5 engineers, hire an agency or a small product studio. For 1-2 engineer scope (95% of MVPs), the contractor wins on every metric.`
    },
    {
      heading: 'When the Agency Is Actually Worth It',
      content: `Three scenarios where I would tell a founder to pay the $87K agency quote instead of the $22K sprint:

**1. You need bespoke design as a first-class feature.** If your MVP is design-led — a high-end consumer product, a brand-driven marketplace, a creative tool — the bespoke design is the product. Agencies with strong designers earn the markup here. shadcn UI components do not work for a luxury e-commerce brand.

**2. You need 3+ engineers in parallel on a hard deadline.** If you have a launch tied to a conference or investor demo that is 6 weeks away and the scope is 3-engineer-sized, you need a team that can ramp instantly. A solo contractor cannot deliver 3-engineer output. Agencies can staff 5+ people in 1 week. Worth the markup if the deadline is non-negotiable.

**3. You need ongoing post-launch ownership for 12+ months.** If you do not have plans to hire engineering in-house and you need an external team to own the product for 1-2 years, an agency on a monthly retainer makes sense. Senior contractors typically max out at 6-12 month engagements and get expensive at that duration.

For everything else — pre-seed startups, fixed-budget MVPs, founder-led product validation — the agency markup is overhead you do not need.`
    },
    {
      heading: 'Negotiating the Agency Quote Down (If You Are Already Committed)',
      content: `If you have already signed with an agency or are far down the path, here are five negotiation moves that have worked for founders I have advised:

1. **Cut the discovery phase.** Bring your own 1-page scope doc and refuse to pay for a 50-hour discovery. Most agencies will let you skip it.
2. **Refuse 3 design rounds.** One round + one revision. Use shadcn or DaisyUI as the visual foundation. Saves $5K-$10K.
3. **Drop QA-as-a-line-item.** Engineers should write tests as part of development. Dedicated QA at MVP scale is overhead.
4. **Negotiate fixed-price, not hourly.** Hourly billing has no incentive to ship fast. Fixed-price aligns the agency with your timeline.
5. **Demand a senior engineer, not a team.** Pay for one senior at full rate instead of two mids and a senior at blended rate. Code velocity is higher.

If the agency refuses fixed-price, that is the signal. Walk. The good agencies will fixed-price a clearly-scoped MVP. The ones that insist on hourly are protecting their scope-creep margin.

Or skip the negotiation entirely. [Scope a 6-week MVP sprint](https://rohitraj.tech/en/services/6-week-mvp) with me — fixed price, fixed scope, full GitHub access, 6 weeks to production. Or [hire a founding engineer](https://rohitraj.tech/en/services/hire-founding-engineer-india) for a longer engagement at the same per-week rate.`
    },
  ],
  cta: {
    text: 'Get a Fixed-Price Quote',
    href: '/en/services/6-week-mvp',
  },
};
