import React, { useEffect } from 'react';
import { Player } from '../types';
import { Button } from './Button';
import { TimerRing } from './TimerRing';
import { Emoji } from './Emoji';
import { useTimer } from '../hooks/useTimer';

interface GameRoundPhaseProps {
  players: Player[];
  onGoToVote: () => void;
  roundCount: number;
  maxRounds: number | null;
  timerEnabled: boolean;
  timerDuration: number;
}

export const GameRoundPhase: React.FC<GameRoundPhaseProps> = ({
  players,
  onGoToVote,
  roundCount,
  maxRounds,
  timerEnabled,
  timerDuration,
}) => {
  const activePlayers = players.filter(p => !p.isEliminated);

  const timer = useTimer({
    duration: timerDuration,
    onExpire: onGoToVote,
  });

  // Start timer when component mounts (if enabled)
  useEffect(() => {
    if (timerEnabled) {
      timer.start();
    }
    return () => timer.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerEnabled]);

  return (
    <div className="flex flex-col h-full p-6 phase-enter">
      {/* Round Badge */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="px-3 py-1.5 bg-surface-secondary rounded-full text-[13px] font-semibold text-label-secondary">
          Ronda {roundCount}{maxRounds ? ` / ${maxRounds}` : ''}
        </div>
        {maxRounds && roundCount === maxRounds && (
          <div className="px-3 py-1.5 bg-accent-red/10 rounded-full text-[12px] font-semibold text-accent-red">
            ⏳ Última ronda
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Timer or Icon */}
        {timerEnabled ? (
          <TimerRing
            timeLeft={timer.timeLeft}
            totalTime={timerDuration}
            size={140}
          />
        ) : (
          <div className="text-6xl"><Emoji name="speech" size={64} /></div>
        )}

        <div className="text-center space-y-2">
          <h2 className="text-[28px] font-bold text-label-primary tracking-tight">
            Fase de Debate
          </h2>
          <p className="text-[15px] text-label-secondary max-w-xs">
            Cada jugador describe la palabra sin ser demasiado obvio
          </p>
        </div>

        {/* Instructions Card */}
        <div className="card p-5 w-full max-w-sm text-center space-y-2">
          <p className="text-[14px] text-label-secondary">
            <span className="font-medium text-label-primary">Ciudadanos:</span> Da una pista sutil
          </p>
          <div className="h-px bg-separator" />
          <p className="text-[14px] text-label-secondary">
            <span className="font-medium text-label-primary">Impostores:</span> Intenta encajar
          </p>
        </div>

        {/* Active Players */}
        <div className="w-full max-w-sm">
          <p className="text-[12px] text-label-tertiary uppercase tracking-wider font-semibold text-center mb-3">
            En juego · {activePlayers.length}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {activePlayers.map((p) => (
              <span
                key={p.id}
                className="px-3 py-1.5 bg-surface-secondary text-label-primary rounded-full text-[14px] font-medium"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Vote Button */}
      <div className="shrink-0 pt-4">
        <Button
          fullWidth
          onClick={onGoToVote}
          variant="danger"
          size="lg"
        >
          <span className="flex items-center gap-2">
            <Emoji name="ballot" size={20} className="align-text-bottom" /> Ir a Votación
          </span>
        </Button>
      </div>
    </div>
  );
};