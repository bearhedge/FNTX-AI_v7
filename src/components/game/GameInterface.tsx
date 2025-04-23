
import React, { useState, useEffect } from 'react';
import { Terminal } from './Terminal';
import { ChoiceButtons } from './ChoiceButtons';
import { Tooltip } from './Tooltip';
import { PlayerInfo } from './PlayerInfo';
import { NameInput } from './NameInput';
import { useGameContext } from '@/context/GameContext';
import { scenarios, performGameAction } from '@/data/gameData';
import { Choice } from '@/types/game.types';
import { useTypingEffect } from '@/hooks/useTypingEffect';

export function GameInterface() {
  const { state, dispatch } = useGameContext();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

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

  // Handle player name submission
  const handleNameSubmit = (name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: name });
    
    addMessageWithTypingEffect(`Welcome, ${name}! Let's begin your options trading journey.`);
    
    const tutorialScenario = scenarios.find(s => s.id === 'tutorial');
    if (tutorialScenario) {
      setTimeout(() => {
        dispatch({ type: 'SET_SCENARIO', payload: tutorialScenario });
        dispatch({ type: 'SET_CHOICES', payload: tutorialScenario.choices });
        dispatch({ type: 'SET_GAME_PHASE', payload: 'playing' });
      }, 2000);
    }
  };

  // Handle choice selection
  const handleChoiceSelect = (choice: Choice) => {
    addMessageWithTypingEffect(`You selected: ${choice.text}`);
    
    const { newState, message } = performGameAction(choice.action, state);
    
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
    
    // Add the result message
    setTimeout(() => {
      addMessageWithTypingEffect(message);
      
      // Add trade if there's a current trade
      if (state.player.currentTrade) {
        dispatch({ type: 'ADD_TRADE', payload: state.player.currentTrade });
      }
      
      // Handle subsequent scenario based on action
      setTimeout(() => {
        let nextScenario = null;
        
        switch(choice.action) {
          case 'SELL_PUT':
            nextScenario = scenarios.find(s => s.id === 'put_strike_selection');
            break;
            
          case 'SELL_PUT_95':
          case 'SELL_PUT_100':
          case 'SELL_PUT_105':
            // Advance time and update market
            dispatch({ type: 'ADVANCE_DAY' });
            dispatch({ type: 'ADVANCE_DAY' });
            dispatch({ type: 'ADVANCE_DAY' });
            
            nextScenario = scenarios.find(s => s.id === 'market_movement');
            break;
            
          case 'SKIP_TUTORIAL':
            nextScenario = scenarios.find(s => s.id === 'first_trade');
            break;
        }
        
        if (nextScenario) {
          dispatch({ type: 'SET_SCENARIO', payload: nextScenario });
          dispatch({ type: 'SET_CHOICES', payload: nextScenario.choices });
        }
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-apple-silver-light/20">
      <h1 className="text-3xl font-bold text-center text-apple-gray-text mb-6">
        <div className="flex items-center justify-center gap-2">
          <img 
            src="/lovable-uploads/63b709cd-98d7-4791-a738-afc9f5da504e.png" 
            alt="FNTX Logo" 
            className="h-8 w-auto"
          />
          <span>AI<span className="text-apple-silver-dark">_</span></span>
        </div>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"> {/* Keep existing column span */}
          <Terminal 
            messages={state.history} 
            typing={state.isTyping}
            displayedText={displayedText}
            className="h-[500px]" /* Increased height from 400px to 500px */
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
