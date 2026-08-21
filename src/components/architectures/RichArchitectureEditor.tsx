'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
  ListNode,
  ListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { CodeNode, CodeHighlightNode, $createCodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  FileCode,
  Info,
} from 'lucide-react';

interface RichArchitectureEditorProps {
  initialContent?: string | null;
  contentId?: string | null;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  minHeight?: string;
}

const theme = {
  paragraph: 'mb-3 text-base leading-relaxed text-foreground/90',
  text: {
    bold: 'font-bold text-foreground',
    italic: 'italic',
    underline: 'underline decoration-primary/60 underline-offset-4',
    strikethrough: 'line-through opacity-70',
    code: 'px-1.5 py-0.5 rounded-md bg-surface-muted border border-border font-mono text-xs text-primary font-semibold',
  },
  heading: {
    h1: 'text-2xl font-bold mb-3 mt-5 text-foreground tracking-tight border-b border-border pb-1.5',
    h2: 'text-xl font-bold mb-2.5 mt-4 text-foreground tracking-tight',
    h3: 'text-lg font-semibold mb-2 mt-3 text-foreground',
  },
  list: {
    ul: 'list-disc list-outside pl-6 mb-3 space-y-1 text-foreground/90',
    ol: 'list-decimal list-outside pl-6 mb-3 space-y-1 text-foreground/90',
    listitem: 'pl-1 leading-relaxed',
  },
  quote: 'border-l-4 border-primary/80 bg-primary/5 pl-4 py-2 my-3 rounded-r-lg italic text-foreground/85',
  code: 'bg-surface-muted/90 border border-border rounded-xl p-4 my-3 font-mono text-xs text-foreground overflow-x-auto block leading-relaxed',
};

function Placeholder({ readOnly }: { readOnly: boolean }) {
  if (readOnly) return null;
  return (
    <div className="absolute top-4 left-4 text-text-subtle pointer-events-none select-none text-sm">
      Write technical specifications, architectural decisions, components, and notes...
    </div>
  );
}

// Toolbar Component
function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        const type = element.getType();
        if (type === 'heading') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tag = (element as any).getTag();
          setBlockType(tag);
        } else {
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        setCanUndo(payload);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        setCanRedo(payload);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  const formatHeading = (level: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(level));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const formatBulletList = () => {
    if (blockType === 'ul') {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType === 'ol') {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const insertCallout = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quote = $createQuoteNode();
        quote.append($createTextNode('💡 NOTE: '));
        $setBlocksType(selection, () => quote);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-muted/60 border-b border-border text-xs">
      {/* Block Formats */}
      <div className="flex items-center gap-0.5 bg-surface border border-border/80 rounded-lg p-0.5">
        <button
          type="button"
          onClick={formatParagraph}
          className={`p-1.5 rounded-md transition-colors ${
            blockType === 'paragraph'
              ? 'bg-primary/15 text-primary font-semibold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Normal Text"
        >
          <Pilcrow size={14} />
        </button>
        <button
          type="button"
          onClick={() => formatHeading('h1')}
          className={`p-1.5 rounded-md transition-colors ${
            blockType === 'h1'
              ? 'bg-primary/15 text-primary font-semibold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Heading 1"
        >
          <Heading1 size={14} />
        </button>
        <button
          type="button"
          onClick={() => formatHeading('h2')}
          className={`p-1.5 rounded-md transition-colors ${
            blockType === 'h2'
              ? 'bg-primary/15 text-primary font-semibold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => formatHeading('h3')}
          className={`p-1.5 rounded-md transition-colors ${
            blockType === 'h3'
              ? 'bg-primary/15 text-primary font-semibold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </button>
      </div>

      <div className="h-4 w-px bg-border my-auto mx-0.5" />

      {/* Inline Styles */}
      <div className="flex items-center gap-0.5 bg-surface border border-border/80 rounded-lg p-0.5">
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          className={`p-1.5 rounded-md transition-colors ${
            isBold
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          className={`p-1.5 rounded-md transition-colors ${
            isItalic
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          className={`p-1.5 rounded-md transition-colors ${
            isUnderline
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          className={`p-1.5 rounded-md transition-colors ${
            isStrikethrough
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          className={`p-1.5 rounded-md transition-colors ${
            isCode
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Inline Code"
        >
          <Code size={14} />
        </button>
      </div>

      <div className="h-4 w-px bg-border my-auto mx-0.5" />

      {/* Lists & Blocks */}
      <div className="flex items-center gap-0.5 bg-surface border border-border/80 rounded-lg p-0.5">
        <button
          type="button"
          onClick={formatBulletList}
          className={`p-1.5 rounded-md transition-colors ${
            blockType === 'ul'
              ? 'bg-primary/15 text-primary'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Bullet Points"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={formatNumberedList}
          className={`p-1.5 rounded-md transition-colors ${
            blockType === 'ol'
              ? 'bg-primary/15 text-primary'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          onClick={formatQuote}
          className={`p-1.5 rounded-md transition-colors ${
            blockType === 'quote'
              ? 'bg-primary/15 text-primary'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Quote / Callout Block"
        >
          <Quote size={14} />
        </button>
        <button
          type="button"
          onClick={formatCodeBlock}
          className={`p-1.5 rounded-md transition-colors ${
            blockType === 'code'
              ? 'bg-primary/15 text-primary'
              : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Code Block"
        >
          <FileCode size={14} />
        </button>
        <button
          type="button"
          onClick={insertCallout}
          className="p-1.5 rounded-md text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          title="Insert Note / Tip"
        >
          <Info size={14} />
        </button>
      </div>

      <div className="h-4 w-px bg-border my-auto mx-0.5 hidden sm:block" />

      {/* History */}
      <div className="flex items-center gap-0.5 bg-surface border border-border/80 rounded-lg p-0.5 ml-auto sm:ml-0">
        <button
          type="button"
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className={`p-1.5 rounded-md transition-colors ${
            canUndo
              ? 'text-text-muted hover:text-foreground hover:bg-surface-hover'
              : 'text-text-subtle/40 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={14} />
        </button>
        <button
          type="button"
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className={`p-1.5 rounded-md transition-colors ${
            canRedo
              ? 'text-text-muted hover:text-foreground hover:bg-surface-hover'
              : 'text-text-subtle/40 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={14} />
        </button>
      </div>
    </div>
  );
}

function UpdateContentPlugin({
  contentId,
  initialContent,
}: {
  contentId?: string | null;
  initialContent?: string | null;
}) {
  const [editor] = useLexicalComposerContext();
  const prevContentId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (prevContentId.current !== contentId) {
      if (initialContent) {
        try {
          const editorState = editor.parseEditorState(initialContent);
          editor.setEditorState(editorState);
        } catch {
          // Fallback plain text or markdown conversion
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            const lines = initialContent.split('\n');
            lines.forEach((line) => {
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(line));
              root.append(paragraph);
            });
          });
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
      prevContentId.current = contentId;
    }
  }, [editor, contentId, initialContent]);

  return null;
}

export default function RichArchitectureEditor({
  initialContent,
  contentId,
  onChange,
  readOnly = false,
  minHeight = '300px',
}: RichArchitectureEditorProps) {
  const initialConfig = {
    namespace: 'ArchitectureRichEditor',
    theme,
    editable: !readOnly,
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
    <div
      className={`relative flex flex-col bg-surface border border-border rounded-xl shadow-xs overflow-hidden transition-all ${
        readOnly ? '' : 'focus-within:ring-2 focus-within:ring-primary/20'
      }`}
    >
      <LexicalComposer initialConfig={initialConfig}>
        {!readOnly && <EditorToolbar />}
        <div className="relative flex-1 overflow-y-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="w-full resize-none outline-none text-foreground text-sm leading-relaxed p-4"
                style={{ minHeight }}
              />
            }
            placeholder={<Placeholder readOnly={readOnly} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          {!readOnly && <HistoryPlugin />}
          {!readOnly && <ListPlugin />}
          {!readOnly && <MarkdownShortcutPlugin transformers={TRANSFORMERS} />}
          {!readOnly && onChange && (
            <OnChangePlugin
              onChange={(editorState) => {
                const jsonString = JSON.stringify(editorState.toJSON());
                onChange(jsonString);
              }}
            />
          )}
          <UpdateContentPlugin contentId={contentId} initialContent={initialContent} />
        </div>
      </LexicalComposer>
    </div>
  );
}
