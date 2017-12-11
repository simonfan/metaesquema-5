const clone = require('clone')

function MatterCollisionStyles(options) {

}

MatterCollisionStyles.prototype.name = 'matter-collision-styles' // PLUGIN_NAME
MatterCollisionStyles.prototype.version = '0.0.0' // PLUGIN_VERSION
MatterCollisionStyles.prototype.for = 'matter-js@^0.12.0'

MatterCollisionStyles.prototype.install = function (Matter) {


	this.Matter = Matter

	let self = this

  this.Matter.after('Body.create', function () {
    self.initBody(this)
  })

  this.Matter.after('Engine.create', function () {
  	self.initEngine(this)
  })
}

MatterCollisionStyles.prototype.initBody = function (body) {
	body.plugin.collisionStyles = body.plugin.collisionStyles || {}

	let defaults = {
		start: clone(body.render),
		active: clone(body.render),
		end: clone(body.render),
		original: clone(body.render),
	}

	body.plugin.collisionStyles = Object.assign({}, defaults, body.plugin.collisionStyles)
}

MatterCollisionStyles.prototype.initEngine = function (engine) {

  // an example of using collisionStart event on an engine
  this.Matter.Events.on(engine, 'collisionStart', event => {
    let pairs = event.pairs

    pairs.forEach(pair => {
    	Object.assign(pair.bodyA.render, pair.bodyA.plugin.collisionStyles.start)
    	Object.assign(pair.bodyB.render, pair.bodyB.plugin.collisionStyles.start)
    })
  })

  // an example of using collisionActive event on an engine
  this.Matter.Events.on(engine, 'collisionActive', event => {
    let pairs = event.pairs

    // change object colours to show those in an active collision (e.g. resting contact)
    pairs.forEach(pair => {
    	Object.assign(pair.bodyA.render, pair.bodyA.plugin.collisionStyles.active)
    	Object.assign(pair.bodyB.render, pair.bodyB.plugin.collisionStyles.active)
    })
  });

  // an example of using collisionEnd event on an engine
  this.Matter.Events.on(engine, 'collisionEnd', event => {
    let pairs = event.pairs

    // change object colours to show those ending a collision
    pairs.forEach(pair => {
    	Object.assign(pair.bodyA.render, pair.bodyA.plugin.collisionStyles.end)
    	Object.assign(pair.bodyB.render, pair.bodyB.plugin.collisionStyles.end)
    })
  })

}

module.exports = MatterCollisionStyles
