import { User } from '@/types'
import { getAccessTokenFromLS, getUserFromLS } from '@/utils/auth'
import { create } from 'zustand'

interface AuthState {
  isAuth: boolean
  user: User | null
  setIsAuth: (isAuth: boolean) => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: Boolean(getAccessTokenFromLS()),
  user: getUserFromLS(),
  setIsAuth: (isAuth) => set({ isAuth }),
  setUser: (user) => set({ user })
}))
