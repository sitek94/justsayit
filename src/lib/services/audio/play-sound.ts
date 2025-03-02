import start from './sounds/start.m4a'
import stop from './sounds/stop.m4a'

export async function playStartSound() {
	const audio = new Audio(start)
	return audio.play()
}

export async function playStopSound() {
	const audio = new Audio(stop)
	return audio.play()
}
