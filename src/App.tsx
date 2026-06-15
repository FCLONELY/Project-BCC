import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameCanvas from "@/components/ui/GameCanvas";
import { useGameStore } from "@/stores/gameStore";
import { useEffect } from "react";

function Game() {
  const { player, isPlaying, startGame } = useGameStore();

  useEffect(() => {
    if (!isPlaying) {
      startGame();
    }
  }, [isPlaying, startGame]);

  return (
    <div className="min-h-screen bg-sky flex flex-col">
      {/* 顶部状态栏 */}
      <div className="bg-gradient-to-b from-wood-light to-wood h-16 flex items-center justify-between px-6 border-b-4 border-b-wood-dark shadow-lg">
        <div className="flex items-center gap-6">
          <h1 className="font-pixel text-sm text-white drop-shadow-lg">田园大世界</h1>
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="font-pixel text-xs text-white">{player.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-earth-dark/30 px-3 py-1 rounded">
            <span className="text-lg">🪙</span>
            <span className="font-pixel text-xs text-white">{player.coins}</span>
          </div>

          <div className="flex items-center gap-2 bg-earth-dark/30 px-3 py-1 rounded">
            <span className="text-lg">⚡</span>
            <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sunlight to-sunlight-light transition-all"
                style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}
              />
            </div>
            <span className="font-pixel text-xs text-white">
              {player.energy}/{player.maxEnergy}
            </span>
          </div>
        </div>
      </div>

      {/* 游戏画布 */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <GameCanvas />
      </div>

      {/* 底部工具栏 */}
      <div className="bg-gradient-to-t from-wood-light to-wood h-20 flex items-center justify-around px-6 border-t-4 border-t-wood-dark shadow-lg">
        <button className="btn-pixel-sm flex flex-col items-center gap-1">
          <span className="text-xl">🎒</span>
          <span className="font-pixel text-xs">背包</span>
        </button>

        <button className="btn-pixel-sm flex flex-col items-center gap-1">
          <span className="text-xl">🌾</span>
          <span className="font-pixel text-xs">种田</span>
        </button>

        <button className="btn-pixel-sm flex flex-col items-center gap-1">
          <span className="text-xl">🐄</span>
          <span className="font-pixel text-xs">养殖</span>
        </button>

        <button className="btn-pixel-sm flex flex-col items-center gap-1">
          <span className="text-xl">🗺️</span>
          <span className="font-pixel text-xs">地图</span>
        </button>

        <button className="btn-pixel-sm flex flex-col items-center gap-1">
          <span className="text-xl">⚙️</span>
          <span className="font-pixel text-xs">设置</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/login" element={<div className="text-center text-xl">登录页面 - 稍后开发</div>} />
      </Routes>
    </Router>
  );
}
