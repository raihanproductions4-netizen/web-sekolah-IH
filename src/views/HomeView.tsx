import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { HomeUnitsPreview } from '../components/home/HomeUnitsPreview';
import { HomeAdvantages } from '../components/home/HomeAdvantages';
import { HomeProgramsHighlight } from '../components/home/HomeProgramsHighlight';
import { HomeNewsAndGallery } from '../components/home/HomeNewsAndGallery';
import { HomeTestimonials } from '../components/home/HomeTestimonials';
import { HomePPDBBanner } from '../components/home/HomePPDBBanner';

export const HomeView: React.FC = () => {
  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Educational Units Preview (RAIT, SDIT, SMPIT) */}
      <HomeUnitsPreview />

      {/* 3. Keunggulan Pendidikan (Nature School, JSIT, Tahfiz) */}
      <HomeAdvantages />

      {/* 4. Program Unggulan Highlights */}
      <HomeProgramsHighlight />

      {/* 5. Berita Terkini & Cuplikan Galeri Kegiatan */}
      <HomeNewsAndGallery />

      {/* 6. Testimoni Orang Tua Santri */}
      <HomeTestimonials />

      {/* 7. Call To Action Banner PPDB 2026/2027 */}
      <HomePPDBBanner />
    </div>
  );
};
