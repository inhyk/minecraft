// ============================================================
// Nether Mobs
// ============================================================

let netherMobs = [];
let netherMobSpawnTimer = 0;
const MAX_NETHER_MOBS = 8;
const NETHER_MOB_SPAWN_INTERVAL = 6000;

// Spawn nether mobs
function spawnNetherMobs(dt) {
  if (currentDimension !== DIMENSION.NETHER) return;
  if (netherMobs.length >= MAX_NETHER_MOBS) return;

  netherMobSpawnTimer += dt;
  if (netherMobSpawnTimer < NETHER_MOB_SPAWN_INTERVAL) return;
  netherMobSpawnTimer = 0;

  // Find spawn location
  const spawnX = player.x + (Math.random() - 0.5) * BLOCK_SIZE * 30;
  let spawnY = 30;

  // Find ground level
  for (let y = 20; y < 80; y++) {
    const bx = Math.floor(spawnX / BLOCK_SIZE);
    if (getBlock(bx, y) !== B.AIR && getBlock(bx, y - 1) === B.AIR) {
      spawnY = y - 2;
      break;
    }
  }

  // Choose mob type
  const roll = Math.random();
  let type;
  if (roll < 0.5) {
    type = NETHER_MOB_TYPE.ZOMBIE_PIGMAN;
  } else if (roll < 0.8) {
    type = NETHER_MOB_TYPE.BLAZE;
  } else {
    type = NETHER_MOB_TYPE.GHAST;
  }

  const mob = createNetherMob(type, spawnX, spawnY * BLOCK_SIZE);
  netherMobs.push(mob);
}

function createNetherMob(type, x, y) {
  const base = {
    x, y,
    vx: 0, vy: 0,
    facing: Math.random() < 0.5 ? -1 : 1,
    walkFrame: 0,
    hurtTimer: 0,
    state: 'idle',
    onGround: false,
    type,
    aggroTimer: 0,
    attackCooldown: 0,
  };

  switch (type) {
    case NETHER_MOB_TYPE.ZOMBIE_PIGMAN:
      return {
        ...base,
        w: BLOCK_SIZE * 0.6,
        h: BLOCK_SIZE * 1.8,
        health: 20,
        maxHealth: 20,
        damage: 5,
        speed: 2,
        aggressive: false, // Only attacks when provoked
      };
    case NETHER_MOB_TYPE.BLAZE:
      return {
        ...base,
        w: BLOCK_SIZE * 0.8,
        h: BLOCK_SIZE * 1.2,
        health: 20,
        maxHealth: 20,
        damage: 6,
        speed: 0, // Floats
        flyHeight: y,
        shootCooldown: 0,
      };
    case NETHER_MOB_TYPE.GHAST:
      return {
        ...base,
        w: BLOCK_SIZE * 3,
        h: BLOCK_SIZE * 3,
        health: 10,
        maxHealth: 10,
        damage: 8,
        speed: 0,
        flyHeight: y - BLOCK_SIZE * 3,
        shootCooldown: 0,
      };
  }
}

function updateNetherMobs(dt) {
  if (currentDimension !== DIMENSION.NETHER) return;

  const t = Math.min(dt, 50) / TICK_RATE;

  for (let i = netherMobs.length - 1; i >= 0; i--) {
    const m = netherMobs[i];

    // Update timers
    if (m.hurtTimer > 0) m.hurtTimer -= dt;
    if (m.attackCooldown > 0) m.attackCooldown -= dt;
    if (m.shootCooldown !== undefined && m.shootCooldown > 0) m.shootCooldown -= dt;

    // Player distance
    const pcx = player.x + player.w / 2;
    const pcy = player.y + player.h / 2;
    const mcx = m.x + m.w / 2;
    const mcy = m.y + m.h / 2;
    const dx = pcx - mcx;
    const dy = pcy - mcy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    switch (m.type) {
      case NETHER_MOB_TYPE.ZOMBIE_PIGMAN:
        updateZombiePigman(m, t, dx, dy, dist);
        break;
      case NETHER_MOB_TYPE.BLAZE:
        updateBlaze(m, t, dx, dy, dist);
        break;
      case NETHER_MOB_TYPE.GHAST:
        updateGhast(m, t, dx, dy, dist);
        break;
    }

    // Check death
    if (m.health <= 0) {
      dropNetherMobLoot(m);
      // Achievement
      if (typeof checkNetherMobKillAchievement === 'function') {
        checkNetherMobKillAchievement(m.type);
      }
      netherMobs.splice(i, 1);
      continue;
    }

    // Despawn if too far
    if (dist > BLOCK_SIZE * 50) {
      netherMobs.splice(i, 1);
    }
  }
}

function updateZombiePigman(m, t, dx, dy, dist) {
  // Face player
  if (Math.abs(dx) > 5) m.facing = dx > 0 ? 1 : -1;

  // Only aggressive if attacked
  if (m.aggressive) {
    m.aggroTimer -= t * TICK_RATE;
    if (m.aggroTimer <= 0) {
      m.aggressive = false;
    }

    // Chase player
    if (dist > BLOCK_SIZE) {
      m.vx = m.facing * m.speed * t;
      m.walkFrame += 0.15 * t;
    }

    // Attack
    if (dist < BLOCK_SIZE * 1.5 && m.attackCooldown <= 0) {
      damagePlayer(m.damage);
      m.attackCooldown = 1000;
    }
  } else {
    // Wander
    if (Math.random() < 0.02 * t) {
      m.facing = Math.random() < 0.5 ? -1 : 1;
    }
    if (Math.random() < 0.3) {
      m.vx = m.facing * 0.5 * t;
      m.walkFrame += 0.08 * t;
    }
  }

  // Physics
  m.vy += 0.5 * t;
  m.x += m.vx;
  m.y += m.vy * t;
  m.vx *= 0.8;

  // Ground collision
  const footX = Math.floor((m.x + m.w / 2) / BLOCK_SIZE);
  const footY = Math.floor((m.y + m.h) / BLOCK_SIZE);
  if (getBlock(footX, footY) !== B.AIR && getBlock(footX, footY) !== B.LAVA) {
    m.y = footY * BLOCK_SIZE - m.h;
    m.vy = 0;
    m.onGround = true;
  } else {
    m.onGround = false;
  }
}

function updateBlaze(m, t, dx, dy, dist) {
  // Face player
  if (Math.abs(dx) > 5) m.facing = dx > 0 ? 1 : -1;

  // Float in place
  m.y = m.flyHeight + Math.sin(Date.now() * 0.003) * 10;

  // Shoot fireballs
  if (dist < BLOCK_SIZE * 15 && m.shootCooldown <= 0) {
    shootFireball(m, dx, dy, dist);
    m.shootCooldown = 2000;
  }

  // Slow chase
  if (dist > BLOCK_SIZE * 5) {
    m.x += (dx > 0 ? 1 : -1) * 0.5 * t;
    m.flyHeight += (dy > 0 ? 0.3 : -0.3) * t;
  }
}

function updateGhast(m, t, dx, dy, dist) {
  // Face player
  if (Math.abs(dx) > 5) m.facing = dx > 0 ? 1 : -1;

  // Float
  m.y = m.flyHeight + Math.sin(Date.now() * 0.002) * 20;

  // Slow movement
  if (Math.random() < 0.02) {
    m.vx = (Math.random() - 0.5) * 2;
    m.flyHeight += (Math.random() - 0.5) * 30;
  }
  m.x += m.vx * t;
  m.flyHeight = Math.max(20 * BLOCK_SIZE, Math.min(60 * BLOCK_SIZE, m.flyHeight));

  // Shoot fireballs
  if (dist < BLOCK_SIZE * 25 && m.shootCooldown <= 0) {
    shootGhastFireball(m, dx, dy, dist);
    m.shootCooldown = 3000;
  }
}

// Fireballs array (shared with arrows for simplicity)
let fireballs = [];

function shootFireball(m, dx, dy, dist) {
  const speed = 5;
  const nx = dx / dist;
  const ny = dy / dist;

  fireballs.push({
    x: m.x + m.w / 2,
    y: m.y + m.h / 2,
    vx: nx * speed,
    vy: ny * speed,
    damage: 5,
    type: 'blaze',
    life: 5000,
  });
}

function shootGhastFireball(m, dx, dy, dist) {
  const speed = 4;
  const nx = dx / dist;
  const ny = dy / dist;

  fireballs.push({
    x: m.x + m.w / 2,
    y: m.y + m.h / 2,
    vx: nx * speed,
    vy: ny * speed,
    damage: 8,
    type: 'ghast',
    life: 8000,
    size: 16,
  });
}

function updateFireballs(dt) {
  for (let i = fireballs.length - 1; i >= 0; i--) {
    const f = fireballs[i];
    f.x += f.vx;
    f.y += f.vy;
    f.life -= dt;

    if (f.life <= 0) {
      fireballs.splice(i, 1);
      continue;
    }

    // Hit player
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    const dist = Math.sqrt((f.x - px) ** 2 + (f.y - py) ** 2);
    if (dist < BLOCK_SIZE) {
      damagePlayer(f.damage);
      fireballs.splice(i, 1);
      continue;
    }

    // Hit blocks
    const bx = Math.floor(f.x / BLOCK_SIZE);
    const by = Math.floor(f.y / BLOCK_SIZE);
    const block = getBlock(bx, by);
    if (block !== B.AIR && block !== B.LAVA && block !== B.NETHER_PORTAL) {
      fireballs.splice(i, 1);
      // Explosion particles
      for (let p = 0; p < 8; p++) {
        particles.push({
          x: f.x, y: f.y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 20,
          type: B.NETHERRACK,
          size: 4,
        });
      }
    }
  }
}

function drawFireballs() {
  for (const f of fireballs) {
    const sx = f.x - camera.x;
    const sy = f.y - camera.y;
    const size = f.size || 8;

    // Outer glow
    ctx.fillStyle = f.type === 'ghast' ? '#ff4400' : '#ff8800';
    ctx.beginPath();
    ctx.arc(sx, sy, size + 4, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function dropNetherMobLoot(m) {
  const drops = [];

  switch (m.type) {
    case NETHER_MOB_TYPE.ZOMBIE_PIGMAN:
      drops.push(B.GOLD_NUGGET);
      if (Math.random() < 0.5) drops.push(B.GOLD_NUGGET);
      break;
    case NETHER_MOB_TYPE.BLAZE:
      drops.push(B.BLAZE_ROD);
      if (Math.random() < 0.3) drops.push(B.BLAZE_ROD);
      break;
    case NETHER_MOB_TYPE.GHAST:
      drops.push(B.GHAST_TEAR);
      if (Math.random() < 0.3) drops.push(B.GHAST_TEAR);
      break;
  }

  for (const drop of drops) {
    addToInventory(drop);
  }
}

// Attack nether mob
function attackNetherMob() {
  if (currentDimension !== DIMENSION.NETHER) return false;
  if (inventoryOpen || playerDeathTimer > 0) return false;

  const clickX = mouse.x + camera.x;
  const clickY = mouse.y + camera.y;
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;

  for (let i = 0; i < netherMobs.length; i++) {
    const m = netherMobs[i];
    if (clickX >= m.x && clickX <= m.x + m.w &&
        clickY >= m.y && clickY <= m.y + m.h) {
      const dist = Math.sqrt((pcx - m.x - m.w/2)**2 + (pcy - m.y - m.h/2)**2);
      if (dist < BLOCK_SIZE * 5) {
        const damage = getAttackDamage();
        m.health -= damage;
        m.hurtTimer = 300;
        m.vx = (m.x > pcx ? 1 : -1) * 5;
        m.vy = -4;

        // Zombie Pigman becomes aggressive
        if (m.type === NETHER_MOB_TYPE.ZOMBIE_PIGMAN) {
          m.aggressive = true;
          m.aggroTimer = 30000; // 30 seconds
          // Alert nearby pigmen
          for (const other of netherMobs) {
            if (other.type === NETHER_MOB_TYPE.ZOMBIE_PIGMAN) {
              const odist = Math.sqrt((m.x - other.x)**2 + (m.y - other.y)**2);
              if (odist < BLOCK_SIZE * 15) {
                other.aggressive = true;
                other.aggroTimer = 30000;
              }
            }
          }
        }

        damageHeldTool();
        return true;
      }
    }
  }
  return false;
}

// Draw nether mobs
function drawNetherMobs() {
  if (currentDimension !== DIMENSION.NETHER) return;

  for (const m of netherMobs) {
    const sx = m.x - camera.x;
    const sy = m.y - camera.y;
    if (sx + m.w < -50 || sx > canvas.width + 50) continue;

    const flash = m.hurtTimer > 0;
    ctx.save();
    if (flash) ctx.globalAlpha = 0.5 + Math.sin(m.hurtTimer * 0.05) * 0.3;

    switch (m.type) {
      case NETHER_MOB_TYPE.ZOMBIE_PIGMAN:
        drawZombiePigman(sx, sy, m);
        break;
      case NETHER_MOB_TYPE.BLAZE:
        drawBlaze(sx, sy, m);
        break;
      case NETHER_MOB_TYPE.GHAST:
        drawGhast(sx, sy, m);
        break;
    }

    ctx.restore();

    // Health bar
    if (m.health < m.maxHealth) {
      const barW = m.w;
      const barH = 4;
      ctx.fillStyle = '#400';
      ctx.fillRect(sx, sy - 8, barW, barH);
      ctx.fillStyle = '#e22';
      ctx.fillRect(sx, sy - 8, barW * (m.health / m.maxHealth), barH);
    }
  }
}

function drawZombiePigman(sx, sy, m) {
  const w = m.w, h = m.h, f = m.facing;
  const legSwing = Math.sin(m.walkFrame * 2) * 5;

  // Legs (tattered pants)
  ctx.fillStyle = '#5a4030';
  ctx.fillRect(sx + w*0.1, sy + h*0.6 + legSwing, w*0.35, h*0.4 - legSwing);
  ctx.fillRect(sx + w*0.55, sy + h*0.6 - legSwing, w*0.35, h*0.4 + legSwing);

  // Body (golden armor pieces)
  ctx.fillStyle = '#d4a030';
  ctx.fillRect(sx, sy + h*0.3, w, h*0.35);

  // Pink zombie skin
  ctx.fillStyle = '#e8a0a0';
  ctx.fillRect(sx - w*0.05, sy, w*1.1, h*0.35);

  // Rotting patches
  ctx.fillStyle = '#90a050';
  ctx.fillRect(sx + w*0.2, sy + h*0.1, w*0.2, w*0.15);
  ctx.fillRect(sx + w*0.6, sy + h*0.2, w*0.15, w*0.1);

  // Eyes
  ctx.fillStyle = m.aggressive ? '#ff0000' : '#880000';
  if (f === 1) {
    ctx.fillRect(sx + w*0.5, sy + h*0.14, w*0.12, h*0.06);
    ctx.fillRect(sx + w*0.72, sy + h*0.14, w*0.12, h*0.06);
  } else {
    ctx.fillRect(sx + w*0.18, sy + h*0.14, w*0.12, h*0.06);
    ctx.fillRect(sx + w*0.4, sy + h*0.14, w*0.12, h*0.06);
  }

  // Gold sword
  ctx.fillStyle = '#fcdb4a';
  const swordX = f === 1 ? sx + w + 2 : sx - w*0.4;
  ctx.fillRect(swordX, sy + h*0.35, w*0.15, h*0.35);
}

function drawBlaze(sx, sy, m) {
  const w = m.w, h = m.h;
  const time = Date.now() * 0.01;

  // Rotating rods
  ctx.fillStyle = '#f0a020';
  for (let i = 0; i < 8; i++) {
    const angle = time + i * Math.PI / 4;
    const rx = sx + w/2 + Math.cos(angle) * w * 0.5;
    const ry = sy + h/2 + Math.sin(angle) * h * 0.3;
    ctx.fillRect(rx - 2, ry - 8, 4, 16);
  }

  // Core body
  ctx.fillStyle = '#d08020';
  ctx.fillRect(sx + w*0.25, sy + h*0.25, w*0.5, h*0.5);

  // Glowing center
  ctx.fillStyle = '#ffff80';
  ctx.fillRect(sx + w*0.35, sy + h*0.35, w*0.3, h*0.3);

  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(sx + w*0.3, sy + h*0.35, w*0.12, w*0.08);
  ctx.fillRect(sx + w*0.58, sy + h*0.35, w*0.12, w*0.08);
}

function drawGhast(sx, sy, m) {
  const w = m.w, h = m.h;

  // Main body (white cube)
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(sx, sy, w, h * 0.7);

  // Tentacles
  ctx.fillStyle = '#e0e0e0';
  for (let i = 0; i < 5; i++) {
    const tx = sx + w * 0.1 + i * w * 0.18;
    const ty = sy + h * 0.65;
    const swing = Math.sin(Date.now() * 0.003 + i) * 5;
    ctx.fillRect(tx, ty + swing, w * 0.12, h * 0.35);
  }

  // Eyes (closed = sad, open = attacking)
  ctx.fillStyle = '#880000';
  const eyeSize = w * 0.15;
  ctx.fillRect(sx + w * 0.2, sy + h * 0.2, eyeSize, eyeSize);
  ctx.fillRect(sx + w * 0.65, sy + h * 0.2, eyeSize, eyeSize);

  // Mouth
  ctx.fillStyle = '#660000';
  ctx.fillRect(sx + w * 0.35, sy + h * 0.45, w * 0.3, h * 0.1);
}
