import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Info, HelpCircle, RefreshCw,
  ChevronRight, Maximize2, Minimize2, Sparkles, Check, X, Award,
  Activity, CheckCircle2, FlaskConical, AlertCircle, Scale, ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ----------------------------------------------------
// DỮ LIỆU PHÂN LOẠI HÌNH DẠNG VI KHUẨN
// ----------------------------------------------------
interface BacteriaShape {
  id: string;
  name: string;
  scientificName: string;
  color: string;
  desc: string;
  characteristics: string;
  examples: string[];
  role: string;
}

const BACTERIA_SHAPES: BacteriaShape[] = [
  {
    id: "coccus",
    name: "Cầu khuẩn",
    scientificName: "Coccus (Số nhiều: Cocci)",
    color: "#fb7185", // rose-400
    desc: "Các tế bào vi khuẩn có dạng hình cầu hoặc hình trứng bầu dục gần tròn.",
    characteristics: "Chúng có thể đứng riêng rẽ hoặc liên kết thành từng cặp (song cầu khuẩn - diplococci), chuỗi dài (liên cầu khuẩn - streptococci), hay tụ lại thành chùm giống như chùm nho (tụ cầu khuẩn - staphylococci).",
    examples: [
      "Staphylococcus aureus (Tụ cầu vàng - gây nhiễm trùng da, ngộ độc thức ăn)",
      "Streptococcus pneumoniae (Phế cầu khuẩn - gây bệnh viêm phổi)",
      "Streptococcus pyogenes (gây bệnh viêm họng)"
    ],
    role: "Hầu hết các cầu khuẩn gây bệnh là tác nhân gây nhiễm trùng da, hô hấp và ngộ độc thực phẩm nguy hiểm ở người."
  },
  {
    id: "bacillus",
    name: "Trực khuẩn",
    scientificName: "Bacillus (Số nhiều: Bacilli)",
    color: "#38bdf8", // sky-400
    desc: "Các tế bào vi khuẩn có dạng hình que thẳng, hai đầu có thể tròn hoặc vuông dẹt.",
    characteristics: "Thường đứng đơn lẻ hoặc liên kết thành các chuỗi (liên trực khuẩn - streptobacilli). Một số trực khuẩn có khả năng sinh nha bào (bào tử) chịu nhiệt độ và điều kiện cực kỳ khắc nghiệt.",
    examples: [
      "Lactobacillus acidophilus (Lợi khuẩn lên men sữa chua, bảo vệ đường ruột)",
      "Escherichia coli (E. coli - sinh sống trong ruột, một số chủng gây tiêu chảy)",
      "Bacillus anthracis (Trực khuẩn than - gây bệnh than nguy hiểm)"
    ],
    role: "Bao gồm cả lợi khuẩn (trong thực phẩm lên men) và hại khuẩn gây bệnh đường ruột hoặc ngộ độc sinh học."
  },
  {
    id: "vibrio",
    name: "Phẩy khuẩn",
    scientificName: "Vibrio (Số nhiều: Vibrios)",
    color: "#4ade80", // green-400
    desc: "Các tế bào vi khuẩn có dạng hình cong uốn lượn nhẹ, trông giống dấu phẩy.",
    characteristics: "Chúng di chuyển rất nhanh và linh hoạt nhờ có một sợi roi (flagellum) dài gắn ở một đầu tế bào.",
    examples: [
      "Vibrio cholerae (Phẩy khuẩn tả - tác nhân gây ra bệnh dịch tả tiêu chảy cấp dữ dội)",
      "Vibrio parahaemolyticus (gây ngộ độc hải sản sống)"
    ],
    role: "Hầu hết sống trong môi trường nước mặn hoặc lợ; gây bệnh tiêu chảy cấp truyền nhiễm nguy cấp qua đường nước uống và thức ăn."
  },
  {
    id: "spirillum",
    name: "Xoắn khuẩn",
    scientificName: "Spirillum & Spirochete",
    color: "#a78bfa", // violet-400
    desc: "Các tế bào vi khuẩn có hình dáng uốn lượn lượn sóng hoặc xoắn lò xo dài mảnh.",
    characteristics: "Xoắn khuẩn chuyển động kiểu khoan lốc xoáy bằng các sợi cơ đặc biệt ẩn dưới vách tế bào. Cơ thể chúng rất dẻo dai.",
    examples: [
      "Treponema pallidum (Xoắn khuẩn gây bệnh giang mai lây qua đường tình dục)",
      "Helicobacter pylori (Vi khuẩn H. pylori - sinh sống trong dạ dày gây viêm loét và ung thư dạ dày)",
      "Leptospira (gây bệnh sốt vàng da truyền từ nước tiểu động vật)"
    ],
    role: "Tác nhân gây ra nhiều bệnh lý mãn tính, nhiễm khuẩn huyết và bệnh nội tạng nguy hại ở người."
  },
  {
    id: "coccobacillus",
    name: "Cầu trực khuẩn",
    scientificName: "Coccobacillus",
    color: "#facc15", // yellow-400
    desc: "Hình dáng trung gian kết hợp giữa hình cầu (coccus) và hình que (bacillus).",
    characteristics: "Chúng có hình bầu dục ngắn và rất dễ bị nhầm lẫn với cầu khuẩn lớn khi soi dưới kính hiển vi quang học thông thường.",
    examples: [
      "Haemophilus influenzae (gây viêm màng não và viêm phổi ở trẻ em)",
      "Bordetella pertussis (Trực khuẩn ho gà - gây bệnh ho gà cấp tính)"
    ],
    role: "Gây ra các bệnh lý nhiễm trùng đường hô hấp trên và màng não nghiêm trọng ở trẻ em và người già."
  }
];

// ----------------------------------------------------
// BẢNG SO SÁNH & CÂU HỎI TRẮC NGHIỆM
// ----------------------------------------------------
const COMPARISONS = [
  { criteria: "Kích thước", virus: "Cực nhỏ (20 - 400 nm), chỉ soi bằng kính hiển vi điện tử", bacteria: "Nhỏ (1 - 5 µm), soi thấy bằng kính hiển vi quang học thường", eukaryote: "Lớn (10 - 100 µm), quan sát dễ dàng dưới kính hiển vi" },
  { criteria: "Cấu tạo tế bào", virus: "Chưa có cấu tạo tế bào (chỉ gồm vỏ protein và lõi DNA/RNA)", bacteria: "Tế bào nhân sơ đơn giản, chưa có màng nhân, không bào quan có màng", eukaryote: "Tế bào nhân thực phức tạp, nhân có màng bao bọc, nhiều bào quan" },
  { criteria: "Sự nhân đôi", virus: "Ký sinh bắt buộc, chỉ nhân lên trong tế bào chủ", bacteria: "Tự nhân đôi phân đôi độc lập ngoài môi trường", eukaryote: "Phân chia nguyên phân/giảm phân phức tạp" },
  { criteria: "Điều trị thuốc", virus: "Kháng sinh hoàn toàn KHÔNG có tác dụng", bacteria: "Tiêu diệt được bằng các loại thuốc kháng sinh phù hợp", eukaryote: "Sử dụng thuốc kháng nấm/kháng ký sinh trùng đặc hiệu" }
];

interface Question {
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    question: "Vi khuẩn đường ruột Escherichia coli (E. coli) có hình dạng tế bào đặc trưng nào?",
    options: ["Hình cầu (Cầu khuẩn)", "Hình que thẳng (Trực khuẩn)", "Hình cong dấu phẩy (Phẩy khuẩn)", "Hình xoắn lò xo (Xoắn khuẩn)"],
    answer: 1,
    explain: "E. coli thuộc nhóm trực khuẩn (Bacillus), có cấu tạo tế bào hình que dài, thường sống cộng sinh lành tính trong đường ruột người nhưng có một số chủng gây tiêu chảy cấp."
  },
  {
    question: "Phẩy khuẩn tả Vibrio cholerae di chuyển cực kỳ nhanh trong môi trường nước là nhờ bộ phận nào?",
    options: ["Các sợi lông nhung bám dày đặc", "Lớp vỏ chất nhầy dính bao quanh", "Sợi roi dài mọc ở một đầu tế bào", "Bằng cách uốn lượn uốn khúc toàn thân"],
    answer: 2,
    explain: "Phẩy khuẩn tả di chuyển nhanh như mũi tên nhờ có một sợi roi (flagellum) duy nhất gắn ở một đầu tế bào xoay tròn tạo lực đẩy."
  },
  {
    question: "Những cầu khuẩn tụ họp lại với nhau thành từng cụm ngẫu nhiên giống chùm nho được gọi là gì?",
    options: ["Song cầu khuẩn", "Liên cầu khuẩn", "Tụ cầu khuẩn", "Xoắn cầu khuẩn"],
    answer: 2,
    explain: "Cầu khuẩn liên kết thành chuỗi gọi là liên cầu khuẩn (Streptococcus), còn quần tụ thành cụm hình chùm nho gọi là tụ cầu khuẩn (Staphylococcus)."
  },
  {
    question: "Vi khuẩn Lactobacillus trong sữa chua mang lại lợi ích gì cho hệ tiêu hóa?",
    options: [
      "Tiêu diệt tế bào hồng cầu để tạo năng lượng",
      "Lên men đường lactose sinh axit lactic làm chua sữa, ức chế vi khuẩn có hại",
      "Ký sinh trong thành dạ dày gây viêm loét dạ dày",
      "Tiết ra độc tố gây nôn mửa"
    ],
    answer: 1,
    explain: "Lactobacillus acidophilus là trực khuẩn có lợi, giúp lên men đường trong sữa tạo ra axit lactic, ngăn ngừa các vi khuẩn gây bệnh phát triển trong ruột."
  },
  {
    question: "Khi mắc các bệnh viêm nhiễm do virus (ví dụ: cúm mùa, sốt xuất huyết), việc sử dụng thuốc kháng sinh để điều trị có hiệu quả không?",
    options: [
      "Có hiệu quả rất tốt vì kháng sinh diệt được tất cả các mầm bệnh",
      "Chỉ có tác dụng nếu uống liều cực cao",
      "Không có hiệu quả vì thuốc kháng sinh chỉ tiêu diệt được vi khuẩn, không diệt được virus",
      "Có tác dụng phụ giúp giảm sốt tức thì"
    ],
    answer: 2,
    explain: "Kháng sinh chỉ tấn công các cấu trúc tế bào của vi khuẩn (như vách tế bào, ribosome vi khuẩn). Virus chưa có cấu tạo tế bào nên kháng sinh hoàn toàn vô hiệu với chúng."
  }
];

export function ViKhuanSimulation({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'shapes' | 'applications' | 'quiz'>('shapes');
  const [selectedShape, setSelectedShape] = useState<string>("coccus");
  
  // Trạng thái load IFrame
  const [iframeLoading, setIframeLoading] = useState(true);
  
  // Trạng thái phóng to iframe
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Trạng thái Quiz
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Reset loading state on mount
  useEffect(() => {
    setIframeLoading(true);
  }, []);

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowQuizResult(false);
  };

  const handleAnswerClick = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);
    if (optionIdx === QUIZ_QUESTIONS[currentQuestionIdx].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowQuizResult(true);
      if (score + (selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].answer ? 1 : 0) === QUIZ_QUESTIONS.length) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col font-sans text-slate-100 overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 z-10 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm md:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-cyan-400 animate-bounce" />
              Mô Phỏng Hình Dạng Vi Khuẩn 3D
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Bài học về giới sinh vật - Sinh học lớp 6
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] md:text-xs font-black uppercase text-indigo-400 tracking-wider">
          Phòng thí nghiệm ảo 🧬
        </div>
      </header>

      {/* CONTAINER CHÍNH */}
      <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
        
        {/* KHU VỰC HIỂN THỊ MÔ HÌNH 3D (Bên trái) */}
        <div className={`relative bg-slate-900 transition-all duration-300 flex flex-col ${
          isFullscreen ? 'w-full h-full absolute inset-0 z-50' : 'flex-1 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800'
        }`}>
          {/* Nút Phóng to / Thu nhỏ mô hình */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
            title={isFullscreen ? "Thu nhỏ giao diện" : "Xem toàn màn hình mô hình"}
          >
            {isFullscreen ? <Minimize2 className="w-4.5 h-4.5" /> : <Maximize2 className="w-4.5 h-4.5" />}
          </button>

          {/* Nút Reload Iframe */}
          <button
            onClick={() => {
              setIframeLoading(true);
              const frame = document.getElementById('bacteria-frame') as HTMLIFrameElement;
              if (frame) frame.src = frame.src;
            }}
            className="absolute top-4 right-16 z-30 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
            title="Tải lại mô hình 3D"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>

          {/* Loading Indicator */}
          {iframeLoading && (
            <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="w-full h-full rounded-full border-[3px] border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
                <Activity className="w-8 h-8 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-2">Đang tải mô hình vi khuẩn 3D...</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Mách nhỏ: So với tế bào thực vật, vi khuẩn nhỏ hơn khoảng 10 đến 50 lần!
              </p>
            </div>
          )}

          {/* Nút Hướng Dẫn Tương Tác */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-md pointer-events-none">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kéo chuột để quay tròn • Cuộn để phóng to xem chi tiết vách & lông nhung vi khuẩn</span>
          </div>

          {/* Nhãn loại tế bào nổi */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-200">
            <span className="text-[10px] text-slate-400 font-normal uppercase block tracking-wider">MEDPIXEL 3D</span>
            Các Hình Dạng Vi Khuẩn
          </div>

          {/* IFrame Sketchfab */}
          <div className="w-full flex-1 relative bg-slate-950">
            <iframe
              id="bacteria-frame"
              title="Bactérias de diferentes formatos"
              src="https://sketchfab.com/models/81a589b887d54df5bbe4720718f460df/embed?autostart=1&preload=1&ui_theme=dark&ui_hint=0"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              onLoad={() => {
                setTimeout(() => setIframeLoading(false), 900);
              }}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* BẢNG TƯƠNG TÁC THÔNG TIN (Bên phải) */}
        <div className="w-full lg:w-96 bg-slate-900/95 border-t lg:border-t-0 border-slate-800 flex flex-col shadow-2xl z-20 shrink-0 h-1/2 lg:h-full">
          
          {/* CÁC TAB CHỌN CHỨC NĂNG */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1">
            <button
              onClick={() => setActiveTab('shapes')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'shapes' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Hình Dạng
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'applications' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" /> So Sánh & Thực Tế
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'quiz' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" /> Trắc Nghiệm
            </button>
          </div>

          {/* CHI TIẾT TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* 1. TAB HÌNH DẠNG (SHAPES) */}
            {activeTab === 'shapes' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1.5">Phân loại hình dạng vi khuẩn</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Trong tự nhiên, vi khuẩn rất đa dạng về hình dạng. Hình dạng của vi khuẩn do vách tế bào quy định, giúp chúng thích nghi tối đa với môi trường sống và phương thức sinh trưởng.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Chọn loại hình dạng vi khuẩn:</h4>
                  
                  {/* Grid chọn hình dạng */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {BACTERIA_SHAPES.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => setSelectedShape(shape.id)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold text-left transition-all border flex items-center gap-2 cursor-pointer ${
                          selectedShape === shape.id
                            ? 'bg-slate-800 text-white border-cyan-500/80 shadow-md shadow-cyan-900/10'
                            : 'bg-slate-950/40 text-slate-300 border-slate-700 hover:bg-slate-800/30'
                        }`}
                      >
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ 
                            backgroundColor: shape.color,
                            boxShadow: selectedShape === shape.id ? `0 0 8px ${shape.color}` : 'none'
                          }} 
                        />
                        <span className="truncate">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Khung giải thích chi tiết loại hình dạng */}
                {selectedShape && (() => {
                  const shapeInfo = BACTERIA_SHAPES.find(s => s.id === selectedShape);
                  if (!shapeInfo) return null;
                  return (
                    <div className="bg-gradient-to-b from-slate-950 to-slate-900/60 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
                      <div>
                        <h3 className="text-base font-black text-white flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: shapeInfo.color }} />
                          {shapeInfo.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 italic block font-semibold">Tên khoa học: {shapeInfo.scientificName}</span>
                      </div>
                      
                      <div className="space-y-2 text-xs leading-relaxed">
                        <p className="text-slate-300"><strong className="text-slate-200 font-extrabold">Mô tả định nghĩa:</strong> {shapeInfo.desc}</p>
                        <p className="text-slate-300"><strong className="text-slate-200 font-extrabold">Đặc điểm sinh trưởng:</strong> {shapeInfo.characteristics}</p>
                        <p className="text-slate-300"><strong className="text-cyan-300 font-extrabold">Vai trò trong y tế & đời sống:</strong> {shapeInfo.role}</p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-700 space-y-1.5">
                        <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Đại diện điển hình:</span>
                        <ul className="space-y-1">
                          {shapeInfo.examples.map((ex, i) => (
                            <li key={i} className="text-[10.5px] text-slate-300 flex items-start gap-1">
                              <span className="text-indigo-400 shrink-0">•</span>
                              <span className="leading-snug">{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 2. TAB SO SÁNH & THỰC TẾ (APPLICATIONS) */}
            {activeTab === 'applications' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Bảng so sánh kích thước & đặc điểm */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">So sánh Virus - Vi khuẩn - Nhân thực</h3>
                  </div>
                  
                  <div className="overflow-hidden rounded-xl border border-slate-800 text-[9.5px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800">
                          <th className="p-2 font-bold text-slate-300">Tiêu chí</th>
                          <th className="p-2 font-bold text-rose-400">Virus</th>
                          <th className="p-2 font-bold text-cyan-400">Vi khuẩn</th>
                          <th className="p-2 font-bold text-violet-400">Nhân thực</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                        {COMPARISONS.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            <td className="p-2 font-black text-slate-400 leading-snug">{row.criteria}</td>
                            <td className="p-2 text-slate-300 leading-snug">{row.virus}</td>
                            <td className="p-2 text-slate-300 leading-snug">{row.bacteria}</td>
                            <td className="p-2 text-slate-300 leading-snug">{row.eukaryote}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lợi ích vs Tác hại */}
                <div className="grid grid-cols-1 gap-3">
                  {/* Lợi ích */}
                  <div className="bg-emerald-950/15 p-4 rounded-xl border border-emerald-900/30 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-4 h-4" /> Ứng dụng có lợi
                    </h4>
                    <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li><strong>Lên men thực phẩm:</strong> Sản xuất sữa chua, phô mai, dưa chua, nước mắm, bánh mì chua.</li>
                      <li><strong>Xử lý môi trường:</strong> Phân hủy xác sinh vật chết, chất thải hữu cơ và các vết dầu tràn.</li>
                      <li><strong>Y học & Công nghệ sinh học:</strong> Chế tạo vắc xin, hormone insulin và sản xuất thuốc kháng sinh.</li>
                    </ul>
                  </div>

                  {/* Tác hại */}
                  <div className="bg-rose-950/15 p-4 rounded-xl border border-rose-900/30 space-y-2">
                    <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                      <ShieldAlert className="w-4 h-4" /> Tác hại gây bệnh
                    </h4>
                    <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li><strong>Gây bệnh ở người:</strong> Bệnh dịch tả (phẩy khuẩn tả), bệnh lao phổi, viêm phổi, giang mai.</li>
                      <li><strong>Gây hỏng thực phẩm:</strong> Làm thức ăn ôi thiu, biến chất dẫn đến ngộ độc nghiêm trọng khi ăn phải.</li>
                      <li><strong>Gây bệnh cho vật nuôi & cây trồng:</strong> Bệnh héo xanh vi khuẩn, bệnh thối nhũn rau màu.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TAB TRẮC NGHIỆM (QUIZ) */}
            {activeTab === 'quiz' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {!showQuizResult ? (
                  <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-4 shadow-lg">
                    {/* Tiến trình làm bài */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                        Câu hỏi {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-950/80 border border-indigo-900/60 text-indigo-300">
                        Điểm: {score}/{QUIZ_QUESTIONS.length}
                      </span>
                    </div>
                    
                    {/* Thanh progress */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                      />
                    </div>

                    {/* Nội dung câu hỏi */}
                    <p className="text-xs md:text-sm font-bold text-white leading-relaxed pt-2">
                      {QUIZ_QUESTIONS[currentQuestionIdx].question}
                    </p>

                    {/* Các lựa chọn đáp án */}
                    <div className="space-y-2.5 pt-2">
                      {QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, idx) => {
                        let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:text-white";
                        let iconElement = null;

                        if (isAnswered) {
                          const isCorrectOpt = idx === QUIZ_QUESTIONS[currentQuestionIdx].answer;
                          const isUserSel = idx === selectedOption;
                          
                          if (isCorrectOpt) {
                            btnStyle = "bg-emerald-950/50 border-emerald-500 text-emerald-300";
                            iconElement = <Check className="w-4 h-4 text-emerald-400 shrink-0" />;
                          } else if (isUserSel) {
                            btnStyle = "bg-rose-950/50 border-rose-500 text-rose-300";
                            iconElement = <X className="w-4 h-4 text-rose-400 shrink-0" />;
                          } else {
                            btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-50";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleAnswerClick(idx)}
                            className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {iconElement}
                          </button>
                        );
                      })}
                    </div>

                    {/* Phần giải giải thích chi tiết */}
                    {isAnswered && (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300 space-y-1">
                        <span className="text-[9px] font-black uppercase text-cyan-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Giải thích khoa học:
                        </span>
                        <p className="text-[10.5px] text-slate-300 leading-relaxed">
                          {QUIZ_QUESTIONS[currentQuestionIdx].explain}
                        </p>
                      </div>
                    )}

                    {/* Nút Chuyển câu hỏi */}
                    {isAnswered && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  // BÁO CÁO KẾT QUẢ QUIZ
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 text-center space-y-5 shadow-lg animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center mx-auto shadow-inner">
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                    
                    <div>
                      <h3 className="text-base font-black text-white">Kết quả bài trắc nghiệm</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                        Hình dạng & đặc điểm vi khuẩn
                      </p>
                    </div>

                    <div className="bg-slate-900 py-4 px-6 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                      <p className="text-3xl font-black text-cyan-400">{score} / {QUIZ_QUESTIONS.length}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">Câu trả lời chính xác</p>
                    </div>

                    <p className="text-xs text-slate-300 px-2 leading-relaxed">
                      {score === QUIZ_QUESTIONS.length 
                        ? "Xuất sắc! Bạn đã nhận diện hoàn hảo các hình dạng vi khuẩn trong tự nhiên." 
                        : score >= 3 
                        ? "Rất tốt! Bạn đã nắm vững các khái niệm cầu khuẩn, trực khuẩn, phẩy khuẩn cơ bản." 
                        : "Đừng lo lắng! Hãy đọc kỹ lại phần giới thiệu các hình dạng vi khuẩn và làm lại bài kiểm tra nhé."
                      }
                    </p>

                    <button
                      onClick={resetQuiz}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" /> Thực hiện lại bài học
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </div>

          {/* FOOTER INFO PANEL */}
          <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
            <span className="font-semibold uppercase tracking-wider text-slate-500">Giáo trình sinh học 6</span>
            <span className="flex items-center gap-1 font-bold text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Hệ thống vi sinh học ảo
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
