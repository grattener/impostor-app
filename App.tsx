import React, { useState } from 'react';
import { GamePhase, GameState, Player } from './types';
import { SetupPhase } from './components/SetupPhase';
import { RoleDistributionPhase } from './components/RoleDistributionPhase';
import { GameRoundPhase } from './components/GameRoundPhase';
import { VotingPhase } from './components/VotingPhase';
import { GameOverPhase } from './components/GameOverPhase';
import { generateSecretWord } from './services/geminiService';

// Native ID generator to avoid ESM import issues with uuid
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    players: [],
    secretWord: '',
    category: '',
    currentPlayerIndex: 0,
    roundCount: 1,
    maxRounds: 3,
    winner: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [eliminatedPlayerId, setEliminatedPlayerId] = useState<string | null>(null);

  // Helper to shuffle array (Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: generateId(),
      name,
      isImposter: false,
      isEliminated: false,
    };
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const handleRemovePlayer = (id: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const handleStartGame = async (config: { imposterCount: number; maxRounds: number }) => {
    setLoading(true);
    try {
      // 1. Generate Word
      const { word, category } = await generateSecretWord();

      // 2. Assign Roles
      let playersCopy = [...gameState.players];
      
      // Reset roles
      playersCopy.forEach(p => {
        p.isImposter = false;
        p.isEliminated = false;
      });

      // First shuffle to ensure base randomness
      playersCopy = shuffleArray(playersCopy);

      // Pick random indices for impostors
      const totalPlayers = playersCopy.length;
      const indices = Array.from({ length: totalPlayers }, (_, i) => i);
      const shuffledIndices = shuffleArray(indices);
      const impostorIndices = shuffledIndices.slice(0, config.imposterCount);

      impostorIndices.forEach(index => {
        playersCopy[index].isImposter = true;
      });

      // Second shuffle: Ensure the distribution order is completely random
      // relative to who got assigned what. This ensures "impostors aren't always last".
      playersCopy = shuffleArray(playersCopy);

      setGameState(prev => ({
        ...prev,
        players: playersCopy,
        secretWord: word,
        category: category,
        phase: GamePhase.ROLE_DISTRIBUTION,
        currentPlayerIndex: 0,
        roundCount: 1,
        maxRounds: config.maxRounds,
        winner: null
      }));

    } catch (e) {
      console.error("Failed to start game", e);
      alert("Error iniciando el juego. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextDistribution = () => {
    const nextIndex = gameState.currentPlayerIndex + 1;
    if (nextIndex < gameState.players.length) {
      setGameState(prev => ({ ...prev, currentPlayerIndex: nextIndex }));
    } else {
      // All roles distributed, start round
      // Shuffle active players to randomize speaking order
      const activePlayers = gameState.players.filter(p => !p.isEliminated);
      const shuffledActive = shuffleArray(activePlayers);
      
      setGameState(prev => ({
        ...prev,
        players: shuffledActive.concat(prev.players.filter(p => p.isEliminated)), 
        phase: GamePhase.ROUND_PLAYING,
        currentPlayerIndex: 0
      }));
    }
  };

  const handleGoToVote = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.VOTING }));
  };

  const checkWinConditions = (currentPlayers: Player[]): 'CITIZENS' | 'IMPOSTERS' | null => {
    const impostors = currentPlayers.filter(p => p.isImposter && !p.isEliminated);
    const citizens = currentPlayers.filter(p => !p.isImposter && !p.isEliminated);

    if (impostors.length === 0) {
      return 'CITIZENS';
    }
    if (impostors.length >= citizens.length) {
      return 'IMPOSTERS';
    }
    return null;
  };

  const handleEliminate = (playerId: string) => {
    const updatedPlayers = gameState.players.map(p => 
      p.id === playerId ? { ...p, isEliminated: true } : p
    );

    let winner: 'CITIZENS' | 'IMPOSTERS' | null = checkWinConditions(updatedPlayers);
    setEliminatedPlayerId(playerId);

    // If no standard win/loss, check round limit
    if (!winner && gameState.maxRounds && gameState.roundCount >= gameState.maxRounds) {
      winner = 'IMPOSTERS'; // Time ran out for citizens
    }

    if (winner) {
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        winner: winner,
        phase: GamePhase.GAME_OVER
      }));
    } else {
      // Game continues, new round
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        roundCount: prev.roundCount + 1,
        phase: GamePhase.ROUND_PLAYING
      }));
    }
  };

  const handleRestart = () => {
    setGameState({
      phase: GamePhase.SETUP,
      players: gameState.players.map(p => ({ ...p, isImposter: false, isEliminated: false })),
      secretWord: '',
      category: '',
      currentPlayerIndex: 0,
      roundCount: 1,
      maxRounds: 3,
      winner: null
    });
    setEliminatedPlayerId(null);
  };

  // Render Logic
  return (
    <div className="w-full h-full min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 flex items-center justify-center p-0 md:p-4">
      <div className="w-full h-full md:h-[90vh] md:max-h-[850px] max-w-md bg-slate-900 md:bg-slate-900/50 md:backdrop-blur-sm md:rounded-3xl md:shadow-2xl md:border md:border-slate-800 overflow-hidden flex flex-col relative">
        
        {gameState.phase === GamePhase.SETUP && (
          <SetupPhase 
            players={gameState.players}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onStartGame={handleStartGame}
            isGenerating={loading}
          />
        )}

        {gameState.phase === GamePhase.ROLE_DISTRIBUTION && (
          <RoleDistributionPhase 
            currentPlayer={gameState.players[gameState.currentPlayerIndex]}
            onNext={handleNextDistribution}
            secretWord={gameState.secretWord}
            category={gameState.category}
            isLastPlayer={gameState.currentPlayerIndex === gameState.players.length - 1}
          />
        )}

        {gameState.phase === GamePhase.ROUND_PLAYING && (
          <GameRoundPhase 
            players={gameState.players}
            onGoToVote={handleGoToVote}
            roundCount={gameState.roundCount}
            maxRounds={gameState.maxRounds}
          />
        )}

        {gameState.phase === GamePhase.VOTING && (
          <VotingPhase 
            players={gameState.players}
            onEliminate={handleEliminate}
            eliminatedId={eliminatedPlayerId}
          />
        )}

        {gameState.phase === GamePhase.GAME_OVER && (
          <GameOverPhase 
            winner={gameState.winner}
            players={gameState.players}
            secretWord={gameState.secretWord}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}