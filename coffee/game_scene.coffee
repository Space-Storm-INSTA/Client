class GameScene
  onShow: (engine) ->
    @backgroundFixed = new createjs.Bitmap("assets/background1.jpg")
    @background = new createjs.Bitmap("assets/background1.jpg")
    @backgroundBarrel = new createjs.Bitmap("assets/background1.jpg")
    @speedEffect = new createjs.Bitmap("assets/speed-effect.png")
    @speedEffectBarrel = new createjs.Bitmap("assets/speed-effect.png")
    @shoots = new Array()
    @enemys = new Array()
    @allies = new Array()
    @lastBullet = 0
    @score = 0
    @engine = engine

    # Musics
    createjs.Sound.registerSound("assets/shoot-1.mp3", "shootSound1")
    createjs.Sound.registerSound("assets/explosion-1.mp3", "explosion")
    musicLoad = =>
      gameMusic = createjs.Sound.play("musicSound1");
      gameMusic.volume = 0.10;
    createjs.Sound.on("fileload", musicLoad, this);
    createjs.Sound.registerSound("assets/music-1.mp3", "musicSound1")

    engine.stage.addChild @backgroundFixed
    engine.stage.addChild @background
    engine.stage.addChild @backgroundBarrel
    engine.stage.addChild @speedEffect
    engine.stage.addChild @speedEffectBarrel
    @backgroundBarrel.y = -1080
    @speedEffectBarrel.y = -900
    @speedEffect.alpha = 0.4
    @speedEffectBarrel.alpha = 0.4
    @speed = 20
    @playerSpeed = 30
    #Player
    @player = new createjs.Bitmap("assets/player_r_m.png")
    playerLeftModel = new Image()
    playerLeftModel.src = "assets/player_r_l1.png"
    playerRightModel = new Image()
    playerRightModel.src = "assets/player_r_r1.png"
    playerNormalModel = new Image()
    playerNormalModel.src = "assets/player_r_m.png"
    @playerModel = {
      normal: playerNormalModel
      left: playerLeftModel
      right: playerRightModel
    }
    @player.x = 1080 / 2 + 40
    @player.y = 550
    engine.stage.addChild @player

    #Input
    @playerMovements = { right: false, left: false, up : false, down: false, shoot: false }
    keyboardJS.bind 'right', (e) =>
      @playerMovements.right = true
    , =>
      @playerMovements.right = false
    keyboardJS.bind 'left', (e) =>
      @playerMovements.left = true
    , =>
      @playerMovements.left = false
    keyboardJS.bind 'up', (e) =>
      @playerMovements.up = true
    , =>
      @playerMovements.up = false
    keyboardJS.bind 'down', (e) =>
      @playerMovements.down = true
    , =>
      @playerMovements.down = false
    keyboardJS.bind 'space', (e) =>
      @playerMovements.shoot = true
    , =>
      @playerMovements.shoot = false
    @connectToServer()

  update: (engine, gametime) ->
    @background.y += @speed
    @backgroundBarrel.y += @speed
    @speedEffect.y += @speed * 5
    @speedEffectBarrel.y += @speed * 5
    if @backgroundBarrel.y >= 1080 then @backgroundBarrel.y = -1080
    if @background.y >= 1080 then @background.y = -1080
    if @speedEffect.y >= 1080
       @speedEffect.y = -1080
       @speedEffect.x = Math.floor((Math.random() * 600) + -600);
    if @speedEffectBarrel.y >= 1080
       @speedEffectBarrel.y = -1080
       @speedEffectBarrel.x = Math.floor((Math.random() * 600) + -600);

    # Movements

    if @playerMovements.right
      @player.x += @playerSpeed
      @player.image = @playerModel.right
    if @playerMovements.left
      @player.x += -@playerSpeed
      @player.image = @playerModel.left
    if not @playerMovements.right and not @playerMovements.left
      @player.image = @playerModel.normal
    if @playerMovements.up
      @player.y += -@playerSpeed
      @speed += 2
    #if @playerMovements.down
      #@speed -= 2
    if @player.y < 550
      @player.y += @playerSpeed / 2
      @speed -= 1

    # Shoot
    if @playerMovements.shoot and @lastBullet < gametime
      @lastBullet = gametime + 5
      shootBmp = new createjs.Bitmap("assets/vulcan_1.png")
      engine.stage.addChild shootBmp
      shootBmp.x = @player.x + 27
      shootBmp.y = @player.y + 20
      @shoots.push shootBmp
      instance = createjs.Sound.play("shootSound1")
      instance.volume = 0.07
      @socket.send(JSON.stringify({
          opcode: 6
          type: 1
          position: { x: shootBmp.x, y: shootBmp.y }
        }))

    for s in @shoots
      for e in @enemys
        if e.active
          if ndgmr.checkRectCollision(e.sprite, s)
            e.delete(true)
            engine.stage.removeChild s
      s.y += -30

    # Enemys
    #if gametime % 5 == 0
      # Enemy
      #enemy = new Enemy(@, engine)
      #@enemys.push enemy
    for e in @enemys
      e.update gametime

    # Synchro server
    @socket.send(JSON.stringify({
        opcode: 4
        position: { x: @player.x, y: @player.y }
      }))

  connectToServer: ->
    @socket = new WebSocket("ws://172.16.15.56:3000/");
    @socket.onmessage = (e) =>
      data = JSON.parse(e.data)
      switch data.opcode
        when 1 # Welcome
          @socket.send(JSON.stringify({
              opcode: 2
              id: Math.floor((Math.random() * 987653) + 1)
            }))
        when 3 # New player incoming
          allie = new Allie(@, @engine, data.id)
          @allies.push allie
        when 4 #  Update position
          for a in @allies
            if a.id == data.id
              a.sprite.x = data.x
              a.sprite.y = data.y
        when 5 # Remove player
          console.log "Remove player #{data.id}"
          for a in @allies
            if a.id == data.id
              a.delete()
        when 7 # Missile
          console.log "Missile"
          switch data.type
            when 1 # Missile classique
              shootBmp = new createjs.Bitmap("assets/vulcan_1.png")
              @engine.stage.addChild shootBmp
              shootBmp.x = data.x
              shootBmp.y = data.y
              @shoots.push shootBmp
              instance = createjs.Sound.play("shootSound1")
              instance.volume = 0.07
        when 9 # Ennemie
          console.log "New ennemie"
          enemy = new Enemy(@, @engine, { x : data.x}, data.ennemi.name, { speed: data.ennemi.speed })
          @enemys.push enemy
      #console.log data

class Allie
  constructor: (@scene, @engine, @id)->
    console.log "New player #{@id} joined the game"
    @sprite = new createjs.Bitmap("assets/player_b_m.png")
    @engine.stage.addChild @sprite

  delete: ->
    @engine.stage.removeChild @sprite
    @scene.allies.splice(@scene.allies.indexOf(@), 1)

class Enemy
  constructor: (@scene, @engine, position, visual, @config) ->
    @sprite = new createjs.Bitmap("assets/" + visual)
    @sprite.x = position.x;
    @sprite.y = -100
    @active = true
    @engine.stage.addChild @sprite
    @speed = @config.speed
    console.log @speed

  delete: (sound = false) ->
    @engine.stage.removeChild @sprite
    # @scene.enemys.remove @
    @active = false
    if sound
      instance = createjs.Sound.play("explosion")
      instance.volume = 0.05

  update: (gametime) ->
    if not @active then return
    @speed += 0.5
    @sprite.y += @speed
    #if @sprite.x > @scene.player.x
    #  @sprite.x -= 3
    #if @sprite.x < @scene.player.x
    #  @sprite.x += 3
    if @sprite.y > 1080
      @delete()
    if ndgmr.checkRectCollision(@scene.player, @sprite) != null
      @delete()
      #console.log 'Enemy delete'



window.NRA.GameScene = GameScene
