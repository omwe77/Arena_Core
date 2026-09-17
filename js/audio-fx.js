/* ==========================================================================
   ARENA_CORE — Procedural Web Audio FX Synthesizer
   Zero external audio assets: generates broadcast-quality stadium whistles,
   goal horns, crowd cheers, ball kicks, and championship fanfares.
   ========================================================================== */

(function () {
  'use strict';

  let audioCtx = null;
  let sfxEnabled = true;

  try {
    const saved = localStorage.getItem('arena_sfx_enabled');
    if (saved !== null) {
      sfxEnabled = saved === 'true';
    }
  } catch {
    sfxEnabled = true;
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  // Ensure AudioContext resumes on first user touch / click
  function initUserGestureUnlock() {
    const unlock = () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
  }
  if (typeof window !== 'undefined') {
    initUserGestureUnlock();
  }

  /**
   * Procedural Referee Whistle
   * Dual-tone frequency modulated whistle with subtle air breath noise
   */
  function playWhistle(pattern = 'short') {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const playTone = (startTime, duration, freq1 = 2850, freq2 = 3200) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      // Slight vibrato for realistic whistle pea modulation
      const modOsc = ctx.createOscillator();
      const modGain = ctx.createGain();
      modOsc.frequency.setValueAtTime(28, startTime);
      modGain.gain.setValueAtTime(45, startTime);
      modOsc.connect(osc1.frequency);
      modOsc.connect(osc2.frequency);

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq1, startTime);
      osc2.frequency.setValueAtTime(freq2, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.setValueAtTime(0.22, startTime + duration - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      modOsc.start(startTime);
      osc1.start(startTime);
      osc2.start(startTime);

      modOsc.stop(startTime + duration);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    };

    const now = ctx.currentTime + 0.02;
    if (pattern === 'triple') {
      // Full time: Tweet! Tweet! Tweeeeeeet!
      playTone(now, 0.12);
      playTone(now + 0.2, 0.12);
      playTone(now + 0.42, 0.45);
    } else if (pattern === 'double') {
      playTone(now, 0.12);
      playTone(now + 0.18, 0.22);
    } else {
      // Short whistle (kickoff, foul, goal)
      playTone(now, 0.22);
    }
  }

  /**
   * Procedural Stadium Goal Horn & Crowd Cheering Roar
   */
  function playGoalHorn() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.01;

    // 1. Dual-tone resonant air horn
    const hornFrequencies = [233.08, 293.66, 349.23]; // Bb minor triad stadium chord
    hornFrequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.06);
      gain.gain.setValueAtTime(0.08, now + 0.75);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      // Lowpass filter to warm up the horn
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.15);
    });

    // 2. Rising stadium crowd roar (shaped pink/bandpass noise)
    try {
      const bufferSize = ctx.sampleRate * 1.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const crowdFilter = ctx.createBiquadFilter();
      crowdFilter.type = 'bandpass';
      crowdFilter.frequency.setValueAtTime(450, now);
      crowdFilter.frequency.exponentialRampToValueAtTime(800, now + 0.6);
      crowdFilter.Q.setValueAtTime(2.0, now);

      const crowdGain = ctx.createGain();
      crowdGain.gain.setValueAtTime(0.001, now);
      crowdGain.gain.linearRampToValueAtTime(0.12, now + 0.25);
      crowdGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      whiteNoise.connect(crowdFilter);
      crowdFilter.connect(crowdGain);
      crowdGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 1.45);
    } catch { /* WebAudio API unavailable — suppress */ }
  }

  /**
   * Procedural Championship Fanfare
   * Victorious chord cadence (C - G - C) with brass overtone
   */
  function playFanfare() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.05;
    const chordNotes = [
      { f: 261.63, delay: 0.0, dur: 0.3 }, // C4
      { f: 329.63, delay: 0.15, dur: 0.3 }, // E4
      { f: 392.00, delay: 0.30, dur: 0.3 }, // G4
      { f: 523.25, delay: 0.45, dur: 0.9 }, // C5 High
      { f: 659.25, delay: 0.45, dur: 0.9 }, // E5 Harmony
      { f: 783.99, delay: 0.45, dur: 0.9 }  // G5 Climax
    ];

    chordNotes.forEach(({ f, delay, dur }) => {
      const startTime = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.14, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.05);
    });
  }

  /**
   * Procedural Soccer Ball Kick
   */
  function playKick() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Tactile Acoustic Click for UI interactions
   */
  function playClick() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  function setAudioEnabled(enabled) {
    sfxEnabled = !!enabled;
    try {
      localStorage.setItem('arena_sfx_enabled', String(sfxEnabled));
    } catch { /* localStorage unavailable — suppress */ }
    updateAudioToggleButton();
  }

  function toggleAudio() {
    setAudioEnabled(!sfxEnabled);
    if (sfxEnabled) {
      playClick();
    }
  }

  function isAudioEnabled() {
    return sfxEnabled;
  }

  function updateAudioToggleButton() {
    const btn = document.getElementById('btn-audio-fx-toggle');
    const icon = document.getElementById('audio-fx-icon');
    const label = document.getElementById('audio-fx-label');
    if (!btn) return;

    if (sfxEnabled) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      if (icon) icon.className = 'fa-solid fa-volume-high';
      if (label) label.textContent = 'SFX ON';
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      if (icon) icon.className = 'fa-solid fa-volume-xmark';
      if (label) label.textContent = 'MUTED';
    }
  }

  // Initialize UI button binding
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('btn-audio-fx-toggle');
      if (btn) {
        btn.addEventListener('click', () => {
          toggleAudio();
        });
      }
      updateAudioToggleButton();
    });
  }

  // Expose on window.ArenaAudio
  window.ArenaAudio = {
    playWhistle,
    playGoalHorn,
    playFanfare,
    playKick,
    playClick,
    toggleAudio,
    setAudioEnabled,
    isAudioEnabled,
    updateAudioToggleButton
  };
})();
