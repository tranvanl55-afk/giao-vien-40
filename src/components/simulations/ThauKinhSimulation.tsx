import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Info, RotateCcw } from 'lucide-react';

type LensType = 'convex' | 'concave';

const CANVAS_W = 640;
const CANVAS_H = 380;

function toRad(d: number) { return d * Math.PI / 180; }

function drawLensScene(
  ctx: CanvasRenderingContext2D,
  lensType: LensType,
  objectDist: number, // pixels from lens (always > 0, to the left)
  focalLength: number  // pixels
) {
  const W = CANVAS_W, H = CANVAS_H;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;

  // Draw optical axis
  ctx.beginPath();
  ctx.moveTo(0, cy); ctx.lineTo(W, cy);
  ctx.strokeStyle = '#334155';
  ctx.setLineDash([6, 4]);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw the lens
  const lensH = 140;
  const lensW = 30;
  ctx.save();
  ctx.translate(cx, cy);

  // Lens shape
  ctx.beginPath();
  if (lensType === 'convex') {
    ctx.moveTo(0, -lensH / 2);
    ctx.bezierCurveTo(-lensW, -lensH / 4, -lensW, lensH / 4, 0, lensH / 2);
    ctx.bezierCurveTo(lensW, lensH / 4, lensW, -lensH / 4, 0, -lensH / 2);
  } else {
    ctx.moveTo(-8, -lensH / 2);
    ctx.bezierCurveTo(lensW, -lensH / 4, lensW, lensH / 4, -8, lensH / 2);
    ctx.lineTo(8, lensH / 2);
    ctx.bezierCurveTo(-lensW, lensH / 4, -lensW, -lensH / 4, 8, -lensH / 2);
    ctx.closePath();
  }
  ctx.fillStyle = 'rgba(96,165,250,0.15)';
  ctx.fill();
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Focal points
  const f = focalLength;
  [-f, f].forEach(fx => {
    ctx.beginPath();
    ctx.arc(fx, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fx < 0 ? 'F\'' : 'F', fx, 18);
  });

  ctx.restore();

  // Thin lens formula: 1/v - 1/u = 1/f (using sign convention)
  const u = -objectDist; // object on left: negative
  const f_signed = lensType === 'convex' ? focalLength : -focalLength;

  // 1/v = 1/f + 1/u  (Real is positive convention)
  const inv_v = 1 / f_signed + 1 / u;
  const v = inv_v !== 0 ? 1 / inv_v : Infinity;
  const magnification = v / u;

  // Object: candle
  const objX = cx - objectDist;
  const objH = 60;
  ctx.save();
  ctx.translate(objX, cy);
  // Draw candle stick
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-4, -objH, 8, objH);
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🕯️', 0, -objH - 5);
  // Arrow
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, -objH);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5, -objH + 8); ctx.lineTo(0, -objH); ctx.lineTo(5, -objH + 8);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.restore();

  // Image
  if (isFinite(v) && Math.abs(v) < W) {
    const imgX = cx + v;
    const imgH = Math.abs(magnification) * objH;
    const isInverted = magnification < 0;
    const isVirtual = v < 0;

    ctx.save();
    ctx.translate(imgX, cy);
    ctx.globalAlpha = isVirtual ? 0.55 : 0.9;
    ctx.fillStyle = isVirtual ? '#a78bfa' : '#34d399';
    // Arrow
    const arrowTop = isInverted ? imgH : -imgH;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, arrowTop);
    ctx.strokeStyle = isVirtual ? '#a78bfa' : '#34d399';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-5, arrowTop + (isInverted ? -8 : 8)); ctx.lineTo(0, arrowTop); ctx.lineTo(5, arrowTop + (isInverted ? -8 : 8));
    ctx.fillStyle = isVirtual ? '#a78bfa' : '#34d399';
    ctx.fill();
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isInverted ? '🕯️' : '🕯️', 0, arrowTop + (isInverted ? 20 : -20));
    ctx.restore();

    // Ray tracing (3 principal rays for convex)
    ctx.save();
    ctx.globalAlpha = 0.7;
    const rays = [
      { color: '#f87171', label: 'Tia // trục → qua F' },
      { color: '#4ade80', label: 'Tia qua tâm → thẳng' },
      { color: '#fb923c', label: 'Tia qua F\' → // trục' },
    ];

    // Ray 1: Parallel to axis, then through focal point
    ctx.beginPath();
    ctx.moveTo(objX, cy - objH);
    ctx.lineTo(cx, cy - objH);
    if (lensType === 'convex') {
      ctx.lineTo(imgX, cy - objH * magnification);
    } else {
      const virtualF = cx - focalLength;
      const slope = (cy - objH - cy) / (cx - objX);
      ctx.lineTo(W, cy - objH - slope * (W - cx) * 0.5);
    }
    ctx.strokeStyle = rays[0].color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ray 2: Through center
    ctx.beginPath();
    ctx.moveTo(objX, cy - objH);
    ctx.lineTo(imgX, cy - objH * magnification);
    ctx.strokeStyle = rays[1].color;
    ctx.stroke();

    // Ray 3: Toward focal, then parallel
    if (lensType === 'convex') {
      ctx.beginPath();
      ctx.moveTo(objX, cy - objH);
      ctx.lineTo(cx, 0);
      ctx.lineTo(imgX, cy - objH * magnification);
      ctx.strokeStyle = rays[2].color;
      ctx.stroke();
    }

    ctx.restore();

    // Image info box
    const info = [
      { label: 'Loại ảnh', value: isVirtual ? 'Ảo (cùng chiều)' : 'Thật (ngược chiều)', color: isVirtual ? '#a78bfa' : '#34d399' },
      { label: 'Khoảng cách ảnh', value: `${Math.abs(Math.round(v))} px`, color: '#e2e8f0' },
      { label: 'Độ phóng đại', value: `${Math.abs(magnification).toFixed(2)}x`, color: '#fbbf24' },
      { label: 'Chiều ảnh', value: isInverted ? 'Ngược chiều vật' : 'Cùng chiều vật', color: '#e2e8f0' },
    ];

    ctx.save();
    ctx.fillStyle = 'rgba(15,23,42,0.9)';
    ctx.roundRect(10, 10, 220, 110, 10);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();
    info.forEach(({ label, value, color }, i) => {
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, 18, 30 + i * 24);
      ctx.fillStyle = color;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(value, 18, 43 + i * 24);
    });
    ctx.restore();
  }
}

export function ThauKinhSimulation({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lensType, setLensType] = useState<LensType>('convex');
  const [objectDist, setObjectDist] = useState(180);
  const [focalLength, setFocalLength] = useState(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    drawLensScene(ctx, lensType, objectDist, focalLength);
  }, [lensType, objectDist, focalLength]);

  const u = -objectDist;
  const f_signed = lensType === 'convex' ? focalLength : -focalLength;
  const inv_v = 1 / f_signed + 1 / u;
  const v = inv_v !== 0 ? 1 / inv_v : Infinity;
  const mag = isFinite(v) ? Math.abs(v / u) : 0;
  const isVirtual = isFinite(v) && v < 0;
  const isInverted = isFinite(v) && v / u < 0;

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">🔬 Thấu Kính Quang Học</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 9</p>
          </div>
        </div>
        <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700 gap-1">
          {([['convex', '🔎 Hội tụ'], ['concave', '🔍 Phân kỳ']] as const).map(([type, label]) => (
            <button key={type} onClick={() => setLensType(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${lensType === type ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{label}</button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        <div className="flex-1 flex items-center justify-center p-4">
          <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={CANVAS_W} height={CANVAS_H}
            className="rounded-3xl border border-slate-800 shadow-2xl max-w-full" />
        </div>

        <div className="w-full lg:w-80 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col gap-5">
          {[
            { label: '📏 Khoảng cách vật (d)', value: objectDist, set: setObjectDist, min: 30, max: 280, color: '#fbbf24', unit: 'px' },
            { label: '🔎 Tiêu cự (f)', value: focalLength, set: setFocalLength, min: 40, max: 160, color: '#60a5fa', unit: 'px' },
          ].map(({ label, value, set, min, max, color, unit }) => (
            <div key={label} className="bg-slate-800/60 rounded-2xl p-4">
              <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-300">{label}</span><span className="text-sm font-black" style={{ color }}>{value} {unit}</span></div>
              <input type="range" min={min} max={max} value={value} onChange={e => set(Number(e.target.value))} className="w-full cursor-pointer" />
            </div>
          ))}

          {/* Results */}
          <div className="bg-slate-800/40 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-3">📊 Kết quả</h3>
            {[
              { label: 'Khoảng ảnh (d\')', value: isFinite(v) ? `${Math.abs(Math.round(v))} px` : '∞', color: isVirtual ? '#a78bfa' : '#34d399' },
              { label: 'Loại ảnh', value: !isFinite(v) ? 'Không có ảnh' : isVirtual ? 'Ảo, cùng chiều' : 'Thật, ngược chiều', color: isVirtual ? '#a78bfa' : '#34d399' },
              { label: 'Độ phóng đại', value: isFinite(v) ? `|m| = ${mag.toFixed(2)}` : '—', color: '#fbbf24' },
              { label: 'Vật tại F', value: objectDist === focalLength ? '⚠️ Ảnh ở vô cực' : '—', color: '#f87171' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">{label}</span>
                <span className="text-[11px] font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-2">📐 Công thức thấu kính</h3>
            <div className="bg-slate-950/50 rounded-xl p-2 text-center font-mono text-xs text-white">1/f = 1/d + 1/d'</div>
            <p className="text-[11px] text-amber-200 mt-2">d: khoảng cách vật | d': khoảng cách ảnh | f: tiêu cự</p>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-3">
            <div className="flex items-start gap-2"><Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200">Kéo vật qua tiêu điểm F để xem sự thay đổi từ ảnh thật sang ảnh ảo!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
