// ============================================================
// End Mobs
// ============================================================

let endMobs = [];
let endMobSpawnTimer = 0;
let enderDragon = null;
const MAX_END_MOBS = 12;
const END_MOB_SPAWN_INTERVAL = 4000;

// Spawn end mobs
function spawnEndMobs(dt) {
  if (currentDimension !== DIMENSION.END) return;

  endMobSpawnTimer += dt;
  if (endMobSpawnTimer < END_MOB_SPAWN_INTERVAL) return;
  endMobSpawnTimer = 0;

  // Spawn Ender Dragon if not exists (only on main island)
  if (!enderDragon) {
    spawnEnderDragon();
  }

  // Spawn Endermen
  if (endMobs.length >= MAX_END_MOBS) return;

  const spawnX = player.x + (Math.random() - 0.5) * BLOCK_SIZE * 40;
  let spawnY = END_PLATFORM_Y - 3;

  // Find ground
  for (let y = 30; y < 90; y++) {
    const bx = Math.floor(spawnX / BLOCK_SIZE);
    if (getBlock(bx, y) === B.END_STONE && getBlock(bx, y - 1) === B.AIR) {
      spawnY = y - 3;
      break;
    }
  }

  const enderman = createEnderman(spawnX, spawnY * BLOCK_SIZE);
  endMobs.push(enderman);
}

function createEnderman(x, y) {
  return {
    x, y,
    vx: 0, vy: 0,
    w: BLOCK_SIZE * 0.5,
    h: BLOCK_SIZE * 2.8,
    health: 40,
    maxHealth: 40,
    damage: 7,
    facing: Math.random() < 0.5 ? -1 : 1,
    walkFrame: 0,
    hurtTimer: 0,
    state: 'idle',
    onGround: false,
    type: END_MOB_TYPE.ENDERMAN,
    aggressive: false,
    teleportCooldown: 0,
    heldBlock: null,
  };
}

function spawnEnderDragon() {
  enderDragon = {
    x: SPAWN_X * BLOCK_SIZE,
    y: (END_PLATFORM_Y - 20) * BLOCK_SIZE,
    w: BLOCK_SIZE * 6,
    h: BLOCK_SIZE * 3,
    health: 200,
    maxHealth: 200,
    damage: 10,
    facing: 1,
    phase: 'circle', // circle, dive, perch
    phaseTimer: 0,
    circleAngle: 0,
    hurtTimer: 0,
    type: END_MOB_TYPE.ENDER_DRAGON,
  };
}

function updateEndMobs(dt) {
  if (currentDimension !== DIMENSION.END) return;

  const t = Math.min(dt, 50) / TICK_RATE;

  // Update Endermen
  for (let i = endMobs.length - 1; i >= 0; i--) {
    const m = endMobs[i];
    updateEnderman(m, t, dt);

    if (m.health <= 0) {
      dropEndermanLoot(m);
      // Achievement
      if (typeof checkEndMobKillAchievement === 'function') {
        checkEndMobKillAchievement(END_MOB_TYPE.ENDERMAN);
      }
      endMobs.splice(i, 1);
      continue;
    }

    // Despawn if too far
    const pcx = player.x + player.w / 2;
    const dist = Math.abs(m.x - pcx);
    if (dist > BLOCK_SIZE * 60) {
      endMobs.splice(i, 1);
    }
  }

  // Update Ender Dragon
  if (enderDragon) {
    updateEnderDragon(dt, t);
  }
}

function updateEnderman(m, t, dt) {
  if (m.hurtTimer > 0) m.hurtTimer -= dt;
  if (m.teleportCooldown > 0) m.teleportCooldown -= dt;

  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;
  const mcx = m.x + m.w / 2;
  const mcy = m.y + m.h / 2;
  const dx = pcx - mcx;
  const dy = pcy - mcy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Check if player is looking at enderman (simplified)
  if (!m.aggressive && dist < BLOCK_SIZE * 10) {
    // Check if mouse is pointing at enderman
    const clickX = mouse.x + camera.x;
    const clickY = mouse.y + camera.y;
    if (clickX >= m.x && clickX <= m.x + m.w &&
        clickY >= m.y && clickY <= m.y + m.h) {
      m.aggressive = true;
    }
  }

  if (m.aggressive) {
    // Face player
    if (Math.abs(dx) > 5) m.facing = dx > 0 ? 1 : -1;

    // Teleport chase
    if (dist > BLOCK_SIZE * 3 && m.teleportCooldown <= 0) {
      // Teleport near player
      const newX = player.x + (Math.random() - 0.5) * BLOCK_SIZE * 4;
      const newY = player.y - BLOCK_SIZE;
      m.x = newX;
      m.y = newY;
      m.teleportCooldown = 2000;

      // Teleport particles
      for (let p = 0; p < 10; p++) {
        particles.push({
          x: mcx, y: mcy,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 15,
          type: B.END_STONE,
          size: 3,
        });
      }
    }

    // Attack
    if (dist < BLOCK_SIZE * 2) {
      m.vx = m.facing * 3 * t;
      m.walkFrame += 0.2 * t;

      if (dist < BLOCK_SIZE && m.teleportCooldown <= 500) {
        damagePlayer(m.damage);
        m.teleportCooldown = 1000;
      }
    }
  } else {
    // Wander randomly
    if (Math.random() < 0.01) {
      m.facing = Math.random() < 0.5 ? -1 : 1;
    }
    if (Math.random() < 0.1) {
      m.vx = m.facing * 1.5 * t;
      m.walkFrame += 0.1 * t;
    }

    // Random teleport
    if (Math.random() < 0.002 && m.teleportCooldown <= 0) {
      m.x += (Math.random() - 0.5) * BLOCK_SIZE * 10;
      m.teleportCooldown = 3000;
    }
  }

  // Physics
  m.vy += 0.5 * t;
  m.x += m.vx;
  m.y += m.vy * t;
  m.vx *= 0.7;

  // Ground collision
  const footX = Math.floor((m.x + m.w / 2) / BLOCK_SIZE);
  const footY = Math.floor((m.y + m.h) / BLOCK_SIZE);
  if (getBlock(footX, footY) === B.END_STONE) {
    m.y = footY * BLOCK_SIZE - m.h;
    m.vy = 0;
    m.onGround = true;
  } else {
    m.onGround = false;
  }

  // Teleport away from damage (20% chance when hurt)
  if (m.hurtTimer > 280 && Math.random() < 0.2 && m.teleportCooldown <= 0) {
    m.x += (Math.random() - 0.5) * BLOCK_SIZE * 8;
    m.teleportCooldown = 1000;
  }
}

function updateEnderDragon(dt, t) {
  const d = enderDragon;
  if (d.hurtTimer > 0) d.hurtTimer -= dt;
  d.phaseTimer += dt;

  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;
  const centerX = SPAWN_X * BLOCK_SIZE;
  const centerY = (END_PLATFORM_Y - 15) * BLOCK_SIZE;

  switch (d.phase) {
    case 'circle':
      // Circle around the arena
      d.circleAngle += 0.001 * t * 60;
      const radius = BLOCK_SIZE * 25;
      d.x = centerX + Math.cos(d.circleAngle) * radius - d.w / 2;
      d.y = centerY + Math.sin(d.circleAngle * 0.3) * BLOCK_SIZE * 5;
      d.facing = Math.cos(d.circleAngle + 0.1) > Math.cos(d.circleAngle) ? 1 : -1;

      // Switch to dive after 10 seconds
      if (d.phaseTimer > 10000) {
        d.phase = 'dive';
        d.phaseTimer = 0;
      }
      break;

    case 'dive':
      // Dive at player
      const dx = pcx - d.x;
      const dy = pcy - d.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      d.x += (dx / dist) * 8 * t;
      d.y += (dy / dist) * 6 * t;
      d.facing = dx > 0 ? 1 : -1;

      // Damage on collision
      if (dist < BLOCK_SIZE * 3) {
        damagePlayer(d.damage);
        d.phase = 'circle';
        d.phaseTimer = 0;
      }

      // Return to circle after 5 seconds
      if (d.phaseTimer > 5000) {
        d.phase = 'circle';
        d.phaseTimer = 0;
      }
      break;
  }

  // Check death
  if (d.health <= 0) {
    // Dragon defeated!
    enderDragon = null;

    // Achievement
    if (typeof checkEndMobKillAchievement === 'function') {
      checkEndMobKillAchievement(END_MOB_TYPE.ENDER_DRAGON);
    }

    // Create exit portal
    for (let dx = -2; dx <= 2; dx++) {
      setBlock(SPAWN_X + dx, END_PLATFORM_Y, B.BEDROCK);
      if (Math.abs(dx) <= 1) {
        setBlock(SPAWN_X + dx, END_PLATFORM_Y - 1, B.END_PORTAL);
      }
    }

    // Victory message
    if (typeof addChatMessage === 'function') {
      addChatMessage('System', 'The Ender Dragon has been defeated!');
    }

    // Drop XP and loot
    for (let i = 0; i < 10; i++) {
      addToInventory(B.ENDER_PEARL);
    }
  }
}

function dropEndermanLoot(m) {
  if (Math.random() < 0.5) {
    addToInventory(B.ENDER_PEARL);
  }
}

// Attack end mob
function attackEndMob() {
  if (currentDimension !== DIMENSION.END) return false;
  if (inventoryOpen || playerDeathTimer > 0) return false;

  const clickX = mouse.x + camera.x;
  const clickY = mouse.y + camera.y;
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;

  // Attack Ender Dragon
  if (enderDragon) {
    const d = enderDragon;
    if (clickX >= d.x && clickX <= d.x + d.w &&
        clickY >= d.y && clickY <= d.y + d.h) {
      const dist = Math.sqrt((pcx - d.x - d.w/2)**2 + (pcy - d.y - d.h/2)**2);
      if (dist < BLOCK_SIZE * 6) {
        const damage = getAttackDamage();
        d.health -= damage;
        d.hurtTimer = 300;
        damageHeldTool();
        return true;
      }
    }
  }

  // Attack Endermen
  for (const m of endMobs) {
    if (clickX >= m.x && clickX <= m.x + m.w &&
        clickY >= m.y && clickY <= m.y + m.h) {
      const dist = Math.sqrt((pcx - m.x - m.w/2)**2 + (pcy - m.y - m.h/2)**2);
      if (dist < BLOCK_SIZE * 5) {
        const damage = getAttackDamage();
        m.health -= damage;
        m.hurtTimer = 300;
        m.aggressive = true;
        damageHeldTool();
        return true;
      }
    }
  }

  return false;
}

// Draw end mobs
function drawEndMobs() {
  if (currentDimension !== DIMENSION.END) return;

  // Draw Endermen
  for (const m of endMobs) {
    const sx = m.x - camera.x;
    const sy = m.y - camera.y;
    if (sx + m.w < -50 || sx > canvas.width + 50) continue;

    const flash = m.hurtTimer > 0;
    ctx.save();
    if (flash) ctx.globalAlpha = 0.5 + Math.sin(m.hurtTimer * 0.05) * 0.3;

    drawEnderman(sx, sy, m);

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

  // Draw Ender Dragon
  if (enderDragon) {
    drawEnderDragon();
  }
}

function drawEnderman(sx, sy, m) {
  const w = m.w, h = m.h, f = m.facing;
  const legSwing = Math.sin(m.walkFrame * 2) * 8;

  // Long thin body
  ctx.fillStyle = '#0a0a0a';

  // Legs (very long and thin)
  ctx.fillRect(sx + w*0.1, sy + h*0.5 + legSwing, w*0.25, h*0.5 - legSwing);
  ctx.fillRect(sx + w*0.65, sy + h*0.5 - legSwing, w*0.25, h*0.5 + legSwing);

  // Body (thin)
  ctx.fillRect(sx + w*0.15, sy + h*0.25, w*0.7, h*0.3);

  // Arms (very long)
  const armLen = h * 0.4;
  ctx.fillRect(sx - w*0.3, sy + h*0.28, w*0.3, armLen);
  ctx.fillRect(sx + w, sy + h*0.28, w*0.3, armLen);

  // Head
  ctx.fillRect(sx, sy, w, h*0.18);

  // Purple eyes
  ctx.fillStyle = m.aggressive ? '#ff00ff' : '#a000a0';
  if (f === 1) {
    ctx.fillRect(sx + w*0.55, sy + h*0.06, w*0.15, h*0.04);
    ctx.fillRect(sx + w*0.78, sy + h*0.06, w*0.15, h*0.04);
  } else {
    ctx.fillRect(sx + w*0.08, sy + h*0.06, w*0.15, h*0.04);
    ctx.fillRect(sx + w*0.32, sy + h*0.06, w*0.15, h*0.04);
  }

  // Particles when aggressive
  if (m.aggressive && Math.random() < 0.3) {
    ctx.fillStyle = '#a000a0';
    ctx.fillRect(
      sx + Math.random() * w,
      sy + Math.random() * h,
      3, 3
    );
  }
}

function drawEnderDragon() {
  const d = enderDragon;
  const sx = d.x - camera.x;
  const sy = d.y - camera.y;

  const flash = d.hurtTimer > 0;
  ctx.save();
  if (flash) ctx.globalAlpha = 0.5 + Math.sin(d.hurtTimer * 0.05) * 0.3;

  const w = d.w, h = d.h, f = d.facing;

  // Wings
  const wingFlap = Math.sin(Date.now() * 0.01) * 20;
  ctx.fillStyle = '#2a2a3a';
  // Left wing
  ctx.beginPath();
  ctx.moveTo(sx + w*0.3, sy + h*0.4);
  ctx.lineTo(sx - w*0.3, sy + h*0.2 + wingFlap);
  ctx.lineTo(sx - w*0.5, sy + h*0.5 + wingFlap);
  ctx.lineTo(sx + w*0.2, sy + h*0.6);
  ctx.closePath();
  ctx.fill();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(sx + w*0.7, sy + h*0.4);
  ctx.lineTo(sx + w*1.3, sy + h*0.2 - wingFlap);
  ctx.lineTo(sx + w*1.5, sy + h*0.5 - wingFlap);
  ctx.lineTo(sx + w*0.8, sy + h*0.6);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.fillStyle = '#1a1a2a';
  ctx.fillRect(sx + w*0.2, sy + h*0.3, w*0.6, h*0.5);

  // Head
  ctx.fillStyle = '#2a2a3a';
  const headX = f === 1 ? sx + w*0.7 : sx - w*0.1;
  ctx.fillRect(headX, sy + h*0.2, w*0.4, h*0.35);

  // Eyes
  ctx.fillStyle = '#ff00ff';
  const eyeX = f === 1 ? headX + w*0.25 : headX + w*0.05;
  ctx.fillRect(eyeX, sy + h*0.28, w*0.08, h*0.1);

  // Tail
  ctx.fillStyle = '#1a1a2a';
  const tailX = f === 1 ? sx : sx + w*0.9;
  ctx.fillRect(tailX, sy + h*0.45, w*0.3, h*0.15);

  ctx.restore();

  // Dragon health bar at top of screen
  const barW = 300;
  const barH = 20;
  const barX = (canvas.width - barW) / 2;
  const barY = 50;

  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(barX - 5, barY - 25, barW + 10, barH + 30);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Ender Dragon', canvas.width / 2, barY - 8);

  ctx.fillStyle = '#400';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = '#f0f';
  ctx.fillRect(barX, barY, barW * (d.health / d.maxHealth), barH);
}
