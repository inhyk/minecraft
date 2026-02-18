# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A 2D Minecraft clone with online multiplayer support built with vanilla JavaScript and Node.js. The game features procedural world generation, block mining/placing, crafting, mobs, and real-time multiplayer via WebSockets.

## Commands

- **Start server**: `npm start` or `node server.js`
- **Access game**: Open `http://localhost:3000` in a browser after starting the server

## Architecture

### Server (`server.js`)
- HTTP server serves static files (index.html)
- WebSocket server (using `ws` library) handles multiplayer
- Game state maintained on server: world seed, block changes, players, mob state
- Host player (first to join) controls mob simulation and syncs state to others
- Message types: `join`, `move`, `block_set`, `mob_state`, `chat`

### Client (`index.html`)
Single-file client containing all game logic in `<script>` tag:

- **Game states**: TITLE (0), PLAYING (1), CONNECT (2)
- **World generation**: Seeded procedural terrain with biomes, caves, ores, trees
- **Block system**: 19 block types with properties (solidity, hardness, drops)
- **Mob system**: Zombies, Creepers, Skeletons with AI and combat
- **Inventory/Crafting**: 36-slot inventory with 2x2 crafting grid
- **Multiplayer**: WebSocket connection to server, position sync, block sync

### Key Constants
- `BLOCK_SIZE`: 32px
- `WORLD_WIDTH`: 256 blocks
- `WORLD_HEIGHT`: 128 blocks
- `SURFACE_Y`: 50 (ground level)
- Server port: 3000

### Multiplayer Protocol
Server assigns player IDs and colors. Host (first player) runs mob simulation and broadcasts mob state. Block changes are stored server-side and sent to new players on join.
