import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './HomePage';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types';

// Mock the animation components
vi.mock('@/components/animation/SplitText', () => ({
  default: ({ text }: { text: string }) => <div data-testid="split-text">{text}</div>
}));

vi.mock('@/components/animation/BlurText', () => ({
  default: ({ text }: { text: string }) => <div data-testid="blur-text">{text}</div>
}));

// Mock the auth store
vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn()
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('HomePage', () => {
  const user = userEvent.setup();

  it('renders welcome message', async () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      return selector({ isAuth: false, user: null, reset: () => {} });
    });

    const { user } = render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('split-text')).toHaveTextContent('Welcome to CSE-LBDS');
      expect(screen.getByTestId('blur-text')).toHaveTextContent('System for detecting and suggesting fixes for logical bugs in programming exercises');
    });
  });

  it('shows login button when user is not authenticated', async () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      return selector({ isAuth: false, user: null, reset: () => {} });
    });

    const { user } = render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Login with Google')).toBeInTheDocument();
      expect(screen.getByAltText('Google Logo')).toBeInTheDocument();
    });
  });

  it('shows problem list link when user is authenticated', async () => {
    const mockUser: User = {
      email: 'test@example.com',
      first_time_login: false,
      name: 'Test User',
      picture: 'test.jpg',
      sub: '123'
    };

    vi.mocked(useAuthStore).mockImplementation((selector) => {
      return selector({ isAuth: true, user: mockUser, reset: () => {} });
    });

    const { user } = render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Problem List')).toBeInTheDocument();
    });
  });
}); 