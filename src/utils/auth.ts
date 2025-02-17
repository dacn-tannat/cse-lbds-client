import { User } from '@/types'

/* OAuth Login Google */
export const generateGoogleAuthUrl = (): string => {
  const query = {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    ),
    prompt: 'consent'
  }
  return `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams(query).toString()}`
}

/* Local Storage */
export const saveAccessTokenToLS = (access_token: string): void => {
  localStorage.setItem('access_token', access_token)
}

export const clearAccessTokenFromLS = (): void => {
  localStorage.removeItem('access_token')
}

export const getAccessTokenFromLS = (): string => {
  return localStorage.getItem('access_token') || ''
}

export const saveUserToLS = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const getUserFromLS = (): User | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const clearUserFromLS = (): void => {
  localStorage.removeItem('user')
}
