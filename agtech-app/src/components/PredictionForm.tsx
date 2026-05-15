import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fertilizerFormSchema, type FertilizerFormValues } from '../schema/fertilizerSchema';
import { Sprout, Droplets, Thermometer, FlaskConical, Info } from 'lucide-react';

interface Props {
  onSubmit: (data: FertilizerFormValues) => void;
  isLoading: boolean;
}

const FieldLabel: React.FC<{ label: string; tooltipTitle: string; tooltipText: string }> = ({ label, tooltipTitle, tooltipText }) => (
  <div className="flex items-center gap-1 mb-1 mt-2">
    <label className="block text-xs font-semibold text-[var(--text)] uppercase tracking-wider">{label}</label>
    <div className="group relative flex items-center justify-center">
      <Info className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-[var(--accent)] transition-colors" />
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-3 rounded-lg bg-slate-800 text-white text-xs z-50 pointer-events-none shadow-xl scale-95 group-hover:scale-100 origin-bottom">
        <div className="font-bold mb-1">{tooltipTitle}</div>
        <div className="text-slate-300 normal-case tracking-normal leading-relaxed">{tooltipText}</div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  </div>
);

export const PredictionForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FertilizerFormValues>({
    resolver: zodResolver(fertilizerFormSchema),
    defaultValues: {
      fieldId: 'field_1', 
      nitrogen: 20, phosphorus: 45, potassium: 30,
      temperature: 22, humidity: 65, moisture: 45, rainfall: 120, ph: 6.5,
      soilType: 'Loamy', cropType: 'Wheat',
      previousCrop: 'None', season: 'Summer', fieldOrientation: 'Flat'
    }
  });

  const inputClasses = "w-full p-2 bg-white dark:bg-slate-800 border border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-sm text-[var(--text-h)]";
  const sectionClasses = "p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-[var(--border)] shadow-sm";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[var(--shadow)] border border-[var(--border)] text-left">
      <div className="border-b border-[var(--border)] pb-4">
        <h2 className="text-xl font-bold text-[var(--text-h)] flex items-center gap-2">
          <Sprout className="w-5 h-5 text-[var(--accent)]" />
          Параметры поля
        </h2>
        <p className="text-xs text-[var(--text)] mt-1">Введите текущие показатели почвы и условий окружающей среды.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* NPK Section */}
        <div className={sectionClasses}>
          <h3 className="font-bold text-[var(--text-h)] text-sm flex items-center gap-2 border-b border-[var(--border)] pb-2 mb-3">
            <FlaskConical className="w-4 h-4 text-[var(--accent)]" /> Удобрения (NPK)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <FieldLabel label="Азот (N)" tooltipTitle="Азот (Nitrogen)" tooltipText="Жизненно важен для роста растений. Диапазон: 0 - 150 кг/га." />
              <input type="number" {...register('nitrogen', { valueAsNumber: true })} className={inputClasses} placeholder="0-150" />
              {errors.nitrogen && <span className="text-[10px] text-red-500 mt-1">{errors.nitrogen.message}</span>}
            </div>
            <div>
              <FieldLabel label="Фосфор (P)" tooltipTitle="Фосфор (Phosphorus)" tooltipText="Стимулирует развитие корней. Диапазон: 0 - 150 кг/га." />
              <input type="number" {...register('phosphorus', { valueAsNumber: true })} className={inputClasses} placeholder="0-150" />
            </div>
            <div>
              <FieldLabel label="Калий (K)" tooltipTitle="Калий (Potassium)" tooltipText="Повышает устойчивость к болезням. Диапазон: 0 - 150 кг/га." />
              <input type="number" {...register('potassium', { valueAsNumber: true })} className={inputClasses} placeholder="0-150" />
            </div>
          </div>
        </div>

        {/* Environment Section */}
        <div className={sectionClasses}>
          <h3 className="font-bold text-[var(--text-h)] text-sm flex items-center gap-2 border-b border-[var(--border)] pb-2 mb-3">
            <Thermometer className="w-4 h-4 text-[var(--accent)]" /> Окружающая среда
          </h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <div>
              <FieldLabel label="Темп-ра (°C)" tooltipTitle="Температура" tooltipText="Средняя температура окружающей среды. Диапазон: 5°C - 50°C." />
              <input type="number" {...register('temperature', { valueAsNumber: true })} className={inputClasses} />
            </div>
            <div>
              <FieldLabel label="Влажность (%)" tooltipTitle="Влажность воздуха" tooltipText="Относительная влажность воздуха. Диапазон: 10% - 100%." />
              <input type="number" {...register('humidity', { valueAsNumber: true })} className={inputClasses} />
            </div>
            <div>
              <FieldLabel label="Осадки (мм)" tooltipTitle="Количество осадков" tooltipText="Объем выпавших осадков за период вегетации. Диапазон: 50 - 300 мм." />
              <input type="number" {...register('rainfall', { valueAsNumber: true })} className={inputClasses} />
            </div>
            <div>
              <FieldLabel label="Сезон" tooltipTitle="Сезон посадки" tooltipText="Время года, когда выращивается культура." />
              <select {...register('season')} className={inputClasses}>
                <option value="Summer">Лето</option>
                <option value="Spring">Весна</option>
                <option value="Autumn">Осень</option>
                <option value="Winter">Зима</option>
              </select>
            </div>
          </div>
        </div>

        {/* Soil Section */}
        <div className={sectionClasses}>
          <h3 className="font-bold text-[var(--text-h)] text-sm flex items-center gap-2 border-b border-[var(--border)] pb-2 mb-3">
            <Droplets className="w-4 h-4 text-[var(--accent)]" /> Почва и культура
          </h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <div>
              <FieldLabel label="Уровень pH" tooltipTitle="pH почвы" tooltipText="Водородный показатель. Кислая < 7, нейтральная ≈ 7, щелочная > 7. Меж: 3.5 - 9.5" />
              <input type="number" step="0.1" {...register('ph', { valueAsNumber: true })} className={inputClasses} />
              {errors.ph && <span className="text-[10px] text-red-500 mt-1">{errors.ph.message}</span>}
            </div>
            <div>
              <FieldLabel label="Влага почвы" tooltipTitle="Влажность почвы" tooltipText="Количество влаги, удерживаемое в почве. Диапазон: 10 - 90" />
              <input type="number" {...register('moisture', { valueAsNumber: true })} className={inputClasses} />
            </div>
            <div>
              <FieldLabel label="Тип почвы" tooltipTitle="Тип почвы" tooltipText="Преобладающий структурный тип грунта на вашем участке." />
              <select {...register('soilType')} className={inputClasses}>
                <option value="Clayey">Глинистая</option>
                <option value="Loamy">Супесчаная</option>
                <option value="Sandy">Песчаная</option>
                <option value="Red">Красная</option>
                <option value="Black">Чернозем</option>
              </select>
            </div>
            <div>
              <FieldLabel label="Культура" tooltipTitle="Выращиваемая культура" tooltipText="Целевое растение, для которого подбирается удобрение." />
              <select {...register('cropType')} className={inputClasses}>
                <option value="Wheat">Пшеница</option>
                <option value="Paddy">Рис</option>
                <option value="Maize">Кукуруза</option>
                <option value="Cotton">Хлопок</option>
                <option value="Tobacco">Табак</option>
                <option value="Sugarcane">Тростник</option>
                <option value="Barley">Ячмень</option>
                <option value="Millets">Просо</option>
                <option value="Pulses">Бобовые</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-3">
              <div className="flex-1">
                <FieldLabel label="Пред. культура" tooltipTitle="Предшествующая культура" tooltipText="Растение, которое выращивалось на этом поле в прошлом сезоне." />
                <select {...register('previousCrop')} className={inputClasses}>
                  <option value="None">Нет</option>
                  <option value="Cereals">Зерновые</option>
                  <option value="Legumes">Бобовые</option>
                  <option value="Root Crops">Корнеплоды</option>
                </select>
              </div>
              <div className="flex-1">
                <FieldLabel label="Рельеф" tooltipTitle="Рельеф поля" tooltipText="Характеристика поверхности (наклон влияет на сток воды)." />
                <select {...register('fieldOrientation')} className={inputClasses}>
                  <option value="Flat">Ровное</option>
                  <option value="Slope">Склон</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-center pt-8 border-t border-[var(--border)]">
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-[var(--accent)] hover:opacity-90 text-white px-10 py-3 rounded-xl font-bold text-lg transition-all shadow-[var(--shadow)] disabled:opacity-50 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto"
        >
          {isLoading ? (
            <span className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Sprout className="w-5 h-5" />
          )}
          {isLoading ? 'Обработка ML моделью...' : 'Получить рекомендацию'}
        </button>
      </div>
    </form>
  );
};