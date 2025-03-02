<!-- src/lib/components/AudioVisualizer.svelte -->
<script lang="ts">
	import {onDestroy} from 'svelte'

	// Props
	export let stream: MediaStream

	// Local state
	let canvas: HTMLCanvasElement
	let audioContext: AudioContext | null = null
	let analyser: AnalyserNode | null = null
	let animationId: number | null = null

	$: if (canvas && stream) {
		setupVisualization()
	}

	function setupVisualization() {
		const canvasCtx = canvas?.getContext('2d')
		if (!canvasCtx) return

		if (!audioContext) {
			audioContext = new AudioContext()
		}

		const source = audioContext.createMediaStreamSource(stream)

		const bufferLength = 2048
		analyser = audioContext.createAnalyser()
		analyser.fftSize = bufferLength
		const dataArray = new Uint8Array(bufferLength)

		source.connect(analyser)

		draw()

		function draw() {
			if (!canvas || !canvasCtx || !analyser) return

			const WIDTH = canvas.width
			const HEIGHT = canvas.height

			animationId = requestAnimationFrame(draw)

			analyser.getByteTimeDomainData(dataArray)

			canvasCtx.fillStyle = '#ccc'
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

			canvasCtx.lineWidth = 2
			canvasCtx.strokeStyle = 'rgb(0, 0, 0)'

			canvasCtx.beginPath()

			let sliceWidth = (WIDTH * 1.0) / bufferLength
			let x = 0

			for (let i = 0; i < bufferLength; i++) {
				let v = dataArray[i] / 128.0
				let y = (v * HEIGHT) / 2

				if (i === 0) {
					canvasCtx.moveTo(x, y)
				} else {
					canvasCtx.lineTo(x, y)
				}

				x += sliceWidth
			}

			canvasCtx.lineTo(canvas.width, canvas.height / 2)
			canvasCtx.stroke()
		}
	}

	onDestroy(() => {
		if (animationId !== null) {
			cancelAnimationFrame(animationId)
		}

		if (audioContext) {
			// Close the audio context when component is destroyed
			audioContext.close()
		}
	})
</script>

<canvas class="h-[130px] w-full" data-tauri-drag-region bind:this={canvas}></canvas>
