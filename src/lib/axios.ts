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
  }
}

const axiosInstance = new AxiosClient().instance

export default axiosInstance
