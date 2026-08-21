'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PasswordGate from '@/components/architectures/PasswordGate';
import ArchitectureForm from '@/components/architectures/ArchitectureForm';
import { useCreateArchitecture } from '@/hooks/useArchitectures';
import type { ArchitecturePayload } from '@/types/Architecture';

export default function NewArchitecturePage() {
  const router = useRouter();
  const createArchitecture = useCreateArchitecture();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload: ArchitecturePayload) => {
    setIsSubmitting(true);
    try {
      const created = await createArchitecture.mutateAsync(payload);
      toast.success('Architecture blueprint created successfully');
      router.push(`/architectures/${created.id}`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create architecture',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PasswordGate>
      <ArchitectureForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        backHref="/architectures"
        pageTitle="Create Architecture Blueprint"
        pageSubtitle="Design visual diagrams and document comprehensive technical specifications"
      />
    </PasswordGate>
  );
}
