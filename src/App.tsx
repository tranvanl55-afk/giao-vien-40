import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';

import { ReviewModal } from './components/ReviewModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Login } from './components/Login';
import { categories, Category, SubCategory } from './data';
import { ArrowLeft, Play, Box, LogOut, ExternalLink, X, ChevronRight, Search, Maximize, Minimize, Atom } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

import { About } from './components/About';
import { Profile } from './components/Profile';
import { CommunityPage } from './components/CommunityPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AIAssistant } from './components/AIAssistant';
import { Leaderboard } from './components/Leaderboard';

import { Suspense, lazy } from 'react';
import { MultiplayerProvider } from './context/MultiplayerContext';
import { CatLoader } from './components/CatLoader';

// Helper for named exports
const lazyNamed = (factory: any, name: string) => lazy(() => factory().then((module: any) => ({ default: module[name] })));
const Lobby = lazyNamed(() => import('./components/games/Lobby'), 'Lobby');
const Room = lazyNamed(() => import('./components/games/Room'), 'Room');
const StarRaceGame = lazyNamed(() => import('./components/games/StarRaceGame'), 'StarRaceGame');

const CoNangSimulation = lazyNamed(() => import('./components/simulations/CoNangSimulation'), 'CoNangSimulation');
const CongSuatSimulation = lazyNamed(() => import('./components/simulations/CongSuatSimulation'), 'CongSuatSimulation');
const KhucXaSimulation = lazyNamed(() => import('./components/simulations/KhucXaSimulation'), 'KhucXaSimulation');
const MachDienSimulation = lazyNamed(() => import('./components/simulations/MachDienSimulation'), 'MachDienSimulation');
const CamUngSimulation = lazyNamed(() => import('./components/simulations/CamUngSimulation'), 'CamUngSimulation');
const DayKimLoaiSimulation = lazyNamed(() => import('./components/simulations/DayKimLoaiSimulation'), 'DayKimLoaiSimulation');
const HopChatHuuCoSimulation = lazyNamed(() => import('./components/simulations/HopChatHuuCoSimulation'), 'HopChatHuuCoSimulation');
const TaoDeKiemTraApp = lazyNamed(() => import('./components/simulations/TaoDeKiemTraApp'), 'TaoDeKiemTraApp');
const ActionQuizGame = lazyNamed(() => import('./components/simulations/ActionQuizGame'), 'ActionQuizGame');
const KhamPhaTheGioiGame = lazyNamed(() => import('./components/simulations/KhamPhaTheGioiGame'), 'KhamPhaTheGioiGame');
const PeriodicTableApp = lazyNamed(() => import('./components/simulations/PeriodicTableApp'), 'PeriodicTableApp');
const LienKetIonSimulation = lazyNamed(() => import('./components/simulations/LienKetIonSimulation'), 'LienKetIonSimulation');
const LienKetCongHoaTriSimulation = lazyNamed(() => import('./components/simulations/LienKetCongHoaTriSimulation'), 'LienKetCongHoaTriSimulation');
const DoThiQuangDuongThoiGian = lazyNamed(() => import('./components/simulations/DoThiQuangDuongThoiGian'), 'DoThiQuangDuongThoiGian');
const BongToiBongNuaToi = lazyNamed(() => import('./components/simulations/BongToiBongNuaToi'), 'BongToiBongNuaToi');
const InternalEnvironmentSimulation = lazyNamed(() => import('./components/simulations/InternalEnvironment'), 'InternalEnvironmentSimulation');
const RespiratorySystem = lazyNamed(() => import('./components/simulations/RespiratorySystem'), 'RespiratorySystem');
const MusculoskeletalSystem = lazyNamed(() => import('./components/simulations/MusculoskeletalSystem'), 'MusculoskeletalSystem');
const DigestiveSystem = lazyNamed(() => import('./components/simulations/DigestiveSystem'), 'DigestiveSystem');
const CompleteAnatomySimulation = lazyNamed(() => import('./components/simulations/CompleteAnatomySimulation'), 'CompleteAnatomySimulation');
const CircuitSimulation = lazyNamed(() => import('./components/simulations/CircuitSimulation'), 'CircuitSimulation');
const PhieuBaiHocApp = lazyNamed(() => import('./components/simulations/PhieuBaiHocApp'), 'PhieuBaiHocApp');
const MindmapApp = lazy(() => import('./components/simulations/MindmapApp'));
const MassConservationSimulation = lazyNamed(() => import('./components/simulations/MassConservationSimulation'), 'MassConservationSimulation');
const TeBaoSimulation = lazyNamed(() => import('./components/simulations/TeBaoSimulation'), 'TeBaoSimulation');
const ViKhuanSimulation = lazyNamed(() => import('./components/simulations/ViKhuanSimulation'), 'ViKhuanSimulation');
const VirusSimulation = lazyNamed(() => import('./components/simulations/VirusSimulation'), 'VirusSimulation');
const NguyenSinhVatSimulation = lazyNamed(() => import('./components/simulations/NguyenSinhVatSimulation'), 'NguyenSinhVatSimulation');
const SKKNManager = lazy(() => import('./components/simulations/SKKNManager'));
const ND30Formatter = lazyNamed(() => import('./components/simulations/ND30Formatter'), 'ND30Formatter');
const DuaVitGoiTenGame = lazyNamed(() => import('./components/simulations/DuaVitGoiTenGame'), 'DuaVitGoiTenGame');
const PhongTranhPanorama = lazy(() => import('./components/simulations/PhongTranhPanorama'));
const VideoTuongTac = lazyNamed(() => import('./components/simulations/VideoTuongTac'), 'VideoTuongTac');
const BieuDienLucSimulation = lazyNamed(() => import('./components/simulations/BieuDienLucSimulation'), 'BieuDienLucSimulation');
const MLRegressionSimulation = lazyNamed(() => import('./components/simulations/MLRegressionSimulation'), 'MLRegressionSimulation');
const MLClassificationSimulation = lazyNamed(() => import('./components/simulations/MLClassificationSimulation'), 'MLClassificationSimulation');
const MLClusteringSimulation = lazyNamed(() => import('./components/simulations/MLClusteringSimulation'), 'MLClusteringSimulation');
const DLANNSimulation = lazyNamed(() => import('./components/simulations/DLANNSimulation'), 'DLANNSimulation');
const DLCNNSimulation = lazyNamed(() => import('./components/simulations/DLCNNSimulation'), 'DLCNNSimulation');
const DLNLPSimulation = lazyNamed(() => import('./components/simulations/DLNLPSimulation'), 'DLNLPSimulation');
const GenericLessonView = lazyNamed(() => import('./components/GenericLessonView'), 'GenericLessonView');
const GameHub = lazyNamed(() => import('./components/games/GameHub'), 'GameHub');

// 12 New Simulations (Khối 6-9)
const ChuyenTheSimulation = lazyNamed(() => import('./components/simulations/ChuyenTheSimulation'), 'ChuyenTheSimulation');
const HeMaTroiSimulation = lazyNamed(() => import('./components/simulations/HeMaTroiSimulation'), 'HeMaTroiSimulation');
const TachHonHopSimulation = lazyNamed(() => import('./components/simulations/TachHonHopSimulation'), 'TachHonHopSimulation');
const KienTaoNguyenTuSimulation = lazyNamed(() => import('./components/simulations/KienTaoNguyenTuSimulation'), 'KienTaoNguyenTuSimulation');
const PhanXaAnhSangSimulation = lazyNamed(() => import('./components/simulations/PhanXaAnhSangSimulation'), 'PhanXaAnhSangSimulation');
const QuangHopSimulation = lazyNamed(() => import('./components/simulations/QuangHopSimulation'), 'QuangHopSimulation');
const LucDayArchimedesSimulation = lazyNamed(() => import('./components/simulations/LucDayArchimedesSimulation'), 'LucDayArchimedesSimulation');
const DonBayRongRocSimulation = lazyNamed(() => import('./components/simulations/DonBayRongRocSimulation'), 'DonBayRongRocSimulation');
const CoXuongKhopSimulation = lazyNamed(() => import('./components/simulations/CoXuongKhopSimulation'), 'CoXuongKhopSimulation');
const ThauKinhSimulation = lazyNamed(() => import('./components/simulations/ThauKinhSimulation'), 'ThauKinhSimulation');
const DotBienGenSimulation = lazyNamed(() => import('./components/simulations/DotBienGenSimulation'), 'DotBienGenSimulation');
const DongCoMotChieuSimulation = lazyNamed(() => import('./components/simulations/DongCoMotChieuSimulation'), 'DongCoMotChieuSimulation');

// Hoạt động trải nghiệm
const DinhHuongNgheNghiepSimulation = lazyNamed(() => import('./components/simulations/DinhHuongNgheNghiepSimulation'), 'DinhHuongNgheNghiepSimulation');
const ThuocDoCamXucSimulation = lazyNamed(() => import('./components/simulations/ThuocDoCamXucSimulation'), 'ThuocDoCamXucSimulation');
const XuLyKhungHoangSimulation = lazyNamed(() => import('./components/simulations/XuLyKhungHoangSimulation'), 'XuLyKhungHoangSimulation');
const KhoiNghiepCongDongSimulation = lazyNamed(() => import('./components/simulations/KhoiNghiepCongDongSimulation'), 'KhoiNghiepCongDongSimulation');
const BaloSinhTonSimulation = lazyNamed(() => import('./components/simulations/BaloSinhTonSimulation'), 'BaloSinhTonSimulation');
const ThietKeTuongLaiSimulation = lazyNamed(() => import('./components/simulations/ThietKeTuongLaiSimulation'), 'ThietKeTuongLaiSimulation');

// Giáo dục địa phương

const VongQuayGame = lazyNamed(() => import('./components/games/VongQuayGame'), 'VongQuayGame');
const PuzzleFlipGame = lazyNamed(() => import('./components/games/PuzzleFlipGame'), 'PuzzleFlipGame');
const KeoCoGame = lazyNamed(() => import('./components/games/KeoCoGame'), 'KeoCoGame');
const GameDoiKhangGame = lazyNamed(() => import('./components/games/GameDoiKhangGame'), 'GameDoiKhangGame');
const ChemHoaQuaGame = lazyNamed(() => import('./components/games/ChemHoaQuaGame'), 'ChemHoaQuaGame');
const GameTheoLuotGame = lazyNamed(() => import('./components/games/GameTheoLuotGame'), 'GameTheoLuotGame');
const GameQuiz = lazyNamed(() => import('./components/games/GameQuiz'), 'GameQuiz');
const CrosswordGame = lazyNamed(() => import('./components/games/CrosswordGame'), 'CrosswordGame');
const GiaiMaBucTranhGame = lazyNamed(() => import('./components/games/GiaiMaBucTranhGame'), 'GiaiMaBucTranhGame');
const DaiDuongMaThuatGame = lazyNamed(() => import('./components/games/DaiDuongMaThuatGame'), 'DaiDuongMaThuatGame');
const AiLaTrieuPhuGame = lazyNamed(() => import('./components/games/AiLaTrieuPhuGame'), 'AiLaTrieuPhuGame');
const GameConfigScreen = lazyNamed(() => import('./components/games/GameConfigScreen'), 'GameConfigScreen');
import { DEFAULT_GAME_QUESTIONS } from './data/defaultGameQuestions';
import { FloatingGuide } from './components/FloatingGuide';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import { useOnboardingTour } from './hooks/useOnboardingTour';

interface ToolUsageRecord {
  subId: string;
  catId: string;
  subTitle: string;
  logoUrl?: string;
  contentUrl?: string;
  count: number;
  lastUsed: number;
}

const HOT_TOOLS_KEY = 'gv40_hot_tools';

// Lấy câu hỏi từ ngân hàng, dùng câu hỏi mặc định nếu chưa có
const getGameQuestions = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('gamehub_questions') || '[]');
    return stored.length > 0 ? stored : DEFAULT_GAME_QUESTIONS;
  } catch {
    return DEFAULT_GAME_QUESTIONS;
  }
};

const getFallbackToolIcon = (subId: string, subTitle: string, contentUrl?: string): string => {
  const id = subId.toLowerCase();
  const title = subTitle.toLowerCase();

  if (id.includes('khtn-6')) return 'https://img.icons8.com/fluency/96/microscope.png';
  if (id.includes('khtn-7')) return 'https://img.icons8.com/fluency/96/test-tube.png';
  if (id.includes('khtn-8')) return 'https://img.icons8.com/fluency/96/physics.png';
  if (id.includes('khtn-9')) return 'https://img.icons8.com/color/96/round-bottom-flask.png';
  
  if (id.includes('phieu-bai-hoc')) return 'https://img.icons8.com/fluency/96/notebook.png';
  if (id.includes('mindmap')) return 'https://img.icons8.com/fluency/96/mind-map.png';
  if (id.includes('tao-de') || id.includes('de-kiem-tra') || id.includes('app-tao-de')) return 'https://img.icons8.com/fluency/96/artificial-intelligence.png';
  
  if (id.includes('chatgpt')) return 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128';
  if (id.includes('gemini')) return 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128';
  if (id.includes('claude')) return 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128';
  if (id.includes('copilot')) return 'https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=128';
  if (id.includes('grok')) return 'https://www.google.com/s2/favicons?domain=grok.com&sz=128';
  if (id.includes('deepseek')) return 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=128';
  if (id.includes('meta')) return 'https://www.google.com/s2/favicons?domain=meta.ai&sz=128';
  if (id.includes('notion')) return 'https://www.google.com/s2/favicons?domain=notion.so&sz=128';
  if (id.includes('cursor')) return 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128';
  if (id.includes('zapier')) return 'https://www.google.com/s2/favicons?domain=zapier.com&sz=128';
  if (id.includes('replit')) return 'https://www.google.com/s2/favicons?domain=replit.com&sz=128';
  if (id.includes('framer')) return 'https://www.google.com/s2/favicons?domain=framer.com&sz=128';
  if (id.includes('canva')) return 'https://www.google.com/s2/favicons?domain=canva.com&sz=128';
  
  if (id.includes('game-quiz') || id.includes('do-vui')) return 'https://img.icons8.com/fluency/96/quiz.png';
  if (id.includes('game-puzzle') || id.includes('manh-ghep')) return 'https://img.icons8.com/fluency/96/jigsaw-puzzle.png';
  if (id.includes('duck-race') || id.includes('dua-vit')) return 'https://img.icons8.com/fluency/96/duck.png';
  if (id.includes('game-hub') || id.includes('ngan-hang')) return 'https://img.icons8.com/fluency/96/data-configuration.png';
  if (id.includes('star-race') || id.includes('ngoi-sao')) return 'https://img.icons8.com/fluency/96/star.png';
  if (id.includes('spin-wheel') || id.includes('vong-quay')) return 'https://img.icons8.com/fluency/96/spinning-top-toy.png';
  if (id.includes('keo-co')) return 'https://img.icons8.com/fluency/96/rope.png';
  if (id.includes('doi-khang')) return 'https://img.icons8.com/fluency/96/lightning-bolt.png';
  if (id.includes('chem-hoa-qua')) return 'https://img.icons8.com/fluency/96/fruit.png';
  if (id.includes('theo-luot')) return 'https://img.icons8.com/fluency/96/dice.png';
  if (id.includes('crossword') || id.includes('o-chu')) return 'https://img.icons8.com/fluency/96/crossword.png';
  if (id.includes('game-giai-ma-buc-tranh')) return 'https://img.icons8.com/fluency/96/picture.png';
  if (id.includes('game-dai-duong-ma-thuat')) return 'https://img.icons8.com/fluency/96/jellyfish.png';

  // Tự động phân tích domain từ contentUrl cho các công cụ AI khác
  if (id.startsWith('ai-') && contentUrl) {
    try {
      const parsedUrl = new URL(contentUrl);
      return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
    } catch {
      // Bỏ qua nếu lỗi phân tích URL
    }
  }

  // Default fallback to a beautiful books icon if nothing else matches
  return 'https://img.icons8.com/fluency/96/books.png';
}

const aiGroups = [
  { id: 'all', name: 'Tất cả' },
  { id: 'chatbot', name: 'Trò chuyện & Hỏi đáp' },
  { id: 'presentation', name: 'Thuyết trình & Đồ họa' },
  { id: 'programming', name: 'Hỗ trợ lập trình' },
  { id: 'table', name: 'Bảng biểu & Trực quan' },
  { id: 'image', name: 'Tạo ảnh nghệ thuật' },
  { id: 'video', name: 'Video & Âm thanh' },
  { id: 'email', name: 'Email & Tự động hóa' },
  { id: 'planning', name: 'Lập kế hoạch & Tri thức' },
  { id: 'education', name: 'Học tập & Đánh giá' },
  { id: 'check-ai', name: 'Phát hiện AI (AI Detector)' },
  { id: 'research', name: 'Nghiên cứu & Chuyên môn' }
];

const QUIZ_GAMES: Record<string, { title: string; description: string; rules: string[] }> = {
  'game-star-race': {
    title: 'Cuộc đua ngôi sao',
    description: 'Đua xe trả lời câu hỏi chia đôi màn hình cho 2 đội cực kỳ kịch tính!',
    rules: [
      'Trò chơi đấu trí dành cho hai đội chơi trên cùng một thiết bị.',
      'Mỗi câu hỏi sẽ hiển thị đồng thời ở hai bên màn hình.',
      'Trả lời đúng giúp xe của đội bạn tiến lên 1 bước và ghi thêm 1 sao ⭐.',
      'Trả lời sai xe sẽ đứng yên hoặc bị tụt lại.',
      'Đội nào cán đích hoặc đạt 10 sao ⭐ trước sẽ giành chiến thắng chung cuộc!'
    ]
  },
  'game-puzzle-flip': {
    title: 'Lật mảnh ghép',
    description: 'Trả lời đúng các câu đố để lật các mảnh ghép bí ẩn hé lộ bức tranh ẩn giấu.',
    rules: [
      'Bức tranh bí ẩn được chia thành nhiều mảnh ghép bị che kín.',
      'Mỗi mảnh ghép tương ứng với một câu hỏi trắc nghiệm.',
      'Chọn một ô mảnh ghép và trả lời câu hỏi để lật mở ô đó.',
      'Sau khi lật mở các vùng tranh, người chơi hãy đoán từ khóa hoặc nội dung bức tranh để hoàn thành thử thách!'
    ]
  },
  'game-keo-co': {
    title: 'Kéo co kiến thức',
    description: '2 đội kéo dây bằng cách trả lời câu hỏi — đội nào kéo sợi dây về phía mình trước thắng! ⚔️',
    rules: [
      'Hai đội chơi Đỏ và Xanh sẽ đấu kéo co bằng trí tuệ.',
      'Nhấn nhanh câu trả lời chính xác cho các câu hỏi xuất hiện.',
      'Trả lời đúng và nhanh hơn sẽ tạo lực kéo sợi dây về phía đội mình.',
      'Trả lời sai sẽ giúp đối phương kéo dây dễ dàng hơn.',
      'Đội nào kéo thành công mốc dây qua vạch giới hạn đỏ sẽ giành chiến thắng!'
    ]
  },
  'game-doi-khang': {
    title: 'Game Đối Kháng',
    description: 'Buzzer 1v1 — ai nhấn trước được trả lời, đội đạt 10 điểm trước chiến thắng! ⚡',
    rules: [
      'Đấu trường buzzer 1v1 trực diện giữa 2 người chơi.',
      'Khi câu hỏi hiển thị, người chơi nhấn nút cướp quyền (Buzzer) thật nhanh.',
      'Ai bấm trước sẽ giành quyền trả lời trong vòng vài giây.',
      'Trả lời đúng được cộng 1 điểm, trả lời sai điểm sẽ được cộng trực tiếp cho đối thủ.',
      'Người đầu tiên giành được 10 điểm sẽ là nhà vô địch!'
    ]
  },
  'game-chem-hoa-qua': {
    title: 'Chém Hoa Quả',
    description: 'Click vào quả cây mang đáp án đúng để ghi điểm — sai mất tim! 🍎',
    rules: [
      'Các loại quả mang các chữ cái đáp án trắc nghiệm (A, B, C, D) bay liên tục trên màn hình.',
      'Đọc câu hỏi và chém (nhấp chuột hoặc vuốt) vào đúng quả mang đáp án chính xác để ghi điểm.',
      'Nếu chém nhầm quả mang đáp án sai hoặc để lỡ quả đúng rơi mất, bạn sẽ bị trừ 1 mạng (tim).',
      'Cố gắng ghi điểm số cao nhất trước khi hết 3 mạng (tim)!'
    ]
  },
  'game-theo-luot': {
    title: 'Game Theo Lượt',
    description: 'Tung xúc xắc, di chuyển trên bàn cờ 25 ô, trả lời câu hỏi để giữ vị trí — 2–4 người chơi! 🎲',
    rules: [
      'Bàn cờ gồm 25 ô số với các chướng ngại vật và câu đố ngẫu nhiên.',
      'Đến lượt của mình, người chơi tung xúc xắc để di chuyển số ô tương ứng.',
      'Trả lời câu hỏi trắc nghiệm tại ô dừng chân: trả lời đúng để giữ vị trí, trả lời sai sẽ phải lùi lại.',
      'Người chơi nào về đích hoặc tích lũy được nhiều điểm nhất khi kết thúc lượt sẽ thắng cuộc!'
    ]
  },
  'game-quiz': {
    title: 'Đố Vui Khoa Học',
    description: 'Trả lời câu hỏi khoa học để kích hoạt siêu năng lực vượt chướng ngại vật! Chọn avatar, 3 mạng, giới hạn thời gian cực kịch tính! 🏆',
    rules: [
      'Nhân vật của bạn sẽ chạy tự động trên đường chạy.',
      'Khi gặp chướng ngại vật, câu hỏi trắc nghiệm sẽ xuất hiện.',
      'Trả lời đúng để kích hoạt kỹ năng nhảy qua hoặc phá hủy chướng ngại vật và tiếp tục chạy.',
      'Trả lời sai hoặc đâm vào chướng ngại vật sẽ làm giảm 1 mạng.',
      'Vượt qua quãng đường dài nhất có thể trước khi mất hết 3 mạng!'
    ]
  },
  'game-crossword': {
    title: 'Giải ô chữ',
    description: 'Hệ thống ô chữ ô chữ liên hoàn thách thức tư duy và vốn kiến thức.',
    rules: [
      'Bảng ô chữ gồm các hàng ngang và một từ khóa chính ở hàng dọc.',
      'Nhấp vào từng hàng ngang để đọc gợi ý và giải câu hỏi tương ứng.',
      'Giải đúng các hàng ngang sẽ dần lộ diện các chữ cái nằm trong từ khóa chính hàng dọc.',
      'Đoán đúng từ khóa chính của ô chữ trước khi hết thời gian quy định!'
    ]
  },
  'game-giai-ma-buc-tranh': {
    title: 'Giải Mã Bức Tranh',
    description: 'Trả lời đúng câu hỏi để mở khóa từng mảnh ghép và khám phá bức tranh bí ẩn đằng sau! 🖼️',
    rules: [
      'Một bức tranh nghệ thuật bí ẩn bị che phủ hoàn toàn.',
      'Mỗi câu hỏi trắc nghiệm tương ứng với một góc của bức tranh.',
      'Trả lời đúng để lật mở góc tranh đó, tiết lộ một phần hình ảnh.',
      'Dựa trên các phần hình ảnh đã mở, hãy suy đoán từ khóa chủ đề đằng sau bức tranh để giành chiến thắng!'
    ]
  },
  'game-ai-la-trieu-phu': {
    title: 'Ai là triệu phú',
    description: 'Trải nghiệm trò chơi trí tuệ mô phỏng chương trình truyền hình nổi tiếng với đầy đủ sự trợ giúp.',
    rules: [
      'Vượt qua chuỗi 15 câu hỏi trắc nghiệm KHTN độ khó tăng dần để giành giải thưởng 150.000.000đ.',
      'Mỗi câu hỏi có 25 giây suy nghĩ.',
      'Ba mốc quan trọng tự động bảo toàn số tiền thưởng: Câu 5, Câu 10, Câu 15.',
      'Bạn có 3 quyền trợ giúp đắc lực: 50-50, Hỏi ý kiến khán giả, và Gọi điện cho người thân.',
      'Có thể chọn dừng cuộc chơi bất cứ lúc nào để bảo toàn số tiền thưởng hiện tại.'
    ]
  },
  'action-quiz-game': {
    title: 'Trắc nghiệm vận động',
    description: 'Vừa học vừa chơi, thực hiện các động tác thể chất vui nhộn theo đáp án.',
    rules: [
      'Học sinh vừa trả lời câu hỏi trắc nghiệm vừa thực hiện các động tác thể chất vui nhộn.',
      'Lựa chọn đáp án đúng để nhân vật của bạn di chuyển, vượt qua chướng ngại vật.',
      'Giúp kết hợp rèn luyện sức khỏe thể chất và tư duy kiến thức tự nhiên.'
    ]
  },
  'world-explorer-game': {
    title: 'Khám phá thế giới',
    description: 'Hành trình thám hiểm vượt chướng ngại vật qua các vùng đất kỳ thú.',
    rules: [
      'Hành trình phiêu lưu qua các vùng đất kỳ thú trên bản đồ tự nhiên.',
      'Mỗi địa điểm dừng chân sẽ đưa ra những thử thách kiến thức khác nhau.',
      'Trả lời đúng để giúp đoàn thám hiểm tiến sâu hơn vào bản đồ và khám phá các bí ẩn sinh thái!'
    ]
  }
};

export default function App() {
  const { currentUser, logout: firebaseLogout } = useAuth();
  // Compute total lessons for progress bar
  const totalLessons = useMemo(() => {
    let count = 0;
    categories.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        if (sub.lessons) count += sub.lessons.length;
      });
    });
    return count;
  }, []);
  
  // Derived routing state
  const location = useLocation();
  const navigate = useNavigate();
const path = location.pathname;
  

  let currentView: 'home' | 'profile' | 'about' | 'community' | 'category' | 'subcategory' | 'lesson' | 'leaderboard' = 'home';
  let catId: string | undefined;
  let subId: string | undefined;
  let activeSimulationId: string | undefined;
  
  if (path === '/profile') {
    currentView = 'profile';
  } else if (path === '/about') {
    currentView = 'about';
  } else if (path === '/community') {
    currentView = 'community';
  } else if (path === '/leaderboard') {
    currentView = 'leaderboard';
  } else if (path.startsWith('/category/')) {
    currentView = 'category';
    catId = path.split('/')[2];
  } else if (path.startsWith('/subcategory/')) {
    currentView = 'subcategory';
    const parts = path.split('/');
    catId = parts[2];
    subId = parts[3];
  } else if (path.startsWith('/lesson/')) {
    currentView = 'lesson';
    activeSimulationId = path.split('/')[2];
  }

  const selectedCategory = useMemo(() => {
    if (activeSimulationId) {
      for (const cat of categories) {
        for (const sub of cat.subCategories) {
          if (sub.lessons?.some(l => l.id === activeSimulationId) || sub.id === activeSimulationId) {
            return cat;
          }
        }
      }
    }
    return catId ? categories.find(c => c.id === catId) || null : null;
  }, [catId, activeSimulationId]);

  const selectedSub = useMemo(() => {
    if (activeSimulationId) {
      for (const cat of categories) {
        for (const sub of cat.subCategories) {
          if (sub.lessons?.some(l => l.id === activeSimulationId) || sub.id === activeSimulationId) {
            return sub;
          }
        }
      }
    }
    if (!selectedCategory || !subId) return null;
    return selectedCategory.subCategories.find(s => s.id === subId) || null;
  }, [selectedCategory, subId, activeSimulationId]);

  const selectedSubIndex = useMemo(() => {
    if (!selectedCategory || !selectedSub) return 0;
    return selectedCategory.subCategories.findIndex(s => s.id === selectedSub.id);
  }, [selectedCategory, selectedSub]);

  const level = useMemo(() => {
    switch (currentView) {
      case 'profile': return 5;
      case 'about': return 4;
      case 'community': return 7;
      case 'leaderboard': return 8;
      case 'category': return 2;
      case 'subcategory': return 3;
      case 'lesson': return 6;
      default: return 1;
    }
  }, [currentView]);

  // Compatibility setters
  const setLevel = (newLevel: number) => {
    if (newLevel === 1) {
      navigate('/');
    } else if (newLevel === 2) {
      if (selectedCategory) navigate(`/category/${selectedCategory.id}`);
      else navigate('/');
    } else if (newLevel === 3) {
      if (selectedCategory && selectedSub) navigate(`/subcategory/${selectedCategory.id}/${selectedSub.id}`);
      else if (selectedCategory) navigate(`/category/${selectedCategory.id}`);
      else navigate('/');
    } else if (newLevel === 4) {
      navigate('/about');
    } else if (newLevel === 5) {
      navigate('/profile');
    } else if (newLevel === 7) {
      navigate('/community');
    } else if (newLevel === 8) {
      navigate('/leaderboard');
    }
  };

  const setActiveSimulationId = (simId: string | null) => {
    if (simId) {
      navigate(`/lesson/${simId}`);
    } else {
      if (selectedCategory && selectedSub) {
        navigate(`/subcategory/${selectedCategory.id}/${selectedSub.id}`);
      } else if (selectedCategory) {
        navigate(`/category/${selectedCategory.id}`);
      } else {
        navigate('/');
      }
    }
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [hotTools, setHotTools] = useState<ToolUsageRecord[]>([]);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [selectedAiGroup, setSelectedAiGroup] = useState('all');
  const [configuredQuestions, setConfiguredQuestions] = useState<any[] | null>(null);
  const [viewMode, setViewMode] = useState<'modern' | 'gamified'>(() => {
    try {
      return (localStorage.getItem('gv40_view_mode') as 'modern' | 'gamified') || 'gamified';
    } catch {
      return 'gamified';
    }
  });

  const toggleViewMode = () => {
    const nextMode = viewMode === 'modern' ? 'gamified' : 'modern';
    setViewMode(nextMode);
    try {
      localStorage.setItem('gv40_view_mode', nextMode);
    } catch {}
  };

  const { startTour } = useOnboardingTour();

  const exitActiveGame = () => {
    setConfiguredQuestions(null);
    if (selectedCategory) {
      navigate(`/category/${selectedCategory.id}`);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HOT_TOOLS_KEY);
      if (stored && JSON.parse(stored).length > 0) {
        setHotTools(JSON.parse(stored));
      } else {
        const defaultHotTools: ToolUsageRecord[] = [
          {
            subId: 'phieu-bai-hoc',
            catId: 'on-tap',
            subTitle: 'Tạo Phiếu Bài Học (Sketchnote)',
            logoUrl: 'https://img.icons8.com/fluency/96/notebook.png',
            count: 24,
            lastUsed: Date.now() - 3600000 * 2
          },
          {
            subId: 'mindmap-app',
            catId: 'on-tap',
            subTitle: 'Tạo Sơ Đồ Tư Duy Bằng AI',
            logoUrl: 'https://img.icons8.com/fluency/96/mind-map.png',
            count: 18,
            lastUsed: Date.now() - 3600000 * 4
          },
          {
            subId: 'ai-chatgpt',
            catId: 'ai-tool',
            subTitle: 'ChatGPT',
            logoUrl: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
            contentUrl: 'https://chatgpt.com',
            count: 15,
            lastUsed: Date.now() - 3600000 * 6
          },
          {
            subId: 'ai-gemini',
            catId: 'ai-tool',
            subTitle: 'Google Gemini',
            logoUrl: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',
            contentUrl: 'https://gemini.google.com',
            count: 12,
            lastUsed: Date.now() - 3600000 * 8
          },
          {
            subId: 'ai-claude',
            catId: 'ai-tool',
            subTitle: 'Claude AI',
            logoUrl: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128',
            contentUrl: 'https://claude.ai',
            count: 10,
            lastUsed: Date.now() - 3600000 * 10
          }
        ];
        setHotTools(defaultHotTools);
        localStorage.setItem(HOT_TOOLS_KEY, JSON.stringify(defaultHotTools));
      }
    } catch {}
  }, []);

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  
  const searchResults = useMemo(() => {
    if (!globalSearchQuery) return [];
    const query = globalSearchQuery.toLowerCase();
    const results: any[] = [];
    categories.forEach(cat => {
      cat.subCategories.forEach(sub => {
        const subMatches = sub.title.toLowerCase().includes(query) || sub.description.toLowerCase().includes(query);
        if (subMatches) {
          results.push({ type: 'subcategory', item: sub, parentCat: cat });
        }
        if (sub.lessons) {
          sub.lessons.forEach(lesson => {
            const lessonMatches = lesson.title.toLowerCase().includes(query) || lesson.description.toLowerCase().includes(query);
            if (lessonMatches) {
              results.push({ type: 'lesson', item: lesson, parentSub: sub, parentCat: cat });
            }
          });
        }
      });
    });
    return results;
  }, [globalSearchQuery]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleLogout = async () => {
    await firebaseLogout();
    localStorage.removeItem('user_gemini_api_key');
    navigate('/');
  };

  const handleAboutClick = () => {
    setIsDrawerOpen(false);
    navigate('/about');
  };

  const handleLogoClick = () => {
    setIsDrawerOpen(false);
    navigate('/profile');
  };

  const handleCommunityClick = () => {
    setIsDrawerOpen(false);
    navigate('/community');
  };

  const handleSelectCategory = (cat: Category) => {
    setAiSearchQuery('');
    setSelectedAiGroup('all');
    navigate(`/category/${cat.id}`);
  };

  const recordToolUsage = (sub: SubCategory, catId: string) => {
    setHotTools(prev => {
      const existing = prev.find(t => t.subId === sub.id);
      let updated: ToolUsageRecord[];
      if (existing) {
        updated = prev.map(t => t.subId === sub.id
          ? { ...t, count: t.count + 1, lastUsed: Date.now() }
          : t
        );
      } else {
        updated = [...prev, {
          subId: sub.id,
          catId,
          subTitle: sub.title,
          logoUrl: sub.logoUrl,
          contentUrl: sub.contentUrl,
          count: 1,
          lastUsed: Date.now()
        }];
      }
      localStorage.setItem(HOT_TOOLS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectSub = (sub: SubCategory) => {
    if (selectedCategory) recordToolUsage(sub, selectedCategory.id);
    setConfiguredQuestions(null);
    if (sub.contentUrl) {
      window.open(sub.contentUrl, '_blank');
      return;
    }
    
    const gamesAndApps = [
      'game-action-quiz', 'phieu-bai-hoc', 'mindmap-app', 'game-world-explorer',
      'game-duck-race', 'game-hub', 'game-star-race', 'game-puzzle-flip',
      'game-spin-wheel', 'game-keo-co', 'game-doi-khang', 'game-chem-hoa-qua',
      'game-theo-luot', 'game-quiz', 'game-crossword', 'game-giai-ma-buc-tranh',
      'game-dai-duong-ma-thuat', 'game-ai-la-trieu-phu'
    ];
    
    let targetSimId: string | null = null;
    if (sub.id === 'game-action-quiz') targetSimId = 'action-quiz-game';
    else if (sub.id === 'game-world-explorer') targetSimId = 'world-explorer-game';
    else if (sub.id === 'game-duck-race') targetSimId = 'duck-race-game';
    else if (gamesAndApps.includes(sub.id)) targetSimId = sub.id;

    if (targetSimId) {
      navigate(`/lesson/${targetSimId}`);
    } else {
      navigate(`/subcategory/${selectedCategory?.id}/${sub.id}`);
    }
  };

  const handleHotToolClick = (tool: ToolUsageRecord) => {
    const cat = categories.find(c => c.id === tool.catId);
    if (!cat) return;
    const sub = cat.subCategories.find(s => s.id === tool.subId);
    if (!sub) return;
    recordToolUsage(sub, cat.id);
    setConfiguredQuestions(null);
    if (sub.contentUrl) { window.open(sub.contentUrl, '_blank'); return; }
    
    const gamesAndApps = [
      'game-action-quiz', 'phieu-bai-hoc', 'mindmap-app', 'game-world-explorer',
      'game-duck-race', 'game-hub', 'game-star-race', 'game-puzzle-flip',
      'game-spin-wheel', 'game-keo-co', 'game-doi-khang', 'game-chem-hoa-qua',
      'game-theo-luot', 'game-quiz', 'game-crossword', 'game-giai-ma-buc-tranh',
      'game-dai-duong-ma-thuat', 'game-ai-la-trieu-phu'
    ];
    
    let targetSimId: string | null = null;
    if (sub.id === 'game-action-quiz') targetSimId = 'action-quiz-game';
    else if (sub.id === 'game-world-explorer') targetSimId = 'world-explorer-game';
    else if (sub.id === 'game-duck-race') targetSimId = 'duck-race-game';
    else if (gamesAndApps.includes(sub.id)) targetSimId = sub.id;

    if (targetSimId) {
      navigate(`/lesson/${targetSimId}`);
    } else {
      navigate(`/subcategory/${cat.id}/${sub.id}`);
    }
  };

  const goHome = () => {
    setAiSearchQuery('');
    setSelectedAiGroup('all');
    navigate('/');
  };

  const goBackToSub = () => {
    setAiSearchQuery('');
    setSelectedAiGroup('all');
    if (selectedCategory) {
      navigate(`/category/${selectedCategory.id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <MultiplayerProvider>
    <div className="min-h-screen flex flex-col relative text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Science Background from User */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-950 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://i.postimg.cc/rsLy3gxh/bg-science.png)' }}
      >
        <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px]"></div>
        
        {/* Colorful Light Blobs - Brighter */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-400/40 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-500/40 blur-[120px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-400/30 blur-[100px] rounded-full"></div>
      </div>

      {/* Global Fullscreen Toggle for levels 3 and 6 */}
      {currentUser && (level === 3 || level === 6) && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-9999 w-10 h-10 md:w-12 md:h-12 bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/20 transition-all hover:scale-110 flex items-center justify-center group"
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" /> : <Maximize className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />}
        </button>
      )}
{/* Multiplayer routes */}
<Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>}>
  {path === '/lobby' && <Lobby />}
  {path.match(/^\/room\/[^/]+$/) && <Room />}
  {path.match(/^\/room\/([^/]+)\/play$/) && <StarRaceGame roomId={path.split('/')[2]} onBack={exitActiveGame} />}
</Suspense>
      {currentUser && <FloatingGuide />}
      
      {/* AI Assistant for lessons/simulations */}
      {currentUser && level === 6 && (
        <AIAssistant 
          contextTitle={selectedSub?.lessons?.find(l => l.id === activeSimulationId)?.title || "Khoa học tự nhiên"} 
          contextDescription={selectedSub?.lessons?.find(l => l.id === activeSimulationId)?.description || ""} 
        />
      )}

      <ErrorBoundary onBack={activeSimulationId ? () => { setActiveSimulationId(null); setLevel(level === 6 ? 3 : 2); } : goHome}>
      <Suspense fallback={<CatLoader />}>
        {!currentUser ? (
          <Login />
      ) : level === 5 ? (
        <Profile onBack={goHome} />
      ) : level === 6 && activeSimulationId === 'co-nang' ? (
        <CoNangSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'cong-suat' ? (
        <CongSuatSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'khuc-xa' ? (
        <KhucXaSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'dong-dien' ? (
        <MachDienSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'cam-ung' ? (
        <CamUngSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'kim-loai' ? (
        <DayKimLoaiSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'hop-chat-huu-co' ? (
        <HopChatHuuCoSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'tao-de-kiem-tra' ? (
        <TaoDeKiemTraApp onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'phieu-bai-hoc' ? (
        <PhieuBaiHocApp onBack={() => { setActiveSimulationId(null); setLevel(2); }} />
      ) : level === 6 && activeSimulationId === 'mindmap-app' ? (
        <div className="fixed inset-0 w-screen h-screen z-9998 bg-slate-900">
          <button onClick={() => { setActiveSimulationId(null); setLevel(2); }} className="absolute top-4 left-4 z-9999 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white shadow-lg">Quay lại</button>
          <MindmapApp />
        </div>
      ) : level === 6 && activeSimulationId && QUIZ_GAMES[activeSimulationId] && !configuredQuestions ? (
        <GameConfigScreen
          gameTitle={QUIZ_GAMES[activeSimulationId].title}
          gameDescription={QUIZ_GAMES[activeSimulationId].description}
          gameRules={QUIZ_GAMES[activeSimulationId].rules}
          onStart={(qs: any[]) => setConfiguredQuestions(qs)}
          onBack={() => { setActiveSimulationId(null); setLevel(2); }}
          onGoToBank={() => {
            setActiveSimulationId('game-hub');
            setConfiguredQuestions(null);
          }}
        />
      ) : level === 6 && activeSimulationId === 'action-quiz-game' ? (
        <ActionQuizGame initialQuestions={configuredQuestions ? configuredQuestions.map((q, i) => ({ id: i, question: q.text, options: q.options, correctAnswer: q.answer })) : undefined} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'world-explorer-game' ? (
        <KhamPhaTheGioiGame initialQuestions={configuredQuestions || undefined} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'bang-tuan-hoan' ? (
        <PeriodicTableApp onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'te-bao' ? (
        <TeBaoSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'vi-khuan' ? (
        <ViKhuanSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'virus' ? (
        <VirusSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'nguyen-sinh-vat' ? (
        <NguyenSinhVatSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'bieu-dien-luc' ? (
        <BieuDienLucSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'lien-ket-ion' ? (
        <LienKetIonSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'lien-ket-cong-hoa-tri' ? (
        <LienKetCongHoaTriSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'bong-toi-nua-toi' ? (
        <BongToiBongNuaToi onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'do-thi-quang-duong' ? (
        <DoThiQuangDuongThoiGian onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'moi-truong-trong-co-the' ? (
        <InternalEnvironmentSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'he-ho-hap' ? (
        <RespiratorySystem onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'he-van-dong' ? (
        <MusculoskeletalSystem onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'he-tieu-hoa' ? (
        <DigestiveSystem onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'cac-he-co-quan' ? (
        <CompleteAnatomySimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'so-do-mach-dien' ? (
        <CircuitSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'dinh-luat-bao-toan-khoi-luong' ? (
        <MassConservationSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'dinh-huong-nghe-nghiep' ? (
        <DinhHuongNgheNghiepSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'thuoc-do-cam-xuc' ? (
        <ThuocDoCamXucSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'xu-ly-khung-hoang' ? (
        <XuLyKhungHoangSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'khoi-nghiep-cong-dong' ? (
        <KhoiNghiepCongDongSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'balo-sinh-ton' ? (
        <BaloSinhTonSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'thiet-ke-tuong-lai' ? (
        <ThietKeTuongLaiSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'duck-race-game' ? (
        <DuaVitGoiTenGame onBack={() => { setActiveSimulationId(null); setLevel(2); }} />
      ) : level === 6 && activeSimulationId === 'game-hub' ? (
        <GameHub onBack={() => { setActiveSimulationId(null); setLevel(2); }} />
      ) : level === 6 && activeSimulationId === 'game-star-race' ? (
        <StarRaceGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-puzzle-flip' ? (
        <PuzzleFlipGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-spin-wheel' ? (
        <VongQuayGame onBack={() => { setActiveSimulationId(null); setLevel(2); }} />
      ) : level === 6 && activeSimulationId === 'game-keo-co' ? (
        <KeoCoGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-doi-khang' ? (
        <GameDoiKhangGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-chem-hoa-qua' ? (
        <ChemHoaQuaGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-theo-luot' ? (
        <GameTheoLuotGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-quiz' ? (
        <GameQuiz questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-crossword' ? (
        <CrosswordGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-giai-ma-buc-tranh' ? (
        <GiaiMaBucTranhGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-ai-la-trieu-phu' ? (
        <AiLaTrieuPhuGame questions={configuredQuestions || getGameQuestions()} onBack={exitActiveGame} />
      ) : level === 6 && activeSimulationId === 'game-dai-duong-ma-thuat' ? (
        <DaiDuongMaThuatGame onBack={() => { setActiveSimulationId(null); setLevel(2); }} />
      ) : level === 6 && activeSimulationId === 'phong-tranh-panorama' ? (
        <PhongTranhPanorama onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'video-tuong-tac' ? (
        <VideoTuongTac onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'ml-regression' ? (
        <MLRegressionSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'ml-classification' ? (
        <MLClassificationSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'ml-clustering' ? (
        <MLClusteringSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'dl-ann' ? (
        <DLANNSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'dl-cnn' ? (
        <DLCNNSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'dl-nlp' ? (
        <DLNLPSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'chuyen-the' ? (
        <ChuyenTheSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'he-mat-troi' ? (
        <HeMaTroiSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'tach-hon-hop' ? (
        <TachHonHopSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'kien-tao-nguyen-tu' ? (
        <KienTaoNguyenTuSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'phan-xa-anh-sang' ? (
        <PhanXaAnhSangSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'quang-hop' ? (
        <QuangHopSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'luc-day-archimedes' ? (
        <LucDayArchimedesSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'don-bay-rong-roc' ? (
        <DonBayRongRocSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'co-xuong-khop' ? (
        <CoXuongKhopSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'thau-kinh' ? (
        <ThauKinhSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'dot-bien-gen' ? (
        <DotBienGenSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 && activeSimulationId === 'dong-co-mot-chieu' ? (
        <DongCoMotChieuSimulation onBack={() => { setActiveSimulationId(null); setLevel(3); }} />
      ) : level === 6 ? (
        <GenericLessonView 
           onBack={() => { setActiveSimulationId(null); setLevel(3); }}
           title={selectedSub?.lessons?.find(l => l.id === activeSimulationId)?.title || "Bài học mới"}
           description={selectedSub?.lessons?.find(l => l.id === activeSimulationId)?.description || "Nội dung bài học đang được cập nhật."}
           categoryName={selectedSub?.title || "Bài học"}
        />
      ) : (
        <>
          <Header 
            onHomeClick={goHome} 
            onLogoutClick={handleLogout} 
            onSảnPhẩmClick={goHome}
            onCommunityClick={handleCommunityClick}
            onAboutClick={() => setLevel(4)}
            onLogoClick={handleLogoClick}
            onTourClick={startTour}
            onLeaderboardClick={() => setLevel(8)}
            onReviewClick={() => setReviewOpen(true)}
          />
          <ReviewModal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} />


          {/* Quick Navigation Drawer */}
          <AnimatePresence>
            {isDrawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDrawerOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
                />
                
                {/* Drawer */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 left-0 bottom-0 w-80 bg-slate-900/90 backdrop-blur-2xl border-r border-white/10 z-70 p-6 shadow-2xl flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <div>
                      <h2 className="text-xl font-black text-white font-heading tracking-tight italic">LỐI TẮT</h2>
                      <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mt-1">Sản phẩm giáo dục</p>
                    </div>
                    <button 
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          handleSelectCategory(cat);
                          setIsDrawerOpen(false);
                        }}
                        className={`w-full flex items-center p-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden ${selectedCategory?.id === cat.id ? 'bg-white/10 border-white/30' : 'bg-white/5 hover:bg-white/8'}`}
                      >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-linear-to-r ${cat.colorClass} transition-opacity`} />
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br ${cat.colorClass} shadow-lg mr-4 shrink-0`}>
                          <cat.icon className="w-5 h-5 text-white" weight="duotone" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{cat.title}</p>
                          <p className="text-xs text-slate-400 font-medium truncate">{cat.subtitle}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:text-white transition-all ${selectedCategory?.id === cat.id ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                    <button 
                      onClick={handleAboutClick}
                      className="w-full py-3 rounded-xl bg-white/5 text-slate-300 font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                    >
                      <Box className="w-4 h-4" />
                      <span>Giới thiệu</span>
                    </button>
                    <button 
                      onClick={() => {
                        goHome();
                        setIsDrawerOpen(false);
                      }}
                      className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm tracking-widest uppercase hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                    >
                      Về Trang Chủ
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col pt-24 lg:pt-28 pb-20 z-10 animate-in fade-in duration-500">
            {/* Tiêu đề chính */}
            {level !== 4 && level !== 7 && level !== 8 && (
              <div className="relative z-40 mb-2 md:mb-4 text-center flex flex-col items-center animate-in slide-in-from-top-4 duration-700 fade-in">
                   <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-indigo-950 uppercase drop-shadow-sm pb-1 font-heading leading-tight italic px-2">
                     Giáo viên 4.0
                   </h1>
                   <p className="text-orange-600 font-extrabold text-xs md:text-sm tracking-[0.3em] uppercase drop-shadow-sm mt-1">
                     Trạm Vũ Trụ Tri Thức
                   </p>
              </div>
            )}

            {/* Cấp 1: Grid 8 Mục Lớn */}
            {level === 1 && !globalSearchQuery && (
              // Wrapper ngoài: chỉ xử lý horizontal scroll, không clip overflow-y
              <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {/* Inner: chứa icon, cho phép overflow-y visible để animation không bị cắt */}
                <div className="flex flex-nowrap justify-start lg:justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl mx-auto px-6 pb-6 pt-10 animate-in zoom-in-95 duration-500 snap-x overflow-visible">
                  {categories.map((cat, index) => (
                    <div
                      key={cat.id}
                      id={`tour-${cat.id}`}
                      onClick={() => handleSelectCategory(cat)}
                      className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 w-[70px] sm:w-[90px] md:w-[100px] shrink-0 snap-center z-10 hover:z-100"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Circle icon container */}
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl md:rounded-4xl flex items-center justify-center bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-orange-400 shadow-[0_4px_16px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_40px_rgba(249,115,22,0.3)] group-hover:-translate-y-3 group-hover:scale-125 md:group-hover:scale-[1.25] transition-all duration-300 relative shrink-0`}>
                        <div className={`absolute inset-0 rounded-2xl md:rounded-4xl opacity-20 group-hover:opacity-40 bg-linear-to-br ${cat.colorClass} transition-opacity duration-300`}></div>
                        
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center bg-linear-to-br ${cat.colorClass} shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_4px_16px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.15)] transition-transform duration-300 shrink-0 relative z-10 overflow-hidden`}>
                          {cat.logoUrl ? (
                            <img src={cat.logoUrl} alt={cat.title} className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
                          ) : (
                            <cat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                          )}
                        </div>
                      </div>

                      {/* Title text below (always visible) */}
                      <div className="mt-3 flex flex-col items-center w-full text-center transition-all duration-300 group-hover:translate-y-1 z-20">
                        <h3 className="text-[11px] sm:text-xs font-extrabold text-indigo-900 group-hover:text-orange-600 transition-colors leading-tight max-w-[80px] sm:max-w-[100px] wrap-break-word">{cat.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🔥 Công cụ Hot - hiển thị khi level 1 và có dữ liệu */}
            {level === 1 && hotTools.length > 0 && (() => {
              const sorted = [...hotTools]
                .sort((a, b) => b.count - a.count || b.lastUsed - a.lastUsed)
                .slice(0, 8);
              return (
                <div id="tour-hot-tools" className="w-full max-w-7xl mx-auto px-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* Section Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-orange-300 shadow-sm backdrop-blur-md">
                        <Flame className="w-4 h-4 text-orange-600 animate-pulse" />
                        <span className="text-sm font-black text-orange-600 uppercase tracking-[0.2em]">Công cụ Hot</span>
                      </div>
                      <span className="text-xs text-indigo-900/80 font-bold hidden sm:block">Dùng nhiều nhất gần đây</span>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {!globalSearchQuery && (
                        <div className="hidden md:flex items-center gap-1.5 text-indigo-900/80 font-bold shrink-0">
                          <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                          <span className="text-xs">{hotTools.length} công cụ</span>
                        </div>
                      )}
                      
                      <div className="relative w-full md:w-72 glowing-search" id="tour-search-bar">
                        <div className="glowing-search-inner h-full flex relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Search className="h-4 w-4 text-cyan-400" />
                          </div>
                          <input
                            type="text"
                            value={globalSearchQuery}
                            onChange={(e) => setGlobalSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm công cụ, bài học..."
                            className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none text-sm font-bold text-white placeholder:text-slate-400 outline-none transition-all shadow-inner relative z-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {globalSearchQuery ? (
                    <div className="w-full mt-2 animate-in fade-in duration-300">
                      <h3 className="text-lg font-black text-indigo-950 mb-4 px-2">Kết quả tìm kiếm ({searchResults.length})</h3>
                      {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
                          {searchResults.map((result, idx) => {
                            if (result.type === 'subcategory') {
                              const sub = result.item;
                              const cat = result.parentCat;
                              return (
                                <div 
                                  key={`sub-${sub.id}-${idx}`}
                                  onClick={() => {
                                    setGlobalSearchQuery('');
                                    navigate(`/subcategory/${cat.id}/${sub.id}`);
                                  }}
                                  className="relative bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-orange-400 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3 group"
                                >
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br ${cat.colorClass} shadow-sm shrink-0`}>
                                    {sub.logoUrl ? (
                                      <img src={sub.logoUrl} className="w-7 h-7 object-contain" alt="" />
                                    ) : (
                                      <cat.icon className="w-6 h-6 text-white" weight="duotone" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-extrabold text-indigo-950 truncate group-hover:text-orange-600 transition-colors">{sub.title}</h4>
                                    <p className="text-[10px] text-indigo-900/60 font-bold uppercase truncate">{cat.title}</p>
                                    <p className="text-xs text-indigo-900/80 mt-1 line-clamp-2 leading-tight">{sub.description}</p>
                                  </div>
                                </div>
                              );
                            } else {
                              const lesson = result.item;
                              const sub = result.parentSub;
                              const cat = result.parentCat;
                              return (
                                <div 
                                  key={`lesson-${lesson.id}-${idx}`}
                                  onClick={() => {
                                    setGlobalSearchQuery('');
                                    navigate(`/lesson/${lesson.id}`);
                                  }}
                                  className="relative bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3 group"
                                >
                                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br from-blue-400 to-indigo-500 shadow-sm shrink-0">
                                    {lesson.icon && <lesson.icon className="w-6 h-6 text-white" weight="duotone" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-sm uppercase leading-none">Bài học</span>
                                    </div>
                                    <h4 className="text-sm font-extrabold text-indigo-950 truncate group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                                    <p className="text-[10px] text-indigo-900/60 font-bold uppercase truncate">{sub.title} • {cat.title}</p>
                                    <p className="text-xs text-indigo-900/80 mt-1 line-clamp-2 leading-tight">{lesson.description}</p>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-white/40 rounded-2xl border border-white/60 mx-2">
                          <Search className="w-8 h-8 text-indigo-900/20 mx-auto mb-3" />
                          <p className="text-indigo-900/60 font-bold text-sm">Không tìm thấy kết quả phù hợp</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Tool Cards - horizontal scroll */}

                  <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="flex gap-4 pt-4 px-2 pb-4 min-w-max lg:min-w-0 lg:flex-wrap">
                      {sorted.map((tool, idx) => {
                        const isTop = idx === 0;
                        const imgSrc = tool.logoUrl || (tool.contentUrl
                          ? `https://www.google.com/s2/favicons?domain=${tool.contentUrl}&sz=128`
                          : undefined) || getFallbackToolIcon(tool.subId, tool.subTitle, tool.contentUrl);
                        return (
                          <div
                            key={tool.subId}
                            onClick={() => handleHotToolClick(tool)}
                            className="relative flex flex-col items-center justify-start shrink-0 cursor-pointer group transition-all duration-300 w-[70px] sm:w-[80px]"
                          >
                            {/* Logo Wrapper */}
                            <div className="relative">
                              {/* Hot badge for #1 */}
                              {isTop && (
                                <div className="absolute -top-3 -right-3 z-10 bg-linear-to-r from-orange-500 to-red-600 rounded-full px-2 py-0.5 flex items-center gap-0.5 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/50">
                                  <Flame className="w-2.5 h-2.5 text-white" />
                                  <span className="text-[10px] font-black text-white leading-none">#1</span>
                                </div>
                              )}
 
                              {imgSrc ? (
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center overflow-hidden transition-all duration-300 shrink-0 shadow-lg border-2 ${isTop ? 'bg-linear-to-br from-orange-500/30 to-red-600/30 border-orange-400/60 group-hover:border-orange-400 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] group-hover:scale-110' : 'bg-white/20 border-white/40 group-hover:border-white/70 group-hover:bg-white/30 backdrop-blur-md group-hover:scale-110'}`}>
                                  <img
                                    src={imgSrc}
                                    alt={tool.subTitle}
                                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-lg"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = getFallbackToolIcon(tool.subId, tool.subTitle, tool.contentUrl);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] bg-linear-to-br from-orange-500/80 to-red-600/80 flex items-center justify-center shrink-0 border-2 border-white/30 group-hover:border-white/60 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_20px_rgba(249,115,22,0.7)] group-hover:scale-110">
                                  <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
                                </div>
                              )}

                              {/* Usage count badge (bold & high contrast) */}
                              <div className="absolute -bottom-2 right-0 bg-white border border-orange-500 flex items-center gap-1 px-1.5 py-0.5 rounded-full shadow-md group-hover:border-orange-600 transition-colors z-10">
                                <Flame className="w-2.5 h-2.5 text-orange-600" />
                                <span className="text-[10px] font-black text-orange-600">{tool.count}</span>
                              </div>
                            </div>
                            
                            {/* Title text below (always visible) */}
                            <div className="mt-3 flex flex-col items-center w-full text-center transition-all duration-300 group-hover:translate-y-1 z-20">
                              <h3 className="text-[10px] sm:text-[11px] font-extrabold text-indigo-900 group-hover:text-orange-600 transition-colors leading-tight max-w-[70px] sm:max-w-[80px] line-clamp-2">{tool.subTitle}</h3>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  </>
                  )}
                </div>
              );
            })()}
            {/* Cấp 2: Danh sách Mục Nhỏ */}
            {level === 2 && selectedCategory && (() => {
              const filteredSubCategories = selectedCategory.subCategories.filter(sub => {
                const matchesGroup = selectedCategory.id !== 'ai-tool' || selectedAiGroup === 'all' || sub.group === selectedAiGroup;
                const query = aiSearchQuery.toLowerCase().trim();
                const matchesSearch = !query || 
                  sub.title.toLowerCase().includes(query) || 
                  sub.description.toLowerCase().includes(query);
                return matchesGroup && matchesSearch;
              });

              return (
                <div className="animate-in slide-in-from-right-8 duration-500 w-full flex-1 flex flex-col">
                  <button 
                    onClick={goHome}
                    className="flex items-center space-x-2 text-indigo-900 hover:text-orange-600 mb-8 px-5 py-2.5 bg-white/40 hover:bg-white/60 rounded-full border border-white/60 transition-all backdrop-blur-md w-fit shadow-sm group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold tracking-wide">Quay lại Trang Chủ</span>
                  </button>
                  
                  <div className="flex items-center space-x-5 mb-10 bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md shadow-md">
                     <div className={`p-4 rounded-2xl bg-linear-to-br ${selectedCategory.colorClass} shadow-lg`}>
                        <selectedCategory.icon className="w-10 h-10 text-white" weight="duotone" />
                     </div>
                     <div>
                        <h2 className="text-3xl md:text-4xl font-black text-indigo-950 font-heading drop-shadow-sm">{selectedCategory.title}</h2>
                        <p className="text-orange-600 mt-2 font-extrabold text-lg">{selectedCategory.subtitle}</p>
                     </div>
                  </div>

                  {/* Thanh tìm kiếm và bộ lọc nhóm dành riêng cho Công cụ AI */}
                  {selectedCategory.id === 'ai-tool' && (
                    <div className="flex flex-col gap-6 mb-8 bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md shadow-md animate-in slide-in-from-top-4 duration-500">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="text-xs font-black text-indigo-900/60 uppercase tracking-[0.15em]">Bộ tìm kiếm & Phân loại</span>
                          <h3 className="text-lg font-black text-indigo-950 mt-1">Trợ lý AI Đa vũ trụ</h3>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative w-full max-w-md">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-950/60" />
                          <input
                            type="text"
                            placeholder="Tìm tên hoặc tính năng công cụ..."
                            value={aiSearchQuery}
                            onChange={(e) => setAiSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-white/60 focus:bg-white border border-white/80 focus:border-orange-500 rounded-2xl text-indigo-950 font-bold placeholder-indigo-950/40 shadow-inner outline-none transition-all duration-300 text-sm focus:ring-2 focus:ring-orange-500/20"
                          />
                          {aiSearchQuery && (
                            <button
                              onClick={() => setAiSearchQuery('')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-950/60 hover:text-indigo-950 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Filter Pills */}
                      <div className="border-t border-indigo-900/10 pt-4 flex gap-2 overflow-x-auto w-full pb-1 scrollbar-none snap-x select-none">
                        {aiGroups.map(group => (
                          <button
                            key={group.id}
                            onClick={() => setSelectedAiGroup(group.id)}
                            className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-300 border snap-start ${
                              selectedAiGroup === group.id
                                ? 'bg-linear-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-md shadow-orange-500/20 scale-105'
                                : 'bg-white/40 hover:bg-white/60 border-white/60 text-indigo-900 hover:text-orange-600'
                            }`}
                          >
                            {group.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state và Grid kết quả */}
                  {filteredSubCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/30 border border-white/50 rounded-3xl backdrop-blur-md text-center max-w-lg mx-auto w-full shadow-lg animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 border border-orange-200 shadow-inner">
                        <Search className="w-8 h-8 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-extrabold text-indigo-950 mb-2">Không tìm thấy công cụ AI nào</h3>
                      <p className="text-sm text-indigo-900/70 font-medium mb-6 max-w-sm">
                        Không tìm thấy kết quả phù hợp cho từ khóa <strong className="text-orange-600">"{aiSearchQuery}"</strong> hoặc nhóm hiện tại.
                      </p>
                      <button
                        onClick={() => {
                          setAiSearchQuery('');
                          setSelectedAiGroup('all');
                        }}
                        className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 hover:scale-105 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md"
                      >
                        Xóa bộ lọc tìm kiếm
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSubCategories.map((sub, index) => {
                        const themes = ['blue', 'orange', 'purple', 'green', 'red'];
                        const getColors = (t: string) => {
                          switch(t) {
                            case 'blue': return { iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-blue-100 to-indigo-100', btnBg: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-200' };
                            case 'orange': return { iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-orange-100 to-amber-100', btnBg: 'from-orange-400 to-amber-500', glow: 'shadow-orange-200' };
                            case 'purple': return { iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600', iconColor: 'text-white', blob: 'bg-gradient-to-br from-violet-100 to-fuchsia-100', btnBg: 'from-violet-500 to-fuchsia-600', glow: 'shadow-violet-200' };
                            case 'green': return { iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-emerald-100 to-teal-100', btnBg: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-200' };
                            case 'red': return { iconBg: 'bg-gradient-to-br from-rose-500 to-red-600', iconColor: 'text-white', blob: 'bg-gradient-to-br from-rose-100 to-red-100', btnBg: 'from-rose-500 to-red-600', glow: 'shadow-rose-200' };
                            default: return { iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-blue-100 to-indigo-100', btnBg: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-200' };
                          }
                        };
                        const colors = getColors(themes[index % themes.length]);
                        return (
                          <div
                            key={sub.id}
                            onClick={() => handleSelectSub(sub)}
                            className="relative bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.15)] transition-all duration-300 min-h-[220px] animate-in zoom-in-95"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            {/* Gradient blob background */}
                            <div className={`absolute -top-16 -right-16 w-52 h-52 rounded-full ${colors.blob} opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none`}></div>
                            <div className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full ${colors.blob} opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 pointer-events-none`}></div>

                            <div className="relative z-10 flex flex-col h-full items-start text-left">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colors.iconBg} shadow-lg ${colors.glow} group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 shrink-0`}>
                                {(sub.contentUrl || sub.logoUrl) ? (
                                  <img 
                                    src={sub.logoUrl || (sub.contentUrl ? `https://www.google.com/s2/favicons?domain=${sub.contentUrl}&sz=128` : undefined)} 
                                    alt={sub.title} 
                                    className="w-9 h-9 object-contain drop-shadow-sm bg-white rounded-lg p-0.5" 
                                    referrerPolicy="no-referrer" 
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = getFallbackToolIcon(sub.id, sub.title, sub.contentUrl);
                                    }}
                                  />
                                ) : (
                                  <Box className={`w-7 h-7 ${colors.iconColor} drop-shadow-sm`} />
                                )}
                              </div>
                              
                              <h3 className="text-xl font-extrabold text-indigo-950 mb-2 font-heading group-hover:text-orange-600 transition-colors">{sub.title}</h3>
                              <p className="text-indigo-900/70 font-medium leading-relaxed mb-6 flex-1 text-sm line-clamp-3">{sub.description}</p>
                              
                              <div className={`mt-auto px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all bg-linear-to-r ${colors.btnBg} text-white shadow-md group-hover:shadow-lg group-hover:scale-105`}>
                                <span className="text-xs tracking-wide">Bắt đầu</span>
                                <Play fill="currentColor" className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Cấp 3: Nội dung Chi tiết */}
            {level === 3 && selectedSub && selectedCategory && (
              <div className="animate-in slide-in-from-bottom-8 duration-500 h-full flex flex-col flex-1 w-full">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <button 
                    onClick={goBackToSub}
                    className="flex items-center space-x-2 text-indigo-900 hover:text-orange-600 px-5 py-2.5 bg-white/40 hover:bg-white/60 rounded-full border border-white/60 transition-all backdrop-blur-md w-fit shadow-sm group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold tracking-wide">Quay lại Danh mục</span>
                  </button>

                  {selectedSub.lessons && selectedSub.lessons.length > 0 && (
                    <button
                      onClick={toggleViewMode}
                      className="flex items-center space-x-2 text-indigo-900 hover:text-orange-600 px-5 py-2.5 bg-white/40 hover:bg-white/60 rounded-full border border-white/60 transition-all backdrop-blur-md w-fit shadow-sm font-bold tracking-wide cursor-pointer select-none"
                    >
                      {viewMode === 'modern' ? '🎮 Giao diện Game hóa' : '📱 Giao diện Hiện đại'}
                    </button>
                  )}
                </div>
                
                <div className={`flex-1 flex flex-col transition-all duration-500 ${
                  selectedSub.lessons && viewMode === 'gamified'
                    ? 'bg-transparent border-0 shadow-none p-0'
                    : 'bg-slate-900/60 backdrop-blur-3xl border border-slate-700/60 rounded-3xl p-6 lg:p-8 shadow-2xl'
                }`}>
                  {viewMode === 'modern' || !selectedSub.lessons ? (
                    <div className="mb-6 border-b border-slate-700/60 pb-6 flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-heading drop-shadow-sm">{selectedSub.title}</h2>
                        <p className="text-slate-400 font-medium">{selectedSub.description}</p>
                      </div>
                      <div className={`hidden sm:flex p-4 rounded-2xl bg-linear-to-br ${selectedCategory.colorClass} shadow-lg opacity-90`}>
                        <selectedCategory.icon className="w-8 h-8 text-white" weight="duotone" />
                      </div>
                    </div>
                  ) : null}
                  
                  {/* Content area: Iframe or Render Area */}
                  <div className={`flex-1 w-full rounded-2xl flex flex-col relative ${
                    selectedSub.lessons && viewMode === 'modern'
                      ? 'bg-slate-50/95 p-4 md:p-8 overflow-y-auto custom-scrollbar' 
                      : selectedSub.lessons && viewMode === 'gamified'
                        ? 'bg-transparent p-0 overflow-y-auto custom-scrollbar' 
                        : selectedCategory.id === 'skkn' || ['test-gk', 'test-ck', 'bg-khtn', 'docs-sgk'].includes(selectedSub.id)
                          ? 'bg-black/60 border border-slate-800/80 min-h-[500px] p-4 md:p-8 overflow-y-auto custom-scrollbar' 
                          : 'bg-black/60 border border-slate-800 items-center justify-center text-center min-h-[500px] overflow-hidden group shadow-inner p-4 md:p-8'
                  }`}>
                      {!selectedSub.lessons && (
                        <>
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                        </>
                      )}
                      
                      {selectedCategory.id === 'skkn' && selectedSub.id === 'skkn-nd30' ? (
                        <ND30Formatter />
                      ) : selectedCategory.id === 'skkn' || ['test-gk', 'test-ck', 'bg-khtn', 'docs-sgk'].includes(selectedSub.id) ? (
                        <SKKNManager subCategoryId={selectedSub.id} categoryTitle={selectedSub.title} />
                      ) : selectedSub.lessons && selectedSub.lessons.length > 0 ? (
                        viewMode === 'modern' ? (
                          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedSub.lessons.map(lesson => {
                                const getColors = (t: string) => {
                                  switch(t) {
                                    case 'blue': return { iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-blue-100 to-indigo-100', btnBg: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-200' };
                                    case 'orange': return { iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-orange-100 to-amber-100', btnBg: 'from-orange-400 to-amber-500', glow: 'shadow-orange-200' };
                                    case 'purple': return { iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600', iconColor: 'text-white', blob: 'bg-gradient-to-br from-violet-100 to-fuchsia-100', btnBg: 'from-violet-500 to-fuchsia-600', glow: 'shadow-violet-200' };
                                    case 'green': return { iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-emerald-100 to-teal-100', btnBg: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-200' };
                                    case 'red': return { iconBg: 'bg-gradient-to-br from-rose-500 to-red-600', iconColor: 'text-white', blob: 'bg-gradient-to-br from-rose-100 to-red-100', btnBg: 'from-rose-500 to-red-600', glow: 'shadow-rose-200' };
                                    default: return { iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-blue-100 to-indigo-100', btnBg: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-200' };
                                  }
                                };
                                const colors = getColors(lesson.theme);
                                return (
                                  <div 
                                    key={lesson.id} 
                                    onClick={() => {
                                      setActiveSimulationId(lesson.id);
                                      setLevel(6);
                                    }}
                                    className="relative bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.15)] transition-all duration-300 text-slate-800"
                                  >
                                    {/* Gradient blob background */}
                                    <div className={`absolute -top-16 -right-16 w-52 h-52 rounded-full ${colors.blob} opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none`}></div>
                                    <div className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full ${colors.blob} opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 pointer-events-none`}></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full items-start text-left">
                                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colors.iconBg} shadow-lg ${colors.glow} group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                                        <lesson.icon className={`w-7 h-7 ${colors.iconColor} drop-shadow-sm`} weight="duotone" />
                                      </div>
                                      
                                      <h3 className="text-xl font-extrabold text-indigo-950 mb-2 font-heading group-hover:text-orange-600 transition-colors">{lesson.title}</h3>
                                      <p className="text-indigo-900/70 font-medium leading-relaxed mb-6 flex-1 text-sm">{lesson.description}</p>
                                      
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveSimulationId(lesson.id);
                                          setLevel(6);
                                        }}
                                        className={`mt-auto px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all bg-linear-to-r ${colors.btnBg} text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95`}
                                      >
                                        <span className="text-xs tracking-wide">Bắt đầu</span>
                                        <Play fill="currentColor" className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                            })}
                          </div>
                        ) : (
                          // Gamified sci-fi dashboard theme matching user request image style
                          <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto animate-in zoom-in-95 duration-500 py-4">
                            {/* Neon Header Banner */}
                            <div className="relative w-full mb-8 bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 border-3 border-cyan-400 rounded-3xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.45)] flex items-center justify-between overflow-hidden">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.25),transparent_50%)]"></div>
                              
                              <div className="flex items-center gap-4 relative z-10">
                                <div className="coin-3d-wrapper select-none mr-2">
                                  <div className="coin-3d-container">
                                    <div className="coin-3d">
                                      <div className="coin-3d-face coin-3d-front p-1.5">
                                        {selectedSub.logoUrl ? (
                                          <img 
                                            src={selectedSub.logoUrl} 
                                            alt={selectedSub.title} 
                                            className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]" 
                                            referrerPolicy="no-referrer" 
                                            onError={(e) => {
                                              (e.currentTarget as HTMLImageElement).src = "https://img.icons8.com/fluency/96/test-tube.png";
                                            }}
                                          />
                                        ) : (
                                          <Atom className="w-6 h-6 text-cyan-200" />
                                        )}
                                      </div>
                                      <div className="coin-3d-face coin-3d-back">
                                        <Atom className="w-6 h-6 text-rose-100" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-wide font-heading uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                  {selectedSub.title}
                                </h2>
                              </div>

                              <div className="relative z-10 shrink-0">
                                <Atom className="w-10 h-10 text-cyan-300 animate-[spin_10s_linear_infinite] filter drop-shadow-[0_0_6px_rgba(103,232,249,0.8)]" />
                              </div>
                            </div>

                            {/* Sci-fi Outer Card */}
                            <div className="w-full bg-linear-to-b from-indigo-950/80 to-slate-950/85 border-3 border-cyan-500/50 rounded-4xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                {selectedSub.lessons.map((lesson, idx) => {
                                  const themeColors = {
                                    blue: {
                                      badge: 'bg-gradient-to-br from-sky-400 to-blue-600 shadow-blue-500/50 border-sky-300',
                                      header: 'bg-gradient-to-r from-sky-500 to-blue-600 border-sky-400 text-white',
                                      iconContainer: 'bg-gradient-to-br from-sky-100 to-blue-100 border-sky-200 text-blue-600',
                                      lines: 'border-blue-100'
                                    },
                                    orange: {
                                      badge: 'bg-gradient-to-br from-amber-400 to-orange-600 shadow-orange-500/50 border-amber-300',
                                      header: 'bg-gradient-to-r from-amber-500 to-orange-600 border-orange-400 text-white',
                                      iconContainer: 'bg-gradient-to-br from-amber-100 to-orange-100 border-orange-200 text-orange-600',
                                      lines: 'border-orange-100'
                                    },
                                    red: {
                                      badge: 'bg-gradient-to-br from-orange-400 to-red-600 shadow-red-500/50 border-orange-300',
                                      header: 'bg-gradient-to-r from-orange-500 to-red-600 border-red-400 text-white',
                                      iconContainer: 'bg-gradient-to-br from-orange-100 to-red-100 border-red-200 text-red-600',
                                      lines: 'border-red-100'
                                    },
                                    green: {
                                      badge: 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-teal-500/50 border-emerald-300',
                                      header: 'bg-gradient-to-r from-emerald-500 to-teal-600 border-teal-400 text-white',
                                      iconContainer: 'bg-gradient-to-br from-emerald-100 to-teal-100 border-teal-200 text-teal-600',
                                      lines: 'border-teal-100'
                                    },
                                    purple: {
                                      badge: 'bg-gradient-to-br from-violet-400 to-fuchsia-600 shadow-fuchsia-500/50 border-violet-300',
                                      header: 'bg-gradient-to-r from-violet-500 to-fuchsia-600 border-fuchsia-400 text-white',
                                      iconContainer: 'bg-gradient-to-br from-violet-100 to-fuchsia-100 border-fuchsia-200 text-fuchsia-600',
                                      lines: 'border-fuchsia-100'
                                    }
                                  };
                                  const color = themeColors[lesson.theme] || themeColors.blue;

                                  return (
                                    <div
                                      key={lesson.id}
                                      onClick={() => {
                                        setActiveSimulationId(lesson.id);
                                        setLevel(6);
                                      }}
                                      className="relative bg-white rounded-3xl p-6 md:p-8 shadow-[0_12px_28px_rgba(0,0,0,0.18)] border-2 border-slate-200 flex items-stretch gap-6 group cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(6,182,212,0.25)] hover:border-cyan-400/80 transition-all duration-300 select-none overflow-visible min-h-[160px] text-slate-800"
                                    >
                                      {/* Top Left number badge */}
                                      <div className={`absolute -top-4 -left-4 w-9 h-9 rounded-full flex items-center justify-center text-sm md:text-base font-black text-white shadow-md border-2 ${color.badge} z-20 group-hover:scale-110 transition-transform`}>
                                        {idx + 1}
                                      </div>

                                      {/* Icon block left */}
                                      <div className={`w-24 rounded-2xl border flex items-center justify-center shrink-0 p-3 group-hover:scale-105 transition-transform ${color.iconContainer}`}>
                                        <lesson.icon className="w-10 h-10 drop-shadow-xs" weight="bold" />
                                      </div>

                                      {/* Contents right */}
                                      <div className="flex-1 flex flex-col justify-between text-left min-w-0">
                                        <div>
                                          <div className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-black tracking-wide border truncate mb-2.5 group-hover:shadow-sm ${color.header}`}>
                                            {lesson.title}
                                          </div>
                                          
                                          {/* Description / Content Review */}
                                          <p className="text-slate-500 text-[11px] md:text-xs font-bold leading-relaxed line-clamp-2 mb-2">
                                            {lesson.description}
                                          </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                                          <div className="text-slate-700 text-[10px] md:text-xs font-black tracking-wider uppercase select-none">
                                            BẮT ĐẦU THỰC HÀNH ⚡
                                          </div>

                                          <div className="w-1/3 space-y-1.5">
                                            <div className={`border-b-2 border-dashed w-full ${color.lines}`}></div>
                                            <div className={`border-b-2 border-dashed w-4/5 ${color.lines}`}></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )
                      ) : selectedSub.embedDocs && selectedSub.embedDocs.length > 0 ? (
                        <div className="relative z-10 flex flex-col w-full h-full max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar p-2">
                          <h3 className="text-2xl font-bold text-white text-left font-heading">{selectedSub.title} - Tài liệu Nhúng</h3>
                          {selectedSub.embedDocs.map((doc, idx) => (
                            <div key={idx} className="w-full shrink-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                              <div className="bg-slate-800 border-b border-slate-700 p-3 flex justify-between items-center">
                                <h4 className="text-white font-bold">{doc.title}</h4>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 group">
                                  <span>Mở tab mới</span>
                                  <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                              </div>
                              <iframe 
                                src={doc.url} 
                                className="w-full h-[600px] border-none bg-white" 
                                title={doc.title}
                                allowFullScreen
                              ></iframe>
                            </div>
                          ))}
                        </div>
                      ) : selectedSub.contentUrl ? (
                        <div className="relative z-10 flex flex-col items-center justify-center">
                          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 bg-linear-to-br ${selectedCategory.colorClass} shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-in zoom-in duration-500`}>
                            <selectedCategory.icon className="w-10 h-10 text-white drop-shadow-md" />
                          </div>
                          <p className="text-4xl font-black text-white mb-4 font-heading drop-shadow-md">{selectedSub.title}</p>
                          <p className="text-slate-300 max-w-lg mx-auto leading-relaxed text-lg mb-8">
                            Khởi chiếu công cụ AI <strong className="text-cyan-400 font-bold">{selectedSub.title}</strong>.
                          </p>
                          <a 
                            href={selectedSub.contentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:-translate-y-1"
                          >
                            <span className="text-lg tracking-wide uppercase">Mở {selectedSub.title}</span>
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center">
                          <Box className="w-24 h-24 text-slate-700 mb-8 group-hover:text-cyan-500/40 transition-colors duration-700 animate-pulse" />
                          <p className="text-3xl font-black text-slate-300 mb-4 font-heading drop-shadow-md">Tải Module Nhiệm vụ...</p>
                          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-lg">
                            Bộ khuếch đại tín hiệu không gian đang thiết lập kết nối tới <strong className="text-cyan-400 font-bold">{selectedSub.title}</strong>. Bạn có thể nhúng Frame hoặc WebGL 3D tại đây.
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
            {/* Cấp 4: Trang Giới thiệu */}
            {level === 4 && (
              <About onBack={goHome} />
            )}

            {/* Cấp 7: Trang Cộng đồng */}
            {level === 7 && (
              <CommunityPage onBack={goHome} />
            )}

            {/* Cấp 8: Bảng xếp hạng */}
            {level === 8 && (
              <Leaderboard onBack={goHome} />
            )}
          </main>
        </>
      )}
      </Suspense>
      </ErrorBoundary>

      <Footer onProfileClick={handleLogoClick} />
    </div>
    </MultiplayerProvider>
  );
}
