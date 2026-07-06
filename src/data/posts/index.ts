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
import { buildEnterpriseDealMatchingPlatformSpringBootNextjs } from './build-enterprise-deal-matching-platform-spring-boot-nextjs';
import { buildAndroidFinanceTrackerKotlinJetpackCompose } from './build-android-finance-tracker-kotlin-jetpack-compose';
import { buildMultiTenantSaasSpringBootJava21 } from './build-multi-tenant-saas-spring-boot-java-21';
import { buildOfflineFirstTripPlannerReactNativeWatermelondb } from './build-offline-first-trip-planner-react-native-watermelondb';
import { buildOnDeviceAiScamDetectorAndroidGemma } from './build-on-device-ai-scam-detector-android-gemma';
import { buildFamilyBudgetAppAndroidOfflineKotlin } from './build-family-budget-app-android-offline-kotlin';
import { cloudFirstAiIsDeadOnDeviceAndroid2026 } from './cloud-first-ai-is-dead-on-device-android-2026';
import { upiFraud805CroreWhyIBuiltOfflineScamDetector } from './upi-fraud-805-crore-why-i-built-offline-scam-detector';
import { iBuiltMultiTenantSaasAlone12ModuleSpringBoot } from './i-built-multi-tenant-saas-alone-12-module-spring-boot';
import { foundingEngineerVsLovableWhenToHire2026 } from './founding-engineer-vs-lovable-when-to-hire-2026';
import { indiaVsUsMvpDeveloperCost2026 } from './india-vs-us-mvp-developer-cost-2026';
import { vibeCodingVsHiringDeveloperWhenLovableBreaks } from './vibe-coding-vs-hiring-developer-when-lovable-breaks';
import { foundingEngineerVsFractionalCto } from './founding-engineer-vs-fractional-cto';
import { lovableAlternativeDeveloperWhenAiBuilderBreaks } from './lovable-alternative-developer-when-ai-builder-breaks';
import { aiNewsApril2026WhatFoundersShouldBuild } from './ai-news-april-2026-what-founders-should-build';
import { sixWeekMvpSprintWeekByWeekBreakdown } from './6-week-mvp-sprint-week-by-week-breakdown';
import { sixWeekMvpTechStack2026 } from './6-week-mvp-tech-stack-2026';
import { what15kMvpActuallyIncludesVs50kAgencyQuote } from './what-15k-mvp-actually-includes-vs-50k-agency-quote';
import { sixWeekMvpVs3MonthAgencyWhichShipsFirst } from './6-week-mvp-vs-3-month-agency-which-ships-first';
import { foundingEngineerIndiaVsToptalArcUplers2026 } from './founding-engineer-india-vs-toptal-arc-uplers-2026';
import { lovableAppProductionBugsNeedRealEngineer2026 } from './lovable-app-production-bugs-need-real-engineer-2026';
import { supabaseRlsProductionBugsNeedRealEngineer2026 } from './supabase-rls-production-bugs-need-real-engineer-2026';
import { retoolVsCustomBuildInternalTool2026 } from './retool-vs-custom-build-internal-tool-2026';
import { foundingEngineerEquityPercentage2026 } from './founding-engineer-equity-percentage-2026';
import { hireTechnicalCofounderIndia2026 } from './hire-technical-cofounder-india-2026';
import { hireAiEngineerIndia2026 } from './hire-ai-engineer-india-2026';
import { boltNewVsHireDeveloper2026 } from './bolt-new-vs-hire-developer-2026';
import { cursorAiVsHireDeveloper2026 } from './cursor-ai-vs-hire-developer-2026';
import { devinAiVsHireDeveloper2026 } from './devin-ai-vs-hire-developer-2026';
import { replitAgentVsHireDeveloper2026 } from './replit-agent-vs-hire-developer-2026';
import { v0ByVercelVsHireDeveloper2026 } from './v0-by-vercel-vs-hire-developer-2026';
import { claudeCodeVsHireDeveloper2026 } from './claude-code-vs-hire-developer-2026';
import { razorpayVsStripeIndiaMvp2026 } from './razorpay-vs-stripe-india-mvp-2026';
import { selfHostN8nVsZapierCostIndia2026 } from './self-host-n8n-vs-zapier-cost-india-2026';
import { supabaseVsFirebaseIndiaMvp2026 } from './supabase-vs-firebase-india-mvp-2026';
import { clerkVsSupabaseAuthVsBetterAuthIndia2026 } from './clerk-vs-supabase-auth-vs-better-auth-india-2026';
import { vercelVsRailwayVsHetznerIndiaMvpHosting2026 } from './vercel-vs-railway-vs-hetzner-india-mvp-hosting-2026';
import { pineconeVsQdrantVsPgvectorIndiaRagMvp2026 } from './pinecone-vs-qdrant-vs-pgvector-india-rag-mvp-2026';
import { openaiVsClaudeVsGeminiApiCostIndiaMvp2026 } from './openai-vs-claude-vs-gemini-api-cost-india-mvp-2026';
import { drizzleVsPrismaVsTypeormIndiaMvp2026 } from './drizzle-vs-prisma-vs-typeorm-india-mvp-2026';
import { langgraphVsCrewaiVsAutogenIndiaMvp2026 } from './langgraph-vs-crewai-vs-autogen-india-mvp-2026';
import { hireReactNativeDeveloperIndia2026 } from './hire-react-native-developer-india-2026';
import { hireFlutterDeveloperIndia2026 } from './hire-flutter-developer-india-2026';
import { resendVsSendgridVsAwsSesIndiaMvp2026 } from './resend-vs-sendgrid-vs-aws-ses-india-mvp-2026';
import { hireIosDeveloperIndiaMvp2026 } from './hire-ios-developer-india-mvp-2026';
import { posthogVsMixpanelVsAmplitudeIndiaMvp2026 } from './posthog-vs-mixpanel-vs-amplitude-india-mvp-2026';
import { claudeCodePluginsContextEngineering2026 } from './claude-code-plugins-context-engineering-2026';
import { deepseekVsClaudeVsGptIndiaMvpCost2026 } from './deepseek-vs-claude-vs-gpt-india-mvp-cost-2026';
import { geminiCliToAntigravityMigrationAlternatives2026 } from './gemini-cli-to-antigravity-migration-alternatives-2026';
import { aiDevWeek2026W22 } from './ai-dev-week-2026-22';
import { aiDevWeek2026W23 } from './ai-dev-week-2026-23';
import { secureMcpServerTypescript2026 } from './secure-mcp-server-typescript-2026';
import { claudeOpus48Vs47Developers2026 } from './claude-opus-4-8-vs-4-7-developers-2026';
import { aiGeneratedCodeAntiPatternsFixes2026 } from './ai-generated-code-anti-patterns-fixes-2026';
import { openrouterVsLitellmVsPortkeyIndiaMvp2026 } from './openrouter-vs-litellm-vs-portkey-india-mvp-2026';
import { claudeCodeDynamicWorkflowsGuide2026 } from './claude-code-dynamic-workflows-guide-2026';
import { llmContextCompressionCutTokenCosts2026 } from './llm-context-compression-cut-token-costs-2026';
import { claudeAiVulnerabilityScanner2026 } from './claude-ai-vulnerability-scanner-2026';
import { openSourceAiAgentMemoryMem0VsZepLetta2026 } from './open-source-ai-agent-memory-mem0-vs-zep-letta-2026';
import { openNotebookVsKhojVsSurfsenseNotebooklm2026 } from './open-notebook-vs-khoj-vs-surfsense-notebooklm-2026';
import { nvidiaRtxSparkWindowsAiAgents2026 } from './nvidia-rtx-spark-windows-ai-agents-2026';
import { whatIsHarnessEngineeringCodex2026 } from './what-is-harness-engineering-codex-2026';
import { aiDevWeek2026W24 } from './ai-dev-week-2026-24';
import { claudeFable5DeveloperGuide2026 } from './claude-fable-5-developer-guide-2026';
import { diffusionGemmaTextDiffusionLlmGuide2026 } from './diffusiongemma-text-diffusion-llm-guide-2026';
import { runDiffusionGemmaLocallyVllm2026 } from './run-diffusiongemma-locally-vllm-rtx5090-2026';
import { opencodeVsClaudeCodeCursor2026 } from './opencode-vs-claude-code-cursor-2026';
import { aiAgentPaymentsX402VsAp22026 } from './ai-agent-payments-x402-vs-ap2-2026';
import { kimiK27CodeVsClaudeOpusGpt2026 } from './kimi-k2-7-code-vs-claude-opus-gpt-2026';
import { aiAgentMemoryVsContextWindow2026 } from './ai-agent-memory-vs-context-window-2026';
import { aiDevWeek2026W25 } from './ai-dev-week-2026-25';
import { bestLocalLlmForCodingReplaceCloud2026 } from './best-local-llm-for-coding-replace-cloud-2026';
import { webmcpGuideBrowserAgentTools2026 } from './webmcp-guide-browser-agent-tools-2026';
import { mcpServerAuthenticationOauthGuide2026 } from './mcp-server-authentication-oauth-guide-2026';
import { deepseekV4VisionCheapestMultimodalApi2026 } from './deepseek-v4-vision-cheapest-multimodal-api-2026';
import { vibethinker3bTinyReasoningModelGuide2026 } from './vibethinker-3b-tiny-reasoning-model-guide-2026';
import { aiDevWeek2026W26 } from './ai-dev-week-2026-26';
import { sakanaFuguOrchestrationModelGuide2026 } from './sakana-fugu-orchestration-model-guide-2026';
import { mistralOcr4VsTextractGoogleDocumentAi2026 } from './mistral-ocr-4-vs-textract-google-document-ai-2026';
import { geminiInteractionsApiMigrationGuide2026 } from './gemini-interactions-api-migration-guide-2026';
import { glm52VsClaudeOpusCodingAgent2026 } from './glm-5-2-vs-claude-opus-coding-agent-2026';
import { geminiComputerUseVsClaudeOpenai2026 } from './gemini-computer-use-vs-claude-openai-2026';
import { microsoftAgentFrameworkVsLangGraphCrewai2026 } from './microsoft-agent-framework-vs-langgraph-crewai-2026';
import { bestOpenSourceDeepResearchAgentSelfHost2026 } from './best-open-source-deep-research-agent-self-host-2026';
import { aiDevWeek2026W27 } from './ai-dev-week-2026-27';
import { ornith1SelfImprovingCodingModelGuide2026 } from './ornith-1-self-improving-coding-model-guide-2026';
import { baiduUnlimitedOcrOpenModelGuide2026 } from './baidu-unlimited-ocr-open-model-guide-2026';
import { strixAiPenetrationTestingAgentGuide2026 } from './strix-ai-penetration-testing-agent-guide-2026';
import { safariMcpServerWebDebuggingGuide2026 } from './safari-mcp-server-web-debugging-guide-2026';
import { nvidiaLocateAnything3bVisualGroundingGuide2026 } from './nvidia-locateanything-3b-visual-grounding-guide-2026';

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
  buildEnterpriseDealMatchingPlatformSpringBootNextjs,
  buildAndroidFinanceTrackerKotlinJetpackCompose,
  buildMultiTenantSaasSpringBootJava21,
  buildOfflineFirstTripPlannerReactNativeWatermelondb,
  buildOnDeviceAiScamDetectorAndroidGemma,
  buildFamilyBudgetAppAndroidOfflineKotlin,
  cloudFirstAiIsDeadOnDeviceAndroid2026,
  upiFraud805CroreWhyIBuiltOfflineScamDetector,
  iBuiltMultiTenantSaasAlone12ModuleSpringBoot,
  foundingEngineerVsLovableWhenToHire2026,
  indiaVsUsMvpDeveloperCost2026,
  vibeCodingVsHiringDeveloperWhenLovableBreaks,
  foundingEngineerVsFractionalCto,
  lovableAlternativeDeveloperWhenAiBuilderBreaks,
  aiNewsApril2026WhatFoundersShouldBuild,
  sixWeekMvpSprintWeekByWeekBreakdown,
  sixWeekMvpTechStack2026,
  what15kMvpActuallyIncludesVs50kAgencyQuote,
  sixWeekMvpVs3MonthAgencyWhichShipsFirst,
  foundingEngineerIndiaVsToptalArcUplers2026,
  lovableAppProductionBugsNeedRealEngineer2026,
  supabaseRlsProductionBugsNeedRealEngineer2026,
  retoolVsCustomBuildInternalTool2026,
  foundingEngineerEquityPercentage2026,
  hireTechnicalCofounderIndia2026,
  hireAiEngineerIndia2026,
  boltNewVsHireDeveloper2026,
  cursorAiVsHireDeveloper2026,
  devinAiVsHireDeveloper2026,
  replitAgentVsHireDeveloper2026,
  v0ByVercelVsHireDeveloper2026,
  claudeCodeVsHireDeveloper2026,
  razorpayVsStripeIndiaMvp2026,
  selfHostN8nVsZapierCostIndia2026,
  supabaseVsFirebaseIndiaMvp2026,
  clerkVsSupabaseAuthVsBetterAuthIndia2026,
  vercelVsRailwayVsHetznerIndiaMvpHosting2026,
  pineconeVsQdrantVsPgvectorIndiaRagMvp2026,
  openaiVsClaudeVsGeminiApiCostIndiaMvp2026,
  drizzleVsPrismaVsTypeormIndiaMvp2026,
  langgraphVsCrewaiVsAutogenIndiaMvp2026,
  hireReactNativeDeveloperIndia2026,
  hireFlutterDeveloperIndia2026,
  resendVsSendgridVsAwsSesIndiaMvp2026,
  hireIosDeveloperIndiaMvp2026,
  posthogVsMixpanelVsAmplitudeIndiaMvp2026,
  claudeCodePluginsContextEngineering2026,
  deepseekVsClaudeVsGptIndiaMvpCost2026,
  geminiCliToAntigravityMigrationAlternatives2026,
  aiDevWeek2026W22,
  secureMcpServerTypescript2026,
  claudeOpus48Vs47Developers2026,
  aiGeneratedCodeAntiPatternsFixes2026,
  openrouterVsLitellmVsPortkeyIndiaMvp2026,
  claudeCodeDynamicWorkflowsGuide2026,
  aiDevWeek2026W23,
  llmContextCompressionCutTokenCosts2026,
  claudeAiVulnerabilityScanner2026,
  openSourceAiAgentMemoryMem0VsZepLetta2026,
  openNotebookVsKhojVsSurfsenseNotebooklm2026,
  nvidiaRtxSparkWindowsAiAgents2026,
  whatIsHarnessEngineeringCodex2026,
  aiDevWeek2026W24,
  claudeFable5DeveloperGuide2026,
  diffusionGemmaTextDiffusionLlmGuide2026,
  runDiffusionGemmaLocallyVllm2026,
  opencodeVsClaudeCodeCursor2026,
  aiAgentPaymentsX402VsAp22026,
  kimiK27CodeVsClaudeOpusGpt2026,
  aiAgentMemoryVsContextWindow2026,
  aiDevWeek2026W25,
  bestLocalLlmForCodingReplaceCloud2026,
  webmcpGuideBrowserAgentTools2026,
  mcpServerAuthenticationOauthGuide2026,
  deepseekV4VisionCheapestMultimodalApi2026,
  vibethinker3bTinyReasoningModelGuide2026,
  aiDevWeek2026W26,
  sakanaFuguOrchestrationModelGuide2026,
  mistralOcr4VsTextractGoogleDocumentAi2026,
  geminiInteractionsApiMigrationGuide2026,
  glm52VsClaudeOpusCodingAgent2026,
  geminiComputerUseVsClaudeOpenai2026,
  microsoftAgentFrameworkVsLangGraphCrewai2026,
  bestOpenSourceDeepResearchAgentSelfHost2026,
  aiDevWeek2026W27,
  ornith1SelfImprovingCodingModelGuide2026,
  baiduUnlimitedOcrOpenModelGuide2026,
  strixAiPenetrationTestingAgentGuide2026,
  safariMcpServerWebDebuggingGuide2026,
  nvidiaLocateAnything3bVisualGroundingGuide2026,
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
