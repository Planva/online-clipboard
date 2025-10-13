import { useState } from 'react';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [showAllLinks, setShowAllLinks] = useState(false);

  const links = [
    { name: 'AI manga translation', url: 'https://aimangatranslate.com' },
    { name: 'Tat Test', url: 'https://www.tat-test.com' },
    { name: 'YouTube Thumbnail Tester', url: 'https://www.thumbnail-tester.com' },
  ];

  const visibleLinks = showAllLinks ? links : links.slice(0, 3);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-8 sm:mt-16">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Links</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              {visibleLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            {links.length > 3 && (
              <button
                onClick={() => setShowAllLinks(!showAllLinks)}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2 text-sm"
              >
                {showAllLinks ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Show More</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Social</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <a
                  href="https://x.com/planvaofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X (Twitter)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Contact</h3>
            <a
              href="mailto:support@onlinclipboard.com"
              className="flex items-center gap-2 hover:text-white transition-colors text-sm sm:text-base"
            >
              <Mail className="w-5 h-5" />
              <span>support@onlinclipboard.com</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} onlinclipboard.com All rights reserved.</p>
          <p className="mt-2 text-gray-400">
          All shares are encrypted and removed after 24 hours | One-time access, then instantly wiped for privacy.
          </p>
        </div>
      </div>
    </footer>
  );
}
