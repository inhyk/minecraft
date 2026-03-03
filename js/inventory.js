// ============================================================
// Inventory System
// ============================================================

// Helper: Normalize block types for crafting (treat all plank/log variants as equivalent)
function normalizeForCrafting(type) {
  // All planks -> B.PLANKS
  if (type === B.OAK_PLANKS || type === B.BIRCH_PLANKS || type === B.SPRUCE_PLANKS ||
      type === B.JUNGLE_PLANKS || type === B.ACACIA_PLANKS || type === B.DARK_OAK_PLANKS) {
    return B.PLANKS;
  }
  // All logs -> B.WOOD
  if (type === B.OAK_LOG || type === B.BIRCH_LOG || type === B.SPRUCE_LOG ||
      type === B.JUNGLE_LOG || type === B.ACACIA_LOG || type === B.DARK_OAK_LOG ||
      type === B.CRIMSON_STEM || type === B.WARPED_STEM) {
    return B.WOOD;
  }
  // All cobblestone variants -> B.COBBLESTONE
  if (type === B.COBBLED_DEEPSLATE || type === B.MOSSY_COBBLESTONE) {
    return B.COBBLESTONE;
  }
  // All stone variants -> B.STONE for crafting
  if (type === B.ANDESITE || type === B.DIORITE || type === B.GRANITE ||
      type === B.DEEPSLATE || type === B.BLACKSTONE) {
    return B.STONE;
  }
  return type;
}

const CRAFT_RECIPES = [
  // --- Single (any position, 1 item) ---
  { pattern: 'single', input: B.WOOD, output: { type: B.PLANKS, count: 4 } },
  { pattern: 'single', input: B.COBBLESTONE, output: { type: B.STONE, count: 1 } },

  // --- 2x2 recipes (work in both 2x2 and 3x3) ---
  { pattern: '2x2', input: [B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS], output: { type: B.CRAFT_TABLE, count: 1 } },
  { pattern: '2x2', input: [B.OAK_PLANKS, B.OAK_PLANKS, B.OAK_PLANKS, B.OAK_PLANKS], output: { type: B.CRAFT_TABLE, count: 1 } },
  { pattern: '2x2', input: [B.BIRCH_PLANKS, B.BIRCH_PLANKS, B.BIRCH_PLANKS, B.BIRCH_PLANKS], output: { type: B.CRAFT_TABLE, count: 1 } },
  { pattern: '2x2', input: [B.SPRUCE_PLANKS, B.SPRUCE_PLANKS, B.SPRUCE_PLANKS, B.SPRUCE_PLANKS], output: { type: B.CRAFT_TABLE, count: 1 } },
  { pattern: '2x2', input: [B.JUNGLE_PLANKS, B.JUNGLE_PLANKS, B.JUNGLE_PLANKS, B.JUNGLE_PLANKS], output: { type: B.CRAFT_TABLE, count: 1 } },
  { pattern: '2x2', input: [B.ACACIA_PLANKS, B.ACACIA_PLANKS, B.ACACIA_PLANKS, B.ACACIA_PLANKS], output: { type: B.CRAFT_TABLE, count: 1 } },
  { pattern: '2x2', input: [B.DARK_OAK_PLANKS, B.DARK_OAK_PLANKS, B.DARK_OAK_PLANKS, B.DARK_OAK_PLANKS], output: { type: B.CRAFT_TABLE, count: 1 } },
  { pattern: '2x2', input: [B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE], output: { type: B.BRICK, count: 1 } },
  { pattern: '2x2', input: [B.SAND, B.SAND, B.SAND, B.SAND], output: { type: B.GLASS, count: 4 } },
  { pattern: '2x2', input: [B.DIRT, B.DIRT, B.DIRT, B.DIRT], output: { type: B.GRASS, count: 4 } },
  { pattern: '2x2', input: [B.GLASS, B.GLASS, B.DIRT, B.DIRT], output: { type: B.SNOW, count: 4 } },
  // Sticks: 2 planks vertically = 4 sticks
  { pattern: '2x2', input: [B.PLANKS, null, B.PLANKS, null], output: { type: B.STICK, count: 4 } },
  { pattern: '2x2', input: [null, B.PLANKS, null, B.PLANKS], output: { type: B.STICK, count: 4 } },
  { pattern: '2x2', input: [B.OAK_PLANKS, null, B.OAK_PLANKS, null], output: { type: B.STICK, count: 4 } },
  { pattern: '2x2', input: [B.BIRCH_PLANKS, null, B.BIRCH_PLANKS, null], output: { type: B.STICK, count: 4 } },
  { pattern: '2x2', input: [B.SPRUCE_PLANKS, null, B.SPRUCE_PLANKS, null], output: { type: B.STICK, count: 4 } },
  { pattern: '2x2', input: [B.JUNGLE_PLANKS, null, B.JUNGLE_PLANKS, null], output: { type: B.STICK, count: 4 } },
  { pattern: '2x2', input: [B.ACACIA_PLANKS, null, B.ACACIA_PLANKS, null], output: { type: B.STICK, count: 4 } },
  { pattern: '2x2', input: [B.DARK_OAK_PLANKS, null, B.DARK_OAK_PLANKS, null], output: { type: B.STICK, count: 4 } },

  // --- 3x3 recipes (crafting table only) ---
  // Block recipes
  { pattern: '3x3', input: [
    B.IRON_ORE, B.IRON_ORE, B.IRON_ORE,
    B.IRON_ORE, B.IRON_ORE, B.IRON_ORE,
    B.IRON_ORE, B.IRON_ORE, B.IRON_ORE,
  ], output: { type: B.COBBLESTONE, count: 16 } },
  { pattern: '3x3', input: [
    B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE,
    B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE,
    B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE,
  ], output: { type: B.BRICK, count: 9 } },
  { pattern: '3x3', input: [
    B.GLASS, B.GLASS, B.GLASS,
    B.GLASS, B.GLASS, B.GLASS,
    null, null, null,
  ], output: { type: B.GLASS, count: 16 } },
  { pattern: '3x3', input: [
    B.SNOW, B.SNOW, B.SNOW,
    B.SNOW, B.SNOW, B.SNOW,
    B.SNOW, B.SNOW, B.SNOW,
  ], output: { type: B.SNOW, count: 16 } },
  { pattern: '3x3', input: [
    B.COPPER_ORE, B.COPPER_ORE, B.COPPER_ORE,
    B.COPPER_ORE, B.COPPER_ORE, B.COPPER_ORE,
    B.COPPER_ORE, B.COPPER_ORE, B.COPPER_ORE,
  ], output: { type: B.BRICK, count: 16 } },

  // ===== PICKAXES =====
  { pattern: '3x3', input: [
    B.PLANKS, B.PLANKS, B.PLANKS,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.WOOD_PICKAXE, count: 1 } },
  { pattern: '3x3', input: [
    B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.STONE_PICKAXE, count: 1 } },
  { pattern: '3x3', input: [
    B.IRON_ORE, B.IRON_ORE, B.IRON_ORE,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.IRON_PICKAXE, count: 1 } },
  { pattern: '3x3', input: [
    B.GOLD_ORE, B.GOLD_ORE, B.GOLD_ORE,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.GOLD_PICKAXE, count: 1 } },
  { pattern: '3x3', input: [
    B.DIAMOND_ORE, B.DIAMOND_ORE, B.DIAMOND_ORE,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.DIAMOND_PICKAXE, count: 1 } },

  // ===== AXES (two orientations) =====
  { pattern: '3x3', input: [
    B.PLANKS, B.PLANKS, null,
    B.PLANKS, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.WOOD_AXE, count: 1 } },
  { pattern: '3x3', input: [
    null, B.PLANKS, B.PLANKS,
    null, B.STICK, B.PLANKS,
    null, B.STICK, null,
  ], output: { type: B.WOOD_AXE, count: 1 } },
  { pattern: '3x3', input: [
    B.COBBLESTONE, B.COBBLESTONE, null,
    B.COBBLESTONE, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.STONE_AXE, count: 1 } },
  { pattern: '3x3', input: [
    null, B.COBBLESTONE, B.COBBLESTONE,
    null, B.STICK, B.COBBLESTONE,
    null, B.STICK, null,
  ], output: { type: B.STONE_AXE, count: 1 } },
  { pattern: '3x3', input: [
    B.IRON_ORE, B.IRON_ORE, null,
    B.IRON_ORE, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.IRON_AXE, count: 1 } },
  { pattern: '3x3', input: [
    null, B.IRON_ORE, B.IRON_ORE,
    null, B.STICK, B.IRON_ORE,
    null, B.STICK, null,
  ], output: { type: B.IRON_AXE, count: 1 } },
  { pattern: '3x3', input: [
    B.GOLD_ORE, B.GOLD_ORE, null,
    B.GOLD_ORE, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.GOLD_AXE, count: 1 } },
  { pattern: '3x3', input: [
    null, B.GOLD_ORE, B.GOLD_ORE,
    null, B.STICK, B.GOLD_ORE,
    null, B.STICK, null,
  ], output: { type: B.GOLD_AXE, count: 1 } },
  { pattern: '3x3', input: [
    B.DIAMOND_ORE, B.DIAMOND_ORE, null,
    B.DIAMOND_ORE, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.DIAMOND_AXE, count: 1 } },
  { pattern: '3x3', input: [
    null, B.DIAMOND_ORE, B.DIAMOND_ORE,
    null, B.STICK, B.DIAMOND_ORE,
    null, B.STICK, null,
  ], output: { type: B.DIAMOND_AXE, count: 1 } },

  // ===== SWORDS =====
  { pattern: '3x3', input: [
    null, B.PLANKS, null,
    null, B.PLANKS, null,
    null, B.STICK, null,
  ], output: { type: B.WOOD_SWORD, count: 1 } },
  { pattern: '3x3', input: [
    null, B.COBBLESTONE, null,
    null, B.COBBLESTONE, null,
    null, B.STICK, null,
  ], output: { type: B.STONE_SWORD, count: 1 } },
  { pattern: '3x3', input: [
    null, B.IRON_ORE, null,
    null, B.IRON_ORE, null,
    null, B.STICK, null,
  ], output: { type: B.IRON_SWORD, count: 1 } },
  { pattern: '3x3', input: [
    null, B.GOLD_ORE, null,
    null, B.GOLD_ORE, null,
    null, B.STICK, null,
  ], output: { type: B.GOLD_SWORD, count: 1 } },
  { pattern: '3x3', input: [
    null, B.DIAMOND_ORE, null,
    null, B.DIAMOND_ORE, null,
    null, B.STICK, null,
  ], output: { type: B.DIAMOND_SWORD, count: 1 } },

  // ===== SHOVELS =====
  { pattern: '3x3', input: [
    null, B.PLANKS, null,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.WOOD_SHOVEL, count: 1 } },
  { pattern: '3x3', input: [
    null, B.COBBLESTONE, null,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.STONE_SHOVEL, count: 1 } },
  { pattern: '3x3', input: [
    null, B.IRON_ORE, null,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.IRON_SHOVEL, count: 1 } },
  { pattern: '3x3', input: [
    null, B.GOLD_ORE, null,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.GOLD_SHOVEL, count: 1 } },
  { pattern: '3x3', input: [
    null, B.DIAMOND_ORE, null,
    null, B.STICK, null,
    null, B.STICK, null,
  ], output: { type: B.DIAMOND_SHOVEL, count: 1 } },

  // ===== ARMOR - LEATHER =====
  { pattern: '3x3', input: [
    B.LEATHER, B.LEATHER, B.LEATHER,
    B.LEATHER, null, B.LEATHER,
    null, null, null,
  ], output: { type: B.LEATHER_HELMET, count: 1 } },
  { pattern: '3x3', input: [
    B.LEATHER, null, B.LEATHER,
    B.LEATHER, B.LEATHER, B.LEATHER,
    B.LEATHER, B.LEATHER, B.LEATHER,
  ], output: { type: B.LEATHER_CHESTPLATE, count: 1 } },
  { pattern: '3x3', input: [
    B.LEATHER, B.LEATHER, B.LEATHER,
    B.LEATHER, null, B.LEATHER,
    B.LEATHER, null, B.LEATHER,
  ], output: { type: B.LEATHER_LEGGINGS, count: 1 } },
  { pattern: '3x3', input: [
    B.LEATHER, null, B.LEATHER,
    B.LEATHER, null, B.LEATHER,
    null, null, null,
  ], output: { type: B.LEATHER_BOOTS, count: 1 } },

  // ===== ARMOR - IRON =====
  { pattern: '3x3', input: [
    B.IRON_ORE, B.IRON_ORE, B.IRON_ORE,
    B.IRON_ORE, null, B.IRON_ORE,
    null, null, null,
  ], output: { type: B.IRON_HELMET, count: 1 } },
  { pattern: '3x3', input: [
    B.IRON_ORE, null, B.IRON_ORE,
    B.IRON_ORE, B.IRON_ORE, B.IRON_ORE,
    B.IRON_ORE, B.IRON_ORE, B.IRON_ORE,
  ], output: { type: B.IRON_CHESTPLATE, count: 1 } },
  { pattern: '3x3', input: [
    B.IRON_ORE, B.IRON_ORE, B.IRON_ORE,
    B.IRON_ORE, null, B.IRON_ORE,
    B.IRON_ORE, null, B.IRON_ORE,
  ], output: { type: B.IRON_LEGGINGS, count: 1 } },
  { pattern: '3x3', input: [
    B.IRON_ORE, null, B.IRON_ORE,
    B.IRON_ORE, null, B.IRON_ORE,
    null, null, null,
  ], output: { type: B.IRON_BOOTS, count: 1 } },

  // ===== ARMOR - GOLD =====
  { pattern: '3x3', input: [
    B.GOLD_ORE, B.GOLD_ORE, B.GOLD_ORE,
    B.GOLD_ORE, null, B.GOLD_ORE,
    null, null, null,
  ], output: { type: B.GOLD_HELMET, count: 1 } },
  { pattern: '3x3', input: [
    B.GOLD_ORE, null, B.GOLD_ORE,
    B.GOLD_ORE, B.GOLD_ORE, B.GOLD_ORE,
    B.GOLD_ORE, B.GOLD_ORE, B.GOLD_ORE,
  ], output: { type: B.GOLD_CHESTPLATE, count: 1 } },
  { pattern: '3x3', input: [
    B.GOLD_ORE, B.GOLD_ORE, B.GOLD_ORE,
    B.GOLD_ORE, null, B.GOLD_ORE,
    B.GOLD_ORE, null, B.GOLD_ORE,
  ], output: { type: B.GOLD_LEGGINGS, count: 1 } },
  { pattern: '3x3', input: [
    B.GOLD_ORE, null, B.GOLD_ORE,
    B.GOLD_ORE, null, B.GOLD_ORE,
    null, null, null,
  ], output: { type: B.GOLD_BOOTS, count: 1 } },

  // ===== ARMOR - DIAMOND =====
  { pattern: '3x3', input: [
    B.DIAMOND_ORE, B.DIAMOND_ORE, B.DIAMOND_ORE,
    B.DIAMOND_ORE, null, B.DIAMOND_ORE,
    null, null, null,
  ], output: { type: B.DIAMOND_HELMET, count: 1 } },
  { pattern: '3x3', input: [
    B.DIAMOND_ORE, null, B.DIAMOND_ORE,
    B.DIAMOND_ORE, B.DIAMOND_ORE, B.DIAMOND_ORE,
    B.DIAMOND_ORE, B.DIAMOND_ORE, B.DIAMOND_ORE,
  ], output: { type: B.DIAMOND_CHESTPLATE, count: 1 } },
  { pattern: '3x3', input: [
    B.DIAMOND_ORE, B.DIAMOND_ORE, B.DIAMOND_ORE,
    B.DIAMOND_ORE, null, B.DIAMOND_ORE,
    B.DIAMOND_ORE, null, B.DIAMOND_ORE,
  ], output: { type: B.DIAMOND_LEGGINGS, count: 1 } },
  { pattern: '3x3', input: [
    B.DIAMOND_ORE, null, B.DIAMOND_ORE,
    B.DIAMOND_ORE, null, B.DIAMOND_ORE,
    null, null, null,
  ], output: { type: B.DIAMOND_BOOTS, count: 1 } },

  // ===== NETHER/END ITEMS =====
  // Flint and Steel
  { pattern: '2x2', input: [B.IRON_ORE, null, null, B.FLINT], output: { type: B.FLINT_AND_STEEL, count: 1 } },
  { pattern: '2x2', input: [null, B.IRON_ORE, B.FLINT, null], output: { type: B.FLINT_AND_STEEL, count: 1 } },
  // Blaze Powder (single)
  { pattern: 'single', input: B.BLAZE_ROD, output: { type: B.BLAZE_POWDER, count: 2 } },
  // Eye of Ender
  { pattern: '2x2', input: [B.ENDER_PEARL, null, B.BLAZE_POWDER, null], output: { type: B.EYE_OF_ENDER, count: 1 } },
  { pattern: '2x2', input: [null, B.ENDER_PEARL, null, B.BLAZE_POWDER], output: { type: B.EYE_OF_ENDER, count: 1 } },
  // Gold ingot from nuggets (simplified)
  { pattern: '3x3', input: [
    B.GOLD_NUGGET, B.GOLD_NUGGET, B.GOLD_NUGGET,
    B.GOLD_NUGGET, B.GOLD_NUGGET, B.GOLD_NUGGET,
    B.GOLD_NUGGET, B.GOLD_NUGGET, B.GOLD_NUGGET,
  ], output: { type: B.GOLD_ORE, count: 1 } },
  // Obsidian crafting (water + lava simulation - using cobblestone as placeholder)
  { pattern: '2x2', input: [B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE], output: { type: B.OBSIDIAN, count: 1 } },

  // ===== NEW WOOD VARIANTS =====
  { pattern: 'single', input: B.OAK_LOG, output: { type: B.OAK_PLANKS, count: 4 } },
  { pattern: 'single', input: B.BIRCH_LOG, output: { type: B.BIRCH_PLANKS, count: 4 } },
  { pattern: 'single', input: B.SPRUCE_LOG, output: { type: B.SPRUCE_PLANKS, count: 4 } },
  { pattern: 'single', input: B.JUNGLE_LOG, output: { type: B.JUNGLE_PLANKS, count: 4 } },
  { pattern: 'single', input: B.ACACIA_LOG, output: { type: B.ACACIA_PLANKS, count: 4 } },
  { pattern: 'single', input: B.DARK_OAK_LOG, output: { type: B.DARK_OAK_PLANKS, count: 4 } },
  { pattern: 'single', input: B.CRIMSON_STEM, output: { type: B.PLANKS, count: 4 } },
  { pattern: 'single', input: B.WARPED_STEM, output: { type: B.PLANKS, count: 4 } },

  // ===== STONE VARIANTS =====
  { pattern: '2x2', input: [B.STONE_BRICK, B.STONE_BRICK, B.STONE_BRICK, B.STONE_BRICK], output: { type: B.SMOOTH_STONE, count: 4 } },
  { pattern: '2x2', input: [B.STONE, B.STONE, B.STONE, B.STONE], output: { type: B.STONE_BRICK, count: 4 } },
  { pattern: '2x2', input: [B.SAND, B.SAND, B.SAND, B.SAND], output: { type: B.SANDSTONE, count: 1 } },
  { pattern: '2x2', input: [B.RED_SAND, B.RED_SAND, B.RED_SAND, B.RED_SAND], output: { type: B.RED_SANDSTONE, count: 1 } },
  { pattern: 'single', input: B.ANDESITE, output: { type: B.POLISHED_ANDESITE, count: 1 } },
  { pattern: 'single', input: B.DIORITE, output: { type: B.POLISHED_DIORITE, count: 1 } },
  { pattern: 'single', input: B.GRANITE, output: { type: B.POLISHED_GRANITE, count: 1 } },
  { pattern: 'single', input: B.DEEPSLATE, output: { type: B.COBBLED_DEEPSLATE, count: 1 } },
  { pattern: 'single', input: B.BASALT, output: { type: B.POLISHED_BASALT, count: 1 } },
  { pattern: 'single', input: B.BLACKSTONE, output: { type: B.POLISHED_BLACKSTONE, count: 1 } },

  // ===== METAL BLOCKS =====
  { pattern: '3x3', input: [
    B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT,
    B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT,
    B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT,
  ], output: { type: B.IRON_BLOCK, count: 1 } },
  { pattern: '3x3', input: [
    B.GOLD_INGOT, B.GOLD_INGOT, B.GOLD_INGOT,
    B.GOLD_INGOT, B.GOLD_INGOT, B.GOLD_INGOT,
    B.GOLD_INGOT, B.GOLD_INGOT, B.GOLD_INGOT,
  ], output: { type: B.GOLD_BLOCK, count: 1 } },
  { pattern: '3x3', input: [
    B.DIAMOND, B.DIAMOND, B.DIAMOND,
    B.DIAMOND, B.DIAMOND, B.DIAMOND,
    B.DIAMOND, B.DIAMOND, B.DIAMOND,
  ], output: { type: B.DIAMOND_BLOCK, count: 1 } },
  { pattern: '3x3', input: [
    B.EMERALD, B.EMERALD, B.EMERALD,
    B.EMERALD, B.EMERALD, B.EMERALD,
    B.EMERALD, B.EMERALD, B.EMERALD,
  ], output: { type: B.EMERALD_BLOCK, count: 1 } },
  { pattern: '3x3', input: [
    B.LAPIS, B.LAPIS, B.LAPIS,
    B.LAPIS, B.LAPIS, B.LAPIS,
    B.LAPIS, B.LAPIS, B.LAPIS,
  ], output: { type: B.LAPIS_BLOCK, count: 1 } },
  { pattern: '3x3', input: [
    B.REDSTONE, B.REDSTONE, B.REDSTONE,
    B.REDSTONE, B.REDSTONE, B.REDSTONE,
    B.REDSTONE, B.REDSTONE, B.REDSTONE,
  ], output: { type: B.REDSTONE_BLOCK, count: 1 } },
  { pattern: '3x3', input: [
    B.COAL, B.COAL, B.COAL,
    B.COAL, B.COAL, B.COAL,
    B.COAL, B.COAL, B.COAL,
  ], output: { type: B.COAL_BLOCK, count: 1 } },
  { pattern: '3x3', input: [
    B.COPPER_INGOT, B.COPPER_INGOT, B.COPPER_INGOT,
    B.COPPER_INGOT, B.COPPER_INGOT, B.COPPER_INGOT,
    B.COPPER_INGOT, B.COPPER_INGOT, B.COPPER_INGOT,
  ], output: { type: B.COPPER_BLOCK, count: 1 } },
  { pattern: '3x3', input: [
    B.NETHERITE_INGOT, B.NETHERITE_INGOT, B.NETHERITE_INGOT,
    B.NETHERITE_INGOT, B.NETHERITE_INGOT, B.NETHERITE_INGOT,
    B.NETHERITE_INGOT, B.NETHERITE_INGOT, B.NETHERITE_INGOT,
  ], output: { type: B.NETHERITE_BLOCK, count: 1 } },

  // Block to ingots/items
  { pattern: 'single', input: B.IRON_BLOCK, output: { type: B.IRON_INGOT, count: 9 } },
  { pattern: 'single', input: B.GOLD_BLOCK, output: { type: B.GOLD_INGOT, count: 9 } },
  { pattern: 'single', input: B.DIAMOND_BLOCK, output: { type: B.DIAMOND, count: 9 } },
  { pattern: 'single', input: B.EMERALD_BLOCK, output: { type: B.EMERALD, count: 9 } },
  { pattern: 'single', input: B.LAPIS_BLOCK, output: { type: B.LAPIS, count: 9 } },
  { pattern: 'single', input: B.REDSTONE_BLOCK, output: { type: B.REDSTONE, count: 9 } },
  { pattern: 'single', input: B.COAL_BLOCK, output: { type: B.COAL, count: 9 } },
  { pattern: 'single', input: B.NETHERITE_BLOCK, output: { type: B.NETHERITE_INGOT, count: 9 } },

  // Smelting (single conversions)
  { pattern: 'single', input: B.RAW_IRON, output: { type: B.IRON_INGOT, count: 1 } },
  { pattern: 'single', input: B.RAW_GOLD, output: { type: B.GOLD_INGOT, count: 1 } },
  { pattern: 'single', input: B.RAW_COPPER, output: { type: B.COPPER_INGOT, count: 1 } },
  { pattern: 'single', input: B.COAL_ORE, output: { type: B.COAL, count: 1 } },
  { pattern: 'single', input: B.IRON_ORE, output: { type: B.IRON_INGOT, count: 1 } },
  { pattern: 'single', input: B.GOLD_ORE, output: { type: B.GOLD_INGOT, count: 1 } },
  { pattern: 'single', input: B.COPPER_ORE, output: { type: B.COPPER_INGOT, count: 1 } },
  { pattern: 'single', input: B.DIAMOND_ORE, output: { type: B.DIAMOND, count: 1 } },
  { pattern: 'single', input: B.EMERALD_ORE, output: { type: B.EMERALD, count: 1 } },
  { pattern: 'single', input: B.LAPIS_ORE, output: { type: B.LAPIS, count: 4 } },
  { pattern: 'single', input: B.REDSTONE_ORE, output: { type: B.REDSTONE, count: 4 } },
  { pattern: 'single', input: B.NETHER_QUARTZ_ORE, output: { type: B.QUARTZ, count: 1 } },


  // Deepslate ore smelting (same output as regular ores)
  { pattern: 'single', input: B.DEEPSLATE_COAL_ORE, output: { type: B.COAL, count: 1 } },
  { pattern: 'single', input: B.DEEPSLATE_IRON_ORE, output: { type: B.IRON_INGOT, count: 1 } },
  { pattern: 'single', input: B.DEEPSLATE_GOLD_ORE, output: { type: B.GOLD_INGOT, count: 1 } },
  { pattern: 'single', input: B.DEEPSLATE_COPPER_ORE, output: { type: B.COPPER_INGOT, count: 1 } },
  { pattern: 'single', input: B.DEEPSLATE_DIAMOND_ORE, output: { type: B.DIAMOND, count: 1 } },
  { pattern: 'single', input: B.DEEPSLATE_EMERALD_ORE, output: { type: B.EMERALD, count: 1 } },
  { pattern: 'single', input: B.DEEPSLATE_LAPIS_ORE, output: { type: B.LAPIS, count: 4 } },
  { pattern: 'single', input: B.DEEPSLATE_REDSTONE_ORE, output: { type: B.REDSTONE, count: 4 } },
  // Cooking food
  { pattern: 'single', input: B.RAW_PORK, output: { type: B.COOKED_PORK, count: 1 } },
  { pattern: 'single', input: B.RAW_BEEF, output: { type: B.COOKED_BEEF, count: 1 } },
  { pattern: 'single', input: B.RAW_CHICKEN, output: { type: B.COOKED_CHICKEN, count: 1 } },
  { pattern: 'single', input: B.POTATO, output: { type: B.BAKED_POTATO, count: 1 } },
  { pattern: 'single', input: B.KELP, output: { type: B.DRIED_KELP, count: 1 } },

  // ===== FOOD RECIPES =====
  // Note: We use HAY_BALE as wheat equivalent
  { pattern: 'single', input: B.HAY_BALE, output: { type: B.BREAD, count: 3 } },
  { pattern: '3x3', input: [
    B.GOLD_INGOT, B.GOLD_INGOT, B.GOLD_INGOT,
    B.GOLD_INGOT, B.APPLE, B.GOLD_INGOT,
    B.GOLD_INGOT, B.GOLD_INGOT, B.GOLD_INGOT,
  ], output: { type: B.GOLDEN_APPLE, count: 1 } },
  { pattern: '3x3', input: [
    B.GOLD_BLOCK, B.GOLD_BLOCK, B.GOLD_BLOCK,
    B.GOLD_BLOCK, B.APPLE, B.GOLD_BLOCK,
    B.GOLD_BLOCK, B.GOLD_BLOCK, B.GOLD_BLOCK,
  ], output: { type: B.ENCHANTED_GOLDEN_APPLE, count: 1 } },
  { pattern: '3x3', input: [
    B.GOLD_INGOT, B.GOLD_INGOT, B.GOLD_INGOT,
    B.GOLD_INGOT, B.CARROT, B.GOLD_INGOT,
    B.GOLD_INGOT, B.GOLD_INGOT, B.GOLD_INGOT,
  ], output: { type: B.GOLDEN_CARROT, count: 1 } },
  { pattern: '3x3', input: [
    B.DRIED_KELP, B.DRIED_KELP, B.DRIED_KELP,
    B.DRIED_KELP, B.DRIED_KELP, B.DRIED_KELP,
    B.DRIED_KELP, B.DRIED_KELP, B.DRIED_KELP,
  ], output: { type: B.DRIED_KELP_BLOCK, count: 1 } },

  // ===== NETHERITE TOOLS (upgrade from diamond) =====
  { pattern: '2x2', input: [B.DIAMOND_PICKAXE, B.NETHERITE_INGOT, null, null], output: { type: B.NETHERITE_PICKAXE, count: 1 } },
  { pattern: '2x2', input: [B.DIAMOND_AXE, B.NETHERITE_INGOT, null, null], output: { type: B.NETHERITE_AXE, count: 1 } },
  { pattern: '2x2', input: [B.DIAMOND_SWORD, B.NETHERITE_INGOT, null, null], output: { type: B.NETHERITE_SWORD, count: 1 } },
  { pattern: '2x2', input: [B.DIAMOND_SHOVEL, B.NETHERITE_INGOT, null, null], output: { type: B.NETHERITE_SHOVEL, count: 1 } },

  // ===== NETHERITE ARMOR (upgrade from diamond) =====
  { pattern: '2x2', input: [B.DIAMOND_HELMET, B.NETHERITE_INGOT, null, null], output: { type: B.NETHERITE_HELMET, count: 1 } },
  { pattern: '2x2', input: [B.DIAMOND_CHESTPLATE, B.NETHERITE_INGOT, null, null], output: { type: B.NETHERITE_CHESTPLATE, count: 1 } },
  { pattern: '2x2', input: [B.DIAMOND_LEGGINGS, B.NETHERITE_INGOT, null, null], output: { type: B.NETHERITE_LEGGINGS, count: 1 } },
  { pattern: '2x2', input: [B.DIAMOND_BOOTS, B.NETHERITE_INGOT, null, null], output: { type: B.NETHERITE_BOOTS, count: 1 } },

  // Netherite Ingot (4 scraps + 4 gold)
  { pattern: '3x3', input: [
    B.NETHERITE_SCRAP, B.NETHERITE_SCRAP, null,
    B.NETHERITE_SCRAP, B.NETHERITE_SCRAP, null,
    B.GOLD_INGOT, B.GOLD_INGOT, null,
  ], output: { type: B.NETHERITE_INGOT, count: 1 } },
  { pattern: '2x2', input: [B.NETHERITE_SCRAP, B.NETHERITE_SCRAP, B.GOLD_INGOT, B.GOLD_INGOT], output: { type: B.NETHERITE_INGOT, count: 1 } },

  // Ancient Debris -> Netherite Scrap
  { pattern: 'single', input: B.ANCIENT_DEBRIS, output: { type: B.NETHERITE_SCRAP, count: 1 } },

  // ===== MISC BLOCKS =====
  { pattern: '3x3', input: [
    B.BONE, B.BONE, B.BONE,
    B.BONE, B.BONE, B.BONE,
    B.BONE, B.BONE, B.BONE,
  ], output: { type: B.BONE_BLOCK, count: 1 } },
  { pattern: 'single', input: B.BONE_BLOCK, output: { type: B.BONE, count: 9 } },
  { pattern: '3x3', input: [
    B.PLANKS, B.PLANKS, B.PLANKS,
    B.PLANKS, null, B.PLANKS,
    B.PLANKS, B.PLANKS, B.PLANKS,
  ], output: { type: B.CHEST, count: 1 } },
  { pattern: '3x3', input: [
    null, null, null,
    B.STICK, B.STICK, B.STICK,
    B.STICK, B.STICK, B.STICK,
  ], output: { type: B.LADDER, count: 3 } },
  { pattern: '2x2', input: [B.COAL, null, B.STICK, null], output: { type: B.TORCH, count: 4 } },
  { pattern: '2x2', input: [null, B.COAL, null, B.STICK], output: { type: B.TORCH, count: 4 } },
  { pattern: '3x3', input: [
    B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE,
    B.COBBLESTONE, null, B.COBBLESTONE,
    B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE,
  ], output: { type: B.FURNACE, count: 1 } },
  { pattern: '3x3', input: [
    B.PLANKS, B.PLANKS, B.PLANKS,
    B.PLANKS, B.PLANKS, B.PLANKS,
    null, null, null,
  ], output: { type: B.BOOKSHELF, count: 1 } },
  { pattern: 'single', input: B.PUMPKIN, output: { type: B.JACK_O_LANTERN, count: 1 } },

  // ===== PRISMARINE =====
  { pattern: '2x2', input: [B.PRISMARINE, B.PRISMARINE, B.PRISMARINE, B.PRISMARINE], output: { type: B.DARK_PRISMARINE, count: 1 } },
  { pattern: '3x3', input: [
    B.PRISMARINE, B.PRISMARINE, B.PRISMARINE,
    B.PRISMARINE, B.GLOWSTONE, B.PRISMARINE,
    B.PRISMARINE, B.PRISMARINE, B.PRISMARINE,
  ], output: { type: B.SEA_LANTERN, count: 1 } },

  // ===== BUCKETS =====
  { pattern: '3x3', input: [
    B.IRON_INGOT, null, B.IRON_INGOT,
    null, B.IRON_INGOT, null,
    null, null, null,
  ], output: { type: B.BUCKET, count: 1 } },

  // ===== DYES FROM FLOWERS =====
  { pattern: 'single', input: B.DANDELION, output: { type: B.YELLOW_DYE, count: 1 } },
  { pattern: 'single', input: B.POPPY, output: { type: B.RED_DYE, count: 1 } },
  { pattern: 'single', input: B.BLUE_ORCHID, output: { type: B.LIGHT_BLUE_DYE, count: 1 } },
  { pattern: 'single', input: B.ALLIUM, output: { type: B.MAGENTA_DYE, count: 1 } },
  { pattern: 'single', input: B.AZURE_BLUET, output: { type: B.WHITE_DYE, count: 1 } },
  { pattern: 'single', input: B.RED_TULIP, output: { type: B.RED_DYE, count: 1 } },
  { pattern: 'single', input: B.ORANGE_TULIP, output: { type: B.ORANGE_DYE, count: 1 } },
  { pattern: 'single', input: B.WHITE_TULIP, output: { type: B.WHITE_DYE, count: 1 } },
  { pattern: 'single', input: B.PINK_TULIP, output: { type: B.PINK_DYE, count: 1 } },
  { pattern: 'single', input: B.OXEYE_DAISY, output: { type: B.WHITE_DYE, count: 1 } },
  { pattern: 'single', input: B.CORNFLOWER, output: { type: B.BLUE_DYE, count: 1 } },
  { pattern: 'single', input: B.LILY_OF_VALLEY, output: { type: B.WHITE_DYE, count: 1 } },
  { pattern: 'single', input: B.WITHER_ROSE, output: { type: B.BLACK_DYE, count: 1 } },
  { pattern: 'single', input: B.SUNFLOWER, output: { type: B.YELLOW_DYE, count: 2 } },
  { pattern: 'single', input: B.LILAC, output: { type: B.MAGENTA_DYE, count: 2 } },
  { pattern: 'single', input: B.ROSE_BUSH, output: { type: B.RED_DYE, count: 2 } },
  { pattern: 'single', input: B.PEONY, output: { type: B.PINK_DYE, count: 2 } },
  { pattern: 'single', input: B.INK_SAC, output: { type: B.BLACK_DYE, count: 1 } },
  { pattern: 'single', input: B.BONE, output: { type: B.WHITE_DYE, count: 3 } },
  { pattern: 'single', input: B.LAPIS, output: { type: B.BLUE_DYE, count: 1 } },
  { pattern: 'single', input: B.CACTUS, output: { type: B.GREEN_DYE, count: 1 } },
  // Mixed dyes
  { pattern: '2x2', input: [B.RED_DYE, B.YELLOW_DYE, null, null], output: { type: B.ORANGE_DYE, count: 2 } },
  { pattern: '2x2', input: [B.RED_DYE, B.BLUE_DYE, null, null], output: { type: B.PURPLE_DYE, count: 2 } },
  { pattern: '2x2', input: [B.BLUE_DYE, B.GREEN_DYE, null, null], output: { type: B.CYAN_DYE, count: 2 } },
  { pattern: '2x2', input: [B.GREEN_DYE, B.WHITE_DYE, null, null], output: { type: B.LIME_DYE, count: 2 } },
  { pattern: '2x2', input: [B.RED_DYE, B.WHITE_DYE, null, null], output: { type: B.PINK_DYE, count: 2 } },
  { pattern: '2x2', input: [B.BLACK_DYE, B.WHITE_DYE, null, null], output: { type: B.GRAY_DYE, count: 2 } },
  { pattern: '2x2', input: [B.PURPLE_DYE, B.PINK_DYE, null, null], output: { type: B.MAGENTA_DYE, count: 2 } },
  { pattern: '2x2', input: [B.BLUE_DYE, B.WHITE_DYE, null, null], output: { type: B.LIGHT_BLUE_DYE, count: 2 } },

  // ===== WOOL COLORS (wool + dye) =====
  { pattern: '2x2', input: [B.WOOL, B.WHITE_DYE, null, null], output: { type: B.WHITE_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.ORANGE_DYE, null, null], output: { type: B.ORANGE_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.MAGENTA_DYE, null, null], output: { type: B.MAGENTA_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.LIGHT_BLUE_DYE, null, null], output: { type: B.LIGHT_BLUE_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.YELLOW_DYE, null, null], output: { type: B.YELLOW_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.LIME_DYE, null, null], output: { type: B.LIME_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.PINK_DYE, null, null], output: { type: B.PINK_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.GRAY_DYE, null, null], output: { type: B.GRAY_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.CYAN_DYE, null, null], output: { type: B.CYAN_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.PURPLE_DYE, null, null], output: { type: B.PURPLE_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.BLUE_DYE, null, null], output: { type: B.BLUE_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.BROWN_DYE, null, null], output: { type: B.BROWN_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.GREEN_DYE, null, null], output: { type: B.GREEN_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.RED_DYE, null, null], output: { type: B.RED_WOOL, count: 1 } },
  { pattern: '2x2', input: [B.WOOL, B.BLACK_DYE, null, null], output: { type: B.BLACK_WOOL, count: 1 } },

  // ===== TERRACOTTA COLORS (terracotta + dye) =====
  { pattern: '2x2', input: [B.TERRACOTTA, B.WHITE_DYE, null, null], output: { type: B.WHITE_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.ORANGE_DYE, null, null], output: { type: B.ORANGE_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.MAGENTA_DYE, null, null], output: { type: B.MAGENTA_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.LIGHT_BLUE_DYE, null, null], output: { type: B.LIGHT_BLUE_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.YELLOW_DYE, null, null], output: { type: B.YELLOW_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.LIME_DYE, null, null], output: { type: B.LIME_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.PINK_DYE, null, null], output: { type: B.PINK_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.GRAY_DYE, null, null], output: { type: B.CYAN_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.CYAN_DYE, null, null], output: { type: B.CYAN_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.PURPLE_DYE, null, null], output: { type: B.PURPLE_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.BLUE_DYE, null, null], output: { type: B.BLUE_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.BROWN_DYE, null, null], output: { type: B.BROWN_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.GREEN_DYE, null, null], output: { type: B.GREEN_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.RED_DYE, null, null], output: { type: B.RED_TERRACOTTA, count: 1 } },
  { pattern: '2x2', input: [B.TERRACOTTA, B.BLACK_DYE, null, null], output: { type: B.BLACK_TERRACOTTA, count: 1 } },

  // ===== CONCRETE (sand + gravel + dye) =====
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.WHITE_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.WHITE_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.ORANGE_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.ORANGE_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.MAGENTA_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.MAGENTA_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.LIGHT_BLUE_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.LIGHT_BLUE_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.YELLOW_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.YELLOW_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.LIME_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.LIME_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.PINK_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.PINK_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.GRAY_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.GRAY_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.CYAN_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.CYAN_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.PURPLE_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.PURPLE_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.BLUE_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.BLUE_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.BROWN_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.BROWN_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.GREEN_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.GREEN_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.RED_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.RED_CONCRETE, count: 8 } },
  { pattern: '3x3', input: [B.SAND, B.SAND, B.SAND, B.GRAVEL, B.BLACK_DYE, B.GRAVEL, B.SAND, B.SAND, B.SAND], output: { type: B.BLACK_CONCRETE, count: 8 } },

  // ===== BEDS (wool + planks) =====
  { pattern: '3x3', input: [B.WHITE_WOOL, B.WHITE_WOOL, B.WHITE_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.WHITE_BED, count: 1 } },
  { pattern: '3x3', input: [B.ORANGE_WOOL, B.ORANGE_WOOL, B.ORANGE_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.ORANGE_BED, count: 1 } },
  { pattern: '3x3', input: [B.MAGENTA_WOOL, B.MAGENTA_WOOL, B.MAGENTA_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.MAGENTA_BED, count: 1 } },
  { pattern: '3x3', input: [B.LIGHT_BLUE_WOOL, B.LIGHT_BLUE_WOOL, B.LIGHT_BLUE_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.LIGHT_BLUE_BED, count: 1 } },
  { pattern: '3x3', input: [B.YELLOW_WOOL, B.YELLOW_WOOL, B.YELLOW_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.YELLOW_BED, count: 1 } },
  { pattern: '3x3', input: [B.LIME_WOOL, B.LIME_WOOL, B.LIME_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.LIME_BED, count: 1 } },
  { pattern: '3x3', input: [B.PINK_WOOL, B.PINK_WOOL, B.PINK_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.PINK_BED, count: 1 } },
  { pattern: '3x3', input: [B.GRAY_WOOL, B.GRAY_WOOL, B.GRAY_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.GRAY_BED, count: 1 } },
  { pattern: '3x3', input: [B.CYAN_WOOL, B.CYAN_WOOL, B.CYAN_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.CYAN_BED, count: 1 } },
  { pattern: '3x3', input: [B.PURPLE_WOOL, B.PURPLE_WOOL, B.PURPLE_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.PURPLE_BED, count: 1 } },
  { pattern: '3x3', input: [B.BLUE_WOOL, B.BLUE_WOOL, B.BLUE_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.BLUE_BED, count: 1 } },
  { pattern: '3x3', input: [B.BROWN_WOOL, B.BROWN_WOOL, B.BROWN_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.BROWN_BED, count: 1 } },
  { pattern: '3x3', input: [B.GREEN_WOOL, B.GREEN_WOOL, B.GREEN_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.GREEN_BED, count: 1 } },
  { pattern: '3x3', input: [B.RED_WOOL, B.RED_WOOL, B.RED_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.RED_BED, count: 1 } },
  { pattern: '3x3', input: [B.BLACK_WOOL, B.BLACK_WOOL, B.BLACK_WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.BLACK_BED, count: 1 } },
  // Simple bed recipe using regular wool
  { pattern: '3x3', input: [B.WOOL, B.WOOL, B.WOOL, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.WHITE_BED, count: 1 } },

  // ===== CARPETS (2 wool) =====
  { pattern: '2x2', input: [B.WHITE_WOOL, B.WHITE_WOOL, null, null], output: { type: B.WHITE_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.ORANGE_WOOL, B.ORANGE_WOOL, null, null], output: { type: B.ORANGE_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.MAGENTA_WOOL, B.MAGENTA_WOOL, null, null], output: { type: B.MAGENTA_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.LIGHT_BLUE_WOOL, B.LIGHT_BLUE_WOOL, null, null], output: { type: B.LIGHT_BLUE_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.YELLOW_WOOL, B.YELLOW_WOOL, null, null], output: { type: B.YELLOW_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.LIME_WOOL, B.LIME_WOOL, null, null], output: { type: B.LIME_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.PINK_WOOL, B.PINK_WOOL, null, null], output: { type: B.PINK_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.GRAY_WOOL, B.GRAY_WOOL, null, null], output: { type: B.GRAY_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.CYAN_WOOL, B.CYAN_WOOL, null, null], output: { type: B.CYAN_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.PURPLE_WOOL, B.PURPLE_WOOL, null, null], output: { type: B.PURPLE_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.BLUE_WOOL, B.BLUE_WOOL, null, null], output: { type: B.BLUE_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.BROWN_WOOL, B.BROWN_WOOL, null, null], output: { type: B.BROWN_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.GREEN_WOOL, B.GREEN_WOOL, null, null], output: { type: B.GREEN_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.RED_WOOL, B.RED_WOOL, null, null], output: { type: B.RED_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.BLACK_WOOL, B.BLACK_WOOL, null, null], output: { type: B.BLACK_CARPET, count: 3 } },
  { pattern: '2x2', input: [B.WOOL, B.WOOL, null, null], output: { type: B.WHITE_CARPET, count: 3 } },

  // ===== DOORS =====
  { pattern: '3x3', input: [B.OAK_PLANKS, B.OAK_PLANKS, null, B.OAK_PLANKS, B.OAK_PLANKS, null, B.OAK_PLANKS, B.OAK_PLANKS, null], output: { type: B.OAK_DOOR, count: 3 } },
  { pattern: '3x3', input: [B.BIRCH_PLANKS, B.BIRCH_PLANKS, null, B.BIRCH_PLANKS, B.BIRCH_PLANKS, null, B.BIRCH_PLANKS, B.BIRCH_PLANKS, null], output: { type: B.BIRCH_DOOR, count: 3 } },
  { pattern: '3x3', input: [B.SPRUCE_PLANKS, B.SPRUCE_PLANKS, null, B.SPRUCE_PLANKS, B.SPRUCE_PLANKS, null, B.SPRUCE_PLANKS, B.SPRUCE_PLANKS, null], output: { type: B.SPRUCE_DOOR, count: 3 } },
  { pattern: '3x3', input: [B.JUNGLE_PLANKS, B.JUNGLE_PLANKS, null, B.JUNGLE_PLANKS, B.JUNGLE_PLANKS, null, B.JUNGLE_PLANKS, B.JUNGLE_PLANKS, null], output: { type: B.JUNGLE_DOOR, count: 3 } },
  { pattern: '3x3', input: [B.ACACIA_PLANKS, B.ACACIA_PLANKS, null, B.ACACIA_PLANKS, B.ACACIA_PLANKS, null, B.ACACIA_PLANKS, B.ACACIA_PLANKS, null], output: { type: B.ACACIA_DOOR, count: 3 } },
  { pattern: '3x3', input: [B.DARK_OAK_PLANKS, B.DARK_OAK_PLANKS, null, B.DARK_OAK_PLANKS, B.DARK_OAK_PLANKS, null, B.DARK_OAK_PLANKS, B.DARK_OAK_PLANKS, null], output: { type: B.DARK_OAK_DOOR, count: 3 } },
  { pattern: '3x3', input: [B.PLANKS, B.PLANKS, null, B.PLANKS, B.PLANKS, null, B.PLANKS, B.PLANKS, null], output: { type: B.OAK_DOOR, count: 3 } },
  { pattern: '3x3', input: [B.IRON_INGOT, B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, null], output: { type: B.IRON_DOOR, count: 3 } },

  // ===== TRAPDOORS =====
  { pattern: '3x3', input: [B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, null, null, null], output: { type: B.OAK_TRAPDOOR, count: 2 } },
  { pattern: '3x3', input: [B.IRON_INGOT, B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, null, null, null, null], output: { type: B.IRON_TRAPDOOR, count: 1 } },

  // ===== FENCES & GATES =====
  { pattern: '3x3', input: [B.PLANKS, B.STICK, B.PLANKS, B.PLANKS, B.STICK, B.PLANKS, null, null, null], output: { type: B.OAK_FENCE, count: 3 } },
  { pattern: '3x3', input: [B.STICK, B.PLANKS, B.STICK, B.STICK, B.PLANKS, B.STICK, null, null, null], output: { type: B.OAK_FENCE_GATE, count: 1 } },
  { pattern: '3x3', input: [B.NETHER_BRICK, B.NETHER_BRICK, B.NETHER_BRICK, B.NETHER_BRICK, B.NETHER_BRICK, B.NETHER_BRICK, null, null, null], output: { type: B.NETHER_BRICK_FENCE, count: 6 } },

  // ===== TNT & EXPLOSIVES =====
  { pattern: '3x3', input: [B.GUNPOWDER, B.SAND, B.GUNPOWDER, B.SAND, B.GUNPOWDER, B.SAND, B.GUNPOWDER, B.SAND, B.GUNPOWDER], output: { type: B.TNT, count: 1 } },

  // ===== SLIME & HONEY BLOCKS =====
  { pattern: '3x3', input: [
    B.SLIMEBALL, B.SLIMEBALL, B.SLIMEBALL,
    B.SLIMEBALL, B.SLIMEBALL, B.SLIMEBALL,
    B.SLIMEBALL, B.SLIMEBALL, B.SLIMEBALL,
  ], output: { type: B.SLIME_BLOCK, count: 1 } },
  { pattern: 'single', input: B.SLIME_BLOCK, output: { type: B.SLIMEBALL, count: 9 } },
  { pattern: '2x2', input: [B.HONEYCOMB, B.HONEYCOMB, B.HONEYCOMB, B.HONEYCOMB], output: { type: B.HONEY_BLOCK, count: 1 } },

  // ===== QUARTZ BLOCKS =====
  { pattern: '2x2', input: [B.QUARTZ, B.QUARTZ, B.QUARTZ, B.QUARTZ], output: { type: B.QUARTZ_BLOCK, count: 1 } },
  { pattern: '3x3', input: [null, B.QUARTZ_BLOCK, null, null, B.QUARTZ_BLOCK, null, null, null, null], output: { type: B.QUARTZ_PILLAR, count: 2 } },
  { pattern: 'single', input: B.QUARTZ_BLOCK, output: { type: B.SMOOTH_QUARTZ, count: 1 } },

  // ===== PAPER & BOOKS =====
  { pattern: '3x3', input: [B.SUGAR_CANE, B.SUGAR_CANE, B.SUGAR_CANE, null, null, null, null, null, null], output: { type: B.PAPER, count: 3 } },
  { pattern: '3x3', input: [B.PAPER, B.PAPER, B.PAPER, B.LEATHER, null, null, null, null, null], output: { type: B.BOOK, count: 1 } },
  { pattern: '3x3', input: [B.PLANKS, B.PLANKS, B.PLANKS, B.BOOK, B.BOOK, B.BOOK, B.PLANKS, B.PLANKS, B.PLANKS], output: { type: B.BOOKSHELF, count: 1 } },

  // ===== ARROWS & BOWS =====
  { pattern: '3x3', input: [null, B.FLINT, null, null, B.STICK, null, null, B.FEATHER, null], output: { type: B.ARROW, count: 4 } },
  { pattern: '3x3', input: [null, B.STICK, B.STRING, B.STICK, null, B.STRING, null, B.STICK, B.STRING], output: { type: B.BOW, count: 1 } },
  { pattern: '3x3', input: [B.STRING, B.STICK, null, B.STRING, null, B.STICK, B.STRING, B.STICK, null], output: { type: B.BOW, count: 1 } },
  { pattern: '3x3', input: [B.STRING, B.IRON_INGOT, B.STRING, B.STICK, B.TRIPWIRE_HOOK, B.STICK, B.PLANKS, B.PLANKS, B.PLANKS], output: { type: B.CROSSBOW, count: 1 } },

  // ===== FISHING ROD =====
  { pattern: '3x3', input: [null, null, B.STICK, null, B.STICK, B.STRING, B.STICK, null, B.STRING], output: { type: B.FISHING_ROD, count: 1 } },

  // ===== REDSTONE COMPONENTS =====
  { pattern: '2x2', input: [B.REDSTONE, null, B.STICK, null], output: { type: B.REDSTONE_TORCH, count: 1 } },
  { pattern: '3x3', input: [null, B.STICK, null, B.COBBLESTONE, null, null, null, null, null], output: { type: B.LEVER, count: 1 } },
  { pattern: 'single', input: B.STONE, output: { type: B.STONE_BUTTON, count: 1 } },
  { pattern: '2x2', input: [B.STONE, B.STONE, null, null], output: { type: B.STONE_PRESSURE_PLATE, count: 1 } },
  { pattern: '3x3', input: [B.IRON_INGOT, B.STICK, null, B.PLANKS, null, null, null, null, null], output: { type: B.TRIPWIRE_HOOK, count: 2 } },
  { pattern: '3x3', input: [null, B.REDSTONE_TORCH, null, B.REDSTONE, B.QUARTZ, B.REDSTONE, B.STONE, B.STONE, B.STONE], output: { type: B.COMPARATOR, count: 1 } },
  { pattern: '3x3', input: [null, null, null, B.REDSTONE_TORCH, B.REDSTONE, B.REDSTONE_TORCH, B.STONE, B.STONE, B.STONE], output: { type: B.REPEATER, count: 1 } },

  // ===== RAILS =====
  { pattern: '3x3', input: [B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, B.STICK, B.IRON_INGOT, B.IRON_INGOT, null, B.IRON_INGOT], output: { type: B.RAIL, count: 16 } },
  { pattern: '3x3', input: [B.GOLD_INGOT, null, B.GOLD_INGOT, B.GOLD_INGOT, B.STICK, B.GOLD_INGOT, B.GOLD_INGOT, B.REDSTONE, B.GOLD_INGOT], output: { type: B.POWERED_RAIL, count: 6 } },
  { pattern: '3x3', input: [B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, B.STONE_PRESSURE_PLATE, B.IRON_INGOT, B.IRON_INGOT, B.REDSTONE, B.IRON_INGOT], output: { type: B.DETECTOR_RAIL, count: 6 } },

  // ===== MINECARTS =====
  { pattern: '3x3', input: [null, null, null, B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT], output: { type: B.MINECART, count: 1 } },
  { pattern: '2x2', input: [B.CHEST, B.MINECART, null, null], output: { type: B.CHEST_MINECART, count: 1 } },
  { pattern: '2x2', input: [B.HOPPER, B.MINECART, null, null], output: { type: B.HOPPER_MINECART, count: 1 } },
  { pattern: '2x2', input: [B.TNT, B.MINECART, null, null], output: { type: B.TNT_MINECART, count: 1 } },

  // ===== BOATS =====
  { pattern: '3x3', input: [null, null, null, B.PLANKS, null, B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS], output: { type: B.OAK_BOAT, count: 1 } },

  // ===== PISTONS =====
  { pattern: '3x3', input: [B.PLANKS, B.PLANKS, B.PLANKS, B.COBBLESTONE, B.IRON_INGOT, B.COBBLESTONE, B.COBBLESTONE, B.REDSTONE, B.COBBLESTONE], output: { type: B.PISTON, count: 1 } },
  { pattern: '2x2', input: [B.SLIMEBALL, B.PISTON, null, null], output: { type: B.STICKY_PISTON, count: 1 } },

  // ===== DISPENSER & DROPPER =====
  { pattern: '3x3', input: [B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, B.BOW, B.COBBLESTONE, B.COBBLESTONE, B.REDSTONE, B.COBBLESTONE], output: { type: B.DISPENSER, count: 1 } },
  { pattern: '3x3', input: [B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, null, B.COBBLESTONE, B.COBBLESTONE, B.REDSTONE, B.COBBLESTONE], output: { type: B.DROPPER, count: 1 } },

  // ===== OBSERVER =====
  { pattern: '3x3', input: [B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, B.REDSTONE, B.REDSTONE, B.QUARTZ, B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE], output: { type: B.OBSERVER, count: 1 } },

  // ===== HOPPER =====
  { pattern: '3x3', input: [B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, B.CHEST, B.IRON_INGOT, null, B.IRON_INGOT, null], output: { type: B.HOPPER, count: 1 } },

  // ===== ANVIL =====
  { pattern: '3x3', input: [B.IRON_BLOCK, B.IRON_BLOCK, B.IRON_BLOCK, null, B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT], output: { type: B.ANVIL, count: 1 } },

  // ===== BREWING STAND & CAULDRON =====
  { pattern: '3x3', input: [null, B.BLAZE_ROD, null, B.COBBLESTONE, B.COBBLESTONE, B.COBBLESTONE, null, null, null], output: { type: B.BREWING_STAND, count: 1 } },
  { pattern: '3x3', input: [B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, null, B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT], output: { type: B.CAULDRON, count: 1 } },

  // ===== ENCHANTING TABLE =====
  { pattern: '3x3', input: [null, B.BOOK, null, B.DIAMOND, B.OBSIDIAN, B.DIAMOND, B.OBSIDIAN, B.OBSIDIAN, B.OBSIDIAN], output: { type: B.ENCHANTING_TABLE, count: 1 } },

  // ===== JUKEBOX & NOTE BLOCK =====
  { pattern: '3x3', input: [B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, B.DIAMOND, B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS], output: { type: B.JUKEBOX, count: 1 } },
  { pattern: '3x3', input: [B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, B.REDSTONE, B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS], output: { type: B.NOTE_BLOCK, count: 1 } },

  // ===== GLASS PANE & IRON BARS =====
  { pattern: '3x3', input: [B.GLASS, B.GLASS, B.GLASS, B.GLASS, B.GLASS, B.GLASS, null, null, null], output: { type: B.GLASS_PANE, count: 16 } },
  { pattern: '3x3', input: [B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT, B.IRON_INGOT, null, null, null], output: { type: B.IRON_BARS, count: 16 } },

  // ===== COMPASS, CLOCK, MAP =====
  { pattern: '3x3', input: [null, B.IRON_INGOT, null, B.IRON_INGOT, B.REDSTONE, B.IRON_INGOT, null, B.IRON_INGOT, null], output: { type: B.COMPASS, count: 1 } },
  { pattern: '3x3', input: [null, B.GOLD_INGOT, null, B.GOLD_INGOT, B.REDSTONE, B.GOLD_INGOT, null, B.GOLD_INGOT, null], output: { type: B.CLOCK, count: 1 } },
  { pattern: '3x3', input: [B.PAPER, B.PAPER, B.PAPER, B.PAPER, B.COMPASS, B.PAPER, B.PAPER, B.PAPER, B.PAPER], output: { type: B.MAP, count: 1 } },

  // ===== SHEARS =====
  { pattern: '2x2', input: [null, B.IRON_INGOT, B.IRON_INGOT, null], output: { type: B.SHEARS, count: 1 } },
  { pattern: '2x2', input: [B.IRON_INGOT, null, null, B.IRON_INGOT], output: { type: B.SHEARS, count: 1 } },

  // ===== LEAD =====
  { pattern: '3x3', input: [B.STRING, B.STRING, null, B.STRING, B.SLIMEBALL, null, null, null, B.STRING], output: { type: B.LEAD, count: 2 } },

  // ===== SHIELD =====
  { pattern: '3x3', input: [B.PLANKS, B.IRON_INGOT, B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, null, B.PLANKS, null], output: { type: B.SHIELD, count: 1 } },

  // ===== SIGN =====
  { pattern: '3x3', input: [B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, B.PLANKS, null, B.STICK, null], output: { type: B.OAK_SIGN, count: 3 } },

  // ===== BANNER =====
  { pattern: '3x3', input: [B.WOOL, B.WOOL, B.WOOL, B.WOOL, B.WOOL, B.WOOL, null, B.STICK, null], output: { type: B.WHITE_BANNER, count: 1 } },

  // ===== ITEM FRAME =====
  { pattern: '3x3', input: [B.STICK, B.STICK, B.STICK, B.STICK, B.LEATHER, B.STICK, B.STICK, B.STICK, B.STICK], output: { type: B.ITEM_FRAME, count: 1 } },
  { pattern: '2x2', input: [B.ITEM_FRAME, B.GLOWSTONE, null, null], output: { type: B.GLOW_ITEM_FRAME, count: 1 } },

  // ===== ARMOR STAND =====
  { pattern: '3x3', input: [B.STICK, B.STICK, B.STICK, null, B.STICK, null, B.STICK, B.COBBLESTONE, B.STICK], output: { type: B.ARMOR_STAND, count: 1 } },

  // ===== FLOWER POT =====
  { pattern: '3x3', input: [B.BRICK_ITEM, null, B.BRICK_ITEM, null, B.BRICK_ITEM, null, null, null, null], output: { type: B.FLOWER_POT, count: 1 } },

  // ===== CLAY & BRICKS =====
  { pattern: 'single', input: B.CLAY, output: { type: B.CLAY_BALL, count: 4 } },
  { pattern: 'single', input: B.CLAY_BALL, output: { type: B.BRICK_ITEM, count: 1 } },
  { pattern: '2x2', input: [B.BRICK_ITEM, B.BRICK_ITEM, B.BRICK_ITEM, B.BRICK_ITEM], output: { type: B.BRICK, count: 1 } },
  { pattern: '2x2', input: [B.CLAY_BALL, B.CLAY_BALL, B.CLAY_BALL, B.CLAY_BALL], output: { type: B.TERRACOTTA, count: 1 } },

  // ===== END ITEMS =====
  { pattern: '3x3', input: [B.GHAST_TEAR, B.EYE_OF_ENDER, B.GHAST_TEAR, B.EYE_OF_ENDER, B.EYE_OF_ENDER, B.EYE_OF_ENDER, B.GLASS, B.GLASS, B.GLASS], output: { type: B.END_CRYSTAL, count: 1 } },
  { pattern: '2x2', input: [B.BLAZE_ROD, null, B.CHORUS_PLANT, null], output: { type: B.END_ROD, count: 4 } },
  { pattern: '2x2', input: [B.CHORUS_PLANT, B.CHORUS_PLANT, B.CHORUS_PLANT, B.CHORUS_PLANT], output: { type: B.PURPUR_BLOCK, count: 4 } },
  { pattern: '3x3', input: [null, B.PURPUR_BLOCK, null, null, B.PURPUR_BLOCK, null, null, null, null], output: { type: B.PURPUR_PILLAR, count: 2 } },

  // ===== SPYGLASS =====
  { pattern: '3x3', input: [null, B.AMETHYST, null, null, B.COPPER_INGOT, null, null, B.COPPER_INGOT, null], output: { type: B.SPYGLASS, count: 1 } },

  // ===== CANDLE =====
  { pattern: '2x2', input: [B.STRING, null, B.HONEYCOMB, null], output: { type: B.CANDLE, count: 1 } },

  // ===== COOKIE & CAKE & PUMPKIN PIE =====
  { pattern: '3x3', input: [null, null, null, B.HAY_BALE, B.COOKIE, B.HAY_BALE, null, null, null], output: { type: B.COOKIE, count: 8 } },
  { pattern: '3x3', input: [B.PUMPKIN, B.SUGAR_CANE, null, null, null, null, null, null, null], output: { type: B.PUMPKIN_PIE, count: 1 } },

  // ===== MELON SLICE =====
  { pattern: 'single', input: B.MELON, output: { type: B.MELON_SLICE, count: 9 } },
];

function checkCraftingRecipe() {
  const gridSize = craftMode * craftMode;
  const gRaw = craftGrid.slice(0, gridSize).map(s => s ? s.type : null);
  // Normalize for crafting comparison
  const g = gRaw.map(t => t !== null ? normalizeForCrafting(t) : null);
  const filledCount = g.filter(t => t !== null).length;

  if (filledCount === 0) { craftOutput = null; return; }

  // Check single recipes
  if (filledCount === 1) {
    const inputType = g.find(t => t !== null);
    for (const recipe of CRAFT_RECIPES) {
      const recipeInput = normalizeForCrafting(recipe.input);
      if (recipe.pattern === 'single' && recipeInput === inputType) {
        craftOutput = { type: recipe.output.type, count: recipe.output.count };
        return;
      }
    }
  }

  // Check 3x3 recipes (only in crafting table mode)
  if (craftMode === 3) {
    for (const recipe of CRAFT_RECIPES) {
      if (recipe.pattern === '3x3') {
        let match = true;
        for (let i = 0; i < 9; i++) {
          const recipeSlot = recipe.input[i] ? normalizeForCrafting(recipe.input[i]) : null;
          if (recipeSlot !== g[i]) { match = false; break; }
        }
        if (match) {
          craftOutput = { type: recipe.output.type, count: recipe.output.count };
          return;
        }
      }
    }

    // Check 2x2 recipes in all 4 positions of the 3x3 grid
    for (const recipe of CRAFT_RECIPES) {
      if (recipe.pattern === '2x2') {
        for (let oy = 0; oy < 2; oy++) {
          for (let ox = 0; ox < 2; ox++) {
            // Check if only the 2x2 area has items
            let match = true;
            let otherFilled = false;
            for (let r = 0; r < 3; r++) {
              for (let c = 0; c < 3; c++) {
                const idx = r * 3 + c;
                const inRect = (r >= oy && r < oy + 2 && c >= ox && c < ox + 2);
                if (inRect) {
                  const ri = (r - oy) * 2 + (c - ox);
                  const recipeSlot = recipe.input[ri] ? normalizeForCrafting(recipe.input[ri]) : null;
                  if (g[idx] !== recipeSlot) match = false;
                } else {
                  if (g[idx] !== null) otherFilled = true;
                }
              }
            }
            if (match && !otherFilled) {
              craftOutput = { type: recipe.output.type, count: recipe.output.count };
              return;
            }
          }
        }
      }
    }
  }

  // Check 2x2 recipes (in 2x2 mode)
  if (craftMode === 2 && filledCount <= 4) {
    for (const recipe of CRAFT_RECIPES) {
      if (recipe.pattern === '2x2') {
        const r0 = recipe.input[0] ? normalizeForCrafting(recipe.input[0]) : null;
        const r1 = recipe.input[1] ? normalizeForCrafting(recipe.input[1]) : null;
        const r2 = recipe.input[2] ? normalizeForCrafting(recipe.input[2]) : null;
        const r3 = recipe.input[3] ? normalizeForCrafting(recipe.input[3]) : null;
        if (g[0] === r0 && g[1] === r1 && g[2] === r2 && g[3] === r3) {
          craftOutput = { type: recipe.output.type, count: recipe.output.count };
          return;
        }
      }
    }
  }

  craftOutput = null;
}

function craftItem() {
  if (!craftOutput) return null;
  const result = { type: craftOutput.type, count: craftOutput.count };
  const maxDur = getMaxDurability(result.type);
  if (maxDur > 0) result.durability = maxDur;
  const gridSize = craftMode * craftMode;

  // Consume 1 from each filled craft slot
  for (let i = 0; i < gridSize; i++) {
    if (craftGrid[i]) {
      craftGrid[i].count--;
      if (craftGrid[i].count <= 0) craftGrid[i] = null;
    }
  }
  checkCraftingRecipe();
  // Achievement check
  checkCraftAchievements(result.type);
  return result;
}

function returnCraftGridToInventory() {
  const gridSize = craftMode * craftMode;
  for (let i = 0; i < gridSize; i++) {
    if (craftGrid[i]) {
      for (let j = 0; j < craftGrid[i].count; j++) {
        addToInventory(craftGrid[i].type);
      }
      craftGrid[i] = null;
    }
  }
  if (cursorItem) {
    for (let j = 0; j < cursorItem.count; j++) {
      addToInventory(cursorItem.type);
    }
    cursorItem = null;
  }
  craftOutput = null;
}

function toggleInventory() {
  inventoryOpen = !inventoryOpen;
  canvas.classList.toggle('inventory-open', inventoryOpen);
  if (!inventoryOpen) {
    returnCraftGridToInventory();
    craftMode = 2;
    craftGrid = [null, null, null, null];
  } else {
    craftMode = 2;
    craftGrid = [null, null, null, null];
  }
}

function openCraftingTable() {
  if (inventoryOpen) return;
  inventoryOpen = true;
  craftMode = 3;
  craftGrid = [null, null, null, null, null, null, null, null, null];
  craftOutput = null;
  canvas.classList.add('inventory-open');
}

function getInventoryLayout() {
  const totalW = INV_COLS * (INV_SLOT + INV_PAD) - INV_PAD;
  const windowW = totalW + 60;
  const craftRows = craftMode;
  const craftAreaH = craftRows * (INV_SLOT + INV_PAD) + 30;
  const armorAreaH = 4 * (INV_SLOT + INV_PAD) + 20; // 4 armor slots
  const windowH = craftAreaH + armorAreaH + 3 * (INV_SLOT + INV_PAD) + (INV_SLOT + INV_PAD) + 100;
  const ox = (canvas.width - windowW) / 2;
  const oy = (canvas.height - windowH) / 2;
  return { ox, oy, windowW, windowH, totalW, craftAreaH, armorAreaH };
}

function drawInventory() {
  if (!inventoryOpen) return;
  const { ox, oy, windowW, windowH, totalW, craftAreaH, armorAreaH } = getInventoryLayout();
  invSlotRects = [];
  hoveredSlot = -1;
  tooltipText = '';

  // Darken background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Window background
  ctx.fillStyle = '#8B8B8B';
  ctx.fillRect(ox, oy, windowW, windowH);
  // Inner border
  ctx.fillStyle = '#C6C6C6';
  ctx.fillRect(ox + 4, oy + 4, windowW - 8, windowH - 8);
  // 3D border effect
  ctx.fillStyle = '#fff';
  ctx.fillRect(ox + 3, oy + 3, windowW - 6, 2);
  ctx.fillRect(ox + 3, oy + 3, 2, windowH - 6);
  ctx.fillStyle = '#555';
  ctx.fillRect(ox + 3, oy + windowH - 5, windowW - 6, 2);
  ctx.fillRect(ox + windowW - 5, oy + 3, 2, windowH - 6);

  // Title
  ctx.fillStyle = '#404040';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  const title = craftMode === 3 ? 'Crafting Table' : 'Inventory';
  ctx.fillText(title, ox + 12, oy + 24);

  const slotStartX = ox + 30;

  // --- Crafting Area ---
  const craftLabel = craftMode === 3 ? 'Crafting (3x3)' : 'Crafting';
  ctx.fillStyle = '#404040';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(craftLabel, slotStartX, oy + 50);

  // Crafting grid (2x2 or 3x3)
  const craftX = slotStartX;
  const craftY = oy + 58;
  for (let cy = 0; cy < craftMode; cy++) {
    for (let cx = 0; cx < craftMode; cx++) {
      const idx = cy * craftMode + cx;
      const sx = craftX + cx * (INV_SLOT + INV_PAD);
      const sy = craftY + cy * (INV_SLOT + INV_PAD);
      const slotId = { area: 'craft', index: idx };
      drawInvSlot(sx, sy, craftGrid[idx], slotId);
    }
  }

  // Arrow
  const arrowX = craftX + craftMode * (INV_SLOT + INV_PAD) + 16;
  const gridMidY = craftY + (craftMode * (INV_SLOT + INV_PAD) - INV_PAD) / 2;
  ctx.fillStyle = '#404040';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('\u2192', arrowX, gridMidY + 8);

  // Craft output slot
  const outX = arrowX + 36;
  const outY = gridMidY - INV_SLOT / 2;
  const outSlotId = { area: 'craft_output', index: 0 };
  drawInvSlot(outX, outY, craftOutput, outSlotId, true);

  // Recipe hint text
  if (craftOutput) {
    const name = BLOCK_INFO[craftOutput.type] ? BLOCK_INFO[craftOutput.type].name : '?';
    ctx.fillStyle = '#2a6e2a';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${name} x${craftOutput.count}`, outX + INV_SLOT / 2, outY + INV_SLOT + 14);
  }

  // --- Armor Slots ---
  const armorY = oy + craftAreaH + 10;
  ctx.fillStyle = '#404040';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Armor', slotStartX, armorY);

  const armorSlotNames = ['helmet', 'chestplate', 'leggings', 'boots'];
  const armorSlotLabels = ['H', 'C', 'L', 'B'];
  for (let i = 0; i < 4; i++) {
    const sx = slotStartX + i * (INV_SLOT + INV_PAD);
    const sy = armorY + 8;
    const slotId = { area: 'armor', index: i, slot: armorSlotNames[i] };
    const armorItem = player && player.armor ? player.armor[armorSlotNames[i]] : null;
    drawInvSlot(sx, sy, armorItem, slotId, false, false, armorSlotLabels[i]);
  }

  // Defense display
  const totalDefense = typeof getTotalArmorDefense === 'function' ? getTotalArmorDefense() : 0;
  ctx.fillStyle = '#404040';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Defense: ${totalDefense}`, slotStartX + 4 * (INV_SLOT + INV_PAD) + 10, armorY + INV_SLOT / 2 + 12);

  // --- Main Inventory (3 rows of 9) ---
  const mainY = oy + craftAreaH + armorAreaH + 20;
  ctx.fillStyle = '#404040';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Inventory', slotStartX, mainY - 6);

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      const invIdx = 9 + row * 9 + col;
      const sx = slotStartX + col * (INV_SLOT + INV_PAD);
      const sy = mainY + row * (INV_SLOT + INV_PAD);
      const slotId = { area: 'main', index: invIdx };
      drawInvSlot(sx, sy, player.inventory[invIdx], slotId);
    }
  }

  // --- Offhand Slot ---
  const offhandY = armorY + 8;
  const offhandX = slotStartX + 5 * (INV_SLOT + INV_PAD);
  ctx.fillStyle = '#404040';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Offhand', offhandX, armorY);
  const offhandSlotId = { area: 'offhand', index: 0 };
  drawInvSlot(offhandX, offhandY, player.offhand, offhandSlotId, false, false, 'O');

  // --- Hotbar ---
  const hotbarY = mainY + 3 * (INV_SLOT + INV_PAD) + 12;
  ctx.fillStyle = '#404040';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Hotbar', slotStartX, hotbarY - 6);

  for (let col = 0; col < 9; col++) {
    const sx = slotStartX + col * (INV_SLOT + INV_PAD);
    const sy = hotbarY;
    const slotId = { area: 'hotbar', index: col };
    drawInvSlot(sx, sy, player.inventory[col], slotId, false, col === player.selectedSlot);
  }

  // --- Tooltip ---
  if (tooltipText) {
    ctx.font = '13px monospace';
    const tw = ctx.measureText(tooltipText).width + 10;
    const tx = mouse.x + 14;
    const ty = mouse.y - 28;
    ctx.fillStyle = 'rgba(20, 0, 40, 0.92)';
    ctx.fillRect(tx - 2, ty - 14, tw + 4, 22);
    ctx.strokeStyle = '#5020a0';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx - 2, ty - 14, tw + 4, 22);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(tooltipText, tx + 3, ty + 2);
  }

  // --- Cursor item ---
  if (cursorItem) {
    drawBlock(mouse.x - INV_SLOT/3, mouse.y - INV_SLOT/3, cursorItem.type, INV_SLOT * 0.65);
    if (cursorItem.count > 1) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'right';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 2;
      ctx.fillText(cursorItem.count, mouse.x + INV_SLOT/3, mouse.y + INV_SLOT/3);
      ctx.shadowBlur = 0;
    }
  }

  // Help text at bottom
  ctx.fillStyle = 'rgba(64,64,64,0.7)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  const helpKey = craftMode === 3 ? 'E/ESC: Close' : 'E: Close';
  ctx.fillText(`Left Click: Pick/Place  |  Right Click: Split  |  Shift+Click: Quick Move  |  F: Swap Offhand  |  ${helpKey}`, canvas.width / 2, oy + windowH + 20);
}

function drawInvSlot(x, y, item, slotId, isOutput, isSelected, slotLabel) {
  const hovered = mouse.x >= x && mouse.x < x + INV_SLOT &&
                  mouse.y >= y && mouse.y < y + INV_SLOT;

  // Save rect for click detection
  invSlotRects.push({ x, y, w: INV_SLOT, h: INV_SLOT, slotId });

  if (hovered) {
    hoveredSlot = invSlotRects.length - 1;
    if (item) {
      const info = BLOCK_INFO[item.type];
      if (info && info.durability && item.durability !== undefined) {
        tooltipText = `${info.name} (${item.durability}/${info.durability})`;
      } else if (info && info.defense) {
        tooltipText = `${info.name} (Defense: ${info.defense})`;
      } else {
        tooltipText = info ? `${info.name} x${item.count}` : `Block ${item.type} x${item.count}`;
      }
    } else if (cursorItem) {
      tooltipText = '';
    } else if (slotLabel) {
      // Show slot type hint when empty
      const slotNames = { H: 'Helmet', C: 'Chestplate', L: 'Leggings', B: 'Boots', O: 'Offhand (F to swap)' };
      tooltipText = slotNames[slotLabel] || '';
    }
  }

  // Slot background
  if (isOutput) {
    // Output slot - bigger look
    ctx.fillStyle = '#8B8B8B';
    ctx.fillRect(x - 3, y - 3, INV_SLOT + 6, INV_SLOT + 6);
    ctx.fillStyle = hovered ? '#b0b0d0' : '#a0a0a0';
    ctx.fillRect(x, y, INV_SLOT, INV_SLOT);
  } else {
    // 3D inset slot
    ctx.fillStyle = '#373737';
    ctx.fillRect(x, y, INV_SLOT, INV_SLOT);
    ctx.fillStyle = hovered ? '#5a5a7a' : '#8B8B8B';
    ctx.fillRect(x + 2, y + 2, INV_SLOT - 2, INV_SLOT - 2);

    // Selection highlight for hotbar
    if (isSelected) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 1, y - 1, INV_SLOT + 2, INV_SLOT + 2);
    }
  }

  // Hover glow
  if (hovered) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x + 2, y + 2, INV_SLOT - 4, INV_SLOT - 4);
  }

  // Slot label for armor slots (when empty)
  if (slotLabel && !item) {
    ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(slotLabel, x + INV_SLOT / 2, y + INV_SLOT / 2 + 6);
  }

  // Item
  if (item) {
    const iconSize = INV_SLOT - 16;
    drawBlock(x + 8, y + 8, item.type, iconSize);
    // Durability bar
    drawDurabilityBar(x + 8, y + 8, iconSize, item);

    // Count
    if (item.count > 1) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(item.count, x + INV_SLOT - 3, y + INV_SLOT - 3);
      ctx.fillStyle = '#fff';
      ctx.fillText(item.count, x + INV_SLOT - 4, y + INV_SLOT - 4);
    }
  }
}

function handleInventoryClick(button, shiftKey) {
  if (!inventoryOpen || hoveredSlot < 0) return;

  const rect = invSlotRects[hoveredSlot];
  if (!rect) return;
  const { slotId } = rect;

  if (slotId.area === 'craft_output') {
    handleCraftOutputClick(button);
    return;
  }

  // Handle armor slots
  if (slotId.area === 'armor') {
    handleArmorSlotClick(slotId.slot, button);
    return;
  }

  // Handle offhand slot
  if (slotId.area === 'offhand') {
    handleOffhandSlotClick(button);
    return;
  }

  // Get reference to the slot
  let slotRef;
  if (slotId.area === 'craft') {
    slotRef = { get: () => craftGrid[slotId.index], set: (v) => { craftGrid[slotId.index] = v; } };
  } else if (slotId.area === 'hotbar') {
    slotRef = { get: () => player.inventory[slotId.index], set: (v) => { player.inventory[slotId.index] = v; } };
  } else if (slotId.area === 'main') {
    slotRef = { get: () => player.inventory[slotId.index], set: (v) => { player.inventory[slotId.index] = v; } };
  }
  if (!slotRef) return;

  const slotItem = slotRef.get();

  // Shift-click: quick move
  if (shiftKey && button === 0 && slotItem) {
    if (slotId.area === 'hotbar') {
      // Move from hotbar to main inventory
      quickMoveItem(slotId.index, 9, 35);
    } else if (slotId.area === 'main') {
      // Move from main to hotbar
      quickMoveItem(slotId.index, 0, 8);
    } else if (slotId.area === 'craft') {
      // Move from craft back to inventory
      quickMoveCraftItem(slotId.index);
    }
    checkCraftingRecipe();
    return;
  }

  if (button === 0) {
    // Left click: pick up / place / swap
    if (!cursorItem && slotItem) {
      // Pick up entire stack
      cursorItem = { type: slotItem.type, count: slotItem.count };
      slotRef.set(null);
    } else if (cursorItem && !slotItem) {
      // Place entire stack
      slotRef.set({ type: cursorItem.type, count: cursorItem.count });
      cursorItem = null;
    } else if (cursorItem && slotItem) {
      if (cursorItem.type === slotItem.type) {
        // Stack items
        const ms = getMaxStack(slotItem.type);
        const space = ms - slotItem.count;
        const transfer = Math.min(cursorItem.count, space);
        slotItem.count += transfer;
        cursorItem.count -= transfer;
        if (cursorItem.count <= 0) cursorItem = null;
      } else {
        // Swap
        const temp = { type: slotItem.type, count: slotItem.count };
        slotRef.set({ type: cursorItem.type, count: cursorItem.count });
        cursorItem = temp;
      }
    }
  } else if (button === 2) {
    // Right click: place 1 / pick up half
    if (!cursorItem && slotItem) {
      // Pick up half
      const half = Math.ceil(slotItem.count / 2);
      cursorItem = { type: slotItem.type, count: half };
      slotItem.count -= half;
      if (slotItem.count <= 0) slotRef.set(null);
    } else if (cursorItem && !slotItem) {
      // Place 1
      slotRef.set({ type: cursorItem.type, count: 1 });
      cursorItem.count--;
      if (cursorItem.count <= 0) cursorItem = null;
    } else if (cursorItem && slotItem && cursorItem.type === slotItem.type) {
      // Place 1 onto matching stack
      if (slotItem.count < getMaxStack(slotItem.type)) {
        slotItem.count++;
        cursorItem.count--;
        if (cursorItem.count <= 0) cursorItem = null;
      }
    } else if (cursorItem && slotItem && cursorItem.type !== slotItem.type) {
      // Swap
      const temp = { type: slotItem.type, count: slotItem.count };
      slotRef.set({ type: cursorItem.type, count: cursorItem.count });
      cursorItem = temp;
    }
  }

  checkCraftingRecipe();
}

function handleCraftOutputClick(button) {
  if (!craftOutput) return;

  if (button === 0) {
    if (!cursorItem) {
      cursorItem = craftItem();
    } else if (cursorItem.type === craftOutput.type && cursorItem.count + craftOutput.count <= 64) {
      const result = craftItem();
      if (result) cursorItem.count += result.count;
    }
  }
}

function handleArmorSlotClick(slotName, button) {
  const currentArmor = player.armor[slotName];

  if (button === 0) {
    // Left click: equip/unequip/swap
    if (!cursorItem && currentArmor) {
      // Pick up armor
      cursorItem = { type: currentArmor.type, count: 1, durability: currentArmor.durability };
      player.armor[slotName] = null;
    } else if (cursorItem && !currentArmor) {
      // Try to equip
      const info = BLOCK_INFO[cursorItem.type];
      if (info && info.armor === slotName) {
        player.armor[slotName] = { type: cursorItem.type, durability: cursorItem.durability };
        cursorItem.count--;
        if (cursorItem.count <= 0) cursorItem = null;
      }
    } else if (cursorItem && currentArmor) {
      // Swap if valid armor type
      const info = BLOCK_INFO[cursorItem.type];
      if (info && info.armor === slotName) {
        const temp = { type: currentArmor.type, count: 1, durability: currentArmor.durability };
        player.armor[slotName] = { type: cursorItem.type, durability: cursorItem.durability };
        cursorItem = temp;
      }
    }
  }
}

function handleOffhandSlotClick(button) {
  const currentOffhand = player.offhand;

  if (button === 0) {
    // Left click: pick up / place / swap
    if (!cursorItem && currentOffhand) {
      // Pick up from offhand
      cursorItem = { type: currentOffhand.type, count: currentOffhand.count, durability: currentOffhand.durability };
      player.offhand = null;
    } else if (cursorItem && !currentOffhand) {
      // Place in offhand
      player.offhand = { type: cursorItem.type, count: cursorItem.count, durability: cursorItem.durability };
      cursorItem = null;
    } else if (cursorItem && currentOffhand) {
      // Swap
      const temp = { type: currentOffhand.type, count: currentOffhand.count, durability: currentOffhand.durability };
      player.offhand = { type: cursorItem.type, count: cursorItem.count, durability: cursorItem.durability };
      cursorItem = temp;
    }
  } else if (button === 2) {
    // Right click: place one / pick up half
    if (!cursorItem && currentOffhand) {
      // Pick up half
      const half = Math.ceil(currentOffhand.count / 2);
      cursorItem = { type: currentOffhand.type, count: half, durability: currentOffhand.durability };
      currentOffhand.count -= half;
      if (currentOffhand.count <= 0) player.offhand = null;
    } else if (cursorItem && !currentOffhand) {
      // Place one
      player.offhand = { type: cursorItem.type, count: 1, durability: cursorItem.durability };
      cursorItem.count--;
      if (cursorItem.count <= 0) cursorItem = null;
    } else if (cursorItem && currentOffhand && cursorItem.type === currentOffhand.type) {
      // Add one to offhand if same type
      const maxStack = getMaxStack(currentOffhand.type);
      if (currentOffhand.count < maxStack) {
        currentOffhand.count++;
        cursorItem.count--;
        if (cursorItem.count <= 0) cursorItem = null;
      }
    }
  }
}

// Swap selected hotbar slot with offhand (F key)
function swapWithOffhand() {
  if (!player) return;
  const slot = player.selectedSlot;
  const hotbarItem = player.inventory[slot];
  const offhandItem = player.offhand;

  // Swap items
  player.inventory[slot] = offhandItem ? { type: offhandItem.type, count: offhandItem.count, durability: offhandItem.durability } : null;
  player.offhand = hotbarItem ? { type: hotbarItem.type, count: hotbarItem.count, durability: hotbarItem.durability } : null;
}

// Quick equip armor from inventory
function tryEquipArmor(invIndex) {
  const item = player.inventory[invIndex];
  if (!item) return false;

  const info = BLOCK_INFO[item.type];
  if (!info || !info.armor) return false;

  const slotName = info.armor;
  if (player.armor[slotName]) return false; // Slot occupied

  player.armor[slotName] = { type: item.type, durability: item.durability };
  item.count--;
  if (item.count <= 0) player.inventory[invIndex] = null;
  return true;
}

function quickMoveItem(fromIdx, toStart, toEnd) {
  const item = player.inventory[fromIdx];
  if (!item) return;
  const ms = getMaxStack(item.type);

  // Try stacking first
  for (let i = toStart; i <= toEnd; i++) {
    const target = player.inventory[i];
    if (target && target.type === item.type && target.count < ms) {
      const transfer = Math.min(item.count, ms - target.count);
      target.count += transfer;
      item.count -= transfer;
      if (item.count <= 0) { player.inventory[fromIdx] = null; return; }
    }
  }
  // Try empty slot
  for (let i = toStart; i <= toEnd; i++) {
    if (!player.inventory[i]) {
      player.inventory[i] = { type: item.type, count: item.count };
      player.inventory[fromIdx] = null;
      return;
    }
  }
}

function quickMoveCraftItem(craftIdx) {
  const item = craftGrid[craftIdx];
  if (!item) return;

  // Try stacking in hotbar first, then main
  for (let pass = 0; pass < 2; pass++) {
    const start = pass === 0 ? 0 : 9;
    const end = pass === 0 ? 8 : 35;
    for (let i = start; i <= end; i++) {
      const target = player.inventory[i];
      if (target && target.type === item.type && target.count < getMaxStack(item.type)) {
        const transfer = Math.min(item.count, getMaxStack(item.type) - target.count);
        target.count += transfer;
        item.count -= transfer;
        if (item.count <= 0) { craftGrid[craftIdx] = null; return; }
      }
    }
  }
  // Try empty
  for (let i = 0; i < 36; i++) {
    if (!player.inventory[i]) {
      player.inventory[i] = { type: item.type, count: item.count };
      craftGrid[craftIdx] = null;
      return;
    }
  }
}

// ============================================================
// Dropped Items System
// ============================================================

function createDroppedItem(x, y, type, count) {
  return {
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 3,
    vy: -3 - Math.random() * 2,
    type: type,
    count: count,
    w: 16,
    h: 16,
    onGround: false,
    pickupDelay: 500, // ms before can be picked up
    life: 300000 // 5 minutes
  };
}

function dropItem(dropOne) {
  if (!player) return;
  const slot = player.selectedSlot;
  const item = player.inventory[slot];
  if (!item) return;

  const dropCount = dropOne ? 1 : item.count;
  const dropped = createDroppedItem(
    player.x + player.w / 2,
    player.y + player.h / 2,
    item.type,
    dropCount
  );
  dropped.vx = player.facing * 3;
  droppedItems.push(dropped);

  // Update inventory
  item.count -= dropCount;
  if (item.count <= 0) {
    player.inventory[slot] = null;
  }

  // Multiplayer sync
  if (isMultiplayer) {
    netSendDropItem(dropped);
  }
}

function updateDroppedItems(dt) {
  const gravity = 0.4;

  for (let i = droppedItems.length - 1; i >= 0; i--) {
    const item = droppedItems[i];

    // Life timer
    item.life -= dt;
    if (item.life <= 0) {
      droppedItems.splice(i, 1);
      continue;
    }

    // Pickup delay
    if (item.pickupDelay > 0) {
      item.pickupDelay -= dt;
    }

    // Physics
    if (!item.onGround) {
      item.vy += gravity;
      item.y += item.vy;
      item.x += item.vx;
      item.vx *= 0.95;

      // Ground collision
      const bx = Math.floor((item.x + item.w / 2) / BLOCK_SIZE);
      const by = Math.floor((item.y + item.h) / BLOCK_SIZE);
      if (getBlock(bx, by) !== B.AIR && getBlock(bx, by) !== B.WATER) {
        item.y = by * BLOCK_SIZE - item.h;
        item.vy = 0;
        item.vx = 0;
        item.onGround = true;
      }
    }

    // Pickup by player
    if (item.pickupDelay <= 0 && player) {
      const pcx = player.x + player.w / 2;
      const pcy = player.y + player.h / 2;
      const icx = item.x + item.w / 2;
      const icy = item.y + item.h / 2;
      const dist = Math.sqrt((pcx - icx) ** 2 + (pcy - icy) ** 2);

      if (dist < BLOCK_SIZE * 1.5) {
        // Try to add to inventory
        if (addToInventory(item.type, item.count)) {
          droppedItems.splice(i, 1);
          // Sound effect
          if (typeof playPickupSound === 'function') playPickupSound();
          if (isMultiplayer) {
            netSendPickupItem(i);
          }
        }
      }
    }
  }
}

function drawDroppedItems() {
  for (const item of droppedItems) {
    // Bob animation
    const bob = Math.sin(Date.now() / 200 + item.x) * 2;

    ctx.save();
    ctx.translate(
      item.x - camera.x + item.w / 2,
      item.y - camera.y + bob + item.h / 2
    );

    // Draw item
    const size = 16;
    drawBlock(-size / 2, -size / 2, item.type, size);

    // Draw count if > 1
    if (item.count > 1) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(item.count, size / 2, size / 2 + 3);
    }

    ctx.restore();
  }
}
