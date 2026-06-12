import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronRight, Box } from 'lucide-react';

import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ReviewModal } from '../components/ReviewModal';
import { categories, Category } from '../data';
import { useAuth } from '../context/AuthContext';
import { useOnboardingTour } from '../hooks/useOnboardingTour';

export default function MainLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: firebaseLogout } = useAuth();
  const { startTour } = useOnboardingTour();

  const handleLogout = async () => {
    await firebaseLogout();
    localStorage.removeItem('user_gemini_api_key');
    navigate('/');
  };

  const goHome = () => navigate('/');
  const handleAboutClick = () => { setIsDrawerOpen(false); navigate('/about'); };
  const handleLogoClick = () => { setIsDrawerOpen(false); navigate('/profile'); };
  const handleCommunityClick = () => { setIsDrawerOpen(false); navigate('/community'); };
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
        onTourClick={startTour}
        onLeaderboardClick={() => navigate('/leaderboard')}
        onReviewClick={() => setReviewOpen(true)}
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
                    onClick={() => handleSelectCategory(cat)}
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

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col pt-24 lg:pt-28 pb-20 z-10 animate-in fade-in duration-500">
        {!hideHeroTitle && (
          <div className="relative z-40 mb-2 md:mb-4 text-center flex flex-col items-center animate-in slide-in-from-top-4 duration-700 fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-indigo-950 uppercase drop-shadow-sm pb-1 font-heading leading-tight italic px-2">
              Giáo viên 4.0
            </h1>
            <p className="text-orange-600 font-extrabold text-xs md:text-sm tracking-[0.3em] uppercase drop-shadow-sm mt-1">
              Trạm Vũ Trụ Tri Thức
            </p>
          </div>
        )}

        {/* CÁC TRANG CON SẼ RENDER Ở ĐÂY */}
        <Outlet context={{ isDrawerOpen, setIsDrawerOpen }} />
        
      </main>

      <Footer onProfileClick={handleLogoClick} />
    </>
  );
}
