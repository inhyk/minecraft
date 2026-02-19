// ============================================================
// Village Generation System
// ============================================================

// Village structure templates
const VILLAGE_STRUCTURES = {
  SMALL_HOUSE: {
    width: 7,
    height: 6,
    build: function(x, y) {
      // Floor
      for (let fx = 0; fx < 7; fx++) {
        setBlock(x + fx, y, B.COBBLESTONE);
      }
      // Walls
      for (let wy = 1; wy <= 4; wy++) {
        setBlock(x, y - wy, B.PLANKS);
        setBlock(x + 6, y - wy, B.PLANKS);
      }
      // Back wall with window
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
      // Door space (2 blocks high)
      setBlock(x + 2, y - 1, B.AIR);
      setBlock(x + 2, y - 2, B.AIR);
      // Roof
      for (let rx = -1; rx <= 7; rx++) {
        setBlock(x + rx, y - 5, B.COBBLESTONE);
      }
      // Roof peak
      for (let rx = 0; rx <= 6; rx++) {
        setBlock(x + rx, y - 6, B.COBBLESTONE);
      }
    }
  },

  LARGE_HOUSE: {
    width: 10,
    height: 7,
    build: function(x, y) {
      // Floor
      for (let fx = 0; fx < 10; fx++) {
        setBlock(x + fx, y, B.COBBLESTONE);
      }
      // Walls
      for (let wy = 1; wy <= 5; wy++) {
        setBlock(x, y - wy, B.BRICK);
        setBlock(x + 9, y - wy, B.BRICK);
      }
      // Back wall
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
      // Door
      setBlock(x + 4, y - 1, B.AIR);
      setBlock(x + 4, y - 2, B.AIR);
      setBlock(x + 5, y - 1, B.AIR);
      setBlock(x + 5, y - 2, B.AIR);
      // Roof
      for (let rx = -1; rx <= 10; rx++) {
        setBlock(x + rx, y - 6, B.BRICK);
      }
      for (let rx = 0; rx <= 9; rx++) {
        setBlock(x + rx, y - 7, B.BRICK);
      }
    }
  },

  WELL: {
    width: 5,
    height: 4,
    build: function(x, y) {
      // Base
      for (let wx = 0; wx < 5; wx++) {
        setBlock(x + wx, y, B.COBBLESTONE);
      }
      // Walls of well
      setBlock(x, y - 1, B.COBBLESTONE);
      setBlock(x + 4, y - 1, B.COBBLESTONE);
      setBlock(x, y - 2, B.COBBLESTONE);
      setBlock(x + 4, y - 2, B.COBBLESTONE);
      // Water inside
      for (let wx = 1; wx <= 3; wx++) {
        setBlock(x + wx, y - 1, B.WATER);
        setBlock(x + wx, y, B.WATER);
      }
      // Roof supports
      setBlock(x, y - 3, B.WOOD);
      setBlock(x + 4, y - 3, B.WOOD);
      // Roof
      for (let wx = -1; wx <= 5; wx++) {
        setBlock(x + wx, y - 4, B.PLANKS);
      }
    }
  },

  FARM: {
    width: 8,
    height: 1,
    build: function(x, y) {
      // Farmland pattern with water channel
      for (let fx = 0; fx < 8; fx++) {
        if (fx === 3 || fx === 4) {
          setBlock(x + fx, y, B.WATER);
        } else {
          setBlock(x + fx, y, B.DIRT);
        }
      }
      // Fence posts at ends
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
      // Pole
      for (let ly = 1; ly <= 3; ly++) {
        setBlock(x, y - ly, B.WOOD);
      }
      // Light (using glass as lantern)
      setBlock(x, y - 4, B.GLASS);
      setBlock(x - 1, y - 4, B.PLANKS);
      setBlock(x + 1, y - 4, B.PLANKS);
    }
  },

  BLACKSMITH: {
    width: 9,
    height: 6,
    build: function(x, y) {
      // Floor
      for (let fx = 0; fx < 9; fx++) {
        setBlock(x + fx, y, B.COBBLESTONE);
      }
      // Walls
      for (let wy = 1; wy <= 4; wy++) {
        setBlock(x, y - wy, B.COBBLESTONE);
        setBlock(x + 8, y - wy, B.COBBLESTONE);
        for (let wx = 1; wx <= 7; wx++) {
          if (wy === 4) {
            setBlock(x + wx, y - wy, B.COBBLESTONE);
          } else if (wx >= 5 && wy <= 2) {
            // Open forge area
            setBlock(x + wx, y - wy, B.AIR);
          } else {
            setBlock(x + wx, y - wy, B.COBBLESTONE);
          }
        }
      }
      // Door
      setBlock(x + 2, y - 1, B.AIR);
      setBlock(x + 2, y - 2, B.AIR);
      // Forge (lava represented by special block area)
      setBlock(x + 6, y - 1, B.COBBLESTONE);
      setBlock(x + 7, y - 1, B.COBBLESTONE);
      // Crafting table
      setBlock(x + 1, y - 1, B.CRAFT_TABLE);
      // Roof
      for (let rx = -1; rx <= 9; rx++) {
        setBlock(x + rx, y - 5, B.COBBLESTONE);
      }
      for (let rx = 0; rx <= 8; rx++) {
        setBlock(x + rx, y - 6, B.COBBLESTONE);
      }
    }
  },

  LIBRARY: {
    width: 8,
    height: 7,
    build: function(x, y) {
      // Floor
      for (let fx = 0; fx < 8; fx++) {
        setBlock(x + fx, y, B.PLANKS);
      }
      // Walls
      for (let wy = 1; wy <= 5; wy++) {
        setBlock(x, y - wy, B.PLANKS);
        setBlock(x + 7, y - wy, B.PLANKS);
        for (let wx = 1; wx <= 6; wx++) {
          if (wy === 5) {
            setBlock(x + wx, y - wy, B.PLANKS);
          } else if ((wx === 2 || wx === 5) && (wy === 2 || wy === 3)) {
            setBlock(x + wx, y - wy, B.GLASS);
          } else {
            setBlock(x + wx, y - wy, B.PLANKS);
          }
        }
      }
      // Door
      setBlock(x + 3, y - 1, B.AIR);
      setBlock(x + 3, y - 2, B.AIR);
      // Bookshelves (using brick as bookshelf representation)
      setBlock(x + 1, y - 1, B.BRICK);
      setBlock(x + 1, y - 2, B.BRICK);
      setBlock(x + 6, y - 1, B.BRICK);
      setBlock(x + 6, y - 2, B.BRICK);
      // Roof
      for (let rx = -1; rx <= 8; rx++) {
        setBlock(x + rx, y - 6, B.BRICK);
      }
      for (let rx = 0; rx <= 7; rx++) {
        setBlock(x + rx, y - 7, B.BRICK);
      }
    }
  }
};

// Village data storage
let villages = [];

function generateVillage(centerX, surfaceHeights) {
  // Determine village size randomly
  const sizeRoll = worldRng();
  let villageSize;
  if (sizeRoll < 0.4) {
    villageSize = 'small'; // 2-3 buildings
  } else if (sizeRoll < 0.8) {
    villageSize = 'medium'; // 4-6 buildings
  } else {
    villageSize = 'large'; // 7+ buildings
  }

  const village = {
    centerX: centerX,
    size: villageSize,
    buildings: [],
    villagerSpawns: []
  };

  // Flatten terrain for village
  const villageWidth = villageSize === 'small' ? 40 : (villageSize === 'medium' ? 70 : 100);
  const startX = Math.max(5, centerX - Math.floor(villageWidth / 2));
  const endX = Math.min(WORLD_WIDTH - 5, centerX + Math.floor(villageWidth / 2));

  // Calculate average height for village area
  let avgHeight = 0;
  let count = 0;
  for (let x = startX; x <= endX; x++) {
    avgHeight += surfaceHeights[x];
    count++;
  }
  avgHeight = Math.floor(avgHeight / count);

  // Flatten terrain
  for (let x = startX; x <= endX; x++) {
    const currentHeight = surfaceHeights[x];
    if (currentHeight < avgHeight) {
      // Fill up to average
      for (let y = currentHeight; y < avgHeight; y++) {
        setBlock(x, y, B.DIRT);
      }
      setBlock(x, avgHeight, B.GRASS);
    } else if (currentHeight > avgHeight) {
      // Remove down to average
      for (let y = avgHeight; y < currentHeight; y++) {
        setBlock(x, y, B.AIR);
      }
      setBlock(x, avgHeight, B.GRASS);
    }
    surfaceHeights[x] = avgHeight;
  }

  // Create path (gravel/cobblestone road)
  for (let x = startX; x <= endX; x++) {
    setBlock(x, avgHeight, B.COBBLESTONE);
  }

  // Decide what buildings to place based on size
  let buildingTypes = [];
  if (villageSize === 'small') {
    buildingTypes = ['SMALL_HOUSE', 'SMALL_HOUSE', 'WELL'];
  } else if (villageSize === 'medium') {
    buildingTypes = ['SMALL_HOUSE', 'SMALL_HOUSE', 'LARGE_HOUSE', 'WELL', 'FARM', 'LAMP_POST'];
  } else {
    buildingTypes = ['SMALL_HOUSE', 'SMALL_HOUSE', 'SMALL_HOUSE', 'LARGE_HOUSE', 'LARGE_HOUSE',
                     'WELL', 'FARM', 'FARM', 'BLACKSMITH', 'LIBRARY', 'LAMP_POST', 'LAMP_POST'];
  }

  // Shuffle buildings
  for (let i = buildingTypes.length - 1; i > 0; i--) {
    const j = Math.floor(worldRng() * (i + 1));
    [buildingTypes[i], buildingTypes[j]] = [buildingTypes[j], buildingTypes[i]];
  }

  // Place buildings
  let currentX = startX + 3;
  for (const type of buildingTypes) {
    const structure = VILLAGE_STRUCTURES[type];
    if (currentX + structure.width + 3 > endX) break;

    // Build the structure
    structure.build(currentX, avgHeight - 1);

    // Record building info
    village.buildings.push({
      type: type,
      x: currentX,
      y: avgHeight - 1
    });

    // Add villager spawn point for houses
    if (type.includes('HOUSE') || type === 'BLACKSMITH' || type === 'LIBRARY') {
      village.villagerSpawns.push({
        x: (currentX + structure.width / 2) * BLOCK_SIZE,
        y: (avgHeight - 2) * BLOCK_SIZE,
        profession: type === 'BLACKSMITH' ? 'blacksmith' :
                    type === 'LIBRARY' ? 'librarian' : 'farmer'
      });
    }

    currentX += structure.width + 4 + Math.floor(worldRng() * 3);
  }

  villages.push(village);
  return village;
}

function generateVillages(surfaceHeights) {
  // Clear existing villages
  villages = [];

  // Decide how many villages (1-2 for small world)
  const numVillages = 1 + Math.floor(worldRng() * 2);

  // Find suitable flat areas for villages
  const suitableAreas = [];
  for (let x = 50; x < WORLD_WIDTH - 50; x += 30) {
    // Check if area is relatively flat
    let minH = Infinity, maxH = -Infinity;
    for (let cx = x - 15; cx <= x + 15; cx++) {
      if (surfaceHeights[cx] !== undefined) {
        minH = Math.min(minH, surfaceHeights[cx]);
        maxH = Math.max(maxH, surfaceHeights[cx]);
      }
    }
    if (maxH - minH < 6) {
      suitableAreas.push(x);
    }
  }

  // Generate villages at suitable locations
  const usedAreas = [];
  for (let i = 0; i < numVillages && suitableAreas.length > 0; i++) {
    // Pick random suitable area
    const idx = Math.floor(worldRng() * suitableAreas.length);
    const centerX = suitableAreas[idx];

    // Check not too close to other villages
    let tooClose = false;
    for (const used of usedAreas) {
      if (Math.abs(centerX - used) < 80) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      generateVillage(centerX, surfaceHeights);
      usedAreas.push(centerX);
    }

    suitableAreas.splice(idx, 1);
  }
}
