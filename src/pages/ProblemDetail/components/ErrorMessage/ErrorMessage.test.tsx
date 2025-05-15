import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';
import { STATUS_TITLE_MAPPING } from '@/utils/constants';

describe('ErrorMessage', () => {
  const defaultProps = {
    message: 'An error occurred',
    status: 0
  };

  it('renders compile error message', () => {
    const props = {
      message: 'Syntax error on line 5',
      status: 0
    };

    render(<ErrorMessage {...props} />);
    expect(screen.getByText(STATUS_TITLE_MAPPING[0])).toBeInTheDocument();
    expect(screen.getByText(props.message)).toBeInTheDocument();
  });

  it('renders wrong answer message', () => {
    const props = {
      message: 'Expected output: 10\nActual output: 5',
      status: 1
    };

    render(<ErrorMessage {...props} />);
    expect(screen.getByText(STATUS_TITLE_MAPPING[1])).toBeInTheDocument();
    const preElement = screen.getByText((content) => content.includes('Expected output: 10'));
    expect(preElement).toBeInTheDocument();
  });

  it('renders time limit message', () => {
    const props = {
      message: 'Execution time exceeded 1000ms',
      status: 2
    };

    render(<ErrorMessage {...props} />);
    expect(screen.getByText(STATUS_TITLE_MAPPING[2])).toBeInTheDocument();
    expect(screen.getByText(props.message)).toBeInTheDocument();
  });

  it('renders runtime error message', () => {
    const props = {
      message: 'Division by zero on line 10',
      status: 7
    };

    render(<ErrorMessage {...props} />);
    expect(screen.getByText(STATUS_TITLE_MAPPING[7])).toBeInTheDocument();
    expect(screen.getByText(props.message)).toBeInTheDocument();
  });

  it('renders with error icon', () => {
    render(<ErrorMessage {...defaultProps} />);
    const icon = screen.getByTestId('error-icon');
    expect(icon).toBeInTheDocument();
  });

  it('applies error styling', () => {
    render(<ErrorMessage {...defaultProps} />);
    const container = screen.getByTestId('error-container');
    expect(container).toHaveClass('bg-red-100', 'text-red-600');
  });
}); 