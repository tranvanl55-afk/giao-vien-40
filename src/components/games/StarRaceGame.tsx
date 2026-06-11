import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Star, RotateCcw } from 'lucide-react';
import { Question } from './GameHub';
import { motion, AnimatePresence } from 'motion/react';
import { soundClick, soundCorrect, soundWrong, soundStart, soundEnd, soundNextQuestion } from '../../hooks/useGameSounds';

const OPTS = ['A', 'B', 'C', 'D'];
const TRACK_LENGTH = 10;
const REVEAL_MS = 1800;
const TIMER_SEC = 20;

const TEAMS = [
  { name: 'Đội Đỏ',  emoji: '🔴', grad: 'from-red-600 to-rose-500',   bg: 'from-red-950 to-rose-950',   border: 'border-red-500/40',   btn: 'bg-red-600/30 hover:bg-red-500/50 border-red-500/50',   active: 'bg-red-500/20 border-red-400/50' },
  { name: 'Đội Xanh', emoji: '🔵', grad: 'from-blue-600 to-indigo-500', bg: 'from-blue-950 to-indigo-950', border: 'border-blue-500/40', btn: 'bg-blue-600/30 hover:bg-blue-500/50 border-blue-500/50', active: 'bg-blue-500/20 border-blue-400/50' },
];

type Phase = 'countdown' | 'answering' | 'reveal' | 'result';

export function StarRaceGame({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [scores, setScores] = useState([0, 0]);
  const [qIdx, setQIdx] = useState(0);
  // teamAnswers[ti] = option index chosen, or -1 = timed out, null = not yet
  const [teamAnswers, setTeamAnswers] = useState<(number | null)[]>([null, null]);
  const [phase, setPhase] = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const [winner, setWinner] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shuffled = useRef([...questions].sort(() => Math.random() - 0.5)).current;
  const q = shuffled[qIdx % (shuffled.length || 1)];

  // Countdown before game starts
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) { soundStart(); setPhase('answering'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Per-question timer
  useEffect(() => {
    if (phase !== 'answering') return;
    setTimeLeft(TIMER_SEC);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // Force any unanswered teams to -1 (timeout)
          setTeamAnswers(prev => prev.map(a => a === null ? -1 : a));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, qIdx]);

  // Evaluate when both teams have answered
  useEffect(() => {
    if (phase !== 'answering') return;
    if (teamAnswers.some(a => a === null)) return; // wait for both
    clearInterval(timerRef.current!);
    setPhase('reveal');

    // Calculate new scores
    const ns = [...scores];
    let won = -1;
    teamAnswers.forEach((ans, ti) => {
      if (ans !== null && ans >= 0 && ans === q?.answer) {
        ns[ti] += 1;
        if (ns[ti] >= TRACK_LENGTH) won = ti;
      }
    });
    setScores(ns);
    setTimeout(() => {
      const correctTeams = [];
      teamAnswers.forEach((ans, ti) => {
        if (ans !== null && ans >= 0 && ans === q?.answer) correctTeams.push(ti);
      });
      if (correctTeams.length > 0) soundCorrect(); else soundWrong();
    }, 100);

    if (won >= 0) { setWinner(won); setTimeout(() => { soundEnd(); setPhase('result'); }, REVEAL_MS); return; }

    setTimeout(() => {
      soundNextQuestion();
      setTeamAnswers([null, null]);
      setQIdx(i => i + 1);
      setPhase('answering');
    }, REVEAL_MS);
  }, [teamAnswers, phase]);

  const handleAnswer = (teamIdx: number, optIdx: number) => {
    if (phase !== 'answering' || teamAnswers[teamIdx] !== null) return;
    soundClick();
    setTeamAnswers(prev => { const n = [...prev]; n[teamIdx] = optIdx; return n; });
  };

  const reset = () => {
    soundClick();
    setScores([0, 0]); setQIdx(0); setTeamAnswers([null, null]);
    setPhase('countdown'); setCountdown(3); setWinner(null);
  };

  // ── Empty state ──
  if (questions.length === 0) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="text-center p-8">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-xl font-bold mb-2">Chưa có câu hỏi!</p>
        <p className="text-slate-400 mb-6 text-sm">Vui lòng thêm câu hỏi trong mục "Câu hỏi" trước khi chơi.</p>
        <button onClick={onBack} className="px-6 py-3 bg-yellow-500 rounded-xl font-bold hover:bg-yellow-400">Quay lại</button>
      </div>
    </div>
  );

  // ── Countdown ──
  if (phase === 'countdown') return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-6">
      <h1 className="text-2xl font-black text-yellow-300">⭐ Cuộc Đua Ngôi Sao</h1>
      <motion.div key={countdown} initial={{ scale: 1.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="text-9xl font-black text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]">
        {countdown || '🚀'}
      </motion.div>
      <p className="text-slate-400">Sẵn sàng chưa?</p>
      <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm">
        <ArrowLeft className="w-4 h-4" /> Thoát
      </button>
    </div>
  );

  // ── Result ──
  if (phase === 'result' && winner !== null) return (
    <div className={`h-screen bg-linear-to-br ${TEAMS[winner].bg} flex flex-col items-center justify-center text-white gap-5`}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-9xl">🏆</motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-5xl font-black text-yellow-300">{TEAMS[winner].emoji} {TEAMS[winner].name} Thắng!</motion.h2>
      <p className="text-slate-300 text-xl font-bold">Tỉ số: {scores[0]} – {scores[1]}</p>
      <div className="flex gap-3 mt-4">
        <button onClick={reset} className="flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 rounded-2xl font-black text-slate-900 text-lg shadow-lg">
          <RotateCcw className="w-5 h-5" /> Chơi lại
        </button>
        <button onClick={onBack} className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-black text-lg">Thoát</button>
      </div>
    </div>
  );

  // ── Main split-screen game ──
  const bothAnswered = teamAnswers.every(a => a !== null);

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* ── Top bar: race tracks ── */}
      <div className="bg-slate-900 border-b border-white/10 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold hover:bg-white/20">
            <ArrowLeft className="w-3.5 h-3.5" /> Thoát
          </button>
          {/* Timer */}
          <div className="flex flex-col items-center">
            <span className={`text-2xl font-black tabular-nums ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>{timeLeft}s</span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden mt-0.5">
              <motion.div className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-400' : 'bg-yellow-400'}`}
                animate={{ width: `${(timeLeft / TIMER_SEC) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">Câu {qIdx % shuffled.length + 1}/{shuffled.length}</span>
        </div>

        {/* Race tracks */}
        <div className="space-y-1.5">
          {TEAMS.map((team, ti) => (
            <div key={ti} className="flex items-center gap-2">
              <span className="text-xs font-bold w-20 truncate">{team.emoji} {team.name}</span>
              <div className="flex-1 relative h-5 bg-white/10 rounded-full overflow-hidden">
                <motion.div className={`absolute top-0 left-0 h-full bg-linear-to-r ${team.grad} rounded-full`}
                  animate={{ width: `${(scores[ti] / TRACK_LENGTH) * 100}%` }}
                  transition={{ type: 'spring', bounce: 0.4 }} />
                <div className="absolute inset-0 flex items-center justify-around px-1">
                  {Array.from({ length: TRACK_LENGTH }, (_, i) => (
                    <Star key={i} className={`w-2.5 h-2.5 ${i < scores[ti] ? 'text-yellow-300 fill-yellow-300' : 'text-white/20'}`} />
                  ))}
                </div>
              </div>
              <span className="text-xs font-black text-yellow-300 w-12 text-right">{scores[ti]}/{TRACK_LENGTH}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Question (center, full width) ── */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-white/10 shrink-0">
        <AnimatePresence mode="wait">
          <motion.p key={qIdx} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="text-center text-base md:text-lg font-bold text-white leading-relaxed">
            {q?.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Split panels ── */}
      <div className="flex-1 flex overflow-hidden">
        {TEAMS.map((team, ti) => {
          const myAnswer = teamAnswers[ti];
          const answered = myAnswer !== null;
          const isCorrect = myAnswer === q?.answer;

          return (
            <div key={ti} className={`flex-1 flex flex-col bg-linear-to-b ${team.bg} border-${ti === 0 ? 'r' : 'l'} border-white/10 relative`}>
              {/* Team header */}
              <div className={`px-4 pt-3 pb-2 border-b ${team.border}`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-base">{team.emoji} {team.name}</span>
                  {answered ? (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                      {myAnswer === -1 ? '⏱ Hết giờ' : isCorrect ? '✅ Đúng!' : '❌ Sai'}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 animate-pulse">Đang chờ trả lời…</span>
                  )}
                </div>
              </div>

              {/* Answer buttons */}
              <div className="flex-1 p-3 grid grid-cols-2 gap-2 content-center">
                {q?.options.map((opt, i) => {
                  let cls = `${team.btn} cursor-pointer border`;
                  if (bothAnswered || answered) {
                    if (i === q.answer) cls = 'bg-green-500/30 border-green-400 cursor-default';
                    else if (i === myAnswer) cls = 'bg-red-500/30 border-red-400 cursor-default';
                    else cls = 'bg-white/5 border-white/10 opacity-30 cursor-default';
                  }
                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(ti, i)}
                      disabled={answered || bothAnswered}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl transition-all text-left ${cls}`}
                    >
                      <div className={`text-xs font-black mb-0.5 ${ti === 0 ? 'text-red-400' : 'text-blue-400'}`}>{OPTS[i]}</div>
                      <div className="text-sm font-medium leading-tight">{opt}</div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback overlay when answered */}
              {answered && (
                <div className={`mx-3 mb-3 py-2 px-3 rounded-xl text-center text-xs font-bold ${
                  myAnswer === -1 ? 'bg-slate-500/20 text-slate-300' :
                  isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {myAnswer === -1 ? '⏱ Hết giờ!' : isCorrect ? `⭐ +1 ngôi sao!` : `Đáp án đúng: ${OPTS[q?.answer ?? 0]}`}
                </div>
              )}

              {/* Waiting indicator when this team answered but other hasn't */}
              {answered && !bothAnswered && (
                <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
                    <p className="text-sm font-bold text-white">Đang chờ đội kia…</p>
                    <div className="flex gap-1 justify-center mt-2">
                      {[0,1,2].map(j => <div key={j} className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: `${j*0.15}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
