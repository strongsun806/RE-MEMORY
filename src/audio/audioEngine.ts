/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Ambient Soundtrack & Foley Engine via Web Audio API & SpeechSynthesis
class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;
  private pianoGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private vinylNode: AudioNode | null = null;
  private isPlayingAmbience: boolean = false;
  private chordIntervalId: number | null = null;
  private currentMood: string = 'melancholic';

  private initContext(): boolean {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.rainGain = this.ctx.createGain();
        this.rainGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        this.rainGain.connect(this.masterGain);

        this.vinylGain = this.ctx.createGain();
        this.vinylGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        this.vinylGain.connect(this.masterGain);

        this.pianoGain = this.ctx.createGain();
        this.pianoGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.pianoGain.connect(this.masterGain);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
      return false;
    }
  }

  // Generate Brownian/Pink noise buffer for rain soundscape
  private createRainNoiseNode(): AudioNode | null {
    if (!this.ctx || !this.rainGain) return null;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brownian filtered noise
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.8; // Boost to audible level
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to simulate raindrops on leaves and umbrellas
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(150, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(highpass);
    highpass.connect(this.rainGain);

    noiseSource.start();
    return noiseSource;
  }

  // Generate subtle vinyl/film crackle
  private createVinylCrackleNode(): AudioNode | null {
    if (!this.ctx || !this.vinylGain) return null;

    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Occasional dust click/pop
      if (Math.random() < 0.0006) {
        data[i] = (Math.random() * 2 - 1) * 0.7;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.01;
      }
    }

    const vinylSource = this.ctx.createBufferSource();
    vinylSource.buffer = buffer;
    vinylSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2500, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    vinylSource.connect(filter);
    filter.connect(this.vinylGain);

    vinylSource.start();
    return vinylSource;
  }

  // Synthesizes a soft organic acoustic piano note
  public playPianoNote(freq: number, velocity: number = 0.5, duration: number = 3.5) {
    if (!this.initContext() || !this.ctx || !this.pianoGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();

    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Harmonics for warm felt piano tone
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now); // 2nd harmonic

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now); // 3rd harmonic

    // Warm felt filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    // Exponential acoustic decay
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.4, now + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    osc3.connect(noteGain);

    noteGain.connect(filter);
    filter.connect(this.pianoGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);
  }

  // Chords mapping for different moods (frequencies in Hz)
  private getChordForMood(mood: string): number[][] {
    switch (mood) {
      case 'melancholic':
        // D minor arpeggios: D3, F3, A3, D4, E4
        return [
          [146.83, 174.61, 220.00, 293.66], // Dm
          [116.54, 174.61, 233.08, 293.66], // Bb
          [130.81, 164.81, 196.00, 261.63], // C
          [110.00, 164.81, 220.00, 261.63]  // Am
        ];
      case 'tender':
        // F major7 / C major: F3, A3, C4, E4
        return [
          [174.61, 220.00, 261.63, 329.63], // Fmaj7
          [130.81, 164.81, 196.00, 246.94], // Cmaj7
          [146.83, 174.61, 220.00, 261.63], // Dm7
          [196.00, 246.94, 293.66, 349.23]  // G7
        ];
      case 'sacrificial':
        // A minor / Dm9 poignant chords
        return [
          [110.00, 164.81, 220.00, 261.63], // Am
          [146.83, 174.61, 220.00, 329.63], // Dm9
          [123.47, 164.81, 196.00, 246.94], // Em7
          [110.00, 138.59, 164.81, 220.00]  // A
        ];
      case 'warm_closure':
      default:
        // C major / G major closure: C3, E3, G3, B3
        return [
          [130.81, 164.81, 196.00, 261.63], // C
          [196.00, 246.94, 293.66, 392.00], // G
          [110.00, 164.81, 220.00, 261.63], // Am
          [174.61, 220.00, 261.63, 349.23]  // F
        ];
    }
  }

  // Starts procedural ambient soundtrack (Rain Foley + Piano Arpeggios)
  public startAmbience(mood: string = 'melancholic') {
    if (this.isPlayingAmbience) {
      this.currentMood = mood;
      return;
    }
    if (!this.initContext()) return;

    this.currentMood = mood;
    this.isPlayingAmbience = true;

    // Start Foley
    if (!this.rainNode) {
      this.rainNode = this.createRainNoiseNode();
    }
    if (!this.vinylNode) {
      this.vinylNode = this.createVinylCrackleNode();
    }

    // Start Piano Chord Progression
    const chordProgressions = this.getChordForMood(this.currentMood);
    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.isPlayingAmbience) return;
      const progression = this.getChordForMood(this.currentMood);
      const chord = progression[chordIndex % progression.length];
      chordIndex++;

      // Arpeggiate notes over 4 seconds
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          if (this.isPlayingAmbience) {
            this.playPianoNote(freq, 0.45 - idx * 0.05, 3.8);
          }
        }, idx * 600);
      });
    };

    // Play first immediately, then interval
    playNextChord();
    this.chordIntervalId = window.setInterval(playNextChord, 4200);
  }

  public setMood(mood: string) {
    this.currentMood = mood;
  }

  public stopAmbience() {
    this.isPlayingAmbience = false;
    if (this.chordIntervalId !== null) {
      clearInterval(this.chordIntervalId);
      this.chordIntervalId = null;
    }
    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
      } catch {
        // Ignored
      }
      this.rainNode = null;
    }
    if (this.vinylNode) {
      try {
        (this.vinylNode as AudioBufferSourceNode).stop();
      } catch {
        // Ignored
      }
      this.vinylNode = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.5, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlayingAmbience;
  }

  // Voice Narration via Web Speech API
  public speakNarration(
    text: string,
    lang: string = 'ko-KR',
    onEnd?: () => void
  ): boolean {
    if (this.isMuted || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return false;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88; // Deliberate, emotional pace
    utterance.pitch = 0.95; // Gentle, warm tone

    // Try finding a natural Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KR'));
    if (koVoice) {
      utterance.voice = koVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  public stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new ProceduralAudioEngine();
