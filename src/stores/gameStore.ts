import { create } from 'zustand';

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
  player: Player;
  isPlaying: boolean;
  characterId: number;
  setPlayer: (player: Partial<Player>) => void;
  updatePosition: (x: number, y: number) => void;
  updateCoins: (amount: number) => void;
  updateEnergy: (amount: number) => void;
  setCharacter: (id: number) => void;
  startGame: () => void;
  endGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  player: {
    id: '',
    name: '小樱',
    x: 0,
    y: 0,
    coins: 500,
    energy: 100,
    maxEnergy: 100,
  },

  isPlaying: false,
  characterId: 1,

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
      player: { ...state.player, coins: state.player.coins + amount },
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
        name: ['小樱', '小牧', '森林精灵'][id - 1] || state.player.name,
      },
    })),

  startGame: () => set({ isPlaying: true }),

  endGame: () => set({ isPlaying: false }),
}));
