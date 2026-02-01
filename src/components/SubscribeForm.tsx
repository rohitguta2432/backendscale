'use client';

import { useState } from 'react';
import { subscribeEmail } from '@/lib/supabase';

interface SubscribeFormProps {
    locale: string;
    translations: {
        placeholder: string;
        button: string;
        success: string;
        error: string;
    };
}

export default function SubscribeForm({ locale, translations }: SubscribeFormProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) return;

        setStatus('loading');

        const result = await subscribeEmail(email, locale);

        if (result.success) {
            setStatus('success');
            setMessage(translations.success);
            setEmail('');
        } else {
            setStatus('error');
            setMessage(result.error || translations.error);
        }

        // Reset after 3 seconds
        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="subscribe-form">
            <div className="subscribe-input-group">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translations.placeholder}
                    className="subscribe-input"
                    disabled={status === 'loading'}
                    required
                />
                <button
                    type="submit"
                    className="subscribe-button"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? '...' : translations.button}
                </button>
            </div>
            {message && (
                <p className={`subscribe-message ${status}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
