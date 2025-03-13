import { envConfig } from '@/config/env.config'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { logout } from '@/utils/auth'
import { getAccessTokenFromLS, saveAccessTokenToLS, saveUserToLS } from '@/utils/local-storage'
import axios, { AxiosInstance } from 'axios'

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
          const { access_token, user } = response.data.data ?? {}
          this.accessToken = access_token
          saveAccessTokenToLS(access_token)
          saveUserToLS(user)
          useAuthStore.setState({ isAuth: true, user: response.data.data.user })
        }
        return response
      },
      (error) => {
        // Invalid/Expired access token
        if (error.response.status === 401) {
          this.accessToken = ''
          logout()
          toast({
            variant: 'destructive',
            title: 'Thông báo',
            description: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại'
          })
        }
      }
    )
  }
}

const axiosInstance = new AxiosClient().instance

export default axiosInstance
