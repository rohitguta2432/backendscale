'use client';

import { useState } from 'react';
import { subscribeEmail } from '@/lib/supabase';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
    const [validationError, setValidationError] = useState('');
    const [touched, setTouched] = useState(false);

    const validateEmail = (value: string): string => {
        if (!value.trim()) return 'Email is required';
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
        return '';
    };

    const handleChange = (value: string) => {
        setEmail(value);
        if (touched) {
            setValidationError(validateEmail(value));
        }
    };

    const handleBlur = () => {
        setTouched(true);
        setValidationError(validateEmail(email));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched(true);
        const error = validateEmail(email);
        setValidationError(error);
        if (error) return;

        setStatus('loading');

        const result = await subscribeEmail(email, locale);

        if (result.success) {
            setStatus('success');
            setMessage(translations.success);
            setEmail('');
            setTouched(false);
            setValidationError('');
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
        <form onSubmit={handleSubmit} className="subscribe-form" noValidate>
            <div className="subscribe-input-group">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={translations.placeholder}
                    className="subscribe-input"
                    disabled={status === 'loading'}
                    aria-invalid={touched && !!validationError}
                    aria-describedby={validationError ? 'subscribe-error' : undefined}
                />
                <button
                    type="submit"
                    className="subscribe-button"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? '...' : translations.button}
                </button>
            </div>
            {touched && validationError && (
                <p
                    id="subscribe-error"
                    role="alert"
                    style={{
                        color: 'var(--error, #dc2626)',
                        fontSize: '0.8rem',
                        marginTop: '0.375rem',
                    }}
                >
                    {validationError}
                </p>
            )}
            {message && (
                <p className={`subscribe-message ${status}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
