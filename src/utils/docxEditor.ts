import mammoth from 'mammoth';
import JSZip from 'jszip';
import { getGeminiClient } from '../lib/gemini';
import { Type } from '@google/genai';

export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function generateAICompetencies(lessonText: string) {
  const client = getGeminiClient();
  const prompt = `Bạn là một chuyên gia giáo dục sư phạm và chuyên gia công nghệ thông tin.
Dưới đây là một phần hoặc toàn bộ nội dung giáo án (kế hoạch bài dạy) của giáo viên:

"""
${lessonText}
"""

Dựa vào nội dung bài học trên, hãy đề xuất 2 mục năng lực cần đạt bổ sung cho học sinh, định dạng trả về bắt buộc là JSON với cấu trúc:
{
  "nangLucSo": ["gạch đầu dòng 1", "gạch đầu dòng 2"],
  "nangLucAI": ["gạch đầu dòng 1", "gạch đầu dòng 2"]
}

Yêu cầu nội dung:
1. Năng lực số (Digital Competence): Ràng buộc bắt buộc tuân theo "Thông tư 02/2025/TT-BGDĐT quy định Khung năng lực số cho người học". Hãy chọn lọc các kỹ năng phù hợp nhất với BÀI HỌC NÀY từ các nhóm năng lực cốt lõi (ví dụ: Vận hành thiết bị và phần mềm, Thông tin và dữ liệu số, Giao tiếp và hợp tác trong môi trường số, Sáng tạo nội dung số, An toàn và An sinh số...).
2. Năng lực AI (AI Competence): Ràng buộc bắt buộc tuân theo "Quyết định 3439/QĐ-BGDĐT năm 2025 Khung nội dung thí điểm giáo dục trí tuệ nhân tạo cho học sinh phổ thông". Khả năng hiểu, ứng dụng AI, nguyên lý hoạt động cơ bản của AI, tác động xã hội và ý thức đạo đức khi sử dụng AI sao cho phù hợp với BÀI HỌC NÀY.
Chú ý: Nội dung phải thực tế, có thể triển khai được trong lớp học phổ thông ở Việt Nam.
  `;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nangLucSo: { type: Type.ARRAY, items: { type: Type.STRING } },
          nangLucAI: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['nangLucSo', 'nangLucAI']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('AI returned empty content');
  return JSON.parse(text);
}

// Hàm sinh mã XML cho một đoạn văn (Paragraph) trong Word
function createParagraphXML(text: string, options: { isBold?: boolean, indentLeft?: number, indentHanging?: number } = {}): string {
  const { isBold = false, indentLeft = 0, indentHanging = 0 } = options;
  // Escape XML special characters
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  const indTag = (indentLeft || indentHanging) ? `<w:ind w:left="${indentLeft}" w:hanging="${indentHanging}"/>` : '';
  const bTag = isBold ? '<w:b w:val="1"/><w:bCs w:val="1"/>' : '';

  return `
    <w:p>
      <w:pPr>
        <w:spacing w:after="120" w:line="240" w:lineRule="auto"/>
        ${indTag}
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="28"/>
          <w:szCs w:val="28"/>
          ${bTag}
        </w:rPr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="28"/>
          <w:szCs w:val="28"/>
          ${bTag}
        </w:rPr>
        <w:t>${escapedText}</w:t>
      </w:r>
    </w:p>
  `;
}

export async function insertCompetenciesIntoDocx(
  file: File, 
  nangLucSo: string[], 
  nangLucAI: string[]
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  let docXml = await zip.file('word/document.xml')?.async('string');
  if (!docXml) throw new Error('Không tìm thấy word/document.xml trong file Word này.');

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(docXml, 'application/xml');
  const body = xmlDoc.getElementsByTagName('w:body')[0];
  
  if (!body) throw new Error('Cấu trúc file Word không hợp lệ.');

  const paragraphs = body.getElementsByTagName('w:p');
  let insertBeforeNode: Element | null = null;
  let foundSection2 = false;

  // Thuật toán: 
  // 1. Dò tìm đoạn văn chứa "2." hoặc "2/" hoặc chỉ chữ "Năng lực" (nếu dùng auto-numbering)
  // 2. Tiếp tục dò cho đến khi gặp "3. Phẩm chất", "II.", "Thiết bị", v.v. (Sang phần kế tiếp) -> Lưu node đó làm vị trí chèn (insertBeforeNode).
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const textContent = p.textContent?.trim() || '';
    const originalTxt = textContent.trim();
    const txt = originalTxt.toLowerCase();
    
    if (!foundSection2) {
      const isHeadingNangLuc = /^2\s*[\.\/\)]\s*(?:về\s*)?năng lực/.test(txt) || 
                               txt === 'năng lực' || 
                               txt === 'về năng lực' || 
                               txt === 'năng lực:' || 
                               txt === '2. năng lực' ||
                               txt === '2. về năng lực';
      if (isHeadingNangLuc) {
        foundSection2 = true;
      }
    } else {
      // Đã qua mục 2, tìm điểm bắt đầu của phần kế tiếp
      const isHeadingPhamChat = /^3\s*[\.\/\)]\s*(?:về\s*)?phẩm chất/.test(txt) || 
                                txt === 'phẩm chất' || 
                                txt === 'về phẩm chất' || 
                                txt === 'phẩm chất:' || 
                                txt === '3. phẩm chất' ||
                                txt === '3. về phẩm chất';
      
      const isHeadingThietBi = /^ii\s*[\.\/\)]/.test(txt) || 
                               txt === 'thiết bị dạy học' || 
                               txt === 'thiết bị dạy học và học liệu' || 
                               txt === 'chuẩn bị';
                               
      // Phân biệt hoa thường để tránh nhận nhầm b) của mục 2 thành phần B. hoặc phần II
      const isNextRoman = /^(?:II|III|IV)\s*[\.\/]/.test(originalTxt) || 
                          /^(?:B|C|D)\s*\./.test(originalTxt);

      if (isHeadingPhamChat || isHeadingThietBi || isNextRoman) {
        insertBeforeNode = p;
        break;
      }
    }
  }

  // Generate XML string to insert
  let newXmlString = '';
  // Đề mục c) và d) thụt lề ít
  newXmlString += createParagraphXML('c) Năng lực số', { isBold: true, indentLeft: 0 });
  nangLucSo.forEach((item) => {
    // Nội dung gạch đầu dòng thụt lề nhiều hơn
    newXmlString += createParagraphXML(`- ${item}`, { isBold: false, indentLeft: 360 });
  });
  newXmlString += createParagraphXML('d) Năng lực AI (Trí tuệ nhân tạo)', { isBold: true, indentLeft: 0 });
  nangLucAI.forEach((item) => {
    newXmlString += createParagraphXML(`- ${item}`, { isBold: false, indentLeft: 360 });
  });

  // Convert the string to XML Nodes
  const tempDoc = parser.parseFromString(`<root xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${newXmlString}</root>`, 'application/xml');
  const newNodes = Array.from(tempDoc.documentElement.childNodes);

  if (insertBeforeNode) {
    // Chèn vào trước mục II hoặc mục 3
    newNodes.forEach(node => {
      body.insertBefore(node, insertBeforeNode);
    });
  } else {
    // Nếu không tìm thấy mục tiếp theo, chèn vào cuối cùng của body (trước thẻ sectPr nếu có)
    const sectPr = body.getElementsByTagName('w:sectPr')[0];
    newNodes.forEach(node => {
      if (sectPr) {
        body.insertBefore(node, sectPr);
      } else {
        body.appendChild(node);
      }
    });
  }

  // Serialize back to string
  const serializer = new XMLSerializer();
  const updatedDocXml = serializer.serializeToString(xmlDoc);
  
  // Xóa namespace ảo do DOMParser sinh ra nếu có
  const cleanDocXml = updatedDocXml.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '');

  // Update zip
  zip.file('word/document.xml', cleanDocXml);

  return await zip.generateAsync({ type: 'blob' });
}
