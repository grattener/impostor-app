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

export interface GameState {
  phase: GamePhase;
  players: Player[];
  secretWord: string;
  category: string;
  currentPlayerIndex: number; // Used for distribution and turns
  roundCount: number;
  maxRounds: number | null; // null means unlimited if we wanted that, but user asked for limit
  winner: 'CITIZENS' | 'IMPOSTERS' | null;
}

export interface GeminiWordResponse {
  word: string;
  category: string;
}