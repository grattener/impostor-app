export enum GamePhase {
  SETUP = 'SETUP',
  LOADING_WORD = 'LOADING_WORD',
  ROLE_DISTRIBUTION = 'ROLE_DISTRIBUTION',
  ROUND_PLAYING = 'ROUND_PLAYING',
  VOTING = 'VOTING',
  GAME_OVER = 'GAME_OVER'
}

export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
  isEliminated: boolean;
}

export interface GameSettings {
  hintsEnabled: boolean;
  timerEnabled: boolean;
  timerDuration: number; // seconds: 30, 60, 90, 120
  difficulty: 'easy' | 'normal' | 'hard';
  soundEnabled: boolean;
  useApi: boolean;
  difficultyMode: 'manual' | 'easy_hard' | 'all';
}

export const DEFAULT_SETTINGS: GameSettings = {
  hintsEnabled: false,
  timerEnabled: false,
  timerDuration: 60,
  difficulty: 'normal',
  soundEnabled: true,
  useApi: true,
  difficultyMode: 'easy_hard',
};

export interface GameState {
  phase: GamePhase;
  players: Player[];
  secretWord: string;
  category: string;
  hint: string;
  currentPlayerIndex: number;
  roundCount: number;
  maxRounds: number | null;
  winner: 'CITIZENS' | 'IMPOSTERS' | null;
  settings: GameSettings;
}

export interface GeminiWordResponse {
  word: string;
  category: string;
  hint?: string;
}