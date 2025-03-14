import { PredictionLS, User } from '@/types'

/**
 * Access token
 */
export const saveAccessTokenToLS = (access_token: string): void => {
  localStorage.setItem('access_token', access_token)
}

export const clearAccessTokenFromLS = (): void => {
  localStorage.removeItem('access_token')
}

export const getAccessTokenFromLS = (): string => {
  return localStorage.getItem('access_token') || ''
}

/**
 * User
 */

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

/**
 * Prediction
 */
export const savePredictionToLS = (prediction: PredictionLS): void => {
  localStorage.setItem('prediction', JSON.stringify(prediction))
}

export const getPredictionFromLS = (): PredictionLS | null => {
  const prediction = localStorage.getItem('prediction')
  return prediction ? JSON.parse(prediction) : null
}

export const clearPredictionFromLS = (): void => {
  localStorage.removeItem('prediction')
}

export const clearLS = (): void => {
  clearAccessTokenFromLS()
  clearUserFromLS()
  clearPredictionFromLS()
}
