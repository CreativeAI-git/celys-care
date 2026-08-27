/**
 * Universal WAV Soundscape Generator for iOS, Android & Web
 * Generates lossless 16-bit PCM WAV audio loops playable via HTML5 Audio
 * Bypasses iOS hardware silent switch and WebAudio suspension bugs
 */

/**
 * Encode raw float PCM samples into a standard 16-bit stereo/mono WAV Blob
 */
function encodeWavBlob(samplesLeft: Float32Array, samplesRight: Float32Array, sampleRate: number = 44100): Blob {
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
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Write interleaved 16-bit PCM samples with clipping protection
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Left channel
    let sL = Math.max(-1, Math.min(1, samplesLeft[i]));
    let intL = sL < 0 ? sL * 0x8000 : sL * 0x7fff;
    view.setInt16(offset, intL, true);
    offset += 2;

    // Right channel
    let sR = Math.max(-1, Math.min(1, samplesRight[i]));
    let intR = sR < 0 ? sR * 0x8000 : sR * 0x7fff;
    view.setInt16(offset, intR, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// In-memory cache of generated soundscape WAV URLs
const soundscapeUrlCache: { [key: string]: string } = {};

/**
 * Generate high quality seamless audio loop for any soundscape type
 */
export function getSoundscapeAudioUrl(type: string): string {
  if (soundscapeUrlCache[type]) {
    return soundscapeUrlCache[type];
  }

  const sampleRate = 44100;
  let duration = 6.0; // 6 seconds seamless loop
  if (type === "piano" || type === "bowls") duration = 8.0;

  const numSamples = Math.floor(sampleRate * duration);
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);

  if (type === "ocean") {
    // Ocean waves with swell filter & stereo drift
    let b0L = 0, b1L = 0, b2L = 0;
    let b0R = 0, b1R = 0, b2R = 0;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Wave swell envelope (slow undulating breathing rhythm)
      const swell = (Math.sin((2 * Math.PI * t) / duration) * 0.5 + 0.5) * 0.7 + 0.3;
      
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;

      // Brown noise integration
      b0L = (b0L + 0.02 * whiteL) / 1.02;
      b1L = (b1L + 0.03 * b0L) / 1.03;
      b2L = (b2L + 0.05 * b1L) / 1.05;

      b0R = (b0R + 0.02 * whiteR) / 1.02;
      b1R = (b1R + 0.03 * b0R) / 1.03;
      b2R = (b2R + 0.05 * b1R) / 1.05;

      left[i] = b2L * 4.5 * swell;
      right[i] = b2R * 4.5 * swell;
    }
  } else if (type === "rain") {
    // Forest rain with gentle droplet high-pass pink noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < numSamples; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.09;
      b6 = w * 0.115926;

      // Rain droplet scatter
      const drop = Math.random() < 0.0015 ? (Math.random() * 2 - 1) * 0.4 : 0;

      left[i] = (pink + drop) * 0.65;
      right[i] = (pink - drop) * 0.65;
    }
  } else if (type === "bowls") {
    // Tibetan Singing Bowls (432Hz fundamental with rich resonant harmonic overtone envelope)
    const baseFreq = 432;
    const harmonics = [
      { freq: baseFreq, gain: 0.45 },
      { freq: baseFreq * 1.5, gain: 0.22 }, // 648Hz
      { freq: baseFreq * 2.0, gain: 0.12 }, // 864Hz
      { freq: baseFreq * 2.76, gain: 0.08 }, // 1192Hz
    ];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      // Gentle shimmer pulse
      const pulse = 1.0 + 0.15 * Math.sin(2 * Math.PI * 0.25 * t);

      for (const h of harmonics) {
        sample += Math.sin(2 * Math.PI * h.freq * t) * h.gain * pulse;
      }

      left[i] = sample * 0.65;
      right[i] = sample * 0.65;
    }
  } else if (type === "piano") {
    // Gentle Piano Celestial chords (Cmaj9 arpeggiated ambient soothing progression)
    const notes = [261.63, 329.63, 392.0, 493.88, 523.25]; // C4, E4, G4, B4, C5
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      for (let n = 0; n < notes.length; n++) {
        const noteTime = (t + n * 1.2) % duration;
        const decay = Math.exp(-noteTime * 1.2);
        sample += Math.sin(2 * Math.PI * notes[n] * t) * 0.15 * decay;
        // Warm sub-harmonic
        sample += Math.sin(2 * Math.PI * (notes[n] / 2) * t) * 0.08 * decay;
      }
      left[i] = sample * 0.8;
      right[i] = sample * 0.8;
    }
  } else if (type === "528hz") {
    // 528Hz Miracle & Transformation Solfeggio frequency + binaural theta beat (6Hz diff)
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const leftSine = Math.sin(2 * Math.PI * 528 * t) * 0.4 + Math.sin(2 * Math.PI * 264 * t) * 0.18;
      const rightSine = Math.sin(2 * Math.PI * 534 * t) * 0.4 + Math.sin(2 * Math.PI * 264 * t) * 0.18;
      left[i] = leftSine * 0.7;
      right[i] = rightSine * 0.7;
    }
  } else {
    // White / Calm Ambient Noise
    for (let i = 0; i < numSamples; i++) {
      const n = (Math.random() * 2 - 1) * 0.15;
      left[i] = n;
      right[i] = n;
    }
  }

  // Crossfade boundary (first/last 2000 samples) for click-free 100% seamless infinite loop
  const fadeLen = 2000;
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

  const blob = encodeWavBlob(left, right, sampleRate);
  const blobUrl = URL.createObjectURL(blob);
  soundscapeUrlCache[type] = blobUrl;
  return blobUrl;
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
