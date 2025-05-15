import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import ProblemInformation from './ProblemInformation';
import { Problem } from '@/types';

describe('ProblemInformation', () => {
  const mockProblem: Problem = {
    id: 1,
    name: 'Test Problem',
    category: 'Arrays',
    lab_id: 'Lab01',
    is_active: true,
    description: 'Test description',
    sample_code: 'def solution():\n    pass',
    examples: [
      {
        input: 'test input',
        output: 'test output',
        testcode: false
      }
    ],
    constrain: []
  };

  it('renders description section', () => {
    const { user } = render(<ProblemInformation problem={mockProblem} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders example section with table', () => {
    const { user } = render(<ProblemInformation problem={mockProblem} />);
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Test' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Result' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'test input' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'test output' })).toBeInTheDocument();
  });

  it('handles empty examples gracefully', () => {
    const problemWithNoExamples = {
      ...mockProblem,
      examples: []
    };
    const { user } = render(<ProblemInformation problem={problemWithNoExamples} />);
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Test' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Result' })).toBeInTheDocument();
  });

  it('sanitizes HTML in description', () => {
    const problemWithHtml = {
      ...mockProblem,
      description: '<p>Test <strong>description</strong> with <script>alert("xss")</script></p>'
    };
    const { user } = render(<ProblemInformation problem={problemWithHtml} />);
    const descriptionContainer = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('Test');
    }).closest('div');
    expect(descriptionContainer?.innerHTML).not.toContain('<script>');
    expect(descriptionContainer?.innerHTML).toContain('<strong>');
  });
}); 