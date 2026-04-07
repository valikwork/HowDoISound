export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Sign Up
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Authentication is coming in Stage 2 with cloud sync features.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          For now, all recordings are stored locally in your browser.
        </p>
      </div>
    </div>
  );
}
