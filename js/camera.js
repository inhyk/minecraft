// ============================================================
// Camera System
// ============================================================

function updateCamera() {
  const targetX = player.x + player.w / 2 - canvas.width / 2;
  const targetY = player.y + player.h / 2 - canvas.height / 2;
  camera.x += (targetX - camera.x) * 0.1;
  camera.y += (targetY - camera.y) * 0.1;

  // Clamp Y only (X is unlimited for infinite world)
  camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT * BLOCK_SIZE - canvas.height));
}
