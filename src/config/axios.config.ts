import { envConfig } from '@/config/env.config'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { AccountResponse, ErrorResponse } from '@/types'
import { logout } from '@/utils/auth'
import {
  getAccessTokenFromLS,
  saveAccessTokenToLS,
  saveRemainingEmptyFeedbackSubmits,
  saveUserToLS
} from '@/utils/local-storage'
import axios, { AxiosInstance, isAxiosError } from 'axios'

class AxiosClient {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.instance = axios.create({
      baseURL: envConfig.API_URL,
      timeout: 10 * 60 * 1000, // 10 mins
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.accessToken = getAccessTokenFromLS()

    /**
     * request interceptor
     */
    this.instance.interceptors.request.use(
      (config) => {
        // Attach access token into request header before sending
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error)
      }
    )
    /**
     * response interceptor
     */
    this.instance.interceptors.response.use(
      (response) => {
        if (response.config.url === '/api/v1/auth/login/google') {
          const { access_token, user } = (response.data.data as AccountResponse) ?? {}
          this.accessToken = access_token
          saveAccessTokenToLS(access_token)
          saveUserToLS(user)
          if (user.first_time_login) {
            saveRemainingEmptyFeedbackSubmits(2)
          }
          useAuthStore.setState({ isAuth: true, user: response.data.data.user })
        }
        return response
      },
      (error) => {
        if (error.response.status === 403) {
          if (isAxiosError<ErrorResponse>(error)) {
            this.accessToken = ''
            logout()
            toast({
              variant: 'destructive',
              title: 'Error',
              description: error?.response?.data.detail || 'You do not have permission to access to the system'
            })
          }
        }
        // Invalid/Expired access token
        if (error.response.status === 401) {
          this.accessToken = ''
          logout()
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Your session has expired. Please log in again'
          })
        }
      }
    )
  }
}

const axiosInstance = new AxiosClient().instance

export default axiosInstance
