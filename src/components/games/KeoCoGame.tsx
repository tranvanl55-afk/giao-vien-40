import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Question } from './GameHub';
import { motion, AnimatePresence } from 'motion/react';

const OPTS = ['A', 'B', 'C', 'D'];
const WIN_POS = 15; // percent per step
const TIMER_SEC = 15;

export function KeoCoGame({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [ropePos, setRopePos] = useState(50); // 0=team1 wins, 100=team2 wins
  const [teamAnswers, setTeamAnswers] = useState<(number | null)[]>([null, null]);
  const [phase, setPhase] = useState<'play' | 'reveal' | 'result'>('play');
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const [winner, setWinner] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shuffled = useRef([...questions].sort(() => Math.random() - 0.5)).current;
  const q = shuffled[qIdx % (shuffled.length || 1)];

  useEffect(() => {
    if (phase !== 'play') return;
    setTimeLeft(TIMER_SEC);
    timerRef.current = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(timerRef.current!); setTeamAnswers(prev => prev.map(a => a === null ? -1 : a)); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, qIdx]);

  useEffect(() => {
    if (phase !== 'play') return;
    if (teamAnswers.some(a => a === null)) return;
    clearInterval(timerRef.current!);
    setPhase('reveal');
    let newPos = ropePos;
    teamAnswers.forEach((ans, ti) => {
      if (ans !== null && ans >= 0 && ans === q?.answer) {
        newPos += ti === 0 ? -WIN_POS : WIN_POS;
      }
    });
    newPos = Math.max(0, Math.min(100, newPos));
    setRopePos(newPos);
    if (newPos <= 10) { setTimeout(() => { setWinner(0); setPhase('result'); }, 1200); return; }
    if (newPos >= 90) { setTimeout(() => { setWinner(1); setPhase('result'); }, 1200); return; }
    setTimeout(() => { setTeamAnswers([null, null]); setQIdx(i => i + 1); setPhase('play'); }, 1500);
  }, [teamAnswers, phase]);

  const handleAnswer = (ti: number, i: number) => {
    if (phase !== 'play' || teamAnswers[ti] !== null) return;
    setTeamAnswers(prev => { const n = [...prev]; n[ti] = i; return n; });
  };
  const reset = () => { setRopePos(50); setTeamAnswers([null, null]); setPhase('play'); setQIdx(0); setWinner(null); };

  const TEAMS = [
    { name: 'Đội Đỏ', emoji: '🔴', grad: 'from-red-600 to-rose-500', bg: 'bg-red-950/60', border: 'border-red-500/30', btn: 'bg-red-600/20 hover:bg-red-500/40 border-red-500/40' },
    { name: 'Đội Xanh', emoji: '🔵', grad: 'from-blue-600 to-indigo-500', bg: 'bg-blue-950/60', border: 'border-blue-500/30', btn: 'bg-blue-600/20 hover:bg-blue-500/40 border-blue-500/40' },
  ];

  if (questions.length === 0) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-white text-center p-8">
      <div><p className="text-5xl mb-4">📭</p><p className="text-xl font-bold mb-4">Chưa có câu hỏi!</p>
        <button onClick={onBack} className="px-6 py-3 bg-red-600 rounded-xl font-bold">Quay lại</button></div>
    </div>
  );

  if (phase === 'result') return (
    <div className={`h-screen flex flex-col items-center justify-center text-white gap-6 bg-linear-to-br ${winner === 0 ? 'from-red-950 to-rose-950' : 'from-blue-950 to-indigo-950'}`}>
      <div className="text-8xl">🏆</div>
      <motion.h2 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
        className="text-5xl font-black text-yellow-300">{TEAMS[winner!].emoji} {TEAMS[winner!].name} Thắng!</motion.h2>
      <div className="flex gap-3 mt-4">
        <button onClick={reset} className="flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 rounded-2xl font-black text-slate-900">
          <RotateCcw className="w-5 h-5" /> Chơi lại
        </button>
        <button onClick={onBack} className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-black">Thoát</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Rope visualization */}
      <div className="shrink-0 px-4 pt-3 pb-2 bg-slate-900 border-b border-white/10">
        <div className="flex items-center justify-between mb-1">
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold hover:bg-white/20">
            <ArrowLeft className="w-3.5 h-3.5" /> Thoát
          </button>
          <span className={`text-xl font-black tabular-nums ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>{timeLeft}s</span>
          <span className="text-xs text-slate-400">Câu {qIdx % shuffled.length + 1}/{shuffled.length}</span>
        </div>
        {/* Rope */}
        <div className="relative h-48 md:h-56 bg-amber-900/20 rounded-[3rem] border border-amber-700/30 overflow-hidden">
          {/* Left team color */}
          <div className="absolute left-0 top-0 h-full bg-linear-to-r from-red-600/60 to-transparent" style={{ width: `${100 - ropePos}%` }} />
          {/* Right team color */}
          <div className="absolute right-0 top-0 h-full bg-linear-to-l from-blue-600/60 to-transparent" style={{ width: `${ropePos}%` }} />
          {/* Rope texture and Indicator knot moving in sync */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{ backgroundPosition: `${ropePos}% center` }}
            transition={{ type: 'spring', bounce: 0.4 }}
            style={{ 
              backgroundImage: 'url(https://img.upanhnhanh.com/3f6342ab8dbe31da1c1f2d4ec659420a)', 
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat', 
            }}
          >
            {/* Indicator knot */}
            <motion.div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-400 border-4 border-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.6)] z-10"
              animate={{ left: `calc(${ropePos}% - 16px)` }} transition={{ type: 'spring', bounce: 0.4 }} />
          </motion.div>
          {/* Danger zones */}
          <div className="absolute left-0 top-0 h-full w-[10%] bg-red-500/20 border-r border-red-500/30" />
          <div className="absolute right-0 top-0 h-full w-[10%] bg-blue-500/20 border-l border-blue-500/30" />
        </div>
        <div className="flex justify-between text-xs mt-1 text-slate-500">
          <span>🔴 {Math.round(100 - ropePos)}%</span>
          <span>Kéo dây chiến thắng</span>
          <span>{Math.round(ropePos)}% 🔵</span>
        </div>
      </div>

      {/* Question */}
      <div className="px-4 py-1.5 bg-slate-900/50 border-b border-white/10 shrink-0">
        <AnimatePresence mode="wait">
          <motion.p key={qIdx} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm md:text-base font-bold text-white leading-snug">{q?.text}</motion.p>
        </AnimatePresence>
      </div>

      {/* Split panels */}
      <div className="flex-1 flex overflow-hidden">
        {TEAMS.map((team, ti) => {
          const myAns = teamAnswers[ti];
          const answered = myAns !== null;
          const isCorrect = myAns === q?.answer;
          const bothAnswered = teamAnswers.every(a => a !== null);
          return (
            <div key={ti} className={`flex-1 flex flex-col ${team.bg} border-${ti === 0 ? 'r' : 'l'} border-white/10`}>
              <div className={`px-3 pt-2 pb-1.5 border-b ${team.border} flex items-center justify-between`}>
                <span className="font-black text-sm">{team.emoji} {team.name}</span>
                {answered ? (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${myAns === -1 ? 'bg-slate-500/30 text-slate-300' : isCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                    {myAns === -1 ? '⏱ Hết giờ' : isCorrect ? '✅ Kéo được!' : '❌ Không kéo được'}
                  </span>
                ) : <span className="text-xs text-slate-400 animate-pulse">Đang chờ...</span>}
              </div>
              <div className="flex-1 p-2 grid grid-cols-2 gap-2 content-center">
                {q?.options.map((opt, i) => {
                  let cls = `${team.btn} cursor-pointer border`;
                  if (bothAnswered || answered) {
                    if (i === q.answer) cls = 'bg-green-500/30 border-green-400 cursor-default';
                    else if (i === myAns) cls = 'bg-red-500/30 border-red-400 cursor-default';
                    else cls = 'bg-white/5 border-white/10 opacity-30 cursor-default';
                  }
                  return (
                    <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(ti, i)}
                      disabled={answered || bothAnswered}
                      className={`p-2.5 rounded-xl transition-all text-left ${cls}`}>
                      <div className={`text-xs font-black mb-0.5 ${ti === 0 ? 'text-red-400' : 'text-blue-400'}`}>{OPTS[i]}</div>
                      <div className="text-xs font-medium leading-tight">{opt}</div>
                    </motion.button>
                  );
                })}
              </div>
              {answered && !bothAnswered && (
                <div className="mx-2 mb-2 py-2 px-3 rounded-xl text-center text-xs font-bold bg-black/30 text-slate-300">
                  Chờ đội kia... <span className="animate-pulse">⏳</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
