// ============================================================
// Camera System
// ============================================================

function updateCamera() {
  const targetX = player.x + player.w / 2 - canvas.width / 2;
  const targetY = player.y + player.h / 2 - canvas.height / 2;
  camera.x += (targetX - camera.x) * 0.1;
  camera.y += (targetY - camera.y) * 0.1;

  // Clamp
  camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH * BLOCK_SIZE - canvas.width));
  camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT * BLOCK_SIZE - canvas.height));
}
