import { useParams } from 'react-router-dom'

import { problems } from '@/mockData/problems'
import ProblemInformation from './components/ProblemInformation'
import CodeEditor from './components/CodeEditor'
import { generateSlug } from '@/utils/slug'

export default function ProblemDetail() {
  /* Problem */
  const { slug } = useParams()
  // temporary mock data --> fetch problem from db by id
  const problem = problems.find((p) => generateSlug(p.name) === slug)

  if (problem) {
    return (
      <div className='bg-gray-50'>
        <div className='max-w-7xl min-h-screen mx-auto p-8'>
          <ProblemInformation problem={problem} />
          <CodeEditor problem_id={problem.id} />
        </div>
      </div>
    )
  }
}
