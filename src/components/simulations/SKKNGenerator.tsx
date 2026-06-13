import React, { useState } from 'react';
import { generateSKKNDocument, SKKNData, Author, Supporter, Solution } from '../../utils/docxExport';
import { FileDown, Plus, Trash2, ArrowRight, ArrowLeft, Sparkles, Loader2, FileUp } from 'lucide-react';
import { getGeminiClient } from '../../lib/gemini';

export default function SKKNGenerator() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);

  const [data, setData] = useState<SKKNData>({
    schoolYear: '2023 - 2024',
    councilName: 'Hội đồng khoa học cấp Quận/Huyện',
    schoolName: 'Trường THCS ...',
    initiativeName: '',
    level: 'THCS',
    subject: 'Khoa học tự nhiên',
    field: 'Giảng dạy',
    timeFrom: '09/2023',
    timeTo: '05/2024',
    authors: [{ id: '1', name: '', birthYear: '', position: '', contribution: '100', duty: 'Chủ biên' }],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    supporters: [],
    documents: { images: true, reports: true, lessonPlans: true },
    context: '',
    limit1: '',
    limit2: '',
    limit3: '',
    conclusion: '',
    solutions: [{ id: '1', name: '', target: '', steps: '', example: '' }],
    advantages: '',
    disadvantages: '',
    newness: '',
    appliedClasses: '',
    resultTimeFrom: '09/2023',
    resultTimeTo: '05/2024',
    resultTable: '',
    products: '',
    proposalLevel: { school: true, city: false },
    efficiency: '',
    replication: '',
    dateStr: `Hà Nội, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
  });

  const updateData = (fields: Partial<SKKNData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateSKKNDocument(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Làm sạch tên file, loại bỏ các ký tự đặc biệt và giới hạn độ dài
      let safeName = (data.initiativeName || 'TaiLieu').replace(/[<>:"/\\|?*\n\r]/g, '').trim();
      if (safeName.length > 50) safeName = safeName.substring(0, 50) + '...';
      a.download = `SKKN_${safeName}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating docx:', error);
      alert('Đã xảy ra lỗi khi tạo file Word!');
    }
    setIsGenerating(false);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // --- AI Suggestion Logic ---
  const generateAIText = async (fieldId: string, promptInfo: string, currentText: string, extraContext: string = '') => {
    setLoadingAI(fieldId);
    try {
      const client = getGeminiClient();
      
      let baseContext = `Bạn là một chuyên gia giáo dục, chuyên tư vấn và viết Sáng kiến kinh nghiệm (SKKN) cho giáo viên Việt Nam.
Thông tin cơ bản về đề tài:
- Cấp học: ${data.level}
- Môn học: ${data.subject}
- Lĩnh vực: ${data.field}
- Tên sáng kiến (nếu có): ${data.initiativeName}
`;

      let instruction = '';
      if (fieldId === 'initiativeName') {
        instruction = `Dựa vào cấp học, môn học và lĩnh vực trên. Lĩnh vực người dùng nhập có thể là một số từ khóa như: dạy học tích cực, chuyển đổi số, trí tuệ nhân tạo, tạo app, tạo website, trò chơi dạy học... 
Hãy đề xuất 1 "Tên sáng kiến kinh nghiệm" thật hay, đúng chuẩn học thuật và mang tính thực tiễn. Tên sáng kiến cần thể hiện rõ giải pháp, đối tượng và mục đích. 
Ví dụ: "Ứng dụng trí tuệ nhân tạo ChatGPT trong việc thiết kế trò chơi dạy học môn Khoa học tự nhiên 6 nhằm phát huy năng lực tự học của học sinh".
Chỉ trả về 1 tên duy nhất, không giải thích, không dùng dấu ngoặc kép bọc ngoài.`;
      } else {
        instruction = `Người dùng đang viết phần "${promptInfo}" cho Sáng kiến kinh nghiệm này. ${extraContext}
Từ khóa hoặc nội dung người dùng đã nhập (nếu có): "${currentText}".
Yêu cầu: Hãy viết/phát triển từ khóa trên thành một đoạn văn hoàn chỉnh, chuyên nghiệp, đúng ngôn ngữ học thuật sư phạm, dài khoảng 1-2 đoạn văn. Bám sát vào Tên sáng kiến và cấp/môn học. 
Nếu người dùng chưa nhập gì, hãy tự sáng tác một đoạn phù hợp với tiêu đề sáng kiến. Không giải thích, chỉ trả về nội dung trực tiếp để copy paste. Không dùng định dạng markdown phức tạp.`;
      }

      let prompt = baseContext + '\n\n' + instruction;

      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      let fileParts: any[] = [];
      if (referenceFiles.length > 0) {
        prompt += '\n\nĐẶC BIỆT LƯU Ý: Hãy chắc chắn BẮT BUỘC phải đọc, quét và trích xuất thông tin từ các TÀI LIỆU THAM KHẢO (Căn cứ để viết) được đính kèm sau đây (bao gồm SGK, công văn, giáo án, chất lượng 2 mặt...) để xây dựng nội dung chính xác, bám sát số liệu và thực tế của tài liệu tham khảo.';
        fileParts = await Promise.all(referenceFiles.map(async (f) => {
          const base64 = await fileToBase64(f);
          let mimeType = f.type;
          if (!mimeType) {
            if (f.name.endsWith('.pdf')) mimeType = 'application/pdf';
            else if (f.name.endsWith('.txt')) mimeType = 'text/plain';
            else if (f.name.endsWith('.md')) mimeType = 'text/markdown';
            else if (f.name.endsWith('.csv')) mimeType = 'text/csv';
            else mimeType = 'text/plain';
          }
          return {
            inlineData: {
              data: base64.split(',')[1],
              mimeType: mimeType
            }
          };
        }));
      }

      const contents = [prompt, ...fileParts];

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      const text = response.text || '';
      return text.trim();
    } catch (error) {
      console.error('Error generating AI text:', error);
      alert('Đã xảy ra lỗi khi gọi AI: ' + (error instanceof Error ? error.message : JSON.stringify(error)));
      return currentText;
    } finally {
      setLoadingAI(null);
    }
  };

  const handleAIAssist = async (fieldKey: keyof SKKNData, promptInfo: string) => {
    const currentVal = data[fieldKey] as string;
    const result = await generateAIText(fieldKey, promptInfo, currentVal);
    if (result) updateData({ [fieldKey]: result });
  };

  const handleSolutionAIAssist = async (solId: string, solIndex: number, solField: keyof Solution, promptInfo: string) => {
    const sol = data.solutions[solIndex];
    const currentVal = sol[solField] as string;
    const fieldId = `sol_${solId}_${solField}`;
    const extraContext = `Đây là Giải pháp số ${solIndex + 1} có tên là "${sol.name}".`;
    
    const result = await generateAIText(fieldId, promptInfo, currentVal, extraContext);
    if (result) {
      const newSols = [...data.solutions];
      newSols[solIndex] = { ...newSols[solIndex], [solField]: result };
      updateData({ solutions: newSols });
    }
  };

  // Nút AI UI Component
  const AIBtn = ({ onClick, loadingId, fieldId }: { onClick: () => void, loadingId: string | null, fieldId: string }) => (
    <button 
      onClick={onClick} 
      disabled={loadingId !== null}
      className="text-xs font-bold bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm shadow-orange-500/20 whitespace-nowrap"
    >
      {loadingId === fieldId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
      Gợi ý AI
    </button>
  );

  const labelClass = "text-sm font-semibold text-slate-700 mb-1.5 block";
  const inputClass = "w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-4 py-2 text-slate-800 transition-all outline-none";

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      <div className="relative">
        
        {/* Banner */}
        <div className="bg-[#1E1B2E] rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg gap-4">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff15 1px, transparent 1px), linear-gradient(to bottom, #ffffff15 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">Viết Sáng kiến kinh nghiệm</h2>
            <p className="text-slate-300 text-sm">Hệ thống tự động tạo ... Hệ thống viết sáng kiến kinh nghiệm</p>
          </div>
          <button
            onClick={handleExport}
            disabled={isGenerating}
            className="relative z-10 flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#FF5E5E] to-[#FF8C69] hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
          >
            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileDown className="w-5 h-5" />}
            Xuất File Word
          </button>
        </div>

        {/* Steps Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {['Thông tin chung', 'Tác giả & Hỗ trợ', 'Thực trạng', 'Giải pháp', 'Kết quả & Đề xuất'].map((title, i) => (
              <div key={i} className="flex items-center shrink-0">
                <div className={`flex items-center gap-2 ${step === i + 1 ? 'text-slate-800 font-bold' : step > i + 1 ? 'text-slate-600 font-medium' : 'text-slate-400 font-medium'}`}>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${step === i + 1 ? 'bg-[#3B82F6] text-white' : step > i + 1 ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                    {i + 1}
                  </div>
                  <span className="text-sm">{title}</span>
                </div>
                {i < 4 && <div className={`w-8 h-px mx-4 ${step > i + 1 ? 'bg-blue-200' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <div className="min-h-[400px] mt-4">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Tên sáng kiến</label>
                      <AIBtn onClick={() => handleAIAssist('initiativeName', 'Tên sáng kiến')} loadingId={loadingAI} fieldId="initiativeName" />
                    </div>
                    <input type="text" placeholder="Gõ từ khóa và nhấn Gợi ý AI (VD: ứng dụng AI tạo app)..." className={`${inputClass} font-bold text-slate-900 border-slate-300`} value={data.initiativeName} onChange={e => updateData({ initiativeName: e.target.value })} />
                  </div>
                  <div><label className={labelClass}>Phạm vi / Lĩnh vực</label><input type="text" placeholder="VD: chuyển đổi số, trò chơi dạy học..." className={inputClass} value={data.field} onChange={e => updateData({ field: e.target.value })} /></div>
                  <div><label className={labelClass}>Môn học</label><input type="text" className={inputClass} value={data.subject} onChange={e => updateData({ subject: e.target.value })} /></div>
                  <div><label className={labelClass}>Cấp học</label><input type="text" className={inputClass} value={data.level} onChange={e => updateData({ level: e.target.value })} /></div>
                  <div><label className={labelClass}>Năm học</label><input type="text" className={inputClass} value={data.schoolYear} onChange={e => updateData({ schoolYear: e.target.value })} /></div>
                  <div><label className={labelClass}>Hội đồng cấp</label><input type="text" className={inputClass} value={data.councilName} onChange={e => updateData({ councilName: e.target.value })} /></div>
                  <div><label className={labelClass}>Tên trường</label><input type="text" className={inputClass} value={data.schoolName} onChange={e => updateData({ schoolName: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4 col-span-2">
                    <div><label className={labelClass}>Từ tháng (Áp dụng)</label><input type="text" className={inputClass} value={data.timeFrom} onChange={e => updateData({ timeFrom: e.target.value })} /></div>
                    <div><label className={labelClass}>Đến tháng (Áp dụng)</label><input type="text" className={inputClass} value={data.timeTo} onChange={e => updateData({ timeTo: e.target.value })} /></div>
                  </div>
                  
                  <div className="col-span-2 border border-slate-200 p-5 rounded-2xl bg-slate-50/50">
                    <label className="text-base text-slate-800 mb-2 font-bold flex items-center gap-2">
                      Tài liệu tham khảo (Căn cứ để viết)
                    </label>
                    <p className="text-sm text-slate-500 mb-4">
                      Tải lên SGK, công văn hướng dẫn thực hiện, kế hoạch giảng dạy, kế hoạch bài dạy, kết quả chất lượng 2 mặt... AI sẽ <strong className="text-blue-600">bắt buộc quét</strong> các tài liệu này để xây dựng nội dung sáng kiến thật sát với thực tế của bạn. (Hỗ trợ PDF, TXT, CSV, MD).
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {referenceFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-700 shadow-sm">
                          <span className="truncate max-w-[250px] font-medium">{f.name}</span>
                          <span className="text-xs text-slate-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                          <button onClick={() => setReferenceFiles(prev => prev.filter((_, index) => index !== i))} className="text-red-500 hover:text-red-600 ml-1 p-1 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <label className="flex flex-col items-center justify-center gap-3 px-4 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-slate-500 hover:text-blue-600 group bg-white">
                      <div className="p-3 bg-slate-100 group-hover:bg-blue-100 rounded-full transition-colors text-slate-400 group-hover:text-blue-500">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <span className="font-semibold block text-slate-700">Click để tải lên hoặc kéo thả tài liệu vào đây</span>
                        <span className="text-xs text-slate-500 mt-1 block">Hỗ trợ các định dạng: PDF, TXT, CSV, MD, HTML (Tối đa vài MB mỗi file)</span>
                      </div>
                      <input type="file" multiple accept=".pdf,.txt,.csv,.md,.html" className="hidden" onChange={e => {
                        if (e.target.files) {
                          setReferenceFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                        }
                      }} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Thông tin tác giả</h3>
                  {data.authors.map((author, i) => (
                    <div key={author.id} className="grid grid-cols-6 gap-3 mb-3">
                      <input placeholder="Họ tên" className={`${inputClass} col-span-2`} value={author.name} onChange={e => { const newAuthors = [...data.authors]; newAuthors[i].name = e.target.value; updateData({ authors: newAuthors }); }} />
                      <input placeholder="Năm sinh" className={inputClass} value={author.birthYear} onChange={e => { const newAuthors = [...data.authors]; newAuthors[i].birthYear = e.target.value; updateData({ authors: newAuthors }); }} />
                      <input placeholder="Chức vụ" className={inputClass} value={author.position} onChange={e => { const newAuthors = [...data.authors]; newAuthors[i].position = e.target.value; updateData({ authors: newAuthors }); }} />
                      <input placeholder="Đóng góp %" className={inputClass} value={author.contribution} onChange={e => { const newAuthors = [...data.authors]; newAuthors[i].contribution = e.target.value; updateData({ authors: newAuthors }); }} />
                      <div className="flex gap-2">
                        <input placeholder="Nhiệm vụ" className={`${inputClass} flex-1`} value={author.duty} onChange={e => { const newAuthors = [...data.authors]; newAuthors[i].duty = e.target.value; updateData({ authors: newAuthors }); }} />
                        <button onClick={() => updateData({ authors: data.authors.filter(a => a.id !== author.id) })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => updateData({ authors: [...data.authors, { id: Date.now().toString(), name: '', birthYear: '', position: '', contribution: '', duty: '' }] })} className="flex items-center gap-1 text-sm font-semibold text-blue-600 mt-2 hover:text-blue-700"><Plus className="w-4 h-4" /> Thêm tác giả</button>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Người hỗ trợ (nếu có)</h3>
                  {data.supporters.map((sup, i) => (
                    <div key={sup.id} className="grid grid-cols-4 gap-3 mb-3">
                      <input placeholder="Họ tên" className={inputClass} value={sup.name} onChange={e => { const newSups = [...data.supporters]; newSups[i].name = e.target.value; updateData({ supporters: newSups }); }} />
                      <input placeholder="Phòng ban" className={inputClass} value={sup.department} onChange={e => { const newSups = [...data.supporters]; newSups[i].department = e.target.value; updateData({ supporters: newSups }); }} />
                      <input placeholder="Chức vụ" className={inputClass} value={sup.position} onChange={e => { const newSups = [...data.supporters]; newSups[i].position = e.target.value; updateData({ supporters: newSups }); }} />
                      <div className="flex gap-2">
                        <input placeholder="Nhiệm vụ" className={`${inputClass} flex-1`} value={sup.duty} onChange={e => { const newSups = [...data.supporters]; newSups[i].duty = e.target.value; updateData({ supporters: newSups }); }} />
                        <button onClick={() => updateData({ supporters: data.supporters.filter(s => s.id !== sup.id) })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => updateData({ supporters: [...data.supporters, { id: Date.now().toString(), name: '', department: '', position: '', duty: '' }] })} className="flex items-center gap-1 text-sm font-semibold text-blue-600 mt-2 hover:text-blue-700"><Plus className="w-4 h-4" /> Thêm người hỗ trợ</button>
                </div>

                <div className="grid grid-cols-3 gap-5 border-t border-slate-200 pt-6">
                  <div><label className={labelClass}>Người liên hệ chính</label><input type="text" className={inputClass} value={data.contactName} onChange={e => updateData({ contactName: e.target.value })} /></div>
                  <div><label className={labelClass}>Điện thoại</label><input type="text" className={inputClass} value={data.contactPhone} onChange={e => updateData({ contactPhone: e.target.value })} /></div>
                  <div><label className={labelClass}>Email</label><input type="text" className={inputClass} value={data.contactEmail} onChange={e => updateData({ contactEmail: e.target.value })} /></div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className={labelClass}>Bối cảnh</label>
                    <AIBtn onClick={() => handleAIAssist('context', 'Bối cảnh thực hiện sáng kiến')} loadingId={loadingAI} fieldId="context" />
                  </div>
                  <textarea className={`${inputClass} h-28 resize-none custom-scrollbar`} value={data.context} onChange={e => updateData({ context: e.target.value })} placeholder="Gõ từ khóa (VD: Chương trình GDPT 2018, yêu cầu đổi mới...) và bấm Gợi ý AI" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Hạn chế 1 (Phía học sinh)</label>
                      <AIBtn onClick={() => handleAIAssist('limit1', 'Hạn chế của học sinh trước khi có sáng kiến')} loadingId={loadingAI} fieldId="limit1" />
                    </div>
                    <textarea className={`${inputClass} h-24 resize-none custom-scrollbar`} value={data.limit1} onChange={e => updateData({ limit1: e.target.value })} placeholder="Từ khóa (VD: thụ động, thiếu kỹ năng...)" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Hạn chế 2 (Phía giáo viên/CSVC)</label>
                      <AIBtn onClick={() => handleAIAssist('limit2', 'Hạn chế về phía giáo viên, phương pháp cũ hoặc cơ sở vật chất')} loadingId={loadingAI} fieldId="limit2" />
                    </div>
                    <textarea className={`${inputClass} h-24 resize-none custom-scrollbar`} value={data.limit2} onChange={e => updateData({ limit2: e.target.value })} placeholder="Từ khóa (VD: tốn thời gian, thiếu thiết bị...)" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Hạn chế 3 (Tính tương tác)</label>
                      <AIBtn onClick={() => handleAIAssist('limit3', 'Hạn chế về tính tương tác và bầu không khí lớp học')} loadingId={loadingAI} fieldId="limit3" />
                    </div>
                    <textarea className={`${inputClass} h-24 resize-none custom-scrollbar`} value={data.limit3} onChange={e => updateData({ limit3: e.target.value })} placeholder="Từ khóa (VD: học một chiều, ít thảo luận...)" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Kết luận (Lý do ra đời sáng kiến)</label>
                      <AIBtn onClick={() => handleAIAssist('conclusion', 'Kết luận vì sao cần phải có sáng kiến này để giải quyết các hạn chế trên')} loadingId={loadingAI} fieldId="conclusion" />
                    </div>
                    <textarea className={`${inputClass} h-24 resize-none custom-scrollbar`} value={data.conclusion} onChange={e => updateData({ conclusion: e.target.value })} placeholder="Từ khóa (VD: do đó cần thiết phải áp dụng...)" />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {data.solutions.map((sol, i) => (
                  <div key={sol.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 relative shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <h4 className="font-extrabold text-blue-600 text-lg">Giải pháp {i + 1}</h4>
                      {data.solutions.length > 1 && <button onClick={() => updateData({ solutions: data.solutions.filter(s => s.id !== sol.id) })} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={labelClass}>Tên giải pháp cụ thể</label>
                          <AIBtn onClick={() => handleSolutionAIAssist(sol.id, i, 'name', 'Tên của giải pháp này')} loadingId={loadingAI} fieldId={`sol_${sol.id}_name`} />
                        </div>
                        <input placeholder="Ví dụ: Thiết kế trò chơi Ô chữ trên PowerPoint..." className={`${inputClass} font-bold text-blue-700`} value={sol.name} onChange={e => { const newSols = [...data.solutions]; newSols[i].name = e.target.value; updateData({ solutions: newSols }); }} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={labelClass}>Mục tiêu của giải pháp</label>
                          <AIBtn onClick={() => handleSolutionAIAssist(sol.id, i, 'target', 'Mục tiêu đạt được của giải pháp này')} loadingId={loadingAI} fieldId={`sol_${sol.id}_target`} />
                        </div>
                        <textarea placeholder="Nhập từ khóa và click AI..." className={`${inputClass} h-20 resize-none`} value={sol.target} onChange={e => { const newSols = [...data.solutions]; newSols[i].target = e.target.value; updateData({ solutions: newSols }); }} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={labelClass}>Các bước thực hiện (Quy trình)</label>
                          <AIBtn onClick={() => handleSolutionAIAssist(sol.id, i, 'steps', 'Quy trình, các bước thực hiện chi tiết cho giải pháp này')} loadingId={loadingAI} fieldId={`sol_${sol.id}_steps`} />
                        </div>
                        <textarea placeholder="Nhập từ khóa và click AI..." className={`${inputClass} h-28 resize-none`} value={sol.steps} onChange={e => { const newSols = [...data.solutions]; newSols[i].steps = e.target.value; updateData({ solutions: newSols }); }} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={labelClass}>Ví dụ minh họa thực tế</label>
                          <AIBtn onClick={() => handleSolutionAIAssist(sol.id, i, 'example', 'Một ví dụ minh họa cụ thể khi áp dụng giải pháp này vào thực tế bài học')} loadingId={loadingAI} fieldId={`sol_${sol.id}_example`} />
                        </div>
                        <textarea placeholder="Nhập từ khóa và click AI..." className={`${inputClass} h-24 resize-none`} value={sol.example} onChange={e => { const newSols = [...data.solutions]; newSols[i].example = e.target.value; updateData({ solutions: newSols }); }} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateData({ solutions: [...data.solutions, { id: Date.now().toString(), name: '', target: '', steps: '', example: '' }] })} className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-500 hover:text-blue-600 flex items-center justify-center gap-2 transition-all font-bold bg-white">
                  <Plus className="w-5 h-5" /> Thêm giải pháp mới
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Ưu điểm chung</label>
                      <AIBtn onClick={() => handleAIAssist('advantages', 'Ưu điểm chung của toàn bộ sáng kiến')} loadingId={loadingAI} fieldId="advantages" />
                    </div>
                    <textarea className={`${inputClass} h-24 resize-none`} value={data.advantages} onChange={e => updateData({ advantages: e.target.value })} placeholder="Từ khóa..." />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Nhược điểm chung</label>
                      <AIBtn onClick={() => handleAIAssist('disadvantages', 'Nhược điểm chung hoặc khó khăn khi áp dụng sáng kiến và cách khắc phục')} loadingId={loadingAI} fieldId="disadvantages" />
                    </div>
                    <textarea className={`${inputClass} h-24 resize-none`} value={data.disadvantages} onChange={e => updateData({ disadvantages: e.target.value })} placeholder="Từ khóa..." />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className={labelClass}>Tính mới của sáng kiến</label>
                    <AIBtn onClick={() => handleAIAssist('newness', 'Tính mới, điểm sáng tạo đột phá của sáng kiến này so với các phương pháp cũ')} loadingId={loadingAI} fieldId="newness" />
                  </div>
                  <textarea className={`${inputClass} h-24 resize-none`} value={data.newness} onChange={e => updateData({ newness: e.target.value })} placeholder="Từ khóa..." />
                </div>

                <div className="grid grid-cols-3 gap-5 border-t border-slate-200 pt-5">
                  <div><label className={labelClass}>Áp dụng tại lớp</label><input type="text" className={inputClass} value={data.appliedClasses} onChange={e => updateData({ appliedClasses: e.target.value })} placeholder="VD: 6A, 6B" /></div>
                  <div><label className={labelClass}>Từ tháng (Kết quả)</label><input type="text" className={inputClass} value={data.resultTimeFrom} onChange={e => updateData({ resultTimeFrom: e.target.value })} /></div>
                  <div><label className={labelClass}>Đến tháng (Kết quả)</label><input type="text" className={inputClass} value={data.resultTimeTo} onChange={e => updateData({ resultTimeTo: e.target.value })} /></div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className={labelClass}>Sản phẩm cụ thể (Minh chứng)</label>
                    <AIBtn onClick={() => handleAIAssist('products', 'Sản phẩm cụ thể học sinh hoặc giáo viên tạo ra để minh chứng')} loadingId={loadingAI} fieldId="products" />
                  </div>
                  <input type="text" className={inputClass} value={data.products} onChange={e => updateData({ products: e.target.value })} placeholder="VD: 3 giáo án mẫu, 1 trang web, 10 bài thu hoạch..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Hiệu quả áp dụng cấp cơ sở</label>
                      <AIBtn onClick={() => handleAIAssist('efficiency', 'Hiệu quả mang lại đối với phạm vi trường học, cơ sở')} loadingId={loadingAI} fieldId="efficiency" />
                    </div>
                    <textarea className={`${inputClass} h-24 resize-none`} value={data.efficiency} onChange={e => updateData({ efficiency: e.target.value })} placeholder="Từ khóa..." />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClass}>Khả năng nhân rộng</label>
                      <AIBtn onClick={() => handleAIAssist('replication', 'Khả năng ứng dụng rộng rãi của sáng kiến sang các trường khác, môn khác')} loadingId={loadingAI} fieldId="replication" />
                    </div>
                    <textarea className={`${inputClass} h-24 resize-none`} value={data.replication} onChange={e => updateData({ replication: e.target.value })} placeholder="Từ khóa..." />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors disabled:opacity-40 disabled:hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            
            <button
              onClick={step === 5 ? handleExport : nextStep}
              className={`px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${step === 5 ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30'}`}
            >
              {step === 5 ? 'Tải File Word Ngay' : 'Tiếp tục'} {step < 5 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between text-slate-500 font-medium text-xs mt-2 px-2">
          <span>Viết Sáng kiến kinh nghiệm</span>
          <span>Email: chuvan@007788.vn</span>
        </div>
      </div>
    </div>
  );
}
