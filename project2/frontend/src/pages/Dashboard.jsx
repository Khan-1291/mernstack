import { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar, 
  Award,
  Plus
} from 'lucide-react'
import { format } from 'date-fns'
import { analyticsAPI } from '../services/api'
import { useHabits } from '../hooks/useHabits'
import { HabitCard } from '../components/Habits/HabitCard'
import { HabitForm } from '../components/Habits/HabitForm'
import { Heatmap } from '../components/Analytics/Heatmap'
import { ProgressCharts } from '../components/Analytics/ProgressCharts'
import { motion } from 'framer-motion'

export const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const { data: habits, isLoading: habitsLoading } = useHabits()
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(
    'dashboard',
    () => analyticsAPI.getDashboard().then(res => res.data.data),
    { staleTime: 2 * 60 * 1000 }
  )

  const { overview, recentActivity, weeklyReport } = dashboardData || {}
  const today = new Date()

  const stats = [
    {
      title: 'Active Habits',
      value: overview?.totalHabits || 0,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Current Streaks',
      value: overview?.activeStreaks || 0,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      title: 'Completed Today',
      value: `${overview?.completedToday?.completed || 0}/${overview?.completedToday?.total || 0}`,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Consistency Score',
      value: `${overview?.consistencyScore || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {format(today, 'EEEE, MMMM do')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Let's build some habits today.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2 self-start"
        >
          <Plus className="w-5 h-5" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Habits */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Today's Habits
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {habits?.filter(h => h.completedToday).length}/{habits?.length} completed
              </span>
            </div>

            {habitsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : habits?.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No habits yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {habits?.map((habit) => (
                  <HabitCard key={habit._id} habit={habit} />
                ))}
              </div>
            )}
          </div>

          {/* Analytics */}
          <ProgressCharts />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Heatmap */}
          <Heatmap days={180} />

          {/* Weekly Report */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weekly Report
              </h3>
            </div>
            
            {weeklyReport && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Completions</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{weeklyReport.totalCompletions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Unique Habits</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{weeklyReport.uniqueHabitsCompleted}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Daily Average</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{weeklyReport.averagePerDay}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Best Day</span>
                  <span className="font-semibold text-primary-600">{weeklyReport.bestDay}</span>
                </div>
                {weeklyReport.improvement !== 0 && (
                  <div className={`flex justify-between items-center p-3 rounded-lg ${
                    weeklyReport.improvement > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                  }`}>
                    <span className="text-sm text-gray-600 dark:text-gray-400">vs Last Week</span>
                    <span className={`font-semibold ${weeklyReport.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {weeklyReport.improvement > 0 ? '+' : ''}{weeklyReport.improvement}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity?.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">
                        Completed <span className="font-semibold">{activity.habit?.title}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(activity.completedAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-primary-600">+{activity.xpEarned} XP</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Habit Modal */}
      {showCreateForm && (
        <HabitForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  )
}