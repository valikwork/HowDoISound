import AudioRecorder from "@/components/AudioRecorder";
import RecordingsList from "@/components/RecordingsList";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              How Do I Sound?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Record, store, and manage your audio recordings directly in your
              browser
            </p>
          </div>

          {/* Recorder */}
          <div className="mb-8">
            <AudioRecorder />
          </div>

          {/* Recordings List */}
          <RecordingsList />

          {/* Privacy Notice */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Privacy First
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your recordings never leave your device. Everything is stored
              locally in your browser using IndexedDB. No server uploads, no
              data collection, complete privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
