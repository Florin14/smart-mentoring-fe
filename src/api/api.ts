import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const hostName = 'localhost'
const port = 3000

/**
 * Recursively converts snake_case keys to camelCase.
 * Handles objects, arrays, and nested structures from FastAPI responses.
 */
const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

const convertKeysToCamelCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(convertKeysToCamelCase)
  }
  if (data !== null && typeof data === 'object' && !(data instanceof File) && !(data instanceof Blob)) {
    return Object.keys(data).reduce((acc: Record<string, any>, key: string) => {
      const camelKey = snakeToCamel(key)
      acc[camelKey] = convertKeysToCamelCase(data[key])
      return acc
    }, {})
  }
  return data
}

/**
 * Recursively converts camelCase keys to snake_case for FastAPI requests.
 */
const camelToSnake = (str: string): string =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

const convertKeysToSnakeCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(convertKeysToSnakeCase)
  }
  if (data !== null && typeof data === 'object' && !(data instanceof File) && !(data instanceof Blob) && !(data instanceof FormData)) {
    return Object.keys(data).reduce((acc: Record<string, any>, key: string) => {
      const snakeKey = camelToSnake(key)
      acc[snakeKey] = convertKeysToSnakeCase(data[key])
      return acc
    }, {})
  }
  return data
}

export const axiosInstance = axios.create({
  baseURL: `http://${hostName}:${port}/api/`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor: add JWT token + convert request body keys to snake_case
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('jwtToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Convert request body to snake_case (skip FormData for file uploads)
  if (config.data && !(config.data instanceof FormData)) {
    config.data = convertKeysToSnakeCase(config.data)
  }

  return config
})

// Response interceptor: convert response body keys to camelCase
axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  if (response.data) {
    response.data = convertKeysToCamelCase(response.data)
  }
  return response
})
