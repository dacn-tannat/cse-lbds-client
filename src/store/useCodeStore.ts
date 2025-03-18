import { create } from 'zustand'

interface CodeState {
  codes: Record<number, string> // { problem_id: "..." }
  setCodes: (problemId: number, code: string) => void
  getProblemCode: (problemId: number) => string
  saveCodes: () => void
}

const useCodeStore = create<CodeState>((set, get) => ({
  codes: JSON.parse(sessionStorage.getItem('student_code') || '{}'),

  setCodes: (problemId, code) => {
    const updatedCodes = { ...get().codes, [problemId]: code }
    sessionStorage.setItem('student_code', JSON.stringify(updatedCodes))
    set({ codes: updatedCodes })
  },

  getProblemCode: (problemId) => get().codes[problemId] || '',

  saveCodes: () => sessionStorage.setItem('student_code', JSON.stringify(get().codes))
}))

export default useCodeStore
