// ============================================================
// Particles System
// ============================================================

function spawnBreakParticles(bx, by, type) {
  const cx = bx * BLOCK_SIZE + BLOCK_SIZE / 2;
  const cy = by * BLOCK_SIZE + BLOCK_SIZE / 2;
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.7) * 6,
      life: 30 + Math.random() * 20,
      type: type,
      size: 3 + Math.random() * 4
    });
  }
}

function updateParticles(dt) {
  const t = Math.min(dt, 50) / TICK_RATE;
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * t;
    p.y += p.vy * t;
    p.vy += 0.3 * t;
    p.life -= t;
    if (p.life <= 0) particles.splice(i, 1);
  }
}
