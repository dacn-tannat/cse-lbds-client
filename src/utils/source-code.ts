import { BuggyPosition } from '@/types'

export const highlightBugs = (code: string, bugs: BuggyPosition[]) => {
  let highlightedCode = ''
  let lastIndex = 0

  bugs.forEach(({ start_index, original_token }) => {
    highlightedCode +=
      escapeHtml(code.slice(lastIndex, start_index)) + // Add normal code
      `<span class='bg-red-200 rounded'>${original_token}</span>` // Highlight bug
    lastIndex = start_index + original_token.length
  })

  highlightedCode += escapeHtml(code.slice(lastIndex)) // Add remaining text
  return highlightedCode
    .split('\n')
    .map(
      (line, lineNumber) =>
        `<span class='select-none text-gray-400 mr-4'>${(lineNumber + 1).toString().padStart(2, ' ')}</span>${line}`
    )
    .join('\n')
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const normalizedText = (text: string) => {
  return /(\r\n|\r|\n|\v|\f|\u0085|\u2028|\u2029)$/.test(text) ? text.slice(0, -1) + '↵' : text
}
