'use client';

import { useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode } from 'lexical';

interface LexicalEditorProps {
  initialContent?: string | null;
  noteId?: string | null;
  onChange: (content: string) => void;
}

const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  heading: {
    h1: 'text-3xl font-bold mb-4 mt-6',
    h2: 'text-2xl font-bold mb-3 mt-5',
    h3: 'text-xl font-bold mb-2 mt-4',
  },
  list: {
    ul: 'list-disc list-inside mb-4',
    ol: 'list-decimal list-inside mb-4',
    listitem: 'mb-1',
  },
  quote: 'border-l-4 border-primary pl-4 italic text-foreground/80 mb-4',
};

function Placeholder() {
  return (
    <div className="absolute top-4.5 left-4.5 text-foreground/40 pointer-events-none select-none">
      Start typing your note...
    </div>
  );
}

// Update the editor content when initialContent changes from outside (e.g., selecting a new note)
function UpdateStatePlugin({
  noteId,
  initialContent,
}: {
  noteId?: string | null;
  initialContent?: string | null;
}) {
  const [editor] = useLexicalComposerContext();
  const prevNoteId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    // Only parse and set initial content when switching to a DIFFERENT note
    if (prevNoteId.current !== noteId) {
      if (initialContent) {
        try {
          const editorState = editor.parseEditorState(initialContent);
          editor.setEditorState(editorState);
        } catch (e) {
          console.error('Failed to parse initial content', e);
        }
      } else {
        editor.update(() => {
          const root = $getRoot();
          if (root) {
            root.clear();
            root.append($createParagraphNode());
          }
        });
      }
      prevNoteId.current = noteId;
    }
  }, [editor, noteId, initialContent]);

  return null;
}

export default function LexicalEditor({ initialContent, noteId, onChange }: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'LearnbitNotesEditor',
    theme,
    onError(error: Error) {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  return (
    <div className="relative h-full flex flex-col bg-transparent rounded-lg border border-border shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative flex-1 overflow-y-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="h-full min-h-[300px] w-full resize-none outline-none p-4 text-foreground text-base leading-normal" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin
            onChange={(editorState) => {
              const jsonString = JSON.stringify(editorState.toJSON());
              onChange(jsonString);
            }}
          />
          <UpdateStatePlugin noteId={noteId} initialContent={initialContent} />
        </div>
      </LexicalComposer>
    </div>
  );
}
