/**
 * Đua Vịt Gọi Tên – Cuộc Đua Kịch Tính
 * Consolidated single-file component adapted for the main app.
 */

import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RefreshCcw, Settings2, Trophy } from 'lucide-react';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────
type RaceStatus = 'idle' | 'racing' | 'finished';

interface RaceCtxValue {
  numDucks: number;
  duration: number;
  status: RaceStatus;
  winnerIndex: number | null;
}

const RaceCtx = createContext<RaceCtxValue>({
  numDucks: 15, duration: 30, status: 'idle', winnerIndex: null,
});
const useRace = () => useContext(RaceCtx);

// ─── Path Generator ───────────────────────────────────────────────────────────
const generatePaths = (numDucks: number, winnerIndex: number | null): string[][] => {
  return Array.from({ length: numDucks }, (_, i) => {
    const isWinner = i === winnerIndex;
    const pts = [0];
    for (let s = 1; s <= 8; s++) {
      const base = s * 10;
      const jitter = (Math.random() - 0.5) * 16;
      pts.push(Math.min(Math.max(0, base + jitter), 85));
    }
    pts.push(isWinner ? 100 : 80 + Math.random() * 12);
    return pts.map(v => `${v}%`);
  });
};

// ─── Duck Component ───────────────────────────────────────────────────────────
function Duck({ id, path, trackIndex }: { id: number; path: string[]; trackIndex: number }) {
  const { status, duration, winnerIndex, numDucks } = useRace();
  const isWinner = winnerIndex === trackIndex;
  const displayId = id.toString().padStart(2, '0');
  const topPct = numDucks > 1 ? (trackIndex / (numDucks - 1)) * 100 : 50;

  // Scale duck size so all ducks fit within the track regardless of count
  const duckScale = Math.min(1, Math.max(0.12, 7 / numDucks));
  const duckPx = Math.round(360 * duckScale);       // image container size
  const duckNeg = Math.round(150 * duckScale);       // negative margin to center
  const containerW = Math.max(50, Math.round(250 * duckScale)); // motion container width
  const fontSize = Math.max(10, Math.round(48 * duckScale));    // number badge
  const badgeOffset = Math.round(3 * duckScale);                // -translate-y

  return (
    <div
      className={clsx('absolute left-0 w-full h-10 flex items-center pointer-events-none')}
      style={{
        zIndex: isWinner && status === 'finished' ? 50 : trackIndex,
        top: numDucks > 1 ? `calc(${topPct}% - ${(topPct / 100) * 40}px)` : 'calc(50% - 20px)',
      }}
    >
      <div className="absolute w-full h-full" style={{ width: `calc(100% - ${containerW}px)` }}>
        <motion.div
          className="absolute top-0 h-full flex items-center justify-center z-10"
          style={{ width: `${containerW}px` }}
          initial={{ left: '0%' }}
          animate={
            status === 'racing'
              ? { left: path }
              : status === 'idle'
              ? { left: '0%' }
              : { left: path[path.length - 1] }
          }
          transition={{
            duration: status === 'racing' ? duration : 0.5,
            ease: 'easeInOut',
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
          }}
        >
          {/* Water trail */}
          {status === 'racing' && (
            <motion.div
              className="absolute right-8 top-1/2 -translate-y-1/2 h-2 rounded-full bg-cyan-400/30 blur-[3px]"
              style={{ right: `${containerW * 0.3}px` }}
              animate={{ width: [10, 60, 15], opacity: [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.4 }}
            />
          )}

          {/* Duck group */}
          <motion.div
            animate={
              status !== 'idle'
                ? { y: [0, -6, 4, -4, 6, 0], rotate: [0, -4, 4, -2, 2, 0] }
                : { y: 0, rotate: 0 }
            }
            transition={{ repeat: Infinity, duration: 1.5 + Math.random() * 1.5, ease: 'easeInOut' }}
            className="relative flex items-center justify-center drop-shadow-xl z-10"
            style={{ width: `${duckPx}px`, height: `${duckPx}px`, marginTop: `-${duckNeg}px`, marginBottom: `-${duckNeg}px` }}
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'absolute inset-0 w-full h-full object-contain transition-all duration-1000',
                isWinner && status === 'finished'
                  ? 'drop-shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-110 z-20'
                  : 'drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]',
              )}
            >
              {/* Body */}
              <ellipse cx="50" cy="62" rx="28" ry="22" fill="#f5c842" />
              {/* Head */}
              <circle cx="74" cy="44" r="16" fill="#f5c842" />
              {/* Eye */}
              <circle cx="81" cy="40" r="3" fill="#1a1a1a" />
              <circle cx="82" cy="39" r="1" fill="white" />
              {/* Beak */}
              <ellipse cx="93" cy="46" rx="8" ry="4" fill="#e07b20" />
              {/* Wing */}
              <ellipse cx="42" cy="60" rx="14" ry="10" fill="#d4a820" transform="rotate(-10 42 60)" />
              {/* Water ripple / tail */}
              <ellipse cx="27" cy="70" rx="10" ry="5" fill="#d4a820" />
              {/* Feet */}
              <ellipse cx="44" cy="82" rx="9" ry="4" fill="#e07b20" />
              <ellipse cx="58" cy="84" rx="9" ry="4" fill="#e07b20" />
            </svg>
            {/* Number badge */}
            <div
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
              style={{ transform: `translateY(-${badgeOffset}px)` }}
            >
              <span
                className="font-sans font-black text-blue-900 drop-shadow-[0_2px_6px_rgba(255,255,255,0.9)] leading-none"
                style={{ fontSize: `${fontSize}px` }}
              >
                {displayId}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Race Track Component ─────────────────────────────────────────────────────
function RaceTrack({ onFinish }: { onFinish: () => void }) {
  const { numDucks, status, duration, winnerIndex } = useRace();
  const [paths, setPaths] = useState<string[][]>([]);

  useEffect(() => {
    if (status === 'racing') {
      setPaths(generatePaths(numDucks, winnerIndex));
      const t = setTimeout(onFinish, duration * 1000);
      return () => clearTimeout(t);
    } else if (status === 'idle') {
      setPaths([]);
    }
  }, [status, numDucks, winnerIndex, duration, onFinish]);

  // Confetti on finish
  useEffect(() => {
    if (status !== 'finished' || winnerIndex === null) return;
    const end = Date.now() + 5000;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const rng = (min: number, max: number) => Math.random() * (max - min) + min;
    const iv = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) { clearInterval(iv); return; }
      const count = 50 * (timeLeft / 5000);
      confetti({ ...defaults, particleCount: count, origin: { x: rng(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#14b8a6', '#0f766e', '#f59e0b', '#fcd34d'] });
      confetti({ ...defaults, particleCount: count, origin: { x: rng(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#14b8a6', '#0f766e', '#f59e0b', '#fcd34d'] });
    }, 250);
    return () => clearInterval(iv);
  }, [status, winnerIndex]);

  const winnerNumber = winnerIndex !== null ? (winnerIndex + 1).toString().padStart(2, '0') : '';

  return (
    <div className="flex-1 w-full relative overflow-hidden bg-sky-900 border-4 border-slate-200 rounded-4xl m-4 shadow-inner">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-sky-800 via-blue-700 to-teal-800 opacity-80 pointer-events-none z-0" />

      {/* Water ripples */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden flex flex-col justify-around">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[200%] h-4 rounded-[100%] border-t border-cyan-200"
            initial={{ x: Math.random() * -100 }}
            animate={{ x: [0, -100, 0] }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
            style={{ opacity: 0.3 + Math.random() * 0.7, transform: `scaleY(${0.5 + Math.random()})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-cyan-400 to-transparent pointer-events-none z-0" />

      {/* Start line */}
      <div className="absolute top-0 bottom-0 left-14 w-2 border-l-2 border-dashed border-teal-400/50 z-0" />

      {/* Finish line */}
      <div className="absolute top-0 bottom-0 right-14 w-8 flex flex-col z-1 opacity-45">
        <div
          className="h-full w-full bg-repeat-y bg-contain shadow-[0_0_20px_rgba(20,184,166,0.3)] border-l-2 border-teal-350"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==")`,
          }}
        />
      </div>

      {/* Ducks - overflow-hidden to keep ducks inside track bounds */}
      <div className="absolute inset-y-2 inset-x-0 z-10 pointer-events-none overflow-hidden">
        {Array.from({ length: numDucks }).map((_, i) => (
          <Duck key={i} id={i + 1} trackIndex={i} path={paths[i] || []} />
        ))}
      </div>

      {/* Winner overlay */}
      {status === 'finished' && winnerIndex !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-slate-900/85 backdrop-blur-md p-10 rounded-2xl border-2 border-yellow-500/50 shadow-[0_0_80px_rgba(234,179,8,0.3)] text-center">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-yellow-400 font-sans text-3xl mb-4 italic drop-shadow"
            >
              Chiến Thắng Thuộc Về Khúc Sông Này!
            </motion.h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.6, delay: 0.4 }}
              className="text-8xl font-sans font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            >
              SỐ {winnerNumber}
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Controls Component ───────────────────────────────────────────────────────
function Controls({
  numDucks, setNumDucks, duration, setDuration,
  status, winnerNumber, onStart, onReset, onBack,
  onShowRules,
}: {
  numDucks: number; setNumDucks: (n: number) => void;
  duration: number; setDuration: (n: number) => void;
  status: RaceStatus; winnerNumber: number | null;
  onStart: () => void; onReset: () => void; onBack: () => void;
  onShowRules: () => void;
}) {
  const isRacing = status === 'racing';
  const isFinished = status === 'finished';

  return (
    <div className="w-full bg-white/85 backdrop-blur-md border-b border-slate-200 p-4 md:p-5 shadow-xs relative z-20 text-slate-800">
      <div className="absolute inset-0 bg-linear-to-b from-slate-50/50 to-white/50 pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto flex flex-wrap items-center gap-4 justify-between">
        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-slate-700 hover:text-cyan-600 border border-slate-200/50 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-150 shadow-inner">
            <Trophy className={clsx('w-7 h-7 text-yellow-500', isFinished && 'animate-bounce')} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-sans font-black text-slate-800 tracking-wide uppercase drop-shadow-xs">
                Cuộc Đua Kịch Tính
              </h1>
              <button 
                onClick={onShowRules} 
                className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-teal-100 hover:bg-teal-200 text-teal-750 border border-teal-250 rounded-md cursor-pointer transition-all"
              >
                📜 Luật chơi
              </button>
            </div>
            <p className="text-teal-600 text-xs italic font-sans font-bold">Đua Vịt Gọi Tên</p>
          </div>
        </div>

        {/* Config */}
        <div className="flex flex-1 flex-wrap items-center justify-center gap-6 min-w-0">
          {/* Duck slider */}
          <div className="flex flex-col gap-1.5 w-full max-w-xs">
            <div className="flex justify-between items-center text-slate-750">
              <label className="text-sm font-black flex items-center gap-1.5 font-heading">
                <Settings2 className="w-4 h-4 text-cyan-600" /> Số lượng vịt
              </label>
              <span className="bg-teal-50 px-2 py-0.5 rounded text-teal-700 font-black border border-teal-200 text-sm shadow-xs">
                {numDucks}
              </span>
            </div>
            <input
              type="range" min="1" max="60" value={numDucks}
              disabled={isRacing}
              onChange={e => setNumDucks(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 disabled:opacity-50"
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-black text-slate-750 font-heading">Thời gian đua</label>
            <div className="flex gap-2">
              {[5, 10, 15, 30].map(t => (
                <button
                  key={t}
                  disabled={isRacing}
                  onClick={() => setDuration(t)}
                  className={clsx(
                    'flex-1 py-1.5 px-2.5 rounded-md font-sans text-sm font-bold transition-all border disabled:opacity-50',
                    duration === t
                      ? 'bg-teal-600 text-white border-teal-400 shadow-xs'
                      : 'bg-slate-100 text-slate-650 border-slate-200 hover:bg-slate-200',
                  )}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start / Reset */}
        <button
          onClick={isFinished ? onReset : onStart}
          disabled={isRacing}
          className={clsx(
            'py-3 px-6 rounded-lg font-sans font-black text-base flex items-center justify-center gap-2 transition-all shadow-md whitespace-nowrap active:scale-95',
            isRacing
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              : isFinished
              ? 'bg-teal-600 hover:bg-teal-500 text-white border border-teal-400'
              : 'bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border border-teal-300/50',
          )}
        >
          {isFinished
            ? <><RefreshCcw className="w-4 h-4" /> Chuẩn bị lại</>
            : <><Play className="w-4 h-4 fill-current animate-pulse" /> Bắt đầu</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function DuaVitGoiTenGame({ onBack }: { onBack: () => void }) {
  const [numDucks, setNumDucks] = useState(15);
  const [duration, setDuration] = useState(30);
  const [status, setStatus] = useState<RaceStatus>('idle');
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [showRules, setShowRules] = useState(false);

  const handleStart = () => {
    setWinnerIndex(Math.floor(Math.random() * numDucks));
    setStatus('racing');
  };

  const handleFinish = () => setStatus('finished');

  const handleReset = () => {
    setStatus('idle');
    setWinnerIndex(null);
  };

  return (
    <RaceCtx.Provider value={{ numDucks, duration, status, winnerIndex }}>
      <div className="w-screen h-screen flex flex-col font-sans overflow-hidden bg-khtn8-pastel text-slate-800 animate-fadeIn">
        <Controls
          numDucks={numDucks} setNumDucks={setNumDucks}
          duration={duration} setDuration={setDuration}
          status={status}
          winnerNumber={winnerIndex !== null ? winnerIndex + 1 : null}
          onStart={handleStart}
          onReset={handleReset}
          onBack={onBack}
          onShowRules={() => setShowRules(true)}
        />
        <RaceTrack onFinish={handleFinish} />
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full relative text-left text-white"
            >
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                📜 Luật chơi Đua vịt gọi tên
              </h3>
              
              <ul className="space-y-3 text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold shrink-0 flex items-center justify-center text-[10px]">1</span>
                  <span>Điều chỉnh số lượng vịt tham gia cuộc đua bằng thanh trượt (từ 1 đến tối đa 60 vịt).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold shrink-0 flex items-center justify-center text-[10px]">2</span>
                  <span>Lựa chọn thời gian hoàn thành cuộc đua (5 giây, 10 giây, 15 giây hoặc 30 giây).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold shrink-0 flex items-center justify-center text-[10px]">3</span>
                  <span>Nhấn nút <strong>"Bắt đầu"</strong> để cuộc đua diễn ra. Các chú vịt sẽ bơi ngẫu nhiên với vận tốc biến động.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold shrink-0 flex items-center justify-center text-[10px]">4</span>
                  <span>Chú vịt cán đích đầu tiên sẽ giành chiến thắng, giáo viên có thể dùng số hiệu này để gọi tên học sinh trả lời bài!</span>
                </li>
              </ul>

              <button
                onClick={() => setShowRules(false)}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl transition-all cursor-pointer text-center text-sm"
              >
                Đồng ý
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </RaceCtx.Provider>
  );
}
