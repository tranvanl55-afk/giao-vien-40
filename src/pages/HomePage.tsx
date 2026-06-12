import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, TrendingUp, Search, ChevronRight } from 'lucide-react';
import { categories, Category, SubCategory } from '../data';
import { useHotTools } from '../hooks/useHotTools';

export const getFallbackToolIcon = (subId: string, subTitle: string, contentUrl?: string): string => {
  const id = subId.toLowerCase();
  
  if (id.includes('khtn-6')) return 'https://img.icons8.com/fluency/96/microscope.png';
  if (id.includes('khtn-7')) return 'https://img.icons8.com/fluency/96/test-tube.png';
  if (id.includes('khtn-8')) return 'https://img.icons8.com/fluency/96/physics.png';
  if (id.includes('khtn-9')) return 'https://img.icons8.com/color/96/round-bottom-flask.png';
  
  if (id.includes('phieu-bai-hoc')) return 'https://img.icons8.com/fluency/96/notebook.png';
  if (id.includes('mindmap')) return 'https://img.icons8.com/fluency/96/mind-map.png';
  if (id.includes('tao-de') || id.includes('de-kiem-tra') || id.includes('app-tao-de')) return 'https://img.icons8.com/fluency/96/artificial-intelligence.png';
  
  if (id.includes('chatgpt')) return 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128';
  if (id.includes('gemini')) return 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128';
  if (id.includes('claude')) return 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128';
  if (id.includes('copilot')) return 'https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=128';
  
  if (id.includes('game-quiz') || id.includes('do-vui')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%91_vui-removebg-preview.png?alt=media&token=b096c8f7-0557-466f-b0bc-162ba3e0c632';
  if (id.includes('game-puzzle') || id.includes('manh-ghep')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fl%E1%BA%ADt_m%E1%BA%A3nh_gh%C3%A9p-removebg-preview.png?alt=media&token=00b1a2e0-bad6-4e40-b15a-6f50de9b14c2';
  if (id.includes('duck-race') || id.includes('dua-vit')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91ua_v%E1%BB%8Bt-removebg-preview.png?alt=media&token=1a850b85-12b2-4631-93db-b865918bbcd6';
  if (id.includes('game-hub') || id.includes('ngan-hang')) return 'https://img.icons8.com/fluency/96/data-configuration.png';
  
  if (id.startsWith('ai-') && contentUrl) {
    try {
      const parsedUrl = new URL(contentUrl);
      return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
    } catch {}
  }
  return 'https://img.icons8.com/fluency/96/books.png';
};

export default function HomePage() {
  const navigate = useNavigate();
  const { hotTools, recordToolUsage } = useHotTools();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!globalSearchQuery) return [];
    const query = globalSearchQuery.toLowerCase();
    const results: any[] = [];
    categories.forEach(cat => {
      cat.subCategories.forEach(sub => {
        const subMatches = sub.title.toLowerCase().includes(query) || sub.description.toLowerCase().includes(query);
        if (subMatches) {
          results.push({ type: 'subcategory', item: sub, parentCat: cat });
        }
        if (sub.lessons) {
          sub.lessons.forEach(lesson => {
            const lessonMatches = lesson.title.toLowerCase().includes(query) || lesson.description.toLowerCase().includes(query);
            if (lessonMatches) {
              results.push({ type: 'lesson', item: lesson, parentSub: sub, parentCat: cat });
            }
          });
        }
      });
    });
    return results;
  }, [globalSearchQuery]);

  const handleHotToolClick = (tool: any) => {
    const cat = categories.find(c => c.id === tool.catId);
    if (!cat) return;
    const sub = cat.subCategories.find(s => s.id === tool.subId);
    if (!sub) return;
    recordToolUsage(sub, cat.id);
    if (sub.contentUrl) { window.open(sub.contentUrl, '_blank'); return; }
    
    // Simplistic routing logic based on if it's a lesson or subcategory
    // Because we use standard React Router, we just navigate.
    navigate(`/subcategory/${cat.id}/${sub.id}`);
  };

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8 mt-1 md:mt-2">
      {/* Category Grid */}
      {!globalSearchQuery && (
        <div className="w-full overflow-hidden relative group">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-linear-to-r from-cyan-100/50 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-linear-to-l from-cyan-100/50 to-transparent z-20 pointer-events-none"></div>

          <div className="flex flex-nowrap animate-marquee items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-max px-6 pb-6 pt-4 overflow-visible">
            {[...categories, ...categories].map((cat, index) => (
              <div
                key={`${cat.id}-${index}`}
                id={index < categories.length ? `tour-${cat.id}` : undefined}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 w-[70px] sm:w-[90px] md:w-[100px] shrink-0 z-10 hover:z-50"
                style={{ animationDelay: `${(index % categories.length) * 50}ms` }}
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center group-hover:-translate-y-3 group-hover:scale-110 md:group-hover:scale-[1.15] transition-all duration-300 relative shrink-0`}>
                  {cat.logoUrl ? (
                    <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                      <img 
                        src={cat.logoUrl} 
                        alt={cat.title} 
                        className={`w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-transform duration-300 ${cat.id === 'thi-nghiem' ? 'scale-[0.85]' : ''}`}
                      />
                    </div>
                  ) : (
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl md:rounded-4xl flex items-center justify-center bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-orange-400 shadow-[0_4px_16px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_40px_rgba(249,115,22,0.3)] relative overflow-hidden`}>
                      <div className={`absolute inset-0 rounded-2xl md:rounded-4xl opacity-20 group-hover:opacity-40 bg-linear-to-br ${cat.colorClass} transition-opacity duration-300`}></div>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center bg-linear-to-br ${cat.colorClass} shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_4px_16px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.15)] transition-transform duration-300 shrink-0 relative z-10 overflow-hidden`}>
                        <cat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-col items-center w-full text-center transition-all duration-300 group-hover:translate-y-1 z-20">
                  <h3 className="text-[11px] sm:text-xs font-extrabold text-indigo-900 group-hover:text-orange-600 transition-colors leading-tight max-w-[80px] sm:max-w-[100px] wrap-break-word">{cat.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hot Tools & Search */}
      {hotTools.length > 0 && (
        <div id="tour-hot-tools" className="w-full max-w-7xl mx-auto px-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-orange-300 shadow-sm backdrop-blur-md">
                <Flame className="w-4 h-4 text-orange-600 animate-pulse" />
                <span className="text-sm font-black text-orange-600 uppercase tracking-[0.2em]">Công cụ Hot</span>
              </div>
              <span className="text-xs text-indigo-900/80 font-bold hidden sm:block">Dùng nhiều nhất gần đây</span>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              {!globalSearchQuery && (
                <div className="hidden md:flex items-center gap-1.5 text-indigo-900/80 font-bold shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs">{hotTools.length} công cụ</span>
                </div>
              )}
              
              <div className="relative w-full md:w-72 glowing-search" id="tour-search-bar">
                <div className="glowing-search-inner h-full flex relative rounded-full bg-white/50 border border-white/50 focus-within:border-cyan-400/50 shadow-sm transition-all overflow-hidden">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Search className="h-4 w-4 text-cyan-600" />
                  </div>
                  <input
                    type="text"
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm công cụ, bài học..."
                    className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none transition-all z-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {globalSearchQuery ? (
            <div className="w-full mt-2 animate-in fade-in duration-300">
              <h3 className="text-lg font-black text-indigo-950 mb-4 px-2">Kết quả tìm kiếm ({searchResults.length})</h3>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
                  {searchResults.map((result, idx) => {
                    if (result.type === 'subcategory') {
                      const sub = result.item;
                      const cat = result.parentCat;
                      return (
                        <div 
                          key={`sub-${sub.id}-${idx}`}
                          onClick={() => navigate(`/subcategory/${cat.id}/${sub.id}`)}
                          className="relative bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-orange-400 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3 group"
                        >
                          {sub.logoUrl ? (
                            <div className="w-12 h-12 flex items-center justify-center shrink-0">
                              <img src={sub.logoUrl} className="w-10 h-10 object-contain drop-shadow-sm" alt="" />
                            </div>
                          ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br ${cat.colorClass} shadow-sm shrink-0`}>
                              <cat.icon className="w-6 h-6 text-white" weight="duotone" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-extrabold text-indigo-950 truncate group-hover:text-orange-600 transition-colors">{sub.title}</h4>
                            <p className="text-[10px] text-indigo-900/60 font-bold uppercase truncate">{cat.title}</p>
                            <p className="text-xs text-indigo-900/80 mt-1 line-clamp-2 leading-tight">{sub.description}</p>
                          </div>
                        </div>
                      );
                    } else {
                      const lesson = result.item;
                      const sub = result.parentSub;
                      const cat = result.parentCat;
                      return (
                        <div 
                          key={`lesson-${lesson.id}-${idx}`}
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                          className="relative bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br from-blue-400 to-indigo-500 shadow-sm shrink-0">
                            {lesson.icon && <lesson.icon className="w-6 h-6 text-white" weight="duotone" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-extrabold text-indigo-950 truncate group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                            <p className="text-[10px] text-indigo-900/60 font-bold uppercase truncate">{sub.title} • {cat.title}</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-white/40 rounded-2xl border border-white/60 mx-2">
                  <Search className="w-8 h-8 text-indigo-900/20 mx-auto mb-3" />
                  <p className="text-indigo-900/60 font-bold text-sm">Không tìm thấy kết quả phù hợp</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <div className="flex gap-4 pt-4 px-2 pb-4 min-w-max lg:min-w-0 lg:flex-wrap">
                {[...hotTools].sort((a, b) => b.count - a.count || b.lastUsed - a.lastUsed).slice(0, 8).map((tool, idx) => {
                  const isTop = idx === 0;
                  const cat = categories.find(c => c.id === tool.catId);
                  const sub = cat?.subCategories.find(s => s.id === tool.subId);
                  const displayLogoUrl = sub?.logoUrl || tool.logoUrl;
                  const displayContentUrl = sub?.contentUrl || tool.contentUrl;
                  const displayTitle = sub?.title || tool.subTitle;

                  const imgSrc = displayLogoUrl || (displayContentUrl
                    ? `https://www.google.com/s2/favicons?domain=${displayContentUrl}&sz=128`
                    : undefined) || getFallbackToolIcon(tool.subId, displayTitle, displayContentUrl);
                    
                  return (
                    <div
                      key={tool.subId}
                      onClick={() => handleHotToolClick(tool)}
                      className="relative flex flex-col items-center justify-start shrink-0 cursor-pointer group transition-all duration-300 w-[70px] sm:w-[80px]"
                    >
                      <div className="relative">
                        {isTop && (
                          <div className="absolute -top-3 -right-3 z-10 bg-linear-to-r from-orange-500 to-red-600 rounded-full px-2 py-0.5 flex items-center gap-0.5 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/50">
                            <Flame className="w-2.5 h-2.5 text-white" />
                            <span className="text-[10px] font-black text-white leading-none">#1</span>
                          </div>
                        )}
                        {imgSrc ? (
                          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center overflow-hidden transition-all duration-300 shrink-0 shadow-lg border-2 ${isTop ? 'bg-linear-to-br from-orange-500/30 to-red-600/30 border-orange-400/60 group-hover:border-orange-400 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] group-hover:scale-110' : 'bg-white/20 border-white/40 group-hover:border-white/70 group-hover:bg-white/30 backdrop-blur-md group-hover:scale-110'}`}>
                            <img src={imgSrc} alt={displayTitle} className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-lg" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] bg-linear-to-br from-orange-500/80 to-red-600/80 flex items-center justify-center shrink-0 border-2 border-white/30 group-hover:border-white/60 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_20px_rgba(249,115,22,0.7)] group-hover:scale-110">
                            <Flame className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-md" />
                          </div>
                        )}
                        <div className="absolute -bottom-2 right-0 bg-white border border-orange-500 flex items-center gap-1 px-1.5 py-0.5 rounded-full shadow-md group-hover:border-orange-600 transition-colors z-10">
                          <Flame className="w-2.5 h-2.5 text-orange-600" />
                          <span className="text-[10px] font-black text-orange-600">{tool.count}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col items-center w-full text-center transition-all duration-300 group-hover:translate-y-1 z-20">
                        <h3 className="text-[10px] sm:text-[11px] font-extrabold text-indigo-900 group-hover:text-orange-600 transition-colors leading-tight max-w-[70px] sm:max-w-[80px] line-clamp-2">{displayTitle}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
