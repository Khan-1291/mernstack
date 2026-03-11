import { useState } from 'react'
import { 
  Check, 
  Flame, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  TrendingUp,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { useCompleteHabit, useDeleteHabit } from '../../hooks/useHabits'
import { motion, AnimatePresence } from 'framer-motion'

const categoryColors = {
  health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  productivity: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  learning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  personal: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  finance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  creativity: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  custom: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}

const categoryIcons = {
  health: '💪',
  productivity: '⚡',
  learning: '📚',
  personal: '🌱',
  finance: '💰',
  creativity: '🎨',
  custom: '📌'
}

export const HabitCard = ({ habit }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const completeMutation = useCompleteHabit()
  const deleteMutation = useDeleteHabit()

  const handleComplete = () => {
    if (!habit.completedToday) {
      completeMutation.mutate({ id: habit._id, data: { mood: 'good' } })
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteMutation.mutate(habit._id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card relative overflow-hidden ${habit.completedToday ? 'border-green-500 dark:border-green-600' : ''}`}
    >
      {/* Completion Indicator */}
      {habit.completedToday && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 transform rotate-45 translate-x-10 -translate-y-10" />
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={habit.completedToday || completeMutation.isLoading}
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              habit.completedToday
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30'
            }`}
          >
            <Check className={`w-6 h-6 ${habit.completedToday ? 'scale-100' : 'scale-90'}`} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl">{categoryIcons[habit.category]}</span>
              <h3 className={`text-lg font-semibold truncate ${habit.completedToday ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {habit.title}
              </h3>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
              {habit.description || 'No description'}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[habit.category]}`}>
                {habit.category === 'custom' ? habit.customCategory : habit.category}
              </span>
              
              {habit.streak > 0 && (
                <span className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                  <Flame className="w-3 h-3" />
                  <span>{habit.streak} day streak</span>
                </span>
              )}
              
              <span className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{habit.frequency}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
              >
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{isExpanded ? 'Hide Stats' : 'View Stats'}</span>
                </button>
                <button
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Expanded Stats */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{habit.streak}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{habit.longestStreak}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Best Streak</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{habit.totalCompletions}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Done</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
              Started {format(new Date(habit.createdAt), 'MMMM d, yyyy')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}