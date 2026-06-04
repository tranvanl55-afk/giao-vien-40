import React, { useState, useRef, useMemo } from 'react';
import { ArrowLeft, RefreshCw, Info, Target, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  id: string;
}

export const MLRegressionSimulation: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Thuật toán Bình phương tối thiểu (Ordinary Least Squares)
  const regressionLine = useMemo(() => {
    const n = points.length;
    if (n < 2) return null;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += points[i].x;
      sumY += points[i].y;
      sumXY += points[i].x * points[i].y;
      sumXX += points[i].x * points[i].x;
    }

    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return null; // Avoid division by zero if all points have same X

    const m = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    return { m, b };
  }, [points]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();

    // Calculate relative position 0-100%
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPoints([...points, { x, y, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const handleClear = () => {
    setPoints([]);
  };

  const handleAddRandom = () => {
    const newPoints: Point[] = [];
    const baseSlope = (Math.random() - 0.5) * 2; // -1 to 1
    const baseIntercept = Math.random() * 50 + 25; // 25 to 75

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 90 + 5; // 5 to 95
      let y = baseSlope * x + baseIntercept + (Math.random() - 0.5) * 30; // Add noise
      // Clamp Y to 5-95
      y = Math.max(5, Math.min(95, y));
      newPoints.push({ x, y, id: Math.random().toString(36).substr(2, 9) });
    }

    setPoints(newPoints);
  };

  // Calculate error/loss metric (Mean Squared Error)
  const mse = useMemo(() => {
    if (!regressionLine || points.length < 2) return 0;
    let totalError = 0;
    points.forEach(p => {
      const predictedY = regressionLine.m * p.x + regressionLine.b;
      totalError += Math.pow(p.y - predictedY, 2);
    });
    return (totalError / points.length).toFixed(2);
  }, [points, regressionLine]);

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Sidebar Controls */}
      <div className="w-full md:w-80 h-auto md:h-full bg-slate-900/60 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col z-10 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8 w-fit group"
        >
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-cyan-500/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-bold">Quay lại</span>
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Machine Learning</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-6 leading-tight">
          Hồi Quy Tuyến Tính
        </h1>

        <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
          Nhấp chuột vào biểu đồ bên phải để thêm dữ liệu. Trí tuệ nhân tạo sẽ tự động tìm kiếm và vẽ một đường thẳng "phù hợp nhất" đi qua các điểm đó nhằm giảm thiểu sai số.
        </p>

        <div className="space-y-4 mt-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tổng số điểm</p>
            <p className="text-4xl font-black text-white">{points.length}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Sai số trung bình (MSE)</p>
            <p className={`text-3xl font-black transition-colors ${regressionLine ? 'text-cyan-400' : 'text-slate-600'}`}>
              {regressionLine ? mse : '--'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={handleAddRandom}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Ngẫu nhiên</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold py-3 px-4 rounded-xl transition-all"
            >
              <span className="text-sm">Xóa dữ liệu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col p-4 md:p-8 relative z-10 min-h-[500px]">
        {/* Helper Badge */}
        {points.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 pointer-events-none shadow-xl z-20"
          >
            <MousePointer2 className="w-6 h-6 text-cyan-400 animate-bounce" />
            <span className="text-slate-200 font-bold text-lg">Click để thêm điểm dữ liệu</span>
          </motion.div>
        )}

        {/* The SVG Canvas */}
        <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative group">
          {/* Axis Labels */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 font-bold text-xs uppercase tracking-widest pointer-events-none">
            Trục X (Biến Độc Lập)
          </div>
          <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 text-slate-500 font-bold text-xs uppercase tracking-widest pointer-events-none origin-center">
            Trục Y (Biến Phụ Thuộc)
          </div>

          <svg
            ref={svgRef}
            onClick={handleSvgClick}
            className="w-full h-full cursor-crosshair"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" pointerEvents="none" />

            {/* Regression Line */}
            {regressionLine && (
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                // We draw the line crossing the entire width (0% to 100%)
                x1="0%"
                y1={`${regressionLine.b}%`}
                x2="100%"
                y2={`${regressionLine.m * 100 + regressionLine.b}%`}
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                pointerEvents="none"
              />
            )}

            {/* Gradient for Regression Line */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            {/* Error Lines (Residuals) */}
            <AnimatePresence>
              {regressionLine && points.map(point => {
                const predictedY = regressionLine.m * point.x + regressionLine.b;
                return (
                  <motion.line
                    key={`err-${point.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    x1={`${point.x}%`}
                    y1={`${point.y}%`}
                    x2={`${point.x}%`}
                    y2={`${predictedY}%`}
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    pointerEvents="none"
                  />
                );
              })}
            </AnimatePresence>

            {/* Data Points */}
            <AnimatePresence>
              {points.map((point) => (
                <motion.circle
                  key={point.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  cx={`${point.x}%`}
                  cy={`${point.y}%`}
                  r="6"
                  fill="#f8fafc"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="drop-shadow-md cursor-pointer hover:stroke-cyan-400 transition-colors"
                  // Stop propagation so clicking a point doesn't add a new point underneath
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setPoints(points.filter(p => p.id !== point.id));
                  }}
                />
              ))}
            </AnimatePresence>
          </svg>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs font-medium justify-center">
          <Info className="w-4 h-4" />
          <span>Mẹo: Nhấp trực tiếp vào một điểm dữ liệu để xóa nó. Đường thẳng sẽ ngay lập tức tự cân bằng lại.</span>
        </div>
      </div>
    </div>
  );
};
