/* OAuth Login Google */
export const generateGoogleAuthUrl = () => {
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
export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearAccessTokenFromLS = () => {
  localStorage.removeItem('access_token')
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token') || ''
}
