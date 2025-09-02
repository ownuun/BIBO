'use client';

import { useState, useEffect } from 'react';

export function HeroSection() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [showQuotes, setShowQuotes] = useState(false);
    const [typingComplete, setTypingComplete] = useState(false);
    const [showPhotos, setShowPhotos] = useState(false);
    const [photosAnimatingOut, setPhotosAnimatingOut] = useState(false);
    const [quotesAnimatingOut, setQuotesAnimatingOut] = useState(false);
    const [photosShowTime, setPhotosShowTime] = useState<number | null>(null);
    const [quotesHidden, setQuotesHidden] = useState(false);
    const [backgroundOnlyTime, setBackgroundOnlyTime] = useState<number | null>(null);
    const [showBack3, setShowBack3] = useState(false);
    const [photosHidden, setPhotosHidden] = useState(false);
    const [back1OnlyTime, setBack1OnlyTime] = useState<number | null>(null);
    const [back3AnimatingOut, setBack3AnimatingOut] = useState(false);
    const [showFinalText, setShowFinalText] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // 스크롤이 50px 이상 되면 로고를 축소하고 이동
            const scrolled = scrollY > 50;
            setIsScrolled(scrolled);

            // 스크롤 상태에 따라 콘텐츠 표시/숨김
            setShowContent(scrolled);

            // 타이핑이 완료된 후에만 명언 섹션 표시 가능 (한번 숨겨지면 다시 나타나지 않음)
            if (typingComplete && !quotesHidden) {
                setShowQuotes(scrollY > 500);
            }

            // 명언들이 표시된 후 더 스크롤하면 사진들이 등장 (한번 숨겨지면 다시 나타나지 않음)
            if (showQuotes && scrollY > 800 && !photosHidden) {
                if (!showPhotos) {
                    setPhotosAnimatingOut(false);
                    setShowPhotos(true);
                    setPhotosShowTime(Date.now()); // 사진이 나타난 시간 기록
                }
            } else if (scrollY <= 800 && !photosHidden) {
                if (showPhotos && !photosAnimatingOut) {
                    setPhotosAnimatingOut(true);
                    // 페이드아웃 애니메이션 완료 후 숨김
                    setTimeout(() => {
                        setShowPhotos(false);
                        setPhotosAnimatingOut(false);
                        setPhotosShowTime(null);
                    }, 800); // 애니메이션 지속시간과 일치
                }
            }

            // 사진이 나타난 후 1초 이상 경과하고 더 스크롤하면 사진과 명언 텍스트 페이드아웃
            if (showPhotos && photosShowTime && scrollY > 1200) {
                const timeElapsed = Date.now() - photosShowTime;
                if (timeElapsed >= 1000 && !photosAnimatingOut && !quotesAnimatingOut) { // 1초 이상 경과
                    setPhotosAnimatingOut(true);
                    setQuotesAnimatingOut(true);
                    // 페이드아웃 애니메이션 완료 후 사진과 명언 텍스트 숨김 (배경은 유지)
                    setTimeout(() => {
                        setShowPhotos(false);
                        setPhotosAnimatingOut(false);
                        setQuotesAnimatingOut(false);
                        setPhotosShowTime(null);
                        setQuotesHidden(true); // 명언을 영구적으로 숨김
                        setPhotosHidden(true); // 사진을 영구적으로 숨김
                        setBackgroundOnlyTime(Date.now()); // 배경만 보이기 시작한 시간 기록
                        setBack1OnlyTime(Date.now()); // back1만 보이기 시작한 시간 기록
                    }, 800); // 애니메이션 지속시간과 일치
                }
            }

            // back3으로 전환 - back1에서 1초 대기 후
            if (scrollY > 1600 && !showBack3 && back1OnlyTime) {
                const back1TimeElapsed = Date.now() - back1OnlyTime;
                if (back1TimeElapsed >= 1000) { // back1에서 1초 이상 대기
                    console.log('back3으로 전환! scrollY:', scrollY, 'back1 대기시간:', back1TimeElapsed);
                    setShowBack3(true);
                    // back3 슬라이드 애니메이션 완료 후 텍스트 표시
                    setTimeout(() => {
                        setShowFinalText(true);
                    }, 1200); // 슬라이드 애니메이션 지속시간과 일치
                } else {
                    console.log('back1에서 대기 중... 남은 시간:', 1000 - back1TimeElapsed);
                }
            }

            // back3에서 위로 스크롤할 때 back1으로 돌아가기
            if (showBack3 && scrollY <= 1500 && !back3AnimatingOut) {
                console.log('back1으로 돌아가기! scrollY:', scrollY);
                setShowFinalText(false); // 텍스트 먼저 숨김
                setBack3AnimatingOut(true);
                // 슬라이드 다운 애니메이션 완료 후 숨김
                setTimeout(() => {
                    setShowBack3(false);
                    setBack3AnimatingOut(false);
                    setBack1OnlyTime(Date.now()); // back1으로 돌아간 시간 기록
                }, 1000); // 애니메이션 지속시간과 일치
            }

            // back1 배경에서 위로 스크롤할 때 사진과 명언 복원
            if (quotesHidden && photosHidden && scrollY <= 1200 && backgroundOnlyTime) {
                const backgroundTimeElapsed = Date.now() - backgroundOnlyTime;
                if (backgroundTimeElapsed >= 1000) { // 배경에서 1초 이상 대기했었다면
                    setQuotesHidden(false);
                    setPhotosHidden(false);
                    setBackgroundOnlyTime(null);
                    setBack1OnlyTime(null); // back1 대기 시간도 초기화
                    setQuotesAnimatingOut(false);
                    setPhotosAnimatingOut(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [typingComplete, showQuotes, showPhotos, photosAnimatingOut, quotesAnimatingOut, photosShowTime, quotesHidden, backgroundOnlyTime, showBack3, photosHidden, back1OnlyTime, back3AnimatingOut, showFinalText]);



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

                {/* 두 번째 섹션 - 명언 섹션 (back1) */}
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
                        {!quotesHidden && (
                            <>
                                {/* 첫 번째 명언 - 좌상단 */}
                                <div className={`absolute top-56 left-[240px] max-w-2xl ${quotesAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
                                    <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                        "Being the richest man in the cemetery<br />
                                        doesn't matter to me. Going to bed at<br />
                                        night saying we've done something<br />
                                        wonderful... that's what matters to me."
                                    </blockquote>
                                </div>

                                {/* 두 번째 명언 - 우상단 */}
                                <div className={`absolute top-[260px] right-[400px] max-w-2xl ${quotesAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ animationDelay: quotesAnimatingOut ? '0s' : '0.2s' }}>
                                    <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                        "I'd rather be optimistic and wrong<br />
                                        than pessimistic and right."
                                    </blockquote>
                                </div>

                                {/* 세 번째 명언 - 좌하단 */}
                                <div className={`absolute bottom-[200px] left-[240px] max-w-2xl ${quotesAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ animationDelay: quotesAnimatingOut ? '0s' : '0.4s' }}>
                                    <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                        "The biggest risk is not taking any risk"
                                    </blockquote>
                                </div>

                                {/* 네 번째 명언 - 우하단 */}
                                <div className={`absolute bottom-[200px] right-[400px] max-w-2xl ${quotesAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ animationDelay: quotesAnimatingOut ? '0s' : '0.6s' }}>
                                    <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                        "If you can't tolerate critics, don't<br />
                                        do anything new or interesting."
                                    </blockquote>
                                </div>
                            </>
                        )}

                        {/* 사진들 - 명언을 덮도록 등장 */}
                        {showPhotos && (
                            <>
                                {/* 첫 번째 사진 - 스티브 잡스 */}
                                <div className={`absolute top-[150px] left-[200px] z-20 ${photosAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/apple.png"
                                            alt="Steve Jobs"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 두 번째 사진 - 엘론 머스크 */}
                                <div className={`absolute top-[150px] right-[300px] z-20 ${photosAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/tesla.png"
                                            alt="Elon Musk"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 세 번째 사진 - 마크 저커버그 */}
                                <div className={`absolute bottom-[30px] left-[200px] z-20 ${photosAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/meta.png"
                                            alt="Mark Zuckerberg"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 네 번째 사진 - 제프 베조스 */}
                                <div className={`absolute bottom-[30px] right-[300px] z-20 ${photosAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
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

                {/* 세 번째 섹션 - back3 배경 */}
                <section
                    className={`fixed inset-0 flex items-center justify-center ${showBack3
                        ? back3AnimatingOut
                            ? 'animate-slide-down-fade-out'
                            : 'animate-slide-up-fade-in'
                        : 'opacity-0 pointer-events-none'
                        }`}
                    style={{
                        backgroundImage: 'url(/image/back3.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 6
                    }}
                >
                    {/* 어두운 오버레이 */}
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                    {/* 중앙 텍스트 */}
                    {showFinalText && (
                        <div className="relative z-10 text-center">
                            <div className="typing-animation-final">
                                <h1 className="text-white font-colored-crayons text-4xl md:text-6xl lg:text-7xl leading-tight">
                                    TESLA, META, GOOGLE, NVIDIA
                                    <br />
                                    <span className="bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent text-5xl md:text-7xl lg:text-9xl">
                                        BIBO
                                    </span>{' '}
                                    <span className="text-5xl md:text-7xl lg:text-9xl">LET'S GO</span>{' '}
                                    <span className="inline-block text-6xl md:text-8xl lg:text-9xl">🚀</span>
                                </h1>
                            </div>
                        </div>
                    )}
                </section>

                {/* 스크롤 공간 확보를 위한 더미 div */}
                <div className="h-[300vh]"></div>
            </div>
        </>
    );
}
