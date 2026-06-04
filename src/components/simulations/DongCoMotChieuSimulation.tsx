import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Info, RotateCcw } from 'lucide-react';

const CANVAS_W = 560;
const CANVAS_H = 380;

function clamp(v: number, mn: number, mx: number) { return Math.max(mn, Math.min(mx, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function drawScene(
  ctx: CanvasRenderingContext2D,
  magnetX: number,        // position along horizontal axis (0 = far left, 1 = far right)
  magnetPolarity: 1 | -1, // 1 = N on right, -1 = N on left
  coilX: number,          // center x in pixels
) {
  const W = CANVAS_W, H = CANVAS_H;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, W, H);

  // ---- COIL ----
  const coilY = H / 2;
  const coilW = 130, coilH = 90;

  // Coil body (simplified as rectangle with windings)
  ctx.save();
  ctx.translate(coilX, coilY);

  // Coil windings
  for (let w = 0; w < 5; w++) {
    const wx = -coilW / 2 + w * (coilW / 5) + coilW / 10;
    ctx.beginPath();
    ctx.ellipse(wx, 0, 10, coilH / 2, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // Coil frame top/bottom
  ctx.beginPath();
  ctx.moveTo(-coilW / 2, -coilH / 2);
  ctx.lineTo(coilW / 2, -coilH / 2);
  ctx.moveTo(-coilW / 2, coilH / 2);
  ctx.lineTo(coilW / 2, coilH / 2);
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Coil label
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Cuộn dây dẫn', 0, -coilH / 2 - 10);
  ctx.restore();

  // ---- GALVANOMETER ----
  const galX = coilX;
  const galY = coilY + coilH / 2 + 55;
  const galR = 32;

  ctx.save();
  ctx.translate(galX, galY);
  ctx.beginPath();
  ctx.arc(0, 0, galR, 0, Math.PI * 2);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Galvanometer face
  ctx.beginPath();
  ctx.arc(0, 0, galR - 5, Math.PI, 0);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Scale marks
  for (let s = -3; s <= 3; s++) {
    const a = Math.PI + (s / 3) * Math.PI / 2;
    const r1 = galR - 8, r2 = galR - 14;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
    ctx.strokeStyle = s === 0 ? '#e2e8f0' : '#475569';
    ctx.lineWidth = s === 0 ? 2 : 1;
    ctx.stroke();
  }

  // Compute induced current direction and strength
  // Current induced when magnet moves: proportional to rate of flux change
  // Simplified: position near center = high flux, edges = low flux
  // Simulate dFlux/dt based on magnet position and direction
  const magnetRelPos = magnetX * W - coilX;
  const distFromCoil = Math.abs(magnetRelPos);
  const inside = distFromCoil < coilW / 2 + 20;
  // Flux changes most when magnet is entering/exiting the coil
  const fluxGradient = Math.max(0, 1 - distFromCoil / (coilW * 0.9));
  // Current direction depends on polarity and whether entering or leaving
  const entering = magnetRelPos * magnetPolarity < 0;
  const currentStrength = fluxGradient * (inside ? 0.6 : 1.0);
  const currentDir = entering ? 1 : -1;
  const deflection = currentStrength * currentDir * magnetPolarity * 0.8;

  // Needle
  const needleAngle = Math.PI + Math.PI / 2 + deflection;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(needleAngle) * (galR - 6), Math.sin(needleAngle) * (galR - 6));
  ctx.strokeStyle = deflection > 0.05 ? '#ef4444' : deflection < -0.05 ? '#60a5fa' : '#e2e8f0';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();

  // G label
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('G', 0, galR + 16);
  ctx.font = '10px sans-serif';
  ctx.fillText('Điện kế', 0, galR + 28);

  ctx.restore();

  // Connecting wires
  ctx.beginPath();
  ctx.moveTo(coilX - coilW / 2, coilY + coilH / 2);
  ctx.lineTo(coilX - 50, coilY + coilH / 2);
  ctx.lineTo(coilX - 50, galY);
  ctx.lineTo(galX - galR, galY);
  ctx.moveTo(coilX + coilW / 2, coilY + coilH / 2);
  ctx.lineTo(coilX + 50, coilY + coilH / 2);
  ctx.lineTo(coilX + 50, galY);
  ctx.lineTo(galX + galR, galY);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  // ---- MAGNET ----
  const magW = 90, magH = 36;
  const magCx = magnetX * (W - magW) + magW / 2;
  const magCy = coilY;

  ctx.save();
  ctx.translate(magCx, magCy);

  // N pole (right side when polarity = 1)
  const nOnRight = magnetPolarity === 1;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(nOnRight ? 0 : -magW / 2, -magH / 2, magW / 2, magH);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(nOnRight ? -magW / 2 : 0, -magH / 2, magW / 2, magH);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-magW / 2, -magH / 2, magW, magH);

  // N/S labels
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.fillText(nOnRight ? 'S' : 'N', -magW / 4, 6);
  ctx.fillText(nOnRight ? 'N' : 'S', magW / 4, 6);

  ctx.restore();

  // Magnetic field lines visualization (simplified)
  if (currentStrength > 0.05) {
    const fieldColor = deflection > 0 ? '#ef444430' : '#3b82f630';
    for (let fline = 0; fline < 4; fline++) {
      const fy = coilY - coilH * 0.3 + fline * (coilH * 0.2);
      ctx.beginPath();
      ctx.moveTo(magCx, fy);
      ctx.lineTo(coilX, fy);
      ctx.strokeStyle = fieldColor;
      ctx.lineWidth = 2 * currentStrength;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Current status
  const statusText = currentStrength < 0.05 ? '〇 Không có dòng điện cảm ứng' :
    deflection > 0 ? '→ Dòng điện cảm ứng chiều dương' : '← Dòng điện cảm ứng chiều âm';
  const statusColor = currentStrength < 0.05 ? '#64748b' : deflection > 0 ? '#ef4444' : '#60a5fa';

  ctx.fillStyle = statusColor;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(statusText, W / 2, 25);
  ctx.fillStyle = '#64748b';
  ctx.font = '11px sans-serif';
  ctx.fillText(`Cường độ cảm ứng: ${(currentStrength * 100).toFixed(0)}%`, W / 2, 42);
}

export function DongCoMotChieuSimulation({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magnetX, setMagnetX] = useState(0.1);
  const [polarity, setPolarity] = useState<1 | -1>(1);
  const [isDragging, setIsDragging] = useState(false);
  const coilX = CANVAS_W / 2;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    drawScene(ctx, magnetX, polarity, coilX);
  }, [magnetX, polarity]);

  useEffect(() => { redraw(); }, [redraw]);

  const getCanvasX = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const relX = getCanvasX(e);
    const magCx = magnetX;
    if (Math.abs(relX - magCx) < 0.12) setIsDragging(true);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setMagnetX(clamp(getCanvasX(e), 0, 1));
  };
  const handleMouseUp = () => setIsDragging(false);

  const autoAnimate = () => {
    let x = 0.05;
    let dir = 1;
    const step = () => {
      x += dir * 0.005;
      if (x > 0.75) dir = -1;
      if (x < 0.05) { dir = 1; return; }
      setMagnetX(x);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">⚡ Cảm Ứng Điện Từ</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 9</p>
          </div>
        </div>
        <button onClick={autoAnimate} className="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-xl text-xs font-bold cursor-pointer transition-all">
          ▶ Tự động
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
          <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={CANVAS_W} height={CANVAS_H}
            className="rounded-3xl border border-slate-800 shadow-2xl max-w-full cursor-ew-resize"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          />
          <div>
            <div className="flex justify-between mb-1"><span className="text-xs text-slate-400 font-bold">🧲 Vị trí nam châm</span></div>
            <input type="range" min={0} max={100} value={Math.round(magnetX * 100)} onChange={e => setMagnetX(Number(e.target.value) / 100)}
              className="w-64 cursor-pointer" />
            <p className="text-[11px] text-slate-500 text-center mt-1">Kéo nam châm vào/ra cuộn dây để sinh dòng điện</p>
          </div>
        </div>

        <div className="w-full lg:w-72 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col gap-5">
          {/* Polarity toggle */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">🔄 Cực nam châm</h3>
            <div className="grid grid-cols-2 gap-2">
              {[{ p: 1 as 1 | -1, label: '→ N về phải', colors: 'bg-red-900/30 border-red-700' },
                { p: -1 as 1 | -1, label: '← N về trái', colors: 'bg-blue-900/30 border-blue-700' }].map(({ p, label, colors }) => (
                <button key={p} onClick={() => setPolarity(p)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all font-bold text-xs text-white ${polarity === p ? colors + ' ring-2 ring-white/20' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'}`}>
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Đảo cực nam châm → chiều dòng điện đảo ngược</p>
          </div>

          {/* Experiment guide */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">🔬 Thí nghiệm</h3>
            <div className="flex flex-col gap-2">
              {[
                { step: '1', text: 'Đưa nam châm vào cuộn dây → quan sát kim điện kế lệch' },
                { step: '2', text: 'Rút nam châm ra → kim lệch ngược chiều' },
                { step: '3', text: 'Giữ yên nam châm trong cuộn → không có dòng điện!' },
                { step: '4', text: 'Đảo cực nam châm → chiều dòng điện cũng đảo ngược' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-cyan-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">{step}</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Faraday's law */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-2">📐 Định luật Faraday</h3>
            <div className="bg-slate-950/50 rounded-xl p-2 text-center font-mono text-[11px] text-white mb-2">ε = -N × ΔΦ/Δt</div>
            <p className="text-[11px] text-amber-200 leading-relaxed">Sức điện động cảm ứng ε tỉ lệ với <strong>tốc độ thay đổi</strong> của từ thông Φ. Khi nam châm đứng yên: ΔΦ = 0 → ε = 0!</p>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-3">
            <div className="flex items-start gap-2"><Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200">Đây là nguyên lý hoạt động của máy phát điện và động cơ điện!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
