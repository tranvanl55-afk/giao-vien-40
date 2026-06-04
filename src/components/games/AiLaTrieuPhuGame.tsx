import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, X, HelpCircle, Phone, Users, RefreshCw, Trophy, AlertTriangle, ArrowRight, Play, Award } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
}

interface AiLaTrieuPhuGameProps {
  questions: Question[];
  onBack: () => void;
}

const PRIZES = [
  "200.000",
  "400.000",
  "600.000",
  "1.000.000",
  "2.000.000", // Mốc 5
  "3.000.000",
  "6.000.000",
  "10.000.000",
  "14.000.000",
  "22.000.000", // Mốc 10
  "30.000.000",
  "40.000.000",
  "60.000.000",
  "85.000.000",
  "150.000.000" // Mốc 15
];

// ==========================================
// LOGO AI LÀ TRIỆU PHÚ DẠNG VECTOR CAO CẤP
// ==========================================
const MillionaireLogo = ({ className = "w-40 h-40" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="logoBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#221454" />
          <stop offset="65%" stopColor="#0e072a" />
          <stop offset="100%" stopColor="#040112" />
        </radialGradient>
        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe600" />
          <stop offset="40%" stopColor="#b8860b" />
          <stop offset="60%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#9a6e00" />
        </linearGradient>
        <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Khối phát quang viền ngoài */}
      <circle cx="100" cy="100" r="92" fill="#06b6d4" opacity="0.2" filter="url(#glow)" />
      
      {/* Vòng tròn nền */}
      <circle cx="100" cy="100" r="90" fill="url(#logoBg)" stroke="url(#goldBorder)" strokeWidth="4.5" />
      <circle cx="100" cy="100" r="83" stroke="#4a3b8c" strokeWidth="1.5" />
      
      {/* Vòng neon trang trí ở trong */}
      <circle cx="100" cy="100" r="76" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.85" />
      
      {/* Các tia chớp phát sáng (Năng lượng) */}
      <path d="M 55,100 C 75,75 125,75 145,100" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5" filter="url(#glow)" />
      <path d="M 55,100 C 75,125 125,125 145,100" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5" filter="url(#glow)" />
      <path d="M 100,55 C 75,75 75,125 100,145" stroke="#ec4899" strokeWidth="1.2" opacity="0.4" />
      <path d="M 100,55 C 125,75 125,125 100,145" stroke="#ec4899" strokeWidth="1.2" opacity="0.4" />
      
      <circle cx="36" cy="100" r="2" fill="#ffd700" />
      <circle cx="164" cy="100" r="2" fill="#ffd700" />
      
      {/* Đường cong để viết chữ cong đầu & đuôi */}
      <path id="textPathTop" d="M 33,100 A 67,67 0 1,1 167,100" fill="none" />
      <path id="textPathBottom" d="M 167,100 A 67,67 0 0,1 33,100" fill="none" />
      
      {/* Chữ cong bên trên */}
      <text fontFamily="sans-serif" fontSize="10.5" fontWeight="900" fill="#ffd700" letterSpacing="2.8">
        <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
          AI LÀ TRIỆU PHÚ
        </textPath>
      </text>
      
      {/* Chữ cong bên dưới */}
      <text fontFamily="sans-serif" fontSize="10.5" fontWeight="900" fill="#ffd700" letterSpacing="2.8">
        <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
          AI LÀ TRIỆU PHÚ
        </textPath>
      </text>
      
      {/* Khung ruy băng ngang */}
      <path d="M 12,100 L 28,84 L 172,84 L 188,100 L 172,116 L 28,116 Z" fill="#1b0c3a" stroke="url(#goldBorder)" strokeWidth="3" />
      <path d="M 28,87 L 172,87" stroke="#ffeb3b" strokeWidth="1" opacity="0.6" />
      <path d="M 28,113 L 172,113" stroke="#ffeb3b" strokeWidth="1" opacity="0.6" />
      
      {/* Chữ ruy băng ngang chính giữa */}
      <text x="100" y="104.5" fontFamily="sans-serif" fontSize="11" fontWeight="950" fill="#ffffff" textAnchor="middle" letterSpacing="1">
        AI LÀ TRIỆU PHÚ
      </text>
    </svg>
  );
};

// ==========================================
// BỘ PHÁT ÂM THANH TRIỆU PHÚ LỢI DỤNG WEB AUDIO
// ==========================================
class MillionaireAudio {
  private ctx: AudioContext | null = null;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playBackgroundHum() {
    try {
      this.init();
      if (!this.ctx) return;
      this.stopBackgroundHum();

      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();

      this.humOsc.type = 'sawtooth';
      this.humOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 hum
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, this.ctx.currentTime);

      this.humGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.humGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.5);

      this.humOsc.connect(filter);
      filter.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);
      
      this.humOsc.start();
    } catch (e) {
      console.warn("Lỗi âm thanh nền:", e);
    }
  }

  stopBackgroundHum() {
    if (this.humOsc) {
      try {
        this.humOsc.stop();
      } catch (e) {}
      this.humOsc = null;
    }
  }

  playTick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playSelect() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(554.37, this.ctx.currentTime + 0.2); // C#5
      
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch (e) {}
  }

  playCorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.04, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch (e) {}
  }

  playIncorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch (e) {}
  }

  playWin() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const playTone = (freq: number, start: number, dur: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(0.05, now + start);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.05);
      };
      
      playTone(523.25, 0, 0.25);
      playTone(587.33, 0.25, 0.25);
      playTone(659.25, 0.5, 0.25);
      playTone(783.99, 0.75, 0.4);
      playTone(659.25, 1.15, 0.2);
      playTone(783.99, 1.35, 0.8);
    } catch (e) {}
  }
}

export function AiLaTrieuPhuGame({ questions, onBack }: AiLaTrieuPhuGameProps) {
  const maxLevels = Math.min(15, questions.length);
  const activeQuestions = useMemo(() => {
    if (questions.length >= 15) {
      return questions.slice(0, 15);
    }
    return questions;
  }, [questions]);

  // States
  const [gameState, setGameState] = useState<'intro' | 'rules' | 'playing' | 'gameover' | 'win'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0); 
  const [timer, setTimer] = useState(25);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [answerConfirmed, setAnswerConfirmed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Trợ giúp
  const [used5050, setUsed5050] = useState(false);
  const [usedCall, setUsedCall] = useState(false);
  const [usedAudience, setUsedAudience] = useState(false);
  
  const [removedOptions, setRemovedOptions] = useState<number[]>([]);
  const [activeCallModal, setActiveCallModal] = useState(false);
  const [activeAudienceModal, setLocalActiveAudienceModal] = useState(false);
  
  const [callResponseText, setCallResponseText] = useState('');
  const [audienceVotes, setAudienceVotes] = useState<number[]>([0, 0, 0, 0]);

  const audio = useMemo(() => new MillionaireAudio(), []);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (soundEnabled && gameState === 'playing') {
      audio.playBackgroundHum();
    } else {
      audio.stopBackgroundHum();
    }
    return () => audio.stopBackgroundHum();
  }, [soundEnabled, gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || answerConfirmed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (soundEnabled) audio.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentLevel, answerConfirmed, soundEnabled]);

  const handleTimeOut = () => {
    if (soundEnabled) audio.playIncorrect();
    setGameState('gameover');
  };

  const startPlaying = () => {
    setCurrentLevel(0);
    setTimer(25);
    setSelectedAns(null);
    setAnswerConfirmed(false);
    setUsed5050(false);
    setUsedCall(false);
    setUsedAudience(false);
    setRemovedOptions([]);
    setGameState('playing');
  };

  const handleSelectOption = (idx: number) => {
    if (answerConfirmed) return;
    if (removedOptions.includes(idx)) return;
    
    if (soundEnabled) audio.playSelect();
    setSelectedAns(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedAns === null || answerConfirmed) return;
    setAnswerConfirmed(true);
    
    const correctIdx = activeQuestions[currentLevel].answer;
    
    setTimeout(() => {
      if (selectedAns === correctIdx) {
        if (soundEnabled) audio.playCorrect();
        
        if (currentLevel === maxLevels - 1) {
          if (soundEnabled) audio.playWin();
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
          setGameState('win');
        } else {
          setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
            setTimer(25);
            setSelectedAns(null);
            setAnswerConfirmed(false);
            setRemovedOptions([]);
          }, 1500);
        }
      } else {
        if (soundEnabled) audio.playIncorrect();
        setTimeout(() => {
          setGameState('gameover');
        }, 1200);
      }
    }, 2000);
  };

  const trigger5050 = () => {
    if (used5050 || answerConfirmed) return;
    setUsed5050(true);
    const correct = activeQuestions[currentLevel].answer;
    
    const wrongs = [0, 1, 2, 3].filter(x => x !== correct);
    const shuffledWrongs = wrongs.sort(() => Math.random() - 0.5);
    setRemovedOptions([shuffledWrongs[0], shuffledWrongs[1]]);
  };

  const triggerCall = () => {
    if (usedCall || answerConfirmed) return;
    setUsedCall(true);
    
    const correct = activeQuestions[currentLevel].answer;
    const labels = ['A', 'B', 'C', 'D'];
    
    const accuracy = Math.max(0.4, 0.9 - (currentLevel * 0.04));
    const isCorrectTip = Math.random() < accuracy;
    
    let suggestedIdx = correct;
    if (!isCorrectTip) {
      const wrongs = [0, 1, 2, 3].filter(x => x !== correct && !removedOptions.includes(x));
      suggestedIdx = wrongs[Math.floor(Math.random() * wrongs.length)] ?? correct;
    }

    const responses = [
      `Alo! Mình nghĩ đáp án đúng là ${labels[suggestedIdx]} đó. Khá chắc chắn luôn, chúc bạn may mắn!`,
      `Chào bạn! Theo trí nhớ của mình thì câu này chọn ${labels[suggestedIdx]} nhé. Mong là giúp được bạn.`,
      `Khó quá, nhưng mình tin vào giác quan thứ sáu, đáp án là ${labels[suggestedIdx]}. Chọn đi nhé!`,
      `Chào bạn thân yêu! Mình cá chắc 90% đáp án câu này là ${labels[suggestedIdx]}. Tự tin lên nha!`
    ];
    
    setCallResponseText(responses[Math.floor(Math.random() * responses.length)]);
    setActiveCallModal(true);
  };

  const triggerAudience = () => {
    if (usedAudience || answerConfirmed) return;
    setUsedAudience(true);
    
    const correct = activeQuestions[currentLevel].answer;
    const correctPercent = Math.max(30, Math.floor(75 - currentLevel * 3.5));
    let remaining = 100 - correctPercent;
    
    const votes = [0, 0, 0, 0];
    votes[correct] = correctPercent;
    
    const activeWrongs = [0, 1, 2, 3].filter(x => x !== correct && !removedOptions.includes(x));
    
    activeWrongs.forEach((idx, i) => {
      if (i === activeWrongs.length - 1) {
        votes[idx] = remaining;
      } else {
        const val = Math.floor(Math.random() * (remaining - activeWrongs.length + i));
        votes[idx] = val;
        remaining -= val;
      }
    });

    setAudienceVotes(votes);
    setLocalActiveAudienceModal(true);
  };

  const handleWalkAway = () => {
    if (soundEnabled) audio.playIncorrect();
    setGameState('gameover');
  };

  const accumulatedPrize = useMemo(() => {
    if (currentLevel === 0) return "0";
    return PRIZES[currentLevel - 1];
  }, [currentLevel]);

  const securedPrize = useMemo(() => {
    if (currentLevel < 5) return "0";
    if (currentLevel < 10) return PRIZES[4]; 
    return PRIZES[9]; 
  }, [currentLevel]);

  const hexagonStyle = {
    clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)',
  };

  return (
    <div className="absolute inset-0 bg-[#06041a] z-50 rounded-2xl md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col font-sans text-slate-100 selection:bg-cyan-500/20">
      
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-45">
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-[#221454] blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#06b6d4]/10 blur-[140px] rounded-full"></div>
      </div>

      {/* 1. WELCOME SCREEN (INTRO) */}
      {gameState === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center animate-in fade-in duration-500">
          <div className="flex flex-col items-center gap-6 max-w-lg w-full">
            <div className="relative animate-bounce" style={{ animationDuration: '4s' }}>
              <MillionaireLogo className="w-56 h-56 md:w-64 md:h-64 filter drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]" />
            </div>

            <div className="bg-slate-900/90 border border-white/10 p-6 md:p-8 rounded-[32px] w-full shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-cyan-500 via-purple-500 to-cyan-500"></div>
              <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-yellow-300 via-amber-400 to-yellow-300 tracking-wider">
                AI LÀ TRIỆU PHÚ
              </h1>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mt-1.5">Millionaire Quiz (H5)</p>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed font-medium">
                Vượt qua 15 câu hỏi khoa học tự nhiên hóc búa để ghi danh bảng vàng triệu phú tri thức!
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-sm mt-2">
              <button
                onClick={() => setGameState('rules')}
                className="py-4 bg-linear-to-r from-violet-700 to-indigo-700 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl font-black tracking-wider uppercase text-sm shadow-[0_4px_25px_rgba(99,102,241,0.25)] transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                Bắt đầu
              </button>
              <button
                onClick={onBack}
                className="py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white rounded-2xl font-black tracking-wider uppercase text-xs transition-all cursor-pointer"
              >
                Trở lại sảnh game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. RULES */}
      {gameState === 'rules' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 animate-in fade-in duration-500">
          <div className="max-w-2xl w-full bg-slate-900/90 border border-white/10 p-6 md:p-8 rounded-[36px] shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>
            
            <div className="flex items-center gap-3 justify-center mb-6">
              <Award className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h2 className="text-2xl font-black text-white text-center uppercase tracking-wide">
                Luật chơi triệu phú
              </h2>
            </div>

            <div className="space-y-4 text-slate-300 text-sm md:text-base font-medium">
              <div className="flex gap-3.5 items-start">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold shrink-0 flex items-center justify-center text-xs">1</span>
                <p>Gồm đúng <strong>15 câu hỏi trắc nghiệm</strong> với độ khó tăng dần.</p>
              </div>
              <div className="flex gap-3.5 items-start">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold shrink-0 flex items-center justify-center text-xs">2</span>
                <p>Bạn có 3 mốc quan trọng tự động giữ tiền thưởng: <strong>Câu 5</strong> (2.000.000đ), <strong>Câu 10</strong> (22.000.000đ) và <strong>Câu 15</strong> (150.000.000đ).</p>
              </div>
              <div className="flex gap-3.5 items-start">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold shrink-0 flex items-center justify-center text-xs">3</span>
                <p>Thời gian suy nghĩ cho mỗi câu hỏi là <strong>25 giây</strong>.</p>
              </div>
              <div className="flex gap-3.5 items-start">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold shrink-0 flex items-center justify-center text-xs">4</span>
                <p>Bạn được cung cấp <strong>3 quyền trợ giúp cực kỳ mạnh mẽ</strong>: 50-50 loại bỏ hai đáp án sai, Gọi điện cho người thân, Hỏi ý kiến khán giả.</p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setGameState('intro')}
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition-all text-sm cursor-pointer"
              >
                Quay lại
              </button>
              <button
                onClick={startPlaying}
                className="flex-1 py-3.5 bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Sẵn sàng! Chơi ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PLAYING SCREEN */}
      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col relative z-10 p-4 md:p-6 select-none justify-between animate-in fade-in duration-500">
          
          {/* HEADER HUD */}
          <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs md:text-sm font-black text-slate-200 font-mono">
                CÂU <span className="text-yellow-400 font-extrabold">{currentLevel + 1}</span>/{maxLevels}
              </div>
              <div className={`px-3 py-1.5 border rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-1 font-mono ${
                timer <= 5 
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse' 
                  : 'bg-white/5 border-white/10 text-cyan-400'
              }`}>
                ⏱ {timer}s
              </div>
              <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs md:text-sm font-black text-slate-300">
                CHỦ ĐỀ <span className="text-white">Khoa học</span>
              </div>
            </div>

            {/* Lifelines */}
            <div className="flex items-center gap-2">
              <button
                onClick={trigger5050}
                disabled={used5050 || answerConfirmed}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${
                  used5050 
                    ? 'bg-slate-800 border-white/5 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-950/80 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900 hover:border-indigo-400 hover:text-white cursor-pointer active:scale-95'
                }`}
                title="Quyền trợ giúp 50-50"
              >
                50-50
              </button>

              <button
                onClick={triggerAudience}
                disabled={usedAudience || answerConfirmed}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border transition-all ${
                  usedAudience 
                    ? 'bg-slate-800 border-white/5 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-950/80 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900 hover:border-indigo-400 hover:text-white cursor-pointer active:scale-95'
                }`}
                title="Ý kiến khán giả"
              >
                <Users size={16} />
              </button>

              <button
                onClick={triggerCall}
                disabled={usedCall || answerConfirmed}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border transition-all ${
                  usedCall 
                    ? 'bg-slate-800 border-white/5 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-950/80 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900 hover:border-indigo-400 hover:text-white cursor-pointer active:scale-95'
                }`}
                title="Gọi điện"
              >
                <Phone size={16} />
              </button>

              <button
                onClick={handleWalkAway}
                className="px-3.5 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-950/40 text-red-400 hover:text-red-200 text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95"
              >
                Dừng cuộc chơi
              </button>

              <div className="w-px h-6 bg-white/10 mx-1"></div>

              <button
                onClick={() => setGameState('intro')}
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* MAIN GAMEBOARD STAGE */}
          <div className="flex-1 flex flex-col items-center justify-center gap-12 py-6 relative">
            
            {/* Question Hexagon Container */}
            <div className="relative w-full max-w-4xl px-8 flex justify-center">
              
              {/* Overlapping mini logo */}
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <MillionaireLogo className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.25)]" />
              </div>

              {/* Hexagonal question bar */}
              <div 
                style={hexagonStyle}
                className="w-full bg-linear-to-r from-[#0b0c40] to-[#121350] border-t border-b border-cyan-400/50 min-h-[96px] md:min-h-[120px] pl-20 md:pl-28 pr-12 py-5 flex items-center shadow-[0_0_40px_rgba(6,182,212,0.12)] border-l-2 border-r-2"
              >
                <h2 className="text-slate-100 font-bold text-base md:text-xl text-left leading-relaxed">
                  {activeQuestions[currentLevel].text}
                </h2>
              </div>
            </div>

            {/* Answer Hexagons (2x2 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full px-6">
              {activeQuestions[currentLevel].options.map((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                const isSelected = selectedAns === idx;
                const isCorrect = activeQuestions[currentLevel].answer === idx;
                const isRemoved = removedOptions.includes(idx);

                let btnClass = 'bg-[#0f113a]/90 hover:bg-[#1a1d5d]/85 text-slate-200 border-t border-b border-blue-800/40 hover:border-cyan-400/30 border-l border-r';
                
                if (isRemoved) {
                  btnClass = 'opacity-0 pointer-events-none';
                } else if (isSelected) {
                  if (answerConfirmed) {
                    btnClass = isCorrect 
                      ? 'bg-green-600 border-t border-b border-green-400 text-white animate-pulse shadow-[0_0_20px_rgba(74,222,128,0.35)]' 
                      : 'bg-red-650 border-t border-b border-red-500 text-white';
                  } else {
                    btnClass = 'bg-orange-500 border-t border-b border-orange-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]';
                  }
                } else if (answerConfirmed && isCorrect) {
                  btnClass = 'bg-green-600 border-t border-b border-green-400 text-white shadow-[0_0_20px_rgba(74,222,128,0.35)]';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={answerConfirmed || isRemoved}
                    style={hexagonStyle}
                    className={`py-3.5 md:py-4 px-8 text-left text-sm md:text-base font-medium tracking-wide flex items-center gap-3 transition-all cursor-pointer duration-200 ${btnClass}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-black shrink-0 ${
                      isSelected 
                        ? 'bg-white text-slate-950 shadow-md' 
                        : 'bg-white/10 text-slate-400'
                    }`}>
                      {label}
                    </span>
                    <span className="truncate">{opt.replace(/^[A-D]\.\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <footer className="flex items-center justify-between bg-slate-950/80 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mức thưởng hiện tại</p>
              <p className="text-sm md:text-base font-extrabold text-yellow-400 font-mono">{PRIZES[currentLevel]} đ</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedAns === null || answerConfirmed}
                className={`px-8 py-2.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  selectedAns === null || answerConfirmed
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-transparent'
                    : 'bg-linear-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 shadow-md cursor-pointer active:scale-95'
                }`}
              >
                Đồng ý chốt <ArrowRight size={14} />
              </button>
            </div>
          </footer>

        </div>
      )}

      {/* 4. GAME OVER SCREEN */}
      {gameState === 'gameover' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center animate-in scale-in duration-300">
          <div className="max-w-md w-full bg-slate-900/95 border border-white/10 p-6 md:p-8 rounded-[36px] shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500"></div>
            
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4 animate-pulse">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-wider">
              Kết thúc lượt chơi!
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">Bạn đã dừng chân ở câu hỏi số {currentLevel + 1}</p>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 my-6">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Số tiền tích lũy thực tế</p>
              <p className="text-3xl font-black text-yellow-400 mt-1 font-mono">{securedPrize} đ</p>
              <p className="text-[10px] text-slate-500 mt-1 font-bold">Số tiền gốc bạn tích lũy được: {accumulatedPrize}đ</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setGameState('intro')}
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition-all text-sm cursor-pointer"
              >
                Về sảnh
              </button>
              <button
                onClick={startPlaying}
                className="flex-1 py-3.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. VICTORY SCREEN */}
      {gameState === 'win' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center animate-in scale-in duration-300">
          <div className="max-w-md w-full bg-slate-900/95 border border-white/10 p-6 md:p-8 rounded-[36px] shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-yellow-400 via-amber-400 to-yellow-400"></div>
            
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mx-auto mb-4 animate-bounce">
              <Trophy size={40} />
            </div>

            <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider">
              CHIẾN THẮNG TUYỆT ĐỐI!
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">Bạn đã vượt qua 15 câu hỏi và trở thành triệu phú tri thức!</p>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 my-6 animate-pulse">
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Giải thưởng triệu phú cao nhất</p>
              <p className="text-4xl font-black text-yellow-300 mt-1 font-mono">150.000.000 đ</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setGameState('intro')}
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition-all text-sm cursor-pointer"
              >
                Về sảnh
              </button>
              <button
                onClick={startPlaying}
                className="flex-1 py-3.5 bg-linear-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 rounded-xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALL A FRIEND MODAL */}
      <AnimatePresence>
        {activeCallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full relative text-left"
            >
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-indigo-400 animate-bounce" /> Trợ giúp gọi người thân
              </h3>
              
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-slate-200 text-sm leading-relaxed mb-6 font-medium font-sans">
                {callResponseText}
              </div>

              <button
                onClick={() => setActiveCallModal(false)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer text-center text-sm"
              >
                Đồng ý
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASK THE AUDIENCE MODAL */}
      <AnimatePresence>
        {activeAudienceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-md w-full relative text-left"
            >
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-cyan-400" /> Trợ giúp hỏi ý kiến khán giả
              </h3>

              <div className="flex items-end justify-between gap-4 h-48 bg-black/30 border border-white/5 p-5 rounded-xl mb-6">
                {audienceVotes.map((pct, idx) => {
                  const label = ['A', 'B', 'C', 'D'][idx];
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="text-xs font-bold text-slate-300 font-mono">{pct}%</div>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${pct * 1.2}px` }}
                        transition={{ type: 'spring', stiffness: 80 }}
                        className="w-8 bg-linear-to-t from-cyan-600 to-indigo-500 rounded-t-md shadow-lg"
                      />
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-slate-400 font-mono">
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setLocalActiveAudienceModal(false)}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl transition-all cursor-pointer text-center text-sm"
              >
                Đồng ý
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
