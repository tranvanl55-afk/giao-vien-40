import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, RefreshCw, Trash2, HelpCircle, 
  Sparkles, CheckCircle, AlertTriangle, Lightbulb, 
  Sliders, Plus, Play, RotateCcw, Award, Info,
  Eye, Zap, EyeOff, Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Component Types Definition
interface PaletteComponent {
  type: string;
  name: string;
  vietnameseName: string;
  icon: string;
  defaultR: number; // default resistance in Ohms
  defaultV?: number; // default voltage in Volts (for battery)
  description: string;
}

const PALETTE: PaletteComponent[] = [
  {
    type: 'battery',
    name: 'Nguồn điện (Pin)',
    vietnameseName: 'Nguồn Điện (Pin)',
    icon: '🔋',
    defaultR: 0.1, // Internal resistance
    defaultV: 9, // Volts
    description: 'Cung cấp hiệu điện thế để tạo ra dòng điện trong mạch kín.'
  },
  {
    type: 'bulb',
    name: 'Bóng đèn',
    vietnameseName: 'Bóng Đèn',
    icon: '💡',
    defaultR: 10,
    description: 'Thiết bị tiêu thụ điện năng và biến đổi thành quang năng khi có dòng điện chạy qua.'
  },
  {
    type: 'switch',
    name: 'Công tắc',
    vietnameseName: 'Công Tắc',
    icon: '🔌',
    defaultR: 0.01, // 0.01 when closed, 1e8 when open
    description: 'Thiết bị dùng để đóng/ngắt dòng điện chạy trong mạch.'
  },
  {
    type: 'wire',
    name: 'Dây dẫn',
    vietnameseName: 'Dây Dẫn (Nối Cực)',
    icon: '🔗',
    defaultR: 0,
    description: 'Dây dẫn truyền dòng điện. Click vào để xem hướng dẫn cách nối dây dẫn giữa các cực thiết bị.'
  },
  {
    type: 'resistor',
    name: 'Điện trở',
    vietnameseName: 'Điện Trở',
    icon: '⚡',
    defaultR: 20,
    description: 'Linh kiện cản trở dòng điện, dùng để điều chỉnh cường độ dòng điện trong mạch.'
  },
  {
    type: 'bell',
    name: 'Chuông điện',
    vietnameseName: 'Chuông Điện',
    icon: '🔔',
    defaultR: 15,
    description: 'Phát ra âm thanh báo hiệu khi có dòng điện chạy qua.'
  },
  {
    type: 'diode',
    name: 'Điốt',
    vietnameseName: 'Điốt (Diode)',
    icon: '◀',
    defaultR: 1, // Forward resistance
    description: 'Linh kiện chỉ cho phép dòng điện chạy qua theo một chiều xác định.'
  },
  {
    type: 'led',
    name: 'Điốt phát quang (LED)',
    vietnameseName: 'Điốt Phát Quang (LED)',
    icon: '🚨',
    defaultR: 2, // Forward resistance
    description: 'Điốt đặc biệt có khả năng phát sáng khi có dòng điện chạy qua theo chiều thuận.'
  },
  {
    type: 'potentiometer',
    name: 'Biến trở',
    vietnameseName: 'Biến Trở',
    icon: '🎚️',
    defaultR: 10, // Adjustable resistance
    description: 'Điện trở có thể thay đổi trị số để điều chỉnh cường độ dòng điện trong mạch.'
  },
  {
    type: 'ammeter',
    name: 'Ampe kế',
    vietnameseName: 'Ampe Kế',
    icon: '🅰️',
    defaultR: 0.01, // Extremely low resistance
    description: 'Dụng cụ dùng để đo cường độ dòng điện (mắc nối tiếp với thiết bị cần đo).'
  },
  {
    type: 'voltmeter',
    name: 'Vôn kế',
    vietnameseName: 'Vôn Kế',
    icon: '🆅',
    defaultR: 1000000, // Extremely high resistance
    description: 'Dụng cụ dùng để đo hiệu điện thế (mắc song song với thiết bị cần đo).'
  }
];

// Placed Component Instance on Canvas
interface PlacedComponent {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  r: number; // Active resistance
  v?: number; // Active voltage (if battery)
  isClosed?: boolean; // Active state (if switch)
  potValue?: number; // Active slider value (if potentiometer)
}

// Wire Connection between ports
interface Wire {
  id: string;
  fromId: string;
  fromTerm: 'p' | 'n'; // 'p' = Positive/Left terminal, 'n' = Negative/Right terminal
  toId: string;
  toTerm: 'p' | 'n';
  color: string;
}

// Task Interface
interface LabTask {
  id: string;
  title: string;
  description: string;
  check: (comps: PlacedComponent[], wires: Wire[], solvedResults: SolvedCircuit) => boolean;
  hint: string;
}

// Solved Circuit Results
interface SolvedCircuit {
  nodeVoltages: Record<string, number>; // Voltage at each node
  currents: Record<string, number>; // Current through each component (in Amperes)
  voltageDrops: Record<string, number>; // Voltage drop across each component
  isShortCircuit: boolean;
  isClosedCircuit: boolean;
}

const LAB_TASKS: LabTask[] = [
  {
    id: 'simple_glow',
    title: 'Nhiệm vụ 1: Thắp sáng bóng đèn',
    description: 'Lắp một mạch điện đơn giản gồm: 1 Nguồn điện (Pin), 1 Công tắc đóng, và 1 Bóng đèn. Kết nối chúng thành một vòng kín để bóng đèn phát sáng.',
    hint: 'Nhớ đóng công tắc (click vào công tắc trên bảng để đóng/mở) và nối dây từ cực dương nguồn điện qua công tắc, bóng đèn rồi trở về cực âm nguồn điện nhé!',
    check: (comps, wires, res) => {
      const hasBattery = comps.some(c => c.type === 'battery');
      const hasBulb = comps.some(c => c.type === 'bulb');
      const hasSwitchClosed = comps.some(c => c.type === 'switch' && c.isClosed);
      const isBulbGlowing = comps.some(c => c.type === 'bulb' && Math.abs(res.currents[c.id] || 0) > 0.05);
      return hasBattery && hasBulb && hasSwitchClosed && isBulbGlowing && !res.isShortCircuit;
    }
  },
  {
    id: 'measure_current',
    title: 'Nhiệm vụ 2: Đo cường độ dòng điện',
    description: 'Mắc thêm 1 Ampe kế nối tiếp vào mạch điện thắp sáng bóng đèn để đo cường độ dòng điện đi qua bóng đèn.',
    hint: 'Ampe kế phải được mắc nối tiếp với bóng đèn. Dòng điện đi vào cực dương của ampe kế và đi ra từ cực âm.',
    check: (comps, wires, res) => {
      const hasAmmeter = comps.some(c => c.type === 'ammeter');
      const isBulbGlowing = comps.some(c => c.type === 'bulb' && Math.abs(res.currents[c.id] || 0) > 0.05);
      const ammeterCurrent = comps.find(c => c.type === 'ammeter')?.id;
      const hasSignificantCurrent = ammeterCurrent ? Math.abs(res.currents[ammeterCurrent] || 0) > 0.05 : false;
      return hasAmmeter && isBulbGlowing && hasSignificantCurrent && !res.isShortCircuit;
    }
  },
  {
    id: 'variable_brightness',
    title: 'Nhiệm vụ 3: Thay đổi độ sáng với biến trở',
    description: 'Lắp mạch điện gồm 1 Pin, 1 bóng đèn, và 1 Biến trở mắc nối tiếp. Thử thay đổi thanh trượt của Biến trở để làm bóng đèn sáng mạnh hơn hoặc yếu đi.',
    hint: 'Mắc biến trở nối tiếp với bóng đèn, sau đó click vào biến trở trên bàn thực hành để kéo thanh trượt điều chỉnh điện trở của nó.',
    check: (comps, wires, res) => {
      const hasPot = comps.some(c => c.type === 'potentiometer');
      const hasBulb = comps.some(c => c.type === 'bulb');
      const isBulbGlowing = comps.some(c => c.type === 'bulb' && Math.abs(res.currents[c.id] || 0) > 0.02);
      return hasPot && hasBulb && isBulbGlowing && !res.isShortCircuit;
    }
  },
  {
    id: 'led_one_way',
    title: 'Nhiệm vụ 4: Tính dẫn điện một chiều của LED',
    description: 'Lắp mạch thắp sáng Điốt phát quang (LED). LED chỉ phát sáng khi được mắc đúng chiều thuận của dòng điện (cực dương nguồn điện nối với cực dương của LED).',
    hint: 'LED cực dương (Anôt - chân dài) nằm ở phía bên trái (chấm đỏ), cực âm (Catôt - chân ngắn) ở phía bên phải (chấm đen). Mắc ngược chiều LED sẽ không sáng!',
    check: (comps, wires, res) => {
      const hasLed = comps.some(c => c.type === 'led');
      const isLedGlowing = comps.some(c => c.type === 'led' && (res.currents[c.id] || 0) > 0.02);
      return hasLed && isLedGlowing && !res.isShortCircuit;
    }
  }
];

export function CircuitSimulation({ onBack }: { onBack: () => void }) {
  const [components, setComponents] = useState<PlacedComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [wiringGuideActive, setWiringGuideActive] = useState<boolean>(false);
  
  // Interactive UI States
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [wiringSource, setWiringSource] = useState<{ id: string; term: 'p' | 'n' } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'diagram' | 'realistic'>('diagram');
  const [activeTab, setActiveTab] = useState<'analysis' | 'tasks' | 'quiz'>('analysis');

  // Task index
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Quiz States
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  const canvasRef = useRef<SVGSVGElement>(null);
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Quiz questions
  const QUIZ_QUESTIONS = [
    {
      q: "Ký hiệu hình tròn có chữ X ở giữa ( -(X)- ) trong sơ đồ mạch điện đại diện cho linh kiện nào?",
      opts: ["Điện trở", "Bóng đèn", "Chuông điện", "Ampe kế"],
      ans: "Bóng đèn",
      fact: "Ký hiệu tròn có chữ X đại diện cho bóng đèn sợi đốt tiêu thụ điện phát sáng."
    },
    {
      q: "Để đo hiệu điện thế giữa hai đầu một bóng đèn, ta cần mắc Vôn kế thế nào với bóng đèn đó?",
      opts: ["Mắc nối tiếp", "Mắc song song", "Mắc kiểu nào cũng được", "Không mắc vào mạch"],
      ans: "Mắc song song",
      fact: "Vôn kế có điện trở cực kỳ lớn, đo sự chênh lệch thế năng nên phải mắc song song trực tiếp với thiết bị cần đo."
    },
    {
      q: "Điều gì sẽ xảy ra nếu ta nối trực tiếp hai cực của Pin bằng một sợi dây dẫn không qua điện trở/bóng đèn?",
      opts: ["Bóng đèn bên cạnh sáng hơn", "Dòng điện giảm về 0", "Hiện tượng đoản mạch gây cháy nổ pin", "Pin được nạp thêm điện"],
      ans: "Hiện tượng đoản mạch gây cháy nổ pin",
      fact: "Khi nối tắt hai cực nguồn điện, điện trở mạch ngoài gần như bằng 0 làm cường độ dòng điện tăng vọt cực lớn, tỏa nhiệt gây cháy hỏng nguồn."
    },
    {
      q: "Điốt phát quang (LED) có đặc tính quan trọng nào dưới đây?",
      opts: ["Chỉ cho dòng điện đi qua theo chiều thuận và phát sáng", "Cho dòng điện đi qua theo cả hai chiều", "Cản trở dòng điện tuyệt đối", "Tự tăng hiệu điện thế của mạch"],
      ans: "Chỉ cho dòng điện đi qua theo chiều thuận và phát sáng",
      fact: "LED là linh kiện bán dẫn chỉ cho dòng điện chạy một chiều từ Anot (cực dương) sang Katot (cực âm) và phát quang."
    }
  ];

  // Disjoint Set Union (DSU) to find connected nodes of terminals
  const solveCircuit = (): SolvedCircuit => {
    const defaultResults: SolvedCircuit = {
      nodeVoltages: {},
      currents: {},
      voltageDrops: {},
      isShortCircuit: false,
      isClosedCircuit: false
    };

    if (components.length === 0) return defaultResults;

    // Build the set of all terminals
    const terminals: string[] = [];
    components.forEach(c => {
      terminals.push(`${c.id}-p`);
      terminals.push(`${c.id}-n`);
    });

    // Parent map for Union-Find
    const parent: Record<string, string> = {};
    terminals.forEach(t => { parent[t] = t; });

    const find = (t: string): string => {
      if (parent[t] === t) return t;
      parent[t] = find(parent[t]);
      return parent[t];
    };

    const union = (t1: string, t2: string) => {
      const root1 = find(t1);
      const root2 = find(t2);
      if (root1 !== root2) {
        parent[root1] = root2;
      }
    };

    // Union terminals connected by wires
    wires.forEach(w => {
      union(`${w.fromId}-${w.fromTerm}`, `${w.toId}-${w.toTerm}`);
    });

    // Group terminals into electrical nodes
    const nodeGroups: Record<string, string[]> = {};
    terminals.forEach(t => {
      const root = find(t);
      if (!nodeGroups[root]) {
        nodeGroups[root] = [];
      }
      nodeGroups[root].push(t);
    });

    // Assign integer IDs to nodes: 0, 1, 2, ...
    const nodeRoots = Object.keys(nodeGroups);
    const nodeCount = nodeRoots.length;
    const termToNodeId: Record<string, number> = {};
    
    // Find battery negative terminal to set as Ground (Node 0)
    let groundRoot = nodeRoots[0];
    const battery = components.find(c => c.type === 'battery');
    if (battery) {
      groundRoot = find(`${battery.id}-n`);
    }

    let nodeIndex = 1;
    const rootToNodeIdMap: Record<string, number> = {};
    rootToNodeIdMap[groundRoot] = 0; // Ground is Node 0

    nodeRoots.forEach(r => {
      if (r !== groundRoot) {
        rootToNodeIdMap[r] = nodeIndex++;
      }
    });

    terminals.forEach(t => {
      termToNodeId[t] = rootToNodeIdMap[find(t)];
    });

    // Solve using MNA (Modified Nodal Analysis)
    // We iterate 2 times to settle Diode/LED state (diode resistance changes based on bias)
    let activeResistances: Record<string, number> = {};
    components.forEach(c => {
      if (c.type === 'switch') {
        activeResistances[c.id] = c.isClosed ? 0.01 : 1e8;
      } else if (c.type === 'potentiometer') {
        activeResistances[c.id] = c.potValue || 10;
      } else if (c.type === 'diode' || c.type === 'led') {
        activeResistances[c.id] = 1.0; // Assume forward bias initially
      } else {
        activeResistances[c.id] = c.r;
      }
    });

    // Batteries list
    const batteries = components.filter(c => c.type === 'battery');
    const M = batteries.length;
    const N = nodeCount; // number of nodes including Ground

    // If no nodes, return empty
    if (N <= 1) return defaultResults;

    let solvedX: number[] = [];
    let isShortCircuit = false;
    let iterations = 3;

    for (let iter = 0; iter < iterations; iter++) {
      // Size of MNA matrix: (N - 1) + M
      // Row/col index mappings:
      // node voltages: 0 to N-2 representing node 1 to N-1
      // battery currents: N-1 to N-1 + M-1 representing batteries 0 to M-1
      const S = (N - 1) + M;
      const A: number[][] = Array.from({ length: S }, () => new Array(S).fill(0));
      const B: number[] = new Array(S).fill(0);

      // Build conductance matrix and source vector
      components.forEach(c => {
        if (c.type === 'battery') return; // Handled separately as voltage source
        
        const r = activeResistances[c.id];
        const g = 1.0 / r;
        const u = termToNodeId[`${c.id}-p`]; // Left terminal node
        const v = termToNodeId[`${c.id}-n`]; // Right terminal node

        if (u === v) return; // Self loop, no effect

        if (u > 0) A[u - 1][u - 1] += g;
        if (v > 0) A[v - 1][v - 1] += g;
        if (u > 0 && v > 0) {
          A[u - 1][v - 1] -= g;
          A[v - 1][u - 1] -= g;
        }
      });

      // Add battery voltage constraints
      batteries.forEach((bat, j) => {
        const u = termToNodeId[`${bat.id}-p`]; // Positive node
        const v = termToNodeId[`${bat.id}-n`]; // Negative node
        const volts = bat.v || 9;

        // If battery terminals are shorted together!
        if (u === v) {
          isShortCircuit = true;
          return;
        }

        const batteryEquationRow = (N - 1) + j;
        B[batteryEquationRow] = volts;

        if (u > 0) A[batteryEquationRow][u - 1] = 1;
        if (v > 0) A[batteryEquationRow][v - 1] = -1;

        // Add battery current terms to nodal equations
        if (u > 0) A[u - 1][(N - 1) + j] += 1;
        if (v > 0) A[v - 1][(N - 1) + j] -= 1;
      });

      if (isShortCircuit) {
        break;
      }

      // Solve Ax = B
      solvedX = solveLinearSystem(A, B);

      // Map solved values back to check diode states
      components.forEach(c => {
        if (c.type === 'diode' || c.type === 'led') {
          const u = termToNodeId[`${c.id}-p`];
          const v = termToNodeId[`${c.id}-n`];
          const v_u = u === 0 ? 0 : solvedX[u - 1] || 0;
          const v_v = v === 0 ? 0 : solvedX[v - 1] || 0;
          const v_drop = v_u - v_v;

          // If reverse-biased, set resistance to extremely high
          if (v_drop < -0.01) {
            activeResistances[c.id] = 1e8;
          } else {
            activeResistances[c.id] = c.type === 'diode' ? 1 : 2;
          }
        }
      });
    }

    if (isShortCircuit || solvedX.length === 0) {
      return {
        ...defaultResults,
        isShortCircuit: true
      };
    }

    // Populate solved results
    const nodeVoltages: Record<string, number> = {};
    nodeVoltages['0'] = 0; // Ground is always 0V
    for (let i = 1; i < N; i++) {
      nodeVoltages[i.toString()] = solvedX[i - 1] || 0;
    }

    const currents: Record<string, number> = {};
    const voltageDrops: Record<string, number> = {};
    let isClosedCircuit = false;

    // Calculate details for each component
    components.forEach(c => {
      const u = termToNodeId[`${c.id}-p`];
      const v = termToNodeId[`${c.id}-n`];
      const v_u = nodeVoltages[u.toString()];
      const v_v = nodeVoltages[v.toString()];
      
      const v_drop = v_u - v_v;
      voltageDrops[c.id] = v_drop;

      if (c.type === 'battery') {
        // Battery current is solved directly in matrix
        const batIndex = batteries.findIndex(b => b.id === c.id);
        const current = solvedX[(N - 1) + batIndex] || 0;
        currents[c.id] = current;
        if (Math.abs(current) > 0.005) {
          isClosedCircuit = true;
        }
        // If battery current is dangerously high, it's a short circuit!
        if (Math.abs(current) > 15) {
          isShortCircuit = true;
        }
      } else {
        const r = activeResistances[c.id];
        currents[c.id] = v_drop / r;
      }
    });

    return {
      nodeVoltages,
      currents,
      voltageDrops,
      isShortCircuit,
      isClosedCircuit
    };
  };

  // Solve matrix linear system (Gaussian elimination)
  const solveLinearSystem = (A: number[][], B: number[]): number[] => {
    const n = A.length;
    for (let i = 0; i < n; i++) {
      // Find pivot row
      let maxEl = Math.abs(A[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > maxEl) {
          maxEl = Math.abs(A[k][i]);
          maxRow = k;
        }
      }

      // Swap rows in A and B
      const tempRow = A[maxRow];
      A[maxRow] = A[i];
      A[i] = tempRow;
      const tempB = B[maxRow];
      B[maxRow] = B[i];
      B[i] = tempB;

      // Check pivot
      if (Math.abs(A[i][i]) < 1e-12) {
        return new Array(n).fill(0);
      }

      // Eliminate below
      for (let k = i + 1; k < n; k++) {
        const c = -A[k][i] / A[i][i];
        for (let j = i; j < n; j++) {
          if (i === j) {
            A[k][j] = 0;
          } else {
            A[k][j] += c * A[i][j];
          }
        }
        B[k] += c * B[i];
      }
    }

    // Back substitution
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = B[i] / A[i][i];
      for (let k = i - 1; k >= 0; k--) {
        B[k] -= A[k][i] * x[i];
      }
    }
    return x;
  };

  const solvedResults = solveCircuit();
  const { currents = {}, voltageDrops = {} } = solvedResults;

  // Run task verification in real-time
  useEffect(() => {
    const activeTask = LAB_TASKS[currentTaskIndex];
    if (activeTask && !completedTasks[activeTask.id]) {
      const isOk = activeTask.check(components, wires, solvedResults);
      if (isOk) {
        setCompletedTasks(prev => ({ ...prev, [activeTask.id]: true }));
        triggerConfetti();
      }
    }
  }, [components, wires, solvedResults, currentTaskIndex]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Add component from palette to canvas
  const addComponent = (type: string) => {
    if (type === 'wire') {
      setWiringGuideActive(true);
      return;
    }
    const item = PALETTE.find(p => p.type === type);
    if (!item) return;

    // Position component at dynamic coordinates
    const offset = components.length * 15;
    const newComp: PlacedComponent = {
      id: `${type}_${Date.now()}`,
      type,
      name: item.name,
      x: 250 + offset,
      y: 200 + offset,
      r: item.defaultR,
      v: item.defaultV,
      isClosed: type === 'switch' ? false : undefined,
      potValue: type === 'potentiometer' ? 10 : undefined
    };

    setComponents([...components, newComp]);
    setSelectedCompId(newComp.id);
  };

  // Global mouse release hook for maximum drag-and-drop robustness
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggingCompId(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Switch slider adjust resistance
  const handlePotValueChange = (id: string, val: number) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, potValue: val, r: val };
      }
      return c;
    }));
  };

  // Battery voltage adjust
  const handleBatteryVoltsChange = (id: string, val: number) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, v: val };
      }
      return c;
    }));
  };

  // Switch toggle closed/open
  const toggleSwitch = (id: string) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, isClosed: !c.isClosed };
      }
      return c;
    }));
  };

  // Delete active component and associated wires
  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    setWires(wires.filter(w => w.fromId !== id && w.toId !== id));
    if (selectedCompId === id) setSelectedCompId(null);
  };

  // Delete wire connection
  const deleteWire = (wireId: string) => {
    setWires(wires.filter(w => w.id !== wireId));
  };

  // Helper to get information of the selected component or wire
  const getSelectedCompInfo = () => {
    if (!selectedCompId) return null;
    
    if (selectedCompId.startsWith('wire_')) {
      const wire = wires.find(w => w.id === selectedCompId);
      if (!wire) return null;
      const fromComp = components.find(c => c.id === wire.fromId);
      const toComp = components.find(c => c.id === wire.toId);
      return {
        type: 'wire',
        name: `Dây dẫn liên kết`,
        details: `Nối cực ${wire.fromTerm === 'p' ? 'Dương (Đỏ)' : 'Âm (Đen)'} của ${fromComp?.name || 'linh kiện'} với cực ${wire.toTerm === 'p' ? 'Dương (Đỏ)' : 'Âm (Đen)'} của ${toComp?.name || 'linh kiện'}`,
        id: wire.id,
        comp: null
      };
    }
    
    const comp = components.find(c => c.id === selectedCompId);
    if (!comp) return null;
    return {
      type: 'component',
      name: comp.name,
      details: comp.type === 'battery' ? `Nguồn cấp điện hiệu điện thế ${comp.v?.toFixed(1)}V` : comp.type === 'bulb' ? `Bóng đèn sợi đốt tiêu thụ điện năng` : `Linh kiện trong mạch`,
      id: comp.id,
      comp
    };
  };

  // Listen for keyboard shortcuts (Delete/Backspace to delete selected items)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedCompId) {
          if (selectedCompId.startsWith('wire_')) {
            deleteWire(selectedCompId);
            setSelectedCompId(null);
          } else {
            deleteComponent(selectedCompId);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCompId, components, wires]);

  // Mouse Move tracking for active wire drafting and component dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggingCompId) {
      doDrag(e);
    }
  };

  // SVG Mouse Up to complete drag component or wire drafting
  const handleMouseUp = () => {
    setDraggingCompId(null);
  };

  // Canvas click helper
  const handleCanvasClick = (e: React.MouseEvent) => {
    // If click on background, cancel wiring mode
    if (e.target === canvasRef.current) {
      setWiringSource(null);
      setSelectedCompId(null);
    }
  };

  // Drag start (e.preventDefault() is critical to stop browser selection/ghost drag)
  const startDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCompId(id);
    const comp = components.find(c => c.id === id);
    if (!comp || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDraggingCompId(id);
    setDragOffset({
      x: mouseX - comp.x,
      y: mouseY - comp.y
    });
  };

  // Mobile Touch Start dragging support
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    e.stopPropagation();
    setSelectedCompId(id);
    const comp = components.find(c => c.id === id);
    if (!comp || !canvasRef.current) return;

    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;

    setDraggingCompId(id);
    setDragOffset({
      x: mouseX - comp.x,
      y: mouseY - comp.y
    });
  };

  // Dragging update
  const doDrag = (e: React.MouseEvent) => {
    if (!draggingCompId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setComponents(prev => prev.map(c => {
      if (c.id === draggingCompId) {
        return {
          ...c,
          x: Math.max(40, Math.min(rect.width - 40, mouseX - dragOffset.x)),
          y: Math.max(40, Math.min(rect.height - 40, mouseY - dragOffset.y))
        };
      }
      return c;
    }));
  };

  // Mobile Touch Move dragging support
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0 || !canvasRef.current) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setMousePos({ x, y });

    if (draggingCompId) {
      setComponents(prev => prev.map(c => {
        if (c.id === draggingCompId) {
          return {
            ...c,
            x: Math.max(40, Math.min(rect.width - 40, x - dragOffset.x)),
            y: Math.max(40, Math.min(rect.height - 40, y - dragOffset.y))
          };
        }
        return c;
      }));
    }
  };

  // Direct connection of two ports (used by both click and drag connect methods)
  const connectTerminals = (fromId: string, fromTerm: 'p' | 'n', toId: string, toTerm: 'p' | 'n') => {
    if (fromId === toId) return;

    // Prevent duplicate wires between same ports
    const duplicate = wires.some(w => 
      (w.fromId === fromId && w.fromTerm === fromTerm && w.toId === toId && w.toTerm === toTerm) ||
      (w.fromId === toId && w.fromTerm === toTerm && w.toId === fromId && w.toTerm === fromTerm)
    );

    if (!duplicate) {
      const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newWire: Wire = {
        id: `wire_${Date.now()}`,
        fromId: fromId,
        fromTerm: fromTerm,
        toId: toId,
        toTerm: toTerm,
        color: randomColor
      };
      setWires(prev => [...prev, newWire]);
    }
    setWiringSource(null);
  };

  // Terminal Mouse Down sets connection source
  const handleTermMouseDown = (e: React.MouseEvent, id: string, term: 'p' | 'n') => {
    e.stopPropagation();
    e.preventDefault();
    if (!wiringSource) {
      setWiringSource({ id, term });
    } else {
      if (wiringSource.id !== id) {
        connectTerminals(wiringSource.id, wiringSource.term, id, term);
      } else {
        setWiringSource(null); // Cancel connection if same port is clicked again
      }
    }
  };

  // Terminal Mouse Up triggers connection (supports drag-and-connect)
  const handleTermMouseUp = (e: React.MouseEvent, id: string, term: 'p' | 'n') => {
    e.stopPropagation();
    if (wiringSource) {
      if (wiringSource.id === id && wiringSource.term === term) {
        // Released on the same port: keep active for click-to-connect mode
        return;
      }
      connectTerminals(wiringSource.id, wiringSource.term, id, term);
    }
  };

  // Clear workspace completely
  const resetWorkspace = () => {
    setComponents([]);
    setWires([]);
    setSelectedCompId(null);
    setWiringSource(null);
  };

  // Quiz submit check
  const handleQuizAnswer = (opt: string) => {
    if (quizAnswered) return;
    const q = QUIZ_QUESTIONS[currentQuizIndex];
    setQuizAnswered(true);
    if (opt === q.ans) {
      setQuizScore(prev => prev + 25);
      setQuizFeedback("Chính xác! Cậu xuất sắc lắm. " + q.fact);
    } else {
      setQuizFeedback("Chưa chính xác rồi. Đáp án đúng là: " + q.ans + ". " + q.fact);
    }
  };

  const nextQuiz = () => {
    setQuizAnswered(false);
    setQuizFeedback(null);
    setCurrentQuizIndex(prev => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  const getTerminalCoords = (id: string, term: 'p' | 'n') => {
    const comp = components.find(c => c.id === id);
    if (!comp) return { x: 0, y: 0 };
    return {
      x: comp.x + (term === 'p' ? -30 : 30),
      y: comp.y
    };
  };

  return (
    <div className="w-full h-screen bg-khtn8-pastel flex flex-col font-sans text-slate-800 overflow-hidden select-none">
      
      {/* Header bar */}
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-all border border-slate-200 shadow-xs"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-slate-950 font-black fill-slate-950" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-800 uppercase">Phòng Thí Nghiệm Mạch Điện Ảo</h1>
              <p className="text-[10px] text-slate-500 font-medium">Khoa học tự nhiên lớp 8 - Mạch điện cơ bản</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1 shadow-inner">
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === 'diagram'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" /> Ký hiệu
            </button>
            <button
              onClick={() => setViewMode('realistic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === 'realistic'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Radio className="w-4 h-4" /> Thực tế
            </button>
          </div>

          <button
            onClick={resetWorkspace}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Dọn dẹp
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Component Palette */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white/80 flex flex-col h-1/4 lg:h-full overflow-hidden backdrop-blur-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Hộp linh kiện điện</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Click vào linh kiện để đưa vào bàn thực hành</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-1 gap-2 custom-scrollbar">
            {PALETTE.map((item) => (
              <button
                key={item.type}
                onClick={() => addComponent(item.type)}
                className="p-3 bg-slate-55 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-left transition-all flex items-center gap-3.5 group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate">{item.vietnameseName}</h4>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5">{item.description}</p>
                </div>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Center: Interactive Virtual Workbench */}
        <div className="flex-1 relative bg-transparent overflow-hidden flex flex-col h-2/4 lg:h-full">
          {/* Quick status bar */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5">
            <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-sm text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping" />
              <span>Chế độ: Động lực học thời gian thực</span>
            </div>

            {solvedResults.isShortCircuit && (
              <div className="bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5 animate-bounce shadow-md">
                <AlertTriangle className="w-4 h-4" /> Đoản mạch!
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hiển thị dòng điện:</span>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-black text-cyan-600 uppercase">Hạt electron di chuyển</span>
            </div>
          </div>

          {wiringSource && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-yellow-50 border-2 border-yellow-200 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-yellow-600 flex items-center gap-2.5 shadow-md backdrop-blur-md animate-pulse">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-spin" />
              <span>Đang kết nối: Hãy nhấp vào đầu cực của linh kiện thứ hai để nối dây dẫn! (Nhấp ra nền trống để hủy)</span>
            </div>
          )}

          {/* Floating Wiring Guide Alert Popup */}
          <AnimatePresence>
            {wiringGuideActive && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md bg-white border border-yellow-200 p-4 rounded-2xl shadow-lg backdrop-blur-md flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0 animate-pulse">
                    <Zap className="w-5 h-5 fill-yellow-400/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Cách Nối Dây Dẫn (Mạch Điện)</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Để tạo kết nối dây dẫn, hãy <strong>click hoặc kéo</strong> từ đầu cực tròn (🔴 Đỏ hoặc ⚫ Đen) của linh kiện này sang đầu cực của linh kiện khác trên bàn thực hành nhé!
                    </p>
                  </div>
                  <button 
                    onClick={() => setWiringGuideActive(false)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG Canvas */}
          <svg
            ref={canvasRef}
            className="w-full h-full cursor-crosshair relative"
            style={{ 
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', 
              backgroundSize: '24px 24px',
              touchAction: 'none'
            }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onClick={handleCanvasClick}
          >
            {/* Draw current flow particles on wires if current is flowing */}
            {wires.map((w) => {
              const start = getTerminalCoords(w.fromId, w.fromTerm);
              const end = getTerminalCoords(w.toId, w.toTerm);
              const isSelected = selectedCompId === w.id;

              const cFrom = currents[w.fromId] || 0;
              const cTo = currents[w.toId] || 0;
              const hasCurrent = Math.abs(cFrom) > 0.005 || Math.abs(cTo) > 0.005;

              // Generate wire path based on view mode
              let pathD = '';
              if (viewMode === 'diagram') {
                // Perfect right-angle orthogonal routing for textbook schematic style
                const dir1 = w.fromTerm === 'p' ? -1 : 1;
                const offset1 = start.x + dir1 * 20;
                
                if (Math.abs(start.y - end.y) < 6) {
                  pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                } else if (dir1 === 1 && end.x > start.x + 40) {
                  const midX = (start.x + end.x) / 2;
                  pathD = `M ${start.x} ${start.y} H ${midX} V ${end.y} H ${end.x}`;
                } else if (dir1 === -1 && end.x < start.x - 40) {
                  const midX = (start.x + end.x) / 2;
                  pathD = `M ${start.x} ${start.y} H ${midX} V ${end.y} H ${end.x}`;
                } else {
                  pathD = `M ${start.x} ${start.y} H ${offset1} V ${end.y} H ${end.x}`;
                }
              } else {
                // Smooth bezier path for realistic wire visualization
                const dx = Math.abs(end.x - start.x) * 0.5;
                pathD = `M ${start.x} ${start.y} C ${start.x + (w.fromTerm === 'p' ? -dx : dx)} ${start.y}, ${end.x + (w.toTerm === 'p' ? -dx : dx)} ${end.y}, ${end.x} ${end.y}`;
              }

              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              return (
                <g key={w.id} onClick={(e) => { e.stopPropagation(); setSelectedCompId(w.id); }} className="cursor-pointer">
                  {/* Invisible thicker interaction wire for easier click selection */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={14}
                  />

                  {/* Base Copper/Plastic Wire */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isSelected ? '#eab308' : w.color}
                    strokeWidth={isSelected ? 4 : 2.5}
                    className="transition-all duration-200"
                    strokeLinecap="round"
                  />

                  {/* Flowing current particles */}
                  {hasCurrent && !solvedResults.isShortCircuit && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#67e8f9"
                      strokeWidth={1.5}
                      strokeDasharray="8 12"
                      style={{
                        animation: 'flow 1.5s linear infinite',
                        strokeLinecap: 'round'
                      }}
                    />
                  )}

                  {/* Midpoint wire delete button */}
                  {isSelected && (
                    <g 
                      transform={`translate(${midX}, ${midY})`} 
                      onClick={(e) => { e.stopPropagation(); deleteWire(w.id); setSelectedCompId(null); }} 
                      className="cursor-pointer z-30"
                    >
                      <circle cx={0} cy={0} r={10} fill="#ef4444" stroke="#fff" strokeWidth={1.5} className="shadow-md hover:scale-115 transition-transform" />
                      <line x1={-4} y1={-4} x2={4} y2={4} stroke="#fff" strokeWidth={2} />
                      <line x1={-4} y1={4} x2={4} y2={-4} stroke="#fff" strokeWidth={2} />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Wire draft preview line when connecting */}
            {wiringSource && (
              <line
                x1={getTerminalCoords(wiringSource.id, wiringSource.term).x}
                y1={getTerminalCoords(wiringSource.id, wiringSource.term).y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="#eab308"
                strokeWidth={2}
                strokeDasharray="6 4"
                className="pointer-events-none"
              />
            )}

            {/* Render placed components */}
            {components.map((c) => {
              const isSelected = selectedCompId === c.id;
              const c_val = currents[c.id] || 0;
              const hasCurrent = Math.abs(c_val) > 0.005;

              // Left terminal position relative to center [c.x, c.y]
              const termP = getTerminalCoords(c.id, 'p');
              const termN = getTerminalCoords(c.id, 'n');

              return (
                <g
                  key={c.id}
                  transform={`translate(0, 0)`}
                  onMouseDown={(e) => startDrag(e, c.id)}
                  onTouchStart={(e) => handleTouchStart(e, c.id)}
                  onMouseUp={handleMouseUp}
                  onTouchEnd={handleMouseUp}
                  className="select-none cursor-grab active:cursor-grabbing"
                >
                  {/* Highlight box if selected */}
                  {isSelected && (
                    <rect
                      x={c.x - 50}
                      y={c.y - 30}
                      width={100}
                      height={60}
                      rx={12}
                      fill="none"
                      stroke="#eab308"
                      strokeWidth={1.5}
                      strokeDasharray="4 2"
                      className="shadow-2xl"
                    />
                  )}

                  {/* 3D smoke/short-circuit outlines */}
                  {solvedResults.isShortCircuit && c.type === 'battery' && (
                    <g>
                      <circle cx={c.x} cy={c.y} r={40} fill="none" stroke="#f43f5e" strokeWidth={3} className="animate-ping" />
                      <text x={c.x} y={c.y - 45} textAnchor="middle" fill="#f43f5e" fontSize={12} fontWeight="900" className="animate-bounce">🔥 NÓNG QUÁ MỨC!</text>
                    </g>
                  )}

                  {/* Component Body rendering based on View Mode */}
                  <g className="transition-transform duration-200 hover:scale-[1.03]">
                    {viewMode === 'diagram' ? (
                      // DIAGRAM VIEW (Official standard symbols)
                      <g>
                        {/* Background clean white card with subtle border removed */}
                        
                        {/* Render standard vector symbols */}
                        {c.type === 'battery' && (
                          <g stroke="#0f172a" strokeWidth={2} fill="none">
                            {/* Positive terminal (longer, thinner line) */}
                            <line x1={c.x - 5} y1={c.y - 10} x2={c.x - 5} y2={c.y + 10} />
                            {/* Negative terminal (shorter, thicker line) */}
                            <line x1={c.x + 5} y1={c.y - 6} x2={c.x + 5} y2={c.y + 6} strokeWidth={4} />
                            {/* Leads connecting out */}
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 5} y2={c.y} />
                            <line x1={c.x + 5} y1={c.y} x2={c.x + 30} y2={c.y} />
                            {/* Polarity labels matches textbooks */}
                            <text x={c.x - 12} y={c.y - 14} fill="#0f172a" fontSize={10} fontWeight="black" textAnchor="middle" stroke="none">+</text>
                            <text x={c.x + 12} y={c.y - 14} fill="#0f172a" fontSize={10} fontWeight="black" textAnchor="middle" stroke="none">-</text>
                          </g>
                        )}

                        {c.type === 'bulb' && (
                          <g stroke={hasCurrent && !solvedResults.isShortCircuit ? '#d97706' : '#0f172a'} strokeWidth={2} fill="none">
                            <circle cx={c.x} cy={c.y} r={12} fill={hasCurrent && !solvedResults.isShortCircuit ? 'rgba(251, 191, 36, 0.25)' : 'none'} />
                            <line x1={c.x - 8} y1={c.y - 8} x2={c.x + 8} y2={c.y + 8} />
                            <line x1={c.x - 8} y1={c.y + 8} x2={c.x + 8} y2={c.y - 8} />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 12} y2={c.y} />
                            <line x1={c.x + 12} y1={c.y} x2={c.x + 30} y2={c.y} />
                          </g>
                        )}

                        {c.type === 'switch' && (
                          <g stroke="#0f172a" strokeWidth={2} fill="none">
                            <circle cx={c.x - 12} cy={c.y} r={3} fill="#0f172a" />
                            <circle cx={c.x + 12} cy={c.y} r={3} fill="#0f172a" />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 12} y2={c.y} />
                            <line x1={c.x + 12} y1={c.y} x2={c.x + 30} y2={c.y} />
                            {c.isClosed ? (
                              <line x1={c.x - 12} y1={c.y} x2={c.x + 12} y2={c.y} />
                            ) : (
                              <line x1={c.x - 12} y1={c.y} x2={c.x + 8} y2={c.y - 12} />
                            )}
                            {/* Textbook Label K */}
                            <text x={c.x} y={c.y - 15} fill="#0f172a" fontSize={10} fontWeight="black" textAnchor="middle" stroke="none">K</text>
                          </g>
                        )}

                        {c.type === 'resistor' && (
                          <g stroke="#0f172a" strokeWidth={2} fill="none">
                            <rect x={c.x - 15} y={c.y - 6} width={30} height={12} />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 15} y2={c.y} />
                            <line x1={c.x + 15} y1={c.y} x2={c.x + 30} y2={c.y} />
                          </g>
                        )}

                        {c.type === 'potentiometer' && (
                          <g stroke="#0f172a" strokeWidth={2} fill="none">
                            <rect x={c.x - 15} y={c.y - 6} width={30} height={12} />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 15} y2={c.y} />
                            <line x1={c.x + 15} y1={c.y} x2={c.x + 30} y2={c.y} />
                            {/* Adjustable arrow */}
                            <line x1={c.x - 18} y1={c.y + 12} x2={c.x + 18} y2={c.y - 12} stroke="#ea580c" />
                            <path d={`M ${c.x + 18} ${c.y - 12} L ${c.x + 12} ${c.y - 12} M ${c.x + 18} ${c.y - 12} L ${c.x + 18} ${c.y - 6}`} stroke="#ea580c" />
                          </g>
                        )}

                        {c.type === 'bell' && (
                          <g stroke={hasCurrent && !solvedResults.isShortCircuit ? '#db2777' : '#0f172a'} strokeWidth={2} fill="none">
                            <path d={`M ${c.x - 12} ${c.y + 6} A 12 12 0 0 1 ${c.x + 12} ${c.y + 6} Z`} fill={hasCurrent && !solvedResults.isShortCircuit ? 'rgba(219, 39, 119, 0.15)' : 'none'} />
                            <line x1={c.x - 12} y1={c.y + 6} x2={c.x + 12} y2={c.y + 6} />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 12} y2={c.y} />
                            <line x1={c.x + 12} y1={c.y} x2={c.x + 30} y2={c.y} />
                          </g>
                        )}

                        {c.type === 'diode' && (
                          <g stroke="#0f172a" strokeWidth={2} fill="none">
                            <polygon points={`${c.x - 8},${c.y - 8} ${c.x + 8},${c.y} ${c.x - 8},${c.y + 8}`} fill="none" />
                            <line x1={c.x + 8} y1={c.y - 8} x2={c.x + 8} y2={c.y + 8} />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 8} y2={c.y} />
                            <line x1={c.x + 8} y1={c.y} x2={c.x + 30} y2={c.y} />
                          </g>
                        )}

                        {c.type === 'led' && (
                          <g stroke={hasCurrent && !solvedResults.isShortCircuit ? '#e11d48' : '#0f172a'} strokeWidth={2} fill="none">
                            <polygon points={`${c.x - 8},${c.y - 8} ${c.x + 8},${c.y} ${c.x - 8},${c.y + 8}`} fill={hasCurrent && !solvedResults.isShortCircuit ? 'rgba(225, 29, 72, 0.2)' : 'none'} />
                            <line x1={c.x + 8} y1={c.y - 8} x2={c.x + 8} y2={c.y + 8} />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 8} y2={c.y} />
                            <line x1={c.x + 8} y1={c.y} x2={c.x + 30} y2={c.y} />
                            {/* Light ray arrows */}
                            <line x1={c.x} y1={c.y - 10} x2={c.x + 8} y2={c.y - 18} strokeWidth={1} />
                            <line x1={c.x + 4} y1={c.y - 6} x2={c.x + 12} y2={c.y - 14} strokeWidth={1} />
                          </g>
                        )}

                        {c.type === 'ammeter' && (
                          <g stroke="#0f172a" strokeWidth={2} fill="none">
                            <circle cx={c.x} cy={c.y} r={12} fill="#ffffff" />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 12} y2={c.y} />
                            <line x1={c.x + 12} y1={c.y} x2={c.x + 30} y2={c.y} />
                            <text x={c.x} y={c.y + 4} textAnchor="middle" fill="#2563eb" fontSize={11} fontWeight="900" stroke="none">A</text>
                            {/* Sign polarity labels matches textbooks */}
                            <text x={c.x - 20} y={c.y - 14} fill="#ef4444" fontSize={10} fontWeight="900" stroke="none" textAnchor="middle">+</text>
                            <text x={c.x + 20} y={c.y - 14} fill="#64748b" fontSize={10} fontWeight="900" stroke="none" textAnchor="middle">-</text>
                          </g>
                        )}

                        {c.type === 'voltmeter' && (
                          <g stroke="#0f172a" strokeWidth={2} fill="none">
                            <circle cx={c.x} cy={c.y} r={12} fill="#ffffff" />
                            <line x1={c.x - 30} y1={c.y} x2={c.x - 12} y2={c.y} />
                            <line x1={c.x + 12} y1={c.y} x2={c.x + 30} y2={c.y} />
                            <text x={c.x} y={c.y + 4} textAnchor="middle" fill="#dc2626" fontSize={11} fontWeight="900" stroke="none">V</text>
                            {/* Sign polarity labels matches textbooks */}
                            <text x={c.x - 20} y={c.y - 14} fill="#ef4444" fontSize={10} fontWeight="900" stroke="none" textAnchor="middle">+</text>
                            <text x={c.x + 20} y={c.y - 14} fill="#64748b" fontSize={10} fontWeight="900" stroke="none" textAnchor="middle">-</text>
                          </g>
                        )}
                      </g>
                    ) : (
                      // REALISTIC ILLUSTRATION VIEW (Gorgeously rendered 3D-styled SVGs)
                      <g>
                        {c.type === 'battery' && (
                          <g>
                            {/* Battery casing */}
                            <rect x={c.x - 30} y={c.y - 20} width={60} height={40} rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1.5} />
                            <rect x={c.x - 30} y={c.y - 20} width={12} height={40} rx={2} fill="#f59e0b" />
                            {/* Brass terminals */}
                            <rect x={c.x - 34} y={c.y - 8} width={4} height={16} rx={1} fill="#e2e8f0" />
                            <rect x={c.x + 30} y={c.y - 8} width={4} height={16} rx={1} fill="#e2e8f0" />
                            {/* Label */}
                            <text x={c.x + 5} y={c.y + 4} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight="900" className="select-none">9V BAT</text>
                            <text x={c.x - 24} y={c.y + 4} textAnchor="middle" fill="#0f172a" fontSize={10} fontWeight="900">+</text>
                          </g>
                        )}

                        {c.type === 'bulb' && (
                          <g>
                            {/* Socket base */}
                            <rect x={c.x - 22} y={c.y + 6} width={44} height={12} rx={2} fill="#334155" stroke="#475569" strokeWidth={1} />
                            <rect x={c.x - 14} y={c.y - 2} width={28} height={8} fill="#94a3b8" />
                            {/* Glass Bulb outline */}
                            <circle 
                              cx={c.x} 
                              cy={c.y - 8} 
                              r={16} 
                              fill={hasCurrent && !solvedResults.isShortCircuit ? 'rgba(250, 204, 21, 0.45)' : 'rgba(255, 255, 255, 0.05)'} 
                              stroke={hasCurrent && !solvedResults.isShortCircuit ? '#facc15' : '#94a3b8'} 
                              strokeWidth={1.5} 
                            />
                            {/* Glowing filament */}
                            <path 
                              d={`M ${c.x - 6} ${c.y - 2} L ${c.x - 3} ${c.y - 12} L ${c.x + 3} ${c.y - 12} L ${c.x + 6} ${c.y - 2}`} 
                              fill="none" 
                              stroke={hasCurrent && !solvedResults.isShortCircuit ? '#fff' : '#64748b'} 
                              strokeWidth={1.5} 
                            />
                            {/* Glowing light rays */}
                            {hasCurrent && !solvedResults.isShortCircuit && (
                              <g stroke="#facc15" strokeWidth={1.5}>
                                <line x1={c.x} y1={c.y - 28} x2={c.x} y2={c.y - 34} />
                                <line x1={c.x - 20} y1={c.y - 20} x2={c.x - 25} y2={c.y - 25} />
                                <line x1={c.x + 20} y1={c.y - 20} x2={c.x + 25} y2={c.y - 25} />
                                <line x1={c.x - 24} y1={c.y - 8} x2={c.x - 30} y2={c.y - 8} />
                                <line x1={c.x + 24} y1={c.y - 8} x2={c.x + 30} y2={c.y - 8} />
                              </g>
                            )}
                          </g>
                        )}

                        {c.type === 'switch' && (
                          <g>
                            {/* Knife switch wooden stand base */}
                            <rect x={c.x - 28} y={c.y - 14} width={56} height={28} rx={4} fill="#d97706" stroke="#b45309" strokeWidth={1} />
                            {/* Terminal blocks */}
                            <rect x={c.x - 20} y={c.y - 6} width={8} height={12} rx={1} fill="#e2e8f0" />
                            <rect x={c.x + 12} y={c.y - 6} width={8} height={12} rx={1} fill="#e2e8f0" />
                            {/* Copper Lever blade */}
                            {c.isClosed ? (
                              <line x1={c.x - 16} y1={c.y} x2={c.x + 16} y2={c.y} stroke="#f59e0b" strokeWidth={4} strokeLinecap="round" />
                            ) : (
                              <line x1={c.x - 16} y1={c.y} x2={c.x + 6} y2={c.y - 18} stroke="#f59e0b" strokeWidth={4} strokeLinecap="round" />
                            )}
                            {/* Small plastic handle knob */}
                            {!c.isClosed && (
                              <circle cx={c.x + 6} cy={c.y - 18} r={4} fill="#ef4444" />
                            )}
                          </g>
                        )}

                        {c.type === 'resistor' && (
                          <g>
                            {/* Ceramic body */}
                            <rect x={c.x - 20} y={c.y - 8} width={40} height={16} rx={8} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} />
                            {/* Resistor color stripes (e.g. 10 Ohm: Brown, Black, Black, Gold) */}
                            <rect x={c.x - 12} y={c.y - 8} width={4} height={16} fill="#78350f" /> {/* Brown */}
                            <rect x={c.x - 4} y={c.y - 8} width={4} height={16} fill="#0f172a" />  {/* Black */}
                            <rect x={c.x + 4} y={c.y - 8} width={4} height={16} fill="#0f172a" />  {/* Black */}
                            <rect x={c.x + 12} y={c.y - 8} width={4} height={16} fill="#eab308" />  {/* Gold */}
                          </g>
                        )}

                        {c.type === 'potentiometer' && (
                          <g>
                            {/* Slider Rheostat body */}
                            <rect x={c.x - 28} y={c.y - 12} width={56} height={24} rx={2} fill="#334155" stroke="#475569" strokeWidth={1} />
                            {/* Metal rod */}
                            <line x1={c.x - 24} y1={c.y - 4} x2={c.x + 24} y2={c.y - 4} stroke="#e2e8f0" strokeWidth={2} />
                            {/* Slider cursor slider */}
                            {/* Draw a sliding metal clamp relative to current potValue */}
                            {(() => {
                              const pct = ((c.potValue || 10) - 0.1) / 99.9; // 0 to 1
                              const sliderX = c.x - 20 + pct * 40;
                              return (
                                <g>
                                  <rect x={sliderX - 4} y={c.y - 8} width={8} height={14} rx={1} fill="#ef4444" />
                                  <line x1={sliderX} y1={c.y - 8} x2={sliderX} y2={c.y + 6} stroke="#fff" strokeWidth={1} />
                                </g>
                              );
                            })()}
                          </g>
                        )}

                        {c.type === 'bell' && (
                          <g>
                            {/* Electronic bell base */}
                            <rect x={c.x - 18} y={c.y + 2} width={36} height={14} rx={2} fill="#475569" />
                            {/* Red alarm dome */}
                            <path 
                              d={`M ${c.x - 22} ${c.y + 2} A 22 22 0 0 1 ${c.x + 22} ${c.y + 2} Z`} 
                              fill="#ef4444" 
                              stroke="#dc2626" 
                              strokeWidth={1} 
                              className={hasCurrent && !solvedResults.isShortCircuit ? 'animate-pulse' : ''}
                            />
                            {/* Sound waves indicator */}
                            {hasCurrent && !solvedResults.isShortCircuit && (
                              <g stroke="#ef4444" strokeWidth={1.5} fill="none">
                                <path d={`M ${c.x - 26} ${c.y - 12} A 28 28 0 0 1 ${c.x + 26} ${c.y - 12}`} className="animate-ping" />
                                <text x={c.x} y={c.y + 24} textAnchor="middle" fill="#ef4444" fontSize={10} fontWeight="900" className="animate-bounce">RENG RENG!</text>
                              </g>
                            )}
                          </g>
                        )}

                        {c.type === 'diode' && (
                          <g>
                            {/* Realistic diode body */}
                            <rect x={c.x - 18} y={c.y - 6} width={36} height={12} rx={2} fill="#0f172a" stroke="#1e293b" strokeWidth={1} />
                            {/* Cathode grey band */}
                            <rect x={c.x + 8} y={c.y - 6} width={4} height={12} fill="#94a3b8" />
                          </g>
                        )}

                        {c.type === 'led' && (
                          <g>
                            {/* LED plastic lens */}
                            <path 
                              d={`M ${c.x - 10} ${c.y + 6} L ${c.x - 10} ${c.y - 6} A 10 10 0 0 1 ${c.x + 10} ${c.y - 6} L ${c.x + 10} ${c.y + 6} Z`} 
                              fill={hasCurrent && !solvedResults.isShortCircuit ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'} 
                              stroke="#b91c1c" 
                              strokeWidth={1.5} 
                            />
                            {/* LED rim rim base */}
                            <rect x={c.x - 12} y={c.y + 6} width={24} height={3} rx={1} fill={hasCurrent && !solvedResults.isShortCircuit ? '#ef4444' : '#b91c1c'} />
                            {/* Metal frame inside */}
                            <path d={`M ${c.x - 4} ${c.y + 4} L ${c.x - 4} ${c.y - 2} L ${c.x + 4} ${c.y - 2} L ${c.x + 4} ${c.y + 4}`} fill="none" stroke="#cbd5e1" strokeWidth={1} />
                            {/* Light beams */}
                            {hasCurrent && !solvedResults.isShortCircuit && (
                              <g stroke="#f87171" strokeWidth={1.5}>
                                <line x1={c.x - 15} y1={c.y - 12} x2={c.x - 22} y2={c.y - 18} />
                                <line x1={c.x + 15} y1={c.y - 12} x2={c.x + 22} y2={c.y - 18} />
                              </g>
                            )}
                          </g>
                        )}

                        {c.type === 'ammeter' && (
                          <g>
                            {/* Laboratory analog meter casing */}
                            <rect x={c.x - 26} y={c.y - 20} width={52} height={40} rx={4} fill="#2563eb" stroke="#1d4ed8" strokeWidth={1.5} />
                            <rect x={c.x - 20} y={c.y - 14} width={40} height={20} rx={2} fill="#f8fafc" />
                            {/* Analog scale */}
                            <path d={`M ${c.x - 16} ${c.y - 2} A 16 16 0 0 1 ${c.x + 16} ${c.y - 2}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
                            {/* Reading text */}
                            <text x={c.x} y={c.y + 16} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="900">{Math.abs(c_val).toFixed(2)} A</text>
                            {/* Meter indicator pointer needle */}
                            {(() => {
                              const absCur = Math.min(3, Math.abs(c_val));
                              const angle = -60 + (absCur / 3) * 120; // -60 to 60 deg
                              return (
                                <line
                                  x1={c.x}
                                  y1={c.y + 2}
                                  x2={c.x + 16 * Math.sin((angle * Math.PI) / 180)}
                                  y2={c.y + 2 - 16 * Math.cos((angle * Math.PI) / 180)}
                                  stroke="#ef4444"
                                  strokeWidth={1.5}
                                />
                              );
                            })()}
                          </g>
                        )}

                        {c.type === 'voltmeter' && (
                          <g>
                            {/* Laboratory analog meter casing */}
                            <rect x={c.x - 26} y={c.y - 20} width={52} height={40} rx={4} fill="#dc2626" stroke="#b91c1c" strokeWidth={1.5} />
                            <rect x={c.x - 20} y={c.y - 14} width={40} height={20} rx={2} fill="#f8fafc" />
                            {/* Analog scale */}
                            <path d={`M ${c.x - 16} ${c.y - 2} A 16 16 0 0 1 ${c.x + 16} ${c.y - 2}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
                            {/* Reading text */}
                            <text x={c.x} y={c.y + 16} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="900">{Math.abs(solvedResults.voltageDrops[c.id] || 0).toFixed(2)} V</text>
                            {/* Meter indicator pointer needle */}
                            {(() => {
                              const absVolts = Math.min(12, Math.abs(solvedResults.voltageDrops[c.id] || 0));
                              const angle = -60 + (absVolts / 12) * 120; // -60 to 60 deg
                              return (
                                <line
                                  x1={c.x}
                                  y1={c.y + 2}
                                  x2={c.x + 16 * Math.sin((angle * Math.PI) / 180)}
                                  y2={c.y + 2 - 16 * Math.cos((angle * Math.PI) / 180)}
                                  stroke="#ef4444"
                                  strokeWidth={1.5}
                                />
                              );
                            })()}
                          </g>
                        )}
                      </g>
                    )}
                  </g>

                  {/* Red/Black circular terminal ports for wiring */}
                  <g>
                    {/* Glowing pulse aura for positive terminal removed */}
                    {/* Invisible larger shell for ultra-easy clicking/touching */}
                    <circle
                      cx={termP.x}
                      cy={termP.y}
                      r={16}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseDown={(e) => handleTermMouseDown(e, c.id, 'p')}
                      onMouseUp={(e) => handleTermMouseUp(e, c.id, 'p')}
                    />

                    {/* Glowing pulse aura for negative terminal removed */}
                    {/* Invisible larger shell for ultra-easy clicking/touching */}
                    <circle
                      cx={termN.x}
                      cy={termN.y}
                      r={16}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseDown={(e) => handleTermMouseDown(e, c.id, 'n')}
                      onMouseUp={(e) => handleTermMouseUp(e, c.id, 'n')}
                    />
                  </g>

                  {/* Drag switch button overlay */}
                  {c.type === 'switch' && (
                    <g 
                      transform={`translate(${c.x - 12}, ${c.y + 12})`} 
                      onClick={(e) => { e.stopPropagation(); toggleSwitch(c.id); }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <rect width={24} height={12} rx={6} fill={c.isClosed ? '#10b981' : '#475569'} className="cursor-pointer" />
                      <circle cx={c.isClosed ? 18 : 6} cy={6} r={4} fill="#fff" />
                    </g>
                  )}

                  {/* Drag slider overlay for variable resistor (potentiometer) */}
                  {c.type === 'potentiometer' && isSelected && (
                    <foreignObject x={c.x - 45} y={c.y + 24} width={90} height={20}>
                      <input
                        type="range"
                        min="0.5"
                        max="100"
                        step="0.5"
                        value={c.potValue || 10}
                        onChange={(e) => handlePotValueChange(c.id, parseFloat(e.target.value))}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                    </foreignObject>
                  )}

                  {/* Drag slider overlay for battery voltage */}
                  {c.type === 'battery' && isSelected && (
                    <foreignObject x={c.x - 45} y={c.y + 24} width={90} height={20}>
                      <input
                        type="range"
                        min="1.5"
                        max="24"
                        step="1.5"
                        value={c.v || 9}
                        onChange={(e) => handleBatteryVoltsChange(c.id, parseFloat(e.target.value))}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </foreignObject>
                  )}

                  {/* Active rating readouts */}
                  <text x={c.x} y={c.y - 24} textAnchor="middle" fill="#475569" fontSize={9} fontWeight="900" className="select-none pointer-events-none">
                    {c.type === 'battery' ? `${c.v?.toFixed(1)} V` : ''}
                    {c.type === 'resistor' ? `${c.r} Ω` : ''}
                    {c.type === 'potentiometer' ? `${c.potValue?.toFixed(1)} Ω` : ''}
                    {c.type === 'bulb' ? `10 Ω` : ''}
                  </text>

                  {/* floating tiny component delete icon */}
                  {isSelected && (
                    <g 
                      transform={`translate(${c.x + 38}, ${c.y - 30})`} 
                      onClick={(e) => { e.stopPropagation(); deleteComponent(c.id); }} 
                      className="cursor-pointer group/del z-30"
                    >
                      <circle cx={0} cy={0} r={11} fill="#ef4444" stroke="#fff" strokeWidth={1.5} className="shadow-md hover:scale-115 transition-transform" />
                      <line x1={-4} y1={-4} x2={4} y2={4} stroke="#fff" strokeWidth={2} />
                      <line x1={-4} y1={4} x2={4} y2={-4} stroke="#fff" strokeWidth={2} />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Flow Animation CSS Injection */}
          <style>{`
            @keyframes flow {
              to {
                stroke-dashoffset: -20;
              }
            }
          `}</style>
        </div>

        {/* Right Side: AI Assistant & Laboratory Reports */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col h-1/4 lg:h-full overflow-hidden shadow-2xl z-20">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
                activeTab === 'analysis'
                ? 'bg-white border-slate-200 text-slate-800 shadow-xs font-black'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Info className="w-4 h-4" /> Báo cáo
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border relative ${
                activeTab === 'tasks'
                ? 'bg-white border-slate-200 text-slate-800 shadow-xs font-black'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Award className="w-4 h-4" /> Thử thách
              {/* Completed tasks badge */}
              {Object.keys(completedTasks).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {Object.keys(completedTasks).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
                activeTab === 'quiz'
                ? 'bg-white border-slate-200 text-slate-800 shadow-xs font-black'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" /> Ôn tập
            </button>
          </div>

          {/* Tab Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/50">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Physics Engine Real-Time Analysis Report */}
              {activeTab === 'analysis' && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-5"
                >
                  {/* Selected Item Control Panel */}
                  {(() => {
                    const info = getSelectedCompInfo();
                    if (!info) return null;

                    return (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                            <h4 className="font-black text-xs uppercase tracking-wider text-amber-800">Đang chọn: {info.name}</h4>
                          </div>
                          <button
                            onClick={() => {
                              if (info.type === 'wire') {
                                deleteWire(info.id);
                                setSelectedCompId(null);
                              } else {
                                deleteComponent(info.id);
                              }
                            }}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-wider shadow-xs hover:scale-102 active:scale-98 cursor-pointer"
                            title="Xóa bỏ"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Gỡ bỏ
                          </button>
                        </div>
                        
                        <p className="text-slate-600 text-xs leading-relaxed font-medium">
                          {info.details}
                        </p>

                        {/* If it's a battery, show slider in side panel for extreme ease of use */}
                        {info.type === 'component' && info.comp?.type === 'battery' && (
                          <div className="space-y-2 bg-white/60 p-3 rounded-xl border border-slate-200/50">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                              <span>Hiệu điện thế:</span>
                              <span className="text-amber-600 font-mono text-xs">{info.comp.v?.toFixed(1)} V</span>
                            </div>
                            <input
                              type="range"
                              min="1.5"
                              max="24"
                              step="1.5"
                              value={info.comp.v || 9}
                              onChange={(e) => handleBatteryVoltsChange(info.id, parseFloat(e.target.value))}
                              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                          </div>
                        )}

                        {/* If it's a variable resistor, show slider in side panel */}
                        {info.type === 'component' && info.comp?.type === 'potentiometer' && (
                          <div className="space-y-2 bg-white/60 p-3 rounded-xl border border-slate-200/50">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                              <span>Điện trở:</span>
                              <span className="text-yellow-600 font-mono text-xs">{info.comp.potValue?.toFixed(1)} Ω</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="100"
                              step="0.5"
                              value={info.comp.potValue || 10}
                              onChange={(e) => handlePotValueChange(info.id, parseFloat(e.target.value))}
                              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                          </div>
                        )}

                        {/* If it's a switch, show toggle in side panel */}
                        {info.type === 'component' && info.comp?.type === 'switch' && (
                          <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-slate-200/50">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Trạng thái công tắc:</span>
                            <button
                              onClick={() => toggleSwitch(info.id)}
                              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                                info.comp.isClosed
                                ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              {info.comp.isClosed ? 'Đang Đóng' : 'Đang Ngắt'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {/* Status Indicator */}
                  {solvedResults.isShortCircuit ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 space-y-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                        <h4 className="font-black text-sm uppercase tracking-wider">Cảnh Báo Đoản Mạch!</h4>
                      </div>
                      <p className="text-rose-600 text-xs leading-relaxed font-medium">
                        Điện trở toàn mạch quá nhỏ làm cường độ dòng điện tăng vọt mất kiểm soát. Để bảo vệ nguồn điện khỏi cháy nổ, hệ thống đã kích hoạt cơ chế bảo vệ khẩn cấp! Hãy ngắt nguồn ngay!
                      </p>
                    </div>
                  ) : !solvedResults.isClosedCircuit ? (
                    <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 space-y-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-slate-500" />
                        <h4 className="font-black text-sm uppercase tracking-wider text-slate-700">Trạng Thái: Mạch Hở</h4>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Mạch chưa được khép kín hoặc công tắc đang mở. Hãy đảm bảo dòng điện có thể chạy một vòng khép kín từ cực dương của nguồn điện về cực âm.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 space-y-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 animate-pulse" />
                        <h4 className="font-black text-sm uppercase tracking-wider">Mạch Kín Hoạt Động</h4>
                      </div>
                      <p className="text-emerald-600 text-xs leading-relaxed font-medium">
                        Dòng điện đang lưu thông ổn định trong mạch kín! Trực quan các hạt Electron đang chạy theo đúng định luật Ôm và định luật Kirchoff.
                      </p>
                    </div>
                  )}

                  {/* AI Lab Analyst Explanation */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
                    <h4 className="text-xs font-black uppercase text-amber-600 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Trợ lý Phòng Thí Nghiệm AI:
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium italic">
                      {solvedResults.isShortCircuit
                        ? '"Đoản mạch rồi học sinh ơi! Hiện tượng này xảy ra khi dòng điện đi tắt mà không qua các thiết bị tiêu thụ như bóng đèn. Bạn hãy kiểm tra lại dây nối xem có bị cắm tắt qua cực Pin không nhé!"'
                        : !solvedResults.isClosedCircuit
                        ? '"Mạch điện của bạn đang bị hở. Hãy kiểm tra các công tắc điện đã được chuyển sang ĐÓNG chưa, hoặc có mối dây nối nào bị đứt hở không nhé."'
                        : '"Tuyệt vời! Dòng điện lưu thông rất chuẩn xác. Nếu bạn sử dụng Biến trở, hãy thử thay đổi con chạy để xem ampe kế đo dòng điện tăng giảm thế nào nhé!"'}
                    </p>
                  </div>

                  {/* Electrical Parameters Table */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Thông số đo đạc thời gian thực:</h5>
                    
                    {components.filter(c => c.type !== 'battery' && c.type !== 'switch').length === 0 ? (
                      <p className="text-slate-400 text-xs italic">Chưa có linh kiện tiêu thụ điện nào trên bàn...</p>
                    ) : (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-[9px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                              <th className="p-3">Linh kiện</th>
                              <th className="p-3">Hiệu thế V (V)</th>
                              <th className="p-3">Dòng điện I (A)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {components
                              .filter(c => c.type !== 'battery' && c.type !== 'switch')
                              .map(c => {
                                const vDrop = solvedResults.voltageDrops[c.id] || 0;
                                const iVal = currents[c.id] || 0;
                                return (
                                  <tr key={c.id} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-bold text-slate-800">{c.name}</td>
                                    <td className="p-3 font-mono text-cyan-600 font-bold">{Math.abs(vDrop).toFixed(2)} V</td>
                                    <td className="p-3 font-mono text-amber-600 font-bold">{Math.abs(iVal).toFixed(2)} A</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Interactive Practical Challenges */}
              {activeTab === 'tasks' && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex justify-between items-center shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Nhiệm vụ hoàn thành:</span>
                    <span className="text-sm font-black text-amber-500">
                      ⭐ {Object.keys(completedTasks).length} / {LAB_TASKS.length}
                    </span>
                  </div>

                  {LAB_TASKS.map((task, idx) => {
                    const isActive = idx === currentTaskIndex;
                    const isCompleted = completedTasks[task.id];
                    
                    return (
                      <div
                        key={task.id}
                        onClick={() => setCurrentTaskIndex(idx)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                          isActive
                          ? 'bg-white border-yellow-400 shadow-md scale-102'
                          : isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200 opacity-80 hover:opacity-100'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-black uppercase tracking-wide ${isCompleted ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {task.title}
                          </h4>
                          {isCompleted && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Đạt</span>
                          )}
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed mt-2.5 font-medium">
                          {task.description}
                        </p>
                        
                        {isActive && (
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                            <span className="text-[9px] font-black uppercase tracking-wider text-yellow-600 block">💡 Gợi ý thực hành:</span>
                            <p className="text-slate-500 text-xs leading-relaxed italic">
                              "{task.hint}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* Tab 3: Interactive Science Quiz */}
              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex justify-between items-center shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Điểm số lý thuyết:</span>
                    <span className="text-sm font-black text-purple-600">{quizScore} XP ⭐</span>
                  </div>

                  {/* Quiz Block */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-purple-500">Câu hỏi ôn tập:</span>
                    </div>
                    <h3 className="text-slate-800 font-extrabold leading-snug text-sm sm:text-base">
                      "{QUIZ_QUESTIONS[currentQuizIndex].q}"
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5 pt-2">
                      {QUIZ_QUESTIONS[currentQuizIndex].opts.map((opt, idx) => {
                        const isCorrect = opt === QUIZ_QUESTIONS[currentQuizIndex].ans;
                        let btnStyle = "bg-white border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 text-slate-700";
                        
                        if (quizAnswered) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-xs";
                          } else {
                            btnStyle = "bg-slate-50 border-slate-100 text-slate-400";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={quizAnswered}
                            onClick={() => handleQuizAnswer(opt)}
                            className={`w-full p-4 rounded-xl border text-left transition-all text-xs font-bold ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quiz Feedback */}
                  {quizAnswered && quizFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm"
                    >
                      <p className="text-slate-600 text-xs leading-relaxed italic">
                        "{quizFeedback}"
                      </p>
                      <button
                        onClick={nextQuiz}
                        className="w-full py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Câu tiếp theo
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
