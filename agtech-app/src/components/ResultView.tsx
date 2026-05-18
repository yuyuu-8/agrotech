import React from 'react';
import type { PredictionResponse } from '../schema/fertilizerSchema';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  result: PredictionResponse;
}

const translateFeature = (feature: string): string => {
  const dictionary: Record<string, string> = {
    'Nitrogen': 'Азот',
    'Phosphorus': 'Фосфор',
    'Potassium': 'Калий',
    'Temperature': 'Температура',
    'Humidity': 'Влажность воздуха',
    'Moisture': 'Влажность почвы',
    'Rainfall': 'Осадки',
    'pH_Level': 'Уровень pH',
    'ph': 'Уровень pH',
  };

  if (dictionary[feature]) return dictionary[feature];

  if (feature.startsWith('Soil Type_')) {
    const type = feature.replace('Soil Type_', '');
    const soils: Record<string, string> = {
      'Sandy': 'Песчаная',
      'Loamy': 'Суглинистая',
      'Black': 'Чернозем',
      'Red': 'Красная',
      'Clayey': 'Глинистая'
    };
    return `Тип почвы: ${soils[type] || type}`;
  }

  if (feature.startsWith('Crop Type_')) {
    const type = feature.replace('Crop Type_', '');
    const crops: Record<string, string> = {
      'Wheat': 'Пшеница',
      'Maize': 'Кукуруза',
      'Sugarcane': 'Сахарный тростник',
      'Cotton': 'Хлопок',
      'Tobacco': 'Табак',
      'Paddy': 'Рис',
      'Barley': 'Ячмень',
      'Oil seeds': 'Масличные',
      'Millets': 'Просо',
      'Ground Nuts': 'Арахис',
      'Pulses': 'Бобовые'
    };
    return `Культура: ${crops[type] || type}`;
  }

  if (feature.startsWith('Previous_Crop_')) {
    const type = feature.replace('Previous_Crop_', '');
    const crops: Record<string, string> = {
      'Legumes': 'Бобовые',
      'Wheat': 'Пшеница',
      'Rice': 'Рис',
      'Maize': 'Кукуруза',
      'Cotton': 'Хлопок',
      'Sugarcane': 'Сахарный тростник',
      'Potato': 'Картофель',
      'None': 'Пар (отдых)',
      'nan': 'Отсутствует'
    };
    return `Предшественник: ${crops[type] || type}`;
  }

  if (feature.startsWith('Season_')) {
    const type = feature.replace('Season_', '');
    const seasons: Record<string, string> = {
      'Kharif': 'Хариф (осенний урожай)',
      'Rabi': 'Раби (весенний урожай)',
      'Zaid': 'Заид (летний урожай)',
      'Autumn': 'Осень',
      'Winter': 'Зима',
      'Spring': 'Весна',
      'Summer': 'Лето'
    };
    return `Сезон: ${seasons[type] || type}`;
  }

  if (feature.startsWith('Field_Orientation_')) {
    const type = feature.replace('Field_Orientation_', '');
    return `Ориентация поля: ${type}`;
  }

  return feature;
};

export const ResultView: React.FC<Props> = ({ result }) => {
  const chartData = [...result.shap_values]
    .filter(item => Math.abs(item.impact) > 0.005) 
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 15)
    .map(item => ({
      ...item,
      displayName: translateFeature(item.feature)
    })); 
    
  return (
    <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg mt-8 border border-slate-700">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Рекомендуемое удобрение</h2>
          <div className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
            {result.recommended_fertilizer}
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-sm font-medium">Уверенность ИИ</div>
          <div className="text-2xl font-bold">{(result.confidence * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg p-4 mb-6 flex items-start gap-3 border border-slate-700">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 text-sm">{result.insight_message}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Влияние параметров на решение (SHAP)</h3>
        <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 240, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="displayName" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                width={240}
                interval={0}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
              />
              <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2 px-10">
          <span>Отрицательное влияние</span>
          <span>Положительное влияние</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={() => alert('Рекомендация добавлена в план! (Функционал в разработке)')}
          className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
        >
          + Добавить в план
        </button>
      </div>
    </div>
  );
};