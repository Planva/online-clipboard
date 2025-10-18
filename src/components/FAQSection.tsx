import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { FAQ_ITEMS, type FAQEntry } from '../data/faq';

interface FAQSectionProps {
  fullPage?: boolean;
  onBack?: () => void;
}

function FAQItem({ question, answer }: FAQEntry) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors px-4 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 dark:text-white">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export function FAQSection({ fullPage = false, onBack }: FAQSectionProps) {

  const content = (
    <>
      {fullPage && onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span>Back</span>
        </button>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
          Here are answers to common questions about Online Clipboard. If you still have questions, feel free to contact us.
        </p>

        <div className="space-y-2">
          {FAQ_ITEMS.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Still have questions?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            If your question isn't answered above, you're welcome to reach out via email.
          </p>
          <a
            href="mailto:support@onlinclipboard.com"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            support@onlinclipboard.com
          </a>
        </div>
      </div>
    </>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
