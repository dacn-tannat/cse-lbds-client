import { useNavigate } from 'react-router-dom'

import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Problem } from '@/types'
import { generateSlug } from '@/utils/slug'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useQuery } from '@tanstack/react-query'
import { getActiveProblems } from '@/utils/apis'

const columns: ColumnDef<Problem>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => row.index + 1
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
  const navigate = useNavigate()

  const { data, isSuccess } = useQuery({
    queryKey: ['problems'],
    queryFn: getActiveProblems,
    staleTime: Infinity
  })

  const problems =
    isSuccess &&
    (data?.data.data as Problem[])
      .filter((problem) => problem.is_active)
      .sort((a, b) => a.id - b.id)
      .reduce((acc, problem) => {
        if (!acc[problem.lab_id]) {
          acc[problem.lab_id] = []
        }
        acc[problem.lab_id].push(problem)
        return acc
      }, {} as Record<string, Problem[]>)

  const handleRowClick = (problem: Problem) => {
    const slug = generateSlug(problem.name, problem.id)
    navigate(`/problems/${slug}`)
  }

  return (
    <div className='bg-gray-50'>
      <div className='max-w-7xl mx-auto p-8 min-h-screen'>
        <div className='text-4xl font-bold mb-8 text-center'>Kỹ thuật lập trình</div>
        {problems &&
          Object.entries(problems).map(([lab, problems]) => (
            <Accordion type='multiple' className='w-full' key={lab}>
              <AccordionItem value={`${lab}`} className='mb-3'>
                <AccordionTrigger className='h-[3.5rem] w-full text-xl font-medium bg-gray-100 px-4 py-2 rounded-xl border-[2px] hover:bg-gray-300 hover:no-underline'>
                  {lab}
                </AccordionTrigger>
                <AccordionContent>
                  <DataTable columns={columns} data={problems} onRowClick={handleRowClick} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
      </div>
    </div>
  )
}
