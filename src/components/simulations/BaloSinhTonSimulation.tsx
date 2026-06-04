import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, RotateCcw, Backpack, Plus } from 'lucide-react';

interface Props {
  onBack: () => void;
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

type SurvivalItem = {
  id: string;
  name: string;
  icon: string;
  isEssential: boolean;
  consequenceIfMissing?: string;
  consequenceIfBrought?: string;
};

const ITEMS: SurvivalItem[] = [
  { id: 'flashlight', name: 'Đèn pin', icon: '🔦', isEssential: true, consequenceIfMissing: 'Thiếu đèn pin, bạn sẽ rất khó di chuyển hoặc ra hiệu cầu cứu trong đêm khi cúp điện.' },
  { id: 'water', name: 'Nước suối', icon: '💧', isEssential: true, consequenceIfMissing: 'Cơ thể người chỉ chịu được 3 ngày không có nước. Thiếu nước sạch là mối đe dọa lớn nhất.' },
  { id: 'food', name: 'Lương khô', icon: '🥫', isEssential: true, consequenceIfMissing: 'Thiếu thức ăn dự trữ, bạn sẽ nhanh chóng kiệt sức trong thời gian chờ cứu hộ.' },
  { id: 'firstaid', name: 'Túi sơ cứu', icon: '🩹', isEssential: true, consequenceIfMissing: 'Thiếu túi sơ cứu, một vết thương nhỏ do mảnh kính vỡ cũng có thể nhiễm trùng nguy hiểm.' },
  { id: 'radio', name: 'Radio pin', icon: '📻', isEssential: true, consequenceIfMissing: 'Không có radio, bạn không thể cập nhật tin tức cảnh báo bão khi mất kết nối mạng và điện.' },
  { id: 'whistle', name: 'Còi', icon: '🪈', isEssential: true, consequenceIfMissing: 'Còi giúp phát ra âm thanh báo hiệu vị trí cho đội cứu hộ hiệu quả hơn rất nhiều so với la hét.' },
  { id: 'raincoat', name: 'Áo mưa', icon: '🧥', isEssential: true, consequenceIfMissing: 'Thiếu áo mưa hoặc chăn giữ nhiệt, bạn dễ bị hạ thân nhiệt nghiêm trọng khi mưa bão kéo dài.' },
  
  { id: 'ipad', name: 'iPad', icon: '📱', isEssential: false, consequenceIfBrought: 'Mất điện và mất mạng internet, iPad sẽ nhanh chóng cạn pin và trở thành cục gạch nặng nề.' },
  { id: 'books', name: 'Sách vở', icon: '📚', isEssential: false, consequenceIfBrought: 'Sách vở nặng và dễ hỏng khi ngập nước, không có tác dụng sinh tồn trong cơn bão.' },
  { id: 'hairdryer', name: 'Máy sấy tóc', icon: '💨', isEssential: false, consequenceIfBrought: 'Trong bão lũ cúp điện hoàn toàn, các thiết bị điện cắm ổ cắm là vô dụng và nguy hiểm.' },
  { id: 'bear', name: 'Gấu bông', icon: '🧸', isEssential: false, consequenceIfBrought: 'Gấu bông tốn diện tích không gian balo vốn rất hạn hẹp cho đồ ăn và thiết bị cứu sinh.' },
  { id: 'jewel', name: 'Trang sức', icon: '💍', isEssential: false, consequenceIfBrought: 'Trang sức không có giá trị sinh tồn, đôi khi còn gây nguy hiểm do thu hút rủi ro.' },
];

const BACKPACK_CAPACITY = 7;
const TIME_LIMIT = 30; // 30 seconds for panic minigame feel

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export function BaloSinhTonSimulation({ onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const [availableItems, setAvailableItems] = useState<SurvivalItem[]>([]);
  const [bagItems, setBagItems] = useState<SurvivalItem[]>([]);

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  useEffect(() => {
    // Shuffle items on init
    const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setBagItems([]);
    setTimeLeft(TIME_LIMIT);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDropToBag = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItemId || bagItems.length >= BACKPACK_CAPACITY || isFinished) return;
    
    const item = availableItems.find(i => i.id === draggedItemId);
    if (item) {
      setAvailableItems(prev => prev.filter(i => i.id !== draggedItemId));
      setBagItems(prev => [...prev, item]);
    }
    setDraggedItemId(null);
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItemId || isFinished) return;

    const item = bagItems.find(i => i.id === draggedItemId);
    if (item) {
      setBagItems(prev => prev.filter(i => i.id !== draggedItemId));
      setAvailableItems(prev => [...prev, item]);
    }
    setDraggedItemId(null);
  };

  // For touch screens (click to move)
  const toggleItem = (item: SurvivalItem, currentZone: 'available' | 'bag') => {
    if (isFinished) return;
    
    if (currentZone === 'available') {
      if (bagItems.length >= BACKPACK_CAPACITY) return;
      setAvailableItems(prev => prev.filter(i => i.id !== item.id));
      setBagItems(prev => [...prev, item]);
    } else {
      setBagItems(prev => prev.filter(i => i.id !== item.id));
      setAvailableItems(prev => [...prev, item]);
    }
  };

  const restart = () => {
    const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setBagItems([]);
    setTimeLeft(TIME_LIMIT);
    setIsStarted(true);
    setIsFinished(false);
  };

  // Evaluate results
  const score = bagItems.filter(i => i.isEssential).length;
  const nonEssentialBrought = bagItems.filter(i => !i.isEssential);
  const essentialMissing = ITEMS.filter(i => i.isEssential && !bagItems.some(b => b.id === i.id));

  const isPanic = isStarted && !isFinished && timeLeft <= 10;

  return (
    <div className={`w-full h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden transition-colors duration-300 ${isPanic ? 'bg-red-950/20' : ''}`}>
      
      {/* Panic Overlay Flash */}
      {isPanic && (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none z-0" />
      )}

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg text-white">Balo Sinh Tồn Trước Bão</h1>
        
        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-lg transition-colors ${isPanic ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
          <Clock className="w-5 h-5" />
          {timeLeft}s
        </div>
      </div>

      {!isStarted && !isFinished ? (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="max-w-md text-center bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-2xl">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Cảnh báo Bão Khẩn cấp!</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Bạn có đúng {TIME_LIMIT} giây để đóng gói balo sơ tán. Chỉ có 7 khoảng trống trong balo. Hãy nhanh chóng lựa chọn những món đồ thực sự CẦN THIẾT cho sự sống còn!
            </p>
            <button 
              onClick={() => setIsStarted(true)}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-rose-500/25"
            >
              Bắt Đầu Ngay
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto w-full relative z-10 overflow-hidden">
          
          {/* ITEMS TO CHOOSE */}
          <div 
            className="flex-1 bg-slate-900/50 rounded-3xl border border-slate-800 p-6 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={handleDropToAvailable}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-slate-400" /> Đồ đạc trong nhà</h3>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                <AnimatePresence>
                  {availableItems.map(item => (
                    <motion.div
                      layoutId={item.id}
                      key={item.id}
                      draggable={!isFinished}
                      onDragStart={(e) => handleDragStart(e as any, item.id)}
                      onClick={() => toggleItem(item, 'available')}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={!isFinished ? { scale: 1.05 } : {}}
                      whileTap={!isFinished ? { scale: 0.95 } : {}}
                      className={`aspect-square bg-slate-800 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center p-2 cursor-grab active:cursor-grabbing hover:border-slate-500 transition-colors ${isFinished ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <span className="text-4xl mb-2">{item.icon}</span>
                      <span className="text-xs font-medium text-slate-300 text-center leading-tight">{item.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* BACKPACK */}
          <div 
            className={`w-full md:w-[350px] shrink-0 bg-slate-900 rounded-3xl border-2 transition-colors flex flex-col ${bagItems.length >= BACKPACK_CAPACITY ? 'border-amber-500/50' : 'border-slate-700'} p-6`}
            onDragOver={handleDragOver}
            onDrop={handleDropToBag}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2"><Backpack className="w-5 h-5 text-indigo-400" /> Balo của bạn</h3>
              <div className="px-3 py-1 bg-slate-800 rounded-full text-sm font-bold">
                <span className={bagItems.length >= BACKPACK_CAPACITY ? 'text-rose-400' : 'text-emerald-400'}>{bagItems.length}</span>
                <span className="text-slate-500"> / {BACKPACK_CAPACITY}</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 auto-rows-max">
              <AnimatePresence>
                {bagItems.map(item => (
                  <motion.div
                    layoutId={item.id}
                    key={item.id}
                    draggable={!isFinished}
                    onDragStart={(e) => handleDragStart(e as any, item.id)}
                    onClick={() => toggleItem(item, 'bag')}
                    className={`aspect-square bg-indigo-900/20 border-2 border-indigo-500/50 rounded-2xl flex flex-col items-center justify-center p-2 cursor-grab active:cursor-grabbing hover:bg-indigo-900/40 transition-colors ${isFinished ? 'pointer-events-none' : ''}`}
                  >
                    <span className="text-4xl mb-2">{item.icon}</span>
                    <span className="text-xs font-medium text-indigo-200 text-center leading-tight">{item.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Empty Slots Indicator */}
              {Array.from({ length: BACKPACK_CAPACITY - bagItems.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center text-slate-600">
                  <Plus className="w-6 h-6 opacity-30" />
                </div>
              ))}
            </div>

            {!isFinished && (
              <button 
                onClick={() => setIsFinished(true)}
                className="mt-6 w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg transition-all"
              >
                Hoàn thành đóng gói
              </button>
            )}
          </div>

        </div>
      )}

      {/* RESULTS MODAL */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col p-6 overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 my-auto shadow-2xl">
              <div className="text-center mb-8">
                {score >= 6 && nonEssentialBrought.length === 0 ? (
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                  </div>
                )}
                <h2 className="text-3xl font-bold mb-2">Đánh giá khả năng sinh tồn</h2>
                <p className="text-slate-400">Bạn đã mang theo {score} món đồ thiết yếu.</p>
              </div>

              <div className="space-y-6">
                
                {/* Mistakes: Brought non-essentials */}
                {nonEssentialBrought.length > 0 && (
                  <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-4">
                    <h3 className="font-bold text-rose-400 mb-3 flex items-center gap-2">⚠️ Đồ vật gây cản trở</h3>
                    <div className="space-y-3">
                      {nonEssentialBrought.map(i => (
                        <div key={i.id} className="flex items-start gap-3 text-sm">
                          <span className="text-2xl leading-none">{i.icon}</span>
                          <div>
                            <span className="font-bold text-rose-300">{i.name}:</span>
                            <span className="text-slate-300 ml-1">{i.consequenceIfBrought}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing essentials */}
                {essentialMissing.length > 0 && (
                  <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-4">
                    <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">❌ Bỏ quên đồ cứu sinh</h3>
                    <div className="space-y-3">
                      {essentialMissing.map(i => (
                        <div key={i.id} className="flex items-start gap-3 text-sm">
                          <span className="text-2xl leading-none">{i.icon}</span>
                          <div>
                            <span className="font-bold text-amber-300">{i.name}:</span>
                            <span className="text-slate-300 ml-1">{i.consequenceIfMissing}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {nonEssentialBrought.length === 0 && essentialMissing.length === 0 && (
                  <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-2xl p-6 text-center">
                    <p className="text-emerald-400 font-bold">Hoàn hảo! Balo của bạn hoàn toàn hợp lý và đảm bảo cao nhất cơ hội sinh tồn.</p>
                  </div>
                )}

              </div>

              <div className="mt-8">
                <button onClick={restart} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Thử Lại
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
