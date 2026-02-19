// ============================================================
// Multiplayer Networking
// ============================================================

function netSendBlock(bx, by, blockType) {
  if (!isMultiplayer || !ws) return;
  ws.send(JSON.stringify({ type: 'block_set', bx, by, blockType }));
}

function netSendPosition() {
  if (!isMultiplayer || !ws || !player) return;
  ws.send(JSON.stringify({
    type: 'move',
    x: player.x, y: player.y,
    facing: player.facing,
    walkFrame: player.walkFrame,
    health: player.health,
    selectedSlot: player.selectedSlot,
  }));
}

function netSendMobState() {
  if (!isMultiplayer || !ws || !isHost) return;
  const mobData = mobs.map(m => ({
    type: m.type, x: m.x, y: m.y, facing: m.facing,
    walkFrame: m.walkFrame, health: m.health, maxHealth: m.maxHealth,
    state: m.state, fuse: m.fuse, hurtTimer: m.hurtTimer,
  }));
  const villagerData = serializeVillagers();
  ws.send(JSON.stringify({ type: 'mob_state', mobs: mobData, villagers: villagerData }));
}

function netSendChat(message) {
  if (!isMultiplayer || !ws) return;
  ws.send(JSON.stringify({ type: 'chat', message }));
}

function connectToServer(address, name) {
  connectError = '';
  // Always use ws:// (use wss:// only if page is https)
  const protocol = (location.protocol === 'https:') ? 'wss' : 'ws';
  const addr = address.includes('://') ? address : `${protocol}://${address}`;
  try {
    ws = new WebSocket(addr);
  } catch(e) {
    connectError = 'Invalid address';
    return;
  }

  ws.onopen = () => {
    playerName = name;
    ws.send(JSON.stringify({ type: 'join', name }));
  };

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    switch (msg.type) {
      case 'init':
        myId = msg.id;
        isHost = (msg.hostId === msg.id);
        // Generate world from shared seed
        initWorldSeed(msg.seed);
        generateWorld();
        // Apply block changes that happened before we joined
        for (const bc of msg.blockChanges) {
          setBlock(bc.bx, bc.by, bc.blockType);
        }
        // Load other players
        otherPlayers = {};
        for (const [pid, p] of Object.entries(msg.players)) {
          otherPlayers[pid] = { ...p, walkFrame: 0 };
        }
        // Load mob state if not host
        if (!isHost && msg.mobState && msg.mobState.length > 0) {
          applyMobState(msg.mobState);
        }
        player = createPlayer();
        player.color = msg.color;
        initClouds();
        mobs = [];
        arrows = [];
        particles = [];
        miningProgress = 0;
        miningTarget = null;
        mobSpawnTimer = 0;
        playerHurtTimer = 0;
        playerDeathTimer = 0;
        inventoryOpen = false;
        cursorItem = null;
        isMultiplayer = true;
        gameState = STATE.PLAYING;
        addChatMessage('System', 'Connected! You are ' + (isHost ? 'the host.' : 'a guest.'));
        break;

      case 'player_join':
        otherPlayers[msg.id] = { name: msg.name, color: msg.color, x: 0, y: 0, facing: 1, walkFrame: 0, health: 20 };
        addChatMessage('System', msg.name + ' joined');
        break;

      case 'player_leave':
        const leaveName = otherPlayers[msg.id]?.name || 'Player';
        delete otherPlayers[msg.id];
        addChatMessage('System', leaveName + ' left');
        break;

      case 'player_move':
        if (otherPlayers[msg.id]) {
          Object.assign(otherPlayers[msg.id], {
            x: msg.x, y: msg.y, facing: msg.facing,
            walkFrame: msg.walkFrame, health: msg.health,
            selectedSlot: msg.selectedSlot
          });
        }
        break;

      case 'block_set':
        setBlock(msg.bx, msg.by, msg.blockType);
        break;

      case 'mob_state':
        if (!isHost) {
          applyMobState(msg.mobs);
          if (msg.villagers) {
            applyVillagerState(msg.villagers);
          }
        }
        break;

      case 'host_change':
        isHost = (msg.hostId === myId);
        addChatMessage('System', isHost ? 'You are now the host!' : 'Host changed.');
        break;

      case 'chat':
        addChatMessage(msg.name, msg.message);
        break;
    }
  };

  ws.onclose = () => {
    if (gameState === STATE.PLAYING && isMultiplayer) {
      addChatMessage('System', 'Disconnected from server');
      isMultiplayer = false;
    }
    ws = null;
  };

  ws.onerror = () => {
    connectError = 'Connection failed';
    ws = null;
  };
}

function addChatMessage(name, message) {
  chatMessages.push({ name, message, time: Date.now() });
  if (chatMessages.length > 50) chatMessages.shift();
}

function updateNetwork(dt) {
  if (!isMultiplayer || !ws) return;
  netSendTimer += dt;
  if (netSendTimer >= NET_SEND_RATE) {
    netSendTimer = 0;
    netSendPosition();
  }
  mobSyncTimer += dt;
  if (mobSyncTimer >= MOB_SYNC_RATE && isHost) {
    mobSyncTimer = 0;
    netSendMobState();
  }
}

function disconnectFromServer() {
  if (ws) { ws.close(); ws = null; }
  isMultiplayer = false;
  myId = null;
  isHost = false;
  otherPlayers = {};
}
