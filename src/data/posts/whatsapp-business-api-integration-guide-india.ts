import type { BlogPost } from '@/types/blog';

export const whatsappBusinessApiIntegrationGuideIndia: BlogPost = {
  slug: 'whatsapp-business-api-integration-guide-india',
  title: 'WhatsApp Business API Integration Guide for Indian Startups',
  date: '2026-04-05',
  excerpt: 'A practical guide to integrating WhatsApp Business API for Indian startups — providers, costs, message templates, and building automated bots that actually convert.',
  readingTime: '8 min read',
  keywords: ['whatsapp business api india', 'whatsapp bot integration', 'twilio whatsapp api', 'whatsapp automation business'],
  relatedProject: 'clinicai',
  sections: [
    {
      heading: 'Why WhatsApp API Matters for Indian Businesses',
      content: `India has 500M+ WhatsApp users. Your customers are already on WhatsApp — they check it 50+ times a day. Email open rates in India hover around 15%. WhatsApp message open rates? 95%+.

For ClinIQ AI, I integrated WhatsApp for appointment reminders and patient communication. The results were immediate: no-show rates dropped by 35% because patients actually see and respond to WhatsApp messages. They ignore emails and SMS.

But here's what most tutorials don't tell you: the WhatsApp Business API is not like building a simple chatbot. Meta has strict rules about message templates, opt-ins, and session windows. Get it wrong and you'll get your number banned.`
    },
    {
      heading: 'Choosing Your API Provider',
      content: `You don't connect to WhatsApp directly. You go through a Business Solution Provider (BSP). Here's the landscape in 2026:

| Provider | Pricing | Best For |
|----------|---------|----------|
| Twilio | ₹0.50-0.85/message + platform fee | Developers who want clean APIs |
| Gupshup | ₹0.40-0.70/message | Indian startups, good local support |
| Wati | ₹2,499/month + per-message | Non-technical teams, no-code builder |
| Meta Cloud API (direct) | Free platform, pay only Meta fees | Technical teams, maximum control |

**My recommendation for developers:** Start with Meta Cloud API directly. It's free (you only pay Meta's per-conversation fees), the documentation is decent, and you avoid BSP markup. Use Twilio if you need reliable webhooks and don't want to manage infrastructure.

**My recommendation for non-technical founders:** Use Wati or AiSensy. They have no-code flow builders, template management, and support teams that speak Hindi.

**Meta's conversation-based pricing (India):**
- Business-initiated: ₹0.47 per conversation (24-hour window)
- User-initiated: ₹0.35 per conversation
- Utility messages (order updates, receipts): ₹0.17 per conversation
- First 1,000 conversations/month: Free`
    },
    {
      heading: 'Building an Automated WhatsApp Bot',
      content: `Here's the architecture I used for ClinIQ AI's WhatsApp integration:

1. **Webhook receiver** — A Spring Boot endpoint that receives incoming messages from Meta's API
2. **Message router** — Determines message type (text, button reply, template response) and routes to the right handler
3. **Intent classifier** — Simple keyword matching for common intents (book appointment, check status, talk to doctor)
4. **Template sender** — Pre-approved message templates for outbound messages
5. **Session manager** — Tracks conversation state within Meta's 24-hour window

**Critical rules you must follow:**
- You can only send **template messages** outside the 24-hour window. Free-form messages are only allowed within 24 hours of the user's last message.
- All templates must be **approved by Meta** before use. Approval takes 1-24 hours.
- You need **explicit opt-in** from users. Don't just start messaging people.
- **No promotional content** in utility templates. Meta will reject them.

\`\`\`
// Simplified webhook handler
@PostMapping("/webhook/whatsapp")
public ResponseEntity<?> handleIncoming(@RequestBody WhatsAppWebhook payload) {
  String userMessage = payload.getMessageText();
  String phoneNumber = payload.getFrom();

  if (isWithinSessionWindow(phoneNumber)) {
      // Free-form reply allowed
      sendFreeFormReply(phoneNumber, generateResponse(userMessage));
  } else {
      // Must use approved template
      sendTemplate(phoneNumber, "appointment_reminder", templateParams);
  }
  return ResponseEntity.ok().build();
}
\`\`\`

The biggest mistake I see: developers building complex NLP pipelines when simple keyword matching + button menus handle 90% of use cases. For ClinIQ AI, the bot handles appointment booking, reminders, and FAQ — all with template messages and quick-reply buttons. No GPT needed.`
    },
    {
      heading: 'Message Templates That Convert',
      content: `Template design matters more than bot intelligence. Here are patterns that work:

**Appointment Reminder (ClinIQ AI):**
\`\`\`
Hi {{1}}, this is a reminder for your appointment with Dr. {{2}} on {{3}} at {{4}}.

Reply:
✅ Confirm
🔄 Reschedule
❌ Cancel
\`\`\`

**Order Update:**
\`\`\`
Your order #{{1}} has been shipped! 🚚
Tracking: {{2}}
Expected delivery: {{3}}

Track your order: {{4}}
\`\`\`

**Tips for approval:**
- Keep templates under 1024 characters
- Don't use ALL CAPS or excessive emoji
- Include a clear purpose — Meta rejects vague templates
- Use variables ({{1}}, {{2}}) for dynamic content
- Add quick-reply buttons instead of asking users to type

**Conversion rates I've seen:** Appointment confirmation templates get 78% response rates. Order update templates get 65% click-through on tracking links. Compare that to email (15-20% open rate) and SMS (25-30% open rate). WhatsApp wins by a massive margin in India.`
    },
    {
      heading: 'Cost Reality Check',
      content: `Let's do the math for a small clinic sending 500 appointment reminders per month:

| Cost Component | Monthly |
|---------------|---------|
| Meta conversation fees (500 utility) | ₹85 (~$1) |
| BSP fee (if using Twilio) | ₹1,500-2,500 |
| Server costs (basic API) | ₹0 (Vercel/Amplify free tier) |
| Developer time (initial build) | ₹40,000-80,000 (one-time) |
| **Total monthly (after build)** | **₹85-2,585** |

That's less than most businesses spend on SMS. And the engagement is 5x better.

For ClinIQ AI, the WhatsApp integration was one of the highest-ROI features I built. The development cost was modest, the monthly running cost is negligible, and the impact on patient no-shows was dramatic.

If you're an Indian startup and you're not on WhatsApp Business API yet, you're leaving money on the table. Start with appointment reminders or order updates — the simplest use case with the highest impact.`
    }
  ],
  cta: {
    text: 'Want a WhatsApp bot for your business? Let\'s build it.',
    href: '/contact'
  }
};
