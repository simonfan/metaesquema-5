const Tone = require('tone')

exports.conga = new Tone.MembraneSynth({
	'pitchDecay': 0.008,
	'octaves': 2,
	'envelope': {
		'attack': 0.0006,
		'decay': 0.5,
		'sustain': 0
	}
})
.toMaster()

exports.chord = new Tone.PluckSynth({
	attackNoise: 2,
	dampening: 4000,
	resonance: 0.95
})
.toMaster()

exports.chords = [
	{
		attackNoise: 1,
		dampening: 4000,
		resonance: 0.95
	},
	{
		attackNoise: 1,
		dampening: 4000,
		resonance: 1.05
	},
	{
		attackNoise: 1,
		dampening: 4000,
		resonance: 1.15
	},
	{
		attackNoise: 1,
		dampening: 4000,
		resonance: 1.25
	},
]
.map(options => {
	return new Tone.PluckSynth(options).toMaster()
})

exports.metals = [
	{
		frequency: 200,
		envelope: {
			attack: 0.001,
			decay: 1.4,
			release: 0.2
		},
		harmonicity: 5.1,
		modulationIndex: 32,
		resonance: 1000,
		octaves: 1
	},
	{
		frequency: 100,
		envelope: {
			attack: 0.001,
			decay: 1.5,
			release: 0.3
		},
		harmonicity: 5.1,
		modulationIndex: 32,
		resonance: 5000,
		octaves: 0.2
	}
].map(options => {
	let metalInstrument = new Tone.MetalSynth(options).toMaster()

	metalInstrument.volume.value = -35

	return metalInstrument
})

exports.synths = [
	{
		oscillator: {
			type: 'triangle'
		},
		envelope: {
			attack: 0.005,
			decay: 0.1,
			sustain: 0.02,
			release: 1
		}
	},
	{
		oscillator: {
			type: 'triangle'
		},
		envelope: {
			attack: 0.005,
			decay: 0.1,
			sustain: 0.05,
			release: 1
		}
	},
	{
		oscillator: {
			type: 'triangle'
		},
		envelope: {
			attack: 0.005,
			decay: 0.1,
			sustain: 0.02,
			release: 1
		}
	}
].map(options => {
	return new Tone.Synth(options).toMaster()
})

exports.polySynths = [
	0,
	1,
	2,
].map(options => {
	// var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster()
	return new Tone.PolySynth(3, Tone.Synth).toMaster()
})
