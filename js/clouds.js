// ============================================================
// Clouds System
// ============================================================

function initClouds() {
  clouds = [];
  const baseX = player ? player.x : SPAWN_X * BLOCK_SIZE;
  for (let i = 0; i < 15; i++) {
    clouds.push({
      x: baseX - 2000 + Math.random() * 4000,
      y: 20 + Math.random() * 200,
      w: 80 + Math.random() * 160,
      h: 30 + Math.random() * 30,
      speed: 0.2 + Math.random() * 0.3
    });
  }
}

function updateClouds(dt) {
  const t = Math.min(dt, 50) / TICK_RATE;
  const viewRight = camera.x + canvas.width + 300;
  const viewLeft = camera.x - 300;
  for (const c of clouds) {
    c.x += c.speed * t;
    // Recycle clouds that drift too far right
    if (c.x > viewRight + 200) {
      c.x = viewLeft - c.w;
    }
    // Recycle clouds that are too far left
    if (c.x + c.w < viewLeft - 200) {
      c.x = viewRight;
    }
  }
}

function drawClouds() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (const c of clouds) {
    const sx = c.x - camera.x * 0.3;
    const sy = c.y;
    if (sx + c.w < -50 || sx > canvas.width + 50) continue;
    ctx.beginPath();
    ctx.ellipse(sx + c.w/2, sy + c.h/2, c.w/2, c.h/2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(sx + c.w*0.3, sy + c.h*0.3, c.w*0.35, c.h*0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(sx + c.w*0.7, sy + c.h*0.4, c.w*0.3, c.h*0.35, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
