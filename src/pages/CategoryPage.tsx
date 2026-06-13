import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, Play, Box } from 'lucide-react';
import { categories, SubCategory } from '../data';
import { AI_GROUPS, resolveSimulationId } from '../config/constants';
import { getFallbackToolIcon } from '../utils/helpers';
import { useHotTools } from '../hooks/useHotTools';

export default function CategoryPage() {
  const { catId } = useParams<{ catId: string }>();
  const navigate = useNavigate();
  const { recordToolUsage } = useHotTools();
  
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [selectedAiGroup, setSelectedAiGroup] = useState('all');

  const selectedCategory = categories.find(c => c.id === catId);

  if (!selectedCategory) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-black text-indigo-950 mb-4">Không tìm thấy danh mục</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold">
          Quay lại Trang Chủ
        </button>
      </div>
    );
  }

  const handleSelectSub = (sub: SubCategory) => {
    recordToolUsage(sub, selectedCategory.id);
    if (sub.contentUrl) {
      window.open(sub.contentUrl, '_blank');
      return;
    }
    const targetSimId = resolveSimulationId(sub.id);
    if (targetSimId) {
      navigate(`/lesson/${targetSimId}`);
    } else {
      navigate(`/subcategory/${selectedCategory.id}/${sub.id}`);
    }
  };

  const filteredSubCategories = selectedCategory.subCategories.filter(sub => {
    const matchesGroup = selectedCategory.id !== 'ai-tool' || selectedAiGroup === 'all' || sub.group === selectedAiGroup;
    const query = aiSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      sub.title.toLowerCase().includes(query) || 
      sub.description.toLowerCase().includes(query);
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="animate-in slide-in-from-right-8 duration-500 w-full flex-1 flex flex-col">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-indigo-900 hover:text-orange-600 mb-8 px-5 py-2.5 bg-white/40 hover:bg-white/60 rounded-full border border-white/60 transition-all backdrop-blur-md w-fit shadow-sm group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold tracking-wide">Quay lại Trang Chủ</span>
      </button>
      
      <div className="flex items-center space-x-5 mb-10 bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md shadow-md">
         {selectedCategory.logoUrl ? (
            <img src={selectedCategory.logoUrl} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md animate-spin-y" alt="" />
         ) : (
            <div className={`p-4 rounded-2xl bg-linear-to-br ${selectedCategory.colorClass} shadow-lg`}>
                <selectedCategory.icon className="w-10 h-10 text-white" weight="duotone" />
            </div>
         )}
         <div>
            <h2 className="text-3xl md:text-4xl font-black text-indigo-950 font-heading drop-shadow-sm">{selectedCategory.title}</h2>
            <p className="text-orange-600 mt-2 font-extrabold text-lg">{selectedCategory.subtitle}</p>
         </div>
      </div>

      {selectedCategory.id === 'ai-tool' && (
        <div className="flex flex-col gap-6 mb-8 bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md shadow-md animate-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-xs font-black text-indigo-900/60 uppercase tracking-[0.15em]">Bộ tìm kiếm & Phân loại</span>
              <h3 className="text-lg font-black text-indigo-950 mt-1">Trợ lý AI Đa vũ trụ</h3>
            </div>
            
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-950/60" />
              <input
                type="text"
                placeholder="Tìm tên hoặc tính năng công cụ..."
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white/60 focus:bg-white border border-white/80 focus:border-orange-500 rounded-2xl text-indigo-950 font-bold placeholder-indigo-950/40 shadow-inner outline-none transition-all duration-300 text-sm focus:ring-2 focus:ring-orange-500/20"
              />
              {aiSearchQuery && (
                <button
                  onClick={() => setAiSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-950/60 hover:text-indigo-950 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-indigo-900/10 pt-4 flex gap-2 overflow-x-auto w-full pb-1 scrollbar-none snap-x select-none">
            {AI_GROUPS.map(group => (
              <button
                key={group.id}
                onClick={() => setSelectedAiGroup(group.id)}
                className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-300 border snap-start ${
                  selectedAiGroup === group.id
                    ? 'bg-linear-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-white/40 hover:bg-white/60 border-white/60 text-indigo-900 hover:text-orange-600'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredSubCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/30 border border-white/50 rounded-3xl backdrop-blur-md text-center max-w-lg mx-auto w-full shadow-lg animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 border border-orange-200 shadow-inner">
            <Search className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-extrabold text-indigo-950 mb-2">Không tìm thấy công cụ AI nào</h3>
          <p className="text-sm text-indigo-900/70 font-medium mb-6 max-w-sm">
            Không tìm thấy kết quả phù hợp cho từ khóa <strong className="text-orange-600">"{aiSearchQuery}"</strong> hoặc nhóm hiện tại.
          </p>
          <button
            onClick={() => {
              setAiSearchQuery('');
              setSelectedAiGroup('all');
            }}
            className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 hover:scale-105 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {filteredSubCategories.map((sub, index) => {
            const themes = ['blue', 'orange', 'purple', 'green', 'red'];
            const getColors = (t: string) => {
              switch(t) {
                case 'blue': return { iconBg: 'bg-linear-to-br from-blue-400 to-indigo-500', iconColor: 'text-white', blob: 'bg-linear-to-br from-blue-100 to-indigo-100', btnBg: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-200', textTitle: 'text-slate-800' };
                case 'orange': return { iconBg: 'bg-linear-to-br from-orange-400 to-amber-500', iconColor: 'text-white', blob: 'bg-linear-to-br from-orange-100 to-amber-100', btnBg: 'from-orange-400 to-amber-500', glow: 'shadow-orange-200', textTitle: 'text-slate-800' };
                case 'purple': return { iconBg: 'bg-linear-to-br from-violet-500 to-fuchsia-600', iconColor: 'text-white', blob: 'bg-linear-to-br from-violet-100 to-fuchsia-100', btnBg: 'from-violet-500 to-fuchsia-600', glow: 'shadow-violet-200', textTitle: 'text-slate-800' };
                case 'green': return { iconBg: 'bg-linear-to-br from-emerald-400 to-teal-500', iconColor: 'text-white', blob: 'bg-linear-to-br from-emerald-100 to-teal-100', btnBg: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-200', textTitle: 'text-slate-800' };
                case 'red': return { iconBg: 'bg-linear-to-br from-rose-500 to-red-600', iconColor: 'text-white', blob: 'bg-linear-to-br from-rose-100 to-red-100', btnBg: 'from-rose-500 to-red-600', glow: 'shadow-rose-200', textTitle: 'text-slate-800' };
                default: return { iconBg: 'bg-linear-to-br from-blue-400 to-indigo-500', iconColor: 'text-white', blob: 'bg-linear-to-br from-blue-100 to-indigo-100', btnBg: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-200', textTitle: 'text-slate-800' };
              }
            };
            const colors = getColors(themes[index % themes.length]);
            return (
              <div
                key={sub.id}
                onClick={() => handleSelectSub(sub)}
                className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/80 overflow-hidden flex flex-col sm:flex-row items-center justify-between group cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-500 min-h-[220px] animate-in zoom-in-95"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className={`absolute -top-24 -right-10 w-64 h-64 rounded-full ${colors.blob} opacity-50 group-hover:opacity-80 group-hover:scale-125 transition-all duration-700 pointer-events-none`}></div>
                <div className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full ${colors.blob} opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 pointer-events-none`}></div>

                <div className="relative z-10 flex flex-col h-full items-start text-left flex-1 pr-0 sm:pr-6 mb-6 sm:mb-0 w-full">
                  <h3 className={`text-2xl sm:text-3xl lg:text-[2rem] font-extrabold ${colors.textTitle} mb-3 font-heading leading-tight group-hover:text-blue-600 transition-colors`}>{sub.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6 sm:mb-8 flex-1 text-sm sm:text-base line-clamp-3">{sub.description}</p>
                  
                  <div className={`mt-auto px-6 py-2.5 sm:py-3 rounded-full font-bold flex items-center gap-2 transition-all bg-linear-to-r ${colors.btnBg} text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 active:scale-95`}>
                    <span className="text-sm sm:text-base tracking-wide">Bắt đầu</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm ml-1">
                      <Play fill="currentColor" className="w-2.5 h-2.5 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 ml-0 sm:ml-auto flex items-center justify-center">
                  <div className={`w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full flex items-center justify-center ${sub.logoUrl ? `${colors.blob} border border-white/90 shadow-[inset_0_4px_20px_rgba(255,255,255,0.9),0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md` : `${colors.iconBg} shadow-xl ${colors.glow}`} group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
                    {sub.logoUrl ? (
                      <>
                        <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
                        <img 
                          src={sub.logoUrl} 
                          alt={sub.title} 
                          className={`w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-xl relative z-10 transition-transform duration-500 animate-spin-y ${sub.id === 'khtn-8' ? 'scale-[1.3] group-hover:scale-[1.4]' : 'group-hover:scale-110'}`} 
                        />
                        <div className="absolute top-1 left-2 sm:top-2 sm:left-4 w-16 h-8 sm:w-24 sm:h-12 bg-linear-to-b from-white/60 to-transparent rounded-full rotate-[-15deg] pointer-events-none"></div>
                      </>
                    ) : sub.contentUrl ? (
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${sub.contentUrl}&sz=128`} 
                        alt={sub.title} 
                        className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-sm bg-white rounded-2xl p-2 relative z-10" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getFallbackToolIcon(sub.id, sub.title, sub.contentUrl);
                        }}
                      />
                    ) : (
                      <Box className={`w-12 h-12 sm:w-16 sm:h-16 ${colors.iconColor} drop-shadow-sm relative z-10`} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
