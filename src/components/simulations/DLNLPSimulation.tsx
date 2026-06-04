import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, RefreshCw, Play, Pause, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Sample sentences for attention visualization
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_SENTENCES = [
  { text: 'Con mèo đang ngủ trên chiếc ghế', highlight: 2 },
  { text: 'AI học từ rất nhiều văn bản trên internet', highlight: 0 },
  { text: 'Transformer là nền tảng của ChatGPT và GPT-4', highlight: 3 },
  { text: 'Ngôn ngữ tự nhiên rất phức tạp và đa nghĩa', highlight: 1 },
];

const NLP_CONCEPTS = [
  {
    id: 'tokenization',
    title: 'Token hóa (Tokenization)',
    icon: '🔤',
    color: 'from-blue-600 to-cyan-500',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    desc: 'Chia văn bản thành các đơn vị nhỏ (token): từ, ký tự, hoặc subword.',
    example: ['Con', 'mèo', 'đang', 'ngủ', 'trên', 'chiếc', 'ghế'],
  },
  {
    id: 'embedding',
    title: 'Nhúng từ (Word Embedding)',
    icon: '📐',
    color: 'from-purple-600 to-violet-500',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    desc: 'Chuyển đổi mỗi token thành một vector số học, từ tương tự nhau sẽ gần nhau trong không gian vector.',
    example: ['mèo', 'chó', 'vật nuôi'],
  },
  {
    id: 'attention',
    title: 'Cơ chế chú ý (Attention)',
    icon: '👁️',
    color: 'from-amber-600 to-orange-500',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    desc: 'Mỗi từ "nhìn" vào các từ khác trong câu để hiểu ngữ cảnh. "nó" trong câu sẽ chú ý nhiều hơn vào danh từ liên quan.',
    example: [],
  },
  {
    id: 'generation',
    title: 'Sinh văn bản (Generation)',
    icon: '✨',
    color: 'from-emerald-600 to-teal-500',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    desc: 'Model dự đoán từ tiếp theo dựa trên xác suất, lặp lại cho đến khi tạo ra câu hoàn chỉnh.',
    example: [],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Attention weight simulation
// ─────────────────────────────────────────────────────────────────────────────

function generateAttentionMatrix(tokens: string[], queryIdx: number): number[][] {
  const n = tokens.length;
  // Create attention weights - random but biased
  return Array.from({ length: n }, (_, qi) => {
    const weights = Array.from({ length: n }, (_, ki) => {
      // Simulate positional and semantic attention patterns
      const dist = Math.abs(qi - ki);
      const base = Math.exp(-dist * 0.4); // nearby tokens get more attention
      const selfAttn = qi === ki ? 0.8 : 0; // high self-attention
      return base + selfAttn + Math.random() * 0.3;
    });
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum); // softmax-like normalization
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Text generation simulation
// ─────────────────────────────────────────────────────────────────────────────

const GENERATION_PROMPTS = [
  { prompt: 'Trí tuệ nhân tạo là', continuation: ['một', 'lĩnh', 'vực', 'của', 'khoa', 'học', 'máy', 'tính', 'giúp', 'máy', 'móc', 'học', 'hỏi', 'và', 'suy', 'luận', 'như', 'con', 'người.'] },
  { prompt: 'Deep Learning có thể', continuation: ['phân', 'tích', 'hình', 'ảnh,', 'hiểu', 'ngôn', 'ngữ', 'và', 'tạo', 'ra', 'nội', 'dung', 'sáng', 'tạo', 'từ', 'dữ', 'liệu', 'lớn.'] },
  { prompt: 'Transformer được thiết kế', continuation: ['để', 'xử', 'lý', 'các', 'chuỗi', 'văn', 'bản', 'song', 'song,', 'nhanh', 'hơn', 'RNN', 'rất', 'nhiều', 'lần.'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Semantic space 2D simulation
// ─────────────────────────────────────────────────────────────────────────────

const SEMANTIC_WORDS = [
  { word: 'vua', x: 25, y: 30, group: 0 },
  { word: 'hoàng hậu', x: 40, y: 30, group: 0 },
  { word: 'nam', x: 20, y: 45, group: 0 },
  { word: 'nữ', x: 45, y: 45, group: 0 },
  { word: 'mèo', x: 70, y: 25, group: 1 },
  { word: 'chó', x: 75, y: 40, group: 1 },
  { word: 'thú cưng', x: 80, y: 30, group: 1 },
  { word: 'AI', x: 25, y: 70, group: 2 },
  { word: 'robot', x: 38, y: 75, group: 2 },
  { word: 'máy tính', x: 30, y: 60, group: 2 },
  { word: 'học máy', x: 45, y: 65, group: 2 },
  { word: 'Paris', x: 68, y: 65, group: 3 },
  { word: 'Pháp', x: 78, y: 60, group: 3 },
  { word: 'London', x: 72, y: 75, group: 3 },
  { word: 'Anh', x: 82, y: 72, group: 3 },
];

const GROUP_COLORS = ['#3b82f6', '#10b981', '#f97316', '#a855f7'];

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────="────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

type ActiveTab = 'attention' | 'generation' | 'embedding';

export function DLNLPSimulation({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('attention');
  const [selectedSentence, setSelectedSentence] = useState(0);
  const [queryToken, setQueryToken] = useState(0);
  const [attentionMatrix, setAttentionMatrix] = useState<number[][]>([]);
  const [hoveredPair, setHoveredPair] = useState<{ q: number; k: number } | null>(null);

  // Generation state
  const [genPromptIdx, setGenPromptIdx] = useState(0);
  const [genWords, setGenWords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const genIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const tokens = useMemo(() => {
    const sentence = SAMPLE_SENTENCES[selectedSentence];
    return sentence.text.split(' ');
  }, [selectedSentence]);

  useEffect(() => {
    setAttentionMatrix(generateAttentionMatrix(tokens, queryToken));
    setQueryToken(0);
  }, [selectedSentence, tokens]);

  const handleSentenceChange = (idx: number) => {
    setSelectedSentence(idx);
    setQueryToken(0);
  };

  const handleTokenClick = (idx: number) => {
    setQueryToken(idx);
    setAttentionMatrix(generateAttentionMatrix(tokens, idx));
  };

  // Generation
  const startGeneration = () => {
    if (isGenerating) {
      if (genIntervalRef.current) clearInterval(genIntervalRef.current);
      setIsGenerating(false);
      return;
    }
    setGenWords([]);
    setIsGenerating(true);
    const words = GENERATION_PROMPTS[genPromptIdx].continuation;
    let idx = 0;
    genIntervalRef.current = setInterval(() => {
      if (idx >= words.length) {
        clearInterval(genIntervalRef.current!);
        setIsGenerating(false);
        return;
      }
      setGenWords(prev => [...prev, words[idx]]);
      idx++;
    }, 350);
  };

  useEffect(() => {
    setGenWords([]);
    setIsGenerating(false);
    if (genIntervalRef.current) clearInterval(genIntervalRef.current);
  }, [genPromptIdx]);

  useEffect(() => () => { if (genIntervalRef.current) clearInterval(genIntervalRef.current); }, []);

  const TAB_META: Record<ActiveTab, { label: string; icon: React.ReactNode; color: string }> = {
    attention: { label: 'Cơ chế Attention', icon: <Sparkles className="w-4 h-4" />, color: 'amber' },
    generation: { label: 'Sinh văn bản', icon: <MessageSquare className="w-4 h-4" />, color: 'emerald' },
    embedding: { label: 'Word Embedding', icon: <Zap className="w-4 h-4" />, color: 'purple' },
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden font-sans text-slate-100 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-rose-900/15 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Sidebar */}
      <div className="w-full md:w-76 h-auto md:h-full bg-slate-900/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col z-10 shrink-0 overflow-y-auto">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-rose-400 transition-colors mb-6 w-fit group">
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-rose-500/20 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
          <span className="font-bold text-sm">Quay lại</span>
        </button>

        <div className="flex items-center space-x-2.5 mb-1">
          <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400"><MessageSquare className="w-5 h-5" /></div>
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Deep Learning</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">Xử Lý Ngôn Ngữ (NLP)</h1>
        <p className="text-slate-400 text-xs leading-relaxed mb-5">
          Khám phá cơ chế bên trong ChatGPT và GPT-4: từ Tokenization → Embedding → Self-Attention → Text Generation.
        </p>

        {/* Concept cards */}
        <div className="space-y-2">
          {NLP_CONCEPTS.map(c => (
            <div key={c.id} className={`rounded-xl p-3 border ${c.border} ${c.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{c.icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${c.text}`}>{c.title}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col p-4 md:p-6 relative z-10 gap-4 overflow-y-auto">
        {/* Tab navigation */}
        <div className="flex gap-2 bg-slate-900/60 border border-white/10 rounded-2xl p-1.5">
          {(Object.keys(TAB_META) as ActiveTab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === tab ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
              {TAB_META[tab].icon}
              <span>{TAB_META[tab].label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════ TAB: ATTENTION ═══════════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === 'attention' && (
            <motion.div key="attention" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col gap-4">
              {/* Sentence selector */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Chọn câu văn</p>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_SENTENCES.map((s, i) => (
                    <button key={i} onClick={() => handleSentenceChange(i)}
                      className={`py-2 px-3 rounded-xl text-[10.5px] font-medium border transition-all text-left cursor-pointer ${selectedSentence === i ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}>
                      "{s.text}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-4">
                {/* Token selector + attention weights */}
                <div className="flex-1 bg-slate-900/40 border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">
                      Nhấp vào từ để xem nó "chú ý" đến những từ nào
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tokens.map((tok, idx) => (
                        <button key={idx} onClick={() => handleTokenClick(idx)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all border cursor-pointer ${queryToken === idx ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'}`}>
                          {tok}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Attention weights bar chart */}
                  {attentionMatrix[queryToken] && (
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">
                        Trọng số chú ý của "<span className="text-amber-400">{tokens[queryToken]}</span>"
                      </p>
                      <div className="space-y-2">
                        {tokens.map((tok, ki) => {
                          const weight = attentionMatrix[queryToken]?.[ki] ?? 0;
                          return (
                            <div key={ki} className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 font-medium w-20 text-right shrink-0">{tok}</span>
                              <div className="flex-1 bg-slate-800/60 rounded-full h-4 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${weight * 100}%` }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                  className="h-full rounded-full"
                                  style={{ background: `linear-gradient(to right, rgba(245,158,11,${0.3 + weight * 0.7}), rgba(234,179,8,${weight * 0.9}))` }}
                                />
                              </div>
                              <span className="text-[10px] text-amber-400 font-bold w-10">{(weight * 100).toFixed(0)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Attention heatmap */}
                <div className="w-full md:w-72 bg-slate-900/40 border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ma trận Attention (Self-Attention)</p>
                  <div className="flex-1 flex items-center justify-center">
                    {attentionMatrix.length > 0 && (
                      <div className="w-full">
                        {/* Row labels (queries) */}
                        <div className="flex mb-1">
                          <div className="w-14" />
                          {tokens.map((tok, ki) => (
                            <div key={ki} className="flex-1 text-center text-[7px] text-slate-600 font-bold truncate">{tok.slice(0, 3)}</div>
                          ))}
                        </div>
                        {attentionMatrix.map((row, qi) => (
                          <div key={qi} className="flex items-center mb-0.5">
                            <div className="w-14 text-[8px] text-slate-500 font-bold text-right pr-2 truncate">{tokens[qi]}</div>
                            {row.map((weight, ki) => {
                              const alpha = Math.round(weight * 200 + 30);
                              const isActive = queryToken === qi;
                              return (
                                <div key={ki}
                                  onMouseEnter={() => setHoveredPair({ q: qi, k: ki })}
                                  onMouseLeave={() => setHoveredPair(null)}
                                  onClick={() => handleTokenClick(qi)}
                                  className="flex-1 aspect-square rounded-sm mx-px cursor-pointer transition-all"
                                  style={{
                                    backgroundColor: `rgba(245,158,11,${weight.toFixed(2)})`,
                                    outline: isActive ? '1px solid rgba(245,158,11,0.6)' : 'none',
                                    transform: hoveredPair?.q === qi && hoveredPair?.k === ki ? 'scale(1.3)' : 'scale(1)',
                                  }}
                                  title={`${tokens[qi]} → ${tokens[ki]}: ${(weight * 100).toFixed(1)}%`}
                                />
                              );
                            })}
                          </div>
                        ))}
                        <div className="mt-2 flex items-center gap-2 justify-center">
                          <div className="flex gap-0.5">
                            {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
                              <div key={v} className="w-4 h-2 rounded-sm" style={{ backgroundColor: `rgba(245,158,11,${v})` }} />
                            ))}
                          </div>
                          <span className="text-[8px] text-slate-600">Thấp → Cao</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════ TAB: GENERATION ═══════════════════════════════ */}
          {activeTab === 'generation' && (
            <motion.div key="generation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col gap-4">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Chọn câu đầu vào (Prompt)</p>
                <div className="flex flex-col gap-2">
                  {GENERATION_PROMPTS.map((p, i) => (
                    <button key={i} onClick={() => setGenPromptIdx(i)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all text-left cursor-pointer ${genPromptIdx === i ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}>
                      <span className="text-emerald-400 font-bold">Prompt:</span> {p.prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generation display */}
              <div className="flex-1 bg-slate-900/40 border border-white/10 rounded-3xl p-6 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-300 uppercase tracking-wider">Mô phỏng sinh văn bản</p>
                    <p className="text-[10px] text-slate-500">Mỗi token được sinh ra lần lượt dựa trên xác suất dự đoán</p>
                  </div>
                </div>

                {/* Text display */}
                <div className="flex-1 bg-slate-950/60 border border-white/5 rounded-2xl p-6 min-h-32">
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Prompt tokens */}
                    {GENERATION_PROMPTS[genPromptIdx].prompt.split(' ').map((w, i) => (
                      <span key={i} className="text-lg font-semibold text-slate-300">{w}</span>
                    ))}
                    {/* Generated tokens */}
                    <AnimatePresence>
                      {genWords.map((w, i) => (
                        <motion.span key={i}
                          initial={{ opacity: 0, y: 8, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="text-lg font-semibold text-emerald-300">
                          {w}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    {/* Blinking cursor */}
                    {isGenerating && (
                      <span className="w-0.5 h-6 bg-emerald-400 animate-pulse rounded-full" />
                    )}
                  </div>
                </div>

                {/* Token probability bars */}
                {genWords.length > 0 && !isGenerating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-950/60 border border-white/5 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Phân phối xác suất token tiếp theo (giả lập)</p>
                    <div className="grid grid-cols-4 gap-2">
                      {['[END]', '!', 'nhanh', 'trong', 'và', 'để', 'hơn', 'bằng'].map((tok, i) => {
                        const prob = i === 0 ? 0.62 : Math.random() * 0.15;
                        return (
                          <div key={tok} className="flex flex-col items-center gap-1">
                            <div className="w-full bg-slate-800 rounded-full h-16 flex items-end overflow-hidden">
                              <div className="w-full rounded-t-full transition-all" style={{ height: `${prob * 100}%`, backgroundColor: i === 0 ? '#10b981' : '#475569' }} />
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold">{tok}</span>
                            <span className="text-[9px] text-slate-600">{(prob * 100).toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button onClick={startGeneration}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${isGenerating ? 'bg-rose-600/80 border-rose-500/40 text-white' : 'bg-emerald-600 border-emerald-500/40 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}>
                    {isGenerating ? <><Pause className="w-4 h-4" /> Dừng</> : <><Play className="w-4 h-4 fill-white" /> Sinh văn bản</>}
                  </button>
                  <button onClick={() => { setGenWords([]); setIsGenerating(false); if (genIntervalRef.current) clearInterval(genIntervalRef.current); }}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 font-bold transition-all cursor-pointer">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════ TAB: EMBEDDING ═══════════════════════════════ */}
          {activeTab === 'embedding' && (
            <motion.div key="embedding" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col gap-4">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4">
                <p className="text-sm font-bold text-slate-300">Không gian Embedding 2D</p>
                <p className="text-[10px] text-slate-500 mt-1">Các từ có nghĩa tương tự nhau sẽ nằm gần nhau trong không gian vector. Quan hệ "vua - nam = hoàng hậu - nữ" được bảo toàn trong toán học.</p>
              </div>

              <div className="flex-1 bg-slate-900/40 border border-white/10 rounded-3xl p-4 flex flex-col gap-4">
                {/* 2D Semantic Space */}
                <div className="flex-1 bg-slate-950/60 border border-white/5 rounded-2xl relative overflow-hidden min-h-64">
                  <div className="absolute inset-2">
                    {/* Grid */}
                    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                      <defs>
                        <pattern id="embed-grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#embed-grid)" />
                    </svg>

                    {/* Word points */}
                    {SEMANTIC_WORDS.map((word, i) => {
                      const color = GROUP_COLORS[word.group];
                      return (
                        <motion.div key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                          className="absolute flex flex-col items-center gap-1 cursor-default"
                          style={{ left: `${word.x}%`, top: `${word.y}%`, transform: 'translate(-50%, -50%)' }}>
                          <div className="w-3 h-3 rounded-full border-2 border-white/30 shadow-lg"
                            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}88` }} />
                          <span className="text-[9px] font-bold text-center whitespace-nowrap px-1.5 py-0.5 rounded-md"
                            style={{ color, backgroundColor: `${color}22`, border: `1px solid ${color}44` }}>
                            {word.word}
                          </span>
                        </motion.div>
                      );
                    })}

                    {/* Analogy arrow: vua - nam + nữ = hoàng hậu */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {['vua', 'hoàng hậu'].map((w1, idx) => {
                        const from = SEMANTIC_WORDS.find(w => w.word === w1)!;
                        const to = SEMANTIC_WORDS.find(w => w.word === (idx === 0 ? 'nam' : 'nữ'))!;
                        return (
                          <line key={w1}
                            x1={`${from.x}%`} y1={`${from.y}%`}
                            x2={`${to.x}%`} y2={`${to.y}%`}
                            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Giới tính & quyền lực', color: GROUP_COLORS[0] },
                    { label: 'Động vật', color: GROUP_COLORS[1] },
                    { label: 'Công nghệ AI', color: GROUP_COLORS[2] },
                    { label: 'Địa danh châu Âu', color: GROUP_COLORS[3] },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                      <span className="text-[10px] text-slate-400 font-medium">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Analogy insight */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2">✨ Phép toán từ (Word Analogy)</p>
                  <p className="text-sm font-mono text-white">
                    <span className="text-blue-400">vua</span>
                    <span className="text-slate-400"> − </span>
                    <span className="text-blue-300">nam</span>
                    <span className="text-slate-400"> + </span>
                    <span className="text-blue-300">nữ</span>
                    <span className="text-slate-400"> ≈ </span>
                    <span className="text-amber-400">hoàng hậu</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">Vector hóa từ cho phép thực hiện phép toán ngữ nghĩa giống như số học!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
