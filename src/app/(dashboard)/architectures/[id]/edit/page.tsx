'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import PasswordGate from '@/components/architectures/PasswordGate';
import ArchitectureForm from '@/components/architectures/ArchitectureForm';
import {
  useArchitecture,
  useUpdateArchitecture,
} from '@/hooks/useArchitectures';
import type { ArchitecturePayload } from '@/types/Architecture';

export default function EditArchitecturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: architecture, isLoading } = useArchitecture(resolvedParams.id);
  const updateArchitecture = useUpdateArchitecture();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload: ArchitecturePayload) => {
    if (!architecture) return;
    setIsSubmitting(true);
    try {
      await updateArchitecture.mutateAsync({ id: architecture.id, payload });
      toast.success('Architecture blueprint updated successfully');
      router.push(`/architectures/${architecture.id}`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update architecture',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PasswordGate>
        <div className="space-y-6 px-2 pb-8 max-w-7xl mx-auto animate-pulse">
          <div className="h-6 w-32 bg-surface-muted rounded-md" />
          <div className="h-96 bg-surface rounded-2xl border border-border" />
        </div>
      </PasswordGate>
    );
  }

  if (!architecture) {
    return (
      <PasswordGate>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <div className="p-4 rounded-2xl bg-surface-muted border border-border text-text-muted">
            <Layers size={36} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Architecture Not Found</h2>
          <p className="text-sm text-text-muted max-w-sm">
            This architecture blueprint does not exist or has been deleted.
          </p>
          <Link
            href="/architectures"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Return to Architectures</span>
          </Link>
        </div>
      </PasswordGate>
    );
  }

  return (
    <PasswordGate>
      <ArchitectureForm
        initialData={architecture}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        backHref={`/architectures/${architecture.id}`}
        pageTitle={`Edit: ${architecture.title}`}
        pageSubtitle="Update diagram topology, specifications, and architecture notes"
      />
    </PasswordGate>
  );
}
