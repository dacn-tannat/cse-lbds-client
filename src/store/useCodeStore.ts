import { create } from 'zustand'

interface CodeState {
  codes: Record<number, string> // { problem_id: "..." }
  setCode: (problemId: number, code: string) => void
  getCode: (problemId: number) => string
  saveToSessionStorage: () => void
}

const useCodeStore = create<CodeState>((set, get) => ({
  codes: JSON.parse(sessionStorage.getItem('student_code') || '{}'),

  setCode: (problemId, code) => {
    const updatedCodes = { ...get().codes, [problemId]: code }
    sessionStorage.setItem('student_code', JSON.stringify(updatedCodes))
    set({ codes: updatedCodes })
  },

  getCode: (problemId) => get().codes[problemId] || '',

  saveToSessionStorage: () => {
    sessionStorage.setItem('student_code', JSON.stringify(get().codes))
  }
}))

export default useCodeStore
