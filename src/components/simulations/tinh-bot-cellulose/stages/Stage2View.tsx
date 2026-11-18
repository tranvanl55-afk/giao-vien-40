/* cSpell:disable */
import React from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  FlaskConical,
  HelpCircle,
  Lightbulb,
  Lock,
  Mail,
  Play,
  Presentation,
  Printer,
  Send,
  Unlock,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  type Stage2DragItem,
  HOTSPOT_APPLICATIONS,
  PROJECT_GUIDE_DOCX_URL,
  PROJECT_GUIDE_PDF_URL,
  PROJECT_GUIDE_WORD_VIEW_URL,
  STAGE2_DRAG_ITEMS,
  STAGE2_PART1_VIDEO_URL,
  STAGE2_PART2_HYDROLYSIS_QUIZ,
  STAGE2_PART2_IODINE_QUIZ,
  STAGE2_TEST_QUESTIONS,
  TEACHER_EMAIL,
  WORKSHEET_DOCX_URL,
  WORKSHEET_PDF_URL,
} from '../lessonData';
import { LockedTaskBox } from '../components/LockedTaskBox';

interface Stage2ViewProps {
  guideBanner: React.ReactNode;
  isTeacherMode: boolean;
  unlockedTaskIds: Set<string>;
  unlockTask: (id: string) => void;
  lockTask: (id: string) => void;
  isStage3Unlocked: boolean;
  onGoToStage3: () => void;
  jumpToStage2Section: (taskId?: string, domId?: string) => void;
  toggleSetItem: <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, item: T) => void;
  setShowNewWordsModal: React.Dispatch<React.SetStateAction<boolean>>;
  // Progress flags
  isPart1Done: boolean;
  isPart1DragComplete: boolean;
  isPart2Done: boolean;
  isPart2aDone: boolean;
  isPart2aQuizAllAnswered: boolean;
  isPart2bDone: boolean;
  isPart2bQuizAllAnswered: boolean;
  isPart3Done: boolean;
  isPart4Done: boolean;
  isPart5Done: boolean;
  // Worksheet & home items
  checkedHomeItems: Set<string>;
  setCheckedHomeItems: React.Dispatch<React.SetStateAction<Set<string>>>;
  worksheetDownloaded: boolean;
  setWorksheetDownloaded: React.Dispatch<React.SetStateAction<boolean>>;
  showWorksheetGuide: boolean;
  setShowWorksheetGuide: React.Dispatch<React.SetStateAction<boolean>>;
  showWorksheetPreview: boolean;
  setShowWorksheetPreview: React.Dispatch<React.SetStateAction<boolean>>;
  worksheetPreviewType: 'pdf' | 'doc';
  setWorksheetPreviewType: React.Dispatch<React.SetStateAction<'pdf' | 'doc'>>;
  handleDownloadWorksheetDoc: () => void;
  // Part 1
  video1Playing: boolean;
  setVideo1Playing: React.Dispatch<React.SetStateAction<boolean>>;
  video1Watched: boolean;
  setVideo1Watched: React.Dispatch<React.SetStateAction<boolean>>;
  shuffledDragItems: Stage2DragItem[];
  dragPlacements: Record<string, 'starch' | 'cellulose'>;
  setDragPlacements: React.Dispatch<React.SetStateAction<Record<string, 'starch' | 'cellulose'>>>;
  draggedPropId: string | null;
  setDraggedPropId: React.Dispatch<React.SetStateAction<string | null>>;
  dragOverZone: 'starch' | 'cellulose' | null;
  setDragOverZone: React.Dispatch<React.SetStateAction<'starch' | 'cellulose' | null>>;
  dragFeedback: { text: string; isCorrect: boolean } | null;
  setDragFeedback: React.Dispatch<React.SetStateAction<{ text: string; isCorrect: boolean } | null>>;
  handleAssignDragProp: (propId: string, zone: 'starch' | 'cellulose') => void;
  // Part 2a (Iodine)
  iodineVideoUrl: string;
  setIodineVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  showIodineVideoInput: boolean;
  setShowIodineVideoInput: React.Dispatch<React.SetStateAction<boolean>>;
  videoIodineWatched: boolean;
  setVideoIodineWatched: React.Dispatch<React.SetStateAction<boolean>>;
  iodineTubeState: 'initial' | 'blue';
  hasAddedStarch: boolean;
  hasAddedIodine: boolean;
  iodineLabAnimating: 'none' | 'dropping_starch' | 'dropping_iodine';
  testTubeTrackRef: React.RefObject<HTMLDivElement | null>;
  clampPositionPct: number;
  isDraggingClamp: boolean;
  setIsDraggingClamp: React.Dispatch<React.SetStateAction<boolean>>;
  isClampAtOneThird: boolean;
  updateClampPosition: (nextPct: number, snapAndFeedback?: boolean) => void;
  handleAddStarchToTube: () => void;
  handleAddIodineToTube: () => void;
  handleResetIodineLab: () => void;
  iodineBlank1: string;
  setIodineBlank1: React.Dispatch<React.SetStateAction<string>>;
  iodineBlank2: string;
  setIodineBlank2: React.Dispatch<React.SetStateAction<string>>;
  iodineBlanksChecked: boolean;
  setIodineBlanksChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isIodineBlank1Right: boolean;
  isIodineBlank2Right: boolean;
  isAllIodineBlanksRight: boolean;
  iodineQuizAnswers: Record<string, number>;
  setIodineQuizAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  iodineQuizSubmitted: boolean;
  setIodineQuizSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  // Part 2b (Hydrolysis)
  hydrolysisVideoUrl: string;
  setHydrolysisVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  showHydroVideoInput: boolean;
  setShowHydroVideoInput: React.Dispatch<React.SetStateAction<boolean>>;
  videoHydroWatched: boolean;
  setVideoHydroWatched: React.Dispatch<React.SetStateAction<boolean>>;
  hydrolysisDone: boolean;
  setHydrolysisDone: React.Dispatch<React.SetStateAction<boolean>>;
  hydroBlank1: string;
  setHydroBlank1: React.Dispatch<React.SetStateAction<string>>;
  hydroBlank2: string;
  setHydroBlank2: React.Dispatch<React.SetStateAction<string>>;
  hydroBlank3: string;
  setHydroBlank3: React.Dispatch<React.SetStateAction<string>>;
  hydroBlank4: string;
  setHydroBlank4: React.Dispatch<React.SetStateAction<string>>;
  hydroBlanksChecked: boolean;
  setHydroBlanksChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isHydroBlank1Right: boolean;
  isHydroBlank2Right: boolean;
  isHydroBlank3Right: boolean;
  isHydroBlank4Right: boolean;
  isAllHydroBlanksRight: boolean;
  hydroQuizAnswers: Record<string, number>;
  setHydroQuizAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  hydroQuizSubmitted: boolean;
  setHydroQuizSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  // Part 3 (Applications / Hotspots)
  appVideoUrl: string;
  setAppVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  showAppVideoInput: boolean;
  setShowAppVideoInput: React.Dispatch<React.SetStateAction<boolean>>;
  video3Watched: boolean;
  setVideo3Watched: React.Dispatch<React.SetStateAction<boolean>>;
  hotspotMode: 'starch' | 'cellulose';
  setHotspotMode: React.Dispatch<React.SetStateAction<'starch' | 'cellulose'>>;
  hotspotSelections: Record<string, string>;
  solvedHotspotIds: Set<string>;
  hotspotFeedback: { text: string; isCorrect: boolean } | null;
  handleToggleHotspotCell: (hsId: string) => void;
  handleRemoveHotspotSelection: (hsId: string) => void;
  handleCheckHotspots: () => void;
  handleResetHotspots: () => void;
  handleShowHotspotSolution: () => void;
  // Part 4 (Test)
  testStudentName: string;
  setTestStudentName: React.Dispatch<React.SetStateAction<string>>;
  testStudentClass: string;
  setTestStudentClass: React.Dispatch<React.SetStateAction<string>>;
  testStudentSchool: string;
  setTestStudentSchool: React.Dispatch<React.SetStateAction<string>>;
  testMcAnswers: Record<number, number>;
  setTestMcAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  testTfAnswers: Record<string, boolean>;
  setTestTfAnswers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  testFillAnswers: Record<string, string>;
  setTestFillAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  testMatchingAnswers: Record<string, string>;
  setTestMatchingAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isTestSubmitted: boolean;
  testScore: number;
  testFeedbackMessage: string | null;
  isSendingEmail: boolean;
  handleSendTestToTeacherEmail: () => Promise<void>;
  // Part 5 (Project Guide)
  showProjectGuidePreview: boolean;
  setShowProjectGuidePreview: React.Dispatch<React.SetStateAction<boolean>>;
  projectGuidePreviewType: 'pdf' | 'doc';
  setProjectGuidePreviewType: React.Dispatch<React.SetStateAction<'pdf' | 'doc'>>;
  markProjectGuideDownloaded: () => void;
}

export const Stage2View: React.FC<Stage2ViewProps> = ({
  guideBanner,
  isTeacherMode,
  unlockedTaskIds,
  unlockTask,
  lockTask,
  isStage3Unlocked,
  onGoToStage3,
  jumpToStage2Section,
  toggleSetItem,
  setShowNewWordsModal,
  isPart1Done,
  isPart1DragComplete,
  isPart2Done,
  isPart2aDone,
  isPart2aQuizAllAnswered,
  isPart2bDone,
  isPart2bQuizAllAnswered,
  isPart3Done,
  isPart4Done,
  isPart5Done,
  checkedHomeItems,
  setCheckedHomeItems,
  worksheetDownloaded,
  setWorksheetDownloaded,
  showWorksheetGuide,
  setShowWorksheetGuide,
  showWorksheetPreview,
  setShowWorksheetPreview,
  worksheetPreviewType,
  setWorksheetPreviewType,
  handleDownloadWorksheetDoc,
  video1Playing,
  setVideo1Playing,
  video1Watched,
  setVideo1Watched,
  shuffledDragItems,
  dragPlacements,
  setDragPlacements,
  draggedPropId,
  setDraggedPropId,
  dragOverZone,
  setDragOverZone,
  dragFeedback,
  setDragFeedback,
  handleAssignDragProp,
  iodineVideoUrl,
  setIodineVideoUrl,
  showIodineVideoInput,
  setShowIodineVideoInput,
  videoIodineWatched,
  setVideoIodineWatched,
  iodineTubeState,
  hasAddedStarch,
  hasAddedIodine,
  iodineLabAnimating,
  testTubeTrackRef,
  clampPositionPct,
  isDraggingClamp,
  setIsDraggingClamp,
  isClampAtOneThird,
  updateClampPosition,
  handleAddStarchToTube,
  handleAddIodineToTube,
  handleResetIodineLab,
  iodineBlank1,
  setIodineBlank1,
  iodineBlank2,
  setIodineBlank2,
  iodineBlanksChecked,
  setIodineBlanksChecked,
  isIodineBlank1Right,
  isIodineBlank2Right,
  isAllIodineBlanksRight,
  iodineQuizAnswers,
  setIodineQuizAnswers,
  iodineQuizSubmitted,
  setIodineQuizSubmitted,
  hydrolysisVideoUrl,
  setHydrolysisVideoUrl,
  showHydroVideoInput,
  setShowHydroVideoInput,
  videoHydroWatched,
  setVideoHydroWatched,
  hydrolysisDone,
  setHydrolysisDone,
  hydroBlank1,
  setHydroBlank1,
  hydroBlank2,
  setHydroBlank2,
  hydroBlank3,
  setHydroBlank3,
  hydroBlank4,
  setHydroBlank4,
  hydroBlanksChecked,
  setHydroBlanksChecked,
  isHydroBlank1Right,
  isHydroBlank2Right,
  isHydroBlank3Right,
  isHydroBlank4Right,
  isAllHydroBlanksRight,
  hydroQuizAnswers,
  setHydroQuizAnswers,
  hydroQuizSubmitted,
  setHydroQuizSubmitted,
  appVideoUrl,
  setAppVideoUrl,
  showAppVideoInput,
  setShowAppVideoInput,
  video3Watched,
  setVideo3Watched,
  hotspotMode,
  setHotspotMode,
  hotspotSelections,
  solvedHotspotIds,
  hotspotFeedback,
  handleToggleHotspotCell,
  handleRemoveHotspotSelection,
  handleCheckHotspots,
  handleResetHotspots,
  handleShowHotspotSolution,
  testStudentName,
  setTestStudentName,
  testStudentClass,
  setTestStudentClass,
  testStudentSchool,
  setTestStudentSchool,
  testMcAnswers,
  setTestMcAnswers,
  testTfAnswers,
  setTestTfAnswers,
  testFillAnswers,
  setTestFillAnswers,
  testMatchingAnswers,
  setTestMatchingAnswers,
  isTestSubmitted,
  testScore,
  testFeedbackMessage,
  isSendingEmail,
  handleSendTestToTeacherEmail,
  showProjectGuidePreview,
  setShowProjectGuidePreview,
  projectGuidePreviewType,
  setProjectGuidePreviewType,
  markProjectGuideDownloaded,
}) => {
  return (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {guideBanner}

            {/* THANH MỤC LỤC NHẢY NHANH (QUICK JUMP SUB-NAVIGATION) CHO CHẶNG 2 */}
            <div className="sticky top-15 z-20 bg-white/95 backdrop-blur-md border border-indigo-200 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-1.5">
              <span className="text-[11px] font-black uppercase text-indigo-900 px-2 flex items-center gap-1">
                <span>🧭 Nhảy nhanh:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5 flex-1">
                {[
                  { label: '📄 Phiếu ghi bài', done: worksheetDownloaded, domId: 'stage2-worksheet-box' },
                  { label: '🧊 I. Tính chất vật lí', done: isPart1Done, taskId: 'task-s2-part1' },
                  { label: '🧪 II.1. TN Iodine', done: isPart2aDone, taskId: 'task-s2-part2-iodine' },
                  { label: '🔬 II.2. TN Thủy phân', done: isPart2bDone, taskId: 'task-s2-part2-hydro' },
                  { label: '🏭 III. Ứng dụng', done: isPart3Done, taskId: 'task-s2-part3' },
                  { label: '📝 IV. Kiểm tra 12 câu', done: isPart4Done, taskId: 'task-s2-part4-test' },
                  { label: '🌱 V. Vận dụng', done: isPart5Done, taskId: 'task-s2-part5' },
                ].map((navItem, nIdx) => {
                  const isOpen = navItem.taskId ? unlockedTaskIds.has(navItem.taskId) : false;
                  return (
                    <button
                      key={nIdx}
                      type="button"
                      onClick={() => jumpToStage2Section(navItem.taskId, navItem.domId)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border ${navItem.done
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isOpen
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 hover:bg-orange-50 text-indigo-950 border-slate-200 hover:border-orange-300'
                        }`}
                    >
                      <span>{navItem.label}</span>
                      {navItem.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setShowNewWordsModal(true)}
                  className="ml-auto px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer transition-all"
                  title="Mở bảng Từ vựng Tiếng Anh KHTN (New Words)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🇬🇧 New Words</span>
                </button>
              </div>
            </div>

            {/* BƯỚC ĐẦU TIÊN: TẢI & CHUẨN BỊ PHIẾU GHI BÀI */}
            <div
              id="stage2-worksheet-box"
              className="scroll-mt-28 rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-900 border-2 border-indigo-400/40 p-4 md:px-5 md:py-4 text-white shadow-xl flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider shadow-xs">
                        ⭐ Bước đầu tiên
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 font-bold text-[10px]">
                        Phiếu ghi bài tự học Bài 30
                      </span>
                    </div>
                    <h2 className="text-base md:text-lg font-black text-white tracking-wide">
                      Tải Phiếu ghi bài về bàn học (Bài 30: Tinh bột &amp; Cellulose)
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWorksheetGuide((v) => !v)}
                    className={`px-3 py-1.5 rounded-full font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border ${showWorksheetGuide
                      ? 'bg-amber-500 text-white border-amber-400'
                      : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border-amber-400/40'
                      }`}
                    title="Bấm xem hướng dẫn chuẩn bị phiếu học tập"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                    <span>{showWorksheetGuide ? 'Ẩn hướng dẫn' : '💡 Hướng dẫn nhiệm vụ'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorksheetDownloaded((v) => !v)}
                    className={`px-3.5 py-2 rounded-full font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${worksheetDownloaded
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/20'
                      }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${worksheetDownloaded ? 'text-white' : 'text-slate-400'}`} />
                    <span>{worksheetDownloaded ? '✓ Đã có Phiếu ghi bài' : 'Xác nhận: Em đã có phiếu'}</span>
                  </button>
                </div>
              </div>

              {/* KHUNG HƯỚNG DẪN ĐI KÈM CỦA PHIẾU HỌC TẬP (BẬT/TẮT) */}
              {showWorksheetGuide && (
                <div className="bg-amber-950/70 border-2 border-amber-400/50 rounded-2xl p-4 text-xs text-amber-100 space-y-2 relative z-10 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-amber-400/30 pb-1.5">
                    <span className="font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                      <span>💡</span> Hướng dẫn: Chuẩn bị Phiếu ghi bài tự học Bài 30
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowWorksheetGuide(false)}
                      className="text-[11px] text-amber-300 hover:text-white px-2 py-0.5 rounded cursor-pointer"
                    >
                      ✕ Đóng
                    </button>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-amber-300 shrink-0">🎯 Mục tiêu:</span>
                    <span>Chuẩn bị tài liệu ghi chép cá nhân trước khi theo dõi video bài giảng và thực hiện thí nghiệm ảo.</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-amber-300 block">📋 Các bước thao tác:</span>
                    <ol className="list-decimal pl-5 space-y-1 text-indigo-100/90 font-medium">
                      <li>Bấm "Tải Phiếu học tập (PDF)" hoặc "(DOCX)" để tải về máy hoặc in ra giấy.</li>
                      <li>Có thể bấm nút "Xem trước Phiếu học tập" để xem trực tiếp các mục câu hỏi cần trả lời ngay trên trình duyệt.</li>
                      <li>Vừa theo dõi video bài giảng và thực hiện thí nghiệm ảo, vừa ghi chép các ý chính vào phiếu.</li>
                      <li>Bấm nút "Xác nhận: Em đã có phiếu".</li>
                    </ol>
                  </div>
                  <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-2 font-semibold text-amber-200">
                    ✨ Ghi chép đầy đủ vào phiếu sẽ giúp em làm bài kiểm tra 12 câu đạt điểm tối đa một cách dễ dàng!
                  </div>
                </div>
              )}

              {/* Hàng các nút hành động gọn gàng */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 relative z-10">
                <a
                  href={WORKSHEET_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Phieu_Hoc_Tap_Tinh_Bot_Cellulose.pdf"
                  onClick={() => {
                    setWorksheetDownloaded(true);
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                  }}
                  className="px-4 py-2 rounded-xl bg-linear-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Tải Phiếu (.PDF)</span>
                </a>

                <a
                  href={WORKSHEET_DOCX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Phieu_Hoc_Tap_Tinh_Bot_Cellulose.docx"
                  onClick={() => {
                    setWorksheetDownloaded(true);
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                  }}
                  className="px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Word (.DOCX)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowWorksheetPreview((v) => !v)}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>{showWorksheetPreview ? 'Thu gọn xem trước' : 'Xem & In trực tuyến'}</span>
                </button>
              </div>

              {/* Khung xem trước Phiếu ghi bài (Interactive Preview) */}
              {showWorksheetPreview && (
                <div className="mt-2 bg-white text-slate-900 rounded-2xl p-4 md:p-6 shadow-2xl border-2 border-indigo-200 animate-in fade-in zoom-in-95 duration-200 relative z-10 max-h-[80vh] overflow-y-auto">
                  {/* Thanh chọn chế độ xem: Bản PDF gốc vs Bản HTML tương tác */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWorksheetPreviewType('pdf')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${worksheetPreviewType === 'pdf'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>📄 Xem bản PDF gốc</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorksheetPreviewType('doc')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${worksheetPreviewType === 'doc'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>📝 Xem bản Web / Word tương tác</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={WORKSHEET_PDF_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <span>Mở PDF trong tab mới</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {worksheetPreviewType === 'pdf' ? (
                    <div className="flex flex-col gap-3">
                      <div className="w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100 h-[65vh]">
                        <iframe
                          src={`${WORKSHEET_PDF_URL}#toolbar=1&navpanes=0`}
                          title="Phiếu học tập Tinh bột & Cellulose (PDF)"
                          className="w-full h-full border-0 block"
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-sans">
                        <span>💡 Nếu trình duyệt của bạn không hỗ trợ hiển thị trực tiếp PDF bên trong khung, bạn có thể tải về hoặc mở tab mới:</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={WORKSHEET_PDF_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                          >
                            Mở tab mới
                          </a>
                          <a
                            href={WORKSHEET_PDF_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            download="Phieu_Hoc_Tap_Tinh_Bot_Cellulose.pdf"
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                          >
                            Tải file PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="font-serif">
                      {/* Header phiếu */}
                      <div className="text-center border-b-2 border-slate-300 pb-3 mb-4">
                        <div className="text-xs uppercase tracking-widest text-slate-500 font-sans font-bold">
                          TRƯỜNG THCS ..................................................... • TỔ KHTN (MÔN KHTN 9)
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase mt-1 tracking-wide font-sans">
                          PHIẾU HỌC TẬP — PHIẾU GHI BÀI TỰ HỌC
                        </h3>
                        <div className="text-xs italic text-slate-600 font-sans">
                          BÀI 30: TINH BỘT VÀ CELLULOSE
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-xs font-sans text-slate-700 border-t border-dashed border-slate-200">
                          <span><strong>Họ và tên:</strong> ............................................................................</span>
                          <span><strong>Lớp:</strong> .................</span>
                          <span><strong>Nhóm:</strong> .................</span>
                        </div>
                      </div>

                      {/* Phần I */}
                      <div className="mb-4">
                        <h4 className="font-sans font-black text-indigo-950 text-sm mb-1 uppercase">
                          I. Trạng thái tự nhiên và tính chất vật lí
                        </h4>
                        <p className="text-xs text-slate-700 mb-2">
                          1. Công thức phân tử chung của tinh bột và cellulose: <strong className="font-mono text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-sm">(C₆H₁₀O₅)ₙ</strong>
                        </p>
                        <p className="text-xs text-slate-700 mb-2">
                          2. Bảng so sánh đặc điểm Tinh bột &amp; Cellulose:
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse border border-slate-400">
                            <thead>
                              <tr className="bg-slate-100 font-sans">
                                <th className="border border-slate-400 p-2 text-left w-1/4">Đặc điểm</th>
                                <th className="border border-slate-400 p-2 text-left w-3/8 text-orange-800 font-black">🌾 TINH BỘT</th>
                                <th className="border border-slate-400 p-2 text-left w-3/8 text-emerald-800 font-black">🪵 CELLULOSE</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-slate-400 p-2 font-bold bg-slate-50">Trạng thái, màu sắc</td>
                                <td className="border border-slate-400 p-2">Chất rắn, dạng <strong>bột</strong>, màu <strong>trắng</strong>.</td>
                                <td className="border border-slate-400 p-2">Chất rắn, dạng <strong>sợi</strong>, màu <strong>trắng</strong>.</td>
                              </tr>
                              <tr>
                                <td className="border border-slate-400 p-2 font-bold bg-slate-50">Tính tan trong nước</td>
                                <td className="border border-slate-400 p-2">Không tan trong nước lạnh; tan một phần trong nước nóng tạo <strong>hồ tinh bột</strong>.</td>
                                <td className="border border-slate-400 p-2"><strong>Không tan</strong> trong nước (cả lạnh và nóng) và các dung môi hữu cơ.</td>
                              </tr>
                              <tr>
                                <td className="border border-slate-400 p-2 font-bold bg-slate-50">Nơi tích tụ trong cây</td>
                                <td className="border border-slate-400 p-2">Có nhiều ở hạt, củ, quả (gạo, ngô, khoai, sắn...).</td>
                                <td className="border border-slate-400 p-2">Có nhiều ở thân gỗ, quả bông, tre, nứa, đay, gai...</td>
                              </tr>
                              <tr>
                                <td className="border border-slate-400 p-2 font-bold bg-slate-50">Vai trò sinh học</td>
                                <td className="border border-slate-400 p-2 font-semibold text-orange-950">Dự trữ năng lượng cho thực vật.</td>
                                <td className="border border-slate-400 p-2 font-semibold text-emerald-950">Xây dựng thành tế bào, tạo độ cứng chắc.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Phần II */}
                      <div className="mb-4">
                        <h4 className="font-sans font-black text-indigo-950 text-sm mb-1 uppercase">
                          II. Tính chất hóa học
                        </h4>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                          <p>• <strong>1. Phản ứng màu với dung dịch Iodine:</strong> Hồ tinh bột tác dụng với iodine tạo hợp chất có màu <strong>xanh tím</strong> đặc trưng. <em>(Cellulose không có phản ứng này)</em>.</p>
                          <p>• <strong>2. Phản ứng thủy phân:</strong> Dưới tác dụng của acid (hoặc enzyme) và đun nóng, cả tinh bột và cellulose đều bị thủy phân hoàn toàn tạo ra <strong>Glucose (C₆H₁₂O₆)</strong>.</p>
                          <div className="p-2 bg-white rounded-lg border border-slate-300 font-mono text-center text-xs font-bold text-emerald-900">
                            (C₆H₁₀O₅)ₙ + n H₂O —(acid/t° hoặc enzyme)→ n C₆H₁₂O₆ (glucose)
                          </div>
                        </div>
                      </div>

                      {/* Phần III */}
                      <div className="mb-4">
                        <h4 className="font-sans font-black text-indigo-950 text-sm mb-1 uppercase">
                          III. Ứng dụng trong đời sống và sản xuất
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                            <strong className="text-orange-900 font-sans block mb-1">🌾 Ứng dụng của Tinh bột:</strong>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                              <li>Lương thực chính cho con người và động vật.</li>
                              <li>Sản xuất bánh kẹo, mì sợi, hồ dán.</li>
                              <li>Lên men sản xuất ethylic alcohol (rượu, cồn).</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                            <strong className="text-emerald-900 font-sans block mb-1">🪵 Ứng dụng của Cellulose:</strong>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                              <li>Sản xuất giấy viết, bao bì carton.</li>
                              <li>Dệt may (sợi bông tự nhiên, tơ nhân tạo).</li>
                              <li>Đồ gỗ nội thất, vật liệu xây dựng, sản xuất cồn.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Phần IV */}
                      <div>
                        <h4 className="font-sans font-black text-indigo-950 text-sm mb-1 uppercase">
                          IV. Vận dụng &amp; Liên hệ thực tiễn
                        </h4>
                        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-150 text-xs text-slate-700 space-y-1">
                          <p>• <strong>Câu 1:</strong> Khi nhai kỹ cơm hoặc bánh mì trong miệng, enzyme amylase trong nước bọt thủy phân một phần tinh bột thành đường maltose/glucose có vị ngọt nhẹ.</p>
                          <p>• <strong>Câu 2:</strong> Các sản phẩm thân thiện với môi trường: Ống hút từ bã mía/xơ dừa (cellulose), túi màng bọc sinh học tự hủy từ tinh bột bắp/ngô.</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2 font-sans">
                        <button
                          type="button"
                          onClick={handleDownloadWorksheetDoc}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          title="Xuất file Word HTML .DOC dự phòng"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Xuất Word (.DOC dự phòng)</span>
                        </button>
                        <a
                          href={WORKSHEET_DOCX_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          download="Phieu_Hoc_Tap_Tinh_Bot_Cellulose.docx"
                          onClick={() => {
                            setWorksheetDownloaded(true);
                            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải bản Word (.DOCX chính thức từ GV)</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PHẦN I: TÍNH CHẤT VẬT LÍ VÀ TRẠNG THÁI TỰ NHIÊN */}
            <LockedTaskBox
              taskId="task-s2-part1"
              badgeText="Chặng 2 • Phần I"
              title="I – Tính chất vật lí và trạng thái tự nhiên (Xem Video & Bài tập Kéo thả)"
              emoji="🌾"
              isUnlocked={unlockedTaskIds.has('task-s2-part1')}
              isCompleted={isPart1Done}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              {/* Bố cục 2 bên: Một nửa xem video / lý thuyết • Một nửa làm bài tập kéo thả */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* CỘT TRÁI (lg:col-span-6): Bước 1 - Xem Video & Lý thuyết Hình 30.1 */}
                <div className="lg:col-span-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex flex-col gap-3 lg:sticky lg:top-20">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-xs">
                        🎬 Bước 1: Xem Video &amp; Lý thuyết
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setVideo1Playing((v) => !v);
                          setVideo1Watched(true);
                        }}
                        className="px-3 py-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Play className="w-3 h-3" />
                        <span>{video1Playing ? 'Thu gọn' : 'Phát bài giảng'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideo1Watched(true)}
                        className={`px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 cursor-pointer ${video1Watched
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-indigo-900 border border-indigo-200 hover:border-orange-400'
                          }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{video1Watched ? 'Đã xem' : 'Xác nhận xem'}</span>
                      </button>
                    </div>
                  </div>

                  <span className="text-xs font-black text-indigo-950">
                    Trạng thái tự nhiên, tính chất vật lí &amp; sự hình thành Tinh bột – Cellulose
                  </span>

                  {video1Playing ? (
                    <div className="bg-indigo-950 text-white rounded-2xl p-3.5 border border-indigo-800 flex flex-col gap-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <span>🎬</span>
                          <span>Video Bài giảng: Trạng thái tự nhiên &amp; Tính chất vật lí</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-300">● Sẵn sàng phát</span>
                      </div>

                      {/* Khung phát Video 1110.mp4 */}
                      <div className="w-full bg-black rounded-xl overflow-hidden shadow-lg border border-white/15 aspect-video relative group">
                        <video
                          src={STAGE2_PART1_VIDEO_URL}
                          controls
                          playsInline
                          onTimeUpdate={(e) => {
                            const v = e.currentTarget;
                            if (v.duration && v.currentTime >= v.duration - 0.5) {
                              setVideo1Watched(true);
                            }
                          }}
                          onEnded={() => {
                            setVideo1Watched(true);
                            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                          }}
                          className="w-full h-full object-contain bg-black"
                        />
                      </div>

                      {/* Ghi chú video tạo bằng AI */}
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/15 text-[11px] text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black text-[10px] tracking-wide flex items-center gap-1 shadow-xs">
                            <span>✨</span>
                            <span>AI Video</span>
                          </span>
                          <span className="font-semibold text-slate-200">
                            Video bài giảng được tạo ra bằng AI
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Học liệu số hỗ trợ tự học</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        {video1Watched ? (
                          <span className="text-emerald-300 font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã hoàn thành xem Video Phần I</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setVideo1Watched(true)}
                            className="px-3 py-1 rounded-full bg-white/15 hover:bg-emerald-500/80 text-white font-bold cursor-pointer transition-colors"
                          >
                            ✓ Xác nhận đã xem video (nếu mạng chậm)
                          </button>
                        )}
                      </div>

                      {/* Sơ đồ Hình 30.1 */}
                      <div className="w-full bg-white rounded-xl p-2.5 border border-indigo-200 shadow-md">
                        <div className="text-[10px] font-black text-indigo-950 uppercase text-center mb-1">
                          Hình 30.1: Sự hình thành tinh bột và cellulose ở thực vật (Quang hợp)
                        </div>
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FGemini_Generated_Image_yew0h6yew0h6yew0.png?alt=media&token=cee61512-7aa9-4b20-83bb-e081975e4b74"
                          alt="Hình 30.1 Sự hình thành tinh bột và cellulose ở thực vật"
                          className="w-full h-auto rounded-lg object-contain mx-auto block max-h-48"
                        />
                      </div>

                      {/* Tóm tắt lý thuyết trọng tâm */}
                      <div className="grid grid-cols-1 gap-2 text-[11px] leading-relaxed">
                        <div className="bg-white/10 rounded-xl p-2.5 border border-white/15">
                          <div className="font-black text-amber-300 mb-0.5">🌾 1. Tinh bột — (C₆H₁₀O₅)ₙ</div>
                          <p className="text-white/90">
                            • Chất rắn, <strong>dạng bột, màu trắng</strong>, không tan trong nước lạnh, tan một phần trong nước nóng tạo <strong>hồ tinh bột</strong>.
                            <br />• Có nhiều ở <strong>hạt, củ, quả</strong> (gạo, ngô, khoai, sắn). Vai trò: <strong>Dự trữ năng lượng</strong> cho thực vật.
                          </p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-2.5 border border-white/15">
                          <div className="font-black text-emerald-300 mb-0.5">🪵 2. Cellulose — (C₆H₁₀O₅)ₘ</div>
                          <p className="text-white/90">
                            • Chất rắn, <strong>dạng sợi, màu trắng</strong>, không tan trong nước và các dung môi hữu cơ.
                            <br />• Có nhiều ở <strong>thân gỗ, quả bông, tre, nứa</strong>. Vai trò: <strong>Xây dựng thành tế bào</strong> duy trì độ cứng của cây.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-white rounded-2xl p-4 border border-indigo-200 shadow-xs flex flex-col gap-3">
                      <div
                        onClick={() => setVideo1Playing(true)}
                        className="w-full bg-indigo-950 rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-indigo-900 transition-all text-white p-4 text-center group border border-indigo-800 shadow-inner"
                      >
                        <div className="w-12 h-12 rounded-full bg-orange-500 group-hover:scale-110 flex items-center justify-center text-white shadow-lg transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                        <span className="text-xs font-black text-amber-300">
                          Bấm vào đây để mở Video bài giảng (1110.mp4)
                        </span>
                        <span className="text-[10px] text-white/70">
                          Video bài giảng KHTN 9: Tính chất vật lí &amp; Trạng thái tự nhiên
                        </span>
                      </div>

                      <div className="w-full bg-indigo-50/50 rounded-xl p-2.5 border border-indigo-150">
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FGemini_Generated_Image_yew0h6yew0h6yew0.png?alt=media&token=cee61512-7aa9-4b20-83bb-e081975e4b74"
                          alt="Hình 30.1 Sự hình thành tinh bột và cellulose ở thực vật"
                          className="w-full h-auto rounded-lg object-contain mx-auto block max-h-48"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CỘT PHẢI (lg:col-span-6): Bước 2 - Làm bài tập Kéo thả */}
                <div className="lg:col-span-6 bg-white border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs">
                  {/* Tiêu đề & Tiến độ hoàn thành */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-xs">
                        🧲 Bước 2: Phân loại tính chất
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                        Đã đúng: <strong className="text-orange-600">{Object.keys(dragPlacements).length}</strong>/{STAGE2_DRAG_ITEMS.length}
                      </span>
                      {Object.keys(dragPlacements).length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setDragPlacements({});
                            setDraggedPropId(null);
                            setDragFeedback(null);
                          }}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                          title="Làm lại từ đầu"
                        >
                          ↺ Làm lại
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thanh tiến độ thanh lịch */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-orange-500 via-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${(Object.keys(dragPlacements).length / STAGE2_DRAG_ITEMS.length) * 100}%` }}
                    />
                  </div>

                  {/* Thông báo tương tác (Feedback) */}
                  {dragFeedback && (
                    <div
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 ${dragFeedback.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                        }`}
                    >
                      {dragFeedback.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{dragFeedback.text}</span>
                    </div>
                  )}

                  {/* 2 Khay thả đích (Drop Zones) được đưa lên trên rõ ràng, đẹp mắt */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Hộp 1: TINH BỘT */}
                    <div
                      onClick={() => {
                        if (draggedPropId) {
                          handleAssignDragProp(draggedPropId, 'starch');
                          setDraggedPropId(null);
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverZone('starch');
                      }}
                      onDragLeave={() => setDragOverZone((z) => (z === 'starch' ? null : z))}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverZone(null);
                        const id = e.dataTransfer.getData('text/plain') || draggedPropId;
                        if (id) handleAssignDragProp(id, 'starch');
                        setDraggedPropId(null);
                      }}
                      className={`rounded-2xl border-2 transition-all duration-200 min-h-36 flex flex-col justify-between overflow-hidden cursor-pointer ${dragOverZone === 'starch'
                        ? 'bg-amber-100/90 border-amber-500 ring-4 ring-amber-300 scale-[1.02] shadow-md'
                        : 'bg-linear-to-b from-amber-50/70 to-orange-50/40 border-amber-200 hover:border-amber-400 hover:shadow-xs'
                        }`}
                    >
                      <div className="bg-linear-to-r from-amber-500 to-orange-500 px-3.5 py-2 flex items-center justify-between text-white shadow-xs">
                        <div className="flex items-center gap-1.5 font-black text-xs tracking-wide">
                          <span>🌾</span>
                          <span>TINH BỘT</span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-white/25 px-2 py-0.5 rounded-full backdrop-blur-xs">
                          {STAGE2_DRAG_ITEMS.filter((it) => dragPlacements[it.id] === 'starch').length}/4 đặc điểm
                        </span>
                      </div>

                      <div className="p-3 flex flex-col gap-1.5 flex-1 justify-start">
                        {STAGE2_DRAG_ITEMS.filter((it) => dragPlacements[it.id] === 'starch').length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center py-4 text-center text-amber-800/60 border-2 border-dashed border-amber-200/80 rounded-xl">
                            <span className="text-2xl mb-1">🥣</span>
                            <span className="text-[11px] font-bold">Thả thẻ Tinh bột vào đây</span>
                            <span className="text-[10px] opacity-75">(hoặc bấm nút [🌾 Tinh bột] trên thẻ)</span>
                          </div>
                        ) : (
                          STAGE2_DRAG_ITEMS.filter((it) => dragPlacements[it.id] === 'starch').map((it) => (
                            <div
                              key={it.id}
                              className="bg-white border border-amber-200 rounded-xl p-2 text-xs font-bold text-indigo-950 flex items-start justify-between gap-1.5 shadow-2xs group"
                            >
                              <div className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-tight">{it.text}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDragPlacements((prev) => {
                                    const next = { ...prev };
                                    delete next[it.id];
                                    return next;
                                  });
                                  setDragFeedback(null);
                                }}
                                className="text-slate-400 hover:text-rose-600 font-black text-xs px-1 hover:bg-rose-50 rounded-sm shrink-0"
                                title="Gỡ thẻ này ra"
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Hộp 2: CELLULOSE */}
                    <div
                      onClick={() => {
                        if (draggedPropId) {
                          handleAssignDragProp(draggedPropId, 'cellulose');
                          setDraggedPropId(null);
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverZone('cellulose');
                      }}
                      onDragLeave={() => setDragOverZone((z) => (z === 'cellulose' ? null : z))}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverZone(null);
                        const id = e.dataTransfer.getData('text/plain') || draggedPropId;
                        if (id) handleAssignDragProp(id, 'cellulose');
                        setDraggedPropId(null);
                      }}
                      className={`rounded-2xl border-2 transition-all duration-200 min-h-36 flex flex-col justify-between overflow-hidden cursor-pointer ${dragOverZone === 'cellulose'
                        ? 'bg-emerald-100/90 border-emerald-500 ring-4 ring-emerald-300 scale-[1.02] shadow-md'
                        : 'bg-linear-to-b from-emerald-50/70 to-teal-50/40 border-emerald-200 hover:border-emerald-400 hover:shadow-xs'
                        }`}
                    >
                      <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-3.5 py-2 flex items-center justify-between text-white shadow-xs">
                        <div className="flex items-center gap-1.5 font-black text-xs tracking-wide">
                          <span>🪵</span>
                          <span>CELLULOSE</span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-white/25 px-2 py-0.5 rounded-full backdrop-blur-xs">
                          {STAGE2_DRAG_ITEMS.filter((it) => dragPlacements[it.id] === 'cellulose').length}/4 đặc điểm
                        </span>
                      </div>

                      <div className="p-3 flex flex-col gap-1.5 flex-1 justify-start">
                        {STAGE2_DRAG_ITEMS.filter((it) => dragPlacements[it.id] === 'cellulose').length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center py-4 text-center text-emerald-800/60 border-2 border-dashed border-emerald-200/80 rounded-xl">
                            <span className="text-2xl mb-1">🌲</span>
                            <span className="text-[11px] font-bold">Thả thẻ Cellulose vào đây</span>
                            <span className="text-[10px] opacity-75">(hoặc bấm nút [🪵 Cellulose] trên thẻ)</span>
                          </div>
                        ) : (
                          STAGE2_DRAG_ITEMS.filter((it) => dragPlacements[it.id] === 'cellulose').map((it) => (
                            <div
                              key={it.id}
                              className="bg-white border border-emerald-200 rounded-xl p-2 text-xs font-bold text-indigo-950 flex items-start justify-between gap-1.5 shadow-2xs group"
                            >
                              <div className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-tight">{it.text}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDragPlacements((prev) => {
                                    const next = { ...prev };
                                    delete next[it.id];
                                    return next;
                                  });
                                  setDragFeedback(null);
                                }}
                                className="text-slate-400 hover:text-rose-600 font-black text-xs px-1 hover:bg-rose-50 rounded-sm shrink-0"
                                title="Gỡ thẻ này ra"
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kho thẻ chưa phân loại: Gọn gàng, ngay ngắn, 100% thẳng hàng, có nút 1-chạm */}
                  <div className="bg-indigo-50/50 border border-indigo-150 rounded-2xl p-3.5 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                      <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <span>📦</span>
                        <span>
                          {isPart1DragComplete
                            ? 'Hoàn thành thử thách'
                            : `Các thẻ tính chất cần xếp (${shuffledDragItems.filter((i) => !dragPlacements[i.id]).length} thẻ còn lại):`}
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {isPart1DragComplete ? '100% Chính xác' : 'Kéo thả hoặc bấm nhanh'}
                      </span>
                    </div>

                    {isPart1DragComplete ? (
                      <div className="p-4 bg-linear-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white rounded-xl shadow-md text-center flex flex-col items-center gap-2 animate-in zoom-in-95 duration-200">
                        <span className="text-3xl">🏆</span>
                        <div className="font-black text-sm">XUẤT SẮC! HOÀN THÀNH PHÂN LOẠI!</div>
                        <p className="text-xs text-emerald-100 max-w-md">
                          Em đã nắm vững toàn bộ tính chất vật lí và trạng thái tự nhiên của Tinh bột và Cellulose.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {shuffledDragItems.map((item, idx) => {
                          const isPlaced = Boolean(dragPlacements[item.id]);
                          if (isPlaced) return null;
                          const isSelected = draggedPropId === item.id;

                          return (
                            <div
                              key={item.id}
                              draggable
                              onClick={() => setDraggedPropId((prev) => (prev === item.id ? null : item.id))}
                              onDragStart={(e) => {
                                setDraggedPropId(item.id);
                                e.dataTransfer.setData('text/plain', item.id);
                              }}
                              onDragEnd={() => {
                                setDraggedPropId(null);
                                setDragOverZone(null);
                              }}
                              className={`bg-white rounded-xl p-3 border-2 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between gap-2.5 select-none cursor-grab active:cursor-grabbing ${isSelected
                                ? 'border-orange-500 ring-4 ring-orange-200 bg-orange-50/40 scale-[1.02]'
                                : 'border-slate-200 hover:border-indigo-300'
                                }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <p className="text-xs font-extrabold text-indigo-950 leading-snug">
                                  {item.text}
                                </p>
                              </div>

                              {/* 2 Nút phân loại 1-chạm nhanh tiện lợi trên cả điện thoại & máy tính */}
                              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAssignDragProp(item.id, 'starch');
                                    setDraggedPropId(null);
                                  }}
                                  className="flex-1 py-1 px-2 rounded-lg bg-amber-50 hover:bg-orange-500 text-amber-900 hover:text-white border border-amber-200 hover:border-orange-500 font-black text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1"
                                  title="Xếp vào Tinh bột"
                                >
                                  <span>🌾</span>
                                  <span>Tinh bột</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAssignDragProp(item.id, 'cellulose');
                                    setDraggedPropId(null);
                                  }}
                                  className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-900 hover:text-white border border-emerald-200 hover:border-emerald-600 font-black text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1"
                                  title="Xếp vào Cellulose"
                                >
                                  <span>🪵</span>
                                  <span>Cellulose</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </LockedTaskBox>

            {/* PHẦN II.1: TÍNH CHẤT 1 - PHẢN ỨNG MÀU CỦA HỒ TINH BỘT VỚI DUNG DỊCH IODINE (MỞ KHI XONG PHẦN I HOẶC GV) */}
            {!isPart1Done && !isTeacherMode ? (
              <div className="rounded-3xl bg-white/60 border-2 border-dashed border-slate-300 p-4 md:p-5 flex items-center justify-between gap-3 text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-600">Chặng 2 • Phần II.1 (Đang khóa)</span>
                    <h3 className="text-sm font-black text-indigo-950/70">
                      II.1 – Tính chất 1: Phản ứng màu của Hồ tinh bột với dung dịch Iodine
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                  🔒 Hoàn thành Phần I để mở khóa
                </span>
              </div>
            ) : (
              <LockedTaskBox
                taskId="task-s2-part2-iodine"
                badgeText="Chặng 2 • Phần II.1"
                title="II.1 – Tính chất 1: Phản ứng màu với dung dịch Iodine (Clip & Trắc nghiệm)"
                emoji="🧪"
                isUnlocked={unlockedTaskIds.has('task-s2-part2-iodine')}
                isCompleted={isPart2aDone}
                onUnlock={unlockTask}
                onLock={lockTask}
              >
                {/* Bố cục 50/50: Clip thí nghiệm & Thực hành ảo 1 bên • Bài tập trắc nghiệm riêng của Iodine 1 bên */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* CỘT TRÁI (50%): Clip thí nghiệm + Thực hành ảo nhỏ dung dịch Iodine */}
                  <div className="lg:col-span-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex flex-col gap-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-xs">
                          🎬 Bước 1: Clip Thí nghiệm &amp; Mô phỏng
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setVideoIodineWatched(true)}
                          className={`px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 cursor-pointer transition-all ${videoIodineWatched
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-white text-indigo-900 border border-indigo-200 hover:border-orange-400'
                            }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{videoIodineWatched ? '✓ Đã hoàn thành quan sát' : 'Xác nhận đã quan sát clip'}</span>
                        </button>
                      </div>
                    </div>

                    {/* KHUNG CHÈN CLIP THÍ NGHIỆM HỒ TINH BỘT + IODINE */}
                    <div className="bg-indigo-950 text-white rounded-2xl p-3 border border-indigo-800 flex flex-col gap-2.5 shadow-md">
                      <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <span>🎥</span>
                          <span>Clip Thí nghiệm: Hồ tinh bột + Dung dịch Iodine</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowIodineVideoInput((s) => !s)}
                          className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer font-bold"
                        >
                          {showIodineVideoInput ? 'Đóng ô nhập' : '🔗 Chèn / Đổi link clip'}
                        </button>
                      </div>

                      {showIodineVideoInput && (
                        <div className="bg-white/10 rounded-xl p-2.5 flex flex-col sm:flex-row items-center gap-2 text-xs">
                          <input
                            type="text"
                            value={iodineVideoUrl}
                            onChange={(e) => setIodineVideoUrl(e.target.value)}
                            placeholder="Dán link clip thí nghiệm (mp4, youtube embed...)"
                            className="w-full sm:flex-1 bg-white text-indigo-950 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                          />
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setShowIodineVideoInput(false);
                                if (iodineVideoUrl) setVideoIodineWatched(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                            >
                              Lưu link
                            </button>
                            {iodineVideoUrl && (
                              <button
                                type="button"
                                onClick={() => setIodineVideoUrl('')}
                                className="px-2 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs cursor-pointer"
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/20 flex items-center justify-center">
                        {iodineVideoUrl ? (
                          iodineVideoUrl.includes('youtube.com') || iodineVideoUrl.includes('youtu.be') ? (
                            <iframe
                              src={
                                iodineVideoUrl.includes('embed')
                                  ? iodineVideoUrl
                                  : `https://www.youtube.com/embed/${iodineVideoUrl.split('v=')[1]?.split('&')[0] || iodineVideoUrl.split('/').pop()}`
                              }
                              title="Clip Thí nghiệm Hồ tinh bột tác dụng Iodine"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={iodineVideoUrl}
                              controls
                              className="w-full h-full object-contain"
                              onEnded={() => setVideoIodineWatched(true)}
                            />
                          )
                        ) : (
                          <div className="text-center p-4 flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                              <FlaskConical className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-slate-200">
                              Chưa có link video thí nghiệm. Bấm nút <strong>🔗 Chèn / Đổi link clip</strong> ở trên để dán link video!
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Ghi nguồn video YouTube */}
                      {iodineVideoUrl && (iodineVideoUrl.includes('youtube.com') || iodineVideoUrl.includes('youtu.be')) && (
                        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/15 text-[11px] text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[9px] tracking-wide flex items-center gap-1">
                              <span>▶</span>
                              <span>YouTube</span>
                            </span>
                            <span className="font-semibold text-slate-200">
                              Nguồn video: <strong>Thí nghiệm Hồ tinh bột tác dụng với dung dịch Iodine (I₂)</strong>
                            </span>
                          </div>
                          <a
                            href={iodineVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-300 hover:text-white underline font-bold flex items-center gap-1 text-[11px]"
                          >
                            <span>Xem trên YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* MÔ PHỎNG THỰC HÀNH ẢO: KẸP 1/3 ỐNG NGHIỆM -> LẤY TINH BỘT -> NHỎ DD IODINE (THEO ĐÚNG HÌNH THỰC TẾ) */}
                    <div className="bg-white rounded-2xl p-3.5 border border-indigo-200 flex flex-col gap-3 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">🧪</span>
                          <span className="text-xs font-black text-indigo-950">
                            Phòng thí nghiệm ảo: Tinh bột phản ứng dung dịch I₂
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetIodineLab}
                          className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-rose-50 text-indigo-700 hover:text-rose-600 border border-indigo-200 text-[10px] font-black cursor-pointer transition-colors"
                        >
                          ↺ Làm lại TN ảo
                        </button>
                      </div>

                      {/* Thanh tiến trình 3 bước bắt buộc + 1 bước mở rộng */}
                      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                        <div
                          className={`px-2.5 py-1.5 rounded-xl border font-black flex items-center gap-1.5 transition-all ${isClampAtOneThird
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                              : 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-200'
                            }`}
                        >
                          <span>{isClampAtOneThird ? '✅' : '1️⃣'}</span>
                          <span className="leading-tight">B1: Kẹp đúng 1/3 ống nghiệm</span>
                        </div>
                        <div
                          className={`px-2.5 py-1.5 rounded-xl border font-black flex items-center gap-1.5 transition-all ${hasAddedStarch
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                              : isClampAtOneThird
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-2 ring-indigo-200'
                                : 'bg-slate-100 border-slate-200 text-slate-400'
                            }`}
                        >
                          <span>{hasAddedStarch ? '✅' : isClampAtOneThird ? '2️⃣' : '🔒'}</span>
                          <span className="leading-tight">B2: Cho Tinh bột vào ống</span>
                        </div>
                        <div
                          className={`px-2.5 py-1.5 rounded-xl border font-black flex items-center gap-1.5 transition-all ${hasAddedIodine
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                              : hasAddedStarch
                                ? 'bg-purple-50 border-purple-400 text-purple-950 ring-2 ring-purple-200'
                                : 'bg-slate-100 border-slate-200 text-slate-400'
                            }`}
                        >
                          <span>{hasAddedIodine ? '✅' : hasAddedStarch ? '3️⃣' : '🔒'}</span>
                          <span className="leading-tight">B3: Nhỏ DD Iốt (I₂)</span>
                        </div>
                      </div>

                      {/* BÀN THÍ NGHIỆM ẢO MÔ PHỎNG ĐÚNG BỐ CỤC HÌNH THỰC TẾ */}
                      <div className="relative h-72 rounded-2xl border-2 border-slate-300 bg-linear-to-b from-slate-100 via-slate-50 to-slate-200/90 overflow-hidden select-none shadow-inner">
                        {/* Bảng tiêu đề góc phải trên giống hình mẫu */}
                        <div className="absolute top-2.5 right-2.5 z-10 bg-slate-700/90 text-yellow-300 px-3 py-1.5 rounded-lg border border-slate-500 shadow-xs text-center pointer-events-none">
                          <div className="text-[11px] font-black tracking-wider leading-tight">TINH BỘT</div>
                          <div className="text-[10px] font-black tracking-wider leading-tight">PHẢN ỨNG I₂</div>
                        </div>

                        {/* Mặt bàn thí nghiệm */}
                        <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-b from-slate-200 to-slate-300 border-t border-slate-300" />

                        {/* 1. GIÁ ĐỠ THÍ NGHIỆM BẰNG SẮT (Bên trái) */}
                        <div className="absolute left-3 bottom-3 z-10 pointer-events-none">
                          {/* Đế sắt sơn đen */}
                          <div className="w-28 h-5 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 rounded-md border border-slate-700 shadow-md" />
                        </div>
                        {/* Trụ inox thẳng đứng của giá đỡ */}
                        <div className="absolute left-12 bottom-7 top-4 w-2.5 bg-linear-to-r from-slate-500 via-slate-200 to-slate-600 border-x border-slate-500 z-10 pointer-events-none" />

                        {/* 2. VÙNG ỐNG NGHIỆM & KẸP ỐNG NGHIỆM (Kéo thả dọc theo thân ống nghiệm) */}
                        <div
                          ref={testTubeTrackRef}
                          onPointerDown={(e) => {
                            if (hasAddedStarch || hasAddedIodine) {
                              updateClampPosition(clampPositionPct, false);
                              return;
                            }
                            const rect = e.currentTarget.getBoundingClientRect();
                            const relY = ((e.clientY - rect.top) / rect.height) * 100;
                            setIsDraggingClamp(true);
                            e.currentTarget.setPointerCapture(e.pointerId);
                            updateClampPosition(relY, false);
                          }}
                          onPointerMove={(e) => {
                            if (!isDraggingClamp) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const relY = ((e.clientY - rect.top) / rect.height) * 100;
                            updateClampPosition(relY, false);
                          }}
                          onPointerUp={(e) => {
                            if (!isDraggingClamp) return;
                            setIsDraggingClamp(false);
                            const rect = e.currentTarget.getBoundingClientRect();
                            const relY = ((e.clientY - rect.top) / rect.height) * 100;
                            updateClampPosition(relY, true);
                          }}
                          className={`absolute left-12 top-14 w-44 h-44 z-20 ${hasAddedStarch ? 'cursor-default' : 'cursor-ns-resize'
                            }`}
                          title="Kéo kẹp ống nghiệm lên/xuống đúng vị trí 1/3 tính từ miệng ống nghiệm"
                        >
                          {/* Ống hút nhỏ giọt đang nhỏ hóa chất từ trên miệng ống nghiệm */}
                          {iodineLabAnimating === 'dropping_starch' && (
                            <div className="absolute left-16 -top-12 z-30 flex flex-col items-center animate-bounce pointer-events-none">
                              <div className="w-3.5 h-5 rounded-t-full bg-rose-600 border border-rose-800" />
                              <div className="w-1.5 h-7 bg-white/90 border border-slate-400" />
                              <div className="w-2.5 h-3.5 rounded-full bg-white border border-slate-300 shadow-xs mt-0.5" />
                            </div>
                          )}
                          {iodineLabAnimating === 'dropping_iodine' && (
                            <div className="absolute left-16 -top-12 z-30 flex flex-col items-center animate-bounce pointer-events-none">
                              <div className="w-4 h-5 rounded-t-full bg-rose-600 border border-rose-800" />
                              <div className="w-1.5 h-7 bg-amber-800/80 border border-amber-950" />
                              <div className="w-2.5 h-3.5 rounded-full bg-amber-700 border border-amber-900 shadow-xs mt-0.5" />
                            </div>
                          )}

                          {/* Vạch chia chuẩn 1/3 từ miệng ống nghiệm */}
                          <div
                            className={`absolute left-24 right-0 h-5 -translate-y-1/2 rounded-r-lg border-y border-dashed flex items-center px-1.5 pointer-events-none transition-colors ${isClampAtOneThird
                                ? 'bg-emerald-500/20 border-emerald-600 text-emerald-900'
                                : 'bg-amber-400/25 border-amber-600 text-amber-950 animate-pulse'
                              }`}
                            style={{ top: '33%' }}
                          >
                            <span className="text-[9px] font-black whitespace-nowrap">
                              ← 1/3 miệng ống {isClampAtOneThird ? '✓' : '(Kéo vào đây)'}
                            </span>
                          </div>

                          {/* Thân Ống nghiệm thủy tinh */}
                          <div className="absolute left-14 top-0 w-9 h-full flex flex-col items-center pointer-events-none">
                            {/* Vành miệng ống nghiệm */}
                            <div className="w-10 h-1.5 rounded-full border-2 border-slate-400 bg-white/90 z-10" />
                            {/* Ống thủy tinh */}
                            <div className="relative w-8 flex-1 rounded-b-full border-2 border-t-0 border-slate-400/90 bg-white/65 backdrop-blur-xs overflow-hidden flex flex-col justify-end shadow-inner">
                              {/* Vệt phản quang thủy tinh */}
                              <div className="absolute left-1 top-1 bottom-3 w-1 bg-white/70 rounded-full z-10" />

                              {/* Vạch mờ chia 3 phần bằng nhau trên thân ống */}
                              <div
                                className="absolute inset-x-0 border-t border-dashed border-emerald-600/70 z-10"
                                style={{ top: '33%' }}
                              />
                              <div
                                className="absolute inset-x-0 border-t border-dotted border-slate-400/60 z-10"
                                style={{ top: '66%' }}
                              />

                              {/* Chất lỏng bên trong ống nghiệm */}
                              <div
                                className={`w-full transition-all duration-700 ${!hasAddedStarch
                                    ? 'h-0 bg-transparent'
                                    : !hasAddedIodine
                                      ? 'h-16 bg-linear-to-b from-slate-100/95 via-white/95 to-slate-200/95 border-t border-slate-300'
                                      : iodineTubeState === 'blue'
                                        ? 'h-18 bg-linear-to-b from-indigo-900 via-indigo-950 to-slate-950 border-t border-indigo-700 shadow-md'
                                        : 'h-18 bg-linear-to-b from-slate-100/90 via-white/85 to-slate-200/90 border-t border-slate-300'
                                  }`}
                              />
                            </div>
                          </div>

                          {/* TAY KẸP ỐNG NGHIỆM BẰNG KIM LOẠI ĐEN (Di chuyển theo clampPositionPct) */}
                          <div
                            className="absolute left-0 flex items-center -translate-y-1/2 z-30 transition-all duration-75"
                            style={{ top: `${clampPositionPct}%` }}
                          >
                            {/* Khớp vặn trên trụ sắt */}
                            <div className="w-4 h-5 rounded-xs bg-slate-800 border border-slate-600 shadow-xs" />
                            {/* Thanh ngang nối từ trụ sang ống nghiệm */}
                            <div className="w-11 h-2.5 bg-linear-to-b from-slate-700 to-slate-900 border-y border-slate-600" />
                            {/* Ngàm kẹp 3 ngón ôm quanh ống nghiệm giống hệt hình chụp */}
                            <div
                              className={`w-10 h-6 rounded-sm border-2 flex flex-col justify-between p-0.5 shadow-md transition-colors ${isClampAtOneThird
                                  ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-400/60'
                                  : 'bg-slate-900 border-amber-500 ring-2 ring-amber-400/60'
                                }`}
                            >
                              <div className="w-full h-1 bg-slate-700 rounded-xs" />
                              <div className="w-full h-1 bg-slate-700 rounded-xs" />
                              <div className="w-full h-1 bg-slate-700 rounded-xs" />
                            </div>
                            {/* Nút nắm kéo trực quan */}
                            {!hasAddedStarch && (
                              <span
                                className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-black shadow-xs whitespace-nowrap ${isClampAtOneThird
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-orange-500 text-white'
                                  }`}
                              >
                                ↕ {clampPositionPct}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 3. CỐC THỦY TINH ĐỰNG "TINH BỘT" + ỐNG HÚT ĐỎ (Ở giữa bàn) */}
                        <button
                          type="button"
                          onClick={handleAddStarchToTube}
                          className={`absolute left-44 bottom-3 z-20 flex flex-col items-center group cursor-pointer transition-transform ${isClampAtOneThird && !hasAddedStarch
                              ? 'hover:scale-105'
                              : 'opacity-85 hover:opacity-100'
                            }`}
                          title={
                            !isClampAtOneThird
                              ? 'Hãy kéo kẹp ống nghiệm vào đúng 1/3 từ miệng ống trước!'
                              : 'Bấm để hút Hồ tinh bột cho vào ống nghiệm'
                          }
                        >
                          {/* Ống hút nhỏ giọt đầu bóp cao su đỏ cắm nghiêng trong cốc */}
                          <div className="relative w-14 h-24 flex flex-col items-center justify-end">
                            <div className="absolute right-1 -top-3 rotate-12 flex flex-col items-center pointer-events-none group-hover:-translate-y-1 transition-transform">
                              <div className="w-3.5 h-5 rounded-t-full bg-rose-600 border border-rose-800 shadow-xs" />
                              <div className="w-1.5 h-16 bg-white/80 border border-slate-400/80" />
                            </div>

                            {/* Thân cốc thủy tinh có mỏ */}
                            <div
                              className={`relative w-14 h-18 rounded-b-lg border-2 bg-white/55 backdrop-blur-xs overflow-hidden flex flex-col justify-end shadow-md transition-all ${isClampAtOneThird && !hasAddedStarch
                                  ? 'border-indigo-500 ring-2 ring-indigo-300'
                                  : 'border-slate-400'
                                }`}
                            >
                              {/* Nhãn giấy trắng "Tinh bột" dán trên cốc */}
                              <div className="absolute top-3 inset-x-1.5 bg-white border border-slate-300 py-0.5 px-1 shadow-2xs z-10 text-center">
                                <span className="text-[9px] font-black text-slate-900 leading-none">
                                  Tinh bột
                                </span>
                              </div>
                              {/* Dung dịch hồ tinh bột màu trắng đục ở đáy cốc */}
                              <div className="w-full h-7 bg-linear-to-b from-white/95 to-slate-200/95 border-t border-slate-300" />
                            </div>
                          </div>
                          <span
                            className={`mt-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${hasAddedStarch
                                ? 'bg-emerald-100 text-emerald-800'
                                : isClampAtOneThird
                                  ? 'bg-indigo-600 text-white animate-bounce'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                          >
                            {hasAddedStarch ? '✓ Đã lấy' : isClampAtOneThird ? '👆 Bấm lấy' : '🔒 Cốc Tinh bột'}
                          </span>
                        </button>

                        {/* 4. LỌ THỦY TINH NÂU ĐỰNG "DD IỐT" CÓ BÓP CAO SU ĐỎ (Bên phải cốc tinh bột) */}
                        <button
                          type="button"
                          onClick={handleAddIodineToTube}
                          className={`absolute left-64 bottom-3 z-20 flex flex-col items-center group cursor-pointer transition-transform ${hasAddedStarch && !hasAddedIodine
                              ? 'hover:scale-105'
                              : 'opacity-85 hover:opacity-100'
                            }`}
                          title={
                            !hasAddedStarch
                              ? 'Hãy kẹp 1/3 ống nghiệm và cho Tinh bột vào ống trước!'
                              : 'Bấm để nhỏ dung dịch Iodine (I₂) vào ống nghiệm'
                          }
                        >
                          <div className="relative w-14 h-28 flex flex-col items-center justify-end">
                            {/* Đầu bóp cao su đỏ trên nắp lọ */}
                            <div className="w-4 h-5 rounded-t-full bg-rose-600 border border-rose-800 shadow-xs group-hover:-translate-y-0.5 transition-transform" />
                            {/* Nút cổ lọ màu trắng */}
                            <div className="w-7 h-2.5 bg-white border border-slate-300 rounded-xs shadow-2xs" />
                            {/* Cổ lọ hẹp */}
                            <div className="w-5 h-2 bg-amber-900/50 border-x border-amber-900" />
                            {/* Thân lọ thủy tinh nâu chứa dung dịch Iodine đỏ nâu */}
                            <div
                              className={`relative w-14 h-18 rounded-t-xl rounded-b-md border-2 bg-amber-100/50 overflow-hidden flex flex-col justify-end shadow-md transition-all ${hasAddedStarch && !hasAddedIodine
                                  ? 'border-purple-600 ring-2 ring-purple-300'
                                  : 'border-amber-900/80'
                                }`}
                            >
                              {/* Nhãn giấy trắng "DD Iốt" */}
                              <div className="absolute top-4 inset-x-1.5 bg-white border border-slate-300 py-0.5 px-1 shadow-2xs z-10 text-center">
                                <span className="text-[9px] font-black text-slate-900 leading-none">
                                  DD Iốt
                                </span>
                              </div>
                              {/* Dung dịch I₂ màu nâu đỏ trong lọ */}
                              <div className="w-full h-14 bg-linear-to-b from-amber-700/90 via-red-900/95 to-amber-950 border-t border-amber-600" />
                            </div>
                          </div>
                          <span
                            className={`mt-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${hasAddedIodine
                                ? 'bg-emerald-100 text-emerald-800'
                                : hasAddedStarch
                                  ? 'bg-purple-600 text-white animate-bounce'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                          >
                            {hasAddedIodine ? '✓ Đã nhỏ I₂' : hasAddedStarch ? '👆 Bấm nhỏ I₂' : '🔒 Lọ DD Iốt'}
                          </span>
                        </button>
                      </div>

                      {/* BÀI TẬP ĐIỀN KHUYẾT HIỆN TƯỢNG THÍ NGHIỆM IODINE + TINH BỘT */}
                      <div className="bg-white border-2 border-indigo-200 rounded-2xl p-3.5 flex flex-col gap-3 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                              ✍️
                            </span>
                            <span className="font-black text-indigo-950 text-xs sm:text-sm">
                              Bài tập Điền khuyết: Hiện tượng Thí nghiệm
                            </span>
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Quan sát &amp; Rút ra kết luận
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                          Dựa vào kết quả quan sát thí nghiệm ảo ở trên, em hãy điền các từ/cụm từ thích hợp vào chỗ trống để hoàn thành kết luận khoa học:
                        </p>

                        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5 text-xs text-slate-800 leading-relaxed">
                          {/* Câu 1 */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-extrabold text-indigo-950 shrink-0">1. Khi nhỏ dung dịch Iodine (I₂) vào hồ tinh bột:</span>
                            <span>hỗn hợp tạo thành có màu</span>
                            <div className="relative inline-flex items-center">
                              <input
                                type="text"
                                value={iodineBlank1}
                                onChange={(e) => {
                                  setIodineBlank1(e.target.value);
                                  setIodineBlanksChecked(false);
                                }}
                                placeholder="... màu gì?"
                                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all outline-hidden w-28 sm:w-32 text-center ${iodineBlanksChecked
                                    ? isIodineBlank1Right
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300'
                                      : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300'
                                    : 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                  }`}
                              />
                              {iodineBlanksChecked && (
                                <span className="ml-1 text-xs">{isIodineBlank1Right ? '✅' : '❌'}</span>
                              )}
                            </div>
                            <span>đặc trưng.</span>
                          </div>

                          {/* Câu 2 */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-extrabold text-indigo-950 shrink-0">2. Có thể dùng dung dịch Iodine để nhận biết</span>
                            <div className="relative inline-flex items-center">
                              <input
                                type="text"
                                value={iodineBlank2}
                                onChange={(e) => {
                                  setIodineBlank2(e.target.value);
                                  setIodineBlanksChecked(false);
                                }}
                                placeholder="... chất nào?"
                                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all outline-hidden w-32 sm:w-36 text-center ${iodineBlanksChecked
                                    ? isIodineBlank2Right
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300'
                                      : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300'
                                    : 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                  }`}
                              />
                              {iodineBlanksChecked && (
                                <span className="ml-1 text-xs">{isIodineBlank2Right ? '✅' : '❌'}</span>
                              )}
                            </div>
                            <span>(cellulose không có phản ứng này).</span>
                          </div>
                        </div>

                        {/* Gợi ý từ khóa chọn nhanh (hỗ trợ Smart TV & Touch tiện lợi) */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-bold text-slate-500 shrink-0">Gợi ý từ khóa:</span>
                          {[
                            { label: 'xanh tím', slot: 1 },
                            { label: 'tinh bột', slot: 2 },
                            { label: 'màu đỏ gạch', slot: 0 },
                            { label: 'kết tủa trắng', slot: 0 },
                          ].map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                if (chip.slot === 1) setIodineBlank1('xanh tím');
                                else if (chip.slot === 2) setIodineBlank2('tinh bột');
                                setIodineBlanksChecked(false);
                              }}
                              className="px-2 py-0.5 rounded-full border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-800 text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                            >
                              + {chip.label}
                            </button>
                          ))}
                        </div>

                        {/* Các nút bấm thao tác */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIodineBlanksChecked(true);
                              if (isAllIodineBlanksRight) {
                                confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
                              }
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <span>✓ Kiểm tra đáp án</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIodineBlank1('');
                              setIodineBlank2('');
                              setIodineBlanksChecked(false);
                            }}
                            className="py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                          >
                            <span>↺ Làm lại</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIodineBlank1('xanh tím');
                              setIodineBlank2('tinh bột');
                              setIodineBlanksChecked(true);
                              confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
                            }}
                            className="py-2 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs cursor-pointer transition-all"
                          >
                            <span>💡 Xem đáp án chuẩn</span>
                          </button>
                        </div>

                        {/* Thông báo kết quả phản hồi */}
                        {iodineBlanksChecked && (
                          <div
                            className={`rounded-xl p-3 border text-xs leading-relaxed transition-all animate-in fade-in duration-200 ${isAllIodineBlanksRight
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : 'bg-amber-50 border-amber-300 text-amber-950'
                              }`}
                          >
                            {isAllIodineBlanksRight ? (
                              <div className="flex flex-col gap-1">
                                <div className="font-black text-emerald-900 flex items-center gap-1.5">
                                  <span>🎉</span>
                                  <span>Chính xác tuyệt đối! Em đã nắm vững hiện tượng:</span>
                                </div>
                                <p className="text-[11px] text-emerald-800">
                                  Phân tử amylose trong tinh bột có cấu trúc xoắn hình lò xo, các phân tử Iodine bị giữ trong ống xoắn tạo phức chất có màu <strong>xanh tím</strong> đặc trưng. Do đó có thể dùng dung dịch iodine để nhận biết <strong>tinh bột</strong> (cellulose không có phản ứng này).
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <div className="font-black text-amber-900 flex items-center gap-1.5">
                                  <span>⚠️</span>
                                  <span>Chưa hoàn toàn chính xác:</span>
                                </div>
                                <p className="text-[11px] text-amber-800">
                                  Em hãy quan sát màu sắc của ống nghiệm ở phía trên khi nhỏ dung dịch I₂ vào hồ tinh bột, hoặc bấm vào <strong>Gợi ý từ khóa</strong> để hoàn thành nhé!
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI (50%): Bài tập trắc nghiệm riêng của Iodine */}
                  <div className="lg:col-span-6 bg-white border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs lg:sticky lg:top-20">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white font-black text-xs">
                          📝 Bước 2: Trắc nghiệm Phản ứng Iodine
                        </span>
                      </div>
                      <div>
                        {iodineQuizSubmitted ? (
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Đúng {STAGE2_PART2_IODINE_QUIZ.filter((q) => iodineQuizAnswers[q.id] === q.correctIndex).length}/
                            {STAGE2_PART2_IODINE_QUIZ.length} câu
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                            Đã chọn: {Object.keys(iodineQuizAnswers).length}/{STAGE2_PART2_IODINE_QUIZ.length} câu
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-black text-indigo-950">
                      Trả lời 2 câu hỏi trắc nghiệm về phản ứng đặc trưng với dung dịch Iodine:
                    </span>

                    <div className="grid grid-cols-1 gap-2.5">
                      {STAGE2_PART2_IODINE_QUIZ.map((q, idx) => {
                        const selected = iodineQuizAnswers[q.id];
                        return (
                          <div
                            key={q.id}
                            className="rounded-2xl p-3 bg-indigo-50/40 border border-indigo-100 flex flex-col justify-between gap-2"
                          >
                            <div>
                              <span className="text-[10px] font-black uppercase text-orange-600">{q.tag}</span>
                              <p className="text-xs font-extrabold text-indigo-950 mt-0.5">
                                Câu {idx + 1}: {q.question}
                              </p>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              {q.options.map((opt, oIdx) => {
                                const isChosen = selected === oIdx;
                                const isRight = q.correctIndex === oIdx;
                                let cls = 'bg-white border-indigo-100 text-indigo-900 hover:border-orange-300';
                                if (iodineQuizSubmitted) {
                                  if (isRight) cls = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-black';
                                  else if (isChosen) cls = 'bg-rose-50 border-rose-400 text-rose-900';
                                } else if (isChosen) {
                                  cls = 'bg-indigo-600 border-indigo-500 text-white font-bold';
                                }
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    disabled={iodineQuizSubmitted}
                                    onClick={() => setIodineQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                                    className={`p-2 rounded-xl border text-left text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${cls}`}
                                  >
                                    <span>
                                      <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                                    </span>
                                    {iodineQuizSubmitted && isRight && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    )}
                                    {iodineQuizSubmitted && isChosen && !isRight && (
                                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {iodineQuizSubmitted && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex flex-col gap-1 animate-in fade-in duration-200">
                        <div className="font-black flex items-center gap-1.5 text-emerald-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Ghi nhớ trọng tâm Phản ứng màu Iodine:</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          • Hồ tinh bột + Dung dịch Iodine cho hợp chất màu <strong>xanh tím</strong> đặc trưng.
                          <br />• Dùng dung dịch Iodine để nhận biết hồ tinh bột (và ngược lại).
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-indigo-100">
                      {iodineQuizSubmitted && (
                        <button
                          type="button"
                          onClick={() => {
                            setIodineQuizAnswers({});
                            setIodineQuizSubmitted(false);
                          }}
                          className="px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs cursor-pointer transition-colors"
                        >
                          Làm lại
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={!isPart2aQuizAllAnswered}
                        onClick={() => {
                          setIodineQuizSubmitted(true);
                          confetti({ particleCount: 60, spread: 55, origin: { y: 0.65 } });
                        }}
                        className="px-5 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white font-black text-xs cursor-pointer shadow-xs transition-all"
                      >
                        Kiểm tra đáp án Phần II.1
                      </button>
                    </div>
                  </div>
                </div>
              </LockedTaskBox>
            )}

            {/* PHẦN II.2: TÍNH CHẤT 2 - PHẢN ỨNG THỦY PHÂN TINH BỘT VÀ CELLULOSE (MỞ KHI XONG PHẦN II.1 HOẶC GV) */}
            {!isPart2aDone && !isTeacherMode ? (
              <div className="rounded-3xl bg-white/60 border-2 border-dashed border-slate-300 p-4 md:p-5 flex items-center justify-between gap-3 text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-600">Chặng 2 • Phần II.2 (Đang khóa)</span>
                    <h3 className="text-sm font-black text-indigo-950/70">
                      II.2 – Tính chất 2: Phản ứng Thủy phân Tinh bột &amp; Cellulose
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                  🔒 Hoàn thành Phần II.1 để mở khóa
                </span>
              </div>
            ) : (
              <LockedTaskBox
                taskId="task-s2-part2-hydrolysis"
                badgeText="Chặng 2 • Phần II.2"
                title="II.2 – Tính chất 2: Phản ứng Thủy phân Tinh bột & Cellulose (Canvas & Trắc nghiệm)"
                emoji="🔬"
                isUnlocked={unlockedTaskIds.has('task-s2-part2-hydrolysis')}
                isCompleted={isPart2bDone}
                onUnlock={unlockTask}
                onLock={lockTask}
              >
                {/* Bố cục 50/50: PTHH + Động học Canvas 1 bên • Bài tập trắc nghiệm riêng của Thủy phân 1 bên */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* CỘT TRÁI (50%): Clip Thí nghiệm + PTHH + Mô phỏng cắt phân tử polymer + Lab Canvas */}
                  <div className="lg:col-span-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex flex-col gap-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">
                          🔬 Bước 1: Clip Thí nghiệm &amp; Động học
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoHydroWatched(true);
                            setHydrolysisDone(true);
                          }}
                          className={`px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 cursor-pointer transition-all ${videoHydroWatched || hydrolysisDone
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-white text-indigo-900 border border-indigo-200 hover:border-emerald-400'
                            }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{videoHydroWatched || hydrolysisDone ? '✓ Đã hoàn thành quan sát' : 'Xác nhận đã quan sát clip'}</span>
                        </button>
                      </div>
                    </div>

                    {/* KHUNG CHÈN CLIP THÍ NGHIỆM THỦY PHÂN TINH BỘT */}
                    <div className="bg-indigo-950 text-white rounded-2xl p-3 border border-indigo-800 flex flex-col gap-2.5 shadow-md">
                      <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                          <span>🎥</span>
                          <span>Clip Thí nghiệm: Thủy phân tinh bột &amp; thử tính chất</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowHydroVideoInput((s) => !s)}
                          className="text-[10px] text-emerald-300 hover:text-white underline cursor-pointer font-bold"
                        >
                          {showHydroVideoInput ? 'Đóng ô nhập' : '🔗 Chèn / Đổi link clip'}
                        </button>
                      </div>

                      {showHydroVideoInput && (
                        <div className="bg-white/10 rounded-xl p-2.5 flex flex-col sm:flex-row items-center gap-2 text-xs">
                          <input
                            type="text"
                            value={hydrolysisVideoUrl}
                            onChange={(e) => setHydrolysisVideoUrl(e.target.value)}
                            placeholder="Dán link clip thí nghiệm thủy phân (mp4, youtube embed...)"
                            className="w-full sm:flex-1 bg-white text-indigo-950 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                          />
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setShowHydroVideoInput(false);
                                if (hydrolysisVideoUrl) setVideoHydroWatched(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                            >
                              Lưu link
                            </button>
                            {hydrolysisVideoUrl && (
                              <button
                                type="button"
                                onClick={() => setHydrolysisVideoUrl('')}
                                className="px-2 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs cursor-pointer"
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/20 flex items-center justify-center">
                        {hydrolysisVideoUrl ? (
                          hydrolysisVideoUrl.includes('youtube.com') || hydrolysisVideoUrl.includes('youtu.be') ? (
                            <iframe
                              src={
                                hydrolysisVideoUrl.includes('embed')
                                  ? hydrolysisVideoUrl
                                  : `https://www.youtube.com/embed/${hydrolysisVideoUrl.split('v=')[1]?.split('&')[0] || hydrolysisVideoUrl.split('/').pop()}`
                              }
                              title="Clip Thí nghiệm Thủy phân Tinh bột"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={hydrolysisVideoUrl}
                              controls
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-contain"
                              onTimeUpdate={(e) => {
                                const v = e.currentTarget;
                                if (v.duration && v.currentTime >= v.duration - 0.5) {
                                  setVideoHydroWatched(true);
                                }
                              }}
                              onEnded={() => setVideoHydroWatched(true)}
                            />
                          )
                        ) : (
                          <div className="text-center p-4 flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <FlaskConical className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-slate-200">
                              Chưa có link video thí nghiệm. Bấm nút <strong>🔗 Chèn / Đổi link clip</strong> ở trên để dán link video!
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Ghi nguồn video YouTube */}
                      {hydrolysisVideoUrl && (hydrolysisVideoUrl.includes('youtube.com') || hydrolysisVideoUrl.includes('youtu.be')) && (
                        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/15 text-[11px] text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[9px] tracking-wide flex items-center gap-1">
                              <span>▶</span>
                              <span>YouTube</span>
                            </span>
                            <span className="font-semibold text-slate-200">
                              Nguồn video: <strong>Thí nghiệm Phản ứng Thủy phân Tinh bột &amp; Thử tính chất sản phẩm</strong>
                            </span>
                          </div>
                          <a
                            href={hydrolysisVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-300 hover:text-white underline font-bold flex items-center gap-1 text-[11px]"
                          >
                            <span>Xem trên YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* MÔ PHỎNG ĐỘNG HỌC CANVAS QUA IFRAME */}
                    <div className="bg-white rounded-2xl p-3 border border-indigo-200 shadow-2xs flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                          <span>🔬</span>
                          <span>Phòng thí nghiệm ảo Canvas: Động học thủy phân</span>
                        </span>
                        <a
                          href="/thuy-phan-tinh-bot.html?v=5"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-indigo-600 hover:text-indigo-900 font-bold underline flex items-center gap-0.5"
                        >
                          <span>Mở toàn màn hình</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div
                        className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner"
                        style={{ height: '540px' }}
                      >
                        <iframe
                          src="/thuy-phan-tinh-bot.html?v=5"
                          title="Mô phỏng Thủy phân Tinh bột Canvas"
                          className="w-full h-full border-0"
                        />
                      </div>
                    </div>

                    {/* BÀI TẬP ĐIỀN KHUYẾT: PTHH & ĐẶC ĐIỂM PHẢN ỨNG THỦY PHÂN (NẰM DƯỚI MÔ PHỎNG) */}
                    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-3.5 flex flex-col gap-3 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                            ✍️
                          </span>
                          <span className="font-black text-indigo-950 text-xs sm:text-sm">
                            Bài tập Điền khuyết: Phương trình &amp; Đặc điểm Thủy phân
                          </span>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Quan sát &amp; Rút ra kết luận
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                        Dựa vào kết quả quan sát mô phỏng ở trên, em hãy điền các từ/công thức thích hợp vào chỗ trống để hoàn thành phương trình hóa học và kết luận quan trọng:
                      </p>

                      {/* KHUNG PHƯƠNG TRÌNH HÓA HỌC ĐIỀN KHUYẾT */}
                      <div className="bg-indigo-950 text-white rounded-xl p-3 flex flex-col gap-2 shadow-inner border border-indigo-900">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                          <span>🧪</span>
                          <span>Phương trình hóa học phản ứng thủy phân:</span>
                        </span>

                        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-amber-300 py-1">
                          <span>(C₆H₁₀O₅)ₙ + n H₂O —(acid/t° hoặc enzyme)→ n</span>
                          <div className="relative inline-flex items-center">
                            <input
                              type="text"
                              value={hydroBlank1}
                              onChange={(e) => {
                                setHydroBlank1(e.target.value);
                                setHydroBlanksChecked(false);
                              }}
                              placeholder="... C₆H₁₂O₆"
                              className={`px-2 py-0.5 rounded-lg border text-xs sm:text-sm font-bold transition-all outline-hidden w-28 sm:w-32 text-center ${hydroBlanksChecked
                                  ? isHydroBlank1Right
                                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400'
                                    : 'bg-rose-950 border-rose-400 text-rose-300 ring-2 ring-rose-400'
                                  : 'bg-white/10 text-white border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30'
                                }`}
                            />
                            {hydroBlanksChecked && (
                              <span className="ml-1 text-xs">{isHydroBlank1Right ? '✅' : '❌'}</span>
                            )}
                          </div>
                          <span>(Glucose)</span>
                        </div>
                      </div>

                      {/* CÁC KẾT LUẬN TRỌNG TÂM ĐIỀN KHUYẾT */}
                      <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5 text-xs text-slate-800 leading-relaxed">
                        {/* Câu điều kiện */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-extrabold text-indigo-950 shrink-0">• Điều kiện phản ứng:</span>
                          <span>Xúc tác</span>
                          <div className="relative inline-flex items-center">
                            <input
                              type="text"
                              value={hydroBlank2}
                              onChange={(e) => {
                                setHydroBlank2(e.target.value);
                                setHydroBlanksChecked(false);
                              }}
                              placeholder="... acid"
                              className={`px-2 py-0.5 rounded-lg border text-xs font-bold transition-all outline-hidden w-24 sm:w-28 text-center ${hydroBlanksChecked
                                  ? isHydroBlank2Right
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300'
                                    : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300'
                                  : 'bg-white border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                }`}
                            />
                            {hydroBlanksChecked && (
                              <span className="ml-1 text-xs">{isHydroBlank2Right ? '✅' : '❌'}</span>
                            )}
                          </div>
                          <span>(như H₂SO₄ loãng) và đun nóng, hoặc xúc tác bởi men</span>
                          <div className="relative inline-flex items-center">
                            <input
                              type="text"
                              value={hydroBlank3}
                              onChange={(e) => {
                                setHydroBlank3(e.target.value);
                                setHydroBlanksChecked(false);
                              }}
                              placeholder="... enzyme"
                              className={`px-2 py-0.5 rounded-lg border text-xs font-bold transition-all outline-hidden w-24 sm:w-28 text-center ${hydroBlanksChecked
                                  ? isHydroBlank3Right
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300'
                                    : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300'
                                  : 'bg-white border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                }`}
                            />
                            {hydroBlanksChecked && (
                              <span className="ml-1 text-xs">{isHydroBlank3Right ? '✅' : '❌'}</span>
                            )}
                          </div>
                          <span>ở nhiệt độ thích hợp.</span>
                        </div>

                        {/* Câu sản phẩm */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-extrabold text-indigo-950 shrink-0">• Sản phẩm:</span>
                          <span>Cả tinh bột và cellulose khi thủy phân hoàn toàn đều chỉ tạo ra</span>
                          <div className="relative inline-flex items-center">
                            <input
                              type="text"
                              value={hydroBlank4}
                              onChange={(e) => {
                                setHydroBlank4(e.target.value);
                                setHydroBlanksChecked(false);
                              }}
                              placeholder="... đường glucose"
                              className={`px-2 py-0.5 rounded-lg border text-xs font-bold transition-all outline-hidden w-32 sm:w-36 text-center ${hydroBlanksChecked
                                  ? isHydroBlank4Right
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300'
                                    : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300'
                                  : 'bg-white border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                }`}
                            />
                            {hydroBlanksChecked && (
                              <span className="ml-1 text-xs">{isHydroBlank4Right ? '✅' : '❌'}</span>
                            )}
                          </div>
                          <span>(C₆H₁₂O₆).</span>
                        </div>
                      </div>

                      {/* GỢI Ý TỪ KHÓA CHỌN NHANH (HỖ TRỢ SMART TV & TOUCH) */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] font-bold text-slate-500 shrink-0">Gợi ý từ khóa:</span>
                        {[
                          { label: 'C₆H₁₂O₆', slot: 1 },
                          { label: 'acid', slot: 2 },
                          { label: 'enzyme', slot: 3 },
                          { label: 'đường glucose', slot: 4 },
                          { label: 'fructose', slot: 0 },
                          { label: 'saccharose', slot: 0 },
                        ].map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (chip.slot === 1) setHydroBlank1('C₆H₁₂O₆');
                              else if (chip.slot === 2) setHydroBlank2('acid');
                              else if (chip.slot === 3) setHydroBlank3('enzyme');
                              else if (chip.slot === 4) setHydroBlank4('đường glucose');
                              setHydroBlanksChecked(false);
                            }}
                            className="px-2 py-0.5 rounded-full border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                          >
                            + {chip.label}
                          </button>
                        ))}
                      </div>

                      {/* CÁC NÚT BẤM THAO TÁC */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setHydroBlanksChecked(true);
                            if (isAllHydroBlanksRight) {
                              confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
                            }
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>✓ Kiểm tra đáp án</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setHydroBlank1('');
                            setHydroBlank2('');
                            setHydroBlank3('');
                            setHydroBlank4('');
                            setHydroBlanksChecked(false);
                          }}
                          className="py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                        >
                          <span>↺ Làm lại</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setHydroBlank1('C₆H₁₂O₆');
                            setHydroBlank2('acid');
                            setHydroBlank3('enzyme');
                            setHydroBlank4('đường glucose');
                            setHydroBlanksChecked(true);
                            confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
                          }}
                          className="py-2 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs cursor-pointer transition-all"
                        >
                          <span>💡 Xem đáp án chuẩn</span>
                        </button>
                      </div>

                      {/* THÔNG BÁO KẾT QUẢ PHẢN HỒI */}
                      {hydroBlanksChecked && (
                        <div
                          className={`rounded-xl p-3 border text-xs leading-relaxed transition-all animate-in fade-in duration-200 ${isAllHydroBlanksRight
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                              : 'bg-amber-50 border-amber-300 text-amber-950'
                            }`}
                        >
                          {isAllHydroBlanksRight ? (
                            <div className="flex flex-col gap-1">
                              <div className="font-black text-emerald-900 flex items-center gap-1.5">
                                <span>🎉</span>
                                <span>Chính xác tuyệt đối! Em đã nắm vững bản chất phản ứng:</span>
                              </div>
                              <p className="text-[11px] text-emerald-800">
                                Dưới tác dụng của xúc tác <strong>acid</strong> (đun nóng) hoặc men <strong>enzyme</strong> (amylase ở nhiệt độ thích hợp), các liên kết glycosidic trong tinh bột và cellulose bị cắt đứt hoàn toàn cùng với các phân tử nước để tạo thành một loại monosaccharide duy nhất là <strong>glucose (C₆H₁₂O₆)</strong>.
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <div className="font-black text-amber-900 flex items-center gap-1.5">
                                <span>⚠️</span>
                                <span>Chưa hoàn toàn chính xác:</span>
                              </div>
                              <p className="text-[11px] text-amber-800">
                                Em hãy quan sát kỹ mô phỏng phân tử ở trên hoặc bấm vào <strong>Gợi ý từ khóa</strong> để hoàn thành chính xác nhé!
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CỘT PHẢI (50%): Bài tập trắc nghiệm riêng của Thủy phân */}
                  <div className="lg:col-span-6 bg-white border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs lg:sticky lg:top-20">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">
                          📝 Bước 2: Trắc nghiệm Phản ứng Thủy phân
                        </span>
                      </div>
                      <div>
                        {hydroQuizSubmitted ? (
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Đúng {STAGE2_PART2_HYDROLYSIS_QUIZ.filter((q) => hydroQuizAnswers[q.id] === q.correctIndex).length}/
                            {STAGE2_PART2_HYDROLYSIS_QUIZ.length} câu
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                            Đã chọn: {Object.keys(hydroQuizAnswers).length}/{STAGE2_PART2_HYDROLYSIS_QUIZ.length} câu
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-black text-indigo-950">
                      Trả lời 3 câu hỏi trắc nghiệm về phản ứng Thủy phân Tinh bột &amp; Cellulose:
                    </span>

                    <div className="grid grid-cols-1 gap-2.5">
                      {STAGE2_PART2_HYDROLYSIS_QUIZ.map((q, idx) => {
                        const selected = hydroQuizAnswers[q.id];
                        return (
                          <div
                            key={q.id}
                            className="rounded-2xl p-3 bg-indigo-50/40 border border-indigo-100 flex flex-col justify-between gap-2"
                          >
                            <div>
                              <span className="text-[10px] font-black uppercase text-emerald-700">{q.tag}</span>
                              <p className="text-xs font-extrabold text-indigo-950 mt-0.5">
                                Câu {idx + 1}: {q.question}
                              </p>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              {q.options.map((opt, oIdx) => {
                                const isChosen = selected === oIdx;
                                const isRight = q.correctIndex === oIdx;
                                let cls = 'bg-white border-indigo-100 text-indigo-900 hover:border-emerald-300';
                                if (hydroQuizSubmitted) {
                                  if (isRight) cls = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-black';
                                  else if (isChosen) cls = 'bg-rose-50 border-rose-400 text-rose-900';
                                } else if (isChosen) {
                                  cls = 'bg-emerald-600 border-emerald-500 text-white font-bold';
                                }
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    disabled={hydroQuizSubmitted}
                                    onClick={() => setHydroQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                                    className={`p-2 rounded-xl border text-left text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${cls}`}
                                  >
                                    <span>
                                      <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                                    </span>
                                    {hydroQuizSubmitted && isRight && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    )}
                                    {hydroQuizSubmitted && isChosen && !isRight && (
                                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-indigo-100">
                      {hydroQuizSubmitted && (
                        <button
                          type="button"
                          onClick={() => {
                            setHydroQuizAnswers({});
                            setHydroQuizSubmitted(false);
                          }}
                          className="px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs cursor-pointer transition-colors"
                        >
                          Làm lại
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={!isPart2bQuizAllAnswered}
                        onClick={() => {
                          setHydroQuizSubmitted(true);
                          confetti({ particleCount: 60, spread: 55, origin: { y: 0.65 } });
                        }}
                        className="px-5 py-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white font-black text-xs cursor-pointer shadow-xs transition-all"
                      >
                        Kiểm tra đáp án Phần II.2
                      </button>
                    </div>
                  </div>
                </div>
              </LockedTaskBox>
            )}

            {/* PHẦN III: ỨNG DỤNG (MỞ KHI XONG PHẦN II HOẶC CHẾ ĐỘ GV) */}
            {!isPart2Done && !isTeacherMode ? (
              <div className="rounded-3xl bg-white/60 border-2 border-dashed border-slate-300 p-4 md:p-5 flex items-center justify-between gap-3 text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-600">Chặng 2 • Phần III (Đang khóa)</span>
                    <h3 className="text-sm font-black text-indigo-950/70">
                      III – Ứng dụng (Xem Video &amp; Trò chơi Điểm nóng 16 Hình ảnh thực tế)
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                  🔒 Hoàn thành Phần II (II.1 &amp; II.2) để mở khóa
                </span>
              </div>
            ) : (
              <LockedTaskBox
                taskId="task-s2-part3"
                badgeText="Chặng 2 • Phần III"
                title="III – Ứng dụng (Xem Video & Trò chơi Điểm nóng 16 Hình ảnh thực tế)"
                emoji="🎯"
                isUnlocked={unlockedTaskIds.has('task-s2-part3')}
                isCompleted={isPart3Done}
                onUnlock={unlockTask}
                onLock={lockTask}
              >
                {/* Bố cục 50/50 chuẩn học đường: Nửa bên Video bài giảng & Kiến thức • Nửa bên Bài tập Điểm nóng */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* CỘT TRÁI (50%): Video bài giảng + Tóm tắt ứng dụng Tinh bột & Cellulose */}
                  <div className="lg:col-span-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex flex-col gap-3.5 lg:sticky lg:top-20">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-xs">
                          🎬 Bước 1: Video Bài giảng Ứng dụng
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setVideo3Watched(true)}
                          className={`px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 cursor-pointer transition-all ${
                            video3Watched
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-white text-indigo-900 border border-indigo-200 hover:border-orange-400'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{video3Watched ? '✓ Đã hoàn thành xem video' : 'Xác nhận đã xem video'}</span>
                        </button>
                      </div>
                    </div>

                    {/* KHUNG VIDEO ỨNG DỤNG HỖ TRỢ CHÈN LINK */}
                    <div className="bg-indigo-950 text-white rounded-2xl p-3 border border-indigo-800 flex flex-col gap-2.5 shadow-md">
                      <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <span>🎥</span>
                          <span>Video Clip: Ứng dụng của Tinh bột và Cellulose</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAppVideoInput((s) => !s)}
                          className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer font-bold"
                        >
                          {showAppVideoInput ? 'Đóng ô nhập' : '🔗 Chèn / Đổi link video'}
                        </button>
                      </div>

                      {showAppVideoInput && (
                        <div className="bg-white/10 rounded-xl p-2.5 flex flex-col sm:flex-row items-center gap-2 text-xs">
                          <input
                            type="text"
                            value={appVideoUrl}
                            onChange={(e) => setAppVideoUrl(e.target.value)}
                            placeholder="Dán link video bài giảng ứng dụng (mp4, youtube embed...)"
                            className="w-full sm:flex-1 bg-white text-indigo-950 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                          />
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAppVideoInput(false);
                                if (appVideoUrl) setVideo3Watched(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                            >
                              Lưu link
                            </button>
                            {appVideoUrl && (
                              <button
                                type="button"
                                onClick={() => setAppVideoUrl('')}
                                className="px-2 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs cursor-pointer"
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/20 flex items-center justify-center">
                        {appVideoUrl ? (
                          appVideoUrl.includes('youtube.com') || appVideoUrl.includes('youtu.be') ? (
                            <iframe
                              src={
                                appVideoUrl.includes('embed')
                                  ? appVideoUrl
                                  : `https://www.youtube.com/embed/${appVideoUrl.split('v=')[1]?.split('&')[0] || appVideoUrl.split('/').pop()}`
                              }
                              title="Video Bài giảng Ứng dụng Tinh bột & Cellulose"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={appVideoUrl}
                              controls
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-contain"
                              onEnded={() => setVideo3Watched(true)}
                            />
                          )
                        ) : (
                          <div className="text-center p-4 flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                              <Play className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-slate-200">
                              Chưa có link video bài giảng. Bấm nút <strong>🔗 Chèn / Đổi link video</strong> ở trên để dán link video!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 2 THẺ TÓM TẮT ỨNG DỤNG TINH BỘT & CELLULOSE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs flex flex-col gap-1.5">
                        <div className="font-black text-amber-800 text-xs flex items-center gap-1.5">
                          <span>🌾</span>
                          <span>Ứng dụng của Tinh bột (Hình 30.2a)</span>
                        </div>
                        <ul className="text-[11px] text-indigo-950/85 leading-relaxed space-y-1 list-disc pl-3.5">
                          <li><strong>Lương thực chính:</strong> Gạo, bột mì, ngô, khoai, sắn cung cấp năng lượng cho con người.</li>
                          <li><strong>Công nghiệp:</strong> Sản xuất bánh kẹo, hồ dán, nguyên liệu lên men cồn (rượu)...</li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-2xl p-3.5 border border-emerald-200 shadow-2xs flex flex-col gap-1.5">
                        <div className="font-black text-emerald-800 text-xs flex items-center gap-1.5">
                          <span>🪵</span>
                          <span>Ứng dụng của Cellulose (Hình 30.2b)</span>
                        </div>
                        <ul className="text-[11px] text-indigo-950/85 leading-relaxed space-y-1 list-disc pl-3.5">
                          <li><strong>Sản xuất &amp; Đời sống:</strong> Sản xuất giấy viết, dệt sợi may mặc (vải sợi bông).</li>
                          <li><strong>Vật liệu &amp; Hóa chất:</strong> Gỗ xây dựng, đồ gia dụng, tơ nhân tạo, cồn công nghiệp...</li>
                        </ul>
                      </div>
                    </div>

                    <div className="text-[11px] text-orange-800 bg-orange-50 border border-orange-200 p-2.5 rounded-xl font-medium">
                      👉 <strong>Nhiệm vụ:</strong> Quan sát 16 hình ảnh ở cột bên phải, bấm chọn chế độ và nhặt đủ <strong>4 ứng dụng của Tinh bột</strong> và <strong>4 ứng dụng của Cellulose</strong> vào 2 giỏ!
                    </div>
                  </div>

                  {/* CỘT PHẢI (50%): Bài tập Chọn Điểm nóng (Hotspot) trên 16 Ứng dụng */}
                  <div className="lg:col-span-6 bg-white border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white font-black text-xs">
                          🎯 Bước 2: Bài tập Điểm nóng (Hotspot)
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          16 Hình ảnh thực tế
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                          🌾 Tinh bột: {Object.values(hotspotSelections).filter((v) => v === 'starch').length}/4
                        </span>
                        <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-300 shadow-2xs">
                          🪵 Cellulose: {Object.values(hotspotSelections).filter((v) => v === 'cellulose').length}/4
                        </span>
                      </div>
                    </div>

                    {/* HƯỚNG DẪN CÁCH CHƠI TRỰC QUAN & 2 NÚT CHỌN RỔ */}
                    <div className="bg-linear-to-r from-amber-50/80 via-white to-cyan-50/80 border-2 border-indigo-200 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs text-indigo-950 font-black">
                        <span className="text-sm">👉</span>
                        <span>CÁCH CHƠI CỰC DỄ (NHẶT 4 TINH BỘT &amp; 4 CELLULOSE):</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        Bấm chọn chế độ <strong>🌾 Nhặt Tinh bột</strong> hoặc <strong>🪵 Nhặt Cellulose</strong> ở bên dưới, sau đó <strong>chạm/bấm trực tiếp vào các ô tranh trên bức ảnh</strong> để nhặt vào giỏ. Bấm lại vào ô hoặc bấm dấu [✕] trên giỏ để hủy chọn!
                      </p>

                      {/* 2 NÚT CHỌN CHẾ ĐỘ NHẶT VÀO RỔ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setHotspotMode('starch')}
                          className={`p-2.5 rounded-xl border-2 flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            hotspotMode === 'starch'
                              ? 'bg-linear-to-r from-amber-500 to-amber-600 border-amber-600 text-white font-black shadow-md ring-3 ring-amber-300 scale-[1.01]'
                              : 'bg-white border-amber-200 text-amber-950 font-bold hover:bg-amber-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🌾</span>
                            <div className="text-left">
                              <div className="text-xs font-black">CHẾ ĐỘ: NHẶT TINH BỘT</div>
                              <div className="text-[10px] opacity-85">Bấm vào ô ảnh để gán Tinh bột</div>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-black ${
                              hotspotMode === 'starch'
                                ? 'bg-white text-amber-700 shadow-2xs'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {Object.values(hotspotSelections).filter((v) => v === 'starch').length}/4
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHotspotMode('cellulose')}
                          className={`p-2.5 rounded-xl border-2 flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            hotspotMode === 'cellulose'
                              ? 'bg-linear-to-r from-cyan-600 to-teal-600 border-cyan-700 text-white font-black shadow-md ring-3 ring-cyan-300 scale-[1.01]'
                              : 'bg-white border-cyan-200 text-cyan-950 font-bold hover:bg-cyan-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🪵</span>
                            <div className="text-left">
                              <div className="text-xs font-black">CHẾ ĐỘ: NHẶT CELLULOSE</div>
                              <div className="text-[10px] opacity-85">Bấm vào ô ảnh để gán Cellulose</div>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-black ${
                              hotspotMode === 'cellulose'
                                ? 'bg-white text-cyan-800 shadow-2xs'
                                : 'bg-cyan-100 text-cyan-800'
                            }`}
                          >
                            {Object.values(hotspotSelections).filter((v) => v === 'cellulose').length}/4
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* KHUNG ẢNH 16 ỨNG DỤNG VỚI 16 VÙNG BẤM PHỦ KÍN 4x4 */}
                    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-200 bg-slate-900 shadow-md select-none">
                      <img
                        src="/images/ung-dung-tinh-bot-cellulose.png"
                        alt="Bảng 16 ứng dụng của Tinh bột, Cellulose và các vật liệu trong đời sống"
                        className="w-full h-auto block select-none"
                      />

                      {/* 16 VÙNG BẤM TƯƠNG TÁC PHỦ KÍN 4 HÀNG x 4 CỘT */}
                      {HOTSPOT_APPLICATIONS.map((hs, idx) => {
                        const sel = hotspotSelections[hs.id];
                        const colIdx = idx % 4;
                        const rowIdx = Math.floor(idx / 4);

                        const isStarch = sel === 'starch';
                        const isCellulose = sel === 'cellulose';

                        return (
                          <div
                            key={hs.id}
                            style={{
                              left: `${colIdx * 25}%`,
                              top: `${rowIdx * 25}%`,
                              width: '25%',
                              height: '25%',
                            }}
                            onClick={() => handleToggleHotspotCell(hs.id)}
                            className={`absolute p-1 cursor-pointer transition-all flex flex-col justify-between ${
                              isStarch
                                ? 'bg-amber-500/35 border-2 sm:border-3 border-amber-400 shadow-lg ring-2 ring-amber-300/80 z-20'
                                : isCellulose
                                  ? 'bg-cyan-500/35 border-2 sm:border-3 border-cyan-400 shadow-lg ring-2 ring-cyan-300/80 z-20'
                                  : 'hover:bg-white/20 border border-white/20 hover:border-orange-400 z-10'
                            }`}
                            title={`Ô #${hs.number}: ${hs.label}`}
                          >
                            {/* HUY HIỆU GÓC TRÊN */}
                            <div className="flex items-center justify-between w-full pointer-events-none">
                              <span
                                className={`px-1.5 py-0.5 rounded-md font-black text-[9px] sm:text-[11px] shadow-xs ${
                                  isStarch
                                    ? 'bg-amber-500 text-white ring-1 ring-amber-300'
                                    : isCellulose
                                      ? 'bg-cyan-600 text-white ring-1 ring-cyan-300'
                                      : 'bg-black/60 text-white backdrop-blur-xs'
                                }`}
                              >
                                #{hs.number}
                              </span>

                              {isStarch && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-600 text-white font-black text-[8px] sm:text-[10px] shadow-xs">
                                  🌾 Tinh bột ✓
                                </span>
                              )}
                              {isCellulose && (
                                <span className="px-1.5 py-0.5 rounded-md bg-cyan-700 text-white font-black text-[8px] sm:text-[10px] shadow-xs">
                                  🪵 Cellulose ✓
                                </span>
                              )}
                            </div>

                            {/* TÊN Ô GÓC DƯỚI RÕ RÀNG */}
                            <div className="pointer-events-none">
                              <span className="block px-1 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white font-bold text-[8px] sm:text-[10px] truncate leading-tight text-center">
                                {hs.label.split('(')[0]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 2 GIỎ THU HOẠCH HIỂN THỊ CÁC MỤC ĐÃ NHẶT */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* GIỎ 1: TINH BỘT */}
                      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                          <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                            <span>🧺</span>
                            <span>Giỏ 4 Ứng dụng Tinh bột:</span>
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white">
                            {Object.values(hotspotSelections).filter((v) => v === 'starch').length}/4
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5 min-h-20 justify-center">
                          {Object.keys(hotspotSelections).filter((id) => hotspotSelections[id] === 'starch').length === 0 ? (
                            <div className="text-center text-[11px] text-amber-800/60 font-semibold italic py-2">
                              (Chưa có mục nào. Hãy chọn chế độ Tinh bột và bấm vào ô trên ảnh!)
                            </div>
                          ) : (
                            Object.keys(hotspotSelections)
                              .filter((id) => hotspotSelections[id] === 'starch')
                              .map((id) => {
                                const item = HOTSPOT_APPLICATIONS.find((h) => h.id === id);
                                if (!item) return null;
                                return (
                                  <div
                                    key={id}
                                    className="flex items-center justify-between gap-1.5 bg-white border border-amber-300 rounded-xl px-2.5 py-1 text-xs font-bold text-amber-950 shadow-2xs"
                                  >
                                    <span className="truncate">
                                      🌾 <strong>#{item.number}</strong>. {item.label}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveHotspotSelection(id)}
                                      className="text-rose-500 hover:text-rose-700 font-black text-xs px-1 hover:bg-rose-50 rounded-sm cursor-pointer shrink-0"
                                      title="Bỏ chọn mục này"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      </div>

                      {/* GIỎ 2: CELLULOSE */}
                      <div className="bg-cyan-50/80 border-2 border-cyan-300 rounded-2xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b border-cyan-200 pb-1.5">
                          <span className="text-xs font-black text-cyan-950 flex items-center gap-1.5">
                            <span>🧺</span>
                            <span>Giỏ 4 Ứng dụng Cellulose:</span>
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-600 text-white">
                            {Object.values(hotspotSelections).filter((v) => v === 'cellulose').length}/4
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5 min-h-20 justify-center">
                          {Object.keys(hotspotSelections).filter((id) => hotspotSelections[id] === 'cellulose').length === 0 ? (
                            <div className="text-center text-[11px] text-cyan-800/60 font-semibold italic py-2">
                              (Chưa có mục nào. Hãy chọn chế độ Cellulose và bấm vào ô trên ảnh!)
                            </div>
                          ) : (
                            Object.keys(hotspotSelections)
                              .filter((id) => hotspotSelections[id] === 'cellulose')
                              .map((id) => {
                                const item = HOTSPOT_APPLICATIONS.find((h) => h.id === id);
                                if (!item) return null;
                                return (
                                  <div
                                    key={id}
                                    className="flex items-center justify-between gap-1.5 bg-white border border-cyan-300 rounded-xl px-2.5 py-1 text-xs font-bold text-cyan-950 shadow-2xs"
                                  >
                                    <span className="truncate">
                                      🪵 <strong>#{item.number}</strong>. {item.label}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveHotspotSelection(id)}
                                      className="text-rose-500 hover:text-rose-700 font-black text-xs px-1 hover:bg-rose-50 rounded-sm cursor-pointer shrink-0"
                                      title="Bỏ chọn mục này"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CÁC NÚT BẤM THAO TÁC KIỂM TRA & GIẢI ĐÁP */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCheckHotspots}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>✓ Kiểm tra kết quả 2 giỏ</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetHotspots}
                        className="py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                      >
                        <span>↺ Làm lại</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleShowHotspotSolution}
                        className="py-2.5 px-3.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs cursor-pointer transition-all"
                      >
                        <span>💡 Xem đáp án chuẩn</span>
                      </button>
                    </div>

                    {hotspotFeedback && (
                      <div
                        className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 ${
                          hotspotFeedback.isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-orange-50 border-orange-300 text-orange-900'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 shrink-0" />
                        <span>{hotspotFeedback.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              </LockedTaskBox>
            )}

            {/* PHẦN IV: BÀI KIỂM TRA ĐÁNH GIÁ 12 CÂU (MỞ KHI XONG PHẦN III HOẶC CHẾ ĐỘ GV) */}
            {!isPart3Done && !isTeacherMode ? (
              <div className="rounded-3xl bg-white/60 border-2 border-dashed border-slate-300 p-4 md:p-5 flex items-center justify-between gap-3 text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-600">Chặng 2 • Phần IV (Đang khóa)</span>
                    <h3 className="text-sm font-black text-indigo-950/70">
                      IV – Bài kiểm tra 12 câu đánh giá kiến thức Chặng 2 (Gửi kết quả về email cô giáo)
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                  🔒 Hoàn thành Phần III để mở khóa
                </span>
              </div>
            ) : (
              <LockedTaskBox
                taskId="task-s2-part4"
                badgeText="Chặng 2 • Phần IV"
                title="IV – Bài kiểm tra 12 câu đánh giá kiến thức Chặng 2 (Gửi kết quả đến email: tranvanl55@gmail.com)"
                emoji="📝"
                isUnlocked={unlockedTaskIds.has('task-s2-part4')}
                isCompleted={isPart4Done}
                onUnlock={unlockTask}
                onLock={lockTask}
              >
                <div className="flex flex-col gap-5">
                  {/* THANH THÔNG TIN HỌC SINH & HƯỚNG DẪN NỘP BÀI */}
                  <div className="bg-linear-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-4 border border-indigo-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-indigo-950 font-black text-[11px] uppercase">
                          📋 BÀI KIỂM TRA ĐA DẠNG 12 CÂU
                        </span>
                        <span className="text-xs text-indigo-200 font-bold">Thang điểm: 12 điểm</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Gồm 4 dạng câu hỏi: <strong>Trắc nghiệm ABCD (3 câu)</strong> • <strong>Đúng/Sai (3 câu)</strong> • <strong>Điền khuyết (3 câu)</strong> • <strong>Ghép đôi (3 câu)</strong>.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-right text-xs">
                        <span className="text-slate-300">Email giáo viên tiếp nhận: </span>
                        <span className="font-mono text-amber-300 font-bold">tranvanl55@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  {/* FORM NHẬP THÔNG TIN HỌC SINH */}
                  <div className="bg-white rounded-2xl p-4 border border-indigo-150 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
                        Họ và tên học sinh <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={testStudentName}
                        onChange={(e) => setTestStudentName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn An"
                        className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
                        Lớp học <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={testStudentClass}
                        onChange={(e) => setTestStudentClass(e.target.value)}
                        placeholder="Ví dụ: 9A1"
                        className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
                        Trường THCS
                      </label>
                      <input
                        type="text"
                        value={testStudentSchool}
                        onChange={(e) => setTestStudentSchool(e.target.value)}
                        placeholder="Tên trường..."
                        className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* DANH SÁCH 12 CÂU HỎI */}
                  <div className="flex flex-col gap-4">
                    {STAGE2_TEST_QUESTIONS.map((q) => {
                      return (
                        <div
                          key={q.id}
                          className="bg-white rounded-2xl border border-indigo-150 p-4 md:p-5 flex flex-col gap-3 shadow-2xs"
                        >
                          {/* Header câu hỏi */}
                          <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {q.groupName} • {q.tag}
                            </span>
                            {isTestSubmitted && (
                              <span className="text-xs font-bold text-emerald-700">
                                💡 Xem giải thích bên dưới
                              </span>
                            )}
                          </div>

                          <p className="text-xs md:text-sm font-extrabold text-indigo-950">
                            {q.question}
                          </p>

                          {/* DẠNG 1: TRẮC NGHIỆM ABCD */}
                          {q.type === 'multiple_choice' && q.options && (
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {q.options.map((opt, oIdx) => {
                                const isPicked = testMcAnswers[q.id] === oIdx;
                                const isRight = q.correctOptionIndex === oIdx;
                                let btnClass = 'bg-indigo-50/40 border-indigo-100 text-indigo-900 hover:border-orange-300';
                                if (isTestSubmitted) {
                                  if (isRight) btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black';
                                  else if (isPicked) btnClass = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                                } else if (isPicked) {
                                  btnClass = 'bg-indigo-600 border-indigo-600 text-white font-bold';
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    disabled={isTestSubmitted}
                                    onClick={() => setTestMcAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                                    className={`p-3 rounded-xl border text-left text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${btnClass}`}
                                  >
                                    <span>
                                      <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                                    </span>
                                    {isTestSubmitted && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                                    {isTestSubmitted && isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* DẠNG 2: ĐÚNG / SAI */}
                          {q.type === 'true_false' && q.subStatements && (
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {q.subStatements.map((sub) => {
                                const userChoice = testTfAnswers[sub.id];
                                const isAnswered = userChoice !== undefined;
                                const isRight = userChoice === sub.isCorrect;

                                return (
                                  <div
                                    key={sub.id}
                                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                                      isTestSubmitted
                                        ? isRight
                                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                                          : 'bg-rose-50/70 border-rose-300 text-rose-950'
                                        : 'bg-indigo-50/30 border-indigo-100 text-indigo-950'
                                    }`}
                                  >
                                    <span className="font-medium flex-1">{sub.text}</span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        type="button"
                                        disabled={isTestSubmitted}
                                        onClick={() => setTestTfAnswers((prev) => ({ ...prev, [sub.id]: true }))}
                                        className={`px-3 py-1.5 rounded-lg font-black text-xs cursor-pointer border transition-all ${
                                          userChoice === true
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                                        }`}
                                      >
                                        ✓ Đúng
                                      </button>
                                      <button
                                        type="button"
                                        disabled={isTestSubmitted}
                                        onClick={() => setTestTfAnswers((prev) => ({ ...prev, [sub.id]: false }))}
                                        className={`px-3 py-1.5 rounded-lg font-black text-xs cursor-pointer border transition-all ${
                                          userChoice === false
                                            ? 'bg-rose-600 text-white border-rose-600'
                                            : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                                        }`}
                                      >
                                        ✗ Sai
                                      </button>
                                      {isTestSubmitted && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                                      {isTestSubmitted && isAnswered && !isRight && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* DẠNG 3: ĐIỀN KHUYẾT */}
                          {q.type === 'fill_in' && q.blanks && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {q.blanks.map((b) => {
                                const val = testFillAnswers[b.id] || '';
                                const isRight = b.acceptedAnswers.some((ans) => ans.toLowerCase() === val.trim().toLowerCase());

                                return (
                                  <div key={b.id} className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-indigo-900">{b.label}</label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        disabled={isTestSubmitted}
                                        value={val}
                                        onChange={(e) => setTestFillAnswers((prev) => ({ ...prev, [b.id]: e.target.value }))}
                                        placeholder={b.placeholder}
                                        className={`w-full rounded-xl px-3 py-2 text-xs font-bold outline-none border ${
                                          isTestSubmitted
                                            ? isRight
                                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                                              : 'bg-rose-50 border-rose-400 text-rose-950'
                                            : 'bg-indigo-50/40 border-indigo-200 text-indigo-950 focus:border-indigo-600 focus:bg-white'
                                        }`}
                                      />
                                      {isTestSubmitted && (
                                        <div className="mt-1 text-[10px] font-bold text-slate-500">
                                          Đáp án đúng: <span className="text-emerald-700 font-extrabold">{b.acceptedAnswers[0]}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* DẠNG 4: GHÉP ĐÔI */}
                          {q.type === 'matching' && q.matchingPairs && (
                            <div className="grid grid-cols-1 gap-2.5 pt-1">
                              {q.matchingPairs.map((pair) => {
                                const chosenKey = testMatchingAnswers[`c${q.id}_${pair.id}`] || '';
                                const isRight = chosenKey === pair.rightKey;

                                return (
                                  <div
                                    key={pair.id}
                                    className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                                      isTestSubmitted
                                        ? isRight
                                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                                          : 'bg-rose-50/70 border-rose-300 text-rose-950'
                                        : 'bg-indigo-50/40 border-indigo-150 text-indigo-950'
                                    }`}
                                  >
                                    <span className="font-extrabold flex-1">{pair.leftText}</span>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-[11px] text-slate-500 font-bold">Ghép với:</span>
                                      <select
                                        disabled={isTestSubmitted}
                                        value={chosenKey}
                                        onChange={(e) =>
                                          setTestMatchingAnswers((prev) => ({
                                            ...prev,
                                            [`c${q.id}_${pair.id}`]: e.target.value,
                                          }))
                                        }
                                        className="bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-950 outline-none"
                                      >
                                        <option value="">-- Chọn vế ghép --</option>
                                        {q.matchingPairs.map((opt) => (
                                          <option key={opt.rightKey} value={opt.rightKey}>
                                            {opt.rightText}
                                          </option>
                                        ))}
                                      </select>
                                      {isTestSubmitted && (
                                        <span className="font-black text-xs">
                                          {isRight ? '✅' : `❌ (Đáp án: ${pair.rightKey})`}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Giải thích chi tiết khi đã nộp bài */}
                          {isTestSubmitted && (
                            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-950 leading-relaxed">
                              💡 <strong>Giải thích khoa học:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* HỘP KẾT QUẢ & NÚT NỘP BÀI GỬI EMAIL */}
                  <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 flex flex-col gap-4 shadow-sm">
                    {isTestSubmitted ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50 border border-emerald-300 p-4 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
                              {testScore}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-emerald-950">
                                KẾT QUẢ BÀI KIỂM TRA: {testScore} / 12 ĐIỂM ({Math.round((testScore / 12) * 100)}%)
                              </h4>
                              <p className="text-xs text-emerald-800 font-medium">
                                Học sinh: <strong>{testStudentName}</strong> • Lớp: <strong>{testStudentClass || 'KHTN 9'}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${TEACHER_EMAIL}?subject=[KHTN 9] Điểm kiểm tra Chặng 2: ${testStudentName} - Lớp ${testStudentClass}&body=Họ tên: ${testStudentName}%0D%0ALớp: ${testStudentClass}%0D%0AĐiểm số: ${testScore}/12 điểm`}
                              className="px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-900 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-50 cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Gửi bản sao Mailto</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-900 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-50 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-indigo-600" />
                              <span>In bài làm</span>
                            </button>
                          </div>
                        </div>

                        {testFeedbackMessage && (
                          <div className="text-xs font-bold text-indigo-950 bg-indigo-50 p-3 rounded-xl border border-indigo-200 flex items-center gap-2">
                            <span>📧</span>
                            <span>{testFeedbackMessage}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs text-indigo-950/80 font-medium">
                          👉 Kiểm tra kỹ 12 câu hỏi ở trên và thông tin Họ tên, Lớp học trước khi bấm nộp bài.
                        </div>

                        <button
                          type="button"
                          disabled={isSendingEmail}
                          onClick={handleSendTestToTeacherEmail}
                          className="px-6 py-3 rounded-full bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-xs md:text-sm cursor-pointer shadow-md transition-all flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSendingEmail ? 'Đang chấm điểm & gửi email...' : 'Nộp bài & Gửi kết quả về email cô giáo (tranvanl55@gmail.com)'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </LockedTaskBox>
            )}

            {/* PHẦN V: VẬN DỤNG KIẾN THỨC & ĐỀ XUẤT GIẢI PHÁP DỰ ÁN STEAM (MỞ KHI XONG PHẦN IV HOẶC CHẾ ĐỘ GV) */}
            {!isPart4Done && !isTeacherMode ? (
              <div className="rounded-3xl bg-white/60 border-2 border-dashed border-slate-300 p-4 md:p-5 flex items-center justify-between gap-3 text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-600">Chặng 2 • Phần V (Đang khóa)</span>
                    <h3 className="text-sm font-black text-indigo-950/70">
                      V – Vận dụng STEAM: Kết nối &ldquo;GREEN NEWSPAPER&rdquo; &amp; Dự án &ldquo;BẮT ĐẦU TỪ SỰ KẾT THÚC&rdquo;
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                  🔒 Hoàn thành Bài kiểm tra Phần IV để mở khóa
                </span>
              </div>
            ) : (
              <LockedTaskBox
                taskId="task-s2-part5"
                badgeText="Chặng 2 • Phần V (Vận dụng STEAM)"
                title='V – Vận dụng: Kết nối "GREEN NEWSPAPER" với dự án "BẮT ĐẦU TỪ SỰ KẾT THÚC" & Phiếu hướng dẫn'
                emoji="🌱"
                isUnlocked={unlockedTaskIds.has('task-s2-part5')}
                isCompleted={isPart5Done}
                onUnlock={unlockTask}
                onLock={lockTask}
              >
                <div className="flex flex-col gap-4">
                  {/* 1. KHUNG ĐỀ BÀI NHIỆM VỤ VẬN DỤNG CHẶNG 2 (CHÍNH XÁC NGUYÊN VĂN) */}
                  <div className="rounded-2xl bg-linear-to-br from-emerald-950 via-teal-900 to-indigo-950 text-white p-4 md:p-5 border border-emerald-500/40 shadow-md flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-linear-to-r from-amber-400 to-orange-500 text-indigo-950 font-black text-xs shadow-xs">
                          🌍 ĐỀ BÀI VẬN DỤNG CHẶNG 2 • STEAM CHALLENGE
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[11px] font-extrabold">
                          🔑 GREEN NEWSPAPER ➔ 🌱 BẮT ĐẦU TỪ SỰ KẾT THÚC
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-300">
                        🇬🇧 Encouraged: English / Bilingual Presentation
                      </span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 md:p-4 border border-white/15 text-xs md:text-sm leading-relaxed text-emerald-50 font-medium">
                      Hiện nay, việc sản xuất giấy từ gỗ rừng đang làm suy giảm diện tích rừng tự nhiên và các vật dụng, túi bầu nhựa dùng một lần thải ra môi trường phải mất hàng trăm năm mới phân hủy; trong khi đó, một lượng lớn phụ phẩm nông nghiệp quanh ta (như bã mía, thân chuối, vỏ bắp, rơm rạ, bã cà phê...) sau khi sử dụng lại bị vứt bỏ hoặc đem đốt gây lãng phí và ô nhiễm không khí. Bằng cách kết nối từ khóa <strong className="text-amber-300 font-black">“GREEN NEWSPAPER”</strong> vừa tìm được ở Chặng 1 với tên dự án <strong className="text-emerald-300 font-black">“BẮT ĐẦU TỪ SỰ KẾT THÚC”</strong>, nhóm em hãy vận dụng kiến thức đã học về <strong className="text-white font-black underline decoration-amber-400">Tinh bột và Cellulose</strong> kết hợp các yếu tố <strong className="text-amber-300 font-black">STEAM</strong> để đề xuất giải pháp, thiết kế quy trình và chế tạo các sản phẩm xanh giải quyết vấn đề thực tiễn trên (sao cho mỗi <em className="text-amber-200 font-semibold">“sự kết thúc”</em> lại mở ra một <em className="text-emerald-200 font-semibold">“sự bắt đầu”</em> mới), đồng thời hoàn thiện bài báo cáo thuyết trình (khuyến khích sử dụng Tiếng Anh) và đăng tải toàn bộ sản phẩm trực tiếp lên <strong className="text-amber-300 font-black">Website học tập này</strong> để bước vào <strong className="text-emerald-300 font-black">Chặng 3</strong>.
                    </div>

                    {/* Gợi mở 5 yếu tố S - T - E - A - M */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                      {[
                        {
                          letter: 'S',
                          name: 'Science (Khoa học)',
                          desc: 'Khung sợi Cellulose bền chắc kết hợp chất kết dính Hồ tinh bột tự phân hủy.',
                          color: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200',
                        },
                        {
                          letter: 'T',
                          name: 'Technology (Công nghệ)',
                          desc: 'Ứng dụng công cụ số thiết kế quy trình, video & slide báo cáo song ngữ.',
                          color: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200',
                        },
                        {
                          letter: 'E',
                          name: 'Engineering (Kỹ thuật)',
                          desc: 'Quy trình xử lý phụ phẩm: tách xơ → phối trộn hồ tinh bột → ép khuôn → sấy.',
                          color: 'bg-amber-500/20 border-amber-400/40 text-amber-200',
                        },
                        {
                          letter: 'A',
                          name: 'Art (Nghệ thuật)',
                          desc: 'Tạo hình thẩm mỹ sản phẩm xanh, trình bày sáng tạo (khuyến khích Tiếng Anh).',
                          color: 'bg-pink-500/20 border-pink-400/40 text-pink-200',
                        },
                        {
                          letter: 'M',
                          name: 'Math (Toán học)',
                          desc: 'Tính tỉ lệ phối trộn (gam xơ : ml nước : gam tinh bột), kích thước & chi phí.',
                          color: 'bg-purple-500/20 border-purple-400/40 text-purple-200',
                        },
                      ].map((st) => (
                        <div key={st.letter} className={`rounded-xl p-2.5 border ${st.color} flex flex-col gap-1`}>
                          <div className="font-black text-xs flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center text-[11px]">
                              {st.letter}
                            </span>
                            <span>{st.name}</span>
                          </div>
                          <p className="text-[10px] text-white/85 leading-snug">{st.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. BƯỚC 1: CHỌN NGUỒN PHỤ PHẨM NÔNG NGHIỆP ("SỰ KẾT THÚC") ĐỂ TÁI SINH ("SỰ BẮT ĐẦU MỚI") */}
                  <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-black text-indigo-950">
                        🌾 Bước 1: Chọn nguồn phụ phẩm nông nghiệp giàu Cellulose &amp; chất kết dính Tinh bột nhóm em sử dụng ({checkedHomeItems.size}/4):
                      </span>
                      <span className="text-[11px] font-bold text-orange-700 bg-white px-2.5 py-0.5 rounded-full border border-orange-200">
                        Chọn ít nhất 1 nguồn nguyên liệu
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {[
                        {
                          id: 'home-food',
                          emoji: '🎋',
                          title: 'Bã mía & Thân chuối',
                          sub: 'Giàu sợi Cellulose → Làm giấy nảy mầm Green Newspaper, bìa sinh học',
                        },
                        {
                          id: 'home-clothes',
                          emoji: '🌽',
                          title: 'Vỏ bắp (ngô) & Rơm rạ',
                          sub: 'Giàu Cellulose → Làm túi bầu ươm cây, chậu ươm tự phân hủy',
                        },
                        {
                          id: 'home-books',
                          emoji: '☕',
                          title: 'Bã cà phê & Vỏ trấu',
                          sub: 'Kết hợp xơ thực vật → Ép ly, khay, viên nén & chậu cây dinh dưỡng',
                        },
                        {
                          id: 'home-wood',
                          emoji: '🥣',
                          title: 'Hồ tinh bột (Gạo, sắn, bắp)',
                          sub: 'Chất kết dính sinh học & tạo màng bọc thực phẩm tự hủy',
                        },
                      ].map((hItem) => {
                        const checked = checkedHomeItems.has(hItem.id);
                        return (
                          <button
                            key={hItem.id}
                            type="button"
                            onClick={() => toggleSetItem(setCheckedHomeItems, hItem.id)}
                            className={`p-3 rounded-xl border-2 text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                              checked
                                ? 'bg-emerald-50 border-emerald-400 shadow-2xs'
                                : 'bg-white border-orange-100 hover:border-orange-300'
                            }`}
                          >
                            <span className="text-xl">{hItem.emoji}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-black text-indigo-950">{hItem.title}</span>
                                {checked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                              </div>
                              <span className="text-[11px] font-bold text-orange-800/80 leading-tight block mt-0.5">
                                {hItem.sub}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
              

                  {/* KHUNG TẢI PHIẾU HƯỚNG DẪN THỰC HIỆN DỰ ÁN (WORD & PDF) ĐỂ QUA CHẶNG 3 */}
                  <div className="bg-linear-to-r from-indigo-50 via-emerald-50/70 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-xs shrink-0">
                          📋
                        </span>
                        <div>
                          <div className="text-xs md:text-sm font-black text-indigo-950">
                            Tải Phiếu hướng dẫn thực hiện dự án &ldquo;Bắt đầu từ sự kết thúc&rdquo; (Mở khóa Chặng 3)
                          </div>
                          <p className="text-[11px] text-indigo-900/75 font-medium">
                            Học sinh tải <strong>Phiếu hướng dẫn thực hiện dự án</strong> (bản PDF hoặc Word) về máy để chuẩn bị đề xuất giải pháp, quy trình và bước vào <strong>Chặng 3</strong>.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={markProjectGuideDownloaded}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                          isPart5Done
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-indigo-900 border border-indigo-200 hover:border-emerald-500'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isPart5Done ? '✓ Đã tải Phiếu hướng dẫn' : 'Xác nhận: Em đã tải phiếu'}</span>
                      </button>
                    </div>

                    {/* Hàng nút Tải PDF, Tải Word, Xem trực tiếp và Sang Chặng 3 */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={PROJECT_GUIDE_PDF_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          download="Phieu_Huong_Dan_Thuc_Hien_Du_An.pdf"
                          onClick={markProjectGuideDownloaded}
                          className="px-4 py-2.5 rounded-xl bg-linear-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Tải Phiếu hướng dẫn (.PDF)</span>
                        </a>

                        <a
                          href={PROJECT_GUIDE_DOCX_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          download="Phieu_Huong_Dan_Thuc_Hien_Du_An.docx"
                          onClick={markProjectGuideDownloaded}
                          className="px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải Phiếu hướng dẫn (.DOCX)</span>
                        </a>

                        <a
                          href={PROJECT_GUIDE_WORD_VIEW_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={markProjectGuideDownloaded}
                          className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 font-black text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Mở xem trên Word Online</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setShowProjectGuidePreview((v) => !v);
                            markProjectGuideDownloaded();
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-300" />
                          <span>{showProjectGuidePreview ? 'Thu gọn xem trước' : 'Xem trực tiếp ngay trên trang'}</span>
                        </button>
                      </div>

                      {isPart5Done && (
                        <button
                          type="button"
                          onClick={() => onGoToStage3()}
                          className="px-5 py-2.5 rounded-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Bước vào Chặng 3 ngay</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Khung xem trực tiếp Phiếu hướng dẫn thực hiện dự án (PDF / Word Online) */}
                    {showProjectGuidePreview && (
                      <div className="mt-1 bg-white rounded-2xl p-3.5 border-2 border-indigo-200 shadow-lg flex flex-col gap-3 animate-in fade-in duration-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setProjectGuidePreviewType('pdf')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                                projectGuidePreviewType === 'pdf'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>📄 Xem bản PDF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjectGuidePreviewType('doc')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                                projectGuidePreviewType === 'doc'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>📝 Xem bản Word (.DOCX)</span>
                            </button>
                          </div>

                          <a
                            href={projectGuidePreviewType === 'pdf' ? PROJECT_GUIDE_PDF_URL : PROJECT_GUIDE_WORD_VIEW_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <span>Mở toàn màn hình ở tab mới</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="w-full h-155 rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
                          <iframe
                            src={
                              projectGuidePreviewType === 'pdf'
                                ? `${PROJECT_GUIDE_PDF_URL}#toolbar=1&navpanes=0`
                                : PROJECT_GUIDE_WORD_VIEW_URL
                            }
                            title="Phiếu hướng dẫn thực hiện dự án"
                            className="w-full h-full border-0 block"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </LockedTaskBox>
            )}

            {/* Thanh tổng kết tiến độ Chặng 2 */}
            <div className="bg-white/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3 text-xs font-bold">
                <span className={isPart1Done ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {isPart1Done ? '✅' : '⏳'} Phần I: Lí thuyết
                </span>
                <span className={isPart2aDone ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {isPart2aDone ? '✅' : '⏳'} Phần II.1: TN Iodine ({isPart2aDone ? 'Xong' : 'Chưa xong'})
                </span>
                <span className={isPart2bDone ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {isPart2bDone ? '✅' : '⏳'} Phần II.2: TN Thủy phân ({isPart2bDone ? 'Xong' : 'Chưa xong'})
                </span>
                <span className={isPart3Done ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {isPart3Done ? '✅' : '⏳'} Phần III: Video + Điểm nóng ({solvedHotspotIds.size}/16)
                </span>
                <span className={isPart4Done ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {isPart4Done ? '✅' : '⏳'} Phần IV: Kiểm tra 12 câu ({isPart4Done ? `Đã nộp (${testScore}đ)` : 'Chưa nộp'})
                </span>
                <span className={isPart5Done ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {isPart5Done ? '✅' : '⏳'} Phần V: Vận dụng thực tiễn
                </span>
              </div>
              <button
                type="button"
                onClick={() => onGoToStage3()}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${isStage3Unlocked
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                  }`}
              >
                {isStage3Unlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 3: Ý tưởng &amp; Quy trình (Tại lớp)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
  );
};
