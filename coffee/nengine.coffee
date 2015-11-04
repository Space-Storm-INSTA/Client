class NEngine
  constructor: (@canvas) ->
    console.log "Initialize graphic engine"
    @currentScene = null
    @stage = new createjs.Stage @canvas
    @gametime = 0
    @lock = false
    setInterval(=>
      @process()
    , 1000 / 30);

  setScene: (scene) ->
    scene.onShow(@)
    @currentScene = scene

  process: ->
    @update()

  update: ->
    if lock then return
    lock = true
    @gametime++
    if @currentScene != null
      @currentScene.update @, @gametime
      @stage.update()
      lock = false


window.NRA.NEngine = NEngine
