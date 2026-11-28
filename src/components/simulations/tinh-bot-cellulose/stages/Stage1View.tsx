/* cSpell:disable */
import React from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Eye,
  EyeOff,
  Award,
  Lock,
  Unlock,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import {
  type CrosswordClue,
  PADLET_URL,
  CROSSWORD_CLUES,
  FULL_KEYWORD_LETTERS,
  KEYWORD_WORD_1,
  KEYWORD_WORD_2,
} from '../lessonData';
import { LockedTaskBox } from '../components/LockedTaskBox';

interface Stage1ViewProps {
  guideBanner: React.ReactNode;
  isReviewMode: boolean;
  unlockedTaskIds: Set<string>;
  unlockTask: (id: string) => void;
  lockTask: (id: string) => void;
  showPadletEmbed: boolean;
  setShowPadletEmbed: React.Dispatch<React.SetStateAction<boolean>>;
  teamNameInput: string;
  setTeamNameInput: React.Dispatch<React.SetStateAction<string>>;
  padletConfirmed: boolean;
  setPadletConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  unlockedClueIds: Set<string>;
  setUnlockedClueIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  clueInputs: Record<string, string>;
  setClueInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  solvedClueIds: Set<string>;
  clueFeedback: { text: string; isCorrect: boolean } | null;
  handleCheckClue: (clue: CrosswordClue) => void;
  placedKeywordSlots: Set<number>;
  usedTileIndices: Set<number>;
  activeKeywordSlot: number | null;
  setActiveKeywordSlot: React.Dispatch<React.SetStateAction<number | null>>;
  draggedTileIdx: number | null;
  setDraggedTileIdx: React.Dispatch<React.SetStateAction<number | null>>;
  dragOverSlotIdx: number | null;
  setDragOverSlotIdx: React.Dispatch<React.SetStateAction<number | null>>;
  unlockedPoolTileIndices: number[];
  handlePlaceLetter: (tileIdx: number, slotIdx: number) => void;
  isKeywordComplete: boolean;
  padletUrl?: string;
  isNextStageUnlocked: boolean;
  onNextStage: () => void;
}

export function Stage1View({
  guideBanner,
  isReviewMode,
  unlockedTaskIds,
  unlockTask,
  lockTask,
  showPadletEmbed,
  setShowPadletEmbed,
  teamNameInput,
  setTeamNameInput,
  padletConfirmed,
  setPadletConfirmed,
  unlockedClueIds,
  setUnlockedClueIds,
  clueInputs,
  setClueInputs,
  solvedClueIds,
  clueFeedback,
  handleCheckClue,
  placedKeywordSlots,
  usedTileIndices,
  activeKeywordSlot,
  setActiveKeywordSlot,
  draggedTileIdx,
  setDraggedTileIdx,
  dragOverSlotIdx,
  setDragOverSlotIdx,
  unlockedPoolTileIndices,
  handlePlaceLetter,
  isKeywordComplete,
  padletUrl = PADLET_URL,
  isNextStageUnlocked,
  onNextStage,
}: Stage1ViewProps) {
  return (
<div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {guideBanner}
            {/* Bộ tiêu chí sản phẩm STEAM (Hoạt động 1 - CV 3089/BGDĐT-GDTrH) */}
            <div className="bg-white/90 border border-emerald-200 rounded-2xl p-3.5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-emerald-900 uppercase">
                  🎯 Nhiệm vụ &amp; Bộ Tiêu chí Sản phẩm Xanh (CV 3089)
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Tái sinh từ Cellulose &amp; Tinh bột
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-medium text-indigo-950">
                <div className="bg-emerald-50/70 rounded-xl px-3 py-2 border border-emerald-100">
                  <strong>1. Khoa học (Bài 30):</strong> Tận dụng sợi cellulose (bã mía, rơm, giấy vụn) &amp; hồ tinh bột kết dính sinh học.
                </div>
                <div className="bg-sky-50/70 rounded-xl px-3 py-2 border border-sky-100">
                  <strong>2. Kỹ thuật &amp; Độ bền:</strong> Có quy trình 4 bước định lượng (g / ml); sản phẩm dai, giữ phom, không rã khi tưới nhẹ.
                </div>
                <div className="bg-amber-50/70 rounded-xl px-3 py-2 border border-amber-100">
                  <strong>3. Sinh thái &amp; An toàn:</strong> 100% nguyên liệu tự phân hủy, an toàn, tích hợp hạt giống nảy mầm tốt.
                </div>
                <div className="bg-purple-50/70 rounded-xl px-3 py-2 border border-purple-100">
                  <strong>4. Thẩm mỹ &amp; Chi phí:</strong> Tạo hình sáng tạo, tiết kiệm, có bao bì/nhãn thông điệp sống xanh.
                </div>
              </div>
            </div>
            <LockedTaskBox
              taskId="task-s1-padlet"
              badgeText="Chặng 1 • Nhiệm vụ 1"
              title="Tạo lập nhóm trên Padlet: Cellulose - bắt đầu từ sự kết thúc"
              emoji="👥"
              isUnlocked={unlockedTaskIds.has('task-s1-padlet')}
              isCompleted={padletConfirmed}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={padletUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center gap-2 shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở Padlet tạo nhóm</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowPadletEmbed((v) => !v)}
                    className="px-4 py-2.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {showPadletEmbed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPadletEmbed ? 'Ẩn Padlet' : 'Nhúng Padlet tại đây'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    placeholder="Tên nhóm..."
                    aria-label="Tên nhóm"
                    className="px-3.5 py-2 rounded-full bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 font-bold focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPadletConfirmed(true)}
                    className={`px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer ${padletConfirmed ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                      }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{padletConfirmed ? 'Đã lập nhóm' : 'Xác nhận'}</span>
                  </button>
                </div>
              </div>

              {showPadletEmbed && (
                <div className="w-full rounded-2xl overflow-hidden border border-indigo-200 bg-white">
                  <iframe
                    src={padletUrl}
                    title="Padlet Cellulose - bắt đầu từ sự kết thúc"
                    className="w-full h-125 border-0 bg-white"
                    allow="camera;microphone;geolocation"
                  />
                </div>
              )}
            </LockedTaskBox>

            <LockedTaskBox
              taskId="task-s1-crossword"
              badgeText="Chặng 1 • Nhiệm vụ 2"
              title="Trò chơi Khởi động: Vượt 6 Thử thách — Ghép Chữ cái tìm Từ khóa Bí ẩn"
              emoji="🧩"
              isUnlocked={unlockedTaskIds.has('task-s1-crossword')}
              isCompleted={isKeywordComplete}
              onUnlock={unlockTask}
              onLock={lockTask}
            >
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase text-indigo-950">
                    🔑 Kéo chữ cái đã mở thả vào các ô &ldquo;?&rdquo; bên dưới (hoặc chọn ô số {activeKeywordSlot + 1} rồi bấm chữ) • Đã ghép {placedKeywordSlots.size}/{FULL_KEYWORD_LETTERS.length}:
                  </span>
                  {isReviewMode && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-black">
                      💡 Đáp án từ khóa: GREEN NEWSPAPER
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {KEYWORD_WORD_1.map((char, idx) => {
                      const placed = placedKeywordSlots.has(idx);
                      const isDragOver = dragOverSlotIdx === idx && !placed;
                      return (
                        <button
                          key={`w1-${idx}`}
                          type="button"
                          onClick={() => setActiveKeywordSlot(idx)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (!placed) setDragOverSlotIdx(idx);
                          }}
                          onDragLeave={() => setDragOverSlotIdx((prev) => (prev === idx ? null : prev))}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverSlotIdx(null);
                            const rawIdx = e.dataTransfer.getData('text/plain');
                            const tileIdx = rawIdx !== '' ? Number(rawIdx) : draggedTileIdx;
                            if (tileIdx !== null && !Number.isNaN(tileIdx)) {
                              handlePlaceLetter(tileIdx, idx);
                            }
                            setDraggedTileIdx(null);
                          }}
                          className={`w-8 h-10 rounded-lg border-2 font-black text-sm flex flex-col items-center justify-center cursor-pointer transition-all ${placed
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : isDragOver
                              ? 'bg-amber-200 text-orange-900 border-orange-500 scale-110 ring-2 ring-orange-400'
                              : activeKeywordSlot === idx
                                ? 'bg-orange-100 text-orange-700 border-orange-500 ring-2 ring-orange-400/40'
                                : 'bg-white text-indigo-300 border-indigo-200'
                            }`}
                        >
                          <span>{placed ? char : '?'}</span>
                          <span className="text-[8px] opacity-75">{idx + 1}</span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="font-black text-indigo-300 hidden md:inline">•</span>

                  <div className="flex flex-wrap gap-1">
                    {KEYWORD_WORD_2.map((char, idx) => {
                      const slotIdx = idx + KEYWORD_WORD_1.length;
                      const placed = placedKeywordSlots.has(slotIdx);
                      const isDragOver = dragOverSlotIdx === slotIdx && !placed;
                      return (
                        <button
                          key={`w2-${slotIdx}`}
                          type="button"
                          onClick={() => setActiveKeywordSlot(slotIdx)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (!placed) setDragOverSlotIdx(slotIdx);
                          }}
                          onDragLeave={() => setDragOverSlotIdx((prev) => (prev === slotIdx ? null : prev))}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverSlotIdx(null);
                            const rawIdx = e.dataTransfer.getData('text/plain');
                            const tileIdx = rawIdx !== '' ? Number(rawIdx) : draggedTileIdx;
                            if (tileIdx !== null && !Number.isNaN(tileIdx)) {
                              handlePlaceLetter(tileIdx, slotIdx);
                            }
                            setDraggedTileIdx(null);
                          }}
                          className={`w-8 h-10 rounded-lg border-2 font-black text-sm flex flex-col items-center justify-center cursor-pointer transition-all ${placed
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : isDragOver
                              ? 'bg-amber-200 text-orange-900 border-orange-500 scale-110 ring-2 ring-orange-400'
                              : activeKeywordSlot === slotIdx
                                ? 'bg-orange-100 text-orange-700 border-orange-500 ring-2 ring-orange-400/40'
                                : 'bg-white text-indigo-300 border-indigo-200'
                            }`}
                        >
                          <span>{placed ? char : '?'}</span>
                          <span className="text-[8px] opacity-75">{slotIdx + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {unlockedPoolTileIndices.length > 0 && !isKeywordComplete && (
                  <div className="bg-white/90 border border-indigo-200/80 rounded-xl p-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-black text-indigo-900 mr-1">
                      🧲 Kho chữ cái đã nhận (kéo thả lên ô &ldquo;?&rdquo;):
                    </span>
                    {unlockedPoolTileIndices.map((slotIdx) => {
                      const used = usedTileIndices.has(slotIdx);
                      return (
                        <button
                          key={`pool-${slotIdx}`}
                          type="button"
                          draggable={!used}
                          disabled={used}
                          onDragStart={(e) => {
                            setDraggedTileIdx(slotIdx);
                            e.dataTransfer.setData('text/plain', String(slotIdx));
                          }}
                          onDragEnd={() => {
                            setDraggedTileIdx(null);
                            setDragOverSlotIdx(null);
                          }}
                          onClick={() => handlePlaceLetter(slotIdx, activeKeywordSlot)}
                          className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center transition-all ${used
                            ? 'bg-slate-100 text-slate-400 line-through cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs cursor-grab active:cursor-grabbing hover:scale-105'
                            }`}
                          title={used ? 'Đã ghép' : 'Kéo thả vào ô từ khóa hoặc bấm để điền'}
                        >
                          {FULL_KEYWORD_LETTERS[slotIdx]}
                        </button>
                      );
                    })}
                  </div>
                )}

                {isKeywordComplete && (
                  <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-400 rounded-2xl p-4 flex flex-col gap-2 text-indigo-950 shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="flex flex-wrap items-center gap-2">
                      <Award className="w-6 h-6 text-orange-500 shrink-0" />
                      <span className="text-sm md:text-base font-black text-emerald-800">
                        🎉 CHÚC MỪNG! EM ĐÃ GIẢI MÃ THÀNH CÔNG TỪ KHÓA:
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm md:text-lg font-black">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500 text-white">
                        GREEN (Xanh / Sinh thái)
                      </span>
                      <span className="text-indigo-400">+</span>
                      <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white">
                        NEWSPAPER (Giấy báo / Ấn phẩm)
                      </span>
                      <span className="text-orange-500">➔</span>
                      <span className="px-3.5 py-1 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                        📰 GREEN NEWSPAPER (BÁO XANH / GIẤY TÁI SINH)
                      </span>
                    </div>
                    <div className="bg-white/90 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs md:text-sm font-bold text-indigo-950">
                      🇬🇧 <strong>Example:</strong> &ldquo;Students reuse old cellulose paper to create creative products from <span className="text-emerald-700 underline">green newspaper</span>.&rdquo;
                      <span className="block text-[11px] md:text-xs font-medium text-indigo-900/70 mt-0.5">
                        (Học sinh tái sử dụng giấy chứa cellulose cũ để sáng tạo các sản phẩm từ giấy báo xanh thân thiện môi trường.)
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-indigo-950/85 leading-relaxed">
                      💡 <strong>Ý nghĩa:</strong> <em>Green Newspaper (Báo xanh / Giấy báo tái sinh)</em> gắn liền với hành trình biến giấy báo cũ giàu <strong>Cellulose</strong> và hồ dán từ <strong>Tinh bột</strong> thành những sản phẩm xanh, truyền thông điệp bảo vệ môi trường &ldquo;Bắt đầu từ sự kết thúc&rdquo;!
                    </p>
                  </div>
                )}
              </div>

              {clueFeedback && (
                <div
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${clueFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-orange-50 border-orange-300 text-orange-900'
                    }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>{clueFeedback.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CROSSWORD_CLUES.map((clue) => {
                  const unlocked = unlockedClueIds.has(clue.id);
                  const solved = solvedClueIds.has(clue.id);
                  if (!unlocked) {
                    return (
                      <button
                        key={clue.id}
                        type="button"
                        onClick={() => setUnlockedClueIds((prev) => new Set(prev).add(clue.id))}
                        className="rounded-2xl p-3.5 bg-indigo-50/50 hover:bg-white border-2 border-dashed border-indigo-200 hover:border-orange-400 flex items-center justify-between gap-3 cursor-pointer text-left"
                      >
                        <span className="text-xs font-black text-indigo-950">
                          🔒 Thử thách {clue.rowNumber} {clue.rowNumber >= 5 ? '(English) ' : ''}({clue.unlockedSlots.length} chữ cái)
                        </span>
                        <span className="px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-xs">
                          Mở
                        </span>
                      </button>
                    );
                  }

                  return (
                    <div
                      key={clue.id}
                      className={`rounded-2xl p-3.5 border-2 flex flex-col justify-between gap-2.5 ${solved ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-indigo-100'
                        }`}
                    >
                      <p className="text-xs font-bold text-indigo-950">
                        <span className="text-orange-600 font-black">Thử thách {clue.rowNumber}: </span>
                        {clue.question}
                      </p>

                      {isReviewMode && !solved && (
                        <div className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
                          💡 Đáp án: {clue.answerDisplay}
                        </div>
                      )}

                      {solved ? (
                        <div className="flex items-center justify-between flex-wrap gap-1.5 bg-white p-2 rounded-xl border border-emerald-200">
                          <span className="text-xs font-black text-emerald-700">✓ {clue.answerDisplay}</span>
                          <div className="flex flex-wrap gap-1">
                            {clue.scrambledSlotOrder.map((slotIdx) => {
                              const used = usedTileIndices.has(slotIdx);
                              return (
                                <button
                                  key={`t-${slotIdx}`}
                                  type="button"
                                  draggable={!used}
                                  disabled={used}
                                  onDragStart={(e) => {
                                    setDraggedTileIdx(slotIdx);
                                    e.dataTransfer.setData('text/plain', String(slotIdx));
                                  }}
                                  onDragEnd={() => {
                                    setDraggedTileIdx(null);
                                    setDragOverSlotIdx(null);
                                  }}
                                  onClick={() => handlePlaceLetter(slotIdx, activeKeywordSlot)}
                                  className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center transition-all ${used
                                    ? 'bg-slate-100 text-slate-400 line-through cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs cursor-grab active:cursor-grabbing hover:scale-105'
                                    }`}
                                  title={used ? 'Đã ghép' : 'Kéo chữ cái này thả vào ô từ khóa'}
                                >
                                  {FULL_KEYWORD_LETTERS[slotIdx]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={clueInputs[clue.id] || ''}
                            onChange={(e) => setClueInputs((prev) => ({ ...prev, [clue.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheckClue(clue)}
                            placeholder={clue.hint}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs font-bold focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleCheckClue(clue)}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs cursor-pointer"
                          >
                            Gửi
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </LockedTaskBox>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onNextStage()}
                className={`px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer ${isNextStageUnlocked
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                  : 'bg-orange-50 text-orange-700 border border-dashed border-orange-300'
                  }`}
              >
                {isNextStageUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sang Chặng 2: Kiến thức nền</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
  );
}
