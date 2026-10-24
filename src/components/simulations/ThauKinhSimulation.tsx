import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react';

type LensType = 'convex' | 'concave';

interface PresetCase {
  id: string;
  name: string;
  desc: string;
  d: number;
  f: number;
  h: number;
}

export function ThauKinhSimulation({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation state
  const [lensType, setLensType] = useState<LensType>('convex');
  const [objectDist, setObjectDist] = useState<number>(180); // d (pixels)
  const [objectHeight, setObjectHeight] = useState<number>(60); // h (pixels)
  const [focalLength, setFocalLength] = useState<number>(110); // f (pixels)
  const [canvasTheme, setCanvasTheme] = useState<'white' | 'dark'>('white');
  const [showRays, setShowRays] = useState({ ray1: true, ray2: true });

  // Dragging state
  const isDraggingRef = useRef<'body' | 'tip' | null>(null);
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const startDistRef = useRef<number>(180);
  const startHeightRef = useRef<number>(60);

  // Presets definition matching textbook cases
  const convexPresets: PresetCase[] = [
    { id: 'd_gt_2f', name: 'd > 2f', desc: 'Ảnh thật, nhỏ hơn vật, ngược chiều', d: 250, f: 100, h: 60 },
    { id: 'd_eq_2f', name: 'd = 2f', desc: 'Ảnh thật, bằng vật, ngược chiều (d\' = 2f)', d: 200, f: 100, h: 60 },
    { id: 'f_lt_d_lt_2f', name: 'f < d < 2f', desc: 'Ảnh thật, lớn hơn vật, ngược chiều', d: 150, f: 100, h: 50 },
    { id: 'd_eq_f', name: 'd = f', desc: 'Tia ló song song, ảnh ở vô cực', d: 100, f: 100, h: 50 },
    { id: 'd_lt_f', name: 'd < f', desc: 'Ảnh ảo, lớn hơn vật, cùng chiều (Kính lúp)', d: 65, f: 110, h: 45 },
  ];

  const concavePresets: PresetCase[] = [
    { id: 'cc_far', name: 'd > f', desc: 'Ảnh ảo, nhỏ hơn vật, cùng chiều (trong khoảng OF)', d: 200, f: 110, h: 65 },
    { id: 'cc_mid', name: 'd = f', desc: 'Ảnh ảo, nhỏ hơn vật, cùng chiều (d\' = f/2)', d: 110, f: 110, h: 65 },
    { id: 'cc_near', name: 'd < f', desc: 'Ảnh ảo, nhỏ hơn vật, cùng chiều, gần thấu kính', d: 60, f: 110, h: 65 },
  ];

  const applyPreset = (preset: PresetCase) => {
    setObjectDist(preset.d);
    setFocalLength(preset.f);
    setObjectHeight(preset.h);
  };

  // Math calculations
  const d = objectDist;
  const f = focalLength;
  const h = objectHeight;

  let dPrime = 0;
  let isInfinity = false;
  let isVirtual = false;
  let hPrime = 0;
  let k = 0;

  if (lensType === 'convex') {
    if (d === f) {
      isInfinity = true;
      dPrime = Infinity;
      k = Infinity;
      hPrime = Infinity;
    } else {
      dPrime = (d * f) / (d - f);
      isVirtual = d < f; // if d < f -> d' is negative in physical meaning
      k = -dPrime / d;
      hPrime = Math.abs(k) * h;
    }
  } else {
    // Concave lens
    dPrime = -(d * f) / (d + f);
    isVirtual = true;
    k = -dPrime / d;
    hPrime = Math.abs(k) * h;
  }

  // Draw scene
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const isLight = canvasTheme === 'white';
    const bgFill = isLight ? '#ffffff' : '#070b19';
    const axisColor = isLight ? '#1e293b' : '#94a3b8';
    const lensColor = isLight ? '#0284c7' : '#38bdf8';
    const textColor = isLight ? '#0f172a' : '#f8fafc';
    const subtextColor = isLight ? '#475569' : '#94a3b8';
    const objColor = '#dc2626'; // Red for object
    const imgColor = isVirtual ? '#dc2626' : '#dc2626'; // Red for image (dashed if virtual)
    const rayColor1 = isLight ? '#7c3aed' : '#a855f7'; // Purple/Violet
    const rayColor2 = isLight ? '#2563eb' : '#60a5fa'; // Blue
    const extColor = isLight ? '#64748b' : '#94a3b8'; // Extension dashed lines

    // 1. Background
    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid for precision
    ctx.strokeStyle = isLight ? '#f1f5f9' : '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 20; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 20; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }

    const cx = Math.round(W * 0.52); // Center shifted slightly right for ample object/virtual image space
    const cy = Math.round(H * 0.54); // Axis height

    // 2. Optical axis (Δ)
    ctx.beginPath();
    ctx.moveTo(15, cy);
    ctx.lineTo(W - 15, cy);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Axis label Δ
    ctx.fillStyle = subtextColor;
    ctx.font = 'italic bold 15px "Times New Roman", serif';
    ctx.textAlign = 'left';
    ctx.fillText('Δ', 20, cy - 8);

    // Helper: draw arrow heads
    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, length = 10) => {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - length * Math.cos(angle - Math.PI / 6), y2 - length * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - length * Math.cos(angle + Math.PI / 6), y2 - length * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 3. Draw Lens
    const lensHalfH = 155;
    ctx.beginPath();
    ctx.moveTo(cx, cy - lensHalfH);
    ctx.lineTo(cx, cy + lensHalfH);
    ctx.strokeStyle = lensColor;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    if (lensType === 'convex') {
      // Outward arrow heads at top and bottom (Thấu kính hội tụ)
      drawArrow(cx, cy - lensHalfH + 18, cx, cy - lensHalfH - 4, lensColor, 14);
      drawArrow(cx, cy + lensHalfH - 18, cx, cy + lensHalfH + 4, lensColor, 14);

      // Lens symbol label
      ctx.fillStyle = lensColor;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('(L)', cx, cy + lensHalfH + 20);
    } else {
      // Inward flared symbols at top and bottom (Thấu kính phân kỳ - hình chữ Y ngược)
      ctx.strokeStyle = lensColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      // Top flare
      ctx.moveTo(cx - 10, cy - lensHalfH - 6);
      ctx.lineTo(cx, cy - lensHalfH);
      ctx.lineTo(cx + 10, cy - lensHalfH - 6);
      // Bottom flare
      ctx.moveTo(cx - 10, cy + lensHalfH + 6);
      ctx.lineTo(cx, cy + lensHalfH);
      ctx.lineTo(cx + 10, cy + lensHalfH + 6);
      ctx.stroke();

      ctx.fillStyle = lensColor;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('(L)', cx, cy + lensHalfH + 22);
    }

    // 4. Points: O, F, F'
    // Optical center O
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = textColor;
    ctx.fill();
    ctx.font = 'bold 15px "Times New Roman", serif';
    ctx.textAlign = 'right';
    ctx.fillText('O', cx - 6, cy + 18);

    // Focal points coordinates
    const Fx_left = cx - f;
    const Fx_right = cx + f;

    // Left point
    ctx.beginPath();
    ctx.arc(Fx_left, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = textColor;
    ctx.fill();

    // Right point
    ctx.beginPath();
    ctx.arc(Fx_right, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = textColor;
    ctx.fill();

    // Labels for F and F'
    ctx.textAlign = 'center';
    if (lensType === 'convex') {
      // Convex: F on left (tiêu điểm vật), F' on right (tiêu điểm ảnh)
      ctx.fillText('F', Fx_left, cy + 18);
      ctx.fillText("F'", Fx_right, cy + 18);
    } else {
      // Concave: F on left, F' on right
      ctx.fillText('F', Fx_left, cy + 18);
      ctx.fillText("F'", Fx_right, cy + 18);
    }

    // 5. Draw Object AB
    const Ax = cx - d;
    const Ay = cy;
    const Bx = Ax;
    const By = cy - h;

    // Perpendicular base point A
    ctx.beginPath();
    ctx.arc(Ax, Ay, 3, 0, Math.PI * 2);
    ctx.fillStyle = objColor;
    ctx.fill();
    ctx.font = 'bold 15px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('A', Ax, Ay + 18);

    // Arrow AB (Solid Red)
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.strokeStyle = objColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    // Arrow tip B
    drawArrow(Ax, Ay, Bx, By - 2, objColor, 12);
    ctx.fillText('B', Bx, By - 10);

    // 6. Ray Tracing
    const Iy = By; // Point of incidence on lens for parallel ray

    // RAY 1: Parallel to axis (Tia tới song song trục chính)
    if (showRays.ray1) {
      // Incident part: B -> I
      ctx.beginPath();
      ctx.moveTo(Bx, By);
      ctx.lineTo(cx, Iy);
      ctx.strokeStyle = rayColor1;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Arrowhead on incident ray B -> I
      drawArrow(Bx, By, (Bx + cx) / 2, By, rayColor1, 9);

      // Label I
      ctx.fillStyle = textColor;
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText('I', cx + 5, Iy - 6);

      if (lensType === 'convex') {
        // Refracted ray passes through F' (cx + f, cy)
        // Slope = (cy - Iy) / f = h / f
        const slope1 = h / f;
        const targetX = W - 15;
        const targetY = Iy + slope1 * (targetX - cx);

        // Solid refracted ray through F'
        ctx.beginPath();
        ctx.moveTo(cx, Iy);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = rayColor1;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arrowhead on refracted ray
        const arrowRx1 = cx + f + 45;
        const arrowRy1 = cy + slope1 * 45;
        if (arrowRx1 < targetX && arrowRy1 < H - 10) {
          drawArrow(cx, Iy, arrowRx1, arrowRy1, rayColor1, 9);
        }

        // If d < f or d = f: Draw backward dashed extension
        if (d <= f) {
          ctx.beginPath();
          ctx.setLineDash([5, 4]);
          ctx.moveTo(cx, Iy);
          const extX = 20;
          const extY = Iy - slope1 * (cx - extX);
          ctx.lineTo(extX, extY);
          ctx.strokeStyle = extColor;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        // Concave Lens:
        // Refracted ray diverges along line from F(cx - f, cy) through I(cx, Iy)
        // Slope = (Iy - cy) / f = -h / f
        const slope1 = -h / f;
        const targetX = W - 15;
        const targetY = Iy + slope1 * (targetX - cx);

        // Solid diverged ray IK
        ctx.beginPath();
        ctx.moveTo(cx, Iy);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = rayColor1;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arrowhead and Label K
        const arrowKx = cx + (targetX - cx) * 0.55;
        const arrowKy = Iy + slope1 * (targetX - cx) * 0.55;
        drawArrow(cx, Iy, arrowKx, arrowKy, rayColor1, 9);
        ctx.fillStyle = textColor;
        ctx.fillText('K', targetX - 10, targetY - 8);

        // Backward dashed line from I to F (cx - f, cy)
        ctx.beginPath();
        ctx.setLineDash([5, 4]);
        ctx.moveTo(cx, Iy);
        ctx.lineTo(cx - f, cy);
        ctx.strokeStyle = extColor;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // RAY 2: Through optical center O (Tia tới qua quang tâm O)
    if (showRays.ray2) {
      // Slope = (cy - By) / (cx - Bx) = h / d
      const slope2 = h / d;
      const targetX = W - 15;
      const targetY = cy + slope2 * (targetX - cx);

      // Incident + Transmitted straight line through O
      ctx.beginPath();
      ctx.moveTo(Bx, By);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = rayColor2;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Arrowheads on incident & transmitted parts
      drawArrow(Bx, By, (Bx + cx) / 2, (By + cy) / 2, rayColor2, 9);
      const arrowRx2 = cx + 80;
      const arrowRy2 = cy + slope2 * 80;
      if (arrowRx2 < targetX && arrowRy2 < H - 10) {
        drawArrow(cx, cy, arrowRx2, arrowRy2, rayColor2, 9);
      }

      // If d < f or d = f: Backward dashed extension to the left
      if (lensType === 'convex' && d <= f) {
        ctx.beginPath();
        ctx.setLineDash([5, 4]);
        ctx.moveTo(cx, cy);
        const extX = 20;
        const extY = cy - slope2 * (cx - extX);
        ctx.lineTo(extX, extY);
        ctx.strokeStyle = extColor;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 7. Draw Image A'B'
    if (isInfinity) {
      // d = f: Image at infinity
      ctx.fillStyle = textColor;
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText("B'∞", 35, 45);
      ctx.fillText("A'∞", 35, cy - 10);
    } else {
      // Finite Image
      let A_prime_x = 0;
      let B_prime_y = 0;

      if (lensType === 'convex') {
        if (d > f) {
          // Real image on the right (d' > 0)
          A_prime_x = cx + dPrime;
          B_prime_y = cy + hPrime; // Inverted (downward)

          if (A_prime_x < W - 10) {
            // Point A'
            ctx.beginPath();
            ctx.arc(A_prime_x, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = imgColor;
            ctx.fill();
            ctx.fillStyle = textColor;
            ctx.font = 'bold 15px "Times New Roman", serif';
            ctx.textAlign = 'center';
            ctx.fillText("A'", A_prime_x, cy - 10);

            // Arrow A'B' (Solid Red, pointing down)
            ctx.beginPath();
            ctx.moveTo(A_prime_x, cy);
            ctx.lineTo(A_prime_x, B_prime_y);
            ctx.strokeStyle = imgColor;
            ctx.lineWidth = 3;
            ctx.stroke();
            drawArrow(A_prime_x, cy, A_prime_x, B_prime_y + 2, imgColor, 12);

            // Point B'
            ctx.fillText("B'", A_prime_x, B_prime_y + 18);
          }
        } else {
          // Virtual image on the left (d < f)
          A_prime_x = cx - Math.abs(dPrime);
          B_prime_y = cy - hPrime; // Erect (upward)

          if (A_prime_x > 15) {
            // Point A'
            ctx.beginPath();
            ctx.arc(A_prime_x, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = imgColor;
            ctx.fill();
            ctx.fillStyle = textColor;
            ctx.font = 'bold 15px "Times New Roman", serif';
            ctx.textAlign = 'center';
            ctx.fillText("A'", A_prime_x, cy + 18);

            // Arrow A'B' (Dashed Red, pointing up)
            ctx.beginPath();
            ctx.setLineDash([5, 4]);
            ctx.moveTo(A_prime_x, cy);
            ctx.lineTo(A_prime_x, B_prime_y);
            ctx.strokeStyle = imgColor;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.setLineDash([]);
            drawArrow(A_prime_x, cy, A_prime_x, B_prime_y - 2, imgColor, 12);

            // Point B'
            ctx.fillText("B'", A_prime_x, B_prime_y - 10);
          }
        }
      } else {
        // Concave Lens: Always virtual image between O and F
        A_prime_x = cx - Math.abs(dPrime);
        B_prime_y = cy - hPrime; // Erect, smaller than object

        // Point A'
        ctx.beginPath();
        ctx.arc(A_prime_x, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = imgColor;
        ctx.fill();
        ctx.fillStyle = textColor;
        ctx.font = 'bold 15px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText("A'", A_prime_x, cy + 18);

        // Arrow A'B' (Dashed Red, pointing up)
        ctx.beginPath();
        ctx.setLineDash([5, 4]);
        ctx.moveTo(A_prime_x, cy);
        ctx.lineTo(A_prime_x, B_prime_y);
        ctx.strokeStyle = imgColor;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.setLineDash([]);
        drawArrow(A_prime_x, cy, A_prime_x, B_prime_y - 2, imgColor, 12);

        // Point B'
        ctx.fillText("B'", A_prime_x, B_prime_y - 8);
      }
    }

    // 8. Box Tag at bottom-left showing case (like d > f, d < f, d = f in user image)
    const conditionText = isInfinity ? 'd = f' : (lensType === 'convex' ? (d > f ? 'd > f' : 'd < f') : 'Thấu kính phân kỳ');
    ctx.save();
    ctx.fillStyle = isLight ? '#f8fafc' : '#0f172a';
    ctx.strokeStyle = isLight ? '#cbd5e1' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.roundRect(25, H - 48, 140, 32, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
    ctx.font = 'bold 14px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText(conditionText, 95, H - 27);
    ctx.restore();

  }, [lensType, objectDist, objectHeight, focalLength, canvasTheme, showRays, isInfinity, d, f, h, dPrime, hPrime, isVirtual]);

  // Redraw when state changes
  useEffect(() => {
    drawScene();
  }, [drawScene]);

  // Handle Canvas mouse drag to move object
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const cx = Math.round(canvas.width * 0.52);
    const cy = Math.round(canvas.height * 0.54);
    const Ax = cx - objectDist;
    const By = cy - objectHeight;

    // Check if clicked near tip B
    if (Math.hypot(mouseX - Ax, mouseY - By) < 22) {
      isDraggingRef.current = 'tip';
      dragStartXRef.current = mouseX;
      dragStartYRef.current = mouseY;
      startHeightRef.current = objectHeight;
      return;
    }

    // Check if clicked near body AB
    if (Math.abs(mouseX - Ax) < 22 && mouseY >= By - 10 && mouseY <= cy + 10) {
      isDraggingRef.current = 'body';
      dragStartXRef.current = mouseX;
      startDistRef.current = objectDist;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const cx = Math.round(canvas.width * 0.52);
    const cy = Math.round(canvas.height * 0.54);

    if (isDraggingRef.current === 'body') {
      const deltaX = mouseX - dragStartXRef.current;
      const newDist = Math.max(30, Math.min(320, Math.round(startDistRef.current - deltaX)));
      setObjectDist(newDist);
    } else if (isDraggingRef.current === 'tip') {
      const newHeight = Math.max(25, Math.min(120, Math.round(cy - mouseY)));
      setObjectHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = null;
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touch = e.touches[0];
    const mouseX = (touch.clientX - rect.left) * scaleX;
    const cx = Math.round(canvas.width * 0.52);

    isDraggingRef.current = 'body';
    dragStartXRef.current = mouseX;
    startDistRef.current = objectDist;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touch = e.touches[0];
    const mouseX = (touch.clientX - rect.left) * scaleX;
    const deltaX = mouseX - dragStartXRef.current;
    const newDist = Math.max(30, Math.min(320, Math.round(startDistRef.current - deltaX)));
    setObjectDist(newDist);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = null;
  };

  // Educational insights
  const currentPresets = lensType === 'convex' ? convexPresets : concavePresets;

  const getApplicationNote = () => {
    if (lensType === 'concave') {
      return 'Kính cận thị (phân kỳ giúp kéo ảnh về võng mạc), lỗ nhìn trên cửa (peephole) cho góc nhìn rộng.';
    }
    if (d > 2 * f) {
      return 'Máy ảnh cơ & camera điện thoại (tạo ảnh thật, nhỏ hơn vật hứng trên phim/cảm biến), mắt người.';
    }
    if (d === 2 * f) {
      return 'Máy photocopy quang học thế hệ trước (sao chép văn bản với tỷ lệ đúng 1:1).';
    }
    if (d > f && d < 2 * f) {
      return 'Máy chiếu phim, máy chiếu hội trường projector (tạo ảnh thật phóng đại nhiều lần trên màn chắn).';
    }
    if (d === f) {
      return 'Đèn pha ô tô, đèn hải đăng (đặt bóng đèn tại tiêu điểm để tạo chùm sáng song song chiếu xa).';
    }
    return 'Kính lúp, kính hiển vi, kính thiên văn (d < f để tạo ảnh ảo phóng đại cùng chiều giúp mắt dễ quan sát vật nhỏ).';
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-20">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-all cursor-pointer text-slate-300 hover:text-white"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              🔬 Mô Phỏng Quang Hình Thấu Kính
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Chuẩn Giáo Trình Vật Lý & Khoa Học Tự Nhiên
            </p>
          </div>
        </div>

        {/* Lens Type Switch */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-800 rounded-2xl border border-slate-700">
            <button
              onClick={() => {
                setLensType('convex');
                setObjectDist(180);
                setFocalLength(100);
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                lensType === 'convex'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔎 Thấu kính Hội tụ
            </button>
            <button
              onClick={() => {
                setLensType('concave');
                setObjectDist(160);
                setFocalLength(110);
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                lensType === 'concave'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔍 Thấu kính Phân kỳ
            </button>
          </div>

          <button
            onClick={() => setCanvasTheme(canvasTheme === 'white' ? 'dark' : 'white')}
            title="Đổi màu nền Canvas"
            className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
          >
            {canvasTheme === 'white' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-x-hidden">
        {/* Canvas Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 gap-3">
          {/* Quick Case Selection Pills (Chuẩn hình minh họa) */}
          <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Trường hợp:
            </span>
            {currentPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  Math.abs(objectDist - preset.d) <= 10 && focalLength === preset.f
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm shadow-blue-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title={preset.desc}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Interactive Canvas */}
          <div className="relative w-full max-w-3xl aspect-video max-h-115 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center bg-slate-900">
            <canvas
              ref={canvasRef}
              width={760}
              height={420}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full object-contain cursor-ew-resize touch-none"
            />

            {/* Canvas Hint Overlay */}
            <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-300 shadow-xs">
                💡 Kéo vật AB trực tiếp trên hình
              </span>
            </div>

            {/* Rays Toggle at Top-Right */}
            <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-white/10 p-1 rounded-xl">
              <button
                onClick={() => setShowRays(prev => ({ ...prev, ray1: !prev.ray1 }))}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  showRays.ray1 ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tia 1 (// trục)
              </button>
              <button
                onClick={() => setShowRays(prev => ({ ...prev, ray2: !prev.ray2 }))}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  showRays.ray2 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tia 2 (qua O)
              </button>
            </div>
          </div>

          {/* Real-world application note */}
          <div className="w-full max-w-3xl bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Ứng dụng thực tế</p>
              <p className="text-xs text-slate-300 font-medium leading-relaxed truncate sm:text-clip">
                {getApplicationNote()}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Controls & Parameters */}
        <div className="w-full lg:w-88 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          {/* Sliders */}
          <div className="space-y-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-300">📏 Khoảng cách vật (d = OA)</span>
                <span className="text-sm font-black text-amber-400">{d} px</span>
              </div>
              <input
                type="range"
                min={30}
                max={300}
                value={d}
                onChange={(e) => setObjectDist(Number(e.target.value))}
                className="w-full cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>Gần (30px)</span>
                <span>Tiêu cự f: {f}px</span>
                <span>Xa (300px)</span>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-300">🔎 Tiêu cự thấu kính (f = OF)</span>
                <span className="text-sm font-black text-blue-400">{f} px</span>
              </div>
              <input
                type="range"
                min={60}
                max={150}
                value={f}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>Dày (f nhỏ)</span>
                <span>Mỏng (f lớn)</span>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-300">📐 Chiều cao vật (h = AB)</span>
                <span className="text-sm font-black text-rose-400">{h} px</span>
              </div>
              <input
                type="range"
                min={25}
                max={100}
                value={h}
                onChange={(e) => setObjectHeight(Number(e.target.value))}
                className="w-full cursor-pointer accent-rose-500"
              />
            </div>
          </div>

          {/* Live Optical Analysis Table */}
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center justify-between">
              <span>📊 Đặc điểm của ảnh A'B'</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                {lensType === 'convex' ? 'Hội tụ' : 'Phân kỳ'}
              </span>
            </h3>

            <div className="space-y-1.5 divide-y divide-slate-700/50 pt-1 text-xs">
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-400">Loại ảnh:</span>
                <span className={`font-bold ${isInfinity ? 'text-amber-400' : isVirtual ? 'text-purple-400' : 'text-emerald-400'}`}>
                  {isInfinity ? 'Ở vô cực (∞)' : isVirtual ? 'Ảnh ảo (nét đứt)' : 'Ảnh thật (nét liền)'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-400">Chiều của ảnh:</span>
                <span className="font-bold text-slate-200">
                  {isInfinity ? '—' : isVirtual ? 'Cùng chiều với vật (↑)' : 'Ngược chiều với vật (↓)'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-400">Khoảng cách ảnh (d' = OA'):</span>
                <span className="font-mono font-bold text-amber-400">
                  {isInfinity ? '∞' : `${Math.abs(Math.round(dPrime))} px`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-400">Chiều cao ảnh (A'B'):</span>
                <span className="font-mono font-bold text-rose-400">
                  {isInfinity ? '—' : `${Math.round(hPrime)} px`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-400">Hệ số phóng đại (|k| = d'/d):</span>
                <span className="font-mono font-bold text-cyan-300">
                  {isInfinity ? '—' : `${Math.abs(k).toFixed(2)}x`}
                </span>
              </div>
            </div>
          </div>

          {/* Formula Card */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-4">
            <h4 className="text-xs font-black uppercase text-amber-400 mb-2">📐 Công thức thấu kính mỏng</h4>
            <div className="bg-slate-950/60 rounded-xl p-2.5 text-center font-mono text-xs text-white border border-amber-900/30">
              {lensType === 'convex' ? (
                <>
                  <div className="text-amber-300 font-bold mb-1">1/f = 1/d + 1/d'</div>
                  <div className="text-[11px] text-slate-300">
                    d' = (d × f) / (d - f) = ({d} × {f}) / ({d} - {f}) ={' '}
                    <span className="text-amber-400 font-bold">
                      {isInfinity ? '∞' : `${Math.round(dPrime)} px`}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-amber-300 font-bold mb-1">-1/f = 1/d + 1/d'</div>
                  <div className="text-[11px] text-slate-300">
                    d' = -(d × f) / (d + f) ={' '}
                    <span className="text-amber-400 font-bold">{Math.round(dPrime)} px</span>
                  </div>
                </>
              )}
            </div>
            <p className="text-[10px] text-amber-200/80 mt-2 leading-tight">
              • d &gt; 0: vật thật | d' &gt; 0: ảnh thật | d' &lt; 0: ảnh ảo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
