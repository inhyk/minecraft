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
  } else if (gameState === STATE.WORLD_SELECT) {
    updateTitle(dt);
    drawWorldSelectScreen();
  } else if (gameState === STATE.CONTROLS) {
    updateTitle(dt);
    drawControlsScreen();
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
    // Nether mobs (single player or host)
    if (typeof spawnNetherMobs === 'function') spawnNetherMobs(dt);
    if (typeof updateNetherMobs === 'function') updateNetherMobs(dt);
    if (typeof updateFireballs === 'function') updateFireballs(dt);
    // End mobs
    if (typeof spawnEndMobs === 'function') spawnEndMobs(dt);
    if (typeof updateEndMobs === 'function') updateEndMobs(dt);
    updateArrows(dt);
    updateDroppedItems(dt);
    updateNetwork(dt);
    if (typeof updatePortals === 'function') updatePortals(dt);
    if (typeof updateAchievementToast === 'function') updateAchievementToast(dt);
    if (typeof checkExplorationAchievements === 'function') checkExplorationAchievements();
    if (typeof checkArmorAchievements === 'function') checkArmorAchievements();
    if (typeof updateAutosave === 'function') updateAutosave(dt);

    drawSky();
    // Only draw clouds in Overworld
    if (typeof currentDimension === 'undefined' || currentDimension === DIMENSION.OVERWORLD) {
      drawClouds();
    }
    drawWorld();
    drawDroppedItems();
    drawParticles();
    drawArrows();
    drawMobs();
    drawAnimals();
    drawVillagers();
    if (typeof drawNetherMobs === 'function') drawNetherMobs();
    if (typeof drawFireballs === 'function') drawFireballs();
    if (typeof drawEndMobs === 'function') drawEndMobs();
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
    if (typeof drawAchievementsScreen === 'function') drawAchievementsScreen();
    if (typeof drawAchievementToast === 'function') drawAchievementToast();

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
window.addEventListener('resize', resize);
initTitle();
initAchievements();

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
