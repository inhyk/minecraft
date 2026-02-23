// ============================================================
// Audio System - Background Music & Sound Effects
// ============================================================

let audioContext = null;
let masterGain = null;
let musicGain = null;
let currentMusic = null;
let musicEnabled = true;
let musicVolume = 0.3;
let currentMusicDimension = -1;

// Initialize audio context (must be called after user interaction)
function initAudio() {
  if (audioContext) return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = musicVolume;

    musicGain = audioContext.createGain();
    musicGain.connect(masterGain);
    musicGain.gain.value = 1;

    console.log('Audio initialized');
  } catch (e) {
    console.log('Audio not supported');
  }
}

// Toggle music on/off
function toggleMusic() {
  musicEnabled = !musicEnabled;
  if (musicEnabled) {
    if (masterGain) masterGain.gain.value = musicVolume;
    playDimensionMusic(currentDimension);
  } else {
    if (masterGain) masterGain.gain.value = 0;
    stopMusic();
  }
  return musicEnabled;
}

// Set music volume (0-1)
function setMusicVolume(vol) {
  musicVolume = Math.max(0, Math.min(1, vol));
  if (masterGain && musicEnabled) {
    masterGain.gain.value = musicVolume;
  }
}

// Stop current music
function stopMusic() {
  if (currentMusic) {
    try {
      currentMusic.stop();
    } catch (e) {}
    currentMusic = null;
  }
}

// Play music for specific dimension
function playDimensionMusic(dimension) {
  if (!audioContext || !musicEnabled) return;
  if (currentMusicDimension === dimension && currentMusic) return;

  stopMusic();
  currentMusicDimension = dimension;

  switch (dimension) {
    case DIMENSION.OVERWORLD:
      playOverworldMusic();
      break;
    case DIMENSION.NETHER:
      playNetherMusic();
      break;
    case DIMENSION.END:
      playEndMusic();
      break;
  }
}

// ============================================================
// Procedural Music Generation
// ============================================================

// Overworld - Calm, peaceful ambient music
function playOverworldMusic() {
  if (!audioContext) return;

  const musicNode = {
    oscillators: [],
    gains: [],
    stopped: false
  };

  // Ambient pad chords
  const chords = [
    [261.63, 329.63, 392.00], // C major
    [293.66, 369.99, 440.00], // D minor
    [329.63, 415.30, 493.88], // E minor
    [349.23, 440.00, 523.25], // F major
    [392.00, 493.88, 587.33], // G major
    [440.00, 523.25, 659.25], // A minor
  ];

  let chordIndex = 0;

  function playChord() {
    if (musicNode.stopped) return;

    const chord = chords[chordIndex];
    chordIndex = (chordIndex + 1) % chords.length;

    chord.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq / 2; // Lower octave

      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 1);
      gain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 3);
      gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 5);

      osc.connect(gain);
      gain.connect(musicGain);

      osc.start();
      osc.stop(audioContext.currentTime + 5);

      musicNode.oscillators.push(osc);
      musicNode.gains.push(gain);
    });

    // Add some bird-like sounds occasionally
    if (Math.random() > 0.7) {
      playBirdSound();
    }

    setTimeout(playChord, 4000 + Math.random() * 2000);
  }

  function playBirdSound() {
    if (musicNode.stopped || !audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    const baseFreq = 800 + Math.random() * 400;
    osc.frequency.value = baseFreq;
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.2, audioContext.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, audioContext.currentTime + 0.2);

    gain.gain.value = 0.03;
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(musicGain);

    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
  }

  playChord();

  currentMusic = {
    stop: () => {
      musicNode.stopped = true;
      musicNode.oscillators.forEach(o => {
        try { o.stop(); } catch(e) {}
      });
    }
  };
}

// Nether - Dark, ominous ambient music
function playNetherMusic() {
  if (!audioContext) return;

  const musicNode = {
    oscillators: [],
    stopped: false
  };

  // Low drone
  function playDrone() {
    if (musicNode.stopped) return;

    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.value = 55; // Low A

    osc2.type = 'sawtooth';
    osc2.frequency.value = 55.5; // Slightly detuned

    filter.type = 'lowpass';
    filter.frequency.value = 200;

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 2);
    gain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 6);
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);

    osc1.start();
    osc2.start();
    osc1.stop(audioContext.currentTime + 8);
    osc2.stop(audioContext.currentTime + 8);

    musicNode.oscillators.push(osc1, osc2);

    setTimeout(playDrone, 7000);
  }

  // Occasional scary sounds
  function playScarySound() {
    if (musicNode.stopped || !audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = 'square';
    const freq = 100 + Math.random() * 100;
    osc.frequency.value = freq;
    osc.frequency.linearRampToValueAtTime(freq * 0.5, audioContext.currentTime + 2);

    filter.type = 'lowpass';
    filter.frequency.value = 300;

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);

    osc.start();
    osc.stop(audioContext.currentTime + 2);

    setTimeout(playScarySound, 5000 + Math.random() * 10000);
  }

  playDrone();
  setTimeout(playScarySound, 2000);

  currentMusic = {
    stop: () => {
      musicNode.stopped = true;
      musicNode.oscillators.forEach(o => {
        try { o.stop(); } catch(e) {}
      });
    }
  };
}

// End - Ethereal, alien ambient music
function playEndMusic() {
  if (!audioContext) return;

  const musicNode = {
    oscillators: [],
    stopped: false
  };

  // Ethereal pads
  function playEtherealPad() {
    if (musicNode.stopped) return;

    const frequencies = [
      146.83, // D3
      220.00, // A3
      293.66, // D4
      369.99, // F#4
    ];

    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      // Slow vibrato
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.value = 0.5 + Math.random() * 0.5;
      lfoGain.gain.value = 3;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      lfo.stop(audioContext.currentTime + 8);

      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 2);
      gain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 5);
      gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 8);

      osc.connect(gain);
      gain.connect(musicGain);

      osc.start(audioContext.currentTime + i * 0.5);
      osc.stop(audioContext.currentTime + 8);

      musicNode.oscillators.push(osc, lfo);
    });

    setTimeout(playEtherealPad, 6000);
  }

  // Mysterious sparkle sounds
  function playSparkle() {
    if (musicNode.stopped || !audioContext) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (musicNode.stopped) return;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        const freq = 1000 + Math.random() * 1500;
        osc.frequency.value = freq;
        osc.frequency.linearRampToValueAtTime(freq * 1.5, audioContext.currentTime + 0.1);

        gain.gain.value = 0.02;
        gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(musicGain);

        osc.start();
        osc.stop(audioContext.currentTime + 0.3);
      }, i * 100);
    }

    setTimeout(playSparkle, 3000 + Math.random() * 5000);
  }

  playEtherealPad();
  setTimeout(playSparkle, 1000);

  currentMusic = {
    stop: () => {
      musicNode.stopped = true;
      musicNode.oscillators.forEach(o => {
        try { o.stop(); } catch(e) {}
      });
    }
  };
}

// ============================================================
// Sound Effects
// ============================================================

function playBlockBreakSound() {
  if (!audioContext || !musicEnabled) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const noise = createNoiseBuffer(0.1);
  const noiseSource = audioContext.createBufferSource();
  const noiseGain = audioContext.createGain();

  // Pop sound
  osc.type = 'sine';
  osc.frequency.value = 200;
  osc.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.1);

  gain.gain.value = 0.2;
  gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start();
  osc.stop(audioContext.currentTime + 0.1);

  // Crunch noise
  noiseSource.buffer = noise;
  noiseGain.gain.value = 0.1;
  noiseGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);

  noiseSource.connect(noiseGain);
  noiseGain.connect(masterGain);

  noiseSource.start();
  noiseSource.stop(audioContext.currentTime + 0.15);
}

function playBlockPlaceSound() {
  if (!audioContext || !musicEnabled) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = 'square';
  osc.frequency.value = 150;
  osc.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.05);

  gain.gain.value = 0.1;
  gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start();
  osc.stop(audioContext.currentTime + 0.08);
}

function playHurtSound() {
  if (!audioContext || !musicEnabled) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = 200;
  osc.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.2);

  gain.gain.value = 0.15;
  gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start();
  osc.stop(audioContext.currentTime + 0.2);
}

function playPickupSound() {
  if (!audioContext || !musicEnabled) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = 'sine';
  osc.frequency.value = 500;
  osc.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.1);

  gain.gain.value = 0.1;
  gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start();
  osc.stop(audioContext.currentTime + 0.15);
}

function playAchievementSound() {
  if (!audioContext || !musicEnabled) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    setTimeout(() => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.value = 0.15;
      gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(audioContext.currentTime + 0.3);
    }, i * 100);
  });
}

// Create noise buffer for sound effects
function createNoiseBuffer(duration) {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

// Update music based on current dimension
function updateMusic() {
  if (gameState === STATE.PLAYING && musicEnabled) {
    playDimensionMusic(currentDimension);
  } else if (gameState !== STATE.PLAYING) {
    stopMusic();
    currentMusicDimension = -1;
  }
}

// Draw music indicator on HUD
function drawMusicIndicator() {
  const iconX = canvas.width - 30;
  const iconY = 65;

  ctx.fillStyle = musicEnabled ? 'rgba(100, 200, 100, 0.8)' : 'rgba(150, 150, 150, 0.5)';
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(musicEnabled ? '♪' : '♪̸', iconX, iconY);

  // Volume bar
  if (musicEnabled) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(iconX - 15, iconY + 5, 30, 4);
    ctx.fillStyle = 'rgba(100, 200, 100, 0.8)';
    ctx.fillRect(iconX - 15, iconY + 5, 30 * musicVolume, 4);
  }
}
