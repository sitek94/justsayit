type RecorderParams = {
	onStart: () => void
	onStop: (audio: Blob) => Promise<void>
}

export function createRecorder({onStart, onStop}: RecorderParams) {
	let mediaStream = $state<MediaStream | null>(null)
	let recorder = $state<MediaRecorder | null>(null)
	// This function will create and return a MediaRecorder
	// along with methods to control it

	async function startRecording() {
		mediaStream = await navigator.mediaDevices.getUserMedia({audio: true})
		recorder = new MediaRecorder(mediaStream)

		let chunks: Blob[] = []

		recorder.ondataavailable = function (e) {
			chunks.push(e.data)
		}

		recorder.onstart = () => {
			onStart()
		}

		recorder.onstop = async () => {
			const audio = new Blob(chunks, {type: recorder?.mimeType})

			await onStop(audio)

			// Clean up
			chunks = []
			recorder = null
			mediaStream = null
		}

		recorder.start()
	}

	async function stopRecording() {
		if (recorder) {
			recorder.stop()
		}
	}

	return {
		// State
		get mediaStream() {
			return mediaStream
		},

		get isRecording() {
			return recorder?.state === 'recording'
		},

		// Actions
		startRecording,
		stopRecording,
	}
}
