import React from 'react';
import { Box } from 'lucide-react';

interface ThreeJsContainerProps {
  title?: string;
  htmlFileUrl?: string;
  description?: string;
  height?: string;
}

export function ThreeJsContainer({ 
  title = "Mô phỏng 3D (Three.js)", 
  htmlFileUrl,
  description = "Tạo một file HTML chứa code Three.js trong thư mục public/ (ví dụ: scene.html) và truyền đường dẫn vào thuộc tính htmlFileUrl.",
  height = "h-[500px]"
}: ThreeJsContainerProps) {
  return (
    <div className={`w-full ${height} rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md border border-slate-300/30 shadow-sm flex flex-col relative`}>
      <div className="bg-white/60 border-b border-slate-300/30 p-3 px-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <Box className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-bold text-slate-800">{title}</span>
        </div>
        <span className="text-xs text-slate-500 font-medium tracking-wide hidden sm:block">
          Khung nhúng Three.js
        </span>
      </div>
      
      <div className="flex-1 w-full h-full relative bg-slate-900/5">
        {htmlFileUrl ? (
          <iframe 
            src={htmlFileUrl} 
            title={title}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pb-10 px-4 text-center">
            <Box className="w-16 h-16 mb-4 text-slate-300" />
            <p className="font-semibold text-slate-700 mb-2">Chưa có liên kết tệp nguồn HTML.</p>
            <p className="text-sm text-slate-500 max-w-md">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
