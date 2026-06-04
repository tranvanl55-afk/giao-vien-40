import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Hand, Users, Plus, X, Settings, Globe, ChevronDown, Trash2, Maximize2, Minimize2, Camera, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';
import { Jellyfish } from './Jellyfish';
import { HandTracker } from './HandTracker';

// Colors for jellyfishes
const JELLYFISH_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
];

// i18n
const dictionary: any = {
  vi: {
    title: 'Đại Dương Ma Thuật',
    addStudent: 'Thêm Học Sinh',
    raiseHand: 'Giơ tay để gọi sứa',
    classList: 'Danh Sách Lớp',
    studentList: 'Danh Sách Học Sinh',
    emptyList: 'Chưa có học sinh nào. Hãy thêm vào nhé!',
    enterName: 'Nhập tên học sinh...',
    newClass: 'Tên lớp mới...',
    called: 'Đã gọi',
    close: 'Đóng'
  },
  en: {
    title: 'Magic Ocean',
    addStudent: 'Add Student',
    raiseHand: 'Raise hand to call',
    classList: 'Class List',
    studentList: 'Student List',
    emptyList: 'No students yet. Please add some!',
    enterName: 'Enter student name...',
    newClass: 'New class name...',
    called: 'Called',
    close: 'Close'
  }
};

interface Student {
  id: string;
  name: string;
  color: string;
  x: number; // target X position (vw)
  y: number; // target Y position (vh)
}

interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

export const DaiDuongMaThuatGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const t = dictionary[lang];
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [classes, setClasses] = useState<ClassData[]>([
    { id: 'class-1', name: 'Lớp 6A1', students: [] }
  ]);
  const [activeClassId, setActiveClassId] = useState<string>('class-1');
  const [newStudentName, setNewStudentName] = useState('');
  const [newClassName, setNewClassName] = useState('');

  const [calledStudents, setCalledStudents] = useState<string[]>([]);
  const [showHandTracking, setShowHandTracking] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('magic_ocean_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setClasses(parsed);
          setActiveClassId(parsed[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default sample data
      const sampleClass: ClassData = {
        id: 'class-1',
        name: 'Lớp 6A1 (Mẫu)',
        students: [
          { id: '1', name: 'Nguyễn Văn A', color: JELLYFISH_COLORS[0], x: 20, y: 30 },
          { id: '2', name: 'Trần Thị B', color: JELLYFISH_COLORS[1], x: 40, y: 50 },
          { id: '3', name: 'Lê Hoàng C', color: JELLYFISH_COLORS[2], x: 60, y: 40 },
          { id: '4', name: 'Phạm Văn D', color: JELLYFISH_COLORS[3], x: 80, y: 70 },
          { id: '5', name: 'Hoàng Thị E', color: JELLYFISH_COLORS[4], x: 30, y: 70 },
        ]
      };
      setClasses([sampleClass]);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (classes.length > 0) {
      localStorage.setItem('magic_ocean_classes', JSON.stringify(classes));
    }
  }, [classes]);

  const activeClass = classes.find(c => c.id === activeClassId) || classes[0];

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      color: JELLYFISH_COLORS[Math.floor(Math.random() * JELLYFISH_COLORS.length)],
      x: 10 + Math.random() * 80, // 10% to 90%
      y: 20 + Math.random() * 60, // 20% to 80%
    };

    setClasses(classes.map(c => 
      c.id === activeClassId ? { ...c, students: [...c.students, newStudent] } : c
    ));
    setNewStudentName('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const result = await Tesseract.recognize(file, 'vie');
      
      const text = result.data.text;
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 1 && !line.match(/^[\d.,]+$/)); // Filter empty lines and pure numbers

      if (lines.length > 0) {
        const newStudents: Student[] = lines.map((name, index) => ({
          id: Date.now().toString() + '-' + index,
          name: name,
          color: JELLYFISH_COLORS[Math.floor(Math.random() * JELLYFISH_COLORS.length)],
          x: 10 + Math.random() * 80,
          y: 20 + Math.random() * 60,
        }));

        setClasses(prevClasses => prevClasses.map(c => 
          c.id === activeClassId ? { ...c, students: [...c.students, ...newStudents] } : c
        ));
      } else {
        alert("Không tìm thấy tên nào trong ảnh!");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Có lỗi xảy ra khi quét ảnh.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    setClasses(classes.map(c => 
      c.id === activeClassId ? { ...c, students: c.students.filter(s => s.id !== studentId) } : c
    ));
    if (calledStudents.includes(studentId)) {
      setCalledStudents(calledStudents.filter(id => id !== studentId));
    }
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass: ClassData = {
      id: `class-${Date.now()}`,
      name: newClassName.trim(),
      students: []
    };
    setClasses([...classes, newClass]);
    setActiveClassId(newClass.id);
    setNewClassName('');
  };

  const handleCallStudent = (studentId: string) => {
    if (calledStudents.includes(studentId)) {
      setCalledStudents(calledStudents.filter(id => id !== studentId)); // Toggle off
    } else {
      setCalledStudents([...calledStudents, studentId]); // Add
    }
  };

  const handleCallRandom = (count: number) => {
    // Chọn ngẫu nhiên từ toàn bộ học sinh trong lớp để thay thế danh sách cũ
    const shuffled = [...activeClass.students].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, activeClass.students.length));
    setCalledStudents(selected.map(s => s.id));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-900 overflow-hidden relative font-sans text-slate-100 flex flex-col">
      {/* Deep Ocean Background */}
      <div className="absolute inset-0 z-0 bg-linear-to-b from-[#0f172a] via-[#020617] to-[#000000]">
        {/* Bubbles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              left: `${Math.random() * 100}%`,
              bottom: -50,
            }}
            animate={{
              y: [-50, -window.innerHeight - 100],
              x: (Math.random() - 0.5) * 100,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <img src="https://img.icons8.com/fluency/96/jellyfish.png" alt="Jellyfish" className="w-8 h-8" />
            <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setLang('vi')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${lang === 'vi' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              VI
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${lang === 'en' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setShowRules(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-sm font-bold border border-white/10 cursor-pointer"
          >
            📜 Luật chơi
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setShowHandTracking(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-full font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105"
          >
            <Hand className="w-5 h-5" />
            {t.raiseHand}
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative z-10 flex">
        {/* Left Sidebar - Management */}
        <motion.div 
          animate={{ width: showHandTracking ? 0 : 320, opacity: showHandTracking ? 0 : 1 }}
          className="bg-slate-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col my-4 ml-4 rounded-2xl shadow-2xl overflow-hidden z-20"
        >
          
          {/* Class Selector */}
          <div className="p-4 border-b border-white/10 bg-slate-800/50">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" /> {t.classList}
            </label>
            <select
              value={activeClassId}
              onChange={(e) => setActiveClassId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.students.length})</option>
              ))}
            </select>
            
            <form onSubmit={handleAddClass} className="mt-2 flex gap-2">
              <input
                type="text"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                placeholder={t.newClass}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
              />
              <button type="submit" className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg">
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Student List */}
          <div className="p-4 border-b border-white/10 flex flex-col gap-2">
            <form onSubmit={handleAddStudent} className="flex gap-2">
              <input
                type="text"
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                placeholder={t.enterName}
                className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm whitespace-nowrap">
                Thêm
              </button>
            </form>
            
            <div className="flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
              >
                {isScanning ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang quét ảnh...</>
                ) : (
                  <><Camera className="w-4 h-4" /> Quét danh sách từ ảnh</>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeClass?.students.length === 0 ? (
              <p className="text-slate-500 text-sm text-center p-4">{t.emptyList}</p>
            ) : (
              activeClass?.students.map(student => {
                const isCalled = calledStudents.includes(student.id);
                return (
                  <div 
                    key={student.id} 
                    className={`
                      flex items-center justify-between p-2 rounded-lg transition-colors group
                      ${isCalled ? 'bg-blue-900/40 border border-blue-500/30' : 'hover:bg-slate-800'}
                    `}
                  >
                    <button 
                      onClick={() => handleCallStudent(student.id)}
                      className="flex-1 text-left flex items-center gap-3"
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: student.color, boxShadow: `0 0 10px ${student.color}` }} />
                      <span className={isCalled ? 'font-bold text-blue-300' : 'text-slate-300'}>{student.name}</span>
                    </button>
                    <button 
                      onClick={() => handleRemoveStudent(student.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
          
          {calledStudents.length > 0 && (
            <div className="p-4 bg-blue-900/30 border-t border-blue-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-300">{t.called}: {calledStudents.length}</span>
                <button onClick={() => setCalledStudents([])} className="text-xs text-blue-400 hover:text-white underline">
                  Reset
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Jellyfish Ocean Container */}
        <div className="flex-1 relative overflow-hidden">
          {activeClass?.students.map((student, i) => {
            const isCalled = calledStudents.includes(student.id);
            // Calculate a clustered position in the center if called, so they don't overlap exactly
            const indexInCalled = calledStudents.indexOf(student.id);
            const totalCalled = calledStudents.length;
            
            // Layout called jellyfishes in a row or grid at the center
            let targetX = student.x;
            let targetY = student.y;
            
            if (isCalled && totalCalled > 0) {
              const spacing = 15; // vw
              const startX = 50 - ((totalCalled - 1) * spacing) / 2;
              targetX = startX + indexInCalled * spacing;
              targetY = 50 + (indexInCalled % 2 === 0 ? -5 : 5); // Slight stagger
            }

            return (
              <Jellyfish
                key={student.id}
                id={student.id}
                name={student.name}
                color={student.color}
                x={targetX}
                y={targetY}
                isCalled={isCalled}
                hasCalledStudents={totalCalled > 0}
                onClick={() => handleCallStudent(student.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Hand Tracking PiP */}
      <AnimatePresence>
        {showHandTracking && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-6 right-6 z-50 w-80 md:w-96"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl shadow-cyan-900/20 relative">
              <button 
                onClick={() => setShowHandTracking(false)}
                className="absolute -top-3 -right-3 p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-full shadow-lg z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-3">
                <p className="text-sm font-semibold text-cyan-400">Giơ ngón tay gọi sứa</p>
              </div>

              {/* HandTracking Component */}
              <div className="h-48 md:h-64 w-full bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative shadow-inner">
                <HandTracker 
                  onDetectedFingers={(count) => {
                    handleCallRandom(count);
                    setShowHandTracking(false);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-md w-full relative text-left text-white"
            >
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                📜 Luật chơi Đại dương ma thuật
              </h3>
              
              <ul className="space-y-3 text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold shrink-0 flex items-center justify-center text-[10px]">1</span>
                  <span>Nhập danh sách học sinh thủ công hoặc tải ảnh chụp danh sách lớp để AI nhận diện chữ tự động.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold shrink-0 flex items-center justify-center text-[10px]">2</span>
                  <span>Mỗi học sinh sẽ được hiển thị như một chú sứa phát sáng tuyệt đẹp bơi tự do trong lòng đại dương.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold shrink-0 flex items-center justify-center text-[10px]">3</span>
                  <span>Chọn tên học sinh hoặc chạm vào chú sứa để "Gọi phát biểu" — chú sứa được chọn sẽ bơi vào trung tâm và phóng to.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold shrink-0 flex items-center justify-center text-[10px]">4</span>
                  <span>Nhấp <strong>"Giơ tay để gọi sứa"</strong> và cấp quyền camera: giơ từ 1-5 ngón tay, AI sẽ tự động đếm ngón tay và chọn ngẫu nhiên đúng bấy nhiêu học sinh!</span>
                </li>
              </ul>

              <button
                onClick={() => setShowRules(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all cursor-pointer text-center text-sm"
              >
                Đồng ý
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
