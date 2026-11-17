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

interface TinhBotCelluloseElearningProps {
  onBack: () => void;
}

type StageId = 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4' | 'stage-5' | 'stage-6';

const PADLET_URL = 'https://padlet.com/tranvanl55/cellulose-bat-au-tu-su-ket-thuc-h0yekwetrfirtp9e';
const IDEA_DRIVE_URL = 'https://drive.google.com/drive/u/0/folders/1zxkC-W-mKio7gQ_qoW57xWSMO5Ng6I2C';
const STAGE5_POSTER_DRIVE_URL = 'https://drive.google.com/drive/folders/1B6YI-b5MInsnQqFjgVuA91Ow5o0nmM5o?usp=sharing';
const STAGE5_PRESENTATION_DRIVE_URL = 'https://drive.google.com/drive/folders/1p0bktY6oT5RkAi_DjvePniCFsquYvljJ?usp=sharing';
const PEER_ASSESSMENT_IDEA_FORM_URL = '';
const PEER_ASSESSMENT_BOOTH_FORM_URL = '';
const PROJECT_COVER_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F1(1).png?alt=media&token=36e8fb36-b5c6-4c47-879f-84020196df9a';
const WORKSHEET_PDF_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FPhieu_Hoc_Tap_Tinh_Bot_Cellulose.pdf?alt=media&token=154f34df-54d3-4b4f-b1af-10471d28f353';
const WORKSHEET_DOCX_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FPhieu_Hoc_Tap_Tinh_Bot_Cellulose.docx?alt=media&token=d92011e5-a6c2-4a78-bb81-bc01362e1a9c';
const PROJECT_GUIDE_PDF_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FPhi%E1%BA%BFu%20h%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn%20th%E1%BB%B1c%20hi%E1%BB%87n%20d%E1%BB%B1%20%C3%A1n.pdf?alt=media&token=c4f08ef5-3e05-43bb-9c9b-0911b8c03523';
const PROJECT_GUIDE_DOCX_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FPhi%E1%BA%BFu%20h%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn%20th%E1%BB%B1c%20hi%E1%BB%87n%20d%E1%BB%B1%20%C3%A1n.docx?alt=media&token=9659bf45-bab4-4874-8115-590490082f56';
const PROJECT_GUIDE_WORD_VIEW_URL =
  'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fgiaovien40-b080f.firebasestorage.app%2Fo%2Fimages%252FPhi%25E1%25BA%25BFu%2520h%25C6%25B0%25E1%25BB%259Bng%2520d%25E1%25BA%25ABn%2520th%25E1%25BB%25B1c%2520hi%25E1%25BB%2587n%2520d%25E1%25BB%25B1%2520%25C3%25A1n.docx%3Falt%3Dmedia%26token%3D9659bf45-bab4-4874-8115-590490082f56&wdOrigin=BROWSELINK';
const INTRO_VIDEO_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FIt_is_talking_n%E1%BB%81n_tr%E1%BA%AFng_046e9784_1080p-nobg.webm?alt=media&token=b0eb05d7-0fe2-4219-9ef2-2a397ec00ef6';
const PROJECT_INTRO_VIDEO_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FT%E1%BA%A1o_video_thuy%E1%BA%BFt_tr%C3%ACnh_cb0dc296_1080p.mp4?alt=media&token=abf68d09-53d7-4f4f-8cc6-ad0efe287c9d';
const STAGE2_PART1_VIDEO_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F1110.mp4?alt=media&token=780b13a2-d559-4aa0-bf0d-0b415d4ba49d';
const STAGE2_PART2_VIDEO_URL = 'https://www.youtube.com/watch?v=BKqXdjHkFyc';
const STAGE2_PART2_HYDROLYSIS_VIDEO_URL = 'https://www.youtube.com/watch?v=km6xl2srQ1A';
const STAGE2_PART3_VIDEO_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F1111.mp4?alt=media&token=6c59a5f8-b49b-4849-a03e-4732c01657c7';
const NARRATOR_VIDEO_URL =
  'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fd%E1%BA%ABn%20chuy%E1%BB%87n-nobg.webm?alt=media&token=a85c54d6-5cb0-48e2-8517-42e65de724f3';
const TEACHER_PASSWORD = '01011993';
const TEACHER_EMAIL = 'tranvanl55@gmail.com';
const FIRESTORE_STAGE2_TESTS_COLLECTION = 'khtn9_bai30_stage2_tests';
const FIRESTORE_STAGE3_RUBRICS_COLLECTION = 'khtn9_bai30_stage3_rubrics';
const LOCAL_TESTS_CACHE_KEY = 'KHTN9_BAI30_STAGE2_TESTS_V1';
const LOCAL_RUBRICS_CACHE_KEY = 'KHTN9_BAI30_RUBRICS_V3';
const LEGACY_RUBRICS_CACHE_KEYS = ['KHTN9_BAI30_STAGE3_RUBRICS_V1', 'KHTN9_BAI30_STAGE3_RUBRICS_V2'];
const LOCAL_SHEET_WEBHOOK_KEY = 'KHTN9_BAI30_SHEET_WEBHOOK_V1';
const LOCAL_SEND_INDIVIDUAL_EMAIL_KEY = 'KHTN9_BAI30_SEND_INDIVIDUAL_EMAIL_V1';
const LOCAL_PROGRESS_CACHE_KEY = 'KHTN9_BAI30_LEARNING_PROGRESS_V2';
const LEGACY_PROGRESS_CACHE_KEYS = ['KHTN9_BAI30_LEARNING_PROGRESS_V1'];

interface SavedLearningProgress {
  activeStage?: StageId;
  unlockedTaskIds?: string[];
  everUnlockedTaskIds?: string[];
  teamNameInput?: string;
  padletConfirmed?: boolean;
  solvedClueIds?: string[];
  placedKeywordSlots?: number[];
  usedTileIndices?: number[];
  worksheetDownloaded?: boolean;
  video1Watched?: boolean;
  dragPlacements?: Record<string, 'starch' | 'cellulose'>;
  videoIodineWatched?: boolean;
  hasAddedIodine?: boolean;
  iodineQuizAnswers?: Record<string, number>;
  iodineQuizSubmitted?: boolean;
  videoHydroWatched?: boolean;
  hydrolysisDone?: boolean;
  hydroQuizAnswers?: Record<string, number>;
  hydroQuizSubmitted?: boolean;
  video3Watched?: boolean;
  hotspotSelections?: Record<string, string>;
  solvedHotspotIds?: string[];
  testStudentName?: string;
  testStudentClass?: string;
  testStudentSchool?: string;
  testMcAnswers?: Record<number, number>;
  testTfAnswers?: Record<string, boolean>;
  testFillAnswers?: Record<string, string>;
  testMatchingAnswers?: Record<string, string>;
  isTestSubmitted?: boolean;
  testScore?: number;
  ansQ1?: string;
  ansQ2?: string;
  checkedHomeItems?: string[];
  selectedIdeaId?: string | null;
  ideaDriveSubmitted?: boolean;
  presenterName?: string;
  checkedSteps?: number[];
  peerIdeaConfirmed?: boolean;
  homeChecks?: string[];
  productSubmitted?: boolean;
  boothChecks?: string[];
  voteConfirmed?: boolean;
  quizAnswers?: Record<string, number>;
  quizSubmitted?: boolean;
  stage6SelectedTeamPreset?: string;
  stage6SelfStudentName?: string;
  stage6SelfClass?: string;
  stage6SelfGroup?: string;
  stage6SelfDate?: string;
  stage6SelfScores?: Record<string, number>;
  stage6SelfReflections?: {
    contribution: string;
    favorite: string;
    difficulties: string;
    improvement: string;
  };
  stage6SelfSignature?: string;
  stage6SelfSubmitted?: boolean;
  stage6LeaderName?: string;
  stage6LeaderClass?: string;
  stage6LeaderGroup?: string;
  stage6Members?: Stage6MemberRecord[];
  stage6SelectedMemberId?: string;
  stage6LeaderSubmitted?: boolean;
  stage6TeacherGroup?: string;
  stage6TeacherClass?: string;
  stage6TeacherProduct?: string;
  stage6TeacherName?: string;
  stage6TeacherScores?: Record<string, number>;
  stage6TeacherStrengths?: string;
  stage6TeacherIndividualAdjustments?: string;
  stage6TeacherSubmitted?: boolean;
}

const loadSavedLearningProgress = (): SavedLearningProgress => {
  try {
    let raw = window.localStorage.getItem(LOCAL_PROGRESS_CACHE_KEY);
    if (!raw) {
      for (const legacyKey of LEGACY_PROGRESS_CACHE_KEYS) {
        const legacyRaw = window.localStorage.getItem(legacyKey);
        if (legacyRaw) {
          raw = legacyRaw;
          window.localStorage.setItem(LOCAL_PROGRESS_CACHE_KEY, legacyRaw);
          window.localStorage.removeItem(legacyKey);
          break;
        }
      }
    }
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as SavedLearningProgress) : {};
  } catch {
    return {};
  }
};
const TEACHER_SCORE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1zCrL5k1Io7BMge80J9z1t4SFJ5kuF9okP_bR5F1shU8/edit?gid=0#gid=0';
const TEACHER_PEER_RUBRIC_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1KRFYHPOLRaKqSrF7YJGTI1sGTo2-4UWtinGZ5BXhkh4/edit?gid=0#gid=0';
const TEACHER_SELF_RUBRIC_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1q6WEcraxqG-Pki5jsIS6R4qlWj3YFqAV880adD-wiRs/edit?gid=0#gid=0';
const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL = '';

const GOOGLE_APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.sheetType === 'stage2_test') {
    var ssTest = SpreadsheetApp.openById('1zCrL5k1Io7BMge80J9z1t4SFJ5kuF9okP_bR5F1shU8');
    var sheetTest = ssTest.getSheets()[0];
    if (sheetTest.getLastRow() === 0) {
      sheetTest.appendRow(['Thời gian nộp', 'Họ và tên học sinh', 'Lớp', 'Trường', 'Điểm', 'Thang điểm', 'Tỷ lệ', 'Xếp loại']);
    }
    sheetTest.appendRow([
      data.submittedAt, data.studentName, data.studentClass,
      data.studentSchool, data.score, data.maxScore, data.percent, data.rank
    ]);
  } else if (data.sheetType === 'stage3_rubric_peer') {
    var ssPeer = SpreadsheetApp.openById('1KRFYHPOLRaKqSrF7YJGTI1sGTo2-4UWtinGZ5BXhkh4');
    var sheetPeer = ssPeer.getSheets()[0];
    if (sheetPeer.getLastRow() === 0) {
      sheetPeer.appendRow(['Thời gian gửi', 'Chặng', 'Nhóm đánh giá', 'Nhóm được đánh giá', 'Lớp', 'Chi tiết điểm tiêu chí', 'Tổng điểm (/10)', 'Xếp loại', 'Nhận xét']);
    }
    sheetPeer.appendRow([
      data.submittedAt, data.stageLabel || 'Chặng 3', data.evaluatorGroup, data.targetGroup, data.className,
      data.criteriaSummary || '', data.totalPoints, data.rank, data.feedbackNote
    ]);
  } else if (data.sheetType === 'stage3_rubric_self') {
    var ssSelf = SpreadsheetApp.openById('1q6WEcraxqG-Pki5jsIS6R4qlWj3YFqAV880adD-wiRs');
    var sheetSelf = ssSelf.getSheets()[0];
    if (sheetSelf.getLastRow() === 0) {
      sheetSelf.appendRow(['Thời gian gửi', 'Chặng', 'Nhóm tự đánh giá', 'Lớp', 'Chi tiết điểm tiêu chí', 'Tổng điểm (/10)', 'Xếp loại', 'Nhận xét tự rút kinh nghiệm']);
    }
    sheetSelf.appendRow([
      data.submittedAt, data.stageLabel || 'Chặng 3', data.evaluatorGroup, data.className,
      data.criteriaSummary || '', data.totalPoints, data.rank, data.feedbackNote
    ]);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
}`;

export interface Stage2TestSubmissionRecord {
  id: string;
  studentName: string;
  studentClass: string;
  studentSchool: string;
  score: number;
  maxScore: number;
  percent: number;
  rank: string;
  submittedAt: string;
  createdAtMs: number;
}

export interface Stage3RubricSubmissionRecord {
  id: string;
  stage?: 'stage-3' | 'stage-5' | 'stage-6';
  stageLabel?: string;
  mode: 'peer' | 'self';
  evaluatorGroup: string;
  targetGroup: string;
  className: string;
  criteriaScores: Record<string, number>;
  criteriaSummary?: string;
  totalPoints: number;
  rank: string;
  feedbackNote: string;
  submittedAt: string;
  createdAtMs: number;
}

// Dữ liệu lời dẫn chuyện & khe cắm âm thanh khi chuyển qua mỗi chặng
const STAGE_GUIDE_INFO: Record<StageId, { title: string; guideText: string; audioUrl?: string }> = {
  'stage-1': {
    title: 'Hướng dẫn Chặng 1: Khởi động',
    guideText:
      'Chào mừng các em đến với Chặng 1! Hãy mở Nhiệm vụ 1 để tạo nhóm trên Padlet, sau đó vượt qua 6 thử thách ở Nhiệm vụ 2 và kéo thả các chữ cái vào ô trống để tìm ra Từ khóa Bí ẩn của dự án nhé!',
    audioUrl: '',
  },
  'stage-2': {
    title: 'Hướng dẫn Chặng 2: Kiến thức nền (Tự học tại nhà)',
    guideText:
      'Chúc mừng các em đã sang Chặng 2! Các em hãy học theo thứ tự bài học: Phần I xem video và kéo thả tính chất vật lí; Phần II xem video thí nghiệm và làm trắc nghiệm hóa học; Phần III xem video và chọn 5 điểm nóng ứng dụng trên Hình 30.2; Phần IV hoàn thành bài kiểm tra 12 câu và Phần V vận dụng kiến thức vào thực tiễn đời sống nhé!',
    audioUrl: '',
  },
  'stage-3': {
    title: 'Hướng dẫn Chặng 3: Ý tưởng & Quy trình (Tại lớp)',
    guideText:
      'Ở Chặng 3 tại lớp, các nhóm hãy chuẩn bị bản ý tưởng sản phẩm tái sinh và nộp vào thư mục Google Drive ở mục 3.1, chốt đủ 4 bước quy trình ở mục 3.2 và tự đánh giá / đánh giá đồng đẳng theo thang đo Rubric ở mục 3.3 nhé!',
    audioUrl: '',
  },
  'stage-4': {
    title: 'Hướng dẫn Chặng 4: Hoàn thiện sản phẩm (Tại nhà)',
    guideText:
      'Chào mừng đến với Chặng 4! Tại nhà, nhóm hãy chế tạo mẫu sản phẩm, thử nghiệm thực tế, ghi hình minh chứng và đăng tải sản phẩm hoàn thiện lên Padlet dự án nhé!',
    audioUrl: '',
  },
  'stage-5': {
    title: 'Hướng dẫn Chặng 5: Ngày hội xanh (Báo cáo tại lớp)',
    guideText:
      'Đã đến Ngày hội xanh ở Chặng 5! Các nhóm hãy trưng bày gian hàng, thuyết trình cơ sở khoa học của sản phẩm và tham gia chấm điểm bình chọn cho các gian hàng nhé!',
    audioUrl: '',
  },
  'stage-6': {
    title: 'Hướng dẫn Chặng 6: Tổng kết dự án',
    guideText:
      'Chặng cuối cùng — Chặng 6! Các em hãy ôn lại phần Em đã học, tham gia trò chơi vận động trên Smart TV và hoàn thành đánh giá dự án 360 độ để về đích xuất sắc nhé!',
    audioUrl: '',
  },
};

export interface StageGuideStep {
  number: number;
  title: string;
  badge?: string;
  desc: string;
  actionHint?: string;
}

export interface StageDetailedGuide {
  id: StageId;
  step: string;
  label: string;
  title: string;
  place: string;
  emoji: string;
  estimatedTime: string;
  objective: string;
  steps: StageGuideStep[];
  tips: string[];
  completionCriteria: string[];
}

export const STAGE_DETAILED_GUIDES: Record<StageId, StageDetailedGuide> = {
  'stage-1': {
    id: 'stage-1',
    step: 'Chặng 1',
    label: 'Khởi động',
    title: 'Khởi động & Tạo lập nhóm dự án — Giải mã Từ khóa Bí ẩn',
    place: 'Tại lớp / Phòng máy tính',
    emoji: '🧩',
    estimatedTime: '15 - 20 phút',
    objective: 'Khơi dậy nhận thức về vấn nạn ô nhiễm môi trường do rác thải khó phân hủy; kết nối với polymer tự nhiên (Cellulose & Tinh bột); thành lập nhóm dự án STEAM và thống nhất nội quy làm việc nhóm.',
    steps: [
      {
        number: 1,
        title: 'Tạo lập nhóm và nộp bài trên Padlet (Ô 1.1)',
        badge: 'Bắt buộc • Làm việc nhóm',
        desc: 'Bấm nút "Mở Padlet tạo nhóm" để mở bảng Padlet của lớp trên tab mới. Mỗi nhóm tạo một bài đăng gồm: Tên nhóm, Danh sách thành viên (nhóm trưởng, thư ký, kỹ thuật viên, báo cáo viên), Ảnh chụp cả nhóm và Khẩu hiệu (Slogan) hành động vì môi trường xanh.',
        actionHint: 'Sau khi đăng Padlet, quay lại màn hình bài học, nhập đúng "Tên nhóm" vào ô và bấm nút "Xác nhận đã lập nhóm trên Padlet".'
      },
      {
        number: 2,
        title: 'Giải mã Ô chữ Khoa học & Tìm Từ khóa Bí ẩn (Ô 1.2)',
        badge: 'Bắt buộc • Tư duy cá nhân/nhóm',
        desc: 'Đọc kỹ 6 câu hỏi gợi ý hàng ngang liên quan đến rác thải sinh hoạt, rơm rạ, tính chất polymer, túi nilon. Nhập câu trả lời chính xác cho từng hàng để mở các chữ cái gợi ý.',
        actionHint: 'Kéo thả các chữ cái mở được vào hàng ô chữ dọc để ghép thành Từ khóa Bí ẩn gồm 9 chữ cái: "CELLULOSE". Bấm "Xác nhận hoàn thành Ô chữ".'
      }
    ],
    tips: [
      'Em có thể bấm nút "Nhúng Padlet tại đây" để thao tác ngay trên trang mà không phải nhảy sang tab mới.',
      'Nếu hàng ngang nào quá khó, hãy trao đổi nhanh với các bạn cùng nhóm hoặc đọc phần gợi ý phía dưới mỗi câu hỏi.',
      'Từ khóa trung tâm chính là thành phần cấu tạo nên thành tế bào thực vật, tạo nên độ dai chắc của rơm rạ, bã mía!'
    ],
    completionCriteria: [
      'Đã nhập tên nhóm và bấm xác nhận hoàn thành Nhiệm vụ 1 (Padlet).',
      'Đã giải đúng các hàng ngang và ghép chính xác từ khóa "CELLULOSE" ở Nhiệm vụ 2.',
      'Cả 2 nhiệm vụ hiển thị huy hiệu xanh lá "Đã hoàn thành". Chặng 2 sẽ tự động mở khóa.'
    ]
  },
  'stage-2': {
    id: 'stage-2',
    step: 'Chặng 2',
    label: 'Kiến thức nền',
    title: 'Khám phá Kiến thức Cốt lõi — Tinh bột & Cellulose (Bài 30 KHTN 9)',
    place: 'Tự học tại nhà (Cá nhân / Trực tuyến)',
    emoji: '🔬',
    estimatedTime: '35 - 45 phút',
    objective: 'Nắm vững công thức chung (C₆H₁₀O₅)ₙ, cấu trúc phân tử, trạng thái tự nhiên, tính chất vật lý; hiểu sâu phản ứng màu Iodine và phản ứng thủy phân xúc tác enzyme Amylase qua mô phỏng Canvas hạt phân tử; đạt kết quả tốt trong bài kiểm tra 12 câu.',
    steps: [
      {
        number: 1,
        title: 'Tải và chuẩn bị Phiếu ghi chép học tập',
        badge: 'Khởi động tự học',
        desc: 'Bấm nút "Tải Phiếu học tập (PDF)" hoặc "(DOCX)" ở đầu trang Chặng 2 để in ra giấy hoặc mở trên máy tính ghi chép song song trong suốt quá trình theo dõi bài giảng.',
        actionHint: 'Phiếu học tập sẽ là tài liệu quan trọng để giáo viên kiểm tra và chấm điểm quá trình tự học tại nhà.'
      },
      {
        number: 2,
        title: 'Phần I: Cấu trúc phân tử & Trạng thái tự nhiên',
        badge: 'Kiến thức 1',
        desc: 'Xem kỹ video bài giảng Phần I. Nếu mạng trường hoặc mạng nhà chậm, có thể dùng nút bảo hiểm "✓ Xác nhận đã xem video (nếu mạng chậm)". Sau đó, kéo thả các thẻ tính chất (hạt vô định hình, dạng sợi, tan trong nước nóng tạo hồ, không tan...) vào đúng cột Tinh bột hoặc Cellulose.',
        actionHint: 'Lưu ý: Tinh bột có cấu trúc xoắn (Amylose mạch thẳng, Amylopectin phân nhánh), còn Cellulose có cấu trúc mạch thẳng kéo dài xếp song song tạo sợi dai.'
      },
      {
        number: 3,
        title: 'Phần II.1: Phản ứng màu đặc trưng với Iodine',
        badge: 'Thí nghiệm hóa học',
        desc: 'Theo dõi thí nghiệm nhỏ dung dịch Iodine vào hồ tinh bột. Quan sát hiện tượng dung dịch chuyển sang màu xanh tím đặc trưng.',
        actionHint: 'Trả lời đúng 2 câu hỏi trắc nghiệm củng cố ngay dưới video để mở khóa phần mô phỏng tiếp theo.'
      },
      {
        number: 4,
        title: 'Phần II.2: Mô phỏng Động học Thủy phân Enzyme Amylase',
        badge: 'Phòng thí nghiệm ảo Canvas',
        desc: 'Tương tác với kính hiển vi vi mô Canvas: Bấm nút "Thêm Enzyme Amylase" để enzyme tham gia xúc tác; kéo thanh trượt chỉnh Nhiệt độ (tối ưu 37°C - 40°C) và Độ pH (tối ưu 6.8 - 7.0) để quan sát enzyme bẻ gãy các liên kết α-1,4-glycosidic tạo thành Maltose và Glucose.',
        actionHint: 'Quan sát các phân tử tinh bột dần phân rã thành các hạt màu hồng (Glucose) di chuyển tự do. Trả lời 2 câu hỏi củng cố.'
      },
      {
        number: 5,
        title: 'Phần III: Ứng dụng & Ý nghĩa sinh học',
        badge: 'Vận dụng thực tiễn',
        desc: 'Xem video Phần III và hoàn thành bài tập tương tác ghép nối vai trò của Tinh bột (lương thực, dự trữ năng lượng ở thực vật) và Cellulose (tạo màng tế bào thực vật, sản xuất giấy, sợi vải, màng sinh học bọc thực phẩm).',
        actionHint: 'Bấm chọn đúng các ứng dụng để tích lũy điểm thưởng.'
      },
      {
        number: 6,
        title: 'Làm và Nộp Bài kiểm tra củng cố 12 câu',
        badge: 'Đánh giá năng lực • Bắt buộc',
        desc: 'Điền chính xác: Họ và tên học sinh, Lớp, Trường. Đọc kỹ và hoàn thành 12 câu hỏi trắc nghiệm nhiều lựa chọn, đúng/sai và điền khuyết.',
        actionHint: 'Bấm nút "Nộp bài kiểm tra" để hệ thống chấm điểm tự động, lưu kết quả lên Firebase và gửi về Google Sheets của Thầy Cô.'
      }
    ],
    tips: [
      'Bài kiểm tra 12 câu quy về thang điểm 10, yêu cầu đạt từ 5/10 điểm trở lên để đủ điều kiện mở Chặng 3. Nếu điểm chưa cao, em có thể làm lại để cải thiện kết quả.',
      'Cả tiến trình học và câu trả lời đều được tự động lưu tạm trên máy, em không lo bị mất bài khi lỡ tay tải lại trang.',
      'Nút "✓ Xác nhận đã xem video" giúp em không bị kẹt khi mạng wifi yếu hoặc YouTube không tải được.'
    ],
    completionCriteria: [
      'Đã hoàn thành các bài tập tương tác ở Phần I, II.1, II.2 và III.',
      'Đã nộp thành công Bài kiểm tra 12 câu và đạt từ 50% điểm (5/10 điểm) trở lên.',
      'Nút "Sang Chặng 3" sẽ mở khóa sẵn sàng cho buổi học tại lớp.'
    ]
  },
  'stage-3': {
    id: 'stage-3',
    step: 'Chặng 3',
    label: 'Ý tưởng & Quy trình',
    title: 'Xây dựng Bản Ý tưởng & Thiết kế Quy trình Kỹ thuật Sản phẩm Xanh',
    place: 'Tại lớp học (Thảo luận nhóm)',
    emoji: '💡',
    estimatedTime: '40 - 45 phút',
    objective: 'Thảo luận nhóm để đề xuất giải pháp công nghệ tái sinh phụ phẩm nông nghiệp giàu cellulose; thiết kế quy trình sản xuất an toàn; thực hiện đánh giá Rubric cho dự án.',
    steps: [
      {
        number: 1,
        title: 'Mục 3.1: Đề xuất Ý tưởng Dự án STEAM Xanh',
        badge: 'Thảo luận nhóm',
        desc: 'Các nhóm thảo luận lựa chọn nguồn phụ phẩm địa phương (vỏ trấu, bã mía, rơm rạ khô, cuống lá sen...) và định hướng sản phẩm tái sinh (Giấy gieo mầm hạt giống, Khay ươm cây tự tiêu hủy, Màng bọc thực phẩm hữu cơ). Điền bản thuyết minh ý tưởng và tải lên thư mục Google Drive của lớp.',
        actionHint: 'Bấm nút "Mở Google Drive nộp ý tưởng", tải file lên rồi quay lại bấm "Xác nhận đã nộp ý tưởng".'
      },
      {
        number: 2,
        title: 'Mục 3.2: Thiết kế Quy trình Kỹ thuật 4 bước',
        badge: 'Thiết kế kỹ thuật',
        desc: 'Nhóm thiết lập sơ đồ quy trình gồm: 1. Thu gom & Xử lý thô nguyên liệu; 2. Nấu kiềm nhẹ / Nghiền mịn tách sợi cellulose; 3. Phối trộn chất kết dính (tinh bột) & gieo hạt; 4. Đổ khuôn, ép tách nước và sấy khô tự nhiên.',
        actionHint: 'Hoàn thành các câu hỏi trắc nghiệm an toàn quy trình kỹ thuật để chốt phương án chế tạo.'
      },
      {
        number: 3,
        title: 'Mục 3.3: Thực hiện Bảng Đánh giá Rubric Chặng 3',
        badge: 'Đánh giá Rubric',
        desc: 'Sử dụng thang đo Rubric 5 Tiêu chí × 5 Mức độ: 1. Tính mới & Giá trị thực tiễn; 2. Cơ sở khoa học KHTN; 3. Kỹ năng thiết kế quy trình; 4. Tính khả thi & An toàn môi trường; 5. Kỹ năng trình bày và phản biện.',
        actionHint: 'Điền Họ tên người đánh giá, chọn nhóm được đánh giá, chấm điểm từng tiêu chí từ 1 đến 5 sao và ghi lời nhận xét góp ý. Bấm "Lưu kết quả đánh giá Rubric".'
      }
    ],
    tips: [
      'Bản ý tưởng cần nêu bật: Vì sao chọn nguyên liệu này? Sản phẩm giải quyết được vấn đề rác thải nào ở địa phương?',
      'Khi chấm Rubric đồng đẳng cho nhóm bạn, hãy nhận xét khách quan, chỉ ra điểm sáng tạo và điểm cần cải tiến ở sơ đồ quy trình.',
      'Giáo viên có thể xem trực tiếp điểm số và biểu đồ phân bố điểm của cả lớp qua "Bảng Tổng hợp Lớp".'
    ],
    completionCriteria: [
      'Đã hoàn thành xác nhận nộp ý tưởng vào Google Drive (Mục 3.1).',
      'Đã hoàn thành sơ đồ quy trình kỹ thuật (Mục 3.2).',
      'Đã hoàn thành và lưu ít nhất 1 phiếu đánh giá Rubric Chặng 3 (Mục 3.3).',
      'Chuyển sang Chặng 4 để bắt tay vào chế tạo mẫu tại nhà.'
    ]
  },
  'stage-4': {
    id: 'stage-4',
    step: 'Chặng 4',
    label: 'Hoàn thiện sản phẩm',
    title: 'Chế tạo Mẫu thử & Ghi nhận Nhật ký Thí nghiệm tại nhà',
    place: 'Tại nhà / Phòng thực hành',
    emoji: '🛠️',
    estimatedTime: '2 - 3 ngày (thực hiện theo nhóm)',
    objective: 'Hiện thực hóa bản thiết kế từ Chặng 3 thành sản phẩm mẫu thực tế; kiểm tra thử nghiệm độ dai bền và tỷ lệ nảy mầm của hạt; quay chụp hình ảnh minh chứng nộp lên Padlet.',
    steps: [
      {
        number: 1,
        title: 'Ô 4.1: Thực hiện 3 bước Chế tạo & Thử nghiệm mẫu',
        badge: 'Thực hành chế tạo',
        desc: 'Nhóm thực hiện phân công các khâu: 1. Chế tạo mẫu (nấu, xay bột, đổ khuôn ép); 2. Thử nghiệm thực tế (thử độ bền kéo, độ dẻo, thử tưới nước kiểm tra khả năng nảy mầm của hạt giống hoa/rau); 3. Ghi hình minh chứng (chụp ảnh cận cảnh sản phẩm, quay video ngắn các thành viên đang cùng làm việc).',
        actionHint: 'Bấm tích chọn vào cả 3 ô (🥣 Chế tạo mẫu, 🔍 Thử nghiệm thực tế, 📸 Ghi hình minh chứng) trong Ô 4.1.'
      },
      {
        number: 2,
        title: 'Ô 4.2: Đăng tải Hình ảnh / Video sản phẩm lên Padlet',
        badge: 'Báo cáo minh chứng',
        desc: 'Bấm nút "Mở Padlet đăng sản phẩm" để truy cập bảng Padlet chung. Đăng bài gồm: Tên nhóm, Hình ảnh sản phẩm hoàn thiện rõ nét, video quá trình làm và ghi chú các ưu điểm nổi bật của mẫu thử.',
        actionHint: 'Sau khi đăng bài trên Padlet, quay lại màn hình bấm "Xác nhận đã nộp sản phẩm" để hoàn tất Ô 4.2.'
      }
    ],
    tips: [
      'An toàn là trên hết: Khi nấu hoặc xay nguyên liệu, cần có sự giám sát của người lớn hoặc phụ huynh.',
      'Không sấy giấy nảy mầm ở nhiệt độ trên 45°C vì nhiệt độ cao sẽ làm chết phôi hạt giống!',
      'Nên chuẩn bị thêm 1-2 mẫu dự phòng để mang đến trưng bày tại Ngày hội Xanh ở Chặng 5.'
    ],
    completionCriteria: [
      'Đã đánh dấu hoàn thành cả 3 bước tại Ô 4.1.',
      'Đã nộp bài minh chứng lên Padlet và bấm xác nhận tại Ô 4.2.',
      'Nút "Sang Chặng 5: Ngày hội xanh" được mở khóa.'
    ]
  },
  'stage-5': {
    id: 'stage-5',
    step: 'Chặng 5',
    label: 'Ngày hội xanh',
    title: 'Trưng bày Gian hàng Ngày hội Xanh & Thuyết trình Báo cáo tại lớp',
    place: 'Tại lớp học / Hội trường',
    emoji: '🎪',
    estimatedTime: '45 phút (tiết học báo cáo)',
    objective: 'Trưng bày gian hàng triển lãm sản phẩm tái sinh; thuyết minh cơ sở khoa học và thông điệp sống xanh; chấm điểm chéo bằng Bảng Rubric Ngày hội Xanh 3 Tiêu chí × 5 Mức độ.',
    steps: [
      {
        number: 1,
        title: 'Ô 5.1: Bày biện Gian hàng & Thuyết minh trước lớp',
        badge: 'Báo cáo trực tiếp',
        desc: 'Nhóm chuẩn bị: 1. Trưng bày & Giới thiệu poster, sản phẩm mẫu (giấy nảy mầm, màng bao sinh học, chậu ươm); 2. Giải thích cơ sở khoa học (nêu rõ vai trò của cellulose tạo liên kết sợi, tinh bột làm chất kết dính); 3. Thông điệp Xanh (lan tỏa ý thức bảo vệ môi trường, giảm rác thải nhựa).',
        actionHint: 'Tích chọn vào cả 3 nội dung trong Ô 5.1 sau khi nhóm hoàn thành phần trình bày của mình.'
      },
      {
        number: 2,
        title: 'Ô 5.2: Đánh giá Gian hàng theo Rubric (3 Tiêu chí × 5 Mức độ)',
        badge: 'Đánh giá gian hàng',
        desc: 'Tham quan các gian hàng của nhóm bạn và thực hiện đánh giá theo 3 tiêu chí: 1. Tính thẩm mỹ & Trực quan của Gian hàng, Poster và Sản phẩm; 2. Thông điệp bảo vệ môi trường & Ý nghĩa tái sinh rác thải; 3. Kỹ năng thuyết minh, phong thái tự tin và năng lực phản biện.',
        actionHint: 'Điền tên người chấm, nhóm được chấm, chọn mức điểm từ 1 đến 5 sao cho từng tiêu chí, ghi lời khen ngợi chân thành và bấm "Nộp kết quả đánh giá Gian hàng".'
      }
    ],
    tips: [
      'Khi thuyết trình, hãy tự tin trả lời các câu hỏi phản biện từ thầy cô và các nhóm bạn về giá thành sản xuất và khả năng mở rộng quy mô.',
      'Có thể mang theo chậu hoa nhỏ đã ươm thử từ giấy nảy mầm trước đó để làm minh chứng sinh động và ấn tượng nhất!',
      'Điểm số của gian hàng sẽ được tính trung bình từ đánh giá của cả lớp và giáo viên bộ môn.'
    ],
    completionCriteria: [
      'Đã hoàn thành 3 nội dung trưng bày và thuyết minh ở Ô 5.1.',
      'Đã nộp thành công phiếu đánh giá Rubric Gian hàng Xanh ở Ô 5.2.',
      'Mở khóa Chặng 6 để về đích toàn bộ dự án STEAM.'
    ]
  },
  'stage-6': {
    id: 'stage-6',
    step: 'Chặng 6',
    label: 'Tổng kết & Đánh giá dự án',
    title: 'Tổng kết Kiến thức, Game Body Pose Quiz Smart TV & Đánh giá dự án 360°',
    place: 'Tại lớp kết hợp Màn hình Smart TV',
    emoji: '🎓',
    estimatedTime: '25 - 30 phút',
    objective: 'Củng cố toàn bộ kiến thức "Em đã học & Em có thể"; tham gia trò chơi tương tác vận động cơ thể AI Body Pose Quiz trên Smart TV; hoàn tất đánh giá dự án 360 độ gồm Học sinh tự đánh giá, Nhóm trưởng đánh giá thành viên và Giáo viên đánh giá nhóm.',
    steps: [
      {
        number: 1,
        title: 'Ô 6.1: Khắc sâu kiến thức & Game Vận động Body Pose Quiz',
        badge: 'Tổng kết & Smart TV Gaming',
        desc: 'Ôn tập 5 kiến thức cốt lõi "EM ĐÃ HỌC" và "EM CÓ THỂ"; trải nghiệm trò chơi trắc nghiệm tạo dáng vận động trên Smart TV bằng 4 tư thế cơ thể (hoặc làm bài trắc nghiệm cá nhân).',
        actionHint: 'Bấm nút "Chiếu Smart TV" để mở game toàn màn hình và xác nhận hoàn thành trò chơi.'
      },
      {
        number: 2,
        title: 'Ô 6.2: Đánh giá dự án 360 độ (3 Phân hệ Đánh giá)',
        badge: 'Đánh giá đa chiều',
        desc: 'Thực hiện 3 hình thức đánh giá: (1) Học sinh tự đánh giá theo 4 tiêu chí rubric và viết phản chiếu (Reflection); (2) Nhóm trưởng đánh giá đóng góp của các thành viên trong nhóm; (3) Giáo viên chấm điểm nhóm theo Rubric 7 tiêu chí tổng hợp.',
        actionHint: 'Chuyển đổi giữa 3 tab, tích chọn mức độ rubric và bấm nút Nộp phiếu đánh giá.'
      },
      {
        number: 3,
        title: 'Vinh danh & Cam kết Hóa học Xanh',
        badge: 'Về đích xuất sắc',
        desc: 'Chúc mừng cả lớp đã hoàn thành xuất sắc toàn bộ Dự án STEAM "Bắt đầu từ sự kết thúc"! Ghi lại cam kết hành động xanh giảm thiểu rác thải nhựa trong học đường và gia đình.',
        actionHint: 'Dự án hoàn thành 100% với màn pháo hoa chúc mừng!'
      }
    ],
    tips: [
      'Trò chơi vận động tạo dáng trên Smart TV điều khiển bằng chuột, bàn phím (phím Space) hoặc remote, học sinh đứng lên tạo dáng theo đáp án mà hoàn toàn không cần camera.',
      'Phần đánh giá của nhóm trưởng đã được nạp sẵn danh sách thành viên nhóm do người dùng cấu hình, nhóm trưởng chỉ cần chọn bạn và chấm điểm.',
      'Phần đánh giá của giáo viên gồm 7 tiêu chí xuyên suốt từ quá trình đến sản phẩm dự án.'
    ],
    completionCriteria: [
      'Đã đọc ôn tập kiến thức và trải nghiệm trò chơi vận động tại Ô 6.1.',
      'Đã hoàn thành đánh giá dự án tại Ô 6.2.',
      'Dự án hoàn thành 100% với hiệu ứng pháo hoa vinh danh!'
    ]
  }
};

// Từ khóa 14 chữ cái: GREEN (5) + NEWSPAPER (9)
const KEYWORD_WORD_1 = ['G', 'R', 'E', 'E', 'N'];
const KEYWORD_WORD_2 = ['N', 'E', 'W', 'S', 'P', 'A', 'P', 'E', 'R'];
const FULL_KEYWORD_LETTERS = [...KEYWORD_WORD_1, ...KEYWORD_WORD_2];

interface CrosswordClue {
  id: string;
  rowNumber: number;
  question: string;
  answerDisplay: string;
  acceptedAnswers: string[];
  hint: string;
  unlockedSlots: number[];
  scrambledSlotOrder: number[];
}

const CROSSWORD_CLUES: CrosswordClue[] = [
  {
    id: 'cw-1',
    rowNumber: 1,
    question: 'Sản phẩm hữu cơ của quá trình quang hợp của cây xanh:',
    answerDisplay: 'GLUCOSE / TINH BỘT',
    acceptedAnswers: ['glucose', 'glucozo', 'glucozơ', 'tinh bột', 'tinh bot', 'tinhbot'],
    hint: '_ _ _ _ _ _ _',
    unlockedSlots: [0, 1],
    scrambledSlotOrder: [1, 0],
  },
  {
    id: 'cw-2',
    rowNumber: 2,
    question: 'Tinh bột và cellulose được tìm thấy chủ yếu ở giới sinh vật nào có khả năng quang hợp?',
    answerDisplay: 'THỰC VẬT',
    acceptedAnswers: ['thực vật', 'thuc vat', 'thucvat', 'cây xanh', 'cay xanh'],
    hint: '_ _ _ _   _ _ _',
    unlockedSlots: [2, 3],
    scrambledSlotOrder: [3, 2],
  },
  {
    id: 'cw-3',
    rowNumber: 3,
    question: 'Vật liệu tự nhiên dùng để đóng bàn ghế, xây dựng, sản xuất giấy:',
    answerDisplay: 'GỖ',
    acceptedAnswers: ['gỗ', 'go', 'cây gỗ', 'wood'],
    hint: '_ _',
    unlockedSlots: [4, 5],
    scrambledSlotOrder: [5, 4],
  },
  {
    id: 'cw-4',
    rowNumber: 4,
    question: 'Chất khí gây ra hiện tượng hiệu ứng nhà kính (được cây xanh hấp thụ trong quá trình quang hợp):',
    answerDisplay: 'CARBON DIOXIDE (CO₂)',
    acceptedAnswers: [
      'carbon dioxide',
      'carbondioxide',
      'co2',
      'khí co2',
      'khi co2',
      'cacbonic',
      'khí cacbonic',
      'khi cacbonic',
      'cacbon dioxit',
    ],
    hint: '_ _ _ _ _ _   _ _ _ _ _ _ _',
    unlockedSlots: [6, 7, 8],
    scrambledSlotOrder: [8, 6, 7],
  },
  {
    id: 'cw-5',
    rowNumber: 5,
    question: '🇬🇧 [English Challenge] What gas is produced and released by green plants during photosynthesis?',
    answerDisplay: 'OXYGEN (Khí Oxi)',
    acceptedAnswers: ['oxygen', 'o2', 'khí oxygen', 'oxi', 'khí oxi', 'khi oxi'],
    hint: '_ _ _ _ _ _',
    unlockedSlots: [9, 10, 11],
    scrambledSlotOrder: [11, 9, 10],
  },
  {
    id: 'cw-6',
    rowNumber: 6,
    question: '🇬🇧 [English Challenge] Plants make food by photosynthesis in which green part of the plant?',
    answerDisplay: 'LEAF (Chiếc lá)',
    acceptedAnswers: ['leaf', 'leaves', 'lá', 'lá cây', 'la cay'],
    hint: '_ _ _ _',
    unlockedSlots: [12, 13],
    scrambledSlotOrder: [13, 12],
  },
];

interface ScienceNewWordItem {
  id: string;
  term: string;
  ipa: string;
  partOfSpeech: string;
  formula?: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  category: 'Hóa học & Phân tử' | 'Sinh học & Phản ứng' | 'Dự án STEAM Xanh';
  emoji: string;
}

const SCIENCE_NEW_WORDS: ScienceNewWordItem[] = [
  {
    id: 'nw-starch',
    term: 'Starch',
    ipa: '/stɑːrtʃ/',
    partOfSpeech: '(n)',
    formula: '(C₆H₁₀O₅)ₙ',
    meaningVi: 'Tinh bột — Chất rắn dạng bột vô định hình, màu trắng, dự trữ năng lượng trong hạt, củ, quả.',
    exampleEn: 'Starch turns dark blue-purple when reacting with iodine solution.',
    exampleVi: 'Tinh bột chuyển sang màu xanh tím đậm khi tác dụng với dung dịch iodine.',
    category: 'Hóa học & Phân tử',
    emoji: '🌾',
  },
  {
    id: 'nw-cellulose',
    term: 'Cellulose',
    ipa: '/ˈsel.jə.loʊs/',
    partOfSpeech: '(n)',
    formula: '(C₆H₁₀O₅)ₙ',
    meaningVi: 'Cellulose (Xenlulozơ) — Chất rắn dạng sợi màu trắng, không tan trong nước, tạo nên thành tế bào thực vật.',
    exampleEn: 'Cotton fiber contains nearly 98% pure natural cellulose.',
    exampleVi: 'Sợi bông tự nhiên chứa gần 98% cellulose nguyên chất.',
    category: 'Hóa học & Phân tử',
    emoji: '🪵',
  },
  {
    id: 'nw-carbohydrate',
    term: 'Carbohydrate',
    ipa: '/ˌkɑːr.boʊˈhaɪ.dreɪt/',
    partOfSpeech: '(n)',
    formula: 'Cₙ(H₂O)ₘ',
    meaningVi: 'Hợp chất Carbohydrate (Chất đường bột) — Nhóm hợp chất hữu cơ gồm glucose, saccharose, tinh bột và cellulose.',
    exampleEn: 'Both starch and cellulose are important natural carbohydrates.',
    exampleVi: 'Cả tinh bột và cellulose đều là những carbohydrate tự nhiên quan trọng.',
    category: 'Hóa học & Phân tử',
    emoji: '🧬',
  },
  {
    id: 'nw-glucose',
    term: 'Glucose',
    ipa: '/ˈɡluː.koʊs/',
    partOfSpeech: '(n)',
    formula: 'C₆H₁₂O₆',
    meaningVi: 'Đường Glucose — Đường đơn sinh ra khi thủy phân hoàn toàn tinh bột hoặc cellulose.',
    exampleEn: 'Complete hydrolysis of starch or cellulose produces glucose.',
    exampleVi: 'Thủy phân hoàn toàn tinh bột hoặc cellulose đều tạo ra đường glucose.',
    category: 'Hóa học & Phân tử',
    emoji: '🍬',
  },
  {
    id: 'nw-iodine',
    term: 'Iodine',
    ipa: '/ˈaɪ.ə.daɪn/',
    partOfSpeech: '(n)',
    formula: 'I₂',
    meaningVi: 'Iodine (I-ốt) — Thuốc thử đặc trưng dùng để nhận biết hồ tinh bột nhờ tạo hợp chất màu xanh tím.',
    exampleEn: 'We use iodine solution to test for the presence of starch in food.',
    exampleVi: 'Chúng ta dùng dung dịch iodine để kiểm tra sự có mặt của tinh bột trong thực phẩm.',
    category: 'Sinh học & Phản ứng',
    emoji: '🧪',
  },
  {
    id: 'nw-hydrolysis',
    term: 'Hydrolysis',
    ipa: '/haɪˈdrɑː.lə.sɪs/',
    partOfSpeech: '(n)',
    meaningVi: 'Phản ứng thủy phân — Phản ứng cắt đứt mạch polymer bởi nước khi có xúc tác acid hoặc enzyme.',
    exampleEn: 'Acid or enzyme catalyzes the hydrolysis of starch into glucose molecules.',
    exampleVi: 'Acid hoặc enzyme xúc tác phản ứng thủy phân tinh bột thành các phân tử glucose.',
    category: 'Sinh học & Phản ứng',
    emoji: '💧',
  },
  {
    id: 'nw-amylase',
    term: 'Amylase enzyme',
    ipa: '/ˈæm.ɪ.leɪz ˈen.zaɪm/',
    partOfSpeech: '(n.phr)',
    meaningVi: 'Enzyme Amylase — Men sinh học trong nước bọt và hệ tiêu hóa giúp phân giải tinh bột thành đường vị ngọt.',
    exampleEn: 'Amylase enzyme in saliva breaks down starch when we chew rice thoroughly.',
    exampleVi: 'Enzyme amylase trong nước bọt phân giải tinh bột khi chúng ta nhai kỹ cơm.',
    category: 'Sinh học & Phản ứng',
    emoji: '🔬',
  },
  {
    id: 'nw-photosynthesis',
    term: 'Photosynthesis',
    ipa: '/ˌfoʊ.t̬oʊˈsɪn.θə.sɪs/',
    partOfSpeech: '(n)',
    meaningVi: 'Quá trình quang hợp — Quá trình cây xanh hấp thụ CO₂ và H₂O dưới ánh sáng mặt trời để tổng hợp tinh bột và giải phóng O₂.',
    exampleEn: 'Green plants synthesize starch from carbon dioxide and water through photosynthesis.',
    exampleVi: 'Cây xanh tổng hợp tinh bột từ khí CO₂ và nước thông qua quá trình quang hợp.',
    category: 'Sinh học & Phản ứng',
    emoji: '🌿',
  },
  {
    id: 'nw-polymer',
    term: 'Natural polymer',
    ipa: '/ˈnætʃ.ɚ.əl ˈpɑː.lɪ.mɚ/',
    partOfSpeech: '(n.phr)',
    meaningVi: 'Polymer tự nhiên — Phân tử khổng lồ gồm nhiều mắt xích (C₆H₁₀O₅) liên kết với nhau có sẵn trong tự nhiên.',
    exampleEn: 'Starch and cellulose are eco-friendly natural polymers.',
    exampleVi: 'Tinh bột và cellulose là các polymer tự nhiên thân thiện với môi trường.',
    category: 'Dự án STEAM Xanh',
    emoji: '🔗',
  },
  {
    id: 'nw-biodegradable',
    term: 'Biodegradable',
    ipa: '/ˌbaɪ.oʊ.dɪˈɡreɪ.də.bəl/',
    partOfSpeech: '(adj)',
    meaningVi: 'Tự phân hủy sinh học — Khả năng phân hủy tự nhiên thành chất vô hại nhờ vi sinh vật trong môi trường.',
    exampleEn: 'Bioplastics made from corn starch are completely biodegradable.',
    exampleVi: 'Nhựa sinh học làm từ tinh bột ngô có khả năng tự phân hủy sinh học hoàn toàn.',
    category: 'Dự án STEAM Xanh',
    emoji: '🌱',
  },
  {
    id: 'nw-green-newspaper',
    term: 'Green newspaper',
    ipa: '/ɡriːn ˈnuːzˌpeɪ.pɚ/',
    partOfSpeech: '(n.phr)',
    meaningVi: 'Báo xanh / Giấy báo tái sinh — Từ khóa chủ đề của dự án: tái chế giấy báo cũ giàu cellulose thành giấy nảy mầm và vật liệu xanh.',
    exampleEn: 'Students reuse old cellulose paper to create creative products from green newspaper.',
    exampleVi: 'Học sinh tái sử dụng giấy chứa cellulose cũ để sáng tạo các sản phẩm từ giấy báo xanh.',
    category: 'Dự án STEAM Xanh',
    emoji: '📰',
  },
  {
    id: 'nw-ethylic-alcohol',
    term: 'Ethylic alcohol',
    ipa: '/eˈθɪl.ɪk ˈæl.kə.hɑːl/',
    partOfSpeech: '(n.phr)',
    formula: 'C₂H₅OH',
    meaningVi: 'Ethylic alcohol (Cồn / Rượu etylic) — Sản phẩm quan trọng thu được khi lên men glucose từ tinh bột hoặc cellulose.',
    exampleEn: 'Starch and cellulose are used to produce ethylic alcohol in industry.',
    exampleVi: 'Tinh bột và cellulose được dùng để sản xuất cồn công nghiệp (ethylic alcohol).',
    category: 'Hóa học & Phân tử',
    emoji: '🍶',
  },
];

interface ProjectIdeaOption {
  id: string;
  title: string;
  material: 'Tinh bột' | 'Cellulose';
  emoji: string;
  shortDesc: string;
}

const PROJECT_IDEAS: ProjectIdeaOption[] = [
  {
    id: 'idea-bioplastic',
    title: 'Màng nhựa sinh học',
    material: 'Tinh bột',
    emoji: '🛍️',
    shortDesc: 'Từ tinh bột ngô/sắn + glycerol, tự phân hủy sinh học.',
  },
  {
    id: 'idea-seedpaper',
    title: 'Giấy tái chế - Giấy hạt giống',
    material: 'Cellulose',
    emoji: '🌱',
    shortDesc: 'Tái sinh giấy vụn chứa sợi cellulose kèm hạt mầm cây xanh.',
  },
  {
    id: 'idea-biostraw',
    title: 'Ống hút / Khay sinh học',
    material: 'Cellulose',
    emoji: '🥤',
    shortDesc: 'Ép từ bã mía, xơ dừa, rơm rạ giàu cellulose thay nhựa.',
  },
  {
    id: 'idea-bioglue',
    title: 'Hồ dán sinh học an toàn',
    material: 'Tinh bột',
    emoji: '🧴',
    shortDesc: 'Hồ tinh bột kết dính giấy, thủ công không hóa chất độc hại.',
  },
];

const PROCESS_STEPS = [
  { step: 1, emoji: '🌾', title: '1. Thu gom nguyên liệu', detail: 'Vỏ khoai, bột bắp, giấy vụn, bã mía' },
  { step: 2, emoji: '⚗️', title: '2. Xử lý & Phối trộn', detail: 'Nghiền bột / đun hồ tinh bột / ngâm bột giấy' },
  { step: 3, emoji: '☀️', title: '3. Tạo khuôn & Làm khô', detail: 'Đổ khuôn mỏng, ép phẳng và phơi/sấy khô' },
  { step: 4, emoji: '✅', title: '4. Thử nghiệm độ bền', detail: 'Kiểm tra độ dẻo, độ thấm nước & khả năng phân hủy' },
];

export interface RubricLevelOption {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  percentage: number;
  points: number;
  bullets: string[];
}

export interface Stage3RubricCriterion {
  id: string;
  category:
  | 'Ý tưởng (3.1)'
  | 'Quy trình (3.2)'
  | 'Trình bày & Phản biện'
  | 'Sản phẩm & Quy trình'
  | 'Poster Khoa học'
  | 'Thuyết trình & Phản biện';
  title: string;
  weightPercent: number;
  maxPoints: number;
  levels: RubricLevelOption[];
}

// Bảng tiêu chí đánh giá Chặng 3 (Ý tưởng & Quy trình thực hiện) — Analytical Rubric 5 Tiêu chí × 5 Mức độ
export const STAGE3_RUBRIC_CRITERIA: Stage3RubricCriterion[] = [
  {
    id: 's3-scientific-basis',
    category: 'Ý tưởng (3.1)',
    title: '1. CƠ SỞ KHOA HỌC & MỤC TIÊU Ý TƯỞNG',
    weightPercent: 25,
    maxPoints: 2.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.5,
        bullets: [
          'Chưa xác định được đối tượng tái chế thuộc Tinh bột hay Cellulose.',
          'Mục tiêu sản phẩm mơ hồ, chưa gắn với bài toán phế phẩm thực tế.',
          'Giải thích cơ sở hóa học sai lệch từ 2 nội dung trọng tâm trở lên.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.0,
        bullets: [
          'Nêu được tên nguyên liệu chính (Cellulose hoặc Tinh bột) nhưng chưa giải thích cấu tạo.',
          'Xác định được công năng cơ bản của sản phẩm dự kiến.',
          'Còn nhầm lẫn 1 ý nhỏ về tính tan hoặc độ dai sợi tự nhiên.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.5,
        bullets: [
          'Xác định đúng bản chất polymer tự nhiên (C₆H₁₀O₅)ₙ của nguyên liệu chọn.',
          'Giải thích được vai trò liên kết sợi Cellulose hoặc hồ hóa Tinh bột trong sản phẩm.',
          'Mục tiêu sản phẩm rõ ràng, phù hợp điều kiện làm tại lớp/nhà.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.0,
        bullets: [
          'Phân tích chính xác sự phối hợp tính chất: sợi Cellulose chịu kéo + keo Tinh bột kết dính.',
          'Nêu rõ nguồn gốc phế phẩm nông nghiệp/học đường cần xử lý tại địa phương.',
          'Đề xuất tiêu chí đánh giá độ bền hoặc khả năng phân hủy sinh học cho sản phẩm.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.5,
        bullets: [
          'Lập luận khoa học chặt chẽ từ cấu trúc phân tử đến tính chất cơ – lí của vật liệu sinh học.',
          'Mục tiêu ý tưởng định lượng rõ ràng, giải quyết vấn đề môi trường cấp thiết của cộng đồng.',
          'Dự đoán được biến đổi vật lí/hóa học trong từng khâu chế tạo và cách khắc phục.',
        ],
      },
    ],
  },
  {
    id: 's3-creativity',
    category: 'Ý tưởng (3.1)',
    title: '2. TÍNH SÁNG TẠO & GIÁ TRỊ XANH',
    weightPercent: 20,
    maxPoints: 2.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.4,
        bullets: [
          'Ý tưởng sao chép nguyên mẫu có sẵn, không có điều chỉnh cải tiến.',
          'Chưa thể hiện thông điệp giảm rác thải nhựa hoặc tái sinh xanh.',
          'Sản phẩm dự kiến thiếu tính ứng dụng trong đời sống học sinh.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 0.8,
        bullets: [
          'Có thay đổi nhỏ về hình dáng hoặc vật liệu so với gợi ý mẫu.',
          'Thể hiện được mục đích tận dụng lại giấy vụn hoặc phế phẩm thực vật.',
          'Ứng dụng ở mức trưng bày đơn giản, chưa tối ưu công năng sử dụng.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.2,
        bullets: [
          'Ý tưởng có điểm mới trong tạo hình hoặc phối hợp 2 nguồn phế phẩm sẵn có.',
          'Sản phẩm có công năng rõ ràng (giấy nảy mầm, chậu ươm, hộp quà, bao bì...).',
          'Có thông điệp bảo vệ môi trường gắn với sản phẩm.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 1.6,
        bullets: [
          'Sáng tạo trong tích hợp công năng kép (ví dụ giấy gói chứa hạt mầm tự phân hủy).',
          'Tối ưu hóa giá thành gần như 0 đồng nhờ tận dụng tối đa phế liệu trường/gia đình.',
          'Ý tưởng mang tính thẩm mỹ và lan tỏa lối sống xanh thuyết phục.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.0,
        bullets: [
          'Ý tưởng đột phá, kết hợp nhuần nhuyễn đa loại sợi tự nhiên/tinh bột với phụ gia sinh học an toàn.',
          'Giải pháp thay thế trực tiếp sản phẩm nhựa dùng một lần với giá trị thẩm mỹ và thương mại cao.',
          'Thiết kế thông điệp xanh truyền cảm hứng, có khả năng nhân rộng quy mô toàn trường.',
        ],
      },
    ],
  },
  {
    id: 's3-process-quant',
    category: 'Quy trình (3.2)',
    title: '3. TÍNH LOGIC & ĐỊNH LƯỢNG QUY TRÌNH 4 BƯỚC',
    weightPercent: 25,
    maxPoints: 2.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.5,
        bullets: [
          'Trình tự các bước lộn xộn hoặc thiếu từ 2 bước trở lên trong quy trình 4 bước.',
          'Không ghi khối lượng/tỉ lệ nguyên liệu, nước, thời gian thực hiện.',
          'Không phân công người phụ trách hoặc thiếu kế hoạch chuẩn bị dụng cụ.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.0,
        bullets: [
          'Liệt kê đủ 4 bước cơ bản (Chuẩn bị → Xử lý → Tạo hình → Hoàn thiện).',
          'Ghi định lượng chung chung (ví dụ "một ít nước", "một nắm giấy"), thiếu đơn vị chuẩn.',
          'Có nêu dụng cụ chính nhưng chưa dự trù thời gian cho công đoạn sấy/phơi.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.5,
        bullets: [
          'Quy trình 4 bước tuần tự hợp lý, chuyển tiếp mạch lạc giữa các công đoạn.',
          'Có định lượng cụ thể bằng đơn vị chuẩn (g, ml, phút, °C) cho ≥ 70% nguyên liệu.',
          'Phân công rõ nhiệm vụ cho từng thành viên trong nhóm ở Chặng 4.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.0,
        bullets: [
          'Quy trình chi tiết 100% các bước kèm tỉ lệ định lượng tối ưu (gam sợi / gam tinh bột / ml nước).',
          'Xác định rõ thông số kỹ thuật then chốt (nhiệt độ hồ hóa, lực ép, thời gian phơi nắng).',
          'Có phương án xử lý sự cố thường gặp (như rách màng, mốc, quá đặc/lỏng).',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.5,
        bullets: [
          'Quy trình chuẩn hóa như bản hướng dẫn kỹ thuật, nhóm khác đọc vào có thể làm theo chính xác.',
          'Định lượng khoa học kèm bảng so sánh hoặc thử nghiệm đối chứng ít nhất 2 công thức phối trộn.',
          'Hoạch định tiến độ chi tiết theo từng mốc thời gian và tiêu chí kiểm tra chất lượng đầu ra.',
        ],
      },
    ],
  },
  {
    id: 's3-safety-env',
    category: 'Quy trình (3.2)',
    title: '4. AN TOÀN THÍ NGHIỆM & BẢO VỆ MÔI TRƯỜNG',
    weightPercent: 15,
    maxPoints: 1.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.3,
        bullets: [
          'Đề xuất sử dụng hóa chất tẩy rửa mạnh/độc hại (xút đặc, Javen đặc) không có biện pháp bảo hộ.',
          'Không có quy định an toàn khi dùng thiết bị điện, nhiệt hoặc dao kéo.',
          'Chưa nêu cách xử lý nước thải và bã thừa sau khi chế tạo.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 0.6,
        bullets: [
          'Sử dụng nguyên liệu tương đối an toàn nhưng còn 1 bước có nguy cơ bỏng/đứt tay chưa cảnh báo.',
          'Có nhắc nhở đeo găng tay/giữ vệ sinh chung một cách khái quát.',
          'Có ý thức thu gom rác sau thực hành nhưng chưa phân loại bã hữu cơ.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 0.9,
        bullets: [
          'Không sử dụng hóa chất độc hại; ưu tiên nước ấm, giấm ăn hoặc phụ gia thực phẩm.',
          'Nêu rõ quy tắc an toàn khi dùng máy xay, bếp đun hồ tinh bột và dụng cụ cắt.',
          'Có phương án lọc nước thừa, không đổ bã xơ xuống bồn rửa gây tắc nghẽn.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 1.2,
        bullets: [
          '100% nguyên liệu thân thiện môi trường, an toàn tuyệt đối cho học sinh THCS.',
          'Chi tiết hóa đồ bảo hộ (găng tay, tạp dề, kính/kẹp cách nhiệt) cho từng công đoạn có rủi ro.',
          'Tái sử dụng phần nước ngâm/xơ thừa để tưới cây hoặc làm phân ủ xanh tại trường.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 1.5,
        bullets: [
          'Đảm bảo nguyên tắc Hóa học Xanh trọn vòng đời: nguyên liệu tái chế – chế tác không phát thải – sản phẩm tự phân hủy.',
          'Xây dựng checklist an toàn 3 khâu (Trước – Trong – Sau chế tạo) cụ thể và khả thi.',
          'Giải pháp tuần hoàn khép kín toàn bộ phụ phẩm thừa thành tài nguyên hữu ích.',
        ],
      },
    ],
  },
  {
    id: 's3-presentation-qa',
    category: 'Trình bày & Phản biện',
    title: '5. TRÌNH BÀY BẢN THIẾT KẾ & PHẢN BIỆN GÓP Ý',
    weightPercent: 15,
    maxPoints: 1.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.3,
        bullets: [
          'Bản mô tả ý tưởng và quy trình sơ sài, rời rạc, khó theo dõi.',
          'Thái độ thiếu hợp tác khi nhận xét chéo hoặc bỏ qua góp ý của nhóm bạn.',
          'Không giải thích được lý do chọn tỉ lệ nguyên liệu trong quy trình.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 0.6,
        bullets: [
          'Trình bày đủ nội dung 3.1 và 3.2 nhưng diễn đạt còn lan man.',
          'Tiếp thu góp ý của bạn nhưng chưa cụ thể hóa thành chỉnh sửa trong quy trình.',
          'Trả lời được câu hỏi đơn giản về tên vật liệu sử dụng.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 0.9,
        bullets: [
          'Bản thiết kế trình bày sạch sẽ, phân chia mục 3.1 (Ý tưởng) và 3.2 (Quy trình) rõ ràng.',
          'Lắng nghe tích cực và ghi nhận ít nhất 1 góp ý hữu ích từ nhóm đánh giá.',
          'Giải trình rõ công dụng của từng bước chính trong quy trình.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 1.2,
        bullets: [
          'Trình bày mạch lạc, kết hợp sơ đồ khối/hình phác thảo trực quan sản phẩm dự kiến.',
          'Phản biện lịch sự, bảo vệ được phương án bằng lập luận KHTN 9 và sẵn sàng hiệu chỉnh.',
          'Đặt được câu hỏi góp ý mang tính xây dựng cho quy trình của nhóm bạn.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 1.5,
        bullets: [
          'Bản thiết kế chuyên nghiệp, truyền cảm hứng và thuyết phục cao trước lớp/GV.',
          'Tư duy phản biện sắc bén, tiếp thu đa chiều để nâng cấp quy trình tối ưu ngay tại lớp.',
          'Đóng góp nhận xét giá trị giúp nhóm bạn phát hiện điểm nghẽn kỹ thuật trước khi thực hành.',
        ],
      },
    ],
  },
];

// Bảng tiêu chí đánh giá Chặng 5 (Ngày hội xanh: Báo cáo sản phẩm) — Analytical Rubric 3 Tiêu chí × 5 Mức độ
export const STAGE5_RUBRIC_CRITERIA: Stage3RubricCriterion[] = [
  {
    id: 'rubric-product',
    category: 'Sản phẩm & Quy trình',
    title: '1. SẢN PHẨM TÁI SINH (Hoàn thiện & Công năng)',
    weightPercent: 40,
    maxPoints: 4.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.8,
        bullets: [
          'Sản phẩm bị hỏng, mốc hoặc không hình thành được hình dáng.',
          'Không có hạt mầm (hoặc chưa có giải pháp công năng rõ ràng).',
          'Bề mặt thô ráp, rách nát, chưa thể hiện đặc tính vật liệu sinh học.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.6,
        bullets: [
          'Sản phẩm còn yếu, dễ rách khi cầm.',
          'Hạt mầm có nhưng bố trí chưa hợp lý, tập trung lệch.',
          'Bề mặt còn lợn cợn (> 30% xơ thô), chỉ dùng 1 loại sợi đơn giản.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 2.4,
        bullets: [
          'Sản phẩm thành hình vững, thể hiện được độ dai của Cellulose hoặc độ kết dính của Tinh bột.',
          'Hạt mầm phân bố tương đối đều trên ≥ 70% diện tích, không bị dập nát.',
          'Bề mặt tương đối phẳng nhưng chưa mịn đồng đều.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 3.2,
        bullets: [
          'Sản phẩm bền, đẹp, thể hiện rõ đặc tính vật lí của Cellulose / Tinh bột.',
          'Hạt mầm tích hợp sẵn đồng đều (100% diện tích), đảm bảo khả năng nảy mầm.',
          'Bề mặt mịn đẹp, quy trình hoàn thiện an toàn không hóa chất độc hại.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 4.0,
        bullets: [
          'Sản phẩm hoàn hảo, độ bền và khả năng chịu ẩm tốt, thẩm mỹ cao.',
          'Tích hợp hạt mầm khoa học kèm hướng dẫn gieo trồng / phân hủy sinh học.',
          'Có sự sáng tạo đột phá trong việc kết hợp ≥ 2 loại sợi tự nhiên / tinh bột.',
        ],
      },
    ],
  },
  {
    id: 'rubric-poster',
    category: 'Poster Khoa học',
    title: '2. POSTER KHOA HỌC (Nội dung Bài 30 & Quy trình)',
    weightPercent: 30,
    maxPoints: 3.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.6,
        bullets: [
          'Thông tin sai lệch về Bài 30 (Tinh bột & Cellulose) từ 2 kiến thức trở lên.',
          'Thiếu sơ đồ cấu tạo và chưa mô tả rõ quy trình xử lý phế phẩm.',
          'Trình bày cẩu thả, khó đọc, mắc ≥ 5 lỗi chính tả.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.2,
        bullets: [
          'Đầy đủ thông tin cơ bản về Bài 30, không sai kiến thức trọng tâm.',
          'Bố cục còn rời rạc, quá nhiều chữ (> 60% diện tích).',
          'Có liệt kê quy trình nhưng ít hình ảnh minh họa.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.8,
        bullets: [
          'Trình bày đúng kiến thức Tinh bột / Cellulose và mục tiêu dự án.',
          'Hình ảnh minh họa rõ ràng (≥ 2 ảnh) và có sơ đồ cấu tạo phân tử (C₆H₁₀O₅)ₙ.',
          'Bố cục chia mục cân đối, dễ đọc từ xa.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.4,
        bullets: [
          'Bố cục khoa học, màu sắc hài hòa, không mắc lỗi chính tả.',
          'Trình bày quy trình xử lý phế phẩm rất trực quan bằng sơ đồ mũi tên và ảnh thực tế.',
          'Gắn chặt cơ sở khoa học Bài 30 với các bước định lượng – tạo khuôn – thử nghiệm.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 3.0,
        bullets: [
          'Thiết kế chuyên nghiệp, bố cục cân đối (chữ ≤ 35%), giàu tính thẩm mỹ.',
          'Nội dung kết hợp nhuần nhuyễn giữa KHTN 9 (Bài 30) và thông điệp môi trường.',
          'Hệ thống sơ đồ cấu tạo, bảng số liệu thử nghiệm và quy trình minh họa truyền cảm hứng.',
        ],
      },
    ],
  },
  {
    id: 'rubric-presentation',
    category: 'Thuyết trình & Phản biện',
    title: '3. THUYẾT TRÌNH & PHẢN BIỆN',
    weightPercent: 30,
    maxPoints: 3.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.6,
        bullets: [
          'Nói nhỏ, đọc tài liệu hoàn toàn (> 90%).',
          'Thành viên thiếu phối hợp hoặc trình bày lố giờ > 2 phút.',
          'Không trả lời được câu hỏi phản biện từ lớp và giáo viên.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.2,
        bullets: [
          'Diễn đạt còn ngập ngừng, còn phụ thuộc tài liệu.',
          'Có phân chia thành viên nhưng chuyển tiếp còn gượng.',
          'Chỉ trả lời được các câu hỏi cơ bản về lý thuyết.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.8,
        bullets: [
          'Thuyết trình tự tin, giọng rõ ràng.',
          'Có sự phối hợp nhịp nhàng giữa các thành viên và đảm bảo đúng thời gian.',
          'Phản biện có chiều sâu, giải thích rõ quy trình làm sản phẩm.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.4,
        bullets: [
          'Diễn đạt lưu loát, lôi cuốn; phối hợp ăn ý với Poster và sản phẩm mẫu.',
          'Sử dụng tiếng Anh chuyên ngành đơn giản (starch, cellulose...) để giới thiệu quy trình.',
          'Phản biện tốt, đưa ra dẫn chứng khoa học bảo vệ quan điểm.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 3.0,
        bullets: [
          'Làm chủ sân khấu hoàn toàn; trình bày bằng tiếng Anh/Việt trôi chảy, tự nhiên.',
          'Điều phối nhóm linh hoạt, xử lý tình huống thuyết trình chuyên nghiệp.',
          'Phản biện sắc sảo, thuyết phục bằng số liệu thực nghiệm và đặt câu hỏi giá trị.',
        ],
      },
    ],
  },
];

interface QuizQuestion {
  id: string;
  tag: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    tag: 'Công thức phân tử',
    question: 'Công thức phân tử chung của tinh bột và cellulose là:',
    options: [
      '(C₆H₁₀O₅)ₙ (với n của cellulose lớn hơn nhiều so với tinh bột)',
      'C₆H₁₂O₆ (phân tử đường đơn glucose)',
      'C₁₂H₂₂O₁₁ (phân tử đường đôi saccharose)',
      '(C₆H₁₂O₆)ₙ (chuỗi polymer no)',
    ],
    correctIndex: 0,
  },
  {
    id: 'q2',
    tag: 'Nhận biết Iodine',
    question: 'Hiện tượng nào xảy ra khi nhỏ vài giọt dung dịch iodine vào hồ tinh bột (hoặc mặt cắt củ khoai tây)?',
    options: [
      'Xuất hiện kết tủa trắng bạc sáng lấp lánh',
      'Xuất hiện hợp chất có màu xanh tím đặc trưng',
      'Dung dịch lập tức chuyển sang màu đỏ gạch',
      'Có khí không màu sủi bọt thoát ra mạnh mẽ',
    ],
    correctIndex: 1,
  },
  {
    id: 'q3',
    tag: 'Sự hình thành ở thực vật',
    question: 'Nhờ quá trình sinh học nào mà thực vật có thể tự tổng hợp được glucose, sau đó chuyển hóa thành tinh bột và cellulose?',
    options: [
      'Quá trình hô hấp tế bào của lá cây vào ban đêm',
      'Quá trình hút khoáng và nước qua rễ',
      'Quá trình lên men lactic trong các mô thực vật',
      'Quá trình quang hợp từ CO₂ và H₂O dưới ánh sáng mặt trời nhờ chất diệp lục',
    ],
    correctIndex: 3,
  },
  {
    id: 'q4',
    tag: 'Phản ứng Thủy phân',
    question: 'Thủy phân hoàn toàn tinh bột hoặc cellulose (trong môi trường acid đun nóng hoặc nhờ enzyme), sản phẩm cuối cùng thu được là gì?',
    options: [
      'Saccharose (Đường mía dùng hằng ngày)',
      'Fructose (Đường có nhiều trong quả ngọt và mật ong)',
      'Glucose (C₆H₁₂O₆ - Đường nho có vị ngọt)',
      'Ethylic alcohol (Rượu cồn)',
    ],
    correctIndex: 2,
  },
  {
    id: 'q5',
    tag: 'Cấu tạo & Tính chất',
    question: 'Chất nào sau đây là thành phần chính tạo nên màng tế bào thực vật, tạo bộ khung vững chắc cho cây và tạo nên sợi bông dệt vải?',
    options: [
      'Hồ tinh bột dạng hạt',
      'Dầu thực vật và sáp',
      'Cellulose (có nhiều trong gỗ, tre, nứa, bông sợi)',
      'Đường saccharose hòa tan trong dịch cây',
    ],
    correctIndex: 2,
  },
  {
    id: 'q6',
    tag: 'Giải thích hiện tượng',
    question: 'Vì sao hồ tinh bột tạo màu xanh tím với dung dịch iodine (I₂), còn cellulose thì không có phản ứng này?',
    options: [
      'Do tinh bột không tan trong nước lạnh như cellulose',
      'Do cấu trúc xoắn của amylose trong tinh bột giữ được các phân tử iodine, còn cellulose mạch thẳng không xoắn',
      'Do tinh bột có phản ứng oxy hóa khử với iodine tạo chất kết tủa',
      'Do phân tử khối của cellulose nhỏ hơn nhiều so với tinh bột',
    ],
    correctIndex: 1,
  },
  {
    id: 'q7',
    tag: 'Ứng dụng thực tế',
    question: 'Ứng dụng nào sau đây KHÔNG PHẢI là ứng dụng thực tế chính của cellulose?',
    options: [
      'Sản xuất giấy viết và bao bì carton',
      'Dệt may vải sợi bông tự nhiên và chế tạo tơ nhân tạo',
      'Chế biến đồ gỗ xây dựng và nội thất',
      'Làm lương thực chính cung cấp năng lượng tiêu hóa hằng ngày cho con người',
    ],
    correctIndex: 3,
  },
  {
    id: 'q8',
    tag: '🇬🇧 English Challenge',
    question: '🇬🇧 [English Challenge] Why can humans digest starch (rice, bread) but CANNOT digest cellulose (grass, wood)?',
    options: [
      'Humans have the enzyme amylase to break down starch, but lack cellulase to break down cellulose',
      'Cellulose is a chemical poison that harms human stomach acids',
      'Starch is completely soluble in cold water whereas cellulose is insoluble',
      'Cellulose molecules contain carbon bonds that repel human body fluids',
    ],
    correctIndex: 0,
  },
];

export interface TaskGuideInfo {
  goal: string;
  steps: string[];
  tips?: string;
}

export const TASK_SPECIFIC_GUIDES: Record<string, TaskGuideInfo> = {
  'task-s1-padlet': {
    goal: 'Tạo lập nhóm dự án trên Padlet của lớp và xác nhận tên nhóm vào hệ thống.',
    steps: [
      'Bấm nút "Mở Padlet tạo nhóm" (hoặc bấm "Nhúng Padlet tại đây" để thao tác trực tiếp trên trang).',
      'Đăng bài viết mới gồm: Tên nhóm, Danh sách thành viên (nhóm trưởng, thư ký, kỹ thuật viên, báo cáo viên), Ảnh đại diện nhóm và Slogan hành động vì môi trường.',
      'Quay lại trang học tập, nhập chính xác Tên nhóm vào ô nhập liệu.',
      'Bấm nút "Xác nhận đã lập nhóm trên Padlet" để hoàn thành nhiệm vụ.'
    ],
    tips: 'Đặt tên nhóm ngắn gọn, giàu cảm hứng về lối sống xanh (ví dụ: Eco-Paper, Chiến Binh Xanh, Sợi Tái Sinh, GreenLife).'
  },
  'task-s1-crossword': {
    goal: 'Giải mã 6 câu hỏi gợi ý hàng ngang và tìm ra Từ khóa Bí ẩn gồm 9 chữ cái ở cột dọc.',
    steps: [
      'Đọc kỹ các câu hỏi từ Thử thách 1 đến Thử thách 6 liên quan đến rác thải, rơm rạ, tính chất polymer và túi nilon.',
      'Nhập câu trả lời chính xác vào từng hàng và bấm "Kiểm tra".',
      'Mỗi hàng trả lời đúng sẽ mở khóa các chữ cái gợi ý.',
      'Kéo thả các chữ cái vào hàng ô vuông để ghép thành Từ khóa Bí ẩn: "CELLULOSE".',
      'Bấm nút "Xác nhận hoàn thành Ô chữ".'
    ],
    tips: 'Nếu gặp câu hỏi khó, hãy đọc phần gợi ý bên dưới hoặc thảo luận nhanh cùng bạn bè. Từ khóa bí mật chính là thành phần tạo nên độ dai chắc của thành tế bào thực vật!'
  },
  'task-s2-worksheet': {
    goal: 'Chuẩn bị tài liệu ghi chép bài học cá nhân trước khi bước vào các bài học tự học tại nhà.',
    steps: [
      'Bấm nút "Tải Phiếu học tập (PDF)" hoặc "(DOCX)" để tải về máy hoặc in ra giấy.',
      'Có thể bấm nút "Xem trước Phiếu học tập" để xem trực tiếp các mục câu hỏi cần trả lời.',
      'Vừa theo dõi video bài giảng và thực hiện các thí nghiệm ảo, vừa ghi chép các ý chính vào phiếu.',
      'Bấm nút "Xác nhận: Em đã có phiếu".'
    ],
    tips: 'Phiếu học tập hoàn chỉnh là cơ sở để giáo viên đánh giá điểm quá trình và giúp em làm bài kiểm tra 12 câu đạt điểm tối đa!'
  },
  'task-s2-part1': {
    goal: 'Nắm vững cấu trúc phân tử và tính chất vật lý của Tinh bột và Cellulose qua video bài giảng và bài tập kéo thả.',
    steps: [
      'Bấm nút "Phát bài giảng" ở Bước 1 để theo dõi video về cấu trúc phân tử, trạng thái tự nhiên (nếu mạng yếu, bấm "Xác nhận xem").',
      'Đọc các thẻ tính chất ở Bước 2 (dạng sợi dai, hạt vô định hình, tan trong nước nóng tạo hồ, không tan trong nước...).',
      'Kéo thả từng thẻ vào đúng cột "Tinh bột" hoặc "Cellulose".',
      'Bấm nút "Kiểm tra kết quả kéo thả" để hoàn thành Phần I.'
    ],
    tips: 'Tinh bột gồm các gốc α-glucose (mạch xoắn), còn Cellulose gồm các gốc β-glucose (mạch thẳng kéo dài xếp song song tạo bó sợi bền chắc).'
  },
  'task-s2-part2-iodine': {
    goal: 'Quan sát và giải thích hiện tượng phản ứng màu đặc trưng giữa hồ tinh bột và dung dịch Iodine.',
    steps: [
      'Theo dõi video thí nghiệm nhỏ dung dịch Iodine vào ống nghiệm chứa hồ tinh bột.',
      'Quan sát hiện tượng: Dung dịch chuyển sang màu xanh tím đặc trưng ở nhiệt độ thường.',
      'Đọc kỹ và trả lời 2 câu hỏi trắc nghiệm củng cố ngay dưới video.',
      'Bấm "Nộp câu trả lời" để hoàn thành phần II.1.'
    ],
    tips: 'Cellulose không có cấu trúc xoắn giữ phân tử Iodine nên KHÔNG có phản ứng màu xanh tím này. Đây là phản ứng đặc trưng để nhận biết tinh bột!'
  },
  'task-s2-part2-hydrolysis': {
    goal: 'Khám phá động học phản ứng thủy phân enzyme Amylase cắt mạch phân tử Tinh bột thành Glucose trên kính hiển vi Canvas vi mô.',
    steps: [
      'Bấm nút "Thêm Enzyme Amylase" để đưa các enzyme xúc tác vào môi trường phản ứng.',
      'Kéo thanh trượt điều chỉnh Nhiệt độ về khoảng tối ưu (37°C - 40°C) và Độ pH về khoảng tối ưu (6.8 - 7.0).',
      'Quan sát các phân tử tinh bột dần bị enzyme cắt đứt liên kết glycosidic, phân rã thành các hạt màu hồng (Glucose) di chuyển tự do.',
      'Hoàn thành 2 câu hỏi trắc nghiệm kiểm tra hiểu biết ở bên dưới.'
    ],
    tips: 'Ở nhiệt độ quá cao (> 60°C) hoặc môi trường quá acid/kiềm, enzyme Amylase sẽ bị biến tính làm tốc độ phản ứng giảm mạnh hoặc ngừng hẳn!'
  },
  'task-s2-part3': {
    goal: 'Nhận diện vai trò sinh học và các ứng dụng thực tế phong phú của Tinh bột và Cellulose.',
    steps: [
      'Xem video bài giảng Phần III về ứng dụng trong đời sống và sản xuất.',
      'Tương tác với sơ đồ ứng dụng: Bấm vào 5 điểm nóng (hotspots) để khám phá: lương thực, dệt may, sản xuất giấy, màng bọc sinh học, dược phẩm.',
      'Hoàn thành bài tập ghép nối ứng dụng tương ứng.'
    ],
    tips: 'Tinh bột cung cấp năng lượng thiết yếu cho con người và động vật; Cellulose là vật liệu tự nhiên để sản xuất giấy, vải sợi và màng sinh học tự hủy!'
  },
  'task-s2-part4': {
    goal: 'Vận dụng kiến thức khoa học đã học để giải thích các hiện tượng thực tiễn trong đời sống.',
    steps: [
      'Đọc 2 câu hỏi vận dụng: 1. Vì sao nhai kỹ cơm hoặc bánh mì thấy có vị ngọt? 2. Kể tên các sản phẩm thân thiện môi trường từ phụ phẩm thực vật.',
      'Nhập câu trả lời ngắn gọn, rõ ràng vào 2 ô tương ứng.',
      'Bấm nút "Gửi câu trả lời vận dụng".'
    ],
    tips: 'Khi nhai kỹ cơm, enzyme amylase trong nước bọt thủy phân tinh bột thành đường maltose có vị ngọt nhẹ!'
  },
  'task-s2-part5': {
    goal: 'Đánh giá năng lực toàn diện Bài 30 KHTN 9 qua Bài kiểm tra củng cố 12 câu.',
    steps: [
      'Điền đầy đủ và chính xác: Họ và tên học sinh, Lớp, Trường học.',
      'Đọc kỹ và làm 12 câu hỏi trắc nghiệm (Trắc nghiệm 4 lựa chọn, Đúng/Sai, Điền khuyết, Tiếng Anh KHTN).',
      'Rà soát lại toàn bộ đáp án trước khi bấm "Nộp bài kiểm tra".',
      'Xem điểm số, xếp loại và lời khen xuất hiện ngay sau khi nộp.'
    ],
    tips: 'Cần đạt từ 5/10 điểm trở lên để đủ điều kiện mở Chặng 3. Em có thể làm lại bài nếu muốn cải thiện điểm số!'
  },
  'task-s3-idea': {
    goal: 'Đề xuất ý tưởng dự án STEAM tái sinh phụ phẩm nông nghiệp thành sản phẩm xanh và nộp lên Google Drive của lớp.',
    steps: [
      'Nhóm thảo luận chọn nguồn phụ phẩm địa phương (vỏ trấu, bã mía, rơm rạ, vỏ ngô...) và sản phẩm dự kiến (giấy gieo mầm, chậu ươm, màng bọc sinh học).',
      'Hoàn thiện bản thuyết minh ý tưởng dự án theo mẫu của giáo viên.',
      'Bấm nút "Mở Google Drive nộp ý tưởng" và tải file của nhóm lên thư mục chung.',
      'Bấm nút "Xác nhận đã nộp ý tưởng".'
    ],
    tips: 'Nêu bật: Ý tưởng này giải quyết được vấn đề rác thải nông nghiệp nào tại địa phương và tính sáng tạo của sản phẩm.'
  },
  'task-s3-process': {
    goal: 'Báo cáo ý tưởng và quy trình 4 bước thực hiện tại lớp, ghi tên học sinh đại diện nhóm thuyết trình.',
    steps: [
      'Ghi họ và tên học sinh đại diện nhóm thuyết trình báo cáo trước lớp.',
      'Thảo luận và xác nhận 4 bước quy trình: 1. Thu gom nguyên liệu; 2. Xử lý & Phối trộn; 3. Tạo khuôn & Làm khô; 4. Thử nghiệm độ bền.',
      'Bấm xác nhận hoàn thành từng bước quy trình.'
    ],
    tips: 'Chuẩn bị bài thuyết trình ngắn gọn từ 3-5 phút nêu bật tính sáng tạo, cơ sở khoa học và an toàn của sản phẩm!'
  },
  'task-s3-peer': {
    goal: 'Thực hiện đánh giá theo thang đo Rubric 5 Tiêu chí × 5 Mức độ cho nhóm mình và nhóm bạn.',
    steps: [
      'Nhập Họ tên người đánh giá, Lớp, và Tên nhóm được đánh giá.',
      'Đánh giá từng tiêu chí: 1. Tính mới; 2. Cơ sở khoa học KHTN; 3. Kỹ năng thiết kế quy trình; 4. Tính khả thi & An toàn; 5. Kỹ năng trình bày và phản biện.',
      'Bấm chọn mức điểm từ 1 đến 5 sao cho từng tiêu chí.',
      'Nhập nhận xét chân thành, mang tính xây dựng và bấm "Lưu kết quả đánh giá Rubric".'
    ],
    tips: 'Chấm điểm khách quan, chỉ ra điểm sáng tạo và góp ý cụ thể giúp nhóm bạn hoàn thiện quy trình tốt hơn.'
  },
  'task-s4-maker': {
    goal: 'Tiến hành chế tạo mẫu sản phẩm thực tế tại nhà theo quy trình và thử nghiệm các đặc tính cơ lý.',
    steps: [
      'Bước 1 (Chế tạo mẫu): Thực hiện nấu, xay nghiền, ép khuôn và làm khô theo đúng tỷ lệ đã thống nhất.',
      'Bước 2 (Thử nghiệm thực tế): Thử độ dai, độ bền kéo, thử viết mực và tưới nước kiểm tra tỷ lệ nảy mầm của hạt.',
      'Bước 3 (Ghi hình minh chứng): Chụp ảnh rõ nét sản phẩm hoàn thiện và quay video ngắn các thành viên đang cùng làm việc.',
      'Tích chọn vào cả 3 ô vuông trong nhiệm vụ.'
    ],
    tips: 'An toàn điện và bếp đun là ưu tiên số một. Nên có sự hỗ trợ của phụ huynh khi sử dụng máy xay hoặc nước nóng.'
  },
  'task-s4-submit': {
    goal: 'Đăng tải hình ảnh và video minh chứng sản phẩm hoàn thiện lên bảng Padlet dự án.',
    steps: [
      'Bấm nút "Mở Padlet đăng sản phẩm".',
      'Đăng bài viết mới gồm: Tên nhóm, Hình ảnh chụp rõ nét sản phẩm mẫu, Video ngắn 1-2 phút giới thiệu quá trình thực hiện và kết quả thử nghiệm.',
      'Quay lại trang học tập và bấm "Xác nhận đã nộp sản phẩm".'
    ],
    tips: 'Chụp ảnh sản phẩm dưới ánh sáng tự nhiên để nhìn rõ bề mặt sợi cellulose và các hạt mầm sinh động!'
  },
  'task-s5-booth': {
    goal: 'Bày biện gian hàng triển lãm và thuyết trình báo cáo sản phẩm trước lớp tại Ngày hội Xanh.',
    steps: [
      'Trưng bày gian hàng: Poster dự án, sản phẩm mẫu (giấy nảy mầm, màng bao sinh học, chậu ươm), mẫu nguyên liệu thô ban đầu.',
      'Thuyết trình giải thích cơ sở khoa học: Vai trò của cellulose tạo khung sợi dai chắc, tinh bột làm chất kết dính sinh học.',
      'Lan tỏa thông điệp Xanh: Nêu ý nghĩa kinh tế tuần hoàn, giảm thiểu rác thải nhựa và bảo vệ môi trường.',
      'Tích chọn vào cả 3 nội dung khi nhóm đã hoàn thành phần trình bày.'
    ],
    tips: 'Tự tin, tương tác tốt với khán giả và phân công các thành viên cùng trả lời câu hỏi phản biện từ thầy cô và bạn bè.'
  },
  'task-s5-vote': {
    goal: 'Tham quan và chấm điểm các gian hàng theo Bảng Rubric Ngày hội Xanh (3 Tiêu chí × 5 Mức độ).',
    steps: [
      'Chọn tab "Thang đo Rubric Ngày hội xanh" (hoặc Google Form nếu giáo viên yêu cầu).',
      'Điền thông tin người chấm và chọn nhóm được chấm điểm.',
      'Đánh giá 3 tiêu chí: Tính thẩm mỹ gian hàng/poster; Thông điệp môi trường; Kỹ năng thuyết minh và phản biện.',
      'Ghi nhận xét khen ngợi và bấm "Nộp kết quả đánh giá Gian hàng".'
    ],
    tips: 'Bình chọn công tâm cho những gian hàng có thông điệp xanh ấn tượng và sản phẩm hoàn thiện chất lượng cao!'
  },
  'task-s6-summary': {
    goal: 'Ôn tập kiến thức cốt lõi "EM ĐÃ HỌC & EM CÓ THỂ" và tham gia Trò chơi vận động tương tác trên Smart TV.',
    steps: [
      'Đọc kỹ 5 kiến thức trọng tâm trong phần "EM ĐÃ HỌC" (công thức, tính chất vật lý, phản ứng thủy phân, màu Iodine) và định hướng "EM CÓ THỂ".',
      'Chế độ Smart TV: Bấm "Chiếu Smart TV", cả lớp cùng đứng lên vận động tạo 4 tư thế chuẩn (A, B, C, D) để chọn đáp án; giáo viên bấm phím Space hoặc Remote để mở kết quả.',
      'Chế độ Cá nhân: Chọn tab "Làm bài Trắc nghiệm cá nhân" để bấm chọn đáp án A, B, C, D trực tiếp trên màn hình.',
      'Bấm nút "Xác nhận hoàn thành Trò chơi" sau khi trải nghiệm xong.'
    ],
    tips: 'Trò chơi hoạt động mượt mà trên mọi dòng Smart TV và máy chiếu, học sinh vận động thể hiện đáp án mà hoàn toàn không cần camera!'
  },
  'task-s6-quiz': {
    goal: 'Tham gia Trò chơi vận động tương tác trên Smart TV hoặc làm bài trắc nghiệm cá nhân.',
    steps: [
      'Chế độ Smart TV (Khuyên dùng): Bấm "Chiếu Smart TV" mở toàn màn hình, cả lớp cùng đứng lên vận động tạo dáng hào hứng (A, B, C, D) để chọn đáp án!',
      'Chế độ Cá nhân: Chọn tab "Làm bài Trắc nghiệm cá nhân" để bấm chọn đáp án A, B, C, D trên điện thoại/laptop.',
      'Bấm nút "Xác nhận hoàn thành Trò chơi" để kết thúc dự án và chiêm ngưỡng màn pháo hoa chúc mừng!'
    ],
    tips: 'Trò chơi điều khiển trực quan bằng bàn phím (Space, 1-8, R), chuột hoặc remote Smart TV, không cần camera!'
  },
  'task-s6-assessment': {
    goal: 'Hoàn thành Đánh giá dự án STEM toàn diện 360 độ gồm 3 phân hệ: Học sinh tự đánh giá, Nhóm trưởng đánh giá thành viên và Giáo viên đánh giá nhóm.',
    steps: [
      'Tab 1 — 🙋‍♂️ Học sinh tự đánh giá: Đối chiếu 4 tiêu chí rubric (Padlet 25%, Kiến thức Bài 30 25%, Thực hành an toàn 30%, Hợp tác & Báo cáo 20%), chọn mức độ đạt được và viết 4 nội dung phản chiếu (Reflection) sau dự án.',
      'Tab 2 — 👑 Nhóm trưởng đánh giá thành viên: Số 1 là Nhóm trưởng Nguyễn Thuý Ngân chấm điểm cho 5 thành viên trong nhóm (Lê Hải Yến, Trần Quỳnh Như, Phạm Quỳnh Trâm, Huỳnh Kha My, Võ Như Quỳnh) theo 4 tiêu chí đóng góp cá nhân và ghi nhận xét riêng (có thể bấm chuyển qua Nhóm khác của lớp bất kỳ lúc nào).',
      'Tab 3 — 👨‍🏫 Giáo viên đánh giá nhóm: Giáo viên chấm điểm tổng hợp nhóm theo 7 tiêu chí và ghi nhận xét phân hóa điểm thành viên.'
    ],
    tips: 'Đánh giá công tâm, trung thực, phản ánh đúng sự nỗ lực và đóng góp của từng cá nhân trong suốt hành trình Dự án STEM.'
  }
};

interface LockedTaskBoxProps {
  taskId: string;
  badgeText: string;
  title: string;
  emoji: string;
  isUnlocked: boolean;
  isCompleted?: boolean;
  onUnlock: (id: string) => void;
  onLock?: (id: string) => void;
  guideContent?: TaskGuideInfo;
  children: React.ReactNode;
}

function LockedTaskBox({
  taskId,
  badgeText,
  title,
  emoji,
  isUnlocked,
  isCompleted = false,
  onUnlock,
  onLock,
  guideContent,
  children,
}: LockedTaskBoxProps) {
  const [showTaskGuide, setShowTaskGuide] = useState<boolean>(false);
  const taskGuide = guideContent || TASK_SPECIFIC_GUIDES[taskId];

  if (!isUnlocked) {
    return (
      <button
        id={`box-${taskId}`}
        type="button"
        onClick={() => onUnlock(taskId)}
        className="w-full text-left rounded-3xl bg-white/85 hover:bg-white border-2 border-dashed border-indigo-200 hover:border-orange-400 p-4 md:p-5 shadow-[0_6px_20px_rgba(30,27,75,0.06)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.14)] backdrop-blur-md transition-all duration-300 group cursor-pointer flex items-center justify-between gap-3 hover:-translate-y-0.5 scroll-mt-24"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
            {emoji}
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-orange-700 border border-orange-200 mb-0.5">
              <Lock className="w-3 h-3" /> {badgeText}
            </span>
            <h3 className="text-sm md:text-base font-extrabold text-indigo-950 group-hover:text-orange-600 transition-colors">
              {title}
            </h3>
          </div>
        </div>

        <div className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 group-hover:from-indigo-600 group-hover:to-purple-600 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition-all">
          <Unlock className="w-3.5 h-3.5" />
          <span>Mở</span>
        </div>
      </button>
    );
  }

  return (
    <div
      id={`box-${taskId}`}
      className="rounded-3xl bg-white/95 border-2 border-white p-5 md:p-6 shadow-[0_10px_30px_rgba(30,27,75,0.08)] backdrop-blur-xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-indigo-950 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl">{emoji}</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-indigo-100 text-indigo-800">
            {badgeText}
          </span>
          <h3 className="text-sm md:text-base font-black text-indigo-950">{title}</h3>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Xong
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {taskGuide && (
            <button
              type="button"
              onClick={() => setShowTaskGuide((v) => !v)}
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${showTaskGuide
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              title="Bấm để xem hướng dẫn chi tiết cách làm nhiệm vụ này"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showTaskGuide ? 'Ẩn hướng dẫn' : '💡 Hướng dẫn nhiệm vụ'}</span>
            </button>
          )}

          {onLock && (
            <button
              type="button"
              onClick={() => onLock(taskId)}
              className="px-3 py-1 rounded-full bg-indigo-50 hover:bg-orange-50 text-indigo-900 hover:text-orange-600 border border-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Thu gọn</span>
            </button>
          )}
        </div>
      </div>

      {/* VÙNG HƯỚNG DẪN ĐI KÈM RIÊNG CỦA NHIỆM VỤ NÀY (BẬT/TẮT) */}
      {showTaskGuide && taskGuide && (
        <div className="bg-linear-to-r from-amber-50 via-orange-50/80 to-amber-50 border-2 border-amber-300/90 rounded-2xl p-4 text-xs text-amber-950 space-y-2.5 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-1.5">
            <span className="font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
              <span>💡</span> Hướng dẫn thực hiện: {title}
            </span>
            <button
              type="button"
              onClick={() => setShowTaskGuide(false)}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-950 px-2 py-0.5 rounded-md hover:bg-amber-200/50 cursor-pointer"
            >
              ✕ Đóng
            </button>
          </div>

          {taskGuide.goal && (
            <div className="flex items-start gap-1.5">
              <span className="font-black text-amber-900 shrink-0">🎯 Mục tiêu:</span>
              <span className="font-semibold text-slate-800">{taskGuide.goal}</span>
            </div>
          )}

          {taskGuide.steps && taskGuide.steps.length > 0 && (
            <div className="space-y-1">
              <span className="font-black text-amber-900 block">📋 Các bước thao tác:</span>
              <ol className="list-decimal pl-5 space-y-1 text-slate-800 font-medium">
                {taskGuide.steps.map((st, sIdx) => (
                  <li key={sIdx}>{st}</li>
                ))}
              </ol>
            </div>
          )}

          {taskGuide.tips && (
            <div className="bg-white/85 border border-amber-200 rounded-xl p-2.5 font-semibold text-amber-900 flex items-start gap-1.5">
              <span className="shrink-0">✨</span>
              <span>{taskGuide.tips}</span>
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

interface Stage2DragItem {
  id: string;
  text: string;
  target: 'starch' | 'cellulose';
}

/* ============================================================
   BỘ 12 CÂU HỎI BÀI KIỂM TRA ĐÁNH GIÁ KIẾN THỨC NỀN CHẶNG 2
   Gồm 4 dạng: Trắc nghiệm ABCD (3 câu), Đúng / Sai (3 câu),
   Điền khuyết (3 câu), Ghép đôi (3 câu)
   ============================================================ */
export interface Stage2TestQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'fill_in' | 'matching';
  groupName: string;
  tag: string;
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  subStatements?: { id: string; text: string; isCorrect: boolean }[];
  blanks?: { id: string; label: string; placeholder: string; acceptedAnswers: string[] }[];
  matchingPairs?: { id: number; leftText: string; rightKey: string; rightText: string }[];
  explanation: string;
}

export const STAGE2_TEST_QUESTIONS: Stage2TestQuestion[] = [
  // --- NHÓM 1: TRẮC NGHIỆM 4 LỰA CHỌN (A, B, C, D) ---
  {
    id: 1,
    type: 'multiple_choice',
    groupName: 'Phần A: Trắc nghiệm 4 lựa chọn',
    tag: 'Câu 1 • Trạng thái tự nhiên & Tính chất vật lí',
    question: 'Nhận định nào sau đây mô tả ĐÚNG và ĐẦY ĐỦ nhất về tính chất vật lí của tinh bột và cellulose?',
    options: [
      'Tinh bột là chất rắn dạng sợi, màu trắng, tan tốt trong nước lạnh; cellulose là chất rắn dạng bột, không tan trong nước.',
      'Tinh bột là chất rắn dạng bột, màu trắng, không tan trong nước lạnh, tan một phần trong nước nóng tạo hồ tinh bột; cellulose là chất rắn dạng sợi, màu trắng, không tan trong nước (kể cả nước nóng) và các dung môi hữu cơ thông thường.',
      'Cả tinh bột và cellulose đều là chất rắn dạng bột, tan hoàn toàn trong nước nóng tạo dung dịch trong suốt.',
      'Cellulose tan tốt trong nước nóng và cồn; tinh bột không tan trong nước ở bất kì nhiệt độ nào.',
    ],
    correctOptionIndex: 1,
    explanation: 'Theo chuẩn YCCĐ: Tinh bột là chất rắn dạng bột, màu trắng, không tan trong nước lạnh, tan một phần trong nước nóng tạo hồ tinh bột; cellulose là chất rắn dạng sợi, màu trắng, không tan trong nước (kể cả nước nóng) và các dung môi hữu cơ thông thường.',
  },
  {
    id: 2,
    type: 'multiple_choice',
    groupName: 'Phần A: Trắc nghiệm 4 lựa chọn',
    tag: 'Câu 2 • Thí nghiệm & Hiện tượng phản ứng màu Iodine',
    question: 'Khi nhỏ vài giọt dung dịch iodine vào ống nghiệm chứa hồ tinh bột ở nhiệt độ thường, hiện tượng quan sát được là gì?',
    options: [
      'Dung dịch xuất hiện màu xanh tím đặc trưng (trong khi cellulose không có phản ứng này).',
      'Dung dịch chuyển sang màu đỏ gạch và xuất hiện kết tủa.',
      'Dung dịch chuyển sang màu trắng đục như nước vôi.',
      'Dung dịch không đổi màu, vẫn giữ nguyên màu vàng nâu của iodine.',
    ],
    correctOptionIndex: 0,
    explanation: 'Ở nhiệt độ thường, hồ tinh bột tạo màu xanh tím đặc trưng với dung dịch iodine; cellulose không có phản ứng này.',
  },
  {
    id: 3,
    type: 'multiple_choice',
    groupName: 'Phần A: Trắc nghiệm 4 lựa chọn',
    tag: 'Câu 3 • 🇬🇧 English in Science',
    question: '🇬🇧 [English Challenge] Which substance reacts with iodine solution to produce a characteristic blue-purple color at room temperature?',
    options: [
      'Cellulose (cotton fiber, wood)',
      'Starch (rice, potato starch)',
      'Glucose (grape sugar)',
      'Saccharose (cane sugar)',
    ],
    correctOptionIndex: 1,
    explanation: 'Starch (tinh bột) reacts with iodine to produce a characteristic blue-purple color at room temperature, while cellulose, glucose, and saccharose do not show this color reaction.',
  },

  // --- NHÓM 2: ĐÚNG / SAI ---
  {
    id: 4,
    type: 'true_false',
    groupName: 'Phần B: Câu hỏi Đúng / Sai',
    tag: 'Câu 4 • Tính chất hoá học & Phương trình thuỷ phân',
    question: 'Hãy xét tính Đúng hoặc Sai của mỗi nhận định sau về tính chất hoá học và phản ứng thuỷ phân của tinh bột và cellulose:',
    subStatements: [
      { id: '4a', text: 'a) Phản ứng thuỷ phân là tính chất hoá học chung quan trọng của cả tinh bột và cellulose.', isCorrect: true },
      { id: '4b', text: 'b) Phương trình hoá học thuỷ phân dưới dạng công thức phân tử là: (C₆H₁₀O₅)ₙ + nH₂O —(Enzyme hoặc HCl/t°)→ nC₆H₁₂O₆ (Glucose).', isCorrect: true },
      { id: '4c', text: 'c) Khi thuỷ phân hoàn toàn tinh bột thì tạo ra glucose, còn thuỷ phân cellulose thì tạo ra fructose.', isCorrect: false },
      { id: '4d', text: 'd) Hồ tinh bột có phản ứng màu đặc trưng với iodine, còn cellulose không có phản ứng màu này.', isCorrect: true },
    ],
    explanation: 'Cả tinh bột và cellulose khi thuỷ phân hoàn toàn (xúc tác acid đun nóng hoặc enzyme) đều chỉ tạo ra đường glucose (C₆H₁₂O₆). Hồ tinh bột có phản ứng màu với iodine, cellulose không có phản ứng này.',
  },
  {
    id: 5,
    type: 'true_false',
    groupName: 'Phần B: Câu hỏi Đúng / Sai',
    tag: 'Câu 5 • Quang hợp, sự tạo thành & Vai trò trong cây xanh',
    question: 'Hãy xét tính Đúng hoặc Sai của mỗi nhận định sau về sự tạo thành và vai trò của tinh bột, cellulose trong cây xanh:',
    subStatements: [
      { id: '5a', text: 'a) Cây xanh thực hiện quá trình quang hợp dưới tác dụng của ánh sáng mặt trời và chất diệp lục để tổng hợp ra glucose, từ đó chuyển hoá thành tinh bột và cellulose.', isCorrect: true },
      { id: '5b', text: 'b) Trong cây xanh, tinh bột đóng vai trò là chất dự trữ năng lượng (tích lũy nhiều trong củ, hạt, quả).', isCorrect: true },
      { id: '5c', text: 'c) Cellulose đóng vai trò xây dựng thành tế bào thực vật, tạo độ cứng cáp và vững chắc cho cây xanh.', isCorrect: true },
      { id: '5d', text: 'd) Sự tạo thành tinh bột và cellulose trong cây xanh chỉ phục vụ thực vật, không có tầm quan trọng đối với sự sống trên Trái Đất.', isCorrect: false },
    ],
    explanation: 'Quang hợp tạo ra tinh bột (dự trữ năng lượng) và cellulose (tạo độ cứng vững cho cây). Sự tạo thành của chúng là nguồn lương thực, dưỡng khí và chuỗi năng lượng nền tảng duy trì sự sống trên Trái Đất.',
  },
  {
    id: 6,
    type: 'true_false',
    groupName: 'Phần B: Câu hỏi Đúng / Sai',
    tag: 'Câu 6 • Ứng dụng & Dinh dưỡng hợp lí bảo vệ sức khỏe',
    question: 'Hãy xét tính Đúng hoặc Sai của mỗi nhận định sau về ứng dụng và cách sử dụng hợp lí tinh bột, cellulose trong đời sống:',
    subStatements: [
      { id: '6a', text: 'a) Tinh bột là nguồn lương thực chính cho con người và thức ăn gia súc, dùng sản xuất cồn (ethanol), bánh kẹo.', isCorrect: true },
      { id: '6b', text: 'b) Cellulose được ứng dụng để sản xuất giấy, dệt vải sợi bông, làm vật liệu xây dựng, đồ gỗ, sản xuất tơ nhân tạo và cồn công nghiệp.', isCorrect: true },
      { id: '6c', text: 'c) Gạo, ngô, khoai, sắn, lúa mì là các loại lương thực, thực phẩm giàu tinh bột.', isCorrect: true },
      { id: '6d', text: 'd) Để có nhiều năng lượng, chúng ta nên ăn càng nhiều tinh bột càng tốt, không cần hạn chế vì tinh bột không gây nguy cơ béo phì hay đái tháo đường.', isCorrect: false },
    ],
    explanation: 'Cần biết cách sử dụng hợp lí tinh bột trong chế độ ăn uống hàng ngày nhằm bảo vệ sức khỏe, tránh ăn quá nhiều tinh bột gây thừa calo dẫn đến béo phì và đái tháo đường.',
  },

  // --- NHÓM 3: ĐIỀN KHUYẾT ---
  {
    id: 7,
    type: 'fill_in',
    groupName: 'Phần C: Câu hỏi Điền khuyết',
    tag: 'Câu 7 • Hoàn thiện phương trình hoá học thuỷ phân',
    question: 'Phương trình hoá học của phản ứng thuỷ phân: (C₆H₁₀O₅)ₙ + nH₂O —([b7_1])→ n [b7_2] (Glucose)',
    blanks: [
      {
        id: 'b7_1',
        label: 'Chất xúc tác phản ứng:',
        placeholder: 'Xúc tác: Enzyme/HCl...',
        acceptedAnswers: [
          'Enzyme/HCl',
          'enzyme/hcl',
          'HCl/Enzyme',
          'hcl/enzyme',
          'Enzyme hoặc HCl',
          'acid hoặc enzyme',
          'enzyme hoặc acid',
          'enzyme',
          'HCl',
          'acid',
          'axit',
        ],
      },
      {
        id: 'b7_2',
        label: 'Công thức phân tử glucose:',
        placeholder: 'Công thức: C6H12O6...',
        acceptedAnswers: ['C6H12O6', 'C₆H₁₂O₆', 'c6h12o6'],
      },
    ],
    explanation: 'Phương trình phản ứng thuỷ phân: (C₆H₁₀O₅)ₙ + nH₂O —(Enzyme/HCl)→ nC₆H₁₂O₆ (Glucose).',
  },
  {
    id: 8,
    type: 'fill_in',
    groupName: 'Phần C: Câu hỏi Điền khuyết',
    tag: 'Câu 8 • Trạng thái vật lí & Hiện tượng màu thí nghiệm',
    question: 'Tinh bột là chất rắn dạng [b8_1], màu trắng, không tan trong nước lạnh, tan một phần trong nước nóng tạo hồ tinh bột và tạo màu [b8_2] với dung dịch iodine; còn cellulose là chất rắn dạng sợi, không tan trong nước (kể cả nước nóng) và không có phản ứng này.',
    blanks: [
      {
        id: 'b8_1',
        label: 'Dạng tồn tại của tinh bột:',
        placeholder: '...dạng gì?',
        acceptedAnswers: ['bột', 'bột màu trắng', 'dạng bột', 'chất bột'],
      },
      {
        id: 'b8_2',
        label: 'Màu sắc tạo với iodine:',
        placeholder: '...màu gì?',
        acceptedAnswers: ['xanh tím', 'màu xanh tím', 'xanh tim'],
      },
    ],
    explanation: 'Tinh bột là chất rắn dạng bột màu trắng, tan một phần trong nước nóng tạo hồ tinh bột và phản ứng với dung dịch iodine tạo màu xanh tím.',
  },
  {
    id: 9,
    type: 'fill_in',
    groupName: 'Phần C: Câu hỏi Điền khuyết',
    tag: 'Câu 9 • Quá trình quang hợp & Năng lượng Trái Đất',
    question: 'Dưới tác dụng của ánh sáng mặt trời và chất [b9_1], cây xanh hấp thụ CO₂ và nước để tổng hợp glucose, chuyển hóa thành tinh bột và cellulose, đồng thời giải phóng khí [b9_2] duy trì sự sống trên Trái Đất.',
    blanks: [
      {
        id: 'b9_1',
        label: 'Sắc tố ở lá cây:',
        placeholder: '...sắc tố gì?',
        acceptedAnswers: ['diệp lục', 'chất diệp lục', 'chlorophyll'],
      },
      {
        id: 'b9_2',
        label: 'Khí giải phóng ra:',
        placeholder: '...khí gì?',
        acceptedAnswers: ['oxygen', 'oxy', 'khí oxygen', 'khí oxy', 'o2', 'O2', 'O₂'],
      },
    ],
    explanation: 'Nhờ chất diệp lục hấp thụ ánh sáng mặt trời, cây xanh quang hợp tổng hợp glucose, tinh bột, cellulose và giải phóng khí oxygen (O₂).',
  },

  // --- NHÓM 4: GHÉP ĐÔI ---
  {
    id: 10,
    type: 'matching',
    groupName: 'Phần D: Câu hỏi Ghép đôi',
    tag: 'Câu 10 • Ghép chất với cấu trúc & vai trò trong cây xanh',
    question: 'Hãy ghép mỗi chất ở cột bên trái với cấu trúc và vai trò sinh học trong cây xanh ở cột bên phải:',
    matchingPairs: [
      { id: 1, leftText: '1. Tinh bột', rightKey: 'A', rightText: 'A. Chất rắn dạng bột màu trắng, đóng vai trò dự trữ năng lượng trong củ, hạt, quả của cây' },
      { id: 2, leftText: '2. Cellulose', rightKey: 'B', rightText: 'B. Chất rắn dạng sợi màu trắng, xây dựng thành tế bào tạo độ cứng vững cho thân cây' },
      { id: 3, leftText: '3. Glucose', rightKey: 'C', rightText: 'C. Sản phẩm trực tiếp của quá trình quang hợp, đơn vị mắt xích cấu tạo nên tinh bột và cellulose' },
    ],
    explanation: 'Tinh bột dự trữ năng lượng; cellulose xây dựng thành tế bào tạo độ cứng vững cho cây; glucose là sản phẩm của quang hợp.',
  },
  {
    id: 11,
    type: 'matching',
    groupName: 'Phần D: Câu hỏi Ghép đôi',
    tag: 'Câu 11 • Ghép nhóm chất với ứng dụng thực tế & sức khỏe',
    question: 'Hãy ghép mỗi nhóm chất ở cột bên trái với ứng dụng thực tế và vai trò sức khỏe ở cột bên phải:',
    matchingPairs: [
      { id: 1, leftText: '1. Gạo, ngô, khoai, sắn, lúa mì', rightKey: 'A', rightText: 'A. Lương thực giàu tinh bột; cần ăn hợp lí để tránh nguy cơ béo phì, đái tháo đường' },
      { id: 2, leftText: '2. Gỗ, tre, nứa, bông sợi, đay gai', rightKey: 'B', rightText: 'B. Nguồn cellulose dùng sản xuất giấy, dệt vải, làm vật liệu xây dựng, đồ gỗ, tơ nhân tạo' },
      { id: 3, leftText: '3. Rau xanh, vỏ hạt ngũ cốc', rightKey: 'C', rightText: 'C. Bổ sung chất xơ tự nhiên (cellulose) giúp hỗ trợ tiêu hóa và bảo vệ sức khỏe đường ruột' },
    ],
    explanation: 'Lương thực cung cấp tinh bột; gỗ, bông dệt là ứng dụng của cellulose; rau củ quả bổ sung chất xơ cho sức khỏe.',
  },
  {
    id: 12,
    type: 'matching',
    groupName: 'Phần D: Câu hỏi Ghép đôi',
    tag: 'Câu 12 • 🚀 Kết nối Dự án STEAM: Bắt đầu từ sự kết thúc',
    question: 'Hãy ghép mỗi thành phần ở cột bên trái với vai trò tái sinh thành sản phẩm xanh trong Dự án STEAM "Bắt đầu từ sự kết thúc" ở cột bên phải:',
    matchingPairs: [
      { id: 1, leftText: '1. Phụ phẩm nông nghiệp (bã mía, thân chuối, vỏ bắp, rơm rạ)', rightKey: 'A', rightText: 'A. Nguồn sợi Cellulose tự nhiên dồi dào, tái sinh làm cốt sợi cho giấy xanh và túi bầu tự phân hủy' },
      { id: 2, leftText: '2. Hồ tinh bột (từ bột sắn, gạo, ngô)', rightKey: 'B', rightText: 'B. Đóng vai trò chất kết dính sinh học an toàn kết hợp với xơ cellulose tạo màng sinh học tự hủy' },
      { id: 3, leftText: '3. Từ khóa "GREEN NEWSPAPER" & Tinh thần dự án', rightKey: 'C', rightText: 'C. Giải pháp STEAM biến "sự kết thúc" của phế phẩm nông nghiệp thành "sự bắt đầu" của sản phẩm xanh' },
    ],
    explanation: 'Dự án STEAM "Bắt đầu từ sự kết thúc" kết nối kiến thức Bài 30: tận dụng sợi Cellulose từ phụ phẩm nông nghiệp (bã mía, thân chuối...) kết hợp chất kết dính sinh học Tinh bột để chế tạo các sản phẩm xanh (Green Newspaper, túi bầu ươm cây tự phân hủy) thay thế đồ nhựa một lần.',
  },
];

const STAGE2_DRAG_ITEMS: Stage2DragItem[] = [
  {
    id: 'prop-1',
    text: 'Chất rắn, dạng sợi, màu trắng',
    target: 'cellulose',
  },
  {
    id: 'prop-2',
    text: 'Tan một phần trong nước nóng tạo hệ keo (hồ tinh bột)',
    target: 'starch',
  },
  {
    id: 'prop-3',
    text: 'Tập trung nhiều ở thân gỗ, quả bông, tre, nứa, đay, gai',
    target: 'cellulose',
  },
  {
    id: 'prop-4',
    text: 'Vai trò chính: Dự trữ năng lượng cho thực vật',
    target: 'starch',
  },
  {
    id: 'prop-5',
    text: 'Không tan trong nước (kể cả nước nóng) và các dung môi hữu cơ thông thường',
    target: 'cellulose',
  },
  {
    id: 'prop-6',
    text: 'Chất rắn, dạng bột, màu trắng, không tan trong nước lạnh',
    target: 'starch',
  },
  {
    id: 'prop-7',
    text: 'Xây dựng thành tế bào thực vật, giúp duy trì độ cứng và hình dáng của cây',
    target: 'cellulose',
  },
  {
    id: 'prop-8',
    text: 'Tập trung nhiều ở hạt, củ, quả (gạo, ngô, khoai, sắn,...)',
    target: 'starch',
  },
];

const STAGE2_PART2_IODINE_QUIZ: QuizQuestion[] = [
  {
    id: 's2_iodine_q1',
    tag: 'Hiện tượng thí nghiệm',
    question: 'Khi nhỏ vài giọt dung dịch iodine vào ống nghiệm đựng hồ tinh bột (hoặc mặt cắt củ khoai tây), hiện tượng quan sát được là gì?',
    options: [
      'Xuất hiện hợp chất có màu xanh tím đặc trưng',
      'Dung dịch chuyển sang màu đỏ gạch',
      'Xuất hiện kết tủa màu trắng bạc sáng lấp lánh',
      'Không có hiện tượng gì xảy ra',
    ],
    correctIndex: 0,
  },
  {
    id: 's2_iodine_q2',
    tag: 'Nhận biết hồ tinh bột',
    question: 'Có thể dùng chất nào sau đây để nhận biết hồ tinh bột?',
    options: [
      'Dung dịch nước vôi trong Ca(OH)₂',
      'Dung dịch iodine',
      'Dung dịch sulfuric acid (H₂SO₄) loãng',
      'Giấy quỳ tím ẩm',
    ],
    correctIndex: 1,
  },
];

const STAGE2_PART2_HYDROLYSIS_QUIZ: QuizQuestion[] = [
  {
    id: 's2_hydro_q1',
    tag: 'Sản phẩm thủy phân',
    question: 'Tinh bột và cellulose khi bị thủy phân hoàn toàn trong môi trường acid đun nóng hoặc dưới tác dụng của enzyme đều tạo thành sản phẩm duy nhất nào?',
    options: [
      'Ethylic alcohol (C₂H₅OH - Rượu cồn)',
      'Glucose (C₆H₁₂O₆ - Đường nho)',
      'Saccharose (C₁₂H₂₂O₁₁ - Đường mía)',
      'Fructose (Đường mật ong)',
    ],
    correctIndex: 1,
  },
  {
    id: 's2_hydro_q2',
    tag: 'Phương trình hóa học',
    question: 'Phương trình hóa học của phản ứng thủy phân tinh bột và cellulose dưới dạng công thức phân tử là:',
    options: [
      '(C₆H₁₀O₅)ₙ + nH₂O —(Enzyme hoặc acid/t°)→ nC₆H₁₂O₆ (glucose)',
      '6CO₂ + 6H₂O —(Ánh sáng, diệp lục)→ C₆H₁₂O₆ + 6O₂',
      '(C₆H₁₀O₅)ₙ + O₂ —(t°)→ CO₂ + H₂O',
      'C₆H₁₂O₆ —(Enzyme)→ 2C₂H₅OH + 2CO₂',
    ],
    correctIndex: 0,
  },
  {
    id: 's2_hydro_q3',
    tag: 'Vận dụng thực tế',
    question: 'Vì sao cơ thể người tiêu hóa được tinh bột (cơm, khoai, bánh mì) tạo năng lượng nhưng không tiêu hóa được cellulose (cỏ, gỗ, rơm rạ)?',
    options: [
      'Vì cellulose tan hoàn toàn trong nước lạnh còn tinh bột thì không',
      'Vì cơ thể người chỉ có enzyme amylase thủy phân tinh bột mà không có enzyme cellulase thủy phân cellulose',
      'Vì tinh bột có phân tử khối lớn hơn cellulose rất nhiều',
      'Vì cellulose phản ứng với dịch vị tạo màu xanh tím gây nghẹn',
    ],
    correctIndex: 1,
  },
];

interface HotspotApplicationItem {
  id: string;
  number: number;
  label: string;
  left: string;
  top: string;
  correctCategory: 'starch' | 'cellulose' | 'other';
  groupName: string;
  desc: string;
  reason: string;
}

const HOTSPOT_APPLICATIONS: HotspotApplicationItem[] = [
  // Hàng 1
  {
    id: 'hs-1',
    number: 1,
    label: 'Lương thực (Cơm, ngô, khoai, bánh mì)',
    left: '12.5%',
    top: '12.5%',
    correctCategory: 'starch',
    groupName: 'Tinh bột',
    desc: 'Bát cơm, bắp ngô, củ khoai lang và bánh mì',
    reason: 'Tinh bột là nguồn cung cấp năng lượng và lương thực chính hàng ngày của con người và động vật.',
  },
  {
    id: 'hs-2',
    number: 2,
    label: 'Lốp xe ô tô & Găng tay cao su',
    left: '37.5%',
    top: '12.5%',
    correctCategory: 'other',
    groupName: 'Vật liệu khác (Cao su)',
    desc: 'Lốp xe và găng tay chế tạo từ cao su',
    reason: 'Cao su là polyisoprene (polymer đàn hồi), không phải là tinh bột hay cellulose.',
  },
  {
    id: 'hs-3',
    number: 3,
    label: 'Sản xuất Giấy, tập vở & Thùng carton',
    left: '62.5%',
    top: '12.5%',
    correctCategory: 'cellulose',
    groupName: 'Cellulose',
    desc: 'Gỗ nguyên liệu được chế biến thành giấy viết, tập vở, thùng carton',
    reason: 'Cellulose là thành phần chính cấu tạo thành tế bào thực vật (gỗ, tre, nứa), dùng sản xuất giấy viết và bao bì.',
  },
  {
    id: 'hs-4',
    number: 4,
    label: 'Dây cáp điện & Lõi đồng dẫn điện',
    left: '87.5%',
    top: '12.5%',
    correctCategory: 'other',
    groupName: 'Vật liệu khác (Kim loại / Nhựa)',
    desc: 'Cuộn dây cáp điện với lõi đồng dẫn điện',
    reason: 'Đồng là kim loại vô cơ và vỏ bọc là nhựa polymer cách điện, không phải carbohydrate sinh học.',
  },
  // Hàng 2
  {
    id: 'hs-5',
    number: 5,
    label: 'Ấm chén & Đồ gốm sứ hoa văn',
    left: '12.5%',
    top: '37.5%',
    correctCategory: 'other',
    groupName: 'Vật liệu khác (Silicate / Gốm sứ)',
    desc: 'Bộ ấm chén gốm sứ tráng men cao cấp',
    reason: 'Đồ gốm sứ được nung từ đất sét silicat vô cơ, không phải là hợp chất hữu cơ.',
  },
  {
    id: 'hs-6',
    number: 6,
    label: 'Hồ dán giấy & Keo dán sinh học',
    left: '37.5%',
    top: '37.5%',
    correctCategory: 'starch',
    groupName: 'Tinh bột',
    desc: 'Hũ hồ dán và chổi quét keo dán giấy',
    reason: 'Tinh bột tan một phần trong nước nóng tạo hồ tinh bột có độ dính, dùng làm hồ dán giấy và chất kết dính.',
  },
  {
    id: 'hs-7',
    number: 7,
    label: 'Dệt vải sợi bông & Quần áo may mặc',
    left: '62.5%',
    top: '37.5%',
    correctCategory: 'cellulose',
    groupName: 'Cellulose',
    desc: 'Quả bông vải, cuộn chỉ dệt và áo sơ mi',
    reason: 'Sợi bông chứa gần như 98% cellulose nguyên chất, là nguyên liệu cốt lõi của ngành công nghiệp dệt may.',
  },
  {
    id: 'hs-8',
    number: 8,
    label: 'Bình & Cốc thủy tinh trong suốt',
    left: '87.5%',
    top: '37.5%',
    correctCategory: 'other',
    groupName: 'Vật liệu khác (Thủy tinh vô cơ)',
    desc: 'Bình rót và ly cốc bằng thủy tinh trong suốt',
    reason: 'Thủy tinh là chất rắn vô định hình vô cơ tạo từ cát thạch anh (SiO₂), không phải tinh bột hay cellulose.',
  },
  // Hàng 3
  {
    id: 'hs-9',
    number: 9,
    label: 'Đồ gỗ nội thất & Vật liệu xây dựng',
    left: '12.5%',
    top: '62.5%',
    correctCategory: 'cellulose',
    groupName: 'Cellulose',
    desc: 'Bàn ghế gỗ tự nhiên và các thanh gỗ xây dựng',
    reason: 'Gỗ chứa khoảng 50% cellulose tạo độ cứng vững chắc, được dùng làm đồ nội thất và vật liệu dựng nhà cửa.',
  },
  {
    id: 'hs-10',
    number: 10,
    label: 'Ống nhựa PVC & Xô chậu nhựa tổng hợp',
    left: '37.5%',
    top: '62.5%',
    correctCategory: 'other',
    groupName: 'Vật liệu khác (Chất dẻo polymer)',
    desc: 'Ống dẫn nước và xô chậu bằng nhựa PVC/PP',
    reason: 'Đây là các loại chất dẻo polymer tổng hợp từ hóa dầu, không thuộc nhóm carbohydrate tự nhiên.',
  },
  {
    id: 'hs-11',
    number: 11,
    label: 'Chế biến thực phẩm (Bún, phở, bánh kẹo)',
    left: '62.5%',
    top: '62.5%',
    correctCategory: 'starch',
    groupName: 'Tinh bột',
    desc: 'Bát bún phở, bánh mì, bánh quy ngọt',
    reason: 'Tinh bột là nguyên liệu chủ đạo sản xuất bún, phở, bánh kẹo và sản xuất siro mạch nha (maltose/glucose).',
  },
  {
    id: 'hs-12',
    number: 12,
    label: 'Nồi chảo kim loại & Đồ gia dụng nhôm gang',
    left: '87.5%',
    top: '62.5%',
    correctCategory: 'other',
    groupName: 'Vật liệu khác (Kim loại / Hợp kim)',
    desc: 'Bộ nồi và chảo nấu ăn bằng kim loại',
    reason: 'Kim loại và hợp kim là vật liệu dẫn nhiệt vô cơ, không phải hợp chất hữu cơ sinh học.',
  },
  // Hàng 4
  {
    id: 'hs-13',
    number: 13,
    label: 'Vi mạch điện tử & Chip bán dẫn',
    left: '12.5%',
    top: '87.5%',
    correctCategory: 'other',
    groupName: 'Vật liệu khác (Bán dẫn Silicon)',
    desc: 'Bảng mạch điện tử máy tính và tấm vi chip',
    reason: 'Chế tạo từ chất bán dẫn silicon (Si) và kim loại dẫn điện, không chứa tinh bột hay cellulose.',
  },
  {
    id: 'hs-14',
    number: 14,
    label: 'Sản xuất Rượu bia & Cồn ethanol',
    left: '37.5%',
    top: '87.5%',
    correctCategory: 'starch',
    groupName: 'Tinh bột',
    desc: 'Chai rượu, ly rượu lên men từ lúa mì và ngũ cốc',
    reason: 'Tinh bột được lên men sinh học để sản xuất ethylic alcohol (cồn y tế, cồn công nghiệp và rượu bia).',
  },
  {
    id: 'hs-15',
    number: 15,
    label: 'Bình gas & Bếp gas đun nấu',
    left: '62.5%',
    top: '87.5%',
    correctCategory: 'other',
    groupName: 'Vật liệu khác (Khí đốt hóa lỏng LPG)',
    desc: 'Bình gas và ngọn lửa bếp gas đun nấu',
    reason: 'Gas đun nấu là hỗn hợp khí hóa lỏng propane và butane từ dầu khí, không phải tinh bột hay cellulose.',
  },
  {
    id: 'hs-16',
    number: 16,
    label: 'Mây tre đan, dây thừng xơ dừa & Chậu tự hủy',
    left: '87.5%',
    top: '87.5%',
    correctCategory: 'cellulose',
    groupName: 'Cellulose',
    desc: 'Giỏ đan mây tre, cuộn dây thừng xơ dừa và chậu ươm tự phân hủy',
    reason: 'Mây, tre, nứa, xơ dừa, sợi đay giàu cellulose dẻo dai, dùng làm đồ thủ công đan lát, dây thừng và đồ sinh học tự hủy.',
  },
];

interface RubricFormState {
  selections: Record<string, 1 | 2 | 3 | 4 | 5>;
  points: Record<string, number>;
  evaluatorMode: 'peer' | 'self';
  evaluatorGroup: string;
  targetGroup: string;
  className: string;
  feedbackNote: string;
  isSending: boolean;
  status: 'idle' | 'success' | 'error';
  message: string | null;
  validationError: string | null;
}

const createInitialRubricFormState = (): RubricFormState => ({
  selections: {},
  points: {},
  evaluatorMode: 'peer',
  evaluatorGroup: '',
  targetGroup: '',
  className: '',
  feedbackNote: '',
  isSending: false,
  status: 'idle',
  message: null,
  validationError: null,
});

const getCriterionPointFromState = (
  criterion: Stage3RubricCriterion,
  state: Pick<RubricFormState, 'points' | 'selections'>
): number | undefined => {
  if (state.points[criterion.id] !== undefined) return state.points[criterion.id];
  const pickedLevel = state.selections[criterion.id];
  if (pickedLevel === undefined) return undefined;
  return criterion.levels.find((item) => item.level === pickedLevel)?.points;
};

const getRubricSummary = (criteria: Stage3RubricCriterion[], state: RubricFormState) => {
  const answeredCount = criteria.filter(
    (c) => state.points[c.id] !== undefined || state.selections[c.id] !== undefined
  ).length;
  const isComplete = answeredCount === criteria.length;
  const totalPoints =
    Math.round(criteria.reduce((sum, c) => sum + (getCriterionPointFromState(c, state) ?? 0), 0) * 100) /
    100;
  const rank =
    totalPoints >= 8.5
      ? { label: 'Xuất sắc', colorClass: 'bg-emerald-500 text-white' }
      : totalPoints >= 7.0
        ? { label: 'Khá / Tốt', colorClass: 'bg-sky-500 text-white' }
        : totalPoints >= 5.0
          ? { label: 'Đạt yêu cầu', colorClass: 'bg-amber-500 text-white' }
          : { label: 'Cần cải thiện', colorClass: 'bg-rose-500 text-white' };
  return { answeredCount, isComplete, totalPoints, rank };
};

const buildRubricMailtoBodyFor = (
  stageTitle: string,
  criteria: Stage3RubricCriterion[],
  state: RubricFormState
) => {
  const { totalPoints, rank } = getRubricSummary(criteria, state);
  const modeLabel = state.evaluatorMode === 'self' ? 'Tự đánh giá' : 'Đánh giá đồng đẳng';
  const lines = [
    `PHIẾU ĐÁNH GIÁ RUBRIC ${stageTitle.toUpperCase()}`,
    `Hình thức: ${modeLabel}`,
    `Nhóm thực hiện đánh giá: ${state.evaluatorGroup.trim() || 'Chưa ghi'}`,
    `Nhóm được đánh giá: ${state.targetGroup.trim() || 'Chưa ghi'}`,
    `Lớp: ${state.className.trim() || 'KHTN 9'}`,
    `-----------------------------------------`,
    ...criteria.map((c) => {
      const pts = getCriterionPointFromState(c, state) ?? 0;
      const lvNum = state.selections[c.id];
      const lvLabel = c.levels.find((l) => l.level === lvNum)?.label ?? '';
      return `${c.title}: ${pts}/${c.maxPoints} đ (${lvLabel})`;
    }),
    `-----------------------------------------`,
    `TỔNG ĐIỂM: ${totalPoints} / 10 điểm (${rank.label})`,
    `Nhận xét góp ý: ${state.feedbackNote.trim() || '(Không có)'}`,
  ];
  return lines.join('\n');
};

const RUBRIC_CATEGORY_BADGE_CLASSES: Record<Stage3RubricCriterion['category'], string> = {
  'Ý tưởng (3.1)': 'bg-amber-100 text-amber-800',
  'Quy trình (3.2)': 'bg-sky-100 text-sky-800',
  'Trình bày & Phản biện': 'bg-purple-100 text-purple-800',
  'Sản phẩm & Quy trình': 'bg-emerald-100 text-emerald-800',
  'Poster Khoa học': 'bg-orange-100 text-orange-800',
  'Thuyết trình & Phản biện': 'bg-purple-100 text-purple-800',
};

const RUBRIC_LEVEL_STYLE_CLASSES: Record<1 | 2 | 3 | 4 | 5, { picked: string; badge: string }> = {
  1: { picked: 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/50 text-rose-950', badge: 'bg-rose-600 text-white' },
  2: { picked: 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 text-amber-950', badge: 'bg-amber-600 text-white' },
  3: { picked: 'bg-sky-50 border-sky-500 ring-2 ring-sky-400/50 text-sky-950', badge: 'bg-sky-600 text-white' },
  4: { picked: 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400/50 text-indigo-950', badge: 'bg-indigo-600 text-white' },
  5: { picked: 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 text-emerald-950', badge: 'bg-emerald-600 text-white' },
};

interface RubricInteractivePanelProps {
  stageShortLabel: string;
  stageFullTitle: string;
  rubricSubtitle: string;
  feedbackLabel: string;
  feedbackPlaceholder: string;
  criteria: Stage3RubricCriterion[];
  state: RubricFormState;
  onChangeState: React.Dispatch<React.SetStateAction<RubricFormState>>;
  onResetConfirm?: () => void;
  onSubmit: () => void;
  teacherEmail: string;
}

/** Bảng Analytical Rubric 5 mức tương tác dùng chung cho Chặng 3 và Chặng 5. */
function RubricInteractivePanel({
  stageShortLabel,
  stageFullTitle,
  rubricSubtitle,
  feedbackLabel,
  feedbackPlaceholder,
  criteria,
  state,
  onChangeState,
  onResetConfirm,
  onSubmit,
  teacherEmail,
}: RubricInteractivePanelProps) {
  const { answeredCount, isComplete, totalPoints, rank } = getRubricSummary(criteria, state);

  const handleSelectLevel = (criterion: Stage3RubricCriterion, lv: RubricLevelOption) => {
    onChangeState((prev) => ({
      ...prev,
      validationError: null,
      selections: { ...prev.selections, [criterion.id]: lv.level },
      points: { ...prev.points, [criterion.id]: lv.points },
    }));
  };

  const handleChangePoint = (criterion: Stage3RubricCriterion, rawVal: string) => {
    if (rawVal.trim() === '') {
      onChangeState((prev) => {
        const nextPoints = { ...prev.points };
        const nextSelections = { ...prev.selections };
        delete nextPoints[criterion.id];
        delete nextSelections[criterion.id];
        return { ...prev, validationError: null, points: nextPoints, selections: nextSelections };
      });
      return;
    }
    const parsed = Number(rawVal);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(0, Math.min(criterion.maxPoints, Math.round(parsed * 100) / 100));
    const ratio = clamped / criterion.maxPoints;
    const inferredLevel: 1 | 2 | 3 | 4 | 5 =
      ratio >= 0.9 ? 5 : ratio >= 0.7 ? 4 : ratio >= 0.5 ? 3 : ratio >= 0.3 ? 2 : 1;
    onChangeState((prev) => ({
      ...prev,
      validationError: null,
      points: { ...prev.points, [criterion.id]: clamped },
      selections: { ...prev.selections, [criterion.id]: inferredLevel },
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-linear-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 border border-indigo-700 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-indigo-950 font-black text-[11px] uppercase">
              📐 ANALYTICAL RUBRIC 5 MỨC • THANG 10 ĐIỂM (100%)
            </span>
            <span className="text-xs text-indigo-200 font-bold">
              Mức 1 (Cần cố gắng) → Mức 5 (Xuất sắc)
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {rubricSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/20">
            <button
              type="button"
              onClick={() => onChangeState((prev) => ({ ...prev, evaluatorMode: 'peer' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${state.evaluatorMode === 'peer'
                ? 'bg-amber-400 text-indigo-950'
                : 'text-white/80 hover:text-white'
                }`}
            >
              👥 Đánh giá nhóm bạn
            </button>
            <button
              type="button"
              onClick={() => onChangeState((prev) => ({ ...prev, evaluatorMode: 'self' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${state.evaluatorMode === 'self'
                ? 'bg-emerald-400 text-indigo-950'
                : 'text-white/80 hover:text-white'
                }`}
            >
              🙋 Tự đánh giá
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-indigo-200 shadow-2xs flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
              {state.evaluatorMode === 'peer'
                ? '🏷️ Tên nhóm đánh giá (Nhóm chấm)'
                : '🏷️ Tên nhóm tự đánh giá'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={state.evaluatorGroup}
              onChange={(e) => {
                const val = e.target.value;
                onChangeState((prev) => ({
                  ...prev,
                  evaluatorGroup: val,
                  validationError: null,
                  targetGroup: prev.evaluatorMode === 'self' ? val : prev.targetGroup,
                }));
              }}
              placeholder="Ví dụ: Nhóm 1 (Hoặc Họ tên thành viên đại diện)..."
              className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
              🎯 Tên nhóm được đánh giá <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={state.targetGroup}
              onChange={(e) =>
                onChangeState((prev) => ({
                  ...prev,
                  targetGroup: e.target.value,
                  validationError: null,
                }))
              }
              placeholder="Ví dụ: Nhóm 2 - Giấy nảy mầm Cellulose..."
              className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-black uppercase text-indigo-900 mb-1">
              🏫 Lớp
            </label>
            <input
              type="text"
              value={state.className}
              onChange={(e) => onChangeState((prev) => ({ ...prev, className: e.target.value }))}
              placeholder="Ví dụ: 9A1"
              className="w-full rounded-xl bg-indigo-50/50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-indigo-100">
          <span className="text-[11px] font-medium text-slate-600">
            💡 Bấm chọn ô mô tả mức độ hoặc nhập điểm trực tiếp vào cột <strong>Ghi điểm</strong> bên phải bảng.
          </span>
          <div className="flex items-center gap-2">
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onChangeState((prev) => ({
                    ...createInitialRubricFormState(),
                    evaluatorMode: prev.evaluatorMode,
                    evaluatorGroup: prev.evaluatorGroup,
                    targetGroup: prev.targetGroup,
                    className: prev.className,
                  }));
                  onResetConfirm?.();
                }}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                ↺ Chấm lại
              </button>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In phiếu Rubric</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-indigo-200 bg-white shadow-sm">
        <table className="w-full min-w-280 border-collapse text-left">
          <thead>
            <tr className="bg-indigo-950 text-white text-xs font-black">
              <th className="p-3 border border-indigo-800 w-48">TIÊU CHÍ (Trọng số)</th>
              <th className="p-3 border border-indigo-800 bg-rose-800 text-center">
                MỨC 1<br />
                <span className="text-[10px] font-bold text-rose-100">CẦN CỐ GẮNG (20%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-amber-700 text-center">
                MỨC 2<br />
                <span className="text-[10px] font-bold text-amber-100">ĐẠT (40%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-sky-800 text-center">
                MỨC 3<br />
                <span className="text-[10px] font-bold text-sky-100">KHÁ (60%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-indigo-700 text-center">
                MỨC 4<br />
                <span className="text-[10px] font-bold text-indigo-100">TỐT (80%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-emerald-800 text-center">
                MỨC 5<br />
                <span className="text-[10px] font-bold text-emerald-100">XUẤT SẮC (100%)</span>
              </th>
              <th className="p-3 border border-indigo-800 bg-orange-600 text-center w-28">
                ✍️ GHI ĐIỂM
              </th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion) => {
              const selectedLevel = state.selections[criterion.id];
              const currentPoint = getCriterionPointFromState(criterion, state);
              const selectedLabel = criterion.levels.find((l) => l.level === selectedLevel)?.label;

              return (
                <tr key={criterion.id} className="border-t border-indigo-100 align-top">
                  <td className="p-3 bg-indigo-50/60 border-r border-indigo-100">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black mb-1.5 ${RUBRIC_CATEGORY_BADGE_CLASSES[criterion.category]}`}
                    >
                      {criterion.category}
                    </span>
                    <div className="text-xs font-black text-indigo-950 leading-snug">
                      {criterion.title}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] font-bold text-indigo-700">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200">
                        Trọng số: {criterion.weightPercent}%
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-orange-700">
                        Tối đa: {criterion.maxPoints}đ
                      </span>
                    </div>
                  </td>

                  {criterion.levels.map((lv) => {
                    const isPicked = selectedLevel === lv.level;
                    const lvStyle = RUBRIC_LEVEL_STYLE_CLASSES[lv.level];
                    return (
                      <td key={lv.level} className="p-1.5 border-r border-indigo-100">
                        <button
                          type="button"
                          onClick={() => handleSelectLevel(criterion, lv)}
                          className={`w-full h-full min-h-36 p-2.5 rounded-xl border-2 text-left flex flex-col justify-between gap-2 cursor-pointer transition-all ${isPicked
                            ? `${lvStyle.picked} shadow-xs scale-[1.01]`
                            : 'bg-white border-transparent hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-700'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black ${isPicked ? lvStyle.badge : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                              {lv.points} điểm
                            </span>
                            {isPicked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          </div>
                          <ul className="text-[11px] leading-relaxed font-medium space-y-1">
                            {lv.bullets.map((bText, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-1">
                                <span className="font-bold text-indigo-400 shrink-0">-</span>
                                <span>{bText}</span>
                              </li>
                            ))}
                          </ul>
                        </button>
                      </td>
                    );
                  })}

                  <td className="p-2.5 bg-orange-50/40 align-middle text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="flex items-center justify-center gap-1 w-full">
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={criterion.maxPoints}
                          value={currentPoint !== undefined ? currentPoint : ''}
                          onChange={(e) => handleChangePoint(criterion, e.target.value)}
                          placeholder="0"
                          aria-label={`Ghi điểm cho ${criterion.title}`}
                          className="w-16 rounded-xl bg-white border-2 border-orange-300 focus:border-orange-600 px-2 py-1.5 text-center text-sm font-black text-indigo-950 outline-none shadow-2xs"
                        />
                        <span className="text-xs font-black text-slate-500">/ {criterion.maxPoints}</span>
                      </div>
                      {selectedLabel ? (
                        <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                          {selectedLabel}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">Chưa chấm</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-950 text-white border-t-2 border-indigo-800">
              <td colSpan={6} className="p-3.5 text-right">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="text-xs md:text-sm font-black uppercase tracking-wide text-amber-300">
                    TỔNG ĐIỂM ĐÁNH GIÁ RUBRIC ({stageShortLabel} • 100%):
                  </span>
                  {isComplete ? (
                    <span className={`px-3 py-0.5 rounded-full text-xs font-black ${rank.colorClass}`}>
                      Xếp loại: {rank.label}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-indigo-200">
                      Đã chấm {answeredCount}/{criteria.length} tiêu chí
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3 bg-orange-600 text-center">
                <div className="text-lg md:text-xl font-black text-white leading-none">{totalPoints}</div>
                <div className="text-[10px] font-bold text-amber-100 mt-0.5">/ 10.0 điểm</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-6 bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 flex flex-col gap-2">
          <label className="text-xs font-black text-indigo-950">{feedbackLabel}</label>
          <textarea
            rows={4}
            value={state.feedbackNote}
            onChange={(e) => onChangeState((prev) => ({ ...prev, feedbackNote: e.target.value }))}
            placeholder={feedbackPlaceholder}
            className="w-full rounded-xl bg-white border border-indigo-200 p-2.5 text-xs font-medium text-indigo-950 outline-none focus:border-indigo-600 resize-none flex-1"
          />
        </div>

        <div className="lg:col-span-6 bg-white border-2 border-indigo-200 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
            <div>
              <div className="text-[11px] font-black uppercase text-indigo-500">
                Tổng hợp phiếu đánh giá ({stageShortLabel}) • Gửi Thầy Trần Văn Lĩnh
              </div>
              <div className="text-xl font-black text-indigo-950 mt-0.5">
                Tổng điểm: <span className="text-orange-600">{totalPoints}</span> / 10.0 điểm
              </div>
            </div>
            {isComplete ? (
              <span className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${rank.colorClass}`}>
                {rank.label}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                Chấm {answeredCount}/{criteria.length} tiêu chí
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-600 space-y-0.5 font-medium">
            <div>
              • <strong>Nhóm đánh giá:</strong>{' '}
              {state.evaluatorGroup.trim() || <span className="text-rose-500 italic">Chưa nhập</span>}
            </div>
            <div>
              • <strong>Nhóm được đánh giá:</strong>{' '}
              {state.targetGroup.trim() || <span className="text-rose-500 italic">Chưa nhập</span>}
            </div>
          </div>

          {state.validationError && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-xl px-3 py-2 text-xs font-bold">
              ⚠️ {state.validationError}
            </div>
          )}

          {state.message && (
            <div
              className={`rounded-xl px-3 py-2 text-xs font-bold border ${state.status === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
            >
              {state.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              disabled={state.isSending}
              onClick={onSubmit}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>
                {state.isSending
                  ? 'Đang gửi phiếu đánh giá cho GV...'
                  : 'Nộp phiếu đánh giá cho thầy Trần Văn Lĩnh'}
              </span>
            </button>

            <a
              href={`mailto:${teacherEmail}?subject=${encodeURIComponent(
                `[KHTN 9] Đánh giá Rubric ${stageShortLabel} - ${state.targetGroup.trim() || 'Nhóm HS'}`
              )}&body=${encodeURIComponent(buildRubricMailtoBodyFor(stageFullTitle, criteria, state))}`}
              className="py-2.5 px-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-black text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
              title="Mở ứng dụng Email để gửi bản sao trực tiếp"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mailto dự phòng</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ĐÁNH GIÁ DỰ ÁN CHẶNG 6.2 (360° ASSESSMENT: HS - NHÓM TRƯỞNG - GV)
// ============================================================

export interface Stage6SelfRubricCriterion {
  id: string;
  code: string;
  badge: string;
  title: string;
  weightText: string;
  maxPoints: number;
  levels: {
    level: 1 | 2 | 3 | 4 | 5;
    points: number;
    text: string;
  }[];
}

export const STAGE6_SELF_RUBRIC_CRITERIA: Stage6SelfRubricCriterion[] = [
  {
    id: 's6_self_padlet',
    code: '1',
    badge: 'Năng lực số • Padlet',
    title: 'THAM GIA THẢO LUẬN & MINH CHỨNG PADLET',
    weightText: '25% • Tối đa: 2.5đ',
    maxPoints: 2.5,
    levels: [
      { level: 1, points: 0.5, text: 'Em chưa đăng bài lên Padlet của nhóm và chưa tham gia bình luận trao đổi cùng các bạn.' },
      { level: 2, points: 1.0, text: 'Em có đăng bài lên Padlet nhưng nội dung còn ngắn, phải đợi nhóm trưởng nhắc nhở.' },
      { level: 3, points: 1.5, text: 'Em đã đăng đầy đủ minh chứng phần việc của mình lên Padlet đúng thời hạn quy định.' },
      { level: 4, points: 2.0, text: 'Em chủ động đăng ảnh/video quá trình làm việc rõ nét và tích cực bình luận góp ý trên Padlet.' },
      { level: 5, points: 2.5, text: 'Em thường xuyên trao đổi ý tưởng, hệ thống hóa thông tin trên Padlet và góp ý sâu cho nhóm bạn.' },
    ],
  },
  {
    id: 's6_self_knowledge',
    code: '2',
    badge: 'Kiến thức KHTN 9',
    title: 'VẬN DỤNG KIẾN THỨC TINH BỘT & CELLULOSE',
    weightText: '25% • Tối đa: 2.5đ',
    maxPoints: 2.5,
    levels: [
      { level: 1, points: 0.5, text: 'Em còn lúng túng, chưa phân biệt rõ cấu tạo và tính chất của Tinh bột với Cellulose.' },
      { level: 2, points: 1.0, text: 'Em nhận biết được nguyên liệu thuộc Tinh bột hay Cellulose nhưng giải thích chưa trọn vẹn.' },
      { level: 3, points: 1.5, text: 'Em hiểu rõ công thức (C₆H₁₀O₅)ₙ và giải thích được vai trò liên kết sợi hoặc hồ hóa tinh bột.' },
      { level: 4, points: 2.0, text: 'Em vận dụng kiến thức Bài 30 để đề xuất tỉ lệ phối trộn nguyên liệu và xử lý sự cố kỹ thuật.' },
      { level: 5, points: 2.5, text: 'Em làm chủ kiến thức khoa học của dự án, tự tin giải thích cơ chế hóa học bằng cả tiếng Anh/Việt.' },
    ],
  },
  {
    id: 's6_self_practice',
    code: '3',
    badge: 'Thực hành & Hóa học xanh',
    title: 'KỸ NĂNG THỰC HÀNH & TUÂN THỦ AN TOÀN',
    weightText: '30% • Tối đa: 3.0đ',
    maxPoints: 3.0,
    levels: [
      { level: 1, points: 0.6, text: 'Em chưa hoàn thành nhiệm vụ thực hành được giao hoặc chưa chú ý an toàn dụng cụ/nhiệt.' },
      { level: 2, points: 1.2, text: 'Em có tham gia làm sản phẩm nhưng thao tác còn lúng túng, định lượng chưa chính xác.' },
      { level: 3, points: 1.8, text: 'Em hoàn thành tốt khâu thực hành được phân công, tuân thủ đúng quy tắc an toàn vệ sinh.' },
      { level: 4, points: 2.4, text: 'Em thao tác thành thạo, đo lường chuẩn xác và chủ động tái sử dụng phụ phẩm bảo vệ môi trường.' },
      { level: 5, points: 3.0, text: 'Em là nhân tố nòng cốt tạo ra sản phẩm bền đẹp, sáng tạo cải tiến kỹ thuật và giữ an toàn tuyệt đối.' },
    ],
  },
  {
    id: 's6_self_coop',
    code: '4',
    badge: 'Hợp tác & Báo cáo',
    title: 'TINH THẦN HỢP TÁC, POSTER & THUYẾT TRÌNH',
    weightText: '20% • Tối đa: 2.0đ',
    maxPoints: 2.0,
    levels: [
      { level: 1, points: 0.4, text: 'Em ít tham gia họp nhóm, nộp việc trễ hạn và chưa tham gia khâu Poster hay thuyết trình.' },
      { level: 2, points: 0.8, text: 'Em tham gia ở mức thụ động, có hỗ trợ làm Poster hoặc thuyết trình nhưng còn phụ thuộc tài liệu.' },
      { level: 3, points: 1.2, text: 'Em phối hợp vui vẻ, đúng hẹn, đóng góp nội dung Poster và hoàn thành phần trình bày được giao.' },
      { level: 4, points: 1.6, text: 'Em lắng nghe, hỗ trợ bạn tích cực; thuyết trình tự tin hoặc thiết kế Poster khoa học, đẹp mắt.' },
      { level: 5, points: 2.0, text: 'Em kết nối cả nhóm hiệu quả, thuyết trình lôi cuốn và tự tin phản biện trước lớp và giáo viên.' },
    ],
  },
];

export interface Stage6LeaderRubricCriterion {
  id: string;
  code: string;
  title: string;
  weightText: string;
  maxPoints: number;
  levels: {
    level: 1 | 2 | 3 | 4 | 5;
    points: number;
    text: string;
  }[];
}

export const STAGE6_LEADER_RUBRIC_CRITERIA: Stage6LeaderRubricCriterion[] = [
  {
    id: 's6_ldr_padlet',
    code: '1',
    title: 'TRAO ĐỔI & CẬP NHẬT MINH CHỨNG TRÊN PADLET',
    weightText: 'Trọng số: 25% • Tối đa: 2.5đ',
    maxPoints: 2.5,
    levels: [
      { level: 1, points: 0.5, text: 'Không tham gia thảo luận trên Padlet; không đăng tải minh chứng phần việc được giao.' },
      { level: 2, points: 1.0, text: 'Có đăng bài lên Padlet nhưng sơ sài, chỉ thực hiện sau khi nhóm trưởng nhắc nhở nhiều lần.' },
      { level: 3, points: 1.5, text: 'Cập nhật đầy đủ minh chứng cá nhân lên cột Padlet của nhóm đúng thời hạn quy định.' },
      { level: 4, points: 2.0, text: 'Tích cực trao đổi ý tưởng trên Padlet, đăng ảnh/video quá trình làm việc rõ nét, chi tiết.' },
      { level: 5, points: 2.5, text: 'Dẫn dắt thảo luận sôi nổi trên Padlet, hỗ trợ tổng hợp minh chứng và góp ý hiệu quả cho nhóm bạn.' },
    ],
  },
  {
    id: 's6_ldr_task',
    code: '2',
    title: 'THỰC HIỆN NHIỆM VỤ CHUYÊN MÔN & CHẾ TẠO SẢN PHẨM',
    weightText: 'Trọng số: 35% • Tối đa: 3.5đ',
    maxPoints: 3.5,
    levels: [
      { level: 1, points: 0.7, text: 'Không hoàn thành phần việc được phân công hoặc làm qua loa, gây ảnh hưởng tiến độ chung.' },
      { level: 2, points: 1.4, text: 'Hoàn thành phần việc ở mức cơ bản nhưng còn sai sót, cần thành viên khác sửa lại.' },
      { level: 3, points: 2.1, text: 'Hoàn thành đúng nhiệm vụ được giao (chuẩn bị phế phẩm, xay/ép khuôn, làm Poster...).' },
      { level: 4, points: 2.8, text: 'Thực hiện nhiệm vụ cẩn thận, đảm bảo định lượng kỹ thuật và an toàn Hóa học Xanh.' },
      { level: 5, points: 3.5, text: 'Hoàn thành xuất sắc phần việc với chất lượng cao, có sáng kiến tối ưu quy trình chế tạo.' },
    ],
  },
  {
    id: 's6_ldr_coop',
    code: '3',
    title: 'TINH THẦN HỢP TÁC, KỶ LUẬT & ĐÚNG HẠN',
    weightText: 'Trọng số: 20% • Tối đa: 2.0đ',
    maxPoints: 2.0,
    levels: [
      { level: 1, points: 0.4, text: 'Thường xuyên vắng họp nhóm, trễ hạn tất cả các chặng, thiếu tôn trọng ý kiến tập thể.' },
      { level: 2, points: 0.8, text: 'Tham gia chưa đều, còn trễ hạn 1–2 đầu việc, thái độ làm việc thụ động.' },
      { level: 3, points: 1.2, text: 'Tham gia đầy đủ các buổi làm việc nhóm, tuân thủ phân công và nộp bài đúng hạn.' },
      { level: 4, points: 1.6, text: 'Chủ động phối hợp nhịp nhàng, lắng nghe góp ý và sẵn sàng nhận thêm việc khi nhóm cần.' },
      { level: 5, points: 2.0, text: 'Gương mẫu, kỷ luật cao, luôn kết nối và hỗ trợ kịp thời các thành viên gặp khó khăn.' },
    ],
  },
  {
    id: 's6_ldr_poster',
    code: '4',
    title: 'ĐÓNG GÓP HOÀN THIỆN POSTER & THUYẾT TRÌNH PHẢN BIỆN',
    weightText: 'Trọng số: 20% • Tối đa: 2.0đ',
    maxPoints: 2.0,
    levels: [
      { level: 1, points: 0.4, text: 'Không tham gia chuẩn bị Poster, không tham gia thuyết trình hay hỗ trợ trả lời phản biện.' },
      { level: 2, points: 0.8, text: 'Có tham gia hỗ trợ khâu trình bày/hậu cần nhưng đóng góp nội dung kiến thức Bài 30 còn ít.' },
      { level: 3, points: 1.2, text: 'Đóng góp nội dung/hình ảnh cho Poster hoặc tham gia thuyết trình đúng phần được phân công.' },
      { level: 4, points: 1.6, text: 'Tích cực biên tập Poster khoa học, luyện tập thuyết trình tự tin và hỗ trợ trả lời phản biện.' },
      { level: 5, points: 2.0, text: 'Đóng vai trò nòng cốt trong thiết kế Poster, thuyết trình lôi cuốn hoặc phản biện sắc sảo.' },
    ],
  },
];

export interface Stage6MemberRecord {
  id: string;
  name: string;
  role: string;
  scores: Record<string, number>;
  comment: string;
}

export interface Stage6TeamPreset {
  id: string;
  name: string;
  className: string;
  leaderName: string;
  productName: string;
  members: Stage6MemberRecord[];
}

export const STAGE6_TEAM_PRESETS: Stage6TeamPreset[] = [
  {
    id: 'team-ngan',
    name: 'Nhóm 1 - Hóa Học Xanh (Green Chem)',
    className: '9A',
    leaderName: 'Nguyễn Thuý Ngân',
    productName: 'Vật liệu xơ sợi sinh học & Màng bọc thực phẩm tự hủy',
    members: [
      {
        id: 'ngan-m1',
        name: 'Lê Hải Yến',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác cẩn thận, đo lường chuẩn xác nguyên liệu bột xơ sợi, thực hiện quy trình an toàn.',
      },
      {
        id: 'ngan-m2',
        name: 'Trần Quỳnh Như',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster khoa học, bố cục hài hòa, thể hiện rõ công thức và cơ chế liên kết sợi.',
      },
      {
        id: 'ngan-m3',
        name: 'Phạm Quỳnh Trâm',
        role: 'Phụ trách định lượng phụ gia & Chống ẩm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Nghiên cứu phụ gia sinh học an toàn, tích cực phối hợp cùng nhóm thực hành ép khuôn.',
      },
      {
        id: 'ngan-m4',
        name: 'Huỳnh Kha My',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Chụp ảnh, quay clip các bước thực hành rõ nét, cập nhật bài đăng lên Padlet đúng hạn.',
      },
      {
        id: 'ngan-m5',
        name: 'Võ Như Quỳnh',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thuyết trình lưu loát, tự tin, nắm vững kiến thức Hóa học Xanh và phản biện thuyết phục.',
      },
    ],
  },
  {
    id: 'team-thao',
    name: 'Nhóm 2 - Tinh Bột Xanh (Green Starch)',
    className: '9A',
    leaderName: 'Nguyễn Thu Thảo',
    productName: 'Túi màng sinh học tự phân hủy từ Tinh bột & Sợi rơm rạ',
    members: [
      {
        id: 'thao-m1',
        name: 'Lê Thiên Hà Giang',
        role: 'Kỹ thuật viên chế tạo & Định lượng tỷ lệ',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác cẩn thận, đo lường chuẩn xác tỷ lệ tinh bột và chất hóa dẻo glycerol an toàn.',
      },
      {
        id: 'thao-m2',
        name: 'Hoàng Trần Ngọc Anh',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster khoa học, đẹp mắt, phân tích rõ cơ chế hồ hóa tinh bột và liên kết mạch polymer.',
      },
      {
        id: 'thao-m3',
        name: 'Nguyễn Minh Khang',
        role: 'Nghiên cứu phụ gia sinh học & Độ bền',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Tích cực thử nghiệm độ dai chịu lực của màng sinh học và ghi chép nhật ký thực hành đầy đủ.',
      },
      {
        id: 'thao-m4',
        name: 'Nguyễn Minh Quân',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Quay phim các bước thí nghiệm rõ nét, đăng tải minh chứng lên Padlet đúng hạn quy định.',
      },
      {
        id: 'thao-m5',
        name: 'Nguyễn Nam Phong',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Phong thái tự tin, đối đáp mạch lạc và giải thích sâu sắc thông điệp Hóa học Xanh.',
      },
    ],
  },
  {
    id: 'team-hung',
    name: 'Nhóm 3 - Sợi Tái Sinh (Eco Paper)',
    className: '9A',
    leaderName: 'Trần Hoàng Hùng',
    productName: 'Giấy sinh học từ bã mía & rơm rạ nảy mầm',
    members: [
      {
        id: 'hung-m1',
        name: 'Bùi Minh Huy',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Thao tác thực hành cẩn thận, đo lường chuẩn xác nguyên liệu bột bã mía, tuân thủ an toàn.',
      },
      {
        id: 'hung-m2',
        name: 'Lê Như Cát Tường',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster rất đẹp mắt, khoa học, thể hiện chuẩn xác cấu tạo và cơ chế hóa học Bài 30.',
      },
      {
        id: 'hung-m3',
        name: 'Liêu Hoàng Gia',
        role: 'Phụ trách định lượng phụ gia & Chống mốc',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Tìm tòi giải pháp phụ gia sinh học an toàn, nhiệt tình hỗ trợ ép khuôn và phơi mẫu.',
      },
      {
        id: 'hung-m4',
        name: 'Đặng Thị Minh Đông',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Cập nhật minh chứng đầy đủ lên Padlet, quay dựng video hành trình sống động, lôi cuốn.',
      },
      {
        id: 'hung-m5',
        name: 'Nguyễn Hoàng Bảo Trân',
        role: 'Thuyết trình viên & Phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thuyết trình tự tin, mạch lạc, đối đáp và phản biện thông minh trước lớp và giáo viên.',
      },
      {
        id: 'hung-m6',
        name: 'Phan Lê Huy',
        role: 'Chuẩn bị phế phẩm hữu cơ & Hậu cần',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Thu gom nguyên liệu bã mía, rơm rạ kịp thời; dọn dẹp vệ sinh phòng thực hành sạch sẽ.',
      },
    ],
  },
  {
    id: 'team-phuong-anh',
    name: 'Nhóm 4 - Bách Thảo Sinh Học (Bio Polymer)',
    className: '9A',
    leaderName: 'Trần Phương Anh (STT: 05)',
    productName: 'Khay đựng thực phẩm tự phân hủy từ xơ dừa & tinh bột ngô',
    members: [
      {
        id: 'pa-m1',
        name: 'Võ Hoàng Dung',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm (STT: 08)',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác ép nhiệt định hình khay thực phẩm chuẩn xác, nhiệt tình phối hợp cùng nhóm.',
      },
      {
        id: 'pa-m2',
        name: 'Phan Thanh Ngân',
        role: 'Biên tập Poster & Nội dung Bài 30 (STT: 25)',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Biên tập nội dung lý thuyết Bài 30 sắc nét, bố cục Poster hiện đại, sáng tạo.',
      },
      {
        id: 'pa-m3',
        name: 'Hồ Lê Bảo Ngọc',
        role: 'Phụ trách định lượng phụ gia & Chống ẩm (STT: 27)',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Tính toán tỷ lệ chất kết dính sinh học an toàn, kiểm soát độ ẩm mẫu khay tốt.',
      },
      {
        id: 'pa-m4',
        name: 'Lê Thị Minh Thảo',
        role: 'Truyền thông số & Quay dựng Video (STT: 39)',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Ghi hình quá trình xử lý xơ dừa chi tiết, cập nhật Padlet đều đặn đúng tiến độ.',
      },
      {
        id: 'pa-m5',
        name: 'Nguyễn Phạm Tường Vy',
        role: 'Thuyết trình viên & Trả lời phản biện (STT: 50)',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Trình bày sản phẩm lôi cuốn, trả lời câu hỏi phản biện của thầy cô tự tin, thuyết phục.',
      },
    ],
  },
  {
    id: 'team-hanh-quynh',
    name: 'Nhóm 5 - Vòng Đời Tự Nhiên (Nature Cycle)',
    className: '9A',
    leaderName: 'Dương Minh Hạnh Quỳnh',
    productName: 'Chậu ươm cây tự phân hủy từ bã cà phê, mùn cưa và hồ tinh bột',
    members: [
      {
        id: 'hq-m1',
        name: 'Lê Nguyễn Phương Vy',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Nhiệt tình tham gia khâu ép chậu ươm, điều chỉnh tỷ lệ hồ tinh bột kết dính đồng đều.',
      },
      {
        id: 'hq-m2',
        name: 'Võ Trần Gia Hân',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster giàu tính thẩm mỹ, giải thích rõ cơ chế phân hủy sinh học trong đất.',
      },
      {
        id: 'hq-m3',
        name: 'Nguyễn Huỳnh Phương Thảo',
        role: 'Phụ trách định lượng phụ gia & Chống ẩm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Đo lường nguyên liệu mùn cưa và bã cà phê chuẩn xác, giữ gìn vệ sinh khu vực làm việc.',
      },
      {
        id: 'hq-m4',
        name: 'Võ Ngọc Phương Trang',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Tích cực quay dựng video clip thử nghiệm gieo hạt trong chậu ươm, đăng bài đúng hạn.',
      },
      {
        id: 'hq-m5',
        name: 'Lê Hồng Sun Ny',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Giọng nói truyền cảm, phong thái tự tin, lan tỏa thông điệp Hóa học Xanh ấn tượng.',
      },
    ],
  },
  {
    id: 'team-tam-anh',
    name: 'Nhóm 6 - Tương Lai Xanh (Green Future)',
    className: '9A',
    leaderName: 'Nguyễn Phạm Tâm Anh',
    productName: 'Màng bảo quản nông sản kháng khuẩn từ tinh bột sắn & sợi chuối',
    members: [
      {
        id: 'ta-m1',
        name: 'Lê Thạch Trâm Anh',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thực hành tách sợi chuối cẩn thận, phối trộn dung dịch hồ hóa tinh bột sắn chuẩn tỷ lệ.',
      },
      {
        id: 'ta-m2',
        name: 'Nguyễn Tuyết Ngân',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Hệ thống kiến thức Bài 30 khoa học, trình bày hình ảnh so sánh vi cấu trúc trực quan.',
      },
      {
        id: 'ta-m3',
        name: 'Hoàng Hải Đăng',
        role: 'Phụ trách định lượng phụ gia & Thử độ bền dai',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Khảo sát độ bền kéo đứt của màng sinh học chi tiết, ghi nhận số liệu thực nghiệm đầy đủ.',
      },
      {
        id: 'ta-m4',
        name: 'Nguyễn Ngọc Anh Thư',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Biên tập video clip tổng kết dự án sinh động, lồng nhạc nền và hiệu ứng đồ họa đẹp mắt.',
      },
      {
        id: 'ta-m5',
        name: 'Lê Trần Bảo Trí',
        role: 'Chuẩn bị nguyên liệu phế phẩm & Hậu cần',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Chủ động thu gom thân cây chuối sau thu hoạch, hỗ trợ nhóm sơ chế phế phẩm an toàn.',
      },
      {
        id: 'ta-m6',
        name: 'Phan Hồ Hữu Đạt',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Làm chủ sân khấu báo cáo, trả lời sắc sảo các câu hỏi phản biện của nhóm bạn và giáo viên.',
      },
    ],
  },
  {
    id: 'team-phong-danh',
    name: 'Nhóm 7 - Đổi Mới Sáng Tạo (Eco Innovation)',
    className: '9A',
    leaderName: 'Lê Quốc Phong Danh',
    productName: 'Bao bì xốp sinh học định hình từ bã mía & tinh bột lúa mì',
    members: [
      {
        id: 'pd-m1',
        name: 'Đào Tiến Dũng',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác ép nhiệt xốp bã mía an toàn, đảm bảo bề mặt sản phẩm nhẵn mịn, định hình tốt.',
      },
      {
        id: 'pd-m2',
        name: 'Hoàng Trọng Khôi',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster đạt chuẩn học đường, sơ đồ quy trình 4 bước rõ ràng, dễ theo dõi.',
      },
      {
        id: 'pd-m3',
        name: 'Ngô Gia Phúc',
        role: 'Phụ trách định lượng phụ gia & Chống mốc',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Nghiên cứu phụ gia sinh học tự nhiên chống mốc hiệu quả, tuân thủ an toàn Hóa học Xanh.',
      },
      {
        id: 'pd-m4',
        name: 'Phạm Tuấn Ngọc',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Chụp ảnh và quay phim quá trình làm việc chi tiết, dẫn dắt thảo luận trên Padlet sôi nổi.',
      },
      {
        id: 'pd-m5',
        name: 'Nguyễn Đông Sơn',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thuyết minh tự tin, diễn giải lưu loát tính ưu việt của bao bì sinh học thay thế hạt xốp EPS.',
      },
    ],
  },
  {
    id: 'team-tai',
    name: 'Nhóm 8 - Hành Tinh Xanh (Eco Planet)',
    className: '9A',
    leaderName: 'Vũ Bá Tài',
    productName: 'Vật liệu sinh học & Sản phẩm tái sinh thân thiện môi trường',
    members: [
      {
        id: 'tai-m1',
        name: 'Đỗ Quốc Huy',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác định lượng và thực hành chế tạo chuẩn xác, tuân thủ an toàn Hóa học Xanh.',
      },
      {
        id: 'tai-m2',
        name: 'Trần Đức Anh',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster khoa học, làm nổi bật công thức (C₆H₁₀O₅)ₙ và cơ chế liên kết sợi.',
      },
      {
        id: 'tai-m3',
        name: 'Lê Thanh Bình',
        role: 'Truyền thông số & Thuyết trình phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Cập nhật minh chứng đầy đủ lên Padlet, phong thái thuyết trình tự tin và phản biện rõ ràng.',
      },
    ],
  },
];

export const INITIAL_STAGE6_MEMBERS: Stage6MemberRecord[] = STAGE6_TEAM_PRESETS[0].members;

export interface Stage6TeacherRubricCriterion {
  id: string;
  code: string;
  stageTag: string;
  title: string;
  weightText: string;
  maxPoints: number;
  levels: {
    level: 1 | 2 | 3 | 4 | 5;
    points: number;
    text: string;
  }[];
}

export const STAGE6_TEACHER_RUBRIC_CRITERIA: Stage6TeacherRubricCriterion[] = [
  {
    id: 's6_tea_padlet',
    code: '1',
    stageTag: 'Chặng 1–4 • Hoạt động số',
    title: '1. HỢP TÁC NHÓM & TƯƠNG TÁC TRÊN PADLET',
    weightText: 'Trọng số: 10% | Tối đa: 1.0đ',
    maxPoints: 1.0,
    levels: [
      { level: 1, points: 0.2, text: 'Không tạo cột nhóm hoặc bỏ trống Padlet; không có minh chứng trao đổi trực tuyến. Thành viên đùn đẩy trách nhiệm, nộp sản phẩm trễ hạn tất cả các chặng.' },
      { level: 2, points: 0.4, text: 'Có đăng bài lên Padlet nhưng rời rạc, chỉ 1–2 thành viên hoạt động. Nộp bài đúng hạn 1–2 chặng; chưa tương tác nhận xét bài của nhóm bạn.' },
      { level: 3, points: 0.6, text: 'Cập nhật đủ minh chứng tiến độ 4 chặng lên Padlet kèm phân công nhiệm vụ rõ. Có ≥ 2 lượt bình luận góp ý mang tính xây dựng cho các nhóm khác trên Padlet.' },
      { level: 4, points: 0.8, text: 'Tổ chức cột Padlet khoa học, trực quan (kèm ảnh/video quá trình thực hành tại nhà). 100% thành viên tham gia thảo luận sôi nổi, phản hồi và tiếp thu góp ý kịp thời.' },
      { level: 5, points: 1.0, text: 'Quản trị Padlet xuất sắc như nhật ký nghiên cứu số chuyên nghiệp, cập nhật đúng hạn 100%. Tương tác đa chiều, đặt câu hỏi phản biện sâu sắc giúp nâng chất lượng chung của cả lớp.' },
    ],
  },
  {
    id: 's6_tea_science',
    code: '2',
    stageTag: 'Chặng 2–3 • Ý tưởng (3.1)',
    title: '2. CƠ SỞ KHOA HỌC & TÍNH SÁNG TẠO XANH',
    weightText: 'Trọng số: 15% | Tối đa: 1.5đ',
    maxPoints: 1.5,
    levels: [
      { level: 1, points: 0.3, text: 'Chưa phân biệt được bản chất Tinh bột và Cellulose; sai lệch ≥ 2 kiến thức trọng tâm. Ý tưởng sao chép nguyên mẫu, chưa gắn với giải pháp tái chế phế phẩm thực tế.' },
      { level: 2, points: 0.6, text: 'Nêu được tên nguyên liệu polymer tự nhiên nhưng giải thích cấu tạo/tính chất còn sơ sài. Có điều chỉnh nhỏ về tạo hình; thể hiện được mục đích tận dụng rác thải hữu cơ.' },
      { level: 3, points: 0.9, text: 'Xác định đúng công thức (C₆H₁₀O₅)ₙ và vai trò liên kết sợi Cellulose / hồ hóa Tinh bột. Ý tưởng sáng tạo rõ nét (giấy nảy mầm, chậu ươm, vật liệu sinh học...) kèm thông điệp xanh.' },
      { level: 4, points: 1.2, text: 'Phân tích chặt chẽ mối liên hệ giữa cấu trúc hóa học và tính chất cơ lý của vật liệu. Tích hợp công năng kép độc đáo, tối ưu chi phí gần như 0 đồng từ phế phẩm địa phương.' },
      { level: 5, points: 1.5, text: 'Vận dụng xuất sắc kiến thức Bài 30 để phối trộn đa nguồn sợi/tinh bột với phụ gia an toàn. Giải pháp thay thế nhựa dùng một lần có tính thẩm mỹ, khả năng thương mại và nhân rộng cao.' },
    ],
  },
  {
    id: 's6_tea_process',
    code: '3',
    stageTag: 'Chặng 3 • Quy trình (3.2)',
    title: '3. THIẾT KẾ QUY TRÌNH 4 BƯỚC & AN TOÀN HÓA HỌC XANH',
    weightText: 'Trọng số: 15% | Tối đa: 1.5đ',
    maxPoints: 1.5,
    levels: [
      { level: 1, points: 0.3, text: 'Quy trình thiếu bước, lộn xộn; không có định lượng nguyên liệu và thời gian. Đề xuất hóa chất độc hại (xút đặc, Javen đặc) hoặc thiếu quy định an toàn điện/nhiệt.' },
      { level: 2, points: 0.6, text: 'Đủ 4 bước (Chuẩn bị → Xử lý → Tạo hình → Hoàn thiện) nhưng định lượng còn ước lượng. Nguyên liệu tương đối an toàn; có nhắc nhở bảo hộ chung nhưng chưa xử lý bã/nước thải.' },
      { level: 3, points: 0.9, text: 'Quy trình 4 bước logic, định lượng chuẩn (g, ml, phút, °C) cho ≥ 70% thành phần. Không dùng hóa chất độc hại; có phương án lọc nước thừa, không gây tắc bồn rửa.' },
      { level: 4, points: 1.2, text: 'Định lượng tối ưu 100% công đoạn kèm thông số kỹ thuật và phương án xử lý sự cố. Chi tiết hóa đồ bảo hộ từng khâu; tái sử dụng nước ngâm/xơ thừa để tưới cây, ủ phân.' },
      { level: 5, points: 1.5, text: 'Quy trình chuẩn hóa như tài liệu kỹ thuật, kèm bảng thử nghiệm đối chứng ≥ 2 công thức. Đảm bảo Hóa học Xanh trọn vòng đời (tái chế — không phát thải — tự phân hủy) với checklist 3 khâu.' },
    ],
  },
  {
    id: 's6_tea_product',
    code: '4',
    stageTag: 'Chặng 4 • Thực hành chế tạo',
    title: '4. CHẤT LƯỢNG & CÔNG NĂNG SẢN PHẨM TÁI SINH',
    weightText: 'Trọng số: 20% | Tối đa: 2.0đ',
    maxPoints: 2.0,
    levels: [
      { level: 1, points: 0.4, text: 'Sản phẩm hỏng, ẩm mốc, rách nát hoặc không thành hình khối. Chưa tích hợp hạt mầm hoặc chưa thể hiện được công năng sử dụng.' },
      { level: 2, points: 0.8, text: 'Sản phẩm thành hình nhưng kết cấu yếu, dễ rách; bề mặt còn lợn cợn (> 30% xơ thô). Có hạt mầm nhưng phân bố lệch, thiếu đồng đều.' },
      { level: 3, points: 1.2, text: 'Kết cấu vững chắc, thể hiện rõ độ dai sợi Cellulose hoặc độ kết dính Tinh bột. Hạt mầm phân bố đều ≥ 70% diện tích, không dập nát; bề mặt tương đối phẳng.' },
      { level: 4, points: 1.6, text: 'Sản phẩm bền, đẹp, bề mặt mịn đồng đều; quy trình hoàn thiện an toàn tuyệt đối. Hạt mầm tích hợp đều 100% diện tích, đảm bảo tỉ lệ nảy mầm tốt khi thử nghiệm.' },
      { level: 5, points: 2.0, text: 'Sản phẩm hoàn mỹ, chịu ẩm/chịu lực tốt, tính thẩm mỹ cao vượt mong đợi. Kết hợp đột phá ≥ 2 loại sợi tự nhiên/tinh bột kèm hướng dẫn sử dụng và phân hủy sinh học.' },
    ],
  },
  {
    id: 's6_tea_poster',
    code: '5',
    stageTag: 'Chặng 4 • Báo cáo trực quan',
    title: '5. POSTER KHOA HỌC (NỘI DUNG BÀI 30 & QUY TRÌNH)',
    weightText: 'Trọng số: 15% | Tối đa: 1.5đ',
    maxPoints: 1.5,
    levels: [
      { level: 1, points: 0.3, text: 'Sai lệch kiến thức Tinh bột & Cellulose từ 2 nội dung trở lên; thiếu sơ đồ cấu tạo. Trình bày cẩu thả, rời rạc, khó đọc, mắc ≥ 5 lỗi chính tả.' },
      { level: 2, points: 0.6, text: 'Đủ thông tin cơ bản Bài 30 nhưng bố cục nhiều chữ (> 60% diện tích), ít hình ảnh. Có liệt kê quy trình nhưng thiếu sơ đồ trực quan hóa.' },
      { level: 3, points: 0.9, text: 'Trình bày chính xác kiến thức Bài 30, có sơ đồ cấu tạo (C₆H₁₀O₅)ₙ và ≥ 2 ảnh thực tế. Bố cục chia mục cân đối, cỡ chữ rõ ràng, dễ quan sát từ xa.' },
      { level: 4, points: 1.2, text: 'Bố cục khoa học, màu sắc hài hòa, không lỗi chính tả; sơ đồ quy trình mũi tên trực quan. Gắn kết chặt chẽ cơ sở hóa học Bài 30 với số liệu định lượng và kết quả thử nghiệm.' },
      { level: 5, points: 1.5, text: 'Thiết kế chuyên nghiệp, cân đối (chữ ≤ 35%), giàu tính thẩm mỹ và truyền cảm hứng. Hệ thống hóa xuất sắc kiến thức KHTN 9, bảng số liệu đối chứng và thông điệp môi trường.' },
    ],
  },
  {
    id: 's6_tea_video',
    code: '6',
    stageTag: 'Chặng 4 • Truyền thông số',
    title: '6. VIDEO TỔNG KẾT HÀNH TRÌNH & LAN TỎA DỰ ÁN',
    weightText: 'Trọng số: 15% | Tối đa: 1.5đ',
    maxPoints: 1.5,
    levels: [
      { level: 1, points: 0.3, text: 'Không nộp video hoặc video rời rạc, thiếu minh chứng quá trình làm việc của nhóm. Hình ảnh mờ rung, âm thanh rè/không nghe rõ lời thuyết minh; vượt quá thời lượng quy định.' },
      { level: 2, points: 0.6, text: 'Có ghép ảnh/clip các bước làm sản phẩm nhưng chuyển cảnh thô, thiếu mạch kể chuyện. Thuyết minh/phụ đề còn sơ sài, chưa nêu bật được kiến thức Bài 30 và kết quả thử nghiệm.' },
      { level: 3, points: 0.9, text: 'Video tái hiện đủ 4 chặng (Ý tưởng → Chế tạo → Thử nghiệm → Sản phẩm), đúng thời lượng. Hình ảnh rõ nét, âm thanh dễ nghe, có phụ đề/nhãn chú thích các bước định lượng chính.' },
      { level: 4, points: 1.2, text: 'Dựng phim mạch lạc, lôi cuốn; kết hợp hài hòa cảnh quay thực tế, nhạc nền và lời bình truyền cảm. Lồng ghép khéo léo giải thích khoa học Tinh bột/Cellulose và minh chứng sử dụng thực tế.' },
      { level: 5, points: 1.5, text: 'Video chất lượng cao, sáng tạo (góc quay đa dạng, hiệu ứng/đồ họa trực quan, thông điệp xanh mạnh mẽ). Có sự góp mặt/phối hợp của cả nhóm, truyền cảm hứng sống xanh và có giá trị tuyên truyền cao.' },
    ],
  },
  {
    id: 's6_tea_presentation',
    code: '7',
    stageTag: 'Chặng 4 • Báo cáo tổng kết',
    title: '7. THUYẾT TRÌNH & PHẢN BIỆN KHOA HỌC',
    weightText: 'Trọng số: 10% | Tối đa: 1.0đ',
    maxPoints: 1.0,
    levels: [
      { level: 1, points: 0.2, text: 'Nói nhỏ, phụ thuộc hoàn toàn vào tài liệu đọc (> 90%); trình bày lố giờ > 2 phút. Thiếu phối hợp nhóm; không trả lời được câu hỏi phản biện.' },
      { level: 2, points: 0.4, text: 'Diễn đạt ngập ngừng; có phân chia người nói nhưng chuyển tiếp còn gượng. Chỉ trả lời được các câu hỏi lý thuyết cơ bản, chưa giải thích sâu quy trình.' },
      { level: 3, points: 0.6, text: 'Thuyết trình tự tin, rõ ràng, đúng thời gian quy định; phối hợp nhịp nhàng. Giải thích được cơ sở khoa học và công dụng từng bước trong quy trình.' },
      { level: 4, points: 0.8, text: 'Diễn đạt lưu loát, lôi cuốn; kết hợp ăn ý Poster, sản phẩm mẫu và thuật ngữ tiếng Anh (starch, cellulose...). Phản biện lịch sự, bảo vệ quan điểm bằng dẫn chứng khoa học thuyết phục.' },
      { level: 5, points: 1.0, text: 'Làm chủ sân khấu hoàn toàn, sử dụng song ngữ Anh/Việt tự nhiên; xử lý tình huống linh hoạt. Phản biện sắc sảo bằng số liệu thực nghiệm và đặt câu hỏi phản biện giá trị cho nhóm bạn.' },
    ],
  },
];

export const getStage6RankInfo = (score: number) => {
  if (score >= 9.0) return { label: 'Xuất sắc', colorClass: 'bg-emerald-500 text-white', badge: '🏆 Xuất sắc (9.0 – 10đ)' };
  if (score >= 8.0) return { label: 'Tốt', colorClass: 'bg-blue-500 text-white', badge: '⭐ Tốt (8.0 – 8.9đ)' };
  if (score >= 6.5) return { label: 'Khá', colorClass: 'bg-amber-500 text-white', badge: '👍 Khá (6.5 – 7.9đ)' };
  if (score >= 5.0) return { label: 'Đạt', colorClass: 'bg-orange-500 text-white', badge: '🌱 Đạt (5.0 – 6.4đ)' };
  return { label: 'Cần cố gắng', colorClass: 'bg-rose-500 text-white', badge: '⚡ Cần cố gắng (< 5.0đ)' };
};

const ALL_TASK_IDS = [
  'task-s1-padlet',
  'task-s1-crossword',
  'task-s2-worksheet',
  'task-s2-part1',
  'task-s2-part2-iodine',
  'task-s2-part2-hydrolysis',
  'task-s2-part3',
  'task-s2-part4',
  'task-s2-part5',
  'task-s3-idea',
  'task-s3-process',
  'task-s3-peer',
  'task-s4-maker',
  'task-s4-submit',
  'task-s5-booth',
  'task-s5-vote',
  'task-s6-summary',
  'task-s6-quiz',
  'task-s6-assessment',
];

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
  const [newWordsCategoryFilter, setNewWordsCategoryFilter] = useState<string>('ALL');
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  const speakEnglishText = useCallback((id: string, text: string) => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setSpeakingWordId(id);
      utterance.onend = () => setSpeakingWordId(null);
      utterance.onerror = () => setSpeakingWordId(null);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeakingWordId(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore
      }
    };
  }, []);

  // Chế độ Học sinh (khóa theo chặng) vs Chế độ Giáo viên (xem tất cả các chặng, pass: 01011993)
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
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
  const [testScore, setTestScore] = useState<number>(() => savedProgress.testScore ?? 0);
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
    'stage-6': ['task-s6-summary', 'task-s6-assessment'],
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
      default:
        return false;
    }
  };

  // Chế độ Accordion thông minh: Khi mở 1 ô mới, tự động thu gọn các ô ĐÃ HOÀN THÀNH khác trong cùng chặng và cuộn mượt tới ô đó
  const unlockTask = (id: string) => {
    setUnlockedTaskIds((prev) => {
      const next = new Set(prev);
      if (!isTeacherMode) {
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
    if (isTeacherMode) return true;
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
                setStageLockMessage(null);
              }}
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${!isTeacherMode
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

          {isTeacherMode && (
            <>
              <button
                type="button"
                onClick={() => {
                  setShowTeacherDashboard(true);
                  fetchTeacherDashboardData();
                }}
                className="px-3.5 py-1.5 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Xem bảng tổng hợp điểm của cả lớp & Xuất Excel (không cần đọc từng email)"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bảng Tổng hợp Lớp</span>
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

        {/* ============================================================
            CHẶNG 1: KHỞI ĐỘNG (PADLET & Ô CHỮ)
           ============================================================ */}
        {activeStage === 'stage-1' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {renderStageGuideBanner('stage-1')}
            <LockedTaskBox
              taskId="task-s1-padlet"
              badgeText="Chặng 1 • Nhiệm vụ 1"
              title="Tạo lập nhóm trên Padlet: Cellulose - bắt đầu từ sự kết thúc"
              emoji="👥"
              isUnlocked={unlockedTaskIds.has('task-s1-padlet')}
              isCompleted={padletConfirmed}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={PADLET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center gap-2 shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở Padlet tạo nhóm</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowPadletEmbed((v) => !v)}
                    className="px-4 py-2.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {showPadletEmbed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPadletEmbed ? 'Ẩn Padlet' : 'Nhúng Padlet tại đây'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    placeholder="Tên nhóm..."
                    aria-label="Tên nhóm"
                    className="px-3.5 py-2 rounded-full bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 font-bold focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPadletConfirmed(true)}
                    className={`px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer ${padletConfirmed ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                      }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{padletConfirmed ? 'Đã lập nhóm' : 'Xác nhận'}</span>
                  </button>
                </div>
              </div>

              {showPadletEmbed && (
                <div className="w-full rounded-2xl overflow-hidden border border-indigo-200 bg-white">
                  <iframe
                    src={PADLET_URL}
                    title="Padlet Cellulose - bắt đầu từ sự kết thúc"
                    className="w-full h-125 border-0 bg-white"
                    allow="camera;microphone;geolocation"
                  />
                </div>
              )}
            </LockedTaskBox>

            <LockedTaskBox
              taskId="task-s1-crossword"
              badgeText="Chặng 1 • Nhiệm vụ 2"
              title="Trò chơi Khởi động: Vượt 6 Thử thách — Ghép Chữ cái tìm Từ khóa Bí ẩn"
              emoji="🧩"
              isUnlocked={unlockedTaskIds.has('task-s1-crossword')}
              isCompleted={isKeywordComplete}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase text-indigo-950">
                    🔑 Kéo chữ cái đã mở thả vào các ô &ldquo;?&rdquo; bên dưới (hoặc chọn ô số {activeKeywordSlot + 1} rồi bấm chữ) • Đã ghép {placedKeywordSlots.size}/{FULL_KEYWORD_LETTERS.length}:
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {KEYWORD_WORD_1.map((char, idx) => {
                      const placed = placedKeywordSlots.has(idx);
                      const isDragOver = dragOverSlotIdx === idx && !placed;
                      return (
                        <button
                          key={`w1-${idx}`}
                          type="button"
                          onClick={() => setActiveKeywordSlot(idx)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (!placed) setDragOverSlotIdx(idx);
                          }}
                          onDragLeave={() => setDragOverSlotIdx((prev) => (prev === idx ? null : prev))}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverSlotIdx(null);
                            const rawIdx = e.dataTransfer.getData('text/plain');
                            const tileIdx = rawIdx !== '' ? Number(rawIdx) : draggedTileIdx;
                            if (tileIdx !== null && !Number.isNaN(tileIdx)) {
                              handlePlaceLetter(tileIdx, idx);
                            }
                            setDraggedTileIdx(null);
                          }}
                          className={`w-8 h-10 rounded-lg border-2 font-black text-sm flex flex-col items-center justify-center cursor-pointer transition-all ${placed
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : isDragOver
                              ? 'bg-amber-200 text-orange-900 border-orange-500 scale-110 ring-2 ring-orange-400'
                              : activeKeywordSlot === idx
                                ? 'bg-orange-100 text-orange-700 border-orange-500 ring-2 ring-orange-400/40'
                                : 'bg-white text-indigo-300 border-indigo-200'
                            }`}
                        >
                          <span>{placed ? char : '?'}</span>
                          <span className="text-[8px] opacity-75">{idx + 1}</span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="font-black text-indigo-300 hidden md:inline">•</span>

                  <div className="flex flex-wrap gap-1">
                    {KEYWORD_WORD_2.map((char, idx) => {
                      const slotIdx = idx + KEYWORD_WORD_1.length;
                      const placed = placedKeywordSlots.has(slotIdx);
                      const isDragOver = dragOverSlotIdx === slotIdx && !placed;
                      return (
                        <button
                          key={`w2-${slotIdx}`}
                          type="button"
                          onClick={() => setActiveKeywordSlot(slotIdx)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (!placed) setDragOverSlotIdx(slotIdx);
                          }}
                          onDragLeave={() => setDragOverSlotIdx((prev) => (prev === slotIdx ? null : prev))}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverSlotIdx(null);
                            const rawIdx = e.dataTransfer.getData('text/plain');
                            const tileIdx = rawIdx !== '' ? Number(rawIdx) : draggedTileIdx;
                            if (tileIdx !== null && !Number.isNaN(tileIdx)) {
                              handlePlaceLetter(tileIdx, slotIdx);
                            }
                            setDraggedTileIdx(null);
                          }}
                          className={`w-8 h-10 rounded-lg border-2 font-black text-sm flex flex-col items-center justify-center cursor-pointer transition-all ${placed
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : isDragOver
                              ? 'bg-amber-200 text-orange-900 border-orange-500 scale-110 ring-2 ring-orange-400'
                              : activeKeywordSlot === slotIdx
                                ? 'bg-orange-100 text-orange-700 border-orange-500 ring-2 ring-orange-400/40'
                                : 'bg-white text-indigo-300 border-indigo-200'
                            }`}
                        >
                          <span>{placed ? char : '?'}</span>
                          <span className="text-[8px] opacity-75">{slotIdx + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {unlockedPoolTileIndices.length > 0 && !isKeywordComplete && (
                  <div className="bg-white/90 border border-indigo-200/80 rounded-xl p-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-black text-indigo-900 mr-1">
                      🧲 Kho chữ cái đã nhận (kéo thả lên ô &ldquo;?&rdquo;):
                    </span>
                    {unlockedPoolTileIndices.map((slotIdx) => {
                      const used = usedTileIndices.has(slotIdx);
                      return (
                        <button
                          key={`pool-${slotIdx}`}
                          type="button"
                          draggable={!used}
                          disabled={used}
                          onDragStart={(e) => {
                            setDraggedTileIdx(slotIdx);
                            e.dataTransfer.setData('text/plain', String(slotIdx));
                          }}
                          onDragEnd={() => {
                            setDraggedTileIdx(null);
                            setDragOverSlotIdx(null);
                          }}
                          onClick={() => handlePlaceLetter(slotIdx, activeKeywordSlot)}
                          className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center transition-all ${used
                            ? 'bg-slate-100 text-slate-400 line-through cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs cursor-grab active:cursor-grabbing hover:scale-105'
                            }`}
                          title={used ? 'Đã ghép' : 'Kéo thả vào ô từ khóa hoặc bấm để điền'}
                        >
                          {FULL_KEYWORD_LETTERS[slotIdx]}
                        </button>
                      );
                    })}
                  </div>
                )}

                {isKeywordComplete && (
                  <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-400 rounded-2xl p-4 flex flex-col gap-2 text-indigo-950 shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="flex flex-wrap items-center gap-2">
                      <Award className="w-6 h-6 text-orange-500 shrink-0" />
                      <span className="text-sm md:text-base font-black text-emerald-800">
                        🎉 CHÚC MỪNG! EM ĐÃ GIẢI MÃ THÀNH CÔNG TỪ KHÓA:
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm md:text-lg font-black">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500 text-white">
                        GREEN (Xanh / Sinh thái)
                      </span>
                      <span className="text-indigo-400">+</span>
                      <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white">
                        NEWSPAPER (Giấy báo / Ấn phẩm)
                      </span>
                      <span className="text-orange-500">➔</span>
                      <span className="px-3.5 py-1 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                        📰 GREEN NEWSPAPER (BÁO XANH / GIẤY TÁI SINH)
                      </span>
                    </div>
                    <div className="bg-white/90 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs md:text-sm font-bold text-indigo-950">
                      🇬🇧 <strong>Example:</strong> &ldquo;Students reuse old cellulose paper to create creative products from <span className="text-emerald-700 underline">green newspaper</span>.&rdquo;
                      <span className="block text-[11px] md:text-xs font-medium text-indigo-900/70 mt-0.5">
                        (Học sinh tái sử dụng giấy chứa cellulose cũ để sáng tạo các sản phẩm từ giấy báo xanh thân thiện môi trường.)
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-indigo-950/85 leading-relaxed">
                      💡 <strong>Ý nghĩa:</strong> <em>Green Newspaper (Báo xanh / Giấy báo tái sinh)</em> gắn liền với hành trình biến giấy báo cũ giàu <strong>Cellulose</strong> và hồ dán từ <strong>Tinh bột</strong> thành những sản phẩm xanh, truyền thông điệp bảo vệ môi trường &ldquo;Bắt đầu từ sự kết thúc&rdquo;!
                    </p>
                  </div>
                )}
              </div>

              {clueFeedback && (
                <div
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${clueFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-orange-50 border-orange-300 text-orange-900'
                    }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>{clueFeedback.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CROSSWORD_CLUES.map((clue) => {
                  const unlocked = unlockedClueIds.has(clue.id);
                  const solved = solvedClueIds.has(clue.id);
                  if (!unlocked) {
                    return (
                      <button
                        key={clue.id}
                        type="button"
                        onClick={() => setUnlockedClueIds((prev) => new Set(prev).add(clue.id))}
                        className="rounded-2xl p-3.5 bg-indigo-50/50 hover:bg-white border-2 border-dashed border-indigo-200 hover:border-orange-400 flex items-center justify-between gap-3 cursor-pointer text-left"
                      >
                        <span className="text-xs font-black text-indigo-950">
                          🔒 Thử thách {clue.rowNumber} {clue.rowNumber >= 5 ? '(English) ' : ''}({clue.unlockedSlots.length} chữ cái)
                        </span>
                        <span className="px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-xs">
                          Mở
                        </span>
                      </button>
                    );
                  }

                  return (
                    <div
                      key={clue.id}
                      className={`rounded-2xl p-3.5 border-2 flex flex-col justify-between gap-2.5 ${solved ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-indigo-100'
                        }`}
                    >
                      <p className="text-xs font-bold text-indigo-950">
                        <span className="text-orange-600 font-black">Thử thách {clue.rowNumber}: </span>
                        {clue.question}
                      </p>

                      {solved ? (
                        <div className="flex items-center justify-between flex-wrap gap-1.5 bg-white p-2 rounded-xl border border-emerald-200">
                          <span className="text-xs font-black text-emerald-700">✓ {clue.answerDisplay}</span>
                          <div className="flex flex-wrap gap-1">
                            {clue.scrambledSlotOrder.map((slotIdx) => {
                              const used = usedTileIndices.has(slotIdx);
                              return (
                                <button
                                  key={`t-${slotIdx}`}
                                  type="button"
                                  draggable={!used}
                                  disabled={used}
                                  onDragStart={(e) => {
                                    setDraggedTileIdx(slotIdx);
                                    e.dataTransfer.setData('text/plain', String(slotIdx));
                                  }}
                                  onDragEnd={() => {
                                    setDraggedTileIdx(null);
                                    setDragOverSlotIdx(null);
                                  }}
                                  onClick={() => handlePlaceLetter(slotIdx, activeKeywordSlot)}
                                  className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center transition-all ${used
                                    ? 'bg-slate-100 text-slate-400 line-through cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs cursor-grab active:cursor-grabbing hover:scale-105'
                                    }`}
                                  title={used ? 'Đã ghép' : 'Kéo chữ cái này thả vào ô từ khóa'}
                                >
                                  {FULL_KEYWORD_LETTERS[slotIdx]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={clueInputs[clue.id] || ''}
                            onChange={(e) => setClueInputs((prev) => ({ ...prev, [clue.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheckClue(clue)}
                            placeholder={clue.hint}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs font-bold focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleCheckClue(clue)}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs cursor-pointer"
                          >
                            Gửi
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </LockedTaskBox>

            <div className="bg-white/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-4 text-xs font-bold">
                <span className={padletConfirmed ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {padletConfirmed ? '✅' : '⏳'} 1. Lập nhóm Padlet
                </span>
                <span className={isKeywordComplete ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {isKeywordComplete ? '✅' : '⏳'} 2. Ô chữ (22/22)
                </span>
              </div>
              <button
                type="button"
                onClick={() => switchStage('stage-2')}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${isStageUnlocked('stage-2')
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                  : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                  }`}
              >
                {isStageUnlocked('stage-2') ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 2: Kiến thức nền (Tự học tại nhà)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            CHẶNG 2: KIẾN THỨC NỀN (TỰ HỌC TẠI NHÀ THEO THỨ TỰ BÀI HỌC I -> II -> III)
           ============================================================ */}
        {activeStage === 'stage-2' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {renderStageGuideBanner('stage-2')}

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
                          src="/images/hinh-30-1-quang-hop.jpg"
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
                          src="/images/hinh-30-1-quang-hop.jpg"
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

            {/* PHẦN V: VẬN DỤNG KIẾN THỨC & MỞ RỘNG THỰC TIỄN (MỞ KHI XONG PHẦN IV HOẶC CHẾ ĐỘ GV) */}
            {!isPart4Done && !isTeacherMode ? (
              <div className="rounded-3xl bg-white/60 border-2 border-dashed border-slate-300 p-4 md:p-5 flex items-center justify-between gap-3 text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-600">Chặng 2 • Phần V (Đang khóa)</span>
                    <h3 className="text-sm font-black text-indigo-950/70">
                      V – Vận dụng kiến thức &amp; Mở rộng thực tiễn (Giải quyết câu hỏi thực tiễn &amp; Liên hệ gia đình)
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
                badgeText="Chặng 2 • Phần V"
                title="V – Vận dụng kiến thức & Mở rộng thực tiễn (Câu hỏi vận dụng ❓ 1, ❓ 2 & Liên hệ thực tiễn)"
                emoji="💡"
                isUnlocked={unlockedTaskIds.has('task-s2-part5')}
                isCompleted={isPart5Done}
                onUnlock={unlockTask}
                onLock={lockTask}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-2.5">
                    <div className="text-xs md:text-sm font-black text-indigo-950">
                      ❓ 1. Nêu một số ứng dụng của tinh bột và cellulose trong đời sống và sản xuất.
                    </div>
                    <textarea
                      rows={3}
                      value={ansQ1}
                      onChange={(e) => setAnsQ1(e.target.value)}
                      placeholder="Nhập câu trả lời của em..."
                      className="w-full rounded-xl bg-white border border-indigo-200 p-2.5 text-xs font-medium focus:outline-none focus:border-orange-500 resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSampleQ1((v) => !v)}
                      className="w-fit px-3.5 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer"
                    >
                      {showSampleQ1 ? 'Ẩn gợi ý đáp án' : 'Xem gợi ý đáp án'}
                    </button>
                    {showSampleQ1 && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-indigo-950 font-medium leading-relaxed">
                        • <strong>Tinh bột:</strong> Là nguồn dinh dưỡng chính của con người (gạo, bột mì, ngô); trong công nghiệp dùng sản xuất hồ dán, ethylic alcohol và một số hóa chất khác.
                        <br />• <strong>Cellulose:</strong> Sản xuất giấy và tơ sợi; dùng dưới dạng gỗ tự nhiên/công nghiệp làm vật liệu xây dựng, đồ gia dụng; nguyên liệu tổng hợp ethylic alcohol,...
                      </div>
                    )}
                  </div>

                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-2.5">
                    <div className="text-xs md:text-sm font-black text-indigo-950">
                      ❓ 2. Kể tên một số lương thực, thực phẩm giàu tinh bột và cho biết cách sử dụng hợp lí tinh bột trong khẩu phần ăn hằng ngày.
                    </div>
                    <textarea
                      rows={3}
                      value={ansQ2}
                      onChange={(e) => setAnsQ2(e.target.value)}
                      placeholder="Nhập câu trả lời của em..."
                      className="w-full rounded-xl bg-white border border-indigo-200 p-2.5 text-xs font-medium focus:outline-none focus:border-orange-500 resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSampleQ2((v) => !v)}
                      className="w-fit px-3.5 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer"
                    >
                      {showSampleQ2 ? 'Ẩn gợi ý đáp án' : 'Xem gợi ý đáp án'}
                    </button>
                    {showSampleQ2 && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-indigo-950 font-medium leading-relaxed">
                        • <strong>Thực phẩm giàu tinh bột:</strong> Gạo, bột mì (bánh mì, mì sợi), ngô (bắp), khoai lang, khoai tây, sắn,...
                        <br />• <strong>Cách sử dụng hợp lí:</strong> Ăn lượng vừa đủ theo nhu cầu năng lượng, kết hợp cân đối với rau xanh (bổ sung cellulose/chất xơ), chất đạm, chất béo và ưu tiên ngũ cốc nguyên hạt.
                      </div>
                    )}
                  </div>
                </div>

                {/* Khảo sát nhanh sản phẩm chứa Tinh bột & Cellulose trong gia đình */}
                <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-4 flex flex-col gap-3 mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs md:text-sm font-black text-indigo-950">
                      🏠 Liên hệ thực tế: Đánh dấu ít nhất 2 sản phẩm chứa Tinh bột / Cellulose có trong gia đình em ({checkedHomeItems.size}/4):
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {[
                      { id: 'home-food', emoji: '🍚', title: 'Thực phẩm (Gạo, bún, bánh mì, ngô)', sub: 'Chứa nhiều Tinh bột' },
                      { id: 'home-clothes', emoji: '👕', title: 'Quần áo vải sợi bông (Cotton)', sub: 'Chứa sợi Cellulose tự nhiên' },
                      { id: 'home-books', emoji: '📚', title: 'Sách vở, giấy viết, thùng carton', sub: 'Sản xuất từ Cellulose' },
                      { id: 'home-wood', emoji: '🪑', title: 'Bàn ghế gỗ, tủ gỗ gia dụng', sub: 'Vật liệu gỗ giàu Cellulose' },
                    ].map((hItem) => {
                      const checked = checkedHomeItems.has(hItem.id);
                      return (
                        <button
                          key={hItem.id}
                          type="button"
                          onClick={() => toggleSetItem(setCheckedHomeItems, hItem.id)}
                          className={`p-3 rounded-xl border-2 text-left flex items-start gap-2.5 cursor-pointer transition-all ${checked
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
                            <span className="text-[11px] font-bold text-orange-700">{hItem.sub}</span>
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
                          onClick={() => switchStage('stage-3')}
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
                onClick={() => switchStage('stage-3')}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${isStageUnlocked('stage-3')
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                  }`}
              >
                {isStageUnlocked('stage-3') ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 3: Ý tưởng &amp; Quy trình (Tại lớp)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            CHẶNG 3: XÂY DỰNG Ý TƯỞNG & QUY TRÌNH THỰC HIỆN (TẠI LỚP)
           ============================================================ */}
        {activeStage === 'stage-3' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {renderStageGuideBanner('stage-3')}
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
                onClick={() => switchStage('stage-4')}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${isStageUnlocked('stage-4')
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                  : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                  }`}
              >
                {isStageUnlocked('stage-4') ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 4: Hoàn thiện sản phẩm (Tại nhà)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            CHẶNG 4: HOÀN THIỆN SẢN PHẨM (TẠI NHÀ)
           ============================================================ */}
        {activeStage === 'stage-4' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {renderStageGuideBanner('stage-4')}
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

            <div className="bg-white/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3 text-xs font-bold">
                <span className={homeChecks.size === 3 ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {homeChecks.size === 3 ? '✅' : '⏳'} Ô 4.1: Hoàn thành {homeChecks.size}/3 bước tại nhà
                </span>
                <span className={productSubmitted ? 'text-emerald-700' : 'text-indigo-900/60'}>
                  {productSubmitted ? '✅' : '⏳'} Ô 4.2: Nộp minh chứng Padlet
                </span>
              </div>
              <button
                type="button"
                onClick={() => switchStage('stage-5')}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${isStageUnlocked('stage-5')
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                  }`}
              >
                {isStageUnlocked('stage-5') ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 5: Ngày hội xanh (Báo cáo tại lớp)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {/* ============================================================
            CHẶNG 5: NGÀY HỘI XANH (BÁO CÁO SẢN PHẨM TẠI LỚP)
           ============================================================ */}
        {activeStage === 'stage-5' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {renderStageGuideBanner('stage-5')}
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
              title="5.2. Nộp Bài thuyết trình của nhóm lên Google Drive (Slide / Canva / Video / Song ngữ)"
              emoji="🎤"
              isUnlocked={unlockedTaskIds.has('task-s5-presentation')}
              isCompleted={stage5PresentationSubmitted}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                    📊
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-black text-indigo-950">
                      Nộp Bài thuyết trình Ngày hội xanh — Thư mục Google Drive Chặng 5.2
                    </div>
                    <p className="text-[11px] font-medium text-indigo-900/75">
                      Học sinh nộp bài báo cáo thuyết trình của nhóm (PowerPoint, Canva, PDF hoặc Video thuyết trình, khuyến khích Tiếng Anh) vào thư mục Google Drive tại đây.
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
                    <span>Mở Google Drive nộp Bài thuyết trình</span>
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
                        ? '✓ Đã nộp Bài thuyết trình lên Drive'
                        : 'Xác nhận đã nộp Bài thuyết trình'}
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
                onClick={() => switchStage('stage-6')}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${
                  isStageUnlocked('stage-6')
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                }`}
              >
                {isStageUnlocked('stage-6') ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 6: Tổng kết dự án</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            CHẶNG 6: TỔNG KẾT DỰ ÁN
           ============================================================ */}
        {activeStage === 'stage-6' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {renderStageGuideBanner('stage-6')}
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
{/* THANH ĐIỀU HƯỚNG CHẾ ĐỘ & TIỆN ÍCH SMART TV */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/70 p-2 rounded-2xl border border-indigo-100 mb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStage6GameMode('pose_game')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      stage6GameMode === 'pose_game'
                        ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                        : 'bg-white text-indigo-900 hover:bg-indigo-100'
                    }`}
                  >
                    <span>🕺</span>
                    <span>Game Vận động Smart TV (Khuyên dùng)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage6GameMode('quiz')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      stage6GameMode === 'quiz'
                        ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                        : 'bg-white text-indigo-900 hover:bg-indigo-100'
                    }`}
                  >
                    <span>📝</span>
                    <span>Làm bài Trắc nghiệm cá nhân</span>
                  </button>
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
                </div>
              </div>

              {/* NỘI DUNG 1: TRÒ CHƠI VẬN ĐỘNG BODY POSE QUIZ TRÊN SMART TV */}
              {stage6GameMode === 'pose_game' ? (
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
              ) : (
                /* NỘI DUNG 2: BÀI TRẮC NGHIỆM TRUYỀN THỐNG CÁ NHÂN */
                <div className="flex flex-col gap-3">
                  {quizSubmitted && (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 px-4 py-2.5 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-500" />
                        <span className="text-xs md:text-sm font-black text-indigo-950">
                          Hoàn thành Dự án! Đúng {quizScore}/{QUIZ_QUESTIONS.length} câu ({Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)} điểm)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="px-3 py-1 rounded-full bg-white text-indigo-900 font-bold text-xs border border-indigo-200 cursor-pointer"
                      >
                        Làm lại
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {QUIZ_QUESTIONS.map((q, qIdx) => {
                      const unlocked = unlockedQuizIds.has(q.id);
                      const selected = quizAnswers[q.id];

                      if (!unlocked) {
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setUnlockedQuizIds((prev) => new Set(prev).add(q.id))}
                            className="rounded-2xl p-3.5 bg-indigo-50/50 hover:bg-white border-2 border-dashed border-indigo-200 hover:border-orange-400 flex items-center justify-between gap-3 cursor-pointer text-left"
                          >
                            <span className="text-xs font-black text-indigo-950">
                              🔒 Câu {qIdx + 1} • {q.tag}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-xs">
                              Mở
                            </span>
                          </button>
                        );
                      }

                      return (
                        <div
                          key={q.id}
                          className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5"
                        >
                          <h4 className="font-bold text-indigo-950 text-xs">
                            <span className="text-orange-600 font-black">Câu {qIdx + 1}: </span>
                            {q.question}
                          </h4>

                          <div className="grid grid-cols-1 gap-1.5">
                            {q.options.map((opt, oIdx) => {
                              const isChosen = selected === oIdx;
                              const isCorrect = q.correctIndex === oIdx;
                              let style = 'bg-white border-indigo-100 text-indigo-950 hover:border-orange-300';
                              if (quizSubmitted) {
                                if (isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                                else if (isChosen) style = 'bg-rose-50 border-rose-400 text-rose-950';
                              } else if (isChosen) {
                                style = 'bg-orange-50 border-orange-500 text-indigo-950';
                              }

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                                  className={`p-2 rounded-xl border text-left text-xs font-bold flex items-center gap-2 cursor-pointer ${style}`}
                                >
                                  <span className="font-black text-orange-600">
                                    {['A.', 'B.', 'C.', 'D.'][oIdx]}
                                  </span>
                                  <span className="flex-1">{opt}</span>
                                  {quizSubmitted && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                  {quizSubmitted && isChosen && !isCorrect && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleQuizSubmit}
                        className="px-6 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                                                <Play className="w-3.5 h-3.5 fill-white" />
                        <span>NỘP BÀI &amp; HOÀN THÀNH DỰ ÁN</span>
                      </button>
                    </div>
                  )}
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

                      {/* BẢNG RUBRIC 4 TIÊU CHÍ */}
                      <div className="overflow-x-auto rounded-2xl border border-indigo-200 bg-white shadow-sm">
                        <table className="w-full min-w-225 text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-linear-to-r from-emerald-900 to-teal-900 text-white font-black text-[11px]">
                              <th className="p-3 w-45 border-r border-emerald-700/60 uppercase">
                                Tiêu chí tự đánh giá<br />
                                <span className="text-[10px] font-normal text-emerald-200">(Trọng số • Điểm tối đa)</span>
                              </th>
                              <th className="p-3 w-37 border-r border-emerald-700/60 text-center bg-rose-900/60">
                                MỨC 1 (20%)<br />
                                <span className="text-[10px] font-bold text-rose-200">CẦN CỐ GẮNG</span>
                              </th>
                              <th className="p-3 w-37 border-r border-emerald-700/60 text-center bg-amber-900/60">
                                MỨC 2 (40%)<br />
                                <span className="text-[10px] font-bold text-amber-200">ĐẠT</span>
                              </th>
                              <th className="p-3 w-37 border-r border-emerald-700/60 text-center bg-sky-900/60">
                                MỨC 3 (60%)<br />
                                <span className="text-[10px] font-bold text-sky-200">KHÁ</span>
                              </th>
                              <th className="p-3 w-37 border-r border-emerald-700/60 text-center bg-indigo-900/60">
                                MỨC 4 (80%)<br />
                                <span className="text-[10px] font-bold text-indigo-200">TỐT</span>
                              </th>
                              <th className="p-3 w-37 border-r border-emerald-700/60 text-center bg-emerald-800/80">
                                MỨC 5 (100%)<br />
                                <span className="text-[10px] font-bold text-emerald-200">XUẤT SẮC</span>
                              </th>
                              <th className="p-3 w-22 text-center bg-orange-600 text-white uppercase">
                                Tự chấm
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-100">
                            {STAGE6_SELF_RUBRIC_CRITERIA.map((criterion, idx) => {
                              const curScore = stage6SelfScores[criterion.id];
                              return (
                                <tr key={criterion.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                  <td className="p-3 border-r border-indigo-100 align-top">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 mb-1">
                                      {criterion.badge}
                                    </span>
                                    <div className="font-extrabold text-indigo-950 text-xs leading-tight mb-1">
                                      {criterion.code}. {criterion.title}
                                    </div>
                                    <div className="text-[11px] font-bold text-emerald-700">
                                      {criterion.weightText}
                                    </div>
                                  </td>

                                  {criterion.levels.map((lv) => {
                                    const isSelected = curScore === lv.points;
                                    return (
                                      <td
                                        key={lv.level}
                                        onClick={() =>
                                          setStage6SelfScores((prev) => ({
                                            ...prev,
                                            [criterion.id]: lv.points,
                                          }))
                                        }
                                        className={`p-2.5 border-r border-indigo-100 align-top cursor-pointer transition-all text-[11px] leading-relaxed relative ${
                                          isSelected
                                            ? 'bg-emerald-100/90 font-bold text-emerald-950 ring-2 ring-emerald-500 ring-inset shadow-xs'
                                            : 'hover:bg-indigo-50/60 text-slate-700'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${
                                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                          }`}>
                                            {lv.points} điểm
                                          </span>
                                          {isSelected && (
                                            <span className="text-[10px] font-black text-emerald-700">✓ Chọn</span>
                                          )}
                                        </div>
                                        <div>{lv.text}</div>
                                      </td>
                                    );
                                  })}

                                  <td className="p-3 text-center align-middle bg-indigo-50/40">
                                    <div className="text-base font-black text-emerald-700">
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
                            <tr className="bg-emerald-950 text-white border-t-2 border-emerald-800">
                              <td colSpan={6} className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-xs md:text-sm font-black uppercase text-amber-300">
                                    TỔNG ĐIỂM TỰ ĐÁNH GIÁ CỦA CÁ NHÂN (100%):
                                  </span>
                                  <span className={`px-3 py-0.5 rounded-full text-xs font-black ${rankInfo.colorClass}`}>
                                    {rankInfo.badge}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 bg-orange-600 text-center">
                                <div className="text-lg md:text-xl font-black text-white">{totalSelfScore}</div>
                                <div className="text-[10px] font-bold text-amber-100">/ 10.0 điểm</div>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
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

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setStage6SelfSubmitted(true);
                                confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                                alert('✓ Em đã hoàn thành và lưu phiếu Tự đánh giá cá nhân thành công!');
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

                        {/* BẢNG 4 TIÊU CHÍ ĐÁNH GIÁ ĐÓNG GÓP CÁ NHÂN */}
                        <div className="overflow-x-auto rounded-2xl border border-indigo-200 bg-white shadow-2xs">
                          <table className="w-full min-w-225 text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-linear-to-r from-amber-900 to-orange-900 text-white font-black text-[11px]">
                                <th className="p-3 w-45 border-r border-amber-700/60 uppercase">
                                  Tiêu chí đánh giá<br />
                                  <span className="text-[10px] font-normal text-amber-200">(Trọng số • Điểm tối đa)</span>
                                </th>
                                <th className="p-3 w-37 border-r border-amber-700/60 text-center bg-rose-900/60">
                                  MỨC 1 (20%)<br />
                                  <span className="text-[10px] font-bold text-rose-200">CẦN CỐ GẮNG</span>
                                </th>
                                <th className="p-3 w-37 border-r border-amber-700/60 text-center bg-amber-900/60">
                                  MỨC 2 (40%)<br />
                                  <span className="text-[10px] font-bold text-amber-200">ĐẠT</span>
                                </th>
                                <th className="p-3 w-37 border-r border-amber-700/60 text-center bg-sky-900/60">
                                  MỨC 3 (60%)<br />
                                  <span className="text-[10px] font-bold text-sky-200">KHÁ</span>
                                </th>
                                <th className="p-3 w-37 border-r border-amber-700/60 text-center bg-indigo-900/60">
                                  MỨC 4 (80%)<br />
                                  <span className="text-[10px] font-bold text-indigo-200">TỐT</span>
                                </th>
                                <th className="p-3 w-37 border-r border-amber-700/60 text-center bg-emerald-800/80">
                                  MỨC 5 (100%)<br />
                                  <span className="text-[10px] font-bold text-emerald-200">XUẤT SẮC</span>
                                </th>
                                <th className="p-3 w-22 text-center bg-orange-600 text-white uppercase">
                                  Điểm
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-100">
                              {STAGE6_LEADER_RUBRIC_CRITERIA.map((criterion, idx) => {
                                const curScore = currentMember.scores[criterion.id];
                                return (
                                  <tr key={criterion.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                    <td className="p-3 border-r border-indigo-100 align-top">
                                      <div className="font-extrabold text-indigo-950 text-xs leading-tight mb-1">
                                        {criterion.code}. {criterion.title}
                                      </div>
                                      <div className="text-[11px] font-bold text-amber-700">
                                        {criterion.weightText}
                                      </div>
                                    </td>

                                    {criterion.levels.map((lv) => {
                                      const isSelected = curScore === lv.points;
                                      return (
                                        <td
                                          key={lv.level}
                                          onClick={() => {
                                            setStage6Members((prev) =>
                                              prev.map((m) =>
                                                m.id === currentMember.id
                                                  ? { ...m, scores: { ...m.scores, [criterion.id]: lv.points } }
                                                  : m
                                              )
                                            );
                                          }}
                                          className={`p-2.5 border-r border-indigo-100 align-top cursor-pointer transition-all text-[11px] leading-relaxed relative ${
                                            isSelected
                                              ? 'bg-amber-100/90 font-bold text-amber-950 ring-2 ring-amber-500 ring-inset shadow-xs'
                                              : 'hover:bg-amber-50/50 text-slate-700'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${
                                              isSelected ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                                            }`}>
                                              {lv.points} điểm
                                            </span>
                                            {isSelected && (
                                              <span className="text-[10px] font-black text-amber-700">✓ Chọn</span>
                                            )}
                                          </div>
                                          <div>{lv.text}</div>
                                        </td>
                                      );
                                    })}

                                    <td className="p-3 text-center align-middle bg-amber-50/30">
                                      <div className="text-base font-black text-amber-700">
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
                          </table>
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

                          <button
                            type="button"
                            onClick={() => {
                              setStage6LeaderSubmitted(true);
                              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                              alert('✓ Nhóm trưởng đã nộp bảng đánh giá các thành viên thành công!');
                            }}
                            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{stage6LeaderSubmitted ? '✓ Đã nộp bảng đánh giá Nhóm trưởng' : 'Nộp bảng đánh giá của Nhóm trưởng'}</span>
                          </button>
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

                  return (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                      {/* HEADER CHÍNH THỨC TRƯỜNG THCS NGÔ CHÍ QUỐC */}
                      <div className="bg-linear-to-r from-indigo-950 via-purple-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-600/50 shadow-md">
                        <div className="text-center flex flex-col gap-1 pb-3 border-b border-indigo-800/60">
                          <h3 className="text-xs md:text-sm font-black uppercase text-amber-300 tracking-wider">
                            PHIẾU ĐÁNH GIÁ TỔNG HỢP QUÁ TRÌNH &amp; SẢN PHẨM DỰ ÁN STEM (DÀNH CHO GIÁO VIÊN)
                          </h3>
                          <h2 className="text-sm md:text-base font-black text-white uppercase">
                            DỰ ÁN: &ldquo;BẮT ĐẦU TỪ SỰ KẾT THÚC&rdquo; — CHỦ ĐỀ: TINH BỘT &amp; CELLULOSE (KHTN 9)
                          </h2>
                          <div className="text-[11px] text-slate-300 italic">
                            Thang đo Analytical Rubric 5 mức • Thang điểm 10 (100%) | Chuẩn hóa theo Hướng dẫn thiết kế &amp; sử dụng Rubric (PGS.TS Lê Văn Hảo - HUIT ver 1.0)
                          </div>
                          <div className="text-[10px] text-indigo-300 font-bold">
                            7 Tiêu chí xuyên suốt dự án: Padlet (10%) – Ý tưởng xanh (15%) – Quy trình &amp; An toàn (15%) – Sản phẩm tái sinh (20%) – Poster (15%) – Video tổng kết (15%) – Thuyết trình (10%)
                          </div>
                        </div>

                        {/* 4 Ô THÔNG TIN HÀNH CHÍNH */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 text-xs">
                          <div>
                            <span className="text-[11px] text-indigo-300 font-bold block mb-0.5">Đơn vị:</span>
                            <span className="font-extrabold text-white">Trường THCS Ngô Chí Quốc — Tổ KHTN</span>
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
                            Giáo viên ký nhận: <strong>{stage6TeacherName}</strong> (Tổ KHTN — THCS Ngô Chí Quốc)
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setStage6TeacherSubmitted(true);
                                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                                alert('✓ Thầy/Cô đã hoàn tất và nộp Phiếu đánh giá dự án STEM thành công!');
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
    </div>
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

      {/* HỘP THOẠI TỪ VỰNG TIẾNG ANH KHOA HỌC TỰ NHIÊN (NEW WORDS & AUDIO PRONUNCIATION) */}
      {showNewWordsModal && (
        <div
          onClick={() => {
            window.speechSynthesis?.cancel();
            setSpeakingWordId(null);
            setShowNewWordsModal(false);
          }}
          className="fixed inset-0 z-50 bg-indigo-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-50 border-2 border-indigo-100 rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header Modal New Words */}
            <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black text-xl shadow-xs">
                  🇬🇧
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black uppercase tracking-wide text-amber-300">
                    NEW WORDS — TỪ VỰNG TIẾNG ANH KHOA HỌC TỰ NHIÊN (BÀI 30)
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    12 thuật ngữ cốt lõi theo chuẩn danh pháp Hóa học &amp; Sinh học quốc tế (GDPT 2018) • Bấm 🔊 để nghe phát âm
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setSpeakingWordId(null);
                  setShowNewWordsModal(false);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Thanh lọc chủ đề từ vựng */}
            <div className="bg-white border-b border-indigo-100 px-5 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ALL', label: `📚 Tất cả (${SCIENCE_NEW_WORDS.length} từ)` },
                  { id: 'Hóa học & Phân tử', label: '🧬 Hóa học & Phân tử' },
                  { id: 'Sinh học & Phản ứng', label: '🔬 Sinh học & Phản ứng' },
                  { id: 'Dự án STEAM Xanh', label: '🌱 Dự án STEAM Xanh' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNewWordsCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                      newWordsCategoryFilter === cat.id
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-emerald-50 text-indigo-950'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                💡 Hỗ trợ phát âm trực tiếp trên Smart TV &amp; Máy tính (không cần mạng)
              </span>
            </div>

            {/* Danh sách thẻ từ vựng song ngữ */}
            <div className="p-4 md:p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {SCIENCE_NEW_WORDS.filter(
                (w) => newWordsCategoryFilter === 'ALL' || w.category === newWordsCategoryFilter
              ).map((word) => {
                const isSpeakingTerm = speakingWordId === word.id;
                const isSpeakingExample = speakingWordId === `${word.id}-ex`;
                return (
                  <div
                    key={word.id}
                    className="bg-white rounded-2xl border-2 border-indigo-100 hover:border-emerald-400 p-4 shadow-2xs flex flex-col justify-between gap-3 transition-all"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                            {word.emoji}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base md:text-lg font-black text-indigo-950">
                                {word.term}
                              </span>
                              <span className="text-xs font-bold text-emerald-700 font-mono">
                                {word.ipa}
                              </span>
                              <span className="text-[11px] font-bold text-slate-400 italic">
                                {word.partOfSpeech}
                              </span>
                              {word.formula && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px]">
                                  {word.formula}
                                </span>
                              )}
                            </div>
                            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-500 mt-0.5">
                              {word.category}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => speakEnglishText(word.id, word.term)}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                            isSpeakingTerm
                              ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                          }`}
                          title={`Nghe phát âm từ ${word.term}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeakingTerm ? 'Đang đọc...' : 'Phát âm'}</span>
                        </button>
                      </div>

                      <p className="text-xs text-indigo-950 font-bold leading-relaxed bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5">
                        🇻🇳 {word.meaningVi}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-indigo-900 leading-snug">
                          🇬🇧 <em>&ldquo;{word.exampleEn}&rdquo;</em>
                        </p>
                        <button
                          type="button"
                          onClick={() => speakEnglishText(`${word.id}-ex`, word.exampleEn)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shrink-0 cursor-pointer transition-all ${
                            isSpeakingExample
                              ? 'bg-amber-500 text-white'
                              : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                          title="Nghe đọc câu ví dụ tiếng Anh"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Đọc câu</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        ➔ {word.exampleVi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HỘP THOẠI TÀI LIỆU THAM KHẢO & NGUỒN HỌC LIỆU DỰ ÁN */}
      {showReferencesModal && (
    <div
      onClick={() => setShowReferencesModal(false)}
      className="fixed inset-0 z-50 bg-indigo-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-2 border-indigo-100 rounded-3xl max-w-4xl w-full max-h-[88vh] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="bg-linear-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black uppercase tracking-wide text-amber-300">
                📚 TÀI LIỆU THAM KHẢO &amp; NGUỒN HỌC LIỆU DỰ ÁN
              </h3>
              <p className="text-xs text-indigo-200 font-medium">
                Dự án STEAM: &ldquo;Bắt đầu từ sự kết thúc&rdquo; — Bài 30: Tinh bột và Cellulose (Môn KHTN 9)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowReferencesModal(false)}
            className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black cursor-pointer"
          >
            ✕ Đóng
          </button>
        </div>

        <div className="p-5 md:p-6 overflow-y-auto space-y-4 text-xs md:text-sm text-indigo-950 leading-relaxed">
          {/* Nhóm 1 */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-indigo-900 uppercase text-xs flex items-center gap-1.5">
              <span>1. Văn bản chỉ đạo &amp; Chương trình Giáo dục phổ thông</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li>
                <strong>Bộ Giáo dục và Đào tạo (2018)</strong>, <em>Chương trình Giáo dục phổ thông môn Khoa học tự nhiên</em> (Ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018).
              </li>
              <li>
                <strong>Bộ Giáo dục và Đào tạo (2020)</strong>, <em>Công văn số 3089/BGDĐT-GDTrH ngày 14/8/2020 về việc triển khai thực hiện giáo dục STEM trong giáo dục trung học</em>.
              </li>
              <li>
                <strong>Bộ Giáo dục và Đào tạo (2021)</strong>, <em>Thông tư số 22/2021/TT-BGDĐT ngày 20/7/2021 quy định về đánh giá học sinh trung học cơ sở và học sinh trung học phổ thông</em>.
              </li>
            </ul>
          </div>

          {/* Nhóm 2 */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-emerald-900 uppercase text-xs flex items-center gap-1.5">
                  <span>2. Sách giáo khoa &amp; Tài liệu chuyên môn Hóa học – Sinh học</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>
                    <strong>Sách giáo khoa &amp; Sách giáo viên Khoa học tự nhiên 9</strong> (Bộ sách Chân trời sáng tạo / Kết nối tri thức với cuộc sống / Cánh diều) — Chủ đề Carbohydrate: <em>Tinh bột và Cellulose</em>, NXB Giáo dục Việt Nam.
                  </li>
                  <li>
                    <strong>Anastas, P. T., &amp; Warner, J. C.</strong> (1998). <em>Green Chemistry: Theory and Practice</em>. Oxford University Press.
                  </li>
                </ul>
          </div>

          {/* Nhóm 3 */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-amber-900 uppercase text-xs flex items-center gap-1.5">
              <span>3. Tài liệu Phương pháp Dạy học Dự án &amp; Kiểm tra đánh giá</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li>
                <strong>Bộ Giáo dục và Đào tạo (2019)</strong>, <em>Tài liệu tập huấn Xây dựng tiêu chí đánh giá (Rubric) và dạy học dựa trên dự án (Project-Based Learning) môn Khoa học tự nhiên cấp THCS</em>.
              </li>
              <li>
                <strong>Cục Công nghệ thông tin — Bộ Giáo dục và Đào tạo</strong>, <em>Hướng dẫn thiết kế Thiết bị dạy học số và Bài giảng E-learning tương tác trong trường phổ thông</em>.
              </li>
            </ul>
          </div>

          {/* Nhóm 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-slate-800 uppercase text-xs flex items-center gap-1.5">
              <span>4. Công cụ số &amp; Hạ tầng công nghệ tích hợp trong bài giảng</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li>
                <strong>Mô phỏng &amp; Trò chơi tương tác:</strong> HTML5 Canvas 2D (Mô phỏng động học phân tử phản ứng thủy phân tinh bột &amp; phản ứng màu Iodine), Trò chơi vận động Smart TV, React 19, TypeScript &amp; Tailwind CSS.
              </li>
              <li>
                <strong>Không gian cộng tác &amp; Lưu trữ đám mây:</strong> Bảng tương tác số Padlet, Google Drive, Google Sheets Webhook &amp; Cơ sở dữ liệu thời gian thực Firebase Cloud Firestore.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

      {/* ============================================================
          NHÂN VẬT DẪN CHUYỆN HƯỚNG DẪN TỪNG CHẶNG (HIỆN LỚN GIỮA MÀN HÌNH -> TỰ ĐỘNG TẮT KHI GIỚI THIỆU XONG)
         ============================================================ */}
      {isNarratorExpanded && (
        <div className="fixed inset-0 z-40 bg-indigo-950/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300 overflow-hidden">
          <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
            <div className="w-85 sm:w-120 md:w-150 lg:w-170 h-75 sm:h-105 md:h-130 lg:h-155 shrink-0 flex items-center justify-center relative pointer-events-none">
              <video
                key={`narrator-full-${activeStage}`}
                src={NARRATOR_VIDEO_URL}
                autoPlay
                muted
                playsInline
                disablePictureInPicture
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration > 0 && v.currentTime >= v.duration - 0.25 && !STAGE_GUIDE_INFO[activeStage].audioUrl) {
                    setIsNarratorExpanded(false);
                  }
                }}
                onEnded={() => {
                  if (!STAGE_GUIDE_INFO[activeStage].audioUrl) {
                    setIsNarratorExpanded(false);
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
                  onEnded={() => setIsNarratorExpanded(false)}
                  className="w-full h-10 mt-1"
                />
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsNarratorExpanded(false);
                    setSelectedGuideStage(activeStage);
                    setShowStageGuideModal(true);
                  }}
                  className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>📖 Xem Hướng Dẫn Chi Tiết Từng Bước</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsNarratorExpanded(false)}
                  className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-orange-500 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <span>Đã hiểu • Bắt đầu làm bài</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          HỘP THOẠI HƯỚNG DẪN CHI TIẾT TỪNG CHẶNG (RICH DETAILED STAGE GUIDE MODAL)
         ============================================================ */}
      {showStageGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowStageGuideModal(false);
            }
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="max-w-4xl w-full bg-white border-2 border-indigo-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200">
            <div className="bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-900 p-4 md:p-6 text-white relative flex flex-wrap items-center justify-between gap-4 border-b border-indigo-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30 shrink-0">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40">
                      {STAGE_DETAILED_GUIDES[selectedGuideStage].step} • {STAGE_DETAILED_GUIDES[selectedGuideStage].place}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-300">
                      ⏱️ Thời lượng: {STAGE_DETAILED_GUIDES[selectedGuideStage].estimatedTime}
                    </span>
                  </div>
                  <h2 id="guide-modal-title" className="text-base md:text-xl font-black text-white mt-1">
                    📖 Hướng Dẫn Chi Tiết: {STAGE_DETAILED_GUIDES[selectedGuideStage].title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowStageGuideModal(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Đóng (phím Esc)"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-indigo-50/80 border-b border-indigo-100 px-4 py-2.5 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-xs font-black text-indigo-900/60 uppercase mr-1">Chuyển chặng:</span>
                {STAGES.map((st) => {
                  const isSelected = selectedGuideStage === st.id;
                  const isCurrent = activeStage === st.id;
                  const isDone = isStageCompleted(st.id);
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedGuideStage(st.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-xs'
                          : isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-indigo-900 border-indigo-200 hover:border-orange-300'
                      }`}
                    >
                      <span>{STAGE_DETAILED_GUIDES[st.id].emoji}</span>
                      <span>{st.step}</span>
                      {isCurrent && <span className="text-[10px] bg-white/30 px-1.5 py-0.2 rounded-full">Hiện tại</span>}
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              <div className="bg-indigo-50/70 border-2 border-indigo-200/80 rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-2 text-indigo-900 font-black text-sm uppercase tracking-wide mb-2">
                  <span className="text-base">🎯</span>
                  <h4>MỤC TIÊU CỐT LÕI CỦA CHẶNG</h4>
                </div>
                <p className="text-xs md:text-sm text-indigo-950 font-medium leading-relaxed">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].objective}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-900 font-black text-sm uppercase tracking-wide">
                  <span className="text-base">📋</span>
                  <h4>CÁC BƯỚC THỰC HIỆN CHI TIẾT (STEP-BY-STEP)</h4>
                </div>

                <div className="space-y-3">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].steps.map((s) => (
                    <div
                      key={s.number}
                      className="bg-white border-2 border-slate-200 hover:border-orange-300 rounded-2xl p-4 md:p-5 shadow-xs transition-all flex items-start gap-4"
                    >
                      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-500 to-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        {s.number}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h5 className="font-extrabold text-sm md:text-base text-indigo-950">
                            {s.title}
                          </h5>
                          {s.badge && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
                              {s.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                          {s.desc}
                        </p>
                        {s.actionHint && (
                          <div className="bg-amber-50/80 border border-amber-200 rounded-xl px-3 py-2 text-xs font-semibold text-amber-900 flex items-start gap-2 mt-2">
                            <span className="text-amber-600 shrink-0 mt-0.5">👉</span>
                            <span>{s.actionHint}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Bí quyết & Mẹo làm bài */}
              <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wide mb-2.5">
                  <span className="text-base">💡</span>
                  <h4>BÍ QUYẾT & LƯU Ý QUAN TRỌNG ĐẠT ĐIỂM CAO</h4>
                </div>
                <ul className="space-y-2 text-xs md:text-sm text-amber-950 font-medium">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].tips.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Tiêu chí hoàn thành chặng */}
              <div className="bg-emerald-50/70 border-2 border-emerald-300/80 rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-2 text-emerald-950 font-black text-sm uppercase tracking-wide mb-2.5">
                  <span className="text-base">✅</span>
                  <h4>ĐIỀU KIỆN ĐỂ HOÀN THÀNH CHẶNG NÀY</h4>
                </div>
                <div className="space-y-2 text-xs md:text-sm text-emerald-950 font-medium">
                  {STAGE_DETAILED_GUIDES[selectedGuideStage].completionCriteria.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-500">
                Chặng {selectedGuideStage.replace('stage-', '')}: {STAGE_DETAILED_GUIDES[selectedGuideStage].title}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowStageGuideModal(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isStageUnlocked(selectedGuideStage) || isTeacherMode) {
                      setActiveStage(selectedGuideStage);
                      setStageLockMessage(null);
                    }
                    setShowStageGuideModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Bắt đầu làm bài Chặng {selectedGuideStage.replace('stage-', '')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
