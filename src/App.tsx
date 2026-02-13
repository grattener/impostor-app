import { GamePhase } from './types';
import { SetupPhase } from './components/SetupPhase';
import { RoleDistributionPhase } from './components/RoleDistributionPhase';
import { GameRoundPhase } from './components/GameRoundPhase';
import { VotingPhase } from './components/VotingPhase';
import { GameOverPhase } from './components/GameOverPhase';
import { useGameLogic } from './hooks/useGameLogic';
import { useTheme } from './hooks/useTheme';
import { useSound } from './hooks/useSound';
import { useEffect, useRef } from 'react';

export default function App() {
  const { gameState, loading, eliminatedPlayerId, actions, apiStatus } = useGameLogic();
  useTheme();
  const { play } = useSound(gameState.settings.soundEnabled);
  const prevPhaseRef = useRef(gameState.phase);

  // Play sounds on phase transitions
  useEffect(() => {
    if (prevPhaseRef.current !== gameState.phase) {
      switch (gameState.phase) {
        case GamePhase.ROLE_DISTRIBUTION:
          play('reveal');
          break;
        case GamePhase.VOTING:
          play('vote');
          break;
        case GamePhase.GAME_OVER:
          play(gameState.winner === 'CITIZENS' ? 'win' : 'lose');
          break;
      }
      prevPhaseRef.current = gameState.phase;
    }
  }, [gameState.phase, gameState.winner, play]);

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center p-0 md:p-4 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-app)' }}
    >
      <div className="w-full h-full md:h-[90vh] md:max-h-[850px] md:max-w-md bg-surface-primary md:rounded-apple-2xl md:shadow-apple-lg overflow-hidden flex flex-col relative transition-colors duration-300"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        }}
      >

        {gameState.phase === GamePhase.SETUP && (
          <SetupPhase
            players={gameState.players}
            settings={gameState.settings}
            onAddPlayer={actions.addPlayer}
            onRemovePlayer={actions.removePlayer}
            onStartGame={actions.startGame}
            onUpdateSettings={actions.updateSettings}
            isGenerating={loading}
            apiStatus={apiStatus}
          />
        )}

        {gameState.phase === GamePhase.ROLE_DISTRIBUTION && (
          <RoleDistributionPhase
            currentPlayer={gameState.players[gameState.currentPlayerIndex]}
            onNext={actions.nextDistribution}
            secretWord={gameState.secretWord}
            category={gameState.category}
            hint={gameState.hint}
            hintsEnabled={gameState.settings.hintsEnabled}
            isLastPlayer={gameState.currentPlayerIndex === gameState.players.length - 1}
          />
        )}

        {gameState.phase === GamePhase.ROUND_PLAYING && (
          <GameRoundPhase
            players={gameState.players}
            onGoToVote={actions.goToVote}
            roundCount={gameState.roundCount}
            maxRounds={gameState.maxRounds}
            timerEnabled={gameState.settings.timerEnabled}
            timerDuration={gameState.settings.timerDuration}
          />
        )}

        {gameState.phase === GamePhase.VOTING && (
          <VotingPhase
            players={gameState.players}
            onEliminate={actions.eliminate}
            eliminatedId={eliminatedPlayerId}
          />
        )}

        {gameState.phase === GamePhase.GAME_OVER && (
          <GameOverPhase
            winner={gameState.winner}
            players={gameState.players}
            secretWord={gameState.secretWord}
            onRestart={actions.restart}
          />
        )}
      </div>
    </div>
  );
}