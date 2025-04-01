import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

interface StatsCardProps {
  title: string
  value: string
  icon: any
  trend: string
  trendDirection: 'up' | 'down'
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection 
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <Icon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
        </div>
      </div>
      <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="mt-2 flex items-center">
        {trendDirection === 'up' ? (
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        )}
        <span className={`ml-2 text-sm font-medium ${
          trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend}
        </span>
        <span className="ml-2 text-sm font-medium text-gray-500">vs last month</span>
      </div>
    </div>
  )
}
