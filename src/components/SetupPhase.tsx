import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, Play, UserPlus } from 'lucide-react';
import { Player, GameSettings } from '../types';
import { Emoji } from './Emoji';
import { Button } from './Button';
import { Toggle } from './Toggle';

interface SetupPhaseProps {
  players: Player[];
  settings: GameSettings;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onStartGame: (config: { imposterCount: number; maxRounds: number }) => void;
  onUpdateSettings: (updates: Partial<GameSettings>) => void;
  isGenerating: boolean;
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  players,
  settings,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
  onUpdateSettings,
  isGenerating,
  apiStatus
}) => {
  const [newName, setNewName] = useState('');
  const [imposterCount, setImposterCount] = useState(1);
  const [maxRounds, setMaxRounds] = useState(3);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const maxPossible = Math.max(1, Math.floor((players.length - 1) / 2));
    if (imposterCount > maxPossible) setImposterCount(maxPossible);
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

  const difficultyLabels = { easy: 'Fácil', normal: 'Normal', hard: 'Difícil' };

  return (
    <div className="flex flex-col h-full w-full phase-enter overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-0 space-y-4 min-h-0">
        {/* Header */}
        <div className="text-center pt-4 pb-2 shrink-0 relative">
          <div className="absolute top-0 right-0 flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <div className={`w-2 h-2 rounded-full ${apiStatus === 'available' ? 'bg-accent-green' :
              apiStatus === 'checking' ? 'bg-accent-orange animate-pulse' :
                'bg-accent-red'
              }`} />
            <span className="text-[10px] font-medium text-label-tertiary uppercase tracking-wider">
              {apiStatus === 'available' ? 'API OK' :
                apiStatus === 'checking' ? 'Conectando...' :
                  'Modo Offline'}
            </span>
          </div>
          <div className="mb-3"><Emoji name="detective" size={56} /></div>
          <h1 className="text-[28px] font-bold tracking-tight text-label-primary">
            El Impostor
          </h1>
          <p className="text-[15px] text-label-tertiary mt-1">Configura tu partida</p>
        </div>

        {/* Player Input */}
        <form onSubmit={handleAdd} className="flex gap-2 shrink-0">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre del jugador"
            className="flex-1 bg-surface-secondary border border-separator rounded-apple px-4 py-3 text-label-primary placeholder-label-tertiary text-[16px] focus:outline-none focus:ring-2 focus:ring-accent-blue/40 transition-all"
            autoFocus
          />
          <Button type="submit" variant="primary" disabled={!newName.trim()} className="px-4">
            <UserPlus size={20} />
          </Button>
        </form>

        {/* Player List */}
        <div className="card p-1 overflow-hidden flex flex-col" style={{ minHeight: players.length > 0 ? '120px' : '100px', maxHeight: '240px' }}>
          <div className="overflow-y-auto flex-1 custom-scrollbar space-y-1 p-1">
            {players.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-label-tertiary space-y-2 py-8">
                <Emoji name="people" size={40} />
                <p className="text-[14px] font-medium">Agrega al menos 3 jugadores</p>
              </div>
            )}
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-3 rounded-apple bg-surface-primary hover:bg-surface-secondary transition-colors animate-fade-in group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/15 text-accent-blue flex items-center justify-center text-[14px] font-semibold shrink-0">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[16px] font-medium text-label-primary truncate">{player.name}</span>
                </div>
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="p-2 text-label-tertiary hover:text-accent-red rounded-full hover:bg-accent-red/10 transition-colors shrink-0"
                  aria-label="Eliminar jugador"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {players.length > 0 && (
            <div className="text-[13px] text-label-tertiary text-center py-2 border-t border-separator">
              {players.length} jugador{players.length !== 1 ? 'es' : ''}
            </div>
          )}
        </div>

        {/* Game Config & Settings */}
        <div className="card p-4 shrink-0 space-y-3">
          {/* Imposters & Rounds */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[15px] font-medium text-label-primary">Impostores</span>
              <span className="text-[13px] text-label-tertiary ml-2">máx. {maxPossibleImposters}</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-secondary rounded-apple p-1">
              <button
                onClick={() => setImposterCount(Math.max(1, imposterCount - 1))}
                disabled={imposterCount <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] hover:bg-surface-tertiary disabled:opacity-30 text-label-primary transition-colors"
              >
                <Minus size={15} />
              </button>
              <span className="font-semibold text-[17px] w-5 text-center text-accent-blue tabular-nums">{imposterCount}</span>
              <button
                onClick={() => setImposterCount(Math.min(maxPossibleImposters, imposterCount + 1))}
                disabled={imposterCount >= maxPossibleImposters}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] hover:bg-surface-tertiary disabled:opacity-30 text-label-primary transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <div className="h-px bg-separator" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[15px] font-medium text-label-primary">Rondas</span>
              <span className="text-[13px] text-label-tertiary ml-2">límite</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-secondary rounded-apple p-1">
              <button
                onClick={() => setMaxRounds(Math.max(1, maxRounds - 1))}
                disabled={maxRounds <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] hover:bg-surface-tertiary disabled:opacity-30 text-label-primary transition-colors"
              >
                <Minus size={15} />
              </button>
              <span className="font-semibold text-[17px] w-5 text-center text-accent-blue tabular-nums">{maxRounds}</span>
              <button
                onClick={() => setMaxRounds(Math.min(10, maxRounds + 1))}
                disabled={maxRounds >= 10}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] hover:bg-surface-tertiary disabled:opacity-30 text-label-primary transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <div className="h-px bg-separator" />

          {/* More Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full text-[15px] font-medium text-accent-blue py-1 text-center tap-effect"
          >
            {showSettings ? 'Ocultar opciones' : 'Más opciones'}
          </button>

          {/* Extended Settings */}
          {showSettings && (
            <div className="space-y-1 animate-fade-in pt-1">
              <Toggle
                enabled={settings.hintsEnabled}
                onChange={(v) => onUpdateSettings({ hintsEnabled: v })}
                label="Pista para impostor"
                description="El impostor recibe una pista sutil"
              />

              <div className="h-px bg-separator" />

              <Toggle
                enabled={settings.timerEnabled}
                onChange={(v) => onUpdateSettings({ timerEnabled: v })}
                label="Temporizador"
                description="Tiempo límite por ronda de debate"
              />

              {settings.timerEnabled && (
                <div className="flex items-center justify-between pl-1 pb-1 animate-fade-in">
                  <span className="text-[13px] text-label-secondary">Duración</span>
                  <div className="flex gap-1">
                    {[30, 60, 90, 120].map(sec => (
                      <button
                        key={sec}
                        onClick={() => onUpdateSettings({ timerDuration: sec })}
                        className={`px-3 py-1.5 rounded-apple text-[13px] font-medium transition-all ${settings.timerDuration === sec
                          ? 'bg-accent-blue text-white'
                          : 'bg-surface-secondary text-label-secondary hover:bg-surface-tertiary'
                          }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-px bg-separator" />

              <Toggle
                enabled={settings.soundEnabled}
                onChange={(v) => onUpdateSettings({ soundEnabled: v })}
                label="Sonidos"
                description="Efectos de sonido del juego"
              />

              <div className="h-px bg-separator" />

              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-[15px] font-medium text-label-primary">Modo de Dificultad</span>
                  <span className="text-[13px] text-label-tertiary block mt-0.5">Cómo se eligen las palabras</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ difficultyMode: 'manual' })}
                    className={`flex items-center justify-between p-3 rounded-apple transition-all border ${settings.difficultyMode === 'manual'
                        ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                        : 'bg-surface-secondary border-transparent text-label-secondary hover:bg-surface-tertiary'
                      }`}
                  >
                    <span className="text-[14px] font-medium">Manual</span>
                    {settings.difficultyMode === 'manual' && <Emoji name="checkmark" size={16} />}
                  </button>

                  {settings.difficultyMode === 'manual' && (
                    <div className="flex gap-1 pl-4 animate-fade-in">
                      {(['easy', 'normal', 'hard'] as const).map(d => (
                        <button
                          key={d}
                          onClick={() => onUpdateSettings({ difficulty: d })}
                          className={`flex-1 px-3 py-2 rounded-apple text-[13px] font-medium transition-all ${settings.difficulty === d
                            ? 'bg-accent-blue text-white shadow-sm'
                            : 'bg-surface-tertiary text-label-secondary hover:bg-surface-secondary'
                            }`}
                        >
                          {difficultyLabels[d]}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onUpdateSettings({ difficultyMode: 'easy_hard' })}
                    className={`flex items-center justify-between p-3 rounded-apple transition-all border ${settings.difficultyMode === 'easy_hard'
                        ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                        : 'bg-surface-secondary border-transparent text-label-secondary hover:bg-surface-tertiary'
                      }`}
                  >
                    <div className="text-left">
                      <span className="text-[14px] font-medium block">Variada (Recomendada)</span>
                      <span className="text-[11px] opacity-80">Mezcla palabras Fáciles y Difíciles</span>
                    </div>
                    {settings.difficultyMode === 'easy_hard' && <Emoji name="checkmark" size={16} />}
                  </button>

                  <button
                    onClick={() => onUpdateSettings({ difficultyMode: 'all' })}
                    className={`flex items-center justify-between p-3 rounded-apple transition-all border ${settings.difficultyMode === 'all'
                        ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                        : 'bg-surface-secondary border-transparent text-label-secondary hover:bg-surface-tertiary'
                      }`}
                  >
                    <div className="text-left">
                      <span className="text-[14px] font-medium block">Aleatoria Total</span>
                      <span className="text-[11px] opacity-80">Cualquier dificultad (Fácil/Normal/Difícil)</span>
                    </div>
                    {settings.difficultyMode === 'all' && <Emoji name="checkmark" size={16} />}
                  </button>
                </div>
              </div>



              <div className="h-px bg-separator" />

              <Toggle
                enabled={settings.useApi}
                onChange={(v) => onUpdateSettings({ useApi: v })}
                label="Usar API (Gemini)"
                description="Genera palabras con IA. Si no, usa lista local"
              />
            </div>
          )}
        </div>
      </div> {/* End scrollable content */}

      {/* Start Button - Fixed at bottom */}
      <div className="shrink-0 p-5 pt-3">
        <Button
          fullWidth
          size="lg"
          onClick={handleStart}
          disabled={!canStart || isGenerating}
          variant={canStart ? 'primary' : 'secondary'}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
              Generando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play size={20} fill="currentColor" />
              Comenzar Partida
            </span>
          )}
        </Button>
        {!canStart && players.length > 0 && (
          <p className="text-center text-[13px] text-label-tertiary mt-2">
            Faltan {3 - players.length} jugador{3 - players.length !== 1 ? 'es' : ''} para empezar
          </p>
        )}
      </div>
    </div>
  );
};