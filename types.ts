export enum GamePhase {
  START = 'START',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  GAME_OVER = 'GAME_OVER'
}

export interface GameState {
  week: number; // Total weeks passed
  date: Date; // Current calendar date
  cash: number; // Billones COP
  fiscalGap: number; // The target to fill
  debtToGDP: number; // %
  approval: number; // %
  inflation: number; // %
  interestRate: number; // %
  tesRate: number; // % (Volatile)
  gdpGrowth: number; // %
  marketSentiment: number; // 0-100 (0=Panic, 100=Euphoria)
  history: GameHistoryPoint[];
  events: GameEvent[];
  lastAction: string | null;
}

export interface GameHistoryPoint {
  week: number;
  dateStr: string;
  cash: number;
  debt: number;
  approval: number;
  tesRate: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'positive' | 'negative' | 'neutral' | 'breaking_news';
}

export interface ActionCardProps {
  title: string;
  description: string;
  cost?: string;
  benefit?: string;
  risk?: string;
  duration?: string; // e.g., "2 Semanas"
  onExecute: () => void;
  disabled: boolean;
  color: 'blue' | 'red' | 'amber' | 'green' | 'purple';
}
