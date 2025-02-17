export const FONT_SIZE = {
  DEFAULT: 16,
  MIN: 12,
  MAX: 24
} as const

export const STATUS_MAPPING: Record<number, string> = {
  0: 'Compile error',
  1: 'Wrong answer',
  2: 'Time limit',
  4: 'Accepted',
  6: 'Output limit',
  7: 'Runtime error',
  8: 'Presentation error'
} as const
