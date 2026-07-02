import { CheckCircle } from 'lucide-react';

export default function Completed() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Completed</h1>
        <p className="text-foreground/70">Track your learning progress and achievements</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card-background py-16">
        <CheckCircle size={48} className="mb-4 text-foreground/40" />
        <h3 className="mb-2 text-xl font-semibold text-foreground/80">No completed items yet</h3>
        <p className="text-foreground/60">Start learning to mark items as completed</p>
      </div>
    </div>
  );
}
