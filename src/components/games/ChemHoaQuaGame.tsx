import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Heart } from 'lucide-react';
import { Question } from './GameHub';
import { motion, AnimatePresence } from 'motion/react';

const FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍍', '🥝', '🍈', '🍒'];
const MAX_LIVES = 3;
const Q_TIMER = 8;

interface Fruit { id: number; emoji: string; label: string; optIndex: number; x: number; y: number; slashed: boolean; wrong: boolean; }

export function ChemHoaQuaGame({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'play' | 'result'>('play');
  const [timeLeft, setTimeLeft] = useState(Q_TIMER);
  const [showEffect, setShowEffect] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fruitIdRef = useRef(0);
  const shuffled = useRef([...questions].sort(() => Math.random() - 0.5)).current;
  const q = shuffled[qIdx % (shuffled.length || 1)];

  const spawnFruits = useCallback((question: typeof q) => {
    if (!question) return;
    const positions = question.options.map((opt, i) => ({
      id: fruitIdRef.current++,
      emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
      label: opt,
      optIndex: i,
      x: 10 + (i * 22) + Math.random() * 8,
      y: 20 + Math.random() * 45,
      slashed: false,
      wrong: false,
    }));
    setFruits(positions.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (phase !== 'play') return;
    spawnFruits(q);
    setTimeLeft(Q_TIMER);
    timerRef.current = setInterval(() => setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(timerRef.current!);
        // Time out → lose a life
        setLives(l => {
          const nl = l - 1;
          if (nl <= 0) { setTimeout(() => setPhase('result'), 800); }
          return nl;
        });
        setShowEffect('wrong');
        setTimeout(() => { setShowEffect(null); nextQ(); }, 1000);
        return 0;
      }
      return t - 1;
    }), 1000);
    return () => clearInterval(timerRef.current!);
  }, [qIdx, phase]);

  const nextQ = useCallback(() => {
    setQIdx(i => i + 1);
    setFruits([]);
  }, []);

  const handleSlash = (fruit: Fruit) => {
    if (fruit.slashed || fruit.wrong) return;
    const isCorrect = fruit.optIndex === q?.answer;
    clearInterval(timerRef.current!);
    if (isCorrect) {
      setFruits(prev => prev.map(f => f.id === fruit.id ? { ...f, slashed: true } : f));
      setScore(s => s + 1);
      setShowEffect('correct');
      setTimeout(() => { setShowEffect(null); nextQ(); }, 900);
    } else {
      setFruits(prev => prev.map(f => f.id === fruit.id ? { ...f, wrong: true } : f));
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => setPhase('result'), 800);
        return nl;
      });
      setShowEffect('wrong');
      setTimeout(() => { setShowEffect(null); if (lives > 1) nextQ(); }, 900);
    }
  };

  if (questions.length === 0) return (
    <div className="h-screen bg-green-950 flex items-center justify-center text-white text-center p-8">
      <div><p className="text-5xl mb-4">📭</p><p className="text-xl font-bold mb-4">Chưa có câu hỏi!</p>
        <button onClick={onBack} className="px-6 py-3 bg-green-600 rounded-xl font-bold">Quay lại</button></div>
    </div>
  );

  if (phase === 'result') return (
    <div className="h-screen bg-linear-to-br from-green-950 to-emerald-950 flex flex-col items-center justify-center text-white gap-6">
      <div className="text-7xl">{lives > 0 ? '🏆' : '💔'}</div>
      <h2 className="text-4xl font-black text-yellow-300">{lives > 0 ? 'Xuất sắc!' : 'Trò chơi kết thúc!'}</h2>
      <p className="text-2xl font-bold text-slate-300">Điểm: <strong className="text-green-400">{score}</strong> / {shuffled.length}</p>
      <div className="flex gap-3">
        <button onClick={() => { setQIdx(0); setLives(MAX_LIVES); setScore(0); setPhase('play'); setFruits([]); }}
          className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-400 rounded-2xl font-black text-slate-900">
          <RotateCcw className="w-5 h-5" /> Chơi lại
        </button>
        <button onClick={onBack} className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-black">Thoát</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-linear-to-b from-sky-900 via-green-950 to-emerald-950 text-white flex flex-col overflow-hidden select-none">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold hover:bg-white/20">
          <ArrowLeft className="w-3.5 h-3.5" /> Thoát
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-400 fill-red-400' : 'text-slate-600'}`} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-yellow-300 font-black text-lg">⭐{score}</span>
          <span className={`font-black text-lg tabular-nums ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
        </div>
      </div>

      {/* Question */}
      <div className="shrink-0 px-4 py-3 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
            <p className="text-sm font-bold mb-1 text-green-300">🍎 Chém quả đúng đáp án!</p>
            <p className="text-base font-bold text-white leading-relaxed">{q?.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Game area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background deco */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-green-900/40 to-transparent" />

        {/* Fruits */}
        <AnimatePresence>
          {fruits.map(fruit => (
            <motion.div
              key={fruit.id}
              initial={{ scale: 0, rotate: -20 }}
              animate={fruit.slashed ? { scale: 0, rotate: 360, opacity: 0 } : fruit.wrong ? { x: [-5, 5, -5, 0], opacity: [1, 1, 1, 0.3] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleSlash(fruit)}
              className="absolute cursor-pointer select-none"
              style={{ left: `${fruit.x}%`, top: `${fruit.y}%` }}
            >
              <div className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all
                ${fruit.slashed ? 'border-green-400 bg-green-500/30' : fruit.wrong ? 'border-red-400 bg-red-500/30' : 'border-white/30 bg-black/20 hover:border-yellow-400 hover:bg-yellow-500/10 hover:scale-110 active:scale-95'}`}>
                <span className="text-5xl leading-none">{fruit.emoji}</span>
                <span className="text-xs font-bold text-white bg-black/40 px-2 py-0.5 rounded-full max-w-[120px] text-center leading-tight line-clamp-2">{fruit.label}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Slash effect */}
        <AnimatePresence>
          {showEffect && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className={`text-6xl font-black ${showEffect === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {showEffect === 'correct' ? '✅ Đúng!' : '❌ Sai!'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
