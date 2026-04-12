import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Copy .env.example to .env.local and fill in your Supabase credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Subscriber = {
    id: string;
    email: string;
    locale: string;
    subscribed_at: string;
    is_active: boolean;
    unsubscribed_at: string | null;
};

export async function subscribeEmail(email: string, locale: string = 'en'): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('subscribers')
            .insert([{ email, locale }]);

        if (error) {
            if (error.code === '23505') {
                return { success: false, error: 'Email already subscribed!' };
            }
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch {
        return { success: false, error: 'Failed to subscribe. Please try again.' };
    }
}
