# How Do I Sound? (HDIS)

A modern web application for recording, managing, and storing your audio recordings with real-time waveform visualization.

## Features

✨ **Audio Recording**

- High-quality audio recording with customizable device selection
- Pause and resume recording capabilities
- Real-time duration tracking
- Maximum recording duration: 60 seconds

🎨 **Waveform Visualization**

- Live audio visualization during recording
- Playback waveform for saved recordings
- Customizable visualizer with configurable bars and colors

💾 **Storage Options**

- **Local Storage**: IndexedDB for offline recording management
- **Cloud Storage**: Supabase integration for cloud backup and sync
- Recording metadata including title, duration, and timestamps

🎵 **Playback**

- Built-in audio player with controls
- Playback speed control
- Visual feedback during playback

🔐 **Authentication**

- User authentication system
- Secure login and signup
- Protected routes for authenticated users

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI**: React 19, TypeScript, Tailwind CSS 4
- **Storage**: IndexedDB (local), Supabase (cloud)
- **Audio**: Web Audio API, MediaRecorder API

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
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── cloud/            # Cloud storage components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── audio/           # Audio processing utilities
│   ├── storage/         # Storage utilities (IndexedDB)
│   ├── supabase/        # Supabase client & middleware
│   └── utils/           # Helper functions
└── types/               # TypeScript type definitions
```

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
```

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
