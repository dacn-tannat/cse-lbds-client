import axiosInstance from '@/lib/axios'
// import { Problem } from '@/types'

/* 
Problem
*/

export const getProblems = () => {
  return axiosInstance.get('/api/v1/problems')
}

export const getProblemById = (id: string) => {
  return axiosInstance.get(`/api/v1/problems/${id}`)
}

/*
Prediction
*/
