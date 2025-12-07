import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GamePhase, GameState, Player } from '../types';
import { generateSecretWord } from '../services/geminiService';

const STORAGE_KEY = 'el_impostor_game_state';

const INITIAL_STATE: GameState = {
    phase: GamePhase.SETUP,
    players: [],
    secretWord: '',
    category: '',
    currentPlayerIndex: 0,
    roundCount: 1,
    maxRounds: 3,
    winner: null,
};

export const useGameLogic = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Failed to load saved game state", e);
        }
        return INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

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

    const addPlayer = (name: string) => {
        const newPlayer: Player = {
            id: uuidv4(),
            name,
            isImposter: false,
            isEliminated: false,
        };
        setGameState(prev => ({
            ...prev,
            players: [...prev.players, newPlayer]
        }));
    };

    const removePlayer = (id: string) => {
        setGameState(prev => ({
            ...prev,
            players: prev.players.filter(p => p.id !== id)
        }));
    };

    const startGame = async (config: { imposterCount: number; maxRounds: number }) => {
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

    const nextDistribution = () => {
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

    const goToVote = () => {
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

    const eliminate = (playerId: string) => {
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

    const restart = () => {
        setGameState({
            ...INITIAL_STATE,
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

    return {
        gameState,
        loading,
        eliminatedPlayerId,
        actions: {
            addPlayer,
            removePlayer,
            startGame,
            nextDistribution,
            goToVote,
            eliminate,
            restart
        },
        setGameState
    };
};
