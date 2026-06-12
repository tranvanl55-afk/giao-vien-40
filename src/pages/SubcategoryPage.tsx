import React, { lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, ExternalLink, Box, Atom } from 'lucide-react';
import { categories } from '../data';
import { useViewMode } from '../hooks/useViewMode';

const SKKNManager = lazy(() => import('../components/simulations/SKKNManager'));
const ND30Formatter = lazy(() => import('../components/simulations/ND30Formatter').then(m => ({ default: m.ND30Formatter })));

export default function SubcategoryPage() {
  const { catId, subId } = useParams<{ catId: string; subId: string }>();
  const navigate = useNavigate();
  const { viewMode, toggleViewMode } = useViewMode();

  const selectedCategory = categories.find(c => c.id === catId);
  const selectedSub = selectedCategory?.subCategories.find(s => s.id === subId);

  if (!selectedCategory || !selectedSub) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-black text-indigo-950 mb-4">Không tìm thấy nội dung</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold">
          Quay lại
        </button>
      </div>
    );
  }

  const goBackToSub = () => {
    navigate(`/category/${selectedCategory.id}`);
  };

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-500 h-full flex flex-col flex-1 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button 
          onClick={goBackToSub}
          className="flex items-center space-x-2 text-indigo-900 hover:text-orange-600 px-5 py-2.5 bg-white/40 hover:bg-white/60 rounded-full border border-white/60 transition-all backdrop-blur-md w-fit shadow-sm group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-wide">Quay lại Danh mục</span>
        </button>

        {selectedSub.lessons && selectedSub.lessons.length > 0 && (
          <button
            onClick={toggleViewMode}
            className="flex items-center space-x-2 text-indigo-900 hover:text-orange-600 px-5 py-2.5 bg-white/40 hover:bg-white/60 rounded-full border border-white/60 transition-all backdrop-blur-md w-fit shadow-sm font-bold tracking-wide cursor-pointer select-none"
          >
            {viewMode === 'modern' ? '🎮 Giao diện Game hóa' : '📱 Giao diện Hiện đại'}
          </button>
        )}
      </div>
      
      <div className={`flex-1 flex flex-col transition-all duration-500 ${
        selectedSub.lessons && viewMode === 'gamified'
          ? 'bg-transparent border-0 shadow-none p-0'
          : 'bg-slate-900/60 backdrop-blur-3xl border border-slate-700/60 rounded-3xl p-6 lg:p-8 shadow-2xl'
      }`}>
        {viewMode === 'modern' || !selectedSub.lessons ? (
          <div className="mb-6 border-b border-slate-700/60 pb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-heading drop-shadow-sm">{selectedSub.title}</h2>
              <p className="text-slate-400 font-medium">{selectedSub.description}</p>
            </div>
            {selectedCategory.logoUrl ? (
              <div className="hidden sm:flex items-center justify-center">
                  <img src={selectedCategory.logoUrl} className="w-16 h-16 object-contain drop-shadow-sm opacity-90" alt="" />
              </div>
            ) : (
              <div className={`hidden sm:flex p-4 rounded-2xl bg-linear-to-br ${selectedCategory.colorClass} shadow-lg opacity-90`}>
                <selectedCategory.icon className="w-8 h-8 text-white" weight="duotone" />
              </div>
            )}
          </div>
        ) : null}
        
        <div className={`flex-1 w-full rounded-2xl flex flex-col relative ${
          selectedSub.lessons && viewMode === 'modern'
            ? 'bg-slate-50/95 p-4 md:p-8 overflow-y-auto custom-scrollbar' 
            : selectedSub.lessons && viewMode === 'gamified'
              ? 'bg-transparent p-0 overflow-y-auto custom-scrollbar' 
              : selectedCategory.id === 'skkn' || ['test-gk', 'test-ck', 'bg-khtn', 'docs-sgk'].includes(selectedSub.id)
                ? 'bg-black/60 border border-slate-800/80 min-h-[500px] p-4 md:p-8 overflow-y-auto custom-scrollbar' 
                : 'bg-black/60 border border-slate-800 items-center justify-center text-center min-h-[500px] overflow-hidden group shadow-inner p-4 md:p-8'
        }`}>
            {!selectedSub.lessons && (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
              </>
            )}
            
            {selectedCategory.id === 'skkn' && selectedSub.id === 'skkn-nd30' ? (
              <ND30Formatter />
            ) : selectedCategory.id === 'skkn' || ['test-gk', 'test-ck', 'bg-khtn', 'docs-sgk'].includes(selectedSub.id) ? (
              <SKKNManager subCategoryId={selectedSub.id} categoryTitle={selectedSub.title} />
            ) : selectedSub.lessons && selectedSub.lessons.length > 0 ? (
              viewMode === 'modern' ? (
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedSub.lessons.map(lesson => {
                      const getColors = (t: string) => {
                        switch(t) {
                          case 'blue': return { iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-blue-100 to-indigo-100', btnBg: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-200' };
                          case 'orange': return { iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-orange-100 to-amber-100', btnBg: 'from-orange-400 to-amber-500', glow: 'shadow-orange-200' };
                          case 'purple': return { iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600', iconColor: 'text-white', blob: 'bg-gradient-to-br from-violet-100 to-fuchsia-100', btnBg: 'from-violet-500 to-fuchsia-600', glow: 'shadow-violet-200' };
                          case 'green': return { iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-emerald-100 to-teal-100', btnBg: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-200' };
                          case 'red': return { iconBg: 'bg-gradient-to-br from-rose-500 to-red-600', iconColor: 'text-white', blob: 'bg-gradient-to-br from-rose-100 to-red-100', btnBg: 'from-rose-500 to-red-600', glow: 'shadow-rose-200' };
                          default: return { iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500', iconColor: 'text-white', blob: 'bg-gradient-to-br from-blue-100 to-indigo-100', btnBg: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-200' };
                        }
                      };
                      const colors = getColors(lesson.theme);
                      return (
                        <div 
                          key={lesson.id} 
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                          className="relative bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.15)] transition-all duration-300 text-slate-800"
                        >
                          <div className={`absolute -top-16 -right-16 w-52 h-52 rounded-full ${colors.blob} opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none`}></div>
                          <div className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full ${colors.blob} opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 pointer-events-none`}></div>
                          
                          <div className="relative z-10 flex flex-col h-full items-start text-left">
                            <div className="flex items-center gap-4 mb-5 w-full">
                              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center ${lesson.logoUrl ? `${colors.blob} border-2 border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)]` : `${colors.iconBg} shadow-lg ${colors.glow}`} group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 shrink-0 relative overflow-hidden`}>
                                {lesson.logoUrl ? (
                                  <>
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
                                    <img 
                                      src={lesson.logoUrl} 
                                      alt={lesson.title} 
                                      className="w-16 h-16 md:w-20 md:h-20 scale-125 object-contain drop-shadow-md relative z-10" 
                                    />
                                  </>
                                ) : (
                                  <lesson.icon className={`w-10 h-10 ${colors.iconColor} drop-shadow-sm`} weight="duotone" />
                                )}
                              </div>
                              
                              <h3 className="text-xl md:text-2xl font-extrabold text-indigo-950 font-heading group-hover:text-orange-600 transition-colors leading-tight">{lesson.title}</h3>
                            </div>
                            
                            <p className="text-indigo-900/70 font-medium leading-relaxed mb-6 flex-1 text-sm">{lesson.description}</p>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/lesson/${lesson.id}`);
                              }}
                              className={`mt-auto px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all bg-linear-to-r ${colors.btnBg} text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95`}
                            >
                              <span className="text-xs tracking-wide">Bắt đầu</span>
                              <Play fill="currentColor" className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                  })}
                </div>
              ) : (
                <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto animate-in zoom-in-95 duration-500 py-4">
                  <div className="relative w-full mb-8 bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 border-3 border-cyan-400 rounded-3xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.45)] flex items-center justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.25),transparent_50%)]"></div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="coin-3d-wrapper select-none mr-2">
                        <div className="coin-3d-container">
                          <div className="coin-3d">
                            <div className="coin-3d-face coin-3d-front p-1.5">
                              {selectedSub.logoUrl ? (
                                <img 
                                  src={selectedSub.logoUrl} 
                                  alt={selectedSub.title} 
                                  className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]" 
                                  referrerPolicy="no-referrer" 
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "https://img.icons8.com/fluency/96/test-tube.png";
                                  }}
                                />
                              ) : (
                                <Atom className="w-6 h-6 text-cyan-200" />
                              )}
                            </div>
                            <div className="coin-3d-face coin-3d-back">
                              <Atom className="w-6 h-6 text-rose-100" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-wide font-heading uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {selectedSub.title}
                      </h2>
                    </div>

                    <div className="relative z-10 shrink-0">
                      <Atom className="w-10 h-10 text-cyan-300 animate-[spin_10s_linear_infinite] filter drop-shadow-[0_0_6px_rgba(103,232,249,0.8)]" />
                    </div>
                  </div>

                  <div className="w-full bg-linear-to-b from-indigo-950/80 to-slate-950/85 border-3 border-cyan-500/50 rounded-4xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      {selectedSub.lessons.map((lesson, idx) => {
                        const themeColors = {
                          blue: {
                            badge: 'bg-gradient-to-br from-sky-400 to-blue-600 shadow-blue-500/50 border-sky-300',
                            header: 'bg-gradient-to-r from-sky-500 to-blue-600 border-sky-400 text-white',
                            iconContainer: 'bg-gradient-to-br from-sky-100 to-blue-100 border-sky-200 text-blue-600',
                            lines: 'border-blue-100'
                          },
                          orange: {
                            badge: 'bg-gradient-to-br from-amber-400 to-orange-600 shadow-orange-500/50 border-amber-300',
                            header: 'bg-gradient-to-r from-amber-500 to-orange-600 border-orange-400 text-white',
                            iconContainer: 'bg-gradient-to-br from-amber-100 to-orange-100 border-orange-200 text-orange-600',
                            lines: 'border-orange-100'
                          },
                          red: {
                            badge: 'bg-gradient-to-br from-orange-400 to-red-600 shadow-red-500/50 border-orange-300',
                            header: 'bg-gradient-to-r from-orange-500 to-red-600 border-red-400 text-white',
                            iconContainer: 'bg-gradient-to-br from-orange-100 to-red-100 border-red-200 text-red-600',
                            lines: 'border-red-100'
                          },
                          green: {
                            badge: 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-teal-500/50 border-emerald-300',
                            header: 'bg-gradient-to-r from-emerald-500 to-teal-600 border-teal-400 text-white',
                            iconContainer: 'bg-gradient-to-br from-emerald-100 to-teal-100 border-teal-200 text-teal-600',
                            lines: 'border-teal-100'
                          },
                          purple: {
                            badge: 'bg-gradient-to-br from-violet-400 to-fuchsia-600 shadow-fuchsia-500/50 border-violet-300',
                            header: 'bg-gradient-to-r from-violet-500 to-fuchsia-600 border-fuchsia-400 text-white',
                            iconContainer: 'bg-gradient-to-br from-violet-100 to-fuchsia-100 border-fuchsia-200 text-fuchsia-600',
                            lines: 'border-fuchsia-100'
                          }
                        };
                        const color = themeColors[lesson.theme] || themeColors.blue;

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                            className="relative bg-white rounded-3xl p-6 md:p-8 shadow-[0_12px_28px_rgba(0,0,0,0.18)] border-2 border-slate-200 flex items-stretch gap-6 group cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(6,182,212,0.25)] hover:border-cyan-400/80 transition-all duration-300 select-none overflow-visible min-h-[160px] text-slate-800"
                          >
                            <div className={`absolute -top-4 -left-4 w-9 h-9 rounded-full flex items-center justify-center text-sm md:text-base font-black text-white shadow-md border-2 ${color.badge} z-20 group-hover:scale-110 transition-transform`}>
                              {idx + 1}
                            </div>

                            <div className={`w-32 rounded-4xl border flex items-center justify-center shrink-0 p-3 group-hover:scale-105 transition-transform relative overflow-hidden ${color.iconContainer}`}>
                              {lesson.logoUrl ? (
                                <>
                                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <img 
                                    src={lesson.logoUrl} 
                                    alt={lesson.title} 
                                    className="w-24 h-24 scale-125 object-contain drop-shadow-md relative z-10" 
                                  />
                                </>
                              ) : (
                                <lesson.icon className="w-14 h-14 drop-shadow-xs relative z-10" weight="bold" />
                              )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between text-left min-w-0">
                              <div>
                                <div className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-black tracking-wide border truncate mb-2.5 group-hover:shadow-sm ${color.header}`}>
                                  {lesson.title}
                                </div>
                                
                                <p className="text-slate-500 text-[11px] md:text-xs font-bold leading-relaxed line-clamp-2 mb-2">
                                  {lesson.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                                <div className="text-slate-700 text-[10px] md:text-xs font-black tracking-wider uppercase select-none">
                                  BẮT ĐẦU THỰC HÀNH ⚡
                                </div>

                                <div className="w-1/3 space-y-1.5">
                                  <div className={`border-b-2 border-dashed w-full ${color.lines}`}></div>
                                  <div className={`border-b-2 border-dashed w-4/5 ${color.lines}`}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            ) : selectedSub.embedDocs && selectedSub.embedDocs.length > 0 ? (
              <div className="relative z-10 flex flex-col w-full h-full max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar p-2">
                <h3 className="text-2xl font-bold text-white text-left font-heading">{selectedSub.title} - Tài liệu Nhúng</h3>
                {selectedSub.embedDocs.map((doc, idx) => (
                  <div key={idx} className="w-full shrink-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="bg-slate-800 border-b border-slate-700 p-3 flex justify-between items-center">
                      <h4 className="text-white font-bold">{doc.title}</h4>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 group">
                        <span>Mở tab mới</span>
                        <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                    <iframe 
                      src={doc.url} 
                      className="w-full h-[600px] border-none bg-white" 
                      title={doc.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            ) : selectedSub.contentUrl ? (
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 bg-linear-to-br ${selectedCategory.colorClass} shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-in zoom-in duration-500`}>
                  <selectedCategory.icon className="w-10 h-10 text-white drop-shadow-md" />
                </div>
                <p className="text-4xl font-black text-white mb-4 font-heading drop-shadow-md">{selectedSub.title}</p>
                <p className="text-slate-300 max-w-lg mx-auto leading-relaxed text-lg mb-8">
                  Khởi chiếu công cụ AI <strong className="text-cyan-400 font-bold">{selectedSub.title}</strong>.
                </p>
                <a 
                  href={selectedSub.contentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:-translate-y-1"
                >
                  <span className="text-lg tracking-wide uppercase">Mở {selectedSub.title}</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center">
                <Box className="w-24 h-24 text-slate-700 mb-8 group-hover:text-cyan-500/40 transition-colors duration-700 animate-pulse" />
                <p className="text-3xl font-black text-slate-300 mb-4 font-heading drop-shadow-md">Tải Module Nhiệm vụ...</p>
                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-lg">
                  Bộ khuếch đại tín hiệu không gian đang thiết lập kết nối tới <strong className="text-cyan-400 font-bold">{selectedSub.title}</strong>. Bạn có thể nhúng Frame hoặc WebGL 3D tại đây.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
