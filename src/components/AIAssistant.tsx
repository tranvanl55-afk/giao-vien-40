import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiClient } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  contextTitle?: string;
  contextDescription?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export function AIAssistant({ contextTitle = 'Khoa học tự nhiên', contextDescription = '' }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref to hold the chat session object from GenAI
  const chatSessionRef = useRef<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize chat session when opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initChat();
    }
  }, [isOpen, contextTitle]);

  const initChat = async () => {
    try {
      const client = getGeminiClient();
      
      const systemInstruction = `Bạn là một trợ giảng AI thân thiện, chuyên môn cao về Khoa học tự nhiên (Vật lý, Hóa học, Sinh học).
Người dùng hiện đang học/chơi phần: "${contextTitle}".
Mô tả nội dung phần học: "${contextDescription}".
Hãy trả lời ngắn gọn, súc tích, dễ hiểu đối với học sinh cấp 2. Nếu người dùng hỏi ngoài lề, hãy khéo léo dẫn dắt họ quay lại bài học. Trình bày bằng tiếng Việt.`;

      // For @google/genai, we use client.chats.create
      const chat = client.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });
      
      chatSessionRef.current = chat;

      // Add initial greeting
      setMessages([
        {
          id: '1',
          role: 'model',
          content: `Chào bạn! 👋 Mình là Trợ giảng AI. Bạn đang xem bài **${contextTitle}**. Bạn có câu hỏi nào về phần này không?`
        }
      ]);
    } catch (error) {
      console.error('Lỗi khởi tạo AI:', error);
      setMessages([
        {
          id: '1',
          role: 'model',
          content: 'Xin lỗi, hệ thống AI đang gặp sự cố kết nối. Vui lòng thử lại sau.'
        }
      ]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        await initChat();
      }

      const response = await chatSessionRef.current.sendMessage({
         message: userMessage
      });
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        content: response.text || 'Tôi không thể trả lời câu hỏi này.'
      }]);
    } catch (error) {
      console.error('Lỗi gửi tin nhắn AI:', error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        content: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-28 right-6 md:bottom-32 md:right-8 w-14 h-14 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center z-50 text-white border border-cyan-400/30 group"
          >
            <Bot className="w-7 h-7 group-hover:animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-bounce"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'inset-4 md:inset-10 rounded-3xl' 
                : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[90vw] md:w-[400px] h-[550px] max-h-[85vh] rounded-3xl'
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-linear-to-r from-slate-800 to-slate-900 border-b border-slate-700 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Bot className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                    Trợ giảng AI
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  </h3>
                  <p className="text-[10px] text-cyan-400 font-semibold truncate max-w-[200px]">
                    Hỗ trợ: {contextTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors hidden md:block"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-linear-to-br from-cyan-600 to-blue-600 text-white rounded-br-sm' 
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm prose prose-invert prose-sm prose-p:my-1 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-800/50 border-t border-slate-700 shrink-0">
              <div className="flex items-center gap-2 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder="Hỏi trợ giảng AI..."
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-400 outline-none transition-all"
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[9px] text-slate-500">AI có thể đưa ra thông tin chưa chính xác. Vui lòng kiểm tra lại.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
