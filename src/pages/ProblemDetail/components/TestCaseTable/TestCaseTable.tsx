import { DataTable } from '@/components/ui/data-table'
import { TestCase } from '@/types'
import { getPredictions } from '@/utils/apis'
import { ColumnDef } from '@tanstack/react-table'
import { SquareCheck, SquareX } from 'lucide-react'

const columns: ColumnDef<TestCase>[] = [
  {
    id: 'input',
    accessorKey: 'input',
    header: 'Input'
  },
  {
    id: 'output',
    accessorKey: 'output',
    header: 'Output'
  },
  {
    id: 'is_correct',   
    accessorKey: 'is_correct',
    header: 'Result',
    cell: ({row}) => row.original.is_correct ? <SquareCheck className='inline' /> : <SquareX className='inline' />
  }
]

interface TestCaseProps {
  source_code_id: number
  testcase: TestCase[]
  score: number
  status: number
}

export default function TestCaseTable({source_code_id, testcase, score, status} : TestCaseProps) {
  const prediction = getPredictions(source_code_id)
  console.log(prediction)
  return <div className={`mt-6 rounded-xl ${status === 4 ? 'bg-green-100' : 'bg-orange-100'}`}>
    <div className='ml-6 py-2 font-semibold'>Score: {score}/10</div>
    <DataTable columns={columns} data={testcase} />
    {/* {status !== 4 && } */}
  </div>
}
