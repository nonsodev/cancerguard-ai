export interface User {
  id: number
  email: string
  username: string
  full_name?: string
  is_active: boolean
  created_at: string
}

export interface Prediction {
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

export interface AnalyticsData {
  total_predictions: number
  total_users: number
  benign_predictions: number
  malignant_predictions: number
  average_processing_time: number
  recent_predictions: number
}

export interface UserStats {
  total_predictions: number
  benign_predictions: number
  malignant_predictions: number
  average_confidence: number
}