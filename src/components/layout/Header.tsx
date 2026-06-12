import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserProgress } from '../../context/UserProgressContext';
import { 
  Sun, Moon, Bell, Check, Trash2, Award, UserCircle, LogOut, Star,
  FlaskConical, ClipboardCheck, Gamepad2, BookOpen, Sparkles, ChevronRight,
  Home, Users, Info, Map
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

import { db } from '../../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  writeBatch,
  doc,
  deleteDoc,
} from 'firebase/firestore';

interface HeaderProps {
  onHomeClick: () => void;
  onLogoutClick?: () => void;
  onSảnPhẩmClick?: () => void;
  onCommunityClick?: () => void;
  onAboutClick?: () => void;
  onLogoClick?: () => void;
  onTourClick?: () => void;
  onLeaderboardClick?: () => void;
  onReviewClick?: () => void;
}

interface NotificationItem {
  id: string;
  userId: string;
  senderName: string;
  senderAvatar: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: any;
}

export function Header({
  onHomeClick,
  onLogoutClick,
  onSảnPhẩmClick,
  onCommunityClick,
  onAboutClick,
  onLogoClick,
  onTourClick,
  onLeaderboardClick,
  onReviewClick,
}: HeaderProps) {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { points } = useUserProgress();
  const userName = currentUser?.displayName || 'Tài khoản';

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Load real‑time notifications
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [currentUser.uid, 'all'])
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: NotificationItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as NotificationItem);
      });
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setNotifications(list);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    if (!currentUser) return;
    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
        if (!n.read) {
          const ref = doc(db, 'notifications', n.id);
          batch.update(ref, { read: true });
        }
      });
      await batch.commit();
    } catch (e) {
      console.error('Error marking read:', e);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (e) {
      console.error('Error deleting notification:', e);
    }
  };

  const getActiveItemName = (): string => {
    if (path === '/') return 'home';
    if (path.startsWith('/category') || path.startsWith('/subcategory') || path.startsWith('/lesson')) return 'products';
    if (path === '/community') return 'community';
    if (path === '/leaderboard') return 'leaderboard';
    if (path === '/about') return 'about';
    return '';
  };

  const handleItemClick = (action: () => void) => {
    setShowUserDropdown(false);
    action();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUserDropdown(prev => !prev);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animate user dropdown menu
  useEffect(() => {
    if (!userDropdownRef.current) return;
    const items = userDropdownRef.current.querySelectorAll('.dropdown-item');

    if (showUserDropdown) {
      gsap.killTweensOf([userDropdownRef.current, items]);
      
      gsap.set(userDropdownRef.current, { 
        display: 'block', 
        opacity: 0, 
        y: 12, 
        scale: 0.96 
      });
      gsap.set(items, { 
        opacity: 0, 
        x: -8 
      });

      gsap.to(userDropdownRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power3.out'
      });

      gsap.to(items, {
        opacity: 1,
        x: 0,
        stagger: 0.03,
        duration: 0.25,
        ease: 'power2.out',
        delay: 0.05
      });
    } else {
      gsap.killTweensOf([userDropdownRef.current, items]);
      
      gsap.to(userDropdownRef.current, {
        opacity: 0,
        y: 8,
        scale: 0.96,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(userDropdownRef.current, { display: 'none' });
        }
      });
    }
  }, [showUserDropdown]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-xl border-b border-white/50 select-none shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div onClick={onLogoClick} className="logo-container cursor-pointer flex items-center group">
          <span className="text-xl md:text-2xl font-black tracking-tighter text-indigo-950 uppercase group-hover:text-orange-600 transition-colors drop-shadow-sm">
            Lĩnh TV
          </span>
        </div>

        {/* Nav (Desktop) */}
        <nav className="hidden md:flex items-center relative h-14 px-1 bg-white/40 border border-indigo-200/50 rounded-full shadow-inner magic-nav overflow-visible mt-2">
          <ul className="flex items-center relative">
            {/* The Indicator */}
            {(() => {
              const navItems = [
                { path: '/', show: true },
                { path: '/community', show: !!onCommunityClick },
                { path: '/leaderboard', show: !!onLeaderboardClick },
                { path: '/about', show: true },
                { path: '/tour', show: !!onTourClick },
              ].filter(item => item.show);
              const activeIndex = navItems.findIndex(item => item.path === path);
              
              if (activeIndex === -1) return null;
              // indicator offset calculation: 60px width per item + 6px offset to center the 48px pill
              const leftPos = activeIndex * 60 + 6;
              
              return (
                <div 
                  className="magic-indicator" 
                  style={{ transform: `translateX(${leftPos}px)` }}
                ></div>
              );
            })()}

            {/* Items */}
            <li className={path === '/' ? 'active' : ''}>
              <a onClick={onHomeClick} title="Trang chủ">
                <span className="icon"><Home className={`w-5 h-5 icon-shadow transition-colors duration-500 ${path === '/' ? 'text-white' : 'text-indigo-900 hover:text-orange-600'}`} /></span>
              </a>
            </li>

            {onCommunityClick && (
              <li className={path === '/community' ? 'active' : ''}>
                <a onClick={onCommunityClick} title="Cộng đồng">
                  <span className="icon"><Users className={`w-5 h-5 icon-shadow transition-colors duration-500 ${path === '/community' ? 'text-white' : 'text-indigo-900 hover:text-orange-600'}`} /></span>
                </a>
              </li>
            )}

            {onLeaderboardClick && (
              <li className={path === '/leaderboard' ? 'active' : ''}>
                <a onClick={onLeaderboardClick} title="Xếp hạng">
                  <span className="icon"><Award className={`w-5 h-5 icon-shadow transition-colors duration-500 ${path === '/leaderboard' ? 'text-white' : 'text-indigo-900 hover:text-orange-600'}`} /></span>
                </a>
              </li>
            )}

            <li className={path === '/about' ? 'active' : ''}>
              <a onClick={onAboutClick} title="Giới thiệu">
                <span className="icon"><Info className={`w-5 h-5 icon-shadow transition-colors duration-500 ${path === '/about' ? 'text-white' : 'text-indigo-900 hover:text-orange-600'}`} /></span>
              </a>
            </li>

            {onTourClick && (
              <li className={path === '/tour' ? 'active' : ''}>
                <a onClick={onTourClick} title="Hướng dẫn">
                  <span className="icon"><Map className={`w-5 h-5 icon-shadow transition-colors duration-500 ${path === '/tour' ? 'text-white' : 'text-indigo-900 hover:text-orange-600'}`} /></span>
                </a>
              </li>
            )}

            {/* Divider */}
            <div className="w-px h-8 bg-indigo-200/40 mx-2"></div>

            {/* Action Items */}
            <li className="flex justify-center items-center w-[60px] h-[56px]">
              <a onClick={onReviewClick} title="Đánh giá" className="cursor-pointer">
                <span className="icon"><Star className="w-5 h-5 icon-shadow text-indigo-900 hover:text-orange-600 transition-colors duration-500" /></span>
              </a>
            </li>

            {currentUser && (
              <li className="flex justify-center items-center w-[60px] h-[56px] relative">
                <a onClick={() => setShowNotifDropdown(!showNotifDropdown)} title="Thông báo" className="cursor-pointer relative">
                  <span className="icon"><Bell className="w-5 h-5 icon-shadow text-indigo-900 hover:text-orange-600 transition-colors duration-500" /></span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white z-20">
                      {unreadCount}
                    </span>
                  )}
                </a>
                {showNotifDropdown && (
                  <div className="absolute right-0 top-14 w-80 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-white backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                      <h4 className="font-extrabold text-xs tracking-wider uppercase text-cyan-400">
                        Thông báo ({unreadCount})
                      </h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Đọc tất cả
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-550 font-bold">Không có thông báo mới</p>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className={`p-2.5 rounded-xl border flex gap-3 transition-colors relative group ${item.read ? 'bg-slate-950/20 border-white/5' : 'bg-indigo-500/10 border-indigo-500/20'}`}
                          >
                            <img
                              src={item.senderAvatar}
                              className="w-8 h-8 rounded-full border border-white/10 shrink-0 object-cover"
                              alt=""
                            />
                            <div className="flex-1 min-w-0 pr-4">
                              <p className="text-[11.5px] font-medium leading-tight text-slate-200">
                                {item.message}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteNotification(item.id)}
                              className="absolute right-2 top-2 p-1 rounded-md bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </li>
            )}

            {currentUser && (
              <li className="flex justify-center items-center w-[60px] h-[56px]">
                <a onClick={toggleTheme} title="Giao diện" className="cursor-pointer">
                  <span className="icon">
                    {theme === 'dark' ? <Sun className="w-5 h-5 icon-shadow text-indigo-900 hover:text-orange-600 transition-colors duration-500" /> : <Moon className="w-5 h-5 icon-shadow text-indigo-900 hover:text-orange-600 transition-colors duration-500" />}
                  </span>
                </a>
              </li>
            )}

          </ul>
        </nav>

        {/* User profile */}
        <div className="flex items-center space-x-3">

          {/* User avatar & points with dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowUserDropdown(true)}
            onMouseLeave={() => setShowUserDropdown(false)}
          >
            <button
              onClick={handleProfileClick}
              className="user-action-item flex items-center space-x-2 px-2.5 py-1.5 rounded-full bg-white/40 hover:bg-white/60 border border-white/60 transition-all text-indigo-900 hover:text-orange-600 group backdrop-blur-md shadow-sm cursor-pointer"
            >
              <UserCircle className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-extrabold hidden sm:block pr-1 tracking-wide whitespace-nowrap">
                {userName}
              </span>
            </button>

            {/* Dropdown Menu */}
            <div
              ref={userDropdownRef}
              style={{ display: 'none' }}
              className="absolute right-0 mt-2.5 w-64 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden py-1.5"
            >
              <button
                onClick={() => handleItemClick(() => navigate('/category/thi-nghiem'))}
                className="dropdown-item w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 border-b border-slate-100 dark:border-slate-800/40 group/item cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover/item:bg-blue-500/10 transition-colors">
                    <FlaskConical className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                      Thí nghiệm mô phỏng
                    </span>
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-medium">
                      Phòng thực hành ảo 3D
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-650 group-hover/item:translate-x-1 group-hover/item:text-blue-500 transition-all" />
              </button>

              <button
                onClick={() => handleItemClick(() => navigate('/category/on-tap'))}
                className="dropdown-item w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 border-b border-slate-100 dark:border-slate-800/40 group/item cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 group-hover/item:bg-emerald-500/10 transition-colors">
                    <ClipboardCheck className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                      Ôn tập & kiểm tra
                    </span>
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-medium">
                      Đề thi & Ngân hàng câu hỏi
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-650 group-hover/item:translate-x-1 group-hover/item:text-emerald-500 transition-all" />
              </button>

              <button
                onClick={() => handleItemClick(() => navigate('/category/tro-choi'))}
                className="dropdown-item w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 border-b border-slate-100 dark:border-slate-800/40 group/item cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 group-hover/item:bg-rose-500/10 transition-colors">
                    <Gamepad2 className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 group-hover/item:text-rose-600 dark:group-hover/item:text-rose-400 transition-colors">
                      Trò chơi học tập
                    </span>
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-medium">
                      Chơi để học vui vẻ
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-650 group-hover/item:translate-x-1 group-hover/item:text-rose-500 transition-all" />
              </button>

              <button
                onClick={() => handleItemClick(() => navigate('/category/e-learning'))}
                className="dropdown-item w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 border-b border-slate-100 dark:border-slate-800/40 group/item cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 group-hover/item:bg-purple-500/10 transition-colors">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">
                      Bài giảng & Tài liệu
                    </span>
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-medium">
                      Sách & Tư liệu điện tử
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-650 group-hover/item:translate-x-1 group-hover/item:text-purple-500 transition-all" />
              </button>

              <button
                onClick={() => handleItemClick(() => navigate('/category/ai-tool'))}
                className="dropdown-item w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group/item cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 group-hover/item:bg-amber-500/10 transition-colors">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors">
                      Trợ lý AI học tập
                    </span>
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-medium">
                      Công cụ thông minh
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-650 group-hover/item:translate-x-1 group-hover/item:text-amber-500 transition-all" />
              </button>

              {onLeaderboardClick && (
                <button
                  onClick={() => handleItemClick(onLeaderboardClick)}
                  className="dropdown-item w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 border-t border-slate-100 dark:border-slate-800/40 group/item cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 group-hover/item:bg-yellow-500/10 transition-colors">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col ml-3">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 group-hover/item:text-yellow-600 dark:group-hover/item:text-yellow-400 transition-colors">
                        Bảng xếp hạng
                      </span>
                      <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-medium">
                        Cạnh tranh & Vinh danh
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-650 group-hover/item:translate-x-1 group-hover/item:text-yellow-500 transition-all" />
                </button>
              )}

              {onLogoutClick && (
                <button
                  onClick={() => handleItemClick(onLogoutClick)}
                  className="dropdown-item w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 border-t border-slate-100 dark:border-slate-800/40 group/item cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-500/10 text-red-600 dark:text-red-400 group-hover/item:bg-red-500/20 transition-colors">
                      <LogOut className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col ml-3">
                      <span className="text-xs font-extrabold text-red-650 dark:text-red-400 group-hover/item:text-red-750 transition-colors">
                        Đăng xuất
                      </span>
                      <span className="text-[9.5px] text-red-400/80 dark:text-red-500/80 font-medium">
                        Thoát tài khoản
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-red-400/80 group-hover/item:translate-x-1 group-hover/item:text-red-500 transition-all" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
