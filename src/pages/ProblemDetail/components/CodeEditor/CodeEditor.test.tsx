import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Editor } from '@monaco-editor/react'
import { toast } from '@/hooks/use-toast'
import { submitCode } from '@/utils/apis'
import { EDITOR_THEME, FONT_SIZE } from '@/utils/constants'
import CodeEditor from './CodeEditor'
import React from 'react'
import userEvent from '@testing-library/user-event'

// Mock @monaco-editor/react
vi.mock('@monaco-editor/react', () => ({
  Editor: vi.fn(() => null),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}))

vi.mock('@/utils/apis', () => ({
  submitCode: vi.fn()
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn(() => ({
      pathname: '/problems/1'
    }))
  }
})

vi.mock('@/components/ui/slider', () => ({
  Slider: vi.fn(({ onValueChange, defaultValue, ...props }) => (
    <input
      type="range"
      role="slider"
      defaultValue={defaultValue[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
      {...props}
    />
  ))
}))

// Mock local storage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn()
}
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
})

// Test setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

const renderComponent = (props = {}) => {
  const defaultProps = {
    problem_id: 1,
    sample_code: 'int main() { return 0; }'
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CodeEditor {...defaultProps} {...props} />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('CodeEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionStorage.getItem.mockReturnValue('{}')
  })

  it('renders with default settings', () => {
    renderComponent()
    
    // Check if language badge is present
    expect(screen.getByText('C++')).toBeInTheDocument()
    
    // Check if theme toggle button is present
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
    
    // Check if font size slider is present
    expect(screen.getByRole('slider')).toBeInTheDocument()
    
    // Check if submit button is present
    expect(screen.getByRole('button', { name: /submit code/i })).toBeInTheDocument()
  })

  it('initializes Monaco editor with correct props', () => {
    renderComponent()
    
    expect(Editor).toHaveBeenCalledWith(
      expect.objectContaining({
        height: '350px',
        language: 'cpp',
        theme: 'vs-dark',
        options: expect.objectContaining({
          fontSize: FONT_SIZE.DEFAULT,
          minimap: { enabled: false }
        })
      }),
      expect.any(Object)
    )
  })

  it('toggles theme when theme button is clicked', async () => {
    renderComponent()
    
    const themeButton = screen.getByRole('button', { name: /toggle theme/i })
    
    // Initial theme is dark
    expect(Editor).toHaveBeenLastCalledWith(
      expect.objectContaining({
        theme: 'vs-dark'
      }),
      expect.any(Object)
    )
    
    // Click to toggle theme
    fireEvent.click(themeButton)
    
    await waitFor(() => {
      expect(Editor).toHaveBeenLastCalledWith(
        expect.objectContaining({
          theme: 'vs-light'
        }),
        expect.any(Object)
      )
    })
  })

  it('updates font size when slider value changes', async () => {
    renderComponent();
  
    // Find the Slider component
    const slider = screen.getByRole('slider');
  
    // Simulate the Slider value change
    const fontSize = 16;
    fireEvent.change(slider, { target: { value: fontSize.toString() } });
  
    // Verify that the font size is displayed
    await waitFor(() => {
      expect(screen.getByText(fontSize.toString())).toBeInTheDocument();
    });
  
    // Verify that the Editor was called with updated fontSize
    await waitFor(() => {
      expect(Editor).toHaveBeenLastCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            fontSize: fontSize,
          }),
        }),
        expect.any(Object)
      )
    })
  })

//   it('handles code submission with empty code', async () => {
//     const user = userEvent.setup();
//     vi.mocked(require('@/utils/local-storage').getPredictionFromLS).mockReturnValue(undefined);
  
//     // Mock Editor to simulate empty content on render
//     vi.mock('@monaco-editor/react', () => ({
//       Editor: vi.fn(({ onChange }) => {
//         act(() => {
//           onChange('');
//         });
//         return null;
//       }),
//     }));
  
//     renderComponent();
  
//     const submitButton = screen.getByRole('button', { name: /submit code/i });
//     await user.click(submitButton);
  
//     await waitFor(() => {
//       expect(toast).toHaveBeenCalledWith(
//         expect.objectContaining({
//           variant: 'destructive',
//           title: 'Lỗi',
//           description: 'Empty source code. Please try again',
//         })
//       );
//       expect(submitCode).not.toHaveBeenCalled();
//     }, { timeout: 2000 });
//   })

  it('handles successful code submission', async () => {
    const mockSubmissionResponse = {
      data: {
        data: {
          status: 1,
          message: 'Code submitted successfully',
          score: 100,
          test_case_sample: [],
          source_code: 'int main() { return 0; }',
          source_code_id: 1,
          user_id: '1',
          problem_id: 1
        },
        detail: 'Success'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    }
    
    vi.mocked(submitCode).mockResolvedValueOnce(mockSubmissionResponse)
    
    renderComponent()
    
    const submitButton = screen.getByRole('button', { name: /submit code/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(submitCode).toHaveBeenCalledWith({
        problem_id: 1,
        source_code: 'int main() { return 0; }'
      })
    })
  })

  it('handles submission error', async () => {
    const mockError = new Error('Network error')
    vi.mocked(submitCode).mockRejectedValueOnce(mockError)
    
    renderComponent()
    
    const submitButton = screen.getByRole('button', { name: /submit code/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'An error occurred while submitting source code. Please try again',
          description: mockError.message
        })
      )
    })
  })

  it('saves code to session storage when unmounting', () => {
    const { unmount } = renderComponent()
    
    unmount()
    
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      'student_code',
      expect.any(String)
    )
  })

//   it('disables submit button when feedback is required', () => {
//     mockSessionStorage.getItem.mockReturnValue(JSON.stringify({ prediction: 'some prediction' }))
    
//     renderComponent()
    
//     const submitButton = screen.getByRole('button', { name: /submit code/i })
//     expect(submitButton).toBeDisabled()
    
//     // Check if feedback alert is shown
//     expect(screen.getByText(/You need to send feedback/i)).toBeInTheDocument()
//   })
}) 