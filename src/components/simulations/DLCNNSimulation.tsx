import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Eye, Grid3X3, Sliders, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────────────────────────────────────

type ImagePreset = 'edge-h' | 'edge-v' | 'diagonal' | 'face' | 'custom';
type FilterPreset = 'edge-detect' | 'sharpen' | 'blur' | 'emboss' | 'top-sobel' | 'left-sobel';

const IMAGE_PRESETS: Record<ImagePreset, { name: string; icon: string; grid: number[][] }> = {
  'edge-h': {
    name: 'Cạnh ngang',
    icon: '─',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
    ]
  },
  'edge-v': {
    name: 'Cạnh dọc',
    icon: '│',
    grid: [
      [0,0,0,1,1,1,1,1],
      [0,0,0,1,1,1,1,1],
      [0,0,0,1,1,1,1,1],
      [0,0,0,1,1,1,1,1],
      [0,0,0,1,1,1,1,1],
      [0,0,0,1,1,1,1,1],
      [0,0,0,1,1,1,1,1],
      [0,0,0,1,1,1,1,1],
    ]
  },
  'diagonal': {
    name: 'Đường chéo',
    icon: '╲',
    grid: [
      [1,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,0],
      [0,0,0,1,0,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,1],
    ]
  },
  'face': {
    name: 'Khuôn mặt',
    icon: '😊',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,1,0,0,1,1,0],
      [0,1,1,0,0,1,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,1],
      [0,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0],
    ]
  },
  'custom': {
    name: 'Tùy chỉnh',
    icon: '✏️',
    grid: Array(8).fill(null).map(() => Array(8).fill(0)),
  },
};

const FILTER_PRESETS: Record<FilterPreset, { name: string; kernel: number[][]; desc: string; color: string }> = {
  'edge-detect': {
    name: 'Phát hiện cạnh',
    desc: 'Làm nổi bật biên của vật thể',
    color: 'text-cyan-400',
    kernel: [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],
  },
  'sharpen': {
    name: 'Làm sắc nét',
    desc: 'Tăng cường chi tiết và độ rõ nét',
    color: 'text-blue-400',
    kernel: [[0,-1,0],[-1,5,-1],[0,-1,0]],
  },
  'blur': {
    name: 'Làm mờ (Blur)',
    desc: 'Trung bình hóa vùng lân cận',
    color: 'text-purple-400',
    kernel: [[1,1,1],[1,1,1],[1,1,1]].map(row => row.map(v => v / 9)),
  },
  'emboss': {
    name: 'Nổi (Emboss)',
    desc: 'Tạo hiệu ứng 3D nổi',
    color: 'text-amber-400',
    kernel: [[-2,-1,0],[-1,1,1],[0,1,2]],
  },
  'top-sobel': {
    name: 'Sobel trên',
    desc: 'Phát hiện cạnh theo chiều dọc',
    color: 'text-emerald-400',
    kernel: [[-1,-2,-1],[0,0,0],[1,2,1]],
  },
  'left-sobel': {
    name: 'Sobel trái',
    desc: 'Phát hiện cạnh theo chiều ngang',
    color: 'text-rose-400',
    kernel: [[-1,0,1],[-2,0,2],[-1,0,1]],
  },
};

function applyConvolution(image: number[][], kernel: number[][]): number[][] {
  const h = image.length;
  const w = image[0].length;
  const kh = kernel.length;
  const kw = kernel[0].length;
  const ph = Math.floor(kh / 2);
  const pw = Math.floor(kw / 2);
  const output: number[][] = Array(h).fill(null).map(() => Array(w).fill(0));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let ky = 0; ky < kh; ky++) {
        for (let kx = 0; kx < kw; kx++) {
          const iy = y + ky - ph;
          const ix = x + kx - pw;
          if (iy >= 0 && iy < h && ix >= 0 && ix < w) {
            sum += image[iy][ix] * kernel[ky][kx];
          }
        }
      }
      output[y][x] = sum;
    }
  }

  // Normalize to [0, 1]
  let min = Infinity, max = -Infinity;
  output.forEach(row => row.forEach(v => { if (v < min) min = v; if (v > max) max = v; }));
  const range = max - min || 1;
  return output.map(row => row.map(v => (v - min) / range));
}

function applyReLU(feature: number[][]): number[][] {
  return feature.map(row => row.map(v => Math.max(0, v)));
}

function applyMaxPool(feature: number[][], poolSize = 2): number[][] {
  const h = Math.floor(feature.length / poolSize);
  const w = Math.floor(feature[0].length / poolSize);
  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => {
      let max = -Infinity;
      for (let py = 0; py < poolSize; py++)
        for (let px = 0; px < poolSize; px++) {
          const v = feature[y * poolSize + py]?.[x * poolSize + px] ?? 0;
          if (v > max) max = v;
        }
      return max === -Infinity ? 0 : max;
    })
  );
}

function valueToColor(v: number, colormap: 'gray' | 'heat' | 'cyan'): string {
  const c = Math.round(v * 255);
  if (colormap === 'gray') return `rgb(${c},${c},${c})`;
  if (colormap === 'heat') return `rgb(${Math.round(v * 255)},${Math.round(v * 80)},${Math.round(v * 20)})`;
  return `rgb(${Math.round(v * 20)},${Math.round(v * 200)},${Math.round(v * 255)})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Grid pixel editor
// ─────────────────────────────────────────────────────────────────────────────

function PixelGrid({ grid, onChange, size = 8 }: {
  grid: number[][];
  onChange: (g: number[][]) => void;
  size: number;
}) {
  const [drawing, setDrawing] = useState(false);
  const [drawValue, setDrawValue] = useState(1);

  const handleCell = (y: number, x: number, isDown = false) => {
    const newValue = isDown ? (grid[y][x] > 0 ? 0 : 1) : drawValue;
    if (!drawing && !isDown) return;
    if (isDown) setDrawValue(grid[y][x] > 0 ? 0 : 1);
    const newGrid = grid.map((row, ry) => row.map((cell, rx) => (ry === y && rx === x) ? newValue : cell));
    onChange(newGrid);
  };

  return (
    <div className="select-none"
      onMouseLeave={() => setDrawing(false)}
      onMouseUp={() => setDrawing(false)}>
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div key={x}
              style={{ width: `${100 / size}%` }}
              className={`aspect-square border border-slate-700/50 cursor-crosshair transition-all duration-75 ${cell > 0 ? 'bg-white' : 'bg-slate-900/60'}`}
              onMouseDown={() => { setDrawing(true); handleCell(y, x, true); }}
              onMouseEnter={() => handleCell(y, x)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature map grid viewer
// ─────────────────────────────────────────────────────────────────────────────

function FeatureMap({ data, colormap, label, size = 80 }: {
  data: number[][];
  colormap: 'gray' | 'heat' | 'cyan';
  label: string;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const h = data.length;
    const w = data[0]?.length ?? 0;
    canvas.width = w;
    canvas.height = h;
    const imgData = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = data[y][x] ?? 0;
        const col = valueToColor(v, colormap);
        const match = col.match(/\d+/g);
        if (!match) continue;
        const idx = (y * w + x) * 4;
        imgData.data[idx] = parseInt(match[0]);
        imgData.data[idx + 1] = parseInt(match[1]);
        imgData.data[idx + 2] = parseInt(match[2]);
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [data, colormap]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <canvas ref={canvasRef} className="rounded-lg border border-white/10 shadow-lg" style={{ width: size, height: size, imageRendering: 'pixelated' }} />
      <span className="text-[9px] text-slate-500 font-bold text-center leading-tight">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function DLCNNSimulation({ onBack }: { onBack: () => void }) {
  const [activePreset, setActivePreset] = useState<ImagePreset>('edge-h');
  const [activeFilter, setActiveFilter] = useState<FilterPreset>('edge-detect');
  const [imageGrid, setImageGrid] = useState<number[][]>(IMAGE_PRESETS['edge-h'].grid.map(r => [...r]));
  const [animateStep, setAnimateStep] = useState(0); // 0=input, 1=conv, 2=relu, 3=pool
  const [kernelEdit, setKernelEdit] = useState(false);
  const [customKernel, setCustomKernel] = useState<number[][]>(FILTER_PRESETS['edge-detect'].kernel.map(r => [...r]));

  const kernel = kernelEdit ? customKernel : FILTER_PRESETS[activeFilter].kernel;
  const convOutput = applyConvolution(imageGrid, kernel);
  const reluOutput = applyReLU(convOutput);
  const poolOutput = applyMaxPool(reluOutput);

  const handlePreset = (p: ImagePreset) => {
    setActivePreset(p);
    if (p !== 'custom') setImageGrid(IMAGE_PRESETS[p].grid.map(r => [...r]));
  };

  const handleFilterChange = (f: FilterPreset) => {
    setActiveFilter(f);
    setCustomKernel(FILTER_PRESETS[f].kernel.map(r => [...r]));
    setKernelEdit(false);
  };

  // Animate through pipeline
  useEffect(() => {
    const id = setInterval(() => setAnimateStep(s => (s + 1) % 4), 1500);
    return () => clearInterval(id);
  }, []);

  const stepLabels = ['Input', 'Convolution', 'ReLU', 'Max Pooling'];
  const stepColors = ['text-slate-300', 'text-cyan-400', 'text-orange-400', 'text-emerald-400'];

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden font-sans text-slate-100 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Sidebar */}
      <div className="w-full md:w-80 h-auto md:h-full bg-slate-900/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col z-10 shrink-0 overflow-y-auto">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors mb-6 w-fit group">
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-blue-500/20 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
          <span className="font-bold text-sm">Quay lại</span>
        </button>

        <div className="flex items-center space-x-2.5 mb-1">
          <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400"><Eye className="w-5 h-5" /></div>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Deep Learning</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">Thị Giác Máy (CNN)</h1>
        <p className="text-slate-400 text-xs leading-relaxed mb-5">
          Khám phá cách CNN nhìn thấy thế giới thông qua từng lớp xử lý: Convolution → ReLU → Max Pooling.
        </p>

        {/* Image presets */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Hình ảnh đầu vào (8×8)</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(Object.keys(IMAGE_PRESETS) as ImagePreset[]).map(p => (
              <button key={p} onClick={() => handlePreset(p)}
                className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${activePreset === p ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}>
                <div className="text-base">{IMAGE_PRESETS[p].icon}</div>
                <div className="text-[9px]">{IMAGE_PRESETS[p].name}</div>
              </button>
            ))}
          </div>
          {/* Pixel editor */}
          <div className="bg-slate-950 border border-white/5 rounded-xl overflow-hidden">
            <PixelGrid grid={imageGrid} onChange={(g) => { setImageGrid(g); setActivePreset('custom'); }} size={8} />
          </div>
          <p className="text-[9px] text-slate-600 text-center mt-1.5">Nhấp để vẽ pixel</p>
        </div>

        {/* Filter presets */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bộ lọc (Filter)</p>
            <button onClick={() => setKernelEdit(e => !e)}
              className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${kernelEdit ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
              <Sliders className="w-3 h-3 inline mr-1" />Chỉnh sửa
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(FILTER_PRESETS) as FilterPreset[]).map(f => (
              <button key={f} onClick={() => handleFilterChange(f)}
                className={`py-1.5 px-2 rounded-xl text-[9.5px] font-bold border transition-all text-left cursor-pointer ${activeFilter === f && !kernelEdit ? 'bg-slate-700 border-slate-500' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}>
                <span className={FILTER_PRESETS[f].color}>{FILTER_PRESETS[f].name}</span>
                <br />
                <span className="text-slate-600 text-[8px]">{FILTER_PRESETS[f].desc}</span>
              </button>
            ))}
          </div>

          {/* Kernel editor */}
          {kernelEdit && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">Nhân tích chập (3×3)</p>
              <div className="bg-slate-950 border border-white/10 rounded-xl p-2">
                {customKernel.map((row, ky) => (
                  <div key={ky} className="flex gap-1.5 mb-1.5">
                    {row.map((val, kx) => (
                      <input key={kx} type="number" step="0.5" value={val}
                        onChange={e => {
                          const newK = customKernel.map((r, ry) => r.map((v, rx) => (ry === ky && rx === kx) ? parseFloat(e.target.value) || 0 : v));
                          setCustomKernel(newK);
                        }}
                        className="flex-1 bg-slate-800 border border-slate-600 rounded-md text-center text-xs text-white font-mono py-1 min-w-0" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <button onClick={() => setImageGrid(Array(8).fill(null).map(() => Array(8).fill(0)))}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Xóa canvas
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col p-4 md:p-6 relative z-10 gap-4 overflow-y-auto">
        {/* Pipeline header */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-black text-slate-200">CNN Pipeline – Quy trình xử lý ảnh</span>
          </div>
          <div className="flex gap-2">
            {stepLabels.map((s, i) => (
              <div key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${animateStep === i ? 'bg-slate-700 border-slate-500 ' + stepColors[i] : 'bg-white/5 border-white/5 text-slate-600'}`}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Feature maps row */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input + Kernel */}
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${animateStep === 0 ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">1. Ảnh đầu vào (Input)</span>
            </div>
            <div className="flex gap-6 items-start justify-center flex-wrap">
              <FeatureMap data={imageGrid} colormap="gray" label="Ảnh gốc (8×8)" size={120} />
              <div className="flex flex-col items-center gap-1.5">
                <div className="bg-slate-950 border border-white/10 rounded-xl p-2">
                  {kernel.map((row, ky) => (
                    <div key={ky} className="flex gap-1 mb-1">
                      {row.map((val, kx) => {
                        const intensity = Math.abs(val) / 9;
                        const bg = val > 0 ? `rgba(59,130,246,${Math.min(1, intensity * 2)})` : val < 0 ? `rgba(249,115,22,${Math.min(1, intensity * 2)})` : 'rgba(255,255,255,0.05)';
                        return (
                          <div key={kx} className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold text-white border border-white/5"
                            style={{ backgroundColor: bg }}>
                            {val % 1 === 0 ? val : val.toFixed(2)}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <span className="text-[9px] text-slate-500 font-bold">Bộ lọc 3×3</span>
                <span className="text-[9px] text-blue-400 font-bold">{kernelEdit ? 'Tùy chỉnh' : FILTER_PRESETS[activeFilter].name}</span>
              </div>
            </div>
          </div>

          {/* Convolution result */}
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${animateStep === 1 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">2. Tích chập (Convolution)</span>
            </div>
            <div className="flex gap-6 items-center justify-center">
              <FeatureMap data={convOutput} colormap="heat" label="Feature Map (8×8)" size={120} />
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-32">
                  Mỗi pixel là tổng có trọng số của vùng lân cận × bộ lọc
                </p>
                <div className="mt-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-2">
                  <p className="text-[9px] text-cyan-400 font-bold">CÔNG THỨC</p>
                  <p className="text-[10px] text-white font-mono">∑(I⊙K)</p>
                </div>
              </div>
            </div>
          </div>

          {/* ReLU */}
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${animateStep === 2 ? 'bg-orange-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">3. Kích hoạt ReLU</span>
            </div>
            <div className="flex gap-6 items-center justify-center">
              <FeatureMap data={reluOutput} colormap="heat" label="Sau ReLU (8×8)" size={120} />
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-32">
                  Giữ lại giá trị dương, triệt tiêu giá trị âm
                </p>
                <div className="mt-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2">
                  <p className="text-[9px] text-orange-400 font-bold">CÔNG THỨC</p>
                  <p className="text-[10px] text-white font-mono">max(0, x)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Max Pooling */}
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${animateStep === 3 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">4. Max Pooling (2×2)</span>
            </div>
            <div className="flex gap-6 items-center justify-center">
              <FeatureMap data={poolOutput} colormap="cyan" label="Sau Pooling (4×4)" size={120} />
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-32">
                  Giảm kích thước, giữ lại giá trị lớn nhất trong mỗi ô 2×2
                </p>
                <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                  <p className="text-[9px] text-emerald-400 font-bold">KẾT QUẢ</p>
                  <p className="text-[10px] text-white font-mono">4×4 → giảm ½</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium justify-center">
          <span>💡 Vẽ pixel lên lưới 8×8, chọn bộ lọc và xem ngay feature map thay đổi trong thời gian thực</span>
        </div>
      </div>
    </div>
  );
}
