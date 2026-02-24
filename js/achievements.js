// ============================================================
// Achievements System (발전과제)
// ============================================================

// Achievement definitions
const ACHIEVEMENTS = {
  // === Getting Started ===
  first_wood: {
    id: 'first_wood',
    name: '나무를 베다',
    description: '처음으로 나무 블록을 획득하세요',
    icon: B.WOOD,
    category: 'story'
  },
  first_planks: {
    id: 'first_planks',
    name: '판자 제작',
    description: '나무를 판자로 만드세요',
    icon: B.PLANKS,
    category: 'story'
  },
  craft_table: {
    id: 'craft_table',
    name: '작업대 만들기',
    description: '작업대를 제작하세요',
    icon: B.CRAFT_TABLE,
    category: 'story'
  },
  first_pickaxe: {
    id: 'first_pickaxe',
    name: '광부의 시작',
    description: '곡괭이를 제작하세요',
    icon: B.WOOD_PICKAXE,
    category: 'story'
  },

  // === Mining ===
  mine_stone: {
    id: 'mine_stone',
    name: '돌의 시대',
    description: '조약돌을 획득하세요',
    icon: B.COBBLESTONE,
    category: 'mining'
  },
  mine_coal: {
    id: 'mine_coal',
    name: '석탄 발견',
    description: '석탄을 채굴하세요',
    icon: B.COAL_ORE,
    category: 'mining'
  },
  mine_iron: {
    id: 'mine_iron',
    name: '철기 시대',
    description: '철광석을 채굴하세요',
    icon: B.IRON_ORE,
    category: 'mining'
  },
  mine_gold: {
    id: 'mine_gold',
    name: '황금빛 발견',
    description: '금광석을 채굴하세요',
    icon: B.GOLD_ORE,
    category: 'mining'
  },
  mine_diamond: {
    id: 'mine_diamond',
    name: '다이아몬드!',
    description: '다이아몬드를 채굴하세요',
    icon: B.DIAMOND_ORE,
    category: 'mining'
  },

  // === Tools ===
  stone_tools: {
    id: 'stone_tools',
    name: '업그레이드',
    description: '돌 도구를 제작하세요',
    icon: B.STONE_PICKAXE,
    category: 'tools'
  },
  iron_tools: {
    id: 'iron_tools',
    name: '철의 힘',
    description: '철 도구를 제작하세요',
    icon: B.IRON_PICKAXE,
    category: 'tools'
  },
  diamond_tools: {
    id: 'diamond_tools',
    name: '다이아몬드 시대',
    description: '다이아몬드 도구를 제작하세요',
    icon: B.DIAMOND_PICKAXE,
    category: 'tools'
  },
  netherite_tools: {
    id: 'netherite_tools',
    name: '최강의 도구',
    description: '네더라이트 도구를 제작하세요',
    icon: B.NETHERITE_PICKAXE,
    category: 'tools'
  },
  first_sword: {
    id: 'first_sword',
    name: '전사의 길',
    description: '검을 제작하세요',
    icon: B.WOOD_SWORD,
    category: 'tools'
  },

  // === Combat ===
  kill_zombie: {
    id: 'kill_zombie',
    name: '좀비 사냥꾼',
    description: '좀비를 처치하세요',
    icon: B.IRON_SWORD,
    category: 'combat'
  },
  kill_skeleton: {
    id: 'kill_skeleton',
    name: '뼈다귀 수집가',
    description: '스켈레톤을 처치하세요',
    icon: B.IRON_SWORD,
    category: 'combat'
  },
  kill_creeper: {
    id: 'kill_creeper',
    name: '폭발 방지',
    description: '크리퍼를 처치하세요',
    icon: B.IRON_SWORD,
    category: 'combat'
  },

  // === Armor ===
  first_armor: {
    id: 'first_armor',
    name: '방어의 시작',
    description: '방어구를 처음으로 착용하세요',
    icon: B.LEATHER_CHESTPLATE,
    category: 'armor'
  },
  full_leather: {
    id: 'full_leather',
    name: '가죽 세트',
    description: '가죽 방어구 풀세트를 착용하세요',
    icon: B.LEATHER_CHESTPLATE,
    category: 'armor'
  },
  full_iron: {
    id: 'full_iron',
    name: '철벽 수비',
    description: '철 방어구 풀세트를 착용하세요',
    icon: B.IRON_CHESTPLATE,
    category: 'armor'
  },
  full_diamond: {
    id: 'full_diamond',
    name: '다이아몬드 기사',
    description: '다이아몬드 방어구 풀세트를 착용하세요',
    icon: B.DIAMOND_CHESTPLATE,
    category: 'armor'
  },

  // === Exploration ===
  deep_dive: {
    id: 'deep_dive',
    name: '깊은 곳으로',
    description: 'Y좌표 100 이하로 내려가세요',
    icon: B.BEDROCK,
    category: 'explore'
  },
  surface_explorer: {
    id: 'surface_explorer',
    name: '탐험가',
    description: '스폰 지점에서 500블록 이상 이동하세요',
    icon: B.GRASS,
    category: 'explore'
  },

  // === Building ===
  build_house: {
    id: 'build_house',
    name: '건축가',
    description: '블록을 50개 이상 설치하세요',
    icon: B.BRICK,
    category: 'building'
  },
  master_builder: {
    id: 'master_builder',
    name: '마스터 건축가',
    description: '블록을 200개 이상 설치하세요',
    icon: B.BRICK,
    category: 'building'
  },
  legendary_builder: {
    id: 'legendary_builder',
    name: '전설의 건축가',
    description: '블록을 500개 이상 설치하세요',
    icon: B.BRICK,
    category: 'building'
  },

  // === Nether ===
  enter_nether: {
    id: 'enter_nether',
    name: '지옥으로',
    description: '네더에 처음으로 입장하세요',
    icon: B.NETHERRACK,
    category: 'nether'
  },
  mine_obsidian: {
    id: 'mine_obsidian',
    name: '흑요석 채굴',
    description: '흑요석을 채굴하세요',
    icon: B.OBSIDIAN,
    category: 'nether'
  },
  light_portal: {
    id: 'light_portal',
    name: '포탈 점화',
    description: '부싯돌과 부시로 포탈을 활성화하세요',
    icon: B.FLINT_AND_STEEL,
    category: 'nether'
  },
  kill_pigman: {
    id: 'kill_pigman',
    name: '돼지좀비 사냥',
    description: '좀비 피그맨을 처치하세요',
    icon: B.GOLD_NUGGET,
    category: 'nether'
  },
  kill_blaze: {
    id: 'kill_blaze',
    name: '블레이즈 사냥꾼',
    description: '블레이즈를 처치하세요',
    icon: B.BLAZE_ROD,
    category: 'nether'
  },
  kill_ghast: {
    id: 'kill_ghast',
    name: '가스트 퇴치',
    description: '가스트를 처치하세요',
    icon: B.GHAST_TEAR,
    category: 'nether'
  },
  get_blaze_rod: {
    id: 'get_blaze_rod',
    name: '불꽃의 막대',
    description: '블레이즈 막대를 획득하세요',
    icon: B.BLAZE_ROD,
    category: 'nether'
  },
  get_glowstone: {
    id: 'get_glowstone',
    name: '빛나는 돌',
    description: '발광석을 채굴하세요',
    icon: B.GLOWSTONE,
    category: 'nether'
  },
  mine_quartz: {
    id: 'mine_quartz',
    name: '네더 석영',
    description: '네더 석영 광석을 채굴하세요',
    icon: B.NETHER_QUARTZ_ORE,
    category: 'nether'
  },

  // === The End ===
  enter_end: {
    id: 'enter_end',
    name: '끝의 세계',
    description: '엔드에 처음으로 입장하세요',
    icon: B.END_STONE,
    category: 'end'
  },
  kill_enderman: {
    id: 'kill_enderman',
    name: '엔더맨 사냥',
    description: '엔더맨을 처치하세요',
    icon: B.ENDER_PEARL,
    category: 'end'
  },
  get_ender_pearl: {
    id: 'get_ender_pearl',
    name: '엔더 진주',
    description: '엔더 진주를 획득하세요',
    icon: B.ENDER_PEARL,
    category: 'end'
  },
  craft_eye_of_ender: {
    id: 'craft_eye_of_ender',
    name: '엔더의 눈',
    description: '엔더의 눈을 제작하세요',
    icon: B.EYE_OF_ENDER,
    category: 'end'
  },
  kill_dragon: {
    id: 'kill_dragon',
    name: '자유로운 끝!',
    description: '엔더 드래곤을 처치하세요',
    icon: B.DIAMOND_SWORD,
    category: 'end'
  },

  // === Animals & Hunting ===
  kill_pig: {
    id: 'kill_pig',
    name: '돼지 사냥',
    description: '돼지를 잡아 고기를 얻으세요',
    icon: B.PORKCHOP,
    category: 'hunting'
  },
  kill_cow: {
    id: 'kill_cow',
    name: '소 사냥',
    description: '소를 잡아 가죽을 얻으세요',
    icon: B.LEATHER,
    category: 'hunting'
  },
  kill_sheep: {
    id: 'kill_sheep',
    name: '양 사냥',
    description: '양을 잡아 양모를 얻으세요',
    icon: B.WOOL,
    category: 'hunting'
  },
  kill_chicken: {
    id: 'kill_chicken',
    name: '닭 사냥',
    description: '닭을 잡아 깃털을 얻으세요',
    icon: B.FEATHER,
    category: 'hunting'
  },

  // === Trading ===
  meet_villager: {
    id: 'meet_villager',
    name: '주민 만남',
    description: '주민과 대화를 시작하세요',
    icon: B.EMERALD,
    category: 'trading'
  },
  first_trade: {
    id: 'first_trade',
    name: '첫 거래',
    description: '주민과 거래를 완료하세요',
    icon: B.EMERALD,
    category: 'trading'
  },

  // === Survival ===
  take_damage: {
    id: 'take_damage',
    name: '아야!',
    description: '데미지를 받고 살아남으세요',
    icon: B.LEATHER_CHESTPLATE,
    category: 'survival'
  },
  near_death: {
    id: 'near_death',
    name: '죽음의 문턱',
    description: '체력 1칸 이하로 생존하세요',
    icon: B.IRON_SWORD,
    category: 'survival'
  },
  full_heal: {
    id: 'full_heal',
    name: '완전 회복',
    description: '체력을 최대로 회복하세요',
    icon: B.PORKCHOP,
    category: 'survival'
  },

  // === Mining Advanced ===
  mine_copper: {
    id: 'mine_copper',
    name: '구리 발견',
    description: '구리 광석을 채굴하세요',
    icon: B.COPPER_ORE,
    category: 'mining'
  },
  mine_emerald: {
    id: 'mine_emerald',
    name: '에메랄드 발견',
    description: '에메랄드를 채굴하세요',
    icon: B.EMERALD_ORE,
    category: 'mining'
  },
  mine_lapis: {
    id: 'mine_lapis',
    name: '청금석 발견',
    description: '청금석을 채굴하세요',
    icon: B.LAPIS_ORE,
    category: 'mining'
  },
  mine_redstone: {
    id: 'mine_redstone',
    name: '레드스톤 발견',
    description: '레드스톤을 채굴하세요',
    icon: B.REDSTONE_ORE,
    category: 'mining'
  },
  mine_100_blocks: {
    id: 'mine_100_blocks',
    name: '광부',
    description: '100개의 블록을 채굴하세요',
    icon: B.STONE_PICKAXE,
    category: 'mining'
  },
  mine_500_blocks: {
    id: 'mine_500_blocks',
    name: '숙련된 광부',
    description: '500개의 블록을 채굴하세요',
    icon: B.IRON_PICKAXE,
    category: 'mining'
  },

  // === Armor Advanced ===
  full_gold: {
    id: 'full_gold',
    name: '황금 기사',
    description: '금 방어구 풀세트를 착용하세요',
    icon: B.GOLD_CHESTPLATE,
    category: 'armor'
  },

  // === Exploration Advanced ===
  world_traveler: {
    id: 'world_traveler',
    name: '세계 여행자',
    description: '스폰 지점에서 1000블록 이상 이동하세요',
    icon: B.GRASS,
    category: 'explore'
  },
  cave_explorer: {
    id: 'cave_explorer',
    name: '동굴 탐험가',
    description: 'Y좌표 110 이하로 내려가세요',
    icon: B.COAL_ORE,
    category: 'explore'
  },
  bedrock_level: {
    id: 'bedrock_level',
    name: '기반암까지',
    description: '기반암 레벨에 도달하세요 (Y 118+)',
    icon: B.BEDROCK,
    category: 'explore'
  },
};

// Achievement state
let unlockedAchievements = {};
let achievementQueue = []; // Toast notification queue
let currentToast = null;
let toastTimer = 0;
let achievementsOpen = false;
let achievementScroll = 0;
let blocksPlaced = 0;

// Stats tracking
let gameStats = {
  blocksPlaced: 0,
  blocksMined: 0,
  mobsKilled: { zombie: 0, skeleton: 0, creeper: 0, pigman: 0, blaze: 0, ghast: 0, enderman: 0, dragon: 0 },
  animalsKilled: { pig: 0, cow: 0, sheep: 0, chicken: 0 },
  tradesCompleted: 0,
  damageTaken: 0,
  portalLit: false,
  enteredNether: false,
  enteredEnd: false,
};

// Load achievements (now loaded from world save, this resets for new session)
function loadAchievements() {
  // Achievements are now per-world and loaded via worldsave.js loadWorld()
  // This function resets to empty for fresh start
  unlockedAchievements = {};
  gameStats = {
    blocksPlaced: 0,
    blocksMined: 0,
    mobsKilled: { zombie: 0, skeleton: 0, creeper: 0, pigman: 0, blaze: 0, ghast: 0, enderman: 0, dragon: 0 },
    animalsKilled: { pig: 0, cow: 0, sheep: 0, chicken: 0 },
    tradesCompleted: 0,
    damageTaken: 0,
    portalLit: false,
    enteredNether: false,
    enteredEnd: false,
  };
}

// Save achievements (now saved via worldsave.js saveWorld())
function saveAchievements() {
  // Achievements are saved as part of world data in worldsave.js
  // This function is kept for compatibility but does nothing now
  // World auto-save handles persistence
}

// Check if achievement is unlocked
function hasAchievement(id) {
  return !!unlockedAchievements[id];
}

// Unlock an achievement
function unlockAchievement(id) {
  if (hasAchievement(id)) return;
  if (!ACHIEVEMENTS[id]) return;

  unlockedAchievements[id] = {
    unlockedAt: Date.now()
  };

  // Add to notification queue
  achievementQueue.push(ACHIEVEMENTS[id]);

  // Play achievement sound
  if (typeof playAchievementSound === 'function') playAchievementSound();

  saveAchievements();
}

// Check achievements based on item pickup
function checkItemAchievements(itemType) {
  switch (itemType) {
    case B.WOOD:
    case B.OAK_LOG:
    case B.BIRCH_LOG:
    case B.SPRUCE_LOG:
    case B.JUNGLE_LOG:
    case B.ACACIA_LOG:
    case B.DARK_OAK_LOG:
    case B.CRIMSON_STEM:
    case B.WARPED_STEM:
      unlockAchievement('first_wood');
      break;
    case B.PLANKS:
    case B.OAK_PLANKS:
    case B.BIRCH_PLANKS:
    case B.SPRUCE_PLANKS:
    case B.JUNGLE_PLANKS:
    case B.ACACIA_PLANKS:
    case B.DARK_OAK_PLANKS:
      unlockAchievement('first_planks');
      break;
    case B.COBBLESTONE:
      unlockAchievement('mine_stone');
      break;
    case B.COAL_ORE:
    case B.DEEPSLATE_COAL_ORE:
    case B.COAL:
      unlockAchievement('mine_coal');
      break;
    case B.IRON_ORE:
    case B.DEEPSLATE_IRON_ORE:
    case B.RAW_IRON:
      unlockAchievement('mine_iron');
      break;
    case B.GOLD_ORE:
    case B.DEEPSLATE_GOLD_ORE:
    case B.RAW_GOLD:
      unlockAchievement('mine_gold');
      break;
    case B.DIAMOND_ORE:
    case B.DEEPSLATE_DIAMOND_ORE:
    case B.DIAMOND:
      unlockAchievement('mine_diamond');
      break;
    case B.COPPER_ORE:
    case B.DEEPSLATE_COPPER_ORE:
    case B.RAW_COPPER:
      unlockAchievement('mine_copper');
      break;
    case B.EMERALD_ORE:
    case B.DEEPSLATE_EMERALD_ORE:
    case B.EMERALD:
      unlockAchievement('mine_emerald');
      break;
    case B.LAPIS_ORE:
    case B.DEEPSLATE_LAPIS_ORE:
    case B.LAPIS:
      unlockAchievement('mine_lapis');
      break;
    case B.REDSTONE_ORE:
    case B.DEEPSLATE_REDSTONE_ORE:
    case B.REDSTONE:
      unlockAchievement('mine_redstone');
      break;
    case B.OBSIDIAN:
      unlockAchievement('mine_obsidian');
      break;
    case B.GLOWSTONE:
      unlockAchievement('get_glowstone');
      break;
    case B.NETHER_QUARTZ_ORE:
      unlockAchievement('mine_quartz');
      break;
    case B.BLAZE_ROD:
      unlockAchievement('get_blaze_rod');
      break;
    case B.ENDER_PEARL:
      unlockAchievement('get_ender_pearl');
      break;
  }
}

// Check achievements based on crafting
function checkCraftAchievements(itemType) {
  switch (itemType) {
    case B.PLANKS:
    case B.OAK_PLANKS:
    case B.BIRCH_PLANKS:
    case B.SPRUCE_PLANKS:
    case B.JUNGLE_PLANKS:
    case B.ACACIA_PLANKS:
    case B.DARK_OAK_PLANKS:
      unlockAchievement('first_planks');
      break;
    case B.CRAFT_TABLE:
      unlockAchievement('craft_table');
      break;
    case B.WOOD_PICKAXE:
    case B.WOOD_AXE:
    case B.WOOD_SHOVEL:
      unlockAchievement('first_pickaxe');
      break;
    case B.STONE_PICKAXE:
    case B.STONE_AXE:
    case B.STONE_SHOVEL:
    case B.STONE_SWORD:
      unlockAchievement('stone_tools');
      break;
    case B.IRON_PICKAXE:
    case B.IRON_AXE:
    case B.IRON_SHOVEL:
    case B.IRON_SWORD:
      unlockAchievement('iron_tools');
      break;
    case B.DIAMOND_PICKAXE:
    case B.DIAMOND_AXE:
    case B.DIAMOND_SHOVEL:
    case B.DIAMOND_SWORD:
      unlockAchievement('diamond_tools');
      break;
    case B.NETHERITE_PICKAXE:
    case B.NETHERITE_AXE:
    case B.NETHERITE_SHOVEL:
    case B.NETHERITE_SWORD:
      unlockAchievement('netherite_tools');
      break;
    case B.WOOD_SWORD:
    case B.STONE_SWORD:
      unlockAchievement('first_sword');
      break;
    case B.FLINT_AND_STEEL:
      // Crafted flint and steel
      break;
    case B.EYE_OF_ENDER:
      unlockAchievement('craft_eye_of_ender');
      break;
  }
}

// Check armor achievements
function checkArmorAchievements() {
  if (!player || !player.armor) return;

  const armor = player.armor;
  const hasAnyArmor = armor.helmet || armor.chestplate || armor.leggings || armor.boots;

  if (hasAnyArmor) {
    unlockAchievement('first_armor');
  }

  // Check full sets
  if (armor.helmet && armor.chestplate && armor.leggings && armor.boots) {
    const helmetInfo = BLOCK_INFO[armor.helmet.type];
    const chestInfo = BLOCK_INFO[armor.chestplate.type];
    const legInfo = BLOCK_INFO[armor.leggings.type];
    const bootInfo = BLOCK_INFO[armor.boots.type];

    if (helmetInfo && chestInfo && legInfo && bootInfo) {
      const allSameTier = helmetInfo.tier === chestInfo.tier &&
                          chestInfo.tier === legInfo.tier &&
                          legInfo.tier === bootInfo.tier;

      if (allSameTier) {
        switch (helmetInfo.tier) {
          case 'leather':
            unlockAchievement('full_leather');
            break;
          case 'gold':
            unlockAchievement('full_gold');
            break;
          case 'iron':
            unlockAchievement('full_iron');
            break;
          case 'diamond':
            unlockAchievement('full_diamond');
            break;
        }
      }
    }
  }
}

// Check mob kill achievements
function checkMobKillAchievement(mobType) {
  switch (mobType) {
    case MOB_TYPE.ZOMBIE:
      gameStats.mobsKilled.zombie++;
      unlockAchievement('kill_zombie');
      break;
    case MOB_TYPE.SKELETON:
      gameStats.mobsKilled.skeleton++;
      unlockAchievement('kill_skeleton');
      break;
    case MOB_TYPE.CREEPER:
      gameStats.mobsKilled.creeper++;
      unlockAchievement('kill_creeper');
      break;
  }
  saveAchievements();
}

// Check exploration achievements
function checkExplorationAchievements() {
  if (!player) return;

  const py = Math.floor(player.y / BLOCK_SIZE);

  // Depth achievements
  if (py >= 100) {
    unlockAchievement('deep_dive');
  }
  if (py >= 110) {
    unlockAchievement('cave_explorer');
  }
  if (py >= 118) {
    unlockAchievement('bedrock_level');
  }

  // Travel achievements
  const px = Math.floor(player.x / BLOCK_SIZE);
  const distFromSpawn = Math.abs(px - SPAWN_X);
  if (distFromSpawn >= 500) {
    unlockAchievement('surface_explorer');
  }
  if (distFromSpawn >= 1000) {
    unlockAchievement('world_traveler');
  }
}

// Check building achievements
function checkBuildingAchievements() {
  if (gameStats.blocksPlaced >= 50) {
    unlockAchievement('build_house');
  }
  if (gameStats.blocksPlaced >= 200) {
    unlockAchievement('master_builder');
  }
  if (gameStats.blocksPlaced >= 500) {
    unlockAchievement('legendary_builder');
  }
}

// Check mining count achievements
function checkMiningAchievements() {
  if (gameStats.blocksMined >= 100) {
    unlockAchievement('mine_100_blocks');
  }
  if (gameStats.blocksMined >= 500) {
    unlockAchievement('mine_500_blocks');
  }
}

// Called when a block is placed
function onBlockPlaced() {
  gameStats.blocksPlaced++;
  checkBuildingAchievements();
  saveAchievements();
}

// Called when a block is mined
function onBlockMined(blockType) {
  gameStats.blocksMined++;
  checkItemAchievements(blockType);
  checkMiningAchievements();
  saveAchievements();
}

// Check Nether mob kill achievements
function checkNetherMobKillAchievement(mobType) {
  switch (mobType) {
    case NETHER_MOB_TYPE.ZOMBIE_PIGMAN:
      gameStats.mobsKilled.pigman++;
      unlockAchievement('kill_pigman');
      break;
    case NETHER_MOB_TYPE.BLAZE:
      gameStats.mobsKilled.blaze++;
      unlockAchievement('kill_blaze');
      break;
    case NETHER_MOB_TYPE.GHAST:
      gameStats.mobsKilled.ghast++;
      unlockAchievement('kill_ghast');
      break;
  }
  saveAchievements();
}

// Check End mob kill achievements
function checkEndMobKillAchievement(mobType) {
  switch (mobType) {
    case END_MOB_TYPE.ENDERMAN:
      gameStats.mobsKilled.enderman++;
      unlockAchievement('kill_enderman');
      break;
    case END_MOB_TYPE.ENDER_DRAGON:
      gameStats.mobsKilled.dragon++;
      unlockAchievement('kill_dragon');
      break;
  }
  saveAchievements();
}

// Check animal kill achievements
function checkAnimalKillAchievement(animalType) {
  switch (animalType) {
    case ANIMAL_TYPE.PIG:
      gameStats.animalsKilled.pig++;
      unlockAchievement('kill_pig');
      break;
    case ANIMAL_TYPE.COW:
      gameStats.animalsKilled.cow++;
      unlockAchievement('kill_cow');
      break;
    case ANIMAL_TYPE.SHEEP:
      gameStats.animalsKilled.sheep++;
      unlockAchievement('kill_sheep');
      break;
    case ANIMAL_TYPE.CHICKEN:
      gameStats.animalsKilled.chicken++;
      unlockAchievement('kill_chicken');
      break;
  }
  saveAchievements();
}

// Check dimension entry achievements
function checkDimensionAchievement(dimension) {
  if (dimension === DIMENSION.NETHER && !gameStats.enteredNether) {
    gameStats.enteredNether = true;
    unlockAchievement('enter_nether');
    saveAchievements();
  }
  if (dimension === DIMENSION.END && !gameStats.enteredEnd) {
    gameStats.enteredEnd = true;
    unlockAchievement('enter_end');
    saveAchievements();
  }
}

// Check portal lit achievement
function checkPortalLitAchievement() {
  if (!gameStats.portalLit) {
    gameStats.portalLit = true;
    unlockAchievement('light_portal');
    saveAchievements();
  }
}

// Check trading achievements
function checkTradingAchievement(type) {
  if (type === 'open') {
    unlockAchievement('meet_villager');
  } else if (type === 'complete') {
    gameStats.tradesCompleted++;
    unlockAchievement('first_trade');
  }
  saveAchievements();
}

// Check survival achievements
function checkSurvivalAchievements() {
  if (!player) return;

  // Near death - survived with 1 heart or less
  if (player.health <= 2 && player.health > 0) {
    unlockAchievement('near_death');
  }

  // Full heal
  if (player.health >= player.maxHealth) {
    unlockAchievement('full_heal');
  }
}

// Called when player takes damage
function onPlayerDamage(amount) {
  if (amount > 0) {
    gameStats.damageTaken += amount;
    unlockAchievement('take_damage');
    checkSurvivalAchievements();
    saveAchievements();
  }
}

// Update toast notifications
function updateAchievementToast(dt) {
  if (currentToast) {
    toastTimer -= dt;
    if (toastTimer <= 0) {
      currentToast = null;
    }
  } else if (achievementQueue.length > 0) {
    currentToast = achievementQueue.shift();
    toastTimer = 4000; // 4 seconds
  }
}

// Draw toast notification
function drawAchievementToast() {
  if (!currentToast) return;

  const toastW = 280;
  const toastH = 60;
  const toastX = (canvas.width - toastW) / 2;

  // Slide in/out animation
  let toastY = -toastH;
  if (toastTimer > 3500) {
    // Slide in
    const progress = (4000 - toastTimer) / 500;
    toastY = -toastH + (toastH + 20) * progress;
  } else if (toastTimer < 500) {
    // Slide out
    const progress = toastTimer / 500;
    toastY = -toastH + (toastH + 20) * progress;
  } else {
    toastY = 20;
  }

  // Background
  ctx.fillStyle = 'rgba(40, 20, 60, 0.95)';
  ctx.fillRect(toastX, toastY, toastW, toastH);

  // Border
  ctx.strokeStyle = '#a060d0';
  ctx.lineWidth = 2;
  ctx.strokeRect(toastX, toastY, toastW, toastH);

  // Gold accent
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(toastX, toastY, 4, toastH);

  // Icon
  const iconSize = 36;
  const iconX = toastX + 16;
  const iconY = toastY + (toastH - iconSize) / 2;
  drawBlock(iconX, iconY, currentToast.icon, iconSize);

  // Title
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('발전 과제 달성!', toastX + 60, toastY + 22);

  // Achievement name
  ctx.fillStyle = '#fff';
  ctx.font = '13px monospace';
  ctx.fillText(currentToast.name, toastX + 60, toastY + 42);
}

// Toggle achievements screen
function toggleAchievements() {
  achievementsOpen = !achievementsOpen;
  if (achievementsOpen) {
    achievementScroll = 0;
  }
}

// Handle scroll in achievements
function scrollAchievements(delta) {
  if (!achievementsOpen) return;
  const total = Object.keys(ACHIEVEMENTS).length;
  const maxScroll = Math.max(0, Math.ceil(total / 2) * 50 - 350);
  achievementScroll = Math.max(0, Math.min(maxScroll, achievementScroll + delta * 30));
}

// Draw achievements screen
function drawAchievementsScreen() {
  if (!achievementsOpen) return;

  // Darken background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const windowW = 550;
  const windowH = 500;
  const ox = (canvas.width - windowW) / 2;
  const oy = (canvas.height - windowH) / 2;

  // Window background
  ctx.fillStyle = '#2a2a3a';
  ctx.fillRect(ox, oy, windowW, windowH);

  // Border
  ctx.strokeStyle = '#6060a0';
  ctx.lineWidth = 3;
  ctx.strokeRect(ox, oy, windowW, windowH);

  // Title
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('발전 과제', ox + windowW / 2, oy + 35);

  // Progress
  const total = Object.keys(ACHIEVEMENTS).length;
  const unlocked = Object.keys(unlockedAchievements).length;
  ctx.fillStyle = '#aaa';
  ctx.font = '13px monospace';
  ctx.fillText(`${unlocked} / ${total} 달성`, ox + windowW / 2, oy + 55);

  // Clip region for scrolling content
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox + 10, oy + 70, windowW - 20, windowH - 110);
  ctx.clip();

  // Achievement list
  const startY = oy + 75 - achievementScroll;
  const itemH = 50;
  const cols = 2;
  const itemW = (windowW - 40) / cols;

  let i = 0;
  for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const ix = ox + 20 + col * itemW;
    const iy = startY + row * itemH;

    // Skip if outside visible area
    if (iy + itemH < oy + 70 || iy > oy + windowH - 40) {
      i++;
      continue;
    }

    const isUnlocked = hasAchievement(id);

    // Background
    ctx.fillStyle = isUnlocked ? 'rgba(80, 120, 80, 0.5)' : 'rgba(60, 60, 70, 0.5)';
    ctx.fillRect(ix, iy, itemW - 10, itemH - 6);

    // Border
    ctx.strokeStyle = isUnlocked ? '#6a6' : '#444';
    ctx.lineWidth = 1;
    ctx.strokeRect(ix, iy, itemW - 10, itemH - 6);

    // Icon
    const iconSize = 28;
    ctx.globalAlpha = isUnlocked ? 1 : 0.4;
    drawBlock(ix + 6, iy + (itemH - 6 - iconSize) / 2, achievement.icon, iconSize);
    ctx.globalAlpha = 1;

    // Name
    ctx.fillStyle = isUnlocked ? '#fff' : '#888';
    ctx.font = isUnlocked ? 'bold 12px monospace' : '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(achievement.name, ix + 42, iy + 18);

    // Description
    ctx.fillStyle = isUnlocked ? '#aaa' : '#666';
    ctx.font = '10px monospace';
    ctx.fillText(achievement.description, ix + 42, iy + 34);

    i++;
  }

  ctx.restore();

  // Scroll indicator
  const maxScroll = Math.max(0, Math.ceil(total / 2) * 50 - 350);
  if (maxScroll > 0) {
    const scrollBarH = (windowH - 120) * ((windowH - 120) / (maxScroll + windowH - 120));
    const scrollBarY = oy + 75 + (achievementScroll / maxScroll) * (windowH - 120 - scrollBarH);
    ctx.fillStyle = 'rgba(150, 150, 180, 0.5)';
    ctx.fillRect(ox + windowW - 18, scrollBarY, 8, scrollBarH);
  }

  // Close hint
  ctx.fillStyle = '#888';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Tab: 닫기 | 마우스 휠: 스크롤', ox + windowW / 2, oy + windowH - 12);
}

// Initialize achievements on game start
function initAchievements() {
  loadAchievements();
}
