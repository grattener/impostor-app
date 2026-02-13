import React, { useState } from 'react';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';
import { Emoji } from './Emoji';

interface RoleDistributionPhaseProps {
  currentPlayer: Player;
  onNext: () => void;
  secretWord: string;
  category: string;
  hint: string;
  hintsEnabled: boolean;
  isLastPlayer: boolean;
}

export const RoleDistributionPhase: React.FC<RoleDistributionPhaseProps> = ({
  currentPlayer,
  onNext,
  secretWord,
  category,
  hint,
  hintsEnabled,
  isLastPlayer
}) => {
  const [step, setStep] = useState<'PASS' | 'REVEAL'>('PASS');
  const [isSecretVisible, setIsSecretVisible] = useState(false);

  React.useEffect(() => {
    setStep('PASS');
    setIsSecretVisible(false);
  }, [currentPlayer.id]);

  if (step === 'PASS') {
    return (
      <div className="flex flex-col h-full p-6 items-center justify-center space-y-10 phase-enter">
        <div className="text-center space-y-6">
          <div className="text-7xl animate-soft-bounce"><Emoji name="phone" size={72} /></div>
          <div className="space-y-2">
            <p className="text-[17px] text-label-secondary">Pasa el teléfono a</p>
            <h1 className="text-[34px] font-bold text-label-primary tracking-tight">{currentPlayer.name}</h1>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="card p-4 text-center">
            <p className="text-[14px] text-label-secondary">
              <Emoji name="warning" size={16} className="align-text-bottom" /> No mires si no eres <span className="font-semibold text-label-primary">{currentPlayer.name}</span>
            </p>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={() => setStep('REVEAL')}
          >
            <span className="flex items-center gap-2">
              Soy {currentPlayer.name}
              <ChevronRight size={20} />
            </span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 phase-enter overflow-hidden">
      {/* Player Name */}
      <div className="text-center space-y-1 pt-2">
        <p className="text-[13px] text-label-tertiary uppercase tracking-widest font-semibold">Tu identidad</p>
        <h2 className="text-[22px] font-bold text-label-primary">{currentPlayer.name}</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center py-6 gap-6 min-h-0">
        {isSecretVisible ? (
          <div className={`w-full max-w-sm rounded-apple-2xl p-8 text-center space-y-5 animate-scale-in ${currentPlayer.isImposter
            ? 'bg-accent-red/10 border-2 border-accent-red/40'
            : 'bg-accent-green/10 border-2 border-accent-green/40'
            }`}>
            {currentPlayer.isImposter ? (
              <>
                <div className="text-6xl"><Emoji name="detective" size={64} /></div>
                <div>
                  <h3 className="text-[28px] font-bold text-accent-red">IMPOSTOR</h3>
                  <p className="text-label-secondary mt-2 text-[15px]">No conoces la palabra secreta.</p>
                </div>
                <div className="bg-surface-secondary rounded-apple-lg p-4 space-y-2">
                  <p className="text-[14px] text-label-secondary">
                    <Emoji name="target" size={16} className="align-text-bottom" /> Escucha, deduce y engaña
                  </p>
                  {hintsEnabled && hint && (
                    <div className="pt-2 border-t border-separator">
                      <p className="text-[12px] text-label-tertiary uppercase tracking-wide font-semibold">Pista</p>
                      <p className="text-[17px] font-semibold text-accent-orange mt-1">{hint}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl"><Emoji name="checkmark" size={64} /></div>
                <div>
                  <h3 className="text-[22px] font-bold text-accent-green uppercase tracking-wide">Ciudadano</h3>
                  <p className="text-[13px] text-label-tertiary uppercase mt-1">Palabra Secreta</p>
                </div>
                <div className="bg-surface-secondary rounded-apple-lg p-5">
                  <p className="text-[32px] text-label-primary font-bold">{secretWord}</p>
                  <p className="text-[13px] text-label-tertiary mt-1">{category}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full max-w-sm h-64 card flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-60">
            <EyeOff className="w-14 h-14 text-label-tertiary" />
            <p className="text-label-tertiary text-[15px] font-medium">Pulsa para revelar tu rol</p>
          </div>
        )}

        <div className="mt-6 w-full max-w-sm">
          <Button
            variant={isSecretVisible ? "secondary" : "primary"}
            className="w-full"
            size="lg"
            onClick={() => setIsSecretVisible(!isSecretVisible)}
          >
            <span className="flex items-center gap-2">
              {isSecretVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              {isSecretVisible ? 'Ocultar Rol' : 'Mostrar Rol'}
            </span>
          </Button>
        </div>
      </div>

      {/* Next Button */}
      <div className="w-full max-w-sm">
        <Button
          fullWidth
          variant={isSecretVisible ? "ghost" : "primary"}
          onClick={onNext}
          disabled={isSecretVisible}
          size="lg"
        >
          {isLastPlayer ? 'Empezar el Juego' : 'Siguiente Jugador'}
        </Button>
        {isSecretVisible && (
          <p className="text-[13px] text-center text-accent-red mt-3 font-medium">
            Oculta tu rol antes de pasar el teléfono
          </p>
        )}
      </div>
    </div>
  );
};