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
  // Armor
  LEATHER_HELMET: 47, LEATHER_CHESTPLATE: 48, LEATHER_LEGGINGS: 49, LEATHER_BOOTS: 50,
  IRON_HELMET: 51, IRON_CHESTPLATE: 52, IRON_LEGGINGS: 53, IRON_BOOTS: 54,
  GOLD_HELMET: 55, GOLD_CHESTPLATE: 56, GOLD_LEGGINGS: 57, GOLD_BOOTS: 58,
  DIAMOND_HELMET: 59, DIAMOND_CHESTPLATE: 60, DIAMOND_LEGGINGS: 61, DIAMOND_BOOTS: 62,
  // Nether blocks
  OBSIDIAN: 63, NETHERRACK: 64, SOUL_SAND: 65, GLOWSTONE: 66,
  NETHER_BRICK: 67, NETHER_QUARTZ_ORE: 68, NETHER_PORTAL: 69, LAVA: 70,
  // End blocks
  END_STONE: 71, END_PORTAL: 72, END_PORTAL_FRAME: 73,
  // Nether/End items
  FLINT: 74, FLINT_AND_STEEL: 75, ENDER_PEARL: 76, BLAZE_ROD: 77,
  BLAZE_POWDER: 78, EYE_OF_ENDER: 79,
  // Nether mobs drops
  GOLD_NUGGET: 80, GHAST_TEAR: 81,
  // Additional blocks
  GRAVEL: 82,
  // Ocean & Beach blocks
  CLAY: 83, SANDSTONE: 84, RED_SAND: 85, RED_SANDSTONE: 86,
  PRISMARINE: 87, DARK_PRISMARINE: 88, SEA_LANTERN: 89,
  KELP: 90, SEAGRASS: 91, CORAL_BLUE: 92, CORAL_PINK: 93, CORAL_PURPLE: 94,
  SPONGE: 95, WET_SPONGE: 96,
  // Ice variants
  ICE: 97, PACKED_ICE: 98, BLUE_ICE: 99,
  // Stone variants
  STONE_BRICK: 100, MOSSY_STONE_BRICK: 101, CRACKED_STONE_BRICK: 102,
  MOSSY_COBBLESTONE: 103, SMOOTH_STONE: 104,
  ANDESITE: 105, DIORITE: 106, GRANITE: 107,
  POLISHED_ANDESITE: 108, POLISHED_DIORITE: 109, POLISHED_GRANITE: 110,
  // Deepslate variants
  DEEPSLATE: 111, COBBLED_DEEPSLATE: 112, DEEPSLATE_COAL_ORE: 113,
  DEEPSLATE_IRON_ORE: 114, DEEPSLATE_GOLD_ORE: 115, DEEPSLATE_DIAMOND_ORE: 116,
  DEEPSLATE_COPPER_ORE: 117, DEEPSLATE_EMERALD_ORE: 118, DEEPSLATE_LAPIS_ORE: 119,
  DEEPSLATE_REDSTONE_ORE: 120,
  // More ores
  EMERALD_ORE: 121, LAPIS_ORE: 122, REDSTONE_ORE: 123,
  // Functional blocks
  FURNACE: 124, CHEST: 125, TNT: 126, BOOKSHELF: 127, LADDER: 128,
  TORCH: 129, LANTERN: 130, JACK_O_LANTERN: 131,
  // Nature blocks
  PUMPKIN: 132, MELON: 133, HAY_BALE: 134, CACTUS: 135, SUGAR_CANE: 136,
  BAMBOO: 137, DEAD_BUSH: 138, FERN: 139, TALL_GRASS: 140,
  // Wood variants
  OAK_LOG: 141, BIRCH_LOG: 142, SPRUCE_LOG: 143, JUNGLE_LOG: 144, ACACIA_LOG: 145, DARK_OAK_LOG: 146,
  OAK_PLANKS: 147, BIRCH_PLANKS: 148, SPRUCE_PLANKS: 149, JUNGLE_PLANKS: 150, ACACIA_PLANKS: 151, DARK_OAK_PLANKS: 152,
  OAK_LEAVES: 153, BIRCH_LEAVES: 154, SPRUCE_LEAVES: 155, JUNGLE_LEAVES: 156, ACACIA_LEAVES: 157, DARK_OAK_LEAVES: 158,
  // Terracotta
  TERRACOTTA: 159, WHITE_TERRACOTTA: 160, ORANGE_TERRACOTTA: 161, MAGENTA_TERRACOTTA: 162,
  LIGHT_BLUE_TERRACOTTA: 163, YELLOW_TERRACOTTA: 164, LIME_TERRACOTTA: 165, PINK_TERRACOTTA: 166,
  CYAN_TERRACOTTA: 167, PURPLE_TERRACOTTA: 168, BLUE_TERRACOTTA: 169, BROWN_TERRACOTTA: 170,
  GREEN_TERRACOTTA: 171, RED_TERRACOTTA: 172, BLACK_TERRACOTTA: 173,
  // Concrete
  WHITE_CONCRETE: 174, ORANGE_CONCRETE: 175, MAGENTA_CONCRETE: 176, LIGHT_BLUE_CONCRETE: 177,
  YELLOW_CONCRETE: 178, LIME_CONCRETE: 179, PINK_CONCRETE: 180, GRAY_CONCRETE: 181,
  CYAN_CONCRETE: 182, PURPLE_CONCRETE: 183, BLUE_CONCRETE: 184, BROWN_CONCRETE: 185,
  GREEN_CONCRETE: 186, RED_CONCRETE: 187, BLACK_CONCRETE: 188,
  // Wool colors
  WHITE_WOOL: 189, ORANGE_WOOL: 190, MAGENTA_WOOL: 191, LIGHT_BLUE_WOOL: 192,
  YELLOW_WOOL: 193, LIME_WOOL: 194, PINK_WOOL: 195, GRAY_WOOL: 196,
  CYAN_WOOL: 197, PURPLE_WOOL: 198, BLUE_WOOL: 199, BROWN_WOOL: 200,
  GREEN_WOOL: 201, RED_WOOL: 202, BLACK_WOOL: 203,
  // Nether additions
  CRIMSON_NYLIUM: 204, WARPED_NYLIUM: 205, CRIMSON_STEM: 206, WARPED_STEM: 207,
  SHROOMLIGHT: 208, CRYING_OBSIDIAN: 209, BASALT: 210, POLISHED_BASALT: 211,
  BLACKSTONE: 212, POLISHED_BLACKSTONE: 213, GILDED_BLACKSTONE: 214,
  ANCIENT_DEBRIS: 215, NETHERITE_BLOCK: 216,
  // End additions
  PURPUR_BLOCK: 217, PURPUR_PILLAR: 218, END_BRICK: 219, CHORUS_PLANT: 220, CHORUS_FLOWER: 221,
  // Misc blocks
  MYCELIUM: 222, PODZOL: 223, COARSE_DIRT: 224, ROOTED_DIRT: 225,
  MOSS_BLOCK: 226, DRIPSTONE: 227, CALCITE: 228, TUFF: 229, AMETHYST: 230,
  COPPER_BLOCK: 231, EXPOSED_COPPER: 232, WEATHERED_COPPER: 233, OXIDIZED_COPPER: 234,
  RAW_IRON_BLOCK: 235, RAW_GOLD_BLOCK: 236, RAW_COPPER_BLOCK: 237,
  IRON_BLOCK: 238, GOLD_BLOCK: 239, DIAMOND_BLOCK: 240, EMERALD_BLOCK: 241,
  LAPIS_BLOCK: 242, REDSTONE_BLOCK: 243, COAL_BLOCK: 244,
  // Food items
  COOKED_PORK: 245, COOKED_BEEF: 246, COOKED_CHICKEN: 247,
  BREAD: 248, APPLE: 249, GOLDEN_APPLE: 250, ENCHANTED_GOLDEN_APPLE: 251,
  CARROT: 252, GOLDEN_CARROT: 253, POTATO: 254, BAKED_POTATO: 255,
  BEETROOT: 256, MELON_SLICE: 257, SWEET_BERRIES: 258, GLOW_BERRIES: 259,
  COOKIE: 260, CAKE: 261, PUMPKIN_PIE: 262,
  // More items
  EMERALD: 263, LAPIS: 264, REDSTONE: 265, QUARTZ: 266,
  COAL: 267, CHARCOAL: 268, RAW_IRON: 269, RAW_GOLD: 270, RAW_COPPER: 271,
  IRON_INGOT: 272, GOLD_INGOT: 273, COPPER_INGOT: 274, NETHERITE_INGOT: 275,
  DIAMOND: 276, NETHERITE_SCRAP: 277,
  // Netherite tools
  NETHERITE_PICKAXE: 278, NETHERITE_AXE: 279, NETHERITE_SWORD: 280, NETHERITE_SHOVEL: 281,
  // Netherite armor
  NETHERITE_HELMET: 282, NETHERITE_CHESTPLATE: 283, NETHERITE_LEGGINGS: 284, NETHERITE_BOOTS: 285,
  // Misc
  BONE: 286, BONE_BLOCK: 287, SLIME_BLOCK: 288, HONEY_BLOCK: 289,
  DRIED_KELP: 290, DRIED_KELP_BLOCK: 291, STRING: 292, COBWEB: 293,
  BUCKET: 294, WATER_BUCKET: 295, LAVA_BUCKET: 296,
  // Dyes
  WHITE_DYE: 297, ORANGE_DYE: 298, MAGENTA_DYE: 299, LIGHT_BLUE_DYE: 300,
  YELLOW_DYE: 301, LIME_DYE: 302, PINK_DYE: 303, GRAY_DYE: 304,
  CYAN_DYE: 305, PURPLE_DYE: 306, BLUE_DYE: 307, BROWN_DYE: 308,
  GREEN_DYE: 309, RED_DYE: 310, BLACK_DYE: 311,
  // More items
  GUNPOWDER: 312, SLIMEBALL: 313, HONEYCOMB: 314, INK_SAC: 315,
  PAPER: 316, BOOK: 317, ARROW: 318, BOW: 319, FISHING_ROD: 320,
  COMPASS: 321, CLOCK: 322, MAP: 323, SHEARS: 324, LEAD: 325,
  // More blocks
  TNT: 326, NOTE_BLOCK: 327, JUKEBOX: 328, ENCHANTING_TABLE: 329,
  ANVIL: 330, BREWING_STAND: 331, CAULDRON: 332, HOPPER: 333,
  RAIL: 334, POWERED_RAIL: 335, DETECTOR_RAIL: 336,
  PISTON: 337, STICKY_PISTON: 338, OBSERVER: 339, DISPENSER: 340, DROPPER: 341,
  // Glass panes & bars
  GLASS_PANE: 342, IRON_BARS: 343,
  // Flowers for dyes
  DANDELION: 344, POPPY: 345, BLUE_ORCHID: 346, ALLIUM: 347, AZURE_BLUET: 348,
  RED_TULIP: 349, ORANGE_TULIP: 350, WHITE_TULIP: 351, PINK_TULIP: 352,
  OXEYE_DAISY: 353, CORNFLOWER: 354, LILY_OF_VALLEY: 355, SUNFLOWER: 356,
  LILAC: 357, ROSE_BUSH: 358, PEONY: 359, WITHER_ROSE: 360,
  // Beds
  WHITE_BED: 361, ORANGE_BED: 362, MAGENTA_BED: 363, LIGHT_BLUE_BED: 364,
  YELLOW_BED: 365, LIME_BED: 366, PINK_BED: 367, GRAY_BED: 368,
  CYAN_BED: 369, PURPLE_BED: 370, BLUE_BED: 371, BROWN_BED: 372,
  GREEN_BED: 373, RED_BED: 374, BLACK_BED: 375,
  // Doors
  OAK_DOOR: 376, BIRCH_DOOR: 377, SPRUCE_DOOR: 378, JUNGLE_DOOR: 379,
  ACACIA_DOOR: 380, DARK_OAK_DOOR: 381, IRON_DOOR: 382, CRIMSON_DOOR: 383, WARPED_DOOR: 384,
  // Trapdoors
  OAK_TRAPDOOR: 385, IRON_TRAPDOOR: 386,
  // Fences & Gates
  OAK_FENCE: 387, OAK_FENCE_GATE: 388, NETHER_BRICK_FENCE: 389,
  // Signs
  OAK_SIGN: 390,
  // Boats & Minecarts
  OAK_BOAT: 391, MINECART: 392, CHEST_MINECART: 393, HOPPER_MINECART: 394, TNT_MINECART: 395,
  // Redstone items
  REDSTONE_TORCH: 396, LEVER: 397, STONE_BUTTON: 398, STONE_PRESSURE_PLATE: 399,
  TRIPWIRE_HOOK: 400, DAYLIGHT_DETECTOR: 401, REPEATER: 402, COMPARATOR: 403,
  // Quartz blocks
  QUARTZ_BLOCK: 404, QUARTZ_PILLAR: 405, SMOOTH_QUARTZ: 406, CHISELED_QUARTZ: 407,
  // Glazed terracotta (decorative)
  WHITE_GLAZED_TERRACOTTA: 408, ORANGE_GLAZED_TERRACOTTA: 409, MAGENTA_GLAZED_TERRACOTTA: 410,
  // End rod & purpur stairs
  END_ROD: 411, PURPUR_STAIRS: 412, PURPUR_SLAB: 413,
  // Carpet
  WHITE_CARPET: 414, ORANGE_CARPET: 415, MAGENTA_CARPET: 416, LIGHT_BLUE_CARPET: 417,
  YELLOW_CARPET: 418, LIME_CARPET: 419, PINK_CARPET: 420, GRAY_CARPET: 421,
  CYAN_CARPET: 422, PURPLE_CARPET: 423, BLUE_CARPET: 424, BROWN_CARPET: 425,
  GREEN_CARPET: 426, RED_CARPET: 427, BLACK_CARPET: 428,
  // Banners
  WHITE_BANNER: 429,
  // Candles
  CANDLE: 430,
  // Sculk blocks
  SCULK: 431, SCULK_SENSOR: 432,
  // Misc items
  SHIELD: 433, TRIDENT: 434, CROSSBOW: 435, SPYGLASS: 436,
  BRUSH: 437, RECOVERY_COMPASS: 438, ECHO_SHARD: 439,
  // Pottery
  CLAY_BALL: 440, BRICK_ITEM: 441, FLOWER_POT: 442,
  // Armor stands & frames
  ARMOR_STAND: 443, ITEM_FRAME: 444, GLOW_ITEM_FRAME: 445,
  // Skulls
  SKELETON_SKULL: 446, WITHER_SKELETON_SKULL: 447, ZOMBIE_HEAD: 448, CREEPER_HEAD: 449, DRAGON_HEAD: 450,
  // End crystals
  END_CRYSTAL: 451,
  // Music discs
  MUSIC_DISC_13: 452, MUSIC_DISC_CAT: 453, MUSIC_DISC_BLOCKS: 454, MUSIC_DISC_CHIRP: 455,
  MUSIC_DISC_FAR: 456, MUSIC_DISC_MALL: 457, MUSIC_DISC_MELLOHI: 458, MUSIC_DISC_STAL: 459,
  MUSIC_DISC_STRAD: 460, MUSIC_DISC_WARD: 461, MUSIC_DISC_11: 462, MUSIC_DISC_WAIT: 463,
  MUSIC_DISC_PIGSTEP: 464, MUSIC_DISC_OTHERSIDE: 465,
};

// Tier colors for tool rendering
const TIER_COLORS = {
  wood: { head: '#b8924a', dark: '#8B6914' },
  stone: { head: '#999', dark: '#777' },
  iron: { head: '#e8e8e8', dark: '#bbb' },
  gold: { head: '#fcdb4a', dark: '#d4b030' },
  diamond: { head: '#5ce8e8', dark: '#3ab8b8' },
  netherite: { head: '#4a4a4a', dark: '#2a2a2a' },
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
  // Armor
  [B.LEATHER_HELMET]:     { name: "Leather Helmet",     solid: false, placeable: false, maxStack: 1, armor: 'helmet',     tier: 'leather',  defense: 1,   durability: 56 },
  [B.LEATHER_CHESTPLATE]: { name: "Leather Chestplate", solid: false, placeable: false, maxStack: 1, armor: 'chestplate', tier: 'leather',  defense: 3,   durability: 81 },
  [B.LEATHER_LEGGINGS]:   { name: "Leather Leggings",   solid: false, placeable: false, maxStack: 1, armor: 'leggings',   tier: 'leather',  defense: 2,   durability: 76 },
  [B.LEATHER_BOOTS]:      { name: "Leather Boots",      solid: false, placeable: false, maxStack: 1, armor: 'boots',      tier: 'leather',  defense: 1,   durability: 66 },
  [B.IRON_HELMET]:        { name: "Iron Helmet",        solid: false, placeable: false, maxStack: 1, armor: 'helmet',     tier: 'iron',     defense: 2,   durability: 166 },
  [B.IRON_CHESTPLATE]:    { name: "Iron Chestplate",    solid: false, placeable: false, maxStack: 1, armor: 'chestplate', tier: 'iron',     defense: 6,   durability: 241 },
  [B.IRON_LEGGINGS]:      { name: "Iron Leggings",      solid: false, placeable: false, maxStack: 1, armor: 'leggings',   tier: 'iron',     defense: 5,   durability: 226 },
  [B.IRON_BOOTS]:         { name: "Iron Boots",         solid: false, placeable: false, maxStack: 1, armor: 'boots',      tier: 'iron',     defense: 2,   durability: 196 },
  [B.GOLD_HELMET]:        { name: "Gold Helmet",        solid: false, placeable: false, maxStack: 1, armor: 'helmet',     tier: 'gold',     defense: 2,   durability: 78 },
  [B.GOLD_CHESTPLATE]:    { name: "Gold Chestplate",    solid: false, placeable: false, maxStack: 1, armor: 'chestplate', tier: 'gold',     defense: 5,   durability: 113 },
  [B.GOLD_LEGGINGS]:      { name: "Gold Leggings",      solid: false, placeable: false, maxStack: 1, armor: 'leggings',   tier: 'gold',     defense: 3,   durability: 106 },
  [B.GOLD_BOOTS]:         { name: "Gold Boots",         solid: false, placeable: false, maxStack: 1, armor: 'boots',      tier: 'gold',     defense: 1,   durability: 92 },
  [B.DIAMOND_HELMET]:     { name: "Diamond Helmet",     solid: false, placeable: false, maxStack: 1, armor: 'helmet',     tier: 'diamond',  defense: 3,   durability: 364 },
  [B.DIAMOND_CHESTPLATE]: { name: "Diamond Chestplate", solid: false, placeable: false, maxStack: 1, armor: 'chestplate', tier: 'diamond',  defense: 8,   durability: 529 },
  [B.DIAMOND_LEGGINGS]:   { name: "Diamond Leggings",   solid: false, placeable: false, maxStack: 1, armor: 'leggings',   tier: 'diamond',  defense: 6,   durability: 496 },
  [B.DIAMOND_BOOTS]:      { name: "Diamond Boots",      solid: false, placeable: false, maxStack: 1, armor: 'boots',      tier: 'diamond',  defense: 3,   durability: 430 },
  // Nether blocks
  [B.OBSIDIAN]:           { name: "Obsidian",         solid: true,  hardness: 50 },
  [B.NETHERRACK]:         { name: "Netherrack",       solid: true,  hardness: 0.5 },
  [B.SOUL_SAND]:          { name: "Soul Sand",        solid: true,  hardness: 1 },
  [B.GLOWSTONE]:          { name: "Glowstone",        solid: true,  hardness: 0.5 },
  [B.NETHER_BRICK]:       { name: "Nether Brick",     solid: true,  hardness: 3 },
  [B.NETHER_QUARTZ_ORE]:  { name: "Nether Quartz",    solid: true,  hardness: 4 },
  [B.NETHER_PORTAL]:      { name: "Nether Portal",    solid: false, hardness: -1 },
  [B.LAVA]:               { name: "Lava",             solid: false, hardness: -1 },
  // End blocks
  [B.END_STONE]:          { name: "End Stone",        solid: true,  hardness: 3 },
  [B.END_PORTAL]:         { name: "End Portal",       solid: false, hardness: -1 },
  [B.END_PORTAL_FRAME]:   { name: "End Portal Frame", solid: true,  hardness: -1 },
  // Nether/End items
  [B.FLINT]:              { name: "Flint",            solid: false, hardness: -1, placeable: false },
  [B.FLINT_AND_STEEL]:    { name: "Flint and Steel", solid: false, placeable: false, maxStack: 1, durability: 64 },
  [B.ENDER_PEARL]:        { name: "Ender Pearl",     solid: false, hardness: -1, placeable: false, maxStack: 16 },
  [B.BLAZE_ROD]:          { name: "Blaze Rod",       solid: false, hardness: -1, placeable: false },
  [B.BLAZE_POWDER]:       { name: "Blaze Powder",    solid: false, hardness: -1, placeable: false },
  [B.EYE_OF_ENDER]:       { name: "Eye of Ender",    solid: false, hardness: -1, placeable: false, maxStack: 16 },
  [B.GOLD_NUGGET]:        { name: "Gold Nugget",     solid: false, hardness: -1, placeable: false },
  [B.GHAST_TEAR]:         { name: "Ghast Tear",      solid: false, hardness: -1, placeable: false },
  [B.GRAVEL]:             { name: "Gravel",          solid: true,  hardness: 1, flintChance: 0.1 },
  // Ocean & Beach
  [B.CLAY]:               { name: "Clay",            solid: true,  hardness: 1 },
  [B.SANDSTONE]:          { name: "Sandstone",       solid: true,  hardness: 2 },
  [B.RED_SAND]:           { name: "Red Sand",        solid: true,  hardness: 1 },
  [B.RED_SANDSTONE]:      { name: "Red Sandstone",   solid: true,  hardness: 2 },
  [B.PRISMARINE]:         { name: "Prismarine",      solid: true,  hardness: 3 },
  [B.DARK_PRISMARINE]:    { name: "Dark Prismarine", solid: true,  hardness: 3 },
  [B.SEA_LANTERN]:        { name: "Sea Lantern",     solid: true,  hardness: 0.5 },
  [B.KELP]:               { name: "Kelp",            solid: false, hardness: 0 },
  [B.SEAGRASS]:           { name: "Seagrass",        solid: false, hardness: 0 },
  [B.CORAL_BLUE]:         { name: "Blue Coral",      solid: true,  hardness: 0 },
  [B.CORAL_PINK]:         { name: "Pink Coral",      solid: true,  hardness: 0 },
  [B.CORAL_PURPLE]:       { name: "Purple Coral",    solid: true,  hardness: 0 },
  [B.SPONGE]:             { name: "Sponge",          solid: true,  hardness: 1 },
  [B.WET_SPONGE]:         { name: "Wet Sponge",      solid: true,  hardness: 1 },
  // Ice
  [B.ICE]:                { name: "Ice",             solid: true,  hardness: 0.5 },
  [B.PACKED_ICE]:         { name: "Packed Ice",      solid: true,  hardness: 1 },
  [B.BLUE_ICE]:           { name: "Blue Ice",        solid: true,  hardness: 2 },
  // Stone variants
  [B.STONE_BRICK]:        { name: "Stone Brick",     solid: true,  hardness: 3 },
  [B.MOSSY_STONE_BRICK]:  { name: "Mossy Stone Brick", solid: true, hardness: 3 },
  [B.CRACKED_STONE_BRICK]:{ name: "Cracked Stone Brick", solid: true, hardness: 3 },
  [B.MOSSY_COBBLESTONE]:  { name: "Mossy Cobble",    solid: true,  hardness: 3 },
  [B.SMOOTH_STONE]:       { name: "Smooth Stone",    solid: true,  hardness: 3 },
  [B.ANDESITE]:           { name: "Andesite",        solid: true,  hardness: 3 },
  [B.DIORITE]:            { name: "Diorite",         solid: true,  hardness: 3 },
  [B.GRANITE]:            { name: "Granite",         solid: true,  hardness: 3 },
  [B.POLISHED_ANDESITE]:  { name: "Polished Andesite", solid: true, hardness: 3 },
  [B.POLISHED_DIORITE]:   { name: "Polished Diorite", solid: true, hardness: 3 },
  [B.POLISHED_GRANITE]:   { name: "Polished Granite", solid: true, hardness: 3 },
  // Deepslate
  [B.DEEPSLATE]:          { name: "Deepslate",       solid: true,  hardness: 4 },
  [B.COBBLED_DEEPSLATE]:  { name: "Cobbled Deepslate", solid: true, hardness: 4 },
  [B.DEEPSLATE_COAL_ORE]: { name: "Deepslate Coal",  solid: true,  hardness: 5 },
  [B.DEEPSLATE_IRON_ORE]: { name: "Deepslate Iron",  solid: true,  hardness: 6 },
  [B.DEEPSLATE_GOLD_ORE]: { name: "Deepslate Gold",  solid: true,  hardness: 6 },
  [B.DEEPSLATE_DIAMOND_ORE]: { name: "Deepslate Diamond", solid: true, hardness: 7 },
  [B.DEEPSLATE_COPPER_ORE]: { name: "Deepslate Copper", solid: true, hardness: 5 },
  [B.DEEPSLATE_EMERALD_ORE]: { name: "Deepslate Emerald", solid: true, hardness: 6 },
  [B.DEEPSLATE_LAPIS_ORE]: { name: "Deepslate Lapis", solid: true, hardness: 5 },
  [B.DEEPSLATE_REDSTONE_ORE]: { name: "Deepslate Redstone", solid: true, hardness: 5 },
  // More ores
  [B.EMERALD_ORE]:        { name: "Emerald Ore",     solid: true,  hardness: 5, drop: B.EMERALD },
  [B.LAPIS_ORE]:          { name: "Lapis Ore",       solid: true,  hardness: 4, drop: B.LAPIS },
  [B.REDSTONE_ORE]:       { name: "Redstone Ore",    solid: true,  hardness: 4, drop: B.REDSTONE },
  // Functional blocks
  [B.FURNACE]:            { name: "Furnace",         solid: true,  hardness: 4 },
  [B.CHEST]:              { name: "Chest",           solid: true,  hardness: 2 },
  [B.TNT]:                { name: "TNT",             solid: true,  hardness: 0 },
  [B.BOOKSHELF]:          { name: "Bookshelf",       solid: true,  hardness: 2 },
  [B.LADDER]:             { name: "Ladder",          solid: false, hardness: 1, climbable: true },
  [B.TORCH]:              { name: "Torch",           solid: false, hardness: 0 },
  [B.LANTERN]:            { name: "Lantern",         solid: false, hardness: 1 },
  [B.JACK_O_LANTERN]:     { name: "Jack O'Lantern",  solid: true,  hardness: 1 },
  // Nature
  [B.PUMPKIN]:            { name: "Pumpkin",         solid: true,  hardness: 1 },
  [B.MELON]:              { name: "Melon",           solid: true,  hardness: 1 },
  [B.HAY_BALE]:           { name: "Hay Bale",        solid: true,  hardness: 1 },
  [B.CACTUS]:             { name: "Cactus",          solid: true,  hardness: 0.5 },
  [B.SUGAR_CANE]:         { name: "Sugar Cane",      solid: false, hardness: 0 },
  [B.BAMBOO]:             { name: "Bamboo",          solid: false, hardness: 0 },
  [B.DEAD_BUSH]:          { name: "Dead Bush",       solid: false, hardness: 0 },
  [B.FERN]:               { name: "Fern",            solid: false, hardness: 0 },
  [B.TALL_GRASS]:         { name: "Tall Grass",      solid: false, hardness: 0 },
  // Wood variants
  [B.OAK_LOG]:            { name: "Oak Log",         solid: true,  hardness: 2 },
  [B.BIRCH_LOG]:          { name: "Birch Log",       solid: true,  hardness: 2 },
  [B.SPRUCE_LOG]:         { name: "Spruce Log",      solid: true,  hardness: 2 },
  [B.JUNGLE_LOG]:         { name: "Jungle Log",      solid: true,  hardness: 2 },
  [B.ACACIA_LOG]:         { name: "Acacia Log",      solid: true,  hardness: 2 },
  [B.DARK_OAK_LOG]:       { name: "Dark Oak Log",    solid: true,  hardness: 2 },
  [B.OAK_PLANKS]:         { name: "Oak Planks",      solid: true,  hardness: 2 },
  [B.BIRCH_PLANKS]:       { name: "Birch Planks",    solid: true,  hardness: 2 },
  [B.SPRUCE_PLANKS]:      { name: "Spruce Planks",   solid: true,  hardness: 2 },
  [B.JUNGLE_PLANKS]:      { name: "Jungle Planks",   solid: true,  hardness: 2 },
  [B.ACACIA_PLANKS]:      { name: "Acacia Planks",   solid: true,  hardness: 2 },
  [B.DARK_OAK_PLANKS]:    { name: "Dark Oak Planks", solid: true,  hardness: 2 },
  [B.OAK_LEAVES]:         { name: "Oak Leaves",      solid: true,  hardness: 0.5 },
  [B.BIRCH_LEAVES]:       { name: "Birch Leaves",    solid: true,  hardness: 0.5 },
  [B.SPRUCE_LEAVES]:      { name: "Spruce Leaves",   solid: true,  hardness: 0.5 },
  [B.JUNGLE_LEAVES]:      { name: "Jungle Leaves",   solid: true,  hardness: 0.5 },
  [B.ACACIA_LEAVES]:      { name: "Acacia Leaves",   solid: true,  hardness: 0.5 },
  [B.DARK_OAK_LEAVES]:    { name: "Dark Oak Leaves", solid: true,  hardness: 0.5 },
  // Terracotta
  [B.TERRACOTTA]:         { name: "Terracotta",      solid: true,  hardness: 3 },
  [B.WHITE_TERRACOTTA]:   { name: "White Terracotta", solid: true, hardness: 3 },
  [B.ORANGE_TERRACOTTA]:  { name: "Orange Terracotta", solid: true, hardness: 3 },
  [B.MAGENTA_TERRACOTTA]: { name: "Magenta Terracotta", solid: true, hardness: 3 },
  [B.LIGHT_BLUE_TERRACOTTA]: { name: "Light Blue Terracotta", solid: true, hardness: 3 },
  [B.YELLOW_TERRACOTTA]:  { name: "Yellow Terracotta", solid: true, hardness: 3 },
  [B.LIME_TERRACOTTA]:    { name: "Lime Terracotta", solid: true, hardness: 3 },
  [B.PINK_TERRACOTTA]:    { name: "Pink Terracotta", solid: true, hardness: 3 },
  [B.CYAN_TERRACOTTA]:    { name: "Cyan Terracotta", solid: true, hardness: 3 },
  [B.PURPLE_TERRACOTTA]:  { name: "Purple Terracotta", solid: true, hardness: 3 },
  [B.BLUE_TERRACOTTA]:    { name: "Blue Terracotta", solid: true, hardness: 3 },
  [B.BROWN_TERRACOTTA]:   { name: "Brown Terracotta", solid: true, hardness: 3 },
  [B.GREEN_TERRACOTTA]:   { name: "Green Terracotta", solid: true, hardness: 3 },
  [B.RED_TERRACOTTA]:     { name: "Red Terracotta",  solid: true, hardness: 3 },
  [B.BLACK_TERRACOTTA]:   { name: "Black Terracotta", solid: true, hardness: 3 },
  // Concrete
  [B.WHITE_CONCRETE]:     { name: "White Concrete",  solid: true,  hardness: 3 },
  [B.ORANGE_CONCRETE]:    { name: "Orange Concrete", solid: true,  hardness: 3 },
  [B.MAGENTA_CONCRETE]:   { name: "Magenta Concrete", solid: true, hardness: 3 },
  [B.LIGHT_BLUE_CONCRETE]: { name: "Light Blue Concrete", solid: true, hardness: 3 },
  [B.YELLOW_CONCRETE]:    { name: "Yellow Concrete", solid: true,  hardness: 3 },
  [B.LIME_CONCRETE]:      { name: "Lime Concrete",   solid: true,  hardness: 3 },
  [B.PINK_CONCRETE]:      { name: "Pink Concrete",   solid: true,  hardness: 3 },
  [B.GRAY_CONCRETE]:      { name: "Gray Concrete",   solid: true,  hardness: 3 },
  [B.CYAN_CONCRETE]:      { name: "Cyan Concrete",   solid: true,  hardness: 3 },
  [B.PURPLE_CONCRETE]:    { name: "Purple Concrete", solid: true,  hardness: 3 },
  [B.BLUE_CONCRETE]:      { name: "Blue Concrete",   solid: true,  hardness: 3 },
  [B.BROWN_CONCRETE]:     { name: "Brown Concrete",  solid: true,  hardness: 3 },
  [B.GREEN_CONCRETE]:     { name: "Green Concrete",  solid: true,  hardness: 3 },
  [B.RED_CONCRETE]:       { name: "Red Concrete",    solid: true,  hardness: 3 },
  [B.BLACK_CONCRETE]:     { name: "Black Concrete",  solid: true,  hardness: 3 },
  // Wool colors
  [B.WHITE_WOOL]:         { name: "White Wool",      solid: true,  hardness: 0.5 },
  [B.ORANGE_WOOL]:        { name: "Orange Wool",     solid: true,  hardness: 0.5 },
  [B.MAGENTA_WOOL]:       { name: "Magenta Wool",    solid: true,  hardness: 0.5 },
  [B.LIGHT_BLUE_WOOL]:    { name: "Light Blue Wool", solid: true,  hardness: 0.5 },
  [B.YELLOW_WOOL]:        { name: "Yellow Wool",     solid: true,  hardness: 0.5 },
  [B.LIME_WOOL]:          { name: "Lime Wool",       solid: true,  hardness: 0.5 },
  [B.PINK_WOOL]:          { name: "Pink Wool",       solid: true,  hardness: 0.5 },
  [B.GRAY_WOOL]:          { name: "Gray Wool",       solid: true,  hardness: 0.5 },
  [B.CYAN_WOOL]:          { name: "Cyan Wool",       solid: true,  hardness: 0.5 },
  [B.PURPLE_WOOL]:        { name: "Purple Wool",     solid: true,  hardness: 0.5 },
  [B.BLUE_WOOL]:          { name: "Blue Wool",       solid: true,  hardness: 0.5 },
  [B.BROWN_WOOL]:         { name: "Brown Wool",      solid: true,  hardness: 0.5 },
  [B.GREEN_WOOL]:         { name: "Green Wool",      solid: true,  hardness: 0.5 },
  [B.RED_WOOL]:           { name: "Red Wool",        solid: true,  hardness: 0.5 },
  [B.BLACK_WOOL]:         { name: "Black Wool",      solid: true,  hardness: 0.5 },
  // Nether additions
  [B.CRIMSON_NYLIUM]:     { name: "Crimson Nylium",  solid: true,  hardness: 1 },
  [B.WARPED_NYLIUM]:      { name: "Warped Nylium",   solid: true,  hardness: 1 },
  [B.CRIMSON_STEM]:       { name: "Crimson Stem",    solid: true,  hardness: 2 },
  [B.WARPED_STEM]:        { name: "Warped Stem",     solid: true,  hardness: 2 },
  [B.SHROOMLIGHT]:        { name: "Shroomlight",     solid: true,  hardness: 1 },
  [B.CRYING_OBSIDIAN]:    { name: "Crying Obsidian", solid: true,  hardness: 50 },
  [B.BASALT]:             { name: "Basalt",          solid: true,  hardness: 3 },
  [B.POLISHED_BASALT]:    { name: "Polished Basalt", solid: true,  hardness: 3 },
  [B.BLACKSTONE]:         { name: "Blackstone",      solid: true,  hardness: 3 },
  [B.POLISHED_BLACKSTONE]: { name: "Polished Blackstone", solid: true, hardness: 3 },
  [B.GILDED_BLACKSTONE]:  { name: "Gilded Blackstone", solid: true, hardness: 3 },
  [B.ANCIENT_DEBRIS]:     { name: "Ancient Debris",  solid: true,  hardness: 30 },
  [B.NETHERITE_BLOCK]:    { name: "Netherite Block", solid: true,  hardness: 50 },
  // End additions
  [B.PURPUR_BLOCK]:       { name: "Purpur Block",    solid: true,  hardness: 3 },
  [B.PURPUR_PILLAR]:      { name: "Purpur Pillar",   solid: true,  hardness: 3 },
  [B.END_BRICK]:          { name: "End Brick",       solid: true,  hardness: 3 },
  [B.CHORUS_PLANT]:       { name: "Chorus Plant",    solid: true,  hardness: 0.5 },
  [B.CHORUS_FLOWER]:      { name: "Chorus Flower",   solid: true,  hardness: 0.5 },
  // Misc blocks
  [B.MYCELIUM]:           { name: "Mycelium",        solid: true,  hardness: 1 },
  [B.PODZOL]:             { name: "Podzol",          solid: true,  hardness: 1 },
  [B.COARSE_DIRT]:        { name: "Coarse Dirt",     solid: true,  hardness: 1 },
  [B.ROOTED_DIRT]:        { name: "Rooted Dirt",     solid: true,  hardness: 1 },
  [B.MOSS_BLOCK]:         { name: "Moss Block",      solid: true,  hardness: 0.5 },
  [B.DRIPSTONE]:          { name: "Dripstone",       solid: true,  hardness: 3 },
  [B.CALCITE]:            { name: "Calcite",         solid: true,  hardness: 1 },
  [B.TUFF]:               { name: "Tuff",            solid: true,  hardness: 3 },
  [B.AMETHYST]:           { name: "Amethyst Block",  solid: true,  hardness: 3 },
  [B.COPPER_BLOCK]:       { name: "Copper Block",    solid: true,  hardness: 4 },
  [B.EXPOSED_COPPER]:     { name: "Exposed Copper",  solid: true,  hardness: 4 },
  [B.WEATHERED_COPPER]:   { name: "Weathered Copper", solid: true, hardness: 4 },
  [B.OXIDIZED_COPPER]:    { name: "Oxidized Copper", solid: true,  hardness: 4 },
  [B.RAW_IRON_BLOCK]:     { name: "Raw Iron Block",  solid: true,  hardness: 4 },
  [B.RAW_GOLD_BLOCK]:     { name: "Raw Gold Block",  solid: true,  hardness: 4 },
  [B.RAW_COPPER_BLOCK]:   { name: "Raw Copper Block", solid: true, hardness: 4 },
  [B.IRON_BLOCK]:         { name: "Iron Block",      solid: true,  hardness: 5 },
  [B.GOLD_BLOCK]:         { name: "Gold Block",      solid: true,  hardness: 4 },
  [B.DIAMOND_BLOCK]:      { name: "Diamond Block",   solid: true,  hardness: 5 },
  [B.EMERALD_BLOCK]:      { name: "Emerald Block",   solid: true,  hardness: 5 },
  [B.LAPIS_BLOCK]:        { name: "Lapis Block",     solid: true,  hardness: 4 },
  [B.REDSTONE_BLOCK]:     { name: "Redstone Block",  solid: true,  hardness: 4 },
  [B.COAL_BLOCK]:         { name: "Coal Block",      solid: true,  hardness: 4 },
  // Food
  [B.COOKED_PORK]:        { name: "Cooked Pork",     solid: false, placeable: false, food: 8 },
  [B.COOKED_BEEF]:        { name: "Steak",           solid: false, placeable: false, food: 8 },
  [B.COOKED_CHICKEN]:     { name: "Cooked Chicken",  solid: false, placeable: false, food: 6 },
  [B.BREAD]:              { name: "Bread",           solid: false, placeable: false, food: 5 },
  [B.APPLE]:              { name: "Apple",           solid: false, placeable: false, food: 4 },
  [B.GOLDEN_APPLE]:       { name: "Golden Apple",    solid: false, placeable: false, food: 4 },
  [B.ENCHANTED_GOLDEN_APPLE]: { name: "Enchanted Apple", solid: false, placeable: false, food: 4 },
  [B.CARROT]:             { name: "Carrot",          solid: false, placeable: false, food: 3 },
  [B.GOLDEN_CARROT]:      { name: "Golden Carrot",   solid: false, placeable: false, food: 6 },
  [B.POTATO]:             { name: "Potato",          solid: false, placeable: false, food: 1 },
  [B.BAKED_POTATO]:       { name: "Baked Potato",    solid: false, placeable: false, food: 5 },
  [B.BEETROOT]:           { name: "Beetroot",        solid: false, placeable: false, food: 1 },
  [B.MELON_SLICE]:        { name: "Melon Slice",     solid: false, placeable: false, food: 2 },
  [B.SWEET_BERRIES]:      { name: "Sweet Berries",   solid: false, placeable: false, food: 2 },
  [B.GLOW_BERRIES]:       { name: "Glow Berries",    solid: false, placeable: false, food: 2 },
  [B.COOKIE]:             { name: "Cookie",          solid: false, placeable: false, food: 2 },
  [B.CAKE]:               { name: "Cake",            solid: true,  hardness: 0.5 },
  [B.PUMPKIN_PIE]:        { name: "Pumpkin Pie",     solid: false, placeable: false, food: 8 },
  // Materials
  [B.EMERALD]:            { name: "Emerald",         solid: false, placeable: false },
  [B.LAPIS]:              { name: "Lapis Lazuli",    solid: false, placeable: false },
  [B.REDSTONE]:           { name: "Redstone",        solid: false, placeable: false },
  [B.QUARTZ]:             { name: "Quartz",          solid: false, placeable: false },
  [B.COAL]:               { name: "Coal",            solid: false, placeable: false },
  [B.CHARCOAL]:           { name: "Charcoal",        solid: false, placeable: false },
  [B.RAW_IRON]:           { name: "Raw Iron",        solid: false, placeable: false },
  [B.RAW_GOLD]:           { name: "Raw Gold",        solid: false, placeable: false },
  [B.RAW_COPPER]:         { name: "Raw Copper",      solid: false, placeable: false },
  [B.IRON_INGOT]:         { name: "Iron Ingot",      solid: false, placeable: false },
  [B.GOLD_INGOT]:         { name: "Gold Ingot",      solid: false, placeable: false },
  [B.COPPER_INGOT]:       { name: "Copper Ingot",    solid: false, placeable: false },
  [B.NETHERITE_INGOT]:    { name: "Netherite Ingot", solid: false, placeable: false },
  [B.DIAMOND]:            { name: "Diamond",         solid: false, placeable: false },
  [B.NETHERITE_SCRAP]:    { name: "Netherite Scrap", solid: false, placeable: false },
  // Netherite tools
  [B.NETHERITE_PICKAXE]:  { name: "Netherite Pickaxe", solid: false, placeable: false, maxStack: 1, tool: 'pickaxe', tier: 'netherite', miningSpeed: 6, attackDamage: 7, durability: 2031 },
  [B.NETHERITE_AXE]:      { name: "Netherite Axe",   solid: false, placeable: false, maxStack: 1, tool: 'axe', tier: 'netherite', miningSpeed: 6, attackDamage: 8, durability: 2031 },
  [B.NETHERITE_SWORD]:    { name: "Netherite Sword", solid: false, placeable: false, maxStack: 1, tool: 'sword', tier: 'netherite', miningSpeed: 1, attackDamage: 10, durability: 2031 },
  [B.NETHERITE_SHOVEL]:   { name: "Netherite Shovel", solid: false, placeable: false, maxStack: 1, tool: 'shovel', tier: 'netherite', miningSpeed: 6, attackDamage: 6, durability: 2031 },
  // Netherite armor
  [B.NETHERITE_HELMET]:   { name: "Netherite Helmet", solid: false, placeable: false, maxStack: 1, armor: 'helmet', tier: 'netherite', defense: 3, durability: 407 },
  [B.NETHERITE_CHESTPLATE]: { name: "Netherite Chestplate", solid: false, placeable: false, maxStack: 1, armor: 'chestplate', tier: 'netherite', defense: 8, durability: 592 },
  [B.NETHERITE_LEGGINGS]: { name: "Netherite Leggings", solid: false, placeable: false, maxStack: 1, armor: 'leggings', tier: 'netherite', defense: 6, durability: 555 },
  [B.NETHERITE_BOOTS]:    { name: "Netherite Boots", solid: false, placeable: false, maxStack: 1, armor: 'boots', tier: 'netherite', defense: 3, durability: 481 },
  // Misc
  [B.BONE]:               { name: "Bone",            solid: false, placeable: false },
  [B.BONE_BLOCK]:         { name: "Bone Block",      solid: true,  hardness: 3 },
  [B.SLIME_BLOCK]:        { name: "Slime Block",     solid: true,  hardness: 0 },
  [B.HONEY_BLOCK]:        { name: "Honey Block",     solid: true,  hardness: 0 },
  [B.DRIED_KELP]:         { name: "Dried Kelp",      solid: false, placeable: false, food: 1 },
  [B.DRIED_KELP_BLOCK]:   { name: "Dried Kelp Block", solid: true, hardness: 1 },
  [B.STRING]:             { name: "String",          solid: false, placeable: false },
  [B.COBWEB]:             { name: "Cobweb",          solid: false, hardness: 4 },
  [B.BUCKET]:             { name: "Bucket",          solid: false, placeable: false, maxStack: 16 },
  [B.WATER_BUCKET]:       { name: "Water Bucket",    solid: false, placeable: false, maxStack: 1 },
  [B.LAVA_BUCKET]:        { name: "Lava Bucket",     solid: false, placeable: false, maxStack: 1 },
  // Dyes
  [B.WHITE_DYE]:          { name: "White Dye",       solid: false, placeable: false },
  [B.ORANGE_DYE]:         { name: "Orange Dye",      solid: false, placeable: false },
  [B.MAGENTA_DYE]:        { name: "Magenta Dye",     solid: false, placeable: false },
  [B.LIGHT_BLUE_DYE]:     { name: "Light Blue Dye",  solid: false, placeable: false },
  [B.YELLOW_DYE]:         { name: "Yellow Dye",      solid: false, placeable: false },
  [B.LIME_DYE]:           { name: "Lime Dye",        solid: false, placeable: false },
  [B.PINK_DYE]:           { name: "Pink Dye",        solid: false, placeable: false },
  [B.GRAY_DYE]:           { name: "Gray Dye",        solid: false, placeable: false },
  [B.CYAN_DYE]:           { name: "Cyan Dye",        solid: false, placeable: false },
  [B.PURPLE_DYE]:         { name: "Purple Dye",      solid: false, placeable: false },
  [B.BLUE_DYE]:           { name: "Blue Dye",        solid: false, placeable: false },
  [B.BROWN_DYE]:          { name: "Brown Dye",       solid: false, placeable: false },
  [B.GREEN_DYE]:          { name: "Green Dye",       solid: false, placeable: false },
  [B.RED_DYE]:            { name: "Red Dye",         solid: false, placeable: false },
  [B.BLACK_DYE]:          { name: "Black Dye",       solid: false, placeable: false },
  // More items
  [B.GUNPOWDER]:          { name: "Gunpowder",       solid: false, placeable: false },
  [B.SLIMEBALL]:          { name: "Slimeball",       solid: false, placeable: false },
  [B.HONEYCOMB]:          { name: "Honeycomb",       solid: false, placeable: false },
  [B.INK_SAC]:            { name: "Ink Sac",         solid: false, placeable: false },
  [B.PAPER]:              { name: "Paper",           solid: false, placeable: false },
  [B.BOOK]:               { name: "Book",            solid: false, placeable: false },
  [B.ARROW]:              { name: "Arrow",           solid: false, placeable: false },
  [B.BOW]:                { name: "Bow",             solid: false, placeable: false, maxStack: 1, tool: 'bow', attackDamage: 6, durability: 384 },
  [B.FISHING_ROD]:        { name: "Fishing Rod",     solid: false, placeable: false, maxStack: 1, durability: 64 },
  [B.COMPASS]:            { name: "Compass",         solid: false, placeable: false },
  [B.CLOCK]:              { name: "Clock",           solid: false, placeable: false },
  [B.MAP]:                { name: "Map",             solid: false, placeable: false },
  [B.SHEARS]:             { name: "Shears",          solid: false, placeable: false, maxStack: 1, tool: 'shears', miningSpeed: 5, durability: 238 },
  [B.LEAD]:               { name: "Lead",            solid: false, placeable: false },
  // More blocks
  [B.TNT]:                { name: "TNT",             solid: true, hardness: 0.5 },
  [B.NOTE_BLOCK]:         { name: "Note Block",      solid: true, hardness: 1 },
  [B.JUKEBOX]:            { name: "Jukebox",         solid: true, hardness: 2 },
  [B.ENCHANTING_TABLE]:   { name: "Enchant Table",   solid: true, hardness: 5 },
  [B.ANVIL]:              { name: "Anvil",           solid: true, hardness: 5 },
  [B.BREWING_STAND]:      { name: "Brewing Stand",   solid: true, hardness: 1 },
  [B.CAULDRON]:           { name: "Cauldron",        solid: true, hardness: 2 },
  [B.HOPPER]:             { name: "Hopper",          solid: true, hardness: 3 },
  [B.RAIL]:               { name: "Rail",            solid: false, hardness: 0.5 },
  [B.POWERED_RAIL]:       { name: "Powered Rail",    solid: false, hardness: 0.5 },
  [B.DETECTOR_RAIL]:      { name: "Detector Rail",   solid: false, hardness: 0.5 },
  [B.PISTON]:             { name: "Piston",          solid: true, hardness: 1.5 },
  [B.STICKY_PISTON]:      { name: "Sticky Piston",   solid: true, hardness: 1.5 },
  [B.OBSERVER]:           { name: "Observer",        solid: true, hardness: 3 },
  [B.DISPENSER]:          { name: "Dispenser",       solid: true, hardness: 3.5 },
  [B.DROPPER]:            { name: "Dropper",         solid: true, hardness: 3.5 },
  [B.GLASS_PANE]:         { name: "Glass Pane",      solid: true, hardness: 0.3 },
  [B.IRON_BARS]:          { name: "Iron Bars",       solid: true, hardness: 5 },
  // Flowers
  [B.DANDELION]:          { name: "Dandelion",       solid: false, hardness: 0 },
  [B.POPPY]:              { name: "Poppy",           solid: false, hardness: 0 },
  [B.BLUE_ORCHID]:        { name: "Blue Orchid",     solid: false, hardness: 0 },
  [B.ALLIUM]:             { name: "Allium",          solid: false, hardness: 0 },
  [B.AZURE_BLUET]:        { name: "Azure Bluet",     solid: false, hardness: 0 },
  [B.RED_TULIP]:          { name: "Red Tulip",       solid: false, hardness: 0 },
  [B.ORANGE_TULIP]:       { name: "Orange Tulip",    solid: false, hardness: 0 },
  [B.WHITE_TULIP]:        { name: "White Tulip",     solid: false, hardness: 0 },
  [B.PINK_TULIP]:         { name: "Pink Tulip",      solid: false, hardness: 0 },
  [B.OXEYE_DAISY]:        { name: "Oxeye Daisy",     solid: false, hardness: 0 },
  [B.CORNFLOWER]:         { name: "Cornflower",      solid: false, hardness: 0 },
  [B.LILY_OF_VALLEY]:     { name: "Lily of Valley",  solid: false, hardness: 0 },
  [B.SUNFLOWER]:          { name: "Sunflower",       solid: false, hardness: 0 },
  [B.LILAC]:              { name: "Lilac",           solid: false, hardness: 0 },
  [B.ROSE_BUSH]:          { name: "Rose Bush",       solid: false, hardness: 0 },
  [B.PEONY]:              { name: "Peony",           solid: false, hardness: 0 },
  [B.WITHER_ROSE]:        { name: "Wither Rose",     solid: false, hardness: 0 },
  // Beds
  [B.WHITE_BED]:          { name: "White Bed",       solid: true, hardness: 0.2, maxStack: 1 },
  [B.ORANGE_BED]:         { name: "Orange Bed",      solid: true, hardness: 0.2, maxStack: 1 },
  [B.MAGENTA_BED]:        { name: "Magenta Bed",     solid: true, hardness: 0.2, maxStack: 1 },
  [B.LIGHT_BLUE_BED]:     { name: "Light Blue Bed",  solid: true, hardness: 0.2, maxStack: 1 },
  [B.YELLOW_BED]:         { name: "Yellow Bed",      solid: true, hardness: 0.2, maxStack: 1 },
  [B.LIME_BED]:           { name: "Lime Bed",        solid: true, hardness: 0.2, maxStack: 1 },
  [B.PINK_BED]:           { name: "Pink Bed",        solid: true, hardness: 0.2, maxStack: 1 },
  [B.GRAY_BED]:           { name: "Gray Bed",        solid: true, hardness: 0.2, maxStack: 1 },
  [B.CYAN_BED]:           { name: "Cyan Bed",        solid: true, hardness: 0.2, maxStack: 1 },
  [B.PURPLE_BED]:         { name: "Purple Bed",      solid: true, hardness: 0.2, maxStack: 1 },
  [B.BLUE_BED]:           { name: "Blue Bed",        solid: true, hardness: 0.2, maxStack: 1 },
  [B.BROWN_BED]:          { name: "Brown Bed",       solid: true, hardness: 0.2, maxStack: 1 },
  [B.GREEN_BED]:          { name: "Green Bed",       solid: true, hardness: 0.2, maxStack: 1 },
  [B.RED_BED]:            { name: "Red Bed",         solid: true, hardness: 0.2, maxStack: 1 },
  [B.BLACK_BED]:          { name: "Black Bed",       solid: true, hardness: 0.2, maxStack: 1 },
  // Doors
  [B.OAK_DOOR]:           { name: "Oak Door",        solid: true, hardness: 3, maxStack: 1 },
  [B.BIRCH_DOOR]:         { name: "Birch Door",      solid: true, hardness: 3, maxStack: 1 },
  [B.SPRUCE_DOOR]:        { name: "Spruce Door",     solid: true, hardness: 3, maxStack: 1 },
  [B.JUNGLE_DOOR]:        { name: "Jungle Door",     solid: true, hardness: 3, maxStack: 1 },
  [B.ACACIA_DOOR]:        { name: "Acacia Door",     solid: true, hardness: 3, maxStack: 1 },
  [B.DARK_OAK_DOOR]:      { name: "Dark Oak Door",   solid: true, hardness: 3, maxStack: 1 },
  [B.IRON_DOOR]:          { name: "Iron Door",       solid: true, hardness: 5, maxStack: 1 },
  [B.CRIMSON_DOOR]:       { name: "Crimson Door",    solid: true, hardness: 3, maxStack: 1 },
  [B.WARPED_DOOR]:        { name: "Warped Door",     solid: true, hardness: 3, maxStack: 1 },
  // Trapdoors
  [B.OAK_TRAPDOOR]:       { name: "Oak Trapdoor",    solid: true, hardness: 3 },
  [B.IRON_TRAPDOOR]:      { name: "Iron Trapdoor",   solid: true, hardness: 5 },
  // Fences & Gates
  [B.OAK_FENCE]:          { name: "Oak Fence",       solid: true, hardness: 2 },
  [B.OAK_FENCE_GATE]:     { name: "Oak Fence Gate",  solid: true, hardness: 2 },
  [B.NETHER_BRICK_FENCE]: { name: "Nether Fence",    solid: true, hardness: 2 },
  // Signs
  [B.OAK_SIGN]:           { name: "Oak Sign",        solid: false, hardness: 1 },
  // Boats & Minecarts
  [B.OAK_BOAT]:           { name: "Oak Boat",        solid: false, placeable: false, maxStack: 1 },
  [B.MINECART]:           { name: "Minecart",        solid: false, placeable: false, maxStack: 1 },
  [B.CHEST_MINECART]:     { name: "Chest Minecart",  solid: false, placeable: false, maxStack: 1 },
  [B.HOPPER_MINECART]:    { name: "Hopper Minecart", solid: false, placeable: false, maxStack: 1 },
  [B.TNT_MINECART]:       { name: "TNT Minecart",    solid: false, placeable: false, maxStack: 1 },
  // Redstone items
  [B.REDSTONE_TORCH]:     { name: "Redstone Torch",  solid: false, hardness: 0 },
  [B.LEVER]:              { name: "Lever",           solid: false, hardness: 0.5 },
  [B.STONE_BUTTON]:       { name: "Stone Button",    solid: false, hardness: 0.5 },
  [B.STONE_PRESSURE_PLATE]: { name: "Stone Plate",   solid: false, hardness: 0.5 },
  [B.TRIPWIRE_HOOK]:      { name: "Tripwire Hook",   solid: false, hardness: 0 },
  [B.DAYLIGHT_DETECTOR]:  { name: "Daylight Detect", solid: true, hardness: 0.2 },
  [B.REPEATER]:           { name: "Repeater",        solid: false, hardness: 0 },
  [B.COMPARATOR]:         { name: "Comparator",      solid: false, hardness: 0 },
  // Quartz blocks
  [B.QUARTZ_BLOCK]:       { name: "Quartz Block",    solid: true, hardness: 0.8 },
  [B.QUARTZ_PILLAR]:      { name: "Quartz Pillar",   solid: true, hardness: 0.8 },
  [B.SMOOTH_QUARTZ]:      { name: "Smooth Quartz",   solid: true, hardness: 0.8 },
  [B.CHISELED_QUARTZ]:    { name: "Chiseled Quartz", solid: true, hardness: 0.8 },
  // Glazed terracotta
  [B.WHITE_GLAZED_TERRACOTTA]:   { name: "White Glazed",   solid: true, hardness: 1.4 },
  [B.ORANGE_GLAZED_TERRACOTTA]:  { name: "Orange Glazed",  solid: true, hardness: 1.4 },
  [B.MAGENTA_GLAZED_TERRACOTTA]: { name: "Magenta Glazed", solid: true, hardness: 1.4 },
  // End rod & purpur
  [B.END_ROD]:            { name: "End Rod",         solid: false, hardness: 0 },
  [B.PURPUR_STAIRS]:      { name: "Purpur Stairs",   solid: true, hardness: 1.5 },
  [B.PURPUR_SLAB]:        { name: "Purpur Slab",     solid: true, hardness: 1.5 },
  // Carpets
  [B.WHITE_CARPET]:       { name: "White Carpet",    solid: false, hardness: 0.1 },
  [B.ORANGE_CARPET]:      { name: "Orange Carpet",   solid: false, hardness: 0.1 },
  [B.MAGENTA_CARPET]:     { name: "Magenta Carpet",  solid: false, hardness: 0.1 },
  [B.LIGHT_BLUE_CARPET]:  { name: "L.Blue Carpet",   solid: false, hardness: 0.1 },
  [B.YELLOW_CARPET]:      { name: "Yellow Carpet",   solid: false, hardness: 0.1 },
  [B.LIME_CARPET]:        { name: "Lime Carpet",     solid: false, hardness: 0.1 },
  [B.PINK_CARPET]:        { name: "Pink Carpet",     solid: false, hardness: 0.1 },
  [B.GRAY_CARPET]:        { name: "Gray Carpet",     solid: false, hardness: 0.1 },
  [B.CYAN_CARPET]:        { name: "Cyan Carpet",     solid: false, hardness: 0.1 },
  [B.PURPLE_CARPET]:      { name: "Purple Carpet",   solid: false, hardness: 0.1 },
  [B.BLUE_CARPET]:        { name: "Blue Carpet",     solid: false, hardness: 0.1 },
  [B.BROWN_CARPET]:       { name: "Brown Carpet",    solid: false, hardness: 0.1 },
  [B.GREEN_CARPET]:       { name: "Green Carpet",    solid: false, hardness: 0.1 },
  [B.RED_CARPET]:         { name: "Red Carpet",      solid: false, hardness: 0.1 },
  [B.BLACK_CARPET]:       { name: "Black Carpet",    solid: false, hardness: 0.1 },
  // Banner
  [B.WHITE_BANNER]:       { name: "White Banner",    solid: false, hardness: 1 },
  // Candle
  [B.CANDLE]:             { name: "Candle",          solid: false, hardness: 0.1 },
  // Sculk
  [B.SCULK]:              { name: "Sculk",           solid: true, hardness: 0.2 },
  [B.SCULK_SENSOR]:       { name: "Sculk Sensor",    solid: true, hardness: 1.5 },
  // Misc items
  [B.SHIELD]:             { name: "Shield",          solid: false, placeable: false, maxStack: 1, defense: 5, durability: 336 },
  [B.TRIDENT]:            { name: "Trident",         solid: false, placeable: false, maxStack: 1, tool: 'trident', attackDamage: 9, durability: 250 },
  [B.CROSSBOW]:           { name: "Crossbow",        solid: false, placeable: false, maxStack: 1, tool: 'crossbow', attackDamage: 9, durability: 465 },
  [B.SPYGLASS]:           { name: "Spyglass",        solid: false, placeable: false },
  [B.BRUSH]:              { name: "Brush",           solid: false, placeable: false, maxStack: 1, durability: 64 },
  [B.RECOVERY_COMPASS]:   { name: "Recovery Compass", solid: false, placeable: false },
  [B.ECHO_SHARD]:         { name: "Echo Shard",      solid: false, placeable: false },
  // Pottery
  [B.CLAY_BALL]:          { name: "Clay Ball",       solid: false, placeable: false },
  [B.BRICK_ITEM]:         { name: "Brick",           solid: false, placeable: false },
  [B.FLOWER_POT]:         { name: "Flower Pot",      solid: true, hardness: 0 },
  // Frames & stands
  [B.ARMOR_STAND]:        { name: "Armor Stand",     solid: false, placeable: false },
  [B.ITEM_FRAME]:         { name: "Item Frame",      solid: false, hardness: 0 },
  [B.GLOW_ITEM_FRAME]:    { name: "Glow Frame",      solid: false, hardness: 0 },
  // Skulls
  [B.SKELETON_SKULL]:     { name: "Skeleton Skull",  solid: false, hardness: 1 },
  [B.WITHER_SKELETON_SKULL]: { name: "Wither Skull", solid: false, hardness: 1 },
  [B.ZOMBIE_HEAD]:        { name: "Zombie Head",     solid: false, hardness: 1 },
  [B.CREEPER_HEAD]:       { name: "Creeper Head",    solid: false, hardness: 1 },
  [B.DRAGON_HEAD]:        { name: "Dragon Head",     solid: false, hardness: 1 },
  // End crystal
  [B.END_CRYSTAL]:        { name: "End Crystal",     solid: false, placeable: false },
  // Music discs
  [B.MUSIC_DISC_13]:      { name: "Disc 13",         solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_CAT]:     { name: "Disc Cat",        solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_BLOCKS]:  { name: "Disc Blocks",     solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_CHIRP]:   { name: "Disc Chirp",      solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_FAR]:     { name: "Disc Far",        solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_MALL]:    { name: "Disc Mall",       solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_MELLOHI]: { name: "Disc Mellohi",    solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_STAL]:    { name: "Disc Stal",       solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_STRAD]:   { name: "Disc Strad",      solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_WARD]:    { name: "Disc Ward",       solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_11]:      { name: "Disc 11",         solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_WAIT]:    { name: "Disc Wait",       solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_PIGSTEP]: { name: "Disc Pigstep",    solid: false, placeable: false, maxStack: 1 },
  [B.MUSIC_DISC_OTHERSIDE]: { name: "Disc Otherside", solid: false, placeable: false, maxStack: 1 },
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

  // Pickaxe targets: stone, ores, bricks, metal blocks, etc.
  const pickTargets = [
    B.STONE, B.COBBLESTONE, B.COAL_ORE, B.IRON_ORE, B.GOLD_ORE, B.DIAMOND_ORE, B.COPPER_ORE, B.BRICK, B.OBSIDIAN,
    B.NETHERRACK, B.NETHER_BRICK, B.NETHER_QUARTZ_ORE, B.END_STONE, B.GLOWSTONE,
    // Stone variants
    B.STONE_BRICK, B.MOSSY_STONE_BRICK, B.CRACKED_STONE_BRICK, B.MOSSY_COBBLESTONE, B.SMOOTH_STONE,
    B.ANDESITE, B.DIORITE, B.GRANITE, B.POLISHED_ANDESITE, B.POLISHED_DIORITE, B.POLISHED_GRANITE,
    // Deepslate
    B.DEEPSLATE, B.COBBLED_DEEPSLATE, B.DEEPSLATE_COAL_ORE, B.DEEPSLATE_IRON_ORE, B.DEEPSLATE_GOLD_ORE,
    B.DEEPSLATE_DIAMOND_ORE, B.DEEPSLATE_COPPER_ORE, B.DEEPSLATE_EMERALD_ORE, B.DEEPSLATE_LAPIS_ORE, B.DEEPSLATE_REDSTONE_ORE,
    // More ores
    B.EMERALD_ORE, B.LAPIS_ORE, B.REDSTONE_ORE,
    // Ocean/ice
    B.SANDSTONE, B.RED_SANDSTONE, B.PRISMARINE, B.DARK_PRISMARINE, B.SEA_LANTERN,
    B.ICE, B.PACKED_ICE, B.BLUE_ICE,
    // Nether additions
    B.BASALT, B.POLISHED_BASALT, B.BLACKSTONE, B.POLISHED_BLACKSTONE, B.GILDED_BLACKSTONE,
    B.ANCIENT_DEBRIS, B.NETHERITE_BLOCK, B.CRYING_OBSIDIAN,
    // End additions
    B.PURPUR_BLOCK, B.PURPUR_PILLAR, B.END_BRICK,
    // Misc stone-like
    B.DRIPSTONE, B.CALCITE, B.TUFF, B.AMETHYST, B.BONE_BLOCK,
    // Terracotta (all colors)
    B.TERRACOTTA, B.WHITE_TERRACOTTA, B.ORANGE_TERRACOTTA, B.MAGENTA_TERRACOTTA, B.LIGHT_BLUE_TERRACOTTA,
    B.YELLOW_TERRACOTTA, B.LIME_TERRACOTTA, B.PINK_TERRACOTTA, B.CYAN_TERRACOTTA, B.PURPLE_TERRACOTTA,
    B.BLUE_TERRACOTTA, B.BROWN_TERRACOTTA, B.GREEN_TERRACOTTA, B.RED_TERRACOTTA, B.BLACK_TERRACOTTA,
    // Concrete (all colors)
    B.WHITE_CONCRETE, B.ORANGE_CONCRETE, B.MAGENTA_CONCRETE, B.LIGHT_BLUE_CONCRETE, B.YELLOW_CONCRETE,
    B.LIME_CONCRETE, B.PINK_CONCRETE, B.GRAY_CONCRETE, B.CYAN_CONCRETE, B.PURPLE_CONCRETE,
    B.BLUE_CONCRETE, B.BROWN_CONCRETE, B.GREEN_CONCRETE, B.RED_CONCRETE, B.BLACK_CONCRETE,
    // Metal blocks
    B.COPPER_BLOCK, B.EXPOSED_COPPER, B.WEATHERED_COPPER, B.OXIDIZED_COPPER,
    B.RAW_IRON_BLOCK, B.RAW_GOLD_BLOCK, B.RAW_COPPER_BLOCK,
    B.IRON_BLOCK, B.GOLD_BLOCK, B.DIAMOND_BLOCK, B.EMERALD_BLOCK, B.LAPIS_BLOCK, B.REDSTONE_BLOCK, B.COAL_BLOCK,
    // Functional
    B.FURNACE, B.LANTERN
  ];
  // Axe targets: wood, leaves, plants
  const axeTargets = [
    B.WOOD, B.PLANKS, B.LEAVES, B.CRAFT_TABLE,
    // Wood variants
    B.OAK_LOG, B.BIRCH_LOG, B.SPRUCE_LOG, B.JUNGLE_LOG, B.ACACIA_LOG, B.DARK_OAK_LOG,
    B.OAK_PLANKS, B.BIRCH_PLANKS, B.SPRUCE_PLANKS, B.JUNGLE_PLANKS, B.ACACIA_PLANKS, B.DARK_OAK_PLANKS,
    B.OAK_LEAVES, B.BIRCH_LEAVES, B.SPRUCE_LEAVES, B.JUNGLE_LEAVES, B.ACACIA_LEAVES, B.DARK_OAK_LEAVES,
    // Nether wood
    B.CRIMSON_STEM, B.WARPED_STEM,
    // Nature
    B.PUMPKIN, B.MELON, B.HAY_BALE, B.BAMBOO, B.JACK_O_LANTERN,
    // Misc wood
    B.BOOKSHELF, B.LADDER, B.CHEST, B.DRIED_KELP_BLOCK
  ];
  // Shovel targets: dirt, sand, gravel, soft blocks
  const shovelTargets = [
    B.DIRT, B.GRASS, B.SAND, B.SNOW, B.SOUL_SAND, B.GRAVEL,
    B.CLAY, B.RED_SAND,
    // Dirt variants
    B.COARSE_DIRT, B.ROOTED_DIRT, B.PODZOL, B.MYCELIUM, B.MOSS_BLOCK,
    // Nether
    B.CRIMSON_NYLIUM, B.WARPED_NYLIUM
  ];

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

// Armor tier colors
const ARMOR_COLORS = {
  leather: { main: '#A0703C', dark: '#7A4A1B', light: '#C89060' },
  iron:    { main: '#e8e8e8', dark: '#aaa',    light: '#fff' },
  gold:    { main: '#fcdb4a', dark: '#d4b030', light: '#ffe880' },
  diamond: { main: '#5ce8e8', dark: '#3ab8b8', light: '#a0ffff' },
  netherite: { main: '#4a4a4a', dark: '#2a2a2a', light: '#6a6a6a' },
};

function drawArmorIcon(x, y, s, armorType, tier) {
  const c = ARMOR_COLORS[tier];

  switch (armorType) {
    case 'helmet':
      // Main dome
      ctx.fillStyle = c.main;
      ctx.fillRect(x + s*0.15, y + s*0.25, s*0.7, s*0.55);
      // Top curve
      ctx.fillRect(x + s*0.25, y + s*0.15, s*0.5, s*0.15);
      // Visor opening
      ctx.fillStyle = '#333';
      ctx.fillRect(x + s*0.25, y + s*0.55, s*0.5, s*0.15);
      // Highlight
      ctx.fillStyle = c.light;
      ctx.fillRect(x + s*0.2, y + s*0.2, s*0.15, s*0.25);
      // Dark edge
      ctx.fillStyle = c.dark;
      ctx.fillRect(x + s*0.15, y + s*0.7, s*0.7, s*0.1);
      break;

    case 'chestplate':
      // Main body
      ctx.fillStyle = c.main;
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.8, s*0.8);
      // Neck opening
      ctx.fillStyle = '#666';
      ctx.fillRect(x + s*0.35, y + s*0.05, s*0.3, s*0.15);
      // Arm holes
      ctx.fillStyle = '#666';
      ctx.fillRect(x + s*0.05, y + s*0.15, s*0.1, s*0.35);
      ctx.fillRect(x + s*0.85, y + s*0.15, s*0.1, s*0.35);
      // Chest detail
      ctx.fillStyle = c.dark;
      ctx.fillRect(x + s*0.2, y + s*0.25, s*0.6, s*0.08);
      ctx.fillRect(x + s*0.45, y + s*0.25, s*0.1, s*0.55);
      // Highlight
      ctx.fillStyle = c.light;
      ctx.fillRect(x + s*0.15, y + s*0.12, s*0.2, s*0.1);
      break;

    case 'leggings':
      // Waist
      ctx.fillStyle = c.main;
      ctx.fillRect(x + s*0.15, y + s*0.05, s*0.7, s*0.25);
      // Left leg
      ctx.fillRect(x + s*0.15, y + s*0.25, s*0.3, s*0.7);
      // Right leg
      ctx.fillRect(x + s*0.55, y + s*0.25, s*0.3, s*0.7);
      // Belt
      ctx.fillStyle = c.dark;
      ctx.fillRect(x + s*0.15, y + s*0.1, s*0.7, s*0.08);
      // Knee detail
      ctx.fillRect(x + s*0.2, y + s*0.55, s*0.2, s*0.08);
      ctx.fillRect(x + s*0.6, y + s*0.55, s*0.2, s*0.08);
      // Highlight
      ctx.fillStyle = c.light;
      ctx.fillRect(x + s*0.18, y + s*0.3, s*0.1, s*0.2);
      ctx.fillRect(x + s*0.58, y + s*0.3, s*0.1, s*0.2);
      break;

    case 'boots':
      // Left boot
      ctx.fillStyle = c.main;
      ctx.fillRect(x + s*0.08, y + s*0.15, s*0.35, s*0.55);
      ctx.fillRect(x + s*0.08, y + s*0.6, s*0.42, s*0.25);
      // Right boot
      ctx.fillRect(x + s*0.57, y + s*0.15, s*0.35, s*0.55);
      ctx.fillRect(x + s*0.5, y + s*0.6, s*0.42, s*0.25);
      // Boot tops
      ctx.fillStyle = c.dark;
      ctx.fillRect(x + s*0.08, y + s*0.15, s*0.35, s*0.1);
      ctx.fillRect(x + s*0.57, y + s*0.15, s*0.35, s*0.1);
      // Sole
      ctx.fillRect(x + s*0.08, y + s*0.78, s*0.42, s*0.07);
      ctx.fillRect(x + s*0.5, y + s*0.78, s*0.42, s*0.07);
      // Highlight
      ctx.fillStyle = c.light;
      ctx.fillRect(x + s*0.12, y + s*0.28, s*0.1, s*0.15);
      ctx.fillRect(x + s*0.62, y + s*0.28, s*0.1, s*0.15);
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

  // Armor items - render with armor icon and return (no border)
  if (toolInfo && toolInfo.armor) {
    drawArmorIcon(x, y, s, toolInfo.armor, toolInfo.tier);
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
    // === NETHER BLOCKS ===
    case B.OBSIDIAN:
      ctx.fillStyle = '#1a0a2e';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#2a1a4e';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.3, s*0.3);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.35, s*0.35);
      ctx.fillStyle = '#3a2a6e';
      ctx.fillRect(x + s*0.15, y + s*0.55, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.6, y + s*0.15, s*0.25, s*0.25);
      break;
    case B.NETHERRACK:
      ctx.fillStyle = '#6a2020';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#7a3030';
      ctx.fillRect(x + s*0.1, y + s*0.15, s*0.35, s*0.3);
      ctx.fillRect(x + s*0.5, y + s*0.55, s*0.4, s*0.35);
      ctx.fillStyle = '#5a1515';
      ctx.fillRect(x + s*0.55, y + s*0.1, s*0.3, s*0.25);
      ctx.fillRect(x + s*0.05, y + s*0.6, s*0.25, s*0.25);
      break;
    case B.SOUL_SAND:
      ctx.fillStyle = '#5a4a3a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#4a3a2a';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.25, s*0.25);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.3, s*0.3);
      // Faces in soul sand
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(x + s*0.2, y + s*0.25, s*0.06, s*0.08);
      ctx.fillRect(x + s*0.32, y + s*0.25, s*0.06, s*0.08);
      ctx.fillRect(x + s*0.24, y + s*0.35, s*0.12, s*0.05);
      break;
    case B.GLOWSTONE:
      ctx.fillStyle = '#e8c858';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#f8e088';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.35, s*0.35);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.4, s*0.4);
      ctx.fillStyle = '#c8a838';
      ctx.fillRect(x + s*0.5, y + s*0.1, s*0.35, s*0.3);
      ctx.fillRect(x + s*0.1, y + s*0.55, s*0.3, s*0.35);
      break;
    case B.NETHER_BRICK:
      ctx.fillStyle = '#3a1a1a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#2a0a0a';
      ctx.fillRect(x, y + s*0.24, s, s*0.04);
      ctx.fillRect(x, y + s*0.52, s, s*0.04);
      ctx.fillRect(x, y + s*0.76, s, s*0.04);
      ctx.fillRect(x + s*0.5, y, s*0.04, s*0.24);
      ctx.fillRect(x + s*0.25, y + s*0.28, s*0.04, s*0.24);
      break;
    case B.NETHER_QUARTZ_ORE:
      ctx.fillStyle = '#6a2020';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#f0e8e0';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.25, s*0.25);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.3, s*0.25);
      ctx.fillStyle = '#e8d8d0';
      ctx.fillRect(x + s*0.5, y + s*0.15, s*0.2, s*0.15);
      break;
    case B.NETHER_PORTAL:
      ctx.fillStyle = 'rgba(128, 0, 255, 0.7)';
      ctx.fillRect(x, y, s, s);
      // Swirling effect
      const portalTime = Date.now() * 0.003;
      ctx.fillStyle = 'rgba(200, 100, 255, 0.5)';
      for (let i = 0; i < 3; i++) {
        const px = x + s * (0.3 + Math.sin(portalTime + i) * 0.2);
        const py = y + s * (0.2 + i * 0.25);
        ctx.fillRect(px, py, s * 0.4, s * 0.15);
      }
      break;
    case B.LAVA:
      ctx.fillStyle = '#d04000';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#f06000';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.4, s*0.35);
      ctx.fillRect(x + s*0.45, y + s*0.5, s*0.45, s*0.4);
      ctx.fillStyle = '#ff8020';
      ctx.fillRect(x + s*0.2, y + s*0.2, s*0.2, s*0.15);
      ctx.fillRect(x + s*0.55, y + s*0.6, s*0.25, s*0.2);
      break;
    // === END BLOCKS ===
    case B.END_STONE:
      ctx.fillStyle = '#d8d898';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c8c888';
      ctx.fillRect(x + s*0.1, y + s*0.15, s*0.35, s*0.3);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.4, s*0.35);
      ctx.fillStyle = '#e8e8a8';
      ctx.fillRect(x + s*0.5, y + s*0.1, s*0.35, s*0.25);
      break;
    case B.END_PORTAL:
      ctx.fillStyle = '#000820';
      ctx.fillRect(x, y, s, s);
      // Star effect
      ctx.fillStyle = '#a0f0a0';
      for (let i = 0; i < 5; i++) {
        const starX = x + s * (0.15 + (i * 0.17));
        const starY = y + s * (0.2 + Math.sin(Date.now() * 0.002 + i) * 0.3);
        ctx.fillRect(starX, starY, s * 0.08, s * 0.08);
      }
      break;
    case B.END_PORTAL_FRAME:
      ctx.fillStyle = '#2a4a4a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#1a3a3a';
      ctx.fillRect(x + s*0.1, y + s*0.6, s*0.8, s*0.35);
      // Eye socket
      ctx.fillStyle = '#0a2020';
      ctx.fillRect(x + s*0.25, y + s*0.15, s*0.5, s*0.35);
      break;
    // === NETHER/END ITEMS ===
    case B.FLINT:
      ctx.fillStyle = '#333';
      ctx.fillRect(x + s*0.3, y + s*0.1, s*0.4, s*0.8);
      ctx.fillStyle = '#444';
      ctx.fillRect(x + s*0.35, y + s*0.15, s*0.25, s*0.5);
      ctx.fillRect(x + s*0.4, y + s*0.1, s*0.15, s*0.15);
      break;
    case B.FLINT_AND_STEEL:
      // Steel
      ctx.fillStyle = '#888';
      ctx.fillRect(x + s*0.15, y + s*0.4, s*0.35, s*0.5);
      ctx.fillStyle = '#666';
      ctx.fillRect(x + s*0.2, y + s*0.45, s*0.1, s*0.35);
      // Flint
      ctx.fillStyle = '#333';
      ctx.fillRect(x + s*0.5, y + s*0.15, s*0.35, s*0.6);
      ctx.fillStyle = '#444';
      ctx.fillRect(x + s*0.55, y + s*0.2, s*0.2, s*0.35);
      break;
    case B.ENDER_PEARL:
      ctx.fillStyle = '#0a3030';
      ctx.beginPath();
      ctx.arc(x + s*0.5, y + s*0.5, s*0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a5050';
      ctx.beginPath();
      ctx.arc(x + s*0.45, y + s*0.4, s*0.15, 0, Math.PI * 2);
      ctx.fill();
      break;
    case B.BLAZE_ROD:
      ctx.fillStyle = '#d0a020';
      ctx.fillRect(x + s*0.4, y + s*0.05, s*0.2, s*0.9);
      ctx.fillStyle = '#f0c040';
      ctx.fillRect(x + s*0.35, y + s*0.15, s*0.3, s*0.1);
      ctx.fillRect(x + s*0.35, y + s*0.45, s*0.3, s*0.1);
      ctx.fillRect(x + s*0.35, y + s*0.75, s*0.3, s*0.1);
      break;
    case B.BLAZE_POWDER:
      ctx.fillStyle = '#f0a020';
      ctx.fillRect(x + s*0.3, y + s*0.25, s*0.15, s*0.5);
      ctx.fillRect(x + s*0.55, y + s*0.2, s*0.15, s*0.55);
      ctx.fillStyle = '#e08010';
      ctx.fillRect(x + s*0.4, y + s*0.35, s*0.2, s*0.35);
      break;
    case B.EYE_OF_ENDER:
      // Outer pearl
      ctx.fillStyle = '#1a5050';
      ctx.beginPath();
      ctx.arc(x + s*0.5, y + s*0.5, s*0.38, 0, Math.PI * 2);
      ctx.fill();
      // Inner eye
      ctx.fillStyle = '#80f080';
      ctx.beginPath();
      ctx.arc(x + s*0.5, y + s*0.5, s*0.2, 0, Math.PI * 2);
      ctx.fill();
      // Pupil
      ctx.fillStyle = '#104010';
      ctx.fillRect(x + s*0.45, y + s*0.4, s*0.1, s*0.2);
      break;
    case B.GOLD_NUGGET:
      ctx.fillStyle = '#fcdb4a';
      ctx.fillRect(x + s*0.3, y + s*0.3, s*0.4, s*0.4);
      ctx.fillStyle = '#d4b030';
      ctx.fillRect(x + s*0.35, y + s*0.4, s*0.15, s*0.2);
      break;
    case B.GHAST_TEAR:
      ctx.fillStyle = '#e8e8f8';
      ctx.beginPath();
      ctx.moveTo(x + s*0.5, y + s*0.1);
      ctx.lineTo(x + s*0.7, y + s*0.5);
      ctx.lineTo(x + s*0.5, y + s*0.9);
      ctx.lineTo(x + s*0.3, y + s*0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#d0d0e8';
      ctx.fillRect(x + s*0.4, y + s*0.3, s*0.2, s*0.3);
      break;
    case B.GRAVEL:
      ctx.fillStyle = '#808080';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#909090';
      ctx.fillRect(x + s*0.1, y + s*0.15, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.55, s*0.3, s*0.25);
      ctx.fillStyle = '#707070';
      ctx.fillRect(x + s*0.5, y + s*0.1, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.15, y + s*0.6, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.35, y + s*0.35, s*0.15, s*0.15);
      break;
    // === OCEAN & BEACH ===
    case B.CLAY:
      ctx.fillStyle = '#9aa0af';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#8890a0';
      ctx.fillRect(x + s*0.1, y + s*0.2, s*0.35, s*0.25);
      ctx.fillRect(x + s*0.5, y + s*0.55, s*0.4, s*0.3);
      break;
    case B.SANDSTONE:
      ctx.fillStyle = '#d9c58a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c4b078';
      ctx.fillRect(x, y + s*0.7, s, s*0.3);
      ctx.fillStyle = '#e8d898';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.8, s*0.2);
      break;
    case B.RED_SAND:
      ctx.fillStyle = '#c2602a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#b05020';
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.15, s*0.15);
      ctx.fillRect(x + s*0.6, y + s*0.6, s*0.15, s*0.15);
      break;
    case B.RED_SANDSTONE:
      ctx.fillStyle = '#a0501a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#904010';
      ctx.fillRect(x, y + s*0.7, s, s*0.3);
      ctx.fillStyle = '#b06030';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.8, s*0.2);
      break;
    case B.PRISMARINE:
      ctx.fillStyle = '#5fa08a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#4f9078';
      ctx.fillRect(x + s*0.1, y + s*0.15, s*0.35, s*0.3);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.4, s*0.35);
      ctx.fillStyle = '#70b0a0';
      ctx.fillRect(x + s*0.55, y + s*0.1, s*0.3, s*0.25);
      break;
    case B.DARK_PRISMARINE:
      ctx.fillStyle = '#305848';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#284840';
      ctx.fillRect(x + s*0.1, y + s*0.2, s*0.4, s*0.3);
      ctx.fillRect(x + s*0.5, y + s*0.55, s*0.4, s*0.35);
      break;
    case B.SEA_LANTERN:
      ctx.fillStyle = '#a8d8d8';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#d0f8f8';
      ctx.fillRect(x + s*0.2, y + s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#e8ffff';
      ctx.fillRect(x + s*0.35, y + s*0.35, s*0.3, s*0.3);
      break;
    case B.KELP:
      ctx.fillStyle = '#2a6a30';
      ctx.fillRect(x + s*0.35, y, s*0.3, s);
      ctx.fillStyle = '#3a8a40';
      ctx.fillRect(x + s*0.25, y + s*0.2, s*0.2, s*0.3);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.2, s*0.3);
      break;
    case B.SEAGRASS:
      ctx.fillStyle = '#2a8a30';
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.15, s*0.7);
      ctx.fillRect(x + s*0.45, y + s*0.4, s*0.12, s*0.6);
      ctx.fillRect(x + s*0.65, y + s*0.35, s*0.15, s*0.65);
      break;
    case B.CORAL_BLUE:
      ctx.fillStyle = '#2060d0';
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.6, s*0.7);
      ctx.fillStyle = '#3080e0';
      ctx.fillRect(x + s*0.1, y + s*0.4, s*0.25, s*0.4);
      ctx.fillRect(x + s*0.65, y + s*0.35, s*0.25, s*0.45);
      ctx.fillRect(x + s*0.3, y + s*0.15, s*0.4, s*0.2);
      break;
    case B.CORAL_PINK:
      ctx.fillStyle = '#d050a0';
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.6, s*0.7);
      ctx.fillStyle = '#e070b0';
      ctx.fillRect(x + s*0.1, y + s*0.4, s*0.25, s*0.4);
      ctx.fillRect(x + s*0.65, y + s*0.35, s*0.25, s*0.45);
      ctx.fillRect(x + s*0.3, y + s*0.15, s*0.4, s*0.2);
      break;
    case B.CORAL_PURPLE:
      ctx.fillStyle = '#8030c0';
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.6, s*0.7);
      ctx.fillStyle = '#9050d0';
      ctx.fillRect(x + s*0.1, y + s*0.4, s*0.25, s*0.4);
      ctx.fillRect(x + s*0.65, y + s*0.35, s*0.25, s*0.45);
      ctx.fillRect(x + s*0.3, y + s*0.15, s*0.4, s*0.2);
      break;
    case B.SPONGE:
      ctx.fillStyle = '#c4b838';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a4982a';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(x + s*(0.15 + (i%3)*0.25), y + s*(0.15 + Math.floor(i/3)*0.4), s*0.15, s*0.15);
      }
      break;
    case B.WET_SPONGE:
      ctx.fillStyle = '#8a9828';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#6a781a';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(x + s*(0.15 + (i%3)*0.25), y + s*(0.15 + Math.floor(i/3)*0.4), s*0.15, s*0.15);
      }
      break;
    // === ICE ===
    case B.ICE:
      ctx.fillStyle = 'rgba(140, 200, 255, 0.7)';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = 'rgba(180, 220, 255, 0.5)';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.3, s*0.25);
      ctx.fillRect(x + s*0.5, y + s*0.55, s*0.35, s*0.3);
      break;
    case B.PACKED_ICE:
      ctx.fillStyle = '#8ab8d8';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a0d0f0';
      ctx.fillRect(x + s*0.1, y + s*0.15, s*0.35, s*0.3);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.4, s*0.35);
      break;
    case B.BLUE_ICE:
      ctx.fillStyle = '#70a8e8';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#90c8ff';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.3, s*0.25);
      ctx.fillRect(x + s*0.5, y + s*0.55, s*0.35, s*0.3);
      ctx.fillStyle = '#5090d0';
      ctx.fillRect(x + s*0.55, y + s*0.1, s*0.3, s*0.25);
      break;
    // === STONE VARIANTS ===
    case B.STONE_BRICK:
      ctx.fillStyle = '#808080';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#606060';
      ctx.fillRect(x, y + s*0.48, s, s*0.04);
      ctx.fillRect(x + s*0.48, y, s*0.04, s*0.48);
      ctx.fillRect(x + s*0.48, y + s*0.52, s*0.04, s*0.48);
      break;
    case B.MOSSY_STONE_BRICK:
      ctx.fillStyle = '#808080';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#606060';
      ctx.fillRect(x, y + s*0.48, s, s*0.04);
      ctx.fillRect(x + s*0.48, y, s*0.04, s*0.48);
      ctx.fillStyle = '#4a8a4a';
      ctx.fillRect(x + s*0.1, y + s*0.6, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.1, s*0.3, s*0.2);
      break;
    case B.CRACKED_STONE_BRICK:
      ctx.fillStyle = '#808080';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#606060';
      ctx.fillRect(x, y + s*0.48, s, s*0.04);
      ctx.fillRect(x + s*0.48, y, s*0.04, s*0.48);
      ctx.fillStyle = '#505050';
      ctx.fillRect(x + s*0.2, y + s*0.15, s*0.05, s*0.3);
      ctx.fillRect(x + s*0.25, y + s*0.35, s*0.15, s*0.05);
      ctx.fillRect(x + s*0.6, y + s*0.55, s*0.05, s*0.25);
      break;
    case B.MOSSY_COBBLESTONE:
      ctx.fillStyle = '#777';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#888';
      ctx.fillRect(x + 1, y + 1, s*0.45, s*0.4);
      ctx.fillRect(x + s*0.5, y + s*0.45, s*0.45, s*0.45);
      ctx.fillStyle = '#4a8a4a';
      ctx.fillRect(x + s*0.55, y + s*0.1, s*0.3, s*0.2);
      ctx.fillRect(x + s*0.1, y + s*0.55, s*0.25, s*0.25);
      break;
    case B.SMOOTH_STONE:
      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#909090';
      ctx.fillRect(x, y + s*0.95, s, s*0.05);
      break;
    case B.ANDESITE:
      ctx.fillStyle = '#888888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#7a7a7a';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.3, s*0.25);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.35, s*0.3);
      ctx.fillStyle = '#969696';
      ctx.fillRect(x + s*0.55, y + s*0.15, s*0.25, s*0.2);
      break;
    case B.DIORITE:
      ctx.fillStyle = '#c8c8c8';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(x + s*0.1, y + s*0.15, s*0.3, s*0.25);
      ctx.fillRect(x + s*0.5, y + s*0.55, s*0.35, s*0.3);
      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(x + s*0.55, y + s*0.1, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.15, y + s*0.55, s*0.2, s*0.25);
      break;
    case B.GRANITE:
      ctx.fillStyle = '#a06040';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#b07050';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.35, s*0.3);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.4, s*0.35);
      ctx.fillStyle = '#905030';
      ctx.fillRect(x + s*0.55, y + s*0.15, s*0.3, s*0.2);
      break;
    case B.POLISHED_ANDESITE:
      ctx.fillStyle = '#909090';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.8, s*0.35);
      break;
    case B.POLISHED_DIORITE:
      ctx.fillStyle = '#d0d0d0';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.8, s*0.35);
      break;
    case B.POLISHED_GRANITE:
      ctx.fillStyle = '#b06848';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c08060';
      ctx.fillRect(x + s*0.1, y + s*0.1, s*0.8, s*0.35);
      break;
    // === DEEPSLATE ===
    case B.DEEPSLATE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#404040';
      ctx.fillRect(x, y + s*0.3, s, s*0.05);
      ctx.fillRect(x, y + s*0.65, s, s*0.05);
      break;
    case B.COBBLED_DEEPSLATE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#606060';
      ctx.fillRect(x + 1, y + 1, s*0.45, s*0.4);
      ctx.fillRect(x + s*0.5, y + s*0.45, s*0.45, s*0.45);
      ctx.fillStyle = '#404040';
      ctx.fillRect(x + s*0.5, y + 1, s*0.4, s*0.35);
      break;
    case B.DEEPSLATE_COAL_ORE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#222';
      ctx.fillRect(x + s*0.2, y + s*0.2, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.25, s*0.25);
      break;
    case B.DEEPSLATE_IRON_ORE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#d4a76a';
      ctx.fillRect(x + s*0.15, y + s*0.15, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.55, s*0.25, s*0.2);
      break;
    case B.DEEPSLATE_GOLD_ORE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#fcdb4a';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.25, s*0.25);
      break;
    case B.DEEPSLATE_DIAMOND_ORE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5ce8e8';
      ctx.fillRect(x + s*0.2, y + s*0.2, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.2, s*0.25);
      break;
    case B.DEEPSLATE_COPPER_ORE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c87533';
      ctx.fillRect(x + s*0.15, y + s*0.15, s*0.22, s*0.22);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.25, s*0.22);
      break;
    case B.DEEPSLATE_EMERALD_ORE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#40c040';
      ctx.fillRect(x + s*0.25, y + s*0.2, s*0.2, s*0.25);
      ctx.fillRect(x + s*0.55, y + s*0.55, s*0.2, s*0.2);
      break;
    case B.DEEPSLATE_LAPIS_ORE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#2050a0';
      ctx.fillRect(x + s*0.2, y + s*0.15, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.25, s*0.25);
      ctx.fillRect(x + s*0.15, y + s*0.55, s*0.15, s*0.15);
      break;
    case B.DEEPSLATE_REDSTONE_ORE:
      ctx.fillStyle = '#505050';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c02020';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.35, y + s*0.55, s*0.15, s*0.15);
      break;
    // === MORE ORES ===
    case B.EMERALD_ORE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#40c040';
      ctx.fillRect(x + s*0.25, y + s*0.2, s*0.2, s*0.25);
      ctx.fillRect(x + s*0.55, y + s*0.55, s*0.2, s*0.2);
      break;
    case B.LAPIS_ORE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#2050a0';
      ctx.fillRect(x + s*0.2, y + s*0.15, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.5, y + s*0.5, s*0.25, s*0.25);
      ctx.fillRect(x + s*0.15, y + s*0.55, s*0.15, s*0.15);
      break;
    case B.REDSTONE_ORE:
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c02020';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.55, y + s*0.5, s*0.25, s*0.2);
      ctx.fillRect(x + s*0.35, y + s*0.55, s*0.15, s*0.15);
      break;
    // === FUNCTIONAL BLOCKS ===
    case B.FURNACE:
      ctx.fillStyle = '#808080';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#606060';
      ctx.fillRect(x + s*0.2, y + s*0.25, s*0.6, s*0.5);
      ctx.fillStyle = '#303030';
      ctx.fillRect(x + s*0.3, y + s*0.35, s*0.4, s*0.35);
      break;
    case B.CHEST:
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#6b4914';
      ctx.fillRect(x + s*0.1, y + s*0.2, s*0.8, s*0.6);
      ctx.fillStyle = '#c0a030';
      ctx.fillRect(x + s*0.4, y + s*0.4, s*0.2, s*0.15);
      break;
    case B.TNT:
      ctx.fillStyle = '#c03030';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(x + s*0.15, y + s*0.3, s*0.7, s*0.4);
      ctx.fillStyle = '#202020';
      ctx.font = `${s*0.35}px sans-serif`;
      ctx.fillText('TNT', x + s*0.2, y + s*0.6);
      break;
    case B.BOOKSHELF:
      ctx.fillStyle = '#b8924a';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(x + s*0.05, y + s*0.1, s*0.28, s*0.35);
      ctx.fillRect(x + s*0.36, y + s*0.1, s*0.28, s*0.35);
      ctx.fillRect(x + s*0.67, y + s*0.1, s*0.28, s*0.35);
      ctx.fillRect(x + s*0.05, y + s*0.55, s*0.28, s*0.35);
      ctx.fillRect(x + s*0.36, y + s*0.55, s*0.28, s*0.35);
      ctx.fillRect(x + s*0.67, y + s*0.55, s*0.28, s*0.35);
      break;
    case B.LADDER:
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x + s*0.15, y, s*0.1, s);
      ctx.fillRect(x + s*0.75, y, s*0.1, s);
      ctx.fillRect(x + s*0.15, y + s*0.15, s*0.7, s*0.08);
      ctx.fillRect(x + s*0.15, y + s*0.45, s*0.7, s*0.08);
      ctx.fillRect(x + s*0.15, y + s*0.75, s*0.7, s*0.08);
      break;
    case B.TORCH:
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x + s*0.4, y + s*0.3, s*0.2, s*0.6);
      ctx.fillStyle = '#f0a020';
      ctx.fillRect(x + s*0.35, y + s*0.1, s*0.3, s*0.25);
      ctx.fillStyle = '#fff080';
      ctx.fillRect(x + s*0.42, y + s*0.15, s*0.16, s*0.12);
      break;
    case B.LANTERN:
      ctx.fillStyle = '#303030';
      ctx.fillRect(x + s*0.25, y + s*0.1, s*0.5, s*0.15);
      ctx.fillRect(x + s*0.2, y + s*0.25, s*0.6, s*0.6);
      ctx.fillStyle = '#f0a020';
      ctx.fillRect(x + s*0.3, y + s*0.35, s*0.4, s*0.4);
      break;
    case B.JACK_O_LANTERN:
      ctx.fillStyle = '#d08020';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#f0c020';
      ctx.fillRect(x + s*0.15, y + s*0.2, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.65, y + s*0.2, s*0.2, s*0.2);
      ctx.fillRect(x + s*0.2, y + s*0.55, s*0.6, s*0.25);
      ctx.fillStyle = '#d08020';
      ctx.fillRect(x + s*0.3, y + s*0.6, s*0.1, s*0.15);
      ctx.fillRect(x + s*0.5, y + s*0.6, s*0.1, s*0.15);
      break;
    case B.PUMPKIN:
      ctx.fillStyle = '#d08020';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#b06010';
      ctx.fillRect(x + s*0.3, y, s*0.08, s*0.15);
      ctx.fillRect(x + s*0.62, y, s*0.08, s*0.15);
      ctx.fillStyle = '#505020';
      ctx.fillRect(x + s*0.45, y, s*0.1, s*0.12);
      break;
    case B.MELON:
      ctx.fillStyle = '#508030';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#406020';
      ctx.fillRect(x + s*0.25, y, s*0.08, s);
      ctx.fillRect(x + s*0.5, y, s*0.08, s);
      ctx.fillRect(x + s*0.75, y, s*0.08, s);
      break;
    case B.HAY_BALE:
      ctx.fillStyle = '#c0a020';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a08018';
      ctx.fillRect(x + s*0.15, y, s*0.08, s);
      ctx.fillRect(x + s*0.4, y, s*0.08, s);
      ctx.fillRect(x + s*0.65, y, s*0.08, s);
      ctx.fillStyle = '#805010';
      ctx.fillRect(x, y + s*0.3, s, s*0.1);
      ctx.fillRect(x, y + s*0.6, s, s*0.1);
      break;
    case B.CACTUS:
      ctx.fillStyle = '#2a8030';
      ctx.fillRect(x + s*0.15, y, s*0.7, s);
      ctx.fillStyle = '#3aa040';
      ctx.fillRect(x + s*0.25, y + s*0.1, s*0.5, s*0.8);
      ctx.fillStyle = '#1a6020';
      ctx.fillRect(x + s*0.1, y + s*0.2, s*0.08, s*0.08);
      ctx.fillRect(x + s*0.82, y + s*0.4, s*0.08, s*0.08);
      ctx.fillRect(x + s*0.1, y + s*0.65, s*0.08, s*0.08);
      break;
    case B.SUGAR_CANE:
      ctx.fillStyle = '#80c050';
      ctx.fillRect(x + s*0.35, y, s*0.3, s);
      ctx.fillStyle = '#60a030';
      ctx.fillRect(x + s*0.35, y + s*0.25, s*0.3, s*0.05);
      ctx.fillRect(x + s*0.35, y + s*0.55, s*0.3, s*0.05);
      ctx.fillRect(x + s*0.35, y + s*0.85, s*0.3, s*0.05);
      break;
    case B.BAMBOO:
      ctx.fillStyle = '#60a030';
      ctx.fillRect(x + s*0.4, y, s*0.2, s);
      ctx.fillStyle = '#80c050';
      ctx.fillRect(x + s*0.25, y + s*0.1, s*0.2, s*0.15);
      ctx.fillRect(x + s*0.55, y + s*0.4, s*0.2, s*0.15);
      break;
    case B.DEAD_BUSH:
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x + s*0.45, y + s*0.5, s*0.1, s*0.5);
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.35, s*0.08);
      ctx.fillRect(x + s*0.45, y + s*0.2, s*0.35, s*0.08);
      ctx.fillRect(x + s*0.15, y + s*0.15, s*0.15, s*0.08);
      ctx.fillRect(x + s*0.7, y + s*0.1, s*0.15, s*0.08);
      break;
    case B.FERN:
      ctx.fillStyle = '#2a8a2a';
      ctx.fillRect(x + s*0.1, y + s*0.3, s*0.35, s*0.1);
      ctx.fillRect(x + s*0.55, y + s*0.25, s*0.35, s*0.1);
      ctx.fillRect(x + s*0.2, y + s*0.5, s*0.3, s*0.1);
      ctx.fillRect(x + s*0.5, y + s*0.55, s*0.3, s*0.1);
      ctx.fillRect(x + s*0.45, y + s*0.6, s*0.1, s*0.4);
      break;
    case B.TALL_GRASS:
      ctx.fillStyle = '#4a8c2a';
      ctx.fillRect(x + s*0.2, y + s*0.3, s*0.08, s*0.7);
      ctx.fillRect(x + s*0.4, y + s*0.2, s*0.08, s*0.8);
      ctx.fillRect(x + s*0.6, y + s*0.35, s*0.08, s*0.65);
      ctx.fillRect(x + s*0.75, y + s*0.4, s*0.08, s*0.6);
      break;
    // === WOOD VARIANTS ===
    case B.OAK_LOG: case B.WOOD:
      ctx.fillStyle = '#6B4226'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5a3720'; ctx.fillRect(x + s*0.3, y, s*0.05, s); ctx.fillRect(x + s*0.65, y, s*0.05, s); break;
    case B.BIRCH_LOG:
      ctx.fillStyle = '#e8e0d0'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#303030'; ctx.fillRect(x + s*0.1, y + s*0.2, s*0.2, s*0.08); ctx.fillRect(x + s*0.6, y + s*0.5, s*0.25, s*0.08); break;
    case B.SPRUCE_LOG:
      ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#2a1a0a'; ctx.fillRect(x + s*0.3, y, s*0.05, s); ctx.fillRect(x + s*0.65, y, s*0.05, s); break;
    case B.JUNGLE_LOG:
      ctx.fillStyle = '#5a4a2a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#4a3a1a'; ctx.fillRect(x + s*0.25, y, s*0.08, s); ctx.fillRect(x + s*0.55, y, s*0.08, s); break;
    case B.ACACIA_LOG:
      ctx.fillStyle = '#6a5a4a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(x + s*0.2, y, s*0.1, s); ctx.fillRect(x + s*0.6, y, s*0.1, s); break;
    case B.DARK_OAK_LOG:
      ctx.fillStyle = '#3a2818'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#2a1808'; ctx.fillRect(x + s*0.3, y, s*0.05, s); ctx.fillRect(x + s*0.65, y, s*0.05, s); break;
    case B.OAK_PLANKS: case B.PLANKS:
      ctx.fillStyle = '#b8924a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a67e3a'; ctx.fillRect(x, y + s*0.48, s, s*0.04); ctx.fillRect(x + s*0.33, y, s*0.03, s); break;
    case B.BIRCH_PLANKS:
      ctx.fillStyle = '#d8c898'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c8b888'; ctx.fillRect(x, y + s*0.48, s, s*0.04); ctx.fillRect(x + s*0.33, y, s*0.03, s); break;
    case B.SPRUCE_PLANKS:
      ctx.fillStyle = '#6a5030'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5a4020'; ctx.fillRect(x, y + s*0.48, s, s*0.04); ctx.fillRect(x + s*0.33, y, s*0.03, s); break;
    case B.JUNGLE_PLANKS:
      ctx.fillStyle = '#a87858'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#986848'; ctx.fillRect(x, y + s*0.48, s, s*0.04); break;
    case B.ACACIA_PLANKS:
      ctx.fillStyle = '#b85830'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a84820'; ctx.fillRect(x, y + s*0.48, s, s*0.04); break;
    case B.DARK_OAK_PLANKS:
      ctx.fillStyle = '#4a3018'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3a2008'; ctx.fillRect(x, y + s*0.48, s, s*0.04); break;
    case B.OAK_LEAVES: case B.LEAVES:
      ctx.fillStyle = '#2d8a2d'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3aa83a';
      for (let i = 0; i < 5; i++) { ctx.fillRect(x + (Math.sin(i*2.5+x)*0.3+0.35)*s, y + (Math.cos(i*1.7+y)*0.3+0.35)*s, s*0.2, s*0.2); }
      break;
    case B.BIRCH_LEAVES:
      ctx.fillStyle = '#50a050'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#60b860';
      for (let i = 0; i < 4; i++) ctx.fillRect(x + s*(0.1 + (i%2)*0.4), y + s*(0.1 + Math.floor(i/2)*0.4), s*0.2, s*0.2); break;
    case B.SPRUCE_LEAVES:
      ctx.fillStyle = '#2a5a3a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3a6a4a';
      for (let i = 0; i < 4; i++) ctx.fillRect(x + s*(0.1 + (i%2)*0.4), y + s*(0.1 + Math.floor(i/2)*0.4), s*0.2, s*0.2); break;
    case B.JUNGLE_LEAVES:
      ctx.fillStyle = '#3a9a3a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#4aaa4a';
      for (let i = 0; i < 4; i++) ctx.fillRect(x + s*(0.1 + (i%2)*0.4), y + s*(0.1 + Math.floor(i/2)*0.4), s*0.22, s*0.22); break;
    case B.ACACIA_LEAVES:
      ctx.fillStyle = '#5aa02a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#6ab03a';
      for (let i = 0; i < 4; i++) ctx.fillRect(x + s*(0.1 + (i%2)*0.4), y + s*(0.1 + Math.floor(i/2)*0.4), s*0.2, s*0.2); break;
    case B.DARK_OAK_LEAVES:
      ctx.fillStyle = '#2a6a2a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3a7a3a';
      for (let i = 0; i < 4; i++) ctx.fillRect(x + s*(0.1 + (i%2)*0.4), y + s*(0.1 + Math.floor(i/2)*0.4), s*0.2, s*0.2); break;
    // === TERRACOTTA ===
    case B.TERRACOTTA: ctx.fillStyle = '#985a42'; ctx.fillRect(x, y, s, s); break;
    case B.WHITE_TERRACOTTA: ctx.fillStyle = '#d1b3a1'; ctx.fillRect(x, y, s, s); break;
    case B.ORANGE_TERRACOTTA: ctx.fillStyle = '#a15325'; ctx.fillRect(x, y, s, s); break;
    case B.MAGENTA_TERRACOTTA: ctx.fillStyle = '#95586c'; ctx.fillRect(x, y, s, s); break;
    case B.LIGHT_BLUE_TERRACOTTA: ctx.fillStyle = '#706c89'; ctx.fillRect(x, y, s, s); break;
    case B.YELLOW_TERRACOTTA: ctx.fillStyle = '#ba8523'; ctx.fillRect(x, y, s, s); break;
    case B.LIME_TERRACOTTA: ctx.fillStyle = '#677534'; ctx.fillRect(x, y, s, s); break;
    case B.PINK_TERRACOTTA: ctx.fillStyle = '#a14e4e'; ctx.fillRect(x, y, s, s); break;
    case B.CYAN_TERRACOTTA: ctx.fillStyle = '#565b5b'; ctx.fillRect(x, y, s, s); break;
    case B.PURPLE_TERRACOTTA: ctx.fillStyle = '#764556'; ctx.fillRect(x, y, s, s); break;
    case B.BLUE_TERRACOTTA: ctx.fillStyle = '#4a3b5b'; ctx.fillRect(x, y, s, s); break;
    case B.BROWN_TERRACOTTA: ctx.fillStyle = '#4d3323'; ctx.fillRect(x, y, s, s); break;
    case B.GREEN_TERRACOTTA: ctx.fillStyle = '#4c532a'; ctx.fillRect(x, y, s, s); break;
    case B.RED_TERRACOTTA: ctx.fillStyle = '#8e3b2e'; ctx.fillRect(x, y, s, s); break;
    case B.BLACK_TERRACOTTA: ctx.fillStyle = '#251610'; ctx.fillRect(x, y, s, s); break;
    // === CONCRETE ===
    case B.WHITE_CONCRETE: ctx.fillStyle = '#cfd5d6'; ctx.fillRect(x, y, s, s); break;
    case B.ORANGE_CONCRETE: ctx.fillStyle = '#e06101'; ctx.fillRect(x, y, s, s); break;
    case B.MAGENTA_CONCRETE: ctx.fillStyle = '#a9309f'; ctx.fillRect(x, y, s, s); break;
    case B.LIGHT_BLUE_CONCRETE: ctx.fillStyle = '#2389c6'; ctx.fillRect(x, y, s, s); break;
    case B.YELLOW_CONCRETE: ctx.fillStyle = '#f0af15'; ctx.fillRect(x, y, s, s); break;
    case B.LIME_CONCRETE: ctx.fillStyle = '#5ea918'; ctx.fillRect(x, y, s, s); break;
    case B.PINK_CONCRETE: ctx.fillStyle = '#d6658e'; ctx.fillRect(x, y, s, s); break;
    case B.GRAY_CONCRETE: ctx.fillStyle = '#36393d'; ctx.fillRect(x, y, s, s); break;
    case B.CYAN_CONCRETE: ctx.fillStyle = '#157788'; ctx.fillRect(x, y, s, s); break;
    case B.PURPLE_CONCRETE: ctx.fillStyle = '#64209c'; ctx.fillRect(x, y, s, s); break;
    case B.BLUE_CONCRETE: ctx.fillStyle = '#2c2e8f'; ctx.fillRect(x, y, s, s); break;
    case B.BROWN_CONCRETE: ctx.fillStyle = '#60331a'; ctx.fillRect(x, y, s, s); break;
    case B.GREEN_CONCRETE: ctx.fillStyle = '#495b24'; ctx.fillRect(x, y, s, s); break;
    case B.RED_CONCRETE: ctx.fillStyle = '#8e2020'; ctx.fillRect(x, y, s, s); break;
    case B.BLACK_CONCRETE: ctx.fillStyle = '#080a0f'; ctx.fillRect(x, y, s, s); break;
    // === WOOL ===
    case B.WHITE_WOOL: ctx.fillStyle = '#e9ecec'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#d0d4d4'; ctx.fillRect(x+s*0.1,y+s*0.1,s*0.3,s*0.3); ctx.fillRect(x+s*0.5,y+s*0.5,s*0.3,s*0.3); break;
    case B.ORANGE_WOOL: ctx.fillStyle = '#f07613'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#d06010'; ctx.fillRect(x+s*0.1,y+s*0.1,s*0.3,s*0.3); break;
    case B.MAGENTA_WOOL: ctx.fillStyle = '#bd44b3'; ctx.fillRect(x, y, s, s); break;
    case B.LIGHT_BLUE_WOOL: ctx.fillStyle = '#3ab3da'; ctx.fillRect(x, y, s, s); break;
    case B.YELLOW_WOOL: ctx.fillStyle = '#f8c527'; ctx.fillRect(x, y, s, s); break;
    case B.LIME_WOOL: ctx.fillStyle = '#70b919'; ctx.fillRect(x, y, s, s); break;
    case B.PINK_WOOL: ctx.fillStyle = '#ed8dac'; ctx.fillRect(x, y, s, s); break;
    case B.GRAY_WOOL: ctx.fillStyle = '#3e4447'; ctx.fillRect(x, y, s, s); break;
    case B.CYAN_WOOL: ctx.fillStyle = '#158991'; ctx.fillRect(x, y, s, s); break;
    case B.PURPLE_WOOL: ctx.fillStyle = '#7b2fbe'; ctx.fillRect(x, y, s, s); break;
    case B.BLUE_WOOL: ctx.fillStyle = '#35399d'; ctx.fillRect(x, y, s, s); break;
    case B.BROWN_WOOL: ctx.fillStyle = '#724728'; ctx.fillRect(x, y, s, s); break;
    case B.GREEN_WOOL: ctx.fillStyle = '#546d1b'; ctx.fillRect(x, y, s, s); break;
    case B.RED_WOOL: ctx.fillStyle = '#a12722'; ctx.fillRect(x, y, s, s); break;
    case B.BLACK_WOOL: ctx.fillStyle = '#141519'; ctx.fillRect(x, y, s, s); break;
    // === NETHER ADDITIONS ===
    case B.CRIMSON_NYLIUM:
      ctx.fillStyle = '#6a2020'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a03030'; ctx.fillRect(x, y, s, s*0.3);
      ctx.fillStyle = '#c04040'; ctx.fillRect(x+2, y, s-4, s*0.15); break;
    case B.WARPED_NYLIUM:
      ctx.fillStyle = '#1a5050'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#2a8080'; ctx.fillRect(x, y, s, s*0.3); break;
    case B.CRIMSON_STEM:
      ctx.fillStyle = '#6a3040'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5a2030'; ctx.fillRect(x+s*0.3, y, s*0.05, s); ctx.fillRect(x+s*0.65, y, s*0.05, s); break;
    case B.WARPED_STEM:
      ctx.fillStyle = '#2a6060'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#1a5050'; ctx.fillRect(x+s*0.3, y, s*0.05, s); ctx.fillRect(x+s*0.65, y, s*0.05, s); break;
    case B.SHROOMLIGHT:
      ctx.fillStyle = '#e8a040'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#f0c060'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.CRYING_OBSIDIAN:
      ctx.fillStyle = '#1a0a2e'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#8030d0'; ctx.fillRect(x+s*0.2, y+s*0.15, s*0.15, s*0.25); ctx.fillRect(x+s*0.6, y+s*0.5, s*0.2, s*0.3); break;
    case B.BASALT:
      ctx.fillStyle = '#4a4a4a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3a3a3a'; ctx.fillRect(x+s*0.3, y, s*0.08, s); ctx.fillRect(x+s*0.62, y, s*0.08, s); break;
    case B.POLISHED_BASALT:
      ctx.fillStyle = '#5a5a5a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#4a4a4a'; ctx.fillRect(x+s*0.25, y+s*0.25, s*0.5, s*0.5); break;
    case B.BLACKSTONE:
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3a3a3a'; ctx.fillRect(x+s*0.1, y+s*0.15, s*0.35, s*0.3); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.35); break;
    case B.POLISHED_BLACKSTONE:
      ctx.fillStyle = '#303030'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#252525'; ctx.fillRect(x, y+s*0.48, s, s*0.04); ctx.fillRect(x+s*0.48, y, s*0.04, s); break;
    case B.GILDED_BLACKSTONE:
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#fcdb4a'; ctx.fillRect(x+s*0.15, y+s*0.2, s*0.2, s*0.2); ctx.fillRect(x+s*0.55, y+s*0.55, s*0.25, s*0.2); break;
    case B.ANCIENT_DEBRIS:
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#8a7050'; ctx.fillRect(x+s*0.1, y+s*0.15, s*0.4, s*0.25); ctx.fillRect(x+s*0.45, y+s*0.5, s*0.45, s*0.35); break;
    case B.NETHERITE_BLOCK:
      ctx.fillStyle = '#3a3a3a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#4a4a4a'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4);
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(x+s*0.55, y+s*0.1, s*0.3, s*0.25); break;
    // === END ADDITIONS ===
    case B.PURPUR_BLOCK:
      ctx.fillStyle = '#a080a0'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#906090'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.PURPUR_PILLAR:
      ctx.fillStyle = '#a080a0'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#b090b0'; ctx.fillRect(x+s*0.25, y, s*0.5, s);
      ctx.fillStyle = '#906090'; ctx.fillRect(x, y+s*0.2, s, s*0.08); ctx.fillRect(x, y+s*0.72, s, s*0.08); break;
    case B.END_BRICK:
      ctx.fillStyle = '#d8d898'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#c8c888'; ctx.fillRect(x, y+s*0.48, s, s*0.04); ctx.fillRect(x+s*0.48, y, s*0.04, s*0.48); break;
    case B.CHORUS_PLANT:
      ctx.fillStyle = '#6a3080'; ctx.fillRect(x+s*0.3, y, s*0.4, s);
      ctx.fillStyle = '#804098'; ctx.fillRect(x+s*0.35, y+s*0.2, s*0.3, s*0.6); break;
    case B.CHORUS_FLOWER:
      ctx.fillStyle = '#c0a0c0'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#e0c0e0'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.4, s*0.4);
      ctx.fillStyle = '#6a3080'; ctx.fillRect(x+s*0.4, y+s*0.4, s*0.2, s*0.2); break;
    // === MISC BLOCKS ===
    case B.MYCELIUM:
      ctx.fillStyle = '#8B6914'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#7a6080'; ctx.fillRect(x, y, s, s*0.3);
      ctx.fillStyle = '#9a80a0'; ctx.fillRect(x+2, y, s-4, s*0.15); break;
    case B.PODZOL:
      ctx.fillStyle = '#8B6914'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#6a4a10'; ctx.fillRect(x, y, s, s*0.3); break;
    case B.COARSE_DIRT:
      ctx.fillStyle = '#6a5012'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5a4010'; ctx.fillRect(x+s*0.2, y+s*0.3, s*0.2, s*0.2); ctx.fillRect(x+s*0.55, y+s*0.55, s*0.2, s*0.2); break;
    case B.ROOTED_DIRT:
      ctx.fillStyle = '#8B6914'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a08040'; ctx.fillRect(x+s*0.1, y+s*0.7, s*0.2, s*0.25); ctx.fillRect(x+s*0.5, y+s*0.6, s*0.3, s*0.35); break;
    case B.MOSS_BLOCK:
      ctx.fillStyle = '#4a8a3a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5a9a4a'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.DRIPSTONE:
      ctx.fillStyle = '#8a7060'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#7a6050'; ctx.fillRect(x+s*0.35, y, s*0.3, s*0.4); ctx.fillRect(x+s*0.4, y+s*0.4, s*0.2, s*0.3); break;
    case B.CALCITE:
      ctx.fillStyle = '#e0e0e0'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#d0d0d0'; ctx.fillRect(x+s*0.1, y+s*0.15, s*0.35, s*0.3); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.35); break;
    case B.TUFF:
      ctx.fillStyle = '#5a5a5a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#6a6a6a'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.3, s*0.25); ctx.fillRect(x+s*0.5, y+s*0.55, s*0.35, s*0.3); break;
    case B.AMETHYST:
      ctx.fillStyle = '#8050a0'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#a070c0'; ctx.fillRect(x+s*0.15, y+s*0.1, s*0.3, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.35, s*0.4);
      ctx.fillStyle = '#c090e0'; ctx.fillRect(x+s*0.2, y+s*0.15, s*0.15, s*0.2); break;
    case B.COPPER_BLOCK:
      ctx.fillStyle = '#c87850'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#d89060'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.EXPOSED_COPPER:
      ctx.fillStyle = '#a08060'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#609080'; ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.WEATHERED_COPPER:
      ctx.fillStyle = '#70a090'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#60908a'; ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.OXIDIZED_COPPER:
      ctx.fillStyle = '#50a090'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#60b0a0'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.RAW_IRON_BLOCK: ctx.fillStyle = '#a08070'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#b09080'; ctx.fillRect(x+s*0.1, y+s*0.15, s*0.35, s*0.3); break;
    case B.RAW_GOLD_BLOCK: ctx.fillStyle = '#d0a020'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#e0b030'; ctx.fillRect(x+s*0.1, y+s*0.15, s*0.35, s*0.3); break;
    case B.RAW_COPPER_BLOCK: ctx.fillStyle = '#a06040'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#b07050'; ctx.fillRect(x+s*0.1, y+s*0.15, s*0.35, s*0.3); break;
    case B.IRON_BLOCK:
      ctx.fillStyle = '#d8d8d8'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#e8e8e8'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4);
      ctx.fillStyle = '#c0c0c0'; ctx.fillRect(x+s*0.55, y+s*0.1, s*0.3, s*0.25); break;
    case B.GOLD_BLOCK:
      ctx.fillStyle = '#f0c020'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#ffe040'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4);
      ctx.fillStyle = '#d0a010'; ctx.fillRect(x+s*0.55, y+s*0.1, s*0.3, s*0.25); break;
    case B.DIAMOND_BLOCK:
      ctx.fillStyle = '#60d8d8'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#80f0f0'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4);
      ctx.fillStyle = '#40b8b8'; ctx.fillRect(x+s*0.55, y+s*0.1, s*0.3, s*0.25); break;
    case B.EMERALD_BLOCK:
      ctx.fillStyle = '#40c040'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#60e060'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4);
      ctx.fillStyle = '#30a030'; ctx.fillRect(x+s*0.55, y+s*0.1, s*0.3, s*0.25); break;
    case B.LAPIS_BLOCK:
      ctx.fillStyle = '#2050a0'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3070c0'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.REDSTONE_BLOCK:
      ctx.fillStyle = '#b01010'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#d02020'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.COAL_BLOCK:
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(x+s*0.1, y+s*0.15, s*0.35, s*0.3); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.35); break;
    // === FOOD ===
    case B.COOKED_PORK:
      ctx.fillStyle = '#c08040'; ctx.fillRect(x+s*0.15, y+s*0.2, s*0.7, s*0.6);
      ctx.fillStyle = '#a06030'; ctx.fillRect(x+s*0.2, y+s*0.3, s*0.25, s*0.4);
      ctx.fillStyle = '#d0a060'; ctx.fillRect(x+s*0.5, y+s*0.3, s*0.25, s*0.35); break;
    case B.COOKED_BEEF:
      ctx.fillStyle = '#803020'; ctx.fillRect(x+s*0.1, y+s*0.15, s*0.8, s*0.7);
      ctx.fillStyle = '#a04030'; ctx.fillRect(x+s*0.2, y+s*0.25, s*0.3, s*0.4);
      ctx.fillStyle = '#d0c0b0'; ctx.fillRect(x+s*0.55, y+s*0.2, s*0.25, s*0.5); break;
    case B.COOKED_CHICKEN:
      ctx.fillStyle = '#c0a060'; ctx.fillRect(x+s*0.2, y+s*0.15, s*0.6, s*0.7);
      ctx.fillStyle = '#a08050'; ctx.fillRect(x+s*0.15, y+s*0.55, s*0.2, s*0.3); ctx.fillRect(x+s*0.65, y+s*0.55, s*0.2, s*0.3); break;
    case B.BREAD:
      ctx.fillStyle = '#c0903a'; ctx.fillRect(x+s*0.1, y+s*0.35, s*0.8, s*0.45);
      ctx.fillStyle = '#a07028'; ctx.fillRect(x+s*0.15, y+s*0.3, s*0.7, s*0.12); ctx.fillRect(x+s*0.1, y+s*0.75, s*0.8, s*0.08); break;
    case B.APPLE:
      ctx.fillStyle = '#c02020'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.55, s*0.35, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#603010'; ctx.fillRect(x+s*0.45, y+s*0.1, s*0.1, s*0.2);
      ctx.fillStyle = '#2a8a2a'; ctx.fillRect(x+s*0.5, y+s*0.05, s*0.2, s*0.15); break;
    case B.GOLDEN_APPLE:
      ctx.fillStyle = '#f0c020'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.55, s*0.35, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#603010'; ctx.fillRect(x+s*0.45, y+s*0.1, s*0.1, s*0.2); break;
    case B.ENCHANTED_GOLDEN_APPLE:
      ctx.fillStyle = '#f0c020'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.55, s*0.35, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#a080f0'; ctx.fillRect(x+s*0.35, y+s*0.4, s*0.3, s*0.1); ctx.fillRect(x+s*0.45, y+s*0.3, s*0.1, s*0.3);
      ctx.fillStyle = '#603010'; ctx.fillRect(x+s*0.45, y+s*0.1, s*0.1, s*0.15); break;
    case B.CARROT:
      ctx.fillStyle = '#f08020'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.4, s*0.6); ctx.fillRect(x+s*0.4, y+s*0.8, s*0.2, s*0.15);
      ctx.fillStyle = '#4a8a2a'; ctx.fillRect(x+s*0.35, y+s*0.1, s*0.1, s*0.25); ctx.fillRect(x+s*0.5, y+s*0.15, s*0.1, s*0.2); break;
    case B.GOLDEN_CARROT:
      ctx.fillStyle = '#f0c020'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.4, s*0.6); ctx.fillRect(x+s*0.4, y+s*0.8, s*0.2, s*0.15);
      ctx.fillStyle = '#4a8a2a'; ctx.fillRect(x+s*0.35, y+s*0.1, s*0.1, s*0.25); ctx.fillRect(x+s*0.5, y+s*0.15, s*0.1, s*0.2); break;
    case B.POTATO:
      ctx.fillStyle = '#c0a050'; ctx.fillRect(x+s*0.2, y+s*0.3, s*0.6, s*0.5);
      ctx.fillStyle = '#a08040'; ctx.fillRect(x+s*0.25, y+s*0.4, s*0.15, s*0.1); ctx.fillRect(x+s*0.55, y+s*0.55, s*0.15, s*0.1); break;
    case B.BAKED_POTATO:
      ctx.fillStyle = '#b08030'; ctx.fillRect(x+s*0.2, y+s*0.3, s*0.6, s*0.5);
      ctx.fillStyle = '#f0e0a0'; ctx.fillRect(x+s*0.3, y+s*0.4, s*0.4, s*0.3); break;
    case B.BEETROOT:
      ctx.fillStyle = '#901030'; ctx.fillRect(x+s*0.25, y+s*0.35, s*0.5, s*0.55);
      ctx.fillStyle = '#4a8a2a'; ctx.fillRect(x+s*0.35, y+s*0.1, s*0.1, s*0.3); ctx.fillRect(x+s*0.5, y+s*0.15, s*0.1, s*0.25); break;
    case B.MELON_SLICE:
      ctx.fillStyle = '#508030'; ctx.fillRect(x+s*0.1, y+s*0.7, s*0.8, s*0.2);
      ctx.fillStyle = '#f08080'; ctx.fillRect(x+s*0.15, y+s*0.25, s*0.7, s*0.5);
      ctx.fillStyle = '#202020'; ctx.fillRect(x+s*0.25, y+s*0.4, s*0.08, s*0.15); ctx.fillRect(x+s*0.45, y+s*0.35, s*0.08, s*0.15); ctx.fillRect(x+s*0.65, y+s*0.45, s*0.08, s*0.15); break;
    case B.SWEET_BERRIES: case B.GLOW_BERRIES:
      ctx.fillStyle = type === B.SWEET_BERRIES ? '#a02020' : '#f0a020';
      ctx.fillRect(x+s*0.25, y+s*0.4, s*0.2, s*0.25); ctx.fillRect(x+s*0.55, y+s*0.35, s*0.2, s*0.25); ctx.fillRect(x+s*0.4, y+s*0.55, s*0.2, s*0.25);
      ctx.fillStyle = '#4a8a2a'; ctx.fillRect(x+s*0.35, y+s*0.2, s*0.3, s*0.15); break;
    case B.COOKIE:
      ctx.fillStyle = '#c0903a'; ctx.fillRect(x+s*0.2, y+s*0.35, s*0.6, s*0.3);
      ctx.fillStyle = '#603020'; ctx.fillRect(x+s*0.3, y+s*0.42, s*0.1, s*0.1); ctx.fillRect(x+s*0.5, y+s*0.45, s*0.1, s*0.1); break;
    case B.CAKE:
      ctx.fillStyle = '#f0e8d0'; ctx.fillRect(x+s*0.1, y+s*0.3, s*0.8, s*0.55);
      ctx.fillStyle = '#c02020'; ctx.fillRect(x+s*0.15, y+s*0.2, s*0.7, s*0.15);
      ctx.fillStyle = '#f0f0f0'; ctx.fillRect(x+s*0.15, y+s*0.35, s*0.7, s*0.08); break;
    case B.PUMPKIN_PIE:
      ctx.fillStyle = '#d08020'; ctx.fillRect(x+s*0.1, y+s*0.4, s*0.8, s*0.45);
      ctx.fillStyle = '#c0903a'; ctx.fillRect(x+s*0.1, y+s*0.75, s*0.8, s*0.15);
      ctx.fillStyle = '#f0f0e0'; ctx.fillRect(x+s*0.3, y+s*0.5, s*0.4, s*0.15); break;
    // === MATERIALS ===
    case B.EMERALD:
      ctx.fillStyle = '#40c040'; ctx.fillRect(x+s*0.25, y+s*0.15, s*0.5, s*0.7);
      ctx.fillStyle = '#60e060'; ctx.fillRect(x+s*0.35, y+s*0.25, s*0.3, s*0.4); break;
    case B.LAPIS:
      ctx.fillStyle = '#2050a0'; ctx.fillRect(x+s*0.25, y+s*0.2, s*0.5, s*0.6);
      ctx.fillStyle = '#3070c0'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.35, s*0.35); break;
    case B.REDSTONE:
      ctx.fillStyle = '#c02020'; ctx.fillRect(x+s*0.35, y+s*0.3, s*0.3, s*0.5);
      ctx.fillRect(x+s*0.25, y+s*0.4, s*0.5, s*0.3); break;
    case B.QUARTZ:
      ctx.fillStyle = '#e8e0d8'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#f0ece8'; ctx.fillRect(x+s*0.3, y+s*0.25, s*0.4, s*0.35); break;
    case B.COAL:
      ctx.fillStyle = '#202020'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#303030'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.35, s*0.35); break;
    case B.CHARCOAL:
      ctx.fillStyle = '#3a3020'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#4a4030'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.35, s*0.35); break;
    case B.RAW_IRON:
      ctx.fillStyle = '#c0a080'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#a08060'; ctx.fillRect(x+s*0.25, y+s*0.3, s*0.25, s*0.25); ctx.fillRect(x+s*0.5, y+s*0.45, s*0.2, s*0.25); break;
    case B.RAW_GOLD:
      ctx.fillStyle = '#f0c030'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#d0a020'; ctx.fillRect(x+s*0.25, y+s*0.3, s*0.25, s*0.25); ctx.fillRect(x+s*0.5, y+s*0.45, s*0.2, s*0.25); break;
    case B.RAW_COPPER:
      ctx.fillStyle = '#c87050'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#a86040'; ctx.fillRect(x+s*0.25, y+s*0.3, s*0.25, s*0.25); ctx.fillRect(x+s*0.5, y+s*0.45, s*0.2, s*0.25); break;
    case B.IRON_INGOT:
      ctx.fillStyle = '#d8d8d8'; ctx.fillRect(x+s*0.15, y+s*0.3, s*0.7, s*0.4);
      ctx.fillStyle = '#e8e8e8'; ctx.fillRect(x+s*0.2, y+s*0.35, s*0.5, s*0.2); break;
    case B.GOLD_INGOT:
      ctx.fillStyle = '#f0c020'; ctx.fillRect(x+s*0.15, y+s*0.3, s*0.7, s*0.4);
      ctx.fillStyle = '#ffe040'; ctx.fillRect(x+s*0.2, y+s*0.35, s*0.5, s*0.2); break;
    case B.COPPER_INGOT:
      ctx.fillStyle = '#c87850'; ctx.fillRect(x+s*0.15, y+s*0.3, s*0.7, s*0.4);
      ctx.fillStyle = '#d89060'; ctx.fillRect(x+s*0.2, y+s*0.35, s*0.5, s*0.2); break;
    case B.NETHERITE_INGOT:
      ctx.fillStyle = '#3a3a3a'; ctx.fillRect(x+s*0.15, y+s*0.3, s*0.7, s*0.4);
      ctx.fillStyle = '#4a4a4a'; ctx.fillRect(x+s*0.2, y+s*0.35, s*0.5, s*0.2); break;
    case B.DIAMOND:
      ctx.fillStyle = '#5ce8e8'; ctx.fillRect(x+s*0.25, y+s*0.2, s*0.5, s*0.6);
      ctx.fillStyle = '#80f8f8'; ctx.fillRect(x+s*0.35, y+s*0.3, s*0.3, s*0.35); break;
    case B.NETHERITE_SCRAP:
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#4a3a2a'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.35, s*0.35); break;
    // === MISC ITEMS ===
    case B.BONE:
      ctx.fillStyle = '#e8e0d0'; ctx.fillRect(x+s*0.15, y+s*0.4, s*0.7, s*0.2);
      ctx.fillRect(x+s*0.1, y+s*0.35, s*0.2, s*0.3); ctx.fillRect(x+s*0.7, y+s*0.35, s*0.2, s*0.3); break;
    case B.BONE_BLOCK:
      ctx.fillStyle = '#e8e0d0'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#d0c8b8'; ctx.fillRect(x+s*0.25, y, s*0.5, s);
      ctx.fillStyle = '#c0b8a8'; ctx.fillRect(x+s*0.35, y, s*0.3, s); break;
    case B.SLIME_BLOCK:
      ctx.fillStyle = 'rgba(120, 200, 80, 0.7)'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = 'rgba(100, 180, 60, 0.8)'; ctx.fillRect(x+s*0.25, y+s*0.25, s*0.5, s*0.5); break;
    case B.HONEY_BLOCK:
      ctx.fillStyle = 'rgba(240, 160, 40, 0.7)'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = 'rgba(220, 140, 20, 0.8)'; ctx.fillRect(x+s*0.25, y+s*0.25, s*0.5, s*0.5); break;
    case B.DRIED_KELP:
      ctx.fillStyle = '#2a4a20'; ctx.fillRect(x+s*0.3, y+s*0.1, s*0.4, s*0.8);
      ctx.fillStyle = '#3a5a30'; ctx.fillRect(x+s*0.35, y+s*0.15, s*0.25, s*0.6); break;
    case B.DRIED_KELP_BLOCK:
      ctx.fillStyle = '#2a4a20'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#3a5a30'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.35, s*0.35); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.4, s*0.4); break;
    case B.STRING:
      ctx.fillStyle = '#e8e8e8'; ctx.fillRect(x+s*0.2, y+s*0.45, s*0.6, s*0.1);
      ctx.fillRect(x+s*0.25, y+s*0.35, s*0.15, s*0.3); ctx.fillRect(x+s*0.6, y+s*0.35, s*0.15, s*0.3); break;
    case B.COBWEB:
      ctx.fillStyle = 'rgba(220, 220, 220, 0.6)';
      ctx.fillRect(x+s*0.45, y, s*0.1, s); ctx.fillRect(x, y+s*0.45, s, s*0.1);
      ctx.fillRect(x+s*0.1, y+s*0.1, s*0.8, s*0.05); ctx.fillRect(x+s*0.1, y+s*0.85, s*0.8, s*0.05);
      ctx.fillRect(x+s*0.15, y+s*0.3, s*0.7, s*0.05); ctx.fillRect(x+s*0.15, y+s*0.65, s*0.7, s*0.05); break;
    case B.BUCKET:
      ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.2, y+s*0.25, s*0.6, s*0.6);
      ctx.fillStyle = '#606060'; ctx.fillRect(x+s*0.25, y+s*0.35, s*0.5, s*0.45);
      ctx.fillStyle = '#a0a0a0'; ctx.fillRect(x+s*0.3, y+s*0.15, s*0.4, s*0.15); break;
    case B.WATER_BUCKET:
      ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.2, y+s*0.25, s*0.6, s*0.6);
      ctx.fillStyle = '#3080d0'; ctx.fillRect(x+s*0.25, y+s*0.35, s*0.5, s*0.45);
      ctx.fillStyle = '#a0a0a0'; ctx.fillRect(x+s*0.3, y+s*0.15, s*0.4, s*0.15); break;
    case B.LAVA_BUCKET:
      ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.2, y+s*0.25, s*0.6, s*0.6);
      ctx.fillStyle = '#d04000'; ctx.fillRect(x+s*0.25, y+s*0.35, s*0.5, s*0.45);
      ctx.fillStyle = '#f06000'; ctx.fillRect(x+s*0.3, y+s*0.4, s*0.35, s*0.25);
      ctx.fillStyle = '#a0a0a0'; ctx.fillRect(x+s*0.3, y+s*0.15, s*0.4, s*0.15); break;

    // ===== DYES =====
    case B.WHITE_DYE: ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.ORANGE_DYE: ctx.fillStyle = '#ff8000'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.MAGENTA_DYE: ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.LIGHT_BLUE_DYE: ctx.fillStyle = '#80c0ff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.YELLOW_DYE: ctx.fillStyle = '#ffff00'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.LIME_DYE: ctx.fillStyle = '#80ff00'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.PINK_DYE: ctx.fillStyle = '#ff80c0'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.GRAY_DYE: ctx.fillStyle = '#808080'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.CYAN_DYE: ctx.fillStyle = '#00ffff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.PURPLE_DYE: ctx.fillStyle = '#8000ff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.BLUE_DYE: ctx.fillStyle = '#0000ff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.BROWN_DYE: ctx.fillStyle = '#804000'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.GREEN_DYE: ctx.fillStyle = '#008000'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.RED_DYE: ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.BLACK_DYE: ctx.fillStyle = '#202020'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;

    // ===== MISC ITEMS =====
    case B.GUNPOWDER:
      ctx.fillStyle = '#333'; for(let i=0;i<8;i++) ctx.fillRect(x+Math.random()*s*0.6+s*0.2, y+Math.random()*s*0.6+s*0.2, s*0.1, s*0.1); break;
    case B.SLIMEBALL:
      ctx.fillStyle = '#80ff80'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.35, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#40c040'; ctx.beginPath(); ctx.arc(x+s*0.4, y+s*0.4, s*0.1, 0, Math.PI*2); ctx.fill(); break;
    case B.HONEYCOMB:
      ctx.fillStyle = '#e0a020'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6);
      ctx.fillStyle = '#c08010'; ctx.fillRect(x+s*0.3, y+s*0.35, s*0.15, s*0.15); ctx.fillRect(x+s*0.55, y+s*0.5, s*0.15, s*0.15); break;
    case B.INK_SAC:
      ctx.fillStyle = '#202020'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.PAPER:
      ctx.fillStyle = '#f0f0e0'; ctx.fillRect(x+s*0.2, y+s*0.15, s*0.6, s*0.7);
      ctx.fillStyle = '#ccc'; ctx.fillRect(x+s*0.25, y+s*0.3, s*0.5, s*0.05); ctx.fillRect(x+s*0.25, y+s*0.45, s*0.5, s*0.05); break;
    case B.BOOK:
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x+s*0.2, y+s*0.15, s*0.6, s*0.7);
      ctx.fillStyle = '#f0e8d0'; ctx.fillRect(x+s*0.25, y+s*0.2, s*0.5, s*0.6); break;
    case B.ARROW:
      ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.45, y+s*0.2, s*0.1, s*0.6);
      ctx.fillStyle = '#808080'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.1); ctx.lineTo(x+s*0.35, y+s*0.3); ctx.lineTo(x+s*0.65, y+s*0.3); ctx.fill();
      ctx.fillStyle = '#a04040'; ctx.fillRect(x+s*0.4, y+s*0.7, s*0.2, s*0.15); break;
    case B.BOW:
      ctx.strokeStyle = '#8B4513'; ctx.lineWidth = s*0.08; ctx.beginPath(); ctx.arc(x+s*0.7, y+s*0.5, s*0.4, Math.PI*0.7, Math.PI*1.3); ctx.stroke();
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.moveTo(x+s*0.35, y+s*0.2); ctx.lineTo(x+s*0.35, y+s*0.8); ctx.stroke(); break;
    case B.FISHING_ROD:
      ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.45, y+s*0.1, s*0.1, s*0.7);
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.15); ctx.lineTo(x+s*0.3, y+s*0.6); ctx.stroke(); break;
    case B.COMPASS:
      ctx.fillStyle = '#e0e0e0'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.35, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.2); ctx.lineTo(x+s*0.4, y+s*0.5); ctx.lineTo(x+s*0.6, y+s*0.5); ctx.fill(); break;
    case B.CLOCK:
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.35, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#333'; ctx.fillRect(x+s*0.48, y+s*0.3, s*0.04, s*0.25); ctx.fillRect(x+s*0.48, y+s*0.48, s*0.2, s*0.04); break;
    case B.MAP:
      ctx.fillStyle = '#e8d8b0'; ctx.fillRect(x+s*0.15, y+s*0.15, s*0.7, s*0.7);
      ctx.fillStyle = '#4a8'; ctx.fillRect(x+s*0.2, y+s*0.3, s*0.3, s*0.2); ctx.fillRect(x+s*0.5, y+s*0.5, s*0.2, s*0.15); break;
    case B.SHEARS:
      ctx.fillStyle = '#c0c0c0'; ctx.beginPath(); ctx.arc(x+s*0.35, y+s*0.35, s*0.15, 0, Math.PI*2); ctx.arc(x+s*0.65, y+s*0.35, s*0.15, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.3, y+s*0.5, s*0.15, s*0.35); ctx.fillRect(x+s*0.55, y+s*0.5, s*0.15, s*0.35); break;
    case B.LEAD:
      ctx.strokeStyle = '#8B8B00'; ctx.lineWidth = s*0.08; ctx.beginPath(); ctx.moveTo(x+s*0.2, y+s*0.2); ctx.lineTo(x+s*0.8, y+s*0.8); ctx.stroke();
      ctx.fillStyle = '#8B8B00'; ctx.beginPath(); ctx.arc(x+s*0.2, y+s*0.2, s*0.12, 0, Math.PI*2); ctx.fill(); break;

    // ===== TNT & BLOCKS =====
    case B.TNT:
      ctx.fillStyle = '#ff0000'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#333'; ctx.fillRect(x, y+s*0.3, s, s*0.4);
      ctx.fillStyle = '#fff'; ctx.font = s*0.25+'px sans-serif'; ctx.fillText('TNT', x+s*0.2, y+s*0.58); break;
    case B.NOTE_BLOCK:
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#5d3a1a'; for(let i=0;i<3;i++) ctx.fillRect(x+s*0.1, y+s*(0.2+i*0.3), s*0.8, s*0.1);
      ctx.fillStyle = '#333'; ctx.fillText('♪', x+s*0.35, y+s*0.7); break;
    case B.JUKEBOX:
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.1, 0, Math.PI*2); ctx.fill(); break;
    case B.ENCHANTING_TABLE:
      ctx.fillStyle = '#300030'; ctx.fillRect(x, y+s*0.5, s, s*0.5);
      ctx.fillStyle = '#ff0000'; ctx.fillRect(x+s*0.1, y+s*0.2, s*0.8, s*0.3);
      ctx.fillStyle = '#800000'; ctx.fillRect(x+s*0.2, y+s*0.3, s*0.6, s*0.15); break;
    case B.ANVIL:
      ctx.fillStyle = '#404040'; ctx.fillRect(x+s*0.1, y+s*0.7, s*0.8, s*0.2);
      ctx.fillRect(x+s*0.3, y+s*0.4, s*0.4, s*0.3);
      ctx.fillRect(x+s*0.15, y+s*0.15, s*0.7, s*0.25); break;
    case B.BREWING_STAND:
      ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.3, y+s*0.8, s*0.4, s*0.15);
      ctx.fillStyle = '#ffd700'; ctx.fillRect(x+s*0.45, y+s*0.2, s*0.1, s*0.6);
      ctx.fillStyle = '#a0a0a0'; ctx.fillRect(x+s*0.2, y+s*0.3, s*0.6, s*0.1); break;
    case B.CAULDRON:
      ctx.fillStyle = '#505050'; ctx.fillRect(x+s*0.1, y+s*0.25, s*0.8, s*0.7);
      ctx.fillStyle = '#333'; ctx.fillRect(x+s*0.2, y+s*0.35, s*0.6, s*0.5); break;
    case B.HOPPER:
      ctx.fillStyle = '#505050'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.8, s*0.4);
      ctx.fillRect(x+s*0.3, y+s*0.5, s*0.4, s*0.4); break;
    case B.RAIL:
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x+s*0.1, y+s*0.3, s*0.15, s*0.4); ctx.fillRect(x+s*0.75, y+s*0.3, s*0.15, s*0.4);
      ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.15, y+s*0.45, s*0.7, s*0.1); break;
    case B.POWERED_RAIL:
      ctx.fillStyle = '#ffd700'; ctx.fillRect(x+s*0.1, y+s*0.3, s*0.15, s*0.4); ctx.fillRect(x+s*0.75, y+s*0.3, s*0.15, s*0.4);
      ctx.fillStyle = '#ff0000'; ctx.fillRect(x+s*0.15, y+s*0.45, s*0.7, s*0.1); break;
    case B.DETECTOR_RAIL:
      ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.1, y+s*0.3, s*0.15, s*0.4); ctx.fillRect(x+s*0.75, y+s*0.3, s*0.15, s*0.4);
      ctx.fillStyle = '#ff0000'; ctx.fillRect(x+s*0.3, y+s*0.4, s*0.4, s*0.2); break;
    case B.PISTON:
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x, y+s*0.5, s, s*0.5);
      ctx.fillStyle = '#c0c0c0'; ctx.fillRect(x+s*0.1, y, s*0.8, s*0.5); break;
    case B.STICKY_PISTON:
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x, y+s*0.5, s, s*0.5);
      ctx.fillStyle = '#80c040'; ctx.fillRect(x+s*0.1, y, s*0.8, s*0.5); break;
    case B.OBSERVER:
      ctx.fillStyle = '#606060'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#400000'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.15, s*0.15); ctx.fillRect(x+s*0.55, y+s*0.3, s*0.15, s*0.15); break;
    case B.DISPENSER:
      ctx.fillStyle = '#808080'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#333'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.4, s*0.4); break;
    case B.DROPPER:
      ctx.fillStyle = '#808080'; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#444'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.7); ctx.lineTo(x+s*0.3, y+s*0.3); ctx.lineTo(x+s*0.7, y+s*0.3); ctx.fill(); break;
    case B.GLASS_PANE:
      ctx.fillStyle = 'rgba(200,220,255,0.4)'; ctx.fillRect(x+s*0.45, y, s*0.1, s); break;
    case B.IRON_BARS:
      ctx.fillStyle = '#808080'; for(let i=0;i<3;i++) ctx.fillRect(x+s*(0.25+i*0.2), y, s*0.08, s); break;

    // ===== FLOWERS =====
    case B.DANDELION: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#ffff00'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.2, 0, Math.PI*2); ctx.fill(); break;
    case B.POPPY: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.2, 0, Math.PI*2); ctx.fill(); break;
    case B.BLUE_ORCHID: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#00bfff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.2, 0, Math.PI*2); ctx.fill(); break;
    case B.ALLIUM: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.3, s*0.22, 0, Math.PI*2); ctx.fill(); break;
    case B.AZURE_BLUET: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.15, 0, Math.PI*2); ctx.fill(); break;
    case B.RED_TULIP: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#ff3030'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.15); ctx.lineTo(x+s*0.3, y+s*0.5); ctx.lineTo(x+s*0.7, y+s*0.5); ctx.fill(); break;
    case B.ORANGE_TULIP: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#ff8000'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.15); ctx.lineTo(x+s*0.3, y+s*0.5); ctx.lineTo(x+s*0.7, y+s*0.5); ctx.fill(); break;
    case B.WHITE_TULIP: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.15); ctx.lineTo(x+s*0.3, y+s*0.5); ctx.lineTo(x+s*0.7, y+s*0.5); ctx.fill(); break;
    case B.PINK_TULIP: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#ff80c0'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.15); ctx.lineTo(x+s*0.3, y+s*0.5); ctx.lineTo(x+s*0.7, y+s*0.5); ctx.fill(); break;
    case B.OXEYE_DAISY: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#ff0'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.08, 0, Math.PI*2); ctx.fill(); break;
    case B.CORNFLOWER: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#4169e1'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.2, 0, Math.PI*2); ctx.fill(); break;
    case B.LILY_OF_VALLEY: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.3, s*0.1, s*0.6); ctx.fillStyle = '#fff'; for(let i=0;i<3;i++) ctx.beginPath(), ctx.arc(x+s*0.35, y+s*(0.25+i*0.15), s*0.08, 0, Math.PI*2), ctx.fill(); break;
    case B.SUNFLOWER: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.45); ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.25, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#8B4513'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.12, 0, Math.PI*2); ctx.fill(); break;
    case B.LILAC: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.6, s*0.1, s*0.35); ctx.fillStyle = '#dda0dd'; ctx.fillRect(x+s*0.3, y+s*0.15, s*0.4, s*0.5); break;
    case B.ROSE_BUSH: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.6, s*0.1, s*0.35); ctx.fillStyle = '#ff4040'; ctx.beginPath(); ctx.arc(x+s*0.35, y+s*0.3, s*0.15, 0, Math.PI*2); ctx.arc(x+s*0.65, y+s*0.35, s*0.15, 0, Math.PI*2); ctx.fill(); break;
    case B.PEONY: ctx.fillStyle = '#228B22'; ctx.fillRect(x+s*0.45, y+s*0.6, s*0.1, s*0.35); ctx.fillStyle = '#ffb6c1'; ctx.fillRect(x+s*0.2, y+s*0.15, s*0.6, s*0.45); break;
    case B.WITHER_ROSE: ctx.fillStyle = '#333'; ctx.fillRect(x+s*0.45, y+s*0.5, s*0.1, s*0.4); ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.35, s*0.2, 0, Math.PI*2); ctx.fill(); break;

    // ===== BEDS (simplified view) =====
    case B.WHITE_BED: case B.ORANGE_BED: case B.MAGENTA_BED: case B.LIGHT_BLUE_BED: case B.YELLOW_BED:
    case B.LIME_BED: case B.PINK_BED: case B.GRAY_BED: case B.CYAN_BED: case B.PURPLE_BED:
    case B.BLUE_BED: case B.BROWN_BED: case B.GREEN_BED: case B.RED_BED: case B.BLACK_BED:
      const bedColors = {[B.WHITE_BED]:'#fff',[B.ORANGE_BED]:'#ff8000',[B.MAGENTA_BED]:'#ff00ff',[B.LIGHT_BLUE_BED]:'#80c0ff',[B.YELLOW_BED]:'#ffff00',[B.LIME_BED]:'#80ff00',[B.PINK_BED]:'#ff80c0',[B.GRAY_BED]:'#808080',[B.CYAN_BED]:'#00ffff',[B.PURPLE_BED]:'#8000ff',[B.BLUE_BED]:'#0000ff',[B.BROWN_BED]:'#804000',[B.GREEN_BED]:'#008000',[B.RED_BED]:'#ff0000',[B.BLACK_BED]:'#202020'};
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x, y+s*0.7, s, s*0.25);
      ctx.fillStyle = bedColors[type]||'#fff'; ctx.fillRect(x+s*0.05, y+s*0.4, s*0.9, s*0.3);
      ctx.fillStyle = '#fff'; ctx.fillRect(x+s*0.1, y+s*0.45, s*0.25, s*0.2); break;

    // ===== DOORS (simplified) =====
    case B.OAK_DOOR: case B.BIRCH_DOOR: case B.SPRUCE_DOOR: case B.JUNGLE_DOOR: case B.ACACIA_DOOR: case B.DARK_OAK_DOOR:
      const doorColors = {[B.OAK_DOOR]:'#b8924a',[B.BIRCH_DOOR]:'#d4c89a',[B.SPRUCE_DOOR]:'#6b5039',[B.JUNGLE_DOOR]:'#a87e53',[B.ACACIA_DOOR]:'#c45e2b',[B.DARK_OAK_DOOR]:'#4a3525'};
      ctx.fillStyle = doorColors[type]||'#b8924a'; ctx.fillRect(x+s*0.15, y+s*0.05, s*0.7, s*0.9);
      ctx.fillStyle = '#5d3a1a'; ctx.fillRect(x+s*0.6, y+s*0.45, s*0.12, s*0.12); break;
    case B.IRON_DOOR:
      ctx.fillStyle = '#c0c0c0'; ctx.fillRect(x+s*0.15, y+s*0.05, s*0.7, s*0.9);
      ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.25, y+s*0.15, s*0.2, s*0.25); ctx.fillRect(x+s*0.55, y+s*0.15, s*0.2, s*0.25); break;
    case B.CRIMSON_DOOR: ctx.fillStyle = '#8b0000'; ctx.fillRect(x+s*0.15, y+s*0.05, s*0.7, s*0.9); ctx.fillStyle = '#500'; ctx.fillRect(x+s*0.6, y+s*0.45, s*0.12, s*0.12); break;
    case B.WARPED_DOOR: ctx.fillStyle = '#008b8b'; ctx.fillRect(x+s*0.15, y+s*0.05, s*0.7, s*0.9); ctx.fillStyle = '#055'; ctx.fillRect(x+s*0.6, y+s*0.45, s*0.12, s*0.12); break;

    // ===== TRAPDOORS =====
    case B.OAK_TRAPDOOR: ctx.fillStyle = '#b8924a'; ctx.fillRect(x+s*0.1, y+s*0.35, s*0.8, s*0.3); ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.15, y+s*0.42, s*0.7, s*0.06); ctx.fillRect(x+s*0.15, y+s*0.52, s*0.7, s*0.06); break;
    case B.IRON_TRAPDOOR: ctx.fillStyle = '#c0c0c0'; ctx.fillRect(x+s*0.1, y+s*0.35, s*0.8, s*0.3); ctx.fillStyle = '#808080'; for(let i=0;i<4;i++) ctx.fillRect(x+s*(0.15+i*0.18), y+s*0.4, s*0.12, s*0.2); break;

    // ===== FENCES =====
    case B.OAK_FENCE: ctx.fillStyle = '#b8924a'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.15, s*0.7); ctx.fillRect(x+s*0.65, y+s*0.2, s*0.15, s*0.7); ctx.fillRect(x+s*0.2, y+s*0.35, s*0.6, s*0.1); ctx.fillRect(x+s*0.2, y+s*0.6, s*0.6, s*0.1); break;
    case B.OAK_FENCE_GATE: ctx.fillStyle = '#b8924a'; ctx.fillRect(x+s*0.1, y+s*0.25, s*0.8, s*0.5); ctx.fillStyle = '#222'; ctx.fillRect(x+s*0.45, y+s*0.4, s*0.1, s*0.2); break;
    case B.NETHER_BRICK_FENCE: ctx.fillStyle = '#300'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.15, s*0.7); ctx.fillRect(x+s*0.65, y+s*0.2, s*0.15, s*0.7); ctx.fillRect(x+s*0.2, y+s*0.35, s*0.6, s*0.1); ctx.fillRect(x+s*0.2, y+s*0.6, s*0.6, s*0.1); break;

    // ===== SIGN =====
    case B.OAK_SIGN: ctx.fillStyle = '#b8924a'; ctx.fillRect(x+s*0.1, y+s*0.2, s*0.8, s*0.4); ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.45, y+s*0.6, s*0.1, s*0.3); break;

    // ===== BOATS & MINECARTS =====
    case B.OAK_BOAT: ctx.fillStyle = '#b8924a'; ctx.beginPath(); ctx.moveTo(x+s*0.1, y+s*0.4); ctx.lineTo(x+s*0.5, y+s*0.8); ctx.lineTo(x+s*0.9, y+s*0.4); ctx.lineTo(x+s*0.8, y+s*0.3); ctx.lineTo(x+s*0.2, y+s*0.3); ctx.fill(); break;
    case B.MINECART: ctx.fillStyle = '#606060'; ctx.beginPath(); ctx.moveTo(x+s*0.1, y+s*0.3); ctx.lineTo(x+s*0.2, y+s*0.7); ctx.lineTo(x+s*0.8, y+s*0.7); ctx.lineTo(x+s*0.9, y+s*0.3); ctx.fill(); ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(x+s*0.3, y+s*0.8, s*0.1, 0, Math.PI*2); ctx.arc(x+s*0.7, y+s*0.8, s*0.1, 0, Math.PI*2); ctx.fill(); break;
    case B.CHEST_MINECART: ctx.fillStyle = '#606060'; ctx.beginPath(); ctx.moveTo(x+s*0.1, y+s*0.4); ctx.lineTo(x+s*0.2, y+s*0.75); ctx.lineTo(x+s*0.8, y+s*0.75); ctx.lineTo(x+s*0.9, y+s*0.4); ctx.fill(); ctx.fillStyle = '#8B4513'; ctx.fillRect(x+s*0.25, y+s*0.2, s*0.5, s*0.35); break;
    case B.HOPPER_MINECART: ctx.fillStyle = '#606060'; ctx.beginPath(); ctx.moveTo(x+s*0.1, y+s*0.4); ctx.lineTo(x+s*0.2, y+s*0.75); ctx.lineTo(x+s*0.8, y+s*0.75); ctx.lineTo(x+s*0.9, y+s*0.4); ctx.fill(); ctx.fillStyle = '#505050'; ctx.fillRect(x+s*0.3, y+s*0.15, s*0.4, s*0.3); break;
    case B.TNT_MINECART: ctx.fillStyle = '#606060'; ctx.beginPath(); ctx.moveTo(x+s*0.1, y+s*0.4); ctx.lineTo(x+s*0.2, y+s*0.75); ctx.lineTo(x+s*0.8, y+s*0.75); ctx.lineTo(x+s*0.9, y+s*0.4); ctx.fill(); ctx.fillStyle = '#ff0000'; ctx.fillRect(x+s*0.25, y+s*0.15, s*0.5, s*0.35); break;

    // ===== REDSTONE ITEMS =====
    case B.REDSTONE_TORCH: ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.45, y+s*0.4, s*0.1, s*0.5); ctx.fillStyle = '#ff0000'; ctx.fillRect(x+s*0.4, y+s*0.2, s*0.2, s*0.25); break;
    case B.LEVER: ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.35, y+s*0.6, s*0.3, s*0.3); ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.45, y+s*0.2, s*0.1, s*0.45); break;
    case B.STONE_BUTTON: ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.35, y+s*0.4, s*0.3, s*0.2); break;
    case B.STONE_PRESSURE_PLATE: ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.1, y+s*0.45, s*0.8, s*0.1); break;
    case B.TRIPWIRE_HOOK: ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.35, y+s*0.3, s*0.3, s*0.5); ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.4, y+s*0.15, s*0.2, s*0.2); break;
    case B.DAYLIGHT_DETECTOR: ctx.fillStyle = '#fff'; ctx.fillRect(x, y+s*0.6, s, s*0.3); ctx.fillStyle = '#80a0ff'; ctx.fillRect(x+s*0.1, y+s*0.65, s*0.8, s*0.15); break;
    case B.REPEATER: ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.1, y+s*0.6, s*0.8, s*0.25); ctx.fillStyle = '#ff0000'; ctx.fillRect(x+s*0.3, y+s*0.35, s*0.15, s*0.25); ctx.fillRect(x+s*0.55, y+s*0.35, s*0.15, s*0.25); break;
    case B.COMPARATOR: ctx.fillStyle = '#808080'; ctx.fillRect(x+s*0.1, y+s*0.6, s*0.8, s*0.25); ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.35); ctx.lineTo(x+s*0.3, y+s*0.55); ctx.lineTo(x+s*0.7, y+s*0.55); ctx.fill(); break;

    // ===== QUARTZ BLOCKS =====
    case B.QUARTZ_BLOCK: ctx.fillStyle = '#f0f0f0'; ctx.fillRect(x, y, s, s); break;
    case B.QUARTZ_PILLAR: ctx.fillStyle = '#f0f0f0'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#ddd'; ctx.fillRect(x+s*0.1, y, s*0.1, s); ctx.fillRect(x+s*0.8, y, s*0.1, s); break;
    case B.SMOOTH_QUARTZ: ctx.fillStyle = '#f8f8f8'; ctx.fillRect(x, y, s, s); break;
    case B.CHISELED_QUARTZ: ctx.fillStyle = '#f0f0f0'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#ddd'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6); break;

    // ===== GLAZED TERRACOTTA =====
    case B.WHITE_GLAZED_TERRACOTTA: ctx.fillStyle = '#fff'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI); ctx.fill(); break;
    case B.ORANGE_GLAZED_TERRACOTTA: ctx.fillStyle = '#ff8000'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#c06000'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI); ctx.fill(); break;
    case B.MAGENTA_GLAZED_TERRACOTTA: ctx.fillStyle = '#ff00ff'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#c000c0'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI); ctx.fill(); break;

    // ===== END ROD & PURPUR =====
    case B.END_ROD: ctx.fillStyle = '#fff'; ctx.fillRect(x+s*0.45, y+s*0.1, s*0.1, s*0.8); ctx.fillStyle = '#d8bfd8'; ctx.fillRect(x+s*0.4, y+s*0.75, s*0.2, s*0.15); break;
    case B.PURPUR_STAIRS: ctx.fillStyle = '#a860a8'; ctx.fillRect(x, y+s*0.5, s, s*0.5); ctx.fillRect(x+s*0.5, y, s*0.5, s*0.5); break;
    case B.PURPUR_SLAB: ctx.fillStyle = '#a860a8'; ctx.fillRect(x, y+s*0.5, s, s*0.5); break;

    // ===== CARPETS =====
    case B.WHITE_CARPET: ctx.fillStyle = '#fff'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.ORANGE_CARPET: ctx.fillStyle = '#ff8000'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.MAGENTA_CARPET: ctx.fillStyle = '#ff00ff'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.LIGHT_BLUE_CARPET: ctx.fillStyle = '#80c0ff'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.YELLOW_CARPET: ctx.fillStyle = '#ffff00'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.LIME_CARPET: ctx.fillStyle = '#80ff00'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.PINK_CARPET: ctx.fillStyle = '#ff80c0'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.GRAY_CARPET: ctx.fillStyle = '#808080'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.CYAN_CARPET: ctx.fillStyle = '#00ffff'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.PURPLE_CARPET: ctx.fillStyle = '#8000ff'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.BLUE_CARPET: ctx.fillStyle = '#0000ff'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.BROWN_CARPET: ctx.fillStyle = '#804000'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.GREEN_CARPET: ctx.fillStyle = '#008000'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.RED_CARPET: ctx.fillStyle = '#ff0000'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;
    case B.BLACK_CARPET: ctx.fillStyle = '#202020'; ctx.fillRect(x, y+s*0.85, s, s*0.1); break;

    // ===== BANNER =====
    case B.WHITE_BANNER: ctx.fillStyle = '#fff'; ctx.fillRect(x+s*0.25, y+s*0.1, s*0.5, s*0.65); ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.45, y+s*0.75, s*0.1, s*0.2); break;

    // ===== CANDLE =====
    case B.CANDLE: ctx.fillStyle = '#e0d0a0'; ctx.fillRect(x+s*0.4, y+s*0.4, s*0.2, s*0.5); ctx.fillStyle = '#ff8000'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.3, s*0.1, 0, Math.PI*2); ctx.fill(); break;

    // ===== SCULK =====
    case B.SCULK: ctx.fillStyle = '#0a2a3a'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#0ff'; for(let i=0;i<5;i++) ctx.fillRect(x+Math.random()*s*0.8+s*0.1, y+Math.random()*s*0.8+s*0.1, s*0.08, s*0.08); break;
    case B.SCULK_SENSOR: ctx.fillStyle = '#0a2a3a'; ctx.fillRect(x, y, s, s); ctx.fillStyle = '#0ff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.3, s*0.15, 0, Math.PI*2); ctx.fill(); break;

    // ===== MISC ITEMS =====
    case B.SHIELD: ctx.fillStyle = '#8B4513'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.1); ctx.lineTo(x+s*0.15, y+s*0.25); ctx.lineTo(x+s*0.15, y+s*0.6); ctx.lineTo(x+s*0.5, y+s*0.9); ctx.lineTo(x+s*0.85, y+s*0.6); ctx.lineTo(x+s*0.85, y+s*0.25); ctx.fill(); ctx.fillStyle = '#c0c0c0'; ctx.fillRect(x+s*0.3, y+s*0.35, s*0.4, s*0.35); break;
    case B.TRIDENT: ctx.fillStyle = '#40a0a0'; ctx.fillRect(x+s*0.45, y+s*0.3, s*0.1, s*0.6); ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.1); ctx.lineTo(x+s*0.35, y+s*0.35); ctx.lineTo(x+s*0.65, y+s*0.35); ctx.fill(); ctx.fillRect(x+s*0.2, y+s*0.25, s*0.1, s*0.2); ctx.fillRect(x+s*0.7, y+s*0.25, s*0.1, s*0.2); break;
    case B.CROSSBOW: ctx.fillStyle = '#8B4513'; ctx.fillRect(x+s*0.2, y+s*0.45, s*0.6, s*0.1); ctx.fillRect(x+s*0.45, y+s*0.3, s*0.1, s*0.55); ctx.strokeStyle = '#ccc'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.moveTo(x+s*0.2, y+s*0.5); ctx.lineTo(x+s*0.45, y+s*0.35); ctx.lineTo(x+s*0.8, y+s*0.5); ctx.stroke(); break;
    case B.SPYGLASS: ctx.fillStyle = '#c87533'; ctx.fillRect(x+s*0.35, y+s*0.15, s*0.3, s*0.7); ctx.fillStyle = '#80c0ff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.25, s*0.12, 0, Math.PI*2); ctx.fill(); break;
    case B.BRUSH: ctx.fillStyle = '#c87533'; ctx.fillRect(x+s*0.45, y+s*0.15, s*0.1, s*0.5); ctx.fillStyle = '#f0e0c0'; ctx.fillRect(x+s*0.35, y+s*0.65, s*0.3, s*0.2); break;
    case B.RECOVERY_COMPASS: ctx.fillStyle = '#40e0d0'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.35, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#0a5050'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.2); ctx.lineTo(x+s*0.4, y+s*0.5); ctx.lineTo(x+s*0.6, y+s*0.5); ctx.fill(); break;
    case B.ECHO_SHARD: ctx.fillStyle = '#0a4a5a'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.1); ctx.lineTo(x+s*0.2, y+s*0.5); ctx.lineTo(x+s*0.5, y+s*0.9); ctx.lineTo(x+s*0.8, y+s*0.5); ctx.fill(); break;
    case B.CLAY_BALL: ctx.fillStyle = '#a0a0b0'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.3, 0, Math.PI*2); ctx.fill(); break;
    case B.BRICK_ITEM: ctx.fillStyle = '#a04020'; ctx.fillRect(x+s*0.2, y+s*0.35, s*0.6, s*0.3); break;
    case B.FLOWER_POT: ctx.fillStyle = '#a04020'; ctx.beginPath(); ctx.moveTo(x+s*0.25, y+s*0.3); ctx.lineTo(x+s*0.3, y+s*0.85); ctx.lineTo(x+s*0.7, y+s*0.85); ctx.lineTo(x+s*0.75, y+s*0.3); ctx.fill(); break;
    case B.ARMOR_STAND: ctx.fillStyle = '#8B6914'; ctx.fillRect(x+s*0.45, y+s*0.3, s*0.1, s*0.6); ctx.fillRect(x+s*0.2, y+s*0.35, s*0.6, s*0.08); ctx.fillRect(x+s*0.35, y+s*0.85, s*0.3, s*0.1); break;
    case B.ITEM_FRAME: ctx.fillStyle = '#8B4513'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.8, s*0.8); ctx.fillStyle = '#000'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6); break;
    case B.GLOW_ITEM_FRAME: ctx.fillStyle = '#8B4513'; ctx.fillRect(x+s*0.1, y+s*0.1, s*0.8, s*0.8); ctx.fillStyle = '#80ff80'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6); break;
    case B.SKELETON_SKULL: ctx.fillStyle = '#e0e0e0'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6); ctx.fillStyle = '#333'; ctx.fillRect(x+s*0.28, y+s*0.35, s*0.15, s*0.15); ctx.fillRect(x+s*0.57, y+s*0.35, s*0.15, s*0.15); break;
    case B.WITHER_SKELETON_SKULL: ctx.fillStyle = '#303030'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6); ctx.fillStyle = '#000'; ctx.fillRect(x+s*0.28, y+s*0.35, s*0.15, s*0.15); ctx.fillRect(x+s*0.57, y+s*0.35, s*0.15, s*0.15); break;
    case B.ZOMBIE_HEAD: ctx.fillStyle = '#4a7a4a'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6); ctx.fillStyle = '#333'; ctx.fillRect(x+s*0.28, y+s*0.35, s*0.15, s*0.15); ctx.fillRect(x+s*0.57, y+s*0.35, s*0.15, s*0.15); break;
    case B.CREEPER_HEAD: ctx.fillStyle = '#40c040'; ctx.fillRect(x+s*0.2, y+s*0.2, s*0.6, s*0.6); ctx.fillStyle = '#000'; ctx.fillRect(x+s*0.3, y+s*0.3, s*0.12, s*0.12); ctx.fillRect(x+s*0.58, y+s*0.3, s*0.12, s*0.12); ctx.fillRect(x+s*0.4, y+s*0.45, s*0.2, s*0.25); break;
    case B.DRAGON_HEAD: ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x+s*0.15, y+s*0.2, s*0.7, s*0.5); ctx.fillStyle = '#800080'; ctx.fillRect(x+s*0.25, y+s*0.3, s*0.15, s*0.12); ctx.fillRect(x+s*0.6, y+s*0.3, s*0.15, s*0.12); break;
    case B.END_CRYSTAL:
      ctx.fillStyle = '#ff80ff'; ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.1); ctx.lineTo(x+s*0.2, y+s*0.5); ctx.lineTo(x+s*0.5, y+s*0.9); ctx.lineTo(x+s*0.8, y+s*0.5); ctx.fill();
      ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.15, 0, Math.PI*2); ctx.fill(); break;

    // ===== MUSIC DISCS =====
    case B.MUSIC_DISC_13: case B.MUSIC_DISC_CAT: case B.MUSIC_DISC_BLOCKS: case B.MUSIC_DISC_CHIRP:
    case B.MUSIC_DISC_FAR: case B.MUSIC_DISC_MALL: case B.MUSIC_DISC_MELLOHI: case B.MUSIC_DISC_STAL:
    case B.MUSIC_DISC_STRAD: case B.MUSIC_DISC_WARD: case B.MUSIC_DISC_11: case B.MUSIC_DISC_WAIT:
    case B.MUSIC_DISC_PIGSTEP: case B.MUSIC_DISC_OTHERSIDE:
      const discColors = {[B.MUSIC_DISC_13]:'#ffd700',[B.MUSIC_DISC_CAT]:'#00ff00',[B.MUSIC_DISC_BLOCKS]:'#ff8000',[B.MUSIC_DISC_CHIRP]:'#ff0000',[B.MUSIC_DISC_FAR]:'#00ffff',[B.MUSIC_DISC_MALL]:'#ff00ff',[B.MUSIC_DISC_MELLOHI]:'#ff80ff',[B.MUSIC_DISC_STAL]:'#404040',[B.MUSIC_DISC_STRAD]:'#ffffff',[B.MUSIC_DISC_WARD]:'#008000',[B.MUSIC_DISC_11]:'#202020',[B.MUSIC_DISC_WAIT]:'#00bfff',[B.MUSIC_DISC_PIGSTEP]:'#ffd700',[B.MUSIC_DISC_OTHERSIDE]:'#00ced1'};
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = discColors[type]||'#888'; ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.5, s*0.15, 0, Math.PI*2); ctx.fill(); break;

    // Catch-all for unrendered blocks
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
