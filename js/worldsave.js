// ============================================================
// World Save/Load System
// ============================================================

const SAVE_VERSION = 1;
const AUTOSAVE_INTERVAL = 30000; // 30 seconds
let autosaveTimer = 0;
let currentWorldName = '';
let savedWorlds = [];

// Initialize saved worlds list from localStorage
function initSavedWorlds() {
  try {
    const saved = localStorage.getItem('minecraft2d_worlds');
    if (saved) {
      savedWorlds = JSON.parse(saved);
    } else {
      savedWorlds = [];
    }
  } catch (e) {
    console.error('Failed to load saved worlds list:', e);
    savedWorlds = [];
  }
}

// Get list of saved worlds
function getSavedWorlds() {
  return savedWorlds;
}

// Save current world
function saveWorld(worldName) {
  if (!worldName) worldName = currentWorldName || 'World ' + Date.now();
  currentWorldName = worldName;

  try {
    // Collect world data
    const worldData = {
      version: SAVE_VERSION,
      name: worldName,
      savedAt: Date.now(),
      seed: gameSeed,
      // Player data
      player: {
        x: player.x,
        y: player.y,
        health: player.health,
        maxHealth: player.maxHealth,
        inventory: player.inventory,
        armor: player.armor,
        offhand: player.offhand,
        selectedSlot: player.selectedSlot,
      },
      // Achievements data (per-world)
      achievements: unlockedAchievements,
      gameStats: gameStats,
      // Current dimension
      dimension: currentDimension,
      // Block changes for each dimension (only save modified chunks)
      dimensions: {}
    };

    // Save chunks for each dimension
    for (const dimId of [DIMENSION.OVERWORLD, DIMENSION.NETHER, DIMENSION.END]) {
      const dimChunks = dimensionChunks[dimId];
      if (dimChunks && Object.keys(dimChunks).length > 0) {
        worldData.dimensions[dimId] = {
          chunks: serializeChunks(dimChunks),
          generated: dimensionChunkGenerated[dimId] || {}
        };
      }
    }

    // Save to localStorage
    const saveKey = 'minecraft2d_world_' + worldName.replace(/[^a-zA-Z0-9]/g, '_');
    localStorage.setItem(saveKey, JSON.stringify(worldData));

    // Update worlds list
    const existingIndex = savedWorlds.findIndex(w => w.name === worldName);
    const worldInfo = {
      name: worldName,
      savedAt: Date.now(),
      seed: gameSeed,
      dimension: getDimensionName()
    };

    if (existingIndex >= 0) {
      savedWorlds[existingIndex] = worldInfo;
    } else {
      savedWorlds.push(worldInfo);
    }
    localStorage.setItem('minecraft2d_worlds', JSON.stringify(savedWorlds));

    console.log('World saved:', worldName);
    return true;
  } catch (e) {
    console.error('Failed to save world:', e);
    return false;
  }
}

// Serialize chunks to a compressed format
function serializeChunks(chunksObj) {
  const result = {};
  for (const [cx, chunk] of Object.entries(chunksObj)) {
    if (chunk && chunk.length > 0) {
      // Convert Uint8Array to regular array for JSON
      result[cx] = Array.from(chunk);
    }
  }
  return result;
}

// Deserialize chunks from saved format
function deserializeChunks(chunksData) {
  const result = {};
  for (const [cx, chunkArray] of Object.entries(chunksData)) {
    result[cx] = new Uint8Array(chunkArray);
  }
  return result;
}

// Load a saved world
function loadWorld(worldName) {
  console.log('loadWorld called for:', worldName);
  try {
    const saveKey = 'minecraft2d_world_' + worldName.replace(/[^a-zA-Z0-9]/g, '_');
    const savedData = localStorage.getItem(saveKey);

    if (!savedData) {
      console.error('World not found:', worldName);
      return false;
    }

    const worldData = JSON.parse(savedData);
    currentWorldName = worldName;

    // Initialize world with saved seed
    initWorldSeed(worldData.seed);

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

    // Load saved dimension data
    if (worldData.dimensions) {
      for (const [dimId, dimData] of Object.entries(worldData.dimensions)) {
        const id = parseInt(dimId);
        if (dimData.chunks) {
          dimensionChunks[id] = deserializeChunks(dimData.chunks);
        }
        if (dimData.generated) {
          dimensionChunkGenerated[id] = dimData.generated;
        }
      }
    }

    // Set current dimension
    currentDimension = worldData.dimension || DIMENSION.OVERWORLD;
    chunks = dimensionChunks[currentDimension];
    chunkGenerated = dimensionChunkGenerated[currentDimension];

    // Create player with saved data
    player = createPlayer();
    if (worldData.player) {
      player.x = worldData.player.x;
      player.y = worldData.player.y;
      player.health = worldData.player.health || 20;
      player.maxHealth = worldData.player.maxHealth || 20;
      player.inventory = worldData.player.inventory || createDefaultInventory();
      player.armor = worldData.player.armor || { helmet: null, chestplate: null, leggings: null, boots: null };
      player.offhand = worldData.player.offhand || null;
      player.selectedSlot = worldData.player.selectedSlot || 0;
    }

    // Initialize other game systems
    initClouds();
    mobs = [];
    animals = [];
    arrows = [];
    droppedItems = [];
    villages = [];
    villagers = [];
    particles = [];
    // Reset dimension-specific mobs
    if (typeof netherMobs !== 'undefined') netherMobs = [];
    if (typeof endMobs !== 'undefined') endMobs = [];
    if (typeof fireballs !== 'undefined') fireballs = [];
    miningProgress = 0;
    miningTarget = null;
    mobSpawnTimer = 0;
    animalSpawnTimer = 0;
    playerHurtTimer = 0;
    playerDeathTimer = 0;
    inventoryOpen = false;
    cursorItem = null;
    chatMessages = [];

    // Set as host for single player (enables mob/animal spawning)
    isHost = true;
    console.log('isHost set to true in loadWorld');
    isMultiplayer = false;

    // Generate any missing chunks around player
    ensureChunksLoaded();

    // Load achievements for this world
    if (worldData.achievements) {
      unlockedAchievements = worldData.achievements;
    } else {
      unlockedAchievements = {};
    }
    if (worldData.gameStats) {
      gameStats = worldData.gameStats;
    } else {
      gameStats = {
        blocksPlaced: 0,
        blocksMined: 0,
        mobsKilled: { zombie: 0, skeleton: 0, creeper: 0, pigman: 0, blaze: 0, ghast: 0, enderman: 0, dragon: 0 },
        animalsKilled: { pig: 0, cow: 0, sheep: 0, chicken: 0 },
        tradesCompleted: 0,
        damageTaken: 0,
        portalLit: false,
        enteredNether: false,
        enteredEnd: false,
      };
    }

    console.log('World loaded:', worldName);
    return true;
  } catch (e) {
    console.error('Failed to load world:', e);
    return false;
  }
}

// Delete a saved world
function deleteWorld(worldName) {
  try {
    const saveKey = 'minecraft2d_world_' + worldName.replace(/[^a-zA-Z0-9]/g, '_');
    localStorage.removeItem(saveKey);

    // Update worlds list
    savedWorlds = savedWorlds.filter(w => w.name !== worldName);
    localStorage.setItem('minecraft2d_worlds', JSON.stringify(savedWorlds));

    console.log('World deleted:', worldName);
    return true;
  } catch (e) {
    console.error('Failed to delete world:', e);
    return false;
  }
}

// Create a new world
function createNewWorld(worldName) {
  if (!worldName) worldName = 'World ' + (savedWorlds.length + 1);
  currentWorldName = worldName;

  // Generate random seed
  const seed = Math.floor(Math.random() * 1000000);
  initWorldSeed(seed);

  // Reset achievements for new world
  unlockedAchievements = {};
  gameStats = {
    blocksPlaced: 0,
    blocksMined: 0,
    mobsKilled: { zombie: 0, skeleton: 0, creeper: 0, pigman: 0, blaze: 0, ghast: 0, enderman: 0, dragon: 0 },
    animalsKilled: { pig: 0, cow: 0, sheep: 0, chicken: 0 },
    tradesCompleted: 0,
    damageTaken: 0,
    portalLit: false,
    enteredNether: false,
    enteredEnd: false,
  };
  achievementQueue = [];
  currentToast = null;

  // Reset everything
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

  generateWorld();

  player = createPlayer();
  initClouds();
  resetGameState();

  // Auto-save the new world
  saveWorld(worldName);

  return true;
}

// Auto-save update (call from game loop)
function updateAutosave(dt) {
  if (!currentWorldName || gameState !== STATE.PLAYING) return;

  autosaveTimer += dt;
  if (autosaveTimer >= AUTOSAVE_INTERVAL) {
    autosaveTimer = 0;
    saveWorld(currentWorldName);
  }
}

// Format date for display
function formatSaveDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
  return date.toLocaleDateString();
}

// Initialize on load
initSavedWorlds();
