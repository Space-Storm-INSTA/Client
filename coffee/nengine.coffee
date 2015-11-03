class NEngine
  constructor: (@canvas) ->
    console.log "Initialize graphic engine"
    @currentScene = null
    @stage = new createjs.Stage @canvas
    @gametime = 0
    setInterval(=>
      @process()
    , 1000 / 30);

  setScene: (scene) ->
    scene.onShow(@)
    @currentScene = scene

  process: ->
    @update()

  update: ->
    @gametime++
    if @currentScene != null
      @currentScene.update @, @gametime
      @stage.update()


window.NRA.NEngine = NEngine
