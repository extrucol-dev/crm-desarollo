import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // ← envía la cookie automáticamente
})

// Request — adjunta access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response — intercepta 401 y renueva automáticamente
let isRefreshing = false
let failedQueue  = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  )
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config

    if (error.response?.status === 401  && !original._retry) {
      original._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      isRefreshing = true

      try {
        // Cookie va automática — no hay que enviar nada en el body
        const { data } = await axios.post(
          'http://localhost:8080/api/auth/refresh',
          {},
          { withCredentials: true }
        )

        const newToken = data.token
        localStorage.setItem('token', newToken)
        processQueue(null, newToken)

        original.headers.Authorization = `Bearer ${newToken}`
        return api(original) // reintenta la petición original

      } catch {
        processQueue(null, null)
        localStorage.clear()
        window.location.href = '/login'

      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api