import { lazy, Suspense, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'

import ProblemInformation from './components/ProblemInformation'
import CodeEditor from './components/CodeEditor'
import { predict, getProblemById } from '@/utils/apis'
import { getIdFromSlug } from '@/utils/slug'
import { useProblemDetailStore } from '@/store/useProblemDetailStore'
import { toast } from '@/hooks/use-toast'
import { SUBMISSION_MESSAGE } from '@/utils/constants'
import { savePredictionToLS } from '@/utils/local-storage'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'
import NotFound from '../NotFound'

const TestCaseTable = lazy(() => import('./components/TestCaseTable'))
const ErrorMessage = lazy(() => import('./components/ErrorMessage'))
const PredictionResult = lazy(() => import('./components/PredictionResult'))

export default function ProblemDetail() {
  const { slug } = useParams()
  const id = getIdFromSlug(slug as string)

  // Problem Detail Store
  const submission = useProblemDetailStore((state) => state.submission)
  const prediction = useProblemDetailStore((state) => state.prediction)
  const setPrediction = useProblemDetailStore((state) => state.setPrediction)
  const setIsPredicting = useProblemDetailStore((state) => state.setIsPredicting)
  const resetState = useProblemDetailStore((state) => state.resetState)
  const isPredicting = useProblemDetailStore((state) => state.isPredicting)

  const { data: problemData, isError } = useQuery({
    queryKey: ['problems', id],
    queryFn: ({ queryKey }) => getProblemById(queryKey[1]),
    enabled: Boolean(id),
    staleTime: Infinity
  })

  const problem = problemData?.data.data

  const predictMutation = useMutation({
    mutationFn: predict,
    onSuccess: (response) => {
      setIsPredicting(false)
      setPrediction(response.data.data)
      // save prediction into local storage
      savePredictionToLS({
        predictionId: response.data.data!.id,
        sourceCode: submission!.source_code,
        buggyPositions: response.data.data!.buggy_position
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'An error occurred while predicting. Please try again',
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

  if (isError) return <NotFound />

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
                <Suspense>
                  <ErrorMessage message={submission.message} status={submission.status} />
                </Suspense>
              ) : (
                <Suspense>
                  <TestCaseTable
                    score={submission.score}
                    status={submission.status}
                    testcases={submission.test_case_sample}
                  />
                </Suspense>
              ))}
            {isPredicting && (
              <div>
                <div className='flex gap-2 my-4 text-gray-600 items-center justify-center'>
                  <Loader2 className='animate-spin size-6' />
                  <div className='text-lg italic font-semibold'>Loading prediction...</div>
                </div>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                  <Skeleton className='col-span-1 h-[200px] bg-gray-200 rounded-xl' />
                  <Skeleton className='col-span-1 h-[200px] bg-gray-200 rounded-xl' />
                </div>
              </div>
            )}
            {prediction && (
              <Suspense>
                <PredictionResult buggyPositions={prediction.buggy_position} source_code={submission?.source_code!} />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
