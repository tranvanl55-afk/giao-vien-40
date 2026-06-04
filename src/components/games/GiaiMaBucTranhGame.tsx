import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Settings, Image as ImageIcon, RefreshCw, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Question {
  text: string;
  options: string[];
  answer: number;
}

interface GiaiMaBucTranhGameProps {
  questions: Question[];
  onBack: () => void;
}

export const GiaiMaBucTranhGame: React.FC<GiaiMaBucTranhGameProps> = ({ questions, onBack }) => {
  // Config state
  const [gridSize, setGridSize] = useState<number>(10);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Game state
  const [tiles, setTiles] = useState<{ id: number; qIndex: number }[]>([]);
  const [answeredState, setAnsweredState] = useState<{ [key: number]: 'correct' | 'wrong' }>({});
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({});
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  // Initialize game
  useEffect(() => {
    initGame();
  }, [gridSize, questions]);

  const initGame = () => {
    setAnsweredState({});
    setSelectedOptions({});
    setGameWon(false);
    setCurrentQIndex(0);

    const totalTiles = gridSize * gridSize;
    const numQuestions = questions.length;
    
    if (numQuestions === 0) return;

    // Distribute tiles to questions
    const newTiles = [];
    for (let i = 0; i < totalTiles; i++) {
      newTiles.push({
        id: i,
        // Evenly distribute questions, but shuffle later to make it random
        qIndex: i % numQuestions
      });
    }

    // Shuffle tiles
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }

    setTiles(newTiles);
  };

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (answeredState[qIndex] === 'correct') return; // Already correct

    setSelectedOptions(prev => ({ ...prev, [qIndex]: optionIndex }));

    if (questions[qIndex].answer === optionIndex) {
      const newAnsweredState = { ...answeredState, [qIndex]: 'correct' as const };
      setAnsweredState(newAnsweredState);

      // Check win condition
      if (Object.values(newAnsweredState).filter(s => s === 'correct').length === questions.length) {
        setGameWon(true);
      } else {
        // Optionally auto-advance to next unanswered question after a short delay
        setTimeout(() => {
          const nextUnanswered = questions.findIndex((_, idx) => newAnsweredState[idx] !== 'correct');
          if (nextUnanswered !== -1) {
            setCurrentQIndex(nextUnanswered);
          }
        }, 1500);
      }
    } else {
      setAnsweredState(prev => ({ ...prev, [qIndex]: 'wrong' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center p-8 bg-slate-800 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Chưa có câu hỏi</h2>
          <p className="mb-6">Vui lòng thêm câu hỏi trong Ngân hàng câu hỏi trước khi chơi.</p>
          <button onClick={onBack} className="px-6 py-2 bg-blue-600 rounded-lg font-semibold">Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <div className="p-4 bg-slate-800 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Giải Mã Bức Tranh
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium text-sm"
          >
            <Settings className="w-4 h-4" />
            Cài đặt
          </button>
          <button
            onClick={initGame}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors font-medium text-sm shadow-[0_0_15px_rgba(8,145,178,0.5)]"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-800 border-t border-slate-700 overflow-hidden"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Đổi ảnh bí ẩn (URL hoặc Tải lên)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="Nhập URL hình ảnh..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Tải lên
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kích thước lưới: {gridSize}x{gridSize} ({gridSize * gridSize} mảnh ghép)
                </label>
                <input
                  type="range"
                  min="4"
                  max="20"
                  value={gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: The Picture */}
        <div className="flex-1 p-4 lg:p-8 flex items-center justify-center bg-slate-950 relative overflow-hidden">
          {/* Win overlay */}
          <AnimatePresence>
            {gameWon && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
              >
                <div className="text-center p-8 bg-slate-800/80 rounded-3xl border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-50" />
                    <CheckCircle2 className="w-full h-full text-cyan-400 relative z-10" />
                  </motion.div>
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-blue-300 mb-2">
                    Tuyệt Vời!
                  </h2>
                  <p className="text-xl text-slate-300">Bạn đã giải mã thành công bức tranh!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-full max-w-3xl aspect-square shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border-4 border-slate-800">
            {/* The underlying image */}
            <img 
              src={imageUrl} 
              alt="Mystery" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* The Grid Overlay */}
            <div 
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {tiles.map((tile) => {
                const isRevealed = answeredState[tile.qIndex] === 'correct';
                return (
                  <motion.div
                    key={tile.id}
                    initial={false}
                    animate={{ 
                      opacity: isRevealed ? 0 : 1,
                      scale: isRevealed ? 0.8 : 1
                    }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className={`
                      border border-slate-700/50 flex items-center justify-center 
                      backdrop-blur-md font-bold text-slate-400 cursor-pointer transition-colors
                      ${currentQIndex === tile.qIndex ? 'bg-cyan-900/40 border-cyan-500/50 text-cyan-400' : 'bg-slate-800 hover:bg-slate-750'}
                      ${gridSize <= 8 ? 'text-2xl' : gridSize <= 12 ? 'text-lg' : 'text-xs'}
                    `}
                    style={{ pointerEvents: isRevealed ? 'none' : 'auto' }}
                    onClick={() => setCurrentQIndex(tile.qIndex)}
                  >
                    {tile.qIndex + 1}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: The Question */}
        <div className="w-full lg:w-[500px] xl:w-[600px] bg-slate-800/50 border-l border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm">
                {Object.values(answeredState).filter(s => s === 'correct').length}/{questions.length}
              </span>
              Trả lời đúng để mở khóa
            </h2>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                disabled={currentQIndex === 0}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
              >
                Trước
              </button>
              <button 
                onClick={() => setCurrentQIndex(Math.min(questions.length - 1, currentQIndex + 1))}
                disabled={currentQIndex === questions.length - 1}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
            {(() => {
              const q = questions[currentQIndex];
              const state = answeredState[currentQIndex];
              const isCorrect = state === 'correct';
              
              return (
                <div 
                  key={currentQIndex} 
                  className={`
                    p-6 md:p-8 rounded-3xl border transition-all duration-500 w-full max-w-2xl mx-auto
                    ${isCorrect 
                      ? 'bg-slate-800/90 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' 
                      : 'bg-slate-800 border-slate-700 shadow-xl'
                    }
                  `}
                >
                  <div className="flex gap-4 mb-8">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xl
                      ${isCorrect ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-cyan-400'}
                    `}>
                      {currentQIndex + 1}
                    </div>
                    <div className="flex-1 flex items-center">
                      <h3 className={`text-xl md:text-2xl font-medium leading-relaxed ${isCorrect ? 'text-slate-200' : 'text-white'}`}>
                        {q.text}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOptions[currentQIndex] === optIndex;
                      const isOptionCorrect = q.answer === optIndex;
                      
                      let btnClass = "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white";
                      
                      if (isCorrect) {
                        if (isOptionCorrect) {
                          btnClass = "bg-cyan-900/50 border-cyan-500 text-cyan-300 cursor-default shadow-[0_0_15px_rgba(6,182,212,0.3)]";
                        } else {
                          btnClass = "bg-slate-900 border-slate-800 text-slate-600 cursor-default opacity-50";
                        }
                      } else {
                        if (isSelected && state === 'wrong') {
                          btnClass = "bg-red-900/50 border-red-500 text-red-300 animate-shake";
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswer(currentQIndex, optIndex)}
                          disabled={isCorrect}
                          className={`
                            px-6 py-4 rounded-2xl border-2 text-left text-lg transition-all duration-300
                            flex items-center gap-4 group
                            ${btnClass}
                          `}
                        >
                          <span className={`
                            w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-colors
                            ${isCorrect && isOptionCorrect ? 'bg-cyan-500 text-white' : 'bg-black/30 group-hover:bg-black/50'}
                          `}>
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          
                          {/* Feedback Icons */}
                          {isCorrect && isOptionCorrect && (
                            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                          )}
                          {!isCorrect && isSelected && state === 'wrong' && (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
