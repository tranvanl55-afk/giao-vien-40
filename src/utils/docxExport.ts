import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, VerticalAlign } from "docx";

export interface Author {
  id: string;
  name: string;
  birthYear: string;
  position: string;
  contribution: string;
  duty: string;
}

export interface Supporter {
  id: string;
  name: string;
  department: string;
  position: string;
  duty: string;
}

export interface Solution {
  id: string;
  name: string;
  target: string;
  steps: string;
  example: string;
}

export interface SKKNData {
  schoolYear: string;
  councilName: string;
  schoolName: string;
  initiativeName: string;
  level: string;
  subject: string;
  field: string;
  timeFrom: string;
  timeTo: string;
  authors: Author[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  supporters: Supporter[];
  documents: {
    images: boolean;
    reports: boolean;
    lessonPlans: boolean;
  };
  context: string;
  limit1: string;
  limit2: string;
  limit3: string;
  conclusion: string;
  solutions: Solution[];
  advantages: string;
  disadvantages: string;
  newness: string;
  appliedClasses: string;
  resultTimeFrom: string;
  resultTimeTo: string;
  resultTable: string; // we can just use a simple string representation or build a static table structure
  products: string;
  proposalLevel: {
    school: boolean;
    city: boolean;
  };
  efficiency: string;
  replication: string;
  dateStr: string;
}

export async function generateSKKNDocument(data: SKKNData): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1417, // 2.5cm
            right: 1134, // 2cm
            bottom: 1134, // 2cm
            left: 1701, // 3cm
          },
        },
      },
      children: [
        // Tiêu đề Quốc hiệu
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 26, font: "Times New Roman" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 28, font: "Times New Roman", underline: {} }),
          ],
          spacing: { after: 400 },
        }),

        // Tên đơn
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "ĐƠN YÊU CẦU CÔNG NHẬN SÁNG KIẾN", bold: true, size: 30, font: "Times New Roman" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: `Năm học: ${data.schoolYear}`, italics: true, size: 26, font: "Times New Roman" }),
          ],
          spacing: { after: 400 },
        }),

        // Kính gửi
        new Paragraph({
          children: [
            new TextRun({ text: "Kính gửi: ", font: "Times New Roman", size: 28 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `- ${data.councilName};`, font: "Times New Roman", size: 28 }),
          ],
          indent: { left: 720 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `- ${data.schoolName}.`, font: "Times New Roman", size: 28 }),
          ],
          indent: { left: 720 },
          spacing: { after: 300 },
        }),

        // Phần I
        new Paragraph({
          children: [
            new TextRun({ text: "I. THÔNG TIN VỀ SÁNG KIẾN VÀ TÁC GIẢ SÁNG KIẾN", bold: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. Tên sáng kiến đề nghị công nhận: ", font: "Times New Roman", size: 28 }),
            new TextRun({ text: data.initiativeName.toUpperCase(), bold: true, font: "Times New Roman", size: 28 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. Lĩnh vực sáng kiến: ", font: "Times New Roman", size: 28 }),
            new TextRun({ text: `${data.field} (Cấp học: ${data.level}, Môn: ${data.subject})`, font: "Times New Roman", size: 28 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `3. Thời gian áp dụng/áp dụng thử sáng kiến: Từ tháng ${data.timeFrom} đến tháng ${data.timeTo}`, font: "Times New Roman", size: 28 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "4. Tác giả (đồng tác giả) sáng kiến gồm:", font: "Times New Roman", size: 28 }),
          ],
          spacing: { after: 200 },
        }),

        // Bảng Tác giả
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "STT", alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "Họ và tên", alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "Năm sinh", alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "Chức vụ, Đơn vị công tác", alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "Tỷ lệ đóng góp", alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "Nội dung đóng góp cụ thể", alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
              ],
            }),
            ...data.authors.map((author, index) => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: author.name })] }),
                new TableCell({ children: [new Paragraph({ text: author.birthYear, alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: author.position })] }),
                new TableCell({ children: [new Paragraph({ text: author.contribution + "%", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: author.duty })] }),
              ],
            })),
          ],
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: "Thông tin liên lạc của đại diện nhóm tác giả:", italics: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Họ tên: ${data.contactName}`, font: "Times New Roman", size: 28 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Điện thoại: ${data.contactPhone}        Email: ${data.contactEmail}`, font: "Times New Roman", size: 28 }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "5. Những người tham gia áp dụng/áp dụng thử sáng kiến lần đầu:", font: "Times New Roman", size: 28 }),
          ],
          spacing: { after: 200 },
        }),

        // Bảng Hỗ trợ
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "STT", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: "Họ và tên", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: "Phòng ban, Đơn vị công tác", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: "Chức vụ", alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: "Nội dung công việc hỗ trợ", alignment: AlignmentType.CENTER })] }),
              ],
            }),
            ...(data.supporters.length > 0 ? data.supporters.map((sup, index) => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: sup.name })] }),
                new TableCell({ children: [new Paragraph({ text: sup.department })] }),
                new TableCell({ children: [new Paragraph({ text: sup.position })] }),
                new TableCell({ children: [new Paragraph({ text: sup.duty })] }),
              ],
            })) : [new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Không có" })], columnSpan: 5 })] })]),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "6. Tài liệu (chứng cứ) kèm theo:", font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 200 },
        }),
        new Paragraph({ children: [new TextRun({ text: `${data.documents.images ? '[X]' : '[ ]'} Hình ảnh minh chứng sản phẩm và quá trình thực hiện của học sinh.`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `${data.documents.reports ? '[X]' : '[ ]'} Báo cáo số liệu, các đường link sản phẩm, minh chứng trực tuyến (nếu có).`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `${data.documents.lessonPlans ? '[X]' : '[ ]'} Kế hoạch bài dạy (Giáo án) có ứng dụng sáng kiến.`, font: "Times New Roman", size: 28 })] }),

        // Phần II
        new Paragraph({
          children: [
            new TextRun({ text: "II. MÔ TẢ SÁNG KIẾN", bold: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 300, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. Thực trạng trước khi thực hiện sáng kiến", bold: true, font: "Times New Roman", size: 28 }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: `- Bối cảnh: ${data.context}`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `- Hạn chế 1 (Phía học sinh): ${data.limit1}`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `- Hạn chế 2 (Phía giáo viên/Cơ sở vật chất): ${data.limit2}`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `- Hạn chế 3 (Tính tương tác): ${data.limit3}`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `- Kết luận: ${data.conclusion}`, font: "Times New Roman", size: 28 })] }),

        new Paragraph({
          children: [
            new TextRun({ text: "2. Nội dung thực hiện sáng kiến", bold: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 200 },
        }),

        ...data.solutions.flatMap((sol, index) => [
          new Paragraph({
            children: [
              new TextRun({ text: `2.${index + 1}. Giải pháp ${index + 1}: ${sol.name}`, bold: true, italics: true, font: "Times New Roman", size: 28 }),
            ],
            spacing: { before: 100 },
          }),
          new Paragraph({ children: [new TextRun({ text: `- Mục tiêu: ${sol.target}`, font: "Times New Roman", size: 28 })] }),
          new Paragraph({ children: [new TextRun({ text: `- Các bước thực hiện: ${sol.steps}`, font: "Times New Roman", size: 28 })] }),
          new Paragraph({ children: [new TextRun({ text: `- Ví dụ minh họa cụ thể: ${sol.example}`, font: "Times New Roman", size: 28 })] }),
        ]),

        new Paragraph({
          children: [
            new TextRun({ text: "Đánh giá chung về nội dung:", italics: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 200 },
        }),
        new Paragraph({ children: [new TextRun({ text: `- Ưu điểm: ${data.advantages}`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `- Nhược điểm: ${data.disadvantages}`, font: "Times New Roman", size: 28 })] }),

        new Paragraph({
          children: [
            new TextRun({ text: "3. Tính mới của sáng kiến", bold: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 200 },
        }),
        new Paragraph({ children: [new TextRun({ text: data.newness, font: "Times New Roman", size: 28 })] }),

        new Paragraph({
          children: [
            new TextRun({ text: "4. Kết quả thực hiện sáng kiến", bold: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 200 },
        }),
        new Paragraph({ children: [new TextRun({ text: `Sáng kiến đã áp dụng tại các lớp ${data.appliedClasses} trong khoảng thời gian từ ${data.resultTimeFrom} đến ${data.resultTimeTo} đem lại kết quả cụ thể như sau:`, font: "Times New Roman", size: 28 })] }),
        
        new Paragraph({ children: [new TextRun({ text: "Bảng thống kê kết quả học tập/khảo sát:", font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: "(Lưu ý: Giáo viên tự chèn bảng kết quả thực tế vào đây)", italics: true, color: "FF0000", font: "Times New Roman", size: 28 })] }),
        
        new Paragraph({ children: [new TextRun({ text: `Sản phẩm cụ thể của giải pháp: ${data.products}`, font: "Times New Roman", size: 28 })] }),

        // Phần III
        new Paragraph({
          children: [
            new TextRun({ text: "III. NHU CẦU ĐỀ XUẤT XÉT, CÔNG NHẬN HIỆU QUẢ ÁP DỤNG VÀ KHẢ NĂNG NHÂN RỘNG", bold: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 300, after: 200 },
        }),
        new Paragraph({ children: [new TextRun({ text: `${data.proposalLevel.school ? '[X]' : '[ ]'} Cấp cơ sở`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `${data.proposalLevel.city ? '[X]' : '[ ]'} Cấp Thành phố/Quận/Huyện`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: "Thuyết minh chi tiết:", font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `- Về hiệu quả áp dụng trong phạm vi cơ sở: ${data.efficiency}`, font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `- Về khả năng nhân rộng: ${data.replication}`, font: "Times New Roman", size: 28 })] }),

        // Phần IV
        new Paragraph({
          children: [
            new TextRun({ text: "IV. CAM ĐOAN CỦA TÁC GIẢ (ĐỒNG TÁC GIẢ)", bold: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 300, after: 200 },
        }),
        new Paragraph({ children: [new TextRun({ text: "Tác giả (đồng tác giả) cam đoan như sau:", font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: "- Sáng kiến không sao chép, không xâm phạm quyền sở hữu trí tuệ;", font: "Times New Roman", size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: "- Tất cả thông tin trên là trung thực, chính xác và hoàn toàn chịu trách nhiệm trước pháp luật./.", font: "Times New Roman", size: 28 })] }),

        // Chữ ký
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: data.dateStr, italics: true, font: "Times New Roman", size: 28 }),
          ],
          spacing: { before: 300, after: 100 },
        }),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
          },
          rows: [
            new TableRow({
              children: data.authors.map((a, i) => new TableCell({
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Tác giả ${i + 1}`, font: "Times New Roman" })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, font: "Times New Roman" })] }),
                  new Paragraph({ children: [new TextRun({ text: "", break: 1 })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: a.name, bold: true, font: "Times New Roman" })] }),
                ],
              }))
            }),
          ]
        })
      ],
    }],
  });

  return await Packer.toBlob(doc);
}
