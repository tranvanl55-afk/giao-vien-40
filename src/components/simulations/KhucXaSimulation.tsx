import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle2, XCircle, MessageCircle, X, SunMedium } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const quizData = [
  {
    id: 1,
    level: 'Nhận biết',
    question: 'Công thức nào sau đây là định luật khúc xạ ánh sáng (Định luật Snell)?',
    options: [
      <span key="1"><InlineMath math="n_1 \sin i = n_2 \sin r" /></span>,
      <span key="2"><InlineMath math="n_1 \sin r = n_2 \sin i" /></span>,
      <span key="3"><InlineMath math="n_1 \cos i = n_2 \cos r" /></span>,
      <span key="4"><InlineMath math="n_1 / \sin i = n_2 / \sin r" /></span>
    ],
    correctAnswer: 0,
    explanation: (
      <span>Định luật Snell: Tích của chiết suất và sin góc tới ở môi trường này bằng tích của chiết suất và sin góc khúc xạ ở môi trường kia: <strong><InlineMath math="n_1 \sin i = n_2 \sin r" /></strong></span>
    )
  },
  {
    id: 2,
    level: 'Thông hiểu',
    question: 'Khi ánh sáng truyền từ môi trường có chiết suất nhỏ (không khí) sang môi trường có chiết suất lớn hơn (nước), thì góc khúc xạ (r) so với góc tới (i) sẽ như thế nào?',
    options: [
      <span key="1"><InlineMath math="r > i" /></span>,
      <span key="2"><InlineMath math="r < i" /></span>,
      <span key="3"><InlineMath math="r = i" /></span>,
      <span key="4">Không thể xác định</span>
    ],
    correctAnswer: 1,
    explanation: (
      <span>Vì <strong><InlineMath math="n_1 < n_2" /></strong>, theo định luật Snell ta có <strong><InlineMath math="\sin r = \frac{n_1}{n_2} \sin i" /></strong>. Suy ra <strong><InlineMath math="\sin r < \sin i \Rightarrow r < i" /></strong>. Tia khúc xạ bị lệch lại gần pháp tuyến hơn so với tia tới.</span>
    )
  },
  {
    id: 3,
    level: 'Thông hiểu',
    question: 'Điều kiện nào sau đây phải thỏa mãn để xảy ra hiện tượng phản xạ toàn phần?',
    options: [
      <span>Ánh sáng đi từ môi trường chiết quang kém (<InlineMath math="n_1 < n_2"/>) và góc tới <InlineMath math="i \ge i_{gh}"/></span>,
      <span>Ánh sáng đi từ môi trường chiết quang hơn (<InlineMath math="n_1 > n_2"/>) và góc tới <InlineMath math="i \ge i_{gh}"/></span>,
      <span>Ánh sáng đi từ môi trường chiết quang hơn (<InlineMath math="n_1 > n_2"/>) và góc tới <InlineMath math="i < i_{gh}"/></span>,
      <span>Ánh sáng truyền vuông góc với mặt phân cách.</span>
    ],
    correctAnswer: 1,
    explanation: (
      <span>Điều kiện xảy ra phản xạ toàn phần: <br/>1. Ánh sáng truyền từ môi trường chiết quang sang môi trường kém chiết quang hơn (<strong><InlineMath math="n_1 > n_2" /></strong>). <br/>2. Góc tới phải lớn hơn hoặc bằng góc giới hạn phản xạ toàn phần (<strong><InlineMath math="i \ge i_{gh}" /></strong>).</span>
    )
  },
  {
    id: 4,
    level: 'Vận dụng',
    question: 'Chiếu một tia sáng từ không khí (n₁ ≈ 1) vào mặt nước (n₂ ≈ 1.33) dưới góc tới i = 45°. Tính góc khúc xạ r?',
    options: [
      'Khoảng 32.1°',
      'Khoảng 45°',
      'Khoảng 70.5°',
      'Khoảng 21°'
    ],
    correctAnswer: 0,
    explanation: (
      <span>Áp dụng công thức <strong><InlineMath math="\sin r = \frac{n_1 \sin i}{n_2} = \frac{1 \cdot \sin(45^\circ)}{1.33} \approx 0.531" /></strong>.<br/>Suy ra <strong><InlineMath math="r \approx 32.1^\circ" /></strong>.</span>
    )
  },
  {
    id: 5,
    level: 'Vận dụng',
    question: 'Góc giới hạn phản xạ toàn phần giữa thủy tinh (n₁ = 1.5) và không khí (n₂ = 1) là bao nhiêu?',
    options: [
      'Khoảng 30°',
      'Khoảng 48.6°',
      'Khoảng 41.8°',
      'Khoảng 60°'
    ],
    correctAnswer: 2,
    explanation: (
      <span>Góc giới hạn được tính theo công thức: <strong><InlineMath math="\sin i_{gh} = \frac{n_2}{n_1} = \frac{1}{1.5} \approx 0.667" /></strong>.<br/>Suy ra <strong><InlineMath math="i_{gh} \approx 41.8^\circ" /></strong>.</span>
    )
  }
];

export const KhucXaSimulation = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'practice'>('controls');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Physics State
  const [n1, setN1] = useState<number>(1);
  const [n2, setN2] = useState<number>(1.5);
  const [angleI, setAngleI] = useState<number>(45);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: React.ReactNode}[]>([
    { role: 'ai', content: 'Xin chào! Mình là Trợ lý Quang học. Bạn hãy điều chỉnh các thanh trượt Chiết suất và Góc tới để cảm nhận ánh sáng thay đổi như thế nào nhé!' }
  ]);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [quizStates, setQuizStates] = useState<Record<number, 'correct' | 'incorrect' | null>>({});

  // Physics calculations
  const iRad = (angleI * Math.PI) / 180;
  const sinR = (n1 * Math.sin(iRad)) / n2;
  const isTIR = sinR > 1; // Total Internal Reflection

  let rRad = 0;
  let angleR = 0;
  let criticalAngle = 0;

  if (n1 > n2) {
    criticalAngle = (Math.asin(n2 / n1) * 180) / Math.PI;
  }

  if (isTIR) {
    // Total internal reflection: r is reflection angle (equal to i)
    rRad = iRad;
    angleR = angleI;
  } else {
    rRad = Math.asin(sinR);
    angleR = (rRad * 180) / Math.PI;
  }

  // Handlers
  const handleQuizAnswer = (quizId: number, answerIdx: number) => {
    const quiz = quizData.find(q => q.id === quizId);
    if (!quiz) return;
    
    setQuizAnswers({ ...quizAnswers, [quizId]: answerIdx });
    setQuizStates({ 
      ...quizStates, 
      [quizId]: answerIdx === quiz.correctAnswer ? 'correct' : 'incorrect' 
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    
    setTimeout(() => {
      let reply: React.ReactNode = "";
      if (userMsg.toLowerCase().includes('phản xạ toàn phần') || isTIR) {
         reply = (
           <span>
             Với <InlineMath math={"n_1 = " + n1} /> lớn hơn <InlineMath math={"n_2 = " + n2} />, góc tới giới hạn là <InlineMath math={"i_{gh} \\approx " + criticalAngle.toFixed(1) + "^\\circ"} />.<br/>
             Vì góc tới <InlineMath math={"i = " + angleI + "^\\circ"} /> {isTIR ? 'lớn hơn' : 'nhỏ hơn'} góc giới hạn, nên hiện tượng phản xạ toàn phần {isTIR ? 'XẢY RA' : 'KHÔNG XẢY RA'}.
           </span>
         );
      } else {
         reply = (
           <span>
             Ta có góc tới <InlineMath math={"i = " + angleI + "^\\circ"} />.<br/>
             Áp dụng định luật Snell: <InlineMath math={"n_1 \\sin i = n_2 \\sin r"} /> <br/>
             Góc khúc xạ hiện tại đang là <InlineMath math={"r = " + angleR.toFixed(2) + "^\\circ"} />.
           </span>
         );
      }
      
      setChatMessages(prev => [...prev, { role: 'ai', content: reply }]);
    }, 600);
  };

  // Rendering graphics lengths
  const L = 300; // Ray length

  // Coordinates (SVG coordinates: origin center, X right, Y down)
  // Incident ray comes from top-left (negative x, negative y)
  const incStartX = -L * Math.sin(iRad);
  const incStartY = -L * Math.cos(iRad);

  let outEndX = 0;
  let outEndY = 0;
  
  if (isTIR) {
    // Reflects back upwards to the right
    outEndX = L * Math.sin(iRad);
    outEndY = -L * Math.cos(iRad);
  } else {
    // Refracts downwards to the right
    outEndX = L * Math.sin(rRad);
    outEndY = L * Math.cos(rRad);
  }

  // Draw angle arcs
  const rArc = 40; // Arc radius

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-50 flex flex-row overflow-hidden font-sans">
      
      {/* LEFT PANEL : SIMULATION */}
      <div className="flex-1 relative flex flex-col justify-center items-center">
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 z-50 p-3 bg-slate-800/60 hover:bg-slate-700 backdrop-blur rounded-full shadow-lg text-slate-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Canvas Area Container - Glassmorphism */}
        <div className="relative w-[80%] max-w-[800px] aspect-video bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex items-center justify-center">
          
          {/* Backgrounds for top and bottom environment based on refractive index to simulate density visually */}
          <div className="absolute inset-x-0 top-0 bottom-1/2 transition-colors duration-500" 
               style={{ backgroundColor: `rgba(255, 255, 255, ${0.05 + (n1 - 1) * 0.1})` }}></div>
          <div className="absolute inset-x-0 top-1/2 bottom-0 transition-colors duration-500"
               style={{ backgroundColor: `rgba(56, 189, 248, ${0.1 + (n2 - 1) * 0.15})` }}></div>

          <div className="absolute top-4 left-6 text-slate-200 font-medium text-sm tracking-wide z-10 drop-shadow-md">
            Môi trường 1 (<InlineMath math={"n_1=" + n1} />)
          </div>
          <div className="absolute bottom-4 left-6 text-slate-200 font-medium text-sm tracking-wide z-10 drop-shadow-md">
            Môi trường 2 (<InlineMath math={"n_2=" + n2} />)
          </div>

          <svg width="100%" height="100%" viewBox="-400 -225 800 450" className="overflow-visible">
            {/* Interface Line */}
            <line x1="-400" y1="0" x2="400" y2="0" stroke="#94a3b8" strokeWidth="2" opacity="0.6" />
            
            {/* Normal Line */}
            <line x1="0" y1="-225" x2="0" y2="225" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" opacity="0.5" />

            {/* Incident Ray Path */}
            <motion.line 
              x1={incStartX} y1={incStartY} x2="0" y2="0"
              stroke="#fbbf24" strokeWidth="3"
            />
            {/* Arrowhead for Incident */}
            <polygon 
              points="-8,-12 8,-12 0,0" 
              fill="#fbbf24" 
              transform={`translate(${-L/2 * Math.sin(iRad)}, ${-L/2 * Math.cos(iRad)}) rotate(${angleI})`} 
            />

            {/* Outgoing Ray (Refracted or Reflected) */}
            <motion.line 
              x1="0" y1="0" x2={outEndX} y2={outEndY}
              stroke={isTIR ? "#fbbf24" : "#ef4444"} strokeWidth="3"
              initial={false}
              animate={{ x2: outEndX, y2: outEndY }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            />
            {/* Arrowhead for Outgoing */}
            <polygon 
              points="-8,-12 8,-12 0,0" 
              fill={isTIR ? "#fbbf24" : "#ef4444"} 
              transform={
                isTIR 
                  ? `translate(${L/2 * Math.sin(iRad)}, ${-L/2 * Math.cos(iRad)}) rotate(${-angleI + 180})` 
                  : `translate(${L/2 * Math.sin(rRad)}, ${L/2 * Math.cos(rRad)}) rotate(${-angleR})`
              } 
            />
            
            {/* Arc for Angle i */}
            {angleI > 0 && (
              <>
                <motion.path 
                  d={`M 0 ${-rArc} A ${rArc} ${rArc} 0 0 0 ${-rArc * Math.sin(iRad)} ${-rArc * Math.cos(iRad)}`}
                  fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.8"
                />
                <text x={-rArc * Math.sin(iRad/2) - 30} y={-rArc * Math.cos(iRad/2) - 10} fill="#fbbf24" fontSize="14" className="font-serif">
                  i = {angleI}°
                </text>
              </>
            )}

            {/* Arc for Angle r (or i' for TIR) */}
            {angleI > 0 && (
              <>
                {isTIR ? (
                  <>
                    <motion.path 
                      initial={false}
                      animate={{ d: `M 0 ${-rArc} A ${rArc} ${rArc} 0 0 1 ${rArc * Math.sin(iRad)} ${-rArc * Math.cos(iRad)}` }}
                      fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.8"
                    />
                    <text x={rArc * Math.sin(iRad/2) + 15} y={-rArc * Math.cos(iRad/2) - 10} fill="#fbbf24" fontSize="14" className="font-serif">
                      i' = {angleI}°
                    </text>
                  </>
                ) : (
                  <>
                    <motion.path 
                      initial={false}
                      animate={{ d: `M 0 ${rArc} A ${rArc} ${rArc} 0 0 0 ${rArc * Math.sin(rRad)} ${rArc * Math.cos(rRad)}` }}
                      fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8"
                    />
                    <text x={rArc * Math.sin(rRad/2) + 15} y={rArc * Math.cos(rRad/2) + 20} fill="#ef4444" fontSize="14" className="font-serif">
                      r = {angleR.toFixed(1)}°
                    </text>
                  </>
                )}
              </>
            )}
            
            {/* Optional ghost ray for reflection when not TIR */}
            {angleI > 0 && !isTIR && (
               <line 
                 x1="0" y1="0" x2={L*0.6 * Math.sin(iRad)} y2={-L*0.6 * Math.cos(iRad)}
                 stroke="#fbbf24" strokeWidth="1" opacity="0.3"
               />
            )}
          </svg>
        </div>
      </div>

      {/* RIGHT PANEL : SIDEBAR */}
      <div className="w-[450px] bg-slate-50 border-l border-slate-200 flex flex-col z-30 shadow-2xl shrink-0">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 shrink-0 bg-white">
           <button 
             onClick={() => setActiveTab('controls')}
             className={`flex-1 py-4 font-bold text-sm tracking-wide uppercase transition-colors border-b-2 ${activeTab === 'controls' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             ĐIỀU KHIỂN
           </button>
           <button 
             onClick={() => setActiveTab('practice')}
             className={`flex-1 py-4 font-bold text-sm tracking-wide uppercase transition-colors border-b-2 ${activeTab === 'practice' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             LUYỆN TẬP
           </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'controls' ? (
             <div className="p-6 flex flex-col gap-6">
                
                <h3 className="flex items-center gap-2 font-bold text-lg text-slate-800">
                  <SunMedium className="w-5 h-5 text-orange-500" />
                  Chiết suất môi trường
                </h3>

                <div className="space-y-6">
                   {/* N1 Slider */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-slate-800">Môi trường 1 (n₁)</label>
                       <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{n1.toFixed(1)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="1" max="2.5" step="0.1"
                       value={n1}
                       onChange={(e) => setN1(parseFloat(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                       <span>1.0</span>
                       <span>2.5</span>
                     </div>
                   </div>

                   {/* N2 Slider */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-slate-800">Môi trường 2 (n₂)</label>
                       <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{n2.toFixed(1)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="1" max="2.5" step="0.1"
                       value={n2}
                       onChange={(e) => setN2(parseFloat(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                       <span>1.0</span>
                       <span>2.5</span>
                     </div>
                   </div>

                   {/* Angle I Slider */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-slate-800">Góc tới (i)</label>
                       <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{angleI}°</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="90" step="1"
                       value={angleI}
                       onChange={(e) => setAngleI(parseFloat(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                       <span>0°</span>
                       <span>90°</span>
                     </div>
                   </div>
                </div>

                {/* Result Card */}
                <div className={`mt-2 rounded-2xl p-6 flex items-center justify-between shadow-sm border ${isTIR ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100'}`}>
                   <div>
                     <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1">
                       {isTIR ? 'Góc phản xạ (i\')' : 'Góc khúc xạ (r)'}
                     </p>
                     {isTIR && (
                       <span className="inline-flex text-[10px] bg-orange-200 text-orange-800 font-bold px-2 py-0.5 rounded-full uppercase">Phản xạ toàn phần</span>
                     )}
                   </div>
                   <div className="text-right">
                     <p className={`text-4xl font-black font-mono tracking-tight ${isTIR ? 'text-orange-600' : 'text-slate-800'}`}>
                       {angleR.toFixed(2)}<span className="text-2xl font-bold align-top">°</span>
                     </p>
                   </div>
                </div>

             </div>
          ) : (
             <div className="p-5 flex flex-col gap-4">
                {quizData.map((q) => (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                     <div className="flex gap-2 items-center mb-3">
                       <span className="text-[10px] font-bold px-2 py-1 bg-sky-50 text-sky-700 rounded uppercase tracking-wider shadow-sm">{q.level}</span>
                     </div>
                     <p className="text-slate-800 font-medium mb-4 text-[15px] leading-relaxed">{q.question}</p>
                     <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100">
                       {q.options.map((opt, idx) => {
                          const isSelected = quizAnswers[q.id] === idx;
                          const state = quizStates[q.id];
                          
                          let btnClass = "p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ";
                          if (!isSelected) {
                            btnClass += "bg-white border-slate-200 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50/50 text-slate-600";
                          } else if (state === 'correct') {
                            btnClass += "bg-green-50 border-green-500 text-green-700 shadow-[0_0_0_1px_#22c55e]";
                          } else {
                            btnClass += "bg-red-50 border-red-500 text-red-700 shadow-[0_0_0_1px_#ef4444]";
                          }

                          return (
                            <button 
                              key={idx}
                              onClick={() => handleQuizAnswer(q.id, idx)}
                              className={btnClass}
                            >
                              <span><span className="font-bold mr-3 text-slate-400 bg-slate-100 w-6 h-6 inline-flex items-center justify-center rounded-full text-xs">{String.fromCharCode(65 + idx)}</span> {opt}</span>
                              {isSelected && state === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                              {isSelected && state === 'incorrect' && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                            </button>
                          )
                       })}
                     </div>
                     {/* Feedback Box */}
                     {quizStates[q.id] && (
                        <div className={`mt-4 p-4 rounded-xl text-sm leading-relaxed ${quizStates[q.id] === 'correct' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                           <div className="flex items-center gap-1.5 font-bold mb-2">
                             {quizStates[q.id] === 'correct' ? (
                               <><CheckCircle2 className="w-4 h-4" /> Chính xác!</>
                             ) : (
                               <><XCircle className="w-4 h-4" /> Chưa đúng lắm.</>
                             )}
                           </div>
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

      {/* FLOATING CHAT WIDGET */}
      <div className="fixed bottom-6 right-[480px] z-50 flex flex-col items-end">
        
        {/* Chat Window Popup */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white/95 backdrop-blur-xl w-[350px] h-[500px] mb-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-sky-500 p-4 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-3">
                   <div className="w-11 h-11 rounded-full bg-white/20 p-0.5 flex justify-center items-end overflow-hidden shadow-inner">
                     <img src="https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-9 h-9 object-cover" />
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-base">Trợ lý Quang học</h3>
                     <div className="flex items-center gap-1">
                       <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                       <p className="text-xs text-sky-100 font-medium tracking-wide">Trạng thái trực tuyến</p>
                     </div>
                   </div>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-full transition">
                   <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-4 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center mr-2 shrink-0 mt-1 shadow-sm overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-6 h-6 object-cover" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-sky-500 text-white rounded-[20px] rounded-tr-sm font-medium' : 'bg-white text-slate-700 rounded-[20px] border border-slate-100 rounded-tl-sm whitespace-pre-wrap'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Box */}
              <div className="p-3 bg-white border-t border-slate-100">
                 <div className="relative flex items-center bg-slate-50 rounded-full border border-slate-200 px-1 py-1 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                   <input 
                     type="text" 
                     value={chatInput}
                     onChange={e => setChatInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                     placeholder="Hỏi gì đó..."
                     className="w-full bg-transparent border-none outline-none py-2 px-4 text-sm text-slate-700 placeholder-slate-400"
                   />
                   <button 
                     onClick={handleSendMessage}
                     disabled={!chatInput.trim()}
                     className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 flex items-center justify-center text-white transition-colors shrink-0 shadow-sm"
                   >
                     <Send className="w-4 h-4 ml-[-2px]" />
                   </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(14,165,233,0.4)] transition-all duration-300 hover:scale-105 bg-sky-500 hover:bg-sky-600 animate-bounce"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
          </button>
        )}

      </div>
    </div>
  );
};
