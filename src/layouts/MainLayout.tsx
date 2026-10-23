import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, ChevronRight, Box, Home, Users, Award, LayoutGrid, 
  UserCircle, Star, Sun, Moon, LogOut 
} from 'lucide-react';

import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ReviewModal } from '../components/ReviewModal';
import { categories, Category } from '../data';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useOnboardingTour } from '../hooks/useOnboardingTour';

export default function MainLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: firebaseLogout, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startTour } = useOnboardingTour();

  useEffect(() => {
    if (location.pathname === '/' && location.state?.startTour) {
      const timer = setTimeout(() => {
        startTour();
      }, 800);
      
      // Clean up the state so it doesn't trigger again on refresh
      navigate('/', { replace: true, state: {} });
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.state, startTour, navigate]);

  const handleLogout = async () => {
    await firebaseLogout();
    localStorage.removeItem('user_gemini_api_key');
    navigate('/');
  };

  const goHome = () => { setIsDrawerOpen(false); navigate('/'); };
  const handleAboutClick = () => { setIsDrawerOpen(false); navigate('/about'); };
  const handleLogoClick = () => { setIsDrawerOpen(false); navigate('/profile'); };
  const handleCommunityClick = () => { setIsDrawerOpen(false); navigate('/community'); };
  const handleLeaderboardClick = () => { setIsDrawerOpen(false); navigate('/leaderboard'); };
  const handleSelectCategory = (cat: Category) => { setIsDrawerOpen(false); navigate(`/category/${cat.id}`); };

  // Calculate selectedCategory based on current URL path
  const pathParts = location.pathname.split('/');
  const catId = pathParts[1] === 'category' || pathParts[1] === 'subcategory' ? pathParts[2] : null;
  const selectedCategory = catId ? categories.find(c => c.id === catId) : null;

  // Determine if we are on a page that shouldn't have the HeroTitle
  const isAbout = location.pathname === '/about';
  const isCommunity = location.pathname === '/community';
  const isLeaderboard = location.pathname === '/leaderboard';
  const hideHeroTitle = isAbout || isCommunity || isLeaderboard;

  return (
    <>
      <Header 
        onHomeClick={goHome} 
        onLogoutClick={handleLogout} 
        onSảnPhẩmClick={goHome}
        onCommunityClick={handleCommunityClick}
        onAboutClick={() => navigate('/about')}
        onLogoClick={handleLogoClick}
        onTourClick={() => {
          if (location.pathname !== '/') {
            navigate('/', { state: { startTour: true } });
          } else {
            startTour();
          }
        }}
        onLeaderboardClick={() => navigate('/leaderboard')}
        onReviewClick={() => setReviewOpen(true)}
        onMenuClick={() => setIsDrawerOpen(prev => !prev)}
      />
      <ReviewModal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} />

      {/* Quick Navigation Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] sm:w-85 max-w-sm bg-slate-900/95 backdrop-blur-2xl border-r border-white/10 z-70 p-5 sm:p-6 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white font-heading tracking-tight italic">LỐI TẮT</h2>
                  <p className="text-cyan-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Khoa học tự nhiên</p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Danh mục học tập */}
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2.5">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1">Danh mục sản phẩm</p>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className={`w-full flex items-center p-2.5 sm:p-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden cursor-pointer ${selectedCategory?.id === cat.id ? 'bg-white/10 border-white/30' : 'bg-white/5 hover:bg-white/8'}`}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-linear-to-r ${cat.colorClass} transition-opacity`} />
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-linear-to-br ${cat.colorClass} shadow-lg mr-3 shrink-0`}>
                      <cat.icon className="w-4.5 h-4.5 text-white" weight="duotone" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">{cat.title}</p>
                      <p className="text-[10.5px] text-slate-400 font-medium truncate">{cat.subtitle}</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-all ${selectedCategory?.id === cat.id ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}

                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1 pt-3">Tiện ích & Khám phá</p>
                <button 
                  onClick={handleCommunityClick}
                  className="w-full flex items-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all space-x-3 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Cộng đồng chia sẻ</span>
                </button>
                <button 
                  onClick={handleLeaderboardClick}
                  className="w-full flex items-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all space-x-3 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Bảng xếp hạng</span>
                </button>
                <button 
                  onClick={() => { setIsDrawerOpen(false); setReviewOpen(true); }}
                  className="w-full flex items-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all space-x-3 cursor-pointer"
                >
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Đánh giá ứng dụng</span>
                </button>
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
                    <span>Giao diện {theme === 'dark' ? 'Tối (Dark)' : 'Sáng (Light)'}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 uppercase font-semibold">Đổi</span>
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                <button 
                  onClick={handleAboutClick}
                  className="w-full py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Giới thiệu Giáo viên 4.0</span>
                </button>
                <button 
                  onClick={goHome}
                  className="w-full py-2.5 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all cursor-pointer"
                >
                  Về Trang Chủ
                </button>
                {currentUser && (
                  <button 
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 flex flex-col pt-20 sm:pt-24 lg:pt-28 pb-24 md:pb-12 z-10 animate-in fade-in duration-500">
        {!hideHeroTitle && (
          <div className="relative z-40 mb-2 md:mb-4 text-center flex flex-col items-center animate-in slide-in-from-top-4 duration-700 fade-in">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-indigo-950 dark:text-white uppercase drop-shadow-sm pb-1 font-heading leading-tight italic px-2">
              Giáo viên 4.0
            </h1>
            <p className="text-orange-600 font-extrabold text-[11px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase drop-shadow-sm mt-1">
              Trạm Vũ Trụ Tri Thức
            </p>
          </div>
        )}

        {/* CÁC TRANG CON SẼ RENDER Ở ĐÂY */}
        <Outlet context={{ isDrawerOpen, setIsDrawerOpen }} />
        
      </main>

      <Footer onProfileClick={handleLogoClick} />

      {/* Mobile Bottom Navigation Bar (Dành riêng cho màn hình điện thoại < md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/10 px-2 py-1 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.12)]">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            location.pathname === '/' ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Trang chủ</span>
        </button>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            isDrawerOpen ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Danh mục</span>
        </button>

        <button
          onClick={() => navigate('/community')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            location.pathname === '/community' ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Cộng đồng</span>
        </button>

        <button
          onClick={() => navigate('/leaderboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            location.pathname === '/leaderboard' ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Xếp hạng</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            location.pathname === '/profile' ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <UserCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Cá nhân</span>
        </button>
      </nav>
    </>
  );
}
