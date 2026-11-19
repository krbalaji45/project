import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosInstance.interceptors.request.use((config) => {
  if (!import.meta.env.VITE_API_BASE_URL) {
    return Promise.reject(new Error('Set VITE_API_BASE_URL in adminsite/.env.local to connect to the backend.'))
  }

  return config
})

export default axiosInstance
