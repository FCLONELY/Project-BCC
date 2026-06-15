import Phaser from 'phaser';
import { createNoise2D } from 'simplex-noise';

export default class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private noise2D!: ReturnType<typeof createNoise2D>;
  private chunks: Map<string, Phaser.GameObjects.TileSprite> = new Map();
  private worldSeed: number = Date.now();
  private chunkSize: number = 16;
  private tileSize: number = 16;
  private viewDistance: number = 3;
  private lastPlayerChunkX: number = 0;
  private lastPlayerChunkY: number = 0;
  private isInitialized: boolean = false;

  constructor() {
    super({ key: 'WorldScene' });
  }

  create() {
    // 初始化噪声生成器
    this.noise2D = createNoise2D(() => {
      // 简单的伪随机数生成器
      let seed = this.worldSeed;
      return () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
    });

    // 创建玩家
    this.createPlayer();

    // 设置摄像机
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2); // 像素风格需要近缩放
    this.cameras.main.setBackgroundColor('#87CEEB'); // 天空蓝背景

    // 设置键盘输入
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // 初始加载区块
    this.updateChunks();
    this.isInitialized = true;

    // 显示提示
    this.showControls();
  }

  createPlayer() {
    this.player = this.add.sprite(0, 0, 'player');
    this.player.setOrigin(0.5, 0.5);
    this.player.setDepth(10);
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
  }

  showControls() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const helpText = this.add.text(width / 2, 30, 'WASD 或 方向键 移动', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.tweens.add({
      targets: helpText,
      alpha: 0,
      duration: 3000,
      delay: 2000,
      onComplete: () => {
        helpText.destroy();
      },
    });
  }

  update() {
    if (!this.isInitialized) return;

    this.handleMovement();
    this.updateChunks();
  }

  handleMovement() {
    const speed = 160;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    // 处理移动输入
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      body.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      body.setVelocityX(speed);
      this.player.setFlipX(false);
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      body.setVelocityY(speed);
    }

    // 标准化斜向移动速度
    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.velocity.x *= 0.707;
      body.velocity.y *= 0.707;
    }
  }

  updateChunks() {
    const playerChunkX = Math.floor(this.player.x / (this.chunkSize * this.tileSize));
    const playerChunkY = Math.floor(this.player.y / (this.chunkSize * this.tileSize));

    // 只在区块改变时更新
    if (playerChunkX === this.lastPlayerChunkX && playerChunkY === this.lastPlayerChunkY) {
      return;
    }

    this.lastPlayerChunkX = playerChunkX;
    this.lastPlayerChunkY = playerChunkY;

    // 卸载远处的区块
    const chunksToRemove: string[] = [];
    this.chunks.forEach((chunk, key) => {
      const [cx, cy] = key.split(',').map(Number);
      if (Math.abs(cx - playerChunkX) > this.viewDistance || Math.abs(cy - playerChunkY) > this.viewDistance) {
        chunk.destroy();
        chunksToRemove.push(key);
      }
    });

    chunksToRemove.forEach((key) => this.chunks.delete(key));

    // 加载新区块
    for (let dx = -this.viewDistance; dx <= this.viewDistance; dx++) {
      for (let dy = -this.viewDistance; dy <= this.viewDistance; dy++) {
        const cx = playerChunkX + dx;
        const cy = playerChunkY + dy;
        const key = `${cx},${cy}`;

        if (!this.chunks.has(key)) {
          this.generateChunk(cx, cy);
        }
      }
    }
  }

  generateChunk(chunkX: number, chunkY: number) {
    const key = `${chunkX},${chunkY}`;
    const worldX = chunkX * this.chunkSize * this.tileSize;
    const worldY = chunkY * this.chunkSize * this.tileSize;

    // 为区块创建tilemap
    const chunkGraphics = this.add.graphics();

    // 绘制区块内容
    for (let tx = 0; tx < this.chunkSize; tx++) {
      for (let ty = 0; ty < this.chunkSize; ty++) {
        const worldTileX = chunkX * this.chunkSize + tx;
        const worldTileY = chunkY * this.chunkSize + ty;

        const tileType = this.getTileType(worldTileX, worldTileY);
        const screenX = worldX + tx * this.tileSize;
        const screenY = worldY + ty * this.tileSize;

        this.drawTile(chunkGraphics, screenX, screenY, tileType);
      }
    }

    // 将graphics转换为tileSprite以提高性能
    chunkGraphics.setDepth(0);

    this.chunks.set(key, chunkGraphics as any);
  }

  getTileType(x: number, y: number): string {
    // 使用多层噪声生成地形
    const elevation = this.noise2D(x * 0.02, y * 0.02);
    const moisture = this.noise2D(x * 0.03 + 100, y * 0.03 + 100);
    const detail = this.noise2D(x * 0.1, y * 0.1);

    // 根据高度和湿度确定地形类型
    if (elevation < -0.3) {
      return 'water';
    } else if (elevation < -0.1) {
      return 'sand';
    } else if (elevation > 0.5 && detail > 0) {
      // 高地区域有树
      if (Math.random() < 0.1) {
        return 'tree';
      }
      return 'grass';
    } else if (moisture > 0.3 && Math.random() < 0.05) {
      // 湿润区域有树
      return 'tree';
    }

    return 'grass';
  }

  drawTile(graphics: Phaser.GameObjects.Graphics, x: number, y: number, type: string) {
    const size = this.tileSize;

    switch (type) {
      case 'water':
        graphics.fillStyle(0x5B9BD5);
        graphics.fillRect(x, y, size, size);
        // 水波纹效果
        if (Math.random() < 0.1) {
          graphics.fillStyle(0x87CEEB);
          graphics.fillRect(x + 4, y + 4, 8, 2);
        }
        break;

      case 'sand':
        graphics.fillStyle(0xF4D03F);
        graphics.fillRect(x, y, size, size);
        graphics.fillStyle(0xF5B041);
        graphics.fillRect(x + 4, y + 6, 2, 2);
        graphics.fillRect(x + 10, y + 10, 2, 2);
        break;

      case 'tree':
        // 先画草地
        graphics.fillStyle(0x7EC850);
        graphics.fillRect(x, y, size, size);
        // 树干
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(x + 6, y + 10, 4, 6);
        // 树叶
        graphics.fillStyle(0x228B22);
        graphics.fillRect(x + 4, y + 2, 8, 8);
        graphics.fillStyle(0x32CD32);
        graphics.fillRect(x + 6, y + 4, 4, 4);
        break;

      case 'grass':
      default:
        graphics.fillStyle(0x7EC850);
        graphics.fillRect(x, y, size, size);
        // 草地细节
        graphics.fillStyle(0x8FD14F);
        graphics.fillRect(x + 4, y + 4, 2, 2);
        graphics.fillRect(x + 10, y + 8, 2, 2);
        graphics.fillRect(x + 6, y + 12, 2, 2);
        break;
    }
  }
}
