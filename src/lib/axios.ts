// import axios from 'axios'
// import { useAuthStore } from '@/stores/auth'
// import router from '@/router'

// const userApi = axios.create({
//   baseURL: "140.99.130.143/api/v1", // change this
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Attach token on every request
// userApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return config
// })

// // Auto logout on 401
// userApi.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response?.status === 401) {
//       const auth = useAuthStore()

//       auth.logout()
//       router.replace('/')
//     }

//     return Promise.reject(error)
//   }
// )

// export default userApi
