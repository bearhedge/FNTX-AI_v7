
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TerminalProps {
  messages: string[];
  typing?: boolean;
  className?: string;
  displayedText?: string;
}

export function Terminal({ messages, typing = false, className, displayedText = '' }: TerminalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div 
      className={cn(
        "bg-terminal-dark border border-terminal-light rounded-md p-4 font-mono text-terminal-text overflow-auto", 
        className
      )}
    >
      <div className="flex items-center mb-4">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 bg-terminal-red rounded-full"></div>
          <div className="w-3 h-3 bg-terminal-yellow rounded-full"></div>
          <div className="w-3 h-3 bg-terminal-green rounded-full"></div>
        </div>
        <div className="text-xs text-terminal-muted font-semibold flex-1 text-center">
          options_whisperer@localhost:~
        </div>
      </div>
      
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className="leading-relaxed animate-fade-in" 
            style={{animationDelay: `${index * 50}ms`}}
          >
            <span className="text-terminal-blue">$ </span>
            <span>{message}</span>
          </div>
        ))}
        
        {typing && (
          <div className="leading-relaxed animate-fade-in">
            <span className="text-terminal-blue">$ </span>
            <span>{displayedText}</span>
            <span className="inline-block w-2 h-4 bg-terminal-accent animate-pulse ml-0.5"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
