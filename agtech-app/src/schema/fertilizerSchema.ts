import { z } from 'zod';

export const fertilizerFormSchema = z.object({
  fieldId: z.string().min(1, 'Please select a field'),
  nitrogen: z.number().min(0, 'Min 0').max(150, 'Max 150'),
  phosphorus: z.number().min(0).max(150),
  potassium: z.number().min(0).max(150),
  temperature: z.number().min(-10).max(50),
  humidity: z.number().min(0).max(100),
  moisture: z.number().min(0).max(100),
  rainfall: z.number().min(0).max(500),
  ph: z.number().min(0).max(14, 'pH must be between 0 and 14'),
  soilType: z.string().min(1, 'Required'),
  cropType: z.string().min(1, 'Required'),
  previousCrop: z.string().min(1, 'Required'),
  season: z.string().min(1, 'Required'),
  fieldOrientation: z.string().min(1, 'Required'),
});

export type FertilizerFormValues = z.infer<typeof fertilizerFormSchema>;

export interface ShapValue {
  feature: string;
  impact: number; // positive or negative impact on the recommendation
}

export interface PredictionResponse {
  recommended_fertilizer: string;
  confidence: number;
  shap_values: ShapValue[];
  insight_message: string;
}