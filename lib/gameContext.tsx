'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export type CharacterClass = 'Guerreiro' | 'Mago' | 'Arqueiro' | 'Paladino';
export type ItemRarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
export type ItemType = 'Arma' | 'Elmo' | 'Armadura' | 'Calça' | 'Bota' | 'Anel' | 'Escudo' | 'Consumível' | 'Material' | 'Chave';

export interface ItemStats {
  str?: number;
  agi?: number;
  vit?: number;
  int?: number;
  atk?: number;
  def?: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  levelReq: number;
  stats: ItemStats;
  iconName: string;
  price: number;
  quantity?: number;
}

export interface Pet {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'heal' | 'attack' | 'crit_buff' | 'tank';
  powerVal: number;
  level: number;
  price: number;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  expReward: number;
  goldReward: number;
  image: string;
  drops: Item[];
}

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  recommendedLevel: number;
  isUnlocked: boolean;
  bossName: string;
  bossHp: number;
  bossAtk: number;
  bossDef: number;
  expReward: number;
  goldReward: number;
  image: string;
  bossDrop: Item;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'principal' | 'bounty';
  targetType: string;
  targetCount: number;
  currentCount: number;
  rewardGold: number;
  rewardExp: number;
  rewardGems?: number;
  rewardItem?: Item;
  isCompleted: boolean;
  isClaimed: boolean;
  unlockDungeonId?: string;
}

export interface HuntLog {
  id: string;
  text: string;
  type: 'info' | 'player_atk' | 'monster_atk' | 'pet_act' | 'victory' | 'defeat' | 'drop' | 'levelup';
}

export interface EquipmentSlots {
  weapon?: Item;
  helmet?: Item;
  armor?: Item;
  pants?: Item;
  boots?: Item;
  ring?: Item;
  shield?: Item;
}

export interface CraftingRecipe {
  id: string;
  resultItem: Item;
  requiredMaterials: { itemId: string; name: string; count: number }[];
  goldCost: number;
}

interface GameContextType {
  isLoggedIn: boolean;
  name: string;
  characterClass: CharacterClass;
  avatarId: string;
  customAvatarUrl: string | null;
  hasCreatedCharacter: boolean;
  level: number;
  exp: number;
  maxExp: number;
  gold: number;
  gems: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  stats: { str: number; agi: number; vit: number; int: number };
  statPoints: number;
  equipped: EquipmentSlots;
  inventory: Item[];
  pvpWins: number;
  pvpLosses: number;
  
  // Clicker & DPS Idle System
  clickLevel: number;
  clickPower: number;
  clickUpgradeCost: number;
  dps: number;
  companionsCount: { archers: number; knights: number; mages: number };
  upgradeClickPower: () => boolean;
  hireCompanion: (type: 'archers' | 'knights' | 'mages') => boolean;

  // Pets System
  availablePets: Pet[];
  equippedPet: Pet | null;
  equipPet: (pet: Pet | null) => void;
  buyPet: (pet: Pet) => boolean;

  // Dungeons System
  dungeons: Dungeon[];
  executeDungeonD20: (dungeonId: string, d20Roll: number, d20Type: 'miss' | 'normal' | 'crit' | 'supreme') => { victory: boolean; finished: boolean; logs: HuntLog[]; goldEarned: number; expEarned: number; bossLoot?: Item };

  // Quests System
  quests: Quest[];
  claimQuestReward: (questId: string) => void;

  // Idle / Auto Battle Mode
  isAutoBattle: boolean;
  toggleAutoBattle: () => void;

  // Stat Cost Scaling Formula & Reset
  getStatCost: (statVal: number) => number;
  resetStats: () => void;

  // Totals
  totalAtk: number;
  totalDef: number;

  // Actions
  login: (email: string) => void;
  createOrUpdateCharacter: (charName: string, charClass: CharacterClass, avatarId: string, customAvatarUrl?: string | null) => void;
  logout: () => void;
  allocateStat: (stat: 'str' | 'agi' | 'vit' | 'int') => boolean;
  equipItem: (item: Item) => void;
  unequipItem: (slot: keyof EquipmentSlots) => void;
  useItem: (item: Item) => void;
  buyItemFromShop: (item: Item) => boolean;
  sellItem: (item: Item) => void;
  restInTavern: () => void;
  executeHunt: (monster: Monster) => { victory: boolean; logs: HuntLog[]; goldEarned: number; expEarned: number; itemsLooted: Item[] };
  craftItem: (recipe: CraftingRecipe) => boolean;
}

const INITIAL_PETS: Pet[] = [
  { id: 'pet_fairy', name: 'Fada da Luz (Aria)', description: 'Cura o herói em +25 HP a cada 2 turnos de combate.', icon: '🧚', type: 'heal', powerVal: 25, level: 1, price: 150 },
  { id: 'pet_wolf', name: 'Lobo de Gelo (Fenrir)', description: 'Causa +15 de dano congelante bônus a cada ataque.', icon: '🐺', type: 'attack', powerVal: 15, level: 1, price: 250 },
  { id: 'pet_dragon', name: 'Dragão Bebê (Ignis)', description: 'Aumenta o Dano Crítico em +30% e o Ataque em +15%.', icon: '🐲', type: 'crit_buff', powerVal: 30, level: 1, price: 500 },
  { id: 'pet_golem', name: 'Golem de Pedra (Rocky)', description: 'Absorve 20% do dano recebido pelo jogador.', icon: '🗿', type: 'tank', powerVal: 20, level: 1, price: 400 }
];

const INITIAL_DUNGEONS: Dungeon[] = [
  {
    id: 'dung_goblin_abyss',
    name: 'Abismo dos Goblins',
    description: 'Masmorra subterrânea tomada por goblins rebeldes.',
    recommendedLevel: 2,
    isUnlocked: true,
    bossName: 'Rei Goblin Krag',
    bossHp: 220,
    bossAtk: 28,
    bossDef: 8,
    expReward: 120,
    goldReward: 150,
    image: '👑',
    bossDrop: { id: 'mat_chaos_core', name: 'Núcleo do Caos', description: 'Gema energizada de chefe goblin.', type: 'Material', rarity: 'Raro', levelReq: 2, stats: {}, iconName: 'Sparkles', price: 150 }
  },
  {
    id: 'dung_skeleton_crypt',
    name: 'Cripta Rúnica dos Esqueletos',
    description: 'Tumba infestada por guerreiros mortos-vivos.',
    recommendedLevel: 4,
    isUnlocked: false,
    bossName: 'Lorde Lichen',
    bossHp: 380,
    bossAtk: 45,
    bossDef: 18,
    expReward: 250,
    goldReward: 300,
    image: '💀',
    bossDrop: { id: 'mat_titan_bone', name: 'Osso de Titã', description: 'Fragmento ósseo indestrutível.', type: 'Material', rarity: 'Épico', levelReq: 4, stats: {}, iconName: 'Shield', price: 300 }
  },
  {
    id: 'dung_dragon_caldera',
    name: 'Caldeira do Vulcão Ancestral',
    description: 'O covil escaldante do Lorde Dragão.',
    recommendedLevel: 6,
    isUnlocked: false,
    bossName: 'Dragão Ancião Ignis',
    bossHp: 650,
    bossAtk: 75,
    bossDef: 30,
    expReward: 500,
    goldReward: 600,
    image: '🌋',
    bossDrop: { id: 'mat_dragon_heart', name: 'Coração de Fogo Purificado', description: 'Relíquia elemental de imenso poder.', type: 'Material', rarity: 'Lendário', levelReq: 6, stats: {}, iconName: 'Flame', price: 800 }
  }
];

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q_goblin_hunter',
    title: 'Limpeza na Floresta',
    description: 'Derrote 3 Goblins Espiões para proteger os mercadores.',
    category: 'principal',
    targetType: 'mob_goblin',
    targetCount: 3,
    currentCount: 0,
    rewardGold: 100,
    rewardExp: 80,
    rewardGems: 5,
    isCompleted: false,
    isClaimed: false,
    unlockDungeonId: 'dung_skeleton_crypt'
  },
  {
    id: 'q_shadow_wolf',
    title: 'A Ameaça das Sombras',
    description: 'Elimine 2 Lobos das Sombras.',
    category: 'bounty',
    targetType: 'mob_shadow_wolf',
    targetCount: 2,
    currentCount: 0,
    rewardGold: 120,
    rewardExp: 100,
    rewardGems: 3,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'q_orc_slayer',
    title: 'Caçada ao Berserker',
    description: 'Derrote 2 Orcs Berserkers nas ruínas.',
    category: 'bounty',
    targetType: 'mob_orc_warrior',
    targetCount: 2,
    currentCount: 0,
    rewardGold: 250,
    rewardExp: 200,
    rewardGems: 10,
    isCompleted: false,
    isClaimed: false,
    unlockDungeonId: 'dung_dragon_caldera'
  }
];

export const EXPANDED_RECIPES: CraftingRecipe[] = [
  {
    id: 'rec_golden_blade',
    resultItem: {
      id: 'wpn_golden_blade',
      name: 'Lâmina Rúnica Dourada',
      description: 'Lâmina forjada com liga de ouro e energia do caos.',
      type: 'Arma',
      rarity: 'Raro',
      levelReq: 3,
      stats: { atk: 30, str: 8, agi: 5 },
      iconName: 'Sparkles',
      price: 350
    },
    requiredMaterials: [
      { itemId: 'mat_goblin_iron', name: 'Ferro de Goblin', count: 3 },
      { itemId: 'mat_chaos_core', name: 'Núcleo do Caos', count: 1 }
    ],
    goldCost: 120
  },
  {
    id: 'rec_titan_armor',
    resultItem: {
      id: 'arm_titan_plate',
      name: 'Armadura do Titã Morto-Vivo',
      description: 'Armadura forjada com ossos de titã da cripta rúnica.',
      type: 'Armadura',
      rarity: 'Épico',
      levelReq: 5,
      stats: { def: 45, vit: 15, str: 10 },
      iconName: 'Shield',
      price: 600
    },
    requiredMaterials: [
      { itemId: 'mat_titan_bone', name: 'Osso de Titã', count: 1 },
      { itemId: 'mat_goblin_iron', name: 'Ferro de Goblin', count: 4 }
    ],
    goldCost: 250
  },
  {
    id: 'rec_dragon_slayer',
    resultItem: {
      id: 'wpn_dragon_slayer',
      name: 'Devoradora de Dragões',
      description: 'Espada lendária imbuída com o Coração de Fogo Purificado.',
      type: 'Arma',
      rarity: 'Lendário',
      levelReq: 6,
      stats: { atk: 75, str: 20, agi: 12 },
      iconName: 'Flame',
      price: 1500
    },
    requiredMaterials: [
      { itemId: 'mat_dragon_heart', name: 'Coração de Fogo Purificado', count: 1 },
      { itemId: 'mat_dragon_scale', name: 'Escama de Dragão', count: 2 }
    ],
    goldCost: 500
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCreatedCharacter, setHasCreatedCharacter] = useState(true);
  const [name, setName] = useState('Loureiro');
  const [characterClass, setCharacterClass] = useState<CharacterClass>('Guerreiro');
  const [avatarId, setAvatarId] = useState('av_paladin');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [gold, setGold] = useState(300);
  const [gems, setGems] = useState(15);
  const [hp, setHp] = useState(120);
  const [energy, setEnergy] = useState(50);
  const [stats, setStats] = useState({ str: 12, agi: 8, vit: 10, int: 5 });
  const [statPoints, setStatPoints] = useState(8);
  const [equipped, setEquipped] = useState<EquipmentSlots>({});
  const [inventory, setInventory] = useState<Item[]>([
    { id: 'pot_hp_small', name: 'Poção de Vida Menor', description: 'Restaura 50 HP.', type: 'Consumível', rarity: 'Comum', levelReq: 1, stats: {}, iconName: 'FlaskConical', price: 25, quantity: 5 },
    { id: 'wpn_bronze_sword', name: 'Espada de Bronze', description: 'Uma espada clássica.', type: 'Arma', rarity: 'Comum', levelReq: 1, stats: { atk: 8, str: 2 }, iconName: 'Sword', price: 50, quantity: 1 }
  ]);

  // Clicker & DPS Systems State
  const [clickLevel, setClickLevel] = useState(1);
  const [clickUpgradeCost, setClickUpgradeCost] = useState(15);
  const [companionsCount, setCompanionsCount] = useState({ archers: 0, knights: 0, mages: 0 });

  const [availablePets, setAvailablePets] = useState<Pet[]>(INITIAL_PETS);
  const [equippedPet, setEquippedPet] = useState<Pet | null>(INITIAL_PETS[0]);
  const [dungeons, setDungeons] = useState<Dungeon[]>(INITIAL_DUNGEONS);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [isAutoBattle, setIsAutoBattle] = useState(false);

  const [pvpWins, setPvpWins] = useState(14);
  const [pvpLosses, setPvpLosses] = useState(2);

  // Dynamic Formulas
  const maxExp = level * 100;
  const maxHp = 100 + (stats.vit * 15) + (equipped.armor?.stats.vit || 0) * 10;
  const maxEnergy = 40 + (stats.int * 5);

  const clickPower = clickLevel + Math.floor(stats.str * 0.5) + (equipped.weapon?.stats.atk || 0);
  const dps = (companionsCount.archers * 2) + (companionsCount.knights * 10) + (companionsCount.mages * 50);

  const petAtkBonus = equippedPet?.type === 'crit_buff' ? Math.floor(stats.str * 0.15) : 0;
  const totalAtk = clickPower * 2 + (stats.agi) + (equipped.ring?.stats.atk || 0) + petAtkBonus;
  const totalDef = (stats.vit * 1.5) + (equipped.armor?.stats.def || 0) + (equipped.helmet?.stats.def || 0) + (equipped.shield?.stats.def || 0);

  const getStatCost = (statVal: number) => {
    return Math.floor(statVal / 20) + 1;
  };

  const resetStats = () => {
    let totalRefunded = 0;
    const initialValues = characterClass === 'Guerreiro' ? { str: 14, agi: 8, vit: 12, int: 4 }
      : characterClass === 'Mago' ? { str: 4, agi: 8, vit: 8, int: 18 }
      : characterClass === 'Arqueiro' ? { str: 6, agi: 16, vit: 8, int: 6 }
      : { str: 10, agi: 6, vit: 14, int: 8 };

    (['str', 'agi', 'vit', 'int'] as const).forEach((s) => {
      let cur = stats[s];
      const base = initialValues[s];
      while (cur > base) {
        cur--;
        totalRefunded += getStatCost(cur);
      }
    });

    setStats(initialValues);
    setStatPoints((prev) => prev + totalRefunded);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prev) => Math.min(maxEnergy, prev + 3));
      setHp((prev) => Math.min(maxHp, prev + 4));
    }, 8000);
    return () => clearInterval(timer);
  }, [maxHp, maxEnergy]);

  const upgradeClickPower = (): boolean => {
    if (gold < clickUpgradeCost) return false;
    setGold((prev) => Math.max(0, prev - clickUpgradeCost));
    setClickLevel((prev) => prev + 1);
    setClickUpgradeCost((prev) => Math.floor(prev * 1.5));
    return true;
  };

  const hireCompanion = (type: 'archers' | 'knights' | 'mages'): boolean => {
    const costMap = {
      archers: Math.floor(50 * Math.pow(1.4, companionsCount.archers)),
      knights: Math.floor(250 * Math.pow(1.4, companionsCount.knights)),
      mages: Math.floor(1000 * Math.pow(1.4, companionsCount.mages))
    };

    const cost = costMap[type];
    if (gold < cost) return false;

    setGold((prev) => Math.max(0, prev - cost));
    setCompanionsCount((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 } });
    return true;
  };

  const login = (email: string) => {
    setIsLoggedIn(true);
  };

  const createOrUpdateCharacter = (charName: string, charClass: CharacterClass, avId: string, customUrl?: string | null) => {
    setName(charName || 'Loureiro');
    setCharacterClass(charClass);
    setAvatarId(avId);
    if (customUrl !== undefined) {
      setCustomAvatarUrl(customUrl);
    }
    setHasCreatedCharacter(true);

    if (charClass === 'Guerreiro') setStats({ str: 14, agi: 8, vit: 12, int: 4 });
    else if (charClass === 'Mago') setStats({ str: 4, agi: 8, vit: 8, int: 18 });
    else if (charClass === 'Arqueiro') setStats({ str: 6, agi: 16, vit: 8, int: 6 });
    else if (charClass === 'Paladino') setStats({ str: 10, agi: 6, vit: 14, int: 8 });
  };

  const logout = () => setIsLoggedIn(false);

  const allocateStat = (stat: 'str' | 'agi' | 'vit' | 'int'): boolean => {
    const cost = getStatCost(stats[stat]);
    if (statPoints < cost) return false;

    setStatPoints((prev) => prev - cost);
    setStats((prev) => ({ ...prev, [stat]: prev[stat] + 1 }));
    return true;
  };

  const equipPet = (pet: Pet | null) => setEquippedPet(pet);

  const buyPet = (pet: Pet): boolean => {
    if (gold < pet.price) return false;
    setGold((prev) => Math.max(0, prev - pet.price));
    setEquippedPet(pet);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    return true;
  };

  const toggleAutoBattle = () => setIsAutoBattle((prev) => !prev);

  const equipItem = (item: Item) => {
    let slot: keyof EquipmentSlots = 'weapon';
    if (item.type === 'Arma') slot = 'weapon';
    else if (item.type === 'Elmo') slot = 'helmet';
    else if (item.type === 'Armadura') slot = 'armor';
    else if (item.type === 'Calça') slot = 'pants';
    else if (item.type === 'Bota') slot = 'boots';
    else if (item.type === 'Anel') slot = 'ring';
    else if (item.type === 'Escudo') slot = 'shield';
    else return;

    const currentEquipped = equipped[slot];
    setEquipped((prev) => ({ ...prev, [slot]: item }));

    setInventory((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id || (i.quantity && i.quantity > 1));
      const updated = prev.map((i) => (i.id === item.id && i.quantity && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i));
      const list = item.quantity && item.quantity > 1 ? updated : filtered;
      return currentEquipped ? [...list, currentEquipped] : list;
    });
  };

  const unequipItem = (slot: keyof EquipmentSlots) => {
    const item = equipped[slot];
    if (!item) return;

    setEquipped((prev) => {
      const copy = { ...prev };
      delete copy[slot];
      return copy;
    });
    setInventory((prev) => [...prev, item]);
  };

  const useItem = (item: Item) => {
    if (item.id === 'pot_hp_small') {
      setHp((prev) => Math.min(maxHp, prev + 50));
      setInventory((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: (i.quantity || 1) - 1 } : i)).filter((i) => (i.quantity || 0) > 0));
    }
  };

  const buyItemFromShop = (item: Item): boolean => {
    if (gold < item.price) return false;
    setGold((prev) => Math.max(0, prev - item.price));
    setInventory((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    return true;
  };

  const sellItem = (item: Item) => {
    setGold((prev) => prev + item.price);
    setInventory((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: (i.quantity || 1) - 1 } : i)).filter((i) => (i.quantity || 0) > 0));
  };

  const restInTavern = () => {
    if (gold < 20) return;
    setGold((prev) => Math.max(0, prev - 20));
    setHp(maxHp);
    setEnergy(maxEnergy);
  };

  const updateQuestProgress = (monsterId: string) => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (!q.isCompleted && q.targetType === monsterId) {
          const newCount = q.currentCount + 1;
          const completed = newCount >= q.targetCount;
          if (completed) {
            confetti({ particleCount: 50, spread: 40, origin: { y: 0.5 } });
          }
          return { ...q, currentCount: newCount, isCompleted: completed };
        }
        return q;
      })
    );
  };

  const claimQuestReward = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && q.isCompleted && !q.isClaimed) {
          setGold((g) => g + q.rewardGold);
          setExp((e) => e + q.rewardExp);
          if (q.rewardGems) setGems((gm) => gm + (q.rewardGems || 0));

          if (q.unlockDungeonId) {
            setDungeons((dungs) => dungs.map((d) => (d.id === q.unlockDungeonId ? { ...d, isUnlocked: true } : d)));
          }
          return { ...q, isClaimed: true };
        }
        return q;
      })
    );
  };

  const executeHunt = (monster: Monster) => {
    if (energy < 5) {
      return { victory: false, logs: [{ id: '1', text: '⚡ Energia insuficiente! Descanse na Taverna.', type: 'info' as const }], goldEarned: 0, expEarned: 0, itemsLooted: [] };
    }

    setEnergy((prev) => Math.max(0, prev - 5));

    let mHp = monster.hp;
    let pHp = hp;
    const logs: HuntLog[] = [];
    let turn = 1;

    logs.push({ id: `log_start`, text: `⚔️ Caça iniciada contra ${monster.name} (Nível ${monster.level})!`, type: 'info' });

    while (mHp > 0 && pHp > 0 && turn <= 8) {
      if (equippedPet) {
        if (equippedPet.type === 'heal' && turn % 2 === 0) {
          pHp = Math.min(maxHp, pHp + equippedPet.powerVal);
          logs.push({ id: `pet_heal_${turn}`, text: `✨ ${equippedPet.name} curou você em +${equippedPet.powerVal} HP!`, type: 'pet_act' });
        } else if (equippedPet.type === 'attack') {
          mHp -= equippedPet.powerVal;
          logs.push({ id: `pet_atk_${turn}`, text: `❄️ ${equippedPet.name} atacou causando +${equippedPet.powerVal} Dano!`, type: 'pet_act' });
        }
      }

      if (mHp <= 0) break;

      const isCrit = Math.random() < (stats.agi * 0.02);
      const critMultiplier = equippedPet?.type === 'crit_buff' ? 2.05 : 1.75;
      const playerDmg = Math.max(1, Math.floor((totalAtk - monster.def * 0.4) * (isCrit ? critMultiplier : 1) * (0.9 + Math.random() * 0.2)));
      mHp -= playerDmg;

      logs.push({
        id: `p_turn_${turn}`,
        text: `Turno ${turn}: Você causou ${playerDmg} de dano${isCrit ? ' 💥 CRÍTICO!' : ''}. (HP Monstro: ${Math.max(0, mHp)})`,
        type: 'player_atk'
      });

      if (mHp <= 0) break;

      let monsterDmg = Math.max(1, Math.floor((monster.atk - totalDef * 0.3) * (0.85 + Math.random() * 0.3)));
      if (equippedPet?.type === 'tank') monsterDmg = Math.floor(monsterDmg * 0.8);
      pHp -= monsterDmg;

      logs.push({
        id: `m_turn_${turn}`,
        text: `${monster.name} causou ${monsterDmg} de dano! (Seu HP: ${Math.max(0, pHp)})`,
        type: 'monster_atk'
      });

      turn++;
    }

    setHp(Math.max(1, pHp));
    const victory = mHp <= 0;
    let goldEarned = 0;
    let expEarned = 0;
    const itemsLooted: Item[] = [];

    if (victory) {
      goldEarned = monster.goldReward + Math.floor(Math.random() * 10);
      expEarned = monster.expReward;

      logs.push({ id: `log_vic`, text: `🏆 Vitória! Derrotou ${monster.name}. +${expEarned} XP e +${goldEarned} Ouro!`, type: 'victory' });
      updateQuestProgress(monster.id);

      monster.drops.forEach((drop) => {
        if (Math.random() < 0.65) {
          itemsLooted.push(drop);
          logs.push({ id: `log_drop_${drop.id}`, text: `🎁 Loot Obtido: ${drop.name} (${drop.rarity})!`, type: 'drop' });
        }
      });

      setGold((prev) => prev + goldEarned);

      if (itemsLooted.length > 0) {
        setInventory((prev) => {
          let updated = [...prev];
          itemsLooted.forEach((newItem) => {
            const existing = updated.find((i) => i.id === newItem.id);
            if (existing) updated = updated.map((i) => (i.id === newItem.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
            else updated.push({ ...newItem, quantity: 1 });
          });
          return updated;
        });
      }

      let newExp = exp + expEarned;
      let curLevel = level;
      let reqExp = curLevel * 100;

      if (newExp >= reqExp) {
        newExp -= reqExp;
        curLevel += 1;
        setLevel(curLevel);
        setStatPoints((prev) => prev + 5);
        setHp(100 + (stats.vit * 15));

        logs.push({ id: `log_lvl`, text: `🌟 LEVEL UP! Nível ${curLevel}! +5 Pontos de Atributo recebidos!`, type: 'levelup' });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      setExp(newExp);
    } else {
      logs.push({ id: `log_def`, text: `💀 Derrota para ${monster.name}! Recupere-se na Taverna.`, type: 'defeat' });
    }

    return { victory, logs, goldEarned, expEarned, itemsLooted };
  };

  const executeDungeonD20 = (
    dungeonId: string,
    d20Roll: number,
    d20Type: 'miss' | 'normal' | 'crit' | 'supreme'
  ) => {
    const dung = dungeons.find((d) => d.id === dungeonId);
    if (!dung || !dung.isUnlocked) {
      return { victory: false, finished: false, logs: [{ id: '1', text: 'Masmorra indisponível!', type: 'info' as const }], goldEarned: 0, expEarned: 0 };
    }

    const logs: HuntLog[] = [];

    if (equippedPet) {
      if (equippedPet.type === 'heal') {
        setHp((prev) => Math.min(maxHp, prev + equippedPet.powerVal));
        logs.push({ id: `pet_h`, text: `✨ ${equippedPet.name} curou você em +${equippedPet.powerVal} HP!`, type: 'pet_act' });
      }
    }

    let playerDmg = 0;
    if (d20Type === 'miss') {
      logs.push({ id: 'p_miss', text: `💀 ROLAGEM D20: Lado 1 (Caveira)! Seu ataque errou completamente! (0 Dano)`, type: 'info' });
    } else {
      const mult = d20Type === 'supreme' ? 2.5 : d20Type === 'crit' ? 1.8 : 1.0;
      playerDmg = Math.max(1, Math.floor((totalAtk - dung.bossDef * 0.35) * mult));

      logs.push({
        id: 'p_hit',
        text: `🎲 ROLAGEM D20: Lado ${d20Roll}! Você causou ${playerDmg} de dano ao chefe ${dung.bossName}${d20Type === 'supreme' ? ' 🌟 NAT 20 SUPREMO!' : d20Type === 'crit' ? ' ⚔️ CRÍTICO!' : ''}!`,
        type: 'player_atk'
      });
    }

    let bossDmg = Math.max(1, Math.floor(dung.bossAtk - totalDef * 0.3));
    if (equippedPet?.type === 'tank') bossDmg = Math.floor(bossDmg * 0.8);
    setHp((prev) => Math.max(0, prev - bossDmg));

    logs.push({ id: 'b_hit', text: `👹 Chefe ${dung.bossName} contra-atacou desferindo ${bossDmg} de dano!`, type: 'monster_atk' });

    return { victory: false, finished: false, logs, goldEarned: 0, expEarned: 0 };
  };

  const craftItem = (recipe: CraftingRecipe): boolean => {
    if (gold < recipe.goldCost) return false;
    for (const req of recipe.requiredMaterials) {
      const invItem = inventory.find((i) => i.id === req.itemId);
      if (!invItem || (invItem.quantity || 1) < req.count) return false;
    }

    setGold((prev) => Math.max(0, prev - recipe.goldCost));
    setInventory((prev) => {
      let copy = [...prev];
      for (const req of recipe.requiredMaterials) {
        copy = copy.map((i) => (i.id === req.itemId ? { ...i, quantity: (i.quantity || 1) - req.count } : i)).filter((i) => (i.quantity || 0) > 0);
      }
      const existingResult = copy.find((i) => i.id === recipe.resultItem.id);
      if (existingResult) return copy.map((i) => (i.id === recipe.resultItem.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
      return [...copy, { ...recipe.resultItem, quantity: 1 }];
    });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
    return true;
  };

  return (
    <GameContext.Provider
      value={{
        isLoggedIn,
        name,
        characterClass,
        avatarId,
        customAvatarUrl,
        hasCreatedCharacter,
        level,
        exp,
        maxExp,
        gold,
        gems,
        hp,
        maxHp,
        energy,
        maxEnergy,
        stats,
        statPoints,
        equipped,
        inventory,
        clickLevel,
        clickPower,
        clickUpgradeCost,
        dps,
        companionsCount,
        upgradeClickPower,
        hireCompanion,
        availablePets,
        equippedPet,
        equipPet,
        buyPet,
        dungeons,
        executeDungeonD20,
        quests,
        claimQuestReward,
        isAutoBattle,
        toggleAutoBattle,
        getStatCost,
        resetStats,
        pvpWins,
        pvpLosses,
        totalAtk,
        totalDef,
        login,
        createOrUpdateCharacter,
        logout,
        allocateStat,
        equipItem,
        unequipItem,
        useItem,
        buyItemFromShop,
        sellItem,
        restInTavern,
        executeHunt,
        craftItem
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame deve ser usado dentro de um GameProvider');
  return context;
};
