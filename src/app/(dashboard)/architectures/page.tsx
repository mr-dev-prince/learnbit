'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Lock,
  KeyRound,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PasswordGate from '@/components/architectures/PasswordGate';
import ArchitectureCard from '@/components/architectures/ArchitectureCard';
import ChangePinModal from '@/components/architectures/ChangePinModal';
import {
  useArchitectures,
  useDeleteArchitecture,
} from '@/hooks/useArchitectures';
import { useArchitectureAuth } from '@/hooks/useArchitectureAuth';

const CATEGORIES = [
  'All Categories',
  'System Architecture',
  'Frontend Architecture',
  'Backend & APIs',
  'Full-Stack',
  'Database & Data Flow',
  'Cloud & DevOps',
  'AI & Machine Learning',
  'Learning & Experiments',
];

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PLANNED', label: 'Planned' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'BUILT', label: 'Built & Live' },
  { value: 'LEARNING', label: 'Learning' },
];

export default function ArchitecturesPage() {
  const { data: architectures = [], isLoading } = useArchitectures();
  const deleteArchitecture = useDeleteArchitecture();
  const { lock } = useArchitectureAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this architecture blueprint?')) {
      deleteArchitecture.mutate(id, {
        onSuccess: () => toast.success('Architecture blueprint deleted'),
        onError: () => toast.error('Failed to delete architecture'),
      });
    }
  };

  const handleLockVault = () => {
    lock();
    toast.success('Architecture Vault locked');
  };

  // Filtered architectures
  const filteredArchitectures = useMemo(() => {
    return architectures.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All Categories' || item.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [architectures, searchQuery, selectedCategory, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = architectures.length;
    const built = architectures.filter((a) => a.status === 'BUILT').length;
    const inProgress = architectures.filter((a) => a.status === 'IN_PROGRESS').length;
    const learningOrPlanned = architectures.filter(
      (a) => a.status === 'LEARNING' || a.status === 'PLANNED',
    ).length;
    return { total, built, inProgress, learningOrPlanned };
  }, [architectures]);

  return (
    <PasswordGate>
      <div className="space-y-6 h-full flex flex-col px-2 pb-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row w-full sm:justify-between items-start sm:items-center gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold font-sans">Architecture Hub</p>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                <Sparkles size={12} />
                Vault Protected
              </span>
            </div>
            <p className="text-sm text-text-muted">
              Design, document, and study system architectures, flowcharts, and technical blueprints.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsChangePinOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
              title="Change Password / PIN"
            >
              <KeyRound size={14} />
              <span>Change PIN</span>
            </button>

            <button
              type="button"
              onClick={handleLockVault}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
              title="Lock Vault Now"
            >
              <Lock size={14} />
              <span>Lock</span>
            </button>

            <Link
              href="/architectures/new"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Plus size={16} className="mr-1.5" />
              New Architecture
            </Link>
          </div>
        </div>

        {/* Stats Overview Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-surface border border-border shadow-xs flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-text-muted font-medium">Total Architectures</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border shadow-xs flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.built}</p>
              <p className="text-xs text-text-muted font-medium">Built & Production</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border shadow-xs flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              <p className="text-xs text-text-muted font-medium">In Active Design</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border shadow-xs flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.learningOrPlanned}</p>
              <p className="text-xs text-text-muted font-medium">Learning & Planned</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-surface border border-border rounded-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search architecture designs, tags, components..."
              className="w-full pl-9 pr-4 py-2 bg-surface-muted/50 border border-border/80 rounded-lg text-sm text-foreground placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Filter size={14} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-surface-muted/50 border border-border/80 rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-surface-muted/50 border border-border/80 rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {STATUS_FILTERS.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Architectures Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-border bg-surface p-5 space-y-4"
              >
                <div className="h-5 w-1/3 rounded-md bg-border" />
                <div className="h-36 rounded-xl bg-border/60" />
                <div className="h-4 w-2/3 rounded-md bg-border/80" />
              </div>
            ))}
          </div>
        ) : filteredArchitectures.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Layers size={32} />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-lg font-bold text-foreground">
                {searchQuery || selectedCategory !== 'All Categories' || selectedStatus !== 'ALL'
                  ? 'No architectures match your filter'
                  : 'No architectures in your vault yet'}
              </h3>
              <p className="text-xs text-text-muted">
                {searchQuery || selectedCategory !== 'All Categories' || selectedStatus !== 'ALL'
                  ? 'Try adjusting your search query or reset the category/status filters.'
                  : 'Start by crafting your first architecture blueprint or pick from our built-in production templates.'}
              </p>
            </div>
            <Link
              href="/architectures/new"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create First Architecture</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArchitectures.map((arch) => (
              <ArchitectureCard
                key={arch.id}
                architecture={arch}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <ChangePinModal
          isOpen={isChangePinOpen}
          onClose={() => setIsChangePinOpen(false)}
        />
      </div>
    </PasswordGate>
  );
}
