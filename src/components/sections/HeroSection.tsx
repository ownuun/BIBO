'use client';

export function HeroSection() {
    return (
        <section className="min-h-screen bg-secondary-500 flex items-center justify-center relative">
            {/* 중앙 BIBO 로고 (더 크게) */}
            <div className="text-center">
                <img
                    src="/image/logo.png"
                    alt="BIBO Logo"
                    className="w-80 h-80 md:w-[32rem] md:h-[32rem] lg:w-[40rem] lg:h-[40rem] object-contain mx-auto"
                />
            </div>
        </section>
    );
}
