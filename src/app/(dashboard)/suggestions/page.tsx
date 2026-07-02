import { Lightbulb } from 'lucide-react';

export default function Suggestions() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Suggestions</h1>
        <p className="text-slate-400">Personalized learning recommendations for you</p>
      </div>
      <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-slate-700 bg-slate-900/30">
        <Lightbulb size={48} className="text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No suggestions yet</h3>
        <p className="text-slate-400">We&apos;ll recommend topics based on your progress</p>
      </div>
    </div>
  );
}
