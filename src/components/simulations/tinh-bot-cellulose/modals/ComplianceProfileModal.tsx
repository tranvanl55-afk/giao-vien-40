/* cSpell:disable */
import React, { useState } from 'react';
import {
  CheckCircle2,
  Code2,
  Copy,
  Download,
  FileJson,
  Globe,
  Layers,
  Package,
  ShieldCheck,
  X,
} from 'lucide-react';

interface ComplianceProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DUBLIN_CORE_METADATA = {
  identifier: 'GDPT2018-KHTN9-B30-TINHBOT-CELLULOSE-2026',
  knowledgeUnitCode: '01-06-09-30-01-A-3',
  title: 'Chủ đề STEM/STEAM: Bắt đầu từ sự kết thúc (Bài 30: Tinh bột và Cellulose – KHTN 9)',
  creator: 'Trần Văn Lĩnh (Tổ KHTN – Trường TH&THCS Ngô Chí Quốc)',
  subject: 'Khoa học tự nhiên 9; Tinh bột; Cellulose; Glucose; Phản ứng thủy phân; Phản ứng Iodine; Giáo dục STEM/STEAM',
  description:
    'Học liệu số tương tác HTML5 tổ chức dạy học dự án STEAM theo tiến trình 5 hoạt động của Công văn 3089/BGDĐT-GDTrH, tích hợp thí nghiệm ảo, mô phỏng động học, kiểm tra đánh giá đa dạng 4 hình thức, bảng kiểm Rubric 5 mức và khảo sát phản hồi học sinh.',
  publisher: 'Trường TH&THCS Ngô Chí Quốc – Sở GDĐT TP. Hồ Chí Minh',
  contributor: 'Tổ chuyên môn KHTN – Trường TH&THCS Ngô Chí Quốc',
  date: '2026-11-22',
  type: 'Interactive Resource / Học liệu số tương tác (HTML5)',
  format: 'text/html; application/pdf; application/vnd.openxmlformats-officedocument.wordprocessingml.document; video/mp4; video/webm; audio/mpeg; application/json',
  source: 'Chương trình GDPT 2018 – Môn Khoa học tự nhiên lớp 9 (Thông tư 32/2018/TT-BGDĐT)',
  language: 'vi-VN; en-US (New Words & English Challenge)',
  relation: 'Hệ thống quản lý học liệu số dùng chung ngành GDĐT TP.HCM (QĐ 791/QĐ-SGDĐT)',
  coverage: 'Trung học cơ sở (Lớp 9) – Năm học 2026–2027',
  rights: 'Chia sẻ miễn phí dùng chung ngành GDĐT (CC BY-NC-SA 4.0) – Tuân thủ Điều 4 & Điều 5 QĐ 791/QĐ-SGDĐT',
};

const DUBLIN_CORE_ROWS: { element: string; label: string; value: string }[] = [
  { element: 'dc:title', label: 'Nhan đề (Title)', value: DUBLIN_CORE_METADATA.title },
  { element: 'dc:creator', label: 'Tác giả (Creator)', value: DUBLIN_CORE_METADATA.creator },
  { element: 'dc:subject', label: 'Chủ đề / Từ khóa (Subject)', value: DUBLIN_CORE_METADATA.subject },
  { element: 'dc:description', label: 'Mô tả tóm tắt (Description)', value: DUBLIN_CORE_METADATA.description },
  { element: 'dc:publisher', label: 'Đơn vị phát hành (Publisher)', value: DUBLIN_CORE_METADATA.publisher },
  { element: 'dc:contributor', label: 'Đơn vị đóng góp (Contributor)', value: DUBLIN_CORE_METADATA.contributor },
  { element: 'dc:date', label: 'Ngày ban hành / cập nhật (Date)', value: DUBLIN_CORE_METADATA.date },
  { element: 'dc:type', label: 'Loại tài nguyên (Type)', value: DUBLIN_CORE_METADATA.type },
  { element: 'dc:format', label: 'Định dạng kỹ thuật (Format)', value: DUBLIN_CORE_METADATA.format },
  { element: 'dc:identifier', label: 'Mã định danh (Identifier)', value: `${DUBLIN_CORE_METADATA.identifier} | ĐVKT: ${DUBLIN_CORE_METADATA.knowledgeUnitCode}` },
  { element: 'dc:source', label: 'Nguồn chương trình (Source)', value: DUBLIN_CORE_METADATA.source },
  { element: 'dc:language', label: 'Ngôn ngữ (Language)', value: DUBLIN_CORE_METADATA.language },
  { element: 'dc:relation', label: 'Liên kết hệ thống (Relation)', value: DUBLIN_CORE_METADATA.relation },
  { element: 'dc:coverage', label: 'Phạm vi áp dụng (Coverage)', value: DUBLIN_CORE_METADATA.coverage },
  { element: 'dc:rights', label: 'Bản quyền & Chia sẻ (Rights)', value: DUBLIN_CORE_METADATA.rights },
];

const CV3089_ACTIVITIES = [
  {
    act: 'Hoạt động 1: Xác định vấn đề & Tiêu chí sản phẩm',
    stage: 'Chặng 1 (Khởi động)',
    detail: 'Đặt tình huống tái sinh phế phẩm nông nghiệp/giấy vụn; giải ô chữ GREEN NEWSPAPER và tiếp nhận Bộ tiêu chí sản phẩm (Design Brief).',
  },
  {
    act: 'Hoạt động 2: Nghiên cứu kiến thức nền',
    stage: 'Chặng 2 (Tự học có hướng dẫn)',
    detail: 'Tìm hiểu tính chất vật lí, thí nghiệm ảo Iodine & Thủy phân, 16 điểm nóng ứng dụng và bài kiểm tra 12 câu (4 dạng thức).',
  },
  {
    act: 'Hoạt động 3: Đề xuất & Lựa chọn giải pháp thiết kế',
    stage: 'Chặng 3 (Ý tưởng & Quy trình)',
    detail: 'Thiết kế quy trình 4 bước định lượng (gam xơ : gam tinh bột : ml nước), trình bày, phản biện và đánh giá theo Bảng kiểm 5 mức.',
  },
  {
    act: 'Hoạt động 4: Chế tạo, thử nghiệm & đánh giá',
    stage: 'Chặng 4 (Thực hành tại nhà)',
    detail: 'Chế tạo sản phẩm mẫu, thử nghiệm độ bền/khả năng nảy mầm, ghi hình minh chứng và lưu nhật ký trên Padlet.',
  },
  {
    act: 'Hoạt động 5: Chia sẻ, thảo luận & điều chỉnh',
    stage: 'Chặng 5 & 6 (Ngày hội xanh & Tổng kết)',
    detail: 'Báo cáo gian hàng, đánh giá Rubric đa chiều (Tự đánh giá – Nhóm trưởng – Giáo viên), Body Pose Quiz & Khảo sát phản tư.',
  },
];

export const ComplianceProfileModal: React.FC<ComplianceProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'cv3089' | 'metadata' | 'share'>('cv3089');
  const [copiedType, setCopiedType] = useState<'embed' | 'link' | null>(null);
  const [isBuildingScorm, setIsBuildingScorm] = useState(false);

  const defaultPublicUrl =
    typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
      ? window.location.href
      : 'https://giao-vien-40.netlify.app/';
  const [scormUrl, setScormUrl] = useState<string>(defaultPublicUrl);

  if (!isOpen) return null;

  const shareUrl = scormUrl.trim() || defaultPublicUrl;
  const embedCode = `<iframe src="${shareUrl}" title="${DUBLIN_CORE_METADATA.title}" width="100%" height="760" style="border:0;border-radius:16px;" allow="fullscreen;microphone;camera" loading="lazy"></iframe>`;

  const handleCopy = async (text: string, type: 'embed' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // ignore clipboard restrictions
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(DUBLIN_CORE_METADATA, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata-dublin-core-bai30-khtn9.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadScormZip = async () => {
    setIsBuildingScorm(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const targetUrl = shareUrl.replace(/"/g, '&quot;');
      const safeTitle = DUBLIN_CORE_METADATA.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const imsManifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST-${DUBLIN_CORE_METADATA.identifier}" version="1.2"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsproject.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG_KHTN9_B30">
    <organization identifier="ORG_KHTN9_B30">
      <title>${safeTitle}</title>
      <item identifier="ITEM_B30_STEAM" identifierref="RES_B30_STEAM" isvisible="true">
        <title>${safeTitle}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES_B30_STEAM" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="metadata-dublin-core.json"/>
    </resource>
  </resources>
</manifest>
`;

      const scormIndexHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0f172a; font-family: system-ui, -apple-system, sans-serif; }
    iframe { width: 100%; height: 100%; border: 0; display: block; background: #fff; }
    .fallback-bar { position: fixed; right: 12px; bottom: 12px; z-index: 99; display: flex; gap: 8px; }
    .fallback-btn { background: rgba(15,23,42,0.82); color: #fff; border: 1px solid rgba(255,255,255,0.25); padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-decoration: none; backdrop-filter: blur(6px); }
  </style>
</head>
<body>
  <iframe src="${targetUrl}" title="${safeTitle}" allow="fullscreen; microphone; camera; autoplay"></iframe>
  <div class="fallback-bar">
    <a class="fallback-btn" href="${targetUrl}" target="_blank" rel="noopener noreferrer">↗ Mở tab mới nếu LMS chặn khung</a>
  </div>
  <script>
    (function () {
      function findScormApi(win) {
        var tries = 0;
        while (win && !win.API && win.parent && win.parent !== win && tries < 10) {
          tries++;
          win = win.parent;
        }
        return (win && win.API) || (window.opener && window.opener.API) || null;
      }
      var api = findScormApi(window);
      if (api) {
        try {
          api.LMSInitialize('');
          api.LMSSetValue('cmi.core.lesson_status', 'completed');
          api.LMSCommit('');
        } catch (e) {}
      }
      window.addEventListener('beforeunload', function () {
        if (api) {
          try {
            api.LMSCommit('');
            api.LMSFinish('');
          } catch (e) {}
        }
      });
    })();
  </script>
</body>
</html>
`;

      zip.file('imsmanifest.xml', imsManifestXml);
      zip.file('index.html', scormIndexHtml);
      zip.file('metadata-dublin-core.json', JSON.stringify(DUBLIN_CORE_METADATA, null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SCORM12-Bai30-TinhBot-Cellulose-KHTN9.zip';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsBuildingScorm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5">
      <div className="bg-slate-50 border-2 border-white rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-950 via-indigo-900 to-emerald-900 text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-indigo-950 flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black">
                Hồ sơ Học liệu số &amp; Chủ đề STEM chuẩn QĐ 791/QĐ-SGDĐT &amp; CV 3089
              </h2>
              <p className="text-[11px] text-emerald-200 font-medium">
                Trường TH&amp;THCS Ngô Chí Quốc • Thang chấm 100 điểm (STEM 40đ • Sư phạm 20đ • Sẵn sàng số 30đ • Dùng chung 10đ)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-rose-500 text-white cursor-pointer transition-colors"
            title="Đóng hồ sơ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-white border-b border-indigo-100 px-4 py-2.5 flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('cv3089')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'cv3089'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Chuẩn CV 3089 &amp; Sư phạm (60đ)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('metadata')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'metadata'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>2. Metadata Dublin Core &amp; Định danh (30đ)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'share'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. Nhúng LMS, Chia sẻ &amp; Bản quyền (10đ)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs text-indigo-950">
          {activeTab === 'cv3089' && (
            <>
              <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-2xs space-y-2">
                <h3 className="text-sm font-black text-indigo-950">
                  🎯 Yêu cầu cần đạt (Chương trình GDPT 2018 — KHTN 9, Bài 30)
                </h3>
                <ul className="space-y-1 text-xs font-medium text-slate-700 list-disc pl-5">
                  <li>Nêu được trạng thái tự nhiên, tính chất vật lí của tinh bột và cellulose; viết được công thức chung (C₆H₁₀O₅)ₙ.</li>
                  <li>Trình bày được tính chất hóa học: phản ứng màu của hồ tinh bột với iodine; phản ứng thủy phân (xúc tác enzyme/acid) tạo glucose.</li>
                  <li>Trình bày được sự tạo thành qua quang hợp, vai trò trong cây xanh và ứng dụng thực tiễn gắn với chế độ dinh dưỡng hợp lí.</li>
                  <li><strong>Năng lực STEAM:</strong> Vận dụng kiến thức chế tạo sản phẩm xanh (giấy nảy mầm, chậu tự phân hủy) từ phụ phẩm nông nghiệp giàu cellulose và chất kết dính tinh bột.</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-2xs">
                <h3 className="text-sm font-black text-indigo-950 mb-2.5">
                  🧭 Đối chiếu Tiến trình 5 Hoạt động (CV 3089/BGDĐT-GDTrH) ↔ 6 Chặng E-learning
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-950 border-b border-indigo-200">
                        <th className="p-2.5 font-black">Hoạt động theo CV 3089</th>
                        <th className="p-2.5 font-black">Chặng trên Website</th>
                        <th className="p-2.5 font-black">Sản phẩm &amp; Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {CV3089_ACTIVITIES.map((row) => (
                        <tr key={row.act} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-indigo-950">{row.act}</td>
                          <td className="p-2.5 font-bold text-emerald-700 whitespace-nowrap">{row.stage}</td>
                          <td className="p-2.5 font-medium text-slate-700">{row.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'metadata' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-black text-emerald-950 text-xs sm:text-sm">
                    🏷️ Mã định danh đơn vị kiến thức (Điều 18 QĐ 791):{' '}
                    <code className="px-2 py-0.5 rounded bg-white border border-emerald-300 text-emerald-800">
                      {DUBLIN_CORE_METADATA.knowledgeUnitCode}
                    </code>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 font-medium mt-1">
                    Chuẩn hóa 15 phần tử Siêu dữ liệu Dublin Core (TCVN 7980:2015 – ISO 15836:2009) &amp; định dạng JSON (Điều 25 QĐ 791).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải metadata-dublin-core.json</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-950 border-b border-indigo-200">
                      <th className="p-2.5 font-black w-40">Phần tử (Dublin Core)</th>
                      <th className="p-2.5 font-black w-52">Tên trường</th>
                      <th className="p-2.5 font-black">Giá trị đặc tả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DUBLIN_CORE_ROWS.map((row) => (
                      <tr key={row.element} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{row.element}</td>
                        <td className="p-2.5 font-bold text-indigo-950">{row.label}</td>
                        <td className="p-2.5 font-medium text-slate-700">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-2xs">
                <h4 className="font-black text-indigo-950 mb-2">
                  ✅ Đối chiếu Tiêu chuẩn kỹ thuật học liệu số (Điều 8–14 QĐ 791)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Điều 8 (Tài liệu):</strong> PDF, DOCX, HTML5 tối ưu tốc độ tải.</span></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Điều 10–11 (Video/Audio):</strong> MP4/WebM 16:9, MP3, có phụ đề/lời thoại.</span></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Điều 12 (Kiểm tra đánh giá):</strong> Đủ 4 dạng (TN, Đ/S, Điền khuyết, Ghép đôi).</span></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Điều 13–14 (Nhúng &amp; Tương tác):</strong> HTML5 responsive, mã nhúng LMS/LCMS.</span></div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'share' && (
            <div className="space-y-4">
              {/* ĐÓNG GÓI SCORM 1.2 (.ZIP) UPLOAD TRỰC TIẾP LÊN LMS */}
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-emerald-700" />
                      <span>Đóng gói chuẩn SCORM 1.2 (.ZIP) để upload trực tiếp lên LMS (Điều 3.12 QĐ 791)</span>
                    </h3>
                    <p className="text-[11px] text-emerald-900/80 font-medium mt-0.5">
                      Gói .zip đã có sẵn <code>imsmanifest.xml</code>, <code>index.html</code> kết nối SCORM API và <code>metadata-dublin-core.json</code>. Thầy tải về rồi bấm <strong>CHỌN FILE .ZIP → UPLOAD</strong> trên LMS là xong!
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isBuildingScorm}
                    onClick={handleDownloadScormZip}
                    className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isBuildingScorm ? 'Đang đóng gói...' : 'Tải gói SCORM 1.2 (.ZIP)'}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white/90 p-2 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-black text-emerald-950 shrink-0">
                    🌐 Link web nhúng trong SCORM:
                  </span>
                  <input
                    type="url"
                    value={scormUrl}
                    onChange={(e) => setScormUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 text-xs font-mono text-indigo-950 bg-transparent outline-none px-1"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span>Mã nhúng HTML5 vào Hệ thống LMS / LCMS / Kho học liệu dùng chung (Điều 13 QĐ 791)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleCopy(embedCode, 'embed')}
                    className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedType === 'embed' ? '✓ Đã copy mã nhúng!' : 'Copy mã nhúng <iframe>'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-emerald-300 p-3 rounded-xl text-[11px] overflow-x-auto font-mono">
                  {embedCode}
                </pre>
              </div>

              <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-indigo-950">🔗 Đường dẫn truy cập &amp; chia sẻ công khai</h3>
                  <button
                    type="button"
                    onClick={() => handleCopy(shareUrl, 'link')}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedType === 'link' ? '✓ Đã copy link!' : 'Copy link chia sẻ'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-950 break-all">
                  {shareUrl}
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-1.5">
                <h3 className="text-sm font-black text-amber-950">
                  ⚖️ Bản quyền, Tác giả &amp; Chính sách dùng chung (Điều 4 &amp; Điều 5 QĐ 791/QĐ-SGDĐT)
                </h3>
                <p className="text-xs font-medium text-amber-950/90 leading-relaxed">
                  • <strong>Tác giả / Nhóm chuyên môn:</strong> Thầy Trần Văn Lĩnh — Tổ Khoa học tự nhiên, Trường TH&amp;THCS Ngô Chí Quốc.<br />
                  • <strong>Phạm vi chia sẻ:</strong> Học liệu số được chia sẻ miễn phí trên Hệ thống quản lý học liệu số dùng chung của ngành GDĐT TP. Hồ Chí Minh (Giấy phép CC BY-NC-SA 4.0 — phi thương mại, ghi nguồn tác giả).<br />
                  • <strong>Tính tái sử dụng:</strong> Giáo viên các trường có thể nhúng trực tiếp qua <code>&lt;iframe&gt;</code>, tải PDF/DOCX phiếu học tập, xuất Word 6 chặng hoặc tải tệp <code>metadata-dublin-core.json</code> để nhập vào kho LMS/LCMS.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
