// ============================================================
// Player and Physics
// ============================================================

function createPlayer() {
  // Find spawn point
  let spawnX = Math.floor(WORLD_WIDTH / 2);
  let spawnY = 0;
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    if (getBlock(spawnX, y) !== B.AIR) {
      spawnY = y - 2;
      break;
    }
  }

  return {
    x: spawnX * BLOCK_SIZE,
    y: spawnY * BLOCK_SIZE,
    w: BLOCK_SIZE * 0.6,
    h: BLOCK_SIZE * 1.8,
    vx: 0,
    vy: 0,
    onGround: false,
    inventory: createDefaultInventory(),
    selectedSlot: 0,
    facing: 1, // 1 = right, -1 = left
    walkFrame: 0,
    health: 20,
    maxHealth: 20,
  };
}

function createDefaultInventory() {
  // 36 slots: 0-8 = hotbar, 9-35 = main inventory (3 rows of 9)
  const inv = new Array(36).fill(null);
  inv[0] = { type: B.DIRT, count: 64 };
  inv[1] = { type: B.COBBLESTONE, count: 64 };
  inv[2] = { type: B.PLANKS, count: 64 };
  inv[3] = { type: B.GLASS, count: 32 };
  inv[4] = { type: B.BRICK, count: 32 };
  inv[5] = { type: B.CRAFT_TABLE, count: 16 };
  inv[6] = { type: B.WOOD, count: 32 };
  inv[7] = { type: B.SAND, count: 32 };
  return inv;
}

function updatePlayer(dt) {
  // Don't move when inventory is open or dead
  if (inventoryOpen || playerDeathTimer > 0) return;

  // Frame-rate independent time scale (1.0 at 60fps)
  const t = Math.min(dt, 50) / TICK_RATE;

  // Movement
  player.vx = 0;
  if (keys['KeyA'] || keys['ArrowLeft']) { player.vx = -MOVE_SPEED * t; player.facing = -1; }
  if (keys['KeyD'] || keys['ArrowRight']) { player.vx = MOVE_SPEED * t; player.facing = 1; }

  if ((keys['KeyW'] || keys['Space'] || keys['ArrowUp']) && player.onGround) {
    player.vy = JUMP_FORCE;
    player.onGround = false;
  }

  // Gravity (scaled by time)
  player.vy += GRAVITY * t;
  if (player.vy > 15) player.vy = 15;

  // Walk animation
  if (Math.abs(player.vx) > 0 && player.onGround) {
    player.walkFrame += 0.15 * t;
  } else {
    player.walkFrame = 0;
  }

  // Horizontal collision
  player.x += player.vx;
  resolveCollisionX();

  // Vertical collision
  player.y += player.vy * t;
  player.onGround = false;
  resolveCollisionY();
}

function getPlayerBlocks() {
  const left = Math.floor(player.x / BLOCK_SIZE);
  const right = Math.floor((player.x + player.w - 1) / BLOCK_SIZE);
  const top = Math.floor(player.y / BLOCK_SIZE);
  const bottom = Math.floor((player.y + player.h - 1) / BLOCK_SIZE);
  return { left, right, top, bottom };
}

function resolveCollisionX() {
  const pb = getPlayerBlocks();
  for (let y = pb.top; y <= pb.bottom; y++) {
    for (let x = pb.left; x <= pb.right; x++) {
      if (isSolid(x, y)) {
        if (player.vx > 0) {
          player.x = x * BLOCK_SIZE - player.w;
        } else if (player.vx < 0) {
          player.x = (x + 1) * BLOCK_SIZE;
        }
        player.vx = 0;
      }
    }
  }
}

function resolveCollisionY() {
  const pb = getPlayerBlocks();
  for (let y = pb.top; y <= pb.bottom; y++) {
    for (let x = pb.left; x <= pb.right; x++) {
      if (isSolid(x, y)) {
        if (player.vy > 0) {
          player.y = y * BLOCK_SIZE - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0) {
          player.y = (y + 1) * BLOCK_SIZE;
          player.vy = 0;
        }
      }
    }
  }
}

function damagePlayer(amount) {
  if (playerHurtTimer > 0 || playerDeathTimer > 0) return;
  player.health -= amount;
  playerHurtTimer = 500; // invincibility frames

  if (player.health <= 0) {
    player.health = 0;
    playerDeathTimer = 3000;
  }
}

function updatePlayerStatus(dt) {
  if (playerHurtTimer > 0) playerHurtTimer -= dt;
  if (playerDeathTimer > 0) {
    playerDeathTimer -= dt;
    if (playerDeathTimer <= 0) {
      respawnPlayer();
    }
  }
}

function respawnPlayer() {
  let spawnX = Math.floor(WORLD_WIDTH / 2);
  let spawnY = 0;
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    if (getBlock(spawnX, y) !== B.AIR) { spawnY = y - 2; break; }
  }
  player.x = spawnX * BLOCK_SIZE;
  player.y = spawnY * BLOCK_SIZE;
  player.vx = 0; player.vy = 0;
  player.health = player.maxHealth;
  playerDeathTimer = 0;
  playerHurtTimer = 1000;
}
