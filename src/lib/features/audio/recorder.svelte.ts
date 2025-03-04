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

			// Cleanup
			chunks = []
			recorder = null
			mediaStream?.getAudioTracks().forEach(track => {
				track.enabled = false // Mute the track
			})
			mediaStream = null
		}

		recorder.start()
	}

	async function stopRecording() {
		if (recorder) {
			recorder.stop()
		}
	}

	/**
	 * Stops the media stream and closes the microphone. Normally, I just mute the media stream track so
	 * that the next recording can start almost immediately. This method however is used to manually release the
	 * microphone and completely close all the tracks so that the app doesn't interfere with other apps that
	 * require the microphone.
	 */
	async function stopMediaStream() {
		if (mediaStream) {
			mediaStream.getTracks().forEach(track => track.stop())
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
		stopMediaStream,
	}
}
