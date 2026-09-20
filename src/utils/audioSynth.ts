/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class FluidmotionAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingAmbient = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private harmonicOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;

  public init(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleAmbient(onToggle?: (active: boolean) => void): boolean {
    const ctx = this.init();

    if (this.isPlayingAmbient) {
      this.stopAmbient();
      if (onToggle) onToggle(false);
      return false;
    } else {
      this.startAmbient(ctx);
      if (onToggle) onToggle(true);
      return true;
    }
  }

  public isAmbientActive(): boolean {
    return this.isPlayingAmbient;
  }

  private startAmbient(ctx: AudioContext): void {
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    // 1. Pink/Brown ocean wave noise simulation
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise for deep ocean rumble
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for wave swell shaping
    const waveFilter = ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(320, ctx.currentTime);

    // LFO for wave tidal sweep (54-second period scaled down to 7.5s for audible swell)
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.133, ctx.currentTime); // ~7.5 seconds swell
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(180, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(waveFilter.frequency);
    lfo.start();

    whiteNoise.connect(waveFilter);
    waveFilter.connect(this.masterGain);
    whiteNoise.start();
    this.noiseNode = whiteNoise;

    // 2. 54Hz Fundamental & 432Hz Harmonic Sine
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(54, ctx.currentTime); // Dragon9 54Hz fundamental
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.04, ctx.currentTime);
    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start();
    this.subOsc = sub;

    const harm = ctx.createOscillator();
    harm.type = 'sine';
    harm.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz golden harmonic
    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(0.015, ctx.currentTime);
    harm.connect(harmGain);
    harmGain.connect(this.masterGain);
    harm.start();
    this.harmonicOsc = harm;

    this.isPlayingAmbient = true;
  }

  public stopAmbient(): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    }
    setTimeout(() => {
      try {
        if (this.noiseNode) (this.noiseNode as AudioBufferSourceNode).stop();
        if (this.subOsc) this.subOsc.stop();
        if (this.harmonicOsc) this.harmonicOsc.stop();
      } catch {
        // Safe catch if already stopped
      }
      this.noiseNode = null;
      this.subOsc = null;
      this.harmonicOsc = null;
      this.isPlayingAmbient = false;
    }, 550);
  }

  public playHarmonicChime(): void {
    const ctx = this.init();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(432, now);
    osc.frequency.exponentialRampToValueAtTime(864, now + 0.8);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.25);
  }

  /**
   * Reads media scripts aloud with embedded timing pauses [pause: X.Xs]
   */
  public speakWithTiming(
    text: string,
    onProgress?: (progress: { currentSegment: string; isSpeaking: boolean }) => void
  ): { cancel: () => void } {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported in this browser.');
      return { cancel: () => {} };
    }

    window.speechSynthesis.cancel();

    // Strip [Audio Cue: ...], [Visual Cue: ...] from speech text, but parse [pause: X.Xs]
    // Split into segments by pause tags
    const pauseRegex = /\[pause:\s*([\d\.]+)s?\]/gi;
    const cleanedForVoice = text
      .replace(/\[Audio Cue:[^\]]+\]/gi, '')
      .replace(/\[Visual Cue:[^\]]+\]/gi, '');

    const parts: { text: string; pauseSec: number }[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pauseRegex.exec(cleanedForVoice)) !== null) {
      const segmentText = cleanedForVoice.substring(lastIndex, match.index).trim();
      const pauseSec = parseFloat(match[1]) || 0.5;
      if (segmentText) {
        parts.push({ text: segmentText, pauseSec });
      }
      lastIndex = pauseRegex.lastIndex;
    }
    const remainingText = cleanedForVoice.substring(lastIndex).trim();
    if (remainingText) {
      parts.push({ text: remainingText, pauseSec: 0 });
    }

    let isCancelled = false;
    let currentIndex = 0;

    const speakNext = () => {
      if (isCancelled || currentIndex >= parts.length) {
        if (onProgress) onProgress({ currentSegment: '', isSpeaking: false });
        return;
      }

      const item = parts[currentIndex];
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate = 0.95; // Deliberate, relaxed fluid pacing
      utterance.pitch = 0.98;

      if (onProgress) {
        onProgress({ currentSegment: item.text, isSpeaking: true });
      }

      utterance.onend = () => {
        if (isCancelled) return;
        currentIndex++;
        if (item.pauseSec > 0) {
          setTimeout(speakNext, item.pauseSec * 1000);
        } else {
          speakNext();
        }
      };

      utterance.onerror = () => {
        if (isCancelled) return;
        currentIndex++;
        speakNext();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();

    return {
      cancel: () => {
        isCancelled = true;
        window.speechSynthesis.cancel();
        if (onProgress) onProgress({ currentSegment: '', isSpeaking: false });
      }
    };
  }
}

export const audioEngine = new FluidmotionAudioEngine();
