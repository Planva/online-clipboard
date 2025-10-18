import { ArrowLeft, ClipboardList, LifeBuoy, ShieldCheck, Sparkle, UploadCloud } from 'lucide-react';

interface HelpCenterProps {
  onBack: () => void;
}

export function HelpCenter({ onBack }: HelpCenterProps) {
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
            <LifeBuoy className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">Help Center</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Make the most of OnlinClipboard</h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            This guide walks you through core features, tried-and-true workflows, and answers to the questions we receive most
            often when people apply for programs such as Google AdSense. Everything here is based on how the product actually
            behaves today.
          </p>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Quick Start Checklist
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>Select a share type (Text, Image, or File) from the home screen.</li>
            <li>Paste your content or upload a file. Large uploads show a progress indicator.</li>
            <li>Pick a four or six digit passcode if you want to restrict access.</li>
            <li>Press “Create Share” and copy the passcode, link, or QR code that appears.</li>
            <li>Send the code to your recipient. They have one chance to retrieve the content before it is deleted.</li>
          </ol>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-blue-600" />
            Managing Shares
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Shares can be retrieved only once. If the recipient opens the link successfully, we immediately delete the record
              from Cloudflare D1 and remove any associated file from R2 storage. When a share expires naturally after 24 hours,
              the scheduled cleanup Worker performs the same deletion steps.
            </p>
            <p>
              Forgot to copy the passcode? Create a fresh share instead—there is currently no way to view or reset a previously
              generated passcode for security reasons.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Acceptable Use Guidelines
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>Do not upload copyrighted material you do not own permission to share.</li>
            <li>Avoid storing sensitive personal data. Shares are short-lived, but recipients can always copy the content.</li>
            <li>Illegal, harassing, or malicious content is strictly prohibited and may result in service bans.</li>
            <li>Automation or bulk uploading is not supported. The product is designed for human, on-demand transfers.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkle className="w-6 h-6 text-blue-600" />
            Troubleshooting Tips
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              <strong>Uploads stall or fail:</strong> Refresh the page and try again. Extremely large files (close to 300&nbsp;MB)
              can time out on slow networks; splitting the file or compressing it usually helps.
            </p>
            <p>
              <strong>Passcode rejected:</strong> Passcodes accept digits only. Remove spaces or symbols before submitting.
            </p>
            <p>
              <strong>No preview after upload:</strong> Certain formats (e.g., ZIP archives) do not display a preview. They are
              still available for download immediately after retrieval.
            </p>
            <p>
              <strong>Share already used:</strong> If a link says it has already been accessed, the previous recipient must
              create a new share. Content cannot be resurrected by support.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-blue-600" />
            Need more help?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Reach us anytime at{' '}
            <a className="text-blue-600 dark:text-blue-400 hover:underline" href="mailto:support@onlinclipboard.com">
              support@onlinclipboard.com
            </a>. Include the approximate time of your share, the passcode length you chose, and what went wrong so we can trace
            it quickly. We typically reply within two business days.
          </p>
        </section>
      </div>
    </div>
  );
}
