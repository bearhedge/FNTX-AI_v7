
import React from 'react';
import { PlayerState, MarketState } from '@/types/game.types';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';

interface PlayerInfoProps {
  player: PlayerState;
  market: MarketState;
  className?: string;
}

export function PlayerInfo({ player, className }: PlayerInfoProps) {
  const buyingPower = player.cash * 6; // 6x leverage for margin accounts
  
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };
  
  return (
    <div className={cn("font-sans text-base space-y-4", className)}>
      {/* Account Info Table */}
      <div className="bg-terminal-dark rounded-md overflow-hidden">
        <div className="bg-terminal-light p-2 text-terminal-text font-bold border-b border-terminal-accent">
          Account Summary
        </div>
        <div className="p-3">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">Account Type</TableCell>
                <TableCell className="text-terminal-text text-right font-sans text-base">Paper - Margin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">Account Number</TableCell>
                <TableCell className="text-terminal-text text-right font-sans text-base">PAPER-{player.name.toUpperCase().slice(0, 4)}-001</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">Balance</TableCell>
                <TableCell className="text-terminal-green font-bold text-right font-sans text-base">${formatNumber(player.cash)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">Buying Power</TableCell>
                <TableCell className="text-terminal-blue font-bold text-right font-sans text-base">${formatNumber(buyingPower)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Performance Metrics Table */}
      <div className="bg-terminal-dark rounded-md overflow-hidden">
        <div className="bg-terminal-light p-2 text-terminal-text font-bold border-b border-terminal-accent">
          Performance Metrics
        </div>
        <div className="p-3">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">Smart Contract ID</TableCell>
                <TableCell className="text-terminal-text text-right font-sans text-base">SC-001</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">PIC</TableCell>
                <TableCell className="text-terminal-text text-right font-sans text-base">1.45x</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">DPI</TableCell>
                <TableCell className="text-terminal-text text-right font-sans text-base">0.85x</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">RVPI</TableCell>
                <TableCell className="text-terminal-text text-right font-sans text-base">0.60x</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm text-terminal-muted font-sans">TVPI</TableCell>
                <TableCell className="text-terminal-text text-right font-sans text-base">1.45x</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

