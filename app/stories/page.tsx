'use client';

import React, { useState } from 'react';
import StoryViewer, { Story } from '../components/StoryViewer';
import StoryCard from '../components/StoryCard';

// Demo data using your public folder assets
const DEMO_STORIES: Story[] = [
  {
    userId: '1',
    userName: 'Adventure Travel',
    avatarUrl: '/IMG-20230701-WA0024_kklmhl.jpg',
    items: [
      {
        id: '1-1',
        type: 'image',
        src: '/097A9715_njssfd.jpg',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 5000,
        text: 'Mountain sunrise 🌄',
        viewed: false
      },
      {
        id: '1-2',
        type: 'image',
        src: '/097A9738_piug7y.jpg',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        duration: 5000,
        text: 'Exploring new heights',
        viewed: false
      },
      {
        id: '1-3',
        type: 'text',
        text: 'Life is either a daring adventure or nothing at all. ✨',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        duration: 4000,
        viewed: false
      },
      {
        id: '1-4',
        type: 'video',
        src: '/cbb32c5f10ae474b38d45468f1fd474f_1763656167139.mp4',
        timestamp: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
        text: 'Watch this amazing view!',
        viewed: false
      }
    ]
  },
  {
    userId: '2',
    userName: 'Nature Photography',
    avatarUrl: '/097A9742_iushbw.jpg',
    items: [
      {
        id: '2-1',
        type: 'image',
        src: '/097A9770_tfnzkl.jpg',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        duration: 6000,
        text: 'Golden hour magic ✨',
        viewed: false
      },
      {
        id: '2-2',
        type: 'image',
        src: '/DER_2765_pmkkcf_kjnqhi.jpg',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        duration: 5000,
        text: 'Nature never goes out of style',
        viewed: false
      },
      {
        id: '2-3',
        type: 'text',
        text: 'In every walk with nature, one receives far more than he seeks. 🌿',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 5000,
        viewed: false
      }
    ]
  },
  {
    userId: '3',
    userName: 'Travel Diaries',
    avatarUrl: '/IMG_8280_xhizs5.jpg',
    items: [
      {
        id: '3-1',
        type: 'image',
        src: '/IMG_8327_oklwfn.jpg',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        duration: 5000,
        text: 'New destinations await',
        viewed: false
      },
      {
        id: '3-2',
        type: 'text',
        text: 'The journey of a thousand miles begins with a single step. 👣',
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        duration: 4500,
        viewed: false
      },
      {
        id: '3-3',
        type: 'image',
        src: '/097A9742_iushbw.jpg',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        duration: 5000,
        text: 'Memories made here',
        viewed: false
      }
    ]
  },
  {
    userId: '4',
    userName: 'Urban Explorer',
    avatarUrl: '/IMG_8280_xhizs5 (1).jpg',
    items: [
      {
        id: '4-1',
        type: 'text',
        text: 'Every city has a story to tell... Are you listening? 🏙️',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        duration: 4000,
        viewed: false
      },
      {
        id: '4-2',
        type: 'image',
        src: '/IMG_8327_oklwfn (1).jpg',
        timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
        duration: 5000,
        text: 'City lights and late nights',
        viewed: false
      }
    ]
  }
];

export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>(DEMO_STORIES);

  const handleStoryClose = () => {
    setSelectedStory(null);
  };

  const handleStoryOpen = (story: Story) => {
    setSelectedStory(story);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Stories
          </h1>
          <p className="text-gray-400 mt-2">
            Tap to view • Hold to pause • Swipe for more
          </p>
        </div>
      </header>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {stories.map((story) => (
            <StoryCard
              key={story.userId}
              story={story}
              onClick={() => handleStoryOpen(story)}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">How to Use</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-4xl mb-3">👆</div>
              <h3 className="font-semibold mb-2">Tap Controls</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Tap right → Next story</li>
                <li>• Tap left → Previous story</li>
                <li>• Tap X → Close viewer</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-4xl mb-3">⏸️</div>
              <h3 className="font-semibold mb-2">Hold to Pause</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Press and hold anywhere</li>
                <li>• Works for images & videos</li>
                <li>• Release to resume</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-4xl mb-3">⌨️</div>
              <h3 className="font-semibold mb-2">Keyboard</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Arrow keys → Navigate</li>
                <li>• Space → Pause/Resume</li>
                <li>• Escape → Close</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Auto-advance timer</li>
                <li>• Progress segments</li>
                <li>• Smooth transitions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          initialIndex={0}
          onClose={handleStoryClose}
        />
      )}
    </main>
  );
}
