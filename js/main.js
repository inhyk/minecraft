// ============================================================
// Main Loop and Initialization
// ============================================================

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === STATE.TITLE) {
    updateTitle(dt);
    drawTitle();
  } else if (gameState === STATE.CONNECT) {
    titleTime += dt * 0.001;
    drawConnectScreen();
  } else if (gameState === STATE.PLAYING) {
    updatePlayerStatus(dt);
    updatePlayer(dt);
    ensureChunksLoaded();
    updateMining(dt);
    updateCamera();
    updateClouds(dt);
    updateParticles(dt);
    // Only host spawns/updates mobs, animals and villagers
    if (isHost) {
      spawnMobs(dt);
      updateMobs(dt);
      spawnAnimals(dt);
      updateAnimals(dt);
      updateVillagers(dt);
    }
    updateArrows(dt);
    updateDroppedItems(dt);
    updateNetwork(dt);

    drawSky();
    drawClouds();
    drawWorld();
    drawDroppedItems();
    drawParticles();
    drawArrows();
    drawMobs();
    drawAnimals();
    drawVillagers();
    drawOtherPlayers();
    drawPlayerWithHurt();
    if (!inventoryOpen) {
      drawTargetHighlight();
      drawMiningOverlay();
    }
    drawHotbar();
    drawHUD();
    drawChat();
    drawDeathScreen();
    drawInventory();
    drawTradeUI();

    // Multiplayer indicator
    if (isMultiplayer) {
      const count = Object.keys(otherPlayers).length + 1;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(canvas.width - 135, 34, 127, 22);
      ctx.fillStyle = '#6f6';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Online: ${count} ${isHost ? '(Host)' : ''}`, canvas.width - 14, 49);
    }
  }

  requestAnimationFrame(gameLoop);
}

// ============================================================
// Initialize Game
// ============================================================
resize();
initTitle();

// Initialize Supabase auth
(async function initAuth() {
  try {
    await checkAuthSession();
    setupAuthListener();
  } catch (e) {
    console.log('Auth init skipped');
  }
})();

lastTime = performance.now();
requestAnimationFrame(gameLoop);
