const Matter = require('matter-js')
const Tone = require('tone')
const mousetrap = require('mousetrap')
const Metaesquema = require('metaesquema-util')

const aux = require('./lib/auxiliary')
const loadPlayers = require('./load-players')
const matterMicrophone = require('./lib/matter-microphone')

/**
 * Configure tone master
 */
Tone.Master.chain(new Tone.Limiter())



// //some overall compression to keep the levels in check
// var masterCompressor = new Tone.Compressor({
//   "threshold" : -40,
//   "ratio" : 3,
//   "attack" : 0.5,
//   "release" : 0.1
// });
// //give a little boost to the lows
// var lowBump = new Tone.Filter(200, "lowshelf");
// //route everything through the filter
// //and compressor before going to the speakers
// Tone.Master.chain(lowBump, masterCompressor);

/**
 * Matter submodules
 */
const Engine = Matter.Engine
const Render = Matter.Render
const Runner = Matter.Runner
const Body = Matter.Body
const Bodies = Matter.Bodies
const World = Matter.World
const Mouse = Matter.Mouse
const MouseConstraint = Matter.MouseConstraint
const Events = Matter.Events
const Common = Matter.Common

const MatterCollision = require('matter-collision')

function setup(options) {
  const CANVAS_WIDTH = options.canvasWidth
  const CANVAS_HEIGHT = options.canvasHeight
  let canvas = options.canvas

  if (!canvas) {
    throw new Error('canvas is required')
  }
  
  if (!CANVAS_WIDTH) {
    throw new Error('CANVAS_WIDTH is required')
  }
  
  if (!CANVAS_HEIGHT) {
    throw new Error('CANVAS_HEIGHT is required')
  }

  if (options.plugins) {
  	options.plugins.forEach(plugin => {
  		Matter.use(plugin)
  	})
  }

  // create engine
  let engine = Engine.create({
  	// enable sleeping as we are collision heavy users
  	// enableSleeping: true
  })

  engine.world.gravity.x = 0
  engine.world.gravity.y = 0

  // engine.timing.timeScale = 0.05

  // create renderer
  let render = Render.create({
  	canvas: canvas,
  	engine: engine,
  	options: {
  		wireframes: false,
      // showPositions: true,
      // showAngleIndicator: true,
  		background: '#FFFFFF',
  		pixelRatio: 1,

  		width: CANVAS_WIDTH,
  		height: CANVAS_HEIGHT,
  	}
  })
  Render.run(render)

  // create engine runner
  let runner = Metaesquema.Matter.Runner.createMixedRunner(engine)
  runner.run()

  let wallGenerator = Metaesquema.Matter.Bodies.walls({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  })

  let walls = [
    wallGenerator.top({
      label: 'CEILING',
      restitution: 1,
    }),

    wallGenerator.bottom({
      label: 'GROUND',
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
    }),

    wallGenerator.left({
      label: 'LEFT',
      isStatic: true,
      restitution: 1,
    }),

    wallGenerator.right({
      label: 'RIGHT',
      isStatic: true,
      restitution: 1,
    }),
	]

  World.add(engine.world, walls)



  /**
   * Sound bodies
   */
  options.tone.players.piano_01.start()
  options.tone.players.piano_02.start()
  options.tone.players.clave_01.start()
  options.tone.players.percussao_01.start()

  let soundBodies = [
    Bodies.circle(CANVAS_WIDTH * 1/4, CANVAS_HEIGHT / 2, 20, {
      // density: 99999999,
      label: 'piano_01',
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      render: {
        fillStyle: 'blue',
      },
      plugin: {
        sound: {
          player: options.tone.players.piano_01
        }
      }
    }),
    Bodies.circle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 20, {
      label: 'piano_02',
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      render: {
        fillStyle: 'red',
      },
      plugin: {
        sound: {
          player: options.tone.players.piano_02
        }
      }
    }),
    Bodies.circle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 20, {
      label: 'clave_01',
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      render: {
        fillStyle: 'darkred',
      },
      plugin: {
        sound: {
          player: options.tone.players.clave_01
        }
      }
    }),
    Bodies.circle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 20, {
      label: 'percussao_01',
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      render: {
        fillStyle: 'gray',
      },
      plugin: {
        sound: {
          player: options.tone.players.percussao_01
        }
      }
    }),
  ]

  let microphones = [
    matterMicrophone(CANVAS_WIDTH * 1 / 4, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2 * 3/5, CANVAS_HEIGHT * 3/5,
      {
        label: 'mic-1',
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          lineWidth: 1,
          strokeStyle: 'green'
        }
      },
      {
        soundBodies: soundBodies,
        minVolume: -100,
        maxVolume: 0,
      }
    ),
    matterMicrophone(CANVAS_WIDTH * 3 / 4, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2 * 3/5, CANVAS_HEIGHT * 3/5,
      {
        label: 'mic-2',
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          lineWidth: 1,
          strokeStyle: 'red'
        }
      },
      {
        soundBodies: soundBodies,
        minVolume: -100,
        maxVolume: 0,
      }
    ),
  ]

  World.add(engine.world, microphones)
  // let sound bodies come over microphones
  World.add(engine.world, soundBodies)





  // add mouse control
  let mouse = Mouse.create(render.canvas)
  let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      // allow bodies on mouse to rotate
      angularStiffness: 0,
      render: {
        visible: false
      }
    }
  })

  World.add(engine.world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;


  return {
  	engine: engine,
    isPlaying: false,

  	stop: function () {
      this.isPlaying = false

      runner.stop()
  	}
  }
}

loadPlayers([
  {
    name: 'piano_01',
    url: 'resources/piano_01.wav',
    loop: true,
  },
  {
    name: 'piano_02',
    url: 'resources/piano_02.wav',
    loop: true,
  },
  {
    name: 'clave_01',
    url: 'resources/clave_01.wav',
    loop: true,
  },
  {
    name: 'percussao_01',
    url: 'resources/percussao_01.wav',
    loop: true,
  },
])
.then((players) => {
  let config = {
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    canvas: document.querySelector('canvas'),
    plugins: [
      // Metaesquema.Matter.Plugins.maxVelocity({
      //   maxVelocity: 10,
      // }),
      new MatterCollision({
        collisionMomentumUpperThreshold: 1000,
      })
    ],

    tone: {
      players: players,
    }
  }

  let app = setup(config)
})



// let mousePositionElement = document.querySelector('#mouse-position')
// document.querySelector('body').addEventListener('mousemove', e => {
//   mousePositionElement.innerHTML = `${e.clientX}x${e.clientY}`
// })

// mousetrap.bind('space', (e) => {
//   app.stop()
// })
