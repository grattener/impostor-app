import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Play, Trash2, Plus, Minus } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';

interface SetupPhaseProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onStartGame: (config: { imposterCount: number; maxRounds: number }) => void;
  isGenerating: boolean;
}

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
  isGenerating
}) => {
  const [newName, setNewName] = useState('');
  
  // Config state
  const [imposterCount, setImposterCount] = useState(1);
  const [maxRounds, setMaxRounds] = useState(3);

  // Adjust imposter count based on player count limits
  useEffect(() => {
    const maxPossibleImposters = Math.max(1, Math.floor((players.length - 1) / 2));
    if (imposterCount > maxPossibleImposters) {
      setImposterCount(maxPossibleImposters);
    }
  }, [players.length, imposterCount]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddPlayer(newName.trim());
      setNewName('');
    }
  };

  const handleStart = () => {
    onStartGame({ imposterCount, maxRounds });
  };

  const maxPossibleImposters = Math.max(1, Math.floor((players.length - 1) / 2));
  const canStart = players.length >= 3;

  return (
    <div className="flex flex-col h-full w-full p-5 gap-3">
      {/* Header */}
      <div className="text-center space-y-1 mt-2 shrink-0">
        <div className="inline-flex p-3 bg-indigo-500/10 rounded-full mb-1 ring-1 ring-indigo-500/20">
          <Users className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
          El <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Impostor</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium">Configura la partida</p>
      </div>

      {/* Player Input */}
      <form onSubmit={handleAdd} className="flex gap-2 shrink-0 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre del jugador"
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            autoFocus
          />
        </div>
        <Button type="submit" variant="secondary" disabled={!newName.trim()} className="px-4 shrink-0">
          <UserPlus size={24} />
        </Button>
      </form>

      {/* Player List */}
      <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700/50 p-2 overflow-hidden flex flex-col min-h-0 relative">
        <div className="overflow-y-auto flex-1 custom-scrollbar space-y-2 p-1">
          {players.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-60">
              <Users size={40} className="text-slate-600" />
              <p className="text-sm font-medium">Agrega al menos 3 jugadores</p>
            </div>
          )}
          {players.map((player) => (
            <div 
              key={player.id} 
              className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-sm animate-fade-in group hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/30 shrink-0">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-slate-200 truncate">{player.name}</span>
              </div>
              <button 
                onClick={() => onRemovePlayer(player.id)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                aria-label="Eliminar jugador"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        {players.length > 0 && (
           <div className="pt-2 px-2 text-xs text-slate-500 text-center border-t border-slate-700/50 mt-1 shrink-0">
             Total: {players.length} jugadores
           </div>
        )}
      </div>

      {/* Game Config Settings */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg shrink-0 flex flex-col gap-3">
        
        {/* Imposter Control */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-200">Impostores</span>
            <span className="text-xs text-slate-500 truncate">Máximo: {maxPossibleImposters}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700 shrink-0">
            <button 
              onClick={() => setImposterCount(Math.max(1, imposterCount - 1))}
              disabled={imposterCount <= 1}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-lg w-6 text-center text-indigo-400 select-none">{imposterCount}</span>
            <button 
              onClick={() => setImposterCount(Math.min(maxPossibleImposters, imposterCount + 1))}
              disabled={imposterCount >= maxPossibleImposters}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-700/50 w-full" />

        {/* Round Control */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
             <span className="text-sm font-bold text-slate-200">Rondas Límite</span>
             <span className="text-xs text-slate-500 truncate">Impostores ganan al final</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700 shrink-0">
            <button 
              onClick={() => setMaxRounds(Math.max(1, maxRounds - 1))}
              disabled={maxRounds <= 1}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-lg w-6 text-center text-indigo-400 select-none">{maxRounds}</span>
            <button 
              onClick={() => setMaxRounds(Math.min(10, maxRounds + 1))}
              disabled={maxRounds >= 10}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

      </div>

      <div className="pt-1 shrink-0">
        <Button 
          fullWidth 
          onClick={handleStart} 
          disabled={!canStart || isGenerating}
          variant={canStart ? 'primary' : 'secondary'}
          className="h-14 shadow-lg shadow-indigo-500/10"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              Generando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-lg font-bold">
              <Play size={24} fill="currentColor" />
              Comenzar Partida
            </span>
          )}
        </Button>
        {!canStart && players.length > 0 && (
          <p className="text-center text-xs text-slate-500 mt-2 font-medium animate-pulse">
            Faltan {3 - players.length} jugadores para empezar
          </p>
        )}
      </div>
    </div>
  );
};