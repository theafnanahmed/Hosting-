import React, { useEffect, useRef } from 'react';
import { ProjectStatus } from '../types';

interface TerminalProps {
  logs: string[];
  status: ProjectStatus;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, status }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black rounded-lg border border-dark-border overflow-hidden flex flex-col h-[400px] shadow-inner font-mono">
      <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-gray-500">
          {/* Fix: Using correct ProjectStatus property names DEPLOYED and IDLE */}
          {status === ProjectStatus.DEPLOYED ? 'server: online' : status === ProjectStatus.IDLE ? 'server: offline' : 'build-server-01'}
        </span>
      </div>
      <div ref={scrollRef} className="flex-1 p-4 text-xs overflow-y-auto space-y-1">
        {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-700">
                <span className="mb-2 opacity-50">Waiting for deployment...</span>
            </div>
        )}
        {logs.map((log, idx) => (
          <div key={idx} className="break-words font-medium">
            <span className="text-gray-600 mr-2 select-none">[{new Date().toLocaleTimeString()}]</span>
            <span className={
                log.includes('[Error]') ? 'text-red-400' : 
                log.includes('[Success]') ? 'text-green-400' : 
                log.includes('[System]') ? 'text-brand-400' : 
                'text-gray-300'
            }>
              {log}
            </span>
          </div>
        ))}
        {status === ProjectStatus.BUILDING && (
          <div className="animate-pulse text-brand-500">_ processing</div>
        )}
      </div>
    </div>
  );
};