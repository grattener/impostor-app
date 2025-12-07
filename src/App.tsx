
import { GamePhase } from './types';
import { SetupPhase } from './components/SetupPhase';
import { RoleDistributionPhase } from './components/RoleDistributionPhase';
import { GameRoundPhase } from './components/GameRoundPhase';
import { VotingPhase } from './components/VotingPhase';
import { GameOverPhase } from './components/GameOverPhase';
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  const { gameState, loading, eliminatedPlayerId, actions } = useGameLogic();

  return (
    <div className="w-full h-full min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 flex items-center justify-center p-0 md:p-4">
      <div className="w-full h-full md:h-[90vh] md:max-h-[850px] max-w-md bg-slate-900 md:bg-slate-900/50 md:backdrop-blur-sm md:rounded-3xl md:shadow-2xl md:border md:border-slate-800 overflow-hidden flex flex-col relative">

        {gameState.phase === GamePhase.SETUP && (
          <SetupPhase
            players={gameState.players}
            onAddPlayer={actions.addPlayer}
            onRemovePlayer={actions.removePlayer}
            onStartGame={actions.startGame}
            isGenerating={loading}
          />
        )}

        {gameState.phase === GamePhase.ROLE_DISTRIBUTION && (
          <RoleDistributionPhase
            currentPlayer={gameState.players[gameState.currentPlayerIndex]}
            onNext={actions.nextDistribution}
            secretWord={gameState.secretWord}
            category={gameState.category}
            isLastPlayer={gameState.currentPlayerIndex === gameState.players.length - 1}
          />
        )}

        {gameState.phase === GamePhase.ROUND_PLAYING && (
          <GameRoundPhase
            players={gameState.players}
            onGoToVote={actions.goToVote}
            roundCount={gameState.roundCount}
            maxRounds={gameState.maxRounds}
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