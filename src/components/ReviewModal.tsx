import React, { useState, useMemo } from 'react';
import { useUserProgress } from '../context/UserProgressContext';
import { categories } from '../data';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, Play, X, Award } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewItem {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  completed: boolean;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { completedLessons } = useUserProgress();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all reviewable items (lessons & standalone subcategories)
  const reviewItems = useMemo(() => {
    const items: ReviewItem[] = [];
    categories.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        if (sub.lessons && sub.lessons.length > 0) {
          sub.lessons.forEach((lesson) => {
            items.push({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              categoryName: cat.title,
              completed: completedLessons.has(lesson.id),
            });
          });
        } else {
          // If it has no sub-lessons, it represents a standalone tool/simulation
          items.push({
            id: sub.id,
            title: sub.title,
            description: sub.description,
            categoryName: cat.title,
            completed: completedLessons.has(sub.id),
          });
        }
      });
    });
    return items;
  }, [completedLessons]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return reviewItems;
    return reviewItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q)
    );
  }, [reviewItems, searchQuery]);

  const handleReview = (id: string) => {
    navigate(`/lesson/${id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-200 animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 p-6 relative flex flex-col max-h-[85vh] transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tight">
              Ôn tập & Xem lại bài học
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 font-bold">
              Theo dõi và ôn luyện lại các bài học đã học hoặc đang học
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài học, chuyên đề, mô phỏng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-500/30 transition-all font-medium text-sm"
          />
        </div>

        {/* List content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Không tìm thấy bài học nào phù hợp.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all duration-350 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                      {item.categoryName}
                    </span>
                    {item.completed && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Đã hoàn thành
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleReview(item.id)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md shadow-orange-500/10"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Xem lại
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
