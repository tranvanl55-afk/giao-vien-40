import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, Play, RotateCcw } from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { soundStart, soundEnd, soundClick } from '../../hooks/useGameSounds';

const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#6366f1','#10b981','#06b6d4'];

export function VongQuayGame({ onBack }: { onBack: () => void }) {
  const [names, setNames] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('vongquay_names') || '[]'); } catch { return []; }
  });
  const [newName, setNewName] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const controls = useAnimation();

  const saveNames = (ns: string[]) => {
    setNames(ns);
    localStorage.setItem('vongquay_names', JSON.stringify(ns));
  };

  const addName = () => {
    if (!newName.trim()) return;
    saveNames([...names, newName.trim()]);
    setNewName('');
  };

  const spin = async () => {
    if (spinning || names.length < 2) return;
    soundStart();
    setWinner(null);
    setSpinning(true);
    const extra = 1800 + Math.random() * 1800;
    const total = rotation + extra;
    setRotation(total);
    await controls.start({
      rotate: total,
      transition: { duration: 4 + Math.random() * 2, ease: [0.17, 0.67, 0.35, 1] },
    });
    const finalAngle = total % 360;
    const sliceAngle = 360 / names.length;
    const winnerIdx = Math.floor(((360 - finalAngle) % 360) / sliceAngle);
    setWinner(names[winnerIdx % names.length]);
    soundEnd();
    setSpinning(false);
  };

  const canvasSize = 320;
  const center = canvasSize / 2;
  const r = center - 4;

  // Draw wheel as SVG sectors
  const sectors = names.map((name, i) => {
    const slice = 360 / names.length;
    const start = i * slice;
    const end = start + slice;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1 = center + r * Math.cos(toRad(start - 90));
    const y1 = center + r * Math.sin(toRad(start - 90));
    const x2 = center + r * Math.cos(toRad(end - 90));
    const y2 = center + r * Math.sin(toRad(end - 90));
    const large = slice > 180 ? 1 : 0;
    const color = COLORS[i % COLORS.length];
    const midAngle = (start + end) / 2;
    const tx = center + (r * 0.65) * Math.cos(toRad(midAngle - 90));
    const ty = center + (r * 0.65) * Math.sin(toRad(midAngle - 90));
    return { path: `M${center},${center} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`, color, tx, ty, angle: midAngle - 90, name };
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-950 via-cyan-950 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex gap-2">
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-bold hover:bg-white/20 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Thoát
          </button>
          <button onClick={() => setShowRules(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-900/50 hover:bg-cyan-800 text-sm font-bold border border-cyan-500/20 text-cyan-300 cursor-pointer">
            📜 Luật chơi
          </button>
        </div>
        <h1 className="font-black text-cyan-300 text-lg">🎡 Vòng Quay Gọi Tên</h1>
        <div className="w-16" />
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 p-4 max-w-5xl mx-auto w-full">
        {/* Wheel */}
        <div className="flex flex-col items-center gap-4 flex-1">
          <div className="relative">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-12 border-r-12 border-t-24 border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
            </div>
            {/* Wheel */}
            {names.length >= 2 ? (
              <motion.svg width={canvasSize} height={canvasSize} animate={controls} className="drop-shadow-2xl">
                {sectors.map((s, i) => (
                  <g key={i}>
                    <path d={s.path} fill={s.color} stroke="white" strokeWidth="1.5" />
                    <text
                      x={s.tx} y={s.ty}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize={Math.max(9, 14 - names.length * 0.2)}
                      fontWeight="bold"
                      transform={`rotate(${s.angle}, ${s.tx}, ${s.ty})`}
                    >
                      {s.name.length > 10 ? s.name.slice(0, 10) + '…' : s.name}
                    </text>
                  </g>
                ))}
                <circle cx={center} cy={center} r={18} fill="white" />
                <circle cx={center} cy={center} r={12} fill="#1e293b" />
              </motion.svg>
            ) : (
              <div className="w-[320px] h-[320px] rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center text-slate-400 text-center p-8">
                Thêm ít nhất 2 tên để quay
              </div>
            )}
          </div>

          <button
            onClick={spin}
            disabled={spinning || names.length < 2}
            className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full font-black text-lg text-white shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            {spinning ? '⏳ Đang quay...' : <><Play className="w-5 h-5 fill-current" /> QUAY!</>}
          </button>

          {/* Winner announcement */}
          {winner && !spinning && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-linear-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-2xl px-8 py-5 text-center"
            >
              <p className="text-yellow-300 font-bold text-sm mb-1">🎉 Được chọn!</p>
              <p className="text-white font-black text-3xl">{winner}</p>
            </motion.div>
          )}
        </div>

        {/* Name list */}
        <div className="w-full lg:w-72 flex flex-col gap-3">
          <h3 className="font-bold text-teal-300 text-sm uppercase tracking-widest">Danh sách ({names.length})</h3>

          {/* Add name */}
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addName()}
              placeholder="Nhập tên học sinh..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-teal-400"
            />
            <button onClick={addName} className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Bulk input tip */}
          <details className="text-xs text-slate-400">
            <summary className="cursor-pointer hover:text-slate-300">💡 Nhập nhiều tên cùng lúc</summary>
            <textarea
              rows={4}
              placeholder={"Nhập mỗi tên 1 dòng:\nNguyễn Văn A\nTrần Thị B\nLê Văn C"}
              className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-400 resize-none"
              onBlur={e => {
                const bulk = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                if (bulk.length) { saveNames([...names, ...bulk]); e.target.value = ''; }
              }}
            />
          </details>

          {/* Name list */}
          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-80">
            {names.map((name, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1 text-sm">{name}</span>
                <button onClick={() => saveNames(names.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {names.length > 0 && (
            <button onClick={() => { saveNames([]); setWinner(null); }} className="text-xs text-red-400 hover:text-red-300 text-center">
              Xóa tất cả
            </button>
          )}
        </div>
      </div>
      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full relative text-left"
            >
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                📜 Luật chơi Vòng quay
              </h3>
              
              <ul className="space-y-3 text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold shrink-0 flex items-center justify-center text-[10px]">1</span>
                  <span>Nhập danh sách tên học sinh hoặc nhóm ở thanh bên (từng tên lẻ hoặc dán cả danh sách).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold shrink-0 flex items-center justify-center text-[10px]">2</span>
                  <span>Nhấn nút <strong>"QUAY!"</strong> để bắt đầu xoay vòng quay may mắn.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold shrink-0 flex items-center justify-center text-[10px]">3</span>
                  <span>Vòng quay sẽ dừng ngẫu nhiên ở một ô tên học sinh.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold shrink-0 flex items-center justify-center text-[10px]">4</span>
                  <span>Học sinh được chọn sẽ hiển thị nổi bật trên màn hình.</span>
                </li>
              </ul>

              <button
                onClick={() => setShowRules(false)}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl transition-all cursor-pointer text-center text-sm"
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
