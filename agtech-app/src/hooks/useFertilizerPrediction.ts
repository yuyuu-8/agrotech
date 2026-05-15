import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { FertilizerFormValues, PredictionResponse } from '../schema/fertilizerSchema';

// Используем переменную окружения, чтобы в проде стучаться на бэкенд, а при локальной разработке - на localhost 8000
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1/predict/`
  : 'http://localhost:8000/api/v1/predict/';

const fetchPrediction = async (data: FertilizerFormValues): Promise<PredictionResponse> => {
  try {
    const response = await axios.post<PredictionResponse>(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error('Failed to fetch prediction from server');
  }
};

export const useFertilizerPrediction = () => {
  return useMutation({
    mutationFn: fetchPrediction,
    onSuccess: (data) => {
      console.log('Django Backend Success:', data);
    },
    onError: (error) => {
      console.error('Django Backend Failed:', error);
      alert('Error connecting to Backend. Is Django running on port 8000?');
    }
  });
};