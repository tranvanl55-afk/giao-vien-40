import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Wind, Activity, Info, HelpCircle, 
  Stethoscope, AlertCircle, CheckCircle2, XCircle, 
  MessageSquare, BrainCircuit, Sparkles, Maximize, Minimize
} from 'lucide-react';

interface OrganInfo {
  organ_name: string;
  action: string;
  did_you_know: string;
  quiz_challenge: string;
  style_hint: string;
}

const ORGAN_DATA: Record<string, OrganInfo & { annotationId: number }> = {
  nasal_cavity: {
    organ_name: "Khoang mũi",
    action: "Lọc, làm ấm và làm ẩm không khí trước khi vào phổi.",
    did_you_know: "Mũi của bạn có thể ghi nhớ tới 50,000 mùi hương khác nhau đấy!",
    quiz_challenge: "Tại sao chúng ta nên thở bằng mũi thay vì bằng miệng?",
    style_hint: "cyan",
    annotationId: 1
  },
  pharynx_larynx: {
    organ_name: "Họng & Thanh quản",
    action: "Ngã tư hô hấp - tiêu hóa và là cơ quan phát âm chính.",
    did_you_know: "Thanh quản chứa các dây thanh âm, chúng rung động để tạo ra tiếng nói của bạn.",
    quiz_challenge: "Bộ phận nào giúp ngăn thức ăn không rơi vào đường thở khi nuốt?",
    style_hint: "soft_red",
    annotationId: 2
  },
  trachea: {
    organ_name: "Khí quản",
    action: "Ống dẫn khí chính có các vòng sụn hình chữ U giúp đường thở luôn mở.",
    did_you_know: "Nếu kéo dài khí quản ra, nó giống như một chiếc ống hút khổng lồ dẫn khí vào 'nhà máy' phổi.",
    quiz_challenge: "Tại sao các vòng sụn khí quản lại có hình chữ U mà không phải vòng tròn khép kín?",
    style_hint: "indigo",
    annotationId: 3
  },
  bronchi: {
    organ_name: "Phế quản",
    action: "Các nhánh dẫn khí chia nhỏ dần để đưa khí vào sâu trong từng lá phổi.",
    did_you_know: "Mạng lưới phế quản trông giống như một cái cây mọc ngược trong lồng ngực bạn.",
    quiz_challenge: "Phế quản chia thành bao nhiêu nhánh chính đi vào hai lá phổi?",
    style_hint: "blue",
    annotationId: 4
  },
  lungs: {
    organ_name: "Lá phổi",
    action: "Nơi diễn ra sự trao đổi khí giữa phế nang và mao mạch máu.",
    did_you_know: "Tổng diện tích bề mặt của các phế nang trong phổi bằng diện tích của một sân tennis!",
    quiz_challenge: "Khí nào đi từ phế nang vào máu và khí nào đi ngược lại?",
    style_hint: "emerald",
    annotationId: 5
  },
  diaphragm: {
    organ_name: "Cơ hoành",
    action: "Cơ chính hỗ trợ việc hít vào và thở ra bằng cách thay đổi thể tích lồng ngực.",
    did_you_know: "Nấc cụt xảy ra khi cơ hoành của bạn bị kích thích và co thắt đột ngột.",
    quiz_challenge: "Khi hít vào, cơ hoành sẽ co xuống hay giãn lên?",
    style_hint: "orange",
    annotationId: 6
  }
};

const QUIZ_QUESTIONS = [
  {
    symptoms: "Bệnh nhân khò khè, khó thở, tức ngực, thường xảy ra khi gắng sức hoặc gặp tác nhân dị ứng (bụi, phấn hoa).",
    answer: "Hen suyễn",
    fact: "Khói thuốc lá là kẻ thù số 1 làm khởi phát các cơn hen nặng."
  },
  {
    symptoms: "Bệnh nhân sốt cao, ho có đờm đặc màu xanh/vàng, đau ngực khi hít thở sâu, người mệt mỏi.",
    answer: "Viêm phổi",
    fact: "Viêm phổi có thể do vi khuẩn, virus hoặc nấm gây ra."
  },
  {
    symptoms: "Ho kéo dài trên 3 tuần, sụt cân nhanh, sốt nhẹ về chiều, đôi khi ho ra máu.",
    answer: "Lao phổi",
    fact: "Vi khuẩn lao có thể lây qua những giọt bắn li ti khi người bệnh ho hoặc hắt hơi."
  },
  {
    symptoms: "Ho dai dẳng không dứt, đau ngực mạn tính, sút cân trầm trọng, bệnh nhân có tiền sử hút thuốc lá nhiều năm.",
    answer: "Ung thư phổi",
    fact: "80-90% các ca ung thư phổi liên quan trực tiếp đến khói thuốc lá."
  }
];

export function RespiratorySystem({ onBack }: { onBack: () => void }) {
  const [selectedOrgan, setSelectedOrgan] = useState<any | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState<string | null>(null);
  const [viewerApi, setViewerApi] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  React.useEffect(() => {
    // Load Sketchfab API
    const script = document.createElement('script');
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const client = new (window as any).Sketchfab('1.12.1', iframeRef.current);
      client.init('250911151757489da1cf5501b791f363', {
        success: (api: any) => {
          api.start();
          api.addEventListener('viewerready', () => {
            setViewerApi(api);
          });
        },
        error: () => console.error('Sketchfab API error'),
        autostart: 1,
        transparent: 1,
        ui_controls: 0,
        ui_infos: 0
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleOrganSelect = (id: string) => {
    setIsQuizMode(false);
    const organ = ORGAN_DATA[id];
    setSelectedOrgan(organ);
    
    if (viewerApi) {
      // Move camera to the organ's annotation (1-indexed based on model data)
      viewerApi.gotoAnnotation(organ.annotationId - 1, { preventCameraAnimation: false, preventCameraMove: false });
    }
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    setSelectedOrgan(null);
    setCurrentQuiz(Math.floor(Math.random() * QUIZ_QUESTIONS.length));
    setShowQuizResult(null);
  };

  const checkAnswer = (answer: string) => {
    if (answer === QUIZ_QUESTIONS[currentQuiz].answer) {
      setShowQuizResult("correct");
    } else {
      setShowQuizResult("wrong");
    }
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-khtn8-pastel flex font-sans text-slate-800 overflow-hidden">
      {/* 3D View (Left Side) */}
      <div className="flex-1 relative p-4 bg-transparent">
        <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 transition-all shadow-md border border-slate-200">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200 flex items-center gap-2 shadow-sm">
            <Wind className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="font-bold text-blue-700 tracking-wide uppercase text-sm">Hệ Hô Hấp 3D</span>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 transition-all shadow-md border border-slate-200"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </button>
        </div>

        <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-200 bg-[#0f172a] relative shadow-lg">
          <iframe 
            ref={iframeRef}
            title="Human Respiratory system review" 
            src="https://sketchfab.com/models/250911151757489da1cf5501b791f363/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_watermark=0&transparent=1"
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; xr-spatial-tracking"
          />
          
          {/* Organ Selector Overlay */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 p-4 card-khtn8-light w-[90%] max-w-2xl rounded-3xl">
            {Object.keys(ORGAN_DATA).map((id) => (
              <button
                key={id}
                onClick={() => handleOrganSelect(id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedOrgan?.organ_name === ORGAN_DATA[id].organ_name
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md scale-105'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {ORGAN_DATA[id].organ_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Panel (Right Side) */}
      <div className="w-[480px] bg-white border-l border-slate-200/80 flex flex-col shadow-2xl z-20 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-linear-to-r from-blue-50/50 to-indigo-50/50 relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">BÁC SĨ NHÍ AI</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Trực tuyến</span>
              </div>
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-medium">
            "Xin chào! Mình là Bác sĩ Nhí. Hãy chọn một bộ phận để cùng khám phá nhà máy oxy siêu cấp của cơ thể nhé!"
          </p>
          <Sparkles className="absolute top-4 right-4 w-5 h-5 text-blue-500/30" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {isQuizMode ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-indigo-55 border border-indigo-200 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-indigo-600 font-black uppercase text-sm tracking-widest">Thử thách chẩn đoán</h3>
                  </div>
                  <p className="text-slate-800 text-lg font-bold leading-snug mb-6">
                    "{QUIZ_QUESTIONS[currentQuiz].symptoms}"
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {QUIZ_QUESTIONS.map((q) => (
                      <button
                        key={q.answer}
                        onClick={() => checkAnswer(q.answer)}
                        className="w-full p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all text-sm font-bold text-slate-700 group flex items-center justify-between shadow-sm"
                      >
                        {q.answer}
                        <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 -rotate-180 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {showQuizResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-3xl border ${
                        showQuizResult === "correct" 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {showQuizResult === "correct" ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                        <h4 className="font-black text-lg uppercase">{showQuizResult === "correct" ? "Chẩn đoán chính xác!" : "Chưa chính xác rồi!"}</h4>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">
                        {showQuizResult === "correct" 
                          ? "Bạn có tố chất làm bác sĩ đấy! Câu trả lời là " + QUIZ_QUESTIONS[currentQuiz].answer + "."
                          : "Đừng buồn nhé, hãy đọc kỹ triệu chứng và thử lại nào!"}
                      </p>
                      {showQuizResult === "correct" && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Lời khuyên bác sĩ:</h5>
                          <p className="text-xs text-slate-500 italic">"{QUIZ_QUESTIONS[currentQuiz].fact}"</p>
                        </div>
                      )}
                      <button 
                        onClick={startQuiz}
                        className="mt-4 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all uppercase tracking-widest border border-slate-200"
                      >
                        Câu đố khác
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : selectedOrgan ? (
              <motion.div
                key={selectedOrgan.organ_name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Organ Detail Card */}
                <div className={`p-8 rounded-4xl border-2 bg-slate-50 relative overflow-hidden ${
                  selectedOrgan.style_hint === 'cyan' ? 'border-cyan-200' :
                  selectedOrgan.style_hint === 'soft_red' ? 'border-red-200' :
                  selectedOrgan.style_hint === 'indigo' ? 'border-indigo-200' :
                  selectedOrgan.style_hint === 'blue' ? 'border-blue-200' :
                  selectedOrgan.style_hint === 'emerald' ? 'border-emerald-200' : 'border-orange-200'
                }`}>
                  <h2 className={`text-3xl font-black mb-4 ${
                    selectedOrgan.style_hint === 'cyan' ? 'text-cyan-600' :
                    selectedOrgan.style_hint === 'soft_red' ? 'text-red-600' :
                    selectedOrgan.style_hint === 'indigo' ? 'text-indigo-600' :
                    selectedOrgan.style_hint === 'blue' ? 'text-blue-600' :
                    selectedOrgan.style_hint === 'emerald' ? 'text-emerald-600' : 'text-orange-600'
                  }`}>{selectedOrgan.organ_name}</h2>
                  
                  <div className="flex gap-3 mb-6">
                    <Activity className="w-5 h-5 text-slate-500 shrink-0 mt-1" />
                    <p className="text-slate-700 font-bold leading-relaxed">{selectedOrgan.action}</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Bạn có biết?</span>
                    </div>
                    <p className="text-slate-600 text-sm italic leading-relaxed">
                      "{selectedOrgan.did_you_know}"
                    </p>
                  </div>
                </div>

                {/* Challenge Card */}
                <div className="bg-linear-to-br from-amber-500/5 to-orange-500/5 border border-amber-200 rounded-4xl p-6 relative">
                  <div className="flex items-center gap-3 mb-3">
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                    <h3 className="text-amber-600 font-black uppercase text-xs tracking-widest">Thử thách tư duy</h3>
                  </div>
                  <p className="text-slate-700 text-sm font-medium leading-relaxed italic mb-2">
                    "{selectedOrgan.quiz_challenge}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem]"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Activity className="w-10 h-10 text-slate-400 animate-pulse" />
                </div>
                <h3 className="text-slate-700 font-bold text-lg mb-2">Sẵn sàng chẩn đoán?</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Hãy click chọn một bộ phận trên lồng ngực để xem chi tiết, hoặc thử tài bác sĩ bằng nút đố vui bên dưới!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="p-8 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
          <button 
            onClick={startQuiz}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-md shadow-indigo-600/10 text-xs uppercase tracking-widest"
          >
            <BrainCircuit className="w-4 h-4" /> Đố vui
          </button>
          <button 
            onClick={() => { setSelectedOrgan(null); setIsQuizMode(false); }}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all border border-slate-200 text-xs uppercase tracking-widest"
          >
            <Info className="w-4 h-4" /> Học tập
          </button>
        </div>
      </div>
    </div>
  );
}
