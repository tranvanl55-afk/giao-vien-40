/* cSpell:disable */
import React from 'react';
import {
  CheckCircle2,
  Download,
  ShieldCheck,
  X,
} from 'lucide-react';
import { DUBLIN_CORE_METADATA } from '../exportScormPackage';

interface ComplianceProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  {
    element: 'dc:identifier',
    label: 'Mã định danh (Identifier)',
    value: `${DUBLIN_CORE_METADATA.identifier} | ĐVKT: ${DUBLIN_CORE_METADATA.knowledgeUnitCode}`,
  },
  { element: 'dc:source', label: 'Nguồn chương trình (Source)', value: DUBLIN_CORE_METADATA.source },
  { element: 'dc:language', label: 'Ngôn ngữ (Language)', value: DUBLIN_CORE_METADATA.language },
  { element: 'dc:relation', label: 'Liên kết hệ thống (Relation)', value: DUBLIN_CORE_METADATA.relation },
  { element: 'dc:coverage', label: 'Phạm vi áp dụng (Coverage)', value: DUBLIN_CORE_METADATA.coverage },
  { element: 'dc:rights', label: 'Bản quyền & Chia sẻ (Rights)', value: DUBLIN_CORE_METADATA.rights },
];

export const ComplianceProfileModal: React.FC<ComplianceProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5">
      <div className="bg-slate-50 border-2 border-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-950 via-indigo-900 to-emerald-900 text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-indigo-950 flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black">
                Thông tin Website &amp; Định danh Học liệu số (Metadata Dublin Core)
              </h2>
              <p className="text-[11px] text-emerald-200 font-medium">
                Trường TH&amp;THCS Ngô Chí Quốc • Chuẩn QĐ 791/QĐ-SGDĐT &amp; TCVN 7980:2015
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-rose-500 text-white cursor-pointer transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs text-indigo-950">
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
              ✅ Chuẩn kỹ thuật học liệu số của Website (Điều 8–14 QĐ 791)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Điều 8 (Tài liệu):</strong> PDF, DOCX, HTML5 tối ưu tốc độ tải.</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Điều 10–11 (Video/Audio):</strong> MP4/WebM 16:9, MP3, có phụ đề/lời thoại.</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Điều 12 (Kiểm tra đánh giá):</strong> Đủ 4 dạng (TN, Đ/S, Điền khuyết, Ghép đôi).</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Điều 13–14 (Đóng gói):</strong> HTML5 responsive, gói SCORM 1.2 (.zip).</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
