
import { Scenario, GameState, Choice } from "@/types/game.types";

export const scenarios: Scenario[] = [
  {
    id: "intro",
    title: "Welcome to Options Whisperer: SPY Edition",
    description: "Your journey into SPY options trading begins now.",
    context: "You've decided to focus on trading SPY 500 index options to spread risk across a broad range of assets and reduce exposure to any single stock. Your broker has approved your account for options trading.",
    choices: [
      {
        id: "start",
        text: "Let's get started",
        action: "BEGIN_GAME",
        tooltip: "Start your SPY options trading journey"
      }
    ]
  },
  {
    id: "tutorial",
    title: "SPY Options Basics",
    description: "Before diving in, let's review SPY options basics.",
    context: "SPY is an ETF that tracks the S&P 500 index, representing 500 of the largest US companies. Trading options on SPY gives you exposure to the broader market rather than individual stocks, helping diversify risk. You'll be focusing on selling options to collect premium income.",
    choices: [
      {
        id: "learn_more",
        text: "Tell me more about selling SPY options",
        action: "LEARN_OPTIONS",
        tooltip: "Get additional information about SPY options selling strategies"
      },
      {
        id: "skip_tutorial",
        text: "Skip tutorial, I know SPY options already",
        action: "SKIP_TUTORIAL",
        tooltip: "Jump straight to trading if you're already familiar with SPY options"
      }
    ]
  },
  {
    id: "time_barrier",
    title: "Set Trading Time Barrier",
    description: "Choose when to start trading during the day.",
    context: "Experienced traders often avoid trading right at market open when volatility can be erratic. Setting a time barrier lets you observe market trends before committing capital.",
    choices: [
      {
        id: "three_hours",
        text: "Set 3-hour barrier (Start trading at 12pm)",
        action: "SET_TIME_BARRIER_3",
        tooltip: "Allow trading to begin after observing 3 hours of market action"
      },
      {
        id: "four_hours",
        text: "Set 4-hour barrier (Start trading at 1pm)",
        action: "SET_TIME_BARRIER_4",
        tooltip: "Allow trading to begin after observing 4 hours of market action"
      },
      {
        id: "five_hours",
        text: "Set 5-hour barrier (Start trading at 2pm)",
        action: "SET_TIME_BARRIER_5",
        tooltip: "Allow trading to begin after observing 5 hours of market action"
      }
    ]
  },
  {
    id: "skip_trading",
    title: "Daily Trading Decision",
    description: "Decide whether to trade today after observing the market.",
    context: "After your time barrier, you need to decide if market conditions are suitable for trading today or if you should sit out.",
    choices: [
      {
        id: "trade_today",
        text: "Proceed with trading today",
        action: "PROCEED_TRADING",
        tooltip: "Move forward with finding trading opportunities today"
      },
      {
        id: "skip_today",
        text: "Skip trading for today",
        action: "SKIP_TRADING",
        tooltip: "Observe but don't trade today, preserving capital for another opportunity"
      }
    ]
  },
  {
    id: "position_sizing",
    title: "Position Sizing",
    description: "Determine how much capital to allocate.",
    context: "Risk management is key to long-term success. Decide what percentage of your available buying power you want to use for today's trade.",
    choices: [
      {
        id: "size_small",
        text: "Small position (10% of buying power)",
        action: "SIZE_POSITION_10",
        tooltip: "Conservative approach with minimal risk"
      },
      {
        id: "size_medium",
        text: "Medium position (25% of buying power)",
        action: "SIZE_POSITION_25",
        tooltip: "Balanced approach with moderate risk"
      },
      {
        id: "size_large",
        text: "Large position (50% of buying power)",
        action: "SIZE_POSITION_50",
        tooltip: "Aggressive approach with higher risk and reward potential"
      }
    ]
  },
  {
    id: "option_selection",
    title: "Select Option Strategy",
    description: "Choose which options to sell based on market analysis.",
    context: "You're looking for options with delta less than 0.3 for higher probability of profit, though lower premium.",
    choices: [
      {
        id: "sell_puts",
        text: "Sell put options (bullish/neutral outlook)",
        action: "SELECT_PUTS",
        tooltip: "Collect premium by selling puts, profitable in flat or rising markets"
      },
      {
        id: "sell_calls",
        text: "Sell call options (bearish/neutral outlook)",
        action: "SELECT_CALLS", 
        tooltip: "Collect premium by selling calls, profitable in flat or falling markets"
      },
      {
        id: "sell_both",
        text: "Sell both puts and calls (neutral outlook)",
        action: "SELECT_BOTH",
        tooltip: "Create an iron condor position, profitable when SPY stays within a range"
      }
    ]
  },
  {
    id: "put_strike_selection",
    title: "Select Put Strike",
    description: "Choose which put option strike to sell.",
    context: "Filter by delta < 0.3 for higher probability trades.",
    choices: [] // Will be populated dynamically based on available strikes
  },
  {
    id: "call_strike_selection",
    title: "Select Call Strike",
    description: "Choose which call option strike to sell.",
    context: "Filter by delta < 0.3 for higher probability trades.",
    choices: [] // Will be populated dynamically based on available strikes
  }
];

// Game actions
export const performGameAction = (action: string, state: GameState): { newState: Partial<GameState>, message: string } => {
  switch (action) {
    case 'BEGIN_GAME':
      return {
        newState: { gamePhase: 'setup' },
        message: "Welcome to SPY options trading! Before we begin, what's your name?"
      };
      
    case 'LEARN_OPTIONS':
      return {
        newState: {},
        message: "SPY options are ideal for traders seeking market exposure with lower volatility than individual stocks. When selling SPY options, you collect premium upfront. The key advantage is that SPY rarely makes dramatic moves compared to individual stocks, improving your probability of profit. Focus on options with delta < 0.3 to increase your success rate."
      };
      
    case 'SKIP_TUTORIAL':
      return {
        newState: { gamePhase: 'playing' },
        message: "Great! Let's jump straight to setting your trading parameters for SPY options."
      };
      
    case 'SET_TIME_BARRIER_3':
      return {
        newState: { 
          player: {
            ...state.player,
            tradingTimeBarrier: 3
          }
        },
        message: "You've set a 3-hour time barrier. You'll start trading at 12pm after observing the morning market trends."
      };
      
    case 'SET_TIME_BARRIER_4':
      return {
        newState: { 
          player: {
            ...state.player,
            tradingTimeBarrier: 4
          }
        },
        message: "You've set a 4-hour time barrier. You'll start trading at 1pm after observing more of the day's market action."
      };
      
    case 'SET_TIME_BARRIER_5':
      return {
        newState: { 
          player: {
            ...state.player,
            tradingTimeBarrier: 5
          }
        },
        message: "You've set a 5-hour time barrier. You'll start trading at 2pm after most of the day's trend is established."
      };
      
    case 'PROCEED_TRADING':
      return {
        newState: { 
          player: {
            ...state.player,
            canTradeToday: true
          },
          market: {
            ...state.market,
            currentHour: (state.player.tradingTimeBarrier || 3) // Set current hour to match time barrier
          }
        },
        message: "You've decided to proceed with trading today. Now let's determine position sizing."
      };
      
    case 'SKIP_TRADING':
      return {
        newState: { 
          player: {
            ...state.player,
            canTradeToday: false
          },
          // Advance to next day
          market: {
            ...state.market,
            currentDay: state.market.currentDay + 1,
            currentHour: 0
          }
        },
        message: "You've decided to sit out today's trading session. A disciplined trader knows when to stay on the sidelines. We'll resume tomorrow morning."
      };
      
    case 'SIZE_POSITION_10':
      return {
        newState: { 
          player: {
            ...state.player,
            positionSize: 10
          }
        },
        message: "You've chosen a conservative position size of 10% of your buying power. This limits potential losses but also caps potential gains."
      };
      
    case 'SIZE_POSITION_25':
      return {
        newState: { 
          player: {
            ...state.player,
            positionSize: 25
          }
        },
        message: "You've chosen a moderate position size of 25% of your buying power. This balances risk and potential reward."
      };
      
    case 'SIZE_POSITION_50':
      return {
        newState: { 
          player: {
            ...state.player,
            positionSize: 50
          }
        },
        message: "You've chosen an aggressive position size of 50% of your buying power. This maximizes potential gains but also increases risk."
      };
      
    case 'SELECT_PUTS':
      // Filter for put options with delta < 0.3
      const availablePutStrikes = Object.entries(state.market.availableDeltas.puts)
        .filter(([_, delta]) => delta < 0.3)
        .map(([strike, delta]) => ({
          strike: Number(strike),
          delta
        }));
        
      // Generate choices based on available strikes
      const putChoices = availablePutStrikes.map(({strike, delta}) => ({
        id: `put_${strike}`,
        text: `Sell $${strike} strike put (Delta: ${delta}, Premium: $${(delta * 5).toFixed(2)})`,
        action: `SELL_PUT_${strike}`,
        tooltip: `Sell a put option at strike $${strike} with a delta of ${delta}`
      }));
        
      return {
        newState: {
          currentScenario: {
            ...state.currentScenario!,
            title: "Select Put Strike",
            choices: putChoices
          },
          currentChoices: putChoices
        },
        message: "You've decided to sell put options. Now select a strike price with delta < 0.3 for higher probability of profit."
      };
      
    case 'SELECT_CALLS':
      // Filter for call options with delta < 0.3
      const availableCallStrikes = Object.entries(state.market.availableDeltas.calls)
        .filter(([_, delta]) => delta < 0.3)
        .map(([strike, delta]) => ({
          strike: Number(strike),
          delta
        }));
        
      // Generate choices based on available strikes
      const callChoices = availableCallStrikes.map(({strike, delta}) => ({
        id: `call_${strike}`,
        text: `Sell $${strike} strike call (Delta: ${delta}, Premium: $${(delta * 5).toFixed(2)})`,
        action: `SELL_CALL_${strike}`,
        tooltip: `Sell a call option at strike $${strike} with a delta of ${delta}`
      }));
        
      return {
        newState: {
          currentScenario: {
            ...state.currentScenario!,
            title: "Select Call Strike",
            choices: callChoices
          },
          currentChoices: callChoices
        },
        message: "You've decided to sell call options. Now select a strike price with delta < 0.3 for higher probability of profit."
      };
      
    // Add handling for SELL_PUT_XXX and SELL_CALL_XXX dynamically
    default:
      // Handle dynamically generated actions like SELL_PUT_450
      if (action.startsWith('SELL_PUT_')) {
        const strike = Number(action.replace('SELL_PUT_', ''));
        const delta = state.market.availableDeltas.puts[strike] || 0.15;
        const premium = delta * 5; // Simple premium calculation
        
        return {
          newState: {
            player: {
              ...state.player,
              currentTrade: {
                type: 'put',
                action: 'sell',
                strike,
                premium,
                expiry: state.market.currentDay + 30,
                quantity: 1,
                status: 'open',
                entryDay: state.market.currentDay,
                entryHour: state.market.currentHour,
                delta
              }
            }
          },
          message: `You sell a $${strike} strike put on SPY expiring in 30 days for a premium of $${premium.toFixed(2)} per share ($${(premium * 100).toFixed(2)} total).`
        };
      }
      
      if (action.startsWith('SELL_CALL_')) {
        const strike = Number(action.replace('SELL_CALL_', ''));
        const delta = state.market.availableDeltas.calls[strike] || 0.15;
        const premium = delta * 5; // Simple premium calculation
        
        return {
          newState: {
            player: {
              ...state.player,
              currentTrade: {
                type: 'call',
                action: 'sell',
                strike,
                premium,
                expiry: state.market.currentDay + 30,
                quantity: 1,
                status: 'open',
                entryDay: state.market.currentDay,
                entryHour: state.market.currentHour,
                delta
              }
            }
          },
          message: `You sell a $${strike} strike call on SPY expiring in 30 days for a premium of $${premium.toFixed(2)} per share ($${(premium * 100).toFixed(2)} total).`
        };
      }
      
      return {
        newState: {},
        message: "You contemplate your next move in the market..."
      };
  }
};

// Function to update game flow based on time barrier
export const advanceGameFlow = (state: GameState): { nextScenario: string | null, message: string } => {
  // If player just completed setup, move to time barrier selection
  if (state.gamePhase === 'setup' && state.player.name) {
    return {
      nextScenario: 'time_barrier',
      message: `Welcome, ${state.player.name}! Let's set up your trading parameters for SPY options.`
    };
  }
  
  // If time barrier is set but trading decision not made, move to trading decision
  if (state.player.tradingTimeBarrier && state.player.canTradeToday === true && state.player.positionSize === null) {
    return {
      nextScenario: 'position_sizing',
      message: "Now that you've decided to trade today, let's determine your position size."
    };
  }
  
  // If position size is set, move to option selection
  if (state.player.positionSize && !state.player.currentTrade) {
    return {
      nextScenario: 'option_selection',
      message: "With your position size set, it's time to select which options to sell."
    };
  }
  
  return { nextScenario: null, message: "" };
};
