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
  private noise2D2!: ReturnType<typeof createNoise2D>;
  private noise2D3!: ReturnType<typeof createNoise2D>;
  private playerSpeed: number = 220;
  private isMoving: boolean = false;
  private currentDirection: string = 'down';
  private animationTimer: number = 0;
  private animationFrame: number = 0;
  private characterKey: string = 'girl'; // 'girl' | 'boy'
  private mapSize: number = 100;
  private tileSize: number = 32;

  constructor() {
    super({ key: 'WorldScene' });
  }

  create() {
    this.noise2D = createNoise2D(() => 42);
    this.noise2D2 = createNoise2D(() => 100);
    this.noise2D3 = createNoise2D(() => 200);

    this.cameras.main.setBackgroundColor('#87CEEB');
    this.cameras.main.setZoom(1.4);
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // 设置世界边界
    const worldSize = this.mapSize * this.tileSize;
    this.physics.world.setBounds(-worldSize/2, -worldSize/2, worldSize, worldSize);

    // 从全局状态读取角色选择
    const savedChar = (window as any).__gameStore?.characterId;
    if (savedChar === 2) {
      this.characterKey = 'boy';
    } else {
      this.characterKey = 'girl';
    }

    this.createWorldGround();
    this.createPlayer();
    this.createWorldEntities();
    this.createParticleEffects();
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  createWorldGround() {
    const size = this.mapSize;
    const tileSize = this.tileSize;
    const halfW = (size * tileSize) / 2;

    const ground = this.add.graphics();
    const water = this.add.graphics();
    const sand = this.add.graphics();
    const forest = this.add.graphics();
    const mountain = this.add.graphics();
    const cave = this.add.graphics();
    const flowerGfx = this.add.graphics();

    for (let ty = 0; ty < size; ty++) {
      for (let tx = 0; tx < size; tx++) {
        const wx = tx - size / 2;
        const wy = ty - size / 2;
        
        // 使用多层噪声创建丰富地形
        const elevation = this.noise2D(wx * 0.05, wy * 0.05);
        const moisture = this.noise2D2(wx * 0.08, wy * 0.08);
        const detail = this.noise2D3(wx * 0.15, wy * 0.15);
        
        const x = -halfW + tx * tileSize;
        const y = -halfW + ty * tileSize;

        // 根据噪声值决定地形类型
        if (elevation < -0.3) {
          // 深海
          water.fillStyle(0x1E4D8C).fillRect(x, y, tileSize, tileSize);
          water.fillStyle(0x2E6AB3).fillRect(x + 6, y + 8, 8, 2);
          water.fillStyle(0x4A90D9).fillRect(x + 20, y + 16, 6, 1);
        } else if (elevation < -0.15) {
          // 浅海/湖泊
          water.fillStyle(0x4682B4).fillRect(x, y, tileSize, tileSize);
          water.fillStyle(0x6BA3D6).fillRect(x + 4, y + 10, 10, 2);
          water.fillStyle(0x87CEEB).fillRect(x + 18, y + 20, 8, 1);
        } else if (elevation < -0.05) {
          // 沙滩
          sand.fillStyle(0xF5DEB3).fillRect(x, y, tileSize, tileSize);
          sand.fillStyle(0xE8D498).fillRect(x + 4, y + 4, 3, 2);
          if ((tx * 5 + ty * 7) % 6 === 0) {
            sand.fillStyle(0xD4C088).fillRect(x + 12, y + 16, 4, 2);
          }
        } else if (elevation > 0.45) {
          // 山脉/岩石
          mountain.fillStyle(0x5a5a5a).fillRect(x, y, tileSize, tileSize);
          mountain.fillStyle(0x7a7a7a).fillRect(x + 4, y + 4, 6, 6);
          mountain.fillStyle(0x9a9a9a).fillRect(x + 18, y + 20, 4, 4);
          mountain.fillStyle(0x4a4a4a).fillRect(x + 24, y + 8, 4, 8);
        } else if (elevation > 0.35) {
          // 山地草地
          mountain.fillStyle(0x5B7B4F).fillRect(x, y, tileSize, tileSize);
          mountain.fillStyle(0x6B8B5F).fillRect(x + 6, y + 6, 4, 4);
          mountain.fillStyle(0x4B6B3F).fillRect(x + 20, y + 18, 6, 6);
        } else if (moisture > 0.35) {
          // 森林区域
          forest.fillStyle(0x228B22).fillRect(x, y, tileSize, tileSize);
          forest.fillStyle(0x32CD32).fillRect(x + 6, y + 6, 4, 4);
          forest.fillStyle(0x2E8B2E).fillRect(x + 20, y + 16, 4, 4);
        } else if (moisture < -0.25) {
          // 荒地/沙漠边缘
          ground.fillStyle(0xCD853F).fillRect(x, y, tileSize, tileSize);
          ground.fillStyle(0xBC7A2F).fillRect(x + 8, y + 8, 6, 6);
        } else {
          // 普通草地
          ground.fillStyle(0x7EC850).fillRect(x, y, tileSize, tileSize);
          const hash = (tx * 131 + ty * 53 + Math.floor(detail * 100)) % 25;
          if (hash === 0) ground.fillStyle(0x8FD14F).fillRect(x + 4, y + 4, 3, 3);
          else if (hash === 1) ground.fillStyle(0x6BB045).fillRect(x + 20, y + 8, 3, 3);
          else if (hash === 2) ground.fillStyle(0x9AD956).fillRect(x + 8, y + 20, 4, 2);
          else if (hash === 3) ground.fillStyle(0xFFFF99).fillRect(x + 10, y + 6, 2, 2);
          else if (hash === 4) ground.fillStyle(0xFFD700).fillRect(x + 18, y + 18, 2, 2);
        }

        // 添加小花装饰（只在草地上）
        if (elevation >= -0.05 && elevation <= 0.35 && moisture > -0.25) {
          const flowerChance = (tx * 7 + ty * 11 + Math.floor(moisture * 100)) % 35;
          if (flowerChance === 0) {
            flowerGfx.fillStyle(0xFF69B4).fillRect(x + 12, y + 14, 3, 3);
            flowerGfx.fillStyle(0xFFFF99).fillRect(x + 13, y + 15, 1, 1);
          } else if (flowerChance === 1) {
            flowerGfx.fillStyle(0xFFD700).fillRect(x + 20, y + 8, 3, 3);
            flowerGfx.fillStyle(0xFF6347).fillRect(x + 21, y + 9, 1, 1);
          } else if (flowerChance === 2) {
            flowerGfx.fillStyle(0x9370DB).fillRect(x + 6, y + 20, 3, 3);
            flowerGfx.fillStyle(0xFFFFFF).fillRect(x + 7, y + 21, 1, 1);
          }
        }
      }
    }

    // 中心村庄小路
    const pathGfx = this.add.graphics();
    for (let py = -5; py <= 5; py++) {
      for (let px = -8; px <= 8; px++) {
        if (Math.abs(py) + Math.abs(px * 0.5) < 6) {
          const x = px * tileSize;
          const y = py * tileSize;
          pathGfx.fillStyle(0xA9A9A9).fillRect(x, y, tileSize, tileSize);
          pathGfx.fillStyle(0x8B8682).fillRect(x, y + tileSize - 4, tileSize, 4);
          if ((Math.abs(px) + Math.abs(py)) % 3 === 0) {
            pathGfx.fillStyle(0xC0C0C0).fillRect(x + 6, y + 8, 8, 6);
          }
        }
      }
    }
  }

  createPlayer() {
    this.player = this.add.sprite(0, 0, `${this.characterKey}-down`);
    this.player.setOrigin(0.5, 0.95);
    this.player.setScale(1.4);
    this.player.setDepth(500);

    this.playerShadow = this.add.ellipse(0, 30, 32, 10, 0x000000, 0.35);
    this.playerShadow.setOrigin(0.5, 0.5);
    this.playerShadow.setDepth(499);

    this.playerAura = this.add.circle(0, 20, 38, 0xFFFFFF, 0.12);
    this.playerAura.setDepth(498);
    this.tweens.add({
      targets: this.playerAura,
      alpha: { from: 0.06, to: 0.18 },
      scale: { from: 0.95, to: 1.08 },
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    const nameText = this.characterKey === 'boy' ? '小牧' : '小樱';
    this.playerName = this.add.text(0, -60, nameText, {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 2, color: '#FFD700', blur: 4, fill: true },
    });
    this.playerName.setOrigin(0.5);
    this.playerName.setDepth(510);

    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(32, 24);
    body.setOffset(0, 36);

    this.tweens.add({
      targets: this.player,
      scaleX: 1.43,
      duration: 1400,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
  }

  createWorldEntities() {
    // 创建障碍物碰撞组
    const obstacles = this.physics.add.staticGroup();

    // 装饰物：树、樱花树、石头、花、蘑菇
    for (let i = 0; i < 350; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 1500;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      if (Math.abs(x) < 180 && Math.abs(y) < 150) continue;

      const type = Math.random();

      if (type < 0.22) {
        const shadow = this.add.ellipse(x, y + 8, 36, 10, 0x000000, 0.25);
        shadow.setDepth(Math.floor(y) - 1);
        const tree = this.add.sprite(x, y, 'tree-big');
        tree.setOrigin(0.5, 1);
        tree.setScale(1 + Math.random() * 0.3);
        tree.setDepth(Math.floor(y));
        
        // 添加碰撞体
        const obstacle = this.physics.add.staticSprite(x, y, '');
        obstacle.body.setSize(30, 40);
        obstacle.body.setOffset(-15, -40);
        obstacle.setVisible(false);
        obstacles.add(obstacle);
      } else if (type < 0.33) {
        const shadow = this.add.ellipse(x, y + 8, 36, 10, 0x000000, 0.25);
        shadow.setDepth(Math.floor(y) - 1);
        const tree = this.add.sprite(x, y, 'tree-cherry');
        tree.setOrigin(0.5, 1);
        tree.setScale(1 + Math.random() * 0.3);
        tree.setDepth(Math.floor(y));
        
        // 添加碰撞体
        const obstacle = this.physics.add.staticSprite(x, y, '');
        obstacle.body.setSize(30, 40);
        obstacle.body.setOffset(-15, -40);
        obstacle.setVisible(false);
        obstacles.add(obstacle);
        
        this.tweens.add({
          targets: tree,
          angle: { from: -2, to: 2 },
          duration: 3000 + Math.random() * 1000,
          ease: 'Sine.easeInOut',
          repeat: -1,
          yoyo: true,
        });
      } else if (type < 0.46) {
        const shadow = this.add.ellipse(x, y + 5, 28, 8, 0x000000, 0.25);
        shadow.setDepth(Math.floor(y) - 1);
        const rock = this.add.sprite(x, y, 'rock-big');
        rock.setOrigin(0.5, 1);
        rock.setScale(0.8 + Math.random() * 0.5);
        rock.setDepth(Math.floor(y));
        
        // 添加碰撞体
        const obstacle = this.physics.add.staticSprite(x, y, '');
        obstacle.body.setSize(24, 20);
        obstacle.body.setOffset(-12, -20);
        obstacle.setVisible(false);
        obstacles.add(obstacle);
      } else if (type < 0.7) {
        const flowers = ['flower-pink', 'flower-yellow', 'flower-purple', 'flower-red', 'flower-blue'];
        const flower = this.add.sprite(x, y, flowers[Math.floor(Math.random() * flowers.length)]);
        flower.setOrigin(0.5, 1);
        flower.setScale(1 + Math.random() * 0.3);
        flower.setDepth(Math.floor(y));
        this.tweens.add({
          targets: flower,
          angle: { from: -3, to: 3 },
          duration: 2000 + Math.random() * 1500,
          ease: 'Sine.easeInOut',
          repeat: -1,
          yoyo: true,
        });
      } else if (type < 0.77) {
        const m = this.add.sprite(x, y, 'mushroom');
        m.setOrigin(0.5, 1);
        m.setScale(1 + Math.random() * 0.2);
        m.setDepth(Math.floor(y));
        
        // 添加碰撞体（蘑菇较小）
        const obstacle = this.physics.add.staticSprite(x, y, '');
        obstacle.body.setSize(16, 16);
        obstacle.body.setOffset(-8, -16);
        obstacle.setVisible(false);
        obstacles.add(obstacle);
      }
    }

    // 设置玩家与障碍物的碰撞
    this.physics.add.collider(this.player, obstacles);

    // ==== 村镇建筑 ====
    const villageStartX = 240;
    const villageStartY = -180;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const hx = villageStartX + i * 120;
        const hy = villageStartY + j * 130;

        const shadow = this.add.ellipse(hx, hy + 20, 60, 14, 0x000000, 0.25);
        shadow.setDepth(Math.floor(hy) - 1);

        const house = this.add.sprite(hx, hy, (i + j) % 2 === 0 ? 'house-big' : 'cottage');
        house.setOrigin(0.5, 1);
        house.setScale(1.3);
        house.setDepth(Math.floor(hy));
        
        // 为房屋添加碰撞体
        const houseObstacle = this.physics.add.staticSprite(hx, hy, '');
        houseObstacle.body.setSize(50, 60);
        houseObstacle.body.setOffset(-25, -60);
        houseObstacle.setVisible(false);
        obstacles.add(houseObstacle);
      }
    }

    const townLabel = this.add.text(villageStartX + 120, villageStartY - 180, '🏡 NEXISLE Village', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#FFD700', blur: 8, fill: true },
    });
    townLabel.setOrigin(0.5);
    townLabel.setDepth(3000);
    this.tweens.add({
      targets: townLabel,
      y: townLabel.y + 6,
      duration: 2200,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    // 井
    const well = this.add.sprite(villageStartX + 60, villageStartY + 280, 'well');
    well.setOrigin(0.5, 1);
    well.setScale(1.2);
    well.setDepth(Math.floor(villageStartY + 280));

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
      const glow = this.add.circle(pos.x, pos.y - 14, 24, 0xFFD700, 0.18);
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
    });

    // ==== NPC ====
    const npcs = [
      { x: villageStartX + 60, y: villageStartY + 120, name: '老张', npc: 'npc-oldman', text: '今天天气真好！' },
      { x: villageStartX + 200, y: villageStartY + 40, name: '小花', npc: 'npc-girl', text: '欢迎来我们的小镇~' },
      { x: villageStartX + 140, y: villageStartY + 260, name: '牧羊人', npc: 'npc-oldman', text: '要来点新鲜蔬菜吗？' },
    ];
    npcs.forEach((info) => {
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
    });

    // ==== 农场 ====
    // 农场位于村庄西侧，包含整齐的田垄、水井和工具
    const farmStartX = -380;
    const farmStartY = 100;

    const farmLabel = this.add.text(farmStartX, farmStartY - 180, '🌾 NEXISLE 农场', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#90EE90',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#90EE90', blur: 8, fill: true },
    });
    farmLabel.setOrigin(0.5);
    farmLabel.setDepth(3000);
    this.tweens.add({
      targets: farmLabel,
      y: farmLabel.y + 6,
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    // 4 行 x 5 列的整齐田垄布局
    const cropTypes = ['crop-seed', 'crop-sprout', 'crop-growing', 'crop-mature'];
    const plotSize = 48;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        const cx = farmStartX + (i - 2) * plotSize;
        const cy = farmStartY + (j - 2) * plotSize;

        const bg = this.add.graphics();
        bg.fillStyle(0x8B7355).fillRect(cx - 22, cy - 40, 44, 40);
        bg.fillStyle(0x6B5344).fillRect(cx - 22, cy - 40, 44, 3).fillRect(cx - 22, cy - 4, 44, 3);
        bg.fillStyle(0xA08550).fillRect(cx - 20, cy - 38, 2, 34).fillRect(cx + 18, cy - 38, 2, 34);
        bg.setDepth(Math.floor(cy) - 2);

        const stage = (i + j) % 4;
        const crop = this.add.sprite(cx, cy, cropTypes[stage]);
        crop.setOrigin(0.5, 1);
        crop.setScale(1.1);
        crop.setDepth(Math.floor(cy));
      }
    }

    // 农场东侧的水井（灌溉水源）
    const farmWell = this.add.sprite(farmStartX + 160, farmStartY - 100, 'well');
    farmWell.setOrigin(0.5, 1);
    farmWell.setScale(1.3);
    farmWell.setDepth(Math.floor(farmStartY - 100));

    // 工具棚（小木屋）
    const toolShed = this.add.sprite(farmStartX - 160, farmStartY - 100, 'cottage');
    toolShed.setOrigin(0.5, 1);
    toolShed.setScale(1.2);
    toolShed.setDepth(Math.floor(farmStartY - 100));

    // 农场周围的栅栏
    const fencePositions: {x: number, y: number}[] = [];
    for (let i = -3; i <= 3; i++) {
      fencePositions.push({ x: farmStartX + i * 40, y: farmStartY - 150 });
      fencePositions.push({ x: farmStartX + i * 40, y: farmStartY + 150 });
    }
    fencePositions.push({ x: farmStartX - 160, y: farmStartY - 110 });
    fencePositions.push({ x: farmStartX + 160, y: farmStartY - 110 });
    fencePositions.push({ x: farmStartX - 160, y: farmStartY + 110 });
    fencePositions.push({ x: farmStartX + 160, y: farmStartY + 110 });
    fencePositions.forEach((pos) => {
      const fence = this.add.sprite(pos.x, pos.y, 'fence');
      fence.setOrigin(0.5, 1);
      fence.setScale(1);
      fence.setDepth(Math.floor(pos.y));
    });

    // 农场 NPC - 农夫
    const farmerShadow = this.add.ellipse(farmStartX + 100, farmStartY + 48, 28, 8, 0x000000, 0.25);
    farmerShadow.setDepth(Math.floor(farmStartY + 48) - 1);
    const farmer = this.add.sprite(farmStartX + 100, farmStartY + 40, 'npc-oldman');
    farmer.setOrigin(0.5, 1);
    farmer.setScale(1.15);
    farmer.setDepth(Math.floor(farmStartY + 40));
    const farmerLabel = this.add.text(farmStartX + 100, farmStartY - 5, '老农夫', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#90EE90',
      stroke: '#000000',
      strokeThickness: 3,
    });
    farmerLabel.setOrigin(0.5);
    farmerLabel.setDepth(Math.floor(farmStartY + 40) + 50);
    const farmerBubble = this.add.text(farmStartX + 100, farmStartY - 35, '"来种蔬菜吧！"', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
    });
    farmerBubble.setOrigin(0.5);
    farmerBubble.setDepth(Math.floor(farmStartY + 40) + 50);

    // 宝箱（农具储藏）
    const chestShadow = this.add.ellipse(farmStartX - 100, farmStartY + 48, 24, 6, 0x000000, 0.25);
    chestShadow.setDepth(Math.floor(farmStartY + 48) - 1);
    const chest = this.add.sprite(farmStartX - 100, farmStartY + 40, 'chest');
    chest.setOrigin(0.5, 1);
    chest.setScale(1.3);
    chest.setDepth(Math.floor(farmStartY + 40));

    // 农场装饰：散落的工具
    const hoe = this.add.sprite(farmStartX + 60, farmStartY + 130, 'hoe');
    hoe.setOrigin(0.5, 1);
    hoe.setScale(1.1);
    hoe.setDepth(Math.floor(farmStartY + 130));

    // ==== 散落金币 ====
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 1400;
      const y = (Math.random() - 0.5) * 1200;
      if (Math.abs(x) < 80 && Math.abs(y) < 80) continue;

      const coin = this.add.sprite(x, y, 'coin-1');
      coin.setOrigin(0.5, 1);
      coin.setScale(1.2);
      coin.setDepth(Math.floor(y));

      this.tweens.add({
        targets: coin,
        y: y - 4,
        duration: 800 + Math.random() * 400,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true,
      });

      let frameIdx = 1;
      this.time.addEvent({
        delay: 200,
        callback: () => {
          frameIdx = (frameIdx % 4) + 1;
          coin.setTexture(`coin-${frameIdx}`);
        },
        loop: true,
      });
    }

    // ==== 起点提示 ====
    const welcome = this.add.text(0, -120, '🌟 NEXISLE: BCC - 探索你的世界！', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 2, color: '#FFD700', blur: 8, fill: true },
    });
    welcome.setOrigin(0.5);
    welcome.setDepth(3000);
    this.tweens.add({
      targets: welcome,
      y: -128,
      alpha: { from: 1, to: 0.7 },
      duration: 1800,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
  }

  createParticleEffects() {
    // 漂浮的花瓣
    for (let i = 0; i < 15; i++) {
      const colors = ['flower-pink', 'flower-yellow', 'flower-purple'];
      const tex = colors[Math.floor(Math.random() * colors.length)];
      const x = (Math.random() - 0.5) * 800;
      const y = -200 - Math.random() * 400;
      const p = this.add.sprite(x, y, tex);
      p.setScale(0.5);
      p.setAlpha(0.8);
      p.setDepth(1500);
      this.tweens.add({
        targets: p,
        y: y + 800,
        x: x + (Math.random() - 0.5) * 200,
        angle: 360,
        duration: 6000 + Math.random() * 4000,
        ease: 'Sine.easeInOut',
        repeat: -1,
      });
    }
  }

  update(time: number, delta: number) {
    this.handleMovement(delta);
    this.updatePlayerAnimation(delta);

    this.playerShadow.x = this.player.x;
    this.playerShadow.y = this.player.y + 28;
    this.playerShadow.setDepth(Math.floor(this.player.y) - 1);

    this.playerAura.x = this.player.x;
    this.playerAura.y = this.player.y + 20;
    this.playerAura.setDepth(Math.floor(this.player.y) - 2);

    this.playerName.x = this.player.x;
    this.playerName.y = this.player.y - 60;
    this.playerName.setDepth(3500);

    // 确保玩家始终在最上层，不随 y 坐标变化
    this.player.setDepth(3000);
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
      const f = 0.707;
      moveX *= f;
      moveY *= f;
    }

    if (moveX !== 0 || moveY !== 0) {
      body.setVelocity(moveX * this.playerSpeed, moveY * this.playerSpeed);
      this.isMoving = true;
      this.currentDirection = newDirection;
    } else {
      this.isMoving = false;
    }

    if (!this.isMoving) {
      this.player.setTexture(`${this.characterKey}-${this.currentDirection}`);
      this.player.setFlipX(false);
    }
  }

  updatePlayerAnimation(delta: number) {
    if (this.isMoving) {
      this.animationTimer += delta;
      if (this.animationTimer > 140) {
        this.animationTimer = 0;
        this.animationFrame = (this.animationFrame + 1) % 4;
        this.player.setTexture(`${this.characterKey}-walk${this.animationFrame + 1}`);

        // 只有向左移动时翻转精灵；其他方向保持正常
        if (this.currentDirection === 'left') {
          this.player.setFlipX(true);
        } else {
          this.player.setFlipX(false);
        }
      }
    }
  }
}
