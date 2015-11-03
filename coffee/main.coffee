class Main
    constructor: ->
      @version = "1.0.0"

    init: ->
      console.log "Initialize InstaRage #{@version}"
      document.getElementById("game").height = window.innerHeight
      document.getElementById("game").width = window.innerWidth
      @engine = new NRA.NEngine("game")
      @engine.setScene(new NRA.GameScene())


$ =>
  setTimeout(->
    main = new Main()
    main.init()
  , 500)
