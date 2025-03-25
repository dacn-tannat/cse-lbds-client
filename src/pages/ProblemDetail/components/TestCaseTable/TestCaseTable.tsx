import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TestCase } from '@/types'
import { STATUS_TITLE_MAPPING } from '@/utils/constants'
import { normalizedText } from '@/utils/source-code'
import { Check, X } from 'lucide-react'
import { memo } from 'react'

interface TestCaseProps {
  testcases: TestCase[]
  score: number
  status: number
}

const TestCaseTable = ({ testcases, score, status }: TestCaseProps) => {
  return (
    <div className='relative bg-orange-100 backdrop-blur rounded-xl p-6 shadow mb-4'>
      {/* Table */}
      <div className='relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]'>
        <div className={`p-4 ${score < 1 ? 'bg-yellow-100' : 'bg-green-200'}`}>
          <Table className='border-collapse'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px] border-2 border-gray-200 bg-white'></TableHead>
                <TableHead className='border-2 border-gray-200 font-semibold text-lg bg-white'>Test</TableHead>
                <TableHead className='border-2 border-gray-200 font-semibold text-lg bg-white'>Expected</TableHead>
                <TableHead className='border-2 border-gray-200 font-semibold text-lg bg-white'>Got</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testcases.map((testcase, index) => (
                <TableRow key={index}>
                  <TableCell
                    className={`border-2 border-gray-200 text-center ${index % 2 ? 'bg-gray-50' : 'bg-gray-100'}`}
                  >
                    {testcase.is_correct ? (
                      <Check className='size-6 text-green-600 mx-auto' />
                    ) : (
                      <X className='size-6 text-red-600 mx-auto' />
                    )}
                  </TableCell>
                  <TableCell
                    className={`border-2 border-gray-200 font-mono text-left align-top whitespace-pre-wrap ${
                      index % 2 ? 'bg-gray-50' : 'bg-gray-100'
                    }`}
                  >
                    {testcase.input || testcase.testcode}
                  </TableCell>
                  <TableCell
                    className={`border-2 border-gray-200 font-mono text-left align-top whitespace-pre-wrap  ${
                      index % 2 ? 'bg-gray-50' : 'bg-gray-100'
                    }`}
                  >
                    {testcase.expected_output!}
                  </TableCell>
                  <TableCell
                    className={`border-2 border-gray-200 font-mono text-left align-top whitespace-pre-wrap ${
                      index % 2 ? 'bg-gray-50' : 'bg-gray-100'
                    }`}
                  >
                    {normalizedText(testcase.output)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='mt-2 text-lg'>
            <span className='font-normal text-gray-600'>{STATUS_TITLE_MAPPING[status]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(TestCaseTable)
