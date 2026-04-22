import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AIProjects from '../AIProjects';
import type { HomeDictionary } from '@/lib/i18n';

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
    titleLine1: 'I ship AI systems for startups.',
    titleLine2: 'Chatbots, RAG pipelines, mobile apps, production backends.',
    approach: {
      title: 'My Approach',
      items: {
        problemFirst: { title: 'Problem First', description: 'desc' },
        aiTool: { title: 'AI as a Tool', description: 'desc' },
        productionReady: { title: 'Production-Ready', description: 'desc' },
        openEngineering: { title: 'Open Engineering', description: 'desc' },
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

describe('AIProjects', () => {
  it('renders without crashing', () => {
    render(<AIProjects dict={mockDict} />);
    expect(screen.getByText('Production-Ready AI Systems')).toBeInTheDocument();
  });
});
