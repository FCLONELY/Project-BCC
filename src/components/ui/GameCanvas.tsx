import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Game from '@/game/Game';

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      // 初始化 Phaser 游戏
      gameRef.current = Game;
    }

    return () => {
      // 清理游戏实例
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="game-container"
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-sky-light"
    />
  );
}
