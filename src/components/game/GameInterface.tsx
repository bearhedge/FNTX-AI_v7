
import React, { useState, useEffect } from 'react';
import { Terminal } from './Terminal';
import { ChoiceButtons } from './ChoiceButtons';
import { Tooltip } from './Tooltip';
import { PlayerInfo } from './PlayerInfo';
import { NameInput } from './NameInput';
import { useGameContext } from '@/context/GameContext';
import { scenarios, performGameAction, advanceGameFlow } from '@/data/gameData';
import { Choice } from '@/types/game.types';
import { useTypingEffect } from '@/hooks/useTypingEffect';

export function GameInterface() {
  const { state, dispatch } = useGameContext();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [timeBarrierSelected, setTimeBarrierSelected] = useState(false);

  // Set initial scenario
  useEffect(() => {
    if (state.gamePhase === 'intro') {
      const introScenario = scenarios.find(s => s.id === 'intro');
      if (introScenario) {
        dispatch({ type: 'SET_SCENARIO', payload: introScenario });
        dispatch({ type: 'SET_CHOICES', payload: introScenario.choices });
      }
    }
  }, [dispatch, state.gamePhase]);

  // Handle typing effect
  const [typingMessage, setTypingMessage] = useState('');
  const { displayedText, isComplete } = useTypingEffect(typingMessage, 20);
  
  // Simulate typing effect for messages with realistic typing
  const addMessageWithTypingEffect = (message: string) => {
    dispatch({ type: 'SET_IS_TYPING', payload: true });
    setTypingMessage(message);
  };
  
  // When typing completes, add the message to history
  useEffect(() => {
    if (isComplete && typingMessage) {
      dispatch({ type: 'ADD_MESSAGE', payload: typingMessage });
      dispatch({ type: 'SET_IS_TYPING', payload: false });
      setTypingMessage('');
    }
  }, [isComplete, typingMessage, dispatch]);
  
  // Handle game flow advancement - only run once during setup
  useEffect(() => {
    if (isComplete && !state.isTyping && state.gamePhase === 'playing' && !setupComplete) {
      const { nextScenario, message } = advanceGameFlow(state);
      
      if (message && nextScenario) {
        setTimeout(() => {
          addMessageWithTypingEffect(message);
          
          setTimeout(() => {
            const scenario = scenarios.find(s => s.id === nextScenario);
            if (scenario) {
              dispatch({ type: 'SET_SCENARIO', payload: scenario });
              dispatch({ type: 'SET_CHOICES', payload: scenario.choices });
              if (nextScenario === 'time_barrier') {
                setSetupComplete(true);
              }
            }
          }, 1500);
        }, 500);
      }
    }
  }, [isComplete, state, dispatch, setupComplete]);

  // Handle player name submission
  const handleNameSubmit = (name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: name });
    
    addMessageWithTypingEffect(`Welcome, ${name}! Let's begin your SPY options trading journey.`);
    
    setTimeout(() => {
      dispatch({ type: 'SET_GAME_PHASE', payload: 'playing' });
    }, 1500);
  };

  // Handle choice selection
  const handleChoiceSelect = (choice: Choice) => {
    // Prevent processing the same action multiple times
    if (state.isTyping) return;
    
    addMessageWithTypingEffect(`You selected: ${choice.text}`);
    
    const { newState, message } = performGameAction(choice.action, state);
    
    // Check if this is a time barrier selection
    if (choice.action.startsWith('SET_TIME_BARRIER_') && !timeBarrierSelected) {
      setTimeBarrierSelected(true);
    }
    
    // Update state based on action result
    if (newState.player) {
      dispatch({ type: 'UPDATE_PLAYER', payload: newState.player });
    }
    
    if (newState.gamePhase) {
      dispatch({ type: 'SET_GAME_PHASE', payload: newState.gamePhase });
    }
    
    if (newState.market) {
      dispatch({ type: 'UPDATE_MARKET', payload: newState.market });
    }
    
    if (newState.currentScenario) {
      dispatch({ type: 'SET_SCENARIO', payload: newState.currentScenario });
    }
    
    if (newState.currentChoices) {
      dispatch({ type: 'SET_CHOICES', payload: newState.currentChoices });
    }
    
    // Add the result message
    setTimeout(() => {
      addMessageWithTypingEffect(message);
      
      // Add trade if there's a current trade
      if (state.player.currentTrade) {
        setTimeout(() => {
          dispatch({ type: 'ADD_TRADE', payload: state.player.currentTrade });
        }, 1000);
      }
      
      // Advance to next scenario after time barrier selection
      if (choice.action.startsWith('SET_TIME_BARRIER_')) {
        setTimeout(() => {
          const nextScenario = scenarios.find(s => s.id === 'skip_trading');
          if (nextScenario) {
            dispatch({ type: 'SET_SCENARIO', payload: nextScenario });
            dispatch({ type: 'SET_CHOICES', payload: nextScenario.choices });
            addMessageWithTypingEffect("Now that you've set your time barrier, decide if you want to proceed with trading today based on the market conditions.");
          }
        }, 1500);
      }
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-apple-silver-light/20">
      <h1 className="text-3xl font-bold text-center text-apple-gray-text mb-6">
        FNTX AI
        <span className="text-apple-silver-dark">_</span>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Terminal 
            messages={state.history} 
            typing={state.isTyping}
            displayedText={displayedText}
            className="h-[500px]"
          />
          
          {state.gamePhase === 'setup' ? (
            <div className="mt-4">
              <NameInput onSubmit={handleNameSubmit} />
            </div>
          ) : (
            <div className="relative">
              {activeTooltip && (
                <div className="absolute bottom-full mb-2 w-full">
                  <Tooltip content={activeTooltip} />
                </div>
              )}
              
              <ChoiceButtons 
                choices={state.currentChoices}
                onSelect={handleChoiceSelect}
                onHover={(id) => {
                  const choice = state.currentChoices.find(c => c.id === id);
                  setActiveTooltip(choice?.tooltip || null);
                }}
                disabled={state.isTyping}
              />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <PlayerInfo 
            player={state.player}
            market={state.market}
          />
        </div>
      </div>
    </div>
  );
}
