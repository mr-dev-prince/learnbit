import { BookOpen } from 'lucide-react';

export default function RevisionQueue() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Revision Queue</h1>
        <p className="text-slate-400">Review and practice topics from your queue</p>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-slate-700 bg-slate-900/30">
        <BookOpen size={48} className="text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No items in queue</h3>
        <p className="text-slate-400">Start adding topics to review later</p>
      </div>
    </div>
  );
}
