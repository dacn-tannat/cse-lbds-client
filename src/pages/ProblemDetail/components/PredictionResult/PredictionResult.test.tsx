import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PredictionResult from './PredictionResult'
import { BuggyPosition } from '@/types'
import DOMPurify from 'dompurify'

describe('PredictionResult', () => {
  const mockSourceCode = `function add(a, b) {
    return a + b;
  }`

  const mockBuggyPositions: BuggyPosition[] = [
    {
      id: 1,
      position: 0,
      start_index: 0,
      original_token: 'function',
      predicted_token: 'const',
      line_number: 1,
      col_number: 1,
      is_token_error: true,
      is_suggestion_useful: true
    },
    {
      id: 2,
      position: 1,
      start_index: 20,
      original_token: '+',
      predicted_token: '*',
      line_number: 2,
      col_number: 12,
      is_token_error: false,
      is_suggestion_useful: true
    }
  ]

  it('renders source code section', () => {
    const { container } = render(
      <PredictionResult source_code={mockSourceCode} buggyPositions={mockBuggyPositions} />
    )
    
    // Check for section title
    expect(screen.getByText('Source code')).toBeInTheDocument()
    
    // Check for pre element containing the code
    const preElement = container.querySelector('pre')
    expect(preElement).toBeInTheDocument()
    expect(preElement?.textContent).toContain('function add(a, b)')
    expect(preElement?.textContent).toContain('return a + b')
  })

  it('renders suggestion section with table headers', () => {
    render(<PredictionResult source_code={mockSourceCode} buggyPositions={mockBuggyPositions} />)
    
    // Find the table header row
    const table = screen.getByRole('table')
    const headers = within(table).getAllByRole('columnheader')
    
    expect(headers).toHaveLength(5)
    expect(headers[0]).toHaveTextContent('#')
    expect(headers[1]).toHaveTextContent('Line')
    expect(headers[2]).toHaveTextContent('Column')
    expect(headers[3]).toHaveTextContent('Position to review')
    expect(headers[4]).toHaveTextContent('Suggestion')
  })

  it('renders buggy positions in the table', () => {
    render(<PredictionResult source_code={mockSourceCode} buggyPositions={mockBuggyPositions} />)
    
    // Get all table rows (excluding header)
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row').slice(1)
    
    // First row (first buggy position)
    const firstRowCells = within(rows[0]).getAllByRole('cell')
    expect(firstRowCells[0]).toHaveTextContent('1') // ID
    expect(firstRowCells[1]).toHaveTextContent('1') // Line number
    expect(firstRowCells[2]).toHaveTextContent('1') // Column number
    expect(firstRowCells[3]).toHaveTextContent('function') // Original token
    expect(firstRowCells[4]).toHaveTextContent('const') // Predicted token
    
    // Second row (second buggy position)
    const secondRowCells = within(rows[1]).getAllByRole('cell')
    expect(secondRowCells[0]).toHaveTextContent('2') // ID
    expect(secondRowCells[1]).toHaveTextContent('2') // Line number
    expect(secondRowCells[2]).toHaveTextContent('12') // Column number
    expect(secondRowCells[3]).toHaveTextContent('+') // Original token
    expect(secondRowCells[4]).toHaveTextContent('*') // Predicted token
  })

  it('renders note about suggestions', () => {
    render(<PredictionResult source_code={mockSourceCode} buggyPositions={mockBuggyPositions} />)
    
    const noteText = screen.getByText(/Note:/)
    expect(noteText).toBeInTheDocument()
    
    const noteContainer = noteText.closest('.text-gray-600')
    expect(noteContainer).toHaveTextContent(/The table includes some error positions that/)
    expect(noteContainer).toHaveTextContent(/may be correct or incorrect/)
  })

//   it('renders empty table when no buggy positions are provided', () => {
//     const { container } = render(<PredictionResult source_code={mockSourceCode} buggyPositions={[]} />)
    
//     // Check that sections are rendered
//     expect(screen.getByText('Source code')).toBeInTheDocument()
//     expect(screen.getByText('Suggestion')).toBeInTheDocument()
    
//     // Check that table headers are present
//     const table = screen.getByRole('table')
//     const headers = within(table).getAllByRole('columnheader')
//     expect(headers).toHaveLength(5)
    
//     // Check that table body is empty
//     const tbody = container.querySelector('tbody')
//     expect(tbody).toBeInTheDocument()
//     expect(tbody?.children.length).toBe(0)
//   })
}) 