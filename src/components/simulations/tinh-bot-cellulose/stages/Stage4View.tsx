/* cSpell:disable */
import React from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';
import { PADLET_URL, TEACHER_EMAIL } from '../lessonData';
import {
  type Stage3RubricCriterion,
  type RubricFormState,
  STAGE5_TEACHER_PRODUCT_RUBRIC_CRITERIA,
  getRubricSummary,
} from '../rubricData';
import { LockedTaskBox } from '../components/LockedTaskBox';
import { RubricInteractivePanel } from '../components/RubricInteractivePanel';

interface Stage4ViewProps {
  guideBanner: React.ReactNode;
  unlockedTaskIds: Set<string>;
  unlockTask: (id: string) => void;
  lockTask: (id: string) => void;
  homeChecks: Set<string>;
  setHomeChecks: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleSetItem: (setter: React.Dispatch<React.SetStateAction<Set<string>>>, val: string) => void;
  productSubmitted: boolean;
  setProductSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  productRubricState: RubricFormState;
  setProductRubricState: React.Dispatch<React.SetStateAction<RubricFormState>>;
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

export function Stage4View({
  guideBanner,
  unlockedTaskIds,
  unlockTask,
  lockTask,
  homeChecks,
  setHomeChecks,
  toggleSetItem,
  productSubmitted,
  setProductSubmitted,
  productRubricState,
  setProductRubricState,
  submitRubricEvaluation,
  isNextStageUnlocked,
  onNextStage,
}: Stage4ViewProps) {
  const [showProductRubric, setShowProductRubric] = React.useState(false);
  const productRubricSummary = getRubricSummary(
    STAGE5_TEACHER_PRODUCT_RUBRIC_CRITERIA,
    productRubricState
  );

  return (
<div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {guideBanner}
            <LockedTaskBox
              taskId="task-s4-maker"
              badgeText="Chặng 4 • Ô 4.1"
              title="Tiến độ chế tạo & thử nghiệm sản phẩm tại nhà"
              emoji="🛠️"
              isUnlocked={unlockedTaskIds.has('task-s4-maker')}
              isCompleted={homeChecks.size === 3}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'make', emoji: '🥣', title: '1. Chế tạo mẫu', desc: 'Pha chế hồ tinh bột + sợi cellulose, đổ khuôn, tích hợp hạt giống đều (sấy < 45°C).' },
                  { id: 'test', emoji: '🌱', title: '2. Thử nghiệm nảy mầm & phân hủy', desc: 'Kiểm tra độ bền/dẻo, tưới ẩm thử hạt nảy mầm & theo dõi quá trình tự phân hủy trong đất.' },
                  { id: 'media', emoji: '📸', title: '3. Ghi hình minh chứng', desc: 'Chụp ảnh / quay video quá trình làm, hạt nảy mầm và sản phẩm phân hủy tại nhà.' },
                ].map((item) => {
                  const checked = homeChecks.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSetItem(setHomeChecks, item.id)}
                      className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 cursor-pointer transition-all ${checked
                        ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                        : 'bg-indigo-50/40 border-indigo-100 hover:border-orange-300'
                        }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs md:text-sm text-indigo-950">{item.title}</span>
                          {checked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="text-xs text-indigo-900/70 font-medium mt-1">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </LockedTaskBox>

            <LockedTaskBox
              taskId="task-s4-submit"
              badgeText="Chặng 4 • Ô 4.2"
              title="Đăng tải hình ảnh / video sản phẩm lên Padlet"
              emoji="📤"
              isUnlocked={unlockedTaskIds.has('task-s4-submit')}
              isCompleted={productSubmitted}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
                <a
                  href={PADLET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center gap-2 shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở Padlet đăng sản phẩm</span>
                </a>

                <button
                  type="button"
                  onClick={() => setProductSubmitted(true)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer ${productSubmitted ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{productSubmitted ? 'Đã nộp sản phẩm lên Padlet' : 'Xác nhận đã nộp sản phẩm'}</span>
                </button>
              </div>
            </LockedTaskBox>

            {/* RUBRIC GIÁO VIÊN ĐÁNH GIÁ SẢN PHẨM (HS THAM KHẢO TIÊU CHÍ KHI CHẾ TẠO TẠI NHÀ) */}
            <div className="bg-white/95 border-2 border-emerald-200 rounded-3xl shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setShowProductRubric((v) => !v)}
                className="w-full px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-linear-to-r from-emerald-50 to-teal-50 hover:from-emerald-100/80 hover:to-teal-100/80 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-base shrink-0 shadow-xs">
                    📋
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-indigo-950">
                      Tiêu chí Giáo viên chấm Sản phẩm STEAM (HS tham khảo trước khi hoàn thiện)
                    </div>
                    <p className="text-[11px] font-medium text-emerald-900/80">
                      4 tiêu chí xoay quanh chất lượng sản phẩm (25% Khoa học Bài 30 • 35% Độ bền &amp; Công năng • 20% Sáng tạo &amp; Thẩm mỹ • 20% An toàn &amp; Ứng dụng) — GV có thể chấm &amp; xuất Word/PDF.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800">
                    {productRubricSummary.totalPoints}/10đ
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black">
                    {showProductRubric ? 'Thu gọn ▲' : 'Xem tiêu chí ▼'}
                  </span>
                </div>
              </button>

              {showProductRubric && (
                <div className="p-4 sm:p-5 border-t border-emerald-100">
                  <RubricInteractivePanel
                    stageShortLabel="Chặng 4 (Sản phẩm)"
                    stageFullTitle="Chặng 4: Tiêu chí Giáo viên đánh giá Sản phẩm STEAM (HS tham khảo khi chế tạo)"
                    rubricSubtitle="4 tiêu chí tập trung đánh giá Sản phẩm (25% Khoa học Bài 30 – 35% Độ bền & Công năng – 20% Sáng tạo & Thẩm mỹ – 20% An toàn & Ứng dụng)."
                    feedbackLabel="💬 Nhận xét của Giáo viên về chất lượng, độ bền và tính ứng dụng của sản phẩm:"
                    feedbackPlaceholder="Ví dụ: Sản phẩm bền đẹp, bề mặt mịn, hạt mầm bố trí đều và an toàn sinh thái..."
                    criteria={STAGE5_TEACHER_PRODUCT_RUBRIC_CRITERIA}
                    state={productRubricState}
                    onChangeState={setProductRubricState}
                    onSubmit={() =>
                      submitRubricEvaluation({
                        stage: 'stage-5',
                        stageLabel: 'Chặng 4 (GV chấm SP)',
                        criteria: STAGE5_TEACHER_PRODUCT_RUBRIC_CRITERIA,
                        state: productRubricState,
                        setState: setProductRubricState,
                        onConfirmed: () => {},
                      })
                    }
                    teacherEmail={TEACHER_EMAIL}
                  />
                </div>
              )}
            </div>

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
                <span>Sang Chặng 5: Ngày hội xanh</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
  );
}
