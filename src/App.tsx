import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Maximize, Minimize } from 'lucide-react';

import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { MultiplayerProvider } from './context/MultiplayerContext';
import { CatLoader } from './components/CatLoader';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layouts & Pages
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';

import { Login } from './components/Login';
import { About } from './components/About';
import { Profile } from './components/Profile';
import { CommunityPage } from './components/CommunityPage';
import { Leaderboard } from './components/Leaderboard';
import { LessonRenderer } from './components/LessonRenderer';
import { AIAssistant } from './components/AIAssistant';
import { FloatingGuide } from './components/FloatingGuide';

import { MultiplayerComponents } from './config/lessonRegistry';
import { categories } from './data';
const { Lobby, Room, StarRaceGame } = MultiplayerComponents;

function LessonWrapper() {
  const { simId } = useParams<{ simId: string }>();
  const navigate = useNavigate();

  if (!simId) return null;

  // Find the lesson to pass to AIAssistant
  let activeLesson = null;
  for (const cat of categories) {
    for (const sub of cat.subCategories) {
      if (sub.lessons) {
        const found = sub.lessons.find(l => l.id === simId);
        if (found) {
          activeLesson = found;
          break;
        }
      }
    }
    if (activeLesson) break;
  }

  return (
    <>
      <AIAssistant 
        contextTitle={activeLesson?.title || "Khoa học tự nhiên"} 
        contextDescription={activeLesson?.description || ""} 
      />
      <LessonRenderer
        activeSimulationId={simId}
        onExit={() => navigate(-1)}
        onExitToCategory={() => navigate('/')}
        onExitToSubcategory={() => navigate(-1)}
        onGoToBank={() => navigate('/lesson/game-hub')}
      />
    </>
  );
}

function StarRaceWrapper() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  return <StarRaceGame roomId={roomId!} onBack={() => navigate('/')} />;
}

export default function App() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const isFullscreenPage = location.pathname.startsWith('/lesson') || location.pathname.startsWith('/subcategory');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-200 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-500">
        <Login />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 items-center custom-scrollbar transition-colors duration-500">
      {/* Background Elements */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-slate-200 dark:bg-slate-950 bg-cover bg-center bg-no-repeat transition-colors duration-500"
        style={{ backgroundImage: 'url(https://i.postimg.cc/rsLy3gxh/bg-science.png)' }}
      >
        <div className="absolute inset-0 bg-slate-200/90 dark:bg-slate-950/10 backdrop-blur-[2px] transition-colors duration-500"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-400/10 dark:bg-cyan-400/40 blur-[120px] rounded-full animate-pulse transition-colors duration-500"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-500/10 dark:bg-fuchsia-500/40 blur-[120px] rounded-full animate-pulse delay-700 transition-colors duration-500"></div>
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-400/5 dark:bg-blue-400/30 blur-[100px] rounded-full transition-colors duration-500"></div>
      </div>

      {isFullscreenPage && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-9999 w-10 h-10 md:w-12 md:h-12 bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/20 transition-all hover:scale-110 flex items-center justify-center group"
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" /> : <Maximize className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />}
        </button>
      )}

      {location.pathname === '/' && <FloatingGuide />}

      <MultiplayerProvider>
        <ErrorBoundary onBack={() => window.location.href = '/'}>
          <Suspense fallback={<CatLoader />}>
            <Routes>
              {/* No layout routes */}
              <Route path="/lesson/:simId" element={<LessonWrapper />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/room/:roomId/play" element={<StarRaceWrapper />} />

              {/* Main layout routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:catId" element={<CategoryPage />} />
                <Route path="/subcategory/:catId/:subId" element={<SubcategoryPage />} />
                <Route path="/profile" element={<Profile onBack={() => window.history.back()} />} />
                <Route path="/about" element={<About onBack={() => window.history.back()} />} />
                <Route path="/community" element={<CommunityPage onBack={() => window.history.back()} />} />
                <Route path="/leaderboard" element={<Leaderboard onBack={() => window.history.back()} />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </MultiplayerProvider>
    </div>
  );
}
