import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import WorldScene from './scenes/WorldScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, WorldScene],
};

export function createGame(container: HTMLElement): Phaser.Game {
  // 确保容器有明确尺寸
  container.style.display = 'block';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.minHeight = '400px';
  container.style.overflow = 'hidden';

  return new Phaser.Game({
    ...gameConfig,
    parent: container,
  });
}
