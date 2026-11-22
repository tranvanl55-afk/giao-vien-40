/* cSpell:disable */

export const DUBLIN_CORE_METADATA = {
  identifier: 'GDPT2018-KHTN9-B30-TINHBOT-CELLULOSE-2026',
  knowledgeUnitCode: '01-06-09-30-01-A-3',
  title: 'Chủ đề STEM/STEAM: Bắt đầu từ sự kết thúc (Bài 30: Tinh bột và Cellulose – KHTN 9)',
  creator: 'Trần Văn Lĩnh (Tổ KHTN – Trường TH - THCS Ngô Chí Quốc)',
  subject: 'Khoa học tự nhiên 9; Tinh bột; Cellulose; Glucose; Phản ứng thủy phân; Phản ứng Iodine; Giáo dục STEM/STEAM',
  description:
    'Học liệu số tương tác HTML5 tổ chức dạy học dự án STEAM theo tiến trình 5 hoạt động của Công văn 3089/BGDĐT-GDTrH, tích hợp thí nghiệm ảo, mô phỏng động học, kiểm tra đánh giá đa dạng 4 hình thức, bảng kiểm Rubric 5 mức và khảo sát phản hồi học sinh.',
  publisher: 'Trường TH - THCS Ngô Chí Quốc – Sở GDĐT TP. Hồ Chí Minh',
  contributor: 'Tổ chuyên môn KHTN – Trường TH - THCS Ngô Chí Quốc',
  date: '2026-11-22',
  type: 'Interactive Resource / Học liệu số tương tác (HTML5)',
  format: 'text/html; application/pdf; application/vnd.openxmlformats-officedocument.wordprocessingml.document; video/mp4; video/webm; audio/mpeg; application/json',
  source: 'Chương trình GDPT 2018 – Môn Khoa học tự nhiên lớp 9 (Thông tư 32/2018/TT-BGDĐT)',
  language: 'vi-VN; en-US (New Words & English Challenge)',
  relation: 'Hệ thống quản lý học liệu số dùng chung ngành GDĐT TP.HCM (QĐ 791/QĐ-SGDĐT)',
  coverage: 'Trung học cơ sở (Lớp 9) – Năm học 2026–2027',
  rights: 'Chia sẻ miễn phí dùng chung ngành GDĐT (CC BY-NC-SA 4.0) – Tuân thủ Điều 4 & Điều 5 QĐ 791/QĐ-SGDĐT',
};

export const getDefaultPublicLessonUrl = (): string => {
  if (
    typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  ) {
    return `${window.location.origin}/lesson/du-an-tinh-bot-cellulose`;
  }
  return 'https://giao-vien-40.netlify.app/lesson/du-an-tinh-bot-cellulose';
};

const escapeXmlHtml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const buildScormIndexHtml = (targetUrl: string, withScormApi: boolean): string => {
  const safeUrl = targetUrl.replace(/"/g, '&quot;');
  const safeTitle = escapeXmlHtml(DUBLIN_CORE_METADATA.title);
  const scormScript = withScormApi
    ? `
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
  </script>`
    : '';

  return `<!DOCTYPE html>
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
  <iframe src="${safeUrl}" title="${safeTitle}" allow="fullscreen; microphone; camera; autoplay"></iframe>
  <div class="fallback-bar">
    <a class="fallback-btn" href="${safeUrl}" target="_blank" rel="noopener noreferrer">↗ Mở tab mới nếu LMS chặn khung</a>
  </div>${scormScript}
</body>
</html>
`;
};

export const downloadHtml5File = (targetUrl: string = getDefaultPublicLessonUrl()): void => {
  const html = buildScormIndexHtml(targetUrl, false);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Bai30-TinhBot-Cellulose-HTML5.html';
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadScorm12Zip = async (
  targetUrl: string = getDefaultPublicLessonUrl()
): Promise<void> => {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const safeTitle = escapeXmlHtml(DUBLIN_CORE_METADATA.title);

  const imsManifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST-${DUBLIN_CORE_METADATA.identifier}" version="1.2"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
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

  zip.file('imsmanifest.xml', imsManifestXml);
  zip.file('index.html', buildScormIndexHtml(targetUrl, true));
  zip.file('metadata-dublin-core.json', JSON.stringify(DUBLIN_CORE_METADATA, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SCORM12-Bai30-TinhBot-Cellulose-KHTN9.zip';
  a.click();
  URL.revokeObjectURL(url);
};
