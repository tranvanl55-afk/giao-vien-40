import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

type MuscleState = 'relaxed' | 'contracted';

const MUSCLE_INFO = {
  bicep: {
    name: 'Cơ Nhị Đầu',
    engName: 'Biceps brachii',
    action: 'Gấp cẳng tay (kéo lên)',
    antagonist: 'Cơ tam đầu',
    fact: 'Cơ nhị đầu có 2 đầu bám vào xương bả vai. Khi co lại, nó rút ngắn và kéo xương cẳng tay lên trên.',
    color: '#ef4444',
  },
  tricep: {
    name: 'Cơ Tam Đầu',
    engName: 'Triceps brachii',
    action: 'Duỗi cẳng tay (kéo xuống)',
    antagonist: 'Cơ nhị đầu',
    fact: 'Cơ tam đầu có 3 đầu và là cơ đối kháng của cơ nhị đầu. Khi một cơ co thì cơ kia phải duỗi ra.',
    color: '#60a5fa',
  },
};

function ArmCanvas({ bicepState, tricepState, elbowAngle }: { bicepState: MuscleState; tricepState: MuscleState; elbowAngle: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    const shoulderX = W / 2 - 20;
    const shoulderY = H * 0.18;
    const upperArmLen = 100;
    const lowerArmLen = 100;
    const angleRad = (elbowAngle * Math.PI) / 180;

    // Upper arm (vertical down)
    const elbowX = shoulderX;
    const elbowY = shoulderY + upperArmLen;

    // Lower arm (angle from elbow)
    const handX = elbowX + Math.cos(Math.PI / 2 - angleRad) * lowerArmLen;
    const handY = elbowY + Math.sin(Math.PI / 2 - angleRad) * lowerArmLen;

    // Draw shoulder socket
    ctx.beginPath();
    ctx.arc(shoulderX, shoulderY, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#f1f5f9';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Upper arm bone
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(elbowX, elbowY);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Bicep muscle (on front of upper arm)
    const bicepContracted = bicepState === 'contracted';
    const bicepBulge = bicepContracted ? 22 : 12;
    ctx.beginPath();
    ctx.ellipse(shoulderX - 30, (shoulderY + elbowY) / 2, bicepBulge, upperArmLen * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = bicepContracted ? '#ef4444' : '#fca5a5';
    ctx.fill();
    ctx.strokeStyle = bicepContracted ? '#fef2f2' : '#fee2e2';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = `bold ${bicepContracted ? 11 : 10}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(bicepContracted ? '💪 CO' : 'DUỖI', shoulderX - 50, (shoulderY + elbowY) / 2);
    ctx.fillText('Nhị đầu', shoulderX - 50, (shoulderY + elbowY) / 2 + 14);

    // Tricep muscle (on back of upper arm)
    const tricepContracted = tricepState === 'contracted';
    const tricepBulge = tricepContracted ? 20 : 11;
    ctx.beginPath();
    ctx.ellipse(shoulderX + 30, (shoulderY + elbowY) / 2 + 10, tricepBulge, upperArmLen * 0.38, 0, 0, Math.PI * 2);
    ctx.fillStyle = tricepContracted ? '#3b82f6' : '#93c5fd';
    ctx.fill();
    ctx.strokeStyle = tricepContracted ? '#eff6ff' : '#dbeafe';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = `bold ${tricepContracted ? 11 : 10}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(tricepContracted ? '💪 CO' : 'DUỖI', shoulderX + 55, (shoulderY + elbowY) / 2 + 10);
    ctx.fillText('Tam đầu', shoulderX + 55, (shoulderY + elbowY) / 2 + 24);

    // Elbow joint
    ctx.beginPath();
    ctx.arc(elbowX, elbowY, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#f1f5f9';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lower arm bone
    ctx.beginPath();
    ctx.moveTo(elbowX, elbowY);
    ctx.lineTo(handX, handY);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Hand
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✊', handX, handY + 15);
    ctx.textBaseline = 'alphabetic';

    // Angle arc
    ctx.beginPath();
    ctx.arc(elbowX, elbowY, 35, Math.PI / 2, Math.PI / 2 - angleRad, true);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(elbowAngle)}°`, elbowX + 50, elbowY - 10);

    // Tendon lines
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#fbbf2480';
    ctx.lineWidth = 1.5;
    // Bicep tendon to lower arm
    ctx.beginPath();
    ctx.moveTo(shoulderX - 20, elbowY - 5);
    ctx.lineTo(elbowX + 10, elbowY + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Xương cánh tay (Humerus)', shoulderX + 20, (shoulderY + elbowY) / 2);
    ctx.fillText('Xương cẳng tay (Radius/Ulna)', elbowX + 5, (elbowY + handY) / 2);
  }, [bicepState, tricepState, elbowAngle]);

  return <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={380} height={400} className="rounded-3xl border border-slate-800 shadow-2xl max-w-full" />;
}

export function CoXuongKhopSimulation({ onBack }: { onBack: () => void }) {
  const [bicepState, setBicepState] = useState<MuscleState>('relaxed');
  const [elbowAngle, setElbowAngle] = useState(160);
  const [selectedMuscle, setSelectedMuscle] = useState<'bicep' | 'tricep' | null>(null);

  const tricepState: MuscleState = bicepState === 'contracted' ? 'relaxed' : 'contracted';

  const contract = () => {
    setBicepState('contracted');
    setElbowAngle(40);
  };
  const relax = () => {
    setBicepState('relaxed');
    setElbowAngle(160);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">💪 Hệ Cơ-Xương-Khớp</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 8</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <ArmCanvas bicepState={bicepState} tricepState={tricepState} elbowAngle={elbowAngle} />

          {/* Control buttons */}
          <div className="flex gap-4">
            <button onClick={contract}
              className={`px-8 py-4 rounded-2xl font-black text-base cursor-pointer transition-all shadow-xl flex flex-col items-center gap-1 ${bicepState === 'contracted' ? 'bg-red-600 text-white shadow-red-900/30 scale-105' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}>
              <span className="text-2xl">💪</span>
              <span>Gấp cẳng tay</span>
              <span className="text-[10px] font-normal opacity-70">Nhị đầu co lại</span>
            </button>
            <button onClick={relax}
              className={`px-8 py-4 rounded-2xl font-black text-base cursor-pointer transition-all shadow-xl flex flex-col items-center gap-1 ${bicepState === 'relaxed' ? 'bg-blue-600 text-white shadow-blue-900/30 scale-105' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}>
              <span className="text-2xl">🦾</span>
              <span>Duỗi cẳng tay</span>
              <span className="text-[10px] font-normal opacity-70">Tam đầu co lại</span>
            </button>
          </div>

          {/* Manual angle control */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-400 font-bold">Góc khuỷu tay</span>
              <span className="text-xs font-black text-yellow-400">{Math.round(elbowAngle)}°</span>
            </div>
            <input type="range" min={20} max={170} value={elbowAngle}
              onChange={e => { setElbowAngle(Number(e.target.value)); setBicepState(Number(e.target.value) < 100 ? 'contracted' : 'relaxed'); }}
              className="w-full cursor-pointer" />
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-80 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Cơ & Xương Cánh Tay</h3>

          {(['bicep', 'tricep'] as const).map(m => {
            const info = MUSCLE_INFO[m];
            const isActive = (m === 'bicep' && bicepState === 'contracted') || (m === 'tricep' && bicepState === 'relaxed');
            return (
              <div key={m} onClick={() => setSelectedMuscle(selectedMuscle === m ? null : m)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${isActive ? 'border-opacity-80 shadow-lg' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'}`}
                style={isActive ? { borderColor: info.color + '80', backgroundColor: info.color + '15' } : {}}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
                  <span className="font-bold text-sm text-white">{info.name}</span>
                  <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    {isActive ? 'CO' : 'DUỖI'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 italic mb-1">{info.engName}</p>
                <p className="text-[11px] text-slate-300">🎯 {info.action}</p>
                <p className="text-[11px] text-slate-400">⚡ Đối kháng: {info.antagonist}</p>

                {selectedMuscle === m && (
                  <p className="text-[11px] text-indigo-200 mt-2 leading-relaxed border-t border-slate-700 pt-2">{info.fact}</p>
                )}
              </div>
            );
          })}

          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-2">⚡ Nguyên lý đối kháng</h3>
            <p className="text-[11px] text-amber-200 leading-relaxed">
              Cơ hoạt động theo cặp đối kháng: khi một cơ <strong>co lại (agonist)</strong>, cơ kia phải <strong>duỗi ra (antagonist)</strong>. Điều này đảm bảo chuyển động chính xác và có kiểm soát.
            </p>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase text-indigo-400 mb-2">🦴 Cấu trúc khớp khuỷu</h3>
            <div className="space-y-1 text-[11px] text-slate-300">
              <p>• Đây là khớp <strong>động</strong> (bản lề)</p>
              <p>• Cho phép gấp/duỗi 0° - 160°</p>
              <p>• Có sụn khớp và dịch khớp bôi trơn</p>
              <p>• Dây chằng giữ cố định xương</p>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-3">
            <div className="flex items-start gap-2"><Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400">Click vào tên cơ để xem giải thích chi tiết. Nhấn nút bên trái để xem chuyển động!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
