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

// --- Biome determination (deterministic per X) ---
function getBiome(x) {
  // Use large-scale noise for biome selection
  const biomeNoise = noise(x * 0.003, 2, 0.5);
  const tempNoise = noise(x * 0.002 + 5000, 2, 0.5);

  if (biomeNoise < 0.3) {
    // Ocean biomes
    if (tempNoise < 0.3) return 'frozen_ocean';
    return 'ocean';
  } else if (biomeNoise < 0.38) {
    // Beach transition
    return 'beach';
  } else if (biomeNoise > 0.85) {
    // Desert
    return 'desert';
  } else if (tempNoise < 0.25) {
    // Cold biomes
    return 'snowy';
  } else if (tempNoise > 0.75) {
    // Jungle
    return 'jungle';
  }
  return 'plains';
}

// --- Deterministic surface height (works for any X) ---
function getSurfaceHeight(x) {
  const biome = getBiome(x);
  const baseNoise = noise(x * 0.02, 4, 0.5);

  if (biome === 'ocean' || biome === 'frozen_ocean') {
    // Ocean floor - below sea level
    return Math.floor(SEA_LEVEL + 5 + baseNoise * OCEAN_DEPTH);
  } else if (biome === 'beach') {
    // Beach - near sea level
    return Math.floor(SEA_LEVEL - 2 + baseNoise * 5);
  } else if (biome === 'desert') {
    // Desert - slightly hilly
    return Math.floor(noise(x * 0.015, 3, 0.5) * 15 + SURFACE_Y);
  } else if (biome === 'jungle') {
    // Jungle - more varied terrain
    return Math.floor(baseNoise * 25 + SURFACE_Y - 3);
  }

  // Default plains/forest terrain
  return Math.floor(baseNoise * 20 + SURFACE_Y);
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
    const biome = getBiome(x);
    const surfaceH = getSurfaceHeight(x);

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      // Bedrock at bottom
      if (y === WORLD_HEIGHT - 1) {
        chunk[y * CHUNK_SIZE + lx] = B.BEDROCK;
        continue;
      }

      // Water fill for ocean and beach biomes
      if ((biome === 'ocean' || biome === 'frozen_ocean' || biome === 'beach') && y >= surfaceH && y < SEA_LEVEL) {
        if (biome === 'frozen_ocean' && y === surfaceH) {
          // Ice on surface of frozen ocean
          chunk[y * CHUNK_SIZE + lx] = B.ICE;
        } else {
          chunk[y * CHUNK_SIZE + lx] = B.WATER;
        }
        continue;
      }

      if (y < surfaceH) continue; // AIR (0)

      // Surface layer based on biome
      if (y === surfaceH) {
        if (biome === 'ocean' || biome === 'frozen_ocean') {
          // Ocean floor - sand, gravel, clay
          const floorType = posHash2(x, y, 700);
          if (floorType < 0.5) chunk[y * CHUNK_SIZE + lx] = B.SAND;
          else if (floorType < 0.7) chunk[y * CHUNK_SIZE + lx] = B.GRAVEL;
          else if (floorType < 0.85) chunk[y * CHUNK_SIZE + lx] = B.CLAY;
          else chunk[y * CHUNK_SIZE + lx] = B.DIRT;
        } else if (biome === 'beach') {
          chunk[y * CHUNK_SIZE + lx] = B.SAND;
        } else if (biome === 'desert') {
          chunk[y * CHUNK_SIZE + lx] = B.SAND;
        } else if (biome === 'snowy') {
          chunk[y * CHUNK_SIZE + lx] = B.SNOW;
        } else if (biome === 'jungle') {
          chunk[y * CHUNK_SIZE + lx] = B.GRASS;
        } else {
          chunk[y * CHUNK_SIZE + lx] = B.GRASS;
        }
      } else if (y < surfaceH + 4) {
        // Subsurface layer
        if (biome === 'desert' || biome === 'beach') {
          if (y < surfaceH + 3) chunk[y * CHUNK_SIZE + lx] = B.SAND;
          else chunk[y * CHUNK_SIZE + lx] = B.SANDSTONE;
        } else if (biome === 'ocean' || biome === 'frozen_ocean') {
          chunk[y * CHUNK_SIZE + lx] = B.SAND;
        } else {
          chunk[y * CHUNK_SIZE + lx] = B.DIRT;
        }
      } else {
        // Stone layer with ores
        chunk[y * CHUNK_SIZE + lx] = B.STONE;
        const depth = y - surfaceH;

        // Deepslate below y=80
        if (y > 80) {
          chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE;
          // Deepslate ores
          if (depth > 40 && posHash2(x, y, 5) < 0.008) {
            chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE_DIAMOND_ORE;
          } else if (depth > 25 && posHash2(x, y, 4) < 0.012) {
            chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE_GOLD_ORE;
          } else if (depth > 10 && posHash2(x, y, 3) < 0.025) {
            chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE_IRON_ORE;
          } else if (depth > 6 && posHash2(x, y, 2) < 0.025) {
            chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE_COPPER_ORE;
          } else if (depth > 4 && posHash2(x, y, 1) < 0.035) {
            chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE_COAL_ORE;
          } else if (depth > 20 && posHash2(x, y, 10) < 0.006) {
            chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE_EMERALD_ORE;
          } else if (depth > 15 && posHash2(x, y, 11) < 0.015) {
            chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE_LAPIS_ORE;
          } else if (depth > 8 && posHash2(x, y, 12) < 0.02) {
            chunk[y * CHUNK_SIZE + lx] = B.DEEPSLATE_REDSTONE_ORE;
          }
        } else {
          // Regular stone ores
          if (depth > 40 && posHash2(x, y, 5) < 0.008) {
            chunk[y * CHUNK_SIZE + lx] = B.DIAMOND_ORE;
          } else if (depth > 25 && posHash2(x, y, 4) < 0.012) {
            chunk[y * CHUNK_SIZE + lx] = B.GOLD_ORE;
          } else if (depth > 10 && posHash2(x, y, 3) < 0.025) {
            chunk[y * CHUNK_SIZE + lx] = B.IRON_ORE;
          } else if (depth > 6 && posHash2(x, y, 2) < 0.025) {
            chunk[y * CHUNK_SIZE + lx] = B.COPPER_ORE;
          } else if (depth > 4 && posHash2(x, y, 1) < 0.035) {
            chunk[y * CHUNK_SIZE + lx] = B.COAL_ORE;
          } else if (depth > 5 && posHash2(x, y, 6) < 0.02) {
            chunk[y * CHUNK_SIZE + lx] = B.GRAVEL;
          } else if (depth > 20 && posHash2(x, y, 10) < 0.004) {
            chunk[y * CHUNK_SIZE + lx] = B.EMERALD_ORE;
          } else if (depth > 15 && posHash2(x, y, 11) < 0.012) {
            chunk[y * CHUNK_SIZE + lx] = B.LAPIS_ORE;
          } else if (depth > 8 && posHash2(x, y, 12) < 0.018) {
            chunk[y * CHUNK_SIZE + lx] = B.REDSTONE_ORE;
          }
          // Stone variants (andesite, diorite, granite)
          else if (posHash2(x, y, 20) < 0.05) {
            const variant = posHash2(x, y, 21);
            if (variant < 0.33) chunk[y * CHUNK_SIZE + lx] = B.ANDESITE;
            else if (variant < 0.66) chunk[y * CHUNK_SIZE + lx] = B.DIORITE;
            else chunk[y * CHUNK_SIZE + lx] = B.GRANITE;
          }
        }
      }
    }

    // Cave generation using multiple noise layers
    for (let y = surfaceH + 8; y < WORLD_HEIGHT - 5; y++) {
      const cave1 = caveNoise(x * 0.03, y * 0.03, 3, 0.5);
      const cave2 = caveNoise(x * 0.06 + 500, y * 0.06 + 500, 2, 0.5);
      const cave3 = caveNoise(x * 0.1 + 1000, y * 0.08 + 1000, 2, 0.6);

      const depth = y - surfaceH;
      const depthFactor = Math.min(1, depth / 30);

      if (cave1 > 0.58 && cave1 < 0.68) {
        chunk[y * CHUNK_SIZE + lx] = B.AIR;
      } else if (cave2 > 0.62 && cave2 < 0.72 && depthFactor > 0.3) {
        chunk[y * CHUNK_SIZE + lx] = B.AIR;
      } else if (cave3 > 0.67 && cave3 < 0.77 && depthFactor > 0.5) {
        chunk[y * CHUNK_SIZE + lx] = B.AIR;
      }
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

  // Biome-specific decorations
  for (let x = startX; x < endX; x++) {
    const biome = getBiome(x);
    const sy = getSurfaceHeight(x);

    // Ocean decorations - kelp, seagrass, coral
    if (biome === 'ocean' || biome === 'frozen_ocean') {
      // Kelp
      if (posHash(x, 750) < 0.08) {
        const kelpHeight = 2 + Math.floor(posHash(x, 751) * 5);
        for (let ky = 1; ky <= kelpHeight && sy - ky > 0; ky++) {
          if (getBlock(x, sy - ky) === B.WATER) {
            setBlock(x, sy - ky, B.KELP);
          }
        }
      }
      // Seagrass
      else if (posHash(x, 752) < 0.15) {
        if (getBlock(x, sy - 1) === B.WATER) {
          setBlock(x, sy - 1, B.SEAGRASS);
        }
      }
      // Coral (only in warm ocean, not frozen)
      if (biome === 'ocean' && posHash(x, 753) < 0.03) {
        const coralType = posHash(x, 754);
        let coral = B.CORAL_BLUE;
        if (coralType < 0.33) coral = B.CORAL_PINK;
        else if (coralType < 0.66) coral = B.CORAL_PURPLE;
        if (getBlock(x, sy - 1) === B.WATER) {
          setBlock(x, sy - 1, coral);
        }
      }
      continue; // Skip tree generation for ocean
    }

    // Desert decorations - cactus, dead bush
    if (biome === 'desert') {
      if (posHash(x, 760) < 0.03) {
        // Cactus
        const cactusH = 1 + Math.floor(posHash(x, 761) * 3);
        for (let cy = 1; cy <= cactusH; cy++) {
          setBlock(x, sy - cy, B.CACTUS);
        }
      } else if (posHash(x, 762) < 0.05) {
        // Dead bush
        setBlock(x, sy - 1, B.DEAD_BUSH);
      }
      continue;
    }

    // Beach decorations - sugar cane near water
    if (biome === 'beach') {
      if (posHash(x, 770) < 0.02) {
        const caneH = 1 + Math.floor(posHash(x, 771) * 3);
        for (let cy = 1; cy <= caneH; cy++) {
          setBlock(x, sy - cy, B.SUGAR_CANE);
        }
      }
      continue;
    }
  }

  // Trees: check this chunk plus neighbors for trees whose leaves extend here
  for (let scanCx = cx - 1; scanCx <= cx + 1; scanCx++) {
    const scanStart = scanCx * CHUNK_SIZE;
    for (let x = scanStart; x < scanStart + CHUNK_SIZE; x++) {
      const biome = getBiome(x);

      // Skip trees in ocean, desert, beach
      if (biome === 'ocean' || biome === 'frozen_ocean' || biome === 'desert' || biome === 'beach') continue;

      // Tree density varies by biome
      let treeDensity = 0.06;
      if (biome === 'jungle') treeDensity = 0.12;
      else if (biome === 'snowy') treeDensity = 0.04;

      if (posHash(x, 100) >= treeDensity) continue;

      // Skip trees too close together
      let tooClose = false;
      for (let px = x - 4; px < x; px++) {
        if (posHash(px, 100) < treeDensity) { tooClose = true; break; }
      }
      if (tooClose) continue;

      const sy = getSurfaceHeight(x);
      const treeH = 4 + Math.floor(posHash(x, 101) * 3);

      // Tree type based on biome
      let logType = B.OAK_LOG;
      let leafType = B.OAK_LEAVES;

      if (biome === 'snowy') {
        logType = B.SPRUCE_LOG;
        leafType = B.SPRUCE_LEAVES;
      } else if (biome === 'jungle') {
        logType = B.JUNGLE_LOG;
        leafType = B.JUNGLE_LEAVES;
      } else if (posHash(x, 102) < 0.3) {
        logType = B.BIRCH_LOG;
        leafType = B.BIRCH_LEAVES;
      }

      // Only place blocks that fall within THIS chunk
      // Trunk
      for (let ty = 1; ty <= treeH; ty++) {
        if (x >= startX && x < endX) {
          setBlock(x, sy - ty, logType);
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
              setBlock(bx, by, leafType);
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
            setBlock(bx, by, leafType);
          }
        }
      }
    }
  }

  // Grass and flowers on plains (skip pools for now, water is in oceans)
  for (let x = startX; x < endX; x++) {
    const biome = getBiome(x);
    if (biome === 'plains' || biome === 'jungle') {
      const sy = getSurfaceHeight(x);
      if (posHash(x, 800) < 0.15 && getBlock(x, sy - 1) === B.AIR) {
        setBlock(x, sy - 1, B.TALL_GRASS);
      } else if (posHash(x, 801) < 0.03 && getBlock(x, sy - 1) === B.AIR) {
        setBlock(x, sy - 1, B.FERN);
      }
    }
  }

  // Village generation for this chunk (only in plains biome)
  const chunkBiome = getBiome(startX + CHUNK_SIZE / 2);
  if (chunkBiome === 'plains') {
    generateVillageForChunk(cx);
  }

  // Ruined portal generation (rare, ~1% chance per chunk)
  if (posHash(cx, 900) < 0.01) {
    generateRuinedPortal(startX + Math.floor(posHash(cx, 901) * CHUNK_SIZE));
  }
}

// Generate a ruined portal structure
function generateRuinedPortal(x) {
  const sy = getSurfaceHeight(x);
  if (sy <= 5) return;

  const baseY = sy;
  const portalHeight = 4 + Math.floor(posHash(x, 910) * 2);
  const ruinLevel = 0.3 + posHash(x, 911) * 0.4;

  // Netherrack base
  for (let dx = -1; dx <= 4; dx++) {
    if (posHash(x + dx, 920) < 0.6) {
      setBlock(x + dx, baseY, B.NETHERRACK);
    }
  }

  // Left pillar
  for (let dy = 0; dy < portalHeight; dy++) {
    if (posHash(x, 930 + dy) < ruinLevel) {
      const block = posHash(x, 940 + dy) < 0.3 ? B.CRYING_OBSIDIAN : B.OBSIDIAN;
      setBlock(x, baseY - 1 - dy, block);
    }
  }

  // Right pillar
  for (let dy = 0; dy < portalHeight; dy++) {
    if (posHash(x + 3, 930 + dy) < ruinLevel) {
      const block = posHash(x + 3, 940 + dy) < 0.3 ? B.CRYING_OBSIDIAN : B.OBSIDIAN;
      setBlock(x + 3, baseY - 1 - dy, block);
    }
  }

  // Bottom
  for (let dx = 1; dx <= 2; dx++) {
    if (posHash(x + dx, 950) < ruinLevel) {
      const block = posHash(x + dx, 951) < 0.3 ? B.CRYING_OBSIDIAN : B.OBSIDIAN;
      setBlock(x + dx, baseY, block);
    }
  }

  // Top (often more damaged)
  for (let dx = 1; dx <= 2; dx++) {
    if (posHash(x + dx, 960) < ruinLevel * 0.5) {
      const block = posHash(x + dx, 961) < 0.3 ? B.CRYING_OBSIDIAN : B.OBSIDIAN;
      setBlock(x + dx, baseY - portalHeight, block);
    }
  }

  // Loot nearby
  if (posHash(x, 970) < 0.5) setBlock(x - 1, baseY, B.NETHERRACK);
  if (posHash(x, 971) < 0.3) setBlock(x + 4, baseY, B.GOLD_BLOCK);

  // Chest with loot (always spawn)
  setBlock(x - 1, baseY - 1, B.CHEST);

  // Spawn loot items on the ground near the chest
  const lootX = (x - 1) * BLOCK_SIZE + BLOCK_SIZE / 2;
  const lootY = (baseY - 2) * BLOCK_SIZE;

  // Random loot table for ruined portals
  const lootTable = [
    { type: B.GOLD_INGOT, count: 1 + Math.floor(posHash(x, 980) * 3), chance: 0.7 },
    { type: B.GOLD_NUGGET, count: 2 + Math.floor(posHash(x, 981) * 6), chance: 0.8 },
    { type: B.OBSIDIAN, count: 1 + Math.floor(posHash(x, 982) * 3), chance: 0.6 },
    { type: B.FLINT_AND_STEEL, count: 1, chance: 0.4 },
    { type: B.IRON_INGOT, count: 1 + Math.floor(posHash(x, 983) * 2), chance: 0.5 },
    { type: B.ENDER_PEARL, count: 1, chance: 0.2 },
    { type: B.GOLDEN_APPLE, count: 1, chance: 0.15 },
    { type: B.DIAMOND, count: 1, chance: 0.1 },
  ];

  for (const loot of lootTable) {
    if (posHash(x, 990 + loot.type) < loot.chance) {
      const item = {
        x: lootX + (posHash(x, 991 + loot.type) - 0.5) * 20,
        y: lootY,
        vx: 0,
        vy: 0,
        type: loot.type,
        count: loot.count,
        w: 16,
        h: 16,
        onGround: true,
        pickupDelay: 0,
        life: 9999999 // Very long life for world-generated loot
      };
      droppedItems.push(item);
    }
  }
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
