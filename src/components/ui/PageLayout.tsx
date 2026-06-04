import { ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface PageLayoutProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ title, icon, children }: PageLayoutProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10 flex flex-col max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-3 text-slate-600 hover:text-slate-900 bg-white/40 hover:bg-white/60 rounded-xl transition-all border border-slate-300/30 group backdrop-blur-md shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center space-x-3">
            {icon && <div className="p-2 bg-white/40 rounded-lg border border-slate-300/30 shadow-sm">{icon}</div>}
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 drop-shadow-sm">{title}</h1>
          </div>
        </div>

        <button 
          onClick={() => { localStorage.removeItem("user"); navigate("/login"); }}
          className="flex items-center space-x-2 p-2 px-3 md:px-4 text-slate-700 hover:text-white bg-white/20 hover:bg-red-500/80 rounded-full transition-all border border-slate-300/30 group backdrop-blur-md relative z-50 cursor-pointer shadow-sm"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold hidden sm:block">Thoát</span>
        </button>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
