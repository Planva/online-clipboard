import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors px-4 rounded-lg"
      >
        <span className="font-medium text-gray-900 dark:text-white">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
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

export function FAQSection() {
  const faqs = [
    {
      question: 'What is the Online Clipboard?',
      answer:
        'Online Clipboard is a secure, temporary content-sharing tool that lets you quickly transfer text, images, and files across devices or with other people. All content is stored encrypted and is automatically deleted after 24 hours or after the first access.',
    },
    {
      question: 'How do I use the Online Clipboard?',
      answer:
        'It’s very simple: 1) Choose the type of content you want to share (text, image, or file); 2) Enter or upload your content; 3) Click "Create Share" to get a unique passcode or link; 4) Share the passcode or link with the recipient; 5) The recipient can retrieve the content by entering the passcode or clicking the link.',
    },
    {
      question: 'How secure is my content?',
      answer:
        'We use multiple security measures: all content is stored encrypted, transferred over HTTPS, and protected by a “burn after reading” mechanism—content is deleted immediately after it is accessed once. We keep no backups, ensuring your privacy.',
    },
    {
      question: 'How long is shared content kept?',
      answer:
        'Shared content is kept for up to 24 hours. If the share is accessed within 24 hours, the content is deleted immediately. This “burn after reading” mechanism ensures maximum privacy.',
    },
    {
      question: 'Do I need to register an account?',
      answer:
        'No. Our service is completely anonymous—no registration, login, or personal information required. Just visit the site and start using it right away.',
    },
    {
      question: 'How large can files be?',
      answer:
        'We currently support file uploads up to 300 MB. This should cover most everyday sharing needs, including documents, images, and small video files.',
    },
    {
      question: 'What’s the difference between a passcode and a share link?',
      answer:
        'A passcode is a 4- or 6-digit code that the recipient needs to enter manually. A share link is a full URL that the recipient can click to access the content directly. Both are equally secure—choose based on your use case.',
    },
    {
      question: 'What if I forget the passcode?',
      answer:
        'Unfortunately, we can’t help retrieve a forgotten passcode. Due to strict privacy protections, there’s no way for us to view or recover it. Consider using a share link, or be sure to save the passcode when creating a share.',
    },
    {
      question: 'Can I cancel a share after creating it?',
      answer:
        'Manual deletion of an existing share is not currently supported. However, all shares automatically expire after 24 hours or are deleted immediately after the first access. If you’re worried about leaks, avoid sharing sensitive information.',
    },
    {
      question: 'Which file formats are supported?',
      answer:
        'We support all common file formats, including documents (PDF, Word, Excel), images (JPG, PNG, GIF), and archives (ZIP, RAR). Any file up to 300 MB can be uploaded and shared.',
    },
    {
      question: 'Can a share be accessed multiple times?',
      answer:
        'No. For maximum security, each share can only be accessed once. After access, the content is immediately deleted. If multiple accesses are needed, ask the recipient to save the content upon first access.',
    },
    {
      question: 'Is this service completely free?',
      answer:
        'Yes. Online Clipboard is currently completely free with no hidden fees. Our goal is to provide a secure and convenient sharing tool for everyone.',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Frequently Asked Questions
      </h2>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
        Here are answers to common questions about Online Clipboard. If you still have questions, feel free to contact us.
      </p>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Still have questions?</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          If your question isn’t answered above, you’re welcome to reach out via email.
        </p>
        <a
          href="mailto:support@onlinclipboard.com"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          support@onlinclipboard.com
        </a>
      </div>
    </div>
  );
}
