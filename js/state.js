// ============================================================
// Game State Variables
// ============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game states
const STATE = { TITLE: 0, PLAYING: 1, CONNECT: 2 };
let gameState = STATE.TITLE;
let chunks = {}; // key: chunkX -> Uint8Array(CHUNK_SIZE * WORLD_HEIGHT)
let chunkGenerated = {}; // key: chunkX -> true (terrain+decor done)
let player = null;
let camera = { x: 0, y: 0 };
let keys = {};
let mouse = { x: 0, y: 0, left: false, right: false };
let miningProgress = 0;
let miningTarget = null;
let lastTime = 0;
let titleParticles = [];
let clouds = [];
let splashTexts = [
  "Also try Terraria!", "100% JavaScript!", "Blocky!",
  "Now in 2D!", "Pixelated!", "Open Source!",
  "Canvas Powered!", "No mods needed!", "Crafty!",
  "Block by block!", "Dig deep!", "Build high!",
  "Tree puncher!", "Diamond finder!", "Cave explorer!"
];
let currentSplash = splashTexts[Math.floor(Math.random() * splashTexts.length)];
let splashScale = 1;
let splashDir = 1;
let titleTime = 0;

// Monster system state
let mobs = [];
let mobSpawnTimer = 0;
let playerHurtTimer = 0;
let playerDeathTimer = 0; // >0 means dead, counts down to respawn
let arrows = []; // skeleton arrows

// Inventory system state
let inventoryOpen = false;
let cursorItem = null;
let craftGrid = [null, null, null, null]; // 2x2 (inventory) or 3x3 (crafting table)
let craftOutput = null;
let craftMode = 2; // 2 = 2x2 (inventory), 3 = 3x3 (crafting table)
let invSlotRects = []; // cached slot rects for click detection
let hoveredSlot = -1;
let tooltipText = '';

// Multiplayer system state
let isMultiplayer = false;
let ws = null;
let myId = null;
let isHost = false;
let otherPlayers = {}; // id -> { name, color, x, y, facing, walkFrame, health, selectedSlot }
let netSendTimer = 0;
let mobSyncTimer = 0;
let serverAddress = 'localhost:3000';
let playerName = 'Player';
let connectInput = 'server'; // 'server' or 'name'
let connectError = '';
let chatMessages = [];
let chatInput = '';
let chatOpen = false;

// Animal system state
let animals = [];
let animalSpawnTimer = 0;

// Particles
let particles = [];

// Title screen
let titleButtons = {};

// Connect screen - auto-detect server address from current URL
let connectFields = { server: location.host || 'localhost:3000', name: 'Player' };
let connectFocus = 'name';
