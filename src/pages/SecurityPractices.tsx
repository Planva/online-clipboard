import { AlertTriangle, ArrowLeft, Clock, Database, Shield, Trash2 } from 'lucide-react';

interface SecurityPracticesProps {
  onBack: () => void;
}

export function SecurityPractices({ onBack }: SecurityPracticesProps) {
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
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
                Security & Data Handling
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">How we safeguard one-time shares</h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We designed OnlinClipboard to keep data footprints small. This page explains the storage systems we use, what the
            Worker does with your data, and the expectations you should have before relying on the service.
          </p>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Infrastructure Overview
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>D1 (Cloudflare’s managed SQLite) stores share metadata and text content.</li>
            <li>R2 (Cloudflare object storage) keeps uploaded files until they are deleted.</li>
            <li>KV cache stores review statistics to avoid repeated database scans.</li>
            <li>A Cloudflare Worker orchestrates uploads, retrievals, and scheduled cleanup jobs.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Retention Windows
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Every share is created with a 24-hour expiration timestamp. When you retrieve the content successfully, the Worker
              marks the share as accessed and deletes it immediately. Files are removed from R2 in the same operation.
            </p>
            <p>
              An hourly scheduled job runs <code>cleanupExpiredShares</code> to delete any remaining records whose expiration time
              has passed. This job also removes lingering files from R2 so the storage does not accumulate unused data.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-blue-600" />
            What We Do Not Keep
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>No version history or backups of shares after deletion.</li>
            <li>No analytics attached to individual shares beyond basic access logs within Cloudflare.</li>
            <li>No user accounts or persistent identifiers—you only interact through passcodes or slug links.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Your Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>Do not use OnlinClipboard to store medical, financial, or other highly sensitive personal data.</li>
            <li>
              Treat the generated link or passcode like any other secret—anyone with it can retrieve the content exactly once.
            </li>
            <li>
              Remember that recipients can still save or forward the content outside the platform after retrieval. Automatic deletion
              does not prevent manual copying.
            </li>
            <li>
              Contact us promptly at{' '}
              <a className="text-blue-600 dark:text-blue-400 hover:underline" href="mailto:support@onlinclipboard.com">
                support@onlinclipboard.com
              </a>{' '}
              if you detect abuse or need a share removed before its expiry—we will attempt to assist when technically possible.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
