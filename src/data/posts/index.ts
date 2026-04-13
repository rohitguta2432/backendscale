import { blogPostSchema } from '@/types/blog';
import type { BlogPost } from '@/types/blog';

import { ragForSql } from './rag-for-sql';
import { springBootMcp } from './spring-boot-mcp';
import { pwaOfflineSync } from './pwa-offline-sync';
import { awsBedrockVsOpenai } from './aws-bedrock-vs-openai';
import { buildingMultilanguageReactNativeAppExpo } from './building-multilanguage-react-native-app-expo';
import { expoAvAudioStreamingReactNative } from './expo-av-audio-streaming-react-native';
import { ideaToPlayStoreSanatanappArchitecture } from './idea-to-play-store-sanatanapp-architecture';
import { howMuchDoesItCostToBuildMobileAppIndia2026 } from './how-much-does-it-cost-to-build-mobile-app-india-2026';
import { buildAiChatbotWhatsappBusinessIndia } from './build-ai-chatbot-whatsapp-business-india';
import { hireFreelanceDeveloperVsAgencyIndia } from './hire-freelance-developer-vs-agency-india';
import { springBootVsNodejsStartupBackend2026 } from './spring-boot-vs-nodejs-startup-backend-2026';
import { howToBuildSaasMvp2026 } from './how-to-build-saas-mvp-2026';
import { reactNativeVsFlutter2026 } from './react-native-vs-flutter-2026';
import { whatsappBusinessApiIntegrationGuideIndia } from './whatsapp-business-api-integration-guide-india';
import { postgresqlVsMongodbStartup2026 } from './postgresql-vs-mongodb-startup-2026';
import { howToIntegrateAiExistingBusinessApp } from './how-to-integrate-ai-existing-business-app';
import { howToHireDeveloperInterviewQuestions } from './how-to-hire-developer-interview-questions';
import { buildAppLikeUberZomatoArchitectureCost } from './build-app-like-uber-zomato-architecture-cost';
import { whyYourMvpShouldCostUnder10k } from './why-your-mvp-should-cost-under-10k';
import { microservicesVsMonolithStartup } from './microservices-vs-monolith-startup';

const allPosts: BlogPost[] = [
  ragForSql,
  springBootMcp,
  pwaOfflineSync,
  awsBedrockVsOpenai,
  buildingMultilanguageReactNativeAppExpo,
  expoAvAudioStreamingReactNative,
  ideaToPlayStoreSanatanappArchitecture,
  howMuchDoesItCostToBuildMobileAppIndia2026,
  buildAiChatbotWhatsappBusinessIndia,
  hireFreelanceDeveloperVsAgencyIndia,
  springBootVsNodejsStartupBackend2026,
  howToBuildSaasMvp2026,
  reactNativeVsFlutter2026,
  whatsappBusinessApiIntegrationGuideIndia,
  postgresqlVsMongodbStartup2026,
  howToIntegrateAiExistingBusinessApp,
  howToHireDeveloperInterviewQuestions,
  buildAppLikeUberZomatoArchitectureCost,
  whyYourMvpShouldCostUnder10k,
  microservicesVsMonolithStartup,
];

// Validate all posts at module load time
allPosts.forEach((post) => {
  const result = blogPostSchema.safeParse(post);
  if (!result.success) {
    console.error(`[DATA] Invalid blog post "${post.slug}":`, result.error.flatten());
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Blog post validation failed: ${post.slug}`);
    }
  }
});

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
