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
  const required = MINE_TIME * info.hardness;

  if (miningProgress >= required) {
    // Break block
    const drop = info.drop || blockType;
    addToInventory(drop);
    setBlock(target.x, target.y, B.AIR);
    netSendBlock(target.x, target.y, B.AIR);
    miningProgress = 0;
    // Particles
    spawnBreakParticles(target.x, target.y, blockType);
  }
}

function placeBlock() {
  const target = getTargetBlock();
  if (!target) return;

  const blockType = getBlock(target.x, target.y);

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

  const slot = player.inventory[player.selectedSlot];
  if (!slot || slot.count <= 0) return;

  setBlock(target.x, target.y, slot.type);
  netSendBlock(target.x, target.y, slot.type);
  slot.count--;
  if (slot.count <= 0) player.inventory[player.selectedSlot] = null;
}

function addToInventory(type) {
  // Try to stack in hotbar first (0-8), then main (9-35)
  for (let i = 0; i < 36; i++) {
    const slot = player.inventory[i];
    if (slot && slot.type === type && slot.count < 64) {
      slot.count++;
      return true;
    }
  }
  // Try empty slot in hotbar first, then main
  for (let i = 0; i < 36; i++) {
    if (!player.inventory[i]) {
      player.inventory[i] = { type, count: 1 };
      return true;
    }
  }
  return false; // inventory full
}
