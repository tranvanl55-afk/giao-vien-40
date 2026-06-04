import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // App Header & Sidebar
  'Khám phá': { vi: 'Khám phá', en: 'Explore' },
  'Học tập': { vi: 'Học tập', en: 'Learning' },
  'Thực hành': { vi: 'Thực hành', en: 'Practice' },
  'Đánh giá': { vi: 'Đánh giá', en: 'Assessment' },
  'Thành tích': { vi: 'Thành tích', en: 'Achievements' },
  'Bảng xếp hạng': { vi: 'Bảng xếp hạng', en: 'Leaderboard' },
  'Hồ sơ': { vi: 'Hồ sơ', en: 'Profile' },
  'Chế độ xem': { vi: 'Chế độ xem', en: 'View Mode' },
  'Cổ điển': { vi: 'Cổ điển', en: 'Classic' },
  'Hiện đại': { vi: 'Hiện đại', en: 'Modern' },
  'Trò chơi': { vi: 'Trò chơi', en: 'Gamified' },
  'Giao diện': { vi: 'Giao diện', en: 'Theme' },
  'Sáng': { vi: 'Sáng', en: 'Light' },
  'Tối': { vi: 'Tối', en: 'Dark' },
  'Đăng xuất': { vi: 'Đăng xuất', en: 'Logout' },
  'Chào mừng': { vi: 'Chào mừng', en: 'Welcome' },
  'Đóng': { vi: 'Đóng', en: 'Close' },
  'Khám phá phòng thực hành ảo và các tính năng học tập tương tác': { vi: 'Khám phá phòng thực hành ảo và các tính năng học tập tương tác', en: 'Explore virtual labs and interactive learning features' },
  'Các chuyên mục': { vi: 'Các chuyên mục', en: 'Categories' },
  'Tất cả': { vi: 'Tất cả', en: 'All' },
  'Quay lại': { vi: 'Quay lại', en: 'Back' },
  'Chưa chọn bài học': { vi: 'Chưa chọn bài học', en: 'No lesson selected' },
  'Mở trong tab mới': { vi: 'Mở trong tab mới', en: 'Open in new tab' },

  // Add more as needed...
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('app_language') as Language) || 'vi';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return key; // Fallback to key
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
