import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw, Send, CheckCircle2, XCircle, MessageCircle, X, HardHat } from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const P_symbol = <InlineMath math="\mathcal{P}" />;

const quizData = [
  {
    id: 1,
    level: 'Nhận biết',
    question: 'Công cơ học được định nghĩa là gì trong trường hợp lực F không đổi và vật dịch chuyển một quãng đường s theo hướng của lực?',
    options: ['A = F / s', 'A = F · s', 'A = P · t', 'A = m · g · h'],
    correctAnswer: 1,
    explanation: (
      <span>Khi lực <i>F</i> tác dụng làm vật dịch chuyển quãng đường <i>s</i> theo hướng của lực, công cơ học được tính bằng công thức <strong>A = F · s</strong>.</span>
    )
  },
  {
    id: 2,
    level: 'Thông hiểu',
    question: 'Đơn vị của công suất là gì?',
    options: ['Joule (J)', 'Newton (N)', 'Watt (W)', 'Kilogram (kg)'],
    correctAnswer: 2,
    explanation: (
      <span>Công suất đặc trưng cho tốc độ thực hiện công, có đơn vị là Oát (Watt), ký hiệu là <strong>W</strong>. 1 W = 1 J/s.</span>
    )
  },
  {
    id: 3,
    level: 'Vận dụng',
    question: 'Một máy thực hiện công A = 3300 J trong thời gian t = 3 s. Công suất của máy là?',
    options: ['9900 W', '1100 W', '3303 W', '550 W'],
    correctAnswer: 1,
    explanation: (
      <span>Áp dụng công thức <strong><InlineMath math="\mathcal{P} = \frac{A}{t}" /></strong> = 3300 / 3 = 1100 W.</span>
    )
  },
  {
    id: 4,
    level: 'Vận dụng',
    question: 'Cần cẩu A nâng khối hàng 500N lên 5m trong 10s. Cần cẩu B nâng khối hàng 500N lên 5m trong 5s. So sánh công suất của hai cần cẩu.',
    options: [
      <span key="1"><InlineMath math="\mathcal{P}_A > \mathcal{P}_B" /></span>, 
      <span key="2"><InlineMath math="\mathcal{P}_A < \mathcal{P}_B" /></span>, 
      <span key="3"><InlineMath math="\mathcal{P}_A = \mathcal{P}_B" /></span>, 
      'Không thể so sánh'
    ],
    correctAnswer: 1,
    explanation: (
      <span>Hai cần cẩu thực hiện cùng một công <i>A</i> = 500 · 5 = 2500 J. Tuy nhiên, cần cẩu B làm nhanh hơn (thời gian <i>t</i> nhỏ hơn), do đó công suất <strong><InlineMath math="\mathcal{P} = \frac{A}{t}" /></strong> của B lớn hơn A.</span>
    )
  },
  {
    id: 5,
    level: 'Nhận biết',
    question: 'Trường hợp nào sau đây lực có thực hiện công cơ học?',
    options: ['Người lực sĩ đang giữ quả tạ đứng yên.', 'Hòn bi đang lăn đều trên mặt sàn nằm ngang.', 'Máy xúc cát đang nâng khối cát lên cao.', 'Quyển sách nằm yên trên bàn.'],
    correctAnswer: 2,
    explanation: (
      <span>Công cơ học chỉ sinh ra khi có lực tác dụng và vật chuyển động theo phương không vuông góc với lực. Khi máy xúc nâng khối cát, lực nâng làm cát chuyển động lên trên, do đó có thực hiện công.</span>
    )
  }
];

export const CongSuatSimulation = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'practice'>('controls');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Physics State
  const [mass, setMass] = useState<number>(50); // kg
  const [height, setHeight] = useState<number>(5); // m
  const [duration, setDuration] = useState<number>(5); // s
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const controls = useAnimation();

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Xin chào! Mình là Trợ lý Cần Cẩu, sẵn sàng giúp bạn tính Công và Công suất.' }
  ]);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [quizStates, setQuizStates] = useState<Record<number, 'correct' | 'incorrect' | null>>({});

  // Derived Physics
  const force = 10 * mass; // F = P = 10.m
  const work = force * height;
  const power = work / duration;

  // View scale
  const pixelsPerMeter = 30; // 1m = 30px visually
  const maxPossibleHeight = 10;
  const craneBaseY = maxPossibleHeight * pixelsPerMeter + 100;

  useEffect(() => {
    // Reset position when inputs change
    if (!isPlaying) {
      controls.stop();
      controls.set({ y: 0 });
      setHasCompleted(false);
    }
  }, [mass, height, duration, isPlaying, controls]);

  const toggleSimulation = async () => {
    if (isPlaying) {
      // Pause or stop not strictly required, but let's reset
      setIsPlaying(false);
      controls.stop();
      controls.set({ y: 0 });
      setHasCompleted(false);
      return;
    }

    if (hasCompleted) {
      // Reset first
      controls.set({ y: 0 });
      setHasCompleted(false);
    }

    setIsPlaying(true);
    
    // Animate up
    await controls.start({
      y: -height * pixelsPerMeter,
      transition: { duration: duration, ease: "linear" }
    });
    
    setIsPlaying(false);
    setHasCompleted(true);
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setHasCompleted(false);
    controls.stop();
    controls.set({ y: 0 });
  };

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
      let reply = `Với khối lượng ${mass}kg nâng lên ${height}m trong ${duration}s:\n`;
      reply += `- Lực nâng F = ${force} N\n`;
      reply += `- Công A = ${work} J\n`;
      reply += `- Công suất 𝒫 = ${power.toFixed(1)} W.\n`;
      
      if (userMsg.toLowerCase().includes('công suất')) {
        reply += `Nhớ nhé, công suất đặc trưng cho tốc độ thực hiện công!`;
      }
      
      setChatMessages(prev => [...prev, { role: 'ai', content: reply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-row overflow-hidden font-sans">
      
      {/* LEFT PANEL : SIMULATION */}
      <div className="flex-1 relative bg-[#f8fafc] flex flex-col justify-end items-center pb-12">
        <button 
          onClick={onBack} 
          className="absolute top-4 left-4 z-50 p-3 bg-white/60 hover:bg-white backdrop-blur rounded-full shadow-sm text-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Crane Visual */}
        <div className="relative w-[300px] flex justify-center items-end overflow-visible" style={{ height: craneBaseY }}>
          {/* Support pillar */}
          <div className="absolute bottom-0 left-4 w-6 h-full bg-amber-600 rounded-t-lg shadow-inner z-10"></div>
          
          {/* Horizontal arm */}
          <div className="absolute top-8 left-4 w-full h-8 bg-amber-500 rounded-r-lg shadow-sm z-20"></div>

          {/* Cable box container mapping height */}
          <div className="absolute top-[40px] left-[50%] -translate-x-1/2 flex flex-col items-center bottom-0 overflow-hidden" style={{ width: '100px' }}>
            {/* The moving container */}
            <motion.div 
                className="absolute z-30 flex flex-col items-center w-full"
                animate={controls}
                initial={{ y: 0 }}
                // default position at the bottom of the crane arm height
                style={{ top: maxPossibleHeight * pixelsPerMeter - 24 }} 
            >
               {/* Rope piece extending up */}
               <div className="w-[3px] bg-slate-800 absolute bottom-full left-1/2 -translate-x-1/2" style={{ height: 1000}}></div>
               
               {/* Box */}
               <div className="w-16 h-16 bg-blue-600 rounded-lg shadow-md flex items-center justify-center border-t-2 border-blue-400 relative">
                  <span className="text-white font-bold text-sm select-none">{mass}kg</span>
               </div>
            </motion.div>
          </div>
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-12 bg-slate-300 border-t-4 border-slate-400"></div>

      </div>

      {/* RIGHT PANEL : SIDEBAR */}
      <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col z-30 shadow-2xl shrink-0">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 shrink-0">
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
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          {activeTab === 'controls' ? (
             <div className="p-5 flex flex-col gap-5">
                
                {/* Main Action Buttons */}
                <div className="flex gap-2">
                   <button 
                     onClick={toggleSimulation}
                     className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all flex justify-center items-center gap-2"
                   >
                     <HardHat className="w-5 h-5 fill-current" />
                     {isPlaying ? 'Đang thực hiện...' : 'Nâng hàng'}
                   </button>
                   <button 
                     onClick={resetSimulation}
                     disabled={isPlaying}
                     className="w-14 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm transition-all flex justify-center items-center disabled:opacity-50"
                   >
                     <RotateCcw className="w-5 h-5" />
                   </button>
                </div>

                {/* Sliders Container */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-5 shadow-sm">
                   
                   {/* Mass Slider */}
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="text-sm font-bold text-slate-800">Khối lượng (m)</label>
                       <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{mass} kg</span>
                     </div>
                     <input 
                       type="range" 
                       min="10" max="200" step="10"
                       value={mass}
                       onChange={(e) => setMass(parseFloat(e.target.value))}
                       disabled={isPlaying}
                       className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                       <span>10kg</span>
                       <span>200kg</span>
                     </div>
                   </div>

                   {/* Height Slider */}
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="text-sm font-bold text-slate-800">Độ cao (h)</label>
                       <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{height} m</span>
                     </div>
                     <input 
                       type="range" 
                       min="1" max="10" step="1"
                       value={height}
                       onChange={(e) => setHeight(parseFloat(e.target.value))}
                       disabled={isPlaying}
                       className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                       <span>1m</span>
                       <span>10m</span>
                     </div>
                   </div>

                   {/* Duration Slider */}
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="text-sm font-bold text-slate-800">Thời gian (t)</label>
                       <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow-sm">{duration} s</span>
                     </div>
                     <input 
                       type="range" 
                       min="1" max="10" step="1"
                       value={duration}
                       onChange={(e) => setDuration(parseFloat(e.target.value))}
                       disabled={isPlaying}
                       className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                       <span>1s</span>
                       <span>10s</span>
                     </div>
                   </div>

                </div>

                {/* Calculation Cards */}
                <div className="flex flex-col gap-3">
                   <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col justify-center">
                     <p className="text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Lực nâng (F)</p>
                     <p className="text-2xl font-black text-blue-900 font-mono tracking-tight">{Math.round(force).toLocaleString()} <span className="text-sm font-normal text-blue-400">N</span></p>
                   </div>
                   <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex flex-col justify-center">
                     <p className="text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Công thực hiện (A)</p>
                     <p className="text-2xl font-black text-orange-900 font-mono tracking-tight">{Math.round(work).toLocaleString()} <span className="text-sm font-normal text-orange-400">J</span></p>
                   </div>
                   <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-center">
                     <p className="text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Công suất ({P_symbol})</p>
                     <p className="text-2xl font-black text-red-900 font-mono tracking-tight">{power.toFixed(1)} <span className="text-sm font-normal text-red-400">W</span></p>
                   </div>
                </div>

             </div>
          ) : (
             <div className="p-5 flex flex-col gap-4">
                {quizData.map((q) => (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                     <div className="flex gap-2 items-center mb-3">
                       <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded uppercase tracking-wider shadow-sm">{q.level}</span>
                     </div>
                     <p className="text-slate-800 font-medium mb-4 text-[15px] leading-relaxed">{q.question}</p>
                     <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100">
                       {q.options.map((opt, idx) => {
                          const isSelected = quizAnswers[q.id] === idx;
                          const state = quizStates[q.id];
                          
                          let btnClass = "p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ";
                          if (!isSelected) {
                            btnClass += "bg-white border-slate-200 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50/50 text-slate-600";
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
              <div className="bg-orange-500 p-4 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-3">
                   <div className="w-11 h-11 rounded-full bg-white/20 p-0.5 flex justify-center items-end overflow-hidden shadow-inner">
                     <img src="https://api.dicebear.com/7.x/micah/svg?seed=Crane&backgroundColor=transparent" alt="Avatar" className="w-9 h-9 object-cover" />
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-base">Trợ lý Cần Cẩu</h3>
                     <div className="flex items-center gap-1">
                       <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                       <p className="text-xs text-orange-100 font-medium tracking-wide">Trang thái trực tuyến</p>
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
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center mr-2 shrink-0 mt-1 shadow-sm">
                        <HardHat className="w-4 h-4 text-orange-600" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-[20px] rounded-tr-sm font-medium' : 'bg-white text-slate-700 rounded-[20px] border border-slate-100 rounded-tl-sm whitespace-pre-wrap'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Box */}
              <div className="p-3 bg-white border-t border-slate-100">
                 <div className="relative flex items-center bg-slate-50 rounded-full border border-slate-200 px-1 py-1 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
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
                     className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 flex items-center justify-center text-white transition-colors shrink-0 shadow-sm"
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
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-105 bg-orange-500 hover:bg-orange-600 animate-bounce"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
          </button>
        )}

      </div>
    </div>
  );
};
