import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SEO } from '../components/SEO';
import { blogArticles, type BlogArticle } from '../data/blog';

interface BlogProps {
  onBack: () => void;
}

export function Blog({ onBack }: BlogProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const blogListingStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://onlinclipboard.com/blog',
    name: 'OnlinClipboard Blog',
    description: 'Guides and tips for using online clipboard tools, sharing files securely, and syncing clipboard content between devices.',
    url: 'https://onlinclipboard.com/blog',
    inLanguage: 'en-US',
    blogPost: blogArticles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.date,
      url: `https://onlinclipboard.com/blog/${article.slug}`,
      mainEntityOfPage: `https://onlinclipboard.com/blog/${article.slug}`,
    })),
  }), []);

  useEffect(() => {
    // Check URL path for direct article access
    const path = window.location.pathname;
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      const article = blogArticles.find(a => a.slug === slug);
      if (article) {
        setSelectedArticle(article);
      }
    }
  }, []);

  const handleArticleClick = (article: BlogArticle) => {
    setSelectedArticle(article);
    window.history.pushState({}, '', `/blog/${article.slug}`);
    window.scrollTo(0, 0);
  };

  const handleBackToBlog = () => {
    setSelectedArticle(null);
    window.history.pushState({}, '', '/blog');
  };

  if (selectedArticle) {
    const articleStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: selectedArticle.title,
      description: selectedArticle.excerpt,
      datePublished: selectedArticle.date,
      dateModified: selectedArticle.date,
      url: `https://onlinclipboard.com/blog/${selectedArticle.slug}`,
      mainEntityOfPage: `https://onlinclipboard.com/blog/${selectedArticle.slug}`,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'Blog',
        '@id': 'https://onlinclipboard.com/blog',
      },
      publisher: {
        '@type': 'Organization',
        name: 'OnlinClipboard',
        url: 'https://onlinclipboard.com/',
      },
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <SEO
          title={`${selectedArticle.title} - OnlinClipboard Blog`}
          description={selectedArticle.excerpt}
          canonical={`https://onlinclipboard.com/blog/${selectedArticle.slug}`}
          ogType="article"
          structuredData={articleStructuredData}
        />
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={handleBackToBlog}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            aria-label="Back to blog"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span>Back to Blog</span>
          </button>

          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className={`bg-gradient-to-r ${selectedArticle.gradient} p-12`}>
              {selectedArticle.svg}
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <time dateTime={selectedArticle.date}>
                    {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {selectedArticle.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedArticle.title}
              </h1>

              {selectedArticle.content}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <SEO
        title="Blog - Online Clipboard Tips & Guides"
        description="Learn tips and tricks for using online clipboard tools, sharing files securely, and syncing clipboard content between devices."
        canonical="https://onlinclipboard.com/blog"
        structuredData={blogListingStructuredData}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Online Clipboard Blog
        </h1>

        <div className="space-y-8">
          {blogArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleArticleClick(article)}
            >
              <div className={`bg-gradient-to-r ${article.gradient} p-8`}>
                {article.svg}
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {article.title}
                </h2>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {article.excerpt}
                </p>

                <span className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
                  Read more →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
