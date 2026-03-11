import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

export const useLogin = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  
  return useMutation(authAPI.login, {
    onSuccess: (response) => {
      const { user, token } = response.data
      setAuth(user, token)
      toast.success('Welcome back!')
      navigate('/dashboard')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  
  return useMutation(authAPI.register, {
    onSuccess: () => {
      toast.success('Registration successful! Please check your email.')
      navigate('/login')
    }
  })
}

export const useGetMe = () => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery('user', () => authAPI.getMe().then(res => res.data.user), {
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })
}