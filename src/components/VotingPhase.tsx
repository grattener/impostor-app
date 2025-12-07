import React, { useState } from 'react';
import { Skull, Gavel, ShieldCheck, ArrowRight } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';

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
      if (player) {
        setRevealedPlayer(player);
      }
    }
  };

  const handleConfirmElimination = () => {
    if (revealedPlayer) {
      onEliminate(revealedPlayer.id);
      setRevealedPlayer(null); // Reset for next time logic
    }
  };

  // REVEAL SCREEN
  if (revealedPlayer) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto p-6 items-center justify-center animate-fade-in">
        <div className="text-center space-y-6 w-full">
          <div>
            <p className="text-slate-400 text-lg mb-2">Has eliminado a</p>
            <h2 className="text-4xl font-black text-white">{revealedPlayer.name}</h2>
          </div>

          <div className={`py-10 px-6 rounded-2xl border-4 flex flex-col items-center gap-4 ${revealedPlayer.isImposter
              ? 'bg-red-500/10 border-red-500'
              : 'bg-indigo-500/10 border-indigo-500'
            }`}>
            {revealedPlayer.isImposter ? (
              <>
                <Skull className="w-24 h-24 text-red-500 animate-bounce-slow" />
                <div>
                  <h3 className="text-3xl font-black text-red-500 uppercase">¡Era el Impostor!</h3>
                  <p className="text-red-200 mt-2">Bien jugado, ciudadanos.</p>
                </div>
              </>
            ) : (
              <>
                <ShieldCheck className="w-24 h-24 text-indigo-400" />
                <div>
                  <h3 className="text-3xl font-black text-indigo-400 uppercase">Era Ciudadano</h3>
                  <p className="text-indigo-200 mt-2">¡Cometieron un error!</p>
                </div>
              </>
            )}
          </div>

          <div className="pt-8">
            <Button fullWidth onClick={handleConfirmElimination} className="h-16 text-lg">
              <div className="flex items-center justify-center gap-2">
                <span>Continuar</span>
                <ArrowRight size={24} />
              </div>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // VOTING SCREEN
  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6">
      <div className="text-center space-y-4 mb-8 mt-4">
        <div className="inline-flex p-4 bg-orange-500/20 rounded-full animate-bounce-slow">
          <Gavel className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Votación</h2>
        <p className="text-slate-400 text-sm">
          Toquen al jugador que quieren eliminar.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto content-start custom-scrollbar">
        {activePlayers.map((player) => (
          <button
            key={player.id}
            onClick={() => setSelectedId(player.id)}
            className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 min-h-[120px] ${selectedId === player.id
                ? 'bg-red-600/20 border-red-500 shadow-lg shadow-red-900/40 transform scale-[1.02]'
                : 'bg-slate-800 border-slate-700 hover:border-slate-500'
              }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${selectedId === player.id ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
              {player.name.charAt(0).toUpperCase()}
            </div>
            <span className={`font-bold text-lg truncate w-full text-center ${selectedId === player.id ? 'text-white' : 'text-slate-300'
              }`}>
              {player.name}
            </span>
            {selectedId === player.id && (
              <div className="absolute top-2 right-2">
                <Skull size={16} className="text-red-400" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-800">
        <Button
          fullWidth
          variant="danger"
          disabled={!selectedId}
          onClick={handleVoteClick}
          className="h-14 text-lg shadow-red-900/20"
        >
          {selectedId ? 'Expulsar Jugador' : 'Selecciona un jugador'}
        </Button>
      </div>
    </div>
  );
};