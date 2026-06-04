import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, User, AlertCircle, ShieldCheck } from 'lucide-react';

interface Props {
  onBack: () => void;
}

// ----------------------------------------------------------------------
// CHAT SCENARIO DATA
// ----------------------------------------------------------------------

type Message = {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
};

type ChatNode = {
  id: string;
  botMessage: string;
  choices: {
    text: string;
    nextNodeId: string | 'win' | 'lose';
    isAggressive?: boolean;
  }[];
};

const CHAT_TREE: Record<string, ChatNode> = {
  start: {
    id: 'start',
    botMessage: 'Ê mày, mày có thấy cái tút nặc danh chửi con Linh lớp mình trên trang confession trường không? Thấy bảo nó ăn cắp tiền quỹ lớp đấy, nhục mặt chưa 🤣',
    choices: [
      { text: 'Thật hả? Bọn mày chia sẻ link đi để tao vào bóc phốt cùng!', nextNodeId: 'node_2_aggro', isAggressive: true },
      { text: 'Chưa có bằng chứng rõ ràng mà, đừng vội tin tin đồn trên mạng.', nextNodeId: 'node_2_calm' },
      { text: 'Mày rảnh quá à mà đi lo chuyện bao đồng?', nextNodeId: 'node_2_aggro', isAggressive: true },
    ]
  },
  node_2_aggro: {
    id: 'node_2_aggro',
    botMessage: 'Sao mày lại nói thế? Tao đang kể cho mày nghe mà. Mày bênh nó à? Hay mày cũng hùa với nó lấy tiền?',
    choices: [
      { text: 'Mày bị điên à? Ăn nói hàm hồ tao tát cho vỡ mồm bây giờ!', nextNodeId: 'lose', isAggressive: true },
      { text: 'Tao không bênh ai cả, chỉ là chuyện chưa rõ ràng mình không nên lan truyền.', nextNodeId: 'node_3_calm' },
    ]
  },
  node_2_calm: {
    id: 'node_2_calm',
    botMessage: 'Bằng chứng gì nữa, ai cũng nói thế! Không có lửa làm sao có khói. Tao share bài lên nhóm lớp nhé?',
    choices: [
      { text: 'Đừng! Làm thế lỡ không phải sự thật thì con Linh tổn thương lắm. Cậu xóa bài đi.', nextNodeId: 'win' },
      { text: 'Tùy mày, tao không quan tâm.', nextNodeId: 'lose', isAggressive: true },
    ]
  },
  node_3_calm: {
    id: 'node_3_calm',
    botMessage: 'Nhưng mà nhiều người share lắm rồi. Tao thấy ghét nó lâu rồi, coi như dịp này cho nó bài học.',
    choices: [
      { text: 'Cho bài học kiểu mạng xã hội là bạo lực mạng đấy. Mình cứ bơ đi, để cô chủ nhiệm giải quyết.', nextNodeId: 'win' },
      { text: 'Ừ mày thích làm gì thì làm, tao chịu.', nextNodeId: 'lose', isAggressive: true },
    ]
  }
};

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export function XuLyKhungHoangSimulation({ onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'sys1', sender: 'system', text: 'Bạn vừa nhận được tin nhắn từ Hoàng (bạn cùng lớp).' }
  ]);
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial bot message
  useEffect(() => {
    const node = CHAT_TREE[currentNodeId];
    if (node && !isGameOver && !isWin) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: node.botMessage }]);
        setIsTyping(false);
      }, 1500); // Fake typing delay
      return () => clearTimeout(timer);
    }
  }, [currentNodeId, isGameOver, isWin]);

  const handleChoice = (choiceText: string, nextNodeId: string) => {
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: choiceText }]);
    
    if (nextNodeId === 'lose') {
      setTimeout(() => {
        setIsGameOver(true);
      }, 1000);
    } else if (nextNodeId === 'win') {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'bot', 
          text: 'Ừ mày nói cũng đúng... Tao nôn nóng quá. Cảm ơn mày đã nhắc nhở, để tao không share nữa.' 
        }]);
        setTimeout(() => setIsWin(true), 2000);
      }, 1500);
    } else {
      setCurrentNodeId(nextNodeId);
    }
  };

  const restart = () => {
    setMessages([{ id: 'sys1', sender: 'system', text: 'Bạn vừa nhận được tin nhắn từ Hoàng (bạn cùng lớp).' }]);
    setCurrentNodeId('start');
    setIsGameOver(false);
    setIsWin(false);
  };

  const currentNode = CHAT_TREE[currentNodeId];

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 z-10 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-md text-white">Hoàng (Lớp 9A)</h1>
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Đang hoạt động
          </p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col max-w-2xl mx-auto w-full bg-slate-900/50 border-x border-slate-800 shadow-2xl">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}
              >
                {msg.sender === 'system' && (
                  <div className="bg-slate-800/50 text-slate-400 text-xs px-3 py-1 rounded-full border border-slate-700">
                    {msg.text}
                  </div>
                )}
                
                {msg.sender === 'bot' && (
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-md border border-slate-700 leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}

                {msg.sender === 'user' && (
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-md leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && !isGameOver && !isWin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Reply Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          {!isTyping && !isGameOver && !isWin && currentNode && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
              <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider text-center">Chọn cách phản hồi:</p>
              {currentNode.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.text, choice.nextNodeId)}
                  className="w-full text-left bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white px-4 py-3 rounded-xl transition-all shadow-sm"
                >
                  {choice.text}
                </button>
              ))}
            </motion.div>
          )}

          {(isGameOver || isWin) && (
            <button onClick={restart} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors">
              Chơi Lại
            </button>
          )}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 z-20">
              <div className="bg-slate-900 p-8 rounded-3xl border border-rose-500/50 text-center max-w-md shadow-2xl">
                <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-rose-400 mb-2">Thất bại!</h2>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  Cách phản hồi của bạn mang tính kích động hoặc thờ ơ, góp phần tiếp tay cho bạo lực mạng lây lan. Hãy nhớ: Khi đối mặt với tin đồn ác ý, việc không hùa theo và can ngăn bạn bè là cách tốt nhất để bảo vệ môi trường học đường.
                </p>
                <button onClick={restart} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold transition-colors text-white w-full">
                  Thử Lại
                </button>
              </div>
            </motion.div>
          )}

          {isWin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 z-20">
              <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-500/50 text-center max-w-md shadow-2xl">
                <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-emerald-400 mb-2">Tuyệt vời!</h2>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  Bạn đã xử lý tình huống rất bản lĩnh. Bằng cách dùng lời lẽ bình tĩnh, thấu tình đạt lý, bạn đã ngăn chặn thành công một vụ bạo lực mạng và bảo vệ danh dự cho người bạn cùng lớp.
                </p>
                <button onClick={restart} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-colors text-white w-full">
                  Hoàn Thành
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
