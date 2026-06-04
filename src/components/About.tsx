import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Rocket, Shield, Target, Users, Code, Zap } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export function About({ onBack }: AboutProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center space-x-2 text-cyan-400 font-bold hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase tracking-widest text-sm text-outline">Quay lại Trang Chủ</span>
      </button>

      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic font-heading tracking-tighter text-outline-strong drop-shadow-[0_4px_10px_rgba(34,211,238,0.5)]">
                GIÁO VIÊN 4.0
              </h1>
              <p className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mt-1">Sứ mệnh nâng tầm tri thức số</p>
            </div>
          </div>

          <div className="space-y-10 text-slate-200">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Target className="w-6 h-6 text-cyan-400" />
                <span>Tầm nhìn</span>
              </h2>
              <p className="text-lg leading-relaxed font-medium">
                Chúng tôi hướng tới việc xây dựng một hệ sinh thái giáo dục hiện đại, nơi công nghệ AI và các công cụ số 
                không chỉ là phương tiện mà là người bạn đồng hành tin cậy của mỗi giáo viên. <span className="text-cyan-400 font-bold">Giáo viên 4.0</span> 
                là cầu nối đưa tri thức toàn cầu đến gần hơn với lớp học Việt Nam.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
                <Users className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-bold text-white mb-2">Dành cho cộng đồng</h3>
                <p className="text-sm text-slate-400">Xây dựng mạng lưới giáo viên năng động, sáng tạo và sẵn sàng chia sẻ.</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
                <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="font-bold text-white mb-2">Tốc độ & Hiệu quả</h3>
                <p className="text-sm text-slate-400">Tối ưu hóa thời gian soạn bài và quản lý lớp học bằng AI thế hệ mới.</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
                <Shield className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="font-bold text-white mb-2">An toàn & Bảo mật</h3>
                <p className="text-sm text-slate-400">Đảm bảo dữ liệu và quyền riêng tư của người dùng luôn được đặt lên hàng đầu.</p>
              </div>
            </div>

            <section className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Code className="w-6 h-6 text-cyan-400" />
                <span>Đội ngũ phát triển</span>
              </h2>
              <p className="leading-relaxed">
                Dự án được khởi xướng bởi <span className="text-white font-bold">Lĩnh TV</span> và cộng đồng giáo viên yêu công nghệ. 
                Chúng tôi không ngừng cập nhật và làm mới những xu hướng giáo dục hiện đại nhất để phục vụ sự nghiệp trồng người.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform cursor-default">
                  #Education4.0
                </div>
                <div className="px-6 py-3 bg-white/10 rounded-full text-white font-bold border border-white/10 hover:bg-white/20 transition-all cursor-default">
                  #AISchool
                </div>
                <div className="px-6 py-3 bg-purple-600/30 border border-purple-500/30 rounded-full text-purple-200 font-bold hover:bg-purple-600/40 transition-all cursor-default">
                  #TeacherCommunity
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-slate-500 text-sm font-medium uppercase tracking-[0.3em]">
        © 2024 TRẠM VŨ TRỤ TRI THỨC - LĨNH TV
      </div>
    </div>
  );
}
