<script lang="ts">
	import {getAllWebviewWindows} from '@tauri-apps/api/webviewWindow'
	import {register, unregister, isRegistered} from '@tauri-apps/plugin-global-shortcut'
	import {onDestroy, onMount} from 'svelte'
	import {ai, type AiModel} from '$lib/ai'
	import {clipboard} from '$lib/clipboard'
	import {fileSystem} from '$lib/file-system'
	import {groq} from '$lib/groq'
	import {playStartSound, playStopSound} from '$lib/play-sound'
	import {settings} from '$lib/settings'

	let canvas: HTMLCanvasElement
	let audioContext = $state<AudioContext | null>(null)
	let isLoading = $state(false)
	let formatWithAi = $state(true)
	let preset = $state<'default' | 'message' | 'note' | 'email'>('default')
	let aiModel = $state<AiModel>('claude35Sonnet')
	let language = $state<'en' | 'pl' | 'es'>('en')

	let onSuccess = async function (stream: MediaStream) {
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
			const audio = new Blob(chunks, {type: recorder.mimeType})

			let transcript = ''
			let rawTranscript = ''

			try {
				rawTranscript = await groq.transcribe(
					await audio.arrayBuffer(),
					$settings.groqApiKey,
					language,
				)

				if (formatWithAi) {
					transcript = await ai.format({
						text: rawTranscript,
						openaiApiKey: $settings.openaiApiKey,
						anthropicApiKey: $settings.anthropicApiKey,
						preset,
						model: aiModel,
						language,
					})
				}
				await clipboard.copy(transcript)
			} catch (error) {
				console.error(error)
			} finally {
				// Always save, even if AI fails. Later also handle file system errors
				await fileSystem.saveRecording({audio, transcript, raw: rawTranscript})
				isLoading = false
				chunks = []
			}
		}

		if (await isRegistered('Control+Q')) {
			unregister('Control+Q')
		}

		register('Control+Q', async event => {
			if (event.state === 'Pressed') {
				if (recorder.state === 'recording') {
					recorder.stop()
				} else {
					// `app.show() steals the focus`
					// probably I could just get a webview by its label, just experimenting for now
					const [webview] = await getAllWebviewWindows()

					webview.show()

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
			if (!canvas || !canvasCtx) return

			const WIDTH = canvas.width
			const HEIGHT = canvas.height

			requestAnimationFrame(draw)

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

	onMount(() => {
		navigator.mediaDevices.getUserMedia({audio: true}).then(onSuccess, onError)
	})

	onDestroy(() => {
		unregister('Control+Q')
	})
</script>

<div class="relative flex flex-col">
	{#if isLoading}
		<div
			data-tauri-drag-region
			class="absolute inset-0 z-10 flex items-center justify-center bg-black/75"
		>
			<p class="text-white">Loading...</p>
		</div>
	{/if}
	<canvas
		class="h-[130px] w-full"
		data-tauri-drag-region
		class:blur-lg={isLoading}
		bind:this={canvas}
	></canvas>

	<div class="flex justify-evenly bg-[#ccc] text-sm">
		<button
			class="rounded-lg bg-gray-500 px-1 text-white"
			onclick={() => (formatWithAi = !formatWithAi)}
		>
			{formatWithAi ? 'ai:on' : 'ai:off'}
		</button>

		<select bind:value={preset}>
			<option value="default">default</option>
			<option value="message">message</option>
			<option value="note">note</option>
			<option value="email">email</option>
		</select>

		<select bind:value={aiModel}>
			<option value="gpt4o">gpt4o</option>
			<option value="gpt4oMini">gpt4oMini</option>
			<option value="claude35Sonnet">claude35Sonnet</option>
			<option value="claude35Haiku">claude35Haiku</option>
		</select>

		<select bind:value={language}>
			<option value="en">en</option>
			<option value="pl">pl</option>
			<option value="es">es</option>
		</select>
	</div>
</div>
