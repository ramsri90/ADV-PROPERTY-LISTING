import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-gray-200 bg-white p-10 text-center shadow-lg">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">
            Webb Heads Access
          </p>
          <h1 className="mb-4 text-4xl font-serif font-bold text-blue-950">Sign in with an agent</h1>
          <p className="mb-8 text-lg text-gray-600">
            Private account access is arranged directly with our team. Reach out and we will help
            you with saved listings, tours, and property updates.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/agents"
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-950 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-900 sm:w-auto"
            >
              Contact an Agent
            </Link>
            <Link
              href="/search"
              className="inline-flex w-full items-center justify-center rounded-md border-2 border-blue-950 px-4 py-3 font-medium text-blue-950 transition-colors hover:bg-blue-950 hover:text-white sm:w-auto"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
