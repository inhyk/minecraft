// ============================================================
// Input Handling
// ============================================================

window.addEventListener('keydown', e => {
  // Connect screen text input
  if (gameState === STATE.CONNECT) {
    if (e.code === 'Tab') {
      e.preventDefault();
      if (connectMode === 'join') {
        connectFocus = connectFocus === 'roomCode' ? 'name' : 'roomCode';
      }
      return;
    }
    if (e.code === 'Enter') {
      const name = connectFields.name.trim() || 'Player';
      if (connectMode === 'create') {
        createRoom(name);
      } else {
        const roomCode = connectFields.roomCode.trim().toUpperCase();
        if (roomCode) joinRoom(roomCode, name);
      }
      return;
    }
    if (e.code === 'Escape') { gameState = STATE.TITLE; initTitle(); return; }
    if (e.code === 'Backspace') { e.preventDefault(); connectFields[connectFocus] = connectFields[connectFocus].slice(0, -1); return; }
    const maxLen = connectFocus === 'roomCode' ? 8 : 16;
    if (e.key.length === 1 && connectFields[connectFocus].length < maxLen) {
      let char = e.key;
      if (connectFocus === 'roomCode') char = char.toUpperCase();
      connectFields[connectFocus] += char;
      return;
    }
    return;
  }

  // Chat input
  if (gameState === STATE.PLAYING && chatOpen) {
    if (e.code === 'Escape') { chatOpen = false; chatInput = ''; return; }
    if (e.code === 'Enter') {
      if (chatInput.trim()) { netSendChat(chatInput.trim()); addChatMessage(playerName, chatInput.trim()); }
      chatOpen = false; chatInput = '';
      return;
    }
    if (e.code === 'Backspace') { e.preventDefault(); chatInput = chatInput.slice(0, -1); return; }
    if (e.key.length === 1 && chatInput.length < 100) { chatInput += e.key; return; }
    return;
  }

  keys[e.code] = true;

  if (gameState === STATE.PLAYING) {
    // Open chat with T (multiplayer only)
    if (e.code === 'KeyT' && isMultiplayer && !inventoryOpen) {
      chatOpen = true; chatInput = '';
      e.preventDefault(); return;
    }

    // Toggle inventory with E (also closes trade)
    if (e.code === 'KeyE') {
      if (tradeOpen) {
        closeTrade();
        return;
      }
      toggleInventory();
      return;
    }

    // Drop item with Q
    if (e.code === 'KeyQ' && !inventoryOpen && !tradeOpen) {
      dropItem(true); // Drop one item
      return;
    }

    // Close inventory with Escape, or go to title if not open
    if (e.code === 'Escape') {
      if (inventoryOpen) {
        toggleInventory();
      } else {
        disconnectFromServer();
        gameState = STATE.TITLE;
        initTitle();
      }
      return;
    }

    // Hotbar selection (only when inventory closed)
    if (!inventoryOpen && e.code >= 'Digit1' && e.code <= 'Digit9') {
      player.selectedSlot = parseInt(e.code.replace('Digit', '')) - 1;
    }
  }
});

window.addEventListener('keyup', e => {
  keys[e.code] = false;
});

canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  // Update trade UI hover state
  if (tradeOpen) {
    handleTradeHover(mouse.x, mouse.y);
  }
});

canvas.addEventListener('mousedown', e => {
  e.preventDefault();
  if (e.button === 0) {
    mouse.left = true;
    if (gameState === STATE.TITLE) {
      handleTitleClick();
    } else if (gameState === STATE.CONNECT) {
      handleConnectClick();
    } else if (gameState === STATE.PLAYING && tradeOpen) {
      handleTradeClick(mouse.x, mouse.y);
    } else if (gameState === STATE.PLAYING && inventoryOpen) {
      handleInventoryClick(0, e.shiftKey);
    } else if (gameState === STATE.PLAYING) {
      // Try to interact with villager first, then attack mob/animal
      if (!tryInteractVillager(mouse.x, mouse.y)) {
        if (!attackMob()) {
          attackAnimal();
        }
      }
    }
  }
  if (e.button === 2) {
    mouse.right = true;
    if (gameState === STATE.PLAYING && tradeOpen) {
      // Right click closes trade
      closeTrade();
    } else if (gameState === STATE.PLAYING && inventoryOpen) {
      handleInventoryClick(2, e.shiftKey);
    } else if (gameState === STATE.PLAYING && !inventoryOpen) {
      placeBlock();
    }
  }
});

canvas.addEventListener('mouseup', e => {
  if (e.button === 0) mouse.left = false;
  if (e.button === 2) mouse.right = false;
});

canvas.addEventListener('contextmenu', e => e.preventDefault());

canvas.addEventListener('wheel', e => {
  if (gameState === STATE.PLAYING && !inventoryOpen) {
    if (e.deltaY > 0) {
      player.selectedSlot = (player.selectedSlot + 1) % 9;
    } else {
      player.selectedSlot = (player.selectedSlot + 8) % 9;
    }
  }
});

window.addEventListener('resize', resize);
