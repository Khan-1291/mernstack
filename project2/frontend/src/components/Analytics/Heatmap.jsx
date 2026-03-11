import { useQuery } from 'react-query'
import { format, subDays, startOfYear, getDay } from 'date-fns'
import { analyticsAPI } from '../../services/api'
import { motion } from 'framer-motion'

export const Heatmap = ({ habitId = null, days = 365 }) => {
  const { data: heatmapData, isLoading } = useQuery(
    ['heatmap', habitId, days],
    () => analyticsAPI.getHeatmap({ habitId, days }).then(res => res.data.data),
    { staleTime: 5 * 60 * 1000 }
  )

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    )
  }

  // Create a map of date -> count
  const dataMap = new Map()
  heatmapData?.forEach(item => {
    dataMap.set(item._id, item.count)
  })

  // Generate last 365 days
  const today = new Date()
  const daysArray = Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    return {
      date,
      dateStr,
      count: dataMap.get(dateStr) || 0
    }
  })

  // Group by week for display
  const weeks = []
  let currentWeek = []
  
  // Add empty cells for days before the start of the year to align with weekday
  const firstDay = daysArray[0].date
  const startDayOfWeek = getDay(firstDay)
  
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null)
  }

  daysArray.forEach((day, index) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(day)
  })
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  const getIntensity = (count) => {
    if (count === 0) return 'heatmap-0'
    if (count === 1) return 'heatmap-1'
    if (count === 2) return 'heatmap-2'
    if (count === 3) return 'heatmap-3'
    return 'heatmap-4'
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Activity Heatmap
      </h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Weekday labels */}
          <div className="flex ml-8 mb-1">
            {weekDays.map((day, i) => (
              <div key={day} className="w-3 mr-1 text-xs text-gray-400 text-center">
                {i % 2 === 0 ? day[0] : ''}
              </div>
            ))}
          </div>

          <div className="flex space-x-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    whileHover={day ? { scale: 1.2 } : {}}
                    className={`w-3 h-3 rounded-sm ${day ? getIntensity(day.count) : 'bg-transparent'} relative group`}
                    title={day ? `${format(day.date, 'MMM d, yyyy')}: ${day.count} completions` : ''}
                  >
                    {day && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {format(day.date, 'MMM d')}: {day.count} habits
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end mt-4 space-x-2 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-sm heatmap-0" />
              <div className="w-3 h-3 rounded-sm heatmap-1" />
              <div className="w-3 h-3 rounded-sm heatmap-2" />
              <div className="w-3 h-3 rounded-sm heatmap-3" />
              <div className="w-3 h-3 rounded-sm heatmap-4" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}