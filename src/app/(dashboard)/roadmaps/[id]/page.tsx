'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Clock, CircleDashed, CheckCircle, Clock3 } from 'lucide-react';
import ModuleCard from '@/components/roadmaps/ModuleCard';
import ModuleFormModal from '@/components/roadmaps/ModuleFormModal';
import {
  useRoadmap,
  useRoadmapModules,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
} from '@/hooks/useRoadmaps';
import type { RoadmapModule, ModulePayload } from '@/types/Roadmap';

export default function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: roadmap, isLoading: isRoadmapLoading } = useRoadmap(resolvedParams.id);
  const { data: modules = [], isLoading: isModulesLoading } = useRoadmapModules(resolvedParams.id);

  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<RoadmapModule | null>(null);

  const handleOpenModal = (module?: RoadmapModule) => {
    setEditingModule(module || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingModule(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (payload: ModulePayload) => {
    if (editingModule) {
      updateModule.mutate({ roadmapId: resolvedParams.id, moduleId: editingModule.id, payload });
    } else {
      createModule.mutate({ roadmapId: resolvedParams.id, payload });
    }
  };

  const handleDelete = (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      deleteModule.mutate({ roadmapId: resolvedParams.id, moduleId });
    }
  };

  const handleModuleStatusChange = (moduleId: string, status: string) => {
    const moduleToUpdate = modules.find((m) => m.id === moduleId);
    if (moduleToUpdate) {
      const { id: _, ...payload } = moduleToUpdate;
      updateModule.mutate({
        roadmapId: resolvedParams.id,
        moduleId,
        payload: { ...payload, status } as ModulePayload,
      });
    }
  };

  // Progress Tracker Calculations
  const totalModules = modules.length;
  const completedModules = modules.filter((m) => m.status === 'COMPLETED').length;
  const progressPercentage =
    totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={12} className="text-(--completed-text)" />;
      case 'IN_PROGRESS':
        return <Clock3 size={12} className="text-(--progress-text)" />;
      case 'ARCHIVED':
        return <CircleDashed size={12} className="text-text-muted" />;
      default:
        return <CircleDashed size={12} className="text-text-muted" />;
    }
  };

  if (isRoadmapLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-lg font-medium text-text-muted">Roadmap not found</p>
        <button onClick={() => router.push('/roadmaps')} className="text-primary hover:underline">
          Back to Roadmaps
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col w-full">
      <div className="pt-2">
        <button
          onClick={() => router.push('/roadmaps')}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-text-muted hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>

        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-2">
                {getStatusIcon(roadmap.status)}
                <span className="text-sm font-bold uppercase tracking-wider text-text-muted">
                  {roadmap.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-5xl font-bold font-sans text-foreground">{roadmap.title}</h1>
              {roadmap.description && (
                <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
                  {roadmap.description}
                </p>
              )}
            </div>

            {roadmap.estimatedTime && (
              <div className="flex items-center gap-1.5 text-md w-fit px-3 font-medium text-text-muted mt-2 border border-primary p-1 rounded-full">
                <Clock size={14} />
                <span>Estimated Time: {roadmap.estimatedTime}</span>
              </div>
            )}
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                Progress Tracker
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-bold text-foreground">
                      {progressPercentage}%
                    </span>
                    <span className="text-sm text-text-muted mb-1">
                      {completedModules} of {totalModules} modules
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {modules.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-text-muted uppercase tracking-wider">
                      Module Status
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-text-muted">
                          <CircleDashed size={14} /> Planned
                        </span>
                        <span className="font-semibold text-foreground">
                          {modules.filter((m) => m.status === 'PLANNED').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-(--progress-text)">
                          <Clock3 size={14} /> In Progress
                        </span>
                        <span className="font-semibold text-foreground">
                          {modules.filter((m) => m.status === 'IN_PROGRESS').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-(--completed-text)">
                          <CheckCircle size={14} /> Completed
                        </span>
                        <span className="font-semibold text-foreground">
                          {modules.filter((m) => m.status === 'COMPLETED').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-text-muted opacity-70">
                          <CircleDashed size={14} /> Skipped
                        </span>
                        <span className="font-semibold text-foreground">
                          {modules.filter((m) => m.status === 'SKIPPED').length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-2 flex-1">
        <div className="flex-1 space-y-3">
          <div className="flex justify-between w-full items-center p-3 border border-border rounded-lg">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Course Sequence
              <span className="flex h-5 items-center justify-center rounded-full bg-surface-muted px-2 text-[10px] font-bold text-text-muted">
                {modules.length}
              </span>
            </h2>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all duration-200 active:scale-95 shrink-0"
            >
              <Plus size={16} className="mr-2" />
              Add Module
            </button>
          </div>

          {isModulesLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border border-border bg-surface px-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-border" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 w-1/3 rounded-md bg-border" />
                      <div className="h-3 w-1/2 rounded-md bg-border/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : modules.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 rounded-lg border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/8 text-primary/40">
                <span className="text-3xl">📦</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-foreground">No modules yet</h3>
                <p className="max-w-xs text-sm text-text-muted">
                  Break down your roadmap into actionable steps or topics to learn.
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
                Add Module
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-fit gap-3">
              {modules.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  index={index}
                  isLast={index === modules.length - 1}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  onStatusChange={handleModuleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ModuleFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingModule}
      />
    </div>
  );
}
