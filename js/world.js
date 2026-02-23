// ============================================================
// Chunk-based World Generation
// ============================================================

function initWorldSeed(seed) {
  gameSeed = seed;
  noiseSeed = seed % 10000;
  worldRng = mulberry32(seed);
}

// ============================================================
// Dimension Switching
// ============================================================

function switchDimension(newDimension, spawnX, spawnY) {
  // Save current dimension chunks
  dimensionChunks[currentDimension] = chunks;
  dimensionChunkGenerated[currentDimension] = chunkGenerated;

  // Switch to new dimension
  currentDimension = newDimension;

  // Load or create new dimension chunks
  chunks = dimensionChunks[newDimension] || {};
  chunkGenerated = dimensionChunkGenerated[newDimension] || {};
  dimensionChunks[newDimension] = chunks;
  dimensionChunkGenerated[newDimension] = chunkGenerated;

  // Move player to spawn position
  player.x = spawnX * BLOCK_SIZE;
  player.y = spawnY * BLOCK_SIZE;
  player.vx = 0;
  player.vy = 0;

  // Clear mobs and reset state for the new dimension
  mobs = [];
  animals = [];
  arrows = [];
  particles = [];
  droppedItems = [];

  // Set portal cooldown to prevent instant return
  portalCooldown = 3000;

  // Generate initial chunks for new dimension
  ensureChunksLoaded();
}

function getDimensionName() {
  switch (currentDimension) {
    case DIMENSION.OVERWORLD: return 'Overworld';
    case DIMENSION.NETHER: return 'Nether';
    case DIMENSION.END: return 'The End';
    default: return 'Unknown';
  }
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

  // Dispatch to dimension-specific generation
  if (currentDimension === DIMENSION.NETHER) {
    generateNetherChunk(cx);
    return;
  }
  if (currentDimension === DIMENSION.END) {
    generateEndChunk(cx);
    return;
  }

  // Overworld generation
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
        // Ores (deterministic per position, each ore has its own hash)
        const depth = y - surfaceH;
        // Diamond (deepest, rarest) - depth 40+
        if (depth > 40 && posHash2(x, y, 5) < 0.008) {
          chunk[y * CHUNK_SIZE + lx] = B.DIAMOND_ORE;
        }
        // Gold - depth 25+
        else if (depth > 25 && posHash2(x, y, 4) < 0.012) {
          chunk[y * CHUNK_SIZE + lx] = B.GOLD_ORE;
        }
        // Iron - depth 10+
        else if (depth > 10 && posHash2(x, y, 3) < 0.025) {
          chunk[y * CHUNK_SIZE + lx] = B.IRON_ORE;
        }
        // Copper - depth 6+
        else if (depth > 6 && posHash2(x, y, 2) < 0.025) {
          chunk[y * CHUNK_SIZE + lx] = B.COPPER_ORE;
        }
        // Coal - depth 4+
        else if (depth > 4 && posHash2(x, y, 1) < 0.035) {
          chunk[y * CHUNK_SIZE + lx] = B.COAL_ORE;
        }
        // Gravel - depth 5+
        else if (depth > 5 && posHash2(x, y, 6) < 0.02) {
          chunk[y * CHUNK_SIZE + lx] = B.GRAVEL;
        }
      }
    }

    // Cave generation using multiple noise layers
    for (let y = surfaceH + 8; y < WORLD_HEIGHT - 5; y++) {
      // Large cave system
      const cave1 = caveNoise(x * 0.03, y * 0.03, 3, 0.5);
      // Medium tunnels
      const cave2 = caveNoise(x * 0.06 + 500, y * 0.06 + 500, 2, 0.5);
      // Small caves
      const cave3 = caveNoise(x * 0.1 + 1000, y * 0.08 + 1000, 2, 0.6);

      // Combine cave layers
      const depth = y - surfaceH;
      const depthFactor = Math.min(1, depth / 30); // Caves get larger deeper

      // Large caves (threshold ~0.55-0.65)
      if (cave1 > 0.58 && cave1 < 0.68) {
        chunk[y * CHUNK_SIZE + lx] = B.AIR;
      }
      // Medium tunnels (threshold ~0.6-0.72)
      else if (cave2 > 0.62 && cave2 < 0.72 && depthFactor > 0.3) {
        chunk[y * CHUNK_SIZE + lx] = B.AIR;
      }
      // Small caves (threshold ~0.65-0.75)
      else if (cave3 > 0.67 && cave3 < 0.77 && depthFactor > 0.5) {
        chunk[y * CHUNK_SIZE + lx] = B.AIR;
      }

      // Very deep large caverns
      if (depth > 50 && cave1 > 0.52 && cave1 < 0.72) {
        chunk[y * CHUNK_SIZE + lx] = B.AIR;
      }
    }
  }
}

function decorateChunk(cx) {
  if (chunkGenerated[cx]) return;

  // Dispatch to dimension-specific decoration
  if (currentDimension === DIMENSION.NETHER) {
    decorateNetherChunk(cx);
    return;
  }
  if (currentDimension === DIMENSION.END) {
    decorateEndChunk(cx);
    return;
  }

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

  // Reset dimension storage
  dimensionChunks = {
    [DIMENSION.OVERWORLD]: {},
    [DIMENSION.NETHER]: {},
    [DIMENSION.END]: {}
  };
  dimensionChunkGenerated = {
    [DIMENSION.OVERWORLD]: {},
    [DIMENSION.NETHER]: {},
    [DIMENSION.END]: {}
  };
  currentDimension = DIMENSION.OVERWORLD;
  chunks = dimensionChunks[DIMENSION.OVERWORLD];
  chunkGenerated = dimensionChunkGenerated[DIMENSION.OVERWORLD];
  dimensionChunks[DIMENSION.OVERWORLD] = chunks;
  dimensionChunkGenerated[DIMENSION.OVERWORLD] = chunkGenerated;

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

// ============================================================
// Nether World Generation
// ============================================================

function generateNetherChunk(cx) {
  const chunk = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT);
  chunks[cx] = chunk;
  const startX = cx * CHUNK_SIZE;

  for (let lx = 0; lx < CHUNK_SIZE; lx++) {
    const x = startX + lx;

    // Bedrock ceiling
    for (let y = 0; y < 5; y++) {
      if (y === 0 || posHash2(x, y, 300) < 0.7) {
        chunk[y * CHUNK_SIZE + lx] = B.BEDROCK;
      } else {
        chunk[y * CHUNK_SIZE + lx] = B.NETHERRACK;
      }
    }

    // Netherrack terrain with caves
    const floorNoise = noise(x * 0.02, 3, 0.5);
    const floorY = Math.floor(NETHER_FLOOR + floorNoise * 8);
    const ceilingNoise = noise(x * 0.015 + 500, 3, 0.5);
    const ceilingY = Math.floor(5 + ceilingNoise * 15);

    for (let y = 5; y < WORLD_HEIGHT; y++) {
      if (y >= floorY) {
        // Lava sea
        if (y >= NETHER_FLOOR) {
          chunk[y * CHUNK_SIZE + lx] = B.LAVA;
        } else {
          chunk[y * CHUNK_SIZE + lx] = B.NETHERRACK;
        }
      } else if (y <= ceilingY) {
        chunk[y * CHUNK_SIZE + lx] = B.NETHERRACK;
      } else {
        // Cave with formations
        const cave1 = caveNoise(x * 0.04, y * 0.04, 3, 0.5);
        const cave2 = caveNoise(x * 0.08 + 200, y * 0.06 + 200, 2, 0.5);

        // Large open areas
        if (cave1 < 0.45 || cave1 > 0.7) {
          chunk[y * CHUNK_SIZE + lx] = B.NETHERRACK;

          // Nether ores
          if (posHash2(x, y, 350) < 0.015) {
            chunk[y * CHUNK_SIZE + lx] = B.NETHER_QUARTZ_ORE;
          } else if (posHash2(x, y, 351) < 0.008) {
            chunk[y * CHUNK_SIZE + lx] = B.GOLD_ORE;
          }
        } else if (cave2 < 0.4 || cave2 > 0.6) {
          chunk[y * CHUNK_SIZE + lx] = B.NETHERRACK;
        } else {
          chunk[y * CHUNK_SIZE + lx] = B.AIR;
        }
      }
    }

    // Glowstone clusters on ceiling
    if (posHash(x, 360) < 0.08) {
      const glowY = ceilingY + 1 + Math.floor(posHash(x, 361) * 3);
      for (let gy = 0; gy < 3; gy++) {
        const yy = glowY + gy;
        if (yy < WORLD_HEIGHT && chunk[yy * CHUNK_SIZE + lx] === B.AIR) {
          chunk[yy * CHUNK_SIZE + lx] = B.GLOWSTONE;
        }
      }
    }

    // Soul sand patches near lava
    if (posHash(x, 370) < 0.15) {
      const sandY = floorY - 1;
      if (sandY > 0 && chunk[sandY * CHUNK_SIZE + lx] === B.NETHERRACK) {
        chunk[sandY * CHUNK_SIZE + lx] = B.SOUL_SAND;
        if (posHash(x, 371) < 0.5 && sandY > 1) {
          chunk[(sandY - 1) * CHUNK_SIZE + lx] = B.SOUL_SAND;
        }
      }
    }

    // Bedrock floor
    chunk[(WORLD_HEIGHT - 1) * CHUNK_SIZE + lx] = B.BEDROCK;
  }
}

function decorateNetherChunk(cx) {
  if (chunkGenerated[cx]) return;
  chunkGenerated[cx] = true;

  if (!chunks[cx]) generateNetherChunk(cx);

  const startX = cx * CHUNK_SIZE;

  // Nether fortress generation (rare)
  if (posHash(cx, 400) < 0.05) {
    const fortressX = startX + Math.floor(posHash(cx, 401) * CHUNK_SIZE);
    const fortressY = 40 + Math.floor(posHash(cx, 402) * 20);
    generateNetherFortress(fortressX, fortressY);
  }
}

function generateNetherFortress(centerX, centerY) {
  // Simple fortress structure
  const width = 15 + Math.floor(posHash(centerX, 410) * 10);
  const height = 8;

  for (let dx = -width/2; dx < width/2; dx++) {
    const x = Math.floor(centerX + dx);
    // Floor
    setBlock(x, centerY, B.NETHER_BRICK);
    setBlock(x, centerY + 1, B.NETHER_BRICK);
    // Walls at edges
    if (Math.abs(dx) > width/2 - 2) {
      for (let dy = 0; dy < height; dy++) {
        setBlock(x, centerY - dy, B.NETHER_BRICK);
      }
    }
    // Ceiling
    setBlock(x, centerY - height, B.NETHER_BRICK);
  }
}

// ============================================================
// End World Generation
// ============================================================

function generateEndChunk(cx) {
  const chunk = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT);
  chunks[cx] = chunk;
  const startX = cx * CHUNK_SIZE;

  // End is mostly void with floating islands
  for (let lx = 0; lx < CHUNK_SIZE; lx++) {
    const x = startX + lx;

    // Main island near spawn (around x=1000)
    const distFromCenter = Math.abs(x - SPAWN_X);

    if (distFromCenter < END_ISLAND_RADIUS) {
      // Main end island
      const islandNoise = noise(x * 0.05, 4, 0.5);
      const radius = END_ISLAND_RADIUS - distFromCenter;
      const heightFactor = Math.min(1, radius / 20);
      const surfaceY = END_PLATFORM_Y - Math.floor(islandNoise * 8 * heightFactor);
      const depth = Math.floor(15 * heightFactor + islandNoise * 5);

      for (let y = surfaceY; y < surfaceY + depth && y < WORLD_HEIGHT; y++) {
        chunk[y * CHUNK_SIZE + lx] = B.END_STONE;
      }
    } else {
      // Smaller floating islands
      const islandChance = posHash2(cx, lx, 500);
      if (islandChance < 0.02) {
        const islandY = 40 + Math.floor(posHash2(cx, lx, 501) * 40);
        const islandSize = 3 + Math.floor(posHash2(cx, lx, 502) * 5);
        for (let dy = 0; dy < islandSize; dy++) {
          chunk[(islandY + dy) * CHUNK_SIZE + lx] = B.END_STONE;
        }
      }
    }
  }
}

function decorateEndChunk(cx) {
  if (chunkGenerated[cx]) return;
  chunkGenerated[cx] = true;

  if (!chunks[cx]) generateEndChunk(cx);

  const startX = cx * CHUNK_SIZE;

  // Obsidian pillars on main island
  const distFromCenter = Math.abs(startX + CHUNK_SIZE/2 - SPAWN_X);
  if (distFromCenter < END_ISLAND_RADIUS * 0.8) {
    if (posHash(cx, 550) < 0.1) {
      const pillarX = startX + Math.floor(posHash(cx, 551) * CHUNK_SIZE);
      const pillarHeight = 15 + Math.floor(posHash(cx, 552) * 25);
      generateObsidianPillar(pillarX, pillarHeight);
    }
  }
}

function generateObsidianPillar(x, height) {
  // Find ground level
  let groundY = END_PLATFORM_Y;
  for (let y = 30; y < 80; y++) {
    if (getBlock(x, y) === B.END_STONE) {
      groundY = y;
      break;
    }
  }

  // Build pillar
  for (let dy = 0; dy < height; dy++) {
    setBlock(x, groundY - dy, B.OBSIDIAN);
    setBlock(x - 1, groundY - dy, B.OBSIDIAN);
    setBlock(x + 1, groundY - dy, B.OBSIDIAN);
  }
}
