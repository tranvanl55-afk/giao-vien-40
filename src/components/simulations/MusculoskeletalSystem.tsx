import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Activity, Info, HelpCircle, 
  Dna, AlertCircle, CheckCircle2, XCircle, 
  BrainCircuit, Sparkles, Maximize, Minimize,
  Dumbbell, Bone
} from 'lucide-react';

interface PartInfo {
  name: string;
  type: 'bone' | 'muscle';
  action: string;
  did_you_know: string;
  quiz_challenge: string;
  style_hint: string;
  annotationId: number;
}

const MUSCLE_BONE_DATA: Record<string, PartInfo> = {
  cranium: {
    name: "Xương sọ não",
    type: "bone",
    action: "Bảo vệ não bộ khỏi các tác động vật lý mạnh.",
    did_you_know: "Xương sọ của trẻ sơ sinh không phải một khối liền mà gồm các thóp để não có thể phát triển.",
    quiz_challenge: "Có bao nhiêu xương chính cấu tạo nên hộp sọ não của người trưởng thành?",
    style_hint: "indigo",
    annotationId: 1
  },
  facial: {
    name: "Xương sọ mặt",
    type: "bone",
    action: "Tạo khung cho khuôn mặt và bảo vệ các giác quan như mắt, mũi.",
    did_you_know: "Xương hàm dưới là xương duy nhất trong hộp sọ có thể cử động được.",
    quiz_challenge: "Xương nào là xương cứng nhất và khỏe nhất trên khuôn mặt?",
    style_hint: "cyan",
    annotationId: 2
  },
  sternum: {
    name: "Xương ức",
    type: "bone",
    action: "Điểm tựa phía trước cho các xương sườn, bảo vệ tim và phổi.",
    did_you_know: "Xương ức còn được gọi là 'xương cà vạt' vì hình dáng của nó.",
    quiz_challenge: "Bấm lồng ngực khi cấp cứu (CPR) là tác động lực trực tiếp lên xương nào?",
    style_hint: "emerald",
    annotationId: 3
  },
  ribs: {
    name: "Xương sườn",
    type: "bone",
    action: "Cùng với xương sống và xương ức tạo thành lồng ngực bảo vệ nội tạng.",
    did_you_know: "Hầu hết mọi người có 12 đôi xương sườn, nhưng một số người có thêm một 'xương sườn cổ'.",
    quiz_challenge: "Có bao nhiêu đôi xương sườn được gọi là 'xương sườn cụt'?",
    style_hint: "blue",
    annotationId: 4
  },
  spine: {
    name: "Xương sống",
    type: "bone",
    action: "Trục đỡ chính của cơ thể, bảo vệ tủy sống và giúp cơ thể linh hoạt.",
    did_you_know: "Các phi hành gia có thể cao thêm tới 5cm sau khi ở trong không gian vì cột sống dãn ra!",
    quiz_challenge: "Cột sống người được chia làm mấy phần chính?",
    style_hint: "amber",
    annotationId: 5
  },
  arm_bones: {
    name: "Xương tay",
    type: "bone",
    action: "Tạo đòn bẩy cho các hoạt động cầm nắm và vận động phức tạp.",
    did_you_know: "Xương cánh tay là một trong những xương dài nhất cơ thể.",
    quiz_challenge: "Tên của hai xương ở cẳng tay là gì?",
    style_hint: "rose",
    annotationId: 6
  },
  leg_bones: {
    name: "Xương chân",
    type: "bone",
    action: "Nâng đỡ toàn bộ trọng lượng cơ thể và thực hiện di chuyển.",
    did_you_know: "Xương đùi là xương lớn nhất, dài nhất và khỏe nhất trong cơ thể người.",
    quiz_challenge: "Xương bánh chè nằm ở vị trí nào của chân?",
    style_hint: "orange",
    annotationId: 7
  },
  head_muscles: {
    name: "Cơ đầu",
    type: "muscle",
    action: "Tạo ra các biểu cảm khuôn mặt và hỗ trợ việc nhai.",
    did_you_know: "Bạn cần ít cơ hơn để cười (17 cơ) so với khi cau mày (43 cơ) đấy!",
    quiz_challenge: "Cơ nào là cơ khỏe nhất trong cơ thể dựa trên trọng lượng của nó (nằm ở hàm)?",
    style_hint: "violet",
    annotationId: 8
  },
  torso_muscles: {
    name: "Cơ thân",
    type: "muscle",
    action: "Duy trì tư thế thẳng đứng và bảo vệ các cơ quan nội tạng.",
    did_you_know: "Cơ bụng không chỉ giúp bạn có '6 múi' mà còn hỗ trợ việc hít thở.",
    quiz_challenge: "Cơ hoành (ngăn cách ngực và bụng) thuộc nhóm cơ nào?",
    style_hint: "teal",
    annotationId: 9
  },
  arm_muscles: {
    name: "Cơ tay",
    type: "muscle",
    action: "Thực hiện các động tác kéo, đẩy và xoay cánh tay.",
    did_you_know: "Cơ nhị đầu (chuột) và cơ tam đầu luôn hoạt động đối kháng nhau để gập/duỗi tay.",
    quiz_challenge: "Khi bạn gập tay lại, cơ nhị đầu đang co hay duỗi?",
    style_hint: "red",
    annotationId: 10
  },
  leg_muscles: {
    name: "Cơ chân",
    type: "muscle",
    action: "Nhóm cơ lớn nhất giúp đi bộ, chạy và nhảy.",
    did_you_know: "Cơ mông lớn (Gluteus Maximus) là cơ rộng nhất trong cơ thể bạn.",
    quiz_challenge: "Cơ nào ở bắp chân giúp bạn có thể kiễng gót lên?",
    style_hint: "lime",
    annotationId: 11
  }
};

const BONE_QUIZ = [
  {
    question: "Xương nào dài nhất và khỏe nhất trong cơ thể người?",
    options: ["Xương cánh tay", "Xương sống", "Xương đùi", "Xương chậu"],
    answer: "Xương đùi",
    fact: "Xương đùi có thể chịu được trọng lượng gấp 30 lần trọng lượng cơ thể bạn!"
  },
  {
    question: "Cơ thể người trưởng thành có bao nhiêu chiếc xương?",
    options: ["206", "300", "150", "280"],
    answer: "206",
    fact: "Khi mới sinh ra, bạn có khoảng 270 chiếc xương, sau đó một số xương sẽ hợp nhất lại."
  },
  {
    question: "Xương nào bảo vệ tim và phổi?",
    options: ["Xương sống", "Lồng ngực", "Xương chậu", "Xương sọ"],
    answer: "Lồng ngực",
    fact: "Lồng ngực gồm xương sườn, xương ức và xương sống phối hợp với nhau."
  }
];

export function MusculoskeletalSystem({ onBack }: { onBack: () => void }) {
  const [selectedPart, setSelectedPart] = useState<PartInfo | null>(null);
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
      client.init('1ca8af1c3bb94739877cdf2c3582f597', {
        success: (api: any) => {
          api.start();
          api.addEventListener('viewerready', () => {
            setViewerApi(api);
            
            // Listen for clicks on the 3D model
            api.addEventListener('click', (info: any) => {
              if (info.instanceID) {
                api.getNodeMap((err: any, nodes: any) => {
                  if (!err && nodes) {
                    const node = nodes[info.instanceID];
                    if (node && node.name) {
                      const name = node.name.toLowerCase();
                      console.log("Clicked node:", name); // For internal debugging if possible
                      
                      // Enhanced mapping based on common anatomical terms
                      let detectedId = null;
                      if (name.includes('skull') || name.includes('cranium') || name.includes('head_bone')) detectedId = 'cranium';
                      else if (name.includes('face') || name.includes('mandible') || name.includes('maxilla')) detectedId = 'facial';
                      else if (name.includes('sternum') || name.includes('breastbone')) detectedId = 'sternum';
                      else if (name.includes('rib') || name.includes('costal')) detectedId = 'ribs';
                      else if (name.includes('spine') || name.includes('vertebra') || name.includes('column')) detectedId = 'spine';
                      else if (name.includes('humerus') || name.includes('radius') || name.includes('ulna') || name.includes('arm_bone')) detectedId = 'arm_bones';
                      else if (name.includes('femur') || name.includes('tibia') || name.includes('fibula') || name.includes('leg_bone')) detectedId = 'leg_bones';
                      else if (name.includes('muscle')) {
                        if (name.includes('head') || name.includes('temporalis') || name.includes('masseter')) detectedId = 'head_muscles';
                        else if (name.includes('torso') || name.includes('abdom') || name.includes('pectoral') || name.includes('trapezius')) detectedId = 'torso_muscles';
                        else if (name.includes('arm') || name.includes('bicep') || name.includes('tricep') || name.includes('deltoid')) detectedId = 'arm_muscles';
                        else if (name.includes('leg') || name.includes('quad') || name.includes('glute') || name.includes('gastrocnemius')) detectedId = 'leg_muscles';
                      }

                      if (detectedId) {
                        setSelectedPart(MUSCLE_BONE_DATA[detectedId]);
                        setIsQuizMode(false);
                      }
                    }
                  }
                });
              }
            });

            // Listen for annotation selection (many Sketchfab models have pins)
            api.addEventListener('annotationSelect', (index: number) => {
              if (index >= 0) {
                // Map annotation index to our data (assuming order)
                const ids = Object.keys(MUSCLE_BONE_DATA);
                if (index < ids.length) {
                  setSelectedPart(MUSCLE_BONE_DATA[ids[index]]);
                  setIsQuizMode(false);
                }
              }
            });
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
  }, [viewerApi]);

  const handlePartSelect = (id: string) => {
    setIsQuizMode(false);
    const part = MUSCLE_BONE_DATA[id];
    setSelectedPart(part);
    
    if (viewerApi) {
      viewerApi.gotoAnnotation(part.annotationId - 1, { preventCameraAnimation: false, preventCameraMove: false });
    }
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    setSelectedPart(null);
    setCurrentQuiz(Math.floor(Math.random() * BONE_QUIZ.length));
    setShowQuizResult(null);
  };

  const checkAnswer = (answer: string) => {
    if (answer === BONE_QUIZ[currentQuiz].answer) {
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
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 flex items-center gap-2 shadow-sm">
            <Dumbbell className="w-5 h-5 text-emerald-600 animate-bounce" />
            <span className="font-bold text-emerald-700 tracking-wide uppercase text-sm">Hệ Vận Động 3D</span>
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
            title="3D Musculoskeletal system Anatomy" 
            src="https://sketchfab.com/models/1ca8af1c3bb94739877cdf2c3582f597/embed?autostart=1&preload=1&ui_controls=0&ui_infos=0&transparent=1"
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; xr-spatial-tracking"
          />
          
          {/* Quick Selector */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 p-3 card-khtn8-light w-[95%] max-w-4xl rounded-2xl overflow-x-auto max-h-[120px]">
            {Object.keys(MUSCLE_BONE_DATA).map((id) => (
              <button
                key={id}
                onClick={() => handlePartSelect(id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border whitespace-nowrap uppercase tracking-wider ${
                  selectedPart?.name === MUSCLE_BONE_DATA[id].name
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-md scale-105'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {MUSCLE_BONE_DATA[id].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Panel */}
      <div className="w-[450px] bg-white border-l border-slate-200/80 flex flex-col shadow-2xl z-20 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-linear-to-r from-emerald-50/50 to-teal-50/50 relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Bác sĩ Vận Động</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Phân tích 3D</span>
              </div>
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-medium italic">
            "Sức mạnh đến từ sự kết hợp hoàn hảo giữa xương và cơ. Hãy chọn một bộ phận để bắt đầu huấn luyện nhé!"
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {isQuizMode ? (
              <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
                  <h3 className="text-emerald-600 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> Thử thách kiến thức
                  </h3>
                  <p className="text-slate-800 text-lg font-bold mb-6">
                    {BONE_QUIZ[currentQuiz].question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {BONE_QUIZ[currentQuiz].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => checkAnswer(opt)}
                        className="w-full p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 text-left transition-all text-sm font-bold shadow-sm"
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
                          {showQuizResult === "correct" ? "Tuyệt vời!" : "Sai rồi bạn ơi!"}
                        </h4>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed italic mb-4">"{BONE_QUIZ[currentQuiz].fact}"</p>
                      <button onClick={startQuiz} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest">Tiếp tục</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : selectedPart ? (
              <motion.div key={selectedPart.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-8 rounded-4xl border-2 bg-slate-50 relative overflow-hidden shadow-xl ${
                  selectedPart.type === 'bone' ? 'border-emerald-200' : 'border-rose-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-3xl font-black ${
                      selectedPart.type === 'bone' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>{selectedPart.name}</h2>
                    {selectedPart.type === 'bone' ? <Bone className="text-emerald-600" /> : <Activity className="text-rose-600" />}
                  </div>
                  
                  <div className="flex gap-3 mb-6">
                    <Activity className="w-5 h-5 text-slate-550 shrink-0 mt-1" />
                    <p className="text-slate-700 font-bold leading-relaxed">{selectedPart.action}</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 shadow-xs">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Bí mật cơ thể
                    </h5>
                    <p className="text-slate-600 text-sm italic leading-relaxed">"{selectedPart.did_you_know}"</p>
                  </div>

                  <div className="p-4 bg-amber-505/5 border border-amber-200 rounded-2xl">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Thử thách:</h5>
                    <p className="text-slate-705 text-xs italic">"{selectedPart.quiz_challenge}"</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                <Activity className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                <h3 className="text-slate-700 font-bold">Vui lòng chọn một bộ phận</h3>
                <p className="text-slate-500 text-xs mt-2">Dùng bảng điều khiển phía dưới để quan sát chi tiết từng xương và cơ.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
          <button onClick={startQuiz} className="flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-md shadow-emerald-600/10 text-xs uppercase tracking-widest">
            <BrainCircuit className="w-4 h-4" /> Đố vui
          </button>
          <button onClick={() => { setSelectedPart(null); setIsQuizMode(false); }} className="flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all border border-slate-200 text-xs uppercase tracking-widest">
            <Info className="w-4 h-4" /> Khám phá
          </button>
        </div>
      </div>
    </div>
  );
}
