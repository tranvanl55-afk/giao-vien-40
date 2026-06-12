import { lazy } from 'react';

// Helper for named exports
const lazyNamed = (factory: any, name: string) => lazy(() => factory().then((module: any) => ({ default: module[name] })));

/**
 * Back navigation target when exiting a lesson/simulation.
 * - 'subcategory' (level 3): Go back to the subcategory lesson list
 * - 'category' (level 2): Go back to the category grid
 */
type BackTarget = 'subcategory' | 'category';

interface LessonRegistryEntry {
  component: React.LazyExoticComponent<any>;
  backTarget: BackTarget;
  /** If true, this lesson needs `questions` prop (game-type lessons) */
  needsQuestions?: boolean;
  /** If true, render with fullscreen wrapper (like mindmap) */
  fullscreenWrapper?: boolean;
}

/**
 * Registry of all lesson/simulation components.
 * Adding a new simulation only requires adding one entry here.
 */
export const LESSON_REGISTRY: Record<string, LessonRegistryEntry> = {
  // ── KHTN 6 ─────────────────────────────────────────────────────
  'te-bao': {
    component: lazyNamed(() => import('../components/simulations/TeBaoSimulation'), 'TeBaoSimulation'),
    backTarget: 'subcategory',
  },
  'vi-khuan': {
    component: lazyNamed(() => import('../components/simulations/ViKhuanSimulation'), 'ViKhuanSimulation'),
    backTarget: 'subcategory',
  },
  'virus': {
    component: lazyNamed(() => import('../components/simulations/VirusSimulation'), 'VirusSimulation'),
    backTarget: 'subcategory',
  },
  'nguyen-sinh-vat': {
    component: lazyNamed(() => import('../components/simulations/NguyenSinhVatSimulation'), 'NguyenSinhVatSimulation'),
    backTarget: 'subcategory',
  },
  'bieu-dien-luc': {
    component: lazyNamed(() => import('../components/simulations/BieuDienLucSimulation'), 'BieuDienLucSimulation'),
    backTarget: 'subcategory',
  },
  'chuyen-the': {
    component: lazyNamed(() => import('../components/simulations/ChuyenTheSimulation'), 'ChuyenTheSimulation'),
    backTarget: 'subcategory',
  },
  'he-mat-troi': {
    component: lazyNamed(() => import('../components/simulations/HeMaTroiSimulation'), 'HeMaTroiSimulation'),
    backTarget: 'subcategory',
  },
  'tach-hon-hop': {
    component: lazyNamed(() => import('../components/simulations/TachHonHopSimulation'), 'TachHonHopSimulation'),
    backTarget: 'subcategory',
  },

  // ── KHTN 7 ─────────────────────────────────────────────────────
  'bang-tuan-hoan': {
    component: lazyNamed(() => import('../components/simulations/PeriodicTableApp'), 'PeriodicTableApp'),
    backTarget: 'subcategory',
  },
  'lien-ket-ion': {
    component: lazyNamed(() => import('../components/simulations/LienKetIonSimulation'), 'LienKetIonSimulation'),
    backTarget: 'subcategory',
  },
  'lien-ket-cong-hoa-tri': {
    component: lazyNamed(() => import('../components/simulations/LienKetCongHoaTriSimulation'), 'LienKetCongHoaTriSimulation'),
    backTarget: 'subcategory',
  },
  'do-thi-quang-duong': {
    component: lazyNamed(() => import('../components/simulations/DoThiQuangDuongThoiGian'), 'DoThiQuangDuongThoiGian'),
    backTarget: 'subcategory',
  },
  'bong-toi-nua-toi': {
    component: lazyNamed(() => import('../components/simulations/BongToiBongNuaToi'), 'BongToiBongNuaToi'),
    backTarget: 'subcategory',
  },
  'kien-tao-nguyen-tu': {
    component: lazyNamed(() => import('../components/simulations/KienTaoNguyenTuSimulation'), 'KienTaoNguyenTuSimulation'),
    backTarget: 'subcategory',
  },
  'phan-xa-anh-sang': {
    component: lazyNamed(() => import('../components/simulations/PhanXaAnhSangSimulation'), 'PhanXaAnhSangSimulation'),
    backTarget: 'subcategory',
  },
  'quang-hop': {
    component: lazyNamed(() => import('../components/simulations/QuangHopSimulation'), 'QuangHopSimulation'),
    backTarget: 'subcategory',
  },

  // ── KHTN 8 ─────────────────────────────────────────────────────
  'cac-he-co-quan': {
    component: lazyNamed(() => import('../components/simulations/CompleteAnatomySimulation'), 'CompleteAnatomySimulation'),
    backTarget: 'subcategory',
  },
  'moi-truong-trong-co-the': {
    component: lazyNamed(() => import('../components/simulations/InternalEnvironment'), 'InternalEnvironmentSimulation'),
    backTarget: 'subcategory',
  },
  'he-ho-hap': {
    component: lazyNamed(() => import('../components/simulations/RespiratorySystem'), 'RespiratorySystem'),
    backTarget: 'subcategory',
  },
  'he-van-dong': {
    component: lazyNamed(() => import('../components/simulations/MusculoskeletalSystem'), 'MusculoskeletalSystem'),
    backTarget: 'subcategory',
  },
  'he-tieu-hoa': {
    component: lazyNamed(() => import('../components/simulations/DigestiveSystem'), 'DigestiveSystem'),
    backTarget: 'subcategory',
  },
  'so-do-mach-dien': {
    component: lazyNamed(() => import('../components/simulations/CircuitSimulation'), 'CircuitSimulation'),
    backTarget: 'subcategory',
  },
  'dinh-luat-bao-toan-khoi-luong': {
    component: lazyNamed(() => import('../components/simulations/MassConservationSimulation'), 'MassConservationSimulation'),
    backTarget: 'subcategory',
  },
  'luc-day-archimedes': {
    component: lazyNamed(() => import('../components/simulations/LucDayArchimedesSimulation'), 'LucDayArchimedesSimulation'),
    backTarget: 'subcategory',
  },
  'don-bay-rong-roc': {
    component: lazyNamed(() => import('../components/simulations/DonBayRongRocSimulation'), 'DonBayRongRocSimulation'),
    backTarget: 'subcategory',
  },
  'co-xuong-khop': {
    component: lazyNamed(() => import('../components/simulations/CoXuongKhopSimulation'), 'CoXuongKhopSimulation'),
    backTarget: 'subcategory',
  },

  // ── KHTN 9 ─────────────────────────────────────────────────────
  'co-nang': {
    component: lazyNamed(() => import('../components/simulations/CoNangSimulation'), 'CoNangSimulation'),
    backTarget: 'subcategory',
  },
  'cong-suat': {
    component: lazyNamed(() => import('../components/simulations/CongSuatSimulation'), 'CongSuatSimulation'),
    backTarget: 'subcategory',
  },
  'khuc-xa': {
    component: lazyNamed(() => import('../components/simulations/KhucXaSimulation'), 'KhucXaSimulation'),
    backTarget: 'subcategory',
  },
  'dong-dien': {
    component: lazyNamed(() => import('../components/simulations/MachDienSimulation'), 'MachDienSimulation'),
    backTarget: 'subcategory',
  },
  'cam-ung': {
    component: lazyNamed(() => import('../components/simulations/CamUngSimulation'), 'CamUngSimulation'),
    backTarget: 'subcategory',
  },
  'kim-loai': {
    component: lazyNamed(() => import('../components/simulations/DayKimLoaiSimulation'), 'DayKimLoaiSimulation'),
    backTarget: 'subcategory',
  },
  'hop-chat-huu-co': {
    component: lazyNamed(() => import('../components/simulations/HopChatHuuCoSimulation'), 'HopChatHuuCoSimulation'),
    backTarget: 'subcategory',
  },
  'thau-kinh': {
    component: lazyNamed(() => import('../components/simulations/ThauKinhSimulation'), 'ThauKinhSimulation'),
    backTarget: 'subcategory',
  },
  'dot-bien-gen': {
    component: lazyNamed(() => import('../components/simulations/DotBienGenSimulation'), 'DotBienGenSimulation'),
    backTarget: 'subcategory',
  },
  'dong-co-mot-chieu': {
    component: lazyNamed(() => import('../components/simulations/DongCoMotChieuSimulation'), 'DongCoMotChieuSimulation'),
    backTarget: 'subcategory',
  },

  // ── Ôn tập & Công cụ ──────────────────────────────────────────
  'tao-de-kiem-tra': {
    component: lazyNamed(() => import('../components/simulations/TaoDeKiemTraApp'), 'TaoDeKiemTraApp'),
    backTarget: 'subcategory',
  },
  'phieu-bai-hoc': {
    component: lazyNamed(() => import('../components/simulations/PhieuBaiHocApp'), 'PhieuBaiHocApp'),
    backTarget: 'category',
  },
  'mindmap-app': {
    component: lazy(() => import('../components/simulations/MindmapApp')),
    backTarget: 'category',
    fullscreenWrapper: true,
  },
  'giao-an-ai': {
    component: lazyNamed(() => import('../components/simulations/GiaoAnAI'), 'GiaoAnAI'),
    backTarget: 'subcategory',
  },

  // ── Hoạt động trải nghiệm ─────────────────────────────────────
  'dinh-huong-nghe-nghiep': {
    component: lazyNamed(() => import('../components/simulations/DinhHuongNgheNghiepSimulation'), 'DinhHuongNgheNghiepSimulation'),
    backTarget: 'subcategory',
  },
  'thuoc-do-cam-xuc': {
    component: lazyNamed(() => import('../components/simulations/ThuocDoCamXucSimulation'), 'ThuocDoCamXucSimulation'),
    backTarget: 'subcategory',
  },
  'xu-ly-khung-hoang': {
    component: lazyNamed(() => import('../components/simulations/XuLyKhungHoangSimulation'), 'XuLyKhungHoangSimulation'),
    backTarget: 'subcategory',
  },
  'khoi-nghiep-cong-dong': {
    component: lazyNamed(() => import('../components/simulations/KhoiNghiepCongDongSimulation'), 'KhoiNghiepCongDongSimulation'),
    backTarget: 'subcategory',
  },
  'balo-sinh-ton': {
    component: lazyNamed(() => import('../components/simulations/BaloSinhTonSimulation'), 'BaloSinhTonSimulation'),
    backTarget: 'subcategory',
  },
  'thiet-ke-tuong-lai': {
    component: lazyNamed(() => import('../components/simulations/ThietKeTuongLaiSimulation'), 'ThietKeTuongLaiSimulation'),
    backTarget: 'subcategory',
  },

  // ── Giáo dục địa phương & Khác ────────────────────────────────
  'phong-tranh-panorama': {
    component: lazy(() => import('../components/simulations/PhongTranhPanorama')),
    backTarget: 'subcategory',
  },
  'video-tuong-tac': {
    component: lazyNamed(() => import('../components/simulations/VideoTuongTac'), 'VideoTuongTac'),
    backTarget: 'subcategory',
  },

  // ── AI / ML / Deep Learning ────────────────────────────────────
  'ml-regression': {
    component: lazyNamed(() => import('../components/simulations/MLRegressionSimulation'), 'MLRegressionSimulation'),
    backTarget: 'subcategory',
  },
  'ml-classification': {
    component: lazyNamed(() => import('../components/simulations/MLClassificationSimulation'), 'MLClassificationSimulation'),
    backTarget: 'subcategory',
  },
  'ml-clustering': {
    component: lazyNamed(() => import('../components/simulations/MLClusteringSimulation'), 'MLClusteringSimulation'),
    backTarget: 'subcategory',
  },
  'dl-ann': {
    component: lazyNamed(() => import('../components/simulations/DLANNSimulation'), 'DLANNSimulation'),
    backTarget: 'subcategory',
  },
  'dl-cnn': {
    component: lazyNamed(() => import('../components/simulations/DLCNNSimulation'), 'DLCNNSimulation'),
    backTarget: 'subcategory',
  },
  'dl-nlp': {
    component: lazyNamed(() => import('../components/simulations/DLNLPSimulation'), 'DLNLPSimulation'),
    backTarget: 'subcategory',
  },

  // ── Games (đơn giản, không cần questions) ──────────────────────
  'duck-race-game': {
    component: lazyNamed(() => import('../components/simulations/DuaVitGoiTenGame'), 'DuaVitGoiTenGame'),
    backTarget: 'category',
  },
  'game-hub': {
    component: lazyNamed(() => import('../components/games/GameHub'), 'GameHub'),
    backTarget: 'category',
  },
  'game-spin-wheel': {
    component: lazyNamed(() => import('../components/games/VongQuayGame'), 'VongQuayGame'),
    backTarget: 'category',
  },
  'game-dai-duong-ma-thuat': {
    component: lazyNamed(() => import('../components/games/DaiDuongMaThuatGame'), 'DaiDuongMaThuatGame'),
    backTarget: 'category',
  },

  // ── Games (cần questions prop) ─────────────────────────────────
  'game-star-race': {
    component: lazyNamed(() => import('../components/games/StarRaceGame'), 'StarRaceGame'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-puzzle-flip': {
    component: lazyNamed(() => import('../components/games/PuzzleFlipGame'), 'PuzzleFlipGame'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-keo-co': {
    component: lazyNamed(() => import('../components/games/KeoCoGame'), 'KeoCoGame'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-doi-khang': {
    component: lazyNamed(() => import('../components/games/GameDoiKhangGame'), 'GameDoiKhangGame'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-chem-hoa-qua': {
    component: lazyNamed(() => import('../components/games/ChemHoaQuaGame'), 'ChemHoaQuaGame'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-theo-luot': {
    component: lazyNamed(() => import('../components/games/GameTheoLuotGame'), 'GameTheoLuotGame'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-quiz': {
    component: lazyNamed(() => import('../components/games/GameQuiz'), 'GameQuiz'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-crossword': {
    component: lazyNamed(() => import('../components/games/CrosswordGame'), 'CrosswordGame'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-giai-ma-buc-tranh': {
    component: lazyNamed(() => import('../components/games/GiaiMaBucTranhGame'), 'GiaiMaBucTranhGame'),
    backTarget: 'category',
    needsQuestions: true,
  },
  'game-ai-la-trieu-phu': {
    component: lazyNamed(() => import('../components/games/AiLaTrieuPhuGame'), 'AiLaTrieuPhuGame'),
    backTarget: 'category',
    needsQuestions: true,
  },

  // ── Games (cần initialQuestions prop đặc biệt) ─────────────────
  'action-quiz-game': {
    component: lazyNamed(() => import('../components/simulations/ActionQuizGame'), 'ActionQuizGame'),
    backTarget: 'category',
  },
  'world-explorer-game': {
    component: lazyNamed(() => import('../components/simulations/KhamPhaTheGioiGame'), 'KhamPhaTheGioiGame'),
    backTarget: 'category',
  },
};

// Multiplayer components (separate because they use different routing)
export const MultiplayerComponents = {
  Lobby: lazyNamed(() => import('../components/games/Lobby'), 'Lobby'),
  Room: lazyNamed(() => import('../components/games/Room'), 'Room'),
  StarRaceGame: lazyNamed(() => import('../components/games/StarRaceGame'), 'StarRaceGame'),
};

// Generic lesson view fallback
export const GenericLessonView = lazyNamed(() => import('../components/GenericLessonView'), 'GenericLessonView');
