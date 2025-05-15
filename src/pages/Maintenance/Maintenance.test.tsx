import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Maintenance from './Maintenance';

describe('Maintenance', () => {
  it('renders maintenance message', () => {
    const { user } = render(<Maintenance />);
    expect(screen.getByText('Server is under maintenance')).toBeInTheDocument();
  });

  it('displays explanation message', () => {
    const { user } = render(<Maintenance />);
    expect(
      screen.getByText('We are upgrading our system to provide a better experience. Please come back later.')
    ).toBeInTheDocument();
  });

  it('shows alert icon', () => {
    const { user } = render(<Maintenance />);
    const alertIcon = screen.getByTestId('alert-triangle-icon');
    expect(alertIcon).toBeInTheDocument();
    expect(alertIcon).toHaveClass('text-amber-600');
  });

  it('applies correct styling', () => {
    const { user } = render(<Maintenance />);
    const container = screen.getByRole('main', { hidden: true });
    expect(container).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-center', 'bg-gray-50');
    
    const iconContainer = screen.getByTestId('icon-container');
    expect(iconContainer).toHaveClass('rounded-full', 'bg-amber-100', 'p-3');
  });
}); 