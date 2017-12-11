exports.loadAudio = function (audioSrc) {

	return new Promise((resolve, reject) => {
		let audio = new Audio(audioSrc)

		audio.addEventListener('error', e => reject)
		audio.addEventListener('canplaythrough', e => {
			audio.removeEventListener('error', reject)
			resolve(audio)
		})
	})
}
