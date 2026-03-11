import { Trophy, Users } from 'lucide-react'
import { LeaderboardTable } from '../components/Leaderboard/LeaderboardTable'
import { useQuery } from 'react-query'
import { leaderboardAPI } from '../services/api'
import { motion } from 'framer-motion'

export const Leaderboard = () => {
  const { data: topPerformers } = useQuery(
    'top-performers',
    () => leaderboardAPI.getTop().then(res => res.data.data),
    { staleTime: 5 * 60 * 1000 }
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Global Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Compete with habit builders worldwide. Stay consistent, earn points, and climb the ranks!
        </p>
      </div>

      {/* Top Performers Quote Cards */}
      {topPerformers && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPerformers.map((performer, index) => (
            <motion.div
              key={performer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 border-primary-200 dark:border-primary-800"
            >
              <div className="text-3xl mb-2">{performer.badge}</div>
              <p className="text-lg font-serif italic text-gray-700 dark:text-gray-300 mb-4">
                "{performer.quote}"
              </p>
              <div className="flex items-center space-x-3">
                <img
                  src={performer.avatar}
                  alt={performer.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{performer.username}</p>
                  <p className="text-sm text-primary-600">Rank #{performer.rank}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex items-center justify-center space-x-8 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">2,451</span> active participants
          </span>
        </div>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">1.2M+</span> habits completed
        </div>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="text-gray-600 dark:text-gray-400">
          Updated <span className="font-semibold text-gray-900 dark:text-white">live</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable />
    </div>
  )
}
