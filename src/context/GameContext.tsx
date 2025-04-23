
import React, { createContext, useContext, useReducer } from 'react';
import { GameState, initialGameState, Scenario, Choice } from '@/types/game.types';

// Game reducer actions
type GameAction = 
  | { type: 'SET_PLAYER_NAME', payload: string }
  | { type: 'ADD_MESSAGE', payload: string }
  | { type: 'SET_GAME_PHASE', payload: GameState['gamePhase'] }
  | { type: 'SET_SCENARIO', payload: Scenario }
  | { type: 'SET_CHOICES', payload: Choice[] }
  | { type: 'SET_IS_TYPING', payload: boolean }
  | { type: 'SHOW_TOOLTIP', payload: string | null }
  | { type: 'UPDATE_MARKET', payload: Partial<GameState['market']> }
  | { type: 'UPDATE_PLAYER', payload: Partial<GameState['player']> }
  | { type: 'ADVANCE_DAY' }
  | { type: 'ADD_TRADE', payload: GameState['player']['currentTrade'] }
  | { type: 'CLOSE_TRADE', payload: { index: number, profit: number } };

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return {
        ...state,
        player: {
          ...state.player,
          name: action.payload
        }
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        history: [...state.history, action.payload]
      };
    case 'SET_GAME_PHASE':
      return {
        ...state,
        gamePhase: action.payload
      };
    case 'SET_SCENARIO':
      return {
        ...state,
        currentScenario: action.payload
      };
    case 'SET_CHOICES':
      return {
        ...state,
        currentChoices: action.payload
      };
    case 'SET_IS_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
    case 'SHOW_TOOLTIP':
      return {
        ...state,
        showTooltip: action.payload
      };
    case 'UPDATE_MARKET':
      return {
        ...state,
        market: {
          ...state.market,
          ...action.payload
        }
      };
    case 'UPDATE_PLAYER':
      return {
        ...state,
        player: {
          ...state.player,
          ...action.payload
        }
      };
    case 'ADVANCE_DAY':
      // Simulate random market movement
      const priceChange = (Math.random() - 0.5) * state.market.volatility / 5;
      const newPrice = state.market.stockPrice * (1 + priceChange / 100);
      
      return {
        ...state,
        market: {
          ...state.market,
          currentDay: state.market.currentDay + 1,
          stockPrice: Number(newPrice.toFixed(2))
        }
      };
    case 'ADD_TRADE':
      if (!action.payload) return state;
      return {
        ...state,
        player: {
          ...state.player,
          trades: [...state.player.trades, action.payload],
          currentTrade: null,
          cash: state.player.cash + (action.payload.action === 'sell' ? action.payload.premium * action.payload.quantity : -action.payload.premium * action.payload.quantity) * 100
        }
      };
    case 'CLOSE_TRADE':
      const updatedTrades = [...state.player.trades];
      if (updatedTrades[action.payload.index]) {
        updatedTrades[action.payload.index] = {
          ...updatedTrades[action.payload.index],
          status: 'closed',
          exitDay: state.market.currentDay,
          profit: action.payload.profit
        };
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          trades: updatedTrades,
          cash: state.player.cash + action.payload.profit,
          accountValue: state.player.accountValue + action.payload.profit
        }
      };
    default:
      return state;
  }
};

// Create context
type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook for using the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
