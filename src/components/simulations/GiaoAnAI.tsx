import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileText, Cpu, CheckCircle, Download, Loader2, AlertTriangle, Play } from 'lucide-react';
import { extractTextFromDocx, generateAICompetencies, insertCompetenciesIntoDocx } from '../../utils/docxEditor';

export function GiaoAnAI({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [previewData, setPreviewData] = useState<{ nangLucSo: string[], nangLucAI: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith('.docx')) {
        setError('Vui lòng chọn file Word định dạng .docx');
        return;
      }
      setFile(selectedFile);
      setResultBlob(null);
      setPreviewData(null);
      setError(null);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      setStep('Đang đọc nội dung giáo án...');
      const text = await extractTextFromDocx(file);
      
      setStep('AI đang phân tích và viết nội dung...');
      const aiData = await generateAICompetencies(text);
      setPreviewData(aiData);

      setStep('Đang cấu trúc lại mã XML để chèn vào file Word...');
      const newBlob = await insertCompetenciesIntoDocx(file, aiData.nangLucSo, aiData.nangLucAI);
      setResultBlob(newBlob);

      setStep('Hoàn tất!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.docx', '_AI_Integrated.docx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 flex flex-col font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center mb-8 relative z-10">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-cyan-400">
            Trợ lý Nâng cấp Giáo án AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">Tự động phân tích và bổ sung "Năng lực số" & "Năng lực AI" vào đúng chuẩn mẫu KHTN.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full relative z-10">
        {/* Left Column: Upload & Processing */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl backdrop-blur-md shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              1. Tải lên giáo án (.docx)
            </h2>
            
            <input 
              type="file" 
              accept=".docx" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            <div 
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all
                ${file ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'}
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <FileText className={`w-12 h-12 mb-3 ${file ? 'text-blue-400' : 'text-slate-500'}`} />
              {file ? (
                <>
                  <p className="text-blue-300 font-bold text-lg truncate w-full px-4">{file.name}</p>
                  <p className="text-slate-400 text-sm mt-1">Nhấn để chọn file khác</p>
                </>
              ) : (
                <>
                  <p className="text-slate-300 font-bold text-lg">Kéo thả hoặc nhấn để chọn file</p>
                  <p className="text-slate-500 text-sm mt-1">Chỉ hỗ trợ file Word (.docx)</p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <button
              onClick={processFile}
              disabled={!file || isProcessing}
              className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                ${!file || isProcessing 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white hover:shadow-cyan-500/25'}
              `}
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {step}</>
              ) : (
                <><Cpu className="w-5 h-5" /> Bắt đầu Phân tích & Nâng cấp</>
              )}
            </button>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 p-5 rounded-2xl text-sm text-slate-400 leading-relaxed">
            <strong className="text-cyan-400 block mb-2">💡 Nguyên lý hoạt động:</strong>
            Hệ thống sẽ đọc nội dung giáo án để gửi cho Gemini AI phân tích. Sau khi có kết quả, hệ thống tự động tìm vị trí "2. Năng lực" để chèn nối tiếp các đoạn văn bản chứa năng lực số và AI mới vào mã nguồn XML của file Word, giúp giữ nguyên 100% định dạng bảng biểu và hình ảnh của bạn!
          </div>
        </div>

        {/* Right Column: Preview & Download */}
        <div className="flex-[1.2] flex flex-col">
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl backdrop-blur-md shadow-xl flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              2. Kết quả & Tải xuống
            </h2>

            {!previewData ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl bg-slate-900/30 p-8 text-center">
                <Play className="w-12 h-12 mb-3 text-slate-600 opacity-50" />
                <p>Kết quả từ AI sẽ hiển thị ở đây để bạn kiểm duyệt trước khi tải xuống file Word.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar mb-6">
                  {/* Digital Competence Preview */}
                  <div className="bg-blue-950/30 border border-blue-900/50 rounded-2xl p-5">
                    <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">c</span>
                      Năng lực số
                    </h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      {previewData.nangLucSo.map((item, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-blue-500 mt-0.5 font-bold">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Competence Preview */}
                  <div className="bg-cyan-950/30 border border-cyan-900/50 rounded-2xl p-5">
                    <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                      <span className="bg-cyan-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">d</span>
                      Năng lực AI (Trí tuệ nhân tạo)
                    </h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      {previewData.nangLucAI.map((item, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-cyan-500 mt-0.5 font-bold">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {resultBlob && (
                  <button
                    onClick={handleDownload}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 hover:-translate-y-1"
                  >
                    <Download className="w-5 h-5" />
                    Tải Xuống Giáo Án Đã Chỉnh Sửa (.docx)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
