export const FONT_SIZE = {
  DEFAULT: 16,
  MIN: 12,
  MAX: 24,
  STEP: 1
} as const

export const EDITOR_THEME = {
  LIGHT: 'LIGHT',
  DARK: 'DARK'
} as const

export const STATUS_TITLE_MAPPING: Record<number, string> = {
  0: 'Compile error',
  1: 'Wrong answer',
  2: 'Time limit',
  4: 'Accepted',
  6: 'Output limit',
  7: 'Runtime error',
  8: 'Presentation error'
} as const

export const BUG_CHECK_TYPE = {
  TOKEN_ERROR: 'TOKEN_ERROR',
  SUGGESTION_USEFUL: 'SUGGESTION_USEFUL'
} as const

export const SUBMISSION_MESSAGE = {
  ACCEPTED_RESPONSE: 'Accepted',
  PARTLY_CORRECT: 'Your code failed one or more hidden tests',
  CORRECT: 'Passed all tests'
}
