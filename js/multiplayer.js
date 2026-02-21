// ============================================================
// Multiplayer Networking (Supabase Realtime)
// ============================================================

// Player color palette
const PLAYER_COLORS = [
  '#4aaaa5', '#e06040', '#60a0e0', '#e0c040',
  '#a060d0', '#60d080', '#d07090', '#80c0c0',
];

// Generate unique player ID
function generatePlayerId() {
  return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get color based on player ID hash
function getPlayerColor(playerId) {
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = ((hash << 5) - hash) + playerId.charCodeAt(i);
    hash |= 0;
  }
  return PLAYER_COLORS[Math.abs(hash) % PLAYER_COLORS.length];
}

// ─── Create Room (Host) ─────────────────────────────────────
async function createRoom(name) {
  connectError = '';
  try {
    initSupabase();
    currentSession = await createGameSession();
    myId = generatePlayerId();
    playerName = name;
    currentRoomCode = currentSession.room_code;

    await joinChannel(currentSession.room_code, name);

    // Host initializes the world
    isHost = true;
    initWorldSeed(currentSession.seed);
    generateWorld();

    player = createPlayer();
    player.color = getPlayerColor(myId);
    initClouds();
    resetGameState();

    isMultiplayer = true;
    gameState = STATE.PLAYING;
    addChatMessage('System', 'Room: ' + currentSession.room_code);
    addChatMessage('System', 'You are the host.');

  } catch (e) {
    connectError = 'Failed to create room';
    console.error(e);
  }
}

// ─── Join Room (Guest) ─────────────────────────────────────
async function joinRoom(roomCode, name) {
  connectError = '';
  try {
    initSupabase();
    currentSession = await getGameSession(roomCode);

    if (!currentSession) {
      connectError = 'Room not found';
      return;
    }

    myId = generatePlayerId();
    playerName = name;
    currentRoomCode = currentSession.room_code;

    await joinChannel(roomCode, name);

    // Generate world from shared seed
    initWorldSeed(currentSession.seed);
    generateWorld();

    // Load block changes from database
    const blockChanges = await loadBlockChanges(currentSession.id);
    for (const bc of blockChanges) {
      setBlock(bc.bx, bc.by, bc.block_type);
    }

    player = createPlayer();
    player.color = getPlayerColor(myId);
    initClouds();
    resetGameState();

    isMultiplayer = true;
    gameState = STATE.PLAYING;
    addChatMessage('System', 'Connected to room: ' + roomCode);

  } catch (e) {
    connectError = 'Failed to join room';
    console.error(e);
  }
}

// ─── Realtime Channel Connection ──────────────────────────────────
async function joinChannel(roomCode, name) {
  const channelName = `game:${roomCode}`;

  realtimeChannel = supabaseClient.channel(channelName, {
    config: {
      broadcast: { self: false },
      presence: { key: myId }
    }
  });

  // Presence event handlers
  realtimeChannel.on('presence', { event: 'sync' }, () => {
    handlePresenceSync();
  });

  realtimeChannel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
    handlePresenceJoin(key, newPresences);
  });

  realtimeChannel.on('presence', { event: 'leave' }, ({ key }) => {
    handlePresenceLeave(key);
  });

  // Broadcast event handlers
  realtimeChannel.on('broadcast', { event: 'player_move' }, ({ payload }) => {
    handlePlayerMove(payload);
  });

  realtimeChannel.on('broadcast', { event: 'block_set' }, ({ payload }) => {
    handleBlockSet(payload);
  });

  realtimeChannel.on('broadcast', { event: 'mob_state' }, ({ payload }) => {
    handleMobState(payload);
  });

  realtimeChannel.on('broadcast', { event: 'chat' }, ({ payload }) => {
    handleChat(payload);
  });

  realtimeChannel.on('broadcast', { event: 'attack_mob' }, ({ payload }) => {
    handleAttackMob(payload);
  });

  realtimeChannel.on('broadcast', { event: 'attack_animal' }, ({ payload }) => {
    handleAttackAnimal(payload);
  });

  realtimeChannel.on('broadcast', { event: 'drop_item' }, ({ payload }) => {
    handleDropItem(payload);
  });

  realtimeChannel.on('broadcast', { event: 'pickup_item' }, ({ payload }) => {
    handlePickupItem(payload);
  });

  // Subscribe to channel
  await realtimeChannel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      // Register self in Presence
      await realtimeChannel.track({
        name: name,
        color: getPlayerColor(myId),
        x: 0,
        y: 0,
        facing: 1,
        health: 20,
        selectedSlot: 0,
        joinedAt: Date.now()
      });
    }
  });
}

// ─── Presence Handlers ─────────────────────────────────────
function handlePresenceSync() {
  const state = realtimeChannel.presenceState();

  // Update other players list
  otherPlayers = {};
  for (const [key, presences] of Object.entries(state)) {
    if (key !== myId && presences.length > 0) {
      const p = presences[0];
      otherPlayers[key] = {
        name: p.name,
        color: p.color,
        x: p.x || 0,
        y: p.y || 0,
        facing: p.facing || 1,
        walkFrame: 0,
        health: p.health || 20,
        selectedSlot: p.selectedSlot || 0
      };
    }
  }

  // Determine host (earliest joinedAt)
  const newHostId = determineHost(state);
  const wasHost = isHost;
  isHost = (newHostId === myId);

  if (isHost && !wasHost) {
    addChatMessage('System', 'You are now the host!');
  }
}

function handlePresenceJoin(key, newPresences) {
  if (key === myId) return;

  const p = newPresences[0];
  otherPlayers[key] = {
    name: p.name,
    color: p.color,
    x: p.x || 0,
    y: p.y || 0,
    facing: 1,
    walkFrame: 0,
    health: 20,
    selectedSlot: 0
  };
  addChatMessage('System', p.name + ' joined');

  // Recalculate host
  handlePresenceSync();
}

function handlePresenceLeave(key) {
  const name = otherPlayers[key]?.name || 'Player';
  delete otherPlayers[key];
  addChatMessage('System', name + ' left');

  // Recalculate host
  handlePresenceSync();
}

function determineHost(presenceState) {
  const players = Object.entries(presenceState);
  if (players.length === 0) return null;

  players.sort((a, b) => {
    const timeA = a[1][0]?.joinedAt || Infinity;
    const timeB = b[1][0]?.joinedAt || Infinity;
    return timeA - timeB;
  });

  return players[0][0];
}

// ─── Broadcast Handlers ────────────────────────────────────
function handlePlayerMove(payload) {
  const { id, x, y, facing, walkFrame, health, selectedSlot } = payload;
  if (otherPlayers[id]) {
    Object.assign(otherPlayers[id], { x, y, facing, walkFrame, health, selectedSlot });
  }
}

function handleBlockSet(payload) {
  const { bx, by, blockType } = payload;
  setBlock(bx, by, blockType);
}

function handleMobState(payload) {
  if (!isHost) {
    if (payload.mobs) applyMobState(payload.mobs);
    if (payload.villagers) applyVillagerState(payload.villagers);
    if (payload.animals) applyAnimalState(payload.animals);
  }
}

function handleChat(payload) {
  addChatMessage(payload.name, payload.message);
}

function handleAttackMob(payload) {
  // Only host processes attacks
  if (!isHost) return;
  const { mobIndex, damage, knockbackDir } = payload;
  if (mobIndex >= 0 && mobIndex < mobs.length) {
    const m = mobs[mobIndex];
    m.health -= damage;
    m.hurtTimer = 300;
    m.vx = knockbackDir * 5;
    m.vy = -4;
    m.onGround = false;
  }
}

function handleAttackAnimal(payload) {
  // Only host processes attacks
  if (!isHost) return;
  const { animalIndex, damage, knockbackDir } = payload;
  if (animalIndex >= 0 && animalIndex < animals.length) {
    const a = animals[animalIndex];
    a.health -= damage;
    a.hurtTimer = 300;
    a.vx = knockbackDir * 4;
    a.vy = -3;
    a.onGround = false;
    a.state = 'flee';
    a.fleeTimer = 3000;
  }
}

function handleDropItem(payload) {
  const { x, y, vx, vy, type, count } = payload;
  const dropped = {
    x, y, vx, vy, type, count,
    w: 16, h: 16,
    onGround: false,
    pickupDelay: 500,
    life: 300000
  };
  droppedItems.push(dropped);
}

function handlePickupItem(payload) {
  const { index } = payload;
  if (index >= 0 && index < droppedItems.length) {
    droppedItems.splice(index, 1);
  }
}

// ─── Message Send Functions ────────────────────────────────
function netSendPosition() {
  if (!isMultiplayer || !realtimeChannel) return;

  realtimeChannel.send({
    type: 'broadcast',
    event: 'player_move',
    payload: {
      id: myId,
      x: player.x,
      y: player.y,
      facing: player.facing,
      walkFrame: player.walkFrame,
      health: player.health,
      selectedSlot: player.selectedSlot
    }
  });
}

function netSendBlock(bx, by, blockType) {
  if (!isMultiplayer || !realtimeChannel) return;

  // Broadcast immediately
  realtimeChannel.send({
    type: 'broadcast',
    event: 'block_set',
    payload: { bx, by, blockType, playerId: myId }
  });

  // Save to database
  if (currentSession) {
    saveBlockChange(currentSession.id, bx, by, blockType);
  }
}

function netSendMobState() {
  if (!isMultiplayer || !realtimeChannel || !isHost) return;

  const mobData = mobs.map(m => ({
    type: m.type, x: m.x, y: m.y, facing: m.facing,
    walkFrame: m.walkFrame, health: m.health, maxHealth: m.maxHealth,
    state: m.state, fuse: m.fuse, hurtTimer: m.hurtTimer,
  }));

  const villagerData = serializeVillagers();

  const animalData = animals.map(a => ({
    type: a.type, x: a.x, y: a.y, facing: a.facing,
    walkFrame: a.walkFrame, health: a.health, maxHealth: a.maxHealth,
    state: a.state, hurtTimer: a.hurtTimer,
  }));

  realtimeChannel.send({
    type: 'broadcast',
    event: 'mob_state',
    payload: { mobs: mobData, villagers: villagerData, animals: animalData }
  });
}

function netSendChat(message) {
  if (!isMultiplayer || !realtimeChannel) return;

  realtimeChannel.send({
    type: 'broadcast',
    event: 'chat',
    payload: { id: myId, name: playerName, message }
  });
}

function netSendAttackMob(mobIndex, damage, knockbackDir) {
  if (!isMultiplayer || !realtimeChannel) return;

  realtimeChannel.send({
    type: 'broadcast',
    event: 'attack_mob',
    payload: { mobIndex, damage, knockbackDir }
  });
}

function netSendAttackAnimal(animalIndex, damage, knockbackDir) {
  if (!isMultiplayer || !realtimeChannel) return;

  realtimeChannel.send({
    type: 'broadcast',
    event: 'attack_animal',
    payload: { animalIndex, damage, knockbackDir }
  });
}

function netSendDropItem(dropped) {
  if (!isMultiplayer || !realtimeChannel) return;

  realtimeChannel.send({
    type: 'broadcast',
    event: 'drop_item',
    payload: {
      x: dropped.x,
      y: dropped.y,
      vx: dropped.vx,
      vy: dropped.vy,
      type: dropped.type,
      count: dropped.count
    }
  });
}

function netSendPickupItem(index) {
  if (!isMultiplayer || !realtimeChannel) return;

  realtimeChannel.send({
    type: 'broadcast',
    event: 'pickup_item',
    payload: { index }
  });
}

// ─── Network Update ───────────────────────────────────────
function updateNetwork(dt) {
  if (!isMultiplayer || !realtimeChannel) return;

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

// ─── Disconnect ───────────────────────────────────────────
async function disconnectFromServer() {
  if (realtimeChannel) {
    await realtimeChannel.untrack();
    await supabaseClient.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
  currentSession = null;
  currentRoomCode = '';
  isMultiplayer = false;
  myId = null;
  isHost = false;
  otherPlayers = {};
}

// ─── Utilities ────────────────────────────────────────────
function resetGameState() {
  mobs = [];
  animals = [];
  arrows = [];
  particles = [];
  droppedItems = [];
  miningProgress = 0;
  miningTarget = null;
  mobSpawnTimer = 0;
  animalSpawnTimer = 0;
  playerHurtTimer = 0;
  playerDeathTimer = 0;
  inventoryOpen = false;
  cursorItem = null;
}

function addChatMessage(name, message) {
  chatMessages.push({ name, message, time: Date.now() });
  if (chatMessages.length > 50) chatMessages.shift();
}

// Legacy function for compatibility
async function connectToServer(address, name) {
  // If address looks like a room code, join; otherwise create
  if (address.length <= 8 && /^[A-Z0-9]+$/i.test(address)) {
    await joinRoom(address.toUpperCase(), name);
  } else {
    await createRoom(name);
  }
}
