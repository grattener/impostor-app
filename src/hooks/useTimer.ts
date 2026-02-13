import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimerOptions {
    duration: number; // in seconds
    onExpire?: () => void;
}

export const useTimer = ({ duration, onExpire }: UseTimerOptions) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const onExpireRef = useRef(onExpire);

    // Keep callback ref in sync
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const clearTimer = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const start = useCallback(() => {
        clearTimer();
        setTimeLeft(duration);
        setIsRunning(true);

        intervalRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearTimer();
                    setIsRunning(false);
                    onExpireRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [duration, clearTimer]);

    const pause = useCallback(() => {
        clearTimer();
        setIsRunning(false);
    }, [clearTimer]);

    const reset = useCallback(() => {
        clearTimer();
        setTimeLeft(duration);
        setIsRunning(false);
    }, [duration, clearTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return clearTimer;
    }, [clearTimer]);

    const progress = timeLeft / duration; // 1 = full, 0 = expired

    return {
        timeLeft,
        isRunning,
        isExpired: timeLeft === 0,
        progress,
        start,
        pause,
        reset,
    };
};
