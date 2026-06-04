import React, { useState, useRef, useCallback } from 'react';
import {
  FileText, Upload, Download, AlertCircle, CheckCircle2,
  Loader2, BookOpen, ChevronDown, ChevronUp, Info,
  FileCheck, Sparkles, X, Eye
} from 'lucide-react';
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, convertInchesToTwip, convertMillimetersToTwip
} from 'docx';

// ─────────────────────────────────────────────────────────────────────────────
// Pure browser DOCX text extractor using JSZip (bundled inside docx package)
// No mammoth / no Node.js Buffer needed
// ─────────────────────────────────────────────────────────────────────────────

async function extractTextFromDocx(file: File): Promise<string> {
  const { default: JSZip } = await import('jszip');
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const xmlFile = zip.file('word/document.xml');
  if (!xmlFile) throw new Error('Không tìm thấy nội dung văn bản trong tệp DOCX.');
  const xmlText = await xmlFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
  // Extract text from <w:t> elements, preserving paragraph breaks
  const paragraphs = xmlDoc.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'p');
  const lines: string[] = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const runs = paragraphs[i].getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 't');
    let text = '';
    for (let j = 0; j < runs.length; j++) {
      text += runs[j].textContent || '';
    }
    lines.push(text);
  }
  return lines.join('\n');
}

async function extractHtmlPreviewFromDocx(file: File): Promise<string> {
  const { default: JSZip } = await import('jszip');
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const xmlFile = zip.file('word/document.xml');
  if (!xmlFile) return '<p>Không đọc được nội dung.</p>';
  const xmlText = await xmlFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
  const NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const paragraphs = xmlDoc.getElementsByTagNameNS(NS, 'p');
  let html = '';
  for (let i = 0; i < paragraphs.length; i++) {
    const runs = paragraphs[i].getElementsByTagNameNS(NS, 't');
    let text = '';
    for (let j = 0; j < runs.length; j++) text += runs[j].textContent || '';
    if (text.trim()) {
      // Simple bold detection via <w:b/> in rPr
      const rPrs = paragraphs[i].getElementsByTagNameNS(NS, 'rPr');
      let hasBold = false;
      for (let k = 0; k < rPrs.length; k++) {
        if (rPrs[k].getElementsByTagNameNS(NS, 'b').length > 0) { hasBold = true; break; }
      }
      html += hasBold ? `<p><strong>${text}</strong></p>` : `<p>${text}</p>`;
    } else {
      html += '<br/>';
    }
  }
  return html || '<p>Tệp không có nội dung văn bản.</p>';
}

// ─────────────────────────────────────────────────────────────────────────────
// Nghị định 30 rules
// ─────────────────────────────────────────────────────────────────────────────

const ND30_RULES = [
  {
    section: '1. Khổ giấy & Định lề',
    icon: '📄',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    rules: [
      'Khổ giấy: A4 (210mm × 297mm)',
      'Lề trên: 20–25mm | Lề dưới: 20–25mm',
      'Lề trái: 30–35mm | Lề phải: 15–20mm',
      'Văn bản trình bày theo chiều dài của khổ A4',
    ]
  },
  {
    section: '2. Phông chữ & Cỡ chữ',
    icon: '🔤',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    rules: [
      'Phông chữ: Times New Roman, Unicode TCVN 6909:2001',
      'Màu chữ: đen (RGB 0,0,0)',
      'Cỡ chữ nội dung chính: 13–14pt',
      'Số trang: cỡ 13–14pt, canh giữa, đặt ở lề trên',
      'Không hiển thị số trang thứ nhất',
    ]
  },
  {
    section: '3. Số & Ký hiệu văn bản',
    icon: '🔢',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    rules: [
      'Số văn bản: chữ số Ả Rập, cỡ 13pt, kiểu chữ đứng',
      'Số < 10 phải thêm số 0 phía trước (VD: 01, 02…)',
      'Ký hiệu: chữ IN HOA, cỡ 13pt, kiểu đứng',
      'Giữa số và ký hiệu dùng dấu gạch chéo (/)',
      'Giữa các nhóm viết tắt trong ký hiệu dùng dấu gạch nối (-)',
    ]
  },
  {
    section: '4. Tên loại & Trích yếu nội dung',
    icon: '📋',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    rules: [
      'Tên thể loại văn bản: chữ IN HOA, 13–14pt, đứng, in đậm, canh giữa',
      'Trích yếu nội dung: chữ thường, 13–14pt, đứng, in đậm, canh giữa',
      'Dưới trích yếu: đường kẻ ngang liền, dài 1/3–1/2 dòng chữ, canh giữa',
      'Công văn: trích yếu sau chữ "V/v", chữ thường, 12–13pt',
    ]
  },
  {
    section: '5. Căn cứ ban hành',
    icon: '⚖️',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    rules: [
      'Chữ in thường, kiểu chữ nghiêng (italic), 13–14pt',
      'Ghi rõ: tên loại văn bản, trích yếu, số/ký hiệu, cơ quan ban hành, ngày tháng năm',
      'Luật, Pháp lệnh: không ghi số, ký hiệu, cơ quan ban hành',
      'Sau mỗi căn cứ xuống dòng, kết thúc bằng dấu chấm phẩy (;)',
      'Dòng cuối cùng kết thúc bằng dấu chấm (.)',
    ]
  },
  {
    section: '6. Bố cục phần, chương, mục, điều',
    icon: '🗂️',
    color: 'text-rose-400',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    rules: [
      'Phần/Chương: số La Mã, canh giữa, in thường, đứng, đậm, 13–14pt',
      'Tiêu đề Phần/Chương: IN HOA ngay phía dưới, canh giữa, đứng, đậm',
      'Mục/Tiểu mục: số Ả Rập, canh giữa, in thường, đứng, đậm, 13–14pt',
      'Tiêu đề Mục/Tiểu mục: IN HOA, canh giữa, đứng, đậm',
      'Điều: số Ả Rập + dấu chấm, lùi đầu dòng 1–1,27cm, thường, đứng, đậm',
    ]
  },
  {
    section: '7. Chữ ký & Chức vụ',
    icon: '✍️',
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    rules: [
      'Họ tên: không ghi học hàm, học vị, danh hiệu danh dự',
      'Đơn vị vũ trang, giáo dục, y tế: có thể ghi quân hàm, học vị trước họ tên',
      'Chức vụ: chức vụ chính thức trong cơ quan, không ghi chức vụ pháp luật không quy định',
      'Chức danh: tên chức danh lãnh đạo trong tổ chức tư vấn',
    ]
  },
  {
    section: '8. Nơi nhận',
    icon: '📮',
    color: 'text-indigo-400',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    rules: [
      'Tờ trình/Báo cáo/Công văn: Phần 1 – "Kính gửi" (cơ quan trực tiếp giải quyết)',
      'Phần 2 – "Nơi nhận": bắt đầu bằng "Như trên", tiếp theo là các nơi liên quan',
      'Các văn bản khác: chỉ có "Nơi nhận" kèm danh sách đầy đủ',
    ]
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Parser: raw text → structured sections
// ─────────────────────────────────────────────────────────────────────────────

interface ParsedSection {
  type: 'heading1' | 'heading2' | 'heading3' | 'body' | 'italic' | 'numbered';
  text: string;
}

function parseRawText(rawText: string): ParsedSection[] {
  const lines = rawText.split('\n').filter(l => l.trim());
  return lines.map(line => {
    const t = line.trim();
    if (/^(PHẦN|CHƯƠNG)\s+[IVX]+/i.test(t)) return { type: 'heading1' as const, text: t.toUpperCase() };
    if (/^(MỤC|TIỂU MỤC)\s+\d+/i.test(t))  return { type: 'heading2' as const, text: t.toUpperCase() };
    if (/^Điều\s+\d+\./i.test(t))           return { type: 'heading3' as const, text: t };
    if (/^Căn cứ/i.test(t))                return { type: 'italic'   as const, text: t };
    if (/^\d+\.\s/.test(t) || /^[a-z]\)\s/i.test(t)) return { type: 'numbered' as const, text: t };
    return { type: 'body' as const, text: t };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCX generator
// ─────────────────────────────────────────────────────────────────────────────

interface DocumentMetadata {
  coQuan: string; soVanBan: string; kyHieu: string;
  diaDiem: string; ngayBanHanh: string; tenLoaiVanBan: string;
  trichYeu: string; noiNhan: string; chucVuNguoiKy: string; hoTenNguoiKy: string;
}

async function generateFormattedDocx(sections: ParsedSection[], meta: DocumentMetadata): Promise<Blob> {
  const marginTop    = convertMillimetersToTwip(25);
  const marginBottom = convertMillimetersToTwip(25);
  const marginLeft   = convertMillimetersToTwip(30);
  const marginRight  = convertMillimetersToTwip(20);
  const TNR = 'Times New Roman';

  const paras: Paragraph[] = [];

  const p = (opts: ConstructorParameters<typeof Paragraph>[0]) => new Paragraph(opts);
  const run = (opts: ConstructorParameters<typeof TextRun>[0]) => new TextRun(opts);

  // ── Header ──
  if (meta.coQuan) paras.push(p({ alignment: AlignmentType.CENTER, children: [run({ text: meta.coQuan.toUpperCase(), font: TNR, size: 26, bold: true })] }));
  if (meta.soVanBan || meta.kyHieu) {
    const soNum = parseInt(meta.soVanBan);
    const soStr = meta.soVanBan ? (soNum < 10 ? '0' + soNum : String(soNum)) : '';
    paras.push(p({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, children: [run({ text: `Số: ${soStr}/${meta.kyHieu}`, font: TNR, size: 26 })] }));
  }
  if (meta.diaDiem || meta.ngayBanHanh) paras.push(p({ alignment: AlignmentType.RIGHT, spacing: { before: 120, after: 120 }, children: [run({ text: `${meta.diaDiem}, ngày ${meta.ngayBanHanh}`, font: TNR, size: 26, italics: true })] }));
  if (meta.tenLoaiVanBan) paras.push(p({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 60 }, children: [run({ text: meta.tenLoaiVanBan.toUpperCase(), font: TNR, size: 28, bold: true })] }));
  if (meta.trichYeu) {
    paras.push(p({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 }, children: [run({ text: meta.trichYeu, font: TNR, size: 28, bold: true })] }));
    paras.push(p({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' } }, children: [run({ text: '', font: TNR, size: 26 })] }));
  }

  // ── Body ──
  for (const s of sections) {
    switch (s.type) {
      case 'heading1': paras.push(p({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 120 }, children: [run({ text: s.text, font: TNR, size: 28, bold: true })] })); break;
      case 'heading2': paras.push(p({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 100 }, children: [run({ text: s.text, font: TNR, size: 28, bold: true })] })); break;
      case 'heading3': paras.push(p({ indent: { firstLine: convertInchesToTwip(0.5) }, spacing: { before: 120, after: 60 }, children: [run({ text: s.text, font: TNR, size: 26, bold: true })] })); break;
      case 'italic':   paras.push(p({ indent: { firstLine: convertInchesToTwip(0.39) }, spacing: { before: 60, after: 60 }, children: [run({ text: s.text, font: TNR, size: 26, italics: true })] })); break;
      case 'numbered': paras.push(p({ indent: { left: convertInchesToTwip(0.5) }, spacing: { before: 60, after: 60 }, children: [run({ text: s.text, font: TNR, size: 26 })] })); break;
      default:         paras.push(p({ indent: { firstLine: convertInchesToTwip(0.39) }, alignment: AlignmentType.JUSTIFIED, spacing: { before: 60, after: 60 }, children: [run({ text: s.text, font: TNR, size: 26 })] }));
    }
  }

  // ── Footer: Nơi nhận + Chữ ký ──
  if (meta.noiNhan || meta.chucVuNguoiKy || meta.hoTenNguoiKy) {
    paras.push(p({ spacing: { before: 400, after: 0 }, children: [] }));
    if (meta.noiNhan) {
      paras.push(p({ children: [run({ text: 'Nơi nhận:', font: TNR, size: 26, bold: true })] }));
      meta.noiNhan.split('\n').filter(Boolean).forEach(line =>
        paras.push(p({ indent: { left: convertInchesToTwip(0.25) }, spacing: { before: 0, after: 40 }, children: [run({ text: `- ${line.trim()}`, font: TNR, size: 24 })] }))
      );
    }
    if (meta.chucVuNguoiKy) paras.push(p({ alignment: AlignmentType.RIGHT, spacing: { before: 120, after: 60 }, children: [run({ text: meta.chucVuNguoiKy.toUpperCase(), font: TNR, size: 26, bold: true })] }));
    if (meta.hoTenNguoiKy)  paras.push(p({ alignment: AlignmentType.RIGHT, spacing: { before: 600, after: 60 }, children: [run({ text: meta.hoTenNguoiKy, font: TNR, size: 26, bold: true })] }));
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: marginTop, bottom: marginBottom, left: marginLeft, right: marginRight },
          size: { width: convertMillimetersToTwip(210), height: convertMillimetersToTwip(297) },
        },
      },
      children: paras,
    }],
  });
  return Packer.toBlob(doc);
}

// ─────────────────────────────────────────────────────────────────────────────
// Accordion
// ─────────────────────────────────────────────────────────────────────────────

function AccordionItem({ rule, defaultOpen = false }: { rule: typeof ND30_RULES[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border ${rule.border} overflow-hidden`}>
      <button onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 ${rule.bg} transition-all cursor-pointer`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{rule.icon}</span>
          <span className={`font-bold text-sm ${rule.color}`}>{rule.section}</span>
        </div>
        {open ? <ChevronUp className={`w-4 h-4 ${rule.color}`} /> : <ChevronDown className={`w-4 h-4 ${rule.color}`} />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-slate-950/40 border-t border-white/5 space-y-2.5">
          {rule.rules.map((r, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${rule.color.replace('text-', 'bg-')}`} />
              <p className="text-[12px] text-slate-300 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

type ActiveTab = 'formatter' | 'guidelines';

export function ND30Formatter() {
  const [activeTab, setActiveTab]           = useState<ActiveTab>('formatter');
  const [uploadedFile, setUploadedFile]     = useState<File | null>(null);
  const [parsedSections, setParsedSections] = useState<ParsedSection[]>([]);
  const [isProcessing, setIsProcessing]     = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError]                   = useState('');
  const [previewHtml, setPreviewHtml]       = useState('');
  const [showPreview, setShowPreview]       = useState(false);
  const [downloadReady, setDownloadReady]   = useState(false);
  const [outputBlob, setOutputBlob]         = useState<Blob | null>(null);
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    coQuan: '', soVanBan: '', kyHieu: '',
    diaDiem: 'Hà Nội', ngayBanHanh: new Date().toLocaleDateString('vi-VN'),
    tenLoaiVanBan: '', trichYeu: '', noiNhan: '', chucVuNguoiKy: '', hoTenNguoiKy: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(''); setDownloadReady(false); setOutputBlob(null); setParsedSections([]); setPreviewHtml('');

    if (!file.name.match(/\.(docx?)$/i)) {
      setError('Chỉ hỗ trợ tệp Word (.docx). Vui lòng lưu lại dưới định dạng .docx trước khi tải lên.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { setError('Tệp quá lớn (tối đa 10MB)'); return; }

    setUploadedFile(file);
    setIsProcessing(true);
    setProcessingStep('Đang đọc tệp Word...');

    try {
      setProcessingStep('Đang trích xuất nội dung từ DOCX...');
      const [rawText, htmlPreview] = await Promise.all([
        extractTextFromDocx(file),
        extractHtmlPreviewFromDocx(file),
      ]);
      const sections = parseRawText(rawText);
      setParsedSections(sections);
      setPreviewHtml(htmlPreview);
      setProcessingStep(`✓ Phân tích xong ${sections.length} đoạn. Nhấn "Áp dụng ND30 & Xuất file" để tiếp tục.`);
    } catch (err: any) {
      setError('Không thể đọc tệp: ' + (err.message || 'Lỗi không xác định'));
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []); // eslint-disable-line

  const handleFormat = async () => {
    if (parsedSections.length === 0) return;
    setIsProcessing(true); setError('');
    setProcessingStep('Đang tạo văn bản chuẩn Nghị định 30...');
    try {
      await new Promise(r => setTimeout(r, 200));
      const blob = await generateFormattedDocx(parsedSections, metadata);
      setOutputBlob(blob); setDownloadReady(true);
      setProcessingStep('✓ Định dạng hoàn thành! Nhấn nút xanh để tải xuống.');
    } catch (err: any) {
      setError('Lỗi khi tạo file: ' + (err.message || 'Không xác định'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uploadedFile?.name.replace(/\.docx?$/i, '') || 'van-ban'}_ND30.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const meta = (field: keyof DocumentMetadata) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setMetadata(m => ({ ...m, [field]: e.target.value }));

  const ic = 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all';
  const lc = 'block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1';

  return (
    <div className="w-full flex flex-col space-y-5 text-slate-100 animate-in fade-in duration-300">

      {/* Banner */}
      <div className="relative overflow-hidden bg-linear-to-br from-red-500/10 via-orange-500/5 to-yellow-500/5 border border-red-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-5 shadow-md">
        <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-2xl shrink-0">
          <FileCheck className="w-8 h-8 text-red-400" />
        </div>
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] font-black uppercase tracking-wider text-red-400">Nghị định 30/2020/NĐ-CP</span>
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider text-amber-400">Công tác văn thư</span>
          </div>
          <h2 className="text-xl font-black text-white">Công cụ Định Dạng Văn Bản Chuẩn ND30</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Tải lên tệp Word <strong className="text-white">(.docx)</strong>, nhập thông tin thể thức, hệ thống sẽ tự động
            định dạng đúng chuẩn <strong className="text-amber-400">Nghị định 30/2020/NĐ-CP</strong>:
            phông Times New Roman, định lề chuẩn, số văn bản, ký hiệu, tiêu đề và xuất file Word.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-900/60 border border-white/10 rounded-2xl p-1.5">
        <button onClick={() => setActiveTab('formatter')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'formatter' ? 'bg-linear-to-r from-red-600 to-orange-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
          <Sparkles className="w-4 h-4" /> Định dạng văn bản ND30
        </button>
        <button onClick={() => setActiveTab('guidelines')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'guidelines' ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
          <BookOpen className="w-4 h-4" /> Hướng dẫn soạn thảo ND30
        </button>
      </div>

      {/* ═══ FORMATTER ═══ */}
      {activeTab === 'formatter' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left: Upload + Metadata */}
          <div className="lg:col-span-2 space-y-4">

            {/* Upload */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Upload className="w-4 h-4 text-yellow-400" />
                <h3 className="text-xs font-black uppercase text-white tracking-wider">Tải lên tệp Word (.docx)</h3>
              </div>

              {error && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-2xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <p className="text-[11px] text-red-300 leading-relaxed">{error}</p>
                </div>
              )}

              <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all group ${uploadedFile ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-700 hover:border-yellow-500/50 bg-slate-950/40 hover:bg-slate-950/80'}`}>
                <input ref={fileInputRef} type="file" accept=".docx" onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-emerald-300 truncate max-w-48">{uploadedFile.name}</p>
                      <p className="text-[10px] text-slate-500">{(uploadedFile.size / 1024).toFixed(0)} KB · DOCX</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setUploadedFile(null); setParsedSections([]); setDownloadReady(false); setOutputBlob(null); setPreviewHtml(''); setError(''); }}
                      className="p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-yellow-400 mx-auto mb-2 transition-colors" />
                    <p className="text-xs font-bold text-slate-400 group-hover:text-slate-200">Kéo thả hoặc nhấp để chọn</p>
                    <p className="text-[10px] text-slate-600 mt-1">Chỉ hỗ trợ <strong>.docx</strong> · Tối đa 10MB</p>
                  </>
                )}
              </div>

              {isProcessing && (
                <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />{processingStep}
                </div>
              )}
              {!isProcessing && parsedSections.length > 0 && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />Phân tích {parsedSections.length} đoạn văn bản thành công
                </div>
              )}
            </div>

            {/* Metadata form */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase text-white tracking-wider">Thông tin thể thức văn bản</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className={lc}>Tên cơ quan, tổ chức ban hành</label><input placeholder="VD: SỞ GIÁO DỤC VÀ ĐÀO TẠO TP.HCM" value={metadata.coQuan} onChange={meta('coQuan')} className={ic} /></div>
                <div><label className={lc}>Số văn bản</label><input placeholder="01, 25..." value={metadata.soVanBan} onChange={meta('soVanBan')} className={ic} /></div>
                <div><label className={lc}>Ký hiệu</label><input placeholder="QĐ-BGDĐT" value={metadata.kyHieu} onChange={meta('kyHieu')} className={ic} /></div>
                <div><label className={lc}>Địa điểm ban hành</label><input placeholder="Hà Nội" value={metadata.diaDiem} onChange={meta('diaDiem')} className={ic} /></div>
                <div><label className={lc}>Ngày ban hành</label><input placeholder="01 tháng 01 năm 2025" value={metadata.ngayBanHanh} onChange={meta('ngayBanHanh')} className={ic} /></div>
                <div className="col-span-2"><label className={lc}>Tên loại văn bản</label><input placeholder="QUYẾT ĐỊNH, THÔNG TƯ, CÔNG VĂN..." value={metadata.tenLoaiVanBan} onChange={meta('tenLoaiVanBan')} className={ic} /></div>
                <div className="col-span-2"><label className={lc}>Trích yếu nội dung</label><input placeholder="Về việc ban hành Quy chế hoạt động..." value={metadata.trichYeu} onChange={meta('trichYeu')} className={ic} /></div>
                <div><label className={lc}>Chức vụ người ký</label><input placeholder="Hiệu trưởng" value={metadata.chucVuNguoiKy} onChange={meta('chucVuNguoiKy')} className={ic} /></div>
                <div><label className={lc}>Họ tên người ký</label><input placeholder="Nguyễn Văn A" value={metadata.hoTenNguoiKy} onChange={meta('hoTenNguoiKy')} className={ic} /></div>
                <div className="col-span-2">
                  <label className={lc}>Nơi nhận (mỗi dòng một nơi)</label>
                  <textarea rows={3} placeholder={"Ban Giám hiệu;\nPhòng Giáo dục;\nLưu: VT."} value={metadata.noiNhan} onChange={meta('noiNhan')} className={`${ic} resize-none`} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Preview + Actions */}
          <div className="lg:col-span-3 space-y-4">

            {/* Preview */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-black uppercase text-white tracking-wider">Xem trước nội dung</h3>
                  {parsedSections.length > 0 && <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] text-emerald-400 font-bold">{parsedSections.length} đoạn</span>}
                </div>
                {previewHtml && <button onClick={() => setShowPreview(p => !p)} className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">{showPreview ? 'Thu gọn' : 'Xem đầy đủ'}</button>}
              </div>
              <div className="p-5">
                {!uploadedFile ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-600 space-y-3">
                    <FileText className="w-12 h-12 text-slate-800 animate-pulse" />
                    <p className="text-xs">Tải lên tệp Word để xem nội dung tại đây</p>
                  </div>
                ) : isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                    <p className="text-xs text-slate-400">{processingStep}</p>
                  </div>
                ) : previewHtml ? (
                  <div className={`overflow-y-auto transition-all ${showPreview ? 'max-h-[600px]' : 'max-h-52'} custom-scrollbar`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg text-gray-900 text-[12px] leading-relaxed" style={{ fontFamily: 'Times New Roman, serif' }}>
                      {/* ND30 mock header */}
                      {(metadata.coQuan || metadata.tenLoaiVanBan) && (
                        <div className="border-b border-gray-200 pb-4 mb-4 text-center space-y-1">
                          {metadata.coQuan && <p className="font-bold uppercase text-[11px]">{metadata.coQuan}</p>}
                          {metadata.soVanBan && <p className="text-[11px]">Số: {parseInt(metadata.soVanBan) < 10 ? '0' + parseInt(metadata.soVanBan) : metadata.soVanBan}/{metadata.kyHieu}</p>}
                          {metadata.diaDiem && <p className="text-right text-[11px] italic">{metadata.diaDiem}, ngày {metadata.ngayBanHanh}</p>}
                          {metadata.tenLoaiVanBan && <p className="font-bold uppercase text-sm mt-2">{metadata.tenLoaiVanBan}</p>}
                          {metadata.trichYeu && <><p className="font-bold text-[12px]">{metadata.trichYeu}</p><div className="border-b-2 border-gray-700 w-1/3 mx-auto mt-1" /></>}
                        </div>
                      )}
                      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Section tags */}
            {parsedSections.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-3">Cấu trúc phát hiện ({parsedSections.length} đoạn)</p>
                <div className="flex flex-wrap gap-2">
                  {(['heading1','heading2','heading3','italic','body','numbered'] as const).map(type => {
                    const count = parsedSections.filter(s => s.type === type).length;
                    if (!count) return null;
                    const label: Record<string,string> = { heading1:'Phần/Chương', heading2:'Mục', heading3:'Điều', italic:'Căn cứ', body:'Nội dung', numbered:'Danh sách' };
                    const clr: Record<string,string>   = { heading1:'bg-purple-500/15 border-purple-500/30 text-purple-300', heading2:'bg-blue-500/15 border-blue-500/30 text-blue-300', heading3:'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', italic:'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', body:'bg-slate-700/50 border-slate-600 text-slate-300', numbered:'bg-amber-500/15 border-amber-500/30 text-amber-300' };
                    return <span key={type} className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${clr[type]}`}>{label[type]}: {count}</span>;
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button onClick={handleFormat} disabled={parsedSections.length === 0 || isProcessing}
                className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-lg shadow-red-950/30 disabled:opacity-40 disabled:cursor-not-allowed">
                {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" />{processingStep}</> : <><Sparkles className="w-5 h-5" />Áp dụng định dạng Nghị định 30 & Xuất file</>}
              </button>
              {downloadReady && outputBlob && (
                <button onClick={handleDownload}
                  className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-950/30 animate-pulse">
                  <Download className="w-5 h-5" />Tải xuống tệp Word chuẩn ND30 (.docx)
                </button>
              )}
            </div>

            {/* Tip box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Lưu ý</p>
                  <ul className="text-[11px] text-slate-400 space-y-1 leading-relaxed">
                    <li>• Chỉ hỗ trợ định dạng <strong className="text-white">.docx</strong> (Word 2007 trở lên). Nếu có tệp .doc cũ, hãy mở trong Word và lưu lại dưới dạng .docx</li>
                    <li>• Công cụ tự nhận dạng Phần/Chương, Mục, Điều, Căn cứ từ từ khóa đầu dòng</li>
                    <li>• Phông xuất ra: <strong className="text-white">Times New Roman</strong> 13–14pt · Lề: Trái 3cm, Phải 2cm, Trên/Dưới 2.5cm</li>
                    <li>• Sau khi tải xuống, kiểm tra lại và chỉnh thủ công nếu cần thiết</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ GUIDELINES ═══ */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:'Khổ giấy', value:'A4', sub:'210×297mm', color:'text-blue-400', bg:'bg-blue-500/10', border:'border-blue-500/20' },
              { label:'Phông chữ', value:'Times New Roman', sub:'Unicode TCVN', color:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/20' },
              { label:'Cỡ chữ', value:'13–14pt', sub:'Nội dung chính', color:'text-amber-400', bg:'bg-amber-500/10', border:'border-amber-500/20' },
              { label:'Nghị định', value:'30/2020', sub:'Công tác văn thư', color:'text-red-400', bg:'bg-red-500/10', border:'border-red-500/20' },
            ].map(item => (
              <div key={item.label} className={`${item.bg} border ${item.border} rounded-2xl p-4 text-center`}>
                <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{item.label}</p>
                <p className="text-[9px] text-slate-600">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {ND30_RULES.map((rule, i) => <AccordionItem key={rule.section} rule={rule} defaultOpen={i === 0} />)}
          </div>

          {/* Reference table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-black uppercase text-white tracking-wider">Bảng tổng hợp yếu tố thể thức văn bản</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800">
                    {['Yếu tố thể thức','Phông/Cỡ chữ','Kiểu chữ','Canh lề'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-slate-500 font-black uppercase text-[9px] tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {[
                    ['Tên cơ quan ban hành','TNR, 13pt','Đứng, IN HOA, Đậm','Giữa'],
                    ['Số và ký hiệu','TNR, 13pt','Đứng, In thường','Giữa'],
                    ['Địa danh, ngày tháng','TNR, 13–14pt','Đứng/Nghiêng','Phải'],
                    ['Tên loại văn bản','TNR, 13–14pt','Đứng, IN HOA, Đậm','Giữa'],
                    ['Trích yếu nội dung','TNR, 13–14pt','Đứng, Thường, Đậm','Giữa'],
                    ['Nội dung căn cứ','TNR, 13–14pt','Nghiêng, Thường','Đều'],
                    ['Nội dung chính','TNR, 13–14pt','Đứng, Thường','Đều'],
                    ['Tiêu đề Phần/Chương','TNR, 13–14pt','Đứng, IN HOA, Đậm','Giữa'],
                    ['Tiêu đề Điều','TNR, 13–14pt','Đứng, Thường, Đậm','Trái (lùi 1cm)'],
                    ['Nơi nhận','TNR, 12–13pt','Đứng, Thường','Trái'],
                    ['Chức vụ người ký','TNR, 13–14pt','Đứng, IN HOA, Đậm','Giữa (ô ký)'],
                    ['Họ tên người ký','TNR, 13–14pt','Đứng, Thường, Đậm','Giữa (ô ký)'],
                  ].map(([el, font, style, align], i) => (
                    <tr key={el} className={i % 2 === 0 ? 'bg-slate-950/30' : ''}>
                      <td className="py-2 px-3 text-slate-300 font-medium">{el}</td>
                      <td className="py-2 px-3 text-cyan-400 font-mono">{font}</td>
                      <td className="py-2 px-3 text-amber-400">{style}</td>
                      <td className="py-2 px-3 text-emerald-400">{align}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
