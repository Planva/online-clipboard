import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString('zh-CN')}</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This Privacy Policy explains how we collect, use, and protect information when you use our online clipboard service. We are committed to protecting your privacy and ensuring the security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                We collect minimal information necessary to provide our service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>Shared Content:</strong> Text, images, and files you choose to share through our service</li>
                <li><strong>Technical Data:</strong> IP addresses (hashed for reviews), browser type, and access timestamps</li>
                <li><strong>Usage Data:</strong> Service interaction patterns for improvement purposes</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                We do NOT collect: Personal identification information, email addresses, or user accounts (service is anonymous).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                We use collected information for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Providing temporary storage and sharing functionality</li>
                <li>Preventing spam and abuse (via IP hashing)</li>
                <li>Improving service quality and user experience</li>
                <li>Technical troubleshooting and system maintenance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">4. Data Storage and Security</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                We implement strong security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>Encryption:</strong> All shared content is encrypted in storage</li>
                <li><strong>Auto-Deletion:</strong> Content is automatically deleted after first access or 24 hours</li>
                <li><strong>No Backups:</strong> Deleted content is permanently removed with no recovery option</li>
                <li><strong>Secure Transmission:</strong> HTTPS encryption for all data transfers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">5. Data Retention</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We maintain a strict data retention policy:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Shared content: Deleted after first access or 24 hours maximum</li>
                <li>User reviews: Stored indefinitely (anonymous, with IP hashed)</li>
                <li>Technical logs: Retained for 30 days for security purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">6. Cookies and Tracking</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We use minimal cookies for essential service functionality only. We do not use tracking cookies or third-party advertising cookies. We do not track users across websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">7. Third-Party Services</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Our service uses the following third-party providers:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>Supabase:</strong> Database and file storage (with encryption)</li>
                <li><strong>Hosting Provider:</strong> Service infrastructure</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                These providers have their own privacy policies and security measures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">8. Your Rights</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Know what data we collect and how it's used</li>
                <li>Request deletion of your reviews (contact us)</li>
                <li>Not provide any personal information (service is anonymous)</li>
                <li>Stop using the service at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">9. Children's Privacy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our service is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">10. International Users</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our service may be accessed globally. By using our service, you consent to the transfer and processing of your information as described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">11. Changes to Privacy Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update this Privacy Policy periodically. Continued use of the service after changes indicates acceptance of the updated policy. Material changes will be prominently posted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">12. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For questions about this Privacy Policy or our data practices, please contact us at:
                <br />
                <strong>Email:</strong> contact@example.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
