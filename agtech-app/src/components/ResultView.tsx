import React from 'react';
import type { PredictionResponse } from '../schema/fertilizerSchema';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  result: PredictionResponse;
}

export const ResultView: React.FC<Props> = ({ result }) => {
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
        <div style={{ width: '100%', height: '250px', marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.shap_values} layout="vertical" margin={{ left: 40, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
              />
              <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                {result.shap_values.map((entry, index) => (
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