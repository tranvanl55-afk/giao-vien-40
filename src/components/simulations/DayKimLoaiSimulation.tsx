import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, FlaskConical, Play, Settings, BookOpen, MessageCircle, X } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';

interface DayKimLoaiSimulationProps {
  onBack: () => void;
}

type Metal = 'K' | 'Na' | 'Ba' | 'Ca' | 'Mg' | 'Al' | 'Zn' | 'Fe' | 'Cu' | 'Ag';
type Solution = 'H2O' | 'HCl' | 'H2SO4' | 'AgNO3' | 'CuSO4' | 'Na2SO4' | 'FeCl3' | 'FeCl2' | 'MgCl2' | 'FeSO4';

const METALS: Record<Metal, { id: Metal, name: string, symbol: string, color: string }> = {
  K: { id: 'K', name: 'Kali', symbol: 'K', color: '#e2e8f0' },
  Na: { id: 'Na', name: 'Natri', symbol: 'Na', color: '#e2e8f0' },
  Ba: { id: 'Ba', name: 'Bari', symbol: 'Ba', color: '#e2e8f0' },
  Ca: { id: 'Ca', name: 'Canxi', symbol: 'Ca', color: '#e2e8f0' },
  Mg: { id: 'Mg', name: 'Magie', symbol: 'Mg', color: '#d1d5db' },
  Al: { id: 'Al', name: 'Nhôm', symbol: 'Al', color: '#cbd5e1' },
  Zn: { id: 'Zn', name: 'Kẽm', symbol: 'Zn', color: '#94a3b8' },
  Fe: { id: 'Fe', name: 'Sắt', symbol: 'Fe', color: '#64748b' },
  Cu: { id: 'Cu', name: 'Đồng', symbol: 'Cu', color: '#b45309' },
  Ag: { id: 'Ag', name: 'Bạc', symbol: 'Ag', color: '#f8fafc' },
};

const SOLUTIONS: Record<Solution, { id: Solution, formula: string, color: string }> = {
  H2O: { id: 'H2O', formula: 'H_2O', color: 'rgba(255,255,255,0.05)' },
  HCl: { id: 'HCl', formula: 'HCl', color: 'rgba(255,255,255,0.1)' },
  H2SO4: { id: 'H2SO4', formula: 'H_2SO_4', color: 'rgba(255,255,255,0.1)' },
  AgNO3: { id: 'AgNO3', formula: 'AgNO_3', color: 'rgba(255,255,255,0.05)' },
  CuSO4: { id: 'CuSO4', formula: 'CuSO_4', color: 'rgba(56,189,248,0.4)' }, // Blue
  Na2SO4: { id: 'Na2SO4', formula: 'Na_2SO_4', color: 'rgba(255,255,255,0.05)' },
  FeCl3: { id: 'FeCl3', formula: 'FeCl_3', color: 'rgba(234,179,8,0.3)' }, // Yellowish-brown
  FeCl2: { id: 'FeCl2', formula: 'FeCl_2', color: 'rgba(163,230,53,0.15)' }, // Pale green
  MgCl2: { id: 'MgCl2', formula: 'MgCl_2', color: 'rgba(255,255,255,0.05)' },
  FeSO4: { id: 'FeSO4', formula: 'FeSO_4', color: 'rgba(163,230,53,0.15)' },
};

interface ReactionConfig {
  hasReaction: boolean;
  equation: string | null;
  bubbles: boolean;
  coatingColor: string | null;
  endSolColor: string | null;
}

function getReaction(metal: Metal, sol: Solution): ReactionConfig {
  let hasReaction = false;
  let equation: string | null = null;
  let bubbles = false;
  let coatingColor: string | null = null;
  let endSolColor: string | null = null;

  const isAlkali = ['K', 'Na', 'Ba', 'Ca'].includes(metal);

  if (isAlkali) {
    hasReaction = true;
    bubbles = true;

    const valency = (metal === 'Ba' || metal === 'Ca') ? 2 : 1;
    const base = valency === 1 ? `${metal}OH` : `${metal}(OH)_2`;

    if (sol === 'H2O') {
      equation = valency === 1 
        ? `2${metal} + 2H_2O \\rightarrow 2${base} + H_2\\uparrow` 
        : `${metal} + 2H_2O \\rightarrow ${base} + H_2\\uparrow`;
    } else if (sol === 'HCl') {
      equation = valency === 1
        ? `2${metal} + 2HCl \\rightarrow 2${metal}Cl + H_2\\uparrow`
        : `${metal} + 2HCl \\rightarrow ${metal}Cl_2 + H_2\\uparrow`;
    } else if (sol === 'H2SO4') {
      equation = valency === 1
        ? `2${metal} + H_2SO_4 \\rightarrow ${metal}_2SO_4 + H_2\\uparrow`
        : `${metal} + H_2SO_4 \\rightarrow ${metal}SO_4 + H_2\\uparrow`;
      if (metal === 'Ba' || metal === 'Ca') coatingColor = '#ffffff'; // Insoluble/slightly soluble sulfates
    } else {
      const eq1 = valency === 1 
        ? `2${metal} + 2H_2O \\rightarrow 2${base} + H_2\\uparrow` 
        : `${metal} + 2H_2O \\rightarrow ${base} + H_2\\uparrow`;
      let eq2 = '';

      if (sol === 'CuSO4') {
        const salt = valency === 1 ? `${metal}_2SO_4` : `${metal}SO_4`;
        eq2 = valency === 1 ? `2${base} + CuSO_4 \\rightarrow Cu(OH)_2\\downarrow + ${salt}` : `${base} + CuSO_4 \\rightarrow Cu(OH)_2\\downarrow + ${salt}`;
        if (metal === 'Ba') eq2 = `Ba(OH)_2 + CuSO_4 \\rightarrow BaSO_4\\downarrow + Cu(OH)_2\\downarrow`;
        coatingColor = '#3b82f6';
        endSolColor = 'rgba(255,255,255,0.1)';
      } else if (sol === 'AgNO3') {
        const salt = valency === 1 ? `${metal}NO_3` : `${metal}(NO_3)_2`;
        eq2 = valency === 1 ? `2${base} + 2AgNO_3 \\rightarrow Ag_2O\\downarrow + 2${salt} + H_2O` : `${base} + 2AgNO_3 \\rightarrow Ag_2O\\downarrow + ${salt} + H_2O`;
        coatingColor = '#1e293b';
      } else if (sol === 'FeCl3') {
        const salt = valency === 1 ? `${metal}Cl` : `${metal}Cl_2`;
        eq2 = valency === 1 ? `3${base} + FeCl_3 \\rightarrow Fe(OH)_3\\downarrow + 3${salt}` : `3${base} + 2FeCl_3 \\rightarrow 2Fe(OH)_3\\downarrow + 3${salt}`;
        coatingColor = '#9a3412';
        endSolColor = 'rgba(255,255,255,0.1)';
      } else if (sol === 'FeCl2' || sol === 'FeSO4') {
        const salt = sol === 'FeCl2' ? (valency === 1 ? `${metal}Cl` : `${metal}Cl_2`) : (valency === 1 ? `${metal}_2SO_4` : `${metal}SO_4`);
        if (metal === 'Ba' && sol === 'FeSO4') {
          eq2 = `Ba(OH)_2 + FeSO_4 \\rightarrow BaSO_4\\downarrow + Fe(OH)_2\\downarrow`;
        } else {
          const coef = (valency === 1 && sol === 'FeCl2') ? '2' : '';
          eq2 = valency === 1 ? `2${base} + ${sol === 'FeCl2' ? 'FeCl_2' : 'FeSO_4'} \\rightarrow Fe(OH)_2\\downarrow + ${coef}${salt}` 
                              : `${base} + ${sol === 'FeCl2' ? 'FeCl_2' : 'FeSO_4'} \\rightarrow Fe(OH)_2\\downarrow + ${salt}`;
        }
        coatingColor = '#a3e635';
      } else if (sol === 'MgCl2') {
        const salt = valency === 1 ? `${metal}Cl` : `${metal}Cl_2`;
        eq2 = valency === 1 ? `2${base} + MgCl_2 \\rightarrow Mg(OH)_2\\downarrow + 2${salt}` : `${base} + MgCl_2 \\rightarrow Mg(OH)_2\\downarrow + ${salt}`;
        coatingColor = '#ffffff';
      } else if (sol === 'Na2SO4') {
        if (metal === 'Ba') {
          eq2 = `Ba(OH)_2 + Na_2SO_4 \\rightarrow BaSO_4\\downarrow + 2NaOH`;
          coatingColor = '#ffffff';
        } else {
          equation = eq1;
        }
      }

      if (!equation) {
        equation = `\\begin{aligned} &${eq1} \\\\ &${eq2} \\end{aligned}`;
      }
    }
  } else if (sol === 'HCl' || sol === 'H2SO4') {
    if (['Mg', 'Al', 'Zn', 'Fe'].includes(metal)) {
      hasReaction = true;
      bubbles = true;
      if (sol === 'HCl') {
        if (metal === 'Mg') equation = `Mg + 2HCl \\rightarrow MgCl_2 + H_2\\uparrow`;
        if (metal === 'Al') equation = `2Al + 6HCl \\rightarrow 2AlCl_3 + 3H_2\\uparrow`;
        if (metal === 'Zn') equation = `Zn + 2HCl \\rightarrow ZnCl_2 + H_2\\uparrow`;
        if (metal === 'Fe') equation = `Fe + 2HCl \\rightarrow FeCl_2 + H_2\\uparrow`;
      } else {
        if (metal === 'Mg') equation = `Mg + H_2SO_4 \\rightarrow MgSO_4 + H_2\\uparrow`;
        if (metal === 'Al') equation = `2Al + 3H_2SO_4 \\rightarrow Al_2(SO_4)_3 + 3H_2\\uparrow`;
        if (metal === 'Zn') equation = `Zn + H_2SO_4 \\rightarrow ZnSO_4 + H_2\\uparrow`;
        if (metal === 'Fe') equation = `Fe + H_2SO_4 \\rightarrow FeSO_4 + H_2\\uparrow`;
      }
    }
  } else if (sol === 'CuSO4') {
    if (['Mg', 'Al', 'Zn', 'Fe'].includes(metal)) {
      hasReaction = true;
      coatingColor = '#B87333'; // Reddish-brown copper
      endSolColor = 'rgba(255,255,255,0.1)'; // Loses blue color
      if (metal === 'Mg') equation = `Mg + CuSO_4 \\rightarrow MgSO_4 + Cu\\downarrow`;
      if (metal === 'Al') equation = `2Al + 3CuSO_4 \\rightarrow Al_2(SO_4)_3 + 3Cu\\downarrow`;
      if (metal === 'Zn') equation = `Zn + CuSO_4 \\rightarrow ZnSO_4 + Cu\\downarrow`;
      if (metal === 'Fe') equation = `Fe + CuSO_4 \\rightarrow FeSO_4 + Cu\\downarrow`;
    }
  } else if (sol === 'AgNO3') {
    if (['Mg', 'Al', 'Zn', 'Fe', 'Cu'].includes(metal)) {
      hasReaction = true;
      coatingColor = '#f8fafc'; // Silver
      if (metal === 'Cu') endSolColor = 'rgba(56,189,248,0.2)'; // Turns blue
      if (metal === 'Mg') equation = `Mg + 2AgNO_3 \\rightarrow Mg(NO_3)_2 + 2Ag\\downarrow`;
      if (metal === 'Al') equation = `Al + 3AgNO_3 \\rightarrow Al(NO_3)_3 + 3Ag\\downarrow`;
      if (metal === 'Zn') equation = `Zn + 2AgNO_3 \\rightarrow Zn(NO_3)_2 + 2Ag\\downarrow`;
      if (metal === 'Fe') equation = `Fe + 2AgNO_3 \\rightarrow Fe(NO_3)_2 + 2Ag\\downarrow`;
      if (metal === 'Cu') equation = `Cu + 2AgNO_3 \\rightarrow Cu(NO_3)_2 + 2Ag\\downarrow`;
    }
  } else if (sol === 'FeCl3') {
    if (['Mg', 'Al', 'Zn', 'Fe', 'Cu'].includes(metal)) {
      hasReaction = true;
      endSolColor = 'rgba(163,230,53,0.15)'; // Pale green Fe2+
      if (metal === 'Mg') equation = `3Mg + 2FeCl_3 \\rightarrow 3MgCl_2 + 2Fe\\downarrow`;
      if (metal === 'Al') equation = `Al + FeCl_3 \\rightarrow AlCl_3 + Fe\\downarrow`;
      if (metal === 'Zn') equation = `3Zn + 2FeCl_3 \\rightarrow 3ZnCl_2 + 2Fe\\downarrow`;
      if (metal === 'Fe') equation = `Fe + 2FeCl_3 \\rightarrow 3FeCl_2`;
      if (metal === 'Cu') {
        equation = `Cu + 2FeCl_3 \\rightarrow CuCl_2 + 2FeCl_2`;
        endSolColor = 'rgba(20,150,150,0.25)'; // Mixed color
      }
    }
  } else if (sol === 'FeCl2' || sol === 'FeSO4') {
    if (['Mg', 'Al', 'Zn'].includes(metal)) {
      hasReaction = true;
      coatingColor = '#475569'; // Darkish Iron
      if (sol === 'FeCl2') {
        if (metal === 'Mg') equation = `Mg + FeCl_2 \\rightarrow MgCl_2 + Fe\\downarrow`;
        if (metal === 'Al') equation = `2Al + 3FeCl_2 \\rightarrow 2AlCl_3 + 3Fe\\downarrow`;
        if (metal === 'Zn') equation = `Zn + FeCl_2 \\rightarrow ZnCl_2 + Fe\\downarrow`;
      } else {
        if (metal === 'Mg') equation = `Mg + FeSO_4 \\rightarrow MgSO_4 + Fe\\downarrow`;
        if (metal === 'Al') equation = `2Al + 3FeSO_4 \\rightarrow Al_2(SO_4)_3 + 3Fe\\downarrow`;
        if (metal === 'Zn') equation = `Zn + FeSO_4 \\rightarrow ZnSO_4 + Fe\\downarrow`;
      }
    }
  }

  if (!hasReaction) {
    equation = null;
  }

  return { hasReaction, equation, bubbles, coatingColor, endSolColor };
}

interface TubeState {
  id: string;
  metal: Metal | null;
  solution: Solution | null;
  isReactionStarted: boolean;
  isEquationVisible: boolean;
}

export function DayKimLoaiSimulation({ onBack }: DayKimLoaiSimulationProps) {
  const [tubes, setTubes] = useState<TubeState[]>([
    { id: 't1', metal: null, solution: null, isReactionStarted: false, isEquationVisible: false },
    { id: 't2', metal: null, solution: null, isReactionStarted: false, isEquationVisible: false },
    { id: 't3', metal: null, solution: null, isReactionStarted: false, isEquationVisible: false },
    { id: 't4', metal: null, solution: null, isReactionStarted: false, isEquationVisible: false },
  ]);
  
  const [activeTab, setActiveTab] = useState<'controls' | 'practice'>('controls');
  const [selectedTubeId, setSelectedTubeId] = useState<string>('t1');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const activeTubeIndex = tubes.findIndex(t => t.id === selectedTubeId);
  const activeTube = tubes[activeTubeIndex];

  const handleSetMetal = (metal: Metal) => {
     setTubes(prev => prev.map(t => t.id === selectedTubeId ? { ...t, metal, isReactionStarted: false, isEquationVisible: false } : t));
  };

  const handleSetSolution = (solution: Solution) => {
     setTubes(prev => prev.map(t => t.id === selectedTubeId ? { ...t, solution, isReactionStarted: false, isEquationVisible: false } : t));
  };

  const toggleEquation = (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     setTubes(prev => prev.map(t => t.id === id ? { ...t, isEquationVisible: !t.isEquationVisible } : t));
  };

  const startReaction = () => {
     setTubes(prev => prev.map(t => t.id === selectedTubeId && t.metal && t.solution ? { ...t, isReactionStarted: true } : t));
  };

  const startAllReactions = () => {
    setTubes(prev => prev.map(t => t.metal && t.solution ? { ...t, isReactionStarted: true } : t));
  };

  const resetAll = () => {
    setTubes(prev => prev.map(t => ({ ...t, metal: null, solution: null, isReactionStarted: false, isEquationVisible: false })));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden font-sans text-slate-200">
      
      {/* Top Navigation */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <FlaskConical className="w-4 h-4 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold font-heading text-white tracking-wide">Trạm Hóa Học: Kim Loại & Phản Ứng</h2>
          </div>
        </div>
        <button 
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm font-bold shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Làm lại tất cả
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left/Middle Column: Experiment Area */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/30 via-slate-950 to-slate-950">
           
           {/* Test Tube Rack */}
           <div className="relative flex gap-8 items-end justify-center h-80 w-full max-w-4xl shrink-0 z-10">
              
              {/* Rack Wood Base */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-slate-800/80 border border-slate-700 rounded-lg shadow-2xl backdrop-blur-md">
                 <div className="absolute top-1.5 left-4 right-4 h-px bg-slate-600/50"></div>
              </div>
              <div className="absolute bottom-16 left-4 right-4 h-5 bg-slate-800/60 border border-slate-700 rounded-lg shadow-lg backdrop-blur-md z-0 flex justify-evenly items-center px-8">
                 {/* Holes in the rack */}
                 {[0,1,2,3].map(i => <div key={i} className="w-8 h-2 rounded-[100%] bg-slate-950/80 shadow-inner"></div>)}
              </div>

              {/* Tubes */}
              {tubes.map((tube, index) => {
                 const isSelected = selectedTubeId === tube.id;
                 const reaction = (tube.metal && tube.solution) ? getReaction(tube.metal, tube.solution) : null;
                 const solColor = tube.isReactionStarted && reaction?.endSolColor ? reaction.endSolColor : (tube.solution ? SOLUTIONS[tube.solution].color : 'transparent');

                 return (
                   <div 
                     key={tube.id} 
                     className="relative flex flex-col items-center z-10 cursor-pointer group"
                     onClick={() => setSelectedTubeId(tube.id)}
                   >
                     {/* Selection Indicator */}
                     <AnimatePresence>
                       {isSelected && (
                          <motion.div 
                             layoutId="tube-selector"
                             className="absolute -inset-x-4 -top-3 -bottom-2 bg-white/5 rounded-2xl border border-white/10 pointer-events-none"
                             transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                       )}
                     </AnimatePresence>

                     <p className="absolute -top-8 text-slate-400 font-bold text-xs tracking-widest uppercase">Ống {index + 1}</p>
                     
                     {/* Glass Tube Container */}
                     <div 
                        className={`relative w-10 h-56 rounded-b-full border-b-[3px] border-x-[3px] shadow-[inset_0_0_15px_rgba(255,255,255,0.1),_0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-end
                           ${isSelected ? 'border-orange-500/50' : 'border-white/20 group-hover:border-white/30'} 
                           transition-colors duration-300 backdrop-blur-[2px] bg-gradient-to-b from-white/5 to-white/0
                        `}
                        onClick={(e) => {
                          if (tube.metal && tube.solution && tube.isReactionStarted) toggleEquation(tube.id, e);
                        }}
                     >
                        {/* Liquid */}
                        <motion.div 
                          className="w-full absolute bottom-0 z-0 select-none origin-bottom"
                          initial={{ height: 0 }}
                          animate={{ 
                             height: tube.solution ? '60%' : '0%',
                             backgroundColor: solColor
                          }}
                          transition={{ duration: tube.isReactionStarted ? 3 : 0.5, ease: 'easeInOut' }}
                        >
                           {tube.solution && <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-[100%]"></div>}
                        </motion.div>

                        {/* Metal Strip */}
                        <AnimatePresence>
                           {tube.metal && (
                              <motion.div 
                                className="absolute left-1/2 -translate-x-1/2 w-3 h-40 rounded-sm shadow-inner z-10 overflow-hidden border border-black/20"
                                style={{ backgroundColor: METALS[tube.metal].color }}
                                initial={{ y: -200, opacity: 0 }}
                                animate={{ y: 20, opacity: 1 }}
                                exit={{ y: -200, opacity: 0 }}
                              >
                                 {/* Copper/Silver Coating Effect */}
                                 {(tube.isReactionStarted && reaction?.coatingColor) && (
                                   <motion.div 
                                      className="absolute bottom-0 left-0 right-0 w-full"
                                      style={{ backgroundColor: reaction.coatingColor, height: '65%' /* Match solution level */ }}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 5, delay: 0.5 }}
                                   />
                                 )}
                              </motion.div>
                           )}
                        </AnimatePresence>

                        {/* Bubbles */}
                        {tube.isReactionStarted && reaction?.bubbles && (
                           <div className="absolute bottom-4 left-0 right-0 h-24 pointer-events-none z-20 overflow-hidden">
                             {Array.from({ length: 15 }).map((_, i) => (
                                <motion.div
                                   key={i}
                                   className="absolute bottom-0 rounded-full bg-white/70 shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                                   style={{ 
                                     left: `${20 + Math.random() * 60}%`, 
                                     width: 2 + Math.random() * 3, 
                                     height: 2 + Math.random() * 3 
                                   }}
                                   animate={{ 
                                     y: [-10, -80 - Math.random() * 40],
                                     x: [0, (Math.random() - 0.5) * 15, 0],
                                     opacity: [0, 1, 0]
                                   }}
                                   transition={{ 
                                     duration: 1 + Math.random() * 1.5, 
                                     repeat: Infinity, 
                                     delay: Math.random() * 2,
                                     ease: "linear"
                                   }}
                                />
                             ))}
                           </div>
                        )}

                        {/* Click feedback for equation */}
                        {tube.isReactionStarted && (
                           <div className="absolute inset-0 z-30 hover:bg-white/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                             <div className="bg-slate-900/80 px-2 py-1 rounded text-[10px] text-white">Xem PT</div>
                           </div>
                        )}
                     </div>

                     {/* Glass lip */}
                     <div className="w-12 h-2 rounded-[100%] border-[2px] border-b-0 border-white/30 absolute -top-1 pointer-events-none"></div>

                     {/* Labels */}
                     <div className="absolute -bottom-14 flex flex-col items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 backdrop-blur-md">
                           {tube.metal ? METALS[tube.metal].symbol : '—'}
                        </span>
                        <span className="text-xs font-bold text-cyan-400 mt-1 drop-shadow-md">
                           {tube.solution ? <InlineMath math={SOLUTIONS[tube.solution].formula} /> : '—'}
                        </span>
                     </div>
                     
                     {/* LaTeX Equation Popup (Glassmorphism card) */}
                     <AnimatePresence>
                        {tube.isEquationVisible && tube.isReactionStarted && reaction && (
                           <motion.div 
                             initial={{ opacity: 0, y: 10, scale: 0.95 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             exit={{ opacity: 0, y: 10, scale: 0.95 }}
                             className="absolute bottom-full mb-12 left-1/2 -translate-x-1/2 w-[320px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl shadow-black/50 z-50 pointer-events-auto"
                           >
                              <div className="flex justify-between items-start mb-2 border-b border-slate-700 pb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Phương trình hóa học</span>
                                <button onClick={(e) => toggleEquation(tube.id, e)} className="text-slate-500 hover:text-white bg-slate-800 rounded p-0.5">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="text-orange-300 font-serif overflow-x-auto text-[15px] pt-3 custom-scrollbar">
                                 {reaction.hasReaction ? (
                                    <BlockMath math={reaction.equation || ""} />
                                 ) : (
                                    <div className="text-center font-sans text-slate-400 text-sm py-2">Không có hiện tượng phản ứng</div>
                                 )}
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                   </div>
                 );
              })}
           </div>

           {/* Quick "Start All" button below rack */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
               <button 
                  onClick={startAllReactions}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-transform flex items-center gap-2"
               >
                 <Play className="w-5 h-5 fill-current" /> Tiến hành tất cả
               </button>
           </div>
        </div>

        {/* Right Column: Controls & Practice */}
        <div className="w-[340px] lg:w-[380px] bg-slate-900/80 border-l border-slate-800 flex flex-col backdrop-blur-md z-20 shrink-0">
           {/* Tabs */}
           <div className="flex border-b border-slate-800/80">
              <button 
                 onClick={() => setActiveTab('controls')}
                 className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest relative transition-colors ${activeTab === 'controls' ? 'text-orange-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                 <Settings className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" /> Điều khiển
                 {activeTab === 'controls' && <motion.div layoutId="right-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />}
              </button>
              <button 
                 onClick={() => setActiveTab('practice')}
                 className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest relative transition-colors ${activeTab === 'practice' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                 <BookOpen className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" /> Luyện tập
                 {activeTab === 'practice' && <motion.div layoutId="right-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
              </button>
           </div>

           {/* Panel Content */}
           <div className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
              {activeTab === 'controls' ? (
                 <div className="space-y-5">
                    <div>
                      <h3 className="text-slate-300 font-bold mb-1.5 text-sm">Đang thiết lập: <span className="text-orange-400 uppercase tracking-widest">Ống {activeTubeIndex + 1}</span></h3>
                      <p className="text-xs text-slate-500 mb-4">Chọn kim loại và dung dịch bên dưới, sau đó bấm "Tiến hành" để xem phản ứng.</p>
                      
                      <div className="mb-4">
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">1. Chọn kim loại</div>
                         <div className="grid grid-cols-5 gap-1.5">
                           {(Object.keys(METALS) as Metal[]).map(m => (
                              <button 
                                key={m}
                                onClick={() => handleSetMetal(m)}
                                className={`py-1.5 rounded-lg font-bold border transition-all text-sm ${
                                  activeTube.metal === m 
                                  ? 'bg-slate-800 border-orange-500 text-orange-400' 
                                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                                }`}
                              >
                                {METALS[m].symbol}
                              </button>
                           ))}
                         </div>
                      </div>

                      <div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">2. Chọn dung dịch</div>
                         <div className="grid grid-cols-3 gap-1.5">
                           {(Object.keys(SOLUTIONS) as Solution[]).map(s => (
                              <button 
                                key={s}
                                onClick={() => handleSetSolution(s)}
                                className={`py-1.5 px-1 rounded-lg border transition-all text-xs flex items-center justify-center min-h-[36px] ${
                                  activeTube.solution === s 
                                  ? 'bg-slate-800 border-cyan-500 text-cyan-300 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' 
                                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-300'
                                }`}
                              >
                                <InlineMath math={SOLUTIONS[s].formula} />
                              </button>
                           ))}
                         </div>
                      </div>

                      <button
                        onClick={startReaction}
                        disabled={!activeTube.metal || !activeTube.solution || activeTube.isReactionStarted}
                        className={`w-full mt-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          !activeTube.metal || !activeTube.solution || activeTube.isReactionStarted
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20 active:scale-95'
                        }`}
                      >
                         <Play className="w-4 h-4 fill-current" /> Tiến hành Ống {activeTubeIndex + 1}
                      </button>

                    </div>
                 </div>
              ) : (
                 <div className="space-y-6">
                    <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl">
                       <h4 className="font-bold text-slate-200 mb-2">Dãy hoạt động hóa học</h4>
                       <div className="text-slate-300 font-mono text-xs leading-6 bg-slate-950 p-3 rounded-lg border border-slate-800">
                         K, Na, Ba, Ca, Mg, Al, Zn, Fe, Ni, Sn, Pb, (H), Cu, Hg, Ag, Pt, Au
                       </div>
                    </div>
                    {/* Placeholder for practice feature */}
                    <div className="text-center text-slate-500 text-sm mt-10">
                       Tính năng luyện tập đang được cập nhật...
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Floating Chatbot Guide */}
      <div className="absolute bottom-4 right-[360px] lg:right-[400px] z-50">
         <AnimatePresence>
            {isChatOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.9 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.9 }}
                 className="absolute bottom-16 right-0 w-72 bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-2xl shadow-black/50"
               >
                 <div className="flex items-center gap-3 mb-3 border-b border-slate-700 pb-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center shrink-0 overflow-hidden">
                       <span className="text-xl">👨‍🔬</span>
                    </div>
                    <div>
                       <div className="font-bold text-sm text-white">Thầy Trạm Hóa Học</div>
                       <div className="text-[10px] text-cyan-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Online</div>
                    </div>
                 </div>
                 <p className="text-xs text-slate-300 leading-relaxed">
                    Chào em! Hãy chọn kim loại và dung dịch ở cột bên phải, sau đó bấm <strong>Tiến hành</strong> để xem hiện tượng nhé. 
                    <br/><br/>
                    <em>Mẹo:</em> Click trực tiếp vào ống nghiệm đang có phản ứng để xem phương trình hóa học!
                 </p>
               </motion.div>
            )}
         </AnimatePresence>
         <button 
           onClick={() => setIsChatOpen(!isChatOpen)}
           className="w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 border-[3px] border-slate-950 flex items-center justify-center text-white shadow-xl shadow-cyan-900/30 transition-transform active:scale-95"
         >
           {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 fill-current" />}
         </button>
      </div>
    </div>
  );
}
