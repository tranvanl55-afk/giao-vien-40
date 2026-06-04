import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, XCircle, MessageCircle, X, SunMedium, MoveHorizontal, BoxSelect } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const quizData = [
  {
    id: 1,
    level: 'Nhận biết',
    question: 'Bóng tối là gì?',
    options: [
      'Vùng không nhận được ánh sáng từ nguồn sáng truyền tới.',
      'Vùng chỉ nhận được một phần ánh sáng từ nguồn sáng truyền tới.',
      'Vùng nhận được toàn bộ ánh sáng từ nguồn sáng.',
      'Vùng ánh sáng bị phản xạ lại.'
    ],
    correctAnswer: 0,
    explanation: (
      <span>Bóng tối nằm ở phía sau vật cản sáng, hoàn toàn <strong>không nhận được ánh sáng</strong> từ nguồn sáng truyền tới.</span>
    )
  },
  {
    id: 2,
    level: 'Nhận biết',
    question: 'Bóng nửa tối xuất hiện khi nào?',
    options: [
      'Khi nguồn sáng là một điểm sáng rất nhỏ.',
      'Khi nguồn sáng rộng (có kích thước lớn).',
      'Khi vật cản sáng trong suốt.',
      'Khi màn chắn được đặt rất xa vật cản.'
    ],
    correctAnswer: 1,
    explanation: (
      <span>Bóng nửa tối chỉ xuất hiện khi <strong>nguồn sáng rộng</strong>. Nếu nguồn sáng rất nhỏ (điểm sáng), phía sau vật cản chỉ có bóng tối.</span>
    )
  },
  {
    id: 3,
    level: 'Thông hiểu',
    question: 'Hiện tượng Nhật thực toàn phần xảy ra khi người quan sát đứng ở vị trí nào trên Trái Đất?',
    options: [
      'Vùng bóng nửa tối của Mặt Trăng.',
      'Vùng được Mặt Trời chiếu sáng hoàn toàn.',
      'Vùng bóng tối của Mặt Trăng.',
      'Vùng bóng tối của Trái Đất.'
    ],
    correctAnswer: 2,
    explanation: (
      <span>Nhật thực toàn phần xảy ra khi người quan sát đứng trong <strong>vùng bóng tối</strong> của Mặt Trăng in trên Trái Đất, lúc này Mặt Trời bị che khuất hoàn toàn.</span>
    )
  },
  {
    id: 4,
    level: 'Thông hiểu',
    question: 'Khi ta di chuyển vật cản sáng lại gần màn chắn (ra xa nguồn sáng), kích thước của bóng tối trên màn sẽ thay đổi như thế nào?',
    options: [
      'To ra.',
      'Nhỏ lại.',
      'Không thay đổi.',
      'Biến mất.'
    ],
    correctAnswer: 1,
    explanation: (
      <span>Khi vật cản sáng di chuyển lại gần màn (ra xa nguồn sáng), các tia sáng tạo thành rìa bóng tối sẽ thu hẹp lại, làm cho <strong>kích thước bóng tối nhỏ đi</strong>.</span>
    )
  },
  {
    id: 5,
    level: 'Vận dụng',
    question: 'Trong hiện tượng Nguyệt thực, Trái Đất, Mặt Trăng và Mặt Trời nằm ở vị trí như thế nào?',
    options: [
      'Mặt Trăng nằm giữa Trái Đất và Mặt Trời.',
      'Mặt Trời nằm giữa Trái Đất và Mặt Trăng.',
      'Trái Đất nằm giữa Mặt Trời và Mặt Trăng.',
      'Ba thiên thể tạo thành một góc vuông.'
    ],
    correctAnswer: 2,
    explanation: (
      <span>Nguyệt thực xảy ra khi <strong>Trái Đất nằm giữa Mặt Trời và Mặt Trăng</strong>, làm cho Mặt Trăng đi vào vùng bóng tối của Trái Đất.</span>
    )
  }
];

export const BongToiBongNuaToi = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'practice'>('controls');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Physics State
  const [lightR, setLightR] = useState<number>(30); // Kích thước nguồn sáng
  const [objR, setObjR] = useState<number>(40); // Kích thước vật cản
  const [objPos, setObjPos] = useState<number>(350); // Vị trí vật cản (X)

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: React.ReactNode}[]>([
    { role: 'ai', content: 'Xin chào! Mình là Trợ lý Quang học. Hãy thử thay đổi kích thước nguồn sáng xem bóng trên màn thay đổi thế nào nhé!' }
  ]);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [quizStates, setQuizStates] = useState<Record<number, 'correct' | 'incorrect' | null>>({});

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
      if (userMsg.toLowerCase().includes('nhật thực')) {
         reply = "Nhật thực xảy ra khi Mặt Trăng nằm giữa Mặt Trời và Trái Đất. Bóng tối của Mặt Trăng in lên Trái Đất tạo ra nhật thực toàn phần!";
      } else if (userMsg.toLowerCase().includes('nguyệt thực')) {
         reply = "Nguyệt thực xảy ra khi Trái Đất nằm giữa Mặt Trời và Mặt Trăng, khiến Mặt Trăng đi vào vùng bóng tối của Trái Đất.";
      } else if (lightR === 0) {
         reply = "Hiện tại nguồn sáng đang là một điểm sáng (rất nhỏ). Vì vậy trên màn chỉ xuất hiện vùng sáng và vùng bóng tối, KHÔNG có bóng nửa tối.";
      } else {
         reply = "Khi nguồn sáng là một nguồn rộng, các tia sáng đan chéo nhau qua mép vật cản, tạo ra một vùng bóng nửa tối (penumbra) bao quanh bóng tối (umbra).";
      }
      
      setChatMessages(prev => [...prev, { role: 'ai', content: reply }]);
    }, 600);
  };

  // Math for rendering
  const lightX = 100;
  const screenX = 700;
  const objectX = objPos;
  const centerY = 225;
  const D = screenX - lightX;
  const dx = objectX - lightX;

  // Points
  const y_LT = centerY - lightR;
  const y_LB = centerY + lightR;
  const y_OT = centerY - objR;
  const y_OB = centerY + objR;

  // Rays reaching the screen
  const y_umbraTop = y_LT + ((y_OT - y_LT) / dx) * D;
  const y_umbraBottom = y_LB + ((y_OB - y_LB) / dx) * D;
  const y_penumbraTop = y_LB + ((y_OT - y_LB) / dx) * D;
  const y_penumbraBottom = y_LT + ((y_OB - y_LT) / dx) * D;

  const hasUmbra = y_umbraTop < y_umbraBottom;
  
  // Calculate actual umbra / penumbra sizes for display
  const umbraHeight = hasUmbra ? (y_umbraBottom - y_umbraTop) : 0;
  const penumbraHeight = y_penumbraBottom - y_penumbraTop;

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
        
        {/* Canvas Area Container */}
        <div className="relative w-[90%] max-w-[900px] aspect-video bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex items-center justify-center">
          
          <div className="absolute top-4 left-6 text-slate-200 font-medium text-sm tracking-wide z-10 drop-shadow-md">
            Mô phỏng: Bóng tối và Bóng nửa tối
          </div>

          <svg width="100%" height="100%" viewBox="0 0 800 450" className="overflow-visible">
            {/* Background Grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1"/>
            </pattern>
            <rect width="800" height="450" fill="url(#grid)" />

            {/* Screen */}
            <rect x={screenX} y="25" width="20" height="400" fill="#cbd5e1" rx="4" />
            
            {/* Rays (Only show if there's light) */}
            {lightR >= 0 && (
              <>
                {/* Ambient Light radiating in all directions */}
                <circle cx={lightX} cy={centerY} r="1000" fill="url(#radialLight)" opacity="0.6" />
                
                {/* Decorative outward rays */}
                {[...Array(12)].map((_, i) => (
                  <line 
                    key={i}
                    x1={lightX + Math.cos(i * Math.PI / 6) * lightR} 
                    y1={centerY + Math.sin(i * Math.PI / 6) * lightR} 
                    x2={lightX + Math.cos(i * Math.PI / 6) * 1000} 
                    y2={centerY + Math.sin(i * Math.PI / 6) * 1000} 
                    stroke="#fde047" strokeWidth="1" opacity="0.1" 
                  />
                ))}

                {/* Rays to define boundaries (visual guides) */}
                <line x1={lightX} y1={y_LT} x2={screenX} y2={y_umbraTop} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                <line x1={lightX} y1={y_LB} x2={screenX} y2={y_umbraBottom} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                
                {lightR > 0 && (
                  <>
                    <line x1={lightX} y1={y_LB} x2={screenX} y2={y_penumbraTop} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
                    <line x1={lightX} y1={y_LT} x2={screenX} y2={y_penumbraBottom} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
                  </>
                )}

                {/* Subtractive Shadows (Background color overriding the light) */}
                {/* Top Penumbra */}
                {lightR > 0 && (
                  <polygon points={`${objectX},${y_OT} ${screenX},${y_umbraTop} ${screenX},${y_penumbraTop}`} fill="#0f172a" opacity="0.65" />
                )}
                {/* Bottom Penumbra */}
                {lightR > 0 && (
                  <polygon points={`${objectX},${y_OB} ${screenX},${y_umbraBottom} ${screenX},${y_penumbraBottom}`} fill="#0f172a" opacity="0.65" />
                )}
                
                {/* Blocked by object - Umbra */}
                {hasUmbra ? (
                  <polygon points={`${objectX},${y_OT} ${screenX},${y_umbraTop} ${screenX},${y_umbraBottom} ${objectX},${y_OB}`} fill="#0f172a" opacity="0.95" />
                ) : (
                  // Draw tapering umbra
                  <polygon points={`${objectX},${y_OT} ${lightX + dx * lightR / (lightR - objR)},${centerY} ${objectX},${y_OB}`} fill="#0f172a" opacity="0.95" />
                )}
                
                {/* Antumbra (if light is larger than object and cross point is before screen) */}
                {!hasUmbra && (
                  <polygon points={`${lightX + dx * lightR / (lightR - objR)},${centerY} ${screenX},${y_umbraTop} ${screenX},${y_umbraBottom}`} fill="#0f172a" opacity="0.4" />
                )}
              </>
            )}

            {/* Light Source */}
            <circle cx={lightX} cy={centerY} r={Math.max(lightR, 4)} fill="#fde047" filter="url(#glow)" />
            {lightR > 0 && (
               <line x1={lightX} y1={y_LT} x2={lightX} y2={y_LB} stroke="#fef08a" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
            )}

            {/* Opaque Object */}
            <rect x={objectX - 10} y={centerY - objR} width="20" height={objR * 2} fill="#1e293b" rx="4" stroke="#475569" strokeWidth="2" />
            <circle cx={objectX} cy={centerY} r={3} fill="#94a3b8" />

            {/* Gradients & Filters */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <radialGradient id="radialLight" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
                <stop offset="20%" stopColor="#fde047" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Labels on Screen */}
            <g transform={`translate(${screenX + 30}, 0)`}>
              {/* Penumbra Top */}
              {lightR > 0 && y_penumbraTop > 0 && (
                <>
                  <line x1="-20" y1={y_penumbraTop} x2="-5" y2={y_penumbraTop} stroke="#94a3b8" strokeWidth="1" />
                  <text x="0" y={(y_penumbraTop + y_umbraTop) / 2} fill="#94a3b8" fontSize="12" dominantBaseline="middle">Bóng nửa tối</text>
                </>
              )}
              {/* Umbra */}
              {hasUmbra && (
                <>
                  <line x1="-20" y1={y_umbraTop} x2="-5" y2={y_umbraTop} stroke="#ef4444" strokeWidth="1" />
                  <line x1="-20" y1={y_umbraBottom} x2="-5" y2={y_umbraBottom} stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y={centerY} fill="#ef4444" fontSize="14" fontWeight="bold" dominantBaseline="middle">Bóng tối</text>
                </>
              )}
              {/* Penumbra Bottom */}
              {lightR > 0 && y_penumbraBottom < 450 && (
                <>
                  <line x1="-20" y1={y_penumbraBottom} x2="-5" y2={y_penumbraBottom} stroke="#94a3b8" strokeWidth="1" />
                  <text x="0" y={(y_penumbraBottom + y_umbraBottom) / 2} fill="#94a3b8" fontSize="12" dominantBaseline="middle">Bóng nửa tối</text>
                </>
              )}
            </g>
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
                  Thông số mô phỏng
                </h3>

                <div className="space-y-6">
                   {/* Light Size Slider */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-slate-800">Kích thước nguồn sáng</label>
                       <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{lightR === 0 ? 'Điểm sáng' : `${lightR} px`}</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="100" step="1"
                       value={lightR}
                       onChange={(e) => setLightR(parseInt(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                       <span>Nhỏ</span>
                       <span>Lớn</span>
                     </div>
                   </div>

                   {/* Object Pos Slider */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                         <MoveHorizontal className="w-4 h-4 text-slate-400" /> Vị trí vật cản
                       </label>
                       <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{objPos}</span>
                     </div>
                     <input 
                       type="range" 
                       min="200" max="600" step="5"
                       value={objPos}
                       onChange={(e) => setObjPos(parseInt(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                       <span>Gần nguồn</span>
                       <span>Gần màn</span>
                     </div>
                   </div>

                   {/* Object Size Slider */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                         <BoxSelect className="w-4 h-4 text-slate-400" /> Kích thước vật cản
                       </label>
                       <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{objR} px</span>
                     </div>
                     <input 
                       type="range" 
                       min="10" max="100" step="1"
                       value={objR}
                       onChange={(e) => setObjR(parseInt(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                   </div>
                </div>

                {/* Result Card */}
                <div className={`mt-2 rounded-2xl p-6 flex flex-col gap-3 shadow-sm border ${hasUmbra ? 'bg-white border-slate-100' : 'bg-red-50 border-red-200'}`}>
                   <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                     <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                       Độ rộng Bóng tối
                     </p>
                     <p className={`text-2xl font-black font-mono tracking-tight ${hasUmbra ? 'text-slate-800' : 'text-red-500'}`}>
                       {hasUmbra ? Math.round(umbraHeight) : 0} <span className="text-sm font-bold">px</span>
                     </p>
                   </div>
                   <div className="flex justify-between items-end">
                     <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                       Độ rộng Bóng nửa tối
                     </p>
                     <p className="text-2xl font-black font-mono tracking-tight text-slate-800">
                       {lightR > 0 ? Math.round(penumbraHeight - (hasUmbra ? umbraHeight : 0)) : 0} <span className="text-sm font-bold">px</span>
                     </p>
                   </div>
                   {!hasUmbra && (
                     <p className="text-xs text-red-600 font-medium mt-2">
                       * Nguồn sáng quá lớn so với vật cản, bóng tối không chạm tới màn!
                     </p>
                   )}
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
