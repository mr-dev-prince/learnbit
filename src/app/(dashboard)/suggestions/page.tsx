import { Lightbulb } from 'lucide-react';

export default function Suggestions() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Suggestions</h1>
        <p className="text-foreground/70">Personalized learning recommendations for you</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card-background py-16">
        <Lightbulb size={48} className="mb-4 text-foreground/40" />
        <h3 className="mb-2 text-xl font-semibold text-foreground/80">No suggestions yet</h3>
        <p className="text-foreground/60">We&apos;ll recommend topics based on your progress</p>
      </div>
    </div>
  );
}
