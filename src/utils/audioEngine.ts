/**
 * AutoReel Audio Engine
 * High-fidelity procedural sound effects, royalty-free audio tracks synthesis,
 * and voiceover playback with automatic ducking.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private voiceGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private musicOscillators: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private activeMusicTimer: any = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.musicGainNode = this.ctx.createGain();
      this.voiceGainNode = this.ctx.createGain();
      this.sfxGainNode = this.ctx.createGain();

      this.musicGainNode.gain.value = 0.3;
      this.voiceGainNode.gain.value = 0.95;
      this.sfxGainNode.gain.value = 0.8;

      this.musicGainNode.connect(this.ctx.destination);
      this.voiceGainNode.connect(this.ctx.destination);
      this.sfxGainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(musicVol: number, voiceVol: number) {
    if (this.musicGainNode) {
      this.musicGainNode.gain.setValueAtTime(Math.max(0, Math.min(musicVol, 1)), this.ctx?.currentTime || 0);
    }
    if (this.voiceGainNode) {
      this.voiceGainNode.gain.setValueAtTime(Math.max(0, Math.min(voiceVol, 1)), this.ctx?.currentTime || 0);
    }
  }

  public playSoundEffect(key: string) {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;

    const t = this.ctx.currentTime;

    switch (key) {
      case 'sfx-whoosh-fast':
      case 'whoosh': {
        // Filtered white noise sweep
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300, t);
        filter.frequency.exponentialRampToValueAtTime(3200, t + 0.2);
        filter.frequency.exponentialRampToValueAtTime(200, t + 0.4);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.8, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGainNode);
        noise.start(t);
        break;
      }

      case 'sfx-bass-drop':
      case 'bassdrop': {
        // Deep sub-bass punch
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.6);

        gain.gain.setValueAtTime(0.9, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(t);
        osc.stop(t + 0.85);
        break;
      }

      case 'sfx-bell-ding':
      case 'bell': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1864, t); // A#6
        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(t);
        osc.stop(t + 0.9);
        break;
      }

      case 'sfx-cash-register':
      case 'cash': {
        // Two high harmonic chimes
        [1200, 1600].forEach((freq, idx) => {
          if (!this.ctx || !this.sfxGainNode) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.6, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.4);

          osc.connect(gain);
          gain.connect(this.sfxGainNode);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.45);
        });
        break;
      }

      case 'sfx-glitch-hit':
      case 'glitch': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.setValueAtTime(120, t + 0.05);
        osc.frequency.setValueAtTime(800, t + 0.1);

        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(t);
        osc.stop(t + 0.28);
        break;
      }

      case 'sfx-cinematic-riser':
      case 'riser': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 1.2);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.8, t + 1.1);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.25);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(t);
        osc.stop(t + 1.3);
        break;
      }

      default:
        break;
    }
  }

  public playMusicTrack(mood: string, volume: number = 0.3) {
    this.stopMusic();
    this.init();
    if (!this.ctx || !this.musicGainNode) return;

    this.isMusicPlaying = true;
    this.musicGainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

    // Procedural multi-layer ambient beat synthesis based on mood
    const rootFreq = mood.includes('phonk') ? 55 : mood.includes('lofi') ? 65.4 : mood.includes('synth') ? 73.4 : 58.2;
    
    // Bass chord layer
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    osc1.type = mood.includes('phonk') || mood.includes('synth') ? 'sawtooth' : 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(rootFreq, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(rootFreq * 1.5, this.ctx.currentTime);

    subGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(mood.includes('phonk') ? 1200 : 450, this.ctx.currentTime);

    osc1.connect(subGain);
    osc2.connect(subGain);
    subGain.connect(filter);
    filter.connect(this.musicGainNode);

    osc1.start();
    osc2.start();
    this.musicOscillators.push(osc1, osc2);

    // Rhythmic pulse loop
    let step = 0;
    const bpm = mood.includes('phonk') ? 135 : mood.includes('synth') ? 128 : 85;
    const intervalMs = (60 / bpm / 2) * 1000;

    this.activeMusicTimer = setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;
      const curT = this.ctx.currentTime;
      step = (step + 1) % 16;

      // Kick drum pulse on 0, 4, 8, 12
      if (step % 4 === 0) {
        const kick = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kick.frequency.setValueAtTime(120, curT);
        kick.frequency.exponentialRampToValueAtTime(35, curT + 0.12);
        kickGain.gain.setValueAtTime(0.7, curT);
        kickGain.gain.exponentialRampToValueAtTime(0.01, curT + 0.15);
        kick.connect(kickGain);
        kickGain.connect(this.musicGainNode);
        kick.start(curT);
        kick.stop(curT + 0.16);
      }

      // Hi-hat noise on odd steps
      if (step % 2 === 1 && (mood.includes('phonk') || mood.includes('synth') || mood.includes('upbeat'))) {
        const hat = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        hat.type = 'square';
        hat.frequency.setValueAtTime(3400 + Math.random() * 500, curT);
        hatGain.gain.setValueAtTime(0.12, curT);
        hatGain.gain.exponentialRampToValueAtTime(0.001, curT + 0.04);
        hat.connect(hatGain);
        hatGain.connect(this.musicGainNode);
        hat.start(curT);
        hat.stop(curT + 0.05);
      }
    }, intervalMs);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.activeMusicTimer) {
      clearInterval(this.activeMusicTimer);
      this.activeMusicTimer = null;
    }
    for (const osc of this.musicOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore
      }
    }
    this.musicOscillators = [];
  }

  /**
   * Speak narration text with voice emotion settings using browser synthesis
   */
  public speakNarration(
    text: string,
    voiceEmotion: string = 'dramatic',
    rate: number = 1.05,
    onWord?: (word: string, index: number) => void,
    onEnd?: () => void
  ): { cancel: () => void } {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return { cancel: () => {} };
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick best natural voice available
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferredVoice = englishVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Daniel') || 
      v.name.includes('Samantha') || 
      v.name.includes('Alex')
    ) || englishVoices[0] || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Emotion tuning
    if (voiceEmotion === 'dramatic') {
      utterance.rate = 0.96;
      utterance.pitch = 0.85;
    } else if (voiceEmotion === 'energetic') {
      utterance.rate = 1.15;
      utterance.pitch = 1.08;
    } else if (voiceEmotion === 'mysterious') {
      utterance.rate = 0.92;
      utterance.pitch = 0.9;
    } else if (voiceEmotion === 'authoritative') {
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
    } else {
      utterance.rate = rate;
      utterance.pitch = 1.0;
    }

    utterance.onboundary = (e) => {
      if (e.name === 'word' && onWord) {
        const spokenWord = text.substring(e.charIndex, e.charIndex + e.charLength);
        onWord(spokenWord, e.charIndex);
      }
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    // Duck music volume slightly while speaking
    if (this.musicGainNode && this.ctx) {
      const origVol = this.musicGainNode.gain.value;
      this.musicGainNode.gain.setValueAtTime(origVol * 0.4, this.ctx.currentTime);
      const restoreTimer = setTimeout(() => {
        if (this.musicGainNode && this.ctx) {
          this.musicGainNode.gain.setValueAtTime(origVol, this.ctx.currentTime);
        }
      }, 5000);
      utterance.addEventListener('end', () => clearTimeout(restoreTimer));
    }

    window.speechSynthesis.speak(utterance);

    return {
      cancel: () => {
        window.speechSynthesis.cancel();
      }
    };
  }

  public stopAll() {
    this.stopMusic();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new AudioEngine();
