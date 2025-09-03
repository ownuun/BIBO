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
    const [finalTextShrinking, setFinalTextShrinking] = useState(false);
    const [showAboutSection, setShowAboutSection] = useState(false);
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

            // 명언 타이핑 애니메이션 완료 후 락 해제 (4줄 명언이 가장 오래 걸림: 0.5s * 4줄 = 2s, 1초 전에 전환 가능)
            setTimeout(() => {
                console.log('Stage 3 completed - unlocking scroll');
                scrollLockRef.current = false;
                setIsAnimating(false);
            }, 1000);
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

            // back3 배경 표시 후 즉시 텍스트 표시
            setTimeout(() => {
                console.log('Showing text on back3');
                setFinalTextDropping(true);

                // 페이드인 애니메이션 완료 후 락 해제
                setTimeout(() => {
                    console.log('Stage 6 completed - unlocking scroll');
                    scrollLockRef.current = false;
                    setIsAnimating(false);
                }, 1000); // 페이드인 애니메이션 시간
            }, 100); // 짧은 대기 시간
        }

        // Stage 7: About 섹션 (100%)
        if (scrollProgress >= 1.0 && !showAboutSection && !scrollLockRef.current) {
            console.log('Triggering Stage 7: About Section');
            scrollLockRef.current = true;
            setIsAnimating(true);

            // 먼저 텍스트를 작아지면서 위로 이동
            setFinalTextShrinking(true);

            // 축소 애니메이션과 동시에 About 섹션 표시
            setTimeout(() => {
                setShowAboutSection(true);
                setCurrentStage(7);

                // About 섹션 애니메이션 완료 후 락 해제
                setTimeout(() => {
                    console.log('Stage 7 completed - unlocking scroll');
                    scrollLockRef.current = false;
                    setIsAnimating(false);
                }, 1000);
            }, 100); // 짧은 지연으로 동시에 시작
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
        } else if (scrollProgress < 1.0) {
            setShowAboutSection(false);
            setFinalTextShrinking(false);
            setCurrentStage(6);
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
                        {showQuotes && (
                            <>
                                {/* 첫 번째 명언 - 좌상단 */}
                                <div className={`absolute top-60 left-[320px] max-w-2xl ${quotesAnimatingOut
                                    ? 'opacity-0 transform -translate-y-20'
                                    : 'opacity-100 transform translate-y-0'
                                    }`}>
                                    <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                        <div className="quote-typing-multiline">
                                            <div className="line">"Being the richest man in the cemetery</div>
                                            <div className="line">doesn't matter to me. Going to bed at</div>
                                            <div className="line">night saying we've done something</div>
                                            <div className="line">wonderful... that's what matters to me."</div>
                                        </div>
                                    </blockquote>
                                </div>

                                {/* 두 번째 명언 - 우상단 */}
                                <div className={`absolute top-[260px] right-[480px] max-w-2xl ${quotesAnimatingOut
                                    ? 'opacity-0 transform -translate-y-20'
                                    : 'opacity-100 transform translate-y-0'
                                    }`}>
                                    <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                        <div className="quote-typing-multiline">
                                            <div className="line">"I'd rather be optimistic and wrong</div>
                                            <div className="line">than pessimistic and right."</div>
                                        </div>
                                    </blockquote>
                                </div>

                                {/* 세 번째 명언 - 좌하단 */}
                                <div className={`absolute bottom-[200px] left-[320px] max-w-2xl ${quotesAnimatingOut
                                    ? 'opacity-0 transform -translate-y-20'
                                    : 'opacity-100 transform translate-y-0'
                                    }`}>
                                    <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                        <div className="quote-typing" style={{ animationDelay: '0.4s' }}>
                                            "The biggest risk is not taking any risk"
                                        </div>
                                    </blockquote>
                                </div>

                                {/* 네 번째 명언 - 우하단 */}
                                <div className={`absolute bottom-[200px] right-[480px] max-w-2xl ${quotesAnimatingOut
                                    ? 'opacity-0 transform -translate-y-20'
                                    : 'opacity-100 transform translate-y-0'
                                    }`}>
                                    <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                        <div className="quote-typing-multiline">
                                            <div className="line">"If you can't tolerate critics, don't</div>
                                            <div className="line">do anything new or interesting."</div>
                                        </div>
                                    </blockquote>
                                </div>
                            </>
                        )}

                        {/* 사진들 - 명언을 덮도록 등장 */}
                        {showPhotos && (
                            <>
                                {/* 첫 번째 사진 - 스티브 잡스 */}
                                <div className={`absolute top-[150px] left-[250px] z-20 transition-all duration-1000 ease-out ${photosAnimatingOut
                                    ? 'opacity-0 transform -translate-y-20'
                                    : 'opacity-100 transform translate-y-0 animate-fade-in'
                                    }`}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-[550px] lg:w-[750px] xl:w-[850px]">
                                        <img
                                            src="/image/apple.png"
                                            alt="Steve Jobs"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 두 번째 사진 - 엘론 머스크 */}
                                <div className={`absolute top-[150px] right-[350px] z-20 transition-all duration-1000 ease-out ${photosAnimatingOut
                                    ? 'opacity-0 transform -translate-y-20'
                                    : 'opacity-100 transform translate-y-0 animate-fade-in'
                                    }`}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-[550px] lg:w-[750px] xl:w-[850px]">
                                        <img
                                            src="/image/tesla.png"
                                            alt="Elon Musk"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 세 번째 사진 - 마크 저커버그 */}
                                <div className={`absolute bottom-[30px] left-[250px] z-20 transition-all duration-1000 ease-out ${photosAnimatingOut
                                    ? 'opacity-0 transform -translate-y-20'
                                    : 'opacity-100 transform translate-y-0 animate-fade-in'
                                    }`}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-[550px] lg:w-[750px] xl:w-[850px]">
                                        <img
                                            src="/image/meta.png"
                                            alt="Mark Zuckerberg"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 네 번째 사진 - 제프 베조스 */}
                                <div className={`absolute bottom-[30px] right-[350px] z-20 transition-all duration-1000 ease-out ${photosAnimatingOut
                                    ? 'opacity-0 transform -translate-y-20'
                                    : 'opacity-100 transform translate-y-0 animate-fade-in'
                                    }`}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-[550px] lg:w-[750px] xl:w-[850px]">
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
                </section>

                {/* 중앙 텍스트 - 드롭 바운스 애니메이션 */}
                {finalTextDropping && (
                    <div className="fixed inset-0 z-30">
                        <div className={`final-drop-container is-visible text-super-slow ${finalTextShrinking
                            ? 'fixed top-24 left-1/2 transform -translate-x-1/2 scale-50'
                            : 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center scale-100'
                            }`}>
                            <h1 className="text-white font-colored-crayons text-4xl md:text-6xl lg:text-7xl text-center select-text mb-4">
                                <span className="drop-item item-1">TESLA, </span>
                                <span className="drop-item item-2">META, </span>
                                <span className="drop-item item-3">GOOGLE, </span>
                                <span className="drop-item item-4">NVIDIA</span>
                            </h1>
                            <h1 className="text-white font-colored-crayons text-5xl md:text-7xl lg:text-9xl text-center select-text">
                                <span className="bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-item item-1">
                                    BIBO
                                </span>
                                <span className="text-white drop-item item-2"> LET'S GO</span>
                                <img
                                    src="/image/rocket.png"
                                    alt="Rocket"
                                    className="w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 object-contain drop-item item-3 inline-block ml-2"
                                />
                            </h1>
                        </div>
                    </div>
                )}



                {/* 네 번째 섹션 - About 섹션 */}
                <section
                    className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${showAboutSection ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    style={{
                        backgroundImage: 'url(/image/back3.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 7
                    }}
                >
                    {/* 어두운 오버레이 */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>



                    {/* 메인 콘텐츠 - 2명 개별 소개 */}
                    {showAboutSection && (
                        <div className="relative z-10 w-full h-full animate-fade-in">
                            {/* 왼쪽 섹션 - 첫 번째 멤버 */}
                            <div className="absolute left-[550px] top-0 w-1/4 h-full flex items-center justify-center">
                                <div className="text-white text-center space-y-8 w-full">
                                    {/* 첫 번째 멤버 사진 */}
                                    <div className="relative flex justify-center">
                                        <div className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center">
                                            <div className="text-white text-center">
                                                <div className="text-7xl md:text-8xl mb-4">👨‍💻</div>
                                                <p className="text-xl md:text-2xl font-medium">Frontend Developer</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 첫 번째 멤버 소개 */}
                                    <div>
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-colored-crayons mb-4">
                                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Frontend</span> Specialist
                                        </h3>
                                        <p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-md mx-auto">
                                            사용자 경험을 최우선으로 생각하는 프론트엔드 개발자.
                                            React, Next.js, TypeScript로 직관적이고 아름다운 인터페이스를 만듭니다.
                                        </p>
                                    </div>

                                    {/* 기술 스택 */}
                                    <div className="space-y-3">
                                        <h4 className="text-xl md:text-2xl font-semibold text-blue-300">Tech Stack</h4>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm md:text-base">React</span>
                                            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm md:text-base">Next.js</span>
                                            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm md:text-base">TypeScript</span>
                                            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm md:text-base">TailwindCSS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽 섹션 - 두 번째 멤버 */}
                            <div className="absolute right-[550px] top-0 w-1/4 h-full flex items-center justify-center">
                                <div className="text-white text-center space-y-8 w-full">
                                    {/* 두 번째 멤버 사진 */}
                                    <div className="relative flex justify-center">
                                        <div className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl shadow-2xl flex items-center justify-center">
                                            <div className="text-white text-center">
                                                <div className="text-7xl md:text-8xl mb-4">👨‍💻</div>
                                                <p className="text-xl md:text-2xl font-medium">Backend Developer</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 두 번째 멤버 소개 */}
                                    <div>
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-colored-crayons mb-4">
                                            <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">Backend</span> Architect
                                        </h3>
                                        <p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-md mx-auto">
                                            확장 가능하고 안정적인 서버 인프라를 구축하는 백엔드 개발자.
                                            Node.js, 데이터베이스, 클라우드 기술로 견고한 시스템을 만듭니다.
                                        </p>
                                    </div>

                                    {/* 기술 스택 */}
                                    <div className="space-y-3">
                                        <h4 className="text-xl md:text-2xl font-semibold text-green-300">Tech Stack</h4>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm md:text-base">Node.js</span>
                                            <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm md:text-base">Supabase</span>
                                            <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm md:text-base">PostgreSQL</span>
                                            <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm md:text-base">Cloud</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 중앙 하단 컨텍트 버튼 */}
                            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
                                <button className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-colored-crayons py-5 px-16 rounded-full text-2xl md:text-4xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-red-500/30 overflow-hidden group">
                                    <span className="relative z-10">Get in Touch</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* 미니멀 도트 네비게이션 */}
                <div className="fixed right-12 top-1/2 transform -translate-y-1/2 z-[9999]">
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3, 4, 5, 6, 7].map((stage) => (
                            <div
                                key={stage}
                                className={`w-5 h-5 rounded-full transition-all duration-300 ${currentStage <= 2
                                    ? currentStage === stage
                                        ? 'bg-black scale-125 shadow-lg shadow-black/30'
                                        : currentStage > stage
                                            ? 'bg-black/60 scale-100'
                                            : 'bg-black/20 scale-75'
                                    : currentStage === stage
                                        ? 'bg-white scale-125 shadow-lg shadow-white/30'
                                        : currentStage > stage
                                            ? 'bg-white/60 scale-100'
                                            : 'bg-white/20 scale-75'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* 스크롤 공간 확보를 위한 더미 div */}
                <div className="h-[700vh]"></div>
            </div>
        </>
    );
}