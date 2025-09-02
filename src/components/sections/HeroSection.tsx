'use client';

import { useState, useEffect, useRef } from 'react';

export function HeroSection() {
    // Back1 및 사진 제어 상수
    const BACK1_START = 500;
    const BACK1_END = 1500; // 타이핑 구간 확장 반영
    const PHOTO_START_PROGRESS = 0.98; // 타이핑 완료 후 충분한 간격 확보
    const PHOTO_FADE_END_Y = 4800; // 사진 페이드인 완료 Y (더 느리게: 더 긴 거리)
    // back3 추가 스크롤을 위한 꼬리 공간(px)
    const BACK3_SCROLL_TAIL_PX = 2200; // 텍스트 이동+프로필 등장에 충분한 여유

    const [isScrolled, setIsScrolled] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [showQuotes, setShowQuotes] = useState(false);
    const [typingComplete, setTypingComplete] = useState(false);
    const [showPhotos, setShowPhotos] = useState(false);
    const [photosAnimatingOut, setPhotosAnimatingOut] = useState(false);
    const [quotesAnimatingOut, setQuotesAnimatingOut] = useState(false);
    const [quotesHidden, setQuotesHidden] = useState(false);
    const [backgroundOnlyTime, setBackgroundOnlyTime] = useState<number | null>(null);
    const [showBack3, setShowBack3] = useState(false);
    const [photosHidden, setPhotosHidden] = useState(false);
    const [back1OnlyTime, setBack1OnlyTime] = useState<number | null>(null);
    const [back3AnimatingOut, setBack3AnimatingOut] = useState(false);
    const [showFinalText, setShowFinalText] = useState(false);
    // back3 추가 페이즈: 텍스트 이동 및 프로필 등장
    const [back3EnterY, setBack3EnterY] = useState<number | null>(null);
    const [finalMoveProgress, setFinalMoveProgress] = useState(0); // 0~1, 텍스트 상단 이동
    const [profilesProgress, setProfilesProgress] = useState(0);    // 0~1, 프로필 슬라이드업
    const [showProfiles, setShowProfiles] = useState(false);
    const [condenseProgress, setCondenseProgress] = useState(0);    // 0~1, 2줄 → 1줄 축소/응축 진행도
    // Scroll-proportional fade for quotes
    const [quotesFade, setQuotesFade] = useState(0);
    // Scroll-proportional opacity for photos
    const [photosOpacity, setPhotosOpacity] = useState(0);
    // 명언 타이핑 애니메이션 상태
    const [quote1Text, setQuote1Text] = useState('');
    const [quote2Text, setQuote2Text] = useState('');
    const [quote3Text, setQuote3Text] = useState('');
    const [quote4Text, setQuote4Text] = useState('');
    const back3SentinelRef = useRef<HTMLDivElement | null>(null);

    // 명언 원본 텍스트
    const quotes = [
        '"Being the richest man in the cemetery\ndoesn\'t matter to me. Going to bed at\nnight saying we\'ve done something\nwonderful... that\'s what matters to me."',
        '"I\'d rather be optimistic and wrong\nthan pessimistic and right."',
        '"The biggest risk is not taking any risk"',
        '"If you can\'t tolerate critics, don\'t\ndo anything new or interesting."'
    ];

    // 타이핑 애니메이션 함수
    const typeText = (text: string, setter: (text: string) => void, delay: number = 0) => {
        setTimeout(() => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setter(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 50); // 50ms마다 한 글자씩
        }, delay);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // 스크롤이 50px 이상 되면 로고를 축소하고 이동
            const scrolled = scrollY > 50;
            setIsScrolled(scrolled);

            // 스크롤 상태에 따라 콘텐츠 표시/숨김
            setShowContent(scrolled);

            // back1 진행도 및 명언 컨테이너 페이드 진행도 계산
            const sectionStart = BACK1_START; // back1 시작 기준
            const sectionEnd = BACK1_END;  // back1 종료 기준(확대)
            const span = sectionEnd - sectionStart;
            const raw = (scrollY - sectionStart) / span;
            const p = Math.max(0, Math.min(1, raw)); // 0~1 정규화
            const fade = Math.max(0, Math.min(1, (p - 0.05) / 0.10)); // 0.05~0.15 → 0~1
            setQuotesFade(fade);

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

            // 명언 섹션 표시 후 일정 시간 지나면 사진 등장
            if (showQuotes && !photosHidden && !showPhotos) {
                const canShowPhotos = p >= PHOTO_START_PROGRESS;
                if (canShowPhotos) {
                    setPhotosAnimatingOut(false);
                    setShowPhotos(true);
                }
            }

            // back3으로 전환 트리거는 아래 useEffect에서 시간/하단 근접 여부로도 점검

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

            // back3 진입 이후 추가 스크롤에 따른 파이널 텍스트 이동 및 프로필 등장 진행도 계산
            if (showBack3 && back3EnterY !== null) {
                const moveStart = back3EnterY + 150;   // 진입 후 150px부터 이동 시작
                const moveEnd = moveStart + 800;       // 800px 구간 동안 상단으로 이동
                const rawMove = (scrollY - moveStart) / (moveEnd - moveStart);
                const moveP = Math.max(0, Math.min(1, rawMove));
                setFinalMoveProgress(moveP);

                // 2줄 → 1줄 응축 구간
                const condenseStart = moveStart + 100; // 이동 초반부에 함께 축소 시작
                const condenseEnd = condenseStart + 600;
                const rawCondense = (scrollY - condenseStart) / (condenseEnd - condenseStart);
                const condenseP = Math.max(0, Math.min(1, rawCondense));
                setCondenseProgress(condenseP);

                const profilesStart = moveEnd + 120;   // 텍스트 이동 완료 후 약간의 간격
                const profilesEnd = profilesStart + 700; // 700px 동안 프로필 슬라이드업
                const rawProfiles = (scrollY - profilesStart) / (profilesEnd - profilesStart);
                const profP = Math.max(0, Math.min(1, rawProfiles));
                setProfilesProgress(profP);
                if (profP > 0 && !showProfiles) setShowProfiles(true);
                if (profP === 0 && scrollY < profilesStart - 10 && showProfiles) setShowProfiles(false);
            } else {
                setFinalMoveProgress(0);
                setProfilesProgress(0);
                setCondenseProgress(0);
                if (showProfiles) setShowProfiles(false);
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
        return () => window.removeEventListener('scroll', handleScroll);
    }, [typingComplete, showQuotes, showPhotos, photosAnimatingOut, quotesAnimatingOut, quotesHidden, backgroundOnlyTime, showBack3, photosHidden, back1OnlyTime, back3AnimatingOut, showFinalText]);

    // IntersectionObserver로 back3 전환을 순수 스크롤로 보장
    useEffect(() => {
        const target = back3SentinelRef.current;
        if (!target) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // back3 진입: 사진은 페이드아웃, back3 표시
                        if (showPhotos && !photosAnimatingOut) {
                            setPhotosAnimatingOut(true);
                            setTimeout(() => {
                                setShowPhotos(false);
                                setPhotosAnimatingOut(false);
                                setPhotosHidden(true);
                                setBackgroundOnlyTime(Date.now());
                                setBack1OnlyTime(Date.now());
                            }, 800);
                        }
                        if (!showBack3) {
                            setShowBack3(true);
                            // back3 진입 시점 기록
                            setBack3EnterY(window.scrollY);
                            setTimeout(() => setShowFinalText(true), 1200);
                        }
                    }
                });
            },
            { root: null, threshold: 0, rootMargin: '0px 0px -20% 0px' }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [showPhotos, photosAnimatingOut, showBack3]);

    // 명언 섹션 표시 시 타이핑 애니메이션 시작
    useEffect(() => {
        if (showQuotes) {
            // 기존 텍스트 초기화
            setQuote1Text('');
            setQuote2Text('');
            setQuote3Text('');
            setQuote4Text('');
            
            // 순차적으로 타이핑 시작
            typeText(quotes[0], setQuote1Text, 200);    // 0.2초 후
            typeText(quotes[1], setQuote2Text, 600);    // 0.6초 후
            typeText(quotes[2], setQuote3Text, 1000);   // 1초 후
            typeText(quotes[3], setQuote4Text, 1400);   // 1.4초 후
        }
    }, [showQuotes]);



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
                    {/* 4개 명언 분산 배치 (타이핑) */}
                    <div className="relative z-10 w-full h-screen px-4" style={{ opacity: quotesFade }}>
                        {/* Desktop 2x2 고정 위치 */}
                        <div className="hidden md:block">
                            {/* 첫 번째 명언 - 좌상단 */}
                            <div className="absolute top-56 left-[240px] max-w-2xl">
                                <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons whitespace-pre-line">
                                    {quote1Text}
                                </blockquote>
                            </div>

                            {/* 두 번째 명언 - 우상단 */}
                            <div className="absolute top-[260px] right-[400px] max-w-2xl">
                                <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons whitespace-pre-line">
                                    {quote2Text}
                                </blockquote>
                            </div>

                            {/* 세 번째 명언 - 좌하단 */}
                            <div className="absolute bottom-[200px] left-[240px] max-w-2xl">
                                <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons whitespace-pre-line">
                                    {quote3Text}
                                </blockquote>
                            </div>

                            {/* 네 번째 명언 - 우하단 */}
                            <div className="absolute bottom-[200px] right-[400px] max-w-2xl">
                                <blockquote className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crayons whitespace-pre-line">
                                    {quote4Text}
                                </blockquote>
                            </div>
                        </div>

                        {/* Mobile 1열 스택 */}
                        <div className="md:hidden grid grid-cols-1 gap-6 px-6 py-24">
                            <blockquote className="text-white text-lg leading-relaxed font-crayons whitespace-pre-line">
                                {quote1Text}
                            </blockquote>
                            <blockquote className="text-white text-lg leading-relaxed font-crayons whitespace-pre-line">
                                {quote2Text}
                            </blockquote>
                            <blockquote className="text-white text-lg leading-relaxed font-crayons whitespace-pre-line">
                                {quote3Text}
                            </blockquote>
                            <blockquote className="text-white text-lg leading-relaxed font-crayons whitespace-pre-line">
                                {quote4Text}
                            </blockquote>
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

                    {/* 중앙 텍스트: 드롭-바운스 애니메이션 */}
                    {showFinalText && (
                        <div className="relative z-10 w-full h-full">
                            {/* 텍스트 래퍼: 중앙에서 시작하여 스크롤에 따라 상단으로 이동 */}
                            {(() => {
                                const maxLiftVh = 32; // 상단으로 올릴 정도 (vh)
                                const translateY = -(finalMoveProgress * maxLiftVh);
                                const minScale = 0.58;
                                const scale = 1 - (1 - minScale) * condenseProgress; // 1 → 0.58
                                const letter = `${Math.max(0, 0.02 - 0.02 * condenseProgress)}em`; // 자간 살짝 축소
                                const lineH = 1.1 - 0.2 * condenseProgress; // 줄간격 낮춤
                                const transform = `translateY(${translateY}vh) scale(${scale})`;
                                return (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center pointer-events-none" style={{ transform, transition: 'transform 40ms linear', willChange: 'transform' }}>
                                            <div className={`final-drop-container ${showFinalText ? 'is-visible' : ''}`}>
                                                <h1 className={`final-text ${condenseProgress > 0.7 ? 'is-condensed' : ''} text-white font-colored-crayons text-4xl md:text-6xl lg:text-7xl leading-tight`}
                                                    style={{ letterSpacing: letter as any, lineHeight: lineH, ['--condense' as any]: condenseProgress }}
                                                >
                                                    <span className="drop-item item-1 seg seg-base">TESLA, META, GOOGLE, NVIDIA</span>
                                                    <span className={`line-breaker`} aria-hidden="true"></span>
                                                    <span className="drop-item item-2 seg seg-big">
                                                        <span className="seg-big-inner bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent text-5xl md:text-7xl lg:text-9xl">
                                                            BIBO
                                                        </span>
                                                    </span>{' '}
                                                    <span className="drop-item item-3 seg seg-big">
                                                        <span className="seg-big-inner text-5xl md:text-7xl lg:text-9xl">LET'S GO</span>
                                                    </span>{' '}
                                                    <span className="drop-item item-4 seg seg-emoji">
                                                        <span className="seg-emoji-inner inline-block text-6xl md:text-8xl lg:text-9xl">🚀</span>
                                                    </span>
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* 프로필 섹션: 아래에서 위로 슬라이드업 */}
                            {showProfiles && (
                                <div className="absolute inset-0 flex items-end justify-center pb-[12vh]">
                                    {(() => {
                                        const startOffsetVh = 18; // 아래에서 시작하는 오프셋
                                        const ty = (1 - profilesProgress) * startOffsetVh;
                                        const opacity = Math.min(1, Math.max(0, profilesProgress));
                                        return (
                                            <div className="w-full max-w-6xl px-6" style={{ transform: `translateY(${ty}vh)`, opacity, transition: 'transform 40ms linear, opacity 120ms linear', willChange: 'transform, opacity' }}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {/* 좌측 카드 */}
                                                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-32 h-32 bg-white/80 text-black flex items-center justify-center rounded-md font-semibold">사진</div>
                                                            <div className="flex-1">
                                                                <h3 className="text-white text-2xl font-semibold mb-2">전도현</h3>
                                                                <ul className="text-white/90 space-y-1">
                                                                    <li>나이: 24</li>
                                                                    <li>학력: B.S. CS (재학)</li>
                                                                    <li>경력: 스타트업 인턴, 해커톤 3회</li>
                                                                    <li>자기소개: 제품 집착, 프론트엔드/애니메이션 러버</li>
                                                                    <li className="text-blue-300">링크드인 주소</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 우측 카드 */}
                                                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-32 h-32 bg-white/80 text-black flex items-center justify-center rounded-md font-semibold">사진</div>
                                                            <div className="flex-1">
                                                                <h3 className="text-white text-2xl font-semibold mb-2">서원준</h3>
                                                                <ul className="text-white/90 space-y-1">
                                                                    <li>나이: 24</li>
                                                                    <li>학력: B.S. CS (재학)</li>
                                                                    <li>경력: 오픈소스 기여, 사이드 프로젝트</li>
                                                                    <li>자기소개: 백엔드/인프라 좋아하는 빌더</li>
                                                                    <li className="text-blue-300">링크드인 주소</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 스크롤 공간 확보 + back3 센티넬 배치 */}
                <div className="relative h-[600vh]">
                    {/* back3 시작 센티넬: 하단에서 20vh 지점 */}
                    <div ref={back3SentinelRef} className="absolute bottom-[20vh] left-0 w-px h-px"></div>
                </div>
                {/* back3 진입 이후 추가 스크롤 꼬리 공간 */}
                <div style={{ height: `${BACK3_SCROLL_TAIL_PX}px` }} />
            </div>
        </>
    );
}
