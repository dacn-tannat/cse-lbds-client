import { render, screen, within, fireEvent } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'
import FeedbackModal from './FeedbackModal'
import * as LSUtils from '@/utils/local-storage'
import * as APIs from '@/utils/apis'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'

// Create a new QueryClient instance for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})

// Wrapper component for tests
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <Toaster />
  </QueryClientProvider>
)

describe('FeedbackModal', () => {
  const mockLastPrediction: PredictionLS = {
    predictionId: 1,
    sourceCode: 'const x = 1;\nconst y = 2;\nconsole.log(x + y);',
    buggyPositions: [
      {
        id: 1,
        line_number: 1,
        col_number: 1,
        original_token: 'const x',
        predicted_token: 'let x',
        position: 1,
        start_index: 0,
        is_token_error: true,
        is_suggestion_useful: true
      },
      {
        id: 2,
        line_number: 2,
        col_number: 1,
        original_token: 'const y',
        predicted_token: 'let y',
        position: 2,
        start_index: 0,
        is_token_error: true,
        is_suggestion_useful: true
      }
    ]
  }

  const mockOnSubmittedFeedback = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
    vi.spyOn(LSUtils, 'getRemainingEmptyFeedbackSubmits').mockReturnValue(3)
    vi.spyOn(LSUtils, 'clearPredictionFromLS').mockImplementation(() => {})
    vi.spyOn(LSUtils, 'saveRemainingEmptyFeedbackSubmits').mockImplementation(() => {})
    vi.spyOn(APIs, 'bugCheck').mockResolvedValue({
      data: {
        data: [],
        detail: 'Success'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    })
    vi.spyOn(APIs, 'restrictUser').mockResolvedValue({
      data: {
        data: {
          id: 1,
          sub: 'test-sub',
          email: 'test@test.com',
          exp: Date.now() + 3600000
        },
        detail: 'Success'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    })
  })

  it('renders null when lastPrediction is null', () => {
    render(<FeedbackModal lastPrediction={null} onSubmittedFeedback={mockOnSubmittedFeedback} />, 
      { wrapper }
    )
    expect(screen.queryByRole('button', { name: /send feedback/i })).not.toBeInTheDocument()
  })

  it('renders the feedback modal with correct content', () => {
    render(<FeedbackModal lastPrediction={mockLastPrediction} onSubmittedFeedback={mockOnSubmittedFeedback} />, 
      { wrapper }
    )
    
    // Open modal
    const sendFeedbackButton = screen.getByRole('button', { name: /send feedback/i })
    fireEvent.click(sendFeedbackButton)

    // Check modal title and description
    expect(screen.getByRole('heading', { name: /send feedback/i })).toBeInTheDocument()
    expect(screen.getByText(/Please send feedback before submitting new source code/i)).toBeInTheDocument()
    expect(screen.getByText(/The table includes some error positions/i)).toBeInTheDocument()

    // Check source code section
    const sourceCodeTitle = screen.getByText('Source code')
    expect(sourceCodeTitle).toBeInTheDocument()
    
    // Find the pre element containing the source code
    const sourceCodeContainer = screen.getByText((content, element) => {
      const isPreElement = element?.tagName.toLowerCase() === 'pre'
      const hasText = (text: string) => element?.textContent?.includes(text) ?? false
      return isPreElement && hasText('const x') && hasText('const y') && hasText('console.log')
    })
    expect(sourceCodeContainer).toBeInTheDocument()
    expect(sourceCodeContainer).toHaveClass('whitespace-pre', 'font-mono')

    // Check suggestions table
    const suggestionHeader = screen.getByRole('columnheader', { name: /suggestion/i })
    expect(suggestionHeader).toBeInTheDocument()
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    // Check table headers
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(5)
    expect(headers[0]).toHaveTextContent('#')
    expect(headers[1]).toHaveTextContent('Line')
    expect(headers[2]).toHaveTextContent('Column')
    expect(headers[3]).toHaveTextContent('Position to review')
    expect(headers[4]).toHaveTextContent('Suggestion')

    // Check table rows
    const rows = screen.getAllByRole('row').slice(1) // Skip header row
    expect(rows).toHaveLength(2)

    // Check first row content
    const firstRowCells = within(rows[0]).getAllByRole('cell')
    expect(firstRowCells[0]).toHaveTextContent('1')
    expect(firstRowCells[1]).toHaveTextContent('1')
    expect(firstRowCells[2]).toHaveTextContent('1')
    expect(firstRowCells[3]).toHaveTextContent('const x')
    expect(firstRowCells[4]).toHaveTextContent('let x')

    // Check second row content
    const secondRowCells = within(rows[1]).getAllByRole('cell')
    expect(secondRowCells[0]).toHaveTextContent('2')
    expect(secondRowCells[1]).toHaveTextContent('2')
    expect(secondRowCells[2]).toHaveTextContent('1')
    expect(secondRowCells[3]).toHaveTextContent('const y')
    expect(secondRowCells[4]).toHaveTextContent('let y')

    // Check footer notes
    const positionNote = screen.getByTestId('position-note')
    const suggestionNote = screen.getByTestId('suggestion-note')
    expect(positionNote).toHaveTextContent(/positions.*correct the errors/i)
    expect(suggestionNote).toHaveTextContent(/suggestions.*correct the errors/i)
  })

  it('handles checkbox interactions correctly', () => {
    render(<FeedbackModal lastPrediction={mockLastPrediction} onSubmittedFeedback={mockOnSubmittedFeedback} />, 
      { wrapper }
    )
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /send feedback/i }))

    // Get all checkboxes
    const rows = screen.getAllByRole('row').slice(1)
    const firstRowCells = within(rows[0]).getAllByRole('cell')
    const positionCheckbox = within(firstRowCells[3]).getByRole('checkbox')
    const suggestionCheckbox = within(firstRowCells[4]).getByRole('checkbox')

    // Check position checkbox
    fireEvent.click(positionCheckbox)
    expect(positionCheckbox).toBeChecked()
    expect(suggestionCheckbox).toBeChecked() // Should be automatically checked

    // Uncheck position checkbox
    fireEvent.click(positionCheckbox)
    expect(positionCheckbox).not.toBeChecked()
    expect(suggestionCheckbox).toBeChecked() // Should remain checked

    // Check suggestion checkbox independently
    fireEvent.click(suggestionCheckbox)
    expect(suggestionCheckbox).not.toBeChecked()
    expect(positionCheckbox).not.toBeChecked()
  })
}) 