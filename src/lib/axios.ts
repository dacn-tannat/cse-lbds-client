import { getAccessTokenFromLS } from '@/utils/auth'
import axios, { AxiosInstance } from 'axios'

class AxiosClient {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000, // 10s
      headers: {
        'Content-Type': 'application/json'
      }
    })
    /* initialize access_token */
    /* request interceptors */
    this.instance.interceptors.request.use(
      (config) => {
        const access_token = getAccessTokenFromLS()
        // Attach access_token into request header before sending
        if (Boolean(access_token) && config.headers) {
          config.headers.Authorization = `Bearer ${access_token}`
        }
        return config
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error)
      }
    )
    /* response interceptors */
    /*
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        // Login: save access_token into local storage
        if (url === '/api/v1/auth/login/google') {
          this.access_token = response.data.access_token
          saveAccessTokenToLS(this.access_token)
        }
        // Logout: clear access_token from local storage
        else if (url === '/api/v1/auth/logout') {
          this.access_token = ''
          clearAccessTokenFromLS()
        }
        return response
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
      }
    )
    */
  }
}

const axiosInstance = new AxiosClient().instance

export default axiosInstance
