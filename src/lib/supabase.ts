export type Subscriber = {
    id: string;
    email: string;
    locale: string;
    subscribed_at: string;
    is_active: boolean;
    unsubscribed_at: string | null;
};

export async function subscribeEmail(
    email: string,
    locale: string = 'en',
): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, locale }),
        });

        const data = (await res.json().catch(() => ({}))) as {
            success?: boolean;
            error?: string;
        };

        if (!res.ok || !data.success) {
            return { success: false, error: data.error || 'Failed to subscribe. Please try again.' };
        }

        return { success: true };
    } catch {
        return { success: false, error: 'Failed to subscribe. Please try again.' };
    }
}
