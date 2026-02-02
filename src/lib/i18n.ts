export const locales = ['en', 'hi', 'fr', 'de', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
    en: 'English',
    hi: 'हिंदी',
    fr: 'Français',
    de: 'Deutsch',
    ar: 'العربية',
};

export const localeFlags: Record<Locale, string> = {
    en: '🇺🇸',
    hi: '🇮🇳',
    fr: '🇫🇷',
    de: '🇩🇪',
    ar: '🇸🇦',
};

// RTL locales
export const rtlLocales: Locale[] = ['ar'];

export function isRTL(locale: Locale): boolean {
    return rtlLocales.includes(locale);
}

export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

export type Dictionary = {
    common: CommonDictionary;
    home: HomeDictionary;
    pages: PagesDictionary;
    meta: MetaDictionary;
};

export interface CommonDictionary {
    nav: {
        home: string;
        projects: string;
        repos: string;
        notes: string;
        about: string;
        contact: string;
        viewCurrentWork: string;
    };
    footer: {
        brand: string;
    };
    buttons: {
        viewProjects: string;
        engineeringNotes: string;
        github: string;
        viewRepository: string;
    };
    language: {
        switchLanguage: string;
    };
    subscribe?: {
        title: string;
        placeholder: string;
        button: string;
        success: string;
        error: string;
    };
}

export interface HomeDictionary {
    hero: {
        subtitle: string;
        titleLine1: string;
        titleLine2: string;
        approach: {
            title: string;
            items: {
                problemFirst: { title: string; description: string };
                aiTool: { title: string; description: string };
                productionReady: { title: string; description: string };
                openEngineering: { title: string; description: string };
            };
        };
    };
    aiProjects: {
        sectionTitle: string;
        sectionHeading: string;
        sectionDescription: string;
        labels: {
            problem: string;
            solution: string;
            aiApproach: string;
            techStack: string;
        };
        readNotes: string;
    };
    reliability?: {
        sectionTitle: string;
        sectionHeading: string;
        cards: {
            observability: ReliabilityCard;
            loadTesting: ReliabilityCard;
            apiTesting: ReliabilityCard;
            kafkaTesting: ReliabilityCard;
        };
    };
}

export interface ReliabilityCard {
    title: string;
    subtitle: string;
    description: string;
    bullets: string[];
    linkText: string;
}

export interface PagesDictionary {
    about: {
        title: string;
        bio1: string;
        bio2: string;
    };
    contact: {
        title: string;
        description: string;
    };
    projects: {
        title: string;
        description: string;
        active: string;
        activeDescription: string;
        iterating: string;
        iteratingDescription: string;
        paused: string;
        pausedDescription: string;
    };
    repos: {
        title: string;
        description: string;
    };
    notes: {
        title: string;
        description: string;
        contributionFeed: string;
        repositorySummary: string;
        projectNotes: string;
        viewAllRepos: string;
        noContributions: string;
        noNotes: string;
        whyExists: string;
        coreChallenge: string;
        architecture: string;
        tradeoffs: string;
    };
    reliability: {
        title: string;
        description: string;
        dashboard: {
            title: string;
            cpu: string;
            memory: string;
            requests: string;
            latency: string;
        };
    };
}

export interface MetaDictionary {
    home: {
        title: string;
        description: string;
    };
    about: {
        title: string;
        description: string;
    };
    contact: {
        title: string;
        description: string;
    };
    projects: {
        title: string;
        description: string;
    };
    repos: {
        title: string;
        description: string;
    };
    notes: {
        title: string;
        description: string;
    };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    en: () => loadDictionary('en'),
    hi: () => loadDictionary('hi'),
    fr: () => loadDictionary('fr'),
    de: () => loadDictionary('de'),
    ar: () => loadDictionary('ar'),
};

async function loadDictionary(locale: Locale): Promise<Dictionary> {
    try {
        const [common, home, pages, meta] = await Promise.all([
            import(`../../content/${locale}/common.json`).then((m) => m.default),
            import(`../../content/${locale}/home.json`).then((m) => m.default),
            import(`../../content/${locale}/pages.json`).then((m) => m.default),
            import(`../../content/${locale}/meta.json`).then((m) => m.default),
        ]);
        return { common, home, pages, meta };
    } catch {
        // Fallback to English if locale files don't exist
        if (locale !== 'en') {
            console.warn(`Dictionary for locale "${locale}" not found, falling back to English`);
            return loadDictionary('en');
        }
        throw new Error('English dictionary not found');
    }
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
    return dictionaries[locale]();
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
    // Remove existing locale prefix if present (dynamically using all locales)
    const localePattern = new RegExp(`^/(${locales.join('|')})(\/|$)`);
    const pathWithoutLocale = pathname.replace(localePattern, '/');
    return `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
}
