import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, Image, Sparkles, Check } from 'lucide-react';
import { Robot, Question as QuestionIcon } from '@phosphor-icons/react';
import { getGeminiClient, getGeminiApiKey } from '../../lib/gemini';
import { Type } from '@google/genai';

export interface QuestionType {
  id: string;
  text: string;
  options: string[];
  answer: number;
}

export type Question = QuestionType;



export function GameHub({ onBack }: { onBack: () => void }) {
  const [questions, setQuestions] = useState<QuestionType[]>(() => {
    try { return JSON.parse(localStorage.getItem('gamehub_questions') || '[]'); } catch { return []; }
  });
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [newQ, setNewQ] = useState({ text: '', options: ['', '', '', ''], answer: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const saveQuestions = (qs: QuestionType[]) => {
    setQuestions(qs);
    localStorage.setItem('gamehub_questions', JSON.stringify(qs));
  };

  const addQuestion = () => {
    if (!newQ.text.trim() || newQ.options.some(o => !o.trim())) return;
    const q: QuestionType = { id: Date.now().toString(), ...newQ };
    saveQuestions([...questions, q]);
    setNewQ({ text: '', options: ['', '', '', ''], answer: 0 });
  };

  const removeQuestion = (id: string) => saveQuestions(questions.filter(q => q.id !== id));

  const scanImage = useCallback(async (file: File) => {
    setScanning(true);
    setScanStatus('Khởi chạy tiến trình AI...');
    try {
      setScanStatus('Đang kết kết nối Gemini Client...');
      const AI = getGeminiClient();
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        const errMsg = 'Tài khoản của bạn yêu cầu nhập Gemini API Key để sử dụng tính năng AI này. Vui lòng cấu hình API Key!';
        setScanStatus('❌ Lỗi: Thiếu API Key');
        alert(errMsg);
        setScanning(false);
        return;
      }
      
      setScanStatus('Đang đọc dữ liệu ảnh...');
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const b64 = dataUrl.split(',')[1];
          const mimeType = file.type || 'image/jpeg';
          
          setScanStatus(`Đang tải ảnh lên AI (Dung lượng: ${Math.round(file.size / 1024)} KB)...`);
          const res = await AI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
              parts: [
                { text: 'Hãy đọc và phân tích nội dung kiến thức trong hình ảnh này. Sau đó, TẠO RA ít nhất 5 câu hỏi trắc nghiệm dựa trên nội dung đó (hoặc trích xuất nếu trong ảnh đã có sẵn câu hỏi). Trả về danh sách các câu hỏi, với mỗi câu có "text" (nội dung câu hỏi), "options" (mảng 4 đáp án A, B, C, D) và "answer" là chỉ số (0-3) của đáp án đúng.' },
                {
                  inlineData: {
                    data: b64,
                    mimeType: mimeType
                  }
                }
              ]
            },
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    options: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING },
                      description: "Mảng chứa đúng 4 chuỗi tương ứng với 4 đáp án"
                    },
                    answer: { type: Type.INTEGER, description: "Chỉ số của đáp án đúng (0, 1, 2, hoặc 3)" }
                  }
                }
              }
            }
          });
          
          setScanStatus('Đã nhận phản hồi. Đang phân tích cú pháp câu hỏi...');
          const raw = res.text || '[]';
          
          const parsed: Omit<QuestionType, 'id'>[] = JSON.parse(raw);
          if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error('Không tìm thấy câu hỏi hợp lệ nào trong ảnh hoặc cấu trúc JSON trống.');
          }

          const newQs = parsed.map(q => ({ ...q, id: Date.now().toString() + Math.random() }));
          saveQuestions([...questions, ...newQs]);
          setScanStatus(`✅ Thành công! Đã thêm ${newQs.length} câu hỏi vào kho.`);
          // Clear status after 5s
          setTimeout(() => setScanStatus(''), 5000);
        } catch (err) {
          console.error("AI scanning error:", err);
          const detail = err instanceof Error ? err.message : String(err);
          setScanStatus(`❌ Lỗi: ${detail}`);
          alert('Không thể quét ảnh bằng AI. Vui lòng thử lại.\nChi tiết lỗi: ' + detail);
        } finally {
          setScanning(false);
        }
      };
      reader.onerror = () => {
        setScanStatus('❌ Lỗi: Không thể đọc file ảnh.');
        alert('Không thể đọc file ảnh.');
        setScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setScanStatus(`❌ Lỗi khởi tạo: ${detail}`);
      alert('Không thể quét ảnh. Chi tiết lỗi: ' + detail);
      setScanning(false);
    }
  }, [questions]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-950 to-slate-950 text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full sticky top-0 z-30 bg-indigo-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-bold shadow-md hover:-translate-x-1">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-yellow-300 to-pink-400 drop-shadow-md">📚 Ngân Hàng Câu Hỏi</h1>
            <p className="text-xs text-purple-300 uppercase tracking-widest mt-1 font-bold">Quản lý kho dữ liệu trò chơi</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg text-sm font-bold">
            <Robot size={18} weight="duotone" className="text-white" />
            <span>{questions.length} câu</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full flex-1 flex flex-col p-4 md:p-8 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Top Section: Form and Scanner */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">Thêm câu hỏi mới</h2>
              <p className="text-sm text-slate-400 mt-1">Câu hỏi sẽ tự động chia sẻ cho tất cả trò chơi trong hệ thống.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-3">
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && scanImage(e.target.files[0])} />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={scanning}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50 hover:-translate-y-1"
                >
                  {scanning
                    ? <><Sparkles className="w-5 h-5 animate-spin" /> Đang xử lý AI...</>
                    : <><Image className="w-5 h-5" /> Quét ảnh bằng AI</>}
                </button>
              </div>
              {scanStatus && (
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-xl border max-w-[280px] transition-all shadow-md ${
                  scanStatus.startsWith('❌') 
                    ? 'bg-red-500/15 border-red-500/30 text-red-400 font-bold' 
                    : scanStatus.startsWith('✅')
                    ? 'bg-green-500/15 border-green-500/30 text-green-400 font-bold'
                    : 'bg-purple-500/15 border-purple-500/30 text-purple-300 animate-pulse'
                }`}>
                  {scanStatus}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 mt-2 relative z-10">
            <div className="relative">
              <input
                value={newQ.text}
                onChange={e => setNewQ(p => ({ ...p, text: e.target.value }))}
                placeholder="Nhập nội dung câu hỏi..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-base placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all shadow-inner"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newQ.options.map((opt, i) => (
                <div key={i} className={`flex gap-3 items-center bg-black/20 border p-3 rounded-2xl transition-all ${newQ.answer === i ? 'border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.15)]' : 'border-white/5 hover:border-white/20'}`}>
                  <button
                    onClick={() => setNewQ(p => ({ ...p, answer: i }))}
                    className={`w-8 h-8 rounded-full border-2 shrink-0 transition-all flex items-center justify-center ${newQ.answer === i ? 'border-green-400 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.4)]' : 'border-white/30 hover:border-white/60 hover:bg-white/10'}`}
                  >
                    {newQ.answer === i && <Check className="w-4 h-4 text-slate-900 font-bold" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Đáp án {String.fromCharCode(65 + i)}</p>
                    <input
                      value={opt}
                      onChange={e => setNewQ(p => { const o = [...p.options]; o[i] = e.target.value; return { ...p, options: o }; })}
                      placeholder="..."
                      className="w-full bg-transparent border-none text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={addQuestion}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-sm font-black transition-all shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-1"
              >
                <Plus className="w-5 h-5" /> Thêm vào kho
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Question List */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-xl font-black text-white flex items-center gap-2">Danh sách câu hỏi</h2>
            {questions.length > 0 && (
              <button onClick={() => { if(confirm('Xóa toàn bộ câu hỏi?')) saveQuestions([]); }} className="text-sm text-red-400 hover:text-red-300 font-bold bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Làm trống kho
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-3 max-h-[500px] relative z-10">
            {questions.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-black/20 border border-white/5 rounded-3xl border-dashed">
                <QuestionIcon size={64} weight="duotone" className="mx-auto mb-4 text-slate-600 opacity-50" />
                <p className="text-lg font-black text-slate-400">Kho dữ liệu trống</p>
                <p className="text-sm mt-2 text-slate-500 max-w-sm mx-auto">Hãy thêm câu hỏi thủ công hoặc sử dụng tính năng "Quét ảnh bằng AI" để tự động nhận dạng câu hỏi từ sách.</p>
              </div>
            ) : questions.map((q, idx) => (
              <div key={q.id} className="bg-black/30 border border-white/10 rounded-2xl p-5 flex gap-5 hover:bg-white/4 transition-all hover:border-white/20 group">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white shadow-lg shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-white mb-3 leading-snug">{q.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`text-sm px-4 py-2.5 rounded-xl flex items-center gap-3 ${i === q.answer ? 'bg-green-500/20 text-green-300 border border-green-500/40 font-bold shadow-inner' : 'bg-white/5 text-slate-300 border border-white/5'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${i === q.answer ? 'bg-green-500 text-slate-900' : 'bg-white/10 text-slate-400'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="truncate">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => removeQuestion(q.id)} className="text-red-400/50 hover:text-red-400 bg-red-400/5 hover:bg-red-400/20 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}


