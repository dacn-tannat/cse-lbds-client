export interface Problem {
  id: number
  name: string
  category: string
  description: string
  examples: {
    id: number
    input: string
    output: string
    explanation: string
  }[]
  image: null
  constraints: string[]
}

export interface SubmissionResponse {
  source_code_id: number
  source_code: string
  user_id: number
  problem_id: number
  status: number
  score: number
  test_case_sample: {
    input: string
    output: string
    is_correct: boolean
  }[]
  message: string
}

export interface Submission {
  problem_id: number
  source_code: string
}

export interface User {
  email: string
  email_verified: boolean
  family_name: boolean
  given_name: boolean
  name: string
  picture: string
  sub: string // id
}
