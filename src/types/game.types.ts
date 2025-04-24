export interface PlayerState {
  name: string;
  accountValue: number;
  cash: number;
  experience: number;
  level: number;
  trades: Trade[];
  currentTrade: Trade | null;
  tradingTimeBarrier: number | null;
  canTradeToday: boolean;
  positionSize: number | null;
}

export interface MarketState {
  volatility: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  currentDay: number;
  currentHour: number;
  stockPrice: number;
  stockTicker: string;
  availableStrikes: number[];
  availableDeltas: {
    calls: {[strike: number]: number},
    puts: {[strike: number]: number}
  };
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
  entryHour?: number;
  exitDay?: number;
  exitHour?: number;
  profit?: number;
  delta?: number;
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
    currentTrade: null,
    tradingTimeBarrier: null,
    canTradeToday: true,
    positionSize: null
  },
  market: {
    volatility: 15,
    trend: 'neutral',
    currentDay: 1,
    currentHour: 0,
    stockPrice: 450,
    stockTicker: 'SPY',
    availableStrikes: [430, 440, 450, 460, 470],
    availableDeltas: {
      calls: {430: 0.85, 440: 0.65, 450: 0.50, 460: 0.30, 470: 0.15},
      puts: {430: 0.15, 440: 0.30, 450: 0.50, 460: 0.65, 470: 0.85}
    }
  },
  history: ['Welcome to Options Whisperer: SPY Trading Edition...'],
  gamePhase: 'intro',
  currentChoices: [],
  isTyping: false,
  showTooltip: null
};
