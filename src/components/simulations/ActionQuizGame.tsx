import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, BookOpen, Settings2, SkipForward, Maximize, Volume2, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionQuizGameProps {
  initialQuestions?: QuestionDef[];
  onBack: () => void;
}

type QuestionDef = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

const DEFAULT_SETUP = `Câu 1: Môi trường trong của cơ thể bao gồm những thành phần nào? | Máu, dịch mô và dịch bạch huyết | Máu, tế bào và dịch mô | Máu, dịch mô và nước | Máu và các cơ quan nội tạng | A
Câu 2: Khi cho tế bào hồng cầu vào dung dịch có nồng độ chất tan cao hơn trong hồng cầu thì hiện tượng gì sẽ xảy ra? | Tế bào giữ nguyên hình dạng | Tế bào bị phình to | Tế bào bị teo nhỏ | Tế bào bị vỡ ra | C
Câu 3: Theo bảng 33.1, ngưỡng giá trị thân nhiệt bình thường của người là bao nhiêu? | 37,5 - 39,5 độ C | 36 - 37,5 độ C | 35 - 36,5 độ C | 38 - 39 độ C | B
Câu 4: Nếu hàm lượng glucose trong máu thường xuyên ở mức cao (ví dụ 7,4 mmol/l) thì người đó có nguy cơ mắc bệnh gì? | Bệnh gout | Bệnh huyết áp cao | Bệnh đái tháo đường | Bệnh suy thận | C`;

const PRAISE_QUOTES = ["Tuyệt vời quá em ơi! 🎉", "Chúc mừng em, câu trả lời hoàn hảo! 🌟", "Thông minh xuất sắc luôn! 💎", "Quá chuẩn xác! Cố gắng phát huy nhé! 🚀", "Một câu trả lời không thể chuẩn hơn! 👏", "Rất tốt! Tự tin tiến lên câu tiếp theo nào! 💯"];

const ACTION_ICONS = [
  { label: 'Jumping Jacks\n(Nhảy vung tay)', imgUrl: 'https://img.upanhnhanh.com/02c4002f099f92b89a935a27be5978bb', emoji: '🤸', bgColor: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/40' },
  { label: 'Squat\n(Đứng lên ngồi xuống)', imgUrl: 'https://img.upanhnhanh.com/6e3584ec25e22cc979768c10f6835b69', emoji: '🏋️', bgColor: 'from-cyan-400 to-blue-600', shadow: 'shadow-blue-500/40' },
  { label: 'Giơ tay trái', imgUrl: 'https://img.upanhnhanh.com/04579b5b471c650e01536f1546c838db', emoji: '🙋', bgColor: 'from-emerald-400 to-green-600', shadow: 'shadow-emerald-500/40' },
  { label: 'Giơ tay phải', imgUrl: 'https://img.upanhnhanh.com/789ca5b92e831b0d58138f89a87bf4c6', emoji: '🙋‍♂️', bgColor: 'from-amber-400 to-orange-600', shadow: 'shadow-orange-500/40' },
];

export function ActionQuizGame({ initialQuestions, onBack }: ActionQuizGameProps) {
  const [phase, setPhase] = useState<'setup' | 'game' | 'end'>(
    initialQuestions && initialQuestions.length > 0 ? 'game' : 'setup'
  );
  
  // Setup phase states
  const [quizName, setQuizName] = useState('Vận Động Trí Tuệ');
  const [inputText, setInputText] = useState(DEFAULT_SETUP);
  const [questions, setQuestions] = useState<QuestionDef[]>(
    initialQuestions && initialQuestions.length > 0 ? initialQuestions : []
  );

  // Game phase states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [praise, setPraise] = useState('');
  const [teacherMood, setTeacherMood] = useState<'idle' | 'cheer' | 'celebrate'>('idle');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
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
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  const parseQuestions = () => {
    const lines = inputText.split('\n').filter(l => l.trim().length > 0);
    const parsed: QuestionDef[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 6) {
        const answerMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
        parsed.push({
          id: idx,
          question: parts[0],
          options: [parts[1], parts[2], parts[3], parts[4]],
          correctAnswer: answerMap[parts[5]] ?? 0
        });
      }
    });
    return parsed;
  };

  const handleStart = () => {
    const parsed = parseQuestions();
    if (parsed.length === 0) {
      alert("Vui lòng nhập ít nhất 1 câu hỏi đúng định dạng!");
      return;
    }
    setQuestions(parsed);
    setPhase('game');
    setCurrentIdx(0);
    setTimeLeft(15);
    setIsTimeUp(false);
    setPraise('');
    setTeacherMood('cheer');
    setSelectedOption(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'game' && !isTimeUp && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (phase === 'game' && timeLeft === 0 && !isTimeUp) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, phase, isTimeUp]);

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setTeacherMood('celebrate');
    setPraise(PRAISE_QUOTES[Math.floor(Math.random() * PRAISE_QUOTES.length)]);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(15);
      setIsTimeUp(false);
      setPraise('');
      setTeacherMood('cheer');
      setSelectedOption(null);
    } else {
      setPhase('end');
      triggerConfetti();
    }
  };

  const handleOptionClick = (optIdx: number) => {
    if (isTimeUp) return;
    setSelectedOption(optIdx);
    setIsTimeUp(true);
    setTeacherMood('celebrate');
    setPraise(PRAISE_QUOTES[Math.floor(Math.random() * PRAISE_QUOTES.length)]);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div ref={containerRef} className="absolute inset-0 bg-linear-to-br from-pink-50 via-[#f8fbfa] to-orange-50 z-50 rounded-2xl md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-pink-300/30 blur-[120px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-300/30 blur-[120px] rounded-full mix-blend-multiply"></div>
        <div className="absolute top-[20%] left-[40%] w-[40%] h-[40%] bg-yellow-300/20 blur-[100px] rounded-full mix-blend-multiply"></div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative z-10"
          >
            <button onClick={onBack} className="p-3 bg-white hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 transition-all text-slate-700 group flex items-center gap-2 mb-8 w-fit">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold">Trở về</span>
            </button>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[32px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
                    <BookOpen className="w-8 h-8 text-rose-500" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-rose-600 drop-shadow-sm">Vận Động Trí Tuệ</h1>
                    <p className="text-rose-400 font-medium tracking-wide">Thiết lập trò chơi</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Tên bộ đề</label>
                    <input 
                      type="text" 
                      value={quizName}
                      onChange={(e) => setQuizName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 font-medium focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all placeholder:text-slate-400 shadow-sm"
                      placeholder="VD: Sinh học tế bào 10"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Nhập danh sách câu hỏi (Định dạng Text hoặc JSON):</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-3">
                      <p className="text-slate-500 font-mono text-sm leading-relaxed">
                        Cú pháp: Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D)
                      </p>
                    </div>
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full h-64 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-medium focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all custom-scrollbar resize-y shadow-sm"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handleStart}
                      className="px-8 py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_10px_25px_rgba(244,63,94,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3"
                    >
                      <Play className="w-6 h-6 fill-current" />
                      KÍCH HOẠT ĐẤU TRƯỜNG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'game' && questions[currentIdx] && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex-1 flex flex-col relative z-10 ${isTimeUp ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 md:px-8 pt-6 pb-2">
              <h2 className="text-2xl md:text-3xl font-black drop-shadow-sm truncate max-w-[50%]">
                <span className="text-rose-500">Vận động tay </span>
                <span className="text-orange-500">chân nào!</span>
              </h2>
              <div className="flex items-center gap-3">
                <button 
                  className="w-12 h-12 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-700 shadow-sm border border-slate-200 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="w-12 h-12 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-700 shadow-sm border border-slate-200 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
                <div className="px-6 py-2.5 bg-cyan-50 border border-cyan-200 rounded-full font-black text-cyan-700 text-lg tracking-widest shadow-sm">
                  {currentIdx + 1} / {questions.length}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-8 pb-2 shrink-0 mt-4">
              <div className="w-full max-w-4xl mx-auto h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                <motion.div 
                  className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-rose-500' : 'bg-teal-400'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 15) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start p-4 pt-6 gap-3 md:gap-4 w-full max-w-7xl mx-auto min-h-0">
              
              {/* Question Card */}
              <div className="w-full max-w-6xl bg-white rounded-[32px] py-4 md:py-6 px-6 md:px-12 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 relative shrink-0 flex items-center justify-center min-h-[100px] md:min-h-[120px]">
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-4 right-4 h-2.5 bg-[linear-gradient(90deg,#22d3ee,#a855f7,#3b82f6)] rounded-b-lg opacity-90 mx-auto max-w-[95%]"></div>
                
                {/* Timer Badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center shadow-md">
                  <span className={`text-xl md:text-2xl font-black ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-teal-500'}`}>{timeLeft}</span>
                </div>
 
                <div 
                  className="text-xl md:text-3xl text-center text-[#9b2cdd] leading-relaxed font-bold max-h-[120px] overflow-y-auto custom-scrollbar w-full mt-2"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {questions[currentIdx].question}
                </div>
              </div>
 
              {/* Action Options */}
              <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-2 min-h-0 items-end mt-4">
                {questions[currentIdx].options.map((opt, optIdx) => {
                  const isCorrectAnswer = optIdx === questions[currentIdx].correctAnswer;
                  const isCorrect = isTimeUp && isCorrectAnswer;
                  const isSelected = selectedOption === optIdx;
                  const showWrong = isTimeUp && isSelected && !isCorrectAnswer;
                  
                  return (
                    <div 
                      key={optIdx} 
                      className={`flex flex-col items-center cursor-pointer transition-all duration-500 origin-bottom w-full ${!isTimeUp ? 'hover:-translate-y-1 active:scale-95' : ''} ${isCorrect ? 'scale-105 z-20 drop-shadow-2xl' : ''} ${isTimeUp && !isCorrect ? 'scale-95 opacity-40 grayscale saturate-50' : ''}`}
                      onClick={() => handleOptionClick(optIdx)}
                    >
                      {/* Character Illustration Placeholder */}
                      <div className="relative mb-0 shrink-0 z-10 -bottom-6 md:-bottom-8">
                        <div className={`w-28 h-28 md:w-36 md:h-36 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center text-5xl md:text-6xl shadow-xl overflow-hidden ${isCorrect ? 'animate-bounce border-emerald-400 ring-4 ring-emerald-400/50' : ''}`}>
                          {ACTION_ICONS[optIdx].imgUrl ? (
                            <img src={ACTION_ICONS[optIdx].imgUrl} alt={ACTION_ICONS[optIdx].label} className="w-full h-full object-cover mix-blend-multiply" />
                          ) : (
                            ACTION_ICONS[optIdx].emoji
                          )}
                        </div>
                      </div>
 
                      {/* Answer Box */}
                      <div className={`w-full min-h-[110px] md:min-h-[140px] pt-8 md:pt-10 flex-1 ${ACTION_ICONS[optIdx].bgColor} bg-linear-to-b rounded-2xl md:rounded-[32px] p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-[0_8px_16px_rgba(0,0,0,0.1)] relative transition-all duration-500 overflow-hidden ${isCorrect ? 'ring-4 ring-emerald-400 z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : ''} ${showWrong ? 'ring-4 ring-rose-500 bg-red-600 grayscale-0 opacity-100' : ''}`}>
                        <div className="absolute top-3 left-3 w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-xs md:text-base backdrop-blur-md">
                          {['A', 'B', 'C', 'D'][optIdx]}
                        </div>
                        <span 
                          className="text-white text-base md:text-xl font-bold mt-2 line-clamp-3 leading-snug drop-shadow-sm"
                          style={{ fontFamily: '"Times New Roman", Times, serif' }}
                        >
                          {opt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
 
            {/* Bottom Controls & Teacher */}
            <div className="p-4 md:p-6 pt-0 flex justify-between items-end relative min-h-[80px] md:min-h-[110px] py-2 md:py-4 shrink-0 z-30">
              {/* Teacher Avatar */}
              <div className="flex items-end gap-6 relative">
                <div className="relative">
                  <img 
                    src={`https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=transparent&baseColor=f9c9b6&hair=facialHair&hairColor=000000`} 
                    alt="Teacher" 
                    className={`w-20 h-20 md:w-28 md:h-28 drop-shadow-xl ${teacherMood === 'cheer' ? 'animate-pulse' : 'animate-bounce'}`}
                  />
                  {praise && (
                     <motion.div 
                     initial={{ opacity: 0, scale: 0.5, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     className="absolute -top-16 -right-10 md:-top-20 md:-right-20 lg:-right-32 bg-white border border-slate-100 text-rose-500 font-black px-6 py-3 md:px-8 md:py-4 rounded-3xl rounded-bl-none shadow-[0_10px_30px_rgba(0,0,0,0.1)] whitespace-normal max-w-[200px] md:max-w-none md:whitespace-nowrap text-lg md:text-2xl text-center leading-tight z-40"
                   >
                     {praise}
                   </motion.div>
                  )}
                </div>
              </div>

              {/* Teacher Controls */}
              <div className="flex bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[24px] p-2 md:p-3 shadow-lg mb-2 relative">
                 <button 
                   onClick={nextQuestion}
                   className="px-6 py-3 md:px-8 md:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-md shadow-emerald-500/30 text-base md:text-xl"
                 >
                   Câu tiếp theo <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
                 </button>
              </div>
            </div>

          </motion.div>
        )}

        {phase === 'end' && (
          <motion.div 
            key="end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 relative z-10"
          >
            <div className="max-w-2xl w-full bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[40px] p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="w-32 h-32 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_40px_rgba(250,204,21,0.5)] border-8 border-white/50">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-rose-600 drop-shadow-sm mb-4">Hoàn thành xuất sắc!</h2>
              <p className="text-xl text-slate-500 mb-10 font-medium">Tất cả học sinh đã hoàn thành bộ đề "{quizName}". Chúc mừng các em!</p>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setPhase('setup')}
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-bold transition-all border border-slate-200 shadow-sm"
                >
                  Tạo phòng mới
                </button>
                <button 
                  onClick={onBack}
                  className="px-8 py-4 bg-linear-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/30 hover:-translate-y-1 transition-all"
                >
                  Thoát hoàn toàn
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

