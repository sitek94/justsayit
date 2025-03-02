<script lang="ts">
	import {register, unregister} from '@tauri-apps/plugin-global-shortcut'
	import {onDestroy, onMount} from 'svelte'
	import type {Language} from '$lib/core/types'
	import {aiFormatting, type PresetName} from '$lib/features/ai-formatting'
	import type {ModelName} from '$lib/services/ai'
	import {playStartSound, playStopSound} from '$lib/services/audio/play-sound'
	import {clipboard} from '$lib/services/clipboard'
	import {fileSystem} from '$lib/services/file-system'
	import {transcription} from '$lib/services/transcription'
	import {bringMainWindowToFront} from '$lib/services/windows'
	import Visualizer from '$lib/visualizer.svelte'

	let isLoading = $state(false)
	let formatWithAi = $state(false)
	let preset = $state<PresetName>('default')
	let aiModel = $state<ModelName>('claude35Sonnet')
	let language = $state<Language>('en')
	let mediaStream = $state<MediaStream | null>(null)
	let recorder = $state<MediaRecorder | null>(null)

	onMount(() => {
		register('Control+Q', async event => {
			if (event.state === 'Released') {
				if (recorder?.state === 'recording') {
					recorder.stop()
					mediaStream = null
					recorder = null
				} else {
					await bringMainWindowToFront()

					mediaStream = await navigator.mediaDevices.getUserMedia({audio: true})

					let chunks: Blob[] = []
					recorder = new MediaRecorder(mediaStream)

					recorder.ondataavailable = function (e) {
						chunks.push(e.data)
					}

					recorder.onstart = () => {
						playStartSound()
					}

					recorder.onstop = async () => {
						playStopSound()
						isLoading = true
						const audio = new Blob(chunks, {type: recorder?.mimeType})

						let transcript = ''
						let rawTranscript = ''

						try {
							const buffer = await audio.arrayBuffer()
							rawTranscript = await transcription.transcribe(buffer, language)

							console.log(rawTranscript)

							if (formatWithAi) {
								transcript = await aiFormatting.format({
									text: rawTranscript,
									presetName: preset,
								})
							}
							await clipboard.copy(transcript || rawTranscript)
						} catch (error) {
							console.error(error)
						} finally {
							// Always save, even if AI fails. Later also handle file system errors
							await fileSystem.saveRecording({audio, transcript, raw: rawTranscript})
							isLoading = false
							chunks = []
						}
					}

					recorder.start()
				}
			}
		})
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
	{#if mediaStream}
		<Visualizer stream={mediaStream} />
	{/if}

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
