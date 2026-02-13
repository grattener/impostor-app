import React from 'react';

interface TimerRingProps {
    timeLeft: number;
    totalTime: number;
    size?: number;
}

export const TimerRing: React.FC<TimerRingProps> = ({ timeLeft, totalTime, size = 120 }) => {
    const progress = timeLeft / totalTime;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    // Color transitions: green → yellow → red
    const getColor = () => {
        if (progress > 0.5) return '#34C759';
        if (progress > 0.25) return '#FF9500';
        return '#FF3B30';
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}`;
    };

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={6}
                    className="timer-ring-bg"
                />
                {/* Progress ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={6}
                    stroke={getColor()}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                    className="font-bold tabular-nums text-label-primary"
                    style={{ fontSize: size * 0.28 }}
                >
                    {formatTime(timeLeft)}
                </span>
                {timeLeft <= 10 && timeLeft > 0 && (
                    <span className="text-accent-red text-xs font-medium animate-pulse-soft">
                        ¡Rápido!
                    </span>
                )}
            </div>
        </div>
    );
};
