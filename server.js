const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;

// ─── HTTP Server (serve index.html) ─────────────────────────
const httpServer = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

// ─── WebSocket Server ───────────────────────────────────────
const wss = new WebSocketServer({ server: httpServer });

// Game state
const worldSeed = Math.floor(Math.random() * 2147483647);
const blockChanges = []; // { bx, by, type }
const players = {};      // id -> { ws, name, color, x, y, ... }
let hostId = null;
let nextId = 1;
let latestMobState = [];
let latestVillagerState = [];
let latestAnimalState = [];

const COLORS = [
  '#4aaaa5', '#e06040', '#60a0e0', '#e0c040',
  '#a060d0', '#60d080', '#d07090', '#80c0c0',
];

function broadcast(msg, excludeId) {
  const data = JSON.stringify(msg);
  for (const [id, p] of Object.entries(players)) {
    if (parseInt(id) !== excludeId && p.ws.readyState === 1) {
      p.ws.send(data);
    }
  }
}

function send(ws, msg) {
  if (ws.readyState === 1) ws.send(JSON.stringify(msg));
}

wss.on('connection', (ws) => {
  const id = nextId++;
  const color = COLORS[(id - 1) % COLORS.length];
  players[id] = { ws, name: '', color, x: 0, y: 0, facing: 1, walkFrame: 0, health: 20, selectedSlot: 0 };

  if (!hostId) hostId = id;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'join': {
        players[id].name = (msg.name || 'Player').substring(0, 16);
        // Send init to new player
        const otherPlayers = {};
        for (const [pid, p] of Object.entries(players)) {
          if (parseInt(pid) !== id) {
            otherPlayers[pid] = { name: p.name, color: p.color, x: p.x, y: p.y, facing: p.facing, health: p.health };
          }
        }
        send(ws, {
          type: 'init',
          id,
          seed: worldSeed,
          hostId,
          color,
          players: otherPlayers,
          blockChanges,
          mobState: latestMobState,
        });
        // Tell others about new player
        broadcast({ type: 'player_join', id, name: players[id].name, color }, id);
        console.log(`[+] Player ${id} "${players[id].name}" joined (${Object.keys(players).length} online)`);
        break;
      }

      case 'move': {
        const p = players[id];
        if (!p) break;
        p.x = msg.x; p.y = msg.y;
        p.facing = msg.facing;
        p.walkFrame = msg.walkFrame;
        p.health = msg.health;
        p.selectedSlot = msg.selectedSlot;
        broadcast({ type: 'player_move', id, x: msg.x, y: msg.y, facing: msg.facing, walkFrame: msg.walkFrame, health: msg.health, selectedSlot: msg.selectedSlot }, id);
        break;
      }

      case 'block_set': {
        blockChanges.push({ bx: msg.bx, by: msg.by, blockType: msg.blockType });
        broadcast({ type: 'block_set', bx: msg.bx, by: msg.by, blockType: msg.blockType, playerId: id }, id);
        break;
      }

      case 'mob_state': {
        if (id === hostId) {
          latestMobState = msg.mobs;
          latestVillagerState = msg.villagers || [];
          latestAnimalState = msg.animals || [];
          broadcast({ type: 'mob_state', mobs: msg.mobs, villagers: msg.villagers, animals: msg.animals }, id);
        }
        break;
      }

      case 'chat': {
        const name = players[id]?.name || 'Unknown';
        broadcast({ type: 'chat', id, name, message: (msg.message || '').substring(0, 200) });
        console.log(`[Chat] ${name}: ${msg.message}`);
        break;
      }
    }
  });

  ws.on('close', () => {
    const name = players[id]?.name || 'Unknown';
    delete players[id];
    broadcast({ type: 'player_leave', id });
    console.log(`[-] Player ${id} "${name}" left (${Object.keys(players).length} online)`);

    // Transfer host
    if (hostId === id) {
      const remaining = Object.keys(players).map(Number);
      hostId = remaining.length > 0 ? remaining[0] : null;
      if (hostId) {
        broadcast({ type: 'host_change', hostId });
        console.log(`[Host] Transferred to player ${hostId}`);
      }
    }
  });

  ws.on('error', () => {});
});

httpServer.listen(PORT, () => {
  console.log(`\n  ⛏  Minecraft 2D Server`);
  console.log(`  ─────────────────────`);
  console.log(`  Web:       http://localhost:${PORT}`);
  console.log(`  WebSocket: ws://localhost:${PORT}`);
  console.log(`  Seed:      ${worldSeed}\n`);
});
