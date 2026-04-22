import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Hero from '../Hero';
import type { HomeDictionary, Locale } from '@/lib/i18n';

jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

jest.mock('next/image', () => {
  return (props: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  );
});

const mockDict: HomeDictionary = {
  hero: {
    subtitle: '',
    titleLine1: 'Get your AI MVP live in 2 weeks.',
    titleLine2: '29 products shipped, every one documented.',
    approach: {
      title: 'My Approach',
      items: {
        problemFirst: { title: 'Problem First', description: 'Identify the real user pain before writing code' },
        aiTool: { title: 'AI as a Tool', description: 'Use LLMs where they add value' },
        productionReady: { title: 'Production-Ready', description: 'Every project includes infra, testing, and deployment' },
        openEngineering: { title: 'Open Engineering', description: 'Document decisions publicly' },
      },
    },
  },
  aiProjects: {
    sectionTitle: 'AI Projects',
    sectionHeading: 'Production-Ready AI Systems',
    sectionDescription: 'Not experiments.',
    labels: { problem: 'Problem', solution: 'Solution', aiApproach: 'AI Approach', techStack: 'Tech Stack' },
    readNotes: 'Read full architecture notes',
  },
  reliability: {
    sectionTitle: 'Engineering Quality',
    sectionHeading: 'Reliability & Production Readiness',
    cards: {
      observability: { title: 'Observability', subtitle: 'Prometheus', description: 'Metrics.', bullets: ['bullet'], linkText: 'Learn more' },
      loadTesting: { title: 'Load Testing', subtitle: 'k6', description: 'Perf.', bullets: ['bullet'], linkText: 'Learn more' },
      apiTesting: { title: 'API Testing', subtitle: 'Postman', description: 'Regression.', bullets: ['bullet'], linkText: 'Learn more' },
      kafkaTesting: { title: 'Kafka Testing', subtitle: 'Kafka', description: 'Events.', bullets: ['bullet'], linkText: 'Learn more' },
    },
  },
};

describe('Hero', () => {
  it('renders without crashing', () => {
    render(<Hero dict={mockDict} locale={'en' as Locale} />);
    expect(screen.getByText('Get your AI MVP live in 2 weeks.')).toBeInTheDocument();
  });
});
