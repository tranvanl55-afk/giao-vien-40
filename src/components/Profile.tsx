import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Globe, Phone, Share2, GraduationCap, Briefcase, Award, Star, Rocket, ChevronRight, Lock, CheckCircle2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    postsCount: 0,
    skknCount: 0,
    points: 0,
    hasPopularPost: false
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchUserStats = async () => {
      setLoadingStats(true);
      try {
        const postsQuery = query(
          collection(db, 'community_posts'),
          where('userId', '==', currentUser.uid)
        );
        const postsSnap = await getDocs(postsQuery);
        const postsCount = postsSnap.size;
        
        let hasPopularPost = false;
        postsSnap.forEach(doc => {
          const data = doc.data();
          if (data.likes >= 5) {
            hasPopularPost = true;
          }
        });

        const skknQuery = query(
          collection(db, 'skkn_docs'),
          where('uploadedByEmail', '==', currentUser.email || '')
        );
        const skknSnap = await getDocs(skknQuery);
        const skknCount = skknSnap.size;

        const points = postsCount * 10 + skknCount * 25;

        setStats({
          postsCount,
          skknCount,
          points,
          hasPopularPost
        });
      } catch (e) {
        console.error("Error fetching stats:", e);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [currentUser]);
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-yellow-400 selection:text-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/80 backdrop-blur-md z-100 border-b border-black/5 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-yellow-400 font-black text-xs">L</span>
          </div>
          <span className="font-black tracking-tighter text-xl italic uppercase">Lĩnh <span className="text-blue-600">TV</span></span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-widest">
          <a href="#about" className="hover:text-blue-600 transition-colors">Giới thiệu</a>
          <a href="#education" className="hover:text-blue-600 transition-colors">Học vấn</a>
          <a href="#experience" className="hover:text-blue-600 transition-colors">Kinh nghiệm</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Liên hệ</a>
        </div>

        <button 
          onClick={onBack}
          className="flex items-center space-x-2 bg-yellow-400 px-4 py-2 rounded-full font-bold text-xs uppercase hover:bg-black hover:text-yellow-400 transition-all shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Về Hệ Thống</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col justify-center relative overflow-hidden bg-black text-white">
        <div className="absolute top-20 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 transform translate-x-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Main Title Area */}
        <div className="w-full max-w-7xl mx-auto relative z-20 flex flex-col items-center gap-10 md:gap-16 mt-8 md:mt-24">
          
          {/* Top: Intro Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="inline-block px-5 py-2 bg-yellow-400 text-black text-[10px] md:text-xs font-black uppercase tracking-[0.3em] rounded-md shadow-[0_0_20px_rgba(250,204,21,0.3)] animate-pulse">
              Welcome to my portfolio
            </div>
            <div className="inline-flex px-5 py-2 border border-blue-500/30 rounded-full bg-blue-500/10 backdrop-blur-sm">
              <p className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] whitespace-nowrap">
                Teacher 4.0
              </p>
            </div>
          </motion.div>

          {/* Huge typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12vw] sm:text-[10vw] xl:text-[9vw] font-black tracking-tighter leading-none italic uppercase flex justify-center items-center gap-4 sm:gap-6 md:gap-10 w-full text-center"
          >
             <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">TRẦN VĂN</span>
             <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.2)]">LĨNH</span>
          </motion.h1>

          {/* Bottom Info Row */}
          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mt-4">
            
            {/* Titles */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-2 md:gap-3 items-center md:items-end text-center md:text-right"
            >
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-slate-300 tracking-tight">
                Cử nhân Sư phạm Hóa học
              </p>
              <div className="w-16 h-[2px] bg-white/30 my-2" />
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-cyan-300 tracking-tight drop-shadow-md">
                Thạc sĩ Hóa lý
              </p>
            </motion.div>

            <div className="hidden md:block w-px h-32 bg-white/10"></div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-row justify-center gap-12 sm:gap-16"
            >
              <div className="space-y-1 group flex flex-col items-center">
                <p className="text-6xl md:text-7xl lg:text-8xl font-black text-white group-hover:text-yellow-400 transition-colors drop-shadow-lg">10+</p>
                <div className="flex flex-col items-center">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Năm kinh</p>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mt-0.5">nghiệm</p>
                </div>
              </div>
              <div className="w-px h-full min-h-16 bg-white/10 hidden sm:block"></div>
              <div className="space-y-1 group flex flex-col items-center">
                <p className="text-6xl md:text-7xl lg:text-8xl font-black text-white group-hover:text-cyan-400 transition-colors drop-shadow-lg">2+</p>
                <div className="flex flex-col items-center">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Thủ khoa</p>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Đầu ra / Đầu vào</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Platform Achievements Section */}
      <section className="py-20 px-6 md:px-12 bg-slate-950 text-white relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Platform Activity</span>
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mt-1">
                Thành tích hoạt động <span className="text-yellow-400">CỦA BẠN</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Hệ thống tự động ghi nhận đóng góp và trao tặng huy hiệu danh dự cho các giáo viên tích cực trên nền tảng.
            </p>
          </div>

          {currentUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left column: User stats summary card */}
              <div className="lg:col-span-1 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform animate-pulse" />
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover" 
                      alt=""
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-white truncate max-w-[150px]">{currentUser.displayName || 'Giáo viên'}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Thành viên</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Bài đăng Cộng đồng</span>
                      <span className="text-white font-bold">{stats.postsCount} bài</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Tài liệu / SKKN</span>
                      <span className="text-white font-bold">{stats.skknCount} tài liệu</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Điểm đóng góp</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-cyan-400 tracking-tight">{stats.points}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Points</span>
                  </div>
                </div>
              </div>

              {/* Right column: Badges grid */}
              <div className="lg:col-span-3 space-y-6">
                <h3 className="text-lg font-black uppercase text-slate-300 tracking-wider">Huy hiệu đạt được</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Badge 1 */}
                  <div className={`p-6 border rounded-3xl flex items-start gap-4 transition-all duration-300 ${stats.postsCount >= 3 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stats.postsCount >= 3 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-500'}`}>
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-white">Giáo viên Tích cực</h4>
                        {stats.postsCount >= 3 && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Đạt được bằng cách chia sẻ 3 bài đăng trên bảng tin cộng đồng (Hiện tại: {stats.postsCount}/3).</p>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className={`p-6 border rounded-3xl flex items-start gap-4 transition-all duration-300 ${stats.skknCount >= 1 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stats.skknCount >= 1 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-white">Chuyên gia Chia sẻ</h4>
                        {stats.skknCount >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Đạt được khi đăng tải sáng kiến kinh nghiệm đầu tiên lên hệ thống (Hiện tại: {stats.skknCount}/1).</p>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className={`p-6 border rounded-3xl flex items-start gap-4 transition-all duration-300 ${stats.hasPopularPost ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stats.hasPopularPost ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-500'}`}>
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-white">Người Truyền Cảm Hứng</h4>
                        {stats.hasPopularPost && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Sở hữu ít nhất 1 bài viết cộng đồng nhận được từ 5 lượt yêu thích (likes) trở lên.</p>
                    </div>
                  </div>

                  {/* Badge 4 */}
                  <div className={`p-6 border rounded-3xl flex items-start gap-4 transition-all duration-300 ${stats.points >= 50 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stats.points >= 50 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25' : 'bg-slate-800 text-slate-500'}`}>
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-white">Thành viên Ưu tú</h4>
                        {stats.points >= 50 && <CheckCircle2 className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Tích lũy tổng điểm đóng góp của cá nhân đạt mốc 50 điểm (Hiện tại: {stats.points}/50).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white/5 border border-white/10 rounded-[3rem] space-y-4">
              <Lock className="w-12 h-12 text-yellow-400 mx-auto animate-pulse" />
              <h3 className="text-xl font-extrabold text-white">Tính năng yêu cầu đăng nhập</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">Vui lòng đăng nhập tài khoản của bạn để hệ thống tự động đồng bộ thống kê đóng góp và hiển thị các huy hiệu thành tích của bạn.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl font-black tracking-tight uppercase italic leading-[0.9]">
              GIỚI THIỆU <br />
              <span className="text-blue-600">BẢN THÂN</span>
            </h2>
            <div className="space-y-4 text-lg text-slate-600 font-medium leading-relaxed">
              <p>
                Sinh ngày <span className="text-black font-bold">01/01/1993</span>, tôi là một người đam mê khoa học và giáo dục. 
                Với nền tảng vững chắc trong ngành Hóa học, tôi luôn tìm cách kết hợp lý thuyết hàn lâm với ứng dụng công nghệ hiện đại.
              </p>
              <p>
                Tầm nhìn của tôi là xây dựng môi trường giáo dục 4.0, nơi học sinh được tiếp cận kiến thức thông qua những công cụ trực quan và trí tuệ nhân tạo.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-yellow-400 hover:text-black transition-all">
                Download CV
              </button>
              <button className="px-8 py-3 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all">
                Dự án
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-yellow-400 rounded-[3rem] relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Rocket className="w-32 h-32 text-black/20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
               </div>
            </div>
            <div className="absolute -bottom-6 -right-6 p-10 bg-white shadow-2xl rounded-3xl border border-black/5 max-w-[200px]">
              <p className="text-sm font-black italic">"Công nghệ là cánh tay nối dài của tri thức."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Education & Achievements Section */}
      <section id="education" className="py-32 px-6 md:px-12 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
              HỌC VẤN & <br />
              <span className="text-yellow-400">THÀNH TÍCH</span>
            </h2>
            <p className="max-w-md text-slate-400 text-lg">
              Nỗ lực không ngừng nghỉ trong hành trình chinh phục những đỉnh cao kiến thức Hóa học.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
               whileHover={{ y: -10 }}
               className="p-12 bg-white/5 border border-white/10 rounded-[3rem] space-y-6 hover:bg-white/10 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight">Thạc sĩ Hóa lý</h3>
              <p className="text-slate-400 font-medium">Chuyên ngành Hóa lý thuyết và Hóa lý. Một hành trình nghiên cứu sâu rộng về bản chất của vật chất.</p>
              <div className="pt-6 border-t border-white/10">
                <p className="text-yellow-400 font-black text-xs uppercase tracking-[0.2em] mb-2">Thành tích nổi bật</p>
                <div className="flex items-center space-x-3 text-white font-bold">
                  <Award className="w-6 h-6 text-blue-500" />
                  <span>THỦ KHOA ĐẦU VÀO</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
               whileHover={{ y: -10 }}
               className="p-12 bg-white/5 border border-white/10 rounded-[3rem] space-y-6 hover:bg-white/10 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight">Cử nhân Sư phạm Hóa</h3>
              <p className="text-slate-400 font-medium">Tốt nghiệp Đại học Sư phạm TP.HCM. Đặt nền móng cho kỹ năng sư phạm chuyên nghiệp.</p>
              <div className="pt-6 border-t border-white/10">
                <p className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-2">Thành tích nổi bật</p>
                <div className="flex items-center space-x-3 text-white font-bold">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <span>THỦ KHOA ĐẦU RA</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex items-center space-x-6">
            <div className="h-[2px] flex-1 bg-black/10" />
            <h2 className="text-4xl font-black uppercase tracking-tight italic">KINH NGHIỆM</h2>
            <div className="h-[2px] w-20 bg-blue-600" />
          </div>

          <div className="space-y-12">
            {[
              { year: "2022 - NAY", title: "Giáo viên KHTN", place: "THCS Ngô Chí Quốc", desc: "Tiên phong trong việc số hóa học liệu và ứng dụng AI vào giảng dạy trực tiếp." },
              { year: "2019 - 2022", title: "Giáo viên Hóa học", place: "PTNK Thể Thao Olympic", desc: "Giảng dạy bộ môn Hóa học và bồi dưỡng học sinh năng khiếu." },
              { year: "2015 - 2018", title: "Giáo viên Hóa học", place: "THPT Sông Đốc", desc: "Giảng dạy bộ môn Hóa học cấp trung học phổ thông." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-6 md:items-center justify-between group p-8 hover:bg-slate-50 rounded-[2.5rem] transition-all"
              >
                <div className="space-y-1">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{item.year}</p>
                  <h4 className="text-2xl font-black uppercase">{item.title}</h4>
                  <p className="text-slate-400 font-bold">{item.place}</p>
                </div>
                <div className="max-w-md">
                   <p className="text-slate-600 font-medium italic">{item.desc}</p>
                </div>
                <div className="hidden md:block">
                   <ChevronRight className="w-8 h-8 text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-12 bg-yellow-400">
        <div className="max-w-7xl mx-auto rounded-[4rem] bg-black p-12 md:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-tight">
                HÃY <span className="text-yellow-400">KẾT NỐI</span> <br />
                VỚI TÔI
              </h2>
              <p className="text-slate-400 font-medium text-lg">
                Sẵn sàng hợp tác trong các dự án giáo dục số, chuyển đổi số 
                hoặc chia sẻ kiến thức về Hóa học & AI.
              </p>
              
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all">
                  <Share2 className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                  <Phone className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-6">
               <div className="space-y-2">
                 <p className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</p>
                 <p className="text-xl font-bold tracking-tight">linhtv.edu@gmail.com</p>
               </div>
               <div className="space-y-2">
                 <p className="text-xs font-black uppercase tracking-widest text-slate-500">Official Website</p>
                 <p className="text-xl font-bold tracking-tight">www.linhtv.online</p>
               </div>
               <div className="pt-8">
                 <button className="w-full py-4 bg-yellow-400 text-black font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-xl shadow-yellow-400/20">
                    Gửi tin nhắn ngay
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-black/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 italic">
            © 2024 PORTFOLIO — TRẦN VĂN LĨNH — ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest ">
             <a href="#" className="hover:text-blue-600">Facebook</a>
             <a href="#" className="hover:text-blue-600">YouTube</a>
             <a href="#" className="hover:text-blue-600">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
