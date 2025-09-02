'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { SubtitleSection } from '@/components/sections/SubtitleSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. 노란 배경에 BIBO 로고만 */}
      <HeroSection />

      {/* 2. TWO KOREAN COLLEGE STUDENTS... 부제목 */}
      <SubtitleSection />

      {/* (기존 QuotesSection 제거: 히어로 back1에서 타이핑으로 대체) */}



      
    </main>
  );
}
