import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Zap } from 'lucide-react';
import { Question } from './GameHub';
import { motion, AnimatePresence } from 'motion/react';
import { soundClick, soundCorrect, soundWrong, soundEnd } from '../../hooks/useGameSounds';

const OPTS = ['A', 'B', 'C', 'D'];
const WIN_SCORE = 10;
const BUZZ_TIMER = 12;

type Phase = 'idle' | 'buzzed' | 'reveal' | 'result';

const TEAMS = [
  { name: 'Đội Đỏ', emoji: '🔴', color: 'red', grad: 'from-red-600 to-rose-500', bg: 'from-red-950 to-slate-950', buzz: 'bg-red-600 hover:bg-red-500 active:scale-95 shadow-[0_0_40px_rgba(239,68,68,0.5)]' },
  { name: 'Đội Xanh', emoji: '🔵', color: 'blue', grad: 'from-blue-600 to-indigo-500', bg: 'from-blue-950 to-slate-950', buzz: 'bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-[0_0_40px_rgba(59,130,246,0.5)]' },
];

export function GameDoiKhangGame({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [scores, setScores] = useState([0, 0]);
  const [qIdx, setQIdx] = useState(0);
  const [buzzed, setBuzzed] = useState<number | null>(null); // which team buzzed
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(BUZZ_TIMER);
  const [missed, setMissed] = useState(false); // wrong answer, other team chance
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shuffled = useRef([...questions].sort(() => Math.random() - 0.5)).current;
  const q = shuffled[qIdx % (shuffled.length || 1)];
  const [winner, setWinner] = useState<number | null>(null);

  const nextQ = useCallback(() => {
    setBuzzed(null); setSelected(null); setMissed(false); setPhase('idle'); setTimeLeft(BUZZ_TIMER);
    setQIdx(i => i + 1);
  }, []);

  // Timer when buzzed
  useEffect(() => {
    if (phase !== 'buzzed') return;
    timerRef.current = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(timerRef.current!); nextQ(); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, nextQ]);

  const handleBuzz = (ti: number) => {
    if (phase !== 'idle') return;
    soundClick();
    setBuzzed(ti); setPhase('buzzed'); setTimeLeft(BUZZ_TIMER);
  };

  const handleAnswer = (i: number) => {
    if (phase !== 'buzzed' || selected !== null) return;
    clearInterval(timerRef.current!);
    setSelected(i);
    const isCorrect = i === q?.answer;
    setPhase('reveal');
    if (isCorrect) {
      soundCorrect();
      const ns = [...scores]; ns[buzzed!] += 1; setScores(ns);
      if (ns[buzzed!] >= WIN_SCORE) { soundEnd(); setTimeout(() => { setWinner(buzzed!); }, 800); return; }
      setTimeout(nextQ, 1500);
    } else {
      soundWrong();
      setMissed(true);
      setTimeout(nextQ, 2000);
    }
  };

  if (questions.length === 0) return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex items-center justify-center text-white text-center p-8">
      <div><p className="text-5xl mb-4">📭</p><p className="text-xl font-bold mb-4">Chưa có câu hỏi!</p>
        <button onClick={onBack} className="px-6 py-3 bg-purple-600 rounded-xl font-bold">Quay lại</button></div>
    </div>
  );

  if (winner !== null) return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center text-white gap-6 bg-linear-to-br ${TEAMS[winner].bg}`}>
      <div className="text-8xl">🏆</div>
      <motion.h2 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
        className="text-5xl font-black text-yellow-300">{TEAMS[winner].emoji} {TEAMS[winner].name} Thắng!</motion.h2>
      <p className="text-2xl font-bold text-slate-300">{scores[0]} – {scores[1]}</p>
      <div className="flex gap-3 mt-4">
        <button onClick={() => { setScores([0,0]); setQIdx(0); setBuzzed(null); setSelected(null); setPhase('idle'); setWinner(null); }}
          className="flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 rounded-2xl font-black text-slate-900">
          <RotateCcw className="w-5 h-5" /> Chơi lại
        </button>
        <button onClick={onBack} className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-black">Thoát</button>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 bg-slate-900 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold hover:bg-white/20">
            <ArrowLeft className="w-3.5 h-3.5" /> Thoát
          </button>
          <h1 className="font-black text-pink-300 flex items-center gap-2"><Zap className="w-5 h-5" /> Game Đối Kháng</h1>
          <span className="text-xs text-slate-400">Câu {qIdx % shuffled.length + 1}/{shuffled.length}</span>
        </div>
        {/* Score */}
        <div className="flex items-center gap-4 justify-center">
          {TEAMS.map((t, ti) => (
            <div key={ti} className="flex items-center gap-2">
              <span className="text-sm font-bold">{t.emoji} {t.name}</span>
              <span className="text-3xl font-black text-yellow-300 tabular-nums">{scores[ti]}</span>
            </div>
          ))}
          <span className="text-slate-600 font-black">vs</span>
        </div>
        <div className="text-center text-xs text-slate-500 mt-1">Đội nào đạt {WIN_SCORE} điểm trước sẽ thắng</div>
      </div>

      {/* Question zone */}
      <div className="shrink-0 px-6 py-4 bg-slate-900/60 border-b border-white/10">
        <AnimatePresence mode="wait">
          <motion.p key={qIdx} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center text-base md:text-lg font-bold text-white leading-relaxed min-h-12 flex items-center justify-center">
            {q?.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Buzzed & Reveal: show options and feedback */}
        {(phase === 'buzzed' || phase === 'reveal') && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4 gap-4">
            <div className={`text-sm font-bold px-4 py-2 rounded-full bg-linear-to-r ${TEAMS[buzzed!].grad} flex items-center gap-2`}>
              <Zap className="w-4 h-4" /> {TEAMS[buzzed!].emoji} {TEAMS[buzzed!].name} {phase === 'reveal' ? 'đã trả lời!' : `đang trả lời! (${timeLeft}s)`}
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
              {q?.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.answer;
                let cls = `bg-white/10 border-white/20 hover:bg-white/20 cursor-pointer`;
                if (phase === 'reveal') {
                  if (isCorrect) cls = 'bg-green-500/30 border-green-400 cursor-default';
                  else if (isSelected) cls = 'bg-red-500/30 border-red-400 cursor-default';
                  else cls = 'bg-white/5 border-white/10 opacity-30 cursor-default';
                }
                return (
                  <motion.button key={i} whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(i)} disabled={selected !== null}
                    className={`p-3 rounded-xl border text-left transition-all ${cls}`}>
                    <span className="font-black text-sm mr-2 text-pink-300">{OPTS[i]}.</span>
                    <span className="text-sm">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
            {selected !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`py-2 px-6 rounded-xl text-center font-bold text-sm ${selected === q?.answer ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {selected === q?.answer ? `⚡ Đúng! ${TEAMS[buzzed!].name} +1 điểm!` : `❌ Sai! Mất lượt.`}
              </motion.div>
            )}
          </div>
        )}

        {/* Idle: show buzz buttons */}
        {phase === 'idle' && (
          <div className="flex-1 flex">
            {TEAMS.map((team, ti) => (
              <motion.button
                key={ti} whileTap={{ scale: 0.97 }}
                onClick={() => handleBuzz(ti)}
                className={`flex-1 flex flex-col items-center justify-center gap-4 ${team.buzz} transition-all`}
              >
                <span className="text-6xl">{team.emoji}</span>
                <span className="font-black text-2xl">{team.name}</span>
                <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-2xl">
                  <Zap className="w-6 h-6 fill-current" />
                  <span className="font-black text-lg">BUZZ!</span>
                </div>
                <span className="text-sm opacity-70">Nhấn để trả lời trước</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
