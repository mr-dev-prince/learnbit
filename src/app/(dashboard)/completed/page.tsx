import { CheckCircle } from 'lucide-react';

export default function Completed() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Completed</h1>
        <p className="text-slate-400">Track your learning progress and achievements</p>
      </div>
      <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-slate-700 bg-slate-900/30">
        <CheckCircle size={48} className="text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No completed items yet</h3>
        <p className="text-slate-400">Start learning to mark items as completed</p>
      </div>
    </div>
  );
}
