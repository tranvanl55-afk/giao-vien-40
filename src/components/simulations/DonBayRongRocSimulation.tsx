import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Info, RotateCcw } from 'lucide-react';

type Mode = 'lever' | 'pulley';

function lerp(a: number, b: number, t: number) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

// ---- LEVER SIMULATION ----
function LeverCanvas({ fulcrum, leftMass, rightMass }: { fulcrum: number; leftMass: number; rightMass: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Pivot position (fulcrum: 0-100)
    const pivotX = lerp(W * 0.1, W * 0.9, fulcrum / 100);
    const pivotY = H * 0.62;
    const beamLength = W * 0.85;
    const beamStartX = W * 0.075;
    const beamEndX = beamStartX + beamLength;

    // Calculate balance: moment arm
    const leftArm = pivotX - beamStartX;
    const rightArm = beamEndX - pivotX;
    const leftMoment = leftMass * leftArm;
    const rightMoment = rightMass * rightArm;
    const diff = rightMoment - leftMoment;
    const maxDiff = Math.max(leftMoment, rightMoment) + 1;
    const tiltAngle = Math.atan2(diff, maxDiff) * 0.6;
    const balanced = Math.abs(diff) < maxDiff * 0.05;

    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(tiltAngle);

    // Beam
    const localLeft = -(pivotX - beamStartX);
    const localRight = beamEndX - pivotX;
    const beamGrad = ctx.createLinearGradient(localLeft, -8, localRight, 8);
    beamGrad.addColorStop(0, '#78716c');
    beamGrad.addColorStop(0.5, '#a8a29e');
    beamGrad.addColorStop(1, '#78716c');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(localLeft, -8, localLeft + localRight + (localRight - localLeft), 16);
    ctx.strokeStyle = '#e7e5e4';
    ctx.lineWidth = 1;
    ctx.strokeRect(localLeft, -8, localLeft + localRight + (localRight - localLeft), 16);

    // Tick marks on beam
    for (let i = 0; i <= 10; i++) {
      const tx = localLeft + i * ((localRight - localLeft) / 10);
      ctx.beginPath();
      ctx.moveTo(tx, -8); ctx.lineTo(tx, -14);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${i}`, tx, -18);
    }

    // Left weight
    const weightSize = (w: number) => 20 + w * 3;
    const lw = weightSize(leftMass);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(localLeft + 5 - lw / 2, 8, lw, lw);
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(localLeft + 5 - lw / 2, 8, lw, lw);
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.max(9, Math.min(14, lw / 2))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${leftMass}N`, localLeft + 5, 8 + lw / 2 + 4);

    // Right weight
    const rw = weightSize(rightMass);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(localRight - 5 - rw / 2, 8, rw, rw);
    ctx.strokeStyle = '#bfdbfe';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(localRight - 5 - rw / 2, 8, rw, rw);
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.max(9, Math.min(14, rw / 2))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${rightMass}N`, localRight - 5, 8 + rw / 2 + 4);

    ctx.restore();

    // Fulcrum triangle
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX - 20, pivotY + 40);
    ctx.lineTo(pivotX + 20, pivotY + 40);
    ctx.closePath();
    const fulcGrad = ctx.createLinearGradient(pivotX - 20, pivotY, pivotX + 20, pivotY + 40);
    fulcGrad.addColorStop(0, '#94a3b8');
    fulcGrad.addColorStop(1, '#475569');
    ctx.fillStyle = fulcGrad;
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ground
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, pivotY + 40, W, H - (pivotY + 40));

    // Status
    ctx.fillStyle = balanced ? '#4ade80' : '#94a3b8';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(balanced ? '⚖️ Cân bằng!' : `Mô men T: ${Math.round(leftMoment)} | P: ${Math.round(rightMoment)}`, W / 2, H - 20);

    // Moment formulas
    ctx.fillStyle = '#ef4444';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`M_T = ${leftMass} × ${Math.round(pivotX - beamStartX)} = ${Math.round(leftMoment)}`, 10, H - 50);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`M_P = ${rightMass} × ${Math.round(beamEndX - pivotX)} = ${Math.round(rightMoment)}`, 10, H - 35);
  }, [fulcrum, leftMass, rightMass]);

  return <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={520} height={340} className="rounded-2xl border border-slate-800 shadow-xl max-w-full" />;
}

// ---- PULLEY SIMULATION ----
function PulleyCanvas({ fixedPulley, loadMass, effort }: { fixedPulley: boolean; loadMass: number; effort: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const mechanicalAdvantage = fixedPulley ? 1 : 2;
    const requiredForce = loadMass / mechanicalAdvantage;
    const sufficient = effort >= requiredForce;

    // Ceiling
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx - 60, 0, 120, 18);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, W, 10);

    // Fixed pulley
    const fy = 60;
    ctx.beginPath();
    ctx.arc(cx, fy, 28, 0, Math.PI * 2);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, fy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#64748b';
    ctx.fill();

    // Axle line to ceiling
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, fy - 28);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.stroke();

    if (!fixedPulley) {
      // Moving pulley
      const my = 180;
      ctx.beginPath();
      ctx.arc(cx, my, 24, 0, Math.PI * 2);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      // Rope: from ceiling left down to moving pulley, up to fixed pulley, back down
      ctx.beginPath();
      ctx.moveTo(cx - 50, 0);
      ctx.lineTo(cx - 24, my);
      ctx.arc(cx, my, 24, Math.PI, 0);
      ctx.lineTo(cx + 24, fy + 28);
      ctx.arc(cx, fy, 28, Math.PI / 2, 0, true);
      ctx.lineTo(cx + 28, H - 60);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Load
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(cx - 30, my + 24, 60, 55);
      ctx.strokeStyle = '#c4b5fd';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 30, my + 24, 60, 55);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${loadMass}N`, cx, my + 55);

      // Effort hand
      ctx.font = '28px sans-serif';
      ctx.fillText('🤜', cx + 28, H - 42);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`F = ${Math.round(requiredForce)}N`, cx + 45, H - 70);
    } else {
      // Simple fixed pulley rope
      ctx.beginPath();
      ctx.moveTo(cx - 28, fy);
      ctx.lineTo(cx - 28, H - 80);
      ctx.arc(cx, fy, 28, Math.PI, 0, false);
      ctx.lineTo(cx + 28, H - 60);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Load on left
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(cx - 58, H - 140, 60, 55);
      ctx.strokeStyle = '#c4b5fd';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 58, H - 140, 60, 55);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${loadMass}N`, cx - 28, H - 108);

      // Effort hand
      ctx.font = '28px sans-serif';
      ctx.fillText('🤜', cx + 28, H - 42);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`F = ${Math.round(requiredForce)}N`, cx + 50, H - 70);
    }

    // Status
    ctx.fillStyle = sufficient ? '#4ade80' : '#f87171';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(sufficient ? `✅ Nâng được! Tiết kiệm ${mechanicalAdvantage === 2 ? '50%' : '0%'} lực` : `❌ Cần lực tối thiểu ${Math.round(requiredForce)}N`, W / 2, H - 15);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Lực cơ học: ${mechanicalAdvantage} | Lực cần: ${Math.round(requiredForce)}N | Bạn dùng: ${effort}N`, W / 2, H - 1);
  }, [fixedPulley, loadMass, effort]);

  return <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={420} height={360} className="rounded-2xl border border-slate-800 shadow-xl max-w-full" />;
}

export function DonBayRongRocSimulation({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('lever');
  const [fulcrum, setFulcrum] = useState(50);
  const [leftMass, setLeftMass] = useState(5);
  const [rightMass, setRightMass] = useState(5);
  const [fixedPulley, setFixedPulley] = useState(true);
  const [loadMass, setLoadMass] = useState(20);
  const [effort, setEffort] = useState(15);

  const autoBalance = () => {
    const beamLength = 440;
    const pivotX = lerp(beamLength * 0.1, beamLength * 0.9, fulcrum / 100);
    const leftArm = pivotX - beamLength * 0.075;
    const rightArm = beamLength * 0.925 - pivotX;
    if (rightArm > 0) setLeftMass(Math.round(rightMass * rightArm / leftArm));
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">⚖️ Đòn Bẩy & Ròng Rọc</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 8</p>
          </div>
        </div>
        <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700 gap-1">
          {[{ id: 'lever', label: '⚖️ Đòn bẩy' }, { id: 'pulley', label: '🔄 Ròng rọc' }].map(m => (
            <button key={m.id} onClick={() => setMode(m.id as Mode)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${mode === m.id ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>{m.label}</button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        <div className="flex-1 flex items-center justify-center p-4">
          {mode === 'lever' ? (
            <LeverCanvas fulcrum={fulcrum} leftMass={leftMass} rightMass={rightMass} />
          ) : (
            <PulleyCanvas fixedPulley={fixedPulley} loadMass={loadMass} effort={effort} />
          )}
        </div>

        <div className="w-full lg:w-72 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col gap-4">
          {mode === 'lever' ? (
            <>
              <div className="bg-slate-800/60 rounded-2xl p-4">
                <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-300">📍 Điểm tựa</span><span className="text-sm font-black text-cyan-400">{fulcrum}%</span></div>
                <input type="range" min={10} max={90} value={fulcrum} onChange={e => setFulcrum(Number(e.target.value))} className="w-full cursor-pointer" />
              </div>

              {[{ label: '🔴 Vật bên trái (N)', value: leftMass, set: setLeftMass, color: 'text-red-400' },
                { label: '🔵 Vật bên phải (N)', value: rightMass, set: setRightMass, color: 'text-blue-400' }].map(({ label, value, set, color }) => (
                <div key={label} className="bg-slate-800/60 rounded-2xl p-4">
                  <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-300">{label}</span><span className={`text-sm font-black ${color}`}>{value} N</span></div>
                  <input type="range" min={1} max={15} value={value} onChange={e => set(Number(e.target.value))} className="w-full cursor-pointer" />
                </div>
              ))}

              <button onClick={autoBalance} className="py-2.5 bg-emerald-700 hover:bg-emerald-600 rounded-xl font-bold text-sm cursor-pointer transition-all text-white">⚖️ Tự cân bằng</button>

              <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4">
                <h3 className="text-xs font-black uppercase text-amber-400 mb-2">📐 Quy tắc đòn bẩy</h3>
                <div className="bg-slate-950/50 rounded-xl p-2 text-center font-mono text-xs text-white mb-2">F₁ × d₁ = F₂ × d₂</div>
                <p className="text-[11px] text-amber-200">Mô men lực bên trái bằng bên phải thì cân bằng.</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 mb-3">🔄 Loại ròng rọc</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[{ v: true, label: 'Cố định', desc: 'Đổi hướng lực, không lợi lực' }, { v: false, label: 'Động', desc: 'Lợi 2 lần lực, thiệt 2 lần đường' }].map(({ v, label, desc }) => (
                    <button key={String(v)} onClick={() => setFixedPulley(v)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${fixedPulley === v ? 'border-cyan-500 bg-cyan-950/40' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'}`}>
                      <p className="text-xs font-bold text-white">{label}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {[{ label: '🏋️ Vật nặng cần nâng (N)', value: loadMass, set: setLoadMass, max: 50 },
                { label: '💪 Lực bạn dùng (N)', value: effort, set: setEffort, max: 50 }].map(({ label, value, set, max }) => (
                <div key={label} className="bg-slate-800/60 rounded-2xl p-4">
                  <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-300">{label}</span><span className="text-sm font-black text-cyan-400">{value} N</span></div>
                  <input type="range" min={1} max={max} value={value} onChange={e => set(Number(e.target.value))} className="w-full cursor-pointer" />
                </div>
              ))}
            </>
          )}

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-3">
            <div className="flex items-start gap-2"><Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200">{mode === 'lever' ? 'Di chuyển điểm tựa để thay đổi lợi thế cơ học của đòn bẩy!' : 'Ròng rọc động giúp tiết kiệm một nửa lực cần thiết!'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
