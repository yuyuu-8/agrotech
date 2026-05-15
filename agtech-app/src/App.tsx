import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PredictionForm } from './components/PredictionForm';
import { ResultView } from './components/ResultView';
import { useFertilizerPrediction } from './hooks/useFertilizerPrediction';
import { Leaf } from 'lucide-react';

const queryClient = new QueryClient();

const DashboardCore = () => {
  const { mutate, data, isPending } = useFertilizerPrediction();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-3">
        <Leaf className="w-6 h-6 text-emerald-600" />
        <h1 className="text-xl font-bold text-slate-800">AgVend <span className="font-light text-slate-500">| Agronomy Decision Support</span></h1>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Fertilizer Recommendation AI</h2>
            <p className="text-slate-500">Run ML inference based on real-time field data.</p>
          </div>
          <div className="bg-white px-4 py-2 border border-slate-200 rounded-md shadow-sm text-sm font-medium">
            Active Context: <span className="text-emerald-600">Sector 7-G (Winter Wheat)</span>
          </div>
        </div>

        <PredictionForm onSubmit={(formData) => mutate(formData)} isLoading={isPending} />

        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <ResultView result={data} />
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardCore />
    </QueryClientProvider>
  );
}

export default App;