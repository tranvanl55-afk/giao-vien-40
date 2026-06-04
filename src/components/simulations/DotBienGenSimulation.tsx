import React, { useState } from 'react';
import { ArrowLeft, Info, RotateCcw, ChevronRight } from 'lucide-react';

type MutationType = 'delete' | 'insert' | 'replace';
type NuType = 'A' | 'T' | 'G' | 'X';

const COMPLEMENTS: Record<NuType, NuType> = { A: 'T', T: 'A', G: 'X', X: 'G' };
const MRNA_MAP: Record<NuType, string> = { A: 'U', T: 'A', G: 'X', X: 'G' };

const CODON_TABLE: Record<string, string> = {
  AUG: 'Met (Khởi đầu)', UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu', AUU: 'Ile', AUC: 'Ile',
  AUA: 'Ile', GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val', UCU: 'Ser',
  UCC: 'Ser', UCA: 'Ser', UCG: 'Ser', CCU: 'Pro', CCC: 'Pro', CCA: 'Pro',
  CCG: 'Pro', ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr', GCU: 'Ala',
  GCC: 'Ala', GCA: 'Ala', GCG: 'Ala', UAU: 'Tyr', UAC: 'Tyr', UAA: '🔴STOP',
  UAG: '🔴STOP', CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln', AAU: 'Asn',
  AAC: 'Asn', AAA: 'Lys', AAG: 'Lys', GAU: 'Asp', GAC: 'Asp', GAA: 'Glu',
  GAG: 'Glu', UGU: 'Cys', UGC: 'Cys', UGA: '🔴STOP', UGG: 'Trp', CGU: 'Arg',
  CGC: 'Arg', CGA: 'Arg', CGG: 'Arg', AGU: 'Ser', AGC: 'Ser', AGA: 'Arg',
  AGG: 'Arg', GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
};

const NU_COLORS: Record<NuType, string> = {
  A: '#ef4444', T: '#3b82f6', G: '#22c55e', X: '#f59e0b',
};

const ORIGINAL_STRAND: NuType[] = ['A', 'T', 'G', 'G', 'T', 'A', 'X', 'T', 'A'];

function getComplement(strand: NuType[]): NuType[] { return strand.map(n => COMPLEMENTS[n]); }
function getMRNA(template: NuType[]): string[] { return template.map(n => MRNA_MAP[n]); }
function getProtein(mrna: string[]): string[] {
  const codons: string[] = [];
  for (let i = 0; i + 2 < mrna.length; i += 3) {
    codons.push(mrna[i] + mrna[i + 1] + mrna[i + 2]);
  }
  return codons.map(c => CODON_TABLE[c] || '???');
}

const NucleoBase = ({ nu, highlight, small }: { nu: NuType; highlight?: boolean; small?: boolean }) => (
  <div className={`flex items-center justify-center rounded font-black border transition-all ${small ? 'w-7 h-7 text-[11px]' : 'w-9 h-9 text-xs'} ${highlight ? 'scale-110 shadow-lg ring-2 ring-white/60' : ''}`}
    style={{ backgroundColor: NU_COLORS[nu] + '40', borderColor: NU_COLORS[nu], color: NU_COLORS[nu] }}>
    {nu}
  </div>
);

const MRNABase = ({ b, highlight }: { b: string; highlight?: boolean }) => {
  const color = b === 'U' ? '#a78bfa' : b === 'A' ? '#ef4444' : b === 'X' ? '#f59e0b' : '#22c55e';
  return (
    <div className={`flex items-center justify-center rounded w-9 h-7 text-[11px] font-black border transition-all ${highlight ? 'scale-110 ring-2 ring-white/40' : ''}`}
      style={{ backgroundColor: color + '30', borderColor: color, color }}>
      {b}
    </div>
  );
};

export function DotBienGenSimulation({ onBack }: { onBack: () => void }) {
  const [strand, setStrand] = useState<NuType[]>([...ORIGINAL_STRAND]);
  const [mutationType, setMutationType] = useState<MutationType>('replace');
  const [mutatePos, setMutatePos] = useState(3);
  const [replaceNu, setReplaceNu] = useState<NuType>('X');
  const [insertNu, setInsertNu] = useState<NuType>('G');
  const [mutationApplied, setMutationApplied] = useState(false);
  const [changedPositions, setChangedPositions] = useState<number[]>([]);

  const complement = getComplement(strand);
  const mRNA = getMRNA(complement);
  const protein = getProtein(mRNA);

  const origComplement = getComplement(ORIGINAL_STRAND);
  const origMRNA = getMRNA(origComplement);
  const origProtein = getProtein(origMRNA);

  const applyMutation = () => {
    let newStrand = [...strand];
    const changed: number[] = [];

    if (mutationType === 'delete') {
      if (newStrand.length > 3) {
        newStrand.splice(mutatePos, 1);
        for (let i = mutatePos; i < newStrand.length; i++) changed.push(i);
      }
    } else if (mutationType === 'insert') {
      newStrand.splice(mutatePos, 0, insertNu);
      changed.push(mutatePos);
      for (let i = mutatePos + 1; i < newStrand.length; i++) changed.push(i);
    } else {
      newStrand[mutatePos] = replaceNu;
      changed.push(mutatePos);
    }
    setStrand(newStrand);
    setChangedPositions(changed);
    setMutationApplied(true);
  };

  const reset = () => {
    setStrand([...ORIGINAL_STRAND]);
    setChangedPositions([]);
    setMutationApplied(false);
  };

  const changedCodons = changedPositions.map(p => Math.floor(p / 3));

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 cursor-pointer transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-sm font-black text-white uppercase flex items-center gap-2">🧬 Đột Biến Gen</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khoa học tự nhiên lớp 9</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-xs font-bold cursor-pointer transition-all">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* Left: DNA visualization */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          {/* DNA Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">🧬 Chuỗi ADN (Mạch gốc → Mạch bổ sung)</h3>

            {/* Mạch gốc */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-400 w-24">Mạch gốc (3'→5'):</span>
              <div className="flex gap-1">
                {strand.map((nu, i) => (
                  <NucleoBase key={i} nu={nu} highlight={changedPositions.includes(i)} />
                ))}
              </div>
            </div>

            {/* Bond lines */}
            <div className="flex ml-24 gap-1 my-0.5">
              {strand.map((_, i) => (
                <div key={i} className="w-9 flex justify-center">
                  <div className="w-0.5 h-3 bg-slate-600" />
                </div>
              ))}
            </div>

            {/* Mạch bổ sung */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 w-24">Bổ sung (5'→3'):</span>
              <div className="flex gap-1">
                {complement.map((nu, i) => (
                  <NucleoBase key={i} nu={nu} highlight={changedPositions.includes(i)} />
                ))}
              </div>
            </div>

            {/* Codon markers */}
            <div className="flex ml-24 gap-1 mt-3">
              {Array.from({ length: Math.floor(strand.length / 3) }).map((_, ci) => (
                <div key={ci} className={`flex gap-1 border-b-2 rounded-b px-0.5 ${changedCodons.includes(ci) ? 'border-red-500' : 'border-slate-700'}`}>
                  {[0, 1, 2].map(j => (
                    <div key={j} className="w-9 text-center text-[9px] text-slate-500">
                      {ci * 3 + j + 1}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* mRNA Section */}
          <div className="bg-purple-950/20 border border-purple-800/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ChevronRight className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-black uppercase text-purple-400 tracking-wider">Phiên mã → mARN (5'→3')</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 w-14">mARN:</span>
              <div className="flex gap-1 flex-wrap">
                {mRNA.map((b, i) => (
                  <MRNABase key={i} b={b} highlight={changedPositions.includes(i)} />
                ))}
              </div>
            </div>

            {/* Codon labels */}
            <div className="flex ml-14 gap-1 mt-2 flex-wrap">
              {Array.from({ length: Math.floor(mRNA.length / 3) }).map((_, ci) => (
                <div key={ci} className={`px-1 py-0.5 rounded text-[9px] font-bold border ${changedCodons.includes(ci) ? 'border-red-500/60 text-red-400 bg-red-950/30' : 'border-slate-700 text-slate-500'}`}>
                  {mRNA.slice(ci * 3, ci * 3 + 3).join('')}
                </div>
              ))}
            </div>
          </div>

          {/* Protein Section */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ChevronRight className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider">Dịch mã → Chuỗi Protein</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              {protein.map((aa, i) => (
                <div key={i} className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${changedCodons.includes(i) ? 'border-red-500 bg-red-950/40 text-red-300 ring-1 ring-red-500/50' : 'border-amber-800/40 bg-amber-950/20 text-amber-200'} ${aa.includes('STOP') ? 'border-red-600 bg-red-900/50' : ''}`}>
                  {aa}
                </div>
              ))}
            </div>

            {/* Comparison with original */}
            {mutationApplied && (
              <div className="mt-3 p-3 bg-slate-950/40 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">So với protein gốc:</p>
                <div className="flex gap-2 flex-wrap">
                  {origProtein.map((aa, i) => (
                    <div key={i} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${protein[i] !== aa ? 'bg-red-900/40 text-red-300 border border-red-700' : 'bg-slate-800 text-slate-400'}`}>
                      {aa}
                    </div>
                  ))}
                </div>
                {protein.join(',') !== origProtein.join(',') && (
                  <div className="mt-2 flex items-start gap-2 bg-red-950/30 rounded-xl p-2 border border-red-800/40">
                    <span className="text-red-400 text-sm">⚠️</span>
                    <p className="text-[11px] text-red-300">Đột biến đã làm thay đổi chuỗi protein! Protein bị lỗi có thể mất chức năng hoặc gây bệnh.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full lg:w-72 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">⚡ Loại đột biến</h3>
            {[
              { type: 'replace', label: '🔄 Thay thế cặp Nu', desc: 'Thay một Nu này bằng Nu khác' },
              { type: 'delete', label: '❌ Mất cặp Nu', desc: 'Xóa bỏ một Nu khỏi mạch' },
              { type: 'insert', label: '➕ Thêm cặp Nu', desc: 'Chèn thêm một Nu vào mạch' },
            ].map(({ type, label, desc }) => (
              <button key={type} onClick={() => setMutationType(type as MutationType)}
                className={`w-full p-3 rounded-xl border text-left mb-2 cursor-pointer transition-all ${mutationType === type ? 'border-red-500 bg-red-950/30' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'}`}>
                <p className="text-xs font-bold text-white">{label}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </button>
            ))}
          </div>

          {/* Position */}
          <div className="bg-slate-800/60 rounded-2xl p-4">
            <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-300">📍 Vị trí ({mutatePos + 1})</span></div>
            <input type="range" min={0} max={strand.length - 1} value={Math.min(mutatePos, strand.length - 1)}
              onChange={e => setMutatePos(Number(e.target.value))} className="w-full cursor-pointer" />
          </div>

          {/* Nucleotide selector */}
          {mutationType === 'replace' && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Thay bằng</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(['A', 'T', 'G', 'X'] as NuType[]).map(nu => (
                  <button key={nu} onClick={() => setReplaceNu(nu)}
                    className={`py-2 rounded-xl font-black text-sm cursor-pointer border transition-all ${replaceNu === nu ? 'ring-2 ring-white/50' : ''}`}
                    style={{ backgroundColor: NU_COLORS[nu] + '30', borderColor: NU_COLORS[nu], color: NU_COLORS[nu] }}>{nu}</button>
                ))}
              </div>
            </div>
          )}

          {mutationType === 'insert' && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Chèn nu</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(['A', 'T', 'G', 'X'] as NuType[]).map(nu => (
                  <button key={nu} onClick={() => setInsertNu(nu)}
                    className={`py-2 rounded-xl font-black text-sm cursor-pointer border transition-all ${insertNu === nu ? 'ring-2 ring-white/50' : ''}`}
                    style={{ backgroundColor: NU_COLORS[nu] + '30', borderColor: NU_COLORS[nu], color: NU_COLORS[nu] }}>{nu}</button>
                ))}
              </div>
            </div>
          )}

          <button onClick={applyMutation}
            className="py-3 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-2xl font-black text-sm cursor-pointer transition-all shadow-lg shadow-red-900/30 text-white">
            ⚡ Gây đột biến!
          </button>

          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-2">📚 Các loại đột biến gen</h3>
            <div className="space-y-1 text-[11px] text-amber-200">
              <p>• <strong>Thay thế:</strong> ít ảnh hưởng nhất (đột biến đồng nghĩa)</p>
              <p>• <strong>Mất/thêm:</strong> nguy hiểm nhất, gây lệch khung đọc, đổi toàn bộ protein!</p>
            </div>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-3">
            <div className="flex items-start gap-2"><Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200">Thử gây đột biến mất/thêm nu ở đầu mạch để thấy hiệu ứng lệch khung đọc toàn bộ!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
