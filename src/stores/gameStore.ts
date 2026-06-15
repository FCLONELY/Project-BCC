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
  setPlayer: (player: Partial<Player>) => void;
  updatePosition: (x: number, y: number) => void;
  updateCoins: (amount: number) => void;
  updateEnergy: (amount: number) => void;
  startGame: () => void;
  endGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  player: {
    id: '',
    name: '农民',
    x: 0,
    y: 0,
    coins: 100,
    energy: 100,
    maxEnergy: 100,
  },

  isPlaying: false,

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

  startGame: () => set({ isPlaying: true }),

  endGame: () => set({ isPlaying: false }),
}));
