/* cSpell:disable */
import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { type StageId, NARRATOR_VIDEO_URL, STAGE_GUIDE_INFO } from '../lessonData';

interface NarratorOverlayProps {
  isExpanded: boolean;
  activeStage: StageId;
  onClose: () => void;
  onOpenDetailedGuide: (stage: StageId) => void;
}

export function NarratorOverlay({
  isExpanded,
  activeStage,
  onClose,
  onOpenDetailedGuide,
}: NarratorOverlayProps) {
  if (!isExpanded) return null;

  return (
    <div className="fixed inset-0 z-40 bg-indigo-950/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300 overflow-hidden">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
        <div className="w-85 sm:w-120 md:w-150 lg:w-170 h-75 sm:h-105 md:h-130 lg:h-155 shrink-0 flex items-center justify-center relative pointer-events-none">
          <video
            key={`narrator-full-${activeStage}`}
            src={NARRATOR_VIDEO_URL}
            autoPlay
            loop={Boolean(STAGE_GUIDE_INFO[activeStage].audioUrl)}
            muted
            playsInline
            disablePictureInPicture
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration > 0 && v.currentTime >= v.duration - 0.25 && !STAGE_GUIDE_INFO[activeStage].audioUrl) {
                onClose();
              }
            }}
            onEnded={() => {
              if (!STAGE_GUIDE_INFO[activeStage].audioUrl) {
                onClose();
              }
            }}
            className="w-full h-full object-contain scale-135 md:scale-150 drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] select-none pointer-events-none"
          />
        </div>

        <div className="relative z-10 bg-white/95 border-2 border-white rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(30,27,75,0.25)] text-indigo-950 flex flex-col gap-4 max-w-xl shrink-0 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-black text-xs md:text-sm uppercase tracking-wide">
              ✨ {STAGE_GUIDE_INFO[activeStage].title}
            </span>
            <span className="text-xs font-bold text-indigo-400">Trợ lý dẫn chuyện</span>
          </div>

          <p className="text-sm md:text-base font-bold text-indigo-950/90 leading-relaxed">
            {STAGE_GUIDE_INFO[activeStage].guideText}
          </p>

          {STAGE_GUIDE_INFO[activeStage].audioUrl && (
            <audio
              key={`narrator-audio-${activeStage}`}
              src={STAGE_GUIDE_INFO[activeStage].audioUrl}
              autoPlay
              controls
              onTimeUpdate={(e) => {
                const a = e.currentTarget;
                if (a.duration > 0 && a.currentTime >= a.duration - 0.25) {
                  onClose();
                }
              }}
              onEnded={onClose}
              className="w-full h-10 mt-1"
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDetailedGuide(activeStage);
              }}
              className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xem chi tiết</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-orange-500 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <span>Bắt đầu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

