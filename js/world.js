// ============================================================
// World Generation
// ============================================================

function initWorldSeed(seed) {
  gameSeed = seed;
  noiseSeed = seed % 10000;
  worldRng = mulberry32(seed);
}

function generateWorld() {
  world = new Array(WORLD_WIDTH * WORLD_HEIGHT).fill(B.AIR);

  // Generate surface heights
  const heights = [];
  for (let x = 0; x < WORLD_WIDTH; x++) {
    const h = noise(x * 0.02, 4, 0.5) * 20 + SURFACE_Y;
    heights[x] = Math.floor(h);
  }

  // Store heights for village generation
  window.surfaceHeights = heights.slice();

  // Fill terrain
  for (let x = 0; x < WORLD_WIDTH; x++) {
    const surfaceH = heights[x];
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      if (y < surfaceH) continue;
      if (y === WORLD_HEIGHT - 1) {
        setBlock(x, y, B.BEDROCK);
      } else if (y === surfaceH) {
        setBlock(x, y, B.GRASS);
      } else if (y < surfaceH + 4) {
        setBlock(x, y, B.DIRT);
      } else {
        setBlock(x, y, B.STONE);

        // Ores
        const depth = y - surfaceH;
        const r = worldRng();
        if (depth > 5 && r < 0.03) setBlock(x, y, B.COAL_ORE);
        else if (depth > 15 && r < 0.015) setBlock(x, y, B.IRON_ORE);
        else if (depth > 30 && r < 0.008) setBlock(x, y, B.GOLD_ORE);
        else if (depth > 8 && r < 0.02) setBlock(x, y, B.COPPER_ORE);
        else if (depth > 45 && r < 0.004) setBlock(x, y, B.DIAMOND_ORE);
      }
    }
  }

  // Caves using 2D noise
  for (let x = 2; x < WORLD_WIDTH - 2; x++) {
    const surfaceH = heights[x];
    for (let y = surfaceH + 5; y < WORLD_HEIGHT - 3; y++) {
      const n1 = noise(x * 0.08 + 100, 3, 0.5);
      const n2 = noise(y * 0.08 + 200, 3, 0.5);
      const cave = Math.sin(n1 * Math.PI * 3) * Math.cos(n2 * Math.PI * 3);
      if (cave > 0.6) {
        setBlock(x, y, B.AIR);
      }
    }
  }

  // Trees
  for (let x = 3; x < WORLD_WIDTH - 3; x++) {
    if (worldRng() < 0.06) {
      const sy = heights[x];
      if (getBlock(x, sy) === B.GRASS) {
        const treeH = 4 + Math.floor(worldRng() * 3);
        // Trunk
        for (let ty = 1; ty <= treeH; ty++) {
          setBlock(x, sy - ty, B.WOOD);
        }
        // Leaves
        for (let lx = -2; lx <= 2; lx++) {
          for (let ly = -2; ly <= 0; ly++) {
            if (Math.abs(lx) === 2 && Math.abs(ly) === 2) continue;
            const bx = x + lx, by = sy - treeH + ly;
            if (bx >= 0 && bx < WORLD_WIDTH && by >= 0 && getBlock(bx, by) === B.AIR) {
              setBlock(bx, by, B.LEAVES);
            }
          }
        }
        setBlock(x, sy - treeH - 1, B.LEAVES);
        if (x + 1 < WORLD_WIDTH) setBlock(x + 1, sy - treeH - 1, B.LEAVES);
        if (x - 1 >= 0) setBlock(x - 1, sy - treeH - 1, B.LEAVES);
        x += 5;
      }
    }
  }

  // Small water pools
  for (let x = 5; x < WORLD_WIDTH - 5; x++) {
    if (worldRng() < 0.01) {
      const sy = heights[x];
      const poolW = 3 + Math.floor(worldRng() * 4);
      for (let px = 0; px < poolW; px++) {
        const bx = x + px;
        if (bx < WORLD_WIDTH) {
          setBlock(bx, sy, B.WATER);
          if (getBlock(bx, sy + 1) === B.GRASS) setBlock(bx, sy + 1, B.SAND);
          if (worldRng() < 0.5) setBlock(bx, sy - 1, B.WATER);
        }
      }
      x += poolW + 3;
    }
  }

  // Generate villages
  generateVillages(heights);

  // Spawn villagers after villages are created
  spawnVillagersFromVillages();
}

function getBlock(x, y) {
  if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT) return B.BEDROCK;
  return world[y * WORLD_WIDTH + x];
}

function setBlock(x, y, type) {
  if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT) return;
  world[y * WORLD_WIDTH + x] = type;
}

function isSolid(x, y) {
  const b = getBlock(x, y);
  return BLOCK_INFO[b] && BLOCK_INFO[b].solid;
}
