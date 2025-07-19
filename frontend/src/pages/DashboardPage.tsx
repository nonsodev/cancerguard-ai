import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  HeartIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  CameraIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { analyticsAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: analyticsAPI.getDashboard,
  })

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: analyticsAPI.getUserStats,
  })

  const stats = [
    {
      name: 'Total Predictions',
      value: dashboardData?.total_predictions || 0,
      icon: ChartBarIcon,
      color: 'text-primary-600',
      bg: 'bg-primary-100',
    },
    {
      name: 'Benign Cases',
      value: dashboardData?.benign_predictions || 0,
      icon: HeartIcon,
      color: 'text-health-600',
      bg: 'bg-health-100',
    },
    {
      name: 'Malignant Cases',
      value: dashboardData?.malignant_predictions || 0,
      icon: HeartIcon,
      color: 'text-danger-600',
      bg: 'bg-danger-100',
    },
    {
      name: 'Avg Processing Time',
      value: `${dashboardData?.average_processing_time?.toFixed(2) || 0}s`,
      icon: ClockIcon,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
    },
  ]

  const userStatsData = [
    {
      name: 'Your Predictions',
      value: userStats?.total_predictions || 0,
      description: 'Total analyses performed',
    },
    {
      name: 'Benign Results',
      value: userStats?.benign_predictions || 0,
      description: 'Non-cancerous detections',
    },
    {
      name: 'Malignant Results',
      value: userStats?.malignant_predictions || 0,
      description: 'Cancerous detections',
    },
    {
      name: 'Avg Confidence',
      value: `${((userStats?.average_confidence || 0) * 100).toFixed(1)}%`,
      description: 'Model confidence score',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card primary-gradient text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.full_name || user?.username}!
              </h1>
              <p className="text-primary-100">
                Ready to analyze medical images with AI-powered precision?
              </p>
            </div>
            <Link
              to="/predict"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CameraIcon className="h-5 w-5 mr-2" />
              New Analysis
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Global Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* User Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userStatsData.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card text-center"
            >
              <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
              <div className="text-lg font-medium text-gray-900 mb-1">{stat.name}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/predict" className="card hover:shadow-md transition-shadow group">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors">
                <CameraIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">New Prediction</h3>
                <p className="text-gray-600">Upload and analyze medical images</p>
              </div>
            </div>
          </Link>

          <Link to="/history" className="card hover:shadow-md transition-shadow group">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <ClockIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View History</h3>
                <p className="text-gray-600">Review past predictions and results</p>
              </div>
            </div>
          </Link>

          <Link to="/profile" className="card hover:shadow-md transition-shadow group">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-health-100 group-hover:bg-health-200 transition-colors">
                <UserGroupIcon className="h-6 w-6 text-health-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
                <p className="text-gray-600">Manage your account preferences</p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Platform Activity</h2>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {dashboardData?.recent_predictions || 0}
              </div>
              <div className="text-sm text-gray-600">Recent Predictions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-health-600 mb-1">
                {dashboardData?.total_users || 0}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {dashboardData?.average_processing_time?.toFixed(2) || 0}s
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}