import { BUG_CHECK_TYPE } from '@/utils/constants'

export interface ApiResponse<T> {
  detail: string
  data: T
}

export interface ErrorResponse {
  detail: string
}

export interface User {
  sub: string // id
  email: string
  email_verified: boolean
  family_name: boolean
  given_name: boolean
  name: string
  picture: string
}

export interface Problem {
  id: number
  name: string
  category: string
  lab_id: string
  is_active: boolean
  description?: string
  constrain?: string[]
  examples?: TestCase[]
}

export interface SubmissionRequest {
  problem_id: number
  source_code: string
}

export interface SubmissionResponse {
  source_code_id: number
  source_code: string
  user_id: string
  problem_id: number
  status: number
  score: number
  test_case_sample: TestCase[]
  message: string
}

export interface TestCase {
  input: string
  output: string
  testcode: boolean
  is_correct?: boolean
  expected_output?: string
}

export interface BuggyPosition {
  id: number
  position: number
  start_index: number
  original_token: string
  predicted_token: string
  line_number: number
  is_token_error: boolean
  is_suggestion_useful: boolean
}
export interface PredictionResponse {
  id: number
  model_id: number
  source_code_id: number
  buggy_position: BuggyPosition[]
}

export type BugCheckTypeValue = (typeof BUG_CHECK_TYPE)[keyof typeof BUG_CHECK_TYPE]
export interface BugCheckRequest {
  prediction_id: number
  position: number[]
  type: BugCheckTypeValue
}

export interface PredictionLS {
  predictionId: number // prediction id
  sourceCode: string
  buggyPositions: BuggyPosition[] // buggyPosition.id
}
