'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FileText,
  Link2,
  ExternalLink,
  Pencil,
  RotateCcw,
  Trash2,
  X,
  Sparkles,
  Calendar,
} from 'lucide-react';
import type { Task } from '@/types/Task';
import { useDeleteTask } from '@/hooks/useTasks';
import { formatDateTime } from '@/utils/common/dateUtils';

interface TaskViewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onMarkRevision?: (task: Task) => void;
}

const STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    bg: 'bg-[var(--todo-bg)]',
    text: 'text-[var(--todo-text)]',
    dot: 'bg-[var(--todo-text)]',
    icon: null,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-[var(--progress-bg)]',
    text: 'text-[var(--progress-text)]',
    dot: 'bg-[var(--progress-text)] animate-pulse',
    icon: null,
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-[var(--completed-bg)]',
    text: 'text-[var(--completed-text)]',
    dot: 'bg-[var(--completed-text)]',
    icon: CheckCircle2,
  },
  ARCHIVED: {
    label: 'Archived',
    bg: 'bg-[var(--archived-bg)]',
    text: 'text-[var(--archived-text)]',
    dot: 'bg-[var(--archived-text)]',
    icon: null,
  },
} as const;

function getTimeAgo(date?: string | null): string {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export default function TaskViewModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onMarkRevision,
}: TaskViewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isHoveringClose, setIsHoveringClose] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  if (!isOpen || !task) return null;

  const status = STATUS_CONFIG[task.status];
  const StatusIcon = status.icon;
  const timeAgo = getTimeAgo(task.updatedAt);

  const handleStartEdit = () => {
    setEditNotes(task.notes || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit({ ...task, notes: editNotes });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTask(task.id, {
      onSuccess: () => {
        onDelete?.(task);
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className="
          animate-in
          fade-in-0
          zoom-in-[0.97]
          slide-in-from-bottom-3
          relative
          w-full
          max-w-2xl
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-surface
          shadow-[0_32px_80px_-16px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)_inset]
          duration-300
        "
      >
        <div className="relative px-6 pt-6 pb-5 sm:px-8 sm:pt-7 sm:pb-6">
          <div className="flex w-full justify-between py-3 items-center gap-3">
            <h1
              className="
              text-[22px]
              font-extrabold
              leading-tight
              tracking-tight
              text-foreground
              sm:text-2xl
            "
            >
              {task.title}
            </h1>
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                onMouseEnter={() => setIsHoveringClose(true)}
                onMouseLeave={() => setIsHoveringClose(false)}
                className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-text-muted
                transition-all
                duration-200
                hover:bg-surface-hover
                hover:text-foreground
              "
              >
                <X
                  size={16}
                  className={`transition-transform duration-200 ${isHoveringClose ? 'rotate-90' : 'rotate-0'}`}
                />
              </button>
            </div>
          </div>
          <div className="flex w-full justify-between items-center">
            <div className="flex w-fit justify-center items-center gap-3">
              <div
                className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-3
                py-1
                text-[11px]
                font-bold
                uppercase
                tracking-[0.12em]
                ${status.bg}
                ${status.text}
              `}
              >
                {StatusIcon ? (
                  <StatusIcon size={13} strokeWidth={2.5} />
                ) : (
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                )}
                {status.label}
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
                <Clock size={13} strokeWidth={2} className="opacity-50" />
                <span>Last updated {timeAgo}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
              <Calendar size={13} strokeWidth={2} className="opacity-50" />
              <p>{formatDateTime(task.dueDate || '')}</p>
            </div>
          </div>
        </div>
        <div className="mx-6 h-px bg-border sm:mx-8" />
        <div className="px-6 py-5 sm:px-8 sm:py-6 h-96 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FileText size={15} strokeWidth={2} className="text-text-muted" />
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-text-muted">
                  Description
                </h2>
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={6}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-border
                      bg-surface-muted
                      px-4
                      py-3
                      text-sm
                      leading-7
                      text-foreground
                      outline-none
                      transition-colors
                      placeholder:text-text-muted/40
                      focus:border-primary/40
                      focus:ring-2
                      focus:ring-primary/10
                    "
                    placeholder="Add your notes here..."
                  />
                </div>
              ) : (
                <div
                  className="
                    min-h-[80px]
                    cursor-pointer
                    rounded-xl
                    border
                    border-border/60
                    bg-surface-muted/60
                    px-4
                    py-3.5
                    text-sm
                    leading-7
                    text-foreground/80
                    transition-all
                    duration-200
                    hover:border-border
                    hover:bg-surface-muted
                  "
                  onClick={handleStartEdit}
                >
                  {task.notes ? (
                    <p className="whitespace-pre-wrap">{task.description}</p>
                  ) : (
                    <p className="italic text-text-muted/40">No description yet. Click to add...</p>
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FileText size={15} strokeWidth={2} className="text-text-muted" />
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-text-muted">
                  Notes
                </h2>
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={6}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-border
                      bg-surface-muted
                      px-4
                      py-3
                      text-sm
                      leading-7
                      text-foreground
                      outline-none
                      transition-colors
                      placeholder:text-text-muted/40
                      focus:border-primary/40
                      focus:ring-2
                      focus:ring-primary/10
                    "
                    placeholder="Add your notes here..."
                  />
                </div>
              ) : (
                <div
                  className="
                    min-h-[80px]
                    cursor-pointer
                    rounded-xl
                    border
                    border-border/60
                    bg-surface-muted/60
                    px-4
                    py-3.5
                    text-sm
                    leading-7
                    text-foreground/80
                    transition-all
                    duration-200
                    hover:border-border
                    hover:bg-surface-muted
                  "
                  onClick={handleStartEdit}
                >
                  {task.notes ? (
                    <p className="whitespace-pre-wrap">{task.notes}</p>
                  ) : (
                    <p className="italic text-text-muted/40">No notes yet. Click to add...</p>
                  )}
                </div>
              )}
            </div>

            {/* Resources */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Link2 size={15} strokeWidth={2} className="text-text-muted" />
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-text-muted">
                  Resources
                </h2>
                {task.resourceLinks.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {task.resourceLinks.length}
                  </span>
                )}
              </div>

              {task.resourceLinks.length > 0 ? (
                <div className="space-y-2">
                  {task.resourceLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-xl
                        border
                        border-border/60
                        bg-surface-muted/40
                        px-4
                        py-3
                        transition-all
                        duration-200
                        hover:border-primary/25
                        hover:bg-primary/3
                      "
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-primary/7
                            text-primary/60
                            transition-colors
                            duration-200
                            group-hover:bg-primary/12
                            group-hover:text-primary
                          "
                        >
                          <Link2 size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground/90">
                            {extractDomain(link)}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-text-muted/50 max-w-[300px]">
                            {link}
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          shrink-0
                          flex
                          items-center
                          gap-1
                          rounded-lg
                          px-2.5
                          py-1.5
                          text-[11px]
                          font-semibold
                          text-text-muted/50
                          transition-all
                          duration-200
                          group-hover:bg-primary
                          group-hover:text-white
                          group-hover:shadow-[0_2px_12px_-2px_rgba(var(--primary-rgb),0.3)]
                        "
                      >
                        Open
                        <ExternalLink size={11} />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-border/50
                    py-10
                    text-center
                  "
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/6 text-primary/30">
                    <Sparkles size={20} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium text-text-muted/50">No resources attached</p>
                  <p className="mt-1 text-xs text-text-muted/30">Add links in edit mode</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-border sm:mx-8" />

        {/* ──────────── FOOTER ──────────── */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 sm:px-8 sm:py-5">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="
                  rounded-lg
                  border
                  border-border
                  bg-transparent
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-text-muted
                  transition-all
                  duration-200
                  hover:bg-surface-hover
                  hover:text-foreground
                "
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="
                  rounded-lg
                  bg-primary
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:opacity-90
                  hover:shadow-[0_4px_16px_-4px_rgba(var(--primary-rgb),0.4)]
                  active:scale-[0.98]
                "
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="
                  rounded-lg
                  border
                  border-border
                  bg-transparent
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-text-muted
                  transition-all
                  duration-200
                  hover:bg-surface-hover
                  hover:text-foreground
                "
              >
                Close
              </button>

              {onMarkRevision && (
                <button
                  onClick={() => onMarkRevision(task)}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-border
                    bg-transparent
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-text-muted
                    transition-all
                    duration-200
                    hover:border-amber-500/30
                    hover:bg-amber-500/5
                    hover:text-amber-500
                  "
                >
                  <RotateCcw size={14} />
                  Mark for Revision
                </button>
              )}

              {showDeleteConfirm ? (
                <>
                  <span className="text-sm text-text-muted mr-1">Sure?</span>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="
                      rounded-lg
                      border
                      border-border
                      bg-transparent
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-text-muted
                      transition-all
                      duration-200
                      hover:bg-surface-hover
                    "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-red-500
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      transition-all
                      duration-200
                      hover:bg-red-600
                      active:scale-[0.98]
                      disabled:pointer-events-none
                      disabled:opacity-50
                    "
                  >
                    <Trash2 size={14} />
                    {isDeleting ? 'Deleting…' : 'Delete'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-border
                    bg-transparent
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-text-muted
                    transition-all
                    duration-200
                    hover:border-red-500/30
                    hover:bg-red-500/5
                    hover:text-red-500
                  "
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}

              <button
                onClick={handleStartEdit}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-primary
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:opacity-90
                  hover:shadow-[0_4px_16px_-4px_rgba(var(--primary-rgb),0.4)]
                  active:scale-[0.98]
                "
              >
                <Pencil size={14} />
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
