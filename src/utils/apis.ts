import axiosInstance from '@/lib/axios'
import { ApiResponse, Problem, SubmissionPayload, SubmissionResponse, User } from '@/types'

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

/**
 * Source code
 */

export const submitCode = (payload: SubmissionPayload) => {
  return axiosInstance.post<ApiResponse<SubmissionResponse>>('/api/v1/source-code/submit', payload)
}
