const Matter = require('matter-js')

exports.calcDistance = function (positionA, positionB) {
  // compute distance between bodies
  let distance = Matter.Vector.magnitude(
    Matter.Vector.sub(positionA, positionB)
  )

  return distance
}

exports.calcVolume = function (mic, body, options) {
  let distance = exports.calcDistance(mic.position, body.position)

  let maxDistance = options.maxDistance
  let maxVolume   = options.maxVolume - options.minVolume

  let distanceToVolumeRatio = (maxDistance - distance) / maxDistance
  return options.minVolume + (distanceToVolumeRatio * maxVolume)
}

