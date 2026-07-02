import React, { useState } from 'react';
import { ArrowLeft, Play, Database, FileText, ExternalLink, AlertTriangle, CheckSquare, Square } from 'lucide-react';
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

  const [bankQs] = useState<QuestionType[]>(getBankQuestions);
  const [selectedBankIds, setSelectedBankIds] = useState<Set<string>>(() => new Set(bankQs.map(q => q.id)));

  const toggleQuestion = (id: string) => {
    setSelectedBankIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedBankIds.size === bankQs.length) {
      setSelectedBankIds(new Set());
    } else {
      setSelectedBankIds(new Set(bankQs.map(q => q.id)));
    }
  };

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
      const selected = bankQs.filter(q => selectedBankIds.has(q.id));
      if (selected.length === 0) {
        setErrorMsg('Vui lòng chọn ít nhất 1 câu hỏi từ kho.');
        return;
      }
      onStart(selected);
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
    <div className="absolute inset-0 bg-linear-to-br from-sky-50 via-white to-blue-50 z-50 rounded-2xl md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col font-sans text-slate-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-sky-300/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-300/30 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-6 border-b border-slate-300 relative z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-bold border border-slate-300 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-cyan-600 to-blue-600">
            CẤU HÌNH TRÒ CHƠI
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{gameTitle}</p>
        </div>
        <div className="w-24" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-32 relative z-10 flex flex-col items-center">
        <div className="max-w-5xl w-full bg-white/90 backdrop-blur-xl border border-slate-300 rounded-[32px] p-6 md:p-8 shadow-xl flex flex-col gap-6">
          
          {/* Game Info & Rules */}
          <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 flex flex-col gap-3 shadow-inner">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-indigo-600">🎮 {gameTitle}</h3>
              <p className="text-sm text-slate-600">{gameDescription}</p>
            </div>
            
            {gameRules && gameRules.length > 0 && (
              <div className="mt-2 pt-3 border-t border-slate-300">
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-600 mb-2">📜 Luật chơi:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                  {gameRules.map((rule, idx) => (
                    <li key={idx} className="flex gap-2 items-start leading-relaxed">
                      <span className="text-cyan-500 shrink-0 select-none">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              Phương thức lấy câu hỏi:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Bank */}
              <button
                type="button"
                onClick={() => { setMethod('bank'); setErrorMsg(null); }}
                className={`p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${
                  method === 'bank'
                    ? 'border-cyan-500 bg-cyan-50 text-slate-800 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${method === 'bank' ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Ngân hàng câu hỏi</h4>
                  <p className={`text-xs mt-1 ${method === 'bank' ? 'text-cyan-700' : 'text-slate-400'}`}>Sử dụng kho câu hỏi chung của hệ thống.</p>
                </div>
              </button>

              {/* Option 2: Manual */}
              <button
                type="button"
                onClick={() => { setMethod('manual'); setErrorMsg(null); }}
                className={`p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${
                  method === 'manual'
                    ? 'border-indigo-500 bg-indigo-50 text-slate-800 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                    : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${method === 'manual' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Tự nhập câu hỏi</h4>
                  <p className={`text-xs mt-1 ${method === 'manual' ? 'text-indigo-700' : 'text-slate-400'}`}>Tự soạn hoặc dán danh sách câu hỏi tùy biến.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Details Pane */}
          <div className="flex-1">
            {method === 'bank' ? (
              <div className="bg-slate-50/50 border border-slate-300 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-300 shadow-inner">
                <div className="flex justify-between items-center pb-3 border-b border-slate-300">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">Kho câu hỏi hiện tại</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Đã chọn {selectedBankIds.size}/{bankQs.length} câu hỏi.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleAll}
                      className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 transition-all cursor-pointer shadow-sm"
                    >
                      {selectedBankIds.size === bankQs.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                    <button
                      onClick={onGoToBank}
                      className="flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg border border-cyan-200 transition-all cursor-pointer shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Quản lý kho
                    </button>
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
                  {bankQs.length === 0 ? (
                     <p className="text-sm text-slate-500 text-center py-4">Ngân hàng câu hỏi trống. Vui lòng vào Quản lý kho để thêm.</p>
                  ) : (
                    bankQs.map((q, idx) => {
                      const isSelected = selectedBankIds.has(q.id);
                      return (
                        <div 
                          key={q.id} 
                          onClick={() => toggleQuestion(q.id)}
                          className={`rounded-xl p-3 border text-sm flex gap-3 cursor-pointer transition-all shadow-sm ${isSelected ? 'bg-cyan-50 border-cyan-400 shadow-cyan-100' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                        >
                          <div className="pt-0.5 shrink-0">
                            {isSelected ? <CheckSquare className="w-5 h-5 text-cyan-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-bold ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>{q.text}</p>
                            <p className={`text-xs mt-1 font-medium ${isSelected ? 'text-cyan-700' : 'text-slate-400'}`}>Đáp án đúng: {['A', 'B', 'C', 'D'][q.answer]}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50/50 border border-slate-300 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-300 shadow-inner">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Nhập văn bản câu hỏi</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Định dạng: Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D)
                  </p>
                </div>

                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  className="w-full h-48 bg-white border border-slate-300 rounded-xl p-4 text-sm font-mono text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all custom-scrollbar resize-none placeholder:text-slate-400 shadow-inner"
                />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Action Row */}
      <div className="shrink-0 w-full p-6 md:p-8 bg-white/90 backdrop-blur-md border-t border-slate-200 z-20 flex flex-col items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl w-full flex flex-col items-end gap-3">
          {errorMsg && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-600 shadow-sm mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
          <button
            onClick={handleStart}
            className="group relative w-full md:w-auto px-12 py-4 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-xl shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.8)] ring-1 ring-white/20 hover:ring-4 hover:ring-indigo-400/50 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
            <Play className="w-7 h-7 fill-white drop-shadow-md group-hover:scale-110 transition-transform" /> 
            <span className="drop-shadow-md tracking-wide">BẮT ĐẦU NGAY</span>
          </button>
        </div>
      </div>
    </div>
  );
}
