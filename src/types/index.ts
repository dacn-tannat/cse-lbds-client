export interface ApiResponse<T> {
  detail: string
  data?: T
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
  lab_id: number
  is_active: boolean
  description?: string
  constrain?: string[]
  examples?: TestCase[]
}

export interface SubmissionPayload {
  problem_id: number
  source_code: string
}

export interface SubmissionResponse {
  source_code_id: number
  source_code: string
  user_id: number
  problem_id: number
  status: number
  score: number
  test_case_sample: TestCase[]
  message: string
}

export interface TestCase {
  input: string
  output: string
  is_correct?: boolean
}

export interface PredictionPayload {
  source_code_id: number
}

export interface BuggyPosition {
  id: number
  position: number
  start_index: number
  original_token: string
  predicted_token: string
  is_used: boolean
}
export interface PredictionResponse {
  id: number
  model_id: number
  source_code_id: number
  buggy_position: BuggyPosition[]
}

export interface BugCheckPayload {
  prediction_id: number
  position: number[]
}