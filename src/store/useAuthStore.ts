import { User } from '@/types'
import { getAccessTokenFromLS, getUserFromLS } from '@/utils/local-storage'
import { create } from 'zustand'

interface AuthState {
  isAuth: boolean
  user: User | null
}

export const useAuthStore = create<AuthState>(() => ({
  isAuth: Boolean(getAccessTokenFromLS()),
  user: getUserFromLS()
}))
