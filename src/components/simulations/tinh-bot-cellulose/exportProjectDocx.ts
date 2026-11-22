/* cSpell:disable */
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import {
  CROSSWORD_CLUES,
  HOTSPOT_APPLICATIONS,
  IDEA_DRIVE_URL,
  PADLET_URL,
  PROCESS_STEPS,
  PROJECT_IDEAS,
  QUIZ_QUESTIONS,
  SCIENCE_NEW_WORDS,
  STAGE2_DRAG_ITEMS,
  STAGE2_PART2_HYDROLYSIS_QUIZ,
  STAGE2_PART2_IODINE_QUIZ,
  STAGE2_TEST_QUESTIONS,
  STAGE5_POSTER_DRIVE_URL,
  STAGE5_PRESENTATION_DRIVE_URL,
  STAGE6_SUMMARY_VIDEO_DRIVE_URL,
  STAGE_GUIDE_INFO,
} from './lessonData';
import {
  STAGE3_RUBRIC_CRITERIA,
  STAGE5_RUBRIC_CRITERIA,
  STAGE6_LEADER_RUBRIC_CRITERIA,
  STAGE6_SELF_RUBRIC_CRITERIA,
  STAGE6_TEACHER_RUBRIC_CRITERIA,
} from './rubricData';
import { SURVEY_SECTIONS } from './components/Stage6SurveyBox';
import { DUBLIN_CORE_METADATA } from './exportScormPackage';

const FONT = 'Times New Roman';

const CELL_MARGIN = {
  top: 90,
  bottom: 90,
  left: 120,
  right: 120,
};

const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 6, color: '64748B' },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: '64748B' },
  left: { style: BorderStyle.SINGLE, size: 6, color: '64748B' },
  right: { style: BorderStyle.SINGLE, size: 6, color: '64748B' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
};

function makeParagraph(
  text: string,
  opts?: {
    bold?: boolean;
    italic?: boolean;
    size?: number;
    color?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    before?: number;
    after?: number;
  }
): Paragraph {
  return new Paragraph({
    alignment: opts?.align ?? AlignmentType.LEFT,
    spacing: { before: opts?.before ?? 40, after: opts?.after ?? 60, line: 276 },
    children: [
      new TextRun({
        text,
        bold: opts?.bold,
        italics: opts?.italic,
        size: opts?.size ?? 23,
        font: FONT,
        color: opts?.color ?? '0F172A',
      }),
    ],
  });
}

function stageHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 260, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 12, color: '059669' },
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28,
        font: FONT,
        color: '065F46',
      }),
    ],
  });
}

function subHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        font: FONT,
        color: '1E3A8A',
      }),
    ],
  });
}

function multiLineParagraphs(lines: string[], size = 20, boldFirst = false): Paragraph[] {
  return lines.map(
    (line, idx) =>
      new Paragraph({
        spacing: { before: 20, after: 35, line: 240 },
        children: [
          new TextRun({
            text: line,
            size,
            font: FONT,
            bold: boldFirst && idx === 0,
            color: '0F172A',
          }),
        ],
      })
  );
}

interface StyledTableOptions {
  headers: string[];
  rows: (string | string[])[][];
  colWidthsPct?: number[];
  headerBg?: string;
  centerCols?: number[];
  fontSize?: number;
}

function buildStyledTable({
  headers,
  rows,
  colWidthsPct,
  headerBg = '1E1B4B',
  centerCols = [],
  fontSize = 21,
}: StyledTableOptions): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, cIdx) => {
      const widthPct = colWidthsPct?.[cIdx];
      return new TableCell({
        margins: CELL_MARGIN,
        verticalAlign: VerticalAlign.CENTER,
        width: widthPct ? { size: widthPct, type: WidthType.PERCENTAGE } : undefined,
        shading: { type: ShadingType.CLEAR, fill: headerBg },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: h,
                bold: true,
                size: fontSize,
                font: FONT,
                color: 'FFFFFF',
              }),
            ],
          }),
        ],
      });
    }),
  });

  const dataRows = rows.map((row, rIdx) => {
    const zebraFill = rIdx % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
    return new TableRow({
      cantSplit: true,
      children: row.map((cellVal, cIdx) => {
        const widthPct = colWidthsPct?.[cIdx];
        const isCenter = centerCols.includes(cIdx);
        const lines = Array.isArray(cellVal) ? cellVal : cellVal.split('\n');
        return new TableCell({
          margins: CELL_MARGIN,
          verticalAlign: VerticalAlign.CENTER,
          width: widthPct ? { size: widthPct, type: WidthType.PERCENTAGE } : undefined,
          shading: { type: ShadingType.CLEAR, fill: zebraFill },
          children: lines.map(
            (ln, li) =>
              new Paragraph({
                alignment: isCenter ? AlignmentType.CENTER : AlignmentType.LEFT,
                spacing: { before: 20, after: 30, line: 250 },
                children: [
                  new TextRun({
                    text: ln,
                    size: fontSize,
                    font: FONT,
                    bold: cIdx === 0 && li === 0,
                    color: '0F172A',
                  }),
                ],
              })
          ),
        });
      }),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    rows: [headerRow, ...dataRows],
  });
}

function buildChecklist5Table(
  headerBg: string,
  items: { code: string; title: string }[]
): Table {
  return buildStyledTable({
    headers: [
      'STT',
      'Tiêu chí đánh giá',
      'Mức 1\n(Cần cố gắng)',
      'Mức 2\n(Đạt)',
      'Mức 3\n(Khá)',
      'Mức 4\n(Tốt)',
      'Mức 5\n(Xuất sắc)',
    ],
    colWidthsPct: [8, 42, 10, 10, 10, 10, 10],
    headerBg,
    centerCols: [0, 2, 3, 4, 5, 6],
    fontSize: 20,
    rows: items.map((it) => [
      it.code,
      it.title,
      '☐ 1',
      '☐ 2',
      '☐ 3',
      '☐ 4',
      '☐ 5',
    ]),
  });
}

function buildMatrix7ColTable(
  titleLeft: string,
  headerBg: string,
  rows: {
    leftLines: string[];
    levels: { points: number; lines: string[] }[];
    maxPoints: number;
  }[]
): Table {
  const colWidthsPct = [20, 14, 14, 14, 14, 14, 10];
  const headers = [
    titleLeft,
    'MỨC 1 (20%)\nCần cố gắng',
    'MỨC 2 (40%)\nĐạt',
    'MỨC 3 (60%)\nKhá',
    'MỨC 4 (80%)\nTốt',
    'MỨC 5 (100%)\nXuất sắc',
    'ĐIỂM',
  ];
  const levelHeaderColors = [headerBg, '9F1239', 'B45309', '0369A1', '4338CA', '065F46', 'EA580C'];

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, idx) => {
      const parts = h.split('\n');
      return new TableCell({
        margins: CELL_MARGIN,
        verticalAlign: VerticalAlign.CENTER,
        width: { size: colWidthsPct[idx], type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: levelHeaderColors[idx] },
        children: parts.map(
          (p, pi) =>
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: p,
                  bold: true,
                  size: pi === 0 ? 20 : 18,
                  font: FONT,
                  color: 'FFFFFF',
                }),
              ],
            })
        ),
      });
    }),
  });

  const dataRows = rows.map((r, rIdx) => {
    const zebraFill = rIdx % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
    return new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          margins: CELL_MARGIN,
          verticalAlign: VerticalAlign.TOP,
          width: { size: colWidthsPct[0], type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'EEF2FF' },
          children: multiLineParagraphs(r.leftLines, 20, true),
        }),
        ...r.levels.map(
          (lv) =>
            new TableCell({
              margins: CELL_MARGIN,
              verticalAlign: VerticalAlign.TOP,
              width: { size: 14, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: zebraFill },
              children: [
                new Paragraph({
                  spacing: { before: 15, after: 35 },
                  children: [
                    new TextRun({
                      text: `☐ ${lv.points} điểm`,
                      bold: true,
                      size: 19,
                      font: FONT,
                      color: '1E3A8A',
                    }),
                  ],
                }),
                ...multiLineParagraphs(lv.lines, 19, false),
              ],
            })
        ),
        new TableCell({
          margins: CELL_MARGIN,
          verticalAlign: VerticalAlign.CENTER,
          width: { size: colWidthsPct[6], type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'FFF7ED' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `.... / ${r.maxPoints}`,
                  bold: true,
                  size: 20,
                  font: FONT,
                  color: 'C2410C',
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    rows: [headerRow, ...dataRows],
  });
}

export async function exportAllStagesToWord(): Promise<void> {
  const portraitChildren: (Paragraph | Table)[] = [];

  // =========================================================================
  // TRANG TIÊU ĐỀ & THÔNG TIN CHUNG
  // =========================================================================
  portraitChildren.push(
    makeParagraph('KẾ HOẠCH & HỒ SƠ DỰ ÁN HỌC TẬP STEAM', {
      bold: true,
      size: 32,
      color: '1E1B4B',
      align: AlignmentType.CENTER,
      before: 60,
      after: 60,
    })
  );
  portraitChildren.push(
    makeParagraph('CHỦ ĐỀ: "BẮT ĐẦU TỪ SỰ KẾT THÚC" — BÀI 30: TINH BỘT VÀ CELLULOSE', {
      bold: true,
      size: 26,
      color: '065F46',
      align: AlignmentType.CENTER,
      after: 140,
    })
  );

  portraitChildren.push(
    buildStyledTable({
      headers: ['Hạng mục thông tin', 'Nội dung chi tiết'],
      colWidthsPct: [32, 68],
      headerBg: '1E1B4B',
      rows: [
        ['Môn học / Khối lớp', 'Khoa học tự nhiên 9 (Chủ đề Carbohydrate — Bài 30: Tinh bột và Cellulose)'],
        ['Tác giả / Đơn vị', `${DUBLIN_CORE_METADATA.creator} • ${DUBLIN_CORE_METADATA.publisher}`],
        ['Mã định danh ĐVKT (QĐ 791)', DUBLIN_CORE_METADATA.knowledgeUnitCode],
        ['Chuẩn chia sẻ (QĐ 791)', DUBLIN_CORE_METADATA.rights],
        ['Không gian Padlet chung', PADLET_URL],
        ['Drive Ý tưởng & Video thuyết trình', IDEA_DRIVE_URL],
        ['Drive Poster / Infographic (Chặng 5)', STAGE5_POSTER_DRIVE_URL],
        ['Drive Video tổng kết (Chặng 6)', STAGE6_SUMMARY_VIDEO_DRIVE_URL],
      ],
    })
  );

  portraitChildren.push(subHeading('Tổng quan lộ trình 6 chặng của dự án'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['Chặng', 'Tên chặng', 'Mục tiêu trọng tâm'],
      colWidthsPct: [14, 30, 56],
      headerBg: '065F46',
      centerCols: [0],
      rows: Object.entries(STAGE_GUIDE_INFO).map(([id, info]) => [
        id.toUpperCase(),
        info.title,
        info.guideText,
      ]),
    })
  );

  // =========================================================================
  // CHẶNG 1
  // =========================================================================
  portraitChildren.push(stageHeading('CHẶNG 1: KHỞI ĐỘNG & THÀNH LẬP NHÓM (TẠI LỚP)'));
  portraitChildren.push(subHeading('1.0. Nhiệm vụ & Bộ Tiêu chí Sản phẩm Xanh (Hoạt động 1 – CV 3089)'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['Tiêu chí', 'Yêu cầu sản phẩm tái sinh từ Cellulose & Tinh bột'],
      colWidthsPct: [28, 72],
      headerBg: '065F46',
      rows: [
        ['1. Khoa học (Bài 30)', 'Tận dụng sợi cellulose (bã mía, rơm, giấy vụn) & hồ tinh bột kết dính sinh học.'],
        ['2. Kỹ thuật & Độ bền', 'Có quy trình 4 bước định lượng (g / ml); sản phẩm dai, giữ phom, không rã khi tưới nhẹ.'],
        ['3. Sinh thái & An toàn', '100% nguyên liệu tự phân hủy, an toàn, tích hợp hạt giống nảy mầm tốt.'],
        ['4. Thẩm mỹ & Chi phí', 'Tạo hình sáng tạo, tiết kiệm, có bao bì/nhãn thông điệp sống xanh.'],
      ],
    })
  );

  portraitChildren.push(subHeading('1.1. Bảng phân công nhiệm vụ thành viên trong nhóm'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['STT', 'Họ và tên thành viên', 'Vai trò dự kiến', 'Nhiệm vụ phụ trách'],
      colWidthsPct: [8, 30, 24, 38],
      centerCols: [0],
      rows: [
        ['1', '', 'Nhóm trưởng', 'Điều phối chung, lập kế hoạch & tổng hợp chấm chéo'],
        ['2', '', 'Thư ký', 'Ghi chép nhật ký, tổng hợp số liệu & nộp minh chứng'],
        ['3', '', 'Thiết kế / Thí nghiệm', 'Chuẩn bị nguyên liệu Cellulose, thử nghiệm quy trình'],
        ['4', '', 'Thiết kế Poster & Video', 'Thiết kế Infographic, quay dựng video tổng kết'],
        ['5', '', 'Thuyết trình & Phản biện', 'Trình bày sản phẩm tại Ngày hội xanh'],
      ],
    })
  );

  portraitChildren.push(subHeading('1.2. Trò chơi giải ô chữ tìm từ khóa: "GREEN NEWSPAPER" (14 chữ cái)'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['Hàng', 'Câu hỏi gợi ý', 'Đáp án', 'Gợi ý nhanh'],
      colWidthsPct: [8, 46, 20, 26],
      centerCols: [0, 2],
      rows: CROSSWORD_CLUES.map((c) => [
        String(c.rowNumber),
        c.question,
        c.answerDisplay,
        c.hint,
      ]),
    })
  );

  portraitChildren.push(subHeading('1.3. Từ vựng Tiếng Anh chuyên ngành (Science New Words)'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['Thuật ngữ', 'Phiên âm IPA', 'Từ loại', 'Nghĩa tiếng Việt', 'Chủ đề'],
      colWidthsPct: [18, 16, 12, 34, 20],
      rows: SCIENCE_NEW_WORDS.map((w) => [w.term, w.ipa, w.partOfSpeech, w.meaningVi, w.category]),
    })
  );

  portraitChildren.push(subHeading('1.4. Gợi ý các hướng ý tưởng sản phẩm STEAM'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['STT', 'Tên ý tưởng', 'Chất chính', 'Mô tả ngắn'],
      colWidthsPct: [8, 30, 16, 46],
      centerCols: [0, 2],
      rows: PROJECT_IDEAS.map((i, idx) => [String(idx + 1), i.title, i.material, i.shortDesc]),
    })
  );

  // =========================================================================
  // CHẶNG 2
  // =========================================================================
  portraitChildren.push(stageHeading('CHẶNG 2: KIẾN THỨC NỀN (TỰ HỌC TẠI NHÀ)'));
  portraitChildren.push(subHeading('Phần I. Phân loại tính chất vật lí & trạng thái tự nhiên'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['STT', 'Đặc điểm / Tính chất', 'Phân loại đúng'],
      colWidthsPct: [8, 66, 26],
      centerCols: [0, 2],
      rows: STAGE2_DRAG_ITEMS.map((d, idx) => [
        String(idx + 1),
        d.text,
        d.target === 'starch' ? 'Tinh bột (C₆H₁₀O₅)ₙ' : 'Cellulose (C₆H₁₀O₅)ₘ',
      ]),
    })
  );

  portraitChildren.push(subHeading('Phần II. Tính chất hóa học (Phản ứng Iodine & Thủy phân)'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['Nội dung', 'Câu hỏi', 'Các phương án & Đáp án đúng'],
      colWidthsPct: [16, 40, 44],
      rows: [
        ...STAGE2_PART2_IODINE_QUIZ.map((q, idx) => [
          `TN Iodine\n(Câu ${idx + 1})`,
          q.question,
          q.options.map((o, oi) => `${oi === q.correctIndex ? '✓ [ĐÚNG] ' : '• '}${o}`).join('\n'),
        ]),
        ...STAGE2_PART2_HYDROLYSIS_QUIZ.map((q, idx) => [
          `TN Thủy phân\n(Câu ${idx + 1})`,
          q.question,
          q.options.map((o, oi) => `${oi === q.correctIndex ? '✓ [ĐÚNG] ' : '• '}${o}`).join('\n'),
        ]),
      ],
    })
  );

  portraitChildren.push(subHeading('Phần III. Ứng dụng thực tiễn của Tinh bột & Cellulose (16 điểm nóng)'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['STT', 'Ứng dụng / Vật liệu', 'Chất chính', 'Giải thích khoa học'],
      colWidthsPct: [8, 26, 16, 50],
      centerCols: [0, 2],
      rows: HOTSPOT_APPLICATIONS.map((h) => [
        String(h.number),
        h.label,
        h.correctCategory === 'starch' ? 'Tinh bột' : h.correctCategory === 'cellulose' ? 'Cellulose' : 'Khác',
        h.reason,
      ]),
    })
  );

  portraitChildren.push(subHeading('Phần IV. Bộ 12 câu hỏi kiểm tra kiến thức nền (Chia 4 phần chuẩn)'));
  const testGroups = [
    { label: 'Phần I. Chọn đáp án đúng nhất (Câu 1 – 3)', items: STAGE2_TEST_QUESTIONS.filter((q) => q.type === 'multiple_choice') },
    { label: 'Phần II. Câu hỏi Đúng / Sai (Câu 4 – 6)', items: STAGE2_TEST_QUESTIONS.filter((q) => q.type === 'true_false') },
    { label: 'Phần III. Câu hỏi Điền khuyết (Câu 7 – 9)', items: STAGE2_TEST_QUESTIONS.filter((q) => q.type === 'fill_in') },
    { label: 'Phần IV. Câu hỏi Ghép đôi (Câu 10 – 12)', items: STAGE2_TEST_QUESTIONS.filter((q) => q.type === 'matching') },
  ];
  testGroups.forEach((grp) => {
    portraitChildren.push(makeParagraph(grp.label, { bold: true, color: '1E1B4B', before: 100, after: 60 }));
    portraitChildren.push(
      buildStyledTable({
        headers: ['Câu', 'Nội dung câu hỏi', 'Đáp án & Giải thích'],
        colWidthsPct: [10, 44, 46],
        centerCols: [0],
        rows: grp.items.map((q) => {
          const answerLines: string[] = [];
          if (q.options && q.correctOptionIndex !== undefined) {
            q.options.forEach((opt, oi) => {
              answerLines.push(`${oi === q.correctOptionIndex ? '✓ [ĐÚNG] ' : '• '}${opt}`);
            });
          }
          if (q.subStatements) {
            q.subStatements.forEach((s) => {
              answerLines.push(`${s.text} → [${s.isCorrect ? 'ĐÚNG' : 'SAI'}]`);
            });
          }
          if (q.blanks) {
            q.blanks.forEach((b) => {
              answerLines.push(`${b.label} → ${b.acceptedAnswers.join(' / ')}`);
            });
          }
          if (q.matchingPairs) {
            q.matchingPairs.forEach((m) => {
              answerLines.push(`${m.leftText} ⟷ ${m.rightText}`);
            });
          }
          answerLines.push(`Giải thích: ${q.explanation}`);
          return [`Câu ${q.id}`, q.question, answerLines];
        }),
      })
    );
  });

  portraitChildren.push(subHeading('Phần V. Vận dụng kiến thức & Mở rộng thực tiễn'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['Câu hỏi vận dụng', 'Gợi ý đáp án chuẩn'],
      colWidthsPct: [38, 62],
      rows: [
        [
          'Câu 1: Nêu một số ứng dụng của tinh bột và cellulose trong đời sống và sản xuất.',
          [
            '• Tinh bột: Lương thực chính (cơm, bánh mì, bún, phở); sản xuất glucose, mạch nha, ethanol sinh học; hồ dán, chất làm đặc trong thực phẩm và dược phẩm.',
            '• Cellulose: Sản xuất giấy, vở, bìa carton; dệt vải sợi tự nhiên (bông, lanh, đay); vật liệu xây dựng, đồ gỗ; chế tạo màng bọc sinh học, vật liệu tái chế.',
          ],
        ],
        [
          'Câu 2: Kể tên một số lương thực, thực phẩm giàu tinh bột và cho biết cách sử dụng hợp lí tinh bột trong khẩu phần ăn hằng ngày.',
          [
            '• Thực phẩm giàu tinh bột: Gạo, ngô, khoai lang, khoai tây, sắn, yến mạch, các loại đậu và bánh mì.',
            '• Sử dụng hợp lí: Ăn lượng vừa đủ theo nhu cầu năng lượng (khoảng 50–60% tổng năng lượng), ưu tiên tinh bột nguyên cám giàu chất xơ, kết hợp rau xanh – đạm – chất béo lành mạnh và tránh ăn quá nhiều tinh bột tinh chế vào buổi tối.',
          ],
        ],
      ],
    })
  );

  portraitChildren.push(subHeading('Câu hỏi định hướng khám phá S – T – E – A – M'));
  portraitChildren.push(
    buildStyledTable({
      headers: ['Thành tố', 'Câu hỏi định hướng học sinh khám phá'],
      colWidthsPct: [24, 76],
      headerBg: '065F46',
      rows: [
        ['S — Science (Khoa học)', 'Làm sao kết hợp sợi Cellulose từ phế phẩm với hồ Tinh bột để tạo vật liệu tự phân hủy?'],
        ['T — Technology (Công nghệ)', 'Nhóm sẽ dùng công cụ số nào để thiết kế quy trình, quay video và làm báo cáo song ngữ?'],
        ['E — Engineering (Kỹ thuật)', 'Quy trình tách xơ → phối trộn → ép khuôn → sấy cần thực hiện theo các bước nào?'],
        ['A — Art (Nghệ thuật)', 'Thiết kế kiểu dáng, màu sắc và thông điệp tiếng Anh như thế nào để sản phẩm xanh thu hút?'],
        ['M — Math (Toán học)', 'Tỉ lệ phối trộn (gam xơ : ml nước : gam tinh bột), kích thước và chi phí dự kiến là bao nhiêu?'],
      ],
    })
  );

  // =========================================================================
  // CHẶNG 3 (SECTION LANDSCAPE ĐÚNG THỨ TỰ)
  // =========================================================================
  const stage3Children: (Paragraph | Table)[] = [];
  stage3Children.push(stageHeading('CHẶNG 3: Ý TƯỞNG & QUY TRÌNH (TẠI LỚP)'));
  stage3Children.push(
    buildStyledTable({
      headers: ['Nhiệm vụ', 'Nội dung thực hiện & Link nộp bài'],
      colWidthsPct: [24, 76],
      rows: [
        ['3.1. Nộp ý tưởng', `Tải bản thiết kế ý tưởng lên Google Drive: ${IDEA_DRIVE_URL}`],
        ['3.2. Báo cáo tại lớp', 'Đại diện nhóm trình bày quy trình kỹ thuật và tiếp thu góp ý từ nhóm bạn & giáo viên.'],
        ['3.3. Bảng kiểm 5 mức độ', 'Đánh giá Ý tưởng & Quy trình theo Bảng kiểm 5 mức độ trực tiếp trên Website.'],
      ],
    })
  );
  stage3Children.push(subHeading('3.3. Bảng kiểm 5 mức độ — Đánh giá Ý tưởng & Quy trình (Chặng 3)'));
  stage3Children.push(
    buildChecklist5Table(
      '312E81',
      STAGE3_RUBRIC_CRITERIA.map((c, idx) => ({
        code: String(idx + 1),
        title: `[${c.category}] ${c.title}`,
      }))
    )
  );

  // =========================================================================
  // CHẶNG 4 (SECTION PORTRAIT ĐÚNG THỨ TỰ)
  // =========================================================================
  const stage4Children: (Paragraph | Table)[] = [];
  stage4Children.push(stageHeading('CHẶNG 4: HOÀN THIỆN SẢN PHẨM (TẠI NHÀ)'));
  stage4Children.push(
    makeParagraph(`• Nộp ảnh & video nhật ký thực hiện sản phẩm lên Padlet: ${PADLET_URL}`, { after: 80 })
  );
  stage4Children.push(
    buildStyledTable({
      headers: ['Bước', 'Tên công đoạn', 'Hướng dẫn thực hiện', 'Kiểm tra'],
      colWidthsPct: [10, 26, 52, 12],
      centerCols: [0, 3],
      rows: PROCESS_STEPS.map((st) => [`Bước ${st.step}`, st.title, st.detail, '☐ Xong']),
    })
  );

  // =========================================================================
  // CHẶNG 5, CHẶNG 6 & PHIẾU KHẢO SÁT (SECTION LANDSCAPE ĐÚNG THỨ TỰ)
  // =========================================================================
  const landscapeChildren: (Paragraph | Table)[] = [];

  // CHẶNG 5
  landscapeChildren.push(stageHeading('CHẶNG 5: NGÀY HỘI XANH — TRƯNG BÀY & THUYẾT TRÌNH'));
  landscapeChildren.push(
    buildStyledTable({
      headers: ['Nhiệm vụ', 'Nội dung thực hiện & Link nộp bài'],
      colWidthsPct: [24, 76],
      rows: [
        ['5.1. Gian hàng & Báo cáo', `Nộp Poster (${STAGE5_POSTER_DRIVE_URL}) và Video thuyết trình (${STAGE5_PRESENTATION_DRIVE_URL}) lên Google Drive.`],
        ['5.2. Rubric trọng tâm', 'Đánh giá gian hàng Ngày hội Xanh trực tiếp theo Analytical Rubric 5 mức dưới đây.'],
      ],
    })
  );
  landscapeChildren.push(subHeading('5.2. Analytical Rubric 5 mức — Đánh giá Sản phẩm, Poster & Thuyết trình (Chặng 5)'));
  landscapeChildren.push(
    buildMatrix7ColTable(
      'TIÊU CHÍ\n(Trọng số)',
      '1E1B4B',
      STAGE5_RUBRIC_CRITERIA.map((c) => ({
        leftLines: [`[${c.category}]`, c.title, `Trọng số: ${c.weightPercent}% (Tối đa ${c.maxPoints}đ)`],
        levels: c.levels.map((lv) => ({ points: lv.points, lines: lv.bullets })),
        maxPoints: c.maxPoints,
      }))
    )
  );

  // CHẶNG 6
  landscapeChildren.push(stageHeading('CHẶNG 6: TỔNG KẾT DỰ ÁN & ĐÁNH GIÁ'));
  landscapeChildren.push(subHeading('6.1. Bộ câu hỏi củng cố tổng kết dự án'));
  landscapeChildren.push(
    buildStyledTable({
      headers: ['Câu', 'Chủ đề', 'Nội dung câu hỏi', 'Các phương án & Đáp án đúng'],
      colWidthsPct: [8, 18, 36, 38],
      centerCols: [0],
      rows: QUIZ_QUESTIONS.map((q, idx) => [
        `Câu ${idx + 1}`,
        q.tag,
        q.question,
        q.options.map((o, oi) => `${oi === q.correctIndex ? '✓ [ĐÚNG] ' : '• '}${o}`).join('\n'),
      ]),
    })
  );

  landscapeChildren.push(subHeading('6.2A. Bảng kiểm 5 mức độ — Học sinh tự đánh giá cá nhân'));
  landscapeChildren.push(
    buildChecklist5Table(
      '064E3B',
      STAGE6_SELF_RUBRIC_CRITERIA.map((c) => ({
        code: c.code,
        title: `[${c.badge}] ${c.title}`,
      }))
    )
  );

  landscapeChildren.push(subHeading('Phiếu tự phản chiếu sau dự án (Reflection)'));
  landscapeChildren.push(
    buildStyledTable({
      headers: ['Câu hỏi phản tư cá nhân', 'Ghi chép của học sinh'],
      colWidthsPct: [40, 60],
      headerBg: '065F46',
      rows: [
        ['1. Đóng góp chính của em cho sản phẩm và hoạt động của nhóm:', '\n'],
        ['2. Điều em tâm đắc nhất sau khi hoàn thành dự án:', '\n'],
        ['3. Khó khăn gặp phải và cách em/nhóm đã khắc phục:', '\n'],
        ['4. Hướng cải tiến nếu tiếp tục phát triển sản phẩm:', '\n'],
      ],
    })
  );

  landscapeChildren.push(subHeading('6.2B. Bảng kiểm 5 mức độ — Nhóm trưởng đánh giá thành viên'));
  landscapeChildren.push(
    buildChecklist5Table(
      '92400E',
      STAGE6_LEADER_RUBRIC_CRITERIA.map((c) => ({
        code: c.code,
        title: c.title,
      }))
    )
  );

  landscapeChildren.push(subHeading('6.2C. Rubric chi tiết — Giáo viên đánh giá sản phẩm nhóm'));
  landscapeChildren.push(
    buildMatrix7ColTable(
      'TIÊU CHÍ GIÁO VIÊN',
      '1E1B4B',
      STAGE6_TEACHER_RUBRIC_CRITERIA.map((c) => ({
        leftLines: [`[${c.stageTag}] ${c.code}. ${c.title}`, c.weightText],
        levels: c.levels.map((lv) => ({ points: lv.points, lines: [lv.text] })),
        maxPoints: c.maxPoints,
      }))
    )
  );

  landscapeChildren.push(subHeading('6.3. Video tổng kết dự án'));
  landscapeChildren.push(
    buildStyledTable({
      headers: ['Hạng mục', 'Đường dẫn Google Drive nộp & xem Video tổng kết'],
      colWidthsPct: [28, 72],
      rows: [['Video tổng kết dự án', STAGE6_SUMMARY_VIDEO_DRIVE_URL]],
    })
  );

  // =========================================================================
  // PHIẾU KHẢO SÁT Ý KIẾN HỌC SINH SAU CHỦ ĐỀ (TÁCH RIÊNG CUỐI DỰ ÁN)
  // =========================================================================
  const surveyChildren: (Paragraph | Table)[] = [];
  surveyChildren.push(stageHeading('PHIẾU KHẢO SÁT Ý KIẾN HỌC SINH SAU CHỦ ĐỀ (TÁCH RIÊNG)'));
  surveyChildren.push(
    makeParagraph('Họ và tên (có thể để trống nếu ẩn danh): ....................................   Lớp: .........   Nhóm: .........   Ngày: ....../....../2026', { after: 100 })
  );
  surveyChildren.push(subHeading('PHẦN A. ĐÁNH GIÁ TRẢI NGHIỆM HỌC TẬP VÀ DỰ ÁN (1 → 5)'));
  surveyChildren.push(
    buildStyledTable({
      headers: ['STT', 'Nội dung khảo sát', '1', '2', '3', '4', '5'],
      colWidthsPct: [8, 67, 5, 5, 5, 5, 5],
      centerCols: [0, 2, 3, 4, 5, 6],
      rows: SURVEY_SECTIONS.flatMap((sec) => [
        [sec.roman, sec.title, '', '', '', '', ''],
        ...sec.items.map((item) => [String(item.num), item.text, '☐', '☐', '☐', '☐', '☐']),
      ]),
    })
  );
  surveyChildren.push(subHeading('PHẦN B. Ý KIẾN ĐÓNG GÓP VÀ PHẢN TƯ CÁ NHÂN'));
  surveyChildren.push(
    buildStyledTable({
      headers: ['Nội dung', 'Phản hồi của học sinh'],
      colWidthsPct: [38, 62],
      headerBg: '065F46',
      rows: [
        ['Mức độ yêu thích chung', '☐ Rất thích     ☐ Thích     ☐ Bình thường     ☐ Chưa thích'],
        ['1. Chặng / hoạt động ấn tượng nhất & lý do', '\n'],
        ['2. Khó khăn khi chế tạo tại nhà & cách khắc phục', '\n'],
        ['3. Góp ý cải tiến bài giảng / trò chơi / dự án', '\n'],
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1000 } } },
        children: portraitChildren,
      },
      {
        properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 850, bottom: 850, left: 900, right: 900 } } },
        children: stage3Children,
      },
      {
        properties: { page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1000 } } },
        children: stage4Children,
      },
      {
        properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 850, bottom: 850, left: 900, right: 900 } } },
        children: landscapeChildren,
      },
      {
        properties: { page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1000 } } },
        children: surveyChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Du_An_STEAM_Bai30_Tinh_Bot_Cellulose_6_Chang.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
