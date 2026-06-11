import React, { useState, useRef } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Question } from './GameHub';
import { motion, AnimatePresence } from 'motion/react';
import { soundClick, soundCorrect, soundWrong, soundStart, soundEnd } from '../../hooks/useGameSounds';

const OPTS = ['A', 'B', 'C', 'D'];
const BOARD_SIZE = 25;
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const PLAYER_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
const PLAYER_EMOJIS = ['🔴', '🔵', '🟢', '🟡'];
const SPECIAL: Record<number, { type: 'forward' | 'back'; steps: number; label: string }> = {
  5:  { type: 'forward', steps: 3, label: '🚀 +3' },
  9:  { type: 'back',    steps: 2, label: '💀 -2' },
  13: { type: 'forward', steps: 4, label: '⭐ +4' },
  17: { type: 'back',    steps: 3, label: '🌀 -3' },
  20: { type: 'forward', steps: 2, label: '🎉 +2' },
};

export function GameTheoLuotGame({ questions, numPlayers = 2, onBack }: {
  questions: Question[];
  numPlayers?: number;
  onBack: () => void;
}) {
  const [positions, setPositions] = useState(Array(numPlayers).fill(0));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceVal, setDiceVal] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [phase, setPhase] = useState<'roll' | 'question' | 'result'>('roll');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [numP, setNumP] = useState(numPlayers);
  const [setupDone, setSetupDone] = useState(false);
  const shuffled = useRef([...questions].sort(() => Math.random() - 0.5)).current;
  const q = shuffled[qIdx % (shuffled.length || 1)];

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    let count = 0;
    const iv = setInterval(() => {
      setDiceVal(Math.ceil(Math.random() * 6));
      count++;
      if (count > 10) {
        clearInterval(iv);
        const final = Math.ceil(Math.random() * 6);
        setDiceVal(final);
        setRolling(false);
        // Move player
        const newPos = Math.min(BOARD_SIZE, positions[currentPlayer] + final);
        const newPositions = [...positions];
        newPositions[currentPlayer] = newPos;
        // Check special
        const special = SPECIAL[newPos];
        if (special) {
          setTimeout(() => {
            newPositions[currentPlayer] = Math.max(0, Math.min(BOARD_SIZE, newPos + (special.type === 'forward' ? special.steps : -special.steps)));
            setPositions([...newPositions]);
            if (newPositions[currentPlayer] >= BOARD_SIZE) { setWinner(currentPlayer); setPhase('result'); return; }
            setCurrentPlayer(p => (p + 1) % numP);
          }, 800);
          setPositions([...newPositions]);
        } else {
          setPositions([...newPositions]);
          if (newPos >= BOARD_SIZE) { soundEnd(); setWinner(currentPlayer); setPhase('result'); return; }
          // Trigger question
          setPhase('question');
          setSelected(null);
          setQIdx(i => i + 1);
        }
      }
    }, 80);
  };

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    soundClick();
    setSelected(i);
    const isCorrect = i === q?.answer;
    if (isCorrect) { soundCorrect(); } else {
      soundWrong();
      const newPositions = [...positions];
      newPositions[currentPlayer] = Math.max(0, newPositions[currentPlayer] - 1);
      setTimeout(() => setPositions([...newPositions]), 800);
    }
    setTimeout(() => {
      setSelected(null); setPhase('roll');
      setCurrentPlayer(p => (p + 1) % numP);
    }, 1500);
  };

  // Board layout: snake pattern, rows of 5
  const boardSquares = Array.from({ length: BOARD_SIZE + 1 }, (_, i) => {
    const row = Math.floor(i / 5);
    const col = row % 2 === 0 ? i % 5 : 4 - (i % 5);
    return { num: i, row: Math.floor(BOARD_SIZE / 5) - row, col };
  });

  if (!setupDone) return (
    <div className="h-screen bg-linear-to-br from-amber-950 to-yellow-950 text-white flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-7xl">🎲</div>
      <h1 className="text-3xl font-black text-yellow-300">Game Theo Lượt</h1>
      <div className="bg-white/10 rounded-2xl p-6 w-full max-w-xs space-y-4">
        <div>
          <label className="text-sm font-bold text-slate-300 block mb-2">Số người chơi</label>
          <div className="flex gap-2">
            {[2,3,4].map(n => (
              <button key={n} onClick={() => setNumP(n)}
                className={`flex-1 py-3 rounded-xl font-black text-xl transition-all ${numP === n ? 'bg-yellow-400 text-slate-900' : 'bg-white/10 hover:bg-white/20'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-slate-400 space-y-1">
          <p>🎲 Tung xúc xắc để di chuyển</p>
          <p>❓ Trả lời đúng → giữ vị trí, sai → lùi 1 ô</p>
          <p>🚀🌀 Ô đặc biệt: tiến/lùi thêm</p>
          <p>🏁 Đến ô 25 trước thắng!</p>
        </div>
        <button onClick={() => { soundStart(); setSetupDone(true); setPositions(Array(numP).fill(0)); }}
          disabled={questions.length === 0}
          className="w-full py-3 bg-linear-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 rounded-2xl font-black text-xl text-slate-900 disabled:opacity-40">
          Bắt đầu!
        </button>
        {questions.length === 0 && <p className="text-xs text-red-400 text-center">Cần có câu hỏi trước khi chơi</p>}
      </div>
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>
    </div>
  );

  if (winner !== null) return (
    <div className="h-screen bg-linear-to-br from-amber-950 to-yellow-950 flex flex-col items-center justify-center text-white gap-6">
      <div className="text-8xl">🏆</div>
      <motion.h2 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
        className="text-4xl font-black text-yellow-300">{PLAYER_EMOJIS[winner]} Người chơi {winner + 1} Thắng!</motion.h2>
      <div className="flex gap-3">
        <button onClick={() => { setPositions(Array(numP).fill(0)); setCurrentPlayer(0); setDiceVal(null); setPhase('roll'); setWinner(null); setQIdx(0); }}
          className="flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 rounded-2xl font-black text-slate-900">
          <RotateCcw className="w-5 h-5" /> Chơi lại
        </button>
        <button onClick={onBack} className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-black">Thoát</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-linear-to-br from-amber-950 via-yellow-950 to-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-black/20 border-b border-white/10">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold hover:bg-white/20">
          <ArrowLeft className="w-3.5 h-3.5" /> Thoát
        </button>
        <h1 className="font-black text-yellow-300">🎲 Game Theo Lượt</h1>
        <div className="flex gap-2">
          {Array.from({ length: numP }).map((_, i) => (
            <div key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${i === currentPlayer && phase === 'roll' ? 'bg-yellow-400/20 border border-yellow-400' : 'bg-white/10'}`}>
              {PLAYER_EMOJIS[i]} {positions[i]}/25
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-3 overflow-hidden">
        {/* Board */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: `repeat(${Math.ceil((BOARD_SIZE + 1) / 5)}, 1fr)` }}>
            {boardSquares.map(({ num, row, col }) => {
              const playersHere = positions.map((p, i) => p === num ? i : -1).filter(i => i >= 0);
              const special = SPECIAL[num];
              const isFinish = num === BOARD_SIZE;
              const isStart = num === 0;
              return (
                <div key={num}
                  style={{ gridRow: row + 1, gridColumn: col + 1 }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border flex flex-col items-center justify-center relative
                    ${isFinish ? 'bg-yellow-500/30 border-yellow-400' : isStart ? 'bg-green-500/20 border-green-400/30' : special ? (special.type === 'forward' ? 'bg-green-500/20 border-green-400/30' : 'bg-red-500/20 border-red-400/30') : 'bg-white/5 border-white/10'}`}>
                  <span className="text-[9px] text-slate-400 font-bold leading-none">{isFinish ? '🏁' : isStart ? 'S' : num}</span>
                  {special && <span className="text-[8px] leading-none font-bold">{special.label}</span>}
                  {playersHere.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-wrap gap-0.5 justify-center">
                        {playersHere.map(pi => <span key={pi} className="text-base leading-none">{PLAYER_EMOJIS[pi]}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-64 flex flex-col gap-3 shrink-0">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-sm text-slate-400 mb-1">Lượt của</p>
            <p className="text-2xl font-black">{PLAYER_EMOJIS[currentPlayer]} Người chơi {currentPlayer + 1}</p>
          </div>

          {/* Dice */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <div className={`text-6xl mb-3 transition-all ${rolling ? 'animate-spin' : ''}`}>
              {diceVal ? DICE_FACES[diceVal - 1] : '🎲'}
            </div>
            {phase === 'roll' && (
              <button onClick={rollDice} disabled={rolling}
                className="w-full py-3 bg-linear-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 rounded-xl font-black text-lg text-slate-900 disabled:opacity-50 transition-all">
                {rolling ? 'Đang lắc...' : '🎲 Tung!'}
              </button>
            )}
          </div>

          {/* Question */}
          {phase === 'question' && (
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex-1">
              <p className="text-xs font-bold text-yellow-300 mb-2">❓ Trả lời để giữ vị trí!</p>
              <p className="text-sm font-bold text-white mb-3 leading-relaxed">{q?.text}</p>
              <div className="grid grid-cols-2 gap-2">
                {q?.options.map((opt, i) => {
                  const isSel = selected === i;
                  const isCorrect = i === q.answer;
                  let cls = 'bg-white/10 border-white/20 hover:bg-white/20 cursor-pointer';
                  if (selected !== null) {
                    if (isCorrect) cls = 'bg-green-500/30 border-green-400 cursor-default';
                    else if (isSel) cls = 'bg-red-500/30 border-red-400 cursor-default';
                    else cls = 'opacity-30 cursor-default bg-white/5 border-white/5';
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                      className={`p-2 rounded-xl border text-left text-xs transition-all ${cls}`}>
                      <span className="font-black text-yellow-300 mr-1">{OPTS[i]}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <p className={`mt-2 text-xs text-center font-bold ${selected === q?.answer ? 'text-green-300' : 'text-red-300'}`}>
                  {selected === q?.answer ? '✅ Đúng! Giữ vị trí.' : '❌ Sai! Lùi 1 ô.'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
