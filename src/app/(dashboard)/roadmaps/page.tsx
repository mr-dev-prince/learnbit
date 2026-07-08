'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import RoadmapCard from '@/components/roadmaps/RoadmapCard';
import RoadmapFormModal from '@/components/roadmaps/RoadmapFormModal';
import { useRoadmaps, useCreateRoadmap, useUpdateRoadmap, useDeleteRoadmap } from '@/hooks/useRoadmaps';
import type { Roadmap, RoadmapPayload } from '@/types/Roadmap';

export default function RoadmapsPage() {
  const { data: roadmaps = [], isLoading } = useRoadmaps();
  const createRoadmap = useCreateRoadmap();
  const updateRoadmap = useUpdateRoadmap();
  const deleteRoadmap = useDeleteRoadmap();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);

  const handleOpenModal = (roadmap?: Roadmap) => {
    setEditingRoadmap(roadmap || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRoadmap(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (payload: RoadmapPayload) => {
    if (editingRoadmap) {
      updateRoadmap.mutate({ id: editingRoadmap.id, payload });
    } else {
      createRoadmap.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this roadmap? All its modules will be permanently removed.')) {
      deleteRoadmap.mutate(id);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col px-2">
      <div className="flex flex-col sm:flex-row w-full sm:justify-between items-start sm:items-center gap-4 sm:gap-0 pt-2">
        <div className="space-y-1">
          <p className="text-3xl font-bold font-sans">My Roadmaps</p>
          <p className="text-sm text-text-muted">
            Track your long-term learning goals and milestones.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all duration-200 active:scale-95"
        >
          <Plus size={16} className="mr-2" />
          New Roadmap
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border bg-surface px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-border" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-5 w-1/3 rounded-md bg-border" />
                  <div className="flex gap-2">
                    <div className="h-3 w-16 rounded-md bg-border/70" />
                    <div className="h-3 w-20 rounded-md bg-border/70" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-lg border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/8 text-primary/40">
            <span className="text-3xl">🗺️</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-foreground">No roadmaps yet</h3>
            <p className="max-w-xs text-sm text-text-muted">
              Add your first roadmap to start planning your long-term learning goals.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="
              flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5
              text-sm font-semibold text-white shadow-sm transition-all duration-200
              hover:opacity-90 hover:shadow-[0_4px_16px_-4px_rgba(var(--primary-rgb),0.5)]
              active:scale-[0.98]
            "
          >
            <Plus size={15} />
            Add Roadmap
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-fit rounded-lg border border-border gap-3 bg-surface p-4">
          {roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onStatusChange={(id, status) => {
                const roadmapToUpdate = roadmaps.find((r) => r.id === id);
                if (roadmapToUpdate) {
                  const { id: _, ...payload } = roadmapToUpdate;
                  updateRoadmap.mutate({ id, payload: { ...payload, status } as RoadmapPayload });
                }
              }}
            />
          ))}
        </div>
      )}

      <RoadmapFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingRoadmap}
      />
    </div>
  );
}
