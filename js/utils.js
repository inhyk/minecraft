// ============================================================
// Utility Functions - PRNG and Noise
// ============================================================

// Seeded PRNG (Mulberry32)
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

let worldRng = mulberry32(12345);
let gameSeed = 12345;
let noiseSeed = 5000;

// Noise (Simple Value Noise)
function hash(x) {
  let h = (x + noiseSeed) * 374761393;
  h = ((h >> 13) ^ h) * 1274126177;
  h = (h >> 16) ^ h;
  return (h & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise(x) {
  const ix = Math.floor(x);
  const fx = x - ix;
  const t = fx * fx * (3 - 2 * fx);
  return hash(ix) * (1 - t) + hash(ix + 1) * t;
}

function noise(x, octaves, persistence) {
  let total = 0, freq = 1, amp = 1, maxVal = 0;
  for (let i = 0; i < octaves; i++) {
    total += smoothNoise(x * freq) * amp;
    maxVal += amp;
    amp *= persistence;
    freq *= 2;
  }
  return total / maxVal;
}

function noise2D(x, y) {
  return smoothNoise(x * 0.1 + y * 57.32 + noiseSeed);
}
