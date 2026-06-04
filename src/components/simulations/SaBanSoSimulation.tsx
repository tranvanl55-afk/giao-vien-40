import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, MapPin, Landmark, Leaf, Trees } from 'lucide-react';

interface Props {
  onBack: () => void;
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const STATIONS = [
  {
    id: 'history',
    title: 'TRẠM LỊCH SỬ ĐÔ THỊ',
    subtitle: 'Ký ức & Sự chuyển mình',
    icon: Landmark,
    position: { lat: 10.8524, lng: 106.7483 }, // Thu Duc
    pinColor: '#8b5a2b', // vintage brown
    content: (
      <div className="space-y-4 text-slate-200 leading-relaxed font-sans text-sm">
        <p>
          Tìm hiểu về lịch sử hình thành và sự phát triển của khu vực Thủ Đức và ngôi trường <strong>THCS Ngô Chí Quốc</strong>. 
          Theo thời gian, cảnh quan đô thị nơi đây đã trải qua sự chuyển mình mạnh mẽ từ một vùng ven thành một phần của thành phố sáng tạo.
        </p>
        <div className="p-4 border border-amber-900/50 bg-amber-950/20 rounded-sm">
          <h4 className="font-serif font-bold text-amber-500 mb-2 tracking-widest text-xs uppercase">Dấu ấn thời gian</h4>
          <p className="text-slate-300">
            Trường không chỉ là nơi truyền đạt kiến thức mà còn chứng kiến những thăng trầm và thay đổi quy hoạch của địa phương trong nhiều thập kỷ qua.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'ecology',
    title: 'TRẠM SINH THÁI SÔNG SÀI GÒN',
    subtitle: 'Dự án "Trạm Xanh" & Tái chế',
    icon: Leaf,
    position: { lat: 10.7966, lng: 106.7214 }, // Sông Sài Gòn
    pinColor: '#059669', // emerald
    content: (
      <div className="space-y-4 text-slate-200 leading-relaxed font-sans text-sm">
        <p>
          Lưu vực Sông Sài Gòn đối mặt với nhiều thách thức về ô nhiễm. Tại đây, dự án <strong>"Trạm Xanh"</strong> được giới thiệu như một giải pháp thiết thực từ giáo dục.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 border border-emerald-900/50 bg-emerald-950/20 rounded-sm">
            <h4 className="font-serif font-bold text-emerald-500 mb-1 text-xs uppercase">Bã Mía & Bẹ Chuối</h4>
            <p className="text-xs text-slate-300">Tái chế thành giấy sinh thái và bao bì tự hủy.</p>
          </div>
          <div className="p-3 border border-emerald-900/50 bg-emerald-950/20 rounded-sm">
            <h4 className="font-serif font-bold text-emerald-500 mb-1 text-xs uppercase">Bã Cà Phê</h4>
            <p className="text-xs text-slate-300">Sản xuất chậu cây ươm giống thân thiện môi trường.</p>
          </div>
        </div>
        <p className="italic text-slate-400 text-xs mt-2">
          Hành động nhỏ này giúp giảm thiểu rác thải nông nghiệp và bảo vệ nguồn nước dòng sông quê hương.
        </p>
      </div>
    )
  },
  {
    id: 'botany',
    title: 'TRẠM THỰC VẬT VÙNG VEN',
    subtitle: 'Đa dạng sinh học Nam Bộ',
    icon: Trees,
    position: { lat: 10.7180, lng: 106.7323 }, // Rừng ngập mặn Cần Giờ / ven rạch
    pinColor: '#10b981', // teal/green
    content: (
      <div className="space-y-4 text-slate-200 leading-relaxed font-sans text-sm">
        <p>
          Khám phá hệ sinh thái thực vật đặc trưng của vùng ven sông rạch Nam Bộ. Khu vực này sở hữu sự đa dạng sinh học độc đáo chịu ảnh hưởng của thủy triều.
        </p>
        <div className="relative overflow-hidden rounded-sm border border-slate-700 h-32 bg-slate-800 flex items-center justify-center group">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity group-hover:opacity-60" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1623849503375-71bbd85abccf?q=80&w=1000&auto=format&fit=crop)' }} />
          <div className="z-10 text-center px-4">
            <h4 className="font-serif font-bold text-white text-lg tracking-wider mb-1">Cây Đọt Choại</h4>
            <p className="text-xs text-slate-300 bg-black/50 px-2 py-1 rounded inline-block">Dây choại - Stenochlaena palustris</p>
          </div>
        </div>
        <p>
          <strong>Đọt choại</strong> không chỉ là loài dây leo hoang dại giữ đất ven bờ, mà còn là một nét văn hóa ẩm thực mộc mạc không thể thiếu của người dân Nam Bộ.
        </p>
      </div>
    )
  }
];

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export function SaBanSoSimulation({ onBack }: Props) {
  const [activeStation, setActiveStation] = useState<typeof STATIONS[0] | null>(null);

  // You must set these in your .env file or Google Cloud Console for production
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSy_DUMMY_KEY_PLEASE_REPLACE';
  const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

  return (
    <div className="w-full h-screen bg-black text-slate-100 flex flex-col font-sans relative overflow-hidden">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-6 bg-linear-to-b from-black/90 to-transparent z-40 pointer-events-none">
        <button onClick={onBack} className="p-3 bg-black/50 hover:bg-black/80 border border-slate-700/50 backdrop-blur-md rounded-full transition-colors text-slate-300 hover:text-white pointer-events-auto group">
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </button>
        <div className="flex flex-col items-end">
          <h1 className="font-serif font-bold text-2xl text-white tracking-widest uppercase drop-shadow-lg">Sa Bàn Số 3D</h1>
          <p className="text-xs text-amber-500 font-medium tracking-widest uppercase bg-black/50 px-2 py-0.5 rounded backdrop-blur-md mt-1 border border-amber-900/50">
            Khám phá Thành phố Hồ Chí Minh
          </p>
        </div>
      </div>

      {/* Warning if dummy key */}
      {API_KEY.includes('DUMMY') && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-rose-950/80 text-rose-200 px-4 py-2 rounded-lg text-xs border border-rose-900 backdrop-blur-md pointer-events-auto max-w-lg text-center">
          <strong>Lưu ý:</strong> API Key hiện tại là giả lập. Để hiển thị bản đồ 3D Photorealistic, vui lòng điền `VITE_GOOGLE_MAPS_API_KEY` và `VITE_GOOGLE_MAPS_MAP_ID` vào file `.env`.
        </div>
      )}

      {/* Map Area */}
      <div className="flex-1 w-full h-full relative z-0 bg-slate-900">
        <APIProvider apiKey={API_KEY}>
          <Map
            mapId={MAP_ID !== 'DEMO_MAP_ID' ? MAP_ID : undefined}
            defaultCenter={{ lat: 10.7769, lng: 106.7009 }} // Center of HCMC
            defaultZoom={13}
            defaultTilt={60} // 45-60 degree tilt required for 3D
            defaultHeading={45} // Slight rotation for cinematic feel
            disableDefaultUI={true} // Cleaner museum look
            className="w-full h-full"
            gestureHandling="greedy"
          >
            {STATIONS.map((station) => (
              <AdvancedMarker
                key={station.id}
                position={station.position}
                onClick={() => setActiveStation(station)}
              >
                <Pin
                  background={station.pinColor}
                  borderColor="#ffffff"
                  glyphColor="#ffffff"
                  scale={1.2}
                />
                {/* Custom tooltip-like label underneath */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-black/80 border border-slate-700 px-2 py-1 rounded text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                  {station.title}
                </div>
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </div>

      {/* Interactive Modal (Cinematic / Vintage Museum Aesthetic) */}
      <AnimatePresence>
        {activeStation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-end p-8 sm:p-12 pointer-events-none"
          >
            {/* Backdrop dark gradient */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setActiveStation(null)} />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full max-h-[800px] bg-[#1a1814]/95 backdrop-blur-xl border-l-4 border-amber-600/80 rounded-l-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto flex flex-col overflow-hidden"
            >
              {/* Vintage noise overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

              <div className="p-8 pb-0 shrink-0 flex justify-between items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-950/50 border border-amber-800/50">
                  <activeStation.icon className="w-6 h-6 text-amber-500" />
                </div>
                <button onClick={() => setActiveStation(null)} className="p-2 text-slate-500 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                <p className="text-amber-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">Trạm Triển Lãm</p>
                <h2 className="font-serif text-3xl md:text-4xl text-amber-50 font-bold leading-tight mb-2 uppercase drop-shadow-md">
                  {activeStation.title}
                </h2>
                <h3 className="font-serif text-lg text-amber-200/80 italic mb-8 border-b border-amber-900/30 pb-4">
                  {activeStation.subtitle}
                </h3>

                {activeStation.content}
              </div>

              <div className="p-6 shrink-0 border-t border-amber-900/20 text-center">
                <p className="font-serif text-xs text-amber-700/50 tracking-widest uppercase">
                  Dự án Khám phá Địa phương • {new Date().getFullYear()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
