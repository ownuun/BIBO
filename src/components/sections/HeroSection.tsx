'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 상수 정의
const BREAKS = [0, 0.16, 0.33, 0.5, 0.67, 0.83, 1] as const;
type Stage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// 애니메이션 variants
const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const logoVariants = {
    initial: {
        scale: 1,
        x: 0,
        y: 0
    },
    moved: {
        scale: 0.4,
        x: '-42vw',
        y: '-42vh'
    }
};

const textDropVariants = {
    hidden: {
        opacity: 0,
        y: -100,
        scale: 1
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1
    },
    shrinking: {
        opacity: 1,
        y: -50,
        scale: 0.5
    }
};

export function HeroSection() {
    // 단일 상태: 현재 스테이지
    const [stage, setStage] = useState<Stage>(1);

    // 스크롤 진행도 (0-1) - 스테이지 계산용
    const [scrollProgress, setScrollProgress] = useState(0);

    // 파생 상태들 (stage 기반으로 계산)
    const derived = {
        isLogoMoved: stage >= 2,
        showTyping: stage === 2,
        showQuotes: stage >= 3 && stage < 5,
        showPhotos: stage >= 4 && stage < 5,
        fadingOut: stage === 5,
        showFinalText: stage >= 6 && stage < 7,
        finalTextDropping: stage === 6,
        finalTextShrinking: stage === 7,
        showAboutSection: stage === 7,
    };

    // 스크롤 락 관련 ref들
    const scrollLockRef = useRef(false);
    const lastScrollDirection = useRef<'up' | 'down'>('down');
    const scrollAccumulator = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // 스크롤 스냅 함수 (단순화)
    const handleScroll = useCallback((e: WheelEvent) => {
        e.preventDefault();

        const direction = e.deltaY > 0 ? 'down' : 'up';

        // 스크롤 방향이 바뀌었으면 누적값 리셋
        if (direction !== lastScrollDirection.current) {
            scrollAccumulator.current = 0;
            lastScrollDirection.current = direction;
        }

        // 스크롤 누적 (민감도 조절)
        scrollAccumulator.current += Math.abs(e.deltaY);

        // 임계값 도달 시에만 스테이지 전환
        if (scrollAccumulator.current >= 50) {
            scrollAccumulator.current = 0;

            // 다음/이전 스테이지로 이동
            const newStage = direction === 'down'
                ? Math.min(7, stage + 1) as Stage
                : Math.max(1, stage - 1) as Stage;

            console.log(`Stage: ${stage} → ${newStage} (${direction})`);
            setStage(newStage);

            // 스크롤 위치 업데이트
            const targetProgress = BREAKS[newStage - 1];
            setScrollProgress(targetProgress);
            window.scrollTo({
                top: targetProgress * (document.documentElement.scrollHeight - window.innerHeight),
                behavior: 'smooth'
            });
        }
    }, [stage]);

    // 키보드 스크롤 제어 (단순화)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space'];
        if (!keys.includes(e.code)) return;

        e.preventDefault();

        let newStage = stage;

        switch (e.code) {
            case 'ArrowUp':
                newStage = Math.max(1, stage - 1) as Stage;
                break;
            case 'ArrowDown':
            case 'Space':
                newStage = Math.min(7, stage + 1) as Stage;
                break;
            case 'PageUp':
                newStage = Math.max(1, stage - 2) as Stage;
                break;
            case 'PageDown':
                newStage = Math.min(7, stage + 2) as Stage;
                break;
        }

        if (newStage !== stage) {
            setStage(newStage);
            const targetProgress = BREAKS[newStage - 1];
            setScrollProgress(targetProgress);
            window.scrollTo({
                top: targetProgress * (document.documentElement.scrollHeight - window.innerHeight),
                behavior: 'smooth'
            });
        }
    }, [stage]);

    // 페이지 로드 시 초기화
    useEffect(() => {
        window.scrollTo(0, 0);
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    // 스크롤 진행도 → 스테이지 매핑 (단순화)
    useEffect(() => {
        const idx = BREAKS.findIndex((b, i) => scrollProgress >= b && scrollProgress < (BREAKS[i + 1] ?? 1.01));
        const newStage = (idx + 1) as Stage;
        if (newStage !== stage) {
            console.log(`Scroll Progress: ${scrollProgress.toFixed(3)} → Stage: ${newStage}`);
            setStage(newStage);
        }
    }, [scrollProgress, stage]);

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
                    <motion.img
                        src="/image/logo.png"
                        alt="BIBO Logo"
                        className={`object-contain ${derived.isLogoMoved
                            ? 'w-[clamp(60px,6vw,80px)] h-[clamp(60px,6vw,80px)]'
                            : 'w-[clamp(200px,25vw,520px)] h-[clamp(200px,25vw,520px)]'
                            }`}
                        variants={logoVariants}
                        initial="initial"
                        animate={derived.isLogoMoved ? "moved" : "initial"}
                        transition={{
                            duration: 0.7,
                            ease: "easeInOut"
                        }}
                        style={{
                            transformOrigin: 'center center'
                        }}
                    />
                </div>

                {/* 타이핑 텍스트 */}
                <AnimatePresence>
                    {derived.showTyping && (
                        <motion.div
                            className="fixed inset-0 pointer-events-none z-40"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="absolute top-[clamp(16px,4vw,32px)] w-full px-4">
                                <div className="container mx-auto">
                                    <div className="typing-animation flex items-center gap-2 justify-center md:justify-start">
                                        <span className={`font-colored-crayons ${derived.showQuotes ? 'text-white' : 'text-black'} text-[clamp(14px,1.8vw+6px,28px)] leading-tight`}>
                                            TWO KOREAN COLLEGE STUDENTS ON A JOURNEY TO BUILD A{' '}
                                            <span className="bg-gradient-to-r from-red-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
                                                UNICORN
                                            </span>
                                        </span>
                                        <motion.img
                                            src="/image/uni.png"
                                            alt="Unicorn"
                                            className="h-[clamp(14px,1.8vw+4px,28px)] object-contain -mt-1"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                            style={{
                                                aspectRatio: 'auto'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 첫 번째 섹션 - 노란 배경 */}
                <section
                    className={`fixed inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${derived.showQuotes ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                    style={{
                        background: '#FFE500',
                        zIndex: 10
                    }}
                >
                </section>

                {/* 두 번째 섹션 - 명언 섹션 (back1) */}
                <section
                    className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${derived.showQuotes ? 'opacity-100' : 'opacity-0 pointer-events-none'
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

                    {/* 4개 명언 Grid 배치 */}
                    <div className="relative z-10 h-screen container mx-auto px-4">
                        <AnimatePresence>
                            {derived.showQuotes && (
                                <motion.div
                                    className="grid h-full gap-4 md:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 place-items-center py-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {/* 첫 번째 명언 */}
                                    <motion.blockquote
                                        className="text-white text-[clamp(12px,1.6vw+4px,20px)] leading-relaxed font-crayons text-center md:text-left max-w-sm"
                                        variants={fadeVariants}
                                        initial="hidden"
                                        animate={derived.fadingOut ? "exit" : "visible"}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                    >
                                        <div className="quote-typing-multiline">
                                            <div className="line">"Being the richest man in the cemetery</div>
                                            <div className="line">doesn't matter to me. Going to bed at</div>
                                            <div className="line">night saying we've done something</div>
                                            <div className="line">wonderful... that's what matters to me."</div>
                                        </div>
                                    </motion.blockquote>

                                    {/* 두 번째 명언 */}
                                    <motion.blockquote
                                        className="text-white text-[clamp(12px,1.6vw+4px,20px)] leading-relaxed font-crayons text-center md:text-right max-w-sm"
                                        variants={fadeVariants}
                                        initial="hidden"
                                        animate={derived.fadingOut ? "exit" : "visible"}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        <div className="quote-typing-multiline">
                                            <div className="line">"I'd rather be optimistic and wrong</div>
                                            <div className="line">than pessimistic and right."</div>
                                        </div>
                                    </motion.blockquote>

                                    {/* 세 번째 명언 */}
                                    <motion.blockquote
                                        className="text-white text-[clamp(12px,1.6vw+4px,20px)] leading-relaxed font-crayons text-center md:text-left max-w-sm"
                                        variants={fadeVariants}
                                        initial="hidden"
                                        animate={derived.fadingOut ? "exit" : "visible"}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    >
                                        <div className="quote-typing" style={{ animationDelay: '0.4s' }}>
                                            "The biggest risk is not taking any risk"
                                        </div>
                                    </motion.blockquote>

                                    {/* 네 번째 명언 */}
                                    <motion.blockquote
                                        className="text-white text-[clamp(12px,1.6vw+4px,20px)] leading-relaxed font-crayons text-center md:text-right max-w-sm"
                                        variants={fadeVariants}
                                        initial="hidden"
                                        animate={derived.fadingOut ? "exit" : "visible"}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <div className="quote-typing-multiline">
                                            <div className="line">"If you can't tolerate critics, don't</div>
                                            <div className="line">do anything new or interesting."</div>
                                        </div>
                                    </motion.blockquote>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 사진들 - Grid로 배치 */}
                        <AnimatePresence>
                            {derived.showPhotos && (
                                <motion.div
                                    className="absolute inset-0 z-20 pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="h-full container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-4 md:gap-6 place-items-center py-8">
                                        {[
                                            { src: '/image/apple.png', alt: 'Steve Jobs' },
                                            { src: '/image/tesla.png', alt: 'Elon Musk' },
                                            { src: '/image/meta.png', alt: 'Mark Zuckerberg' },
                                            { src: '/image/amazon.png', alt: 'Jeff Bezos' }
                                        ].map((photo, index) => (
                                            <motion.div
                                                key={index}
                                                className="w-full max-w-[clamp(280px,35vw,560px)] aspect-video bg-white rounded-xl overflow-hidden shadow-2xl pointer-events-auto"
                                                variants={fadeVariants}
                                                initial="hidden"
                                                animate={derived.fadingOut ? "exit" : "visible"}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: 0.1 + (index * 0.1),
                                                    ease: "easeOut"
                                                }}
                                            >
                                                <img
                                                    src={photo.src}
                                                    alt={photo.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* 세 번째 섹션 - back3 배경 + 떨어지는 텍스트 */}
                <section
                    className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${derived.showFinalText ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                <AnimatePresence>
                    {derived.finalTextDropping && (
                        <motion.div
                            className="fixed inset-0 z-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center px-4"
                                variants={textDropVariants}
                                initial="hidden"
                                animate={derived.finalTextShrinking ? "shrinking" : "visible"}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                    delay: derived.finalTextShrinking ? 0 : 0.2
                                }}
                            >
                                <motion.h1
                                    className="text-white font-colored-crayons text-[clamp(20px,2.8vw+8px,48px)] text-center select-text mb-2 leading-tight"
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <span className="drop-item item-1">TESLA, </span>
                                    <span className="drop-item item-2">META, </span>
                                    <span className="drop-item item-3">GOOGLE, </span>
                                    <span className="drop-item item-4">NVIDIA</span>
                                </motion.h1>
                                <motion.h1
                                    className="text-white font-colored-crayons text-[clamp(24px,3.5vw+8px,72px)] text-center select-text leading-tight"
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                >
                                    <span className="bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-item item-1">
                                        BIBO
                                    </span>
                                    <span className="text-white drop-item item-2"> LET'S GO</span>
                                    <motion.img
                                        src="/image/rocket.png"
                                        alt="Rocket"
                                        className="inline-block align-middle ml-2 w-[clamp(20px,2.5vw,48px)] h-[clamp(20px,2.5vw,48px)] object-contain drop-item item-3"
                                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                                    />
                                </motion.h1>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>



                {/* 네 번째 섹션 - About 섹션 */}
                <section
                    className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${derived.showAboutSection ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                    <AnimatePresence>
                        {derived.showAboutSection && (
                            <motion.div
                                className="relative z-10 h-full container mx-auto px-4"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 place-items-center h-full py-8">
                                    {/* Left - Frontend Developer */}
                                    <div className="text-white text-center space-y-4 max-w-xs">
                                        <div className="mx-auto w-[clamp(140px,16vw,200px)] aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl grid place-items-center">
                                            <div>
                                                <div className="text-[clamp(32px,4vw,48px)] mb-2">👨‍💻</div>
                                                <p className="text-[clamp(12px,1.2vw,16px)] font-medium">Frontend Developer</p>
                                            </div>
                                        </div>
                                        <h3 className="text-[clamp(18px,2vw,28px)] font-colored-crayons">
                                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Frontend</span> Specialist
                                        </h3>
                                        <p className="text-[clamp(12px,1.2vw,16px)] leading-relaxed opacity-90">
                                            사용자 경험을 최우선으로 생각하는 프론트엔드 개발자.
                                            React, Next.js, TypeScript로 직관적이고 아름다운 인터페이스를 만듭니다.
                                        </p>
                                        <div>
                                            <h4 className="text-[clamp(14px,1.4vw,18px)] font-semibold text-blue-300">Tech Stack</h4>
                                            <div className="flex flex-wrap justify-center gap-1">
                                                {['React', 'Next.js', 'TypeScript', 'TailwindCSS'].map(s => (
                                                    <span key={s} className="px-2 py-1 bg-blue-500/20 rounded-full text-[clamp(10px,1vw,12px)]">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right - Backend Developer */}
                                    <div className="text-white text-center space-y-4 max-w-xs">
                                        <div className="mx-auto w-[clamp(140px,16vw,200px)] aspect-square rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 shadow-2xl grid place-items-center">
                                            <div>
                                                <div className="text-[clamp(32px,4vw,48px)] mb-2">👨‍💻</div>
                                                <p className="text-[clamp(12px,1.2vw,16px)] font-medium">Backend Developer</p>
                                            </div>
                                        </div>
                                        <h3 className="text-[clamp(18px,2vw,28px)] font-colored-crayons">
                                            <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">Backend</span> Architect
                                        </h3>
                                        <p className="text-[clamp(12px,1.2vw,16px)] leading-relaxed opacity-90">
                                            확장 가능하고 안정적인 서버 인프라를 구축하는 백엔드 개발자.
                                            Node.js, 데이터베이스, 클라우드 기술로 견고한 시스템을 만듭니다.
                                        </p>
                                        <div>
                                            <h4 className="text-[clamp(14px,1.4vw,18px)] font-semibold text-green-300">Tech Stack</h4>
                                            <div className="flex flex-wrap justify-center gap-1">
                                                {['Node.js', 'Supabase', 'PostgreSQL', 'Cloud'].map(s => (
                                                    <span key={s} className="px-2 py-1 bg-green-500/20 rounded-full text-[clamp(10px,1vw,12px)]">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                                    <button className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-colored-crayons py-3 px-8 rounded-full text-[clamp(16px,1.6vw,24px)] transition-transform hover:scale-110 shadow-2xl">
                                        Get in Touch
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* 미니멀 도트 네비게이션 */}
                <div className="fixed right-[clamp(8px,2vw,24px)] top-1/2 transform -translate-y-1/2 z-[9999]">
                    <div className="flex flex-col gap-[clamp(6px,0.8vw,10px)]">
                        {[1, 2, 3, 4, 5, 6, 7].map((stageNum) => (
                            <div
                                key={stageNum}
                                className={`w-[clamp(10px,1.2vw,16px)] h-[clamp(10px,1.2vw,16px)] rounded-full transition-all duration-300 ${stage <= 2
                                    ? stage === stageNum
                                        ? 'bg-black scale-125 shadow-lg shadow-black/30'
                                        : stage > stageNum
                                            ? 'bg-black/60 scale-100'
                                            : 'bg-black/20 scale-75'
                                    : stage === stageNum
                                        ? 'bg-white scale-125 shadow-lg shadow-white/30'
                                        : stage > stageNum
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