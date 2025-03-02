import axiosInstance from '@/utils/axios'
import {
  ApiResponse,
  BugCheckPayload,
  BuggyPosition,
  PredictionResponse,
  Problem,
  SubmissionPayload,
  SubmissionResponse,
  User
} from '@/types'

/**
 * Auth
 */

export const loginWithGoogle = (code: string) => {
  return axiosInstance.post<ApiResponse<{ user: User; access_token: string }>>('/api/v1/auth/login/google', {
    code
  })
}

/**
 * Problem
 */

export const getActiveProblems = () => {
  return axiosInstance.get<ApiResponse<Problem[]>>('/api/v1/problems/active')
}

export const getProblemById = (id: string) => {
  return axiosInstance.get(`/api/v1/problems/${id}`)
}

/* Submit Code */

export const submitCode = (payload: SubmissionPayload) => {
  return axiosInstance.post<ApiResponse<SubmissionResponse>>('/api/v1/source-code/submit', payload)
}

export const getPredictions = (source_code_id: number) => {
  return axiosInstance.post<ApiResponse<PredictionResponse>>(`/api/v1/prediction/${source_code_id}`)
}

export const submitBugCheck = (payload: BugCheckPayload) => {
  return axiosInstance.put<ApiResponse<BuggyPosition[]>>('/api/v1/prediction/bug-check', payload)
}
