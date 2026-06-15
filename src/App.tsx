import { useEffect, useState } from 'react';
import GameCanvas from '@/components/ui/GameCanvas';
import { useGameStore } from '@/stores/gameStore';

export default function Game() {
  const { player, characterId, setCharacter } = useGameStore();
  const [showInventory, setShowInventory] = useState(false);
  const [showCharSelect, setShowCharSelect] = useState(false);
  const [showQuest, setShowQuest] = useState(false);

  const skillCooldowns = [0, 0, 0, 0];
  const skillItems = [
    { icon: '⛏️', name: '挖矿', hotkey: '1' },
    { icon: '🪓', name: '砍树', hotkey: '2' },
    { icon: '🌾', name: '收割', hotkey: '3' },
    { icon: '🪣', name: '浇水', hotkey: '4' },
  ];

  const quests = [
    { title: '种植胡萝卜', progress: 0, reward: 50, icon: '🥕' },
    { title: '与村民对话', progress: 1, reward: 100, icon: '💬' },
    { title: '收集木材', progress: 0, reward: 80, icon: '🪵' },
    { title: '探索小镇', progress: 2, reward: 200, icon: '🏡' },
  ];

  const currentName = characterId === 2 ? '小牧' : '小樱';

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #1a1a3e 0%, #2a1a5e 30%, #1a0f4e 100%)',
      overflow: 'hidden',
      position: 'relative',
      margin: 0,
      padding: 0,
    }}>
      {/* ===== 顶部状态栏 ===== */}
      <div style={{
        flexShrink: 0,
        padding: '8px 12px',
        background: 'linear-gradient(180deg, rgba(42, 27, 61, 0.98) 0%, rgba(30, 20, 45, 0.92) 100%)',
        borderBottom: '2px solid rgba(255, 215, 0, 0.35)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 100,
      }}>
        {/* 标题 */}
        <div style={{
          fontFamily: '"Press Start 2P"',
          fontSize: '14px',
          color: '#FFD700',
          textShadow: '2px 2px 0 rgba(0,0,0,0.5), 0 0 8px rgba(255,215,0,0.4)',
          whiteSpace: 'nowrap',
        }}>🌿 田园大世界</div>

        {/* 分隔 */}
        <div style={{
          width: '1px',
          height: '28px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.4), transparent)',
        }} />

        {/* 角色选择按钮 */}
        <button onClick={() => setShowCharSelect(true)} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: characterId === 2
            ? 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(30,64,175,0.25))'
            : 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(190,24,93,0.25))',
          border: '1.5px solid rgba(255, 215, 0, 0.5)',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: 'white',
          fontFamily: '"Press Start 2P"',
          fontSize: '10px',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <span style={{ fontSize: '16px' }}>{characterId === 2 ? '👦' : '👧'}</span>
          <span style={{ color: '#FFD700' }}>{currentName}</span>
          <span style={{ color: '#FFD70080', fontSize: '8px' }}>切换</span>
        </button>

        {/* 金币 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 165, 0, 0.15))',
          border: '1.5px solid rgba(255, 215, 0, 0.5)',
          borderRadius: '8px',
          marginLeft: 'auto',
        }}>
          <span style={{ fontSize: '16px' }}>🪙</span>
          <span style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#FFD700',
            textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
          }}>{player.coins}</span>
        </div>

        {/* 体力 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(239, 68, 68, 0.18)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '8px',
        }}>
          <span>⚡</span>
          <div style={{
            width: '80px',
            height: '8px',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid rgba(239,68,68,0.3)',
          }}>
            <div style={{
              width: `${(player.energy / player.maxEnergy) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ef4444, #f97316, #fbbf24)',
              boxShadow: '0 0 6px rgba(251,191,36,0.6)',
            }} />
          </div>
        </div>
      </div>

      {/* ===== 游戏画布容器 ===== */}
      <div style={{
        flex: '1 1 auto',
        flexBasis: '500px',
        position: 'relative',
        height: '600px',
        minHeight: '500px',
        overflow: 'hidden',
        width: '100%',
        display: 'block',
      }}>
        {/* GameCanvas 在这里渲染 Phaser 游戏 */}
        <GameCanvas />

        {/* 任务面板 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '220px',
          background: 'linear-gradient(135deg, rgba(42, 27, 61, 0.92), rgba(30, 20, 45, 0.9))',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          overflow: 'hidden',
          zIndex: 50,
        }}>
          <div style={{
            padding: '8px 12px',
            background: 'linear-gradient(90deg, rgba(147,51,234,0.3), transparent)',
            borderBottom: '1px solid rgba(255,215,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📜</span>
              <span style={{
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#FFD700',
              }}>今日任务</span>
            </div>
            <span style={{
              fontFamily: '"Press Start 2P"',
              fontSize: '8px',
              color: '#FFD70080',
            }}>{quests.filter(q=>q.progress>0).length}/{quests.length}</span>
          </div>
          <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {quests.map((q, i) => {
              const pct = (q.progress / 3) * 100;
              return (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,215,0,0.15)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
                      <span style={{ fontSize: '12px' }}>{q.icon}</span>
                      <span style={{
                        fontFamily: '"Press Start 2P"',
                        fontSize: '8px',
                        color: 'white',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{q.title}</span>
                    </div>
                    <span style={{
                      fontFamily: '"Press Start 2P"',
                      fontSize: '8px',
                      color: '#90EE90',
                      whiteSpace: 'nowrap',
                    }}>{q.progress}/3</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '5px',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,215,0,0.2)',
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #22c55e, #84cc16, #facc15)',
                      boxShadow: '0 0 4px rgba(132,204,22,0.6)',
                      transition: 'width 0.5s',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            padding: '6px 8px',
            background: 'linear-gradient(90deg, rgba(255,215,0,0.15), transparent)',
            borderTop: '1px solid rgba(255,215,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: '"Press Start 2P"',
              fontSize: '8px',
              color: '#FFD700',
            }}>🎁 总奖励</span>
            <span style={{
              fontFamily: '"Press Start 2P"',
              fontSize: '9px',
              color: '#FFD700',
            }}>🪙 {quests.reduce((s,q)=>s+q.reward, 0)}</span>
          </div>
        </div>

        {/* 侧边菜单 */}
        <div style={{
          position: 'absolute',
          bottom: '90px',
          left: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 50,
        }}>
          {[
            { icon: '🎒', label: '背包', action: () => setShowInventory(true) },
            { icon: '📖', label: '图鉴', action: () => setShowQuest(true) },
            { icon: '🏠', label: '家园', action: () => {} },
            { icon: '💬', label: '聊天', action: () => {} },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.55), rgba(138, 43, 226, 0.4))',
              border: '1.5px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'white',
              minWidth: '80px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(138,43,226,0.25)',
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,215,0,0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(138,43,226,0.25)';
            }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#FFD700',
              }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* 迷你地图 */}
        <div style={{
          position: 'absolute',
          bottom: '90px',
          right: '16px',
          width: '150px',
          background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.92), rgba(15, 52, 96, 0.88))',
          border: '2px solid rgba(135, 206, 235, 0.45)',
          borderRadius: '12px',
          overflow: 'hidden',
          zIndex: 50,
        }}>
          <div style={{
            padding: '6px 8px',
            background: 'linear-gradient(90deg, rgba(56,189,248,0.25), transparent)',
            borderBottom: '1px solid rgba(135,206,235,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px' }}>🗺️</span>
              <span style={{
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#87CEEB',
              }}>迷你地图</span>
            </div>
            <span style={{
              fontFamily: '"Press Start 2P"',
              fontSize: '8px',
              color: '#87CEEB80',
            }}>中心草原</span>
          </div>
          <div style={{
            position: 'relative',
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle at 50% 50%, rgba(126, 200, 80, 0.55), rgba(100, 150, 100, 0.35) 60%, rgba(68, 153, 232, 0.25) 100%)`,
          }}>
            {/* 村庄标记 */}
            <div style={{
              position: 'absolute', top: '32px', right: '24px',
              width: '12px', height: '12px',
              background: '#FFD700',
              borderRadius: '3px',
              boxShadow: '0 0 10px rgba(255,215,0,0.8)',
              border: '1.5px solid #fff5cc',
            }} />
            {/* 农场标记 */}
            <div style={{
              position: 'absolute', bottom: '36px', left: '28px',
              width: '12px', height: '12px',
              background: '#22c55e',
              borderRadius: '3px',
              boxShadow: '0 0 10px rgba(34,197,94,0.8)',
              border: '1.5px solid #bbf7d0',
            }} />
            {/* 玩家标记 */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '14px', height: '14px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 0 14px rgba(239,68,68,0.9), 0 0 24px rgba(239,68,68,0.5)',
            }}>
              <div style={{
                position: 'absolute', inset: '-6px',
                borderRadius: '50%',
                border: '2px solid rgba(239,68,68,0.4)',
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
              }} />
            </div>
          </div>
        </div>

        {/* 操作提示 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '6px 16px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,215,0,0.08))',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 50,
        }}>
          <span style={{ fontSize: '14px' }}>💫</span>
          <span style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#FFD700',
            textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
          }}>使用 WASD 或 方向键 移动，探索世界！</span>
        </div>
      </div>

      {/* ===== 底部技能栏 ===== */}
      <div style={{
        flexShrink: 0,
        padding: '12px',
        background: 'linear-gradient(0deg, rgba(42, 27, 61, 0.98) 0%, rgba(30, 20, 45, 0.92) 100%)',
        borderTop: '2px solid rgba(255, 215, 0, 0.35)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4), inset 0 -1px 0 rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        zIndex: 100,
      }}>
        {/* 物品栏 */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          {['🌰', '🥕', '🌾', '🪵'].map((item, i) => (
            <div key={i} style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.55), rgba(138, 43, 226, 0.35))',
              border: '2px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,215,0,0.4)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <span style={{ fontSize: '18px' }}>{item}</span>
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '9px',
                border: '1.5px solid rgba(255,215,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: 'white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}>{(i + 1) * 10}</div>
            </div>
          ))}
        </div>

        {/* 中央分隔符 */}
        <div style={{
          width: '2px',
          height: '40px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.5), transparent)',
        }} />

        {/* 技能栏 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          {skillItems.map((skill, i) => (
            <button key={i} style={{
              position: 'relative',
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.6), rgba(138, 43, 226, 0.45))',
              border: '2px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0,
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <span style={{ fontSize: '20px' }}>{skill.icon}</span>
              <span style={{
                fontFamily: '"Press Start 2P"',
                fontSize: '8px',
                color: '#FFD700',
                marginTop: '2px',
              }}>{skill.name}</span>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: '2px',
                width: '16px',
                height: '16px',
                background: 'rgba(0,0,0,0.7)',
                borderRadius: '4px',
                border: '1px solid rgba(255,215,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#FFD700',
              }}>{skill.hotkey}</div>
              {skillCooldowns[i] > 0 && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '14px',
                }}>{skillCooldowns[i]}</div>
              )}
            </button>
          ))}
        </div>

        {/* 右侧分隔符 */}
        <div style={{
          width: '2px',
          height: '40px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.5), transparent)',
        }} />

        {/* 系统按钮 */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          <button onClick={() => setShowCharSelect(true)} style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.55), rgba(138, 43, 226, 0.4))',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            padding: 0,
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
            <span style={{ fontSize: '18px' }}>🎭</span>
            <span style={{
              fontFamily: '"Press Start 2P"',
              fontSize: '7px',
              color: '#FFD700',
              marginTop: '2px',
            }}>角色</span>
          </button>
        </div>
      </div>

      {/* ===== 角色选择弹窗 ===== */}
      {showCharSelect && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowCharSelect(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '460px',
            background: 'linear-gradient(135deg, rgba(42, 27, 61, 0.98), rgba(30, 20, 45, 0.96))',
            border: '3px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 50px rgba(255,215,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(90deg, rgba(147,51,234,0.3), transparent, rgba(147,51,234,0.3))',
              borderBottom: '2px solid rgba(255,215,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>🎭</span>
                <div>
                  <div style={{
                    fontFamily: '"Press Start 2P"',
                    fontSize: '14px',
                    color: '#FFD700',
                    textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                  }}>选择你的角色</div>
                  <div style={{
                    fontFamily: '"Press Start 2P"',
                    fontSize: '8px',
                    color: '#FFD70080',
                    marginTop: '3px',
                  }}>Pick Your Character</div>
                </div>
              </div>
              <button onClick={() => setShowCharSelect(false)} style={{
                width: '32px', height: '32px',
                background: 'rgba(239,68,68,0.3)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '8px',
                color: '#FFD700',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s',
              }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.5)'}
                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}>✕</button>
            </div>

            <div style={{ padding: '24px 20px', display: 'flex', gap: '16px' }}>
              {[
                { id: 1, emoji: '👧', name: '小樱', color: '#ec4899', desc: '粉色头发的可爱女孩' },
                { id: 2, emoji: '👦', name: '小牧', color: '#3b82f6', desc: '戴着草帽的勇敢男孩' },
              ].map((c) => {
                const isActive = characterId === c.id;
                return (
                  <button key={c.id} onClick={() => {
                    setCharacter(c.id);
                    (window as any).__gameStore = { ...(window as any).__gameStore, characterId: c.id };
                  }} style={{
                    flex: 1,
                    padding: '20px 16px',
                    background: isActive
                      ? `linear-gradient(135deg, ${c.color}55, rgba(168,85,247,0.25))`
                      : 'rgba(30, 20, 50, 0.6)',
                    border: `2px solid ${isActive ? 'rgba(255,215,0,0.75)' : 'rgba(255,215,0,0.25)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? `0 0 24px ${c.color}40, 0 8px 24px rgba(0,0,0,0.4)` : '0 4px 12px rgba(0,0,0,0.3)',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    position: 'relative',
                  }} onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.transform = 'scale(1.05)';
                  }} onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.transform = 'scale(1)';
                  }}>
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '28px',
                        height: '28px',
                        background: 'linear-gradient(135deg, #facc15, #eab308)',
                        borderRadius: '50%',
                        border: '2px solid #fff5cc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        boxShadow: '0 0 12px rgba(255,215,0,0.8)',
                        animation: 'bounce 1s infinite',
                      }}>✓</div>
                    )}
                    <div style={{
                      width: '72px',
                      height: '72px',
                      margin: '0 auto 12px',
                      background: `linear-gradient(135deg, ${c.color}40, ${c.color}20)`,
                      border: `2px solid ${c.color}60`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px',
                      boxShadow: `0 0 16px ${c.color}40`,
                    }}>{c.emoji}</div>
                    <div style={{
                      fontFamily: '"Press Start 2P"',
                      fontSize: '12px',
                      color: '#FFD700',
                      textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                      textAlign: 'center',
                    }}>{c.name}</div>
                    <div style={{
                      fontFamily: '"Press Start 2P"',
                      fontSize: '8px',
                      color: 'rgba(255,255,255,0.6)',
                      textAlign: 'center',
                      marginTop: '8px',
                      lineHeight: '1.5',
                    }}>{c.desc}</div>
                  </button>
                );
              })}
            </div>

            <div style={{
              padding: '12px 20px',
              background: 'rgba(0,0,0,0.25)',
              borderTop: '2px solid rgba(255,215,0,0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#FFD70080',
              }}>当前：{currentName}</div>
              <button onClick={() => setShowCharSelect(false)} style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.35), rgba(255,165,0,0.25))',
                border: '1.5px solid rgba(255,215,0,0.5)',
                borderRadius: '8px',
                color: '#FFD700',
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,215,0,0.4)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>确认选择 ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 背包弹窗 ===== */}
      {showInventory && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowInventory(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '460px',
            background: 'linear-gradient(135deg, rgba(42, 27, 61, 0.98), rgba(30, 20, 45, 0.96))',
            border: '3px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px',
              background: 'linear-gradient(90deg, rgba(147,51,234,0.3), transparent)',
              borderBottom: '2px solid rgba(255,215,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🎒</span>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#FFD700' }}>背包</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#FFD70080' }}>24/50</span>
                <button onClick={() => setShowInventory(false)} style={{
                  width: '30px', height: '30px',
                  background: 'rgba(239,68,68,0.3)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  borderRadius: '8px',
                  color: '#FFD700',
                  cursor: 'pointer',
                }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '8px',
              }}>
                {Array.from({ length: 32 }).map((_, i) => {
                  const items = ['🌰', '🥕', '🌾', '🪵', '🪨', '🌿', '🍎', '🥚', '🍞', '🧀', '🪙', '💎'];
                  const hasItem = i < 24;
                  const item = items[i % items.length];
                  return (
                    <div key={i} style={{
                      aspectRatio: '1',
                      background: hasItem ? 'linear-gradient(135deg, rgba(138,43,226,0.35), rgba(75,0,130,0.25))' : 'rgba(30,30,50,0.55)',
                      border: `2px solid ${hasItem ? 'rgba(255,215,0,0.4)' : 'rgba(100,100,130,0.3)'}`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: hasItem ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                    }}>
                      {hasItem && (
                        <>
                          <span style={{ fontSize: '18px' }}>{item}</span>
                          <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '4px',
                            fontFamily: '"Press Start 2P"',
                            fontSize: '8px',
                            color: '#FFD700',
                            textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                          }}>{(i + 1) * 3}</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{
              padding: '12px 20px',
              background: 'rgba(0,0,0,0.25)',
              borderTop: '2px solid rgba(255,215,0,0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                padding: '8px 16px',
                background: 'rgba(239,68,68,0.25)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '8px',
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#fca5a5',
                cursor: 'pointer',
              }}>🗑 整理</div>
              <button onClick={() => setShowInventory(false)} style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.35), rgba(255,165,0,0.25))',
                border: '1.5px solid rgba(255,215,0,0.5)',
                borderRadius: '8px',
                color: '#FFD700',
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                cursor: 'pointer',
              }}>关闭 ✕</button>
            </div>
          </div>
        </div>
      )}

      {/* 全局动画样式 */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2) translate(-25%, -25%); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-15%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
