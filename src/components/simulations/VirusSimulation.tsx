import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Info, HelpCircle, RefreshCw, BookOpen, 
  ChevronRight, Maximize2, Minimize2, Sparkles, Check, X, Award,
  Activity, CheckCircle2, FlaskConical, AlertCircle, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ----------------------------------------------------
// DỮ LIỆU HÌNH DẠNG VIRUS
// ----------------------------------------------------
interface VirusShape {
  id: string;
  name: string;
  scientificName: string;
  color: string;
  desc: string;
  characteristics: string;
  examples: string[];
}

const VIRUS_SHAPES: VirusShape[] = [
  {
    id: "helical",
    name: "Dạng xoắn (Helical)",
    scientificName: "Tobacco mosaic virus, Ebola, Rabies",
    color: "#a78bfa", // violet-400
    desc: "Các capsomer vỏ protein sắp xếp theo chiều xoắn của acid nucleic lõi.",
    characteristics: "Cấu trúc này tạo cho virus có hình ống, hình que thẳng hoặc sợi dài uốn lượn dẻo dai.",
    examples: [
      "Tobacco mosaic virus (TMV - Virus gây khảm thuốc lá)",
      "Rabies virus (Virus gây bệnh dại)",
      "Ebola virus (Gây sốt xuất huyết Ebola cực kỳ nguy hiểm)"
    ]
  },
  {
    id: "polyhedral",
    name: "Dạng khối đa diện (Polyhedral)",
    scientificName: "Adenovirus, Poliovirus, Rhinovirus",
    color: "#38bdf8", // sky-400
    desc: "Vỏ capsid sắp xếp tạo nên các mặt đa diện đối xứng đều nhau (thường là khối 20 mặt tam giác đều).",
    characteristics: "Hình dạng hạt virus trông tương tự như khối hình cầu đều đặn dưới kính hiển vi.",
    examples: [
      "Adenovirus (Gây viêm đường hô hấp, đau mắt đỏ)",
      "Poliovirus (Virus gây bệnh bại liệt trẻ em)",
      "Rhinovirus (Tác nhân chính gây cảm lạnh thông thường)"
    ]
  },
  {
    id: "complex",
    name: "Dạng hỗn hợp / Phức tạp (Complex)",
    scientificName: "Bacteriophage (Phage)",
    color: "#facc15", // yellow-400
    desc: "Cấu trúc gồm phần đầu có hình khối đa diện chứa hệ gen gắn với phần đuôi có cấu trúc dạng xoắn.",
    characteristics: "Chúng có đĩa gốc và các sợi đuôi mảnh như chân nhện giúp bám chặt vào vách tế bào vi khuẩn chủ.",
    examples: [
      "Bacteriophage T4 (Thể thực khuẩn chuyên ký sinh và tiêu diệt khuẩn E. coli)",
      "Poxviruses (Virus gây bệnh đậu mùa có dạng viên gạch lớn phức tạp)"
    ]
  },
  {
    id: "enveloped",
    name: "Dạng có màng bọc (Enveloped)",
    scientificName: "SARS-CoV-2, HIV, Influenza",
    color: "#fb7185", // rose-400
    desc: "Hạt virus có một màng bọc lipid bọc bên ngoài vỏ capsid bảo vệ.",
    characteristics: "Lớp màng lipid này đính các gai glycoprotein giúp virus nhận diện và xâm nhập dễ dàng vào tế bào vật chủ.",
    examples: [
      "SARS-CoV-2 (Virus Corona gây đại dịch bệnh đường hô hấp cấp COVID-19)",
      "Influenza virus (Virus gây bệnh cúm mùa)",
      "HIV (Virus gây suy giảm miễn dịch mắc phải ở người)"
    ]
  }
];

// ----------------------------------------------------
// DỮ LIỆU CẤU TẠO CORONAVIRUS
// ----------------------------------------------------
interface CoronaStructurePart {
  id: string;
  name: string;
  color: string;
  desc: string;
  function: string;
}

const CORONA_STRUCTURES: CoronaStructurePart[] = [
  {
    id: "spike",
    name: "Gai Glycoprotein (Spike Protein - S)",
    color: "#ef4444", // red-500
    desc: "Các gai protein lớn nhô ra ngoài bề mặt bao hạt virus, tạo nên hình ảnh giống vương miện (Corona).",
    function: "Đóng vai trò như 'chìa khóa' đặc hiệu để gắn kết vào thụ thể ACE2 trên màng tế bào chủ, mở đường cho virus xâm nhập."
  },
  {
    id: "envelope",
    name: "Màng Lipid bọc ngoài (Envelope)",
    color: "#fb923c", // orange-400
    desc: "Lớp màng lipid kép lấy từ màng sinh chất của tế bào vật chủ khi virus nảy chồi ra ngoài.",
    function: "Bảo vệ hệ gen bên trong hạt virus và dễ dàng bị hòa màng tế bào chủ. Màng này rất nhạy cảm với xà phòng và cồn sát khuẩn."
  },
  {
    id: "rna",
    name: "Lõi di truyền RNA (Genetic Material)",
    color: "#22c55e", // green-500
    desc: "Hệ gen gồm một sợi đơn RNA mạch dương (+) chứa mã thông tin di truyền của toàn bộ virus.",
    function: "Làm khuôn chỉ đạo tế bào chủ sản sinh, dịch mã ra các protein cấu trúc và sao chép nhân bản hạt virus mới."
  },
  {
    id: "capsid",
    name: "Vỏ Capsid (Protein Nucleocapsid - N)",
    color: "#3b82f6", // blue-500
    desc: "Vỏ protein cấu tạo từ nhiều đơn vị nhỏ bao bọc trực tiếp quanh sợi RNA di truyền.",
    function: "Bảo vệ vật chất di truyền khỏi sự phân hủy của các enzym nội bào vật chủ và hỗ trợ quá trình sao chép RNA."
  },
  {
    id: "membrane",
    name: "Protein Màng (Membrane - M) & Vỏ (E)",
    color: "#eab308", // yellow-500
    desc: "Các protein cấu trúc nằm xuyên qua lớp màng bọc lipid ngoại vi.",
    function: "Giúp liên kết vỏ nucleocapsid với màng ngoài, định hình cấu trúc hạt virus hình cầu đồng bộ trong quá trình lắp ráp."
  }
];

// ----------------------------------------------------
// CÂU HỎI TRẮC NGHIỆM VIRUS
// ----------------------------------------------------
interface Question {
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    question: "Phát biểu nào sau đây là ĐÚNG NHẤT về cấu tạo cơ bản của mọi loài virus?",
    options: [
      "Gồm màng tế bào chất, nhân hoàn chỉnh và các bào quan.",
      "Chưa có cấu tạo tế bào, chỉ gồm lõi vật chất di truyền và vỏ protein.",
      "Gồm nhân tế bào đơn giản và vách tế bào peptidoglycan.",
      "Là sinh vật đơn bào có roi di chuyển tự do trong nước."
    ],
    answer: 1,
    explain: "Virus chưa có cấu tạo tế bào (acelluar). Chúng là các hạt thực thể sinh học siêu nhỏ đơn giản chỉ gồm phần lõi nucleic acid (DNA hoặc RNA) được bao quanh bởi vỏ protein (capsid)."
  },
  {
    question: "Gai glycoprotein (Gai S) trên lớp màng bọc của virus Corona có chức năng sinh học cốt lõi nào?",
    options: [
      "Hấp thụ chất dinh dưỡng để nuôi hạt virus.",
      "Đóng vai trò như lông bơi giúp virus di chuyển ngược dòng máu.",
      "Nhận diện thụ thể ACE2 trên bề mặt tế bào chủ và giúp virus xâm nhập.",
      "Tiết chất độc phá hủy bạch cầu cơ thể người."
    ],
    answer: 2,
    explain: "Gai S liên kết đặc hiệu với thụ thể ACE2 của tế bào người (như tế bào niêm mạc phổi), tạo điều kiện cho lớp màng bọc virus hòa màng với màng tế bào để giải phóng hệ gen vào bên trong."
  },
  {
    question: "Thể thực khuẩn (Bacteriophage / Phage) ký sinh trên vi khuẩn có hình dạng đặc trưng nào?",
    options: ["Dạng xoắn thẳng giống sợi que", "Dạng hình khối 20 mặt đối xứng", "Dạng hỗn hợp phối hợp đầu đa diện và đuôi xoắn que", "Dạng hình cầu dẹt nhẵn bóng"],
    answer: 2,
    explain: "Bacteriophage là virus có hình dạng hỗn hợp/phức tạp: Phần đầu đa diện chứa DNA gắn liền với phần đuôi xoắn ống dài có các sợi đuôi giúp bám hút cơ học vào vi khuẩn chủ."
  },
  {
    question: "Tại sao việc rửa tay bằng xà phòng thông thường ít nhất 20 giây lại có tác dụng tiêu diệt virus Corona hiệu quả?",
    options: [
      "Nước xà phòng chứa hoạt chất đông tụ hoàn toàn lõi RNA.",
      "Phần đuôi kị nước của phân tử xà phòng cắm vào màng lipid ngoài của virus, phá vỡ vỏ bọc của nó.",
      "Xà phòng làm tăng nhiệt độ da tay lên 100 độ C để diệt virus.",
      "Xà phòng có tính axit cực mạnh ăn mòn lớp vỏ protein."
    ],
    answer: 1,
    explain: "Màng bọc ngoài của Corona là lớp kép lipid có cấu trúc lỏng lẻo. Phân tử xà phòng có đầu ưa nước và đuôi kị nước sẽ chèn vào lớp màng này, xé rách lớp vỏ lipid ngoài làm virus rã cấu trúc bám dính và bị nước rửa trôi."
  },
  {
    question: "Vắc-xin (Vaccine) phòng ngừa virus hoạt động dựa trên cơ chế sinh học nào?",
    options: [
      "Tiêu diệt trực tiếp hạt virus khi chúng vừa bay vào cơ thể.",
      "Kích thích hệ miễn dịch sản sinh kháng thể ghi nhớ để tiêu diệt virus thật nhanh chóng khi bị nhiễm thực tế.",
      "Bao bọc tất cả tế bào người bằng một màng bảo vệ vô hình.",
      "Cung cấp kháng sinh cực mạnh làm suy yếu tế bào vi khuẩn cộng sinh."
    ],
    answer: 1,
    explain: "Vắc-xin chứa các mảnh protein, virus bất hoạt hoặc mRNA mã hóa gai virus giúp hệ miễn dịch tập dượt nhận diện vật thể lạ từ trước, tạo ra kháng thể và tế bào nhớ sẵn sàng dập tắt mầm bệnh khi bị virus thật tấn công."
  }
];

export function VirusSimulation({ onBack }: { onBack: () => void }) {
  // viewMode: 'shapes' (hình dạng) hoặc 'structure' (cấu tạo corona)
  const [viewMode, setViewMode] = useState<'shapes' | 'structure'>('shapes');
  const [activeTab, setActiveTab] = useState<'info' | 'quiz'>('info');
  
  // Trạng thái chọn mục chi tiết
  const [selectedShape, setSelectedShape] = useState<string>("helical");
  const [selectedStructure, setSelectedStructure] = useState<string>("spike");

  // Trạng thái tải iframe
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Trạng thái Quiz
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  useEffect(() => {
    setIframeLoading(true);
    resetQuiz();
  }, [viewMode]);

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

  // URL nhúng cho từng chế độ xem
  const iframeSrc = viewMode === 'shapes' 
    ? "https://sketchfab.com/models/3c2e9577420444879cef294b9ce8b318/embed?autostart=1&preload=1&ui_theme=dark&ui_hint=0" 
    : "https://sketchfab.com/models/8982bec5c8644b35bb468a14a31e3baf/embed?autostart=1&preload=1&ui_theme=dark&ui_hint=0";

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
              <FlaskConical className="w-5 h-5 text-rose-500 animate-bounce" />
              Mô Phỏng Thế Giới Virus 3D
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Nghiên cứu vi sinh vật & dịch tễ học - KHTN lớp 6
            </p>
          </div>
        </div>

        {/* Chuyển đổi hai mô hình chính ở trên Header */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setViewMode('shapes')}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'shapes'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Hình dạng virus
          </button>
          <button
            onClick={() => setViewMode('structure')}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'structure'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Cấu tạo Corona
          </button>
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
              const frame = document.getElementById('virus-frame') as HTMLIFrameElement;
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
                <div className="w-full h-full rounded-full border-[3px] border-rose-500/20 border-t-rose-500 animate-spin"></div>
                <Activity className="w-8 h-8 text-rose-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-2">
                {viewMode === 'shapes' ? 'Đang tải mô hình hình dạng virus...' : 'Đang tải mô hình cấu tạo Corona...'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Mách nhỏ: Virus không được coi là sinh vật sống hoàn chỉnh vì chúng không thể tự thực hiện trao đổi chất và nhân đôi nếu thiếu tế bào chủ!
              </p>
            </div>
          )}

          {/* Nút Hướng Dẫn Tương Tác */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-md pointer-events-none">
            <Info className="w-3.5 h-3.5 text-rose-400" />
            <span>Kéo chuột xoay tròn • Cuộn để zoom cận cảnh cấu tạo phân tử virus</span>
          </div>

          {/* Nhãn loại tế bào nổi */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-200">
            <span className="text-[10px] text-slate-400 font-normal uppercase block tracking-wider">
              {viewMode === 'shapes' ? 'TOMPARSONS 3D' : 'MAYCON.CHAVES 3D'}
            </span>
            {viewMode === 'shapes' ? 'Virus Multipack (Hình học)' : 'Coronavirus (SARS-CoV-2)'}
          </div>

          {/* IFrame Sketchfab */}
          <div className="w-full flex-1 relative bg-slate-950">
            <iframe
              id="virus-frame"
              title={viewMode === 'shapes' ? "Virus Multipack" : "Coronavirus"}
              src={iframeSrc}
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
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'info' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-400" /> Thông tin bài học
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'quiz' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Trắc nghiệm củng cố
            </button>
          </div>

          {/* CHI TIẾT TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* 1. TAB THÔNG TIN BÀI HỌC */}
            {activeTab === 'info' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* HIỂN THỊ THEO CHẾ ĐỘ 1: HÌNH DẠNG VIRUS */}
                {viewMode === 'shapes' ? (
                  <div className="space-y-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                      <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> Các hình dạng virus chính
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Virus có kích thước siêu hiển vi (từ 20 - 400 nm), chỉ được cấu thành từ lớp vỏ protein (capsid) và vật chất di truyền. Dựa trên hình học cấu trúc đối xứng capsid, virus được phân thành các dạng cơ bản dưới đây.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Chọn loại hình dáng của Virus:</h4>
                      
                      <div className="grid grid-cols-2 gap-1.5">
                        {VIRUS_SHAPES.map((shape) => (
                          <button
                            key={shape.id}
                            onClick={() => setSelectedShape(shape.id)}
                            className={`px-3 py-2.5 rounded-xl text-[10.5px] font-bold text-left transition-all border flex items-center gap-2 cursor-pointer ${
                              selectedShape === shape.id
                                ? 'bg-slate-800 text-white border-rose-500/80 shadow-md'
                                : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-800/30'
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

                    {/* Chi tiết loại hình dạng được chọn */}
                    {selectedShape && (() => {
                      const shapeInfo = VIRUS_SHAPES.find(s => s.id === selectedShape);
                      if (!shapeInfo) return null;
                      return (
                        <div className="bg-gradient-to-b from-slate-950 to-slate-900/60 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
                          <div>
                            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: shapeInfo.color }} />
                              {shapeInfo.name}
                            </h3>
                            <span className="text-[9.5px] text-slate-400 italic block font-semibold">Đại diện tiêu biểu: {shapeInfo.scientificName}</span>
                          </div>
                          
                          <div className="space-y-2 text-xs leading-relaxed">
                            <p className="text-slate-300"><strong className="text-slate-200 font-extrabold">Đặc điểm hình dạng:</strong> {shapeInfo.desc}</p>
                            <p className="text-slate-300"><strong className="text-slate-200 font-extrabold">Cơ chế vỏ bọc:</strong> {shapeInfo.characteristics}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-800 space-y-1">
                            <span className="text-[9px] font-black uppercase text-rose-400 tracking-wider">Mẫu bệnh phẩm thực tế:</span>
                            <ul className="space-y-1">
                              {shapeInfo.examples.map((ex, i) => (
                                <li key={i} className="text-[10.5px] text-slate-300 flex items-start gap-1">
                                  <span className="text-rose-500 shrink-0">•</span>
                                  <span className="leading-snug">{ex}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  
                  // HIỂN THỊ THEO CHẾ ĐỘ 2: CẤU TẠO CORONAVIRUS
                  <div className="space-y-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                      <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-rose-500" /> Cấu trúc phân tử Coronavirus
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Coronavirus (ví dụ SARS-CoV-2) là loại virus có màng bọc lipid bảo vệ, chứa chuỗi đơn RNA mạch dương mã hóa gen. Hãy nhấp vào từng thành phần dưới đây để giải phẫu cấu tạo chi tiết.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Chọn thành phần cấu tạo:</h4>
                      
                      <div className="flex flex-col gap-1.5">
                        {CORONA_STRUCTURES.map((struct) => (
                          <button
                            key={struct.id}
                            onClick={() => setSelectedStructure(struct.id)}
                            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                              selectedStructure === struct.id
                                ? 'bg-slate-800 text-white border-rose-500/80 shadow-md'
                                : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-800/30'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2.5 h-2.5 rounded-full shrink-0" 
                                style={{ 
                                  backgroundColor: struct.color,
                                  boxShadow: selectedStructure === struct.id ? `0 0 8px ${struct.color}` : 'none'
                                }} 
                              />
                              <span>{struct.name}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${selectedStructure === struct.id ? 'translate-x-1 text-rose-400' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chi tiết thành phần cấu tạo được chọn */}
                    {selectedStructure && (() => {
                      const structInfo = CORONA_STRUCTURES.find(s => s.id === selectedStructure);
                      if (!structInfo) return null;
                      return (
                        <div className="bg-gradient-to-b from-slate-950 to-slate-900/60 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
                          <div>
                            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: structInfo.color }} />
                              {structInfo.name}
                            </h3>
                          </div>
                          
                          <div className="space-y-2.5 text-xs leading-relaxed">
                            <p className="text-slate-300"><strong className="text-slate-200 font-extrabold">Đặc điểm hình thái:</strong> {structInfo.desc}</p>
                            <p className="text-slate-300"><strong className="text-cyan-300 font-extrabold">Chức năng sinh học chính:</strong> {structInfo.function}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* 2. TAB TRẮC NGHIỆM CỦNG CỐ */}
            {activeTab === 'quiz' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {!showQuizResult ? (
                  <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-4 shadow-lg">
                    {/* Tiến trình làm bài */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                        Câu hỏi {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-950/80 border border-rose-900/60 text-rose-300">
                        Điểm: {score}/{QUIZ_QUESTIONS.length}
                      </span>
                    </div>
                    
                    {/* Thanh progress */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-300"
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
                            <span className="leading-snug">{option}</span>
                            {iconElement}
                          </button>
                        );
                      })}
                    </div>

                    {/* Phần giải thích */}
                    {isAnswered && (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300 space-y-1">
                        <span className="text-[9px] font-black uppercase text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Giải thích y học:
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
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  // BÁO CÁO KẾT QUẢ QUIZ
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 text-center space-y-5 shadow-lg animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center mx-auto shadow-inner">
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                    
                    <div>
                      <h3 className="text-base font-black text-white">Kết quả bài trắc nghiệm</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                        Hình thái học & Phòng ngừa dịch bệnh
                      </p>
                    </div>

                    <div className="bg-slate-900 py-4 px-6 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                      <p className="text-3xl font-black text-rose-400">{score} / {QUIZ_QUESTIONS.length}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">Câu trả lời chính xác</p>
                    </div>

                    <p className="text-xs text-slate-300 px-2 leading-relaxed">
                      {score === QUIZ_QUESTIONS.length 
                        ? "Hoàn hảo! Kiến thức phòng chống dịch bệnh và hình học vi sinh của bạn đạt mức tối đa." 
                        : score >= 3 
                        ? "Rất tốt! Bạn hiểu rõ tác dụng phòng dịch của xà phòng và cấu trúc màng bọc gai Corona." 
                        : "Hãy đọc lại kỹ các thành phần cấu tạo Corona ở tab ngoài rồi thực hiện lại bài kiểm tra nhé!"
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
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> Hệ thống vi sinh học ảo
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
