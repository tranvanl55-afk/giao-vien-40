import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Thermometer, Info, Atom } from 'lucide-react';

type Phase = 'solid' | 'liquid' | 'gas';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const PARTICLE_COUNT = 60;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function getPhase(temp: number): Phase {
  if (temp < 0) return 'solid';
  if (temp < 100) return 'liquid';
  return 'gas';
}

function getPhaseInfo(phase: Phase) {
  switch (phase) {
    case 'solid': return { label: 'Thể Rắn (Băng)', color: '#60a5fa', bg: 'from-blue-900/30 to-blue-950', icon: '🧊', desc: 'Các phân tử liên kết chặt chẽ, dao động tại chỗ. Vật rắn có hình dạng và thể tích cố định.' };
    case 'liquid': return { label: 'Thể Lỏng (Nước)', color: '#34d399', bg: 'from-emerald-900/30 to-emerald-950', icon: '💧', desc: 'Các phân tử trượt qua nhau nhưng vẫn gần nhau. Chất lỏng có thể tích cố định nhưng hình dạng thay đổi theo vật chứa.' };
    case 'gas': return { label: 'Thể Khí (Hơi)', color: '#fbbf24', bg: 'from-amber-900/30 to-amber-950', icon: '💨', desc: 'Các phân tử chuyển động hỗn loạn nhanh chóng, cách xa nhau. Chất khí không có hình dạng và thể tích xác định.' };
  }
}

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, temp: number) {
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    if (particles.current.length === 0) {
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: 10 + Math.random() * (W - 20),
        y: 10 + Math.random() * (H - 20),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        r: 5 + Math.random() * 3,
      }));
    }

    const phase = getPhase(temp);
    const phaseInfo = getPhaseInfo(phase);

    // Speed factor based on temperature
    const speedFactor = phase === 'solid' ? 0.15 : phase === 'liquid' ? 0.7 : 2.5;
    // Cluster factor: how tightly packed
    const clusterStrength = phase === 'solid' ? 0.35 : phase === 'liquid' ? 0.05 : 0;

    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background grid for solid
      if (phase === 'solid') {
        ctx.strokeStyle = 'rgba(96,165,250,0.1)';
        ctx.lineWidth = 1;
        const gridSpacing = 28;
        for (let gx = gridSpacing; gx < W; gx += gridSpacing) {
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
        }
        for (let gy = gridSpacing; gy < H; gy += gridSpacing) {
          ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
        }
      }

      // Update & draw particles
      particles.current.forEach((p, i) => {
        // Pull toward grid positions when solid
        if (clusterStrength > 0) {
          const targetX = 14 + (i % 8) * 27;
          const targetY = 14 + Math.floor(i / 8) * 27;
          p.vx += (targetX - p.x) * clusterStrength * 0.08;
          p.vy += (targetY - p.y) * clusterStrength * 0.08;
        }

        // Limit speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = speedFactor * (1 + Math.random() * 0.4);
        if (speed > maxSpeed) { p.vx *= maxSpeed / speed; p.vy *= maxSpeed / speed; }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < p.r || p.x > W - p.r) { p.vx *= -0.8; p.x = Math.max(p.r, Math.min(W - p.r, p.x)); }
        if (p.y < p.r || p.y > H - p.r) { p.vy *= -0.8; p.y = Math.max(p.r, Math.min(H - p.r, p.y)); }

        // Draw particle
        const gradient = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 0, p.x, p.y, p.r * 1.5);
        gradient.addColorStop(0, phaseInfo.color + 'ff');
        gradient.addColorStop(1, phaseInfo.color + '44');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw bonds for solid/liquid
        if (phase !== 'gas') {
          particles.current.slice(i + 1).forEach(p2 => {
            const dx = p2.x - p.x; const dy = p2.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = phase === 'solid' ? 35 : 42;
            if (dist < maxDist) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = phaseInfo.color + Math.round(lerp(180, 20, dist / maxDist)).toString(16).padStart(2, '0');
              ctx.lineWidth = phase === 'solid' ? 1.5 : 0.8;
              ctx.stroke();
            }
          });
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [temp]);
}

export function ChuyenTheSimulation({ onBack }: { onBack: () => void }) {
  const [temp, setTemp] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useParticles(canvasRef, temp);

  const phase = getPhase(temp);
  const phaseInfo = getPhaseInfo(phase);

  const PHASE_TRANSITIONS = [
    { temp: 0, label: 'Đông đặc / Nóng chảy', color: 'text-blue-400' },
    { temp: 100, label: 'Bay hơi / Ngưng tụ', color: 'text-amber-400' },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-rose-400" /> Sự Chuyển Thể Của Chất
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 6</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-2xl bg-linear-to-r ${phaseInfo.bg} border border-slate-700 text-sm font-bold flex items-center gap-2`}>
          <span>{phaseInfo.icon}</span>
          <span style={{ color: phaseInfo.color }}>{phaseInfo.label}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* LEFT: Canvas Simulation */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          {/* Temperature Slider */}
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-black text-slate-300 uppercase tracking-wider">🌡️ Nhiệt độ</label>
              <span className="text-2xl font-black" style={{ color: phaseInfo.color }}>{temp}°C</span>
            </div>

            {/* Slider with phase markers */}
            <div className="relative">
              <input type="range" min={-50} max={150} value={temp} onChange={e => setTemp(Number(e.target.value))}
                className="w-full h-3 rounded-full cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${((temp + 50) / 200) * 100}%, #334155 ${((temp + 50) / 200) * 100}%, #334155 100%)`
                }}
              />
              {/* Markers */}
              <div className="relative mt-2">
                {PHASE_TRANSITIONS.map(pt => (
                  <div key={pt.temp} className="absolute flex flex-col items-center" style={{ left: `${((pt.temp + 50) / 200) * 100}%`, transform: 'translateX(-50%)' }}>
                    <div className="w-0.5 h-2 bg-slate-600" />
                    <span className={`text-[10px] font-bold ${pt.color} whitespace-nowrap`}>{pt.temp}°C</span>
                    <span className="text-[9px] text-slate-500 whitespace-nowrap">{pt.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 mt-6 font-bold">
              <span>-50°C (Rất lạnh)</span>
              <span>150°C (Rất nóng)</span>
            </div>

            {/* Quick temp buttons */}
            <div className="flex gap-2 mt-4">
              {[{ t: -30, label: '🧊 Băng', color: 'text-blue-400' }, { t: 25, label: '💧 Nước', color: 'text-emerald-400' }, { t: 120, label: '💨 Hơi', color: 'text-amber-400' }].map(q => (
                <button key={q.t} onClick={() => setTemp(q.t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${temp === q.t ? 'bg-slate-700 border-slate-600' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'} ${q.color}`}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="relative rounded-3xl overflow-hidden border-2 shadow-2xl" style={{ borderColor: phaseInfo.color + '60' }}>
            <div className="absolute top-3 left-3 z-10 text-[10px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1">
              <Atom className="w-3 h-3" /> Mức độ phân tử
            </div>
            <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={340} height={280} className="block bg-slate-950" />
          </div>
        </div>

        {/* RIGHT: Info panel */}
        <div className="w-full lg:w-80 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Trạng thái hiện tại</h3>
            <div className={`p-5 rounded-2xl bg-linear-to-br ${phaseInfo.bg} border border-slate-700`}>
              <div className="text-5xl mb-3 text-center">{phaseInfo.icon}</div>
              <h4 className="text-base font-black text-white text-center mb-2">{phaseInfo.label}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{phaseInfo.desc}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Các quá trình chuyển thể</h3>
            <div className="space-y-2">
              {[
                { from: '🧊', to: '💧', name: 'Nóng chảy', temp: 0, dir: '→', color: 'text-blue-300' },
                { from: '💧', to: '🧊', name: 'Đông đặc', temp: 0, dir: '←', color: 'text-blue-300' },
                { from: '💧', to: '💨', name: 'Bay hơi', temp: 100, dir: '→', color: 'text-amber-300' },
                { from: '💨', to: '💧', name: 'Ngưng tụ', temp: 100, dir: '←', color: 'text-amber-300' },
                { from: '🧊', to: '💨', name: 'Thăng hoa', temp: -78, dir: '↗', color: 'text-purple-300' },
              ].map(t => (
                <div key={t.name} className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-xl">
                  <span className="text-lg">{t.from}</span>
                  <span className="text-slate-500">{t.dir}</span>
                  <span className="text-lg">{t.to}</span>
                  <div className="ml-auto text-right">
                    <p className={`text-xs font-bold ${t.color}`}>{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.temp}°C</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-2xl p-4 mt-auto">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200 leading-relaxed">
                <strong className="text-indigo-300">Mẹo:</strong> Kéo thanh nhiệt độ qua ngưỡng 0°C và 100°C để quan sát sự thay đổi trạng thái của các hạt phân tử!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
