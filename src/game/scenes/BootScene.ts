import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.createLoadingUI();
  }

  create() {
    this.generateAllTextures();
    this.time.delayedCall(600, () => {
      this.scene.start('WorldScene');
    });
  }

  createLoadingUI() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const bg = this.add.graphics();
    bg.fillStyle(0x1a0f4e, 1);
    bg.fillRect(0, 0, width, height);

    const title = this.add.text(width / 2, height / 2 - 100, '田园大世界', {
      fontFamily: '"Press Start 2P"',
      fontSize: '28px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      scale: { from: 0.95, to: 1.05 },
      duration: 1500,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    const barBg = this.add.graphics();
    barBg.fillStyle(0x1a1a3e, 0.9);
    barBg.fillRect(width / 2 - 200, height / 2 + 10, 400, 32);
    barBg.lineStyle(3, 0xFFD700, 0.9);
    barBg.strokeRect(width / 2 - 200, height / 2 + 10, 400, 32);

    const progressBar = this.add.graphics();
    let progress = 0;
    this.time.addEvent({
      delay: 40,
      callback: () => {
        progress += 4;
        if (progress >= 100) progress = 100;
        progressBar.clear();
        progressBar.fillStyle(0x2a1a5e, 0.8);
        progressBar.fillRect(width / 2 - 195, height / 2 + 15, 390, 22);
        progressBar.fillStyle(0xFFD700, 1);
        progressBar.fillRect(width / 2 - 195, height / 2 + 15, 390 * progress / 100, 22);
      },
      loop: true,
    });

    const tip = this.add.text(width / 2, height / 2 + 70, '正在加载游戏资源...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      color: '#FFD700',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: tip,
      alpha: 0.5,
      duration: 1200,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
  }

  generateAllTextures() {
    // 草地瓦片
    const grass = this.add.graphics();
    grass.fillStyle(0x7EC850).fillRect(0, 0, 32, 32);
    grass.fillStyle(0x8FD14F).fillRect(4, 4, 3, 3);
    grass.fillStyle(0x6BB045).fillRect(20, 12, 3, 3);
    grass.fillStyle(0x9AD956).fillRect(10, 22, 3, 3);
    grass.generateTexture('grass', 32, 32);
    grass.destroy();

    // 沙地
    const sand = this.add.graphics();
    sand.fillStyle(0xE8D498).fillRect(0, 0, 32, 32);
    sand.fillStyle(0xD4C088).fillRect(6, 8, 4, 3);
    sand.fillStyle(0xF0DCB0).fillRect(14, 14, 3, 3);
    sand.generateTexture('sand', 32, 32);
    sand.destroy();

    // 水域
    const water = this.add.graphics();
    water.fillStyle(0x4682B4).fillRect(0, 0, 32, 32);
    water.fillStyle(0x87CEEB).fillRect(4, 10, 10, 2);
    water.fillStyle(0x87CEEB).fillRect(18, 20, 10, 2);
    water.generateTexture('water', 32, 32);
    water.destroy();

    // ==== 角色纹理 ====
    // 女孩 - 向下
    this.generateCharSprite('girl', 'down', 0xFFB6C1, 0xFF69B4);
    // 女孩 - 向上
    this.generateCharSprite('girl', 'up', 0xFFB6C1, 0xFF69B4);
    // 女孩 - 左/右 用走路帧
    this.generateCharWalk('girl', 0xFFB6C1, 0xFF69B4);

    // 男孩 - 向下
    this.generateCharSprite('boy', 'down', 0x6BA3D6, 0x4A6FA5);
    // 男孩 - 向上
    this.generateCharSprite('boy', 'up', 0x6BA3D6, 0x4A6FA5);
    // 男孩 - 走路
    this.generateCharWalk('boy', 0x6BA3D6, 0x4A6FA5);

    // 树 - 大
    const tree = this.add.graphics();
    tree.fillStyle(0x000000, 0.2).fillEllipse(32, 70, 46, 10);
    tree.fillStyle(0x5C3317).fillRect(24, 40, 16, 28);
    tree.fillStyle(0x8B4513).fillRect(26, 40, 12, 28);
    tree.fillStyle(0x228B22).fillRect(8, 18, 48, 26);
    tree.fillStyle(0x32CD32).fillRect(12, 20, 40, 20);
    tree.fillStyle(0x7CFC00).fillRect(20, 22, 3, 3).fillRect(38, 26, 3, 3);
    tree.fillStyle(0x0a3d14).fillRect(6, 40, 10, 8).fillRect(48, 40, 10, 8);
    tree.generateTexture('tree-big', 64, 72);
    tree.destroy();

    // 樱花树
    const cherry = this.add.graphics();
    cherry.fillStyle(0x000000, 0.2).fillEllipse(32, 70, 46, 10);
    cherry.fillStyle(0x5C3317).fillRect(26, 40, 12, 28);
    cherry.fillStyle(0xFFB6C1).fillRect(6, 18, 52, 26);
    cherry.fillStyle(0xFFC0CB).fillRect(10, 20, 44, 20);
    cherry.fillStyle(0xFF69B4).fillRect(20, 22, 3, 3).fillRect(38, 24, 3, 3);
    cherry.fillStyle(0xFFFFFF).fillRect(24, 26, 2, 2).fillRect(40, 18, 2, 2);
    cherry.generateTexture('tree-cherry', 64, 72);
    cherry.destroy();

    // 大石头
    const rock = this.add.graphics();
    rock.fillStyle(0x000000, 0.2).fillEllipse(24, 38, 44, 8);
    rock.fillStyle(0x5a5a5a).fillRect(4, 6, 40, 28);
    rock.fillStyle(0x7a7a7a).fillRect(6, 6, 36, 18);
    rock.fillStyle(0x9a9a9a).fillRect(10, 8, 18, 6);
    rock.fillStyle(0x3a3a3a).fillRect(2, 32, 44, 4);
    rock.fillStyle(0x228B22).fillRect(6, 8, 4, 2);
    rock.generateTexture('rock-big', 48, 40);
    rock.destroy();

    // 花 - 粉
    const flowerPink = this.add.graphics();
    flowerPink.fillStyle(0x228B22).fillRect(10, 14, 4, 10);
    flowerPink.fillStyle(0xFF69B4).fillRect(6, 4, 12, 12);
    flowerPink.fillStyle(0xFFB6C1).fillRect(8, 6, 8, 8);
    flowerPink.fillStyle(0xFFFF99).fillRect(10, 8, 4, 4);
    flowerPink.generateTexture('flower-pink', 24, 24);
    flowerPink.destroy();

    // 花 - 黄
    const flowerYellow = this.add.graphics();
    flowerYellow.fillStyle(0x228B22).fillRect(10, 14, 4, 10);
    flowerYellow.fillStyle(0xFFD700).fillRect(6, 4, 12, 12);
    flowerYellow.fillStyle(0xFFEC80).fillRect(8, 6, 8, 8);
    flowerYellow.fillStyle(0xFF6347).fillRect(10, 8, 4, 4);
    flowerYellow.generateTexture('flower-yellow', 24, 24);
    flowerYellow.destroy();

    // 花 - 紫
    const flowerPurple = this.add.graphics();
    flowerPurple.fillStyle(0x228B22).fillRect(10, 14, 4, 10);
    flowerPurple.fillStyle(0x9370DB).fillRect(6, 4, 12, 12);
    flowerPurple.fillStyle(0xDDA0DD).fillRect(8, 6, 8, 8);
    flowerPurple.fillStyle(0xFFFFFF).fillRect(10, 8, 4, 4);
    flowerPurple.generateTexture('flower-purple', 24, 24);
    flowerPurple.destroy();

    // 蘑菇
    const mushroom = this.add.graphics();
    mushroom.fillStyle(0xF5DEB3).fillRect(8, 12, 8, 10);
    mushroom.fillStyle(0xFF4500).fillRect(2, 4, 20, 10);
    mushroom.fillStyle(0xFF6347).fillRect(4, 5, 16, 6);
    mushroom.fillStyle(0xFFFFFF).fillRect(6, 6, 3, 3);
    mushroom.generateTexture('mushroom', 24, 24);
    mushroom.destroy();

    // 房屋
    const house = this.add.graphics();
    house.fillStyle(0x000000, 0.25).fillEllipse(40, 78, 70, 12);
    // 屋顶
    house.fillStyle(0xC1444E).fillRect(8, 24, 64, 12);
    house.fillStyle(0x8B2500).fillRect(8, 34, 64, 2);
    // 屋顶三角
    for (let i = 0; i < 18; i++) {
      house.fillStyle(0x8B2500).fillRect(40 - i, 8 + i, 2 + i * 2, 2);
    }
    house.fillStyle(0xE8D498).fillRect(10, 36, 60, 36);
    house.fillStyle(0x5C3317).fillRect(32, 44, 16, 28);
    house.fillStyle(0x8B4513).fillRect(34, 46, 12, 24);
    house.fillStyle(0x4682B4).fillRect(14, 42, 12, 12);
    house.fillStyle(0x87CEEB).fillRect(15, 43, 10, 10);
    house.fillStyle(0x4682B4).fillRect(54, 42, 12, 12);
    house.fillStyle(0x87CEEB).fillRect(55, 43, 10, 10);
    house.fillStyle(0xFFD700).fillRect(42, 58, 2, 2);
    house.generateTexture('house-big', 80, 80);
    house.destroy();

    // NPC - 老人
    const npcOld = this.add.graphics();
    npcOld.fillStyle(0x000000, 0.2).fillEllipse(32, 54, 24, 6);
    npcOld.fillStyle(0xFFE4C4).fillRect(22, 18, 20, 18);
    npcOld.fillStyle(0x8B4513).fillRect(22, 14, 20, 8);
    npcOld.fillStyle(0x000000).fillRect(26, 26, 3, 3).fillRect(35, 26, 3, 3);
    npcOld.fillStyle(0x9370DB).fillRect(18, 36, 28, 18);
    npcOld.fillStyle(0x8B4513).fillRect(24, 54, 8, 6).fillRect(34, 54, 8, 6);
    npcOld.generateTexture('npc-oldman', 64, 60);
    npcOld.destroy();

    // NPC - 女孩
    const npcGirl = this.add.graphics();
    npcGirl.fillStyle(0x000000, 0.2).fillEllipse(32, 54, 24, 6);
    npcGirl.fillStyle(0xFFE4C4).fillRect(22, 18, 20, 18);
    npcGirl.fillStyle(0xFFD700).fillRect(20, 14, 24, 10);
    npcGirl.fillStyle(0x000000).fillRect(26, 26, 3, 3).fillRect(35, 26, 3, 3);
    npcGirl.fillStyle(0xFF69B4).fillRect(18, 36, 28, 18);
    npcGirl.fillStyle(0x4A6FA5).fillRect(24, 54, 8, 6).fillRect(34, 54, 8, 6);
    npcGirl.generateTexture('npc-girl', 64, 60);
    npcGirl.destroy();

    // 金币
    for (let f = 1; f <= 4; f++) {
      const g = this.add.graphics();
      if (f === 1) {
        g.fillStyle(0xFFD700).fillCircle(12, 12, 10);
        g.fillStyle(0xFFA500).fillCircle(12, 12, 6);
        g.fillStyle(0xFFFF99).fillRect(8, 8, 3, 3);
      } else if (f === 2) {
        g.fillStyle(0xFFD700).fillRect(6, 6, 12, 12);
        g.fillStyle(0xFFA500).fillRect(8, 8, 8, 8);
      } else if (f === 3) {
        g.fillStyle(0xB8860B).fillRect(10, 6, 4, 12);
      } else {
        g.fillStyle(0xFFD700).fillRect(4, 6, 16, 12);
        g.fillStyle(0xFFA500).fillRect(6, 8, 12, 8);
      }
      g.generateTexture(`coin-${f}`, 24, 24);
      g.destroy();
    }

    // 作物 - 种子
    const crop1 = this.add.graphics();
    crop1.fillStyle(0x8B7355).fillRect(0, 20, 32, 12);
    crop1.fillStyle(0x228B22).fillRect(15, 18, 2, 4);
    crop1.generateTexture('crop-seed', 32, 32);
    crop1.destroy();

    // 作物 - 发芽
    const crop2 = this.add.graphics();
    crop2.fillStyle(0x8B7355).fillRect(0, 20, 32, 12);
    crop2.fillStyle(0x228B22).fillRect(14, 12, 4, 10);
    crop2.fillStyle(0x90EE90).fillRect(10, 8, 12, 8);
    crop2.generateTexture('crop-sprout', 32, 32);
    crop2.destroy();

    // 作物 - 成长中
    const crop3 = this.add.graphics();
    crop3.fillStyle(0x8B7355).fillRect(0, 20, 32, 12);
    crop3.fillStyle(0x228B22).fillRect(13, 6, 6, 16);
    crop3.fillStyle(0x32CD32).fillRect(8, 4, 16, 12);
    crop3.fillStyle(0x7CFC00).fillRect(12, 6, 8, 6);
    crop3.generateTexture('crop-growing', 32, 32);
    crop3.destroy();

    // 作物 - 成熟
    const crop4 = this.add.graphics();
    crop4.fillStyle(0x8B7355).fillRect(0, 20, 32, 12);
    crop4.fillStyle(0x228B22).fillRect(13, 2, 6, 20);
    crop4.fillStyle(0x32CD32).fillRect(6, 2, 20, 14);
    crop4.fillStyle(0xFF4500).fillRect(6, 0, 6, 6).fillRect(20, 0, 6, 6).fillRect(13, 2, 6, 6);
    crop4.fillStyle(0xFF6347).fillRect(7, 1, 4, 4).fillRect(21, 1, 4, 4);
    crop4.generateTexture('crop-mature', 32, 32);
    crop4.destroy();

    // 栅栏
    const fence = this.add.graphics();
    fence.fillStyle(0x8B4513).fillRect(0, 8, 32, 4).fillRect(0, 20, 32, 4);
    fence.fillStyle(0xA0522D).fillRect(0, 8, 32, 1).fillRect(0, 20, 32, 1);
    fence.fillStyle(0x654321).fillRect(4, 4, 4, 28).fillRect(14, 4, 4, 28).fillRect(24, 4, 4, 28);
    fence.generateTexture('fence', 32, 32);
    fence.destroy();

    // 井
    const well = this.add.graphics();
    well.fillStyle(0x000000, 0.2).fillEllipse(32, 60, 50, 8);
    well.fillStyle(0x696969).fillRect(4, 36, 56, 20);
    well.fillStyle(0x808080).fillRect(6, 38, 52, 16);
    well.fillStyle(0x4A4A4A).fillRect(8, 42, 48, 10);
    well.fillStyle(0x4682B4).fillRect(10, 44, 44, 6);
    well.fillStyle(0x5C3317).fillRect(8, 12, 6, 28).fillRect(48, 12, 6, 28);
    well.fillStyle(0x8B4513).fillRect(10, 10, 44, 8);
    well.generateTexture('well', 64, 60);
    well.destroy();

    // 灯笼
    const lantern = this.add.graphics();
    lantern.fillStyle(0x5C3317).fillRect(14, 0, 4, 8);
    lantern.fillStyle(0xFFD700).fillRect(8, 8, 16, 16);
    lantern.fillStyle(0xFFA500).fillRect(10, 10, 12, 12);
    lantern.fillStyle(0xFFFF99).fillRect(12, 12, 4, 4);
    lantern.fillStyle(0x5C3317).fillRect(6, 8, 20, 2).fillRect(6, 22, 20, 2);
    lantern.fillStyle(0x5C3317).fillRect(14, 24, 4, 14);
    lantern.generateTexture('lantern', 32, 40);
    lantern.destroy();

    // 木箱
    const chest = this.add.graphics();
    chest.fillStyle(0x5C3317).fillRect(4, 12, 28, 20);
    chest.fillStyle(0x8B4513).fillRect(6, 14, 24, 16);
    chest.fillStyle(0xFFD700).fillRect(4, 12, 28, 3).fillRect(4, 28, 28, 4).fillRect(4, 12, 3, 20).fillRect(28, 12, 3, 20);
    chest.fillStyle(0xFFD700).fillRect(16, 18, 4, 8);
    chest.fillStyle(0x000000).fillRect(17, 20, 2, 3);
    chest.generateTexture('chest', 36, 36);
    chest.destroy();
  }

  // 生成角色站立图像
  generateCharSprite(charType: string, direction: string, colorA: number, colorB: number) {
    const g = this.add.graphics();
    g.fillStyle(0xFFE4C4).fillRect(22, 8, 20, 18); // 头
    // 头发
    g.fillStyle(colorA).fillRect(20, 4, 24, 10);
    g.fillStyle(colorB).fillRect(20, 10, 24, 4);
    // 脸颊高光
    g.fillStyle(colorA).fillRect(18, 14, 4, 6).fillRect(42, 14, 4, 6);

    // 眼睛/表情
    if (direction === 'down') {
      g.fillStyle(0x000000).fillRect(26, 18, 3, 3).fillRect(35, 18, 3, 3);
      g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1).fillRect(36, 18, 1, 1);
      g.fillStyle(colorA).fillRect(23, 22, 3, 2).fillRect(38, 22, 3, 2);
      g.fillStyle(0x8B4513).fillRect(30, 24, 4, 1);
    } else if (direction === 'up') {
      g.fillStyle(colorB).fillRect(22, 10, 20, 6);
    } else {
      g.fillStyle(0x000000).fillRect(26, 18, 3, 3);
      g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1);
    }

    // 身体
    g.fillStyle(colorB).fillRect(22, 26, 20, 4); // 脖子
    g.fillStyle(colorA).fillRect(18, 30, 28, 22); // 衣服主体
    g.fillStyle(colorB).fillRect(18, 48, 28, 4);  // 衣服下边
    g.fillStyle(0xFFFFFF).fillRect(28, 36, 8, 6); // 衣服图案
    g.fillStyle(colorB).fillRect(28, 38, 8, 2);

    // 手臂
    g.fillStyle(0xFFE4C4).fillRect(14, 32, 6, 14).fillRect(44, 32, 6, 14);
    g.fillStyle(colorA).fillRect(14, 32, 6, 4).fillRect(44, 32, 6, 4);

    // 腿
    g.fillStyle(0x4A4A4A).fillRect(22, 52, 8, 10).fillRect(34, 52, 8, 10);
    // 鞋
    g.fillStyle(colorB).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);

    // 阴影
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.35).fillEllipse(32, 66, 28, 6);

    // 合并
    const textureKey = `${charType}-${direction}`;
    const container = this.add.container(0, 0);
    container.add([shadow, g]);
    g.generateTexture(textureKey, 64, 72);
    g.destroy();
    shadow.destroy();
    container.destroy();
  }

  // 生成走路动画帧
  generateCharWalk(charType: string, colorA: number, colorB: number) {
    const frames = [
      { leg1Offset: 0, leg2Offset: 0, armOffset: 0 },
      { leg1Offset: 2, leg2Offset: -1, armOffset: -1 },
      { leg1Offset: 0, leg2Offset: 0, armOffset: 0 },
      { leg1Offset: -1, leg2Offset: 2, armOffset: 1 },
    ];

    for (let f = 0; f < frames.length; f++) {
      const g = this.add.graphics();
      g.fillStyle(0xFFE4C4).fillRect(22, 8, 20, 18);
      g.fillStyle(colorA).fillRect(20, 4, 24, 10);
      g.fillStyle(colorB).fillRect(20, 10, 24, 4);
      g.fillStyle(colorA).fillRect(18, 14, 4, 6).fillRect(42, 14, 4, 6);
      // 眼睛
      g.fillStyle(0x000000).fillRect(26, 18, 3, 3).fillRect(35, 18, 3, 3);
      g.fillStyle(0xFFFFFF).fillRect(27, 18, 1, 1).fillRect(36, 18, 1, 1);
      // 身体
      g.fillStyle(colorB).fillRect(22, 26, 20, 4);
      g.fillStyle(colorA).fillRect(18, 30, 28, 22);
      g.fillStyle(colorB).fillRect(18, 48, 28, 4);
      g.fillStyle(0xFFFFFF).fillRect(28, 36, 8, 6);
      g.fillStyle(colorB).fillRect(28, 38, 8, 2);
      // 手臂
      g.fillStyle(0xFFE4C4).fillRect(14, 32 + frames[f].armOffset, 6, 14).fillRect(44, 32 - frames[f].armOffset, 6, 14);
      g.fillStyle(colorA).fillRect(14, 32 + frames[f].armOffset, 6, 4).fillRect(44, 32 - frames[f].armOffset, 6, 4);
      // 腿
      g.fillStyle(0x4A4A4A).fillRect(22, 52 + frames[f].leg1Offset, 8, 10 - Math.abs(frames[f].leg1Offset)).fillRect(34, 52 + frames[f].leg2Offset, 8, 10 - Math.abs(frames[f].leg2Offset));
      g.fillStyle(colorB).fillRect(20, 60, 12, 4).fillRect(32, 60, 12, 4);

      const textureKey = `${charType}-walk${f + 1}`;
      g.generateTexture(textureKey, 64, 72);
      g.destroy();
    }
  }
}
