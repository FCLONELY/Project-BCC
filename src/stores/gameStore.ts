import { create } from 'zustand';

// ==== 物品系统 ====
export interface Item {
  id: string;
  name: string;
  icon: string;
  type: 'seed' | 'crop' | 'tool' | 'animal' | 'material' | 'consumable';
  description: string;
  price: number;
  harvestTime?: number; // 生长时间（秒）
}

export interface InventoryItem extends Item {
  quantity: number;
}

export interface Plot {
  id: string;
  x: number;
  y: number;
  state: 'empty' | 'plowed' | 'planted' | 'growing' | 'ready' | 'wilted';
  cropType?: string;
  plantedAt?: number;
  wateredAt?: number;
}

// ==== 养殖系统 ====
export interface Animal {
  id: string;
  type: 'chicken' | 'cow' | 'sheep';
  name: string;
  x: number;
  y: number;
  hunger: number; // 0-100
  lastFedAt?: number;
  lastCollectedAt?: number;
}

export interface AnimalProduct {
  type: 'egg' | 'milk' | 'wool';
  quantity: number;
  collectedAt: number;
}

// ==== 商店系统 ====
export interface ShopItem {
  item: Item;
  stock: number;
  discount?: number;
}

// ==== 玩家状态 ====
interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  coins: number;
  energy: number;
  maxEnergy: number;
}

interface GameState {
  // 玩家状态
  player: Player;
  isPlaying: boolean;
  characterId: number;
  
  // 物品系统
  inventory: InventoryItem[];
  selectedTool: string | null;
  
  // 种田系统
  plots: Plot[];
  
  // 养殖系统
  animals: Animal[];
  
  // 商店系统
  shopItems: ShopItem[];
  
  // 多人联机
  onlinePlayers: { id: string; name: string; x: number; y: number; characterId: number }[];
  
  // ==== 玩家操作 ====
  setPlayer: (player: Partial<Player>) => void;
  updatePosition: (x: number, y: number) => void;
  updateCoins: (amount: number) => void;
  updateEnergy: (amount: number) => void;
  setCharacter: (id: number) => void;
  startGame: () => void;
  endGame: () => void;
  
  // ==== 物品操作 ====
  addToInventory: (item: Item, quantity: number) => void;
  removeFromInventory: (itemId: string, quantity: number) => void;
  selectTool: (toolId: string | null) => void;
  
  // ==== 种田操作 ====
  plowPlot: (plotId: string) => boolean;
  plantSeed: (plotId: string, seedId: string) => boolean;
  waterPlot: (plotId: string) => boolean;
  harvestCrop: (plotId: string) => boolean;
  updatePlots: () => void;
  
  // ==== 商店操作 ====
  buyItem: (itemId: string, quantity: number) => boolean;
  sellItem: (itemId: string, quantity: number) => boolean;
  
  // ==== 养殖操作 ====
  buyAnimal: (type: Animal['type']) => boolean;
  feedAnimal: (animalId: string) => boolean;
  collectProduct: (animalId: string) => boolean;
  updateAnimals: () => void;
  
  // ==== 多人联机 ====
  addOnlinePlayer: (player: { id: string; name: string; x: number; y: number; characterId: number }) => void;
  removeOnlinePlayer: (playerId: string) => void;
  updateOnlinePlayerPosition: (playerId: string, x: number, y: number) => void;
}

// 物品定义
export const ITEMS: Record<string, Item> = {
  // 种子
  'seed-carrot': { id: 'seed-carrot', name: '胡萝卜种子', icon: '🥕', type: 'seed', description: '生长快，营养丰富的胡萝卜', price: 10, harvestTime: 30 },
  'seed-wheat': { id: 'seed-wheat', name: '小麦种子', icon: '🌾', type: 'seed', description: '可制作面包的小麦', price: 8, harvestTime: 45 },
  'seed-tomato': { id: 'seed-tomato', name: '番茄种子', icon: '🍅', type: 'seed', description: '多汁美味的番茄', price: 15, harvestTime: 40 },
  'seed-corn': { id: 'seed-corn', name: '玉米种子', icon: '🌽', type: 'seed', description: '金黄饱满的玉米', price: 12, harvestTime: 50 },
  
  // 作物
  'crop-carrot': { id: 'crop-carrot', name: '胡萝卜', icon: '🥕', type: 'crop', description: '新鲜的胡萝卜', price: 25 },
  'crop-wheat': { id: 'crop-wheat', name: '小麦', icon: '🌾', type: 'crop', description: '金黄的小麦', price: 20 },
  'crop-tomato': { id: 'crop-tomato', name: '番茄', icon: '🍅', type: 'crop', description: '新鲜番茄', price: 35 },
  'crop-corn': { id: 'crop-corn', name: '玉米', icon: '🌽', type: 'crop', description: '饱满的玉米', price: 30 },
  
  // 工具
  'tool-hoe': { id: 'tool-hoe', name: '锄头', icon: '⛏️', type: 'tool', description: '用来耕地的工具', price: 50 },
  'tool-watering': { id: 'tool-watering', name: '水壶', icon: '🪣', type: 'tool', description: '用来浇水的工具', price: 30 },
  'tool-scythe': { id: 'tool-scythe', name: '镰刀', icon: '🔪', type: 'tool', description: '用来收割的工具', price: 40 },
  
  // 动物
  'animal-chicken': { id: 'animal-chicken', name: '小鸡', icon: '🐔', type: 'animal', description: '会下蛋的小鸡', price: 100 },
  'animal-cow': { id: 'animal-cow', name: '奶牛', icon: '🐄', type: 'animal', description: '会产奶的奶牛', price: 500 },
  'animal-sheep': { id: 'animal-sheep', name: '绵羊', icon: '🐑', type: 'animal', description: '会产羊毛的绵羊', price: 300 },
  
  // 动物产品
  'product-egg': { id: 'product-egg', name: '鸡蛋', icon: '🥚', type: 'material', description: '新鲜的鸡蛋', price: 15 },
  'product-milk': { id: 'product-milk', name: '牛奶', icon: '🥛', type: 'material', description: '新鲜牛奶', price: 25 },
  'product-wool': { id: 'product-wool', name: '羊毛', icon: '🧶', type: 'material', description: '柔软的羊毛', price: 40 },
  
  // 消耗品
  'consumable-energy': { id: 'consumable-energy', name: '能量药水', icon: '⚡', type: 'consumable', description: '恢复30点能量', price: 30 },
};

export const useGameStore = create<GameState>((set, get) => ({
  // 玩家状态
  player: {
    id: 'player-1',
    name: '小樱',
    x: 0,
    y: 0,
    coins: 500,
    energy: 100,
    maxEnergy: 100,
  },
  isPlaying: false,
  characterId: 1,
  
  // 物品系统
  inventory: [
    { ...ITEMS['seed-carrot'], quantity: 10 },
    { ...ITEMS['seed-wheat'], quantity: 10 },
    { ...ITEMS['tool-hoe'], quantity: 1 },
    { ...ITEMS['tool-watering'], quantity: 1 },
    { ...ITEMS['tool-scythe'], quantity: 1 },
  ],
  selectedTool: null,
  
  // 种田系统 - 初始化农场地块
  plots: Array.from({ length: 20 }, (_, i) => ({
    id: `plot-${i}`,
    x: -380 + ((i % 5) - 2) * 48,
    y: 100 + (Math.floor(i / 5) - 2) * 48,
    state: i < 10 ? 'planted' : 'empty',
    cropType: i < 10 ? ['seed-carrot', 'seed-wheat', 'seed-tomato', 'seed-corn'][i % 4] : undefined,
    plantedAt: i < 10 ? Date.now() - (Math.random() * 30000) : undefined,
    wateredAt: i < 10 ? Date.now() : undefined,
  })),
  
  // 养殖系统
  animals: [],
  
  // 商店系统
  shopItems: [
    { item: ITEMS['seed-carrot'], stock: 99 },
    { item: ITEMS['seed-wheat'], stock: 99 },
    { item: ITEMS['seed-tomato'], stock: 99 },
    { item: ITEMS['seed-corn'], stock: 99 },
    { item: ITEMS['animal-chicken'], stock: 10 },
    { item: ITEMS['animal-cow'], stock: 5 },
    { item: ITEMS['animal-sheep'], stock: 8 },
    { item: ITEMS['consumable-energy'], stock: 20 },
  ],
  
  // 多人联机
  onlinePlayers: [],
  
  // ==== 玩家操作 ====
  setPlayer: (playerData) =>
    set((state) => ({
      player: { ...state.player, ...playerData },
    })),

  updatePosition: (x, y) =>
    set((state) => ({
      player: { ...state.player, x, y },
    })),

  updateCoins: (amount) =>
    set((state) => ({
      player: { ...state.player, coins: Math.max(0, state.player.coins + amount) },
    })),

  updateEnergy: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        energy: Math.max(0, Math.min(state.player.maxEnergy, state.player.energy + amount)),
      },
    })),

  setCharacter: (id: number) =>
    set((state) => ({
      characterId: id,
      player: {
        ...state.player,
        name: ['小樱', '小牧'][id - 1] || state.player.name,
      },
    })),

  startGame: () => set({ isPlaying: true }),
  endGame: () => set({ isPlaying: false }),
  
  // ==== 物品操作 ====
  addToInventory: (item, quantity) =>
    set((state) => {
      const existing = state.inventory.find(i => i.id === item.id);
      if (existing) {
        return {
          inventory: state.inventory.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        inventory: [...state.inventory, { ...item, quantity }],
      };
    }),

  removeFromInventory: (itemId, quantity) =>
    set((state) => ({
      inventory: state.inventory
        .map(i => i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i)
        .filter(i => i.quantity > 0),
    })),

  selectTool: (toolId) => set({ selectedTool: toolId }),
  
  // ==== 种田操作 ====
  plowPlot: (plotId) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || plot.state !== 'empty') return false;
    if (state.player.energy < 5) return false;
    
    set((s) => ({
      player: { ...s.player, energy: s.player.energy - 5 },
      plots: s.plots.map(p => p.id === plotId ? { ...p, state: 'plowed' as const } : p),
    }));
    return true;
  },

  plantSeed: (plotId, seedId) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    const seed = state.inventory.find(i => i.id === seedId && i.type === 'seed');
    
    if (!plot || plot.state !== 'plowed') return false;
    if (!seed || seed.quantity < 1) return false;
    if (state.player.energy < 5) return false;
    
    set((s) => ({
      player: { ...s.player, energy: s.player.energy - 5 },
      inventory: s.inventory.map(i => i.id === seedId ? { ...i, quantity: i.quantity - 1 } : i),
      plots: s.plots.map(p => p.id === plotId ? {
        ...p,
        state: 'planted' as const,
        cropType: seedId,
        plantedAt: Date.now(),
        wateredAt: Date.now(),
      } : p),
    }));
    return true;
  },

  waterPlot: (plotId) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    
    if (!plot || (plot.state !== 'planted' && plot.state !== 'growing')) return false;
    if (state.player.energy < 3) return false;
    
    set((s) => ({
      player: { ...s.player, energy: s.player.energy - 3 },
      plots: s.plots.map(p => p.id === plotId ? { ...p, wateredAt: Date.now() } : p),
    }));
    return true;
  },

  harvestCrop: (plotId) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    
    if (!plot || plot.state !== 'ready' || !plot.cropType) return false;
    if (state.player.energy < 5) return false;
    
    const cropItem = ITEMS[plot.cropType.replace('seed-', 'crop-')];
    if (!cropItem) return false;
    
    set((s) => ({
      player: { ...s.player, energy: s.player.energy - 5 },
      inventory: [...s.inventory, { ...cropItem, quantity: 1 }],
      plots: s.plots.map(p => p.id === plotId ? { ...p, state: 'empty' as const, cropType: undefined, plantedAt: undefined, wateredAt: undefined } : p),
    }));
    return true;
  },

  updatePlots: () => {
    const now = Date.now();
    set((state) => ({
      plots: state.plots.map(plot => {
        if (plot.state === 'planted' || plot.state === 'growing') {
          if (!plot.plantedAt || !plot.cropType) return plot;
          
          const crop = ITEMS[plot.cropType];
          if (!crop || !crop.harvestTime) return plot;
          
          const growthTime = (now - plot.plantedAt) / 1000;
          const wateredRecently = plot.wateredAt && (now - plot.wateredAt) < 60000;
          
          if (!wateredRecently) {
            return { ...plot, state: 'wilted' as const };
          }
          
          if (growthTime >= crop.harvestTime) {
            return { ...plot, state: 'ready' as const };
          } else if (growthTime >= crop.harvestTime * 0.5) {
            return { ...plot, state: 'growing' as const };
          }
        }
        return plot;
      }),
    }));
  },
  
  // ==== 商店操作 ====
  buyItem: (itemId, quantity) => {
    const state = get();
    const shopItem = state.shopItems.find(s => s.item.id === itemId);
    
    if (!shopItem || shopItem.stock < quantity) return false;
    
    const totalPrice = shopItem.item.price * quantity;
    if (state.player.coins < totalPrice) return false;
    
    set((s) => ({
      player: { ...s.player, coins: s.player.coins - totalPrice },
      inventory: [...s.inventory, { ...shopItem.item, quantity }],
      shopItems: s.shopItems.map(si => si.item.id === itemId ? { ...si, stock: si.stock - quantity } : si),
    }));
    return true;
  },

  sellItem: (itemId, quantity) => {
    const state = get();
    const invItem = state.inventory.find(i => i.id === itemId);
    
    if (!invItem || invItem.quantity < quantity) return false;
    
    const sellPrice = Math.floor(invItem.price * 0.6);
    const totalPrice = sellPrice * quantity;
    
    set((s) => ({
      player: { ...s.player, coins: s.player.coins + totalPrice },
      inventory: s.inventory.map(i => i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i).filter(i => i.quantity > 0),
    }));
    return true;
  },
  
  // ==== 养殖操作 ====
  buyAnimal: (type) => {
    const state = get();
    const animalItem = ITEMS[`animal-${type}`];
    
    if (!animalItem) return false;
    if (state.player.coins < animalItem.price) return false;
    
    const newAnimal: Animal = {
      id: `animal-${Date.now()}`,
      type,
      name: type === 'chicken' ? '小鸡' : type === 'cow' ? '奶牛' : '绵羊',
      x: -380 + (Math.random() - 0.5) * 200,
      y: 100 + (Math.random() - 0.5) * 100,
      hunger: 100,
      lastFedAt: Date.now(),
      lastCollectedAt: Date.now(),
    };
    
    set((s) => ({
      player: { ...s.player, coins: s.player.coins - animalItem.price },
      animals: [...s.animals, newAnimal],
    }));
    return true;
  },

  feedAnimal: (animalId) => {
    const state = get();
    const animal = state.animals.find(a => a.id === animalId);
    
    if (!animal) return false;
    if (state.player.energy < 10) return false;
    
    set((s) => ({
      player: { ...s.player, energy: s.player.energy - 10 },
      animals: s.animals.map(a => a.id === animalId ? { ...a, hunger: Math.min(100, a.hunger + 30), lastFedAt: Date.now() } : a),
    }));
    return true;
  },

  collectProduct: (animalId) => {
    const state = get();
    const animal = state.animals.find(a => a.id === animalId);
    
    if (!animal) return false;
    if (animal.hunger < 50) return false;
    
    const now = Date.now();
    const collectionInterval = animal.type === 'chicken' ? 300000 : animal.type === 'cow' ? 600000 : 900000;
    
    if (animal.lastCollectedAt && (now - animal.lastCollectedAt) < collectionInterval) return false;
    
    const productType = animal.type === 'chicken' ? 'product-egg' : animal.type === 'cow' ? 'product-milk' : 'product-wool';
    const product = ITEMS[productType];
    
    if (!product) return false;
    
    set((s) => ({
      inventory: [...s.inventory, { ...product, quantity: 1 }],
      animals: s.animals.map(a => a.id === animalId ? { ...a, lastCollectedAt: now } : a),
    }));
    return true;
  },

  updateAnimals: () => {
    const now = Date.now();
    set((state) => ({
      animals: state.animals.map(animal => {
        if (animal.lastFedAt) {
          const hungerDecrease = (now - animal.lastFedAt) / 60000; // 每分钟减少1点饥饿值
          const newHunger = Math.max(0, animal.hunger - hungerDecrease);
          return { ...animal, hunger: newHunger };
        }
        return animal;
      }),
    }));
  },
  
  // ==== 多人联机 ====
  addOnlinePlayer: (player) =>
    set((state) => ({
      onlinePlayers: [...state.onlinePlayers, player],
    })),

  removeOnlinePlayer: (playerId) =>
    set((state) => ({
      onlinePlayers: state.onlinePlayers.filter(p => p.id !== playerId),
    })),

  updateOnlinePlayerPosition: (playerId, x, y) =>
    set((state) => ({
      onlinePlayers: state.onlinePlayers.map(p => p.id === playerId ? { ...p, x, y } : p),
    })),
}));
