'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { SubtitleSection } from '@/components/sections/SubtitleSection';
import { QuotesSection } from '@/components/sections/QuotesSection';
import { PhotosSection } from '@/components/sections/PhotosSection';
import { FinalSection } from '@/components/sections/FinalSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. 노란 배경에 BIBO 로고만 */}
      <HeroSection />

      {/* 2. TWO KOREAN COLLEGE STUDENTS... 부제목 */}
      <SubtitleSection />

      {/* 3. 4개 명언이 있는 노란 배경 */}
      <QuotesSection />

      {/* 4. 4개 역사적 사진이 있는 어두운 배경 */}
      <PhotosSection />

      {/* 5. TESLA, META, GOOGLE, NVIDIA BIBO LET'S GO */}
      <FinalSection />
    </main>
  );
}
