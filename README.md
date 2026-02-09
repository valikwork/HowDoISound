# How Do I Sound? (HDIS)

A modern web application for recording, managing, and storing your audio recordings with real-time waveform visualization. Perfect for testing your microphone before online meetings!

## Features

✨ **Audio Recording**

- High-quality audio recording with customizable device selection
- Pause and resume recording capabilities
- Real-time duration tracking with visual timer
- Large circular record button for easy access
- Maximum recording duration: 60 seconds
- Animated phrase suggestions (common online meeting phrases)
- Custom confirmation dialogs for cancel/discard actions

🎨 **Real-Time Waveform Visualization**

- Live audio frequency visualization during recording
- Animated bars that respond to microphone input
- Visual feedback to confirm your microphone is working
- Customizable visualizer with configurable bars and colors

💾 **Storage & Management**

- **Local Storage**: IndexedDB for offline recording management
- **Cloud Storage**: Supabase integration for cloud backup and sync
- Shared state management via Context API
- Real-time updates across components
- Recording metadata including title, duration, timestamps, and file size
- Inline title editing for recordings
- Download recordings as .webm files

🎵 **Playback**

- Built-in audio player with controls
- Modal playback view for focused listening
- Visual feedback during playback

🎭 **UI/UX Features**

- Dark mode support
- Responsive design for all screen sizes
- Custom modal system for confirmations
- Semi-transparent backdrop for modals
- Smooth fade transitions for phrases
- Loading and error states
- Empty state illustrations

🔐 **Authentication**

- User authentication system (ready for Supabase)
- Secure login and signup flows
- Protected routes for authenticated users

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4
- **State Management**: React Context API
- **Storage**: IndexedDB (local), Supabase (cloud)
- **Audio**: Web Audio API, MediaRecorder API, AnalyserNode

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hdis
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3003](http://localhost:3003) in your browser.

## Project Structure

```
hdis/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes
│   │   ├── login/        # Login page
│   │   └── signup/       # Signup page
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── cloud/            # Cloud storage components
│   └── ui/               # Reusable UI components
│       ├── Button.tsx    # Custom button component
│       ├── Card.tsx      # Card container
│       └── Modal.tsx     # Reusable modal
├── contexts/             # React Context providers
│   ├── ModalContext.tsx     # Global modal management
│   └── RecordingsContext.tsx # Shared recordings state
├── hooks/                # Custom React hooks
│   ├── useAudioRecorder.ts   # Recording logic
│   ├── useAudioVisualizer.ts # Waveform visualization
│   ├── useDevices.ts         # Device enumeration
│   └── useIndexedDB.ts       # IndexedDB operations
├── lib/                  # Utility libraries
│   ├── audio/           # Audio processing utilities
│   ├── storage/         # Storage utilities (IndexedDB)
│   ├── supabase/        # Supabase client & middleware
│   └── utils/           # Helper functions
│       ├── constants.ts      # App configuration
│       ├── formatters.ts     # Format helpers
│       ├── meetingPhrases.ts # Phrase suggestions
│       └── validators.ts     # Input validation
└── types/               # TypeScript type definitions

// Waveform visualizer settings
export const VISUALIZER_CONFIG = {
  barWidth: 3,
  barGap: 1,
  barColor: "rgb(59, 130, 246)",
  backgroundColor: "rgb(243, 244, 246)",
};
```

### Meeting Phrases

Customize the rotating phrases in `lib/utils/meetingPhrases.ts`:

```typescript
export const MEETING_PHRASES = [
  "Hey everyone, can you hear me okay?...",
  "Hello, good morning! I'm not sure if my microphone is working...",
  // Add your own phrases
];
```

## Context Providers

### ModalContext

Provides a global modal system with callback-based confirmations:

```tsx
const { showModal } = useModal();

showModal({
  title: "Delete Recording",
  message: "Are you sure?",
  confirmText: "Yes, Delete",
  variant: "danger",
  onConfirm: () => {
    // Handle confirmation
  },
});
```

### RecordingsContext

Manages shared recordings state across components, ensuring real-time updates when recordings are added, deleted, or modified. ├── audio.ts # Audio-related types
├── recording.ts # Recording types
└── database.types.ts # Supabase generated types

````

## Key Components

### AudioRecorder
Main recording interface with:
- Device selector dropdown
- Animated phrase suggestions (cycles every 15 seconds)
- Large circula (AnalyserNode for visualization)
- MediaRecorder API
- MediaDevices.getUserMedia()
- IndexedDB
- ES6+ JavaScript features

Recommended browsers: Chrome 88+, Edge 88+, Firefox 90+, Safari 14.1+

## Development Tips

- The app runs on port 3003 by default
- Hot reload is enabled for fast development
- Use React DevTools to inspect Context state
- Check browser console for audio device permissions

## License

MIT Licensea (date, duration, file size)
- Modal playback view

### WaveformVisualizer
Real-time audio visualization using Web Audio API's AnalyserNode to display frequency data as animated bars.

## Configuration

Audio recording settings can be customized in `lib/utils/constants.ts`:

```typescript
export const AUDIO_CONFIG = {
  mimeType: "audio/webm;codecs=opus",
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

export const MAX_RECORDING_DURATION = 60; // seconds
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
````

## Scripts

- `npm run dev` - Start development server on port 3003
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

This app requires a modern browser with support for:

- Web Audio API
- MediaRecorder API
- IndexedDB
- ES6+ JavaScript features

Recommended browsers: Chrome, Edge, Firefox, Safari (latest versions)

## License

[Your License Here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
