import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X as XIcon, Briefcase, ChevronRight, User, Settings, PenTool, FlaskConical, Users, Lightbulb, Map } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

interface Props {
  onBack: () => void;
}

// ----------------------------------------------------------------------
// DATA: QUESTIONS & RIASEC MODEL
// ----------------------------------------------------------------------

type RiasecType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

const RIASEC_LABELS: Record<RiasecType, string> = {
  'R': 'Thực tế (Kỹ thuật)',
  'I': 'Nghiên cứu (Khoa học)',
  'A': 'Nghệ thuật (Sáng tạo)',
  'S': 'Xã hội (Giúp đỡ)',
  'E': 'Khởi nghiệp (Quản lý)',
  'C': 'Nghiệp vụ (Tổ chức)'
};

const QUESTIONS = [
  { id: 1, text: "Bạn thích sửa chữa máy móc, đồ điện tử trong nhà?", type: 'R' },
  { id: 2, text: "Bạn thích tìm hiểu về các hiện tượng khoa học, vũ trụ?", type: 'I' },
  { id: 3, text: "Bạn thích vẽ, thiết kế, sáng tác nhạc hoặc viết lách?", type: 'A' },
  { id: 4, text: "Bạn thích lắng nghe và tư vấn giải quyết vấn đề cho bạn bè?", type: 'S' },
  { id: 5, text: "Bạn thích lãnh đạo nhóm, thuyết phục người khác theo ý mình?", type: 'E' },
  { id: 6, text: "Bạn thích sắp xếp hồ sơ, làm việc với các con số, bảng tính?", type: 'C' },
  { id: 7, text: "Bạn thích các hoạt động ngoài trời, thể thao, vận động?", type: 'R' },
  { id: 8, text: "Bạn thích làm các thí nghiệm hóa học, sinh học?", type: 'I' },
  { id: 9, text: "Bạn thích tham gia các câu lạc bộ kịch, nhiếp ảnh?", type: 'A' },
  { id: 10, text: "Bạn thích tham gia các hoạt động tình nguyện, thiện nguyện?", type: 'S' },
  { id: 11, text: "Bạn thích kinh doanh, buôn bán hoặc tổ chức sự kiện?", type: 'E' },
  { id: 12, text: "Bạn thích làm việc theo kế hoạch chi tiết, có quy tắc rõ ràng?", type: 'C' },
] as const;

// ----------------------------------------------------------------------
// DATA: VIRTUAL OFFICE
// ----------------------------------------------------------------------

const OFFICE_ITEMS = [
  { 
    id: 'computer', 
    icon: Settings, 
    label: 'Khu Kỹ Thuật (R)', 
    x: '20%', y: '40%', 
    details: { name: 'Kỹ sư, Lập trình viên', salary: '15 - 40 triệu', skills: 'Tư duy logic, giải quyết vấn đề, thao tác máy móc.' }
  },
  { 
    id: 'lab', 
    icon: FlaskConical, 
    label: 'Góc Nghiên Cứu (I)', 
    x: '75%', y: '35%', 
    details: { name: 'Nhà khoa học, Bác sĩ', salary: '20 - 50 triệu', skills: 'Phân tích dữ liệu, quan sát, tư duy phản biện.' }
  },
  { 
    id: 'easel', 
    icon: PenTool, 
    label: 'Xưởng Sáng Tạo (A)', 
    x: '15%', y: '70%', 
    details: { name: 'Designer, Nhạc sĩ', salary: '12 - 35 triệu', skills: 'Sáng tạo, thẩm mỹ, biểu đạt cảm xúc.' }
  },
  { 
    id: 'meeting', 
    icon: Users, 
    label: 'Bàn Tròn Xã Hội (S)', 
    x: '50%', y: '60%', 
    details: { name: 'Giáo viên, Tâm lý học', salary: '10 - 25 triệu', skills: 'Lắng nghe, thấu cảm, truyền đạt.' }
  },
  { 
    id: 'podium', 
    icon: Lightbulb, 
    label: 'Bục Lãnh Đạo (E)', 
    x: '80%', y: '65%', 
    details: { name: 'Giám đốc, Khởi nghiệp', salary: 'Không giới hạn', skills: 'Đàm phán, quản trị rủi ro, lãnh đạo.' }
  },
  { 
    id: 'cabinet', 
    icon: Briefcase, 
    label: 'Tủ Hồ Sơ (C)', 
    x: '50%', y: '25%', 
    details: { name: 'Kế toán, Hành chính', salary: '10 - 25 triệu', skills: 'Tỉ mỉ, cẩn thận, quản lý thời gian.' }
  },
];

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export function DinhHuongNgheNghiepSimulation({ onBack }: Props) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<RiasecType, number>>({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });

  // Swipe logic
  const handleSwipe = (direction: 'left' | 'right') => {
    const q = QUESTIONS[currentQuestionIndex];
    if (direction === 'right') {
      // Like
      setScores(prev => ({ ...prev, [q.type]: prev[q.type] + 1 }));
    }
    
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setPhase(2); // Go to radar chart
    }
  };

  const chartData = Object.keys(scores).map(key => ({
    subject: RIASEC_LABELS[key as RiasecType],
    A: scores[key as RiasecType] * 10, // scale up for better visualization
    fullMark: 20,
  }));

  const [selectedOfficeItem, setSelectedOfficeItem] = useState<typeof OFFICE_ITEMS[0] | null>(null);

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-900/20 to-purple-900/20 -z-10" />

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">Định Hướng Nghề Nghiệp</h1>
              <p className="text-xs text-slate-400">Trắc nghiệm Holland (RIASEC)</p>
            </div>
          </div>
        </div>
        
        {/* Phase Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {[1, 2, 3].map(p => (
            <div key={p} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${phase >= p ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-500'}`}>
                {p}
              </div>
              {p < 3 && <div className={`w-8 h-1 rounded-full ${phase > p ? 'bg-indigo-500/50' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center p-6">
        
        {/* PHASE 1: SWIPE CARDS */}
        {phase === 1 && (
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-indigo-400">Khám Phá Sở Thích</h2>
              <p className="text-slate-400 mt-2">Vuốt phải (Thích) hoặc Vuốt trái (Không thích)</p>
              <div className="mt-4 text-sm font-medium text-slate-500">
                Câu {currentQuestionIndex + 1} / {QUESTIONS.length}
              </div>
            </div>

            <div className="relative w-full aspect-3/4 max-h-[400px]">
              <AnimatePresence>
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 1.05, opacity: 0, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    if (swipe < -100) {
                      handleSwipe('left');
                    } else if (swipe > 100) {
                      handleSwipe('right');
                    }
                  }}
                  className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl flex items-center justify-center p-8 cursor-grab active:cursor-grabbing"
                  style={{ touchAction: 'none' }}
                >
                  <div className="text-center">
                    <User className="w-16 h-16 mx-auto mb-6 text-indigo-400/50" />
                    <h3 className="text-2xl font-bold text-white leading-relaxed">
                      {QUESTIONS[currentQuestionIndex].text}
                    </h3>
                  </div>

                  {/* Visual Cues for Drag */}
                  <div className="absolute top-4 left-6 text-rose-500 font-bold opacity-0 transition-opacity" style={{ opacity: 0 /* Add dynamic opacity based on drag if wanted */ }}>
                    NOPE
                  </div>
                  <div className="absolute top-4 right-6 text-emerald-500 font-bold opacity-0 transition-opacity">
                    LIKE
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-6 mt-10">
              <button 
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 rounded-full bg-slate-800 border-2 border-rose-500/50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:shadow-rose-500/25"
              >
                <XIcon className="w-8 h-8" />
              </button>
              <button 
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-500/50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/25"
              >
                <Check className="w-8 h-8" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: RADAR CHART */}
        {phase === 2 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl flex flex-col items-center bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-cyan-400 mb-2">Hồ Sơ Năng Lực Của Bạn</h2>
            <p className="text-slate-400 mb-8 text-center max-w-lg">Dựa trên các câu trả lời, đây là biểu đồ phân tích thiên hướng nghề nghiệp theo mô hình Holland.</p>
            
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                  <Radar name="Thiên hướng" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <button 
              onClick={() => setPhase(3)}
              className="mt-8 px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              Khám Phá Văn Phòng Ảo <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* PHASE 3: VIRTUAL OFFICE */}
        {phase === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex items-center justify-center"
          >
            {/* The Room */}
            <div className="relative w-full max-w-5xl h-[600px] bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
              {/* Floor/Wall styling */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0f172a_60%,#1e293b_60%)]" />
              <div className="absolute top-0 left-0 w-full h-[60%] border-b-4 border-slate-800 opacity-50" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-sm px-6 py-2 rounded-full border border-slate-700 z-10 text-center">
                <p className="text-sm font-medium text-slate-300">Nhấn vào các vật dụng để khám phá các nhóm ngành nghề</p>
              </div>

              {/* Items */}
              {OFFICE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    className="absolute group"
                    style={{ left: item.x, top: item.y }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOfficeItem(item)}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-700 to-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-xl group-hover:border-indigo-400 group-hover:shadow-indigo-500/30 transition-all">
                        <Icon className="w-8 h-8 text-slate-300 group-hover:text-indigo-300" />
                      </div>
                      <div className="mt-3 px-3 py-1 bg-slate-800/90 rounded-md text-xs font-bold border border-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full whitespace-nowrap">
                        {item.label}
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              {/* Details Modal */}
              <AnimatePresence>
                {selectedOfficeItem && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-800 border border-slate-600 rounded-2xl p-6 shadow-2xl z-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                          <selectedOfficeItem.icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{selectedOfficeItem.label}</h3>
                          <p className="text-indigo-400 text-sm font-medium">{selectedOfficeItem.details.name}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedOfficeItem(null)} className="text-slate-400 hover:text-white p-1">
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-3 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Mức Lương Ước Tính</p>
                        <p className="text-emerald-400 font-bold">{selectedOfficeItem.details.salary}</p>
                      </div>
                      <div className="h-px bg-slate-700" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Kỹ năng cốt lõi</p>
                        <p className="text-slate-300 text-sm">{selectedOfficeItem.details.skills}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
