import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Settings, Trash2, Plus, ChevronRight, RotateCcw, Trophy, Sparkles, Volume2, VolumeX, Check, X, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { Question } from './GameHub';
import confetti from 'canvas-confetti';

// ── Types ──
interface CrosswordRow {
  questionId: string;      // ID from question bank
  questionText: string;    // Question text
  options: string[];       // 4 options
  correctAnswer: number;   // index of correct option
  answerWord: string;      // extracted answer text (uppercase, no spaces)
  keyCharIndex: number;    // position in answerWord that intersects keyword column
}

interface CrosswordConfig {
  keyword: string;         // vertical keyword (uppercase)
  rows: CrosswordRow[];
}

type GamePhase = 'setup' | 'playing' | 'victory';

// ── Helpers ──
const stripPrefix = (opt: string) => opt.replace(/^[A-Da-d][\.\)]\s*/, '').trim();

const normalizeWord = (text: string) =>
  text.toUpperCase().replace(/\s+/g, '').replace(/[^A-ZÀ-Ỹ]/g, '');

const STORAGE_KEY = 'crossword_config';

// ── Component ──
export function CrosswordGame({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [config, setConfig] = useState<CrosswordConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { keyword: '', rows: [] };
  });

  // Play-state
  const [solvedRows, setSolvedRows] = useState<Set<number>>(new Set());
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showKeyword, setShowKeyword] = useState(false);

  const saveConfig = (c: CrosswordConfig) => {
    setConfig(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  };

  // ── Sound ──
  const playTone = (freq: number, type: OscillatorType, duration: number) => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const playCorrect = () => {
    playTone(523, 'triangle', 0.1);
    setTimeout(() => playTone(659, 'triangle', 0.1), 100);
    setTimeout(() => playTone(784, 'triangle', 0.2), 200);
  };
  const playWrong = () => { playTone(220, 'sawtooth', 0.3); };
  const playClick = () => { playTone(440, 'sine', 0.05); };

  // ── Confetti ──
  const triggerRowConfetti = () => {
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 }, colors: ['#60a5fa', '#fbbf24', '#34d399'] });
  };
  const triggerVictory = () => {
    const end = Date.now() + 3000;
    (function f() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#a855f7', '#3b82f6', '#fbbf24', '#ef4444'] });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#a855f7', '#3b82f6', '#fbbf24', '#ef4444'] });
      if (Date.now() < end) requestAnimationFrame(f);
    })();
  };

  // ── Handle answer ──
  const handleAnswer = (rowIdx: number, optIdx: number) => {
    const row = config.rows[rowIdx];
    if (!row) return;
    if (optIdx === row.correctAnswer) {
      playCorrect();
      triggerRowConfetti();
      const next = new Set(solvedRows);
      next.add(rowIdx);
      setSolvedRows(next);
      setActiveRow(null);
      if (next.size === config.rows.length) {
        setTimeout(() => {
          setPhase('victory');
          setShowKeyword(true);
          triggerVictory();
        }, 800);
      }
    } else {
      playWrong();
      setShakeRow(rowIdx);
      setTimeout(() => setShakeRow(null), 600);
    }
  };

  // ── Compute grid layout ──
  const computeGrid = () => {
    if (!config.keyword || config.rows.length === 0) return null;
    const keyword = normalizeWord(config.keyword);
    // Find maximum span needed
    let maxLeft = 0;
    let maxRight = 0;
    config.rows.forEach(r => {
      const left = r.keyCharIndex;
      const right = r.answerWord.length - r.keyCharIndex - 1;
      if (left > maxLeft) maxLeft = left;
      if (right > maxRight) maxRight = right;
    });
    const totalCols = maxLeft + 1 + maxRight;
    const keyCol = maxLeft; // column index of keyword
    return { keyword, totalCols, keyCol };
  };

  // ══════════════════════════════════
  // ── SETUP PHASE ──
  // ══════════════════════════════════
  if (phase === 'setup') {
    return (
      <SetupPhase
        config={config}
        questions={questions}
        onSave={saveConfig}
        onStart={() => { setSolvedRows(new Set()); setShowKeyword(false); setPhase('playing'); }}
        onBack={onBack}
      />
    );
  }

  // ══════════════════════════════════
  // ── PLAY / VICTORY PHASE ──
  // ══════════════════════════════════
  const grid = computeGrid();
  if (!grid) return null;
  const { keyword, totalCols, keyCol } = grid;

  return (
    <div className="w-screen h-screen flex flex-col font-sans overflow-hidden select-none"
      style={{ background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 30%, #6d28d9 60%, #4c1d95 100%)' }}
    >
      {/* ── HEADER ── */}
      <div className="w-full bg-purple-950/60 backdrop-blur-md border-b border-white/10 px-4 py-3 shrink-0 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setPhase('setup')} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/70 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-wide uppercase text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-400">
              🧩 Ô Chữ Khoa Học
            </h1>
            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Tìm từ khóa bí ẩn</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm font-black text-yellow-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {solvedRows.size}/{config.rows.length}
          </div>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col items-center gap-6 custom-scrollbar">
        <AnimatePresence mode="wait">
          {phase === 'victory' ? (
            <motion.div key="victory" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center flex-1 gap-6 text-center">
              <div className="w-28 h-28 bg-linear-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                <Trophy className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-yellow-400 drop-shadow-lg">TUYỆT VỜI!</h2>
              <p className="text-lg text-purple-200 font-bold max-w-md">
                Bạn đã giải đáp thành công tất cả <strong className="text-white">{config.rows.length}</strong> hàng ngang!
              </p>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-10 py-6 mt-2">
                <p className="text-sm text-purple-300 font-bold uppercase tracking-widest mb-2">Từ khóa</p>
                <p className="text-5xl md:text-6xl font-black text-yellow-400 tracking-[0.3em] drop-shadow-lg">
                  {keyword}
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={() => { setSolvedRows(new Set()); setShowKeyword(false); setPhase('playing'); }}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/20 text-white flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Chơi lại
                </button>
                <button onClick={onBack}
                  className="px-8 py-4 bg-linear-to-r from-yellow-400 to-orange-500 text-purple-950 rounded-2xl font-black transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> Thoát
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full h-full max-w-7xl flex flex-col lg:flex-row gap-6 items-stretch">
              {/* Left Column: Grid */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Keyword badge */}
                <div className="flex justify-end mb-3 shrink-0">
                  <div className="bg-linear-to-r from-red-600 to-rose-600 px-5 py-2 rounded-xl shadow-lg border border-red-400/40 flex items-center gap-2">
                    <span className="text-white font-black text-sm tracking-widest uppercase">Từ Khóa</span>
                    <button onClick={() => setShowKeyword(!showKeyword)} className="ml-1 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-all">
                      {showKeyword ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                </div>

                {/* ── CROSSWORD GRID ── */}
                <div className="overflow-x-auto rounded-3xl bg-purple-950/50 backdrop-blur-md border border-white/10 p-4 md:p-6 shadow-2xl flex-1 flex flex-col items-center justify-center">
                  <div className="flex flex-col gap-1.5 items-center min-w-fit">
                    {config.rows.map((row, rowIdx) => {
                      const isSolved = solvedRows.has(rowIdx);
                      const isActive = activeRow === rowIdx;
                      const isShaking = shakeRow === rowIdx;
                      const startCol = keyCol - row.keyCharIndex;

                      return (
                        <motion.div
                          key={rowIdx}
                          animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                          transition={{ duration: 0.5 }}
                          className="flex items-center gap-1.5"
                        >
                          {/* Row number button */}
                          <button
                            onClick={() => {
                              if (!isSolved) {
                                playClick();
                                setActiveRow(isActive ? null : rowIdx);
                              }
                            }}
                            disabled={isSolved}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-black text-lg md:text-xl flex items-center justify-center shrink-0 transition-all shadow-md ${
                              isSolved
                                ? 'bg-emerald-500 text-white border-2 border-emerald-400 cursor-default'
                                : isActive
                                ? 'bg-yellow-400 text-purple-950 border-2 border-yellow-300 scale-110 shadow-yellow-400/40 shadow-lg'
                                : 'bg-linear-to-br from-orange-400 to-yellow-500 text-purple-950 border-2 border-yellow-400/60 hover:scale-105 hover:shadow-lg cursor-pointer'
                            }`}
                          >
                            {rowIdx + 1}
                          </button>

                          {/* Cells */}
                          <div className="flex gap-0.5">
                            {Array.from({ length: totalCols }).map((_, colIdx) => {
                              const charIdx = colIdx - startCol;
                              const inWord = charIdx >= 0 && charIdx < row.answerWord.length;
                              const isKeyCol = colIdx === keyCol;
                              const letter = inWord ? row.answerWord[charIdx] : '';
                              const showLetter = isSolved && inWord;
                              const showKeyLetter = isKeyCol && inWord && (isSolved || showKeyword);

                              if (!inWord) {
                                return <div key={colIdx} className="w-9 h-9 md:w-11 md:h-11" />;
                              }

                              return (
                                <motion.div
                                  key={colIdx}
                                  initial={false}
                                  animate={showLetter ? { scale: [0.8, 1.1, 1], rotateY: [90, 0] } : {}}
                                  transition={{ duration: 0.4, delay: charIdx * 0.04 }}
                                  className={`w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center font-black text-base md:text-lg border-2 transition-all shadow-sm ${
                                    isKeyCol
                                      ? showKeyLetter
                                        ? 'bg-red-600 border-red-400 text-white shadow-red-500/40 shadow-md'
                                        : 'bg-red-700/60 border-red-500/50 text-transparent'
                                      : showLetter
                                      ? 'bg-sky-400 border-sky-300 text-white shadow-sky-400/30 shadow-md'
                                      : 'bg-sky-500/30 border-sky-400/40 text-transparent'
                                  }`}
                                >
                                  {showLetter || showKeyLetter ? letter : ''}
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Question */}
              <div className="w-full lg:w-[450px] shrink-0 lg:h-full flex flex-col min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeRow !== null && !solvedRows.has(activeRow) ? (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex-1 flex flex-col"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-yellow-400 via-pink-500 to-purple-500" />
                      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="flex items-center gap-3 mb-5 shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-purple-950 text-lg shadow-lg">
                          {activeRow + 1}
                        </div>
                        <div>
                          <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Câu hỏi hàng {activeRow + 1}</p>
                          <p className="text-xs text-slate-400">Chọn đáp án đúng để mở hàng ngang</p>
                        </div>
                        <button onClick={() => setActiveRow(null)} className="ml-auto p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
                        <p className="text-lg md:text-xl font-bold text-white leading-relaxed"
                          style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                          {config.rows[activeRow].questionText}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 shrink-0">
                        {config.rows[activeRow].options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswer(activeRow, optIdx)}
                            className="p-4 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/50 hover:scale-[1.02] transition-all text-left flex items-center gap-3 group"
                          >
                            <span className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-black text-sm bg-white/10 border border-white/10 text-purple-300 group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-400 transition-all">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="font-bold text-sm text-slate-200 leading-snug"
                              style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                              {opt}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-purple-950/30 backdrop-blur-md border border-white/10 border-dashed rounded-3xl p-6 shadow-xl flex-1 flex flex-col items-center justify-center text-center"
                    >
                       <HelpCircle className="w-16 h-16 text-purple-400/50 mb-4" />
                       <p className="text-xl font-black text-purple-300">Chưa chọn hàng</p>
                       <p className="text-sm text-purple-400/80 mt-2">Nhấn vào số thứ tự bên trái để xem câu hỏi và trả lời.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── SETUP PHASE COMPONENT ──
// ══════════════════════════════════════════════
function SetupPhase({
  config,
  questions,
  onSave,
  onStart,
  onBack,
}: {
  config: CrosswordConfig;
  questions: Question[];
  onSave: (c: CrosswordConfig) => void;
  onStart: () => void;
  onBack: () => void;
}) {
  const [keyword, setKeyword] = useState(config.keyword);
  const [rows, setRows] = useState<CrosswordRow[]>(config.rows);
  const [pickerOpen, setPickerOpen] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const keywordNorm = normalizeWord(keyword);

  const updateRow = (idx: number, patch: Partial<CrosswordRow>) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  };

  const addRow = () => {
    setRows(prev => [...prev, {
      questionId: '',
      questionText: '',
      options: [],
      correctAnswer: 0,
      answerWord: '',
      keyCharIndex: 0,
    }]);
  };

  const removeRow = (idx: number) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  const assignQuestion = (rowIdx: number, q: Question) => {
    const rawAnswer = stripPrefix(q.options[q.answer]);
    const word = normalizeWord(rawAnswer);
    // Try to auto-find keyCharIndex
    let keyIdx = 0;
    if (keywordNorm && rowIdx < keywordNorm.length) {
      const targetChar = keywordNorm[rowIdx];
      const found = word.indexOf(targetChar);
      keyIdx = found >= 0 ? found : 0;
    }
    updateRow(rowIdx, {
      questionId: q.id,
      questionText: q.text,
      options: q.options,
      correctAnswer: q.answer,
      answerWord: word,
      keyCharIndex: keyIdx,
    });
    setPickerOpen(null);
    setSearchTerm('');
  };

  const canStart = keywordNorm.length > 0 &&
    rows.length >= keywordNorm.length &&
    rows.every(r => r.answerWord.length > 0 && r.keyCharIndex < r.answerWord.length);

  const handleSaveAndStart = () => {
    const cfg: CrosswordConfig = { keyword: keywordNorm, rows };
    onSave(cfg);
    onStart();
  };

  const filteredQuestions = questions.filter(q => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return q.text.toLowerCase().includes(s) || q.options.some(o => o.toLowerCase().includes(s));
  });

  return (
    <div className="w-screen h-screen flex flex-col font-sans overflow-hidden select-none"
      style={{ background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 30%, #6d28d9 60%, #4c1d95 100%)' }}
    >
      {/* Header */}
      <div className="w-full bg-purple-950/60 backdrop-blur-md border-b border-white/10 px-4 py-3 shrink-0 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/70 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-wide uppercase text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-400">
              🧩 Thiết kế Ô Chữ
            </h1>
            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Bước 1: Cấu hình trò chơi</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm font-bold text-purple-200">
            📚 {questions.length} câu hỏi trong kho
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ── Keyword Input ── */}
          <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
            <label className="flex items-center gap-2 text-sm font-black text-yellow-400 uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4" /> Từ khóa chính (cột dọc)
            </label>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Ví dụ: KHOAHOC"
              className="w-full px-5 py-4 bg-purple-950/60 border-2 border-purple-500/30 focus:border-yellow-400/60 rounded-2xl text-2xl font-black text-yellow-300 placeholder-purple-500/50 outline-none transition-all tracking-[0.2em] uppercase text-center"
            />
            {keywordNorm && (
              <div className="mt-4 flex items-center justify-center gap-1">
                {keywordNorm.split('').map((ch, i) => (
                  <div key={i} className="w-10 h-10 md:w-12 md:h-12 bg-red-600 border-2 border-red-400 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-md shadow-red-500/30">
                    {ch}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Rows config ── */}
          <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <label className="flex items-center gap-2 text-sm font-black text-sky-400 uppercase tracking-widest">
                <Settings className="w-4 h-4" /> Hàng ngang ({rows.length}{keywordNorm ? ` / tối thiểu ${keywordNorm.length}` : ''})
              </label>
              <button onClick={addRow}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-md hover:-translate-y-0.5">
                <Plus className="w-4 h-4" /> Thêm hàng
              </button>
            </div>

            {rows.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-purple-500/30 rounded-2xl">
                <HelpCircle className="w-12 h-12 text-purple-500/40 mx-auto mb-3" />
                <p className="text-purple-300 font-bold">Chưa có hàng ngang nào</p>
                <p className="text-purple-400/60 text-sm mt-1">Nhấn "Thêm hàng" rồi chọn câu hỏi từ ngân hàng</p>
              </div>
            )}

            <div className="space-y-3">
              {rows.map((row, idx) => (
                <div key={idx} className="bg-purple-950/40 border border-white/10 rounded-2xl p-4 relative">
                  <div className="flex items-start gap-3">
                    {/* Row number */}
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-orange-400 to-yellow-500 flex items-center justify-center font-black text-purple-950 text-lg shadow-md">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Question assignment */}
                      {row.questionId ? (
                        <div>
                          <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Câu hỏi:</p>
                          <p className="text-sm text-white font-medium leading-snug line-clamp-2">{row.questionText}</p>
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
                              Đáp án: {row.answerWord}
                            </span>
                            {keywordNorm && idx < keywordNorm.length && (
                              <span className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold">
                                Ký tự khóa: "{keywordNorm[idx]}" ở vị trí {row.keyCharIndex + 1}
                              </span>
                            )}
                          </div>
                          {/* Key char index adjuster */}
                          {row.answerWord && (
                            <div className="mt-3">
                              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1.5">Vị trí ký tự giao cắt từ khóa:</p>
                              <div className="flex gap-0.5 flex-wrap">
                                {row.answerWord.split('').map((ch, ci) => (
                                  <button
                                    key={ci}
                                    onClick={() => updateRow(idx, { keyCharIndex: ci })}
                                    className={`w-9 h-9 rounded-lg font-black text-sm flex items-center justify-center transition-all border-2 ${
                                      ci === row.keyCharIndex
                                        ? 'bg-red-600 border-red-400 text-white shadow-md shadow-red-500/30 scale-110'
                                        : 'bg-sky-500/20 border-sky-400/30 text-sky-300 hover:bg-sky-500/40 cursor-pointer'
                                    }`}
                                  >
                                    {ch}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          <button onClick={() => setPickerOpen(idx)}
                            className="mt-3 text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors">
                            ↻ Đổi câu hỏi khác
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setPickerOpen(idx)}
                          className="w-full py-4 border-2 border-dashed border-purple-500/30 rounded-xl text-purple-400 hover:text-purple-300 hover:border-purple-400/50 font-bold text-sm transition-all flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4" /> Chọn câu hỏi từ ngân hàng
                        </button>
                      )}
                    </div>

                    {/* Remove */}
                    <button onClick={() => removeRow(idx)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Start Button ── */}
          <div className="flex gap-4 pb-6">
            <button onClick={onBack}
              className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-white transition-all border border-white/10">
              ← Quay lại
            </button>
            <button
              onClick={handleSaveAndStart}
              disabled={!canStart}
              className="flex-1 py-4 bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-purple-950 rounded-2xl font-black text-lg shadow-lg hover:-translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6 fill-purple-950" /> BẮT ĐẦU CHƠI
            </button>
          </div>
        </div>
      </div>

      {/* ── QUESTION PICKER MODAL ── */}
      <AnimatePresence>
        {pickerOpen !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setPickerOpen(null); setSearchTerm(''); }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[640px] md:top-[10vh] md:bottom-[10vh] bg-slate-900 border border-white/15 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-white/10 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-white">📚 Chọn câu hỏi cho hàng {pickerOpen + 1}</h3>
                  <button onClick={() => { setPickerOpen(null); setSearchTerm(''); }} className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm câu hỏi..."
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 focus:border-purple-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  autoFocus
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-bold">Không tìm thấy câu hỏi phù hợp</p>
                  </div>
                ) : filteredQuestions.map(q => {
                  const answer = stripPrefix(q.options[q.answer]);
                  const alreadyUsed = rows.some((r, ri) => r.questionId === q.id && ri !== pickerOpen);
                  return (
                    <button
                      key={q.id}
                      disabled={alreadyUsed}
                      onClick={() => assignQuestion(pickerOpen, q)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        alreadyUsed
                          ? 'border-white/5 opacity-40 cursor-not-allowed bg-white/5'
                          : 'border-white/10 bg-white/5 hover:bg-purple-500/10 hover:border-purple-400/40 cursor-pointer'
                      }`}
                    >
                      <p className="text-sm font-bold text-white leading-snug mb-2">{q.text}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                          ✓ {answer}
                        </span>
                        {alreadyUsed && (
                          <span className="px-2.5 py-1 rounded-lg bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold">
                            Đã dùng ở hàng khác
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
