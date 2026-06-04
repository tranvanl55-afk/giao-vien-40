import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Info, HelpCircle, RefreshCw, BookOpen, 
  ChevronRight, Maximize2, Minimize2, Sparkles, Check, X, Award,
  Activity, CheckCircle2, FlaskConical, AlertCircle, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ----------------------------------------------------
// DỮ LIỆU TẢO LAM (CYANOBACTERIA)
// ----------------------------------------------------
interface CyanobacteriaPart {
  id: string;
  name: string;
  color: string;
  desc: string;
  function: string;
}

const CYANOBACTERIA_PARTS: CyanobacteriaPart[] = [
  {
    id: "filament",
    name: "Cấu trúc dạng sợi (Filamentous)",
    color: "#22c55e", // green-550
    desc: "Tập hợp các tế bào tảo lam liên kết nối tiếp nhau đầu - đuôi tạo thành chuỗi sợi dài di động hoặc cố định.",
    function: "Giúp tập đoàn tảo lam dễ dàng trôi nổi trong nước, tiếp cận tối đa với ánh sáng mặt trời để quang hợp và bảo vệ lẫn nhau."
  },
  {
    id: "photosynthesis",
    name: "Màng quang hợp (Thylakoids)",
    color: "#06b6d4", // cyan-500
    desc: "Hệ thống các túi màng dẹt thylakoid phân bố tự do trong tế bào chất, chứa chất diệp lục chlorophyll.",
    function: "Hấp thụ năng lượng ánh sáng mặt trời để thực hiện quá trình quang hợp, tạo chất hữu cơ tự dưỡng và giải phóng khí oxy."
  },
  {
    id: "heterocyst",
    name: "Tế bào dị hình (Heterocyst)",
    color: "#eab308", // yellow-500
    desc: "Tế bào lớn có thành dày chuyên biệt hóa mọc xen kẽ trong chuỗi sợi tảo lam.",
    function: "Đảm nhận vai trò cố định nitơ tự do trong không khí tạo thành hợp chất amoni cung cấp đạm dinh dưỡng cho toàn bộ sợi tảo."
  },
  {
    id: "akinete",
    name: "Bào tử nghỉ (Akinete)",
    color: "#a78bfa", // violet-400
    desc: "Tế bào sinh dưỡng phì đại tích lũy nhiều chất dự trữ, vách tế bào dày lên cực hạn.",
    function: "Giúp tảo lam ngủ đông vượt qua các điều kiện bất lợi như khô hạn, giá rét, thiếu dinh dưỡng kéo dài."
  }
];

// ----------------------------------------------------
// DỮ LIỆU TRÙNG LÔNG DIDINIUM
// ----------------------------------------------------
interface DidiniumPart {
  id: string;
  name: string;
  color: string;
  desc: string;
  function: string;
}

const DIDINIUM_PARTS: DidiniumPart[] = [
  {
    id: "cilia",
    name: "Vòng lông bơi (Ciliary Bands)",
    color: "#fb7185", // rose-400
    desc: "Hai vành đai lông bơi mảnh đập liên tục bao quanh thân tế bào đơn bào.",
    function: "Tạo lực đẩy giúp trùng cỏ xoay tròn di chuyển linh hoạt và bơi lội với vận tốc cực nhanh để săn đuổi con mồi."
  },
  {
    id: "cytostome",
    name: "Miệng phễu săn mồi (Cytostome)",
    color: "#facc15", // yellow-400
    desc: "Cấu trúc miệng hình nón phồng lên ở đỉnh tế bào, chứa các bó sợi độc tố trichocyst.",
    function: "Khi va chạm con mồi, nó phóng độc tố làm tê liệt con mồi, sau đó mở rộng miệng tối đa để nuốt chửng trùng đế giày."
  },
  {
    id: "nucleus",
    name: "Nhân tế bào (Macronucleus)",
    color: "#38bdf8", // sky-400
    desc: "Nhân lớn đặc trưng chứa hệ gen di truyền của sinh vật nhân thực đơn bào.",
    function: "Điều hòa và kiểm soát mọi hoạt động sống, trao đổi chất, vận động và tiêu hóa nội bào hàng ngày của trùng."
  },
  {
    id: "vacuole",
    name: "Không bào co bóp (Contractile Vacuole)",
    color: "#a78bfa", // violet-400
    desc: "Bào quan dạng túi chứa dịch có khả năng co bóp nhịp nhàng.",
    function: "Hút lượng nước thừa thấu thị vào cơ thể và chủ động bơm ra ngoài để giữ cân bằng áp suất thẩm thấu nội bào."
  }
];

// ----------------------------------------------------
// CÂU HỎI TRẮC NGHIỆM
// ----------------------------------------------------
interface Question {
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    question: "Phát biểu nào sau đây mô tả đúng nhất về cơ chế dinh dưỡng của Tảo lam (Cyanobacteria)?",
    options: [
      "Là sinh vật dị dưỡng chủ động bơi săn mồi trong nước.",
      "Là sinh vật ký sinh bắt buộc bên trong cơ thể động vật.",
      "Là sinh vật tự dưỡng, quang hợp tổng hợp chất hữu cơ và giải phóng khí oxy nhờ chất diệp lục.",
      "Hấp thụ chất dinh dưỡng thông qua việc phân hủy gỗ mục."
    ],
    answer: 2,
    explain: "Tảo lam (Cyanobacteria) chứa diệp lục nên có khả năng tự dưỡng qua quang hợp giống thực vật, chuyển hóa năng lượng mặt trời để sinh trưởng và tạo ra khí oxy."
  },
  {
    question: "Trùng cỏ Didinium là đại diện tiêu biểu của nhóm sinh vật nào sau đây?",
    options: ["Thực vật đa diện xoắn", "Động vật nguyên sinh trùng lông (Ciliata) đơn bào nhân thực", "Vi khuẩn nhân sơ dạng sợi", "Virus có màng bọc glycoprotein"],
    answer: 1,
    explain: "Didinium là một chi động vật nguyên sinh (Protozoa) đơn bào nhân thực phức tạp, thuộc lớp trùng lông (Ciliata), nổi tiếng với lối sống dị dưỡng săn mồi tích cực."
  },
  {
    question: "Thức ăn chủ đạo của Trùng lông Didinium trong môi trường ao hồ tự nhiên là gì?",
    options: ["Trùng biến hình Amoeba", "Tế bào Tảo lam dạng sợi", "Trùng đế giày Paramecium", "Các loại virus kí sinh"],
    answer: 2,
    explain: "Didinium là kẻ săn mồi chuyên nghiệp với con mồi yêu thích hàng đầu là Trùng đế giày Paramecium. Chúng dùng miệng phễu phóng độc tố tê liệt rồi nuốt chửng con mồi."
  },
  {
    question: "Tế bào dị hình (Heterocyst) trong chuỗi sợi của Tảo lam đảm nhận chức năng sinh học quan trọng nào?",
    options: [
      "Cố định nitơ tự do trong không khí cung cấp dinh dưỡng cho sợi tảo",
      "Hút nước và muối khoáng dưới đáy bùn ao",
      "Thực hiện phân đôi tế bào để sinh sản vô tính",
      "Tiết chất nhầy kết dính các sợi tảo với nhau"
    ],
    answer: 0,
    explain: "Heterocyst là các tế bào chuyên biệt hóa mọc xen kẽ có enzyme nitrogenase giúp cố định nitơ tự do từ khí quyển thành các hợp chất đạm giúp nuôi dưỡng tập đoàn tảo lam."
  },
  {
    question: "Trong lịch sử tiến hóa của Trái Đất, nhóm sinh vật nào đã đóng vai trò kiến tạo bầu khí quyển oxy đầu tiên?",
    options: ["Các loại nấm mốc hoại sinh", "Virus nhân sơ cổ xưa", "Tảo lam (Vi khuẩn lam)", "Các loài cây hạt kín thân gỗ lớn"],
    answer: 2,
    explain: "Hơn 2 tỷ năm trước, vi khuẩn lam (tảo lam) xuất hiện và quang hợp mạnh mẽ ở các đại dương cổ đại, tạo ra lượng oxy khổng lồ, kiến tạo nên bầu khí quyển chứa oxy đầu tiên của Trái Đất giúp mở đường cho sự sống hiếu khí phát triển."
  }
];

export function NguyenSinhVatSimulation({ onBack }: { onBack: () => void }) {
  // viewMode: 'algae' (tảo lam) hoặc 'didinium' (trùng cỏ didinium)
  const [viewMode, setViewMode] = useState<'algae' | 'didinium'>('algae');
  const [activeTab, setActiveTab] = useState<'info' | 'quiz'>('info');

  const [selectedAlgaePart, setSelectedAlgaePart] = useState<string>("filament");
  const [selectedDidiniumPart, setSelectedDidiniumPart] = useState<string>("cilia");

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

  const iframeSrc = viewMode === 'algae' 
    ? "https://sketchfab.com/models/a8db2672add84daeb2c80b4bb321b22b/embed?autostart=1&preload=1&ui_theme=dark&ui_hint=0"
    : "https://sketchfab.com/models/461e0e0cab864bb195b36f169e463091/embed?autostart=1&preload=1&ui_theme=dark&ui_hint=0";

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
              <FlaskConical className="w-5 h-5 text-purple-400 animate-bounce" />
              Mô Phỏng Nguyên Sinh Vật 3D
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Đơn bào tự dưỡng & trùng cỏ săn mồi - KHTN lớp 6
            </p>
          </div>
        </div>

        {/* Chuyển đổi giữa Tảo lam và Trùng lông */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setViewMode('algae')}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'algae'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Tảo Lam (Cyanobacteria)
          </button>
          <button
            onClick={() => setViewMode('didinium')}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'didinium'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Trùng Didinium (Ciliata)
          </button>
        </div>
      </header>

      {/* CONTAINER CHÍNH */}
      <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
        
        {/* KHU VỰC HIỂN THỊ MÔ HÌNH 3D (Bên trái) */}
        <div className={`relative bg-slate-900 transition-all duration-300 flex flex-col ${
          isFullscreen ? 'w-full h-full absolute inset-0 z-50' : 'flex-1 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800'
        }`}>
          {/* Phóng to/Thu nhỏ */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4.5 h-4.5" /> : <Maximize2 className="w-4.5 h-4.5" />}
          </button>

          {/* Tải lại */}
          <button
            onClick={() => {
              setIframeLoading(true);
              const frame = document.getElementById('protozoa-frame') as HTMLIFrameElement;
              if (frame) frame.src = frame.src;
            }}
            className="absolute top-4 right-16 z-30 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>

          {/* Loading */}
          {iframeLoading && (
            <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="w-full h-full rounded-full border-[3px] border-purple-500/20 border-t-purple-500 animate-spin"></div>
                <Activity className="w-8 h-8 text-purple-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-2 ">
                {viewMode === 'algae' ? 'Đang tải cấu trúc tảo lam dạng sợi...' : 'Đang tải giải phẫu trùng cỏ Didinium...'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {viewMode === 'algae' 
                  ? 'Vi khuẩn lam chứa sắc tố phycobilin và diệp lục tạo ra màu xanh lam đặc trưng giúp chúng dễ dàng quang hợp tự dưỡng.'
                  : 'Trùng Didinium nổi tiếng là sát thủ ao hồ nhờ tốc độ di chuyển chóng mặt và khả năng nuốt chửng trùng đế giày lớn hơn nó.'
                }
              </p>
            </div>
          )}

          {/* Nút Hướng Dẫn */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-md pointer-events-none">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Kéo chuột xoay tròn • Cuộn chuột để phóng to quan sát cấu trúc sợi và lông bơi</span>
          </div>

          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-200">
            <span className="text-[10px] text-slate-400 font-normal uppercase block tracking-wider">ITECHNOL 3D</span>
            {viewMode === 'algae' ? 'Cyanobacteria (Tảo Lam Dạng Sợi)' : 'Didinium (Trùng Lông Săn Mồi)'}
          </div>

          {/* IFrame */}
          <div className="w-full flex-1 relative bg-slate-950">
            <iframe
              id="protozoa-frame"
              title={viewMode === 'algae' ? "Cyanobacteria" : "Didinium"}
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
          
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'info' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Học liệu khoa học
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

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {activeTab === 'info' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* 1. INFO: CYANOBACTERIA */}
                {viewMode === 'algae' ? (
                  <div className="space-y-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                      <h3 className="text-sm font-black text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-purple-500" /> Tảo Lam (Vi khuẩn lam)
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Tảo lam là sinh vật nhân sơ cổ xưa, quang hợp giải phóng khí Oxy đầu tiên trên Trái Đất. Chúng thường tạo thành tập đoàn dạng chuỗi sợi mảnh dài liên kết dẻo dai.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Chọn cấu trúc thành phần tảo lam:</h4>
                      
                      <div className="flex flex-col gap-1.5">
                        {CYANOBACTERIA_PARTS.map((part) => (
                          <button
                            key={part.id}
                            onClick={() => setSelectedAlgaePart(part.id)}
                            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                              selectedAlgaePart === part.id
                                ? 'bg-slate-800 text-white border-purple-500/80 shadow-md'
                                : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-800/30'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2.5 h-2.5 rounded-full shrink-0" 
                                style={{ 
                                  backgroundColor: part.color,
                                  boxShadow: selectedAlgaePart === part.id ? `0 0 8px ${part.color}` : 'none'
                                }} 
                              />
                              <span>{part.name}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${selectedAlgaePart === part.id ? 'translate-x-1 text-purple-400' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedAlgaePart && (() => {
                      const partInfo = CYANOBACTERIA_PARTS.find(p => p.id === selectedAlgaePart);
                      if (!partInfo) return null;
                      return (
                        <div className="bg-gradient-to-b from-slate-950 to-slate-900/60 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
                          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: partInfo.color }} />
                            {partInfo.name}
                          </h3>
                          <div className="space-y-2 text-xs leading-relaxed">
                            <p className="text-slate-300"><strong className="text-slate-200 font-extrabold">Đặc điểm:</strong> {partInfo.desc}</p>
                            <p className="text-slate-300"><strong className="text-cyan-300 font-extrabold">Chức năng:</strong> {partInfo.function}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  
                  // 2. INFO: DIDINIUM
                  <div className="space-y-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                      <h3 className="text-sm font-black text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-purple-500" /> Trùng cỏ Didinium săn mồi
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Didinium là loài động vật nguyên sinh đơn bào nhân thực có lông bơi, nổi tiếng với kỹ năng săn mồi hung dữ, chuyên săn đuổi và nuốt chửng trùng đế giày Paramecium.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Chọn thành phần giải phẫu Didinium:</h4>
                      
                      <div className="flex flex-col gap-1.5">
                        {DIDINIUM_PARTS.map((part) => (
                          <button
                            key={part.id}
                            onClick={() => setSelectedDidiniumPart(part.id)}
                            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                              selectedDidiniumPart === part.id
                                ? 'bg-slate-800 text-white border-purple-500/80 shadow-md'
                                : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-800/30'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2.5 h-2.5 rounded-full shrink-0" 
                                style={{ 
                                  backgroundColor: part.color,
                                  boxShadow: selectedDidiniumPart === part.id ? `0 0 8px ${part.color}` : 'none'
                                }} 
                              />
                              <span>{part.name}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${selectedDidiniumPart === part.id ? 'translate-x-1 text-purple-400' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedDidiniumPart && (() => {
                      const partInfo = DIDINIUM_PARTS.find(p => p.id === selectedDidiniumPart);
                      if (!partInfo) return null;
                      return (
                        <div className="bg-gradient-to-b from-slate-950 to-slate-900/60 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
                          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: partInfo.color }} />
                            {partInfo.name}
                          </h3>
                          <div className="space-y-2 text-xs leading-relaxed">
                            <p className="text-slate-300"><strong className="text-slate-200 font-extrabold">Đặc điểm hình thái:</strong> {partInfo.desc}</p>
                            <p className="text-slate-300"><strong className="text-cyan-300 font-extrabold">Chức năng sinh học:</strong> {partInfo.function}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* TAB QUIZ */}
            {activeTab === 'quiz' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {!showQuizResult ? (
                  <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-4 shadow-lg">
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                        Câu hỏi {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-purple-950/80 border border-purple-900/60 text-purple-300">
                        Điểm: {score}/{QUIZ_QUESTIONS.length}
                      </span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                      />
                    </div>

                    <p className="text-xs md:text-sm font-bold text-white leading-relaxed pt-2">
                      {QUIZ_QUESTIONS[currentQuestionIdx].question}
                    </p>

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

                    {isAnswered && (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300 space-y-1">
                        <span className="text-[9px] font-black uppercase text-purple-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Giải thích sinh học:
                        </span>
                        <p className="text-[10.5px] text-slate-300 leading-relaxed">
                          {QUIZ_QUESTIONS[currentQuestionIdx].explain}
                        </p>
                      </div>
                    )}

                    {isAnswered && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 text-center space-y-5 shadow-lg animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center mx-auto shadow-inner">
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                    
                    <div>
                      <h3 className="text-base font-black text-white">Kết quả bài trắc nghiệm</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                        Thế giới nguyên sinh vật đơn bào
                      </p>
                    </div>

                    <div className="bg-slate-900 py-4 px-6 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                      <p className="text-3xl font-black text-purple-400">{score} / {QUIZ_QUESTIONS.length}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">Câu trả lời chính xác</p>
                    </div>

                    <p className="text-xs text-slate-300 px-2 leading-relaxed">
                      {score === QUIZ_QUESTIONS.length 
                        ? "Xuất sắc! Bạn đã hiểu rõ chuỗi thức ăn sinh vật lông bơi Didinium và khả năng tự dưỡng của Tảo lam." 
                        : score >= 3 
                        ? "Rất tốt! Bạn nắm chắc vai trò quang hợp của vi khuẩn lam cổ đại." 
                        : "Đọc kỹ giải phẫu các cơ quan Didinium và làm lại bài kiểm tra nhé!"
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

          <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
            <span className="font-semibold uppercase tracking-wider text-slate-500">Giáo trình sinh học 6</span>
            <span className="flex items-center gap-1 font-bold text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Hệ thống vi sinh học ảo
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
