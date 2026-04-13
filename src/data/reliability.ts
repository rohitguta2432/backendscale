import type { CardConfig } from '@/types/reliability';

export const cardConfigs: CardConfig[] = [
    {
        key: "observability",
        icon: "📊",
        route: "/reliability/observability",
        accentColor: "#22c55e",
    },
    {
        key: "loadTesting",
        icon: "⚡",
        route: "/reliability/load-testing",
        accentColor: "#f97316",
    },
    {
        key: "apiTesting",
        icon: "🔗",
        route: "/reliability/api-testing",
        accentColor: "#3b82f6",
    },
    {
        key: "kafkaTesting",
        icon: "📨",
        route: "/reliability/kafka-testing",
        accentColor: "#8b5cf6",
    },
];
