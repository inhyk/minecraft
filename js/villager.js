// ============================================================
// Villager NPC System with Trading
// ============================================================

// Villager professions and their trades
const VILLAGER_TRADES = {
  farmer: [
    { buy: { item: B.COAL_ORE, amount: 5 }, sell: { item: B.PLANKS, amount: 10 } },
    { buy: { item: B.IRON_ORE, amount: 2 }, sell: { item: B.DIRT, amount: 32 } },
    { buy: { item: B.COBBLESTONE, amount: 10 }, sell: { item: B.GRASS, amount: 5 } },
  ],
  blacksmith: [
    { buy: { item: B.IRON_ORE, amount: 4 }, sell: { item: B.COBBLESTONE, amount: 20 } },
    { buy: { item: B.COAL_ORE, amount: 8 }, sell: { item: B.IRON_ORE, amount: 2 } },
    { buy: { item: B.GOLD_ORE, amount: 3 }, sell: { item: B.DIAMOND_ORE, amount: 1 } },
    { buy: { item: B.COPPER_ORE, amount: 6 }, sell: { item: B.BRICK, amount: 16 } },
  ],
  librarian: [
    { buy: { item: B.PLANKS, amount: 20 }, sell: { item: B.GLASS, amount: 8 } },
    { buy: { item: B.COAL_ORE, amount: 10 }, sell: { item: B.BRICK, amount: 12 } },
    { buy: { item: B.DIAMOND_ORE, amount: 1 }, sell: { item: B.GOLD_ORE, amount: 5 } },
  ]
};

// Villager colors by profession
const VILLAGER_COLORS = {
  farmer: { robe: '#8B4513', hood: '#654321' },
  blacksmith: { robe: '#333333', hood: '#1a1a1a' },
  librarian: { robe: '#f0f0f0', hood: '#d0d0d0' }
};

// Villager state
let villagers = [];
let tradeOpen = false;
let tradingWith = null;
let tradeHoveredSlot = -1;

function createVillager(x, y, profession) {
  return {
    x: x,
    y: y,
    w: BLOCK_SIZE * 0.6,
    h: BLOCK_SIZE * 1.6,
    vx: 0,
    vy: 0,
    profession: profession,
    facing: Math.random() < 0.5 ? -1 : 1,
    onGround: false,
    walkFrame: 0,
    idleTimer: 0,
    walkTimer: 0,
    homeX: x,
    homeY: y,
    state: 'idle' // idle, walking
  };
}

function spawnVillagersFromVillages() {
  villagers = [];
  for (const village of villages) {
    for (const spawn of village.villagerSpawns) {
      villagers.push(createVillager(spawn.x, spawn.y, spawn.profession));
    }
  }
}

function updateVillagers(dt) {
  const t = Math.min(dt, 50) / TICK_RATE;

  for (const v of villagers) {
    // Idle behavior
    v.idleTimer += dt;

    if (v.state === 'idle') {
      if (v.idleTimer > 2000 + Math.random() * 3000) {
        v.state = 'walking';
        v.facing = Math.random() < 0.5 ? -1 : 1;
        v.walkTimer = 1000 + Math.random() * 2000;
        v.idleTimer = 0;
      }
      v.vx = 0;
    }

    if (v.state === 'walking') {
      v.walkTimer -= dt;
      v.vx = v.facing * 0.8 * t;

      // Don't wander too far from home
      const distFromHome = Math.abs(v.x - v.homeX);
      if (distFromHome > BLOCK_SIZE * 10) {
        v.facing = v.x > v.homeX ? -1 : 1;
      }

      if (v.walkTimer <= 0) {
        v.state = 'idle';
        v.vx = 0;
      }
    }

    // Walk animation
    if (Math.abs(v.vx) > 0.1 && v.onGround) {
      v.walkFrame += 0.08 * t;
    } else {
      v.walkFrame *= 0.9;
    }

    // Gravity
    v.vy += GRAVITY * t;
    if (v.vy > 15) v.vy = 15;

    // Move X
    v.x += v.vx;
    villagerResolveX(v);

    // Move Y
    v.y += v.vy * t;
    v.onGround = false;
    villagerResolveY(v);
  }
}

function villagerResolveX(v) {
  const left = Math.floor(v.x / BLOCK_SIZE);
  const right = Math.floor((v.x + v.w - 1) / BLOCK_SIZE);
  const top = Math.floor(v.y / BLOCK_SIZE);
  const bottom = Math.floor((v.y + v.h - 1) / BLOCK_SIZE);
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (isSolid(x, y)) {
        if (v.vx > 0) v.x = x * BLOCK_SIZE - v.w;
        else if (v.vx < 0) v.x = (x + 1) * BLOCK_SIZE;
        v.vx = 0;
        // Turn around when hitting wall
        v.facing *= -1;
      }
    }
  }
}

function villagerResolveY(v) {
  const left = Math.floor(v.x / BLOCK_SIZE);
  const right = Math.floor((v.x + v.w - 1) / BLOCK_SIZE);
  const top = Math.floor(v.y / BLOCK_SIZE);
  const bottom = Math.floor((v.y + v.h - 1) / BLOCK_SIZE);
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (isSolid(x, y)) {
        if (v.vy > 0) { v.y = y * BLOCK_SIZE - v.h; v.vy = 0; v.onGround = true; }
        else if (v.vy < 0) { v.y = (y + 1) * BLOCK_SIZE; v.vy = 0; }
      }
    }
  }
}

function drawVillagers() {
  for (const v of villagers) {
    const sx = v.x - camera.x;
    const sy = v.y - camera.y;
    const colors = VILLAGER_COLORS[v.profession];

    // Body/Robe
    ctx.fillStyle = colors.robe;
    ctx.fillRect(sx, sy + v.h * 0.25, v.w, v.h * 0.75);

    // Head
    ctx.fillStyle = '#e8c39e';
    ctx.fillRect(sx + v.w * 0.15, sy, v.w * 0.7, v.h * 0.3);

    // Hood/Hat
    ctx.fillStyle = colors.hood;
    ctx.fillRect(sx + v.w * 0.1, sy - v.h * 0.05, v.w * 0.8, v.h * 0.15);

    // Eyes
    ctx.fillStyle = '#000';
    const eyeX = v.facing > 0 ? sx + v.w * 0.55 : sx + v.w * 0.25;
    ctx.fillRect(eyeX, sy + v.h * 0.1, v.w * 0.15, v.h * 0.08);

    // Nose
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(sx + v.w * 0.35, sy + v.h * 0.15, v.w * 0.25, v.h * 0.12);

    // Arms (walk animation)
    const armSwing = Math.sin(v.walkFrame * 2) * 0.2;
    ctx.fillStyle = colors.robe;
    // Left arm
    ctx.save();
    ctx.translate(sx, sy + v.h * 0.3);
    ctx.rotate(armSwing);
    ctx.fillRect(-v.w * 0.15, 0, v.w * 0.2, v.h * 0.35);
    ctx.restore();
    // Right arm
    ctx.save();
    ctx.translate(sx + v.w, sy + v.h * 0.3);
    ctx.rotate(-armSwing);
    ctx.fillRect(-v.w * 0.05, 0, v.w * 0.2, v.h * 0.35);
    ctx.restore();

    // Profession indicator (small icon above head)
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    const icon = v.profession === 'farmer' ? '🌾' :
                 v.profession === 'blacksmith' ? '⚒️' : '📚';
    ctx.fillText(icon, sx + v.w / 2, sy - 5);
  }
}

function tryInteractVillager(clickX, clickY) {
  if (tradeOpen || inventoryOpen) return false;

  const worldClickX = clickX + camera.x;
  const worldClickY = clickY + camera.y;

  for (const v of villagers) {
    if (worldClickX >= v.x && worldClickX <= v.x + v.w &&
        worldClickY >= v.y && worldClickY <= v.y + v.h) {
      // Check distance from player
      const pcx = player.x + player.w / 2;
      const pcy = player.y + player.h / 2;
      const vcx = v.x + v.w / 2;
      const vcy = v.y + v.h / 2;
      const dist = Math.sqrt((pcx - vcx) ** 2 + (pcy - vcy) ** 2);

      if (dist < BLOCK_SIZE * 4) {
        openTrade(v);
        return true;
      }
    }
  }
  return false;
}

function openTrade(villager) {
  tradeOpen = true;
  tradingWith = villager;
  tradeHoveredSlot = -1;
}

function closeTrade() {
  tradeOpen = false;
  tradingWith = null;
}

function drawTradeUI() {
  if (!tradeOpen || !tradingWith) return;

  const trades = VILLAGER_TRADES[tradingWith.profession];
  const panelW = 320;
  const panelH = 50 + trades.length * 60;
  const panelX = (canvas.width - panelW) / 2;
  const panelY = (canvas.height - panelH) / 2;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(panelX, panelY, panelW, panelH);

  // Border
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  const title = tradingWith.profession.charAt(0).toUpperCase() + tradingWith.profession.slice(1);
  ctx.fillText(title + ' - Trading', panelX + panelW / 2, panelY + 25);

  // Trade slots
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';

  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    const slotY = panelY + 45 + i * 60;
    const slotH = 50;

    // Slot background
    const isHovered = tradeHoveredSlot === i;
    ctx.fillStyle = isHovered ? 'rgba(100, 100, 100, 0.8)' : 'rgba(60, 60, 60, 0.8)';
    ctx.fillRect(panelX + 10, slotY, panelW - 20, slotH);

    // Check if player can afford
    const canAfford = countInventoryItem(trade.buy.item) >= trade.buy.amount;

    // Buy item (what you give)
    const buyName = BLOCK_INFO[trade.buy.item]?.name || 'Unknown';
    ctx.fillStyle = canAfford ? '#fff' : '#888';
    ctx.fillText(`Give: ${trade.buy.amount}x ${buyName}`, panelX + 20, slotY + 20);

    // Arrow
    ctx.fillStyle = '#aaa';
    ctx.fillText('→', panelX + panelW / 2 - 10, slotY + 30);

    // Sell item (what you get)
    const sellName = BLOCK_INFO[trade.sell.item]?.name || 'Unknown';
    ctx.fillStyle = canAfford ? '#4f4' : '#888';
    ctx.fillText(`Get: ${trade.sell.amount}x ${sellName}`, panelX + 20, slotY + 40);

    // Draw item icons
    drawBlock(panelX + 250, slotY + 5, trade.buy.item, 20);
    drawBlock(panelX + 280, slotY + 25, trade.sell.item, 20);
  }

  // Close button hint
  ctx.fillStyle = '#888';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Press E or click outside to close', panelX + panelW / 2, panelY + panelH - 8);
}

function handleTradeClick(mx, my) {
  if (!tradeOpen || !tradingWith) return false;

  const trades = VILLAGER_TRADES[tradingWith.profession];
  const panelW = 320;
  const panelH = 50 + trades.length * 60;
  const panelX = (canvas.width - panelW) / 2;
  const panelY = (canvas.height - panelH) / 2;

  // Check if click is outside panel
  if (mx < panelX || mx > panelX + panelW || my < panelY || my > panelY + panelH) {
    closeTrade();
    return true;
  }

  // Check trade slots
  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    const slotY = panelY + 45 + i * 60;
    const slotH = 50;

    if (mx >= panelX + 10 && mx <= panelX + panelW - 10 &&
        my >= slotY && my <= slotY + slotH) {
      executeTrade(trade);
      return true;
    }
  }

  return true;
}

function handleTradeHover(mx, my) {
  if (!tradeOpen || !tradingWith) {
    tradeHoveredSlot = -1;
    return;
  }

  const trades = VILLAGER_TRADES[tradingWith.profession];
  const panelW = 320;
  const panelH = 50 + trades.length * 60;
  const panelX = (canvas.width - panelW) / 2;
  const panelY = (canvas.height - panelH) / 2;

  tradeHoveredSlot = -1;
  for (let i = 0; i < trades.length; i++) {
    const slotY = panelY + 45 + i * 60;
    const slotH = 50;

    if (mx >= panelX + 10 && mx <= panelX + panelW - 10 &&
        my >= slotY && my <= slotY + slotH) {
      tradeHoveredSlot = i;
      break;
    }
  }
}

function executeTrade(trade) {
  // Check if player has enough items
  const hasAmount = countInventoryItem(trade.buy.item);
  if (hasAmount < trade.buy.amount) {
    return false;
  }

  // Remove items from inventory
  removeFromInventory(trade.buy.item, trade.buy.amount);

  // Add traded items to inventory
  for (let i = 0; i < trade.sell.amount; i++) {
    addToInventory(trade.sell.item);
  }

  return true;
}

function countInventoryItem(itemType) {
  let count = 0;
  for (const slot of player.inventory) {
    if (slot && slot.type === itemType) {
      count += slot.count;
    }
  }
  return count;
}

function removeFromInventory(itemType, amount) {
  let remaining = amount;
  for (let i = 0; i < player.inventory.length && remaining > 0; i++) {
    if (player.inventory[i] && player.inventory[i].type === itemType) {
      if (player.inventory[i].count <= remaining) {
        remaining -= player.inventory[i].count;
        player.inventory[i] = null;
      } else {
        player.inventory[i].count -= remaining;
        remaining = 0;
      }
    }
  }
}

// Serialize villagers for multiplayer sync
function serializeVillagers() {
  return villagers.map(v => ({
    x: v.x,
    y: v.y,
    profession: v.profession,
    facing: v.facing,
    walkFrame: v.walkFrame,
    state: v.state
  }));
}

// Apply villager state from host
function applyVillagerState(villagerData) {
  if (!villagerData || villagerData.length !== villagers.length) return;

  for (let i = 0; i < villagerData.length; i++) {
    const vd = villagerData[i];
    const v = villagers[i];
    if (v && vd) {
      v.x = vd.x;
      v.y = vd.y;
      v.facing = vd.facing;
      v.walkFrame = vd.walkFrame;
      v.state = vd.state;
    }
  }
}
