import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, FlaskConical, Magnet, Filter, Droplets, Info, Star } from 'lucide-react';

interface Mixture {
  id: string;
  name: string;
  emoji: string;
  components: string[];
  correctTool: string;
  explanation: string;
  color: string;
}

interface Tool {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const MIXTURES: Mixture[] = [
  {
    id: 'sand-water',
    name: 'Cát & Nước',
    emoji: '🏖️',
    components: ['Cát', 'Nước'],
    correctTool: 'filter',
    explanation: 'Cát không tan trong nước, có thể dùng giấy lọc để giữ cát lại và cho nước chảy qua.',
    color: 'from-amber-600 to-yellow-500',
  },
  {
    id: 'oil-water',
    name: 'Dầu ăn & Nước',
    emoji: '🫗',
    components: ['Dầu ăn', 'Nước'],
    correctTool: 'separatory',
    explanation: 'Dầu và nước không tan vào nhau (không đồng nhất). Phễu chiết tận dụng sự chênh lệch khối lượng riêng để tách ra.',
    color: 'from-yellow-500 to-orange-400',
  },
  {
    id: 'iron-sand',
    name: 'Mạt sắt & Cát',
    emoji: '🧲',
    components: ['Mạt sắt', 'Cát'],
    correctTool: 'magnet',
    explanation: 'Sắt có tính nhiễm từ, nam châm hút mạt sắt ra khỏi hỗn hợp mà không ảnh hưởng đến cát.',
    color: 'from-slate-600 to-gray-500',
  },
  {
    id: 'salt-water',
    name: 'Muối & Nước',
    emoji: '🧂',
    components: ['Muối ăn', 'Nước'],
    correctTool: 'evaporation',
    explanation: 'Muối tan hoàn toàn trong nước. Cần bay hơi nước bằng nhiệt để thu lại muối kết tinh.',
    color: 'from-cyan-600 to-blue-500',
  },
];

const TOOLS: Tool[] = [
  { id: 'filter', name: 'Giấy lọc', emoji: '🗂️', description: 'Giữ lại chất rắn không tan, cho chất lỏng chảy qua' },
  { id: 'separatory', name: 'Phễu chiết', emoji: '⚗️', description: 'Tách 2 chất lỏng không tan vào nhau có khối lượng riêng khác nhau' },
  { id: 'magnet', name: 'Nam châm', emoji: '🧲', description: 'Hút các vật liệu có tính nhiễm từ (sắt, niken, coban)' },
  { id: 'evaporation', name: 'Bay hơi', emoji: '🔥', description: 'Làm nóng để nước bay hơi, thu lại chất rắn tan trong nước' },
];

// Inline styles for animations
const SimulationStyles = () => (
  <style>{`
    @keyframes flowDash {
      to {
        stroke-dashoffset: -20;
      }
    }
    .animate-flow-dash {
      animation: flowDash 1s linear infinite;
    }
    @keyframes dripDash {
      to {
        stroke-dashoffset: -10;
      }
    }
    .animate-drip-dash {
      animation: dripDash 0.4s linear infinite;
    }
    @keyframes bubbleRise {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0;
      }
      50% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(-40px) scale(0.6);
        opacity: 0;
      }
    }
    .animate-bubble-rise {
      animation: bubbleRise 1.2s infinite ease-out;
    }
    @keyframes flameBurn {
      0% {
        transform: scale(0.92) skewX(-1.5deg);
      }
      100% {
        transform: scale(1.08) skewX(1.5deg);
      }
    }
    .animate-flame-outer {
      transform-origin: 200px 182px;
      animation: flameBurn 0.15s infinite alternate ease-in-out;
    }
    .animate-flame-inner {
      transform-origin: 200px 182px;
      animation: flameBurn 0.1s infinite alternate-reverse ease-in-out;
    }
  `}</style>
);

function FiltrationSim({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isPouring, setIsPouring] = useState(false);

  useEffect(() => {
    if (!isPouring) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 70);
    return () => clearInterval(interval);
  }, [isPouring, onComplete]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-2xl">
      <SimulationStyles />
      <div className="text-center">
        <h3 className="font-black text-sm md:text-base text-white">Thí Nghiệm Lọc Cát Và Nước</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Cát không tan sẽ được giữ lại trên giấy lọc, nước sạch chảy xuống cốc</p>
      </div>

      <div className="relative w-full h-64 bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* Support Stand */}
          <line x1="140" y1="120" x2="140" y2="280" stroke="#475569" strokeWidth="6" />
          <line x1="140" y1="280" x2="110" y2="295" stroke="#334155" strokeWidth="6" />
          <line x1="140" y1="280" x2="170" y2="295" stroke="#334155" strokeWidth="6" />
          <line x1="120" y1="130" x2="260" y2="130" stroke="#475569" strokeWidth="4" />
          
          {/* Bottom Beaker */}
          <rect x="160" y="195" width="80" height="85" rx="5" fill="none" stroke="#cbd5e1" strokeWidth="3" />
          
          {/* Water level in bottom beaker */}
          {progress > 0 && (
            <rect 
              x="163" 
              y={277 - (progress / 100) * 70} 
              width="74" 
              height={(progress / 100) * 70} 
              rx="2" 
              fill="#3b82f6" 
              opacity="0.8" 
            />
          )}

          {/* Drips from funnel stem */}
          {isPouring && progress < 100 && (
            <>
              <circle cx="200" cy={175 + ((progress * 7) % 20)} r="3" fill="#3b82f6" />
              <circle cx="200" cy={183 + ((progress * 7 + 10) % 20)} r="2" fill="#3b82f6" />
            </>
          )}

          {/* Funnel */}
          <polygon points="170,100 230,100 205,145 205,175 195,175 195,145" fill="none" stroke="#cbd5e1" strokeWidth="3" />
          
          {/* Filter paper inside funnel */}
          <polygon points="174,103 226,103 200,140" fill="#f8fafc" opacity="0.95" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Liquid level in funnel */}
          {isPouring && progress < 100 && (
            <polygon 
              points={`${185 + (100 - progress) * 0.15},120 ${215 - (100 - progress) * 0.15},120 200,140`} 
              fill="#78350f" 
              opacity="0.6" 
            />
          )}
          
          {/* Accumulated sand in filter paper */}
          {progress > 0 && (
            <path 
              d={`M 190 130 Q 200 ${130 + (progress / 100) * 10} 210 130 Z`} 
              fill="#78350f" 
              opacity={progress / 100} 
            />
          )}

          {/* Pouring Beaker (tilting animation) */}
          <g 
            transform={`translate(90, 65) rotate(${isPouring ? Math.min(42, (progress / 8) * 8) : 0} 50 40)`}
            className="transition-transform duration-500 ease-out"
          >
            <rect x="10" y="10" width="50" height="70" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="3" />
            {progress < 100 && (
              <path 
                d={`M 12 ${30 + (progress / 100) * 48} L 58 ${30 + (progress / 100) * 48} L 58 78 L 12 78 Z`} 
                fill="#78350f" 
                opacity="0.8" 
              />
            )}
          </g>

          {/* Liquid Stream pouring down */}
          {isPouring && progress < 98 && (
            <path 
              d="M 115 60 Q 145 70 195 110" 
              fill="none" 
              stroke="#78350f" 
              strokeWidth="4" 
              strokeDasharray="4 2" 
              className="animate-flow-dash"
            />
          )}
        </svg>

        <div className="absolute bottom-3 right-3 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-cyan-400">
          Tiến trình: {progress}%
        </div>
      </div>

      <div className="w-full flex gap-3">
        {!isPouring ? (
          <button 
            onClick={() => setIsPouring(true)} 
            className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Droplets className="w-4 h-4" /> Bắt đầu lọc
          </button>
        ) : (
          <div className="flex-1 py-2.5 bg-slate-800 rounded-xl font-bold text-xs text-slate-400 text-center">
            {progress < 100 ? '💧 Đang lọc hỗn hợp...' : '✓ Đã lọc xong!'}
          </div>
        )}
      </div>
    </div>
  );
}

function SeparatoryFunnelSim({ onComplete, onFailure }: { onComplete: () => void; onFailure: () => void }) {
  const [valveOpen, setValveOpen] = useState(false);
  const [waterHeight, setWaterHeight] = useState(50);
  const [oilHeight, setOilHeight] = useState(50);
  const [beakerWater, setBeakerWater] = useState(0);
  const [beakerOil, setBeakerOil] = useState(0);
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('Mở khóa phễu chiết để bắt đầu tách nước ra khỏi dầu.');

  useEffect(() => {
    if (simStatus !== 'running' || !valveOpen) return;

    const interval = setInterval(() => {
      setWaterHeight(w => {
        if (w > 0.4) {
          setBeakerWater(bw => Math.min(50, bw + 0.4));
          return w - 0.4;
        } else {
          setOilHeight(oh => {
            if (oh > 0) {
              setBeakerOil(bo => Math.min(50, bo + 0.4));
              setFeedbackMsg('⚠️ NGUY HIỂM! Dầu đang bị chảy xuống cốc nước! Hãy khóa phễu chiết ngay!');
              return oh - 0.4;
            } else {
              clearInterval(interval);
              setValveOpen(false);
              setSimStatus('failed');
              setFeedbackMsg('❌ Thất bại! Toàn bộ dầu đã chảy xuống cốc nước.');
              onFailure();
              return 0;
            }
          });
          return 0;
        }
      });
    }, 40);

    return () => clearInterval(interval);
  }, [valveOpen, simStatus, onFailure]);

  const handleToggleValve = () => {
    if (simStatus === 'idle') {
      setSimStatus('running');
      setValveOpen(true);
      setFeedbackMsg('Đang chiết nước... Hãy quan sát kỹ và ĐÓNG khóa ngay khi lớp dầu màu vàng chạm vạch đáy.');
    } else if (simStatus === 'running') {
      if (valveOpen) {
        setValveOpen(false);
        if (waterHeight <= 2) {
          if (beakerOil < 1) {
            setSimStatus('success');
            setFeedbackMsg('🎉 Tách thành công! Lớp nước đã nằm trọn trong cốc, còn dầu được giữ lại ở phễu chiết.');
            onComplete();
          } else {
            setSimStatus('failed');
            setFeedbackMsg('❌ Thất bại! Dầu đã bị lẫn vào cốc nước.');
            onFailure();
          }
        } else {
          setFeedbackMsg('Chưa tách hết nước! Hãy mở lại khóa phễu chiết để tiếp tục.');
        }
      } else {
        setValveOpen(true);
        setFeedbackMsg('Đang tiếp tục chiết nước... Hãy sẵn sàng ĐÓNG khóa.');
      }
    }
  };

  const handleReset = () => {
    setValveOpen(false);
    setWaterHeight(50);
    setOilHeight(50);
    setBeakerWater(0);
    setBeakerOil(0);
    setSimStatus('idle');
    setFeedbackMsg('Mở khóa phễu chiết để bắt đầu tách nước ra khỏi dầu.');
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-2xl">
      <SimulationStyles />
      <div className="text-center">
        <h3 className="font-black text-sm md:text-base text-white">Thí Nghiệm Chiết Dầu Ăn & Nước</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Dầu nhẹ hơn nổi ở trên, nước nặng hơn ở dưới. Mở khóa để xả hết nước ra.</p>
      </div>

      <div className="relative w-full h-72 bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <svg viewBox="0 0 400 320" className="w-full h-full">
          {/* Stand support */}
          <line x1="140" y1="80" x2="140" y2="280" stroke="#475569" strokeWidth="6" />
          <line x1="140" y1="280" x2="110" y2="295" stroke="#334155" strokeWidth="6" />
          <line x1="140" y1="280" x2="170" y2="295" stroke="#334155" strokeWidth="6" />
          <line x1="120" y1="90" x2="220" y2="90" stroke="#475569" strokeWidth="4" />

          {/* Bottom Beaker */}
          <rect x="175" y="225" width="70" height="70" rx="4" fill="none" stroke="#cbd5e1" strokeWidth="3" />
          
          {/* Water in beaker */}
          {beakerWater > 0 && (
            <rect 
              x="178" 
              y={292 - (beakerWater / 50) * 55} 
              width="64" 
              height={(beakerWater / 50) * 55} 
              rx="2" 
              fill="#3b82f6" 
              opacity="0.8" 
            />
          )}

          {/* Oil in beaker */}
          {beakerOil > 0 && (
            <rect 
              x="178" 
              y={292 - (beakerWater / 50) * 55 - (beakerOil / 50) * 55} 
              width="64" 
              height={(beakerOil / 50) * 55} 
              rx="2" 
              fill="#eab308" 
              opacity="0.8" 
            />
          )}

          {/* Dripping stream */}
          {valveOpen && (
            <line 
              x1="210" 
              y1="195" 
              x2="210" 
              y2="225" 
              stroke={waterHeight > 0 ? "#3b82f6" : "#eab308"} 
              strokeWidth="3" 
              strokeDasharray="4 2" 
              className="animate-drip-dash" 
            />
          )}

          <defs>
            <clipPath id="funnel-inner">
              <path d="M 181.5 50 C 181.5 22, 238.5 22, 238.5 50 C 238.5 98, 223.5 118, 213.5 158 L 213.5 180 L 206.5 180 L 206.5 158 C 196.5 118, 181.5 98, 181.5 50 Z" />
            </clipPath>
          </defs>

          {/* Liquids inside funnel (Clipped to funnel-inner) */}
          <g clipPath="url(#funnel-inner)">
            {/* Water layer */}
            {waterHeight > 0 && (
              <rect 
                x="150" 
                y={180 - waterHeight} 
                width="100" 
                height={waterHeight} 
                fill="#3b82f6" 
                opacity="0.8" 
              />
            )}
            {/* Oil layer */}
            {oilHeight > 0 && (
              <rect 
                x="150" 
                y={180 - waterHeight - oilHeight} 
                width="100" 
                height={oilHeight} 
                fill="#eab308" 
                opacity="0.85" 
              />
            )}
          </g>

          {/* Separatory Funnel Glass Body */}
          <path 
            d="M 180 50 C 180 20, 240 20, 240 50 C 240 100, 225 120, 215 160 L 215 185 L 205 185 L 205 160 C 195 120, 180 100, 180 50 Z" 
            fill="none" 
            stroke="#cbd5e1" 
            strokeWidth="3" 
          />
          <rect x="202" y="15" width="16" height="8" rx="2" fill="#94a3b8" />

          {/* Valve */}
          <circle cx="210" cy="180" r="8" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
          <line 
            x1={valveOpen ? "210" : "200"} 
            y1={valveOpen ? "170" : "180"} 
            x2={valveOpen ? "210" : "220"} 
            y2={valveOpen ? "190" : "180"} 
            stroke="#ef4444" 
            strokeWidth="4" 
            strokeLinecap="round"
          />

          {/* Separation line */}
          <line x1="195" y1="165" x2="225" y2="165" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
          <text x="230" y="168" fill="#f43f5e" fontSize="7" fontWeight="black">VẠCH TÁCH</text>
        </svg>

        <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-slate-800 p-2 rounded-xl text-center">
          <p className="text-[10px] md:text-xs text-slate-300 font-medium leading-tight">{feedbackMsg}</p>
        </div>
      </div>

      <div className="w-full flex gap-3">
        {simStatus !== 'success' && simStatus !== 'failed' && (
          <button 
            onClick={handleToggleValve} 
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
              valveOpen 
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {valveOpen ? '🛑 Đóng Khóa Phễu' : simStatus === 'idle' ? '🔑 Mở Khóa Chiết' : '🔑 Tiếp Tục Mở Khóa'}
          </button>
        )}

        {(simStatus === 'success' || simStatus === 'failed') && (
          <button 
            onClick={handleReset} 
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2 text-slate-300"
          >
            <RotateCcw className="w-4 h-4" /> Làm lại
          </button>
        )}
      </div>
    </div>
  );
}

function MagnetSim({ onComplete }: { onComplete: () => void }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);

  const sandDots = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      x: 120 + Math.random() * 160,
      y: 200 + Math.random() * 40,
      size: 1.5 + Math.random() * 2,
    }));
  }, []);

  const ironDots = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      origX: 130 + Math.random() * 140,
      origY: 200 + Math.random() * 38,
      delay: Math.random() * 30,
      stickX: -20 + Math.random() * 40,
      stickY: 30 + Math.random() * 15,
    }));
  }, []);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return p + 1;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [isSimulating, onComplete]);

  let magnetX = 320;
  let magnetY = 50;
  if (progress > 0 && progress <= 30) {
    const ratio = progress / 30;
    magnetX = 320 - ratio * 120;
    magnetY = 50 + ratio * 80;
  } else if (progress > 30 && progress <= 70) {
    const sweepRatio = (progress - 30) / 40;
    magnetX = 200 + Math.sin(sweepRatio * Math.PI * 2) * 50;
    magnetY = 130;
  } else if (progress > 70) {
    const ratio = (progress - 70) / 30;
    magnetX = 200 + ratio * 120;
    magnetY = 130 - ratio * 80;
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="text-center">
        <h3 className="font-black text-sm md:text-base text-white">Thí Nghiệm Tách Mạt Sắt Bằng Nam Châm</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Sắt có tính nhiễm từ nên bị nam châm hút, còn cát thì không.</p>
      </div>

      <div className="relative w-full h-64 bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <svg viewBox="0 0 400 260" className="w-full h-full">
          {/* Glass Dish */}
          <path d="M 100 210 L 100 240 Q 100 250 110 250 L 290 250 Q 300 250 300 240 L 300 210" fill="none" stroke="#cbd5e1" strokeWidth="3" />
          <ellipse cx="200" cy="245" rx="98" ry="8" fill="#e2e8f0" opacity="0.1" />

          {/* Sand particles */}
          {sandDots.map((dot, idx) => (
            <circle key={`sand-${idx}`} cx={dot.x} cy={dot.y} r={dot.size} fill="#d97706" opacity="0.7" />
          ))}

          {/* Iron filings */}
          {ironDots.map((dot, idx) => {
            let cx = dot.origX;
            let cy = dot.origY;

            const triggerProgress = 30 + dot.delay;
            if (progress > triggerProgress) {
              if (progress <= 70) {
                const flyRatio = Math.min(1, (progress - triggerProgress) / 10);
                const targetX = magnetX + dot.stickX;
                const targetY = magnetY + dot.stickY;
                cx = dot.origX + (targetX - dot.origX) * flyRatio;
                cy = dot.origY + (targetY - dot.origY) * flyRatio;
              } else {
                cx = magnetX + dot.stickX;
                cy = magnetY + dot.stickY;
              }
            }

            return (
              <circle 
                key={`iron-${idx}`} 
                cx={cx} 
                cy={cy} 
                r="1.8" 
                fill="#475569" 
                stroke="#1e293b" 
                strokeWidth="0.5" 
              />
            );
          })}

          {/* Magnet */}
          <g transform={`translate(${magnetX}, ${magnetY})`}>
            <path 
              d="M -25 0 L -25 35 L -10 35 L -10 10 C -10 5, 10 5, 10 10 L 10 35 L 25 35 L 25 0 C 25 -20, -25 -20, -25 0 Z" 
              fill="#ef4444" 
            />
            <path d="M 10 20 L 25 20 L 25 35 L 10 35 Z" fill="#3b82f6" />
            <text x="14" y="32" fill="#ffffff" fontSize="9" fontWeight="bold">N</text>
            <text x="-21" y="32" fill="#ffffff" fontSize="9" fontWeight="bold">S</text>

            {isSimulating && progress > 25 && progress < 75 && (
              <g opacity="0.3" stroke="#cbd5e1" strokeWidth="1" fill="none">
                <path d="M -17 38 Q -17 50 17 38" className="animate-pulse" />
                <path d="M -22 38 Q -22 60 22 38" />
              </g>
            )}
          </g>
        </svg>

        <div className="absolute bottom-3 right-3 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-cyan-400">
          Thu gom sắt: {Math.max(0, Math.min(100, Math.round(((progress - 30) / 40) * 100)))}%
        </div>
      </div>

      <div className="w-full flex gap-3">
        {!isSimulating ? (
          <button 
            onClick={() => setIsSimulating(true)} 
            className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Magnet className="w-4 h-4" /> Bắt đầu hút sắt
          </button>
        ) : (
          <div className="flex-1 py-2.5 bg-slate-800 rounded-xl font-bold text-xs text-slate-400 text-center">
            {progress < 100 ? '🧲 Nam châm đang hút mạt sắt...' : '✓ Đã hút sạch sắt!'}
          </div>
        )}
      </div>
    </div>
  );
}

function EvaporationSim({ onComplete }: { onComplete: () => void }) {
  const [isHeating, setIsHeating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isHeating) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return p + 1;
      });
    }, 65);
    return () => clearInterval(interval);
  }, [isHeating, onComplete]);

  const boiling = isHeating && progress > 15 && progress < 100;
  const waterOpacity = Math.max(0, 0.8 - (progress / 100) * 0.8);
  const saltOpacity = Math.min(1, (progress - 25) / 65);

  const bubbles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      x: 140 + Math.random() * 120,
      y: 130 + Math.random() * 20,
      r: 1.5 + Math.random() * 2.5,
    }));
  }, []);

  const saltCrystals = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const x = 135 + Math.random() * 130;
      // Parabolic calculation matching the dish bottom curve (depth goes from 120 at sides to 153.75 at center)
      const bottomY = 153.75 - 33.75 * Math.pow((x - 200) / 80, 2);
      const y = bottomY - Math.random() * 5;
      return {
        x,
        y,
        size: 3 + Math.random() * 4,
        rotation: Math.random() * 360,
      };
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-2xl">
      <SimulationStyles />
      <div className="text-center">
        <h3 className="font-black text-sm md:text-base text-white">Thí Nghiệm Cô Cạn Nước Muối</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Đốt nóng để nước bay hơi hoàn toàn, để lại muối ăn dạng tinh thể.</p>
      </div>

      <div className="relative w-full h-64 bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <svg viewBox="0 0 400 260" className="w-full h-full">
          <defs>
            <clipPath id="dish-inner">
              <path d="M 121 120 C 121 163, 279 163, 279 120 Z" />
            </clipPath>
          </defs>

          {/* Tripod Stand */}
          <line x1="120" y1="160" x2="100" y2="250" stroke="#475569" strokeWidth="5" />
          <line x1="280" y1="160" x2="300" y2="250" stroke="#475569" strokeWidth="5" />
          <line x1="200" y1="160" x2="200" y2="250" stroke="#334155" strokeWidth="4" />
          <line x1="100" y1="160" x2="300" y2="160" stroke="#334155" strokeWidth="6" strokeDasharray="3 1" />

          {/* Bunsen Burner */}
          <path d="M 170 250 L 175 220 L 225 220 L 230 250 Z" fill="#64748b" stroke="#475569" strokeWidth="2" />
          <rect x="195" y="205" width="10" height="15" rx="1" fill="#94a3b8" />
          <line x1="200" y1="205" x2="200" y2="198" stroke="#1e293b" strokeWidth="4" />

          {/* Flame */}
          {isHeating && progress < 100 && (
            <path 
              d="M 200 156 C 185 182, 215 182, 200 156 Z" 
              fill="#f97316" 
              className="animate-flame-outer"
            />
          )}
          {isHeating && progress < 100 && (
            <path 
              d="M 200 164 C 190 182, 210 182, 200 164 Z" 
              fill="#facc15" 
              className="animate-flame-inner"
            />
          )}

          {/* Steam */}
          {boiling && (
            <g opacity="0.4" fill="none" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round">
              <path d="M 160 110 Q 155 90 165 70" className="animate-flow-dash" strokeDasharray="5 5" />
              <path d="M 200 100 Q 205 80 195 60" className="animate-flow-dash" strokeDasharray="6 4" />
              <path d="M 240 110 Q 235 90 245 70" className="animate-flow-dash" strokeDasharray="5 5" />
            </g>
          )}

          {/* Evaporating Dish Outline */}
          <path d="M 120 120 C 120 165, 280 165, 280 120 Z" fill="none" stroke="#cbd5e1" strokeWidth="4" />
          
          {/* Solution, bubbles, and salt (Clipped to dish boundary) */}
          <g clipPath="url(#dish-inner)">
            {/* Salt Solution */}
            {progress < 100 && (
              <path 
                d={`M ${122 + (progress / 100) * 15} ${123 + (progress / 100) * 22} 
                    C ${122 + (progress / 100) * 15} 162, 
                      ${278 - (progress / 100) * 15} 162, 
                      ${278 - (progress / 100) * 15} ${123 + (progress / 100) * 22} Z`}
                fill="#06b6d4" 
                opacity={waterOpacity} 
              />
            )}

            {/* Boiling bubbles */}
            {boiling && bubbles.map((bubble, idx) => (
              <circle 
                key={`bubble-${idx}`} 
                cx={bubble.x} 
                cy={bubble.y} 
                r={bubble.r} 
                fill="none" 
                stroke="#e0f7fa" 
                strokeWidth="0.8" 
                className="animate-bubble-rise"
                style={{ animationDelay: `${(idx * 0.1).toFixed(1)}s` }}
              />
            ))}

            {/* Crystallized Salt sitting on the curve */}
            {progress > 25 && (
              <g opacity={saltOpacity}>
                {saltCrystals.map((crystal, idx) => (
                  <rect 
                    key={`salt-${idx}`} 
                    x={crystal.x} 
                    y={crystal.y} 
                    width={crystal.size} 
                    height={crystal.size} 
                    transform={`rotate(${crystal.rotation} ${crystal.x} ${crystal.y})`}
                    fill="#ffffff" 
                    stroke="#cbd5e1" 
                    strokeWidth="0.5" 
                  />
                ))}
              </g>
            )}
          </g>
        </svg>

        <div className="absolute bottom-3 right-3 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-cyan-400">
          Nước bay hơi: {progress}%
        </div>
      </div>

      <div className="w-full flex gap-3">
        {!isHeating ? (
          <button 
            onClick={() => setIsHeating(true)} 
            className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <FlaskConical className="w-4 h-4" /> Bắt đầu cô cạn (Đốt đèn cồn)
          </button>
        ) : (
          <div className="flex-1 py-2.5 bg-slate-800 rounded-xl font-bold text-xs text-slate-400 text-center">
            {progress < 100 ? '🔥 Đang cô cạn dung dịch...' : '✓ Muối đã kết tinh!'}
          </div>
        )}
      </div>
    </div>
  );
}

export function TachHonHopSimulation({ onBack }: { onBack: () => void }) {
  const [currentMixtureIdx, setCurrentMixtureIdx] = useState(0);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [simFinished, setSimFinished] = useState(false);

  const currentMixture = MIXTURES[currentMixtureIdx];
  const currentTool = TOOLS.find(t => t.id === selectedTool);
  const allSolved = solvedIds.size === MIXTURES.length;

  const handleToolSelect = (toolId: string) => {
    if (feedback === 'correct') return;
    setSelectedTool(toolId);
    setShowExplanation(false);
    setFeedback(null);
  };

  const handleApply = () => {
    if (!selectedTool) return;
    if (selectedTool === currentMixture.correctTool) {
      setFeedback('correct');
      setSimFinished(false);
    } else {
      setFeedback('wrong');
    }
  };

  const handleSimComplete = () => {
    setSimFinished(true);
    setSolvedIds(prev => new Set([...prev, currentMixture.id]));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentMixtureIdx < MIXTURES.length - 1) {
      setCurrentMixtureIdx(i => i + 1);
    } else {
      setCurrentMixtureIdx(0);
    }
    setSelectedTool(null);
    setFeedback(null);
    setShowExplanation(false);
    setSimFinished(false);
  };

  const handleReset = () => {
    setCurrentMixtureIdx(0);
    setSelectedTool(null);
    setFeedback(null);
    setShowExplanation(false);
    setSolvedIds(new Set());
    setSimFinished(false);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm md:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-cyan-400" /> Phân Tách Hỗn Hợp
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 6</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {MIXTURES.map((m, i) => (
            <button key={m.id} onClick={() => { setCurrentMixtureIdx(i); setSelectedTool(null); setFeedback(null); setShowExplanation(false); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border transition-all cursor-pointer ${solvedIds.has(m.id) ? 'bg-emerald-500 border-emerald-400 text-white' : i === currentMixtureIdx ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              {solvedIds.has(m.id) ? '✓' : i + 1}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* LEFT: Mixture display or Active Simulation */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 gap-8">
          {allSolved ? (
            <div className="text-center animate-in zoom-in-95 duration-700">
              <div className="text-8xl mb-4 animate-bounce">🏆</div>
              <h2 className="text-3xl font-black text-white mb-2">Hoàn thành xuất sắc!</h2>
              <p className="text-slate-400 mb-6">Bạn đã nắm vững các phương pháp tách hỗn hợp!</p>
              <div className="flex gap-2 flex-wrap justify-center mb-6">
                {Array.from({length: solvedIds.size}).map((_, i) => <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />)}
              </div>
              <button onClick={handleReset} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-bold text-white transition-all cursor-pointer flex items-center gap-2 mx-auto">
                <RotateCcw className="w-4 h-4" /> Chơi lại
              </button>
            </div>
          ) : feedback === 'correct' ? (
            <div className="w-full flex flex-col items-center gap-6 max-w-md">
              {currentMixture.id === 'sand-water' && <FiltrationSim onComplete={handleSimComplete} />}
              {currentMixture.id === 'oil-water' && (
                <SeparatoryFunnelSim 
                  onComplete={handleSimComplete} 
                  onFailure={() => {}} 
                />
              )}
              {currentMixture.id === 'iron-sand' && <MagnetSim onComplete={handleSimComplete} />}
              {currentMixture.id === 'salt-water' && <EvaporationSim onComplete={handleSimComplete} />}

              {simFinished && (
                <div className="w-full animate-in fade-in duration-500">
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 border border-emerald-800/50 px-4 py-3 rounded-2xl mb-3">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold">Thí nghiệm tách thành công!</span>
                  </div>
                  {showExplanation && (
                    <div className="bg-blue-950/40 border border-blue-800/50 rounded-2xl p-4 mt-2">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-200 leading-relaxed">{currentMixture.explanation}</p>
                      </div>
                    </div>
                  )}
                  <button onClick={handleNext} className="w-full mt-4 py-3 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl font-bold text-white transition-all cursor-pointer">
                    {currentMixtureIdx < MIXTURES.length - 1 ? 'Hỗn hợp tiếp theo →' : '🏆 Xem kết quả'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={`bg-linear-to-br ${currentMixture.color} p-1 rounded-3xl shadow-2xl`}>
                <div className="bg-slate-900 rounded-[20px] p-8 text-center min-w-64">
                  <div className="text-8xl mb-4">{currentMixture.emoji}</div>
                  <h2 className="text-2xl font-black text-white">{currentMixture.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">Hỗn hợp gồm: {currentMixture.components.join(' + ')}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {currentMixture.components.map(c => (
                      <span key={c} className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300 border border-slate-700">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback area */}
              {feedback === 'wrong' && (
                <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-800/50 px-4 py-3 rounded-2xl animate-in shake duration-300">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-bold">Dụng cụ này không phù hợp! Thử lại nhé.</span>
                </div>
              )}

              {selectedTool && (
                <button onClick={handleApply} className="px-8 py-3 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl font-bold text-white transition-all cursor-pointer shadow-lg shadow-cyan-900/30">
                  ⚗️ Áp dụng dụng cụ
                </button>
              )}
            </>
          )}
        </div>

        {/* RIGHT: Tool selection */}
        {!allSolved && (
          <div className="w-full lg:w-80 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">Hộp dụng cụ thực hành</h3>
              <p className="text-[11px] text-slate-500">Chọn dụng cụ phù hợp để tách hỗn hợp trên</p>
            </div>

            <div className="flex flex-col gap-3">
              {TOOLS.map(tool => (
                <button key={tool.id} onClick={() => handleToolSelect(tool.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${selectedTool === tool.id ? 'bg-cyan-900/40 border-cyan-500 shadow-lg shadow-cyan-900/20' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 hover:bg-slate-800'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{tool.emoji}</span>
                    <div>
                      <p className="font-bold text-sm text-white">{tool.name}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800">
              <div className="bg-slate-800/60 rounded-2xl p-4">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">Tiến độ</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${(solvedIds.size / MIXTURES.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-300">{solvedIds.size}/{MIXTURES.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
