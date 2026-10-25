import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { NewsArticle } from '../types/cricket';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await api.getNews();
        setArticles(res.articles || []);
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const categories = ['All', 'Tournament', 'Women’s Cricket', 'Test Cricket', 'Rankings'];

  const filtered = articles.filter((a) => {
    if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-[#37D5F5]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cricket News & Match Reports
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified match analysis, breaking tournament stories, and squad announcements
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111A2E] rounded-lg border border-white/5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                categoryFilter === cat ? 'bg-[#37D5F5] text-[#080D1B]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-800/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#111A2E] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[#37D5F5] font-semibold">{item.category}</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {item.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Published by {item.publisher}</span>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#B8FF4D] hover:underline font-semibold"
                >
                  <span>Official Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-sm">
          No articles in this category.
        </div>
      )}
    </div>
  );
};
