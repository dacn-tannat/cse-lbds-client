import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { useParams } from 'react-router-dom';
import ProblemDetail from './ProblemDetail';
import { getProblemById, predict, submitCode } from '@/utils/apis';
import { Problem, SubmissionResponse } from '@/types';

// Mock the API and router hooks
vi.mock('@/utils/apis', () => ({
  getProblemById: vi.fn(),
  predict: vi.fn(),
  submitCode: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn()
  };
});

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

describe('ProblemDetail', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ slug: '1-test-problem' });
    vi.mocked(predict).mockResolvedValue({
      data: {
        detail: 'Success',
        data: {
          id: 1,
          model_id: 1,
          source_code_id: 1,
          buggy_position: []
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any
    });

    const mockSubmissionResponse: SubmissionResponse = {
      source_code_id: 1,
      source_code: 'test code',
      user_id: '1',
      problem_id: 1,
      status: 0,
      score: 100,
      test_case_sample: [],
      message: 'Success'
    };

    vi.mocked(submitCode).mockResolvedValue({
      data: {
        detail: 'Success',
        data: mockSubmissionResponse
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(getProblemById).mockImplementation(() => new Promise(() => {}));
    const { user } = render(<ProblemDetail />);
    expect(screen.getByRole('main', { hidden: true })).toBeInTheDocument();
  });

  it('renders problem information when data is loaded', async () => {
    vi.mocked(getProblemById).mockResolvedValue({
      data: {
        detail: 'Success',
        data: mockProblem
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any
    });

    const { user } = render(<ProblemDetail />);

    await waitFor(() => {
      expect(screen.getByText(`[${mockProblem.lab_id}_${mockProblem.category}] ${mockProblem.name}`)).toBeInTheDocument();
    });

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders error state when API call fails', async () => {
    vi.mocked(getProblemById).mockRejectedValue(new Error('Failed to fetch'));

    const { user } = render(<ProblemDetail />);

    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });
  });

  it('renders example table correctly', async () => {
    vi.mocked(getProblemById).mockResolvedValue({
      data: {
        detail: 'Success',
        data: mockProblem
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any
    });

    const { user } = render(<ProblemDetail />);

    await waitFor(() => {
      expect(screen.getByText(`[${mockProblem.lab_id}_${mockProblem.category}] ${mockProblem.name}`)).toBeInTheDocument();
    });

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Result')).toBeInTheDocument();
    expect(screen.getByText('test input')).toBeInTheDocument();
    expect(screen.getByText('test output')).toBeInTheDocument();
  });

  it('handles empty examples gracefully', async () => {
    vi.mocked(getProblemById).mockResolvedValue({
      data: {
        detail: 'Success',
        data: {
          ...mockProblem,
          examples: []
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any
    });

    const { user } = render(<ProblemDetail />);

    await waitFor(() => {
      expect(screen.getByText(`[${mockProblem.lab_id}_${mockProblem.category}] ${mockProblem.name}`)).toBeInTheDocument();
    });

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
}); 