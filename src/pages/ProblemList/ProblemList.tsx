import { useNavigate } from 'react-router-dom'

import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { problems } from '@/mockData/problems'
import { Problem } from '@/types'
import { generateSlug } from '@/utils/helper'
import { getProblems } from '@/utils/apis'
import { useQuery } from '@tanstack/react-query'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { generateSlug } from '@/utils/slug'
// import { getProblems } from '@/utils/apis'
// import { useQuery } from '@tanstack/react-query'

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
  // const { data } = useQuery({
  //   queryKey: ['problems'],
  //   queryFn: getProblems
  // })

  // console.log(data)

  const navigate = useNavigate()

  const handleRowClick = (problem: Problem) => {
    const slug = generateSlug(problem.name)
    navigate(`/problems/${slug}`)
  }

  return (
    <div className='bg-gray-50'>
      <div className='max-w-7xl mx-auto p-8 min-h-screen'>
        <div className='text-4xl font-bold mb-8 text-center'>Kỹ thuật lập trình</div>
        <Accordion type="multiple" className="w-full space-y-3">
        {/* Accordion Item 1 */}
        <AccordionItem value="item-1">
          <AccordionTrigger className='w-full text-lg font-semibold bg-gray-200 px-6 py-3 rounded-xl shadow-sm transition-all hover:bg-blue-300 active:bg-blue-400 flex justify-between items-center'>
            Lab 1
            <ChevronDown />
          </AccordionTrigger>
          <AccordionContent>
          <DataTable columns={columns} data={problems} onRowClick={handleRowClick} />
          </AccordionContent>
        </AccordionItem>

        {/* Accordion Item 2 */}
        <AccordionItem value="item-2">
          <AccordionTrigger className='w-full text-lg font-semibold bg-gray-200 px-6 py-3 rounded-xl shadow-sm transition-all hover:bg-blue-300 active:bg-blue-400 flex justify-between items-center'>
            Lab 2
            <ChevronDown />
          </AccordionTrigger>
          <AccordionContent>
          <DataTable columns={columns} data={problems} onRowClick={handleRowClick} />
          </AccordionContent>
        </AccordionItem>

        {/* Accordion Item 3 */}
        <AccordionItem value="item-3">
          <AccordionTrigger className='w-full text-lg font-semibold bg-gray-200 px-6 py-3 rounded-xl shadow-sm transition-all hover:bg-blue-300 active:bg-blue-400 flex justify-between items-center'>
            Lab 3
            <ChevronDown />
          </AccordionTrigger>
          <AccordionContent>
          <DataTable columns={columns} data={problems} onRowClick={handleRowClick} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </div>
    </div>
  )
}
