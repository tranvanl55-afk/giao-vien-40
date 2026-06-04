import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  onProfileClick?: () => void;
}

export function Footer({ onProfileClick }: FooterProps) {
  const { currentUser } = useAuth();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/60 backdrop-blur-2xl border-t border-white/10 py-4 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between text-xs md:text-sm font-medium text-slate-400 space-y-2 md:space-y-0">
        <p 
          onClick={onProfileClick}
          className="text-slate-300 tracking-wide font-semibold text-center md:text-left drop-shadow-sm cursor-pointer hover:text-cyan-400 transition-colors"
        >
          {currentUser ? currentUser.displayName || "User" : "Trần Văn Lĩnh - THCS Ngô Chí Quốc"}
        </p>
        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center gap-1 group">
            Email: <span className="group-hover:underline text-cyan-400">{currentUser ? currentUser.email : "tranvanl55@gmail.com"}</span>
          </div>
          {!currentUser && (
            <>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <div className="flex items-center gap-1 group">
                SĐT: <span className="group-hover:underline text-cyan-400">0965819180</span>
              </div>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
