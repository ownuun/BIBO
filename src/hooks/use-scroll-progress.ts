'use client';

import { useState, useEffect } from 'react';

interface ScrollProgress {
    percentage: number;
    currentStep: number;
    direction: 'up' | 'down';
}

export function useScrollProgress(totalHeight: number = 6000) {
    const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
        percentage: 0,
        currentStep: 1,
        direction: 'down'
    });

    useEffect(() => {
        let lastScrollY = 0;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const percentage = Math.min((scrollY / totalHeight) * 100, 100);
            const direction = scrollY > lastScrollY ? 'down' : 'up';

            // 6단계로 나누기 (각 단계당 약 16.67%)
            const currentStep = Math.min(Math.ceil(percentage / 16.67), 6);

            setScrollProgress({
                percentage,
                currentStep,
                direction
            });

            lastScrollY = scrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [totalHeight]);

    return scrollProgress;
}
