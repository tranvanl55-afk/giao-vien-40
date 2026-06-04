import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Info, RotateCcw } from 'lucide-react';

const CANVAS_W = 560;
const CANVAS_H = 400;

interface FloatingObj { id: string; label: string; color: string; emoji: string; density: number; }
interface Liquid { id: string; label: string; color: string; density: number; }

const OBJECTS: FloatingObj[] = [
  { id: 'wood', label: 'Gỗ', color: '#92400e', emoji: '🪵', density: 0.6 },
  { id: 'plastic', label: 'Nhựa', color: '#7c3aed', emoji: '🧴', density: 0.9 },
  { id: 'iron', label: 'Sắt', color: '#374151', emoji: '⚙️', density: 7.8 },
  { id: 'ice', label: 'Nước đá', color: '#bfdbfe', emoji: '🧊', density: 0.9 },
  { id: 'foam', label: 'Xốp', color: '#fef3c7', emoji: '🍦', density: 0.02 },
  { id: 'stone', label: 'Đá', color: '#6b7280', emoji: '🪨', density: 2.5 },
];

const LIQUIDS: Liquid[] = [
  { id: 'water', label: 'Nước ngọt', color: '#60a5fa88', density: 1.0 },
  { id: 'seawater', label: 'Nước biển', color: '#1d4ed888', density: 1.025 },
  { id: 'oil', label: 'Dầu ăn', color: '#fbbf2488', density: 0.9 },
  { id: 'mercury', label: 'Thủy ngân', color: '#9ca3af88', density: 13.6 },
];

function drawScene(ctx: CanvasRenderingContext2D, obj: FloatingObj, liq: Liquid, submerge: number) {
  const W = CANVAS_W, H = CANVAS_H;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Beaker walls
  const bx = W / 2 - 120, bw = 240, by = 40, bh = H - 80;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh);
  ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by);
  ctx.stroke();

  // Liquid fill
  const liquidLevel = by + bh * 0.25;
  const liquidH = bh * 0.65;
  const liquidGrad = ctx.createLinearGradient(0, liquidLevel, 0, liquidLevel + liquidH);
  liquidGrad.addColorStop(0, liq.color.replace('88', 'aa'));
  liquidGrad.addColorStop(1, liq.color.replace('88', '66'));
  ctx.fillStyle = liquidGrad;
  ctx.fillRect(bx + 2, liquidLevel, bw - 4, liquidH);

  // Liquid surface ripple
  ctx.beginPath();
  ctx.ellipse(bx + bw / 2, liquidLevel, bw / 2 - 5, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = liq.color.replace('88', 'cc');
  ctx.fill();

  // Liquid label
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${liq.label} (ρ = ${liq.density} g/cm³)`, bx + bw / 2, liquidLevel + liquidH / 2 + 5);

  // Object
  const objSize = 56;
  const floatsNaturally = obj.density < liq.density;
  const sinksPart = !floatsNaturally && submerge < 1;

  // Determine position: object sits on surface or submerged
  const subFraction = floatsNaturally ? (obj.density / liq.density) : Math.min(1, submerge);
  const objBottom = floatsNaturally
    ? liquidLevel + subFraction * objSize
    : liquidLevel + liquidH * submerge;
  const objTop = objBottom - objSize;
  const objCx = bx + bw / 2;

  // Draw scale/measurement
  if (subFraction > 0.05) {
    // Arrow showing buoyancy
    const arrowX = bx - 50;
    const arrowY = objBottom - objSize / 2;
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY + objSize * 0.3);
    ctx.lineTo(arrowX, arrowY - objSize * 0.4);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(arrowX - 6, arrowY - objSize * 0.35);
    ctx.lineTo(arrowX, arrowY - objSize * 0.5);
    ctx.lineTo(arrowX + 6, arrowY - objSize * 0.35);
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FA', arrowX, arrowY - objSize * 0.55);

    // Weight arrow
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY - objSize * 0.1);
    ctx.lineTo(arrowX, arrowY + objSize * 0.5);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(arrowX - 6, arrowY + objSize * 0.45);
    ctx.lineTo(arrowX, arrowY + objSize * 0.6);
    ctx.lineTo(arrowX + 6, arrowY + objSize * 0.45);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillText('P', arrowX, arrowY + objSize * 0.75);
  }

  // Draw object
  ctx.save();
  const objGrad = ctx.createRadialGradient(objCx - 8, objTop + 8, 0, objCx, objTop + objSize / 2, objSize);
  objGrad.addColorStop(0, obj.color + 'ff');
  objGrad.addColorStop(1, obj.color + '88');
  ctx.fillStyle = objGrad;
  ctx.beginPath();
  ctx.roundRect(objCx - objSize / 2, objTop, objSize, objSize, 8);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Emoji label
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(obj.emoji, objCx, objTop + objSize / 2 + 10);

  ctx.restore();

  // Submerged portion highlight
  if (subFraction > 0.02) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.roundRect(objCx - objSize / 2 + 2, liquidLevel, objSize - 4, Math.min(subFraction * objSize, objSize) - 2, [0, 0, 8, 8]);
    ctx.fill();
    ctx.restore();
  }

  // Readings
  const Vobj = 0.001; // 1 lít (simplified)
  const Vsub = Vobj * subFraction;
  const FA = liq.density * 9.8 * Vsub * 1000; // in mN (simplified for display)
  const weight = obj.density * 9.8 * Vobj * 1000;

  const infoX = bx + bw + 20;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  const readings = [
    { label: 'ρ vật', value: `${obj.density} g/cm³`, color: '#fbbf24' },
    { label: 'ρ lỏng', value: `${liq.density} g/cm³`, color: '#60a5fa' },
    { label: 'V chìm', value: `${(subFraction * 100).toFixed(0)}%`, color: '#34d399' },
    { label: 'FA', value: `${(FA * subFraction).toFixed(1)} N`, color: '#34d399' },
    { label: 'Trọng lượng P', value: `${(weight).toFixed(1)} N`, color: '#ef4444' },
    { label: 'Trạng thái', value: floatsNaturally ? '⬆️ Nổi' : submerge >= 1 ? '⬇️ Chìm' : '↔️ Lơ lửng', color: '#e2e8f0' },
  ];
  readings.forEach(({ label, value, color }, i) => {
    ctx.fillStyle = '#64748b';
    ctx.fillText(label + ':', infoX, by + 30 + i * 45);
    ctx.fillStyle = color;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(value, infoX, by + 47 + i * 45);
    ctx.font = 'bold 11px sans-serif';
  });
}

export function LucDayArchimedesSimulation({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedObj, setSelectedObj] = useState(OBJECTS[0]);
  const [selectedLiq, setSelectedLiq] = useState(LIQUIDS[0]);
  const [submerge, setSubmerge] = useState(0);

  const floatsNaturally = selectedObj.density < selectedLiq.density;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    drawScene(ctx, selectedObj, selectedLiq, floatsNaturally ? selectedObj.density / selectedLiq.density : submerge);
  }, [selectedObj, selectedLiq, submerge, floatsNaturally]);

  useEffect(() => {
    setSubmerge(floatsNaturally ? selectedObj.density / selectedLiq.density : 0);
  }, [selectedObj, selectedLiq, floatsNaturally]);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">⚓ Lực Đẩy Archimedes</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 8</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-2xl font-bold text-sm border ${floatsNaturally ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' : 'bg-red-900/40 border-red-700 text-red-300'}`}>
          {floatsNaturally ? '⬆️ Vật nổi' : '⬇️ Vật chìm'}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        <div className="flex-1 flex items-center justify-center p-4">
          <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={CANVAS_W} height={CANVAS_H}
            className="rounded-3xl border border-slate-800 shadow-2xl max-w-full" />
        </div>

        <div className="w-full lg:w-80 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col gap-5">
          {/* Object selector */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">🧪 Chọn vật liệu</h3>
            <div className="grid grid-cols-3 gap-2">
              {OBJECTS.map(obj => (
                <button key={obj.id} onClick={() => setSelectedObj(obj)}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${selectedObj.id === obj.id ? 'border-cyan-500 bg-cyan-950/40' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'}`}>
                  <div className="text-2xl">{obj.emoji}</div>
                  <div className="text-[10px] font-bold text-slate-300 mt-1">{obj.label}</div>
                  <div className="text-[9px] text-slate-500">{obj.density} g/cm³</div>
                </button>
              ))}
            </div>
          </div>

          {/* Liquid selector */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">💧 Chọn chất lỏng</h3>
            <div className="flex flex-col gap-2">
              {LIQUIDS.map(liq => (
                <button key={liq.id} onClick={() => setSelectedLiq(liq)}
                  className={`px-4 py-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${selectedLiq.id === liq.id ? 'border-blue-500 bg-blue-950/40' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'}`}>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: liq.color }} />
                  <div>
                    <p className="text-sm font-bold text-white">{liq.label}</p>
                    <p className="text-[10px] text-slate-400">ρ = {liq.density} g/cm³</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual submerge control (only when sinks) */}
          {!floatsNaturally && (
            <div className="bg-slate-800/60 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-black uppercase text-slate-400">Nhúng chìm</h3>
                <span className="text-xs font-black text-cyan-400">{Math.round(submerge * 100)}%</span>
              </div>
              <input type="range" min={0} max={1} step={0.01} value={submerge} onChange={e => setSubmerge(Number(e.target.value))}
                className="w-full cursor-pointer" />
            </div>
          )}

          {/* Law */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-2">📐 Định luật Archimedes</h3>
            <div className="bg-slate-950/50 rounded-xl p-2 text-center font-mono text-xs text-white mb-2">FA = ρ_lỏng × V_chìm × g</div>
            <p className="text-[11px] text-amber-200 leading-relaxed">Lực đẩy FA bằng trọng lượng của phần chất lỏng bị vật chiếm chỗ.</p>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-3">
            <div className="flex items-start gap-2"><Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200">Vật nổi khi <strong>ρ_vật &lt; ρ_lỏng</strong>. Thử thả đá vào thủy ngân xem điều gì xảy ra!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
