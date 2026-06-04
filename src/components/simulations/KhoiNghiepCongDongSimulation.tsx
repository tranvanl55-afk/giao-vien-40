import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Wallet, Leaf, Megaphone, TrendingUp, DollarSign, Target, RotateCcw, Box, Heart } from 'lucide-react';

interface Props {
  onBack: () => void;
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const INITIAL_CAPITAL = 500000;

const MATERIALS = [
  { id: 'coffee', name: 'Bã cà phê', desc: 'Sản xuất chậu cây sinh học', cost: 100000, impact: 50, icon: '☕' },
  { id: 'fabric', name: 'Vải vụn', desc: 'May túi xách tái chế', cost: 200000, impact: 30, icon: '🧵' },
  { id: 'paper', name: 'Giấy vụn', desc: 'Làm sổ tay handmade', cost: 150000, impact: 40, icon: '📄' },
];

const MARKETING = [
  { id: 'fb', name: 'Mạng xã hội', desc: 'Đăng bài group cộng đồng', cost: 0, reach: 100, icon: '📱' },
  { id: 'flyer', name: 'Phát tờ rơi', desc: 'Quanh khu vực trường học', cost: 100000, reach: 300, icon: '📰' },
  { id: 'ads', name: 'Chạy Ads', desc: 'Quảng cáo nhắm mục tiêu', cost: 250000, reach: 1000, icon: '🚀' },
];

const PRICING = [
  { id: 'low', name: 'Giá Thấp', price: 50000, conversion: 0.5 },
  { id: 'mid', name: 'Giá Trung Bình', price: 100000, conversion: 0.2 },
  { id: 'high', name: 'Giá Cao', price: 200000, conversion: 0.05 },
];

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export function KhoiNghiepCongDongSimulation({ onBack }: Props) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedMarketing, setSelectedMarketing] = useState<string | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null);

  const [hasRun, setHasRun] = useState(false);
  const [results, setResults] = useState<{
    revenue: number;
    profit: number;
    impact: number;
    sales: number;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derived state
  const matObj = MATERIALS.find(m => m.id === selectedMaterial);
  const mktObj = MARKETING.find(m => m.id === selectedMarketing);
  const priObj = PRICING.find(p => p.id === selectedPricing);

  const currentCost = (matObj?.cost || 0) + (mktObj?.cost || 0);
  const currentCapital = INITIAL_CAPITAL - currentCost;

  const handleRun = () => {
    if (!matObj || !mktObj || !priObj) {
      setErrorMsg("Vui lòng chọn đầy đủ Nguyên liệu, Truyền thông và Mức giá!");
      return;
    }
    if (currentCapital < 0) {
      setErrorMsg("Bạn đã vượt quá ngân sách! Vui lòng điều chỉnh lại.");
      return;
    }

    setErrorMsg(null);

    // Calculate
    const sales = Math.floor(mktObj.reach * priObj.conversion);
    const revenue = sales * priObj.price;
    const profit = revenue - currentCost;
    
    setResults({
      revenue,
      profit,
      impact: matObj.impact,
      sales
    });
    setHasRun(true);
  };

  const restart = () => {
    setHasRun(false);
    setResults(null);
    setSelectedMaterial(null);
    setSelectedMarketing(null);
    setSelectedPricing(null);
    setErrorMsg(null);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 -z-10" />

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-white">Khởi Nghiệp Vì Cộng Đồng</h1>
            <p className="text-xs text-emerald-500">Quản trị Dự án Tái chế</p>
          </div>
        </div>

        {/* Dashboard Budget */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          <Wallet className="w-5 h-5 text-emerald-400" />
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Ngân sách còn lại</p>
            <p className={`font-bold ${currentCapital < 0 ? 'text-rose-400' : 'text-white'}`}>
              {formatCurrency(currentCapital)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 pt-8 flex gap-8">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="flex-1 space-y-8">
          
          {/* Section 1: Nguyên liệu */}
          <section className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg"><Box className="w-6 h-6 text-emerald-400" /></div>
              <h2 className="text-xl font-bold">1. Chọn Nguyên Liệu Tái Chế</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MATERIALS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMaterial(item.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedMaterial === item.id 
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' 
                      : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{item.desc}</p>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-rose-400">-{formatCurrency(item.cost)}</span>
                    <span className="text-emerald-400">+{item.impact}kg</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: Marketing */}
          <section className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Megaphone className="w-6 h-6 text-blue-400" /></div>
              <h2 className="text-xl font-bold">2. Kênh Truyền Thông</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MARKETING.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMarketing(item.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedMarketing === item.id 
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                      : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{item.desc}</p>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className={item.cost === 0 ? 'text-slate-300' : 'text-rose-400'}>
                      {item.cost === 0 ? 'Miễn phí' : `-${formatCurrency(item.cost)}`}
                    </span>
                    <span className="text-blue-400">Tiếp cận {item.reach}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section 3: Pricing */}
          <section className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg"><Target className="w-6 h-6 text-purple-400" /></div>
              <h2 className="text-xl font-bold">3. Chiến Lược Giá</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRICING.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPricing(item.id)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    selectedPricing === item.id 
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
                      : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
                  }`}
                >
                  <h3 className="font-bold text-white mb-2">{item.name}</h3>
                  <div className="text-xl font-bold text-purple-400 mb-2">{formatCurrency(item.price)}/sp</div>
                  <p className="text-xs text-slate-400">Tỷ lệ mua hàng: {item.conversion * 100}%</p>
                </button>
              ))}
            </div>
          </section>

          {/* Action Area */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-rose-400 font-medium">
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={handleRun}
              disabled={hasRun}
              className={`px-12 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all ${
                hasRun 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-linear-to-r from-emerald-500 to-teal-500 hover:scale-105 shadow-lg shadow-emerald-500/30 text-white'
              }`}
            >
              <TrendingUp className="w-6 h-6" /> CHẠY CHIẾN DỊCH
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="w-[400px] shrink-0">
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              {!hasRun ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-[500px] border-dashed"
                >
                  <Heart className="w-16 h-16 text-slate-700 mb-4" />
                  <h3 className="text-xl font-bold text-slate-500 mb-2">Chưa có dữ liệu báo cáo</h3>
                  <p className="text-sm text-slate-600">Hãy chọn các chiến lược kinh doanh và nhấn nút "Chạy chiến dịch" để xem kết quả hoạt động của dự án.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">Báo Cáo Dự Án</h2>
                    <p className="text-emerald-100 text-sm">Chu kỳ kinh doanh đầu tiên</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Financials */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Chỉ số tài chính</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Tổng chi phí:</span>
                          <span className="font-bold text-rose-400">{formatCurrency(currentCost)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Doanh thu ({results?.sales} sp):</span>
                          <span className="font-bold text-blue-400">{formatCurrency(results?.revenue || 0)}</span>
                        </div>
                        <div className="h-px bg-slate-700 my-2" />
                        <div className="flex justify-between items-center text-lg">
                          <span className="font-bold text-white">Lợi nhuận:</span>
                          <span className={`font-bold ${(results?.profit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(results?.profit || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Social Impact */}
                    <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Tác Động Xã Hội</h3>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-slate-300 text-sm">Lượng rác được xử lý:</span>
                        <span className="text-2xl font-black text-white">{results?.impact} <span className="text-sm text-slate-400 font-medium">kg</span></span>
                      </div>
                    </div>

                    {/* Advice */}
                    <div className="text-sm text-slate-400 bg-slate-900/50 p-4 rounded-xl">
                      {(results?.profit || 0) < 0 
                        ? "Dự án đang lỗ. Bạn đã chi quá nhiều cho Marketing mà giá bán chưa bù đắp được, hoặc tỷ lệ chuyển đổi quá thấp." 
                        : "Tuyệt vời! Dự án đã tạo ra giá trị kinh tế đồng thời bảo vệ môi trường."}
                    </div>

                    <button
                      onClick={restart}
                      className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" /> Thử Lại Kế Hoạch Mới
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
