'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { SubtitleSection } from '@/components/sections/SubtitleSection';
import { QuotesSection } from '@/components/sections/QuotesSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. 노란 배경에 BIBO 로고만 */}
      <HeroSection />

      {/* 2. TWO KOREAN COLLEGE STUDENTS... 부제목 */}
      <SubtitleSection />

      {/* 3. 4개 명언이 있는 노란 배경 */}
      <QuotesSection />
    </main>
  );
}
