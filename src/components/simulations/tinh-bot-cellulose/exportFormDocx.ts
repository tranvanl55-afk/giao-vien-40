/* cSpell:disable */
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import {
  type RubricFormState,
  type Stage3RubricCriterion,
  type Stage6MemberRecord,
  STAGE6_LEADER_RUBRIC_CRITERIA,
  STAGE6_SELF_RUBRIC_CRITERIA,
  STAGE6_TEACHER_RUBRIC_CRITERIA,
  getCriterionPointFromState,
  getRubricSummary,
  getStage6RankInfo,
} from './rubricData';

const FONT = 'Times New Roman';

const thinBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
  left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
  right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
};

const p = (text: string, opts?: { bold?: boolean; italic?: boolean; size?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType]; color?: string; after?: number }) =>
  new Paragraph({
    alignment: opts?.align,
    spacing: { after: opts?.after ?? 100 },
    children: [
      new TextRun({
        text,
        font: FONT,
        bold: opts?.bold,
        italics: opts?.italic,
        size: opts?.size ?? 24,
        color: opts?.color,
      }),
    ],
  });

const cell = (text: string, opts?: { bold?: boolean; fill?: string; color?: string; widthPct?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType] }) =>
  new TableCell({
    width: opts?.widthPct ? { size: opts.widthPct, type: WidthType.PERCENTAGE } : undefined,
    shading: opts?.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: opts?.align,
        children: [
          new TextRun({
            text,
            font: FONT,
            bold: opts?.bold,
            size: 22,
            color: opts?.color,
          }),
        ],
      }),
    ],
  });

const saveDocx = async (doc: Document, filename: string) => {
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export async function exportRubricFormToWord(params: {
  stageShortLabel: string;
  stageFullTitle: string;
  criteria: Stage3RubricCriterion[];
  state: RubricFormState;
}) {
  const { stageShortLabel, stageFullTitle, criteria, state } = params;
  const summary = getRubricSummary(criteria, state);
  const rank = getStage6RankInfo(summary.totalPoints);

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorders,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell('Tiêu chí', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 30 }),
          cell('Trọng số', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 14, align: AlignmentType.CENTER }),
          cell('Mức chọn & Mô tả', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 44 }),
          cell('Điểm', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 12, align: AlignmentType.CENTER }),
        ],
      }),
      ...criteria.map((c) => {
        const chosenLv = state.selections[c.id];
        const lvObj = c.levels.find((l) => l.level === chosenLv);
        const pt = getCriterionPointFromState(c, state);
        return new TableRow({
          children: [
            cell(c.title, { bold: true }),
            cell(`${c.weightPercent}% (Tối đa ${c.maxPoints}đ)`, { align: AlignmentType.CENTER }),
            cell(lvObj ? `Mức ${lvObj.level}/5 (${lvObj.label}): ${lvObj.bullets.join('; ')}` : 'Chưa chấm'),
            cell(pt !== undefined ? `${pt}đ` : '—', { bold: true, align: AlignmentType.CENTER }),
          ],
        });
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `PHIẾU ĐÁNH GIÁ RUBRIC ${stageShortLabel.toUpperCase()}`,
                font: FONT,
                bold: true,
                size: 28,
              }),
            ],
          }),
          p(stageFullTitle, { italic: true, align: AlignmentType.CENTER, after: 160 }),
          p(`Lớp: ${state.className || '................'}   |   Nhóm chấm: ${state.evaluatorGroup || '................'}   |   Nhóm được chấm: ${state.targetGroup || '................'}`),
          p(`Tổng điểm: ${summary.totalPoints} / 10 điểm   |   Xếp loại: ${rank.label}`, { bold: true, after: 160 }),
          table,
          p(`Nhận xét & góp ý: ${state.feedbackNote || '................................................................'}`, { after: 120 }),
        ],
      },
    ],
  });

  await saveDocx(doc, `Phieu_Rubric_${stageShortLabel.replace(/\s+/g, '_')}.docx`);
}

export async function exportStage6SelfToWord(params: {
  studentName: string;
  className: string;
  groupName: string;
  dateStr: string;
  scores: Record<string, number>;
  reflections: { contribution: string; favorite: string; difficulties: string; improvement: string };
  signature: string;
}) {
  const total =
    Math.round(STAGE6_SELF_RUBRIC_CRITERIA.reduce((acc, c) => acc + (params.scores[c.id] ?? 0), 0) * 10) / 10;
  const rank = getStage6RankInfo(total);

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorders,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell('Tiêu chí tự đánh giá', { bold: true, fill: '065F46', color: 'FFFFFF', widthPct: 55 }),
          cell('Mức đạt / Mô tả', { bold: true, fill: '065F46', color: 'FFFFFF', widthPct: 33 }),
          cell('Điểm', { bold: true, fill: '065F46', color: 'FFFFFF', widthPct: 12, align: AlignmentType.CENTER }),
        ],
      }),
      ...STAGE6_SELF_RUBRIC_CRITERIA.map((c) => {
        const pt = params.scores[c.id] ?? 0;
        const lv = c.levels.find((l) => l.points === pt);
        return new TableRow({
          children: [
            cell(c.title, { bold: true }),
            cell(lv ? `Mức ${lv.level}: ${lv.text}` : `${pt}đ`),
            cell(`${pt} / ${c.maxPoints}`, { bold: true, align: AlignmentType.CENTER }),
          ],
        });
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          p('PHIẾU TỰ ĐÁNH GIÁ CÁ NHÂN & NHẬT KÝ PHẢN CHIẾU (CHẶNG 6)', { bold: true, size: 28, align: AlignmentType.CENTER }),
          p(`Họ và tên: ${params.studentName || '................'}   |   Lớp: ${params.className || '......'}   |   Nhóm: ${params.groupName || '......'}   |   Ngày: ${params.dateStr}`),
          p(`Tổng điểm tự đánh giá: ${total}/10 điểm (${rank.label})`, { bold: true, after: 140 }),
          table,
          p('PHẦN II. GÓC TỰ PHẢN CHIẾU SAU DỰ ÁN', { bold: true, after: 80 }),
          p(`1. Đóng góp cụ thể cho nhóm: ${params.reflections.contribution || '—'}`),
          p(`2. Điều tâm đắc nhất (Bài 30 & Hóa học Xanh): ${params.reflections.favorite || '—'}`),
          p(`3. Khó khăn & Cách khắc phục: ${params.reflections.difficulties || '—'}`),
          p(`4. Hướng cải tiến lần sau: ${params.reflections.improvement || '—'}`),
          p(`Chữ ký xác nhận học sinh: ${params.signature || params.studentName || '................'}`, { bold: true, align: AlignmentType.RIGHT }),
        ],
      },
    ],
  });

  await saveDocx(doc, 'Phieu_Tu_Danh_Gia_Chang_6.docx');
}

export async function exportStage6LeaderToWord(params: {
  leaderName: string;
  className: string;
  groupName: string;
  members: Stage6MemberRecord[];
}) {
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorders,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell('STT', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 7, align: AlignmentType.CENTER }),
          cell('Thành viên', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 24 }),
          cell('Vai trò', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 25 }),
          cell('Tổng điểm', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 14, align: AlignmentType.CENTER }),
          cell('Nhận xét của Nhóm trưởng', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 30 }),
        ],
      }),
      ...params.members.map((m, idx) => {
        const tot =
          Math.round(
            STAGE6_LEADER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (m.scores[c.id] ?? 0), 0) * 10
          ) / 10;
        const rk = getStage6RankInfo(tot);
        return new TableRow({
          children: [
            cell(String(idx + 1), { align: AlignmentType.CENTER }),
            cell(m.name, { bold: true }),
            cell(m.role),
            cell(`${tot}/10 (${rk.label})`, { bold: true, align: AlignmentType.CENTER }),
            cell(m.comment || '—'),
          ],
        });
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          p('PHIẾU NHÓM TRƯỞNG ĐÁNH GIÁ THÀNH VIÊN (CHẶNG 6)', { bold: true, size: 28, align: AlignmentType.CENTER }),
          p(`Nhóm trưởng: ${params.leaderName}   |   Lớp: ${params.className}   |   Nhóm: ${params.groupName}`, { after: 140 }),
          table,
        ],
      },
    ],
  });

  await saveDocx(doc, 'Phieu_Nhom_Truong_Danh_Gia_Chang_6.docx');
}

export async function exportStage6TeacherToWord(params: {
  teacherName: string;
  className: string;
  groupName: string;
  productName: string;
  scores: Record<string, number>;
  strengths: string;
  individualAdjustments: string;
  productScore?: number;
  productWeightPct?: number;
  projectFinalScore?: number;
}) {
  const total =
    Math.round(STAGE6_TEACHER_RUBRIC_CRITERIA.reduce((acc, c) => acc + (params.scores[c.id] ?? 0), 0) * 10) / 10;
  const rank = getStage6RankInfo(total);
  const hasCombined =
    typeof params.productScore === 'number' &&
    typeof params.productWeightPct === 'number' &&
    typeof params.projectFinalScore === 'number';
  const combinedRank = hasCombined ? getStage6RankInfo(params.projectFinalScore as number) : null;

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorders,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell('Tiêu chí đánh giá của Giáo viên', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 60 }),
          cell('Điểm tối đa', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 20, align: AlignmentType.CENTER }),
          cell('Điểm chấm', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 20, align: AlignmentType.CENTER }),
        ],
      }),
      ...STAGE6_TEACHER_RUBRIC_CRITERIA.map((c) => {
        const pt = params.scores[c.id] ?? 0;
        return new TableRow({
          children: [
            cell(c.title, { bold: true }),
            cell(`${c.maxPoints}đ`, { align: AlignmentType.CENTER }),
            cell(`${pt}đ`, { bold: true, align: AlignmentType.CENTER }),
          ],
        });
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          p('PHIẾU GIÁO VIÊN ĐÁNH GIÁ QUÁ TRÌNH NHÓM & BÁO CÁO STEAM (CHẶNG 6)', { bold: true, size: 28, align: AlignmentType.CENTER }),
          p(`Giáo viên: ${params.teacherName}   |   Lớp: ${params.className}   |   Nhóm: ${params.groupName}`),
          p(`Sản phẩm: ${params.productName}`),
          p(`Tổng điểm Quá trình & Báo cáo (Chặng 6): ${total}/10 điểm (${rank.label})`, { bold: true, after: hasCombined ? 80 : 140 }),
          ...(hasCombined && combinedRank
            ? [
                p(
                  `TỔNG ĐIỂM DỰ ÁN STEAM (${params.productWeightPct}% Sản phẩm Chặng 4 [${params.productScore}/10đ] + ${100 - (params.productWeightPct ?? 50)}% Quá trình & Báo cáo Chặng 6 [${total}/10đ]): ${params.projectFinalScore}/10 điểm (${combinedRank.label})`,
                  { bold: true, after: 140 }
                ),
              ]
            : []),
          table,
          p(`Nhận xét chung (Ưu điểm & Hướng phát triển): ${params.strengths || '—'}`),
          p(`Điều chỉnh điểm cá nhân: ${params.individualAdjustments || 'Không có'}`),
        ],
      },
    ],
  });

  await saveDocx(doc, 'Phieu_Giao_Vien_Danh_Gia_Chang_6.docx');
}

export async function exportSurveyFormToWord(params: {
  studentName: string;
  className: string;
  groupName: string;
  surveyDate: string;
  sections: { roman: string; title: string; items: { num: number; text: string }[] }[];
  ratings: Record<number, number>;
  interestLevel: string;
  favoriteStageNote: string;
  difficultySolutionNote: string;
  suggestionNote: string;
}) {
  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        cell('STT', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 10, align: AlignmentType.CENTER }),
        cell('Nội dung khảo sát', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 74 }),
        cell('Mức chọn (1–5)', { bold: true, fill: '1E1B4B', color: 'FFFFFF', widthPct: 16, align: AlignmentType.CENTER }),
      ],
    }),
  ];

  params.sections.forEach((sec) => {
    tableRows.push(
      new TableRow({
        children: [
          cell(sec.roman, { bold: true, fill: 'EEF2FF', align: AlignmentType.CENTER }),
          cell(sec.title, { bold: true, fill: 'EEF2FF' }),
          cell('', { fill: 'EEF2FF' }),
        ],
      })
    );
    sec.items.forEach((item) => {
      tableRows.push(
        new TableRow({
          children: [
            cell(String(item.num), { align: AlignmentType.CENTER }),
            cell(item.text),
            cell(params.ratings[item.num] ? `${params.ratings[item.num]} / 5` : '☐☐☐☐☐', {
              bold: true,
              align: AlignmentType.CENTER,
            }),
          ],
        })
      );
    });
  });

  const doc = new Document({
    sections: [
      {
        children: [
          p('PHIẾU KHẢO SÁT Ý KIẾN HỌC SINH SAU CHỦ ĐỀ', { bold: true, size: 28, align: AlignmentType.CENTER }),
          p('Chủ đề STEM/STEAM: Bắt đầu từ sự kết thúc (Bài 30: Tinh bột và Cellulose – KHTN 9)', { italic: true, align: AlignmentType.CENTER, after: 140 }),
          p(`Họ và tên: ${params.studentName || '(Ẩn danh)'}   |   Lớp: ${params.className || '......'}   |   Nhóm: ${params.groupName || '......'}   |   Ngày: ${params.surveyDate}`),
          p('PHẦN A. ĐÁNH GIÁ TRẢI NGHIỆM HỌC TẬP VÀ DỰ ÁN (1: Hoàn toàn không đồng ý → 5: Hoàn toàn đồng ý)', { bold: true, after: 80 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: thinBorders,
            rows: tableRows,
          }),
          p('PHẦN B. Ý KIẾN ĐÓNG GÓP VÀ PHẢN TƯ CÁ NHÂN', { bold: true, after: 80 }),
          p(`• Mức độ yêu thích chung: ${params.interestLevel || 'Chưa chọn'}`, { bold: true }),
          p(`1. Chặng / hoạt động ấn tượng nhất & lý do: ${params.favoriteStageNote || '—'}`),
          p(`2. Khó khăn khi chế tạo tại nhà & cách khắc phục: ${params.difficultySolutionNote || '—'}`),
          p(`3. Góp ý cải tiến cho thầy cô: ${params.suggestionNote || '—'}`),
        ],
      },
    ],
  });

  await saveDocx(doc, 'Phieu_Khao_Sat_Hoc_Sinh_Bai30.docx');
}
