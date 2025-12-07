import React from 'react';
import { Trophy, RefreshCw, Skull, ShieldCheck } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';

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
  const imposters = players.filter(p => p.isImposter);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 items-center justify-center animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center w-full">
        
        <div className={`p-6 rounded-full ${isImposterWin ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
          {isImposterWin ? (
            <Skull className="w-20 h-20 text-red-500" />
          ) : (
            <Trophy className="w-20 h-20 text-emerald-500" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className={`text-4xl font-black uppercase tracking-tight ${
            isImposterWin ? 'text-red-500' : 'text-emerald-500'
          }`}>
            {isImposterWin ? 'Ganan los Impostores' : 'Ganan los Ciudadanos'}
          </h1>
          <p className="text-slate-400">
            {isImposterWin 
              ? 'Han logrado engañar a la mayoría.' 
              : 'Han descubierto a todos los infiltrados.'}
          </p>
        </div>

        <div className="bg-slate-800/80 p-6 rounded-xl w-full border border-slate-700">
          <p className="text-sm text-slate-500 uppercase font-bold mb-2">Palabra Secreta</p>
          <p className="text-3xl text-white font-black">{secretWord}</p>
        </div>

        <div className="w-full space-y-3 text-left">
          <h3 className="text-slate-400 text-sm font-bold uppercase ml-1">Identidades Reveladas</h3>
          <div className="space-y-2">
            {players.map(player => (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  player.isImposter 
                    ? 'bg-red-900/20 border-red-900/50' 
                    : 'bg-slate-800 border-slate-700'
                } ${player.isEliminated ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold">{player.name}</span>
                  {player.isEliminated && (
                    <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">Eliminado</span>
                  )}
                </div>
                {player.isImposter ? (
                  <span className="text-red-400 font-bold text-sm flex items-center gap-1">
                    <Skull size={14} /> Impostor
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                    <ShieldCheck size={14} /> Ciudadano
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full pt-6">
        <Button fullWidth onClick={onRestart} className="h-14">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw size={20} />
            <span>Jugar de Nuevo</span>
          </div>
        </Button>
      </div>
    </div>
  );
};