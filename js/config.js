// ============================================================
// Configuration Constants
// ============================================================

const BLOCK_SIZE = 32;
const WORLD_WIDTH = 256;
const WORLD_HEIGHT = 128;
const SURFACE_Y = 50;
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const MOVE_SPEED = 4;
const MINE_TIME = 300; // ms per block

// Monster system constants
const MAX_MOBS = 12;
const MOB_SPAWN_INTERVAL = 4000; // ms
const MOB_TYPE = { ZOMBIE: 0, CREEPER: 1, SKELETON: 2 };

// Network constants
const NET_SEND_RATE = 50; // ms between position updates
const MOB_SYNC_RATE = 100;

// Physics constants
const TICK_RATE = 1000 / 60; // 60fps 기준 물리 틱

// Inventory constants
const INV_SLOT = 48;
const INV_PAD = 4;
const INV_COLS = 9;
