
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
        "bg-white border border-gray-200 rounded-lg p-4 font-sans text-gray-800 overflow-auto shadow-lg", 
        className
      )}
    >
      <div className="flex items-center mb-4">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="text-xs text-gray-500 font-medium flex-1 text-center">
          fntx_ai@localhost:~
        </div>
      </div>
      
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className="leading-relaxed animate-fade-in" 
            style={{animationDelay: `${index * 50}ms`}}
          >
            <span className="text-blue-500">$ </span>
            <span>{message}</span>
          </div>
        ))}
        
        {typing && (
          <div className="leading-relaxed animate-fade-in">
            <span className="text-blue-500">$ </span>
            <span>{displayedText}</span>
            <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
