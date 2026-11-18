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
  isTeacherMode: boolean;
  unlockedTaskIds: Set<string>;
  unlockTask: (id: string) => void;
  lockTask: (id: string) => void;
  ideaDriveSubmitted: boolean;
  setIdeaDriveSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  isStage31Done: boolean;
  presenterName: string;
  setPresenterName: React.Dispatch<React.SetStateAction<string>>;
  isStage32Done: boolean;
  peerIdeaFormUrl: string;
  setPeerIdeaFormUrl: React.Dispatch<React.SetStateAction<string>>;
  peerIdeaConfirmed: boolean;
  setPeerIdeaConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  stage3AssessTab: 'rubric' | 'form';
  setStage3AssessTab: React.Dispatch<React.SetStateAction<'rubric' | 'form'>>;
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
  isTeacherMode,
  unlockedTaskIds,
  unlockTask,
  lockTask,
  ideaDriveSubmitted,
  setIdeaDriveSubmitted,
  isStage31Done,
  presenterName,
  setPresenterName,
  isStage32Done,
  peerIdeaFormUrl,
  setPeerIdeaFormUrl,
  peerIdeaConfirmed,
  setPeerIdeaConfirmed,
  stage3AssessTab,
  setStage3AssessTab,
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
                    className={`px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                      ideaDriveSubmitted
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
              title="3.3. Đánh giá Ý tưởng & Quy trình theo Rubric (5 Tiêu chí × 5 Mức độ) & Form đồng đẳng"
              emoji="📊"
              isUnlocked={unlockedTaskIds.has('task-s3-peer')}
              isCompleted={peerIdeaConfirmed}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="flex flex-col gap-4">
                {/* THANH CHUYỂN CHẾ ĐỘ: BẢNG RUBRIC TƯƠNG TÁC vs BIỂU MẪU GOOGLE FORM */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/80 p-2 rounded-2xl border border-indigo-200">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStage3AssessTab('rubric')}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${stage3AssessTab === 'rubric'
                        ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                        : 'bg-white text-indigo-900 hover:bg-indigo-100'
                      }`}
                    >
                      <span>📊</span>
                      <span>Thang đo Rubric trực tiếp (5 tiêu chí • 5 mức)</span>
                    </button>
                    {(peerIdeaFormUrl || isTeacherMode) && (
                      <button
                        type="button"
                        onClick={() => setStage3AssessTab('form')}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${stage3AssessTab === 'form'
                            ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                            : 'bg-white text-indigo-900 hover:bg-indigo-100'
                          }`}
                      >
                        <span>📋</span>
                        <span>Biểu mẫu Google Form đồng đẳng</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-3 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-950">
                      Điểm Rubric:{' '}
                      <strong className="text-orange-600">{stage3RubricSummary.totalPoints}/10</strong> (
                      {stage3RubricSummary.answeredCount}/{STAGE3_RUBRIC_CRITERIA.length} tiêu chí)
                    </span>
                  </div>
                </div>

                {stage3AssessTab === 'rubric' ? (
                  <RubricInteractivePanel
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
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* Header thanh điều hướng Form */}
                    <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                          📋
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-indigo-950">
                            Phiếu đánh giá đồng đẳng Ý tưởng dự án (Biểu mẫu Google Form)
                          </div>
                          <p className="text-[11px] text-indigo-900/70 font-medium">
                            Học sinh lắng nghe nhóm bạn báo cáo ý tưởng và điền phiếu đánh giá đồng đẳng qua Form bên dưới.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {peerIdeaFormUrl && (
                          <a
                            href={peerIdeaFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Mở Form tab mới</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setPeerIdeaConfirmed(true);
                            confetti({ particleCount: 60, spread: 55, origin: { y: 0.65 } });
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${peerIdeaConfirmed ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{peerIdeaConfirmed ? '✓ Đã hoàn thành đánh giá' : 'Xác nhận đã gửi phiếu Form'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Khung nhúng Form (Iframe) */}
                    {peerIdeaFormUrl ? (
                      <div className="w-full rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-md bg-white">
                        <iframe
                          src={peerIdeaFormUrl}
                          title="Biểu mẫu Đánh giá đồng đẳng Ý tưởng"
                          className="w-full h-155 border-0 block"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl shadow-inner">
                          📋
                        </div>
                        <div className="max-w-md">
                          <h4 className="font-black text-indigo-950 text-sm md:text-base">
                            Khung biểu mẫu đánh giá đồng đẳng Ý tưởng đã sẵn sàng!
                          </h4>
                          <p className="text-xs text-indigo-900/70 font-medium mt-1">
                            Khi thầy/cô gửi link Form, biểu mẫu sẽ được nhúng hiển thị trực tiếp tại khung này để học sinh điền đánh giá.
                          </p>
                        </div>

                        {/* Ô dán link nhanh cho giáo viên */}
                        <div className="w-full max-w-lg mt-1 flex items-center gap-2 bg-white p-1.5 rounded-xl border border-indigo-200 shadow-2xs">
                          <span className="text-xs font-bold text-slate-500 pl-2 shrink-0">🔗 Link Form:</span>
                          <input
                            type="url"
                            placeholder="Dán link Google Form đánh giá ý tưởng vào đây..."
                            value={peerIdeaFormUrl}
                            onChange={(e) => setPeerIdeaFormUrl(e.target.value.trim())}
                            className="flex-1 text-xs text-indigo-950 outline-none font-medium px-2 py-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </LockedTaskBox>

            <div className="bg-white/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3 text-xs font-bold">
                <span className={isStage31Done ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {isStage31Done ? '✅' : '⏳'} 3.1: Nộp ý tưởng (Drive)
                </span>
                <span className={isStage32Done ? "text-emerald-700" : "text-indigo-900/60"}>
                  {isStage32Done ? '✅' : '⏳'} 3.2: Báo cáo tại lớp {presenterName.trim() ? `(${presenterName.trim()})` : ''}
                </span>
                <span className={peerIdeaConfirmed ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {peerIdeaConfirmed ? '✅' : '⏳'} 3.3: Rubric &amp; Đồng đẳng{' '}
                  {stage3RubricSummary.isComplete ? `(${stage3RubricSummary.totalPoints}/10đ)` : ''}
                </span>
              </div>
<button
                type="button"
                onClick={() => onNextStage()}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${isNextStageUnlocked
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                  : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                  }`}
              >
                {isNextStageUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 4: Hoàn thiện sản phẩm (Tại nhà)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
  );
}
