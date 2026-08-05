import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface PlannerSetupProps {
  date: Date;
  onSetup: (wakeTime: Date, sleepTime: Date) => Promise<void>;
}

export default function PlannerSetup({ date, onSetup }: PlannerSetupProps) {
  const [wakeTimeStr, setWakeTimeStr] = useState('07:00');
  const [sleepTimeStr, setSleepTimeStr] = useState('23:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Convert HH:mm to actual Date objects on the selected date
    const [wakeH, wakeM] = wakeTimeStr.split(':').map(Number);
    const wakeDate = new Date(date);
    wakeDate.setHours(wakeH, wakeM, 0, 0);

    const [sleepH, sleepM] = sleepTimeStr.split(':').map(Number);
    const sleepDate = new Date(date);
    sleepDate.setHours(sleepH, sleepM, 0, 0);
    
    // If sleep time is numerically less than or equal to wake time, assume they sleep past midnight
    if (sleepH <= wakeH) {
      sleepDate.setDate(sleepDate.getDate() + 1);
    }

    try {
      await onSetup(wakeDate, sleepDate);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
        <Clock size={32} />
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-center text-foreground">Plan Your Day</h2>
      <p className="text-foreground/60 text-center mb-8">
        Start by defining your waking hours. We&apos;ll automatically reserve your sleep time.
      </p>

      <form onSubmit={handleSubmit} className="w-full bg-surface border border-border rounded-xl p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Wake-up Time</label>
            <input
              type="time"
              required
              value={wakeTimeStr}
              onChange={(e) => setWakeTimeStr(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Sleep Time</label>
            <input
              type="time"
              required
              value={sleepTimeStr}
              onChange={(e) => setSleepTimeStr(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Setting up...' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  );
}
