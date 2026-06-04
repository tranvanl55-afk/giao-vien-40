import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Image as ImageIcon, Settings, Plus, Minus, History, Rocket, GraduationCap, CheckCircle2, ChevronLeft, FileText, Download, RefreshCw } from 'lucide-react';
import { Type } from "@google/genai";
import { getGeminiClient, getGeminiApiKey } from '../../lib/gemini';


interface TaoDeKiemTraAppProps {
  onBack: () => void;
}

type Step = 1 | 2 | 3 | 4;

export function TaoDeKiemTraApp({ onBack }: TaoDeKiemTraAppProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedText, setParsedText] = useState("Bảng điện trở suất ở 20°C của một số chất:\nKim loại:\n- Bạc: 1,6.10^-8 (Ω.m)\n- Đồng: 1,7.10^-8 (Ω.m)\n- Nhôm: 2,8.10^-8 (Ω.m)\n- Vônfram: 5,5.10^-8 (Ω.m)\n- Sắt: 12,0.10^-8 (Ω.m)\n\nHợp kim:\n- Nikêlin: 0,4.10^-6 (Ω.m)\n- Manganin: 0,43.10^-6 (Ω.m)\n- Constantan: 0,5.10^-6 (Ω.m)\n- Nicrom: 1,1.10^-6 (Ω.m)");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<{
    mcq: Array<{ question: string, options: string[], correctAnswerIndex: number }>,
    tf: Array<{ question: string, statements: Array<{ text: string, isTrue: boolean }> }>,
    essay: Array<{ question: string, suggestedAnswer: string }>
  }>({ mcq: [], tf: [], essay: [] });

  const [studentAnswersMcq, setStudentAnswersMcq] = useState<Record<number, number>>({});
  const [studentAnswersTf, setStudentAnswersTf] = useState<Record<number, Record<number, boolean>>>({});
  const [studentAnswersEssay, setStudentAnswersEssay] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Config state
  const [difficulty, setDifficulty] = useState<'co-ban' | 'kha' | 'nang-cao'>('co-ban');
  const [mcqCount, setMcqCount] = useState(5);
  const [tfCount, setTfCount] = useState(0);
  const [essayCount, setEssayCount] = useState(0);

  const handleUploadClick = () => {
    // Trigger file input click
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const match = selectedImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!match) throw new Error("Invalid image format");
      
      const mimeType = match[1];
      const base64Data = match[2];

      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        alert("Tài khoản của bạn yêu cầu nhập Gemini API Key để sử dụng tính năng AI này. Vui lòng đăng nhập lại!");
        setIsAnalyzing(false);
        return;
      }
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: "Trích xuất toàn bộ văn bản có ý nghĩa (bao gồm cả bảng) trong hình ảnh này. Chỉ trả về phần văn bản, không cần thêm lời bình." },
            { inlineData: { data: base64Data, mimeType } }
          ]
        }
      });
      setParsedText(response.text || "");
      setStep(3);
    } catch (e) {
      console.error("OCR Error:", e);
      alert("Lỗi khi phân tích ảnh. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateClick = async () => {
    if (totalQuestions === 0) {
      alert("Vui lòng chọn ít nhất 1 câu hỏi!");
      return;
    }
    setIsGenerating(true);
    try {
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        alert("Tài khoản của bạn yêu cầu nhập Gemini API Key để sử dụng tính năng AI này. Vui lòng đăng nhập lại!");
        setIsGenerating(false);
        return;
      }
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Tạo đề thi dựa vào nội dung văn bản sau đây:\n\n${parsedText}\n\nYêu cầu phân bổ:\n- Số câu trắc nghiệm (1 đáp án đúng): ${mcqCount}\n- Số câu Đúng/Sai (mỗi câu 4 phát biểu): ${tfCount}\n- Số câu tự luận: ${essayCount}\n\nTất cả câu hỏi PHẢI dựa trực tiếp trên nội dung được cung cấp. Không sử dụng kiến thức bên ngoài. Các phương án phải mang ý nghĩa.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mcq: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Phải có đúng 4 phương án"
                    },
                    correctAnswerIndex: { type: Type.INTEGER, description: "Index của phương án đúng (0-3)" }
                  }
                }
              },
              tf: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    statements: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          isTrue: { type: Type.BOOLEAN, description: "Phát biểu này đúng hay sai?" }
                        }
                      },
                      description: "Phải có đúng 4 phát biểu"
                    }
                  }
                }
              },
              essay: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    suggestedAnswer: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      const jsonStr = response.text || "{}";
      const parsedData = JSON.parse(jsonStr);

      setGeneratedTest({
        mcq: parsedData.mcq || [],
        tf: parsedData.tf || [],
        essay: parsedData.essay || []
      });
      setStudentAnswersMcq({});
      setStudentAnswersTf({});
      setStudentAnswersEssay({});
      setIsSubmitted(false);
      setScore(0);
      setStep(4);
    } catch (e) {
      console.error("Generate error:", e);
      alert("Lỗi khi tạo đề. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let totalScore = 0;
    const mcqWeight = mcqCount > 0 ? (tfCount > 0 || essayCount > 0 ? 4 : 10) : 0; 
    const tfWeight = tfCount > 0 ? (mcqCount > 0 || essayCount > 0 ? 4 : 10) : 0;
    
    let mcqEarned = 0;
    generatedTest.mcq.forEach((q, i) => {
      if (studentAnswersMcq[i] === q.correctAnswerIndex) {
        mcqEarned += 1;
      }
    });

    let tfEarned = 0;
    generatedTest.tf.forEach((q, i) => {
      let correctStatements = 0;
      q.statements.forEach((s, sIdx) => {
        if (studentAnswersTf[i]?.[sIdx] === s.isTrue) {
          correctStatements += 1;
        }
      });
      // Example scoring for TF: all 4 correct = 1 pt. Here we just give partial.
      tfEarned += (correctStatements / 4);
    });

    // Score on 10 point scale (excluding essay for auto-scoring)
    let autoScoreMax = mcqCount + tfCount;
    let autoScoreEarned = mcqEarned + tfEarned;
    
    if (autoScoreMax > 0) {
      setScore(Math.round((autoScoreEarned / autoScoreMax) * 10 * 10) / 10);
    } else {
      setScore(0);
    }

    setIsSubmitted(true);
  };

  const totalQuestions = mcqCount + tfCount + essayCount;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-10 w-full">
        <div className="flex items-center space-x-4">
           <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
             <ChevronLeft className="w-6 h-6" />
           </button>
           <div className="flex items-center space-x-2">
             <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
               <GraduationCap className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 flex items-center">
               <span className="text-red-500 mr-1">Ôn tập vui</span> <Rocket className="w-6 h-6 text-purple-500" />
             </h1>
           </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full font-medium transition-colors shadow-sm">
          <History className="w-5 h-5" />
          <span className="hidden sm:inline">Lịch sử</span>
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 relative">
        <AnimatePresence mode="wait">
          {step <= 2 && (
            <motion.div
              key="step1-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center flex-1"
            >
              {/* Left Column */}
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                    <span className="text-slate-900 block">Học tập thông minh</span>
                    <span className="text-purple-600 block mt-2">Ôn thi hiệu quả</span>
                  </h2>
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                    Tải lên ảnh chụp sách giáo khoa hoặc tài liệu. AI sẽ phân tích và tạo ngay đề kiểm tra trắc nghiệm, tự luận giúp bạn ôn tập thần tốc.
                  </p>
                </div>

                {/* Upload Section */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <motion.div 
                  layout
                  className={`bg-white rounded-3xl p-8 shadow-sm transition-all border-2 border-dashed ${step === 1 ? 'border-purple-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer group' : 'border-slate-100 bg-slate-50'}`}
                  onClick={step === 1 ? handleUploadClick : undefined}
                >
                  {step === 1 ? (
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Tải lên tài liệu học tập</h3>
                        <p className="text-slate-500 whitespace-pre-line leading-relaxed">
                          Chụp ảnh sách giáo khoa, vở ghi hoặc tài liệu PDF (dạng ảnh).
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-6">
                      <div className="flex items-center space-x-3 text-slate-800">
                        <ImageIcon className="w-6 h-6 text-purple-600" />
                        <h3 className="text-xl font-bold">Đã chọn 1 ảnh</h3>
                      </div>
                      
                      <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-sm">
                        <img 
                          src={selectedImage!} 
                          alt="Uploaded document" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <button 
                        onClick={handleAnalyzeClick}
                        disabled={isAnalyzing}
                        className={`w-full py-4 text-white font-bold rounded-2xl text-lg shadow-lg shadow-purple-200 transition-all flex items-center justify-center space-x-2 ${isAnalyzing ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] active:scale-95'}`}
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            <span>Đang phân tích AI...</span>
                          </>
                        ) : (
                          <span>Phân tích nội dung</span>
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>

                {step === 1 && (
                  <div className="flex items-center space-x-2 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Hệ thống đã sẵn sàng kết nối AI.</span>
                  </div>
                )}
              </div>

              <div className="hidden lg:block relative h-full min-h-[500px]">
                <div className="absolute inset-0 bg-linear-to-tr from-purple-100 to-orange-50 rounded-[40px] transform rotate-3 scale-105 opacity-70"></div>
                <div className="relative h-full w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" 
                    alt="Students studying" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating Badge */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl flex items-center space-x-4 border border-white/50"
                  >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-xl">
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Analysis</div>
                      <div className="font-bold text-slate-800 text-lg">Ready to Scan</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto w-full pt-8"
            >
              <div className="bg-white rounded-[32px] shadow-xl p-8 md:p-12 border border-slate-100">
                <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Settings className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">Cấu hình Đề thi</h2>
                    <p className="text-slate-500 mt-1">Tuỳ chỉnh thông số để AI tạo đề phù hợp nhất.</p>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Parsed Content Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                        <span>Nội dung đã phân tích</span>
                      </h3>
                      <div className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>AI OCR Success</span>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea 
                        value={parsedText}
                        onChange={(e) => setParsedText(e.target.value)}
                        className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-y custom-scrollbar"
                        placeholder="Nội dung trống. Hãy thử lại..."
                      />
                      <p className="text-xs text-slate-400 mt-2">Bạn có thể chỉnh sửa nội dung này để đề thi chính xác hơn.</p>
                    </div>
                  </div>
                  {/* Difficulty Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                      <span>Mức độ kiến thức</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'co-ban', label: 'Cơ bản', desc: '70% Nhận biết - Dễ' },
                        { id: 'kha', label: 'Khá', desc: 'Vận dụng & Thông hiểu' },
                        { id: 'nang-cao', label: 'Nâng cao', desc: 'Tư duy & Vận dụng cao' }
                      ].map((level) => (
                        <div 
                          key={level.id}
                          onClick={() => setDifficulty(level.id as any)}
                          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            difficulty === level.id 
                            ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100' 
                            : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`font-bold text-lg ${difficulty === level.id ? 'text-purple-800' : 'text-slate-700'}`}>
                              {level.label}
                            </span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              difficulty === level.id ? 'border-purple-500 bg-white' : 'border-slate-300'
                            }`}>
                              {difficulty === level.id && <div className="w-3 h-3 rounded-full bg-purple-500" />}
                            </div>
                          </div>
                          <span className={`text-sm ${difficulty === level.id ? 'text-purple-600' : 'text-slate-500'}`}>
                            {level.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Question Types Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                      <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                      <span>Số lượng câu hỏi theo dạng</span>
                    </h3>
                    
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 sm:p-6 space-y-4">
                      {/* MCQ Row */}
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="font-bold text-slate-700">Trắc nghiệm (4 lựa chọn)</span>
                        <div className="flex items-center space-x-4">
                           <button 
                             onClick={() => setMcqCount(Math.max(0, mcqCount - 1))}
                             className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                           >
                             <Minus className="w-5 h-5" />
                           </button>
                           <span className="w-8 text-center font-bold text-xl text-purple-700">{mcqCount}</span>
                           <button 
                             onClick={() => setMcqCount(mcqCount + 1)}
                             className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-700 transition-colors"
                           >
                             <Plus className="w-5 h-5" />
                           </button>
                        </div>
                      </div>

                      {/* True/False Row */}
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="font-bold text-slate-700">Đúng / Sai</span>
                        <div className="flex items-center space-x-4">
                           <button 
                             onClick={() => setTfCount(Math.max(0, tfCount - 1))}
                             className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                           >
                             <Minus className="w-5 h-5" />
                           </button>
                           <span className="w-8 text-center font-bold text-xl text-purple-700">{tfCount}</span>
                           <button 
                             onClick={() => setTfCount(tfCount + 1)}
                             className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-700 transition-colors"
                           >
                             <Plus className="w-5 h-5" />
                           </button>
                        </div>
                      </div>

                      {/* Essay Row */}
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="font-bold text-slate-700">Tự luận</span>
                        <div className="flex items-center space-x-4">
                           <button 
                             onClick={() => setEssayCount(Math.max(0, essayCount - 1))}
                             className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                           >
                             <Minus className="w-5 h-5" />
                           </button>
                           <span className="w-8 text-center font-bold text-xl text-purple-700">{essayCount}</span>
                           <button 
                             onClick={() => setEssayCount(essayCount + 1)}
                             className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-700 transition-colors"
                           >
                             <Plus className="w-5 h-5" />
                           </button>
                        </div>
                      </div>

                      <div className="text-right pt-2 px-2">
                        <span className="text-slate-500 font-medium">Tổng cộng: </span>
                        <span className="text-lg font-black text-slate-800">{totalQuestions} câu hỏi</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerateClick}
                    disabled={isGenerating}
                    className={`w-full py-5 rounded-2xl text-white font-black text-xl shadow-xl transition-all flex items-center justify-center space-x-3 ${isGenerating ? 'bg-linear-to-r from-purple-400 to-indigo-400 cursor-not-allowed shadow-none' : 'bg-linear-to-r from-purple-600 to-indigo-600 shadow-purple-300 hover:shadow-2xl hover:shadow-purple-400 hover:scale-[1.01] active:scale-95'}`}
                  >
                     {isGenerating ? (
                       <>
                         <RefreshCw className="w-6 h-6 animate-spin" />
                         <span>ĐANG SOẠN ĐỀ...</span>
                       </>
                     ) : (
                       <span>TẠO ĐỀ THI NGAY</span>
                     )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto w-full pt-8 pb-16"
            >
              <div className="bg-white rounded-[32px] shadow-xl p-8 md:p-12 border border-slate-100 mb-8">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-800">Đề kiểm tra ôn tập</h2>
                      <p className="text-slate-500 mt-1">Được tạo tự động bởi AI</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium flex items-center space-x-2 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Tạo mới</span>
                    </button>
                    <button className="px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold flex items-center space-x-2 transition-colors shadow-md shadow-purple-200">
                      <Download className="w-4 h-4" />
                      <span>Lưu & Tải PDF</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Generated Question List */}
                  {generatedTest.mcq.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold border-b-2 border-slate-100 pb-2 text-slate-800">I. TRẮC NGHIỆM ({generatedTest.mcq.length} câu)</h3>
                      {generatedTest.mcq.map((q, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="font-bold text-slate-800 mb-4">Câu {i + 1}: {q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = studentAnswersMcq[i] === optIdx;
                              const isCorrect = isSubmitted && q.correctAnswerIndex === optIdx;
                              const isWrong = isSubmitted && isSelected && q.correctAnswerIndex !== optIdx;
                              
                              let btnClass = "border-slate-200 hover:border-purple-300 hover:bg-purple-50 bg-white";
                              if (isSubmitted) {
                                if (isCorrect) btnClass = "border-green-500 bg-green-50";
                                else if (isWrong) btnClass = "border-red-500 bg-red-50";
                                else btnClass = "border-slate-200 bg-white opacity-60";
                              } else if (isSelected) {
                                btnClass = "border-purple-500 bg-purple-50 ring-2 ring-purple-200";
                              }
                              
                              return (
                                <div 
                                  key={optIdx} 
                                  onClick={() => !isSubmitted && setStudentAnswersMcq({...studentAnswersMcq, [i]: optIdx})}
                                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${btnClass}`}
                                >
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isSubmitted && isCorrect ? 'bg-green-500 text-white' : isSubmitted && isWrong ? 'bg-red-500 text-white' : isSelected ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    {['A', 'B', 'C', 'D'][optIdx]}
                                  </div>
                                  <span className={`text-slate-700 ${isSubmitted && isCorrect ? 'font-bold' : ''}`}>{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {generatedTest.tf.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold border-b-2 border-slate-100 pb-2 text-slate-800 pt-6">II. ĐÚNG/SAI ({generatedTest.tf.length} câu)</h3>
                      {generatedTest.tf.map((q, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="font-bold text-slate-800 mb-4">Câu {i + 1}: {q.question}</p>
                          <div className="space-y-3">
                            {q.statements.map((stmt, stmtIdx) => {
                              const selectedTrue = studentAnswersTf[i]?.[stmtIdx] === true;
                              const selectedFalse = studentAnswersTf[i]?.[stmtIdx] === false;
                              const isCorrectAnswer = stmt.isTrue;
                              
                              let trueBtnClass = "border-slate-200 text-slate-600 hover:bg-slate-100";
                              let falseBtnClass = "border-slate-200 text-slate-600 hover:bg-slate-100";
                              
                              if (isSubmitted) {
                                if (isCorrectAnswer) trueBtnClass = "border-green-500 bg-green-50 text-green-700 font-bold";
                                else if (selectedTrue) trueBtnClass = "border-red-500 bg-red-50 text-red-700";
                                
                                if (!isCorrectAnswer) falseBtnClass = "border-green-500 bg-green-50 text-green-700 font-bold";
                                else if (selectedFalse) falseBtnClass = "border-red-500 bg-red-50 text-red-700";
                              } else {
                                if (selectedTrue) trueBtnClass = "border-purple-500 bg-purple-50 text-purple-700 border-2 font-bold";
                                if (selectedFalse) falseBtnClass = "border-purple-500 bg-purple-50 text-purple-700 border-2 font-bold";
                              }
                              
                              return (
                                <div key={stmtIdx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                  <div className="flex items-center space-x-3 pr-4">
                                    <span className="font-bold text-slate-500 w-6">{['a', 'b', 'c', 'd'][stmtIdx]}.</span>
                                    <span className="text-slate-700">{stmt.text}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 shrink-0">
                                    <button 
                                      onClick={() => !isSubmitted && setStudentAnswersTf(prev => ({...prev, [i]: {...(prev[i]||{}), [stmtIdx]: true}}))}
                                      className={`px-4 py-1.5 rounded-lg border font-medium text-sm transition-colors ${trueBtnClass}`}
                                    >Đ</button>
                                    <button 
                                      onClick={() => !isSubmitted && setStudentAnswersTf(prev => ({...prev, [i]: {...(prev[i]||{}), [stmtIdx]: false}}))}
                                      className={`px-4 py-1.5 rounded-lg border font-medium text-sm transition-colors ${falseBtnClass}`}
                                    >S</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {generatedTest.essay.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold border-b-2 border-slate-100 pb-2 text-slate-800 pt-6">III. TỰ LUẬN ({generatedTest.essay.length} câu)</h3>
                      {generatedTest.essay.map((q, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="font-bold text-slate-800 mb-4">Câu {i + 1}: {q.question}</p>
                          <textarea 
                            disabled={isSubmitted}
                            value={studentAnswersEssay[i] || ""}
                            onChange={(e) => setStudentAnswersEssay({...studentAnswersEssay, [i]: e.target.value})}
                            className="bg-white rounded-xl border border-slate-200 w-full p-4 text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none resize-y min-h-[120px]"
                            placeholder="Nhập câu trả lời của bạn vào đây..."
                          />
                          {isSubmitted && q.suggestedAnswer && (
                            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                              <p className="font-bold text-emerald-800 mb-1">Gợi ý đáp án:</p>
                              <p className="text-emerald-700 text-sm whitespace-pre-line">{q.suggestedAnswer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {!isSubmitted ? (
                    <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
                      <button 
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-lg shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Nộp bài & Chấm điểm</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-8 pt-8 border-t border-slate-100 bg-slate-50 -mx-8 sm:-mx-12 px-8 sm:px-12 pb-8 rounded-b-[32px]">
                      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 flex items-center justify-between border-2 border-purple-100">
                        <div>
                          <h3 className="text-2xl font-black text-slate-800">Kết quả bài làm</h3>
                          <p className="text-slate-500 mt-1">Phần tự luận sẽ do giáo viên chấm thủ công.</p>
                        </div>
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-100 to-indigo-100 flex items-center justify-center border-4 border-white shadow-md">
                          <span className="text-3xl font-black text-purple-700">{score}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
