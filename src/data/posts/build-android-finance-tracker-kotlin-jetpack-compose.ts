import type { BlogPost } from '@/types/blog';

export const buildAndroidFinanceTrackerKotlinJetpackCompose: BlogPost = {
  slug: 'build-android-finance-tracker-kotlin-jetpack-compose',
  title: 'Building an Android Finance Tracker with SMS Auto-Import — Kotlin + Jetpack Compose',
  date: '2026-04-15',
  excerpt: 'How I built FinBaby — an offline Android app that reads bank SMS messages, auto-categorizes transactions, and provides 50/30/20 budgeting for Indian middle-class families.',
  readingTime: '9 min read',
  keywords: ['android finance tracker app', 'kotlin jetpack compose tutorial', 'bank sms auto import android', 'personal finance app india', 'room database android 2026'],
  relatedProject: 'finbaby',
  sections: [
    {
      heading: 'Why Another Finance App?',
      content: `India processes 13 billion+ UPI transactions per month. Every transaction generates a bank SMS. And yet, most Indians either don't track expenses at all, or they manually type numbers into a spreadsheet every weekend (and give up by February).

The problem isn't awareness — everyone knows they should track spending. The problem is **data entry friction**. If logging an expense takes more than 5 seconds, people won't do it consistently.

FinBaby solves this with one feature: **automatic SMS import**. It reads your bank SMS messages, parses the amount, merchant, and date, auto-categorizes the transaction, and shows you exactly where your money went. Zero typing required.

No cloud. No sign-up. No bank linking. Your data never leaves your phone.`
    },
    {
      heading: 'SMS Parsing for 50+ Indian Banks',
      content: `This was the hardest engineering challenge. Indian bank SMS formats are wildly inconsistent:

- **SBI**: "Your a/c X1234 debited by Rs.500.00 on 15-Apr-26"
- **HDFC**: "Rs 500.00 debited from HDFC Bank A/c **1234 on 15/04/26"
- **ICICI**: "Dear Customer, INR 500.00 debited from your Acct XX1234"
- **Kotak**: "Rs.500 spent on your Kotak card XX1234 at SWIGGY"

Every bank has its own format. Amount placement varies. Date formats vary. Some include merchant names, others don't.

**The parsing engine:**

\`\`\`
sms/
├── SmsReader.kt          # ContentResolver-based SMS reading
├── BankSenderMap.kt       # Maps sender IDs to bank names (50+ banks)
├── TransactionParser.kt   # Regex engine for amount, type, merchant extraction
└── CategorySuggester.kt   # Keyword-to-category mapping
\`\`\`

**BankSenderMap** contains sender ID patterns for 50+ Indian banks. When an SMS arrives from "JM-SBICRD" or "AD-HDFCBK", the parser knows which bank-specific regex to apply.

**CategorySuggester** uses keyword matching — "Swiggy" or "Zomato" maps to Food, "Amazon" maps to Shopping, "Uber" or "Ola" maps to Transport. It's not AI, and it doesn't need to be. Pattern matching handles 80% of cases, and the user can correct the rest in 2 taps.`
    },
    {
      heading: 'Architecture: Room + Hilt + WorkManager',
      content: `**Room Database** — The single source of truth for all financial data:

- \`transactions\` — Every expense and income entry (SMS-imported or manual)
- \`categories\` — Customizable spending categories with icons
- \`budgets\` — Monthly budget allocations per category
- \`recurring\` — Recurring transactions (rent, EMI, subscriptions)

**Hilt** for dependency injection. Every ViewModel, Repository, and Worker gets its dependencies injected. This keeps the app testable and modular.

**WorkManager** handles three background tasks:
1. **Daily reminders** — "Don't forget to log your cash expenses today"
2. **Recurring transactions** — Auto-creates entries for rent, EMIs, subscriptions on their due dates
3. **Budget alerts** — Notifies when spending crosses 70% or 90% of any category budget

**DataStore Preferences** for settings — currency format, default category, reminder time, biometric toggle.

**Navigation Compose** with a single Activity. Screens:

\`\`\`
Home (Dashboard) → Reports → Budget → Search → Settings
                 → Add Expense (bottom sheet)
                 → Transaction Detail
                 → Tips (Smart Saving Suggestions)
\`\`\`

Single-activity architecture with Compose Navigation. No fragments, no XML layouts.`
    },
    {
      heading: 'The 50/30/20 Budget Engine',
      content: `The 50/30/20 rule is the simplest budgeting framework that actually works:

- **50% Needs** — Rent, groceries, utilities, insurance, EMIs
- **30% Wants** — Dining out, entertainment, shopping, subscriptions
- **20% Savings** — Investments, emergency fund, debt repayment

FinBaby auto-classifies every transaction into one of these buckets based on its category. The dashboard shows three progress bars — one for each bucket — so you can see at a glance whether you're on track.

**Color coding:**
- Green: Under 70% of budget
- Orange: 70-89% of budget
- Red: 90%+ of budget

**Smart Tips engine** analyzes spending patterns and generates personalized suggestions:
- "You spent 40% more on food this month vs. last month. Cooking at home 3x/week could save ₹3,000."
- "Your subscription spending is ₹2,500/month across 6 services. Review if you're using all of them."
- "You have no emergency fund. Even ₹500/month builds a ₹6,000 safety net in a year."

These tips are rule-based, not AI. Deterministic financial calculations are more trustworthy than LLM-generated advice when real money is involved.`
    },
    {
      heading: 'Charts & Reports with Vico',
      content: `Reports needed to answer one question: **where did my money go?**

**Vico Charts** library provides:
- **Donut chart** — Category-wise spending breakdown for the month
- **Daily bar chart** — Spending per day, so you can spot binge-spending days
- **Monthly trend line** — Are you spending more or less over time?

All charts are Jetpack Compose-native. No WebView, no JavaScript bridge. They animate smoothly and respect Material 3 dynamic colors.

**CSV Export** — One tap to export all transactions to CSV. Useful for tax filing, sharing with a financial advisor, or migrating to another app.

**JSON Backup/Restore** — Full database export as encrypted JSON via Gson. Restore on a new phone or after factory reset. No cloud account needed.

**Biometric Lock** — Optional fingerprint/face authentication on app launch. Finance data is sensitive — security without friction.`
    },
    {
      heading: 'Design Philosophy: The Mindful Ledger',
      content: `Finance apps are either boring (spreadsheet-green with tiny text) or overwhelming (20 features on the home screen). FinBaby follows what I call "The Mindful Ledger" design:

- **Teal and amber palette** — Calm, not aggressive. Money management shouldn't feel stressful.
- **Soft minimalism** — No hard borders, tonal layering, generous whitespace
- **Material 3 dynamic color** — Adapts to the user's wallpaper colors on Android 12+
- **Large touch targets** — Designed for one-handed use, especially the expense entry numpad

| Feature | Tech Choice | Why |
|---------|------------|-----|
| UI | Jetpack Compose + Material 3 | Modern declarative UI, dynamic theming |
| Database | Room | Type-safe, migrations, LiveData/Flow integration |
| DI | Hilt | Standard for Android, ViewModel injection |
| Background | WorkManager | Reliable scheduling even with Doze mode |
| Charts | Vico | Compose-native, Material 3 colors |
| SMS | ContentResolver | No third-party SDK needed |
| Settings | DataStore | Coroutine-native, replaces SharedPreferences |

**Total backend cost: ₹0.** Everything runs on the device. The only external dependency is the Play Store listing itself.`
    }
  ],
  cta: {
    text: 'Need a native Android app built with Kotlin and Jetpack Compose? Let\'s talk.',
    href: '/contact'
  }
};
