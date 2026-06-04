import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Info, RotateCcw } from 'lucide-react';

// Mirror angle in degrees (0 = horizontal)
const CANVAS_W = 560;
const CANVAS_H = 400;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

interface Mirror {
  id: number;
  x: number;
  y: number;
  angle: number; // mirror surface angle in degrees from horizontal
  length: number;
  dragging: boolean;
}

interface HitAngle {
  x: number; y: number;
  incident: number; reflect: number;
  normal: number;
  inDx: number; inDy: number;   // incoming ray direction (toward hit)
  outDx: number; outDy: number; // reflected ray direction (away from hit)
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  laserAngle: number,
  mirrors: Mirror[],
  showProtractor: boolean
) {
  const W = CANVAS_W;
  const H = CANVAS_H;

  ctx.clearRect(0, 0, W, H);

  // Dark background
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Laser source at left middle
  const srcX = 30;
  const srcY = H / 2;

  // Draw laser gun
  ctx.save();
  ctx.translate(srcX, srcY);
  ctx.rotate(toRad(laserAngle));
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-8, -5, 16, 10);
  ctx.fillStyle = '#fee2e2';
  ctx.fillRect(8, -2, 8, 4);
  ctx.restore();

  // Trace ray reflections
  const MAX_BOUNCES = 8;
  const MAX_LEN = 1200;
  let cx = srcX, cy = srcY;
  let dx = Math.cos(toRad(laserAngle));
  let dy = Math.sin(toRad(laserAngle));

  const rays: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const hitAngles: HitAngle[] = [];

  for (let bounce = 0; bounce <= MAX_BOUNCES; bounce++) {
    let minT = MAX_LEN;
    let hitMirror: Mirror | null = null;
    let hitX = cx + dx * MAX_LEN;
    let hitY = cy + dy * MAX_LEN;

    mirrors.forEach(m => {
      const mRad = toRad(m.angle);
      const mCos = Math.cos(mRad), mSin = Math.sin(mRad);
      const mx1 = m.x - (m.length / 2) * mCos;
      const my1 = m.y - (m.length / 2) * mSin;
      const mx2 = m.x + (m.length / 2) * mCos;
      const my2 = m.y + (m.length / 2) * mSin;

      const ex = mx2 - mx1, ey = my2 - my1;
      const denom = dx * ey - dy * ex;
      if (Math.abs(denom) < 1e-10) return;
      const t = ((mx1 - cx) * ey - (my1 - cy) * ex) / denom;
      const u = ((mx1 - cx) * dy - (my1 - cy) * dx) / denom;
      if (t > 0.01 && t < minT && u >= 0 && u <= 1) {
        minT = t;
        hitMirror = m;
        hitX = cx + dx * t;
        hitY = cy + dy * t;
      }
    });

    // Check walls
    const walls = [
      { x1: 0, y1: 0, x2: W, y2: 0 },
      { x1: 0, y1: H, x2: W, y2: H },
      { x1: W, y1: 0, x2: W, y2: H },
    ];
    walls.forEach(w => {
      const ex = w.x2 - w.x1, ey = w.y2 - w.y1;
      const denom = dx * ey - dy * ex;
      if (Math.abs(denom) < 1e-10) return;
      const t = ((w.x1 - cx) * ey - (w.y1 - cy) * ex) / denom;
      const u = ((w.x1 - cx) * dy - (w.y1 - cy) * dx) / denom;
      if (t > 0.01 && t < minT && u >= 0 && u <= 1) {
        minT = t;
        hitMirror = null;
        hitX = cx + dx * t;
        hitY = cy + dy * t;
      }
    });

    rays.push({ x1: cx, y1: cy, x2: hitX, y2: hitY });

    if (!hitMirror) break;

    // Compute reflection
    const mRad = toRad((hitMirror as Mirror).angle);
    const nRad = mRad + Math.PI / 2;
    const nx = Math.cos(nRad), ny = Math.sin(nRad);
    const dot = dx * nx + dy * ny;
    const rdx = dx - 2 * dot * nx;
    const rdy = dy - 2 * dot * ny;

    const incAngle = Math.abs(toDeg(Math.acos(Math.min(1, Math.abs(dot)))));
    hitAngles.push({
      x: hitX, y: hitY,
      incident: incAngle,
      reflect: incAngle,
      normal: toDeg(nRad),
      inDx: dx, inDy: dy,      // direction of incoming ray
      outDx: rdx, outDy: rdy,  // direction of reflected ray
    });

    cx = hitX; cy = hitY;
    dx = rdx; dy = rdy;
  }

  // Draw rays (glowing laser)
  rays.forEach((r, i) => {
    const alpha = Math.max(0.2, 1 - i * 0.12);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(r.x1, r.y1); ctx.lineTo(r.x2, r.y2);
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  });

  // Draw hit dots and angle info
  hitAngles.forEach((h) => {
    ctx.beginPath();
    ctx.arc(h.x, h.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (showProtractor) {
      const nRad = toRad(h.normal);
      // Determine which side of mirror the normal points (toward incident ray)
      // Normal should point toward the incident side
      const dotCheck = h.inDx * Math.cos(nRad) + h.inDy * Math.sin(nRad);
      const nxSign = dotCheck > 0 ? -1 : 1; // flip if normal points same dir as ray
      const nx = nxSign * Math.cos(nRad);
      const ny = nxSign * Math.sin(nRad);

      // Draw normal line
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(h.x - nx * 50, h.y - ny * 50);
      ctx.lineTo(h.x + nx * 50, h.y + ny * 50);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      const LABEL_DIST = 38;

      // --- Label i: bisector between (-inDx,-inDy) and (nx,ny) ---
      // -inDx, -inDy points back along incident ray (away from hit)
      const iBackX = -h.inDx, iBackY = -h.inDy;
      const bisI_x = iBackX + nx;
      const bisI_y = iBackY + ny;
      const bisI_len = Math.sqrt(bisI_x * bisI_x + bisI_y * bisI_y) || 1;
      const liX = h.x + (bisI_x / bisI_len) * LABEL_DIST;
      const liY = h.y + (bisI_y / bisI_len) * LABEL_DIST;

      // --- Label r: bisector between (outDx,outDy) and (nx,ny) ---
      const bisR_x = h.outDx + nx;
      const bisR_y = h.outDy + ny;
      const bisR_len = Math.sqrt(bisR_x * bisR_x + bisR_y * bisR_y) || 1;
      const lrX = h.x + (bisR_x / bisR_len) * LABEL_DIST;
      const lrY = h.y + (bisR_y / bisR_len) * LABEL_DIST;

      // Draw arc for angle i
      ctx.save();
      ctx.globalAlpha = 0.7;
      const incRad_from = Math.atan2(iBackY, iBackX);
      const incRad_to = Math.atan2(ny, nx);
      ctx.beginPath();
      ctx.arc(h.x, h.y, 20, Math.min(incRad_from, incRad_to), Math.max(incRad_from, incRad_to));
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Draw arc for angle r
      ctx.save();
      ctx.globalAlpha = 0.7;
      const refRad_from = Math.atan2(h.outDy, h.outDx);
      const refRad_to = Math.atan2(ny, nx);
      ctx.beginPath();
      ctx.arc(h.x, h.y, 20, Math.min(refRad_from, refRad_to), Math.max(refRad_from, refRad_to));
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Draw labels at computed positions
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // i label with background
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(liX - 18, liY - 9, 36, 18);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`i=${Math.round(h.incident)}°`, liX, liY);

      // r label with background
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(lrX - 18, lrY - 9, 36, 18);
      ctx.fillStyle = '#34d399';
      ctx.fillText(`r=${Math.round(h.reflect)}°`, lrX, lrY);
    }
  });

  // Draw mirrors
  mirrors.forEach(m => {
    const mRad = toRad(m.angle);
    const mCos = Math.cos(mRad), mSin = Math.sin(mRad);
    const mx1 = m.x - (m.length / 2) * mCos;
    const my1 = m.y - (m.length / 2) * mSin;
    const mx2 = m.x + (m.length / 2) * mCos;
    const my2 = m.y + (m.length / 2) * mSin;

    // Mirror body
    ctx.beginPath();
    ctx.moveTo(mx1, my1); ctx.lineTo(mx2, my2);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Mirror reflection highlight
    ctx.beginPath();
    ctx.moveTo(mx1, my1); ctx.lineTo(mx2, my2);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Angle label
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${m.angle}°`, m.x, m.y - m.length / 2 - 8);

    // Drag handle
    ctx.beginPath();
    ctx.arc(m.x, m.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.strokeStyle = '#bfdbfe';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  return hitAngles;
}

const INITIAL_MIRRORS: Mirror[] = [
  { id: 1, x: 200, y: 200, angle: 135, length: 150, dragging: false },
  { id: 2, x: 400, y: 200, angle: 45, length: 150, dragging: false },
];

export function PhanXaAnhSangSimulation({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [laserAngle, setLaserAngle] = useState(0);
  const [mirrors, setMirrors] = useState<Mirror[]>(INITIAL_MIRRORS);
  const [showProtractor, setShowProtractor] = useState(true);
  const [hitCount, setHitCount] = useState(0);
  const [selectedMirror, setSelectedMirror] = useState<number | null>(null);
  const dragRef = useRef<{ mirrorId: number; startX: number; startY: number } | null>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const hits = drawScene(ctx, laserAngle, mirrors, showProtractor);
    setHitCount(hits.length);
  }, [laserAngle, mirrors, showProtractor]);

  useEffect(() => { redraw(); }, [redraw]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasPos(e);
    for (const m of mirrors) {
      if (Math.sqrt((x - m.x) ** 2 + (y - m.y) ** 2) < 15) {
        dragRef.current = { mirrorId: m.id, startX: x - m.x, startY: y - m.y };
        setSelectedMirror(m.id);
        return;
      }
    }
    setSelectedMirror(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const { x, y } = getCanvasPos(e);
    setMirrors(prev => prev.map(m => m.id === dragRef.current!.mirrorId
      ? { ...m, x: x - dragRef.current!.startX, y: y - dragRef.current!.startY }
      : m));
  };

  const handleMouseUp = () => { dragRef.current = null; };

  const addMirror = () => {
    setMirrors(prev => [...prev, { id: Date.now(), x: CANVAS_W / 2, y: CANVAS_H / 2, angle: 90, length: 100, dragging: false }]);
  };

  const removeMirror = (id: number) => { setMirrors(prev => prev.filter(m => m.id !== id)); setSelectedMirror(null); };

  const resetScene = () => { setMirrors(INITIAL_MIRRORS); setLaserAngle(0); setSelectedMirror(null); };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">🔦 Phản Xạ Ánh Sáng</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 7</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={showProtractor} onChange={e => setShowProtractor(e.target.checked)} className="w-3.5 h-3.5" />
            <span className="text-xs font-bold text-slate-300">Hiện góc</span>
          </label>
          <button onClick={addMirror} className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 rounded-xl text-xs font-bold cursor-pointer transition-all">+ Thêm gương</button>
          <button onClick={resetScene} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer transition-all"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* Main canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
          <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={CANVAS_W} height={CANVAS_H}
            className="rounded-2xl border border-slate-800 cursor-crosshair shadow-2xl max-w-full"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          />
          <p className="text-[11px] text-slate-400">Kéo tâm gương (chấm xanh) để di chuyển. Điều chỉnh góc gương và hướng laser ở bảng bên phải.</p>
        </div>

        {/* Controls panel */}
        <div className="w-full lg:w-72 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col gap-5">
          {/* Laser control */}
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase text-red-400 tracking-wider mb-3">🔦 Điều chỉnh Laser</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300 font-bold">Hướng chiếu</span>
              <span className="text-xl font-black text-red-400">{laserAngle}°</span>
            </div>
            <input type="range" min={-60} max={60} value={laserAngle} onChange={e => setLaserAngle(Number(e.target.value))}
              className="w-full cursor-pointer" />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
              <span>↗ Chếch lên</span>
              <span>→ Thẳng</span>
              <span>↘ Chếch xuống</span>
            </div>
          </div>

          {/* Mirror list */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">🪞 Điều chỉnh Gương ({mirrors.length})</h3>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {mirrors.map(m => (
                <div key={m.id} className={`rounded-2xl border p-3 transition-all ${selectedMirror === m.id ? 'border-cyan-500 bg-cyan-950/30' : 'border-slate-700 bg-slate-800/40'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">Gương #{m.id}</span>
                    <button onClick={() => removeMirror(m.id)} className="text-red-400 hover:text-red-300 cursor-pointer text-sm font-black">✕</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-12">Góc:</span>
                    <input type="range" min={0} max={180} value={m.angle}
                      onChange={e => setMirrors(prev => prev.map(mir => mir.id === m.id ? { ...mir, angle: Number(e.target.value) } : mir))}
                      className="flex-1 cursor-pointer" />
                    <span className="text-xs font-black text-cyan-400 w-8">{m.angle}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Law display */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-2">📐 Định luật phản xạ</h3>
            <div className="text-sm font-black text-white text-center py-2 bg-slate-950/50 rounded-xl mb-2">
              i = r
            </div>
            <p className="text-[11px] text-amber-200 leading-relaxed">
              <strong>Góc tới (i)</strong> bằng <strong>góc phản xạ (r)</strong>. Cả hai đều được tính từ đường pháp tuyến vuông góc với mặt gương.
            </p>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400 font-bold">Số lần phản xạ</p>
            <p className="text-3xl font-black text-cyan-400">{hitCount}</p>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200 leading-relaxed">Kéo tâm gương để di chuyển. Điều chỉnh góc gương để thay đổi hướng phản xạ!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
