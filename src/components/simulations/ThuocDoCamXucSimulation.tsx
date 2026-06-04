import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, HeartPulse, Flame, RotateCcw, PartyPopper } from 'lucide-react';

interface Props {
  onBack: () => void;
}

// ----------------------------------------------------------------------
// STORY DATA
// ----------------------------------------------------------------------

type StoryNode = {
  id: string;
  speaker: string;
  text: string;
  mood: 'angry' | 'neutral' | 'happy' | 'sad';
  choices: {
    text: string;
    nextNodeId: string | 'win' | 'lose';
    deltaHoaHop: number;
    deltaTuAi: number;
  }[];
};

type Scenario = {
  id: string;
  title: string;
  description: string;
  nodes: Record<string, StoryNode>;
};

const SCENARIOS: Scenario[] = [
  {
    id: 've_muon',
    title: 'Tình huống 1: Đi học về muộn',
    description: 'Bạn mải làm bài tập nhóm nên về muộn, cả nhà đang chờ cơm...',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Mẹ',
        text: 'Con đi đâu giờ này mới về? Có biết mấy giờ rồi không? Cả nhà chờ cơm nãy giờ!',
        mood: 'angry',
        choices: [
          { text: 'Con đi học nhóm thôi mà, sao mẹ cứ làm ầm lên thế!', nextNodeId: 'node_2a', deltaHoaHop: -30, deltaTuAi: 20 },
          { text: 'Dạ con mải làm bài nhóm với các bạn quên để ý giờ, con xin lỗi mẹ.', nextNodeId: 'node_2b', deltaHoaHop: 20, deltaTuAi: -10 },
          { text: 'Tại trời mưa tắc đường chứ bộ, con có muốn thế đâu.', nextNodeId: 'node_2c', deltaHoaHop: -10, deltaTuAi: 10 },
        ]
      },
      node_2a: {
        id: 'node_2a',
        speaker: 'Mẹ',
        text: 'Mới nói một câu mà đã cãi leo lẻo rồi. Trách nhiệm của con đối với gia đình ở đâu? Học hành kiểu gì mà để bố mẹ phải lo lắng thế?',
        mood: 'angry',
        choices: [
          { text: 'Mẹ chẳng bao giờ hiểu con cả! Lúc nào mẹ cũng chỉ biết la mắng.', nextNodeId: 'lose', deltaHoaHop: -40, deltaTuAi: 30 },
          { text: 'Con biết lỗi rồi, con hơi nóng nảy. Lần sau con sẽ gọi điện báo trước.', nextNodeId: 'node_3b', deltaHoaHop: 15, deltaTuAi: -10 },
          { text: 'Thôi mẹ đừng cằn nhằn nữa, con mệt quá rồi.', nextNodeId: 'node_3c', deltaHoaHop: -20, deltaTuAi: 15 },
        ]
      },
      node_2b: {
        id: 'node_2b',
        speaker: 'Mẹ',
        text: 'Lần sau có về muộn thì phải nhắn tin báo trước một tiếng chứ. Thôi mau đi tắm rửa rồi ra ăn cơm, đồ ăn nguội hết rồi.',
        mood: 'neutral',
        choices: [
          { text: 'Dạ vâng, để con đi hâm lại đồ ăn rồi dọn cơm phụ mẹ ạ.', nextNodeId: 'win', deltaHoaHop: 30, deltaTuAi: -20 },
          { text: 'Con ăn chung với bạn rồi, mọi người cứ ăn đi con không ăn đâu.', nextNodeId: 'node_3c', deltaHoaHop: -20, deltaTuAi: 10 },
        ]
      },
      node_2c: {
        id: 'node_2c',
        speaker: 'Mẹ',
        text: 'Tắc đường thì cũng phải có điện thoại nhắn tin báo chứ. Trưởng thành rồi mà làm việc không có trách nhiệm gì cả.',
        mood: 'sad',
        choices: [
          { text: 'Thì đt con hết pin mà. Cứ làm như có việc gì to tát lắm.', nextNodeId: 'lose', deltaHoaHop: -40, deltaTuAi: 20 },
          { text: 'Dạ vâng, tại lúc đó đường đông quá con luống cuống không kịp nhắn. Lần sau con rút kinh nghiệm ạ.', nextNodeId: 'win', deltaHoaHop: 25, deltaTuAi: -10 },
        ]
      },
      node_3b: {
        id: 'node_3b',
        speaker: 'Mẹ',
        text: 'Thôi được rồi. Cất cặp sách đi rồi rửa tay ăn cơm.',
        mood: 'neutral',
        choices: [
          { text: 'Dạ vâng mẹ.', nextNodeId: 'win', deltaHoaHop: 20, deltaTuAi: -10 },
        ]
      },
      node_3c: {
        id: 'node_3c',
        speaker: 'Mẹ',
        text: 'Thái độ của con như vậy là không được. Ngồi xuống đây nói chuyện cho rõ ràng!',
        mood: 'angry',
        choices: [
          { text: '(Im lặng, đi thẳng vào phòng đóng rầm cửa lại)', nextNodeId: 'lose', deltaHoaHop: -50, deltaTuAi: 30 },
          { text: 'Dạ... vâng, nãy con hơi nóng, mẹ nói đi ạ.', nextNodeId: 'win', deltaHoaHop: 30, deltaTuAi: -20 },
        ]
      }
    }
  },
  {
    id: 'diem_kem',
    title: 'Tình huống 2: Điểm kiểm tra kém',
    description: 'Bạn vừa nhận bài kiểm tra Toán bị điểm kém và phải đưa cho bố ký...',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Bố',
        text: 'Sao bài kiểm tra Toán lần này lại bị 4 điểm thế này? Con có tập trung học bài không đấy?',
        mood: 'angry',
        choices: [
          { text: 'Tại đề khó quá bố ạ, các bạn lớp con cũng rớt nhiều lắm.', nextNodeId: 'node_2a', deltaHoaHop: -10, deltaTuAi: 15 },
          { text: 'Con xin lỗi bố, dạo này con có hơi chểnh mảng. Con sẽ cố gắng ở bài kiểm tra sau ạ.', nextNodeId: 'node_2b', deltaHoaHop: 30, deltaTuAi: -10 },
          { text: 'Bố lúc nào cũng chỉ quan tâm đến điểm số! Bố có biết con áp lực lắm không?', nextNodeId: 'node_2c', deltaHoaHop: -30, deltaTuAi: 30 },
        ]
      },
      node_2a: {
        id: 'node_2a',
        speaker: 'Bố',
        text: 'Đừng có đổ lỗi cho đề khó. Thế sao bạn Linh lớp trưởng vẫn được 9 điểm? Phải xem lại bản thân mình đi!',
        mood: 'angry',
        choices: [
          { text: 'Bố cứ đi mà nhận bạn Linh làm con! Con mệt mỏi với sự so sánh này lắm rồi.', nextNodeId: 'lose', deltaHoaHop: -50, deltaTuAi: 40 },
          { text: 'Dạ... con biết rồi, con sẽ xem lại phần kiến thức bị hổng.', nextNodeId: 'win', deltaHoaHop: 20, deltaTuAi: -10 },
        ]
      },
      node_2b: {
        id: 'node_2b',
        speaker: 'Bố',
        text: 'Biết nhận lỗi là tốt. Thế phần nào không hiểu thì hỏi thầy cô bạn bè, hoặc mang ra đây bố xem cho.',
        mood: 'neutral',
        choices: [
          { text: 'Dạ vâng, tối nay bố xem lại giúp con bài Hình học này với ạ.', nextNodeId: 'win', deltaHoaHop: 30, deltaTuAi: -20 },
          { text: 'Thôi con tự học được, bố giảng khó hiểu lắm.', nextNodeId: 'node_3a', deltaHoaHop: -20, deltaTuAi: 20 },
        ]
      },
      node_2c: {
        id: 'node_2c',
        speaker: 'Bố',
        text: 'Bố mẹ đi làm vất vả cũng chỉ mong con học hành đàng hoàng. Bây giờ con lại nói giọng thế à?',
        mood: 'sad',
        choices: [
          { text: 'Thì con nói thật mà. Lúc nào cũng ép con học.', nextNodeId: 'lose', deltaHoaHop: -40, deltaTuAi: 30 },
          { text: 'Con... con xin lỗi, nãy con mất bình tĩnh nên lỡ lời.', nextNodeId: 'win', deltaHoaHop: 25, deltaTuAi: -15 },
        ]
      },
      node_3a: {
        id: 'node_3a',
        speaker: 'Bố',
        text: 'Con lúc nào cũng cho là mình giỏi. Tự học mà được 4 điểm thế này à?',
        mood: 'angry',
        choices: [
          { text: 'Đó là do một lần sơ suất thôi!', nextNodeId: 'lose', deltaHoaHop: -30, deltaTuAi: 20 },
          { text: 'Dạ con sai rồi, bố chỉ lại giúp con với ạ.', nextNodeId: 'win', deltaHoaHop: 20, deltaTuAi: -10 },
        ]
      }
    }
  },
  {
    id: 'quen_viec_nha',
    title: 'Tình huống 3: Quên làm việc nhà',
    description: 'Mẹ dặn bạn phơi quần áo nhưng bạn mải chơi game nên quên mất...',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Mẹ',
        text: 'Mẹ dặn con ở nhà phơi quần áo mà giờ này vẫn nằm trong máy giặt thế kia? Lại mải bấm điện thoại đúng không?',
        mood: 'angry',
        choices: [
          { text: 'Con đang dở việc xíu, tí nữa con phơi sau có sao đâu!', nextNodeId: 'node_2a', deltaHoaHop: -30, deltaTuAi: 20 },
          { text: 'Ôi con quên mất! Mẹ đợi con một chút, con đi phơi ngay đây ạ.', nextNodeId: 'node_2b', deltaHoaHop: 20, deltaTuAi: -10 },
          { text: 'Trời chưa nắng mà mẹ, vội gì.', nextNodeId: 'node_2c', deltaHoaHop: -20, deltaTuAi: 15 },
        ]
      },
      node_2a: {
        id: 'node_2a',
        speaker: 'Mẹ',
        text: 'Quần áo để lâu trong máy nó hôi rình ra kìa. Suốt ngày chỉ cắm mặt vào điện thoại, không giúp được việc gì cả!',
        mood: 'angry',
        choices: [
          { text: 'Mẹ nói nhiều thế nhỉ, để đấy con phơi là được chứ gì!', nextNodeId: 'lose', deltaHoaHop: -40, deltaTuAi: 30 },
          { text: 'Dạ con xin lỗi. Con đi phơi đồ ngay và dọn dẹp lại phòng luôn ạ.', nextNodeId: 'win', deltaHoaHop: 25, deltaTuAi: -15 },
        ]
      },
      node_2b: {
        id: 'node_2b',
        speaker: 'Mẹ',
        text: 'Nhanh lên không hôi hết đồ. Lần sau làm xong việc rồi muốn làm gì thì làm, đừng để mẹ nhắc hoài.',
        mood: 'neutral',
        choices: [
          { text: 'Dạ vâng, con nhớ rồi ạ. Xong việc con lấy nước cho mẹ uống nha.', nextNodeId: 'win', deltaHoaHop: 30, deltaTuAi: -20 },
          { text: 'Mẹ dặn thế thì con biết thế, cứ cằn nhằn mãi.', nextNodeId: 'node_3a', deltaHoaHop: -20, deltaTuAi: 20 },
        ]
      },
      node_2c: {
        id: 'node_2c',
        speaker: 'Mẹ',
        text: 'Không nắng thì cũng phải phơi cho nó thoáng, con định để đến bao giờ? Lười biếng nó quen đi!',
        mood: 'angry',
        choices: [
          { text: 'Thì con đã bảo tí con phơi mà mẹ cứ ép.', nextNodeId: 'lose', deltaHoaHop: -40, deltaTuAi: 25 },
          { text: 'Dạ vâng con đi phơi ngay đây, mẹ đừng giận nữa nhé.', nextNodeId: 'win', deltaHoaHop: 20, deltaTuAi: -10 },
        ]
      },
      node_3a: {
        id: 'node_3a',
        speaker: 'Mẹ',
        text: 'Thái độ thế à? Làm sai mẹ nhắc mà còn cãi láo?',
        mood: 'angry',
        choices: [
          { text: '(Bỏ đi phơi đồ với thái độ vùng vằng)', nextNodeId: 'lose', deltaHoaHop: -30, deltaTuAi: 20 },
          { text: 'Dạ thôi con sai rồi, con xin lỗi mẹ.', nextNodeId: 'win', deltaHoaHop: 20, deltaTuAi: -10 },
        ]
      }
    }
  }
];

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export function ThuocDoCamXucSimulation({ onBack }: Props) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [hoaHop, setHoaHop] = useState(50);
  const [tuAi, setTuAi] = useState(20);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const currentScenario = SCENARIOS.find(s => s.id === selectedScenarioId);
  const currentNode = currentScenario ? currentScenario.nodes[currentNodeId] : null;

  const handleChoice = (nextNodeId: string, dH: number, dT: number) => {
    let newHoaHop = Math.min(100, Math.max(0, hoaHop + dH));
    let newTuAi = Math.min(100, Math.max(0, tuAi + dT));

    setHoaHop(newHoaHop);
    setTuAi(newTuAi);

    if (newHoaHop <= 0 || nextNodeId === 'lose') {
      setIsGameOver(true);
    } else if (newHoaHop >= 100 || nextNodeId === 'win') {
      setIsWin(true);
    } else {
      setCurrentNodeId(nextNodeId);
    }
  };

  const restart = () => {
    setCurrentNodeId('start');
    setHoaHop(50);
    setTuAi(20);
    setIsGameOver(false);
    setIsWin(false);
  };

  const goBackToMenu = () => {
    setSelectedScenarioId(null);
    setCurrentNodeId('start');
    setHoaHop(50);
    setTuAi(20);
    setIsGameOver(false);
    setIsWin(false);
  };

  // Colors for progress bars
  const hoaHopColor = hoaHop > 70 ? 'bg-emerald-500' : hoaHop > 30 ? 'bg-amber-500' : 'bg-rose-500';
  const tuAiColor = tuAi > 70 ? 'bg-rose-500' : tuAi > 30 ? 'bg-orange-500' : 'bg-blue-500';

  // Character Portrait Helper
  const renderPortrait = (mood: string) => {
    let emoji = '😐';
    let gradient = 'from-slate-700 to-slate-800';
    if (mood === 'angry') { emoji = '😠'; gradient = 'from-rose-700 to-red-900'; }
    if (mood === 'happy') { emoji = '😊'; gradient = 'from-emerald-600 to-teal-800'; }
    if (mood === 'sad') { emoji = '😞'; gradient = 'from-blue-700 to-slate-800'; }

    return (
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        key={mood}
        className={`w-48 h-64 rounded-2xl bg-linear-to-br ${gradient} border-4 border-slate-800 flex items-center justify-center shadow-2xl relative overflow-hidden shrink-0`}
      >
        <span className="text-8xl">{emoji}</span>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop)' }} />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-slate-900/50" />

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 z-10">
        <button onClick={selectedScenarioId ? goBackToMenu : onBack} className="p-2 hover:bg-slate-800/80 rounded-full transition-colors text-slate-300 hover:text-white backdrop-blur-md">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg text-white">Thước Đo Cảm Xúc Gia Đình</h1>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex flex-col p-6 max-w-5xl mx-auto w-full">
        
        {!selectedScenarioId ? (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Chọn Tình Huống</h2>
              <p className="text-slate-400">Khám phá cách giao tiếp và ứng xử trong các tình huống gia đình thường gặp.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SCENARIOS.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 hover:border-indigo-500 cursor-pointer transition-all shadow-xl"
                >
                  <h3 className="text-xl font-bold text-indigo-400 mb-3">{scenario.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{scenario.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Status Bars */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 font-bold text-emerald-400"><HeartPulse className="w-5 h-5" /> Sự Hòa Hợp</span>
                  <span className="text-sm text-slate-400">{hoaHop}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className={`h-full ${hoaHopColor}`} initial={{ width: 0 }} animate={{ width: `${hoaHop}%` }} transition={{ type: 'spring' }} />
                </div>
              </div>
              
              <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 font-bold text-rose-400"><Flame className="w-5 h-5" /> Sự Tự Ái</span>
                  <span className="text-sm text-slate-400">{tuAi}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className={`h-full ${tuAiColor}`} initial={{ width: 0 }} animate={{ width: `${tuAi}%` }} transition={{ type: 'spring' }} />
                </div>
              </div>
            </div>

            {/* Visual Novel Area */}
            <div className="flex-1 flex flex-col justify-end pb-8">
              
              {/* Game Over / Win State */}
              <AnimatePresence>
                {isGameOver && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 p-8 rounded-3xl border border-rose-500/50 text-center max-w-md">
                      <Flame className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-bounce" />
                      <h2 className="text-3xl font-bold text-rose-400 mb-2">Xung đột bùng nổ!</h2>
                      <p className="text-slate-300 mb-6">Thái độ của bạn đã đẩy mâu thuẫn lên đỉnh điểm. Hãy nhớ rằng, trong giao tiếp với gia đình, sự thấu cảm và nhận lỗi sẽ giúp xoa dịu cơn giận.</p>
                      <button onClick={restart} className="px-6 py-3 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-colors">
                        <RotateCcw className="w-5 h-5" /> Chơi lại tình huống này
                      </button>
                      <button onClick={goBackToMenu} className="mt-4 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-colors text-slate-200">
                        Chọn tình huống khác
                      </button>
                    </div>
                  </motion.div>
                )}

                {isWin && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-500/50 text-center max-w-md">
                      <PartyPopper className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                      <h2 className="text-3xl font-bold text-emerald-400 mb-2">Tuyệt vời!</h2>
                      <p className="text-slate-300 mb-6">Bạn đã xử lý tình huống rất khéo léo. Bằng cách thể hiện trách nhiệm và sự thấu hiểu, bạn không chỉ dập tắt xung đột mà còn làm gia đình gắn kết hơn.</p>
                      <button onClick={restart} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-colors">
                        <RotateCcw className="w-5 h-5" /> Trải nghiệm lại
                      </button>
                      <button onClick={goBackToMenu} className="mt-4 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-colors text-slate-200">
                        Chọn tình huống khác
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Scene */}
              {!isGameOver && !isWin && currentNode && (
                <div className="w-full flex gap-8 items-end">
                  {renderPortrait(currentNode.mood)}

                  <div className="flex-1 flex flex-col gap-6">
                    {/* Dialogue Box */}
                    <motion.div 
                      key={`dialogue-${currentNodeId}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 rounded-2xl p-6 shadow-2xl relative"
                    >
                      {/* Speaker Tag */}
                      <div className="absolute -top-4 left-6 bg-indigo-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                        {currentNode.speaker}
                      </div>
                      <p className="text-xl text-slate-100 leading-relaxed pt-2">
                        {currentNode.text}
                      </p>
                    </motion.div>

                    {/* Choices */}
                    <div className="flex flex-col gap-3">
                      {currentNode.choices.map((choice, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02, x: 10 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChoice(choice.nextNodeId, choice.deltaHoaHop, choice.deltaTuAi)}
                          className="text-left w-full bg-slate-900/80 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500/50 backdrop-blur-md p-4 rounded-xl text-slate-200 hover:text-white transition-all shadow-lg"
                        >
                          {choice.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}

