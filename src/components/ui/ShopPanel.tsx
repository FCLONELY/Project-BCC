import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';

interface ShopPanelProps {
  visible: boolean;
  onClose: () => void;
}

export const ShopPanel: React.FC<ShopPanelProps> = ({ visible, onClose }) => {
  const { shopItems, inventory, player, buyItem, sellItem } = useGameStore();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!visible) return null;

  const handleBuy = (itemId: string) => {
    const quantity = quantities[itemId] || 1;
    buyItem(itemId, quantity);
    setQuantities({ ...quantities, [itemId]: 1 });
  };

  const handleSell = (itemId: string) => {
    const quantity = quantities[itemId] || 1;
    sellItem(itemId, quantity);
    setQuantities({ ...quantities, [itemId]: 1 });
  };

  const cropsAndMaterials = inventory.filter(i => ['crop', 'material'].includes(i.type));

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
          }}>🏪 商店</h2>
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
            }}>关闭</button>
          </div>
        </div>

        {/* 标签切换 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
        }}>
          <button onClick={() => setActiveTab('buy')} style={{
            backgroundColor: activeTab === 'buy' ? '#4a3a7e' : '#1a0f4e',
            border: activeTab === 'buy' ? '2px solid #FFD700' : '2px solid #4a3a7e',
            borderRadius: '8px',
            padding: '10px 20px',
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}>购买</button>
          <button onClick={() => setActiveTab('sell')} style={{
            backgroundColor: activeTab === 'sell' ? '#4a3a7e' : '#1a0f4e',
            border: activeTab === 'sell' ? '2px solid #FFD700' : '2px solid #4a3a7e',
            borderRadius: '8px',
            padding: '10px 20px',
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}>出售 (60%价)</button>
        </div>

        {/* 商品列表 */}
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '10px',
        }}>
          {activeTab === 'buy' ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {shopItems.map((shopItem) => (
                <div key={shopItem.item.id} style={{
                  backgroundColor: '#1a0f4e',
                  border: '2px solid #4a3a7e',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <span style={{ fontSize: '32px' }}>{shopItem.item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: '"Press Start 2P"',
                      fontSize: '12px',
                      color: '#FFFFFF',
                    }}>{shopItem.item.name}</div>
                    <div style={{
                      fontFamily: '"Press Start 2P"',
                      fontSize: '10px',
                      color: '#90EE90',
                      marginTop: '4px',
                    }}>库存: {shopItem.stock}</div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <span style={{
                      fontFamily: '"Press Start 2P"',
                      fontSize: '12px',
                      color: '#FFD700',
                    }}>💰 {shopItem.item.price}</span>
                    <input
                      type="number"
                      min="1"
                      max={shopItem.stock}
                      defaultValue="1"
                      style={{
                        width: '50px',
                        backgroundColor: '#1a0f4e',
                        border: '2px solid #4a3a7e',
                        borderRadius: '4px',
                        color: '#FFFFFF',
                        fontFamily: '"Press Start 2P"',
                        fontSize: '12px',
                        textAlign: 'center',
                      }}
                      onChange={(e) => setQuantities({ ...quantities, [shopItem.item.id]: parseInt(e.target.value) || 1 })}
                    />
                    <button onClick={() => handleBuy(shopItem.item.id)} style={{
                      backgroundColor: '#228B22',
                      border: '2px solid #32CD32',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontFamily: '"Press Start 2P"',
                      fontSize: '10px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                    }}>购买</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {cropsAndMaterials.length === 0 ? (
                <div style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '12px',
                  color: '#90EE90',
                  textAlign: 'center',
                  padding: '20px',
                }}>没有可出售的物品</div>
              ) : (
                cropsAndMaterials.map((item) => (
                  <div key={item.id} style={{
                    backgroundColor: '#1a0f4e',
                    border: '2px solid #4a3a7e',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                  }}>
                    <span style={{ fontSize: '32px' }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: '"Press Start 2P"',
                        fontSize: '12px',
                        color: '#FFFFFF',
                      }}>{item.name}</div>
                      <div style={{
                        fontFamily: '"Press Start 2P"',
                        fontSize: '10px',
                        color: '#90EE90',
                        marginTop: '4px',
                      }}>数量: {item.quantity}</div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <span style={{
                        fontFamily: '"Press Start 2P"',
                        fontSize: '12px',
                        color: '#FFD700',
                      }}>💰 {Math.floor(item.price * 0.6)}</span>
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        defaultValue="1"
                        style={{
                          width: '50px',
                          backgroundColor: '#1a0f4e',
                          border: '2px solid #4a3a7e',
                          borderRadius: '4px',
                          color: '#FFFFFF',
                          fontFamily: '"Press Start 2P"',
                          fontSize: '12px',
                          textAlign: 'center',
                        }}
                        onChange={(e) => setQuantities({ ...quantities, [item.id]: parseInt(e.target.value) || 1 })}
                      />
                      <button onClick={() => handleSell(item.id)} style={{
                        backgroundColor: '#C1444E',
                        border: '2px solid #FF6B6B',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontFamily: '"Press Start 2P"',
                        fontSize: '10px',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                      }}>出售</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
