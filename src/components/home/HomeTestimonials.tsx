import React from 'react';
import { useApp } from '../../context/AppContext';
import { Quote, Star } from 'lucide-react';

export const HomeTestimonials: React.FC = () => {
  const { testimonials } = useApp();

  return (
    <section className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Suara Orang Tua Santri</span>
            <span aria-hidden="true">·</span>
            <span>Testimoni Nyata</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight text-balance mb-4">
            Kepercayaan Ayah & Bunda di Batam
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Menjadi kebahagiaan terbesar kami menyaksikan pertumbuhan karakter akhlak, kedisiplinan ibadah, dan kecintaan belajar putra-putri tercinta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="bg-white p-7 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-emerald-100" />
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "{testi.message}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-bold text-sm text-stone-900">
                  {testi.parentName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{testi.childLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{testi.profession}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
