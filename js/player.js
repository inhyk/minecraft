// ============================================================
// Player and Physics
// ============================================================

function createPlayer() {
  // Find spawn point
  let spawnX = SPAWN_X;
  let spawnY = getSurfaceHeight(spawnX) - 2;

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
    offhand: null, // Left hand slot
    facing: 1, // 1 = right, -1 = left
    walkFrame: 0,
    health: 20,
    maxHealth: 20,
    armor: {
      helmet: null,
      chestplate: null,
      leggings: null,
      boots: null
    },
  };
}

function createDefaultInventory() {
  // 36 slots: 0-8 = hotbar, 9-35 = main inventory (3 rows of 9)
  return new Array(36).fill(null);
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

function getTotalArmorDefense() {
  if (!player || !player.armor) return 0;
  let defense = 0;
  const slots = ['helmet', 'chestplate', 'leggings', 'boots'];
  for (const slot of slots) {
    const armor = player.armor[slot];
    if (armor) {
      const info = BLOCK_INFO[armor.type];
      if (info && info.defense) {
        defense += info.defense;
      }
    }
  }
  return defense;
}

function damageArmor() {
  if (!player || !player.armor) return;
  const slots = ['helmet', 'chestplate', 'leggings', 'boots'];
  for (const slot of slots) {
    const armor = player.armor[slot];
    if (armor) {
      const maxDur = getMaxDurability(armor.type);
      if (maxDur > 0) {
        if (armor.durability === undefined) armor.durability = maxDur;
        armor.durability--;
        if (armor.durability <= 0) {
          player.armor[slot] = null;
        }
      }
    }
  }
}

function damagePlayer(amount) {
  if (playerHurtTimer > 0 || playerDeathTimer > 0) return;

  // Calculate armor reduction
  const armorDefense = getTotalArmorDefense();
  // Each defense point reduces damage by 4%
  const reduction = Math.min(0.8, armorDefense * 0.04);
  const actualDamage = Math.max(0.5, amount * (1 - reduction));

  player.health -= actualDamage;
  playerHurtTimer = 500; // invincibility frames

  // Sound effect
  if (typeof playHurtSound === 'function') playHurtSound();

  // Achievement for taking damage
  if (typeof onPlayerDamage === 'function') {
    onPlayerDamage(actualDamage);
  }

  // Damage armor when hit
  if (armorDefense > 0) {
    damageArmor();
  }

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
  let spawnX = SPAWN_X;
  let spawnY = getSurfaceHeight(spawnX) - 2;
  player.x = spawnX * BLOCK_SIZE;
  player.y = spawnY * BLOCK_SIZE;
  player.vx = 0; player.vy = 0;
  player.health = player.maxHealth;
  playerDeathTimer = 0;
  playerHurtTimer = 1000;
}
