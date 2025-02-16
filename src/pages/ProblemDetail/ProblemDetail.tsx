import { useParams } from 'react-router-dom'

import { problems } from '@/mockData/problems'
import ProblemInformation from './components/ProblemInformation'
import CodeEditor from './components/CodeEditor'
import { generateSlug } from '@/utils/slug'
import { useState } from 'react'
import { SubmissionResponse } from '@/types'
import ErrorMessage from './components/ErrorMessage'

export default function ProblemDetail() {
  /* Problem */
  const { slug } = useParams()
  // temporary mock data --> fetch problem from db by id
  const problem = problems.find((p) => generateSlug(p.name) === slug)

  const [response, setResponse] = useState<SubmissionResponse | null>(null)
  console.log(response)

  if (problem) {
    return (
      
      <div className='bg-gray-50'>
        {/* {response && <div>{JSON.stringify(response)}</div>} */}
        <div className='max-w-7xl min-h-screen mx-auto p-8'>
          <ProblemInformation problem={problem} />
          <CodeEditor problem_id={problem.id} setResponse={setResponse} />
          {response && response.message !== 'Accepted' && <ErrorMessage message={response.message} status={response.status} />}
          
        </div>
      </div>
    )
  }
}
