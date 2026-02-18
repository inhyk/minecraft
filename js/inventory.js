// ============================================================
// Inventory System
// ============================================================

const CRAFT_RECIPES = [
  // { grid: [type or null x4], output: { type, count } }
  // 1 Wood -> 4 Planks (any position)
  { pattern: 'single', input: B.WOOD, output: { type: B.PLANKS, count: 4 } },
  // 4 Planks -> Crafting Table
  { pattern: '2x2', input: [B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS], output: { type: B.CRAFT_TABLE, count: 1 } },
  // 4 Cobblestone -> Brick
  { pattern: '2x2', input: [B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE], output: { type: B.BRICK, count: 1 } },
  // 4 Sand -> Glass
  { pattern: '2x2', input: [B.SAND, B.SAND, B.SAND, B.SAND], output: { type: B.GLASS, count: 4 } },
  // 4 Dirt -> Grass (fun recipe)
  { pattern: '2x2', input: [B.DIRT, B.DIRT, B.DIRT, B.DIRT], output: { type: B.GRASS, count: 4 } },
  // 1 Cobblestone -> Stone
  { pattern: 'single', input: B.COBBLESTONE, output: { type: B.STONE, count: 1 } },
  // Snow from glass + dirt
  { pattern: '2x2', input: [B.GLASS, B.GLASS, B.DIRT, B.DIRT], output: { type: B.SNOW, count: 4 } },
];

function checkCraftingRecipe() {
  // Get types in craft grid
  const g = craftGrid.map(s => s ? s.type : null);
  const filledCount = g.filter(t => t !== null).length;

  if (filledCount === 0) { craftOutput = null; return; }

  // Check single recipes (any position, only 1 item in grid)
  if (filledCount === 1) {
    const inputType = g.find(t => t !== null);
    for (const recipe of CRAFT_RECIPES) {
      if (recipe.pattern === 'single' && recipe.input === inputType) {
        craftOutput = { type: recipe.output.type, count: recipe.output.count };
        return;
      }
    }
  }

  // Check 2x2 recipes
  if (filledCount === 4) {
    for (const recipe of CRAFT_RECIPES) {
      if (recipe.pattern === '2x2') {
        if (g[0] === recipe.input[0] && g[1] === recipe.input[1] &&
            g[2] === recipe.input[2] && g[3] === recipe.input[3]) {
          craftOutput = { type: recipe.output.type, count: recipe.output.count };
          return;
        }
      }
    }
  }

  craftOutput = null;
}

function craftItem() {
  if (!craftOutput) return null;
  const result = { type: craftOutput.type, count: craftOutput.count };

  // Consume 1 from each filled craft slot
  for (let i = 0; i < 4; i++) {
    if (craftGrid[i]) {
      craftGrid[i].count--;
      if (craftGrid[i].count <= 0) craftGrid[i] = null;
    }
  }
  checkCraftingRecipe();
  return result;
}

function toggleInventory() {
  inventoryOpen = !inventoryOpen;
  canvas.classList.toggle('inventory-open', inventoryOpen);
  if (!inventoryOpen) {
    // Drop craft grid items back to inventory
    for (let i = 0; i < 4; i++) {
      if (craftGrid[i]) {
        if (!addToInventory(craftGrid[i].type)) {
          // If can't fit, just drop (lose items - edge case)
        } else {
          // Added one, but need to add remaining
          for (let j = 1; j < craftGrid[i].count; j++) {
            addToInventory(craftGrid[i].type);
          }
        }
        craftGrid[i] = null;
      }
    }
    // Drop cursor item back
    if (cursorItem) {
      for (let j = 0; j < cursorItem.count; j++) {
        addToInventory(cursorItem.type);
      }
      cursorItem = null;
    }
    craftOutput = null;
  }
}

function getInventoryLayout() {
  const totalW = INV_COLS * (INV_SLOT + INV_PAD) - INV_PAD;
  const windowW = totalW + 60;
  const windowH = 380;
  const ox = (canvas.width - windowW) / 2;
  const oy = (canvas.height - windowH) / 2;
  return { ox, oy, windowW, windowH, totalW };
}

function drawInventory() {
  if (!inventoryOpen) return;
  const { ox, oy, windowW, windowH, totalW } = getInventoryLayout();
  invSlotRects = [];
  hoveredSlot = -1;
  tooltipText = '';

  // Darken background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Window background
  ctx.fillStyle = '#8B8B8B';
  ctx.fillRect(ox, oy, windowW, windowH);
  // Inner border
  ctx.fillStyle = '#C6C6C6';
  ctx.fillRect(ox + 4, oy + 4, windowW - 8, windowH - 8);
  // 3D border effect
  ctx.fillStyle = '#fff';
  ctx.fillRect(ox + 3, oy + 3, windowW - 6, 2);
  ctx.fillRect(ox + 3, oy + 3, 2, windowH - 6);
  ctx.fillStyle = '#555';
  ctx.fillRect(ox + 3, oy + windowH - 5, windowW - 6, 2);
  ctx.fillRect(ox + windowW - 5, oy + 3, 2, windowH - 6);

  // Title
  ctx.fillStyle = '#404040';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Inventory', ox + 12, oy + 24);

  const slotStartX = ox + 30;

  // --- Crafting Area ---
  const craftLabel = 'Crafting';
  ctx.fillStyle = '#404040';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(craftLabel, slotStartX, oy + 50);

  // 2x2 crafting grid
  const craftX = slotStartX;
  const craftY = oy + 58;
  for (let cy = 0; cy < 2; cy++) {
    for (let cx = 0; cx < 2; cx++) {
      const idx = cy * 2 + cx;
      const sx = craftX + cx * (INV_SLOT + INV_PAD);
      const sy = craftY + cy * (INV_SLOT + INV_PAD);
      const slotId = { area: 'craft', index: idx };
      drawInvSlot(sx, sy, craftGrid[idx], slotId);
    }
  }

  // Arrow
  const arrowX = craftX + 2 * (INV_SLOT + INV_PAD) + 16;
  const arrowY = craftY + INV_SLOT / 2 + INV_PAD / 2;
  ctx.fillStyle = '#404040';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('\u2192', arrowX, arrowY + 8);

  // Craft output slot
  const outX = arrowX + 36;
  const outY = craftY + (INV_SLOT + INV_PAD) / 2 - INV_SLOT / 2 + 2;
  // Output slot with special border
  const outSlotId = { area: 'craft_output', index: 0 };
  drawInvSlot(outX, outY, craftOutput, outSlotId, true);

  // Recipe hint text
  if (craftOutput) {
    const name = BLOCK_INFO[craftOutput.type] ? BLOCK_INFO[craftOutput.type].name : '?';
    ctx.fillStyle = '#2a6e2a';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${name} x${craftOutput.count}`, outX + INV_SLOT / 2, outY + INV_SLOT + 14);
  }

  // --- Main Inventory (3 rows of 9) ---
  const mainY = oy + 180;
  ctx.fillStyle = '#404040';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Inventory', slotStartX, mainY - 6);

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      const invIdx = 9 + row * 9 + col;
      const sx = slotStartX + col * (INV_SLOT + INV_PAD);
      const sy = mainY + row * (INV_SLOT + INV_PAD);
      const slotId = { area: 'main', index: invIdx };
      drawInvSlot(sx, sy, player.inventory[invIdx], slotId);
    }
  }

  // --- Hotbar ---
  const hotbarY = mainY + 3 * (INV_SLOT + INV_PAD) + 12;
  ctx.fillStyle = '#404040';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Hotbar', slotStartX, hotbarY - 6);

  for (let col = 0; col < 9; col++) {
    const sx = slotStartX + col * (INV_SLOT + INV_PAD);
    const sy = hotbarY;
    const slotId = { area: 'hotbar', index: col };
    drawInvSlot(sx, sy, player.inventory[col], slotId, false, col === player.selectedSlot);
  }

  // --- Tooltip ---
  if (tooltipText) {
    ctx.font = '13px monospace';
    const tw = ctx.measureText(tooltipText).width + 10;
    const tx = mouse.x + 14;
    const ty = mouse.y - 28;
    ctx.fillStyle = 'rgba(20, 0, 40, 0.92)';
    ctx.fillRect(tx - 2, ty - 14, tw + 4, 22);
    ctx.strokeStyle = '#5020a0';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx - 2, ty - 14, tw + 4, 22);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(tooltipText, tx + 3, ty + 2);
  }

  // --- Cursor item ---
  if (cursorItem) {
    drawBlock(mouse.x - INV_SLOT/3, mouse.y - INV_SLOT/3, cursorItem.type, INV_SLOT * 0.65);
    if (cursorItem.count > 1) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'right';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 2;
      ctx.fillText(cursorItem.count, mouse.x + INV_SLOT/3, mouse.y + INV_SLOT/3);
      ctx.shadowBlur = 0;
    }
  }

  // Help text at bottom
  ctx.fillStyle = 'rgba(64,64,64,0.7)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Left Click: Pick/Place  |  Right Click: Split  |  Shift+Click: Quick Move  |  E: Close', canvas.width / 2, oy + windowH + 20);
}

function drawInvSlot(x, y, item, slotId, isOutput, isSelected) {
  const hovered = mouse.x >= x && mouse.x < x + INV_SLOT &&
                  mouse.y >= y && mouse.y < y + INV_SLOT;

  // Save rect for click detection
  invSlotRects.push({ x, y, w: INV_SLOT, h: INV_SLOT, slotId });

  if (hovered) {
    hoveredSlot = invSlotRects.length - 1;
    if (item) {
      const info = BLOCK_INFO[item.type];
      tooltipText = info ? `${info.name} x${item.count}` : `Block ${item.type} x${item.count}`;
    } else if (cursorItem) {
      tooltipText = '';
    }
  }

  // Slot background
  if (isOutput) {
    // Output slot - bigger look
    ctx.fillStyle = '#8B8B8B';
    ctx.fillRect(x - 3, y - 3, INV_SLOT + 6, INV_SLOT + 6);
    ctx.fillStyle = hovered ? '#b0b0d0' : '#a0a0a0';
    ctx.fillRect(x, y, INV_SLOT, INV_SLOT);
  } else {
    // 3D inset slot
    ctx.fillStyle = '#373737';
    ctx.fillRect(x, y, INV_SLOT, INV_SLOT);
    ctx.fillStyle = hovered ? '#5a5a7a' : '#8B8B8B';
    ctx.fillRect(x + 2, y + 2, INV_SLOT - 2, INV_SLOT - 2);

    // Selection highlight for hotbar
    if (isSelected) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 1, y - 1, INV_SLOT + 2, INV_SLOT + 2);
    }
  }

  // Hover glow
  if (hovered) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x + 2, y + 2, INV_SLOT - 4, INV_SLOT - 4);
  }

  // Item
  if (item) {
    const iconSize = INV_SLOT - 16;
    drawBlock(x + 8, y + 8, item.type, iconSize);

    // Count
    if (item.count > 1) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(item.count, x + INV_SLOT - 3, y + INV_SLOT - 3);
      ctx.fillStyle = '#fff';
      ctx.fillText(item.count, x + INV_SLOT - 4, y + INV_SLOT - 4);
    }
  }
}

function handleInventoryClick(button, shiftKey) {
  if (!inventoryOpen || hoveredSlot < 0) return;

  const rect = invSlotRects[hoveredSlot];
  if (!rect) return;
  const { slotId } = rect;

  if (slotId.area === 'craft_output') {
    handleCraftOutputClick(button);
    return;
  }

  // Get reference to the slot
  let slotRef;
  if (slotId.area === 'craft') {
    slotRef = { get: () => craftGrid[slotId.index], set: (v) => { craftGrid[slotId.index] = v; } };
  } else if (slotId.area === 'hotbar') {
    slotRef = { get: () => player.inventory[slotId.index], set: (v) => { player.inventory[slotId.index] = v; } };
  } else if (slotId.area === 'main') {
    slotRef = { get: () => player.inventory[slotId.index], set: (v) => { player.inventory[slotId.index] = v; } };
  }
  if (!slotRef) return;

  const slotItem = slotRef.get();

  // Shift-click: quick move
  if (shiftKey && button === 0 && slotItem) {
    if (slotId.area === 'hotbar') {
      // Move from hotbar to main inventory
      quickMoveItem(slotId.index, 9, 35);
    } else if (slotId.area === 'main') {
      // Move from main to hotbar
      quickMoveItem(slotId.index, 0, 8);
    } else if (slotId.area === 'craft') {
      // Move from craft back to inventory
      quickMoveCraftItem(slotId.index);
    }
    checkCraftingRecipe();
    return;
  }

  if (button === 0) {
    // Left click: pick up / place / swap
    if (!cursorItem && slotItem) {
      // Pick up entire stack
      cursorItem = { type: slotItem.type, count: slotItem.count };
      slotRef.set(null);
    } else if (cursorItem && !slotItem) {
      // Place entire stack
      slotRef.set({ type: cursorItem.type, count: cursorItem.count });
      cursorItem = null;
    } else if (cursorItem && slotItem) {
      if (cursorItem.type === slotItem.type) {
        // Stack items
        const space = 64 - slotItem.count;
        const transfer = Math.min(cursorItem.count, space);
        slotItem.count += transfer;
        cursorItem.count -= transfer;
        if (cursorItem.count <= 0) cursorItem = null;
      } else {
        // Swap
        const temp = { type: slotItem.type, count: slotItem.count };
        slotRef.set({ type: cursorItem.type, count: cursorItem.count });
        cursorItem = temp;
      }
    }
  } else if (button === 2) {
    // Right click: place 1 / pick up half
    if (!cursorItem && slotItem) {
      // Pick up half
      const half = Math.ceil(slotItem.count / 2);
      cursorItem = { type: slotItem.type, count: half };
      slotItem.count -= half;
      if (slotItem.count <= 0) slotRef.set(null);
    } else if (cursorItem && !slotItem) {
      // Place 1
      slotRef.set({ type: cursorItem.type, count: 1 });
      cursorItem.count--;
      if (cursorItem.count <= 0) cursorItem = null;
    } else if (cursorItem && slotItem && cursorItem.type === slotItem.type) {
      // Place 1 onto matching stack
      if (slotItem.count < 64) {
        slotItem.count++;
        cursorItem.count--;
        if (cursorItem.count <= 0) cursorItem = null;
      }
    } else if (cursorItem && slotItem && cursorItem.type !== slotItem.type) {
      // Swap
      const temp = { type: slotItem.type, count: slotItem.count };
      slotRef.set({ type: cursorItem.type, count: cursorItem.count });
      cursorItem = temp;
    }
  }

  checkCraftingRecipe();
}

function handleCraftOutputClick(button) {
  if (!craftOutput) return;

  if (button === 0) {
    if (!cursorItem) {
      cursorItem = craftItem();
    } else if (cursorItem.type === craftOutput.type && cursorItem.count + craftOutput.count <= 64) {
      const result = craftItem();
      if (result) cursorItem.count += result.count;
    }
  }
}

function quickMoveItem(fromIdx, toStart, toEnd) {
  const item = player.inventory[fromIdx];
  if (!item) return;

  // Try stacking first
  for (let i = toStart; i <= toEnd; i++) {
    const target = player.inventory[i];
    if (target && target.type === item.type && target.count < 64) {
      const transfer = Math.min(item.count, 64 - target.count);
      target.count += transfer;
      item.count -= transfer;
      if (item.count <= 0) { player.inventory[fromIdx] = null; return; }
    }
  }
  // Try empty slot
  for (let i = toStart; i <= toEnd; i++) {
    if (!player.inventory[i]) {
      player.inventory[i] = { type: item.type, count: item.count };
      player.inventory[fromIdx] = null;
      return;
    }
  }
}

function quickMoveCraftItem(craftIdx) {
  const item = craftGrid[craftIdx];
  if (!item) return;

  // Try stacking in hotbar first, then main
  for (let pass = 0; pass < 2; pass++) {
    const start = pass === 0 ? 0 : 9;
    const end = pass === 0 ? 8 : 35;
    for (let i = start; i <= end; i++) {
      const target = player.inventory[i];
      if (target && target.type === item.type && target.count < 64) {
        const transfer = Math.min(item.count, 64 - target.count);
        target.count += transfer;
        item.count -= transfer;
        if (item.count <= 0) { craftGrid[craftIdx] = null; return; }
      }
    }
  }
  // Try empty
  for (let i = 0; i < 36; i++) {
    if (!player.inventory[i]) {
      player.inventory[i] = { type: item.type, count: item.count };
      craftGrid[craftIdx] = null;
      return;
    }
  }
}
