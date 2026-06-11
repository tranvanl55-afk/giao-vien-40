import React, { useState, useRef } from 'react';
import { ArrowLeft, RotateCcw, Upload, Link, Play, X } from 'lucide-react';
import { Question } from './GameHub';
import { motion, AnimatePresence } from 'motion/react';
import { soundClick, soundCorrect, soundWrong, soundStart, soundEnd } from '../../hooks/useGameSounds';

const OPTS = ['A', 'B', 'C', 'D'];
const GRID_COLS = 3;
const GRID_ROWS = 3;
const GRID = GRID_COLS * GRID_ROWS;

type Phase = 'setup' | 'play' | 'result';

export function PuzzleFlipGame({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [revealed, setRevealed] = useState<number[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const shuffled = React.useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions]);
  const q = shuffled[qIdx % (shuffled.length || 1)];

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => { if (e.target?.result) setImageUrl(e.target.result as string); };
    reader.readAsDataURL(file);
  };

  const handleUrlSet = () => {
    if (urlInput.trim()) setImageUrl(urlInput.trim());
  };

  const startGame = () => {
    soundStart();
    setRevealed([]); setQIdx(0); setSelected(null); setScore(0);
    setPhase('play');
  };

  const handleAnswer = (i: number) => {
    if (selected !== null || questions.length === 0) return;
    soundClick();
    setSelected(i);
    const isCorrect = i === q.answer;
    if (isCorrect) {
      soundCorrect();
      setScore(s => s + 1);
      const hidden = Array.from({ length: GRID }, (_, j) => j).filter(j => !revealed.includes(j));
      if (hidden.length > 0) {
        const toReveal = hidden[Math.floor(Math.random() * hidden.length)];
        const next = [...revealed, toReveal];
        setRevealed(next);
        if (next.length >= GRID) { soundEnd(); setTimeout(() => setPhase('result'), 1200); return; }
      }
    } else {
      soundWrong();
    }
    setTimeout(() => { setSelected(null); setQIdx(n => n + 1); }, 1400);
  };

  const reset = () => {
    setRevealed([]); setQIdx(0); setSelected(null); setScore(0); setPhase('setup');
  };

  // ── SETUP SCREEN ──
  if (phase === 'setup') return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-fuchsia-950 to-slate-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-bold hover:bg-white/20">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <h1 className="font-black text-fuchsia-300 text-lg">🧩 Cài đặt Lật Mảnh Ghép</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 p-6 max-w-4xl mx-auto w-full items-start">
        {/* Left: image setup */}
        <div className="flex-1 space-y-5">
          <div>
            <h2 className="font-black text-white text-base mb-1">🖼️ Hình ảnh dưới mảnh ghép</h2>
            <p className="text-xs text-slate-400">Học sinh sẽ đoán nội dung hình ảnh khi các mảnh được lật ra</p>
          </div>

          {/* Upload from device */}
          <div>
            <label className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest mb-2 block">Tải ảnh từ thiết bị</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-fuchsia-500/40 hover:border-fuchsia-400/70 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 transition-all cursor-pointer"
            >
              <Upload className="w-8 h-8 text-fuchsia-400" />
              <span className="text-sm font-bold text-fuchsia-300">Nhấn để chọn ảnh</span>
              <span className="text-xs text-slate-500">JPG, PNG, GIF, WebP...</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500 font-bold">HOẶC</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* URL input */}
          <div>
            <label className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest mb-2 block">Nhập đường dẫn URL ảnh</label>
            <div className="flex gap-2">
              <input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUrlSet()}
                placeholder="https://example.com/image.jpg"
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-400"
              />
              <button onClick={handleUrlSet} className="px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl transition-all">
                <Link className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Ảnh mẫu nhanh</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Tế bào', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Animal_Cell.svg/800px-Animal_Cell.svg.png' },
                { label: 'Hệ Mặt Trời', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Planets2013.svg/800px-Planets2013.svg.png' },
                { label: 'Bảng tuần hoàn', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/This_is_the_modern_periodic_table.svg/800px-This_is_the_modern_periodic_table.svg.png' },
                { label: 'DNA', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Difference_DNA_RNA-EN.svg/600px-Difference_DNA_RNA-EN.svg.png' },
                { label: 'Núi lửa', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Volcano_scheme.svg/600px-Volcano_scheme.svg.png' },
                { label: 'Khác...', url: '' },
              ].map((p, i) => (
                <button key={i} onClick={() => p.url ? setImageUrl(p.url) : fileRef.current?.click()}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${imageUrl === p.url && p.url ? 'bg-fuchsia-500/30 border-fuchsia-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: preview + start */}
        <div className="flex flex-col gap-4 items-center w-full lg:w-72">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest self-start">Xem trước</label>

          {/* Puzzle preview */}
          <div className="w-64 h-64 rounded-2xl overflow-hidden border-2 border-fuchsia-500/30 shadow-2xl bg-slate-800 relative">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                {/* Show puzzle overlay on preview */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 opacity-50">
                  {Array.from({ length: GRID }).map((_, i) => (
                    <div key={i} className="bg-fuchsia-900/80 border border-fuchsia-500/30 flex items-center justify-center">
                      <span className="text-lg opacity-30">🧩</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setImageUrl(''); setUrlInput(''); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 transition-all">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                <span className="text-4xl">🖼️</span>
                <span className="text-xs">Chưa chọn ảnh</span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 text-center">
            Hình sẽ được che bởi <strong className="text-fuchsia-300">{GRID} mảnh ghép</strong>.
            <br />Trả lời đúng → lật từng mảnh.
          </div>

          {/* Info */}
          <div className="w-full bg-white/5 rounded-xl p-3 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between"><span>Câu hỏi:</span><span className="font-bold text-white">{questions.length} câu</span></div>
            <div className="flex justify-between"><span>Số mảnh:</span><span className="font-bold text-white">{GRID} mảnh ({GRID_COLS}×{GRID_ROWS})</span></div>
            <div className="flex justify-between"><span>Hình ảnh:</span><span className={`font-bold ${imageUrl ? 'text-green-400' : 'text-red-400'}`}>{imageUrl ? '✓ Đã chọn' : '✗ Chưa chọn'}</span></div>
          </div>

          <button
            onClick={startGame}
            disabled={!imageUrl || questions.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(192,38,211,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5 fill-current" /> Bắt đầu!
          </button>
          {!imageUrl && <p className="text-xs text-red-400 text-center">Vui lòng chọn ảnh trước</p>}
          {questions.length === 0 && <p className="text-xs text-red-400 text-center">Vui lòng thêm câu hỏi</p>}
        </div>
      </div>
    </div>
  );

  // ── RESULT ──
  if (phase === 'result') return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 to-fuchsia-950 flex flex-col items-center justify-center text-white gap-6 p-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-8xl">🎉</motion.div>
      <h2 className="text-4xl font-black text-fuchsia-300">Hoàn thành!</h2>
      {imageUrl && <img src={imageUrl} alt="revealed" className="w-64 h-64 object-cover rounded-2xl shadow-2xl border-2 border-fuchsia-400/40" />}
      <p className="text-slate-300 text-lg">Đã trả lời đúng <strong className="text-green-400">{score}</strong> câu để lật hết {GRID} mảnh</p>
      <div className="flex gap-3">
        <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl font-bold">
          <RotateCcw className="w-4 h-4" /> Chơi lại
        </button>
        <button onClick={reset} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold">Đổi ảnh</button>
        <button onClick={onBack} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold">Thoát</button>
      </div>
    </div>
  );

  // ── PLAY ──
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-fuchsia-950 to-slate-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-bold hover:bg-white/20">
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <h1 className="font-black text-fuchsia-300 text-lg">🧩 Lật Mảnh Ghép</h1>
        <span className="text-sm text-slate-400">{revealed.length}/{GRID} mảnh</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 max-w-5xl mx-auto w-full">
        {/* Puzzle board */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-2 border-fuchsia-500/30 shadow-2xl">
            <img src={imageUrl} alt="puzzle" className="absolute inset-0 w-full h-full object-cover" />
            {/* Tile grid */}
            <div className="absolute inset-0 grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}>
              {Array.from({ length: GRID }, (_, i) => {
                const isRevealed = revealed.includes(i);
                return (
                  <AnimatePresence key={i}>
                    {!isRevealed && (
                      <motion.div
                        initial={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: 90, scale: 0.85 }}
                        transition={{ duration: 0.45 }}
                        className="bg-linear-to-br from-fuchsia-800 to-purple-900 flex items-center justify-center border border-fuchsia-600/20"
                      >
                        <span className="text-xl opacity-25">🧩</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div className="w-72">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Tiến độ</span>
              <span className="font-bold text-fuchsia-300">{Math.round((revealed.length / GRID) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-linear-to-r from-fuchsia-500 to-purple-500 rounded-full"
                animate={{ width: `${(revealed.length / GRID) * 100}%` }} transition={{ type: 'spring', bounce: 0.3 }} />
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <span className="text-green-400 font-bold">✓ {score} đúng</span>
            <span className="text-slate-400">{qIdx} câu đã làm</span>
          </div>
        </div>

        {/* Question panel */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div key={qIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-4 shrink-0">
              <div className="text-xs text-fuchsia-300 font-bold mb-2">Câu {qIdx + 1}</div>
              <p className="text-base font-bold leading-relaxed">{q?.text}</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            {q?.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.answer;
              let cls = 'bg-white/10 border-white/20 hover:bg-white/20 cursor-pointer';
              if (selected !== null) {
                if (isCorrect) cls = 'bg-green-500/30 border-green-400 cursor-default';
                else if (isSelected) cls = 'bg-red-500/30 border-red-400 cursor-default';
                else cls = 'bg-white/5 border-white/10 opacity-40 cursor-default';
              }
              return (
                <motion.button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                  whileTap={{ scale: 0.97 }}
                  className={`p-3 rounded-xl border text-left transition-all ${cls}`}>
                  <span className="font-black text-sm mr-2 text-fuchsia-300">{OPTS[i]}.</span>
                  <span className="text-sm">{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-xl text-center text-sm font-bold ${
                selected === q.answer ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'
              }`}>
              {selected === q.answer ? '✅ Đúng! Một mảnh ghép được lật!' : `❌ Sai! Đáp án đúng: ${OPTS[q.answer]}`}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
