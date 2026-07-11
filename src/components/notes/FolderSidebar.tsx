import React, { useState } from 'react';
import {
  Folder as FolderIcon,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
} from 'lucide-react';
import type { Folder, Note } from '@/hooks/useNotes';

interface FolderSidebarProps {
  folders: Folder[];
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateFolder: (parentId?: string | null) => void;
  onCreateNote: (folderId?: string | null) => void;
  onDeleteFolder: (id: string) => void;
}

export default function FolderSidebar({
  folders,
  notes,
  activeNoteId,
  onSelectNote,
  onCreateFolder,
  onCreateNote,
  onDeleteFolder,
}: FolderSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (id: string) => {
    const next = new Set(expandedFolders);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedFolders(next);
  };

  const rootFolders = folders.filter((f) => !f.parentId);
  const rootNotes = notes.filter((n) => !n.folderId);

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const subfolders = folders.filter((f) => f.parentId === folder.id);
    const folderNotes = notes.filter((n) => n.folderId === folder.id);

    return (
      <div key={folder.id} className="flex flex-col">
        <div
          className="group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-surface transition-colors cursor-pointer"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => toggleFolder(folder.id)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {isExpanded ? (
              <ChevronDown size={14} className="shrink-0 text-foreground/50" />
            ) : (
              <ChevronRight size={14} className="shrink-0 text-foreground/50" />
            )}
            <FolderIcon size={16} className="shrink-0 text-primary" />
            <span className="truncate text-sm font-medium text-foreground">{folder.name}</span>
          </div>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateFolder(folder.id);
              }}
              className="p-1 text-foreground/50 hover:text-foreground"
              title="New Subfolder"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateNote(folder.id);
              }}
              className="p-1 text-foreground/50 hover:text-foreground"
              title="New Note"
            >
              <FileText size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFolder(folder.id);
              }}
              className="p-1 text-foreground/50 hover:text-red-500"
              title="Delete Folder"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="flex flex-col">
            {subfolders.map((sf) => renderFolder(sf, level + 1))}
            {folderNotes.map((note) => (
              <div
                key={note.id}
                className={`group flex items-center gap-2 rounded-md py-1.5 cursor-pointer transition-colors ${
                  activeNoteId === note.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-surface text-foreground/80'
                }`}
                style={{ paddingLeft: `${(level + 1) * 12 + 28}px`, paddingRight: '8px' }}
                onClick={() => onSelectNote(note.id)}
              >
                <FileText size={14} className="shrink-0" />
                <span className="truncate text-sm">{note.title || 'Untitled Note'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card-background w-64 shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">My Notes</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCreateFolder(null)}
            className="rounded p-1 text-foreground/60 hover:bg-surface hover:text-foreground transition-colors"
            title="New Folder"
          >
            <FolderIcon size={16} />
          </button>
          <button
            onClick={() => onCreateNote(null)}
            className="rounded p-1 text-foreground/60 hover:bg-surface hover:text-foreground transition-colors"
            title="New Note"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col space-y-0.5">
          {rootFolders.map((f) => renderFolder(f, 0))}
          {rootNotes.map((note) => (
            <div
              key={note.id}
              className={`group flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
                activeNoteId === note.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-surface text-foreground/80'
              }`}
              onClick={() => onSelectNote(note.id)}
            >
              <FileText size={16} className="shrink-0" />
              <span className="truncate text-sm font-medium">{note.title || 'Untitled Note'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
