import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Upload, Trash2, Edit3, Check, X, Play, Pause, 
  Volume2, VolumeX, Maximize2, Minimize2, Eye, Compass, 
  Sparkles, Palette, Layers, Image as ImageIcon, User, FileText, ChevronRight,
  ChevronLeft, ArrowUp, Plus, Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

// ----------------------------------------------------
// DỮ LIỆU TRANH MẪU BAN ĐẦU (Khoa học & Thiên nhiên)
// ----------------------------------------------------
interface PaintingData {
  id: string;
  url: string;
  title: string;
  author: string;
  desc: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const DEFAULT_PAINTINGS: PaintingData[] = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800',
    title: 'Tinh vân Vũ trụ (Nebula)',
    author: 'Trần Minh Quân - Lớp 7A1',
    desc: 'Mô phỏng làn bụi khí đầy màu sắc của các ngôi sao đã chết phát sáng trong không gian vũ trụ sâu thẳm.'
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800',
    title: 'Cấu tạo Tế bào Thực vật dưới Kính hiển vi',
    author: 'Lê Quỳnh Chi - Lớp 6B2',
    desc: 'Quan sát các bào quan đặc trưng như Lục lạp màu xanh lục và vách tế bào Cellulose cứng cáp dưới lăng kính khoa học.'
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800',
    title: 'Đại dương xanh và Đa dạng sinh học biển',
    author: 'Phạm Đức Nam - Lớp 8A3',
    desc: 'Rạn san hô đầy màu sắc đóng vai trò là ngôi nhà sinh sống của hàng ngàn sinh vật đại dương kỳ thú.'
  },
  {
    id: 'p4',
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800',
    title: 'Mạng lưới Năng lượng Vật lý Điện từ',
    author: 'Nguyễn Thanh Tùng - Lớp 9A1',
    desc: 'Biểu diễn trực quan các hạt electron chuyển động dọc theo từ trường sinh ra dòng điện xoay chiều điện năng.'
  },
  {
    id: 'p5',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    title: 'Đa dạng sinh học Rừng nhiệt đới',
    author: 'Đỗ Thùy Linh - Lớp 9A2',
    desc: 'Mô hình chuỗi thức ăn và hệ sinh thái thực vật đa dạng cung cấp oxy và duy trì sự cân bằng của khí quyển.'
  },
  {
    id: 'p6',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=800',
    title: 'Phản ứng Hóa học trong Ống nghiệm',
    author: 'Hoàng Anh Tuấn - Lớp 8B1',
    desc: 'Mô phỏng sự đổi màu của dung dịch chỉ thị màu axit-bazơ khi xảy ra phản ứng trung hòa trong phòng thí nghiệm.'
  }
];

// ----------------------------------------------------
// HÌNH HỌC PHÒNG TRIỂN LÃM 3D (TƯỜNG, SÀN, TRẦN)
// ----------------------------------------------------
type GalleryLayout = 'cylinder' | 'hallway' | 'cube' | 'galaxy';
type GalleryTheme = 'museum' | 'technology' | 'galaxy' | 'ocean';

const ROOM_PERSPECTIVE = 950;   // perspective dùng cho chế độ "đứng trong phòng"
const ROOM_CAMERA_BACK = 0;     // camera đặt ngay tâm phòng để xoay chuẩn 360°, không lệch trục hay xiêu vẹo
const ROOM_HEIGHT = 700;
const ROOM_SLOT = 330;          // khoảng cách giữa 2 bức tranh trên cùng một bức tường
const HALL_RADIUS = 820;        // bán kính bức tường cong

const isRoomLayout = (l: GalleryLayout) => l === 'hallway' || l === 'cube';
const getRoomHalf = (count: number) => Math.max(820, (Math.ceil(count / 4) * ROOM_SLOT + 260) / 2);
const getHallSpan = (count: number) => (count > 1 ? Math.min(150, (count - 1) * 24) : 0);

/** Vị trí 3D của từng bức tranh + góc cần xoay để đưa tranh ra chính diện */
const getCardPlacement = (layout: GalleryLayout, idx: number, count: number) => {
  if (layout === 'hallway') {
    const span = getHallSpan(count);
    const a = count > 1 ? span / 2 - (idx / (count - 1)) * span : 0;
    return { focusAngle: a, transform: `rotateY(${a}deg) translateZ(${-HALL_RADIUS}px)` };
  }
  if (layout === 'cube') {
    const half = getRoomHalf(count);
    const wall = idx % 4;
    const slot = Math.floor(idx / 4);
    const onWall = Math.floor((count - wall - 1) / 4) + 1;
    const offset = (slot - (onWall - 1) / 2) * ROOM_SLOT;
    const a = wall * 90;
    const focusAngle = a + (Math.atan2(offset, half) * 180) / Math.PI;
    return { focusAngle, transform: `rotateY(${a}deg) translateZ(${-half}px) translateX(${offset}px)` };
  }
  const R = Math.max(450, (count * 310) / (2 * Math.PI));
  const a = (idx / count) * 360;
  return { focusAngle: a, transform: `rotateY(${a}deg) translateZ(${R}px)` };
};

const ROOM_THEMES: Record<GalleryTheme, {
  name: string;
  wall: string;
  pattern: string;
  trim: string;
  floor: string;
  grid: string;
  ceiling: string;
  spot: string;
  isLight: boolean;
}> = {
  museum: {
    name: 'Bảo tàng Trắng Hiện đại',
    wall: 'linear-gradient(180deg, #ffffff 0%, #fbfbfc 40%, #f4f4f7 100%)',
    pattern: 'radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1.5px)',
    trim: '#e2e8f0',
    floor: 'repeating-linear-gradient(90deg, #fafafa, #fafafa 58px, #e4e4e7 59px, #f4f4f5 60px)', // Sàn ván gỗ trắng sáng bóng
    grid: 'rgba(0,0,0,0.03)',
    ceiling: 'linear-gradient(180deg, #ffffff, #f4f4f6)',
    spot: 'rgba(254, 240, 138, 0.45)', // Đèn rọi spotlight vàng ấm của bảo tàng nghệ thuật
    isLight: true,
  },
  technology: {
    name: 'Công nghệ Tương lai',
    wall: 'linear-gradient(180deg, #13223a 0%, #0c1729 55%, #08111f 100%)',
    pattern: 'linear-gradient(to right, rgba(34,211,238,0.06) 1px, transparent 1px)',
    trim: '#22d3ee',
    floor: 'radial-gradient(ellipse at center, #12263f 0%, #07101d 70%)',
    grid: 'rgba(34,211,238,0.10)',
    ceiling: 'linear-gradient(180deg, #060c18, #0a1424)',
    spot: 'rgba(165,243,252,0.22)',
    isLight: false,
  },
  galaxy: {
    name: 'Vũ trụ Thiên hà',
    wall: 'linear-gradient(180deg, #1d1a48 0%, #15123a 55%, #0d0b26 100%)',
    pattern: 'radial-gradient(circle, rgba(196,181,253,0.10) 1px, transparent 1.5px)',
    trim: '#a78bfa',
    floor: 'radial-gradient(ellipse at center, #1a1640 0%, #0a081c 70%)',
    grid: 'rgba(129,140,248,0.10)',
    ceiling: 'linear-gradient(180deg, #08061a, #110e2e)',
    spot: 'rgba(221,214,254,0.22)',
    isLight: false,
  },
  ocean: {
    name: 'Đại dương Sâu thẳm',
    wall: 'linear-gradient(180deg, #0f3a4d 0%, #0b2e3e 55%, #072230 100%)',
    pattern: 'linear-gradient(to right, rgba(45,212,191,0.06) 1px, transparent 1px)',
    trim: '#2dd4bf',
    floor: 'radial-gradient(ellipse at center, #11404d 0%, #061a24 70%)',
    grid: 'rgba(45,212,191,0.10)',
    ceiling: 'linear-gradient(180deg, #04151e, #0a2a38)',
    spot: 'rgba(153,246,228,0.22)',
    isLight: false,
  },
};

const centeredBox = (w: number, h: number): React.CSSProperties => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: w,
  height: h,
  marginLeft: -w / 2,
  marginTop: -h / 2,
  pointerEvents: 'none',
});

const WallTrim = ({ color, isLight }: { color: string; isLight: boolean }) => (
  <>
    {/* Phào chỉ trần thạch cao giật 2 cấp */}
    <div 
      className="absolute inset-x-0 top-0 h-10 pointer-events-none" 
      style={{ 
        background: isLight 
          ? 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 60%, rgba(0,0,0,0.06) 100%)' 
          : 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.25))',
        borderBottom: `2px solid ${isLight ? '#cbd5e1' : `${color}55`}`,
        boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
      }} 
    >
      <div className="absolute inset-x-4 top-2 h-4 border-b border-slate-300/60" />
    </div>

    {/* Phào chỉ tường trang trí nổi (Molding panels) */}
    {isLight && (
      <div className="absolute inset-x-12 inset-y-16 pointer-events-none border border-slate-200/80 rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]" />
    )}

    {/* Len chân tường (Baseboard molding) */}
    <div 
      className="absolute inset-x-0 bottom-0 h-9 pointer-events-none" 
      style={{ 
        background: isLight 
          ? 'linear-gradient(0deg, #e2e8f0 0%, #ffffff 80%, #cbd5e1 100%)' 
          : 'linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15))', 
        borderTop: `2px solid ${isLight ? '#94a3b8' : color}`, 
        boxShadow: isLight ? '0 -4px 10px rgba(0,0,0,0.03)' : `0 -6px 22px ${color}55` 
      }} 
    />
  </>
);

/** Vỏ phòng 3D: tường + sàn + trần + cột trụ kiến trúc + vách ngăn */
const RoomShell = ({ 
  layout, 
  theme, 
  count,
  paintings,
  onCardClick 
}: { 
  layout: GalleryLayout; 
  theme: GalleryTheme; 
  count: number;
  paintings: PaintingData[];
  onCardClick: (p: PaintingData, angle: number) => void;
}) => {
  const t = ROOM_THEMES[theme];
  const isLight = t.isLight;

  const wallBg: React.CSSProperties = {
    backgroundImage: `${t.pattern}, ${t.wall}`,
    backgroundSize: theme === 'galaxy' ? '28px 28px, 100% 100%' : '90px 100%, 100% 100%',
    boxShadow: isLight ? 'inset 0 0 80px rgba(0,0,0,0.04)' : 'inset 0 0 120px rgba(0,0,0,0.55)',
  };

  const floorBg: React.CSSProperties = {
    backgroundImage: theme === 'museum'
      ? t.floor
      : `linear-gradient(to right, ${t.grid} 1px, transparent 1px), linear-gradient(to bottom, ${t.grid} 1px, transparent 1px), ${t.floor}`,
    backgroundSize: theme === 'museum' ? '60px 100%' : '110px 110px, 110px 110px, 100% 100%',
    boxShadow: isLight ? 'inset 0 0 120px rgba(0,0,0,0.06)' : 'none',
  };

  if (layout === 'cube') {
    const half = getRoomHalf(count);
    const W = half * 2;
    const pillarWidth = 75;

    return (
      <>
        {/* 4 BỨC TƯỜNG CHÍNH (BẮC, ĐÔNG, NAM, TÂY) */}
        {[0, 1, 2, 3].map(w => (
          <div
            key={`wall-${w}`}
            style={{
              ...centeredBox(W, ROOM_HEIGHT),
              ...wallBg,
              transform: `rotateY(${w * 90}deg) translateZ(${-(half + 6)}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            <WallTrim color={t.trim} isLight={isLight} />

            {/* CỘT TRỤ KIẾN TRÚC TRÊN MỖI TƯỜNG (như ảnh của người dùng) */}
            {isLight && (
              <>
                {/* Cột trụ trái */}
                <div 
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{
                    left: W * 0.18,
                    width: pillarWidth,
                    background: 'linear-gradient(90deg, #f1f5f9 0%, #ffffff 40%, #e2e8f0 100%)',
                    boxShadow: '10px 0 25px rgba(0,0,0,0.06), -6px 0 15px rgba(0,0,0,0.03)',
                    transform: 'translateZ(18px)',
                    borderLeft: '1px solid #e2e8f0',
                    borderRight: '1px solid #cbd5e1'
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-10 bg-slate-100 border-b-2 border-slate-300 shadow-sm" />
                  <div className="absolute inset-x-0 bottom-0 h-9 bg-slate-200 border-t-2 border-slate-400" />
                </div>

                {/* Cột trụ phải */}
                <div 
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{
                    right: W * 0.18,
                    width: pillarWidth,
                    background: 'linear-gradient(90deg, #e2e8f0 0%, #ffffff 60%, #f1f5f9 100%)',
                    boxShadow: '-10px 0 25px rgba(0,0,0,0.06), 6px 0 15px rgba(0,0,0,0.03)',
                    transform: 'translateZ(18px)',
                    borderLeft: '1px solid #cbd5e1',
                    borderRight: '1px solid #e2e8f0'
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-10 bg-slate-100 border-b-2 border-slate-300 shadow-sm" />
                  <div className="absolute inset-x-0 bottom-0 h-9 bg-slate-200 border-t-2 border-slate-400" />
                </div>
              </>
            )}
          </div>
        ))}

        {/* VÁCH NGĂN CHIA GIAN TRIỂN LÃM (ALCOVE PARTITIONS) NẰM GIỮA CÁC GIAN TRANH */}
        {isLight && (
          <>
            {/* Vách ngăn chia gian trên tường Bắc (Wall 0) */}
            <div
              style={{
                ...centeredBox(220, ROOM_HEIGHT * 0.72),
                transform: `rotateY(0deg) translateZ(${-(half - 110)}px) translateX(0px) rotateY(90deg)`,
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
                border: '2px solid #cbd5e1',
                boxShadow: '0 15px 35px rgba(0,0,0,0.12), -15px 0 25px rgba(0,0,0,0.04)',
                pointerEvents: 'none',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="absolute inset-2 border border-slate-300/70 rounded-xs" />
              <div className="absolute inset-x-0 top-0 h-3 bg-slate-200/90 border-b border-slate-300" />
              <div className="absolute inset-x-0 bottom-0 h-5 bg-slate-300 border-t border-slate-400" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-800 text-[8px] font-bold text-amber-200 tracking-wider uppercase shadow whitespace-nowrap">
                Gian Triển Lãm 1
              </div>
            </div>

            {/* Vách ngăn chia gian trên tường Đông (Wall 1) */}
            <div
              style={{
                ...centeredBox(220, ROOM_HEIGHT * 0.72),
                transform: `rotateY(90deg) translateZ(${-(half - 110)}px) translateX(0px) rotateY(90deg)`,
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
                border: '2px solid #cbd5e1',
                boxShadow: '0 15px 35px rgba(0,0,0,0.12), -15px 0 25px rgba(0,0,0,0.04)',
                pointerEvents: 'none',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="absolute inset-2 border border-slate-300/70 rounded-xs" />
              <div className="absolute inset-x-0 top-0 h-3 bg-slate-200/90 border-b border-slate-300" />
              <div className="absolute inset-x-0 bottom-0 h-5 bg-slate-300 border-t border-slate-400" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-800 text-[8px] font-bold text-amber-200 tracking-wider uppercase shadow whitespace-nowrap">
                Gian Triển Lãm 2
              </div>
            </div>
          </>
        )}

        {/* SÀN PHÒNG TRIỂN LÃM */}
        <div 
          style={{ 
            ...centeredBox(W, W), 
            ...floorBg, 
            transform: `translateY(${ROOM_HEIGHT / 2}px) rotateX(90deg)`,
            transformStyle: 'preserve-3d',
          }} 
        >
          {/* Lớp bóng kính phản chiếu sàn */}
          {isLight && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, transparent 100%)',
              }}
            />
          )}

          {/* DẤU MŨI TÊN THAM QUAN TRÊN SÀN (FLOOR WAYPOINT ARROWS) CHO TỪNG BỨC TRANH */}
          {paintings.map((p, idx) => {
            const { focusAngle } = getCardPlacement(layout, idx, count);
            const rad = (focusAngle * Math.PI) / 180;
            const dist = half * 0.58; // khoảng cách từ tâm đến mũi tên
            const arrowX = W / 2 + Math.sin(rad) * dist;
            const arrowY = W / 2 - Math.cos(rad) * dist;

            return (
              <div
                key={`floor-arrow-${p.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(p, focusAngle);
                }}
                className="absolute z-10 cursor-pointer group pointer-events-auto"
                style={{
                  left: arrowX - 44,
                  top: arrowY - 44,
                  width: 88,
                  height: 88,
                  transform: `rotate(${focusAngle}deg)`,
                }}
                title={`Bước tới ngắm tranh: ${p.title}`}
              >
                {/* Vòng tròn nhấp nháy phát sáng trên sàn */}
                <div 
                  className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-115 ${
                    isLight 
                      ? 'bg-white/95 border-2 border-amber-400 shadow-[0_4px_25px_rgba(251,191,36,0.65)] hover:border-amber-500 hover:bg-amber-50' 
                      : 'bg-slate-900/90 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:border-cyan-300'
                  }`}
                >
                  {/* Mũi tên chỉ hướng */}
                  <ArrowUp 
                    className={`w-5 h-5 animate-bounce mb-0.5 ${
                      isLight ? 'text-amber-600' : 'text-cyan-400'
                    }`} 
                  />
                  <span 
                    className={`text-[8.5px] font-black uppercase tracking-wider text-center px-1 ${
                      isLight ? 'text-slate-800' : 'text-cyan-200'
                    }`}
                  >
                    Vách {idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* TRẦN THẠCH CAO GIẬT CẤP + ĐÈN SPOTLIGHT TRẦN */}
        <div 
          style={{ 
            ...centeredBox(W, W), 
            background: t.ceiling, 
            transform: `translateY(${-ROOM_HEIGHT / 2}px) rotateX(-90deg)`,
            boxShadow: isLight ? 'inset 0 0 100px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          {isLight ? (
            /* Trần giật cấp 2 lớp thạch cao trắng có khe hắt sáng như ảnh mẫu */
            <div className="absolute inset-16 border-4 border-slate-200 bg-white/90 shadow-[inset_0_0_40px_rgba(0,0,0,0.06)] flex items-center justify-center">
              <div className="w-[75%] h-[75%] border-2 border-slate-300/80 bg-slate-50/50 shadow-inner" />
              {/* Cụm đèn spotlight trần */}
              {[0.25, 0.5, 0.75].map(x => (
                [0.25, 0.75].map(y => (
                  <div 
                    key={`light-${x}-${y}`} 
                    className="absolute w-5 h-5 rounded-full bg-amber-100 border border-amber-300 shadow-[0_0_25px_8px_rgba(254,240,138,0.8)]"
                    style={{ left: `${x * 100}%`, top: `${y * 100}%`, marginLeft: -10, marginTop: -10 }}
                  />
                ))
              ))}
            </div>
          ) : (
            [0.3, 0.5, 0.7].map(p => (
              <div 
                key={p} 
                className="absolute inset-y-[18%] w-2.5 rounded-full" 
                style={{ 
                  left: `${p * 100}%`, 
                  background: t.trim, 
                  opacity: 0.35, 
                  boxShadow: `0 0 30px 6px ${t.trim}66` 
                }} 
              />
            ))
          )}
        </div>
      </>
    );
  }

  // Hallway: bức tường cong nghệ thuật
  const span = getHallSpan(count) + 56;
  const step = 6;
  const R = HALL_RADIUS + 6;
  const segW = 2 * R * Math.tan(((step / 2) * Math.PI) / 180) + 2;
  const segments: number[] = [];
  for (let a = -span / 2; a <= span / 2 + 0.001; a += step) segments.push(a);
  const floorSize = R * 2 + 500;

  return (
    <>
      {segments.map(a => (
        <div
          key={`seg-${a}`}
          style={{
            ...centeredBox(segW, ROOM_HEIGHT),
            backgroundImage: t.wall,
            boxShadow: isLight ? 'inset 0 0 40px rgba(0,0,0,0.03)' : 'inset 0 0 60px rgba(0,0,0,0.35)',
            transform: `rotateY(${a}deg) translateZ(${-R}px)`,
            backfaceVisibility: 'hidden',
          }}
        >
          <WallTrim color={t.trim} isLight={isLight} />
        </div>
      ))}
      {/* Sàn hành lang */}
      <div
        style={{
          ...centeredBox(floorSize, floorSize),
          ...floorBg,
          transform: `translateY(${ROOM_HEIGHT / 2}px) rotateX(90deg)`,
          maskImage: 'radial-gradient(circle, #000 45%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, #000 45%, transparent 70%)',
        }}
      />
    </>
  );
};

// ----------------------------------------------------
// DỰ DỰNG NHẠC NỀN BẰNG WEB AUDIO API (KHÔNG TỐN BĂNG THÔNG)
// ----------------------------------------------------
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  start() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.filterNode = this.ctx.createBiquadFilter();

      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2.5);

      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(420, this.ctx.currentTime);

      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      const freqs = [174.61, 261.63, 392.00, 440.00, 659.25];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.filterNode) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.2, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        oscGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.filterNode);

        lfo.start();
        osc.start();

        this.oscillators.push(osc);
      });
    } catch (e) {
      console.warn("Lỗi nhạc nền Web Audio:", e);
    }
  }

  stop() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try { osc.stop(); } catch(e){}
        });
        if (this.ctx && this.ctx.state !== 'closed') {
          this.ctx.close();
        }
        this.oscillators = [];
        this.ctx = null;
      }, 700);
    }
  }
}

// ----------------------------------------------------
// CANVAS HIỆU ỨNG HẠT LƠ LỬNG TRANG TRÍ THEO CHỦ ĐỀ
const ParticleCanvas = ({ theme }: { theme: GalleryTheme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (theme === 'museum') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Theme objects
    let stars: Array<{
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;
      phase: number;
      opacity: number;
      color: string;
    }> = [];

    let nebulas: Array<{
      x: number;
      y: number;
      radius: number;
      color1: string;
      color2: string;
    }> = [];

    let shootingStar = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      length: 0,
      life: 0,
      maxLife: 0,
      active: false
    };

    let rays: Array<{
      angle: number;
      speed: number;
      width: number;
      opacity: number;
    }> = [];

    let bubbles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      swaySpeed: number;
      swayWidth: number;
      swayPhase: number;
      opacity: number;
    }> = [];

    let binaryStreams: Array<{
      x: number;
      y: number;
      char: string;
      speedY: number;
      opacity: number;
      fontSize: number;
    }> = [];

    let techTracks: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    let techPackets: Array<{
      trackIdx: number;
      progress: number;
      speed: number;
      size: number;
    }> = [];

    const initObjects = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      if (theme === 'galaxy') {
        stars = [];
        const starColors = ['rgba(255, 255, 255, 0.85)', 'rgba(196, 181, 253, 0.75)', 'rgba(165, 180, 252, 0.65)', 'rgba(253, 244, 255, 0.8)'];
        for (let i = 0; i < 140; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2.8 + 0.5,
            twinkleSpeed: 0.01 + Math.random() * 0.03,
            phase: Math.random() * Math.PI * 2,
            opacity: 0.35 + Math.random() * 0.65,
            color: starColors[Math.floor(Math.random() * starColors.length)]
          });
        }

        nebulas = [
          { x: width * 0.25, y: height * 0.3, radius: Math.min(width, height) * 0.5, color1: 'rgba(147, 51, 234, 0.13)', color2: 'rgba(147, 51, 234, 0)' },
          { x: width * 0.75, y: height * 0.65, radius: Math.min(width, height) * 0.55, color1: 'rgba(79, 70, 229, 0.12)', color2: 'rgba(79, 70, 229, 0)' },
          { x: width * 0.5, y: height * 0.4, radius: Math.min(width, height) * 0.4, color1: 'rgba(6, 182, 212, 0.05)', color2: 'rgba(6, 182, 212, 0)' }
        ];

        shootingStar = {
          x: 0,
          y: 0,
          dx: 0,
          dy: 0,
          length: 0,
          life: 0,
          maxLife: 0,
          active: false
        };
      } else if (theme === 'ocean') {
        rays = [
          { angle: -0.15, speed: 0.0003, width: 90, opacity: 0.06 },
          { angle: 0.05, speed: -0.0002, width: 110, opacity: 0.05 },
          { angle: 0.22, speed: 0.0004, width: 100, opacity: 0.07 },
          { angle: -0.28, speed: -0.0001, width: 130, opacity: 0.04 }
        ];

        bubbles = [];
        for (let i = 0; i < 55; i++) {
          bubbles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 4.5 + 1.2,
            speedY: -(0.35 + Math.random() * 0.65),
            swaySpeed: 0.01 + Math.random() * 0.02,
            swayWidth: 3 + Math.random() * 10,
            swayPhase: Math.random() * Math.PI * 2,
            opacity: 0.15 + Math.random() * 0.45
          });
        }
      } else if (theme === 'technology') {
        binaryStreams = [];
        for (let i = 0; i < 45; i++) {
          binaryStreams.push({
            x: Math.random() * width,
            y: Math.random() * height,
            char: Math.random() > 0.5 ? '1' : '0',
            speedY: 0.25 + Math.random() * 0.65,
            opacity: 0.12 + Math.random() * 0.33,
            fontSize: 9 + Math.floor(Math.random() * 6)
          });
        }

        techTracks = [];
        const numTracks = 7;
        for (let i = 0; i < numTracks; i++) {
          const isHorizontal = i % 2 === 0;
          if (isHorizontal) {
            const y = (0.15 + 0.7 * (i / numTracks)) * height;
            techTracks.push({ x1: 0, y1: y, x2: width, y2: y });
          } else {
            const x = (0.15 + 0.7 * (i / numTracks)) * width;
            techTracks.push({ x1: x, y1: 0, x2: x, y2: height });
          }
        }

        techPackets = [];
        for (let i = 0; i < 14; i++) {
          techPackets.push({
            trackIdx: Math.floor(Math.random() * numTracks),
            progress: Math.random(),
            speed: 0.0012 + Math.random() * 0.0032,
            size: 3 + Math.random() * 3.5
          });
        }
      }
    };

    initObjects();

    const handleResize = () => {
      initObjects();
    };
    window.addEventListener('resize', handleResize);

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      if (theme === 'galaxy') {
        // Render background nebulas with soft radial gradients
        ctx.globalCompositeOperation = 'screen';
        nebulas.forEach((n, idx) => {
          const driftX = Math.sin(time * 0.0015 + idx) * 35;
          const driftY = Math.cos(time * 0.0012 + idx) * 20;
          const grad = ctx.createRadialGradient(
            n.x + driftX, n.y + driftY, 0,
            n.x + driftX, n.y + driftY, n.radius
          );
          grad.addColorStop(0, n.color1);
          grad.addColorStop(1, n.color2);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(n.x + driftX, n.y + driftY, n.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';

        // Twinkling stars
        stars.forEach(p => {
          const currentOpacity = Math.abs(Math.sin(p.phase + time * p.twinkleSpeed)) * p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentOpacity;
          ctx.fill();

          if (p.size > 2.0) {
            // Draw twinkle crosshair starburst effect
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x - p.size * 1.8, p.y);
            ctx.lineTo(p.x + p.size * 1.8, p.y);
            ctx.moveTo(p.x, p.y - p.size * 1.8);
            ctx.lineTo(p.x, p.y + p.size * 1.8);
            ctx.stroke();
          }
        });
        ctx.globalAlpha = 1.0;

        // Occasional shooting star
        if (!shootingStar.active && Math.random() < 0.006) {
          shootingStar.active = true;
          shootingStar.x = Math.random() * width;
          shootingStar.y = Math.random() * (height * 0.4);
          const angle = Math.PI / 6 + Math.random() * (Math.PI / 6);
          const speed = 7 + Math.random() * 11;
          shootingStar.dx = Math.cos(angle) * speed;
          shootingStar.dy = Math.sin(angle) * speed;
          shootingStar.length = 50 + Math.random() * 70;
          shootingStar.life = 0;
          shootingStar.maxLife = 15 + Math.random() * 15;
        }

        if (shootingStar.active) {
          shootingStar.life++;
          const alpha = 1 - (shootingStar.life / shootingStar.maxLife);
          if (alpha <= 0) {
            shootingStar.active = false;
          } else {
            const grad = ctx.createLinearGradient(
              shootingStar.x, shootingStar.y,
              shootingStar.x - shootingStar.dx * 1.3, shootingStar.y - shootingStar.dy * 1.3
            );
            grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.0;
            ctx.moveTo(shootingStar.x, shootingStar.y);
            ctx.lineTo(shootingStar.x - shootingStar.dx * 1.3, shootingStar.y - shootingStar.dy * 1.3);
            ctx.stroke();
            
            shootingStar.x += shootingStar.dx;
            shootingStar.y += shootingStar.dy;
          }
        }
      } else if (theme === 'ocean') {
        // Rotating/Swaying underwater caustic rays
        ctx.globalCompositeOperation = 'screen';
        rays.forEach(ray => {
          ray.angle += ray.speed;
          const currentAngle = ray.angle + Math.sin(time * 0.008) * 0.03;
          
          const grad = ctx.createLinearGradient(width / 2, 0, width / 2 + Math.sin(currentAngle) * height, height);
          grad.addColorStop(0, `rgba(34, 211, 238, ${ray.opacity})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.beginPath();
          ctx.moveTo(width / 2, -20);
          const endX1 = width / 2 + Math.sin(currentAngle - 0.08) * height * 1.5;
          const endX2 = width / 2 + Math.sin(currentAngle + 0.08) * height * 1.5;
          ctx.lineTo(endX1, height);
          ctx.lineTo(endX2, height);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';

        // Air bubbles rising
        bubbles.forEach(b => {
          b.y += b.speedY;
          b.swayPhase += b.swaySpeed;
          const currentX = b.x + Math.sin(b.swayPhase) * b.swayWidth;
          
          // Outer bubble rim
          ctx.beginPath();
          ctx.arc(currentX, b.y, b.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(165, 243, 252, ${b.opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          
          // Specular highlight dot
          ctx.beginPath();
          ctx.arc(currentX - b.size * 0.35, b.y - b.size * 0.35, b.size * 0.18, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.85})`;
          ctx.fill();
          
          if (b.y < -b.size * 2) {
            b.y = height + b.size * 2;
            b.x = Math.random() * width;
          }
        });
      } else if (theme === 'technology') {
        // Digital network track pathways
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
        ctx.lineWidth = 1;
        techTracks.forEach(t => {
          ctx.beginPath();
          ctx.moveTo(t.x1, t.y1);
          ctx.lineTo(t.x2, t.y2);
          ctx.stroke();
        });

        // Moving data packets
        techPackets.forEach(p => {
          p.progress += p.speed;
          if (p.progress > 1) {
            p.progress = 0;
            p.trackIdx = Math.floor(Math.random() * techTracks.length);
            p.speed = 0.0012 + Math.random() * 0.0032;
          }
          
          const track = techTracks[p.trackIdx];
          if (track) {
            const currentX = track.x1 + (track.x2 - track.x1) * p.progress;
            const currentY = track.y1 + (track.y2 - track.y1) * p.progress;
            
            ctx.fillStyle = 'rgba(34, 211, 238, 0.65)';
            ctx.fillRect(currentX - p.size / 2, currentY - p.size / 2, p.size, p.size);
          }
        });

        // Vertical binary code matrix streams
        binaryStreams.forEach(s => {
          ctx.font = `bold ${s.fontSize}px 'Courier New', Courier, monospace`;
          ctx.fillStyle = `rgba(34, 211, 238, ${s.opacity})`;
          ctx.fillText(s.char, s.x, s.y);
          
          s.y += s.speedY;
          if (Math.random() < 0.015) {
            s.char = Math.random() > 0.5 ? '1' : '0';
          }
          
          if (s.y > height + 20) {
            s.y = -20;
            s.x = Math.random() * width;
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-1" />;
};

// ----------------------------------------------------
// GALAXY LAYOUT COMPONENT
// ----------------------------------------------------
interface GalaxyLayoutProps {
  paintings: PaintingData[];
  selectedPainting: PaintingData | null;
  onSelectPainting: (p: PaintingData | null) => void;
}

const GalaxyLayout = ({ paintings, selectedPainting, onSelectPainting }: GalaxyLayoutProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Screen positions for HTML image overlays (updated every frame via ref, synced to state every ~100ms)
  const screenPosRef = useRef<Array<{ x: number; y: number; visible: boolean }>>([]);
  const [screenPositions, setScreenPositions] = useState<Array<{ x: number; y: number; visible: boolean }>>([]);
  const lastSyncTime = useRef(0);

  // Rotation & drag state
  const rotationAngle = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const velocityX = useRef(0);
  const autoRotateSpeed = useRef(0.0003);

  // Zoom/pan camera
  const camX = useRef(0);
  const camY = useRef(0);
  const targetCamX = useRef(0);
  const targetCamY = useRef(0);
  const zoom = useRef(1);
  const targetZoom = useRef(1);

  // Hovering painting index
  const hoveredIdx = useRef<number>(-1);

  // Selected painting ref (để dùng trong animate closure)
  const selectedRef = useRef<PaintingData | null>(null);
  useEffect(() => {
    selectedRef.current = selectedPainting;
  }, [selectedPainting]);

  // Paintings ref
  const paintingsRef = useRef<PaintingData[]>(paintings);
  useEffect(() => {
    paintingsRef.current = paintings;
  }, [paintings]);

  // Callback ref
  const onSelectRef = useRef(onSelectPainting);
  useEffect(() => { onSelectRef.current = onSelectPainting; }, [onSelectPainting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;

    // ---- Generate galaxy star field ----
    interface GalaxyStar {
      r: number;       // distance from center
      theta: number;   // angle
      size: number;
      color: string;
      twinkle: number;
      phase: number;
      arm: number;
    }

    const STAR_COUNT = 6000;
    const ARM_COUNT = 2;
    const stars: GalaxyStar[] = [];

    const starColors = [
      'rgba(255,255,255,',
      'rgba(196,181,253,',  // violet
      'rgba(165,180,252,',  // indigo
      'rgba(251,207,232,',  // pink
      'rgba(253,244,170,',  // yellow
      'rgba(167,243,208,',  // green
      'rgba(186,230,253,',  // sky
    ];

    const generateStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        const arm = Math.floor(Math.random() * ARM_COUNT);
        // logarithmic spiral: r = a * e^(b*theta)
        const r = 40 + Math.pow(Math.random(), 0.6) * 340;
        const armAngle = (arm / ARM_COUNT) * Math.PI * 2;
        // spread stars along spiral
        const spiralOffset = (r / 340) * Math.PI * 2.5;
        const scatter = (Math.random() - 0.5) * (30 + r * 0.25);
        const theta = armAngle + spiralOffset + scatter * 0.05;

        const x = Math.cos(theta) * r + (Math.random() - 0.5) * scatter;
        const y = Math.sin(theta) * r * 0.45 + (Math.random() - 0.5) * scatter * 0.45;
        const computedR = Math.sqrt(x * x + y * y / (0.45 * 0.45));

        // near center: denser & brighter
        const centralBoost = Math.max(0, 1 - computedR / 120);
        const sz = (Math.random() < 0.05 + centralBoost * 0.2)
          ? 1.2 + Math.random() * 1.8
          : 0.3 + Math.random() * 0.9;

        stars.push({
          r: computedR,
          theta: Math.atan2(y * (1 / 0.45), x),
          size: sz,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkle: 0.008 + Math.random() * 0.025,
          phase: Math.random() * Math.PI * 2,
          arm,
        });
      }
    };

    generateStars();

    // Painting star positions (spread across galaxy)
    interface PaintingStar {
      r: number;
      theta: number;
      x: number; // computed canvas x
      y: number; // computed canvas y
    }
    const paintingPositions: PaintingStar[] = [];

    const assignPaintingPositions = () => {
      paintingPositions.length = 0;
      const count = paintingsRef.current.length;
      for (let i = 0; i < count; i++) {
        const ratio = (i + 0.5) / count;
        const r = 80 + ratio * 240;
        const armAngle = ((i % ARM_COUNT) / ARM_COUNT) * Math.PI * 2;
        const spiralOffset = (r / 340) * Math.PI * 2.5;
        const theta = armAngle + spiralOffset + (i * 1.3);
        paintingPositions.push({ r, theta, x: 0, y: 0 });
      }
    };

    assignPaintingPositions();

    const resize = () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);
      time++;

      // Inertia
      if (!isDragging.current) {
        rotationAngle.current += velocityX.current + autoRotateSpeed.current;
        velocityX.current *= 0.96;
      }

      // Smooth camera pan & zoom
      camX.current += (targetCamX.current - camX.current) * 0.08;
      camY.current += (targetCamY.current - camY.current) * 0.08;
      zoom.current += (targetZoom.current - zoom.current) * 0.06;

      const cx = width / 2 + camX.current;
      const cy = height / 2 + camY.current;
      const z = zoom.current;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(z, z);

      // ---- Draw galaxy glow core ----
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 90);
      coreGrad.addColorStop(0, 'rgba(255, 220, 180, 0.22)');
      coreGrad.addColorStop(0.3, 'rgba(196, 140, 255, 0.12)');
      coreGrad.addColorStop(0.7, 'rgba(80, 50, 180, 0.05)');
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 90, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer halo glow
      const haloGrad = ctx.createRadialGradient(0, 0, 80, 0, 0, 360);
      haloGrad.addColorStop(0, 'rgba(120, 80, 220, 0.07)');
      haloGrad.addColorStop(0.5, 'rgba(60, 40, 180, 0.04)');
      haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 360, 160, 0, 0, Math.PI * 2);
      ctx.fill();

      // ---- Draw stars ----
      const rot = rotationAngle.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const t = s.theta + rot;
        const sx = Math.cos(t) * s.r;
        const sy = Math.sin(t) * s.r * 0.45;

        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(s.phase + time * s.twinkle));
        const opacity = brightness * (0.5 + 0.5 * (1 - Math.min(s.r / 380, 1)));

        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${opacity.toFixed(2)})`;
        ctx.fill();

        // Larger stars get a cross sparkle
        if (s.size > 1.5) {
          const sl = s.size * 2.5;
          ctx.strokeStyle = `${s.color}${(opacity * 0.5).toFixed(2)})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(sx - sl, sy); ctx.lineTo(sx + sl, sy);
          ctx.moveTo(sx, sy - sl); ctx.lineTo(sx, sy + sl);
          ctx.stroke();
        }
      }

      // ---- Draw painting stars ----
      const currentPaintings = paintingsRef.current;
      // Ensure screenPosRef has correct length
      if (screenPosRef.current.length !== currentPaintings.length) {
        screenPosRef.current = currentPaintings.map(() => ({ x: 0, y: 0, visible: false }));
      }
      for (let i = 0; i < paintingPositions.length; i++) {
        const pp = paintingPositions[i];
        const t = pp.theta + rot;
        const px = Math.cos(t) * pp.r;
        const py = Math.sin(t) * pp.r * 0.45;

        // Store screen coords for hit-testing (in galaxy-space)
        paintingPositions[i].x = px;
        paintingPositions[i].y = py;

        // Compute true screen coords (canvas pixel)
        const screenX = cx + px * z;
        const screenY = cy + py * z;
        const inView = screenX > -80 && screenX < width + 80 && screenY > -80 && screenY < height + 80;
        if (screenPosRef.current[i]) {
          screenPosRef.current[i] = { x: screenX, y: screenY, visible: inView };
        }

        const isSelected = selectedRef.current?.id === currentPaintings[i]?.id;
        const isHovered = hoveredIdx.current === i;

        const pulse = 0.7 + 0.3 * Math.sin(time * 0.04 + i * 1.1);

        if (isSelected || isHovered) {
          // Glow ring
          const glow = ctx.createRadialGradient(px, py, 0, px, py, isSelected ? 38 : 28);
          glow.addColorStop(0, isSelected ? 'rgba(100,220,255,0.35)' : 'rgba(180,140,255,0.25)');
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 38 : 28, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bright star orb
        const orbR = isSelected ? 10 : isHovered ? 8 : 5 + pulse * 1.5;
        const orbGrad = ctx.createRadialGradient(px, py, 0, px, py, orbR);
        if (isSelected) {
          orbGrad.addColorStop(0, 'rgba(255,255,255,1)');
          orbGrad.addColorStop(0.4, 'rgba(100,220,255,0.9)');
          orbGrad.addColorStop(1, 'rgba(60,120,255,0)');
        } else if (isHovered) {
          orbGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
          orbGrad.addColorStop(0.5, 'rgba(200,150,255,0.7)');
          orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
        } else {
          orbGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
          orbGrad.addColorStop(0.4, 'rgba(220,180,255,0.6)');
          orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
        }
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(px, py, orbR, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair sparkle
        const sl = orbR * 3;
        const alpha = isSelected ? 0.8 : isHovered ? 0.6 : 0.35 * pulse;
        ctx.strokeStyle = isSelected ? `rgba(100,220,255,${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = isSelected ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(px - sl, py); ctx.lineTo(px + sl, py);
        ctx.moveTo(px, py - sl); ctx.lineTo(px, py + sl);
        ctx.stroke();

        // Label above star
        if (isSelected || isHovered) {
          const title = currentPaintings[i]?.title ?? '';
          const labelY = py - orbR - 14;
          ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '9px Inter, sans-serif';
          ctx.textAlign = 'center';
          const metrics = ctx.measureText(title);
          const pad = 5;
          ctx.fillStyle = isSelected ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)';
          ctx.beginPath();
          ctx.roundRect(px - metrics.width / 2 - pad, labelY - 11, metrics.width + pad * 2, 14, 4);
          ctx.fill();
          ctx.fillStyle = isSelected ? '#67e8f9' : '#e2e8f0';
          ctx.fillText(title, px, labelY);
        }
      }

      ctx.restore();

      // Sync screen positions to React state every ~100ms for HTML overlays
      const now = performance.now();
      if (now - lastSyncTime.current > 80) {
        lastSyncTime.current = now;
        setScreenPositions([...screenPosRef.current]);
      }
    };

    animate();

    // ---- Pointer events ----
    const getCanvasPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - width / 2 - camX.current) / zoom.current,
        y: (e.clientY - rect.top - height / 2 - camY.current) / zoom.current,
      };
    };

    const hitTestPainting = (cx: number, cy: number): number => {
      let closest = -1;
      let minDist = 30 / zoom.current;
      for (let i = 0; i < paintingPositions.length; i++) {
        const pp = paintingPositions[i];
        const dx = cx - pp.x;
        const dy = cy - pp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      return closest;
    };

    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      isDragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      velocityX.current = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging.current) {
        const dx = e.clientX - lastX.current;
        rotationAngle.current += dx * 0.004;
        velocityX.current = dx * 0.004;
        lastX.current = e.clientX;
        lastY.current = e.clientY;
        canvas.style.cursor = 'grabbing';
      } else {
        // hover detection
        const { x, y } = getCanvasPos(e);
        const idx = hitTestPainting(x, y);
        hoveredIdx.current = idx;
        canvas.style.cursor = idx >= 0 ? 'pointer' : 'grab';
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      canvas.style.cursor = 'grab';

      // Click threshold: if barely moved, treat as click
      const dx = e.clientX - lastX.current;
      if (Math.abs(dx) < 5) {
        const { x, y } = getCanvasPos(e);
        const idx = hitTestPainting(x, y);
        if (idx >= 0) {
          const painting = paintingsRef.current[idx];
          if (painting) {
            if (selectedRef.current?.id === painting.id) {
              // Deselect
              onSelectRef.current(null);
              targetCamX.current = 0;
              targetCamY.current = 0;
              targetZoom.current = 1;
            } else {
              onSelectRef.current(painting);
              // Pan camera to center on this star
              const pp = paintingPositions[idx];
              targetCamX.current = -pp.x * zoom.current;
              targetCamY.current = -pp.y * 0.45 * zoom.current * 0.45;
              targetZoom.current = 1.6;
            }
          }
        } else {
          // Click on empty space — deselect
          onSelectRef.current(null);
          targetCamX.current = 0;
          targetCamY.current = 0;
          targetZoom.current = 1;
        }
      }
    };

    const onPointerLeave = () => {
      isDragging.current = false;
      hoveredIdx.current = -1;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  // When selectedPainting changes externally (e.g. list click), re-center camera
  useEffect(() => {
    if (!selectedPainting) {
      targetCamX.current = 0;
      targetCamY.current = 0;
      targetZoom.current = 1;
    }
  }, [selectedPainting]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: 'grab', touchAction: 'none' }}
      />

      {/* HTML Image Overlays — floating thumbnails on each painting star */}
      {screenPositions.map((sp, i) => {
        if (!sp.visible || !paintings[i]) return null;
        const p = paintings[i];
        const isSelected = selectedPainting?.id === p.id;
        const thumbSize = isSelected ? 100 : 56;
        return (
          <div
            key={p.id}
            onClick={() => {
              if (isSelected) {
                onSelectPainting(null);
                targetCamX.current = 0;
                targetCamY.current = 0;
                targetZoom.current = 1;
              } else {
                onSelectPainting(p);
                const ppIdx = i;
                targetCamX.current = -(screenPositions[ppIdx]?.x ?? 0) * zoom.current;
                targetCamY.current = -(screenPositions[ppIdx]?.y ?? 0) * zoom.current;
                targetZoom.current = 1.6;
              }
            }}
            style={{
              position: 'absolute',
              left: sp.x - thumbSize / 2,
              top: sp.y - thumbSize - 14,
              width: thumbSize,
              height: thumbSize,
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              zIndex: isSelected ? 20 : 10,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: isSelected ? '14px' : '10px',
                overflow: 'hidden',
                border: isSelected
                  ? '2.5px solid rgba(100,220,255,0.9)'
                  : '2px solid rgba(180,140,255,0.55)',
                boxShadow: isSelected
                  ? '0 0 24px 8px rgba(80,200,255,0.4), 0 0 60px 20px rgba(80,180,255,0.15)'
                  : '0 0 12px 4px rgba(160,120,255,0.3)',
                background: '#0a0a18',
              }}
            >
              <img
                src={p.url}
                alt={p.title}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
            {/* Connector line from image to star dot */}
            <div style={{
              position: 'absolute',
              bottom: -13,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 1.5,
              height: 12,
              background: isSelected
                ? 'linear-gradient(to bottom, rgba(100,220,255,0.7), rgba(100,220,255,0))'
                : 'linear-gradient(to bottom, rgba(180,140,255,0.5), rgba(180,140,255,0))',
            }} />
          </div>
        );
      })}

      {/* Mini legend */}
      <div className="absolute bottom-14 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-violet-800/40">
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_2px_rgba(200,180,255,0.8)]" />
        <span className="text-[9px] font-bold text-violet-300 uppercase tracking-wider">Click ngôi sao để xem tranh</span>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// MAIN PHONG TRANH PANORAMA COMPONENT
// ----------------------------------------------------
export default function PhongTranhPanorama({ onBack }: { onBack: () => void }) {
  const [paintings, setPaintings] = useState<PaintingData[]>([]);
  const [activeLayout, setActiveLayout] = useState<'cylinder' | 'hallway' | 'cube' | 'galaxy'>('cube');
  const [activeTheme, setActiveTheme] = useState<GalleryTheme>('museum');
  
  const [selectedPainting, setSelectedPainting] = useState<PaintingData | null>(null);
  const [editingPainting, setEditingPainting] = useState<PaintingData | null>(null);
  
  const [autoTour, setAutoTour] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'manage'>('gallery');
  
  const synthRef = useRef<AmbientSynth | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Drag states
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);
  const rotationY = useRef(0);
  const targetRotation = useRef(0);

  // Initialize samples if empty
  useEffect(() => {
    if (paintings.length === 0) {
      setPaintings(DEFAULT_PAINTINGS);
    }
  }, [paintings]);

  // Audio lifecycle
  useEffect(() => {
    if (musicOn) {
      if (!synthRef.current) {
        synthRef.current = new AmbientSynth();
      }
      synthRef.current.start();
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, [musicOn]);

  // Pointer drag controls (works on both touch and mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startRotation.current = rotationY.current;
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !ringRef.current) return;
    const dx = e.clientX - startX.current;
    const sensitivity = 0.35;
    targetRotation.current = startRotation.current - dx * sensitivity;
    
    gsap.to(ringRef.current, {
      rotationY: targetRotation.current,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        if (ringRef.current) {
          rotationY.current = gsap.getProperty(ringRef.current, "rotationY") as number;
        }
      }
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.cursor = 'grab';
    }
  };

  const handleCardClick = (painting: PaintingData, cardAngle: number) => {
    setSelectedPainting(painting);
    
    // Nearest shortest path rotation math
    const currentRot = rotationY.current;
    const diff = ((-cardAngle - currentRot) % 360);
    const shortestDiff = ((diff + 540) % 360) - 180;
    const newTarget = currentRot + shortestDiff;
    targetRotation.current = newTarget;

    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotationY: newTarget,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => {
          if (ringRef.current) {
            rotationY.current = gsap.getProperty(ringRef.current, "rotationY") as number;
          }
        }
      });
    }
  };

  // Chuyển tranh bằng mũi tên điều hướng
  const goToPaintingByIndex = (idx: number) => {
    if (paintings.length === 0) return;
    const targetIdx = ((idx % paintings.length) + paintings.length) % paintings.length;
    const targetP = paintings[targetIdx];
    const { focusAngle } = getCardPlacement(activeLayout, targetIdx, paintings.length);
    handleCardClick(targetP, focusAngle);
  };

  const handlePrevPainting = () => {
    const curIdx = paintings.findIndex(p => p.id === selectedPainting?.id);
    goToPaintingByIndex(curIdx <= 0 ? paintings.length - 1 : curIdx - 1);
  };

  const handleNextPainting = () => {
    const curIdx = paintings.findIndex(p => p.id === selectedPainting?.id);
    goToPaintingByIndex(curIdx === -1 ? 0 : curIdx + 1);
  };

  // Auto Tour lifecycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoTour && paintings.length > 0) {
      let currentIndex = paintings.findIndex(p => p.id === selectedPainting?.id);
      if (currentIndex === -1) currentIndex = 0;

      interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % paintings.length;
        const nextPainting = paintings[nextIndex];
        const cardAngle = getCardPlacement(activeLayout, nextIndex, paintings.length).focusAngle;

        setSelectedPainting(nextPainting);
        
        const currentRot = rotationY.current;
        const diff = ((-cardAngle - currentRot) % 360);
        const shortestDiff = ((diff + 540) % 360) - 180;
        const newTarget = currentRot + shortestDiff;
        targetRotation.current = newTarget;

        if (ringRef.current) {
          gsap.to(ringRef.current, {
            rotationY: newTarget,
            duration: 0.9,
            ease: 'power3.out',
            overwrite: 'auto',
            onUpdate: () => {
              if (ringRef.current) {
                rotationY.current = gsap.getProperty(ringRef.current, "rotationY") as number;
              }
            }
          });
        }

        currentIndex = nextIndex;
      }, 5500);
    }
    return () => clearInterval(interval);
  }, [autoTour, paintings, selectedPainting, activeLayout]);

  // Đổi bố cục phòng -> đưa góc nhìn về chính diện
  useEffect(() => {
    rotationY.current = 0;
    targetRotation.current = 0;
    if (ringRef.current) {
      gsap.set(ringRef.current, { rotationY: 0 });
    }
  }, [activeLayout]);

  // Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUploaded: PaintingData[] = [];
    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file);
      newUploaded.push({
        id: `uploaded-${Date.now()}-${index}`,
        url: url,
        title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        author: 'Tác giả học sinh',
        desc: 'Hình ảnh được tải lên từ thiết bị trưng bày trong phòng triển lãm ảo.'
      });
    });

    setPaintings(prev => [...prev, ...newUploaded]);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.85 }
    });
  };

  // Delete Painting
  const handleDeletePainting = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPainting?.id === id) {
      setSelectedPainting(null);
    }
    setPaintings(prev => prev.filter(p => p.id !== id));
  };

  // Edit Save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPainting) return;

    setPaintings(prev => prev.map(p => p.id === editingPainting.id ? editingPainting : p));
    if (selectedPainting?.id === editingPainting.id) {
      setSelectedPainting(editingPainting);
    }
    setEditingPainting(null);

    confetti({
      particleCount: 30,
      spread: 20,
      colors: ['#06b6d4', '#6366f1']
    });
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`w-full flex flex-col bg-slate-950 font-sans text-slate-100 overflow-hidden select-none transition-all ${
        isFullscreen ? 'h-screen' : 'h-[calc(100vh-80px)] rounded-3xl border border-slate-800 shadow-2xl'
      }`}
    >
      {/* 1. HEADER CONTROLS */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button 
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-sm md:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              Phòng Tranh Triển Lãm 3D
            </h1>
            <p className="text-[9px] md:text-[10px] text-cyan-400 font-bold uppercase tracking-widest leading-none mt-1">
              Góc trưng bày tác phẩm của học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-sans z-50">
          {/* Quick upload in header */}
          <label className="p-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 px-3 cursor-pointer shadow-lg shadow-emerald-950/20 transition-all">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tải ảnh lên</span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
          </label>

          {/* Toggle View Mode */}
          <button
            onClick={() => setViewMode(prev => prev === 'gallery' ? 'manage' : 'gallery')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 px-3.5 ${
              viewMode === 'manage' 
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white shadow-lg shadow-cyan-950/20' 
                : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={viewMode === 'manage' ? "Quay lại xem triển lãm" : "Quản lý tác phẩm & Tải ảnh"}
          >
            {viewMode === 'manage' ? (
              <>
                <Eye className="w-4 h-4 text-emerald-450" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Xem Triển Lãm</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Quản lý tác phẩm</span>
              </>
            )}
          </button>

          {/* Audio */}
          <button
            onClick={() => setMusicOn(!musicOn)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              musicOn 
                ? 'bg-linear-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-lg shadow-emerald-950/20' 
                : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={musicOn ? "Tắt nhạc nền" : "Bật nhạc nền"}
          >
            {musicOn ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Tour */}
          <button
            onClick={() => setAutoTour(!autoTour)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 px-3 ${
              autoTour 
                ? 'bg-linear-to-r from-violet-500 to-indigo-500 border-violet-400 text-white shadow-lg' 
                : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={autoTour ? "Dừng tự động" : "Tự động trình chiếu (Auto Tour)"}
          >
            {autoTour ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Dừng Tour</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Auto Tour</span>
              </>
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center justify-center"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDE PANEL */}
        {viewMode === 'manage' && (
          <aside className="w-full md:w-87.5 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-900/95 flex flex-col shrink-0 overflow-y-auto max-h-80 md:max-h-none z-20 custom-scrollbar shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-5 space-y-6">
            
            {/* LAYOUT OPTION */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Cấu hình phòng triển lãm
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl shadow-inner">
                <button
                  onClick={() => {
                    setActiveLayout('cube');
                    setSelectedPainting(null);
                  }}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeLayout === 'cube' 
                      ? 'bg-slate-800 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Phòng vuông
                </button>
                <button
                  onClick={() => {
                    setActiveLayout('hallway');
                    setSelectedPainting(null);
                  }}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeLayout === 'hallway' 
                      ? 'bg-slate-800 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bức tường
                </button>
                <button
                  onClick={() => {
                    setActiveLayout('cylinder');
                    setSelectedPainting(null);
                  }}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeLayout === 'cylinder' 
                      ? 'bg-slate-800 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Vòng tròn
                </button>
                <button
                  onClick={() => {
                    setActiveLayout('galaxy');
                    setSelectedPainting(null);
                  }}
                  className={`py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeLayout === 'galaxy' 
                      ? 'bg-linear-to-r from-violet-800/60 to-indigo-800/60 text-violet-200 border border-violet-500/50 shadow-md shadow-violet-950/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✦ Thiên hà
                </button>
              </div>
            </div>

            {/* SPACE THEMES */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" /> Chủ đề không gian
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl shadow-inner">
                <button
                  onClick={() => setActiveTheme('museum')}
                  className={`py-2 px-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeTheme === 'museum' 
                      ? 'bg-linear-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-400/50 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🏛️ Bảo tàng trắng
                </button>
                <button
                  onClick={() => setActiveTheme('technology')}
                  className={`py-2 px-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeTheme === 'technology' 
                      ? 'bg-linear-to-r from-cyan-600/30 to-cyan-700/30 text-cyan-300 border border-cyan-500/40 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚡ Công nghệ
                </button>
                <button
                  onClick={() => setActiveTheme('galaxy')}
                  className={`py-2 px-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeTheme === 'galaxy' 
                      ? 'bg-linear-to-r from-indigo-600/30 to-indigo-700/30 text-indigo-300 border border-indigo-500/40 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✨ Vũ trụ
                </button>
                <button
                  onClick={() => setActiveTheme('ocean')}
                  className={`py-2 px-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    activeTheme === 'ocean' 
                      ? 'bg-linear-to-r from-blue-600/30 to-blue-700/30 text-blue-300 border border-blue-500/40 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🌊 Đại dương
                </button>
              </div>
            </div>

            {/* UPLOAD FORM */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> Tải lên tác phẩm
              </label>
              
              <label className="w-full h-24 border-2 border-dashed border-slate-700/85 hover:border-cyan-500/60 rounded-2xl flex flex-col items-center justify-center p-4 bg-slate-950/40 hover:bg-slate-950/80 transition-all cursor-pointer group">
                <ImageIcon className="w-7 h-7 text-slate-500 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
                <span className="text-[10px] font-bold text-slate-400 mt-2 group-hover:text-slate-200">Chọn ảnh từ máy thiết bị</span>
                <span className="text-[8px] text-slate-600 mt-0.5">JPEG, PNG, WEBP</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
            </div>

            {/* LIST OF PAINTINGS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Tác phẩm hiển thị ({paintings.length})
                </label>
                {paintings.length > DEFAULT_PAINTINGS.length && (
                  <button 
                    onClick={() => {
                      setPaintings(DEFAULT_PAINTINGS);
                      setSelectedPainting(null);
                    }}
                    className="text-[9px] font-bold text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    Khôi phục gốc
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {paintings.map((p) => {
                  const isSelected = selectedPainting?.id === p.id;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => {
                        if (activeLayout === 'galaxy') {
                          setSelectedPainting(p);
                        } else {
                          const idx = paintings.findIndex(x => x.id === p.id);
                          handleCardClick(p, getCardPlacement(activeLayout, idx, paintings.length).focusAngle);
                        }
                      }}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
                        isSelected 
                          ? 'bg-slate-800/80 border-cyan-500 shadow-md shadow-cyan-950/20' 
                          : 'bg-slate-950/50 hover:bg-slate-950/90 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img 
                          src={p.url} 
                          alt={p.title} 
                          className="w-9 h-9 rounded-lg object-cover bg-slate-800 border border-slate-700/50 shrink-0" 
                        />
                        <div className="min-w-0 text-left">
                          <h4 className="text-[11.5px] font-extrabold text-white truncate">{p.title}</h4>
                          <p className="text-[9px] text-slate-400 font-bold truncate">{p.author}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPainting(p);
                          }}
                          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-cyan-400 transition-colors"
                          title="Sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePainting(p.id, e)}
                          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>
      )}

        {/* RIGHT 3D CANVAS REPLACEMENT (GSAP 3D STAGE) */}
        <main 
          className={`flex-1 h-full relative overflow-hidden transition-all duration-500 ${
            activeLayout === 'galaxy'
              ? 'bg-[#000005]'
              : activeTheme === 'technology' 
              ? 'bg-[#020617]' 
              : activeTheme === 'galaxy'
              ? 'bg-radial from-slate-950 via-[#030616] to-[#010208]'
              : 'bg-radial from-[#092e42] via-[#041a29] to-[#010912]'
          }`}
        >
          {/* Space Raylights overlay for Ocean theme */}
          {activeTheme === 'ocean' && (
            <div className="absolute inset-0 bg-linear-to-b from-cyan-400/5 via-transparent to-transparent pointer-events-none z-1" />
          )}

          {/* Perspective grid floor overlay for technology theme */}
          {activeTheme === 'technology' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] origin-bottom opacity-15"
                style={{
                  transform: 'perspective(500px) rotateX(75deg)',
                  backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                }}
              />
            </div>
          )}

          {/* Perspective grid floor overlay for galaxy theme */}
          {activeTheme === 'galaxy' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] origin-bottom opacity-10"
                style={{
                  transform: 'perspective(500px) rotateX(75deg)',
                  backgroundImage: 'linear-gradient(to right, #818cf8 1px, transparent 1px), linear-gradient(to bottom, #818cf8 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                }}
              />
            </div>
          )}

          {/* Interactive particles background */}
          <ParticleCanvas theme={activeTheme} />

          {/* Top layout HUD label */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left pointer-events-none shadow-lg">
            <span className="text-[9px] text-cyan-400 font-black uppercase tracking-wider block">Góc triển lãm</span>
            <span className="text-xs font-black text-white uppercase">
              {activeLayout === 'cylinder' ? 'Phòng Tròn 3D' : activeLayout === 'hallway' ? 'Bức Tường Nghệ Thuật' : activeLayout === 'cube' ? 'Phòng Triển Lãm' : '✦ Thiên Hà Galaxy'}
            </span>
          </div>

          {/* Toggle View Mode Button in Viewport */}
          <button
            onClick={() => setViewMode(prev => prev === 'gallery' ? 'manage' : 'gallery')}
            className="absolute top-4 right-4 z-20 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-black uppercase tracking-wide text-cyan-450 hover:text-cyan-350 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {viewMode === 'manage' ? (
              <>
                <Eye className="w-4 h-4 text-emerald-400" />
                Xem triển lãm 3D
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-cyan-400 animate-bounce" style={{ animationDuration: '3s' }} />
                Quản lý tác phẩm
              </>
            )}
          </button>

          {/* Top HUD guidance */}
          <div className="absolute top-16 left-4 z-10 px-3.5 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-center md:justify-start gap-1.5 pointer-events-none shadow-lg max-w-lg">
            <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-medium text-[9.5px]">Kéo/quẹt màn hình để xoay phòng 360° • Click chọn tranh để xem cận cảnh chi tiết</span>
          </div>

          {/* 3D VIEWPORT CONTAINER (hidden when galaxy layout) */}
          {activeLayout !== 'galaxy' && (
          <div 
            className="relative z-2 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: isRoomLayout(activeLayout) ? `${ROOM_PERSPECTIVE}px` : '1600px', touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Camera rig: với chế độ phòng, đặt người xem đứng bên trong phòng */}
            <div
              style={{
                transformStyle: 'preserve-3d',
                transform: isRoomLayout(activeLayout)
                  ? `translateZ(${ROOM_PERSPECTIVE - ROOM_CAMERA_BACK}px)`
                  : 'none',
              }}
            >
            {/* The revolving 3D Ring */}
            <div
              ref={ringRef}
              className="relative flex items-center justify-center"
              style={{
                width: '250px',
                height: '350px',
                transformStyle: 'preserve-3d',
                transform: `rotateX(0deg) rotateY(0deg)`,
                willChange: 'transform',
              }}
            >
              {/* Tường, sàn, trần của phòng triển lãm */}
              {isRoomLayout(activeLayout) && (
                <RoomShell 
                  layout={activeLayout} 
                  theme={activeTheme} 
                  count={paintings.length}
                  paintings={paintings}
                  onCardClick={handleCardClick}
                />
              )}

              {paintings.map((p, idx) => {
                const isSelected = selectedPainting?.id === p.id;
                const { focusAngle: angle, transform } = getCardPlacement(activeLayout, idx, paintings.length);
                const inRoom = isRoomLayout(activeLayout);
                const spot = ROOM_THEMES[activeTheme].spot;
                const isMuseum = activeTheme === 'museum';

                return (
                  <div
                    key={p.id}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform,
                      backfaceVisibility: 'hidden',
                      willChange: 'transform',
                    }}
                  >
                    {inRoom && (
                      <>
                        {/* Quầng sáng đèn rọi tranh hắt lên tường */}
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            left: -110, right: -110, top: -100, bottom: -80,
                            transform: 'translateZ(-4px)',
                            background: isMuseum
                              ? `radial-gradient(ellipse 65% 80% at 50% -10%, ${spot}, transparent 80%)`
                              : `radial-gradient(ellipse 60% 75% at 50% 0%, ${spot}, transparent 75%)`,
                          }}
                        />
                        {/* Đèn rọi tranh bảo tàng kim loại sang trọng */}
                        <div
                          className="absolute pointer-events-none rounded-md"
                          style={{
                            left: '50%', top: -38, width: 140, height: 12, marginLeft: -70,
                            background: isMuseum 
                              ? 'linear-gradient(180deg, #d4d4d8 0%, #71717a 100%)' 
                              : 'linear-gradient(180deg, #64748b, #1e293b)',
                            boxShadow: isMuseum 
                              ? `0 10px 30px 8px ${spot}` 
                              : `0 8px 26px 6px ${spot}`,
                            transform: 'translateZ(18px)',
                            border: isMuseum ? '1px solid #e4e4e7' : 'none',
                          }}
                        >
                          {/* Chân gắn đèn rọi */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-2 h-3 bg-zinc-600" />
                        </div>
                      </>
                    )}
                    {/* Inner 3D card slot to isolate hovers */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(p, angle);
                      }}
                      className={`dropdown-item w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden relative select-none group/card cursor-pointer transition-all duration-300 ${
                        isMuseum
                          ? isSelected
                            ? 'border-4 border-amber-500 bg-white ring-4 ring-amber-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.35)] scale-103'
                            : 'border-8 border-[#18181b] bg-white hover:border-amber-700/80 hover:scale-104 shadow-[0_20px_45px_rgba(0,0,0,0.22)]'
                          : isSelected 
                            ? 'border-3 border-cyan-400 bg-slate-900 scale-102 ring-4 ring-cyan-500/20 shadow-2xl' 
                            : 'border-3 border-slate-800 hover:border-cyan-400/50 hover:scale-105 bg-slate-950/90 shadow-2xl'
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                        willChange: 'transform',
                      }}
                    >
                      {/* Image frame với viền bo lụa passe-partout kiểu bảo tàng */}
                      <div className={`w-full flex-1 overflow-hidden relative ${isMuseum ? 'p-2 bg-[#ffffff]' : 'bg-slate-900'}`}>
                        <div className="w-full h-full overflow-hidden relative rounded-xs">
                          <img
                            src={p.url}
                            alt={p.title}
                            className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover/card:scale-106"
                            onError={(e) => {
                              const imgNode = e.currentTarget;
                              imgNode.style.display = 'none';
                              const fallback = imgNode.nextElementSibling as HTMLDivElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          {/* Fallback frame UI */}
                          <div 
                            className="absolute inset-0 hidden flex-col items-center justify-center p-4 bg-slate-100 text-center"
                            style={{ display: 'none' }}
                          >
                            <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-[10px] font-bold text-slate-600">{p.title}</span>
                          </div>
                          
                          {/* Subtle spotlight reflection overlay */}
                          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/8 to-transparent pointer-events-none" />
                        </div>
                      </div>

                      {/* Header/Bottom info tab (Biển đồng kim loại bảo tàng) */}
                      <div className={`p-2.5 text-center transition-colors ${
                        isMuseum
                          ? 'bg-linear-to-b from-[#27272a] to-[#18181b] border-t-2 border-amber-600/50'
                          : 'bg-slate-900 border-t border-slate-800 text-left'
                      }`}>
                        <h4 className={`text-xs font-black truncate ${isMuseum ? 'text-amber-100 font-serif' : 'text-white'}`}>
                          {p.title}
                        </h4>
                        <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 truncate flex items-center justify-center gap-1 ${
                          isMuseum ? 'text-amber-400/90' : 'text-cyan-400'
                        }`}>
                          <User className="w-2.5 h-2.5" /> {p.author}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>

            {/* Nút mũi tên lớn bên trái */}
            <button
              onClick={handlePrevPainting}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-700/80 text-white hover:text-amber-400 flex items-center justify-center shadow-2xl backdrop-blur transition-all hover:scale-110 active:scale-95 cursor-pointer group"
              title="Ngắm bức tranh / vách trước (←)"
            >
              <ChevronLeft className="w-7 h-7 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* Nút mũi tên lớn bên phải */}
            <button
              onClick={handleNextPainting}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-700/80 text-white hover:text-amber-400 flex items-center justify-center shadow-2xl backdrop-blur transition-all hover:scale-110 active:scale-95 cursor-pointer group"
              title="Ngắm bức tranh / vách tiếp theo (→)"
            >
              <ChevronRight className="w-7 h-7 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Thanh điều hướng tham quan khắp phòng ở đáy (Virtual Tour Navigation Bar) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full shadow-2xl max-w-[95vw] overflow-x-auto custom-scrollbar">
              <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700 text-xs font-bold text-amber-400 shrink-0">
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="hidden sm:inline">Tham quan:</span>
              </div>
              
              <div className="flex items-center gap-1">
                {paintings.map((p, idx) => {
                  const isCurrent = selectedPainting?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => goToPaintingByIndex(idx)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer shrink-0 ${
                        isCurrent 
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                      title={p.title}
                    >
                      Vách {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Quick Upload Button ngay trên thanh tham quan */}
              <label className="ml-1 px-2.5 py-1 rounded-full bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gắn ảnh mới</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
            </div>
          </div>
          )}

          {/* GALAXY LAYOUT */}
          {activeLayout === 'galaxy' && (
            <GalaxyLayout
              paintings={paintings}
              selectedPainting={selectedPainting}
              onSelectPainting={setSelectedPainting}
            />
          )}

          {/* 2D HUD PANEL FOR DETAILED INFORMATION */}
          {selectedPainting && (
            <div className={`absolute z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 ${
              activeLayout === 'galaxy'
                ? 'bottom-16 right-4 max-w-xs w-full p-0 overflow-hidden'
                : 'bottom-4 right-4 max-w-sm w-full p-4'
            }`}>
              {activeLayout === 'galaxy' ? (
                /* Galaxy mode: image-forward card */
                <>
                  <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-slate-950">
                    <img
                      src={selectedPainting.url}
                      alt={selectedPainting.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-transparent to-transparent" />
                    <button
                      onClick={() => setSelectedPainting(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wide line-clamp-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        {selectedPainting.title}
                      </h3>
                      <p className="text-[9px] text-cyan-400 font-bold mt-0.5 flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> {selectedPainting.author}
                      </p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium line-clamp-3">
                      {selectedPainting.desc}
                    </p>
                    <div className="mt-2.5 flex gap-2 justify-end">
                      <button
                        onClick={() => setSelectedPainting(null)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        Trở lại
                      </button>
                      <a
                        href={selectedPainting.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-linear-to-r from-violet-500 to-indigo-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem ảnh
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                /* Normal mode: existing panel */
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-left pr-4">
                      <h3 className="text-xs md:text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        {selectedPainting.title}
                      </h3>
                      <p className="text-[10px] text-cyan-400 font-bold mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> Tác giả: {selectedPainting.author}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPainting(null)}
                      className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-left">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      {selectedPainting.desc}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2 justify-end">
                    <button
                      onClick={() => setSelectedPainting(null)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Trở lại
                    </button>
                    <a
                      href={selectedPainting.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-linear-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem ảnh
                    </a>
                  </div>
                </>
              )}
            </div>
          )}

        </main>
      </div>

      {/* 4. MODAL DIALOG EDIT DETAILS */}
      {editingPainting && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full relative text-left">
            <button 
              className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-all cursor-pointer"
              onClick={() => setEditingPainting(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-800">
              <Edit3 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-black text-white">Chỉnh sửa thông tin tác phẩm</h3>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Tên tác phẩm
                </label>
                <input 
                  type="text" 
                  required
                  value={editingPainting.title} 
                  onChange={(e) => setEditingPainting(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3.5 py-2 rounded-xl text-xs font-bold text-white outline-none transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Tác giả
                </label>
                <input 
                  type="text" 
                  required
                  value={editingPainting.author} 
                  onChange={(e) => setEditingPainting(prev => prev ? { ...prev, author: e.target.value } : null)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3.5 py-2 rounded-xl text-xs font-bold text-white outline-none transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Mô tả tác phẩm
                </label>
                <textarea 
                  rows={3}
                  required
                  value={editingPainting.desc} 
                  onChange={(e) => setEditingPainting(prev => prev ? { ...prev, desc: e.target.value } : null)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 outline-none transition-all resize-none leading-relaxed" 
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingPainting(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
