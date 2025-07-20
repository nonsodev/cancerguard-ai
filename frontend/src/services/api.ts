import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

// Debug logging for development
if ((import.meta as any).env?.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL)
}

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  register: async (userData: {
    email: string
    username: string
    password: string
    full_name?: string
  }) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
}

// User API
export const userAPI = {
  getMe: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
  
  updateMe: async (userData: { full_name?: string }) => {
    const response = await api.put('/users/me', userData)
    return response.data
  },
}

// Prediction API
export const predictionAPI = {
  uploadAndPredict: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/predictions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  getHistory: async (skip = 0, limit = 100) => {
    const response = await api.get(`/predictions/history?skip=${skip}&limit=${limit}`)
    return response.data
  },
  
  getPrediction: async (id: number) => {
    const response = await api.get(`/predictions/${id}`)
    return response.data
  },
}

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard')
    return response.data
  },
  
  getUserStats: async () => {
    const response = await api.get('/analytics/user-stats')
    return response.data
  },
}