'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseScrollLockReturn {
    isLocked: boolean;
    lockScroll: () => void;
    unlockScroll: () => void;
    toggleScrollLock: () => void;
}

/**
 * 스크롤을 잠그고 해제하는 기능을 제공하는 커스텀 훅
 * @returns 스크롤 잠금 상태와 제어 함수들
 */
export function useScrollLock(): UseScrollLockReturn {
    const isLockedRef = useRef<boolean>(false);
    const originalOverflowRef = useRef<string>('');
    const originalPaddingRightRef = useRef<string>('');

    const lockScroll = useCallback(() => {
        if (isLockedRef.current) return;

        // 현재 스타일 저장
        const body = document.body;
        originalOverflowRef.current = body.style.overflow;
        originalPaddingRightRef.current = body.style.paddingRight;

        // 스크롤바 너비 계산하여 레이아웃 시프트 방지
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // 스크롤 잠금 적용
        body.style.overflow = 'hidden';
        body.style.paddingRight = `${scrollbarWidth}px`;

        isLockedRef.current = true;
    }, []);

    const unlockScroll = useCallback(() => {
        if (!isLockedRef.current) return;

        // 원래 스타일 복원
        const body = document.body;
        body.style.overflow = originalOverflowRef.current;
        body.style.paddingRight = originalPaddingRightRef.current;

        isLockedRef.current = false;
    }, []);

    const toggleScrollLock = useCallback(() => {
        if (isLockedRef.current) {
            unlockScroll();
        } else {
            lockScroll();
        }
    }, [lockScroll, unlockScroll]);

    // 컴포넌트 언마운트 시 스크롤 복원
    useEffect(() => {
        return () => {
            if (isLockedRef.current) {
                unlockScroll();
            }
        };
    }, [unlockScroll]);

    return {
        isLocked: isLockedRef.current,
        lockScroll,
        unlockScroll,
        toggleScrollLock,
    };
}
