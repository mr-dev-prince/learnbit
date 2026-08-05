import React, { useState } from 'react';
import LexicalEditor from '@/components/common/LexicalEditor';
import { X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ActivityFormProps {
  plannerId: string;
  suggestedStartTime: string; // ISO string
  onClose: () => void;
  onSubmit: (payload: { plannerId: string; title: string; notes?: string | null; startTime: string; endTime: string }) => Promise<void>;
  initialData?: { id?: string; title: string; notes?: string | null; durationMinutes: number } | null;
}

export default function ActivityForm({ plannerId, suggestedStartTime, onClose, onSubmit, initialData }: ActivityFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes || 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    const startDate = new Date(suggestedStartTime);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    setIsSubmitting(true);
    try {
      await onSubmit({
        plannerId,
        title,
        notes,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save activity';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-xl shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">{initialData ? 'Edit Activity' : 'Add Activity'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
              placeholder="What are you working on?"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={150}>2.5 hours</option>
                <option value={180}>3 hours</option>
                <option value={240}>4 hours</option>
                {initialData && ![15,30,45,60,90,120,150,180,240].includes(initialData.durationMinutes) && (
                  <option value={initialData.durationMinutes}>
                    {Math.floor(initialData.durationMinutes / 60)}h {initialData.durationMinutes % 60}m
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="flex-1 min-h-75 flex flex-col">
            <label className="block text-sm font-semibold mb-1 text-foreground">Notes (Optional)</label>
            <div className="flex-1 border border-border rounded-lg overflow-hidden bg-background">
              <LexicalEditor
                initialContent={notes}
                onChange={setNotes}
              />
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-border flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-medium rounded-lg hover:bg-foreground/5 transition-colors text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Saving...' : <><Check size={18} /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
}
