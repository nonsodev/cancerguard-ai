import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { predictionAPI } from '../services/api'

interface Prediction {
  id: number
  prediction: string
  confidence: number
  processing_time: number
  probabilities: {
    Benign: number
    Malignant: number
  }
  image_filename: string
  created_at: string
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'benign' | 'malignant'>('all')

  const { data: predictions = [], isLoading } = useQuery({
    queryKey: ['prediction-history'],
    queryFn: () => predictionAPI.getHistory(),
  })

  const filteredPredictions = predictions.filter((prediction: Prediction) => {
    const matchesSearch = prediction.image_filename
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'benign' && prediction.prediction === 'Benign') ||
      (filterType === 'malignant' && prediction.prediction === 'Malignant')
    
    return matchesSearch && matchesFilter
  })

  const getResultColor = (prediction: string) => {
    return prediction === 'Benign' ? 'text-health-600' : 'text-danger-600'
  }

  const getResultBg = (prediction: string) => {
    return prediction === 'Benign' ? 'bg-health-50' : 'bg-danger-50'
  }

  const getResultIcon = (prediction: string) => {
    return prediction === 'Benign' ? CheckCircleIcon : ExclamationTriangleIcon
  }

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prediction History</h1>
        <p className="text-gray-600">
          Review your past AI analysis results and track your diagnostic history.
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('benign')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'benign'
                  ? 'bg-health-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Benign
            </button>
            <button
              onClick={() => setFilterType('malignant')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'malignant'
                  ? 'bg-danger-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Malignant
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredPredictions.length === 0 ? (
          <div className="card text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions found</h3>
            <p className="text-gray-600">
              {predictions.length === 0
                ? "You haven't made any predictions yet."
                : 'No predictions match your current filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPredictions.map((prediction: Prediction, index: number) => {
              const Icon = getResultIcon(prediction.prediction)
              return (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getResultBg(prediction.prediction)}`}>
                        <Icon className={`h-6 w-6 ${getResultColor(prediction.prediction)}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prediction.image_filename}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            Result: <span className={`font-medium ${getResultColor(prediction.prediction)}`}>
                              {prediction.prediction}
                            </span>
                          </span>
                          <span>
                            Confidence: {(prediction.confidence * 100).toFixed(1)}%
                          </span>
                          <span>
                            {new Date(prediction.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Processing Time</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {prediction.processing_time.toFixed(2)}s
                      </div>
                    </div>
                  </div>

                  {/* Detailed probabilities */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Benign Probability</div>
                        <div className="text-lg font-semibold text-health-600">
                          {(prediction.probabilities.Benign * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Malignant Probability</div>
                        <div className="text-lg font-semibold text-danger-600">
                          {(prediction.probabilities.Malignant * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      {predictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Summary Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {predictions.length}
              </div>
              <div className="text-sm text-gray-600">Total Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-health-600 mb-1">
                {predictions.filter((p: Prediction) => p.prediction === 'Benign').length}
              </div>
              <div className="text-sm text-gray-600">Benign Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-danger-600 mb-1">
                {predictions.filter((p: Prediction) => p.prediction === 'Malignant').length}
              </div>
              <div className="text-sm text-gray-600">Malignant Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {(predictions.reduce((acc: number, p: Prediction) => acc + p.processing_time, 0) / predictions.length).toFixed(2)}s
              </div>
              <div className="text-sm text-gray-600">Avg Processing Time</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}