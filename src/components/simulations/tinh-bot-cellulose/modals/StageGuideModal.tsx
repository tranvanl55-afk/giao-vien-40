/* cSpell:disable */
import React from 'react';
import { CheckCircle2, ChevronRight, X } from 'lucide-react';
import { type StageId, STAGE_DETAILED_GUIDES } from '../lessonData';

interface StageGuideModalProps {
  isOpen: boolean;
  stages: Array<{ id: StageId; step: string }>;
  activeStage: StageId;
  selectedGuideStage: StageId;
  isStageUnlocked: (stage: StageId) => boolean;
  isStageCompleted: (stage: StageId) => boolean;
  isTeacherMode: boolean;
  onSelectGuideStage: (stage: StageId) => void;
  onClose: () => void;
  onStartStage: (stage: StageId) => void;
}

export function StageGuideModal({
  isOpen,
  stages,
  activeStage,
  selectedGuideStage,
  isStageUnlocked,
  isStageCompleted,
  isTeacherMode,
  onSelectGuideStage,
  onClose,
  onStartStage,
}: StageGuideModalProps) {
  if (!isOpen) return null;

  return (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="max-w-4xl w-full bg-white border-2 border-indigo-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200">
            <div className="bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-900 p-4 md:p-6 text-white relative flex flex-wrap items-center justify-between gap-4 border-b border-indigo-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30 shrink-0">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40">
                      {STAGE_DETAILED_GUIDES[selectedGuideStage].step} • {STAGE_DETAILED_GUIDES[selectedGuideStage].place}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-300">
                      ⏱️ Thời lượng: {STAGE_DETAILED_GUIDES[selectedGuideStage].estimatedTime}
                    </span>
                  </div>
                  <h2 id="guide-modal-title" className="text-base md:text-xl font-black text-white mt-1">
                    📖 Hướng Dẫn Chi Tiết: {STAGE_DETAILED_GUIDES[selectedGuideStage].title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onClose()}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Đóng (phím Esc)"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-indigo-50/80 border-b border-indigo-100 px-4 py-2.5 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-xs font-black text-indigo-900/60 uppercase mr-1">Chuyển chặng:</span>
                {stages.map((st) => {
                  const isSelected = selectedGuideStage === st.id;
                  const isCurrent = activeStage === st.id;
                  const isDone = isStageCompleted(st.id);
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => onSelectGuideStage(st.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-xs'
                          : isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-indigo-900 border-indigo-200 hover:border-orange-300'
                      }`}
                    >
                      <span>{STAGE_DETAILED_GUIDES[st.id].emoji}</span>
                      <span>{st.step}</span>
                      {isCurrent && <span className="text-[10px] bg-white/30 px-1.5 py-0.2 rounded-full">Hiện tại</span>}
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              <div className="bg-indigo-50/70 border-2 border-indigo-200/80 rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-2 text-indigo-900 font-black text-sm uppercase tracking-wide mb-2">
                  <span className="text-base">🎯</span>
                  <h4>MỤC TIÊU CỐT LÕI CỦA CHẶNG</h4>
                </div>
                <p className="text-xs md:text-sm text-indigo-950 font-medium leading-relaxed">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].objective}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-900 font-black text-sm uppercase tracking-wide">
                  <span className="text-base">📋</span>
                  <h4>CÁC BƯỚC THỰC HIỆN CHI TIẾT (STEP-BY-STEP)</h4>
                </div>

                <div className="space-y-3">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].steps.map((s) => (
                    <div
                      key={s.number}
                      className="bg-white border-2 border-slate-200 hover:border-orange-300 rounded-2xl p-4 md:p-5 shadow-xs transition-all flex items-start gap-4"
                    >
                      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-500 to-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        {s.number}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h5 className="font-extrabold text-sm md:text-base text-indigo-950">
                            {s.title}
                          </h5>
                          {s.badge && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
                              {s.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                          {s.desc}
                        </p>
                        {s.actionHint && (
                          <div className="bg-amber-50/80 border border-amber-200 rounded-xl px-3 py-2 text-xs font-semibold text-amber-900 flex items-start gap-2 mt-2">
                            <span className="text-amber-600 shrink-0 mt-0.5">👉</span>
                            <span>{s.actionHint}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Bí quyết & Mẹo làm bài */}
              <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wide mb-2.5">
                  <span className="text-base">💡</span>
                  <h4>BÍ QUYẾT & LƯU Ý QUAN TRỌNG ĐẠT ĐIỂM CAO</h4>
                </div>
                <ul className="space-y-2 text-xs md:text-sm text-amber-950 font-medium">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].tips.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Tiêu chí hoàn thành chặng */}
              <div className="bg-emerald-50/70 border-2 border-emerald-300/80 rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-2 text-emerald-950 font-black text-sm uppercase tracking-wide mb-2.5">
                  <span className="text-base">✅</span>
                  <h4>ĐIỀU KIỆN ĐỂ HOÀN THÀNH CHẶNG NÀY</h4>
                </div>
                <div className="space-y-2 text-xs md:text-sm text-emerald-950 font-medium">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].completionCriteria.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-500">
                Chặng {selectedGuideStage.replace('stage-', '')}: {STAGE_DETAILED_GUIDES[selectedGuideStage].title}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isStageUnlocked(selectedGuideStage) || isTeacherMode) {
                      onStartStage(selectedGuideStage);
                    }
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Bắt đầu làm bài Chặng {selectedGuideStage.replace('stage-', '')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}
