import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ivacwojpuhsssyfcfgjx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YWN3b2pwdWhzc3N5ZmNmZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDM3ODQsImV4cCI6MjA4NTUxOTc4NH0.Lw7faqwyjZROz5ogO2PC_WSNi9IhmEAakJ69y3M4QgI';

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
