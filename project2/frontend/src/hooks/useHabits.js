import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { habitsAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

export const useHabits = () => {
  return useQuery('habits', () => habitsAPI.getAll().then(res => res.data.data), {
    staleTime: 2 * 60 * 1000
  })
}

export const useCreateHabit = () => {
  const queryClient = useQueryClient()
  
  return useMutation(habitsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('habits')
      queryClient.invalidateQueries('dashboard')
      toast.success('Habit created successfully!')
    }
  })
}

export const useCompleteHabit = () => {
  const queryClient = useQueryClient()
  const { addXP } = useAuthStore()
  
  return useMutation(
    ({ id, data }) => habitsAPI.complete(id, data),
    {
      onSuccess: (response) => {
        const { xpEarned, newAchievements } = response.data.data
        
        queryClient.invalidateQueries('habits')
        queryClient.invalidateQueries('dashboard')
        
        addXP(xpEarned)
        toast.success(`+${xpEarned} XP! Keep it up! 🔥`)
        
        // Show achievement notifications
        if (newAchievements?.length > 0) {
          newAchievements.forEach(achievement => {
            toast.success(
              `🏆 Achievement Unlocked: ${achievement.name}!`,
              { duration: 5000 }
            )
          })
        }
      }
    }
  )
}

export const useDeleteHabit = () => {
  const queryClient = useQueryClient()
  
  return useMutation(habitsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('habits')
      toast.success('Habit deleted')
    }
  })
}