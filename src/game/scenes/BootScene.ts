import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.createLoadingUI();
  }

  create() {
    // 关键：在 create 阶段生成所有纹理，这样才能保证纹理被正确注册到 Texture Manager
    this.generateAllTextures();
    this.time.delayedCall(500, () => {
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.time.delayedCall(600, () => {
        this.scene.start('WorldScene');
      });
    });
  }

  createLoadingUI() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 渐变背景
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0f2e, 0x0f0f2e, 0x2a1a5e, 0x2a1a5e, 1);
    bg.fillRect(0, 0, width, height);

    // 背景星星粒子
    for (let i = 0; i < 80; i++) {
      const star = this.add.circle(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2 + 0.5,
        0xffffff,
        Math.random() * 0.6 + 0.2
      );
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0 },
        duration: Math.random() * 2500 + 1200,
        repeat: -1,
        yoyo: true,
      });
    }

    // 标题发光效果
    const titleGlow = this.add.text(width / 2, height / 2 - 130, '🌿 田园大世界 🌿', {
      fontFamily: '"Press Start 2P"',
      fontSize: '28px',
      color: '#FFD700',
      stroke: '#4a3a00',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#FFD700', blur: 12, fill: true },
    }).setOrigin(0.5);

    // 装饰光环
    const ring = this.add.graphics();
    ring.lineStyle(3, 0x7EC850, 0.5);
    ring.strokeCircle(width / 2, height / 2 - 110, 140);
    this.tweens.add({
      targets: ring,
      alpha: { from: 0.8, to: 0.2 },
      scale: { from: 0.9, to: 1.1 },
      duration: 2000,
      repeat: -1,
      yoyo: true,
    });

    this.tweens.add({
      targets: titleGlow,
      y: titleGlow.y + 8,
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    // 副标题
    this.add.text(width / 2, height / 2 - 70, 'Rural World Simulator', {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      color: '#F5D654',
      stroke: '#4a3a00',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // 加载进度条框（二游风格）
    const barBg = this.add.graphics();
    barBg.fillStyle(0x1a1a3e, 0.9);
    barBg.fillRect(width / 2 - 220, height / 2 + 20, 440, 50);
    barBg.lineStyle(3, 0xFFD700, 0.9);
    barBg.strokeRect(width / 2 - 220, height / 2 + 20, 440, 50);

    // 边角装饰
    const corners = [
      [width / 2 - 228, height / 2 + 12],
      [width / 2 + 220, height / 2 + 12],
      [width / 2 - 228, height / 2 + 64],
      [width / 2 + 220, height / 2 + 64],
    ];
    corners.forEach(([cx, cy]) => {
      const dot = this.add.graphics();
      dot.fillStyle(0xFFD700, 1);
      dot.fillRect(cx, cy, 8, 8);
      this.tweens.add({
        targets: dot,
        alpha: { from: 1, to: 0.3 },
        duration: 1000,
        repeat: -1,
        yoyo: true,
      });
    });

    const progressBar = this.add.graphics();
    const progressText = this.add.text(width / 2, height / 2 + 45, '加载中 0%', {
      fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#FFFFFF',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);

    const loadingTip = this.add.text(width / 2, height / 2 + 100, '正在初始化游戏世界...', {
      fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#a0c0ff',
    }).setOrigin(0.5);

    const tips = [
      '✨ 正在初始化游戏世界...',
      '🌸 正在加载像素资源...',
      '🌊 正在生成地形数据...',
      '🌾 正在唤醒你的小农场...',
      '👒 正在召唤可爱的村民...',
      '🎉 准备出发！',
    ];
    let tipIndex = 0;
    const tipTimer = this.time.addEvent({
      delay: 700, callback: () => { tipIndex = (tipIndex + 1) % tips.length; loadingTip.setText(tips[tipIndex]); }, loop: true,
    });

    let progress = 0;
    const progressTimer = this.time.addEvent({
      delay: 40, callback: () => {
        progress += Math.random() * 4 + 2;
        if (progress >= 100) {
          progress = 100;
          progressTimer.destroy();
          tipTimer.destroy();
        }
        progressBar.clear();
        progressBar.fillStyle(0x2a1a5e, 0.8);
        progressBar.fillRect(width / 2 - 215, height / 2 + 25, 430, 40);
        // 金色发光进度条
        const barW = 430 * progress / 100;
        progressBar.fillStyle(0xFFA500, 1);
        progressBar.fillRect(width / 2 - 215, height / 2 + 25, barW, 40);
        progressBar.fillStyle(0xFFD700, 1);
        progressBar.fillRect(width / 2 - 215, height / 2 + 25, barW, 8);
        progressBar.fillStyle(0xFFFF99, 0.8);
        progressBar.fillRect(width / 2 - 215, height / 2 + 25, Math.min(barW, 30), 3);
        progressText.setText(`加载中 ${Math.floor(progress)}%`);
      }, loop: true,
    });

    // 底部版本信息
    this.add.text(width - 15, height - 15, 'v0.2.0 · 二游风格', {
      fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#7a7aaa',
    }).setOrigin(1, 1);

    this.add.text(15, height - 15, '💫 建造属于你的梦幻家园', {
      fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#7a7aaa',
    }).setOrigin(0, 1);
  }

  generateAllTextures() {
    // ==== 草地瓦片 (32x32) ====
    const grass = this.add.graphics();
    grass.fillStyle(0x7EC850).fillRect(0, 0, 32, 32);
    grass.fillStyle(0x8FD14F).fillRect(4, 4, 3, 3).fillRect(20, 10, 3, 3).fillRect(8, 22, 2, 2);
    grass.fillStyle(0x6BB045).fillRect(12, 18, 3, 3).fillRect(26, 26, 2, 2);
    grass.fillStyle(0x9AD956).fillRect(2, 14, 2, 2);
    grass.generateTexture('grass', 32, 32); grass.destroy();

    // ==== 沙地瓦片 ====
    const sand = this.add.graphics();
    sand.fillStyle(0xE8D498).fillRect(0, 0, 32, 32);
    sand.fillStyle(0xD4C088).fillRect(6, 8, 4, 3).fillRect(22, 18, 3, 2);
    sand.fillStyle(0xF0DCB0).fillRect(14, 14, 2, 2).fillRect(26, 4, 2, 2);
    sand.generateTexture('sand', 32, 32); sand.destroy();

    // ==== 水域瓦片 ====
    const water = this.add.graphics();
    water.fillStyle(0x4682B4).fillRect(0, 0, 32, 32);
    water.fillStyle(0x5B9BD5).fillRect(0, 0, 32, 6);
    water.fillStyle(0x87CEEB).fillRect(4, 10, 10, 2).fillRect(18, 20, 10, 2).fillRect(8, 26, 6, 2);
    water.generateTexture('water', 32, 32); water.destroy();

    // ==== 小路（石板路） ====
    const path = this.add.graphics();
    path.fillStyle(0x8B8682).fillRect(0, 0, 32, 32);
    path.fillStyle(0x696969).fillRect(0, 0, 32, 2).fillRect(0, 30, 32, 2);
    path.fillStyle(0xA9A9A9).fillRect(4, 4, 10, 8).fillRect(18, 6, 10, 6).fillRect(6, 18, 8, 10).fillRect(18, 16, 10, 12);
    path.fillStyle(0xC0C0C0).fillRect(5, 5, 3, 3).fillRect(20, 7, 2, 2);
    path.generateTexture('path', 32, 32); path.destroy();

    // ==== 角色 1：少女 (heroine1) 64x64 ====
    this.generateHeroine1Textures();

    // ==== 角色 2：少年 (heroine2) 64x64 ====
    this.generateHeroine2Textures();

    // ==== 角色 3：精灵少女 (heroine3) 64x64 ====
    this.generateHeroine3Textures();

    // ==== 大型树 (64x72) ====
    this.generateTreeTexture();

    // ==== 樱花树 ====
    this.generateCherryTreeTexture();

    // ==== 大石头 (48x40) ====
    this.generateRockTexture();

    // ==== 花 (24x24) ====
    this.generateFlowerTextures();

    // ==== 蘑菇 ====
    this.generateMushroomTexture();

    // ==== 大型房屋 (80x80) ====
    this.generateHouseTexture();

    // ==== 小屋 (64x64) ====
    this.generateCottageTexture();

    // ==== NPC ====
    this.generateNpcTextures();

    // ==== 金币 ====
    this.generateCoinTexture();

    // ==== 作物 ====
    this.generateCropTextures();

    // ==== 栅栏 ====
    this.generateFenceTexture();

    // ==== 井 ====
    this.generateWellTexture();

    // ==== 灯笼/路灯 ====
    this.generateLanternTexture();

    // ==== 木箱 ====
    this.generateChestTexture();
  }

  // ========== 角色 1：粉发少女 ==========
  generateHeroine1Textures() {
    const dirs = ['down', 'up', 'left', 'right'];
    dirs.forEach((dir) => {
      const g = this.add.graphics();
      // 阴影(脚下) - 绘制在精灵底部
      // 头部 (20x20)
      g.fillStyle(0xFFE4C4).fillRect(22, 8, 20, 18);
      // 头发（粉色）
      g.fillStyle(0xFFB6C1).fillRect(20, 4, 24, 10);
      g.fillStyle(0xFFC0CB).fillRect(18, 6, 4, 16).fillRect(42, 6, 4, 16);
      // 头顶高光
      g.fillStyle(0xFFE4E9).fillRect(24, 6, 4, 2);
      // 刘海
      g.fillStyle(0xFFB6C1).fillRect(22, 10, 20, 4);
      g.fillStyle(0xFF9EB5).fillRect(22, 12, 20, 2);
      // 辫子（两侧）
      g.fillStyle(0xFFB6C1).fillRect(16, 16, 4, 14).fillRect(44, 16, 4, 14);
      g.fillStyle(0xFF9EB5).fillRect(16, 28, 4, 2).fillRect(44, 28, 4, 2);
      // 头饰（小花）
      g.fillStyle(0xFF69B4).fillRect(40, 6, 4, 4);
      g.fillStyle(0xFFFF99).fillRect(41, 7, 2, 2);

      // 眼睛
      if (dir === 'down') {
        g.fillStyle(0x000000).fillRect(26, 18, 3, 3).fillRect(35, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1).fillRect(36, 18, 1, 1);
        g.fillStyle(0x87CEEB).fillRect(26, 19, 1, 1).fillRect(35, 19, 1, 1);
        // 腮红
        g.fillStyle(0xFFB6C1).fillRect(23, 22, 3, 2).fillRect(38, 22, 3, 2);
        // 嘴
        g.fillStyle(0xFF8FA3).fillRect(30, 23, 4, 1);
      } else if (dir === 'up') {
        // 背面 - 没有眼睛
        g.fillStyle(0xFFB6C1).fillRect(22, 10, 20, 6);
        // 后脑头发
        g.fillStyle(0xFF9EB5).fillRect(22, 12, 20, 2);
      } else if (dir === 'left') {
        g.fillStyle(0x000000).fillRect(24, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(25, 18, 1, 1);
        g.fillStyle(0xFFB6C1).fillRect(22, 22, 3, 2);
      } else if (dir === 'right') {
        g.fillStyle(0x000000).fillRect(37, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(38, 18, 1, 1);
        g.fillStyle(0xFFB6C1).fillRect(39, 22, 3, 2);
      }

      // 脖子
      g.fillStyle(0xFFE4C4).fillRect(28, 26, 8, 4);

      // 身体（白色连衣裙 + 粉色装饰）
      g.fillStyle(0xFFFFFF).fillRect(18, 30, 28, 22);
      // 领口
      g.fillStyle(0xFFB6C1).fillRect(24, 30, 16, 4);
      g.fillStyle(0xFF69B4).fillRect(26, 30, 12, 2);
      // 衣服装饰带
      g.fillStyle(0xFFB6C1).fillRect(18, 38, 28, 3);
      g.fillStyle(0xFF69B4).fillRect(30, 36, 4, 6);
      // 白色扣子
      g.fillStyle(0xFFD700).fillRect(31, 40, 2, 2);
      // 裙边
      g.fillStyle(0xFFE4E9).fillRect(16, 48, 32, 4);

      // 手臂
      g.fillStyle(0xFFE4C4).fillRect(14, 32, 6, 12).fillRect(44, 32, 6, 12);
      // 袖口
      g.fillStyle(0xFFFFFF).fillRect(14, 32, 6, 4).fillRect(44, 32, 6, 4);

      // 腿（白色长袜）
      g.fillStyle(0xFFFFFF).fillRect(22, 52, 8, 10).fillRect(34, 52, 8, 10);
      // 鞋子（粉色小皮鞋）
      g.fillStyle(0xFF69B4).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);
      g.fillStyle(0xFF1493).fillRect(20, 62, 12, 2).fillRect(32, 62, 12, 2);

      g.generateTexture(`hero1-${dir}`, 64, 64);
      g.destroy();
    });

    // 走路动画帧
    for (let f = 1; f <= 4; f++) {
      const g = this.add.graphics();
      g.fillStyle(0xFFE4C4).fillRect(22, 8, 20, 18);
      g.fillStyle(0xFFB6C1).fillRect(20, 4, 24, 10);
      g.fillStyle(0xFFC0CB).fillRect(18, 6, 4, 16).fillRect(42, 6, 4, 16);
      g.fillStyle(0xFFE4E9).fillRect(24, 6, 4, 2);
      g.fillStyle(0xFFB6C1).fillRect(22, 10, 20, 4);
      g.fillStyle(0xFF69B4).fillRect(40, 6, 4, 4);
      g.fillStyle(0xFFFF99).fillRect(41, 7, 2, 2);
      g.fillStyle(0xFFB6C1).fillRect(16, 16, 4, 14).fillRect(44, 16, 4, 14);
      g.fillStyle(0x000000).fillRect(26, 18, 3, 3).fillRect(35, 18, 3, 3);
      g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1).fillRect(36, 18, 1, 1);
      g.fillStyle(0xFFB6C1).fillRect(23, 22, 3, 2).fillRect(38, 22, 3, 2);
      g.fillStyle(0xFFE4C4).fillRect(28, 26, 8, 4);
      g.fillStyle(0xFFFFFF).fillRect(18, 30, 28, 22);
      g.fillStyle(0xFFB6C1).fillRect(24, 30, 16, 4);
      g.fillStyle(0xFFB6C1).fillRect(18, 38, 28, 3);
      g.fillStyle(0xFF69B4).fillRect(30, 36, 4, 6);
      g.fillStyle(0xFFD700).fillRect(31, 40, 2, 2);
      g.fillStyle(0xFFE4E9).fillRect(16, 48, 32, 4);
      g.fillStyle(0xFFE4C4).fillRect(14, 32, 6, 12).fillRect(44, 32, 6, 12);
      g.fillStyle(0xFFFFFF).fillRect(14, 32, 6, 4).fillRect(44, 32, 6, 4);
      // 走路腿位移
      if (f === 1) {
        g.fillStyle(0xFFFFFF).fillRect(22, 52, 8, 10).fillRect(34, 52, 8, 10);
        g.fillStyle(0xFF69B4).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);
      } else if (f === 2) {
        g.fillStyle(0xFFFFFF).fillRect(24, 52, 8, 8).fillRect(32, 52, 8, 10);
        g.fillStyle(0xFF69B4).fillRect(22, 58, 12, 4).fillRect(30, 60, 12, 4);
      } else if (f === 3) {
        g.fillStyle(0xFFFFFF).fillRect(22, 52, 8, 10).fillRect(34, 52, 8, 10);
        g.fillStyle(0xFF69B4).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);
      } else {
        g.fillStyle(0xFFFFFF).fillRect(22, 52, 8, 10).fillRect(36, 52, 8, 8);
        g.fillStyle(0xFF69B4).fillRect(20, 60, 12, 4).fillRect(34, 58, 12, 4);
      }
      g.generateTexture(`hero1-walk${f}`, 64, 64);
      g.destroy();
    }
  }

  // ========== 角色 2：少年 ==========
  generateHeroine2Textures() {
    const dirs = ['down', 'up', 'left', 'right'];
    dirs.forEach((dir) => {
      const g = this.add.graphics();
      // 头
      g.fillStyle(0xFFE4C4).fillRect(22, 8, 20, 18);
      // 棕色短发
      g.fillStyle(0x654321).fillRect(20, 4, 24, 10);
      g.fillStyle(0x8B4513).fillRect(20, 6, 24, 4);
      g.fillStyle(0x654321).fillRect(22, 12, 20, 3);
      // 帽子（草帽）
      g.fillStyle(0xDAA520).fillRect(14, 2, 36, 6);
      g.fillStyle(0xF4D03F).fillRect(20, 0, 24, 4);
      g.fillStyle(0x8B6914).fillRect(14, 6, 36, 2);

      // 眼睛
      if (dir === 'down') {
        g.fillStyle(0x000000).fillRect(26, 18, 3, 3).fillRect(35, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1).fillRect(36, 18, 1, 1);
        g.fillStyle(0x228B22).fillRect(26, 19, 1, 1).fillRect(35, 19, 1, 1);
        // 嘴
        g.fillStyle(0x8B4513).fillRect(30, 23, 4, 1);
      } else if (dir === 'up') {
        g.fillStyle(0x654321).fillRect(22, 10, 20, 6);
      } else if (dir === 'left') {
        g.fillStyle(0x000000).fillRect(24, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(25, 18, 1, 1);
      } else if (dir === 'right') {
        g.fillStyle(0x000000).fillRect(37, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(38, 18, 1, 1);
      }

      // 脖子
      g.fillStyle(0xFFE4C4).fillRect(28, 26, 8, 4);

      // 身体（蓝色T恤 + 棕色背带裤）
      g.fillStyle(0x4169E1).fillRect(18, 30, 28, 16);
      g.fillStyle(0x5B9BD5).fillRect(18, 30, 28, 3);
      // 背带
      g.fillStyle(0x8B4513).fillRect(22, 30, 4, 16).fillRect(38, 30, 4, 16);
      g.fillStyle(0xFFD700).fillRect(23, 42, 2, 2).fillRect(39, 42, 2, 2);
      // 裤子
      g.fillStyle(0x8B4513).fillRect(18, 46, 28, 8);
      g.fillStyle(0x654321).fillRect(18, 52, 28, 2);

      // 手臂
      g.fillStyle(0xFFE4C4).fillRect(14, 32, 6, 14).fillRect(44, 32, 6, 14);
      g.fillStyle(0x4169E1).fillRect(14, 32, 6, 4).fillRect(44, 32, 6, 4);

      // 腿
      g.fillStyle(0x8B4513).fillRect(22, 54, 8, 8).fillRect(34, 54, 8, 8);
      // 鞋子（棕色）
      g.fillStyle(0x3E2723).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);
      g.fillStyle(0x5D4037).fillRect(20, 60, 12, 1).fillRect(32, 60, 12, 1);

      g.generateTexture(`hero2-${dir}`, 64, 64);
      g.destroy();
    });

    // 走路帧
    for (let f = 1; f <= 4; f++) {
      const g = this.add.graphics();
      g.fillStyle(0xFFE4C4).fillRect(22, 8, 20, 18);
      g.fillStyle(0x654321).fillRect(20, 4, 24, 10);
      g.fillStyle(0x8B4513).fillRect(20, 6, 24, 4);
      g.fillStyle(0xDAA520).fillRect(14, 2, 36, 6);
      g.fillStyle(0xF4D03F).fillRect(20, 0, 24, 4);
      g.fillStyle(0x8B6914).fillRect(14, 6, 36, 2);
      g.fillStyle(0x000000).fillRect(26, 18, 3, 3).fillRect(35, 18, 3, 3);
      g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1).fillRect(36, 18, 1, 1);
      g.fillStyle(0xFFE4C4).fillRect(28, 26, 8, 4);
      g.fillStyle(0x4169E1).fillRect(18, 30, 28, 16);
      g.fillStyle(0x5B9BD5).fillRect(18, 30, 28, 3);
      g.fillStyle(0x8B4513).fillRect(22, 30, 4, 16).fillRect(38, 30, 4, 16);
      g.fillStyle(0x8B4513).fillRect(18, 46, 28, 8);
      g.fillStyle(0xFFE4C4).fillRect(14, 32, 6, 14).fillRect(44, 32, 6, 14);
      g.fillStyle(0x4169E1).fillRect(14, 32, 6, 4).fillRect(44, 32, 6, 4);
      if (f === 2 || f === 4) {
        g.fillStyle(0x8B4513).fillRect(24, 54, 8, 8).fillRect(34, 54, 8, 6);
        g.fillStyle(0x3E2723).fillRect(22, 60, 12, 4).fillRect(32, 58, 12, 4);
      } else {
        g.fillStyle(0x8B4513).fillRect(22, 54, 8, 8).fillRect(34, 54, 8, 8);
        g.fillStyle(0x3E2723).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);
      }
      g.generateTexture(`hero2-walk${f}`, 64, 64);
      g.destroy();
    }
  }

  // ========== 角色 3：精灵少女 ==========
  generateHeroine3Textures() {
    const dirs = ['down', 'up', 'left', 'right'];
    dirs.forEach((dir) => {
      const g = this.add.graphics();
      // 头
      g.fillStyle(0xFFF0DB).fillRect(22, 8, 20, 18);
      // 长发（绿色）
      g.fillStyle(0x228B22).fillRect(18, 4, 28, 12);
      g.fillStyle(0x32CD32).fillRect(18, 6, 28, 4);
      g.fillStyle(0x228B22).fillRect(16, 14, 6, 26).fillRect(42, 14, 6, 26);
      // 头顶呆毛
      g.fillStyle(0x228B22).fillRect(30, 0, 4, 4);
      g.fillStyle(0x32CD32).fillRect(30, 0, 4, 2);
      // 精灵耳朵尖
      g.fillStyle(0xFFF0DB).fillRect(18, 14, 2, 4).fillRect(44, 14, 2, 4);

      // 叶子发饰
      g.fillStyle(0x228B22).fillRect(20, 4, 6, 4);
      g.fillStyle(0x7CFC00).fillRect(21, 5, 2, 2);

      // 眼睛（绿色）
      if (dir === 'down') {
        g.fillStyle(0x000000).fillRect(26, 18, 3, 3).fillRect(35, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1).fillRect(36, 18, 1, 1);
        g.fillStyle(0x32CD32).fillRect(26, 19, 1, 1).fillRect(35, 19, 1, 1);
        g.fillStyle(0xFFB6C1).fillRect(23, 22, 3, 2).fillRect(38, 22, 3, 2);
        g.fillStyle(0xFF8FA3).fillRect(30, 23, 4, 1);
      } else if (dir === 'up') {
        g.fillStyle(0x228B22).fillRect(22, 10, 20, 6);
      } else if (dir === 'left') {
        g.fillStyle(0x000000).fillRect(24, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(25, 18, 1, 1);
      } else if (dir === 'right') {
        g.fillStyle(0x000000).fillRect(37, 18, 3, 3);
        g.fillStyle(0xFFFFFF).fillRect(38, 18, 1, 1);
      }

      // 脖子
      g.fillStyle(0xFFF0DB).fillRect(28, 26, 8, 4);

      // 绿色连衣裙
      g.fillStyle(0x228B22).fillRect(18, 30, 28, 22);
      g.fillStyle(0x32CD32).fillRect(18, 30, 28, 4);
      // 衣领
      g.fillStyle(0x90EE90).fillRect(26, 30, 12, 4);
      // 花朵装饰
      g.fillStyle(0xFF69B4).fillRect(28, 38, 4, 4).fillRect(36, 44, 3, 3);
      g.fillStyle(0xFFFF99).fillRect(29, 39, 2, 2);
      // 裙边
      g.fillStyle(0x90EE90).fillRect(16, 48, 32, 4);

      // 手臂
      g.fillStyle(0xFFF0DB).fillRect(14, 32, 6, 12).fillRect(44, 32, 6, 12);
      g.fillStyle(0x228B22).fillRect(14, 32, 6, 4).fillRect(44, 32, 6, 4);

      // 腿
      g.fillStyle(0xFFF0DB).fillRect(22, 52, 8, 10).fillRect(34, 52, 8, 10);
      // 棕色鞋
      g.fillStyle(0x8B4513).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);
      g.fillStyle(0x654321).fillRect(20, 62, 12, 2).fillRect(32, 62, 12, 2);

      g.generateTexture(`hero3-${dir}`, 64, 64);
      g.destroy();
    });

    for (let f = 1; f <= 4; f++) {
      const g = this.add.graphics();
      g.fillStyle(0xFFF0DB).fillRect(22, 8, 20, 18);
      g.fillStyle(0x228B22).fillRect(18, 4, 28, 12);
      g.fillStyle(0x32CD32).fillRect(18, 6, 28, 4);
      g.fillStyle(0x228B22).fillRect(16, 14, 6, 26).fillRect(42, 14, 6, 26);
      g.fillStyle(0x228B22).fillRect(30, 0, 4, 4);
      g.fillStyle(0x228B22).fillRect(20, 4, 6, 4);
      g.fillStyle(0x7CFC00).fillRect(21, 5, 2, 2);
      g.fillStyle(0x000000).fillRect(26, 18, 3, 3).fillRect(35, 18, 3, 3);
      g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1).fillRect(36, 18, 1, 1);
      g.fillStyle(0xFFB6C1).fillRect(23, 22, 3, 2).fillRect(38, 22, 3, 2);
      g.fillStyle(0xFFF0DB).fillRect(28, 26, 8, 4);
      g.fillStyle(0x228B22).fillRect(18, 30, 28, 22);
      g.fillStyle(0x32CD32).fillRect(18, 30, 28, 4);
      g.fillStyle(0x90EE90).fillRect(26, 30, 12, 4);
      g.fillStyle(0xFF69B4).fillRect(28, 38, 4, 4).fillRect(36, 44, 3, 3);
      g.fillStyle(0xFFFF99).fillRect(29, 39, 2, 2);
      g.fillStyle(0x90EE90).fillRect(16, 48, 32, 4);
      g.fillStyle(0xFFF0DB).fillRect(14, 32, 6, 12).fillRect(44, 32, 6, 12);
      g.fillStyle(0x228B22).fillRect(14, 32, 6, 4).fillRect(44, 32, 6, 4);
      if (f === 2 || f === 4) {
        g.fillStyle(0xFFF0DB).fillRect(24, 52, 8, 10).fillRect(34, 52, 8, 8);
        g.fillStyle(0x8B4513).fillRect(22, 60, 12, 4).fillRect(32, 58, 12, 4);
      } else {
        g.fillStyle(0xFFF0DB).fillRect(22, 52, 8, 10).fillRect(34, 52, 8, 10);
        g.fillStyle(0x8B4513).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);
      }
      g.generateTexture(`hero3-walk${f}`, 64, 64);
      g.destroy();
    }
  }

  // ========== 大型树 ==========
  generateTreeTexture() {
    const t = this.add.graphics();
    // 阴影
    t.fillStyle(0x000000, 0.2).fillEllipse(32, 70, 48, 10);
    // 树干
    t.fillStyle(0x5C3317).fillRect(24, 40, 16, 30);
    t.fillStyle(0x8B4513).fillRect(26, 40, 12, 30);
    t.fillStyle(0xA0522D).fillRect(26, 40, 3, 30);
    t.fillStyle(0x3E2723).fillRect(24, 66, 16, 4);
    // 枝桠
    t.fillStyle(0x5C3317).fillRect(20, 42, 4, 2).fillRect(40, 44, 4, 2);
    // 树冠（多层）
    t.fillStyle(0x0f4d1a).fillRect(4, 16, 56, 30).fillRect(8, 10, 48, 8).fillRect(0, 22, 64, 18);
    t.fillStyle(0x228B22).fillRect(8, 18, 48, 24).fillRect(4, 24, 56, 14);
    t.fillStyle(0x32CD32).fillRect(12, 20, 40, 16).fillRect(16, 14, 32, 8);
    t.fillStyle(0x7CFC00).fillRect(20, 18, 4, 3).fillRect(40, 22, 4, 3).fillRect(30, 28, 3, 3);
    t.fillStyle(0x90EE90).fillRect(14, 26, 3, 3).fillRect(48, 20, 3, 3);
    // 树叶阴影
    t.fillStyle(0x0a3d14).fillRect(6, 38, 10, 6).fillRect(48, 38, 10, 6);
    t.generateTexture('tree-big', 64, 72); t.destroy();
  }

  // ========== 樱花树 ==========
  generateCherryTreeTexture() {
    const t = this.add.graphics();
    t.fillStyle(0x000000, 0.2).fillEllipse(32, 70, 48, 10);
    t.fillStyle(0x5C3317).fillRect(26, 40, 12, 30);
    t.fillStyle(0x8B4513).fillRect(28, 40, 8, 30);
    t.fillStyle(0xFFB6C1).fillRect(6, 18, 52, 28).fillRect(10, 10, 44, 10).fillRect(2, 24, 60, 16);
    t.fillStyle(0xFFC0CB).fillRect(10, 20, 44, 22).fillRect(6, 26, 52, 12);
    t.fillStyle(0xFFE4E9).fillRect(14, 22, 36, 14).fillRect(18, 14, 28, 8);
    t.fillStyle(0xFF69B4).fillRect(20, 20, 3, 3).fillRect(44, 26, 3, 3).fillRect(30, 32, 3, 3).fillRect(16, 30, 3, 3).fillRect(42, 18, 3, 3);
    t.fillStyle(0xFFFFFF).fillRect(24, 24, 2, 2).fillRect(38, 28, 2, 2).fillRect(32, 18, 2, 2);
    t.generateTexture('tree-cherry', 64, 72); t.destroy();
  }

  // ========== 大石头 ==========
  generateRockTexture() {
    const r = this.add.graphics();
    r.fillStyle(0x000000, 0.2).fillEllipse(24, 38, 44, 8);
    r.fillStyle(0x3a3a3a).fillRect(2, 4, 44, 32);
    r.fillStyle(0x5a5a5a).fillRect(4, 4, 40, 30);
    r.fillStyle(0x7a7a7a).fillRect(6, 6, 36, 20);
    r.fillStyle(0x9a9a9a).fillRect(10, 8, 20, 8);
    r.fillStyle(0xB0B0B0).fillRect(12, 10, 8, 3);
    r.fillStyle(0x4a4a4a).fillRect(2, 32, 44, 4);
    r.fillStyle(0x2a2a2a).fillRect(8, 24, 4, 3).fillRect(28, 26, 6, 3);
    // 苔藓
    r.fillStyle(0x228B22).fillRect(6, 8, 4, 2).fillRect(36, 10, 5, 3);
    r.fillStyle(0x32CD32).fillRect(7, 8, 2, 1).fillRect(37, 10, 3, 1);
    r.generateTexture('rock-big', 48, 40); r.destroy();
  }

  // ========== 花（多种） ==========
  generateFlowerTextures() {
    const colors = [
      { main: 0xFF69B4, light: 0xFFB6C1, name: 'flower-pink' },
      { main: 0xFFD700, light: 0xFFFF99, name: 'flower-yellow' },
      { main: 0x9370DB, light: 0xDDA0DD, name: 'flower-purple' },
      { main: 0xFF6347, light: 0xFFA07A, name: 'flower-red' },
      { main: 0x87CEEB, light: 0xE0FFFF, name: 'flower-blue' },
    ];
    colors.forEach(({ main, light, name }) => {
      const g = this.add.graphics();
      g.fillStyle(0x228B22).fillRect(10, 14, 4, 10);
      g.fillStyle(0x32CD32).fillRect(6, 12, 4, 3).fillRect(14, 16, 4, 3);
      g.fillStyle(main).fillRect(6, 4, 12, 12);
      g.fillStyle(light).fillRect(8, 6, 8, 8);
      g.fillStyle(0xFFFF99).fillRect(10, 8, 4, 4);
      g.fillStyle(main).fillRect(4, 8, 3, 4).fillRect(17, 8, 3, 4).fillRect(10, 2, 4, 3).fillRect(10, 14, 4, 3);
      g.generateTexture(name, 24, 24); g.destroy();
    });
  }

  // ========== 蘑菇 ==========
  generateMushroomTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xF5DEB3).fillRect(8, 12, 8, 10);
    g.fillStyle(0xFFE4C4).fillRect(9, 13, 6, 8);
    g.fillStyle(0xFF4500).fillRect(2, 4, 20, 10);
    g.fillStyle(0xFF6347).fillRect(4, 5, 16, 6);
    g.fillStyle(0xFFFFFF).fillRect(6, 6, 3, 3).fillRect(14, 8, 2, 2).fillRect(10, 4, 2, 2);
    g.generateTexture('mushroom', 24, 24); g.destroy();
  }

  // ========== 大型房屋 ==========
  generateHouseTexture() {
    const h = this.add.graphics();
    // 屋顶三角
    h.fillStyle(0x8B2500);
    for (let i = 0; i < 24; i++) {
      h.fillRect(28 - i, 8 + i, 2 + i * 2, 2);
    }
    // 屋顶主体
    h.fillStyle(0xC1444E).fillRect(8, 24, 64, 12);
    h.fillStyle(0xA33339).fillRect(8, 34, 64, 2);
    h.fillStyle(0x8B2500).fillRect(8, 24, 64, 2);
    // 屋顶高光
    h.fillStyle(0xE57373).fillRect(12, 26, 56, 2);
    // 墙体
    h.fillStyle(0xE8D498).fillRect(10, 36, 60, 36);
    h.fillStyle(0xD4B889).fillRect(10, 70, 60, 2);
    h.fillStyle(0xF5DEB3).fillRect(10, 36, 60, 2);
    // 木板纹理
    h.fillStyle(0xD4B889).fillRect(10, 44, 60, 1).fillRect(10, 54, 60, 1).fillRect(10, 64, 60, 1);
    // 门
    h.fillStyle(0x5C3317).fillRect(32, 44, 16, 28);
    h.fillStyle(0x8B4513).fillRect(34, 46, 12, 24);
    h.fillStyle(0x654321).fillRect(34, 46, 12, 2);
    h.fillStyle(0xFFD700).fillRect(42, 58, 2, 2);
    // 左窗
    h.fillStyle(0x4682B4).fillRect(14, 42, 12, 12);
    h.fillStyle(0x87CEEB).fillRect(15, 43, 10, 10);
    h.fillStyle(0xFFFFFF).fillRect(15, 43, 2, 2);
    h.fillStyle(0x5C3317).fillRect(14, 42, 12, 1).fillRect(19, 42, 1, 12).fillRect(14, 47, 12, 1);
    // 右窗
    h.fillStyle(0x4682B4).fillRect(54, 42, 12, 12);
    h.fillStyle(0x87CEEB).fillRect(55, 43, 10, 10);
    h.fillStyle(0xFFFFFF).fillRect(55, 43, 2, 2);
    h.fillStyle(0x5C3317).fillRect(54, 42, 12, 1).fillRect(59, 42, 1, 12).fillRect(54, 47, 12, 1);
    // 花盆
    h.fillStyle(0x8B4513).fillRect(14, 56, 12, 4).fillRect(54, 56, 12, 4);
    h.fillStyle(0xFF69B4).fillRect(16, 52, 4, 4).fillRect(58, 52, 4, 4);
    h.fillStyle(0xFFD700).fillRect(20, 54, 2, 2).fillRect(62, 54, 2, 2);
    // 烟囱
    h.fillStyle(0x696969).fillRect(54, 10, 8, 14);
    h.fillStyle(0x5a5a5a).fillRect(54, 10, 8, 2);
    // 招牌
    h.fillStyle(0x8B4513).fillRect(26, 38, 28, 8);
    h.fillStyle(0xFFD700).fillRect(28, 40, 24, 4);
    // 台阶
    h.fillStyle(0x696969).fillRect(30, 72, 20, 4);
    h.fillStyle(0x808080).fillRect(30, 72, 20, 1);
    h.generateTexture('house-big', 80, 80); h.destroy();
  }

  // ========== 小屋 ==========
  generateCottageTexture() {
    const c = this.add.graphics();
    c.fillStyle(0x228B22);
    for (let i = 0; i < 18; i++) {
      c.fillRect(22 - i, 14 + i, 2 + i * 2, 2);
    }
    c.fillStyle(0x32CD32).fillRect(6, 28, 52, 8);
    c.fillStyle(0x228B22).fillRect(6, 34, 52, 2);
    c.fillStyle(0xE8D498).fillRect(8, 36, 48, 28);
    c.fillStyle(0xD4B889).fillRect(8, 62, 48, 2);
    c.fillStyle(0x5C3317).fillRect(26, 42, 12, 22);
    c.fillStyle(0x8B4513).fillRect(28, 44, 8, 18);
    c.fillStyle(0x4682B4).fillRect(12, 42, 10, 10);
    c.fillStyle(0x87CEEB).fillRect(13, 43, 8, 8);
    c.fillStyle(0x4682B4).fillRect(42, 42, 10, 10);
    c.fillStyle(0x87CEEB).fillRect(43, 43, 8, 8);
    c.fillStyle(0xFFFFFF).fillRect(13, 43, 2, 2).fillRect(43, 43, 2, 2);
    c.generateTexture('cottage', 64, 64); c.destroy();
  }

  // ========== NPC（2个） ==========
  generateNpcTextures() {
    const npcs = [
      { hair: 0x8B4513, cloth: 0x9370DB, name: 'npc-oldman' },
      { hair: 0xFFD700, cloth: 0xFF69B4, name: 'npc-girl' },
    ];
    npcs.forEach(({ hair, cloth, name }) => {
      const g = this.add.graphics();
      g.fillStyle(0xFFE4C4).fillRect(24, 8, 16, 16);
      g.fillStyle(hair).fillRect(24, 6, 16, 8);
      g.fillStyle(0x000000).fillRect(27, 15, 2, 2).fillRect(35, 15, 2, 2);
      g.fillStyle(0xFFB6C1).fillRect(25, 19, 2, 2).fillRect(37, 19, 2, 2);
      g.fillStyle(cloth).fillRect(20, 24, 24, 20);
      g.fillStyle(0xFFFFFF).fillRect(20, 24, 24, 3);
      g.fillStyle(0xFFE4C4).fillRect(16, 26, 4, 10).fillRect(44, 26, 4, 10);
      g.fillStyle(0x2F4F4F).fillRect(24, 44, 6, 8).fillRect(34, 44, 6, 8);
      g.fillStyle(0x000000).fillRect(22, 50, 8, 2).fillRect(34, 50, 8, 2);
      g.generateTexture(name, 64, 54); g.destroy();
    });
  }

  // ========== 金币 ==========
  generateCoinTexture() {
    const frames = [0, 1, 2, 3];
    frames.forEach((f) => {
      const g = this.add.graphics();
      if (f === 0) {
        g.fillStyle(0xFFD700).fillCircle(12, 12, 10);
        g.fillStyle(0xFFA500).fillCircle(12, 12, 6);
        g.fillStyle(0xFFFF99).fillRect(8, 8, 3, 3);
      } else if (f === 1) {
        g.fillStyle(0xFFD700).fillRect(6, 6, 12, 12);
        g.fillStyle(0xFFA500).fillRect(8, 8, 8, 8);
      } else if (f === 2) {
        g.fillStyle(0xB8860B).fillRect(10, 6, 4, 12);
        g.fillStyle(0x8B6914).fillRect(11, 8, 2, 8);
      } else {
        g.fillStyle(0xFFD700).fillRect(4, 6, 16, 12);
        g.fillStyle(0xFFA500).fillRect(6, 8, 12, 8);
      }
      g.generateTexture(`coin-${f}`, 24, 24); g.destroy();
    });
  }

  // ========== 作物 ==========
  generateCropTextures() {
    const stages = [
      { name: 'crop-seed', y: 18, color: 0x8B4513, size: 4 },
      { name: 'crop-sprout', y: 12, color: 0x90EE90, size: 8 },
      { name: 'crop-growing', y: 6, color: 0x32CD32, size: 14 },
      { name: 'crop-mature', y: 2, color: 0x228B22, size: 18 },
    ];
    stages.forEach(({ name, y, color, size }) => {
      const g = this.add.graphics();
      g.fillStyle(0x8B7355).fillRect(0, 20, 32, 12);
      g.fillStyle(0x6B5344).fillRect(0, 20, 32, 2).fillRect(0, 30, 32, 2);
      g.fillStyle(0xA08550).fillRect(4, 24, 4, 2).fillRect(20, 26, 4, 2);
      // 茎
      g.fillStyle(0x228B22).fillRect(14, y, 4, 22 - y + 4);
      g.fillStyle(0x32CD32).fillRect(15, y, 2, 22 - y + 4);
      // 叶子
      g.fillStyle(color).fillCircle(16, y + size / 2, size / 2);
      g.fillStyle(0x90EE90).fillCircle(14, y + size / 2 - 2, 2);
      if (name === 'crop-mature') {
        g.fillStyle(0xFF4500).fillCircle(10, y, 3).fillRect(20, y, 4, 4).fillCircle(16, y - 4, 3);
        g.fillStyle(0xFF6347).fillCircle(11, y + 1, 2).fillRect(21, y + 1, 2, 2);
      }
      g.generateTexture(name, 32, 32); g.destroy();
    });
  }

  // ========== 栅栏 ==========
  generateFenceTexture() {
    const f = this.add.graphics();
    f.fillStyle(0x8B4513).fillRect(0, 8, 32, 4).fillRect(0, 20, 32, 4);
    f.fillStyle(0xA0522D).fillRect(0, 8, 32, 1).fillRect(0, 20, 32, 1);
    f.fillStyle(0x654321).fillRect(4, 4, 4, 28).fillRect(14, 4, 4, 28).fillRect(24, 4, 4, 28);
    f.fillStyle(0x8B4513).fillRect(5, 4, 2, 28).fillRect(15, 4, 2, 28).fillRect(25, 4, 2, 28);
    f.fillStyle(0x5C3317).fillRect(4, 2, 4, 2).fillRect(14, 2, 4, 2).fillRect(24, 2, 4, 2);
    f.generateTexture('fence', 32, 32); f.destroy();
  }

  generateWellTexture() {
    const w = this.add.graphics();
    w.fillStyle(0x696969).fillRect(4, 36, 56, 20);
    w.fillStyle(0x808080).fillRect(6, 38, 52, 16);
    w.fillStyle(0x4A4A4A).fillRect(8, 42, 48, 10);
    w.fillStyle(0x4682B4).fillRect(10, 44, 44, 6);
    w.fillStyle(0x5C3317).fillRect(8, 12, 6, 28).fillRect(48, 12, 6, 28);
    w.fillStyle(0x8B4513).fillRect(10, 10, 44, 8);
    w.fillStyle(0x654321).fillRect(10, 10, 44, 2);
    w.generateTexture('well', 64, 60); w.destroy();
  }

  generateLanternTexture() {
    const l = this.add.graphics();
    l.fillStyle(0x5C3317).fillRect(14, 0, 4, 8);
    l.fillStyle(0xFFD700).fillRect(8, 8, 16, 16);
    l.fillStyle(0xFFA500).fillRect(10, 10, 12, 12);
    l.fillStyle(0xFFFF99).fillRect(12, 12, 4, 4);
    l.fillStyle(0x5C3317).fillRect(6, 8, 20, 2).fillRect(6, 22, 20, 2);
    l.fillStyle(0x5C3317).fillRect(14, 24, 4, 16);
    l.generateTexture('lantern', 32, 40); l.destroy();
  }

  generateChestTexture() {
    const c = this.add.graphics();
    c.fillStyle(0x5C3317).fillRect(4, 12, 28, 20);
    c.fillStyle(0x8B4513).fillRect(6, 14, 24, 16);
    c.fillStyle(0x654321).fillRect(6, 14, 24, 2);
    c.fillStyle(0xFFD700).fillRect(4, 12, 28, 3).fillRect(4, 28, 28, 3).fillRect(4, 12, 3, 20).fillRect(28, 12, 3, 20);
    c.fillStyle(0xFFD700).fillRect(16, 18, 4, 8);
    c.fillStyle(0x000000).fillRect(17, 20, 2, 3);
    c.generateTexture('chest', 36, 36); c.destroy();
  }
}
