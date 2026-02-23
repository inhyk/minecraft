// ============================================================
// Mining & Placing
// ============================================================

function getTargetBlock() {
  const mx = mouse.x + camera.x;
  const my = mouse.y + camera.y;
  const bx = Math.floor(mx / BLOCK_SIZE);
  const by = Math.floor(my / BLOCK_SIZE);

  // Check distance from player
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;
  const bcx = bx * BLOCK_SIZE + BLOCK_SIZE / 2;
  const bcy = by * BLOCK_SIZE + BLOCK_SIZE / 2;
  const dist = Math.sqrt((pcx - bcx) ** 2 + (pcy - bcy) ** 2);

  if (dist > BLOCK_SIZE * 6) return null;
  return { x: bx, y: by };
}

function updateMining(dt) {
  if (inventoryOpen) { miningProgress = 0; miningTarget = null; return; }
  if (!mouse.left) {
    miningProgress = 0;
    miningTarget = null;
    return;
  }

  const target = getTargetBlock();
  if (!target) { miningProgress = 0; miningTarget = null; return; }

  const blockType = getBlock(target.x, target.y);
  if (blockType === B.AIR || blockType === B.WATER) { miningProgress = 0; return; }

  const info = BLOCK_INFO[blockType];
  if (!info || info.hardness < 0) { miningProgress = 0; return; }

  if (miningTarget && (miningTarget.x !== target.x || miningTarget.y !== target.y)) {
    miningProgress = 0;
  }
  miningTarget = target;

  miningProgress += dt;
  const toolMultiplier = getToolSpeedMultiplier(blockType);
  const required = MINE_TIME * info.hardness / toolMultiplier;

  if (miningProgress >= required) {
    // Break block
    let drop = info.drop || blockType;
    // Gravel has a chance to drop flint instead
    if (blockType === B.GRAVEL && info.flintChance && Math.random() < info.flintChance) {
      drop = B.FLINT;
    }
    addToInventory(drop);
    setBlock(target.x, target.y, B.AIR);
    netSendBlock(target.x, target.y, B.AIR);
    miningProgress = 0;
    // Particles
    spawnBreakParticles(target.x, target.y, blockType);
    // Damage held tool
    damageHeldTool();
    // Achievement check
    onBlockMined(drop);
  }
}

function eatFood() {
  if (playerDeathTimer > 0) return false;
  const slot = player.inventory[player.selectedSlot];
  if (!slot || slot.count <= 0) return false;
  const info = BLOCK_INFO[slot.type];
  if (!info || !info.food) return false;
  if (player.health >= player.maxHealth) return false;

  player.health = Math.min(player.maxHealth, player.health + info.food);
  slot.count--;
  if (slot.count <= 0) player.inventory[player.selectedSlot] = null;

  // Check survival achievement for full heal
  if (typeof checkSurvivalAchievements === 'function') {
    checkSurvivalAchievements();
  }

  // Eating particles
  const px = player.x + player.w / 2;
  const py = player.y + player.h * 0.3;
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: px, y: py,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 1) * 3,
      life: 10 + Math.random() * 10,
      type: slot.type || B.DIRT,
      size: 3 + Math.random() * 4,
    });
  }
  return true;
}

function placeBlock() {
  // Try eating food first
  const slot = player.inventory[player.selectedSlot];
  if (slot) {
    const info = BLOCK_INFO[slot.type];
    if (info && info.food) {
      eatFood();
      return;
    }
  }

  const target = getTargetBlock();
  if (!target) return;

  const blockType = getBlock(target.x, target.y);

  // Flint and steel - try to light portal
  if (slot && slot.type === B.FLINT_AND_STEEL) {
    if (blockType === B.AIR || blockType === B.OBSIDIAN) {
      if (typeof useFlintAndSteel === 'function') {
        useFlintAndSteel(target.x, target.y);
      }
    }
    return;
  }

  // Eye of Ender - place in end portal frame
  if (slot && slot.type === B.EYE_OF_ENDER && blockType === B.END_PORTAL_FRAME) {
    // Activate end portal
    if (typeof activateEndPortal === 'function') {
      activateEndPortal(target.x, target.y);
      slot.count--;
      if (slot.count <= 0) player.inventory[player.selectedSlot] = null;
    }
    return;
  }

  // Right-click on crafting table -> open 3x3 crafting
  if (blockType === B.CRAFT_TABLE) {
    openCraftingTable();
    return;
  }

  if (blockType !== B.AIR && blockType !== B.WATER) return;

  // Check not placing inside player
  const bx = target.x * BLOCK_SIZE;
  const by = target.y * BLOCK_SIZE;
  if (bx < player.x + player.w && bx + BLOCK_SIZE > player.x &&
      by < player.y + player.h && by + BLOCK_SIZE > player.y) return;

  if (!slot || slot.count <= 0) return;

  // Non-placeable items (food, materials)
  const slotInfo = BLOCK_INFO[slot.type];
  if (slotInfo && slotInfo.placeable === false) return;

  setBlock(target.x, target.y, slot.type);
  netSendBlock(target.x, target.y, slot.type);
  slot.count--;
  if (slot.count <= 0) player.inventory[player.selectedSlot] = null;
  // Achievement check
  onBlockPlaced();
}

function addToInventory(type) {
  const maxStack = getMaxStack(type);
  const maxDur = getMaxDurability(type);

  // Try to stack (only if stackable and not a tool with durability)
  if (maxStack > 1 && maxDur <= 0) {
    for (let i = 0; i < 36; i++) {
      const slot = player.inventory[i];
      if (slot && slot.type === type && slot.count < maxStack) {
        slot.count++;
        return true;
      }
    }
  }
  // Try empty slot in hotbar first, then main
  for (let i = 0; i < 36; i++) {
    if (!player.inventory[i]) {
      const item = { type, count: 1 };
      if (maxDur > 0) item.durability = maxDur;
      player.inventory[i] = item;
      return true;
    }
  }
  return false; // inventory full
}
