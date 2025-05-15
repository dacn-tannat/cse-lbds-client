import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { loginWithGoogle } from '@/utils/apis'
import GoogleCallback from './GoogleCallback'
import { ApiResponse, AccountResponse } from '@/types'
import { AxiosResponse } from 'axios'

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn()
  }
})

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}))

vi.mock('@/utils/apis', () => ({
  loginWithGoogle: vi.fn()
}))

// Test setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GoogleCallback />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('GoogleCallback', () => {
  const mockNavigate = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    // Clear URL parameters
    window.history.pushState({}, '', '/')
  })

  it('renders loading state', () => {
    renderComponent()
    
    expect(screen.getByText(/Your request is processing/i)).toBeInTheDocument()
    // Check for the Loader2 component by its class
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('redirects to home if no code parameter is present', async () => {
    renderComponent()

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while logging in. Please try again'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('handles successful login', async () => {
    // Set URL with code parameter
    window.history.pushState({}, '', '/?code=test_code')
    
    const mockResponse: AxiosResponse<ApiResponse<AccountResponse>> = {
      data: {
        data: {
          access_token: 'test_token',
          user: {
            email: 'test@example.com',
            first_time_login: false,
            name: 'Test User',
            picture: 'https://example.com/avatar.jpg',
            sub: 'test_sub'
          }
        },
        detail: 'Login successfully'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    }
    vi.mocked(loginWithGoogle).mockResolvedValueOnce(mockResponse)

    renderComponent()

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalledWith('test_code')
      expect(toast).toHaveBeenCalledWith({
        variant: 'success',
        title: 'Success',
        description: 'Login successfully'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/problems')
    })
  })

  it('handles login error with error response', async () => {
    // Set URL with code parameter
    window.history.pushState({}, '', '/?code=test_code')
    
    const mockError = {
      isAxiosError: true,
      response: {
        data: {
          detail: 'Invalid credentials'
        }
      }
    }
    vi.mocked(loginWithGoogle).mockRejectedValueOnce(mockError)

    renderComponent()

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalledWith('test_code')
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid credentials'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('handles login error without error response', async () => {
    // Set URL with code parameter
    window.history.pushState({}, '', '/?code=test_code')
    
    const mockError = {
      isAxiosError: true,
      response: null
    }
    vi.mocked(loginWithGoogle).mockRejectedValueOnce(mockError)

    renderComponent()

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalledWith('test_code')
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'You do not have permission to access to the system'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
