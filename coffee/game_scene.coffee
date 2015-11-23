class GameScene
  getUrlGet: () ->
    get = []
    if window.location.href.indexOf('?') >= 0
      for mesGets in window.location.href.split('?')[1].split('&')
        get.push {name:mesGets.split('=')[0], value:mesGets.split('=')[1]}
    return get
    #id=3&token=342423423432
  onShow: (engine) ->
    @backgroundFixed = new createjs.Bitmap("assets/background1.jpg")
    @background = new createjs.Bitmap("assets/background1.jpg")
    @backgroundBarrel = new createjs.Bitmap("assets/background1.jpg")
    @speedEffect = new createjs.Bitmap("assets/speed-effect.png")
    @speedEffectBarrel = new createjs.Bitmap("assets/speed-effect.png")
    @shoots = new Array()
    @enemys = new Array()
    @allies = new Array()
    @miscs = new Array()
    @lastBullet = 0
    @score = 0
    @exp = 0
    @engine = engine
    @master = false
    @playerWeapon = 1
    @urlGet = @getUrlGet()
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
    @speedEffect.alpha = 0.3
    @speedEffectBarrel.alpha = 0.3
    @speed = 20
    @playerSpeed = 15
    @life = 100
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

    setInterval(=>
      for s in @shoots
        if s == undefined then continue
        if not s.active
          s.deleteArray()
          continue
    , 1000)

  update: (engine, gametime) ->
    #console.log "Misc : #{@miscs.length}, Shoots : #{@shoots.length}, Ennemys : #{@enemys.length}"
    @background.y += @speed / 4
    @backgroundBarrel.y += @speed/ 4
    @speedEffect.y += @speed * 2
    @speedEffectBarrel.y += @speed * 2
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
      if @player.x < 1080
        @player.x += @playerSpeed
        @player.image = @playerModel.right
    if @playerMovements.left
      if @player.x > 0
        @player.x += -@playerSpeed
        @player.image = @playerModel.left
    if not @playerMovements.right and not @playerMovements.left
      @player.image = @playerModel.normal
    if @playerMovements.up
      if @player.y > 150
        @player.y += -@playerSpeed
        @speed += 2
    if @player.y < 550
      @player.y += @playerSpeed / 2
      @speed -= 1

    # Shoot
    if @playerMovements.shoot and @lastBullet < gametime
      switch @playerWeapon
        when 1
          shoot = new Shoot(@, @engine, { type: 1, x: @player.x + 27, y: @player.y + 20, side: false, net: true })
        when 2
          shoot = new Shoot(@, @engine, { type: 1, x: @player.x + 27, y: @player.y + 20, side: false, net: true })
          shoot = new Shoot(@, @engine, { type: 3, x: @player.x + 27, y: @player.y + 20, side: false, offset: { x: 1, y: -20 }, net: true })
          shoot = new Shoot(@, @engine, { type: 3, x: @player.x + 27, y: @player.y + 20, side: false, offset: { x: -1, y: -20 }, net: true })
          shoot = new Shoot(@, @engine, { type: 3, x: @player.x + 27, y: @player.y + 20, side: false, offset: { x: 2, y: -20 }, net: true })
          shoot = new Shoot(@, @engine, { type: 3, x: @player.x + 27, y: @player.y + 20, side: false, offset: { x: -2, y: -20 }, net: true })
          shoot = new Shoot(@, @engine, { type: 3, x: @player.x + 27, y: @player.y + 20, side: false, offset: { x: 4, y: -20 }, net: true })
          shoot = new Shoot(@, @engine, { type: 3, x: @player.x + 27, y: @player.y + 20, side: false, offset: { x: -4, y: -20 }, net: true })
          shoot = new Shoot(@, @engine, { type: 3, x: @player.x + 27, y: @player.y + 20, side: false, offset: { x: 6, y: -20 }, net: true })
          shoot = new Shoot(@, @engine, { type: 3, x: @player.x + 27, y: @player.y + 20, side: false, offset: { x: -6, y: -20 }, net: true })


      @lastBullet = gametime + 5

    for s in @shoots
      if s == undefined then continue
      s.update(gametime)
      if not s.active then continue
      if s.active and s.side
        for a in @allies
          if ndgmr.checkRectCollision(a.sprite, s.sprite)
            a.removeLife(5)
            s.delete()
            continue
        if ndgmr.checkRectCollision(@player, s.sprite)
          @removeLife(5)
          s.delete()
          continue
      for e in @enemys
        if e == undefined then continue
        if e.active and not s.side
          if ndgmr.checkRectCollision(e.sprite, s.sprite)
            e.takeDamage()
            #e.delete(true)
            s.delete()

    # Enemys
    for e in @enemys
      if e == undefined then continue
      e.update gametime

    # Miscs
    for m in @miscs
      if m != undefined
        m.update gametime

    # Synchro server
    @socket.send(JSON.stringify({
        opcode: 4
        position: { x: @player.x, y: @player.y }
      }))

  removeLife: (type) ->
    if @master
      @socket.send(JSON.stringify({
          opcode: 10
          id: @playerId
          type: type
        }))

  getAllie: (id) ->
    console.log id
    for a in @allies
      if a.id == id then return a

  connectToServer: ->
    @socket = new WebSocket "ws://5.196.69.227:3001/"
    @socket.onmessage = (e) =>
      data = JSON.parse(e.data)
      switch data.opcode
        when 0
          @master = true
          console.log "Im master"
        when 1 # Welcome
          @playerId = 0
          for get in @urlGet
            if get.name is "token"
              @playerId = get.value
          @socket.send(JSON.stringify({
              opcode: 2
              token: @playerId
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
          switch data.type
            when 1 # Missile classique
              shoot = new Shoot(@, @engine,
                {
                  type: data.type,
                  x: data.x,
                  y: data.y,
                  side: false,
                  offset: {x: 0, y: 0}
                })
            when 3
              shoot = new Shoot(@, @engine,
                {
                  type: data.type,
                  x: data.x,
                  y: data.y,
                  side: false,
                  offset: {x: data.offset.x, y: data.offset.y}
                })
        when 9 # Ennemie
          enemy = new Enemy(@, @engine, { x : data.x}, data.ennemi.name,
            { speed: data.ennemi.speed, type: data.ennemi.id_ennemie, life: data.ennemi.life })
          @enemys.push enemy
        when 10 # life
          @life = data.life
          $("[data-life]").text @life + "%"
          $("[data-life-bar]").css('width', @life + "%");
          if data.dead
            @speed = 20
            frames = ["01", "02", "03", "04", "05", "06" , "07", "08", "09", "10"]
            exploType = 1
            scale = 0.4
            offset = -80
            x = @player.x
            y = @player.y
            for i in [0..5]
              setTimeout(=>
                instance = createjs.Sound.play("explosion")
                instance.volume = 0.15
                explo = new Explosion(@, @engine,
                  {
                    frames: frames, speed: 5,
                    x: x + Math.floor((Math.random() * 50) + 0),
                    y: y + Math.floor((Math.random() * 50) + 0),
                    type: exploType,
                    scale: scale
                  })
              , i * 200)
            @player.x = 1080 / 2 + 40
            @player.y = 550
        when 13
          console.log "Received text"
          partie = data.partie
          $("#bigtext").show()
          $("#bigtext").animate { opacity: 1 }, 2000
          $("#bigtext").css 'color', data.color
          $("#bigtext").html partie
          console.log 'Text : ' + partie
          setTimeout(=>
            $("#bigtext").animate { opacity: 0 }, 2000
          , 5000)
        when 12, 21
          $("[data-exp]").html data.exp + " points - level #{data.level}"
          $("[data-exp-bar]").css('width', (100 * data.exp / data.maxexp) + "%")
          $("[data-score]").html "#{data.score} points global"

        when 20 # Player dead
          console.log "player dead"
          frames = ["01", "02", "03", "04", "05", "06" , "07", "08", "09", "10"]
          exploType = 1
          scale = 0.4
          offset = -80
          a = @getAllie(data.playerDead)
          x = a.sprite.x
          y = a.sprite.y
          for i in [0..5]
            setTimeout(=>
              instance = createjs.Sound.play("explosion")
              instance.volume = 0.15
              explo = new Explosion(@, @engine,
                {
                  frames: frames, speed: 5,
                  x: x + Math.floor((Math.random() * 50) + 0),
                  y: y + Math.floor((Math.random() * 50) + 0),
                  type: exploType,
                  scale: scale
                })
            , i * 200)
        when 22 #bonus
          @playerWeapon = data.arme
          setTimeout =>
            @playerWeapon = 1
          , data.Mseconde
      #console.log data

class Allie
  constructor: (@scene, @engine, @id) ->
    console.log "New player #{@id} joined the game"
    @sprite = new createjs.Bitmap("assets/player_b_m.png")
    @engine.stage.addChild @sprite

  delete: ->
    @engine.stage.removeChild @sprite
    @scene.allies.splice(@scene.allies.indexOf(@), 1)

  removeLife: (pts) ->
    if @scene.master
      @scene.socket.send(JSON.stringify({
          opcode: 10
          id: @id
        }))

class Shoot
  constructor: (@scene, @engine, @config) ->
    if @config.visual != undefined
      @sprite = new createjs.Bitmap("assets/" + @config.visual)
    else
      @sprite = new createjs.Bitmap("assets/vulcan_1.png")
    @engine.stage.addChild @sprite
    @sprite.x = @config.x
    @sprite.y = @config.y
    @typeOf = @config.type
    @side = @config.side
    @active = true
    @scene.shoots.push @
    instance = createjs.Sound.play("shootSound1")
    instance.volume = 0.07
    if @config.net
      if @typeOf == 3
        @scene.socket.send(JSON.stringify({
            opcode: 6
            type: @typeOf
            position: { x: @sprite.x, y: @sprite.y }
            offset: { x: @config.offset.x, y: @config.offset.y }
          }))
      else
        @scene.socket.send(JSON.stringify({
            opcode: 6
            type: @typeOf
            position: { x: @sprite.x, y: @sprite.y }
            offset: { x: 0, y: 0 }
          }))

  update: (gametime) ->
    if @sprite.y > 1080
      @active = false
    if @sprite.y < 0
      @active = false
    switch @typeOf
      when 1 # Normal shoot
        @sprite.y -= 30
      when 2 # Shoot down
        @sprite.y += 15
      when 3 # Yolo
        @sprite.x += @config.offset.x
        @sprite.y += @config.offset.y

  deleteArray: ->
    @scene.shoots.splice(@scene.shoots.indexOf(@), 1)

  delete: (fromArray = false)->
    @active = false
    @sprite.alpha = 0
    @engine.stage.removeChild @sprite
    if fromArray
      @scene.shoots.splice(@scene.shoots.indexOf(@), 1)

class Explosion
  constructor: (@scene, @engine, @config) ->
    @sprite = new createjs.Bitmap("assets/explosions/explosion_#{@config.type}_#{@config.frames[0]}.png")
    @sprite.x = @config.x
    @sprite.y = @config.y
    @framesImage = []
    @currentFrame = 0
    @engine.stage.addChild @sprite
    @scene.miscs.push @
    @lastUpdate = @engine.gametime
    for frame in @config.frames
      @sprite.scaleX += if @config.scale != undefined then @config.scale else 0.1
      @sprite.scaleY += if @config.scale != undefined then @config.scale else 0.1
      f = new Image()
      f.src = "assets/explosions/explosion_#{@config.type}_#{frame}.png"
      @framesImage.push(f)

  update: (gametime) ->
    @currentFrame++
    if @currentFrame < @framesImage.length
      @sprite.image = @framesImage[@currentFrame]
    else
      @engine.stage.removeChild @sprite
      @scene.miscs.splice(@scene.miscs.indexOf(@), 1)

class Enemy
  constructor: (@scene, @engine, position, visual, @config) ->
    @typeOf = @config.type
    @sprite = new createjs.Bitmap("assets/" + visual)
    @sprite.x = position.x;
    @sprite.y = -100
    @active = true
    @engine.stage.addChild @sprite
    @speed = @config.speed
    @lastShoot = @engine.gametime + 30
    @life = @config.life
    @cache = { direction: false }
    if @typeOf == 4
      @sprite.scaleX = 2
      @sprite.scaleY = 2

  delete: (sound = false) ->
    @engine.stage.removeChild @sprite
    @active = false
    @scene.enemys.splice(@scene.enemys.indexOf(@), 1)
    if sound
      @scene.socket.send(JSON.stringify({
          opcode: 11
          type: @typeOf
        }))
      exploType = 1
      scale = 0.1
      offset = 0
      frames = []
      switch @typeOf
        when 2
          frames = ["01", "02", "03", "04", "05", "06" , "07", "08", "09", "10"]
          exploType = 1
        when 1
          frames = ["01", "02", "03", "04", "05", "06" , "07", "08", "09", "10"]
          exploType = 1
        when 4
          frames = ["01", "02", "03", "04", "05", "06" , "07", "08", "09"]
          exploType = 3
          scale = 0.3
          offset = -80
          for i in [0..10]
            setTimeout(=>
              instance = createjs.Sound.play("explosion")
              instance.volume = 0.30
              explo = new Explosion(@scene, @engine,
                {
                  frames: frames, speed: 5,
                  x: @sprite.x + Math.floor((Math.random() * 50) + 0),
                  y: @sprite.y + Math.floor((Math.random() * 50) + 0),
                  type: exploType,
                  scale: scale
                })
            , i * 200)
        when 3
          frames = ["01", "02", "03", "04", "05", "06" , "07", "08", "09"]
          exploType = 3
          scale = 0.3
          offset = -80
      explo = new Explosion(@scene, @engine,
        {
          frames: frames, speed: 5,
          x: @sprite.x + offset,
          y: @sprite.y + offset,
          type: exploType,
          scale: scale
        })
      instance = createjs.Sound.play("explosion")
      instance.volume = 0.15

  takeDamage: (pt = 1) ->
    if @typeOf == 4 or @typeOf == 6
      frames = ["01", "02", "03", "04", "05", "06" , "07", "08", "09"]
      exploType = 3
      scale = 0
      offset = Math.floor((Math.random() * 50) + 0)
      explo = new Explosion(@scene, @engine,
        {
          frames: frames, speed: 5,
          x: @sprite.x + offset,
          y: @sprite.y + offset,
          type: exploType,
          scale: scale
        })
      instance = createjs.Sound.play("explosion")
      instance.volume = 0.15
    @life -= 1
    if @life <= 0
      @delete(true)

  update: (gametime) ->
    if not @active then return
    if(@typeOf == 1 or @typeOf == 2)
      if @typeOf == 2
        if @sprite.x > @scene.player.x
          @sprite.x -= 3
        if @sprite.x < @scene.player.x
          @sprite.x += 3
      @speed += 0.2
      @sprite.y += @speed
      if gametime > @lastShoot
        @lastShoot = gametime + 100
        shoot = new Shoot(@scene, @engine,
          { type: 2, x: @sprite.x + 27, y: @sprite.y + 70, side: true, visual: "plasma_1.png" })
    else if(@typeOf == 3)
      @sprite.rotation += 5
      ###
      if @sprite.y < 100
        @speed += 0.5
      else
        @speed -= 0.2
      ###
      @sprite.y += @speed
    else if (@typeOf == 6)
      @sprite.rotation += 5
      @sprite.y += @speed
      if gametime > @lastShoot
        @lastShoot = gametime + Math.floor((Math.random() * 15) + 3)
        shoot = new Shoot(@scene, @engine, { type: 2, x: @sprite.x + 60, y: @sprite.y + 120, side: true, net: true })

    else if(@typeOf == 4)
      if gametime > @lastShoot
        @lastShoot = gametime + Math.floor((Math.random() * 15) + 3)
        shoot = new Shoot(@scene, @engine, { type: 2, x: @sprite.x + 60, y: @sprite.y + 120, side: true, net: true })
        shoot = new Shoot(@scene, @engine, { type: 3, x: @sprite.x + 60, y: @sprite.y + 120, side: true, offset: { x: 3, y: 20 }, net: true })
        shoot = new Shoot(@scene, @engine, { type: 3, x: @sprite.x + 60, y: @sprite.y + 120, side: true, offset: { x: -3, y: 20 }, net: true })
        shoot = new Shoot(@scene, @engine, { type: 3, x: @sprite.x + 60, y: @sprite.y + 120, side: true, offset: { x: 6, y: 20 }, net: true })
        shoot = new Shoot(@scene, @engine, { type: 3, x: @sprite.x + 60, y: @sprite.y + 120, side: true, offset: { x: -6, y: 20 }, net: true })
      if @sprite.y < 50
        @speed += 0.2
        @sprite.y += @speed
      else
        if @cache.direction
          @sprite.x -= @speed
          if @sprite.x < 100
            @cache.direction = false
        else
          @sprite.x += @speed
          if @sprite.x > 1080
            @cache.direction = true
    else if(@typeOf == 8)
      #@sprite.rotation += 5
      ###
      if @sprite.y < 100
        @speed += 0.5
      else
        @speed -= 0.2
      ###
      @sprite.y += @speed

    if @sprite.y > 1080
      @delete()
      return
    if ndgmr.checkRectCollision(@scene.player, @sprite) != null and @typeOf != 4
      @scene.removeLife @typeOf
      @delete()
      return
    for a in @scene.allies
      if ndgmr.checkRectCollision(a.sprite, @sprite) != null and @typeOf != 4
        a.removeLife 5
        @delete()
        return
      #console.log 'Enemy delete'



window.NRA.GameScene = GameScene
