/* cSpell:disable */
import React from 'react';
import confetti from 'canvas-confetti';
import {
  ExternalLink,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';
import {
  STAGE5_POSTER_DRIVE_URL,
  STAGE5_PRESENTATION_DRIVE_URL,
  TEACHER_EMAIL,
} from '../lessonData';
import {
  type Stage3RubricCriterion,
  type RubricFormState,
  STAGE5_RUBRIC_CRITERIA,
} from '../rubricData';
import { LockedTaskBox } from '../components/LockedTaskBox';
import { RubricInteractivePanel } from '../components/RubricInteractivePanel';

interface Stage5ViewProps {
  guideBanner: React.ReactNode;
  isTeacherMode: boolean;
  unlockedTaskIds: Set<string>;
  unlockTask: (id: string) => void;
  lockTask: (id: string) => void;
  boothChecks: Set<string>;
  setBoothChecks: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleSetItem: (setter: React.Dispatch<React.SetStateAction<Set<string>>>, val: string) => void;
  stage5PresentationSubmitted: boolean;
  setStage5PresentationSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  peerBoothFormUrl: string;
  setPeerBoothFormUrl: React.Dispatch<React.SetStateAction<string>>;
  voteConfirmed: boolean;
  setVoteConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  stage5AssessTab: 'rubric' | 'form';
  setStage5AssessTab: React.Dispatch<React.SetStateAction<'rubric' | 'form'>>;
  stage5RubricState: RubricFormState;
  setStage5RubricState: React.Dispatch<React.SetStateAction<RubricFormState>>;
  stage5RubricSummary: { answeredCount: number; isComplete: boolean; totalPoints: number };
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

export function Stage5View({
  guideBanner,
  isTeacherMode,
  unlockedTaskIds,
  unlockTask,
  lockTask,
  boothChecks,
  setBoothChecks,
  toggleSetItem,
  stage5PresentationSubmitted,
  setStage5PresentationSubmitted,
  peerBoothFormUrl,
  setPeerBoothFormUrl,
  voteConfirmed,
  setVoteConfirmed,
  stage5AssessTab,
  setStage5AssessTab,
  stage5RubricState,
  setStage5RubricState,
  stage5RubricSummary,
  submitRubricEvaluation,
  isNextStageUnlocked,
  onNextStage,
}: Stage5ViewProps) {
  return (
<div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {guideBanner}
            <LockedTaskBox
              taskId="task-s5-booth"
              badgeText="Chặng 5 • Ô 5.1"
              title="5.1. Nộp Poster lên Google Drive & Trưng bày gian hàng Ngày hội xanh tại lớp"
              emoji="🎪"
              isUnlocked={unlockedTaskIds.has('task-s5-booth')}
              isCompleted={boothChecks.size === 3}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="flex flex-col gap-3.5">
                {/* Khung nộp Poster dự án vào Google Drive Chặng 5.1 */}
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                      🖼️
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-black text-indigo-950">
                        Nộp Poster Khoa học Ngày hội xanh — Thư mục Google Drive Chặng 5.1
                      </div>
                      <p className="text-[11px] font-medium text-indigo-900/75">
                        Các nhóm đăng tải tệp Poster (Ảnh / PDF / Canva) của nhóm vào thư mục Google Drive chung trước khi trưng bày và thuyết trình tại lớp.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={STAGE5_POSTER_DRIVE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở Google Drive nộp Poster</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setBoothChecks(new Set(['intro', 'science', 'message']));
                        confetti({ particleCount: 55, spread: 55, origin: { y: 0.65 } });
                      }}
                      className={`px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                        boothChecks.size === 3
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {boothChecks.size === 3
                          ? '✓ Đã nộp Poster & Hoàn thành 5.1'
                          : 'Xác nhận đã nộp Poster lên Drive'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'intro', emoji: '🎤', title: '1. Trưng bày & Giới thiệu', desc: 'Treo Poster & giới thiệu sản phẩm tái sinh của nhóm.' },
                    { id: 'science', emoji: '🔬', title: '2. Giải thích Khoa học', desc: 'Nêu rõ vai trò của Tinh bột / Cellulose trên Poster.' },
                    { id: 'message', emoji: '🌍', title: '3. Thông điệp Xanh', desc: 'Lan tỏa thông điệp Phát triển bền vững.' },
                  ].map((b) => {
                    const checked = boothChecks.has(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => toggleSetItem(setBoothChecks, b.id)}
                        className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 cursor-pointer transition-all ${
                          checked
                            ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                            : 'bg-indigo-50/40 border-indigo-100 hover:border-orange-300'
                        }`}
                      >
                        <span className="text-2xl">{b.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs md:text-sm text-indigo-950">{b.title}</span>
                            {checked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </div>
                          <p className="text-xs text-indigo-900/70 font-medium mt-1">{b.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </LockedTaskBox>

            <LockedTaskBox
              taskId="task-s5-presentation"
              badgeText="Chặng 5 • Ô 5.2"
              title="5.2. Nộp Video minh họa khi thuyết trình lên Google Drive"
              emoji="🎬"
              isUnlocked={unlockedTaskIds.has('task-s5-presentation')}
              isCompleted={stage5PresentationSubmitted}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                    🎬
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-black text-indigo-950">
                      Nộp Video minh họa khi thuyết trình — Thư mục Google Drive Chặng 5.2
                    </div>
                    <p className="text-[11px] font-medium text-indigo-900/75">
                      Học sinh nộp video minh họa phục vụ phần thuyết trình của nhóm lên thư mục Google Drive tại đây.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={STAGE5_PRESENTATION_DRIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở Google Drive nộp Video minh họa</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setStage5PresentationSubmitted(true);
                      confetti({ particleCount: 55, spread: 55, origin: { y: 0.65 } });
                    }}
                    className={`px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                      stage5PresentationSubmitted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {stage5PresentationSubmitted
                        ? '✓ Đã nộp Video minh họa lên Drive'
                        : 'Xác nhận đã nộp Video minh họa'}
                    </span>
                  </button>
                </div>
              </div>
            </LockedTaskBox>

            {/* Ô 5.2. ĐÁNH GIÁ ĐỒNG ĐẲNG & RUBRIC NGÀY HỘI XANH (SẢN PHẨM, POSTER & THUYẾT TRÌNH) */}
            <LockedTaskBox
              taskId="task-s5-vote"
              badgeText="Chặng 5 • Ô 5.2"
              title="5.2. Đánh giá Sản phẩm, Poster & Thuyết trình theo Rubric (3 Tiêu chí × 5 Mức độ) & Form đồng đẳng"
              emoji="⭐"
              isUnlocked={unlockedTaskIds.has('task-s5-vote')}
              isCompleted={voteConfirmed}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="flex flex-col gap-4">
                {/* THANH CHUYỂN CHẾ ĐỘ: BẢNG RUBRIC TƯƠNG TÁC vs BIỂU MẪU GOOGLE FORM */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/80 p-2 rounded-2xl border border-indigo-200">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStage5AssessTab('rubric')}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        stage5AssessTab === 'rubric'
                          ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                          : 'bg-white text-indigo-900 hover:bg-indigo-100'
                      }`}
                    >
                      <span>📊</span>
                      <span>Thang đo Rubric Ngày hội xanh (3 tiêu chí • 5 mức)</span>
                    </button>
                    {(peerBoothFormUrl || isTeacherMode) && (
                      <button
                        type="button"
                        onClick={() => setStage5AssessTab('form')}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          stage5AssessTab === 'form'
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
                      <strong className="text-orange-600">{stage5RubricSummary.totalPoints}/10</strong> (
                      {stage5RubricSummary.answeredCount}/{STAGE5_RUBRIC_CRITERIA.length} tiêu chí)
                    </span>
                  </div>
                </div>

                {stage5AssessTab === 'rubric' ? (
                  <RubricInteractivePanel
                    stageShortLabel="Chặng 5"
                    stageFullTitle="Chặng 5: Ngày hội xanh — Báo cáo sản phẩm tại lớp"
                    rubricSubtitle="3 tiêu chí (40% Sản phẩm tái sinh – 30% Poster khoa học Bài 30 – 30% Thuyết trình & Phản biện)."
                    feedbackLabel="💬 Nhận xét phản hồi Gian hàng & Báo cáo (Ưu điểm sản phẩm, Poster, phong thái thuyết trình & Góp ý):"
                    feedbackPlaceholder="Ví dụ: Sản phẩm tái sinh độ dai tốt, hạt mầm bố trí đều. Poster trình bày rõ quy trình Bài 30 và nhóm thuyết trình tự tin, phản biện thuyết phục..."
                    criteria={STAGE5_RUBRIC_CRITERIA}
                    state={stage5RubricState}
                    onChangeState={setStage5RubricState}
                    onResetConfirm={() => setVoteConfirmed(false)}
                    onSubmit={() =>
                      submitRubricEvaluation({
                        stage: 'stage-5',
                        stageLabel: 'Chặng 5',
                        criteria: STAGE5_RUBRIC_CRITERIA,
                        state: stage5RubricState,
                        setState: setStage5RubricState,
                        onConfirmed: () => setVoteConfirmed(true),
                      })
                    }
                    teacherEmail={TEACHER_EMAIL}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* Header thanh điều hướng Form */}
                    <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                          ⭐
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-indigo-950">
                            Phiếu đánh giá đồng đẳng Gian hàng &amp; Báo cáo sản phẩm (Biểu mẫu Form)
                          </div>
                          <p className="text-[11px] text-indigo-900/70 font-medium">
                            Học sinh tham quan gian hàng các nhóm và điền phiếu bình chọn, đánh giá đồng đẳng qua Form bên dưới.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {peerBoothFormUrl && (
                          <a
                            href={peerBoothFormUrl}
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
                            setVoteConfirmed(true);
                            confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                            voteConfirmed ? 'bg-emerald-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{voteConfirmed ? '✓ Đã hoàn thành đánh giá gian hàng' : 'Xác nhận đã gửi phiếu Form'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Khung nhúng Form (Iframe) */}
                    {peerBoothFormUrl ? (
                      <div className="w-full rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-md bg-white">
                        <iframe
                          src={peerBoothFormUrl}
                          title="Biểu mẫu Đánh giá đồng đẳng Gian hàng"
                          className="w-full h-155 border-0 block"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-amber-500 flex items-center justify-center text-3xl shadow-inner">
                          ⭐
                        </div>
                        <div className="max-w-md">
                          <h4 className="font-black text-indigo-950 text-sm md:text-base">
                            Khung biểu mẫu đánh giá đồng đẳng Gian hàng Ngày hội xanh đã sẵn sàng!
                          </h4>
                          <p className="text-xs text-indigo-900/70 font-medium mt-1">
                            Khi thầy/cô gửi link Form, biểu mẫu sẽ được nhúng hiển thị trực tiếp tại khung này (hoặc học sinh chấm ngay ở tab Thang đo Rubric bên cạnh).
                          </p>
                        </div>

                        {/* Ô dán link nhanh cho giáo viên */}
                        <div className="w-full max-w-lg mt-1 flex items-center gap-2 bg-white p-1.5 rounded-xl border border-indigo-200 shadow-2xs">
                          <span className="text-xs font-bold text-slate-500 pl-2 shrink-0">🔗 Link Form:</span>
                          <input
                            type="url"
                            placeholder="Dán link Google Form đánh giá gian hàng vào đây..."
                            value={peerBoothFormUrl}
                            onChange={(e) => setPeerBoothFormUrl(e.target.value.trim())}
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
                <span className={boothChecks.size === 3 ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {boothChecks.size === 3 ? '✅' : '⏳'} Ô 5.1: Báo cáo ({boothChecks.size}/3)
                </span>
                <span className={voteConfirmed ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {voteConfirmed ? '✅' : '⏳'} Ô 5.2: Rubric &amp; Đồng đẳng{' '}
                  {stage5RubricSummary.isComplete ? `(${stage5RubricSummary.totalPoints}/10đ)` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNextStage()}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${
                  isNextStageUnlocked
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                }`}
              >
                {isNextStageUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 6: Tổng kết dự án</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
  );
}
