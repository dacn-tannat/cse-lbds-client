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
    header: '#'
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Problem Name'
  }
]

type CategoryProblems = {
  [category: string]: Problem[]
}

type LabCategories = {
  [labId: string]: CategoryProblems
}

export default function ProblemList() {
  const navigate = useNavigate()

  const { data, isSuccess } = useQuery({
    queryKey: ['problems'],
    queryFn: getActiveProblems,
    staleTime: Infinity
  })

  const problemData =
    isSuccess &&
    (data?.data.data as Problem[])
      .filter((problem) => problem.is_active)
      .sort((a, b) => a.id - b.id)
      .reduce((acc, problem) => {
        if (!acc[problem.lab_id]) {
          acc[problem.lab_id] = {}
        }
        if (!acc[problem.lab_id][problem.category]) {
          acc[problem.lab_id][problem.category] = []
        }
        acc[problem.lab_id][problem.category].push(problem)
        return acc
      }, {} as LabCategories)

  const handleRowClick = (problem: Problem) => {
    const slug = generateSlug(problem.name, problem.id)
    navigate(`/problems/${slug}`)
  }

  return (
    <div className='bg-gray-50 h-full'>
      <div className='max-w-7xl mx-auto p-8'>
        <div className='text-2xl lg:text-3xl font-semibold mb-8 text-center'>
          Programming Fundamentals Laboratory Exercises - Semester 242
        </div>
        {problemData && (
          <Accordion type='single' collapsible className='w-full'>
            {Object.entries(problemData).map(([labId, categories]) => (
              <AccordionItem key={labId} value={labId} className='border rounded-xl mb-4'>
                <AccordionTrigger className='px-6 py-4 font-medium text-xl bg-gray-200 rounded-xl text-gray-700'>
                  {labId}
                </AccordionTrigger>
                <AccordionContent className='px-4 pt-4 pb-2 bg-gray-50 rounded-xl'>
                  <Accordion type='single' collapsible className='w-full'>
                    {Object.entries(categories).map(([category, problems]) => (
                      <AccordionItem
                        key={category}
                        value={category}
                        className='border rounded-xl mb-4 bg-gray-100 text-gray-600'
                      >
                        <AccordionTrigger className='px-6 py-3'>
                          <div className='flex items-center text-xl'>
                            <span className='font-medium'>{category}</span>

                            <span className='ml-1 text-gray-400 text-base'>({problems.length})</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='px-6 py-3'>
                          <div className='rounded-xl border'>
                            <DataTable data={problems} columns={columns} onRowClick={handleRowClick} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}
