(function() {
  var Allie, Enemy, Explosion, GameScene, Shoot;

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
      this.miscs = new Array();
      this.lastBullet = 0;
      this.score = 0;
      this.engine = engine;
      this.master = false;
      this.playerWeapon = 2;
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
      this.speedEffect.alpha = 0.3;
      this.speedEffectBarrel.alpha = 0.3;
      this.speed = 20;
      this.playerSpeed = 15;
      this.life = 100;
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
      this.connectToServer();
      return setInterval((function(_this) {
        return function() {
          var i, len, ref, results, s;
          ref = _this.shoots;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s === void 0) {
              continue;
            }
            if (s.sprite.x < 0 || s.sprite.y > 1000) {
              s["delete"](true);
              continue;
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
      })(this), 1000);
    };

    GameScene.prototype.update = function(engine, gametime) {
      var a, e, i, j, k, l, len, len1, len2, len3, len4, m, n, ref, ref1, ref2, ref3, ref4, s, shoot;
      this.background.y += this.speed / 4;
      this.backgroundBarrel.y += this.speed / 4;
      this.speedEffect.y += this.speed * 2;
      this.speedEffectBarrel.y += this.speed * 2;
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
        switch (this.playerWeapon) {
          case 1:
            shoot = new Shoot(this, this.engine, {
              type: 1,
              x: this.player.x + 27,
              y: this.player.y + 20,
              side: false,
              net: true
            });
            break;
          case 2:
            shoot = new Shoot(this, this.engine, {
              type: 1,
              x: this.player.x + 27,
              y: this.player.y + 20,
              side: false,
              net: true
            });
            shoot = new Shoot(this, this.engine, {
              type: 3,
              x: this.player.x + 27,
              y: this.player.y + 20,
              side: false,
              offset: {
                x: 1,
                y: -20
              },
              net: true
            });
            shoot = new Shoot(this, this.engine, {
              type: 3,
              x: this.player.x + 27,
              y: this.player.y + 20,
              side: false,
              offset: {
                x: -1,
                y: -20
              },
              net: true
            });
            shoot = new Shoot(this, this.engine, {
              type: 3,
              x: this.player.x + 27,
              y: this.player.y + 20,
              side: false,
              offset: {
                x: 2,
                y: -20
              },
              net: true
            });
            shoot = new Shoot(this, this.engine, {
              type: 3,
              x: this.player.x + 27,
              y: this.player.y + 20,
              side: false,
              offset: {
                x: -2,
                y: -20
              },
              net: true
            });
        }
        this.lastBullet = gametime + 1;
      }
      ref = this.shoots;
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        if (s === void 0) {
          continue;
        }
        if (!s.active) {
          continue;
        }
        if (s.active && s.side) {
          ref1 = this.allies;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            a = ref1[j];
            if (ndgmr.checkRectCollision(a.sprite, s.sprite)) {
              a.removeLife(5);
              s["delete"]();
              continue;
            }
          }
          if (ndgmr.checkRectCollision(this.player, s.sprite)) {
            this.removeLife(5);
            s["delete"]();
            continue;
          }
        }
        ref2 = this.enemys;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          e = ref2[k];
          if (e === void 0) {
            continue;
          }
          if (e.active && !s.side) {
            if (ndgmr.checkRectCollision(e.sprite, s.sprite)) {
              e["delete"](true);
              s["delete"]();
            }
          }
        }
        s.update(gametime);
      }
      ref3 = this.enemys;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        e = ref3[l];
        if (e === void 0) {
          continue;
        }
        e.update(gametime);
      }
      ref4 = this.miscs;
      for (n = 0, len4 = ref4.length; n < len4; n++) {
        m = ref4[n];
        if (m !== void 0) {
          m.update(gametime);
        }
      }
      return this.socket.send(JSON.stringify({
        opcode: 4,
        position: {
          x: this.player.x,
          y: this.player.y
        }
      }));
    };

    GameScene.prototype.removeLife = function(pts) {
      if (this.master) {
        return this.socket.send(JSON.stringify({
          opcode: 10,
          id: this.playerId
        }));
      }
    };

    GameScene.prototype.connectToServer = function() {
      this.socket = new WebSocket("ws://172.16.15.120:3001/");
      return this.socket.onmessage = (function(_this) {
        return function(e) {
          var a, allie, data, enemy, i, j, len, len1, ref, ref1, results, results1, shoot;
          data = JSON.parse(e.data);
          switch (data.opcode) {
            case 0:
              _this.master = true;
              return console.log("Im master");
            case 1:
              _this.playerId = Math.floor((Math.random() * 987653) + 1);
              return _this.socket.send(JSON.stringify({
                opcode: 2,
                id: _this.playerId
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
              switch (data.type) {
                case 1:
                  return shoot = new Shoot(_this, _this.engine, {
                    type: data.type,
                    x: data.x,
                    y: data.y,
                    side: false,
                    offset: {
                      x: 0,
                      y: 0
                    }
                  });
                case 3:
                  return shoot = new Shoot(_this, _this.engine, {
                    type: data.type,
                    x: data.x,
                    y: data.y,
                    side: false,
                    offset: {
                      x: data.offset.x,
                      y: data.offset.y
                    }
                  });
              }
              break;
            case 9:
              enemy = new Enemy(_this, _this.engine, {
                x: data.x
              }, data.ennemi.name, {
                speed: data.ennemi.speed,
                type: data.ennemi.id_ennemie
              });
              return _this.enemys.push(enemy);
            case 10:
              _this.life = data.life;
              $("[data-life]").text(_this.life + "%");
              return $("[data-life-bar]").css('width', _this.life + "%");
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

    Allie.prototype.removeLife = function(pts) {
      if (this.scene.master) {
        return this.scene.socket.send(JSON.stringify({
          opcode: 10,
          id: this.id
        }));
      }
    };

    return Allie;

  })();

  Shoot = (function() {
    function Shoot(scene, engine1, config) {
      var instance;
      this.scene = scene;
      this.engine = engine1;
      this.config = config;
      if (this.config.visual !== void 0) {
        this.sprite = new createjs.Bitmap("assets/" + this.config.visual);
      } else {
        this.sprite = new createjs.Bitmap("assets/vulcan_1.png");
      }
      this.engine.stage.addChild(this.sprite);
      this.sprite.x = this.config.x;
      this.sprite.y = this.config.y;
      this.typeOf = this.config.type;
      this.side = this.config.side;
      this.active = true;
      this.scene.shoots.push(this);
      instance = createjs.Sound.play("shootSound1");
      instance.volume = 0.07;
      if (this.config.net) {
        if (this.typeOf === 3) {
          this.scene.socket.send(JSON.stringify({
            opcode: 6,
            type: this.typeOf,
            position: {
              x: this.sprite.x,
              y: this.sprite.y
            },
            offset: {
              x: this.config.offset.x,
              y: this.config.offset.y
            }
          }));
        } else {
          this.scene.socket.send(JSON.stringify({
            opcode: 6,
            type: this.typeOf,
            position: {
              x: this.sprite.x,
              y: this.sprite.y
            },
            offset: {
              x: 0,
              y: 0
            }
          }));
        }
      }
    }

    Shoot.prototype.update = function(gametime) {
      switch (this.typeOf) {
        case 1:
          return this.sprite.y -= 30;
        case 2:
          return this.sprite.y += 15;
        case 3:
          this.sprite.x += this.config.offset.x;
          return this.sprite.y += this.config.offset.y;
      }
    };

    Shoot.prototype["delete"] = function(fromArray) {
      if (fromArray == null) {
        fromArray = false;
      }
      this.active = false;
      this.sprite.alpha = 0;
      this.engine.stage.removeChild(this.sprite);
      if (fromArray) {
        return this.scene.shoots.splice(this.scene.shoots.indexOf(this), 1);
      }
    };

    return Shoot;

  })();

  Explosion = (function() {
    function Explosion(scene, engine1, config) {
      var f, frame, i, len, ref;
      this.scene = scene;
      this.engine = engine1;
      this.config = config;
      this.sprite = new createjs.Bitmap("assets/explosions/explosion_" + this.config.type + "_" + this.config.frames[0] + ".png");
      this.sprite.x = this.config.x;
      this.sprite.y = this.config.y;
      this.framesImage = [];
      this.currentFrame = 0;
      this.engine.stage.addChild(this.sprite);
      this.scene.miscs.push(this);
      this.lastUpdate = this.engine.gametime;
      ref = this.config.frames;
      for (i = 0, len = ref.length; i < len; i++) {
        frame = ref[i];
        this.sprite.scaleX += this.config.scale !== void 0 ? this.config.scale : 0.1;
        this.sprite.scaleY += this.config.scale !== void 0 ? this.config.scale : 0.1;
        f = new Image();
        f.src = "assets/explosions/explosion_" + this.config.type + "_" + frame + ".png";
        this.framesImage.push(f);
      }
    }

    Explosion.prototype.update = function(gametime) {
      console.log('misc');
      this.currentFrame++;
      if (this.currentFrame < this.framesImage.length) {
        return this.sprite.image = this.framesImage[this.currentFrame];
      } else {
        this.engine.stage.removeChild(this.sprite);
        return this.scene.miscs.splice(this.scene.miscs.indexOf(this), 1);
      }
    };

    return Explosion;

  })();

  Enemy = (function() {
    function Enemy(scene, engine1, position, visual, config) {
      this.scene = scene;
      this.engine = engine1;
      this.config = config;
      this.typeOf = this.config.type;
      this.sprite = new createjs.Bitmap("assets/" + visual);
      this.sprite.x = position.x;
      this.sprite.y = -100;
      this.active = true;
      this.engine.stage.addChild(this.sprite);
      this.speed = this.config.speed;
      this.lastShoot = this.engine.gametime + 30;
    }

    Enemy.prototype["delete"] = function(sound) {
      var explo, exploType, frames, instance, offset, scale;
      if (sound == null) {
        sound = false;
      }
      this.engine.stage.removeChild(this.sprite);
      this.active = false;
      this.scene.enemys.splice(this.scene.enemys.indexOf(this), 1);
      if (sound) {
        this.scene.socket.send(JSON.stringify({
          opcode: 11,
          type: this.typeOf
        }));
        exploType = 1;
        scale = 0.1;
        offset = 0;
        frames = [];
        switch (this.typeOf) {
          case 2:
            frames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
            exploType = 1;
            break;
          case 1:
            frames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
            exploType = 1;
            break;
          case 3:
            frames = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];
            exploType = 3;
            scale = 0.3;
            offset = -80;
        }
        explo = new Explosion(this.scene, this.engine, {
          frames: frames,
          speed: 5,
          x: this.sprite.x + offset,
          y: this.sprite.y + offset,
          type: exploType,
          scale: scale
        });
        instance = createjs.Sound.play("explosion");
        return instance.volume = 0.15;
      }
    };

    Enemy.prototype.update = function(gametime) {
      var a, i, len, ref, shoot;
      if (!this.active) {
        return;
      }
      if (this.typeOf === 1 || this.typeOf === 2) {
        if (this.typeOf === 2) {
          if (this.sprite.x > this.scene.player.x) {
            this.sprite.x -= 3;
          }
          if (this.sprite.x < this.scene.player.x) {
            this.sprite.x += 3;
          }
        }
        this.speed += 0.2;
        this.sprite.y += this.speed;
        if (gametime > this.lastShoot) {
          this.lastShoot = gametime + 100;
          shoot = new Shoot(this.scene, this.engine, {
            type: 2,
            x: this.sprite.x + 27,
            y: this.sprite.y + 70,
            side: true,
            visual: "plasma_1.png"
          });
        }
      } else if (this.typeOf === 3) {
        this.sprite.rotation += 5;

        /*
        if @sprite.y < 100
          @speed += 0.5
        else
          @speed -= 0.2
         */
        this.sprite.y += this.speed;
      }
      if (this.sprite.y > 1080) {
        this["delete"]();
        return;
      }
      if (ndgmr.checkRectCollision(this.scene.player, this.sprite) !== null) {
        this.scene.removeLife(5);
        this["delete"]();
        return;
      }
      ref = this.scene.allies;
      for (i = 0, len = ref.length; i < len; i++) {
        a = ref[i];
        if (ndgmr.checkRectCollision(a.sprite, this.sprite) !== null) {
          a.removeLife(5);
          this["delete"]();
          return;
        }
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
      this.lock = false;
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
      var lock;
      if (lock) {
        return;
      }
      lock = true;
      this.gametime++;
      if (this.currentScene !== null) {
        this.currentScene.update(this, this.gametime);
        this.stage.update();
        return lock = false;
      }
    };

    return NEngine;

  })();

  window.NRA.NEngine = NEngine;

}).call(this);
