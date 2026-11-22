/* cSpell:disable */
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Printer, Send } from 'lucide-react';

export interface SurveyQuestionItem {
  num: number;
  text: string;
}

export interface SurveySectionGroup {
  roman: string;
  title: string;
  items: SurveyQuestionItem[];
}

export const SURVEY_SECTIONS: SurveySectionGroup[] = [
  {
    roman: 'I',
    title: 'Hiệu quả học tập qua E-learning và trò chơi tương tác',
    items: [
      {
        num: 1,
        text: 'Giao diện Website E-learning, nhân vật hướng dẫn Sprout và nút hướng dẫn từng nhiệm vụ rõ ràng, dễ tự học tại nhà.',
      },
      {
        num: 2,
        text: 'Thí nghiệm ảo (nhỏ iodine ở nhiệt độ thường, mô phỏng thủy phân cắt mạch) giúp em hiểu rõ bản chất hóa học của tinh bột và cellulose.',
      },
      {
        num: 3,
        text: 'Trò chơi trên lớp (Đường đua Mầm Xanh, Body Pose Quiz) tạo không khí sôi nổi và giúp em ghi nhớ kiến thức lâu hơn.',
      },
    ],
  },
  {
    roman: 'II',
    title: 'Rèn luyện năng lực STEAM, số hóa và sử dụng AI có trách nhiệm',
    items: [
      {
        num: 4,
        text: 'Hoạt động thiết kế quy trình 4 bước và thử nghiệm đối chứng tại nhà giúp em rèn luyện tư duy kỹ thuật và kỹ năng giải quyết vấn đề.',
      },
      {
        num: 5,
        text: 'Việc lưu nhật ký trên Padlet và đánh giá đồng đẳng trực tiếp trên Website giúp các thành viên hợp tác công bằng, minh bạch.',
      },
      {
        num: 6,
        text: 'Em biết dùng AI để tra cứu, hỗ trợ thiết kế nhưng luôn tự kiểm chứng lại kiến thức khoa học và ghi chú minh bạch.',
      },
    ],
  },
  {
    roman: 'III',
    title: 'Nhận thức, thái độ và hành động sống xanh',
    items: [
      {
        num: 7,
        text: 'Dự án giúp em hiểu rõ ý nghĩa của việc tái chế giấy vụn, phụ phẩm nông nghiệp để giảm chặt phá rừng và hạn chế rác thải nhựa.',
      },
      {
        num: 8,
        text: 'Sau chủ đề, em có thói quen tiết kiệm giấy, sử dụng hợp lí thực phẩm giàu tinh bột và sẵn sàng lan tỏa lối sống xanh.',
      },
    ],
  },
];

export const SURVEY_INTEREST_OPTIONS = ['Rất thích', 'Thích', 'Bình thường', 'Chưa thích'] as const;

export interface Stage6SurveySubmissionPayload {
  studentName: string;
  className: string;
  groupName: string;
  surveyDate: string;
  ratings: Record<number, number>;
  interestLevel: (typeof SURVEY_INTEREST_OPTIONS)[number] | '';
  favoriteStageNote: string;
  difficultySolutionNote: string;
  suggestionNote: string;
}

interface Stage6SurveyBoxProps {
  isSubmitted: boolean;
  onSubmitSurvey: (payload: Stage6SurveySubmissionPayload) => Promise<{ ok: boolean; text: string }>;
}

const getDefaultTodayVi = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const Stage6SurveyBox: React.FC<Stage6SurveyBoxProps> = ({
  isSubmitted,
  onSubmitSurvey,
}) => {
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('9A15');
  const [groupName, setGroupName] = useState('');
  const [surveyDate, setSurveyDate] = useState(getDefaultTodayVi);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [interestLevel, setInterestLevel] = useState<(typeof SURVEY_INTEREST_OPTIONS)[number] | ''>('');
  const [favoriteStageNote, setFavoriteStageNote] = useState('');
  const [difficultySolutionNote, setDifficultySolutionNote] = useState('');
  const [suggestionNote, setSuggestionNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const answeredCount = Object.keys(ratings).length;

  const handleSetRating = (num: number, score: number) => {
    setRatings((prev) => ({ ...prev, [num]: score }));
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (answeredCount < 8) {
      setFeedback({
        ok: false,
        text: `Em hãy chọn đủ mức độ (1–5) cho cả 8 nội dung ở Phần A (đã chọn ${answeredCount}/8).`,
      });
      return;
    }
    if (!interestLevel) {
      setFeedback({
        ok: false,
        text: 'Em hãy chọn mức độ yêu thích chung đối với chủ đề ở Phần B nhé!',
      });
      return;
    }

    setIsSending(true);
    setFeedback(null);
    const result = await onSubmitSurvey({
      studentName: studentName.trim(),
      className: className.trim() || '9A',
      groupName: groupName.trim(),
      surveyDate: surveyDate.trim() || getDefaultTodayVi(),
      ratings,
      interestLevel,
      favoriteStageNote: favoriteStageNote.trim(),
      difficultySolutionNote: difficultySolutionNote.trim(),
      suggestionNote: suggestionNote.trim(),
    });
    setIsSending(false);
    setFeedback(result);
    if (result.ok) {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.65 } });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Tiêu đề phiếu */}
      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-2xl p-4 text-center">
        <h3 className="text-sm md:text-base font-black text-indigo-950 uppercase">
          PHIẾU KHẢO SÁT Ý KIẾN HỌC SINH SAU CHỦ ĐỀ
        </h3>
        <p className="text-xs font-bold text-emerald-800 mt-1">
          Chủ đề STEM/STEAM: Bắt đầu từ sự kết thúc (Bài 30: Tinh bột và Cellulose – KHTN 9)
        </p>
      </div>

      {/* Thông tin học sinh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-[11px] font-black text-indigo-950 block mb-1">
            Họ và tên (có thể để trống nếu ẩn danh):
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Ghi tên hoặc để trống..."
            className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-950 outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-[11px] font-black text-indigo-950 block mb-1">Lớp:</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Ví dụ: 9A15"
            className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-950 outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-[11px] font-black text-indigo-950 block mb-1">Nhóm:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Ví dụ: Nhóm 1"
            className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-950 outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-[11px] font-black text-indigo-950 block mb-1">Ngày khảo sát:</label>
          <input
            type="text"
            value={surveyDate}
            onChange={(e) => setSurveyDate(e.target.value)}
            placeholder="dd/mm/2026"
            className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-950 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* PHẦN A */}
      <div className="flex flex-col gap-2.5">
        <div>
          <h4 className="text-xs md:text-sm font-black text-indigo-950 uppercase">
            PHẦN A. ĐÁNH GIÁ TRẢI NGHIỆM HỌC TẬP VÀ DỰ ÁN
          </h4>
          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
            (Em hãy chọn mức độ đồng ý của bản thân: <strong>1</strong> – Hoàn toàn không đồng ý;{' '}
            <strong>2</strong> – Không đồng ý; <strong>3</strong> – Phân vân;{' '}
            <strong>4</strong> – Đồng ý; <strong>5</strong> – Hoàn toàn đồng ý)
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-indigo-200 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-950 text-white text-[11px] font-black">
                <th className="p-2.5 w-10 text-center">STT</th>
                <th className="p-2.5">Nội dung khảo sát</th>
                <th className="p-2.5 w-56 text-center">Mức độ (1 → 5)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-100 text-xs">
              {SURVEY_SECTIONS.map((sec) => (
                <React.Fragment key={sec.roman}>
                  <tr className="bg-indigo-50/90 font-black text-indigo-950">
                    <td className="p-2.5 text-center">{sec.roman}</td>
                    <td colSpan={2} className="p-2.5">
                      {sec.title}
                    </td>
                  </tr>
                  {sec.items.map((item) => {
                    const currentVal = ratings[item.num];
                    return (
                      <tr key={item.num} className="hover:bg-slate-50/80">
                        <td className="p-2.5 text-center font-black text-indigo-900">{item.num}</td>
                        <td className="p-2.5 font-medium text-indigo-950 leading-relaxed">
                          {item.text}
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center justify-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((score) => {
                              const active = currentVal === score;
                              return (
                                <button
                                  key={score}
                                  type="button"
                                  onClick={() => handleSetRating(item.num, score)}
                                  className={`w-8 h-8 rounded-lg font-black text-xs transition-all cursor-pointer border ${
                                    active
                                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs scale-105'
                                      : 'bg-slate-50 text-indigo-900 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                                  }`}
                                >
                                  {score}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PHẦN B */}
      <div className="flex flex-col gap-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl p-4">
        <h4 className="text-xs md:text-sm font-black text-indigo-950 uppercase">
          PHẦN B. Ý KIẾN ĐÓNG GÓP VÀ PHẢN TƯ CÁ NHÂN
        </h4>

        <div>
          <label className="text-xs font-black text-indigo-950 block mb-2">
            Mức độ yêu thích chung của em đối với chủ đề &ldquo;Bắt đầu từ sự kết thúc&rdquo;:
          </label>
          <div className="flex flex-wrap gap-2">
            {SURVEY_INTEREST_OPTIONS.map((opt) => {
              const active = interestLevel === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setInterestLevel(opt);
                    setFeedback(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-white text-indigo-950 border-indigo-200 hover:border-indigo-400'
                  }`}
                >
                  {active ? '☑ ' : '☐ '}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-indigo-950 block mb-1">
            1. Chặng hoặc hoạt động nào trong 6 chặng khiến em ấn tượng và hứng thú nhất? Vì sao?
          </label>
          <textarea
            rows={2}
            value={favoriteStageNote}
            onChange={(e) => setFavoriteStageNote(e.target.value)}
            placeholder="Chia sẻ cảm nhận của em..."
            className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-indigo-950 font-medium outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-indigo-950 block mb-1">
            2. Trong quá trình chế tạo sản phẩm tái sinh tại nhà (xử lí nguyên liệu, phối trộn hồ tinh bột, ươm hạt...), nhóm em gặp khó khăn gì và đã khắc phục như thế nào?
          </label>
          <textarea
            rows={2}
            value={difficultySolutionNote}
            onChange={(e) => setDifficultySolutionNote(e.target.value)}
            placeholder="Ví dụ: Bã mía hơi thô nên nhóm xay nhuyễn thêm và tăng tỉ lệ hồ tinh bột..."
            className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-indigo-950 font-medium outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-indigo-950 block mb-1">
            3. Em có góp ý gì để thầy cô cải tiến bài giảng E-learning, trò chơi hoặc tổ chức các dự án STEM tiếp theo hấp dẫn hơn?
          </label>
          <textarea
            rows={2}
            value={suggestionNote}
            onChange={(e) => setSuggestionNote(e.target.value)}
            placeholder="Góp ý chân thành của em..."
            className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-indigo-950 font-medium outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {feedback && (
        <div
          className={`rounded-2xl px-4 py-2.5 text-xs font-bold border ${
            feedback.ok
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-xs font-bold text-emerald-800">
          Cảm ơn em đã tham gia khảo sát trung thực và trách nhiệm!
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              import('../exportFormDocx').then((m) =>
                m.exportSurveyFormToWord({
                  studentName: studentName.trim(),
                  className: className.trim(),
                  groupName: groupName.trim(),
                  surveyDate: surveyDate.trim(),
                  sections: SURVEY_SECTIONS,
                  ratings,
                  interestLevel,
                  favoriteStageNote: favoriteStageNote.trim(),
                  difficultySolutionNote: difficultySolutionNote.trim(),
                  suggestionNote: suggestionNote.trim(),
                })
              );
            }}
            className="px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Word (.docx)</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-indigo-950 border border-indigo-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Xuất PDF / In</span>
          </button>
          <button
            type="button"
            disabled={isSending}
            onClick={handleSubmit}
            className={`px-5 py-2 rounded-full font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all disabled:opacity-50 ${
              isSubmitted
                ? 'bg-emerald-600 text-white'
                : 'bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
            }`}
          >
            {isSubmitted ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
            <span>
              {isSending
                ? 'Đang gửi...'
                : isSubmitted
                  ? '✓ Đã gửi phiếu khảo sát (Gửi lại)'
                  : 'Gửi phiếu khảo sát'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
