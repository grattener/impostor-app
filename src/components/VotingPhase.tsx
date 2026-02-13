import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';
import { Emoji } from './Emoji';

interface VotingPhaseProps {
  players: Player[];
  onEliminate: (playerId: string) => void;
  eliminatedId: string | null;
}

export const VotingPhase: React.FC<VotingPhaseProps> = ({ players, onEliminate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealedPlayer, setRevealedPlayer] = useState<Player | null>(null);

  const activePlayers = players.filter(p => !p.isEliminated);

  const handleVoteClick = () => {
    if (selectedId) {
      const player = players.find(p => p.id === selectedId);
      if (player) setRevealedPlayer(player);
    }
  };

  const handleConfirmElimination = () => {
    if (revealedPlayer) {
      onEliminate(revealedPlayer.id);
      setRevealedPlayer(null);
    }
  };

  // REVEAL SCREEN
  if (revealedPlayer) {
    return (
      <div className="flex flex-col h-full p-6 items-center justify-center phase-enter">
        <div className="text-center space-y-6 w-full max-w-sm">
          <div>
            <p className="text-[15px] text-label-secondary mb-2">Han eliminado a</p>
            <h2 className="text-[34px] font-bold text-label-primary">{revealedPlayer.name}</h2>
          </div>

          <div className={`py-10 px-6 rounded-apple-2xl flex flex-col items-center gap-5 animate-scale-in ${revealedPlayer.isImposter
            ? 'bg-accent-red/10 border-2 border-accent-red/30'
            : 'bg-accent-blue/10 border-2 border-accent-blue/30'
            }`}>
            {revealedPlayer.isImposter ? (
              <>
                <div className="text-7xl"><Emoji name="skull" size={72} /></div>
                <div className="text-center">
                  <h3 className="text-[28px] font-bold text-accent-red">¡Era Impostor!</h3>
                  <p className="text-label-secondary mt-2 text-[15px]">Bien jugado, ciudadanos</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-7xl"><Emoji name="anxious" size={72} /></div>
                <div className="text-center">
                  <h3 className="text-[28px] font-bold text-accent-blue">Era Ciudadano</h3>
                  <p className="text-label-secondary mt-2 text-[15px]">¡Cometieron un error!</p>
                </div>
              </>
            )}
          </div>

          <div className="pt-4">
            <Button fullWidth onClick={handleConfirmElimination} size="lg">
              <span className="flex items-center gap-2">
                Continuar
                <ArrowRight size={20} />
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // VOTING SCREEN
  return (
    <div className="flex flex-col h-full p-6 phase-enter">
      <div className="text-center space-y-3 mb-6 pt-2 shrink-0">
        <div className="text-5xl"><Emoji name="scales" size={56} /></div>
        <h2 className="text-[28px] font-bold text-label-primary">Votación</h2>
        <p className="text-[14px] text-label-secondary">
          Selecciona al jugador que quieren eliminar
        </p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto content-start custom-scrollbar pb-2">
        {activePlayers.map((player) => (
          <button
            key={player.id}
            onClick={() => setSelectedId(player.id)}
            className={`relative p-4 rounded-apple-xl transition-all flex flex-col items-center justify-center gap-2 min-h-[100px] tap-effect ${selectedId === player.id
              ? 'bg-accent-red/10 border-2 border-accent-red shadow-apple'
              : 'card hover:bg-surface-secondary'
              }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-[18px] ${selectedId === player.id
              ? 'bg-accent-red text-white'
              : 'bg-fill-secondary text-label-primary'
              }`}>
              {player.name.charAt(0).toUpperCase()}
            </div>
            <span className={`font-semibold text-[16px] truncate w-full text-center ${selectedId === player.id ? 'text-accent-red' : 'text-label-primary'
              }`}>
              {player.name}
            </span>
            {selectedId === player.id && (
              <div className="absolute top-3 right-3"><Emoji name="cross" size={18} /></div>
            )}
          </button>
        ))}
      </div>

      <div className="pt-4 shrink-0 border-t border-separator">
        <Button
          fullWidth
          variant="danger"
          disabled={!selectedId}
          onClick={handleVoteClick}
          size="lg"
        >
          {selectedId ? <><Emoji name="ballot" size={20} className="align-text-bottom" /> Expulsar Jugador</> : 'Selecciona un jugador'}
        </Button>
      </div>
    </div>
  );
};