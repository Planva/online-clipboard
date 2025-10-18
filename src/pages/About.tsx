import { ArrowLeft, CheckCircle, Globe, Layers, Sparkles } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export function About({ onBack }: AboutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <header className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Layers className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
                About OnlinClipboard
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                A one-time clipboard for quick, anonymous sharing
              </h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            OnlinClipboard was created to solve a simple problem: moving snippets of text, screenshots, and files between
            devices without setting up accounts, syncing apps, or leaving permanent traces. The site is operated by a
            small product team that also maintains other lightweight productivity tools. Everything you see here is built
            with transparency and a focus on time-limited sharing.
          </p>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What You Can Do</h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1 text-blue-600 shrink-0" />
              <span>Generate one-use shares for text, images, or files up to 300&nbsp;MB without creating an account.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1 text-blue-600 shrink-0" />
              <span>Choose a four or six digit passcode, or copy a secure link or QR code for quick scanning.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1 text-blue-600 shrink-0" />
              <span>Let the system remove content automatically after the first successful retrieval or within 24 hours.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1 text-blue-600 shrink-0" />
              <span>Read real user feedback in the reviews section and contribute your own experience.</span>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              On the frontend we use React, TypeScript, Tailwind CSS, and Vite. The Worker backend—running on Cloudflare—receives
              your upload, stores metadata in D1 (a managed SQLite service), and optionally places files in R2 object storage.
              A Cloudflare KV namespace caches review statistics for faster load times.
            </p>
            <p>
              Each share keeps a randomly generated slug together with your passcode length preference. Retrieval checks the
              passcode or slug, marks the share as accessed, and immediately deletes it from storage. A scheduled Worker cleans
              up anything that naturally expires after 24 hours.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Product Principles
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>No accounts and no unnecessary data collection.</li>
              <li>Give users a clear way to understand retention and deletion.</li>
              <li>Provide honest documentation about technical boundaries.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Contact & Support
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Questions, takedown requests, or partnership ideas can be sent to{' '}
              <a className="text-blue-600 dark:text-blue-400 hover:underline" href="mailto:support@onlinclipboard.com">
                support@onlinclipboard.com
              </a>. We respond to most messages within two business days.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
