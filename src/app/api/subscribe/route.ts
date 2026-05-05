import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ALLOWED_LOCALES = new Set(['en', 'hi', 'fr', 'de', 'ar']);

export const runtime = 'nodejs';

export async function POST(request: Request) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        return NextResponse.json(
            { success: false, error: 'Server misconfigured' },
            { status: 500 },
        );
    }

    let body: { email?: unknown; locale?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const localeRaw = typeof body.locale === 'string' ? body.locale : 'en';
    const locale = ALLOWED_LOCALES.has(localeRaw) ? localeRaw : 'en';

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
        return NextResponse.json(
            { success: false, error: 'Please enter a valid email address' },
            { status: 400 },
        );
    }

    const admin = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await admin.from('subscribers').insert([{ email, locale }]);

    if (error) {
        if (error.code === '23505') {
            return NextResponse.json(
                { success: false, error: 'Email already subscribed!' },
                { status: 409 },
            );
        }
        return NextResponse.json(
            { success: false, error: 'Failed to subscribe. Please try again.' },
            { status: 500 },
        );
    }

    return NextResponse.json({ success: true });
}
