import React, { useState } from 'react';
import { Eye, EyeOff, Smartphone, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';

interface RoleDistributionPhaseProps {
  currentPlayer: Player;
  onNext: () => void;
  secretWord: string;
  category: string;
  isLastPlayer: boolean;
}

export const RoleDistributionPhase: React.FC<RoleDistributionPhaseProps> = ({
  currentPlayer,
  onNext,
  secretWord,
  category,
  isLastPlayer
}) => {
  const [step, setStep] = useState<'PASS' | 'REVEAL'>('PASS');
  const [isSecretVisible, setIsSecretVisible] = useState(false);

  // Reset state when player changes
  React.useEffect(() => {
    setStep('PASS');
    setIsSecretVisible(false);
  }, [currentPlayer.id]);

  if (step === 'PASS') {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto p-6 items-center justify-center space-y-10 animate-fade-in">
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
          <Smartphone className="w-32 h-32 text-indigo-400 relative z-10" />
        </div>

        <div className="text-center space-y-4">
          <p className="text-xl text-slate-300">Pasa el teléfono a:</p>
          <h1 className="text-5xl font-black text-white tracking-tight">{currentPlayer.name}</h1>
        </div>

        <div className="w-full space-y-4">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-200 text-sm text-center">
            ⚠️ No mires si no eres {currentPlayer.name}
          </div>
          
          <Button 
            fullWidth 
            onClick={() => setStep('REVEAL')}
            className="h-16 text-lg"
          >
            <div className="flex items-center justify-center gap-3">
              <UserCheck size={24} />
              <span>Soy {currentPlayer.name}</span>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 items-center justify-between py-12 animate-fade-in">
      <div className="text-center space-y-2">
        <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">Tu Identidad</p>
        <h2 className="text-3xl font-bold text-white">{currentPlayer.name}</h2>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center space-y-6">
        {isSecretVisible ? (
          <div className={`w-full p-8 rounded-2xl border-4 flex flex-col items-center justify-center space-y-6 text-center transform transition-all duration-300 ${
            currentPlayer.isImposter 
              ? 'bg-red-500/10 border-red-500' 
              : 'bg-emerald-500/10 border-emerald-500'
          }`}>
            {currentPlayer.isImposter ? (
              <>
                <ShieldAlert className="w-24 h-24 text-red-500 animate-pulse" />
                <div>
                  <h3 className="text-4xl font-black text-red-500 uppercase tracking-tighter">IMPOSTOR</h3>
                  <p className="text-red-200 mt-2 font-medium">No sabes la palabra secreta.</p>
                </div>
                <div className="bg-red-950/50 p-4 rounded-lg">
                  <p className="text-sm text-red-200">
                    Tu objetivo: <br/> Escuchar, deducir y engañar.
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400 uppercase tracking-wide mb-1">Ciudadano</h3>
                  <p className="text-slate-400 text-sm uppercase">Palabra Secreta</p>
                </div>
                <div className="bg-slate-800/80 p-6 rounded-xl w-full border border-slate-700">
                  <p className="text-4xl text-white font-black">{secretWord}</p>
                  <p className="text-sm text-slate-400 mt-1">Categoría: {category}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-slate-800 rounded-2xl border-4 border-slate-700 flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-50">
            <EyeOff className="w-16 h-16 text-slate-500" />
            <p className="text-slate-400 font-medium">Pulsa el botón para revelar tu rol</p>
          </div>
        )}

        <Button
          variant={isSecretVisible ? "secondary" : "primary"}
          className="w-full h-14"
          onClick={() => setIsSecretVisible(!isSecretVisible)}
        >
          <div className="flex items-center justify-center gap-2">
            {isSecretVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            <span>{isSecretVisible ? 'Ocultar Rol' : 'Mostrar Rol'}</span>
          </div>
        </Button>
      </div>

      <div className="w-full pt-4">
        <Button 
          fullWidth 
          variant={isSecretVisible ? "secondary" : "primary"}
          onClick={onNext}
          disabled={isSecretVisible} // Prevent accidental click while visible
          className="h-14"
        >
          {isLastPlayer ? 'Empezar el Juego' : 'Siguiente Jugador'}
        </Button>
        {isSecretVisible && (
          <p className="text-xs text-center text-red-400 mt-3 font-bold">
            ¡Oculta tu rol antes de pasar el teléfono!
          </p>
        )}
      </div>
    </div>
  );
};