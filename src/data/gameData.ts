
import { Scenario, GameState, Choice } from "@/types/game.types";

export const scenarios: Scenario[] = [
  {
    id: "intro",
    title: "Welcome to Options Whisperer",
    description: "Your journey into the world of options trading begins now.",
    context: "You've decided to try your hand at options trading with a focus on selling strategies. Your broker has just approved your account.",
    choices: [
      {
        id: "start",
        text: "Let's get started",
        action: "BEGIN_GAME",
        tooltip: "Start your options trading journey"
      }
    ]
  },
  {
    id: "tutorial",
    title: "Options Basics",
    description: "Before diving in, let's review some basics.",
    context: "Options are contracts giving the right to buy (calls) or sell (puts) an underlying asset at a specific price (strike) until a certain date (expiration). As an option seller, you collect premium upfront but take on obligation.",
    choices: [
      {
        id: "learn_more",
        text: "Tell me more about selling options",
        action: "LEARN_OPTIONS",
        tooltip: "Get additional information about options selling strategies"
      },
      {
        id: "skip_tutorial",
        text: "Skip tutorial, I know options already",
        action: "SKIP_TUTORIAL",
        tooltip: "Jump straight to trading if you're already familiar with options"
      }
    ]
  },
  {
    id: "first_trade",
    title: "First Trading Opportunity",
    description: "The market presents your first opportunity.",
    context: "TECH stock is trading at $100 per share with moderate volatility. You have $10,000 in your account to start trading.",
    choices: [
      {
        id: "sell_put",
        text: "Sell a cash-secured put",
        action: "SELL_PUT",
        tooltip: "Sell a put option and receive premium, but be obligated to buy shares if the price falls below your strike price"
      },
      {
        id: "sell_call",
        text: "Sell a covered call (requires owning 100 shares first)",
        action: "ERROR_NO_SHARES",
        tooltip: "You need to own shares before selling covered calls"
      },
      {
        id: "buy_stock",
        text: "Buy 100 shares of stock first",
        action: "BUY_STOCK",
        tooltip: "Purchase the underlying stock before trading options on it"
      },
      {
        id: "wait",
        text: "Wait and see how the market moves",
        action: "WAIT",
        tooltip: "Skip this opportunity and wait for market conditions to change"
      }
    ]
  },
  {
    id: "put_strike_selection",
    title: "Selling a Put Option",
    description: "Select your strike price for selling a put.",
    context: "TECH is currently trading at $100. You need to select a strike price for your put option. Lower strikes have less premium but higher probability of profit.",
    choices: [
      {
        id: "strike_95",
        text: "Sell $95 strike put (Premium: $2.50)",
        action: "SELL_PUT_95",
        tooltip: "More conservative approach with lower premium but higher probability of profit"
      },
      {
        id: "strike_100",
        text: "Sell $100 strike put (Premium: $4.00)",
        action: "SELL_PUT_100",
        tooltip: "At-the-money option with higher premium but more risk"
      },
      {
        id: "strike_105",
        text: "Sell $105 strike put (Premium: $6.00)",
        action: "SELL_PUT_105",
        tooltip: "In-the-money put with highest premium but highest risk of assignment"
      }
    ]
  },
  {
    id: "market_movement",
    title: "Market Movement",
    description: "The market has moved. Your position is affected.",
    context: "Three days have passed. The stock price has changed based on market conditions.",
    choices: [
      {
        id: "close_position",
        text: "Close your position",
        action: "CLOSE_POSITION",
        tooltip: "Buy back the option you sold to close the position"
      },
      {
        id: "hold_position",
        text: "Hold your position",
        action: "HOLD_POSITION",
        tooltip: "Continue holding your current position"
      },
      {
        id: "roll_position",
        text: "Roll your position",
        action: "ROLL_POSITION",
        tooltip: "Close current position and open a new one with different strike/expiration"
      }
    ]
  }
];

// Game actions
export const performGameAction = (action: string, state: GameState): { newState: Partial<GameState>, message: string } => {
  switch (action) {
    case 'BEGIN_GAME':
      return {
        newState: { gamePhase: 'setup' },
        message: "Welcome to the world of options trading! Before we begin, what's your name?"
      };
      
    case 'LEARN_OPTIONS':
      return {
        newState: {},
        message: "When selling options, you collect premium upfront but take on obligation. Selling puts obligates you to buy shares at the strike price. Selling calls obligates you to sell shares at the strike price. The key advantage is time decay - options lose value as they approach expiration."
      };
      
    case 'SKIP_TUTORIAL':
      return {
        newState: { gamePhase: 'playing' },
        message: "Great! Let's jump straight into trading. The market awaits your first move."
      };
      
    case 'SELL_PUT':
      return {
        newState: {},
        message: "You've decided to sell a put option. Now you need to select a strike price."
      };
      
    case 'ERROR_NO_SHARES':
      return {
        newState: {},
        message: "You can't sell a covered call without owning the underlying shares first. You need 100 shares per contract."
      };
      
    case 'BUY_STOCK':
      const shares = 100;
      const price = state.market.stockPrice;
      const totalCost = shares * price;
      
      if (state.player.cash < totalCost) {
        return {
          newState: {},
          message: `You don't have enough cash to buy ${shares} shares at $${price}. You need $${totalCost.toFixed(2)}.`
        };
      }
      
      return {
        newState: {
          player: {
            ...state.player,
            cash: state.player.cash - totalCost
          }
        },
        message: `You purchased ${shares} shares of ${state.market.stockTicker} at $${price} for a total of $${totalCost.toFixed(2)}.`
      };
      
    case 'WAIT':
      return {
        newState: {},
        message: "You decide to wait and see how the market develops before making a move."
      };
      
    case 'SELL_PUT_95':
      return {
        newState: {
          player: {
            ...state.player,
            currentTrade: {
              type: 'put',
              action: 'sell',
              strike: 95,
              premium: 2.50,
              expiry: state.market.currentDay + 30,
              quantity: 1,
              status: 'open',
              entryDay: state.market.currentDay
            }
          }
        },
        message: `You sell a $95 strike put on ${state.market.stockTicker} expiring in 30 days for a premium of $2.50 per share ($250 total).`
      };
      
    case 'SELL_PUT_100':
      return {
        newState: {
          player: {
            ...state.player,
            currentTrade: {
              type: 'put',
              action: 'sell',
              strike: 100,
              premium: 4.00,
              expiry: state.market.currentDay + 30,
              quantity: 1,
              status: 'open',
              entryDay: state.market.currentDay
            }
          }
        },
        message: `You sell a $100 strike put on ${state.market.stockTicker} expiring in 30 days for a premium of $4.00 per share ($400 total).`
      };
      
    case 'SELL_PUT_105':
      return {
        newState: {
          player: {
            ...state.player,
            currentTrade: {
              type: 'put',
              action: 'sell',
              strike: 105,
              premium: 6.00,
              expiry: state.market.currentDay + 30,
              quantity: 1,
              status: 'open',
              entryDay: state.market.currentDay
            }
          }
        },
        message: `You sell a $105 strike put on ${state.market.stockTicker} expiring in 30 days for a premium of $6.00 per share ($600 total).`
      };
      
    case 'CLOSE_POSITION':
      // Calculate closing cost based on current stock price and position
      const activeTrade = state.player.trades[state.player.trades.length - 1];
      if (!activeTrade) {
        return {
          newState: {},
          message: "You don't have any open positions to close."
        };
      }
      
      let closingCost = 0;
      let profit = 0;
      
      if (activeTrade.type === 'put' && activeTrade.action === 'sell') {
        // Calculate remaining value of put based on stock price
        const timeLeft = (activeTrade.expiry - state.market.currentDay) / 30; // Portion of time left
        const intrinsicValue = Math.max(0, activeTrade.strike - state.market.stockPrice);
        const timeValue = activeTrade.premium * timeLeft * 0.8; // Time value decays
        
        closingCost = (intrinsicValue + timeValue) * 100;
        profit = (activeTrade.premium * 100) - closingCost;
      }
      
      return {
        newState: {},
        message: `You close your position for $${closingCost.toFixed(2)}, realizing a ${profit >= 0 ? 'profit' : 'loss'} of $${Math.abs(profit).toFixed(2)}.`
      };
      
    case 'HOLD_POSITION':
      return {
        newState: {},
        message: "You decide to hold your position and see how it develops."
      };
      
    case 'ROLL_POSITION':
      return {
        newState: {},
        message: "Rolling a position involves closing your current trade and opening a new one. This is an advanced technique we'll explore later."
      };
      
    default:
      return {
        newState: {},
        message: "You contemplate your next move in the market..."
      };
  }
};
