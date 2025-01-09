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
