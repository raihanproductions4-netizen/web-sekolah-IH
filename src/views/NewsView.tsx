import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewsArticle } from '../types';
import {
  Calendar,
  User,
  Clock,
  Share2,
  Search,
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  X,
  Facebook,
  Twitter
} from 'lucide-react';

export const NewsView: React.FC = () => {
  const { news, selectedArticleId, setSelectedArticleId, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['Semua', 'Kegiatan Sekolah', 'Prestasi Siswa', 'Info Akademik', 'Keislaman', 'Sosial', 'Pengumuman'];

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeArticle = news.find((item) => item.id === selectedArticleId);

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy', article: NewsArticle) => {
    const shareUrl = window.location.href;
    const text = `${article.title} - SIT Insan Harapan Batam`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Tautan artikel berhasil disalin ke papan klip!', 'info');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Pusat Berita & Informasi</span>
            <span aria-hidden="true">·</span>
            <span>Insan Harapan Batam</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Warta, Prestasi & Agenda Sekolah
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Menyajikan dokumentasi kegiatan, capaian membanggakan santri, serta pengumuman resmi bagi seluruh orang tua dan masyarakat.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories in Light Green and Orange */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-orange-600 hover:bg-orange-50/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berita atau agenda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-stone-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-orange-600 border border-orange-200 shadow-sm">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Unboxed metadata with bullet separator */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                      <span>{article.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-semibold">{article.readTime}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedArticleId(article.id)}
                      className="font-bold text-base text-stone-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug mb-3 line-clamp-2"
                    >
                      {article.title}
                    </h3>

                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-50 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArticleId(article.id)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 py-1"
                  >
                    <span>Baca Selengkapnya</span>
                  </button>

                  <span className="text-[11px] text-stone-400">
                    {article.author}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
            <p className="text-stone-500 text-sm">Tidak ada berita yang sesuai dengan kata kunci atau kategori terpilih.</p>
          </div>
        )}

        {/* Modal Detail Baca Artikel */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 border border-stone-200 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <button
                  onClick={() => setSelectedArticleId(null)}
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Warta</span>
                </button>

                <button
                  onClick={() => setSelectedArticleId(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {activeArticle.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.readTime}</span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4">
                  {activeArticle.title}
                </h2>

                <p className="text-xs text-stone-500 italic">
                  Ditulis oleh: {activeArticle.author}
                </p>
              </div>

              {/* Cover Photo */}
              <div className="rounded-2xl overflow-hidden h-64 sm:h-80 bg-stone-100">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Article Content Paragraphs */}
              <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
                {activeArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Social Share Bar */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <Share2 className="w-4 h-4 text-stone-400" />
                  <span className="font-semibold">Bagikan Berita Ini:</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare('whatsapp', activeArticle)}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title="Bagikan ke WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleShare('facebook', activeArticle)}
                    className="p-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title="Bagikan ke Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </button>

                  <button
                    onClick={() => handleShare('twitter', activeArticle)}
                    className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title="Bagikan ke X"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>X</span>
                  </button>

                  <button
                    onClick={() => handleShare('copy', activeArticle)}
                    className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title="Salin Tautan"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
