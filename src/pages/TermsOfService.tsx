import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString('zh-CN')}</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing and using this online clipboard service, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">2. Use License</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Permission is granted to temporarily use this service for personal, non-commercial transitory sharing of content subject to the following restrictions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Content must not violate any applicable laws or regulations</li>
                <li>Content must not infringe upon intellectual property rights</li>
                <li>Content must not contain malicious code or harmful materials</li>
                <li>Service must not be used for illegal activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">3. Service Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Our online clipboard service provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Temporary storage of text, images, and files</li>
                <li>Automatic deletion after first access or 24 hours</li>
                <li>Encrypted storage for privacy protection</li>
                <li>Anonymous usage without registration</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">4. Content Responsibility</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You are solely responsible for the content you share through this service. We do not monitor, verify, or endorse user-generated content. We reserve the right to remove any content that violates these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">5. Data Retention</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                All shared content is automatically deleted after first access or after 24 hours, whichever comes first. We do not maintain backups of deleted content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">6. Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This service is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use this service, including but not limited to data loss or unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">7. Service Modifications</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the service at any time without prior notice. We are not liable for any modifications or interruptions to the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">8. Prohibited Uses</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                You agree not to use this service for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Sharing illegal, harmful, or offensive content</li>
                <li>Distributing malware, viruses, or malicious code</li>
                <li>Violating intellectual property rights</li>
                <li>Harassing, threatening, or impersonating others</li>
                <li>Attempting to gain unauthorized access to the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">9. Changes to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">10. Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For questions about these Terms of Service, please contact us at support@onlinclipboard.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
