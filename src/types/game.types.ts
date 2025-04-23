
export interface PlayerState {
  name: string;
  accountValue: number;
  cash: number;
  experience: number;
  level: number;
  trades: Trade[];
  currentTrade: Trade | null;
}

export interface MarketState {
  volatility: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  currentDay: number;
  stockPrice: number;
  stockTicker: string;
}

export interface Trade {
  type: 'put' | 'call';
  action: 'buy' | 'sell';
  strike: number;
  premium: number;
  expiry: number;
  quantity: number;
  status: 'open' | 'closed' | 'expired';
  entryDay: number;
  exitDay?: number;
  profit?: number;
}

export interface GameState {
  player: PlayerState;
  market: MarketState;
  history: string[];
  gamePhase: 'intro' | 'setup' | 'playing' | 'results';
  currentScenario?: Scenario;
  currentChoices: Choice[];
  isTyping: boolean;
  showTooltip: string | null;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  action: string;
  tooltip?: string;
  result?: (state: GameState) => GameState;
}

export const initialGameState: GameState = {
  player: {
    name: '',
    accountValue: 10000,
    cash: 10000,
    experience: 0,
    level: 1,
    trades: [],
    currentTrade: null
  },
  market: {
    volatility: 20,
    trend: 'neutral',
    currentDay: 1,
    stockPrice: 100,
    stockTicker: 'TECH'
  },
  history: ['Welcome to Options Whisperer...'],
  gamePhase: 'intro',
  currentChoices: [],
  isTyping: false,
  showTooltip: null
};
