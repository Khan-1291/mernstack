import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true })
        // Set default auth header for axios
        if (token) {
          import('../services/api').then(module => {
            module.default.defaults.headers.common['Authorization'] = `Bearer ${token}`
          })
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        import('../services/api').then(module => {
          delete module.default.defaults.headers.common['Authorization']
        })
      },
      
      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates }
        }))
      },
      
      addXP: (amount) => {
        set((state) => ({
          user: {
            ...state.user,
            experiencePoints: (state.user?.experiencePoints || 0) + amount
          }
        }))
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
)