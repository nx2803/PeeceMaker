export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-red-500">Authentication Error</h1>
      <p className="mt-4 text-lg">
        Sorry, there was a problem authenticating your account. Please try logging in again.
      </p>
      <a
        href="/login"
        className="mt-8 rounded-md bg-orange-400 px-6 py-3 text-white font-bold hover:bg-orange-500 transition-colors"
      >
        Back to Login
      </a>
    </div>
  )
}
