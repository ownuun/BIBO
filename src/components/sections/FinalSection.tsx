'use client';

export function FinalSection() {
    return (
        <section className="min-h-screen bg-gray-900 flex items-center justify-center relative px-8">
            {/* 어두운 배경 이미지나 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-70" />



            {/* 우측 상단 부제목 */}
            <div className="absolute top-8 right-8 z-10 text-right">
                <h3 className="font-crayons text-white text-lg md:text-xl">
                    TWO KOREAN COLLEGE STUDENTS ON A JOURNEY TO BUILD A{' '}
                    <span className="text-primary-500">UNICORN</span>{' '}
                    <span className="text-lg">🦄</span>
                </h3>
            </div>

            {/* 중앙 메인 메시지 */}
            <div className="text-center max-w-6xl mx-auto relative z-10 space-y-8">
                <h1 className="font-crayons text-white text-4xl md:text-6xl lg:text-7xl leading-tight">
                    TESLA, META, GOOGLE, NVIDIA
                </h1>

                <div className="space-y-4">
                    <h2 className="font-crayons text-6xl md:text-8xl lg:text-9xl leading-none">
                        <span className="text-primary-500">B</span>
                        <span className="text-green-500">I</span>
                        <span className="text-blue-500">B</span>
                        <span className="text-yellow-500">O</span>
                    </h2>

                    <h3 className="font-crayons text-white text-4xl md:text-6xl lg:text-7xl leading-tight">
                        LET'S GO <span className="text-4xl">🚀</span>
                    </h3>
                </div>
            </div>
        </section>
    );
}
