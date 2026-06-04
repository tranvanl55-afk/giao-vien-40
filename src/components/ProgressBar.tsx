import React from 'react';
import { useUserProgress } from '../context/UserProgressContext';
import { Award, BookOpen } from 'lucide-react';

interface ProgressBarProps {
  totalLessons: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ totalLessons }) => {
  const { completedLessons } = useUserProgress();
  const completedCount = completedLessons.size;
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm">
      {/* Information Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-indigo-950 dark:text-slate-200">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-extrabold uppercase tracking-wider">Tiến độ khám phá</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-orange-400">
          <span>{completedCount} / {totalLessons} bài học</span>
          <span className="bg-orange-500/10 px-2 py-0.5 rounded-full text-[10px]">
            {percent}%
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-200/60 dark:bg-slate-950/60 rounded-full h-3 overflow-hidden p-[2px] border border-white/20 dark:border-slate-900">
        <div
          className="bg-linear-to-r from-orange-500 via-amber-500 to-yellow-400 h-full rounded-full transition-all duration-550 ease-out shadow-[0_0_12px_rgba(249,115,22,0.4)] relative"
          style={{ width: `${percent}%` }}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        >
          {/* Shimmer Effect */}
          {percent > 0 && (
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] bg-size-[200%_100%]"></div>
          )}
        </div>
      </div>
    </div>
  );
};
