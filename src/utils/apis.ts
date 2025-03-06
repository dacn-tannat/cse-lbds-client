import axiosInstance from '@/config/axios.config'
import {
  ApiResponse,
  BugCheckRequest,
  BuggyPosition,
  PredictionResponse,
  Problem,
  SubmissionRequest,
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
  return axiosInstance.get<ApiResponse<Problem>>(`/api/v1/problems/${id}`)
}

/**
 * Submit
 */

export const submitCode = (payload: SubmissionRequest) => {
  return axiosInstance.post<ApiResponse<SubmissionResponse>>('/api/v1/source-code/submit', payload)
}

/**
 * Prediction
 */

export const predict = (source_code_id: number) => {
  return axiosInstance.post<ApiResponse<PredictionResponse>>(`/api/v1/prediction/${source_code_id}`)
}

/**
 * Bug check
 */

export const bugCheck = (payload: BugCheckRequest) => {
  return axiosInstance.put<ApiResponse<BuggyPosition[]>>('api/v1/prediction/bug-check', payload)
}
