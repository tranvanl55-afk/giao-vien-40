import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Heart, Zap } from 'lucide-react';
import { Question } from './GameHub';
import { motion, AnimatePresence } from 'motion/react';
import Matter from 'matter-js';
import { soundCorrect, soundWrong, soundStart, soundEnd } from '../../hooks/useGameSounds';

const MAX_LIVES = 3;

export function AngryKhtnGame({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'question' | 'shoot' | 'result'>('question');
  const [birdType, setBirdType] = useState<'bomb' | 'normal' | null>(null);
  const [showEffect, setShowEffect] = useState<'correct' | 'wrong' | null>(null);
  const [enemyHealth, setEnemyHealth] = useState(100);

  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const birdRef = useRef<Matter.Body | null>(null);
  const targetsRef = useRef<Matter.Body[]>([]);

  const shuffled = useRef([...questions].sort(() => Math.random() - 0.5)).current;
  const q = shuffled[qIdx % (shuffled.length || 1)];

  // Initialize Matter.js world
  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Composite, Events } = Matter;

    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      }
    });
    renderRef.current = render;

    // Ground & Boundaries
    const ground = Bodies.rectangle(width / 2, height - 20, width * 2, 40, { 
      isStatic: true,
      render: { fillStyle: '#166534' } // Green ground
    });
    const leftWall = Bodies.rectangle(0, height / 2, 20, height * 2, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(width, height / 2, 20, height * 2, { isStatic: true, render: { visible: false } });
    const ceiling = Bodies.rectangle(width / 2, -100, width * 2, 20, { isStatic: true, render: { visible: false } });

    World.add(world, [ground, leftWall, rightWall, ceiling]);

    // Slingshot base
    const slingBase = Bodies.rectangle(150, height - 80, 20, 100, {
      isStatic: true,
      render: { fillStyle: '#78350f' } // Brown wood
    });
    World.add(world, slingBase);

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      collisionFilter: {
        mask: 0x0002 // Only interact with bodies that have category 0x0002 (the bird)
      },
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    World.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;
    mouseConstraintRef.current = mouseConstraint;

    // Custom emoji rendering
    Events.on(render, 'afterRender', function() {
      const ctx = render.context;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const bodies = Composite.allBodies(engine.world);
      bodies.forEach(body => {
        if (body.plugin && body.plugin.emoji) {
          ctx.font = `${body.circleRadius ? body.circleRadius * 1.5 : 30}px Arial`;
          ctx.fillText(body.plugin.emoji, body.position.x, body.position.y);
        }
      });
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.canvas = null as any;
      render.context = null as any;
      render.textures = {};
    };
  }, []);

  // Handle phase changes (reset level)
  const setupLevel = useCallback((type: 'bomb' | 'normal') => {
    const { World, Bodies, Constraint, Composite } = Matter;
    const world = engineRef.current!.world;
    const width = sceneRef.current!.clientWidth;
    const height = sceneRef.current!.clientHeight;

    // Clear old dynamic bodies
    const staticBodies = world.bodies.filter(b => b.isStatic);
    World.clear(world, false);
    World.add(world, staticBodies);
    if (mouseConstraintRef.current) {
      World.add(world, mouseConstraintRef.current);
    }
    targetsRef.current = [];

    // 1. Create Bird
    const birdProps = type === 'bomb' 
      ? { radius: 25, mass: 5, restitution: 0.5, render: { fillStyle: '#1e293b' }, emoji: '🦅' } // Bomb (Eagle)
      : { radius: 20, mass: 1, restitution: 0.8, render: { fillStyle: '#ef4444' }, emoji: '🐦' }; // Normal Bird
      
    const bird = Bodies.circle(150, height - 130, birdProps.radius, {
      restitution: birdProps.restitution,
      render: birdProps.render,
      density: type === 'bomb' ? 0.05 : 0.005,
      collisionFilter: {
        category: 0x0002, // Special category for bird so mouse can grab it
      },
      plugin: { emoji: birdProps.emoji }
    });
    birdRef.current = bird;

    // Slingshot constraint
    const elastic = Constraint.create({
      pointA: { x: 150, y: height - 130 },
      bodyB: bird,
      stiffness: 0.05,
      render: { strokeStyle: '#fcd34d', lineWidth: 5 }
    });

    // 2. Create Structure (Right side)
    const startX = width - 200;
    const groundY = height - 40;
    
    // Stack of blocks
    const boxes = [];
    for (let i = 0; i < 3; i++) {
      boxes.push(Bodies.rectangle(startX - 40, groundY - 30 - i * 60, 40, 60, { render: { fillStyle: '#d97706' }, friction: 0.5 }));
      boxes.push(Bodies.rectangle(startX + 40, groundY - 30 - i * 60, 40, 60, { render: { fillStyle: '#d97706' }, friction: 0.5 }));
      boxes.push(Bodies.rectangle(startX, groundY - 60 - i * 60, 120, 20, { render: { fillStyle: '#92400e' }, friction: 0.5 }));
      
      // Target (Pig)
      const target = Bodies.circle(startX, groundY - 30 - i * 60, 20, {
        render: { fillStyle: '#22c55e', strokeStyle: '#166534', lineWidth: 2 },
        restitution: 0.5,
        plugin: { emoji: '🐷' }
      });
      targetsRef.current.push(target);
      boxes.push(target);
    }

    World.add(world, [bird, elastic, ...boxes]);

    // Shoot release logic
    Matter.Events.on(engineRef.current!, 'afterUpdate', function() {
      if (birdRef.current && elastic.bodyB) {
        if (birdRef.current.position.x > 180 && birdRef.current.speed > 5) {
          elastic.bodyB = null;
          birdRef.current.collisionFilter.category = 0x0001; // Cannot be grabbed again
          
          // Nếu sau 6 giây chưa qua màn (chim cùi bắp yếu quá không giết được heo) thì tự động qua câu tiếp theo
          setTimeout(() => {
            setPhase(p => {
              if (p === 'shoot') {
                setQIdx(i => i + 1);
                setEnemyHealth(100);
                return 'question';
              }
              return p;
            });
          }, 6000);
        }
      }
    });

    // Collision logic for damage
    Matter.Events.on(engineRef.current!, 'collisionStart', (event) => {
      let damage = 0;
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const isTarget = targetsRef.current.includes(bodyA) || targetsRef.current.includes(bodyB);
        if (isTarget) {
          const speedA = bodyA.speed;
          const speedB = bodyB.speed;
          if (speedA > 3 || speedB > 3) {
            damage += Math.max(speedA, speedB) * 1.5;
          }
        }
      });

      if (damage > 0) {
        setEnemyHealth(h => Math.max(0, h - damage));
      }
    });

  }, []); // Remove phase dependency to avoid multiple events

  useEffect(() => {
    if (phase === 'shoot' && enemyHealth <= 0) {
      const timer = setTimeout(() => {
        handleLevelComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [enemyHealth, phase]);

  const handleLevelComplete = useCallback(() => {
    setScore(s => s + 1);
    setQIdx(i => i + 1);
    setEnemyHealth(100);
    setPhase('question');
  }, []);

  const handleAnswer = (optIndex: number) => {
    if (showEffect || phase !== 'question') return;

    const isCorrect = optIndex === q?.answer;
    
    if (isCorrect) {
      soundCorrect();
      setBirdType('bomb');
      setShowEffect('correct');
      setTimeout(() => {
        setShowEffect(null);
        setPhase('shoot');
        setupLevel('bomb');
      }, 1500);
    } else {
      soundWrong();
      setBirdType('normal');
      setShowEffect('wrong');
      
      const currentLives = lives;
      setLives(l => l - 1);

      setTimeout(() => {
        setShowEffect(null);
        if (currentLives - 1 <= 0) {
          soundEnd();
          setPhase('result');
        } else {
          setPhase('shoot');
          setupLevel('normal');
        }
      }, 1500);
    }
  };

  if (questions.length === 0) return (
    <div className="h-screen bg-sky-950 flex items-center justify-center text-white text-center p-8">
      <div><p className="text-5xl mb-4">📭</p><p className="text-xl font-bold mb-4">Chưa có câu hỏi!</p>
        <button onClick={onBack} className="px-6 py-3 bg-blue-600 rounded-xl font-bold">Quay lại</button></div>
    </div>
  );

  if (phase === 'result') return (
    <div className="h-screen bg-linear-to-br from-slate-900 to-sky-950 flex flex-col items-center justify-center text-white gap-6">
      <div className="text-7xl">{lives > 0 ? '🏆' : '💔'}</div>
      <h2 className="text-4xl font-black text-yellow-300">{lives > 0 ? 'Xuất sắc!' : 'Trò chơi kết thúc!'}</h2>
      <p className="text-2xl font-bold text-slate-300">Điểm: <strong className="text-green-400">{score}</strong> / {shuffled.length}</p>
      <div className="flex gap-3">
        <button onClick={() => { soundStart(); setQIdx(0); setLives(MAX_LIVES); setScore(0); setPhase('question'); }}
          className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-400 rounded-2xl font-black text-white">
          <RotateCcw className="w-5 h-5" /> Chơi lại
        </button>
        <button onClick={onBack} className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-black">Thoát</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen relative overflow-hidden bg-linear-to-b from-sky-300 via-sky-200 to-green-100 select-none">
      {/* Matter.js Canvas Container */}
      <div ref={sceneRef} className="absolute inset-0 z-0 pointer-events-auto" style={{ pointerEvents: phase === 'shoot' ? 'auto' : 'none' }} />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-xs gap-3">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-bold text-slate-800 hover:bg-black/30 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Thoát
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-slate-400/50 fill-transparent'}`} />
            ))}
          </div>
        </div>

        {/* Health Bar for Pigs */}
        <div className="flex-1 max-w-md w-full flex items-center gap-3">
          <img src="https://img.icons8.com/color/96/bad-piggies.png" className="w-8 h-8" alt="Pig" />
          <div className="flex-1 h-4 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700 relative shadow-inner">
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-linear-to-r from-red-500 to-green-500 transition-all duration-300"
              style={{ width: `${enemyHealth}%` }}
            />
          </div>
          <span className="text-white font-black text-sm drop-shadow-md w-12">{Math.ceil(enemyHealth)}%</span>
        </div>

        <div className="flex items-center gap-3 bg-white/50 px-4 py-1 rounded-full border border-white/50 w-fit shrink-0">
          <span className="text-yellow-600 font-black text-lg flex items-center gap-1"><Zap className="w-5 h-5 fill-yellow-500"/> {score}</span>
        </div>
      </div>

      {/* Question Phase Overlay */}
      <AnimatePresence>
        {phase === 'question' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, y: -50 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-4 border-sky-200 text-center">
              <h3 className="text-sky-600 font-black text-xl mb-2 uppercase tracking-wider">Trạm Nạp Đạn</h3>
              <p className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                {q?.text}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="p-4 bg-slate-50 hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-400 rounded-2xl text-lg font-bold text-slate-700 transition-all hover:scale-105 active:scale-95 text-left flex items-center gap-4 group"
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-sky-200 flex items-center justify-center text-sm">{['A','B','C','D'][i]}</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shoot Phase Overlay */}
      <AnimatePresence>
        {phase === 'shoot' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          >
            <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white flex items-center gap-3">
               <span className="text-2xl">{birdType === 'bomb' ? '🦅' : '🐦'}</span>
               <div>
                  <p className="font-black text-slate-800">Kéo chim để bắn!</p>
                  <p className="text-xs font-bold text-slate-500">Phá hủy toàn bộ mục tiêu</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Effect Overlay */}
      <AnimatePresence>
        {showEffect && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className={`flex flex-col items-center gap-4 p-8 rounded-3xl backdrop-blur-md border-4 shadow-2xl
              ${showEffect === 'correct' ? 'bg-green-500/20 border-green-400 text-green-600' : 'bg-red-500/20 border-red-400 text-red-600'}`}>
              <div className="text-8xl">{showEffect === 'correct' ? '✅' : '❌'}</div>
              <h2 className="text-4xl font-black">
                {showEffect === 'correct' ? 'Tuyệt Vời!' : 'Sai Rồi!'}
              </h2>
              <p className="text-xl font-bold">
                {showEffect === 'correct' ? 'Nhận chim XỊN 🦅' : 'Chỉ có chim CÙI BẮP 🐦'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
