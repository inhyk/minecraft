// ============================================================
// Block Types and Rendering
// ============================================================

const B = {
  AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, WOOD: 4,
  LEAVES: 5, SAND: 6, WATER: 7, COAL_ORE: 8,
  IRON_ORE: 9, GOLD_ORE: 10, DIAMOND_ORE: 11,
  BEDROCK: 12, PLANKS: 13, COBBLESTONE: 14, BRICK: 15,
  GLASS: 16, SNOW: 17, CRAFT_TABLE: 18, COPPER_ORE: 19,
  RAW_PORK: 20, RAW_BEEF: 21, RAW_CHICKEN: 22, WOOL: 23, LEATHER: 24, FEATHER: 25,
  // Tools & materials
  STICK: 26,
  WOOD_PICKAXE: 27, STONE_PICKAXE: 28, IRON_PICKAXE: 29, GOLD_PICKAXE: 30, DIAMOND_PICKAXE: 31,
  WOOD_AXE: 32, STONE_AXE: 33, IRON_AXE: 34, GOLD_AXE: 35, DIAMOND_AXE: 36,
  WOOD_SWORD: 37, STONE_SWORD: 38, IRON_SWORD: 39, GOLD_SWORD: 40, DIAMOND_SWORD: 41,
  WOOD_SHOVEL: 42, STONE_SHOVEL: 43, IRON_SHOVEL: 44, GOLD_SHOVEL: 45, DIAMOND_SHOVEL: 46,
};

// Tier colors for tool rendering
const TIER_COLORS = {
  wood: { head: '#b8924a', dark: '#8B6914' },
  stone: { head: '#999', dark: '#777' },
  iron: { head: '#e8e8e8', dark: '#bbb' },
  gold: { head: '#fcdb4a', dark: '#d4b030' },
  diamond: { head: '#5ce8e8', dark: '#3ab8b8' },
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
  [B.RAW_PORK]:   { name: "Raw Pork",  solid: false, hardness: -1, placeable: false, food: 3 },
  [B.RAW_BEEF]:   { name: "Raw Beef",  solid: false, hardness: -1, placeable: false, food: 3 },
  [B.RAW_CHICKEN]:{ name: "Raw Chicken",solid: false, hardness: -1, placeable: false, food: 2 },
  [B.WOOL]:       { name: "Wool",      solid: true,  hardness: 0.5 },
  [B.LEATHER]:    { name: "Leather",   solid: false, hardness: -1, placeable: false },
  [B.FEATHER]:    { name: "Feather",   solid: false, hardness: -1, placeable: false },
  // Stick
  [B.STICK]:      { name: "Stick",     solid: false, hardness: -1, placeable: false },
  // Pickaxes
  [B.WOOD_PICKAXE]:    { name: "Wood Pickaxe",    solid: false, placeable: false, maxStack: 1, tool: 'pickaxe', tier: 'wood',    miningSpeed: 2, attackDamage: 3, durability: 60 },
  [B.STONE_PICKAXE]:   { name: "Stone Pickaxe",   solid: false, placeable: false, maxStack: 1, tool: 'pickaxe', tier: 'stone',   miningSpeed: 3, attackDamage: 4, durability: 132 },
  [B.IRON_PICKAXE]:    { name: "Iron Pickaxe",    solid: false, placeable: false, maxStack: 1, tool: 'pickaxe', tier: 'iron',    miningSpeed: 4, attackDamage: 5, durability: 250 },
  [B.GOLD_PICKAXE]:    { name: "Gold Pickaxe",    solid: false, placeable: false, maxStack: 1, tool: 'pickaxe', tier: 'gold',    miningSpeed: 5, attackDamage: 3, durability: 33 },
  [B.DIAMOND_PICKAXE]: { name: "Diamond Pickaxe", solid: false, placeable: false, maxStack: 1, tool: 'pickaxe', tier: 'diamond', miningSpeed: 5, attackDamage: 6, durability: 1561 },
  // Axes
  [B.WOOD_AXE]:    { name: "Wood Axe",    solid: false, placeable: false, maxStack: 1, tool: 'axe', tier: 'wood',    miningSpeed: 2, attackDamage: 4, durability: 60 },
  [B.STONE_AXE]:   { name: "Stone Axe",   solid: false, placeable: false, maxStack: 1, tool: 'axe', tier: 'stone',   miningSpeed: 3, attackDamage: 5, durability: 132 },
  [B.IRON_AXE]:    { name: "Iron Axe",    solid: false, placeable: false, maxStack: 1, tool: 'axe', tier: 'iron',    miningSpeed: 4, attackDamage: 6, durability: 250 },
  [B.GOLD_AXE]:    { name: "Gold Axe",    solid: false, placeable: false, maxStack: 1, tool: 'axe', tier: 'gold',    miningSpeed: 5, attackDamage: 4, durability: 33 },
  [B.DIAMOND_AXE]: { name: "Diamond Axe", solid: false, placeable: false, maxStack: 1, tool: 'axe', tier: 'diamond', miningSpeed: 5, attackDamage: 7, durability: 1561 },
  // Swords
  [B.WOOD_SWORD]:    { name: "Wood Sword",    solid: false, placeable: false, maxStack: 1, tool: 'sword', tier: 'wood',    miningSpeed: 1, attackDamage: 5, durability: 60 },
  [B.STONE_SWORD]:   { name: "Stone Sword",   solid: false, placeable: false, maxStack: 1, tool: 'sword', tier: 'stone',   miningSpeed: 1, attackDamage: 6, durability: 132 },
  [B.IRON_SWORD]:    { name: "Iron Sword",    solid: false, placeable: false, maxStack: 1, tool: 'sword', tier: 'iron',    miningSpeed: 1, attackDamage: 7, durability: 250 },
  [B.GOLD_SWORD]:    { name: "Gold Sword",    solid: false, placeable: false, maxStack: 1, tool: 'sword', tier: 'gold',    miningSpeed: 1, attackDamage: 5, durability: 33 },
  [B.DIAMOND_SWORD]: { name: "Diamond Sword", solid: false, placeable: false, maxStack: 1, tool: 'sword', tier: 'diamond', miningSpeed: 1, attackDamage: 9, durability: 1561 },
  // Shovels
  [B.WOOD_SHOVEL]:    { name: "Wood Shovel",    solid: false, placeable: false, maxStack: 1, tool: 'shovel', tier: 'wood',    miningSpeed: 2, attackDamage: 2, durability: 60 },
  [B.STONE_SHOVEL]:   { name: "Stone Shovel",   solid: false, placeable: false, maxStack: 1, tool: 'shovel', tier: 'stone',   miningSpeed: 3, attackDamage: 3, durability: 132 },
  [B.IRON_SHOVEL]:    { name: "Iron Shovel",    solid: false, placeable: false, maxStack: 1, tool: 'shovel', tier: 'iron',    miningSpeed: 4, attackDamage: 4, durability: 250 },
  [B.GOLD_SHOVEL]:    { name: "Gold Shovel",    solid: false, placeable: false, maxStack: 1, tool: 'shovel', tier: 'gold',    miningSpeed: 5, attackDamage: 2, durability: 33 },
  [B.DIAMOND_SHOVEL]: { name: "Diamond Shovel", solid: false, placeable: false, maxStack: 1, tool: 'shovel', tier: 'diamond', miningSpeed: 5, attackDamage: 5, durability: 1561 },
};

// Helper: max stack size for a type
function getMaxStack(type) {
  return BLOCK_INFO[type]?.maxStack || 64;
}

// Helper: get attack damage for held item
function getAttackDamage() {
  const held = player.inventory[player.selectedSlot];
  if (!held) return 4;
  const info = BLOCK_INFO[held.type];
  return (info && info.attackDamage) ? info.attackDamage : 4;
}

// Helper: get max durability for a tool type (0 = not a tool)
function getMaxDurability(type) {
  const info = BLOCK_INFO[type];
  return (info && info.durability) ? info.durability : 0;
}

// Helper: damage the held tool by 1, destroy if durability reaches 0
function damageHeldTool() {
  const slot = player.inventory[player.selectedSlot];
  if (!slot) return;
  const maxDur = getMaxDurability(slot.type);
  if (maxDur <= 0) return;
  if (slot.durability === undefined) slot.durability = maxDur;
  slot.durability--;
  if (slot.durability <= 0) {
    player.inventory[player.selectedSlot] = null;
  }
}

// Helper: draw durability bar under an item
function drawDurabilityBar(x, y, w, item) {
  const maxDur = getMaxDurability(item.type);
  if (maxDur <= 0) return;
  if (item.durability === undefined) return;
  const ratio = item.durability / maxDur;
  if (ratio >= 1) return;
  const barW = w;
  const barH = 3;
  const barY = y + w + 1;
  // Background
  ctx.fillStyle = '#000';
  ctx.fillRect(x, barY, barW, barH);
  // Fill: green->yellow->red
  if (ratio > 0.5) ctx.fillStyle = '#4f4';
  else if (ratio > 0.25) ctx.fillStyle = '#ff4';
  else ctx.fillStyle = '#f44';
  ctx.fillRect(x, barY, barW * ratio, barH);
}

// Helper: get mining speed multiplier for a block type
function getToolSpeedMultiplier(blockType) {
  const held = player.inventory[player.selectedSlot];
  if (!held) return 1;
  const info = BLOCK_INFO[held.type];
  if (!info || !info.tool || !info.miningSpeed) return 1;

  const pickTargets = [B.STONE, B.COBBLESTONE, B.COAL_ORE, B.IRON_ORE, B.GOLD_ORE, B.DIAMOND_ORE, B.COPPER_ORE, B.BRICK];
  const axeTargets = [B.WOOD, B.PLANKS, B.LEAVES, B.CRAFT_TABLE];
  const shovelTargets = [B.DIRT, B.GRASS, B.SAND, B.SNOW];

  switch (info.tool) {
    case 'pickaxe': return pickTargets.includes(blockType) ? info.miningSpeed : 1;
    case 'axe':     return axeTargets.includes(blockType) ? info.miningSpeed : 1;
    case 'shovel':  return shovelTargets.includes(blockType) ? info.miningSpeed : 1;
    default: return 1;
  }
}

// --- Tool icon rendering ---
function drawToolIcon(x, y, s, toolType, tierColor, darkColor) {
  const stick = '#8B6914';

  switch (toolType) {
    case 'pickaxe':
      // Handle
      ctx.fillStyle = stick;
      ctx.fillRect(x + s*0.44, y + s*0.38, s*0.12, s*0.58);
      // Head crossbar
      ctx.fillStyle = tierColor;
      ctx.fillRect(x + s*0.1, y + s*0.08, s*0.8, s*0.18);
      // Head tips going down
      ctx.fillStyle = darkColor;
      ctx.fillRect(x + s*0.08, y + s*0.14, s*0.18, s*0.2);
      ctx.fillRect(x + s*0.74, y + s*0.14, s*0.18, s*0.2);
      // Highlight
      ctx.fillStyle = tierColor;
      ctx.fillRect(x + s*0.2, y + s*0.1, s*0.6, s*0.08);
      break;

    case 'axe':
      // Handle
      ctx.fillStyle = stick;
      ctx.fillRect(x + s*0.44, y + s*0.35, s*0.12, s*0.6);
      // Blade
      ctx.fillStyle = tierColor;
      ctx.fillRect(x + s*0.15, y + s*0.05, s*0.45, s*0.35);
      ctx.fillStyle = darkColor;
      ctx.fillRect(x + s*0.1, y + s*0.12, s*0.2, s*0.25);
      // Edge highlight
      ctx.fillStyle = tierColor;
      ctx.fillRect(x + s*0.12, y + s*0.08, s*0.1, s*0.18);
      break;

    case 'sword':
      // Handle
      ctx.fillStyle = stick;
      ctx.fillRect(x + s*0.44, y + s*0.65, s*0.12, s*0.32);
      // Guard
      ctx.fillStyle = '#666';
      ctx.fillRect(x + s*0.28, y + s*0.58, s*0.44, s*0.1);
      // Blade
      ctx.fillStyle = tierColor;
      ctx.fillRect(x + s*0.38, y + s*0.08, s*0.24, s*0.53);
      // Blade tip
      ctx.fillRect(x + s*0.42, y + s*0.02, s*0.16, s*0.1);
      // Edge
      ctx.fillStyle = darkColor;
      ctx.fillRect(x + s*0.36, y + s*0.15, s*0.08, s*0.4);
      break;

    case 'shovel':
      // Handle
      ctx.fillStyle = stick;
      ctx.fillRect(x + s*0.44, y + s*0.42, s*0.12, s*0.55);
      // Scoop
      ctx.fillStyle = tierColor;
      ctx.fillRect(x + s*0.25, y + s*0.05, s*0.5, s*0.42);
      // Rounded bottom of scoop
      ctx.fillStyle = darkColor;
      ctx.fillRect(x + s*0.3, y + s*0.35, s*0.4, s*0.1);
      // Highlight
      ctx.fillStyle = tierColor;
      ctx.fillRect(x + s*0.32, y + s*0.1, s*0.36, s*0.15);
      break;
  }
}

function drawBlock(x, y, type, size) {
  if (type === B.AIR || type === B.WATER) {
    if (type === B.WATER) {
      ctx.fillStyle = 'rgba(30, 100, 200, 0.6)';
      ctx.fillRect(x, y, size, size);
    }
    return;
  }
  const s = size;

  // Tool items - render with tool icon and return (no border)
  const toolInfo = BLOCK_INFO[type];
  if (toolInfo && toolInfo.tool) {
    const tc = TIER_COLORS[toolInfo.tier];
    drawToolIcon(x, y, s, toolInfo.tool, tc.head, tc.dark);
    return;
  }

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
    case B.RAW_PORK:
      ctx.fillStyle = '#f0a0a0';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.7, s*0.6);
      ctx.fillStyle = '#e08080';
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.25, s*0.4);
      ctx.fillStyle = '#f5c0c0';
      ctx.fillRect(x + s*0.5, y + s*0.3, s*0.25, s*0.35);
      break;
    case B.RAW_BEEF:
      ctx.fillStyle = '#c03030';
      ctx.fillRect(x + s*0.1, y + s*0.15, s*0.8, s*0.7);
      ctx.fillStyle = '#e06060';
      ctx.fillRect(x + s*0.2, y + s*0.25, s*0.3, s*0.4);
      ctx.fillStyle = '#f0f0e0';
      ctx.fillRect(x + s*0.55, y + s*0.2, s*0.25, s*0.5);
      break;
    case B.RAW_CHICKEN:
      ctx.fillStyle = '#f0d0a0';
      ctx.fillRect(x + s*0.2, y + s*0.15, s*0.6, s*0.7);
      ctx.fillStyle = '#e0c090';
      ctx.fillRect(x + s*0.15, y + s*0.55, s*0.2, s*0.3);
      ctx.fillRect(x + s*0.65, y + s*0.55, s*0.2, s*0.3);
      break;
    case B.WOOL:
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.3, s*0.3);
      ctx.fillRect(x + s*0.5, y + s*0.4, s*0.35, s*0.35);
      ctx.fillRect(x + s*0.2, y + s*0.55, s*0.25, s*0.25);
      break;
    case B.LEATHER:
      ctx.fillStyle = '#8B5A2B';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.8, s*0.8);
      ctx.fillStyle = '#A0703C';
      ctx.fillRect(x + s*0.2, y + s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#7A4A1B';
      ctx.fillRect(x + s*0.3, y + s*0.35, s*0.4, s*0.3);
      break;
    case B.FEATHER:
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(x + s*0.4, y + s*0.05, s*0.15, s*0.9);
      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(x + s*0.2, y + s*0.1, s*0.35, s*0.5);
      ctx.fillRect(x + s*0.45, y + s*0.15, s*0.3, s*0.45);
      ctx.fillStyle = '#ddd';
      ctx.fillRect(x + s*0.25, y + s*0.2, s*0.15, s*0.3);
      break;
    case B.STICK:
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(x + s*0.4, y + s*0.05, s*0.2, s*0.9);
      ctx.fillStyle = '#7a5c12';
      ctx.fillRect(x + s*0.42, y + s*0.1, s*0.06, s*0.7);
      break;
    default:
      ctx.fillStyle = '#f0f';
      ctx.fillRect(x, y, s, s);
  }
  // Block border
  if (type !== B.GLASS && type !== B.WATER && type !== B.STICK &&
      type !== B.RAW_PORK && type !== B.RAW_BEEF && type !== B.RAW_CHICKEN &&
      type !== B.LEATHER && type !== B.FEATHER) {
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(x, y, s, 1);
    ctx.fillRect(x, y, 1, s);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(x + s - 1, y, 1, s);
    ctx.fillRect(x, y + s - 1, s, 1);
  }
}
