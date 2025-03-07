import { useAuthStore } from '@/store/useAuthStore'
import { clearAccessTokenFromLS, clearUserFromLS } from './local-storage'
import { envConfig } from '@/config/env.config'

/**
 * Google OAuth Login
 */
export const generateGoogleAuthUrl = (): string => {
  const query = {
    client_id: envConfig.GOOGLE_CLIENT_ID,
    redirect_uri: envConfig.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    ),
    prompt: 'consent'
  }
  return `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams(query).toString()}`
}

/**
 * Logout
 */
export const logout = () => {
  clearAccessTokenFromLS()
  clearUserFromLS()
  useAuthStore.setState({ isAuth: false, user: null })
}
