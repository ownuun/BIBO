'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function HeroSection() {
    // 스크롤 진행도 (0-1)
    const [scrollProgress, setScrollProgress] = useState(0);

    // 애니메이션 상태들
    const [isLogoMoved, setIsLogoMoved] = useState(false);
    const [showTyping, setShowTyping] = useState(false);
    const [showQuotes, setShowQuotes] = useState(false);
    const [showPhotos, setShowPhotos] = useState(false);
    const [photosAnimatingOut, setPhotosAnimatingOut] = useState(false);
    const [quotesAnimatingOut, setQuotesAnimatingOut] = useState(false);
    const [showFinalText, setShowFinalText] = useState(false);
    const [finalTextDropping, setFinalTextDropping] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);

    // 스크롤 락 관련 ref들
    const scrollLockRef = useRef(false);
    const lastScrollDirection = useRef<'up' | 'down'>('down');
    const scrollAccumulator = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // UI 표시용 상태
    const [isAnimating, setIsAnimating] = useState(false);

    // 스크롤 제어 함수
    const handleScroll = useCallback((e: WheelEvent) => {
        e.preventDefault();

        // 🔑 핵심: 락이 걸려있으면 즉시 리턴
        if (scrollLockRef.current) {
            console.log('Scroll locked - animation in progress');
            return;
        }

        const direction = e.deltaY > 0 ? 'down' : 'up';

        // 스크롤 방향이 바뀌었으면 누적값 리셋
        if (direction !== lastScrollDirection.current) {
            scrollAccumulator.current = 0;
            lastScrollDirection.current = direction;
        }

        // 스크롤 누적 (민감도 조절)
        scrollAccumulator.current += Math.abs(e.deltaY);

        // 임계값 도달 시에만 스크롤 실행
        if (scrollAccumulator.current >= 50) {
            scrollAccumulator.current = 0;

            // 다음/이전 스테이지로 이동
            const targetProgress = direction === 'down'
                ? Math.min(1, scrollProgress + 0.16)
                : Math.max(0, scrollProgress - 0.16);

            console.log(`Scroll: ${scrollProgress.toFixed(3)} → ${targetProgress.toFixed(3)} (${direction})`);
            setScrollProgress(targetProgress);

            window.scrollTo({
                top: targetProgress * (document.documentElement.scrollHeight - window.innerHeight),
                behavior: 'smooth'
            });
        }
    }, [scrollProgress]);

    // 키보드 스크롤 제어
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (scrollLockRef.current) return;

        const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space'];
        if (!keys.includes(e.code)) return;

        e.preventDefault();

        let targetProgress = scrollProgress;

        switch (e.code) {
            case 'ArrowUp':
                targetProgress = Math.max(0, scrollProgress - 0.16);
                break;
            case 'ArrowDown':
                targetProgress = Math.min(1, scrollProgress + 0.16);
                break;
            case 'PageUp':
                targetProgress = Math.max(0, scrollProgress - 0.33);
                break;
            case 'PageDown':
                targetProgress = Math.min(1, scrollProgress + 0.33);
                break;
            case 'Space':
                targetProgress = Math.min(1, scrollProgress + 0.16);
                break;
        }

        setScrollProgress(targetProgress);
        window.scrollTo({
            top: targetProgress * (document.documentElement.scrollHeight - window.innerHeight),
            behavior: 'smooth'
        });
    }, [scrollProgress]);

    // 페이지 로드 시 초기화
    useEffect(() => {
        window.scrollTo(0, 0);
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    // 스테이지 트리거 로직 (가장 중요!)
    useEffect(() => {
        console.log('Scroll Progress:', scrollProgress, 'Current Stage:', currentStage);

        // Stage 2: 로고 축소 + 타이핑 시작 (16.67%)
        if (scrollProgress >= 0.16 && !isLogoMoved && !scrollLockRef.current) {
            console.log('Triggering Stage 2: Logo move + Typing');
            scrollLockRef.current = true;
            setIsAnimating(true);
            setIsLogoMoved(true);
            setCurrentStage(2);

            // 로고 애니메이션 완료 후 타이핑 시작
            setTimeout(() => {
                setShowTyping(true);
                // 타이핑 애니메이션 완료 후 락 해제
                setTimeout(() => {
                    console.log('Stage 2 completed - unlocking scroll');
                    scrollLockRef.current = false;
                    setIsAnimating(false);
                }, 1500); // 타이핑 애니메이션 시간 단축
            }, 300); // 로고 애니메이션 시간 단축
        }

        // Stage 3: 명언 등장 (33.33%)
        if (scrollProgress >= 0.33 && !showQuotes && !scrollLockRef.current) {
            console.log('Triggering Stage 3: Quotes');
            scrollLockRef.current = true;
            setIsAnimating(true);
            setShowQuotes(true);
            setCurrentStage(3);

            // 명언 애니메이션 완료 후 락 해제
            setTimeout(() => {
                console.log('Stage 3 completed - unlocking scroll');
                scrollLockRef.current = false;
                setIsAnimating(false);
            }, 1500);
        }

        // Stage 4: 사진 등장 (50%)
        if (scrollProgress >= 0.5 && !showPhotos && !scrollLockRef.current) {
            console.log('Triggering Stage 4: Photos');
            scrollLockRef.current = true;
            setIsAnimating(true);
            setShowPhotos(true);
            setCurrentStage(4);

            // 사진 애니메이션 완료 후 락 해제
            setTimeout(() => {
                console.log('Stage 4 completed - unlocking scroll');
                scrollLockRef.current = false;
                setIsAnimating(false);
            }, 1500);
        }

        // Stage 5: 페이드아웃 (66.67%)
        if (scrollProgress >= 0.67 && !photosAnimatingOut && !quotesAnimatingOut && !scrollLockRef.current) {
            console.log('Triggering Stage 5: Fade out');
            scrollLockRef.current = true;
            setIsAnimating(true);
            setPhotosAnimatingOut(true);
            setQuotesAnimatingOut(true);
            setCurrentStage(5);

            // 페이드아웃 애니메이션 완료 후 락 해제
            setTimeout(() => {
                console.log('Stage 5 completed - unlocking scroll');
                scrollLockRef.current = false;
                setIsAnimating(false);
            }, 800);
        }

        // Stage 6: back3 배경 + 텍스트 떨어지는 애니메이션 (83.33%)
        if (scrollProgress >= 0.83 && !showFinalText && !scrollLockRef.current) {
            console.log('Triggering Stage 6: Back3 + Text drop');
            scrollLockRef.current = true;
            setIsAnimating(true);
            setShowFinalText(true);
            setCurrentStage(6);

            // back3 배경 표시 후 0.7초 후에 텍스트 떨어뜨리기
            setTimeout(() => {
                console.log('Dropping text on back3');
                setFinalTextDropping(true);

                // 텍스트 떨어지는 애니메이션 완료 후 락 해제
                setTimeout(() => {
                    console.log('Stage 6 completed - unlocking scroll');
                    scrollLockRef.current = false;
                    setIsAnimating(false);
                }, 1500); // 텍스트 떨어지는 애니메이션 시간
            }, 700); // back3에서 0.7초 대기
        }

        // 역방향 스크롤 처리
        if (scrollProgress < 0.16) {
            setIsLogoMoved(false);
            setShowTyping(false);
            setCurrentStage(1);
            scrollLockRef.current = false;
            setIsAnimating(false);
        } else if (scrollProgress < 0.33) {
            setShowQuotes(false);
            setCurrentStage(2);
        } else if (scrollProgress < 0.5) {
            setShowPhotos(false);
            setCurrentStage(3);
        } else if (scrollProgress < 0.67) {
            setPhotosAnimatingOut(false);
            setQuotesAnimatingOut(false);
            setCurrentStage(4);
        } else if (scrollProgress < 0.83) {
            setShowFinalText(false);
            setFinalTextDropping(false);
            setCurrentStage(5);
        }
    }, [scrollProgress, isLogoMoved, showQuotes, showPhotos, photosAnimatingOut, quotesAnimatingOut, showFinalText]);

    // 이벤트 리스너 등록
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 휠 이벤트 (passive: false 중요!)
        container.addEventListener('wheel', handleScroll, { passive: false });

        // 키보드 이벤트
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            container.removeEventListener('wheel', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleScroll, handleKeyDown]);

    return (
        <>
            {/* 메인 컨테이너 */}
            <div ref={containerRef} className="relative min-h-screen">
                {/* BIBO 로고 */}
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                    <img
                        src="/image/logo.png"
                        alt="BIBO Logo"
                        className={`object-contain logo-super-slow ${isLogoMoved
                            ? 'w-32 h-32 transform -translate-x-[calc(50vw-8rem)] -translate-y-[calc(50vh-4rem)]'
                            : 'w-80 h-80 md:w-[32rem] md:h-[32rem] lg:w-[40rem] lg:h-[40rem] transform translate-x-0 translate-y-0'
                            }`}
                        style={{
                            transformOrigin: 'center center'
                        }}
                    />
                </div>

                {/* 타이핑 텍스트 */}
                {showTyping && (
                    <div className="fixed inset-0 pointer-events-none z-40">
                        <div className="absolute top-10 left-1/2 transform -translate-x-[700px] w-full max-w-8xl px-2">
                            <div className="typing-animation flex items-center gap-2">
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
                                    className="h-5 md:h-10 lg:h-14 object-contain transition-all duration-500 -mt-1 opacity-100"
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
                        {showQuotes && !quotesAnimatingOut && (
                            <>
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
                            </>
                        )}

                        {/* 사진들 - 명언을 덮도록 등장 */}
                        {showPhotos && !photosAnimatingOut && (
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

                {/* 세 번째 섹션 - back3 배경 + 떨어지는 텍스트 */}
                <section
                    className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${showFinalText ? 'opacity-100' : 'opacity-0 pointer-events-none'
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

                    {/* 중앙 텍스트 - 바운스 애니메이션 */}
                    {finalTextDropping && (
                        <div className="relative z-10 text-center">
                            <div className={`final-drop-container ${finalTextDropping ? 'is-visible' : ''}`}>
                                <h1 className="text-white font-colored-crayons text-4xl md:text-6xl lg:text-7xl leading-normal">
                                    <span className="drop-item item-1">TESLA, </span>
                                    <span className="drop-item item-2">META, </span>
                                    <span className="drop-item item-3">GOOGLE, </span>
                                    <span className="drop-item item-4">NVIDIA</span>
                                    <br />
                                    <span className="drop-item item-1 bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent text-5xl md:text-7xl lg:text-9xl inline-block py-8">
                                        BIBO
                                    </span>{' '}
                                    <span className="drop-item item-2 text-5xl md:text-7xl lg:text-9xl">LET'S GO</span>{' '}
                                    <img
                                        src="/image/rocket.png"
                                        alt="Rocket"
                                        className="drop-item item-3 inline-block w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 object-contain -mt-12"
                                        style={{ willChange: 'transform, opacity' }}
                                    />
                                </h1>
                            </div>
                        </div>
                    )}
                </section>

                {/* 오른쪽 스크롤 인디케이터 */}
                <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[9999]">
                    <div className="flex flex-col items-center gap-4">
                        {/* 진행도 표시 */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-white/60 text-xs font-medium">
                                {currentStage} / 6
                            </div>
                            <div className="w-1 h-24 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="w-full bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-500 ease-out"
                                    style={{ height: `${(scrollProgress * 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* 스크롤 힌트 */}
                        {!isAnimating && currentStage < 6 && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                                    <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
                                </div>
                                <div className="text-white/50 text-xs">
                                    SCROLL
                                </div>
                            </div>
                        )}

                        {/* 애니메이션 진행 중 */}
                        {isAnimating && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 border-2 border-blue-400 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                </div>
                                <div className="text-blue-400/70 text-xs">
                                    LOADING
                                </div>
                            </div>
                        )}

                        {/* 완료 표시 */}
                        {!isAnimating && currentStage === 6 && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 border-2 border-green-400 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                </div>
                                <div className="text-green-400/70 text-xs">
                                    DONE
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 스크롤 공간 확보를 위한 더미 div */}
                <div className="h-[600vh]"></div>
            </div>
        </>
    );
}