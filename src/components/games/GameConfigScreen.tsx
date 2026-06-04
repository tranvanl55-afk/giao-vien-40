import React, { useState } from 'react';
import { ArrowLeft, Play, Database, FileText, ExternalLink, AlertTriangle } from 'lucide-react';
import { QuestionType } from './GameHub';
import { DEFAULT_GAME_QUESTIONS } from '../../data/defaultGameQuestions';

interface GameConfigScreenProps {
  gameTitle: string;
  gameDescription: string;
  gameRules?: string[];
  onStart: (questions: QuestionType[]) => void;
  onBack: () => void;
  onGoToBank: () => void;
}

const DEFAULT_MANUAL_TEXT = `Câu 1: Nguyên tố nào chiếm tỉ lệ lớn nhất trong vỏ Trái Đất? | Silic (Si) | Sắt (Fe) | Oxy (O) | Nhôm (Al) | C
Câu 2: Tốc độ ánh sáng trong chân không xấp xỉ bao nhiêu? | 300.000 km/s | 150.000 km/s | 450.000 km/s | 3.000 km/s | A
Câu 3: Quá trình quang hợp xảy ra ở bộ phận nào của tế bào thực vật? | Ti thi | Ribosome | Lục lạp | Nhân tế bào | C
Câu 4: Đơn vị đo lực trong hệ SI là gì? | Joule (J) | Watt (W) | Pascal (Pa) | Newton (N) | D`;

export function GameConfigScreen({
  gameTitle,
  gameDescription,
  gameRules,
  onStart,
  onBack,
  onGoToBank,
}: GameConfigScreenProps) {
  const [method, setMethod] = useState<'bank' | 'manual'>('bank');
  const [manualText, setManualText] = useState(DEFAULT_MANUAL_TEXT);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Get current bank questions
  const getBankQuestions = (): QuestionType[] => {
    try {
      const stored = JSON.parse(localStorage.getItem('gamehub_questions') || '[]');
      return stored.length > 0 ? stored : DEFAULT_GAME_QUESTIONS;
    } catch {
      return DEFAULT_GAME_QUESTIONS;
    }
  };

  const bankQs = getBankQuestions();

  const parseManualQuestions = (text: string): QuestionType[] => {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const parsed: QuestionType[] = [];
    
    lines.forEach((line, idx) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 6) {
        const answerMap: Record<string, number> = {
          'A': 0, 'B': 1, 'C': 2, 'D': 3,
          'a': 0, 'b': 1, 'c': 2, 'd': 3,
          '0': 0, '1': 1, '2': 2, '3': 3
        };
        const ansChar = parts[5];
        const ansIndex = answerMap[ansChar] !== undefined ? answerMap[ansChar] : 0;
        
        parsed.push({
          id: `manual-${idx}-${Date.now()}`,
          text: parts[0],
          options: [parts[1], parts[2], parts[3], parts[4]],
          answer: ansIndex
        });
      }
    });
    
    return parsed;
  };

  const handleStart = () => {
    if (method === 'bank') {
      if (bankQs.length === 0) {
        setErrorMsg('Ngân hàng câu hỏi trống. Vui lòng thêm câu hỏi hoặc chọn nhập thủ công.');
        return;
      }
      onStart(bankQs);
    } else {
      const parsed = parseManualQuestions(manualText);
      if (parsed.length === 0) {
        setErrorMsg('Không thể phân tích câu hỏi. Hãy kiểm tra lại định dạng!');
        return;
      }
      onStart(parsed);
    }
  };

  return (
    <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 z-50 rounded-2xl md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col font-sans text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-6 border-b border-white/10 relative z-10 bg-slate-900/60 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold border border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-teal-300 to-cyan-300">
            CẤU HÌNH TRÒ CHƠI
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{gameTitle}</p>
        </div>
        <div className="w-24" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl flex flex-col gap-6">
          
          {/* Game Info & Rules */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-yellow-400">🎮 {gameTitle}</h3>
              <p className="text-sm text-slate-300">{gameDescription}</p>
            </div>
            
            {gameRules && gameRules.length > 0 && (
              <div className="mt-2 pt-3 border-t border-white/5">
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-2">📜 Luật chơi:</h4>
                <ul className="space-y-1.5 text-xs text-slate-350 font-medium">
                  {gameRules.map((rule, idx) => (
                    <li key={idx} className="flex gap-2 items-start leading-relaxed">
                      <span className="text-cyan-400 shrink-0 select-none">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Phương thức lấy câu hỏi:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Bank */}
              <button
                type="button"
                onClick={() => { setMethod('bank'); setErrorMsg(null); }}
                className={`p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${
                  method === 'bank'
                    ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className={`p-3 rounded-xl ${method === 'bank' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-300'}`}>
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Ngân hàng câu hỏi</h4>
                  <p className="text-xs mt-1 text-slate-400">Sử dụng kho câu hỏi chung của hệ thống.</p>
                </div>
              </button>

              {/* Option 2: Manual */}
              <button
                type="button"
                onClick={() => { setMethod('manual'); setErrorMsg(null); }}
                className={`p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${
                  method === 'manual'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                    : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className={`p-3 rounded-xl ${method === 'manual' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-300'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Tự nhập câu hỏi</h4>
                  <p className="text-xs mt-1 text-slate-400">Tự soạn hoặc dán danh sách câu hỏi tùy biến.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Details Pane */}
          <div className="flex-1">
            {method === 'bank' ? (
              <div className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <div>
                    <h4 className="font-bold text-white text-base">Kho câu hỏi hiện tại</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Hiện đang có {bankQs.length} câu hỏi sẵn sàng.</p>
                  </div>
                  <button
                    onClick={onGoToBank}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 px-3 py-1.5 rounded-lg border border-cyan-400/20 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Quản lý kho
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2.5 pr-2">
                  {bankQs.slice(0, 10).map((q, idx) => (
                    <div key={q.id} className="bg-white/5 rounded-xl p-3 border border-white/5 text-sm flex gap-3">
                      <span className="w-5 h-5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-full flex items-center justify-center shrink-0 text-xs font-black">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 truncate">{q.text}</p>
                        <p className="text-xs text-slate-500 mt-1">Đáp án đúng: {['A', 'B', 'C', 'D'][q.answer]}</p>
                      </div>
                    </div>
                  ))}
                  {bankQs.length > 10 && (
                    <p className="text-xs text-slate-500 text-center italic pt-2">...và {bankQs.length - 10} câu hỏi khác</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-300">
                <div>
                  <h4 className="font-bold text-white text-base">Nhập văn bản câu hỏi</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Định dạng: Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D)
                  </p>
                </div>

                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  className="w-full h-48 bg-slate-950 border border-white/10 rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-all custom-scrollbar resize-none placeholder:text-slate-700"
                />
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col items-end gap-3 pt-4 border-t border-white/10">
            {errorMsg && (
              <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <button
              onClick={handleStart}
              className="w-full md:w-auto px-10 py-4 bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-2xl font-black text-lg shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-slate-950" /> BẮT ĐẦU TRÒ CHƠI
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
