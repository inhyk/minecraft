// ============================================================
// Title Screen
// ============================================================

function initTitle() {
  titleParticles = [];
  for (let i = 0; i < 50; i++) {
    titleParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.3 - Math.random() * 0.5,
      type: [B.DIRT, B.STONE, B.GRASS, B.WOOD, B.LEAVES, B.SAND][Math.floor(Math.random() * 6)],
      size: 12 + Math.random() * 20,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03
    });
  }
}

function updateTitle(dt) {
  titleTime += dt * 0.001;
  splashScale = 1 + Math.sin(titleTime * 3) * 0.1;

  for (const p of titleParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    if (p.y < -p.size) {
      p.y = canvas.height + p.size;
      p.x = Math.random() * canvas.width;
    }
    if (p.x < -p.size) p.x = canvas.width + p.size;
    if (p.x > canvas.width + p.size) p.x = -p.size;
  }
}

function drawTitle() {
  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a0a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 80; i++) {
    const sx = (Math.sin(i * 127.1 + noiseSeed) * 0.5 + 0.5) * canvas.width;
    const sy = (Math.cos(i * 269.5 + noiseSeed) * 0.5 + 0.5) * canvas.height * 0.7;
    const brightness = 0.3 + Math.sin(titleTime * 2 + i) * 0.3;
    ctx.globalAlpha = brightness;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Floating block particles
  for (const p of titleParticles) {
    ctx.globalAlpha = 0.4;
    ctx.save();
    ctx.translate(p.x, p.y);
    drawBlock(-p.size/2, -p.size/2, p.type, p.size);
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Dirt ground at bottom
  const groundY = canvas.height - 80;
  for (let x = 0; x < canvas.width; x += BLOCK_SIZE) {
    drawBlock(x, groundY, B.GRASS, BLOCK_SIZE);
    drawBlock(x, groundY + BLOCK_SIZE, B.DIRT, BLOCK_SIZE);
    drawBlock(x, groundY + BLOCK_SIZE * 2, B.DIRT, BLOCK_SIZE);
  }

  // Title text: "MINECRAFT 2D"
  const titleY = canvas.height * 0.2;
  drawMinecraftText("MINECRAFT", canvas.width / 2, titleY, 5);
  drawMinecraftText("2D", canvas.width / 2, titleY + 70, 4);

  // Splash text
  ctx.save();
  ctx.translate(canvas.width / 2 + 180, titleY + 55);
  ctx.rotate(-0.3);
  ctx.scale(splashScale, splashScale);
  ctx.fillStyle = '#ff0';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(currentSplash, 0, 0);
  ctx.restore();

  // Buttons
  drawTitleButton("Singleplayer", canvas.width / 2, canvas.height * 0.48, 300, 50, 'play');
  drawTitleButton("Multiplayer", canvas.width / 2, canvas.height * 0.57, 300, 50, 'multiplayer');
  drawTitleButton("Controls", canvas.width / 2, canvas.height * 0.66, 300, 50, 'controls');

  // Controls info
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('WASD: Move | Space: Jump | LClick: Mine | RClick: Place | 1-9: Select | E: Inventory', canvas.width / 2, canvas.height * 0.78);

  // Version
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Minecraft 2D v1.0', 8, canvas.height - 8);
  ctx.textAlign = 'right';
  ctx.fillText('Made with Canvas', canvas.width - 8, canvas.height - 8);

  // Google Login Button (top right)
  drawGoogleAuthButton();
}

function drawGoogleAuthButton() {
  const btnW = 160;
  const btnH = 36;
  const btnX = canvas.width - btnW - 15;
  const btnY = 15;

  const hovered = mouse.x >= btnX && mouse.x <= btnX + btnW &&
                  mouse.y >= btnY && mouse.y <= btnY + btnH;

  titleButtons['google_auth'] = { x: btnX, y: btnY, w: btnW, h: btnH };

  if (currentUser) {
    // Logged in - show user info and logout
    ctx.fillStyle = hovered ? 'rgba(100, 60, 60, 0.9)' : 'rgba(60, 60, 60, 0.9)';
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(btnX, btnY, btnW, btnH);

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    const displayName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User';
    const shortName = displayName.length > 12 ? displayName.substring(0, 12) + '...' : displayName;
    ctx.fillText(shortName, btnX + btnW/2, btnY + 15);
    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    ctx.fillText('Click to logout', btnX + btnW/2, btnY + 28);
  } else {
    // Not logged in - show Google sign in
    ctx.fillStyle = hovered ? 'rgba(66, 133, 244, 0.95)' : 'rgba(66, 133, 244, 0.85)';
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.strokeStyle = '#5a9cf0';
    ctx.lineWidth = 1;
    ctx.strokeRect(btnX, btnY, btnW, btnH);

    // Google icon (simple G)
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('G', btnX + 12, btnY + 24);

    // Text
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Sign in with Google', btnX + btnW/2 + 8, btnY + 23);
  }
}

function drawMinecraftText(text, x, y, scale) {
  ctx.font = `bold ${scale * 12}px monospace`;
  ctx.textAlign = 'center';

  // Shadow
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText(text, x + 3, y + 3);

  // Outline
  ctx.lineWidth = scale;
  ctx.strokeStyle = '#3a2a0a';
  ctx.strokeText(text, x, y);

  // Main text gradient
  const grad = ctx.createLinearGradient(x - 150, y - 30, x - 150, y + 10);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(0.4, '#ffdd44');
  grad.addColorStop(1, '#ff8800');
  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);
}

function drawTitleButton(text, x, y, w, h, id) {
  const bx = x - w/2;
  const by = y - h/2;

  const hovered = mouse.x >= bx && mouse.x <= bx + w &&
                  mouse.y >= by && mouse.y <= by + h;

  titleButtons[id] = { x: bx, y: by, w, h };

  // Button background
  if (hovered) {
    ctx.fillStyle = 'rgba(100, 140, 100, 0.9)';
  } else {
    ctx.fillStyle = 'rgba(60, 60, 60, 0.9)';
  }
  ctx.fillRect(bx, by, w, h);

  // Border
  ctx.strokeStyle = hovered ? '#aaa' : '#555';
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, w, h);

  // Highlights
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(bx, by, w, h/2);

  // Text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.textBaseline = 'alphabetic';
}

function handleTitleClick() {
  for (const [id, btn] of Object.entries(titleButtons)) {
    if (mouse.x >= btn.x && mouse.x <= btn.x + btn.w &&
        mouse.y >= btn.y && mouse.y <= btn.y + btn.h) {
      if (id === 'play') {
        gameState = STATE.WORLD_SELECT;
        selectedWorldIndex = -1;
        worldSelectScroll = 0;
      }
      if (id === 'multiplayer') {
        gameState = STATE.CONNECT;
        connectError = '';
      }
      if (id === 'controls') {
        gameState = STATE.CONTROLS;
      }
      if (id === 'google_auth') {
        if (currentUser) {
          signOut();
        } else {
          signInWithGoogle();
        }
      }
    }
  }
}

// --- Controls Screen ---
function drawControlsScreen() {
  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a0a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 60; i++) {
    const sx = (Math.sin(i * 127.1 + 42) * 0.5 + 0.5) * canvas.width;
    const sy = (Math.cos(i * 269.5 + 42) * 0.5 + 0.5) * canvas.height * 0.7;
    ctx.globalAlpha = 0.3 + Math.sin(titleTime * 2 + i) * 0.2;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;

  const cx = canvas.width / 2;

  // Title
  drawMinecraftText("Controls", cx, 50, 3.5);

  // Controls box
  const boxX = cx - 300;
  const boxY = 90;
  const boxW = 600;
  const boxH = canvas.height - 180;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Control categories
  const controls = [
    { category: 'Movement', items: [
      { key: 'W / Space', action: 'Jump' },
      { key: 'A', action: 'Move Left' },
      { key: 'D', action: 'Move Right' },
      { key: 'S', action: 'Move Down (water/ladder)' },
    ]},
    { category: 'Actions', items: [
      { key: 'Left Click', action: 'Mine Block / Attack' },
      { key: 'Right Click', action: 'Place Block / Use Item' },
      { key: 'Q', action: 'Drop Item' },
      { key: 'F', action: 'Swap with Offhand' },
    ]},
    { category: 'Inventory', items: [
      { key: 'E', action: 'Open/Close Inventory' },
      { key: '1-9', action: 'Select Hotbar Slot' },
      { key: 'Scroll Wheel', action: 'Change Hotbar Selection' },
      { key: 'Shift + Click', action: 'Quick Move Item' },
    ]},
    { category: 'Interface', items: [
      { key: 'Tab', action: 'Achievements' },
      { key: 'T', action: 'Open Chat (Multiplayer)' },
      { key: 'M', action: 'Toggle Music' },
      { key: 'Escape', action: 'Close Menu / Exit Game' },
    ]},
    { category: 'Gameplay Tips', items: [
      { key: 'Portal', action: 'Build obsidian frame, light with Flint & Steel' },
      { key: 'Crafting', action: 'Use Crafting Table for 3x3 recipes' },
      { key: 'Combat', action: 'Armor reduces damage, swords deal extra damage' },
      { key: 'Dimensions', action: 'Nether: lava, Blazes / End: Ender Dragon' },
    ]},
  ];

  let y = boxY + 20;
  const leftX = boxX + 30;
  const rightX = boxX + boxW / 2 + 30;
  let col = 0;

  for (const category of controls) {
    const currentX = col === 0 ? leftX : rightX;

    // Category header
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(category.category, currentX, y);

    y += 5;

    // Items
    for (const item of category.items) {
      y += 22;

      // Key
      ctx.fillStyle = '#aaa';
      ctx.fillRect(currentX, y - 14, 130, 20);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.strokeRect(currentX, y - 14, 130, 20);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(item.key, currentX + 65, y + 1);

      // Action
      ctx.fillStyle = '#ccc';
      ctx.font = '13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(item.action, currentX + 140, y + 1);
    }

    y += 30;

    // Switch columns after 2-3 categories
    if ((col === 0 && controls.indexOf(category) === 1) || (col === 0 && controls.indexOf(category) === 2)) {
      col = 1;
      y = boxY + 20;
    }
  }

  // Back button
  const btnY = canvas.height - 70;
  drawTitleButton("Back", cx, btnY, 200, 45, 'controls_back');
}

function handleControlsClick() {
  for (const [id, btn] of Object.entries(titleButtons)) {
    if (mouse.x >= btn.x && mouse.x <= btn.x + btn.w &&
        mouse.y >= btn.y && mouse.y <= btn.y + btn.h) {
      if (id === 'controls_back') {
        gameState = STATE.TITLE;
        initTitle();
        return;
      }
    }
  }
}

// --- Connect Screen ---
function drawConnectScreen() {
  // Background (same as title)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a0a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 60; i++) {
    const sx = (Math.sin(i * 127.1 + 42) * 0.5 + 0.5) * canvas.width;
    const sy = (Math.cos(i * 269.5 + 42) * 0.5 + 0.5) * canvas.height * 0.7;
    ctx.globalAlpha = 0.3 + Math.sin(titleTime * 2 + i) * 0.2;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Title
  drawMinecraftText("MULTIPLAYER", cx, cy - 140, 3.5);

  // Mode tabs
  const tabY = cy - 90;
  const tabW = 140;
  const tabH = 35;

  // Create Room tab
  const createX = cx - tabW - 5;
  const createHovered = mouse.x >= createX && mouse.x <= createX + tabW &&
                        mouse.y >= tabY && mouse.y <= tabY + tabH;
  ctx.fillStyle = connectMode === 'create' ? '#4a4' : (createHovered ? '#555' : '#333');
  ctx.fillRect(createX, tabY, tabW, tabH);
  ctx.strokeStyle = connectMode === 'create' ? '#6c6' : '#555';
  ctx.lineWidth = 2;
  ctx.strokeRect(createX, tabY, tabW, tabH);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Create Room', createX + tabW/2, tabY + 23);
  titleButtons['tab_create'] = { x: createX, y: tabY, w: tabW, h: tabH };

  // Join Room tab
  const joinX = cx + 5;
  const joinHovered = mouse.x >= joinX && mouse.x <= joinX + tabW &&
                      mouse.y >= tabY && mouse.y <= tabY + tabH;
  ctx.fillStyle = connectMode === 'join' ? '#4a4' : (joinHovered ? '#555' : '#333');
  ctx.fillRect(joinX, tabY, tabW, tabH);
  ctx.strokeStyle = connectMode === 'join' ? '#6c6' : '#555';
  ctx.strokeRect(joinX, tabY, tabW, tabH);
  ctx.fillStyle = '#fff';
  ctx.fillText('Join Room', joinX + tabW/2, tabY + 23);
  titleButtons['tab_join'] = { x: joinX, y: tabY, w: tabW, h: tabH };

  // Input fields
  drawInputField('Player Name:', connectFields.name, cx, cy - 30, connectFocus === 'name');

  // Room code field (only in join mode)
  if (connectMode === 'join') {
    drawInputField('Room Code:', connectFields.roomCode, cx, cy + 40, connectFocus === 'roomCode');
  }

  // Error
  if (connectError) {
    ctx.fillStyle = '#f44';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(connectError, cx, connectMode === 'join' ? cy + 95 : cy + 30);
  }

  // Action button
  const btnY = connectMode === 'join' ? cy + 125 : cy + 50;
  const btnText = connectMode === 'create' ? 'Create Room' : 'Join Room';
  drawTitleButton(btnText, cx, btnY, 250, 45, 'mp_connect');
  drawTitleButton('Back', cx, btnY + 55, 250, 45, 'mp_back');

  // Instructions
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  const instrY = btnY + 100;
  if (connectMode === 'join') {
    ctx.fillText('Tab: Switch field  |  Enter: Join', cx, instrY);
  } else {
    ctx.fillText('Enter: Create Room', cx, instrY);
  }

  // Google Login Button (top right)
  drawGoogleAuthButton();
}

function drawInputField(label, value, x, y, focused) {
  const w = 300, h = 32;
  const bx = x - w/2, by = y;

  ctx.fillStyle = '#aaa';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(label, bx, by - 6);

  ctx.fillStyle = focused ? '#333' : '#222';
  ctx.fillRect(bx, by, w, h);
  ctx.strokeStyle = focused ? '#88aaff' : '#555';
  ctx.lineWidth = focused ? 2 : 1;
  ctx.strokeRect(bx, by, w, h);

  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText(value + (focused ? '_' : ''), bx + 8, by + 21);
}

function handleConnectClick() {
  for (const [id, btn] of Object.entries(titleButtons)) {
    if (mouse.x >= btn.x && mouse.x <= btn.x + btn.w &&
        mouse.y >= btn.y && mouse.y <= btn.y + btn.h) {
      if (id === 'tab_create') {
        connectMode = 'create';
        connectError = '';
        return;
      }
      if (id === 'tab_join') {
        connectMode = 'join';
        connectError = '';
        return;
      }
      if (id === 'mp_connect') {
        const name = connectFields.name.trim() || 'Player';
        if (connectMode === 'create') {
          createRoom(name);
        } else {
          const roomCode = connectFields.roomCode.trim().toUpperCase();
          if (!roomCode) { connectError = 'Enter room code'; return; }
          joinRoom(roomCode, name);
        }
      }
      if (id === 'mp_back') {
        gameState = STATE.TITLE;
        initTitle();
      }
      if (id === 'google_auth') {
        if (currentUser) {
          signOut();
        } else {
          signInWithGoogle();
        }
      }
    }
  }
}

// --- World Selection Screen ---
function drawWorldSelectScreen() {
  // Background (same as title)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a0a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 60; i++) {
    const sx = (Math.sin(i * 127.1 + 42) * 0.5 + 0.5) * canvas.width;
    const sy = (Math.cos(i * 269.5 + 42) * 0.5 + 0.5) * canvas.height * 0.7;
    ctx.globalAlpha = 0.3 + Math.sin(titleTime * 2 + i) * 0.2;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;

  const cx = canvas.width / 2;

  // Title
  drawMinecraftText("Select World", cx, 60, 3);

  // World list area
  const listX = cx - 200;
  const listY = 100;
  const listW = 400;
  const listH = canvas.height - 250;
  const itemH = 70;

  // Background for list
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(listX, listY, listW, listH);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.strokeRect(listX, listY, listW, listH);

  // Get saved worlds
  const worlds = getSavedWorlds();

  // Clip to list area
  ctx.save();
  ctx.beginPath();
  ctx.rect(listX, listY, listW, listH);
  ctx.clip();

  // Draw world items
  for (let i = 0; i < worlds.length; i++) {
    const world = worlds[i];
    const itemY = listY + 5 + i * itemH - worldSelectScroll;

    // Skip if outside visible area
    if (itemY + itemH < listY || itemY > listY + listH) continue;

    const isSelected = selectedWorldIndex === i;
    const isHovered = mouse.x >= listX + 5 && mouse.x <= listX + listW - 10 &&
                      mouse.y >= itemY && mouse.y <= itemY + itemH - 5 &&
                      mouse.y >= listY && mouse.y <= listY + listH;

    // Item background
    if (isSelected) {
      ctx.fillStyle = 'rgba(80, 120, 80, 0.8)';
    } else if (isHovered) {
      ctx.fillStyle = 'rgba(80, 80, 100, 0.6)';
    } else {
      ctx.fillStyle = 'rgba(40, 40, 50, 0.6)';
    }
    ctx.fillRect(listX + 5, itemY, listW - 10, itemH - 5);

    // World icon (grass block)
    drawBlock(listX + 15, itemY + 12, B.GRASS, 40);

    // World name
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(world.name, listX + 65, itemY + 25);

    // World info
    ctx.fillStyle = '#aaa';
    ctx.font = '12px monospace';
    const dimNames = ['Overworld', 'Nether', 'The End'];
    const dimName = dimNames[world.dimension] || 'Overworld';
    ctx.fillText(`Seed: ${world.seed} | ${dimName}`, listX + 65, itemY + 42);
    ctx.fillText(`Last played: ${formatSaveDate(world.savedAt)}`, listX + 65, itemY + 56);

    // Store button area for click detection
    titleButtons['world_' + i] = { x: listX + 5, y: itemY, w: listW - 10, h: itemH - 5 };
  }

  ctx.restore();

  // No worlds message
  if (worlds.length === 0) {
    ctx.fillStyle = '#888';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('No saved worlds', cx, listY + listH / 2);
  }

  // Scrollbar
  if (worlds.length * itemH > listH) {
    const scrollRatio = worldSelectScroll / (worlds.length * itemH - listH);
    const scrollbarH = Math.max(30, listH * (listH / (worlds.length * itemH)));
    const scrollbarY = listY + scrollRatio * (listH - scrollbarH);

    ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.fillRect(listX + listW - 8, listY, 6, listH);
    ctx.fillStyle = 'rgba(180, 180, 180, 0.8)';
    ctx.fillRect(listX + listW - 8, scrollbarY, 6, scrollbarH);
  }

  // Buttons at bottom
  const btnY = canvas.height - 120;
  const btnW = 180;
  const btnH = 40;

  // Play Selected World
  const playEnabled = selectedWorldIndex >= 0;
  drawWorldSelectButton("Play Selected", cx - btnW - 10, btnY, btnW, btnH, 'ws_play', playEnabled);

  // Create New World
  drawWorldSelectButton("Create New World", cx + 10, btnY, btnW, btnH, 'ws_create', true);

  // Delete button (smaller, below)
  const deleteEnabled = selectedWorldIndex >= 0;
  drawWorldSelectButton("Delete", cx - 80, btnY + 50, 160, 35, 'ws_delete', deleteEnabled);

  // Back button
  drawWorldSelectButton("Back", cx - 80, btnY + 95, 160, 35, 'ws_back', true);

  // Google Login Button (top right)
  drawGoogleAuthButton();
}

function drawWorldSelectButton(text, x, y, w, h, id, enabled) {
  const hovered = enabled && mouse.x >= x && mouse.x <= x + w &&
                  mouse.y >= y && mouse.y <= y + h;

  titleButtons[id] = { x, y, w, h, enabled };

  // Button background
  if (!enabled) {
    ctx.fillStyle = 'rgba(40, 40, 40, 0.7)';
  } else if (hovered) {
    ctx.fillStyle = 'rgba(100, 140, 100, 0.9)';
  } else {
    ctx.fillStyle = 'rgba(60, 60, 60, 0.9)';
  }
  ctx.fillRect(x, y, w, h);

  // Border
  ctx.strokeStyle = enabled ? (hovered ? '#aaa' : '#555') : '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Text
  ctx.fillStyle = enabled ? '#fff' : '#666';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w/2, y + h/2);
  ctx.textBaseline = 'alphabetic';
}

function handleWorldSelectClick() {
  const worlds = getSavedWorlds();

  for (const [id, btn] of Object.entries(titleButtons)) {
    if (mouse.x >= btn.x && mouse.x <= btn.x + btn.w &&
        mouse.y >= btn.y && mouse.y <= btn.y + btn.h) {

      // World item click
      if (id.startsWith('world_')) {
        const index = parseInt(id.replace('world_', ''));
        selectedWorldIndex = index;
        return;
      }

      if (id === 'ws_play' && btn.enabled && selectedWorldIndex >= 0) {
        const world = worlds[selectedWorldIndex];
        if (loadWorld(world.name)) {
          gameState = STATE.PLAYING;
          resetGameState();
        }
        return;
      }

      if (id === 'ws_create') {
        const worldNum = worlds.length + 1;
        const worldName = 'World ' + worldNum;
        createNewWorld(worldName);
        gameState = STATE.PLAYING;
        resetGameState();
        return;
      }

      if (id === 'ws_delete' && btn.enabled && selectedWorldIndex >= 0) {
        const world = worlds[selectedWorldIndex];
        deleteWorld(world.name);
        selectedWorldIndex = -1;
        return;
      }

      if (id === 'ws_back') {
        gameState = STATE.TITLE;
        initTitle();
        return;
      }

      if (id === 'google_auth') {
        if (currentUser) {
          signOut();
        } else {
          signInWithGoogle();
        }
        return;
      }
    }
  }
}

function handleWorldSelectScroll(deltaY) {
  const worlds = getSavedWorlds();
  const listH = canvas.height - 250;
  const itemH = 70;
  const maxScroll = Math.max(0, worlds.length * itemH - listH);

  worldSelectScroll = Math.max(0, Math.min(maxScroll, worldSelectScroll + deltaY));
}

function resetGameState() {
  particles = [];
  arrows = [];
  miningProgress = 0;
  miningTarget = null;
  mobSpawnTimer = 0;
  animalSpawnTimer = 0;
  playerHurtTimer = 0;
  playerDeathTimer = 0;
  inventoryOpen = false;
  cursorItem = null;
  chatMessages = [];
}

// --- Game Start ---
function startGame() {
  // Singleplayer: random seed
  disconnectFromServer();
  isMultiplayer = false;
  isHost = true;
  initWorldSeed(Math.floor(Math.random() * 2147483647));
  gameState = STATE.PLAYING;
  generateWorld();
  player = createPlayer();
  initClouds();
  particles = [];
  mobs = [];
  animals = [];
  arrows = [];
  droppedItems = [];
  miningProgress = 0;
  miningTarget = null;
  mobSpawnTimer = 0;
  animalSpawnTimer = 0;
  playerHurtTimer = 0;
  playerDeathTimer = 0;
  inventoryOpen = false;
  cursorItem = null;
  chatMessages = [];
}
