import { useNavigate } from 'react-router-dom'

import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { problems } from '@/mockData/problems'
import { Problem } from '@/types'
import { generateSlug } from '@/utils/helper'
import { getProblems } from '@/utils/apis'
import { useQuery } from '@tanstack/react-query'

const columns: ColumnDef<Problem>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: '#'
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Tên'
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Phân loại'
  }
]

export default function ProblemList() {
  const { data } = useQuery({
    queryKey: ['problems'],
    queryFn: getProblems
  })

  const navigate = useNavigate()

  const handleRowClick = (problem: Problem) => {
    const slug = generateSlug(problem.name)
    navigate(`/problems/${problem.id}?problemName=${slug}`)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto p-10'>
        <div className='text-4xl font-bold mb-8 text-center'>Danh sách bài tập</div>
        <DataTable columns={columns} data={problems} onRowClick={handleRowClick} />
      </div>
    </div>
  )
}
