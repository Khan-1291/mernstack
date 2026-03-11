import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useCreateHabit } from '../../hooks/useHabits'
import { motion } from 'framer-motion'

const categories = [
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#10b981' },
  { id: 'productivity', name: 'Productivity', icon: '⚡', color: '#f59e0b' },
  { id: 'learning', name: 'Learning', icon: '📚', color: '#3b82f6' },
  { id: 'personal', name: 'Personal Development', icon: '🌱', color: '#8b5cf6' },
  { id: 'finance', name: 'Finance', icon: '💰', color: '#059669' },
  { id: 'creativity', name: 'Creativity', icon: '🎨', color: '#ec4899' },
  { id: 'custom', name: 'Custom', icon: '📌', color: '#6b7280' }
]

const frequencies = [
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'custom', name: 'Custom Days' }
]

export const HabitForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'health',
    customCategory: '',
    frequency: 'daily',
    color: '#4F46E5'
  })

  const createMutation = useCreateHabit()

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(formData, {
      onSuccess: () => onClose()
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Habit</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Morning Jog, Read 30 minutes"
                className="input-field"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about your habit..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id, color: cat.color })}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                      formData.category === cat.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Category Input */}
            {formData.category === 'custom' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Category Name *
                </label>
                <input
                  type="text"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  placeholder="Enter custom category"
                  className="input-field"
                  required={formData.category === 'custom'}
                />
              </motion.div>
            )}

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency *
              </label>
              <div className="flex space-x-2">
                {frequencies.map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: freq.id })}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.frequency === freq.id
                        ? 'border-primary-500 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {freq.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isLoading || !formData.title}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                {createMutation.isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Habit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}