'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Download,
  AlertTriangle,
  LocateFixed,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '@/components/providers/ThemeProvider';

interface DiagramViewerProps {
  chart: string;
  className?: string;
  allowZoom?: boolean;
  minHeight?: string;
  showControls?: boolean;
}

export default function DiagramViewer({
  chart,
  className = '',
  allowZoom = true,
  minHeight = '320px',
  showControls = true,
}: DiagramViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { theme } = useTheme();

  const centerDiagram = useCallback((smooth = true) => {
    if (viewportRef.current) {
      const el = viewportRef.current;
      const targetLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
      const targetTop = Math.max(0, (el.scrollHeight - el.clientHeight) / 2);
      el.scrollTo({
        left: targetLeft,
        top: targetTop,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  const renderChart = useCallback(async () => {
    if (!chart || !chart.trim()) {
      setSvgHtml('');
      setError(null);
      return;
    }

    const uniqueId = `arch_render_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const mermaid = (await import('mermaid')).default;
      const isDark = theme === 'dark';

      mermaid.initialize({
        startOnLoad: false,
        suppressErrorRendering: true,
        theme: isDark ? 'dark' : 'neutral',
        themeVariables: {
          darkMode: isDark,
          background: isDark ? '#1e293b' : '#ffffff',
          primaryColor: '#f64900',
          primaryTextColor: isDark ? '#f8fafc' : '#0f172a',
          primaryBorderColor: '#f64900',
          lineColor: isDark ? '#94a3b8' : '#64748b',
          secondaryColor: '#10b981',
          tertiaryColor: '#f59e0b',
          fontSize: '14px',
          fontFamily: 'inherit',
        },
        securityLevel: 'loose',
      });

      const { svg } = await mermaid.render(uniqueId, chart.trim());
      setSvgHtml(svg);
      setError(null);

      // Auto-center the scroll view after paint
      setTimeout(() => {
        centerDiagram(false);
      }, 60);
    } catch (err: unknown) {
      setSvgHtml('');

      if (typeof document !== 'undefined') {
        const errorEl =
          document.getElementById(`d${uniqueId}`) || document.getElementById(uniqueId);
        errorEl?.remove();
      }

      const rawMsg = err instanceof Error ? err.message : String(err);
      const cleanMsg = rawMsg.includes('Parse error on line')
        ? rawMsg.split('\n').slice(0, 3).join('\n')
        : rawMsg;

      setError(cleanMsg || 'Invalid diagram syntax. Please check your Mermaid diagram code.');
    }
  }, [chart, theme, centerDiagram]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    renderChart();
  }, [renderChart]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.4));
  };

  const handleResetZoom = () => {
    setScale(1);
    centerDiagram(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      toast.success('Mermaid code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleExportSvg = () => {
    if (!svgHtml) return;
    const blob = new Blob([svgHtml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecture-diagram-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('SVG diagram exported');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-surface border border-border rounded-2xl overflow-hidden shadow-xs transition-all ${
        isFullscreen ? 'p-6 bg-surface z-50' : ''
      } ${className}`}
      style={{ minHeight: isFullscreen ? '100vh' : minHeight }}
    >
      {/* Top Floating Controls */}
      {showControls && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1 bg-surface/90 border border-border/80 backdrop-blur-md rounded-xl shadow-md">
          {allowZoom && (
            <>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors text-xs font-mono cursor-pointer flex items-center gap-1"
                title="Reset Zoom & Return to Center"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => centerDiagram(true)}
                className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors text-xs cursor-pointer flex items-center gap-1"
                title="Center Diagram"
              >
                <LocateFixed size={14} />
              </button>
              <div className="h-4 w-px bg-border my-auto mx-0.5" />
            </>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
            title="Copy Mermaid Code"
          >
            {copied ? <Check size={15} className="text-secondary" /> : <Copy size={15} />}
          </button>

          <button
            type="button"
            onClick={handleExportSvg}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
            title="Export as SVG"
          >
            <Download size={15} />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      )}

      {/* Diagram Canvas with generous padding on all sides & thin sleek scrollbars */}
      <div
        ref={viewportRef}
        className="flex-1 overflow-auto min-h-0 relative bg-surface-muted/15 scrollbar-thin [scrollbar-color:rgba(148,163,184,0.35)_transparent] dark:[scrollbar-color:rgba(71,85,105,0.45)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-text-subtle"
      >
        {error ? (
          <div className="min-w-full min-h-full flex items-center justify-center p-8">
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center max-w-md bg-surface border border-border rounded-xl shadow-xs">
              <div className="p-2.5 rounded-full bg-red-500/10 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Diagram Syntax Error</h4>
              <p className="text-xs text-text-muted font-mono bg-surface-muted/70 p-3 rounded-lg border border-border text-left w-full overflow-x-auto whitespace-pre-wrap">
                {error}
              </p>
            </div>
          </div>
        ) : !chart || !chart.trim() ? (
          <div className="min-w-full min-h-full flex items-center justify-center p-8 text-text-subtle text-sm">
            <span>No diagram defined yet.</span>
          </div>
        ) : (
          <div className="min-w-fit min-h-full m-auto p-16 sm:p-24 md:p-32 flex items-center justify-center">
            <div
              className="transition-transform duration-100 flex items-center justify-center"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          </div>
        )}
      </div>

      {/* Floating Status Indicator */}
      {allowZoom && (
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
          {scale !== 1 && (
            <div className="px-2.5 py-1 rounded-lg bg-surface/90 border border-border/80 backdrop-blur-md text-[11px] font-mono text-text-muted shadow-xs">
              {Math.round(scale * 100)}%
            </div>
          )}
          <button
            onClick={() => centerDiagram(true)}
            className="px-2.5 py-1 rounded-lg bg-surface/90 border border-border/80 backdrop-blur-md text-[11px] text-text-muted hover:text-foreground shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Return to Center"
          >
            <LocateFixed size={12} className="text-primary" />
            <span>Return to Center</span>
          </button>
        </div>
      )}
    </div>
  );
}
