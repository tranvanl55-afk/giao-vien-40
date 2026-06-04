import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Info, RotateCcw } from 'lucide-react';

interface ElementInfo {
  name: string;
  symbol: string;
  number: number;
  mass: number;
  category: string;
  description: string;
  uses: string;
}

const ELEMENT_MAP: Record<number, ElementInfo> = {
  1: { name: 'Hydro', symbol: 'H', number: 1, mass: 1, category: 'Phi kim', description: 'Nguyên tố nhẹ nhất vũ trụ, chiếm 75% khối lượng bình thường trong vũ trụ.', uses: 'Nhiên liệu tên lửa, điện phân nước, phân bón.' },
  2: { name: 'Heli', symbol: 'He', number: 2, mass: 4, category: 'Khí hiếm', description: 'Khí nhẹ thứ hai, trơ về mặt hóa học, không cháy.', uses: 'Bơm khinh khí cầu, làm lạnh MRI, hàn hồ quang.' },
  3: { name: 'Liti', symbol: 'Li', number: 3, mass: 7, category: 'Kim loại kiềm', description: 'Kim loại mềm nhất và nhẹ nhất, rất hoạt động.', uses: 'Pin Lithium-ion, thuốc điều trị tâm thần.' },
  4: { name: 'Beri', symbol: 'Be', number: 4, mass: 9, category: 'Kim loại kiềm thổ', description: 'Kim loại cứng, nhẹ, độc tính cao.', uses: 'Hợp kim hàng không, cửa sổ tia X.' },
  5: { name: 'Bo', symbol: 'B', number: 5, mass: 11, category: 'Á kim', description: 'Á kim cứng với nhiều dạng thù hình thú vị.', uses: 'Thủy tinh chịu nhiệt (Pyrex), thuốc trừ sâu, chất bán dẫn.' },
  6: { name: 'Carbon', symbol: 'C', number: 6, mass: 12, category: 'Phi kim', description: 'Nền tảng của sự sống, tồn tại dạng kim cương, than chì, fullerene.', uses: 'Sợi carbon, than hoạt tính, bút chì.' },
  7: { name: 'Nitơ', symbol: 'N', number: 7, mass: 14, category: 'Phi kim', description: 'Chiếm 78% không khí Trái Đất, là thành phần của axit amin.', uses: 'Phân bón, đạm, nitơ lỏng làm lạnh.' },
  8: { name: 'Oxy', symbol: 'O', number: 8, mass: 16, category: 'Phi kim', description: 'Cần thiết cho sự hô hấp và đốt cháy, chiếm 21% không khí.', uses: 'Hô hấp, luyện thép, xử lý nước.' },
  9: { name: 'Flo', symbol: 'F', number: 9, mass: 19, category: 'Phi kim', description: 'Phi kim hoạt động nhất trong bảng tuần hoàn.', uses: 'Kem đánh răng, chất chống dính Teflon.' },
  10: { name: 'Neon', symbol: 'Ne', number: 10, mass: 20, category: 'Khí hiếm', description: 'Khí hiếm phát sáng màu đỏ cam khi phóng điện.', uses: 'Đèn neon quảng cáo, laser.' },
};

const SHELL_CAPACITY = [2, 8, 8, 18];

export function KienTaoNguyenTuSimulation({ onBack }: { onBack: () => void }) {
  const [protonCount, setProtonCount] = useState(0);
  const [neutronCount, setNeutronCount] = useState(0);
  const [electronCount, setElectronCount] = useState(0);
  const [autoElectron, setAutoElectron] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const elementInfo = ELEMENT_MAP[protonCount];

  const actualElectrons = autoElectron ? protonCount : electronCount;

  // Compute electron shell distribution
  const getElectronShells = (total: number): number[] => {
    const shells: number[] = [];
    let remaining = total;
    for (let i = 0; i < SHELL_CAPACITY.length && remaining > 0; i++) {
      const inShell = Math.min(remaining, SHELL_CAPACITY[i]);
      shells.push(inShell);
      remaining -= inShell;
    }
    return shells;
  };

  const shells = getElectronShells(actualElectrons);

  // Draw atom on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d')!;
    const cx = W / 2;
    const cy = H / 2;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, W, H);

      // Nucleus glow
      const nucleusR = Math.max(14, Math.min(32, 10 + protonCount * 2));
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucleusR * 2.5);
      glow.addColorStop(0, 'rgba(251,146,60,0.5)');
      glow.addColorStop(1, 'rgba(251,146,60,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - nucleusR * 3, cy - nucleusR * 3, nucleusR * 6, nucleusR * 6);

      // Draw protons and neutrons in nucleus (simplified)
      const nucleonPositions: { x: number; y: number; type: 'p' | 'n' }[] = [];
      const totalNucleons = protonCount + neutronCount;
      for (let i = 0; i < totalNucleons; i++) {
        const angle = (i / totalNucleons) * Math.PI * 2;
        const r = totalNucleons > 1 ? Math.min(nucleusR * 0.5, 6) * (totalNucleons > 4 ? 1.5 : 1) : 0;
        nucleonPositions.push({
          x: cx + Math.cos(angle) * r * (totalNucleons > 8 ? 2 : 1) + (Math.random() - 0.5) * 0.5,
          y: cy + Math.sin(angle) * r * (totalNucleons > 8 ? 2 : 1) + (Math.random() - 0.5) * 0.5,
          type: i < protonCount ? 'p' : 'n',
        });
      }

      nucleonPositions.forEach(({ x, y, type }) => {
        // p⁺ = đỏ, n⁰ = xanh lam — larger and clearer
        const nR = Math.max(5, Math.min(9, nucleusR / (Math.sqrt(totalNucleons) + 0.8)));
        const pColor = '#ef4444';
        const nColor = '#3b82f6';
        const col = type === 'p' ? pColor : nColor;
        const colLight = type === 'p' ? '#fca5a5' : '#93c5fd';
        // Glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, nR * 1.8);
        g.addColorStop(0, col + 'cc');
        g.addColorStop(1, col + '00');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, nR * 1.8, 0, Math.PI * 2);
        ctx.fill();
        // Particle
        ctx.beginPath();
        ctx.arc(x, y, nR, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = colLight;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Label
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.max(6, nR * 0.8)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(type === 'p' ? 'p' : 'n', x, y);
      });

      // Draw electron shells
      shells.forEach((count, shellIdx) => {
        const shellRadius = (shellIdx + 1) * (60 - Math.min(protonCount, 5) * 4);

        // Orbit ring
        ctx.beginPath();
        ctx.arc(cx, cy, shellRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(148,163,184,0.25)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Shell label
        ctx.fillStyle = 'rgba(251,191,36,0.7)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`n=${shellIdx + 1}`, cx + shellRadius + 5, cy);

        // Electrons on this shell — YELLOW, distinct from nucleons
        for (let e = 0; e < count; e++) {
          const baseAngle = (e / count) * Math.PI * 2;
          const animAngle = baseAngle + time * (0.8 / (shellIdx + 1)) * (shellIdx % 2 === 0 ? 1 : -1);
          const ex = cx + Math.cos(animAngle) * shellRadius;
          const ey = cy + Math.sin(animAngle) * shellRadius;

          // Electron glow — YELLOW
          const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 10);
          eg.addColorStop(0, 'rgba(251,191,36,0.75)');
          eg.addColorStop(1, 'rgba(251,191,36,0)');
          ctx.fillStyle = eg;
          ctx.beginPath();
          ctx.arc(ex, ey, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#facc15';
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // e⁻ label
          ctx.fillStyle = '#422006';
          ctx.font = 'bold 5px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('e', ex, ey);
        }
      });

      timeRef.current = time;
      animRef.current = requestAnimationFrame((t) => draw(t / 1000));
    };

    animRef.current = requestAnimationFrame((t) => draw(t / 1000));
    return () => cancelAnimationFrame(animRef.current);
  }, [protonCount, neutronCount, actualElectrons, shells]);

  const reset = () => { setProtonCount(0); setNeutronCount(0); setElectronCount(0); };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">⚛️ Kiến Tạo Nguyên Tử</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 7</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-xs font-bold cursor-pointer transition-all">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* LEFT: Controls */}
        <div className="w-full lg:w-72 bg-slate-900/80 border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">🔬 Thêm/bớt hạt nhân</h3>
            {[
              { label: 'Proton (p⁺)', key: 'p', count: protonCount, set: setProtonCount, color: '#ef4444', bg: 'bg-red-950/40 border-red-800/50', max: 10 },
              { label: 'Neutron (n⁰)', key: 'n', count: neutronCount, set: setNeutronCount, color: '#60a5fa', bg: 'bg-blue-950/40 border-blue-800/50', max: 12 },
            ].map(({ label, key, count, set, color, bg, max }) => (
              <div key={key} className={`rounded-2xl border p-3 mb-3 ${bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color }}>{label}</span>
                  <span className="text-xl font-black text-white">{count}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => set(Math.max(0, count - 1))} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-black text-xl cursor-pointer transition-all text-slate-200">−</button>
                  <button onClick={() => set(Math.min(max, count + 1))} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-black text-xl cursor-pointer transition-all" style={{ color }}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">⚡ Electron (e⁻)</h3>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={autoElectron} onChange={e => setAutoElectron(e.target.checked)} className="w-3 h-3" />
                <span className="text-[10px] text-slate-400 font-bold">Tự động</span>
              </label>
            </div>
            {!autoElectron && (
              <div className="rounded-2xl border border-amber-800/50 bg-amber-950/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-amber-400">Electron</span>
                  <span className="text-xl font-black text-white">{electronCount}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setElectronCount(Math.max(0, electronCount - 1))} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-black text-xl cursor-pointer transition-all">−</button>
                  <button onClick={() => setElectronCount(Math.min(18, electronCount + 1))} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-black text-xl cursor-pointer transition-all text-amber-400">+</button>
                </div>
              </div>
            )}
            <div className="mt-3 flex flex-col gap-1">
              {shells.map((count, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 w-16">Lớp {i + 1}:</span>
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: count }).map((_, j) => (
                      <div key={j} className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-300 shadow-[0_0_4px_rgba(250,204,21,0.6)]" />
                    ))}
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-yellow-400">{count}e⁻</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">⚡ Chọn nhanh nguyên tố</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(ELEMENT_MAP).slice(0, 9).map(([num, el]) => (
                <button key={num} onClick={() => { setProtonCount(Number(num)); setNeutronCount(Math.round(el.mass - Number(num))); if (!autoElectron) setElectronCount(Number(num)); }}
                  className={`py-2 rounded-xl text-[11px] font-bold cursor-pointer border transition-all ${protonCount === Number(num) ? 'bg-indigo-700 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300'}`}>
                  <div className="text-base">{el.symbol}</div>
                  <div className="text-[9px] text-slate-400">{el.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
          {protonCount === 0 ? (
            <div className="text-center">
              <div className="text-6xl mb-4">⚛️</div>
              <p className="text-slate-400 font-bold">Thêm Proton để bắt đầu xây dựng nguyên tử!</p>
            </div>
          ) : (
            <>
              {elementInfo && (
                <div className="text-center">
                  <div className="text-4xl font-black text-white">{elementInfo.symbol}</div>
                  <div className="text-sm text-slate-400">{elementInfo.name} • Z={protonCount} • A={protonCount + neutronCount}</div>
                </div>
              )}
              <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={460} height={460} className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl max-w-full" />
              <div className="flex gap-4 text-[11px] text-center flex-wrap justify-center">
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]" /><span className="text-slate-200 font-bold">Proton (p⁺)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_6px_2px_rgba(59,130,246,0.5)]" /><span className="text-slate-200 font-bold">Neutron (n⁰)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_6px_2px_rgba(250,204,21,0.5)]" /><span className="text-slate-200 font-bold">Electron (e⁻)</span></div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Element info */}
        <div className="w-full lg:w-72 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col gap-4">
          {elementInfo ? (
            <>
              <div className="bg-linear-to-br from-indigo-900/40 to-purple-900/30 rounded-2xl border border-indigo-800/50 p-5 text-center">
                <div className="text-6xl font-black text-white">{elementInfo.symbol}</div>
                <div className="text-xl font-bold text-indigo-300 mt-1">{elementInfo.name}</div>
                <div className="text-xs text-slate-400 mt-1">{elementInfo.category}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Số nguyên tử (Z)', value: protonCount, color: 'text-red-400' },
                  { label: 'Số khối (A)', value: protonCount + neutronCount, color: 'text-blue-400' },
                  { label: 'Proton', value: protonCount, color: 'text-red-400' },
                  { label: 'Neutron', value: neutronCount, color: 'text-blue-400' },
                  { label: 'Electron', value: actualElectrons, color: 'text-amber-400' },
                  { label: 'Số lớp e⁻', value: shells.length, color: 'text-emerald-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-800/60 rounded-xl p-2">
                    <p className="text-slate-400 text-[10px]">{label}</p>
                    <p className={`font-black text-base ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800/40 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 leading-relaxed">{elementInfo.description}</p>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-3">
                <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Ứng dụng</p>
                <p className="text-[11px] text-emerald-200">{elementInfo.uses}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="text-5xl">🔬</div>
              <p className="text-slate-400 text-sm">Xây dựng nguyên tử để xem thông tin nguyên tố</p>
              <div className="bg-indigo-950/30 rounded-2xl p-4 border border-indigo-800/40">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-indigo-200">Số proton xác định nguyên tố hóa học! Thêm proton để khám phá từng nguyên tố.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
