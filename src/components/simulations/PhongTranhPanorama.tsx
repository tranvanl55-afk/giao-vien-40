import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Upload, Trash2, Edit3, Check, X, Play, Pause, 
  Volume2, VolumeX, Maximize2, Minimize2, Eye, Compass, 
  Sparkles, Palette, Layers, Image as ImageIcon, User, FileText, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

// ----------------------------------------------------
// DỮ LIỆU TRANH MẪU BAN ĐẦU (Khoa học & Thiên nhiên)
// ----------------------------------------------------
interface PaintingData {
  id: string;
  url: string;
  title: string;
  author: string;
  desc: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const DEFAULT_PAINTINGS: PaintingData[] = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800',
    title: 'Tinh vân Vũ trụ (Nebula)',
    author: 'Trần Minh Quân - Lớp 7A1',
    desc: 'Mô phỏng làn bụi khí đầy màu sắc của các ngôi sao đã chết phát sáng trong không gian vũ trụ sâu thẳm.'
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800',
    title: 'Cấu tạo Tế bào Thực vật dưới Kính hiển vi',
    author: 'Lê Quỳnh Chi - Lớp 6B2',
    desc: 'Quan sát các bào quan đặc trưng như Lục lạp màu xanh lục và vách tế bào Cellulose cứng cáp dưới lăng kính khoa học.'
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800',
    title: 'Đại dương xanh và Đa dạng sinh học biển',
    author: 'Phạm Đức Nam - Lớp 8A3',
    desc: 'Rạn san hô đầy màu sắc đóng vai trò là ngôi nhà sinh sống của hàng ngàn sinh vật đại dương kỳ thú.'
  },
  {
    id: 'p4',
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800',
    title: 'Mạng lưới Năng lượng Vật lý Điện từ',
    author: 'Nguyễn Thanh Tùng - Lớp 9A1',
    desc: 'Biểu diễn trực quan các hạt electron chuyển động dọc theo từ trường sinh ra dòng điện xoay chiều điện năng.'
  },
  {
    id: 'p5',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    title: 'Đa dạng sinh học Rừng nhiệt đới',
    author: 'Đỗ Thùy Linh - Lớp 9A2',
    desc: 'Mô hình chuỗi thức ăn và hệ sinh thái thực vật đa dạng cung cấp oxy và duy trì sự cân bằng của khí quyển.'
  },
  {
    id: 'p6',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=800',
    title: 'Phản ứng Hóa học trong Ống nghiệm',
    author: 'Hoàng Anh Tuấn - Lớp 8B1',
    desc: 'Mô phỏng sự đổi màu của dung dịch chỉ thị màu axit-bazơ khi xảy ra phản ứng trung hòa trong phòng thí nghiệm.'
  }
];

// ----------------------------------------------------
// DỰ DỰNG NHẠC NỀN BẰNG WEB AUDIO API (KHÔNG TỐN BĂNG THÔNG)
// ----------------------------------------------------
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  start() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.filterNode = this.ctx.createBiquadFilter();

      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2.5);

      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(420, this.ctx.currentTime);

      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      const freqs = [174.61, 261.63, 392.00, 440.00, 659.25];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.filterNode) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.2, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        oscGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.filterNode);

        lfo.start();
        osc.start();

        this.oscillators.push(osc);
      });
    } catch (e) {
      console.warn("Lỗi nhạc nền Web Audio:", e);
    }
  }

  stop() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try { osc.stop(); } catch(e){}
        });
        if (this.ctx && this.ctx.state !== 'closed') {
          this.ctx.close();
        }
        this.oscillators = [];
        this.ctx = null;
      }, 700);
    }
  }
}

// ----------------------------------------------------
// CANVAS HIỆU ỨNG HẠT LƠ LỬNG TRANG TRÍ THEO CHỦ ĐỀ
// ----------------------------------------------------
const ParticleCanvas = ({ theme }: { theme: 'technology' | 'galaxy' | 'ocean' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Theme objects
    let stars: Array<{
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;
      phase: number;
      opacity: number;
      color: string;
    }> = [];

    let nebulas: Array<{
      x: number;
      y: number;
      radius: number;
      color1: string;
      color2: string;
    }> = [];

    let shootingStar = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      length: 0,
      life: 0,
      maxLife: 0,
      active: false
    };

    let rays: Array<{
      angle: number;
      speed: number;
      width: number;
      opacity: number;
    }> = [];

    let bubbles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      swaySpeed: number;
      swayWidth: number;
      swayPhase: number;
      opacity: number;
    }> = [];

    let binaryStreams: Array<{
      x: number;
      y: number;
      char: string;
      speedY: number;
      opacity: number;
      fontSize: number;
    }> = [];

    let techTracks: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    let techPackets: Array<{
      trackIdx: number;
      progress: number;
      speed: number;
      size: number;
    }> = [];

    const initObjects = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      if (theme === 'galaxy') {
        stars = [];
        const starColors = ['rgba(255, 255, 255, 0.85)', 'rgba(196, 181, 253, 0.75)', 'rgba(165, 180, 252, 0.65)', 'rgba(253, 244, 255, 0.8)'];
        for (let i = 0; i < 140; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2.8 + 0.5,
            twinkleSpeed: 0.01 + Math.random() * 0.03,
            phase: Math.random() * Math.PI * 2,
            opacity: 0.35 + Math.random() * 0.65,
            color: starColors[Math.floor(Math.random() * starColors.length)]
          });
        }

        nebulas = [
          { x: width * 0.25, y: height * 0.3, radius: Math.min(width, height) * 0.5, color1: 'rgba(147, 51, 234, 0.13)', color2: 'rgba(147, 51, 234, 0)' },
          { x: width * 0.75, y: height * 0.65, radius: Math.min(width, height) * 0.55, color1: 'rgba(79, 70, 229, 0.12)', color2: 'rgba(79, 70, 229, 0)' },
          { x: width * 0.5, y: height * 0.4, radius: Math.min(width, height) * 0.4, color1: 'rgba(6, 182, 212, 0.05)', color2: 'rgba(6, 182, 212, 0)' }
        ];

        shootingStar = {
          x: 0,
          y: 0,
          dx: 0,
          dy: 0,
          length: 0,
          life: 0,
          maxLife: 0,
          active: false
        };
      } else if (theme === 'ocean') {
        rays = [
          { angle: -0.15, speed: 0.0003, width: 90, opacity: 0.06 },
          { angle: 0.05, speed: -0.0002, width: 110, opacity: 0.05 },
          { angle: 0.22, speed: 0.0004, width: 100, opacity: 0.07 },
          { angle: -0.28, speed: -0.0001, width: 130, opacity: 0.04 }
        ];

        bubbles = [];
        for (let i = 0; i < 55; i++) {
          bubbles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 4.5 + 1.2,
            speedY: -(0.35 + Math.random() * 0.65),
            swaySpeed: 0.01 + Math.random() * 0.02,
            swayWidth: 3 + Math.random() * 10,
            swayPhase: Math.random() * Math.PI * 2,
            opacity: 0.15 + Math.random() * 0.45
          });
        }
      } else if (theme === 'technology') {
        binaryStreams = [];
        for (let i = 0; i < 45; i++) {
          binaryStreams.push({
            x: Math.random() * width,
            y: Math.random() * height,
            char: Math.random() > 0.5 ? '1' : '0',
            speedY: 0.25 + Math.random() * 0.65,
            opacity: 0.12 + Math.random() * 0.33,
            fontSize: 9 + Math.floor(Math.random() * 6)
          });
        }

        techTracks = [];
        const numTracks = 7;
        for (let i = 0; i < numTracks; i++) {
          const isHorizontal = i % 2 === 0;
          if (isHorizontal) {
            const y = (0.15 + 0.7 * (i / numTracks)) * height;
            techTracks.push({ x1: 0, y1: y, x2: width, y2: y });
          } else {
            const x = (0.15 + 0.7 * (i / numTracks)) * width;
            techTracks.push({ x1: x, y1: 0, x2: x, y2: height });
          }
        }

        techPackets = [];
        for (let i = 0; i < 14; i++) {
          techPackets.push({
            trackIdx: Math.floor(Math.random() * numTracks),
            progress: Math.random(),
            speed: 0.0012 + Math.random() * 0.0032,
            size: 3 + Math.random() * 3.5
          });
        }
      }
    };

    initObjects();

    const handleResize = () => {
      initObjects();
    };
    window.addEventListener('resize', handleResize);

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      if (theme === 'galaxy') {
        // Render background nebulas with soft radial gradients
        ctx.globalCompositeOperation = 'screen';
        nebulas.forEach((n, idx) => {
          const driftX = Math.sin(time * 0.0015 + idx) * 35;
          const driftY = Math.cos(time * 0.0012 + idx) * 20;
          const grad = ctx.createRadialGradient(
            n.x + driftX, n.y + driftY, 0,
            n.x + driftX, n.y + driftY, n.radius
          );
          grad.addColorStop(0, n.color1);
          grad.addColorStop(1, n.color2);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(n.x + driftX, n.y + driftY, n.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';

        // Twinkling stars
        stars.forEach(p => {
          const currentOpacity = Math.abs(Math.sin(p.phase + time * p.twinkleSpeed)) * p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentOpacity;
          ctx.fill();

          if (p.size > 2.0) {
            // Draw twinkle crosshair starburst effect
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x - p.size * 1.8, p.y);
            ctx.lineTo(p.x + p.size * 1.8, p.y);
            ctx.moveTo(p.x, p.y - p.size * 1.8);
            ctx.lineTo(p.x, p.y + p.size * 1.8);
            ctx.stroke();
          }
        });
        ctx.globalAlpha = 1.0;

        // Occasional shooting star
        if (!shootingStar.active && Math.random() < 0.006) {
          shootingStar.active = true;
          shootingStar.x = Math.random() * width;
          shootingStar.y = Math.random() * (height * 0.4);
          const angle = Math.PI / 6 + Math.random() * (Math.PI / 6);
          const speed = 7 + Math.random() * 11;
          shootingStar.dx = Math.cos(angle) * speed;
          shootingStar.dy = Math.sin(angle) * speed;
          shootingStar.length = 50 + Math.random() * 70;
          shootingStar.life = 0;
          shootingStar.maxLife = 15 + Math.random() * 15;
        }

        if (shootingStar.active) {
          shootingStar.life++;
          const alpha = 1 - (shootingStar.life / shootingStar.maxLife);
          if (alpha <= 0) {
            shootingStar.active = false;
          } else {
            const grad = ctx.createLinearGradient(
              shootingStar.x, shootingStar.y,
              shootingStar.x - shootingStar.dx * 1.3, shootingStar.y - shootingStar.dy * 1.3
            );
            grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.0;
            ctx.moveTo(shootingStar.x, shootingStar.y);
            ctx.lineTo(shootingStar.x - shootingStar.dx * 1.3, shootingStar.y - shootingStar.dy * 1.3);
            ctx.stroke();
            
            shootingStar.x += shootingStar.dx;
            shootingStar.y += shootingStar.dy;
          }
        }
      } else if (theme === 'ocean') {
        // Rotating/Swaying underwater caustic rays
        ctx.globalCompositeOperation = 'screen';
        rays.forEach(ray => {
          ray.angle += ray.speed;
          const currentAngle = ray.angle + Math.sin(time * 0.008) * 0.03;
          
          const grad = ctx.createLinearGradient(width / 2, 0, width / 2 + Math.sin(currentAngle) * height, height);
          grad.addColorStop(0, `rgba(34, 211, 238, ${ray.opacity})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.beginPath();
          ctx.moveTo(width / 2, -20);
          const endX1 = width / 2 + Math.sin(currentAngle - 0.08) * height * 1.5;
          const endX2 = width / 2 + Math.sin(currentAngle + 0.08) * height * 1.5;
          ctx.lineTo(endX1, height);
          ctx.lineTo(endX2, height);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';

        // Air bubbles rising
        bubbles.forEach(b => {
          b.y += b.speedY;
          b.swayPhase += b.swaySpeed;
          const currentX = b.x + Math.sin(b.swayPhase) * b.swayWidth;
          
          // Outer bubble rim
          ctx.beginPath();
          ctx.arc(currentX, b.y, b.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(165, 243, 252, ${b.opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          
          // Specular highlight dot
          ctx.beginPath();
          ctx.arc(currentX - b.size * 0.35, b.y - b.size * 0.35, b.size * 0.18, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.85})`;
          ctx.fill();
          
          if (b.y < -b.size * 2) {
            b.y = height + b.size * 2;
            b.x = Math.random() * width;
          }
        });
      } else if (theme === 'technology') {
        // Digital network track pathways
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
        ctx.lineWidth = 1;
        techTracks.forEach(t => {
          ctx.beginPath();
          ctx.moveTo(t.x1, t.y1);
          ctx.lineTo(t.x2, t.y2);
          ctx.stroke();
        });

        // Moving data packets
        techPackets.forEach(p => {
          p.progress += p.speed;
          if (p.progress > 1) {
            p.progress = 0;
            p.trackIdx = Math.floor(Math.random() * techTracks.length);
            p.speed = 0.0012 + Math.random() * 0.0032;
          }
          
          const track = techTracks[p.trackIdx];
          if (track) {
            const currentX = track.x1 + (track.x2 - track.x1) * p.progress;
            const currentY = track.y1 + (track.y2 - track.y1) * p.progress;
            
            ctx.fillStyle = 'rgba(34, 211, 238, 0.65)';
            ctx.fillRect(currentX - p.size / 2, currentY - p.size / 2, p.size, p.size);
          }
        });

        // Vertical binary code matrix streams
        binaryStreams.forEach(s => {
          ctx.font = `bold ${s.fontSize}px 'Courier New', Courier, monospace`;
          ctx.fillStyle = `rgba(34, 211, 238, ${s.opacity})`;
          ctx.fillText(s.char, s.x, s.y);
          
          s.y += s.speedY;
          if (Math.random() < 0.015) {
            s.char = Math.random() > 0.5 ? '1' : '0';
          }
          
          if (s.y > height + 20) {
            s.y = -20;
            s.x = Math.random() * width;
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-1" />;
};

// ----------------------------------------------------
// GALAXY LAYOUT COMPONENT
// ----------------------------------------------------
interface GalaxyLayoutProps {
  paintings: PaintingData[];
  selectedPainting: PaintingData | null;
  onSelectPainting: (p: PaintingData | null) => void;
}

const GalaxyLayout = ({ paintings, selectedPainting, onSelectPainting }: GalaxyLayoutProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Screen positions for HTML image overlays (updated every frame via ref, synced to state every ~100ms)
  const screenPosRef = useRef<Array<{ x: number; y: number; visible: boolean }>>([]);
  const [screenPositions, setScreenPositions] = useState<Array<{ x: number; y: number; visible: boolean }>>([]);
  const lastSyncTime = useRef(0);

  // Rotation & drag state
  const rotationAngle = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const velocityX = useRef(0);
  const autoRotateSpeed = useRef(0.0003);

  // Zoom/pan camera
  const camX = useRef(0);
  const camY = useRef(0);
  const targetCamX = useRef(0);
  const targetCamY = useRef(0);
  const zoom = useRef(1);
  const targetZoom = useRef(1);

  // Hovering painting index
  const hoveredIdx = useRef<number>(-1);

  // Selected painting ref (để dùng trong animate closure)
  const selectedRef = useRef<PaintingData | null>(null);
  useEffect(() => {
    selectedRef.current = selectedPainting;
  }, [selectedPainting]);

  // Paintings ref
  const paintingsRef = useRef<PaintingData[]>(paintings);
  useEffect(() => {
    paintingsRef.current = paintings;
  }, [paintings]);

  // Callback ref
  const onSelectRef = useRef(onSelectPainting);
  useEffect(() => { onSelectRef.current = onSelectPainting; }, [onSelectPainting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;

    // ---- Generate galaxy star field ----
    interface GalaxyStar {
      r: number;       // distance from center
      theta: number;   // angle
      size: number;
      color: string;
      twinkle: number;
      phase: number;
      arm: number;
    }

    const STAR_COUNT = 6000;
    const ARM_COUNT = 2;
    const stars: GalaxyStar[] = [];

    const starColors = [
      'rgba(255,255,255,',
      'rgba(196,181,253,',  // violet
      'rgba(165,180,252,',  // indigo
      'rgba(251,207,232,',  // pink
      'rgba(253,244,170,',  // yellow
      'rgba(167,243,208,',  // green
      'rgba(186,230,253,',  // sky
    ];

    const generateStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        const arm = Math.floor(Math.random() * ARM_COUNT);
        // logarithmic spiral: r = a * e^(b*theta)
        const r = 40 + Math.pow(Math.random(), 0.6) * 340;
        const armAngle = (arm / ARM_COUNT) * Math.PI * 2;
        // spread stars along spiral
        const spiralOffset = (r / 340) * Math.PI * 2.5;
        const scatter = (Math.random() - 0.5) * (30 + r * 0.25);
        const theta = armAngle + spiralOffset + scatter * 0.05;

        const x = Math.cos(theta) * r + (Math.random() - 0.5) * scatter;
        const y = Math.sin(theta) * r * 0.45 + (Math.random() - 0.5) * scatter * 0.45;
        const computedR = Math.sqrt(x * x + y * y / (0.45 * 0.45));

        // near center: denser & brighter
        const centralBoost = Math.max(0, 1 - computedR / 120);
        const sz = (Math.random() < 0.05 + centralBoost * 0.2)
          ? 1.2 + Math.random() * 1.8
          : 0.3 + Math.random() * 0.9;

        stars.push({
          r: computedR,
          theta: Math.atan2(y * (1 / 0.45), x),
          size: sz,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkle: 0.008 + Math.random() * 0.025,
          phase: Math.random() * Math.PI * 2,
          arm,
        });
      }
    };

    generateStars();

    // Painting star positions (spread across galaxy)
    interface PaintingStar {
      r: number;
      theta: number;
      x: number; // computed canvas x
      y: number; // computed canvas y
    }
    const paintingPositions: PaintingStar[] = [];

    const assignPaintingPositions = () => {
      paintingPositions.length = 0;
      const count = paintingsRef.current.length;
      for (let i = 0; i < count; i++) {
        const ratio = (i + 0.5) / count;
        const r = 80 + ratio * 240;
        const armAngle = ((i % ARM_COUNT) / ARM_COUNT) * Math.PI * 2;
        const spiralOffset = (r / 340) * Math.PI * 2.5;
        const theta = armAngle + spiralOffset + (i * 1.3);
        paintingPositions.push({ r, theta, x: 0, y: 0 });
      }
    };

    assignPaintingPositions();

    const resize = () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);
      time++;

      // Inertia
      if (!isDragging.current) {
        rotationAngle.current += velocityX.current + autoRotateSpeed.current;
        velocityX.current *= 0.96;
      }

      // Smooth camera pan & zoom
      camX.current += (targetCamX.current - camX.current) * 0.08;
      camY.current += (targetCamY.current - camY.current) * 0.08;
      zoom.current += (targetZoom.current - zoom.current) * 0.06;

      const cx = width / 2 + camX.current;
      const cy = height / 2 + camY.current;
      const z = zoom.current;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(z, z);

      // ---- Draw galaxy glow core ----
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 90);
      coreGrad.addColorStop(0, 'rgba(255, 220, 180, 0.22)');
      coreGrad.addColorStop(0.3, 'rgba(196, 140, 255, 0.12)');
      coreGrad.addColorStop(0.7, 'rgba(80, 50, 180, 0.05)');
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 90, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer halo glow
      const haloGrad = ctx.createRadialGradient(0, 0, 80, 0, 0, 360);
      haloGrad.addColorStop(0, 'rgba(120, 80, 220, 0.07)');
      haloGrad.addColorStop(0.5, 'rgba(60, 40, 180, 0.04)');
      haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 360, 160, 0, 0, Math.PI * 2);
      ctx.fill();

      // ---- Draw stars ----
      const rot = rotationAngle.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const t = s.theta + rot;
        const sx = Math.cos(t) * s.r;
        const sy = Math.sin(t) * s.r * 0.45;

        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(s.phase + time * s.twinkle));
        const opacity = brightness * (0.5 + 0.5 * (1 - Math.min(s.r / 380, 1)));

        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${opacity.toFixed(2)})`;
        ctx.fill();

        // Larger stars get a cross sparkle
        if (s.size > 1.5) {
          const sl = s.size * 2.5;
          ctx.strokeStyle = `${s.color}${(opacity * 0.5).toFixed(2)})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(sx - sl, sy); ctx.lineTo(sx + sl, sy);
          ctx.moveTo(sx, sy - sl); ctx.lineTo(sx, sy + sl);
          ctx.stroke();
        }
      }

      // ---- Draw painting stars ----
      const currentPaintings = paintingsRef.current;
      // Ensure screenPosRef has correct length
      if (screenPosRef.current.length !== currentPaintings.length) {
        screenPosRef.current = currentPaintings.map(() => ({ x: 0, y: 0, visible: false }));
      }
      for (let i = 0; i < paintingPositions.length; i++) {
        const pp = paintingPositions[i];
        const t = pp.theta + rot;
        const px = Math.cos(t) * pp.r;
        const py = Math.sin(t) * pp.r * 0.45;

        // Store screen coords for hit-testing (in galaxy-space)
        paintingPositions[i].x = px;
        paintingPositions[i].y = py;

        // Compute true screen coords (canvas pixel)
        const screenX = cx + px * z;
        const screenY = cy + py * z;
        const inView = screenX > -80 && screenX < width + 80 && screenY > -80 && screenY < height + 80;
        if (screenPosRef.current[i]) {
          screenPosRef.current[i] = { x: screenX, y: screenY, visible: inView };
        }

        const isSelected = selectedRef.current?.id === currentPaintings[i]?.id;
        const isHovered = hoveredIdx.current === i;

        const pulse = 0.7 + 0.3 * Math.sin(time * 0.04 + i * 1.1);

        if (isSelected || isHovered) {
          // Glow ring
          const glow = ctx.createRadialGradient(px, py, 0, px, py, isSelected ? 38 : 28);
          glow.addColorStop(0, isSelected ? 'rgba(100,220,255,0.35)' : 'rgba(180,140,255,0.25)');
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 38 : 28, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bright star orb
        const orbR = isSelected ? 10 : isHovered ? 8 : 5 + pulse * 1.5;
        const orbGrad = ctx.createRadialGradient(px, py, 0, px, py, orbR);
        if (isSelected) {
          orbGrad.addColorStop(0, 'rgba(255,255,255,1)');
          orbGrad.addColorStop(0.4, 'rgba(100,220,255,0.9)');
          orbGrad.addColorStop(1, 'rgba(60,120,255,0)');
        } else if (isHovered) {
          orbGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
          orbGrad.addColorStop(0.5, 'rgba(200,150,255,0.7)');
          orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
        } else {
          orbGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
          orbGrad.addColorStop(0.4, 'rgba(220,180,255,0.6)');
          orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
        }
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(px, py, orbR, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair sparkle
        const sl = orbR * 3;
        const alpha = isSelected ? 0.8 : isHovered ? 0.6 : 0.35 * pulse;
        ctx.strokeStyle = isSelected ? `rgba(100,220,255,${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = isSelected ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(px - sl, py); ctx.lineTo(px + sl, py);
        ctx.moveTo(px, py - sl); ctx.lineTo(px, py + sl);
        ctx.stroke();

        // Label above star
        if (isSelected || isHovered) {
          const title = currentPaintings[i]?.title ?? '';
          const labelY = py - orbR - 14;
          ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '9px Inter, sans-serif';
          ctx.textAlign = 'center';
          const metrics = ctx.measureText(title);
          const pad = 5;
          ctx.fillStyle = isSelected ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)';
          ctx.beginPath();
          ctx.roundRect(px - metrics.width / 2 - pad, labelY - 11, metrics.width + pad * 2, 14, 4);
          ctx.fill();
          ctx.fillStyle = isSelected ? '#67e8f9' : '#e2e8f0';
          ctx.fillText(title, px, labelY);
        }
      }

      ctx.restore();

      // Sync screen positions to React state every ~100ms for HTML overlays
      const now = performance.now();
      if (now - lastSyncTime.current > 80) {
        lastSyncTime.current = now;
        setScreenPositions([...screenPosRef.current]);
      }
    };

    animate();

    // ---- Pointer events ----
    const getCanvasPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - width / 2 - camX.current) / zoom.current,
        y: (e.clientY - rect.top - height / 2 - camY.current) / zoom.current,
      };
    };

    const hitTestPainting = (cx: number, cy: number): number => {
      let closest = -1;
      let minDist = 30 / zoom.current;
      for (let i = 0; i < paintingPositions.length; i++) {
        const pp = paintingPositions[i];
        const dx = cx - pp.x;
        const dy = cy - pp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      return closest;
    };

    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      isDragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      velocityX.current = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging.current) {
        const dx = e.clientX - lastX.current;
        rotationAngle.current += dx * 0.004;
        velocityX.current = dx * 0.004;
        lastX.current = e.clientX;
        lastY.current = e.clientY;
        canvas.style.cursor = 'grabbing';
      } else {
        // hover detection
        const { x, y } = getCanvasPos(e);
        const idx = hitTestPainting(x, y);
        hoveredIdx.current = idx;
        canvas.style.cursor = idx >= 0 ? 'pointer' : 'grab';
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      canvas.style.cursor = 'grab';

      // Click threshold: if barely moved, treat as click
      const dx = e.clientX - lastX.current;
      if (Math.abs(dx) < 5) {
        const { x, y } = getCanvasPos(e);
        const idx = hitTestPainting(x, y);
        if (idx >= 0) {
          const painting = paintingsRef.current[idx];
          if (painting) {
            if (selectedRef.current?.id === painting.id) {
              // Deselect
              onSelectRef.current(null);
              targetCamX.current = 0;
              targetCamY.current = 0;
              targetZoom.current = 1;
            } else {
              onSelectRef.current(painting);
              // Pan camera to center on this star
              const pp = paintingPositions[idx];
              targetCamX.current = -pp.x * zoom.current;
              targetCamY.current = -pp.y * 0.45 * zoom.current * 0.45;
              targetZoom.current = 1.6;
            }
          }
        } else {
          // Click on empty space — deselect
          onSelectRef.current(null);
          targetCamX.current = 0;
          targetCamY.current = 0;
          targetZoom.current = 1;
        }
      }
    };

    const onPointerLeave = () => {
      isDragging.current = false;
      hoveredIdx.current = -1;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  // When selectedPainting changes externally (e.g. list click), re-center camera
  useEffect(() => {
    if (!selectedPainting) {
      targetCamX.current = 0;
      targetCamY.current = 0;
      targetZoom.current = 1;
    }
  }, [selectedPainting]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: 'grab', touchAction: 'none' }}
      />

      {/* HTML Image Overlays — floating thumbnails on each painting star */}
      {screenPositions.map((sp, i) => {
        if (!sp.visible || !paintings[i]) return null;
        const p = paintings[i];
        const isSelected = selectedPainting?.id === p.id;
        const thumbSize = isSelected ? 100 : 56;
        return (
          <div
            key={p.id}
            onClick={() => {
              if (isSelected) {
                onSelectPainting(null);
                targetCamX.current = 0;
                targetCamY.current = 0;
                targetZoom.current = 1;
              } else {
                onSelectPainting(p);
                const ppIdx = i;
                targetCamX.current = -(screenPositions[ppIdx]?.x ?? 0) * zoom.current;
                targetCamY.current = -(screenPositions[ppIdx]?.y ?? 0) * zoom.current;
                targetZoom.current = 1.6;
              }
            }}
            style={{
              position: 'absolute',
              left: sp.x - thumbSize / 2,
              top: sp.y - thumbSize - 14,
              width: thumbSize,
              height: thumbSize,
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              zIndex: isSelected ? 20 : 10,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: isSelected ? '14px' : '10px',
                overflow: 'hidden',
                border: isSelected
                  ? '2.5px solid rgba(100,220,255,0.9)'
                  : '2px solid rgba(180,140,255,0.55)',
                boxShadow: isSelected
                  ? '0 0 24px 8px rgba(80,200,255,0.4), 0 0 60px 20px rgba(80,180,255,0.15)'
                  : '0 0 12px 4px rgba(160,120,255,0.3)',
                background: '#0a0a18',
              }}
            >
              <img
                src={p.url}
                alt={p.title}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
            {/* Connector line from image to star dot */}
            <div style={{
              position: 'absolute',
              bottom: -13,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 1.5,
              height: 12,
              background: isSelected
                ? 'linear-gradient(to bottom, rgba(100,220,255,0.7), rgba(100,220,255,0))'
                : 'linear-gradient(to bottom, rgba(180,140,255,0.5), rgba(180,140,255,0))',
            }} />
          </div>
        );
      })}

      {/* Mini legend */}
      <div className="absolute bottom-14 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-violet-800/40">
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_2px_rgba(200,180,255,0.8)]" />
        <span className="text-[9px] font-bold text-violet-300 uppercase tracking-wider">Click ngôi sao để xem tranh</span>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// MAIN PHONG TRANH PANORAMA COMPONENT
// ----------------------------------------------------
export default function PhongTranhPanorama({ onBack }: { onBack: () => void }) {
  const [paintings, setPaintings] = useState<PaintingData[]>([]);
  const [activeLayout, setActiveLayout] = useState<'cylinder' | 'hallway' | 'cube' | 'galaxy'>('cylinder');
  const [activeTheme, setActiveTheme] = useState<'technology' | 'galaxy' | 'ocean'>('technology');
  
  const [selectedPainting, setSelectedPainting] = useState<PaintingData | null>(null);
  const [editingPainting, setEditingPainting] = useState<PaintingData | null>(null);
  
  const [autoTour, setAutoTour] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'manage'>('gallery');
  
  const synthRef = useRef<AmbientSynth | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Drag states
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);
  const rotationY = useRef(0);
  const targetRotation = useRef(0);

  // Initialize samples if empty
  useEffect(() => {
    if (paintings.length === 0) {
      setPaintings(DEFAULT_PAINTINGS);
    }
  }, [paintings]);

  // Audio lifecycle
  useEffect(() => {
    if (musicOn) {
      if (!synthRef.current) {
        synthRef.current = new AmbientSynth();
      }
      synthRef.current.start();
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, [musicOn]);

  // Pointer drag controls (works on both touch and mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startRotation.current = rotationY.current;
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !ringRef.current) return;
    const dx = e.clientX - startX.current;
    const sensitivity = 0.35;
    targetRotation.current = startRotation.current - dx * sensitivity;
    
    gsap.to(ringRef.current, {
      rotationY: targetRotation.current,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        if (ringRef.current) {
          rotationY.current = gsap.getProperty(ringRef.current, "rotationY") as number;
        }
      }
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.cursor = 'grab';
    }
  };

  const handleCardClick = (painting: PaintingData, cardAngle: number) => {
    setSelectedPainting(painting);
    
    // Nearest shortest path rotation math
    const currentRot = rotationY.current;
    const diff = ((-cardAngle - currentRot) % 360);
    const shortestDiff = ((diff + 540) % 360) - 180;
    const newTarget = currentRot + shortestDiff;
    targetRotation.current = newTarget;

    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotationY: newTarget,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => {
          if (ringRef.current) {
            rotationY.current = gsap.getProperty(ringRef.current, "rotationY") as number;
          }
        }
      });
    }
  };

  // Auto Tour lifecycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoTour && paintings.length > 0) {
      let currentIndex = paintings.findIndex(p => p.id === selectedPainting?.id);
      if (currentIndex === -1) currentIndex = 0;

      interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % paintings.length;
        const nextPainting = paintings[nextIndex];
        const count = paintings.length;
        
        let cardAngle = 0;
        if (activeLayout === 'hallway') {
          cardAngle = -45 + (nextIndex / (count - 1 || 1)) * 90;
        } else if (activeLayout === 'cube') {
          cardAngle = (nextIndex % 4) * 90;
        } else {
          cardAngle = (nextIndex / count) * 360;
        }

        setSelectedPainting(nextPainting);
        
        const currentRot = rotationY.current;
        const diff = ((-cardAngle - currentRot) % 360);
        const shortestDiff = ((diff + 540) % 360) - 180;
        const newTarget = currentRot + shortestDiff;
        targetRotation.current = newTarget;

        if (ringRef.current) {
          gsap.to(ringRef.current, {
            rotationY: newTarget,
            duration: 0.9,
            ease: 'power3.out',
            overwrite: 'auto',
            onUpdate: () => {
              if (ringRef.current) {
                rotationY.current = gsap.getProperty(ringRef.current, "rotationY") as number;
              }
            }
          });
        }

        currentIndex = nextIndex;
      }, 5500);
    }
    return () => clearInterval(interval);
  }, [autoTour, paintings, selectedPainting, activeLayout]);

  // Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUploaded: PaintingData[] = [];
    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file);
      newUploaded.push({
        id: `uploaded-${Date.now()}-${index}`,
        url: url,
        title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        author: 'Tác giả học sinh',
        desc: 'Hình ảnh được tải lên từ thiết bị trưng bày trong phòng triển lãm ảo.'
      });
    });

    setPaintings(prev => [...prev, ...newUploaded]);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.85 }
    });
  };

  // Delete Painting
  const handleDeletePainting = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPainting?.id === id) {
      setSelectedPainting(null);
    }
    setPaintings(prev => prev.filter(p => p.id !== id));
  };

  // Edit Save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPainting) return;

    setPaintings(prev => prev.map(p => p.id === editingPainting.id ? editingPainting : p));
    if (selectedPainting?.id === editingPainting.id) {
      setSelectedPainting(editingPainting);
    }
    setEditingPainting(null);

    confetti({
      particleCount: 30,
      spread: 20,
      colors: ['#06b6d4', '#6366f1']
    });
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`w-full flex flex-col bg-slate-950 font-sans text-slate-100 overflow-hidden select-none transition-all ${
        isFullscreen ? 'h-screen' : 'h-[calc(100vh-80px)] rounded-3xl border border-slate-800 shadow-2xl'
      }`}
    >
      {/* 1. HEADER CONTROLS */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button 
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-sm md:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              Phòng Tranh Triển Lãm 3D
            </h1>
            <p className="text-[9px] md:text-[10px] text-cyan-400 font-bold uppercase tracking-widest leading-none mt-1">
              Góc trưng bày tác phẩm của học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-sans z-50">
          {/* Toggle View Mode */}
          <button
            onClick={() => setViewMode(prev => prev === 'gallery' ? 'manage' : 'gallery')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 px-3.5 ${
              viewMode === 'manage' 
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white shadow-lg shadow-cyan-950/20' 
                : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={viewMode === 'manage' ? "Quay lại xem triển lãm" : "Quản lý tác phẩm & Tải ảnh"}
          >
            {viewMode === 'manage' ? (
              <>
                <Eye className="w-4 h-4 text-emerald-450" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Xem Triển Lãm</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Quản lý tác phẩm</span>
              </>
            )}
          </button>

          {/* Audio */}
          <button
            onClick={() => setMusicOn(!musicOn)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              musicOn 
                ? 'bg-linear-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-lg shadow-emerald-950/20' 
                : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={musicOn ? "Tắt nhạc nền" : "Bật nhạc nền"}
          >
            {musicOn ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Tour */}
          <button
            onClick={() => setAutoTour(!autoTour)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 px-3 ${
              autoTour 
                ? 'bg-linear-to-r from-violet-500 to-indigo-500 border-violet-400 text-white shadow-lg' 
                : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={autoTour ? "Dừng tự động" : "Tự động trình chiếu (Auto Tour)"}
          >
            {autoTour ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Dừng Tour</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Auto Tour</span>
              </>
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center justify-center"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDE PANEL */}
        {viewMode === 'manage' && (
          <aside className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-900/95 flex flex-col shrink-0 overflow-y-auto max-h-[320px] md:max-h-none z-20 custom-scrollbar shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-5 space-y-6">
            
            {/* LAYOUT OPTION */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Cấu hình phòng triển lãm
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl shadow-inner">
                <button
                  onClick={() => {
                    setActiveLayout('cylinder');
                    setSelectedPainting(null);
                  }}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeLayout === 'cylinder' 
                      ? 'bg-slate-800 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Vòng tròn
                </button>
                <button
                  onClick={() => {
                    setActiveLayout('hallway');
                    setSelectedPainting(null);
                  }}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeLayout === 'hallway' 
                      ? 'bg-slate-800 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bức tường
                </button>
                <button
                  onClick={() => {
                    setActiveLayout('cube');
                    setSelectedPainting(null);
                  }}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeLayout === 'cube' 
                      ? 'bg-slate-800 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Phòng vuông
                </button>
                <button
                  onClick={() => {
                    setActiveLayout('galaxy');
                    setSelectedPainting(null);
                  }}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeLayout === 'galaxy' 
                      ? 'bg-linear-to-r from-violet-800/60 to-indigo-800/60 text-violet-200 border border-violet-500/50 shadow-md shadow-violet-950/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✦ Thiên hà
                </button>
              </div>
            </div>

            {/* SPACE THEMES */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" /> Chủ đề không gian
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl shadow-inner">
                <button
                  onClick={() => setActiveTheme('technology')}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeTheme === 'technology' 
                      ? 'bg-linear-to-r from-cyan-600/30 to-cyan-700/30 text-cyan-300 border border-cyan-500/40 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Công nghệ
                </button>
                <button
                  onClick={() => setActiveTheme('galaxy')}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeTheme === 'galaxy' 
                      ? 'bg-linear-to-r from-indigo-600/30 to-indigo-700/30 text-indigo-300 border border-indigo-500/40 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Vũ trụ
                </button>
                <button
                  onClick={() => setActiveTheme('ocean')}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeTheme === 'ocean' 
                      ? 'bg-linear-to-r from-blue-600/30 to-blue-700/30 text-blue-300 border border-blue-500/40 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Đại dương
                </button>
              </div>
            </div>

            {/* UPLOAD FORM */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> Tải lên tác phẩm
              </label>
              
              <label className="w-full h-24 border-2 border-dashed border-slate-700/85 hover:border-cyan-500/60 rounded-2xl flex flex-col items-center justify-center p-4 bg-slate-950/40 hover:bg-slate-950/80 transition-all cursor-pointer group">
                <ImageIcon className="w-7 h-7 text-slate-500 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
                <span className="text-[10px] font-bold text-slate-400 mt-2 group-hover:text-slate-200">Chọn ảnh từ máy thiết bị</span>
                <span className="text-[8px] text-slate-600 mt-0.5">JPEG, PNG, WEBP</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
            </div>

            {/* LIST OF PAINTINGS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Tác phẩm hiển thị ({paintings.length})
                </label>
                {paintings.length > DEFAULT_PAINTINGS.length && (
                  <button 
                    onClick={() => {
                      setPaintings(DEFAULT_PAINTINGS);
                      setSelectedPainting(null);
                    }}
                    className="text-[9px] font-bold text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    Khôi phục gốc
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {paintings.map((p) => {
                  const isSelected = selectedPainting?.id === p.id;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => {
                        if (activeLayout === 'galaxy') {
                          setSelectedPainting(p);
                        } else {
                          const count = paintings.length;
                          const idx = paintings.findIndex(x => x.id === p.id);
                          let cardAngle = 0;
                          if (activeLayout === 'hallway') {
                            cardAngle = -45 + (idx / (count - 1 || 1)) * 90;
                          } else if (activeLayout === 'cube') {
                            cardAngle = (idx % 4) * 90;
                          } else {
                            cardAngle = (idx / count) * 360;
                          }
                          handleCardClick(p, cardAngle);
                        }
                      }}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
                        isSelected 
                          ? 'bg-slate-800/80 border-cyan-500 shadow-md shadow-cyan-950/20' 
                          : 'bg-slate-950/50 hover:bg-slate-950/90 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img 
                          src={p.url} 
                          alt={p.title} 
                          className="w-9 h-9 rounded-lg object-cover bg-slate-800 border border-slate-700/50 shrink-0" 
                        />
                        <div className="min-w-0 text-left">
                          <h4 className="text-[11.5px] font-extrabold text-white truncate">{p.title}</h4>
                          <p className="text-[9px] text-slate-400 font-bold truncate">{p.author}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPainting(p);
                          }}
                          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-cyan-400 transition-colors"
                          title="Sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePainting(p.id, e)}
                          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>
      )}

        {/* RIGHT 3D CANVAS REPLACEMENT (GSAP 3D STAGE) */}
        <main 
          className={`flex-1 h-full relative overflow-hidden transition-all duration-500 ${
            activeLayout === 'galaxy'
              ? 'bg-[#000005]'
              : activeTheme === 'technology' 
              ? 'bg-[#020617]' 
              : activeTheme === 'galaxy'
              ? 'bg-radial from-slate-950 via-[#030616] to-[#010208]'
              : 'bg-radial from-[#092e42] via-[#041a29] to-[#010912]'
          }`}
        >
          {/* Space Raylights overlay for Ocean theme */}
          {activeTheme === 'ocean' && (
            <div className="absolute inset-0 bg-linear-to-b from-cyan-400/5 via-transparent to-transparent pointer-events-none z-1" />
          )}

          {/* Perspective grid floor overlay for technology theme */}
          {activeTheme === 'technology' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] origin-bottom opacity-15"
                style={{
                  transform: 'perspective(500px) rotateX(75deg)',
                  backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                }}
              />
            </div>
          )}

          {/* Perspective grid floor overlay for galaxy theme */}
          {activeTheme === 'galaxy' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] origin-bottom opacity-10"
                style={{
                  transform: 'perspective(500px) rotateX(75deg)',
                  backgroundImage: 'linear-gradient(to right, #818cf8 1px, transparent 1px), linear-gradient(to bottom, #818cf8 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                }}
              />
            </div>
          )}

          {/* Interactive particles background */}
          <ParticleCanvas theme={activeTheme} />

          {/* Top layout HUD label */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left pointer-events-none shadow-lg">
            <span className="text-[9px] text-cyan-400 font-black uppercase tracking-wider block">Góc triển lãm</span>
            <span className="text-xs font-black text-white uppercase">
              {activeLayout === 'cylinder' ? 'Phòng Tròn 3D' : activeLayout === 'hallway' ? 'Bức Tường Nghệ Thuật' : activeLayout === 'cube' ? 'Hộp Không Gian' : '✦ Thiên Hà Galaxy'}
            </span>
          </div>

          {/* Toggle View Mode Button in Viewport */}
          <button
            onClick={() => setViewMode(prev => prev === 'gallery' ? 'manage' : 'gallery')}
            className="absolute top-4 right-4 z-20 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-black uppercase tracking-wide text-cyan-450 hover:text-cyan-350 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {viewMode === 'manage' ? (
              <>
                <Eye className="w-4 h-4 text-emerald-400" />
                Xem triển lãm 3D
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-cyan-400 animate-bounce" style={{ animationDuration: '3s' }} />
                Quản lý tác phẩm
              </>
            )}
          </button>

          {/* Bottom HUD guidance */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto z-10 px-3.5 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-center md:justify-start gap-1.5 pointer-events-none shadow-lg max-w-lg">
            <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-medium text-[9.5px]">Kéo/quẹt màn hình để xoay vòng tranh • Click chọn tranh để xem cận cảnh chi tiết</span>
          </div>

          {/* 3D VIEWPORT CONTAINER (hidden when galaxy layout) */}
          {activeLayout !== 'galaxy' && (
          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: '1600px', touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* The revolving 3D Ring */}
            <div
              ref={ringRef}
              className="relative flex items-center justify-center"
              style={{
                width: '250px',
                height: '350px',
                transformStyle: 'preserve-3d',
                transform: `rotateX(-3deg) rotateY(0deg)`,
                willChange: 'transform',
              }}
            >
              {paintings.map((p, idx) => {
                const count = paintings.length;
                const isSelected = selectedPainting?.id === p.id;
                
                // Spacing angle & translations math
                let angle = 0;
                let cardRadius = Math.max(450, (count * 310) / (2 * Math.PI));
                let rotateYValue = 0;
                let translateZValue = cardRadius;
                let translateXValue = 0;

                if (activeLayout === 'hallway') {
                  // Arc curve (wall look)
                  const span = Math.min(100, (count - 1) * 22);
                  angle = count > 1 
                    ? -span / 2 + (idx / (count - 1)) * span 
                    : 0;
                  rotateYValue = angle;
                  translateZValue = cardRadius - 60; // flatter look
                } else if (activeLayout === 'cube') {
                  // Box Room Layout
                  const wall = idx % 4;
                  const row = Math.floor(idx / 4);
                  const wallAngle = wall * 90;
                  const rowSpacing = 280;
                  const rowCount = Math.ceil(count / 4);
                  const rowOffset = (row - (rowCount - 1) / 2) * rowSpacing;

                  angle = wallAngle;
                  rotateYValue = wallAngle;
                  translateZValue = 400;
                  translateXValue = rowOffset;
                } else {
                  // Cylinder: full circular carousel
                  angle = (idx / count) * 360;
                  rotateYValue = angle;
                  translateZValue = cardRadius;
                }

                return (
                  <div
                    key={p.id}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${rotateYValue}deg) translateZ(${translateZValue}px) translateX(${translateXValue}px)`,
                      backfaceVisibility: activeLayout === 'cylinder' ? 'hidden' : 'visible',
                      willChange: 'transform',
                    }}
                  >
                    {/* Inner 3D card slot to isolate hovers */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(p, angle);
                      }}
                      className={`dropdown-item w-full h-full rounded-2xl border-3 flex flex-col justify-between overflow-hidden relative shadow-2xl select-none group/card ${
                        isSelected 
                          ? 'border-cyan-400 bg-slate-900 scale-102 ring-4 ring-cyan-500/20' 
                          : 'border-slate-800 hover:border-cyan-400/50 hover:scale-105 bg-slate-950/90'
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s, scale 0.3s',
                        willChange: 'transform',
                      }}
                    >
                      {/* Image frame */}
                      <div className="w-full flex-1 overflow-hidden relative bg-slate-900">
                        <img
                          src={p.url}
                          alt={p.title}
                          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover/card:scale-106"
                          onError={(e) => {
                            // If Unsplash/external load fails, render fallback canvas graphic
                            const imgNode = e.currentTarget;
                            imgNode.style.display = 'none';
                            const fallback = imgNode.nextElementSibling as HTMLDivElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        {/* Fallback frame UI (immunity to CORS errors) */}
                        <div 
                          className="absolute inset-0 hidden flex-col items-center justify-center p-4 bg-slate-900 text-center"
                          style={{ display: 'none' }}
                        >
                          <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
                          <span className="text-[10px] font-bold text-slate-400">{p.title}</span>
                        </div>
                        
                        {/* Subtle spotlight reflection overlay */}
                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                      </div>

                      {/* Header/Bottom info tab */}
                      <div className="bg-slate-900 border-t border-slate-800 p-3 text-left">
                        <h4 className="text-xs font-black text-white truncate">{p.title}</h4>
                        <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5 truncate flex items-center gap-1">
                          <User className="w-2.5 h-2.5" /> {p.author}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* GALAXY LAYOUT */}
          {activeLayout === 'galaxy' && (
            <GalaxyLayout
              paintings={paintings}
              selectedPainting={selectedPainting}
              onSelectPainting={setSelectedPainting}
            />
          )}

          {/* 2D HUD PANEL FOR DETAILED INFORMATION */}
          {selectedPainting && (
            <div className={`absolute z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 ${
              activeLayout === 'galaxy'
                ? 'bottom-16 right-4 max-w-xs w-full p-0 overflow-hidden'
                : 'bottom-4 right-4 max-w-sm w-full p-4'
            }`}>
              {activeLayout === 'galaxy' ? (
                /* Galaxy mode: image-forward card */
                <>
                  <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-slate-950">
                    <img
                      src={selectedPainting.url}
                      alt={selectedPainting.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-transparent to-transparent" />
                    <button
                      onClick={() => setSelectedPainting(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wide line-clamp-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        {selectedPainting.title}
                      </h3>
                      <p className="text-[9px] text-cyan-400 font-bold mt-0.5 flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> {selectedPainting.author}
                      </p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium line-clamp-3">
                      {selectedPainting.desc}
                    </p>
                    <div className="mt-2.5 flex gap-2 justify-end">
                      <button
                        onClick={() => setSelectedPainting(null)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        Trở lại
                      </button>
                      <a
                        href={selectedPainting.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-linear-to-r from-violet-500 to-indigo-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem ảnh
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                /* Normal mode: existing panel */
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-left pr-4">
                      <h3 className="text-xs md:text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        {selectedPainting.title}
                      </h3>
                      <p className="text-[10px] text-cyan-400 font-bold mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> Tác giả: {selectedPainting.author}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPainting(null)}
                      className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-left">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      {selectedPainting.desc}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2 justify-end">
                    <button
                      onClick={() => setSelectedPainting(null)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Trở lại
                    </button>
                    <a
                      href={selectedPainting.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-linear-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem ảnh
                    </a>
                  </div>
                </>
              )}
            </div>
          )}

        </main>
      </div>

      {/* 4. MODAL DIALOG EDIT DETAILS */}
      {editingPainting && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full relative text-left">
            <button 
              className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-all cursor-pointer"
              onClick={() => setEditingPainting(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-800">
              <Edit3 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-black text-white">Chỉnh sửa thông tin tác phẩm</h3>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Tên tác phẩm
                </label>
                <input 
                  type="text" 
                  required
                  value={editingPainting.title} 
                  onChange={(e) => setEditingPainting(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3.5 py-2 rounded-xl text-xs font-bold text-white outline-none transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Tác giả
                </label>
                <input 
                  type="text" 
                  required
                  value={editingPainting.author} 
                  onChange={(e) => setEditingPainting(prev => prev ? { ...prev, author: e.target.value } : null)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3.5 py-2 rounded-xl text-xs font-bold text-white outline-none transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Mô tả tác phẩm
                </label>
                <textarea 
                  rows={3}
                  required
                  value={editingPainting.desc} 
                  onChange={(e) => setEditingPainting(prev => prev ? { ...prev, desc: e.target.value } : null)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 outline-none transition-all resize-none leading-relaxed" 
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingPainting(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
