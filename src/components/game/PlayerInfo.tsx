
import React from 'react';
import { PlayerState, MarketState } from '@/types/game.types';
import { cn } from '@/lib/utils';

interface PlayerInfoProps {
  player: PlayerState;
  market: MarketState;
  className?: string;
}

export function PlayerInfo({ player, className }: PlayerInfoProps) {
  const buyingPower = player.cash * 6; // 6x leverage for margin accounts
  
  return (
    <div className={cn("font-mono text-sm", className)}>
      <div className="bg-terminal-light rounded-t-md p-2 text-terminal-text font-bold border-b border-terminal-accent">
        Account Summary
      </div>
      <div className="bg-terminal-dark rounded-b-md p-3 space-y-3 text-terminal-text">
        <div className="space-y-2">
          <div className="bg-terminal-light/10 p-2 rounded">
            <div className="text-xs text-terminal-muted mb-1">Account Type</div>
            <div className="text-terminal-text">Paper - Margin</div>
          </div>
          
          <div className="bg-terminal-light/10 p-2 rounded">
            <div className="text-xs text-terminal-muted mb-1">Account Number</div>
            <div className="text-terminal-text">PAPER-{player.name.toUpperCase().slice(0, 4)}-001</div>
          </div>
          
          <div className="bg-terminal-light/10 p-2 rounded">
            <div className="text-xs text-terminal-muted mb-1">Balance</div>
            <div className="text-terminal-green font-bold">${player.cash.toFixed(2)}</div>
          </div>
          
          <div className="bg-terminal-light/10 p-2 rounded">
            <div className="text-xs text-terminal-muted mb-1">Buying Power</div>
            <div className="text-terminal-blue font-bold">${buyingPower.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
