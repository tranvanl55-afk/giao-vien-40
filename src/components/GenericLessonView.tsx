import React from 'react';
import { ArrowLeft, Rocket, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

interface GenericLessonViewProps {
  onBack: () => void;
  title: string;
  description: string;
  categoryName: string;
}

export const GenericLessonView: React.FC<GenericLessonViewProps> = ({ onBack, title, description, categoryName }) => {
  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-black"></div>
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Quay lại</span>
      </button>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/20">
          <Wrench className="w-10 h-10 text-white" />
        </div>
        
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold text-sm tracking-widest uppercase mb-4">
          {categoryName}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400 mb-6 drop-shadow-sm">
          {title}
        </h1>
        
        <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium">
          {description}
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md w-full">
          <div className="flex flex-col items-center">
            <Rocket className="w-12 h-12 text-cyan-400 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">Đang trong quá trình phát triển</h3>
            <p className="text-sm text-slate-400">
              Mô đun này hiện đang được các kỹ sư của chúng tôi xây dựng và sẽ sớm ra mắt.
              Vui lòng quay lại sau nhé!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
