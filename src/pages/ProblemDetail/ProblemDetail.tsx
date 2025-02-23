import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'

import { problems } from '@/mockData/problems'
import ProblemInformation from './components/ProblemInformation'
import CodeEditor from './components/CodeEditor'
import { generateSlug } from '@/utils/slug'
import { SubmissionResponse } from '@/types'
import ErrorMessage from './components/ErrorMessage'
import { getActiveProblems, getPredictions } from '@/utils/apis'
import TestCaseTable from './components/TestCaseTable'
import Prediction from './components/Prediction'


export default function ProblemDetail() {

  const { data } = useQuery({
    queryKey: ['problems'],
    queryFn: getActiveProblems
  })
  console.log('problems: ', data)

  const { slug } = useParams()
  // temporary mock data --> fetch problem from db by id
  const problem = problems.find((p) => generateSlug(p.name) === slug)

  const [response, setResponse] = useState<SubmissionResponse | null>(null)
  const editorContentRef = useRef<string>('')

  // useMutation for making POST request to get predictions
  const { mutate, data: predictions, isPending } = useMutation({
    mutationFn: (source_code_id: number) => getPredictions(source_code_id),
    onError: (error) => console.error('Prediction error:', error),
  })

  // Trigger mutation when response is valid
  useEffect(() => {
    if (response && response.message === 'Accepted' && response.status !== 4) {
      mutate(response.source_code_id)
    }
  }, [response, mutate])

  if (problem) {
    return (
      
      <div className='bg-gray-50'>
        {/* {response && <div>{JSON.stringify(response)}</div>} */}
        <div className='max-w-7xl min-h-screen mx-auto p-8'>
          <ProblemInformation problem={problem} />
          <CodeEditor problem_id={problem.id} setResponse={setResponse} editorContentRef={editorContentRef}/>
          {response && response.message !== 'Accepted' && (
            <ErrorMessage message={response.message} status={response.status} />
          )}
          {response && response.message === 'Accepted' && (
            <TestCaseTable source_code_id={response.source_code_id} testcase={response.test_case_sample} score={response.score} status={response.status}/>
          )}
          {response && response.message === 'Accepted' && response.status !== 4 && 
          <> {isPending ? ( <p>Loading predictions...</p>) : (predictions && <Prediction predictions={predictions.data} source_code={editorContentRef.current} />)}</>
          }
          </div>
      </div>
    )
  }
}
