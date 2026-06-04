import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, AlertTriangle, Droplet, Wind, Info, Activity, MousePointerClick } from 'lucide-react';

const CELLS = [
  // Top region
  { id: 1, cx: 100, cy: 100 }, { id: 2, cx: 220, cy: 80 }, { id: 3, cx: 400, cy: 90 }, { id: 4, cx: 550, cy: 70 }, { id: 5, cx: 700, cy: 100 },
  // Upper mid
  { id: 6, cx: 120, cy: 220 }, { id: 7, cx: 580, cy: 180 }, { id: 8, cx: 720, cy: 250 },
  // Lower mid
  { id: 9, cx: 80, cy: 550 }, { id: 10, cx: 250, cy: 450 }, { id: 11, cx: 550, cy: 400 }, { id: 12, cx: 700, cy: 480 },
  // Bottom region
  { id: 13, cx: 150, cy: 700 }, { id: 14, cx: 300, cy: 720 }, { id: 15, cx: 450, cy: 700 }, { id: 16, cx: 600, cy: 720 }, { id: 17, cx: 750, cy: 700 },
  // Scattered
  { id: 18, cx: 350, cy: 350 }, { id: 19, cx: 50, cy: 400 }, { id: 20, cx: 750, cy: 580 }
];

const INFO_DATA: Record<string, any> = {
  capillary: {
    title: "Mao mạch máu",
    desc: "Mạng lưới mạch máu nhỏ nhất. Máu gồm huyết tương và các tế bào máu. Đây là nơi diễn ra sự trao đổi O2 và dinh dưỡng với dịch mô.",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30"
  },
  lymph: {
    title: "Mao mạch bạch huyết",
    desc: "Hệ thống ống mù (một đầu kín) nằm xen kẽ giữa các tế bào. Giúp thu gom dịch mô dư thừa, protein kích thước lớn và mầm bệnh để lọc qua hạch bạch huyết.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30"
  },
  cell: {
    title: "Tế bào mô",
    desc: "Đơn vị cấu tạo nên cơ thể. Tế bào liên tục nhận O2 và dinh dưỡng từ dịch mô, đồng thời thải CO2 và chất thải ra ngoài.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30"
  },
  fluid: {
    title: "Dịch mô (Nước mô)",
    desc: "Là môi trường trung gian bao quanh tế bào. Huyết tương thẩm thấu qua thành mạch máu tạo thành dịch mô, giúp tế bào trao đổi chất với máu.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30"
  }
};

const BLOOD_MAIN = "M-50,200 C150,150 300,300 450,250 C600,200 750,350 900,300";
const BLOOD_BRANCH = "M450,250 C500,450 400,650 450,850";
const LYMPH_BRANCH_1 = "M200,550 C250,500 350,550 450,500";
const LYMPH_BRANCH_2 = "M550,350 C500,400 450,480 450,500";
const LYMPH_EXIT = "M450,500 C550,600 700,700 850,750";

export function InternalEnvironmentSimulation({ onBack }: { onBack: () => void }) {
  const [bloodPressure, setBloodPressure] = useState(40); // 20 to 100
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Derived states
  const edemaLevel = Math.max(0, (bloodPressure - 60) / 40); // 0 to 1
  const flowSpeed = 2 - (bloodPressure / 100) * 1.5; // 2s down to 0.5s

  const particlesO2 = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const cell = CELLS[i % CELLS.length];
      const bx = cell.cx + (cell.cx < 450 ? 60 : -60);
      const by = cell.cy + (cell.cy < 450 ? 60 : -60);
      return { id: `o2-${i}`, start: { x: bx, y: by }, mid: { x: (bx + cell.cx)/2, y: (by + cell.cy)/2 }, end: { x: cell.cx, y: cell.cy }, delay: Math.random() * 2 };
    });
  }, []);

  const particlesCO2 = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const cell = CELLS[i % CELLS.length];
      const ex = cell.cx + (cell.cx < 450 ? -80 : 80);
      const ey = cell.cy + (cell.cy < 450 ? -80 : 80);
      return { id: `co2-${i}`, start: { x: cell.cx, y: cell.cy }, mid: { x: (cell.cx + ex)/2, y: (cell.cy + ey)/2 }, end: { x: ex, y: ey }, delay: Math.random() * 2 };
    });
  }, []);

  const redBloodCells = React.useMemo(() => [
    ...Array.from({ length: 12 }).map((_, i) => ({ id: `rbc-m-${i}`, path: BLOOD_MAIN, delay: Math.random() * 5 })),
    ...Array.from({ length: 8 }).map((_, i) => ({ id: `rbc-b-${i}`, path: BLOOD_BRANCH, delay: Math.random() * 5 })),
  ], []);
  const whiteBloodCells = React.useMemo(() => [
    ...Array.from({ length: 6 }).map((_, i) => ({ id: `wbc1-${i}`, path: `${LYMPH_BRANCH_1} ${LYMPH_EXIT}`, delay: Math.random() * 6 })),
    ...Array.from({ length: 6 }).map((_, i) => ({ id: `wbc2-${i}`, path: `${LYMPH_BRANCH_2} ${LYMPH_EXIT}`, delay: Math.random() * 6 })),
  ], []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="w-full h-screen bg-khtn8-pastel flex font-sans text-slate-800 overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center bg-transparent">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="relative w-[700px] h-[700px] rounded-full overflow-hidden shadow-xl border-8 border-white bg-[#e0f2fe] transition-colors duration-700"
             style={{ backgroundColor: `rgba(224, 242, 254, ${1 - edemaLevel*0.5})` }}
             onClick={() => setSelectedPart('fluid')}
             onMouseMove={handleMouseMove}
             onMouseEnter={() => setHoveredPart('fluid')}
             onMouseLeave={() => setHoveredPart(null)}
         >
          <svg viewBox="0 0 800 800" className="w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Lymphatic Capillary (Yellow) - Blind Ended */}
            <g opacity="0.8">
              <path d={`${LYMPH_BRANCH_1} ${LYMPH_EXIT}`} stroke="#fcd34d" strokeWidth="45" fill="none" strokeLinecap="round" />
              <path d={`${LYMPH_BRANCH_2} ${LYMPH_EXIT}`} stroke="#fcd34d" strokeWidth="45" fill="none" strokeLinecap="round" />
              {/* Visual markers for closed ends */}
              <circle cx="200" cy="550" r="22.5" fill="#fcd34d" />
              <circle cx="550" cy="350" r="22.5" fill="#fcd34d" />
            </g>
            
            {/* White Blood Cells (Lymphocytes) moving one-way from tips to exit */}
            {whiteBloodCells.map(wbc => (
              <motion.circle
                key={wbc.id} r="8" fill="#f8fafc"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: flowSpeed * 10, repeat: Infinity, ease: "linear", delay: wbc.delay }}
                style={{ offsetPath: `path('${wbc.path}')` }}
              />
            ))}

            <path 
              d={`${LYMPH_BRANCH_1} ${LYMPH_BRANCH_2} ${LYMPH_EXIT}`} stroke="transparent" strokeWidth="80" fill="none" className="cursor-pointer" 
              onClick={(e) => { e.stopPropagation(); setSelectedPart('lymph'); }} 
              onMouseEnter={() => setHoveredPart('lymph')}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Blood Capillary (Red) */}
            <g opacity="0.8">
              <path d={BLOOD_MAIN} stroke="#ef4444" strokeWidth="60" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={BLOOD_BRANCH} stroke="#ef4444" strokeWidth="60" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            
            {/* Red Blood Cells moving along path */}
            {redBloodCells.map(rbc => (
              <motion.circle
                key={rbc.id} r="12" fill="#991b1b"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: flowSpeed * 4, repeat: Infinity, ease: "linear", delay: rbc.delay }}
                style={{ offsetPath: `path('${rbc.path}')` }}
              />
            ))}

            <path 
              d={`${BLOOD_MAIN} ${BLOOD_BRANCH}`} stroke="transparent" strokeWidth="90" fill="none" className="cursor-pointer" 
              onClick={(e) => { e.stopPropagation(); setSelectedPart('capillary'); }} 
              onMouseEnter={() => setHoveredPart('capillary')}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Cells */}
            {CELLS.map(cell => (
              <motion.g 
                key={cell.id}
                animate={{ 
                  scale: [1 - edemaLevel*0.15, 1.05 - edemaLevel*0.15, 1 - edemaLevel*0.15]
                }}
                transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                onClick={(e: any) => { e.stopPropagation(); setSelectedPart('cell'); }}
                onMouseEnter={() => setHoveredPart('cell')}
                onMouseLeave={() => setHoveredPart(null)}
                className="cursor-pointer"
              >
                <circle cx={cell.cx} cy={cell.cy} r="35" fill="#fbcfe8" stroke="#f472b6" strokeWidth="3" />
                <circle cx={cell.cx} cy={cell.cy} r="10" fill="#db2777" opacity="0.8" />
              </motion.g>
            ))}

            {/* O2 / Nutrients (Green) */}
            {particlesO2.map(p => (
              <motion.circle
                key={p.id} r="3" fill="#22c55e" filter="url(#glow)"
                animate={{
                  cx: [p.start.x, p.mid.x, p.end.x],
                  cy: [p.start.y, p.mid.y, p.end.y],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: flowSpeed * 2, repeat: Infinity, delay: p.delay, ease: "linear" }}
              />
            ))}

            {/* CO2 / Waste (Gray) */}
            {particlesCO2.map(p => (
              <motion.circle
                key={p.id} r="3" fill="#64748b"
                animate={{
                  cx: [p.start.x, p.mid.x, p.end.x],
                  cy: [p.start.y, p.mid.y, p.end.y],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: flowSpeed * 2.5, repeat: Infinity, delay: p.delay, ease: "linear" }}
              />
            ))}
          </svg>

          {/* Hover Tooltip */}
          <AnimatePresence>
            {hoveredPart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute pointer-events-none z-50 px-3 py-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-md text-slate-800 text-sm font-bold whitespace-nowrap"
                style={{ 
                  left: mousePos.x + 15, 
                  top: mousePos.y - 35 
                }}
              >
                {INFO_DATA[hoveredPart].title}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edema warning overlay */}
          <AnimatePresence>
            {edemaLevel > 0.5 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-500/20 pointer-events-none mix-blend-overlay"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Back button */}
        <button onClick={onBack} className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-md backdrop-blur-md transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>

      </div>

      {/* Control Panel (Right) */}
      <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 relative text-slate-800">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-cyan-500" />
            <h1 className="text-2xl font-black text-slate-800 tracking-wide uppercase font-heading">Môi trường trong</h1>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Mô phỏng sự trao đổi chất giữa máu, dịch mô và tế bào. Tương tác với hình vẽ để xem chi tiết.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
          
          {/* Blood Pressure Control */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-800 font-extrabold flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" /> Huyết áp mao mạch
              </h3>
              <span className="font-mono text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg font-black border border-cyan-200">{bloodPressure} mmHg</span>
            </div>
            
            <input 
              type="range" min="20" max="100" 
              value={bloodPressure} onChange={(e) => setBloodPressure(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            
            <div className="flex justify-between text-xs text-slate-400 mt-3 font-black uppercase tracking-wider">
              <span>Thấp</span>
              <span>Chuẩn</span>
              <span>Cao</span>
            </div>

            <AnimatePresence>
              {edemaLevel > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mt-6 p-4 bg-orange-50/50 border border-orange-200 rounded-xl overflow-hidden shadow-xs"
                >
                  <div className="flex gap-3">
                    <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h4 className="text-orange-700 font-black mb-1">Cảnh báo Phù Nề</h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        Huyết áp cao làm dịch thẩm thấu ra ngoài mao mạch nhiều hơn lượng dịch thu hồi, gây ứ đọng dịch mô.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Panel */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              {selectedPart ? (
                <motion.div 
                  key={selectedPart}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`p-6 rounded-2xl border bg-white shadow-xs ${INFO_DATA[selectedPart].border}`}
                >
                  <h3 className={`text-xl font-black mb-3 flex items-center gap-2 ${INFO_DATA[selectedPart].color}`}>
                    <Info className="w-5 h-5" /> {INFO_DATA[selectedPart].title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {INFO_DATA[selectedPart].desc}
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-white/50"
                >
                  <MousePointerClick className="w-10 h-10 mb-3 opacity-50" />
                  <p className="font-semibold text-sm">Click vào các thành phần trên hình (Mao mạch máu, Tế bào, Dịch mô...) để xem giải thích chi tiết.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_100px_rgba(34,197,94,0.8)]"></div>
              <span className="text-sm text-slate-600 font-semibold">O2 & Dinh dưỡng</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-3 h-3 rounded-full bg-slate-500 shadow-[0_0_100px_rgba(100,116,139,0.8)]"></div>
              <span className="text-sm text-slate-600 font-semibold">CO2 & Chất thải</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-white">
          <button 
            onClick={() => setBloodPressure(40)}
            className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Reset Cân Bằng (Homeostasis)
          </button>
        </div>
      </div>
    </div>
  );
}
