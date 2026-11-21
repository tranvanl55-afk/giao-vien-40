/* cSpell:disable */
import React from 'react';
import confetti from 'canvas-confetti';
import {
  FolderOpen,
  ExternalLink,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';
import { IDEA_DRIVE_URL, TEACHER_EMAIL } from '../lessonData';
import {
  type Stage3RubricCriterion,
  type RubricFormState,
  STAGE3_RUBRIC_CRITERIA,
} from '../rubricData';
import { LockedTaskBox } from '../components/LockedTaskBox';
import { RubricInteractivePanel } from '../components/RubricInteractivePanel';

interface Stage3ViewProps {
  guideBanner: React.ReactNode;
  unlockedTaskIds: Set<string>;
  unlockTask: (id: string) => void;
  lockTask: (id: string) => void;
  ideaDriveSubmitted: boolean;
  setIdeaDriveSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  isStage31Done: boolean;
  presenterName: string;
  setPresenterName: React.Dispatch<React.SetStateAction<string>>;
  isStage32Done: boolean;
  peerIdeaConfirmed: boolean;
  setPeerIdeaConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  stage3RubricState: RubricFormState;
  setStage3RubricState: React.Dispatch<React.SetStateAction<RubricFormState>>;
  stage3RubricSummary: { answeredCount: number; isComplete: boolean; totalPoints: number };
  submitRubricEvaluation: (params: {
    stage: 'stage-3' | 'stage-5';
    stageLabel: string;
    criteria: Stage3RubricCriterion[];
    state: RubricFormState;
    setState: React.Dispatch<React.SetStateAction<RubricFormState>>;
    onConfirmed: () => void;
  }) => Promise<void>;
  isNextStageUnlocked: boolean;
  onNextStage: () => void;
}

export function Stage3View({
  guideBanner,
  unlockedTaskIds,
  unlockTask,
  lockTask,
  ideaDriveSubmitted,
  setIdeaDriveSubmitted,
  isStage31Done,
  presenterName,
  setPresenterName,
  isStage32Done,
  peerIdeaConfirmed,
  setPeerIdeaConfirmed,
  stage3RubricState,
  setStage3RubricState,
  stage3RubricSummary,
  submitRubricEvaluation,
  isNextStageUnlocked,
  onNextStage,
}: Stage3ViewProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {guideBanner}
      <LockedTaskBox
        taskId="task-s3-idea"
        badgeText="Chặng 3 • 3.1"
        title='3.1. Chuẩn bị ý tưởng — Nộp tại Google Drive: Ý tưởng dự án "Bắt đầu từ sự kết thúc"'
        emoji="💡"
        isUnlocked={unlockedTaskIds.has('task-s3-idea')}
        isCompleted={isStage31Done}
        onUnlock={unlockTask}
        onLock={lockTask}
      >
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
              📁
            </div>
            <div>
              <div className="text-xs md:text-sm font-black text-indigo-950">
                Thư mục Google Drive: Ý tưởng dự án "Bắt đầu từ sự kết thúc"
              </div>
              <div className="text-[11px] text-indigo-900/70 font-medium">
                Học sinh nộp bản vẽ phác thảo, sơ đồ ý tưởng hoặc bài trình chiếu của nhóm lên Google Drive
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={IDEA_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Mở thư mục Google Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={() => {
                setIdeaDriveSubmitted((c) => !c);
                if (!ideaDriveSubmitted) {
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.65 } });
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${ideaDriveSubmitted
                ? 'bg-emerald-500 text-white'
                : 'bg-white border border-indigo-200 text-indigo-900 hover:border-orange-400'
                }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {ideaDriveSubmitted
                  ? '✓ Đã nộp ý tưởng lên Google Drive'
                  : 'Xác nhận đã nộp ý tưởng'}
              </span>
            </button>
          </div>
        </div>
      </LockedTaskBox>

      <LockedTaskBox
        taskId="task-s3-process"
        badgeText="Chặng 3 • 3.2"
        title="3.2. Báo cáo ý tưởng và quy trình tại lớp"
        emoji="📋"
        isUnlocked={unlockedTaskIds.has('task-s3-process')}
        isCompleted={isStage32Done}
        onUnlock={unlockTask}
        onLock={lockTask}
      >
        <div className="flex flex-col gap-4">
          {/* HỌC SINH ĐẠI DIỆN THUYẾT TRÌNH BÁO CÁO TẠI LỚP */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                🎤
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs sm:text-sm font-black text-indigo-950">
                  Học sinh thuyết trình báo cáo ý tưởng &amp; quy trình:
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Nhập họ và tên học sinh đại diện nhóm thuyết trình báo cáo trực tiếp trước lớp
                </span>
              </div>
            </div>
            <div className="w-full sm:w-80 flex flex-col gap-1.5">
              <input
                type="text"
                value={presenterName}
                onChange={(e) => setPresenterName(e.target.value)}
                placeholder="Nhập họ và tên học sinh thuyết trình..."
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-300 bg-white text-xs font-bold text-indigo-950 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition-all shadow-2xs"
              />
              {Boolean(presenterName.trim()) && (
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã ghi nhận người đại diện thuyết trình</span>
                </span>
              )}
            </div>
          </div>

          {/* THẺ HƯỚNG DẪN HOẠT ĐỘNG BÁO CÁO */}
          <div className="bg-white border border-indigo-150 rounded-2xl p-4 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-950">
              <span className="text-base">📢</span>
              <span>Nội dung nhóm thực hiện báo cáo trực tiếp trước lớp:</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium pl-6 list-disc">
              <li>Trình bày tóm tắt ý tưởng sản phẩm tái sinh (từ tinh bột ngô/sắn hoặc cellulose bã mía/giấy vụn).</li>
              <li>Thuyết minh sơ đồ các bước gia công sản phẩm và phương án thử nghiệm độ bền.</li>
              <li>Lắng nghe nhận xét từ giáo viên và nhận đánh giá từ các nhóm bạn ở bước 3.3 theo Rubric.</li>
            </ul>
          </div>
        </div>
      </LockedTaskBox>

      {/* 3.3. ĐÁNH GIÁ Ý TƯỞNG & QUY TRÌNH THEO THANG ĐO RUBRIC & FORM ĐỒNG ĐẲNG */}
      <LockedTaskBox
        taskId="task-s3-peer"
        badgeText="Chặng 3 • 3.3"
        title="3.3. Đánh giá Ý tưởng & Quy trình theo Rubric (5 Tiêu chí × 5 Mức độ)"
        emoji="📊"
        isUnlocked={unlockedTaskIds.has('task-s3-peer')}
        isCompleted={peerIdeaConfirmed}
        onUnlock={unlockTask}
        onLock={lockTask}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-end">
            <span className="text-xs font-black px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-950">
              Điểm Bảng kiểm:{' '}
              <strong className="text-orange-600">{stage3RubricSummary.totalPoints}/10</strong> (
              {stage3RubricSummary.answeredCount}/{STAGE3_RUBRIC_CRITERIA.length} tiêu chí)
            </span>
          </div>

          <RubricInteractivePanel
            mode="checklist"
            stageShortLabel="Chặng 3"
            stageFullTitle="Chặng 3: Ý tưởng (3.1) & Quy trình (3.2)"
            rubricSubtitle="5 tiêu chí (25% – 20% – 25% – 15% – 15%) đánh giá bản thiết kế ý tưởng và quy trình kỹ thuật."
            feedbackLabel="💬 Nhận xét phản hồi (Ưu điểm & Góp ý để nhóm hoàn thiện bản thiết kế trước khi làm sản phẩm ở Chặng 4):"
            feedbackPlaceholder="Ví dụ: Cơ sở khoa học Bài 30 rõ, quy trình định lượng đủ gam/ml. Nhóm nên bổ sung bước lọc bã thừa để tránh tắc bồn rửa..."
            criteria={STAGE3_RUBRIC_CRITERIA}
            state={stage3RubricState}
            onChangeState={setStage3RubricState}
            onResetConfirm={() => setPeerIdeaConfirmed(false)}
            onSubmit={() =>
              submitRubricEvaluation({
                stage: 'stage-3',
                stageLabel: 'Chặng 3',
                criteria: STAGE3_RUBRIC_CRITERIA,
                state: stage3RubricState,
                setState: setStage3RubricState,
                onConfirmed: () => setPeerIdeaConfirmed(true),
              })
            }
            teacherEmail={TEACHER_EMAIL}
          />
        </div>
      </LockedTaskBox>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onNextStage()}
          className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${isNextStageUnlocked
            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
            : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
            }`}
        >
          {isNextStageUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span>Sang Chặng 4: Hoàn thiện sản phẩm</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
