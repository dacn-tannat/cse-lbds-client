import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'

import ProblemInformation from './components/ProblemInformation'
import CodeEditor from './components/CodeEditor'
import { getPredictions, getProblemById } from '@/utils/apis'
import { getIdFromSlug } from '@/utils/slug'
import { useProblemDetailStore } from '@/store/useProblemDetailStore'
import ErrorMessage from './components/ErrorMessage'
import TestCaseTable from './components/TestCaseTable'
import { toast } from '@/hooks/use-toast'
import { useEffect } from 'react'
import { SUBMISSION_MESSAGE } from '@/utils/constants'
import PredictionResult from './components/PredictionResult/PredictionResult'

export default function ProblemDetail() {
  const { slug } = useParams()
  const id = getIdFromSlug(slug as string)

  // Problem Detail Store
  const submission = useProblemDetailStore((state) => state.submission)
  const prediction = useProblemDetailStore((state) => state.prediction)
  const setPrediction = useProblemDetailStore((state) => state.setPrediction)
  const setIsPredicting = useProblemDetailStore((state) => state.setIsPredicting)
  const resetState = useProblemDetailStore((state) => state.resetState)

  const { data: problemData } = useQuery({
    queryKey: ['problems', id],
    queryFn: ({ queryKey }) => getProblemById(queryKey[1]),
    enabled: Boolean(id),
    staleTime: Infinity
  })

  const problem = problemData?.data.data

  const predictMutation = useMutation({
    mutationFn: getPredictions,
    onSuccess: (response) => {
      setIsPredicting(false)
      setPrediction(response.data.data)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra trong quá trình dự đoán',
        description: error.message
      })
      setIsPredicting(false)
      setPrediction(undefined)
    }
  })

  // get prediction in case submission status === 1
  useEffect(() => {
    if (submission && submission.source_code_id && submission.status === 1) {
      setPrediction(undefined)
      setIsPredicting(true)
      predictMutation.mutate(submission?.source_code_id)
    }
  }, [submission?.source_code_id])

  // reset state when exit page
  useEffect(() => {
    return () => {
      resetState()
    }
  }, [resetState])

  return (
    <div className='bg-gray-50'>
      <div className='max-w-7xl min-h-screen mx-auto p-8'>
        {problem && (
          <div>
            <div className='text-2xl font-bold mb-6'>{`[${problem.lab_id}_${problem.category}] ${problem.name}`}</div>
            <ProblemInformation problem={problem} />
            <CodeEditor problem_id={problem.id} />
            {submission &&
              (submission.message !== SUBMISSION_MESSAGE.ACCEPTED_RESPONSE ? (
                <ErrorMessage message={submission.message} status={submission.status} />
              ) : (
                <TestCaseTable
                  score={submission.score}
                  status={submission.status}
                  testcases={submission.test_case_sample}
                />
              ))}
            {prediction && (
              <PredictionResult buggyPositions={prediction.buggy_position} source_code={submission?.source_code!} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
