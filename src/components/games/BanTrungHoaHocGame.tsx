import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Trophy, AlertCircle } from 'lucide-react';

const COLORS = {
  'Na+': '#facc15',   // Yellow
  'Ca2+': '#fb923c',  // Orange
  'Al3+': '#94a3b8',  // Slate
  'Cl-': '#4ade80',   // Green
  'SO4 2-': '#60a5fa',// Blue
  'PO4 3-': '#c084fc',// Purple
};

const CHARGES: Record<string, number> = {
  'Na+': 1,
  'Ca2+': 2,
  'Al3+': 3,
  'Cl-': -1,
  'SO4 2-': -2,
  'PO4 3-': -3,
};

const ALL_IONS = Object.keys(CHARGES);

// Constants
const R = 20; // Radius
const D = R * 2; // Diameter
const ROW_HEIGHT = R * Math.sqrt(3);
const COLS = 12;
const WIDTH = COLS * D; // 480
const HEIGHT = 600;

interface Bubble {
  id: string;
  type: string;
  row: number;
  col: number;
  x: number;
  y: number;
  popping?: boolean;
  falling?: boolean;
  vx?: number;
  vy?: number;
}

export function BanTrungHoaHocGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Game State Ref for game loop
  const gameState = useRef({
    grid: [] as Bubble[],
    shooter: {
      x: WIDTH / 2,
      y: HEIGHT - 30,
      angle: Math.PI / 2, // Up
      currentBubbleType: getRandomIon(),
      nextBubbleType: getRandomIon(),
    },
    projectile: null as Bubble | null,
    score: 0,
    misses: 0,
    topOffsetRows: 0,
    gameOver: false,
    particles: [] as any[]
  });

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function getRandomIon() {
    return ALL_IONS[Math.floor(Math.random() * ALL_IONS.length)];
  }

  // Initialize Grid
  const initGame = useCallback(() => {
    const grid: Bubble[] = [];
    // 5 rows of random bubbles
    for (let r = 0; r < 5; r++) {
      const isShifted = r % 2 !== 0;
      const colsInRow = isShifted ? COLS - 1 : COLS;
      for (let c = 0; c < colsInRow; c++) {
        grid.push({
          id: `${r}-${c}-${Date.now()}`,
          type: getRandomIon(),
          row: r,
          col: c,
          x: getX(r, c),
          y: getY(r)
        });
      }
    }
    
    gameState.current = {
      grid,
      shooter: {
        x: WIDTH / 2,
        y: HEIGHT - 30,
        angle: Math.PI / 2,
        currentBubbleType: getRandomIon(),
        nextBubbleType: getRandomIon(),
      },
      projectile: null,
      score: 0,
      misses: 0,
      topOffsetRows: 0,
      gameOver: false,
      particles: []
    };
    
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Math helpers
  function getX(row: number, col: number) {
    const isShifted = Math.abs(row) % 2 === 1;
    return isShifted ? (col * D) + D : (col * D) + R;
  }
  
  function getY(row: number) {
    return (row * ROW_HEIGHT) + R;
  }

  function getGridPosition(x: number, y: number): {row: number, col: number} {
    let row = Math.round((y - R) / ROW_HEIGHT);
    const isShifted = Math.abs(row) % 2 === 1;
    let col = isShifted ? Math.round((x - D) / D) : Math.round((x - R) / D);
    
    // Bounds check
    if (row < 0) row = 0;
    const maxCols = isShifted ? COLS - 1 : COLS;
    if (col < 0) col = 0;
    if (col >= maxCols) col = maxCols - 1;
    
    return { row, col };
  }

  // Mouse / Touch tracking for aiming
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || gameState.current.gameOver || gameState.current.projectile) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const dx = mouseX - gameState.current.shooter.x;
    const dy = gameState.current.shooter.y - mouseY;
    let angle = Math.atan2(dy, dx);
    // Limit angle to avoid shooting straight left/right or down
    if (angle < 0.2) angle = 0.2;
    if (angle > Math.PI - 0.2) angle = Math.PI - 0.2;
    
    gameState.current.shooter.angle = angle;
  };

  const handleFire = () => {
    if (gameState.current.gameOver || gameState.current.projectile) return;
    
    const speed = 15;
    const angle = gameState.current.shooter.angle;
    
    gameState.current.projectile = {
      id: `proj-${Date.now()}`,
      type: gameState.current.shooter.currentBubbleType,
      row: -1, col: -1,
      x: gameState.current.shooter.x,
      y: gameState.current.shooter.y,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed
    };
    
    gameState.current.shooter.currentBubbleType = gameState.current.shooter.nextBubbleType;
    gameState.current.shooter.nextBubbleType = getRandomIon();
  };

  // Game Loop
  const update = () => {
    const state = gameState.current;
    if (!state.gameOver) {
      updateProjectile(state);
      updateFallingBubbles(state);
      updateParticles(state);
    }
    render(state);
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  function updateProjectile(state: any) {
    if (!state.projectile) return;
    const p = state.projectile;
    
    p.x += p.vx;
    p.y += p.vy;
    
    // Wall bounces
    if (p.x - R < 0) { p.x = R; p.vx *= -1; }
    if (p.x + R > WIDTH) { p.x = WIDTH - R; p.vx *= -1; }
    
    // Collision checking
    let collided = false;
    
    // Check ceiling (row 0 + offset)
    if (p.y - R <= getY(state.topOffsetRows)) {
      collided = true;
    } else {
      // Check collision with other bubbles
      for (const b of state.grid) {
        if (b.falling || b.popping) continue;
        const distSq = (p.x - b.x)**2 + (p.y - b.y)**2;
        if (distSq <= (D - 2)**2) {
          collided = true;
          break;
        }
      }
    }
    
    if (collided) {
      snapProjectile(state);
    }
  }

  function snapProjectile(state: any) {
    const p = state.projectile;
    state.projectile = null;
    
    // Determine closest grid cell
    const pos = getGridPosition(p.x, p.y);
    
    // Basic collision resolution: if occupied, search adjacent cells
    const cellKey = (r: number, c: number) => `${r},${c}`;
    const occupied = new Set(state.grid.filter((b: any) => !b.falling).map((b: any) => cellKey(b.row, b.col)));
    
    let finalRow = pos.row;
    let finalCol = pos.col;
    
    if (occupied.has(cellKey(finalRow, finalCol))) {
      // Find nearest empty cell (simplified BFS)
      let minD = Infinity;
      const neighbors = getNeighbors(pos.row, pos.col);
      for (const n of neighbors) {
        if (n.r >= state.topOffsetRows && !occupied.has(cellKey(n.r, n.c))) {
          const nx = getX(n.r, n.c);
          const ny = getY(n.r);
          const d = (p.x - nx)**2 + (p.y - ny)**2;
          if (d < minD) {
            minD = d;
            finalRow = n.r;
            finalCol = n.c;
          }
        }
      }
    }
    
    // Ensure row is at least topOffsetRows
    if (finalRow < state.topOffsetRows) finalRow = state.topOffsetRows;
    
    const newBubble = {
      id: `grid-${Date.now()}`,
      type: p.type,
      row: finalRow,
      col: finalCol,
      x: getX(finalRow, finalCol),
      y: getY(finalRow)
    };
    
    state.grid.push(newBubble);
    
    // Check game over
    if (newBubble.y >= HEIGHT - 100) {
      state.gameOver = true;
      setGameOver(true);
      return;
    }
    
    // Check Matches (The Chemistry Rule)
    checkMatches(state, newBubble);
  }

  function getNeighbors(row: number, col: number) {
    const isShifted = Math.abs(row) % 2 === 1;
    const maxCols = isShifted ? COLS - 1 : COLS;
    const res = [];
    
    const dirs = isShifted ? 
      [ [0,-1], [0,1], [-1,0], [-1,1], [1,0], [1,1] ] : 
      [ [0,-1], [0,1], [-1,-1], [-1,0], [1,-1], [1,0] ];
      
    for (const [dr, dc] of dirs) {
      const r = row + dr;
      const c = col + dc;
      const mCols = Math.abs(r) % 2 === 1 ? COLS - 1 : COLS;
      if (r >= 0 && c >= 0 && c < mCols) {
        res.push({r, c});
      }
    }
    return res;
  }

  function checkMatches(state: any, landedBubble: Bubble) {
    const gridMap = new Map<string, Bubble>();
    for (const b of state.grid) {
      if (!b.falling && !b.popping) {
        gridMap.set(`${b.row},${b.col}`, b);
      }
    }

    const startCharge = CHARGES[landedBubble.type];
    const neighbors = getNeighbors(landedBubble.row, landedBubble.col)
        .map(n => gridMap.get(`${n.r},${n.c}`))
        .filter(b => b);

    let matchFound = false;
    let matchedCluster: Bubble[] = [];

    // TÌM CỤM TẠO THÀNH HỢP CHẤT CÓ TỔNG ĐIỆN TÍCH BẰNG 0
    // Lấy danh sách các loại ion kề cạnh có dấu điện tích TRÁI NGƯỢC với viên vừa bắn
    const oppositeNeighbors = neighbors.filter(b => b && (CHARGES[b.type] * startCharge < 0));
    const testedTypes = new Set<string>();

    for (const n of oppositeNeighbors) {
      if (!n) continue;
      const targetType = n.type;
      if (testedTypes.has(targetType)) continue;
      testedTypes.add(targetType);

      const allowedTypes = [landedBubble.type, targetType];
      let bestMatch: Bubble[] | null = null;

      function dfs(currentSubset: Bubble[], currentCharge: number) {
        if (currentCharge === 0 && currentSubset.length > 1) {
          bestMatch = [...currentSubset];
          return;
        }
        if (bestMatch) return;
        if (currentSubset.length >= 6) return; // Giới hạn kích thước phân tử lớn nhất là 6 (ví dụ Al2(SO4)3 là 5)

        const candidates = new Set<Bubble>();
        for (const b of currentSubset) {
          const nbs = getNeighbors(b.row, b.col)
            .map(pos => gridMap.get(`${pos.r},${pos.c}`))
            .filter(nb => nb && allowedTypes.includes(nb.type) && !currentSubset.find(x => x.id === nb.id));
          for (const nb of nbs) {
            candidates.add(nb!);
          }
        }

        for (const candidate of candidates) {
          currentSubset.push(candidate);
          dfs(currentSubset, currentCharge + CHARGES[candidate.type]);
          currentSubset.pop();
          if (bestMatch) return;
        }
      }

      dfs([landedBubble], startCharge);

      if (bestMatch) {
        matchFound = true;
        matchedCluster = bestMatch;
        break;
      }
    }

    if (matchFound) {
      // Pop them!
      for (const b of matchedCluster) {
        b.popping = true;
        createParticles(state, b.x, b.y, COLORS[b.type as keyof typeof COLORS]);
      }
      // Set timeout to actually remove them and check drops
      setTimeout(() => {
        state.grid = state.grid.filter((b: any) => !matchedCluster.find(m => m.id === b.id));
        checkFloatingBubbles(state);
        
        state.score += matchedCluster.length * 10;
        setScore(state.score);
      }, 100);
      
      state.misses = 0; // Reset miss counter
    } else {
      // Missed
      state.misses++;
      if (state.misses >= 5) { // Drops ceiling every 5 misses
        state.misses = 0;
        state.topOffsetRows++;
        dropCeiling(state);
      }
    }
  }

  function checkFloatingBubbles(state: any) {
    const gridMap = new Map<string, Bubble>();
    for (const b of state.grid) {
      if (!b.falling && !b.popping) {
        gridMap.set(`${b.row},${b.col}`, b);
      }
    }

    const visited = new Set<string>();
    const queue: Bubble[] = [];

    // Start BFS from top row
    for (const b of state.grid) {
      if (b.row === state.topOffsetRows && !b.falling && !b.popping) {
        queue.push(b);
        visited.add(b.id);
      }
    }

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const neighbors = getNeighbors(curr.row, curr.col)
          .map(pos => gridMap.get(`${pos.r},${pos.c}`))
          .filter(b => b && !visited.has(b.id));

      for (const n of neighbors) {
        if (n) {
          visited.add(n.id);
          queue.push(n);
        }
      }
    }

    // Any bubble not visited is floating
    for (const b of state.grid) {
      if (!b.falling && !b.popping && !visited.has(b.id)) {
        b.falling = true;
        b.vx = (Math.random() - 0.5) * 4;
        b.vy = 2;
        state.score += 20; // Bonus score for dropped bubbles
      }
    }
    setScore(state.score);
  }

  function dropCeiling(state: any) {
    // Add a new row at the top (visually shifts everything down next render because topOffsetRows increased)
    const r = state.topOffsetRows - 1; 
    const isShifted = Math.abs(r) % 2 === 1;
    const colsInRow = isShifted ? COLS - 1 : COLS;
    for (let c = 0; c < colsInRow; c++) {
      state.grid.push({
        id: `drop-${r}-${c}-${Date.now()}`,
        type: getRandomIon(),
        row: r,
        col: c,
        x: getX(r, c),
        y: getY(r)
      });
    }
    // Note: We don't change row numbers, we just added a row ABOVE them, 
    // Wait, if topOffsetRows increases, getY needs to be relative to it, OR row numbers need to shift.
    // Our getY(row) uses absolute row numbers. So if topOffsetRows increases, the old bubbles have the same Y, but they are technically 1 row further from top.
    // Actually, to push everything down, we just increase everyone's row by 1.
    for (const b of state.grid) {
      b.row += 1;
      b.y = getY(b.row);
      b.x = getX(b.row, b.col); // Re-align X just in case shift parity changed
      if (b.y >= HEIGHT - 100) {
        state.gameOver = true;
        setGameOver(true);
      }
    }
    state.topOffsetRows = 0; // Reset offset, we actually shifted rows.
  }

  function updateFallingBubbles(state: any) {
    let hasRemoved = false;
    for (const b of state.grid) {
      if (b.falling) {
        b.vy! += 0.5; // Gravity
        b.x += b.vx!;
        b.y += b.vy!;
        if (b.y > HEIGHT + D) {
          hasRemoved = true;
        }
      }
    }
    if (hasRemoved) {
      state.grid = state.grid.filter((b: any) => b.y <= HEIGHT + D);
    }
  }

  function createParticles(state: any, x: number, y: number, color: string) {
    for (let i = 0; i < 10; i++) {
      state.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color
      });
    }
  }

  function updateParticles(state: any) {
    for (const p of state.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
    }
    state.particles = state.particles.filter((p: any) => p.life > 0);
  }

  function render(state: any) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw background grid lines (optional, for debugging)
    
    // Draw Bubbles
    for (const b of state.grid) {
      if (b.popping) continue;
      drawBubble(ctx, b.x, b.y, b.type);
    }

    // Draw Projectile
    if (state.projectile) {
      const p = state.projectile;
      drawBubble(ctx, p.x, p.y, p.type);
    }

    // Draw Shooter Arrow
    ctx.save();
    ctx.translate(state.shooter.x, state.shooter.y);
    ctx.rotate(Math.PI/2 - state.shooter.angle);
    // Draw dotted line
    ctx.beginPath();
    ctx.setLineDash([5, 10]);
    ctx.moveTo(0, -D);
    ctx.lineTo(0, -HEIGHT);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Draw Shooter bubbles
    drawBubble(ctx, state.shooter.x, state.shooter.y, state.shooter.currentBubbleType);
    drawBubble(ctx, state.shooter.x + 40, state.shooter.y + 10, state.shooter.nextBubbleType, 12); // Next indicator

    // Draw Particles
    for (const p of state.particles) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
    
    // Danger Line
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT - 100);
    ctx.lineTo(WIDTH, HEIGHT - 100);
    ctx.strokeStyle = 'rgba(239,68,68,0.5)';
    ctx.setLineDash([10, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, type: string, r: number = R) {
    const color = COLORS[type as keyof typeof COLORS];
    
    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    // Gradient
    const grad = ctx.createRadialGradient(x - r/3, y - r/3, r/4, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, color);
    grad.addColorStop(1, darken(color, 40));

    ctx.beginPath();
    ctx.arc(x, y, r - 1, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    
    // Stroke
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.stroke();

    // Text (Ion label)
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${r * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Render text with simple shadow for readability
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 3;
    
    // Handle subscript/superscript visually (simple replacement for rendering)
    let displayTxt = type.replace('2-', '²⁻').replace('3-', '³⁻').replace('2+', '²⁺').replace('3+', '³⁺').replace('+', '⁺').replace('-', '⁻').replace('SO4', 'SO₄').replace('PO4', 'PO₄');
    ctx.fillText(displayTxt, x, y);
    ctx.shadowColor = 'transparent';
  }

  function darken(hex: string, percent: number) {
    let num = parseInt(hex.replace("#",""),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-100 p-4">
      {/* Header */}
      <div className="w-full max-w-[480px] flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">
            Bắn Trứng Hóa Học
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Dinosaur Egg Shoot</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-bold">{score}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <canvas 
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onPointerDown={handleFire}
          onPointerMove={handlePointerMove}
          className="bg-slate-900 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-slate-800 cursor-crosshair touch-none"
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm z-10">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-wide drop-shadow-lg">Game Over</h2>
            <p className="text-slate-300 text-lg mb-8">Điểm của bạn: <span className="text-amber-400 font-bold">{score}</span></p>
            <button 
              onClick={initGame}
              className="flex items-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white rounded-full font-bold uppercase tracking-wider transition transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Chơi Lại
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="w-full max-w-[480px] mt-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-sm">
        <h3 className="font-bold text-amber-400 mb-2 uppercase text-xs tracking-wider">Cách chơi:</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-300">
          <li>Ngắm và chạm vào màn hình để bắn Ion.</li>
          <li>Chỉ rớt bóng khi tạo thành cụm hợp chất có <strong>Tổng điện tích = 0</strong>.</li>
          <li>Ví dụ: Bắn 2 quả <span className="text-yellow-400 font-bold">Na⁺</span> dính vào 1 quả <span className="text-blue-400 font-bold">SO₄²⁻</span> sẽ nổ!</li>
          <li>Nếu không nổ, sau 5 lần bắn trượt trần nhà sẽ hạ xuống. Đừng để bóng chạm vạch đỏ dưới cùng!</li>
        </ul>
      </div>
    </div>
  );
}
