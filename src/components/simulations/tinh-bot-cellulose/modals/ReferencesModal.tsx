/* cSpell:disable */
import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

interface ReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferencesModal({ isOpen, onClose }: ReferencesModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 z-50 bg-indigo-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-2 border-indigo-100 rounded-3xl max-w-4xl w-full max-h-[88vh] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="bg-linear-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black uppercase tracking-wide text-amber-300">
                📚 TÀI LIỆU THAM KHẢO &amp; NGUỒN HỌC LIỆU DỰ ÁN
              </h3>
              <p className="text-xs text-indigo-200 font-medium">
                Dự án STEAM: &ldquo;Bắt đầu từ sự kết thúc&rdquo; — Bài 30: Tinh bột và Cellulose (Môn KHTN 9)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black cursor-pointer"
          >
            ✕ Đóng
          </button>
        </div>

        <div className="p-5 md:p-6 overflow-y-auto space-y-4 text-xs md:text-sm text-indigo-950 leading-relaxed">
          {/* Nhóm 1 */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-indigo-900 uppercase text-xs flex items-center gap-1.5">
              <span>1. Văn bản chỉ đạo &amp; Chương trình Giáo dục phổ thông</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li>
                <strong>Bộ Giáo dục và Đào tạo (2018)</strong>, <em>Chương trình Giáo dục phổ thông môn Khoa học tự nhiên</em> (Ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018).
              </li>
              <li>
                <strong>Bộ Giáo dục và Đào tạo (2020)</strong>, <em>Công văn số 3089/BGDĐT-GDTrH ngày 14/8/2020 về việc triển khai thực hiện giáo dục STEM trong giáo dục trung học</em>.
              </li>
              <li>
                <strong>Bộ Giáo dục và Đào tạo (2021)</strong>, <em>Thông tư số 22/2021/TT-BGDĐT ngày 20/7/2021 quy định về đánh giá học sinh trung học cơ sở và học sinh trung học phổ thông</em>.
              </li>
            </ul>
          </div>

          {/* Nhóm 2 */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-emerald-900 uppercase text-xs flex items-center gap-1.5">
                  <span>2. Sách giáo khoa &amp; Tài liệu chuyên môn Hóa học – Sinh học</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>
                    <strong>Sách giáo khoa &amp; Sách giáo viên Khoa học tự nhiên 9</strong> (Bộ sách Chân trời sáng tạo / Kết nối tri thức với cuộc sống / Cánh diều) — Chủ đề Carbohydrate: <em>Tinh bột và Cellulose</em>, NXB Giáo dục Việt Nam.
                  </li>
                  <li>
                    <strong>Anastas, P. T., &amp; Warner, J. C.</strong> (1998). <em>Green Chemistry: Theory and Practice</em>. Oxford University Press.
                  </li>
                </ul>
          </div>

          {/* Nhóm 3 */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-amber-900 uppercase text-xs flex items-center gap-1.5">
              <span>3. Tài liệu Phương pháp Dạy học Dự án &amp; Kiểm tra đánh giá</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li>
                <strong>Bộ Giáo dục và Đào tạo (2019)</strong>, <em>Tài liệu tập huấn Xây dựng tiêu chí đánh giá (Rubric) và dạy học dựa trên dự án (Project-Based Learning) môn Khoa học tự nhiên cấp THCS</em>.
              </li>
              <li>
                <strong>Cục Công nghệ thông tin — Bộ Giáo dục và Đào tạo</strong>, <em>Hướng dẫn thiết kế Thiết bị dạy học số và Bài giảng E-learning tương tác trong trường phổ thông</em>.
              </li>
            </ul>
          </div>

          {/* Nhóm 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-slate-800 uppercase text-xs flex items-center gap-1.5">
              <span>4. Công cụ số &amp; Hạ tầng công nghệ tích hợp trong bài giảng</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li>
                <strong>Mô phỏng &amp; Trò chơi tương tác:</strong> HTML5 Canvas 2D (Mô phỏng động học phân tử phản ứng thủy phân tinh bột &amp; phản ứng màu Iodine), Trò chơi vận động Smart TV, React 19, TypeScript &amp; Tailwind CSS.
              </li>
              <li>
                <strong>Không gian cộng tác &amp; Lưu trữ đám mây:</strong> Bảng tương tác số Padlet, Google Drive, Google Sheets Webhook &amp; Cơ sở dữ liệu thời gian thực Firebase Cloud Firestore.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
