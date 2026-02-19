// ============================================================
// Configuration Constants
// ============================================================

const BLOCK_SIZE = 32;
const WORLD_HEIGHT = 128;
const SURFACE_Y = 50;
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const MOVE_SPEED = 4;
const MINE_TIME = 300; // ms per block

// Chunk system constants
const CHUNK_SIZE = 16; // blocks per chunk width
const LOAD_DISTANCE = 24; // chunks to load around player
const UNLOAD_DISTANCE = 32; // chunks to unload when far
const SPAWN_X = 1000; // spawn block X coordinate

// Monster system constants
const MAX_MOBS = 6;
const MOB_SPAWN_INTERVAL = 8000; // ms
const MOB_TYPE = { ZOMBIE: 0, CREEPER: 1, SKELETON: 2 };

// Animal system constants
const MAX_ANIMALS = 10;
const ANIMAL_SPAWN_INTERVAL = 5000; // ms
const ANIMAL_TYPE = { PIG: 0, COW: 1, CHICKEN: 2, SHEEP: 3 };

// Network constants
const NET_SEND_RATE = 50; // ms between position updates
const MOB_SYNC_RATE = 100;

// Physics constants
const TICK_RATE = 1000 / 60; // 60fps reference tick

// Inventory constants
const INV_SLOT = 48;
const INV_PAD = 4;
const INV_COLS = 9;

// Village zone constants
const VILLAGE_ZONE_SIZE = 300; // blocks per village zone
const VILLAGE_CHANCE = 0.3; // 30% chance per zone
