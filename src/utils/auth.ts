import { useAuthStore } from '@/store/useAuthStore'
import { clearLS } from './local-storage'
import { envConfig } from '@/config/env.config'
import { LOGOUT_EVENT } from './constants'

export const LogoutEventTarget = new EventTarget()

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
  // Clear Local Storage
  clearLS()
  // Clear Session Storage
  sessionStorage.removeItem('student_code')
  // Clear Store
  useAuthStore.setState({ isAuth: false, user: null })
  // Dispatch Logout Event for App
  LogoutEventTarget.dispatchEvent(new Event(LOGOUT_EVENT))
}
