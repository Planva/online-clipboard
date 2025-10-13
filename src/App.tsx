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
import { FAQ } from './pages/FAQ';
import { Blog } from './pages/Blog';
import { FAQSection } from './components/FAQSection';

type Mode = 'create' | 'retrieve';
type Page = 'home' | 'all-reviews' | 'terms' | 'privacy' | 'faq' | 'blog';
type ContentType = 'text' | 'image' | 'file' | null;

function App() {
  const [mode, setMode] = useState<Mode>('create');
  const [page, setPage] = useState<Page>('home');
  const [selectedType, setSelectedType] = useState<ContentType>(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.includes('/online-clipboard-text')) {
      setMode('create');
      setSelectedType('text');
    } else if (path.includes('/online-clipboard-images')) {
      setMode('create');
      setSelectedType('image');
    } else if (path.includes('/online-clipboard-files')) {
      setMode('create');
      setSelectedType('file');
    } else if (params.get('s')) {
      setMode('retrieve');
    }
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
      setPage('home');
      setTimeout(() => {
        const faqSection = document.getElementById('faq-section');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setPage(newPage as Page);
      window.scrollTo(0, 0);
    }
  };

  const handleBackToHome = () => {
    setPage('home');
    window.scrollTo(0, 0);
  };

  if (page === 'terms') {
    return (
      <>
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <TermsOfService onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (page === 'privacy') {
    return (
      <>
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <PrivacyPolicy onBack={handleBackToHome} />
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (page === 'faq') {
    return (
      <>
        <Navigation currentPage={page} onNavigate={handleNavigate} />
        <FAQ onBack={handleBackToHome} />
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
      <Navigation currentPage={page} onNavigate={handleNavigate} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <header className="text-center mb-6 sm:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Clipboard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">在线剪切板</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">安全分享文字、图像、文件 - 阅后即焚</p>
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
              >
                <Clipboard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>创建分享</span>
              </button>
              <button
                onClick={() => setMode('retrieve')}
                className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === 'retrieve'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>获取分享</span>
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
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">使用说明</h3>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">创建分享</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>选择分享类型：文字、图像或文件</li>
                      <li>输入内容或上传文件（最大45MB）</li>
                      <li>选择口令长度（4位或6位数字）</li>
                      <li>点击"创建分享"生成口令和链接</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">获取分享</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>通过链接直接访问自动获取内容</li>
                      <li>或手动输入数字口令后点击"获取"</li>
                      <li>内容获取后立即销毁，无法再次访问</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">什么是在线剪切板？</h3>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    在线剪切板（Online Clipboard）是一个安全的临时内容分享工具，让您可以在不同设备或与他人之间快速传输文字、图片和文件。
                  </p>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">核心特性</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>阅后即焚：内容获取一次后立即删除</li>
                      <li>自动过期：24小时后自动销毁未读内容</li>
                      <li>加密存储：所有数据加密保护隐私</li>
                      <li>双重分享：支持口令和链接两种方式</li>
                      <li>多种格式：支持文本、图像、文件传输</li>
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
