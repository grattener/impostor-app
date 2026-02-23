import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GamePhase, GameState, GameSettings, Player, DEFAULT_SETTINGS } from '../types';
import { generateSecretWord, checkApiStatus } from '../services/geminiService';

const STORAGE_KEY = 'el_impostor_game_state';
const SETTINGS_KEY = 'el_impostor_settings';

const loadSettings = (): GameSettings => {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
        console.error("Failed to load settings", e);
    }
    return DEFAULT_SETTINGS;
};

const INITIAL_STATE: GameState = {
    phase: GamePhase.SETUP,
    players: [],
    secretWord: '',
    category: '',
    hint: '',
    currentPlayerIndex: 0,
    roundCount: 1,
    maxRounds: 3,
    winner: null,
    settings: loadSettings(),
    lastImposterIds: [],
};

export const useGameLogic = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure settings always exist
                return {
                    ...INITIAL_STATE,
                    ...parsed,
                    settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
                };
            }
        } catch (e) {
            console.error("Failed to load saved game state", e);
        }
        return INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

    // Persist settings separately for reuse across sessions
    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameState.settings));
    }, [gameState.settings]);

    const [loading, setLoading] = useState(false);
    const [eliminatedPlayerId, setEliminatedPlayerId] = useState<string | null>(null);
    const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

    // Check API status on mount and when useApi changes
    useEffect(() => {
        if (!gameState.settings.useApi) {
            setApiStatus('unavailable');
            return;
        }
        const checkStatus = async () => {
            setApiStatus('checking');
            const isAvailable = await checkApiStatus();
            setApiStatus(isAvailable ? 'available' : 'unavailable');
        };
        checkStatus();
    }, [gameState.settings.useApi]);

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

    const updateSettings = (updates: Partial<GameSettings>) => {
        setGameState(prev => ({
            ...prev,
            settings: { ...prev.settings, ...updates },
        }));
    };

    const startGame = async (config: { imposterCount: number; maxRounds: number }) => {
        setLoading(true);
        try {
            const { word, category, hint } = await generateSecretWord({
                difficulty: gameState.settings.difficulty,
                hintsEnabled: gameState.settings.hintsEnabled,
                useApi: gameState.settings.useApi,
                difficultyMode: gameState.settings.difficultyMode,
            });

            let playersCopy = [...gameState.players];
            playersCopy.forEach(p => {
                p.isImposter = false;
                p.isEliminated = false;
            });

            // Weighted random selection to reduce streaks while maintaining unpredictability
            const getNewImposterIds = (count: number): string[] => {
                const selectedIds: string[] = [];
                const pool = [...playersCopy];
                
                for (let n = 0; n < count; n++) {
                    if (pool.length === 0) break;

                    // Assign weights: 1 for last imposters, 10 for everyone else
                    const weightedPool = pool.map(p => ({
                        id: p.id,
                        weight: gameState.lastImposterIds.includes(p.id) ? 1 : 10
                    }));

                    const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
                    let random = Math.random() * totalWeight;
                    
                    for (let i = 0; i < weightedPool.length; i++) {
                        random -= weightedPool[i].weight;
                        if (random <= 0) {
                            const selectedId = weightedPool[i].id;
                            selectedIds.push(selectedId);
                            // Remove selected player from the local pool for next imposter (if count > 1)
                            const indexToRemove = pool.findIndex(p => p.id === selectedId);
                            pool.splice(indexToRemove, 1);
                            break;
                        }
                    }
                }
                return selectedIds;
            };

            const newImposterIds = getNewImposterIds(config.imposterCount);

            playersCopy.forEach(p => {
                if (newImposterIds.includes(p.id)) {
                    p.isImposter = true;
                }
            });

            // Shuffle entire player list for distribution phase
            playersCopy = shuffleArray(playersCopy);

            setGameState(prev => ({
                ...prev,
                players: playersCopy,
                secretWord: word,
                category: category,
                hint: hint || '',
                phase: GamePhase.ROLE_DISTRIBUTION,
                currentPlayerIndex: 0,
                roundCount: 1,
                maxRounds: config.maxRounds,
                winner: null,
                lastImposterIds: newImposterIds
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

        if (impostors.length === 0) return 'CITIZENS';
        if (impostors.length >= citizens.length) return 'IMPOSTERS';
        return null;
    };

    const eliminate = (playerId: string) => {
        const updatedPlayers = gameState.players.map(p =>
            p.id === playerId ? { ...p, isEliminated: true } : p
        );

        let winner: 'CITIZENS' | 'IMPOSTERS' | null = checkWinConditions(updatedPlayers);
        setEliminatedPlayerId(playerId);

        if (!winner && gameState.maxRounds && gameState.roundCount >= gameState.maxRounds) {
            winner = 'IMPOSTERS';
        }

        if (winner) {
            setGameState(prev => ({
                ...prev,
                players: updatedPlayers,
                winner: winner,
                phase: GamePhase.GAME_OVER
            }));
        } else {
            setGameState(prev => ({
                ...prev,
                players: updatedPlayers,
                roundCount: prev.roundCount + 1,
                phase: GamePhase.ROUND_PLAYING
            }));
        }
    };

    const restart = () => {
        setGameState(prev => ({
            ...INITIAL_STATE,
            phase: GamePhase.SETUP,
            players: prev.players.map(p => ({ ...p, isImposter: false, isEliminated: false })),
            settings: prev.settings,
            secretWord: '',
            category: '',
            hint: '',
            currentPlayerIndex: 0,
            roundCount: 1,
            maxRounds: 3,
            winner: null
        }));
        setEliminatedPlayerId(null);
    };

    return {
        gameState,
        loading,
        eliminatedPlayerId,
        apiStatus,
        actions: {
            addPlayer,
            removePlayer,
            startGame,
            nextDistribution,
            goToVote,
            eliminate,
            restart,
            updateSettings,
        },
        setGameState
    };
};
