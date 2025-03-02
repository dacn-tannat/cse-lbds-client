import { useAuthStore } from '@/store/useAuthStore'
import { User } from '@/types'
import { getAccessTokenFromLS, getUserFromLS, saveAccessTokenToLS, saveUserToLS, logout } from '@/utils/auth'
import axios, { AxiosInstance } from 'axios'

class AxiosClient {
  instance: AxiosInstance
  private accessToken: string
  private user: User | null

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 5000, // 5s
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.accessToken = getAccessTokenFromLS()
    this.user = getUserFromLS()

    /**
     * request interceptor
     */
    this.instance.interceptors.request.use(
      (config) => {
        console.log('this.access token = ', this.accessToken)
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
          this.user = user
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
          this.user = null
          logout()
          location.href = '/?reason=login_required'
        }
        return Promise.reject(error)
      }
    )
  }
}

const axiosInstance = new AxiosClient().instance

export default axiosInstance
