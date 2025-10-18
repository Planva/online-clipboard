import { useState, useEffect } from 'react';
import { Clipboard, Lock, HelpCircle, Info } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ShareCreate } from './components/ShareCreate';
import { ShareRetrieve } from './components/ShareRetrieve';
import { ReviewList } from './components/ReviewList';
import { ReviewForm } from './components/ReviewForm';
import { AllReviews } from './components/AllReviews';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Blog } from './pages/Blog';
import { FAQSection } from './components/FAQSection';
import { About } from './pages/About';
import { HelpCenter } from './pages/HelpCenter';
import { SecurityPractices } from './pages/SecurityPractices';
import { FAQ_ITEMS, type FAQEntry } from './data/faq';
import { SEO } from './components/SEO';

type Mode = 'create' | 'retrieve';
type Page = 'home' | 'all-reviews' | 'terms' | 'privacy' | 'faq' | 'blog' | 'about' | 'help' | 'security';
type ContentType = 'text' | 'image' | 'file' | null;

const SITE_URL = 'https://onlinclipboard.com';
const HOME_DESCRIPTION =
  'Free online clipboard to share text, images, files & PDFs across devices. No login required. Self-destruct links for secure temporary sharing. Copy-paste online.';

const HOME_STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'OnlinClipboard',
    url: `${SITE_URL}/`,
    description: HOME_DESCRIPTION,
    inLanguage: 'en-US',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OnlinClipboard',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    url: `${SITE_URL}/`,
    description: 'Free online clipboard to share text, images, and files across devices with self-destruct links.',
    isAccessibleForFree: true,
  },
];

const TERMS_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'TermsOfService',
  name: 'Terms of Service | OnlinClipboard',
  description:
    'Terms of service for using OnlinClipboard, covering temporary clipboard shares, file uploads, and security policies.',
  url: `${SITE_URL}/terms`,
  inLanguage: 'en-US',
  mainEntityOfPage: `${SITE_URL}/terms`,
};

const PRIVACY_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'PrivacyPolicy',
  name: 'Privacy Policy | OnlinClipboard',
  description:
    'Privacy policy detailing how OnlinClipboard handles shared content, automatic deletion, and data security practices.',
  url: `${SITE_URL}/privacy`,
  inLanguage: 'en-US',
  mainEntityOfPage: `${SITE_URL}/privacy`,
};

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'OnlinClipboard Frequently Asked Questions',
  description:
    'Answers to common questions about sharing text, images, and files securely with the OnlinClipboard online clipboard.',
  url: `${SITE_URL}/faq`,
  inLanguage: 'en-US',
  mainEntity: FAQ_ITEMS.map((faq: FAQEntry) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const ABOUT_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About OnlinClipboard',
  description:
    'Learn who operates OnlinClipboard, the technology stack behind the service, and how one-time shares are processed.',
  url: `${SITE_URL}/about`,
  inLanguage: 'en-US',
};

const HELP_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'OnlinClipboard Help Center',
  description:
    'Step-by-step instructions, troubleshooting tips, and acceptable use guidelines for the OnlinClipboard sharing tool.',
  url: `${SITE_URL}/help`,
  inLanguage: 'en-US',
};

const SECURITY_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'OnlinClipboard Security & Data Handling',
  description:
    'Details about data retention, deletion schedules, and infrastructure choices that keep OnlinClipboard shares temporary.',
  url: `${SITE_URL}/security`,
  inLanguage: 'en-US',
};

function App() {
  const [mode, setMode] = useState<Mode>('create');
  const [page, setPage] = useState<Page>('home');
  const [selectedType, setSelectedType] = useState<ContentType>(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Check for share retrieval parameter
    if (params.get('s')) {
      setMode('retrieve');
      setPage('home');
      return;
    }

    // Detect page based on path
    if (path === '/terms' || path === '/terms/') {
      setPage('terms');
    } else if (path === '/privacy' || path === '/privacy/') {
      setPage('privacy');
    } else if (path === '/about' || path === '/about/') {
      setPage('about');
    } else if (path === '/help' || path === '/help/') {
      setPage('help');
    } else if (path === '/security' || path === '/security/') {
      setPage('security');
    } else if (path.startsWith('/blog')) {
      setPage('blog');
    } else if (path.includes('/online-clipboard-text')) {
      setMode('create');
      setSelectedType('text');
      setPage('home');
    } else if (path.includes('/online-clipboard-images')) {
      setMode('create');
      setSelectedType('image');
      setPage('home');
    } else if (path.includes('/online-clipboard-files')) {
      setMode('create');
      setSelectedType('file');
      setPage('home');
    } else {
      setPage('home');
    }
  }, []);

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/terms' || path === '/terms/') {
        setPage('terms');
      } else if (path === '/privacy' || path === '/privacy/') {
        setPage('privacy');
      } else if (path === '/about' || path === '/about/') {
        setPage('about');
      } else if (path === '/help' || path === '/help/') {
        setPage('help');
      } else if (path === '/security' || path === '/security/') {
        setPage('security');
      } else if (path.startsWith('/blog')) {
        setPage('blog');
      } else {
        setPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTypeChange = (type: 'text' | 'image' | 'file') => {
    setSelectedType(type);
    const urls = {
      text: '/online-clipboard-text',
      image: '/online-clipboard-images',
      file: '/online-clipboard-files',
    };
    window.history.pushState({}, '', urls[type]);
  };

  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => prev + 1);
  };

  const handleNavigate = (newPage: string) => {
    if (newPage === 'faq') {
      window.history.pushState({}, '', '/');
      setPage('home');
      setTimeout(() => {
        const faqSection = document.getElementById('faq-section');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (newPage === 'home') {
      window.history.pushState({}, '', '/');
      setPage('home');
      window.scrollTo(0, 0);
    } else if (newPage === 'blog') {
      window.history.pushState({}, '', '/blog');
      setPage('blog');
      window.scrollTo(0, 0);
    } else if (newPage === 'terms') {
      window.history.pushState({}, '', '/terms');
      setPage('terms');
      window.scrollTo(0, 0);
    } else if (newPage === 'privacy') {
      window.history.pushState({}, '', '/privacy');
      setPage('privacy');
      window.scrollTo(0, 0);
    } else if (newPage === 'about') {
      window.history.pushState({}, '', '/about');
      setPage('about');
      window.scrollTo(0, 0);
    } else if (newPage === 'help') {
      window.history.pushState({}, '', '/help');
      setPage('help');
      window.scrollTo(0, 0);
    } else if (newPage === 'security') {
      window.history.pushState({}, '', '/security');
      setPage('security');
      window.scrollTo(0, 0);
    } else {
      setPage(newPage as Page);
      window.scrollTo(0, 0);
    }
  };

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/');
    setPage('home');
    window.scrollTo(0, 0);
  };

  if (page === 'terms') {
    return (
      <>
        <SEO
          title="Terms of Service - OnlinClipboard"
          description="Terms of service for OnlinClipboard. Free online clipboard for temporary file sharing, text sharing, and cross-device clipboard sync."
          canonical="https://onlinclipboard.com/terms"
          structuredData={TERMS_STRUCTURED_DATA}
        />
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <TermsOfService onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (page === 'privacy') {
    return (
      <>
        <SEO
          title="Privacy Policy - OnlinClipboard"
          description="Privacy policy for OnlinClipboard. Learn how we protect your data with self-destruct links, time-limited retention, and no-login anonymous sharing."
          canonical="https://onlinclipboard.com/privacy"
          structuredData={PRIVACY_STRUCTURED_DATA}
        />
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <PrivacyPolicy onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (page === 'about') {
    return (
      <>
        <SEO
          title="About OnlinClipboard"
          description="Find out who maintains OnlinClipboard, how the service works, and what to expect when creating one-time shares."
          canonical="https://onlinclipboard.com/about"
          structuredData={ABOUT_STRUCTURED_DATA}
        />
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <About onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (page === 'help') {
    return (
      <>
        <SEO
          title="Help Center - OnlinClipboard Support"
          description="Step-by-step instructions, troubleshooting tips, and acceptable use guidance for OnlinClipboard."
          canonical="https://onlinclipboard.com/help"
          structuredData={HELP_STRUCTURED_DATA}
        />
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <HelpCenter onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (page === 'security') {
    return (
      <>
        <SEO
          title="Security & Data Handling - OnlinClipboard"
          description="Understand how OnlinClipboard stores shares, when data is deleted, and the responsibilities of every user."
          canonical="https://onlinclipboard.com/security"
          structuredData={SECURITY_STRUCTURED_DATA}
        />
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <SecurityPractices onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (page === 'faq') {
    return (
      <>
        <SEO
          title="FAQ - Online Clipboard Questions Answered"
          description="Frequently asked questions about OnlinClipboard. Learn how to share text online, paste images, transfer files, and use clipboard sync across devices."
          canonical="https://onlinclipboard.com/faq"
          structuredData={FAQ_STRUCTURED_DATA}
        />
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <FAQSection fullPage={true} onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (page === 'blog') {
    return (
      <>
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <Blog onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  return (
    <>
      <SEO
        title="OnlinClipboard - Free Online Clipboard for Text & Files"
        description="Free online clipboard to share text, images, files & PDFs across devices. No login required. Self-destruct links for secure temporary sharing. Copy-paste online."
        canonical="https://onlinclipboard.com/"
        structuredData={HOME_STRUCTURED_DATA}
      />
      <Navigation currentPage={page} onNavigate={handleNavigate} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <header className="text-center mb-6 sm:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Clipboard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">OnlinClipboard - Free Online Clipboard</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">Share text, images, and files across devices instantly - No login, self-destruct links, 100% free</p>
          </header>

          <div className="flex justify-center mb-6 sm:mb-8 px-3">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl shadow-md p-1 w-full max-w-md sm:w-auto">
              <button
                onClick={() => setMode('create')}
                className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === 'create'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Create Share"
              >
                <Clipboard className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <span>Create Share</span>
              </button>
              <button
                onClick={() => setMode('retrieve')}
                className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === 'retrieve'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Retrieve Share"
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <span>Retrieve Share</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            {page === 'all-reviews' ? (
              <AllReviews onBack={() => setPage('home')} />
            ) : mode === 'create' ? (
              <ShareCreate initialType={selectedType} onTypeChange={handleTypeChange} />
            ) : (
              <ShareRetrieve />
            )}
          </div>

          <div className="mt-8 sm:mt-16 max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" aria-hidden="true" />
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">How to Use Online Clipboard</h2>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Create and Share Content</h3>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Choose content type: text, image, or file</li>
                      <li>Paste text online or upload files (max 300MB)</li>
                      <li>Select secure passcode length (4 or 6 digits)</li>
                      <li>Generate expiring share link instantly</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Retrieve Shared Content</h3>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Open link to auto-retrieve clipboard content</li>
                      <li>Enter passcode if sharing via code</li>
                      <li>Content self-destructs after first view</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" aria-hidden="true" />
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Free Online Clipboard for Cross-Device Sharing</h2>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    OnlinClipboard is a free temporary clipboard tool for instant copy-paste between devices. Share text online, paste images, transfer files and PDFs without login. Perfect for clipboard sync from PC to phone or sharing content with others securely.
                  </p>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Why Choose Our Online Clipboard?</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Self-destruct links: Content auto-deleted after viewing</li>
                      <li>Expiring clipboard: 24-hour automatic deletion</li>
                      <li>No registration: Anonymous temporary file sharing</li>
                      <li>Cross-device: Copy from PC and paste on phone</li>
                      <li>Multi-format: Text, images, files, and PDF support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {page === 'home' && (
              <>
                <ReviewList
                  key={refreshReviews}
                  limit={10}
                  onViewAll={() => setPage('all-reviews')}
                />
                <ReviewForm onSuccess={handleReviewSubmitted} />
                <div id="faq-section" className="scroll-mt-20">
                  <FAQSection />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer onNavigate={handleNavigate} />
    </>
  );
}

export default App;
