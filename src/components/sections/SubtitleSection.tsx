'use client';

export function SubtitleSection() {
    return (
        <section className="min-h-screen bg-secondary-500 flex items-center justify-center relative px-8">


            {/* 좌측 상단 언어/지역 아이콘 */}
            <div className="absolute top-8 right-8 z-10">
                <div className="w-8 h-8 rounded-full bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border border-black opacity-60" />
                </div>
                <span className="text-xs text-black opacity-60 mt-1 block text-center">EN/KO</span>
            </div>

            {/* 중앙 메인 텍스트 */}
            <div className="text-center max-w-6xl mx-auto">
                <h1 className="font-crayons text-black text-4xl md:text-6xl lg:text-7xl leading-tight">
                    TWO KOREAN COLLEGE STUDENTS ON A JOURNEY TO BUILD A{' '}
                    <span className="text-primary-500">UNICORN</span>{' '}
                    <span className="text-4xl">🦄</span>
                </h1>
            </div>
        </section>
    );
}
