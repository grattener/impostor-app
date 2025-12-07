import React from 'react';
import { MessageSquare, Vote, Clock } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';

interface GameRoundPhaseProps {
  players: Player[];
  onGoToVote: () => void;
  roundCount: number;
  maxRounds: number | null;
}

export const GameRoundPhase: React.FC<GameRoundPhaseProps> = ({
  players,
  onGoToVote,
  roundCount,
  maxRounds
}) => {
  const activePlayers = players.filter(p => !p.isEliminated);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-wider border border-slate-700">
          Ronda {roundCount} {maxRounds ? `/ ${maxRounds}` : ''}
        </div>
        {maxRounds && (
          <div className="px-3 py-1 bg-red-900/30 rounded-lg text-xs font-bold text-red-300 border border-red-500/30 flex items-center gap-1">
             <Clock size={12} />
             <span>Última oportunidad: Ronda {maxRounds}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-indigo-500/20 rounded-full mb-2">
             <MessageSquare className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Fase de Debate
          </h2>
          <p className="text-slate-400 text-lg">
            Describan su palabra sin ser demasiado obvios.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center space-y-4">
           {/* Category Removed as per request to prevent imposters seeing it on table */}
          <div className="space-y-2">
             <p className="text-slate-200 text-sm font-medium">RECUERDA:</p>
             <p className="text-sm text-slate-500">
                Si eres ciudadano, da una pista sutil. <br/>
                Si eres impostor, intenta encajar.
             </p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wider text-center">Jugadores en juego: {activePlayers.length}</div>
          <div className="flex flex-wrap justify-center gap-2">
            {activePlayers.map((p) => (
               <span 
                key={p.id}
                className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm font-medium border border-slate-600"
               >
                 {p.name}
               </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8">
        <Button 
          fullWidth 
          onClick={onGoToVote}
          className="h-16 text-lg"
          variant="danger"
        >
          <div className="flex items-center justify-center gap-2">
            <Vote size={24} />
            <span>Ir a Votación</span>
          </div>
        </Button>
      </div>
    </div>
  );
};