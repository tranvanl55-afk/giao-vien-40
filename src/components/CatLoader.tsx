import React from 'react';

export function CatLoader() {
  return (
    <div className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center bg-[#f49b29] z-9999">
      <h1 className="absolute top-16 text-white text-3xl md:text-5xl font-bold italic tracking-wide drop-shadow-md">
        Cat Loading Animation
      </h1>
      
      <div className="relative flex flex-col items-center mt-10">
        {/* Bouncing Cat Image */}
        <img 
          src="https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FGemini_Generated_Image_jlkmwjlkmwjlkmwj-removebg-preview.png?alt=media&token=ad3842e6-cf01-4b77-a46f-48e9e0864925"
          alt="Loading Cat" 
          className="w-48 h-48 object-contain drop-shadow-2xl animate-bounce"
          style={{ animationDuration: '0.8s' }}
        />
        
        {/* Loading Dots */}
        <div className="flex gap-3 mt-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-3 bg-black/40 rounded-full"
              style={{
                animation: `pulse-dot 1s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 1; bg-color: rgba(0,0,0,0.8); }
        }
      `}</style>
    </div>
  );
}
