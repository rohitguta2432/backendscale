import type { BlogPost } from '@/types/blog';

export const howToHireDeveloperInterviewQuestions: BlogPost = {
  slug: 'how-to-hire-developer-interview-questions',
  title: 'How to Hire a Software Developer: 10 Questions to Ask Before Signing',
  date: '2026-04-05',
  excerpt: 'The 10 questions you should ask before hiring a freelance developer — how to evaluate technical skills, communication, and reliability without being technical yourself.',
  readingTime: '7 min read',
  keywords: ['hire software developer questions', 'evaluate developer', 'technical interview freelancer', 'hire developer india'],
  sections: [
    {
      heading: 'Why Most Hiring Goes Wrong',
      content: `Non-technical founders get burned by developers all the time. The pattern is always the same: you find someone on Upwork or through a referral, they seem competent, you agree on a price, and then three months later you have a half-built app, an empty bank account, and no source code.

I'm a freelance developer telling you how to evaluate freelance developers. Yes, this is self-serving — but I'd rather compete against higher standards than race to the bottom.

Here are the 10 questions I wish every client asked me before signing. The good developers will have clear answers. The bad ones will dodge.`
    },
    {
      heading: 'The 10 Questions',
      content: `**1. "Can you show me 2-3 live projects you built?"**
Not mockups. Not designs. Live, working software that real people use. If they can't show you something live, they haven't shipped. Ask for URLs and poke around — does the app actually work? Is it fast?

**2. "What tech stack will you use and why?"**
The answer should reference YOUR requirements, not their preferences. "I'll use React because your app needs fast, interactive UI and it's easy to hire React developers later" is a good answer. "I always use React" is a bad answer.

**3. "How will you handle authentication and security?"**
This is a trap question. If they say "I'll build it myself," run. Authentication should use a battle-tested service (Clerk, Supabase Auth, Auth0). Any developer building custom auth in 2026 is either inexperienced or reckless.

**4. "What's your deployment plan?"**
They should mention: hosting provider, CI/CD pipeline, environment management (dev/staging/prod), and monitoring. If they say "I'll deploy it to a server," ask which server, how, and who monitors it at 2 AM.

**5. "How will we communicate during the project?"**
Weekly updates are the minimum. I do weekly video demos on Friday. They should propose a specific cadence, not just "we'll stay in touch."`
    },
    {
      heading: 'Questions 6-10',
      content: `**6. "What happens if you get hit by a bus?"**
Morbid, but essential. Where is the code? Who else can access it? Is it in a private GitHub repo that you own, or on their personal machine? Your code should live in YOUR GitHub/GitLab organization from day one.

**7. "How do you handle scope changes?"**
The right answer is a change request process with cost estimates before work begins. "We'll figure it out" means they'll either overcharge you later or cut corners to stay within the original budget.

**8. "What's your testing strategy?"**
At minimum: manual testing of critical flows before each release. Better: automated tests for business logic. If they look confused when you ask about testing, that's your answer.

**9. "Can you walk me through the architecture of your last project?"**
This separates developers who build from developers who copy tutorials. They should explain their decisions clearly — why they chose certain technologies, what trade-offs they made, what they'd do differently.

**10. "What's your payment structure?"**
Red flags: 100% upfront, hourly with no cap, vague milestones. Good structure: milestone-based payments tied to deliverables. My structure: 30% upfront, 30% at midpoint demo, 40% at delivery and deployment.`
    },
    {
      heading: 'Red Flags and Green Flags',
      content: `**Green flags:**
- Portfolio of live, working projects (not just screenshots)
- Clear communication — responds within 24 hours, writes coherently
- Asks YOU questions about the business problem before talking about technology
- Provides a written proposal with scope, timeline, and cost breakdown
- Uses version control (Git) and gives you repository access from day one
- Has a contract that protects both sides

**Red flags:**
- "I can build anything in any language" — Generalists rarely ship quality
- No portfolio or only Figma mockups — If they haven't shipped, they can't ship yours
- Won't show code samples — Why not?
- Quotes without asking questions — If they price your project in 5 minutes, they don't understand it
- No contract or milestone structure — Protect both sides
- Disappears for days without updates — This will only get worse during the project

**Price expectations in India (2026):**
- Junior freelancer: ₹500-1,500/hour
- Mid-level freelancer: ₹1,500-3,500/hour
- Senior freelancer (5+ years, portfolio): ₹3,500-7,000/hour
- Agency: ₹5,000-15,000/hour (but you're paying for overhead)

If someone quotes dramatically below market rate, they're either desperate or lying about their experience. Both are bad.`
    },
    {
      heading: 'How I Handle These Questions',
      content: `I'll answer my own questions so you know what good answers look like:

1. **Live projects:** rohitraj.tech/projects — ClinIQ AI, StellarMIND, SanatanApp, myFinancial, MicroItinerary. All live.
2. **Tech stack:** I recommend based on requirements. Spring Boot for complex backends, Next.js for web apps, React Native for mobile.
3. **Auth:** Supabase Auth or Clerk. Never custom.
4. **Deployment:** AWS Amplify or Vercel with CI/CD from GitHub. Staging + production environments.
5. **Communication:** Weekly Friday demos via video call. WhatsApp/Slack for async.
6. **Bus factor:** Code lives in your GitHub org. I document architecture decisions in the README.
7. **Scope changes:** Written change request with cost estimate. Approved before work begins.
8. **Testing:** Integration tests for critical paths. Manual QA before each release.
9. **Architecture:** Happy to walk through any project — ask me about ClinIQ AI's RAG pipeline or SanatanApp's offline-first architecture.
10. **Payment:** 30-30-40 milestone structure. Contract signed before work begins.

The goal isn't to find a perfect developer. It's to find one who communicates clearly, ships working software, and doesn't disappear. These 10 questions will filter out 80% of the bad ones.`
    }
  ],
  cta: {
    text: 'Looking for a developer who passes all 10? Let\'s talk.',
    href: '/contact'
  }
};
