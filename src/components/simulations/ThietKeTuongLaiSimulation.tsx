import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, AlertCircle, Plus, X as XIcon, GraduationCap, Target, AlertTriangle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

type Goal = 'IT' | 'Doctor' | 'Marketing';

const GOALS = [
  { id: 'IT', name: 'Kỹ sư CNTT', reqs: ['toan_ly', 'tin_hoc', 'dh_cntt'] },
  { id: 'Doctor', name: 'Bác sĩ Y khoa', reqs: ['toan_hoa_sinh', 'tinh_nguyen', 'dh_y'] },
  { id: 'Marketing', name: 'Chuyên viên Marketing', reqs: ['ielts', 'clb_event', 'dh_kinh_te'] },
];

type Task = {
  id: string;
  name: string;
  pressure: number;
  category: 'academic' | 'skill' | 'cert';
};

const TASKS: Task[] = [
  // Academic
  { id: 'toan_ly', name: 'Bồi dưỡng Toán/Lý', pressure: 4, category: 'academic' },
  { id: 'toan_hoa_sinh', name: 'Bồi dưỡng Toán/Hóa/Sinh', pressure: 5, category: 'academic' },
  { id: 'dh_cntt', name: 'Thi đỗ ĐH CNTT', pressure: 8, category: 'academic' },
  { id: 'dh_y', name: 'Thi đỗ ĐH Y', pressure: 9, category: 'academic' },
  { id: 'dh_kinh_te', name: 'Thi đỗ ĐH Kinh Tế', pressure: 7, category: 'academic' },
  
  // Cert
  { id: 'ielts', name: 'Học IELTS 6.5+', pressure: 5, category: 'cert' },
  { id: 'tin_hoc', name: 'Lấy chứng chỉ Tin học', pressure: 3, category: 'cert' },
  
  // Skill
  { id: 'clb_event', name: 'Ban Tổ chức CLB Sự kiện', pressure: 4, category: 'skill' },
  { id: 'clb_tranh_bien', name: 'CLB Tranh biện', pressure: 3, category: 'skill' },
  { id: 'tinh_nguyen', name: 'Chiến dịch Tình nguyện', pressure: 2, category: 'skill' },
];

type Period = 'grade10' | 'grade11' | 'grade12' | 'uni';

const PERIODS: { id: Period; name: string; maxPressure: number }[] = [
  { id: 'grade10', name: 'Lớp 10', maxPressure: 8 },
  { id: 'grade11', name: 'Lớp 11', maxPressure: 9 },
  { id: 'grade12', name: 'Lớp 12', maxPressure: 10 },
  { id: 'uni', name: 'Đại học', maxPressure: 10 },
];

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export function ThietKeTuongLaiSimulation({ onBack }: Props) {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  // Mapping Period -> array of Task IDs
  const [timeline, setTimeline] = useState<Record<Period, string[]>>({
    grade10: [], grade11: [], grade12: [], uni: []
  });

  const [availableTasks, setAvailableTasks] = useState<Task[]>(TASKS);
  
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const goalObj = GOALS.find(g => g.id === selectedGoal);

  // Helper to calculate pressure
  const getPressure = (period: Period) => {
    return timeline[period].reduce((sum, taskId) => {
      const task = TASKS.find(t => t.id === taskId);
      return sum + (task?.pressure || 0);
    }, 0);
  };

  const handleAddTaskToPeriod = (task: Task, period: Period) => {
    // Check pressure
    const currentP = getPressure(period);
    const maxP = PERIODS.find(p => p.id === period)?.maxPressure || 10;
    
    if (currentP + task.pressure > maxP) {
      setFeedback({ type: 'error', message: `Áp lực năm ${PERIODS.find(p=>p.id===period)?.name} đã vượt ngưỡng! Không thể thêm quá nhiều nhiệm vụ nặng.` });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setAvailableTasks(prev => prev.filter(t => t.id !== task.id));
    setTimeline(prev => ({
      ...prev,
      [period]: [...prev[period], task.id]
    }));
  };

  const handleRemoveTask = (taskId: string, period: Period) => {
    const task = TASKS.find(t => t.id === taskId);
    if (!task) return;

    setTimeline(prev => ({
      ...prev,
      [period]: prev[period].filter(id => id !== taskId)
    }));
    setAvailableTasks(prev => [...prev, task]);
  };

  const handleVerify = () => {
    if (!goalObj) return;

    const allPlacedTasks = Object.values(timeline).flat();
    const missingReqs = goalObj.reqs.filter(req => !allPlacedTasks.includes(req));

    if (missingReqs.length > 0) {
      const missingNames = missingReqs.map(id => TASKS.find(t => t.id === id)?.name).join(', ');
      setFeedback({ type: 'error', message: `Lộ trình thiếu các bước quan trọng để đạt được mục tiêu: ${missingNames}` });
    } else {
      setFeedback({ type: 'success', message: 'Tuyệt vời! Lộ trình của bạn rất hợp lý, cân bằng được áp lực học tập và kỹ năng cần thiết để đạt mục tiêu.' });
    }
  };

  const getCategoryColor = (cat: string) => {
    if (cat === 'academic') return 'bg-blue-500 border-blue-400';
    if (cat === 'cert') return 'bg-amber-500 border-amber-400';
    return 'bg-emerald-500 border-emerald-400';
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative pb-10">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-white">Thiết Kế Tương Lai</h1>
            <p className="text-xs text-indigo-400">Xếp hình Lộ trình học tập</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 pt-8 flex flex-col gap-8">
        
        {/* Step 1: Goal Selection */}
        {!selectedGoal && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
              <Target className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold mb-8">Bạn ước mơ trở thành ai?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id as Goal)}
                  className="bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-indigo-900/20 p-8 rounded-3xl transition-all shadow-lg hover:-translate-y-2 group"
                >
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300">{g.name}</h3>
                  <p className="text-sm text-slate-500 mt-2">Chọn lộ trình này <ArrowRightIcon className="inline w-4 h-4" /></p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Timeline Builder */}
        {selectedGoal && (
          <>
            <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl"><GraduationCap className="w-8 h-8 text-indigo-400" /></div>
                <div>
                  <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Mục tiêu của bạn</h2>
                  <p className="text-2xl font-bold text-white">{goalObj?.name}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedGoal(null); setTimeline({grade10: [], grade11: [], grade12: [], uni: []}); setAvailableTasks(TASKS); setFeedback(null); }} className="text-sm text-slate-400 hover:text-white underline">
                Chọn lại mục tiêu
              </button>
            </div>

            {/* Error/Success Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-4 rounded-xl font-medium flex items-start gap-3 ${feedback.type === 'error' ? 'bg-rose-950/50 border border-rose-900/50 text-rose-400' : 'bg-emerald-950/50 border border-emerald-900/50 text-emerald-400'}`}>
                  {feedback.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {feedback.message}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* TIMELINE (Drop zones) */}
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {PERIODS.map(period => {
                  const p = getPressure(period.id);
                  const pPerc = Math.min(100, (p / period.maxPressure) * 100);
                  const pColor = pPerc > 80 ? 'bg-rose-500' : pPerc > 50 ? 'bg-amber-500' : 'bg-emerald-500';

                  return (
                    <div key={period.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col h-[500px]">
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-white mb-2">{period.name}</h3>
                        {/* Pressure Bar */}
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-400">Áp lực học tập</span>
                          <span className={`${pPerc > 80 ? 'text-rose-400' : 'text-slate-300'}`}>{p}/{period.maxPressure}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div className={`h-full ${pColor}`} animate={{ width: `${pPerc}%` }} />
                        </div>
                      </div>

                      <div className="flex-1 bg-slate-950/50 rounded-2xl border border-dashed border-slate-700 p-3 flex flex-col gap-3 overflow-y-auto">
                        <AnimatePresence>
                          {timeline[period.id].map(taskId => {
                            const task = TASKS.find(t => t.id === taskId);
                            if (!task) return null;
                            return (
                              <motion.div
                                layoutId={task.id}
                                key={task.id}
                                className={`${getCategoryColor(task.category)} p-3 rounded-xl shadow-lg relative group`}
                              >
                                <p className="font-bold text-sm text-white pr-6">{task.name}</p>
                                <span className="absolute top-3 right-3 text-xs bg-black/20 px-2 py-0.5 rounded-md font-bold">AP: {task.pressure}</span>
                                
                                <button 
                                  onClick={() => handleRemoveTask(task.id, period.id)}
                                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        
                        {timeline[period.id].length === 0 && (
                          <div className="m-auto text-slate-600 text-sm text-center">Trống<br/>(Nhấp + vào thẻ bên phải để thêm)</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AVAILABLE TASKS */}
              <div className="w-full lg:w-[350px] shrink-0 bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-24 max-h-[80vh] flex flex-col">
                <h3 className="font-bold text-lg mb-4">Kho Mảnh Ghép</h3>
                
                {/* Legend */}
                <div className="flex gap-2 mb-4 text-xs font-medium">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Học thuật</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Chứng chỉ</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Kỹ năng</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  <AnimatePresence>
                    {availableTasks.map(task => (
                      <motion.div
                        layoutId={task.id}
                        key={task.id}
                        className={`${getCategoryColor(task.category)} p-3 rounded-xl shadow-md border-opacity-50`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-sm text-white leading-tight pr-2">{task.name}</p>
                          <span className="text-xs bg-black/20 px-2 py-0.5 rounded-md font-bold whitespace-nowrap">Áp lực: {task.pressure}</span>
                        </div>
                        
                        {/* Quick Add Buttons */}
                        <div className="flex gap-1 mt-2">
                          {PERIODS.map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleAddTaskToPeriod(task, p.id)}
                              className="flex-1 py-1 text-[10px] bg-black/10 hover:bg-black/30 rounded font-bold transition-colors"
                              title={`Thêm vào ${p.name}`}
                            >
                              + {p.name.replace('Lớp ', '')}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {availableTasks.length === 0 && (
                    <div className="text-center text-slate-500 py-8">Bạn đã sử dụng hết các mảnh ghép!</div>
                  )}
                </div>

                <button
                  onClick={handleVerify}
                  className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all flex justify-center items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Đánh Giá Lộ Trình
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

const ArrowRightIcon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
