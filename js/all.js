(function() {
  var Allie, Enemy, GameScene;

  GameScene = (function() {
    function GameScene() {}

    GameScene.prototype.onShow = function(engine) {
      var musicLoad, playerLeftModel, playerNormalModel, playerRightModel;
      this.backgroundFixed = new createjs.Bitmap("assets/background1.jpg");
      this.background = new createjs.Bitmap("assets/background1.jpg");
      this.backgroundBarrel = new createjs.Bitmap("assets/background1.jpg");
      this.speedEffect = new createjs.Bitmap("assets/speed-effect.png");
      this.speedEffectBarrel = new createjs.Bitmap("assets/speed-effect.png");
      this.shoots = new Array();
      this.enemys = new Array();
      this.allies = new Array();
      this.lastBullet = 0;
      this.score = 0;
      this.engine = engine;
      createjs.Sound.registerSound("assets/shoot-1.mp3", "shootSound1");
      createjs.Sound.registerSound("assets/explosion-1.mp3", "explosion");
      musicLoad = (function(_this) {
        return function() {
          var gameMusic;
          gameMusic = createjs.Sound.play("musicSound1");
          return gameMusic.volume = 0.10;
        };
      })(this);
      createjs.Sound.on("fileload", musicLoad, this);
      createjs.Sound.registerSound("assets/music-1.mp3", "musicSound1");
      engine.stage.addChild(this.backgroundFixed);
      engine.stage.addChild(this.background);
      engine.stage.addChild(this.backgroundBarrel);
      engine.stage.addChild(this.speedEffect);
      engine.stage.addChild(this.speedEffectBarrel);
      this.backgroundBarrel.y = -1080;
      this.speedEffectBarrel.y = -900;
      this.speedEffect.alpha = 0.4;
      this.speedEffectBarrel.alpha = 0.4;
      this.speed = 20;
      this.playerSpeed = 30;
      this.player = new createjs.Bitmap("assets/player_r_m.png");
      playerLeftModel = new Image();
      playerLeftModel.src = "assets/player_r_l1.png";
      playerRightModel = new Image();
      playerRightModel.src = "assets/player_r_r1.png";
      playerNormalModel = new Image();
      playerNormalModel.src = "assets/player_r_m.png";
      this.playerModel = {
        normal: playerNormalModel,
        left: playerLeftModel,
        right: playerRightModel
      };
      this.player.x = 1080 / 2 + 40;
      this.player.y = 550;
      engine.stage.addChild(this.player);
      this.playerMovements = {
        right: false,
        left: false,
        up: false,
        down: false,
        shoot: false
      };
      keyboardJS.bind('right', (function(_this) {
        return function(e) {
          return _this.playerMovements.right = true;
        };
      })(this), (function(_this) {
        return function() {
          return _this.playerMovements.right = false;
        };
      })(this));
      keyboardJS.bind('left', (function(_this) {
        return function(e) {
          return _this.playerMovements.left = true;
        };
      })(this), (function(_this) {
        return function() {
          return _this.playerMovements.left = false;
        };
      })(this));
      keyboardJS.bind('up', (function(_this) {
        return function(e) {
          return _this.playerMovements.up = true;
        };
      })(this), (function(_this) {
        return function() {
          return _this.playerMovements.up = false;
        };
      })(this));
      keyboardJS.bind('down', (function(_this) {
        return function(e) {
          return _this.playerMovements.down = true;
        };
      })(this), (function(_this) {
        return function() {
          return _this.playerMovements.down = false;
        };
      })(this));
      keyboardJS.bind('space', (function(_this) {
        return function(e) {
          return _this.playerMovements.shoot = true;
        };
      })(this), (function(_this) {
        return function() {
          return _this.playerMovements.shoot = false;
        };
      })(this));
      return this.connectToServer();
    };

    GameScene.prototype.update = function(engine, gametime) {
      var e, i, instance, j, k, len, len1, len2, ref, ref1, ref2, s, shootBmp;
      this.background.y += this.speed;
      this.backgroundBarrel.y += this.speed;
      this.speedEffect.y += this.speed * 5;
      this.speedEffectBarrel.y += this.speed * 5;
      if (this.backgroundBarrel.y >= 1080) {
        this.backgroundBarrel.y = -1080;
      }
      if (this.background.y >= 1080) {
        this.background.y = -1080;
      }
      if (this.speedEffect.y >= 1080) {
        this.speedEffect.y = -1080;
        this.speedEffect.x = Math.floor((Math.random() * 600) + -600);
      }
      if (this.speedEffectBarrel.y >= 1080) {
        this.speedEffectBarrel.y = -1080;
        this.speedEffectBarrel.x = Math.floor((Math.random() * 600) + -600);
      }
      if (this.playerMovements.right) {
        this.player.x += this.playerSpeed;
        this.player.image = this.playerModel.right;
      }
      if (this.playerMovements.left) {
        this.player.x += -this.playerSpeed;
        this.player.image = this.playerModel.left;
      }
      if (!this.playerMovements.right && !this.playerMovements.left) {
        this.player.image = this.playerModel.normal;
      }
      if (this.playerMovements.up) {
        this.player.y += -this.playerSpeed;
        this.speed += 2;
      }
      if (this.player.y < 550) {
        this.player.y += this.playerSpeed / 2;
        this.speed -= 1;
      }
      if (this.playerMovements.shoot && this.lastBullet < gametime) {
        this.lastBullet = gametime + 5;
        shootBmp = new createjs.Bitmap("assets/vulcan_1.png");
        engine.stage.addChild(shootBmp);
        shootBmp.x = this.player.x + 27;
        shootBmp.y = this.player.y + 20;
        this.shoots.push(shootBmp);
        instance = createjs.Sound.play("shootSound1");
        instance.volume = 0.07;
        this.socket.send(JSON.stringify({
          opcode: 6,
          type: 1,
          position: {
            x: shootBmp.x,
            y: shootBmp.y
          }
        }));
      }
      ref = this.shoots;
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        ref1 = this.enemys;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          e = ref1[j];
          if (e.active) {
            if (ndgmr.checkRectCollision(e.sprite, s)) {
              e["delete"](true);
              engine.stage.removeChild(s);
            }
          }
        }
        s.y += -30;
      }
      ref2 = this.enemys;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        e = ref2[k];
        e.update(gametime);
      }
      return this.socket.send(JSON.stringify({
        opcode: 4,
        position: {
          x: this.player.x,
          y: this.player.y
        }
      }));
    };

    GameScene.prototype.connectToServer = function() {
      this.socket = new WebSocket("ws://172.16.15.56:3000/");
      return this.socket.onmessage = (function(_this) {
        return function(e) {
          var a, allie, data, enemy, i, instance, j, len, len1, ref, ref1, results, results1, shootBmp;
          data = JSON.parse(e.data);
          switch (data.opcode) {
            case 1:
              return _this.socket.send(JSON.stringify({
                opcode: 2,
                id: Math.floor((Math.random() * 987653) + 1)
              }));
            case 3:
              allie = new Allie(_this, _this.engine, data.id);
              return _this.allies.push(allie);
            case 4:
              ref = _this.allies;
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                a = ref[i];
                if (a.id === data.id) {
                  a.sprite.x = data.x;
                  results.push(a.sprite.y = data.y);
                } else {
                  results.push(void 0);
                }
              }
              return results;
              break;
            case 5:
              console.log("Remove player " + data.id);
              ref1 = _this.allies;
              results1 = [];
              for (j = 0, len1 = ref1.length; j < len1; j++) {
                a = ref1[j];
                if (a.id === data.id) {
                  results1.push(a["delete"]());
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
              break;
            case 7:
              console.log("Missile");
              switch (data.type) {
                case 1:
                  shootBmp = new createjs.Bitmap("assets/vulcan_1.png");
                  _this.engine.stage.addChild(shootBmp);
                  shootBmp.x = data.x;
                  shootBmp.y = data.y;
                  _this.shoots.push(shootBmp);
                  instance = createjs.Sound.play("shootSound1");
                  return instance.volume = 0.07;
              }
              break;
            case 9:
              console.log("New ennemie");
              enemy = new Enemy(_this, _this.engine, {
                x: data.x
              }, data.ennemi.name, {
                speed: data.ennemi.speed
              });
              return _this.enemys.push(enemy);
          }
        };
      })(this);
    };

    return GameScene;

  })();

  Allie = (function() {
    function Allie(scene, engine1, id) {
      this.scene = scene;
      this.engine = engine1;
      this.id = id;
      console.log("New player " + this.id + " joined the game");
      this.sprite = new createjs.Bitmap("assets/player_b_m.png");
      this.engine.stage.addChild(this.sprite);
    }

    Allie.prototype["delete"] = function() {
      this.engine.stage.removeChild(this.sprite);
      return this.scene.allies.splice(this.scene.allies.indexOf(this), 1);
    };

    return Allie;

  })();

  Enemy = (function() {
    function Enemy(scene, engine1, position, visual, config) {
      this.scene = scene;
      this.engine = engine1;
      this.config = config;
      this.sprite = new createjs.Bitmap("assets/" + visual);
      this.sprite.x = position.x;
      this.sprite.y = -100;
      this.active = true;
      this.engine.stage.addChild(this.sprite);
      this.speed = this.config.speed;
      console.log(this.speed);
    }

    Enemy.prototype["delete"] = function(sound) {
      var instance;
      if (sound == null) {
        sound = false;
      }
      this.engine.stage.removeChild(this.sprite);
      this.active = false;
      if (sound) {
        instance = createjs.Sound.play("explosion");
        return instance.volume = 0.05;
      }
    };

    Enemy.prototype.update = function(gametime) {
      if (!this.active) {
        return;
      }
      this.speed += 0.5;
      this.sprite.y += this.speed;
      if (this.sprite.y > 1080) {
        this["delete"]();
      }
      if (ndgmr.checkRectCollision(this.scene.player, this.sprite) !== null) {
        return this["delete"]();
      }
    };

    return Enemy;

  })();

  window.NRA.GameScene = GameScene;

}).call(this);

(function() {
  var Main;

  Main = (function() {
    function Main() {
      this.version = "1.0.0";
    }

    Main.prototype.init = function() {
      console.log("Initialize InstaRage " + this.version);
      document.getElementById("game").height = window.innerHeight;
      document.getElementById("game").width = window.innerWidth;
      this.engine = new NRA.NEngine("game");
      return this.engine.setScene(new NRA.GameScene());
    };

    return Main;

  })();

  $((function(_this) {
    return function() {
      return setTimeout(function() {
        var main;
        main = new Main();
        return main.init();
      }, 500);
    };
  })(this));

}).call(this);

(function() {
  var NEngine;

  NEngine = (function() {
    function NEngine(canvas) {
      this.canvas = canvas;
      console.log("Initialize graphic engine");
      this.currentScene = null;
      this.stage = new createjs.Stage(this.canvas);
      this.gametime = 0;
      setInterval((function(_this) {
        return function() {
          return _this.process();
        };
      })(this), 1000 / 30);
    }

    NEngine.prototype.setScene = function(scene) {
      scene.onShow(this);
      return this.currentScene = scene;
    };

    NEngine.prototype.process = function() {
      return this.update();
    };

    NEngine.prototype.update = function() {
      this.gametime++;
      if (this.currentScene !== null) {
        this.currentScene.update(this, this.gametime);
        return this.stage.update();
      }
    };

    return NEngine;

  })();

  window.NRA.NEngine = NEngine;

}).call(this);
