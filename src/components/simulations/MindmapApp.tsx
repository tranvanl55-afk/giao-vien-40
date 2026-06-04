import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Camera, Image as ImageIcon, Upload, FileText, Loader2, Download, AlertCircle, Share2, Expand, ZoomIn, ZoomOut, CheckCircle, Brain, Target, Sparkles, Map, X, Zap, Beaker, Dna, Rocket, Leaf, BookOpen, Lightbulb, Bot, GraduationCap } from 'lucide-react';
import { getGeminiClient, getGeminiApiKey } from '../../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';

interface MindmapNode {
  title: string;
  color?: string;
  children?: MindmapNode[];
}

const LEVEL_COLORS = [
  'from-pink-500 to-rose-500',   // Root
  'from-blue-500 to-cyan-500',   // Level 1
  'from-emerald-500 to-teal-500',// Level 2
  'from-orange-500 to-amber-500',// Level 3
  'from-purple-500 to-fuchsia-500', // Level 4
  'from-slate-500 to-gray-500'   // Level 5+
];

const getIllustrationForNode = (title: string) => {
  const text = title.toLowerCase();
  if (text.includes("điện") || text.includes("dòng điện") || text.includes("pin") || text.includes("năng lượng") || text.includes("áp")) {
    return Zap;
  }
  if (text.includes("lực") || text.includes("vật lý") || text.includes("nhiệt") || text.includes("quang") || text.includes("sóng") || text.includes("âm")) {
    return Target;
  }
  if (text.includes("hóa") || text.includes("chất") || text.includes("phản ứng") || text.includes("axit") || text.includes("bazơ") || text.includes("nguyên tử") || text.includes("phân tử")) {
    return Beaker;
  }
  if (text.includes("sinh") || text.includes("gen") || text.includes("adn") || text.includes("tế bào") || text.includes("di truyền") || text.includes("cơ thể") || text.includes("tim")) {
    return Dna;
  }
  if (text.includes("cây") || text.includes("thực vật") || text.includes("hoa") || text.includes("lá") || text.includes("rễ") || text.includes("quang hợp")) {
    return Leaf;
  }
  if (text.includes("vũ trụ") || text.includes("sao") || text.includes("hành tinh") || text.includes("kính thiên văn") || text.includes("trái đất") || text.includes("mặt trời")) {
    return Rocket;
  }
  if (text.includes("sách") || text.includes("tài liệu") || text.includes("đọc") || text.includes("lý thuyết") || text.includes("bài học") || text.includes("ghi chép")) {
    return BookOpen;
  }
  if (text.includes("ý tưởng") || text.includes("sáng tạo") || text.includes("phát minh") || text.includes("giải pháp") || text.includes("suy nghĩ")) {
    return Lightbulb;
  }
  if (text.includes("ai") || text.includes("công nghệ") || text.includes("máy tính") || text.includes("robot") || text.includes("mạng")) {
    return Bot;
  }
  if (text.includes("thi") || text.includes("kiểm tra") || text.includes("bài tập") || text.includes("kết quả") || text.includes("điểm")) {
    return GraduationCap;
  }
  return Sparkles;
};

// ============ RADIAL MINDMAP (tỏa tròn từ trung tâm) ============

// Bảng màu nhánh – mỗi nhánh chính 1 màu
const BRANCH_PALETTE = [
  '#ef4444', // red
  '#f97316', // orange
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#eab308', // yellow
];

// Tạo path SVG nhánh cong hình S, dày ở gốc mỏng ở ngọn
function taperedBranch(
  x1: number, y1: number,
  x2: number, y2: number,
  w1: number, w2: number,
  direction: 1 | -1
): string {
  // Điểm uốn cong nằm ở giữa khoảng cách X
  const dx = Math.abs(x2 - x1);
  const cp1x = x1 + direction * dx * 0.5;
  const cp2x = x2 - direction * dx * 0.5;
  
  const hw1 = w1 / 2;
  const hw2 = w2 / 2;
  
  return [
    `M ${x1},${y1 - hw1}`,
    `C ${cp1x},${y1 - hw1} ${cp2x},${y2 - hw2} ${x2},${y2 - hw2}`,
    `L ${x2},${y2 + hw2}`,
    `C ${cp2x},${y2 + hw2} ${cp1x},${y1 + hw1} ${x1},${y1 + hw1}`,
    'Z'
  ].join(' ');
}

// Thông tin vị trí 1 node
interface LNode {
  node: MindmapNode;
  x: number;
  y: number;
  level: number;
  colorIdx: number;
  parentX: number;
  parentY: number;
  direction: 1 | -1;
}

// Tính layout cây ngang hai chiều (Tránh đè chữ tuyệt đối)
function calculateHorizontalTree(root: MindmapNode): LNode[] {
  const result: LNode[] = [];
  
  const HORIZONTAL_SPACING = 320;
  const VERTICAL_SPACING = 90; // Đủ không gian cho text
  
  const rootKids = root.children || [];
  
  // Chia đều hai bên trái phải
  const half = Math.ceil(rootKids.length / 2);
  const rightKids = rootKids.slice(0, half);
  const leftKids = rootKids.slice(half);

  // Đếm số lượng 'lá' cuối cùng để cấp phát chiều cao
  function getLeafCount(node: MindmapNode): number {
    if (!node.children || node.children.length === 0) return 1;
    return node.children.reduce((sum, child) => sum + getLeafCount(child), 0);
  }

  // Hàm đệ quy sắp xếp tọa độ
  function layoutNode(
    node: MindmapNode, 
    level: number, 
    colorIdx: number, 
    direction: 1 | -1, 
    parentX: number, 
    parentY: number, 
    startY: number
  ) {
    const leafCount = getLeafCount(node);
    const nodeHeight = leafCount * VERTICAL_SPACING;
    
    // Nằm giữa vùng không gian Y được cấp phát
    const y = startY + nodeHeight / 2;
    // Tịnh tiến X theo level
    const x = direction * level * HORIZONTAL_SPACING;
    
    result.push({ node, x, y, level, colorIdx, parentX, parentY, direction });
    
    let currentY = startY;
    (node.children || []).forEach(child => {
      layoutNode(child, level + 1, colorIdx, direction, x, y, currentY);
      currentY += getLeafCount(child) * VERTICAL_SPACING;
    });
  }

  function layoutSide(kids: MindmapNode[], direction: 1 | -1, startColorIdx: number) {
    const sideTotalLeaves = kids.reduce((sum, k) => sum + getLeafCount(k), 0);
    const sideTotalHeight = sideTotalLeaves * VERTICAL_SPACING;
    
    // Bắt đầu từ Y âm để sơ đồ cân xứng qua gốc (0,0)
    let currentY = -sideTotalHeight / 2;

    kids.forEach((child, i) => {
      const colorIdx = startColorIdx + i;
      layoutNode(child, 1, colorIdx, direction, 0, 0, currentY);
      currentY += getLeafCount(child) * VERTICAL_SPACING;
    });
  }

  // Add root at 0,0
  result.push({ node: root, x: 0, y: 0, level: 0, colorIdx: 0, parentX: 0, parentY: 0, direction: 1 });
  
  layoutSide(rightKids, 1, 0);
  layoutSide(leftKids, -1, rightKids.length);
  
  return result;
}

// Thông tin vị trí 1 node
interface LNode {
  node: MindmapNode;
  x: number;
  y: number;
  level: number;
  colorIdx: number;
  parentX: number;
  parentY: number;
}

// Tính layout tỏa tròn
function radialLayout(root: MindmapNode): LNode[] {
  const result: LNode[] = [];
  result.push({ node: root, x: 0, y: 0, level: 0, colorIdx: 0, parentX: 0, parentY: 0, direction: 1 });

  const kids = root.children || [];
  const n = kids.length;
  if (n === 0) return result;

  const step = 360 / n;
  const startA = -90; // bắt đầu từ đỉnh

  // Khoảng cách từ tâm đến các nhánh cấp 1 tăng tỉ lệ với số nhánh
  const r1 = Math.max(320, 200 + n * 25);

  kids.forEach((child, i) => {
    const angle = startA + i * step;
    const rad = (angle * Math.PI) / 180;
    const cx = Math.cos(rad) * r1;
    const cy = Math.sin(rad) * r1;
    result.push({ node: child, x: cx, y: cy, level: 1, colorIdx: i, parentX: 0, parentY: 0, direction: 1 });

    // Sub-children
    spreadSub(child, cx, cy, angle, step * 0.85, 2, i, result);
  });
  return result;
}

function spreadSub(
  parent: MindmapNode, px: number, py: number,
  pAngle: number, aRange: number,
  lvl: number, cIdx: number, out: LNode[]
) {
  const kids = parent.children || [];
  if (!kids.length || lvl > 5) return;
  
  // Tăng khoảng cách các nhánh sâu để tránh đè chữ
  const r = Math.max(220, 400 - lvl * 50); 
  
  kids.forEach((child, i) => {
    const a = kids.length === 1
      ? pAngle
      : pAngle - aRange / 2 + (i / (kids.length - 1)) * aRange;
    const rad = (a * Math.PI) / 180;
    const cx = px + Math.cos(rad) * r;
    const cy = py + Math.sin(rad) * r;
    out.push({ node: child, x: cx, y: cy, level: lvl, colorIdx: cIdx, parentX: px, parentY: py, direction: 1 });
    spreadSub(child, cx, cy, a, aRange * 0.7, lvl + 1, cIdx, out);
  });
}

// Tìm kết nối parent→child
function buildEdges(root: MindmapNode, layout: LNode[]): { from: LNode; to: LNode }[] {
  const edges: { from: LNode; to: LNode }[] = [];
  function walk(pNode: MindmapNode, pLayout: LNode) {
    (pNode.children || []).forEach(ch => {
      const chL = layout.find(l => l.node === ch);
      if (chL) {
        edges.push({ from: pLayout, to: chL });
        walk(ch, chL);
      }
    });
  }
  const rootL = layout[0];
  walk(root, rootL);
  return edges;
}

// Component hiển thị sơ đồ phân nhánh hai bên ngang
const HorizontalMindmap = ({ data, zoom, mapRef, onLayout }: { data: MindmapNode; zoom: number; mapRef: React.RefObject<HTMLDivElement | null>; onLayout?: (w: number, h: number) => void }) => {
  const layout = useMemo(() => calculateHorizontalTree(data), [data]);
  const edges = useMemo(() => buildEdges(data, layout), [data, layout]);

  // Tính boundary
  const padX = 250;
  const padY = 150;
  const xs = layout.map(n => n.x);
  const ys = layout.map(n => n.y);
  const minX = Math.min(...xs) - padX, maxX = Math.max(...xs) + padX;
  const minY = Math.min(...ys) - padY, maxY = Math.max(...ys) + padY;
  const W = maxX - minX, H = maxY - minY;
  const ox = -minX, oy = -minY; // offset

  useEffect(() => {
    if (onLayout) onLayout(W, H);
  }, [W, H, onLayout]);

  return (
    <div 
      className="relative shrink-0 transition-all duration-200" 
      style={{ width: W * zoom, height: H * zoom }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left transition-transform duration-200"
        style={{ transform: `scale(${zoom})`, width: W, height: H }}
      >
        <div ref={mapRef} className="absolute inset-0 bg-slate-900" style={{ width: W, height: H }}>
          <svg width={W} height={H} className="absolute inset-0">
          {edges.map((e, i) => {
            const color = BRANCH_PALETTE[e.to.colorIdx % BRANCH_PALETTE.length];
            // Độ dày gốc nhánh
            const w1 = Math.max(4, 24 - e.to.level * 6);
            // Độ dày ngọn nhánh
            const w2 = Math.max(2, 16 - e.to.level * 5);

            // Bỏ các giá trị offset cứng để vẽ từ tâm đến tâm.
            // Vì các hộp chữ (node) hiện tại đều có nền đặc (solid background),
            // các đoạn thẳng nằm bên trong hộp chữ sẽ tự động bị che khuất một cách hoàn hảo,
            // tạo cảm giác đường nối bắt đầu/kết thúc chính xác tại mép hộp chữ dù độ rộng văn bản thay đổi.
            const startX = e.from.x + ox;
            const endX = e.to.x + ox;

            const path = taperedBranch(
              startX, e.from.y + oy,
              endX, e.to.y + oy,
              w1, w2, e.to.direction
            );
            return (
              <motion.path
                key={i}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.8, scaleX: 1 }}
                style={{ transformOrigin: `${startX}px ${e.from.y + oy}px` }}
                transition={{ duration: 0.5, delay: e.to.level * 0.12 }}
                d={path}
                fill={color}
              />
            );
          })}
        </svg>

        {/* Node labels */}
        {layout.map((item, i) => {
          const px = item.x + ox;
          const py = item.y + oy;
          const color = BRANCH_PALETTE[item.colorIdx % BRANCH_PALETTE.length];
          const IconComponent = item.level === 0 ? Brain : getIllustrationForNode(item.node.title);

          if (item.level === 0) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.4, x: "-50%", y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="absolute z-20"
                style={{ left: px, top: py }}
              >
                <div className="bg-linear-to-br from-pink-500 to-rose-600 text-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.4)] border-4 border-white/30">
                  <IconComponent className="w-14 h-14 mb-2 drop-shadow-lg text-white" />
                  <span className="font-black text-sm text-center px-4 leading-tight drop-shadow-md">{item.node.title}</span>
                </div>
              </motion.div>
            );
          }

          if (item.level === 1) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6, x: "-50%", y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.04 }}
                className="absolute z-10"
                style={{ left: px, top: py }}
              >
                <div
                  className="flex flex-col items-center gap-2 px-6 py-4 rounded-3xl shadow-xl border-2 border-white/20 text-white font-bold text-sm max-w-[220px] text-center backdrop-blur-sm"
                  style={{ backgroundColor: color }}
                >
                  <IconComponent className="w-10 h-10 drop-shadow-md text-white opacity-90" />
                  <span className="drop-shadow-sm leading-snug">{item.node.title}</span>
                </div>
              </motion.div>
            );
          }

          // Level 2+
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.02 }}
              className="absolute z-10"
              style={{ left: px, top: py }}
            >
              <div
                className="px-4 py-2 rounded-2xl shadow-lg border-2 text-sm font-semibold max-w-[180px] text-center bg-slate-900 z-20 relative"
                style={{
                  borderColor: color,
                  color: color,
                }}
              >
                {item.node.title}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default function MindmapApp() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mindmapData, setMindmapData] = useState<MindmapNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLayout = useCallback((w: number, h: number) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    // Tự động fit sơ đồ vào khung hiển thị
    const paddingX = 100;
    const paddingY = 100;
    const scaleX = (clientWidth - paddingX) / w;
    const scaleY = (clientHeight - paddingY) / h;
    
    // Lấy tỷ lệ nhỏ nhất để hiển thị đủ cả hai chiều, nhưng không phóng quá 120%
    const optimalZoom = Math.min(scaleX, scaleY, 1.2);
    setZoom(Number(optimalZoom.toFixed(2)));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
        setMindmapData(null); // Reset cũ
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMindmap = async () => {
    if (!imagePreview) return;
    setIsProcessing(true);
    setError(null);

    try {
      const ai = getGeminiClient();
      if (!getGeminiApiKey()) {
        setError('Tài khoản của bạn yêu cầu nhập Gemini API Key để sử dụng tính năng AI này. Vui lòng đăng nhập lại!');
        setIsProcessing(false);
        return;
      }

      // Chuẩn bị ảnh base64 cho API
      const base64Data = imagePreview.split(',')[1];
      const mimeType = imagePreview.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

      const prompt = `
Bạn là một chuyên gia giáo dục. Phân tích nội dung trong bức ảnh trang sách/tài liệu này và tạo ra một sơ đồ tư duy (Mindmap) để tóm tắt các kiến thức trọng tâm.
Hãy thiết kế cấu trúc có tính logic cao, từ chủ đề lớn nhất phân nhánh ra các ý nhỏ dần. Ngắn gọn, súc tích.
TUYỆT ĐỐI KHÔNG sử dụng dấu ba chấm (...) hay cắt xén chữ lửng lơ. Hãy tóm tắt trọn vẹn bằng các cụm từ ngắn nhưng có ý nghĩa hoàn chỉnh.
Trả về JSON đúng chuẩn theo format sau, không kèm bất kỳ giải thích hay dấu markdown backticks nào:
{
  "title": "Chủ đề chính",
  "children": [
    {
      "title": "Ý lớn 1",
      "children": [
        { "title": "Chi tiết 1.1", "children": [] },
        { "title": "Chi tiết 1.2" }
      ]
    },
    {
      "title": "Ý lớn 2",
      "children": []
    }
  ]
}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      });

      const text = response.text || "";
      // Làm sạch response để lấy JSON
      let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }

      const mapData = JSON.parse(jsonStr) as MindmapNode;
      setMindmapData(mapData);
    } catch (err: any) {
      console.error('Lỗi khi tạo sơ đồ tư duy:', err);
      setError('Đã có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại hoặc chụp ảnh rõ nét hơn.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!mapRef.current) return;
    const originalZoom = zoom;
    try {
      setZoom(1); // Trả về zoom 1 để chụp nét
      
      // Đợi DOM cập nhật zoom và animation hoàn tất
      await new Promise(r => setTimeout(r, 300));

      const dataUrl = await toPng(mapRef.current, {
        cacheBust: true,
        backgroundColor: '#0f172a',
        pixelRatio: 2, // Tăng chất lượng
      });
      
      const link = document.createElement('a');
      link.download = `so-do-tu-duy-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

    } catch (err: any) {
      console.error('Lỗi khi xuất ảnh:', err);
      alert(`Không thể xuất ảnh lúc này: ${err?.message || 'Lỗi không xác định'}`);
    } finally {
      setZoom(originalZoom); // Luôn khôi phục zoom dù có lỗi hay không
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col md:flex-row relative">
      {/* Cột trái: Tải ảnh & Xử lý */}
      <div className="w-full md:w-1/3 xl:w-1/4 bg-slate-800/50 backdrop-blur-md border-r border-white/10 p-4 md:p-6 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">Sơ Đồ Tư Duy AI</h2>
            <p className="text-xs text-cyan-400 font-medium">Tóm tắt siêu tốc từ ảnh</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-4">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 shadow-inner">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              Nguồn Dữ Liệu
            </h3>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={cameraInputRef} 
              onChange={handleImageUpload} 
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
              >
                <Camera className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Chụp ảnh</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
              >
                <ImageIcon className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Tải lên</span>
              </button>
            </div>

            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/30 group">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent flex items-end p-3">
                  <span className="text-xs font-medium text-cyan-300 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Đã tải ảnh lên
                  </span>
                </div>
                <button 
                  onClick={() => { setImagePreview(null); setMindmapData(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 rounded-full backdrop-blur-md transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          <button
            onClick={generateMindmap}
            disabled={!imagePreview || isProcessing}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden group ${
              !imagePreview || isProcessing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.02]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang vẽ Sơ đồ...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Tạo Sơ Đồ Tư Duy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cột phải: Canvas hiển thị Sơ đồ */}
      <div className="flex-1 bg-slate-900 relative flex flex-col">
        {/* Thanh công cụ Canvas */}
        {mindmapData && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white" title="Thu nhỏ">
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-cyan-400 min-w-[3ch] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white" title="Phóng to">
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button onClick={handleDownloadPNG} className="p-2 hover:bg-emerald-500/20 rounded-full transition-colors text-emerald-400 hover:text-emerald-300 flex items-center gap-2 px-4" title="Tải xuống">
              <Download className="w-5 h-5" />
              <span className="text-sm font-bold hidden sm:block">Xuất PNG</span>
            </button>
          </div>
        )}

        {/* Khu vực vẽ */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto w-full h-full p-8 grid [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 relative"
          style={{ placeContent: 'safe center' }}
        >
          <AnimatePresence>
            {!mindmapData && !isProcessing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center text-slate-500 max-w-sm text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-3xl bg-slate-800/50 flex items-center justify-center border border-white/5 shadow-inner">
                  <Map className="w-12 h-12 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">Bản vẽ trống</h3>
                <p className="text-sm leading-relaxed">Tải lên một hình ảnh sách giáo khoa hoặc tài liệu để AI trích xuất và thiết kế Sơ đồ tư duy cho bạn.</p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-cyan-500"
              >
                <div className="relative">
                  <Brain className="w-16 h-16 animate-pulse" />
                  <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
                </div>
                <p className="mt-6 font-bold tracking-widest uppercase text-sm animate-pulse">Trí tuệ nhân tạo đang phân tích...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render Mindmap hai bên ngang */}
          {mindmapData && (
            <HorizontalMindmap data={mindmapData} zoom={zoom} mapRef={mapRef} onLayout={handleLayout} />
          )}
        </div>
      </div>
    </div>
  );
}
