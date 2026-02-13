import { useCallback } from 'react';

export type SoundName = 'click' | 'reveal' | 'vote' | 'win' | 'lose' | 'tick' | 'eliminate';

const createAudioContext = () => {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
};

class SoundPlayer {
    private ctx: AudioContext | null = null;

    private getContext(): AudioContext {
        if (!this.ctx || this.ctx.state === 'closed') {
            this.ctx = createAudioContext();
        }
        return this.ctx;
    }

    play(name: SoundName) {
        const ctx = this.getContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        switch (name) {
            case 'click':
                this.playTone(ctx, 800, 0.08, 'sine');
                break;
            case 'reveal':
                this.playChime(ctx, [523, 659, 784], 0.15, 0.1);
                break;
            case 'vote':
                this.playTone(ctx, 300, 0.3, 'triangle');
                break;
            case 'win':
                this.playChime(ctx, [523, 659, 784, 1047], 0.2, 0.15);
                break;
            case 'lose':
                this.playChime(ctx, [400, 350, 300, 250], 0.25, 0.15);
                break;
            case 'tick':
                this.playTone(ctx, 1000, 0.04, 'sine');
                break;
            case 'eliminate':
                this.playTone(ctx, 200, 0.5, 'sawtooth');
                break;
        }
    }

    private playTone(ctx: AudioContext, freq: number, duration: number, type: OscillatorType) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    private playChime(ctx: AudioContext, freqs: number[], duration: number, gap: number) {
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const startTime = ctx.currentTime + i * gap;
            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        });
    }
}

const soundPlayer = new SoundPlayer();

export const useSound = (enabled: boolean) => {
    const play = useCallback((name: SoundName) => {
        if (!enabled) return;
        try {
            soundPlayer.play(name);
        } catch (e) {
            console.warn('Sound playback failed:', e);
        }
    }, [enabled]);

    return { play };
};
