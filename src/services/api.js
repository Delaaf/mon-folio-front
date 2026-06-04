/**
 * api.js — Axios instance centralisée pour MonFolio
 *
 * Fonctionnalités :
 * - Base URL configurable via VITE_API_URL
 * - Injection automatique du JWT Bearer token
 * - Refresh automatique du token expiré (401 TOKEN_EXPIRED)
 * - Queue des requêtes pendant le refresh (évite les appels parallèles)
 * - Redirection vers /login si le refresh échoue
 */

import axios from 'axios'

// ── Config ───────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// ── Token helpers ─────────────────────────────────────────────────
const TOKEN_KEY   = 'monfolio_token'
const REFRESH_KEY = 'monfolio_refreshing'

export const getToken   = ()      => localStorage.getItem(TOKEN_KEY)
export const setToken   = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = ()      => localStorage.removeItem(TOKEN_KEY)

// ── Request interceptor — inject Bearer ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {                        
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 & token refresh ────────────
let isRefreshing = false
let failedQueue  = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else       prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const code    = error.response?.data?.code
    const status  = error.response?.status

    // ── Token expired → try refresh ────────────────────────────
    if (status === 401 && code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await api.post('/auth/refresh')
        const newToken = data.data.token

        setToken(newToken)
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        originalRequest.headers.Authorization     = `Bearer ${newToken}`

        processQueue(null, newToken)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ── Token absent/invalid → redirect to login ───────────────
    if (status === 401 && ['TOKEN_INVALID', 'TOKEN_ABSENT', 'UNAUTHENTICATED'].includes(code)) {
      clearToken()
      if (window.location.pathname !== '/connexion') {
        window.location.href = '/connexion'
      }
    }

    return Promise.reject(error)
  }
)

export default api
