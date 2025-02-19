import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { problems } from '@/mockData/problems'
import ProblemInformation from './components/ProblemInformation'
import CodeEditor from './components/CodeEditor'
import { generateSlug } from '@/utils/slug'
import { SubmissionResponse } from '@/types'
import ErrorMessage from './components/ErrorMessage'
import { getActiveProblems } from '@/utils/apis'

export default function ProblemDetail() {
  const { data } = useQuery({
    queryKey: ['problems'],
    queryFn: getActiveProblems
  })
  console.log('problems: ', data)

  const { slug } = useParams()
  // temporary using mock data --> fetch problem from db by id
  const problem = problems.find((p) => generateSlug(p.name) === slug)
  const [response, setResponse] = useState<SubmissionResponse | null>(null)

  if (problem) {
    return (
      <div className='bg-gray-50'>
        {/* {response && <div>{JSON.stringify(response)}</div>} */}
        <div className='max-w-7xl min-h-screen mx-auto p-8'>
          <ProblemInformation problem={problem} />
          <CodeEditor problem_id={problem.id} setResponse={setResponse} />
          {response && response.message !== 'Accepted' && (
            <ErrorMessage message={response.message} status={response.status} />
          )}
        </div>
      </div>
    )
  }
}
