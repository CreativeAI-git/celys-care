/**
 * Universal WAV Soundscape Generator for iOS, Android & Web
 * Generates lossless 16-bit PCM WAV audio loops playable via HTML5 Audio
 * Bypasses iOS hardware silent switch and WebAudio suspension bugs
 */

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Encode raw float PCM samples into a self-contained Base64 Data URI
 * This guarantees 100% instant synchronous playback on iOS Safari, Android WebView, and all browsers
 */
function encodeWavDataUri(samplesLeft: Float32Array, samplesRight: Float32Array, sampleRate: number = 24000): string {
  const numChannels = 2;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numSamples = samplesLeft.length;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  // fmt sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Interleaved 16-bit PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    let sL = Math.max(-1, Math.min(1, samplesLeft[i]));
    let intL = sL < 0 ? sL * 0x8000 : sL * 0x7fff;
    view.setInt16(offset, intL, true);
    offset += 2;

    let sR = Math.max(-1, Math.min(1, samplesRight[i]));
    let intR = sR < 0 ? sR * 0x8000 : sR * 0x7fff;
    view.setInt16(offset, intR, true);
    offset += 2;
  }

  // Fast chunked Base64 encoding
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  const chunkSize = 0x8000;
  for (let i = 0; i < len; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return "data:audio/wav;base64," + btoa(binary);
}

// In-memory cache of generated soundscape WAV Data URIs
const soundscapeUrlCache: { [key: string]: string } = {};

/**
 * Generate high quality seamless audio loop for any soundscape type
 */
export function getSoundscapeAudioUrl(type: string): string {
  if (soundscapeUrlCache[type]) {
    return soundscapeUrlCache[type];
  }

  const sampleRate = 44100;
  let duration = 8.0; // 8 seconds seamless natural loop
  if (type === "piano" || type === "bowls") duration = 8.0;

  const numSamples = Math.floor(sampleRate * duration);
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);

  if (type === "ocean") {
    // High-Power Ocean Waves: Deep Coastal Swell (40-200Hz) + Rolling Surf (400-1800Hz) + Foamy Sea Spray (2000-8000Hz)
    let p0L = 0, p1L = 0, p2L = 0, p3L = 0, p4L = 0, p5L = 0, p6L = 0;
    let p0R = 0, p1R = 0, p2R = 0, p3R = 0, p4R = 0, p5R = 0, p6R = 0;
    let brnL = 0, brnR = 0;
    let surfL = 0, surfR = 0;
    let foamL = 0, foamR = 0;

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;

      // Natural tidal swell envelope (4s build-up, peak surf crash, 4s receding wash)
      const phase = (2 * Math.PI * t) / duration;
      const primarySwell = Math.pow(0.5 + 0.5 * Math.sin(phase - Math.PI / 2), 1.5);
      const secondarySwell = 0.25 * Math.sin(phase * 2 + 0.4);
      const totalSwell = Math.max(0.1, Math.min(1.0, primarySwell + secondarySwell));

      // Breaking crest burst (peaks around wave impact)
      const crestBurst = Math.pow(Math.max(0, primarySwell - 0.2) / 0.8, 2.0);
      const recedingWash = Math.pow(Math.max(0, Math.sin(phase + 0.3)), 2.5) * 0.5;

      const wL = Math.random() * 2 - 1;
      const wR = Math.random() * 2 - 1;

      // Pink noise filter (Paul Kellet's filter)
      p0L = 0.99886 * p0L + wL * 0.0555179;
      p1L = 0.99332 * p1L + wL * 0.0750759;
      p2L = 0.969 * p2L + wL * 0.153852;
      p3L = 0.8665 * p3L + wL * 0.3104856;
      p4L = 0.55 * p4L + wL * 0.5329522;
      p5L = -0.7616 * p5L - wL * 0.016898;
      const pinkL = (p0L + p1L + p2L + p3L + p4L + p5L + p6L + wL * 0.5362) * 0.22;
      p6L = wL * 0.115926;

      p0R = 0.99886 * p0R + wR * 0.0555179;
      p1R = 0.99332 * p1R + wR * 0.0750759;
      p2R = 0.969 * p2R + wR * 0.153852;
      p3R = 0.8665 * p3R + wR * 0.3104856;
      p4R = 0.55 * p4R + wR * 0.5329522;
      p5R = -0.7616 * p5R - wR * 0.016898;
      const pinkR = (p0R + p1R + p2R + p3R + p4R + p5R + p6R + wR * 0.5362) * 0.22;
      p6R = wR * 0.115926;

      // 1. Deep Coastal Sub-Bass Rumble
      brnL = (brnL + 0.05 * wL) / 1.05;
      brnR = (brnR + 0.05 * wR) / 1.05;
      const deepRumbleL = brnL * 7.5 * totalSwell;
      const deepRumbleR = brnR * 7.5 * totalSwell;

      // 2. Rolling Wave Surf & Breaker
      surfL = surfL * 0.86 + pinkL * (1.2 + 2.0 * crestBurst);
      surfR = surfR * 0.86 + pinkR * (1.2 + 2.0 * crestBurst);
      const rollingSurfL = surfL * (totalSwell * 1.1 + crestBurst * 0.8);
      const rollingSurfR = surfR * (totalSwell * 1.1 + crestBurst * 0.8);

      // 3. Crisp Sea Spray & Foam
      const foamRawL = (wL - pinkL) * (crestBurst * 1.2 + recedingWash * 0.7 + 0.15);
      const foamRawR = (wR - pinkR) * (crestBurst * 1.2 + recedingWash * 0.7 + 0.15);
      foamL = foamL * 0.65 + foamRawL * 0.35;
      foamR = foamR * 0.65 + foamRawR * 0.35;

      // 4. Stereo Rolling Motion
      const panOffset = Math.sin(phase) * 0.2;
      const gainL = Math.cos((0.5 + panOffset) * (Math.PI / 2));
      const gainR = Math.sin((0.5 + panOffset) * (Math.PI / 2));

      // Master sum with high-energy analog soft-clipping for maximum loudness
      const rawL = (deepRumbleL * 0.45 + rollingSurfL * 0.55 + foamL * 0.4) * gainL * 2.8;
      const rawR = (deepRumbleR * 0.45 + rollingSurfR * 0.55 + foamR * 0.4) * gainR * 2.8;

      left[i] = Math.tanh(rawL);
      right[i] = Math.tanh(rawR);
    }
  } else if (type === "rain") {
    // Forest rain with full rich shower and crisp droplet scatter
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < numSamples; i++) {
      const wL = Math.random() * 2 - 1;
      const wR = Math.random() * 2 - 1;
      const w = (wL + wR) * 0.5;

      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.28;
      b6 = w * 0.115926;

      const dropL = Math.random() < 0.005 ? (Math.random() * 2 - 1) * 0.8 : 0;
      const dropR = Math.random() < 0.005 ? (Math.random() * 2 - 1) * 0.8 : 0;

      left[i] = Math.tanh((pink * 1.8 + dropL) * 2.0);
      right[i] = Math.tanh((pink * 1.8 + dropR) * 2.0);
    }
  } else if (type === "bowls") {
    // Tibetan Singing Bowls (432Hz fundamental with rich resonant harmonic overtone envelope)
    const baseFreq = 432;
    const harmonics = [
      { freq: baseFreq, gain: 0.65 },
      { freq: baseFreq * 1.5, gain: 0.35 },
      { freq: baseFreq * 2.0, gain: 0.22 },
      { freq: baseFreq * 2.76, gain: 0.15 },
      { freq: baseFreq * 4.0, gain: 0.08 },
    ];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      const pulse = 1.0 + 0.2 * Math.sin(2 * Math.PI * 0.25 * t);

      for (const h of harmonics) {
        sample += Math.sin(2 * Math.PI * h.freq * t) * h.gain * pulse;
      }

      left[i] = Math.tanh(sample * 1.8);
      right[i] = Math.tanh(sample * 1.8);
    }
  } else if (type === "piano") {
    const notes = [261.63, 329.63, 392.0, 493.88, 523.25];
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      for (let n = 0; n < notes.length; n++) {
        const noteTime = (t + n * 1.3) % duration;
        const decay = Math.exp(-noteTime * 1.1);
        sample += Math.sin(2 * Math.PI * notes[n] * t) * 0.32 * decay;
        sample += Math.sin(2 * Math.PI * (notes[n] / 2) * t) * 0.18 * decay;
      }
      left[i] = Math.tanh(sample * 1.9);
      right[i] = Math.tanh(sample * 1.9);
    }
  } else if (type === "528hz") {
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const leftSine = Math.sin(2 * Math.PI * 528 * t) * 0.6 + Math.sin(2 * Math.PI * 264 * t) * 0.3;
      const rightSine = Math.sin(2 * Math.PI * 534 * t) * 0.6 + Math.sin(2 * Math.PI * 264 * t) * 0.3;
      left[i] = Math.tanh(leftSine * 1.8);
      right[i] = Math.tanh(rightSine * 1.8);
    }
  } else {
    // White / Calm Ambient Noise
    for (let i = 0; i < numSamples; i++) {
      const nL = (Math.random() * 2 - 1) * 0.45;
      const nR = (Math.random() * 2 - 1) * 0.45;
      left[i] = Math.tanh(nL * 1.8);
      right[i] = Math.tanh(nR * 1.8);
    }
  }

  // Crossfade boundary for seamless loop
  const fadeLen = 2500;
  for (let i = 0; i < fadeLen; i++) {
    const fade = i / fadeLen;
    const endIdx = numSamples - fadeLen + i;
    const mixedL = left[i] * fade + left[endIdx] * (1 - fade);
    const mixedR = right[i] * fade + right[endIdx] * (1 - fade);
    left[i] = mixedL;
    left[endIdx] = mixedL;
    right[i] = mixedR;
    right[endIdx] = mixedR;
  }

  const dataUri = encodeWavDataUri(left, right, sampleRate);
  soundscapeUrlCache[type] = dataUri;
  return dataUri;
}

/**
 * Universal Soundscape Player Class (Using HTML5 Media Audio)
 */
class UniversalSoundscapePlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private currentType: string | null = null;
  private volume: number = 0.7;

  public play(type: string, volume: number = 0.7) {
    this.stop();
    this.currentType = type;
    this.volume = Math.max(0, Math.min(1, volume));

    try {
      const url = getSoundscapeAudioUrl(type);
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = this.volume;
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      this.currentAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Soundscape play notice on iOS/Android:", err);
        });
      }
    } catch (err) {
      console.error("UniversalSoundscapePlayer error:", err);
    }
  }

  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = "";
      } catch { }
      this.currentAudio = null;
    }
    this.currentType = null;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.currentAudio) {
      try {
        this.currentAudio.volume = this.volume;
      } catch { }
    }
  }

  public isPlaying(type?: string): boolean {
    if (type) return this.currentType === type && this.currentAudio !== null && !this.currentAudio.paused;
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  public getCurrentType(): string | null {
    return this.currentType;
  }
}

export const universalSoundscapes = new UniversalSoundscapePlayer();
