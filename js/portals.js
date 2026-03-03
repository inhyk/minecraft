// ============================================================
// Portal System
// ============================================================

// Check if player is standing in a portal
function checkPortalCollision() {
  if (portalCooldown > 0) return;
  if (!player) return;

  const px = Math.floor((player.x + player.w / 2) / BLOCK_SIZE);
  const py = Math.floor((player.y + player.h / 2) / BLOCK_SIZE);

  const block = getBlock(px, py);

  if (block === B.NETHER_PORTAL) {
    if (currentDimension === DIMENSION.OVERWORLD) {
      // Go to Nether
      enterNether();
    } else if (currentDimension === DIMENSION.NETHER) {
      // Return to Overworld
      enterOverworld();
    }
  } else if (block === B.END_PORTAL) {
    if (currentDimension === DIMENSION.OVERWORLD) {
      // Go to End
      enterEnd();
    }
  }
}

function enterNether() {
  // Calculate Nether coordinates (1:8 ratio)
  const netherX = Math.floor(player.x / BLOCK_SIZE / 8);
  const netherY = 50; // Safe spawn height

  switchDimension(DIMENSION.NETHER, netherX, netherY);

  // Create a return portal
  createNetherPortal(netherX, netherY);

  // Achievement
  if (typeof checkDimensionAchievement === 'function') {
    checkDimensionAchievement(DIMENSION.NETHER);
  }

  if (typeof addChatMessage === 'function') {
    addChatMessage('System', 'Entered the Nether');
  }
}

function enterOverworld() {
  // Calculate Overworld coordinates (8:1 ratio)
  const overworldX = Math.floor(player.x / BLOCK_SIZE * 8);

  // Switch dimension first, then calculate surface height
  switchDimension(DIMENSION.OVERWORLD, overworldX, 50);

  // Now find proper Y position in overworld
  const surfaceY = getSurfaceHeight(overworldX) - 2;
  player.y = surfaceY * BLOCK_SIZE;

  if (typeof addChatMessage === 'function') {
    addChatMessage('System', 'Returned to Overworld');
  }
}

function enterEnd() {
  // Spawn at center platform
  const endX = SPAWN_X;
  const endY = END_PLATFORM_Y - 3;

  switchDimension(DIMENSION.END, endX, endY);

  // Create obsidian platform
  for (let dx = -2; dx <= 2; dx++) {
    setBlock(endX + dx, END_PLATFORM_Y, B.OBSIDIAN);
  }

  // Achievement
  if (typeof checkDimensionAchievement === 'function') {
    checkDimensionAchievement(DIMENSION.END);
  }

  if (typeof addChatMessage === 'function') {
    addChatMessage('System', 'Entered The End');
  }
}

// Try to light a nether portal at given position
function tryLightPortal(x, y) {
  // Check for valid portal frame
  const frame = detectPortalFrame(x, y);
  if (!frame) return false;

  // Fill interior with portal blocks
  for (let py = frame.top + 1; py < frame.bottom; py++) {
    for (let px = frame.left + 1; px < frame.right; px++) {
      setBlock(px, py, B.NETHER_PORTAL);
    }
  }

  // Sync in multiplayer
  if (isMultiplayer) {
    for (let py = frame.top + 1; py < frame.bottom; py++) {
      for (let px = frame.left + 1; px < frame.right; px++) {
        netSendBlock(px, py, B.NETHER_PORTAL);
      }
    }
  }

  // Achievement
  if (typeof checkPortalLitAchievement === 'function') {
    checkPortalLitAchievement();
  }

  return true;
}

// Detect if there's a valid portal frame around this position
function detectPortalFrame(x, y) {
  // Search for obsidian frame
  // Minimum portal: 4 wide x 5 tall (2x3 interior)

  // Find left edge
  let left = x;
  while (getBlock(left - 1, y) === B.OBSIDIAN || getBlock(left - 1, y) === B.AIR) {
    left--;
    if (x - left > 5) break;
  }

  // Find right edge
  let right = x;
  while (getBlock(right + 1, y) === B.OBSIDIAN || getBlock(right + 1, y) === B.AIR) {
    right++;
    if (right - x > 5) break;
  }

  // Find top edge
  let top = y;
  while (getBlock(x, top - 1) === B.OBSIDIAN || getBlock(x, top - 1) === B.AIR) {
    top--;
    if (y - top > 6) break;
  }

  // Find bottom edge
  let bottom = y;
  while (getBlock(x, bottom + 1) === B.OBSIDIAN || getBlock(x, bottom + 1) === B.AIR) {
    bottom++;
    if (bottom - y > 6) break;
  }

  // Validate frame
  const width = right - left + 1;
  const height = bottom - top + 1;

  if (width < 4 || width > 23 || height < 5 || height > 23) {
    return null;
  }

  // Check corners and edges are obsidian
  // Top edge
  for (let px = left; px <= right; px++) {
    if (getBlock(px, top) !== B.OBSIDIAN) return null;
  }
  // Bottom edge
  for (let px = left; px <= right; px++) {
    if (getBlock(px, bottom) !== B.OBSIDIAN) return null;
  }
  // Left edge
  for (let py = top; py <= bottom; py++) {
    if (getBlock(left, py) !== B.OBSIDIAN) return null;
  }
  // Right edge
  for (let py = top; py <= bottom; py++) {
    if (getBlock(right, py) !== B.OBSIDIAN) return null;
  }

  // Check interior is air
  for (let py = top + 1; py < bottom; py++) {
    for (let px = left + 1; px < right; px++) {
      if (getBlock(px, py) !== B.AIR) return null;
    }
  }

  return { left, right, top, bottom };
}

// Create a nether portal structure
function createNetherPortal(x, y) {
  // Clear area
  for (let dy = -4; dy <= 0; dy++) {
    for (let dx = -1; dx <= 2; dx++) {
      setBlock(x + dx, y + dy, B.AIR);
    }
  }

  // Build frame
  // Bottom
  for (let dx = 0; dx <= 1; dx++) {
    setBlock(x + dx, y + 1, B.OBSIDIAN);
  }
  // Top
  for (let dx = 0; dx <= 1; dx++) {
    setBlock(x + dx, y - 4, B.OBSIDIAN);
  }
  // Left side
  for (let dy = -3; dy <= 0; dy++) {
    setBlock(x - 1, y + dy, B.OBSIDIAN);
  }
  // Right side
  for (let dy = -3; dy <= 0; dy++) {
    setBlock(x + 2, y + dy, B.OBSIDIAN);
  }

  // Fill with portal
  for (let dy = -3; dy <= 0; dy++) {
    for (let dx = 0; dx <= 1; dx++) {
      setBlock(x + dx, y + dy, B.NETHER_PORTAL);
    }
  }
}

// Check for End portal frame (3x3 with eyes)
function checkEndPortalFrame(x, y) {
  // End portal frames arranged in a 3x3 pattern
  // Each frame needs Eye of Ender placed in it
  let eyeCount = 0;
  const frames = [];

  // Check 3x3 area for end portal frames
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      // Skip center
      if (dx === 0 && dy === 0) continue;

      const bx = x + dx;
      const by = y + dy;
      if (getBlock(bx, by) === B.END_PORTAL_FRAME) {
        // Check for eye (using metadata or special value)
        // For simplicity, we use a different check
        frames.push({ x: bx, y: by });
      }
    }
  }

  return frames.length >= 8;
}

// Activate end portal
function activateEndPortal(x, y) {
  // Create portal in center
  setBlock(x, y, B.END_PORTAL);

  if (isMultiplayer) {
    netSendBlock(x, y, B.END_PORTAL);
  }
}

// Use flint and steel on a block
function useFlintAndSteel(bx, by) {
  const held = player.inventory[player.selectedSlot];
  if (!held || held.type !== B.FLINT_AND_STEEL) return false;

  // Try to light portal
  if (tryLightPortal(bx, by)) {
    damageHeldTool();
    return true;
  }

  // Place fire on top of the block
  const fireY = by - 1;
  if (fireY >= 0 && getBlock(bx, fireY) === B.AIR) {
    setBlock(bx, fireY, B.FIRE);
    if (isMultiplayer) {
      netSendBlock(bx, fireY, B.FIRE);
    }
    damageHeldTool();
    return true;
  }

  // If clicked on air, place fire there
  if (getBlock(bx, by) === B.AIR) {
    setBlock(bx, by, B.FIRE);
    if (isMultiplayer) {
      netSendBlock(bx, by, B.FIRE);
    }
    damageHeldTool();
    return true;
  }

  damageHeldTool();
  return false;
}

// Update portal cooldown
function updatePortals(dt) {
  if (portalCooldown > 0) {
    portalCooldown -= dt;
  }

  checkPortalCollision();
}
