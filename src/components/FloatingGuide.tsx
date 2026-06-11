import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  House, BookOpenText, GameController, Robot, Sparkle, Rocket,
  MapTrifold, Flask, Atom, Brain, Question, ArrowRight
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

interface GuideStep {
  icon: React.ReactNode;
  emoji: string;
  title: string;
  description: string;
  tips: string[];
  color: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    icon: <House size={32} weight="duotone" />,
    emoji: '🏠',
    title: 'Trang Chủ – 8 Danh Mục',
    description: 'Màn hình chính hiển thị 8 danh mục lớn. Di chuột vào icon để xem tên danh mục, click để vào bên trong.',
    tips: [
      'Cuộn ngang để xem tất cả icon trên mobile',
      'Danh mục "Trò chơi học tập" chứa các game tương tác',
      'Mục "Công cụ Hot" ở dưới hiện các công cụ dùng gần đây',
    ],
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: <BookOpenText size={32} weight="duotone" />,
    emoji: '📚',
    title: 'Điều Hướng – Chọn Bài Học',
    description: 'Sau khi chọn danh mục, bạn thấy danh sách bài học/công cụ con. Click vào thẻ để mở.',
    tips: [
      'Nút "← Quay lại Trang Chủ" ở trên trái để về màn hình chính',
      'Một số mục mở trang web ngoài trong tab mới',
      'Các mục có icon sẽ dẫn đến trải nghiệm tương tác',
    ],
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: <GameController size={32} weight="duotone" />,
    emoji: '🎮',
    title: 'Trò Chơi Học Tập',
    description: 'Click vào "Trò chơi học tập" để thấy tất cả 12+ game tương tác. Mỗi game có cơ chế chơi khác nhau.',
    tips: [
      '⭐ Cuộc Đua Ngôi Sao: 2 đội trả lời đồng thời',
      '🎲 Game Theo Lượt: xúc xắc + câu hỏi cho 2-4 người',
      '🍎 Chém Hoa Quả: click trái cây đúng đáp án',
      '🧩 Lật Mảnh Ghép: upload ảnh rồi lật từng mảnh',
    ],
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: <Robot size={32} weight="duotone" />,
    emoji: '🤖',
    title: 'Ngân Hàng Câu Hỏi',
    description: 'Trong "Kho Game Học Tập", nhấn nút "Câu hỏi" để quản lý ngân hàng câu hỏi dùng chung cho tất cả game.',
    tips: [
      '✏️ Nhập tay: gõ câu hỏi và 4 đáp án',
      '📷 Quét ảnh AI: upload ảnh đề bài, AI tự trích xuất',
      '💾 Câu hỏi được lưu tự động vào thiết bị',
      '📋 Các game dùng câu hỏi mặc định nếu chưa thêm',
    ],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: <Sparkle size={32} weight="duotone" />,
    emoji: '✨',
    title: 'Công Cụ AI & Tiện Ích',
    description: 'Ngoài game, có nhiều công cụ hỗ trợ giảng dạy: tạo đề kiểm tra, mô phỏng vật lý, bảng tuần hoàn, v.v.',
    tips: [
      '🧪 Mô phỏng thí nghiệm vật lý/hóa học trực quan',
      '📝 Tạo đề kiểm tra tự động bằng AI',
      '🌍 Khám phá thế giới qua bản đồ tương tác',
      '⚗️ Bảng tuần hoàn nguyên tố đầy đủ',
    ],
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: <Rocket size={32} weight="duotone" />,
    emoji: '🚀',
    title: 'Mẹo Sử Dụng Hiệu Quả',
    description: 'Một số mẹo hay để tận dụng tối đa nền tảng trong tiết học.',
    tips: [
      '🎯 Thêm câu hỏi vào Kho Game trước khi bắt đầu tiết học',
      '📱 Có thể dùng trên điện thoại/máy tính bảng',
      '🔥 Mục "Công cụ Hot" ghi nhớ các công cụ hay dùng',
      '👥 Các game đội nhóm hoạt động tốt nhất trên màn hình lớn',
    ],
    color: 'from-sky-500 to-indigo-600',
  },
];

const GUIDE_SEEN_KEY = 'guide_seen_v1';

export function FloatingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(GUIDE_SEEN_KEY);
    if (!seen) {
      setIsFirstVisit(true);
      setTimeout(() => setShowTooltip(true), 3000);
      setTimeout(() => setShowTooltip(false), 9000);
    }
  }, []);

  const openGuide = () => {
    setIsOpen(true);
    setStep(0);
    setShowTooltip(false);
    localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    setIsFirstVisit(false);
  };

  const closeGuide = () => setIsOpen(false);
  const prev = () => setStep(s => Math.max(0, s - 1));
  const next = () => {
    if (step < GUIDE_STEPS.length - 1) setStep(s => s + 1);
    else closeGuide();
  };

  const current = GUIDE_STEPS[step];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-8 right-8 md:bottom-10 md:right-12 z-9998 flex flex-col items-end gap-3">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 16, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.9 }}
              className="relative bg-slate-900/95 border border-white/20 rounded-2xl px-4 py-3 shadow-2xl max-w-[210px] backdrop-blur-xl"
            >
              <p className="text-white font-bold text-sm leading-snug">👋 Bạn cần hướng dẫn không?</p>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">Nhấn vào đây để xem hướng dẫn sử dụng!</p>
              <div className="absolute -bottom-1.5 right-7 w-3 h-3 bg-slate-900 border-b border-r border-white/20 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={openGuide}
          animate={{ 
            y: [0, -20, 0],
            x: [0, -15, 10, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          title="Hướng dẫn sử dụng"
          className="relative flex items-center justify-center cursor-pointer hover:z-50"
        >
          {isFirstVisit && (
            <>
              <span className="absolute inset-4 rounded-full bg-cyan-400/50 animate-ping -z-10" />
              <span className="absolute inset-4 rounded-full bg-cyan-300/20 animate-pulse -z-10" />
            </>
          )}
          <img
            src="https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fimg1.gif?alt=media&token=22c2ec59-d851-45c7-943d-7bc406be92f1"
            alt="Trợ lý hướng dẫn"
            className="w-32 sm:w-40 h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          />
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeGuide}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm z-9999"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 48 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 48 }}
              transition={{ type: 'spring', bounce: 0.28, duration: 0.5 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:bottom-24 md:right-6 md:w-[430px]
                z-10000 bg-slate-900/95 backdrop-blur-xl border border-white/12
                rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden"
            >
              {/* Gradient header */}
              <div className={`bg-linear-to-br ${current.color} p-5 relative overflow-hidden`}>
                {/* Shine */}
                <div className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.18) 0%, transparent 55%)' }} />
                {/* Noise texture */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {/* Icon box */}
                    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25 shadow-inner text-white">
                      {current.icon}
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">
                        Bước {step + 1} / {GUIDE_STEPS.length}
                      </p>
                      <h2 className="text-white font-black text-base leading-tight">{current.title}</h2>
                    </div>
                  </div>
                  <button onClick={closeGuide}
                    className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition-all border border-white/20">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Big decorative emoji */}
                <div className="absolute -bottom-5 -right-3 text-8xl opacity-20 select-none pointer-events-none leading-none">
                  {current.emoji}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 pb-3">
                <AnimatePresence mode="wait">
                  <motion.div key={step}
                    initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {current.description}
                    </p>
                    <div className="space-y-2">
                      {current.tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex items-start gap-2.5 bg-white/5 rounded-xl px-3 py-2.5 border border-white/8"
                        >
                          <ArrowRight size={14} weight="bold" className="text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-200 leading-relaxed">{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 py-3">
                {GUIDE_STEPS.map((_, i) => (
                  <button key={i} onClick={() => setStep(i)}
                    className={`rounded-full transition-all duration-300 ${i === step
                      ? 'w-7 h-2 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={prev} disabled={step === 0}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/15
                    disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm font-bold text-white border border-white/10">
                  <ChevronLeft className="w-4 h-4" /> Trước
                </button>
                <motion.button
                  onClick={next}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm transition-all
                    ${step === GUIDE_STEPS.length - 1
                      ? 'bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_24px_rgba(6,182,212,0.4)] border border-cyan-400/30'
                      : 'bg-white/8 hover:bg-white/15 text-white border border-white/10'}`}>
                  {step === GUIDE_STEPS.length - 1 ? (
                    <><Rocket size={16} weight="duotone" /> Bắt đầu khám phá!</>
                  ) : (
                    <>Tiếp theo <ChevronRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
