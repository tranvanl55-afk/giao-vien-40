import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Activity, Info, HelpCircle, 
  Dna, AlertCircle, CheckCircle2, XCircle, 
  BrainCircuit, Sparkles, Maximize, Minimize,
  Coffee, UtensilsCrossed, Droplets
} from 'lucide-react';

interface OrganInfo {
  name: string;
  action: string;
  did_you_know: string;
  quiz_challenge: string;
  style_hint: string;
  annotationId: number;
}

const DIGESTIVE_DATA: Record<string, OrganInfo> = {
  mouth: {
    name: "Khoang miệng",
    action: "Nghiền nhỏ thức ăn và bắt đầu tiêu hóa tinh bột nhờ enzyme amylase trong nước bọt.",
    did_you_know: "Bạn tạo ra đủ nước bọt trong đời để lấp đầy hai hồ bơi cỡ lớn đấy!",
    quiz_challenge: "Enzyme nào trong nước bọt giúp biến đổi tinh bột thành đường đôi?",
    style_hint: "rose",
    annotationId: 1
  },
  esophagus: {
    name: "Thực quản",
    action: "Ống dẫn thức ăn xuống dạ dày nhờ các chuyển động nhu động nhịp nhàng.",
    did_you_know: "Ngay cả khi bạn đang trồng cây chuối, thức ăn vẫn sẽ đi vào dạ dày nhờ lực đẩy của thực quản!",
    quiz_challenge: "Thời gian trung bình để thức ăn đi hết thực quản là bao nhiêu giây?",
    style_hint: "indigo",
    annotationId: 2
  },
  stomach: {
    name: "Dạ dày",
    action: "Co bóp mạnh mẽ và tiết dịch vị (chứa HCl) để tiêu hóa protein và tiêu diệt vi khuẩn.",
    did_you_know: "Axit trong dạ dày của bạn mạnh đến mức có thể làm tan chảy cả một chiếc lưỡi dao cạo!",
    quiz_challenge: "Lớp màng nào bảo vệ dạ dày không bị chính axit của nó 'tiêu hóa'?",
    style_hint: "red",
    annotationId: 3
  },
  liver: {
    name: "Gan",
    action: "Sản xuất dịch mật để nhũ tương hóa chất béo và thanh lọc độc tố cho cơ thể.",
    did_you_know: "Gan là cơ quan nội tạng lớn nhất và có khả năng tự tái tạo kỳ diệu.",
    quiz_challenge: "Dịch mật được lưu trữ ở đâu trước khi đổ vào ruột non?",
    style_hint: "amber",
    annotationId: 4
  },
  pancreas: {
    name: "Tụy",
    action: "Tiết dịch tụy chứa các enzyme tiêu hóa protein, lipid và carbohydrate.",
    did_you_know: "Tụy vừa là tuyến ngoại tiết (tiết dịch tiêu hóa) vừa là tuyến nội tiết (tiết insulin).",
    quiz_challenge: "Hormone nào do tụy tiết ra giúp điều hòa lượng đường trong máu?",
    style_hint: "yellow",
    annotationId: 5
  },
  small_intestine: {
    name: "Ruột non",
    action: "Nơi hoàn tất quá trình tiêu hóa và hấp thụ hầu hết các chất dinh dưỡng vào máu.",
    did_you_know: "Nếu trải phẳng ruột non, diện tích của nó sẽ tương đương với một sân tennis!",
    quiz_challenge: "Cấu trúc nào giúp ruột non tăng diện tích bề mặt hấp thụ lên gấp nhiều lần?",
    style_hint: "emerald",
    annotationId: 6
  },
  large_intestine: {
    name: "Ruột già",
    action: "Hấp thụ nước, muối khoáng và là nơi trú ngụ của hàng tỷ vi khuẩn có lợi.",
    did_you_know: "Có nhiều vi khuẩn trong ruột già của bạn hơn cả số người đang sống trên Trái đất!",
    quiz_challenge: "Phần cuối cùng của ruột già, nơi lưu trữ phân trước khi thải ra ngoài là gì?",
    style_hint: "blue",
    annotationId: 7
  }
};

const DIGESTIVE_QUIZ = [
  {
    question: "Cơ quan nào dài nhất trong hệ tiêu hóa?",
    options: ["Thực quản", "Dạ dày", "Ruột non", "Ruột già"],
    answer: "Ruột non",
    fact: "Ruột non người trưởng thành dài khoảng 6-7 mét!"
  },
  {
    question: "Axit nào có trong dịch vị dạ dày?",
    options: ["Axit Sunfuric", "Axit Clohidric (HCl)", "Axit Axetic", "Axit Nitric"],
    answer: "Axit Clohidric (HCl)",
    fact: "Axit HCl giúp kích hoạt enzyme tiêu hóa và diệt khuẩn trong thức ăn."
  },
  {
    question: "Dịch mật giúp tiêu hóa nhóm chất nào sau đây?",
    options: ["Tinh bột", "Chất béo (Lipid)", "Protein", "Vitamin"],
    answer: "Chất béo (Lipid)",
    fact: "Dịch mật nhũ tương hóa chất béo thành các hạt nhỏ để enzyme lipase dễ dàng xử lý."
  }
];

export function DigestiveSystem({ onBack }: { onBack: () => void }) {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganInfo | null>(null);
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
    const script = document.createElement('script');
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const client = new (window as any).Sketchfab('1.12.1', iframeRef.current);
      client.init('053bab50888840afbbe24c361887c8f9', {
        success: (api: any) => {
          api.start();
          api.addEventListener('viewerready', () => {
            setViewerApi(api);
            
            // Listen for direct clicks on 3D organs
            api.addEventListener('click', (info: any) => {
              if (info.instanceID) {
                api.getNodeMap((err: any, nodes: any) => {
                  if (!err && nodes) {
                    const node = nodes[info.instanceID];
                    if (node && node.name) {
                      const name = node.name.toLowerCase();
                      let detectedId = null;
                      if (name.includes('stomach')) detectedId = 'stomach';
                      else if (name.includes('liver')) detectedId = 'liver';
                      else if (name.includes('small_intestine')) detectedId = 'small_intestine';
                      else if (name.includes('large_intestine') || name.includes('colon')) detectedId = 'large_intestine';
                      else if (name.includes('esophagus')) detectedId = 'esophagus';
                      else if (name.includes('pancreas')) detectedId = 'pancreas';
                      else if (name.includes('gall')) detectedId = 'liver'; // Map gallbladder near liver
                      else if (name.includes('mouth')) detectedId = 'mouth';

                      if (detectedId) {
                        setSelectedOrgan(DIGESTIVE_DATA[detectedId]);
                        setIsQuizMode(false);
                      }
                    }
                  }
                });
              }
            });

            // Handle annotations
            api.addEventListener('annotationSelect', (index: number) => {
              if (index >= 0) {
                const ids = Object.keys(DIGESTIVE_DATA);
                if (index < ids.length) {
                  setSelectedOrgan(DIGESTIVE_DATA[ids[index]]);
                  setIsQuizMode(false);
                }
              }
            });
          });
        },
        error: () => console.error('Sketchfab API error'),
        autostart: 1,
        transparent: 1,
        ui_controls: 1,
        ui_infos: 0,
        ui_watermark: 0,
        annotations_visible: 1
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [viewerApi]);

  const handleOrganSelect = (id: string) => {
    setIsQuizMode(false);
    const organ = DIGESTIVE_DATA[id];
    setSelectedOrgan(organ);
    
    if (viewerApi) {
      viewerApi.gotoAnnotation(organ.annotationId - 1);
    }
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    setSelectedOrgan(null);
    setCurrentQuiz(Math.floor(Math.random() * DIGESTIVE_QUIZ.length));
    setShowQuizResult(null);
  };

  const checkAnswer = (answer: string) => {
    if (answer === DIGESTIVE_QUIZ[currentQuiz].answer) {
      setShowQuizResult("correct");
    } else {
      setShowQuizResult("wrong");
    }
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-khtn8-pastel flex font-sans text-slate-800 overflow-hidden">
      {/* 3D View Area */}
      <div className="flex-1 relative p-4 bg-transparent">
        <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 transition-all shadow-md border border-slate-200">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-200 flex items-center gap-2 shadow-sm">
            <UtensilsCrossed className="w-5 h-5 text-orange-600" />
            <span className="font-bold text-orange-700 tracking-wide uppercase text-sm">Hệ Tiêu Hóa 3D</span>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 transition-all shadow-md border border-slate-200"
          >
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </button>
        </div>

        <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-200 bg-[#0f172a] relative shadow-lg">
          <iframe 
            ref={iframeRef}
            title="Human Digestive System" 
            src="https://sketchfab.com/models/053bab50888840afbbe24c361887c8f9/embed?autostart=1&preload=1&ui_controls=0&ui_infos=0&transparent=1"
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; xr-spatial-tracking"
          />
          
          {/* Quick Selector */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 p-3 card-khtn8-light w-[95%] max-w-4xl rounded-2xl overflow-x-auto">
            {Object.keys(DIGESTIVE_DATA).map((id) => (
              <button
                key={id}
                onClick={() => handleOrganSelect(id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap uppercase tracking-wider ${
                  selectedOrgan?.name === DIGESTIVE_DATA[id].name
                  ? 'bg-orange-600 border-orange-500 text-white shadow-md scale-105'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {DIGESTIVE_DATA[id].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Panel */}
      <div className="w-[450px] bg-white border-l border-slate-200/80 flex flex-col shadow-2xl z-20 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-linear-to-r from-orange-50/50 to-amber-50/50 relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-4 ring-orange-500/10">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">Trợ lý Tiêu Hóa</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Phòng Lab Sinh Học</span>
              </div>
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-medium italic">
            "Thức ăn là năng lượng! Hãy cùng mình tìm hiểu hành trình của một mẩu bánh mì từ lúc ăn vào đến khi ra ngoài nhé!"
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {isQuizMode ? (
              <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6">
                  <h3 className="text-orange-600 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> Câu hỏi hóc búa
                  </h3>
                  <p className="text-slate-800 text-lg font-bold mb-6">
                    {DIGESTIVE_QUIZ[currentQuiz].question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {DIGESTIVE_QUIZ[currentQuiz].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => checkAnswer(opt)}
                        className="w-full p-4 rounded-xl bg-white border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 text-slate-700 text-left transition-all text-sm font-bold shadow-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {showQuizResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-2xl border ${showQuizResult === "correct" ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {showQuizResult === "correct" ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                        <h4 className={`font-black uppercase ${showQuizResult === "correct" ? 'text-emerald-600' : 'text-red-600'}`}>
                          {showQuizResult === "correct" ? "Chính xác!" : "Sai mất rồi!"}
                        </h4>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed italic mb-4">"{DIGESTIVE_QUIZ[currentQuiz].fact}"</p>
                      <button onClick={startQuiz} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest">Câu hỏi khác</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : selectedOrgan ? (
              <motion.div key={selectedOrgan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-8 rounded-4xl border-2 bg-slate-50 relative overflow-hidden shadow-xl border-orange-200`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-black text-orange-600">{selectedOrgan.name}</h2>
                    <Droplets className="text-orange-600 w-8 h-8 opacity-50" />
                  </div>
                  
                  <div className="flex gap-3 mb-6">
                    <Activity className="w-5 h-5 text-slate-500 shrink-0 mt-1" />
                    <p className="text-slate-700 font-bold leading-relaxed">{selectedOrgan.action}</p>
                  </div>
 
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 shadow-xs">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Sự thật thú vị
                    </h5>
                    <p className="text-slate-600 text-sm italic leading-relaxed">"{selectedOrgan.did_you_know}"</p>
                  </div>
 
                  <div className="p-4 bg-amber-50/5 border border-amber-200 rounded-2xl">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Thử thách:</h5>
                    <p className="text-slate-700 text-xs italic">"{selectedOrgan.quiz_challenge}"</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                <Coffee className="w-12 h-12 text-slate-400 mb-4 animate-bounce" />
                <h3 className="text-slate-700 font-bold">Bắt đầu hành trình tiêu hóa</h3>
                <p className="text-slate-500 text-xs mt-2">Chọn một cơ quan trên mô hình 3D hoặc bảng điều khiển để khám phá.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
 
        <div className="p-8 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
          <button onClick={startQuiz} className="flex items-center justify-center gap-2 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-md shadow-orange-600/10 text-xs uppercase tracking-widest">
            <BrainCircuit className="w-4 h-4" /> Đố vui
          </button>
          <button onClick={() => { setSelectedOrgan(null); setIsQuizMode(false); }} className="flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all border border-slate-200 text-xs uppercase tracking-widest">
            <Info className="w-4 h-4" /> Khám phá
          </button>
        </div>
      </div>
    </div>
  );
}
