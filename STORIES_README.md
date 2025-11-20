# WhatsApp-Style Stories Implementation

A production-ready implementation of WhatsApp/Instagram style stories viewer with full touch controls, keyboard navigation, and accessibility features built with Next.js, React, and Tailwind CSS.

## Features

### Core Functionality
- ✅ **Segmented Progress Bar** - Visual indication of story progress with multiple segments
- ✅ **Auto-Advance** - Images auto-advance after 5s, videos play until completion
- ✅ **Image Support** - Full support for image stories with custom durations
- ✅ **Video Support** - Native video playback with progress tracking
- ✅ **Text Stories** - Styled text-only story cards
- ✅ **Preloading** - Next item preloads for smooth transitions

### User Controls
- ✅ **Tap Left/Right** - Navigate between stories
- ✅ **Hold to Pause** - Press and hold anywhere to pause (works on images and videos)
- ✅ **Keyboard Navigation** - Arrow keys for prev/next, Space to pause, Escape to close
- ✅ **Touch Gestures** - Full pointer event support for touch and mouse

### UX Polish
- ✅ **Loading Indicators** - Spinner shows while media loads
- ✅ **Pause Indicator** - Visual feedback when paused
- ✅ **User Info Display** - Avatar, username, and timestamp
- ✅ **Smooth Transitions** - Animated progress bars and state changes
- ✅ **Gradient Overlays** - Professional UI with text legibility

### Accessibility
- ✅ **Keyboard Support** - Full keyboard navigation
- ✅ **ARIA Labels** - Proper semantic markup
- ✅ **Reduced Motion** - Respects `prefers-reduced-motion`
- ✅ **Focus Management** - Clear focus indicators

### Performance
- ✅ **RequestAnimationFrame** - Smooth 60fps progress animations
- ✅ **Preloading Strategy** - Next media preloads during current playback
- ✅ **Memory Management** - Proper cleanup of timers and event listeners
- ✅ **Optimized Rendering** - Minimal re-renders with proper React patterns

## File Structure

```
app/
├── components/
│   ├── StoryViewer.tsx    # Main story viewer component
│   └── StoryCard.tsx       # Story preview card
└── stories/
    └── page.tsx            # Demo page with sample data
```

## Component API

### StoryViewer

```tsx
interface StoryViewerProps {
  story: Story;              // Story object with items
  initialIndex?: number;     // Starting item index (default: 0)
  onClose: () => void;       // Close callback
}
```

### Story Type

```tsx
type Story = {
  userId: string;
  userName: string;
  avatarUrl?: string;
  items: StoryItem[];
}

type StoryItem = {
  id: string;
  type: 'image' | 'video' | 'text';
  src?: string;              // URL for image/video
  text?: string;             // Text content
  duration?: number;         // Custom duration in ms (images only)
  timestamp?: string;        // ISO timestamp
  viewed?: boolean;          // View status
  meta?: {                   // Optional metadata
    width?: number;
    height?: number;
    mime?: string;
  };
}
```

## Usage

### Basic Example

```tsx
'use client';

import { useState } from 'react';
import StoryViewer, { Story } from './components/StoryViewer';

export default function MyPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const myStory: Story = {
    userId: '1',
    userName: 'John Doe',
    avatarUrl: '/avatar.jpg',
    items: [
      {
        id: '1',
        type: 'image',
        src: '/photo1.jpg',
        duration: 5000,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'video',
        src: '/video1.mp4',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        type: 'text',
        text: 'Hello World!',
        duration: 4000,
        timestamp: new Date().toISOString()
      }
    ]
  };

  return (
    <div>
      <button onClick={() => setSelectedStory(myStory)}>
        View Story
      </button>

      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
}
```

## Controls

### Touch/Mouse Controls
- **Tap right side** - Next story
- **Tap left side** - Previous story
- **Press and hold** - Pause playback
- **Release** - Resume playback
- **Click X button** - Close viewer

### Keyboard Controls
- **Right Arrow** - Next story
- **Left Arrow** - Previous story
- **Space** - Toggle pause/play
- **Escape** - Close viewer

## Customization

### Adjust Default Duration

```tsx
// In StoryViewer.tsx, change the default duration:
const durationRef = useRef<number>(5000); // Change to your preferred ms
```

### Custom Progress Bar Colors

```tsx
// In StoryViewer.tsx, modify the progress bar div:
<div className="h-full bg-blue-500" /> // Change bg-white to your color
```

### Custom Styling

All components use Tailwind CSS classes and can be easily customized:

```tsx
// Example: Change background color
<div className="fixed inset-0 z-50 bg-black"> // Change bg-black
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

### Timer Implementation
- Uses `requestAnimationFrame` for smooth progress updates
- Tracks elapsed time with `performance.now()` for precision
- Properly handles pause/resume without drift

### Video Handling
- Uses native HTML5 video element
- Listens to `loadedmetadata`, `timeupdate`, and `ended` events
- Preloads metadata for next video
- Supports `playsInline` for mobile

### Preloading Strategy
- Creates `Image()` objects for next image
- Creates `video` elements with `preload="metadata"` for videos
- Triggered when current item starts playing

### Memory Management
- Cancels animation frames on unmount
- Removes event listeners properly
- Clears video sources when switching items

## Performance Considerations

1. **Images** - Consider using Next.js Image component outside the viewer for thumbnails
2. **Videos** - Use CDN with proper caching headers
3. **Large Files** - Compress media before uploading
4. **Mobile** - Test on actual devices for performance

## Accessibility Features

1. **Semantic HTML** - Uses proper `role="dialog"` and `aria-modal`
2. **Keyboard Navigation** - Full keyboard support
3. **Focus Management** - Clear focus indicators
4. **Reduced Motion** - Respects user preferences
5. **Screen Readers** - Proper ARIA labels

## Future Enhancements

Potential improvements you can add:

- [ ] Swipe gestures for prev/next user stories
- [ ] Reply/reaction functionality
- [ ] View receipts tracking
- [ ] Sound toggle for videos
- [ ] Caption positioning options
- [ ] Story creation UI
- [ ] Multiple story sequences (navigate between users)
- [ ] Share functionality
- [ ] Download media option

## Demo Data

The demo includes 4 users with multiple story types:
- Mixed image/video/text stories
- Different durations
- Timestamps and captions
- Real images from your public folder

## Running the Demo

```bash
npm run dev
```

Then navigate to:
- Home page: http://localhost:3000
- Stories page: http://localhost:3000/stories

## License

MIT - Feel free to use in your projects!

## Credits

Implementation inspired by WhatsApp and Instagram Stories UX patterns.
Built with Next.js 16, React 19, and Tailwind CSS 4.
