import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import ProblemList from './ProblemList';
import { getActiveProblems } from '@/utils/apis';
import { ApiResponse, Problem } from '@/types';

// Mock the navigation and API
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

vi.mock('@/utils/apis', () => ({
  getActiveProblems: vi.fn()
}));

const mockProblems: AxiosResponse<ApiResponse<Problem[]>> = {
  data: {
    detail: 'Success',
    data: [
      {
        id: 1,
        name: 'Problem 1',
        category: 'Arrays',
        lab_id: 'Lab01',
        is_active: true,
        description: 'Test description',
        sample_code: null,
        examples: [],
        constrain: []
      },
      {
        id: 2,
        name: 'Problem 2',
        category: 'Strings',
        lab_id: 'Lab01',
        is_active: true,
        description: 'Test description 2',
        sample_code: null,
        examples: [],
        constrain: []
      },
      {
        id: 3,
        name: 'Problem 3',
        category: 'Arrays',
        lab_id: 'Lab02',
        is_active: true,
        description: 'Test description 3',
        sample_code: null,
        examples: [],
        constrain: []
      }
    ]
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { headers: {} } as any
};

describe('ProblemList', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(getActiveProblems).mockResolvedValue(mockProblems);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', async () => {
    const { user } = render(<ProblemList />);
    
    await waitFor(() => {
      expect(screen.getByText('Programming Fundamentals Laboratory Exercises - Semester 242')).toBeInTheDocument();
    });
  });

  it('renders labs and their categories', async () => {
    const { user } = render(<ProblemList />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Lab01')).toBeInTheDocument();
      expect(screen.getByText('Lab02')).toBeInTheDocument();
    });

    // Click Lab01 accordion
    const lab01Button = screen.getByRole('button', { name: /Lab01/i });
    await user.click(lab01Button);

    // Wait for Lab01 accordion content and verify categories
    await waitFor(() => {
      const arraysCategoryButton = screen.getByRole('button', { name: /Arrays \(1\)/i });
      const stringsCategoryButton = screen.getByRole('button', { name: /Strings \(1\)/i });
      expect(arraysCategoryButton).toBeInTheDocument();
      expect(stringsCategoryButton).toBeInTheDocument();
    });

    // Click Lab02 accordion
    const lab02Button = screen.getByRole('button', { name: /Lab02/i });
    await user.click(lab02Button);

    // Wait for Lab02 accordion content
    await waitFor(() => {
      const lab01Arrays = screen.getByRole('button', { name: /Arrays \(1\)/i, hidden: true });
      const lab02Arrays = screen.getByRole('button', { name: /Arrays \(1\)/i });
      expect(lab01Arrays).toBeInTheDocument();
      expect(lab02Arrays).toBeInTheDocument();
    });
  });

  it('displays the correct number of problems in each category', async () => {
    const { user } = render(<ProblemList />);
    
    // Wait for data to load and click Lab01 accordion
    await waitFor(() => {
      expect(screen.getByText('Lab01')).toBeInTheDocument();
    });
    const lab01Button = screen.getByRole('button', { name: /Lab01/i });
    await user.click(lab01Button);

    // Wait for and click the Arrays category
    await waitFor(() => {
      const arraysCategoryButton = screen.getByRole('button', { name: /Arrays \(1\)/i });
      expect(arraysCategoryButton).toBeInTheDocument();
    });
    const arraysButton = screen.getByRole('button', { name: /Arrays \(1\)/i });
    await user.click(arraysButton);

    // Wait for problem to appear
    await waitFor(() => {
      expect(screen.getByText('Problem 1')).toBeInTheDocument();
    });
  });

  it('navigates to problem detail when clicking a problem', async () => {
    const { user } = render(<ProblemList />);
    
    // Wait for data to load and click Lab01 accordion
    await waitFor(() => {
      expect(screen.getByText('Lab01')).toBeInTheDocument();
    });
    const lab01Button = screen.getByRole('button', { name: /Lab01/i });
    await user.click(lab01Button);

    // Wait for and click the Arrays category
    await waitFor(() => {
      const arraysCategoryButton = screen.getByRole('button', { name: /Arrays \(1\)/i });
      expect(arraysCategoryButton).toBeInTheDocument();
    });
    const arraysButton = screen.getByRole('button', { name: /Arrays \(1\)/i });
    await user.click(arraysButton);

    // Wait for and click Problem 1
    await waitFor(() => {
      expect(screen.getByText('Problem 1')).toBeInTheDocument();
    });
    const problem1Row = screen.getByText('Problem 1').closest('tr');
    await user.click(problem1Row!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/problems/1-problem-1');
  });

  it('filters out inactive problems', async () => {
    const inactiveProblems = {
      ...mockProblems,
      data: {
        ...mockProblems.data,
        data: [
          ...mockProblems.data.data,
          {
            id: 4,
            name: 'Inactive Problem',
            category: 'Arrays',
            lab_id: 'Lab01',
            is_active: false,
            description: 'Inactive problem description',
            sample_code: null,
            examples: [],
            constrain: []
          }
        ]
      }
    };

    vi.mocked(getActiveProblems).mockResolvedValue(inactiveProblems);
    const { user } = render(<ProblemList />);

    // Wait for data to load and click Lab01 accordion
    await waitFor(() => {
      expect(screen.getByText('Lab01')).toBeInTheDocument();
    });
    const lab01Button = screen.getByRole('button', { name: /Lab01/i });
    await user.click(lab01Button);

    // Wait for and click the Arrays category
    await waitFor(() => {
      const arraysCategoryButton = screen.getByRole('button', { name: /Arrays \(1\)/i });
      expect(arraysCategoryButton).toBeInTheDocument();
    });
    const arraysButton = screen.getByRole('button', { name: /Arrays \(1\)/i });
    await user.click(arraysButton);

    // Verify inactive problem is not shown
    await waitFor(() => {
      expect(screen.queryByText('Inactive Problem')).not.toBeInTheDocument();
    });
  });
}); 