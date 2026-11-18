/* cSpell:disable */
import React, { useState, useCallback, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { SCIENCE_NEW_WORDS } from '../lessonData';

interface NewWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewWordsModal({ isOpen, onClose }: NewWordsModalProps) {
  const [newWordsCategoryFilter, setNewWordsCategoryFilter] = useState<string>('ALL');
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  const speakEnglishText = useCallback((id: string, text: string) => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setSpeakingWordId(id);
      utterance.onend = () => setSpeakingWordId(null);
      utterance.onerror = () => setSpeakingWordId(null);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeakingWordId(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
        <div
          onClick={() => {
            window.speechSynthesis?.cancel();
            setSpeakingWordId(null);
            onClose();
          }}
          className="fixed inset-0 z-50 bg-indigo-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-50 border-2 border-indigo-100 rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header Modal New Words */}
            <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black text-xl shadow-xs">
                  🇬🇧
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black uppercase tracking-wide text-amber-300">
                    NEW WORDS — TỪ VỰNG TIẾNG ANH KHOA HỌC TỰ NHIÊN (BÀI 30)
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    12 thuật ngữ cốt lõi theo chuẩn danh pháp Hóa học &amp; Sinh học quốc tế (GDPT 2018) • Bấm 🔊 để nghe phát âm
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setSpeakingWordId(null);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Thanh lọc chủ đề từ vựng */}
            <div className="bg-white border-b border-indigo-100 px-5 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ALL', label: `📚 Tất cả (${SCIENCE_NEW_WORDS.length} từ)` },
                  { id: 'Hóa học & Phân tử', label: '🧬 Hóa học & Phân tử' },
                  { id: 'Sinh học & Phản ứng', label: '🔬 Sinh học & Phản ứng' },
                  { id: 'Dự án STEAM Xanh', label: '🌱 Dự án STEAM Xanh' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNewWordsCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                      newWordsCategoryFilter === cat.id
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-emerald-50 text-indigo-950'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                💡 Hỗ trợ phát âm trực tiếp trên Smart TV &amp; Máy tính (không cần mạng)
              </span>
            </div>

            {/* Danh sách thẻ từ vựng song ngữ */}
            <div className="p-4 md:p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {SCIENCE_NEW_WORDS.filter(
                (w) => newWordsCategoryFilter === 'ALL' || w.category === newWordsCategoryFilter
              ).map((word) => {
                const isSpeakingTerm = speakingWordId === word.id;
                const isSpeakingExample = speakingWordId === `${word.id}-ex`;
                return (
                  <div
                    key={word.id}
                    className="bg-white rounded-2xl border-2 border-indigo-100 hover:border-emerald-400 p-4 shadow-2xs flex flex-col justify-between gap-3 transition-all"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                            {word.emoji}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base md:text-lg font-black text-indigo-950">
                                {word.term}
                              </span>
                              <span className="text-xs font-bold text-emerald-700 font-mono">
                                {word.ipa}
                              </span>
                              <span className="text-[11px] font-bold text-slate-400 italic">
                                {word.partOfSpeech}
                              </span>
                              {word.formula && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px]">
                                  {word.formula}
                                </span>
                              )}
                            </div>
                            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-500 mt-0.5">
                              {word.category}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => speakEnglishText(word.id, word.term)}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                            isSpeakingTerm
                              ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                          }`}
                          title={`Nghe phát âm từ ${word.term}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeakingTerm ? 'Đang đọc...' : 'Phát âm'}</span>
                        </button>
                      </div>

                      <p className="text-xs text-indigo-950 font-bold leading-relaxed bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5">
                        🇻🇳 {word.meaningVi}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-indigo-900 leading-snug">
                          🇬🇧 <em>&ldquo;{word.exampleEn}&rdquo;</em>
                        </p>
                        <button
                          type="button"
                          onClick={() => speakEnglishText(`${word.id}-ex`, word.exampleEn)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shrink-0 cursor-pointer transition-all ${
                            isSpeakingExample
                              ? 'bg-amber-500 text-white'
                              : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                          title="Nghe đọc câu ví dụ tiếng Anh"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Đọc câu</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        ➔ {word.exampleVi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
  );
}
