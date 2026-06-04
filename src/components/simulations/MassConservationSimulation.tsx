import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RefreshCw, Beaker, HelpCircle, AlertCircle, Info, Check, Eye, EyeOff, Maximize, Minimize, Award, Layers } from 'lucide-react';
import * as THREE from 'three';

// --- CUSTOM 3D PARTICLE SYSTEMS ---

// 1. Bubble Particle System for Gas Evolving reaction
const Bubbles = ({ active, count = 35 }: { active: boolean; count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 0.8,
        y: Math.random() * 0.9,
        z: (Math.random() - 0.5) * 0.8,
        speed: 0.005 + Math.random() * 0.01,
        size: 0.02 + Math.random() * 0.04,
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!active || !groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      const p = particles[idx];
      child.position.y += p.speed;
      
      // Reset bubble when it reaches liquid surface
      if (child.position.y > 0.9) {
        child.position.y = 0;
        child.position.x = (Math.random() - 0.5) * 0.7;
        child.position.z = (Math.random() - 0.5) * 0.7;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color="#a7f3d0" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// 2. Smoke/Gas Fog System when Balloon is removed
const Smoke = ({ active, position }: { active: boolean; position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 25; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 0.3,
        y: Math.random() * 0.5,
        z: (Math.random() - 0.5) * 0.3,
        speedY: 0.01 + Math.random() * 0.015,
        speedX: (Math.random() - 0.5) * 0.01,
        speedZ: (Math.random() - 0.5) * 0.01,
        maxLife: 60 + Math.random() * 40,
        life: 0,
        size: 0.04 + Math.random() * 0.06,
      });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!active || !groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      const p = particles[idx];
      
      child.position.y += p.speedY;
      child.position.x += p.speedX;
      child.position.z += p.speedZ;
      p.life += 1;

      // Scaling up as it rises
      const scale = 1 + (p.life / p.maxLife) * 3;
      child.scale.set(scale, scale, scale);

      // Fading out
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.4 * (1 - p.life / p.maxLife));
      }

      // Reset when dead
      if (p.life >= p.maxLife) {
        p.life = 0;
        child.position.set(
          (Math.random() - 0.5) * 0.2,
          0,
          (Math.random() - 0.5) * 0.2
        );
        child.scale.set(1, 1, 1);
        if (mat) mat.opacity = 0.4;
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={position}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color="#e2e8f0" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

// 3. White Precipitate Particle System (BaSO4) settling down
const Precipitate = ({ active, count = 45 }: { active: boolean; count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 0.8,
        y: 0.3 + Math.random() * 0.5,
        z: (Math.random() - 0.5) * 0.8,
        fallSpeed: 0.002 + Math.random() * 0.003,
        size: 0.015 + Math.random() * 0.02,
        settled: false,
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!active || !groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      const p = particles[idx];
      
      // Fall down slowly until hitting the bottom of flask
      const bottomLimit = 0.05 + Math.abs(child.position.x) * 0.1; // flat-cone shape bottom approximation
      if (child.position.y > bottomLimit) {
        child.position.y -= p.fallSpeed;
      } else {
        p.settled = true;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// --- Flask 3D Mesh Component (Glass Erlenmeyer Flask) ---
const ErlenmeyerFlask = ({ 
  position, 
  rotation = [0, 0, 0], 
  liquidColor, 
  liquidScale = 1, 
  liquidOpacity = 0.5,
  hasBubbles = false,
  hasPrecipitate = false,
  label = ""
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  liquidColor: string;
  liquidScale?: number;
  liquidOpacity?: number;
  hasBubbles?: boolean;
  hasPrecipitate?: boolean;
  label?: string;
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* 1. Transparent Glass Body (Conical base cylinder) */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.35, 1.15, 1.8, 32, 1, false]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          roughness={0.05} 
          transmission={0.9} 
          thickness={1.5} 
          transparent 
          opacity={0.25} 
          side={THREE.DoubleSide} 
          depthWrite={false}
        />
      </mesh>

      {/* 2. Transparent Glass Neck (Cylinder on top) */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.6, 32, 1, false]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          roughness={0.05} 
          transmission={0.9} 
          thickness={1.5} 
          transparent 
          opacity={0.25} 
          side={THREE.DoubleSide} 
          depthWrite={false}
        />
      </mesh>

      {/* 3. Liquid Body (Scaled cylinder inside conical base) */}
      {liquidScale > 0 && (
        <group scale={[1, liquidScale, 1]} position={[0, 0.01, 0]}>
          {/* Main liquid cylinder volume */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.7, 1.05, 1.0, 32, 1, false]} />
            <meshStandardMaterial 
              color={liquidColor} 
              transparent 
              opacity={liquidOpacity} 
              roughness={0.2}
            />
          </mesh>
          
          {/* Meniscus Top surface cap disk for strong visual boundary */}
          <mesh position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.70, 32]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={liquidColor === "#ffffff" ? 1.0 : 0.65} 
              roughness={0.05}
              metalness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* 4. Active reaction effects */}
      {hasBubbles && <Bubbles active={true} />}
      {hasPrecipitate && <Precipitate active={true} />}

      {/* Chemical Formula Text Badge (Visible in 3D using HTML) */}
      {label && (
        <Html position={[0, 0.2, 1.5]} center className="pointer-events-none">
          <div className="bg-slate-950/80 border border-white/20 px-2 py-0.5 rounded text-white text-xs font-serif font-bold whitespace-nowrap shadow-md backdrop-blur-sm">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

// --- SCENE & SCALE LIGHTING ---
const LabScene = ({ 
  currentExp, 
  exp1State, 
  exp2State, 
  pourProgress,
  massReading
}: {
  currentExp: 1 | 2;
  exp1State: string;
  exp2State: string;
  pourProgress: number;
  massReading: number;
}) => {
  // Animating values based on current reaction states
  
  // Experiment 1 Balloon Scale and Rotation
  const balloonScale = useMemo(() => {
    if (currentExp !== 1) return [0, 0, 0] as [number, number, number];
    if (exp1State === 'idle') return [0.8, 0.45, 0.8] as [number, number, number];
    if (exp1State === 'pouring') return [0.9, 0.6, 0.9] as [number, number, number];
    if (exp1State === 'reacting') {
      const inflation = 0.9 + pourProgress * 0.75;
      return [inflation, 0.45 + pourProgress * 1.35, inflation] as [number, number, number];
    }
    if (exp1State === 'done_sealed') return [1.65, 1.8, 1.65] as [number, number, number];
    return [0, 0, 0] as [number, number, number]; // detached
  }, [currentExp, exp1State, pourProgress]);

  const balloonPos = useMemo(() => {
    if (exp1State === 'idle') return [0.25, 2.45, 0] as [number, number, number];
    if (exp1State === 'pouring') return [0.1, 2.55, 0] as [number, number, number];
    if (exp1State === 'reacting') return [0, 2.6 + pourProgress * 0.5, 0] as [number, number, number];
    if (exp1State === 'done_sealed') return [0, 3.1, 0] as [number, number, number];
    return [0, 5, 0] as [number, number, number]; // flown away
  }, [exp1State, pourProgress]);

  const balloonRotation = useMemo(() => {
    if (exp1State === 'idle') return [0, 0, -Math.PI / 4.5] as [number, number, number];
    if (exp1State === 'pouring') return [0, 0, -Math.PI / 12] as [number, number, number];
    return [0, 0, 0] as [number, number, number];
  }, [exp1State]);

  // Experiment 2 Flask 1 Pour position
  const flask1Pos = useMemo(() => {
    if (currentExp !== 2) return [-1.2, 0, 0] as [number, number, number];
    if (exp2State === 'idle') return [-1.2, 0, 0] as [number, number, number];
    if (exp2State === 'lifting') {
      const progress = pourProgress;
      return [-1.2 - progress * 0.2, progress * 2.4, 0] as [number, number, number];
    }
    if (exp2State === 'pouring') {
      return [-1.4, 2.4, 0] as [number, number, number];
    }
    // Returning
    if (exp2State === 'returning') {
      const progress = 1 - pourProgress;
      return [-1.2 - progress * 0.2, progress * 2.4, 0] as [number, number, number];
    }
    return [-1.2, 0, 0] as [number, number, number]; // done/idle
  }, [currentExp, exp2State, pourProgress]);

  const flask1Rot = useMemo(() => {
    if (currentExp !== 2) return [0, 0, 0] as [number, number, number];
    if (exp2State === 'pouring') {
      return [0, 0, -Math.PI / 2.1] as [number, number, number];
    }
    if (exp2State === 'lifting') {
      return [0, 0, -pourProgress * (Math.PI / 2.1)] as [number, number, number];
    }
    if (exp2State === 'returning') {
      return [0, 0, -(1 - pourProgress) * (Math.PI / 2.1)] as [number, number, number];
    }
    return [0, 0, 0] as [number, number, number];
  }, [currentExp, exp2State, pourProgress]);

  // Liquid volume inside Flask 1 (poured out)
  const flask1LiquidScale = useMemo(() => {
    if (exp2State === 'idle' || exp2State === 'lifting') return 1;
    if (exp2State === 'pouring') return 1 - pourProgress;
    return 0; // empty for 'returning', 'reacting', and 'done'
  }, [exp2State, pourProgress]);

  // Liquid color in Flask 2 (precipitating)
  const flask2LiquidColor = useMemo(() => {
    if (exp2State === 'idle' || exp2State === 'lifting') return "#e0f2fe"; // Colorless transparent sky-blue
    if (exp2State === 'pouring') {
      // Transition from colorless sky-blue to solid white precipitate
      return pourProgress > 0.4 ? "#ffffff" : "#e0f2fe";
    }
    return "#ffffff"; // Pure white precipitate color
  }, [exp2State, pourProgress]);

  const flask2LiquidOpacity = useMemo(() => {
    if (exp2State === 'idle' || exp2State === 'lifting') return 0.35;
    if (exp2State === 'pouring') return 0.35 + pourProgress * 0.65; // Turn completely opaque white
    return 1.0; // Fully opaque white
  }, [exp2State, pourProgress]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-6, 4, -4]} intensity={0.6} color="#38bdf8" />
      <pointLight position={[6, -2, 6]} intensity={0.3} color="#f43f5e" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

      {/* --- 3D ELECTRONIC SCALE --- */}
      <group position={[0, -0.9, 0]}>
        {/* Scale Base */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4.5, 0.4, 4.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.2} />
        </mesh>
        
        {/* Metallic scale plate */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[1.9, 1.9, 0.05, 32]} />
          <meshStandardMaterial color="#475569" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* Digital Times New Roman LED Display on scale */}
        <Html transform position={[0, -0.02, 2.30]} rotation={[0, 0, 0]} scale={0.35} center pointerEvents="none">
          <div className="bg-slate-950 border-2 border-emerald-500/20 px-3 py-1 rounded text-emerald-400 font-mono font-bold text-lg tracking-widest text-center select-none shadow-[0_0_15px_rgba(52,211,153,0.5)] whitespace-nowrap uppercase">
            {massReading.toFixed(2)}g
          </div>
        </Html>
      </group>

      {/* --- EXPERIMENT 1: GAS EVOLVING --- */}
      {currentExp === 1 && (
        <group position={[0, -0.6, 0]} scale={0.72}>
          {/* Flask with Vinegar */}
          <ErlenmeyerFlask 
            position={[0, 0, 0]} 
            liquidColor="#e0f2fe" // colorless transparent sky-blue
            liquidScale={1}
            liquidOpacity={0.35}
            hasBubbles={exp1State === 'pouring' || exp1State === 'reacting' || exp1State === 'done_sealed'}
            label="CH₃COOH"
          />

          {/* Balloon on top of the Flask mouth */}
          {exp1State !== 'releasing' && exp1State !== 'done_open' && (
            <group position={balloonPos} rotation={balloonRotation}>
              {/* Balloon Neck Connection Ring */}
              <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.36, 0.36, 0.1, 32]} />
                <meshStandardMaterial color="#f43f5e" roughness={0.4} />
              </mesh>
              
              {/* Balloon main sphere */}
              <mesh scale={balloonScale} castShadow>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial color="#f43f5e" roughness={0.25} metalness={0.15} />
              </mesh>

              {/* Chemical label for sodium bicarbonate inside balloon */}
              {exp1State === 'idle' && (
                <Html position={[0.8, 0.3, 0]} center className="pointer-events-none">
                  <div className="bg-slate-950/80 border border-rose-400 px-2 py-0.5 rounded text-rose-300 text-xs font-serif font-bold whitespace-nowrap shadow-md">
                    NaHCO₃ bột
                  </div>
                </Html>
              )}
            </group>
          )}

          {/* Smoke particle system escaping when open */}
          <Smoke active={exp1State === 'releasing'} position={[0, 2.4, 0]} />
        </group>
      )}

      {/* --- EXPERIMENT 2: PRECIPITATION --- */}
      {currentExp === 2 && (
        <group position={[0, -0.6, 0]} scale={0.72}>
          {/* Flask 1: BaCl2 (Pouring Flask) */}
          <ErlenmeyerFlask 
            position={flask1Pos}
            rotation={flask1Rot}
            liquidColor="#e0f2fe" // colorless transparent sky-blue
            liquidScale={flask1LiquidScale}
            liquidOpacity={0.35}
            label={exp2State !== 'done' && exp2State !== 'reacting' ? "BaCl₂" : ""}
          />

          {/* Flask 2: Na2SO4 -> BaSO4 (Stationary Flask) */}
          <ErlenmeyerFlask 
            position={[1.2, 0, 0]} 
            liquidColor={flask2LiquidColor} 
            liquidScale={1.1} // Volume increases slightly
            liquidOpacity={flask2LiquidOpacity}
            hasPrecipitate={exp2State === 'reacting' || exp2State === 'done'}
            label="Na₂SO₄"
          />

          {/* Thin Pouring Stream Cylinder */}
          {exp2State === 'pouring' && (
            <mesh position={[1.1, 1.8, 0]} rotation={[0, 0, 0.12]}>
              <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
              <meshBasicMaterial color="#e0f2fe" transparent opacity={0.5} />
            </mesh>
          )}
        </group>
      )}

      <OrbitControls 
        target={[0, 0.2, 0]}
        enablePan={false} 
        minDistance={3.5} 
        maxDistance={9} 
        minPolarAngle={Math.PI / 4.5} 
        maxPolarAngle={Math.PI / 1.9} 
      />
    </>
  );
};

// --- PEDAGOGICAL EXPLANATION CONTENT (VIETNAMESE) ---
const ExplanationModal = ({ expNum, onClose }: { expNum: 1 | 2; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl custom-scrollbar text-left">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-2xl font-black text-cyan-400 flex items-center gap-3">
            <Award className="w-7 h-7 text-cyan-400" /> Giải thích sư phạm
          </h3>
          <button 
            onClick={onClose} 
            className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all text-xs"
          >
            Đóng
          </button>
        </div>

        {expNum === 1 ? (
          <div className="space-y-4 text-slate-300">
            <h4 className="text-lg font-black text-rose-400">Thí nghiệm 1: Phản ứng sinh khí (Hệ kín & Hệ hở)</h4>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-serif">
              <p className="text-yellow-400 text-lg font-bold text-center mb-2">Phương trình phản ứng:</p>
              <p className="text-white text-xl text-center font-bold tracking-wide leading-relaxed">
                CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑
              </p>
            </div>
            
            <div className="space-y-3 font-medium text-sm md:text-base leading-relaxed">
              <div className="flex gap-2">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Khi hệ kín (đậy bóng):</strong> Khi đổ bột Baking Soda (<span className="font-serif">NaHCO₃</span>) vào giấm (<span className="font-serif">CH₃COOH</span>), khí cacbonic (<span className="font-serif">CO₂</span>) được tạo ra. Khí này bay lên làm quả bóng phồng to nhưng <strong className="text-emerald-400">hoàn toàn bị giữ lại trong bình và bóng</strong>. Do đó, không có hạt vật chất nào thoát ra ngoài đĩa cân. Cân điện tử vẫn giữ nguyên giá trị <strong className="text-white">250.00g</strong>. Điều này chứng minh khối lượng được bảo toàn tuyệt đối.
                </p>
              </div>

              <div className="flex gap-2">
                <Check className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Khi hệ hở (tháo bóng):</strong> Khi ta tháo bong bóng ra, khí <span className="font-serif">CO₂</span> bay ra ngoài khí quyển (hiệu ứng khói mờ trong mô phỏng). Lượng khí thoát ra kéo theo sự thất thoát khối lượng trên đĩa cân, khiến số liệu cân giảm xuống còn khoảng <strong className="text-white">247.80g</strong>.
                </p>
              </div>

              <div className="flex gap-2">
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-cyan-400">Khắc sâu kiến thức:</strong> Định luật bảo toàn khối lượng phát biểu rằng tổng khối lượng các chất sản phẩm bằng tổng khối lượng các chất tham gia phản ứng. Dù cân giảm chỉ số trong hệ hở, tổng khối lượng thực tế của toàn vũ trụ không đổi (vì lượng khí thoát ra vẫn tồn tại). Thí nghiệm này rèn luyện cho học sinh tư duy phân biệt giữa "Hệ kín" và "Hệ hở" trong nghiên cứu hóa học.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-slate-300">
            <h4 className="text-lg font-black text-amber-400">Thí nghiệm 2: Phản ứng tạo kết tủa (Hệ lỏng - rắn)</h4>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-serif">
              <p className="text-yellow-400 text-lg font-bold text-center mb-2">Phương trình phản ứng:</p>
              <p className="text-white text-xl text-center font-bold tracking-wide leading-relaxed">
                BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl
              </p>
            </div>
            
            <div className="space-y-3 font-medium text-sm md:text-base leading-relaxed">
              <div className="flex gap-2">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Bản chất phản ứng:</strong> Khi đổ dung dịch Bari Clorua (<span className="font-serif">BaCl₂</span>) vào dung dịch Natri Sunfat (<span className="font-serif">Na₂SO₂</span>), một phản ứng trao đổi lập tức xảy ra tạo thành kết tủa trắng tinh khiết Bari Sunfat (<span className="font-serif">BaSO₄</span>) lơ lửng và lắng dần xuống đáy bình, cùng dung dịch muối ăn (<span className="font-serif">NaCl</span>) trong suốt.
                </p>
              </div>

              <div className="flex gap-2">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Logic khối lượng tuyệt đối:</strong> Vì phản ứng này không sinh ra bất kỳ chất khí nào có thể thất thoát và toàn bộ các chất tham gia cũng như sản phẩm kết tủa đều được giữ lại trên cùng một đĩa cân điện tử. Số liệu cân giữ vững ở mức <strong className="text-emerald-400 font-serif">350.00g</strong> hoàn hảo, không suy giảm một miligam nào trước, trong và sau phản ứng.
                </p>
              </div>

              <div className="flex gap-2">
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-cyan-400">Ý nghĩa giáo khoa:</strong> Thí nghiệm tạo kết tủa là công cụ trực quan mạnh mẽ nhất để học sinh quan sát định luật bảo toàn khối lượng hoạt động một cách tức thì mà không bị ảnh hưởng bởi các yếu tố bên ngoài như sự rò rỉ khí. Nó giúp học sinh tin tưởng tuyệt đối vào định lý hóa học căn bản này.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- QUIZ QUESTIONS & PRACTICES ---
const QUIZ_QUESTIONS = [
  {
    question: "Phát biểu nào sau đây đúng về Định luật bảo toàn khối lượng?",
    options: [
      "Trong một phản ứng hóa học, tổng khối lượng các chất sản phẩm lớn hơn tổng khối lượng các chất tham gia.",
      "Trong một phản ứng hóa học, tổng khối lượng các chất sản phẩm nhỏ hơn tổng khối lượng các chất tham gia.",
      "Trong một phản ứng hóa học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng.",
      "Khối lượng các chất phản ứng luôn thay đổi không theo quy luật nào."
    ],
    correctAnswer: 2,
    explanation: "Định luật bảo toàn khối lượng khẳng định rằng vật chất không tự nhiên sinh ra hay mất đi, tổng khối lượng của sản phẩm luôn bằng tổng khối lượng chất phản ứng tham gia."
  },
  {
    question: "Cho phản ứng hóa học tổng quát: A + B → C. Công thức liên hệ về khối lượng theo định luật bảo toàn khối lượng là gì?",
    options: [
      "mA + mB = mC",
      "mA + mC = mB",
      "mB + mC = mA",
      "mA - mB = mC"
    ],
    correctAnswer: 0,
    explanation: "Theo định luật bảo toàn khối lượng, tổng khối lượng các chất tham gia (A và B) bằng tổng khối lượng sản phẩm (C). Vậy mA + mB = mC."
  },
  {
    question: "Đốt cháy hoàn toàn 6 gam Magnesium (Mg) trong khí Oxygen thu được 10 gam Magnesium Oxide (MgO). Khối lượng khí Oxygen đã phản ứng là:",
    options: [
      "2 gam",
      "4 gam",
      "6 gam",
      "16 gam"
    ],
    correctAnswer: 1,
    explanation: "Áp dụng định luật bảo toàn khối lượng: mMg + mO2 = mMgO. Suy ra mO2 = mMgO - mMg = 10g - 6g = 4g."
  },
  {
    question: "Nung đá vôi chứa Calcium Carbonate (CaCO₃) thu được Calcium Oxide (CaO) và khí Carbon Dioxide (CO₂). Nung 100g CaCO₃ thu được 56g CaO thì khối lượng khí CO₂ thoát ra là:",
    options: [
      "36 gam",
      "40 gam",
      "44 gam",
      "56 gam"
    ],
    correctAnswer: 2,
    explanation: "Áp dụng định luật bảo toàn khối lượng: mCaCO3 = mCaO + mCO2. Suy ra mCO2 = mCaCO3 - mCaO = 100g - 56g = 44g."
  },
  {
    question: "Trong Thí nghiệm 1 của phòng Lab này, khi tháo bóng bay giải phóng khí CO₂ làm giảm số liệu cân. Hiện tượng này có vi phạm Định luật bảo toàn khối lượng không?",
    options: [
      "Có, vì khối lượng sau phản ứng rõ ràng đã bị giảm xuống trên đĩa cân.",
      "Có, vì một lượng vật chất dạng khí đã biến mất hoàn toàn.",
      "Không, vì đây là hệ hở. Khối lượng cân giảm do khí CO₂ thoát ra khí quyển; nếu tính cả lượng khí đã thoát đi thì tổng khối lượng vẫn hoàn toàn được bảo toàn.",
      "Không, vì phản ứng hóa học thực tế chưa xảy ra."
    ],
    correctAnswer: 2,
    explanation: "Khi hệ hở, khí CO₂ thoát ra ngoài mang theo khối lượng của nó nên cân giảm. Định luật bảo toàn khối lượng vẫn luôn đúng khi xét toàn bộ lượng khí đã thoát đi này."
  }
];

const QuizModal = ({ onClose }: { onClose: () => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const activeQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectAnswer = (ansIdx: number) => {
    if (isAnswered) return;
    setSelectedAns(ansIdx);
    setIsAnswered(true);
    if (ansIdx === activeQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      setQuizDone(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setScore(0);
    setQuizDone(false);
  };

  // Determine Rank and Colors
  const rankInfo = useMemo(() => {
    if (score === 5) {
      return {
        title: "🏆 Nhà Khoa Học Tài Ba!",
        grade: "Xuất sắc (5/5)",
        desc: "Chúc mừng bạn! Bạn đã nắm vững 100% Định luật bảo toàn khối lượng và hiểu cực kỳ sâu sắc về cơ chế hệ kín/hệ hở trong phòng Lab!",
        colorClass: "from-yellow-400 via-amber-400 to-emerald-400 text-yellow-500"
      };
    } else if (score >= 3) {
      return {
        title: "🥈 Kỹ Sư Xuất Sắc!",
        grade: "Khá giỏi (" + score + "/5)",
        desc: "Tuyệt vời! Bạn có nền tảng kiến thức rất vững chắc và khả năng phân tích hiện tượng hóa học nhạy bén.",
        colorClass: "from-cyan-500 via-blue-500 to-indigo-500 text-cyan-600"
      };
    } else {
      return {
        title: "📚 Học Sinh Tích Cực!",
        grade: "Đạt (" + score + "/5)",
        desc: "Bạn đã hoàn thành tốt bài luyện tập! Hãy thử làm lại thí nghiệm 3D và đọc kỹ phần giải thích để đạt điểm tuyệt đối nhé.",
        colorClass: "from-orange-500 to-amber-500 text-orange-600"
      };
    }
  }, [score]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar text-left flex flex-col justify-between text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 shrink-0">
          <h3 className="text-xl md:text-2xl font-black text-purple-600 flex items-center gap-2.5">
            <Award className="w-6.5 h-6.5 text-purple-500 animate-bounce" /> Luyện tập & Trắc nghiệm
          </h3>
          <button 
            onClick={onClose} 
            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold transition-all text-xs border border-slate-200"
          >
            Thoát
          </button>
        </div>

        {!quizDone ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-bold">
                <span>Câu hỏi {currentIdx + 1} trên {QUIZ_QUESTIONS.length}</span>
                <span className="text-purple-600 font-extrabold">Đã trả lời đúng: {score}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  className="h-full bg-linear-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-slate-50 border border-slate-200 p-4 md:p-5 rounded-2xl mb-5">
              <h4 className="text-base md:text-lg font-bold text-slate-800 leading-relaxed">
                {activeQuestion.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-5">
              {activeQuestion.options.map((option, idx) => {
                const isSelected = selectedAns === idx;
                const isCorrect = idx === activeQuestion.correctAnswer;
                
                let btnStyle = "border-slate-200 bg-white text-slate-700 hover:border-purple-500/50 hover:bg-purple-50 hover:text-purple-950";
                let badgeStyle = "bg-slate-100 text-slate-500";
                
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-xs";
                    badgeStyle = "bg-emerald-500 text-white";
                  } else if (isSelected) {
                    btnStyle = "border-rose-300 bg-rose-50 text-rose-800 shadow-xs";
                    badgeStyle = "bg-rose-500 text-white";
                  } else {
                    btnStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                    badgeStyle = "bg-slate-100 text-slate-400";
                  }
                }

                const labelLetter = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border flex gap-3.5 items-center transition-all duration-200 select-none ${btnStyle} group`}
                  >
                    <span className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-black transition-all ${badgeStyle} shadow-xs`}>
                      {labelLetter}
                    </span>
                    <span className="text-xs md:text-sm font-semibold leading-relaxed">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-4 mb-5 text-xs md:text-sm flex gap-3 items-start shadow-xs"
                >
                  <AlertCircle className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-cyan-700 block mb-1">Giải thích sư phạm:</span>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-2 border-t border-slate-100 shrink-0">
              <button
                disabled={!isAnswered}
                onClick={handleNext}
                className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? "Câu hỏi tiếp theo" : "Xem kết quả"} →
              </button>
            </div>
          </div>
        ) : (
          /* Quiz Results screen */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6"
          >
            {/* Rank badge */}
            <div className={`p-1 bg-linear-to-br ${rankInfo.colorClass} rounded-full shadow-md animate-pulse`}>
              <div className="bg-white rounded-full px-6 py-5">
                <span className="text-4xl block mb-2">🏆</span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">Danh hiệu</span>
                <h4 className={`text-xl md:text-2xl font-black bg-linear-to-r ${rankInfo.colorClass} bg-clip-text text-transparent`}>
                  {rankInfo.title}
                </h4>
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h5 className="text-slate-800 text-lg font-bold">
                Điểm số đạt được: <span className="text-purple-600 text-2xl font-black">{score} / {QUIZ_QUESTIONS.length}</span>
              </h5>
              <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wide">
                Xếp loại: {rankInfo.grade}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {rankInfo.desc}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-100 w-full justify-center shrink-0">
              <button
                onClick={handleResetQuiz}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 transition-all text-sm border border-slate-200 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" /> Làm lại trắc nghiệm
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all text-sm shadow-md"
              >
                <Check className="w-4 h-4" /> Hoàn thành & Đóng
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export function MassConservationSimulation({ onBack }: { onBack: () => void }) {
  const [reactionSpeed, setReactionSpeed] = useState(1);
  const [showEquation, setShowEquation] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentExp, setCurrentExp] = useState<1 | 2>(1);
  const [exp1State, setExp1State] = useState<'idle' | 'pouring' | 'reacting' | 'done_sealed' | 'releasing' | 'done_open'>('idle');
  const [exp2State, setExp2State] = useState<'idle' | 'lifting' | 'pouring' | 'returning' | 'reacting' | 'done'>('idle');
  const [pourProgress, setPourProgress] = useState(0);
  const [massReading, setMassReading] = useState(250.00);
  const [showExplanation, setShowExplanation] = useState(false);

  // Fullscreen helper
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
        console.error(`Error attempting to enable full-screen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Reset Simulation Logic
  const handleReset = () => {
    setPourProgress(0);
    setShowEquation(false);
    if (currentExp === 1) {
      setExp1State('idle');
      setMassReading(250.00);
    } else {
      setExp2State('idle');
      setMassReading(350.00);
    }
  };

  // Switch Experiment
  const handleSwitchExp = (expNum: 1 | 2) => {
    setCurrentExp(expNum);
    setPourProgress(0);
    setShowEquation(false);
    if (expNum === 1) {
      setExp1State('idle');
      setMassReading(250.00);
    } else {
      setExp2State('idle');
      setMassReading(350.00);
    }
  };

  // Experiment 1 Trigger Action: "Nhấc bóng đổ Baking Soda"
  const handleLiftBalloon = () => {
    if (exp1State !== 'idle') return;
    setExp1State('pouring');
    setPourProgress(0);
    
    // Animate Baking soda falling (pouring phase)
    let progress = 0;
    const pourInterval = setInterval(() => {
      progress += 0.05 * reactionSpeed;
      if (progress >= 1) {
        clearInterval(pourInterval);
        setExp1State('reacting');
        triggerReaction1();
      } else {
        setPourProgress(progress);
      }
    }, 50);
  };

  // Experiment 1 Balloon Inflation
  const triggerReaction1 = () => {
    let progress = 0;
    const reactInterval = setInterval(() => {
      progress += 0.02 * reactionSpeed;
      if (progress >= 1) {
        clearInterval(reactInterval);
        setExp1State('done_sealed');
        setPourProgress(1);
      } else {
        setPourProgress(progress);
      }
    }, 60);
  };

  // Experiment 1 Open System Option: "Tháo bóng giải phóng khí CO2"
  const handleRemoveBalloon = () => {
    if (exp1State !== 'done_sealed') return;
    setExp1State('releasing');
    
    // Gas releases steadily and mass reading decreases from 250.00g to 247.80g (representing 2.20g of escaped CO2 gas)
    let progress = 0;
    const startMass = 250.00;
    const endMass = 247.80;
    
    const releaseInterval = setInterval(() => {
      progress += 0.02;
      if (progress >= 1) {
        clearInterval(releaseInterval);
        setExp1State('done_open');
        setMassReading(endMass);
      } else {
        setMassReading(startMass - progress * (startMass - endMass));
      }
    }, 50);
  };

  // Experiment 2 Trigger Action: "Kéo thả đổ dung dịch"
  const handlePourSolution2 = () => {
    if (exp2State !== 'idle') return;
    setExp2State('lifting');
    
    // Phase 1: Lift flask 1 to tilt position
    let liftProgress = 0;
    const liftInterval = setInterval(() => {
      liftProgress += 0.05 * reactionSpeed;
      if (liftProgress >= 1) {
        clearInterval(liftInterval);
        setExp2State('pouring');
        setPourProgress(0);
        triggerPouring2();
      } else {
        setPourProgress(liftProgress);
      }
    }, 40);
  };

  // Experiment 2 Pouring and reaction triggers
  const triggerPouring2 = () => {
    let pourProg = 0;
    const pourInterval = setInterval(() => {
      pourProg += 0.025 * reactionSpeed;
      if (pourProg >= 1) {
        clearInterval(pourInterval);
        setExp2State('returning');
        setPourProgress(0);
        triggerReturn2();
      } else {
        setPourProgress(pourProg);
      }
    }, 60);
  };

  const triggerReturn2 = () => {
    let returnProg = 0;
    const returnInterval = setInterval(() => {
      returnProg += 0.05 * reactionSpeed;
      if (returnProg >= 1) {
        clearInterval(returnInterval);
        setExp2State('reacting');
        triggerPrecipitate2();
      } else {
        setPourProgress(returnProg);
      }
    }, 40);
  };

  const triggerPrecipitate2 = () => {
    // Precipitate settles, keeping mass strictly at 350.00g
    setTimeout(() => {
      setExp2State('done');
    }, 3000);
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-khtn8-pastel flex flex-col relative overflow-hidden font-sans text-slate-800">
      
      {/* 1. Header Toolbar (Glassmorphism Glass) */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-cyan-600 transition-all border border-slate-200/50 shadow-xs">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2 tracking-tight uppercase font-heading">
              <Beaker className="w-5 h-5 text-cyan-500 animate-pulse" /> MassConservation 3D Lab
            </h1>
            <p className="text-[10px] text-cyan-600 uppercase tracking-widest font-black leading-none mt-0.5">KHTN 8 • Định luật bảo toàn khối lượng</p>
          </div>
        </div>
        
        {/* Upper Controls */}
        <div className="flex items-center gap-3">
          {/* Quick experiment switches */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0 shadow-xs">
            <button 
              onClick={() => handleSwitchExp(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${currentExp === 1 ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              🧪 Phản ứng khí (NaHCO₃)
            </button>
            <button 
              onClick={() => handleSwitchExp(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${currentExp === 2 ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              🧪 Phản ứng kết tủa (BaSO₄)
            </button>
          </div>

          <button 
            onClick={toggleFullscreen} 
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all shrink-0 border border-slate-200/50 shadow-xs"
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. Main 3D Canvas Rendering Area */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing bg-transparent">
        
        {/* Glow ambient background graphics */}
        <div className="absolute top-[20%] left-[10%] w-[35%] h-[35%] bg-cyan-400/20 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] bg-rose-400/20 blur-[130px] rounded-full pointer-events-none"></div>

        <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 0.75, 6.3], fov: 42 }}>
          <LabScene 
            currentExp={currentExp}
            exp1State={exp1State}
            exp2State={exp2State}
            pourProgress={pourProgress}
            massReading={massReading}
          />
        </Canvas>

        {/* Active experiment guides (Left Panel) */}
        <div className="absolute left-6 top-28 z-40 max-w-xs w-full pointer-events-none hidden md:block">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/95 backdrop-blur-md border border-slate-200 p-5 rounded-2xl shadow-lg space-y-4 text-left"
          >
            <h4 className="text-cyan-600 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Hướng dẫn thao tác
            </h4>
            
            {currentExp === 1 ? (
              <div className="text-xs text-slate-600 space-y-3 font-semibold">
                <div className={`p-2.5 rounded-lg border transition-all ${exp1State === 'idle' ? 'bg-rose-50/60 border-rose-200 text-rose-700 shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400 font-medium'}`}>
                  <strong>Bước 1:</strong> Nhấp nút <strong className="text-slate-800">[Nhấc bóng đổ Baking Soda]</strong> ở góc điều khiển để đổ bột vào bình giấm.
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${exp1State === 'reacting' ? 'bg-cyan-50/60 border-cyan-200 text-cyan-700 shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400 font-medium'}`}>
                  <strong>Bước 2:</strong> Xem phản ứng xảy ra, khí thoát làm phồng bóng bay. Xem chỉ số cân (<strong className="text-slate-800">khối lượng bảo toàn 250g</strong>).
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${exp1State === 'done_sealed' ? 'bg-yellow-50/60 border-yellow-200 text-yellow-700 shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400 font-medium'}`}>
                  <strong>Bước 3:</strong> Click <strong className="text-slate-800">[Tháo bóng giải phóng khí]</strong> để tháo bong bóng và xem sự thoát khí làm giảm cân số.
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-600 space-y-3 font-semibold">
                <div className={`p-2.5 rounded-lg border transition-all ${exp2State === 'idle' ? 'bg-amber-50/60 border-amber-200 text-amber-700 shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400 font-medium'}`}>
                  <strong>Bước 1:</strong> Nhấp nút <strong className="text-slate-800">[Đổ dung dịch BaCl₂]</strong> để rót vào bình chứa dung dịch <span className="font-serif">Na₂SO₄</span>.
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${exp2State === 'pouring' ? 'bg-cyan-50/60 border-cyan-200 text-cyan-700 shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400 font-medium'}`}>
                  <strong>Bước 2:</strong> Xem phản ứng tạo kết tủa trắng tinh khiết Bari Sunfat (<span className="font-serif">BaSO₄↓</span>).
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${exp2State === 'reacting' || exp2State === 'done' ? 'bg-emerald-50/60 border-emerald-200 text-emerald-700 shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400 font-medium'}`}>
                  <strong>Bước 3:</strong> Hạt kết tủa lơ lửng rồi lắng xuống đáy bình. Chỉ số cân giữ nguyên tuyệt đối <strong className="text-slate-800">350.00g</strong>.
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* 2D Glassmorphic HUD overlay (Right Panel) showing interactive Chemical Equation Reveal Card */}
        <div className="absolute right-6 top-28 z-40 max-w-xs w-full pointer-events-none">
          <AnimatePresence mode="wait">
            {!showEquation ? (
              <motion.div
                key="hidden"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowEquation(true)}
                className="cursor-pointer pointer-events-auto bg-white/95 hover:bg-white border border-dashed border-cyan-300 hover:border-cyan-500 p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 text-center select-none shadow-md flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-500 transition-all duration-300">
                  <Eye className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-black text-sm tracking-wide font-heading">Phương trình phản ứng</h4>
                  <p className="text-[10px] text-cyan-600 uppercase tracking-wider font-bold mt-1">Bấm để hiển thị</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowEquation(false)}
                className="cursor-pointer pointer-events-auto bg-white border border-emerald-200 p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center select-none shadow-md flex flex-col gap-4"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Phương trình phản ứng
                  </span>
                  <span className="text-[10px] text-slate-400 hover:text-slate-600 transition-all flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Ẩn đi
                  </span>
                </div>
                <div className="py-3 flex flex-col items-center justify-center gap-1 select-text">
                  {currentExp === 1 ? (
                    <>
                      <p className="text-slate-800 text-base md:text-lg font-serif font-black tracking-wide leading-none">
                        CH₃COOH + NaHCO₃
                      </p>
                      <span className="text-emerald-500 font-black my-1 text-sm">↓</span>
                      <p className="text-slate-800 text-base md:text-lg font-serif font-black tracking-wide leading-none">
                        CH₃COONa + H₂O + CO₂↑
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-800 text-base md:text-lg font-serif font-black tracking-wide leading-none">
                        BaCl₂ + Na₂SO₄
                      </p>
                      <span className="text-emerald-500 font-black my-1 text-sm">↓</span>
                      <p className="text-slate-800 text-base md:text-lg font-serif font-black tracking-wide leading-none">
                        BaSO₄↓ + 2NaCl
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 3. Bottom HUD controls for triggers and pedagogical explanation */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/80 p-6 flex flex-col md:flex-row justify-between items-center gap-4 z-40 shadow-xl shrink-0">
        
        {/* Left Control switches */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm tracking-wide transition-all border border-slate-200 flex items-center gap-2 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" /> Làm lại thí nghiệm
          </button>

          {/* Speed switch */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold items-center shadow-xs">
            <span className="px-2.5 text-slate-500">Tốc độ:</span>
            <button 
              onClick={() => setReactionSpeed(1)}
              className={`px-3 py-1 rounded-lg transition-all ${reactionSpeed === 1 ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              1x
            </button>
            <button 
              onClick={() => setReactionSpeed(2.5)}
              className={`px-3 py-1 rounded-lg transition-all ${reactionSpeed === 2.5 ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              2.5x
            </button>
          </div>
        </div>

        {/* Center active action triggers */}
        <div className="flex gap-4">
          {currentExp === 1 ? (
            <>
              <button
                disabled={exp1State !== 'idle'}
                onClick={handleLiftBalloon}
                className="px-8 py-3.5 bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-black uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" /> Nhấc bóng đổ Baking Soda
              </button>

              <button
                disabled={exp1State !== 'done_sealed'}
                onClick={handleRemoveBalloon}
                className="px-6 py-3.5 bg-linear-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-black uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95"
              >
                <Eye className="w-5 h-5" /> Tháo bóng thoát khí
              </button>
            </>
          ) : (
            <button
              disabled={exp2State !== 'idle'}
              onClick={handlePourSolution2}
              className="px-8 py-3.5 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-black uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" /> Đổ dung dịch BaCl₂
            </button>
          )}
        </div>

        {/* Right Pedagogical popups */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQuiz(true)}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all text-sm shadow-md shrink-0 animate-pulse"
          >
            <Award className="w-4 h-4" /> Luyện tập trắc nghiệm
          </button>
          <button
            onClick={() => setShowExplanation(true)}
            className="px-6 py-3 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all text-sm shadow-md shrink-0"
          >
            <HelpCircle className="w-4 h-4" /> Xem giải thích
          </button>
        </div>

      </div>

      {/* 4. Pedagogical Explanation Modal Pop-up overlay */}
      <AnimatePresence>
        {showExplanation && (
          <ExplanationModal 
            expNum={currentExp} 
            onClose={() => setShowExplanation(false)} 
          />
        )}
        {showQuiz && (
          <QuizModal 
            onClose={() => setShowQuiz(false)} 
          />
        )}
      </AnimatePresence>
      
    </div>
  );
}
