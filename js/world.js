// ============================================================
// Chunk-based World Generation
// ============================================================

function initWorldSeed(seed) {
  gameSeed = seed;
  noiseSeed = seed % 10000;
  worldRng = mulberry32(seed);
}

// --- Hash functions for deterministic per-position generation ---
function posHash(x, offset) {
  let h = ((x + offset) * 374761393 + gameSeed * 668265263) | 0;
  h = ((h >> 13) ^ h) * 1274126177;
  h = (h >> 16) ^ h;
  return ((h & 0x7fffffff) / 0x7fffffff);
}

function posHash2(x, y, offset) {
  let h = ((x * 374761393 + y * 668265263 + offset + gameSeed) | 0);
  h = ((h >> 13) ^ h) * 1274126177;
  h = (h >> 16) ^ h;
  return ((h & 0x7fffffff) / 0x7fffffff);
}

// --- Deterministic surface height (works for any X) ---
function getSurfaceHeight(x) {
  return Math.floor(noise(x * 0.02, 4, 0.5) * 20 + SURFACE_Y);
}

// --- Block access (chunk-aware) ---
function getBlock(x, y) {
  if (y < 0 || y >= WORLD_HEIGHT) return B.BEDROCK;
  const cx = Math.floor(x / CHUNK_SIZE);
  const chunk = chunks[cx];
  if (!chunk) return B.STONE;
  const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
  return chunk[y * CHUNK_SIZE + lx];
}

function setBlock(x, y, type) {
  if (y < 0 || y >= WORLD_HEIGHT) return;
  const cx = Math.floor(x / CHUNK_SIZE);
  if (!chunks[cx]) {
    generateChunkTerrain(cx);
  }
  const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
  chunks[cx][y * CHUNK_SIZE + lx] = type;
}

function isSolid(x, y) {
  const b = getBlock(x, y);
  return BLOCK_INFO[b] && BLOCK_INFO[b].solid;
}

// --- Chunk generation ---
function generateChunkTerrain(cx) {
  if (chunks[cx]) return;
  const chunk = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT);
  chunks[cx] = chunk;
  const startX = cx * CHUNK_SIZE;

  for (let lx = 0; lx < CHUNK_SIZE; lx++) {
    const x = startX + lx;
    const surfaceH = getSurfaceHeight(x);

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      if (y < surfaceH) continue; // AIR (0)
      if (y === WORLD_HEIGHT - 1) {
        chunk[y * CHUNK_SIZE + lx] = B.BEDROCK;
      } else if (y === surfaceH) {
        chunk[y * CHUNK_SIZE + lx] = B.GRASS;
      } else if (y < surfaceH + 4) {
        chunk[y * CHUNK_SIZE + lx] = B.DIRT;
      } else {
        chunk[y * CHUNK_SIZE + lx] = B.STONE;
        // Ores (deterministic per position)
        const depth = y - surfaceH;
        const r = posHash2(x, y, 0);
        if (depth > 5 && r < 0.03) chunk[y * CHUNK_SIZE + lx] = B.COAL_ORE;
        else if (depth > 15 && r < 0.015) chunk[y * CHUNK_SIZE + lx] = B.IRON_ORE;
        else if (depth > 30 && r < 0.008) chunk[y * CHUNK_SIZE + lx] = B.GOLD_ORE;
        else if (depth > 8 && r < 0.02) chunk[y * CHUNK_SIZE + lx] = B.COPPER_ORE;
        else if (depth > 45 && r < 0.004) chunk[y * CHUNK_SIZE + lx] = B.DIAMOND_ORE;
      }
    }

    // Caves using 2D noise
    for (let y = surfaceH + 5; y < WORLD_HEIGHT - 3; y++) {
      const n1 = noise(x * 0.08 + 100, 3, 0.5);
      const n2 = noise(y * 0.08 + 200, 3, 0.5);
      const cave = Math.sin(n1 * Math.PI * 3) * Math.cos(n2 * Math.PI * 3);
      if (cave > 0.6) {
        chunk[y * CHUNK_SIZE + lx] = B.AIR;
      }
    }
  }
}

function decorateChunk(cx) {
  if (chunkGenerated[cx]) return;
  chunkGenerated[cx] = true;

  // Ensure terrain exists
  if (!chunks[cx]) generateChunkTerrain(cx);

  const startX = cx * CHUNK_SIZE;
  const endX = startX + CHUNK_SIZE;

  // Trees: check this chunk plus neighbors for trees whose leaves extend here
  for (let scanCx = cx - 1; scanCx <= cx + 1; scanCx++) {
    const scanStart = scanCx * CHUNK_SIZE;
    for (let x = scanStart; x < scanStart + CHUNK_SIZE; x++) {
      if (posHash(x, 100) >= 0.06) continue; // not a tree position
      // Skip trees too close together (check previous positions)
      let tooClose = false;
      for (let px = x - 4; px < x; px++) {
        if (posHash(px, 100) < 0.06) { tooClose = true; break; }
      }
      if (tooClose) continue;

      const sy = getSurfaceHeight(x);
      const treeH = 4 + Math.floor(posHash(x, 101) * 3);

      // Only place blocks that fall within THIS chunk
      // Trunk
      for (let ty = 1; ty <= treeH; ty++) {
        if (x >= startX && x < endX) {
          setBlock(x, sy - ty, B.WOOD);
        }
      }
      // Leaves
      for (let lx = -2; lx <= 2; lx++) {
        for (let ly = -2; ly <= 0; ly++) {
          if (Math.abs(lx) === 2 && Math.abs(ly) === 2) continue;
          const bx = x + lx;
          const by = sy - treeH + ly;
          if (bx >= startX && bx < endX && by >= 0) {
            if (getBlock(bx, by) === B.AIR) {
              setBlock(bx, by, B.LEAVES);
            }
          }
        }
      }
      // Top leaves
      for (let dx = -1; dx <= 1; dx++) {
        const bx = x + dx;
        const by = sy - treeH - 1;
        if (bx >= startX && bx < endX && by >= 0) {
          if (getBlock(bx, by) === B.AIR) {
            setBlock(bx, by, B.LEAVES);
          }
        }
      }
    }
  }

  // Water pools
  for (let x = startX; x < endX; x++) {
    if (posHash(x, 200) >= 0.01) continue;
    const sy = getSurfaceHeight(x);
    const poolW = 3 + Math.floor(posHash(x, 201) * 4);
    for (let px = 0; px < poolW; px++) {
      const bx = x + px;
      if (bx >= startX && bx < endX) {
        setBlock(bx, sy, B.WATER);
        if (getBlock(bx, sy + 1) === B.GRASS) setBlock(bx, sy + 1, B.SAND);
        if (posHash(bx, 202) < 0.5) setBlock(bx, sy - 1, B.WATER);
      }
    }
  }

  // Village generation for this chunk
  generateVillageForChunk(cx);
}

// --- Chunk loading/unloading ---
function ensureChunksLoaded() {
  if (!player) return;
  const playerCX = Math.floor(player.x / BLOCK_SIZE / CHUNK_SIZE);

  // Load chunks in range
  for (let cx = playerCX - LOAD_DISTANCE; cx <= playerCX + LOAD_DISTANCE; cx++) {
    if (!chunks[cx]) {
      generateChunkTerrain(cx);
    }
    if (!chunkGenerated[cx]) {
      decorateChunk(cx);
    }
  }

  // Unload distant chunks
  for (const key in chunks) {
    const cx = parseInt(key);
    if (Math.abs(cx - playerCX) > UNLOAD_DISTANCE) {
      delete chunks[cx];
      delete chunkGenerated[cx];
    }
  }
}

// --- generateWorld (for initial game start) ---
function generateWorld() {
  chunks = {};
  chunkGenerated = {};
  villages = [];
  villagers = [];

  // Generate chunks around spawn
  const spawnCX = Math.floor(SPAWN_X / CHUNK_SIZE);
  for (let cx = spawnCX - LOAD_DISTANCE; cx <= spawnCX + LOAD_DISTANCE; cx++) {
    generateChunkTerrain(cx);
  }
  // Decorate after all terrain is ready
  for (let cx = spawnCX - LOAD_DISTANCE; cx <= spawnCX + LOAD_DISTANCE; cx++) {
    decorateChunk(cx);
  }
}
