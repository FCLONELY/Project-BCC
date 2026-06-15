import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.createLoadingBar();
    this.loadAssets();
  }

  createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 加载标题
    const title = this.add.text(width / 2, height / 2 - 50, '田园大世界', {
      fontFamily: '"Press Start 2P"',
      fontSize: '32px',
      color: '#7EC850',
      stroke: '#5B9A30',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // 加载条背景
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0xC4A46B, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);

    // 加载条边框
    progressBox.lineStyle(4, 0xD2691E);
    progressBox.strokeRect(width / 2 - 160, height / 2, 320, 30);

    // 加载文本
    const loadingText = this.add.text(width / 2, height / 2 + 50, '正在加载...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      color: '#D2691E',
    }).setOrigin(0.5);

    // 更新加载条
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x7EC850, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 10);
    });

    this.load.on('complete', () => {
      loadingText.setText('加载完成！');
      this.time.delayedCall(500, () => {
        this.scene.start('WorldScene');
      });
    });
  }

  loadAssets() {
    // 创建基础像素纹理
    this.createPixelTextures();
  }

  createPixelTextures() {
    // 草地纹理
    const grassGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    grassGraphics.fillStyle(0x7EC850);
    grassGraphics.fillRect(0, 0, 16, 16);
    grassGraphics.fillStyle(0x8FD14F);
    grassGraphics.fillRect(4, 4, 2, 2);
    grassGraphics.fillRect(10, 8, 2, 2);
    grassGraphics.fillRect(6, 12, 2, 2);
    grassGraphics.generateTexture('grass', 16, 16);
    grassGraphics.destroy();

    // 泥土纹理
    const dirtGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    dirtGraphics.fillStyle(0xC4A46B);
    dirtGraphics.fillRect(0, 0, 16, 16);
    dirtGraphics.fillStyle(0xA08550);
    dirtGraphics.fillRect(4, 4, 2, 2);
    dirtGraphics.fillRect(10, 10, 2, 2);
    dirtGraphics.generateTexture('dirt', 16, 16);
    dirtGraphics.destroy();

    // 耕地纹理
    const farmlandGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    farmlandGraphics.fillStyle(0x8B7355);
    farmlandGraphics.fillRect(0, 0, 16, 16);
    farmlandGraphics.fillStyle(0x6B5344);
    for (let i = 0; i < 4; i++) {
      farmlandGraphics.fillRect(i * 4, 0, 2, 16);
    }
    farmlandGraphics.generateTexture('farmland', 16, 16);
    farmlandGraphics.destroy();

    // 水纹理
    const waterGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    waterGraphics.fillStyle(0x5B9BD5);
    waterGraphics.fillRect(0, 0, 16, 16);
    waterGraphics.fillStyle(0x87CEEB);
    waterGraphics.fillRect(4, 4, 4, 2);
    waterGraphics.fillRect(10, 10, 4, 2);
    waterGraphics.generateTexture('water', 16, 16);
    waterGraphics.destroy();

    // 树纹理
    const treeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    // 树干
    treeGraphics.fillStyle(0x8B4513);
    treeGraphics.fillRect(6, 10, 4, 6);
    // 树叶
    treeGraphics.fillStyle(0x228B22);
    treeGraphics.fillRect(4, 2, 8, 8);
    treeGraphics.fillStyle(0x32CD32);
    treeGraphics.fillRect(6, 4, 4, 4);
    treeGraphics.generateTexture('tree', 16, 16);
    treeGraphics.destroy();

    // 玩家纹理（简单像素人物）
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    // 身体
    playerGraphics.fillStyle(0x5B9BD5);
    playerGraphics.fillRect(4, 8, 8, 6);
    // 头
    playerGraphics.fillStyle(0xFFE4C4);
    playerGraphics.fillRect(5, 2, 6, 6);
    // 眼睛
    playerGraphics.fillStyle(0x000000);
    playerGraphics.fillRect(6, 4, 1, 1);
    playerGraphics.fillRect(9, 4, 1, 1);
    // 腿
    playerGraphics.fillStyle(0x4169E1);
    playerGraphics.fillRect(5, 14, 2, 2);
    playerGraphics.fillRect(9, 14, 2, 2);
    playerGraphics.generateTexture('player', 16, 16);
    playerGraphics.destroy();

    // 种子纹理
    const seedGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    seedGraphics.fillStyle(0x8B4513);
    seedGraphics.fillCircle(8, 8, 4);
    seedGraphics.fillStyle(0xA0522D);
    seedGraphics.fillCircle(6, 6, 2);
    seedGraphics.generateTexture('seed', 8, 8);
    seedGraphics.destroy();

    // 作物生长阶段纹理
    const cropStages = [
      { name: 'sprout', color: 0x90EE90, y: 12 },
      { name: 'growing', color: 0x32CD32, y: 10 },
      { name: 'mature', color: 0x228B22, y: 8 },
    ];

    cropStages.forEach((stage) => {
      const cropGraphics = this.make.graphics({ x: 0, y: 0, add: false });
      cropGraphics.fillStyle(stage.color);
      cropGraphics.fillRect(6, stage.y, 4, 16 - stage.y);
      cropGraphics.fillStyle(0x228B22);
      cropGraphics.fillCircle(8, stage.y, 3);
      cropGraphics.generateTexture(stage.name, 16, 16);
      cropGraphics.destroy();
    });

    // UI 元素
    // 心形
    const heartGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    heartGraphics.fillStyle(0xFF6B6B);
    heartGraphics.fillCircle(4, 6, 4);
    heartGraphics.fillCircle(12, 6, 4);
    heartGraphics.fillTriangle(0, 6, 16, 6, 8, 16);
    heartGraphics.generateTexture('heart', 16, 16);
    heartGraphics.destroy();

    // 金币
    const coinGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    coinGraphics.fillStyle(0xFFD700);
    coinGraphics.fillCircle(8, 8, 7);
    coinGraphics.fillStyle(0xFFA500);
    coinGraphics.fillCircle(8, 8, 5);
    coinGraphics.generateTexture('coin', 16, 16);
    coinGraphics.destroy();
  }

  update() {
    // 初始化逻辑
  }
}
