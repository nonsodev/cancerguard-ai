import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  CloudArrowUpIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { predictionAPI } from '../services/api'

interface PredictionResult {
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

export default function PredictionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const predictionMutation = useMutation({
    mutationFn: (file: File) => predictionAPI.uploadAndPredict(file),
    onSuccess: (data: PredictionResult) => {
      setResult(data)
      toast.success('Analysis completed successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Analysis failed')
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleAnalyze = () => {
    if (selectedFile) {
      predictionMutation.mutate(selectedFile)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  const getResultColor = (prediction: string) => {
    return prediction === 'Benign' ? 'text-health-600' : 'text-danger-600'
  }

  const getResultBg = (prediction: string) => {
    return prediction === 'Benign' ? 'bg-health-50 border-health-200' : 'bg-danger-50 border-danger-200'
  }

  const getResultIcon = (prediction: string) => {
    return prediction === 'Benign' ? CheckCircleIcon : ExclamationTriangleIcon
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Breast Cancer Detection</h1>
        <p className="text-gray-600">
          Upload a medical image for AI-powered analysis and get instant results with confidence scores.
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Medical Image</h2>
        
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
            </p>
            <p className="text-gray-600 mb-4">or click to select a file</p>
            <p className="text-sm text-gray-500">
              Supports: JPEG, PNG, BMP, TIFF (max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Image Preview</h3>
                <div className="border rounded-lg overflow-hidden">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-contain bg-gray-50"
                    />
                  )}
                </div>
              </div>
              
              {/* File Info */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-3">File Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <PhotoIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {selectedFile.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">
                      Type: {selectedFile.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAnalyze}
                disabled={predictionMutation.isPending}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {predictionMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Image'
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={predictionMutation.isPending}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis Results</h2>
          
          <div className="space-y-6">
            {/* Main Result */}
            <div className={`p-6 rounded-lg border-2 ${getResultBg(result.prediction)}`}>
              <div className="flex items-center mb-4">
                {(() => {
                  const Icon = getResultIcon(result.prediction)
                  return <Icon className={`h-8 w-8 ${getResultColor(result.prediction)} mr-3`} />
                })()}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {result.prediction}
                  </h3>
                  <p className="text-gray-600">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              {result.prediction === 'Malignant' && (
                <div className="bg-white p-4 rounded-lg border border-danger-200">
                  <p className="text-sm text-danger-800">
                    <strong>Important:</strong> This is an AI-generated result and should not replace professional medical diagnosis. 
                    Please consult with a healthcare professional for proper evaluation and treatment.
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gray-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-health-600 mb-1">
                    {(result.probabilities.Benign * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Benign Probability</div>
                </div>
              </div>
              
              <div className="card bg-gray-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-danger-600 mb-1">
                    {(result.probabilities.Malignant * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Malignant Probability</div>
                </div>
              </div>
              
              <div className="card bg-gray-50">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
                    <span className="text-2xl font-bold text-gray-600">
                      {result.processing_time.toFixed(2)}s
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Processing Time</div>
                </div>
              </div>
            </div>

            {/* Analysis Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Analysis Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Model: CNN-RNN Hybrid Neural Network</li>
                <li>• Image processed at 64x64 resolution</li>
                <li>• Sequence length: 10 frames</li>
                <li>• Analysis completed on: {new Date(result.created_at).toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card bg-yellow-50 border-yellow-200"
      >
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-900 mb-2">Medical Disclaimer</h3>
            <p className="text-sm text-yellow-800">
              This AI tool is designed to assist healthcare professionals and should not be used as a substitute 
              for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare 
              providers for medical decisions. The accuracy of AI predictions may vary and should be validated 
              through proper medical examination and testing.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}