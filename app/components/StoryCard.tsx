'use client';

import React from 'react';
import { Story } from './StoryViewer';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

/**
 * Story preview card for the grid/list view
 * Shows thumbnail and user info
 */
export default function StoryCard({ story, onClick }: StoryCardProps) {
  const firstItem = story.items[0];
  const hasUnviewed = story.items.some(item => !item.viewed);

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-gray-900 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
      aria-label={`View ${story.userName}'s story`}
    >
      {/* Thumbnail */}
      <div className="aspect-[9/16] relative overflow-hidden bg-gray-800">
        {firstItem.type === 'image' && firstItem.src && (
          <img
            src={firstItem.src}
            alt={story.userName}
            className="w-full h-full object-cover"
          />
        )}
        {firstItem.type === 'video' && firstItem.src && (
          <video
            src={firstItem.src}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        )}
        {firstItem.type === 'text' && (
          <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-blue-600">
            <div className="text-white text-lg font-semibold text-center line-clamp-4">
              {firstItem.text}
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        {/* Unviewed indicator ring */}
        {hasUnviewed && (
          <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl pointer-events-none" />
        )}
      </div>

      {/* User info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-2">
          {story.avatarUrl && (
            <img
              src={story.avatarUrl}
              alt={story.userName}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/80"
            />
          )}
          <div className="flex-1 text-left">
            <div className="text-white text-sm font-semibold drop-shadow-lg">
              {story.userName}
            </div>
            <div className="text-white/80 text-xs">
              {story.items.length} {story.items.length === 1 ? 'story' : 'stories'}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
