
import React, { useEffect, useState } from 'react';
import { PlayerState, MarketState } from '@/types/game.types';
import { cn } from '@/lib/utils';

interface PlayerInfoProps {
  player: PlayerState;
  market: MarketState;
  className?: string;
}

export function PlayerInfo({ player, market, className }: PlayerInfoProps) {
  const [priceFlash, setPriceFlash] = useState<'none' | 'up' | 'down'>('none');
  const [prevPrice, setPrevPrice] = useState(market.stockPrice);
  
  // Flash price change animation
  useEffect(() => {
    if (market.stockPrice > prevPrice) {
      setPriceFlash('up');
    } else if (market.stockPrice < prevPrice) {
      setPriceFlash('down');
    }
    
    const timer = setTimeout(() => {
      setPriceFlash('none');
      setPrevPrice(market.stockPrice);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [market.stockPrice, prevPrice]);
  
  return (
    <div className={cn("font-mono text-sm", className)}>
      <div className="bg-terminal-light rounded-t-md p-2 text-terminal-text font-bold border-b border-terminal-accent flex justify-between items-center">
        <span>Market Data</span>
        <span className="bg-terminal-dark px-2 py-1 rounded-md text-xs">Day {market.currentDay}</span>
      </div>
      <div className="bg-terminal-dark rounded-b-md p-3 space-y-3 text-terminal-text">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-terminal-accent mr-2 text-lg">{market.stockTicker}</span>
              <span className={cn(
                "px-1.5 py-0.5 text-xs rounded",
                market.trend === 'bullish' ? "bg-terminal-green/20 text-terminal-green" : 
                market.trend === 'bearish' ? "bg-terminal-red/20 text-terminal-red" : 
                "bg-terminal-yellow/20 text-terminal-yellow"
              )}>
                {market.trend}
              </span>
            </div>
            <div className={cn(
              "text-lg font-bold transition-colors duration-300",
              priceFlash === 'up' ? "text-terminal-green" : 
              priceFlash === 'down' ? "text-terminal-red" : 
              "text-terminal-text"
            )}>
              ${market.stockPrice.toFixed(2)}
              <span className="ml-1 text-xs">
                {priceFlash === 'up' ? '▲' : priceFlash === 'down' ? '▼' : ''}
              </span>
            </div>
          </div>
          
          <div className="bg-terminal-light/10 rounded p-2 flex justify-between">
            <div>
              <div className="text-xs text-terminal-muted">Volatility</div>
              <div className="text-terminal-yellow">{market.volatility}%</div>
            </div>
            <div>
              <div className="text-xs text-terminal-muted">Today</div>
              <div className={cn(
                market.stockPrice > prevPrice ? "text-terminal-green" : 
                market.stockPrice < prevPrice ? "text-terminal-red" : 
                "text-terminal-text"
              )}>
                {market.stockPrice > prevPrice ? '+' : market.stockPrice < prevPrice ? '-' : ''}
                ${Math.abs(market.stockPrice - prevPrice).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-terminal-muted">Volume</div>
              <div className="text-terminal-blue">254K</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-terminal-light pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold">Trader: {player.name || 'Unknown'}</div>
            <div className="bg-terminal-accent/20 text-terminal-accent text-xs px-2 py-0.5 rounded-full">
              Level {player.level}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-terminal-light/10 p-2 rounded">
              <div className="text-xs text-terminal-muted mb-1">Cash</div>
              <div className="text-terminal-green font-bold">${player.cash.toFixed(2)}</div>
            </div>
            <div className="bg-terminal-light/10 p-2 rounded">
              <div className="text-xs text-terminal-muted mb-1">Portfolio</div>
              <div className="text-terminal-green font-bold">${player.accountValue.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="mt-2 h-1.5 bg-terminal-light/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-terminal-blue rounded-full" 
              style={{ width: `${Math.min((player.experience / 100) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-right text-terminal-muted mt-1">
            XP: {player.experience}/100
          </div>
        </div>
        
        {player.trades.length > 0 && (
          <div className="border-t border-terminal-light pt-3">
            <div className="font-bold mb-2 flex items-center">
              <span className="w-2 h-2 bg-terminal-accent rounded-full mr-2"></span>
              Active Trades
            </div>
            
            <div className="space-y-2">
              {player.trades.filter(trade => trade.status === 'open').map((trade, index) => (
                <div 
                  key={index} 
                  className="text-xs p-2 border-l-2 border-terminal-accent bg-terminal-light/5 rounded-r"
                >
                  <div className="flex justify-between items-center">
                    <span className={trade.action === 'sell' ? "text-terminal-red" : "text-terminal-green"}>
                      {trade.action === 'sell' ? 'Short' : 'Long'} {trade.type.toUpperCase()}
                    </span>
                    <span className="text-terminal-muted">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Strike ${trade.strike}</span>
                    <span className="text-terminal-muted">
                      Exp: Day {trade.expiry}
                    </span>
                  </div>
                  <div className="mt-1 text-terminal-accent">
                    Premium: ${trade.premium.toFixed(2)} × {trade.quantity * 100} shares
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
