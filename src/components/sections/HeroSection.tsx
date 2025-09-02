'use client';

import { useState, useEffect } from 'react';
import { useScrollLock } from '@/hooks/use-scroll-lock';

export function HeroSection() {
    // Back1 및 사진 제어 상수
    const BACK1_START = 500;
    const BACK1_END = 1500; // 타이핑 구간 확장 반영
    const PHOTO_START_PROGRESS = 0.98; // 타이핑 완료 후 충분한 간격 확보
    const PHOTO_FADE_END_Y = 4800; // 사진 페이드인 완료 Y (더 느리게: 더 긴 거리)

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

    // Scroll-proportional fade and typing for quotes
    const [quotesFade, setQuotesFade] = useState(0);
    const [quotesTyping, setQuotesTyping] = useState(0);
    // Scroll-proportional opacity for photos
    const [photosOpacity, setPhotosOpacity] = useState(0);


    // 스크롤 잠금 기능
    const { lockScroll, unlockScroll } = useScrollLock();

    // 페이지 로드 시 맨 위로 스크롤
    useEffect(() => {
        // 페이지 로드 완료 후 맨 위로 스크롤
        window.scrollTo(0, 0);

        // 브라우저의 스크롤 복원 기능 비활성화
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            // 디바운싱으로 스크롤 이벤트 최적화
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollY = window.scrollY;

                // 스크롤 방향 감지
                const direction = scrollY > lastScrollY ? 'down' : 'up';
                setScrollDirection(direction);
                setLastScrollY(scrollY);

                // 위로 스크롤할 때는 잠금을 적용하지 않음 (조건부 잠금만 적용)


            // back1 진행도 및 명언 컨테이너 페이드/타이핑 진행도 계산
            const sectionStart = BACK1_START; // back1 시작 기준
            const sectionEnd = BACK1_END;  // back1 종료 기준(확대)
            const span = sectionEnd - sectionStart;
            const raw = (scrollY - sectionStart) / span;
            const p = Math.max(0, Math.min(1, raw)); // 0~1 정규화
            const fade = Math.max(0, Math.min(1, (p - 0.05) / 0.10)); // 0.05~0.15 → 0~1
            const typing = Math.max(0, Math.min(1, (p - 0.05) / 0.90)); // 0.05~0.95 → 0~1
            setQuotesFade(fade);
            setQuotesTyping(typing);

            // 사진 스크롤-비례 페이드인(그 자리에서 선명해짐)
            // 끝 지점이 너무 멀어 도달 불가해지는 문제를 방지하기 위해 현재 페이지의 최대 스크롤 한계 내로 클램핑
            const photoFadeStartY = BACK1_START + (BACK1_END - BACK1_START) * PHOTO_START_PROGRESS; // 약 1480
            const maxScrollableY = Math.max(
                0,
                (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight
            );
            const photoFadeEndY = Math.min(
                PHOTO_FADE_END_Y,
                Math.max(BACK1_END + 100, maxScrollableY - 50)
            );
            const photosOpacityProgress = Math.max(
                0,
                Math.min(1, (scrollY - photoFadeStartY) / Math.max(1, photoFadeEndY - photoFadeStartY))
            );
            setPhotosOpacity(photosOpacityProgress);

            // 타이핑이 완료된 후에만 명언 섹션 표시 가능 (한번 숨겨지면 다시 나타나지 않음)
            if (typingComplete && !quotesHidden) {
                setShowQuotes(scrollY > 500);
            }

            // 명언 타이핑 완료 + 진행도 임계 이상일 때 사진 1회 등장(섹션 내 고정)
            if (showQuotes && !photosHidden && !showPhotos) {
                const canShowPhotos = typing >= 1 && p >= PHOTO_START_PROGRESS;
                if (canShowPhotos) {
                    setPhotosAnimatingOut(false);
                    setShowPhotos(true);
                    setPhotosShowTime(Date.now()); // 사진이 나타난 시간 기록
                }
            }

            // 사진이 나타난 후 충분한 시간 경과하고 opacity가 완전히 1이 된 후에만 페이드아웃
            if (showPhotos && photosShowTime && photosOpacity >= 1.0) {
                const timeElapsed = Date.now() - photosShowTime;
                if (timeElapsed >= 3000 && !photosAnimatingOut && !quotesAnimatingOut) { // 3초 이상 경과 (사진을 충분히 보여주기)
                    setPhotosAnimatingOut(true);
                    // 페이드아웃 애니메이션 완료 후 사진만 숨김 (배경은 유지)

                    setTimeout(() => {
                        setShowBack3(false);
                        setBack3AnimatingOut(false);
                        setBack1OnlyTime(Date.now()); // back1으로 돌아간 시간 기록
                    }, 1000); // 애니메이션 지속시간과 일치
                }

                // back1 배경에서 위로 스크롤할 때 사진과 명언 복원
                if (quotesHidden && photosHidden && scrollY <= 1800 && backgroundOnlyTime) {
                    const backgroundTimeElapsed = Date.now() - backgroundOnlyTime;
                    if (backgroundTimeElapsed >= 500 || direction === 'up') { // 배경에서 0.5초 이상 대기했거나 위로 스크롤하면
                        setQuotesHidden(false);
                        setPhotosHidden(false);
                        setBackgroundOnlyTime(null);
                        setBack1OnlyTime(null); // back1 대기 시간도 초기화
                        setQuotesAnimatingOut(false);
                        setPhotosAnimatingOut(false);
                    }
                }

                // 위로 스크롤할 때 사진 관련 상태들 초기화
                if (direction === 'up' && scrollY <= 1000) {
                    if (showPhotos) {
                        setShowPhotos(false);
                        setPhotosAnimatingOut(false);
                        setPhotosShowTime(null);

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

            // back1 배경에서 위로 스크롤할 때 사진 복원 (명언은 항상 유지)
            if (/* quotesHidden && */ photosHidden && scrollY <= BACK1_END && backgroundOnlyTime) {
                const backgroundTimeElapsed = Date.now() - backgroundOnlyTime;
                if (backgroundTimeElapsed >= 1000) { // 배경에서 1초 이상 대기했었다면
                    setPhotosHidden(false);
                    setBackgroundOnlyTime(null);
                    setBack1OnlyTime(null); // back1 대기 시간도 초기화
                    setPhotosAnimatingOut(false);
                }
            }

            // 위에서 진행도 계산 및 상태 반영 완료

        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [typingComplete, showQuotes, showPhotos, photosAnimatingOut, quotesAnimatingOut, photosShowTime, quotesHidden, backgroundOnlyTime, showBack3, photosHidden, back1OnlyTime, back3AnimatingOut, showFinalText, canShowFinalText, finalTextAnimatingOut, typingResetCounter, lastScrollY, lockScroll, unlockScroll]);

    // 타이핑 애니메이션 중 자동 스크롤 잠금
    useEffect(() => {
        if (showContent && !typingComplete && scrollDirection === 'down') {
            // 타이핑 시작 시 스크롤 잠금 (아래로 스크롤할 때만)
            lockScroll();
        } else if (typingComplete) {
            // 타이핑 완료 시 스크롤 해제
            unlockScroll();
        }
    }, [showContent, typingComplete, scrollDirection, lockScroll, unlockScroll]);





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
                                key={`typing-${typingResetCounter}`}
                                className={`${isFirstTypingAttempt ? 'typing-animation' : 'typing-animation-no-delay'} flex items-center gap-2`}
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
                    {/* 4개 명언 분산 배치 (타이핑) */}
                    <div className="relative z-10 w-full h-screen px-4" style={{ opacity: quotesFade }}>
                        {/* Desktop 2x2 고정 위치 */}
                        <div className="hidden md:block">
                            {/* 첫 번째 명언 - 좌상단 */}
                            <div className="absolute top-56 left-[240px] max-w-2xl">
                                <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                    {(() => {
                                        const lines = [
                                            '"Being the richest man in the cemetery',
                                            "doesn't matter to me. Going to bed at",
                                            "night saying we've done something",
                                            "wonderful... that's what matters to me.",
                                        ];
                                        const full = lines.join('\n');
                                        const cut = Math.floor(full.length * quotesTyping);
                                        const visible = full.slice(0, cut).split('\n');
                                        return (
                                            <span>
                                                {visible.map((line, i) => (
                                                    <span key={i}>
                                                        {line}
                                                        {i < visible.length - 1 ? <br /> : null}
                                                    </span>
                                                ))}
                                            </span>
                                        );
                                    })()}
                                </blockquote>
                            </div>


                            {/* 두 번째 명언 - 우상단 */}
                            <div className="absolute top-[260px] right-[400px] max-w-2xl">
                                <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                    {(() => {
                                        const lines = [
                                            '"I\'d rather be optimistic and wrong',
                                            'than pessimistic and right."',
                                        ];
                                        const full = lines.join('\n');
                                        const cut = Math.floor(full.length * quotesTyping);
                                        const visible = full.slice(0, cut).split('\n');
                                        return (
                                            <span>
                                                {visible.map((line, i) => (
                                                    <span key={i}>
                                                        {line}
                                                        {i < visible.length - 1 ? <br /> : null}
                                                    </span>
                                                ))}
                                            </span>
                                        );
                                    })()}
                                </blockquote>
                            </div>

                            {/* 세 번째 명언 - 좌하단 */}
                            <div className="absolute bottom-[200px] left-[240px] max-w-2xl">
                                <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                    {(() => {
                                        const lines = [
                                            '"The biggest risk is not taking any risk"',
                                        ];
                                        const full = lines.join('\n');
                                        const cut = Math.floor(full.length * quotesTyping);
                                        const visible = full.slice(0, cut).split('\n');
                                        return (
                                            <span>
                                                {visible.map((line, i) => (
                                                    <span key={i}>{line}</span>
                                                ))}
                                            </span>
                                        );
                                    })()}
                                </blockquote>
                            </div>

                            {/* 네 번째 명언 - 우하단 */}
                            <div className="absolute bottom-[200px] right-[400px] max-w-2xl">
                                <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons">
                                    {(() => {
                                        const lines = [
                                            '"If you can\'t tolerate critics, don\'t',
                                            'do anything new or interesting."',
                                        ];
                                        const full = lines.join('\n');
                                        const cut = Math.floor(full.length * quotesTyping);
                                        const visible = full.slice(0, cut).split('\n');
                                        return (
                                            <span>
                                                {visible.map((line, i) => (
                                                    <span key={i}>
                                                        {line}
                                                        {i < visible.length - 1 ? <br /> : null}
                                                    </span>
                                                ))}
                                            </span>
                                        );
                                    })()}
                                </blockquote>
                            </div>
                        </div>

                        {/* Mobile 1열 스택 */}
                        <div className="md:hidden grid grid-cols-1 gap-6 px-6 py-24">
                            {[0, 1, 2, 3].map((idx) => (
                                <blockquote key={idx} className="text-white text-lg leading-relaxed font-crayons">
                                    {(() => {
                                        const presets = [
                                            [
                                                '"Being the richest man in the cemetery',
                                                "doesn't matter to me. Going to bed at",
                                                "night saying we've done something",
                                                "wonderful... that's what matters to me.",
                                            ],
                                            [
                                                '"I\'d rather be optimistic and wrong',
                                                'than pessimistic and right."',
                                            ],
                                            [
                                                '"The biggest risk is not taking any risk"',
                                            ],
                                            [
                                                '"If you can\'t tolerate critics, don\'t',
                                                'do anything new or interesting."',
                                            ],
                                        ];
                                        const lines = presets[idx] as string[];
                                        const full = lines.join('\n');
                                        const cut = Math.floor(full.length * quotesTyping);
                                        const visible = full.slice(0, cut).split('\n');
                                        return (
                                            <span>
                                                {visible.map((line, i) => (
                                                    <span key={i}>
                                                        {line}
                                                        {i < visible.length - 1 ? <br /> : null}
                                                    </span>
                                                ))}
                                            </span>
                                        );
                                    })()}
                                </blockquote>
                            ))}
                        </div>


                        {/* 사진들 - 명언을 덮도록 등장 */}
                        {showPhotos && (
                            <>
                                {/* 첫 번째 사진 - 스티브 잡스 */}

                                <div className={`absolute top-[150px] left-[200px] z-20 ${photosAnimatingOut ? 'animate-fade-out' : ''}`}
                                     style={{ opacity: photosAnimatingOut ? undefined : photosOpacity }}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/apple.png"
                                            alt="Steve Jobs"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 두 번째 사진 - 엘론 머스크 */}

                                <div className={`absolute top-[150px] right-[300px] z-20 ${photosAnimatingOut ? 'animate-fade-out' : ''}`}
                                     style={{ opacity: photosAnimatingOut ? undefined : photosOpacity }}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/tesla.png"
                                            alt="Elon Musk"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 세 번째 사진 - 마크 저커버그 */}

                                <div className={`absolute bottom-[30px] left-[200px] z-20 ${photosAnimatingOut ? 'animate-fade-out' : ''}`}
                                     style={{ opacity: photosAnimatingOut ? undefined : photosOpacity }}>
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-2xl w-96 lg:w-[600px]">
                                        <img
                                            src="/image/meta.png"
                                            alt="Mark Zuckerberg"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 네 번째 사진 - 제프 베조스 */}
                                <div className={`absolute bottom-[30px] right-[300px] z-20 ${photosAnimatingOut ? 'animate-fade-out' : ''}`}
                                     style={{ opacity: photosAnimatingOut ? undefined : photosOpacity }}>
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
                            <div className={`${finalTextAnimatingOut ? 'animate-fade-out' : 'animate-slide-up-from-bottom-delayed'}`}>
                                <h1 className="text-white font-colored-crayons text-4xl md:text-6xl lg:text-7xl leading-normal">
                                    TESLA, META, GOOGLE, NVIDIA
                                    <br />
                                    <span className="bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent text-5xl md:text-7xl lg:text-9xl inline-block py-8">
                                        BIBO
                                    </span>{' '}
                                    <span className="text-5xl md:text-7xl lg:text-9xl">LET'S GO</span>{' '}
                                    <img
                                        src="/image/rocket.png"
                                        alt="Rocket"
                                        className="inline-block w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 object-contain  -mt-12"
                                    />
                                </h1>
                            </div>
                        </div>
                    )}
                </section>



                {/* 스크롤 공간 확보를 위한 더미 div */}
                <div className="h-[700vh]"></div>
            </div>
        </>
    );
}
