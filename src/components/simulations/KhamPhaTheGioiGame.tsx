import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, Upload, CheckCircle, Zap, Target, Battery, Crown, Image as ImageIcon, RefreshCcw, Map as MapIcon, Loader2, Info, XCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { getGeminiClient, getGeminiApiKey } from '../../lib/gemini';

// Initialize Gemini SDK conditionally inside the scan function, using getGeminiClient
const getGeminiAPI = () => {
  return getGeminiClient();
};

type LevelTheme = 'jungle' | 'desert' | 'mountain' | 'plains' | 'ocean';

interface Question {
  id: string;
  npcLabel: string;
  npcEmoji: string;
  npcImage?: string;
  npcScale?: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3
  isAnswered?: boolean;
}

interface LevelData {
  id: LevelTheme;
  name: string;
  bgClass: string;
  bgImage?: string;
  questions: Question[];
}

const LEVEL_TEMPLATES: Record<LevelTheme, { name: string; bgClass: string; bgImage?: string; npcs: { label: string; emoji: string; image?: string; scale?: number; pos: {x: number, y: number} }[] }> = {
  jungle: {
    name: 'Rừng Rậm Nhiệt Đới',
    bgClass: 'from-emerald-900 via-green-900 to-teal-950',
    bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    npcs: [
      { label: 'Khỉ', emoji: '🐒', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fcon_kh%E1%BB%89-removebg-preview.png?alt=media&token=ad21683d-4212-44cb-a379-93eb5d0595d8', scale: 3.8, pos: { x: 8, y: 60 } },
      { label: 'Hổ', emoji: '🐅', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fcon_h%E1%BB%95-removebg-preview.png?alt=media&token=323cfed2-392f-432c-9461-8458c8f3e554', scale: 3.2, pos: { x: 70, y: 60 } },
      { label: 'Vẹt', emoji: '🦜', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FGemini_Generated_Image_ruqbeyruqbeyruqb-removebg-preview.png?alt=media&token=a6f5cca6-f1fa-4844-ac76-8148bec24ec9', scale: 1.5, pos: { x: 35, y: 25 } },
    ]
  },
  desert: {
    name: 'Sa Mạc Khô Nóng',
    bgClass: 'from-orange-950 via-amber-900 to-yellow-950',
    bgImage: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80',
    npcs: [
      { label: 'Lạc đà', emoji: '🐪', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fl%E1%BA%A1c_%C4%91%C3%A0-removebg-preview.png?alt=media&token=869e14f2-c703-4389-b77e-36c3616f59c2', scale: 3.5, pos: { x: 50, y: 45 } },
      { label: 'Rắn', emoji: '🐍', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fb%E1%BA%A1n_th%C3%A2nh-removebg-preview.png?alt=media&token=f13496be-aeeb-42cd-8c8d-be533e0e7e12', scale: 0.8, pos: { x: 85, y: 80 } },
      { label: 'Xương rồng', emoji: '🌵', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fx%C6%B0%C6%A1ng_r%E1%BB%93ng-removebg-preview.png?alt=media&token=528ee9a6-3530-4f89-8cf6-170d2ee6c232', scale: 2.5, pos: { x: 15, y: 75 } },
    ]
  },
  mountain: {
    name: 'Núi Rừng Hùng Vĩ',
    bgClass: 'from-slate-900 via-slate-800 to-zinc-900',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    npcs: [
      { label: 'Đại bàng', emoji: '🦅', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BA%A1i_b%C3%A0ng-removebg-preview.png?alt=media&token=d4f5373a-86d9-4e81-b5e4-c676cbd4984b', pos: { x: 50, y: 20 } },
      { label: 'Gấu', emoji: '🐻', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fg%E1%BA%A5u-removebg-preview.png?alt=media&token=84f3282e-5170-429f-bb28-b092d7efb927', pos: { x: 25, y: 75 } },
      { label: 'Cây thông', emoji: '🌲', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fth%C3%B4ng-removebg-preview.png?alt=media&token=40656746-2682-447a-9a82-82831bd6bf28', scale: 8.0, pos: { x: 85, y: 55 } },
    ]
  },
  plains: {
    name: 'Đồng Bằng Bát Ngát',
    bgClass: 'from-green-700 via-lime-800 to-emerald-900',
    bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    npcs: [
      { label: 'Trâu', emoji: '🐃', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fcon_tr%C3%A2u-removebg-preview.png?alt=media&token=08d5debd-7c84-418b-9a1f-92ef1af54feb', pos: { x: 40, y: 60 } },
      { label: 'Chim sẻ', emoji: '🐦', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fchim_s%E1%BA%BB-removebg-preview.png?alt=media&token=76998bd5-ba2a-49c6-9ed6-f6512f1d26b2', pos: { x: 75, y: 30 } },
      { label: 'Bù nhìn', emoji: '🧍', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fb%C3%B9_nh%C3%ACn-removebg-preview.png?alt=media&token=e2caf06b-c505-4cb8-b91e-4c8e6eec5923', scale: 3.5, pos: { x: 15, y: 80 } },
    ]
  },
  ocean: {
    name: 'Đại Dương Bao La',
    bgClass: 'from-blue-950 via-cyan-900 to-sky-950',
    bgImage: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&q=80',
    npcs: [
      { label: 'Cá', emoji: '🐟', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%C3%A1-removebg-preview.png?alt=media&token=44289599-e476-4ba0-8a1b-ca63c2ce7d62', pos: { x: 20, y: 40 } },
      { label: 'Cua', emoji: '🦀', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fcua%20%E1%BA%A9n%20s%C4%A9.png?alt=media&token=98e93333-bb69-4abe-98c9-2b2fbf489599', pos: { x: 70, y: 75 } },
      { label: 'Tôm', emoji: '🦐', image: 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Ft%C3%B4m-removebg-preview.png?alt=media&token=70b6db86-874f-4847-891f-4f39be1b55c7', scale: 3.5, pos: { x: 40, y: 85 } },
    ]
  }
};

const ALL_THEMES: LevelTheme[] = ['jungle', 'desert', 'mountain', 'plains', 'ocean'];

export interface KhamPhaTheGioiProps {
  initialQuestions?: any[];
  onBack: () => void;
}

// Format text allowing $$ and $ for KaTeX
const renderKaTeX = (text: string) => {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <BlockMath key={index} math={part.slice(2, -2)} />;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    // Handle newlines
    return <span key={index}>{part.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i !== arr.length - 1 && <br />}
      </React.Fragment>
    ))}</span>;
  });
};

export function KhamPhaTheGioiGame({ initialQuestions, onBack }: KhamPhaTheGioiProps) {
  const [phase, setPhase] = useState<'setup' | 'game' | 'result'>(
    initialQuestions && initialQuestions.length > 0 ? 'game' : 'setup'
  );
  
  // Setup State
  const [setupMode, setSetupMode] = useState<'manual' | 'ai'>('manual');
  const [selectedThemes, setSelectedThemes] = useState<LevelTheme[]>(['jungle', 'desert']);
  const [levelsData, setLevelsData] = useState<LevelData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Group initialQuestions into levels if passed
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      const themes: LevelTheme[] = ['jungle', 'desert', 'mountain', 'plains', 'ocean'];
      const finalLevels: LevelData[] = [];
      const chunkSize = 3;
      const numLevels = Math.min(themes.length, Math.ceil(initialQuestions.length / chunkSize));
      
      for (let l = 0; l < numLevels; l++) {
        const theme = themes[l];
        const levelQs: Question[] = [];
        for (let i = 0; i < 3; i++) {
          const qIdx = l * chunkSize + i;
          if (qIdx < initialQuestions.length) {
            const rawQ = initialQuestions[qIdx];
            levelQs.push({
              id: rawQ.id || `${theme}-q${i}`,
              npcLabel: LEVEL_TEMPLATES[theme].npcs[i].label,
              npcEmoji: LEVEL_TEMPLATES[theme].npcs[i].emoji,
              npcImage: LEVEL_TEMPLATES[theme].npcs[i].image,
              npcScale: LEVEL_TEMPLATES[theme].npcs[i].scale,
              question: rawQ.text || rawQ.question,
              options: rawQ.options,
              correctAnswer: rawQ.answer !== undefined ? rawQ.answer : rawQ.correctAnswer
            });
          } else {
            levelQs.push({
              id: `${theme}-q${i}`,
              npcLabel: LEVEL_TEMPLATES[theme].npcs[i].label,
              npcEmoji: LEVEL_TEMPLATES[theme].npcs[i].emoji,
              npcImage: LEVEL_TEMPLATES[theme].npcs[i].image,
              npcScale: LEVEL_TEMPLATES[theme].npcs[i].scale,
              question: `Đây là ${LEVEL_TEMPLATES[theme].npcs[i].label}. Hãy hỏi tôi một câu hỏi!`,
              options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
              correctAnswer: 0
            });
          }
        }
        finalLevels.push({
          id: theme,
          name: LEVEL_TEMPLATES[theme].name,
          bgClass: LEVEL_TEMPLATES[theme].bgClass,
          bgImage: LEVEL_TEMPLATES[theme].bgImage,
          questions: levelQs
        });
      }
      
      setLevelsData(finalLevels);
      const totalQ = finalLevels.reduce((acc, lvl) => acc + lvl.questions.length, 0);
      setEnergy(totalQ);
      setMaxEnergy(totalQ);
      setCurrentLevelIdx(0);
      setAnsweredCount({ correct: 0, wrong: 0 });
    }
  }, [initialQuestions]);
  
  // Manual Input State
  const [manualInput, setManualInput] = useState<{ [theme: string]: string[] }>(() => {
    const defaultData: { [theme: string]: string[] } = {};
    ALL_THEMES.forEach(t => {
      defaultData[t] = ['', '', ''];
    });
    return defaultData;
  });

  // AI Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Game State
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answeredCount, setAnsweredCount] = useState({ correct: 0, wrong: 0 });
  
  // Pop-up assessment
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Handlers for Setup
  const handleThemeToggle = (theme: LevelTheme) => {
    if (selectedThemes.includes(theme)) {
      if (selectedThemes.length > 1) {
        setSelectedThemes(selectedThemes.filter(t => t !== theme));
      }
    } else {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  const parseManualInput = (inputText: string): Omit<Question, 'id' | 'npcEmoji' | 'npcLabel'> | null => {
    // Expected format: Question | OptionA | OptionB | OptionC | OptionD | CorrectIndex(0-3) or A/B/C/D
    const parts = inputText.split('|').map(s => s.trim());
    if (parts.length >= 6) {
      let correct = parseInt(parts[5]);
      if (isNaN(correct)) {
        const charMap: { [key: string]: number } = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
        correct = charMap[parts[5]] ?? 0;
      }
      return {
        question: parts[0],
        options: parts.slice(1, 5),
        correctAnswer: correct
      };
    }
    return null;
  };

  const handleStartGame = () => {
    const finalLevels: LevelData[] = [];
    let valid = true;

    selectedThemes.forEach(theme => {
      const qs: Question[] = [];
      for (let i = 0; i < 3; i++) {
        const raw = manualInput[theme][i];
        if (!raw.trim()) {
          // Add dummy question if empty
          qs.push({
            id: `${theme}-q${i}`,
            npcLabel: LEVEL_TEMPLATES[theme].npcs[i].label,
            npcEmoji: LEVEL_TEMPLATES[theme].npcs[i].emoji,
            npcImage: LEVEL_TEMPLATES[theme].npcs[i].image,
            npcScale: LEVEL_TEMPLATES[theme].npcs[i].scale,
            question: `Đây là ${LEVEL_TEMPLATES[theme].npcs[i].label}. Hãy hỏi tôi một câu hỏi!`,
            options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
            correctAnswer: 0
          });
        } else {
          const parsed = parseManualInput(raw);
          if (parsed) {
            qs.push({
              id: `${theme}-q${i}`,
              npcLabel: LEVEL_TEMPLATES[theme].npcs[i].label,
              npcEmoji: LEVEL_TEMPLATES[theme].npcs[i].emoji,
              npcImage: LEVEL_TEMPLATES[theme].npcs[i].image,
              npcScale: LEVEL_TEMPLATES[theme].npcs[i].scale,
              ...parsed
            });
          } else {
            valid = false;
          }
        }
      }
      finalLevels.push({
        id: theme,
        name: LEVEL_TEMPLATES[theme].name,
        bgClass: LEVEL_TEMPLATES[theme].bgClass,
        bgImage: LEVEL_TEMPLATES[theme].bgImage,
        questions: qs
      });
    });

    if (!valid) {
      setErrorMsg("Format không hợp lệ ở một số câu hỏi. Hãy đảm bảo mỗi câu đều dùng cấu trúc: Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D hoặc 0-3)");
      return;
    }

    setErrorMsg(null);
    setLevelsData(finalLevels);
    const totalQ = finalLevels.reduce((acc, lvl) => acc + lvl.questions.length, 0);
    setEnergy(totalQ);
    setMaxEnergy(totalQ);
    setCurrentLevelIdx(0);
    setAnsweredCount({ correct: 0, wrong: 0 });
    setPhase('game');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Read file as base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result?.toString() || '';
      setScanImage(base64Str);
      processAiScan(base64Str, file.type);
    };
    reader.readAsDataURL(file);
  };

  const processAiScan = async (base64Str: string, mimeType: string) => {
    setIsScanning(true);
    try {
      const cleanBase64 = base64Str.split(',')[1];
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        setErrorMsg('Tài khoản của bạn yêu cầu nhập Gemini API Key để sử dụng tính năng AI này. Vui lòng đăng nhập lại!');
        setIsScanning(false);
        return;
      }
      const ai = getGeminiAPI();
      
      const themeCount = selectedThemes.length;
      const totalRequired = themeCount * 3;

      const prompt = `Hãy đọc và phân tích nội dung kiến thức trong hình ảnh đính kèm. Sau đó, TẠO RA đúng ${totalRequired} câu hỏi trắc nghiệm (mỗi câu 4 đáp án) dựa trên nội dung đó. Nếu hình ảnh đã có sẵn câu hỏi, bạn có thể trích xuất chúng, nhưng phải đủ số lượng yêu cầu.
Dữ liệu trả về PHẢI là định dạng JSON mảng các câu hỏi.
Format mỗi phần tử JSON:
{
  "question": "Nội dung câu hỏi (sử dụng LaTeX với dấu $$ cho công thức)",
  "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
  "correctAnswer": 0 // 0 cho A, 1 cho B, 2 cho C, 3 cho D
}
Lưu ý: TRẢ VỀ DUY NHẤT MẢNG JSON, KHÔNG THÊM BẤT KỲ VĂN BẢN NÀO KHÁC NHƯ TEXT HOẶC MARKDOWN.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: mimeType
                }
              },
              { text: prompt }
            ]
          }
        ]
      });

      let jsonStr = response.text || "[]";
      // Clean markdown formatting if any
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedQs = JSON.parse(jsonStr) as any[];

      // Distribute to manual input
      if (Array.isArray(parsedQs)) {
        const newManualInput = { ...manualInput };
        let qIndex = 0;
        selectedThemes.forEach(theme => {
          newManualInput[theme] = [];
          for (let i = 0; i < 3; i++) {
            if (qIndex < parsedQs.length) {
              const q = parsedQs[qIndex];
              const line = `${q.question} | ${q.options[0]} | ${q.options[1]} | ${q.options[2]} | ${q.options[3]} | ${q.correctAnswer}`;
              newManualInput[theme][i] = line;
            } else {
              newManualInput[theme][i] = ''; // blank
            }
            qIndex++;
          }
        });
        setManualInput(newManualInput);
        setSetupMode('manual');
        setErrorMsg(null);
      }

    } catch (error) {
      console.error(error);
      setErrorMsg('Có lỗi xảy ra khi dùng AI Scan. Vui lòng thử lại hoặc nhập tay.');
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Game Handlers
  const handleSelectNpc = (q: Question) => {
    if (q.isAnswered || energy <= 0) return;
    setSelectedQuestion(q);
    setFeedback(null);
  };

  const handleAnswer = (optIdx: number) => {
    if (!selectedQuestion) return;
    
    const isCorrect = optIdx === selectedQuestion.correctAnswer;
    
    if (isCorrect) {
      setFeedback('correct');
      setEnergy(prev => Math.max(0, prev - 1));
      setAnsweredCount(prev => ({ ...prev, correct: prev.correct + 1 }));
      triggerConfettiMini();
    } else {
      setFeedback('wrong');
      setEnergy(prev => Math.max(0, prev - 2));
      setAnsweredCount(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    setTimeout(() => {
      // Mark question as answered
      const updatedLevels = [...levelsData];
      const level = updatedLevels[currentLevelIdx];
      const qIdx = level.questions.findIndex(q => q.id === selectedQuestion.id);
      if (qIdx !== -1) {
        level.questions[qIdx].isAnswered = true;
      }
      setLevelsData(updatedLevels);
      setSelectedQuestion(null);
      checkGameEnd(updatedLevels, isCorrect ? energy - 1 : energy - 2);
    }, 1500);
  };

  const checkGameEnd = (updatedLevels: LevelData[], currentEnergy: number) => {
    const currentLvl = updatedLevels[currentLevelIdx];
    const isLevelDone = currentLvl.questions.every(q => q.isAnswered);
    
    // Condition to loose: Energy <= 0 but not at the end of the last question of the last level
    // Condition to win: Finished all NPCs with Energy >= 0.

    const isLastLevel = currentLevelIdx === updatedLevels.length - 1;

    if (currentEnergy <= 0 && (!isLevelDone || !isLastLevel)) {
      // Loose
      setPhase('result');
      return;
    }

    if (isLevelDone) {
      if (!isLastLevel) {
        setCurrentLevelIdx(prev => prev + 1);
      } else {
        if (currentEnergy >= 0) {
          // Win
          setPhase('result');
          triggerConfettiGrand();
        } else {
          setPhase('result'); // Still show loose if energy drops to 0 or below essentially. But logic says <= 0 means fail.
        }
      }
    }
  };

  const triggerConfettiMini = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#34d399', '#10b981', '#ffffff']
    });
  };

  const triggerConfettiGrand = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, { particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  };

  // Render Helpers
  const renderSetup = () => (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 mb-8">
          <ChevronLeft className="w-5 h-5" /> Trở về
        </button>

        <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400 mb-2">Khám Phá Thế Giới 🌍</h1>
              <p className="text-slate-400">Trò chơi quản lý năng lượng, vượt qua các sinh vật huyền bí bằng tri thức.</p>
            </div>
            
            <div className="flex bg-slate-900 rounded-2xl p-2 border border-slate-700 w-fit">
              <button 
                onClick={() => setSetupMode('manual')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${setupMode === 'manual' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Nhập thủ công
              </button>
              <button 
                onClick={() => setSetupMode('ai')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${setupMode === 'ai' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Sparkles className="w-4 h-4" /> AI Scan
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Chọn Ải Hành Trình:</h3>
            <div className="flex flex-wrap gap-4">
              {ALL_THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => handleThemeToggle(theme)}
                  className={`px-4 py-3 rounded-xl flex items-center gap-3 border-2 transition-all ${selectedThemes.includes(theme) ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-700 bg-slate-800 text-slate-500'}`}
                >
                  <span className="text-2xl">{LEVEL_TEMPLATES[theme].npcs[0].emoji}</span>
                  <span className="font-bold">{LEVEL_TEMPLATES[theme].name}</span>
                </button>
              ))}
            </div>
          </div>

          {setupMode === 'manual' && (
            <div className="space-y-8 animate-fade-in">
              {selectedThemes.map(theme => (
                <div key={theme} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
                     <span className="text-2xl">{LEVEL_TEMPLATES[theme].npcs[0].emoji}</span> Ải: {LEVEL_TEMPLATES[theme].name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {LEVEL_TEMPLATES[theme].npcs.map((npc, idx) => (
                      <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-600">
                        <label className="flex items-center gap-2 font-bold mb-2 text-teal-300">
                          <span>{npc.emoji}</span> NPC: {npc.label}
                        </label>
                        <textarea
                          placeholder="Câu hỏi | Đáp án 1 | Đáp án 2 | Đáp án 3 | Đáp án 4 | CorrectIdx (0-3)"
                          value={manualInput[theme][idx]}
                          onChange={(e) => {
                            const newVals = {...manualInput};
                            newVals[theme][idx] = e.target.value;
                            setManualInput(newVals);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono h-28 resize-none focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {setupMode === 'ai' && (
            <div className="bg-slate-900/50 p-10 rounded-2xl border border-slate-700 flex flex-col items-center justify-center animate-fade-in border-dashed">
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              
              {isScanning ? (
                <div className="flex flex-col items-center p-8">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
                    AI đang trích xuất câu hỏi từ tài liệu...
                  </h3>
                  <p className="text-slate-400 mt-2">Phân tích {selectedThemes.length * 3} câu hỏi.</p>
                </div>
              ) : (
                <div 
                  className="w-full max-w-2xl text-center cursor-pointer hover:bg-slate-800/80 p-12 rounded-2xl transition-colors border-2 border-transparent hover:border-blue-500/50"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      const reader = new FileReader();
                      reader.onload = () => {
                        const base64Str = reader.result?.toString() || '';
                        setScanImage(base64Str);
                        processAiScan(base64Str, file.type);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                >
                  <Upload className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-2">Click hoặc kéo thả ảnh để tải lên</h3>
                  <p className="text-slate-400">AI sẽ tự động đọc ảnh và điền vào các ải bạn đã chọn.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-col items-end gap-4">
            {errorMsg && (
              <div className="text-rose-500 font-bold bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20">
                {errorMsg}
              </div>
            )}
            <button 
              onClick={handleStartGame}
              disabled={isScanning || selectedThemes.length === 0}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-2xl font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-3 transition-transform hover:-translate-y-1 active:translate-y-0"
            >
              <Play className="fill-current w-6 h-6" /> Xuất phát Hành Trình
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGame = () => {
    if (levelsData.length === 0) return null;
    const currentLevel = levelsData[currentLevelIdx];
    
    // Position config for NPCs randomly slightly adjusted to make it feel natural
    // but we use predefined in templates for stability
    const npcPositions = LEVEL_TEMPLATES[currentLevel.id].npcs.map(n => n.pos);

    return (
      <div 
        className={`absolute inset-0 z-50 ${currentLevel.bgImage ? 'bg-cover bg-center' : `bg-linear-to-br ${currentLevel.bgClass}`} flex flex-col overflow-hidden text-white font-sans`}
        style={currentLevel.bgImage ? { backgroundImage: `url('${currentLevel.bgImage}')` } : undefined}
      >
        {currentLevel.bgImage && <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>}
        {/* Top HUD */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-10 backdrop-blur-sm bg-black/20 pb-12 rounded-b-[40px] border-b border-white/10 shadow-2xl">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
               Ải {currentLevelIdx + 1}: {currentLevel.name}
            </h2>
            <div className="flex items-center gap-3 bg-black/40 w-fit px-4 py-2 rounded-full border border-white/10">
               <Target className="w-5 h-5 text-emerald-400" />
               <span className="font-bold">{currentLevelIdx + 1} / {levelsData.length}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">Năng Lượng</span>
              <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
                 <Battery className={`w-8 h-8 ${energy > maxEnergy/2 ? 'text-emerald-400' : energy > maxEnergy/4 ? 'text-yellow-400' : 'text-rose-500 animate-pulse'}`} />
                 <span className="text-3xl md:text-4xl font-black drop-shadow-lg">{energy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

        {/* Play Area */}
        <div className="flex-1 relative mt-32">
          <AnimatePresence>
            {!selectedQuestion && currentLevel.questions.map((q, idx) => {
              if (q.isAnswered) return null;
              const pos = LEVEL_TEMPLATES[currentLevel.id].npcs[idx].pos;
              
              return (
                <motion.div
                  key={q.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="absolute cursor-pointer flex flex-col items-center group drop-shadow-2xl"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleSelectNpc(q)}
                >
                  <div className="text-5xl md:text-7xl lg:text-9xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform group-active:scale-95 group-hover:rotate-6">
                    {q.npcImage ? (
                      <img src={q.npcImage} alt={q.npcLabel} className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 object-contain" style={q.npcScale ? { transform: `scale(${q.npcScale})`, transformOrigin: 'center' } : undefined} />
                    ) : (
                      q.npcEmoji
                    )}
                  </div>
                  <div className="mt-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                    Chạm tôi để giải đố!
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Interaction Pop-up */}
        <AnimatePresence>
          {selectedQuestion && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 p-6 md:p-12 rounded-[40px] shadow-[0_0_60px_rgba(0,0,0,0.5)] max-w-4xl w-full relative overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Decorative glowing orb */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="flex gap-4 md:gap-6 items-center mb-6 md:mb-8 shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl md:text-4xl border border-white/20 shadow-inner">
                    {selectedQuestion.npcImage ? (
                      <img src={selectedQuestion.npcImage} alt={selectedQuestion.npcLabel} className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md" />
                    ) : (
                      selectedQuestion.npcEmoji
                    )}
                  </div>
                  <div className="flex-1">
                     <h3 className="text-base md:text-lg text-emerald-400 font-bold uppercase tracking-widest">{selectedQuestion.npcLabel} hỏi:</h3>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[100px] mb-8">
                  <p 
                    className="text-xl md:text-4xl font-bold leading-relaxed drop-shadow-sm text-slate-100"
                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  >
                    {renderKaTeX(selectedQuestion.question)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mt-2 relative z-10 shrink-0">
                  {selectedQuestion.options.map((opt, idx) => {
                    let btnClass = "bg-white/10 border-white/20 hover:bg-white/20";
                    if (feedback === 'correct' && idx === selectedQuestion.correctAnswer) {
                       btnClass = "bg-emerald-500 border-emerald-400 scale-[1.02] md:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.5)] z-10";
                    } else if (feedback === 'wrong' && idx !== selectedQuestion.correctAnswer) {
                       btnClass = "bg-rose-500/20 border-rose-500/50 opacity-40 grayscale";
                    } else if (feedback !== null) {
                       btnClass = "opacity-50 grayscale";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={feedback !== null}
                        onClick={() => handleAnswer(idx)}
                        className={`p-4 md:p-6 rounded-3xl border-2 text-left transition-all duration-300 flex items-center gap-4 ${btnClass}`}
                      >
                         <span className="w-10 h-10 shrink-0 bg-black/30 rounded-full flex items-center justify-center font-black text-xl border border-white/20 shadow-inner">
                           {['A', 'B', 'C', 'D'][idx]}
                         </span>
                         <span 
                           className="text-base md:text-xl font-bold"
                           style={{ fontFamily: '"Times New Roman", Times, serif' }}
                         >
                           {renderKaTeX(opt)}
                         </span>
                      </button>
                    )
                  })}
                </div>

                {/* Feedback overlay inside popup */}
                <AnimatePresence>
                  {feedback === 'correct' && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                    >
                      <CheckCircle className="w-32 h-32 md:w-40 md:h-40 text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)] bg-black/40 rounded-full" />
                      <span className="text-2xl md:text-3xl font-black text-emerald-400 mt-4 drop-shadow-md text-center">Giỏi lắm!<br className="md:hidden"/> -1 Năng lượng</span>
                    </motion.div>
                  )}
                  {feedback === 'wrong' && (
                     <motion.div 
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                   >
                     <XCircle className="w-32 h-32 md:w-40 md:h-40 text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)] bg-black/40 rounded-full" />
                     <span className="text-2xl md:text-3xl font-black text-rose-500 mt-4 drop-shadow-md text-center">Sai rồi!<br className="md:hidden"/> -2 Năng lượng</span>
                   </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderResult = () => {
    const isWin = energy >= 0 && answeredCount.correct > 0;

    return (
      <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-[40px] p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {isWin ? (
            <>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
              <div className="w-32 h-32 md:w-40 md:h-40 bg-linear-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(251,191,36,0.6)] border-8 border-slate-900 border-opacity-50">
                <Crown className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500 mb-6 drop-shadow-sm">
                KHO BÁU TRI THỨC
              </h2>
              <p className="text-lg md:text-2xl text-slate-300 mb-8 font-medium">Chúc mừng các nhà thám hiểm đã vượt qua mọi thử thách với <span className="font-bold text-emerald-400">{energy} Năng Lượng</span> còn lại!</p>
            </>
          ) : (
            <>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-rose-500/10 blur-[100px] pointer-events-none"></div>
              
              <div className="flex justify-center mb-8 relative">
                 <img src="https://api.dicebear.com/7.x/micah/svg?seed=TeacherMale&backgroundColor=transparent&baseColor=f9c9b6&hair=facialHair&hairColor=000000" alt="Teacher" className="w-40 h-40 md:w-48 md:h-48 drop-shadow-2xl grayscale" />
                 <div className="absolute -top-10 -right-4 md:-right-10 bg-slate-800 text-white p-4 rounded-3xl rounded-bl-none border border-slate-600 shadow-xl font-bold text-lg md:text-xl z-10 w-48 text-left leading-tight">
                   "Cố lên ní, sắp tới đích rồi!"
                 </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-rose-500 mb-4 drop-shadow-sm">
                CẠN KIỆT NĂNG LƯỢNG!
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-8 font-medium">Hành trình tạm dừng vì Năng Lượng đã về mức 0. Hãy chuẩn bị kỹ hơn cho lần sau nhé.</p>
            </>
          )}

          <div className="flex flex-col md:flex-row gap-4 justify-center relative z-20">
            <button 
              onClick={() => setPhase('setup')}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-600 shadow-lg text-lg"
            >
              Chơi lại
            </button>
            <button 
              onClick={onBack}
              className={`px-8 py-4 rounded-2xl font-black shadow-xl transition-transform hover:-translate-y-1 active:translate-y-0 text-white text-lg ${isWin ? 'bg-linear-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30 hover:shadow-emerald-500/40' : 'bg-linear-to-r from-rose-500 to-red-600 shadow-rose-500/30 hover:shadow-rose-500/40'} `}
            >
              Trở về Hệ thống
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <>
      {phase === 'setup' && renderSetup()}
      {phase === 'game' && renderGame()}
      {phase === 'result' && renderResult()}
    </>
  );
}
