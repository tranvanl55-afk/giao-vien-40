import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, CheckCircle2, XCircle, MessageCircle, X, Zap, Settings, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import { askGemini } from '../../lib/gemini';

const quizData = [
  {
    id: 1,
    level: 'Nhận biết',
    question: 'Trong đoạn mạch gồm hai điện trở R₁ và R₂ mắc nối tiếp, công thức tính điện trở tương đương là gì?',
    options: [
      <span key="1"><InlineMath math="R_{tđ} = \frac{R_1 \cdot R_2}{R_1 + R_2}" /></span>,
      <span key="2"><InlineMath math="R_{tđ} = R_1 + R_2" /></span>,
      <span key="3"><InlineMath math="R_{tđ} = \frac{1}{R_1} + \frac{1}{R_2}" /></span>,
      <span key="4"><InlineMath math="R_{tđ} = |R_1 - R_2|" /></span>
    ],
    correctAnswer: 1,
    explanation: (
      <span>Đối với mạch mắc nối tiếp, điện trở tương đương bằng tổng các điện trở thành phần: <strong><InlineMath math="R_{tđ} = R_1 + R_2" /></strong>.</span>
    )
  },
  {
    id: 2,
    level: 'Thông hiểu',
    question: 'Hai điện trở R₁ = 15Ω và R₂ = 30Ω được mắc song song. Điện trở tương đương của đoạn mạch là?',
    options: ['10Ω', '45Ω', '20Ω', '15Ω'],
    correctAnswer: 0,
    explanation: (
      <span>Áp dụng công thức mạch song song: <strong><InlineMath math="\frac{1}{R_{tđ}} = \frac{1}{R_1} + \frac{1}{R_2}" /></strong> 
      <br /> <InlineMath math="\Rightarrow R_{tđ} = \frac{15 \cdot 30}{15 + 30} = 10\Omega" />.</span>
    )
  },
  {
    id: 3,
    level: 'Thông hiểu',
    question: 'Một đoạn mạch gồm 2 điện trở R₁ = 10Ω và R₂ = 20Ω mắc nối tiếp vào nguồn điện U = 12V. Cường độ dòng điện qua mạch là bao nhiêu?',
    options: ['1.2A', '0.6A', '0.4A', '3.6A'],
    correctAnswer: 2,
    explanation: (
      <span>Điện trở tương đương của mạch nối tiếp: <strong><InlineMath math="R_{tđ} = R_1 + R_2 = 10 + 20 = 30\Omega" /></strong>. 
      <br /> Cường độ dòng điện: <strong><InlineMath math="I = \frac{U}{R_{tđ}} = \frac{12}{30} = 0.4A" /></strong>.</span>
    )
  },
  {
    id: 4,
    level: 'Vận dụng',
    question: 'Cho hai bóng đèn có điện trở R₁ = 60Ω và R₂ = 40Ω mắc song song vào hiệu điện thế U = 12V. Cường độ dòng điện qua mạch chính là?',
    options: ['0.2A', '0.3A', '0.5A', '0.12A'],
    correctAnswer: 2,
    explanation: (
      <span>Điện trở tương đương của mạch song song: <strong><InlineMath math="R_{tđ} = \frac{60 \cdot 40}{60 + 40} = 24\Omega" /></strong>.
      <br />Cường độ dòng điện qua mạch chính: <strong><InlineMath math="I = \frac{U}{R_{tđ}} = \frac{12}{24} = 0.5A" /></strong>.</span>
    )
  },
  {
    id: 5,
    level: 'Vận dụng',
    question: 'Đoạn mạch gồm 3 điện trở mắc nối tiếp R₁ = 5Ω, R₂ = 10Ω, R₃ = 15Ω. Nếu đặt hiệu điện thế 15V vào hai đầu đoạn mạch, hiệu điện thế trên R₂ là bao nhiêu?',
    options: ['2.5V', '5V', '7.5V', '15V'],
    correctAnswer: 1,
    explanation: (
      <span>Điện trở tương đương: <strong><InlineMath math="R_{tđ} = 5 + 10 + 15 = 30\Omega" /></strong>.<br />
      Cường độ dòng điện toàn mạch: <strong><InlineMath math="I = \frac{U}{R_{tđ}} = \frac{15}{30} = 0.5A" /></strong>.<br />
      Trong mạch nối tiếp, dòng điện qua các điện trở là như nhau. Hiệu điện thế trên R₂: <strong><InlineMath math="U_2 = I \cdot R_2 = 0.5 \cdot 10 = 5V" /></strong>.</span>
    )
  }
];

export const MachDienSimulation = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'practice'>('controls');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Physics State
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [numResistors, setNumResistors] = useState<1 | 2 | 3>(3);
  const [voltage, setVoltage] = useState<number>(12); // U
  const [r1, setR1] = useState<number>(10);
  const [r2, setR2] = useState<number>(10);
  const [r3, setR3] = useState<number>(10);

  // Derived Physics calculations
  let req = 0;
  if (circuitType === 'series') {
    req = r1 + (numResistors >= 2 ? r2 : 0) + (numResistors >= 3 ? r3 : 0);
  } else {
    let invReq = 0;
    if (r1 > 0) invReq += 1 / r1;
    if (numResistors >= 2 && r2 > 0) invReq += 1 / r2;
    if (numResistors >= 3 && r3 > 0) invReq += 1 / r3;
    req = invReq > 0 ? 1 / invReq : 0;
  }

  const currentI = req > 0 ? voltage / req : 0; // I = U/R
  
  // Animation speed based on current (clamped to avoid being too fast or zero)
  // Normal speed 2s per cycle. More current -> smaller duration.
  const animationDuration = currentI > 0 ? Math.max(0.2, 2 / Math.sqrt(currentI)) : 0;

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: React.ReactNode}[]>([
    { role: 'ai', content: 'Xin chào! Thầy là Trợ lý Vật lý ở đây. Em cứ tự do thay đổi mạch điện, hiệu điện thế hay điện trở nhé. Cần giúp gì cứ hỏi thầy!' }
  ]);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

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

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiThinking) return;
    
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsAiThinking(true);
    
    try {
      const systemInstruction = `Bạn là "Trợ lý Vật lý" thân thiện, chuẩn kiến thức, đóng vai thầy giáo hỗ trợ học sinh học phần Điện học (Định luật Ôm, Mạch nối tiếp, Mạch song song).
Thông số thực nghiệm thời gian thực trong mô phỏng hiện tại:
- Loại mạch: Mắc ${circuitType === 'series' ? 'Nối tiếp' : 'Song song'} với ${numResistors} điện trở
- Giá trị các điện trở: R1 = ${r1}Ω, R2 = ${r2}Ω${numResistors === 3 ? `, R3 = ${r3}Ω` : ''}
- Hiệu điện thế nguồn U: ${voltage}V
- Điện trở tương đương của toàn mạch Rtđ: ${req.toFixed(2)}Ω
- Cường độ dòng điện trong mạch chính I: ${currentI.toFixed(2)}A

Quy tắc trả lời:
1. Giải thích chính xác, rõ ràng bản chất vật lý (Định luật Ôm, công thức tính Rtđ, hiệu điện thế, cường độ dòng điện trong từng nhánh).
2. Khi câu hỏi liên quan đến mạch đang hiển thị, hãy liên hệ ngay với các giá trị thông số thực nghiệm (U=${voltage}V, Rtđ=${req.toFixed(1)}Ω, I=${currentI.toFixed(2)}A).
3. Xưng hô: "Thầy - em" hoặc thân thiện gần gũi, khích lệ học tập.
4. Trình bày bằng tiếng Việt, định dạng markdown rõ ràng, độ dài ngắn gọn (khoảng 2-4 câu).`;

      const reply = await askGemini(userMsg, systemInstruction);
      setChatMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (error) {
      console.error("AI error:", error);
      let replyText = "";
      if (userMsg.toLowerCase().includes('nối tiếp')) {
        replyText = `Trong đoạn mạch mắc nối tiếp, cường độ dòng điện đi qua các điện trở là như nhau. Điện trở tương đương của mạch hiện tại là Rtđ = ${req.toFixed(1)}Ω, dòng điện I = ${currentI.toFixed(2)}A.`;
      } else if (userMsg.toLowerCase().includes('song song')) {
        replyText = `Trong đoạn mạch mắc song song, hiệu điện thế giữa hai đầu các điện trở là như nhau và bằng hiệu điện thế nguồn U = ${voltage}V. Điện trở tương đương Rtđ = ${req.toFixed(1)}Ω, dòng điện mạch chính I = ${currentI.toFixed(2)}A.`;
      } else {
        replyText = `Với hiệu điện thế U = ${voltage}V và ${numResistors} điện trở mắc ${circuitType === 'series' ? 'nối tiếp' : 'song song'}, điện trở tương đương Rtđ = ${req.toFixed(1)}Ω, dòng điện qua mạch I = ${currentI.toFixed(2)}A.`;
      }
      setChatMessages(prev => [...prev, { role: 'ai', content: replyText }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Helper for drawing dashed line animation
  const FlowingWire = ({ d, strokeWidth = "2" }: { d: string, strokeWidth?: string }) => (
    <>
      {/* Base wire background */}
      <path d={d} fill="none" stroke="#334155" strokeWidth={strokeWidth} />
      {/* Animated dashed line representing electrons flow */}
      {currentI > 0 && (
         <motion.path 
           d={d} fill="none" stroke="#38bdf8" strokeWidth={strokeWidth}
           strokeDasharray="10 15"
           animate={{ strokeDashoffset: [-25, 0] }}
           transition={{ 
             duration: animationDuration, 
             repeat: Infinity, 
             ease: "linear" 
           }}
         />
      )}
    </>
  );

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
        <div className="relative w-[85%] max-w-225 aspect-video bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8">
          
          <div className="w-full grow flex justify-center items-center relative">
             <svg width="100%" height="100%" viewBox="0 0 800 400" className="overflow-visible">
               
               {/* ---------------- DRAWING CIRCUIT ---------------- */}
               <g transform="translate(100, 100)">
                 {/* Battery */}
                 <text x="-40" y="86" fill="#fbbf24" fontSize="18" fontWeight="bold" textAnchor="end">U = {voltage}V</text>
                 <line x1="0" y1="60" x2="0" y2="75" stroke="#fbbf24" strokeWidth="3" />
                 {/* Positive terminal (long, thin) */}
                 <line x1="-25" y1="75" x2="25" y2="75" stroke="#fbbf24" strokeWidth="3" />
                 
                 {/* Negative terminal (short, thick) */}
                 <line x1="-12" y1="85" x2="12" y2="85" stroke="#fbbf24" strokeWidth="8" />
                 
                 <line x1="0" y1="85" x2="0" y2="100" stroke="#fbbf24" strokeWidth="3" />
                 <text x="35" y="80" fill="#fbbf24" fontSize="20" fontWeight="bold">+</text>
                 <text x="35" y="94" fill="#fbbf24" fontSize="28" fontWeight="bold">-</text>
                 
                 {/* Main Loop Wires */}
                 <FlowingWire d="M 0 60 L 0 0 L 200 0" />
                 <FlowingWire d="M 0 100 L 0 160 L 600 160 L 600 0 L 500 0" />

                 {circuitType === 'series' && (
                    <>
                      {/* Resistor 1 */}
                      <g transform="translate(200, 0)">
                         <FlowingWire d="M 0 0 L 20 0" />
                         <rect x="20" y="-15" width="60" height="30" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" rx="4" />
                         <text x="50" y="5" fill="#e2e8f0" fontSize="14" textAnchor="middle" alignmentBaseline="middle">{r1}Ω</text>
                         <text x="50" y="-25" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">R1</text>
                         <FlowingWire d="M 80 0 L 100 0" />
                      </g>
                      
                      {/* Resistor 2 */}
                      {numResistors >= 2 ? (
                        <g transform="translate(300, 0)">
                           <FlowingWire d="M 0 0 L 20 0" />
                           <rect x="20" y="-15" width="60" height="30" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" rx="4" />
                           <text x="50" y="5" fill="#e2e8f0" fontSize="14" textAnchor="middle" alignmentBaseline="middle">{r2}Ω</text>
                           <text x="50" y="-25" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">R2</text>
                           <FlowingWire d="M 80 0 L 100 0" />
                        </g>
                      ) : (
                        <FlowingWire d="M 300 0 L 400 0" />
                      )}

                      {/* Resistor 3 */}
                      {numResistors >= 3 ? (
                        <g transform="translate(400, 0)">
                           <FlowingWire d="M 0 0 L 20 0" />
                           <rect x="20" y="-15" width="60" height="30" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" rx="4" />
                           <text x="50" y="5" fill="#e2e8f0" fontSize="14" textAnchor="middle" alignmentBaseline="middle">{r3}Ω</text>
                           <text x="50" y="-25" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">R3</text>
                           <FlowingWire d="M 80 0 L 100 0" />
                        </g>
                      ) : (
                        <FlowingWire d="M 400 0 L 500 0" />
                      )}
                    </>
                 )}

                 {circuitType === 'parallel' && (
                    <>
                      {/* Parallel structure lines */}
                      <FlowingWire d="M 200 0 L 250 0" />
                      <FlowingWire d="M 450 0 L 500 0" />
                      <line x1="250" y1={-60} x2="250" y2={numResistors === 1 ? -60 : (numResistors === 2 ? 60 : 60)} stroke="#334155" strokeWidth="2" />
                      <line x1="450" y1={-60} x2="450" y2={numResistors === 1 ? -60 : (numResistors === 2 ? 60 : 60)} stroke="#334155" strokeWidth="2" />
                      
                      {/* Junction dots */}
                      <circle cx="250" cy="0" r="4" fill="#94a3b8" />
                      <circle cx="450" cy="0" r="4" fill="#94a3b8" />

                      {/* Resistor 1 (Top branch) */}
                      <g transform="translate(250, -60)">
                         <FlowingWire d="M 0 0 L 50 0" />
                         <rect x="50" y="-15" width="100" height="30" fill="#1e1b4b" stroke="#ec4899" strokeWidth="2" rx="4" />
                         <text x="100" y="5" fill="#e2e8f0" fontSize="14" textAnchor="middle" alignmentBaseline="middle">{r1}Ω</text>
                         <text x="100" y="-25" fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">R1</text>
                         <FlowingWire d="M 150 0 L 200 0" />
                      </g>

                      {/* Resistor 2 (Middle branch) */}
                      {numResistors >= 2 && (
                        <g transform="translate(250, 0)">
                           <FlowingWire d="M 0 0 L 50 0" />
                           <rect x="50" y="-15" width="100" height="30" fill="#1e1b4b" stroke="#ec4899" strokeWidth="2" rx="4" />
                           <text x="100" y="5" fill="#e2e8f0" fontSize="14" textAnchor="middle" alignmentBaseline="middle">{r2}Ω</text>
                           <text x="100" y="-25" fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">R2</text>
                           <FlowingWire d="M 150 0 L 200 0" />
                        </g>
                      )}

                      {/* Resistor 3 (Bottom branch) */}
                      {numResistors >= 3 && (
                        <g transform="translate(250, 60)">
                           <FlowingWire d="M 0 0 L 50 0" />
                           <rect x="50" y="-15" width="100" height="30" fill="#1e1b4b" stroke="#ec4899" strokeWidth="2" rx="4" />
                           <text x="100" y="5" fill="#e2e8f0" fontSize="14" textAnchor="middle" alignmentBaseline="middle">{r3}Ω</text>
                           <text x="100" y="-25" fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">R3</text>
                           <FlowingWire d="M 150 0 L 200 0" />
                        </g>
                      )}
                    </>
                 )}
                 
                 {/* Current Label */}
                 <text x="300" y="190" fill="#38bdf8" fontSize="20" fontWeight="bold" textAnchor="middle">
                   I = {currentI.toFixed(2)}A
                 </text>

               </g>

             </svg>
          </div>
          
        </div>
      </div>

      {/* RIGHT PANEL : SIDEBAR */}
      <div className="w-112.5 bg-slate-50 border-l border-slate-200 flex flex-col z-30 shadow-2xl shrink-0">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 shrink-0 bg-white">
           <button 
             onClick={() => setActiveTab('controls')}
             className={`flex-1 flex justify-center items-center gap-2 py-4 font-bold text-sm tracking-wide uppercase transition-colors border-b-2 ${activeTab === 'controls' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             <Settings className="w-4 h-4" /> ĐIỀU KHIỂN
           </button>
           <button 
             onClick={() => setActiveTab('practice')}
             className={`flex-1 flex justify-center items-center gap-2 py-4 font-bold text-sm tracking-wide uppercase transition-colors border-b-2 ${activeTab === 'practice' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             <BookOpen className="w-4 h-4" /> LUYỆN TẬP
           </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'controls' ? (
             <div className="p-6 flex flex-col gap-6">
                
                {/* Circuit Type Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setCircuitType('series')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${circuitType === 'series' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:bg-slate-200/50'}`}
                  >
                    Mạch Nối Tiếp
                  </button>
                  <button 
                    onClick={() => setCircuitType('parallel')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${circuitType === 'parallel' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:bg-slate-200/50'}`}
                  >
                    Mạch Song Song
                  </button>
                </div>

                {/* Amount of Resistors */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                     <span className="text-slate-400">#</span> Số lượng điện trở
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(num => (
                      <button
                        key={num}
                        onClick={() => setNumResistors(num as 1 | 2 | 3)}
                        className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center transition-colors ${numResistors === num ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                   {/* Voltage Slider */}
                   <h3 className="flex items-center gap-2 font-bold text-slate-800 text-[15px]">
                     <Zap className="w-4 h-4 text-amber-500" />
                     Nguồn điện (U)
                   </h3>
                   <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-slate-700">Hiệu điện thế (V)</label>
                       <span className="text-sm font-bold text-amber-600 font-mono">{voltage} V</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="24" step="1"
                       value={voltage}
                       onChange={(e) => setVoltage(parseFloat(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                     />
                     <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                       <span>0V</span>
                       <span>24V</span>
                     </div>
                   </div>

                   <hr className="border-slate-100" />

                   {/* Resistors Sliders */}
                   <h3 className="flex items-center gap-2 font-bold text-slate-800 text-[15px]">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M4 12h3l3-7 4 14 3-7h3"/></svg>
                     Giá trị Điện trở
                   </h3>
                   
                   <div className="space-y-4">
                     <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                       <div className="flex justify-between items-center mb-3">
                         <label className="text-[13px] font-bold text-slate-700">Điện trở R1</label>
                         <span className="text-[13px] font-bold text-purple-600 font-mono">{r1} Ω</span>
                       </div>
                       <input 
                         type="range" 
                         min="1" max="100" step="1"
                         value={r1}
                         onChange={(e) => setR1(parseFloat(e.target.value))}
                         className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-500"
                       />
                       <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                         <span>1Ω</span>
                         <span>100Ω</span>
                       </div>
                     </div>

                     {numResistors >= 2 && (
                       <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                         <div className="flex justify-between items-center mb-3">
                           <label className="text-[13px] font-bold text-slate-700">Điện trở R2</label>
                           <span className="text-[13px] font-bold text-purple-600 font-mono">{r2} Ω</span>
                         </div>
                         <input 
                           type="range" 
                           min="1" max="100" step="1"
                           value={r2}
                           onChange={(e) => setR2(parseFloat(e.target.value))}
                           className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-500"
                         />
                         <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                           <span>1Ω</span>
                           <span>100Ω</span>
                         </div>
                       </div>
                     )}

                     {numResistors >= 3 && (
                       <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                         <div className="flex justify-between items-center mb-3">
                           <label className="text-[13px] font-bold text-slate-700">Điện trở R3</label>
                           <span className="text-[13px] font-bold text-purple-600 font-mono">{r3} Ω</span>
                         </div>
                         <input 
                           type="range" 
                           min="1" max="100" step="1"
                           value={r3}
                           onChange={(e) => setR3(parseFloat(e.target.value))}
                           className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-500"
                         />
                         <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                           <span>1Ω</span>
                           <span>100Ω</span>
                         </div>
                       </div>
                     )}
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
                            btnClass += "bg-white border-slate-200 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50 text-slate-600";
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
      <div className="fixed bottom-6 right-120 z-50 flex flex-col items-end">
        
        {/* Chat Window Popup */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white/95 backdrop-blur-xl w-87.5 h-125 mb-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-amber-500 p-4 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-3">
                   <div className="w-11 h-11 rounded-full bg-white/20 p-0.5 flex justify-center items-end overflow-hidden shadow-inner">
                     <img src="https://api.dicebear.com/7.x/micah/svg?seed=Teacher&backgroundColor=transparent" alt="Avatar" className="w-9 h-9 object-cover" />
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-base">Thầy Điện Tử</h3>
                     <div className="flex items-center gap-1">
                       <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                       <p className="text-xs text-amber-100 font-medium tracking-wide">Trạng thái trực tuyến</p>
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
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center mr-2 shrink-0 mt-1 shadow-sm overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/micah/svg?seed=Teacher&backgroundColor=transparent" alt="Avatar" className="w-6 h-6 object-cover" />
                      </div>
                    )}
                    <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-amber-500 text-white rounded-[20px] rounded-tr-sm font-medium' : 'bg-white text-slate-700 rounded-[20px] border border-slate-100 rounded-tl-sm'}`}>
                      {typeof msg.content === 'string' ? (
                        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-sans [&>p]:m-0 [&>p+p]:mt-1.5 [&>ul]:my-1 [&>ul]:pl-4 [&>ol]:my-1 [&>ol]:pl-4">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start items-center">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center mr-2 shrink-0 shadow-sm overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/micah/svg?seed=Teacher&backgroundColor=transparent" alt="Avatar" className="w-6 h-6 object-cover" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="p-3 bg-white border-t border-slate-100">
                 <div className="relative flex items-center bg-slate-50 rounded-full border border-slate-200 px-1 py-1 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                   <input 
                     type="text" 
                     value={chatInput}
                     onChange={e => setChatInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                     placeholder={isAiThinking ? "Đang suy nghĩ..." : "Hỏi gì đó..."}
                     disabled={isAiThinking}
                     className="w-full bg-transparent border-none outline-none py-2 px-4 text-sm text-slate-700 placeholder-slate-400 disabled:opacity-50"
                   />
                   <button 
                     onClick={handleSendMessage}
                     disabled={!chatInput.trim() || isAiThinking}
                     className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 flex items-center justify-center text-white transition-colors shrink-0 shadow-sm"
                   >
                     <Send className="w-4 h-4 -ml-0.5" />
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
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-105 bg-amber-500 hover:bg-amber-600 animate-bounce"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
          </button>
        )}

      </div>
    </div>
  );
};
