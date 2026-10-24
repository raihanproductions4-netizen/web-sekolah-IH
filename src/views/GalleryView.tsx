import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { Eye, Calendar, X, Sparkles } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { gallery, selectedGalleryItem, setSelectedGalleryItem } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Pembelajaran',
    'Tahfiz & Ibadah',
    'Alam & Lingkungan',
    'Outing Class',
    'Sosial & Kemanusiaan',
    'Ekstrakurikuler',
    'Prestasi'
  ];

  const filteredGallery = selectedCategory === 'Semua'
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Dokumentasi Visual</span>
            <span aria-hidden="true">·</span>
            <span>Insan Harapan Batam</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Galeri Kegiatan & Dinamika Santri
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Menangkap momen-momen penuh inspirasi saat para santri belajar, beribadah, merawat alam, dan berprestasi di sekolah.
          </p>
        </div>

        {/* Categories Segmented Control in Light Green and Orange */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedGalleryItem(item)}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-900">
                  {item.category}
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedGalleryItem && (
          <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-800 animate-in zoom-in-95 duration-200">
              <div className="relative max-h-[65vh] bg-stone-950 flex items-center justify-center">
                <img
                  src={selectedGalleryItem.mediaUrl}
                  alt={selectedGalleryItem.title}
                  className="max-h-[65vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedGalleryItem(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 bg-white space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {selectedGalleryItem.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedGalleryItem.date}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  {selectedGalleryItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {selectedGalleryItem.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
