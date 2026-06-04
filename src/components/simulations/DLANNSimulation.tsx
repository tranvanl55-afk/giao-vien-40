import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Play, Pause, RefreshCw, Plus, Minus, Activity, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types & math helpers
// ─────────────────────────────────────────────────────────────────────────────

type Activation = 'relu' | 'sigmoid' | 'tanh';
type Dataset = 'xor' | 'circle' | 'spiral' | 'linear';

interface NNConfig {
  hiddenLayers: number[];   // e.g. [4, 4] = two hidden layers of 4 neurons each
  activation: Activation;
  learningRate: number;
}

// Simple fully-connected Neural Network (classification, 2 inputs → 1 output)
class SimpleNN {
  layers: number[][];  // layer → neuron → weight (flat by fan-in)
  biases: number[][];
  weights: number[][][]; // weights[l][j][i] = weight from neuron i (layer l-1) to neuron j (layer l)

  constructor(sizes: number[]) {
    this.layers = [];
    this.biases = [];
    this.weights = [];
    for (let l = 1; l < sizes.length; l++) {
      const fanIn = sizes[l - 1];
      const fanOut = sizes[l];
      const std = Math.sqrt(2 / fanIn);
      const W: number[][] = Array.from({ length: fanOut }, () =>
        Array.from({ length: fanIn }, () => (Math.random() - 0.5) * 2 * std)
      );
      const B: number[] = new Array(fanOut).fill(0);
      this.weights.push(W);
      this.biases.push(B);
    }
  }

  activate(x: number, fn: Activation): number {
    if (fn === 'relu') return Math.max(0, x);
    if (fn === 'sigmoid') return 1 / (1 + Math.exp(-x));
    if (fn === 'tanh') return Math.tanh(x);
    return x;
  }

  activateDerivative(x: number, fn: Activation): number {
    if (fn === 'relu') return x > 0 ? 1 : 0;
    if (fn === 'sigmoid') { const s = 1 / (1 + Math.exp(-x)); return s * (1 - s); }
    if (fn === 'tanh') { const t = Math.tanh(x); return 1 - t * t; }
    return 1;
  }

  forward(input: number[], activation: Activation): { activations: number[][], zs: number[][] } {
    const activations: number[][] = [input];
    const zs: number[][] = [];
    let a = input;
    for (let l = 0; l < this.weights.length; l++) {
      const W = this.weights[l];
      const B = this.biases[l];
      const isLast = l === this.weights.length - 1;
      const z = W.map((row, j) => row.reduce((sum, w, i) => sum + w * a[i], 0) + B[j]);
      zs.push(z);
      a = z.map(val => isLast ? 1 / (1 + Math.exp(-val)) : this.activate(val, activation)); // sigmoid output
      activations.push(a);
    }
    return { activations, zs };
  }

  // Binary cross-entropy backward pass + SGD update
  trainStep(inputs: number[][], targets: number[], activation: Activation, lr: number): number {
    let totalLoss = 0;

    // Accumulate gradients
    const dWeights = this.weights.map(W => W.map(row => new Array(row.length).fill(0)));
    const dBiases = this.biases.map(B => new Array(B.length).fill(0));

    for (let n = 0; n < inputs.length; n++) {
      const { activations, zs } = this.forward(inputs[n], activation);
      const pred = activations[activations.length - 1][0];
      const eps = 1e-7;
      totalLoss += -(targets[n] * Math.log(pred + eps) + (1 - targets[n]) * Math.log(1 - pred + eps));

      // Backprop
      let delta = [pred - targets[n]]; // dL/dz for output layer (sigmoid + BCE simplifies)
      for (let l = this.weights.length - 1; l >= 0; l--) {
        const aIn = activations[l];
        for (let j = 0; j < this.weights[l].length; j++) {
          dBiases[l][j] += delta[j];
          for (let i = 0; i < aIn.length; i++) {
            dWeights[l][j][i] += delta[j] * aIn[i];
          }
        }
        if (l > 0) {
          const W = this.weights[l];
          const prevDelta = this.weights[l][0].map((_, i) =>
            W.reduce((sum, row, j) => sum + row[i] * delta[j], 0) * this.activateDerivative(zs[l - 1][i], activation)
          );
          delta = prevDelta;
        }
      }
    }

    // SGD update
    const N = inputs.length;
    for (let l = 0; l < this.weights.length; l++) {
      for (let j = 0; j < this.weights[l].length; j++) {
        this.biases[l][j] -= lr * dBiases[l][j] / N;
        for (let i = 0; i < this.weights[l][j].length; i++) {
          this.weights[l][j][i] -= lr * dWeights[l][j][i] / N;
        }
      }
    }

    return totalLoss / inputs.length;
  }

  predict(input: number[], activation: Activation): number {
    const { activations } = this.forward(input, activation);
    return activations[activations.length - 1][0];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dataset generators
// ─────────────────────────────────────────────────────────────────────────────

function generateDataset(type: Dataset, n = 80): { inputs: number[][]; targets: number[] } {
  const inputs: number[][] = [];
  const targets: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 2;
    let label = 0;
    if (type === 'xor') label = ((x > 0) !== (y > 0)) ? 1 : 0;
    else if (type === 'circle') label = (x * x + y * y) < 0.5 ? 1 : 0;
    else if (type === 'spiral') {
      const r = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x) + Math.PI;
      label = (angle + r * 3) % (2 * Math.PI) < Math.PI ? 1 : 0;
    }
    else label = (x + y > 0) ? 1 : 0;
    inputs.push([x, y]);
    targets.push(label);
  }
  return { inputs, targets };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const DATASET_META: Record<Dataset, { name: string; icon: string }> = {
  xor: { name: 'XOR', icon: '⊕' },
  circle: { name: 'Vòng tròn', icon: '◎' },
  spiral: { name: 'Xoắn ốc', icon: '🌀' },
  linear: { name: 'Tuyến tính', icon: '╲' },
};

const ACTIVATION_META: Record<Activation, { name: string; color: string }> = {
  relu: { name: 'ReLU', color: 'text-orange-400' },
  sigmoid: { name: 'Sigmoid', color: 'text-blue-400' },
  tanh: { name: 'Tanh', color: 'text-purple-400' },
};

export function DLANNSimulation({ onBack }: { onBack: () => void }) {
  const [config, setConfig] = useState<NNConfig>({ hiddenLayers: [4, 4], activation: 'relu', learningRate: 0.05 });
  const [dataset, setDataset] = useState<Dataset>('xor');
  const [data, setData] = useState(() => generateDataset('xor'));
  const [nn, setNN] = useState<SimpleNN | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [accuracy, setAccuracy] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nnRef = useRef<SimpleNN | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizes = useMemo(() => [2, ...config.hiddenLayers, 1], [config.hiddenLayers]);

  const buildNN = useCallback(() => {
    const newNN = new SimpleNN(sizes);
    nnRef.current = newNN;
    setNN(newNN);
    setEpoch(0);
    setLossHistory([]);
    setAccuracy(0);
  }, [sizes]);

  const handleDatasetChange = (d: Dataset) => {
    setDataset(d);
    const newData = generateDataset(d);
    setData(newData);
    buildNN();
  };

  useEffect(() => { buildNN(); }, []); // eslint-disable-line

  // Draw decision boundary
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nn) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const imgData = ctx.createImageData(W, H);

    for (let cy = 0; cy < H; cy++) {
      for (let cx = 0; cx < W; cx++) {
        const nx = (cx / W - 0.5) * 4;
        const ny = (cy / H - 0.5) * 4;
        const p = nn.predict([nx, ny], config.activation);
        const idx = (cy * W + cx) * 4;
        if (p > 0.5) {
          const conf = (p - 0.5) * 2;
          imgData.data[idx] = 59; imgData.data[idx + 1] = 130; imgData.data[idx + 2] = 246;
          imgData.data[idx + 3] = conf * 80;
        } else {
          const conf = (0.5 - p) * 2;
          imgData.data[idx] = 249; imgData.data[idx + 1] = 115; imgData.data[idx + 2] = 22;
          imgData.data[idx + 3] = conf * 80;
        }
        if (Math.abs(p - 0.5) < 0.02) {
          imgData.data[idx] = 165; imgData.data[idx + 1] = 243; imgData.data[idx + 2] = 252;
          imgData.data[idx + 3] = 200;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [nn, epoch, config.activation]);

  const stopTraining = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTraining(false);
  }, []);

  const handleToggle = () => {
    if (isTraining) { stopTraining(); return; }
    if (!nnRef.current) return;
    setIsTraining(true);
    let currentEpoch = epoch;
    const history = [...lossHistory];

    intervalRef.current = setInterval(() => {
      const currentNN = nnRef.current;
      if (!currentNN) return;
      // Mini-batch training (5 steps per tick)
      let lastLoss = 0;
      for (let i = 0; i < 5; i++) {
        lastLoss = currentNN.trainStep(data.inputs, data.targets, config.activation, config.learningRate);
      }
      currentEpoch += 5;
      history.push(lastLoss);

      // Compute accuracy
      let correct = 0;
      data.inputs.forEach((inp, idx) => {
        const pred = currentNN.predict(inp, config.activation);
        if ((pred > 0.5 ? 1 : 0) === data.targets[idx]) correct++;
      });
      const acc = Math.round((correct / data.inputs.length) * 100);

      setEpoch(currentEpoch);
      setLossHistory([...history.slice(-100)]);
      setAccuracy(acc);
      setNN({ ...currentNN } as any); // trigger re-render for canvas
    }, 80);
  };

  const handleReset = () => {
    stopTraining();
    buildNN();
  };

  const addHiddenLayer = () => {
    if (config.hiddenLayers.length >= 4) return;
    setConfig(c => ({ ...c, hiddenLayers: [...c.hiddenLayers, 4] }));
  };

  const removeHiddenLayer = () => {
    if (config.hiddenLayers.length <= 1) return;
    setConfig(c => ({ ...c, hiddenLayers: c.hiddenLayers.slice(0, -1) }));
  };

  const changeNeurons = (delta: number) => {
    setConfig(c => ({
      ...c,
      hiddenLayers: c.hiddenLayers.map(n => Math.max(1, Math.min(8, n + delta)))
    }));
  };

  useEffect(() => { handleReset(); }, [config, dataset]); // eslint-disable-line

  // Network graph visualization
  const networkLayers = useMemo(() => sizes, [sizes]);
  const maxNeurons = Math.max(...networkLayers);
  const layerSpacing = 100 / (networkLayers.length + 1);
  const neuronRadius = 10;

  const getNeuronPos = (layerIdx: number, neuronIdx: number, totalNeurons: number) => ({
    x: layerSpacing * (layerIdx + 1),
    y: 50 - ((totalNeurons - 1) / 2) * (100 / maxNeurons) + neuronIdx * (100 / maxNeurons),
  });

  const LAYER_COLORS = ['#06b6d4', '#a855f7', '#f97316', '#10b981', '#f43f5e', '#facc15'];

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden font-sans text-slate-100 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Sidebar */}
      <div className="w-full md:w-80 h-auto md:h-full bg-slate-900/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col z-10 shrink-0 overflow-y-auto">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-purple-400 transition-colors mb-6 w-fit group">
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-purple-500/20 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
          <span className="font-bold text-sm">Quay lại</span>
        </button>

        <div className="flex items-center space-x-2.5 mb-1">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400"><Brain className="w-5 h-5" /></div>
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Deep Learning</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">Mạng Nơ-ron Nhân Tạo</h1>
        <p className="text-slate-400 text-xs leading-relaxed mb-5">
          Xây dựng và huấn luyện mạng nơ-ron nhiều lớp trong thời gian thực. Quan sát ranh giới quyết định hình thành theo mỗi epoch.
        </p>

        {/* Dataset */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Bộ dữ liệu</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(DATASET_META) as Dataset[]).map(d => (
              <button key={d} onClick={() => handleDatasetChange(d)}
                className={`py-2 px-2 rounded-xl text-[10.5px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${dataset === d ? 'bg-purple-500/15 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}>
                <span className="text-sm">{DATASET_META[d].icon}</span>
                <span>{DATASET_META[d].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Kiến trúc mạng</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400">Lớp ẩn: <strong className="text-white">{config.hiddenLayers.length}</strong></span>
            <div className="flex gap-1">
              <button onClick={removeHiddenLayer} disabled={config.hiddenLayers.length <= 1}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button onClick={addHiddenLayer} disabled={config.hiddenLayers.length >= 4}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Nơ-ron/lớp: <strong className="text-white">{config.hiddenLayers[0]}</strong></span>
            <div className="flex gap-1">
              {[2, 4, 6, 8].map(n => (
                <button key={n} onClick={() => setConfig(c => ({ ...c, hiddenLayers: c.hiddenLayers.map(() => n) }))}
                  className={`w-7 h-7 rounded-lg text-xs font-black border transition-all cursor-pointer ${config.hiddenLayers[0] === n ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activation */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Hàm kích hoạt</p>
          <div className="flex gap-2">
            {(Object.keys(ACTIVATION_META) as Activation[]).map(act => (
              <button key={act} onClick={() => setConfig(c => ({ ...c, activation: act }))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${config.activation === act ? 'bg-slate-700 border-slate-500 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}>
                <span className={ACTIVATION_META[act].color}>{ACTIVATION_META[act].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Rate */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tốc độ học (η)</p>
            <span className="text-xs text-cyan-400 font-bold">{config.learningRate}</span>
          </div>
          <input type="range" min="0.001" max="0.5" step="0.001" value={config.learningRate}
            onChange={e => setConfig(c => ({ ...c, learningRate: parseFloat(e.target.value) }))}
            className="w-full accent-purple-500 cursor-pointer" />
          <div className="flex justify-between text-[9px] text-slate-600 mt-1">
            <span>0.001</span><span>0.5</span>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-purple-400 animate-pulse" style={{ animationPlayState: isTraining ? 'running' : 'paused' }} />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số liệu huấn luyện</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-black/30 rounded-xl p-2">
              <p className="text-[9px] text-slate-500 font-bold">EPOCH</p>
              <p className="text-base font-black text-white">{epoch}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-2">
              <p className="text-[9px] text-slate-500 font-bold">LOSS</p>
              <p className="text-base font-black text-cyan-400">{lossHistory.length ? lossHistory[lossHistory.length - 1].toFixed(3) : '--'}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-2">
              <p className="text-[9px] text-slate-500 font-bold">ACC</p>
              <p className={`text-base font-black ${accuracy >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{epoch > 0 ? `${accuracy}%` : '--'}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-auto flex gap-2">
          <button onClick={handleToggle}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${isTraining ? 'bg-amber-600/80 border-amber-500/40 text-white' : 'bg-purple-600 border-purple-500/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'}`}>
            {isTraining ? <><Pause className="w-4 h-4" /> Dừng</> : <><Play className="w-4 h-4 fill-white" /> Huấn luyện</>}
          </button>
          <button onClick={handleReset} className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 font-bold transition-all cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col p-4 md:p-6 relative z-10 gap-4">
        {/* Network Diagram */}
        <div className="bg-slate-900/40 backdrop-blur-xs border border-white/10 rounded-3xl p-4 h-52 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Kiến trúc mạng nơ-ron</span>
            <span className="ml-auto text-[10px] text-slate-500">{sizes.join(' → ')}</span>
          </div>
          <svg className="w-full" style={{ height: 'calc(100% - 28px)' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Connections */}
            {networkLayers.map((_, li) => {
              if (li >= networkLayers.length - 1) return null;
              return Array.from({ length: networkLayers[li] }, (_, ni) => {
                const from = getNeuronPos(li, ni, networkLayers[li]);
                return Array.from({ length: networkLayers[li + 1] }, (_, nj) => {
                  const to = getNeuronPos(li + 1, nj, networkLayers[li + 1]);
                  return (
                    <line key={`${li}-${ni}-${nj}`}
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
                  );
                });
              });
            })}
            {/* Neurons */}
            {networkLayers.map((count, li) =>
              Array.from({ length: count }, (_, ni) => {
                const pos = getNeuronPos(li, ni, count);
                const col = LAYER_COLORS[li % LAYER_COLORS.length];
                const label = li === 0 ? (ni === 0 ? 'x₁' : 'x₂') : li === networkLayers.length - 1 ? 'ŷ' : '';
                return (
                  <g key={`${li}-${ni}`}>
                    <circle cx={pos.x} cy={pos.y} r={neuronRadius * 0.6}
                      fill={col + '22'} stroke={col} strokeWidth="1.5"
                      style={{ filter: `drop-shadow(0 0 4px ${col}88)` }} />
                    {label && <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize="4" fontWeight="bold">{label}</text>}
                  </g>
                );
              })
            )}
          </svg>
          {/* Layer labels */}
          <div className="absolute bottom-3 left-0 right-0 flex pointer-events-none" style={{ paddingLeft: `${layerSpacing - 3}%`, paddingRight: '2%' }}>
            {networkLayers.map((_, li) => (
              <div key={li} className="text-center text-[8px] font-bold text-slate-600 uppercase" style={{ width: `${layerSpacing}%` }}>
                {li === 0 ? 'Input' : li === networkLayers.length - 1 ? 'Output' : `Hidden ${li}`}
              </div>
            ))}
          </div>
        </div>

        {/* Decision boundary + data points */}
        <div className="flex-1 flex gap-4">
          <div className="flex-1 bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="absolute top-3 left-4 z-10 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ranh giới quyết định (Decision Boundary)</div>
            <div className="absolute inset-8 overflow-hidden rounded-xl border border-white/5">
              <canvas ref={canvasRef} width={60} height={60} className="absolute inset-0 w-full h-full" style={{ imageRendering: 'pixelated' }} />
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {data.inputs.map((inp, idx) => {
                  const x = (inp[0] / 4 + 0.5) * 100;
                  const y = (inp[1] / 4 + 0.5) * 100;
                  return data.targets[idx] === 1 ? (
                    <circle key={idx} cx={`${x}%`} cy={`${y}%`} r="4.5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.7))' }} />
                  ) : (
                    <rect key={idx} x={`${x - 1.8}%`} y={`${y - 1.8}%`} width="3.6%" height="3.6%"
                      fill="#f97316" stroke="#fdba74" strokeWidth="1.2"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(249,115,22,0.7))' }} />
                  );
                })}
              </svg>
            </div>
            {/* Legend */}
            <div className="absolute bottom-3 right-4 flex gap-2">
              <div className="flex items-center gap-1 bg-slate-900/70 border border-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[9px] text-slate-400">Lớp 1</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900/70 border border-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                <div className="w-2.5 h-2.5 bg-orange-500" />
                <span className="text-[9px] text-slate-400">Lớp 0</span>
              </div>
            </div>
          </div>

          {/* Loss curve */}
          {lossHistory.length > 1 && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '220px', opacity: 1 }}
              className="bg-slate-900/40 border border-white/10 rounded-3xl p-4 flex flex-col shrink-0 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Loss Curve</span>
              </div>
              <div className="flex-1 bg-black/30 rounded-2xl border border-white/5 p-3 relative">
                <svg className="w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  {(() => {
                    const max = Math.max(...lossHistory);
                    const min = Math.min(...lossHistory);
                    const range = max - min || 1;
                    const pts = lossHistory.map((l, i) => {
                      const px = (i / (lossHistory.length - 1)) * 100;
                      const py = 70 - ((l - min) / range) * 60;
                      return `${px},${py}`;
                    }).join(' L ');
                    return <path d={`M ${pts}`} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
                  })()}
                </svg>
                <span className="absolute top-1 left-2 text-[8px] text-slate-600 font-bold">LOSS</span>
                <span className="absolute bottom-1 right-2 text-[8px] text-slate-600 font-bold">EPOCH</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
