import React from 'react';

type EmojiName =
    | 'detective'
    | 'detective-male'
    | 'party'
    | 'checkmark'
    | 'skull'
    | 'anxious'
    | 'scales'
    | 'cross'
    | 'ballot'
    | 'speech'
    | 'people'
    | 'phone'
    | 'warning'
    | 'target';

interface EmojiProps {
    name: EmojiName;
    size?: number;
    className?: string;
    alt?: string;
}

/**
 * Renders an Apple emoji as a responsive image with srcset.
 * Uses pre-extracted PNGs at 32px, 64px, and 160px.
 * The browser automatically picks the best resolution for the device.
 */
export const Emoji: React.FC<EmojiProps> = ({ name, size = 24, className = '', alt }) => {
    const src32 = `/emojis/32/${name}.png`;
    const src64 = `/emojis/64/${name}.png`;
    const src160 = `/emojis/160/${name}.png`;

    return (
        <img
            src={src64}
            srcSet={`${src32} 32w, ${src64} 64w, ${src160} 160w`}
            sizes={`${size}px`}
            width={size}
            height={size}
            alt={alt || name}
            className={`inline-block ${className}`}
            draggable={false}
            loading="eager"
            style={{ imageRendering: 'auto' }}
        />
    );
};
