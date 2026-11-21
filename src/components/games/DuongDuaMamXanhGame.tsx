/* cSpell:disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Shuffle,
  RotateCcw,
  Trophy,
  Play,
  Sparkles,
  Plus,
  Minus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FlaskConical,
  Award,
  Lock,
} from 'lucide-react';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { TEACHER_PASSWORD } from '../simulations/tinh-bot-cellulose/lessonData';

interface DuongDuaMamXanhGameProps {
  onBack?: () => void;
}

type MiniGameId = 1 | 2 | 3 | 4 | 5 | 6;

interface TeamState {
  id: number;
  name: string;
  score: number;
  color: string;
}

const INITIAL_TEAMS: TeamState[] = [
  { id: 1, name: 'Nhóm 1', score: 0, color: '#10b981' },
  { id: 2, name: 'Nhóm 2', score: 0, color: '#06b6d4' },
  { id: 3, name: 'Nhóm 3', score: 0, color: '#3b82f6' },
  { id: 4, name: 'Nhóm 4', score: 0, color: '#8b5cf6' },
  { id: 5, name: 'Nhóm 5', score: 0, color: '#ec4899' },
  { id: 6, name: 'Nhóm 6', score: 0, color: '#f59e0b' },
  { id: 7, name: 'Nhóm 7', score: 0, color: '#ef4444' },
  { id: 8, name: 'Nhóm 8', score: 0, color: '#84cc16' },
];

const MAX_SCORE = 60;
const FLOWER_THRESHOLD = 40;
const STORAGE_KEY = 'DUONG_DUA_MAM_XANH_V1';

const MINI_GAME_META: {
  id: MiniGameId;
  shortTitle: string;
  fullTitle: string;
  durationSec: number;
  badge: string;
  description: string;
}[] = [
  {
    id: 1,
    shortTitle: '1. Thí nghiệm Iodine',
    fullTitle: 'Game 1: Phản xạ Phòng thí nghiệm (15s)',
    durationSec: 15,
    badge: '🧪 Iodine Test',
    description: 'Nhỏ giọt Iodine vào 4 ống nghiệm để tìm đúng ống chuyển màu xanh tím đậm!',
  },
  {
    id: 2,
    shortTitle: '2. Phân loại Tính chất',
    fullTitle: 'Game 2: Phân loại Tinh bột & Cellulose (15s)',
    durationSec: 15,
    badge: '🧬 Phân loại',
    description: 'Đọc nhanh 4 thẻ tính chất vật lí / trạng thái tự nhiên và chọn đúng Tinh bột hoặc Cellulose!',
  },
  {
    id: 3,
    shortTitle: '3. Hứng Cellulose Xanh',
    fullTitle: 'Game 3: Arcade Hứng Cellulose Xanh — Canvas (15s)',
    durationSec: 15,
    badge: '♻️ Arcade Canvas',
    description: 'Di chuyển giỏ "Thân thiện môi trường" (chuột / chạm / phím ← →) hứng nguyên liệu Cellulose (+5đ) và né rác nhựa (-5đ)!',
  },
  {
    id: 4,
    shortTitle: '4. Sản phẩm Xanh',
    fullTitle: 'Game 4: Truy tìm Nguồn gốc Sản phẩm Xanh (15s)',
    durationSec: 15,
    badge: '🌱 Ứng dụng thực tế',
    description: 'Chọn nhanh nguồn gốc Tinh bột hoặc Cellulose cho 4 sản phẩm quen thuộc trong đời sống & sản xuất!',
  },
  {
    id: 5,
    shortTitle: '5. Ghép PT Quang hợp',
    fullTitle: 'Game 5: Ghép phương trình Quang hợp (20s)',
    durationSec: 20,
    badge: '🌿 Quang hợp SGK 9',
    description: 'Bấm chọn đúng thứ tự 4 mảnh ghép phương trình quang hợp chuẩn SGK KHTN 9 (tránh mảnh nhiễu)!',
  },
  {
    id: 6,
    shortTitle: '6. English Challenge',
    fullTitle: 'Game 6: Lật mảnh ghép English Challenge (20s)',
    durationSec: 20,
    badge: '🇬🇧 Vocabulary',
    description: 'Lật 4 ô gợi ý (từ loại, IPA, ngữ cảnh, nghĩa tiếng Việt) để đoán đúng thuật ngữ tiếng Anh!',
  },
];

// Game 2 data
const SORT_CARDS: { id: number; text: string; target: 'starch' | 'cellulose' }[] = [
  { id: 1, text: 'Dạng bột màu trắng, không tan trong nước lạnh, tạo hồ keo trong nước nóng', target: 'starch' },
  { id: 2, text: 'Chất rắn dạng sợi dài, màu trắng, không tan trong nước kể cả khi đun nóng', target: 'cellulose' },
  { id: 3, text: 'Có nhiều trong hạt gạo, ngô, củ khoai, củ sắn (dự trữ năng lượng)', target: 'starch' },
  { id: 4, text: 'Thành phần chính của vách tế bào thực vật: bông nõn, tre, nứa, thân gỗ', target: 'cellulose' },
];

// Game 4 data
const GREEN_PRODUCTS: { id: string; emoji: string; title: string; target: 'starch' | 'cellulose' }[] = [
  { id: 'rice', emoji: '🍚', title: 'Cơm, bánh mì, khoai sắn', target: 'starch' },
  { id: 'cotton', emoji: '👕', title: 'Vải sợi cotton, giấy vở, đồ gỗ', target: 'cellulose' },
  { id: 'glucose', emoji: '🍬', title: 'Sản xuất Glucose, mạch nha, kẹo', target: 'starch' },
  { id: 'biofilm', emoji: '📦', title: 'Màng bọc sinh học, bột giấy từ bã mía', target: 'cellulose' },
];

// Game 5 data
const PHOTO_PIECES = [
  { id: 'co2', label: '6CO₂' },
  { id: 'plus', label: '+' },
  { id: 'h2o', label: '6H₂O' },
  { id: 'product', label: '→ C₆H₁₂O₆ + 6O₂' },
  { id: 'distractor', label: '(C₆H₁₀O₅)ₙ' },
];
const PHOTO_CORRECT_ORDER = ['co2', 'plus', 'h2o', 'product'];

// Game 6 data
const ENGLISH_HINTS = [
  { id: 'pos', label: 'Từ loại', content: 'Noun (Danh từ không đếm được)' },
  { id: 'ipa', label: 'Phiên âm IPA', content: '/stɑːtʃ/' },
  { id: 'ctx', label: 'Ngữ cảnh KHTN 9', content: 'Rice, potatoes and cassava contain a lot of ______.' },
  { id: 'vi', label: 'Nghĩa tiếng Việt', content: 'Tinh bột — nguồn dự trữ năng lượng ở thực vật' },
];

export function DuongDuaMamXanhGame({ onBack }: DuongDuaMamXanhGameProps) {
  // Teams & global state
  const [teams, setTeams] = useState<TeamState[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 8) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_TEAMS;
  });
  const [activeTeamId, setActiveTeamId] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [isJudgeQuickView, setIsJudgeQuickView] = useState<boolean>(false);
  const [isTeacherStarted, setIsTeacherStarted] = useState<boolean>(false);
  const [showStartPassModal, setShowStartPassModal] = useState<boolean>(false);
  const [startPassInput, setStartPassInput] = useState<string>('');
  const [startPassError, setStartPassError] = useState<string | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const [roomCode, setRoomCode] = useState<string>(() => {
    try {
      return localStorage.getItem('DUONG_DUA_MAM_XANH_ROOM_V1') || 'KHTN9-BAI30';
    } catch {
      return 'KHTN9-BAI30';
    }
  });
  const [roomCodeInput, setRoomCodeInput] = useState<string>(roomCode);
  const [syncStatus, setSyncStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const prevRemoteStartedRef = useRef<boolean>(false);

  // Active mini-game state
  const [activeGame, setActiveGame] = useState<MiniGameId>(1);
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [feedbackBanner, setFeedbackBanner] = useState<{ text: string; ok: boolean } | null>(null);

  // Game 1 state (Iodine tubes)
  const [testedTubes, setTestedTubes] = useState<Record<string, 'none' | 'amber' | 'blue'>>({});

  // Game 2 state (Sort Starch / Cellulose)
  const [sortIndex, setSortIndex] = useState<number>(0);
  const [sortCorrectCount, setSortCorrectCount] = useState<number>(0);

  // Game 3 state (Canvas Arcade)
  const arcadeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const basketXRef = useRef<number>(260);
  const keysPressedRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const [arcadeScore, setArcadeScore] = useState<number>(0);

  // Game 4 state (Green Products matching)
  const [matchedProducts, setMatchedProducts] = useState<Record<string, boolean>>({});
  const [activeProductId, setActiveProductId] = useState<string>('rice');

  // Game 5 state (Photosynthesis equation)
  const [photoSelectedIds, setPhotoSelectedIds] = useState<string[]>([]);
  const [shuffledPhotoPieces, setShuffledPhotoPieces] = useState(() =>
    [...PHOTO_PIECES].sort(() => Math.random() - 0.5)
  );

  // Game 6 state (English challenge)
  const [flippedHints, setFlippedHints] = useState<Record<string, boolean>>({});
  const [englishInput, setEnglishInput] = useState<string>('');

  // Race Track Canvas & Web Audio
  const raceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayedScoresRef = useRef<number[]>(teams.map((t) => t.score));
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    } catch {
      // ignore
    }
  }, [teams]);

  // Real-time multi-device sync via Firebase Firestore (using open collection khtn9_bai30_stage3_rubrics)
  useEffect(() => {
    setSyncStatus('connecting');
    const cleanRoom = roomCode.trim().toUpperCase() || 'KHTN9-BAI30';
    try {
      localStorage.setItem('DUONG_DUA_MAM_XANH_ROOM_V1', cleanRoom);
    } catch {
      // ignore
    }
    const q = query(
      collection(db, 'khtn9_bai30_stage3_rubrics'),
      where('evaluatorGroup', '==', `MAM_XANH_${cleanRoom}`)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setSyncStatus('live');
        const events = snap.docs
          .map((d) => d.data() as { targetGroup?: string; totalPoints?: number; createdAtMs?: number })
          .sort((a, b) => Number(a.createdAtMs || 0) - Number(b.createdAtMs || 0));

        const nextScores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
        let remoteStarted = false;

        for (const ev of events) {
          if (ev.targetGroup === 'CMD_RESET') {
            for (let i = 1; i <= 8; i++) nextScores[i] = 0;
            remoteStarted = false;
          } else if (ev.targetGroup === 'CMD_START') {
            remoteStarted = true;
          } else if (ev.targetGroup && ev.targetGroup.startsWith('TEAM_')) {
            const tid = Number(ev.targetGroup.replace('TEAM_', ''));
            if (tid >= 1 && tid <= 8) {
              nextScores[tid] = Math.max(0, Math.min(MAX_SCORE, (nextScores[tid] || 0) + Number(ev.totalPoints || 0)));
            }
          }
        }

        setTeams((prev) => prev.map((t) => ({ ...t, score: nextScores[t.id] ?? 0 })));

        if (remoteStarted && !prevRemoteStartedRef.current) {
          setIsTeacherStarted(true);
          setGameStatus((curr) => (curr === 'ready' ? 'playing' : curr));
        } else if (!remoteStarted && prevRemoteStartedRef.current) {
          setIsTeacherStarted(false);
        }
        prevRemoteStartedRef.current = remoteStarted;
      },
      () => {
        setSyncStatus('offline');
      }
    );
    return () => unsub();
  }, [roomCode]);

  const playSound = useCallback(
    (type: 'click' | 'correct' | 'wrong' | 'win' | 'drop' | 'cut') => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new Ctx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'drop') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(700, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.start(now);
          osc.stop(now + 0.14);
        } else if (type === 'cut') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(920, now);
          osc.frequency.exponentialRampToValueAtTime(240, now + 0.1);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'correct') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.08);
          osc.frequency.setValueAtTime(783.99, now + 0.16);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'wrong') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(210, now);
          osc.frequency.linearRampToValueAtTime(140, now + 0.22);
          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (type === 'win') {
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.frequency.setValueAtTime(freq, now + idx * 0.09);
            g.gain.setValueAtTime(0.14, now + idx * 0.09);
            g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(now + idx * 0.09);
            o.stop(now + idx * 0.09 + 0.25);
          });
        }
      } catch {
        // ignore audio errors
      }
    },
    [soundEnabled]
  );

  // Cleanup AudioContext & auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const emitRoomEvent = useCallback(
    (targetGroup: string, totalPoints: number) => {
      const cleanRoom = roomCode.trim().toUpperCase() || 'KHTN9-BAI30';
      addDoc(collection(db, 'khtn9_bai30_stage3_rubrics'), {
        evaluatorGroup: `MAM_XANH_${cleanRoom}`,
        targetGroup,
        totalPoints,
        createdAtMs: Date.now(),
      }).catch(() => {
        setSyncStatus('offline');
      });
    },
    [roomCode]
  );

  const addScoreToTeam = useCallback(
    (teamId: number, delta: number) => {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId ? { ...t, score: Math.max(0, Math.min(MAX_SCORE, t.score + delta)) } : t
        )
      );
      if (delta > 0) playSound('correct');
      else if (delta < 0) playSound('wrong');
      emitRoomEvent(`TEAM_${teamId}`, delta);
    },
    [playSound, emitRoomEvent]
  );

  const resetMiniGameState = useCallback((gameId: MiniGameId) => {
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    const meta = MINI_GAME_META.find((m) => m.id === gameId)!;
    setActiveGame(gameId);
    setGameStatus('ready');
    setTimeLeft(meta.durationSec);
    setFeedbackBanner(null);
    setTestedTubes({});
    setSortIndex(0);
    setSortCorrectCount(0);
    setArcadeScore(0);
    basketXRef.current = 260;
    setMatchedProducts({});
    setActiveProductId('rice');
    setPhotoSelectedIds([]);
    setShuffledPhotoPieces([...PHOTO_PIECES].sort(() => Math.random() - 0.5));
    setFlippedHints({});
    setEnglishInput('');
  }, []);

  const startActiveMiniGame = useCallback(() => {
    const meta = MINI_GAME_META.find((m) => m.id === activeGame)!;
    resetMiniGameState(activeGame);
    setTimeLeft(meta.durationSec);
    setGameStatus('playing');
    playSound('click');
  }, [activeGame, resetMiniGameState, playSound]);

  const scheduleNextChallenge = useCallback(
    (currentGame: MiniGameId) => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
      if (currentGame < 6) {
        const nextId = (currentGame + 1) as MiniGameId;
        autoAdvanceTimerRef.current = window.setTimeout(() => {
          resetMiniGameState(nextId);
          setGameStatus('playing');
        }, 1400);
      } else {
        autoAdvanceTimerRef.current = window.setTimeout(() => {
          setShowLeaderboard(true);
        }, 1200);
      }
    },
    [resetMiniGameState]
  );

  const finishGameWin = useCallback(
    (msg: string, bonus = 5) => {
      setGameStatus('won');
      const suffix =
        activeGame < 6
          ? ` → Tự động chuyển sang Thử thách ${activeGame + 1}!`
          : ' → 🏆 Đã hoàn thành cả 6 thử thách!';
      setFeedbackBanner({ text: `${msg} (+${bonus} điểm cho Nhóm ${activeTeamId})${suffix}`, ok: true });
      addScoreToTeam(activeTeamId, bonus);
      playSound('win');
      scheduleNextChallenge(activeGame);
    },
    [activeGame, activeTeamId, addScoreToTeam, playSound, scheduleNextChallenge]
  );

  // Countdown timer when playing
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          if (activeGame === 3) {
            setGameStatus('won');
            setFeedbackBanner({
              text: '🎉 Hoàn thành Thử thách 3! → Tự động chuyển sang Thử thách 4!',
              ok: true,
            });
            playSound('win');
            scheduleNextChallenge(3);
          } else {
            setGameStatus('lost');
            setFeedbackBanner({ text: '⏰ Hết giờ! Bấm "Chơi lại" hoặc đổi nhóm khác nhé.', ok: false });
            playSound('wrong');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gameStatus, activeGame, playSound, scheduleNextChallenge]);

  // Fixed Top HTML5 Canvas: 8-Team Sprout Race Track
  useEffect(() => {
    const canvas = raceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let tick = 0;

    const draw = () => {
      tick += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Sky & garden gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#ecfeff');
      bgGrad.addColorStop(0.65, '#f0fdf4');
      bgGrad.addColorStop(1, '#dcfce7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Milestone dashed lines (40đ nở hoa, 60đ về đích)
      const baseLineY = h - 36;
      const topLimitY = 28;
      const trackHeight = baseLineY - topLimitY;
      const flowerY = baseLineY - (FLOWER_THRESHOLD / MAX_SCORE) * trackHeight;
      const finishY = topLimitY;

      // Finish line (60đ)
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(48, finishY);
      ctx.lineTo(w - 16, finishY);
      ctx.stroke();
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('🏁 60đ ĐÍCH', 6, finishY + 4);

      // Flower line (40đ)
      ctx.strokeStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(48, flowerY);
      ctx.lineTo(w - 16, flowerY);
      ctx.stroke();
      ctx.fillStyle = '#be185d';
      ctx.fillText('🌸 40đ NỞ HOA', 6, flowerY + 4);
      ctx.restore();

      const colAreaStart = 96;
      const colWidth = (w - colAreaStart - 20) / 8;

      teams.forEach((team, idx) => {
        // Smooth score lerp
        const currentDisp = displayedScoresRef.current[idx] ?? 0;
        const nextDisp = currentDisp + (team.score - currentDisp) * 0.14;
        displayedScoresRef.current[idx] = nextDisp;

        const cx = colAreaStart + colWidth * idx + colWidth / 2;
        const isSelected = team.id === activeTeamId;

        // Highlight active team lane
        if (isSelected) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
          ctx.beginPath();
          ctx.roundRect(cx - colWidth * 0.44, 10, colWidth * 0.88, h - 14, 12);
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Tree growth height & organic curve
        const ratio = Math.max(0, Math.min(1, nextDisp / MAX_SCORE));
        const stemH = Math.max(14, ratio * trackHeight);
        const topY = baseLineY - stemH;
        const sway = Math.sin(tick + idx * 0.9) * 3;
        const headX = cx + sway * 0.65;

        // Helper: draw teardrop leaf with vein
        const drawLeaf = (lx: number, ly: number, dir: number, scale: number, tint: string) => {
          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate(dir * (0.55 + Math.sin(tick * 1.4 + idx) * 0.08));
          ctx.fillStyle = tint;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(dir * 11 * scale, -8 * scale, dir * 18 * scale, 0);
          ctx.quadraticCurveTo(dir * 11 * scale, 8 * scale, 0, 0);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(1, 0);
          ctx.lineTo(dir * 13 * scale, 0);
          ctx.stroke();
          ctx.restore();
        };

        // Main trunk / stem (gradient woody-green)
        const stemGrad = ctx.createLinearGradient(cx, baseLineY - 14, headX, topY);
        stemGrad.addColorStop(0, ratio > 0.45 ? '#854d0e' : '#15803d');
        stemGrad.addColorStop(0.5, '#16a34a');
        stemGrad.addColorStop(1, '#4ade80');
        ctx.strokeStyle = stemGrad;
        ctx.lineWidth = ratio > 0.5 ? 6.5 : 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, baseLineY - 15);
        ctx.quadraticCurveTo(cx + sway, baseLineY - stemH * 0.5, headX, topY);
        ctx.stroke();

        // Side branches & lush leaves
        const branchCount = Math.floor(ratio * 4) + 1;
        for (let lp = 0; lp < branchCount; lp++) {
          const frac = (lp + 0.5) / (branchCount + 0.4);
          const ly = baseLineY - 18 - stemH * frac;
          const bx = cx + sway * (frac * 0.7);
          const leafScale = 0.85 + ratio * 0.4;
          const dir = lp % 2 === 0 ? -1 : 1;

          if (ratio > 0.3 && lp > 0) {
            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(bx, ly + 4);
            ctx.quadraticCurveTo(bx + dir * 10, ly - 2, bx + dir * 14, ly - 7);
            ctx.stroke();
            drawLeaf(bx + dir * 14, ly - 7, dir, leafScale * 0.9, '#10b981');
          }
          drawLeaf(bx, ly, -1, leafScale, lp % 2 === 0 ? '#22c55e' : '#16a34a');
          drawLeaf(bx, ly, 1, leafScale, lp % 2 === 0 ? '#4ade80' : '#22c55e');
        }

        // Lush canopy behind crown when >= 25đ
        if (nextDisp >= 25) {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
          ctx.beginPath();
          ctx.arc(headX, topY + 4, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Crown: Sprout bud -> Glowing Blossom (>=40đ) -> Golden Star (>=60đ)
        if (nextDisp >= FLOWER_THRESHOLD) {
          ctx.save();
          // Soft glow
          ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
          ctx.beginPath();
          ctx.arc(headX, topY, 18, 0, Math.PI * 2);
          ctx.fill();

          const petals = 6;
          for (let p = 0; p < petals; p++) {
            const angle = (p * Math.PI * 2) / petals + tick * 0.35;
            ctx.fillStyle = p % 2 === 0 ? '#f43f5e' : '#fb7185';
            ctx.beginPath();
            ctx.ellipse(
              headX + Math.cos(angle) * 9,
              topY + Math.sin(angle) * 9,
              6.5,
              4.2,
              angle,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(headX, topY, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          if (team.score >= MAX_SCORE) {
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👑', headX, topY - 24);
          }
          ctx.restore();
        } else {
          // Fresh twin-sprout crown
          drawLeaf(headX, topY + 2, -1, 0.9, '#4ade80');
          drawLeaf(headX, topY + 2, 1, 0.9, '#86efac');
          ctx.fillStyle = '#bbf7d0';
          ctx.beginPath();
          ctx.arc(headX, topY, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Soil mound + 3D Ceramic Pot
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(cx, baseLineY - 15, 17, 5, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        const potGrad = ctx.createLinearGradient(cx - 18, baseLineY - 15, cx + 18, baseLineY + 6);
        potGrad.addColorStop(0, team.color);
        potGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = potGrad;
        ctx.beginPath();
        ctx.moveTo(cx - 19, baseLineY - 14);
        ctx.lineTo(cx + 19, baseLineY - 14);
        ctx.lineTo(cx + 14, baseLineY + 6);
        ctx.lineTo(cx - 14, baseLineY + 6);
        ctx.closePath();
        ctx.fill();

        // Pot rim highlight
        ctx.fillStyle = team.color;
        ctx.beginPath();
        ctx.roundRect(cx - 21, baseLineY - 18, 42, 6, 3);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Team label & score
        ctx.fillStyle = isSelected ? '#065f46' : '#1e293b';
        ctx.font = isSelected ? 'bold 12px sans-serif' : 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(team.name, cx, h - 14);

        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${team.score}đ`, cx, topY - 14);
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [teams, activeTeamId]);

  // Game 3 Canvas Arcade Loop
  useEffect(() => {
    if (activeGame !== 3 || gameStatus !== 'playing') return;
    const canvas = arcadeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface FallingItem {
      id: number;
      x: number;
      y: number;
      speed: number;
      label: string;
      emoji: string;
      isGood: boolean;
    }

    const goodPool = [
      { label: 'Giấy vụn', emoji: '📄' },
      { label: 'Bã cà phê', emoji: '☕' },
      { label: 'Vỏ ngô', emoji: '🌽' },
    ];
    const badPool = [
      { label: 'Túi nilon', emoji: '🛍️' },
      { label: 'Ly nhựa', emoji: '🥤' },
    ];

    let items: FallingItem[] = [];
    let spawnCounter = 0;
    let idCounter = 1;
    let animId = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysPressedRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysPressedRef.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysPressedRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysPressedRef.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#f0fdf4');
      grad.addColorStop(1, '#dcfce7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (keysPressedRef.current.left) basketXRef.current = Math.max(48, basketXRef.current - 7);
      if (keysPressedRef.current.right) basketXRef.current = Math.min(w - 48, basketXRef.current + 7);

      spawnCounter++;
      if (spawnCounter % 26 === 0) {
        const isGood = Math.random() > 0.35;
        const src = isGood
          ? goodPool[Math.floor(Math.random() * goodPool.length)]
          : badPool[Math.floor(Math.random() * badPool.length)];
        items.push({
          id: idCounter++,
          x: 34 + Math.random() * (w - 68),
          y: -20,
          speed: 2.6 + Math.random() * 1.8,
          label: src.label,
          emoji: src.emoji,
          isGood,
        });
      }

      const bx = basketXRef.current;
      const by = h - 38;

      // Update & draw falling items
      const remaining: FallingItem[] = [];
      for (const it of items) {
        it.y += it.speed;
        const caught = Math.abs(it.x - bx) < 52 && it.y >= by - 16 && it.y <= by + 20;
        if (caught) {
          const delta = it.isGood ? 5 : -5;
          setArcadeScore((s) => s + delta);
          addScoreToTeam(activeTeamId, delta);
          continue;
        }
        if (it.y < h + 25) {
          ctx.fillStyle = it.isGood ? '#dcfce7' : '#fee2e2';
          ctx.strokeStyle = it.isGood ? '#16a34a' : '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(it.x - 36, it.y - 16, 72, 32, 10);
          ctx.fill();
          ctx.stroke();

          ctx.font = 'bold 11px sans-serif';
          ctx.fillStyle = it.isGood ? '#14532d' : '#7f1d1d';
          ctx.textAlign = 'center';
          ctx.fillText(`${it.emoji} ${it.label}`, it.x, it.y + 4);
          remaining.push(it);
        }
      }
      items = remaining;

      // Draw THÂN THIỆN MÔI TRƯỜNG basket
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(bx - 76, by - 12, 152, 30, 8);
      ctx.fill();
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('♻️ THÂN THIỆN MÔI TRƯỜNG', bx, by + 7);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeGame, gameStatus, activeTeamId, addScoreToTeam]);

  // Handlers for Mini-games
  const handleDropIodine = (tubeId: string, expected: 'amber' | 'blue') => {
    if (gameStatus !== 'playing') return;
    playSound('drop');
    setTestedTubes((prev) => ({ ...prev, [tubeId]: expected }));
    if (expected === 'blue') {
      finishGameWin('Chính xác! Hồ tinh bột nguội (25°C) tạo phức xanh tím đặc trưng với Iodine', 5);
    } else {
      setFeedbackBanner({
        text: 'Ống này không đổi màu xanh tím (chỉ có màu vàng nâu của Iodine). Thử ống khác!',
        ok: false,
      });
    }
  };

  const handleSortPick = (choice: 'starch' | 'cellulose') => {
    if (gameStatus !== 'playing') return;
    const card = SORT_CARDS[sortIndex];
    if (!card) return;
    if (choice === card.target) {
      const nextCorrect = sortCorrectCount + 1;
      setSortCorrectCount(nextCorrect);
      playSound('correct');
      if (sortIndex + 1 >= SORT_CARDS.length) {
        finishGameWin(`Hoàn thành phân loại ${nextCorrect}/4 thẻ tính chất!`, 5);
      } else {
        setSortIndex(sortIndex + 1);
        setFeedbackBanner({ text: 'Chính xác! Tiếp tục thẻ tiếp theo!', ok: true });
      }
    } else {
      playSound('wrong');
      setFeedbackBanner({ text: 'Chưa đúng rồi! Hãy đọc kỹ trạng thái & tính tan của chất nhé.', ok: false });
    }
  };

  const handleMatchGreenProduct = (choice: 'starch' | 'cellulose') => {
    if (gameStatus !== 'playing') return;
    const currentItem = GREEN_PRODUCTS.find((p) => p.id === activeProductId);
    if (!currentItem) return;

    if (choice === currentItem.target) {
      const nextMatched = { ...matchedProducts, [currentItem.id]: true };
      setMatchedProducts(nextMatched);
      playSound('correct');

      const nextPending = GREEN_PRODUCTS.find((p) => !nextMatched[p.id]);
      if (!nextPending) {
        finishGameWin('Xuất sắc! Đã phân loại chuẩn 4/4 sản phẩm xanh từ Tinh bột & Cellulose!', 5);
      } else {
        setActiveProductId(nextPending.id);
        setFeedbackBanner({ text: `Chính xác! Tiếp tục chọn nguồn gốc cho "${nextPending.title}"`, ok: true });
      }
    } else {
      playSound('wrong');
      setFeedbackBanner({
        text: `Chưa đúng rồi! Hãy nghĩ xem "${currentItem.title}" được làm từ Tinh bột hay Cellulose nhé.`,
        ok: false,
      });
    }
  };

  const handlePickPhotoPiece = (pieceId: string) => {
    if (gameStatus !== 'playing') return;
    if (pieceId === 'distractor') {
      playSound('wrong');
      setFeedbackBanner({
        text: '"(C₆H₁₀O₅)ₙ" là mảnh nhiễu! Phương trình quang hợp tạo ra Glucose (C₆H₁₂O₆).',
        ok: false,
      });
      return;
    }
    const nextStep = photoSelectedIds.length;
    if (PHOTO_CORRECT_ORDER[nextStep] === pieceId) {
      const nextList = [...photoSelectedIds, pieceId];
      setPhotoSelectedIds(nextList);
      playSound('correct');
      if (nextList.length === PHOTO_CORRECT_ORDER.length) {
        finishGameWin('Ghép chuẩn phương trình Quang hợp: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂!', 5);
      }
    } else {
      playSound('wrong');
      setFeedbackBanner({
        text: 'Sai thứ tự mảnh ghép rồi! Gợi ý: Khí CO₂ + Nước → Glucose + O₂.',
        ok: false,
      });
    }
  };

  const handleCheckEnglish = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;
    if (englishInput.trim().toLowerCase() === 'starch') {
      finishGameWin('Tuyệt vời! "Starch" (/stɑːtʃ/) chính là Tinh bột!', 5);
    } else {
      playSound('wrong');
      setFeedbackBanner({ text: 'Chưa chính xác! Gợi ý: Từ tiếng Anh gồm 6 chữ cái, bắt đầu bằng "S...".', ok: false });
    }
  };

  const handleRandomPick = () => {
    playSound('click');
    const randomTeam = Math.floor(Math.random() * 8) + 1;
    const randomGame = (Math.floor(Math.random() * 6) + 1) as MiniGameId;
    setActiveTeamId(randomTeam);
    resetMiniGameState(randomGame);
  };

  const handleResetAll = () => {
    playSound('click');
    setTeams(INITIAL_TEAMS);
    setActiveTeamId(1);
    setIsTeacherStarted(false);
    resetMiniGameState(1);
    emitRoomEvent('CMD_RESET', 0);
  };

  const handleTeacherStartConfirm = () => {
    if (startPassInput.trim() === TEACHER_PASSWORD) {
      setIsTeacherStarted(true);
      setShowStartPassModal(false);
      setStartPassError(null);
      setStartPassInput('');
      resetMiniGameState(1);
      setGameStatus('playing');
      playSound('win');
      emitRoomEvent('CMD_START', 0);
    } else {
      playSound('wrong');
      setStartPassError('Mật khẩu giáo viên chưa chính xác!');
    }
  };

  const currentMeta = MINI_GAME_META.find((m) => m.id === activeGame)!;
  const sortedLeaderboard = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-teal-50/40 to-sky-50 text-slate-900 pb-10">
      {/* TOP BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-200 px-3 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
            )}
            <div>
              <h1 className="text-sm sm:text-base font-black text-emerald-950 uppercase tracking-tight flex items-center gap-1.5">
                <span>🌱 ĐƯỜNG ĐUA MẦM XANH – TRẠM NĂNG LƯỢNG</span>
              </h1>
              <p className="text-[11px] font-bold text-emerald-700">
                Khởi động Tiết 1 (5 phút) • Dự án STEAM Bài 30: Tinh bột &amp; Cellulose (KHTN 9)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  syncStatus === 'live'
                    ? 'bg-emerald-500 animate-pulse'
                    : syncStatus === 'connecting'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              <span className="text-slate-700">
                {syncStatus === 'live' ? 'Đồng bộ Live:' : syncStatus === 'connecting' ? 'Đang kết nối...' : 'Offline:'}
              </span>
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && roomCodeInput.trim()) {
                    setRoomCode(roomCodeInput.trim().toUpperCase());
                  }
                }}
                onBlur={() => {
                  if (roomCodeInput.trim() && roomCodeInput.trim().toUpperCase() !== roomCode) {
                    setRoomCode(roomCodeInput.trim().toUpperCase());
                  }
                }}
                aria-label="Mã phòng đồng bộ"
                className="w-24 bg-white border border-slate-300 rounded-md px-1.5 py-0.5 text-[11px] font-black text-indigo-950 outline-none"
                title="Nhập cùng mã phòng trên các máy khác nhau để đồng bộ tiến độ thời gian thực"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsJudgeQuickView((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                isJudgeQuickView
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
              title="Mở đáp án nhanh & điều khiển tự do cho Ban Giám khảo (không cần mật khẩu)"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{isJudgeQuickView ? 'Đang bật: Xem nhanh GK' : 'Xem nhanh cho Ban Giám khảo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 cursor-pointer border ${
                soundEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
            </button>

            <button
              type="button"
              onClick={handleRandomPick}
              className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Chọn ngẫu nhiên</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLeaderboard(true)}
              className="px-3 py-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Bảng Vàng</span>
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 flex flex-col gap-4">
        {/* 1. FIXED TOP RACE TRACK (HTML5 CANVAS) */}
        <section className="bg-white rounded-3xl border-2 border-emerald-200 shadow-md p-3 sm:p-4">
          <div className="w-full overflow-x-auto">
            <canvas
              ref={raceCanvasRef}
              width={960}
              height={220}
              className="w-full min-w-160 h-52 sm:h-56 rounded-2xl border border-emerald-100 block"
            />
          </div>

          {/* Quick Team Selector + Quick +5đ */}
          <div className="mt-3 pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black text-emerald-950 mr-1">🎯 Lượt nhóm:</span>
              {teams.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setActiveTeamId(t.id);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer border ${
                    activeTeamId === t.id
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs scale-105'
                      : 'bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {t.name} ({t.score}đ)
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => addScoreToTeam(activeTeamId, -5)}
                className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>5đ</span>
              </button>
              <button
                type="button"
                onClick={() => addScoreToTeam(activeTeamId, 5)}
                className="px-3.5 py-1.5 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cộng nhanh +5đ (Nhóm {activeTeamId})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Judge Quick View Answer Bar */}
        {isJudgeQuickView && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
            <div>
              <strong className="font-black">🏅 Gợi ý đáp án cho Ban Giám khảo:</strong>{' '}
              <span>
                G1: Hồ tinh bột nguội (25°C) • G2: 1-Tinh bột, 2-Cellulose, 3-Tinh bột, 4-Cellulose • G3: Hứng Giấy/Bã
                cà phê/Vỏ ngô • G4: Cơm & Glucose → Tinh bột; Vải cotton & Màng bọc bã mía → Cellulose • G5: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ • G6: <strong>Starch</strong>
              </span>
            </div>
          </div>
        )}

        {/* 2. MINI-GAME SELECTOR + ACTIVE ARENA */}
        <section className="bg-white rounded-3xl border-2 border-indigo-200 shadow-md p-4 sm:p-5 flex flex-col gap-4">
          {!isTeacherStarted && !isJudgeQuickView ? (
            <div className="py-10 px-4 text-center flex flex-col items-center gap-4 bg-linear-to-b from-indigo-50/70 to-emerald-50/60 rounded-2xl border-2 border-dashed border-indigo-200">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-amber-300 flex items-center justify-center shadow-md">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-lg">
                <h2 className="text-base sm:text-lg font-black text-indigo-950 uppercase">
                  Sẵn sàng Đường Đua Mầm Xanh — 8 Nhóm
                </h2>
                <p className="text-xs sm:text-sm text-indigo-900/80 font-medium mt-1 leading-relaxed">
                  Giáo viên nhập mật khẩu để phát lệnh bắt đầu cho cả 8 nhóm. Khi hoàn thành Thử thách 1, hệ thống sẽ tự động chuyển liên hoàn qua Thử thách 2 → 3 → 4 → 5 → 6!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStartPassInput('');
                  setStartPassError(null);
                  setShowStartPassModal(true);
                }}
                className="px-6 py-3 rounded-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-105"
              >
                <Play className="w-4 h-4" />
                <span>Giáo viên Bắt đầu cho 8 nhóm (Nhập Pass)</span>
              </button>
            </div>
          ) : (
          <>
          {/* Tabs for 6 Mini-games */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {MINI_GAME_META.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  resetMiniGameState(m.id);
                }}
                className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  activeGame === m.id
                    ? 'bg-indigo-950 text-white border-indigo-950 shadow-sm'
                    : 'bg-indigo-50/50 text-indigo-950 border-indigo-100 hover:border-indigo-300'
                }`}
              >
                <div className={`text-[10px] font-black ${activeGame === m.id ? 'text-amber-300' : 'text-indigo-600'}`}>
                  {m.badge}
                </div>
                <div className="text-xs font-black mt-0.5 leading-snug">{m.shortTitle}</div>
              </button>
            ))}
          </div>

          {/* Mini-game Header & Controls */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-indigo-950">{currentMeta.fullTitle}</h2>
              <p className="text-xs text-indigo-900/80 font-medium mt-0.5">{currentMeta.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`px-3.5 py-1.5 rounded-full font-black text-sm flex items-center gap-1.5 border ${
                  timeLeft <= 5 && gameStatus === 'playing'
                    ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-white text-indigo-950 border-indigo-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>

              {gameStatus === 'ready' ? (
                <button
                  type="button"
                  onClick={startActiveMiniGame}
                  className="px-4 py-2 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Bắt đầu lượt (Nhóm {activeTeamId})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startActiveMiniGame}
                  className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chơi lại</span>
                </button>
              )}
            </div>
          </div>

          {feedbackBanner && (
            <div
              className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border ${
                feedbackBanner.ok
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {feedbackBanner.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
              <span>{feedbackBanner.text}</span>
            </div>
          )}

          {/* GAME 1: Iodine Test (4 tubes) */}
          {activeGame === 1 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'cold', title: 'Hồ tinh bột nguội (25°C)', expected: 'blue' as const, note: 'Amylose xoắn giữ chặt phân tử I₂ → xanh tím' },
                { id: 'hot', title: 'Hồ tinh bột đun nóng (80°C)', expected: 'amber' as const, note: 'Mạch xoắn giãn ra khi đun nóng → mất màu xanh tím' },
                { id: 'cotton', title: 'Sợi bông Cellulose nguyên chất', expected: 'amber' as const, note: 'Mạch thẳng không xoắn → không đổi xanh tím' },
                { id: 'water', title: 'Nước cất tinh khiết', expected: 'amber' as const, note: 'Dung môi đối chứng' },
              ].map((tube) => {
                const state = testedTubes[tube.id] || 'none';
                const liquidClass =
                  state === 'blue'
                    ? 'bg-indigo-900 text-white'
                    : state === 'amber'
                    ? 'bg-amber-400/80 text-amber-950'
                    : 'bg-sky-100/80 text-slate-600';
                return (
                  <div
                    key={tube.id}
                    className="rounded-2xl border-2 border-indigo-100 bg-slate-50/70 p-4 flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-16 h-32 rounded-b-full border-4 border-slate-400 bg-white relative overflow-hidden flex items-end justify-center shadow-inner">
                      <div className={`w-full h-20 transition-colors duration-500 flex items-center justify-center text-xs font-black ${liquidClass}`}>
                        {state === 'blue' ? 'Xanh tím' : state === 'amber' ? 'Vàng nâu' : 'Trong'}
                      </div>
                    </div>
                    <div className="text-xs font-black text-indigo-950 min-h-8">{tube.title}</div>
                    <button
                      type="button"
                      disabled={gameStatus !== 'playing'}
                      onClick={() => handleDropIodine(tube.id, tube.expected)}
                      className="w-full px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Nhỏ Iodine</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* GAME 2: Sort Starch & Cellulose */}
          {activeGame === 2 && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-xs font-black text-indigo-700">
                Thẻ {Math.min(sortIndex + 1, SORT_CARDS.length)} / {SORT_CARDS.length} • Đã đúng: {sortCorrectCount}/4
              </div>
              <div className="w-full max-w-2xl rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-5 text-center shadow-xs">
                <p className="text-sm sm:text-base font-black text-indigo-950">
                  {SORT_CARDS[sortIndex]?.text}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                <button
                  type="button"
                  disabled={gameStatus !== 'playing'}
                  onClick={() => handleSortPick('starch')}
                  className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-950 font-black text-sm cursor-pointer shadow-xs"
                >
                  🍚 TINH BỘT (C₆H₁₀O₅)ₙ
                </button>
                <button
                  type="button"
                  disabled={gameStatus !== 'playing'}
                  onClick={() => handleSortPick('cellulose')}
                  className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-950 font-black text-sm cursor-pointer shadow-xs"
                >
                  🌿 CELLULOSE (C₆H₁₀O₅)ₘ
                </button>
              </div>
            </div>
          )}

          {/* GAME 3: Arcade Hứng Cellulose Xanh (Canvas) */}
          {activeGame === 3 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-between w-full max-w-xl text-xs font-black">
                <span className="text-emerald-700">Điểm Arcade lượt này: {arcadeScore}đ</span>
                <span className="text-slate-500">Di chuyển chuột/ngón tay trên khung hoặc bấm phím ← →</span>
              </div>
              <canvas
                ref={arcadeCanvasRef}
                width={560}
                height={300}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 560;
                  basketXRef.current = Math.max(48, Math.min(512, x));
                }}
                onTouchMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const touch = e.touches[0];
                  if (!touch) return;
                  const x = ((touch.clientX - rect.left) / rect.width) * 560;
                  basketXRef.current = Math.max(48, Math.min(512, x));
                }}
                className="w-full max-w-xl h-72 rounded-2xl border-2 border-emerald-300 bg-emerald-50 cursor-ew-resize touch-none"
              />
            </div>
          )}

          {/* GAME 4: Green Products Matching */}
          {activeGame === 4 && (
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full">
                {GREEN_PRODUCTS.map((prod) => {
                  const isDone = Boolean(matchedProducts[prod.id]);
                  const isActive = activeProductId === prod.id && !isDone;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      disabled={gameStatus !== 'playing' || isDone}
                      onClick={() => {
                        playSound('click');
                        setActiveProductId(prod.id);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-80'
                          : isActive
                          ? 'bg-indigo-950 text-white border-indigo-950 shadow-md scale-[1.02]'
                          : 'bg-slate-50 border-indigo-100 text-indigo-950 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{prod.emoji}</span>
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="text-xs font-black leading-snug">{prod.title}</div>
                      {isDone && (
                        <span className="text-[10px] font-black uppercase text-emerald-700">
                          ✓ {prod.target === 'starch' ? 'Tinh bột' : 'Cellulose'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                <button
                  type="button"
                  disabled={gameStatus !== 'playing'}
                  onClick={() => handleMatchGreenProduct('starch')}
                  className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-950 font-black text-sm cursor-pointer shadow-xs"
                >
                  🍚 NGUỒN GỐC TINH BỘT (C₆H₁₀O₅)ₙ
                </button>
                <button
                  type="button"
                  disabled={gameStatus !== 'playing'}
                  onClick={() => handleMatchGreenProduct('cellulose')}
                  className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-950 font-black text-sm cursor-pointer shadow-xs"
                >
                  🌿 NGUỒN GỐC CELLULOSE (C₆H₁₀O₅)ₘ
                </button>
              </div>
            </div>
          )}

          {/* GAME 5: Photosynthesis Equation */}
          {activeGame === 5 && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-2xl p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-wrap items-center justify-center gap-2 min-h-16">
                {photoSelectedIds.length === 0 ? (
                  <span className="text-xs font-bold text-emerald-700">
                    Bấm chọn các mảnh ghép bên dưới theo đúng thứ tự phương trình Quang hợp...
                  </span>
                ) : (
                  photoSelectedIds.map((pid) => {
                    const p = PHOTO_PIECES.find((x) => x.id === pid);
                    return (
                      <span key={pid} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-sm">
                        {p?.label}
                      </span>
                    );
                  })
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {shuffledPhotoPieces.map((piece) => {
                  const used = photoSelectedIds.includes(piece.id);
                  return (
                    <button
                      key={piece.id}
                      type="button"
                      disabled={gameStatus !== 'playing' || used}
                      onClick={() => handlePickPhotoPiece(piece.id)}
                      className={`px-4 py-2.5 rounded-xl border-2 text-sm font-black cursor-pointer transition-all ${
                        used
                          ? 'bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-white border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-950 shadow-2xs'
                      }`}
                    >
                      {piece.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME 6: English Challenge */}
          {activeGame === 6 && (
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full">
                {ENGLISH_HINTS.map((h) => {
                  const flipped = Boolean(flippedHints[h.id]);
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setFlippedHints((prev) => ({ ...prev, [h.id]: true }));
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-24 flex flex-col justify-between ${
                        flipped
                          ? 'bg-sky-50 border-sky-300 text-sky-950'
                          : 'bg-indigo-900 border-indigo-800 text-white hover:bg-indigo-800'
                      }`}
                    >
                      <span className="text-[11px] font-black uppercase opacity-80">{h.label}</span>
                      <span className="text-xs font-bold mt-1">
                        {flipped ? h.content : '🔍 Bấm để lật gợi ý'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleCheckEnglish} className="flex flex-wrap items-center justify-center gap-2 w-full max-w-md">
                <input
                  type="text"
                  value={englishInput}
                  onChange={(e) => setEnglishInput(e.target.value)}
                  disabled={gameStatus !== 'playing'}
                  placeholder="Nhập từ tiếng Anh (6 chữ cái)..."
                  className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 text-sm font-black text-indigo-950 outline-none"
                />
                <button
                  type="submit"
                  disabled={gameStatus !== 'playing'}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs cursor-pointer"
                >
                  Kiểm tra
                </button>
              </form>
            </div>
          )}
          </>
          )}
        </section>
      </main>

      {/* MODAL NHẬP PASS GIÁO VIÊN BẮT ĐẦU */}
      {showStartPassModal && (
        <div
          onClick={() => setShowStartPassModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-emerald-200"
          >
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Giáo viên phát lệnh bắt đầu</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-3">
              Nhập mật khẩu Giáo viên để mở khóa và bắt đầu đồng loạt cho cả 8 nhóm.
            </p>
            <input
              type="password"
              value={startPassInput}
              onChange={(e) => {
                setStartPassInput(e.target.value);
                setStartPassError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleTeacherStartConfirm()}
              placeholder="Nhập mật khẩu..."
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-indigo-200 focus:border-emerald-500 text-sm font-black text-indigo-950 outline-none mb-2"
            />
            {startPassError && <p className="text-xs font-bold text-rose-600 mb-2">{startPassError}</p>}
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowStartPassModal(false)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-black cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleTeacherStartConfirm}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer"
              >
                Bắt đầu ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BẢNG VÀNG XẾP HẠNG MODAL */}
      {showLeaderboard && (
        <div
          onClick={() => setShowLeaderboard(false)}
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border-2 border-amber-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-amber-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>🏆 BẢNG VÀNG ĐƯỜNG ĐUA MẦM XANH</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLeaderboard(false)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-black cursor-pointer"
              >
                Đóng
              </button>
            </div>
            <div className="space-y-2">
              {sortedLeaderboard.map((t, idx) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    idx === 0 ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-indigo-950 text-white text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-black text-sm text-indigo-950">{t.name}</span>
                    {t.score >= FLOWER_THRESHOLD && <span className="text-xs">🌸 Đã nở hoa!</span>}
                    {t.score >= MAX_SCORE && <span className="text-xs font-black text-amber-600">🏁 Về đích!</span>}
                  </div>
                  <span className="font-black text-base text-orange-600">{t.score}đ</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

