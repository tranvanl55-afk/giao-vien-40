/* cSpell:disable */
import React from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Play,
  Award,
  RotateCcw,
  ExternalLink,
  Printer,
  Download,
  Users,
  Crown,
  User,
  Lock,
} from 'lucide-react';
import {
  STAGE6_SUMMARY_VIDEO_DRIVE_URL,
  QUIZ_QUESTIONS,
  TASK_SPECIFIC_GUIDES,
} from '../lessonData';
import {
  type Stage6MemberRecord,
  STAGE6_SELF_RUBRIC_CRITERIA,
  STAGE6_LEADER_RUBRIC_CRITERIA,
  STAGE6_TEACHER_RUBRIC_CRITERIA,
  getStage6RankInfo,
} from '../rubricData';
import { LockedTaskBox } from '../components/LockedTaskBox';

export interface Stage6Reflections {
  contribution: string;
  favorite: string;
  difficulties: string;
  improvement: string;
}

interface Stage6ViewProps {
  guideBanner: React.ReactNode;
  isReviewMode: boolean;
  unlockedTaskIds: Set<string>;
  everUnlockedTaskIds: Set<string>;
  unlockTask: (id: string) => void;
  lockTask: (id: string) => void;
  unlockedQuizIds: Set<string>;
  setUnlockedQuizIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  stage6SummaryVideoConfirmed: boolean;
  setStage6SummaryVideoConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  quizAnswers: Record<string, number>;
  setQuizAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  quizSubmitted: boolean;
  setQuizSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  handleQuizSubmit: () => void;
  quizScore: number;
  stage6GameMode: 'pose_game' | 'quiz';
  setStage6GameMode: React.Dispatch<React.SetStateAction<'pose_game' | 'quiz'>>;
  poseGameKey: number;
  setPoseGameKey: React.Dispatch<React.SetStateAction<number>>;
  isPoseGameUnlocked: boolean;
  poseGamePassInput: string;
  setPoseGamePassInput: React.Dispatch<React.SetStateAction<string>>;
  poseGamePassError: string | null;
  setPoseGamePassError: React.Dispatch<React.SetStateAction<string | null>>;
  handleUnlockPoseGame: () => void;
  stage6AssessTab: 'self' | 'leader' | 'teacher';
  setStage6AssessTab: React.Dispatch<React.SetStateAction<'self' | 'leader' | 'teacher'>>;
  stage6SelfStudentName: string;
  setStage6SelfStudentName: React.Dispatch<React.SetStateAction<string>>;
  stage6SelfClass: string;
  setStage6SelfClass: React.Dispatch<React.SetStateAction<string>>;
  stage6SelfGroup: string;
  setStage6SelfGroup: React.Dispatch<React.SetStateAction<string>>;
  stage6SelfDate: string;
  setStage6SelfDate: React.Dispatch<React.SetStateAction<string>>;
  stage6SelfScores: Record<string, number>;
  setStage6SelfScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  stage6SelfReflections: Stage6Reflections;
  setStage6SelfReflections: React.Dispatch<React.SetStateAction<Stage6Reflections>>;
  stage6SelfSignature: string;
  setStage6SelfSignature: React.Dispatch<React.SetStateAction<string>>;
  stage6SelfSubmitted: boolean;
  setStage6SelfSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  stage6LeaderName: string;
  stage6LeaderClass: string;
  stage6LeaderGroup: string;
  stage6Members: Stage6MemberRecord[];
  setStage6Members: React.Dispatch<React.SetStateAction<Stage6MemberRecord[]>>;
  stage6SelectedMemberId: string;
  setStage6SelectedMemberId: React.Dispatch<React.SetStateAction<string>>;
  stage6LeaderSubmitted: boolean;
  setStage6LeaderSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  stage6TeacherGroup: string;
  setStage6TeacherGroup: React.Dispatch<React.SetStateAction<string>>;
  stage6TeacherClass: string;
  setStage6TeacherClass: React.Dispatch<React.SetStateAction<string>>;
  stage6TeacherProduct: string;
  setStage6TeacherProduct: React.Dispatch<React.SetStateAction<string>>;
  stage6TeacherName: string;
  setStage6TeacherName: React.Dispatch<React.SetStateAction<string>>;
  stage6TeacherScores: Record<string, number>;
  setStage6TeacherScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  stage6TeacherStrengths: string;
  setStage6TeacherStrengths: React.Dispatch<React.SetStateAction<string>>;
  stage6TeacherIndividualAdjustments: string;
  setStage6TeacherIndividualAdjustments: React.Dispatch<React.SetStateAction<string>>;
  stage6TeacherSubmitted: boolean;
  setStage6TeacherSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitStage6Self: () => Promise<void>;
  onSubmitStage6Leader: () => Promise<void>;
  onSubmitStage6Teacher: (combinedInfo?: {
    productScore?: number;
    productWeightPct?: number;
    projectFinalScore?: number;
  }) => Promise<void>;
  stage4ProductScore: number;
  stage4ProductAnsweredCount: number;
  showToast: (text: string, type?: 'success' | 'warning') => void;
}

export const Stage6View: React.FC<Stage6ViewProps> = ({
  guideBanner,
  isReviewMode,
  unlockedTaskIds,
  everUnlockedTaskIds,
  unlockTask,
  lockTask,
  unlockedQuizIds,
  setUnlockedQuizIds,
  stage6SummaryVideoConfirmed,
  setStage6SummaryVideoConfirmed,
  quizAnswers,
  setQuizAnswers,
  quizSubmitted,
  setQuizSubmitted,
  handleQuizSubmit,
  quizScore,
  stage6GameMode,
  setStage6GameMode,
  poseGameKey,
  setPoseGameKey,
  isPoseGameUnlocked,
  poseGamePassInput,
  setPoseGamePassInput,
  poseGamePassError,
  setPoseGamePassError,
  handleUnlockPoseGame,
  stage6AssessTab,
  setStage6AssessTab,
  stage6SelfStudentName,
  setStage6SelfStudentName,
  stage6SelfClass,
  setStage6SelfClass,
  stage6SelfGroup,
  setStage6SelfGroup,
  stage6SelfDate,
  setStage6SelfDate,
  stage6SelfScores,
  setStage6SelfScores,
  stage6SelfReflections,
  setStage6SelfReflections,
  stage6SelfSignature,
  setStage6SelfSignature,
  stage6SelfSubmitted,
  setStage6SelfSubmitted,
  stage6LeaderName,
  stage6LeaderClass,
  stage6LeaderGroup,
  stage6Members,
  setStage6Members,
  stage6SelectedMemberId,
  setStage6SelectedMemberId,
  stage6LeaderSubmitted,
  setStage6LeaderSubmitted,
  stage6TeacherGroup,
  setStage6TeacherGroup,
  stage6TeacherClass,
  setStage6TeacherClass,
  stage6TeacherProduct,
  setStage6TeacherProduct,
  stage6TeacherName,
  setStage6TeacherName,
  stage6TeacherScores,
  setStage6TeacherScores,
  stage6TeacherStrengths,
  setStage6TeacherStrengths,
  stage6TeacherIndividualAdjustments,
  setStage6TeacherIndividualAdjustments,
  stage6TeacherSubmitted,
  setStage6TeacherSubmitted,
  onSubmitStage6Self,
  onSubmitStage6Leader,
  onSubmitStage6Teacher,
  stage4ProductScore,
  stage4ProductAnsweredCount,
  showToast,
}) => {
  const [productWeightPct, setProductWeightPct] = React.useState<number>(50);
  const [manualProductScore, setManualProductScore] = React.useState<string>('');
  return (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {guideBanner}
            <LockedTaskBox
              taskId="task-s6-summary"
              badgeText="Chặng 6 • Ô 6.1"
              title="Tổng kết kiến thức & Game vận động TRẮC NGHIỆM TẠO DÁNG (BODY POSE QUIZ) trên Smart TV"
              emoji="🎓"
              isUnlocked={unlockedTaskIds.has('task-s6-summary')}
              isCompleted={everUnlockedTaskIds.has('task-s6-summary') && quizSubmitted}
              onUnlock={unlockTask}
              onLock={lockTask}
              guideContent={TASK_SPECIFIC_GUIDES['task-s6-summary']}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                <div className="lg:col-span-8 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
                  <h4 className="text-xs font-black text-emerald-800 uppercase mb-2">📚 EM ĐÃ HỌC</h4>
                  <ul className="space-y-1.5 text-xs text-indigo-950 font-medium leading-relaxed">
                    <li>• Tinh bột và cellulose đều là <strong>carbohydrate</strong>, công thức <strong>(C₆H₁₀O₅)ₙ</strong>.</li>
                    <li>• Đều là <strong>chất rắn, màu trắng, không tan trong nước</strong>. Tinh bột <strong>dự trữ năng lượng</strong>, cellulose <strong>tạo bộ khung thực vật</strong>.</li>
                    <li>• Thủy phân hoàn toàn tinh bột và cellulose đều tạo <strong>glucose</strong>.</li>
                    <li>• Tinh bột phản ứng với dung dịch <strong>iodine</strong> tạo hợp chất <strong>màu xanh tím</strong>.</li>
                    <li>• Có vai trò quan trọng trong <strong>đời sống và sản xuất công nghiệp</strong>.</li>
                  </ul>
                </div>

                <div className="lg:col-span-4 bg-orange-50/80 border border-orange-200 rounded-2xl p-4 flex flex-col justify-center">
                  <h4 className="text-xs font-black text-orange-700 uppercase mb-1.5">💡 EM CÓ THỂ</h4>
                  <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                    Tìm hiểu các sản phẩm chứa <strong>tinh bột</strong> và <strong>cellulose</strong> trong gia đình (thực phẩm, quần áo, đồ gia dụng,...) để sử dụng hiệu quả hằng ngày.
                  </p>
                </div>
              </div>
{/* THANH TIỆN ÍCH GAME VẬN ĐỘNG SMART TV */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/70 p-2 rounded-2xl border border-indigo-100 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                    <span>🕺</span>
                    <span>Game Vận động Smart TV (Body Pose Quiz)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(true);
                      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                      quizSubmitted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{quizSubmitted ? '✓ Đã hoàn thành Chặng 6' : 'Xác nhận hoàn thành Trò chơi'}</span>
                  </button>
                  {isPoseGameUnlocked && (
                    <a
                      href="/trac-nghiem-tao-dang.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="Mở trò chơi toàn màn hình trên Smart TV / Máy chiếu lớp học"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Chiếu Smart TV</span>
                    </a>
                  )}
                </div>
              </div>

              {/* TRÒ CHƠI VẬN ĐỘNG BODY POSE QUIZ TRÊN SMART TV */}
              {!isPoseGameUnlocked ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-indigo-950">
                      Game Vận động Smart TV cần mật khẩu Giáo viên
                    </h4>
                    <p className="text-xs text-indigo-900/75 max-w-md font-medium">
                      Giáo viên nhập mật khẩu để mở trò chơi vận động cho cả lớp trên Smart TV.
                    </p>
                    <div className="px-3.5 py-2 rounded-xl bg-white/90 border border-amber-300 text-[11px] font-bold text-amber-900 shadow-xs">
                      💡 Ghi chú dành cho Giám khảo: Mật khẩu mở khóa trò chơi là <code className="px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 font-black select-all">01011993</code>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-sm mt-1">
                      <input
                        type="password"
                        value={poseGamePassInput}
                        onChange={(e) => {
                          setPoseGamePassInput(e.target.value);
                          setPoseGamePassError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUnlockPoseGame();
                        }}
                        placeholder="Nhập mật khẩu Giáo viên..."
                        className="flex-1 min-w-44 px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleUnlockPoseGame}
                        className="px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-xs cursor-pointer"
                      >
                        Mở khóa Game
                      </button>
                    </div>
                    {poseGamePassError && (
                      <p className="text-xs font-bold text-rose-600">{poseGamePassError}</p>
                    )}
                  </div>
                ) : (
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl overflow-hidden border border-indigo-200 shadow-sm relative bg-black aspect-video sm:aspect-16/10">
                    <iframe
                      key={poseGameKey}
                      src="/trac-nghiem-tao-dang.html"
                      title="Trò chơi Trắc nghiệm Tạo dáng Body Pose Quiz"
                      className="w-full h-165 md:h-185 border-0 block"
                      loading="lazy"
                    />
                  </div>

                  <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-950">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>💡 <strong>Hướng dẫn lớp học:</strong> Giáo viên chiếu màn hình lên Smart TV. Học sinh đứng lên tạo dáng theo đáp án (A, B, C, D) mà không cần camera. Phím tắt:</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white border border-indigo-200 font-mono text-[11px] font-bold">Space</kbd> <span>Mở đáp án / Kế tiếp,</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white border border-indigo-200 font-mono text-[11px] font-bold">1-8</kbd> <span>Nhảy câu,</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white border border-indigo-200 font-mono text-[11px] font-bold">R</kbd> <span>Reset.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPoseGameKey((k) => k + 1)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Tải lại game</span>
                    </button>
                  </div>
                </div>
                )}
            </LockedTaskBox>

            {/* ============================================================
                CHẶNG 6 • Ô 6.2: ĐÁNH GIÁ DỰ ÁN (360° ASSESSMENT)
                1. Học sinh tự đánh giá & Reflection
                2. Nhóm trưởng Trần Hoàng Hùng đánh giá thành viên
                3. Giáo viên đánh giá nhóm
               ============================================================ */}
            <LockedTaskBox
              taskId="task-s6-assessment"
              badgeText="Chặng 6 • Ô 6.2"
              title="Đánh giá dự án: Học sinh tự đánh giá • Nhóm trưởng đánh giá thành viên • Giáo viên đánh giá nhóm"
              emoji="🎖️"
              isUnlocked={unlockedTaskIds.has('task-s6-assessment') || unlockedTaskIds.has('task-s6-quiz')}
              isCompleted={stage6SelfSubmitted || stage6LeaderSubmitted || stage6TeacherSubmitted}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="flex flex-col gap-4">
                {/* THANH TAB ĐIỀU HƯỚNG 3 PHÂN HỆ ĐÁNH GIÁ */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/70 p-2 rounded-2xl border border-indigo-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStage6AssessTab('self')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        stage6AssessTab === 'self'
                          ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                          : 'bg-white text-indigo-900 hover:bg-indigo-100'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>1. 🙋‍♂️ Học sinh tự đánh giá</span>
                      {stage6SelfSubmitted && <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">✓ Đã nộp</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStage6AssessTab('leader')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        stage6AssessTab === 'leader'
                          ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                          : 'bg-white text-indigo-900 hover:bg-indigo-100'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>2. 👑 Nhóm trưởng đánh giá thành viên</span>
                      {stage6LeaderSubmitted && <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">✓ Đã nộp</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStage6AssessTab('teacher')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        stage6AssessTab === 'teacher'
                          ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                          : 'bg-white text-indigo-900 hover:bg-indigo-100'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>3. 👨‍🏫 Giáo viên đánh giá nhóm</span>
                      {stage6TeacherSubmitted && <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">✓ Đã nộp</span>}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                    title="In hoặc xuất file PDF phiếu đánh giá"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    <span>In / Xuất PDF</span>
                  </button>
                </div>

                {/* ============================================================
                    TAB 1: HỌC SINH TỰ ĐÁNH GIÁ (RUBRIC 4 TIÊU CHÍ + REFLECTION)
                   ============================================================ */}
                {stage6AssessTab === 'self' && (() => {
                  const totalSelfScore = Math.round(
                    STAGE6_SELF_RUBRIC_CRITERIA.reduce((acc, c) => acc + (stage6SelfScores[c.id] ?? 0), 0) * 10
                  ) / 10;
                  const rankInfo = getStage6RankInfo(totalSelfScore);

                  return (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                      {/* BANNER TIÊU ĐỀ CHUẨN */}
                      <div className="bg-linear-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-600/50 shadow-md">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-black text-xs uppercase">
                            🙋‍♂️ PHẦN I: TỰ ĐÁNH GIÁ MỨC ĐỘ ĐẠT ĐƯỢC CỦA BẢN THÂN
                          </span>
                          <span className="text-xs font-bold text-emerald-200">
                            Thang điểm 10 (100%) • 4 Tiêu chí cốt lõi
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          Khoanh tròn ô mô tả phù hợp nhất với sự nỗ lực và đóng góp của em trong suốt hành trình Dự án STEM Bài 30: Tinh bột &amp; Cellulose. Điểm số sẽ tự động được cộng dồn vào cột bên phải.
                        </p>
                      </div>

                      {/* THÔNG TIN HỌC SINH */}
                      <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-black uppercase text-emerald-900 mb-1">
                            Họ và tên học sinh:
                          </label>
                          <input
                            type="text"
                            value={stage6SelfStudentName}
                            onChange={(e) => setStage6SelfStudentName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 font-bold text-indigo-950 outline-none focus:border-emerald-500"
                            placeholder="Nhập họ và tên..."
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase text-emerald-900 mb-1">
                            Lớp:
                          </label>
                          <input
                            type="text"
                            value={stage6SelfClass}
                            onChange={(e) => setStage6SelfClass(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 font-bold text-indigo-950 outline-none focus:border-emerald-500"
                            placeholder="Ví dụ: 9A"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase text-emerald-900 mb-1">
                            Nhóm thực hiện:
                          </label>
                          <input
                            type="text"
                            value={stage6SelfGroup}
                            onChange={(e) => setStage6SelfGroup(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 font-bold text-indigo-950 outline-none focus:border-emerald-500"
                            placeholder="Ví dụ: Nhóm 1"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase text-emerald-900 mb-1">
                            Ngày tự đánh giá:
                          </label>
                          <input
                            type="text"
                            value={stage6SelfDate}
                            onChange={(e) => setStage6SelfDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 font-bold text-indigo-950 outline-none focus:border-emerald-500"
                            placeholder="dd/mm/yyyy"
                          />
                        </div>
                      </div>

                      {/* BẢNG KIỂM 5 MỨC ĐỘ — TỰ ĐÁNH GIÁ */}
                      <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-linear-to-r from-emerald-900 to-teal-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-black">
                          <span>✅ BẢNG KIỂM 5 MỨC ĐỘ — TỰ ĐÁNH GIÁ CÁ NHÂN</span>
                          <span className="text-emerald-200 font-bold text-[11px]">
                            1: Cần cố gắng • 2: Đạt • 3: Khá • 4: Tốt • 5: Xuất sắc
                          </span>
                        </div>
                        <div className="divide-y divide-emerald-100">
                          {STAGE6_SELF_RUBRIC_CRITERIA.map((criterion, idx) => {
                            const curScore = stage6SelfScores[criterion.id];
                            const levelNames = ['Cần cố gắng', 'Đạt', 'Khá', 'Tốt', 'Xuất sắc'];
                            return (
                              <div
                                key={criterion.id}
                                className={`p-3.5 sm:p-4 flex flex-col gap-2.5 ${idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'}`}
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div className="flex-1 min-w-56">
                                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                                        {criterion.badge}
                                      </span>
                                    </div>
                                    <div className="font-extrabold text-indigo-950 text-xs sm:text-sm leading-snug">
                                      {criterion.code}. {criterion.title}
                                    </div>
                                  </div>
                                  <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-center shrink-0">
                                    <span className="text-xs font-black text-emerald-700">
                                      {curScore !== undefined
                                        ? `Mức ${criterion.levels.find((l) => l.points === curScore)?.level ?? '-'}`
                                        : 'Chưa chọn'}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                  {criterion.levels.map((lv, lvIdx) => {
                                    const isSelected = curScore === lv.points;
                                    return (
                                      <button
                                        key={lv.level}
                                        type="button"
                                        onClick={() =>
                                          setStage6SelfScores((prev) => ({
                                            ...prev,
                                            [criterion.id]: lv.points,
                                          }))
                                        }
                                        className={`px-2 py-2.5 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                                          isSelected
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-xs scale-[1.01]'
                                            : 'bg-slate-50/80 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-700'
                                        }`}
                                      >
                                        <span className="text-sm font-black">{lv.level}</span>
                                        <span className="text-[10px] font-bold opacity-85 hidden sm:inline">
                                          {levelNames[lvIdx] ?? ''}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="bg-emerald-950 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-t-2 border-emerald-800">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs md:text-sm font-black uppercase text-amber-300">
                              TỔNG ĐIỂM TỰ ĐÁNH GIÁ CỦA CÁ NHÂN (100%):
                            </span>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-black ${rankInfo.colorClass}`}>
                              {rankInfo.badge}
                            </span>
                          </div>
                          <div className="px-4 py-1.5 rounded-xl bg-orange-600 text-center">
                            <span className="text-lg md:text-xl font-black text-white">{totalSelfScore}</span>
                            <span className="text-[10px] font-bold text-amber-100 ml-1">/ 10.0 điểm</span>
                          </div>
                        </div>
                      </div>

                      {/* PHẦN II: GÓC TỰ PHẢN CHIẾU CỦA EM SAU DỰ ÁN (REFLECTION) */}
                      <div className="bg-white rounded-2xl p-4 md:p-5 border border-emerald-200 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
                          <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-base">
                            💡
                          </span>
                          <div>
                            <h4 className="text-xs md:text-sm font-black text-emerald-950 uppercase">
                              PHẦN II. GÓC TỰ PHẢN CHIẾU CỦA EM SAU DỰ ÁN (REFLECTION)
                            </h4>
                            <p className="text-[11px] text-slate-600 font-medium">
                              Hãy dành vài phút nhìn lại trải nghiệm học tập và chia sẻ suy nghĩ chân thật của mình:
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 flex flex-col gap-1.5">
                            <label className="text-xs font-black text-emerald-900 leading-snug">
                              1. Đóng góp cụ thể nhất của em cho nhóm (ghi rõ nội dung đã đăng trên Padlet hoặc công đoạn đã làm):
                            </label>
                            <textarea
                              rows={3}
                              value={stage6SelfReflections.contribution}
                              onChange={(e) =>
                                setStage6SelfReflections((prev) => ({ ...prev, contribution: e.target.value }))
                              }
                              className="w-full p-2.5 rounded-xl bg-white border border-emerald-200 text-xs text-indigo-950 font-medium outline-none focus:border-emerald-500 leading-relaxed"
                              placeholder="Ghi rõ công việc em đã hoàn thành..."
                            />
                          </div>

                          <div className="bg-teal-50/50 p-3.5 rounded-2xl border border-teal-100 flex flex-col gap-1.5">
                            <label className="text-xs font-black text-teal-900 leading-snug">
                              2. Điều tâm đắc nhất em học được từ chủ đề Tinh bột &amp; Cellulose và thông điệp Hóa học Xanh:
                            </label>
                            <textarea
                              rows={3}
                              value={stage6SelfReflections.favorite}
                              onChange={(e) =>
                                setStage6SelfReflections((prev) => ({ ...prev, favorite: e.target.value }))
                              }
                              className="w-full p-2.5 rounded-xl bg-white border border-teal-200 text-xs text-indigo-950 font-medium outline-none focus:border-teal-500 leading-relaxed"
                              placeholder="Bài học khoa học hoặc thông điệp môi trường tâm đắc nhất..."
                            />
                          </div>

                          <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100 flex flex-col gap-1.5">
                            <label className="text-xs font-black text-amber-900 leading-snug">
                              3. Khó khăn em gặp phải trong quá trình thực hiện và cách em / nhóm đã khắc phục:
                            </label>
                            <textarea
                              rows={3}
                              value={stage6SelfReflections.difficulties}
                              onChange={(e) =>
                                setStage6SelfReflections((prev) => ({ ...prev, difficulties: e.target.value }))
                              }
                              className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-xs text-indigo-950 font-medium outline-none focus:border-amber-500 leading-relaxed"
                              placeholder="Trở ngại kỹ thuật, phối hợp và giải pháp tháo gỡ..."
                            />
                          </div>

                          <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100 flex flex-col gap-1.5">
                            <label className="text-xs font-black text-sky-900 leading-snug">
                              4. Nếu tiếp tục cải tiến sản phẩm ở dự án sau, em muốn nâng cấp điểm gì?
                            </label>
                            <textarea
                              rows={3}
                              value={stage6SelfReflections.improvement}
                              onChange={(e) =>
                                setStage6SelfReflections((prev) => ({ ...prev, improvement: e.target.value }))
                              }
                              className="w-full p-2.5 rounded-xl bg-white border border-sky-200 text-xs text-indigo-950 font-medium outline-none focus:border-sky-500 leading-relaxed"
                              placeholder="Ý tưởng nâng cấp độ bền, màu sắc, công năng sản phẩm..."
                            />
                          </div>
                        </div>

                        {/* CHỮ KÝ HỌC SINH & NÚT NỘP BÀI */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-600">Học sinh ký tên:</span>
                            <input
                              type="text"
                              value={stage6SelfSignature}
                              onChange={(e) => setStage6SelfSignature(e.target.value)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50/60 border border-emerald-200 font-extrabold text-xs text-emerald-950 outline-none"
                              placeholder="Ghi tên xác nhận..."
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                import('../exportFormDocx').then((m) =>
                                  m.exportStage6SelfToWord({
                                    studentName: stage6SelfStudentName,
                                    className: stage6SelfClass,
                                    groupName: stage6SelfGroup,
                                    dateStr: stage6SelfDate,
                                    scores: stage6SelfScores,
                                    reflections: stage6SelfReflections,
                                    signature: stage6SelfSignature,
                                  })
                                );
                              }}
                              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Xuất Word</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Xuất PDF / In</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void onSubmitStage6Self();
                              }}
                              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{stage6SelfSubmitted ? '✓ Đã nộp phiếu Tự đánh giá' : 'Nộp phiếu Tự đánh giá cá nhân'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ============================================================
                    TAB 2: NHÓM TRƯỞNG ĐÁNH GIÁ THÀNH VIÊN
                   ============================================================ */}
                {stage6AssessTab === 'leader' && (() => {
                  const currentMember =
                    stage6Members.find((m) => m.id === stage6SelectedMemberId) || stage6Members[0];
                  const currentTotal = Math.round(
                    STAGE6_LEADER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (currentMember.scores[c.id] ?? 0), 0) * 10
                  ) / 10;
                  const currentRank = getStage6RankInfo(currentTotal);

                  const teamAvg =
                    Math.round(
                      (stage6Members.reduce(
                        (sum, m) =>
                          sum +
                          STAGE6_LEADER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (m.scores[c.id] ?? 0), 0),
                        0
                      ) /
                        stage6Members.length) *
                        10
                    ) / 10;

                  return (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                      {/* BANNER NHÓM TRƯỞNG */}
                      <div className="bg-linear-to-r from-amber-950 via-orange-950 to-slate-900 text-white p-4 rounded-2xl border border-amber-600/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase">
                              👑 NHÓM TRƯỞNG ĐÁNH GIÁ THÀNH VIÊN
                            </span>
                            <span className="text-xs font-bold text-amber-200">
                              Nhóm trưởng: <strong>{stage6LeaderName}</strong> • {stage6LeaderClass} • {stage6LeaderGroup}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            Nhóm trưởng đối chiếu 4 tiêu chí rubric bên dưới để chấm điểm công tâm cho từng thành viên trong nhóm.
                          </p>
                        </div>
                        <div className="text-right shrink-0 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
                          <div className="text-[11px] text-amber-200 font-bold">Điểm TB cả nhóm:</div>
                          <div className="text-xl font-black text-white">{teamAvg} / 10đ</div>
                        </div>
                      </div>

                      {/* DANH SÁCH THÀNH VIÊN (6 THÀNH VIÊN ĐÃ ĐƯỢC CẤU HÌNH TỪ ẢNH) */}
                      <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-black text-indigo-950 uppercase flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span>Chọn thành viên để chấm điểm:</span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {stage6Members.length} thành viên
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {stage6Members.map((member) => {
                            const isSelected = member.id === currentMember.id;
                            const mTotal = Math.round(
                              STAGE6_LEADER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (member.scores[c.id] ?? 0), 0) * 10
                            ) / 10;
                            const mRank = getStage6RankInfo(mTotal);

                            return (
                              <button
                                key={member.id}
                                type="button"
                                onClick={() => setStage6SelectedMemberId(member.id)}
                                className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                                  isSelected
                                    ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-400/30'
                                    : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 hover:bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                    isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {member.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-black text-indigo-950 truncate">
                                      {member.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate font-medium">
                                      {member.role}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-xs font-black text-amber-700">{mTotal}đ</div>
                                  <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${mRank.colorClass}`}>
                                    {mRank.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* CHI TIẾT CHẤM ĐIỂM CHO THÀNH VIÊN ĐANG CHỌN */}
                      <div className="bg-white rounded-2xl p-4 md:p-5 border border-amber-200 shadow-sm flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
                              {currentMember.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-black uppercase text-amber-700">Đang chấm điểm cho thành viên:</div>
                              <h3 className="text-sm md:text-base font-extrabold text-indigo-950">
                                {currentMember.name} • <span className="text-slate-500 font-medium text-xs">{currentMember.role}</span>
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${currentRank.colorClass}`}>
                              {currentRank.badge}
                            </span>
                            <div className="px-3 py-1 rounded-xl bg-orange-600 text-white font-black text-sm">
                              {currentTotal} / 10đ
                            </div>
                          </div>
                        </div>

                        {/* BẢNG KIỂM 5 MỨC ĐỘ — NHÓM TRƯỞNG ĐÁNH GIÁ THÀNH VIÊN */}
                        <div className="rounded-2xl border-2 border-amber-200 bg-white shadow-2xs overflow-hidden">
                          <div className="bg-linear-to-r from-amber-900 to-orange-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-black">
                            <span>✅ BẢNG KIỂM 5 MỨC ĐỘ — ĐÁNH GIÁ ĐÓNG GÓP THÀNH VIÊN</span>
                            <span className="text-amber-200 font-bold text-[11px]">
                              1: Cần cố gắng • 2: Đạt • 3: Khá • 4: Tốt • 5: Xuất sắc
                            </span>
                          </div>
                          <div className="divide-y divide-amber-100">
                            {STAGE6_LEADER_RUBRIC_CRITERIA.map((criterion, idx) => {
                              const curScore = currentMember.scores[criterion.id];
                              const levelNames = ['Cần cố gắng', 'Đạt', 'Khá', 'Tốt', 'Xuất sắc'];
                              return (
                                <div
                                  key={criterion.id}
                                  className={`p-3.5 sm:p-4 flex flex-col gap-2.5 ${idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}`}
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div className="flex-1 min-w-56">
                                      <div className="font-extrabold text-indigo-950 text-xs sm:text-sm leading-snug">
                                        {criterion.code}. {criterion.title}
                                      </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-center shrink-0">
                                      <span className="text-xs font-black text-amber-700">
                                        {curScore !== undefined
                                          ? `Mức ${criterion.levels.find((l) => l.points === curScore)?.level ?? '-'}`
                                          : 'Chưa chọn'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-5 gap-2">
                                    {criterion.levels.map((lv, lvIdx) => {
                                      const isSelected = curScore === lv.points;
                                      return (
                                        <button
                                          key={lv.level}
                                          type="button"
                                          onClick={() => {
                                            setStage6Members((prev) =>
                                              prev.map((m) =>
                                                m.id === currentMember.id
                                                  ? { ...m, scores: { ...m.scores, [criterion.id]: lv.points } }
                                                  : m
                                              )
                                            );
                                          }}
                                          className={`px-2 py-2.5 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                                            isSelected
                                              ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-xs scale-[1.01]'
                                              : 'bg-slate-50/80 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-700'
                                          }`}
                                        >
                                          <span className="text-sm font-black">{lv.level}</span>
                                          <span className="text-[10px] font-bold opacity-85 hidden sm:inline">
                                            {levelNames[lvIdx] ?? ''}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* NHẬN XÉT CỦA NHÓM TRƯỞNG CHO THÀNH VIÊN NÀY */}
                        <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 flex flex-col gap-1.5">
                          <label className="text-xs font-black text-amber-950">
                            💬 Nhận xét của Nhóm trưởng dành cho bạn {currentMember.name}:
                          </label>
                          <textarea
                            rows={2}
                            value={currentMember.comment}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStage6Members((prev) =>
                                prev.map((m) => (m.id === currentMember.id ? { ...m, comment: val } : m))
                              );
                            }}
                            className="w-full p-2.5 rounded-xl bg-white border border-amber-300 text-xs text-indigo-950 font-medium outline-none focus:border-amber-500 leading-relaxed"
                            placeholder="Ghi nhận xét ưu điểm, tinh thần hợp tác và sự tiến bộ của bạn..."
                          />
                        </div>
                      </div>

                      {/* BẢNG TỔNG HỢP ĐIỂM TOÀN BỘ NHÓM & NÚT NỘP */}
                      <div className="bg-white rounded-2xl p-4 md:p-5 border border-amber-200 shadow-sm flex flex-col gap-3">
                        <h4 className="text-xs md:text-sm font-black text-indigo-950 uppercase flex items-center gap-1.5">
                          <span>📋 BẢNG TỔNG HỢP ĐIỂM CỦA CÁC THÀNH VIÊN TRONG NHÓM</span>
                        </h4>

                        <div className="overflow-x-auto rounded-xl border border-indigo-100">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-indigo-950 text-white font-black text-[11px]">
                              <tr>
                                <th className="p-2.5 text-center w-10">STT</th>
                                <th className="p-2.5">Họ và tên thành viên</th>
                                <th className="p-2.5">Vai trò phụ trách</th>
                                <th className="p-2.5 text-center">Padlet (2.5đ)</th>
                                <th className="p-2.5 text-center">Chế tạo (3.5đ)</th>
                                <th className="p-2.5 text-center">Kỷ luật (2.0đ)</th>
                                <th className="p-2.5 text-center">Poster (2.0đ)</th>
                                <th className="p-2.5 text-center font-bold text-amber-300">Tổng điểm</th>
                                <th className="p-2.5 text-center">Xếp loại</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-100">
                              {stage6Members.map((m, idx) => {
                                const tot = Math.round(
                                  STAGE6_LEADER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (m.scores[c.id] ?? 0), 0) * 10
                                ) / 10;
                                const rk = getStage6RankInfo(tot);
                                return (
                                  <tr key={m.id} className="hover:bg-amber-50/40">
                                    <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                                    <td className="p-2.5 font-black text-indigo-950">{m.name}</td>
                                    <td className="p-2.5 text-slate-600">{m.role}</td>
                                    <td className="p-2.5 text-center font-bold text-indigo-900">{m.scores.s6_ldr_padlet ?? 0}</td>
                                    <td className="p-2.5 text-center font-bold text-indigo-900">{m.scores.s6_ldr_task ?? 0}</td>
                                    <td className="p-2.5 text-center font-bold text-indigo-900">{m.scores.s6_ldr_coop ?? 0}</td>
                                    <td className="p-2.5 text-center font-bold text-indigo-900">{m.scores.s6_ldr_poster ?? 0}</td>
                                    <td className="p-2.5 text-center font-black text-amber-700 bg-amber-50/50">{tot}đ</td>
                                    <td className="p-2.5 text-center">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rk.colorClass}`}>
                                        {rk.label}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="text-xs text-slate-600">
                            Nhóm trưởng xác nhận: <strong>{stage6LeaderName}</strong> ({stage6LeaderGroup})
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                import('../exportFormDocx').then((m) =>
                                  m.exportStage6LeaderToWord({
                                    leaderName: stage6LeaderName,
                                    className: stage6LeaderClass,
                                    groupName: stage6LeaderGroup,
                                    members: stage6Members,
                                  })
                                );
                              }}
                              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Xuất Word</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Xuất PDF / In</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void onSubmitStage6Leader();
                              }}
                              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{stage6LeaderSubmitted ? '✓ Đã nộp bảng đánh giá Nhóm trưởng' : 'Nộp bảng đánh giá của Nhóm trưởng'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ============================================================
                    TAB 3: GIÁO VIÊN ĐÁNH GIÁ NHÓM (HUIT - PGS.TS LÊ VĂN HẢO)
                   ============================================================ */}
                {stage6AssessTab === 'teacher' && (() => {
                  const teacherTotal = Math.round(
                    STAGE6_TEACHER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (stage6TeacherScores[c.id] ?? 0), 0) * 10
                  ) / 10;
                  const teacherRank = getStage6RankInfo(teacherTotal);
                  const parsedManual = manualProductScore.trim() === '' ? null : Number(manualProductScore);
                  const effectiveProductScore =
                    parsedManual !== null && !Number.isNaN(parsedManual)
                      ? Math.max(0, Math.min(10, Math.round(parsedManual * 10) / 10))
                      : stage4ProductAnsweredCount > 0
                        ? Math.round(stage4ProductScore * 10) / 10
                        : null;
                  const groupWeightPct = 100 - productWeightPct;
                  const projectFinalScore =
                    effectiveProductScore !== null
                      ? Math.round(((effectiveProductScore * productWeightPct + teacherTotal * groupWeightPct) / 100) * 10) / 10
                      : null;
                  const projectFinalRank = projectFinalScore !== null ? getStage6RankInfo(projectFinalScore) : null;

                  return (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                      {/* HEADER CHÍNH THỨC TRƯỜNG THCS NGÔ CHÍ QUỐC */}
                      <div className="bg-linear-to-r from-indigo-950 via-purple-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-600/50 shadow-md">
                        <div className="text-center flex flex-col gap-1 pb-3 border-b border-indigo-800/60">
                          <h3 className="text-xs md:text-sm font-black uppercase text-amber-300 tracking-wider">
                            PHIẾU ĐÁNH GIÁ QUÁ TRÌNH NHÓM &amp; BÁO CÁO DỰ ÁN STEAM (DÀNH CHO GIÁO VIÊN)
                          </h3>
                          <h2 className="text-sm md:text-base font-black text-white uppercase">
                            DỰ ÁN: &ldquo;BẮT ĐẦU TỪ SỰ KẾT THÚC&rdquo; — CHỦ ĐỀ: TINH BỘT &amp; CELLULOSE (KHTN 9)
                          </h2>
                          <div className="text-[11px] text-slate-300 italic">
                            Thang đo Analytical Rubric 5 mức • Thang điểm 10 (100%) | Tách riêng với Rubric chấm Sản phẩm STEAM ở Chặng 4 (không trùng tiêu chí)
                          </div>
                          <div className="text-[10px] text-indigo-300 font-bold">
                            5 Tiêu chí đánh giá nhóm &amp; báo cáo: Hợp tác Padlet (20%) – Quy trình &amp; An toàn (20%) – Poster khoa học (20%) – Video tổng kết (20%) – Thuyết trình &amp; Phản biện (20%)
                          </div>
                        </div>

                        {/* 4 Ô THÔNG TIN HÀNH CHÍNH */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 text-xs">
                          <div>
                            <span className="text-[11px] text-indigo-300 font-bold block mb-0.5">Đơn vị:</span>
                            <span className="font-extrabold text-white">Trường TH - THCS Ngô Chí Quốc — Tổ KHTN</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-indigo-300 font-bold block mb-0.5">Lớp / Nhóm được đánh giá:</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={stage6TeacherClass}
                                onChange={(e) => setStage6TeacherClass(e.target.value)}
                                className="w-14 px-2 py-1 rounded bg-white/10 border border-white/20 text-white font-black text-xs text-center"
                              />
                              <span>/</span>
                              <input
                                type="text"
                                value={stage6TeacherGroup}
                                onChange={(e) => setStage6TeacherGroup(e.target.value)}
                                className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white font-black text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] text-indigo-300 font-bold block mb-0.5">Tên sản phẩm dự án:</span>
                            <input
                              type="text"
                              value={stage6TeacherProduct}
                              onChange={(e) => setStage6TeacherProduct(e.target.value)}
                              className="w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white font-black text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] text-indigo-300 font-bold block mb-0.5">Giáo viên đánh giá:</span>
                            <input
                              type="text"
                              value={stage6TeacherName}
                              onChange={(e) => setStage6TeacherName(e.target.value)}
                              className="w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white font-black text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* BẢNG RUBRIC 7 TIÊU CHÍ CHUẨN PGS.TS LÊ VĂN HẢO */}
                      <div className="overflow-x-auto rounded-2xl border border-indigo-200 bg-white shadow-sm">
                        <table className="w-full min-w-235 text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-linear-to-r from-indigo-900 to-purple-900 text-white font-black text-[11px]">
                              <th className="p-3 w-48 border-r border-indigo-700/60 uppercase">
                                Tiêu chí đánh giá<br />
                                <span className="text-[10px] font-normal text-indigo-200">(Trọng số • Điểm tối đa)</span>
                              </th>
                              <th className="p-3 w-37 border-r border-indigo-700/60 text-center bg-rose-900/60">
                                MỨC 1 (20%)<br />
                                <span className="text-[10px] font-bold text-rose-200">CẦN CỐ GẮNG</span>
                              </th>
                              <th className="p-3 w-37 border-r border-indigo-700/60 text-center bg-amber-900/60">
                                MỨC 2 (40%)<br />
                                <span className="text-[10px] font-bold text-amber-200">ĐẠT</span>
                              </th>
                              <th className="p-3 w-37 border-r border-indigo-700/60 text-center bg-sky-900/60">
                                MỨC 3 (60%)<br />
                                <span className="text-[10px] font-bold text-sky-200">KHÁ</span>
                              </th>
                              <th className="p-3 w-37 border-r border-indigo-700/60 text-center bg-indigo-900/60">
                                MỨC 4 (80%)<br />
                                <span className="text-[10px] font-bold text-indigo-200">TỐT</span>
                              </th>
                              <th className="p-3 w-37 border-r border-indigo-700/60 text-center bg-emerald-800/80">
                                MỨC 5 (100%)<br />
                                <span className="text-[10px] font-bold text-emerald-200">XUẤT SẮC</span>
                              </th>
                              <th className="p-3 w-22 text-center bg-orange-600 text-white uppercase">
                                Ghi điểm
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-100">
                            {STAGE6_TEACHER_RUBRIC_CRITERIA.map((criterion, idx) => {
                              const curScore = stage6TeacherScores[criterion.id];
                              return (
                                <tr key={criterion.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                  <td className="p-3 border-r border-indigo-100 align-top">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 mb-1">
                                      {criterion.stageTag}
                                    </span>
                                    <div className="font-extrabold text-indigo-950 text-xs leading-tight mb-1">
                                      {criterion.title}
                                    </div>
                                    <div className="text-[11px] font-bold text-indigo-700">
                                      {criterion.weightText}
                                    </div>
                                  </td>

                                  {criterion.levels.map((lv) => {
                                    const isSelected = curScore === lv.points;
                                    return (
                                      <td
                                        key={lv.level}
                                        onClick={() =>
                                          setStage6TeacherScores((prev) => ({
                                            ...prev,
                                            [criterion.id]: lv.points,
                                          }))
                                        }
                                        className={`p-2.5 border-r border-indigo-100 align-top cursor-pointer transition-all text-[11px] leading-relaxed relative ${
                                          isSelected
                                            ? 'bg-indigo-100/90 font-bold text-indigo-950 ring-2 ring-indigo-500 ring-inset shadow-xs'
                                            : 'hover:bg-indigo-50/50 text-slate-700'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${
                                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                                          }`}>
                                            {lv.points} điểm
                                          </span>
                                          {isSelected && (
                                            <span className="text-[10px] font-black text-indigo-700">✓ Chọn</span>
                                          )}
                                        </div>
                                        <div>{lv.text}</div>
                                      </td>
                                    );
                                  })}

                                  <td className="p-3 text-center align-middle bg-indigo-50/30">
                                    <div className="text-base font-black text-indigo-700">
                                      {curScore !== undefined ? curScore : '...'}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-500">
                                      / {criterion.maxPoints}đ
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="bg-indigo-950 text-white border-t-2 border-indigo-800">
                              <td colSpan={6} className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-xs md:text-sm font-black uppercase text-amber-300">
                                    TỔNG ĐIỂM ĐÁNH GIÁ DỰ ÁN CỦA GIÁO VIÊN (100%):
                                  </span>
                                  <span className={`px-3 py-0.5 rounded-full text-xs font-black ${teacherRank.colorClass}`}>
                                    {teacherRank.badge}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 bg-orange-600 text-center">
                                <div className="text-lg md:text-xl font-black text-white">{teacherTotal}</div>
                                <div className="text-[10px] font-bold text-amber-100">/ 10.0 điểm</div>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* KHỐI TỔNG ĐIỂM DỰ ÁN STEAM (GỘP RUBRIC SẢN PHẨM CHẶNG 4 + RUBRIC NHÓM CHẶNG 6) */}
                      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-2xl p-4 md:p-5 border-2 border-emerald-200 shadow-xs flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-2.5">
                          <div>
                            <h4 className="text-xs md:text-sm font-black text-emerald-950 uppercase">
                              🏆 TỔNG ĐIỂM DỰ ÁN STEAM (GỘP 2 RUBRIC GIÁO VIÊN)
                            </h4>
                            <p className="text-xs text-emerald-900/80 font-medium">
                              Tự động lấy điểm Sản phẩm từ Chặng 4 (hoặc nhập nhanh) kết hợp điểm Quá trình &amp; Báo cáo Chặng 6.
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { pct: 50, label: '50% SP / 50% Nhóm' },
                              { pct: 60, label: '60% SP / 40% Nhóm' },
                              { pct: 40, label: '40% SP / 60% Nhóm' },
                            ].map((opt) => (
                              <button
                                key={opt.pct}
                                type="button"
                                onClick={() => setProductWeightPct(opt.pct)}
                                className={`px-2.5 py-1 rounded-full text-xs font-black cursor-pointer transition-colors ${
                                  productWeightPct === opt.pct
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                          <div className="bg-white rounded-xl p-3 border border-emerald-200 flex flex-col justify-between gap-1.5">
                            <span className="text-xs font-black text-emerald-900">
                              1. Điểm Sản phẩm (Chặng 4 • {productWeightPct}%)
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                max={10}
                                step={0.1}
                                value={
                                  manualProductScore !== ''
                                    ? manualProductScore
                                    : stage4ProductAnsweredCount > 0
                                      ? String(Math.round(stage4ProductScore * 10) / 10)
                                      : ''
                                }
                                onChange={(e) => setManualProductScore(e.target.value)}
                                placeholder="VD: 9.0"
                                className="w-24 px-2.5 py-1.5 rounded-lg border-2 border-emerald-300 bg-emerald-50/40 text-sm font-black text-emerald-950 outline-none focus:border-emerald-500"
                              />
                              <span className="text-xs font-bold text-slate-500">/ 10.0đ</span>
                            </div>
                            <span className="text-xs text-slate-600">
                              {stage4ProductAnsweredCount > 0 && manualProductScore === ''
                                ? `Đã đồng bộ từ Chặng 4 (${stage4ProductAnsweredCount}/4 tiêu chí)`
                                : 'Chấm ở Chặng 4 hoặc nhập trực tiếp tại đây'}
                            </span>
                          </div>

                          <div className="bg-white rounded-xl p-3 border border-indigo-200 flex flex-col justify-between gap-1.5">
                            <span className="text-xs font-black text-indigo-900">
                              2. Quá trình &amp; Báo cáo (Chặng 6 • {groupWeightPct}%)
                            </span>
                            <div className="text-2xl font-black text-indigo-700">
                              {teacherTotal} <span className="text-xs font-bold text-slate-500">/ 10.0đ</span>
                            </div>
                            <span className="text-xs text-slate-600">Tự động từ 5 tiêu chí bảng trên</span>
                          </div>

                          <div className="bg-indigo-950 text-white rounded-xl p-3 border border-indigo-800 flex flex-col justify-between gap-1.5">
                            <span className="text-xs font-black uppercase text-amber-300">
                              Điểm Tổng kết Dự án (100%)
                            </span>
                            {projectFinalScore !== null && projectFinalRank ? (
                              <>
                                <div className="text-2xl font-black text-white">
                                  {projectFinalScore} <span className="text-xs font-bold text-amber-200">/ 10.0đ</span>
                                </div>
                                <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-black ${projectFinalRank.colorClass}`}>
                                  {projectFinalRank.badge}
                                </span>
                              </>
                            ) : (
                              <div className="text-xs text-indigo-200 font-medium leading-relaxed">
                                Nhập điểm Sản phẩm Chặng 4 (ô bên trái) để hệ thống tự tính điểm tổng kết dự án.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* KHUNG NHẬN XÉT CỦA GIÁO VIÊN & PHÂN HÓA ĐIỂM THÀNH VIÊN */}
                      <div className="bg-white rounded-2xl p-4 md:p-5 border border-indigo-200 shadow-sm flex flex-col gap-4">
                        <h4 className="text-xs md:text-sm font-black text-indigo-950 uppercase border-b border-indigo-100 pb-2 flex items-center gap-1.5">
                          <span>📝 NHẬN XÉT CỦA GIÁO VIÊN &amp; PHÂN HÓA ĐIỂM THÀNH VIÊN</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-7 flex flex-col gap-1.5">
                            <label className="text-xs font-black text-indigo-900">
                              Điểm mạnh nổi bật &amp; Góp ý cải tiến cho nhóm:
                            </label>
                            <textarea
                              rows={4}
                              value={stage6TeacherStrengths}
                              onChange={(e) => setStage6TeacherStrengths(e.target.value)}
                              className="w-full p-3 rounded-xl bg-indigo-50/30 border border-indigo-200 text-xs text-indigo-950 font-medium outline-none focus:border-indigo-500 leading-relaxed"
                              placeholder="Nhận xét chi tiết về sản phẩm, Poster, video và sự tương tác..."
                            />
                          </div>

                          <div className="md:col-span-5 flex flex-col gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                            <div>
                              <span className="text-[11px] font-black uppercase text-indigo-950 block mb-1">
                                Quy đổi mức đạt chuẩn:
                              </span>
                              <div className="flex flex-wrap gap-2 text-xs font-bold">
                                <span className={`px-2 py-1 rounded-lg border ${
                                  teacherTotal >= 9.0 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                                }`}>
                                  ☑ Xuất sắc (9.0–10)
                                </span>
                                <span className={`px-2 py-1 rounded-lg border ${
                                  teacherTotal >= 8.0 && teacherTotal < 9.0 ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                                }`}>
                                  ☑ Tốt (8.0–8.9)
                                </span>
                                <span className={`px-2 py-1 rounded-lg border ${
                                  teacherTotal >= 6.5 && teacherTotal < 8.0 ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'
                                }`}>
                                  ☑ Khá (6.5–7.9)
                                </span>
                                <span className={`px-2 py-1 rounded-lg border ${
                                  teacherTotal >= 5.0 && teacherTotal < 6.5 ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200'
                                }`}>
                                  ☑ Đạt (5.0–6.4)
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] font-black uppercase text-indigo-950 block mb-1">
                                Lưu ý điều chỉnh điểm cá nhân (nếu có):
                              </label>
                              <input
                                type="text"
                                value={stage6TeacherIndividualAdjustments}
                                onChange={(e) => setStage6TeacherIndividualAdjustments(e.target.value)}
                                className="w-full p-2 rounded-xl bg-white border border-slate-300 text-xs text-indigo-950 font-medium outline-none focus:border-indigo-500"
                                placeholder="Căn cứ đóng góp trên Padlet, video và thực hành..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-indigo-100">
                          <div className="text-xs text-slate-600">
                            Giáo viên ký nhận: <strong>{stage6TeacherName}</strong> (Tổ KHTN — Trường TH - THCS Ngô Chí Quốc)
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                import('../exportFormDocx').then((m) =>
                                  m.exportStage6TeacherToWord({
                                    teacherName: stage6TeacherName,
                                    className: stage6TeacherClass,
                                    groupName: stage6TeacherGroup,
                                    productName: stage6TeacherProduct,
                                    scores: stage6TeacherScores,
                                    strengths: stage6TeacherStrengths,
                                    individualAdjustments: stage6TeacherIndividualAdjustments,
                                    productScore: effectiveProductScore ?? undefined,
                                    productWeightPct: effectiveProductScore !== null ? productWeightPct : undefined,
                                    projectFinalScore: projectFinalScore ?? undefined,
                                  })
                                );
                              }}
                              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Xuất Word</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Xuất PDF / In</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void onSubmitStage6Teacher({
                                  productScore: effectiveProductScore ?? undefined,
                                  productWeightPct: effectiveProductScore !== null ? productWeightPct : undefined,
                                  projectFinalScore: projectFinalScore ?? undefined,
                                });
                              }}
                              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{stage6TeacherSubmitted ? '✓ Đã lưu phiếu Giáo viên đánh giá' : 'Nộp phiếu Giáo viên đánh giá'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </LockedTaskBox>

            {/* ============================================================
                CHẶNG 6 • Ô 6.3: VIDEO TỔNG KẾT DỰ ÁN ("BẮT ĐẦU TỪ SỰ KẾT THÚC" - 9A15)
               ============================================================ */}
            <LockedTaskBox
              taskId="task-s6-video"
              badgeText="Chặng 6 • Ô 6.3"
              title='6.3. Video tổng kết dự án: "Bắt đầu từ sự kết thúc" - 9A15'
              emoji="🎬"
              isUnlocked={unlockedTaskIds.has('task-s6-video')}
              isCompleted={stage6SummaryVideoConfirmed}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                    🎬
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-black text-indigo-950">
                      Video tổng kết dự án &ldquo;Bắt đầu từ sự kết thúc&rdquo; - 9A15 (Google Drive)
                    </div>
                    <p className="text-[11px] font-medium text-indigo-900/75">
                      Xem lại hành trình thực hiện dự án STEAM Tinh bột &amp; Cellulose của tập thể lớp 9A15 trong thư mục Google Drive.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={STAGE6_SUMMARY_VIDEO_DRIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở Google Drive xem Video tổng kết</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setStage6SummaryVideoConfirmed(true);
                      confetti({ particleCount: 65, spread: 60, origin: { y: 0.65 } });
                    }}
                    className={`px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                      stage6SummaryVideoConfirmed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {stage6SummaryVideoConfirmed
                        ? '✓ Đã xem Video tổng kết'
                        : 'Xác nhận đã xem Video tổng kết'}
                    </span>
                  </button>
                </div>
              </div>
            </LockedTaskBox>
    </div>
  );
};
