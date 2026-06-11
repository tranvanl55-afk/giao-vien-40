/**
 * useGameSounds – Web Audio API sound effects for all games.
 * No external files needed; all sounds are synthesized in-browser.
 */

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return _ctx;
}

// ─── Low-level helpers ────────────────────────────────────────────────────────

function playTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  gainPeak: number,
  startDelay = 0,
  ctx?: AudioContext
) {
  const c = ctx ?? getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + startDelay);
  gain.gain.setValueAtTime(0, c.currentTime + startDelay);
  gain.gain.linearRampToValueAtTime(gainPeak, c.currentTime + startDelay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startDelay + duration);
  osc.start(c.currentTime + startDelay);
  osc.stop(c.currentTime + startDelay + duration + 0.05);
}

function playNoise(duration: number, gainPeak: number, startDelay = 0) {
  const c = getCtx();
  const bufSize = c.sampleRate * duration;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
  const src = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1000;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(gainPeak, c.currentTime + startDelay);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startDelay + duration);
  src.start(c.currentTime + startDelay);
  src.stop(c.currentTime + startDelay + duration + 0.05);
}

// ─── Sound effects ────────────────────────────────────────────────────────────

export function soundClick() {
  try {
    const c = getCtx();
    playTone(600, 'sine', 0.08, 0.3, 0, c);
    playTone(900, 'sine', 0.05, 0.15, 0.04, c);
  } catch {}
}

export function soundNextQuestion() {
  try {
    const c = getCtx();
    // Ascending 3-note chime
    playTone(440, 'sine', 0.18, 0.35, 0, c);
    playTone(550, 'sine', 0.18, 0.35, 0.12, c);
    playTone(660, 'sine', 0.22, 0.4, 0.24, c);
  } catch {}
}

export function soundCorrect() {
  try {
    const c = getCtx();
    // Happy ascending arpeggio
    playTone(523, 'triangle', 0.2, 0.4, 0, c);    // C5
    playTone(659, 'triangle', 0.2, 0.4, 0.1, c);  // E5
    playTone(784, 'triangle', 0.2, 0.4, 0.2, c);  // G5
    playTone(1047, 'triangle', 0.3, 0.5, 0.32, c); // C6
  } catch {}
}

export function soundWrong() {
  try {
    const c = getCtx();
    // Descending buzzer
    playTone(300, 'sawtooth', 0.15, 0.3, 0, c);
    playTone(220, 'sawtooth', 0.15, 0.3, 0.12, c);
    playTone(150, 'sawtooth', 0.2, 0.35, 0.24, c);
  } catch {}
}

export function soundStart() {
  try {
    const c = getCtx();
    // Fanfare-like ascending sequence
    const notes = [330, 392, 440, 523, 659, 784];
    notes.forEach((freq, i) => {
      playTone(freq, 'triangle', 0.18, 0.45, i * 0.1, c);
    });
  } catch {}
}

export function soundEnd() {
  try {
    const c = getCtx();
    // Victory fanfare
    const melody = [
      { f: 523, d: 0.15 }, { f: 523, d: 0.15 }, { f: 523, d: 0.15 },
      { f: 523, d: 0.4 },  { f: 415, d: 0.4 },  { f: 466, d: 0.4 },
      { f: 523, d: 0.6 },
    ];
    let t = 0;
    melody.forEach(({ f, d }) => {
      playTone(f, 'triangle', d, 0.5, t, c);
      t += d + 0.02;
    });
    // Add some shimmer noise
    playNoise(0.15, 0.08, 0.1);
    playNoise(0.15, 0.08, 0.5);
    playNoise(0.2, 0.1, 1.0);
  } catch {}
}

export function soundTimeUp() {
  try {
    const c = getCtx();
    // Urgent beeping
    for (let i = 0; i < 3; i++) {
      playTone(880, 'square', 0.1, 0.3, i * 0.18, c);
    }
  } catch {}
}

export function soundTick() {
  try {
    playTone(1200, 'sine', 0.04, 0.15);
  } catch {}
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameSounds() {
  return {
    soundClick,
    soundNextQuestion,
    soundCorrect,
    soundWrong,
    soundStart,
    soundEnd,
    soundTimeUp,
    soundTick,
  };
}
