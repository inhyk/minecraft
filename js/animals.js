// ============================================================
// Animal System (Passive Mobs)
// ============================================================

function createAnimal(type, x, y) {
  const sizes = {
    [ANIMAL_TYPE.PIG]:     { w: BLOCK_SIZE * 0.8, h: BLOCK_SIZE * 0.7 },
    [ANIMAL_TYPE.COW]:     { w: BLOCK_SIZE * 0.9, h: BLOCK_SIZE * 1.0 },
    [ANIMAL_TYPE.CHICKEN]: { w: BLOCK_SIZE * 0.5, h: BLOCK_SIZE * 0.6 },
    [ANIMAL_TYPE.SHEEP]:   { w: BLOCK_SIZE * 0.8, h: BLOCK_SIZE * 0.8 },
  };
  const hp = { [ANIMAL_TYPE.PIG]: 6, [ANIMAL_TYPE.COW]: 8, [ANIMAL_TYPE.CHICKEN]: 3, [ANIMAL_TYPE.SHEEP]: 6 };
  const s = sizes[type];
  return {
    type,
    x, y,
    w: s.w, h: s.h,
    vx: 0, vy: 0,
    health: hp[type],
    maxHealth: hp[type],
    facing: Math.random() < 0.5 ? -1 : 1,
    onGround: false,
    walkFrame: 0,
    hurtTimer: 0,
    state: 'idle',     // idle, wander, flee
    idleTimer: 0,
    wanderTimer: 0,
    fleeTimer: 0,
  };
}

function spawnAnimals(dt) {
  animalSpawnTimer += dt;
  if (animalSpawnTimer < ANIMAL_SPAWN_INTERVAL) return;
  animalSpawnTimer = 0;
  if (animals.length >= MAX_ANIMALS) return;

  // Spawn 10-30 blocks away from player
  const dir = Math.random() < 0.5 ? -1 : 1;
  const dist = 10 + Math.floor(Math.random() * 20);
  const spawnBX = Math.floor(player.x / BLOCK_SIZE) + dir * dist;
  // No world bounds check needed (infinite world)

  // Find surface
  let spawnBY = 0;
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    if (isSolid(spawnBX, y)) { spawnBY = y - 1; break; }
  }
  if (spawnBY <= 0) return;

  // Only spawn on grass (surface)
  if (getBlock(spawnBX, spawnBY + 1) !== B.GRASS) return;

  // Check space is clear
  if (isSolid(spawnBX, spawnBY)) return;

  // Random animal type
  const roll = Math.random();
  let type;
  if (roll < 0.3) type = ANIMAL_TYPE.PIG;
  else if (roll < 0.55) type = ANIMAL_TYPE.COW;
  else if (roll < 0.8) type = ANIMAL_TYPE.CHICKEN;
  else type = ANIMAL_TYPE.SHEEP;

  const a = createAnimal(type, spawnBX * BLOCK_SIZE, spawnBY * BLOCK_SIZE);
  // Place feet on ground
  a.y = (spawnBY + 1) * BLOCK_SIZE - a.h;
  animals.push(a);
}

function updateAnimals(dt) {
  const t = Math.min(dt, 50) / TICK_RATE;
  const pcx = player.x + player.w / 2;

  for (let i = animals.length - 1; i >= 0; i--) {
    const a = animals[i];
    const acx = a.x + a.w / 2;
    const dist = Math.abs(pcx - acx);

    a.hurtTimer = Math.max(0, a.hurtTimer - dt);

    // Despawn if too far (>80 blocks)
    if (dist > BLOCK_SIZE * 80) {
      animals.splice(i, 1); continue;
    }

    // State machine
    if (a.state === 'flee') {
      a.fleeTimer -= dt;
      // Run away from player
      a.facing = pcx > acx ? -1 : 1;
      const speed = a.type === ANIMAL_TYPE.CHICKEN ? 2.5 : 2.0;
      a.vx = a.facing * speed * t;
      if (a.fleeTimer <= 0) {
        a.state = 'idle';
        a.idleTimer = 0;
      }
    } else if (a.state === 'wander') {
      a.wanderTimer -= dt;
      a.vx = a.facing * 0.6 * t;
      if (a.wanderTimer <= 0) {
        a.state = 'idle';
        a.idleTimer = 0;
        a.vx = 0;
      }
    } else {
      // idle
      a.vx = 0;
      a.idleTimer += dt;
      if (a.idleTimer > 1500 + Math.random() * 2000) {
        a.state = 'wander';
        a.facing = Math.random() < 0.5 ? -1 : 1;
        a.wanderTimer = 800 + Math.random() * 1500;
        a.idleTimer = 0;
      }
    }

    // Chicken flap (slow fall)
    if (a.type === ANIMAL_TYPE.CHICKEN && !a.onGround && a.vy > 0) {
      a.vy = Math.min(a.vy, 2);
    }

    // Walk animation
    if (Math.abs(a.vx) > 0.1 && a.onGround) {
      a.walkFrame += 0.12 * t;
    } else {
      a.walkFrame *= 0.9;
    }

    // Gravity
    a.vy += GRAVITY * t;
    if (a.vy > 15) a.vy = 15;

    // Jump over 1-block obstacles
    if (a.onGround && Math.abs(a.vx) > 0.1) {
      const frontX = Math.floor((a.x + a.w / 2 + a.facing * a.w) / BLOCK_SIZE);
      const feetY = Math.floor((a.y + a.h) / BLOCK_SIZE);
      const headY = Math.floor(a.y / BLOCK_SIZE);
      if (isSolid(frontX, feetY - 1) && !isSolid(frontX, headY - 1)) {
        a.vy = -7;
        a.onGround = false;
      }
    }

    // Move X
    a.x += a.vx;
    animalResolveX(a);

    // Move Y
    a.y += a.vy * t;
    a.onGround = false;
    animalResolveY(a);

    // Remove dead animals
    if (a.health <= 0) {
      spawnAnimalDrops(a);
      spawnBreakParticles(Math.floor(a.x / BLOCK_SIZE), Math.floor(a.y / BLOCK_SIZE), B.DIRT);
      // Achievement
      if (typeof checkAnimalKillAchievement === 'function') {
        checkAnimalKillAchievement(a.type);
      }
      animals.splice(i, 1);
    }
  }
}

function animalResolveX(a) {
  const left = Math.floor(a.x / BLOCK_SIZE);
  const right = Math.floor((a.x + a.w - 1) / BLOCK_SIZE);
  const top = Math.floor(a.y / BLOCK_SIZE);
  const bottom = Math.floor((a.y + a.h - 1) / BLOCK_SIZE);
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (isSolid(x, y)) {
        if (a.vx > 0) a.x = x * BLOCK_SIZE - a.w;
        else if (a.vx < 0) a.x = (x + 1) * BLOCK_SIZE;
        a.vx = 0;
      }
    }
  }
}

function animalResolveY(a) {
  const left = Math.floor(a.x / BLOCK_SIZE);
  const right = Math.floor((a.x + a.w - 1) / BLOCK_SIZE);
  const top = Math.floor(a.y / BLOCK_SIZE);
  const bottom = Math.floor((a.y + a.h - 1) / BLOCK_SIZE);
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (isSolid(x, y)) {
        if (a.vy > 0) { a.y = y * BLOCK_SIZE - a.h; a.vy = 0; a.onGround = true; }
        else if (a.vy < 0) { a.y = (y + 1) * BLOCK_SIZE; a.vy = 0; }
      }
    }
  }
}

function attackAnimal() {
  if (inventoryOpen || playerDeathTimer > 0) return false;

  const clickX = mouse.x + camera.x;
  const clickY = mouse.y + camera.y;
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;

  for (let i = 0; i < animals.length; i++) {
    const a = animals[i];
    if (clickX >= a.x && clickX <= a.x + a.w &&
        clickY >= a.y && clickY <= a.y + a.h) {
      const dist = Math.sqrt((pcx - a.x - a.w/2)**2 + (pcy - a.y - a.h/2)**2);
      if (dist < BLOCK_SIZE * 5) {
        const damage = getAttackDamage();
        const kb = a.x + a.w/2 > pcx ? 1 : -1;

        // In multiplayer, guest sends attack to host
        if (isMultiplayer && !isHost) {
          netSendAttackAnimal(i, damage, kb);
        } else {
          // Host or singleplayer: apply damage directly
          a.health -= damage;
          a.hurtTimer = 300;
          a.vx = kb * 4;
          a.vy = -3;
          a.onGround = false;
          a.state = 'flee';
          a.fleeTimer = 2000;
          a.lastAttackerId = myId; // Track attacker for drops
        }
        damageHeldTool();
        return true;
      }
    }
  }
  return false;
}

function spawnAnimalDrops(a) {
  // Collect drops
  const drops = [];
  switch (a.type) {
    case ANIMAL_TYPE.PIG:
      drops.push(B.RAW_PORK);
      if (Math.random() < 0.5) drops.push(B.RAW_PORK);
      break;
    case ANIMAL_TYPE.COW:
      drops.push(B.RAW_BEEF);
      if (Math.random() < 0.5) drops.push(B.RAW_BEEF);
      drops.push(B.LEATHER);
      break;
    case ANIMAL_TYPE.CHICKEN:
      drops.push(B.RAW_CHICKEN);
      drops.push(B.FEATHER);
      if (Math.random() < 0.3) drops.push(B.FEATHER);
      break;
    case ANIMAL_TYPE.SHEEP:
      drops.push(B.WOOL);
      if (Math.random() < 0.7) drops.push(B.WOOL);
      break;
  }

  // Give drops to attacker
  for (const item of drops) {
    if (isMultiplayer && a.lastAttackerId) {
      if (a.lastAttackerId === myId) {
        addToInventory(item);
      } else {
        netSendMobDrop(a.lastAttackerId, item);
      }
    } else {
      addToInventory(item);
    }
  }
}

// --- Animal Rendering ---
function drawAnimals() {
  for (const a of animals) {
    const sx = a.x - camera.x;
    const sy = a.y - camera.y;
    if (sx + a.w < -50 || sx > canvas.width + 50) continue;

    const flash = a.hurtTimer > 0;
    ctx.save();
    if (flash) ctx.globalAlpha = 0.5 + Math.sin(a.hurtTimer * 0.05) * 0.3;

    if (a.type === ANIMAL_TYPE.PIG) drawPig(sx, sy, a);
    else if (a.type === ANIMAL_TYPE.COW) drawCow(sx, sy, a);
    else if (a.type === ANIMAL_TYPE.CHICKEN) drawChicken(sx, sy, a);
    else if (a.type === ANIMAL_TYPE.SHEEP) drawSheep(sx, sy, a);

    ctx.restore();

    // Health bar (if damaged)
    if (a.health < a.maxHealth) {
      const barW = a.w;
      const barH = 4;
      const barX = sx;
      const barY = sy - 8;
      ctx.fillStyle = '#400';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = '#4e4';
      ctx.fillRect(barX, barY, barW * (a.health / a.maxHealth), barH);
    }
  }
}

function drawPig(sx, sy, a) {
  const w = a.w, h = a.h, f = a.facing;
  const legSwing = Math.sin(a.walkFrame * 2) * 4;

  // Legs (short, pink)
  ctx.fillStyle = '#d4856a';
  ctx.fillRect(sx + w*0.1, sy + h*0.65 + legSwing, w*0.2, h*0.35 - legSwing);
  ctx.fillRect(sx + w*0.35, sy + h*0.65 - legSwing, w*0.2, h*0.35 + legSwing);
  ctx.fillRect(sx + w*0.55, sy + h*0.65 + legSwing, w*0.2, h*0.35 - legSwing);
  ctx.fillRect(sx + w*0.75, sy + h*0.65 - legSwing, w*0.2, h*0.35 + legSwing);

  // Body (pink, rounded)
  ctx.fillStyle = '#f0a0a0';
  ctx.fillRect(sx + w*0.05, sy + h*0.15, w*0.9, h*0.55);

  // Head
  ctx.fillStyle = '#f0a0a0';
  if (f === 1) {
    ctx.fillRect(sx + w*0.7, sy, w*0.35, h*0.45);
    // Snout
    ctx.fillStyle = '#e88888';
    ctx.fillRect(sx + w*0.9, sy + h*0.15, w*0.2, h*0.2);
    // Nostrils
    ctx.fillStyle = '#c06060';
    ctx.fillRect(sx + w*0.95, sy + h*0.2, w*0.06, h*0.06);
    ctx.fillRect(sx + w*1.02, sy + h*0.2, w*0.06, h*0.06);
    // Eye
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + w*0.8, sy + h*0.1, w*0.08, h*0.08);
  } else {
    ctx.fillRect(sx - w*0.05, sy, w*0.35, h*0.45);
    ctx.fillStyle = '#e88888';
    ctx.fillRect(sx - w*0.1, sy + h*0.15, w*0.2, h*0.2);
    ctx.fillStyle = '#c06060';
    ctx.fillRect(sx - w*0.08, sy + h*0.2, w*0.06, h*0.06);
    ctx.fillRect(sx - w*0.01, sy + h*0.2, w*0.06, h*0.06);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + w*0.15, sy + h*0.1, w*0.08, h*0.08);
  }

  // Ears
  ctx.fillStyle = '#e89090';
  if (f === 1) {
    ctx.fillRect(sx + w*0.72, sy - h*0.05, w*0.1, h*0.1);
    ctx.fillRect(sx + w*0.86, sy - h*0.05, w*0.1, h*0.1);
  } else {
    ctx.fillRect(sx + w*0.05, sy - h*0.05, w*0.1, h*0.1);
    ctx.fillRect(sx + w*0.19, sy - h*0.05, w*0.1, h*0.1);
  }
}

function drawCow(sx, sy, a) {
  const w = a.w, h = a.h, f = a.facing;
  const legSwing = Math.sin(a.walkFrame * 2) * 4;

  // Legs (dark brown)
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(sx + w*0.08, sy + h*0.6 + legSwing, w*0.15, h*0.4 - legSwing);
  ctx.fillRect(sx + w*0.28, sy + h*0.6 - legSwing, w*0.15, h*0.4 + legSwing);
  ctx.fillRect(sx + w*0.58, sy + h*0.6 + legSwing, w*0.15, h*0.4 - legSwing);
  ctx.fillRect(sx + w*0.78, sy + h*0.6 - legSwing, w*0.15, h*0.4 + legSwing);

  // Body (brown with white spots)
  ctx.fillStyle = '#6B4226';
  ctx.fillRect(sx + w*0.05, sy + h*0.2, w*0.9, h*0.45);
  // White patches
  ctx.fillStyle = '#f0f0e0';
  ctx.fillRect(sx + w*0.2, sy + h*0.25, w*0.2, h*0.15);
  ctx.fillRect(sx + w*0.55, sy + h*0.35, w*0.25, h*0.15);

  // Head
  ctx.fillStyle = '#6B4226';
  if (f === 1) {
    ctx.fillRect(sx + w*0.75, sy, w*0.3, h*0.4);
    // Muzzle
    ctx.fillStyle = '#d4b896';
    ctx.fillRect(sx + w*0.9, sy + h*0.15, w*0.2, h*0.2);
    // Nostrils
    ctx.fillStyle = '#444';
    ctx.fillRect(sx + w*0.95, sy + h*0.22, w*0.05, h*0.05);
    ctx.fillRect(sx + w*1.02, sy + h*0.22, w*0.05, h*0.05);
    // Eye
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + w*0.85, sy + h*0.06, w*0.07, h*0.07);
    // Horns
    ctx.fillStyle = '#ddd';
    ctx.fillRect(sx + w*0.78, sy - h*0.08, w*0.06, h*0.1);
    ctx.fillRect(sx + w*0.92, sy - h*0.08, w*0.06, h*0.1);
  } else {
    ctx.fillRect(sx - w*0.05, sy, w*0.3, h*0.4);
    ctx.fillStyle = '#d4b896';
    ctx.fillRect(sx - w*0.1, sy + h*0.15, w*0.2, h*0.2);
    ctx.fillStyle = '#444';
    ctx.fillRect(sx - w*0.07, sy + h*0.22, w*0.05, h*0.05);
    ctx.fillRect(sx, sy + h*0.22, w*0.05, h*0.05);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + w*0.1, sy + h*0.06, w*0.07, h*0.07);
    ctx.fillStyle = '#ddd';
    ctx.fillRect(sx + w*0.04, sy - h*0.08, w*0.06, h*0.1);
    ctx.fillRect(sx + w*0.18, sy - h*0.08, w*0.06, h*0.1);
  }
}

function drawChicken(sx, sy, a) {
  const w = a.w, h = a.h, f = a.facing;
  const legSwing = Math.sin(a.walkFrame * 3) * 3;

  // Legs (thin orange)
  ctx.fillStyle = '#e8a020';
  ctx.fillRect(sx + w*0.25, sy + h*0.7 + legSwing, w*0.12, h*0.3 - legSwing);
  ctx.fillRect(sx + w*0.6, sy + h*0.7 - legSwing, w*0.12, h*0.3 + legSwing);

  // Feet
  ctx.fillRect(sx + w*0.15, sy + h*0.92, w*0.3, h*0.08);
  ctx.fillRect(sx + w*0.5, sy + h*0.92, w*0.3, h*0.08);

  // Body (white, round)
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(sx + w*0.1, sy + h*0.25, w*0.8, h*0.5);

  // Wing
  ctx.fillStyle = '#e8e8e0';
  const wingBob = Math.sin(a.walkFrame * 3) * 2;
  if (f === 1) {
    ctx.fillRect(sx + w*0.15, sy + h*0.3 + wingBob, w*0.35, h*0.3);
  } else {
    ctx.fillRect(sx + w*0.5, sy + h*0.3 + wingBob, w*0.35, h*0.3);
  }

  // Tail
  ctx.fillStyle = '#e0e0d8';
  if (f === 1) {
    ctx.fillRect(sx - w*0.05, sy + h*0.2, w*0.2, h*0.2);
  } else {
    ctx.fillRect(sx + w*0.85, sy + h*0.2, w*0.2, h*0.2);
  }

  // Head (white)
  ctx.fillStyle = '#f8f8f8';
  if (f === 1) {
    ctx.fillRect(sx + w*0.6, sy, w*0.35, h*0.35);
    // Beak
    ctx.fillStyle = '#e8a020';
    ctx.fillRect(sx + w*0.9, sy + h*0.12, w*0.15, h*0.1);
    // Eye
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + w*0.75, sy + h*0.08, w*0.08, h*0.08);
    // Comb (red)
    ctx.fillStyle = '#e02020';
    ctx.fillRect(sx + w*0.65, sy - h*0.08, w*0.15, h*0.12);
    // Wattle
    ctx.fillRect(sx + w*0.72, sy + h*0.25, w*0.08, h*0.1);
  } else {
    ctx.fillRect(sx + w*0.05, sy, w*0.35, h*0.35);
    ctx.fillStyle = '#e8a020';
    ctx.fillRect(sx - w*0.05, sy + h*0.12, w*0.15, h*0.1);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + w*0.18, sy + h*0.08, w*0.08, h*0.08);
    ctx.fillStyle = '#e02020';
    ctx.fillRect(sx + w*0.2, sy - h*0.08, w*0.15, h*0.12);
    ctx.fillRect(sx + w*0.2, sy + h*0.25, w*0.08, h*0.1);
  }
}

function drawSheep(sx, sy, a) {
  const w = a.w, h = a.h, f = a.facing;
  const legSwing = Math.sin(a.walkFrame * 2) * 4;

  // Legs (thin, dark)
  ctx.fillStyle = '#555';
  ctx.fillRect(sx + w*0.1, sy + h*0.65 + legSwing, w*0.15, h*0.35 - legSwing);
  ctx.fillRect(sx + w*0.3, sy + h*0.65 - legSwing, w*0.15, h*0.35 + legSwing);
  ctx.fillRect(sx + w*0.55, sy + h*0.65 + legSwing, w*0.15, h*0.35 - legSwing);
  ctx.fillRect(sx + w*0.75, sy + h*0.65 - legSwing, w*0.15, h*0.35 + legSwing);

  // Wool body (fluffy, white)
  ctx.fillStyle = '#f0ece0';
  ctx.fillRect(sx, sy + h*0.1, w, h*0.6);
  // Wool bumps
  ctx.fillStyle = '#e8e4d8';
  ctx.fillRect(sx + w*0.05, sy + h*0.08, w*0.25, h*0.15);
  ctx.fillRect(sx + w*0.35, sy + h*0.05, w*0.3, h*0.15);
  ctx.fillRect(sx + w*0.7, sy + h*0.08, w*0.25, h*0.15);
  ctx.fillRect(sx + w*0.1, sy + h*0.55, w*0.35, h*0.12);
  ctx.fillRect(sx + w*0.5, sy + h*0.55, w*0.35, h*0.12);

  // Head (dark gray face)
  ctx.fillStyle = '#666';
  if (f === 1) {
    ctx.fillRect(sx + w*0.75, sy + h*0.1, w*0.3, h*0.35);
    // Eye
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + w*0.88, sy + h*0.16, w*0.07, h*0.07);
    // Nose
    ctx.fillStyle = '#444';
    ctx.fillRect(sx + w*0.92, sy + h*0.3, w*0.1, h*0.06);
    // Ears
    ctx.fillStyle = '#777';
    ctx.fillRect(sx + w*0.75, sy + h*0.06, w*0.08, h*0.1);
    ctx.fillRect(sx + w*0.95, sy + h*0.06, w*0.08, h*0.1);
  } else {
    ctx.fillRect(sx - w*0.05, sy + h*0.1, w*0.3, h*0.35);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + w*0.07, sy + h*0.16, w*0.07, h*0.07);
    ctx.fillStyle = '#444';
    ctx.fillRect(sx - w*0.02, sy + h*0.3, w*0.1, h*0.06);
    ctx.fillStyle = '#777';
    ctx.fillRect(sx - w*0.03, sy + h*0.06, w*0.08, h*0.1);
    ctx.fillRect(sx + w*0.17, sy + h*0.06, w*0.08, h*0.1);
  }
}

function applyAnimalState(animalData) {
  animals = animalData.map(ad => {
    const a = createAnimal(ad.type, ad.x, ad.y);
    a.facing = ad.facing;
    a.walkFrame = ad.walkFrame;
    a.health = ad.health;
    a.maxHealth = ad.maxHealth;
    a.state = ad.state;
    a.hurtTimer = ad.hurtTimer;
    return a;
  });
}
