// ============================================================
// Block Types and Rendering
// ============================================================

const B = {
  AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, WOOD: 4,
  LEAVES: 5, SAND: 6, WATER: 7, COAL_ORE: 8,
  IRON_ORE: 9, GOLD_ORE: 10, DIAMOND_ORE: 11,
  BEDROCK: 12, PLANKS: 13, COBBLESTONE: 14, BRICK: 15,
  GLASS: 16, SNOW: 17, CRAFT_TABLE: 18, COPPER_ORE: 19
};

const BLOCK_INFO = {
  [B.AIR]:        { name: "Air",       solid: false, color: null },
  [B.GRASS]:      { name: "Grass",     solid: true,  hardness: 1 },
  [B.DIRT]:       { name: "Dirt",      solid: true,  hardness: 1 },
  [B.STONE]:      { name: "Stone",     solid: true,  hardness: 3, drop: B.COBBLESTONE },
  [B.WOOD]:       { name: "Wood",      solid: true,  hardness: 2 },
  [B.LEAVES]:     { name: "Leaves",    solid: true,  hardness: 0.5 },
  [B.SAND]:       { name: "Sand",      solid: true,  hardness: 1 },
  [B.WATER]:      { name: "Water",     solid: false, hardness: -1 },
  [B.COAL_ORE]:   { name: "Coal Ore",  solid: true,  hardness: 4 },
  [B.IRON_ORE]:   { name: "Iron Ore",  solid: true,  hardness: 5 },
  [B.GOLD_ORE]:   { name: "Gold Ore",  solid: true,  hardness: 5 },
  [B.DIAMOND_ORE]:{ name: "Diamond",   solid: true,  hardness: 6 },
  [B.BEDROCK]:    { name: "Bedrock",   solid: true,  hardness: -1 },
  [B.PLANKS]:     { name: "Planks",    solid: true,  hardness: 2 },
  [B.COBBLESTONE]:{ name: "Cobble",    solid: true,  hardness: 3 },
  [B.BRICK]:      { name: "Brick",     solid: true,  hardness: 3 },
  [B.GLASS]:      { name: "Glass",     solid: true,  hardness: 0.5 },
  [B.SNOW]:       { name: "Snow",      solid: true,  hardness: 1 },
  [B.CRAFT_TABLE]:{ name: "Craft",     solid: true,  hardness: 2 },
  [B.COPPER_ORE]: { name: "Copper Ore",solid: true,  hardness: 4 },
};

function drawBlock(x, y, type, size) {
  if (type === B.AIR || type === B.WATER) {
    if (type === B.WATER) {
      ctx.fillStyle = 'rgba(30, 100, 200, 0.6)';
      ctx.fillRect(x, y, size, size);
    }
    return;
  }
  const s = size;
  switch(type) {
    case B.GRASS:
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#4a8c2a';
      ctx.fillRect(x, y, s, s * 0.3);
      ctx.fillStyle = '#5ba033';
      ctx.fillRect(x + 2, y, s - 4, s * 0.15);
      break;
    case B.DIRT:
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#7a5c12';
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.15, s*0.15);
      ctx.fillRect(x + s*0.6, y + s*0.6, s*0.15, s*0.15);
      ctx.fillRect(x + s*0.1, y + s*0.7, s*0.1, s*0.1);
      break;
    case B.STONE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#999';
      ctx.fillRect(x + 2, y + 2, s*0.4, s*0.35);
      ctx.fillRect(x + s*0.5, y + s*0.45, s*0.4, s*0.35);
      ctx.fillStyle = '#777';
      ctx.fillRect(x + s*0.5, y + 2, s*0.3, s*0.25);
      ctx.fillRect(x + 2, y + s*0.5, s*0.35, s*0.3);
      break;
    case B.WOOD:
      ctx.fillStyle = '#6B4226';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5a3720';
      ctx.fillRect(x + s*0.3, y, s*0.05, s);
      ctx.fillRect(x + s*0.65, y, s*0.05, s);
      ctx.fillStyle = '#7a5232';
      ctx.fillRect(x + s*0.15, y, s*0.1, s);
      ctx.fillRect(x + s*0.48, y, s*0.1, s);
      break;
    case B.LEAVES:
      ctx.fillStyle = '#2d8a2d';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3aa83a';
      for (let i = 0; i < 5; i++) {
        const lx = x + (Math.sin(i*2.5 + x) * 0.3 + 0.5) * s * 0.7;
        const ly = y + (Math.cos(i*1.7 + y) * 0.3 + 0.5) * s * 0.7;
        ctx.fillRect(lx, ly, s*0.2, s*0.2);
      }
      break;
    case B.SAND:
      ctx.fillStyle = '#e8d68a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#d4c278';
      ctx.fillRect(x + s*0.2, y + s*0.4, s*0.1, s*0.1);
      ctx.fillRect(x + s*0.6, y + s*0.2, s*0.1, s*0.1);
      ctx.fillRect(x + s*0.4, y + s*0.7, s*0.1, s*0.1);
      break;
    case B.COAL_ORE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#222';
      ctx.fillRect(x + s*0.2, y + s*0.2, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.25, s*0.25);
      ctx.fillRect(x + s*0.15, y + s*0.6, s*0.2, s*0.15);
      break;
    case B.IRON_ORE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#d4a76a';
      ctx.fillRect(x + s*0.15, y + s*0.15, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.55, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.5, y + s*0.15, s*0.15, s*0.15);
      break;
    case B.GOLD_ORE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#fcdb4a';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.25, s*0.25);
      break;
    case B.DIAMOND_ORE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5ce8e8';
      ctx.fillRect(x + s*0.2, y + s*0.2, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.2, s*0.25);
      ctx.fillRect(x + s*0.1, y + s*0.6, s*0.15, s*0.15);
      break;
    case B.BEDROCK:
      ctx.fillStyle = '#444';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#333';
      ctx.fillRect(x + 1, y + 1, s*0.35, s*0.4);
      ctx.fillRect(x + s*0.4, y + s*0.35, s*0.4, s*0.45);
      ctx.fillStyle = '#555';
      ctx.fillRect(x + s*0.45, y + 1, s*0.35, s*0.3);
      break;
    case B.PLANKS:
      ctx.fillStyle = '#b8924a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a67e3a';
      ctx.fillRect(x, y + s*0.48, s, s*0.04);
      ctx.fillRect(x + s*0.33, y, s*0.03, s);
      ctx.fillRect(x + s*0.66, y, s*0.03, s);
      break;
    case B.COBBLESTONE:
      ctx.fillStyle = '#777';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#888';
      ctx.fillRect(x + 1, y + 1, s*0.45, s*0.4);
      ctx.fillRect(x + s*0.5, y + s*0.45, s*0.45, s*0.45);
      ctx.fillStyle = '#666';
      ctx.fillRect(x + s*0.5, y + 1, s*0.4, s*0.35);
      ctx.fillRect(x + 1, y + s*0.5, s*0.4, s*0.35);
      break;
    case B.BRICK:
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#aaa';
      ctx.fillRect(x, y + s*0.24, s, s*0.04);
      ctx.fillRect(x, y + s*0.52, s, s*0.04);
      ctx.fillRect(x, y + s*0.76, s, s*0.04);
      ctx.fillRect(x + s*0.5, y, s*0.04, s*0.24);
      ctx.fillRect(x + s*0.25, y + s*0.28, s*0.04, s*0.24);
      ctx.fillRect(x + s*0.75, y + s*0.28, s*0.04, s*0.24);
      ctx.fillRect(x + s*0.5, y + s*0.56, s*0.04, s*0.2);
      break;
    case B.GLASS:
      ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';
      ctx.fillRect(x, y, s, s);
      ctx.strokeStyle = 'rgba(180, 210, 240, 0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, s - 2, s - 2);
      ctx.beginPath();
      ctx.moveTo(x + s*0.2, y + s*0.1);
      ctx.lineTo(x + s*0.35, y + s*0.3);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.stroke();
      break;
    case B.SNOW:
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#e0e0e8';
      ctx.fillRect(x + s*0.1, y + s*0.3, s*0.15, s*0.1);
      ctx.fillRect(x + s*0.5, y + s*0.6, s*0.2, s*0.1);
      break;
    case B.CRAFT_TABLE:
      ctx.fillStyle = '#b8924a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.8, s*0.8);
      ctx.fillStyle = '#666';
      for (let gx = 0; gx < 3; gx++)
        for (let gy = 0; gy < 3; gy++) {
          ctx.fillRect(x + s*0.15 + gx*s*0.22, y + s*0.15 + gy*s*0.22, s*0.18, s*0.18);
        }
      break;
    case B.COPPER_ORE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c87533';
      ctx.fillRect(x + s*0.15, y + s*0.15, s*0.22, s*0.22);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.25, s*0.22);
      ctx.fillRect(x + s*0.4, y + s*0.2, s*0.15, s*0.15);
      ctx.fillStyle = '#e09050';
      ctx.fillRect(x + s*0.18, y + s*0.18, s*0.12, s*0.1);
      ctx.fillRect(x + s*0.58, y + s*0.53, s*0.12, s*0.1);
      break;
    default:
      ctx.fillStyle = '#f0f';
      ctx.fillRect(x, y, s, s);
  }
  // Block border
  if (type !== B.GLASS && type !== B.WATER) {
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(x, y, s, 1);
    ctx.fillRect(x, y, 1, s);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(x + s - 1, y, 1, s);
    ctx.fillRect(x, y + s - 1, s, 1);
  }
}
