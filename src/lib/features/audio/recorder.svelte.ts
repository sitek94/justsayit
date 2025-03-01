export function createRecorder({
	onBeforeStart,
	onStart,
	onStop,
}: {
	onBeforeStart: () => Promise<void>
	onStart: () => Promise<void>
	onStop: (audio: Blob) => Promise<void>
}) {
	let mediaStream = $state<MediaStream | null>(null)
	let recorder = $state<MediaRecorder | null>(null)

	async function startRecording() {
		await onBeforeStart()

		mediaStream = await navigator.mediaDevices.getUserMedia({audio: true})
		recorder = new MediaRecorder(mediaStream)

		let chunks: Blob[] = []

		recorder.ondataavailable = function (e) {
			chunks.push(e.data)
		}

		recorder.onstart = async () => {
			await onStart()
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
