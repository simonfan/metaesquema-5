const Matter = require('matter-js')
const Bodies = Matter.Bodies

const Tone = require('tone')

const deepmerge = require('deepmerge')

const aux = require('../auxiliary')

function _isSoundBody(body) {
	return body.plugin && body.plugin.sound && body.plugin.sound.player
}

function _maxVertexDistance(body) {
	return body.vertices.reduce((res, vertex) => {
    let distance = aux.calcDistance(body.position, vertex)
    return distance > res ? distance : res
  }, 0)
}

function matterMicrophone(x, y, width, height, options, microphoneOptions) {
	options = options || {}
	microphoneOptions = microphoneOptions || {}
	microphoneOptions.soundBodies = microphoneOptions.soundBodies || []

	const DEFAULT_MICROPHONE_OPTIONS = {
		isSensor: true,
		plugin: {
			microphone: {
				microphones: {},
			},
			collision: {
				start: (collision) => {
					let self = collision.self
					let other = collision.other
					let mic = self.plugin.microphone.microphones[other.id]

					if (!_isSoundBody(other) || !mic) {
						return
					}

					// other.plugin.sound.player.connect(
					// 	mic.volumeNode
					// )
					// mic.volumeNode.volume.value = aux.calcVolume(
					// 	self,
					// 	other,
					// 	{
					// 		minVolume: microphoneOptions.minVolume || -20,
					// 		maxVolume: microphoneOptions.maxVolume || 0,
					// 		maxDistance: self.plugin.microphone.maxVertexDistance +
					// 								 (other.plugin.sound.maxVertexDistance || 0)
					// 	}
					// )
					

					other.plugin.sound.player.connect(
						mic.reverbNode
					)

					mic.reverbNode.roomSize = aux.calcVolume(
						self,
						other,
						{
							minVolume: 0,
							maxVolume: .5,
							maxDistance: self.plugin.microphone.maxVertexDistance +
													 (other.plugin.sound.maxVertexDistance || 0)
						}
					)


				},

				active: (collision) => {
	        let self = collision.self
	        let other = collision.other
	        let mic = self.plugin.microphone.microphones[other.id]

					if (!_isSoundBody(other) || !mic) {
						return
					}

       //    mic.volumeNode.volume.value = aux.calcVolume(
       //      self,
       //      other,
       //      {
							// minVolume: microphoneOptions.minVolume || -20,
							// maxVolume: microphoneOptions.maxVolume || 0,
							// maxDistance: self.plugin.microphone.maxVertexDistance +
							// 						 (other.plugin.sound.maxVertexDistance || 0)
       //      }
       //    )

       //    console.log(`${self.label} ${other.label}: ${mic.volumeNode.volume.value}`)


					mic.reverbNode.roomSize.value = (1 - aux.calcVolume(
						self,
						other,
						{
							minVolume: 0,
							maxVolume: .5,
							maxDistance: self.plugin.microphone.maxVertexDistance +
													 (other.plugin.sound.maxVertexDistance || 0)
						}
					))
          console.log(`${self.label} ${other.label}: ${mic.reverbNode.roomSize.value}`)

				},
	      end: (collision) => {
	        let self = collision.self
	        let other = collision.other
	        let mic = self.plugin.microphone.microphones[other.id]

					if (!_isSoundBody(other) || !mic) {
						return
					}

          // collision.other.plugin.sound.player.disconnect(
          //   mic.volumeNode
          // )

          collision.other.plugin.sound.player.disconnect(
            mic.reverbNode
          )
	      }
			}
		}
	}

	options = deepmerge(DEFAULT_MICROPHONE_OPTIONS, options)

	/**
	 * For each sound body, create a microphone for that body,
	 * so that multiple bodies can have multiple volumes.
	 */
	microphoneOptions.soundBodies.forEach(body => {

		if (!_isSoundBody(body)) {
			console.warn('invalid sound body', body)
			return
		}

		/**
		 * Calculate the most distant vertex of the given body
		 * and store it
		 */
    body.plugin.sound.maxVertexDistance = body.vertices.reduce((res, vertex) => {
      let distance = aux.calcDistance(body.position, vertex)
      return distance > res ? distance : res
    }, 0)

    /**
     * Microphonate it
     */
		options.plugin.microphone.microphones[body.id] = {
			volumeNode: new Tone.Volume().toMaster(),
			reverbNode: new Tone.Freeverb(0).toMaster(),
		}
	})


	let microphoneBody = Bodies.rectangle(x, y, width, height, options)

	microphoneBody.plugin.microphone.maxVertexDistance = _maxVertexDistance(microphoneBody)

	return microphoneBody
}

module.exports = matterMicrophone
