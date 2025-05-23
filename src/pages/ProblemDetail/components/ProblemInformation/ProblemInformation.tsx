import DOMPurify from 'dompurify'
import { memo } from 'react'

import { Problem } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const ProblemInformation = ({ problem }: { problem: Problem }) => {
  return (
    <div className='bg-gray-100 shadow rounded-xl p-6 border-2 mb-4 max-h-[400px] overflow-y-scroll'>
      <div className='text-xl font-semibold mb-2'>Description</div>
      <div
        className='text-gray-800 mb-4'
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(problem.description || '') }}
      />
      <div className='text-xl font-semibold mb-2'>Example</div>
      <Table className='border-collapse'>
        <TableHeader>
          <TableRow>
            <TableHead className='border-2 border-gray-300 font-semibold text-lg bg-gray-200'>Test</TableHead>
            <TableHead className='border-2 border-gray-300 font-semibold text-lg bg-gray-200'>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problem.examples?.map((example, index) => (
            <TableRow key={index}>
              <TableCell
                className={`${
                  index % 2 ? 'bg-white' : ''
                } border-2 border-gray-300 font-mono whitespace-pre-wrap text-left align-top`}
              >
                {example.input || example.testcode}
              </TableCell>
              <TableCell
                className={`${
                  index % 2 ? 'bg-white' : ''
                } border-2 border-gray-300 font-mono whitespace-pre-wrap text-left align-top`}
              >
                {example.output}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default memo(ProblemInformation)
