import { useNavigate } from 'react-router-dom'

import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { problems } from '@/mockData/problems'
import { Problem } from '@/types'
import { generateSlug } from '@/utils/slug'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
  const accordionClassname =
    'w-full text-lg font-medium bg-gray-100 px-4 py-2 rounded-xl border-[2px] hover:bg-gray-300 hover:no-underline'
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
        <Accordion type='multiple' className='w-full space-y-3'>
          {/* Accordion Item 1 */}
          <AccordionItem value='item-1'>
            <AccordionTrigger className={accordionClassname}>Lab 1: String, Array, Function, File I/O</AccordionTrigger>
            <AccordionContent>
              <DataTable columns={columns} data={problems} onRowClick={handleRowClick} />
            </AccordionContent>
          </AccordionItem>

          {/* Accordion Item 2 */}
          <AccordionItem value='item-2'>
            <AccordionTrigger className={accordionClassname}>Lab 2: Recursion, Pointer, Struct</AccordionTrigger>
            <AccordionContent>
              <DataTable columns={columns} data={problems} onRowClick={handleRowClick} />
            </AccordionContent>
          </AccordionItem>

          {/* Accordion Item 3 */}
          <AccordionItem value='item-3'>
            <AccordionTrigger className={accordionClassname}>Lab 3: Linked List, OOP</AccordionTrigger>
            <AccordionContent>
              <DataTable columns={columns} data={problems} onRowClick={handleRowClick} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
