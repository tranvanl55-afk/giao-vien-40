/* cSpell:disable */
import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, Lightbulb } from 'lucide-react';
import { TASK_SPECIFIC_GUIDES, type TaskGuideInfo } from '../lessonData';

export interface LockedTaskBoxProps {
  taskId: string;
  badgeText: string;
  title: string;
  emoji: string;
  isUnlocked: boolean;
  isCompleted?: boolean;
  onUnlock: (id: string) => void;
  onLock?: (id: string) => void;
  guideContent?: TaskGuideInfo;
  children: React.ReactNode;
}

export function LockedTaskBox({
  taskId,
  badgeText,
  title,
  emoji,
  isUnlocked,
  isCompleted = false,
  onUnlock,
  onLock,
  guideContent,
  children,
}: LockedTaskBoxProps) {
  const [showTaskGuide, setShowTaskGuide] = useState<boolean>(false);
  const taskGuide = guideContent || TASK_SPECIFIC_GUIDES[taskId];

  if (!isUnlocked) {
    return (
      <button
        id={`box-${taskId}`}
        type="button"
        onClick={() => onUnlock(taskId)}
        className="w-full text-left rounded-3xl bg-white/85 hover:bg-white border-2 border-dashed border-indigo-200 hover:border-orange-400 p-4 md:p-5 shadow-[0_6px_20px_rgba(30,27,75,0.06)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.14)] backdrop-blur-md transition-all duration-300 group cursor-pointer flex items-center justify-between gap-3 hover:-translate-y-0.5 scroll-mt-24"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
            {emoji}
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-orange-700 border border-orange-200 mb-0.5">
              <Lock className="w-3 h-3" /> {badgeText}
            </span>
            <h3 className="text-sm md:text-base font-extrabold text-indigo-950 group-hover:text-orange-600 transition-colors">
              {title}
            </h3>
          </div>
        </div>

        <div className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 group-hover:from-indigo-600 group-hover:to-purple-600 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition-all">
          <Unlock className="w-3.5 h-3.5" />
          <span>Mở</span>
        </div>
      </button>
    );
  }

  return (
    <div
      id={`box-${taskId}`}
      className="rounded-3xl bg-white/95 border-2 border-white p-5 md:p-6 shadow-[0_10px_30px_rgba(30,27,75,0.08)] backdrop-blur-xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-indigo-950 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl">{emoji}</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-indigo-100 text-indigo-800">
            {badgeText}
          </span>
          <h3 className="text-sm md:text-base font-black text-indigo-950">{title}</h3>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Xong
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {taskGuide && (
            <button
              type="button"
              onClick={() => setShowTaskGuide((v) => !v)}
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${showTaskGuide
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              title="Bấm để xem hướng dẫn chi tiết cách làm nhiệm vụ này"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showTaskGuide ? 'Ẩn' : 'Hướng dẫn'}</span>
            </button>
          )}

          {onLock && (
            <button
              type="button"
              onClick={() => onLock(taskId)}
              className="px-3 py-1 rounded-full bg-indigo-50 hover:bg-orange-50 text-indigo-900 hover:text-orange-600 border border-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Thu gọn</span>
            </button>
          )}
        </div>
      </div>

      {/* VÙNG HƯỚNG DẪN ĐI KÈM RIÊNG CỦA NHIỆM VỤ NÀY (BẬT/TẮT) */}
      {showTaskGuide && taskGuide && (
        <div className="bg-linear-to-r from-amber-50 via-orange-50/80 to-amber-50 border-2 border-amber-300/90 rounded-2xl p-4 text-xs text-amber-950 space-y-2.5 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-1.5">
            <span className="font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
              <span>💡</span> Hướng dẫn thực hiện: {title}
            </span>
            <button
              type="button"
              onClick={() => setShowTaskGuide(false)}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-950 px-2 py-0.5 rounded-md hover:bg-amber-200/50 cursor-pointer"
            >
              ✕ Đóng
            </button>
          </div>

          {taskGuide.goal && (
            <div className="flex items-start gap-1.5">
              <span className="font-black text-amber-900 shrink-0">🎯 Mục tiêu:</span>
              <span className="font-semibold text-slate-800">{taskGuide.goal}</span>
            </div>
          )}

          {taskGuide.steps && taskGuide.steps.length > 0 && (
            <div className="space-y-1">
              <span className="font-black text-amber-900 block">📋 Các bước thao tác:</span>
              <ol className="list-decimal pl-5 space-y-1 text-slate-800 font-medium">
                {taskGuide.steps.map((st, sIdx) => (
                  <li key={sIdx}>{st}</li>
                ))}
              </ol>
            </div>
          )}

          {taskGuide.tips && (
            <div className="bg-white/85 border border-amber-200 rounded-xl p-2.5 font-semibold text-amber-900 flex items-start gap-1.5">
              <span className="shrink-0">✨</span>
              <span>{taskGuide.tips}</span>
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
