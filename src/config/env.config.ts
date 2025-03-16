export const envConfig = {
  API_URL:
    import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PRODUCTION : import.meta.env.VITE_API_URL,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_GOOGLE_REDIRECT_URI_PRODUCTION
      : import.meta.env.VITE_GOOGLE_REDIRECT_URI
}
