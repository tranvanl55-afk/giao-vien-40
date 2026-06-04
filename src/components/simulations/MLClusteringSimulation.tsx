import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, RefreshCw, Play, Pause, Trash2, Plus, Minus, Activity, Target, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataPoint {
  x: number;
  y: number;
  id: string;
  clusterId: number; // which centroid it belongs to (-1 = unassigned)
}

interface Centroid {
  x: number;
  y: number;
  id: number;
}

// Color palette for clusters
const CLUSTER_COLORS = [
  { fill: '#3b82f6', stroke: '#93c5fd', glow: 'rgba(59,130,246,0.6)' },   // Blue
  { fill: '#f97316', stroke: '#fdba74', glow: 'rgba(249,115,22,0.6)' },   // Orange
  { fill: '#10b981', stroke: '#6ee7b7', glow: 'rgba(16,185,129,0.6)' },   // Green
  { fill: '#a855f7', stroke: '#d8b4fe', glow: 'rgba(168,85,247,0.6)' },   // Purple
  { fill: '#f43f5e', stroke: '#fda4af', glow: 'rgba(244,63,94,0.6)' },    // Rose
];

function distanceSq(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function assignClusters(points: DataPoint[], centroids: Centroid[]): DataPoint[] {
  if (centroids.length === 0) return points.map(p => ({ ...p, clusterId: -1 }));
  return points.map(p => {
    let minDist = Infinity;
    let assignedId = 0;
    centroids.forEach(c => {
      const d = distanceSq(p.x, p.y, c.x, c.y);
      if (d < minDist) { minDist = d; assignedId = c.id; }
    });
    return { ...p, clusterId: assignedId };
  });
}

function recomputeCentroids(points: DataPoint[], centroids: Centroid[]): Centroid[] {
  return centroids.map(c => {
    const members = points.filter(p => p.clusterId === c.id);
    if (members.length === 0) return c;
    const meanX = members.reduce((sum, p) => sum + p.x, 0) / members.length;
    const meanY = members.reduce((sum, p) => sum + p.y, 0) / members.length;
    return { ...c, x: meanX, y: meanY };
  });
}

function initCentroids(k: number, points: DataPoint[]): Centroid[] {
  // K-Means++ initialization
  if (points.length === 0) {
    // Scatter centroids randomly
    return Array.from({ length: k }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
    }));
  }
  const chosen: Centroid[] = [];
  // Pick first centroid randomly from data points
  const first = points[Math.floor(Math.random() * points.length)];
  chosen.push({ id: 0, x: first.x, y: first.y });
  for (let i = 1; i < k; i++) {
    // Probability proportional to squared distance from nearest centroid
    const dists = points.map(p => {
      return Math.min(...chosen.map(c => distanceSq(p.x, p.y, c.x, c.y)));
    });
    const total = dists.reduce((sum, d) => sum + d, 0);
    let rand = Math.random() * total;
    let idx = 0;
    for (let j = 0; j < dists.length; j++) {
      rand -= dists[j];
      if (rand <= 0) { idx = j; break; }
    }
    chosen.push({ id: i, x: points[idx].x, y: points[idx].y });
  }
  return chosen;
}

const PRESETS = {
  random: { name: 'Ngẫu nhiên', icon: '🎲' },
  blobs: { name: 'Cụm tròn', icon: '⭕' },
  ring: { name: 'Vòng nhẫn', icon: '💍' },
  diagonal: { name: 'Đường chéo', icon: '📐' },
};

function generatePreset(preset: keyof typeof PRESETS, k: number): DataPoint[] {
  const pts: DataPoint[] = [];
  const makeId = () => Math.random().toString(36).substr(2, 9);

  if (preset === 'random') {
    for (let i = 0; i < 50; i++) {
      pts.push({ x: 5 + Math.random() * 90, y: 5 + Math.random() * 90, id: makeId(), clusterId: -1 });
    }
  } else if (preset === 'blobs') {
    const centers = Array.from({ length: k }, (_, i) => ({
      cx: 15 + (70 / (k - 1 || 1)) * i + (Math.random() - 0.5) * 20,
      cy: 15 + Math.random() * 70,
    }));
    centers.forEach(c => {
      for (let i = 0; i < 15; i++) {
        pts.push({
          x: Math.max(3, Math.min(97, c.cx + (Math.random() - 0.5) * 20)),
          y: Math.max(3, Math.min(97, c.cy + (Math.random() - 0.5) * 20)),
          id: makeId(), clusterId: -1
        });
      }
    });
  } else if (preset === 'ring') {
    // Center cluster + outer ring
    for (let i = 0; i < 15; i++) {
      pts.push({ x: 47 + (Math.random() - 0.5) * 10, y: 47 + (Math.random() - 0.5) * 10, id: makeId(), clusterId: -1 });
    }
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const r = 35 + (Math.random() - 0.5) * 6;
      pts.push({ x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle), id: makeId(), clusterId: -1 });
    }
  } else if (preset === 'diagonal') {
    for (let i = 0; i < k; i++) {
      const cx = 10 + (80 / (k - 1 || 1)) * i;
      const cy = 10 + (80 / (k - 1 || 1)) * i;
      for (let j = 0; j < 12; j++) {
        pts.push({
          x: Math.max(3, Math.min(97, cx + (Math.random() - 0.5) * 18)),
          y: Math.max(3, Math.min(97, cy + (Math.random() - 0.5) * 18)),
          id: makeId(), clusterId: -1
        });
      }
    }
  }
  return pts;
}

export function MLClusteringSimulation({ onBack }: { onBack: () => void }) {
  const [k, setK] = useState(3);
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [converged, setConverged] = useState(false);
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS>('blobs');
  const [showVoronoi, setShowVoronoi] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Draw Voronoi background on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const imgData = ctx.createImageData(W, H);

    if (!showVoronoi || centroids.length === 0) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    for (let cy = 0; cy < H; cy++) {
      for (let cx = 0; cx < W; cx++) {
        const px = (cx / W) * 100;
        const py = (cy / H) * 100;
        let minDist = Infinity;
        let nearestId = 0;
        centroids.forEach(c => {
          const d = distanceSq(px, py, c.x, c.y);
          if (d < minDist) { minDist = d; nearestId = c.id; }
        });
        const col = CLUSTER_COLORS[nearestId % CLUSTER_COLORS.length];
        const rgb = parseInt(col.fill.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;
        const idx = (cy * W + cx) * 4;
        imgData.data[idx] = r;
        imgData.data[idx + 1] = g;
        imgData.data[idx + 2] = b;
        imgData.data[idx + 3] = 35;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [centroids, showVoronoi]);

  const stopRunning = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isRunning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (x < 0 || x > 100 || y < 0 || y > 100) return;
    const newPoint: DataPoint = { x, y, id: Math.random().toString(36).substr(2, 9), clusterId: -1 };
    const newPoints = [...points, newPoint];
    const assigned = assignClusters(newPoints, centroids);
    setPoints(assigned);
    setConverged(false);
  };

  const handleReset = useCallback((preset = activePreset, newK = k) => {
    stopRunning();
    const newPts = generatePreset(preset, newK);
    const newCentroids = initCentroids(newK, newPts);
    const assigned = assignClusters(newPts, newCentroids);
    setPoints(assigned);
    setCentroids(newCentroids);
    setIteration(0);
    setConverged(false);
  }, [activePreset, k, stopRunning]);

  // Initialize on mount
  useEffect(() => { handleReset('blobs', 3); }, []); // eslint-disable-line

  const stepOnce = useCallback((currentPoints: DataPoint[], currentCentroids: Centroid[]) => {
    const assigned = assignClusters(currentPoints, currentCentroids);
    const newCentroids = recomputeCentroids(assigned, currentCentroids);
    // Check convergence
    const moved = newCentroids.some((nc, i) => {
      const oc = currentCentroids[i];
      return distanceSq(nc.x, nc.y, oc.x, oc.y) > 0.01;
    });
    return { assigned, newCentroids, moved };
  }, []);

  const handleStep = () => {
    if (converged) return;
    const { assigned, newCentroids, moved } = stepOnce(points, centroids);
    setPoints(assigned);
    setCentroids(newCentroids);
    setIteration(i => i + 1);
    if (!moved) { setConverged(true); stopRunning(); }
  };

  const handleRunToggle = () => {
    if (isRunning) { stopRunning(); return; }
    if (converged) return;
    setIsRunning(true);
    let pts = points;
    let cts = centroids;
    let iter = iteration;
    intervalRef.current = setInterval(() => {
      const { assigned, newCentroids, moved } = stepOnce(pts, cts);
      pts = assigned; cts = newCentroids; iter++;
      setPoints([...pts]);
      setCentroids([...cts]);
      setIteration(iter);
      if (!moved) {
        setConverged(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
      }
    }, 700);
  };

  const changeK = (delta: number) => {
    const newK = Math.max(2, Math.min(5, k + delta));
    setK(newK);
    handleReset(activePreset, newK);
  };

  // Cluster stats
  const clusterStats = useMemo(() => {
    return centroids.map(c => ({
      id: c.id,
      count: points.filter(p => p.clusterId === c.id).length,
    }));
  }, [points, centroids]);

  const inertia = useMemo(() => {
    if (points.length === 0) return 0;
    return points.reduce((sum, p) => {
      const c = centroids.find(c => c.id === p.clusterId);
      if (!c) return sum;
      return sum + distanceSq(p.x, p.y, c.x, c.y);
    }, 0);
  }, [points, centroids]);

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden font-sans text-slate-100 select-none">
      {/* BG */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-black pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Sidebar */}
      <div className="w-full md:w-80 h-auto md:h-full bg-slate-900/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col z-10 shrink-0 overflow-y-auto">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6 w-fit group">
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-emerald-500/20 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
          <span className="font-bold text-sm">Quay lại</span>
        </button>

        <div className="flex items-center space-x-2.5 mb-1">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400"><Layers className="w-5 h-5" /></div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Machine Learning</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">Phân Cụm K-Means</h1>
        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-5">
          Thuật toán phân nhóm dữ liệu không có nhãn. Các tâm cụm (centroid) di chuyển lặp đi lặp lại cho đến khi hội tụ.
        </p>

        {/* K Selector */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Số cụm (K)</p>
          <div className="flex items-center justify-between">
            <button onClick={() => changeK(-1)} disabled={k <= 2} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30">
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => changeK(n - k)} className={`w-9 h-9 rounded-xl font-black text-sm transition-all border cursor-pointer ${k === n ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}>{n}</button>
              ))}
            </div>
            <button onClick={() => changeK(1)} disabled={k >= 5} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Dữ liệu mẫu</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map(key => (
              <button key={key} onClick={() => { setActivePreset(key); handleReset(key, k); }}
                className={`py-2 px-2 rounded-xl text-[10.5px] font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${activePreset === key ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
                <span>{PRESETS[key].icon}</span>
                <span>{PRESETS[key].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voronoi toggle */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-300">Vùng Voronoi</p>
            <p className="text-[10px] text-slate-500">Tô màu vùng ảnh hưởng của mỗi cụm</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={showVoronoi} onChange={e => setShowVoronoi(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
          </label>
        </div>

        {/* Cluster Stats */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Thống kê cụm</p>
          </div>
          <div className="space-y-2">
            {clusterStats.map(s => {
              const col = CLUSTER_COLORS[s.id % CLUSTER_COLORS.length];
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_6px_currentColor]" style={{ backgroundColor: col.fill }} />
                  <div className="flex-1 bg-slate-800/60 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${points.length ? (s.count / points.length) * 100 : 0}%`, backgroundColor: col.fill }} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold w-8 text-right">{s.count}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-[10px] text-slate-500">
            <span>Inertia (↓ tốt hơn)</span>
            <span className="text-cyan-400 font-bold">{inertia.toFixed(0)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-auto space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button onClick={handleStep} disabled={converged || isRunning} className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 font-bold text-[11px] transition-all disabled:opacity-30 cursor-pointer">
              Bước
            </button>
            <button onClick={handleRunToggle} disabled={converged} className={`py-2.5 rounded-xl border font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${isRunning ? 'bg-amber-600/80 border-amber-500/50 text-white' : 'bg-emerald-600 border-emerald-500/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'} disabled:opacity-30`}>
              {isRunning ? <><Pause className="w-3 h-3" /> Dừng</> : <><Play className="w-3 h-3 fill-white" /> Chạy</>}
            </button>
            <button onClick={() => handleReset(activePreset, k)} className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
          <button onClick={() => { stopRunning(); setPoints([]); setCentroids(initCentroids(k, [])); setIteration(0); setConverged(false); }}
            className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" /> Xóa dữ liệu
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col p-4 md:p-6 relative z-10">
        {/* HUD */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 border border-white/10 rounded-2xl p-4 backdrop-blur-md justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-black text-slate-200">K-Means Clustering</span>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Số điểm</p>
              <p className="text-xl font-black text-white">{points.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Vòng lặp</p>
              <p className="text-xl font-black text-cyan-400">{iteration}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Trạng thái</p>
              <p className={`text-xl font-black ${converged ? 'text-emerald-400' : 'text-amber-400'}`}>
                {converged ? '✓ Hội tụ' : isRunning ? '⟳ Đang chạy' : '⏸ Chờ'}
              </p>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-xs border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
          {/* Axis labels */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-widest z-10 pointer-events-none">Đặc trưng X</div>
          <div className="absolute top-1/2 left-3 -translate-y-1/2 -rotate-90 origin-center text-[10px] text-slate-500 font-bold uppercase tracking-widest z-10 pointer-events-none">Đặc trưng Y</div>

          {/* Click hint */}
          {points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-2xl">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 animate-bounce">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-slate-200 font-bold text-sm">Nhấp để thêm điểm dữ liệu hoặc chọn mẫu bên trái</span>
              </div>
            </div>
          )}

          {/* Convergence badge */}
          <AnimatePresence>
            {converged && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-4 py-2 rounded-xl backdrop-blur-sm">
                ✓ Thuật toán đã hội tụ!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interaction layer */}
          <div ref={containerRef} onClick={handleContainerClick}
            className={`absolute inset-8 overflow-hidden rounded-2xl border border-white/5 shadow-inner ${!isRunning ? 'cursor-crosshair' : 'cursor-default'}`}>

            {/* Voronoi canvas */}
            <canvas ref={canvasRef} width={80} height={80} className="absolute inset-0 w-full h-full" style={{ imageRendering: 'pixelated' }} />

            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
              <defs>
                <pattern id="cluster-grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cluster-grid)" />
            </svg>

            {/* Data points */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <AnimatePresence>
                {points.map(p => {
                  const col = p.clusterId >= 0 ? CLUSTER_COLORS[p.clusterId % CLUSTER_COLORS.length] : { fill: '#475569', stroke: '#64748b', glow: 'rgba(71,85,105,0.4)' };
                  return (
                    <motion.circle key={p.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      cx={`${p.x}%`} cy={`${p.y}%`} r="5"
                      fill={col.fill} stroke={col.stroke} strokeWidth="2"
                      style={{ filter: `drop-shadow(0 0 4px ${col.glow})` }}
                    />
                  );
                })}
              </AnimatePresence>

              {/* Centroid markers */}
              {centroids.map(c => {
                const col = CLUSTER_COLORS[c.id % CLUSTER_COLORS.length];
                return (
                  <motion.g key={c.id}
                    animate={{ x: 0, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
                    {/* Outer ring pulse */}
                    <circle cx={`${c.x}%`} cy={`${c.y}%`} r="16" fill="none" stroke={col.stroke} strokeWidth="1" opacity="0.3" />
                    {/* Main cross */}
                    <line x1={`calc(${c.x}% - 10px)`} y1={`${c.y}%`} x2={`calc(${c.x}% + 10px)`} y2={`${c.y}%`} stroke={col.stroke} strokeWidth="2.5" strokeLinecap="round" />
                    <line x1={`${c.x}%`} y1={`calc(${c.y}% - 10px)`} x2={`${c.x}%`} y2={`calc(${c.y}% + 10px)`} stroke={col.stroke} strokeWidth="2.5" strokeLinecap="round" />
                    {/* Center dot */}
                    <circle cx={`${c.x}%`} cy={`${c.y}%`} r="5" fill={col.fill} stroke="white" strokeWidth="2.5"
                      style={{ filter: `drop-shadow(0 0 8px ${col.glow})` }} />
                    {/* Label */}
                    <text x={`${c.x}%`} y={`calc(${c.y}% - 16px)`} textAnchor="middle" fill={col.stroke}
                      fontSize="10" fontWeight="bold" fontFamily="monospace">
                      K{c.id + 1}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 right-4 z-20 flex gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900/70 border border-white/10 px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
              <div className="w-3 h-3 rounded-full bg-slate-500 border border-slate-400" />
              <span className="text-[9px] text-slate-400 font-bold">Điểm dữ liệu</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/70 border border-white/10 px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
              <div className="w-3 h-3 rounded-full bg-white border-2 border-emerald-400" />
              <span className="text-[9px] text-slate-400 font-bold">Tâm cụm (Centroid)</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-3 flex items-center gap-2 text-slate-500 text-[11px] font-medium justify-center">
          <span>💡 Nhấn <strong className="text-slate-400">Bước</strong> để xem từng vòng lặp E-step/M-step · Nhấn <strong className="text-slate-400">Chạy</strong> để tự động · Nhấp vào bảng để thêm điểm</span>
        </div>
      </div>
    </div>
  );
}
