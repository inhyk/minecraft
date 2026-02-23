// ============================================================
// Rendering - Game
// ============================================================

function drawSky() {
  if (typeof currentDimension !== 'undefined' && currentDimension === DIMENSION.NETHER) {
    // Nether sky - dark red
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a0505');
    gradient.addColorStop(0.5, '#300a0a');
    gradient.addColorStop(1, '#4a1010');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  if (typeof currentDimension !== 'undefined' && currentDimension === DIMENSION.END) {
    // End sky - dark purple/black with stars
    ctx.fillStyle = '#0a0515';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const sx = (Math.sin(i * 123.456) * 0.5 + 0.5) * canvas.width;
      const sy = (Math.cos(i * 789.012) * 0.5 + 0.5) * canvas.height * 0.7;
      const size = 1 + (i % 3);
      ctx.fillRect(sx, sy, size, size);
    }
    return;
  }

  // Overworld sky
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#4a90d9');
  gradient.addColorStop(0.5, '#87ceeb');
  gradient.addColorStop(1, '#b0d4f1');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sun
  const sunX = canvas.width * 0.8;
  const sunY = 80;
  ctx.fillStyle = '#ffffa0';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffff60';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
  ctx.fill();
}

function drawWorld() {
  const startX = Math.floor(camera.x / BLOCK_SIZE);
  const endX = Math.ceil((camera.x + canvas.width) / BLOCK_SIZE) + 1;
  const startY = Math.max(0, Math.floor(camera.y / BLOCK_SIZE));
  const endY = Math.min(WORLD_HEIGHT, Math.ceil((camera.y + canvas.height) / BLOCK_SIZE) + 1);

  // Background for underground (below surface)
  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      const block = getBlock(x, y);
      const sx = x * BLOCK_SIZE - camera.x;
      const sy = y * BLOCK_SIZE - camera.y;

      if (block === B.AIR && y > SURFACE_Y - 5) {
        ctx.fillStyle = 'rgba(139, 105, 20, 0.15)';
        ctx.fillRect(sx, sy, BLOCK_SIZE, BLOCK_SIZE);
      }

      if (block !== B.AIR) {
        drawBlock(sx, sy, block, BLOCK_SIZE);
      }
    }
  }
}

function drawPlayer() {
  const sx = player.x - camera.x;
  const sy = player.y - camera.y;
  const w = player.w;
  const h = player.h;
  const f = player.facing;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(sx - 2, sy + h - 2, w + 4, 4);

  // Legs
  const legSwing = Math.sin(player.walkFrame * 2) * 6;
  ctx.fillStyle = '#2b44aa';
  ctx.fillRect(sx + w*0.1, sy + h*0.6 + legSwing, w*0.35, h*0.4 - legSwing);
  ctx.fillRect(sx + w*0.55, sy + h*0.6 - legSwing, w*0.35, h*0.4 + legSwing);

  // Body (shirt)
  ctx.fillStyle = '#4aaaa5';
  ctx.fillRect(sx, sy + h*0.3, w, h*0.35);

  // Arms
  const armSwing = Math.sin(player.walkFrame * 2) * 8;
  ctx.fillStyle = '#c69c6d';
  ctx.fillRect(sx - w*0.25, sy + h*0.3 + armSwing, w*0.25, h*0.3);
  ctx.fillRect(sx + w, sy + h*0.3 - armSwing, w*0.25, h*0.3);

  // Head
  ctx.fillStyle = '#c69c6d';
  ctx.fillRect(sx - w*0.05, sy, w*1.1, h*0.35);

  // Hair
  ctx.fillStyle = '#4a2a0a';
  ctx.fillRect(sx - w*0.05, sy, w*1.1, h*0.1);
  if (f === 1) {
    ctx.fillRect(sx - w*0.05, sy, w*0.3, h*0.2);
  } else {
    ctx.fillRect(sx + w*0.75, sy, w*0.3, h*0.2);
  }

  // Eyes
  ctx.fillStyle = '#fff';
  if (f === 1) {
    ctx.fillRect(sx + w*0.45, sy + h*0.13, w*0.2, h*0.08);
    ctx.fillRect(sx + w*0.7, sy + h*0.13, w*0.2, h*0.08);
    ctx.fillStyle = '#2a1a4a';
    ctx.fillRect(sx + w*0.55, sy + h*0.14, w*0.1, h*0.06);
    ctx.fillRect(sx + w*0.8, sy + h*0.14, w*0.1, h*0.06);
  } else {
    ctx.fillRect(sx + w*0.15, sy + h*0.13, w*0.2, h*0.08);
    ctx.fillRect(sx + w*0.4, sy + h*0.13, w*0.2, h*0.08);
    ctx.fillStyle = '#2a1a4a';
    ctx.fillRect(sx + w*0.15, sy + h*0.14, w*0.1, h*0.06);
    ctx.fillRect(sx + w*0.4, sy + h*0.14, w*0.1, h*0.06);
  }

  // Mouth
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(sx + w*0.35, sy + h*0.24, w*0.3, h*0.03);

  // Draw equipped armor
  if (player && player.armor) {
    drawPlayerArmor(sx, sy, w, h, player.armor);
  }

  // Draw held items (main hand and offhand)
  drawPlayerHeldItems(sx, sy, w, h, f);
}

function drawPlayerHeldItems(sx, sy, w, h, f) {
  const armSwing = Math.sin(player.walkFrame * 2) * 8;
  const mainItem = player.inventory[player.selectedSlot];
  const offhandItem = player.offhand;

  // Item size
  const itemSize = w * 0.5;

  // Main hand (right side when facing right, left side when facing left)
  if (mainItem) {
    const mainX = f === 1 ? sx + w + w*0.05 : sx - w*0.3;
    const mainY = sy + h*0.35 - armSwing + itemSize/4;
    drawBlock(mainX, mainY, mainItem.type, itemSize);
  }

  // Offhand (opposite side of main hand)
  if (offhandItem) {
    const offX = f === 1 ? sx - w*0.35 : sx + w + w*0.05;
    const offY = sy + h*0.35 + armSwing + itemSize/4;
    drawBlock(offX, offY, offhandItem.type, itemSize);
  }
}

function drawPlayerArmor(sx, sy, w, h, armor) {
  if (!armor) return;

  // Helmet
  if (armor.helmet) {
    const info = BLOCK_INFO[armor.helmet.type];
    const c = ARMOR_COLORS[info.tier];
    // Helmet on head
    ctx.fillStyle = c.main;
    ctx.fillRect(sx - w*0.15, sy - h*0.03, w*1.3, h*0.12);
    ctx.fillRect(sx - w*0.1, sy + h*0.06, w*1.2, h*0.06);
    ctx.fillStyle = c.dark;
    ctx.fillRect(sx - w*0.12, sy + h*0.1, w*1.24, h*0.03);
  }

  // Chestplate
  if (armor.chestplate) {
    const info = BLOCK_INFO[armor.chestplate.type];
    const c = ARMOR_COLORS[info.tier];
    ctx.fillStyle = c.main;
    ctx.fillRect(sx - w*0.05, sy + h*0.3, w*1.1, h*0.35);
    // Shoulder pads
    ctx.fillRect(sx - w*0.3, sy + h*0.28, w*0.3, h*0.12);
    ctx.fillRect(sx + w, sy + h*0.28, w*0.3, h*0.12);
    ctx.fillStyle = c.dark;
    ctx.fillRect(sx + w*0.45, sy + h*0.35, w*0.1, h*0.25);
  }

  // Leggings
  if (armor.leggings) {
    const info = BLOCK_INFO[armor.leggings.type];
    const c = ARMOR_COLORS[info.tier];
    const legSwing = Math.sin(player.walkFrame * 2) * 6;
    ctx.fillStyle = c.main;
    // Belt
    ctx.fillRect(sx + w*0.05, sy + h*0.58, w*0.9, h*0.08);
    // Left leg armor
    ctx.fillRect(sx + w*0.08, sy + h*0.6 + legSwing, w*0.38, h*0.25 - legSwing);
    // Right leg armor
    ctx.fillRect(sx + w*0.54, sy + h*0.6 - legSwing, w*0.38, h*0.25 + legSwing);
    ctx.fillStyle = c.dark;
    // Knee guards
    ctx.fillRect(sx + w*0.15, sy + h*0.78 + legSwing, w*0.24, h*0.05);
    ctx.fillRect(sx + w*0.61, sy + h*0.78 - legSwing, w*0.24, h*0.05);
  }

  // Boots
  if (armor.boots) {
    const info = BLOCK_INFO[armor.boots.type];
    const c = ARMOR_COLORS[info.tier];
    const legSwing = Math.sin(player.walkFrame * 2) * 6;
    ctx.fillStyle = c.main;
    // Left boot
    ctx.fillRect(sx + w*0.05, sy + h*0.88 + legSwing, w*0.4, h*0.12 - legSwing);
    // Right boot
    ctx.fillRect(sx + w*0.55, sy + h*0.88 - legSwing, w*0.4, h*0.12 + legSwing);
    ctx.fillStyle = c.dark;
    // Boot bottoms
    ctx.fillRect(sx + w*0.05, sy + h*0.97 + legSwing, w*0.4, h*0.03);
    ctx.fillRect(sx + w*0.55, sy + h*0.97 - legSwing, w*0.4, h*0.03);
  }
}

function drawOtherPlayerArmor(sx, sy, w, h, wf, armor) {
  if (!armor) return;

  // Helmet
  if (armor.helmet) {
    const info = BLOCK_INFO[armor.helmet.type];
    if (info) {
      const c = ARMOR_COLORS[info.tier];
      ctx.fillStyle = c.main;
      ctx.fillRect(sx - w*0.15, sy - h*0.03, w*1.3, h*0.12);
      ctx.fillRect(sx - w*0.1, sy + h*0.06, w*1.2, h*0.06);
      ctx.fillStyle = c.dark;
      ctx.fillRect(sx - w*0.12, sy + h*0.1, w*1.24, h*0.03);
    }
  }

  // Chestplate
  if (armor.chestplate) {
    const info = BLOCK_INFO[armor.chestplate.type];
    if (info) {
      const c = ARMOR_COLORS[info.tier];
      ctx.fillStyle = c.main;
      ctx.fillRect(sx - w*0.05, sy + h*0.3, w*1.1, h*0.35);
      ctx.fillRect(sx - w*0.3, sy + h*0.28, w*0.3, h*0.12);
      ctx.fillRect(sx + w, sy + h*0.28, w*0.3, h*0.12);
      ctx.fillStyle = c.dark;
      ctx.fillRect(sx + w*0.45, sy + h*0.35, w*0.1, h*0.25);
    }
  }

  // Leggings
  if (armor.leggings) {
    const info = BLOCK_INFO[armor.leggings.type];
    if (info) {
      const c = ARMOR_COLORS[info.tier];
      const legSwing = Math.sin(wf * 2) * 6;
      ctx.fillStyle = c.main;
      ctx.fillRect(sx + w*0.05, sy + h*0.58, w*0.9, h*0.08);
      ctx.fillRect(sx + w*0.08, sy + h*0.6 + legSwing, w*0.38, h*0.25 - legSwing);
      ctx.fillRect(sx + w*0.54, sy + h*0.6 - legSwing, w*0.38, h*0.25 + legSwing);
      ctx.fillStyle = c.dark;
      ctx.fillRect(sx + w*0.15, sy + h*0.78 + legSwing, w*0.24, h*0.05);
      ctx.fillRect(sx + w*0.61, sy + h*0.78 - legSwing, w*0.24, h*0.05);
    }
  }

  // Boots
  if (armor.boots) {
    const info = BLOCK_INFO[armor.boots.type];
    if (info) {
      const c = ARMOR_COLORS[info.tier];
      const legSwing = Math.sin(wf * 2) * 6;
      ctx.fillStyle = c.main;
      ctx.fillRect(sx + w*0.05, sy + h*0.88 + legSwing, w*0.4, h*0.12 - legSwing);
      ctx.fillRect(sx + w*0.55, sy + h*0.88 - legSwing, w*0.4, h*0.12 + legSwing);
      ctx.fillStyle = c.dark;
      ctx.fillRect(sx + w*0.05, sy + h*0.97 + legSwing, w*0.4, h*0.03);
      ctx.fillRect(sx + w*0.55, sy + h*0.97 - legSwing, w*0.4, h*0.03);
    }
  }
}

function drawOtherPlayerHeldItems(sx, sy, w, h, f, wf, op) {
  const armSwing = Math.sin(wf * 2) * 8;
  const mainItem = op.heldItem;
  const offhandItem = op.offhand;

  const itemSize = w * 0.5;

  // Main hand
  if (mainItem) {
    const mainX = f === 1 ? sx + w + w*0.05 : sx - w*0.3;
    const mainY = sy + h*0.35 - armSwing + itemSize/4;
    drawBlock(mainX, mainY, mainItem.type, itemSize);
  }

  // Offhand
  if (offhandItem) {
    const offX = f === 1 ? sx - w*0.35 : sx + w + w*0.05;
    const offY = sy + h*0.35 + armSwing + itemSize/4;
    drawBlock(offX, offY, offhandItem.type, itemSize);
  }
}

function drawMiningOverlay() {
  if (!miningTarget || miningProgress <= 0) return;
  const block = getBlock(miningTarget.x, miningTarget.y);
  if (block === B.AIR) return;
  const info = BLOCK_INFO[block];
  if (!info || info.hardness <= 0) return;

  const required = MINE_TIME * info.hardness;
  const progress = Math.min(miningProgress / required, 1);
  const sx = miningTarget.x * BLOCK_SIZE - camera.x;
  const sy = miningTarget.y * BLOCK_SIZE - camera.y;

  // Crack overlay
  ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.5})`;
  const cracks = Math.floor(progress * 5);
  for (let i = 0; i < cracks; i++) {
    const cx = sx + BLOCK_SIZE * (0.2 + i * 0.15);
    const cy = sy + BLOCK_SIZE * 0.2;
    ctx.fillRect(cx, cy, 2, BLOCK_SIZE * 0.6);
    ctx.fillRect(cx - 3, cy + BLOCK_SIZE * 0.3, 8, 2);
  }
}

function drawTargetHighlight() {
  const target = getTargetBlock();
  if (!target) return;
  const block = getBlock(target.x, target.y);

  const sx = target.x * BLOCK_SIZE - camera.x;
  const sy = target.y * BLOCK_SIZE - camera.y;

  ctx.strokeStyle = block === B.AIR ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(sx, sy, BLOCK_SIZE, BLOCK_SIZE);
}

function drawHotbar() {
  const slotSize = 48;
  const padding = 4;
  const totalW = 9 * (slotSize + padding) - padding;
  const startX = (canvas.width - totalW) / 2;
  const startY = canvas.height - slotSize - 12;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(startX - 6, startY - 6, totalW + 12, slotSize + 12);

  for (let i = 0; i < 9; i++) {
    const sx = startX + i * (slotSize + padding);
    const sy = startY;

    // Slot bg
    ctx.fillStyle = i === player.selectedSlot ? 'rgba(255, 255, 255, 0.4)' : 'rgba(100, 100, 100, 0.5)';
    ctx.fillRect(sx, sy, slotSize, slotSize);

    // Border
    ctx.strokeStyle = i === player.selectedSlot ? '#fff' : '#555';
    ctx.lineWidth = i === player.selectedSlot ? 3 : 1;
    ctx.strokeRect(sx, sy, slotSize, slotSize);

    // Item
    const item = player.inventory[i];
    if (item) {
      drawBlock(sx + 8, sy + 8, item.type, slotSize - 16);
      // Durability bar
      drawDurabilityBar(sx + 8, sy + 8, slotSize - 16, item);
      // Count
      if (item.count > 1) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(item.count, sx + slotSize - 4, sy + slotSize - 4);
      }
    }

    // Slot number
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(i + 1, sx + 3, sy + 12);
  }

  // Offhand slot (left of hotbar)
  const offhandX = startX - slotSize - 16;
  const offhandY = startY;

  // Offhand background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(offhandX - 6, offhandY - 6, slotSize + 12, slotSize + 12);

  // Offhand slot
  ctx.fillStyle = 'rgba(80, 80, 120, 0.5)';
  ctx.fillRect(offhandX, offhandY, slotSize, slotSize);
  ctx.strokeStyle = '#668';
  ctx.lineWidth = 2;
  ctx.strokeRect(offhandX, offhandY, slotSize, slotSize);

  // Offhand item
  if (player.offhand) {
    drawBlock(offhandX + 8, offhandY + 8, player.offhand.type, slotSize - 16);
    drawDurabilityBar(offhandX + 8, offhandY + 8, slotSize - 16, player.offhand);
    if (player.offhand.count > 1) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(player.offhand.count, offhandX + slotSize - 4, offhandY + slotSize - 4);
    }
  } else {
    // Empty slot indicator
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('L', offhandX + slotSize/2, offhandY + slotSize/2 + 6);
  }

  // F key hint
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('F', offhandX + slotSize/2, offhandY + 12);
}

function drawHUD() {
  // Health
  const heartSize = 12;
  const startX = 12;
  const startY = 12;
  for (let i = 0; i < player.maxHealth / 2; i++) {
    const hx = startX + i * (heartSize + 3);
    if (player.health >= (i + 1) * 2) {
      ctx.fillStyle = '#e22';
      drawHeart(hx, startY, heartSize);
    } else if (player.health >= i * 2 + 1) {
      ctx.fillStyle = '#e22';
      drawHalfHeart(hx, startY, heartSize);
    } else {
      ctx.fillStyle = '#444';
      drawHeart(hx, startY, heartSize);
    }
  }

  // Coordinates and dimension
  const bx = Math.floor(player.x / BLOCK_SIZE);
  const by = Math.floor(player.y / BLOCK_SIZE);
  const dimName = typeof getDimensionName === 'function' ? getDimensionName() : 'Overworld';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(canvas.width - 135, 8, 127, 22);
  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`${dimName} X:${bx} Y:${by}`, canvas.width - 14, 23);

  // Block name under cursor
  const target = getTargetBlock();
  if (target) {
    const block = getBlock(target.x, target.y);
    if (block !== B.AIR) {
      const info = BLOCK_INFO[block];
      if (info) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        const tw = ctx.measureText(info.name).width + 12;
        ctx.fillRect(canvas.width / 2 - tw / 2, 8, tw, 22);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(info.name, canvas.width / 2, 23);
      }
    }
  }
}

function drawHeart(x, y, size) {
  ctx.fillRect(x + size*0.1, y, size*0.35, size*0.45);
  ctx.fillRect(x + size*0.55, y, size*0.35, size*0.45);
  ctx.fillRect(x, y + size*0.2, size, size*0.5);
  ctx.fillRect(x + size*0.1, y + size*0.5, size*0.8, size*0.3);
  ctx.fillRect(x + size*0.25, y + size*0.7, size*0.5, size*0.2);
  ctx.fillRect(x + size*0.4, y + size*0.85, size*0.2, size*0.15);
}

function drawHalfHeart(x, y, size) {
  ctx.fillRect(x + size*0.1, y, size*0.35, size*0.45);
  ctx.fillRect(x, y + size*0.2, size*0.5, size*0.5);
  ctx.fillRect(x + size*0.1, y + size*0.5, size*0.4, size*0.3);
  ctx.fillRect(x + size*0.25, y + size*0.7, size*0.25, size*0.2);
  ctx.fillStyle = '#444';
  ctx.fillRect(x + size*0.55, y, size*0.35, size*0.45);
  ctx.fillRect(x + size*0.5, y + size*0.2, size*0.5, size*0.5);
  ctx.fillRect(x + size*0.5, y + size*0.5, size*0.4, size*0.3);
  ctx.fillRect(x + size*0.5, y + size*0.7, size*0.25, size*0.2);
  ctx.fillRect(x + size*0.4, y + size*0.85, size*0.2, size*0.15);
}

function drawParticles() {
  for (const p of particles) {
    const sx = p.x - camera.x;
    const sy = p.y - camera.y;
    drawBlock(sx - p.size/2, sy - p.size/2, p.type, p.size);
  }
}

// --- Mob Rendering ---
function drawMobs() {
  for (const m of mobs) {
    const sx = m.x - camera.x;
    const sy = m.y - camera.y;
    if (sx + m.w < -50 || sx > canvas.width + 50) continue;

    const flash = m.hurtTimer > 0;
    ctx.save();
    if (flash) ctx.globalAlpha = 0.5 + Math.sin(m.hurtTimer * 0.05) * 0.3;

    if (m.type === MOB_TYPE.ZOMBIE) drawZombie(sx, sy, m);
    else if (m.type === MOB_TYPE.CREEPER) drawCreeper(sx, sy, m);
    else if (m.type === MOB_TYPE.SKELETON) drawSkeleton(sx, sy, m);

    ctx.restore();

    // Health bar (if damaged)
    if (m.health < m.maxHealth) {
      const barW = m.w;
      const barH = 4;
      const barX = sx;
      const barY = sy - 8;
      ctx.fillStyle = '#400';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = '#e22';
      ctx.fillRect(barX, barY, barW * (m.health / m.maxHealth), barH);
    }
  }
}

function drawZombie(sx, sy, m) {
  const w = m.w, h = m.h, f = m.facing;
  const legSwing = Math.sin(m.walkFrame * 2) * 5;

  // Legs (dark blue)
  ctx.fillStyle = '#2a3a6a';
  ctx.fillRect(sx + w*0.1, sy + h*0.6 + legSwing, w*0.35, h*0.4 - legSwing);
  ctx.fillRect(sx + w*0.55, sy + h*0.6 - legSwing, w*0.35, h*0.4 + legSwing);

  // Body (green shirt)
  ctx.fillStyle = '#3a7a4a';
  ctx.fillRect(sx, sy + h*0.3, w, h*0.35);

  // Arms stretched forward
  ctx.fillStyle = '#4a8a3a';
  const armY = sy + h*0.32;
  if (f === 1) {
    ctx.fillRect(sx + w, armY, w*0.6, w*0.25);
  } else {
    ctx.fillRect(sx - w*0.6, armY, w*0.6, w*0.25);
  }

  // Head (green skin)
  ctx.fillStyle = '#4a8a3a';
  ctx.fillRect(sx - w*0.05, sy, w*1.1, h*0.35);

  // Dark hair
  ctx.fillStyle = '#2a4a2a';
  ctx.fillRect(sx - w*0.05, sy, w*1.1, h*0.08);

  // Eyes (dark, angry)
  ctx.fillStyle = '#111';
  if (f === 1) {
    ctx.fillRect(sx + w*0.5, sy + h*0.14, w*0.15, h*0.07);
    ctx.fillRect(sx + w*0.75, sy + h*0.14, w*0.15, h*0.07);
  } else {
    ctx.fillRect(sx + w*0.15, sy + h*0.14, w*0.15, h*0.07);
    ctx.fillRect(sx + w*0.4, sy + h*0.14, w*0.15, h*0.07);
  }
}

function drawCreeper(sx, sy, m) {
  const w = m.w, h = m.h;
  const legSwing = Math.sin(m.walkFrame * 2) * 4;

  // Flash white when fusing
  const fuseFlash = m.state === 'fuse' && Math.sin(m.fuse * 0.02) > 0;
  const bodyColor = fuseFlash ? '#fff' : '#4a8a4a';
  const darkColor = fuseFlash ? '#ddd' : '#3a6a3a';

  // 4 Legs (short and stubby)
  ctx.fillStyle = darkColor;
  ctx.fillRect(sx + w*0.05, sy + h*0.7 + legSwing, w*0.2, h*0.3 - legSwing);
  ctx.fillRect(sx + w*0.3, sy + h*0.7 - legSwing, w*0.2, h*0.3 + legSwing);
  ctx.fillRect(sx + w*0.5, sy + h*0.7 + legSwing, w*0.2, h*0.3 - legSwing);
  ctx.fillRect(sx + w*0.75, sy + h*0.7 - legSwing, w*0.2, h*0.3 + legSwing);

  // Body (tall)
  ctx.fillStyle = bodyColor;
  ctx.fillRect(sx, sy + h*0.25, w, h*0.5);

  // Head (big square)
  ctx.fillStyle = bodyColor;
  ctx.fillRect(sx - w*0.1, sy, w*1.2, h*0.3);

  // Creeper face (iconic)
  ctx.fillStyle = fuseFlash ? '#444' : '#111';
  // Eyes
  ctx.fillRect(sx + w*0.1, sy + h*0.06, w*0.25, h*0.1);
  ctx.fillRect(sx + w*0.65, sy + h*0.06, w*0.25, h*0.1);
  // Mouth (frown)
  ctx.fillRect(sx + w*0.3, sy + h*0.16, w*0.4, h*0.04);
  ctx.fillRect(sx + w*0.2, sy + h*0.19, w*0.25, h*0.06);
  ctx.fillRect(sx + w*0.55, sy + h*0.19, w*0.25, h*0.06);

  // Fuse indicator
  if (m.state === 'fuse') {
    const fuseProgress = m.fuse / 1500;
    ctx.fillStyle = 'rgba(255, 80, 0, 0.7)';
    ctx.fillRect(sx, sy - 6, w * fuseProgress, 3);
  }
}

function drawSkeleton(sx, sy, m) {
  const w = m.w, h = m.h, f = m.facing;
  const legSwing = Math.sin(m.walkFrame * 2) * 5;

  // Legs (thin white bones)
  ctx.fillStyle = '#ddd';
  ctx.fillRect(sx + w*0.2, sy + h*0.6 + legSwing, w*0.15, h*0.4 - legSwing);
  ctx.fillRect(sx + w*0.65, sy + h*0.6 - legSwing, w*0.15, h*0.4 + legSwing);

  // Body (ribcage)
  ctx.fillStyle = '#ccc';
  ctx.fillRect(sx + w*0.15, sy + h*0.3, w*0.7, h*0.05);
  ctx.fillRect(sx + w*0.15, sy + h*0.38, w*0.7, h*0.05);
  ctx.fillRect(sx + w*0.15, sy + h*0.46, w*0.7, h*0.05);
  ctx.fillStyle = '#bbb';
  ctx.fillRect(sx + w*0.35, sy + h*0.3, w*0.3, h*0.28);

  // Arms
  ctx.fillStyle = '#ddd';
  if (f === 1) {
    // Bow arm
    ctx.fillRect(sx + w, sy + h*0.3, w*0.5, w*0.12);
    // Bow
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(sx + w + w*0.45, sy + h*0.2, w*0.08, h*0.25);
  } else {
    ctx.fillRect(sx - w*0.5, sy + h*0.3, w*0.5, w*0.12);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(sx - w*0.55, sy + h*0.2, w*0.08, h*0.25);
  }

  // Head (skull)
  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(sx, sy, w, h*0.32);

  // Dark eye sockets
  ctx.fillStyle = '#222';
  if (f === 1) {
    ctx.fillRect(sx + w*0.45, sy + h*0.1, w*0.18, h*0.1);
    ctx.fillRect(sx + w*0.72, sy + h*0.1, w*0.18, h*0.1);
  } else {
    ctx.fillRect(sx + w*0.1, sy + h*0.1, w*0.18, h*0.1);
    ctx.fillRect(sx + w*0.37, sy + h*0.1, w*0.18, h*0.1);
  }

  // Nose/mouth
  ctx.fillStyle = '#888';
  ctx.fillRect(sx + w*0.4, sy + h*0.2, w*0.2, h*0.04);
}

function drawArrows() {
  ctx.fillStyle = '#8B4513';
  for (const a of arrows) {
    const sx = a.x - camera.x;
    const sy = a.y - camera.y;
    const angle = Math.atan2(a.vy, a.vx);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);
    ctx.fillRect(-8, -1.5, 16, 3);
    // Arrow tip
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.moveTo(8, -4);
    ctx.lineTo(13, 0);
    ctx.lineTo(8, 4);
    ctx.fill();
    ctx.fillStyle = '#8B4513';
    // Fletching
    ctx.fillStyle = '#ccc';
    ctx.fillRect(-8, -3, 4, 6);
    ctx.restore();
  }
}

function drawDeathScreen() {
  if (playerDeathTimer <= 0) return;
  ctx.fillStyle = 'rgba(120, 0, 0, 0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('You Died!', canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = '18px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Respawning...', canvas.width / 2, canvas.height / 2 + 25);
}

function drawPlayerWithHurt() {
  if (playerDeathTimer > 0) return; // don't draw dead player
  const flash = playerHurtTimer > 0 && Math.sin(playerHurtTimer * 0.04) > 0;
  if (flash) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    drawPlayer();
    ctx.restore();
  } else {
    drawPlayer();
  }
}

// --- Other Player Rendering ---
function drawOtherPlayers() {
  for (const [id, op] of Object.entries(otherPlayers)) {
    const sx = op.x - camera.x;
    const sy = op.y - camera.y;
    if (sx < -100 || sx > canvas.width + 100) continue;

    const w = BLOCK_SIZE * 0.6;
    const h = BLOCK_SIZE * 1.8;
    const f = op.facing || 1;
    const wf = op.walkFrame || 0;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(sx - 2, sy + h - 2, w + 4, 4);

    const legSwing = Math.sin(wf * 2) * 6;
    // Legs
    ctx.fillStyle = '#2b44aa';
    ctx.fillRect(sx + w*0.1, sy + h*0.6 + legSwing, w*0.35, h*0.4 - legSwing);
    ctx.fillRect(sx + w*0.55, sy + h*0.6 - legSwing, w*0.35, h*0.4 + legSwing);

    // Body (player color)
    ctx.fillStyle = op.color || '#e06040';
    ctx.fillRect(sx, sy + h*0.3, w, h*0.35);

    // Arms
    const armSwing = Math.sin(wf * 2) * 8;
    ctx.fillStyle = '#c69c6d';
    ctx.fillRect(sx - w*0.25, sy + h*0.3 + armSwing, w*0.25, h*0.3);
    ctx.fillRect(sx + w, sy + h*0.3 - armSwing, w*0.25, h*0.3);

    // Head
    ctx.fillStyle = '#c69c6d';
    ctx.fillRect(sx - w*0.05, sy, w*1.1, h*0.35);

    // Hair
    ctx.fillStyle = '#4a2a0a';
    ctx.fillRect(sx - w*0.05, sy, w*1.1, h*0.1);

    // Eyes
    ctx.fillStyle = '#fff';
    const ex = f === 1 ? 0.45 : 0.15;
    ctx.fillRect(sx + w*ex, sy + h*0.13, w*0.2, h*0.08);
    ctx.fillRect(sx + w*(ex+0.25), sy + h*0.13, w*0.2, h*0.08);
    ctx.fillStyle = '#2a1a4a';
    ctx.fillRect(sx + w*(ex+0.1), sy + h*0.14, w*0.1, h*0.06);
    ctx.fillRect(sx + w*(ex+0.35), sy + h*0.14, w*0.1, h*0.06);

    // Draw armor for other players
    if (op.armor) {
      drawOtherPlayerArmor(sx, sy, w, h, wf, op.armor);
    }

    // Draw held items for other players
    drawOtherPlayerHeldItems(sx, sy, w, h, f, wf, op);

    // Nametag
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    const nameW = ctx.measureText(op.name || 'Player').width + 8;
    ctx.fillRect(sx + w/2 - nameW/2, sy - 20, nameW, 16);
    ctx.fillStyle = '#fff';
    ctx.fillText(op.name || 'Player', sx + w/2, sy - 8);
  }
}

// --- Chat UI ---
function drawChat() {
  if (!isMultiplayer) return;

  const chatX = 8;
  const chatY = canvas.height - 140;
  const now = Date.now();

  // Show recent messages (last 5, within 10s, or all if chatOpen)
  const visible = chatOpen
    ? chatMessages.slice(-8)
    : chatMessages.filter(m => now - m.time < 8000).slice(-5);

  for (let i = 0; i < visible.length; i++) {
    const m = visible[i];
    const y = chatY + i * 18;
    const age = now - m.time;
    const alpha = chatOpen ? 0.85 : Math.max(0, 1 - (age - 5000) / 3000);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    const text = `<${m.name}> ${m.message}`;
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    const tw = ctx.measureText(text).width + 8;
    ctx.fillRect(chatX, y - 1, tw, 16);
    ctx.fillStyle = m.name === 'System' ? '#ff0' : '#fff';
    ctx.fillText(text, chatX + 4, y + 11);
  }
  ctx.globalAlpha = 1;

  // Chat input
  if (chatOpen) {
    const iy = canvas.height - 140 + visible.length * 18 + 4;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(chatX, iy, 350, 22);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.strokeRect(chatX, iy, 350, 22);
    ctx.fillStyle = '#fff';
    ctx.font = '13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('> ' + chatInput + '_', chatX + 4, iy + 16);
  }
}
