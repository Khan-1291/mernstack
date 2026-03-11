import { useQuery } from 'react-query'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { analyticsAPI } from '../../services/api'

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#059669', '#ec4899']

export const ProgressCharts = () => {
  const { data: dashboardData, isLoading } = useQuery(
    'dashboard',
    () => analyticsAPI.getDashboard().then(res => res.data.data),
    { staleTime: 2 * 60 * 1000 }
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse h-80" />
        ))}
      </div>
    )
  }

  const { weeklyCompletion, categoryBreakdown, overview } = dashboardData || {}

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Completion Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Completion Rate
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="week" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#374151', opacity: 0.2 }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#374151', opacity: 0.2 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar 
                dataKey="completionRate" 
                fill="#4f46e5" 
                radius={[4, 4, 0, 0]}
                name="Completion %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Habits by Category
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="total"
                nameKey="name"
              >
                {categoryBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {categoryBreakdown?.map((cat, index) => (
            <div key={cat.name} className="flex items-center space-x-1 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: cat.color || COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Consistency Trend */}
      <div className="card lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          12-Week Consistency Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="week" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#374151', opacity: 0.2 }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#374151', opacity: 0.2 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completions" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Completions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}