import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw, Send, CheckCircle2, XCircle, MessageCircle, X, Pause, Bot } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface SimulationData {
  time: number;
  height: number;
  velocity: number;
  potentialEnergy: number;
  kineticEnergy: number;
  totalEnergy: number;
}

const quizData = [
  {
    id: 1,
    level: 'Nhận biết',
    question: 'Khi thả vật rơi tự do, thế năng của vật sẽ thay đổi như thế nào?',
    options: ['Tăng dần', 'Giảm dần', 'Không đổi', 'Lúc tăng lúc giảm'],
    correctAnswer: 1,
  },
  {
    id: 2,
    level: 'Thông hiểu',
    question: 'Động năng của vật đang rơi tự do tăng lên vì đại lượng nào sau đây tăng?',
    options: ['Khối lượng', 'Độ cao', 'Gia tốc', 'Vận tốc'],
    correctAnswer: 3,
  },
  {
    id: 3,
    level: 'Vận dụng',
    question: 'Tại vị trí nào thì Động năng bằng Thế năng?',
    options: ['h = h0', 'h = h0/2', 'h = 0', 'h = h0/4'],
    correctAnswer: 1,
  }
];

export const CoNangSimulation = ({ onBack }: { onBack: () => void }) => {
  // Constants
  const g = 10;
  const MAX_HEIGHT_SCALE = 50;

  // View State
  const [activeTab, setActiveTab] = useState<'controls' | 'practice'>('controls');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Physics State
  const [mass, setMass] = useState<number>(2); // 0.5 - 10kg
  const [initialHeight, setInitialHeight] = useState<number>(40); // 5 - 50m
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Chào em, thầy là Trợ lý Cơ năng. Em có câu hỏi gì về quá trình rơi của vật không?' }
  ]);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [quizStates, setQuizStates] = useState<Record<number, 'correct' | 'incorrect' | null>>({});

  // Physics calculation
  // y = 5 * t^2 => t_max = sqrt(initialHeight / 5)
  const maxTime = Math.sqrt(initialHeight / 5);
  
  const currentHeight = Math.max(0, initialHeight - 5 * time * time);
  const currentVelocity = 10 * time; // v = gt
  
  const potentialEnergy = mass * g * currentHeight;
  const kineticEnergy = 0.5 * mass * currentVelocity * currentVelocity;
  const totalEnergy = mass * g * initialHeight;

  // Chart data pre-calculation
  const chartData = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxTime;
    const h = Math.max(0, initialHeight - 5 * t * t);
    const v = 10 * t;
    const wt = mass * g * h;
    const wd = 0.5 * mass * v * v;
    chartData.push({
      time: t.toFixed(2),
      'Thế năng': Math.round(wt),
      'Động năng': Math.round(wd),
      'Cơ năng': Math.round(mass * g * initialHeight),
    });
  }

  // Animation Loop
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  const updateSimulation = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    setTime((prev) => {
      const nextTime = Math.min(prev + deltaTime, maxTime);
      if (nextTime >= maxTime) {
        setIsRunning(false);
      }
      return nextTime;
    });

    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    }
  };

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(updateSimulation);
    } else {
      lastTimeRef.current = undefined; // Reset time tracking when paused
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, maxTime]);

  const toggleSimulation = () => {
    if (time >= maxTime) {
      setTime(0);
    }
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
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
    
    // Simple AI logic response based on prompt requirements
    setTimeout(() => {
      const w = Math.round(totalEnergy);
      const wt = Math.round(potentialEnergy);
      const wd = Math.round(kineticEnergy);
      const h = currentHeight.toFixed(2);
      
      let reply = `Tại độ cao ${h}m, thế năng của vật là ${wt}J, động năng là ${wd}J. `;
      
      if (userMsg.toLowerCase().includes('cơ năng')) {
        reply += `Vì bỏ qua lực cản không khí, cơ năng bảo toàn và luôn bằng ${w}J.`;
      } else if (userMsg.toLowerCase().includes('động năng')) {
        reply += `Động năng tỷ lệ thuận với bình phương vận tốc, nên càng rơi nhanh động năng càng lớn.`;
      } else if (userMsg.toLowerCase().includes('thế năng')) {
        reply += `Thế năng phụ thuộc vào độ cao, rơi càng thấp thì thế năng càng giảm.`;
      }
      
      setChatMessages(prev => [...prev, { role: 'ai', content: reply }]);
    }, 600);
  };

  // Reusable component parts
  const renderRuler = () => {
    const ticks = [];
    for (let i = 0; i <= MAX_HEIGHT_SCALE; i += 5) {
      const bottomPercent = (i / MAX_HEIGHT_SCALE) * 100;
      ticks.push(
        <div key={i} className="absolute w-full flex items-center justify-end pr-2" style={{ bottom: `${bottomPercent}%`, transform: 'translateY(50%)' }}>
          <span className="text-[10px] text-slate-500 font-mono mr-1">{i}m</span>
          <div className="w-4 h-px bg-slate-300"></div>
        </div>
      );
    }
    return ticks;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-row overflow-hidden font-sans">
      
      {/* LEFT PANEL : SIMULATION */}
      <div className="flex-1 relative bg-[#e6f4fc] flex flex-col">
        {/* Top Controls Overlay */}
        <button 
          onClick={onBack} 
          className="absolute top-4 left-4 z-50 p-3 bg-white/60 hover:bg-white backdrop-blur rounded-full shadow-sm text-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Info Panel Top Left */}
        <div className="absolute top-20 left-16 z-10 bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-100 font-serif">
           <p className="text-[14px] text-slate-600 mb-2 flex justify-between gap-4">
             <span>Độ cao:</span> 
             <span className="font-bold text-slate-900">{currentHeight.toFixed(2)}m</span>
           </p>
           <p className="text-[14px] text-slate-600 flex justify-between gap-4">
             <span>Vận tốc:</span> 
             <span className="font-bold text-slate-900">{currentVelocity.toFixed(2)}m/s</span>
           </p>
        </div>

        {/* The Physics World Canvas */}
        <div className="relative flex-1 ml-4 mt-12 mb-0">
           {/* Y Axis Ruler */}
           <div className="absolute left-0 top-0 bottom-0 w-20 border-r border-slate-300 pointer-events-none">
              {renderRuler()}
           </div>
           
           {/* Object Play Area */}
           <div className="absolute left-20 right-0 top-0 bottom-0">
              {/* Ball */}
              <div 
                className="absolute w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-[0_4px_15px_rgba(239,68,68,0.4)] z-20 transition-none"
                style={{ 
                  left: '35%', 
                  bottom: `${(currentHeight / MAX_HEIGHT_SCALE) * 100}%`, 
                  transform: 'translate(-50%, 50%)' // Center exactly on the line
                }} 
              >
                 {mass}kg
              </div>
           </div>
        </div>

        {/* Ground */}
        <div className="h-20 bg-[#22c55e] w-full border-t-8 border-[#16a34a] relative z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"></div>
      </div>

      {/* RIGHT PANEL : SIDEBAR */}
      <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col z-30 shadow-2xl shrink-0">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
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
             <div className="p-4 flex flex-col gap-4 min-h-full">
                
                {/* Main Action Buttons */}
                <div className="flex gap-2">
                   <button 
                     onClick={toggleSimulation}
                     className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-2.5 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all flex justify-center items-center gap-2"
                   >
                     {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                     {isRunning ? 'Tạm dừng' : (time > 0 ? 'Tiếp tục' : 'Thả vật')}
                   </button>
                   <button 
                     onClick={resetSimulation}
                     className="w-12 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm transition-all flex justify-center items-center"
                   >
                     <RotateCcw className="w-5 h-5" />
                   </button>
                </div>

                {/* Sliders Container */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-4 shadow-sm">
                   
                   {/* Mass Slider */}
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="text-sm font-bold text-slate-800">Khối lượng (m)</label>
                       <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">{mass.toFixed(1)} kg</span>
                     </div>
                     <input 
                       type="range" 
                       min="0.5" max="10" step="0.5"
                       value={mass}
                       onChange={(e) => { setMass(parseFloat(e.target.value)); setTime(0); }}
                       disabled={isRunning}
                       className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                       <span>0.5kg</span>
                       <span>10kg</span>
                     </div>
                   </div>

                   {/* Height Slider */}
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="text-sm font-bold text-slate-800">Độ cao (h)</label>
                       <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">{initialHeight.toFixed(0)} m</span>
                     </div>
                     <input 
                       type="range" 
                       min="5" max="50" step="1"
                       value={initialHeight}
                       onChange={(e) => { setInitialHeight(parseFloat(e.target.value)); setTime(0); }}
                       disabled={isRunning}
                       className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                        <span>5m</span>
                        <span>50m</span>
                      </div>
                    </div>

                 </div>

                 {/* Energy Cards */}
                 <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex flex-col justify-center shadow-sm">
                      <p className="text-[10px] font-bold text-blue-600 mb-0.5 uppercase tracking-wider font-serif">Thế năng (Wt)</p>
                      <p className="text-xl font-black text-slate-800 font-mono tracking-tight">{Math.round(potentialEnergy)} <span className="text-xs font-normal text-slate-500">J</span></p>
                    </div>
                    <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-3 flex flex-col justify-center shadow-sm">
                      <p className="text-[10px] font-bold text-orange-600 mb-0.5 uppercase tracking-wider font-serif">Động năng (Wđ)</p>
                      <p className="text-xl font-black text-slate-800 font-mono tracking-tight">{Math.round(kineticEnergy)} <span className="text-xs font-normal text-slate-500">J</span></p>
                    </div>
                    <div className="col-span-2 bg-purple-50/70 border border-purple-100 rounded-xl p-3 flex flex-col justify-center relative shadow-sm overflow-hidden">
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <p className="text-[10px] font-bold text-purple-600 mb-0.5 uppercase tracking-wider font-serif">Cơ năng (W)</p>
                      <p className="text-xl font-black text-slate-800 font-mono tracking-tight">{Math.round(totalEnergy)} <span className="text-xs font-normal text-slate-500">J</span></p>
                    </div>
                 </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex-1 min-h-[130px] flex flex-col mt-4">
                   <h3 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">Đồ thị Năng lượng</h3>
                   <div className="w-full flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: -5, left: -25 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickFormatter={(val) => `${val}s`} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <RechartsTooltip 
                             contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', padding: '4px 8px' }} 
                          />
                          <Line type="monotone" dataKey="Thế năng" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                          <Line type="monotone" dataKey="Động năng" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                          <Line type="monotone" dataKey="Cơ năng" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                          
                          {/* Live Indicator Point */}
                          <Line 
                              type="monotone" 
                              dataKey={(data) => data.time === time.toFixed(2) ? data['Cơ năng'] : null} 
                              stroke="#64748b" 
                              strokeWidth={0} 
                              dot={{ r: 3, fill: "#64748b", stroke: "#fff", strokeWidth: 1.5 }} 
                              isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>

             </div>
          ) : (
             <div className="p-6 flex flex-col gap-4">
                {quizData.map((q) => (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                     <div className="flex gap-2 items-center mb-3">
                       <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">{q.level}</span>
                     </div>
                     <p className="text-slate-800 font-medium mb-4">{q.question}</p>
                     <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-4">
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
                              <span><span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span> {opt}</span>
                              {isSelected && state === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                              {isSelected && state === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
                            </button>
                          )
                       })}
                     </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>

      {/* FLOATING CHAT WIDGET */}
      <div className="fixed bottom-6 right-[480px] z-50 flex flex-col items-end">
        
        {/* Chat Window Popup */}
        {isChatOpen && (
          <div className="bg-white/90 backdrop-blur-xl w-[350px] h-[500px] mb-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-linear-to-r from-orange-500 to-amber-500 p-4 flex items-center gap-3 shrink-0 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
               <div className="w-10 h-10 rounded-full bg-white flex justify-center items-end pt-1 shadow-inner relative z-10">
                  <img src="https://api.dicebear.com/7.x/micah/svg?seed=Teacher&backgroundColor=transparent" alt="Gia sư AI" className="w-9 h-9 object-cover" />
               </div>
               <div className="relative z-10">
                 <h3 className="font-bold text-white text-base">Trợ lý Cơ năng</h3>
                 <div className="flex items-center gap-1">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   <p className="text-[10px] text-orange-100 font-medium tracking-wide">Trực tuyến</p>
                 </div>
               </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-4 custom-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-2 shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-2xl rounded-tr-sm font-medium' : 'bg-white text-slate-700 rounded-2xl border border-slate-100 rounded-tl-sm'}`}>
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
                   placeholder="Hỏi về cơ năng..."
                   className="w-full bg-transparent border-none outline-none py-2 px-4 text-sm text-slate-700 placeholder-slate-400"
                 />
                 <button 
                   onClick={handleSendMessage}
                   disabled={!chatInput.trim()}
                   className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 flex items-center justify-center text-white transition-colors shrink-0"
                 >
                   <Send className="w-4 h-4 ml-[-2px]" />
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-105 ${isChatOpen ? 'bg-slate-800' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 fill-current" />}
        </button>

      </div>
    </div>
  );
};

