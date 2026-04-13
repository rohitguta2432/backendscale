import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import type { CommonDictionary, Locale } from '@/lib/i18n';

jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

jest.mock('@/lib/supabase', () => ({
  subscribeEmail: jest.fn().mockResolvedValue({ success: true }),
}));

const mockDict: CommonDictionary = {
  nav: {
    home: 'Home',
    projects: 'Projects',
    repos: 'Repos',
    notes: 'Notes',
    about: 'About',
    contact: 'Contact',
    viewCurrentWork: 'View Current Work',
  },
  footer: {
    brand: 'Rohit Raj — Backend & AI Systems',
  },
  buttons: {
    viewProjects: 'View AI Projects',
    engineeringNotes: 'Engineering Notes',
    github: 'GitHub',
    viewRepository: 'View Repository',
  },
  language: {
    switchLanguage: 'Language',
  },
  subscribe: {
    title: 'Get Updates',
    placeholder: 'Enter your email',
    button: 'Subscribe',
    success: 'Thanks for subscribing!',
    error: 'Something went wrong. Try again.',
  },
};

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer dict={mockDict} locale={'en' as Locale} />);
    expect(screen.getByText('Rohit Raj — Backend & AI Systems')).toBeInTheDocument();
  });
});
