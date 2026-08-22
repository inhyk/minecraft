// ============================================================
// Four-player networking (PeerJS / WebRTC)
// ============================================================

const PLAYER_COLORS = [
  '#4aaaa5', '#e06040', '#60a0e0', '#e0c040',
  '#a060d0', '#60d080', '#d07090', '#80c0c0',
];

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_PEER_PREFIX = 'inh-minecraft-';
const NETWORK_TIMEOUT = 12000;
const HEARTBEAT_INTERVAL = 3000;
const PLAYER_CONNECTION_TIMEOUT = 60000;
const ROOM_ROSTER_SYNC_INTERVAL = 1000;
const ROOM_RECONNECT_DELAYS = [500, 1500, 3000, 5000, 8000];
const MAX_ROOM_PLAYERS = 4;

let roomPeer = null;
let roomConnection = null;
let roomConnections = new Map(); // host only: guest id -> PeerJS connection
let roomGuestLastSeen = new Map();
let roomHeartbeatTimer = null;
let roomRosterSyncTimer = 0;
let roomReconnectTimer = null;
let roomReconnectAttempt = 0;
let roomReconnectInProgress = false;
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
    id: m.networkId, type: m.type, x: m.x, y: m.y, facing: m.facing,
    walkFrame: m.walkFrame, health: m.health, maxHealth: m.maxHealth,
    state: m.state, fuse: m.fuse, hurtTimer: m.hurtTimer,
    vx: m.vx, vy: m.vy, onGround: m.onGround,
    shootCooldown: m.shootCooldown, idleTimer: m.idleTimer,
    despawnTimer: m.despawnTimer,
  }));
}

function serializeAnimals() {
  return animals.map(a => ({
    id: a.networkId, type: a.type, x: a.x, y: a.y, facing: a.facing,
    walkFrame: a.walkFrame, health: a.health, maxHealth: a.maxHealth,
    state: a.state, hurtTimer: a.hurtTimer,
    vx: a.vx, vy: a.vy, onGround: a.onGround,
    idleTimer: a.idleTimer, wanderTimer: a.wanderTimer,
    fleeTimer: a.fleeTimer,
  }));
}

function initializeMultiplayerWorld(seed) {
  initWorldSeed(seed);
  generateWorld();
  player = createPlayer();
  player.color = getPlayerColor(myId);
  initClouds();

  mobs = [];
  nextMobNetworkId = 1;
  animals = [];
  nextAnimalNetworkId = 1;
  lastCreatureSnapshotAt = Date.now();
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
  if (roomHeartbeatTimer) clearInterval(roomHeartbeatTimer);
  roomHeartbeatTimer = null;
  if (roomReconnectTimer) clearTimeout(roomReconnectTimer);
  roomReconnectTimer = null;
  roomReconnectAttempt = 0;
  roomReconnectInProgress = false;
  roomRosterSyncTimer = 0;
  if (pendingJoin) pendingJoin.reject(new Error('Connection cancelled'));
  pendingJoin = null;
  try {
    if (roomConnection) roomConnection.close();
  } catch (error) {
    console.debug('Connection cleanup:', error);
  }
  for (const connection of roomConnections.values()) {
    try {
      connection.close();
    } catch (error) {
      console.debug('Guest connection cleanup:', error);
    }
  }
  roomConnections.clear();
  roomGuestLastSeen.clear();
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
    addChatMessage('System', 'Share this code — up to 4 players can join.');
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
    pruneGuestConnections();

    // The host acts as a relay for up to three guests.
    if (roomConnections.size >= MAX_ROOM_PLAYERS - 1) {
      connection.on('open', () => {
        connection.send({ event: 'room_full', payload: { maxPlayers: MAX_ROOM_PLAYERS } });
        setTimeout(() => connection.close(), 250);
      });
      return;
    }

    const metadata = connection.metadata || {};
    const guestId = metadata.id || connection.peer;
    const guestName = String(metadata.name || 'Player').slice(0, 16);
    const guestColor = metadata.color || getPlayerColor(guestId);
    connection.roomGuestName = guestName;
    connection.roomGuestColor = guestColor;

    if (roomConnections.has(guestId)) {
      connection.on('open', () => {
        connection.send({ event: 'join_error', payload: { message: 'Duplicate player' } });
        setTimeout(() => connection.close(), 250);
      });
      return;
    }

    attachRoomConnection(connection, guestId, guestName, guestColor);

    const finishGuestJoin = () => {
      if (roomConnections.get(guestId) !== connection) return;
      if (connection.roomJoinFinished) return;
      connection.roomJoinFinished = true;

      const wasKnown = Boolean(otherPlayers[guestId]);
      const guest = otherPlayers[guestId] || playerNetworkState(guestId, guestName, guestColor);
      otherPlayers[guestId] = guest;
      if (!wasKnown) addChatMessage('System', guestName + ' joined');

      connection.send({
        event: 'init',
        payload: {
          roomCode: currentRoomCode,
          seed: roomSeed,
          blockChanges: Array.from(roomBlockChanges.values()),
          players: buildRoomRoster(),
          mobs: serializeMobs(),
          villagers: serializeVillagers(),
          animals: serializeAnimals(),
        }
      });

      broadcastHostEvent('player_join', { player: guest }, guestId);
      sendRoomRoster();
    };

    // Incoming PeerJS connections can already be open when this listener runs.
    if (connection.open) finishGuestJoin();
    else connection.on('open', finishGuestJoin);
  });
}

// ─── Join Room (Guest) ────────────────────────────────────
async function joinRoom(roomCode, name) {
  connectError = '';
  destroyPeerTransport();
  isMultiplayer = false;
  isHost = false;
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

    const snapshot = await openGuestRoomConnection(normalizedCode);
    applyRoomSnapshot(snapshot, true);

    isMultiplayer = true;
    gameState = STATE.PLAYING;
    roomReconnectAttempt = 0;
    netSendPosition();
    addChatMessage('System', 'Connected to room: ' + normalizedCode);
  } catch (error) {
    destroyPeerTransport();
    currentSession = null;
    currentRoomCode = '';
    isHost = false;
    connectError = describePeerError(error, error.message === 'Room is full' ? 'Room is full (4/4)' : 'Failed to join room');
    if (error.message === 'Room is full') {
      console.info('Room is full');
    } else {
      console.error(error);
    }
  }
}

function openGuestRoomConnection(roomCode) {
  const snapshotPromise = waitForRoomSnapshot();
  const connection = roomPeer.connect(roomPeerId(roomCode), {
    metadata: {
      id: myId,
      name: playerName,
      color: getPlayerColor(myId),
    },
    serialization: 'json',
    reliable: true,
  });

  attachRoomConnection(connection, null, null, null);
  return Promise.all([
    snapshotPromise,
    waitForConnectionOpen(connection),
  ]).then(([snapshot]) => snapshot);
}

function applyRoomSnapshot(snapshot, resetWorld) {
  const nextSeed = snapshot.seed;
  const needsWorldReset = resetWorld || roomSeed !== nextSeed;
  roomSeed = nextSeed;
  currentSession = { room_code: currentRoomCode, seed: roomSeed };
  if (needsWorldReset) initializeMultiplayerWorld(roomSeed);

  roomBlockChanges = new Map();
  for (const change of snapshot.blockChanges || []) {
    const key = change.bx + ',' + change.by;
    roomBlockChanges.set(key, change);
    setBlock(change.bx, change.by, change.blockType);
  }
  if (snapshot.mobs) applyMobState(snapshot.mobs);
  if (snapshot.villagers) applyVillagerState(snapshot.villagers);
  if (snapshot.animals) applyAnimalState(snapshot.animals);

  if (snapshot.players) {
    applyRoomRoster({ players: snapshot.players });
  } else if (snapshot.host) {
    otherPlayers = {
      [snapshot.host.id]: { ...snapshot.host, isHost: true },
    };
  }
}

function scheduleRoomReconnect() {
  if (!isMultiplayer || isHost || transportShuttingDown || roomReconnectTimer || roomReconnectInProgress) return;
  const delay = ROOM_RECONNECT_DELAYS[Math.min(roomReconnectAttempt, ROOM_RECONNECT_DELAYS.length - 1)];
  roomReconnectTimer = setTimeout(() => {
    roomReconnectTimer = null;
    reconnectGuestRoom();
  }, delay);
}

async function reconnectGuestRoom() {
  if (!isMultiplayer || isHost || transportShuttingDown || roomReconnectInProgress) return;
  roomReconnectInProgress = true;
  try {
    if (!roomPeer || roomPeer.destroyed || roomPeer.disconnected) {
      roomPeer = new Peer(undefined, { debug: 0 });
      roomPeer.on('error', error => {
        if (pendingJoin) pendingJoin.reject(error);
      });
      await waitForPeerOpen(roomPeer);
    }

    const snapshot = await openGuestRoomConnection(currentRoomCode);
    applyRoomSnapshot(snapshot, false);
    isHost = false;
    roomReconnectAttempt = 0;
    netSendPosition();
    addChatMessage('System', 'Reconnected to room.');
  } catch (error) {
    roomReconnectAttempt++;
    console.info('Room reconnect retry:', error.message || error);
  } finally {
    roomReconnectInProgress = false;
    if (!roomConnection?.open) scheduleRoomReconnect();
  }
}

function attachRoomConnection(connection, remoteId, remoteName, remoteColor) {
  if (remoteId) {
    connection.roomAddedAt = Date.now();
    roomConnections.set(remoteId, connection);
    roomGuestLastSeen.set(remoteId, Date.now());
  } else {
    roomConnection = connection;
    const startHeartbeat = () => {
      if (roomConnection !== connection) return;
      if (roomHeartbeatTimer) clearInterval(roomHeartbeatTimer);
      const sendHeartbeat = () => {
        if (roomConnection === connection && connection.open) {
          connection.send({ event: 'heartbeat', payload: { id: myId } });
        }
      };
      sendHeartbeat();
      roomHeartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    };
    if (connection.open) startHeartbeat();
    else connection.on('open', startHeartbeat);
  }
  realtimeChannel = connection; // Kept for compatibility with the existing game state.

  connection.on('data', message => handlePeerMessage(message, remoteId));
  let openTimeout = null;
  if (remoteId) {
    openTimeout = setTimeout(() => {
      if (roomConnections.get(remoteId) === connection && !connection.open) {
        removeGuestFromRoom(remoteId, connection, false);
      }
    }, NETWORK_TIMEOUT + 250);
    connection.on('open', () => clearTimeout(openTimeout));
  }
  connection.on('error', error => {
    if (pendingJoin) pendingJoin.reject(error);
    if (remoteId && roomConnections.get(remoteId) === connection && !connection.open) {
      removeGuestFromRoom(remoteId, connection, false);
    }
    console.error('Room connection error:', error);
  });
  connection.on('close', () => {
    if (openTimeout) clearTimeout(openTimeout);
    if (remoteId) {
      removeGuestFromRoom(
        remoteId,
        connection,
        isMultiplayer && !transportShuttingDown,
        remoteName
      );
      return;
    }

    if (roomConnection !== connection) return;
    if (roomHeartbeatTimer) clearInterval(roomHeartbeatTimer);
    roomHeartbeatTimer = null;
    roomConnection = null;
    realtimeChannel = null;
    if (isMultiplayer && !isHost && !transportShuttingDown) {
      addChatMessage('System', 'Connection lost. Reconnecting...');
      scheduleRoomReconnect();
    }
  });
}

function handlePeerMessage(message, sourceId = null) {
  if (!message || typeof message.event !== 'string') return;
  let payload = message.payload || {};

  if (isHost && sourceId && roomConnections.has(sourceId)) {
    roomGuestLastSeen.set(sourceId, Date.now());
    ensureHostGuestState(sourceId);
  }

  if (message.event === 'heartbeat') {
    if (isHost && sourceId) sendRoomRoster(roomConnections.get(sourceId));
    return;
  }

  if (message.event === 'init') {
    if (pendingJoin) pendingJoin.resolve(payload);
    return;
  }
  if (message.event === 'room_full') {
    if (pendingJoin) pendingJoin.reject(new Error('Room is full'));
    return;
  }
  if (message.event === 'join_error') {
    if (pendingJoin) pendingJoin.reject(new Error(payload.message || 'Could not join room'));
    return;
  }

  // Do not trust a guest to claim another player's identity.
  if (isHost && sourceId) {
    if (message.event === 'player_move') {
      payload = {
        ...payload,
        id: sourceId,
        name: otherPlayers[sourceId]?.name || payload.name,
        color: otherPlayers[sourceId]?.color || payload.color,
      };
    } else if (message.event === 'chat') {
      payload = { ...payload, id: sourceId, name: otherPlayers[sourceId]?.name || 'Player' };
    } else if (message.event === 'block_set') {
      payload = { ...payload, playerId: sourceId };
    } else if (message.event === 'pvp_attack') {
      payload = { ...payload, attackerId: sourceId };
    } else if (message.event === 'attack_mob' || message.event === 'attack_animal') {
      payload = { ...payload, attackerId: sourceId };
    }
  }

  switch (message.event) {
    case 'player_join': handlePlayerJoin(payload); break;
    case 'player_leave': handlePlayerLeave(payload); break;
    case 'room_roster':
      if (!isHost) applyRoomRoster(payload);
      break;
    case 'player_move':
      handlePlayerMove(payload);
      break;
    case 'block_set':
      handleBlockSet(payload);
      if (isHost) roomBlockChanges.set(payload.bx + ',' + payload.by, payload);
      break;
    case 'creeper_explosion': handleCreeperExplosion(payload); break;
    case 'achievement_progress': handleAchievementProgress(payload); break;
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

  // Guests only connect to the host, so the host relays shared events to
  // every other guest. Host-authoritative combat events are reflected in
  // the regular mob snapshots instead.
  if (isHost && sourceId && [
    'player_move', 'block_set', 'chat', 'drop_item', 'pickup_item',
    'mob_drop', 'damage_player', 'pvp_attack'
  ].includes(message.event)) {
    broadcastHostEvent(message.event, payload, sourceId);
  }
}

function broadcastHostEvent(event, payload, excludeId = null) {
  let sent = false;
  for (const [guestId, connection] of roomConnections.entries()) {
    if (guestId === excludeId || !connection.open) continue;
    connection.send({ event, payload });
    sent = true;
  }
  return sent;
}

function ensureHostGuestState(guestId) {
  if (otherPlayers[guestId]) return otherPlayers[guestId];
  const connection = roomConnections.get(guestId);
  if (!connection) return null;
  const metadata = connection.metadata || {};
  const guest = playerNetworkState(
    guestId,
    connection.roomGuestName || metadata.name || 'Player',
    connection.roomGuestColor || metadata.color || getPlayerColor(guestId)
  );
  otherPlayers[guestId] = guest;
  return guest;
}

function buildRoomRoster() {
  const players = {
    [myId]: {
      ...playerNetworkState(myId, playerName, getPlayerColor(myId), player),
      isHost: true,
    }
  };
  for (const [guestId, connection] of roomConnections.entries()) {
    if (!connection.open) continue;
    const guest = ensureHostGuestState(guestId);
    if (guest) players[guestId] = { ...guest, isHost: false };
  }
  return players;
}

function sendRoomRoster(connection = null) {
  if (!isHost) return false;
  const message = { event: 'room_roster', payload: { players: buildRoomRoster() } };
  if (connection) {
    if (!connection.open) return false;
    connection.send(message);
    return true;
  }
  return broadcastHostEvent(message.event, message.payload);
}

function applyRoomRoster(payload) {
  if (!payload?.players) return;
  const nextPlayers = {};
  for (const networkPlayer of Object.values(payload.players)) {
    if (!networkPlayer?.id || networkPlayer.id === myId) continue;
    nextPlayers[networkPlayer.id] = {
      ...(otherPlayers[networkPlayer.id] || {}),
      ...networkPlayer,
    };
  }
  otherPlayers = nextPlayers;
}

function removeGuestFromRoom(guestId, connection, announce, fallbackName = 'Player') {
  if (connection && roomConnections.get(guestId) !== connection) return false;

  const activeConnection = roomConnections.get(guestId);
  const guest = otherPlayers[guestId];
  roomConnections.delete(guestId);
  roomGuestLastSeen.delete(guestId);
  delete otherPlayers[guestId];

  try {
    if (activeConnection && activeConnection.open) activeConnection.close();
  } catch (error) {
    console.debug('Guest connection cleanup:', error);
  }

  if (announce && guest) {
    addChatMessage('System', (guest.name || fallbackName) + ' left');
    broadcastHostEvent('player_leave', { id: guestId });
  }
  return true;
}

function pruneGuestConnections() {
  if (!isHost) return;
  const now = Date.now();
  for (const [guestId, connection] of roomConnections.entries()) {
    const neverOpened = !connection.open &&
      now - (connection.roomAddedAt || now) >= NETWORK_TIMEOUT;
    const stoppedResponding = connection.open &&
      now - (roomGuestLastSeen.get(guestId) || now) >= PLAYER_CONNECTION_TIMEOUT;
    if (neverOpened || stoppedResponding) {
      removeGuestFromRoom(guestId, connection, isMultiplayer && stoppedResponding);
    }
  }
}

function sendNetworkEvent(event, payload) {
  if (!isMultiplayer) return false;
  if (isHost) return broadcastHostEvent(event, payload);
  if (!roomConnection || !roomConnection.open) return false;
  roomConnection.send({ event, payload });
  return true;
}

// ─── Network event handlers ───────────────────────────────
function handlePlayerJoin(payload) {
  const networkPlayer = payload.player;
  if (!networkPlayer?.id || networkPlayer.id === myId) return;
  const wasKnown = Boolean(otherPlayers[networkPlayer.id]);
  otherPlayers[networkPlayer.id] = networkPlayer;
  if (!wasKnown) addChatMessage('System', (networkPlayer.name || 'Player') + ' joined');
}

function handlePlayerLeave(payload) {
  if (!payload.id || !otherPlayers[payload.id]) return;
  const name = otherPlayers[payload.id].name || 'Player';
  delete otherPlayers[payload.id];
  addChatMessage('System', name + ' left');
}

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

function handleCreeperExplosion(payload) {
  if (isHost) return;
  for (const change of payload.blocks || []) {
    setBlock(change.bx, change.by, change.blockType);
    if (Math.random() < 0.3) {
      spawnBreakParticles(change.bx, change.by, change.originalBlock || B.DIRT);
    }
  }
  spawnCreeperExplosionParticles(payload.x, payload.y);
}

function handleAchievementProgress(payload) {
  if (isHost || payload.targetId !== myId) return;
  if (payload.kind === 'mob_kill') {
    checkMobKillAchievement(payload.data?.mobType);
  } else if (payload.kind === 'animal_kill') {
    checkAnimalKillAchievement(payload.data?.animalType);
  }
}

function handleMobState(payload) {
  if (isHost) return;
  lastCreatureSnapshotAt = Date.now();
  if (payload.mobs) applyMobState(payload.mobs);
  if (payload.villagers) applyVillagerState(payload.villagers);
  if (payload.animals) applyAnimalState(payload.animals);
}

function handleChat(payload) {
  addChatMessage(payload.name, payload.message);
}

function handleAttackMob(payload) {
  if (!isHost) return;
  const { mobId, mobIndex, damage, knockbackDir, attackerId } = payload;
  const mob = mobId ? mobs.find(candidate => candidate.networkId === mobId) : mobs[mobIndex];
  if (mob) {
    mob.health -= damage;
    mob.hurtTimer = 300;
    mob.vx = knockbackDir * 5;
    mob.vy = -4;
    mob.onGround = false;
    mob.lastAttackerId = attackerId;
    netSendMobState();
  }
}

function handleAttackAnimal(payload) {
  if (!isHost) return;
  const { animalId, animalIndex, damage, knockbackDir, attackerId } = payload;
  const animal = animalId ? animals.find(candidate => candidate.networkId === animalId) : animals[animalIndex];
  if (animal) {
    animal.health -= damage;
    animal.hurtTimer = 300;
    animal.vx = knockbackDir * 4;
    animal.vy = -3;
    animal.onGround = false;
    animal.state = 'flee';
    animal.fleeTimer = 3000;
    animal.lastAttackerId = attackerId;
    netSendMobState();
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
  if (payload.targetId !== myId) return;
  damagePlayer(payload.damage, payload.knockbackDir, 8);
}

function handlePvpAttack(payload) {
  if (payload.targetId !== myId) return;
  const wasAlive = playerDeathTimer <= 0;
  const wasHit = damagePlayer(payload.damage, payload.knockbackDir, 10);
  if (wasHit && wasAlive && playerDeathTimer > 0) {
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

function netSendCreeperExplosion(x, y, blocks) {
  if (!isMultiplayer || !isHost) return;
  for (const change of blocks) {
    roomBlockChanges.set(change.bx + ',' + change.by, {
      bx: change.bx,
      by: change.by,
      blockType: change.blockType,
      playerId: myId,
    });
  }
  sendNetworkEvent('creeper_explosion', { x, y, blocks });
}

function netSendAchievementProgress(targetId, kind, data) {
  if (!isMultiplayer || !isHost || !targetId) return;
  sendNetworkEvent('achievement_progress', { targetId, kind, data });
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

function netSendAttackMob(mobId, damage, knockbackDir) {
  return sendNetworkEvent('attack_mob', { mobId, damage, knockbackDir, attackerId: myId });
}

function netSendAttackAnimal(animalId, damage, knockbackDir) {
  return sendNetworkEvent('attack_animal', { animalId, damage, knockbackDir, attackerId: myId });
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
  if (!isMultiplayer) return;
  if (isHost) pruneGuestConnections();
  const hasOpenConnection = isHost
    ? Array.from(roomConnections.values()).some(connection => connection.open)
    : Boolean(roomConnection?.open);
  if (!hasOpenConnection) return;
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

  if (isHost) {
    roomRosterSyncTimer += dt;
    if (roomRosterSyncTimer >= ROOM_ROSTER_SYNC_INTERVAL) {
      roomRosterSyncTimer = 0;
      sendRoomRoster();
    }
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
