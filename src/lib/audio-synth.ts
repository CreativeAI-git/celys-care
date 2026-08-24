"use client";

// Web Audio API procedural soundscape synthesizer for Celys Care
class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private activeNodes: { [key: string]: { stop: () => void } } = {};
  private currentTrack: string | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.6;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public unlockAudio() {
    try {
      const ctx = this.getContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    } catch {
      // ignore
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public playPopSound(pitch: number = 440) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.8, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);

      setTimeout(() => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      }, 150);
    } catch {
      // Audio might be blocked before first user gesture
    }
  }

  public playChime(note: number = 528) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note, ctx.currentTime);

      gain.gain.setValueAtTime(0.4 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      setTimeout(() => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      }, 1300);
    } catch {
      // ignore
    }
  }

  public startSoundscape(trackId: string) {
    this.stopSoundscape();
    const ctx = this.getContext();
    this.currentTrack = trackId;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    switch (trackId) {
      case "rain":
        this.createRainSound(ctx, this.masterGain);
        break;
      case "ocean":
        this.createOceanWaves(ctx, this.masterGain);
        break;
      case "bowls":
        this.createTibetanBowls(ctx, this.masterGain);
        break;
      case "binaural":
        this.createBinaural432(ctx, this.masterGain);
        break;
      case "celestial":
        this.createCelestialChords(ctx, this.masterGain);
        break;
      case "forest":
      default:
        this.createForestAmbience(ctx, this.masterGain);
        break;
    }
  }

  public stopSoundscape() {
    Object.values(this.activeNodes).forEach((node) => {
      try {
        node.stop();
      } catch {
        // ignore
      }
    });
    this.activeNodes = {};
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
    this.currentTrack = null;
  }

  public isPlaying(trackId?: string): boolean {
    if (trackId) return this.currentTrack === trackId;
    return this.currentTrack !== null;
  }

  public getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  // --- Ambient Generators ---

  private createRainSound(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    whiteNoise.start();

    this.activeNodes["rain"] = {
      stop: () => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch {}
      },
    };
  }

  private createOceanWaves(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(250, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noise.start();
    lfo.start();

    this.activeNodes["ocean"] = {
      stop: () => {
        try {
          noise.stop();
          lfo.stop();
          noise.disconnect();
          lfo.disconnect();
          lfoGain.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch {}
      },
    };
  }

  private createTibetanBowls(ctx: AudioContext, destination: GainNode) {
    const frequencies = [216, 432, 648];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq + (idx === 1 ? 0.5 : 0), ctx.currentTime);
      gain.gain.setValueAtTime(0.15 / (idx + 1), ctx.currentTime);

      osc.connect(gain);
      gain.connect(destination);
      osc.start();
      oscs.push(osc);
      gains.push(gain);
    });

    this.activeNodes["bowls"] = {
      stop: () => {
        oscs.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {}
        });
        gains.forEach((g) => {
          try {
            g.disconnect();
          } catch {}
        });
      },
    };
  }

  private createBinaural432(ctx: AudioContext, destination: GainNode) {
    const merger = ctx.createChannelMerger(2);

    const oscL = ctx.createOscillator();
    oscL.type = "sine";
    oscL.frequency.setValueAtTime(432, ctx.currentTime);

    const oscR = ctx.createOscillator();
    oscR.type = "sine";
    oscR.frequency.setValueAtTime(438, ctx.currentTime);

    const gainL = ctx.createGain();
    gainL.gain.setValueAtTime(0.25, ctx.currentTime);

    const gainR = ctx.createGain();
    gainR.gain.setValueAtTime(0.25, ctx.currentTime);

    oscL.connect(gainL);
    gainL.connect(merger, 0, 0);

    oscR.connect(gainR);
    gainR.connect(merger, 0, 1);

    merger.connect(destination);

    oscL.start();
    oscR.start();

    this.activeNodes["binaural"] = {
      stop: () => {
        try {
          oscL.stop();
          oscR.stop();
          oscL.disconnect();
          oscR.disconnect();
          gainL.disconnect();
          gainR.disconnect();
          merger.disconnect();
        } catch {}
      },
    };
  }

  private createCelestialChords(ctx: AudioContext, destination: GainNode) {
    const chord = [261.63, 329.63, 392.0, 523.25];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    chord.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(destination);
      osc.start();
      oscs.push(osc);
      gains.push(gain);
    });

    this.activeNodes["celestial"] = {
      stop: () => {
        oscs.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {}
        });
        gains.forEach((g) => {
          try {
            g.disconnect();
          } catch {}
        });
      },
    };
  }

  private createForestAmbience(ctx: AudioContext, destination: GainNode) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(174, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    osc.connect(gain);
    gain.connect(destination);
    osc.start();

    this.activeNodes["forest"] = {
      stop: () => {
        try {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
        } catch {}
      },
    };
  }
}

export const audioSynth = typeof window !== "undefined" ? new AudioSynthesizer() : (null as unknown as AudioSynthesizer);
export default audioSynth;
