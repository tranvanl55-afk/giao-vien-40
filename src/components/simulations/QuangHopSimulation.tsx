import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Info, Sun, Droplets, Wind } from 'lucide-react';

interface Molecule { id: number; x: number; y: number; vx: number; vy: number; type: 'co2' | 'h2o' | 'o2' | 'glucose'; }

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

const MOLECULE_COLORS = {
  co2: '#ef4444',
  h2o: '#60a5fa',
  o2: '#34d399',
  glucose: '#f59e0b',
};

const MOLECULE_LABELS = {
  co2: 'CO₂',
  h2o: 'H₂O',
  o2: 'O₂',
  glucose: 'C₆H₁₂O₆',
};

export function QuangHopSimulation({ onBack }: { onBack: () => void }) {
  const [light, setLight] = useState(70);  // 0-100
  const [co2, setCo2] = useState(60);      // 0-100
  const [water, setWater] = useState(80);  // 0-100

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const molsRef = useRef<Molecule[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const leafImgRef = useRef<HTMLImageElement | null>(null);
  
  // State to store absorbed molecules for reactions
  const organellesRef = useRef<{
    chloroplasts: { x: number, y: number, r: number, h2o: number, co2: number }[],
    mitochondria: { x: number, y: number, r: number, o2: number, glucose: number }[]
  }>({ chloroplasts: [], mitochondria: [] });

  // Rate of photosynthesis: 0-1
  const rate = (light / 100) * (co2 / 100) * (water / 100);
  const ratePercent = Math.round(rate * 100);

  const o2Rate = Math.round(rate * 12);
  const glucoseRate = Math.round(rate * 2);

  const isRespiration = light < 5;
  const respRate = isRespiration ? 8 : 0; // Constant respiration rate at night

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d')!;

    // Initialize leaf image
    if (!leafImgRef.current) {
      const img = new Image();
      // Removed crossOrigin to avoid CORS blocking since we don't need to read canvas pixels
      img.src = 'https://img.upanhnhanh.com/e95d2d09ef272ee86adc2b076663efb4';
      img.onload = () => {
        leafImgRef.current = img;
      };
      img.onerror = () => {
        console.error("Lỗi tải ảnh lá từ URL");
      };
    }

    // Initialize molecules
    if (molsRef.current.length === 0) {
      for (let i = 0; i < 8; i++) {
        // CO2 in the air (right side)
        molsRef.current.push({ id: i, x: W - 10 - Math.random() * 60, y: Math.random() * H, vx: -0.3 - Math.random() * 0.5, vy: (Math.random() - 0.5) * 0.3, type: 'co2' });
        // H2O from the stem (left side)
        molsRef.current.push({ id: i + 100, x: W / 2 - W * 0.25, y: H / 2, vx: 0.3 + Math.random() * 0.5, vy: (Math.random() - 0.5) * 0.3, type: 'h2o' });
      }
    }

    const draw = (time: number) => {
      timeRef.current = time;
      ctx.clearRect(0, 0, W, H);

      // Sky background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.5);
      const lightIntensity = light / 100;
      
      if (isRespiration) {
        // Night sky
        skyGrad.addColorStop(0, '#020617'); // slate-950
        skyGrad.addColorStop(1, '#1e1b4b'); // indigo-950
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H * 0.5);

        // Draw stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let s = 0; s < 20; s++) {
          const sx = (Math.sin(s * 12.3) * 0.5 + 0.5) * W;
          const sy = (Math.cos(s * 8.7) * 0.5 + 0.5) * H * 0.4;
          const sr = (Math.sin(s * 4.2 + time * 0.002) * 0.5 + 0.5) * 1.5;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Day sky
        skyGrad.addColorStop(0, `rgba(${Math.round(lerp(20, 135, lightIntensity))}, ${Math.round(lerp(30, 185, lightIntensity))}, ${Math.round(lerp(80, 235, lightIntensity))}, 1)`);
        skyGrad.addColorStop(1, `rgba(${Math.round(lerp(10, 80, lightIntensity))}, ${Math.round(lerp(20, 120, lightIntensity))}, ${Math.round(lerp(60, 180, lightIntensity))}, 1)`);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H * 0.5);
      }

      // Ground
      const groundGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
      groundGrad.addColorStop(0, '#2d4a1e');
      groundGrad.addColorStop(1, '#1a2e10');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, H * 0.5, W, H * 0.5);

      // Sun
      if (light > 5) {
        const sunX = W * 0.85;
        const sunY = lerp(H * 0.6, H * 0.1, light / 100);
        const sunR = lerp(20, 45, light / 100);

        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3);
        sunGlow.addColorStop(0, `rgba(255,240,100,${0.3 * lightIntensity})`);
        sunGlow.addColorStop(1, 'rgba(255,240,100,0)');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, W, H * 0.5);

        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,230,50,${clamp(lightIntensity, 0.3, 1)})`;
        ctx.fill();

        // Sun rays
        if (light > 30) {
          ctx.strokeStyle = `rgba(255,230,50,${0.4 * lightIntensity})`;
          ctx.lineWidth = 2;
          for (let r = 0; r < 8; r++) {
            const rAngle = (r / 8) * Math.PI * 2 + time * 0.0003;
            ctx.beginPath();
            ctx.moveTo(sunX + Math.cos(rAngle) * sunR * 1.2, sunY + Math.sin(rAngle) * sunR * 1.2);
            ctx.lineTo(sunX + Math.cos(rAngle) * sunR * 2.2, sunY + Math.sin(rAngle) * sunR * 2.2);
            ctx.stroke();
          }
        }
      }

      // Leaf shape positioning
      const leafCx = W / 2;
      const leafCy = H / 2;
      const leafW = W * 0.7; // Make leaf image slightly larger
      const leafH = H * 0.7;

      ctx.save();
      if (leafImgRef.current) {
        // Draw the leaf image
        ctx.translate(leafCx, leafCy);
        // The image might need rotation if it doesn't align with our horizontal flow
        // ctx.rotate(-0.15); // Adjust this if the leaf image is tilted
        ctx.drawImage(leafImgRef.current, -leafW / 2, -leafH / 2, leafW, leafH);
      } else {
        // Fallback loading state
        ctx.fillStyle = 'rgba(22, 101, 52, 0.2)';
        ctx.beginPath();
        ctx.ellipse(leafCx, leafCy, leafW / 2, leafH / 2, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Đang tải ảnh lá...', leafCx, leafCy);
      }
      ctx.restore();

      // Initialize Organelles (Chloroplasts and Mitochondria) once
      if (organellesRef.current.chloroplasts.length === 0) {
        const tilt = -0.4; // Leaf image tilt angle (~-23 degrees)
        const totalOrganelles = 20;
        
        const getSpiralPos = (i: number, total: number) => {
          // Golden ratio angle (137.5 degrees) for even natural distribution
          const angle = i * 2.39996;
          // Radius scaling from center to edge
          const r = Math.sqrt((i + 1) / total); 
          const ex = Math.cos(angle) * r * leafW * 0.4;
          const ey = Math.sin(angle) * r * leafH * 0.25;
          // Rotate point around center
          const rx_rot = ex * Math.cos(tilt) - ey * Math.sin(tilt);
          const ry_rot = ex * Math.sin(tilt) + ey * Math.cos(tilt);
          return { x: leafCx + rx_rot, y: leafCy + ry_rot };
        };

        // 8 Mitochondria distributed among 20 positions
        const isMtIndices = new Set([1, 4, 6, 9, 11, 14, 16, 19]);

        for (let i = 0; i < totalOrganelles; i++) {
          const pos = getSpiralPos(i, totalOrganelles);
          if (isMtIndices.has(i)) {
            organellesRef.current.mitochondria.push({
              x: pos.x, y: pos.y, r: 10, o2: 0, glucose: 0
            });
          } else {
            organellesRef.current.chloroplasts.push({
              x: pos.x, y: pos.y, r: 12, h2o: 0, co2: 0
            });
          }
        }
      }

      const { chloroplasts, mitochondria } = organellesRef.current;

      // Draw Chloroplasts
      chloroplasts.forEach((cp) => {
        ctx.beginPath();
        ctx.ellipse(cp.x, cp.y, cp.r, cp.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#16a34a'; // Base green
        ctx.fill();
        
        // Glow effect based on photosynthesis rate
        if (!isRespiration && rate > 0.05) {
          ctx.strokeStyle = `rgba(134, 239, 172, ${rate})`; 
          ctx.lineWidth = 1 + rate * 2;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(22, 101, 52, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw Mitochondria
      mitochondria.forEach((mt) => {
        ctx.beginPath();
        ctx.ellipse(mt.x, mt.y, mt.r, mt.r * 0.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ea580c'; // Orange base
        ctx.fill();
        
        // Inner zig-zag (cristae)
        ctx.beginPath();
        ctx.moveTo(mt.x - 5, mt.y - 2);
        ctx.lineTo(mt.x - 2, mt.y + 2);
        ctx.lineTo(mt.x + 2, mt.y - 2);
        ctx.lineTo(mt.x + 5, mt.y + 2);
        ctx.strokeStyle = '#fdba74'; // Lighter orange
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glow effect during respiration
        if (isRespiration) {
          ctx.strokeStyle = `rgba(253, 186, 116, 0.8)`; 
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(154, 52, 18, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      ctx.restore();

      // Light beams entering leaf
      if (light > 15) {
        for (let b = 0; b < 5; b++) {
          const bx = leafCx - leafW * 0.3 + b * (leafW * 0.15);
          ctx.save();
          ctx.globalAlpha = 0.15 * lightIntensity;
          const beamGrad = ctx.createLinearGradient(bx, 0, bx + 20, leafCy);
          beamGrad.addColorStop(0, '#fef08a');
          beamGrad.addColorStop(1, 'rgba(254,240,138,0)');
          ctx.fillStyle = beamGrad;
          ctx.fillRect(bx, 0, 15, leafCy);
          ctx.restore();
        }
      }

      // Molecule particles animation
      const reactZone = { x: leafCx - leafW * 0.4, y: leafCy - leafH * 0.3, w: leafW * 0.8, h: leafH * 0.6 };

      // Spawn new reactant molecules
      if (!isRespiration) {
        // --- PHOTOSYNTHESIS SPAWNING ---
        // 1. Water flowing in from the stem (bottom-left)
        if (water > 10 && Math.random() < (water / 100) * 0.08) {
          molsRef.current.push({
            id: Date.now() + Math.random(),
            x: leafCx - leafW * 0.35 + (Math.random() - 0.5) * 20, 
            y: leafCy + leafH * 0.25 + (Math.random() - 0.5) * 20,
            vx: 0.5 + Math.random() * 0.3, 
            vy: -0.3 + (Math.random() - 0.5) * 0.4, // flows diagonally up-right
            type: 'h2o',
          });
        }

        // 2. CO2 diffusing from the air
        if (co2 > 10 && Math.random() < (co2 / 100) * 0.05) {
          molsRef.current.push({
            id: Date.now() + Math.random(),
            x: W + 10,
            y: H * 0.1 + Math.random() * H * 0.8,
            vx: -0.5 - Math.random() * 0.4,
            vy: (Math.random() - 0.5) * 0.3,
            type: 'co2',
          });
        }
      } else {
        // --- RESPIRATION SPAWNING ---
        // 1. O2 diffusing from the air
        if (Math.random() < 0.05) {
          molsRef.current.push({
            id: Date.now() + Math.random(),
            x: W + 10,
            y: H * 0.1 + Math.random() * H * 0.8,
            vx: -0.5 - Math.random() * 0.4,
            vy: (Math.random() - 0.5) * 0.3,
            type: 'o2',
          });
        }
        // 2. Glucose coming from the leaf stores/stem (bottom-left)
        if (Math.random() < 0.02) {
          molsRef.current.push({
            id: Date.now() + Math.random(),
            x: leafCx - leafW * 0.35 + (Math.random() - 0.5) * 20, 
            y: leafCy + leafH * 0.25 + (Math.random() - 0.5) * 20,
            vx: 0.5 + Math.random() * 0.3, 
            vy: -0.3 + (Math.random() - 0.5) * 0.4, // flows diagonally up-right
            type: 'glucose',
          });
        }
      }

      // Update and draw molecules
      const nextMols: Molecule[] = [];
      molsRef.current.forEach(mol => {
        mol.x += mol.vx;
        mol.y += mol.vy;

        // Check collisions with organelles
        let absorbed = false;

        if (!isRespiration && rate > 0.01 && (mol.type === 'co2' || mol.type === 'h2o')) {
          for (const cp of chloroplasts) {
            if (Math.hypot(mol.x - cp.x, mol.y - cp.y) < cp.r + 5) {
              if (mol.type === 'co2') cp.co2 = Math.min(cp.co2 + 1, 3);
              if (mol.type === 'h2o') cp.h2o = Math.min(cp.h2o + 1, 3);
              absorbed = true;
              break;
            }
          }
        } else if (isRespiration && (mol.type === 'o2' || mol.type === 'glucose')) {
          for (const mt of mitochondria) {
            if (Math.hypot(mol.x - mt.x, mol.y - mt.y) < mt.r + 5) {
              if (mol.type === 'o2') mt.o2 = Math.min(mt.o2 + 1, 3);
              if (mol.type === 'glucose') mt.glucose = Math.min(mt.glucose + 1, 3);
              absorbed = true;
              break;
            }
          }
        }

        if (absorbed) return; // Molecule is consumed by organelle

        // Remove if off screen
        if (mol.x < -30 || mol.x > W + 30 || mol.y < -30 || mol.y > H + 30) return;

        nextMols.push(mol);

        // Draw molecule
        ctx.beginPath();
        ctx.arc(mol.x, mol.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = MOLECULE_COLORS[mol.type];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 5px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(MOLECULE_LABELS[mol.type].substring(0, 2), mol.x, mol.y);
      });

      // Process organelles reactions
      if (!isRespiration && rate > 0.01) {
        chloroplasts.forEach(cp => {
          // Need 1 CO2 and 1 H2O to produce 1 O2 and 1 Glucose
          if (cp.co2 >= 1 && cp.h2o >= 1 && Math.random() < 0.2 + rate * 0.2) {
            cp.co2--;
            cp.h2o--;
            // Spawn O2 (diffuses out to air, up-right)
            nextMols.push({ id: Date.now() + Math.random(), x: cp.x, y: cp.y, type: 'o2', vx: 0.5 + Math.random() * 0.5, vy: -0.5 - Math.random() * 0.5 });
            // Spawn Glucose (flows back to stem, down-left)
            nextMols.push({ id: Date.now() + Math.random(), x: cp.x, y: cp.y, type: 'glucose', vx: -0.4 - Math.random() * 0.3, vy: 0.2 + Math.random() * 0.3 });
          }
        });
      } else if (isRespiration) {
        mitochondria.forEach(mt => {
          // Need 1 O2 and 1 Glucose to produce 1 CO2 and 1 H2O
          if (mt.o2 >= 1 && mt.glucose >= 1 && Math.random() < 0.3) {
            mt.o2--;
            mt.glucose--;
            // Spawn CO2 (diffuses out to air, up-right)
            nextMols.push({ id: Date.now() + Math.random(), x: mt.x, y: mt.y, type: 'co2', vx: 0.5 + Math.random() * 0.5, vy: -0.3 - Math.random() * 0.4 });
            // Spawn H2O (diffuses out to air, up-right)
            nextMols.push({ id: Date.now() + Math.random(), x: mt.x, y: mt.y, type: 'h2o', vx: 0.5 + Math.random() * 0.5, vy: -0.3 - Math.random() * 0.4 });
          }
        });
      }

      molsRef.current = nextMols.slice(0, 45); // Cap at 45

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [light, co2, water, rate]);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">🌿 Nhà Máy Quang Hợp & Hô Hấp</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 7</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all ${isRespiration ? 'bg-indigo-900/40 border-indigo-700 text-indigo-300' : ratePercent > 60 ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' : ratePercent > 20 ? 'bg-amber-900/40 border-amber-700 text-amber-300' : 'bg-red-900/40 border-red-700 text-red-300'}`}>
          {isRespiration ? `🌙 Hô hấp: Hoạt động` : `⚡ Tốc độ: ${ratePercent}%`}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={800} height={500}
            className="rounded-3xl border border-slate-800 shadow-2xl max-w-full" />
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-[11px]">
            {Object.entries(MOLECULE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                <span className="text-slate-400">{MOLECULE_LABELS[type as keyof typeof MOLECULE_LABELS]}</span>
              </div>
            ))}
            <div className="w-px h-4 bg-slate-700 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 rounded-full bg-green-600 border border-green-400"></div>
              <span className="text-slate-400">Lục lạp</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 rounded-full bg-orange-600 border border-orange-400"></div>
              <span className="text-slate-400">Ti thể</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full lg:w-80 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col gap-5">
          {/* Sliders */}
          {[
            { icon: <Sun className="w-4 h-4 text-yellow-400" />, label: 'Ánh sáng', value: light, set: setLight, color: '#fbbf24', gradient: 'from-slate-700 to-yellow-400' },
            { icon: <Wind className="w-4 h-4 text-red-400" />, label: 'CO₂', value: co2, set: setCo2, color: '#ef4444', gradient: 'from-slate-700 to-red-400' },
            { icon: <Droplets className="w-4 h-4 text-blue-400" />, label: 'Nước (H₂O)', value: water, set: setWater, color: '#60a5fa', gradient: 'from-slate-700 to-blue-400' },
          ].map(({ icon, label, value, set, color, gradient }) => (
            <div key={label} className="bg-slate-800/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold">{icon} <span className="text-sm text-slate-200">{label}</span></div>
                <span className="text-xl font-black" style={{ color }}>{value}%</span>
              </div>
              <input type="range" min={0} max={100} value={value} onChange={e => set(Number(e.target.value))}
                className="w-full cursor-pointer" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Không có</span><span>Tối đa</span>
              </div>
            </div>
          ))}

          {/* Equation */}
          <div className={`${isRespiration ? 'bg-indigo-950/30 border-indigo-800/40' : 'bg-emerald-950/30 border-emerald-800/40'} border rounded-2xl p-4 transition-all duration-500`}>
            <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${isRespiration ? 'text-indigo-400' : 'text-emerald-400'}`}>
              {isRespiration ? '🌙 Phương trình hô hấp' : '🌿 Phương trình quang hợp'}
            </h3>
            <div className="bg-slate-950/50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {isRespiration ? (
                  <>C₆H₁₂O₆ + 6O₂ <span className="text-indigo-400">→</span> 6CO₂ + 6H₂O + <span className="text-amber-400">ATP</span></>
                ) : (
                  <>6CO₂ + 6H₂O <span className="text-yellow-400">→(ánh sáng)</span> C₆H₁₂O₆ + 6O₂</>
                )}
              </p>
            </div>
          </div>

          {/* Output rates */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`${isRespiration ? 'bg-red-950/30 border-red-800/40' : 'bg-emerald-950/30 border-emerald-800/40'} border rounded-2xl p-3 text-center transition-all duration-500`}>
              <div className={`text-xl font-black ${isRespiration ? 'text-red-400' : 'text-emerald-400'}`}>
                {isRespiration ? respRate * 6 : o2Rate}
              </div>
              <div className="text-[10px] text-slate-400">{isRespiration ? 'CO₂ sinh ra' : 'O₂/phút'}</div>
            </div>
            <div className={`${isRespiration ? 'bg-blue-950/30 border-blue-800/40' : 'bg-amber-950/30 border-amber-800/40'} border rounded-2xl p-3 text-center transition-all duration-500`}>
              <div className={`text-xl font-black ${isRespiration ? 'text-blue-400' : 'text-amber-400'}`}>
                {isRespiration ? respRate * 6 : glucoseRate}
              </div>
              <div className="text-[10px] text-slate-400">{isRespiration ? 'H₂O sinh ra' : 'Glucose/phút'}</div>
            </div>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200 leading-relaxed">Thử kéo một thanh xuống 0 — quang hợp sẽ dừng hoàn toàn dù các yếu tố khác tối đa!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
