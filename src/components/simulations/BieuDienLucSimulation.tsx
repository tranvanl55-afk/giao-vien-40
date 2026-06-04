import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Check, RefreshCw, Compass, Sparkles, 
  ChevronRight, ChevronLeft, Maximize, Minimize, AlertCircle, 
  CheckCircle2, Info, HelpCircle, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Scenario {
  id: string;
  name: string;
  description: string;
  objectName: string;
  forceType: string;
  correctPoint: 'center' | 'left' | 'right' | 'bottom';
  correctDirection: 'horizontal' | 'vertical';
  correctSense: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
  pointsOptions: { id: string; label: string; desc: string; cx: number; cy: number; isCorrect: boolean }[];
  directionOptions: { id: string; label: string; arrow: string; isCorrect: boolean }[];
  scaleOptions: { magnitude: number; scaleText: string; units: number }[];
  renderObject: (isSelectedPoint: string | null) => React.JSX.Element;
}

export function BieuDienLucSimulation({ onBack }: { onBack: () => void }) {
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

  // --- SCENARIO DATA ---
  const scenarios: Scenario[] = [
    {
      id: 'gravity',
      name: 'Trọng lực tác dụng lên quả táo',
      description: 'Quả táo đang rơi tự do chịu tác dụng của lực hút Trái Đất (Trọng lực).',
      objectName: 'Quả táo',
      forceType: 'Trọng lực (Lực hút của Trái Đất)',
      correctPoint: 'center',
      correctDirection: 'vertical',
      correctSense: 'top-to-bottom',
      pointsOptions: [
        { id: 'top', label: 'Cuống táo (Điểm A)', desc: 'Sai! Cuống táo chỉ là điểm liên kết khi treo, trọng lực tác dụng lên toàn bộ quả táo nên điểm đặt quy ước ở tâm vật.', cx: 150, cy: 110, isCorrect: false },
        { id: 'center', label: 'Tâm quả táo (Điểm B)', desc: 'Chính xác! Trọng lực có điểm đặt tại tâm (trọng tâm) của quả táo.', cx: 150, cy: 160, isCorrect: true },
        { id: 'bottom', label: 'Đáy quả táo (Điểm C)', desc: 'Sai! Đáy quả táo không phải là nơi đặt trọng lực quy ước.', cx: 150, cy: 210, isCorrect: false },
      ],
      directionOptions: [
        { id: 'horizontal-right', label: 'Nằm ngang, hướng sang phải', arrow: '→', isCorrect: false },
        { id: 'vertical-up', label: 'Thẳng đứng, chiều từ dưới lên trên', arrow: '↑', isCorrect: false },
        { id: 'vertical-down', label: 'Thẳng đứng, chiều từ trên xuống dưới', arrow: '↓', isCorrect: true },
        { id: 'horizontal-left', label: 'Nằm ngang, hướng sang trái', arrow: '←', isCorrect: false },
      ],
      scaleOptions: [
        { magnitude: 10, scaleText: 'Tỉ xích: 1 cm ứng với 10 N', units: 1 },
        { magnitude: 20, scaleText: 'Tỉ xích: 1 cm ứng với 10 N', units: 2 },
        { magnitude: 30, scaleText: 'Tỉ xích: 1 cm ứng với 10 N', units: 3 },
        { magnitude: 40, scaleText: 'Tỉ xích: 1 cm ứng với 10 N', units: 4 },
      ],
      renderObject: (selectedPoint) => (
        <g>
          {/* Background branch/leaves */}
          <path d="M 50,70 Q 150,60 250,70" stroke="#78350f" strokeWidth="6" fill="none" opacity="0.6" />
          <path d="M 120,65 Q 140,40 160,65" fill="#15803d" opacity="0.8" />
          
          {/* Stem */}
          <path d="M 150,110 Q 155,130 150,140" stroke="#78350f" strokeWidth="4" fill="none" />
          
          {/* Apple Body */}
          <path d="M 150,135 C 130,135 110,145 110,170 C 110,200 135,215 150,215 C 165,215 190,200 190,170 C 190,145 170,135 150,135 Z" fill="#dc2626" filter="drop-shadow(0 10px 15px rgba(220, 38, 38, 0.3))" />
          
          {/* Leaf */}
          <path d="M 150,115 Q 165,100 170,115 Q 155,125 150,115" fill="#22c55e" />
          
          {/* Highlight */}
          <ellipse cx="135" cy="155" rx="8" ry="12" fill="#fca5a5" opacity="0.6" transform="rotate(-15, 135, 155)" />
        </g>
      )
    },
    {
      id: 'push',
      name: 'Lực đẩy của người lên thùng gỗ',
      description: 'Lực đẩy tác dụng để di chuyển một thùng hàng nặng trên mặt sàn nằm ngang.',
      objectName: 'Thùng gỗ',
      forceType: 'Lực đẩy',
      correctPoint: 'left',
      correctDirection: 'horizontal',
      correctSense: 'left-to-right',
      pointsOptions: [
        { id: 'left', label: 'Bên trái mặt thùng (Điểm A)', desc: 'Chính xác! Lực đẩy có điểm đặt tiếp xúc tại mặt bên trái của thùng hàng nơi tay người tác dụng lực.', cx: 100, cy: 160, isCorrect: true },
        { id: 'center', label: 'Trọng tâm thùng (Điểm B)', desc: 'Sai! Lực đẩy này là lực tiếp xúc trực tiếp, điểm đặt phải nằm ở vị trí tiếp xúc bên trái.', cx: 150, cy: 160, isCorrect: false },
        { id: 'right', label: 'Bên phải mặt thùng (Điểm C)', desc: 'Sai! Vị trí này không phải là nơi tiếp xúc đẩy thùng sang phải.', cx: 200, cy: 160, isCorrect: false },
      ],
      directionOptions: [
        { id: 'horizontal-right', label: 'Nằm ngang, chiều từ trái sang phải', arrow: '→', isCorrect: true },
        { id: 'vertical-down', label: 'Thẳng đứng, chiều từ trên xuống dưới', arrow: '↓', isCorrect: false },
        { id: 'horizontal-left', label: 'Nằm ngang, chiều từ phải sang trái', arrow: '←', isCorrect: false },
        { id: 'vertical-up', label: 'Thẳng đứng, chiều từ dưới lên trên', arrow: '↑', isCorrect: false },
      ],
      scaleOptions: [
        { magnitude: 50, scaleText: 'Tỉ xích: 1 cm ứng với 50 N', units: 1 },
        { magnitude: 100, scaleText: 'Tỉ xích: 1 cm ứng với 50 N', units: 2 },
        { magnitude: 150, scaleText: 'Tỉ xích: 1 cm ứng với 50 N', units: 3 },
        { magnitude: 200, scaleText: 'Tỉ xích: 1 cm ứng với 50 N', units: 4 },
      ],
      renderObject: (selectedPoint) => (
        <g>
          {/* Ground */}
          <line x1="40" y1="210" x2="260" y2="210" stroke="#475569" strokeWidth="4" />
          {/* Crate body */}
          <rect x="100" y="110" width="100" height="100" fill="#b45309" stroke="#78350f" strokeWidth="4" rx="4" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))" />
          
          {/* Wooden planks details */}
          <line x1="100" y1="160" x2="200" y2="160" stroke="#78350f" strokeWidth="2" />
          <line x1="150" y1="110" x2="150" y2="210" stroke="#78350f" strokeWidth="2" />
          
          {/* Diagonal plank */}
          <line x1="104" y1="114" x2="196" y2="206" stroke="#78350f" strokeWidth="3" />
        </g>
      )
    },
    {
      id: 'pull',
      name: 'Lực kéo một chiếc xe đẩy đồ chơi',
      description: 'Người dùng móc sợi dây thừng và kéo chiếc xe lăn bánh về phía bên phải.',
      objectName: 'Xe đồ chơi',
      forceType: 'Lực kéo',
      correctPoint: 'right',
      correctDirection: 'horizontal',
      correctSense: 'left-to-right',
      pointsOptions: [
        { id: 'left', label: 'Đuôi xe đẩy (Điểm A)', desc: 'Sai! Ta kéo xe đi bằng đầu dây móc phía trước bên phải, không đặt điểm kéo ở đuôi xe.', cx: 90, cy: 160, isCorrect: false },
        { id: 'center', label: 'Thân chính xe (Điểm B)', desc: 'Sai! Điểm đặt của lực kéo phải ở vị trí tiếp xúc của dây thừng tại móc kéo.', cx: 140, cy: 150, isCorrect: false },
        { id: 'right', label: 'Móc kéo đầu xe (Điểm C)', desc: 'Chính xác! Lực kéo có điểm đặt tại vị trí liên kết dây kéo ở đầu trước của xe đẩy.', cx: 190, cy: 160, isCorrect: true },
      ],
      directionOptions: [
        { id: 'horizontal-right', label: 'Nằm ngang, chiều từ trái sang phải', arrow: '→', isCorrect: true },
        { id: 'vertical-up', label: 'Thẳng đứng, chiều từ dưới lên trên', arrow: '↑', isCorrect: false },
        { id: 'horizontal-left', label: 'Nằm ngang, chiều từ phải sang trái', arrow: '←', isCorrect: false },
        { id: 'vertical-down', label: 'Thẳng đứng, chiều từ trên xuống dưới', arrow: '↓', isCorrect: false },
      ],
      scaleOptions: [
        { magnitude: 10, scaleText: 'Tỉ xích: 1 cm ứng với 10 N', units: 1 },
        { magnitude: 20, scaleText: 'Tỉ xích: 1 cm ứng với 10 N', units: 2 },
        { magnitude: 30, scaleText: 'Tỉ xích: 1 cm ứng với 10 N', units: 3 },
        { magnitude: 40, scaleText: 'Tỉ xích: 1 cm ứng với 10 N', units: 4 },
      ],
      renderObject: (selectedPoint) => (
        <g>
          {/* Ground */}
          <line x1="40" y1="195" x2="260" y2="195" stroke="#475569" strokeWidth="4" />
          
          {/* Wheels */}
          <circle cx="105" cy="180" r="15" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
          <circle cx="105" cy="180" r="4" fill="#cbd5e1" />
          <circle cx="175" cy="180" r="15" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
          <circle cx="175" cy="180" r="4" fill="#cbd5e1" />
          
          {/* Cart body */}
          <rect x="80" y="130" width="110" height="40" fill="#0284c7" stroke="#0369a1" strokeWidth="3" rx="4" />
          {/* Hook at the front */}
          <path d="M 190,150 H 200" stroke="#64748b" strokeWidth="4" />
          <circle cx="200" cy="150" r="5" fill="none" stroke="#64748b" strokeWidth="3" />
        </g>
      )
    },
    {
      id: 'lift',
      name: 'Lực nâng quyển sách trên bàn',
      description: 'Tay người đặt phía dưới đáy và nâng quyển sách lên theo hướng đi lên.',
      objectName: 'Quyển sách',
      forceType: 'Lực nâng',
      correctPoint: 'bottom',
      correctDirection: 'vertical',
      correctSense: 'bottom-to-top',
      pointsOptions: [
        { id: 'top', label: 'Bìa trên sách (Điểm A)', desc: 'Sai! Tay nâng quyển sách từ dưới đáy lên nên lực tiếp xúc phải đặt ở mặt đáy quyển sách.', cx: 150, cy: 130, isCorrect: false },
        { id: 'center', label: 'Chính giữa sách (Điểm B)', desc: 'Sai! Đây không phải điểm tiếp xúc trực tiếp của bàn tay tác dụng lực nâng.', cx: 150, cy: 150, isCorrect: false },
        { id: 'bottom', label: 'Mặt đáy sách (Điểm C)', desc: 'Chính xác! Lực nâng có điểm đặt tại vị trí tiếp xúc của bàn tay nâng ở đáy quyển sách.', cx: 150, cy: 170, isCorrect: true },
      ],
      directionOptions: [
        { id: 'vertical-up', label: 'Thẳng đứng, chiều từ dưới lên trên', arrow: '↑', isCorrect: true },
        { id: 'horizontal-right', label: 'Nằm ngang, hướng sang phải', arrow: '→', isCorrect: false },
        { id: 'vertical-down', label: 'Thẳng đứng, chiều từ trên xuống dưới', arrow: '↓', isCorrect: false },
        { id: 'horizontal-left', label: 'Nằm ngang, hướng sang trái', arrow: '←', isCorrect: false },
      ],
      scaleOptions: [
        { magnitude: 20, scaleText: 'Tỉ xích: 1 cm ứng với 20 N', units: 1 },
        { magnitude: 40, scaleText: 'Tỉ xích: 1 cm ứng với 20 N', units: 2 },
        { magnitude: 60, scaleText: 'Tỉ xích: 1 cm ứng với 20 N', units: 3 },
        { magnitude: 80, scaleText: 'Tỉ xích: 1 cm ứng với 20 N', units: 4 },
      ],
      renderObject: (selectedPoint) => (
        <g>
          {/* Table surface (reference) */}
          <line x1="40" y1="210" x2="260" y2="210" stroke="#b45309" strokeWidth="6" opacity="0.4" />
          
          {/* Book Stack */}
          <rect x="90" y="130" width="120" height="40" fill="#db2777" stroke="#be185d" strokeWidth="3" rx="4" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.25))" />
          
          {/* Pages lines details */}
          <rect x="93" y="145" width="114" height="22" fill="#fff" opacity="0.9" />
          <line x1="95" y1="150" x2="205" y2="150" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="95" y1="155" x2="205" y2="155" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="95" y1="160" x2="205" y2="160" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Title on spine */}
          <text x="150" y="142" fontSize="9" fontWeight="black" fill="#fff" textAnchor="middle" letterSpacing="2">KHTN 6</text>
        </g>
      )
    }
  ];

  // --- STATE ---
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1); // 1: Chọn lực, 2: Chọn độ lớn & tỉ xích, 3: Thực hành
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [selectedMagnitude, setSelectedMagnitude] = useState<number>(20);
  const [selectedScaleIndex, setSelectedScaleIndex] = useState<number>(1); // default second option

  // Step 3 Substeps
  const [practiceStep, setPracticeStep] = useState<1 | 2 | 3 | 4>(1); // 1: Điểm đặt, 2: Phương chiều, 3: Vẽ tỉ xích, 4: Hoàn thành
  const [chosenPointId, setChosenPointId] = useState<string | null>(null);
  const [chosenDirectionId, setChosenDirectionId] = useState<string | null>(null);
  
  // Interactive drawing states
  const [userSegments, setUserSegments] = useState<number>(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [pointSuccess, setPointSuccess] = useState<boolean>(false);
  const [directionSuccess, setDirectionSuccess] = useState<boolean>(false);

  // Sync magnitude details when scenario changes
  useEffect(() => {
    setSelectedMagnitude(selectedScenario.scaleOptions[1].magnitude);
    setSelectedScaleIndex(1);
    resetPractice();
  }, [selectedScenario]);

  const resetPractice = () => {
    setPracticeStep(1);
    setChosenPointId(null);
    setChosenDirectionId(null);
    setUserSegments(0);
    setHintMessage(null);
    setPointSuccess(false);
    setDirectionSuccess(false);
  };

  const handleSelectScenario = (sc: Scenario) => {
    setSelectedScenario(sc);
    setCurrentStep(2);
  };

  const handleNextToPractice = () => {
    resetPractice();
    setCurrentStep(3);
  };

  // Sub-step 1: Điểm đặt
  const handlePointSelect = (opt: { id: string; isCorrect: boolean; desc: string }) => {
    setChosenPointId(opt.id);
    setHintMessage(opt.desc);
    
    if (opt.isCorrect) {
      setPointSuccess(true);
      confetti({ particleCount: 15, spread: 20, colors: ['#22c55e'] });
      setTimeout(() => {
        setPracticeStep(2);
        setHintMessage(null);
      }, 2000);
    } else {
      setPointSuccess(false);
    }
  };

  // Sub-step 2: Phương chiều
  const handleDirectionSelect = (opt: { id: string; isCorrect: boolean }) => {
    setChosenDirectionId(opt.id);
    if (opt.isCorrect) {
      setDirectionSuccess(true);
      setHintMessage('Chính xác! Phương và chiều của lực đẩy/kéo/hút này đã được chọn đúng.');
      confetti({ particleCount: 15, spread: 20, colors: ['#06b6d4'] });
      setTimeout(() => {
        setPracticeStep(3);
        setHintMessage(null);
      }, 2000);
    } else {
      setDirectionSuccess(false);
      setHintMessage('Lựa chọn chưa chính xác! Hãy quan sát kỹ hướng chuyển động của vật.');
    }
  };

  // Sub-step 3: Vẽ theo tỉ xích
  const targetSegments = selectedScenario.scaleOptions[selectedScaleIndex].units;

  const handleAddSegment = () => {
    if (userSegments >= 4) return;
    const next = userSegments + 1;
    setUserSegments(next);
    if (next === targetSegments) {
      confetti({ particleCount: 60, spread: 50, colors: ['#f59e0b', '#10b981'] });
      setPracticeStep(4);
    }
  };

  const handleRemoveSegment = () => {
    if (userSegments <= 0) return;
    setUserSegments(prev => prev - 1);
  };

  // Vector render calculations for SVG
  const renderInteractiveForceVector = () => {
    const correctPt = selectedScenario.pointsOptions.find(p => p.isCorrect);
    if (!correctPt) return null;

    const startX = correctPt.cx;
    const startY = correctPt.cy;
    
    let dx = 0;
    let dy = 0;
    
    // Tùy theo phương chiều quy ước để vẽ vector
    // Mỗi segment tương ứng 45px
    const segLength = 45;
    const currentLength = userSegments * segLength;

    switch (selectedScenario.correctSense) {
      case 'left-to-right':
        dx = currentLength;
        break;
      case 'right-to-left':
        dx = -currentLength;
        break;
      case 'top-to-bottom':
        dy = currentLength;
        break;
      case 'bottom-to-top':
        dy = -currentLength;
        break;
    }

    const endX = startX + dx;
    const endY = startY + dy;

    // Vẽ từng tick đánh dấu cho tỉ xích
    const ticks = [];
    for (let i = 1; i <= userSegments; i++) {
      const tx = startX + (dx / userSegments) * i;
      const ty = startY + (dy / userSegments) * i;
      
      // Vẽ vạch vuông góc
      let px1 = tx;
      let py1 = ty;
      let px2 = tx;
      let py2 = ty;
      
      if (selectedScenario.correctDirection === 'horizontal') {
        py1 = ty - 6;
        py2 = ty + 6;
      } else {
        px1 = tx - 6;
        px2 = tx + 6;
      }
      
      ticks.push(
        <line key={i} x1={px1} y1={py1} x2={px2} y2={py2} stroke="#f59e0b" strokeWidth="2.5" />
      );
    }

    return (
      <g>
        {/* Điểm đặt */}
        <circle cx={startX} cy={startY} r="7" fill="#10b981" filter="drop-shadow(0 0 5px #10b981)" />
        <text x={startX} y={startY - 12} fontSize="10" fontWeight="bold" fill="#10b981" textAnchor="middle">Gốc (Điểm đặt)</text>

        {userSegments > 0 && (
          <>
            {/* Thân mũi tên */}
            <line 
              x1={startX} 
              y1={startY} 
              x2={endX} 
              y2={endY} 
              stroke="#f59e0b" 
              strokeWidth="4" 
              strokeDasharray="none"
              className="animate-in fade-in"
            />
            
            {/* Các vạch tỉ xích */}
            {ticks}

            {/* Đầu mũi tên */}
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
            
            {/* Đầu mũi tên biểu diễn bằng path thủ công để tránh lỗi marker trên một số trình duyệt */}
            {(() => {
              let arrowPath = '';
              const size = 8;
              if (selectedScenario.correctSense === 'left-to-right') {
                arrowPath = `M ${endX - size} ${endY - size/2} L ${endX} ${endY} L ${endX - size} ${endY + size/2} Z`;
              } else if (selectedScenario.correctSense === 'right-to-left') {
                arrowPath = `M ${endX + size} ${endY - size/2} L ${endX} ${endY} L ${endX + size} ${endY + size/2} Z`;
              } else if (selectedScenario.correctSense === 'top-to-bottom') {
                arrowPath = `M ${endX - size/2} ${endY - size} L ${endX} ${endY} L ${endX + size/2} ${endY - size} Z`;
              } else if (selectedScenario.correctSense === 'bottom-to-top') {
                arrowPath = `M ${endX - size/2} ${endY + size} L ${endX} ${endY} L ${endX + size/2} ${endY + size} Z`;
              }
              return <path d={arrowPath} fill="#f59e0b" />;
            })()}

            {/* Nhãn lực F */}
            <text 
              x={endX + (selectedScenario.correctDirection === 'horizontal' ? 12 : 15)} 
              y={endY + (selectedScenario.correctDirection === 'vertical' ? 5 : 5)} 
              fontSize="14" 
              fontWeight="black" 
              fill="#f59e0b"
            >
              F
            </text>
            {/* Dấu mũi tên vector trên chữ F */}
            <text
              x={endX + (selectedScenario.correctDirection === 'horizontal' ? 12 : 15)}
              y={endY + (selectedScenario.correctDirection === 'vertical' ? -5 : -5)}
              fontSize="8"
              fontWeight="black"
              fill="#f59e0b"
            >
              →
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div ref={containerRef} className={`w-full font-sans text-slate-100 flex flex-col overflow-hidden relative transition-all duration-300 ${
      isFullscreen 
        ? 'h-screen w-screen bg-slate-950 p-4 md:p-6 z-40' 
        : 'min-h-[calc(100vh-80px)] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl'
    }`}>
      {/* HEADER MÔ PHỎNG */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm md:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-500 animate-spin-slow" />
              Mô Phỏng Biểu Diễn Lực
            </h1>
            <p className="text-[9px] md:text-[10px] text-cyan-400 font-bold uppercase tracking-widest leading-none mt-1">
              KHTN 6 • Lực và Biểu diễn lực
            </p>
          </div>
        </div>

        {/* NÚT TOÀN MÀN HÌNH */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          <span className="hidden sm:inline">{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
        </button>
      </header>

      {/* TIẾN TRÌNH CÁC BƯỚC */}
      <div className="bg-slate-900/40 px-6 py-4 border-b border-slate-800/80 flex items-center justify-center gap-2 md:gap-4 select-none shrink-0">
        {[
          { step: 1, label: '1. Chọn Loại Lực' },
          { step: 2, label: '2. Cài Đặt Thông Số' },
          { step: 3, label: '3. Biểu Diễn & Vẽ Lực' }
        ].map((item) => (
          <React.Fragment key={item.step}>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === item.step 
                  ? 'bg-orange-500 text-white ring-4 ring-orange-500/20' 
                  : currentStep > item.step 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {currentStep > item.step ? '✓' : item.step}
              </span>
              <span className={`text-xs font-bold transition-colors ${
                currentStep === item.step ? 'text-white' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </div>
            {item.step < 3 && <div className="w-6 md:w-12 h-[2px] bg-slate-800"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* KHU VỰC THÂN CHÍNH */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ==================================================== */}
        {/* BƯỚC 1: CHỌN LOẠI LỰC */}
        {/* ==================================================== */}
        {currentStep === 1 && (
          <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start text-center space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Chọn tình huống thực hành lực</h2>
              <p className="text-slate-400 text-xs md:text-sm max-w-lg">
                Trong đời sống có rất nhiều loại lực tác dụng lên các vật khác nhau. Chọn một loại lực bên dưới để bắt đầu thực hành biểu diễn.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className="p-6 bg-slate-900/60 border border-slate-800 hover:border-orange-500/60 rounded-3xl cursor-pointer group transition-all text-left flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-orange-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                  
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-black text-white group-hover:text-orange-400 transition-colors leading-tight">
                        {sc.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                        {sc.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-orange-500 font-bold uppercase tracking-wider group-hover:text-orange-400">
                    <span>Chọn loại lực này</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* BƯỚC 2: CÀI ĐẶT THÔNG SỐ (ĐỘ LỚN LỰC) */}
        {/* ==================================================== */}
        {currentStep === 2 && (
          <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-full max-w-3xl flex items-center justify-between border-b border-slate-800 pb-4">
              <button 
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Quay lại
              </button>
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider">Cấu hình thông số lực</h2>
              <div className="w-16"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl items-start">
              
              {/* Cột trái: Thông tin & Lựa chọn độ lớn */}
              <div className="space-y-6 text-left">
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] text-orange-500 font-extrabold uppercase tracking-wider">Tình huống đang chọn</span>
                  <h3 className="text-base font-black text-white leading-tight">{selectedScenario.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{selectedScenario.description}</p>
                </div>

                {/* Chọn Độ lớn lực */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    Bước 2: Chọn độ lớn của lực (Newton - N)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedScenario.scaleOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedMagnitude(opt.magnitude);
                          setSelectedScaleIndex(idx);
                        }}
                        className={`py-3 px-4 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          selectedMagnitude === opt.magnitude 
                            ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md scale-102' 
                            : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-base">{opt.magnitude} N</span>
                        <span className="text-[9px] font-bold text-slate-400 tracking-normal lowercase opacity-80">{opt.scaleText}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phân tích Tỉ xích dự kiến */}
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-2">
                  <span className="text-[9px] font-bold uppercase text-orange-400 tracking-widest block">Tính toán tỉ xích quy ước</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Với lực đã chọn là <strong className="text-orange-500">{selectedMagnitude} N</strong> và tỉ xích <strong className="text-orange-500">{selectedScenario.scaleOptions[selectedScaleIndex].scaleText.split(':')[1]}</strong>:
                  </p>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-center text-xs font-bold text-white">
                    Độ dài mũi tên biểu diễn = {selectedScenario.scaleOptions[selectedScaleIndex].units} cm (tương đương với {selectedScenario.scaleOptions[selectedScaleIndex].units} vạch chia tỉ xích).
                  </div>
                </div>
              </div>

              {/* Cột phải: Xem trước vật */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest absolute top-4 left-4">Vật chịu lực tác dụng</span>
                
                {/* SVG Canvas Preview */}
                <svg width="220" height="240" viewBox="0 0 300 300" className="w-full max-w-[240px] bg-slate-950/40 border border-slate-900 rounded-2xl">
                  {selectedScenario.renderObject(null)}
                </svg>

                <button
                  onClick={handleNextToPractice}
                  className="w-full py-3.5 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  Bắt đầu biểu diễn lực
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* BƯỚC 3: THỰC HÀNH TƯƠNG TÁC BIỂU DIỄN VÀ VẼ LỰC */}
        {/* ==================================================== */}
        {currentStep === 3 && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Cột Trái: Canvas vẽ biểu diễn lực */}
            <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col items-center justify-start overflow-y-auto custom-scrollbar space-y-4">
              
              <div className="w-full flex items-center justify-between">
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Quay lại cài đặt
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-slate-800 border border-slate-700 text-cyan-400 uppercase tracking-wider">
                    {selectedScenario.forceType}
                  </span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-orange-500/10 border border-orange-500/30 text-orange-400">
                    Độ lớn: {selectedMagnitude} N
                  </span>
                </div>
              </div>

              {/* KHUNG VẼ TƯƠNG TÁC (SVG CANVAS) */}
              <div className="relative w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center shrink-0">
                <svg width="100%" height="100%" viewBox="0 0 300 300" className="w-full h-full select-none">
                  
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="300" height="300" fill="url(#grid)" />

                  {/* Render the core physical object */}
                  {selectedScenario.renderObject(chosenPointId)}

                  {/* CHỌN ĐIỂM ĐẶT (Hiện các chấm click khi đang ở thao tác 1) */}
                  {practiceStep === 1 && selectedScenario.pointsOptions.map((opt) => {
                    const isSelected = chosenPointId === opt.id;
                    return (
                      <g key={opt.id} className="cursor-pointer group" onClick={() => handlePointSelect(opt)}>
                        {/* Nhấp nháy vòng ngoài */}
                        <circle 
                          cx={opt.cx} 
                          cy={opt.cy} 
                          r="14" 
                          fill="transparent" 
                          stroke={isSelected ? (opt.isCorrect ? '#10b981' : '#ef4444') : '#f59e0b'}
                          strokeWidth="2" 
                          strokeDasharray="4,2"
                          className="animate-spin-slow opacity-80 group-hover:opacity-100" 
                        />
                        <circle 
                          cx={opt.cx} 
                          cy={opt.cy} 
                          r="7" 
                          fill={isSelected ? (opt.isCorrect ? '#10b981' : '#ef4444') : '#f59e0b'} 
                          className="transition-transform group-hover:scale-125" 
                        />
                        {/* Tên điểm */}
                        <text x={opt.cx} y={opt.cy - 16} fontSize="10" fontWeight="black" fill="#fff" textAnchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))">
                          {opt.label.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* HIỂN THỊ VECTOR LỰC ĐÃ VẼ */}
                  {practiceStep > 1 && renderInteractiveForceVector()}

                </svg>

                {/* Thước tỉ xích mẫu ở góc màn hình vẽ */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex flex-col text-left gap-1 pointer-events-none shadow-md">
                  <span className="text-[8px] uppercase tracking-widest font-bold text-slate-500 leading-none">Quy ước tỉ xích</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white mt-1">
                    <div className="w-[45px] h-[3px] bg-orange-500 relative rounded-full">
                      <div className="absolute top-[-3px] left-0 w-px h-[9px] bg-orange-500"></div>
                      <div className="absolute top-[-3px] right-0 w-px h-[9px] bg-orange-500"></div>
                    </div>
                    <span>= 1 cm ({selectedScenario.scaleOptions[selectedScaleIndex].scaleText.split('với')[1].trim()})</span>
                  </div>
                </div>
              </div>

              {/* Hint và Tin nhắn hướng dẫn */}
              {hintMessage && (
                <div className={`w-full max-w-[400px] p-3.5 rounded-2xl border text-xs font-bold leading-relaxed flex items-start gap-2.5 text-left animate-in zoom-in-95 duration-200 ${
                  pointSuccess || directionSuccess
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {pointSuccess || directionSuccess ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  )}
                  <span>{hintMessage}</span>
                </div>
              )}

            </div>

            {/* Cột Phải: Các bước thao tác thủ công */}
            <div className="w-full lg:w-[380px] p-6 overflow-y-auto custom-scrollbar flex flex-col shrink-0 text-left bg-slate-900/40">
              
              <div className="space-y-5 flex-1">
                
                {/* TIÊU ĐỀ HƯỚNG DẪN */}
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Compass className="w-4 h-4 text-orange-500" />
                    Thao tác biểu diễn lực
                  </h3>
                  <button
                    onClick={resetPractice}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Làm lại từ đầu"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* THAO TÁC 1: XÁC ĐỊNH ĐIỂM ĐẶT */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  practiceStep === 1 
                    ? 'bg-slate-900 border-orange-500/60 shadow-lg' 
                    : practiceStep > 1 
                      ? 'bg-slate-900/30 border-slate-800/80 opacity-70' 
                      : 'bg-slate-950/20 border-slate-900/40 opacity-40'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thao tác 1</span>
                    {practiceStep > 1 && <span className="text-xs text-emerald-400 font-bold">Hoàn thành ✓</span>}
                  </div>
                  <h4 className="text-xs font-black text-white leading-tight">Xác định điểm đặt của lực</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                    Hãy nhấp chọn điểm tròn màu cam trên vật ở khung vẽ để chọn **Điểm đặt (gốc)** của lực.
                  </p>
                  
                  {practiceStep === 1 && (
                    <div className="mt-3.5 space-y-2">
                      {selectedScenario.pointsOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handlePointSelect(opt)}
                          className={`w-full py-2 px-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            chosenPointId === opt.id 
                              ? opt.isCorrect 
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                : 'bg-red-500/10 border-red-500 text-red-400'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {chosenPointId === opt.id && (opt.isCorrect ? <Check className="w-3.5 h-3.5" /> : <span>✗</span>)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* THAO TÁC 2: PHƯƠNG VÀ CHIỀU */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  practiceStep === 2 
                    ? 'bg-slate-900 border-orange-500/60 shadow-lg' 
                    : practiceStep > 2 
                      ? 'bg-slate-900/30 border-slate-800/80 opacity-70' 
                      : 'bg-slate-950/20 border-slate-900/40 opacity-40'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thao tác 2</span>
                    {practiceStep > 2 && <span className="text-xs text-emerald-400 font-bold">Hoàn thành ✓</span>}
                  </div>
                  <h4 className="text-xs font-black text-white leading-tight">Xác định phương và chiều của lực</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                    Hãy lựa chọn phương và chiều thích hợp của lực dựa trên hướng kéo, đẩy hoặc rơi của vật.
                  </p>

                  {practiceStep === 2 && (
                    <div className="mt-3.5 grid grid-cols-1 gap-2">
                      {selectedScenario.directionOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleDirectionSelect(opt)}
                          className={`w-full py-2 px-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            chosenDirectionId === opt.id 
                              ? opt.isCorrect 
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                : 'bg-red-500/10 border-red-500 text-red-400'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-[10px]">
                              {opt.arrow}
                            </span>
                            {opt.label}
                          </span>
                          {chosenDirectionId === opt.id && (opt.isCorrect ? <Check className="w-3.5 h-3.5" /> : <span>✗</span>)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* THAO TÁC 3: VẼ ĐỘ LỚN THEO TỈ XÍCH */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  practiceStep === 3 
                    ? 'bg-slate-900 border-orange-500/60 shadow-lg' 
                    : practiceStep > 3 
                      ? 'bg-slate-900/30 border-slate-800/80 opacity-70' 
                      : 'bg-slate-950/20 border-slate-900/40 opacity-40'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thao tác 3</span>
                    {practiceStep > 3 && <span className="text-xs text-emerald-400 font-bold">Hoàn thành ✓</span>}
                  </div>
                  <h4 className="text-xs font-black text-white leading-tight">Vẽ chiều dài mũi tên theo tỉ xích</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                    Lực có độ lớn **{selectedMagnitude} N**. Với tỉ xích quy ước, bạn cần tăng chiều dài mũi tên lên thành **{targetSegments} cm** (tương đương với {targetSegments} đoạn thẳng tỉ xích).
                  </p>

                  {practiceStep === 3 && (
                    <div className="mt-4 space-y-4">
                      {/* Thao tác tăng/giảm */}
                      <div className="flex items-center justify-between bg-slate-950 p-3 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400">Độ dài mũi tên:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleRemoveSegment}
                            disabled={userSegments <= 0}
                            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white flex items-center justify-center font-black disabled:opacity-40 select-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-sm font-black text-orange-400 w-12 text-center">{userSegments} cm</span>
                          <button
                            type="button"
                            onClick={handleAddSegment}
                            disabled={userSegments >= 4}
                            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white flex items-center justify-center font-black disabled:opacity-40 select-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Phân tích trực tiếp số Newton đạt được */}
                      <div className="text-[10px] font-bold text-center text-slate-500 bg-slate-950/40 p-2 rounded-lg leading-tight border border-slate-900/60">
                        {userSegments} cm tương đương với: <strong className="text-orange-400">{userSegments * (selectedMagnitude / targetSegments)} N</strong> (Mục tiêu: {selectedMagnitude} N)
                      </div>
                    </div>
                  )}
                </div>

                {/* THAO TÁC 4: BÁO CÁO KẾT QUẢ VẬT LÝ */}
                {practiceStep === 4 && (
                  <div className="p-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300 animate-in zoom-in-95 duration-300 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-wider">Đã biểu diễn thành công!</h4>
                    </div>
                    
                    <p className="text-[10px] leading-relaxed text-slate-300 font-medium">
                      Bạn đã hoàn thành chính xác hình vẽ biểu diễn cho **{selectedScenario.forceType}** trong thực tế.
                    </p>

                    <div className="bg-slate-950/80 p-3.5 border border-slate-900 rounded-xl text-left space-y-1.5 font-medium text-[10px] text-slate-300 leading-normal">
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">Tên lực:</span>
                        <span className="font-bold text-white">{selectedScenario.forceType}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">Ký hiệu lực:</span>
                        <span className="font-bold text-orange-400">F →</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">Điểm đặt:</span>
                        <span className="font-bold text-emerald-400">{selectedScenario.pointsOptions.find(p => p.isCorrect)?.label.split('(')[0].trim()}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">Phương lực:</span>
                        <span className="font-bold text-white">
                          {selectedScenario.correctDirection === 'horizontal' ? 'Nằm ngang' : 'Thẳng đứng'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">Chiều lực:</span>
                        <span className="font-bold text-white">
                          {selectedScenario.correctSense === 'left-to-right' ? 'Từ trái sang phải' : 
                           selectedScenario.correctSense === 'right-to-left' ? 'Từ phải sang trái' :
                           selectedScenario.correctSense === 'top-to-bottom' ? 'Từ trên xuống dưới' : 'Từ dưới lên trên'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">Độ lớn:</span>
                        <span className="font-bold text-white">{selectedMagnitude} N</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Độ dài vẽ:</span>
                        <span className="font-bold text-orange-400">{targetSegments} cm</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        resetPractice();
                      }}
                      className="w-full py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:scale-102 transition-all text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-md"
                    >
                      Thực hành lực khác
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
