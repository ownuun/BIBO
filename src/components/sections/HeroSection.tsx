'use client';

import { useState, useEffect } from 'react';

export function HeroSection() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [showQuotes, setShowQuotes] = useState(false);
    const [typingComplete, setTypingComplete] = useState(false);
    const [showPhotos, setShowPhotos] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // 스크롤이 50px 이상 되면 로고를 축소하고 이동
            const scrolled = scrollY > 50;
            setIsScrolled(scrolled);

            // 스크롤 상태에 따라 콘텐츠 표시/숨김
            setShowContent(scrolled);

            // 타이핑이 완료된 후에만 명언 섹션 표시 가능
            if (typingComplete) {
                setShowQuotes(scrollY > 500);
            }

            // 명언들이 표시된 후 더 스크롤하면 사진들이 등장
            if (showQuotes && scrollY > 800) {
                setShowPhotos(true);
            } else if (scrollY <= 800) {
                setShowPhotos(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [typingComplete, showQuotes]);



    return (
        <>
            {/* 메인 컨테이너 - 스크롤에 따른 자연스러운 배경 전환 */}
            <div className="relative min-h-screen">
                {/* BIBO 로고 - 항상 최상단에 표시 */}
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                    <img
                        src="/image/logo.png"
                        alt="BIBO Logo"
                        className={`object-contain logo-super-slow ${isScrolled
                            ? 'w-32 h-32 transform -translate-x-[calc(50vw-8rem)] -translate-y-[calc(50vh-4rem)]'
                            : 'w-80 h-80 md:w-[32rem] md:h-[32rem] lg:w-[40rem] lg:h-[40rem] transform translate-x-0 translate-y-0'
                            }`}
                        style={{
                            transformOrigin: 'center center'
                        }}
                    />
                </div>

                {/* 타이핑 텍스트와 지구본 - 항상 최상단에 표시 */}
                {showContent && (
                    <div className="fixed inset-0 pointer-events-none z-40">
                        {/* 타이핑 텍스트 */}
                        <div className="absolute top-10 left-1/2 transform -translate-x-[700px] w-full max-w-8xl px-2">
                            <div
                                className="typing-animation flex items-center gap-2"
                                onAnimationEnd={() => setTypingComplete(true)}
                            >
                                <span className={`text-2xl md:text-4xl lg:text-5xl font-colored-crayons ${showQuotes ? 'text-white' : 'text-black'
                                    }`}>
                                    TWO KOREAN COLLEGE STUDENTS ON A JOURNEY TO BUILD A{' '}
                                    <span className="bg-gradient-to-r from-red-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
                                        UNICORN
                                    </span>
                                </span>
                                <img
                                    src="/image/uni.png"
                                    alt="Unicorn"
                                    className={`h-5 md:h-10 lg:h-14 object-contain transition-all duration-500 -mt-1 ${showContent ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    style={{
                                        aspectRatio: 'auto'
                                    }}
                                />
                            </div>
                        </div>


                    </div>
                )}

                {/* 첫 번째 섹션 - 노란 배경 */}
                <section
                    className={`fixed inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${showQuotes ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                    style={{
                        background: '#FFE500',
                        zIndex: 10
                    }}
                >
                </section>

                {/* 두 번째 섹션 - 명언 섹션 */}
                <section
                    className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${showQuotes ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    style={{
                        backgroundImage: 'url(/image/back1.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 5
                    }}
                >
                    {/* 가벼운 오버레이 */}
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                    {/* 4개 명언 분산 배치 */}
                    <div className="relative z-10 w-full h-screen px-4">
                        {/* 첫 번째 명언 - 좌상단 */}
                        <div className="absolute top-56 left-[240px] max-w-2xl animate-fade-in">
                            <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                "Being the richest man in the cemetery<br />
                                doesn't matter to me. Going to bed at<br />
                                night saying we've done something<br />
                                wonderful... that's what matters to me."
                            </blockquote>
                        </div>

                        {/* 두 번째 명언 - 우상단 */}
                        <div className="absolute top-[260px] right-[400px] max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                "I'd rather be optimistic and wrong<br />
                                than pessimistic and right."
                            </blockquote>
                        </div>

                        {/* 세 번째 명언 - 좌하단 */}
                        <div className="absolute bottom-[200px] left-[240px] max-w-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                "The biggest risk is not taking any risk"
                            </blockquote>
                        </div>

                        {/* 네 번째 명언 - 우하단 */}
                        <div className="absolute bottom-[200px] right-[400px] max-w-2xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                "If you can't tolerate critics, don't<br />
                                do anything new or interesting."
                            </blockquote>
                        </div>

                        {/* 사진들 - PhotosSection과 동일한 크기로 명언을 덮도록 등장 */}
                        {showPhotos && (
                            <>
                                {/* 첫 번째 사진 - 스티브 잡스 */}
                                <div className="absolute top-[150px] left-[200px] z-20 animate-fade-in">
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/apple.png"
                                            alt="Steve Jobs"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 두 번째 사진 - 엘론 머스크 */}
                                <div className="absolute top-[150px] right-[300px] z-20 animate-fade-in">
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/tesla.png"
                                            alt="Elon Musk"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 세 번째 사진 - 마크 저커버그 */}
                                <div className="absolute bottom-[30px] left-[200px] z-20 animate-fade-in">
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/meta.png"
                                            alt="Mark Zuckerberg"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 네 번째 사진 - 제프 베조스 */}
                                <div className="absolute bottom-[30px] right-[300px] z-20 animate-fade-in">
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/amazon.png"
                                            alt="Jeff Bezos"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* 스크롤 공간 확보를 위한 더미 div */}
                <div className="h-[200vh]"></div>
            </div>
        </>
    );
}
