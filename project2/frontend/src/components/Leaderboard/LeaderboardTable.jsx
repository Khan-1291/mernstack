import { useQuery } from 'react-query'
import { Trophy, Medal, Flame, Target } from 'lucide-react'
import { leaderboardAPI } from '../../services/api'
import { motion } from 'framer-motion'

export const LeaderboardTable = () => {
  const { data: leaderboardData, isLoading } = useQuery(
    'leaderboard',
    () => leaderboardAPI.getLeaderboard({ limit: 50 }).then(res => res.data),
    { staleTime: 5 * 60 * 1000 }
  )

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const { data: users, currentUserRank, period } = leaderboardData || {}

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">#{rank}</span>
  }

  const getRankStyle = (rank, isCurrentUser) => {
    let baseStyle = "flex items-center p-4 rounded-lg transition-all "
    
    if (isCurrentUser) {
      baseStyle += "bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500 "
    } else if (rank === 1) {
      baseStyle += "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 "
    } else if (rank === 2) {
      baseStyle += "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 "
    } else if (rank === 3) {
      baseStyle += "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 "
    } else {
      baseStyle += "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 "
    }
    
    return baseStyle
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {users?.slice(0, 3).map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card text-center ${index === 0 ? 'transform -translate-y-4 border-yellow-400 border-2' : ''}`}
          >
            <div className="text-4xl mb-2">
              {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
            </div>
            <img
              src={user.avatar}
              alt={user.username}
              className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.username}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Level {user.level}</p>
            <div className="mt-3 inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <Trophy className="w-4 h-4 text-primary-600" />
              <span className="font-semibold text-primary-700 dark:text-primary-300">
                {user.progressScore} pts
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Global Rankings
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {period} Time
          </span>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {users?.slice(3).map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={getRankStyle(user.rank, user.isCurrentUser)}
            >
              <div className="flex-shrink-0 mr-4">
                {getRankIcon(user.rank)}
              </div>
              
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold truncate ${user.isCurrentUser ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                  {user.username} {user.isCurrentUser && '(You)'}
                </h4>
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Flame className="w-3 h-3" />
                    <span>Level {user.level}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{user.longestStreak} best streak</span>
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {user.progressScore}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current User Rank (if not in top list) */}
        {currentUserRank && (
          <div className="px-6 py-4 bg-primary-50 dark:bg-primary-900/20 border-t-2 border-primary-500">
            <div className={getRankStyle(currentUserRank.rank, true)}>
              <div className="flex-shrink-0 mr-4">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-primary-600">
                  #{currentUserRank.rank}
                </span>
              </div>
              <img
                src={currentUserRank.avatar}
                alt={currentUserRank.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-primary-700 dark:text-primary-300">
                  {currentUserRank.username} (You)
                </h4>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-700 dark:text-primary-300">
                  {currentUserRank.progressScore}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}