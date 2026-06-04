import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, RefreshCw, Trash2, Play, Pause, HelpCircle, Activity, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  x: number; // 0 to 100
  y: number; // 0 to 100
  label: 'A' | 'B'; // Class label
  id: string;
}

type AlgorithmType = 'logistic' | 'knn' | 'rbf';

export function MLClassificationSimulation({ onBack }: { onBack: () => void }) {
  const [points, setPoints] = useState<Point[]>([]);
  const [currentClass, setCurrentClass] = useState<'A' | 'B'>('A');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('rbf');
  const [isAutoTrain, setIsAutoTrain] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [gridResolution, setGridResolution] = useState(60); // Resolution of heatmap grid (60x60)
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trainingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Model parameters for Logistic Regression
  const [logRegParams, setLogRegParams] = useState({ w1: 0.1, w2: -0.2, b: 0.05 });
  // Model parameters for RBF Kernel Ridge Regression (alpha coefficients)
  const [rbfAlphas, setRbfAlphas] = useState<number[]>([]);

  // Constant hyperparameters
  const RBF_GAMMA = 15.0;
  const RBF_LAMBDA = 0.05;

  // Clear training interval on unmount
  useEffect(() => {
    return () => {
      if (trainingIntervalRef.current) clearInterval(trainingIntervalRef.current);
    };
  }, []);

  // Solve system of linear equations using Gaussian elimination
  const solveLinearSystem = (A: number[][], b: number[]): number[] => {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);
    
    for (let i = 0; i < n; i++) {
      let maxEl = Math.abs(M[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > maxEl) {
          maxEl = Math.abs(M[k][i]);
          maxRow = k;
        }
      }
      const temp = M[maxRow];
      M[maxRow] = M[i];
      M[i] = temp;

      if (Math.abs(M[i][i]) < 1e-9) continue;

      for (let k = i + 1; k < n; k++) {
        const c = -M[k][i] / M[i][i];
        for (let j = i; j <= n; j++) {
          if (i === j) {
            M[k][j] = 0;
          } else {
            M[k][j] += c * M[i][j];
          }
        }
      }
    }

    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      if (Math.abs(M[i][i]) < 1e-9) continue;
      x[i] = M[i][n] / M[i][i];
      for (let k = i - 1; k >= 0; k--) {
        M[k][n] -= M[k][i] * x[i];
      }
    }
    return x;
  };

  // Helper: Gaussian RBF Kernel evaluation
  const rbfKernel = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = (x1 - x2) / 100;
    const dy = (y1 - y2) / 100;
    const distSq = dx * dx + dy * dy;
    return Math.exp(-RBF_GAMMA * distSq);
  };

  // 1. Train RBF Model Analytically
  const trainRBF = (currentPoints: Point[]) => {
    const n = currentPoints.length;
    if (n === 0) {
      setRbfAlphas([]);
      return;
    }

    const K: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const Y: number[] = [];

    for (let i = 0; i < n; i++) {
      Y.push(currentPoints[i].label === 'A' ? 1 : -1);
      for (let j = 0; j < n; j++) {
        K[i][j] = rbfKernel(currentPoints[i].x, currentPoints[i].y, currentPoints[j].x, currentPoints[j].y);
        if (i === j) {
          K[i][j] += RBF_LAMBDA; // Regularization diagonal
        }
      }
    }

    const alphas = solveLinearSystem(K, Y);
    setRbfAlphas(alphas);
  };

  // 2. Train Logistic Regression model for 1 epoch
  const trainLogisticStep = (currentPoints: Point[], currentParams: typeof logRegParams, lr = 0.3) => {
    if (currentPoints.length === 0) return currentParams;

    let gradW1 = 0;
    let gradW2 = 0;
    let gradB = 0;

    currentPoints.forEach(p => {
      const px = p.x / 100;
      const py = p.y / 100;
      const target = p.label === 'A' ? 1 : 0;
      
      const z = currentParams.w1 * px + currentParams.w2 * py + currentParams.b;
      const pred = 1 / (1 + Math.exp(-z));
      const err = pred - target;

      gradW1 += err * px;
      gradW2 += err * py;
      gradB += err;
    });

    const n = currentPoints.length;
    return {
      w1: currentParams.w1 - (lr * gradW1) / n,
      w2: currentParams.w2 - (lr * gradW2) / n,
      b: currentParams.b - (lr * gradB) / n,
    };
  };

  // Auto-train loop trigger when points changes
  useEffect(() => {
    if (points.length === 0) {
      setLossHistory([]);
      setEpoch(0);
      return;
    }

    if (isAutoTrain) {
      // Retrain RBF model instantly
      trainRBF(points);

      // Train Logistic Regression for 400 epochs instantly
      let params = { w1: 0.1, w2: -0.2, b: 0.05 };
      for (let i = 0; i < 400; i++) {
        params = trainLogisticStep(points, params);
      }
      setLogRegParams(params);
      setEpoch(400);

      // Compute final loss
      const finalLoss = computeLoss(points, params, rbfAlphas, algorithm);
      setLossHistory([finalLoss]);
    }
  }, [points, isAutoTrain, algorithm]);

  // Handle Manual Training Animation
  const startManualTraining = () => {
    if (points.length === 0) return;
    if (trainingIntervalRef.current) clearInterval(trainingIntervalRef.current);
    setIsTraining(true);
    setEpoch(0);
    setLossHistory([]);

    // Reset weights
    let params = { w1: Math.random() - 0.5, w2: Math.random() - 0.5, b: Math.random() - 0.5 };
    setLogRegParams(params);
    trainRBF(points); // RBF trains instantly analytically

    let currentEpoch = 0;
    const history: number[] = [];

    trainingIntervalRef.current = setInterval(() => {
      currentEpoch += 10;
      
      // Train 10 epochs of Logistic Regression
      for (let i = 0; i < 10; i++) {
        params = trainLogisticStep(points, params, 0.4);
      }
      setLogRegParams(params);
      setEpoch(currentEpoch);

      // Calculate active loss
      const activeLoss = computeLoss(points, params, rbfAlphas, algorithm);
      history.push(activeLoss);
      setLossHistory([...history]);

      if (currentEpoch >= 300) {
        if (trainingIntervalRef.current) clearInterval(trainingIntervalRef.current);
        setIsTraining(false);
      }
    }, 80);
  };

  const stopTraining = () => {
    if (trainingIntervalRef.current) clearInterval(trainingIntervalRef.current);
    setIsTraining(false);
  };

  // Classification function for a coordinate point
  const predictPoint = (x: number, y: number, customParams = logRegParams, alphas = rbfAlphas) => {
    if (points.length === 0) return 0.5;

    if (algorithm === 'logistic') {
      const px = x / 100;
      const py = y / 100;
      const z = customParams.w1 * px + customParams.w2 * py + customParams.b;
      return 1 / (1 + Math.exp(-z)); // probability of Class A (0 to 1)
    } 
    
    if (algorithm === 'knn') {
      const k = Math.min(3, points.length);
      const distances = points.map(p => {
        const dx = p.x - x;
        const dy = p.y - y;
        return { dist: Math.sqrt(dx * dx + dy * dy), label: p.label };
      });
      distances.sort((a, b) => a.dist - b.dist);
      
      const nearest = distances.slice(0, k);
      const countA = nearest.filter(n => n.label === 'A').length;
      return countA / k; // ratio of nearest points belonging to A
    }

    if (algorithm === 'rbf') {
      // RBF predictions
      if (alphas.length === 0) return 0.5;
      let score = 0;
      for (let i = 0; i < points.length; i++) {
        score += (alphas[i] || 0) * rbfKernel(x, y, points[i].x, points[i].y);
      }
      // Squish score from RFF system into 0 to 1 range
      return 0.5 + 0.5 * Math.tanh(score);
    }

    return 0.5;
  };

  // Compute Loss function
  const computeLoss = (currentPoints: Point[], params: typeof logRegParams, alphas: number[], alg: AlgorithmType): number => {
    if (currentPoints.length === 0) return 0;
    
    let total = 0;
    currentPoints.forEach(p => {
      const pred = predictPoint(p.x, p.y, params, alphas);
      const target = p.label === 'A' ? 1 : 0;
      
      if (alg === 'logistic') {
        // Binary cross entropy
        const eps = 1e-9;
        total -= target * Math.log(pred + eps) + (1 - target) * Math.log(1 - pred + eps);
      } else {
        // Mean Squared Error
        total += Math.pow(pred - target, 2);
      }
    });

    return total / currentPoints.length;
  };

  // Draw Heatmap to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);

    // If no points, render dark background grid
    if (points.length === 0) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    // Loop over pixels in canvas to assign color based on prediction
    for (let cy = 0; cy < height; cy++) {
      for (let cx = 0; cx < width; cx++) {
        // Convert canvas pixel position to relative [0, 100] coordinates
        const rx = (cx / width) * 100;
        const ry = (cy / height) * 100;

        const probA = predictPoint(rx, ry);

        const index = (cy * width + cx) * 4;

        // Class A: Blue (rgb: 59, 130, 246), Class B: Orange/Red (rgb: 249, 115, 22)
        if (probA > 0.5) {
          // Blue shaded region
          const confidence = (probA - 0.5) * 2; // 0 to 1
          imgData.data[index] = 34;                     // R
          imgData.data[index + 1] = 65;                 // G
          imgData.data[index + 2] = 120;                // B
          imgData.data[index + 3] = confidence * 70;    // A (max opacity 70/255)
        } else {
          // Orange shaded region
          const confidence = (0.5 - probA) * 2; // 0 to 1
          imgData.data[index] = 120;                    // R
          imgData.data[index + 1] = 55;                 // G
          imgData.data[index + 2] = 20;                 // B
          imgData.data[index + 3] = confidence * 70;    // A
        }

        // Draw boundary line (thin highlight at decision boundary probA ~ 0.5)
        if (Math.abs(probA - 0.5) < 0.015) {
          imgData.data[index] = 165;     // R
          imgData.data[index + 1] = 243; // G
          imgData.data[index + 2] = 252; // B
          imgData.data[index + 3] = 220; // A
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [points, logRegParams, rbfAlphas, algorithm, gridResolution]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTraining) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPoint: Point = {
      x,
      y,
      label: currentClass,
      id: Math.random().toString(36).substr(2, 9)
    };

    setPoints([...points, newPoint]);
  };

  const handleClear = () => {
    stopTraining();
    setPoints([]);
    setLossHistory([]);
    setEpoch(0);
  };

  // Presets Datasets Loader
  const loadPreset = (presetName: 'separable' | 'concentric' | 'moons') => {
    stopTraining();
    const newPoints: Point[] = [];

    if (presetName === 'separable') {
      // Linear Separable clusters
      for (let i = 0; i < 10; i++) {
        // Group A (top-left)
        newPoints.push({
          x: 20 + Math.random() * 20,
          y: 20 + Math.random() * 20,
          label: 'A',
          id: `A-sep-${i}`
        });
        // Group B (bottom-right)
        newPoints.push({
          x: 60 + Math.random() * 20,
          y: 60 + Math.random() * 20,
          label: 'B',
          id: `B-sep-${i}`
        });
      }
    } else if (presetName === 'concentric') {
      // Concentric circles
      // Inner circle of A
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 12 + Math.random() * 6;
        newPoints.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle),
          label: 'A',
          id: `A-ring-${i}`
        });
      }
      // Outer ring of B
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const radius = 30 + Math.random() * 8;
        newPoints.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle),
          label: 'B',
          id: `B-ring-${i}`
        });
      }
    } else if (presetName === 'moons') {
      // Interleaving moons
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI;
        newPoints.push({
          x: 35 + 20 * Math.cos(angle) + Math.random() * 5,
          y: 40 + 20 * Math.sin(angle) + Math.random() * 5,
          label: 'A',
          id: `A-moon-${i}`
        });
      }
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI;
        newPoints.push({
          x: 55 - 20 * Math.cos(angle) + Math.random() * 5,
          y: 55 - 20 * Math.sin(angle) + Math.random() * 5,
          label: 'B',
          id: `B-moon-${i}`
        });
      }
    }

    setPoints(newPoints);
  };

  // Metric: Accuracy (ratio of points correctly classified)
  const accuracy = useMemo(() => {
    if (points.length === 0) return 0;
    let correct = 0;
    points.forEach(p => {
      const pred = predictPoint(p.x, p.y);
      const predictedClass = pred > 0.5 ? 'A' : 'B';
      if (predictedClass === p.label) correct++;
    });
    return Math.round((correct / points.length) * 100);
  }, [points, logRegParams, rbfAlphas, algorithm]);

  // Metric: Loss value
  const activeLoss = useMemo(() => {
    return computeLoss(points, logRegParams, rbfAlphas, algorithm).toFixed(3);
  }, [points, logRegParams, rbfAlphas, algorithm]);

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden font-sans text-slate-100 select-none">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-900/15 via-slate-950 to-black pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[160px] pointer-events-none"></div>
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-85 h-auto md:h-full bg-slate-900/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-5 md:p-6 flex flex-col z-10 shrink-0 overflow-y-auto custom-scrollbar">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors mb-6 w-fit group"
        >
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-cyan-500/20 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm">Quay lại</span>
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400 shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Machine Learning</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">
          Phân Loại (Classification)
        </h1>
        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
          Huấn luyện máy tính phân loại dữ liệu giữa hai nhóm. Thêm điểm dữ liệu, chọn thuật toán và xem ranh giới phân lớp (Decision Boundary) hình thành trong thời gian thực!
        </p>

        {/* Action Mode Toggle */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-2.5 mb-5 flex flex-col gap-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1">Chế độ vẽ điểm</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCurrentClass('A')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentClass === 'A'
                  ? 'bg-blue-500/15 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                  : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              Nhóm A (Xanh)
            </button>
            <button
              onClick={() => setCurrentClass('B')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentClass === 'B'
                  ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                  : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-orange-500 filter drop-shadow-[0_0_3px_rgba(249,115,22,0.8)]" />
              Nhóm B (Cam)
            </button>
          </div>
        </div>

        {/* Algorithm Selector */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 mb-5 flex flex-col gap-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mô hình phân loại</p>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'logistic', name: 'Logistic Regression', desc: 'Ranh giới phân chia thẳng (Tuyến tính).' },
              { id: 'knn', name: 'K-Nearest Neighbors (KNN)', desc: 'Lân cận bỏ phiếu, ranh giới góc cạnh.' },
              { id: 'rbf', name: 'RBF Kernel (Non-linear)', desc: 'Thuật toán nâng cao, ranh giới cong mềm mại.' }
            ].map(alg => (
              <button
                key={alg.id}
                onClick={() => setAlgorithm(alg.id as AlgorithmType)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  algorithm === alg.id
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                    : 'bg-transparent border-transparent text-slate-450 hover:bg-white/5'
                }`}
              >
                <p className="font-bold text-xs">{alg.name}</p>
                <p className="text-[9.5px] text-slate-500 mt-0.5">{alg.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Presets */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 mb-5 flex flex-col gap-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mẫu dữ liệu thử nghiệm</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'separable', name: 'Tách biệt' },
              { id: 'concentric', name: 'Vòng tròn' },
              { id: 'moons', name: 'Hai trăng' }
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.id as any)}
                className="py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10.5px] font-black text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Training Mode / Configuration */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 mb-6 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Huấn luyện tự động</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAutoTrain}
                onChange={e => {
                  setIsAutoTrain(e.target.checked);
                  stopTraining();
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:border-slate-350 after:border after:rounded-full after:height-4 after:width-4 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {!isAutoTrain && (
            <div className="flex gap-2 border-t border-white/5 pt-3 animate-in fade-in duration-200">
              {isTraining ? (
                <button
                  onClick={stopTraining}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" /> Tạm dừng
                </button>
              ) : (
                <button
                  onClick={startManualTraining}
                  disabled={points.length === 0}
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" /> Huấn luyện
                </button>
              )}
            </div>
          )}

          {epoch > 0 && (
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>Đang huấn luyện...</span>
              <span>Epoch {epoch}</span>
            </div>
          )}
        </div>

        {/* Clear Data Button */}
        <button
          onClick={handleClear}
          className="mt-auto w-full py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Xóa toàn bộ dữ liệu
        </button>
      </div>

      {/* Main Simulation Panel */}
      <div className="flex-1 flex flex-col p-4 md:p-6 relative z-10 justify-between">
        
        {/* TOP STATUS HUD */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 border border-white/10 rounded-2xl p-4 backdrop-blur-md justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-sm font-black text-slate-200">Bảng đo lường huấn luyện</span>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng số điểm</p>
              <p className="text-xl font-black text-white font-mono">{points.length}</p>
            </div>
            
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Độ chính xác (Accuracy)</p>
              <p className={`text-xl font-black font-mono transition-colors ${points.length > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                {points.length > 0 ? `${accuracy}%` : '--'}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hàm mất mát (Loss)</p>
              <p className={`text-xl font-black font-mono transition-colors ${points.length > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                {points.length > 0 ? activeLoss : '--'}
              </p>
            </div>
          </div>
        </div>

        {/* WORKSPACE & CANVAS */}
        <div className="flex-1 my-4 flex flex-col md:flex-row gap-4 min-h-[450px]">
          
          {/* Main Heatmap Coordinate Area */}
          <div className="flex-1 bg-slate-900/40 backdrop-blur-xs border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl flex items-center justify-center">
            
            {/* Axis labels */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-widest z-10 pointer-events-none">
              Trục X
            </div>
            <div className="absolute top-1/2 left-3 -translate-y-1/2 -rotate-90 origin-center text-[10px] text-slate-500 font-bold uppercase tracking-widest z-10 pointer-events-none">
              Trục Y
            </div>

            {/* Hint message */}
            {points.length === 0 && (
              <div className="absolute flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md pointer-events-none shadow-2xl z-20">
                <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 animate-bounce">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
                <span className="text-slate-200 font-bold text-sm">Nhấp vào đây để vẽ các điểm dữ liệu</span>
              </div>
            )}

            {/* Heatmap canvas container */}
            <div
              ref={containerRef}
              onClick={handleCanvasClick}
              className="absolute inset-8 cursor-crosshair overflow-hidden rounded-2xl border border-white/5 shadow-inner"
            >
              {/* Background Decision Boundary Canvas */}
              <canvas
                ref={canvasRef}
                width={gridResolution}
                height={gridResolution}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />

              {/* Grid lines overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-15">
                <defs>
                  <pattern id="heatmap-grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.75" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#heatmap-grid)" />
              </svg>

              {/* Interactive Points Layer */}
              <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none">
                <AnimatePresence>
                  {points.map(point => {
                    const isClassA = point.label === 'A';
                    return (
                      <g key={point.id} className="pointer-events-auto cursor-pointer">
                        {isClassA ? (
                          // Class A: Blue glowing circle
                          <motion.circle
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            cx={`${point.x}%`}
                            cy={`${point.y}%`}
                            r="8"
                            fill="#3b82f6"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.7)] hover:stroke-cyan-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isTraining) setPoints(points.filter(p => p.id !== point.id));
                            }}
                          />
                        ) : (
                          // Class B: Orange glowing triangle
                          <motion.path
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            d={`M ${point.x} ${point.y - 1} L ${point.x - 0.9} ${point.y + 0.9} L ${point.x + 0.9} ${point.y + 0.9} Z`}
                            transform={`scale(${window.innerWidth < 768 ? 8 : 10})`}
                            transform-origin={`${point.x}% ${point.y}%`}
                            fill="#f97316"
                            stroke="#ffffff"
                            strokeWidth="0.25"
                            className="drop-shadow-[0_0_8px_rgba(249,115,22,0.7)] hover:stroke-yellow-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isTraining) setPoints(points.filter(p => p.id !== point.id));
                            }}
                          />
                        )}
                      </g>
                    );
                  })}
                </AnimatePresence>
              </svg>
            </div>
          </div>

          {/* Loss graph / training analytics panel (only visible in manual mode or if history exists) */}
          {!isAutoTrain && lossHistory.length > 0 && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: window.innerWidth < 768 ? '100%' : '260px', opacity: 1 }}
              className="bg-slate-900/60 border border-white/10 rounded-3xl p-4 flex flex-col gap-4 shrink-0 overflow-hidden"
            >
              <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider">Đường cong tối ưu (Loss)</span>
              </div>

              <div className="flex-1 flex items-center justify-center bg-black/40 rounded-2xl border border-white/5 relative p-4 h-40 md:h-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid lines in Loss curve */}
                  <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                  {/* Draw the curve path */}
                  {(() => {
                    if (lossHistory.length < 2) return null;
                    const maxLoss = Math.max(...lossHistory);
                    const minLoss = Math.min(...lossHistory);
                    const range = maxLoss - minLoss || 1;

                    const pointsPath = lossHistory.map((loss, idx) => {
                      const px = (idx / (lossHistory.length - 1)) * 100;
                      // In SVG, y=0 is top, y=100 is bottom. Scale so lower loss is near the bottom
                      const py = 90 - ((loss - minLoss) / range) * 80;
                      return `${px},${py}`;
                    }).join(' L ');

                    return (
                      <path
                        d={`M ${pointsPath}`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })()}
                </svg>
                
                <span className="absolute bottom-2 right-2 text-[9px] text-slate-500 font-bold uppercase">Lượt/Epoch</span>
                <span className="absolute top-2 left-2 text-[9px] text-slate-500 font-bold uppercase">Hàm Loss</span>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Loss hiện tại</p>
                <p className="text-xl font-black text-cyan-400 font-mono mt-0.5">
                  {lossHistory[lossHistory.length - 1]?.toFixed(4)}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* BOTTOM HELPER FOOTER */}
        <div className="flex items-center gap-2 text-slate-500 text-[10.5px] font-medium justify-center bg-slate-900/30 border border-white/5 rounded-xl p-2.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Mẹo: Nhấp vào một điểm dữ liệu để xóa nó. Nhấp vào các vùng trống để vẽ thêm điểm thuộc Nhóm màu đã chọn.</span>
        </div>

      </div>
    </div>
  );
}
