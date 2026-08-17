// ============================================================
// Two-player networking (PeerJS / WebRTC)
// ============================================================

const PLAYER_COLORS = [
  '#4aaaa5', '#e06040', '#60a0e0', '#e0c040',
  '#a060d0', '#60d080', '#d07090', '#80c0c0',
];

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_PEER_PREFIX = 'inh-minecraft-';
const NETWORK_TIMEOUT = 12000;

let roomPeer = null;
let roomConnection = null;
let roomSeed = 0;
let roomBlockChanges = new Map();
let pendingJoin = null;
let transportShuttingDown = false;

function generatePlayerId() {
  return 'player_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

function generateRoomCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

function roomPeerId(roomCode) {
  return ROOM_PEER_PREFIX + roomCode.toLowerCase();
}

function getPlayerColor(playerId) {
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = ((hash << 5) - hash) + playerId.charCodeAt(i);
    hash |= 0;
  }
  return PLAYER_COLORS[Math.abs(hash) % PLAYER_COLORS.length];
}

function waitForPeerOpen(peer, timeout = NETWORK_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Connection timed out')), timeout);
    peer.on('open', id => {
      clearTimeout(timer);
      resolve(id);
    });
    peer.on('error', error => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

function waitForConnectionOpen(connection, timeout = NETWORK_TIMEOUT) {
  return new Promise((resolve, reject) => {
    if (connection.open) {
      resolve();
      return;
    }
    const timer = setTimeout(() => reject(new Error('Room connection timed out')), timeout);
    connection.on('open', () => {
      clearTimeout(timer);
      resolve();
    });
    connection.on('error', error => {
      clearTimeout(timer);
      reject(error);
    });
    connection.on('close', () => {
      clearTimeout(timer);
      reject(new Error('Room connection closed'));
    });
  });
}

function waitForRoomSnapshot(timeout = NETWORK_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingJoin = null;
      reject(new Error('Room did not answer'));
    }, timeout);
    pendingJoin = {
      resolve(payload) {
        clearTimeout(timer);
        pendingJoin = null;
        resolve(payload);
      },
      reject(error) {
        clearTimeout(timer);
        pendingJoin = null;
        reject(error);
      }
    };
  });
}

function describePeerError(error, fallback) {
  if (!error) return fallback;
  if (error.type === 'peer-unavailable') return 'Room not found';
  if (error.type === 'unavailable-id') return 'Room code is already in use';
  if (error.type === 'network' || error.type === 'server-error' || error.type === 'socket-error') {
    return 'Internet connection failed';
  }
  return fallback;
}

function playerNetworkState(id, name, color, source) {
  return {
    id,
    name,
    color,
    x: source?.x || 0,
    y: source?.y || 0,
    facing: source?.facing || 1,
    walkFrame: source?.walkFrame || 0,
    health: source?.health ?? 20,
    selectedSlot: source?.selectedSlot || 0,
    armor: source?.armor || null,
    heldItem: null,
    offhand: source?.offhand || null,
  };
}

function serializeMobs() {
  return mobs.map(m => ({
    type: m.type, x: m.x, y: m.y, facing: m.facing,
    walkFrame: m.walkFrame, health: m.health, maxHealth: m.maxHealth,
    state: m.state, fuse: m.fuse, hurtTimer: m.hurtTimer,
  }));
}

function serializeAnimals() {
  return animals.map(a => ({
    type: a.type, x: a.x, y: a.y, facing: a.facing,
    walkFrame: a.walkFrame, health: a.health, maxHealth: a.maxHealth,
    state: a.state, hurtTimer: a.hurtTimer,
  }));
}

function initializeMultiplayerWorld(seed) {
  initWorldSeed(seed);
  generateWorld();
  player = createPlayer();
  player.color = getPlayerColor(myId);
  initClouds();

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
  chatMessages = [];
}

function destroyPeerTransport() {
  transportShuttingDown = true;
  if (pendingJoin) pendingJoin.reject(new Error('Connection cancelled'));
  pendingJoin = null;
  try {
    if (roomConnection) roomConnection.close();
  } catch (error) {
    console.debug('Connection cleanup:', error);
  }
  try {
    if (roomPeer && !roomPeer.destroyed) roomPeer.destroy();
  } catch (error) {
    console.debug('Peer cleanup:', error);
  }
  roomConnection = null;
  realtimeChannel = null;
  roomPeer = null;
  transportShuttingDown = false;
}

// ─── Create Room (Host) ───────────────────────────────────
async function createRoom(name) {
  connectError = '';
  destroyPeerTransport();
  isMultiplayer = false;
  otherPlayers = {};
  myId = generatePlayerId();
  playerName = (name || 'Player').slice(0, 16);
  roomSeed = Math.floor(Math.random() * 2147483647);
  roomBlockChanges = new Map();

  if (typeof Peer === 'undefined') {
    connectError = 'Online library failed to load';
    return;
  }

  try {
    let opened = false;
    let lastError = null;

    // A collision is very unlikely, but retrying guarantees a usable room code.
    for (let attempt = 0; attempt < 5 && !opened; attempt++) {
      currentRoomCode = generateRoomCode();
      const peer = new Peer(roomPeerId(currentRoomCode), { debug: 0 });
      try {
        await waitForPeerOpen(peer);
        roomPeer = peer;
        opened = true;
      } catch (error) {
        lastError = error;
        peer.destroy();
        if (error.type !== 'unavailable-id') throw error;
      }
    }

    if (!opened) throw lastError || new Error('Could not reserve a room code');

    isHost = true;
    currentSession = { room_code: currentRoomCode, seed: roomSeed };
    initializeMultiplayerWorld(roomSeed);
    installHostConnectionListener();

    isMultiplayer = true;
    gameState = STATE.PLAYING;
    addChatMessage('System', 'Room: ' + currentRoomCode);
    addChatMessage('System', 'Send this 6-letter code to your friend.');
  } catch (error) {
    destroyPeerTransport();
    currentRoomCode = '';
    isHost = false;
    connectError = describePeerError(error, 'Failed to create room');
    console.error(error);
  }
}

function installHostConnectionListener() {
  roomPeer.on('connection', connection => {
    // A room is limited to the host and one guest.
    if (roomConnection) {
      connection.on('open', () => {
        connection.send({ event: 'room_full', payload: {} });
        setTimeout(() => connection.close(), 250);
      });
      return;
    }

    const metadata = connection.metadata || {};
    const guestId = metadata.id || connection.peer;
    const guestName = String(metadata.name || 'Player').slice(0, 16);
    const guestColor = metadata.color || getPlayerColor(guestId);
    attachRoomConnection(connection, guestId, guestName, guestColor);

    connection.on('open', () => {
      otherPlayers[guestId] = playerNetworkState(guestId, guestName, guestColor);
      addChatMessage('System', guestName + ' joined');

      connection.send({
        event: 'init',
        payload: {
          roomCode: currentRoomCode,
          seed: roomSeed,
          blockChanges: Array.from(roomBlockChanges.values()),
          host: playerNetworkState(myId, playerName, getPlayerColor(myId), player),
          mobs: serializeMobs(),
          villagers: serializeVillagers(),
          animals: serializeAnimals(),
        }
      });
    });
  });
}

// ─── Join Room (Guest) ────────────────────────────────────
async function joinRoom(roomCode, name) {
  connectError = '';
  destroyPeerTransport();
  isMultiplayer = false;
  otherPlayers = {};

  const normalizedCode = String(roomCode || '').trim().toUpperCase();
  if (!/^[A-Z2-9]{6}$/.test(normalizedCode)) {
    connectError = 'Enter a valid 6-letter room code';
    return;
  }
  if (typeof Peer === 'undefined') {
    connectError = 'Online library failed to load';
    return;
  }

  myId = generatePlayerId();
  playerName = (name || 'Player').slice(0, 16);
  currentRoomCode = normalizedCode;

  try {
    roomPeer = new Peer(undefined, { debug: 0 });
    roomPeer.on('error', error => {
      if (pendingJoin) pendingJoin.reject(error);
    });
    await waitForPeerOpen(roomPeer);

    const snapshotPromise = waitForRoomSnapshot();
    const connection = roomPeer.connect(roomPeerId(normalizedCode), {
      metadata: {
        id: myId,
        name: playerName,
        color: getPlayerColor(myId),
      },
      serialization: 'json',
      reliable: true,
    });

    attachRoomConnection(connection, null, null, null);
    const [snapshot] = await Promise.all([
      snapshotPromise,
      waitForConnectionOpen(connection),
    ]);

    roomSeed = snapshot.seed;
    currentSession = { room_code: normalizedCode, seed: roomSeed };
    isHost = false;
    initializeMultiplayerWorld(roomSeed);

    roomBlockChanges = new Map();
    for (const change of snapshot.blockChanges || []) {
      const key = change.bx + ',' + change.by;
      roomBlockChanges.set(key, change);
      setBlock(change.bx, change.by, change.blockType);
    }
    if (snapshot.mobs) applyMobState(snapshot.mobs);
    if (snapshot.villagers) applyVillagerState(snapshot.villagers);
    if (snapshot.animals) applyAnimalState(snapshot.animals);

    if (snapshot.host) {
      otherPlayers[snapshot.host.id] = snapshot.host;
    }

    isMultiplayer = true;
    gameState = STATE.PLAYING;
    addChatMessage('System', 'Connected to room: ' + normalizedCode);
  } catch (error) {
    destroyPeerTransport();
    currentSession = null;
    currentRoomCode = '';
    isHost = false;
    connectError = describePeerError(error, error.message === 'Room is full' ? 'Room is full (2/2)' : 'Failed to join room');
    if (error.message === 'Room is full') {
      console.info('Room is full');
    } else {
      console.error(error);
    }
  }
}

function attachRoomConnection(connection, remoteId, remoteName, remoteColor) {
  roomConnection = connection;
  realtimeChannel = connection; // Kept for compatibility with the existing game state.

  connection.on('data', message => handlePeerMessage(message));
  connection.on('error', error => {
    if (pendingJoin) pendingJoin.reject(error);
    console.error('Room connection error:', error);
  });
  connection.on('close', () => {
    if (roomConnection !== connection) return;
    roomConnection = null;
    realtimeChannel = null;

    if (remoteId && otherPlayers[remoteId]) {
      const leftName = otherPlayers[remoteId].name || remoteName || 'Player';
      delete otherPlayers[remoteId];
      if (isMultiplayer && !transportShuttingDown) addChatMessage('System', leftName + ' left');
    } else if (isMultiplayer && !isHost && !transportShuttingDown) {
      otherPlayers = {};
      isHost = true;
      addChatMessage('System', 'Host left. You can keep playing offline.');
    }
  });
}

function handlePeerMessage(message) {
  if (!message || typeof message.event !== 'string') return;
  const payload = message.payload || {};

  if (message.event === 'init') {
    if (pendingJoin) pendingJoin.resolve(payload);
    return;
  }
  if (message.event === 'room_full') {
    if (pendingJoin) pendingJoin.reject(new Error('Room is full'));
    return;
  }

  switch (message.event) {
    case 'player_move':
      handlePlayerMove(payload);
      break;
    case 'block_set':
      handleBlockSet(payload);
      if (isHost) roomBlockChanges.set(payload.bx + ',' + payload.by, payload);
      break;
    case 'mob_state': handleMobState(payload); break;
    case 'chat': handleChat(payload); break;
    case 'attack_mob': handleAttackMob(payload); break;
    case 'attack_animal': handleAttackAnimal(payload); break;
    case 'drop_item': handleDropItem(payload); break;
    case 'pickup_item': handlePickupItem(payload); break;
    case 'mob_drop': handleMobDrop(payload); break;
    case 'damage_player': handleDamagePlayer(payload); break;
    case 'pvp_attack': handlePvpAttack(payload); break;
  }
}

function sendNetworkEvent(event, payload) {
  if (!isMultiplayer || !roomConnection || !roomConnection.open) return false;
  roomConnection.send({ event, payload });
  return true;
}

// ─── Network event handlers ───────────────────────────────
function handlePlayerMove(payload) {
  const { id, x, y, facing, walkFrame, health, selectedSlot, armor, heldItem, offhand } = payload;
  if (!id || id === myId) return;
  if (!otherPlayers[id]) {
    otherPlayers[id] = playerNetworkState(id, payload.name || 'Player', payload.color || getPlayerColor(id));
  }
  Object.assign(otherPlayers[id], { x, y, facing, walkFrame, health, selectedSlot, armor, heldItem, offhand });
}

function handleBlockSet(payload) {
  setBlock(payload.bx, payload.by, payload.blockType);
}

function handleMobState(payload) {
  if (isHost) return;
  if (payload.mobs) applyMobState(payload.mobs);
  if (payload.villagers) applyVillagerState(payload.villagers);
  if (payload.animals) applyAnimalState(payload.animals);
}

function handleChat(payload) {
  addChatMessage(payload.name, payload.message);
}

function handleAttackMob(payload) {
  if (!isHost) return;
  const { mobIndex, damage, knockbackDir, attackerId } = payload;
  if (mobIndex >= 0 && mobIndex < mobs.length) {
    const mob = mobs[mobIndex];
    mob.health -= damage;
    mob.hurtTimer = 300;
    mob.vx = knockbackDir * 5;
    mob.vy = -4;
    mob.onGround = false;
    mob.lastAttackerId = attackerId;
  }
}

function handleAttackAnimal(payload) {
  if (!isHost) return;
  const { animalIndex, damage, knockbackDir, attackerId } = payload;
  if (animalIndex >= 0 && animalIndex < animals.length) {
    const animal = animals[animalIndex];
    animal.health -= damage;
    animal.hurtTimer = 300;
    animal.vx = knockbackDir * 4;
    animal.vy = -3;
    animal.onGround = false;
    animal.state = 'flee';
    animal.fleeTimer = 3000;
    animal.lastAttackerId = attackerId;
  }
}

function handleDropItem(payload) {
  droppedItems.push({
    x: payload.x, y: payload.y, vx: payload.vx, vy: payload.vy,
    type: payload.type, count: payload.count,
    w: 16, h: 16, onGround: false, pickupDelay: 500, life: 300000,
  });
}

function handlePickupItem(payload) {
  if (payload.index >= 0 && payload.index < droppedItems.length) {
    droppedItems.splice(payload.index, 1);
  }
}

function handleMobDrop(payload) {
  if (payload.targetId === myId) addToInventory(payload.itemType);
}

function handleDamagePlayer(payload) {
  if (payload.targetId !== myId || playerHurtTimer > 0 || playerDeathTimer > 0) return;
  player.health -= payload.damage;
  playerHurtTimer = 500;
  player.vx = payload.knockbackDir * 6;
  player.vy = -4;
  if (player.health <= 0) {
    player.health = 0;
    playerDeathTimer = 3000;
  }
}

function handlePvpAttack(payload) {
  if (payload.targetId !== myId || playerHurtTimer > 0 || playerDeathTimer > 0) return;
  player.health -= payload.damage;
  playerHurtTimer = 500;
  player.vx = payload.knockbackDir * 8;
  player.vy = -5;
  if (player.health <= 0) {
    player.health = 0;
    playerDeathTimer = 3000;
    const attackerName = otherPlayers[payload.attackerId]?.name || 'Player';
    addChatMessage('System', attackerName + ' killed you!');
  }
}

// ─── Send functions used by the rest of the game ──────────
function netSendPosition() {
  if (!player) return;
  const heldItem = player.inventory[player.selectedSlot];
  sendNetworkEvent('player_move', {
    id: myId,
    name: playerName,
    color: getPlayerColor(myId),
    x: player.x,
    y: player.y,
    facing: player.facing,
    walkFrame: player.walkFrame,
    health: player.health,
    selectedSlot: player.selectedSlot,
    armor: player.armor,
    heldItem: heldItem ? { type: heldItem.type, count: heldItem.count } : null,
    offhand: player.offhand ? { type: player.offhand.type, count: player.offhand.count } : null,
  });
}

function netSendBlock(bx, by, blockType) {
  if (!isMultiplayer) return;
  const payload = { bx, by, blockType, playerId: myId };
  if (isHost) roomBlockChanges.set(bx + ',' + by, payload);
  sendNetworkEvent('block_set', payload);
}

function netSendMobState() {
  if (!isHost) return;
  sendNetworkEvent('mob_state', {
    mobs: serializeMobs(),
    villagers: serializeVillagers(),
    animals: serializeAnimals(),
  });
}

function netSendChat(message) {
  sendNetworkEvent('chat', { id: myId, name: playerName, message });
}

function netSendAttackMob(mobIndex, damage, knockbackDir) {
  sendNetworkEvent('attack_mob', { mobIndex, damage, knockbackDir, attackerId: myId });
}

function netSendAttackAnimal(animalIndex, damage, knockbackDir) {
  sendNetworkEvent('attack_animal', { animalIndex, damage, knockbackDir, attackerId: myId });
}

function netSendDropItem(dropped) {
  sendNetworkEvent('drop_item', {
    x: dropped.x, y: dropped.y, vx: dropped.vx, vy: dropped.vy,
    type: dropped.type, count: dropped.count,
  });
}

function netSendPickupItem(index) {
  sendNetworkEvent('pickup_item', { index });
}

function netSendMobDrop(targetId, itemType) {
  sendNetworkEvent('mob_drop', { targetId, itemType });
}

function netSendDamagePlayer(targetId, damage, knockbackDir) {
  sendNetworkEvent('damage_player', { targetId, damage, knockbackDir });
}

function netSendPvpAttack(targetId, damage, knockbackDir) {
  sendNetworkEvent('pvp_attack', { targetId, attackerId: myId, damage, knockbackDir });
}

function attackOtherPlayer() {
  if (!isMultiplayer || inventoryOpen || playerDeathTimer > 0) return false;
  const clickX = mouse.x + camera.x;
  const clickY = mouse.y + camera.y;
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;

  for (const [id, other] of Object.entries(otherPlayers)) {
    const width = BLOCK_SIZE * 0.6;
    const height = BLOCK_SIZE * 1.7;
    if (clickX >= other.x && clickX <= other.x + width &&
        clickY >= other.y && clickY <= other.y + height) {
      const distance = Math.hypot(pcx - other.x - width / 2, pcy - other.y - height / 2);
      if (distance < BLOCK_SIZE * 5) {
        const damage = getAttackDamage();
        const knockback = other.x + width / 2 > pcx ? 1 : -1;
        netSendPvpAttack(id, damage, knockback);
        damageHeldTool();
        return true;
      }
    }
  }
  return false;
}

function updateNetwork(dt) {
  if (!isMultiplayer || !roomConnection || !roomConnection.open) return;
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

async function disconnectFromServer() {
  isMultiplayer = false;
  destroyPeerTransport();
  currentSession = null;
  currentRoomCode = '';
  myId = null;
  isHost = false;
  otherPlayers = {};
  roomSeed = 0;
  roomBlockChanges = new Map();
}

function addChatMessage(name, message) {
  chatMessages.push({ name, message, time: Date.now() });
  if (chatMessages.length > 50) chatMessages.shift();
}

async function connectToServer(address, name) {
  if (address.length <= 8 && /^[A-Z0-9]+$/i.test(address)) {
    await joinRoom(address.toUpperCase(), name);
  } else {
    await createRoom(name);
  }
}
