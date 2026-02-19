// ============================================================
// Village Generation System (Chunk-compatible)
// ============================================================

// Village structure templates
const VILLAGE_STRUCTURES = {
  SMALL_HOUSE: {
    width: 7,
    height: 6,
    build: function(x, y) {
      for (let fx = 0; fx < 7; fx++) setBlock(x + fx, y, B.COBBLESTONE);
      for (let wy = 1; wy <= 4; wy++) {
        setBlock(x, y - wy, B.PLANKS);
        setBlock(x + 6, y - wy, B.PLANKS);
      }
      for (let wx = 1; wx <= 5; wx++) {
        setBlock(x + wx, y - 4, B.PLANKS);
        if (wx === 3) {
          setBlock(x + wx, y - 2, B.GLASS);
          setBlock(x + wx, y - 3, B.GLASS);
        } else {
          setBlock(x + wx, y - 2, B.PLANKS);
          setBlock(x + wx, y - 3, B.PLANKS);
        }
      }
      setBlock(x + 2, y - 1, B.AIR);
      setBlock(x + 2, y - 2, B.AIR);
      for (let rx = -1; rx <= 7; rx++) setBlock(x + rx, y - 5, B.COBBLESTONE);
      for (let rx = 0; rx <= 6; rx++) setBlock(x + rx, y - 6, B.COBBLESTONE);
    }
  },

  LARGE_HOUSE: {
    width: 10,
    height: 7,
    build: function(x, y) {
      for (let fx = 0; fx < 10; fx++) setBlock(x + fx, y, B.COBBLESTONE);
      for (let wy = 1; wy <= 5; wy++) {
        setBlock(x, y - wy, B.BRICK);
        setBlock(x + 9, y - wy, B.BRICK);
      }
      for (let wx = 1; wx <= 8; wx++) {
        for (let wy = 1; wy <= 5; wy++) {
          if ((wx === 2 || wx === 7) && (wy === 2 || wy === 3)) {
            setBlock(x + wx, y - wy, B.GLASS);
          } else if (wy === 5) {
            setBlock(x + wx, y - wy, B.BRICK);
          } else {
            setBlock(x + wx, y - wy, B.PLANKS);
          }
        }
      }
      setBlock(x + 4, y - 1, B.AIR);
      setBlock(x + 4, y - 2, B.AIR);
      setBlock(x + 5, y - 1, B.AIR);
      setBlock(x + 5, y - 2, B.AIR);
      for (let rx = -1; rx <= 10; rx++) setBlock(x + rx, y - 6, B.BRICK);
      for (let rx = 0; rx <= 9; rx++) setBlock(x + rx, y - 7, B.BRICK);
    }
  },

  WELL: {
    width: 5,
    height: 4,
    build: function(x, y) {
      for (let wx = 0; wx < 5; wx++) setBlock(x + wx, y, B.COBBLESTONE);
      setBlock(x, y - 1, B.COBBLESTONE);
      setBlock(x + 4, y - 1, B.COBBLESTONE);
      setBlock(x, y - 2, B.COBBLESTONE);
      setBlock(x + 4, y - 2, B.COBBLESTONE);
      for (let wx = 1; wx <= 3; wx++) {
        setBlock(x + wx, y - 1, B.WATER);
        setBlock(x + wx, y, B.WATER);
      }
      setBlock(x, y - 3, B.WOOD);
      setBlock(x + 4, y - 3, B.WOOD);
      for (let wx = -1; wx <= 5; wx++) setBlock(x + wx, y - 4, B.PLANKS);
    }
  },

  FARM: {
    width: 8,
    height: 1,
    build: function(x, y) {
      for (let fx = 0; fx < 8; fx++) {
        if (fx === 3 || fx === 4) setBlock(x + fx, y, B.WATER);
        else setBlock(x + fx, y, B.DIRT);
      }
      setBlock(x - 1, y, B.WOOD);
      setBlock(x - 1, y - 1, B.WOOD);
      setBlock(x + 8, y, B.WOOD);
      setBlock(x + 8, y - 1, B.WOOD);
    }
  },

  LAMP_POST: {
    width: 1,
    height: 4,
    build: function(x, y) {
      for (let ly = 1; ly <= 3; ly++) setBlock(x, y - ly, B.WOOD);
      setBlock(x, y - 4, B.GLASS);
      setBlock(x - 1, y - 4, B.PLANKS);
      setBlock(x + 1, y - 4, B.PLANKS);
    }
  },

  BLACKSMITH: {
    width: 9,
    height: 6,
    build: function(x, y) {
      for (let fx = 0; fx < 9; fx++) setBlock(x + fx, y, B.COBBLESTONE);
      for (let wy = 1; wy <= 4; wy++) {
        setBlock(x, y - wy, B.COBBLESTONE);
        setBlock(x + 8, y - wy, B.COBBLESTONE);
        for (let wx = 1; wx <= 7; wx++) {
          if (wy === 4) setBlock(x + wx, y - wy, B.COBBLESTONE);
          else if (wx >= 5 && wy <= 2) setBlock(x + wx, y - wy, B.AIR);
          else setBlock(x + wx, y - wy, B.COBBLESTONE);
        }
      }
      setBlock(x + 2, y - 1, B.AIR);
      setBlock(x + 2, y - 2, B.AIR);
      setBlock(x + 6, y - 1, B.COBBLESTONE);
      setBlock(x + 7, y - 1, B.COBBLESTONE);
      setBlock(x + 1, y - 1, B.CRAFT_TABLE);
      for (let rx = -1; rx <= 9; rx++) setBlock(x + rx, y - 5, B.COBBLESTONE);
      for (let rx = 0; rx <= 8; rx++) setBlock(x + rx, y - 6, B.COBBLESTONE);
    }
  },

  LIBRARY: {
    width: 8,
    height: 7,
    build: function(x, y) {
      for (let fx = 0; fx < 8; fx++) setBlock(x + fx, y, B.PLANKS);
      for (let wy = 1; wy <= 5; wy++) {
        setBlock(x, y - wy, B.PLANKS);
        setBlock(x + 7, y - wy, B.PLANKS);
        for (let wx = 1; wx <= 6; wx++) {
          if (wy === 5) setBlock(x + wx, y - wy, B.PLANKS);
          else if ((wx === 2 || wx === 5) && (wy === 2 || wy === 3)) setBlock(x + wx, y - wy, B.GLASS);
          else setBlock(x + wx, y - wy, B.PLANKS);
        }
      }
      setBlock(x + 3, y - 1, B.AIR);
      setBlock(x + 3, y - 2, B.AIR);
      setBlock(x + 1, y - 1, B.BRICK);
      setBlock(x + 1, y - 2, B.BRICK);
      setBlock(x + 6, y - 1, B.BRICK);
      setBlock(x + 6, y - 2, B.BRICK);
      for (let rx = -1; rx <= 8; rx++) setBlock(x + rx, y - 6, B.BRICK);
      for (let rx = 0; rx <= 7; rx++) setBlock(x + rx, y - 7, B.BRICK);
    }
  }
};

// Village data storage
let villages = [];
let generatedVillageZones = {}; // track which zones have been processed

// --- Zone-based village position (deterministic per zone) ---
function getVillageForZone(zoneX) {
  const h = posHash(zoneX, 5000);
  if (h > VILLAGE_CHANCE) return null;
  const offset = Math.floor(posHash(zoneX, 5001) * (VILLAGE_ZONE_SIZE - 100)) + 50;
  return zoneX * VILLAGE_ZONE_SIZE + offset;
}

function getVillageSize(zoneX) {
  const r = posHash(zoneX, 5002);
  if (r < 0.4) return 'small';
  if (r < 0.8) return 'medium';
  return 'large';
}

function getBuildingTypes(villageSize, zoneX) {
  let types;
  if (villageSize === 'small') {
    types = ['SMALL_HOUSE', 'SMALL_HOUSE', 'WELL'];
  } else if (villageSize === 'medium') {
    types = ['SMALL_HOUSE', 'SMALL_HOUSE', 'LARGE_HOUSE', 'WELL', 'FARM', 'LAMP_POST'];
  } else {
    types = ['SMALL_HOUSE', 'SMALL_HOUSE', 'SMALL_HOUSE', 'LARGE_HOUSE', 'LARGE_HOUSE',
             'WELL', 'FARM', 'FARM', 'BLACKSMITH', 'LIBRARY', 'LAMP_POST', 'LAMP_POST'];
  }
  // Deterministic shuffle using zone hash
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(posHash(zoneX * 100 + i, 5010) * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  return types;
}

function generateVillageForChunk(cx) {
  const startX = cx * CHUNK_SIZE;
  const endX = startX + CHUNK_SIZE;

  // Check which village zones overlap this chunk
  const zoneStart = Math.floor(startX / VILLAGE_ZONE_SIZE) - 1;
  const zoneEnd = Math.floor(endX / VILLAGE_ZONE_SIZE) + 1;

  for (let zoneX = zoneStart; zoneX <= zoneEnd; zoneX++) {
    if (generatedVillageZones[zoneX]) continue;

    const centerX = getVillageForZone(zoneX);
    if (centerX === null) {
      generatedVillageZones[zoneX] = true;
      continue;
    }

    // Check if village overlaps with loaded chunk range
    const villageSize = getVillageSize(zoneX);
    const villageWidth = villageSize === 'small' ? 40 : (villageSize === 'medium' ? 70 : 100);
    const vStartX = centerX - Math.floor(villageWidth / 2);
    const vEndX = centerX + Math.floor(villageWidth / 2);

    // Only generate if we have enough chunks loaded for the entire village
    const vStartCx = Math.floor(vStartX / CHUNK_SIZE);
    const vEndCx = Math.floor(vEndX / CHUNK_SIZE);
    let allLoaded = true;
    for (let vcx = vStartCx; vcx <= vEndCx; vcx++) {
      if (!chunks[vcx]) { allLoaded = false; break; }
    }
    if (!allLoaded) continue;

    generatedVillageZones[zoneX] = true;
    buildVillage(centerX, villageSize, zoneX);
  }
}

function buildVillage(centerX, villageSize, zoneX) {
  const villageWidth = villageSize === 'small' ? 40 : (villageSize === 'medium' ? 70 : 100);
  const vStartX = centerX - Math.floor(villageWidth / 2);
  const vEndX = centerX + Math.floor(villageWidth / 2);

  // Calculate average height
  let avgHeight = 0, count = 0;
  for (let x = vStartX; x <= vEndX; x++) {
    avgHeight += getSurfaceHeight(x);
    count++;
  }
  avgHeight = Math.floor(avgHeight / count);

  // Flatten terrain
  for (let x = vStartX; x <= vEndX; x++) {
    const currentHeight = getSurfaceHeight(x);
    if (currentHeight < avgHeight) {
      for (let y = currentHeight; y < avgHeight; y++) setBlock(x, y, B.DIRT);
      setBlock(x, avgHeight, B.GRASS);
    } else if (currentHeight > avgHeight) {
      for (let y = avgHeight; y < currentHeight; y++) setBlock(x, y, B.AIR);
      setBlock(x, avgHeight, B.GRASS);
    }
  }

  // Road
  for (let x = vStartX; x <= vEndX; x++) {
    setBlock(x, avgHeight, B.COBBLESTONE);
  }

  // Place buildings
  const buildingTypes = getBuildingTypes(villageSize, zoneX);
  const village = { centerX, size: villageSize, buildings: [], villagerSpawns: [] };
  let currentX = vStartX + 3;

  for (const type of buildingTypes) {
    const structure = VILLAGE_STRUCTURES[type];
    if (currentX + structure.width + 3 > vEndX) break;

    structure.build(currentX, avgHeight - 1);
    village.buildings.push({ type, x: currentX, y: avgHeight - 1 });

    if (type.includes('HOUSE') || type === 'BLACKSMITH' || type === 'LIBRARY') {
      village.villagerSpawns.push({
        x: (currentX + structure.width / 2) * BLOCK_SIZE,
        y: (avgHeight - 2) * BLOCK_SIZE,
        profession: type === 'BLACKSMITH' ? 'blacksmith' :
                    type === 'LIBRARY' ? 'librarian' : 'farmer'
      });
    }

    const gap = 4 + Math.floor(posHash(currentX + zoneX * 1000, 5020) * 3);
    currentX += structure.width + gap;
  }

  villages.push(village);

  // Spawn villagers
  for (const spawn of village.villagerSpawns) {
    villagers.push(createVillager(spawn.x, spawn.y, spawn.profession));
  }
}
