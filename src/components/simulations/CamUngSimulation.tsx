import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Settings, BookOpen, RefreshCw, Radio, Hand } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import { LineChart, Line, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const quizData = [
  {
    id: 1,
    level: 'Nhận biết',
    question: 'Khi nam châm nằm yên trong cuộn dây, đồ thị cường độ dòng điện (I-t) sẽ như thế nào?',
    options: [
      'Là một đường hình sin',
      'Là một đường thẳng trùng với trục hoành (I = 0)',
      'Là một đường thẳng song song với trục tung',
      'Là một đường thẳng song song với trục hoành nhưng I khác 0'
    ],
    correctAnswer: 1,
    explanation: 'Khi nam châm nằm yên, từ thông qua cuộn dây không biến thiên, do đó không có dòng điện cảm ứng sinh ra (I = 0). Đồ thị là đường thẳng trùng với trục thời gian.'
  },
  {
    id: 2,
    level: 'Thông hiểu',
    question: 'Nếu tăng tốc độ đưa nam châm vào cuộn dây, đồ thị cường độ dòng điện sẽ có sự thay đổi gì?',
    options: [
      'Biên độ của đồ thị I (giá trị cực đại) sẽ tăng lên',
      'Biên độ của đồ thị sẽ giảm đi',
      'Chu kỳ của đồ thị tăng lên',
      'Đồ thị không thay đổi'
    ],
    correctAnswer: 0,
    explanation: 'Tốc độ chuyển động của nam châm càng nhanh thì tốc độ biến thiên từ thông càng lớn, làm cho suất điện động cảm ứng và cường độ dòng điện cảm ứng sinh ra càng lớn. Biên độ đồ thị sẽ tăng.'
  },
  {
    id: 3,
    level: 'Vận dụng',
    question: 'Trong chế độ dao động tự động, nếu đổi cực nam châm, hình dáng đồ thị I-t sẽ thay đổi thế nào?',
    options: [
      'Đồ thị dịch chuyển lên trên',
      'Đồ thị bị đảo ngược (đối xứng qua trục hoành)',
      'Biên độ đồ thị tăng gấp đôi',
      'Tần số dao động của đồ thị giảm đi một nửa'
    ],
    correctAnswer: 1,
    explanation: 'Theo định luật Lenz, khi đổi cực nam châm, chiều của sự biến thiên từ thông ngược lại, dẫn đến chiều dòng điện cảm ứng bị đảo ngược. Đồ thị sẽ đối xứng qua trục thời gian.'
  },
  {
    id: 4,
    level: 'Nhận biết',
    question: 'Dòng điện xoay chiều xuất hiện trong cuộn dây do hiện tượng gì?',
    options: [
      'Hiện tượng khúc xạ ánh sáng',
      'Hiện tượng cảm ứng điện từ',
      'Hiện tượng đoản mạch',
      'Hiện tượng quang điện'
    ],
    correctAnswer: 1,
    explanation: 'Dòng điện sinh ra trong cuộn dây do sự biến thiên từ thông qua tiết diện của nó được gọi là dòng điện cảm ứng, dựa trên hiện tượng cảm ứng điện từ.'
  },
  {
    id: 5,
    level: 'Vận dụng',
    question: 'Khi nam châm di chuyển ra xa cuộn dây, kim điện kế lệch sang phải. Khi đưa nam châm lại gần cuộn dây với cùng một cực, kim điện kế sẽ như thế nào?',
    options: [
      'Vẫn lệch sang phải',
      'Đứng yên ở số 0',
      'Lệch sang trái',
      'Quay liên tục'
    ],
    correctAnswer: 2,
    explanation: 'Khi thay đổi hướng chuyển động của nam châm (từ ra xa thành lại gần), sự biến thiên từ thông đổi dấu (từ giảm sang tăng), do đó chiều dòng điện cảm ứng bị đảo ngược, làm kim điện kế lệch sang hướng ngược lại.'
  }
];

const MAX_HISTORY = 150;

export const CamUngSimulation = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'practice'>('controls');
  
  // Physics & Settings State
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [frequency, setFrequency] = useState(1.5); // Hz
  const [polarity, setPolarity] = useState<1 | -1>(1); // 1 = N down, -1 = S down
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [quizStates, setQuizStates] = useState<Record<number, 'correct' | 'incorrect' | null>>({});

  // Simulation Data
  // We use a ref to store history to avoid re-rendering the whole component on every frame
  const historyRef = useRef<{time: number, I: number}[]>([]);
  const [chartData, setChartData] = useState<{time: number, I: number}[]>([]);
  const lastUpdateRef = useRef(0);
  
  // Motion values
  const magnetY = useMotionValue(0);
  const currentI = useMotionValue(0);
  
  // To track manual velocity
  const prevYRef = useRef(0);
  const timeRef = useRef(0);

  // Clear history when switching mode or polarity
  useEffect(() => {
    historyRef.current = [];
    setChartData([]);
    if (mode === 'auto') {
      magnetY.set(0);
      currentI.set(0);
    }
  }, [mode, polarity, magnetY, currentI]);

  useAnimationFrame((time, delta) => {
    // Delta in seconds
    const dt = delta / 1000;
    if (dt === 0) return;
    
    timeRef.current += dt;
    
    let I = 0;
    
    if (mode === 'auto') {
      // Auto mode: magnet positions oscillates
      // y(t) = A * sin(2 * pi * f * t)
      const A = 60; // Amplitude
      const w = 2 * Math.PI * frequency;
      const y = A * Math.sin(w * timeRef.current);
      magnetY.set(y);
      
      // I is proportional to -dy/dt (velocity)
      // v(t) = A * w * cos(w * t)
      const v = A * w * Math.cos(w * timeRef.current);
      
      // induced current I = - k * v * polarity
      // When magnet enters (v > 0), I is negative.
      I = -0.05 * v * polarity;
    } else {
      // Manual mode: track velocity from drag
      const currentY = magnetY.get();
      const dy = currentY - prevYRef.current;
      const v = dy / dt; // velocity
      
      I = -0.05 * v * polarity;
      
      // simulate damping/resistance (decay to 0 when not moving)
      if (Math.abs(v) < 1) {
        I = I * 0.5;
        if (Math.abs(I) < 0.1) I = 0;
      }
      prevYRef.current = currentY;
    }

    currentI.set(I);

    // Update history for chart, but throttle React state updates (e.g. 30 FPS)
    historyRef.current.push({ time: timeRef.current, I });
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    }
    
    if (timeRef.current - lastUpdateRef.current > 0.05) { // update chart UI 20 times per sec
      setChartData([...historyRef.current]);
      lastUpdateRef.current = timeRef.current;
    }
    
    // Update visual elements directly bypassing React state for performance
    updateVisuals(I, magnetY.get());
  });

  const updateVisuals = (I: number, mY: number) => {
     // Galvanometer needle
     const needle = document.getElementById("galvano-needle");
     if (needle) {
       // clamp angle between -45 and 45
       const angle = Math.max(-45, Math.min(45, I * 5));
       needle.setAttribute("transform", `rotate(${angle}, 150, 60)`);
     }
     
     // LED glow
     const ledGlow = document.getElementById("led-glow");
     if (ledGlow) {
       const intensity = Math.min(1, Math.abs(I) / 10);
       ledGlow.setAttribute("opacity", (intensity * 0.8).toString());
     }

     // Wires "flow" animation speed
     const wires = document.getElementById("flow-wires");
     if (wires) {
       if (Math.abs(I) > 0.5) {
         wires.style.animationDuration = `${Math.max(0.2, 5 / Math.abs(I))}s`;
         wires.style.animationDirection = I > 0 ? "normal" : "reverse";
         wires.style.opacity = "1";
       } else {
         wires.style.opacity = "0";
       }
     }

     // Coil magnetic flux lines density/opacity
     const coilFlux = document.getElementById("coil-magnetic-flux");
     if (coilFlux) {
       // mY goes from -140 to 100. Center is around -20
       const distance = Math.abs(mY - (-20));
       const fluxFactor = Math.max(0, 1 - distance / 150);
       
       // Calculate opacity from 0.15 (far) to 0.85 (close)
       const opacity = 0.15 + 0.7 * fluxFactor;
       coilFlux.setAttribute("opacity", opacity.toFixed(2));
       
       // Change stroke width dynamically to show "density" increase
       const strokeWidth = (1.5 + 1.5 * fluxFactor).toFixed(2);
       coilFlux.setAttribute("stroke-width", strokeWidth);
       
       // Sync flow direction of dynamic flux lines in the coil
       if (coilFlux.firstElementChild) {
         const elements = coilFlux.children;
         for (let i = 0; i < elements.length; i++) {
           const el = elements[i] as SVGElement;
           el.setAttribute("stroke-width", strokeWidth);
         }
       }
     }

     // Magnet field lines dynamic visibility based on closeness to coil
     const lineL1 = document.getElementById("mag-line-l1");
     const lineR1 = document.getElementById("mag-line-r1");
     const lineL2 = document.getElementById("mag-line-l2");
     const lineR2 = document.getElementById("mag-line-r2");
     const lineL3 = document.getElementById("mag-line-l3");
     const lineR3 = document.getElementById("mag-line-r3");
     
     const mDistance = Math.abs(mY - (-20));
     const mFluxFactor = Math.max(0, 1 - mDistance / 150);
     
     const op1 = (0.2 + 0.65 * mFluxFactor).toFixed(2);
     const op2 = (0.6 * Math.max(0, mFluxFactor - 0.2) / 0.8).toFixed(2);
     const op3 = (0.5 * Math.max(0, mFluxFactor - 0.5) / 0.5).toFixed(2);
     
     if (lineL1) lineL1.setAttribute("opacity", op1);
     if (lineR1) lineR1.setAttribute("opacity", op1);
     if (lineL2) lineL2.setAttribute("opacity", op2);
     if (lineR2) lineR2.setAttribute("opacity", op2);
     if (lineL3) lineL3.setAttribute("opacity", op3);
     if (lineR3) lineR3.setAttribute("opacity", op3);
  };

  const handleQuizAnswer = (quizId: number, answerIdx: number) => {
    const quiz = quizData.find(q => q.id === quizId);
    if (!quiz) return;
    setQuizAnswers({ ...quizAnswers, [quizId]: answerIdx });
    setQuizStates({ ...quizStates, [quizId]: answerIdx === quiz.correctAnswer ? 'correct' : 'incorrect' });
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-50 flex flex-row overflow-hidden font-sans">
      
      {/* LEFT PANEL : SIMULATION */}
      <div className="flex-1 relative flex justify-center items-center">
        <button onClick={onBack} className="absolute top-6 left-6 z-50 p-3 bg-slate-800/60 hover:bg-slate-700 backdrop-blur rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] text-slate-200 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Main Canvas Area */}
        <div className="relative w-full max-w-[800px] aspect-square bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden flex justify-center items-center">
             
             {/* Background Neon Grid Decoration */}
             <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

             <div className="relative w-full h-full">
                
                <svg width="100%" height="100%" viewBox="0 0 300 500" className="overflow-visible select-none">
                  <defs>
                    <linearGradient id="magnetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3"/>
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0"/>
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.4"/>
                    </linearGradient>
                    <radialGradient id="ledGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  
                  <g transform="translate(0, 40)">
                    {/* Wire connecting Galvanometer to Coil */}
                    <path d="M 120 60 L 50 60 L 50 250 L 100 250" fill="none" stroke="#475569" strokeWidth="4" rx="10" />
                    <path d="M 180 60 L 250 60 L 250 250 L 200 250" fill="none" stroke="#475569" strokeWidth="4" rx="10" />
                    
                    {/* Flowing dashes on wire */}
                    <g id="flow-wires" className="opacity-0 transition-opacity duration-200" style={{ animation: "dashFlow 2s linear infinite" }}>
                      <path d="M 120 60 L 50 60 L 50 250 L 100 250" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="10 15" rx="10" />
                      <path d="M 200 250 L 250 250 L 250 60 L 180 60" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="10 15" rx="10" />
                    </g>

                    {/* Galvanometer */}
                    <g transform="translate(150, 60)">
                      {/* Casing */}
                      <circle cx="0" cy="0" r="40" fill="#1e293b" stroke="#334155" strokeWidth="4" />
                      <circle cx="0" cy="0" r="34" fill="#f8fafc" />
                      {/* Scale markers */}
                      <path d="M -20 -15 L -24 -18" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M 0 -24 L 0 -28" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M 20 -15 L 24 -18" stroke="#94a3b8" strokeWidth="2" />
                      
                      <text x="0" y="-10" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">0</text>
                      <text x="0" y="15" fontSize="8" fontWeight="bold" fill="#3b82f6" textAnchor="middle">G</text>

                      {/* Needle */}
                      <g id="galvano-needle" transform="rotate(0, 0, 0)">
                        <line x1="0" y1="10" x2="0" y2="-22" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="0" cy="0" r="4" fill="#0f172a" />
                      </g>
                    </g>
                    
                    {/* Dynamic Magnetic Field Lines passing through the coil */}
                    <g id="coil-magnetic-flux" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.15" filter="url(#fieldGlow)">
                      {/* Vertical lines passing through coil */}
                      <path d="M 120 150 L 120 350" />
                      <path d="M 135 150 L 135 350" />
                      <path d="M 150 140 L 150 360" strokeWidth="2.5" />
                      <path d="M 165 150 L 165 350" />
                      <path d="M 180 150 L 180 350" />
                      
                      {/* Concentric ellipses representing lines looping through */}
                      <ellipse cx="150" cy="210" rx="70" ry="20" />
                      <ellipse cx="150" cy="250" rx="80" ry="22" />
                      <ellipse cx="150" cy="290" rx="70" ry="20" />
                    </g>

                    {/* Solenoid (Coil) - Back loops */}
                    <g stroke="#b45309" strokeWidth="6" fill="none" opacity="0.6">
                      {[0, 10, 20, 30, 40, 50, 60, 70, 80].map(y => (
                        <path key={`back-${y}`} d={`M 100 ${210 + y} Q 150 ${190 + y} 200 ${210 + y}`} />
                      ))}
                    </g>
                  </g>
                </svg>

                {/* Magnet (Interactive via Framer Motion) */}
                {/* Wrapped in an absolute div to position over SVG easily */}
                <div className="absolute left-1/2 top-[260px] -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center pointer-events-none">
                   
                   <motion.div 
                     style={{ y: magnetY }}
                     drag={mode === 'manual' ? "y" : false}
                     dragConstraints={{ top: -140, bottom: 100 }}
                     dragElastic={0}
                     dragMomentum={false}
                     className={`relative flex justify-center items-center ${mode === 'manual' ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-auto'}`}
                   >
                     {/* Magnetic Field Lines */}
                     <div className="absolute pointer-events-none -z-10 w-[300px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <svg width="100%" height="100%" viewBox="0 0 300 400" className="overflow-visible">
                           <defs>
                             <filter id="fieldGlow" x="-20%" y="-20%" width="140%" height="140%">
                               <feGaussianBlur stdDeviation="2" result="blur" />
                               <feComposite in="SourceGraphic" in2="blur" operator="over" />
                             </filter>
                           </defs>
                           <g 
                             fill="none" 
                             stroke="#38bdf8" 
                             strokeWidth="2.5" 
                             strokeDasharray="6 8" 
                             opacity="0.7" 
                             filter="url(#fieldGlow)" 
                             style={{ 
                               animation: "fieldFlow 3s linear infinite",
                               animationDirection: polarity === 1 ? "normal" : "reverse" 
                             }}
                           >
                              {/* Inner loops */}
                              <path id="mag-line-l1" d="M 140 128 C 75 120, 75 280, 140 272" strokeLinecap="round" opacity="0.3" />
                              <path id="mag-line-r1" d="M 160 128 C 225 120, 225 280, 160 272" strokeLinecap="round" opacity="0.3" />
                              
                              {/* Middle loops */}
                              <path id="mag-line-l2" d="M 130 128 C 20 90, 20 310, 130 272" strokeLinecap="round" opacity="0.0" />
                              <path id="mag-line-r2" d="M 170 128 C 280 90, 280 310, 170 272" strokeLinecap="round" opacity="0.0" />
                              
                              {/* Outer loops */}
                              <path id="mag-line-l3" d="M 120 128 C -40 50, -40 350, 120 272" strokeLinecap="round" opacity="0.0" />
                              <path id="mag-line-r3" d="M 180 128 C 340 50, 340 350, 180 272" strokeLinecap="round" opacity="0.0" />
                           </g>
                        </svg>
                     </div>

                     <div className="relative w-16 h-36 rounded-md shadow-2xl flex flex-col overflow-hidden border-2 border-slate-700/50">
                       {/* Gradient overlay for 3D effect */}
                       <div className="absolute inset-0 bg-linear-to-r from-white/30 via-transparent to-black/30 pointer-events-none"></div>
                       
                       <div className={`flex-1 flex justify-center items-center font-bold text-white text-xl ${polarity === 1 ? 'bg-red-600' : 'bg-blue-600'}`}>
                          {polarity === 1 ? 'N' : 'S'}
                       </div>
                       <div className={`flex-1 flex justify-center items-center font-bold text-white text-xl ${polarity === 1 ? 'bg-blue-600' : 'bg-red-600'}`}>
                          {polarity === 1 ? 'S' : 'N'}
                       </div>
                     </div>
                   </motion.div>
                   {mode === 'manual' && (
                     <motion.div style={{ y: magnetY }} className="absolute -right-12 top-1/2 text-slate-400">
                       <Hand className="w-8 h-8 animate-pulse" />
                     </motion.div>
                   )}
                </div>

                {/* Solenoid (Coil) - Front loops ( drawn over the magnet ) */}
                <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 300 500" className="overflow-visible select-none">
                    <g transform="translate(0, 40)">
                      <g stroke="#d97706" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {[0, 10, 20, 30, 40, 50, 60, 70, 80].map(y => (
                          <path key={`front-${y}`} d={`M 100 ${210 + y} Q 150 ${230 + y} 200 ${210 + y}`} />
                        ))}
                      </g>
                      {/* The LED at the bottom */}
                      <g transform="translate(150, 340)">
                         <circle id="led-glow" cx="0" cy="0" r="30" fill="url(#ledGrad)" opacity="0" className="transition-opacity duration-150" />
                         <rect x="-10" y="-12" width="20" height="24" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
                         <path d="M 0 -8 L 5 -2 L -5 -2 Z" fill="#94a3b8" />
                      </g>
                    </g>
                  </svg>
                </div>

             </div>
        </div>
      </div>

      {/* RIGHT PANEL : SIDEBAR */}
      <div className="w-[450px] bg-slate-900 border-l border-slate-800 flex flex-col z-30 shadow-2xl shrink-0 text-slate-200">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-800 shrink-0 bg-slate-900">
           <button 
             onClick={() => setActiveTab('controls')}
             className={`flex-1 flex justify-center items-center gap-2 py-4 font-bold text-sm tracking-wide uppercase transition-colors relative ${activeTab === 'controls' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <Settings className="w-4 h-4" /> ĐIỀU KHIỂN
             {activeTab === 'controls' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
           </button>
           <button 
             onClick={() => setActiveTab('practice')}
             className={`flex-1 flex justify-center items-center gap-2 py-4 font-bold text-sm tracking-wide uppercase transition-colors relative ${activeTab === 'practice' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <BookOpen className="w-4 h-4" /> LUYỆN TẬP
             {activeTab === 'practice' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
           </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'controls' ? (
             <div className="p-6 flex flex-col gap-6">
                
                {/* Graph Area */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4 shadow-inner">
                  <h3 className="flex items-center gap-2 font-bold text-slate-300 text-sm mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    Biểu đồ dòng điện I(t)
                  </h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <YAxis domain={[-100, 100]} hide={true} />
                        <ReferenceLine y={0} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
                        <Line 
                          type="monotone" 
                          dataKey="I" 
                          stroke="#22d3ee" 
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>t</span>
                    <span className="text-cyan-400 opacity-70 italic font-serif">I</span>
                  </div>
                </div>

                <hr className="border-slate-800" />

                {/* Mode Toggle */}
                <div className="flex bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setMode('manual')}
                    className={`flex-1 py-3 border border-transparent rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'manual' ? 'bg-slate-700 shadow-sm text-cyan-400 border-slate-600' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Hand className="w-4 h-4" /> Thủ công
                  </button>
                  <button 
                    onClick={() => setMode('auto')}
                    className={`flex-1 py-3 border border-transparent rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'auto' ? 'bg-slate-700 shadow-sm text-cyan-400 border-slate-600' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Radio className="w-4 h-4" /> Tự động (AC)
                  </button>
                </div>

                {/* Controls */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 shadow-inner flex flex-col gap-6">
                  
                  {/* Swap Polarity */}
                  <div className="flex justify-between items-center bg-slate-800 p-3 rounded-xl">
                    <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                       <RefreshCw className="w-4 h-4 text-slate-400" /> Cực Nam Châm
                    </span>
                    <button 
                      onClick={() => setPolarity(p => p === 1 ? -1 : 1)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold text-slate-200 transition-colors"
                    >
                      Đổi cực (N ↔ S)
                    </button>
                  </div>

                  {/* Frequency Slider (only when auto) */}
                  <div className={`transition-opacity duration-300 ${mode === 'auto' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                     <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-slate-300">Tốc độ dao động (Hz)</label>
                       <span className="text-sm font-bold text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded">{frequency.toFixed(1)} Hz</span>
                     </div>
                     <input 
                       type="range" 
                       min="0.5" max="3" step="0.1"
                       value={frequency}
                       onChange={(e) => setFrequency(parseFloat(e.target.value))}
                       className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                     />
                     <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                       <span>0.5Hz</span>
                       <span>3Hz</span>
                     </div>
                  </div>

                </div>

             </div>
          ) : (
             <div className="p-5 flex flex-col gap-4">
                {quizData.map((q) => (
                  <div key={q.id} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 shadow-inner">
                     <div className="flex gap-2 items-center mb-3">
                       <span className="text-[10px] font-bold px-2 py-1 bg-slate-700 text-cyan-400 rounded uppercase tracking-wider">{q.level}</span>
                     </div>
                     <p className="text-slate-200 font-medium mb-4 text-[15px] leading-relaxed wrap-break-word">{q.question}</p>
                     <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-700/50">
                       {q.options.map((opt, idx) => {
                          const isSelected = quizAnswers[q.id] === idx;
                          const state = quizStates[q.id];
                          
                          let btnClass = "p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ";
                          if (!isSelected) {
                            btnClass += "bg-slate-800 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 text-slate-300";
                          } else if (state === 'correct') {
                            btnClass += "bg-emerald-900/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]";
                          } else {
                            btnClass += "bg-rose-900/40 border-rose-500/50 text-rose-400 shadow-[0_0_0_1px_rgba(244,63,94,0.2)]";
                          }

                          return (
                            <button 
                              key={idx}
                              onClick={() => handleQuizAnswer(q.id, idx)}
                              className={btnClass}
                            >
                              <span><span className="font-bold mr-3 text-slate-500 bg-slate-900/50 w-6 h-6 inline-flex items-center justify-center rounded-full text-xs box-border border border-slate-700">{String.fromCharCode(65 + idx)}</span> {opt}</span>
                            </button>
                          )
                       })}
                     </div>
                     {/* Feedback Box */}
                     {quizStates[q.id] && (
                        <div className={`mt-4 p-4 rounded-xl text-sm leading-relaxed border ${quizStates[q.id] === 'correct' ? 'bg-emerald-900/20 text-emerald-300 border-emerald-800/50' : 'bg-rose-900/20 text-rose-300 border-rose-800/50'}`}>
                           <div className="opacity-90 font-serif leading-[1.6]">
                             {q.explanation}
                           </div>
                        </div>
                     )}
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dashFlow {
          to { stroke-dashoffset: -50; }
        }
        @keyframes fieldFlow {
          to { stroke-dashoffset: -28; }
        }
      `}} />
    </div>
  );
};
