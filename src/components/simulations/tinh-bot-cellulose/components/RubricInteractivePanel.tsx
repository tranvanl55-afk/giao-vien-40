/* cSpell:disable */
import React from 'react';
import { CheckCircle2, HelpCircle, Send, Mail, Printer } from 'lucide-react';
import {
  type RubricLevelOption,
  type Stage3RubricCriterion,
  type RubricFormState,
  RUBRIC_CATEGORY_BADGE_CLASSES,
  RUBRIC_LEVEL_STYLE_CLASSES,
  createInitialRubricFormState,
  getCriterionPointFromState,
  getRubricSummary,
  buildRubricMailtoBodyFor,
} from '../rubricData';

export interface RubricInteractivePanelProps {
  stageShortLabel: string;
  stageFullTitle: string;
  rubricSubtitle: string;
  feedbackLabel: string;
  feedbackPlaceholder: string;
  criteria: Stage3RubricCriterion[];
  state: RubricFormState;
  onChangeState: React.Dispatch<React.SetStateAction<RubricFormState>>;
  onResetConfirm?: () => void;
  onSubmit: () => void;
  teacherEmail: string;
}

/** Bảng Analytical Rubric 5 mức tương tác dùng chung cho Chặng 3 và Chặng 5. */
export function RubricInteractivePanel({
  stageShortLabel,
  stageFullTitle,
  rubricSubtitle,
  feedbackLabel,
  feedbackPlaceholder,
  criteria,
  state,
  onChangeState,
  onResetConfirm,
  onSubmit,
  teacherEmail,
}: RubricInteractivePanelProps) {
  const { answeredCount, isComplete, totalPoints, rank } = getRubricSummary(criteria, state);

  const handleSelectLevel = (criterion: Stage3RubricCriterion, lv: RubricLevelOption) => {
    onChangeState((prev) => ({
      ...prev,
      validationError: null,
      selections: { ...prev.selections, [criterion.id]: lv.level },
      points: { ...prev.points, [criterion.id]: lv.points },
    }));
  };

  const handleChangePoint = (criterion: Stage3RubricCriterion, rawVal: string) => {
    if (rawVal.trim() === '') {
      onChangeState((prev) => {
        const nextPoints = { ...prev.points };
        const nextSelections = { ...prev.selections };
        delete nextPoints[criterion.id];
        delete nextSelections[criterion.id];
        return { ...prev, validationError: null, points: nextPoints, selections: nextSelections };
      });
      return;
    }
    const parsed = Number(rawVal);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(0, Math.min(criterion.maxPoints, Math.round(parsed * 100) / 100));
    const ratio = clamped / criterion.maxPoints;
    const inferredLevel: 1 | 2 | 3 | 4 | 5 =
      ratio >= 0.9 ? 5 : ratio >= 0.7 ? 4 : ratio >= 0.5 ? 3 : ratio >= 0.3 ? 2 : 1;
    onChangeState((prev) => ({
      ...prev,
      validationError: null,
      points: { ...prev.points, [criterion.id]: clamped },
      selections: { ...prev.selections, [criterion.id]: inferredLevel },
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-linear-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 border border-indigo-700 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-indigo-950 font-black text-[11px] uppercase">
              📐 ANALYTICAL RUBRIC 5 MỨC • THANG 10 ĐIỂM (100%)
            </span>
            <span className="text-xs text-indigo-200 font-bold">
              Mức 1 (Cần cố gắng) → Mức 5 (Xuất sắc)
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {rubricSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/20">
            <button
              type="button"
              onClick={() => onChangeState((prev) => ({ ...prev, evaluatorMode: 'peer' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${state.evaluatorMode === 'peer'
                ? 'bg-amber-400 text-indigo-950'
                : 'text-white/80 hover:text-white'
                }`}
            >
              👥 Đánh giá nhóm bạn
            </button>
            <button
              type="button"
              onClick={() => onChangeState((prev) => ({ ...prev, evaluatorMode: 'self' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${state.evaluatorMode === 'self'
                ? 'bg-emerald-400 text-indigo-950'
                : 'text-white/80 hover:text-white'
                }`}
            >
              🙋 Tự đánh giá
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-indigo-200 shadow-2xs flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
              {state.evaluatorMode === 'peer'
                ? '🏷️ Tên nhóm đánh giá (Nhóm chấm)'
                : '🏷️ Tên nhóm tự đánh giá'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={state.evaluatorGroup}
              onChange={(e) => {
                const val = e.target.value;
                onChangeState((prev) => ({
                  ...prev,
                  evaluatorGroup: val,
                  validationError: null,
                  targetGroup: prev.evaluatorMode === 'self' ? val : prev.targetGroup,
                }));
              }}
              placeholder="Ví dụ: Nhóm 1 (Hoặc Họ tên thành viên đại diện)..."
              className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
              🎯 Tên nhóm được đánh giá <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={state.targetGroup}
              onChange={(e) =>
                onChangeState((prev) => ({
                  ...prev,
                  targetGroup: e.target.value,
                  validationError: null,
                }))
              }
              placeholder="Ví dụ: Nhóm 2 - Giấy nảy mầm Cellulose..."
              className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
              🏫 Lớp
            </label>
            <input
              type="text"
              value={state.className}
              onChange={(e) => onChangeState((prev) => ({ ...prev, className: e.target.value }))}
              placeholder="Ví dụ: 9A1"
              className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-indigo-100">
          <span className="text-[11px] font-medium text-slate-600">
            💡 Bấm chọn ô mô tả mức độ hoặc nhập điểm trực tiếp vào cột <strong>Ghi điểm</strong> bên phải bảng.
          </span>
          <div className="flex items-center gap-2">
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onChangeState((prev) => ({
                    ...createInitialRubricFormState(),
                    evaluatorMode: prev.evaluatorMode,
                    evaluatorGroup: prev.evaluatorGroup,
                    targetGroup: prev.targetGroup,
                    className: prev.className,
                  }));
                  onResetConfirm?.();
                }}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                ↺ Chấm lại
              </button>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In phiếu Rubric</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-indigo-200 bg-white shadow-sm">
        <table className="w-full min-w-280 border-collapse text-left">
          <thead>
            <tr className="bg-indigo-950 text-white text-xs font-black">
              <th className="p-3 border border-indigo-800 w-48">TIÊU CHÍ (Trọng số)</th>
              <th className="p-3 border border-indigo-800 bg-rose-800 text-center">
                MỨC 1<br />
                <span className="text-[10px] font-bold text-rose-100">CẦN CỐ GẮNG (20%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-amber-700 text-center">
                MỨC 2<br />
                <span className="text-[10px] font-bold text-amber-100">ĐẠT (40%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-sky-800 text-center">
                MỨC 3<br />
                <span className="text-[10px] font-bold text-sky-100">KHÁ (60%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-indigo-700 text-center">
                MỨC 4<br />
                <span className="text-[10px] font-bold text-indigo-100">TỐT (80%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-emerald-800 text-center">
                MỨC 5<br />
                <span className="text-[10px] font-bold text-emerald-100">XUẤT SẮC (100%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-orange-600 text-center w-28">
                ✍️ GHI ĐIỂM
              </th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion) => {
              const selectedLevel = state.selections[criterion.id];
              const currentPoint = getCriterionPointFromState(criterion, state);
              const selectedLabel = criterion.levels.find((l) => l.level === selectedLevel)?.label;

              return (
                <tr key={criterion.id} className="border-t border-indigo-100 align-top">
                  <td className="p-3 bg-indigo-50/60 border-r border-indigo-100">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black mb-1.5 ${RUBRIC_CATEGORY_BADGE_CLASSES[criterion.category]}`}
                    >
                      {criterion.category}
                    </span>
                    <div className="text-xs font-black text-indigo-950 leading-snug">
                      {criterion.title}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] font-bold text-indigo-700">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200">
                        Trọng số: {criterion.weightPercent}%
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-orange-700">
                        Tối đa: {criterion.maxPoints}đ
                      </span>
                    </div>
                  </td>

                  {criterion.levels.map((lv) => {
                    const isPicked = selectedLevel === lv.level;
                    const lvStyle = RUBRIC_LEVEL_STYLE_CLASSES[lv.level];
                    return (
                      <td key={lv.level} className="p-1.5 border-r border-indigo-100">
                        <button
                          type="button"
                          onClick={() => handleSelectLevel(criterion, lv)}
                          className={`w-full h-full min-h-36 p-2.5 rounded-xl border-2 text-left flex flex-col justify-between gap-2 cursor-pointer transition-all ${isPicked
                            ? `${lvStyle.picked} shadow-xs scale-[1.01]`
                            : 'bg-white border-transparent hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-700'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black ${isPicked ? lvStyle.badge : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                              {lv.points} điểm
                            </span>
                            {isPicked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          </div>
                          <ul className="text-[11px] leading-relaxed font-medium space-y-1">
                            {lv.bullets.map((bText, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-1">
                                <span className="font-bold text-indigo-400 shrink-0">-</span>
                                <span>{bText}</span>
                              </li>
                            ))}
                          </ul>
                        </button>
                      </td>
                    );
                  })}

                  <td className="p-2.5 bg-orange-50/40 align-middle text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="flex items-center justify-center gap-1 w-full">
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={criterion.maxPoints}
                          value={currentPoint !== undefined ? currentPoint : ''}
                          onChange={(e) => handleChangePoint(criterion, e.target.value)}
                          placeholder="0"
                          aria-label={`Ghi điểm cho ${criterion.title}`}
                          className="w-16 rounded-xl bg-white border-2 border-orange-300 focus:border-orange-600 px-2 py-1.5 text-center text-sm font-black text-indigo-950 outline-none shadow-2xs"
                        />
                        <span className="text-xs font-black text-slate-500">/ {criterion.maxPoints}</span>
                      </div>
                      {selectedLabel ? (
                        <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                          {selectedLabel}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">Chưa chấm</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-950 text-white border-t-2 border-indigo-800">
              <td colSpan={6} className="p-3.5 text-right">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="text-xs md:text-sm font-black uppercase tracking-wide text-amber-300">
                    TỔNG ĐIỂM ĐÁNH GIÁ RUBRIC ({stageShortLabel} • 100%):
                  </span>
                  {isComplete ? (
                    <span className={`px-3 py-0.5 rounded-full text-xs font-black ${rank.colorClass}`}>
                      Xếp loại: {rank.label}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-indigo-200">
                      Đã chấm {answeredCount}/{criteria.length} tiêu chí
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3 bg-orange-600 text-center">
                <div className="text-lg md:text-xl font-black text-white leading-none">{totalPoints}</div>
                <div className="text-[10px] font-bold text-amber-100 mt-0.5">/ 10.0 điểm</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-6 bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 flex flex-col gap-2">
          <label className="text-xs font-black text-indigo-950">{feedbackLabel}</label>
          <textarea
            rows={4}
            value={state.feedbackNote}
            onChange={(e) => onChangeState((prev) => ({ ...prev, feedbackNote: e.target.value }))}
            placeholder={feedbackPlaceholder}
            className="w-full rounded-xl bg-white border border-indigo-200 p-2.5 text-xs font-medium text-indigo-950 outline-none focus:border-indigo-600 resize-none flex-1"
          />
        </div>

        <div className="lg:col-span-6 bg-white border-2 border-indigo-200 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
            <div>
              <div className="text-[11px] font-black uppercase text-indigo-500">
                Tổng hợp phiếu đánh giá ({stageShortLabel}) • Gửi Thầy Trần Văn Lĩnh
              </div>
              <div className="text-xl font-black text-indigo-950 mt-0.5">
                Tổng điểm: <span className="text-orange-600">{totalPoints}</span> / 10.0 điểm
              </div>
            </div>
            {isComplete ? (
              <span className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${rank.colorClass}`}>
                {rank.label}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                Chấm {answeredCount}/{criteria.length} tiêu chí
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-600 space-y-0.5 font-medium">
            <div>
              • <strong>Nhóm đánh giá:</strong>{' '}
              {state.evaluatorGroup.trim() || <span className="text-rose-500 italic">Chưa nhập</span>}
            </div>
            <div>
              • <strong>Nhóm được đánh giá:</strong>{' '}
              {state.targetGroup.trim() || <span className="text-rose-500 italic">Chưa nhập</span>}
            </div>
          </div>

          {state.validationError && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-xl px-3 py-2 text-xs font-bold">
              ⚠️ {state.validationError}
            </div>
          )}

          {state.message && (
            <div
              className={`rounded-xl px-3 py-2 text-xs font-bold border ${state.status === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
            >
              {state.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              disabled={state.isSending}
              onClick={onSubmit}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>
                {state.isSending
                  ? 'Đang gửi phiếu đánh giá cho GV...'
                  : 'Nộp phiếu đánh giá cho thầy Trần Văn Lĩnh'}
              </span>
            </button>

            <a
              href={`mailto:${teacherEmail}?subject=${encodeURIComponent(
                `[KHTN 9] Đánh giá Rubric ${stageShortLabel} - ${state.targetGroup.trim() || 'Nhóm HS'}`
              )}&body=${encodeURIComponent(buildRubricMailtoBodyFor(stageFullTitle, criteria, state))}`}
              className="py-2.5 px-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-black text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
              title="Mở ứng dụng Email để gửi bản sao trực tiếp"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mailto dự phòng</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
