import { BookOpen } from 'lucide-react';

export default function RevisionQueue() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Revision Queue</h1>
        <p className="text-foreground/70">Review and practice topics from your queue</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card-background py-16">
        <BookOpen size={48} className="mb-4 text-foreground/40" />
        <h3 className="mb-2 text-xl font-semibold text-foreground/80">No items in queue</h3>
        <p className="text-foreground/60">Start adding topics to review later</p>
      </div>
    </div>
  );
}
