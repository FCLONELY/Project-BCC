import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGame } from '@/game/Game';

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      gameRef.current = createGame(containerRef.current);
    }

    return () => {
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true);
        } catch (e) {
          // ignore
        }
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="game-container"
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        position: 'relative',
        backgroundColor: '#7EC850',
      }}
    />
  );
}
