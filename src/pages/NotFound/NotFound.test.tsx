import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('renders 404 error message', () => {
    const { user } = render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('displays the meme image', () => {
    const { user } = render(<NotFound />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/src/assets/are-you-lost-meme.jpg');
  });

  it('renders home button with correct link', () => {
    const { user } = render(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('applies correct styling classes', () => {
    const { user } = render(<NotFound />);
    const container = screen.getByRole('main', { hidden: true });
    expect(container).toHaveClass('bg-gray-50', 'w-full', 'h-[100vh]', 'flex', 'items-center', 'justify-center');
  });
}); 