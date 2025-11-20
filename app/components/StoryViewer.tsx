'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export type StoryItem = {
  id: string;
  type: 'image' | 'video' | 'text';
  src?: string;
  text?: string;
  duration?: number;
  timestamp?: string;
  viewed?: boolean;
  meta?: { width?: number; height?: number; mime?: string };
};

export type Story = {
  userId: string;
  userName: string;
  avatarUrl?: string;
  items: StoryItem[];
};

interface StoryViewerProps {
  story: Story;
  initialIndex?: number;
  onClose: () => void;
}

/**
 * WhatsApp-style story viewer with full controls:
 * - Segmented progress bar
 * - Tap left/right for prev/next
 * - Hold to pause
 * - Keyboard controls (arrows, space, escape)
 * - Video and image support
 * - Preloading
 * - Accessibility features
 */
export default function StoryViewer({ story, initialIndex = 0, onClose }: StoryViewerProps) {
  const items = story.items;
  const [index, setIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const durationRef = useRef<number>(5000);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoldingRef = useRef(false);

  const current = items[index] || items[0];

  // Preload next item for smooth transitions
  const preloadNext = useCallback((idx: number) => {
    const next = items[idx + 1];
    if (!next) return;

    if (next.type === 'image') {
      const img = new Image();
      img.src = next.src!;
    } else if (next.type === 'video') {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.src = next.src!;
    }
  }, [items]);

  // Advance to next or previous item
  const advance = useCallback((delta: number) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    if (delta > 0) {
      if (index < items.length - 1) {
        setIndex(i => i + 1);
      } else {
        onClose?.();
      }
    } else if (delta < 0) {
      if (index > 0) {
        setIndex(i => i - 1);
      } else {
        // Restart current item when at first
        setIndex(0);
        setProgress(0);
        elapsedRef.current = 0;
        startRef.current = performance.now();
      }
    }
  }, [index, items.length, onClose]);

  // Animation loop for images/text
  const startLoop = useCallback(() => {
    const tick = (t: number) => {
      if (isPaused) {
        startRef.current = t - elapsedRef.current;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      elapsedRef.current = t - startRef.current;
      const dur = Math.max(1, durationRef.current);
      const p = Math.min(1, elapsedRef.current / dur);
      setProgress(p);

      if (p >= 1) {
        advance(1);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [isPaused, advance]);

  // Start current item
  const startItem = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    setProgress(0);
    elapsedRef.current = 0;
    startRef.current = performance.now();
    setLoaded(false);

    if (current.type === 'image' || current.type === 'text') {
      durationRef.current = current.duration ?? 5000;

      if (current.type === 'image') {
        const img = new Image();
        img.onload = () => {
          setLoaded(true);
          startLoop();
          preloadNext(index);
        };
        img.onerror = () => {
          setLoaded(true);
          startLoop();
        };
        img.src = current.src!;
      } else {
        // Text
        setLoaded(true);
        startLoop();
        preloadNext(index);
      }
    } else if (current.type === 'video') {
      durationRef.current = 0;
      setLoaded(false);
    }
  }, [current, index, preloadNext, startLoop]);

  // Handle video events
  useEffect(() => {
    const v = videoRef.current;
    if (!v || current.type !== 'video') return;

    const onLoadedMeta = () => {
      setLoaded(true);
      if (!isPaused) {
        v.currentTime = elapsedRef.current / 1000;
        v.play().catch((err) => {
          console.log('Video play failed:', err);
        });
      }
    };

    const onTimeUpdate = () => {
      const dur = v.duration || 1;
      setProgress(Math.min(1, v.currentTime / dur));
    };

    const onEnded = () => {
      advance(1);
    };

    const onError = () => {
      console.error('Video load error');
      setLoaded(true);
      // Skip to next on error
      setTimeout(() => advance(1), 500);
    };

    v.addEventListener('loadedmetadata', onLoadedMeta);
    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('ended', onEnded);
    v.addEventListener('error', onError);

    // Trigger load if src is already set
    if (v.src && v.readyState >= 1) {
      setLoaded(true);
      v.play().catch((err) => console.log('Auto-play failed:', err));
    }

    return () => {
      v.removeEventListener('loadedmetadata', onLoadedMeta);
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('error', onError);
    };
  }, [advance, isPaused, current.type]);

  // Start item when index changes
  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
    startRef.current = performance.now();

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {
        // Ignore
      }
      videoRef.current.src = '';
    }

    startItem();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [index, startItem]);

  // Pause handler
  const handlePointerDown = () => {
    isHoldingRef.current = true;
    setIsPaused(true);

    if (videoRef.current && !videoRef.current.paused) {
      try {
        videoRef.current.pause();
      } catch (e) {
        // Ignore
      }
    }
  };

  // Resume handler
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isHoldingRef.current) return;

    isHoldingRef.current = false;
    setIsPaused(false);

    if (videoRef.current && videoRef.current.paused && current.type === 'video') {
      try {
        videoRef.current.play().catch(() => {});
      } catch (e) {
        // Ignore
      }
    }
  };

  // Tap handler for prev/next
  const handleTap = (clientX: number) => {
    if (isHoldingRef.current) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = clientX - rect.left;
    if (x > rect.width / 2) {
      advance(1);
    } else {
      advance(-1);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        advance(1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        advance(-1);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(p => !p);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, onClose]);

  // Respect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      durationRef.current = 1e9;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Story viewer"
    >
      {/* Top bar with user info */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          {story.avatarUrl && (
            <img
              src={story.avatarUrl}
              alt={story.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
          )}
          <div className="flex-1">
            <div className="text-white text-sm font-semibold">{story.userName}</div>
            {current.timestamp && (
              <div className="text-white/70 text-xs">
                {new Date(current.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/90 hover:text-white text-2xl leading-none px-2 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Progress bar segments */}
        <div className="flex gap-1">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all"
                style={{
                  width: idx < index ? '100%' : idx === index ? `${progress * 100}%` : '0%',
                  transition: idx === index ? 'none' : 'width 300ms ease-out'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div
        className="relative w-full h-full flex items-center justify-center select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          isHoldingRef.current = false;
          setIsPaused(false);
        }}
        onClick={(e) => handleTap(e.clientX)}
      >
        <div className="w-full h-full flex items-center justify-center max-w-3xl max-h-screen">
          {current.type === 'image' && (
            <img
              src={current.src}
              alt={current.text ?? `Story ${current.id}`}
              className="max-w-full max-h-full object-contain"
              style={{
                filter: isPaused ? 'brightness(0.85)' : 'none',
                transition: 'filter 200ms'
              }}
            />
          )}

          {current.type === 'video' && (
            <video
              ref={videoRef}
              src={current.src}
              className="max-w-full max-h-full object-contain"
              playsInline
              autoPlay
              controls={false}
              muted={false}
              preload="auto"
              style={{ outline: 'none' }}
            />
          )}

          {current.type === 'text' && (
            <div className="px-8 py-12 text-center max-w-2xl">
              <div className="text-white text-3xl md:text-5xl font-bold leading-tight">
                {current.text}
              </div>
            </div>
          )}
        </div>

        {/* Pause indicator */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-6 backdrop-blur-sm">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
            </div>
          </div>
        )}

        {/* Left tap zone (invisible) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            advance(-1);
          }}
        />

        {/* Right tap zone (invisible) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            advance(1);
          }}
        />
      </div>

      {/* Bottom caption area */}
      {current.text && current.type !== 'text' && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="text-white text-center text-sm md:text-base">
            {current.text}
          </div>
        </div>
      )}
    </div>
  );
}
