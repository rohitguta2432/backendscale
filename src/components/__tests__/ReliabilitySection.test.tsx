import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ReliabilitySection from '../ReliabilitySection';
import type { HomeDictionary, Locale } from '@/lib/i18n';

jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

const mockDictionary: HomeDictionary = {
  hero: {
    subtitle: '',
    titleLine1: 'Get your AI MVP live in 2 weeks.',
    titleLine2: '29 products shipped, every one documented.',
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
      observability: { title: 'Observability', subtitle: 'Prometheus + Grafana', description: 'Production-grade metrics.', bullets: ['RED/USE metrics', 'Grafana dashboards'], linkText: 'Learn more' },
      loadTesting: { title: 'Load Testing', subtitle: 'k6', description: 'Performance validation.', bullets: ['Scenario-based tests'], linkText: 'Learn more' },
      apiTesting: { title: 'API Contract Testing', subtitle: 'Postman + Newman', description: 'Repeatable regression.', bullets: ['Environment-driven execution'], linkText: 'Learn more' },
      kafkaTesting: { title: 'Event-Driven Testing', subtitle: 'Kafka Simulation', description: 'Deterministic testing.', bullets: ['Event replay'], linkText: 'Learn more' },
    },
  },
};

describe('ReliabilitySection', () => {
  it('renders without crashing', () => {
    render(<ReliabilitySection dictionary={mockDictionary} locale={'en' as Locale} />);
    expect(screen.getByText('Reliability & Production Readiness')).toBeInTheDocument();
  });
});
