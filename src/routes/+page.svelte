<script lang="ts">
	import {app} from '@tauri-apps/api'
	import {register, unregister} from '@tauri-apps/plugin-global-shortcut'
	import {onDestroy, onMount} from 'svelte'
	import {clipboard} from '$lib/clipboard'
	import {groq} from '$lib/groq'
	import {playStartSound, playStopSound} from '$lib/play-sound'
	import {settings} from '$lib/settings'

	let canvas: HTMLCanvasElement

	let audioContext = $state<AudioContext | null>(null)
	let transcription = $state('')
	let isLoading = $state(false)

	let onSuccess = function (stream: MediaStream) {
		const canvasCtx = canvas?.getContext('2d')
		if (!canvasCtx) return

		let chunks: Blob[] = []
		const recorder = new MediaRecorder(stream)

		visualize(stream, canvasCtx)

		recorder.ondataavailable = function (e) {
			chunks.push(e.data)
		}

		recorder.onstart = () => {
			playStartSound()
		}

		recorder.onstop = async () => {
			playStopSound()
			isLoading = true
			const blob = new Blob(chunks, {type: recorder.mimeType})
			transcription = await groq.transcribe(await blob.arrayBuffer(), $settings.groqApiKey)
			await clipboard.copy(transcription)

			isLoading = false

			chunks = []
		}

		register('Control+Q', async event => {
			if (event.state === 'Pressed') {
				if (recorder.state === 'recording') {
					recorder.stop()
				} else {
					await app.show()
					recorder.start()
				}
			}
		})
	}

	let onError = function (err: unknown) {
		console.log('The following error occured: ' + err)
	}

	function visualize(stream: MediaStream, canvasCtx: CanvasRenderingContext2D) {
		if (!audioContext) {
			audioContext = new AudioContext()
		}

		const source = audioContext.createMediaStreamSource(stream)

		const bufferLength = 2048
		const analyser = audioContext.createAnalyser()
		analyser.fftSize = bufferLength
		const dataArray = new Uint8Array(bufferLength)

		source.connect(analyser)

		draw()

		function draw() {
			if (!canvasCtx) return

			const WIDTH = canvas.width
			const HEIGHT = canvas.height

			requestAnimationFrame(draw)

			analyser.getByteTimeDomainData(dataArray)

			canvasCtx.fillStyle = 'rgb(200, 200, 200)'
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

	onMount(() => {
		navigator.mediaDevices.getUserMedia({audio: true}).then(onSuccess, onError)
	})

	onDestroy(() => {
		unregister('Control+Q')
	})
</script>

<div class="relative">
	{#if isLoading}
		<div
			data-tauri-drag-region
			class="absolute inset-0 z-10 flex items-center justify-center bg-black/75"
		>
			<p class="text-white">Loading...</p>
		</div>
	{/if}
	<canvas data-tauri-drag-region class:blur-lg={isLoading} bind:this={canvas}></canvas>
</div>
