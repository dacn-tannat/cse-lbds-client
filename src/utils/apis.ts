import axiosInstance from '@/lib/axios'
import { Submission } from '@/types'

/* Auth */

export const loginWithGoogle = (code: string) => {
  return axiosInstance.post('/api/v1/auth/login/google', { code })
}

/* Problem */

export const getProblems = () => {
  return axiosInstance.get('/api/v1/problems')
}

export const getProblemById = (id: string) => {
  return axiosInstance.get(`/api/v1/problems/${id}`)
}

/* Submit Code */

export const submitCode = (data: Submission) => {
  return axiosInstance.post('/api/v1/source-code/submit', data)
}
