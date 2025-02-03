<script lang="ts">
	import {register, unregister} from '@tauri-apps/plugin-global-shortcut'
	import {onDestroy, onMount} from 'svelte'

	export let onRecordingComplete: (audioBlob: Blob) => void

	let isRecording = false
	let canvas: HTMLCanvasElement

	// Refs equivalents
	let mediaRecorder: MediaRecorder | null = null
	const chunks: Blob[] = []
	let audioContext: AudioContext | null = null
	let analyser: AnalyserNode | null = null
	let bufferLength = 0
	let animationFrameId = -1

	const getPos = (Hz: number, minHz: number, maxHz: number, max: number): number => {
		if (Hz > minHz) {
			return ((Math.log10(Hz) - Math.log10(minHz)) * max) / (Math.log10(maxHz) - Math.log10(minHz))
		}
		return 0
	}

	const getFFTbars = (fft: AnalyserNode, barCount: number, minHz = 20, maxHz = 12000): number[] => {
		const dataArray = new Float32Array(bufferLength)
		fft.getFloatFrequencyData(dataArray)
		const out: number[] = []

		for (let i = 0; i < dataArray.length; i++) {
			const pos = Math.round(getPos((i * 24000) / dataArray.length, minHz, maxHz, barCount))
			if (pos < barCount) {
				if (!out[pos] || out[pos] < dataArray[i]) out[pos] = dataArray[i]
			}
		}

		for (let i = 0; i < barCount; i++) {
			if (!out[i]) {
				let prevIndex = 0
				let prevValue = 0

				if ((prevIndex = i - 1) < 0) {
					prevIndex = 0
					prevValue = 0
				} else {
					prevValue = out[prevIndex]
				}

				let nextIndex = 0
				let nextValue = 0

				for (let k = i; k < barCount; k++) {
					if (out[k]) {
						nextIndex = k
						nextValue = out[k]
						break
					}
				}

				if (!nextIndex) {
					nextIndex = barCount - 1
					nextValue = 0
				}

				out[i] = prevValue + (nextValue - prevValue) / (nextIndex - prevIndex)
			}
		}

		return out
	}

	const draw = () => {
		const canvasCtx = canvas?.getContext('2d')
		if (!canvas || !canvasCtx || !analyser) return

		const bars = getFFTbars(analyser, 72)
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
		canvasCtx.fillStyle = 'rgb(255, 255, 255)'
		canvasCtx.beginPath()

		for (let i = 0; i < bars.length; i++) {
			canvasCtx.rect(
				i * 10,
				canvas.height - ((bars[i] + 64) * (canvas.height / 2)) / 64,
				8,
				canvas.height,
			)
		}

		canvasCtx.fill()
	}

	const startVisualization = async () => {
		if (isRecording) return

		try {
			audioContext = new window.AudioContext()
			const stream = await navigator.mediaDevices.getUserMedia({audio: true})

			// Audio capture
			chunks.length = 0
			mediaRecorder = new MediaRecorder(stream)
			mediaRecorder.ondataavailable = e => {
				if (e.data.size > 0) chunks.push(e.data)
			}
			mediaRecorder.start()

			// Visualization
			const source = audioContext.createMediaStreamSource(stream)
			analyser = audioContext.createAnalyser()
			analyser.fftSize = 4096
			analyser.smoothingTimeConstant = 0.95
			bufferLength = analyser.frequencyBinCount
			source.connect(analyser)

			const animate = () => {
				draw()
				animationFrameId = requestAnimationFrame(animate)
			}
			animationFrameId = requestAnimationFrame(animate)

			isRecording = true
		} catch (error) {
			console.error('Error initializing audio visualization:', error)
		}
	}

	const stopVisualization = () => {
		if (!isRecording) return

		// Stop media recording and collect data
		if (mediaRecorder) {
			mediaRecorder.stop()
			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(chunks, {type: 'audio/webm'})
				onRecordingComplete?.(audioBlob)
				chunks.length = 0
			}
		}

		// Cleanup
		cancelAnimationFrame(animationFrameId)
		audioContext?.close()
		canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)

		isRecording = false
	}

	onMount(() => {
		register('Control+Q', event => {
			if (event.state === 'Pressed') {
				if (isRecording) stopVisualization()
				else startVisualization()
			}
		})
	})

	onDestroy(() => {
		if (isRecording) stopVisualization()

		unregister('Control+Q')
	})
</script>

<div>
	<div>
		<canvas bind:this={canvas} width={720} height={400}></canvas>
	</div>
	<div class="inline-flex gap-2">
		<button
			class="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
			on:click={startVisualization}
			disabled={isRecording}
		>
			Start Microphone Visualization
		</button>
		<button
			class="rounded-md bg-red-500 px-4 py-2 text-white disabled:opacity-50"
			on:click={stopVisualization}
			disabled={!isRecording}
		>
			Stop Visualization
		</button>
	</div>
</div>
