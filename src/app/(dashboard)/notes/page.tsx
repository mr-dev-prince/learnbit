'use client';

import React, { useState, useEffect } from 'react';
import { useNotesAndFolders, Note } from '@/hooks/useNotes';
import FolderSidebar from '@/components/notes/FolderSidebar';
import LexicalEditor from '@/components/notes/LexicalEditor';
import FolderModal from '@/components/notes/FolderModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { Trash2, Loader2 } from 'lucide-react';

export default function NotesPage() {
  const {
    folders,
    notes,
    isLoading,
    createFolder,
    createNote,
    updateNote,
    deleteNote,
    deleteFolder,
  } = useNotesAndFolders();

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [folderModal, setFolderModal] = useState<{ isOpen: boolean; parentId?: string | null }>({
    isOpen: false,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'note' | 'folder' | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  const activeNote = notes.find((n: Note) => n.id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNoteTitle(activeNote.title);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNoteTitle('');
    }
  }, [activeNoteId, activeNote?.title, activeNote]);

  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
  };

  const handleCreateFolder = (parentId?: string | null) => {
    setFolderModal({ isOpen: true, parentId });
  };

  const submitCreateFolder = (name: string, parentId?: string | null) => {
    createFolder.mutate({ name, parentId });
  };

  const handleCreateNote = (folderId?: string | null) => {
    createNote.mutate(
      { title: 'Untitled Note', content: '', folderId },
      {
        onSuccess: (newNote) => {
          setActiveNoteId(newNote.id);
        },
      },
    );
  };

  const handleDeleteFolder = (id: string) => {
    setDeleteModal({ isOpen: true, type: 'folder', id });
  };

  const handleDeleteNote = () => {
    if (activeNoteId) {
      setDeleteModal({ isOpen: true, type: 'note', id: activeNoteId });
    }
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'folder' && deleteModal.id) {
      deleteFolder.mutate(deleteModal.id, {
        onSuccess: () => {
          if (activeNote?.folderId === deleteModal.id) {
            setActiveNoteId(null);
          }
          setDeleteModal({ isOpen: false, type: null, id: null });
        },
        onError: () => {
          setDeleteModal({ isOpen: false, type: null, id: null });
        },
      });
    } else if (deleteModal.type === 'note' && deleteModal.id) {
      deleteNote.mutate(deleteModal.id, {
        onSuccess: () => {
          setActiveNoteId(null);
          setDeleteModal({ isOpen: false, type: null, id: null });
        },
        onError: () => {
          setDeleteModal({ isOpen: false, type: null, id: null });
        },
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(e.target.value);

    if (saveTimeout) clearTimeout(saveTimeout);

    const timeout = setTimeout(() => {
      if (activeNoteId) {
        updateNote.mutate({ id: activeNoteId, title: e.target.value });
      }
    }, 1000); // debounce save
    setSaveTimeout(timeout);
  };

  const handleContentChange = (content: string) => {
    if (saveTimeout) clearTimeout(saveTimeout);

    const timeout = setTimeout(() => {
      if (activeNoteId) {
        updateNote.mutate({ id: activeNoteId, content });
      }
    }, 1000); // debounce save
    setSaveTimeout(timeout);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {/* Sidebar */}
      <FolderSidebar
        folders={folders}
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        onCreateFolder={handleCreateFolder}
        onCreateNote={handleCreateNote}
        onDeleteFolder={handleDeleteFolder}
      />

      {/* Editor Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-surface">
        {activeNote ? (
          <>
            <div className="flex items-center justify-between border-b border-border bg-card-background px-6 py-4">
              <input
                type="text"
                value={noteTitle}
                onChange={handleTitleChange}
                placeholder="Note title..."
                className="flex-1 bg-transparent text-2xl font-bold text-foreground outline-none"
              />
              <div className="flex items-center gap-4">
                <span className="text-xs text-foreground/50">
                  {updateNote.isPending ? 'Saving...' : 'Saved'}
                </span>
                <button
                  onClick={handleDeleteNote}
                  className="rounded-md p-2 text-foreground/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <LexicalEditor
                initialContent={activeNote.content}
                contentId={activeNote.id}
                onChange={handleContentChange}
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-foreground/50">
            <div className="mb-4 rounded-full bg-surface-muted p-4">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/30"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground/70">No note selected</h3>
            <p className="mt-2 text-sm">Select a note from the sidebar or create a new one.</p>
            <button
              onClick={() => handleCreateNote(null)}
              className="mt-6 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              Create New Note
            </button>
          </div>
        )}
      </div>

      <FolderModal
        isOpen={folderModal.isOpen}
        onClose={() => setFolderModal({ isOpen: false })}
        onSubmit={submitCreateFolder}
        parentId={folderModal.parentId}
      />
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null, id: null })}
        onConfirm={confirmDelete}
        title={deleteModal.type === 'folder' ? 'Delete Folder' : 'Delete Note'}
        description={
          deleteModal.type === 'folder'
            ? 'Are you sure you want to delete this folder and its contents?'
            : 'Are you sure you want to delete this note?'
        }
        confirmText="Delete"
        pendingText="Deleting..."
        isPending={deleteFolder.isPending || deleteNote.isPending}
        isDestructive={true}
      />
    </div>
  );
}
