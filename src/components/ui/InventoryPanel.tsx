import React from 'react';
import { useGameStore, ITEMS } from '../../stores/gameStore';

interface InventoryPanelProps {
  visible: boolean;
  onClose: () => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ visible, onClose }) => {
  const { inventory, selectedTool, selectTool, player } = useGameStore();

  if (!visible) return null;

  const tools = inventory.filter(i => i.type === 'tool');
  const seeds = inventory.filter(i => i.type === 'seed');
  const crops = inventory.filter(i => i.type === 'crop');
  const materials = inventory.filter(i => i.type === 'material' || i.type === 'consumable');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    }} onClick={onClose}>
      <div style={{
        width: '90%',
        maxWidth: '600px',
        backgroundColor: '#2a1a5e',
        borderRadius: '16px',
        border: '3px solid #FFD700',
        padding: '20px',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#FFD700',
            margin: 0,
          }}>🎒 背包</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{
              fontFamily: '"Press Start 2P"',
              fontSize: '12px',
              color: '#FFD700',
            }}>💰 {player.coins}</span>
            <button onClick={onClose} style={{
              backgroundColor: '#C1444E',
              border: '2px solid #FF6B6B',
              borderRadius: '8px',
              padding: '8px 16px',
              fontFamily: '"Press Start 2P"',
              fontSize: '12px',
              color: '#FFFFFF',
              cursor: 'pointer',
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF6B6B'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1444E'}>关闭</button>
          </div>
        </div>

        {/* 工具栏 */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#90EE90',
            marginBottom: '10px',
          }}>🔧 工具</h3>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            {tools.map((item) => (
              <div key={item.id} style={{
                backgroundColor: selectedTool === item.id ? '#4a3a7e' : '#1a0f4e',
                border: selectedTool === item.id ? '2px solid #FFD700' : '2px solid #4a3a7e',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px',
              }} onClick={() => selectTool(selectedTool === item.id ? null : item.id)}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '8px',
                  color: '#FFFFFF',
                  marginTop: '5px',
                  textAlign: 'center',
                }}>{item.name}</span>
                <span style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '8px',
                  color: '#90EE90',
                }}>{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 种子 */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FF69B4',
            marginBottom: '10px',
          }}>🌱 种子</h3>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            {seeds.map((item) => (
              <div key={item.id} style={{
                backgroundColor: '#1a0f4e',
                border: '2px solid #FF69B4',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px',
              }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '8px',
                  color: '#FFFFFF',
                  marginTop: '5px',
                  textAlign: 'center',
                }}>{item.name}</span>
                <span style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '8px',
                  color: '#FF69B4',
                }}>x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 作物 */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFD700',
            marginBottom: '10px',
          }}>🌾 作物</h3>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            {crops.map((item) => (
              <div key={item.id} style={{
                backgroundColor: '#1a0f4e',
                border: '2px solid #FFD700',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px',
              }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '8px',
                  color: '#FFFFFF',
                  marginTop: '5px',
                  textAlign: 'center',
                }}>{item.name}</span>
                <span style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '8px',
                  color: '#FFD700',
                }}>x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 材料和消耗品 */}
        <div>
          <h3 style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#87CEEB',
            marginBottom: '10px',
          }}>📦 材料</h3>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            {materials.map((item) => (
              <div key={item.id} style={{
                backgroundColor: '#1a0f4e',
                border: '2px solid #87CEEB',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px',
              }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '8px',
                  color: '#FFFFFF',
                  marginTop: '5px',
                  textAlign: 'center',
                }}>{item.name}</span>
                <span style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '8px',
                  color: '#87CEEB',
                }}>x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
