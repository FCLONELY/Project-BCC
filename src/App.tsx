import { useEffect, useState } from 'react';
import GameCanvas from '@/components/ui/GameCanvas';
import { useGameStore } from '@/stores/gameStore';

export default function Game() {
  const { player, startGame, characterId, setCharacter } = useGameStore();
  const [showInventory, setShowInventory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuest, setShowQuest] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showCharSelect, setShowCharSelect] = useState(false);
  const [activeSkill, setActiveSkill] = useState<number | null>(null);
  const [welcomeFade, setWelcomeFade] = useState(true);

  useEffect(() => {
    if (!player.name || player.name === '') {
      startGame();
    }
    const timer = setTimeout(() => setWelcomeFade(false), 4000);
    return () => clearTimeout(timer);
  }, [startGame, player.name]);

  const skillCooldowns = [0, 0, 0, 0];

  const skillItems = [
    { icon: '⛏️', name: '挖矿', hotkey: '1', color: 'from-amber-400 to-amber-700' },
    { icon: '🪓', name: '砍树', hotkey: '2', color: 'from-emerald-400 to-emerald-700' },
    { icon: '🌾', name: '收割', hotkey: '3', color: 'from-yellow-400 to-orange-600' },
    { icon: '🪣', name: '浇水', hotkey: '4', color: 'from-sky-400 to-blue-600' },
  ];

  const characters = [
    { id: 1, name: '小樱', title: '粉发少女', emoji: '🌸', desc: '来自魔法村庄的可爱女孩', color: 'from-pink-400 to-rose-500', rarity: 4 },
    { id: 2, name: '小牧', title: '勇敢少年', emoji: '🌟', desc: '戴着草帽的冒险家', color: 'from-amber-400 to-orange-500', rarity: 4 },
    { id: 3, name: '森林精灵', title: '神秘旅人', emoji: '🍃', desc: '拥有绿色长发的精灵', color: 'from-emerald-400 to-teal-500', rarity: 5 },
  ];

  const currentChar = characters.find(c => c.id === characterId) || characters[0];

  // 任务数据
  const quests = [
    { title: '种植胡萝卜', progress: 0, reward: 50, icon: '🥕' },
    { title: '与村民对话', progress: 1, reward: 100, icon: '💬' },
    { title: '收集木材', progress: 0, reward: 80, icon: '🪵' },
    { title: '探索小镇', progress: 2, reward: 200, icon: '🏡' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, #1a1a3e 0%, #2a1a5e 30%, #1a0f4e 100%)',
      }}
    >
      {/* 背景装饰光点 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: i % 2 === 0 ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 182, 193, 0.5)',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: 2 + Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      {/* ================ 顶部状态栏 ================ */}
      <div className="relative z-30 px-3 py-2 flex items-center gap-3"
        style={{
          background: 'linear-gradient(180deg, rgba(42, 27, 61, 0.98) 0%, rgba(30, 20, 45, 0.92) 100%)',
          borderBottom: '2px solid rgba(255, 215, 0, 0.35)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* 左侧 - 游戏标题 + Logo */}
        <div className="flex items-center gap-2 min-w-[110px]">
          <div className="relative">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg text-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2))',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)',
              }}
            >🌿</div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
          </div>
          <div>
            <div className="font-pixel text-sm text-yellow-300 leading-tight"
              style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5), 0 0 8px rgba(255,215,0,0.3)' }}
            >田园大世界</div>
            <div className="font-pixel text-[8px] text-yellow-200/60">v0.2.0 · 二游版</div>
          </div>
        </div>

        {/* 玩家头像卡片（点击选角色） */}
        <button onClick={() => setShowCharSelect(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${currentChar.color.includes('pink') ? 'rgba(255,105,180,0.35)' : currentChar.color.includes('amber') ? 'rgba(251,191,36,0.35)' : 'rgba(16,185,129,0.35)'}, rgba(168,85,247,0.25))`,
            border: '1.5px solid rgba(255, 215, 0, 0.5)',
            boxShadow: '0 0 16px rgba(255, 215, 0, 0.25)',
          }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl border-2"
              style={{
                background: `linear-gradient(135deg, ${currentChar.color.includes('pink') ? '#fce7f3' : currentChar.color.includes('amber') ? '#fef3c7' : '#d1fae5'}, ${currentChar.color.includes('pink') ? '#fbcfe8' : currentChar.color.includes('amber') ? '#fde68a' : '#a7f3d0'})`,
                borderColor: 'rgba(255, 215, 0, 0.7)',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.3)',
              }}
            >{currentChar.emoji}</div>
            {/* 星级 */}
            <div className="absolute -bottom-1 -right-1 flex gap-0">
              {[...Array(currentChar.rarity)].map((_, i) => (
                <span key={i} className="text-[8px]" style={{ textShadow: '0 0 4px rgba(255,215,0,0.8)' }}>⭐</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-pixel text-xs text-yellow-200 leading-tight">{currentChar.name}</span>
            <span className="font-pixel text-[8px] text-yellow-400/70 leading-tight">点击切换</span>
            <div className="w-16 h-1.5 bg-gray-700/80 rounded-full overflow-hidden border border-yellow-500/30 mt-0.5">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-300"
                style={{ width: `${45 + characterId * 15}%`, boxShadow: '0 0 6px rgba(255, 215, 0, 0.5)' }}
              />
            </div>
          </div>
        </button>

        {/* 右侧状态 */}
        <div className="ml-auto flex items-center gap-2">
          {/* 体力 */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.12))',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)',
            }}
          >
            <span className="text-base">⚡</span>
            <div className="flex flex-col">
              <span className="font-pixel text-[8px] text-red-200/80 leading-tight">体力</span>
              <div className="w-16 h-2 bg-gray-800/80 rounded-full overflow-hidden border border-red-500/30">
                <div className="h-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 transition-all"
                  style={{ width: `${(player.energy / player.maxEnergy) * 100}%`, boxShadow: '0 0 6px rgba(255, 107, 107, 0.6)' }}
                />
              </div>
            </div>
          </div>

          {/* 饱腹度 */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.12))',
              border: '1px solid rgba(251, 146, 60, 0.4)',
              boxShadow: '0 2px 8px rgba(251, 146, 60, 0.15)',
            }}
          >
            <span className="text-base">🍖</span>
            <div className="flex flex-col">
              <span className="font-pixel text-[8px] text-orange-200/80 leading-tight">饱腹</span>
              <div className="w-16 h-2 bg-gray-800/80 rounded-full overflow-hidden border border-orange-500/30">
                <div className="h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-200"
                  style={{ width: '80%', boxShadow: '0 0 6px rgba(255, 165, 0, 0.6)' }}
                />
              </div>
            </div>
          </div>

          {/* 金币 */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 165, 0, 0.15))',
              border: '1.5px solid rgba(255, 215, 0, 0.5)',
              boxShadow: '0 2px 12px rgba(255, 215, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <span className="text-lg drop-shadow-lg animate-pulse">🪙</span>
            <span className="font-pixel text-sm text-yellow-200"
              style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.5), 0 0 6px rgba(255,215,0,0.4)' }}
            >{player.coins.toLocaleString()}</span>
          </div>

          {/* 设置按钮 */}
          <button onClick={() => setShowSettings(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-all hover:scale-110 hover:rotate-90"
            style={{
              background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.4), rgba(138, 43, 226, 0.3))',
              border: '1.5px solid rgba(255, 215, 0, 0.4)',
              boxShadow: '0 2px 8px rgba(138, 43, 226, 0.2)',
            }}
          >⚙️</button>
        </div>
      </div>

      {/* ================ 游戏画布区域 ================ */}
      <div className="flex-1 relative">
        <GameCanvas />

        {/* 欢迎界面 */}
        {welcomeFade && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="flex flex-col items-center gap-4 animate-pulse"
              style={{ animation: 'fadeInOut 4s ease-in-out' }}
            >
              <div className="text-5xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))' }}>✨🌿✨</div>
              <div className="font-pixel text-2xl text-yellow-300"
                style={{ textShadow: '4px 4px 0 rgba(0,0,0,0.6), 0 0 30px rgba(255,215,0,0.5)' }}
              >欢迎来到田园大世界</div>
              <div className="font-pixel text-sm text-white" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                WASD / 方向键 移动
              </div>
              <div className="font-pixel text-xs text-yellow-200/80" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                探索世界，建设你的田园家园！
              </div>
            </div>
          </div>
        )}

        {/* 任务面板 */}
        <div className="absolute top-3 right-3 w-60 z-20 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(42, 27, 61, 0.92), rgba(30, 20, 45, 0.88))',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="px-3 py-2 border-b border-yellow-500/20 flex items-center justify-between bg-gradient-to-r from-purple-900/40 to-transparent">
            <div className="flex items-center gap-1.5">
              <span className="text-base">📜</span>
              <span className="font-pixel text-xs text-yellow-200">今日任务</span>
            </div>
            <span className="font-pixel text-[9px] text-yellow-400/70">{quests.filter(q=>q.progress>0).length}/{quests.length}</span>
          </div>
          <div className="px-3 py-2 space-y-2">
            {quests.map((q, i) => (
              <div key={i} className="p-2 rounded-lg transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm">{q.icon}</span>
                    <span className="font-pixel text-[10px] text-white/90 truncate">{q.title}</span>
                  </div>
                  <span className="font-pixel text-[8px] text-green-300 whitespace-nowrap">{q.progress}/3</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700/80 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-yellow-300 transition-all"
                    style={{ width: `${(q.progress/3)*100}%`, boxShadow: '0 0 4px rgba(74,222,128,0.5)' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-transparent border-t border-yellow-500/20 flex items-center justify-between">
            <span className="font-pixel text-[9px] text-yellow-300 flex items-center gap-1">🎁 总奖励</span>
            <span className="font-pixel text-[10px] text-yellow-200">+{quests.reduce((s,q)=>s+q.reward,0)} 金币</span>
          </div>
        </div>

        {/* 侧边菜单 */}
        <div className="absolute bottom-24 left-3 flex flex-col gap-2 z-20">
          {[
            { icon: '🎒', label: '背包', action: () => setShowInventory(true), count: '24/50' },
            { icon: '📖', label: '图鉴', action: () => setShowQuest(true), count: '' },
            { icon: '🏠', label: '家园', action: () => {}, count: '' },
            { icon: '💬', label: '聊天', action: () => {}, count: '3' },
          ].map((item, i) => (
            <button key={i} onClick={item.action}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:translate-x-1 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.55), rgba(138, 43, 226, 0.4))',
                border: '1.5px solid rgba(255, 215, 0, 0.4)',
                boxShadow: '0 4px 12px rgba(138, 43, 226, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-pixel text-[10px] text-yellow-200">{item.label}</span>
                {item.count && <span className="font-pixel text-[8px] text-yellow-400/70">{item.count}</span>}
              </div>
            </button>
          ))}
        </div>

        {/* 小地图 */}
        <div className="absolute bottom-24 right-3 z-20 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.92), rgba(15, 52, 96, 0.88))',
            border: '2px solid rgba(135, 206, 235, 0.45)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(135,206,235,0.2)',
          }}
        >
          <div className="px-2 py-1 bg-gradient-to-r from-sky-500/25 to-cyan-500/15 border-b border-sky-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs">🗺️</span>
              <span className="font-pixel text-[9px] text-sky-200">迷你地图</span>
            </div>
            <span className="font-pixel text-[8px] text-sky-300/70">中心草原</span>
          </div>
          <div className="w-36 h-36 relative p-2">
            <div className="absolute inset-2 rounded-xl"
              style={{
                background: `
                  radial-gradient(circle at 50% 50%, rgba(126, 200, 80, 0.55) 0%, rgba(100, 150, 100, 0.35) 60%, rgba(68, 153, 232, 0.25) 100%),
                  radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.4) 0%, transparent 12%),
                  radial-gradient(circle at 20% 80%, rgba(74, 222, 128, 0.4) 0%, transparent 12%)
                `,
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
              }}
            />
            {/* 村庄标记 */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.8)] border border-yellow-200" />
            {/* 农场标记 */}
            <div className="absolute bottom-5 left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)] border border-green-200" />
            {/* 玩家标记 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-white shadow-[0_0_14px_rgba(239,68,68,0.9)]" />
              <div className="absolute w-8 h-8 bg-red-500/25 rounded-full animate-ping" />
            </div>
          </div>
          <div className="px-2 py-1 bg-sky-500/10 border-t border-sky-500/30 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="flex items-center gap-0.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400" /><span className="font-pixel text-[7px] text-yellow-300/80">镇</span></div>
              <div className="flex items-center gap-0.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="font-pixel text-[7px] text-green-300/80">农</span></div>
            </div>
          </div>
        </div>

        {/* 浮动提示气泡 */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 opacity-70">
          <div className="px-4 py-2 rounded-2xl flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,215,0,0.08))',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            <span className="text-xl animate-bounce">💫</span>
            <span className="font-pixel text-xs text-yellow-100" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>
              欢迎冒险者！探索你的家园吧
            </span>
          </div>
        </div>
      </div>

      {/* ================ 底部技能栏 ================ */}
      <div className="relative z-30 px-3 py-3 flex items-end justify-center gap-3"
        style={{
          background: 'linear-gradient(0deg, rgba(42, 27, 61, 0.98) 0%, rgba(30, 20, 45, 0.92) 100%)',
          borderTop: '2px solid rgba(255, 215, 0, 0.35)',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* 物品快捷栏 */}
        <div className="flex items-end gap-2">
          {['🌰', '🥕', '🌾', '🪵'].map((item, i) => (
            <div key={`item-${i}`}
              className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.55), rgba(138, 43, 226, 0.35))',
                border: '2px solid rgba(255, 215, 0, 0.4)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.1)',
              }}
            >
              <span className="text-xl">{item}</span>
              <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center border-2 border-yellow-400/50 shadow-lg">
                <span className="font-pixel text-[9px] text-white font-bold">{(i+1)*10}</span>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-pixel text-[7px] text-yellow-300/80">{i+1}</div>
            </div>
          ))}
        </div>

        {/* 中央分隔符 */}
        <div className="relative flex flex-col items-center gap-1">
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-yellow-500/50 to-transparent" />
          <span className="text-yellow-400/60 text-xs">✦</span>
          <div className="w-px h-10 bg-gradient-to-b from-yellow-500/50 to-transparent" />
        </div>

        {/* 主技能栏 */}
        <div className="flex items-end gap-2">
          {skillItems.map((skill, i) => (
            <button key={i} onClick={() => setActiveSkill(activeSkill === i ? null : i)}
              className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${activeSkill === i ? 'scale-110 -translate-y-1' : 'hover:scale-105 hover:-translate-y-0.5'}`}
              style={{
                background: activeSkill === i
                  ? 'linear-gradient(135deg, rgba(255,215,0,0.4), rgba(255,165,0,0.3))'
                  : 'linear-gradient(135deg, rgba(75, 0, 130, 0.55), rgba(138, 43, 226, 0.35))',
                border: activeSkill === i ? '2px solid rgba(255, 215, 0, 0.85)' : '2px solid rgba(255, 215, 0, 0.4)',
                boxShadow: activeSkill === i
                  ? '0 0 24px rgba(255, 215, 0, 0.6), 0 4px 12px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.15)'
                  : '0 4px 12px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.1)',
              }}
            >
              <span className={`text-xl transition-transform ${activeSkill === i ? 'animate-bounce' : ''}`}>{skill.icon}</span>
              <span className="font-pixel text-[8px] text-yellow-200 mt-0.5">{skill.name}</span>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-gray-900/85 rounded flex items-center justify-center border border-yellow-500/30">
                <span className="font-pixel text-[9px] text-yellow-300">{skill.hotkey}</span>
              </div>
              {skillCooldowns[i] > 0 && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                  <span className="font-pixel text-sm text-white">{skillCooldowns[i]}</span>
                </div>
              )}
              {activeSkill === i && (
                <>
                  <div className="absolute -inset-1 rounded-2xl border-2 border-yellow-400/50 animate-pulse pointer-events-none" />
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-yellow-300 whitespace-nowrap animate-bounce">已选中</div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* 右侧分隔符 */}
        <div className="relative flex flex-col items-center gap-1">
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-yellow-500/50 to-transparent" />
          <span className="text-yellow-400/60 text-xs">✦</span>
          <div className="w-px h-10 bg-gradient-to-b from-yellow-500/50 to-transparent" />
        </div>

        {/* 系统按钮 */}
        <div className="flex items-end gap-2">
          {[
            { icon: '📜', label: '任务', action: () => setShowQuest(true) },
            { icon: '🎭', label: '角色', action: () => setShowCharSelect(true) },
          ].map((item, i) => (
            <button key={i} onClick={item.action}
              className="w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.55), rgba(138, 43, 226, 0.35))',
                border: '2px solid rgba(255, 215, 0, 0.4)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.1)',
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-pixel text-[7px] text-yellow-200 mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================ 角色选择弹窗 ================ */}
      {showCharSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowCharSelect(false)}
        >
          <div onClick={(e) => e.stopPropagation()}
            className="relative w-[540px] rounded-3xl overflow-hidden animate-[scaleIn_0.25s_ease-out]"
            style={{
              background: 'linear-gradient(135deg, rgba(42, 27, 61, 0.98), rgba(30, 20, 45, 0.96))',
              border: '3px solid rgba(255, 215, 0, 0.5)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 50px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* 顶部装饰 */}
            <div className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }}
            />
            {/* 标题栏 */}
            <div className="px-5 py-4 bg-gradient-to-r from-purple-900/50 via-pink-900/30 to-purple-900/50 border-b-2 border-yellow-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl animate-pulse">🎭</div>
                <div>
                  <span className="font-pixel text-base text-yellow-200" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>选择你的角色</span>
                  <div className="font-pixel text-[9px] text-yellow-400/60 mt-0.5">Pick Your Character</div>
                </div>
              </div>
              <button onClick={() => setShowCharSelect(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/30 hover:bg-red-500/50 border border-red-400/30 transition-all hover:scale-110"
              >
                <span className="text-yellow-200">✕</span>
              </button>
            </div>

            {/* 角色卡片 */}
            <div className="p-5 grid grid-cols-3 gap-3">
              {characters.map((c) => {
                const isActive = characterId === c.id;
                return (
                  <button key={c.id} onClick={() => {
                    setCharacter(c.id);
                    (window as any).__gameStore = { ...(window as any).__gameStore, characterId: c.id };
                  }}
                    className={`relative rounded-2xl p-3 transition-all hover:scale-105 ${isActive ? 'scale-105' : ''}`}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${c.color.includes('pink') ? 'rgba(244,114,182,0.35)' : c.color.includes('amber') ? 'rgba(251,191,36,0.35)' : 'rgba(52,211,153,0.35)'}, rgba(168,85,247,0.25))`
                        : 'rgba(30, 20, 50, 0.6)',
                      border: isActive ? '2px solid rgba(255, 215, 0, 0.7)' : '2px solid rgba(255, 215, 0, 0.25)',
                      boxShadow: isActive
                        ? `0 0 24px ${c.color.includes('pink') ? 'rgba(244,114,182,0.4)' : c.color.includes('amber') ? 'rgba(251,191,36,0.4)' : 'rgba(52,211,153,0.4)'}, 0 8px 24px rgba(0,0,0,0.4)`
                        : '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* 星级 */}
                    <div className="flex justify-center gap-0.5 mb-1">
                      {[...Array(c.rarity)].map((_, j) => (
                        <span key={j} className="text-xs" style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))' }}>⭐</span>
                      ))}
                    </div>
                    {/* 头像 */}
                    <div className="relative mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${c.color.includes('pink') ? '#fce7f3, #fbcfe8' : c.color.includes('amber') ? '#fef3c7, #fde68a' : '#d1fae5, #a7f3d0'})`,
                        border: '2px solid rgba(255, 215, 0, 0.5)',
                        boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      {c.emoji}
                      {/* 光圈 */}
                      {isActive && (
                        <div className="absolute -inset-2 rounded-2xl border-2 border-yellow-400/50 animate-ping pointer-events-none" />
                      )}
                    </div>
                    {/* 名字 */}
                    <div className="font-pixel text-sm text-yellow-200 text-center" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>{c.name}</div>
                    <div className="font-pixel text-[9px] text-yellow-400/70 text-center mt-0.5">{c.title}</div>
                    <div className="font-pixel text-[8px] text-white/60 text-center mt-1.5 leading-tight">{c.desc}</div>
                    {/* 选中标记 */}
                    {isActive && (
                      <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center border-2 border-yellow-200 shadow-lg animate-bounce">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 底部 */}
            <div className="px-5 py-3 bg-black/30 border-t-2 border-yellow-500/20 flex justify-between items-center">
              <div className="font-pixel text-[10px] text-yellow-400/60">当前：{currentChar.name} · {currentChar.title}</div>
              <button onClick={() => setShowCharSelect(false)}
                className="px-5 py-2 rounded-xl font-pixel text-xs text-yellow-100 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.35), rgba(255, 165, 0, 0.25))',
                  border: '1.5px solid rgba(255, 215, 0, 0.5)',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.25)',
                }}
              >确认选择 ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* ================ 背包弹窗 ================ */}
      {showInventory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowInventory(false)}
        >
          <div onClick={(e) => e.stopPropagation()}
            className="relative w-[500px] rounded-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]"
            style={{
              background: 'linear-gradient(135deg, rgba(42, 27, 61, 0.98), rgba(30, 20, 45, 0.96))',
              border: '3px solid rgba(255, 215, 0, 0.45)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <div className="px-4 py-3 bg-gradient-to-r from-purple-800/50 via-pink-800/30 to-purple-600/30 border-b-2 border-yellow-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <div>
                  <span className="font-pixel text-sm text-yellow-200">背包</span>
                  <span className="font-pixel text-[9px] text-yellow-400/60 ml-2">Inventory</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs text-yellow-300/70">容量 24/50</span>
                <button onClick={() => setShowInventory(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/30 hover:bg-red-500/50 border border-red-400/30 transition-all hover:scale-110"
                >
                  <span className="text-yellow-200">✕</span>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-1.5 mb-4 flex-wrap">
                {['全部', '材料', '工具', '作物', '食物', '宝箱'].map((tag, i) => (
                  <button key={i}
                    className={`px-3 py-1 rounded-lg font-pixel text-[9px] transition-all hover:scale-105 ${i === 0 ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50' : 'bg-gray-700/30 text-gray-300 border border-gray-600/30 hover:bg-gray-700/50'}`}
                  >{tag}</button>
                ))}
              </div>

              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: 32 }).map((_, i) => {
                  const items = ['🌰', '🥕', '🌾', '🪵', '🪨', '🌿', '🍎', '🥚'];
                  const hasItem = i < 18;
                  const item = items[i % items.length];
                  return (
                    <div key={i}
                      className="relative aspect-square rounded-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      style={{
                        background: hasItem ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.35), rgba(75, 0, 130, 0.25))' : 'rgba(30, 30, 50, 0.55)',
                        border: hasItem ? '1.5px solid rgba(255, 215, 0, 0.4)' : '1.5px dashed rgba(100, 100, 130, 0.3)',
                        boxShadow: hasItem ? 'inset 0 2px 6px rgba(255,215,0,0.12), 0 2px 6px rgba(0,0,0,0.2)' : 'none',
                      }}
                    >
                      {hasItem && (
                        <>
                          <span className="text-lg">{item}</span>
                          <div className="absolute bottom-0.5 right-1 font-pixel text-[8px] text-yellow-300 drop-shadow">{(i + 1) * 3}</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-4 py-3 bg-black/25 border-t-2 border-yellow-500/20 flex justify-between items-center">
              <button className="px-4 py-2 rounded-xl font-pixel text-xs text-yellow-200 bg-red-500/30 hover:bg-red-500/50 border border-red-400/30 transition-all hover:scale-105">📦 整理</button>
              <div className="flex gap-2">
                <button onClick={() => setShowInventory(false)}
                  className="px-4 py-2 rounded-xl font-pixel text-xs text-yellow-200 bg-yellow-500/30 hover:bg-yellow-500/50 border border-yellow-400/30 transition-all hover:scale-105">关闭 ✕</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================ 设置弹窗 ================ */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        >
          <div onClick={(e) => e.stopPropagation()}
            className="relative w-[420px] rounded-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]"
            style={{
              background: 'linear-gradient(135deg, rgba(42, 27, 61, 0.98), rgba(30, 20, 45, 0.96))',
              border: '3px solid rgba(255, 215, 0, 0.45)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            <div className="px-4 py-3 bg-gradient-to-r from-purple-800/50 to-purple-600/30 border-b-2 border-yellow-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <span className="font-pixel text-sm text-yellow-200">设置</span>
              </div>
              <button onClick={() => setShowSettings(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/30 hover:bg-red-500/50 border border-red-400/30 transition-all hover:scale-110"
              >
                <span className="text-yellow-200">✕</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              {[
                { icon: '🎵', label: '音乐', value: 75, color: 'from-purple-500 to-pink-400' },
                { icon: '🔊', label: '音效', value: 50, color: 'from-blue-500 to-cyan-400' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="font-pixel text-xs text-white/80">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-3 bg-gray-800/80 rounded-full overflow-hidden border border-yellow-500/30 relative">
                      <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: `${s.value}%`, boxShadow: '0 0 6px rgba(255, 215, 0, 0.5)' }} />
                    </div>
                    <span className="font-pixel text-[10px] text-yellow-300 w-8 text-right">{s.value}%</span>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🖼️</span>
                  <span className="font-pixel text-xs text-white/80">画质</span>
                </div>
                <div className="flex gap-1.5">
                  {['低', '中', '高'].map((q, i) => (
                    <button key={i}
                      className={`px-3 py-1 rounded-lg font-pixel text-[10px] transition-all hover:scale-105 ${i === 1 ? 'bg-yellow-500/40 text-yellow-200 border border-yellow-500/50' : 'bg-gray-700/40 text-gray-300 border border-gray-600/30 hover:bg-gray-700/60'}`}
                    >{q}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  <span className="font-pixel text-xs text-white/80">全屏模式</span>
                </div>
                <button className="w-12 h-6 rounded-full bg-gray-700/60 border border-gray-500/30 relative transition-all hover:scale-105">
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-gray-500 transition-all" />
                </button>
              </div>
            </div>

            <div className="px-4 py-3 bg-black/25 border-t-2 border-yellow-500/20 flex justify-end gap-2">
              <button onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-xl font-pixel text-xs text-yellow-200 bg-gray-600/30 hover:bg-gray-600/50 border border-gray-500/30 transition-all hover:scale-105">取消</button>
              <button className="px-4 py-2 rounded-xl font-pixel text-xs text-yellow-200 bg-yellow-500/30 hover:bg-yellow-500/50 border border-yellow-400/30 transition-all hover:scale-105">保存 ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* 动画关键帧 */}
      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.92) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(15px) scale(0.95); }
          15% { opacity: 1; transform: translateY(0) scale(1); }
          85% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(1.02); }
        }
        canvas { image-rendering: pixelated; }
      `}</style>
    </div>
  );
}
