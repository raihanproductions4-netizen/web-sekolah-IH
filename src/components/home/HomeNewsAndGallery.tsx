import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, User, ArrowRight, Eye, Image as ImageIcon } from 'lucide-react';

export const HomeNewsAndGallery: React.FC = () => {
  const { news, gallery, navigateToArticle, setActiveTab, setSelectedGalleryItem } = useApp();

  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Latest News */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                <span>Warta Sekolah</span>
                <span aria-hidden="true">·</span>
                <span>Dokumentasi Kegiatan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Kabar & Prestasi Terbaru
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('berita')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 self-start md:self-auto hover:underline"
            >
              <span>Buka Seluruh Berita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((item) => (
              <article
                key={item.id}
                className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-orange-600 border border-orange-200 shadow-sm">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.date}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">{item.readTime}</span>
                    </div>

                    <h3
                      onClick={() => navigateToArticle(item.id)}
                      className="font-bold text-base text-stone-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug mb-3 line-clamp-2"
                    >
                      {item.title}
                    </h3>

                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => navigateToArticle(item.id)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 py-1"
                  >
                    <span>Baca Artikel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Section 2: Visual Gallery Snapshot */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                <span>Galeri Foto & Video</span>
                <span aria-hidden="true">·</span>
                <span>Aktivitas Siswa</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Momen Berharga di Insan Harapan
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('galeri')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 self-start md:self-auto hover:underline"
            >
              <span>Buka Semua Galeri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.slice(0, 4).map((gal) => (
              <div
                key={gal.id}
                onClick={() => setSelectedGalleryItem(gal)}
                className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden cursor-pointer bg-stone-100 border border-stone-200"
              >
                <img
                  src={gal.mediaUrl}
                  alt={gal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/20 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-orange-300 block mb-0.5">
                    {gal.category}
                  </span>
                  <p className="text-xs font-semibold line-clamp-2 leading-tight text-emerald-50">
                    {gal.title}
                  </p>
                </div>
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
