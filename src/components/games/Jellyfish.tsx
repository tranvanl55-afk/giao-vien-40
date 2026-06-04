import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface JellyfishProps {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  isCalled: boolean;
  hasCalledStudents: boolean;
  onClick: () => void;
}

export const Jellyfish: React.FC<JellyfishProps> = ({ id, name, color, x, y, isCalled, hasCalledStudents, onClick }) => {
  const [swimX, setSwimX] = useState(x);
  const [swimY, setSwimY] = useState(y);

  useEffect(() => {
    if (isCalled) return;
    const interval = setInterval(() => {
      // Bơi ngẫu nhiên xung quanh không gian
      setSwimX(prevX => {
        // Nếu có sứa đang được gọi, bơi hẳn ra ngoài màn hình để biến mất
        if (hasCalledStudents && !isCalled) {
          return prevX < 50 ? -20 : 120;
        }
        return Math.max(5, Math.min(90, prevX + (Math.random() * 20 - 10)));
      });
      setSwimY(prevY => Math.max(10, Math.min(85, prevY + (Math.random() * 20 - 10))));
    }, 3000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isCalled, hasCalledStudents]);

  const currentLeft = isCalled ? x : swimX;
  const currentTop = isCalled ? y : swimY;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        left: `${currentLeft}%`,
        top: `${currentTop}%`,
        x: '-50%',
        y: '-50%',
        scale: isCalled ? 2.5 : 1,
        opacity: hasCalledStudents && !isCalled ? 0 : 1,
        zIndex: isCalled ? 50 : 10
      }}
      transition={{
        type: "spring",
        stiffness: isCalled ? 50 : 10,
        damping: isCalled ? 10 : 20,
        duration: isCalled ? 1 : 4,
      }}
      className="absolute cursor-pointer flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
      onClick={onClick}
    >
      {/* Bobbing animation container */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: Math.random() * 2 + 3, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <svg width="80" height="100" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          <defs>
            <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={isCalled ? "12" : "6"} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <g filter={`url(#glow-${id})`}>
            {/* Jellyfish head */}
            <path d="M10,50 C10,10 90,10 90,50 C90,60 80,65 50,65 C20,65 10,60 10,50 Z" fill={color} fillOpacity="0.8" />
            <path d="M20,50 C20,20 80,20 80,50" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
            
            {/* Tentacles */}
            <path d="M30,60 Q30,90 20,110" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" strokeOpacity="0.8">
              <animate attributeName="d" values="M30,60 Q30,90 20,110; M30,60 Q40,90 25,110; M30,60 Q30,90 20,110" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M50,65 Q50,95 45,115" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" strokeOpacity="0.9">
              <animate attributeName="d" values="M50,65 Q50,95 45,115; M50,65 Q60,95 55,115; M50,65 Q50,95 45,115" dur="2.5s" repeatCount="indefinite" />
            </path>
            <path d="M70,60 Q70,90 80,110" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" strokeOpacity="0.8">
              <animate attributeName="d" values="M70,60 Q70,90 80,110; M70,60 Q60,90 75,110; M70,60 Q70,90 80,110" dur="3.5s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>

        {/* Name tag */}
        <div 
          className="mt-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap border border-white/20 backdrop-blur-sm"
          style={{ backgroundColor: color + '40', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
        >
          {name}
        </div>
      </motion.div>
    </motion.div>
  );
};
