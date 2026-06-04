import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, ChevronRight, BrainCircuit, Maximize, Minimize, Activity, ChevronLeft, TrendingUp, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- QUIZ DATA ---
const QUIZ_QUESTIONS = [
  {
    question: "Trục nằm ngang (trục hoành) trong đồ thị quãng đường - thời gian biểu diễn đại lượng nào?",
    options: ["Vận tốc", "Thời gian", "Quãng đường", "Gia tốc"],
    answer: 1
  },
  {
    question: "Đường biểu diễn song song với trục thời gian cho biết điều gì?",
    options: ["Vật đang chuyển động đều", "Vật đang tăng tốc", "Vật đang đứng yên", "Vật đang quay lại"],
    answer: 2
  },
  {
    question: "Đồ thị quãng đường - thời gian của một vật chuyển động đều có dạng là:",
    options: ["Một đường cong", "Một đoạn thẳng nằm ngang", "Một đoạn thẳng nghiêng góc", "Một đường tròn"],
    answer: 2
  },
  {
    question: "Công thức nào dùng để tính tốc độ của chuyển động từ đồ thị quãng đường - thời gian?",
    options: ["v = s × t", "v = t / s", "v = s / t", "v = s + t"],
    answer: 2
  },
  {
    question: "Trục thẳng đứng (trục tung) biểu diễn đại lượng nào?",
    options: ["Vận tốc", "Thời gian", "Quãng đường", "Gia tốc"],
    answer: 2
  }
];

type MotionType = 'uniform' | 'accelerating' | 'combined' | 'custom';

type DataPoint = { t: number; s: number };

// --- MAIN COMPONENT ---
export function DoThiQuangDuongThoiGian({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'simulation' | 'quiz'>('simulation');
  
  // Fullscreen State
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // --- SIMULATION STATE ---
  const [motionType, setMotionType] = useState<MotionType>('combined');
  const [data, setData] = useState<DataPoint[]>([]);
  const [step, setStep] = useState(0);

  const generateData = (type: MotionType = motionType) => {
    const newData: DataPoint[] = [{ t: 0, s: 0 }];

    if (type === 'uniform') {
      const speeds = [30, 40, 50, 60, 80];
      const v = speeds[Math.floor(Math.random() * speeds.length)];
      for (let i = 1; i <= 6; i++) {
        newData.push({ t: i, s: v * i });
      }
    } else if (type === 'accelerating') {
      const accel = [10, 15, 20];
      const a = accel[Math.floor(Math.random() * accel.length)];
      for (let i = 1; i <= 6; i++) {
        newData.push({ t: i, s: Math.round(0.5 * a * i * i) });
      }
    } else if (type === 'custom') {
      for (let i = 1; i <= 6; i++) {
        newData.push({ t: i, s: i * 10 });
      }
    } else {
      const speeds = [30, 40, 50, 60];
      const t1 = Math.floor(Math.random() * 3) + 1;
      const v1 = speeds[Math.floor(Math.random() * speeds.length)];
      let currentS = 0;
      for (let i = 1; i <= t1; i++) {
        currentS += v1;
        newData.push({ t: i, s: currentS });
      }
      const t2 = Math.floor(Math.random() * 2) + 1;
      for (let i = 1; i <= t2; i++) {
        newData.push({ t: t1 + i, s: currentS });
      }
      const t3 = 6 - (t1 + t2);
      if (t3 > 0) {
        const v2 = speeds[Math.floor(Math.random() * speeds.length)];
        for (let i = 1; i <= t3; i++) {
          currentS += v2;
          newData.push({ t: t1 + t2 + i, s: currentS });
        }
      } else {
        while (newData.length <= 6) {
          newData.push({ t: newData.length, s: currentS });
        }
      }
    }

    setData(newData);
    setStep(0);
  };

  useEffect(() => {
    if (data.length === 0) generateData();
  }, []);

  const maxT = data.length > 0 ? Math.max(...data.map(d => d.t)) : 6;
  const tMaxAxis = Math.max(6, Math.ceil(maxT));
  const xTicks = Array.from({ length: tMaxAxis + 1 }, (_, i) => i);

  const totalPoints = data.length - 1;
  const maxStep = totalPoints + 2;

  // --- SVG CALCULATIONS ---
  const maxS = data.length > 0 ? Math.max(...data.map(d => d.s)) : 300;
  const sMaxAxis = Math.max(60, Math.ceil(maxS / 60) * 60 + 60);

  const width = 700;
  const height = 450;
  const margin = { top: 40, right: 40, bottom: 60, left: 80 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const getX = (t: number) => margin.left + (t / tMaxAxis) * graphWidth;
  const getY = (s: number) => height - margin.bottom - (s / sMaxAxis) * graphHeight;

  const yTickInterval = sMaxAxis / 6;
  const yTicks = Array.from({ length: 7 }, (_, i) => i * yTickInterval);

  // Motion type label
  const motionLabels: Record<MotionType, string> = {
    uniform: 'Chuyển động đều',
    accelerating: 'Nhanh dần đều',
    combined: 'Kết hợp (đều + nghỉ + đều)',
    custom: 'Tự nhập số liệu'
  };

  // Step description without $ signs
  const getStepDesc = () => {
    if (step === 0) {
      return (
        <p className="animate-fadeIn">
          <strong>Bước 1:</strong> Vẽ 2 đoạn thẳng <span className="font-mono font-bold text-slate-700">Os</span> và <span className="font-mono font-bold text-slate-700">Ot</span> vuông góc với nhau tạo thành 2 trục tọa độ. Trục đứng biểu diễn quãng đường <span className="font-mono">(s)</span>, trục ngang biểu diễn thời gian <span className="font-mono">(t)</span>.
        </p>
      );
    }
    if (step >= 1 && step <= totalPoints) {
      return (
        <p className="animate-fadeIn text-purple-700">
          <strong>Bước 2:</strong> Từ <span className="font-mono font-bold">t = {data[step]?.t} (h)</span> trên trục hoành và <span className="font-mono font-bold">s = {data[step]?.s} (km)</span> trên trục tung, dóng các đường vuông góc xác định điểm biểu diễn.
        </p>
      );
    }
    if (step === maxStep - 1) {
      return (
        <p className="animate-fadeIn text-blue-600">
          <strong>Bước 3:</strong> Nối các điểm lại với nhau ta nhận được đường biểu diễn đồ thị quãng đường - thời gian.
        </p>
      );
    }
    if (step === maxStep) {
      return (
        <div className="animate-fadeIn p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2 mt-2">
          <p className="font-bold text-emerald-800 uppercase text-xs tracking-wider">Nhận xét</p>
          <ul className="list-disc pl-4 text-emerald-700 space-y-1 text-sm">
            {data.map((d, i) => {
              if (i === 0) return null;
              const prev = data[i - 1];
              if (d.s > prev.s) {
                return <li key={i}>Từ t = {prev.t}h đến t = {d.t}h: Đồ thị đi lên → Vật chuyển động.</li>;
              } else {
                return <li key={i}>Từ t = {prev.t}h đến t = {d.t}h: Đồ thị nằm ngang → Vật đứng yên.</li>;
              }
            })}
          </ul>
        </div>
      );
    }
    return null;
  };

  // --- QUIZ STATE ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleQuizAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === QUIZ_QUESTIONS[currentQuestion].answer) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleMotionTypeChange = (type: MotionType) => {
    setMotionType(type);
    generateData(type);
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans text-slate-800 animate-fadeIn">
      {/* HEADER */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-cyan-600 transition-all border border-slate-200/50 shadow-xs">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase font-heading">
            <Activity className="w-6 h-6 text-purple-600" /> Đồ Thị Quãng Đường
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 shadow-xs">
            <button 
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'simulation' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Mô Phỏng
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Luyện Tập
            </button>
          </div>
          <button 
            onClick={toggleFullscreen} 
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all border border-slate-200/50 shadow-xs"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {activeTab === 'simulation' && (
        <div className="flex-1 mt-20 flex flex-col gap-4 p-6 overflow-y-auto max-w-7xl mx-auto w-full">

          {/* MOTION TYPE SELECTOR */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-slate-800">Chọn loại chuyển động</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {(['uniform', 'accelerating', 'combined', 'custom'] as MotionType[]).map(type => (
                <button
                  key={type}
                  onClick={() => handleMotionTypeChange(type)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                    motionType === type
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600'
                  }`}
                >
                  {motionType === type && <span className="mr-1.5">✓</span>}
                  {motionLabels[type]}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <span className="font-semibold">Loại:</span>
                <span className="font-bold text-purple-700">{motionLabels[motionType]}</span>
              </div>
            </div>
          </div>

          {/* TOP PANEL - DATA TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full shrink-0">
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                Bảng ghi quãng đường đi được theo thời gian
                {motionType === 'custom' && <Edit3 className="w-4 h-4 text-purple-500" />}
              </h2>
              {motionType !== 'custom' && (
                <button onClick={() => generateData()} className="p-2 bg-white rounded-lg shadow-xs hover:bg-purple-50 text-purple-600 transition-colors" title="Tạo đề mới">
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-center border-collapse">
                <tbody>
                  <tr>
                    <th className="border border-slate-300 bg-orange-100 text-orange-800 p-2 font-bold whitespace-nowrap min-w-[120px]">Thời gian (h)</th>
                    {data.map((d, i) => (
                      <td key={`t-${i}`} className={`border border-slate-300 p-2 font-medium text-slate-700 min-w-[60px] ${step >= i && i !== 0 ? 'bg-purple-50' : ''} transition-colors duration-300`}>
                        {motionType === 'custom' && i > 0 ? (
                          <input 
                            type="number" 
                            className="w-16 p-1 text-center border border-purple-300 rounded focus:outline-hidden focus:ring-2 focus:ring-purple-500" 
                            value={d.t} 
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const newData = [...data];
                              newData[i].t = isNaN(val) ? 0 : val;
                              setData(newData);
                              setStep(0);
                            }}
                          />
                        ) : d.t}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="border border-slate-300 bg-orange-100 text-orange-800 p-2 font-bold whitespace-nowrap">Quãng đường (km)</th>
                    {data.map((d, i) => (
                      <td key={`s-${i}`} className={`border border-slate-300 p-2 font-bold text-slate-800 min-w-[60px] ${step >= i && i !== 0 ? 'bg-purple-50' : ''} transition-colors duration-300`}>
                        {motionType === 'custom' && i > 0 ? (
                          <input 
                            type="number" 
                            className="w-16 p-1 text-center border border-purple-300 rounded focus:outline-hidden focus:ring-2 focus:ring-purple-500" 
                            value={d.s} 
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const newData = [...data];
                              newData[i].s = isNaN(val) ? 0 : val;
                              setData(newData);
                              setStep(0);
                            }}
                          />
                        ) : d.s}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full flex-1 min-h-[400px]">
            {/* LEFT PANEL - INSTRUCTIONS */}
            <div className="w-full md:w-1/3 flex flex-col shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Hướng dẫn vẽ đồ thị
                </h3>
                
                <div className="text-sm text-slate-600 font-medium space-y-3 flex-1 overflow-y-auto pr-2">
                  {getStepDesc()}
                </div>

                <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 mt-4 shrink-0">
                  <button 
                    onClick={() => setStep(s => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" /> Lùi
                  </button>
                  <div className="font-bold text-slate-500 text-sm">
                    {step} / {maxStep}
                  </div>
                  <button 
                    onClick={() => setStep(s => Math.min(maxStep, s + 1))}
                    disabled={step === maxStep}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-md transition-colors"
                  >
                    Tiến <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - SVG GRAPH */}
            <div className="flex-1 w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center p-4 relative min-h-[400px]">
              <svg 
                width="100%" 
                height="100%" 
                viewBox={`0 0 ${width} ${height}`} 
                preserveAspectRatio="xMidYMid meet"
                className="max-w-full max-h-full font-sans"
              >
                {/* Lưới tọa độ */}
                {step >= 0 && (
                  <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4">
                    {yTicks.map((tick, i) => (
                      <line key={`hy-${i}`} x1={margin.left} y1={getY(tick)} x2={width - margin.right} y2={getY(tick)} />
                    ))}
                    {xTicks.map((tick, i) => (
                      <line key={`vx-${i}`} x1={getX(tick)} y1={margin.top} x2={getX(tick)} y2={height - margin.bottom} />
                    ))}
                  </g>
                )}

                {/* Trục tung và hoành */}
                {step >= 0 && (
                  <g>
                    {/* Trục tung Os (hướng lên) */}
                    <line x1={margin.left} y1={height - margin.bottom} x2={margin.left} y2={margin.top - 20} stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />
                    <text x={margin.left - 10} y={margin.top - 22} fill="#334155" fontSize="14" fontWeight="bold" textAnchor="end">s (km)</text>

                    {/* Trục hoành Ot (hướng sang phải) */}
                    <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right + 20} y2={height - margin.bottom} stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />
                    <text x={width - margin.right + 22} y={height - margin.bottom + 5} fill="#334155" fontSize="14" fontWeight="bold" textAnchor="start">t (h)</text>

                    {/* Tick labels */}
                    {yTicks.map((tick, i) => (
                      <text key={`yt-${i}`} x={margin.left - 15} y={getY(tick) + 5} fill="#64748b" fontSize="12" fontWeight="600" textAnchor="end">
                        {Math.round(tick)}
                      </text>
                    ))}
                    {xTicks.map((tick, i) => (
                      <text key={`xt-${i}`} x={getX(tick)} y={height - margin.bottom + 20} fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">
                        {tick}
                      </text>
                    ))}
                    <text x={margin.left - 10} y={height - margin.bottom + 15} fill="#334155" fontSize="14" fontWeight="bold" textAnchor="end">O</text>
                  </g>
                )}

                {/* Draw Origin Point (0,0) immediately */}
                {step >= 0 && data.length > 0 && (
                  <g>
                    <circle cx={getX(data[0].t)} cy={getY(data[0].s)} r="5" fill="#c026d3" />
                    <text x={getX(data[0].t) + 10} y={getY(data[0].s) - 10} fill="#c026d3" fontSize="12" fontWeight="bold">
                      ({data[0].t}, {data[0].s})
                    </text>
                  </g>
                )}

                {/* Data points & Dashed lines (Step 1 to totalPoints) */}
                <AnimatePresence>
                  {data.map((d, i) => {
                    if (i === 0 || step < i) return null;
                    return (
                      <g key={`point-${i}`}>
                        {/* Dóng trục t - Animating y2 avoids SVG dasharray glitch */}
                        <motion.line
                          initial={{ y2: height - margin.bottom }}
                          animate={{ y2: getY(d.s) }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          x1={getX(d.t)} y1={height - margin.bottom}
                          x2={getX(d.t)}
                          stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="6 4"
                        />
                        {/* Dóng trục s - Animating x2 avoids SVG dasharray glitch */}
                        <motion.line
                          initial={{ x2: margin.left }}
                          animate={{ x2: getX(d.t) }}
                          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                          x1={margin.left} y1={getY(d.s)}
                          y2={getY(d.s)}
                          stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="6 4"
                        />
                        {/* Chấm tròn điểm giao */}
                        <motion.circle
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5, type: "spring" }}
                          cx={getX(d.t)} cy={getY(d.s)} r="5" fill="#c026d3"
                        />
                        {/* Đánh số điểm với toạ độ thực */}
                        <motion.text
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                          x={getX(d.t) + 10} y={getY(d.s) - 10} fill="#c026d3" fontSize="12" fontWeight="bold"
                        >
                          ({d.t}, {d.s})
                        </motion.text>
                      </g>
                    );
                  })}
                </AnimatePresence>

                {/* Lines connecting points */}
                {step >= maxStep - 1 && (
                  <g>
                    {data.map((d, i) => {
                      if (i === 0) return null;
                      const prev = data[i - 1];
                      const isMoving = d.s > prev.s;
                      
                      return (
                        <motion.line
                          key={`line-${i}`}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: i * 0.2 }}
                          x1={getX(prev.t)} y1={getY(prev.s)}
                          x2={getX(d.t)} y2={getY(d.s)}
                          stroke={isMoving ? "#3b82f6" : "#f43f5e"}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </g>
                )}

                {/* SVG Definitions */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                  </marker>
                </defs>
              </svg>

              {/* Motion type badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-purple-600/90 text-white text-xs font-bold rounded-full">
                {motionLabels[motionType]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="flex-1 mt-16 p-8 overflow-y-auto flex items-center justify-center">
          <div className="max-w-2xl w-full">
            {!showResult ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg text-slate-800">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <div className="text-purple-600 font-black flex items-center gap-2 text-lg font-heading">
                    <BrainCircuit className="w-6 h-6 animate-pulse" /> Trắc nghiệm Vẽ Đồ Thị
                  </div>
                  <div className="bg-slate-100 px-4 py-1.5 rounded-full text-xs font-extrabold text-slate-500 border border-slate-200/50">
                    Câu {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-8 leading-snug">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </h3>
                
                <div className="space-y-3">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[currentQuestion].answer;
                    let btnClass = "bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-700 font-semibold";
                    
                    if (selectedAnswer !== null) {
                      if (isCorrect) btnClass = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-xs";
                      else if (isSelected) btnClass = "bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-xs";
                      else btnClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedAnswer !== null}
                        onClick={() => handleQuizAnswer(idx)}
                        className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-lg text-slate-800">
                <div className="w-24 h-24 bg-linear-to-tr from-emerald-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase font-heading">Hoàn thành!</h2>
                <p className="text-lg text-slate-600 font-medium mb-8">Bạn đã trả lời đúng <b className="text-emerald-600 text-2xl font-black">{score}/{QUIZ_QUESTIONS.length}</b> câu hỏi.</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => { setCurrentQuestion(0); setScore(0); setShowResult(false); }}
                    className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all border border-slate-200 shadow-xs"
                  >
                    Làm lại
                  </button>
                  <button 
                    onClick={() => setActiveTab('simulation')}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Về Mô Phỏng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
