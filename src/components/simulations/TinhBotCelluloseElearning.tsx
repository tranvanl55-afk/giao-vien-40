/* cSpell:disable */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  Sparkles,
  CheckCircle2,
  XCircle,
  Play,
  Award,
  Flame,
  Droplets,
  RotateCcw,
  Microscope,
  ChevronRight,
  HelpCircle,
  Home,
  Lightbulb,
  Hammer,
  Presentation,
  Eye,
  EyeOff,
  ExternalLink,
  Puzzle,
  Lock,
  Unlock,
  Star,
  Download,
  Printer,
  FileText,
  Mail,
  Send,
  FileCheck,
  Maximize,
  Minimize,
  BarChart3,
  Table2,
  Trash2,
  RefreshCw,
  Users,
  X,
  Crown,
  User,
  Check,
  PenTool,
  Volume2,
  FolderOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Stage1View } from './tinh-bot-cellulose/stages/Stage1View';
import { Stage2View } from './tinh-bot-cellulose/stages/Stage2View';
import { Stage3View } from './tinh-bot-cellulose/stages/Stage3View';
import { Stage4View } from './tinh-bot-cellulose/stages/Stage4View';
import { Stage5View } from './tinh-bot-cellulose/stages/Stage5View';
import { Stage6View } from './tinh-bot-cellulose/stages/Stage6View';
import { NewWordsModal } from './tinh-bot-cellulose/modals/NewWordsModal';
import { ReferencesModal } from './tinh-bot-cellulose/modals/ReferencesModal';
import { StageGuideModal } from './tinh-bot-cellulose/modals/StageGuideModal';
import { NarratorOverlay } from './tinh-bot-cellulose/components/NarratorOverlay';
import {
  type StageId,
  type SavedLearningProgress,
  type Stage2TestSubmissionRecord,
  type Stage3RubricSubmissionRecord,
  type CrosswordClue,
  type Stage2DragItem,
  loadSavedLearningProgress,
  PADLET_URL,
  IDEA_DRIVE_URL,
  STAGE5_POSTER_DRIVE_URL,
  STAGE5_PRESENTATION_DRIVE_URL,
  STAGE6_SUMMARY_VIDEO_DRIVE_URL,
  PEER_ASSESSMENT_IDEA_FORM_URL,
  PEER_ASSESSMENT_BOOTH_FORM_URL,
  PROJECT_COVER_IMAGE_URL,
  WORKSHEET_PDF_URL,
  WORKSHEET_DOCX_URL,
  PROJECT_GUIDE_PDF_URL,
  PROJECT_GUIDE_DOCX_URL,
  PROJECT_GUIDE_WORD_VIEW_URL,
  INTRO_VIDEO_URL,
  PROJECT_INTRO_VIDEO_URL,
  STAGE2_PART1_VIDEO_URL,
  STAGE2_PART2_VIDEO_URL,
  STAGE2_PART2_HYDROLYSIS_VIDEO_URL,
  STAGE2_PART3_VIDEO_URL,
  NARRATOR_VIDEO_URL,
  TEACHER_PASSWORD,
  TEACHER_EMAIL,
  FIRESTORE_STAGE2_TESTS_COLLECTION,
  FIRESTORE_STAGE3_RUBRICS_COLLECTION,
  LOCAL_TESTS_CACHE_KEY,
  LOCAL_RUBRICS_CACHE_KEY,
  LEGACY_RUBRICS_CACHE_KEYS,
  LOCAL_SHEET_WEBHOOK_KEY,
  LOCAL_SEND_INDIVIDUAL_EMAIL_KEY,
  LOCAL_PROGRESS_CACHE_KEY,
  LEGACY_PROGRESS_CACHE_KEYS,
  TEACHER_SCORE_SHEET_URL,
  TEACHER_PEER_RUBRIC_SHEET_URL,
  TEACHER_SELF_RUBRIC_SHEET_URL,
  DEFAULT_GOOGLE_SHEET_WEBHOOK_URL,
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  STAGE_GUIDE_INFO,
  STAGE_DETAILED_GUIDES,
  KEYWORD_WORD_1,
  KEYWORD_WORD_2,
  FULL_KEYWORD_LETTERS,
  CROSSWORD_CLUES,
  SCIENCE_NEW_WORDS,
  PROJECT_IDEAS,
  PROCESS_STEPS,
  QUIZ_QUESTIONS,
  TASK_SPECIFIC_GUIDES,
  STAGE2_TEST_QUESTIONS,
  STAGE2_DRAG_ITEMS,
  STAGE2_PART2_IODINE_QUIZ,
  STAGE2_PART2_HYDROLYSIS_QUIZ,
  HOTSPOT_APPLICATIONS,
  ALL_TASK_IDS,
} from './tinh-bot-cellulose/lessonData';
import {
  type Stage3RubricCriterion,
  type RubricFormState,
  STAGE3_RUBRIC_CRITERIA,
  STAGE5_RUBRIC_CRITERIA,
  createInitialRubricFormState,
  getCriterionPointFromState,
  getRubricSummary,
  STAGE6_SELF_RUBRIC_CRITERIA,
  STAGE6_LEADER_RUBRIC_CRITERIA,
  STAGE6_TEAM_PRESETS,
  INITIAL_STAGE6_MEMBERS,
  type Stage6MemberRecord,
  getStage6RankInfo,
  STAGE6_TEACHER_RUBRIC_CRITERIA,
} from './tinh-bot-cellulose/rubricData';
import { LockedTaskBox } from './tinh-bot-cellulose/components/LockedTaskBox';
import { RubricInteractivePanel } from './tinh-bot-cellulose/components/RubricInteractivePanel';

interface TinhBotCelluloseElearningProps {
  onBack: () => void;
}

export function TinhBotCelluloseElearning({ onBack }: TinhBotCelluloseElearningProps) {
  const [savedProgress] = useState<SavedLearningProgress>(() => loadSavedLearningProgress());
  const [showCover, setShowCover] = useState<boolean>(true);
  const [coverBgRevealed, setCoverBgRevealed] = useState<boolean>(false);
  // Trình phát video điện ảnh xuyên suốt & Chuyển cảnh mượt mà (Unified Video Player)
  const [introVideoStep, setIntroVideoStep] = useState<'video1' | 'video2' | null>(null);
  const [isVideoFading, setIsVideoFading] = useState<boolean>(false);
  const [isIntroFullscreen, setIsIntroFullscreen] = useState<boolean>(false);
  const [isVideoCoverFit, setIsVideoCoverFit] = useState<boolean>(false);
  const [showVideoOverlay, setShowVideoOverlay] = useState<boolean>(true);
  const introPlayerRef = useRef<HTMLDivElement | null>(null);
  const overlayHideTimerRef = useRef<number | null>(null);
  const [activeStage, setActiveStage] = useState<StageId>(() => savedProgress.activeStage || 'stage-1');
  const [showStageGuideModal, setShowStageGuideModal] = useState<boolean>(false);
  const [selectedGuideStage, setSelectedGuideStage] = useState<StageId>(() => savedProgress.activeStage || 'stage-1');
  const [isNarratorExpanded, setIsNarratorExpanded] = useState<boolean>(true);
  const [stageLockMessage, setStageLockMessage] = useState<string | null>(null);
  const [showReferencesModal, setShowReferencesModal] = useState<boolean>(false);
  const [showNewWordsModal, setShowNewWordsModal] = useState<boolean>(false);
  // Chế độ Học sinh (khóa theo chặng) vs Chế độ Giáo viên (xem tất cả các chặng, pass: 01011993)
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [isJudgeMode, setIsJudgeMode] = useState<boolean>(false);
  const [showTeacherModal, setShowTeacherModal] = useState<boolean>(false);
  const [teacherPassInput, setTeacherPassInput] = useState<string>('');
  const [teacherPassError, setTeacherPassError] = useState<string | null>(null);
  const [showTeacherDashboard, setShowTeacherDashboard] = useState<boolean>(false);
  const [teacherDashboardTab, setTeacherDashboardTab] = useState<'rubrics' | 'tests'>('rubrics');
  const [dashboardTestRecords, setDashboardTestRecords] = useState<Stage2TestSubmissionRecord[]>([]);
  const [dashboardRubricRecords, setDashboardRubricRecords] = useState<Stage3RubricSubmissionRecord[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(false);
  const [dashboardLoadWarning, setDashboardLoadWarning] = useState<string | null>(null);
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState<string>('');
  const [dashboardClassFilter, setDashboardClassFilter] = useState<string>('ALL');
  const [showSheetHelp, setShowSheetHelp] = useState<boolean>(false);
  const [scriptCopied, setScriptCopied] = useState<boolean>(false);
  const [sheetTestFeedback, setSheetTestFeedback] = useState<string | null>(null);
  const [googleSheetWebhookUrl, setGoogleSheetWebhookUrl] = useState<string>(() => {
    try {
      const urlParam = new URLSearchParams(window.location.search).get('webhook')?.trim();
      if (urlParam && urlParam.startsWith('https://')) {
        window.localStorage.setItem(LOCAL_SHEET_WEBHOOK_KEY, urlParam);
        return urlParam;
      }
      return window.localStorage.getItem(LOCAL_SHEET_WEBHOOK_KEY) || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
    } catch {
      return DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
    }
  });
  const [sendIndividualEmails, setSendIndividualEmails] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(LOCAL_SEND_INDIVIDUAL_EMAIL_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [unlockedTaskIds, setUnlockedTaskIds] = useState<Set<string>>(() =>
    savedProgress.unlockedTaskIds && savedProgress.unlockedTaskIds.length > 0
      ? new Set(savedProgress.unlockedTaskIds)
      : new Set(['task-s1-padlet'])
  );
  const [everUnlockedTaskIds, setEverUnlockedTaskIds] = useState<Set<string>>(() =>
    savedProgress.everUnlockedTaskIds && savedProgress.everUnlockedTaskIds.length > 0
      ? new Set(savedProgress.everUnlockedTaskIds)
      : new Set(['task-s1-padlet'])
  );
  const [unlockedClueIds, setUnlockedClueIds] = useState<Set<string>>(() => new Set());
  const [unlockedQuizIds, setUnlockedQuizIds] = useState<Set<string>>(() => new Set());

  // Chặng 1: Khởi động
  const [showPadletEmbed, setShowPadletEmbed] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState(() => savedProgress.teamNameInput || '');
  const [padletConfirmed, setPadletConfirmed] = useState(() => Boolean(savedProgress.padletConfirmed));
  const [clueInputs, setClueInputs] = useState<Record<string, string>>({});
  const [solvedClueIds, setSolvedClueIds] = useState<Set<string>>(
    () => new Set(savedProgress.solvedClueIds || [])
  );
  const [clueFeedback, setClueFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [placedKeywordSlots, setPlacedKeywordSlots] = useState<Set<number>>(
    () => new Set(savedProgress.placedKeywordSlots || [])
  );
  const [usedTileIndices, setUsedTileIndices] = useState<Set<number>>(
    () => new Set(savedProgress.usedTileIndices || [])
  );
  const [activeKeywordSlot, setActiveKeywordSlot] = useState<number>(0);
  const [draggedTileIdx, setDraggedTileIdx] = useState<number | null>(null);
  const [dragOverSlotIdx, setDragOverSlotIdx] = useState<number | null>(null);

  // Chặng 2: Kiến thức nền (Tự học tại nhà theo thứ tự Bước đầu -> Phần I -> Phần II -> Phần III -> Phần IV)
  // Bước đầu tiên: Tải & Chuẩn bị phiếu ghi bài
  const [worksheetDownloaded, setWorksheetDownloaded] = useState<boolean>(
    () => Boolean(savedProgress.worksheetDownloaded)
  );
  const [showWorksheetPreview, setShowWorksheetPreview] = useState<boolean>(false);
  const [worksheetPreviewType, setWorksheetPreviewType] = useState<'pdf' | 'doc'>('pdf');
  const [showWorksheetGuide, setShowWorksheetGuide] = useState<boolean>(false);

  // Phần I: Xem video + Kéo thả tính chất vật lí & trạng thái tự nhiên
  const [video1Playing, setVideo1Playing] = useState(true);
  const [video1Watched, setVideo1Watched] = useState(() => Boolean(savedProgress.video1Watched));
  const [shuffledDragItems] = useState<Stage2DragItem[]>(() =>
    [...STAGE2_DRAG_ITEMS].sort(() => Math.random() - 0.5),
  );
  const [dragPlacements, setDragPlacements] = useState<Record<string, 'starch' | 'cellulose'>>(
    () => savedProgress.dragPlacements || {}
  );
  const [draggedPropId, setDraggedPropId] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<'starch' | 'cellulose' | null>(null);
  const [dragFeedback, setDragFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  // Phần II.1: Phản ứng màu với Iodine (Thí nghiệm + Bài tập)
  const [iodineVideoUrl, setIodineVideoUrl] = useState<string>(STAGE2_PART2_VIDEO_URL);
  const [showIodineVideoInput, setShowIodineVideoInput] = useState<boolean>(false);
  const [videoIodineWatched, setVideoIodineWatched] = useState<boolean>(
    () => Boolean(savedProgress.videoIodineWatched)
  );
  const [hasAddedIodine, setHasAddedIodine] = useState(() => Boolean(savedProgress.hasAddedIodine));
  const [clampPositionPct, setClampPositionPct] = useState<number>(() =>
    savedProgress.hasAddedIodine ? 33 : 33
  );
  const [isDraggingClamp, setIsDraggingClamp] = useState<boolean>(false);
  const [hasAddedStarch, setHasAddedStarch] = useState<boolean>(() => Boolean(savedProgress.hasAddedIodine));
  const [iodineTubeState, setIodineTubeState] = useState<'initial' | 'blue'>(() =>
    savedProgress.hasAddedIodine ? 'blue' : 'initial'
  );
  const [iodineLabAnimating, setIodineLabAnimating] = useState<
    'none' | 'dropping_starch' | 'dropping_iodine'
  >('none');
  const [iodineLabHint, setIodineLabHint] = useState<{
    text: string;
    type: 'info' | 'warning' | 'success';
  }>(() =>
    savedProgress.hasAddedIodine
      ? {
        text: '✓ Hoàn thành thí nghiệm: Dung dịch chuyển sang màu xanh tím đặc trưng!',
        type: 'success',
      }
      : {
        text: 'Bước 1: Kéo kẹp ống nghiệm lên đúng vị trí 1/3 tính từ miệng ống nghiệm (vùng vạch xanh 33%) để cố định ống nghiệm an toàn trước khi lấy hóa chất.',
        type: 'info',
      }
  );
  const testTubeTrackRef = useRef<HTMLDivElement | null>(null);
  const iodineLabTimerRef = useRef<number | null>(null);
  const [iodineBlank1, setIodineBlank1] = useState<string>('');
  const [iodineBlank2, setIodineBlank2] = useState<string>('');
  const [iodineBlanksChecked, setIodineBlanksChecked] = useState<boolean>(false);

  const isIodineBlank1Right = ['xanh tím', 'xanh tim', 'màu xanh tím', 'mau xanh tim'].includes(
    iodineBlank1.trim().toLowerCase()
  );
  const isIodineBlank2Right = [
    'tinh bột',
    'tinh bot',
    'hồ tinh bột',
    'ho tinh bot',
  ].includes(iodineBlank2.trim().toLowerCase());
  const isAllIodineBlanksRight = isIodineBlank1Right && isIodineBlank2Right;

  const isClampAtOneThird = clampPositionPct >= 27 && clampPositionPct <= 39;

  useEffect(() => {
    return () => {
      if (iodineLabTimerRef.current) {
        window.clearTimeout(iodineLabTimerRef.current);
      }
    };
  }, []);

  const updateClampPosition = (nextPct: number, snapAndFeedback = false) => {
    if (hasAddedStarch || hasAddedIodine) {
      setIodineLabHint({
        text: '⚠️ Đã cho hóa chất vào ống nghiệm, không dịch chuyển kẹp lúc này. Bấm "Làm lại TN ảo" nếu muốn thao tác lại từ đầu.',
        type: 'warning',
      });
      return;
    }
    const clamped = Math.max(8, Math.min(86, Math.round(nextPct)));
    const inTargetZone = clamped >= 27 && clamped <= 39;
    const finalPct = snapAndFeedback && inTargetZone ? 33 : clamped;
    setClampPositionPct(finalPct);

    if (inTargetZone) {
      setIodineLabHint({
        text: '✓ Chuẩn quy tắc phòng thí nghiệm! Kẹp đã giữ ở 1/3 từ miệng ống nghiệm. Bây giờ hãy bấm vào Cốc "Tinh bột" (hoặc nút Bước 2) để cho hồ tinh bột vào ống nghiệm!',
        type: 'success',
      });
    } else if (clamped < 27) {
      setIodineLabHint({
        text: `⚠️ Kẹp đang ở quá sát miệng ống (${clamped}% từ miệng). Kẹp quá cao dễ làm tuột rơi vỡ ống nghiệm! Hãy kéo xuống vùng 1/3 từ miệng ống (khoảng 33%).`,
        type: 'warning',
      });
    } else {
      setIodineLabHint({
        text: `⚠️ Kẹp đang ở quá thấp (${clamped}% từ miệng ống). Kẹp gần đáy sẽ che khuất hóa chất và dễ nóng chảy/nứt khi đun! Hãy kéo lên đúng 1/3 tính từ miệng ống (33%).`,
        type: 'warning',
      });
    }
  };

  const handleAddStarchToTube = () => {
    if (!isClampAtOneThird) {
      setIodineLabHint({
        text: '🔒 Chưa thể lấy Tinh bột! Em phải kéo kẹp ống nghiệm vào đúng vị trí 1/3 từ miệng ống nghiệm (vùng vạch xanh 33%) trước.',
        type: 'warning',
      });
      return;
    }
    if (hasAddedStarch || iodineLabAnimating !== 'none') return;
    setClampPositionPct(33);
    setIodineLabAnimating('dropping_starch');
    setIodineLabHint({
      text: '💧 Đang dùng ống hút nhỏ giọt lấy dung dịch Hồ tinh bột (trắng đục) cho vào ống nghiệm...',
      type: 'info',
    });
    if (iodineLabTimerRef.current) window.clearTimeout(iodineLabTimerRef.current);
    iodineLabTimerRef.current = window.setTimeout(() => {
      setHasAddedStarch(true);
      setIodineLabAnimating('none');
      setIodineLabHint({
        text: '✓ Đã cho Hồ tinh bột vào ống nghiệm! Tiếp theo (Bước 3): Bấm vào lọ "DD Iốt" màu nâu để nhỏ vài giọt dung dịch Iodine vào ống nghiệm.',
        type: 'success',
      });
    }, 950);
  };

  const handleAddIodineToTube = () => {
    if (!isClampAtOneThird) {
      setIodineLabHint({
        text: '🔒 Chưa thể nhỏ Iodine! Hãy kéo kẹp ống nghiệm đúng vị trí 1/3 từ miệng ống nghiệm trước.',
        type: 'warning',
      });
      return;
    }
    if (!hasAddedStarch) {
      setIodineLabHint({
        text: '🔒 Ống nghiệm chưa có tinh bột! Hãy bấm vào Cốc "Tinh bột" (Bước 2) để cho hồ tinh bột vào ống nghiệm trước khi nhỏ Iodine.',
        type: 'warning',
      });
      return;
    }
    if (hasAddedIodine || iodineLabAnimating !== 'none') return;
    setIodineLabAnimating('dropping_iodine');
    setIodineLabHint({
      text: '💧 Đang nhỏ từng giọt dung dịch Iodine (I₂ màu nâu đỏ) vào ống nghiệm chứa hồ tinh bột...',
      type: 'info',
    });
    if (iodineLabTimerRef.current) window.clearTimeout(iodineLabTimerRef.current);
    iodineLabTimerRef.current = window.setTimeout(() => {
      setHasAddedIodine(true);
      setIodineTubeState('blue');
      setIodineLabAnimating('none');
      setIodineLabHint({
        text: '🎉 Hiện tượng xuất hiện: Dung dịch hồ tinh bột chuyển sang MÀU XANH TÍM đặc trưng khi gặp dung dịch Iodine! Em hãy hoàn thành phần kết luận và trắc nghiệm bên dưới.',
        type: 'success',
      });
      confetti({ particleCount: 45, spread: 50, origin: { y: 0.65 } });
    }, 1050);
  };

  const handleResetIodineLab = () => {
    if (iodineLabTimerRef.current) window.clearTimeout(iodineLabTimerRef.current);
    setClampPositionPct(72);
    setHasAddedStarch(false);
    setHasAddedIodine(false);
    setIodineTubeState('initial');
    setIodineLabAnimating('none');
    setIodineLabHint({
      text: 'Bước 1: Kéo kẹp ống nghiệm lên đúng vị trí 1/3 tính từ miệng ống nghiệm (vùng vạch xanh 33%) để mở khóa thao tác lấy hóa chất.',
      type: 'info',
    });
  };
  const [iodineQuizAnswers, setIodineQuizAnswers] = useState<Record<string, number>>(
    () => savedProgress.iodineQuizAnswers || {}
  );
  const [iodineQuizSubmitted, setIodineQuizSubmitted] = useState<boolean>(
    () => Boolean(savedProgress.iodineQuizSubmitted)
  );

  // Phần II.2: Phản ứng Thủy phân (Clip TN, Động học Canvas, PTHH & Bài tập)
  const [hydrolysisVideoUrl, setHydrolysisVideoUrl] = useState<string>(STAGE2_PART2_HYDROLYSIS_VIDEO_URL);
  const [showHydroVideoInput, setShowHydroVideoInput] = useState<boolean>(false);
  const [videoHydroWatched, setVideoHydroWatched] = useState<boolean>(
    () => Boolean(savedProgress.videoHydroWatched)
  );
  const [hydrolysisDone, setHydrolysisDone] = useState(() => Boolean(savedProgress.hydrolysisDone));
  const [canvasIframeKey, setCanvasIframeKey] = useState(0);
  const [hydroQuizAnswers, setHydroQuizAnswers] = useState<Record<string, number>>(
    () => savedProgress.hydroQuizAnswers || {}
  );
  const [hydroQuizSubmitted, setHydroQuizSubmitted] = useState<boolean>(
    () => Boolean(savedProgress.hydroQuizSubmitted)
  );

  // Điền khuyết PTHH & Hiện tượng Thủy phân Tinh bột & Cellulose
  const [hydroBlank1, setHydroBlank1] = useState<string>('');
  const [hydroBlank2, setHydroBlank2] = useState<string>('');
  const [hydroBlank3, setHydroBlank3] = useState<string>('');
  const [hydroBlank4, setHydroBlank4] = useState<string>('');
  const [hydroBlanksChecked, setHydroBlanksChecked] = useState<boolean>(false);

  const isHydroBlank1Right = [
    'c6h12o6',
    'c₆h₁₂o₆',
    'c 6 h 12 o 6',
    'c₆h₁₂o₆(glucose)',
    'glucose',
  ].includes(hydroBlank1.trim().toLowerCase().replace(/\s+/g, ''));

  const isHydroBlank2Right = [
    'acid',
    'axit',
    'hcl',
    'h2so4',
    'h₂so₄',
    'acid/t°',
    'axit/t°',
    'xúc tác acid',
    'axit loãng',
  ].includes(hydroBlank2.trim().toLowerCase());

  const isHydroBlank3Right = [
    'enzyme',
    'men',
    'men enzyme',
    'enzim',
    'amylase',
    'men tiêu hóa',
  ].includes(hydroBlank3.trim().toLowerCase());

  const isHydroBlank4Right = [
    'glucose',
    'glucozo',
    'đường glucose',
    'duong glucose',
    'đường glucozo',
    'glucozơ',
  ].includes(hydroBlank4.trim().toLowerCase());

  const isAllHydroBlanksRight =
    isHydroBlank1Right && isHydroBlank2Right && isHydroBlank3Right && isHydroBlank4Right;

  // Phần III: Ứng dụng (Video 1 bên, Điểm nóng 1 bên)
  const [appVideoUrl, setAppVideoUrl] = useState<string>(STAGE2_PART3_VIDEO_URL);
  const [showAppVideoInput, setShowAppVideoInput] = useState<boolean>(false);
  const [video3Playing, setVideo3Playing] = useState(false);
  const [video3Watched, setVideo3Watched] = useState(() => Boolean(savedProgress.video3Watched));
  const [activeHotspotId, setActiveHotspotId] = useState<string>('hs-1');
  const [hotspotMode, setHotspotMode] = useState<'starch' | 'cellulose'>('starch');
  const [hotspotSelections, setHotspotSelections] = useState<Record<string, string>>(
    () => savedProgress.hotspotSelections || {}
  );
  const [solvedHotspotIds, setSolvedHotspotIds] = useState<Set<string>>(
    () => new Set(savedProgress.solvedHotspotIds || [])
  );
  const [hotspotFeedback, setHotspotFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);


  // Phần IV: Bài kiểm tra 12 câu đánh giá Chặng 2 (Gửi kết quả về email thầy Trần Văn Lĩnh: tranvanl55@gmail.com)
  const [testStudentName, setTestStudentName] = useState<string>(() => savedProgress.testStudentName || '');
  const [testStudentClass, setTestStudentClass] = useState<string>(() => savedProgress.testStudentClass || '');
  const [testStudentSchool, setTestStudentSchool] = useState<string>(() => savedProgress.testStudentSchool || 'THCS');
  const [testMcAnswers, setTestMcAnswers] = useState<Record<number, number>>(
    () => savedProgress.testMcAnswers || {}
  );
  const [testTfAnswers, setTestTfAnswers] = useState<Record<string, boolean>>(
    () => savedProgress.testTfAnswers || {}
  );
  const [testFillAnswers, setTestFillAnswers] = useState<Record<string, string>>(
    () => savedProgress.testFillAnswers || {}
  );
  const [testMatchingAnswers, setTestMatchingAnswers] = useState<Record<string, string>>(
    () => savedProgress.testMatchingAnswers || {}
  ); // 'c10_1': 'A'
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(() => Boolean(savedProgress.isTestSubmitted));
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailSendStatus, setEmailSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testScore, setTestScore] = useState<number>(() => {
    const saved = savedProgress.testScore ?? 0;
    return saved > 10 ? Math.round((saved / 12) * 10 * 10) / 10 : saved;
  });
  const [testFeedbackMessage, setTestFeedbackMessage] = useState<string | null>(null);

  // Hàm tính điểm bài kiểm tra 12 câu quy về thang điểm 10
  const calculateTestScore = useCallback(() => {
    let rawScore = 0;
    STAGE2_TEST_QUESTIONS.forEach((q) => {
      if (q.type === 'multiple_choice') {
        if (testMcAnswers[q.id] === q.correctOptionIndex) rawScore += 1;
      } else if (q.type === 'true_false' && q.subStatements) {
        const correctCount = q.subStatements.filter((sub) => testTfAnswers[sub.id] === sub.isCorrect).length;
        if (correctCount === q.subStatements.length) rawScore += 1;
        else if (correctCount >= 3) rawScore += 0.75;
        else if (correctCount >= 2) rawScore += 0.5;
        else if (correctCount >= 1) rawScore += 0.25;
      } else if (q.type === 'fill_in' && q.blanks) {
        let blankCorrect = 0;
        q.blanks.forEach((b) => {
          const userVal = (testFillAnswers[b.id] || '').trim().toLowerCase();
          if (b.acceptedAnswers.some((ans) => ans.toLowerCase() === userVal)) {
            blankCorrect += 1;
          }
        });
        rawScore += blankCorrect / q.blanks.length;
      } else if (q.type === 'matching' && q.matchingPairs) {
        let matchCorrect = 0;
        q.matchingPairs.forEach((pair) => {
          const userKey = testMatchingAnswers[`c${q.id}_${pair.id}`];
          if (userKey === pair.rightKey) matchCorrect += 1;
        });
        rawScore += matchCorrect / q.matchingPairs.length;
      }
    });
    // Quy đổi về thang điểm 10 (12 câu -> thang 10 điểm)
    const normalizedScore = (rawScore / STAGE2_TEST_QUESTIONS.length) * 10;
    return Math.round(normalizedScore * 10) / 10;
  }, [testMcAnswers, testTfAnswers, testFillAnswers, testMatchingAnswers]);

  const readLocalRecords = useCallback(<T,>(key: string): T[] => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }, []);

  const persistSubmissionRecord = useCallback(
    async <T extends { id: string; createdAtMs: number }>(
      collectionName: string,
      localKey: string,
      recordWithoutId: Omit<T, 'id'>,
      sheetPayload: Record<string, unknown>
    ): Promise<{
      cloudSaved: boolean;
      cloudError: string | null;
      sheetSent: boolean;
      sheetConfigured: boolean;
    }> => {
      const tempLocalId = `local-${recordWithoutId.createdAtMs}-${Math.random().toString(36).slice(2, 7)}`;
      const localRecord = { id: tempLocalId, ...recordWithoutId } as T;
      try {
        const prev = readLocalRecords<T>(localKey);
        window.localStorage.setItem(localKey, JSON.stringify([localRecord, ...prev].slice(0, 300)));
      } catch {
        // Bỏ qua nếu localStorage đầy
      }

      let cloudSaved = false;
      let cloudError: string | null = null;
      try {
        await addDoc(collection(db, collectionName), recordWithoutId);
        cloudSaved = true;
      } catch (err) {
        cloudSaved = false;
        const rawErr = err instanceof Error ? err.message : String(err);
        cloudError = rawErr.includes('permission') || rawErr.includes('PERMISSION_DENIED')
          ? 'Firestore chưa mở quyền ghi (cần deploy firestore.rules)'
          : 'Không kết nối được Cloud Firestore';
      }

      const webhook = googleSheetWebhookUrl.trim();
      const sheetConfigured = Boolean(webhook);
      let sheetSent = false;
      if (webhook) {
        try {
          await fetch(webhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(sheetPayload),
          });
          sheetSent = true;
        } catch {
          sheetSent = false;
        }
      }

      return { cloudSaved, cloudError, sheetSent, sheetConfigured };
    },
    [googleSheetWebhookUrl, readLocalRecords]
  );

  const buildSubmissionFeedbackMessage = useCallback(
    (
      itemLabel: string,
      hubResult: {
        cloudSaved: boolean;
        cloudError: string | null;
        sheetSent: boolean;
        sheetConfigured: boolean;
      },
      emailOk: boolean
    ): { ok: boolean; text: string } => {
      const remoteChannels = [
        hubResult.cloudSaved ? 'Bảng Tổng hợp GV (Cloud)' : null,
        hubResult.sheetSent ? 'Google Sheets' : null,
        emailOk ? `Email ${TEACHER_EMAIL}` : null,
      ].filter(Boolean);

      if (remoteChannels.length > 0) {
        return {
          ok: true,
          text: `✅ Đã gửi ${itemLabel} thành công tới: ${remoteChannels.join(' + ')}!`,
        };
      }

      const missingReasons = [
        hubResult.cloudError || 'Cloud Firestore chưa ghi được',
        hubResult.sheetConfigured
          ? 'Google Sheets gặp lỗi mạng khi gửi'
          : 'Chưa dán Link Web App Apps Script trong Bảng Tổng hợp GV',
        sendIndividualEmails ? 'Email FormSubmit chưa xác nhận/lỗi mạng' : 'Gửi Email lẻ đang TẮT',
      ];
      return {
        ok: false,
        text: `⚠️ Mới chỉ lưu ${itemLabel} trên máy này (xem trong Bảng Tổng hợp GV), CHƯA gửi ra ngoài được vì: ${missingReasons.join(' • ')}. Thầy mở "📊 Bảng Tổng hợp GV" để cấu hình hoặc bấm "Mailto dự phòng"!`,
      };
    },
    [sendIndividualEmails]
  );

  const sendOptionalTeacherEmail = useCallback(async (emailPayload: Record<string, unknown>): Promise<boolean> => {
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TEACHER_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  const fetchTeacherDashboardData = useCallback(async () => {
    setIsLoadingDashboard(true);
    setDashboardLoadWarning(null);

    const mergeWithLocal = <T extends { id: string; createdAtMs: number }>(
      cloudItems: T[],
      localItems: T[]
    ): T[] => {
      const seenMs = new Set(cloudItems.map((it) => it.createdAtMs));
      const uniqueLocal = localItems.filter((it) => !seenMs.has(it.createdAtMs));
      return [...cloudItems, ...uniqueLocal].sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
    };

    const localTests = readLocalRecords<Stage2TestSubmissionRecord>(LOCAL_TESTS_CACHE_KEY);
    const localRubrics = readLocalRecords<Stage3RubricSubmissionRecord>(LOCAL_RUBRICS_CACHE_KEY);

    try {
      const [testsSnap, rubricsSnap] = await Promise.all([
        getDocs(query(collection(db, FIRESTORE_STAGE2_TESTS_COLLECTION), orderBy('createdAtMs', 'desc'))),
        getDocs(query(collection(db, FIRESTORE_STAGE3_RUBRICS_COLLECTION), orderBy('createdAtMs', 'desc'))),
      ]);

      const cloudTests: Stage2TestSubmissionRecord[] = testsSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Stage2TestSubmissionRecord, 'id'>),
      }));
      const cloudRubrics: Stage3RubricSubmissionRecord[] = rubricsSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Stage3RubricSubmissionRecord, 'id'>),
      }));

      setDashboardTestRecords(mergeWithLocal(cloudTests, localTests));
      setDashboardRubricRecords(mergeWithLocal(cloudRubrics, localRubrics));
    } catch {
      setDashboardTestRecords(localTests);
      setDashboardRubricRecords(localRubrics);
      setDashboardLoadWarning(
        'Đang hiển thị dữ liệu lưu cục bộ trên máy này (không kết nối được Firestore hoặc Firestore chưa cấp quyền đọc/ghi công khai).'
      );
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [readLocalRecords]);

  const handleDeleteDashboardRecord = async (type: 'tests' | 'rubrics', id: string) => {
    const colName =
      type === 'tests' ? FIRESTORE_STAGE2_TESTS_COLLECTION : FIRESTORE_STAGE3_RUBRICS_COLLECTION;
    const localKey = type === 'tests' ? LOCAL_TESTS_CACHE_KEY : LOCAL_RUBRICS_CACHE_KEY;

    if (!id.startsWith('local-')) {
      try {
        await deleteDoc(doc(db, colName, id));
      } catch {
        // Bỏ qua nếu không xóa được trên cloud
      }
    }
    if (type === 'tests') {
      setDashboardTestRecords((prev) => {
        const next = prev.filter((item) => item.id !== id);
        try {
          window.localStorage.setItem(localKey, JSON.stringify(next.filter((i) => i.id.startsWith('local-'))));
        } catch {
          // ignore
        }
        return next;
      });
    } else {
      setDashboardRubricRecords((prev) => {
        const next = prev.filter((item) => item.id !== id);
        try {
          window.localStorage.setItem(localKey, JSON.stringify(next.filter((i) => i.id.startsWith('local-'))));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

  const exportRecordsToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const escapeCell = (val: string | number) => {
      const str = String(val ?? '').replace(/\r?\n/g, ' ');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const csvLines = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))];
    const blob = new Blob(['\uFEFF' + csvLines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Hàm nộp bài kiểm tra 12 câu -> Lưu tập trung về Bảng Tổng hợp GV (+ tùy chọn Email / Google Sheet)
  const handleSendTestToTeacherEmail = async () => {
    if (!testStudentName.trim()) {
      alert('Vui lòng nhập đầy đủ Họ và tên học sinh trước khi nộp bài!');
      return;
    }
    const finalScore = calculateTestScore();
    setTestScore(finalScore);
    setIsTestSubmitted(true);
    setIsSendingEmail(true);
    setEmailSendStatus('idle');

    if (finalScore >= 8) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    const nowMs = Date.now();
    const submissionTime = new Date(nowMs).toLocaleString('vi-VN');
    const percentVal = Math.round((finalScore / 10) * 100);
    const rankLabel =
      finalScore >= 9 ? 'Xuất sắc' : finalScore >= 8 ? 'Giỏi' : finalScore >= 6.5 ? 'Khá' : finalScore >= 5 ? 'Đạt' : 'Cần ôn tập thêm';

    const hubResult = await persistSubmissionRecord<Stage2TestSubmissionRecord>(
      FIRESTORE_STAGE2_TESTS_COLLECTION,
      LOCAL_TESTS_CACHE_KEY,
      {
        studentName: testStudentName.trim(),
        studentClass: testStudentClass.trim() || 'Chưa ghi',
        studentSchool: testStudentSchool.trim() || 'THCS',
        score: finalScore,
        maxScore: 10,
        percent: percentVal,
        rank: rankLabel,
        submittedAt: submissionTime,
        createdAtMs: nowMs,
      },
      {
        sheetType: 'stage2_test',
        submittedAt: submissionTime,
        studentName: testStudentName.trim(),
        studentClass: testStudentClass.trim() || 'Chưa ghi',
        studentSchool: testStudentSchool.trim() || 'THCS',
        score: finalScore,
        maxScore: 10,
        percent: `${percentVal}%`,
        rank: rankLabel,
      }
    );

    let emailOk = false;
    if (sendIndividualEmails) {
      const emailPayload = {
        _subject: `[KHTN 9] Bài kiểm tra Chặng 2 (Tinh bột & Cellulose) - HS: ${testStudentName} - Lớp ${testStudentClass || 'KHTN 9'}`,
        'Họ và tên học sinh': testStudentName,
        Lớp: testStudentClass || 'Chưa ghi',
        Trường: testStudentSchool || 'THCS',
        'Thời gian nộp bài': submissionTime,
        'Điểm số đạt được': `${finalScore} / 10 điểm (${percentVal}%)`,
        'Nhận xét hệ thống': rankLabel,
        'Chi tiết câu 1 (ABCD)': testMcAnswers[1] === 1 ? 'Đúng' : 'Sai',
        'Chi tiết câu 2 (ABCD)': testMcAnswers[2] === 2 ? 'Đúng' : 'Sai',
        'Chi tiết câu 3 (ABCD)': testMcAnswers[3] === 1 ? 'Đúng' : 'Sai',
        'Chi tiết câu 7 (Điền khuyết)': `Ô 1: ${testFillAnswers['b7_1'] || ''} | Ô 2: ${testFillAnswers['b7_2'] || ''}`,
        'Chi tiết câu 8 (Điền khuyết)': `${testFillAnswers['b8_1'] || ''}`,
        'Chi tiết câu 9 (Điền khuyết)': `Ô 1: ${testFillAnswers['b9_1'] || ''} | Ô 2: ${testFillAnswers['b9_2'] || ''}`,
      };
      emailOk = await sendOptionalTeacherEmail(emailPayload);
    }

    const feedback = buildSubmissionFeedbackMessage('kết quả bài kiểm tra', hubResult, emailOk);
    setEmailSendStatus(feedback.ok ? 'success' : 'error');
    setTestFeedbackMessage(feedback.text);
    setIsSendingEmail(false);
  };

  // Phần V: Vận dụng kiến thức & Mở rộng thực tiễn (Tải Phiếu hướng dẫn thực hiện dự án để bước vào Chặng 3)
  const [ansQ1, setAnsQ1] = useState(() => savedProgress.ansQ1 || '');
  const [showSampleQ1, setShowSampleQ1] = useState(false);
  const [ansQ2, setAnsQ2] = useState(() => savedProgress.ansQ2 || '');
  const [showSampleQ2, setShowSampleQ2] = useState(false);
  const [checkedHomeItems, setCheckedHomeItems] = useState<Set<string>>(
    () => new Set(savedProgress.checkedHomeItems || [])
  );
  const [stage2SteamSubmitted, setStage2SteamSubmitted] = useState<boolean>(
    () => (savedProgress.checkedHomeItems?.length ?? 0) >= 2
  );
  const [showProjectGuidePreview, setShowProjectGuidePreview] = useState<boolean>(false);
  const [projectGuidePreviewType, setProjectGuidePreviewType] = useState<'pdf' | 'doc'>('pdf');

  const markProjectGuideDownloaded = () => {
    setStage2SteamSubmitted(true);
    setCheckedHomeItems(new Set(['home-food', 'home-books']));
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.65 } });
  };

  // Chặng 3: Xây dựng ý tưởng & Quy trình & Đánh giá Rubric + Form đồng đẳng (Tại lớp)
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(() => savedProgress.selectedIdeaId ?? null);
  const [ideaDriveSubmitted, setIdeaDriveSubmitted] = useState<boolean>(
    () => Boolean(savedProgress.ideaDriveSubmitted)
  );
  const [presenterName, setPresenterName] = useState<string>(
    () => savedProgress.presenterName || ''
  );
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(
    () => new Set(savedProgress.checkedSteps || [])
  );
  const [peerIdeaFormUrl, setPeerIdeaFormUrl] = useState<string>(PEER_ASSESSMENT_IDEA_FORM_URL);
  const [peerIdeaConfirmed, setPeerIdeaConfirmed] = useState<boolean>(
    () => Boolean(savedProgress.peerIdeaConfirmed)
  );
  const [stage3RubricState, setStage3RubricState] = useState<RubricFormState>(() =>
    createInitialRubricFormState()
  );
  const [stage3AssessTab, setStage3AssessTab] = useState<'rubric' | 'form'>('rubric');
  const [stage6SummaryVideoConfirmed, setStage6SummaryVideoConfirmed] = useState<boolean>(false);

  useEffect(() => {
    try {
      LEGACY_RUBRICS_CACHE_KEYS.forEach((cacheKey) => {
        window.localStorage.removeItem(cacheKey);
      });
    } catch {
      // ignore
    }
  }, []);

  // Chặng 4: Hoàn thiện sản phẩm (Tại nhà)
  const [homeChecks, setHomeChecks] = useState<Set<string>>(() => new Set(savedProgress.homeChecks || []));
  const [productSubmitted, setProductSubmitted] = useState(() => Boolean(savedProgress.productSubmitted));

  // Chặng 5: Ngày hội xanh & Đánh giá Rubric (3 Tiêu chí × 5 Mức) + Form Đồng đẳng (Báo cáo tại lớp)
  const [boothChecks, setBoothChecks] = useState<Set<string>>(() => new Set(savedProgress.boothChecks || []));
  const [stage5PresentationSubmitted, setStage5PresentationSubmitted] = useState<boolean>(
    () => Boolean(savedProgress.voteConfirmed)
  );
  const [peerBoothFormUrl, setPeerBoothFormUrl] = useState<string>(PEER_ASSESSMENT_BOOTH_FORM_URL);
  const [voteConfirmed, setVoteConfirmed] = useState(() => Boolean(savedProgress.voteConfirmed));
  const [stage5RubricState, setStage5RubricState] = useState<RubricFormState>(() =>
    createInitialRubricFormState()
  );
  const [stage5AssessTab, setStage5AssessTab] = useState<'rubric' | 'form'>('rubric');

  // Chặng 6: Tổng kết dự án
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>(
    () => savedProgress.quizAnswers || {}
  );
  const [quizSubmitted, setQuizSubmitted] = useState(() => Boolean(savedProgress.quizSubmitted));
  const [stage6GameMode, setStage6GameMode] = useState<'pose_game' | 'quiz'>('pose_game');
  const [poseGameKey, setPoseGameKey] = useState(0);
  const [isPoseGameUnlocked, setIsPoseGameUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem('pose_game_unlocked') === 'true';
  });
  const [poseGamePassInput, setPoseGamePassInput] = useState<string>('');
  const [poseGamePassError, setPoseGamePassError] = useState<string | null>(null);

  // Chặng 6.2: Đánh giá dự án (Học sinh tự đánh giá, Nhóm trưởng đánh giá, Giáo viên đánh giá)
  const [stage6AssessTab, setStage6AssessTab] = useState<'self' | 'leader' | 'teacher'>('self');
  const [stage6SelectedTeamPreset, setStage6SelectedTeamPreset] = useState<string>(
    () => savedProgress.stage6SelectedTeamPreset || 'team-ngan'
  );
  const [stage6SubmitFeedback, setStage6SubmitFeedback] = useState<Record<string, { ok: boolean; text: string }>>({});

  // Phân hệ 1: Học sinh tự đánh giá (Mặc định: Nhóm trưởng Nguyễn Thuý Ngân)
  const [stage6SelfStudentName, setStage6SelfStudentName] = useState<string>(
    () => savedProgress.stage6SelfStudentName || 'Nguyễn Thuý Ngân'
  );
  const [stage6SelfClass, setStage6SelfClass] = useState<string>(
    () => savedProgress.stage6SelfClass || '9A'
  );
  const [stage6SelfGroup, setStage6SelfGroup] = useState<string>(
    () => savedProgress.stage6SelfGroup || 'Nhóm 1 - Hóa Học Xanh (Green Chem)'
  );
  const [stage6SelfDate, setStage6SelfDate] = useState<string>(
    () => savedProgress.stage6SelfDate || '13/11/2026'
  );
  const [stage6SelfScores, setStage6SelfScores] = useState<Record<string, number>>(
    () =>
      savedProgress.stage6SelfScores || {
        s6_self_padlet: 2.5,
        s6_self_knowledge: 2.5,
        s6_self_practice: 2.4,
        s6_self_coop: 2.0,
      }
  );
  const [stage6SelfReflections, setStage6SelfReflections] = useState(
    () =>
      savedProgress.stage6SelfReflections || {
        contribution:
          'Đảm nhận vai trò Nhóm trưởng: Lập kế hoạch, phân công 5 thành viên (Hải Yến, Quỳnh Như, Quỳnh Trâm, Kha My, Như Quỳnh), điều phối làm màng bọc sinh học và báo cáo trên Padlet.',
        favorite:
          'Tâm đắc nhất cơ chế liên kết sợi Cellulose trong việc gia cố độ bền cơ học cho màng sinh học và thông điệp giảm rác thải nhựa dùng một lần.',
        difficulties:
          'Khâu đổ khuôn và làm khô màng bọc lúc đầu dễ bị dính; nhóm đã khắc phục bằng cách phết một lớp dầu thực vật mỏng lên bề mặt khuôn ép.',
        improvement:
          'Nhóm muốn thử nghiệm thêm phụ gia kháng khuẩn từ tinh dầu quế/sả để bảo quản thực phẩm tươi lâu hơn.',
      }
  );
  const [stage6SelfSignature, setStage6SelfSignature] = useState<string>(
    () => savedProgress.stage6SelfSignature || 'Nguyễn Thuý Ngân'
  );
  const [stage6SelfSubmitted, setStage6SelfSubmitted] = useState<boolean>(
    () => Boolean(savedProgress.stage6SelfSubmitted)
  );

  // Phân hệ 2: Nhóm trưởng đánh giá thành viên (Số 1 là Nhóm trưởng: Nguyễn Thuý Ngân)
  const [stage6LeaderName, setStage6LeaderName] = useState<string>(
    () => savedProgress.stage6LeaderName || 'Nguyễn Thuý Ngân'
  );
  const [stage6LeaderClass, setStage6LeaderClass] = useState<string>(
    () => savedProgress.stage6LeaderClass || '9A'
  );
  const [stage6LeaderGroup, setStage6LeaderGroup] = useState<string>(
    () => savedProgress.stage6LeaderGroup || 'Nhóm 1 - Hóa Học Xanh (Green Chem)'
  );
  const [stage6Members, setStage6Members] = useState<Stage6MemberRecord[]>(
    () =>
      savedProgress.stage6Members && savedProgress.stage6Members.length > 0
        ? savedProgress.stage6Members
        : STAGE6_TEAM_PRESETS[0].members
  );
  const [stage6SelectedMemberId, setStage6SelectedMemberId] = useState<string>(
    () => savedProgress.stage6SelectedMemberId || 'ngan-m1'
  );
  const [stage6LeaderSubmitted, setStage6LeaderSubmitted] = useState<boolean>(
    () => Boolean(savedProgress.stage6LeaderSubmitted)
  );

  // Phân hệ 3: Giáo viên đánh giá nhóm
  const [stage6TeacherGroup, setStage6TeacherGroup] = useState<string>(
    () => savedProgress.stage6TeacherGroup || 'Nhóm 1 - Hóa Học Xanh (Green Chem)'
  );
  const [stage6TeacherClass, setStage6TeacherClass] = useState<string>(
    () => savedProgress.stage6TeacherClass || '9A'
  );
  const [stage6TeacherProduct, setStage6TeacherProduct] = useState<string>(
    () => savedProgress.stage6TeacherProduct || 'Vật liệu xơ sợi sinh học & Màng bọc thực phẩm tự hủy'
  );
  const [stage6TeacherName, setStage6TeacherName] = useState<string>(
    () => savedProgress.stage6TeacherName || 'Thầy Trần Văn Lĩnh'
  );
  const [stage6TeacherScores, setStage6TeacherScores] = useState<Record<string, number>>(
    () =>
      savedProgress.stage6TeacherScores || {
        s6_tea_padlet: 1.0,
        s6_tea_science: 1.5,
        s6_tea_process: 1.5,
        s6_tea_product: 1.6,
        s6_tea_poster: 1.5,
        s6_tea_video: 1.2,
        s6_tea_presentation: 1.0,
      }
  );
  const [stage6TeacherStrengths, setStage6TeacherStrengths] = useState<string>(
    () =>
      savedProgress.stage6TeacherStrengths ||
      'Nhóm làm việc rất đoàn kết, nhóm trưởng Nguyễn Thuý Ngân dẫn dắt nhóm nhiệt tình. Sản phẩm màng bọc sinh học dẻo dai, Poster khoa học trực quan, giải thích cơ chế Cellulose và tinh bột chính xác.'
  );
  const [stage6TeacherIndividualAdjustments, setStage6TeacherIndividualAdjustments] = useState<string>(
    () =>
      savedProgress.stage6TeacherIndividualAdjustments ||
      'Các thành viên đều nỗ lực xuất sắc. Nhóm trưởng Nguyễn Thuý Ngân dẫn dắt rất tốt (+0.5đ khuyến khích).'
  );
  const [stage6TeacherSubmitted, setStage6TeacherSubmitted] = useState<boolean>(
    () => Boolean(savedProgress.stage6TeacherSubmitted)
  );

  const handleSelectTeamPreset = (presetId: string) => {
    const preset = STAGE6_TEAM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setStage6SelectedTeamPreset(preset.id);
    setStage6LeaderName(preset.leaderName);
    setStage6LeaderClass(preset.className);
    setStage6LeaderGroup(preset.name);
    setStage6Members(preset.members);
    setStage6SelectedMemberId(preset.members[0]?.id || '');
    setStage6SelfStudentName(preset.leaderName);
    setStage6SelfSignature(preset.leaderName);
    setStage6SelfClass(preset.className);
    setStage6SelfGroup(preset.name);
    setStage6TeacherGroup(preset.name);
    setStage6TeacherClass(preset.className);
    setStage6TeacherProduct(preset.productName);
  };

  // Nộp Phiếu Tự đánh giá & Nhật ký Suy ngẫm (Chặng 6.2 - Tab 1) lên Cloud Firestore & Bảng Tổng hợp GV
  const handleSubmitStage6Self = async () => {
    setStage6SelfSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    const selfTotal =
      Math.round(
        STAGE6_SELF_RUBRIC_CRITERIA.reduce((acc, c) => acc + (stage6SelfScores[c.id] ?? 0), 0) * 10
      ) / 10;
    const selfRank = getStage6RankInfo(selfTotal);
    const nowMs = Date.now();
    const submittedAtStr = new Date(nowMs).toLocaleString('vi-VN');
    const summaryText = STAGE6_SELF_RUBRIC_CRITERIA.map(
      (c, idx) => `TC${idx + 1}: ${stage6SelfScores[c.id] ?? 0}/${c.maxPoints}`
    ).join(' | ');
    const reflectionSummary = [
      stage6SelfReflections.contribution ? `[Đóng góp]: ${stage6SelfReflections.contribution}` : '',
      stage6SelfReflections.favorite ? `[Tâm đắc]: ${stage6SelfReflections.favorite}` : '',
      stage6SelfReflections.difficulties ? `[Khắc phục]: ${stage6SelfReflections.difficulties}` : '',
      stage6SelfReflections.improvement ? `[Cải tiến]: ${stage6SelfReflections.improvement}` : '',
    ]
      .filter(Boolean)
      .join(' • ');

    const hubResult = await persistSubmissionRecord<Stage3RubricSubmissionRecord>(
      FIRESTORE_STAGE3_RUBRICS_COLLECTION,
      LOCAL_RUBRICS_CACHE_KEY,
      {
        stage: 'stage-6',
        stageLabel: 'Chặng 6 (Tự đánh giá)',
        mode: 'self',
        evaluatorGroup: `${stage6SelfStudentName.trim() || 'Học sinh'} (${stage6SelfGroup.trim()})`,
        targetGroup: stage6SelfGroup.trim() || 'Nhóm dự án',
        className: stage6SelfClass.trim() || '9A',
        criteriaScores: { ...stage6SelfScores },
        criteriaSummary: summaryText,
        totalPoints: selfTotal,
        rank: selfRank.label,
        feedbackNote: reflectionSummary,
        submittedAt: submittedAtStr,
        createdAtMs: nowMs,
      },
      {
        sheetType: 'stage3_rubric_self',
        stageLabel: 'Chặng 6 (Tự đánh giá)',
        submittedAt: submittedAtStr,
        evaluatorGroup: `${stage6SelfStudentName.trim()} (${stage6SelfGroup.trim()})`,
        targetGroup: stage6SelfGroup.trim(),
        className: stage6SelfClass.trim() || '9A',
        criteriaSummary: summaryText,
        totalPoints: selfTotal,
        rank: selfRank.label,
        feedbackNote: reflectionSummary,
      }
    );

    const feedback = buildSubmissionFeedbackMessage(
      `Phiếu Tự đánh giá & Nhật ký học tập của ${stage6SelfStudentName} (${selfTotal}/10đ)`,
      hubResult,
      false
    );
    setStage6SubmitFeedback((prev) => ({ ...prev, self: feedback }));
  };

  // Nộp Bảng Nhóm trưởng chấm thành viên (Chặng 6.2 - Tab 2) lên Cloud Firestore & Bảng Tổng hợp GV
  const handleSubmitStage6Leader = async () => {
    setStage6LeaderSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    const memberTotals = stage6Members.map((m) => {
      const tot =
        Math.round(
          STAGE6_LEADER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (m.scores[c.id] ?? 0), 0) * 10
        ) / 10;
      return { name: m.name, total: tot, comment: m.comment };
    });
    const teamAvg =
      Math.round(
        (memberTotals.reduce((s, m) => s + m.total, 0) / Math.max(1, memberTotals.length)) * 10
      ) / 10;
    const teamRank = getStage6RankInfo(teamAvg);
    const nowMs = Date.now();
    const submittedAtStr = new Date(nowMs).toLocaleString('vi-VN');
    const summaryText = memberTotals.map((m) => `${m.name}: ${m.total}đ`).join(' | ');
    const commentsText = memberTotals
      .filter((m) => m.comment?.trim())
      .map((m) => `${m.name}: ${m.comment.trim()}`)
      .join(' • ');

    const hubResult = await persistSubmissionRecord<Stage3RubricSubmissionRecord>(
      FIRESTORE_STAGE3_RUBRICS_COLLECTION,
      LOCAL_RUBRICS_CACHE_KEY,
      {
        stage: 'stage-6',
        stageLabel: 'Chặng 6 (NT chấm TV)',
        mode: 'self',
        evaluatorGroup: `NT: ${stage6LeaderName.trim()}`,
        targetGroup: stage6LeaderGroup.trim() || 'Nhóm dự án',
        className: stage6LeaderClass.trim() || '9A',
        criteriaScores: Object.fromEntries(memberTotals.map((m, i) => [`tv_${i + 1}`, m.total])),
        criteriaSummary: summaryText,
        totalPoints: teamAvg,
        rank: teamRank.label,
        feedbackNote: commentsText || 'Đã hoàn thành chấm điểm thành viên trong nhóm.',
        submittedAt: submittedAtStr,
        createdAtMs: nowMs,
      },
      {
        sheetType: 'stage3_rubric_self',
        stageLabel: 'Chặng 6 (NT chấm TV)',
        submittedAt: submittedAtStr,
        evaluatorGroup: `NT: ${stage6LeaderName.trim()}`,
        targetGroup: stage6LeaderGroup.trim(),
        className: stage6LeaderClass.trim() || '9A',
        criteriaSummary: summaryText,
        totalPoints: teamAvg,
        rank: teamRank.label,
        feedbackNote: commentsText,
      }
    );

    const feedback = buildSubmissionFeedbackMessage(
      `Bảng điểm thành viên của ${stage6LeaderGroup} (TB: ${teamAvg}/10đ)`,
      hubResult,
      false
    );
    setStage6SubmitFeedback((prev) => ({ ...prev, leader: feedback }));
  };

  // Nộp Phiếu Giáo viên chấm nhóm (Chặng 6.2 - Tab 3) lên Cloud Firestore & Bảng Tổng hợp GV
  const handleSubmitStage6Teacher = async () => {
    setStage6TeacherSubmitted(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const teacherTotal =
      Math.round(
        STAGE6_TEACHER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (stage6TeacherScores[c.id] ?? 0), 0) * 10
      ) / 10;
    const teacherRank = getStage6RankInfo(teacherTotal);
    const nowMs = Date.now();
    const submittedAtStr = new Date(nowMs).toLocaleString('vi-VN');
    const summaryText = STAGE6_TEACHER_RUBRIC_CRITERIA.map(
      (c, idx) => `TC${idx + 1}: ${stage6TeacherScores[c.id] ?? 0}/${c.maxPoints}`
    ).join(' | ');
    const teacherFeedbackText = [
      stage6TeacherProduct ? `[SP]: ${stage6TeacherProduct}` : '',
      stage6TeacherStrengths ? `[Nhận xét]: ${stage6TeacherStrengths}` : '',
      stage6TeacherIndividualAdjustments ? `[Điều chỉnh]: ${stage6TeacherIndividualAdjustments}` : '',
    ]
      .filter(Boolean)
      .join(' • ');

    const hubResult = await persistSubmissionRecord<Stage3RubricSubmissionRecord>(
      FIRESTORE_STAGE3_RUBRICS_COLLECTION,
      LOCAL_RUBRICS_CACHE_KEY,
      {
        stage: 'stage-6',
        stageLabel: 'Chặng 6 (GV tổng kết)',
        mode: 'peer',
        evaluatorGroup: stage6TeacherName.trim() || 'Giáo viên',
        targetGroup: stage6TeacherGroup.trim() || 'Nhóm dự án',
        className: stage6TeacherClass.trim() || '9A',
        criteriaScores: { ...stage6TeacherScores },
        criteriaSummary: summaryText,
        totalPoints: teacherTotal,
        rank: teacherRank.label,
        feedbackNote: teacherFeedbackText,
        submittedAt: submittedAtStr,
        createdAtMs: nowMs,
      },
      {
        sheetType: 'stage3_rubric_peer',
        stageLabel: 'Chặng 6 (GV tổng kết)',
        submittedAt: submittedAtStr,
        evaluatorGroup: stage6TeacherName.trim() || 'Giáo viên',
        targetGroup: stage6TeacherGroup.trim(),
        className: stage6TeacherClass.trim() || '9A',
        criteriaSummary: summaryText,
        totalPoints: teacherTotal,
        rank: teacherRank.label,
        feedbackNote: teacherFeedbackText,
      }
    );

    const feedback = buildSubmissionFeedbackMessage(
      `Phiếu Giáo viên đánh giá ${stage6TeacherGroup} (${teacherTotal}/10đ)`,
      hubResult,
      false
    );
    setStage6SubmitFeedback((prev) => ({ ...prev, teacher: feedback }));
  };

  // Tự động lưu tiến trình học tập vào localStorage để HS không mất bài khi F5 / tải lại trang
  useEffect(() => {
    try {
      const payload: SavedLearningProgress = {
        activeStage,
        unlockedTaskIds: Array.from(unlockedTaskIds),
        everUnlockedTaskIds: Array.from(everUnlockedTaskIds),
        teamNameInput,
        padletConfirmed,
        solvedClueIds: Array.from(solvedClueIds),
        placedKeywordSlots: Array.from(placedKeywordSlots),
        usedTileIndices: Array.from(usedTileIndices),
        worksheetDownloaded,
        video1Watched,
        dragPlacements,
        videoIodineWatched,
        hasAddedIodine,
        iodineQuizAnswers,
        iodineQuizSubmitted,
        videoHydroWatched,
        hydrolysisDone,
        hydroQuizAnswers,
        hydroQuizSubmitted,
        video3Watched,
        hotspotSelections,
        solvedHotspotIds: Array.from(solvedHotspotIds),
        testStudentName,
        testStudentClass,
        testStudentSchool,
        testMcAnswers,
        testTfAnswers,
        testFillAnswers,
        testMatchingAnswers,
        isTestSubmitted,
        testScore,
        ansQ1,
        ansQ2,
        checkedHomeItems: Array.from(checkedHomeItems),
        selectedIdeaId,
        ideaDriveSubmitted,
        presenterName,
        checkedSteps: Array.from(checkedSteps),
        peerIdeaConfirmed,
        homeChecks: Array.from(homeChecks),
        productSubmitted,
        boothChecks: Array.from(boothChecks),
        voteConfirmed,
        quizAnswers,
        quizSubmitted,
        stage6SelectedTeamPreset,
        stage6SelfStudentName,
        stage6SelfClass,
        stage6SelfGroup,
        stage6SelfDate,
        stage6SelfScores,
        stage6SelfReflections,
        stage6SelfSignature,
        stage6SelfSubmitted,
        stage6LeaderName,
        stage6LeaderClass,
        stage6LeaderGroup,
        stage6Members,
        stage6SelectedMemberId,
        stage6LeaderSubmitted,
        stage6TeacherGroup,
        stage6TeacherClass,
        stage6TeacherProduct,
        stage6TeacherName,
        stage6TeacherScores,
        stage6TeacherStrengths,
        stage6TeacherIndividualAdjustments,
        stage6TeacherSubmitted,
      };
      window.localStorage.setItem(LOCAL_PROGRESS_CACHE_KEY, JSON.stringify(payload));
    } catch {
      // Bỏ qua nếu trình duyệt chặn localStorage
    }
  }, [
    activeStage,
    unlockedTaskIds,
    everUnlockedTaskIds,
    teamNameInput,
    padletConfirmed,
    solvedClueIds,
    placedKeywordSlots,
    usedTileIndices,
    worksheetDownloaded,
    video1Watched,
    dragPlacements,
    videoIodineWatched,
    hasAddedIodine,
    iodineQuizAnswers,
    iodineQuizSubmitted,
    videoHydroWatched,
    hydrolysisDone,
    hydroQuizAnswers,
    hydroQuizSubmitted,
    video3Watched,
    hotspotSelections,
    solvedHotspotIds,
    testStudentName,
    testStudentClass,
    testStudentSchool,
    testMcAnswers,
    testTfAnswers,
    testFillAnswers,
    testMatchingAnswers,
    isTestSubmitted,
    testScore,
    ansQ1,
    ansQ2,
    checkedHomeItems,
    selectedIdeaId,
    ideaDriveSubmitted,
    presenterName,
    checkedSteps,
    peerIdeaConfirmed,
    homeChecks,
    productSubmitted,
    boothChecks,
    voteConfirmed,
    quizAnswers,
    quizSubmitted,
    stage6SelectedTeamPreset,
    stage6SelfStudentName,
    stage6SelfClass,
    stage6SelfGroup,
    stage6SelfDate,
    stage6SelfScores,
    stage6SelfReflections,
    stage6SelfSignature,
    stage6SelfSubmitted,
    stage6LeaderName,
    stage6LeaderClass,
    stage6LeaderGroup,
    stage6Members,
    stage6SelectedMemberId,
    stage6LeaderSubmitted,
    stage6TeacherGroup,
    stage6TeacherClass,
    stage6TeacherProduct,
    stage6TeacherName,
    stage6TeacherScores,
    stage6TeacherStrengths,
    stage6TeacherIndividualAdjustments,
    stage6TeacherSubmitted,
  ]);

  // Điều kiện hoàn thành từng chặng để mở khóa chặng sau:
  const isKeywordComplete = placedKeywordSlots.size === FULL_KEYWORD_LETTERS.length;
  const isStage1Done = padletConfirmed && isKeywordComplete;

  // Điều kiện hoàn thành từng phần trong Chặng 2 (Phần I -> Phần II.1 -> Phần II.2 -> Phần III -> Phần IV):
  const isPart1DragComplete = STAGE2_DRAG_ITEMS.every((item) => dragPlacements[item.id] === item.target);
  const isPart1Done = video1Watched && isPart1DragComplete;

  // Hoàn thành Phần II.1: Phản ứng màu với Iodine
  const isPart2aQuizAllAnswered = STAGE2_PART2_IODINE_QUIZ.every((q) => iodineQuizAnswers[q.id] !== undefined);
  const isPart2aDone = (videoIodineWatched || hasAddedIodine) && iodineQuizSubmitted;

  // Hoàn thành Phần II.2: Phản ứng Thủy phân
  const isPart2bQuizAllAnswered = STAGE2_PART2_HYDROLYSIS_QUIZ.every((q) => hydroQuizAnswers[q.id] !== undefined);
  const isPart2bDone = (videoHydroWatched || hydrolysisDone) && hydroQuizSubmitted;

  // Hoàn thành cả 2 tính chất hóa học
  const isPart2Done = isPart2aDone && isPart2bDone;

  const isPart3HotspotsComplete = solvedHotspotIds.size === HOTSPOT_APPLICATIONS.length;
  const isPart3Done = video3Watched && isPart3HotspotsComplete;

  // Điều kiện hoàn thành Phần IV (Bài kiểm tra 12 câu đã nộp):
  const isPart4Done = isTestSubmitted && testStudentName.trim().length > 0;

  // Điều kiện hoàn thành Phần V (Vận dụng kiến thức & Đề xuất giải pháp STEAM):
  const isQ1Done = ansQ1.trim().length > 0 || showSampleQ1;
  const isQ2Done = ansQ2.trim().length > 0 || showSampleQ2;
  const isPart5Done =
    stage2SteamSubmitted || (isQ1Done && isQ2Done && checkedHomeItems.size >= 1);

  const isStage2Done = isPart1Done && isPart2Done && isPart3Done && isPart4Done && isPart5Done;

  const STAGE_TASK_MAP: Record<StageId, string[]> = {
    'stage-1': ['task-s1-padlet', 'task-s1-crossword'],
    'stage-2': [
      'task-s2-part1',
      'task-s2-part2-iodine',
      'task-s2-part2-hydro',
      'task-s2-part3',
      'task-s2-part4-test',
      'task-s2-part5',
    ],
    'stage-3': ['task-s3-idea', 'task-s3-process', 'task-s3-peer'],
    'stage-4': ['task-s4-maker', 'task-s4-submit'],
    'stage-5': ['task-s5-booth', 'task-s5-presentation', 'task-s5-vote'],
    'stage-6': ['task-s6-summary', 'task-s6-assessment', 'task-s6-video'],
  };

  const isTaskIdCompleted = (taskId: string): boolean => {
    switch (taskId) {
      case 'task-s1-padlet':
        return padletConfirmed;
      case 'task-s1-crossword':
        return isKeywordComplete;
      case 'task-s2-part1':
        return isPart1Done;
      case 'task-s2-part2-iodine':
        return isPart2aDone;
      case 'task-s2-part2-hydro':
        return isPart2bDone;
      case 'task-s2-part3':
        return isPart3Done;
      case 'task-s2-part4-test':
        return isPart4Done;
      case 'task-s2-part5':
        return isPart5Done;
      case 'task-s3-idea':
        return ideaDriveSubmitted;
      case 'task-s3-process':
        return Boolean(presenterName.trim());
      case 'task-s3-peer':
        return peerIdeaConfirmed;
      case 'task-s4-maker':
        return homeChecks.size === 3;
      case 'task-s4-submit':
        return productSubmitted;
      case 'task-s5-booth':
        return boothChecks.size === 3;
      case 'task-s5-presentation':
        return stage5PresentationSubmitted;
      case 'task-s5-vote':
        return voteConfirmed;
      case 'task-s6-summary':
        return everUnlockedTaskIds.has('task-s6-summary') && quizSubmitted;
      case 'task-s6-assessment':
        return stage6SelfSubmitted || stage6LeaderSubmitted || stage6TeacherSubmitted;
      case 'task-s6-video':
        return stage6SummaryVideoConfirmed;
      default:
        return false;
    }
  };

  // Chế độ Accordion thông minh: Khi mở 1 ô mới, tự động thu gọn các ô ĐÃ HOÀN THÀNH khác trong cùng chặng và cuộn mượt tới ô đó
  const unlockTask = (id: string) => {
    setUnlockedTaskIds((prev) => {
      const next = new Set(prev);
      if (!isTeacherMode && !isJudgeMode) {
        const siblingTasks = Object.values(STAGE_TASK_MAP).find((arr) => arr.includes(id)) || [];
        siblingTasks.forEach((sibId) => {
          if (sibId !== id && isTaskIdCompleted(sibId)) {
            next.delete(sibId);
          }
        });
      }
      next.add(id);
      return next;
    });
    setEverUnlockedTaskIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      document.getElementById(`box-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const lockTask = (id: string) => {
    setUnlockedTaskIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const jumpToStage2Section = (taskId?: string, domId?: string) => {
    if (taskId) {
      unlockTask(taskId);
    } else if (domId) {
      document.getElementById(domId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleSetItem = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, item: T) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const handleDownloadWorksheetDoc = () => {
    const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Phiếu Ghi Bài - Bài 30: Tinh bột và Cellulose</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; color: #000; }
    .header { text-align: center; margin-bottom: 20px; }
    .school { font-size: 11pt; text-transform: uppercase; }
    .subject { font-size: 11pt; font-weight: bold; }
    .title { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-top: 10px; margin-bottom: 4px; color: #0f172a; }
    .subtitle { font-size: 13pt; font-style: italic; margin-bottom: 15px; color: #334155; }
    .student-info { margin-bottom: 15px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
    th, td { border: 1px solid black; padding: 7px 10px; vertical-align: top; }
    th { background-color: #f1f5f9; font-weight: bold; text-align: center; }
    .section-title { font-size: 14pt; font-weight: bold; margin-top: 16px; margin-bottom: 6px; color: #1e3a8a; }
  </style>
</head>
<body>
  <div class="header">
    <div class="school">TRƯỜNG THCS .....................................................</div>
    <div class="subject">TỔ KHOA HỌC TỰ NHIÊN — MÔN KHTN 9</div>
    <hr style="width: 35%; margin: 6px auto 12px auto;">
    <div class="title">PHIẾU HỌC TẬP — PHIẾU GHI BÀI TỰ HỌC</div>
    <div class="subtitle">BÀI 30: TINH BỘT VÀ CELLULOSE</div>
  </div>

  <div class="student-info">
    Họ và tên học sinh: ............................................................................ Lớp: ................. Nhóm: ....................
  </div>

  <div class="section-title">I. TRẠNG THÁI TỰ NHIÊN VÀ TÍNH CHẤT VẬT LÍ</div>
  <p>1. Công thức phân tử chung của tinh bột và cellulose là: <strong>.........................................................</strong></p>
  <p>2. Hoàn thành bảng so sánh tính chất vật lí và trạng thái tự nhiên:</p>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Tiêu chí</th>
        <th style="width: 39%;">TINH BỘT</th>
        <th style="width: 39%;">CELLULOSE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Trạng thái, màu sắc</strong></td>
        <td>Chất rắn, dạng ........................., màu .........................</td>
        <td>Chất rắn, dạng ........................., màu .........................</td>
      </tr>
      <tr>
        <td><strong>Tính tan trong nước</strong></td>
        <td>- Nước lạnh: ............................................................<br>- Nước nóng: ............................................................</td>
        <td>- Nước lạnh & nước nóng: ....................................<br>- Dung môi hữu cơ: ................................................</td>
      </tr>
      <tr>
        <td><strong>Nguồn gốc tự nhiên</strong></td>
        <td>Có nhiều trong: .......................................................<br>Ví dụ: gạo, ngô, khoai, sắn...</td>
        <td>Có nhiều trong: .......................................................<br>Ví dụ: thân gỗ, sợi bông, tre, nứa...</td>
      </tr>
      <tr>
        <td><strong>Vai trò ở thực vật</strong></td>
        <td>Là chất ....................................................................</td>
        <td>Tạo nên ....................................................................</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">II. TÍNH CHẤT HÓA HỌC</div>
  <p><strong>1. Thí nghiệm phản ứng màu với dung dịch Iodine:</strong></p>
  <ul>
    <li>Khi nhỏ dung dịch iodine vào hồ tinh bột: Xuất hiện màu <strong>.........................................................</strong></li>
    <li>Cellulose có phản ứng tạo màu với dung dịch iodine không? <strong>...................................................</strong></li>
  </ul>

  <p><strong>2. Thí nghiệm phản ứng thủy phân:</strong></p>
  <ul>
    <li>Dưới tác dụng của acid (hoặc enzyme) và đun nóng, cả tinh bột và cellulose đều bị thủy phân hoàn toàn tạo ra: <strong>.........................................................</strong> (công thức: ..........................)</li>
    <li>Phương trình hóa học: <br>
      <center style="margin: 8px 0; font-family: monospace; font-size: 13pt;">
        (C₆H₁₀O₅)ₙ + n H₂O —(acid/t° hoặc enzyme)→ ....................................................
      </center>
    </li>
  </ul>

  <div class="section-title">III. ỨNG DỤNG CỦA TINH BỘT VÀ CELLULOSE</div>
  <table>
    <thead>
      <tr>
        <th style="width: 50%;">Ứng dụng của TINH BỘT</th>
        <th style="width: 50%;">Ứng dụng của CELLULOSE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          - Nguồn ....................................................... cho con người.<br>
          - Sản xuất bánh kẹo, ..................................................<br>
          - Làm hồ dán, sản xuất cồn (ethylic alcohol)...
        </td>
        <td>
          - Sản xuất giấy viết, .................................................<br>
          - Dệt may (vải sợi bông, tơ nhân tạo)...<br>
          - Vật liệu xây dựng, đồ gỗ gia dụng...
        </td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">IV. VẬN DỤNG & CÂU HỎI MỞ RỘNG</div>
  <p><strong>Câu 1:</strong> Tại sao khi nhai kĩ cơm hoặc bánh mì trong miệng ta cảm thấy có vị ngọt nhẹ?</p>
  <p style="min-height: 45px;">....................................................................................................................................................................<br>....................................................................................................................................................................</p>

  <p><strong>Câu 2:</strong> Kể tên 2 sản phẩm thân thiện với môi trường có thể chế tạo từ tinh bột hoặc cellulose:</p>
  <p style="min-height: 45px;">- Sản phẩm 1: ..............................................................................................................................................<br>- Sản phẩm 2: ..............................................................................................................................................</p>
</body>
</html>
    `;

    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Phieu-Ghi-Bai-Bai-30-Tinh-bot-Cellulose.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setWorksheetDownloaded(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleAssignDragProp = (propId: string, zone: 'starch' | 'cellulose') => {
    const item = STAGE2_DRAG_ITEMS.find((p) => p.id === propId);
    if (!item) return;
    if (item.target === zone) {
      setDragPlacements((prev) => {
        const next = { ...prev, [propId]: zone };
        const allDone = STAGE2_DRAG_ITEMS.every((it) => next[it.id] === it.target);
        if (allDone) {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
        }
        return next;
      });
      setDragFeedback({
        text: `Chính xác! "${item.text}" là đặc điểm của ${zone === 'starch' ? 'Tinh bột' : 'Cellulose'}.`,
        isCorrect: true,
      });
    } else {
      setDragFeedback({
        text: `Chưa đúng! Đặc điểm "${item.text}" không thuộc nhóm ${zone === 'starch' ? 'Tinh bột' : 'Cellulose'}. Em hãy thử lại nhé!`,
        isCorrect: false,
      });
    }
  };

  // Thao tác bấm trực tiếp vào ô ảnh để gán Tinh bột hoặc Cellulose
  const handleToggleHotspotCell = (hsId: string) => {
    setHotspotSelections((prev) => {
      const next = { ...prev };
      if (next[hsId] === hotspotMode) {
        delete next[hsId]; // Bấm lại ô đang chọn để hủy
      } else {
        next[hsId] = hotspotMode; // Gán vào chế độ đang bật
      }
      return next;
    });
    setActiveHotspotId(hsId);
    setHotspotFeedback(null);
  };

  // Bỏ chọn trực tiếp một ô từ khay giỏ bên dưới
  const handleRemoveHotspotSelection = (hsId: string) => {
    setHotspotSelections((prev) => {
      const next = { ...prev };
      delete next[hsId];
      return next;
    });
    setHotspotFeedback(null);
  };

  // Phân loại thẻ Hotspot vào: 'starch' | 'cellulose'
  const handleClassifyHotspot = (hsId: string, category: 'starch' | 'cellulose') => {
    setHotspotSelections((prev) => {
      const next = { ...prev };
      if (next[hsId] === category) {
        delete next[hsId];
      } else {
        next[hsId] = category;
      }
      return next;
    });
    setHotspotFeedback(null);
  };

  // Kiểm tra kết quả 16 thẻ ứng dụng
  const handleCheckHotspots = () => {
    const correctStarchIds = ['hs-1', 'hs-6', 'hs-11', 'hs-14'];
    const correctCelluloseIds = ['hs-3', 'hs-7', 'hs-9', 'hs-16'];

    const chosenStarch = Object.keys(hotspotSelections).filter(
      (id) => hotspotSelections[id] === 'starch'
    );
    const chosenCellulose = Object.keys(hotspotSelections).filter(
      (id) => hotspotSelections[id] === 'cellulose'
    );

    const isStarchExact =
      chosenStarch.length === 4 &&
      correctStarchIds.every((id) => hotspotSelections[id] === 'starch');

    const isCelluloseExact =
      chosenCellulose.length === 4 &&
      correctCelluloseIds.every((id) => hotspotSelections[id] === 'cellulose');

    if (isStarchExact && isCelluloseExact) {
      setSolvedHotspotIds(new Set(HOTSPOT_APPLICATIONS.map((h) => h.id)));
      setHotspotFeedback({
        text: '🎉 Xuất sắc! Em đã chọn chính xác tuyệt đối 4 ứng dụng của Tinh bột (Cơm/bánh mì, Hồ dán, Chế biến bún/bánh, Cồn/rượu) và 4 ứng dụng của Cellulose (Giấy viết, Vải sợi bông, Đồ gỗ xây dựng, Mây tre/xơ dừa)!',
        isCorrect: true,
      });
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.65 } });
    } else {
      const correctStarchCount = chosenStarch.filter((id) => correctStarchIds.includes(id)).length;
      const correctCelluloseCount = chosenCellulose.filter((id) => correctCelluloseIds.includes(id)).length;
      setHotspotFeedback({
        text: `⚠️ Chưa hoàn toàn chính xác: Em đang chọn đúng ${correctStarchCount}/4 ứng dụng Tinh bột và ${correctCelluloseCount}/4 ứng dụng Cellulose. Hãy kiểm tra lại các mục trong 2 giỏ bên dưới nhé!`,
        isCorrect: false,
      });
    }
  };

  // Đặt lại bài tập Hotspot
  const handleResetHotspots = () => {
    setHotspotSelections({});
    setSolvedHotspotIds(new Set());
    setHotspotFeedback(null);
    setActiveHotspotId('hs-1');
  };

  // Xem đáp án chuẩn cho GV / Học sinh cần hỗ trợ
  const handleShowHotspotSolution = () => {
    const solution: Record<string, string> = {
      'hs-1': 'starch',
      'hs-3': 'cellulose',
      'hs-6': 'starch',
      'hs-7': 'cellulose',
      'hs-9': 'cellulose',
      'hs-11': 'starch',
      'hs-14': 'starch',
      'hs-16': 'cellulose',
    };
    setHotspotSelections(solution);
    setSolvedHotspotIds(new Set(HOTSPOT_APPLICATIONS.map((h) => h.id)));
    setHotspotFeedback({
      text: '💡 Đã hiển thị đáp án chuẩn: 4 ứng dụng Tinh bột (1, 6, 11, 14) và 4 ứng dụng Cellulose (3, 7, 9, 16)!',
      isCorrect: true,
    });
    confetti({ particleCount: 45, spread: 50, origin: { y: 0.65 } });
  };

  // Mở khóa trò chơi vận động Body Pose Quiz bằng mật khẩu Giáo viên
  const handleUnlockPoseGame = () => {
    if (poseGamePassInput.trim() === TEACHER_PASSWORD || isTeacherMode) {
      setIsPoseGameUnlocked(true);
      setPoseGamePassError(null);
      try {
        window.sessionStorage.setItem('pose_game_unlocked', 'true');
      } catch {
        // ignore
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      setPoseGamePassError('Mật khẩu Giáo viên chưa đúng! Vui lòng thử lại.');
    }
  };

  const stage3RubricSummary = getRubricSummary(STAGE3_RUBRIC_CRITERIA, stage3RubricState);
  const stage5RubricSummary = getRubricSummary(STAGE5_RUBRIC_CRITERIA, stage5RubricState);

  const submitRubricEvaluation = async ({
    stage,
    stageLabel,
    criteria,
    state,
    setState,
    onConfirmed,
  }: {
    stage: 'stage-3' | 'stage-5';
    stageLabel: string;
    criteria: Stage3RubricCriterion[];
    state: RubricFormState;
    setState: React.Dispatch<React.SetStateAction<RubricFormState>>;
    onConfirmed: () => void;
  }) => {
    const summary = getRubricSummary(criteria, state);

    if (!state.evaluatorGroup.trim()) {
      setState((prev) => ({
        ...prev,
        validationError: 'Vui lòng nhập Tên nhóm thực hiện đánh giá!',
      }));
      return;
    }
    if (!state.targetGroup.trim()) {
      setState((prev) => ({
        ...prev,
        validationError: 'Vui lòng nhập Tên nhóm được đánh giá!',
      }));
      return;
    }
    if (!summary.isComplete) {
      setState((prev) => ({
        ...prev,
        validationError: `Vui lòng chấm điểm đầy đủ cả ${criteria.length} tiêu chí (${summary.answeredCount}/${criteria.length})!`,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      validationError: null,
      isSending: true,
      status: 'idle',
      message: null,
    }));
    onConfirmed();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const nowMs = Date.now();
    const submittedAtStr = new Date(nowMs).toLocaleString('vi-VN');
    const criteriaScoresMap: Record<string, number> = {};
    const criteriaDetails: Record<string, string> = {};
    const summaryParts: string[] = [];

    criteria.forEach((c, idx) => {
      const pts = getCriterionPointFromState(c, state) ?? 0;
      const lvNum = state.selections[c.id];
      const lvLabel = c.levels.find((l) => l.level === lvNum)?.label ?? '';
      criteriaScoresMap[c.id] = pts;
      criteriaDetails[c.title] = `${pts} / ${c.maxPoints} điểm (${lvLabel})`;
      summaryParts.push(`TC${idx + 1}: ${pts}/${c.maxPoints}`);
    });
    const criteriaSummaryText = summaryParts.join(' | ');

    const hubResult = await persistSubmissionRecord<Stage3RubricSubmissionRecord>(
      FIRESTORE_STAGE3_RUBRICS_COLLECTION,
      LOCAL_RUBRICS_CACHE_KEY,
      {
        stage,
        stageLabel,
        mode: state.evaluatorMode,
        evaluatorGroup: state.evaluatorGroup.trim(),
        targetGroup: state.targetGroup.trim(),
        className: state.className.trim() || 'KHTN 9',
        criteriaScores: criteriaScoresMap,
        criteriaSummary: criteriaSummaryText,
        totalPoints: summary.totalPoints,
        rank: summary.rank.label,
        feedbackNote: state.feedbackNote.trim(),
        submittedAt: submittedAtStr,
        createdAtMs: nowMs,
      },
      {
        sheetType: state.evaluatorMode === 'self' ? 'stage3_rubric_self' : 'stage3_rubric_peer',
        stageLabel,
        submittedAt: submittedAtStr,
        mode: state.evaluatorMode === 'self' ? 'Tự đánh giá' : 'Đánh giá đồng đẳng',
        evaluatorGroup: state.evaluatorGroup.trim(),
        targetGroup: state.targetGroup.trim(),
        className: state.className.trim() || 'KHTN 9',
        criteriaSummary: criteriaSummaryText,
        totalPoints: summary.totalPoints,
        rank: summary.rank.label,
        feedbackNote: state.feedbackNote.trim(),
      }
    );

    let emailOk = false;
    if (sendIndividualEmails) {
      const emailPayload = {
        _subject: `[KHTN 9] Rubric ${stageLabel} - Nhóm chấm: ${state.evaluatorGroup.trim()} → Nhóm được chấm: ${state.targetGroup.trim()} (${summary.totalPoints}/10đ)`,
        'Chặng dự án': stageLabel,
        'Hình thức đánh giá':
          state.evaluatorMode === 'self' ? 'Tự đánh giá nhóm' : 'Đánh giá đồng đẳng giữa các nhóm',
        'Nhóm thực hiện đánh giá': state.evaluatorGroup.trim(),
        'Nhóm được đánh giá': state.targetGroup.trim(),
        'Lớp học': state.className.trim() || 'KHTN 9',
        'Thời gian gửi': submittedAtStr,
        ...criteriaDetails,
        'TỔNG ĐIỂM RUBRIC': `${summary.totalPoints} / 10 điểm`,
        'Xếp loại': summary.rank.label,
        'Nhận xét & Góp ý cải thiện': state.feedbackNote.trim() || '(Không có nhận xét thêm)',
      };
      emailOk = await sendOptionalTeacherEmail(emailPayload);
    }

    const feedback = buildSubmissionFeedbackMessage(
      `phiếu Rubric ${stageLabel} (${summary.totalPoints}/10đ)`,
      hubResult,
      emailOk
    );

    setState((prev) => ({
      ...prev,
      isSending: false,
      status: feedback.ok ? 'success' : 'error',
      message: feedback.text,
    }));
  };

  const isStage31Done = ideaDriveSubmitted;
  const isStage32Done = Boolean(presenterName.trim());
  const isStage3Done = isStage31Done && isStage32Done && peerIdeaConfirmed;
  const isStage4Done = homeChecks.size === 3 && productSubmitted;
  const isStage5Done = boothChecks.size === 3 && voteConfirmed;
  const isStage6Done =
    everUnlockedTaskIds.has('task-s6-summary') &&
    (quizSubmitted || stage6SelfSubmitted || stage6LeaderSubmitted || stage6TeacherSubmitted || everUnlockedTaskIds.has('task-s6-assessment'));

  const isStageUnlocked = (stage: StageId): boolean => {
    if (isTeacherMode || isJudgeMode) return true;
    switch (stage) {
      case 'stage-1':
        return true;
      case 'stage-2':
        return isStage1Done;
      case 'stage-3':
        return isStage1Done && isStage2Done;
      case 'stage-4':
        return isStage1Done && isStage2Done && isStage3Done;
      case 'stage-5':
        return isStage1Done && isStage2Done && isStage3Done && isStage4Done;
      case 'stage-6':
        return isStage1Done && isStage2Done && isStage3Done && isStage4Done && isStage5Done;
    }
  };

  const handleTeacherLogin = () => {
    if (teacherPassInput.trim() === TEACHER_PASSWORD) {
      setIsTeacherMode(true);
      setIsJudgeMode(false);
      setShowTeacherModal(false);
      setTeacherPassInput('');
      setTeacherPassError(null);
      setStageLockMessage(null);
    } else {
      setTeacherPassError('Mật khẩu Giáo viên chưa đúng! Vui lòng thử lại.');
    }
  };

  const unlockAllTasksForTeacher = () => {
    setUnlockedTaskIds(new Set(ALL_TASK_IDS));
    setEverUnlockedTaskIds(new Set(ALL_TASK_IDS));
    setUnlockedClueIds(new Set(CROSSWORD_CLUES.map((c) => c.id)));
    setUnlockedQuizIds(new Set(QUIZ_QUESTIONS.map((q) => q.id)));
  };

  const isStageCompleted = (stage: StageId): boolean => {
    switch (stage) {
      case 'stage-1':
        return isStage1Done;
      case 'stage-2':
        return isStage2Done;
      case 'stage-3':
        return isStage3Done;
      case 'stage-4':
        return isStage4Done;
      case 'stage-5':
        return isStage5Done;
      case 'stage-6':
        return isStage6Done;
    }
  };

  const switchStage = (stage: StageId) => {
    if (!isStageUnlocked(stage)) {
      setStageLockMessage('🔒 Hoàn thành chặng hiện tại để mở khóa chặng tiếp theo!');
      return;
    }
    setStageLockMessage(null);
    setActiveStage(stage);
    setSelectedGuideStage(stage);
    setIsNarratorExpanded(true);
    const stageTasks = STAGE_TASK_MAP[stage] || [];
    const firstTask = stageTasks[0];
    if (firstTask) {
      setUnlockedTaskIds((prev) => {
        const hasAnyOpenInStage = stageTasks.some((tId) => prev.has(tId));
        if (hasAnyOpenInStage) return prev;
        return new Set(prev).add(firstTask);
      });
      setEverUnlockedTaskIds((prev) => new Set(prev).add(firstTask));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckClue = (clue: CrosswordClue) => {
    const raw = (clueInputs[clue.id] || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (clue.acceptedAnswers.some((ans) => ans === raw)) {
      setSolvedClueIds((prev) => new Set(prev).add(clue.id));
      const lettersFound = clue.scrambledSlotOrder.map((idx) => FULL_KEYWORD_LETTERS[idx]).join(', ');
      setClueFeedback({
        text: `Vượt qua Thử thách ${clue.rowNumber}! Em nhận được các chữ cái: [ ${lettersFound} ]. Hãy kéo thả chữ cái vào ô "?" trên dòng Từ khóa!`,
        isCorrect: true,
      });
    } else {
      setClueFeedback({ text: `Chưa đúng! Gợi ý: ${clue.hint}`, isCorrect: false });
    }
  };

  const handlePlaceLetter = (tileSlotIdx: number, targetSlotIdx: number = activeKeywordSlot) => {
    if (usedTileIndices.has(tileSlotIdx)) return;
    if (placedKeywordSlots.has(targetSlotIdx)) {
      setClueFeedback({
        text: `Ô số ${targetSlotIdx + 1} đã có chữ cái đúng rồi! Hãy kéo chữ cái thả vào một ô dấu "?" khác.`,
        isCorrect: false,
      });
      return;
    }

    const pickedLetter = FULL_KEYWORD_LETTERS[tileSlotIdx];
    const expectedLetterAtTargetSlot = FULL_KEYWORD_LETTERS[targetSlotIdx];

    if (pickedLetter !== expectedLetterAtTargetSlot) {
      setClueFeedback({
        text: `Chữ "${pickedLetter}" chưa khớp ở vị trí ô số ${targetSlotIdx + 1}! Em hãy thử kéo thả sang một ô "?" khác nhé.`,
        isCorrect: false,
      });
      return;
    }

    const nextPlaced = new Set(placedKeywordSlots).add(targetSlotIdx);
    const nextUsed = new Set(usedTileIndices).add(tileSlotIdx);
    setPlacedKeywordSlots(nextPlaced);
    setUsedTileIndices(nextUsed);
    setClueFeedback({
      text: `Chính xác! Đã ghép chữ "${pickedLetter}" vào ô số ${targetSlotIdx + 1}.`,
      isCorrect: true,
    });

    for (let i = 0; i < FULL_KEYWORD_LETTERS.length; i++) {
      if (!nextPlaced.has(i)) {
        setActiveKeywordSlot(i);
        break;
      }
    }
    if (nextPlaced.size === FULL_KEYWORD_LETTERS.length) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
  };

  const unlockedPoolTileIndices = CROSSWORD_CLUES.filter((clue) => solvedClueIds.has(clue.id)).flatMap(
    (clue) => clue.scrambledSlotOrder,
  );

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const score = QUIZ_QUESTIONS.filter((q) => quizAnswers[q.id] === q.correctIndex).length;
    if (score >= 4) confetti({ particleCount: 100, spread: 75, origin: { y: 0.6 } });
  };

  const unlockedCount = everUnlockedTaskIds.size;
  const progressPercent = Math.round((unlockedCount / ALL_TASK_IDS.length) * 100);
  const quizScore = QUIZ_QUESTIONS.filter((q) => quizAnswers[q.id] === q.correctIndex).length;

  const exitBrowserFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    } catch {
      // Bỏ qua nếu trình duyệt chặn fullscreen API
    }
  }, []);

  const toggleIntroFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        const targetEl = introPlayerRef.current || document.documentElement;
        targetEl.requestFullscreen?.().catch(() => { });
      } else {
        document.exitFullscreen?.().catch(() => { });
      }
    } catch {
      // Bỏ qua nếu thiết bị không hỗ trợ Fullscreen API
    }
  }, []);

  const openIntroVideo = useCallback((step: 'video1' | 'video2', autoFullscreen = true) => {
    setShowCover(true);
    setIntroVideoStep(step);
    setShowVideoOverlay(true);
    if (autoFullscreen) {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => { });
        }
      } catch {
        // Trình duyệt hoặc iframe không cho phép auto-fullscreen
      }
    }
  }, []);

  const closeIntroVideoToCover = useCallback(() => {
    if (isVideoFading) return;
    setIsVideoFading(true);
    exitBrowserFullscreen();
    setTimeout(() => {
      setIntroVideoStep(null);
      setIsVideoFading(false);
    }, 200);
  }, [isVideoFading, exitBrowserFullscreen]);

  // Chuyển cảnh mượt mà giữa Video 1 (Mở đầu) sang Video 2 (Giới thiệu các chặng)
  const handleTransitionToVideo2 = useCallback(() => {
    if (isVideoFading) return;
    setIsVideoFading(true);
    setTimeout(() => {
      setIntroVideoStep('video2');
      setShowVideoOverlay(true);
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
      setTimeout(() => {
        setIsVideoFading(false);
      }, 50);
    }, 280);
  }, [isVideoFading]);

  // Chuyển cảnh mượt mà từ Video 2 sang Chặng 1 (Khởi động)
  const handleTransitionToStage1 = useCallback(() => {
    if (isVideoFading) return;
    setIsVideoFading(true);
    exitBrowserFullscreen();
    setTimeout(() => {
      setIntroVideoStep(null);
      setShowCover(false);
      setActiveStage('stage-1');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
      setTimeout(() => {
        setIsVideoFading(false);
      }, 50);
    }, 280);
  }, [isVideoFading, exitBrowserFullscreen]);

  // Đồng bộ trạng thái Fullscreen & phím tắt Smart TV khi đang phát video giới thiệu
  useEffect(() => {
    const handleFsChange = () => {
      setIsIntroFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    if (introVideoStep === null) {
      if (overlayHideTimerRef.current) {
        window.clearTimeout(overlayHideTimerRef.current);
        overlayHideTimerRef.current = null;
      }
      return;
    }

    const scheduleOverlayHide = () => {
      setShowVideoOverlay(true);
      if (overlayHideTimerRef.current) {
        window.clearTimeout(overlayHideTimerRef.current);
      }
      overlayHideTimerRef.current = window.setTimeout(() => {
        setShowVideoOverlay(false);
      }, 3200);
    };

    scheduleOverlayHide();

    const handleKeyDown = (e: KeyboardEvent) => {
      scheduleOverlayHide();
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleIntroFullscreen();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (introVideoStep === 'video1') handleTransitionToVideo2();
        else handleTransitionToStage1();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (overlayHideTimerRef.current) {
        window.clearTimeout(overlayHideTimerRef.current);
        overlayHideTimerRef.current = null;
      }
    };
  }, [introVideoStep, toggleIntroFullscreen, handleTransitionToVideo2, handleTransitionToStage1]);

  // Hiệu ứng điện ảnh Trang Bìa: Con icon hiện ra trước trên nền khung đen (1.4s đầu hoàn toàn đen) -> Ảnh bìa dự án từ từ hiện ra toàn màn hình bên dưới icon (trong 2.2s)
  useEffect(() => {
    if (!showCover || introVideoStep !== null) {
      setCoverBgRevealed(false);
      return;
    }
    setCoverBgRevealed(false);
    const timer = window.setTimeout(() => {
      setCoverBgRevealed(true);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [showCover, introVideoStep]);

  if (showCover) {
    const currentStageGuide = STAGE_DETAILED_GUIDES[activeStage] || STAGE_DETAILED_GUIDES['stage-1'];

    const handleGoToCurrentStage = () => {
      if (isVideoFading) return;
      exitBrowserFullscreen();
      setIntroVideoStep(null);
      setShowCover(false);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.65 } });
    };

    return (
      <div className="min-h-screen w-full h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden select-none">
        {/* LỚP 1 (z-10 - NẰM DƯỚI ICON): LÚC ĐẦU ẨN HOÀN TOÀN TRÊN KHUNG ĐEN -> SAU 1.4S TỪ TỪ HIỆN RA TOÀN MÀN HÌNH */}
        <div
          style={{
            opacity: coverBgRevealed ? 1 : 0,
            transform: coverBgRevealed ? 'scale(1)' : 'scale(1.06)',
            transition: 'opacity 2200ms ease-out, transform 2200ms ease-out',
          }}
          className="absolute inset-0 z-10 w-full h-full pointer-events-none flex items-center justify-center"
        >
          {/* Lớp nền tràn viền mờ nghệ thuật để lấp kín 100% màn hình ngang mà không bị viền trắng */}
          <img
            src={PROJECT_COVER_IMAGE_URL}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 brightness-50 select-none"
          />
          {/* Ảnh chính hiển thị trọn vẹn 100% từ đầu đến chân ảnh */}
          <img
            src={PROJECT_COVER_IMAGE_URL}
            alt="Bìa Dự án Bắt đầu từ sự kết thúc - Tinh bột và Cellulose"
            className="relative z-10 w-full h-full object-contain object-center block select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* LỚP 2 (z-20 - NẰM TRÊN ẢNH BÌA): CON ICON (NHÂN VẬT MC AI) HIỆN RA TRƯỚC TRÊN KHUNG ĐEN */}
        <div
          onClick={() => openIntroVideo('video1', true)}
          className="absolute bottom-6 right-4 sm:right-8 md:bottom-8 md:right-12 w-44 sm:w-56 md:w-72 lg:w-84 z-20 cursor-pointer group animate-in zoom-in-75 fade-in duration-500"
          title="Bấm vào nhân vật để xem video mở đầu toàn màn hình"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl scale-90 group-hover:bg-amber-400/30 transition-all pointer-events-none" />
          <video
            src={INTRO_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* LỚP 3 (z-30): HEADER & NÚT BẮT ĐẦU HÀNH TRÌNH NỔI TRÊN CÙNG */}
        <header
          className={`relative z-30 px-4 md:px-8 py-4 flex items-center justify-between gap-3 transition-all duration-1000 ${coverBgRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            }`}
        >
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-950 hover:text-orange-600 px-5 py-2.5 bg-white/85 hover:bg-white backdrop-blur-md rounded-full border border-white shadow-lg font-bold text-sm cursor-pointer group transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>

          {/* Nút góc trên dẫn nhanh đến chặng hiện tại */}
          <button
            type="button"
            onClick={handleGoToCurrentStage}
            className="flex items-center gap-2 text-emerald-950 hover:text-emerald-800 px-4 sm:px-5 py-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full border border-emerald-300/80 shadow-lg font-extrabold text-xs sm:text-sm cursor-pointer group transition-all hover:scale-105 active:scale-95"
            title={`Vào thẳng ${currentStageGuide.step}: ${currentStageGuide.label}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-base">{currentStageGuide.emoji}</span>
            <span>Đến {currentStageGuide.step}: {currentStageGuide.label}</span>
            <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        <main className="relative z-30 flex-1 flex flex-col items-center justify-end px-4 md:px-8 pb-7 md:pb-10 max-w-6xl mx-auto w-full pointer-events-none">
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pointer-events-auto transition-all duration-1000 ${coverBgRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            {/* NÚT 1: BẮT ĐẦU TỪ ĐẦU (XEM VIDEO) */}
            <button
              type="button"
              onClick={() => openIntroVideo('video1', true)}
              className="group relative w-full sm:w-auto px-7 md:px-10 py-3.5 md:py-4 rounded-full bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white font-black text-sm md:text-lg tracking-wide shadow-[0_12px_35px_rgba(249,115,22,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ring-4 ring-white/80"
              title="Phát video mở đầu và giới thiệu dự án từ đầu"
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:rotate-12 transition-transform" />
              <span>BẮT ĐẦU TỪ ĐẦU (XEM VIDEO)</span>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* NÚT 2: ĐẾN CHẶNG HIỆN TẠI (VÀO THẲNG BÀI HỌC) */}
            <button
              type="button"
              onClick={handleGoToCurrentStage}
              className="group relative w-full sm:w-auto px-7 md:px-10 py-3.5 md:py-4 rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white font-black text-sm md:text-lg tracking-wide shadow-[0_12px_35px_rgba(16,185,129,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ring-4 ring-white/80"
              title={`Bỏ qua video, vào thẳng ${currentStageGuide.step}: ${currentStageGuide.label}`}
            >
              <span className="text-lg md:text-xl">{currentStageGuide.emoji}</span>
              <span>ĐẾN {currentStageGuide.step.toUpperCase()}: {currentStageGuide.label.toUpperCase()}</span>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </main>

        {/* Preload ngầm Video 2 để khi chuyển từ Video 1 sang Video 2 là phát tức thì, 0s giật mạng */}
        <video
          src={PROJECT_INTRO_VIDEO_URL}
          preload="auto"
          muted
          playsInline
          className="hidden pointer-events-none"
          aria-hidden="true"
        />

        {/* ============================================================
            TRÌNH PHÁT VIDEO ĐIỆN ẢNH XUYÊN SUỐT TOÀN MÀN HÌNH (TRUE CINEMATIC FULLSCREEN)
            Video bung tràn 100vw x 100vh, Overlay tự động ẩn hiện, hỗ trợ Smart TV Fullscreen
           ============================================================ */}
        {introVideoStep !== null && (
          <div
            ref={introPlayerRef}
            onMouseMove={() => {
              setShowVideoOverlay(true);
              if (overlayHideTimerRef.current) window.clearTimeout(overlayHideTimerRef.current);
              overlayHideTimerRef.current = window.setTimeout(() => setShowVideoOverlay(false), 3000);
            }}
            onClick={() => {
              setShowVideoOverlay((prev) => !prev);
            }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden w-screen h-screen animate-in fade-in duration-300"
          >
            {/* VIDEO PHÁT TOÀN MÀN HÌNH (TRUE FULLSCREEN DISPLAY) */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
              {introVideoStep === 'video1' ? (
                <video
                  key="intro-video-1"
                  src={INTRO_VIDEO_URL}
                  autoPlay
                  controls
                  playsInline
                  onEnded={handleTransitionToVideo2}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration > 0 && v.currentTime >= v.duration - 0.28) {
                      handleTransitionToVideo2();
                    }
                  }}
                  className={`w-full h-full transition-all duration-300 ${isVideoCoverFit ? 'object-cover' : 'object-contain'
                    } ${isVideoFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
                />
              ) : (
                <video
                  key="intro-video-2"
                  src={PROJECT_INTRO_VIDEO_URL}
                  autoPlay
                  controls
                  playsInline
                  onEnded={handleTransitionToStage1}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration > 0 && v.currentTime >= v.duration - 0.28) {
                      handleTransitionToStage1();
                    }
                  }}
                  className={`w-full h-full transition-all duration-300 ${isVideoCoverFit ? 'object-cover' : 'object-contain'
                    } ${isVideoFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
                />
              )}
            </div>

            {/* TOP BAR ĐIỀU HƯỚNG NỔI (FADE OVERLAY - TỰ ĐỘNG ẨN SAU 3S) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3 sm:p-5 bg-linear-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showVideoOverlay && !isVideoFading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
              <button
                type="button"
                onClick={closeIntroVideoToCover}
                className="flex items-center gap-1.5 text-white/90 hover:text-white px-3.5 sm:px-4 py-2 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/20 shadow-lg font-bold text-xs cursor-pointer group transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Về trang bìa</span>
              </button>

              <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                {introVideoStep === 'video1' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Video Mở đầu: Bắt đầu từ sự kết thúc</span>
                    <span className="sm:hidden">Video 1: Mở đầu</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                    <span className="hidden sm:inline">🎬 Video Giới thiệu Dự án: Tinh bột &amp; Cellulose</span>
                    <span className="sm:hidden">🎬 Video Giới thiệu Dự án</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVideoCoverFit((prev) => !prev)}
                  title={isVideoCoverFit ? 'Chuyển sang vừa khung hình (Contain)' : 'Bung tràn toàn màn hình (Cover)'}
                  className="hidden md:flex items-center gap-1 text-white/80 hover:text-white px-3 py-2 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold cursor-pointer transition-all"
                >
                  <span>{isVideoCoverFit ? '🔍 Vừa khung' : '📐 Tràn viền'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleIntroFullscreen}
                  title="Phóng to Toàn màn hình Smart TV (Phím F)"
                  className="flex items-center gap-1.5 text-white/90 hover:text-white px-3 sm:px-3.5 py-2 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/20 shadow-lg font-bold text-xs cursor-pointer transition-all"
                >
                  {isIntroFullscreen ? <Minimize className="w-3.5 h-3.5 text-amber-400" /> : <Maximize className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="hidden sm:inline">{isIntroFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
                </button>

                <button
                  type="button"
                  onClick={introVideoStep === 'video1' ? handleTransitionToVideo2 : handleTransitionToStage1}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <span>{introVideoStep === 'video1' ? 'Sang Giới thiệu' : 'Sang Chặng 1'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FOOTER BAR GỢI Ý CHÂN TRANG (TỰ ĐỘNG ẨN CÙNG OVERLAY) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-3 inset-x-0 z-30 flex items-center justify-center px-4 transition-opacity duration-300 ${showVideoOverlay && !isVideoFading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
              <div className="flex flex-wrap items-center justify-center gap-2 bg-black/75 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/15 text-[11px] font-bold text-white/90 shadow-lg">
                <span className="text-purple-300 flex items-center gap-1 font-bold">
                  <span>✨</span>
                  <span>Video tạo bằng AI</span>
                </span>
                <span className="text-white/40">•</span>
                <span>
                  {introVideoStep === 'video1'
                    ? '⏳ Video tự động chuyển sang Video Giới thiệu các chặng khi xem xong'
                    : '⏳ Video tự động chuyển sang Chặng 1 (Khởi động) khi xem xong'}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-amber-300">Phím tắt: F (Toàn màn hình) • → (Bỏ qua)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const STAGES = [
    { id: 'stage-1' as StageId, step: 'Chặng 1', label: 'Khởi động', place: 'Padlet & Ô chữ', icon: Puzzle },
    { id: 'stage-2' as StageId, step: 'Chặng 2', label: 'Kiến thức nền', place: 'Tự học tại nhà', icon: Home },
    { id: 'stage-3' as StageId, step: 'Chặng 3', label: 'Ý tưởng & Quy trình', place: 'Tại lớp', icon: Lightbulb },
    { id: 'stage-4' as StageId, step: 'Chặng 4', label: 'Hoàn thiện sản phẩm', place: 'Tại nhà', icon: Hammer },
    { id: 'stage-5' as StageId, step: 'Chặng 5', label: 'Ngày hội xanh', place: 'Báo cáo tại lớp', icon: Presentation },
    { id: 'stage-6' as StageId, step: 'Chặng 6', label: 'Tổng kết dự án', place: 'Đánh giá', icon: Award },
  ];

  const renderStageGuideBanner = (stageId: StageId) => {
    const g = STAGE_DETAILED_GUIDES[stageId];
    return (
      <div className="bg-linear-to-r from-amber-50/95 via-orange-50/90 to-indigo-50/90 border-2 border-amber-300/80 rounded-3xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/20 shrink-0">
            {g.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-800 bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-200">
                {g.step} • {g.place}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                ⏱️ Ước tính: {g.estimatedTime}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-black text-indigo-950 mt-1">
              {g.title}
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedGuideStage(stageId);
            setShowStageGuideModal(true);
          }}
          className="px-4 py-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>📖 Hướng dẫn {g.step}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-sky-100/85 via-indigo-50/90 to-cyan-100/85 text-indigo-950 flex flex-col font-sans relative">
      {/* Header gọn nhẹ */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-indigo-900 hover:text-orange-600 px-3.5 py-1.5 bg-white rounded-full border border-indigo-100 shadow-xs font-bold text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIntroVideoStep(null);
              setShowCover(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-orange-50 text-indigo-900 hover:text-orange-600 font-bold text-xs border border-indigo-200/80 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-500" />
            <span>Bìa dự án</span>
          </button>

          <button
            type="button"
            onClick={() => {
              openIntroVideo('video2', true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-orange-50 text-indigo-900 hover:text-orange-600 font-bold text-xs border border-indigo-200/80 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Giới thiệu dự án</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewWordsModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs border border-emerald-200 cursor-pointer"
            title="Từ vựng Tiếng Anh Khoa học tự nhiên (New Words) kèm phát âm chuẩn"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>🇬🇧 New Words</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReferencesModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-orange-50 text-indigo-900 hover:text-orange-600 font-bold text-xs border border-indigo-200/80 cursor-pointer"
            title="Xem danh mục Tài liệu tham khảo & Nguồn học liệu của dự án"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tài liệu tham khảo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              import('./tinh-bot-cellulose/exportProjectDocx').then((m) => m.exportAllStagesToWord());
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-extrabold text-xs cursor-pointer transition-colors"
            title="Xuất toàn bộ nội dung 6 chặng của dự án ra file Word (.docx)"
          >
            <Download className="w-3.5 h-3.5 text-sky-700" />
            <span>Xuất Word 6 chặng</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!window.confirm('Thầy/Em có chắc chắn muốn đặt lại toàn bộ tiến trình học tập từ Chặng 1 trên máy này không?')) {
                return;
              }
              try {
                window.localStorage.removeItem(LOCAL_PROGRESS_CACHE_KEY);
              } catch {
                // ignore
              }
              window.location.reload();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 font-bold text-xs cursor-pointer transition-colors"
            title="Xóa tiến trình lưu tạm trên máy này để học lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm lại từ đầu</span>
          </button>

          <h1 className="text-sm md:text-base font-black text-indigo-950 ml-1">
            🌱 Dự án &ldquo;Bắt đầu từ sự kết thúc&rdquo; — Tinh bột &amp; Cellulose
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Chuyển đổi Chế độ Học sinh / Giáo viên */}
          <div className="flex items-center bg-indigo-50/90 p-1 rounded-full border border-indigo-200/80 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setIsTeacherMode(false);
                setIsJudgeMode(false);
                setStageLockMessage(null);
              }}
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${!isTeacherMode && !isJudgeMode
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-900/70 hover:text-indigo-950'
                }`}
            >
              <Lock className="w-3 h-3" />
              <span>Chế độ HS</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsJudgeMode(true);
                setIsTeacherMode(false);
                setStageLockMessage(null);
                unlockAllTasksForTeacher();
              }}
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${isJudgeMode
                ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                : 'text-indigo-900/70 hover:text-amber-600'
                }`}
              title="Chế độ dành cho Giám khảo: Không cần mật khẩu, mở tất cả chặng & xem tất cả kết quả"
            >
              <Award className="w-3 h-3" />
              <span>{isJudgeMode ? 'Giám khảo (Mở tất cả)' : 'Giám khảo'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isTeacherMode) {
                  setTeacherPassInput('');
                  setTeacherPassError(null);
                  setShowTeacherModal(true);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${isTeacherMode
                ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-xs'
                : 'text-indigo-900/70 hover:text-orange-600'
                }`}
            >
              <Unlock className="w-3 h-3" />
              <span>{isTeacherMode ? 'Chế độ GV (Mở hết chặng)' : 'Chế độ GV'}</span>
            </button>
          </div>

          {(isTeacherMode || isJudgeMode) && (
            <>
              <button
                type="button"
                onClick={() => {
                  setShowTeacherDashboard(true);
                  fetchTeacherDashboardData();
                }}
                className="px-3.5 py-1.5 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Xem toàn bộ kết quả kiểm tra, Rubric & Bảng kiểm của các nhóm"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{isJudgeMode ? 'Xem tất cả kết quả' : 'Bảng Tổng hợp Lớp'}</span>
              </button>
              <button
                type="button"
                onClick={unlockAllTasksForTeacher}
                className="px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-orange-900 border border-amber-300 font-black text-xs flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-orange-600" />
                <span>Mở tất cả ô</span>
              </button>
            </>
          )}

          <div className="flex items-center gap-2 bg-white border border-indigo-100 rounded-full px-3 py-1 shadow-xs">
            <span className="text-xs font-bold text-indigo-900/70">Đã mở:</span>
            <span className="text-xs font-black text-orange-600">
              {unlockedCount}/{ALL_TASK_IDS.length} ô
            </span>
            <span className="px-2 py-0.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-black text-[11px]">
              {progressPercent}%
            </span>
          </div>
        </div>
      </header>

      {/* Hộp thoại nhập mật khẩu Giáo viên */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-indigo-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-indigo-950">Kích hoạt Chế độ Giáo viên</h3>
                  <p className="text-[11px] font-medium text-indigo-900/60">
                    Mở khóa xem toàn bộ 6 chặng của dự án
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTeacherModal(false)}
                className="text-indigo-400 hover:text-indigo-900 text-xs font-bold px-2 py-1 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="teacher-password-input" className="text-xs font-bold text-indigo-950">
                Nhập mật khẩu Giáo viên:
              </label>
              <input
                id="teacher-password-input"
                type="password"
                value={teacherPassInput}
                onChange={(e) => {
                  setTeacherPassInput(e.target.value);
                  setTeacherPassError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleTeacherLogin()}
                placeholder="Nhập mật khẩu..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-sm font-bold text-indigo-950 focus:outline-none focus:border-orange-500"
              />
              {teacherPassError && (
                <p className="text-xs font-bold text-rose-600">{teacherPassError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowTeacherModal(false)}
                className="px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleTeacherLogin}
                className="px-5 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-xs cursor-pointer"
              >
                Xác nhận mở khóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BẢNG TỔNG HỢP KẾT QUẢ & THỐNG KÊ GIÁO VIÊN (GOM 50+ BÀI NỘP THÀNH 1 BẢNG + XUẤT EXCEL) */}
      {showTeacherDashboard && (() => {
        const searchLower = dashboardSearchQuery.trim().toLowerCase();
        const allClassNames = Array.from(
          new Set([
            ...dashboardTestRecords.map((r) => r.studentClass).filter(Boolean),
            ...dashboardRubricRecords.map((r) => r.className).filter(Boolean),
          ])
        ).sort();

        const filteredTests = dashboardTestRecords.filter((r) => {
          const matchClass = dashboardClassFilter === 'ALL' || r.studentClass === dashboardClassFilter;
          const matchSearch =
            !searchLower ||
            r.studentName.toLowerCase().includes(searchLower) ||
            r.studentClass.toLowerCase().includes(searchLower) ||
            r.studentSchool.toLowerCase().includes(searchLower);
          return matchClass && matchSearch;
        });

        const filteredRubrics = dashboardRubricRecords.filter((r) => {
          const matchClass = dashboardClassFilter === 'ALL' || r.className === dashboardClassFilter;
          const matchSearch =
            !searchLower ||
            r.evaluatorGroup.toLowerCase().includes(searchLower) ||
            r.targetGroup.toLowerCase().includes(searchLower) ||
            r.feedbackNote.toLowerCase().includes(searchLower);
          return matchClass && matchSearch;
        });

        const testAvg =
          filteredTests.length > 0
            ? Math.round(
              (filteredTests.reduce((acc, r) => acc + r.score, 0) / filteredTests.length) * 10
            ) / 10
            : 0;
        const testHighCount = filteredTests.filter((r) => r.score >= 8).length;
        const testMaxScore =
          filteredTests.length > 0 ? Math.max(...filteredTests.map((r) => r.score)) : 0;

        // Tự động gom theo Chặng + Nhóm được đánh giá để tính Điểm Trung Bình Rubric cho từng nhóm
        const formatRubricCriteriaText = (r: Stage3RubricSubmissionRecord) => {
          if (r.criteriaSummary?.trim()) return r.criteriaSummary;
          if (r.stage === 'stage-3') {
            const s3Keys = [
              's3-scientific-basis',
              's3-creativity',
              's3-process-quant',
              's3-safety-env',
              's3-presentation-qa',
            ];
            return s3Keys.map((k, i) => `TC${i + 1}: ${r.criteriaScores?.[k] ?? 0}`).join(' | ');
          }
          const s5Keys = ['rubric-product', 'rubric-poster', 'rubric-presentation'];
          return s5Keys.map((k, i) => `TC${i + 1}: ${r.criteriaScores?.[k] ?? 0}`).join(' | ');
        };

        const groupMap = new Map<
          string,
          { stageLabel: string; displayName: string; count: number; totalSum: number; notes: string[] }
        >();
        filteredRubrics.forEach((r) => {
          const stLabel = r.stageLabel || (r.stage === 'stage-5' ? 'Chặng 5' : 'Chặng 3');
          const key = `${stLabel}::${r.targetGroup.trim().toLowerCase() || 'chua-dat-ten'}`;
          const existing = groupMap.get(key) || {
            stageLabel: stLabel,
            displayName: r.targetGroup.trim() || '(Chưa ghi tên)',
            count: 0,
            totalSum: 0,
            notes: [],
          };
          existing.count += 1;
          existing.totalSum += Number(r.totalPoints || 0);
          if (r.feedbackNote?.trim()) {
            existing.notes.push(`${r.evaluatorGroup}: ${r.feedbackNote.trim()}`);
          }
          groupMap.set(key, existing);
        });
        const groupedRubricSummaries = Array.from(groupMap.values())
          .map((g) => ({
            ...g,
            avgPoints: Math.round((g.totalSum / g.count) * 100) / 100,
          }))
          .sort((a, b) => b.avgPoints - a.avgPoints);

        return (
          <div className="fixed inset-0 z-50 bg-indigo-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5">
            <div className="bg-slate-50 border-2 border-white rounded-3xl max-w-6xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header Modal */}
              <div className="bg-linear-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center shadow-xs">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm md:text-base font-black">
                      Bảng Tổng Hợp Kết Quả &amp; Thống Kê Lớp Học (Thầy Trần Văn Lĩnh)
                    </h2>
                    <p className="text-[11px] text-indigo-200 font-medium">
                      Gom tự động 50+ bài làm học sinh và phiếu Rubric về 1 bảng duy nhất — Hỗ trợ xuất file Excel (.CSV) chỉ với 1 chạm
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchTeacherDashboardData}
                    disabled={isLoadingDashboard}
                    className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDashboard ? 'animate-spin' : ''}`} />
                    <span>Tải lại dữ liệu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTeacherDashboard(false)}
                    className="p-2 rounded-full bg-white/15 hover:bg-rose-500 text-white cursor-pointer transition-colors"
                    title="Đóng bảng tổng hợp"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Nội dung cuộn bên trong Modal */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4">
                {dashboardLoadWarning && (
                  <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-3.5 py-2.5 text-xs font-bold">
                    ⚠️ {dashboardLoadWarning}
                  </div>
                )}

                {/* Thanh cấu hình kênh thu nhận báo cáo (Chống tràn 50 email + Google Sheets Webhook) */}
                <div className="bg-white border border-indigo-100 rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-indigo-950 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sendIndividualEmails}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSendIndividualEmails(checked);
                          try {
                            window.localStorage.setItem(LOCAL_SEND_INDIVIDUAL_EMAIL_KEY, String(checked));
                          } catch {
                            // ignore
                          }
                        }}
                        className="w-4 h-4 accent-indigo-600 rounded-sm cursor-pointer"
                      />
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>
                        Gửi kèm Email lẻ từng bài về <code>{TEACHER_EMAIL}</code>
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        (Nên TẮT khi cho 50 HS làm cùng lúc để tránh tràn hộp thư Gmail — dữ liệu vẫn tự lưu vào Bảng này)
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowSheetHelp((v) => !v)}
                      className="text-xs font-black text-emerald-700 hover:text-emerald-900 underline cursor-pointer shrink-0"
                    >
                      {showSheetHelp ? 'Ẩn hướng dẫn & Mã Apps Script' : '📗 Lấy mã Apps Script kết nối 3 Google Sheets'}
                    </button>
                  </div>

                  {/* 3 NÚT MỞ NHANH 3 FILE GOOGLE SHEETS CỦA THẦY TRẦN VĂN LĨNH */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-black text-slate-600">📊 Mở nhanh Google Sheets của Thầy:</span>
                    <a
                      href={TEACHER_SCORE_SHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-black flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>1. Điểm Kiểm tra Chặng 2</span>
                    </a>
                    <a
                      href={TEACHER_PEER_RUBRIC_SHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-[11px] font-black flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>2. Đánh giá đồng đẳng</span>
                    </a>
                    <a
                      href={TEACHER_SELF_RUBRIC_SHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-black flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>3. Tự đánh giá</span>
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <span className="text-[11px] font-black text-slate-600 shrink-0">
                      🔗 Link Web App Apps Script:
                    </span>
                    <input
                      type="url"
                      value={googleSheetWebhookUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGoogleSheetWebhookUrl(val);
                        setSheetTestFeedback(null);
                        try {
                          window.localStorage.setItem(LOCAL_SHEET_WEBHOOK_KEY, val.trim());
                        } catch {
                          // ignore
                        }
                      }}
                      placeholder="Dán link https://script.google.com/macros/s/.../exec sau khi Deploy để tự ghi vào cả 3 Sheets..."
                      className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-indigo-950 outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      disabled={!googleSheetWebhookUrl.trim()}
                      onClick={async () => {
                        setSheetTestFeedback('⏳ Đang gửi dòng kiểm tra...');
                        try {
                          await fetch(googleSheetWebhookUrl.trim(), {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                            body: JSON.stringify({
                              sheetType: 'stage2_test',
                              submittedAt: new Date().toLocaleString('vi-VN'),
                              studentName: 'Học sinh Test Kết nối',
                              studentClass: '9A1',
                              studentSchool: 'THCS',
                              score: 10,
                              maxScore: 10,
                              percent: '100%',
                              rank: 'Xuất sắc (Test)',
                            }),
                          });
                          setSheetTestFeedback('✅ Đã gửi thử 1 dòng! Thầy mở Sheet "Điểm kiểm tra kiến thức nền" kiểm tra xem đã nhảy dòng chưa nhé!');
                        } catch {
                          setSheetTestFeedback('❌ Không gửi được tới link này. Thầy kiểm tra lại link Web App và quyền "Anyone" nhé!');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs cursor-pointer shrink-0"
                    >
                      🧪 Gửi thử 1 dòng
                    </button>
                  </div>

                  {sheetTestFeedback && (
                    <div className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      {sheetTestFeedback}
                    </div>
                  )}

                  {showSheetHelp && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-950 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-black">
                          📌 Chỉ cần Deploy 1 Apps Script duy nhất là tự ghi vào đúng cả 3 file Google Sheets của Thầy!
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
                            setScriptCopied(true);
                            setTimeout(() => setScriptCopied(false), 3000);
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] cursor-pointer"
                        >
                          {scriptCopied ? '✅ Đã copy mã Apps Script!' : '📋 Copy nhanh mã Apps Script'}
                        </button>
                      </div>
                      <p className="leading-relaxed">
                        1. Mở link <strong>Điểm kiểm tra kiến thức nền</strong> ở trên → chọn <strong>Tiện ích mở rộng → Apps Script</strong>.<br />
                        2. Xóa code cũ và dán đoạn mã vừa copy (đã gắn sẵn ID của cả 3 file Google Sheets của thầy) → Lưu lại.<br />
                        3. Bấm <strong>Triển khai (Deploy) → Tùy chọn triển khai mới → Loại: Ứng dụng web (Web app) → Người có quyền truy cập: Bất kỳ ai (Anyone)</strong> → Bấm Triển khai &amp; Cấp quyền.<br />
                        4. Copy URL Web App (<code>https://script.google.com/macros/s/.../exec</code>) dán vào ô bên trên (hoặc gửi cho trợ lý gắn cứng vào code để cả 50 máy HS tự gửi!).
                      </p>
                      <pre className="bg-slate-900 text-emerald-300 p-2.5 rounded-xl text-[10px] overflow-x-auto max-h-40 font-mono">
                        {GOOGLE_APPS_SCRIPT_TEMPLATE}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Thanh chuyển Tab + Tìm kiếm & Lọc lớp */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-indigo-100 shadow-2xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTeacherDashboardTab('rubrics')}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${teacherDashboardTab === 'rubrics'
                        ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                        : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
                        }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Phiếu Rubric Chặng 3, 5 &amp; 6 ({filteredRubrics.length} phiếu)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeacherDashboardTab('tests')}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${teacherDashboardTab === 'tests'
                        ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                        : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
                        }`}
                    >
                      <Table2 className="w-3.5 h-3.5" />
                      <span>Kiểm tra 12 câu Chặng 2 ({filteredTests.length} bài)</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={dashboardSearchQuery}
                      onChange={(e) => setDashboardSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên HS / nhóm..."
                      className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-500 w-44"
                    />
                    <select
                      value={dashboardClassFilter}
                      onChange={(e) => setDashboardClassFilter(e.target.value)}
                      className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-indigo-950 outline-none"
                    >
                      <option value="ALL">Tất cả lớp</option>
                      {allClassNames.map((cls) => (
                        <option key={cls} value={cls}>
                          Lớp {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* NỘI DUNG TAB 1: TỔNG HỢP RUBRIC CHẶNG 3 & CHẶNG 5 */}
                {teacherDashboardTab === 'rubrics' ? (
                  <div className="flex flex-col gap-4">
                    {/* BẢNG 1A: TỔNG HỢP ĐIỂM TRUNG BÌNH THEO TỪNG NHÓM ĐƯỢC CHẤM */}
                    <div className="bg-white rounded-2xl border border-indigo-200 p-4 shadow-2xs flex flex-col gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xs md:text-sm font-black text-indigo-950">
                            🏆 Tổng hợp Điểm Trung Bình theo từng Nhóm được đánh giá ({groupedRubricSummaries.length} nhóm)
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Tự động gom tất cả các phiếu chấm Chặng 3, Chặng 5 và Đánh giá 360° Chặng 6 cho cùng 1 nhóm.
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={filteredRubrics.length === 0}
                          onClick={() =>
                            exportRecordsToCsv(
                              'Tong_hop_Rubric_Du_An.csv',
                              [
                                'STT',
                                'Chặng',
                                'Hình thức',
                                'Nhóm đánh giá',
                                'Nhóm được đánh giá',
                                'Lớp',
                                'Chi tiết điểm tiêu chí',
                                'Tổng điểm (/10)',
                                'Xếp loại',
                                'Nhận xét góp ý',
                                'Thời gian gửi',
                              ],
                              filteredRubrics.map((r, idx) => [
                                idx + 1,
                                r.stageLabel || (r.stage === 'stage-5' ? 'Chặng 5' : 'Chặng 3'),
                                r.mode === 'self' ? 'Tự đánh giá' : 'Đồng đẳng',
                                r.evaluatorGroup,
                                r.targetGroup,
                                r.className,
                                formatRubricCriteriaText(r),
                                r.totalPoints,
                                r.rank,
                                r.feedbackNote || '',
                                r.submittedAt,
                              ])
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Xuất Excel Rubric (.CSV)</span>
                        </button>
                      </div>

                      {groupedRubricSummaries.length === 0 ? (
                        <div className="text-center py-6 text-xs font-bold text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                          Chưa có phiếu đánh giá Rubric nào được nộp.
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-indigo-100">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-indigo-950 text-white font-black">
                                <th className="p-2.5 border-r border-indigo-800 w-24 text-center">Chặng</th>
                                <th className="p-2.5 border-r border-indigo-800">Nhóm được đánh giá</th>
                                <th className="p-2.5 border-r border-indigo-800 text-center w-24">Số lượt chấm</th>
                                <th className="p-2.5 border-r border-indigo-800 text-center w-28">Điểm TB (/10)</th>
                                <th className="p-2.5">Tổng hợp góp ý từ các nhóm</th>
                              </tr>
                            </thead>
                            <tbody>
                              {groupedRubricSummaries.map((g, idx) => (
                                <tr key={idx} className="border-t border-indigo-100 odd:bg-white even:bg-indigo-50/30">
                                  <td className="p-2.5 text-center">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${g.stageLabel.includes('6')
                                        ? 'bg-purple-100 text-purple-800'
                                        : g.stageLabel.includes('5')
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-sky-100 text-sky-800'
                                        }`}
                                    >
                                      {g.stageLabel}
                                    </span>
                                  </td>
                                  <td className="p-2.5 font-black text-indigo-950">{g.displayName}</td>
                                  <td className="p-2.5 text-center font-bold text-indigo-700">{g.count} phiếu</td>
                                  <td className="p-2.5 text-center">
                                    <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white font-black">
                                      {g.avgPoints} đ
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-[11px] text-slate-700 space-y-1">
                                    {g.notes.length > 0 ? (
                                      g.notes.map((n, nIdx) => <div key={nIdx}>• {n}</div>)
                                    ) : (
                                      <span className="text-slate-400 italic">(Chưa có ghi chú góp ý)</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* BẢNG 1B: CHI TIẾT TỪNG PHIẾU ĐÁNH GIÁ ĐÃ GỬI */}
                    <div className="bg-white rounded-2xl border border-indigo-200 p-4 shadow-2xs flex flex-col gap-2.5">
                      <h3 className="text-xs font-black uppercase text-indigo-900">
                        📑 Danh sách chi tiết từng phiếu đánh giá ({filteredRubrics.length})
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full min-w-220 text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-800 text-white font-black">
                              <th className="p-2.5 text-center w-10">STT</th>
                              <th className="p-2.5 text-center w-24">Chặng</th>
                              <th className="p-2.5">Nhóm đánh giá</th>
                              <th className="p-2.5">Nhóm được chấm</th>
                              <th className="p-2.5 text-center">Lớp</th>
                              <th className="p-2.5">Chi tiết tiêu chí</th>
                              <th className="p-2.5 text-center">Tổng</th>
                              <th className="p-2.5">Nhận xét</th>
                              <th className="p-2.5 text-center w-12">Xóa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRubrics.map((r, idx) => {
                              const stLabel = r.stageLabel || (r.stage === 'stage-5' ? 'Chặng 5' : 'Chặng 3');
                              return (
                                <tr key={r.id} className="border-t border-slate-200 odd:bg-white even:bg-slate-50">
                                  <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                                  <td className="p-2.5 text-center">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${stLabel.includes('6')
                                        ? 'bg-purple-100 text-purple-800'
                                        : stLabel.includes('5')
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-sky-100 text-sky-800'
                                        }`}
                                    >
                                      {stLabel}
                                    </span>
                                  </td>
                                  <td className="p-2.5 font-bold text-indigo-950">
                                    {r.evaluatorGroup}
                                    <span className="block text-[10px] text-slate-500 font-normal">
                                      {r.mode === 'self' ? 'Tự đánh giá' : 'Đồng đẳng'} • {r.submittedAt}
                                    </span>
                                  </td>
                                  <td className="p-2.5 font-black text-emerald-900">{r.targetGroup}</td>
                                  <td className="p-2.5 text-center font-bold">{r.className}</td>
                                  <td className="p-2.5 font-mono text-[11px] text-slate-700">
                                    {formatRubricCriteriaText(r)}
                                  </td>
                                  <td className="p-2.5 text-center font-black text-orange-600">{r.totalPoints}/10</td>
                                  <td className="p-2.5 text-[11px] text-slate-700 max-w-xs">{r.feedbackNote || '—'}</td>
                                  <td className="p-2.5 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDashboardRecord('rubrics', r.id)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                      title="Xóa phiếu này"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* NỘI DUNG TAB 2: TỔNG HỢP BÀI KIỂM TRA 12 CÂU CHẶNG 2 */
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-2xs">
                        <div className="text-[11px] font-bold text-slate-500">Tổng bài đã nộp</div>
                        <div className="text-xl font-black text-indigo-950">{filteredTests.length} học sinh</div>
                      </div>
                      <div className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-2xs">
                        <div className="text-[11px] font-bold text-slate-500">Điểm trung bình</div>
                        <div className="text-xl font-black text-orange-600">{testAvg} / 10 đ</div>
                      </div>
                      <div className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-2xs">
                        <div className="text-[11px] font-bold text-slate-500">Đạt từ 8 điểm trở lên</div>
                        <div className="text-xl font-black text-emerald-600">
                          {testHighCount} HS ({filteredTests.length > 0 ? Math.round((testHighCount / filteredTests.length) * 100) : 0}%)
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-2xs">
                        <div className="text-[11px] font-bold text-slate-500">Điểm cao nhất</div>
                        <div className="text-xl font-black text-sky-600">{testMaxScore} / 10 đ</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-indigo-200 p-4 shadow-2xs flex flex-col gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-xs md:text-sm font-black text-indigo-950">
                          📋 Bảng điểm Bài kiểm tra 12 câu Chặng 2 ({filteredTests.length} học sinh)
                        </h3>
                        <button
                          type="button"
                          disabled={filteredTests.length === 0}
                          onClick={() =>
                            exportRecordsToCsv(
                              'Bang_diem_Kiem_tra_Chang_2.csv',
                              ['STT', 'Họ và tên học sinh', 'Lớp', 'Trường', 'Điểm (/10)', 'Tỷ lệ (%)', 'Xếp loại', 'Thời gian nộp'],
                              filteredTests.map((t, idx) => [
                                idx + 1,
                                t.studentName,
                                t.studentClass,
                                t.studentSchool,
                                t.score,
                                `${t.percent}%`,
                                t.rank,
                                t.submittedAt,
                              ])
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Xuất Excel Bảng điểm (.CSV)</span>
                        </button>
                      </div>

                      {filteredTests.length === 0 ? (
                        <div className="text-center py-8 text-xs font-bold text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                          Chưa có học sinh nào nộp bài kiểm tra Chặng 2.
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-indigo-950 text-white font-black">
                                <th className="p-2.5 text-center w-12">STT</th>
                                <th className="p-2.5">Họ và tên học sinh</th>
                                <th className="p-2.5 text-center">Lớp</th>
                                <th className="p-2.5">Trường</th>
                                <th className="p-2.5 text-center">Điểm (/10)</th>
                                <th className="p-2.5 text-center">Xếp loại</th>
                                <th className="p-2.5">Thời gian nộp</th>
                                <th className="p-2.5 text-center w-12">Xóa</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTests.map((t, idx) => (
                                <tr key={t.id} className="border-t border-slate-200 odd:bg-white even:bg-slate-50">
                                  <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                                  <td className="p-2.5 font-black text-indigo-950">{t.studentName}</td>
                                  <td className="p-2.5 text-center font-bold">{t.studentClass}</td>
                                  <td className="p-2.5 text-slate-600">{t.studentSchool}</td>
                                  <td className="p-2.5 text-center font-black text-emerald-700">
                                    {t.score} <span className="text-[10px] text-slate-400">({t.percent}%)</span>
                                  </td>
                                  <td className="p-2.5 text-center">
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 font-bold text-[11px]">
                                      {t.rank}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-[11px] text-slate-500">{t.submittedAt}</td>
                                  <td className="p-2.5 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDashboardRecord('tests', t.id)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                      title="Xóa bài nộp này"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Thanh 6 Chặng */}
      <nav className="bg-white/60 backdrop-blur-md border-b border-white px-4 md:px-8 py-2.5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STAGES.map((st) => {
            const Icon = st.icon;
            const isActive = activeStage === st.id;
            const unlocked = isStageUnlocked(st.id);
            const done = isStageCompleted(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => switchStage(st.id)}
                className={`px-3 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border ${isActive
                  ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-md shadow-orange-500/20 scale-[1.01]'
                  : !unlocked
                    ? 'bg-white/50 text-slate-400 border-dashed border-slate-300'
                    : done
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-indigo-900 border-indigo-100 hover:text-orange-600 shadow-xs'
                  }`}
              >
                {!unlocked ? (
                  <Lock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                ) : (
                  <Icon className="w-4 h-4 shrink-0" />
                )}
                <div className="text-left leading-tight min-w-0 flex-1">
                  <div className="text-[10px] font-black uppercase opacity-85 truncate">
                    {st.step} • {st.place}
                  </div>
                  <div className="font-extrabold truncate">{st.label}</div>
                </div>
                {done && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col gap-4">
        {stageLockMessage && (
          <div className="bg-orange-50 border-2 border-orange-400 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-xs">
            <span className="text-xs font-bold text-orange-900">{stageLockMessage}</span>
            <button
              type="button"
              onClick={() => setStageLockMessage(null)}
              className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {activeStage === 'stage-1' && (
          <Stage1View
            guideBanner={renderStageGuideBanner('stage-1')}
            unlockedTaskIds={unlockedTaskIds}
            unlockTask={unlockTask}
            lockTask={lockTask}
            showPadletEmbed={showPadletEmbed}
            setShowPadletEmbed={setShowPadletEmbed}
            teamNameInput={teamNameInput}
            setTeamNameInput={setTeamNameInput}
            padletConfirmed={padletConfirmed}
            setPadletConfirmed={setPadletConfirmed}
            unlockedClueIds={unlockedClueIds}
            setUnlockedClueIds={setUnlockedClueIds}
            clueInputs={clueInputs}
            setClueInputs={setClueInputs}
            solvedClueIds={solvedClueIds}
            clueFeedback={clueFeedback}
            handleCheckClue={handleCheckClue}
            placedKeywordSlots={placedKeywordSlots}
            usedTileIndices={usedTileIndices}
            activeKeywordSlot={activeKeywordSlot}
            setActiveKeywordSlot={setActiveKeywordSlot}
            draggedTileIdx={draggedTileIdx}
            setDraggedTileIdx={setDraggedTileIdx}
            dragOverSlotIdx={dragOverSlotIdx}
            setDragOverSlotIdx={setDragOverSlotIdx}
            unlockedPoolTileIndices={unlockedPoolTileIndices}
            handlePlaceLetter={handlePlaceLetter}
            isKeywordComplete={isKeywordComplete}
            isNextStageUnlocked={isStageUnlocked('stage-2')}
            onNextStage={() => switchStage('stage-2')}
          />
        )}

        {/* ============================================================
            CHẶNG 2: KIẾN THỨC NỀN (TỰ HỌC TẠI NHÀ THEO THỨ TỰ BÀI HỌC I -> II -> III)
           ============================================================ */}
        {activeStage === 'stage-2' && (
          <Stage2View
            guideBanner={renderStageGuideBanner('stage-2')}
            isTeacherMode={isTeacherMode || isJudgeMode}
            unlockedTaskIds={unlockedTaskIds}
            unlockTask={unlockTask}
            lockTask={lockTask}
            isStage3Unlocked={isStageUnlocked('stage-3')}
            onGoToStage3={() => switchStage('stage-3')}
            jumpToStage2Section={jumpToStage2Section}
            toggleSetItem={toggleSetItem}
            setShowNewWordsModal={setShowNewWordsModal}
            isPart1Done={isPart1Done}
            isPart1DragComplete={isPart1DragComplete}
            isPart2Done={isPart2Done}
            isPart2aDone={isPart2aDone}
            isPart2aQuizAllAnswered={isPart2aQuizAllAnswered}
            isPart2bDone={isPart2bDone}
            isPart2bQuizAllAnswered={isPart2bQuizAllAnswered}
            isPart3Done={isPart3Done}
            isPart4Done={isPart4Done}
            isPart5Done={isPart5Done}
            checkedHomeItems={checkedHomeItems}
            setCheckedHomeItems={setCheckedHomeItems}
            worksheetDownloaded={worksheetDownloaded}
            setWorksheetDownloaded={setWorksheetDownloaded}
            showWorksheetGuide={showWorksheetGuide}
            setShowWorksheetGuide={setShowWorksheetGuide}
            showWorksheetPreview={showWorksheetPreview}
            setShowWorksheetPreview={setShowWorksheetPreview}
            worksheetPreviewType={worksheetPreviewType}
            setWorksheetPreviewType={setWorksheetPreviewType}
            handleDownloadWorksheetDoc={handleDownloadWorksheetDoc}
            video1Playing={video1Playing}
            setVideo1Playing={setVideo1Playing}
            video1Watched={video1Watched}
            setVideo1Watched={setVideo1Watched}
            shuffledDragItems={shuffledDragItems}
            dragPlacements={dragPlacements}
            setDragPlacements={setDragPlacements}
            draggedPropId={draggedPropId}
            setDraggedPropId={setDraggedPropId}
            dragOverZone={dragOverZone}
            setDragOverZone={setDragOverZone}
            dragFeedback={dragFeedback}
            setDragFeedback={setDragFeedback}
            handleAssignDragProp={handleAssignDragProp}
            iodineVideoUrl={iodineVideoUrl}
            setIodineVideoUrl={setIodineVideoUrl}
            showIodineVideoInput={showIodineVideoInput}
            setShowIodineVideoInput={setShowIodineVideoInput}
            videoIodineWatched={videoIodineWatched}
            setVideoIodineWatched={setVideoIodineWatched}
            iodineTubeState={iodineTubeState}
            hasAddedStarch={hasAddedStarch}
            hasAddedIodine={hasAddedIodine}
            iodineLabAnimating={iodineLabAnimating}
            testTubeTrackRef={testTubeTrackRef}
            clampPositionPct={clampPositionPct}
            isDraggingClamp={isDraggingClamp}
            setIsDraggingClamp={setIsDraggingClamp}
            isClampAtOneThird={isClampAtOneThird}
            updateClampPosition={updateClampPosition}
            handleAddStarchToTube={handleAddStarchToTube}
            handleAddIodineToTube={handleAddIodineToTube}
            handleResetIodineLab={handleResetIodineLab}
            iodineBlank1={iodineBlank1}
            setIodineBlank1={setIodineBlank1}
            iodineBlank2={iodineBlank2}
            setIodineBlank2={setIodineBlank2}
            iodineBlanksChecked={iodineBlanksChecked}
            setIodineBlanksChecked={setIodineBlanksChecked}
            isIodineBlank1Right={isIodineBlank1Right}
            isIodineBlank2Right={isIodineBlank2Right}
            isAllIodineBlanksRight={isAllIodineBlanksRight}
            iodineQuizAnswers={iodineQuizAnswers}
            setIodineQuizAnswers={setIodineQuizAnswers}
            iodineQuizSubmitted={iodineQuizSubmitted}
            setIodineQuizSubmitted={setIodineQuizSubmitted}
            hydrolysisVideoUrl={hydrolysisVideoUrl}
            setHydrolysisVideoUrl={setHydrolysisVideoUrl}
            showHydroVideoInput={showHydroVideoInput}
            setShowHydroVideoInput={setShowHydroVideoInput}
            videoHydroWatched={videoHydroWatched}
            setVideoHydroWatched={setVideoHydroWatched}
            hydrolysisDone={hydrolysisDone}
            setHydrolysisDone={setHydrolysisDone}
            hydroBlank1={hydroBlank1}
            setHydroBlank1={setHydroBlank1}
            hydroBlank2={hydroBlank2}
            setHydroBlank2={setHydroBlank2}
            hydroBlank3={hydroBlank3}
            setHydroBlank3={setHydroBlank3}
            hydroBlank4={hydroBlank4}
            setHydroBlank4={setHydroBlank4}
            hydroBlanksChecked={hydroBlanksChecked}
            setHydroBlanksChecked={setHydroBlanksChecked}
            isHydroBlank1Right={isHydroBlank1Right}
            isHydroBlank2Right={isHydroBlank2Right}
            isHydroBlank3Right={isHydroBlank3Right}
            isHydroBlank4Right={isHydroBlank4Right}
            isAllHydroBlanksRight={isAllHydroBlanksRight}
            hydroQuizAnswers={hydroQuizAnswers}
            setHydroQuizAnswers={setHydroQuizAnswers}
            hydroQuizSubmitted={hydroQuizSubmitted}
            setHydroQuizSubmitted={setHydroQuizSubmitted}
            appVideoUrl={appVideoUrl}
            setAppVideoUrl={setAppVideoUrl}
            showAppVideoInput={showAppVideoInput}
            setShowAppVideoInput={setShowAppVideoInput}
            video3Watched={video3Watched}
            setVideo3Watched={setVideo3Watched}
            hotspotMode={hotspotMode}
            setHotspotMode={setHotspotMode}
            hotspotSelections={hotspotSelections}
            solvedHotspotIds={solvedHotspotIds}
            hotspotFeedback={hotspotFeedback}
            handleToggleHotspotCell={handleToggleHotspotCell}
            handleRemoveHotspotSelection={handleRemoveHotspotSelection}
            handleCheckHotspots={handleCheckHotspots}
            handleResetHotspots={handleResetHotspots}
            handleShowHotspotSolution={handleShowHotspotSolution}
            testStudentName={testStudentName}
            setTestStudentName={setTestStudentName}
            testStudentClass={testStudentClass}
            setTestStudentClass={setTestStudentClass}
            testStudentSchool={testStudentSchool}
            setTestStudentSchool={setTestStudentSchool}
            testMcAnswers={testMcAnswers}
            setTestMcAnswers={setTestMcAnswers}
            testTfAnswers={testTfAnswers}
            setTestTfAnswers={setTestTfAnswers}
            testFillAnswers={testFillAnswers}
            setTestFillAnswers={setTestFillAnswers}
            testMatchingAnswers={testMatchingAnswers}
            setTestMatchingAnswers={setTestMatchingAnswers}
            isTestSubmitted={isTestSubmitted}
            testScore={testScore}
            testFeedbackMessage={testFeedbackMessage}
            isSendingEmail={isSendingEmail}
            handleSendTestToTeacherEmail={handleSendTestToTeacherEmail}
            showProjectGuidePreview={showProjectGuidePreview}
            setShowProjectGuidePreview={setShowProjectGuidePreview}
            projectGuidePreviewType={projectGuidePreviewType}
            setProjectGuidePreviewType={setProjectGuidePreviewType}
            markProjectGuideDownloaded={markProjectGuideDownloaded}
          />
        )}

        {activeStage === 'stage-3' && (
          <Stage3View
            guideBanner={renderStageGuideBanner('stage-3')}
            isTeacherMode={isTeacherMode || isJudgeMode}
            unlockedTaskIds={unlockedTaskIds}
            unlockTask={unlockTask}
            lockTask={lockTask}
            ideaDriveSubmitted={ideaDriveSubmitted}
            setIdeaDriveSubmitted={setIdeaDriveSubmitted}
            isStage31Done={isStage31Done}
            presenterName={presenterName}
            setPresenterName={setPresenterName}
            isStage32Done={isStage32Done}
            peerIdeaFormUrl={peerIdeaFormUrl}
            setPeerIdeaFormUrl={setPeerIdeaFormUrl}
            peerIdeaConfirmed={peerIdeaConfirmed}
            setPeerIdeaConfirmed={setPeerIdeaConfirmed}
            stage3AssessTab={stage3AssessTab}
            setStage3AssessTab={setStage3AssessTab}
            stage3RubricState={stage3RubricState}
            setStage3RubricState={setStage3RubricState}
            stage3RubricSummary={stage3RubricSummary}
            submitRubricEvaluation={submitRubricEvaluation}
            isNextStageUnlocked={isStageUnlocked('stage-4')}
            onNextStage={() => switchStage('stage-4')}
          />
        )}

        {activeStage === 'stage-4' && (
          <Stage4View
            guideBanner={renderStageGuideBanner('stage-4')}
            unlockedTaskIds={unlockedTaskIds}
            unlockTask={unlockTask}
            lockTask={lockTask}
            homeChecks={homeChecks}
            setHomeChecks={setHomeChecks}
            toggleSetItem={toggleSetItem}
            productSubmitted={productSubmitted}
            setProductSubmitted={setProductSubmitted}
            isNextStageUnlocked={isStageUnlocked('stage-5')}
            onNextStage={() => switchStage('stage-5')}
          />
        )}

        {activeStage === 'stage-5' && (
          <Stage5View
            guideBanner={renderStageGuideBanner('stage-5')}
            isTeacherMode={isTeacherMode || isJudgeMode}
            unlockedTaskIds={unlockedTaskIds}
            unlockTask={unlockTask}
            lockTask={lockTask}
            boothChecks={boothChecks}
            setBoothChecks={setBoothChecks}
            toggleSetItem={toggleSetItem}
            stage5PresentationSubmitted={stage5PresentationSubmitted}
            setStage5PresentationSubmitted={setStage5PresentationSubmitted}
            peerBoothFormUrl={peerBoothFormUrl}
            setPeerBoothFormUrl={setPeerBoothFormUrl}
            voteConfirmed={voteConfirmed}
            setVoteConfirmed={setVoteConfirmed}
            stage5AssessTab={stage5AssessTab}
            setStage5AssessTab={setStage5AssessTab}
            stage5RubricState={stage5RubricState}
            setStage5RubricState={setStage5RubricState}
            stage5RubricSummary={stage5RubricSummary}
            submitRubricEvaluation={submitRubricEvaluation}
            isNextStageUnlocked={isStageUnlocked('stage-6')}
            onNextStage={() => switchStage('stage-6')}
          />
        )}

        {/* ============================================================
            CHẶNG 6: TỔNG KẾT DỰ ÁN
           ============================================================ */}
        {activeStage === 'stage-6' && (
          <Stage6View
            guideBanner={renderStageGuideBanner('stage-6')}
            unlockedTaskIds={unlockedTaskIds}
            everUnlockedTaskIds={everUnlockedTaskIds}
            unlockTask={unlockTask}
            lockTask={lockTask}
            unlockedQuizIds={unlockedQuizIds}
            setUnlockedQuizIds={setUnlockedQuizIds}
            stage6SummaryVideoConfirmed={stage6SummaryVideoConfirmed}
            setStage6SummaryVideoConfirmed={setStage6SummaryVideoConfirmed}
            quizAnswers={quizAnswers}
            setQuizAnswers={setQuizAnswers}
            quizSubmitted={quizSubmitted}
            setQuizSubmitted={setQuizSubmitted}
            handleQuizSubmit={handleQuizSubmit}
            quizScore={quizScore}
            stage6GameMode={stage6GameMode}
            setStage6GameMode={setStage6GameMode}
            poseGameKey={poseGameKey}
            setPoseGameKey={setPoseGameKey}
            stage6AssessTab={stage6AssessTab}
            setStage6AssessTab={setStage6AssessTab}
            stage6SelfStudentName={stage6SelfStudentName}
            setStage6SelfStudentName={setStage6SelfStudentName}
            stage6SelfClass={stage6SelfClass}
            setStage6SelfClass={setStage6SelfClass}
            stage6SelfGroup={stage6SelfGroup}
            setStage6SelfGroup={setStage6SelfGroup}
            stage6SelfDate={stage6SelfDate}
            setStage6SelfDate={setStage6SelfDate}
            stage6SelfScores={stage6SelfScores}
            setStage6SelfScores={setStage6SelfScores}
            stage6SelfReflections={stage6SelfReflections}
            setStage6SelfReflections={setStage6SelfReflections}
            stage6SelfSignature={stage6SelfSignature}
            setStage6SelfSignature={setStage6SelfSignature}
            stage6SelfSubmitted={stage6SelfSubmitted}
            setStage6SelfSubmitted={setStage6SelfSubmitted}
            stage6LeaderName={stage6LeaderName}
            stage6LeaderClass={stage6LeaderClass}
            stage6LeaderGroup={stage6LeaderGroup}
            stage6Members={stage6Members}
            setStage6Members={setStage6Members}
            stage6SelectedMemberId={stage6SelectedMemberId}
            setStage6SelectedMemberId={setStage6SelectedMemberId}
            stage6LeaderSubmitted={stage6LeaderSubmitted}
            setStage6LeaderSubmitted={setStage6LeaderSubmitted}
            stage6TeacherGroup={stage6TeacherGroup}
            setStage6TeacherGroup={setStage6TeacherGroup}
            stage6TeacherClass={stage6TeacherClass}
            setStage6TeacherClass={setStage6TeacherClass}
            stage6TeacherProduct={stage6TeacherProduct}
            setStage6TeacherProduct={setStage6TeacherProduct}
            stage6TeacherName={stage6TeacherName}
            setStage6TeacherName={setStage6TeacherName}
            stage6TeacherScores={stage6TeacherScores}
            setStage6TeacherScores={setStage6TeacherScores}
            stage6TeacherStrengths={stage6TeacherStrengths}
            setStage6TeacherStrengths={setStage6TeacherStrengths}
            stage6TeacherIndividualAdjustments={stage6TeacherIndividualAdjustments}
            setStage6TeacherIndividualAdjustments={setStage6TeacherIndividualAdjustments}
            stage6TeacherSubmitted={stage6TeacherSubmitted}
            setStage6TeacherSubmitted={setStage6TeacherSubmitted}
          />
        )}
{/* FOOTER BẢN QUYỀN & TÀI LIỆU THAM KHẢO */}
<footer className="mt-2 pt-3 border-t border-indigo-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-900/75">
  <div className="flex items-center gap-2 font-bold">
    <span>🌱 Dự án Học tập STEAM KHTN 9 — Bài 30: Tinh bột &amp; Cellulose</span>
  </div>
  <div className="flex flex-wrap items-center gap-2">
    <button
      type="button"
      onClick={() => setShowNewWordsModal(true)}
      className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
    >
      <Volume2 className="w-3.5 h-3.5" />
      <span>🇬🇧 New Words (Từ vựng Tiếng Anh KHTN)</span>
    </button>
    <button
      type="button"
      onClick={() => setShowReferencesModal(true)}
      className="px-4 py-2 rounded-full bg-white hover:bg-indigo-50 text-indigo-950 font-black text-xs border border-indigo-200 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
    >
      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
      <span>📚 Danh mục Tài liệu tham khảo &amp; Nguồn học liệu</span>
    </button>
  </div>
</footer>
      </main >

      <NewWordsModal isOpen={showNewWordsModal} onClose={() => setShowNewWordsModal(false)} />

      <ReferencesModal isOpen={showReferencesModal} onClose={() => setShowReferencesModal(false)} />

      <NarratorOverlay
        isExpanded={isNarratorExpanded}
        activeStage={activeStage}
        onClose={() => setIsNarratorExpanded(false)}
        onOpenDetailedGuide={(s) => {
          setSelectedGuideStage(s);
          setShowStageGuideModal(true);
        }}
      />

      <StageGuideModal
        isOpen={showStageGuideModal}
        stages={STAGES}
        activeStage={activeStage}
        isStageCompleted={isStageCompleted}
        onSelectGuideStage={setSelectedGuideStage}
        selectedGuideStage={selectedGuideStage}
        isStageUnlocked={isStageUnlocked}
        isTeacherMode={isTeacherMode || isJudgeMode}
        onClose={() => setShowStageGuideModal(false)}
        onStartStage={(stage) => {
          setActiveStage(stage);
          setStageLockMessage(null);
        }}
      />
    </div>
  );
}
