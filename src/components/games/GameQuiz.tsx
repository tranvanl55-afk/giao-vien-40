import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, RotateCcw, Play, Volume2, VolumeX, Shield, Award, HelpCircle, Flame, Star, Sparkles } from 'lucide-react';
import { Question } from './GameHub';
import confetti from 'canvas-confetti';
import { soundClick, soundCorrect, soundWrong, soundStart, soundEnd, soundNextQuestion } from '../../hooks/useGameSounds';

const OPTS = ['A', 'B', 'C', 'D'];
const TIMER_SEC = 20;

const AVATARS = [
  { id: 'astronaut', emoji: '🧑‍🚀', name: 'Phi hành gia', color: 'from-blue-400 to-indigo-600' },
  { id: 'scientist', emoji: '🧑‍🔬', name: 'Nhà khoa học', color: 'from-teal-400 to-emerald-600' },
  { id: 'fox', emoji: '🦊', name: 'Cáo lửa', color: 'from-orange-400 to-red-600' },
  { id: 'cat', emoji: '🐱', name: 'Mèo con', color: 'from-pink-400 to-rose-600' },
];

const OBSTACLES = [
  { id: 'boulder', emoji: '🪨', name: 'Tảng đá khổng lồ', action: 'Super Jump 🦘', actionDesc: 'nhảy vọt qua tảng đá!' },
  { id: 'fire', emoji: '🔥', name: 'Hố lửa phun trào', action: 'Magic Shield 🛡️', actionDesc: 'bật khiên lửa đi xuyên qua!' },
  { id: 'river', emoji: '🌊', name: 'Dòng sông cuộn xoáy', action: 'Jet Hoverboard 🛹', actionDesc: 'lướt ván siêu tốc qua sông!' },
  { id: 'plant', emoji: '🪴', name: 'Cây ăn thịt khổng lồ', action: 'Laser Flash ⚡', actionDesc: 'bắn tia chớp tri thức đóng băng cây!' },
  { id: 'wall', emoji: '🧱', name: 'Bức tường kiên cố', action: 'Sonic Dash 💨', actionDesc: 'phóng nhanh như chớp xuyên tường!' },
];

type GamePhase = 'intro' | 'avatar' | 'countdown' | 'playing' | 'action' | 'gameover' | 'victory';

export function GameQuiz({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);

  // Animation states for character
  const [characterAnim, setCharacterAnim] = useState<'idle' | 'running' | 'action' | 'hurt'>('idle');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter and shuffle questions — computed once when questions prop changes
  const shuffledQuestions = useMemo(() => {
    if (questions && questions.length > 0) {
      return [...questions].sort(() => Math.random() - 0.5);
    }
    return [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]);

  const currentQuestion = shuffledQuestions[currentIdx % (shuffledQuestions.length || 1)];
  const currentObstacle = OBSTACLES[currentIdx % OBSTACLES.length];

  const playSuccessSound = () => soundCorrect();
  const playFailSound = () => soundWrong();
  const playClickSound = () => soundClick();

  // Timer loop
  useEffect(() => {
    if (phase !== 'playing') return;
    setTimeLeft(TIMER_SEC);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAnswerSelect(-1); // Timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIdx]);

  // Start countdown
  const startCountdown = () => {
    setCountdown(3);
    setPhase('countdown');
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          soundStart();
          setPhase('playing');
          setCharacterAnim('running');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStartGame = () => {
    playClickSound();
    setPhase('avatar');
  };

  const handleAvatarSelect = (avatar: typeof AVATARS[0]) => {
    playClickSound();
    setSelectedAvatar(avatar);
    setCurrentIdx(0);
    setScore(0);
    setHp(3);
    setSelectedOption(null);
    setFeedback(null);
    startCountdown();
  };

  const handleAnswerSelect = (optIdx: number) => {
    if (feedback !== null || phase !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(optIdx);

    const isCorrect = optIdx === currentQuestion?.answer;

    if (isCorrect) {
      playSuccessSound();
      setFeedback('correct');
      setScore(prev => prev + 10);
      setCharacterAnim('action');
      setPhase('action');
      triggerConfettiSuccess();

      // Proceed to next level or Victory
      setTimeout(() => {
        if (currentIdx + 1 >= shuffledQuestions.length) {
          soundEnd();
          setPhase('victory');
          triggerVictoryConfetti();
        } else {
          soundNextQuestion();
          setFeedback(null);
          setSelectedOption(null);
          setCurrentIdx(prev => prev + 1);
          setPhase('playing');
          setCharacterAnim('running');
        }
      }, 2500);
    } else {
      playFailSound();
      setFeedback(optIdx === -1 ? 'timeout' : 'wrong');
      setHp(prev => {
        const nextHp = prev - 1;
        if (nextHp <= 0) {
          setCharacterAnim('hurt');
          setTimeout(() => setPhase('gameover'), 1500);
        } else {
          setCharacterAnim('hurt');
          setTimeout(() => {
            setFeedback(null);
            setSelectedOption(null);
            setCurrentIdx(prev => prev + 1);
            setPhase('playing');
            setCharacterAnim('running');
          }, 2000);
        }
        return nextHp;
      });
    }
  };

  const triggerConfettiSuccess = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#4ade80', '#60a5fa', '#fcd34d']
    });
  };

  const triggerVictoryConfetti = () => {
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#3b82f6', '#fbbf24', '#f43f5e']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6', '#fbbf24', '#f43f5e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const resetGame = () => {
    playClickSound();
    setPhase('intro');
  };

  // ── Empty State ──
  if (shuffledQuestions.length === 0) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-white p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
          <HelpCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-black mb-2">Chưa có câu hỏi!</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Ngân hàng câu hỏi hiện đang trống. Hãy vào mục **Ngân hàng câu hỏi** để tạo câu hỏi trước khi bắt đầu trò chơi nhé!
          </p>
          <div className="flex gap-4">
            <button onClick={onBack} className="flex-1 py-4 bg-white/10 hover:bg-white/25 rounded-2xl font-bold transition-all text-sm">
              Quay lại danh mục
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col font-sans overflow-hidden bg-slate-950 text-white relative select-none">
      {/* Background Star Field decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-[40%] left-[80%] w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-[30%] left-[25%] w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute top-[70%] left-[60%] w-1 h-1 bg-white rounded-full animate-ping"></div>
      </div>

      {/* TOP HEADER */}
      <div className="w-full bg-slate-900/60 backdrop-blur-md border-b border-white/10 p-4 shrink-0 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={phase === 'intro' ? onBack : resetGame}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 transition-all text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black bg-clip-text text-transparent bg-linear-to-r from-yellow-300 to-orange-400 tracking-wide uppercase">
              Đố vui Khoa học
            </h1>
            <p className="text-[10px] md:text-xs text-orange-500 font-bold uppercase tracking-widest">Vượt chướng ngại vật 🏆</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {phase === 'playing' && (
            <div className="flex items-center gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 transition-all ${
                    i < hp 
                      ? 'text-red-500 fill-red-500 scale-100' 
                      : 'text-slate-700 scale-90'
                  }`}
                />
              ))}
            </div>
          )}

          {phase === 'playing' && (
            <div className="bg-white/5 px-4 py-2 border border-white/10 rounded-2xl flex items-center gap-2 shadow-inner">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-black text-sm md:text-base tabular-nums">{score} đ</span>
            </div>
          )}

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 transition-all text-slate-400 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* PHASE: INTRO */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-start overflow-y-auto p-4 md:p-6 z-10 custom-scrollbar"
          >
            <div className="max-w-2xl w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[28px] p-6 md:p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden my-auto">
              {/* Highlight sphere */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] pointer-events-none rounded-full" />
              
              <div className="w-16 h-16 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl border-4 border-white/20">
                <Flame className="w-8 h-8 text-white animate-bounce" />
              </div>

              <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-linear-to-r from-yellow-300 via-orange-400 to-pink-500">
                ĐỐ VUI KHOA HỌC
              </h2>
              <p className="text-slate-300 text-sm md:text-base font-medium mb-4">
                Game trả lời câu hỏi vượt chướng ngại vật phiên bản siêu cấp!
              </p>

              <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-5 text-left">
                <h4 className="font-bold text-yellow-400 text-xs md:text-sm mb-2">📋 Cách chơi:</h4>
                <ol className="text-slate-400 text-xs md:text-sm leading-relaxed space-y-1 list-decimal list-inside">
                  <li>Chọn avatar đại diện độc đáo cho bạn</li>
                  <li>Trả lời câu hỏi Khoa học để né chướng ngại vật</li>
                  <li>Đúng → +10 điểm và vượt qua; Sai/hết giờ → mất 1 ❤️</li>
                  <li>Cố giữ đủ 3 mạng để chiến thắng!</li>
                </ol>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full px-8 py-4 bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6 fill-slate-950" /> BẮT ĐẦU CHƠI
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE: AVATAR SELECT */}
        {phase === 'avatar' && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-start overflow-y-auto p-4 md:p-6 z-10 custom-scrollbar"
          >
            <div className="max-w-4xl w-full text-center my-auto">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">CHỌN AVATAR ĐẠI DIỆN</h2>
              <p className="text-slate-400 text-sm md:text-base mb-6">Chọn nhân vật đồng hành trên hành trình vượt chướng ngại vật</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar)}
                    className="group bg-slate-900 border-2 border-slate-800 hover:border-indigo-500 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center gap-3 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.2)]"
                  >
                    <div className={`w-20 h-20 rounded-full bg-linear-to-br ${avatar.color} flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-white/10`}>
                      {avatar.emoji}
                    </div>
                    <span className="font-bold text-slate-200 group-hover:text-white text-base">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE: COUNTDOWN */}
        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center z-10"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 1.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-br from-yellow-300 via-orange-500 to-rose-500 drop-shadow-[0_10px_30px_rgba(239,68,68,0.3)]"
            >
              {countdown > 0 ? countdown : '🚀'}
            </motion.div>
            <p className="text-slate-400 mt-6 text-xl font-bold tracking-widest uppercase">Hãy sẵn sàng vượt chướng ngại vật!</p>
          </motion.div>
        )}

        {/* PHASE: PLAYING OR ACTION */}
        {(phase === 'playing' || phase === 'action') && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col w-full z-10 min-h-0"
          >
            {/* Visual Obstacle Runway / Platform */}
            <div className="w-full h-44 md:h-52 bg-slate-900 border-b-4 border-indigo-950 relative overflow-hidden shrink-0 shadow-lg">
              {/* Runway sky background */}
              <div className="absolute inset-0 bg-linear-to-b from-indigo-950 via-slate-900 to-indigo-900 opacity-60"></div>
              
              {/* Moving road lines for running illusion */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-950 flex justify-around pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-full bg-slate-800"
                    animate={characterAnim === 'running' ? { x: [-50, 150] } : {}}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear', delay: i * 0.12 }}
                  />
                ))}
              </div>

              {/* Landscape decor (mountains / trees passing by) */}
              <div className="absolute bottom-4 left-0 right-0 h-12 flex justify-around pointer-events-none opacity-35">
                {['🌲', '⛰️', '🌴', '🌲', '⛰️'].map((decor, i) => (
                  <motion.div
                    key={i}
                    className="text-2xl"
                    animate={characterAnim === 'running' ? { x: [100, -100] } : {}}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear', delay: i * 1.5 }}
                  >
                    {decor}
                  </motion.div>
                ))}
              </div>

              {/* Progress track line */}
              <div className="absolute top-4 left-4 right-4 h-2 bg-slate-800 rounded-full border border-white/5 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-teal-400 to-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${((currentIdx) / shuffledQuestions.length) * 100}%` }}
                />
              </div>
              <div className="absolute top-8 left-4 text-xs font-bold text-slate-400">
                Câu hỏi {currentIdx + 1} / {shuffledQuestions.length}
              </div>

              {/* CHARACTER */}
              <motion.div
                className="absolute bottom-4 z-20 flex flex-col items-center"
                animate={
                  characterAnim === 'idle'
                    ? { y: [0, -3, 0] }
                    : characterAnim === 'running'
                    ? { y: [0, -8, 0, -4, 0], rotate: [0, -3, 3, -1, 0] }
                    : characterAnim === 'action'
                    ? currentObstacle.id === 'boulder'
                      ? { y: [0, -90, -90, 0], x: [0, 40, 120, 200], rotate: [0, 180, 360, 360], scale: [1, 1.2, 1.2, 1] }
                      : currentObstacle.id === 'river'
                      ? { y: [0, -20, 0], x: [0, 100, 200], scale: [1, 1.1, 1] }
                      : { scale: [1, 1.3, 1] } // static effect
                    : { x: [0, -10, 5, -5, 0], rotate: [0, -10, 10, -5, 0] } // hurt
                }
                transition={
                  characterAnim === 'action'
                    ? { duration: 1.8, ease: 'easeInOut' }
                    : characterAnim === 'idle'
                    ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
                    : characterAnim === 'running'
                    ? { repeat: Infinity, duration: 0.8, ease: 'easeInOut' }
                    : { duration: 0.6 }
                }
                style={{
                  left: characterAnim === 'action' ? '20%' : '20%',
                }}
              >
                {/* Visual action effects */}
                {characterAnim === 'action' && currentObstacle.id === 'fire' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1.5, 1.8, 0], opacity: [0.8, 0.8, 0] }}
                    transition={{ duration: 1.5 }}
                    className="absolute -inset-4 border-4 border-cyan-400 rounded-full flex items-center justify-center"
                  >
                    <Shield className="w-10 h-10 text-cyan-400 fill-cyan-400/20" />
                  </motion.div>
                )}

                {characterAnim === 'action' && currentObstacle.id === 'river' && (
                  <div className="absolute -bottom-3 text-3xl animate-pulse">🛹</div>
                )}

                {characterAnim === 'action' && currentObstacle.id === 'plant' && (
                  <motion.div
                    animate={{ scale: [0, 4, 0], opacity: [1, 0.5, 0] }}
                    transition={{ duration: 1 }}
                    className="absolute w-6 h-6 bg-cyan-300 rounded-full blur-xs"
                  />
                )}

                {/* Character main Emoji representation */}
                <div className="relative">
                  <span className={`text-6xl md:text-7xl block filter drop-shadow-lg ${characterAnim === 'hurt' ? 'grayscale opacity-75' : ''}`}>
                    {selectedAvatar.emoji}
                  </span>
                  
                  {/* Speech Bubble */}
                  {feedback !== null && (
                    <motion.div
                      initial={{ scale: 0, y: 10, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      className={`absolute -top-12 -left-4 px-4 py-1.5 rounded-xl text-xs font-black text-slate-900 shadow-md whitespace-nowrap z-30 ${
                        feedback === 'correct' ? 'bg-green-400' : 'bg-red-400 text-white'
                      }`}
                    >
                      {feedback === 'correct' ? 'Được rồi! 🚀' : feedback === 'timeout' ? 'Hết giờ rồi! 😱' : 'Uây da! 💥'}
                    </motion.div>
                  )}
                </div>

                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-black tracking-wide border border-white/10 uppercase">
                  {selectedAvatar.name}
                </span>
              </motion.div>

              {/* OBSTACLE */}
              <motion.div
                className="absolute bottom-4 flex flex-col items-center"
                animate={
                  characterAnim === 'action'
                    ? { x: ['80%', '20%', '-20%'], opacity: [1, 1, 0] }
                    : characterAnim === 'hurt'
                    ? { x: ['80%', '40%', '40%'] } // stops at character collision
                    : { x: ['100%', '80%'] } // moving to queue position
                }
                transition={
                  characterAnim === 'action'
                    ? { duration: 1.8, ease: 'easeInOut' }
                    : { duration: 0.8 }
                }
                style={{
                  left: 0,
                  x: '80%',
                }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Warning label */}
                  {characterAnim !== 'action' && (
                    <div className="absolute -top-10 px-2 py-0.5 bg-rose-500/90 text-white border border-rose-400 text-[8px] md:text-[9px] font-black uppercase tracking-wider rounded-md animate-pulse">
                      Chướng ngại vật!
                    </div>
                  )}

                  <span className={`text-6xl md:text-7xl block filter drop-shadow-xl ${
                    characterAnim === 'action' ? 'scale-75 opacity-20 filter grayscale blur-xs transition-all duration-1000' : 'animate-bounce'
                  }`}>
                    {currentObstacle.emoji}
                  </span>
                </div>
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-black border border-rose-500/30 text-rose-400 uppercase">
                  {currentObstacle.name}
                </span>
              </motion.div>
            </div>

            {/* ACTION BANNER WHEN ANSWER IS CORRECT */}
            {phase === 'action' && (
              <div className="w-full bg-indigo-950/90 border-b border-indigo-800 py-3 px-6 text-center text-sm md:text-base font-bold text-yellow-300 flex items-center justify-center gap-2 z-20">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Bạn kích hoạt thành công <strong>{currentObstacle.action}</strong> để {currentObstacle.actionDesc}</span>
              </div>
            )}

            {/* QUIZ CONTENT AREA */}
            <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 gap-6 min-h-0 overflow-y-auto custom-scrollbar">
              
              {/* Question container */}
              <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[28px] p-6 md:p-8 shadow-xl relative overflow-hidden shrink-0">
                {/* Timer ring line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
                  <motion.div
                    className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-teal-400'}`}
                    animate={{ width: `${(timeLeft / TIMER_SEC) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>

                <div className="flex justify-between items-center mb-4 mt-1">
                  <span className="text-[10px] md:text-xs font-black uppercase text-indigo-400 tracking-widest">
                    Chủ đề Khoa học
                  </span>
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                    <span className={`text-xs md:text-sm font-black tabular-nums ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-teal-400'}`}>
                      ⏱️ {timeLeft}s
                    </span>
                  </div>
                </div>

                <p 
                  className="text-lg md:text-2xl font-bold leading-relaxed text-slate-100"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {currentQuestion?.text}
                </p>
              </div>

              {/* Answers Grid */}
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {currentQuestion?.options.map((opt, idx) => {
                  const isCorrectAnswer = idx === currentQuestion.answer;
                  const isSelected = selectedOption === idx;
                  let btnClass = "bg-slate-900 border-white/10 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:scale-[1.01]";

                  if (feedback !== null) {
                    if (isCorrectAnswer) {
                      btnClass = "bg-green-500/20 border-green-500 text-green-300 scale-100 shadow-[0_0_20px_rgba(74,222,128,0.2)]";
                    } else if (isSelected) {
                      btnClass = "bg-red-500/20 border-red-500 text-red-300 opacity-90";
                    } else {
                      btnClass = "border-white/5 opacity-30 scale-95";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={feedback !== null}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4 ${btnClass}`}
                    >
                      <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-black text-sm md:text-base border transition-all ${
                        feedback !== null && isCorrectAnswer
                          ? 'bg-green-500 border-green-400 text-slate-950'
                          : feedback !== null && isSelected
                          ? 'bg-red-500 border-red-400 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}>
                        {OPTS[idx]}
                      </span>
                      <span 
                        className="text-sm md:text-base font-bold leading-snug"
                        style={{ fontFamily: '"Times New Roman", Times, serif' }}
                      >
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE: GAMEOVER */}
        {phase === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center p-6 z-10"
          >
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
              <div className="w-20 h-20 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-red-500 mb-2">CẠN KIỆT MẠNG!</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Nhân vật đại diện đã va chạm quá nhiều chướng ngại vật và hết mạng. Hãy thử sức lại nhé!
              </p>
              <div className="bg-black/30 rounded-xl p-4 mb-8 flex justify-around border border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Điểm số</p>
                  <p className="text-xl font-black text-yellow-400">{score} đ</p>
                </div>
                <div className="border-r border-white/15"></div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Vượt qua</p>
                  <p className="text-xl font-black text-white">{currentIdx} / {shuffledQuestions.length} 🚧</p>
                </div>
              </div>
              <button
                onClick={resetGame}
                className="w-full py-4 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Thử sức lại
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE: VICTORY */}
        {phase === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center p-6 z-10"
          >
            <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-[40px] p-10 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
              <div className="w-24 h-24 bg-linear-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white/20">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-yellow-400 mb-2">CHIẾN THẮNG HUY HOÀNG!</h2>
              <p className="text-slate-300 text-sm md:text-base mb-8">
                Chúc mừng bạn đã xuất sắc vượt qua toàn bộ <strong>{shuffledQuestions.length}</strong> chướng ngại vật bằng tri thức!
              </p>
              
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Tổng điểm</p>
                  <p className="text-3xl font-black text-yellow-400">{score} đ</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Mạng còn lại</p>
                  <p className="text-3xl font-black text-red-500 flex items-center justify-center gap-1">
                    {hp} <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-slate-700 text-slate-300 hover:text-white"
                >
                  Trang chủ Game
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 py-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20"
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
