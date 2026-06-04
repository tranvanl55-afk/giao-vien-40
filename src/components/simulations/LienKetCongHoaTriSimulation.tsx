import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Float, Billboard } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RefreshCw, CheckCircle2, ChevronRight, Atom as AtomIcon, BrainCircuit, Maximize, Minimize, Link as LinkIcon } from 'lucide-react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// --- DATA DEFINITIONS ---
const ELEMENTS: Record<string, any> = {
  'H': { id: 'H', symbol: 'H', name: 'Hydrogen', color: '#ff7777', configPre: [1], charge: '', valency: 1 },
  'C': { id: 'C', symbol: 'C', name: 'Carbon', color: '#999999', configPre: [2, 4], charge: '', valency: 4 },
  'N': { id: 'N', symbol: 'N', name: 'Nitrogen', color: '#0044ff', configPre: [2, 5], charge: '', valency: 3 },
  'O': { id: 'O', symbol: 'O', name: 'Oxygen', color: '#00aaff', configPre: [2, 6], charge: '', valency: 2 },
  'Cl': { id: 'Cl', symbol: 'Cl', name: 'Chlorine', color: '#00ccaa', configPre: [2, 8, 7], charge: '', valency: 1 },
};

const MOLECULES = [
  { id: 'H2', name: 'Khí Hydrogen', formula: 'H2', type: 'Đơn chất', atoms: ['H', 'H'], bonds: 1 },
  { id: 'O2', name: 'Khí Oxygen', formula: 'O2', type: 'Đơn chất', atoms: ['O', 'O'], bonds: 2 },
  { id: 'N2', name: 'Khí Nitrogen', formula: 'N2', type: 'Đơn chất', atoms: ['N', 'N'], bonds: 3 },
  { id: 'Cl2', name: 'Khí Chlorine', formula: 'Cl2', type: 'Đơn chất', atoms: ['Cl', 'Cl'], bonds: 1 },
  { id: 'HCl', name: 'Hydrogen Chloride', formula: 'HCl', type: 'Hợp chất', atoms: ['H', 'Cl'], bonds: 1 },
  { id: 'H2O', name: 'Nước', formula: 'H2O', type: 'Hợp chất', atoms: ['H', 'O', 'H'], bonds: 1 },
  { id: 'CO2', name: 'Carbon dioxide', formula: 'CO2', type: 'Hợp chất', atoms: ['O', 'C', 'O'], bonds: 2 },
  { id: 'NH3', name: 'Ammonia', formula: 'NH3', type: 'Hợp chất', atoms: ['H', 'H', 'H', 'N'], bonds: 1 },
  { id: 'CH4', name: 'Methane', formula: 'CH4', type: 'Hợp chất', atoms: ['H', 'H', 'H', 'H', 'C'], bonds: 1 },
];

const QUIZ_QUESTIONS = [
  {
    question: "Liên kết cộng hóa trị được hình thành bởi:",
    options: ["Sự nhường và nhận electron", "Sự dùng chung một hay nhiều cặp electron", "Lực hút tĩnh điện giữa các ion", "Đám mây electron tự do"],
    answer: 1
  },
  {
    question: "Trong phân tử Oxygen (O2), hai nguyên tử O liên kết với nhau bằng:",
    options: ["1 cặp electron dùng chung (liên kết đơn)", "2 cặp electron dùng chung (liên kết đôi)", "3 cặp electron dùng chung (liên kết ba)", "Lực hút tĩnh điện"],
    answer: 1
  },
  {
    question: "Nguyên tử Hydrogen (H) cần bao nhiêu electron để đạt cấu hình bền vững của khí hiếm Helium?",
    options: ["1 electron", "2 electron", "7 electron", "8 electron"],
    answer: 0
  },
  {
    question: "Phân tử nào sau đây có liên kết cộng hóa trị phân cực mạnh?",
    options: ["H2", "O2", "Cl2", "H2O"],
    answer: 3
  },
  {
    question: "Số cặp electron dùng chung trong phân tử Methane (CH4) là bao nhiêu?",
    options: ["1 cặp", "2 cặp", "3 cặp", "4 cặp"],
    answer: 3
  }
];

// --- 3D COMPONENTS ---

const getAngle = (shellIdx: number, eIdx: number, totalSlots: number) => {
  return (eIdx / totalSlots) * Math.PI * 2;
};

const SharedElectrons = ({ position, color1, color2, count }: any) => {
  // E góp chung: nổi bật bằng màu vàng (đặc trưng) khác hẳn e bình thường
  return (
    <group position={position}>
      {Array.from({ length: count }).map((_, i) => {
        // Xếp các cặp electron song song với nhau nếu có nhiều cặp (liên kết đôi, ba)
        const xOffset = (i - (count - 1) / 2) * 0.6;
        return (
          <group key={i} position={[xOffset, 0, 0]}>
            {/* Cặp e góp chung: được đặt vuông góc với trục liên kết (trục Y cục bộ) */}
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.2} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.2} />
            </mesh>
            {/* Ánh sáng */}
            <pointLight position={[0, 0, 0]} distance={2.5} intensity={1.5} color="#facc15" />
          </group>
        );
      })}
    </group>
  );
};

const AtomCovalent = ({ 
  position, base, electrons, sharedBonds, isBonded = false, scale = 1, opacity = 1, rotation = [0,0,0]
}: any) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    // Nếu chưa liên kết thì tự xoay để tạo cảm giác sống động
    if (groupRef.current && !isBonded) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.z += 0.002;
    }
  });

  const atomicNumber = base.configPre.reduce((sum: number, cur: number) => sum + cur, 0);

  return (
    <group position={position} scale={scale} rotation={rotation as any} ref={groupRef}>
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial 
          color={base.color} 
          emissive={base.color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </Sphere>

      <Html center className="pointer-events-none z-10">
        <div className="text-white font-black text-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5)' }}>
          +{atomicNumber}
        </div>
      </Html>

      {electrons.map((shellCount: number, shellIdx: number) => {
        const radius = 1.5 + shellIdx * 0.8;
        const maxSlots = shellIdx === 0 ? 2 : 8;
        
        // Vẽ Đám mây electron (quỹ đạo 3 chiều) thay vì 1 vòng mỏng
        // Để dù nhìn góc nào cũng thấy quỹ đạo và sự xen phủ
        return (
          <group key={shellIdx}>
            <mesh rotation={[Math.PI/2, 0, 0]}>
              <ringGeometry args={[radius - 0.04, radius + 0.04, 64]} />
              <meshBasicMaterial color="#64748b" transparent opacity={0.4 * opacity} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[0, Math.PI/2, 0]}>
              <ringGeometry args={[radius - 0.04, radius + 0.04, 64]} />
              <meshBasicMaterial color="#64748b" transparent opacity={0.2 * opacity} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <ringGeometry args={[radius - 0.04, radius + 0.04, 64]} />
              <meshBasicMaterial color="#64748b" transparent opacity={0.2 * opacity} side={THREE.DoubleSide} />
            </mesh>
            
            {/* Lớp màng mờ (đám mây) đã bị xóa theo yêu cầu */}

            {/* Native Electrons — màu trắng/xám trung tính */}
            {Array.from({ length: maxSlots }).map((_, slotIdx) => {
              const shared = sharedBonds?.find((sb: any) => sb.shell === shellIdx && sb.slot === slotIdx);
              if (shared && isBonded) return null;

              if (slotIdx >= shellCount && !shared) return null;

              const angle = getAngle(shellIdx, slotIdx, maxSlots);
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              
              return (
                <Float key={`nat-${slotIdx}`} speed={2} rotationIntensity={0} floatIntensity={0}>
                  <mesh position={[x, 0, z]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color="#e2e8f0" emissive="#94a3b8" emissiveIntensity={0.4} transparent={opacity < 1} opacity={opacity} />
                  </mesh>
                </Float>
              );
            })}
          </group>
        );
      })}

      <Html
        position={[0, -2.8 - electrons.length * 0.5, 0]}
        center
        className="pointer-events-none flex flex-col items-center transition-all duration-500"
      >
        <div className="text-indigo-950 text-3xl font-black drop-shadow-sm opacity-90">
          {base.symbol}
        </div>
      </Html>
    </group>
  );
};

const Scene = ({ phase, scenario, progress }: any) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#00aaff" />
      <gridHelper args={[30, 30, '#cbd5e1', '#f1f5f9']} position={[0, -4.5, 0]} />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} height={300} intensity={1.2} />
      </EffectComposer>

      {scenario.atoms.map((atom: any, i: number) => {
        // Interpolate position based on phase and progress
        let posX = atom.xInit;
        let posY = atom.yInit;
        let posZ = atom.zInit;

        if (phase === 1) {
          posX = atom.xInit + (atom.xBond - atom.xInit) * progress;
          posY = atom.yInit + (atom.yBond - atom.yInit) * progress;
          posZ = atom.zInit + (atom.zBond - atom.zInit) * progress;
        } else if (phase >= 2) {
          posX = atom.xBond;
          posY = atom.yBond;
          posZ = atom.zBond;
        }

        return (
          <AtomCovalent 
            key={atom.id}
            position={[posX, posY, posZ]} 
            rotation={atom.rotation}
            base={atom.base}
            electrons={atom.base.configPre}
            sharedBonds={atom.sharedBonds}
            isBonded={phase >= 2}
            opacity={1}
          />
        );
      })}

      {/* Render Shared Electrons when bonded */}
      {phase >= 2 && scenario.bonds.map((bond: any, idx: number) => {
        // Only show full opacity when progress is complete in phase 2, or in phase 3
        const bondScale = phase === 2 ? progress : 1;
        
        return (
          <group key={`bond-${idx}`} position={bond.position} scale={bondScale} rotation={bond.rotation}>
            <SharedElectrons 
              count={bond.count}
              color1={bond.color1}
              color2={bond.color2}
            />
          </group>
        );
      })}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

// --- LOGIC BUILDER ---
function buildScenario(molId: string) {
  const atoms = [];
  const bonds = [];
  const getR = (conf: number[]) => 1.5 + (conf.length - 1) * 0.8;

  if (molId === 'H2' || molId === 'Cl2' || molId === 'O2' || molId === 'N2' || molId === 'HCl') {
    const isH2 = molId === 'H2';
    const isCl2 = molId === 'Cl2';
    const isO2 = molId === 'O2';
    const isN2 = molId === 'N2';
    const isHCl = molId === 'HCl';

    const base1 = isHCl ? ELEMENTS['H'] : ELEMENTS[molId.charAt(0)];
    const base2 = isHCl ? ELEMENTS['Cl'] : ELEMENTS[molId.charAt(0)];
    
    let pairs = 1;
    if (isO2) pairs = 2;
    if (isN2) pairs = 3;

    const r1 = getR(base1.configPre);
    const r2 = getR(base2.configPre);
    // Bond distance is exactly the sum of outer radii minus an overlap factor
    const bondDist = r1 + r2 - 0.4;

    const shared1 = [];
    const shared2 = [];
    for (let i = 0; i < pairs; i++) {
       shared1.push({ shell: base1.configPre.length - 1, slot: i });
       shared2.push({ shell: base2.configPre.length - 1, slot: i });
    }

    atoms.push({
      id: 'a1', base: base1, 
      xInit: -4, yInit: 0, zInit: 0,
      xBond: -bondDist / 2, yBond: 0, zBond: 0,
      rotation: [0, 0, 0],
      sharedBonds: shared1
    });

    atoms.push({
      id: 'a2', base: base2, 
      xInit: 4, yInit: 0, zInit: 0,
      xBond: bondDist / 2, yBond: 0, zBond: 0,
      rotation: [0, 0, 0],
      sharedBonds: shared2
    });

    bonds.push({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      count: pairs,
      color1: base1.color,
      color2: base2.color
    });
  } else if (molId === 'H2O') {
    const o = ELEMENTS['O'];
    const h = ELEMENTS['H'];
    const rO = getR(o.configPre);
    const rH = getR(h.configPre);
    const bondDist = rO + rH - 0.4;
    const angle = 104.5 * (Math.PI / 180);

    atoms.push({
      id: 'center', base: o, 
      xInit: 0, yInit: 0, zInit: 0,
      xBond: 0, yBond: 0, zBond: 0,
      rotation: [0, 0, 0],
      sharedBonds: [
        { shell: 1, slot: 2 },
        { shell: 1, slot: 6 }
      ]
    });

    atoms.push({
      id: 'h1', base: h, 
      xInit: -5, yInit: -3, zInit: 0,
      xBond: -Math.sin(angle/2) * bondDist, yBond: -Math.cos(angle/2) * bondDist, zBond: 0,
      rotation: [0, 0, -angle/2],
      sharedBonds: [{ shell: 0, slot: 0 }]
    });

    atoms.push({
      id: 'h2', base: h, 
      xInit: 5, yInit: -3, zInit: 0,
      xBond: Math.sin(angle/2) * bondDist, yBond: -Math.cos(angle/2) * bondDist, zBond: 0,
      rotation: [0, 0, angle/2],
      sharedBonds: [{ shell: 0, slot: 0 }]
    });

    bonds.push({
      position: [-Math.sin(angle/2) * rO, -Math.cos(angle/2) * rO, 0],
      rotation: [0, 0, angle/2],
      count: 1, color1: o.color, color2: h.color
    });
    bonds.push({
      position: [Math.sin(angle/2) * rO, -Math.cos(angle/2) * rO, 0],
      rotation: [0, 0, -angle/2],
      count: 1, color1: o.color, color2: h.color
    });
  } else if (molId === 'CO2') {
    const c = ELEMENTS['C'];
    const o = ELEMENTS['O'];
    const rC = getR(c.configPre);
    const rO = getR(o.configPre);
    const bondDist = rC + rO - 0.4;

    atoms.push({
      id: 'center', base: c, xInit: 0, yInit: 0, zInit: 0, xBond: 0, yBond: 0, zBond: 0, rotation: [0, 0, 0],
      sharedBonds: [{ shell: 1, slot: 0 }, { shell: 1, slot: 1 }, { shell: 1, slot: 2 }, { shell: 1, slot: 3 }]
    });
    atoms.push({
      id: 'o1', base: o, xInit: -6, yInit: 0, zInit: 0, xBond: -bondDist, yBond: 0, zBond: 0, rotation: [0, 0, 0],
      sharedBonds: [{ shell: 1, slot: 0 }, { shell: 1, slot: 1 }]
    });
    atoms.push({
      id: 'o2', base: o, xInit: 6, yInit: 0, zInit: 0, xBond: bondDist, yBond: 0, zBond: 0, rotation: [0, 0, 0],
      sharedBonds: [{ shell: 1, slot: 0 }, { shell: 1, slot: 1 }]
    });

    bonds.push({ position: [-rC, 0, 0], rotation: [0, 0, 0], count: 2, color1: c.color, color2: o.color });
    bonds.push({ position: [rC, 0, 0], rotation: [0, 0, 0], count: 2, color1: c.color, color2: o.color });
  } else if (molId === 'NH3') {
    const n = ELEMENTS['N'];
    const h = ELEMENTS['H'];
    const rN = getR(n.configPre);
    const rH = getR(h.configPre);
    const bondDist = rN + rH - 0.4;
    
    atoms.push({ id: 'center', base: n, xInit: 0, yInit: 0, zInit: 0, xBond: 0, yBond: 0, zBond: 0, rotation: [0, 0, 0], 
      sharedBonds: [{ shell: 1, slot: 0 }, { shell: 1, slot: 1 }, { shell: 1, slot: 2 }] 
    });
    
    // 3 H atoms in a trigonal pyramid shape (simplified to 2D-ish for clarity in orbits)
    atoms.push({ id: 'h1', base: h, xInit: -5, yInit: -4, zInit: 0, xBond: -bondDist*0.866, yBond: -bondDist*0.5, zBond: 0, rotation: [0, 0, 0], sharedBonds: [{ shell: 0, slot: 0 }] });
    atoms.push({ id: 'h2', base: h, xInit: 5, yInit: -4, zInit: 0, xBond: bondDist*0.866, yBond: -bondDist*0.5, zBond: 0, rotation: [0, 0, 0], sharedBonds: [{ shell: 0, slot: 0 }] });
    atoms.push({ id: 'h3', base: h, xInit: 0, yInit: -6, zInit: 0, xBond: 0, yBond: -bondDist, zBond: 0, rotation: [0, 0, 0], sharedBonds: [{ shell: 0, slot: 0 }] });

    bonds.push({ position: [-rN*0.866, -rN*0.5, 0], rotation: [0, 0, Math.PI/3], count: 1, color1: n.color, color2: h.color });
    bonds.push({ position: [rN*0.866, -rN*0.5, 0], rotation: [0, 0, -Math.PI/3], count: 1, color1: n.color, color2: h.color });
    bonds.push({ position: [0, -rN, 0], rotation: [0, 0, Math.PI/2], count: 1, color1: n.color, color2: h.color });
  } else if (molId === 'CH4') {
    const c = ELEMENTS['C'];
    const h = ELEMENTS['H'];
    const rC = getR(c.configPre);
    const rH = getR(h.configPre);
    const bondDist = rC + rH - 0.4;
    
    atoms.push({ id: 'center', base: c, xInit: 0, yInit: 0, zInit: 0, xBond: 0, yBond: 0, zBond: 0, rotation: [0, 0, 0],
      sharedBonds: [{ shell: 1, slot: 0 }, { shell: 1, slot: 1 }, { shell: 1, slot: 2 }, { shell: 1, slot: 3 }] 
    });
    
    // 4 H atoms in a cross shape for 2D clarity
    atoms.push({ id: 'h1', base: h, xInit: 0, yInit: 6, zInit: 0, xBond: 0, yBond: bondDist, zBond: 0, rotation: [0, 0, 0], sharedBonds: [{ shell: 0, slot: 0 }] });
    atoms.push({ id: 'h2', base: h, xInit: 6, yInit: 0, zInit: 0, xBond: bondDist, yBond: 0, zBond: 0, rotation: [0, 0, 0], sharedBonds: [{ shell: 0, slot: 0 }] });
    atoms.push({ id: 'h3', base: h, xInit: 0, yInit: -6, zInit: 0, xBond: 0, yBond: -bondDist, zBond: 0, rotation: [0, 0, 0], sharedBonds: [{ shell: 0, slot: 0 }] });
    atoms.push({ id: 'h4', base: h, xInit: -6, yInit: 0, zInit: 0, xBond: -bondDist, yBond: 0, zBond: 0, rotation: [0, 0, 0], sharedBonds: [{ shell: 0, slot: 0 }] });

    bonds.push({ position: [0, rC, 0], rotation: [0, 0, Math.PI/2], count: 1, color1: c.color, color2: h.color });
    bonds.push({ position: [rC, 0, 0], rotation: [0, 0, 0], count: 1, color1: c.color, color2: h.color });
    bonds.push({ position: [0, -rC, 0], rotation: [0, 0, Math.PI/2], count: 1, color1: c.color, color2: h.color });
    bonds.push({ position: [-rC, 0, 0], rotation: [0, 0, 0], count: 1, color1: c.color, color2: h.color });
  }

  return { atoms, bonds };
}

// --- MAIN COMPONENT ---
export function LienKetCongHoaTriSimulation({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'simulation' | 'quiz'>('simulation');
  
  const [step, setStep] = useState<'selection' | 'simulating'>('selection');
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Fullscreen State
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const selectedMolecule = MOLECULES.find(m => m.id === selectedMoleculeId);
  const scenario = useMemo(() => {
    if (selectedMoleculeId) return buildScenario(selectedMoleculeId);
    return null;
  }, [selectedMoleculeId]);

  const handleNextPhase = () => {
    if (phase === 0) {
      setPhase(1);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            clearInterval(interval);
            setTimeout(() => {
              setPhase(2);
              setProgress(0);
              // Phase 2: Fade in shared electrons
              const fadeInterval = setInterval(() => {
                setProgress(fp => {
                  if (fp >= 1) {
                    clearInterval(fadeInterval);
                    setTimeout(() => setPhase(3), 500);
                    return 1;
                  }
                  return fp + 0.05;
                });
              }, 50);
            }, 300);
            return 1;
          }
          return p + 0.02;
        });
      }, 30);
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === QUIZ_QUESTIONS[currentQuestion].answer) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-khtn8-pastel flex flex-col relative overflow-hidden font-sans text-slate-800 animate-fadeIn">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-cyan-600 transition-all border border-slate-200/50 shadow-xs">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase font-heading">
            <LinkIcon className="w-6 h-6 text-blue-500 animate-pulse" /> Liên Kết Cộng Hóa Trị 3D
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 shadow-xs">
            <button 
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'simulation' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Mô Phỏng
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-purple-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Luyện Tập
            </button>
          </div>
          <button 
            onClick={toggleFullscreen} 
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all border border-slate-200/50 shadow-xs"
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {activeTab === 'simulation' && step === 'selection' && (
        <div className="flex-1 mt-20 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-800 uppercase font-heading">Chọn Phân Tử Mô Phỏng</h2>
              <p className="text-slate-600 font-medium">Khám phá sự xen phủ lớp vỏ electron và cách các nguyên tử dùng chung electron.</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-8 shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MOLECULES.map(mol => (
                  <button
                    key={mol.id}
                    onClick={() => {
                      setSelectedMoleculeId(mol.id);
                      setStep('simulating');
                      setPhase(0);
                      setProgress(0);
                    }}
                    className="p-6 rounded-xl border-2 text-center transition-all duration-200 border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-lg group flex flex-col items-center justify-center gap-3"
                  >
                    <div className="text-4xl font-black text-slate-800 font-heading tracking-widest group-hover:text-blue-600 transition-colors">
                      {mol.formula.replace(/(\d+)/g, '<sub>$1</sub>').split('<sub>').map((part, i) => {
                        if (i === 0) return part;
                        const sub = part.split('</sub>');
                        return <React.Fragment key={i}><sub>{sub[0]}</sub>{sub[1]}</React.Fragment>;
                      })}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">{mol.name}</div>
                    <div className="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-600 rounded uppercase tracking-wider">{mol.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulation' && step === 'simulating' && selectedMolecule && scenario && (
        <div className="flex-1 w-full relative mt-16">
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
            <Scene phase={phase} scenario={scenario} progress={progress} />
          </Canvas>
          
          {/* Overlay Info - Moved to bottom */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 px-8 py-3 rounded-full text-slate-800 font-black text-xl flex items-center gap-3 shadow-md">
              Phân tử: <span className="text-blue-600 text-3xl font-heading font-black">
                {selectedMolecule.formula.replace(/(\d+)/g, '<sub>$1</sub>').split('<sub>').map((part, i) => {
                  if (i === 0) return part;
                  const sub = part.split('</sub>');
                  return <React.Fragment key={i}><sub>{sub[0]}</sub>{sub[1]}</React.Fragment>;
                })}
              </span>
            </div>
          </div>

          {/* Stepper info */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 pointer-events-none">
            <motion.div 
              key={phase}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-6 text-center shadow-lg text-slate-800"
            >
              {phase === 0 && (
                <>
                  <h3 className="text-xl font-black text-slate-800 mb-2 font-heading">Bước 1: Trạng thái ban đầu</h3>
                  <p className="text-slate-600 text-base font-semibold">Các nguyên tử rời rạc chưa đạt được cấu hình electron bền vững của khí hiếm. <br/>(Chú ý số lượng electron ở lớp vỏ ngoài cùng)</p>
                </>
              )}
              {phase === 1 && (
                <>
                  <h3 className="text-xl font-black text-blue-600 mb-2 font-heading">Bước 2: Tiến lại gần nhau</h3>
                  <p className="text-slate-600 text-base font-semibold">Các nguyên tử di chuyển lại gần nhau để lớp vỏ electron ngoài cùng có thể xen phủ, chuẩn bị góp chung electron.</p>
                </>
              )}
              {phase === 2 && (
                <>
                  <h3 className="text-xl font-black text-orange-600 mb-2 font-heading">Bước 3: Dùng chung Electron</h3>
                  <p className="text-slate-600 text-base font-semibold">Sự xen phủ xảy ra. Các electron độc thân ghép đôi tạo thành các cặp electron dùng chung thuộc về cả hai nguyên tử.</p>
                </>
              )}
              {phase === 3 && (
                <>
                  <h3 className="text-xl font-black text-emerald-600 mb-2 flex items-center justify-center gap-2 font-heading">
                    <CheckCircle2 className="w-6 h-6 animate-pulse" /> Bước 4: Hoàn thành Liên kết Cộng hóa trị
                  </h3>
                  <p className="text-slate-600 text-base font-semibold">Nhờ các cặp electron dùng chung, mỗi nguyên tử đều đạt cấu hình bền vững của khí hiếm (VD: 8e ngoài cùng). Phân tử được hình thành bền vững.</p>
                </>
              )}
            </motion.div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 p-6 flex justify-center gap-6 shadow-xl">
            <button 
              onClick={() => { setStep('selection'); setPhase(0); setSelectedMoleculeId(null); }}
              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all border border-slate-200 shadow-xs"
            >
              Chọn lại phân tử
            </button>
            
            {phase === 0 && (
              <button onClick={handleNextPhase} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all text-base shadow-md active:scale-95">
                Tiến hành mô phỏng <ChevronRight className="w-6 h-6" />
              </button>
            )}
            {phase === 3 && (
              <button onClick={() => setPhase(0)} className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl flex items-center gap-2 transition-all text-base border border-slate-200 shadow-xs">
                <RefreshCw className="w-6 h-6" /> Xem lại
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="flex-1 mt-16 p-8 overflow-y-auto flex items-center justify-center">
          <div className="max-w-2xl w-full">
            {!showResult ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg text-slate-800">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <div className="text-blue-600 font-black flex items-center gap-2 text-lg font-heading">
                    <BrainCircuit className="w-6 h-6 animate-pulse" /> Trắc nghiệm Liên kết Cộng hóa trị
                  </div>
                  <div className="bg-slate-100 px-4 py-1.5 rounded-full text-xs font-extrabold text-slate-500 border border-slate-200/50">
                    Câu {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-8 leading-snug">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </h3>
                
                <div className="space-y-3">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[currentQuestion].answer;
                    let btnClass = "bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-700 font-semibold";
                    
                    if (selectedAnswer !== null) {
                      if (isCorrect) btnClass = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-xs";
                      else if (isSelected) btnClass = "bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-xs";
                      else btnClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedAnswer !== null}
                        onClick={() => handleQuizAnswer(idx)}
                        className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${btnClass}`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-lg text-slate-800">
                <div className="w-24 h-24 bg-linear-to-tr from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase font-heading">Hoàn thành!</h2>
                <p className="text-lg text-slate-600 font-medium mb-8">Bạn đã trả lời đúng <b className="text-emerald-600 text-2xl font-black">{score}/{QUIZ_QUESTIONS.length}</b> câu hỏi.</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => { setCurrentQuestion(0); setScore(0); setShowResult(false); }}
                    className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all border border-slate-200 shadow-xs"
                  >
                    Làm lại
                  </button>
                  <button 
                    onClick={() => setActiveTab('simulation')}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Về Mô Phỏng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
