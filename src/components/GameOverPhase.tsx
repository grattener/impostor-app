import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';
import { Emoji } from './Emoji';

interface GameOverPhaseProps {
  winner: 'CITIZENS' | 'IMPOSTERS' | null;
  players: Player[];
  secretWord: string;
  onRestart: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  winner,
  players,
  secretWord,
  onRestart
}) => {
  const isImposterWin = winner === 'IMPOSTERS';

  return (
    <div className="flex flex-col h-full w-full p-6 items-center justify-center phase-enter overflow-hidden">
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col items-center space-y-6 pt-4 pb-4 max-w-sm mx-auto">
        {/* Result Icon */}
        <div className="text-7xl animate-soft-bounce">
          {isImposterWin ? <Emoji name="detective-male" size={72} /> : <Emoji name="party" size={72} />}
        </div>

        {/* Winner Announcement */}
        <div className="text-center space-y-2">
          <h1 className={`text-[32px] font-bold tracking-tight ${isImposterWin ? 'text-accent-red' : 'text-accent-green'
            }`}>
            {isImposterWin ? 'Ganan los Impostores' : 'Ganan los Ciudadanos'}
          </h1>
          <p className="text-[15px] text-label-secondary">
            {isImposterWin
              ? 'Han logrado engañar a la mayoría'
              : 'Han descubierto a los infiltrados'
            }
          </p>
        </div>

        {/* Secret Word */}
        <div className="card p-5 w-full text-center">
          <p className="text-[12px] text-label-tertiary uppercase tracking-wider font-semibold mb-1">Palabra Secreta</p>
          <p className="text-[28px] text-label-primary font-bold">{secretWord}</p>
        </div>

        {/* Player List */}
        <div className="w-full space-y-2">
          <h3 className="text-[12px] text-label-tertiary uppercase tracking-wider font-semibold px-1">
            Identidades Reveladas
          </h3>
          <div className="space-y-1.5">
            {players.map(player => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3.5 rounded-apple-lg ${player.isImposter
                  ? 'bg-accent-red/8 border border-accent-red/20'
                  : 'card'
                  } ${player.isEliminated ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${player.isImposter
                    ? 'bg-accent-red/15 text-accent-red'
                    : 'bg-accent-green/15 text-accent-green'
                    }`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-[15px] text-label-primary">{player.name}</span>
                  {player.isEliminated && (
                    <span className="text-[11px] px-2 py-0.5 bg-fill-tertiary rounded-full text-label-tertiary">
                      Eliminado
                    </span>
                  )}
                </div>
                {player.isImposter ? (
                  <span className="text-accent-red font-semibold text-[13px] flex items-center gap-1">
                    <Emoji name="detective" size={14} className="align-text-bottom" /> Impostor
                  </span>
                ) : (
                  <span className="text-accent-green font-semibold text-[13px] flex items-center gap-1">
                    <Emoji name="checkmark" size={14} className="align-text-bottom" /> Ciudadano
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restart Button */}
      <div className="w-full max-w-sm pt-4 shrink-0 border-t border-separator mt-2">
        <Button fullWidth onClick={onRestart} size="lg">
          <span className="flex items-center gap-2">
            <RefreshCw size={18} />
            Jugar de Nuevo
          </span>
        </Button>
      </div>
    </div>
  );
};