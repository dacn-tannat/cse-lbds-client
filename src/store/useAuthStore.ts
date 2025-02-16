import { User } from '@/types'
import { create } from 'zustand'

interface AuthState {
  isAuth: boolean
  user: User | null
  setIsAuth: (isAuth: boolean) => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  user: null,
  setIsAuth: (isAuth) => set({ isAuth }),
  setUser: (user) => set({ user })
}))
