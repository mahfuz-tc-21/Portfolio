class AudioSynth {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private intervalId: number | null = null;

  public start() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterVolume.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2); // soft fade in

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.masterVolume.connect(filter);
      filter.connect(this.ctx.destination);

      // Play a soft, beautiful space drone chord (C maj9/9 - C3, G3, D4, E4, B4)
      const freqs = [130.81, 196.00, 293.66, 329.63, 493.88];
      freqs.forEach((freq, index) => {
        if (!this.ctx || !this.masterVolume) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        
        osc.type = index % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        oscGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        
        // Add subtle pitch variance
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.setValueAtTime(0.15 + (index * 0.05), this.ctx.currentTime);
        vibratoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        
        vibrato.start();
        osc.connect(oscGain);
        oscGain.connect(this.masterVolume);
        
        osc.start();
        this.oscillators.push(osc, vibrato);
      });

      // Play soft periodic ping alerts representing digital city systems
      this.playBeepLoop();

    } catch (e) {
      console.warn("Failed to initialize Web Audio API: ", e);
    }
  }

  private playBeepLoop() {
    const beep = () => {
      if (!this.ctx || !this.masterVolume || this.ctx.state === 'suspended') return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      // Pentatonic scale pings
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(this.masterVolume);
      osc.start();
      
      setTimeout(() => {
        osc.stop();
        osc.disconnect();
      }, 1500);
    };

    this.intervalId = window.setInterval(beep, 4000);
  }

  public stop() {
    if (this.masterVolume && this.ctx) {
      try {
        const targetTime = this.ctx.currentTime + 0.5;
        this.masterVolume.gain.linearRampToValueAtTime(0, targetTime);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
          });
          this.oscillators = [];
          if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
          }
          if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
          }
        }, 600);
      } catch (e) {
        console.warn("Error stopping audio: ", e);
      }
    }
  }
}

export const audioSynth = new AudioSynth();
