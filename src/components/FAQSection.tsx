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
      question: '什么是在线剪切板？',
      answer: '在线剪切板是一个安全的临时内容分享工具，让您可以在不同设备或与他人之间快速传输文字、图片和文件。所有内容都是加密存储的，并会在24小时后或第一次访问后自动删除。',
    },
    {
      question: '如何使用在线剪切板？',
      answer: '使用非常简单：1) 选择要分享的内容类型（文字、图片或文件）；2) 输入或上传您的内容；3) 点击"创建分享"获得一个唯一的口令或链接；4) 将口令或链接分享给接收者；5) 接收者使用口令或点击链接即可获取内容。',
    },
    {
      question: '内容的安全性如何？',
      answer: '我们采用多重安全措施：所有内容都经过加密存储，使用HTTPS传输，并且实施"阅后即焚"机制 - 内容被访问一次后立即删除。我们不保留任何备份，确保您的隐私安全。',
    },
    {
      question: '分享内容会保存多久？',
      answer: '分享内容最多保存24小时。但如果在24小时内有人访问了该分享，内容会立即删除。这种"阅后即焚"机制确保了最高级别的隐私保护。',
    },
    {
      question: '是否需要注册账号？',
      answer: '不需要！我们的服务完全匿名，无需注册、登录或提供任何个人信息。只需访问网站，即可立即开始使用。',
    },
    {
      question: '可以分享多大的文件？',
      answer: '目前支持最大45MB的文件上传。这个大小足以满足大多数日常分享需求，包括文档、图片和小型视频文件。',
    },
    {
      question: '口令和分享链接有什么区别？',
      answer: '口令是一个4位或6位的数字代码，接收者需要手动输入。分享链接是一个完整的URL，接收者点击后可以直接访问内容。两种方式的安全性相同，您可以根据使用场景选择。',
    },
    {
      question: '如果忘记了口令怎么办？',
      answer: '很遗憾，我们无法帮您找回口令。由于我们采用严格的隐私保护措施，没有任何方式可以查看或恢复口令。建议使用分享链接功能，或者在创建分享时保存好口令。',
    },
    {
      question: '可以取消已创建的分享吗？',
      answer: '目前无法手动删除已创建的分享。但所有分享都会在24小时后自动过期，或者在第一次访问后立即删除。如果担心内容泄露，最好的做法是不要分享敏感信息。',
    },
    {
      question: '支持哪些文件格式？',
      answer: '我们支持所有常见的文件格式，包括文档（PDF、Word、Excel）、图片（JPG、PNG、GIF）、压缩文件（ZIP、RAR）等。只要文件大小不超过45MB，都可以上传分享。',
    },
    {
      question: '是否可以多次访问同一个分享？',
      answer: '不可以。为了确保最高级别的安全性，每个分享只能被访问一次。访问后内容会立即删除。如果需要多次访问，建议接收者在第一次访问时保存内容。',
    },
    {
      question: '这个服务完全免费吗？',
      answer: '是的，在线剪切板目前完全免费，没有任何隐藏费用。我们希望为所有人提供一个安全、便捷的内容分享工具。',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">常见问题</h2>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
        以下是关于在线剪切板的常见问题解答。如果您有其他疑问，请联系我们。
      </p>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">还有其他问题？</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          如果您的问题没有在上面找到答案，欢迎通过邮件联系我们。
        </p>
        <a
          href="mailto:contact@example.com"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          contact@example.com
        </a>
      </div>
    </div>
  );
}
