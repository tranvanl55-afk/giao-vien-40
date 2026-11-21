/* cSpell:disable */
import React from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';
import { PADLET_URL } from '../lessonData';
import { LockedTaskBox } from '../components/LockedTaskBox';

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
  isNextStageUnlocked,
  onNextStage,
}: Stage4ViewProps) {
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
                  { id: 'make', emoji: '🥣', title: '1. Chế tạo mẫu', desc: 'Thực hiện pha chế, đổ khuôn và làm khô sản phẩm.' },
                  { id: 'test', emoji: '🔍', title: '2. Thử nghiệm thực tế', desc: 'Kiểm tra độ bền, độ dẻo và tinh chỉnh sản phẩm.' },
                  { id: 'media', emoji: '📸', title: '3. Ghi hình minh chứng', desc: 'Chụp ảnh / quay video quá trình làm tại nhà.' },
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
