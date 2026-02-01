import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, isValidLocale, type Locale } from '@/lib/i18n';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function getLocaleFromHeaders(request: NextRequest): Locale {
    const acceptLanguage = request.headers.get('accept-language');
    if (!acceptLanguage) return defaultLocale;

    // Parse Accept-Language header
    const languages = acceptLanguage
        .split(',')
        .map((lang) => {
            const [code, q = 'q=1'] = lang.trim().split(';');
            return {
                code: code.split('-')[0].toLowerCase(), // Get primary language code
                quality: parseFloat(q.replace('q=', '')) || 1,
            };
        })
        .sort((a, b) => b.quality - a.quality);

    // Find first matching locale
    for (const lang of languages) {
        if (isValidLocale(lang.code)) {
            return lang.code;
        }
    }

    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files, api routes, and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // Static files like .ico, .png, etc.
    ) {
        return NextResponse.next();
    }

    // Check if pathname already has a valid locale
    const pathSegments = pathname.split('/').filter(Boolean);
    const pathnameLocale = pathSegments[0];

    if (isValidLocale(pathnameLocale)) {
        // Check if there's a nested locale (e.g., /en/ar -> should redirect to /ar)
        const secondSegment = pathSegments[1];
        if (secondSegment && isValidLocale(secondSegment)) {
            // Nested locale detected - redirect to the second locale
            const restOfPath = pathSegments.slice(2).join('/');
            const newUrl = new URL(`/${secondSegment}${restOfPath ? '/' + restOfPath : ''}`, request.url);
            newUrl.search = request.nextUrl.search;

            const response = NextResponse.redirect(newUrl);
            response.cookies.set(LOCALE_COOKIE, secondSegment, {
                maxAge: 60 * 60 * 24 * 365,
                path: '/',
                sameSite: 'lax',
            });
            return response;
        }

        // Valid locale in URL, set cookie if not already set
        const response = NextResponse.next();
        if (!request.cookies.get(LOCALE_COOKIE)) {
            response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
                maxAge: 60 * 60 * 24 * 365, // 1 year
                path: '/',
                sameSite: 'lax',
            });
        }
        return response;
    }

    // No locale in pathname, need to redirect
    // Priority: Cookie > Browser language > Default
    let locale: Locale;

    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (cookieLocale && isValidLocale(cookieLocale)) {
        locale = cookieLocale;
    } else {
        locale = getLocaleFromHeaders(request);
    }

    // Redirect to localized path
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;

    const response = NextResponse.redirect(newUrl);

    // Set cookie for persistence
    response.cookies.set(LOCALE_COOKIE, locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax',
    });

    return response;
}

export const config = {
    matcher: [
        // Match all paths except static files and api routes
        '/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
