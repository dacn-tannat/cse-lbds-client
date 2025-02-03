import { useParams } from 'react-router-dom'

import { problems } from '@/mockData/problems'
import ProblemInformation from './components/ProblemInformation'
import CodeEditor from './components/CodeEditor'

export default function ProblemDetail() {
  /* Problem */
  const { id } = useParams()
  // temporary mock data --> fetch problem from db by id
  const problem = problems.find((p) => p.id === parseInt(id!))

  if (problem) {
    return (
      <div className='bg-gray-50 min-h-screen'>
        <div className='container mx-auto p-10 max-w-7xl'>
          <ProblemInformation problem={problem} />
          <CodeEditor problem_id={problem.id} />
        </div>
      </div>
    )
  }
}
