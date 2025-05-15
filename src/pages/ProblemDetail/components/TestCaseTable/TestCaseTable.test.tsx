import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TestCaseTable from './TestCaseTable'
import { TestCase } from '@/types'
import { STATUS_TITLE_MAPPING } from '@/utils/constants'
import { normalizedText } from '@/utils/source-code'

describe('TestCaseTable', () => {
  const mockTestCases: TestCase[] = [
    {
      input: 'test input 1',
      output: 'actual output 1',
      testcode: false,
      is_correct: true,
      expected_output: 'expected output 1'
    },
    {
      input: 'test input 2',
      output: 'actual output 2',
      testcode: false,
      is_correct: false,
      expected_output: 'expected output 2'
    }
  ]

  it('renders test cases in a table', () => {
    render(<TestCaseTable testcases={mockTestCases} score={0.5} status={1} />)
    
    // Check table headers
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(4)
    expect(headers[1]).toHaveTextContent('Test')
    expect(headers[2]).toHaveTextContent('Expected')
    expect(headers[3]).toHaveTextContent('Got')

    // Check test case rows
    const rows = screen.getAllByRole('row').slice(1) // Skip header row
    
    // First test case (correct)
    const firstRow = rows[0]
    const firstRowCells = within(firstRow).getAllByRole('cell')
    expect(firstRowCells[1]).toHaveTextContent('test input 1')
    expect(firstRowCells[2]).toHaveTextContent('expected output 1')
    expect(firstRowCells[3]).toHaveTextContent(normalizedText('actual output 1'))
    expect(firstRowCells[0].querySelector('.text-green-600')).toBeInTheDocument() // Check icon

    // Second test case (incorrect)
    const secondRow = rows[1]
    const secondRowCells = within(secondRow).getAllByRole('cell')
    expect(secondRowCells[1]).toHaveTextContent('test input 2')
    expect(secondRowCells[2]).toHaveTextContent('expected output 2')
    expect(secondRowCells[3]).toHaveTextContent(normalizedText('actual output 2'))
    expect(secondRowCells[0].querySelector('.text-red-600')).toBeInTheDocument() // Check icon
  })

  it('renders status message based on status code', () => {
    render(<TestCaseTable testcases={mockTestCases} score={0.5} status={1} />)
    expect(screen.getByText(STATUS_TITLE_MAPPING[1])).toBeInTheDocument()
  })

  it('applies correct background color based on score', () => {
    // Score < 1 (yellow background)
    const { rerender } = render(<TestCaseTable testcases={mockTestCases} score={0.5} status={1} />)
    const yellowContainer = screen.getByRole('table').closest('div[class*="bg-yellow-100"]')
    expect(yellowContainer).toBeInTheDocument()

    // Score = 1 (green background)
    rerender(<TestCaseTable testcases={mockTestCases} score={1} status={4} />)
    const greenContainer = screen.getByRole('table').closest('div[class*="bg-green-200"]')
    expect(greenContainer).toBeInTheDocument()
  })

  it('handles empty test cases', () => {
    render(<TestCaseTable testcases={[]} score={0} status={1} />)
    
    // Table structure should still be present
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(4)
    
    // No data rows should be present
    const rows = screen.queryAllByRole('row')
    expect(rows).toHaveLength(1) // Only header row
  })

  it('handles test cases with testcode', () => {
    const testCasesWithCode: TestCase[] = [
      {
        input: 'test code input',
        testcode: true,
        output: 'actual output',
        expected_output: 'expected output',
        is_correct: true
      }
    ]

    render(<TestCaseTable testcases={testCasesWithCode} score={1} status={4} />)
    
    const rows = screen.getAllByRole('row').slice(1)
    const cells = within(rows[0]).getAllByRole('cell')
    expect(cells[1]).toHaveTextContent('test code input') // Shows input when available
    expect(cells[2]).toHaveTextContent('expected output')
    expect(cells[3]).toHaveTextContent(normalizedText('actual output'))
    expect(cells[0].querySelector('.text-green-600')).toBeInTheDocument() // Check icon
  })
}) 