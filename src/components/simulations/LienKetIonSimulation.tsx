import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Sphere, Trail, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RefreshCw, CheckCircle2, ChevronRight, Beaker, Atom as AtomIcon, Target, BrainCircuit, Maximize, Minimize } from 'lucide-react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// --- DATA DEFINITIONS ---
const METALS = [
  { id: 'Li', symbol: 'Li', name: 'Lithium', color: '#ff66aa', configPre: [2, 1], configPost: [2], charge: '+', valency: 1 },
  { id: 'Na', symbol: 'Na', name: 'Sodium (Natri)', color: '#ffaa00', configPre: [2, 8, 1], configPost: [2, 8], charge: '+', valency: 1 },
  { id: 'K', symbol: 'K', name: 'Potassium (Kali)', color: '#ff8800', configPre: [2, 8, 8, 1], configPost: [2, 8, 8], charge: '+', valency: 1 },
  { id: 'Be', symbol: 'Be', name: 'Beryllium', color: '#ff4444', configPre: [2, 2], configPost: [2], charge: '2+', valency: 2 },
  { id: 'Mg', symbol: 'Mg', name: 'Magnesium (Magie)', color: '#ff5500', configPre: [2, 8, 2], configPost: [2, 8], charge: '2+', valency: 2 },
  { id: 'Ca', symbol: 'Ca', name: 'Calcium (Canxi)', color: '#ff3300', configPre: [2, 8, 8, 2], configPost: [2, 8, 8], charge: '2+', valency: 2 },
  { id: 'Al', symbol: 'Al', name: 'Aluminum (Nhôm)', color: '#ffcc00', configPre: [2, 8, 3], configPost: [2, 8], charge: '3+', valency: 3 },
];

const NON_METALS = [
  { id: 'F', symbol: 'F', name: 'Fluorine (Flo)', color: '#00ffaa', configPre: [2, 7], configPost: [2, 8], charge: '-', valency: 1 },
  { id: 'Cl', symbol: 'Cl', name: 'Chlorine (Clo)', color: '#00ccaa', configPre: [2, 8, 7], configPost: [2, 8, 8], charge: '-', valency: 1 },
  { id: 'Br', symbol: 'Br', name: 'Bromine (Brom)', color: '#00aa88', configPre: [2, 8, 18, 7], configPost: [2, 8, 18, 8], charge: '-', valency: 1 },
  { id: 'O', symbol: 'O', name: 'Oxygen (Oxy)', color: '#00aaff', configPre: [2, 6], configPost: [2, 8], charge: '2-', valency: 2 },
  { id: 'S', symbol: 'S', name: 'Sulfur (Lưu huỳnh)', color: '#0088ff', configPre: [2, 8, 6], configPost: [2, 8, 8], charge: '2-', valency: 2 },
  { id: 'N', symbol: 'N', name: 'Nitrogen (Nitơ)', color: '#0044ff', configPre: [2, 5], configPost: [2, 8], charge: '3-', valency: 3 },
  { id: 'P', symbol: 'P', name: 'Phosphorus (Photpho)', color: '#0022cc', configPre: [2, 8, 5], configPost: [2, 8, 8], charge: '3-', valency: 3 },
];

const QUIZ_QUESTIONS = [
  {
    question: "Liên kết ion được hình thành bởi lực hút tĩnh điện giữa:",
    options: ["Các ion mang điện tích trái dấu", "Các ion mang điện tích cùng dấu", "Các electron tự do và ion dương", "Các nguyên tử trung hòa"],
    answer: 0
  },
  {
    question: "Trong hợp chất MgCl2, nguyên tử Magie (Mg) đã:",
    options: ["Nhận 2 electron", "Nhường 2 electron", "Nhường 1 electron", "Góp chung 2 electron"],
    answer: 1
  },
  {
    question: "Nguyên tử Phi kim thường có xu hướng gì khi hình thành liên kết ion?",
    options: ["Nhường electron để trở thành ion dương", "Nhận electron để trở thành ion âm", "Góp chung electron", "Không tham gia phản ứng"],
    answer: 1
  },
  {
    question: "Cấu hình electron của ion Na+ giống với khí hiếm nào sau đây?",
    options: ["Helium (He)", "Neon (Ne)", "Argon (Ar)", "Krypton (Kr)"],
    answer: 1
  }
];

// --- 3D COMPONENTS ---

const getAngle = (shellIdx: number, eIdx: number) => {
  const maxSlots = shellIdx === 0 ? 2 : 8;
  return (eIdx / maxSlots) * Math.PI * 2;
};

const Atom = ({ 
  position, base, electrons, foreign, isIon = false, scale = 1 
}: any) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.z += 0.002;
    }
  });

  const atomicNumber = base.configPre.reduce((sum: number, cur: number) => sum + cur, 0);

  return (
    <group position={position} scale={scale} ref={groupRef}>
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial 
          color={base.color} 
          emissive={base.color}
          emissiveIntensity={isIon ? 2 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      <Html center className="pointer-events-none z-10">
        <div className="text-white font-black text-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5)' }}>
          +{atomicNumber}
        </div>
      </Html>
      
      {isIon && (
        <Sphere args={[1.2, 32, 32]}>
          <meshBasicMaterial color={base.color} transparent opacity={0.2} side={THREE.BackSide} />
        </Sphere>
      )}

      {electrons.map((shellCount: number, shellIdx: number) => {
        const radius = 1.5 + shellIdx * 0.8;
        return (
          <group key={shellIdx}>
            <mesh rotation={[Math.PI/2, 0, 0]}>
              <ringGeometry args={[radius - 0.04, radius + 0.04, 64]} />
              <meshBasicMaterial color="#334155" transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
            
            {/* Native Electrons */}
            {Array.from({ length: shellCount }).map((_, eIdx) => {
              const angle = getAngle(shellIdx, eIdx);
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              
              return (
                <Float key={`nat-${eIdx}`} speed={2} rotationIntensity={0} floatIntensity={0}>
                  <mesh position={[x, 0, z]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color="#00bcd4" emissive="#00bcd4" emissiveIntensity={0.5} />
                  </mesh>
                </Float>
              );
            })}

            {/* Foreign Electrons */}
            {foreign.filter((f: any) => f.shell === shellIdx).map((f: any, i: number) => {
              const angle = getAngle(shellIdx, f.eIdx);
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              return (
                <Float key={`for-${i}`} speed={2} rotationIntensity={0} floatIntensity={0}>
                  <mesh position={[x, 0, z]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={0.8} />
                  </mesh>
                </Float>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

const MovingElectron: React.FC<{ startPos: number[], endPos: number[], progress: number, index: number, color: string }> = ({ startPos, endPos, progress, index, color }) => {
  const ref = useRef<THREE.Mesh>(null);
  const arcDirection = index % 2 === 0 ? 1 : -1;
  const startVec = useMemo(() => new THREE.Vector3(...startPos), [startPos]);
  const endVec = useMemo(() => new THREE.Vector3(...endPos), [endPos]);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.position.lerpVectors(startVec, endVec, progress);
      ref.current.position.y += Math.sin(progress * Math.PI) * 2 * arcDirection;
    }
  });

  return (
    <Trail width={0.5} color={color} length={10} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </Trail>
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
        let electrons = atom.e0;
        if (phase === 1) electrons = atom.e1;
        if (phase >= 2) electrons = atom.e2;

        const posX = phase === 3 ? atom.xBond : atom.xInit;

        return (
          <Atom 
            key={atom.id}
            position={[posX, 0, 0]} 
            base={atom.base}
            electrons={electrons}
            foreign={phase >= 2 ? atom.foreign : []}
            isIon={phase >= 2}
          />
        );
      })}

      {phase === 1 && scenario.transfers.map((t: any, idx: number) => (
        <MovingElectron 
          key={idx} 
          index={idx}
          startPos={t.start} 
          endPos={t.end}
          color={t.color}
          progress={progress} 
        />
      ))}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

// --- LOGIC BUILDER ---
function buildScenario(metal: any, nonMetal: any) {
  const atoms = [];
  const transfers = [];

  let rM = nonMetal.valency;
  let rNM = metal.valency;
  if (rM === 2 && rNM === 2) { rM = 1; rNM = 1; }

  // Helper to calculate exact radius of outer shell
  const getR = (conf: number[]) => 1.5 + (conf.length - 1) * 0.8;
  const bondDist = getR(metal.configPost) + getR(nonMetal.configPre) + 0.4;

  if (rM === 1 && rNM === 1) {
    atoms.push({
      id: 'm0', base: metal, xInit: -4, xBond: -bondDist / 2,
      e0: metal.configPre, e1: metal.configPost, e2: metal.configPost, foreign: []
    });
    
    const foreign = [];
    for (let i = 0; i < metal.valency; i++) {
      foreign.push({ shell: nonMetal.configPre.length - 1, eIdx: nonMetal.configPre[nonMetal.configPre.length - 1] + i, color: metal.color });
    }

    atoms.push({
      id: 'nm0', base: nonMetal, xInit: 4, xBond: bondDist / 2,
      e0: nonMetal.configPre, e1: nonMetal.configPre, e2: nonMetal.configPre,
      foreign
    });
    
    for (let i = 0; i < metal.valency; i++) {
      transfers.push({
        start: [-4 + getR(metal.configPre), 0, 0],
        end: [4 - getR(nonMetal.configPre), 0, 0],
        color: metal.color
      });
    }
  }
  else if (rM === 1 && rNM === 2) { // e.g. MgCl2
    atoms.push({
      id: 'nm0', base: nonMetal, xInit: -8, xBond: -bondDist,
      e0: nonMetal.configPre, e1: nonMetal.configPre, e2: nonMetal.configPre,
      foreign: [{ shell: nonMetal.configPre.length - 1, eIdx: nonMetal.configPre[nonMetal.configPre.length - 1], color: metal.color }]
    });
    atoms.push({
      id: 'm0', base: metal, xInit: 0, xBond: 0,
      e0: metal.configPre, e1: metal.configPost, e2: metal.configPost, foreign: []
    });
    atoms.push({
      id: 'nm1', base: nonMetal, xInit: 8, xBond: bondDist,
      e0: nonMetal.configPre, e1: nonMetal.configPre, e2: nonMetal.configPre,
      foreign: [{ shell: nonMetal.configPre.length - 1, eIdx: nonMetal.configPre[nonMetal.configPre.length - 1], color: metal.color }]
    });

    transfers.push({
      start: [0 - getR(metal.configPre), 0, 0], // moving left
      end: [-8 + getR(nonMetal.configPre), 0, 0],
      color: metal.color
    });
    transfers.push({
      start: [0 + getR(metal.configPre), 0, 0], // moving right
      end: [8 - getR(nonMetal.configPre), 0, 0],
      color: metal.color
    });
  }
  else if (rM === 2 && rNM === 1) { // e.g. Na2O
    atoms.push({
      id: 'm0', base: metal, xInit: -8, xBond: -bondDist,
      e0: metal.configPre, e1: metal.configPost, e2: metal.configPost, foreign: []
    });
    atoms.push({
      id: 'nm0', base: nonMetal, xInit: 0, xBond: 0,
      e0: nonMetal.configPre, e1: nonMetal.configPre, e2: nonMetal.configPre,
      foreign: [
        { shell: nonMetal.configPre.length - 1, eIdx: nonMetal.configPre[nonMetal.configPre.length - 1], color: metal.color },
        { shell: nonMetal.configPre.length - 1, eIdx: nonMetal.configPre[nonMetal.configPre.length - 1] + 1, color: metal.color }
      ]
    });
    atoms.push({
      id: 'm1', base: metal, xInit: 8, xBond: bondDist,
      e0: metal.configPre, e1: metal.configPost, e2: metal.configPost, foreign: []
    });

    transfers.push({
      start: [-8 + getR(metal.configPre), 0, 0], // left to center
      end: [0 - getR(nonMetal.configPre), 0, 0],
      color: metal.color
    });
    transfers.push({
      start: [8 - getR(metal.configPre), 0, 0], // right to center
      end: [0 + getR(nonMetal.configPre), 0, 0],
      color: metal.color
    });
  }

  return { atoms, transfers, rM, rNM };
}

// --- MAIN COMPONENT ---
export function LienKetIonSimulation({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'simulation' | 'quiz'>('simulation');
  
  const [step, setStep] = useState<'selection' | 'simulating'>('selection');
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedNonMetal, setSelectedNonMetal] = useState<string | null>(null);
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

  const metal = METALS.find(m => m.id === selectedMetal);
  const nonMetal = NON_METALS.find(n => n.id === selectedNonMetal);

  const scenario = useMemo(() => {
    if (metal && nonMetal) return buildScenario(metal, nonMetal);
    return null;
  }, [metal, nonMetal]);

  const handleNextPhase = () => {
    if (phase === 0) {
      setPhase(1);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            clearInterval(interval);
            setTimeout(() => setPhase(2), 500);
            return 1;
          }
          return p + 0.02;
        });
      }, 30);
    } else if (phase === 2) {
      setPhase(3);
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
            <AtomIcon className="w-6 h-6 text-cyan-500 animate-pulse" /> Liên Kết Ion 3D
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 shadow-xs">
            <button 
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'simulation' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
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
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-800 uppercase font-heading">Xây Dựng Hợp Chất Ion</h2>
              <p className="text-slate-600 font-medium">Tự do chọn Kim loại và Phi kim để quan sát quá trình hình thành liên kết ion tương ứng.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Metals */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2 font-heading">
                  <AtomIcon className="w-6 h-6 animate-pulse" /> 1. Chọn Kim Loại (Nhường e)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {METALS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMetal(m.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedMetal === m.id ? 'border-orange-500 bg-orange-50/60 shadow-xs' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}`}
                    >
                      <div className="text-2xl font-black text-slate-800 font-heading">{m.symbol}</div>
                      <div className="text-sm text-slate-500 font-medium">{m.name}</div>
                      <div className="mt-2 text-xs font-black text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded border border-orange-100">Hóa trị: {m.valency}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* NonMetals */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-black text-cyan-600 mb-4 flex items-center gap-2 font-heading">
                  <Beaker className="w-6 h-6 animate-pulse" /> 2. Chọn Phi Kim (Nhận e)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {NON_METALS.map(n => (
                    <button
                      key={n.id}
                      onClick={() => setSelectedNonMetal(n.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedNonMetal === n.id ? 'border-cyan-500 bg-cyan-50/60 shadow-xs' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}`}
                    >
                      <div className="text-2xl font-black text-slate-800 font-heading">{n.symbol}</div>
                      <div className="text-sm text-slate-500 font-medium">{n.name}</div>
                      <div className="mt-2 text-xs font-black text-cyan-600 bg-cyan-50 inline-block px-2 py-1 rounded border border-cyan-100">Hóa trị: {n.valency}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button
                disabled={!metal || !nonMetal}
                onClick={() => { setStep('simulating'); setPhase(0); setProgress(0); }}
                className="px-8 py-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black uppercase tracking-wider rounded-2xl text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                Tiến Hành Mô Phỏng <ChevronRight className="w-6 h-6 animate-bounceHorizontal" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulation' && step === 'simulating' && metal && nonMetal && scenario && (
        <div className="flex-1 w-full relative mt-16">
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
            <Scene phase={phase} scenario={scenario} progress={progress} />
          </Canvas>

          {/* Fixed element name labels — không di chuyển theo 3D */}
          <div className="absolute bottom-28 left-0 right-0 z-40 flex justify-around pointer-events-none px-4">
            {scenario.atoms.map((atom: any) => {
              const base = atom.base;
              const isIon = phase >= 2;
              return (
                <div key={atom.id} className="flex flex-col items-center gap-1">
                  <div
                    className="text-2xl font-black flex items-start"
                    style={{ color: base.color, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                  >
                    {base.symbol}
                    {isIon && (
                      <sup className={`text-base ml-0.5 font-black ${base.charge.includes('+') ? 'text-orange-400' : 'text-cyan-400'}`}>
                        {base.charge}
                      </sup>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white/80 whitespace-nowrap bg-black/50 px-2 py-0.5 rounded-full">
                    {base.name.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Overlay Info - Moved to bottom */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 px-8 py-3 rounded-full text-slate-800 font-black text-xl flex items-center gap-3 shadow-md">
              Hợp chất: <span className="text-emerald-600 text-3xl font-heading font-black">
                {metal.symbol}{scenario.rM > 1 && <sub>{scenario.rM}</sub>}
                {nonMetal.symbol}{scenario.rNM > 1 && <sub>{scenario.rNM}</sub>}
              </span>
            </div>
          </div>

          {/* Cation / Anion info panels */}
          <AnimatePresence>
            {phase >= 2 && (
              <>
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-6 bottom-28 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-orange-200 shadow-lg text-slate-800"
                >
                  <h4 className="text-orange-600 font-black text-base mb-2 text-center font-heading">Tạo Cation (Ion dương)</h4>
                  <div className="px-4 py-2 bg-orange-50 rounded-lg text-center font-mono text-lg text-orange-700 border border-orange-100 font-bold">
                    {metal.symbol} → {metal.symbol}<sup>{metal.charge}</sup> + {metal.valency}e<sup>-</sup>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-6 bottom-28 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-cyan-200 shadow-lg text-slate-800"
                >
                  <h4 className="text-cyan-600 font-black text-base mb-2 text-center font-heading">Tạo Anion (Ion âm)</h4>
                  <div className="px-4 py-2 bg-cyan-50 rounded-lg text-center font-mono text-lg text-cyan-700 border border-cyan-100 font-bold">
                    {nonMetal.symbol} + {nonMetal.valency}e<sup>-</sup> → {nonMetal.symbol}<sup>{nonMetal.charge}</sup>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Stepper info - Raised to top */}
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
                  <p className="text-slate-600 text-base font-semibold">Các nguyên tử độc lập đang ở trạng thái trung hòa về điện. <br/>(Chú ý số lượng electron lớp ngoài cùng của mỗi nguyên tử)</p>
                </>
              )}
              {phase === 1 && (
                <>
                  <h3 className="text-xl font-black text-cyan-600 mb-2 font-heading">Bước 2: Sự trao đổi Electron</h3>
                  <p className="text-slate-600 text-base font-semibold">Nguyên tử {metal.name} có xu hướng nhường {metal.valency} electron cho {nonMetal.name} để cả hai đạt cấu hình bền vững của khí hiếm.</p>
                </>
              )}
              {phase === 2 && (
                <>
                  <h3 className="text-xl font-black text-orange-600 mb-2 font-heading">Bước 3: Tạo thành Ion</h3>
                  <p className="text-slate-600 text-base font-semibold">{metal.symbol} mất e trở thành Ion dương (<b className="text-orange-500 font-black">{metal.charge}</b>). {nonMetal.symbol} nhận e trở thành Ion âm (<b className="text-cyan-500 font-black">{nonMetal.charge}</b>). Các electron nhận vào vẫn mang màu sắc ban đầu của kim loại.</p>
                </>
              )}
              {phase === 3 && (
                <>
                  <h3 className="text-xl font-black text-emerald-600 mb-2 flex items-center justify-center gap-2 font-heading">
                    <CheckCircle2 className="w-6 h-6 animate-pulse" /> Bước 4: Hình thành Liên kết Ion
                  </h3>
                  <p className="text-slate-600 text-base font-semibold">Các ion mang điện tích trái dấu hút nhau bằng lực tĩnh điện, tạo thành phân tử <b className="text-slate-800">{metal.symbol}{scenario.rM > 1 && <sub>{scenario.rM}</sub>}{nonMetal.symbol}{scenario.rNM > 1 && <sub>{scenario.rNM}</sub>}</b> trung hòa về điện.</p>
                </>
              )}
            </motion.div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 p-6 flex justify-center gap-6 shadow-xl">
            <button 
              onClick={() => { setStep('selection'); setPhase(0); setSelectedMetal(null); setSelectedNonMetal(null); }}
              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all border border-slate-200 shadow-xs"
            >
              Chọn lại nguyên tố
            </button>
            
            {phase === 0 && (
              <button onClick={handleNextPhase} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all text-base shadow-md active:scale-95">
                Tiến hành nhường nhận e <ChevronRight className="w-6 h-6" />
              </button>
            )}
            {phase === 2 && (
              <button onClick={handleNextPhase} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all text-base shadow-md active:scale-95">
                Tạo liên kết <ChevronRight className="w-6 h-6" />
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
                  <div className="text-cyan-600 font-black flex items-center gap-2 text-lg font-heading">
                    <BrainCircuit className="w-6 h-6 animate-pulse" /> Trắc nghiệm Liên kết Ion
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
                <div className="w-24 h-24 bg-linear-to-tr from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/20">
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
                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
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
