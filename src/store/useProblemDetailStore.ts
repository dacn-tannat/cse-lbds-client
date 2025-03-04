import { PredictionResponse, SubmissionResponse } from '@/types'
import { create } from 'zustand'

interface ProblemDetailState {
  isSubmitting: boolean
  isPredicting: boolean
  submission: SubmissionResponse | undefined
  prediction: PredictionResponse | undefined

  setIsSubmitting: (isSubmitting: boolean) => void
  setIsPredicting: (isPredicting: boolean) => void
  setSubmission: (submission: SubmissionResponse | undefined) => void
  setPrediction: (prediction: PredictionResponse | undefined) => void

  resetState: () => void
}

export const useProblemDetailStore = create<ProblemDetailState>((set) => ({
  isSubmitting: false,
  isPredicting: false,
  submission: undefined,
  prediction: undefined,

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsPredicting: (isPredicting) => set({ isPredicting }),
  setSubmission: (submission) => set({ submission }),
  setPrediction: (prediction) => set({ prediction }),
  resetState: () =>
    set({
      isSubmitting: false,
      isPredicting: false,
      submission: undefined,
      prediction: undefined
    })
}))
