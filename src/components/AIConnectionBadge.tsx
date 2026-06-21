import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { getGeminiApiKey } from '../lib/gemini';

export function AIConnectionBadge() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check initially
    setIsConnected(!!getGeminiApiKey());

    // Listen for storage changes in case the key is added/removed
    const handleStorageChange = () => {
      setIsConnected(!!getGeminiApiKey());
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('gemini_api_key_changed', handleStorageChange);

    // Poll every 2 seconds just in case it was updated without event
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gemini_api_key_changed', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (isConnected) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 shadow-sm" title="AI đã kết nối">
        <Wifi className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">AI Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 shadow-sm" title="AI chưa kết nối. Vui lòng thiết lập API Key.">
      <WifiOff className="w-3.5 h-3.5" />
      <span className="text-[10px] font-bold uppercase tracking-wider">AI Offline</span>
    </div>
  );
}
