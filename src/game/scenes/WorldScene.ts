import Phaser from 'phaser';
import { createNoise2D } from 'simplex-noise';

export default class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private playerName!: Phaser.GameObjects.Text;
  private playerAura!: Phaser.GameObjects.Arc;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private noise2D!: ReturnType<typeof createNoise2D>;
  private entities: Phaser.GameObjects.GameObject[] = [];
  private playerSpeed: number = 220;
  private isMoving: boolean = false;
  private currentDirection: string = 'down';
  private animationTimer: number = 0;
  private animationFrame: number = 0;
  private cameraZoom: number = 1.4;
  private characterId: number = 1; // 1,2,3

  // 粒子系统（使用简单的漂浮 sprite）
  private dialogueActive: boolean = false;

  constructor() {
    super({ key: 'WorldScene' });
  }

  preload() {}

  create() {
    // 初始化噪声生成器
    this.noise2D = createNoise2D(() => 42);

    // 摄像机
    this.cameras.main.setBackgroundColor('#87CEEB');
    this.cameras.main.setZoom(this.cameraZoom);
    this.cameras.main.fadeIn(1200, 0, 0, 0);

    // 从 state 读取角色
    const gameStore = (window as any).__gameStore;
    if (gameStore && gameStore.characterId) {
      this.characterId = gameStore.characterId;
    }

    // 创建世界地面
    this.createWorldGround();

    // 创建玩家
    this.createPlayer();

    // 创建世界实体
    this.createWorldEntities();

    // 创建粒子系统
    this.createParticleSystems();

    // 摄像机跟随玩家（平滑）
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 键盘输入
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // 教程文字
    this.showTutorialText();

    // 定时显示对话气泡
    this.time.addEvent({
      delay: 8000,
      callback: () => this.showRandomDialogue(),
      loop: true,
    });
  }

  createWorldGround() {
    const size = 80; // tile 数量
    const tileSize = 32;
    const halfW = (size * tileSize) / 2;

    const ground = this.add.graphics();

    for (let ty = 0; ty < size; ty++) {
      for (let tx = 0; tx < size; tx++) {
        const wx = tx - size / 2;
        const wy = ty - size / 2;
        const elevation = this.noise2D(wx * 0.06, wy * 0.06);
        const feature = this.noise2D(wx * 0.15 + 100, wy * 0.15 + 100);
        const x = -halfW + tx * tileSize;
        const y = -halfW + ty * tileSize;

        // 中心村庄小路区域
        const distFromCenter = Math.sqrt(wx * wx + wy * wy);

        if (elevation < -0.2) {
          // 水域
          ground.fillStyle(0x4682B4).fillRect(x, y, tileSize, tileSize);
          ground.fillStyle(0x5B9BD5).fillRect(x, y, tileSize, 6);
          if ((tx + ty) % 3 === 0) {
            ground.fillStyle(0x87CEEB).fillRect(x + 6, y + 10, 10, 2);
          }
        } else if (elevation < -0.05) {
          // 沙滩
          ground.fillStyle(0xE8D498).fillRect(x, y, tileSize, tileSize);
          if ((tx * 7 + ty * 3) % 5 === 0) {
            ground.fillStyle(0xD4C088).fillRect(x + 4, y + 6, 3, 2);
          }
        } else {
          // 草地
          ground.fillStyle(0x7EC850).fillRect(x, y, tileSize, tileSize);
          const hash = (tx * 131 + ty * 53 + Math.floor(elevation * 100)) % 20;
          if (hash === 0) {
            ground.fillStyle(0x8FD14F).fillRect(x + 4, y + 4, 4, 4);
          } else if (hash === 1) {
            ground.fillStyle(0x6BB045).fillRect(x + 20, y + 8, 3, 3);
          } else if (hash === 2) {
            ground.fillStyle(0x9AD956).fillRect(x + 8, y + 20, 4, 2);
          } else if (hash === 3) {
            ground.fillStyle(0xA08550).fillRect(x + 20, y + 22, 5, 4);
            ground.fillStyle(0xC4A46B).fillRect(x + 21, y + 22, 3, 2);
          } else if (hash === 4) {
            ground.fillStyle(0xFFB6C1).fillRect(x + 12, y + 14, 2, 2);
          } else if (hash === 5) {
            ground.fillStyle(0xFFFF99).fillRect(x + 10, y + 6, 2, 2);
          } else if (hash === 6) {
            ground.fillStyle(0x87CEEB).fillRect(x + 18, y + 18, 2, 2);
          }
        }
      }
    }
    ground.setDepth(-100);

    // 在村庄中心区域添加小路
    const pathGfx = this.add.graphics();
    for (let py = -4; py <= 4; py++) {
      for (let px = -6; px <= 6; px++) {
        // 弯曲的小路
        const dist = Math.abs(py) + Math.abs(px * 0.6);
        if (dist < 5) {
          const x = px * tileSize;
          const y = py * tileSize;
          pathGfx.fillStyle(0xA9A9A9).fillRect(x, y, tileSize, tileSize);
          pathGfx.fillStyle(0x8B8682).fillRect(x, y + tileSize - 3, tileSize, 3);
          if ((Math.abs(px) + Math.abs(py)) % 3 === 0) {
            pathGfx.fillStyle(0xC0C0C0).fillRect(x + 6, y + 8, 8, 6);
          }
        }
      }
    }
    pathGfx.setDepth(-99);
  }

  createPlayer() {
    const heroKey = `hero${this.characterId}`;
    const startTexture = `${heroKey}-down`;

    this.player = this.add.sprite(0, 0, startTexture);
    this.player.setOrigin(0.5, 0.95);
    this.player.setScale(1.4); // 大玩家
    this.player.setDepth(500);

    // 玩家阴影
    this.playerShadow = this.add.ellipse(0, 30, 32, 10, 0x000000, 0.35);
    this.playerShadow.setOrigin(0.5, 0.5);
    this.playerShadow.setDepth(499);

    // 玩家光环（发光效果）
    this.playerAura = this.add.circle(0, 20, 38, 0xFFFFFF, 0.15);
    this.playerAura.setDepth(498);
    this.tweens.add({
      targets: this.playerAura,
      alpha: { from: 0.08, to: 0.22 },
      scale: { from: 0.95, to: 1.08 },
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    // 玩家名字
    const names = ['小樱', '小牧', '森林精灵'];
    this.playerName = this.add.text(0, -50, names[this.characterId - 1], {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 2, color: '#FFD700', blur: 4, fill: true },
    });
    this.playerName.setOrigin(0.5);
    this.playerName.setDepth(510);

    // 物理
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(false);
    body.setSize(32, 24);
    body.setOffset(0, 36);

    // 呼吸动画
    this.tweens.add({
      targets: this.player,
      scaleX: 1.42,
      duration: 1400,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
  }

  createWorldEntities() {
    const centerX = 0;
    const centerY = 0;

    // ==== 装饰物：树、樱花树、石头、花、蘑菇 ====
    for (let i = 0; i < 280; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 1100;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      if (Math.abs(x - centerX) < 120 && Math.abs(y - centerY) < 100) continue;

      const type = Math.random();

      if (type < 0.25) {
        const shadow = this.add.ellipse(x, y + 8, 36, 10, 0x000000, 0.25);
        shadow.setDepth(Math.floor(y) - 1);
        const tree = this.add.sprite(x, y, 'tree-big');
        tree.setOrigin(0.5, 1);
        tree.setScale(1 + Math.random() * 0.3);
        tree.setDepth(Math.floor(y));
        this.entities.push(tree, shadow);
      } else if (type < 0.35) {
        const shadow = this.add.ellipse(x, y + 8, 36, 10, 0x000000, 0.25);
        shadow.setDepth(Math.floor(y) - 1);
        const tree = this.add.sprite(x, y, 'tree-cherry');
        tree.setOrigin(0.5, 1);
        tree.setScale(1 + Math.random() * 0.3);
        tree.setDepth(Math.floor(y));
        // 樱花树摇摆
        this.tweens.add({
          targets: tree,
          angle: { from: -2, to: 2 },
          duration: 3000 + Math.random() * 1000,
          ease: 'Sine.easeInOut',
          repeat: -1,
          yoyo: true,
        });
        this.entities.push(tree, shadow);
      } else if (type < 0.5) {
        const shadow = this.add.ellipse(x, y + 5, 30, 8, 0x000000, 0.25);
        shadow.setDepth(Math.floor(y) - 1);
        const rock = this.add.sprite(x, y, 'rock-big');
        rock.setOrigin(0.5, 1);
        rock.setScale(0.8 + Math.random() * 0.5);
        rock.setDepth(Math.floor(y));
        this.entities.push(rock, shadow);
      } else if (type < 0.7) {
        const flowers = ['flower-pink', 'flower-yellow', 'flower-purple', 'flower-red', 'flower-blue'];
        const flower = this.add.sprite(x, y, flowers[Math.floor(Math.random() * flowers.length)]);
        flower.setOrigin(0.5, 1);
        flower.setScale(1 + Math.random() * 0.3);
        flower.setDepth(Math.floor(y));
        // 轻微摆动
        this.tweens.add({
          targets: flower,
          angle: { from: -3, to: 3 },
          duration: 2000 + Math.random() * 1500,
          ease: 'Sine.easeInOut',
          repeat: -1,
          yoyo: true,
        });
        this.entities.push(flower);
      } else if (type < 0.78) {
        const m = this.add.sprite(x, y, 'mushroom');
        m.setOrigin(0.5, 1);
        m.setScale(1 + Math.random() * 0.3);
        m.setDepth(Math.floor(y));
        this.entities.push(m);
      }
    }

    // ==== 村镇：多栋房屋 + NPC ====
    const villageStartX = centerX + 220;
    const villageStartY = centerY - 140;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const hx = villageStartX + i * 120;
        const hy = villageStartY + j * 120;

        const shadow = this.add.ellipse(hx, hy + 20, 60, 14, 0x000000, 0.25);
        shadow.setDepth(Math.floor(hy) - 1);

        const house = this.add.sprite(hx, hy, (i + j) % 2 === 0 ? 'house-big' : 'cottage');
        house.setOrigin(0.5, 1);
        house.setScale(1.3);
        house.setDepth(Math.floor(hy));
        this.entities.push(house, shadow);
      }
    }

    // 村镇名字标签
    const townLabel = this.add.text(villageStartX + 120, villageStartY - 180, '🏡 星光小镇', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#FFD700', blur: 8, fill: true },
    });
    townLabel.setOrigin(0.5);
    townLabel.setDepth(2000);
    townLabel.setScrollFactor(1);
    this.tweens.add({
      targets: townLabel,
      y: townLabel.y + 6,
      duration: 2200,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    // 井
    const well = this.add.sprite(villageStartX + 60, villageStartY + 260, 'well');
    well.setOrigin(0.5, 1);
    well.setScale(1.2);
    well.setDepth(Math.floor(villageStartY + 260));
    this.entities.push(well);

    // 灯笼
    const lanternPositions = [
      { x: villageStartX, y: villageStartY + 200 },
      { x: villageStartX + 240, y: villageStartY + 200 },
      { x: villageStartX + 120, y: villageStartY + 280 },
    ];
    lanternPositions.forEach((pos) => {
      const lantern = this.add.sprite(pos.x, pos.y, 'lantern');
      lantern.setOrigin(0.5, 1);
      lantern.setScale(1.2);
      lantern.setDepth(Math.floor(pos.y));
      // 发光效果
      const glow = this.add.circle(pos.x, pos.y - 14, 22, 0xFFD700, 0.15);
      glow.setDepth(Math.floor(pos.y) - 1);
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.1, to: 0.3 },
        scale: { from: 0.9, to: 1.15 },
        duration: 1800,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true,
      });
      this.entities.push(lantern, glow);
    });

    // ==== NPC ====
    const npcInfo = [
      { x: villageStartX + 60, y: villageStartY + 120, name: '老张', npc: 'npc-oldman', text: '今天天气真好！' },
      { x: villageStartX + 200, y: villageStartY + 40, name: '小花', npc: 'npc-girl', text: '欢迎来我们的小镇~' },
      { x: villageStartX + 140, y: villageStartY + 260, name: '牧羊人', npc: 'npc-oldman', text: '要来点新鲜蔬菜吗？' },
    ];

    npcInfo.forEach((info) => {
      const shadow = this.add.ellipse(info.x, info.y + 8, 28, 8, 0x000000, 0.25);
      shadow.setDepth(Math.floor(info.y) - 1);

      const npc = this.add.sprite(info.x, info.y, info.npc);
      npc.setOrigin(0.5, 1);
      npc.setScale(1.1);
      npc.setDepth(Math.floor(info.y));

      const nameTag = this.add.text(info.x, info.y - 36, info.name, {
        fontFamily: '"Press Start 2P"',
        fontSize: '9px',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 3,
      });
      nameTag.setOrigin(0.5);
      nameTag.setDepth(Math.floor(info.y) + 2);

      const hint = this.add.text(info.x, info.y - 60, '💬', {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
      });
      hint.setOrigin(0.5);
      hint.setDepth(Math.floor(info.y) + 3);
      this.tweens.add({
        targets: hint,
        y: info.y - 68,
        duration: 1200,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true,
      });

      this.tweens.add({
        targets: npc,
        angle: { from: -1, to: 1 },
        duration: 2500,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true,
      });

      this.entities.push(shadow, npc, nameTag, hint);
    });

    // ==== 农场：作物田 ====
    const farmStartX = centerX - 200;
    const farmStartY = centerY + 100;

    const farmLabel = this.add.text(farmStartX, farmStartY - 120, '🌾 新手农场', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#90EE90',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#90EE90', blur: 8, fill: true },
    });
    farmLabel.setOrigin(0.5);
    farmLabel.setDepth(2000);
    this.tweens.add({
      targets: farmLabel,
      y: farmLabel.y + 6,
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    const cropTypes = ['crop-seed', 'crop-sprout', 'crop-growing', 'crop-mature'];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        const cx = farmStartX + (i - 2) * 56;
        const cy = farmStartY + (j - 2) * 56;

        const bg = this.add.graphics();
        bg.fillStyle(0x8B7355).fillRect(cx - 24, cy - 44, 48, 44);
        bg.fillStyle(0x6B5344).fillRect(cx - 24, cy - 44, 48, 4).fillRect(cx - 24, cy - 4, 48, 4);
        bg.fillStyle(0xA08550).fillRect(cx - 22, cy - 42, 4, 36).fillRect(cx + 18, cy - 42, 4, 36);
        bg.setDepth(Math.floor(cy) - 2);
        this.entities.push(bg);

        const stage = (i + j) % 4;
        const crop = this.add.sprite(cx, cy, cropTypes[stage]);
        crop.setOrigin(0.5, 1);
        crop.setScale(1.2);
        crop.setDepth(Math.floor(cy));
        this.entities.push(crop);
      }
    }

    // 农场围栏
    for (let i = -3; i <= 3; i++) {
      const fx = farmStartX + i * 32;
      const fy = farmStartY - 180;
      const fence = this.add.sprite(fx, fy, 'fence');
      fence.setOrigin(0.5, 1);
      fence.setScale(1);
      fence.setDepth(Math.floor(fy));
      this.entities.push(fence);
    }

    // 箱子
    const chest = this.add.sprite(farmStartX + 100, farmStartY + 50, 'chest');
    chest.setOrigin(0.5, 1);
    chest.setScale(1.3);
    chest.setDepth(Math.floor(farmStartY + 50));
    this.entities.push(chest);

    // ==== 金币散落 ====
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 1200;
      const y = (Math.random() - 0.5) * 1200;
      if (Math.abs(x) < 80 && Math.abs(y) < 80) continue;

      const coin = this.add.sprite(x, y, 'coin-0');
      coin.setOrigin(0.5, 1);
      coin.setScale(1.2);
      coin.setDepth(Math.floor(y));

      // 金币旋转动画
      this.tweens.add({
        targets: coin,
        y: y - 4,
        duration: 800 + Math.random() * 400,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true,
      });

      // 帧动画
      let frameIdx = 0;
      this.time.addEvent({
        delay: 200,
        callback: () => {
          frameIdx = (frameIdx + 1) % 4;
          coin.setTexture(`coin-${frameIdx}`);
        },
        loop: true,
      });

      this.entities.push(coin);
    }

    // ==== 指引牌（起始位置附近） ====
    const welcomeSign = this.add.text(0, -120, '🌟 开始你的冒险！', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 2, color: '#FFD700', blur: 8, fill: true },
    });
    welcomeSign.setOrigin(0.5);
    welcomeSign.setDepth(2000);
    this.tweens.add({
      targets: welcomeSign,
      y: -128,
      alpha: { from: 1, to: 0.6 },
      duration: 1800,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
    this.entities.push(welcomeSign);
  }

  createParticleSystems() {
    // 简单的漂浮装饰元素：用普通 sprite 创建漂浮动画
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 1500;
      const y = (Math.random() - 0.5) * 1000;
      const colors = ['flower-pink', 'flower-yellow', 'flower-purple', 'flower-red', 'flower-blue'];
      const texKey = colors[Math.floor(Math.random() * colors.length)];
      const sprite = this.add.sprite(x, y, texKey);
      sprite.setScale(0.6 + Math.random() * 0.4);
      sprite.setAlpha(0.5 + Math.random() * 0.3);
      sprite.setDepth(900 + i);
      this.tweens.add({
        targets: sprite,
        y: y - 30,
        x: x + 20,
        angle: 360,
        duration: 4000 + Math.random() * 3000,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }

  showTutorialText() {
    // 左上角操作提示
    const hint = this.add.text(this.cameras.main.width / 2, 60, '使用 WASD / 方向键 移动', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 2, color: '#000000', blur: 6, fill: true },
    });
    hint.setOrigin(0.5);
    hint.setScrollFactor(0);
    hint.setDepth(3000);

    this.tweens.add({
      targets: hint,
      alpha: 0,
      duration: 2000,
      delay: 5000,
      onComplete: () => hint.destroy(),
    });
  }

  showRandomDialogue() {
    const messages = [
      '🌸 今天的花开得好美啊~',
      '☀️ 阳光明媚，适合冒险！',
      '🌾 农场里的作物正在成长',
      '🏡 小镇的居民都很友好',
      '✨ 来探索这片神奇的世界吧！',
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];

    const bubble = this.add.text(this.player.x, this.player.y - 120, msg, {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#FFFFFF',
      backgroundColor: 'rgba(42, 27, 61, 0.95)',
      stroke: '#FFD700',
      strokeThickness: 2,
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
    });
    bubble.setOrigin(0.5);
    bubble.setDepth(3000);
    bubble.setAlpha(0);

    this.tweens.add({
      targets: bubble,
      alpha: 1,
      y: bubble.y - 10,
      duration: 500,
      ease: 'Cubic.Out',
      onComplete: () => {
        this.time.delayedCall(3500, () => {
          this.tweens.add({
            targets: bubble,
            alpha: 0,
            y: bubble.y - 20,
            duration: 500,
            ease: 'Cubic.In',
            onComplete: () => bubble.destroy(),
          });
        });
      },
    });
  }

  update(time: number, delta: number) {
    this.handleMovement(delta);
    this.updatePlayerAnimation(delta);

    // 更新玩家阴影/光环位置
    this.playerShadow.x = this.player.x;
    this.playerShadow.y = this.player.y + 28;
    this.playerShadow.setDepth(Math.floor(this.player.y) - 1);

    this.playerAura.x = this.player.x;
    this.playerAura.y = this.player.y + 20;
    this.playerAura.setDepth(Math.floor(this.player.y) - 2);

    // 更新玩家名字位置
    this.playerName.x = this.player.x;
    this.playerName.y = this.player.y - 70;
    this.playerName.setDepth(Math.floor(this.player.y) + 100);

    // 玩家深度
    this.player.setDepth(Math.floor(this.player.y) + 50);
  }

  handleMovement(delta: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    let moveX = 0;
    let moveY = 0;
    let newDirection = this.currentDirection;

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      moveX = -1;
      newDirection = 'left';
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      moveX = 1;
      newDirection = 'right';
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      moveY = -1;
      newDirection = 'up';
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      moveY = 1;
      newDirection = 'down';
    }

    if (moveX !== 0 && moveY !== 0) {
      const factor = 0.707;
      moveX *= factor;
      moveY *= factor;
    }

    if (moveX !== 0 || moveY !== 0) {
      body.setVelocity(moveX * this.playerSpeed, moveY * this.playerSpeed);
      this.isMoving = true;
      this.currentDirection = newDirection;
    } else {
      this.isMoving = false;
    }

    const heroKey = `hero${this.characterId}`;
    if (!this.isMoving) {
      const textureName = `${heroKey}-${this.currentDirection}`;
      if (this.player.texture.key !== textureName) {
        this.player.setTexture(textureName);
      }
      this.player.setFlipX(false);
    }
  }

  updatePlayerAnimation(delta: number) {
    const heroKey = `hero${this.characterId}`;
    if (this.isMoving) {
      this.animationTimer += delta;
      if (this.animationTimer > 140) {
        this.animationTimer = 0;
        this.animationFrame = (this.animationFrame + 1) % 4;
        const textureName = `${heroKey}-walk${this.animationFrame + 1}`;
        this.player.setTexture(textureName);

        if (this.currentDirection === 'left') {
          this.player.setFlipX(true);
        } else if (this.currentDirection === 'right') {
          this.player.setFlipX(true);
        } else {
          this.player.setFlipX(false);
        }
      }
    }
  }
}
