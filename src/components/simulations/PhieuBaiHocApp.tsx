import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, Loader2, Sparkles, NotebookPen, PenTool, Star, Printer, Plus, Link as LinkIcon, X, ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getGeminiClient, getGeminiApiKey } from '../../lib/gemini';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface SketchnoteData {
  subject: string;
  topic: string;
  chapters: {
    chapter_title: string;
    sections: {
      heading: string;
      content: string[];
      illustration_url?: string | null;
      lucide_icon?: string;
    }[];
  }[];
  summary_sticker: string;
}



const ILLUSTRATION_3D_LIBRARY: Record<string, string> = {
  electricity: "https://img.icons8.com/isometric/512/flash-on.png",      // Điện / Năng lượng
  physics: "https://img.icons8.com/isometric/512/physics.png",            // Vật lý / Lực
  chemistry: "https://img.icons8.com/isometric/512/test-tube.png",        // Hóa học
  biology: "https://img.icons8.com/isometric/512/dna-helix.png",          // Sinh học / ADN
  astronomy: "https://img.icons8.com/isometric/512/space-exploration.png",// Thiên văn / Vũ trụ
  botany: "https://img.icons8.com/isometric/512/potted-plant.png",        // Thực vật / Cây cối
  book: "https://img.icons8.com/isometric/512/open-book.png",             // Sách / Tài liệu
  idea: "https://img.icons8.com/isometric/512/idea.png",                  // Ý tưởng / Sáng tạo
  ai: "https://img.icons8.com/isometric/512/processor.png",               // Công nghệ / AI
  exam: "https://img.icons8.com/isometric/512/checked-laptop.png",        // Bài tập / Kiểm tra
  default: "https://img.icons8.com/isometric/512/sparkles.png"            // Mặc định (Lấp lánh)
};

const getIllustrationForNode = (title: string): string => {
  const text = title.toLowerCase();
  if (text.includes("điện") || text.includes("dòng điện") || text.includes("pin") || text.includes("năng lượng") || text.includes("áp")) {
    return ILLUSTRATION_3D_LIBRARY.electricity;
  }
  if (text.includes("lực") || text.includes("vật lý") || text.includes("nhiệt") || text.includes("quang") || text.includes("sóng") || text.includes("âm")) {
    return ILLUSTRATION_3D_LIBRARY.physics;
  }
  if (text.includes("hóa") || text.includes("chất") || text.includes("phản ứng") || text.includes("axit") || text.includes("bazơ") || text.includes("nguyên tử") || text.includes("phân tử")) {
    return ILLUSTRATION_3D_LIBRARY.chemistry;
  }
  if (text.includes("sinh") || text.includes("gen") || text.includes("adn") || text.includes("tế bào") || text.includes("di truyền") || text.includes("cơ thể") || text.includes("tim")) {
    return ILLUSTRATION_3D_LIBRARY.biology;
  }
  if (text.includes("cây") || text.includes("thực vật") || text.includes("hoa") || text.includes("lá") || text.includes("rễ") || text.includes("quang hợp")) {
    return ILLUSTRATION_3D_LIBRARY.botany;
  }
  if (text.includes("vũ trụ") || text.includes("sao") || text.includes("hành tinh") || text.includes("kính thiên văn") || text.includes("trái đất") || text.includes("mặt trời")) {
    return ILLUSTRATION_3D_LIBRARY.astronomy;
  }
  if (text.includes("sách") || text.includes("tài liệu") || text.includes("đọc") || text.includes("lý thuyết") || text.includes("bài học") || text.includes("ghi chép")) {
    return ILLUSTRATION_3D_LIBRARY.book;
  }
  if (text.includes("ý tưởng") || text.includes("sáng tạo") || text.includes("phát minh") || text.includes("giải pháp") || text.includes("suy nghĩ")) {
    return ILLUSTRATION_3D_LIBRARY.idea;
  }
  if (text.includes("ai") || text.includes("công nghệ") || text.includes("máy tính") || text.includes("robot") || text.includes("mạng")) {
    return ILLUSTRATION_3D_LIBRARY.ai;
  }
  if (text.includes("thi") || text.includes("kiểm tra") || text.includes("bài tập") || text.includes("kết quả") || text.includes("điểm")) {
    return ILLUSTRATION_3D_LIBRARY.exam;
  }
  return ILLUSTRATION_3D_LIBRARY.default;
};

export function PhieuBaiHocApp({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SketchnoteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [textbookFile, setTextbookFile] = useState<{file: File, base64: string, mimeType: string} | null>(null);
  const [illustrationUrlInput, setIllustrationUrlInput] = useState('');
  const [illustrationUrls, setIllustrationUrls] = useState<string[]>([]);
  
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageBase64Map, setImageBase64Map] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    
    const urlsToFetch: string[] = [];
    
    data.chapters.forEach(chapter => {
      chapter.sections.forEach(section => {
        const iconUrl = getIllustrationForNode(section.heading);
        if (iconUrl && !urlsToFetch.includes(iconUrl)) {
          urlsToFetch.push(iconUrl);
        }
        if (section.illustration_url && !urlsToFetch.includes(section.illustration_url)) {
          urlsToFetch.push(section.illustration_url);
        }
      });
    });
    
    urlsToFetch.forEach(async (url) => {
      try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64Map(prev => ({
            ...prev,
            [url]: reader.result as string
          }));
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.warn(`Failed to fetch image for base64 conversion (CORS): ${url}`, err);
      }
    });
  }, [data]);

  const handleAddIllustrationUrl = () => {
    if (illustrationUrlInput.trim()) {
      setIllustrationUrls(prev => [...prev, illustrationUrlInput.trim()]);
      setIllustrationUrlInput('');
    }
  };

  const removeIllustrationUrl = (urlToRemove: string) => {
    setIllustrationUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
       setTextbookFile({ file, base64: reader.result as string, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

const handleExportPDF = async () => {
  if (!printRef.current) return;
  try {
    setIsExporting(true);
    
    const width = printRef.current.offsetWidth;
    const height = printRef.current.offsetHeight;

    const dataUrl = await toPng(printRef.current, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    });
    
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height]
    });
    
    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
    const blob = pdf.output('blob');
    
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `sketchnote_${data?.topic ? data.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'export'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    
  } catch (err: any) {
    console.error('Error exporting PDF:', err);
    alert('Không thể xuất PDF, vui lòng thử lại. Lỗi: ' + (err?.message || ''));
  } finally {
    setIsExporting(false);
  }
};

const handleExportImage = async () => {
  if (!printRef.current) return;
  try {
    setIsExporting(true);
    const dataUrl = await toPng(printRef.current, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    });
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `sketchnote_${data?.topic ? data.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'export'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (err: any) {
    console.error('Error exporting Image:', err);
    alert('Không thể xuất ảnh, vui lòng thử lại. Lỗi: ' + (err?.message || ''));
  } finally {
    setIsExporting(false);
  }
};

const handleSectionImageUpload = (e: React.ChangeEvent<HTMLInputElement>, chapterIdx: number, sectionIdx: number) => {
  const file = e.target.files?.[0];
  if (!file || !data) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result as string;
    
    // Update data state
    const updatedChapters = [...data.chapters];
    updatedChapters[chapterIdx].sections[sectionIdx].illustration_url = base64;
    
    setData({
      ...data,
      chapters: updatedChapters
    });

    // Add to base64 map to bypass CORS checks
    setImageBase64Map(prev => ({
      ...prev,
      [base64]: base64
    }));
  };
  reader.readAsDataURL(file);
};

const handleRemoveSectionImage = (chapterIdx: number, sectionIdx: number) => {
  if (!data) return;
  const updatedChapters = [...data.chapters];
  updatedChapters[chapterIdx].sections[sectionIdx].illustration_url = null;
  
  setData({
    ...data,
    chapters: updatedChapters
  });
};

  const handleGenerate = async () => {
    if (!textbookFile) return;

    setLoading(true);
    setError(null);
    setData(null);

    const AI = getGeminiClient();
    if (!getGeminiApiKey()) {
      setError("Tài khoản của bạn yêu cầu nhập Gemini API Key để sử dụng tính năng AI này. Vui lòng đăng nhập lại!");
      setLoading(false);
      return;
    }

    try {
      const base64Data = textbookFile.base64.split(',')[1];

      const prompt = `Bạn là một chuyên gia giáo dục và nghệ sĩ Sketchnote tài hoa. Phân tích hình ảnh sách giáo khoa và tạo ra bản tóm tắt "ghi tay" sinh động gồm các chương lớn (I, II...) và các mục nhỏ (1, 2...).

Ngôn ngữ: Tiếng Việt.

Bạn PHẢI trả về JSON với cấu trúc sau:
{
  "subject": "Phân loại/môn (vd: TỔNG HỢP KIẾN THỨC KHOA HỌC TỰ NHIÊN 8)",
  "topic": "Chủ đề chính (vd: ĐỊNH LUẬT BẢO TOÀN KHỐI LƯỢNG - PHƯƠNG TRÌNH HÓA HỌC)",
  "chapters": [
    {
      "chapter_title": "I. Tên chương/phần lớn",
      "sections": [
        {
          "heading": "1. Tên mục nhỏ",
          "content": ["Ý thứ nhất cần ngắn gọn", "Ý thứ hai xúc tích..."],
          "lucide_icon": "Tên tiếng anh của MỘT icon liên quan (vd: Scale, Zap, Beaker, Atom, TreePine, Droplet, Star, Clock, vv - dùng PascalCase)",
          "illustration_url": "CHỈ điền CHÍNH XÁC link URL của ảnh NẾU người dùng có cung cấp danh sách link bên dưới và nội dung của bài phù hợp với link. KHÔNG TỰ CHẾ LINK. Nếu không có ảnh nào phù hợp, TRẢ VỀ null"
        }
      ]
    }
  ],
  "summary_sticker": "Câu chốt kết luận toàn bài quan trọng nhất"
}`;

      const contents: any[] = [
        {
          role: "user",
          parts: [
            { text: prompt },
            { text: "Đây là ảnh nội dung bài học từ SGK:" },
            { inlineData: { data: base64Data, mimeType: textbookFile.mimeType } }
          ]
        }
      ];

      if (illustrationUrls && illustrationUrls.length > 0) {
        contents[0].parts.push({ 
          text: "\n\nQUAN TRỌNG: DANH SÁCH LINK ẢNH MINH HỌA.\nBạn HÃY CỐ GẮNG SỬ DỤNG CHÚNG bằng cách gán chính xác chuỗi link URL của ảnh vào trường illustration_url ở phần nội dung thích hợp.\nDanh sách các link URL:\n" + illustrationUrls.map((url: string) => `- ${url}`).join("\n") 
        });
      }

      const response = await AI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });

      const jsonStr = response.text;
      if (!jsonStr) {
        throw new Error("No response from Gemini");
      }

      const parsedData = JSON.parse(jsonStr);
      setData(parsedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 px-4 py-8 md:py-16 flex flex-col items-center selection:bg-indigo-200">
      
      {/* Header with back button */}
      <div className="w-full max-w-5xl mb-8 flex items-center justify-between no-print">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white text-neutral-800 transition-all text-sm font-bold shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>

      <div className="w-full max-w-5xl space-y-8">
        
        {!data && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 text-indigo-600 mb-2">
              <NotebookPen size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-hand font-bold text-neutral-800 tracking-tight">
              Tạo Sketchnote Sinh Động
            </h1>
            <p className="text-neutral-500 font-sans max-w-lg mx-auto">
              Upload ảnh sách giáo khoa và AI sẽ hô biến thành một trang sketchnote nghệ thuật giống như ảnh minh họa!
            </p>
          </div>
        )}

        {!data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-8"
          >
            {/* Textbook Upload */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                <h3 className="font-hand text-2xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                   1. Tải lên bài học <span className="text-red-500">*</span>
                </h3>
                {!textbookFile ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors duration-200 border-neutral-300 hover:border-indigo-400 hover:bg-neutral-50 bg-neutral-50/50"
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={onFileChange} 
                    />
                    <div className="flex flex-col items-center gap-3 pointer-events-none">
                      <div className="p-3 bg-white shadow-sm rounded-full border border-neutral-200">
                        <UploadCloud size={32} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-hand font-bold text-neutral-700 text-2xl">Click để chọn ảnh bài học</p>
                        <p className="text-neutral-500 text-sm mt-1 font-sans">Hỗ trợ JPG, PNG, WEBP</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative inline-block group">
                     <img src={textbookFile.base64} alt="Textbook" className="max-h-64 object-contain rounded-xl border border-neutral-200 shadow-sm" />
                     <button 
                       onClick={() => setTextbookFile(null)} 
                       className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                     >
                        <X size={16} />
                     </button>
                  </div>
                )}
            </div>

            {/* Illustrations Link Input */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                <h3 className="font-hand text-2xl font-bold text-neutral-800 mb-4">
                   2. Link hình ảnh minh họa (Tuỳ chọn)
                </h3>
                
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon size={18} className="text-neutral-400" />
                    </div>
                    <input
                      type="url"
                      placeholder="Dán link ảnh vào đây (ví dụ: https://example.com/image.jpg)"
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 font-sans text-neutral-900"
                      value={illustrationUrlInput}
                      onChange={(e) => setIllustrationUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddIllustrationUrl()}
                    />
                  </div>
                  <button 
                    onClick={handleAddIllustrationUrl}
                    className="bg-indigo-100 text-indigo-700 px-4 py-3 rounded-xl hover:bg-indigo-200 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Plus size={20} /> Thêm
                  </button>
                </div>

                {illustrationUrls.length > 0 && (
                   <ul className="space-y-2 mt-4 max-h-40 overflow-y-auto pr-2">
                      {illustrationUrls.map((url, idx) => (
                         <li key={idx} className="flex items-center justify-between bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-200">
                            <span className="text-sm font-sans text-neutral-600 truncate max-w-[85%]">{url}</span>
                            <button 
                              onClick={() => removeIllustrationUrl(url)} 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            >
                               <X size={16} />
                            </button>
                         </li>
                      ))}
                   </ul>
                )}
            </div>

            <div className="flex justify-center mt-8">
               <button 
                  onClick={handleGenerate}
                  disabled={!textbookFile}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-full font-sans font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center gap-3"
               >
                  <Sparkles size={24} /> Tạo Phiếu Sketchnote
               </button>
            </div>

            {error && (
              <p className="text-red-500 text-center mt-4 bg-red-50 p-4 rounded-xl border border-red-100 font-sans">{error}</p>
            )}
          </motion.div>
        )}

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center p-24 space-y-6"
          >
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
            <div className="text-center">
              <p className="font-hand text-4xl font-bold text-neutral-800">Đang đọc bài và vẽ sketchnote...</p>
              <p className="text-neutral-500 text-2xl font-hand mt-2">Đợi chút để lên màu nhé!</p>
            </div>
          </motion.div>
        )}

        {data && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Action Bar */}
            <div className="flex justify-end gap-3 mb-6 no-print flex-wrap">
              <button 
                onClick={handleExportImage}
                disabled={isExporting}
                className="text-sm px-5 py-2.5 bg-green-600 border border-transparent rounded-xl hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md transition-colors text-white font-medium font-sans flex flex-row items-center gap-2"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />} 
                Tải Ảnh PNG
              </button>
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="text-sm px-5 py-2.5 bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md transition-colors text-white font-medium font-sans flex flex-row items-center gap-2"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />} 
                Tải PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="text-sm px-5 py-2.5 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 shadow-sm transition-colors text-neutral-800 font-medium font-sans flex flex-row items-center gap-2"
              >
                <Printer size={16} /> In
              </button>
              <button 
                onClick={() => setData(null)}
                className="text-sm px-5 py-2.5 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 shadow-sm transition-colors text-neutral-800 font-medium font-sans flex flex-row items-center gap-2"
              >
                <PenTool size={16} /> Nháp trang mới
              </button>
            </div>

            {/* Sketchnote Paper Interface */}
            <div ref={printRef} className="bg-white rounded-md shadow-2xl overflow-hidden border border-neutral-300 relative mx-auto pb-16 print-content text-neutral-900">
              
              {/* Paper line background */}
              <div className="absolute inset-0 paper-bg opacity-100 z-0 pointer-events-none" />

              <div className="relative z-10 px-6 md:px-12 pt-12">
                {/* Decorative border squiggles */}
                <svg className="absolute top-4 left-4 text-blue-300 w-12 h-12 -z-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                   <path d="M 10 90 Q 30 10 50 80 T 90 20" />
                </svg>
                <svg className="absolute bottom-12 right-6 text-red-200 w-16 h-16 -z-10 transform -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                   <circle cx="50" cy="50" r="40" strokeDasharray="10 10" />
                   <path d="M 30 50 L 70 50 M 50 30 L 50 70" />
                </svg>

                {/* Header Area */}
                <div className="text-center mb-10">
                  <div className="flex justify-center items-center gap-4 mb-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={24} />
                    <h3 className="font-hand text-3xl uppercase tracking-widest text-blue-900 font-bold">
                      {data.subject}
                    </h3>
                    <Star className="text-yellow-400 fill-yellow-400" size={24} />
                  </div>
                  
                  <div className="inline-block relative">
                     <div className="absolute inset-0 bg-orange-100 translate-y-2 -translate-x-1 skew-x-[-5deg] border border-orange-200"></div>
                     <h1 className="relative font-hand text-5xl md:text-6xl font-bold text-red-600 leading-tight uppercase px-8 py-3 tracking-wider">
                       {data.topic}
                     </h1>
                  </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col gap-10">
                  
                  {data.chapters.map((chapter, cIdx) => (
                    <div key={cIdx} className="mb-8">
                      
                      {/* Chapter Title */}
                      <div className="mb-6 flex justify-center">
                        <h2 className="font-hand text-3xl md:text-4xl font-bold text-blue-900 hand-drawn-border-dashed px-6 py-2 bg-blue-50/80 inline-block text-center mt-2 shadow-sm">
                          {chapter.chapter_title}
                        </h2>
                      </div>

                      {/* Sections within Chapter */}
                      <div className="space-y-8">
                        {chapter.sections.map((section, sIdx) => {
                          const illustrationUrl = getIllustrationForNode(section.heading);
                          return (
                          <div key={sIdx} className="flex flex-col gap-3 ml-2">
                            {/* Section Heading (Full Width) */}
                            <div className="flex items-center gap-3 w-full">
                               {illustrationUrl && (
                                 imageBase64Map[illustrationUrl] ? (
                                   <img 
                                     src={imageBase64Map[illustrationUrl]} 
                                     alt="Illustration" 
                                     className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] shrink-0" 
                                   />
                                 ) : (
                                   (() => {
                                     const IconComponent = (LucideIcons as any)[section.lucide_icon || 'Sparkles'] || LucideIcons.Sparkles;
                                     return (
                                       <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-indigo-50 border border-indigo-200/60 rounded-xl text-indigo-500 shrink-0 shadow-sm">
                                         <IconComponent className="w-5 h-5" />
                                       </div>
                                     );
                                   })()
                                 )
                               )}
                               <h3 className="font-hand text-2xl md:text-3xl font-bold text-green-950 highlight-green px-4 py-1 flex-1 shadow-sm m-0">
                                  {section.heading}
                               </h3>
                            </div>

                            {/* Section Content & Image Row */}
                            <div className="flex flex-col md:flex-row gap-6 mt-2 items-start">
                              
                              {/* Left: Section Details */}
                              <div className="flex-1">
                                <ul className="space-y-2 font-hand text-2xl leading-10 text-neutral-800 pl-4 list-disc marker:text-red-500 m-0">
                                  {section.content.map((point, pIdx) => (
                                    <li key={pIdx} className="pl-1">
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Right: Illustration Box and Actions */}
                              <div className="w-full md:w-[280px] shrink-0 flex flex-col items-center gap-3">
                                {/* Illustration Box */}
                                {section.illustration_url && (
                                  <div className="p-2 bg-white hand-drawn-border-box shadow-[2px_3px_0_rgba(0,0,0,0.05)] w-full flex items-center justify-center rotate-1 group hover:-rotate-1 transition-transform overflow-hidden">
                                    {imageBase64Map[section.illustration_url] ? (
                                      <img 
                                        src={imageBase64Map[section.illustration_url]} 
                                        alt="Minh hoạ" 
                                        className="max-h-48 object-contain rounded-lg w-full mix-blend-multiply" 
                                      />
                                    ) : (
                                      <div className="text-center py-4 px-2">
                                        <a 
                                          href={section.illustration_url} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-xs text-indigo-650 hover:underline flex items-center justify-center gap-1 font-sans font-bold"
                                        >
                                          <LinkIcon size={14} /> Xem ảnh minh họa gốc
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Actions on section (change/add illustration) */}
                                <div className="no-print flex items-center justify-center flex-wrap gap-2">
                                  <label className="text-[10px] md:text-[11px] font-sans font-black uppercase tracking-wider text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 select-none shadow-xs">
                                    <LucideIcons.Image size={13} className="text-indigo-650" />
                                    {section.illustration_url ? 'Thay ảnh' : 'Chèn ảnh minh họa'}
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden" 
                                      onChange={(e) => handleSectionImageUpload(e, cIdx, sIdx)}
                                    />
                                  </label>
                                  {section.illustration_url && (
                                    <button
                                      onClick={() => handleRemoveSectionImage(cIdx, sIdx)}
                                      className="text-[10px] md:text-[11px] font-sans font-black uppercase tracking-wider text-red-650 hover:text-red-800 bg-red-50 hover:bg-red-100/80 border border-red-200/50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 select-none shadow-xs"
                                    >
                                      <LucideIcons.Trash2 size={13} className="text-red-500" />
                                      Xóa
                                    </button>
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>
                        )})}
                      </div>

                    </div>
                  ))}

                </div>

                {/* Summary / Footer Sticker */}
                {data.summary_sticker && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 mb-8 flex justify-center"
                  >
                    <div className="relative transform -rotate-2 hover:rotate-1 transition-transform duration-300 z-20">
                       <div className="highlight-yellow px-10 py-6 max-w-2xl mx-auto flex items-start gap-4">
                          <div className="shrink-0 mt-1">
                            <div className="bg-white p-2 rounded-full border-2 border-black">
                               <Star className="text-yellow-500 fill-yellow-500" size={24} />
                            </div>
                          </div>
                          <div>
                            <p className="font-hand text-3xl font-bold text-gray-900 leading-relaxed border-b-2 border-dashed border-gray-400 pb-1 inline m-0">
                              {data.summary_sticker}
                            </p>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          </motion.div>
        )}
        
      </div>
    </div>
  );
}
