// ============================================================
// Monster System
// ============================================================

function createMob(type, x, y) {
  return {
    type,
    x, y,
    w: BLOCK_SIZE * 0.7,
    h: type === MOB_TYPE.CREEPER ? BLOCK_SIZE * 1.4 : BLOCK_SIZE * 1.8,
    vx: 0, vy: 0,
    health: type === MOB_TYPE.SKELETON ? 10 : 12,
    maxHealth: type === MOB_TYPE.SKELETON ? 10 : 12,
    facing: Math.random() < 0.5 ? -1 : 1,
    onGround: false,
    walkFrame: 0,
    hurtTimer: 0,
    state: 'idle', // idle, chase, fuse, explode, shoot
    fuse: 0,       // creeper fuse timer
    shootCooldown: 0,
    idleTimer: 0,
    despawnTimer: 0,
  };
}

function spawnMobs(dt) {
  mobSpawnTimer += dt;
  if (mobSpawnTimer < MOB_SPAWN_INTERVAL) return;
  mobSpawnTimer = 0;
  if (mobs.length >= MAX_MOBS) return;

  // Spawn 15-40 blocks away from player horizontally
  const dir = Math.random() < 0.5 ? -1 : 1;
  const dist = 15 + Math.floor(Math.random() * 25);
  const spawnBX = Math.floor(player.x / BLOCK_SIZE) + dir * dist;

  const playerBY = Math.floor(player.y / BLOCK_SIZE);
  const underground = playerBY > SURFACE_Y + 5;

  let spawnBY = 0;

  if (underground && Math.random() < 0.7) {
    // Underground spawn: find air pocket near player's Y level
    const searchStart = Math.max(SURFACE_Y + 5, playerBY - 10);
    const searchEnd = Math.min(WORLD_HEIGHT - 3, playerBY + 10);
    // Collect valid positions then pick one randomly
    const candidates = [];
    for (let y = searchStart; y < searchEnd; y++) {
      if (!isSolid(spawnBX, y) && !isSolid(spawnBX, y - 1) && isSolid(spawnBX, y + 1)) {
        candidates.push(y - 1);
      }
    }
    if (candidates.length > 0) {
      spawnBY = candidates[Math.floor(Math.random() * candidates.length)];
    }
  }

  if (spawnBY <= 0) {
    // Surface spawn: find first solid from top
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      if (isSolid(spawnBX, y)) { spawnBY = y - 2; break; }
    }
  }
  if (spawnBY <= 0) return;

  // Check space is clear
  if (isSolid(spawnBX, spawnBY) || isSolid(spawnBX, spawnBY + 1)) return;

  // Random mob type
  const roll = Math.random();
  let type;
  if (roll < 0.4) type = MOB_TYPE.ZOMBIE;
  else if (roll < 0.75) type = MOB_TYPE.CREEPER;
  else type = MOB_TYPE.SKELETON;

  mobs.push(createMob(type, spawnBX * BLOCK_SIZE, spawnBY * BLOCK_SIZE));
}

function updateMobs(dt) {
  const t = Math.min(dt, 50) / TICK_RATE;
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;

  for (let i = mobs.length - 1; i >= 0; i--) {
    const m = mobs[i];
    const mcx = m.x + m.w / 2;
    const mcy = m.y + m.h / 2;
    const dx = pcx - mcx;
    const dy = pcy - mcy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    m.hurtTimer = Math.max(0, m.hurtTimer - dt);
    m.despawnTimer += dt;

    // Despawn if too far (>60 blocks) or alive too long (60s)
    if (dist > BLOCK_SIZE * 60 || m.despawnTimer > 60000) {
      mobs.splice(i, 1); continue;
    }

    // Detection range
    const detectRange = m.type === MOB_TYPE.SKELETON ? BLOCK_SIZE * 18 : BLOCK_SIZE * 14;

    // State machine
    if (m.state === 'idle') {
      m.idleTimer += dt;
      // Random walk
      if (m.idleTimer > 1500) {
        m.facing = Math.random() < 0.5 ? -1 : 1;
        m.idleTimer = 0;
      }
      m.vx = m.facing * 0.5 * t;
      if (dist < detectRange) m.state = 'chase';
    }

    if (m.state === 'chase') {
      m.facing = dx > 0 ? 1 : -1;

      if (m.type === MOB_TYPE.ZOMBIE) {
        m.vx = m.facing * 1.5 * t;
        // Attack player on contact
        if (dist < BLOCK_SIZE * 1.2 && playerHurtTimer <= 0 && playerDeathTimer <= 0) {
          damagePlayer(1.5);
        }
      }

      if (m.type === MOB_TYPE.CREEPER) {
        if (dist < BLOCK_SIZE * 2.5) {
          m.state = 'fuse';
          m.fuse = 0;
          m.vx = 0;
        } else {
          m.vx = m.facing * 1.8 * t;
        }
      }

      if (m.type === MOB_TYPE.SKELETON) {
        // Keep distance, shoot
        if (dist < BLOCK_SIZE * 6) {
          m.vx = -m.facing * 1.0 * t; // back away
        } else if (dist > BLOCK_SIZE * 12) {
          m.vx = m.facing * 1.2 * t;
        } else {
          m.vx = 0;
        }
        m.shootCooldown -= dt;
        if (m.shootCooldown <= 0 && dist < BLOCK_SIZE * 16) {
          shootArrow(m, pcx, pcy);
          m.shootCooldown = 2000;
        }
      }

      if (dist > detectRange * 1.5) m.state = 'idle';
    }

    if (m.state === 'fuse' && m.type === MOB_TYPE.CREEPER) {
      m.fuse += dt;
      m.vx = 0;
      m.facing = dx > 0 ? 1 : -1;
      if (dist > BLOCK_SIZE * 4) {
        m.state = 'chase'; m.fuse = 0; // cancel
      }
      if (m.fuse >= 1500) {
        creeperExplode(m);
        mobs.splice(i, 1); continue;
      }
    }

    // Walk animation
    if (Math.abs(m.vx) > 0.1 && m.onGround) {
      m.walkFrame += 0.12 * t;
    } else {
      m.walkFrame *= 0.9;
    }

    // Gravity
    m.vy += GRAVITY * t;
    if (m.vy > 15) m.vy = 15;

    // Jump over obstacles
    if (m.onGround && Math.abs(m.vx) > 0.1) {
      const frontX = Math.floor((m.x + m.w / 2 + m.facing * m.w) / BLOCK_SIZE);
      const feetY = Math.floor((m.y + m.h) / BLOCK_SIZE);
      const headY = Math.floor(m.y / BLOCK_SIZE);
      if (isSolid(frontX, feetY - 1) && !isSolid(frontX, headY - 1)) {
        m.vy = -8;
        m.onGround = false;
      }
    }

    // Move X
    m.x += m.vx;
    mobResolveX(m);

    // Move Y
    m.y += m.vy * t;
    m.onGround = false;
    mobResolveY(m);

    // Remove dead mobs
    if (m.health <= 0) {
      spawnMobDrops(m);
      spawnBreakParticles(Math.floor(m.x / BLOCK_SIZE), Math.floor(m.y / BLOCK_SIZE), B.DIRT);
      mobs.splice(i, 1);
    }
  }
}

function mobResolveX(m) {
  const left = Math.floor(m.x / BLOCK_SIZE);
  const right = Math.floor((m.x + m.w - 1) / BLOCK_SIZE);
  const top = Math.floor(m.y / BLOCK_SIZE);
  const bottom = Math.floor((m.y + m.h - 1) / BLOCK_SIZE);
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (isSolid(x, y)) {
        if (m.vx > 0) m.x = x * BLOCK_SIZE - m.w;
        else if (m.vx < 0) m.x = (x + 1) * BLOCK_SIZE;
        m.vx = 0;
      }
    }
  }
}

function mobResolveY(m) {
  const left = Math.floor(m.x / BLOCK_SIZE);
  const right = Math.floor((m.x + m.w - 1) / BLOCK_SIZE);
  const top = Math.floor(m.y / BLOCK_SIZE);
  const bottom = Math.floor((m.y + m.h - 1) / BLOCK_SIZE);
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (isSolid(x, y)) {
        if (m.vy > 0) { m.y = y * BLOCK_SIZE - m.h; m.vy = 0; m.onGround = true; }
        else if (m.vy < 0) { m.y = (y + 1) * BLOCK_SIZE; m.vy = 0; }
      }
    }
  }
}

function creeperExplode(m) {
  const cx = Math.floor((m.x + m.w / 2) / BLOCK_SIZE);
  const cy = Math.floor((m.y + m.h / 2) / BLOCK_SIZE);
  const radius = 3;

  // Destroy blocks in radius
  for (let bx = cx - radius; bx <= cx + radius; bx++) {
    for (let by = cy - radius; by <= cy + radius; by++) {
      const d = Math.sqrt((bx - cx) ** 2 + (by - cy) ** 2);
      if (d <= radius) {
        const block = getBlock(bx, by);
        if (block !== B.AIR && block !== B.BEDROCK && block !== B.WATER) {
          if (Math.random() < 0.4) addToInventory(BLOCK_INFO[block]?.drop || block);
          setBlock(bx, by, B.AIR);
          if (Math.random() < 0.3) spawnBreakParticles(bx, by, block);
        }
      }
    }
  }

  // Damage player if close
  const dist = Math.sqrt((player.x + player.w/2 - m.x - m.w/2)**2 + (player.y + player.h/2 - m.y - m.h/2)**2);
  if (dist < BLOCK_SIZE * 4) {
    const dmg = Math.max(1, 8 - dist / BLOCK_SIZE);
    damagePlayer(dmg);
  }

  // Explosion particles
  for (let p = 0; p < 20; p++) {
    particles.push({
      x: m.x + m.w/2, y: m.y + m.h/2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.8) * 10,
      life: 20 + Math.random() * 15,
      type: [B.DIRT, B.STONE, B.COBBLESTONE][Math.floor(Math.random() * 3)],
      size: 4 + Math.random() * 6
    });
  }
}

function shootArrow(m, targetX, targetY) {
  const sx = m.x + m.w / 2;
  const sy = m.y + m.h * 0.3;
  const dx = targetX - sx;
  const dy = targetY - sy;
  const len = Math.sqrt(dx*dx + dy*dy);
  const speed = 6;
  arrows.push({
    x: sx, y: sy,
    vx: (dx / len) * speed,
    vy: (dy / len) * speed,
    life: 120,
  });
}

function updateArrows(dt) {
  const t = Math.min(dt, 50) / TICK_RATE;
  for (let i = arrows.length - 1; i >= 0; i--) {
    const a = arrows[i];
    a.x += a.vx * t;
    a.y += a.vy * t;
    a.vy += 0.15 * t;
    a.life -= t;

    // Hit block
    const bx = Math.floor(a.x / BLOCK_SIZE);
    const by = Math.floor(a.y / BLOCK_SIZE);
    if (isSolid(bx, by)) { arrows.splice(i, 1); continue; }

    // Hit player
    if (a.x > player.x && a.x < player.x + player.w &&
        a.y > player.y && a.y < player.y + player.h) {
      damagePlayer(1.5);
      arrows.splice(i, 1); continue;
    }

    if (a.life <= 0) { arrows.splice(i, 1); }
  }
}

function attackMob() {
  if (inventoryOpen || playerDeathTimer > 0) return false;

  const clickX = mouse.x + camera.x;
  const clickY = mouse.y + camera.y;

  for (let i = 0; i < mobs.length; i++) {
    const m = mobs[i];
    if (clickX >= m.x && clickX <= m.x + m.w &&
        clickY >= m.y && clickY <= m.y + m.h) {
      const pcx = player.x + player.w / 2;
      const pcy = player.y + player.h / 2;
      const dist = Math.sqrt((pcx - m.x - m.w/2)**2 + (pcy - m.y - m.h/2)**2);
      if (dist < BLOCK_SIZE * 5) {
        const damage = getAttackDamage();
        const kb = m.x + m.w/2 > pcx ? 1 : -1;

        // In multiplayer, guest sends attack to host
        if (isMultiplayer && !isHost) {
          netSendAttackMob(i, damage, kb);
        } else {
          // Host or singleplayer: apply damage directly
          m.health -= damage;
          m.hurtTimer = 300;
          m.vx = kb * 5;
          m.vy = -4;
          m.onGround = false;
        }
        damageHeldTool();
        return true; // hit one mob only
      }
    }
  }
  return false;
}

function spawnMobDrops(m) {
  // Drop items near where mob died
  if (m.type === MOB_TYPE.ZOMBIE) {
    if (Math.random() < 0.5) addToInventory(B.IRON_ORE);
  } else if (m.type === MOB_TYPE.SKELETON) {
    if (Math.random() < 0.4) addToInventory(B.COAL_ORE);
  }
}

function applyMobState(mobData) {
  // Sync mob array from host data
  mobs = mobData.map(md => {
    const m = createMob(md.type, md.x, md.y);
    m.facing = md.facing;
    m.walkFrame = md.walkFrame;
    m.health = md.health;
    m.maxHealth = md.maxHealth;
    m.state = md.state;
    m.fuse = md.fuse;
    m.hurtTimer = md.hurtTimer;
    return m;
  });
}
